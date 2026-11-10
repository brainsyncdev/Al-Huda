import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, BookOpen, Clock, ArrowRight } from "lucide-react";
import { JOURNEYS, getJourney } from "@/lib/study-journeys/data";
import { getDimension } from "@/lib/explore/dimensions";
import { getTopic } from "@/lib/topics/data";
import { getAyah, getSurah } from "@/lib/quran/data";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB } from "@/lib/seo/json-ld";
import { JourneyProgressTracker } from "./progress-tracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return JOURNEYS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const journey = getJourney(slug);
  if (!journey) return {};
  return {
    title: `Study Journey: ${journey.title}`,
    description: journey.summary,
    alternates: { canonical: absoluteUrl(`/study-journeys/${journey.slug}`) },
    openGraph: {
      title: `${journey.title} — Study Journey`,
      description: journey.summary,
      url: absoluteUrl(`/study-journeys/${journey.slug}`),
      type: "website",
      siteName: SITE_NAME,
    },
  };
}

export default async function StudyJourneyDetailPage({ params }: Props) {
  const { slug } = await params;
  const journey = getJourney(slug);
  if (!journey) return notFound();

  const dimension = getDimension(journey.dimensionId);

  // Resolve prerequisites
  const prerequisites = journey.prerequisites
    .map((s) => getJourney(s))
    .filter((j): j is NonNullable<typeof j> => Boolean(j));

  // Resolve stages with their topics and ayat
  const resolvedStages = journey.stages.map((stage) => {
    const topic = stage.topicSlug ? getTopic(stage.topicSlug) : null;
    const ayah = stage.ref ? getAyah(stage.ref.surah, stage.ref.ayah) : null;
    const surah = stage.ref ? getSurah(stage.ref.surah) : null;
    return { stage, topic, ayah, surah };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: journey.title,
    description: journey.summary,
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
    },
  };

  const crumbs = [
    HOME_CRUMB,
    { name: "Study Journeys", path: "/study-journeys" },
    { name: journey.title, path: `/study-journeys/${journey.slug}` },
  ];

  return (
    <div className="space-y-8 pb-8">
      <JsonLd nodes={[jsonLd]} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {crumbs.map((crumb, i) => (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {crumb.path ? (
                <Link href={crumb.path} className="hover:text-foreground">
                  {crumb.name}
                </Link>
              ) : (
                <span>{crumb.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <header className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {journey.title}
          </h1>
          <span className="arabic-display text-3xl text-gold" lang="ar" dir="rtl">
            {journey.arabicTitle}
          </span>
        </div>
        <p className="max-w-prose text-muted-foreground">{journey.summary}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {dimension && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
              <BookOpen className="h-4 w-4" />
              {dimension.title}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1">
            {journey.difficulty}
          </span>
          {journey.estimatedMinutes && (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {journey.estimatedMinutes} min
            </span>
          )}
        </div>
      </header>

      <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Pending Scholarly Review</p>
            <p>
              This journey is marked pending-scholarly-review. Objectives and
              reflection prompts are editorial starting points, not authoritative
              interpretations. Nothing here is tafsir.
            </p>
          </div>
        </div>
      </aside>

      {prerequisites.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Prerequisites
          </h2>
          <ul className="flex flex-wrap gap-2">
            {prerequisites.map((prereq) => (
              <li key={prereq.slug}>
                <Link
                  href={`/study-journeys/${prereq.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-3 py-1.5 text-sm hover:border-primary/30 hover:bg-secondary/40"
                >
                  {prereq.title}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <JourneyProgressTracker journeySlug={journey.slug} />

      <section aria-labelledby="stages-heading" className="space-y-4">
        <h2 id="stages-heading" className="font-display text-xl font-semibold tracking-tight">
          Stages
        </h2>
        <ol className="space-y-4">
          {resolvedStages.map(({ stage, topic, ayah, surah }) => (
            <li
              key={stage.order}
              className="rounded-2xl border border-border/80 bg-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {stage.order}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-display text-lg font-semibold tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {stage.objective}
                  </p>
                  {stage.ref && ayah && surah && (
                    <div className="text-sm">
                      <Link
                        href={`/ayah/${stage.ref.surah}/${stage.ref.ayah}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {surah.transliteration} {stage.ref.surah}:{stage.ref.ayah}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                  {topic && (
                    <div className="text-sm">
                      <Link
                        href={`/topics/${topic.slug}`}
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        Topic: {topic.title}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}
                  {stage.reflectionPrompt && (
                    <div className="mt-3 rounded-xl bg-secondary/40 p-3 text-sm italic text-muted-foreground">
                      <span className="font-medium not-italic">Reflect:</span>{" "}
                      {stage.reflectionPrompt}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Provenance: method &ldquo;{journey.provenance.method}&rdquo;, curated by{" "}
          {journey.provenance.curator}, last reviewed{" "}
          {journey.provenance.reviewedAt}, status{" "}
          {journey.provenance.status}. Version {journey.version}.
        </p>
      </div>
    </div>
  );
}
