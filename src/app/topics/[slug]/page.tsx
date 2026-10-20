import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { TopicAyahCard } from "@/components/topics/topic-ayah-card";
import { getAyah, getSurah } from "@/lib/quran/data";
import type { AyahRef } from "@/lib/quran/types";
import {
  LANGUAGE_LABELS,
  TOPICS,
  getTopic,
  relationProvenance,
} from "@/lib/topics/data";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs, topicJsonLd } from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return {
    title: `Topic: ${topic.title}`,
    description: topic.summary,
    alternates: { canonical: absoluteUrl(`/topics/${topic.slug}`) },
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return notFound();

  const related = topic.related
    .map((s) => getTopic(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // Resolve every curated reference against the pinned dataset up front. A
  // relation whose ayah does not exist is reported on the page rather than
  // silently skipped, so the visible count can never overstate what the
  // editorial selection actually contains.
  const resolved: {
    relation: (typeof topic.relations)[number];
    verse: NonNullable<ReturnType<typeof getAyah>>;
    surah: NonNullable<ReturnType<typeof getSurah>>;
  }[] = [];
  const unresolved: { ref: AyahRef; type: string }[] = [];

  for (const relation of topic.relations) {
    const verse = getAyah(relation.ref.surah, relation.ref.ayah);
    const surah = getSurah(relation.ref.surah);
    if (!verse || !surah) {
      unresolved.push({ ref: relation.ref, type: relation.type });
      continue;
    }
    resolved.push({ relation, verse, surah });
  }

  const topicPagePath = `/topics/${topic.slug}`;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Topics", path: "/topics" },
            { name: topic.title, path: topicPagePath },
          ]),
          topicJsonLd(topic),
        ]}
      />

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="arabic-display text-4xl text-gold" lang="ar" dir="rtl">
            {topic.arabicTitle}
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {topic.title}
          </h1>
        </div>
        <p className="max-w-prose text-muted-foreground">{topic.summary}</p>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>
              Review status: {topic.provenance.status.replace(/-/g, " ")} — curated by {topic.provenance.curator} via {topic.provenance.method} (last pass {topic.provenance.reviewedAt}). Editorial content language: {LANGUAGE_LABELS[topic.language] ?? topic.language} ({topic.language}); the Quran text itself is always Arabic and is rendered verbatim from the pinned dataset. Editorial selections are not tafsir and are not intended as rulings.
            </span>
          </p>
        </div>
      </header>

      <section aria-label="Verses on this topic" className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {resolved.length} of {topic.relations.length} curated verses shown
        </p>

        {unresolved.length > 0 && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <p>
              {unresolved.length} curated reference{unresolved.length === 1 ? "" : "s"} on
              this topic could not be resolved against the pinned Quran dataset
              and {unresolved.length === 1 ? "is" : "are"} therefore not shown:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs">
              {unresolved.map((r) => (
                <li key={`${r.ref.surah}:${r.ref.ayah}`}>
                  {r.ref.surah}:{r.ref.ayah} — {r.type}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs">
              This is a data-integrity problem in the editorial selection, not a
              missing verse. It is surfaced rather than silently dropped so the
              count above is never overstated.
            </p>
          </div>
        )}

        {resolved.map(({ relation, verse, surah }) => (
          <TopicAyahCard
            key={`${relation.ref.surah}:${relation.ref.ayah}`}
            ayah={verse}
            surahTransliteration={surah.transliteration}
            type={relation.type}
            rationale={relation.rationale}
            provenance={relationProvenance(relation, topic)}
            provenanceScope={relation.provenance ? "relation" : "topic"}
          />
        ))}
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-topics" className="space-y-4">
          <h2
            id="related-topics"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Related topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="rounded-2xl border border-border/80 bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
              >
                <span className="arabic-display mr-2 text-lg text-gold" lang="ar" dir="rtl">
                  {t.arabicTitle}
                </span>
                {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FR-073: state the provenance model readers are looking at — including
          that every relation currently inherits the topic-level record because
          no relation has been individually reviewed yet. */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Provenance: each verse above shows its effective review record — a
          relation with no individual review inherits the topic-level record
          (status, curator, method, last pass) displayed at the top. No
          relation on this topic has an individual review record yet. All
          displayed text originates from the source catalog listed on this
          site. No AI-generated exegesis is presented as scripture.
        </p>
      </div>
    </div>
  );
}
