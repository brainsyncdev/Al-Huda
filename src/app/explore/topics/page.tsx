import Link from "next/link";
import type { Metadata } from "next";
import { TOPICS, getTopic } from "@/lib/topics/data";
import { getDimensionsForTopic } from "@/lib/explore/dimensions";
import { getTopicDomainRelations } from "@/lib/taxonomy/domain-topics";
import { getDomain } from "@/lib/taxonomy/domains";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { AlertTriangle, BookOpen, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Topics — Curated Quranic Themes",
  description:
    "Discover the Quran through 18 curated topics. Each topic groups well-known verses by theme with editorial provenance and review status.",
  alternates: { canonical: absoluteUrl("/explore/topics") },
};

export default function ExploreTopicsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Explore Topics — Curated Quranic Themes",
    description:
      "Discover the Quran through 18 curated topics. Each topic groups well-known verses by theme with editorial provenance and review status.",
    url: absoluteUrl("/explore/topics"),
    inLanguage: ["en", "ar"],
  };

  // Sort topics by relation count (most curated first)
  const sortedTopics = [...TOPICS].sort(
    (a, b) => b.relations.length - a.relations.length
  );

  return (
    <div className="space-y-8 pb-8">
      <JsonLd data={jsonLd} />

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <Tag className="h-8 w-8 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore Topics
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Discover the Quran through {TOPICS.length} curated topics. Each topic
          groups well-known verses by theme with editorial provenance and review
          status. Topics are entry points for reflection, not tafsir.
        </p>

        <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              All topics are marked pending-scholarly-review. Each verse
              selection carries its editorial method, curator, review date, and
              status. This is not tafsir and not a scholarly classification.
            </span>
          </p>
        </aside>
      </header>

      <section aria-labelledby="topics-grid-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2
            id="topics-grid-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            All Topics ({TOPICS.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Sorted by verse count
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTopics.map((topic) => {
            const dimensions = getDimensionsForTopic(topic.slug);
            const domainRels = getTopicDomainRelations(topic.slug);
            const domains = domainRels
              .map((r) => getDomain(r.domainId))
              .filter((d): d is NonNullable<typeof d> => Boolean(d));

            return (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <span
                    className="arabic-display text-2xl text-gold"
                    lang="ar"
                    aria-hidden
                  >
                    {topic.arabicTitle}
                  </span>
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {topic.summary}
                </p>

                <div className="mt-auto pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {topic.relations.length} verse
                      {topic.relations.length === 1 ? "" : "s"}
                    </span>
                    <span className="text-primary font-medium group-hover:underline">
                      Explore →
                    </span>
                  </div>

                  {dimensions.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dimensions.slice(0, 2).map((dim) => (
                        <span
                          key={dim.id}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
                        >
                          {dim.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {domains.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {domains.slice(0, 2).map((domain) => (
                        <span
                          key={domain.id}
                          className="inline-flex items-center rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {domain.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          About Topic Curation
        </h2>
        <p className="text-sm text-muted-foreground">
          Each topic is an editorial selection of well-known ayat — entry points
          for reflection. Every verse relation is typed (thematic association,
          lexical match, cross-reference, or sequential context) with a neutral
          rationale explaining why it's included. Topics are not tafsir and not
          rulings.
        </p>
        <p className="text-sm text-muted-foreground">
          Topics connect to dimensions (navigation aids) and domains
          (organizational proposals). Each relationship carries its own
          provenance and review status.
        </p>
      </section>

      <aside className="rounded-2xl border border-border/80 bg-muted/30 p-5 text-sm text-muted-foreground">
        <p>
          Looking for structured learning? Try{" "}
          <Link
            href="/study-journeys"
            className="text-primary hover:underline font-medium"
          >
            Study Journeys
          </Link>
          , which organize topics and ayat into sequenced learning experiences.
        </p>
      </aside>
    </div>
  );
}
