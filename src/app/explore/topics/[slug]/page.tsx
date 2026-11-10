// /explore/topics/[slug] — Topic detail page with contextual navigation.
//
// Sprint 53 Workstream C: Enhanced navigation between dimensions, domains,
// topics, ayat, and study journeys.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Compass,
  FolderTree,
  Map,
  Tag,
} from "lucide-react";
import { getTopic, TOPICS, RELATION_TYPE_LABELS } from "@/lib/topics/data";
import {
  getAllDimensionsForTopic,
  getAllDomainsForTopic,
  getJourneysForTopic,
  getDimensionUrl,
  getDomainUrl,
  getJourneyUrl,
  getTopicUrl,
} from "@/lib/topics/navigation";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);

  if (!topic) {
    return {
      title: "Topic not found · Al-Huda",
      robots: { index: false },
    };
  }

  return {
    title: `${topic.title} (${topic.arabicTitle}) · Explore Topics · Al-Huda`,
    description: topic.summary,
    alternates: { canonical: absoluteUrl(`/explore/topics/${slug}`) },
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic(slug);

  if (!topic) {
    notFound();
  }

  const allDimensions = getAllDimensionsForTopic(slug);
  const allDomains = getAllDomainsForTopic(slug);
  const relatedJourneys = getJourneysForTopic(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: topic.title,
    description: topic.summary,
    url: absoluteUrl(`/explore/topics/${slug}`),
    inLanguage: [topic.language, "ar"],
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <JsonLd nodes={[jsonLd]} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/explore"
              className="hover:text-primary transition-colors"
            >
              Explore
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link
              href="/explore/topics"
              className="hover:text-primary transition-colors"
            >
              Topics
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="text-foreground">{topic.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {topic.title}
            </h1>
            <p
              className="arabic-display text-2xl text-gold"
              lang="ar"
              aria-label={`Arabic title: ${topic.arabicTitle}`}
            >
              {topic.arabicTitle}
            </p>
          </div>
          <Tag className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground">
          {topic.summary}
        </p>

        {/* Review status notice */}
        <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Pending scholarly review.</strong> This topic is an
              editorial selection of well-known ayat — entry points for
              reflection, not tafsir. Each verse relation carries its editorial
              method, curator, review date, and status.
            </span>
          </p>
        </aside>
      </header>

      {/* Contextual navigation */}
      <section
        aria-labelledby="context-nav"
        className="rounded-2xl border border-border/80 bg-card p-5 space-y-4"
      >
        <h2
          id="context-nav"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Explore this topic in context
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Dimension navigation */}
          {allDimensions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Compass className="h-4 w-4 text-primary" aria-hidden />
                <span>
                  {allDimensions.length === 1
                    ? "Dimension"
                    : `Dimensions (${allDimensions.length})`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allDimensions.map((dim) => (
                  <Link
                    key={dim.id}
                    href={getDimensionUrl(dim.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                  >
                    {dim.title}
                    <span
                      className="arabic-display text-xs"
                      lang="ar"
                      aria-hidden
                    >
                      {dim.arabicTitle}
                    </span>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Dimensions are navigation aids grouping related topics.
              </p>
            </div>
          )}

          {/* Domain navigation */}
          {allDomains.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FolderTree className="h-4 w-4 text-primary" aria-hidden />
                <span>
                  {allDomains.length === 1
                    ? "Domain"
                    : `Domains (${allDomains.length})`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allDomains.map((domain) => (
                  <Link
                    key={domain.id}
                    href={getDomainUrl(domain.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
                  >
                    {domain.title}
                    {domain.arabicTitle && (
                      <span
                        className="arabic-display text-xs"
                        lang="ar"
                        aria-hidden
                      >
                        {domain.arabicTitle}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Domains are organizational proposals pending review.
              </p>
            </div>
          )}
        </div>

        {/* Study journeys */}
        {relatedJourneys.length > 0 && (
          <div className="space-y-2 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Map className="h-4 w-4 text-primary" aria-hidden />
              <span>
                Related study journey
                {relatedJourneys.length === 1 ? "" : "s"} (
                {relatedJourneys.length})
              </span>
            </div>
            <div className="space-y-2">
              {relatedJourneys.map((journey) => (
                <Link
                  key={journey.slug}
                  href={getJourneyUrl(journey.slug)}
                  className="block rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:bg-secondary/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {journey.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {journey.summary}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {journey.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Curated ayat */}
      <section aria-labelledby="ayat-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="ayat-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Curated ayat ({topic.relations.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Editorial selection, not exhaustive
          </p>
        </div>

        <div className="space-y-3">
          {topic.relations.map((relation, index) => {
            const surahNum = relation.ref.surah;
            const ayahNum = relation.ref.ayah;
            const relationTypeLabel = RELATION_TYPE_LABELS[relation.type];

            return (
              <article
                key={`${surahNum}:${ayahNum}-${index}`}
                className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-secondary/30"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {relationTypeLabel}
                      </p>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {relation.rationale}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                      Pending review
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-3">
                    <p className="text-xs text-muted-foreground">
                      Surah {surahNum}, Ayah {ayahNum}
                    </p>
                    <Link
                      href={`/ayah/${surahNum}/${ayahNum}?from=topic&topic=${slug}`}
                      className="shrink-0 rounded-lg border border-border/80 bg-card px-3 py-1 text-xs font-medium transition-colors hover:bg-secondary/50"
                    >
                      View ayah →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Related topics */}
      {topic.related.length > 0 && (
        <section aria-labelledby="related-topics" className="space-y-3">
          <h2
            id="related-topics"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Related topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {topic.related.map((relatedSlug) => {
              const relatedTopic = TOPICS.find((t) => t.slug === relatedSlug);
              if (!relatedTopic) return null;
              return (
                <Link
                  key={relatedSlug}
                  href={getTopicUrl(relatedSlug)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
                >
                  {relatedTopic.title}
                  <span
                    className="arabic-display text-xs"
                    lang="ar"
                    aria-hidden
                  >
                    {relatedTopic.arabicTitle}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Provenance */}
      <section className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p className="mb-2">
          <strong className="text-foreground">Editorial provenance:</strong>{" "}
          {topic.provenance.method}
        </p>
        <p>
          Curated by {topic.provenance.curator} · Last reviewed{" "}
          {topic.provenance.reviewedAt} · Status:{" "}
          {topic.provenance.status.replace(/-/g, " ")}
        </p>
      </section>

      {/* Back navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-6">
        <Link
          href="/explore/topics"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all topics
        </Link>
        <Link
          href="/explore"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Explore home
        </Link>
      </div>
    </div>
  );
}
