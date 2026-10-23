import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, Compass, Search } from "lucide-react";
import { getAllDimensions } from "@/lib/explore/dimensions";
import { TOPICS } from "@/lib/topics/data";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Explore — 10 Dimensions of the Quran",
  description:
    "Discover the Quran through 10 life dimensions: Spiritual, Personal, Family, Social, Economic, Intellectual, Governance, Jihad, Interfaith, and Ilm. Each dimension connects to curated topics and search.",
  alternates: { canonical: absoluteUrl("/explore") },
};

export default function ExplorePage() {
  const dimensions = getAllDimensions();
  const withTopics = dimensions.filter((d) => d.topicSlugs.length > 0);
  const withoutTopics = dimensions.filter((d) => d.topicSlugs.length === 0);

  return (
    <div className="space-y-10 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Explore — 10 Dimensions of the Quran",
            description:
              "Discover the Quran through 10 life dimensions, each connecting to curated topics and search.",
            url: absoluteUrl("/explore"),
            inLanguage: ["en", "ar"],
          },
        ]}
      />

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Compass className="h-8 w-8 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore the Quran
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Discover the Quran through 10 life dimensions. Each dimension connects
          to curated topics and search, offering entry points for reflection and
          study.
        </p>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              The dimensions below are a topic-level navigation aid. Individual
              ayat have not been tagged to dimensions; the mapping connects each
              dimension&apos;s theme to existing editorial topic selections, each of
              which carries its own review status. This is not tafsir and not a
              scholarly classification of the Quran&apos;s content.
            </span>
          </p>
        </div>
      </header>

      <section aria-labelledby="dimensions-heading" className="space-y-6">
        <h2
          id="dimensions-heading"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          10 Dimensions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((dim) => (
            <Link
              key={dim.id}
              href={`/explore/dimension/${dim.id}`}
              className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {dim.number}
                    </span>
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {dim.title}
                    </h3>
                  </div>
                  <p
                    className="arabic-display text-xl text-gold mb-2"
                    lang="ar"
                    dir="rtl"
                  >
                    {dim.arabicTitle}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    Covers
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {dim.covers}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {dim.topicSlugs.length > 0
                    ? `${dim.topicSlugs.length} curated topic${dim.topicSlugs.length === 1 ? "" : "s"}`
                    : "No curated topics yet"}
                </span>
                <span className="text-primary font-medium group-hover:underline">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {withTopics.length > 0 && (
        <section
          aria-labelledby="curated-start-heading"
          className="space-y-4"
        >
          <h2
            id="curated-start-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Start with curated topics
          </h2>
          <p className="text-sm text-muted-foreground">
            These topics are mapped to dimensions as navigation aids. Each topic
            carries its own review status and is not tafsir.
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.slice(0, 8).map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
              >
                <span
                  className="arabic-display text-base text-gold"
                  lang="ar"
                  aria-hidden
                >
                  {topic.arabicTitle}
                </span>
                {topic.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        aria-labelledby="graph-heading"
        className="rounded-2xl border border-border/80 bg-card p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Compass className="h-5 w-5 text-primary" aria-hidden />
          <h2
            id="graph-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Knowledge Graph Explorer
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          See how the ten dimensions connect to curated topics, and how topics
          relate to each other. Every node and edge carries its editorial
          review status.
        </p>
        <Link
          href="/explore/graph"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Compass className="h-4 w-4" aria-hidden />
          Open graph explorer
        </Link>
      </section>

      <section
        aria-labelledby="search-heading"
        className="rounded-2xl border border-border/80 bg-card p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <Search className="h-5 w-5 text-primary" aria-hidden />
          <h2
            id="search-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Search the Quran
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Looking for something specific? Search by reference, Arabic text,
          translation, or topic.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Search className="h-4 w-4" aria-hidden />
          Open search
        </Link>
      </section>

      {withoutTopics.length > 0 && (
        <aside className="rounded-2xl border border-border/80 bg-muted/30 p-5 text-sm text-muted-foreground">
          <p>
            Some dimensions ({withoutTopics.map((d) => d.title).join(", ")}) do
            not yet have curated topic mappings. You can still explore them
            through search using the suggested terms on each dimension page.
          </p>
        </aside>
      )}
    </div>
  );
}
