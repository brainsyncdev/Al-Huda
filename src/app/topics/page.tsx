import Link from "next/link";
import { TOPICS } from "@/lib/topics/data";

export const metadata = {
  title: "Topics",
  description:
    "Curated themes in the Quran — editorial reading aids with review status. Not tafsir.",
};

export default function TopicsIndexPage() {
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

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
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
              <p className="mt-4 text-xs font-medium text-primary group-hover:underline">
                {topic.relations.length} curated verse
                {topic.relations.length === 1 ? "" : "s"}
              </p>
            </Link>
          </li>
        ))}
      </ul>

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
