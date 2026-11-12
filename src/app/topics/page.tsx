import Link from "next/link";
import { TOPICS } from "@/lib/topics/data";
import { TopicGraph } from "@/components/topics/topic-graph";
import { absoluteUrl } from "@/lib/site";
import { getDimensionsForTopic } from "@/lib/explore/dimensions";
import { getTopicDomainRelations } from "@/lib/taxonomy/domain-topics";
import { getDomain } from "@/lib/taxonomy/domains";

export const metadata = {
  title: "Topics",
  description:
    "Curated themes in the Quran — editorial reading aids with review status. Not tafsir.",
  alternates: { canonical: absoluteUrl("/topics") },
};

export default function TopicsIndexPage() {
  // Sort topics by relation count (most curated first)
  const sortedTopics = [...TOPICS].sort(
    (a, b) => b.relations.length - a.relations.length
  );

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Explore by topic
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Editorial entry points that group well-known verses by theme. Each
          selection includes its method, curator, review date, and a
          pending-scholarly-review status. These are starting points, not tafsir
          or legal rulings.
        </p>
      </header>

      <TopicGraph topics={TOPICS} />

      <section aria-labelledby="topic-list-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="topic-list-heading" className="font-display text-xl font-semibold tracking-tight">
            All topics ({TOPICS.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Sorted by verse count
          </p>
        </div>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTopics.map((topic) => {
            const dimensions = getDimensionsForTopic(topic.slug);
            const domainRels = getTopicDomainRelations(topic.slug);
            const domains = domainRels
              .map((r) => getDomain(r.domainId))
              .filter((d): d is NonNullable<typeof d> => Boolean(d));

            return (
              <li key={topic.slug}>
                <Link
                  href={`/topics/${topic.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {topic.title}
                    </h2>
                    <span className="arabic-display text-2xl text-gold" lang="ar">
                      {topic.arabicTitle}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {topic.summary}
                  </p>

                  {/* Dimension and domain badges */}
                  {(dimensions.length > 0 || domains.length > 0) && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {dimensions.slice(0, 2).map((dim) => (
                        <span
                          key={dim.id}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-medium text-primary"
                        >
                          {dim.title}
                        </span>
                      ))}
                      {domains.slice(0, 1).map((domain) => (
                        <span
                          key={domain.id}
                          className="inline-flex items-center rounded-full bg-gold/20 px-2 py-0.5 text-[0.65rem] font-medium text-accent-foreground"
                        >
                          {domain.title}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-xs font-medium text-primary group-hover:underline">
                    {topic.relations.length} curated verse
                    {topic.relations.length === 1 ? "" : "s"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
        <p>
          All topic relations are typed (thematic, lexical, cross-reference, or
          sequential context), with a rationale for each inclusion. Review status
          is shown on each topic page.
        </p>
      </aside>
    </div>
  );
}
