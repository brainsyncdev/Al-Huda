import Link from "next/link";
import type { Metadata } from "next";
import { BookOpen, Compass, GraduationCap, Search, Sparkles } from "lucide-react";
import { getAllDimensions } from "@/lib/explore/dimensions";
import { PATHS, RECOMMENDED_PATHS, AUDIENCE_LABELS, AUDIENCE_DESCRIPTIONS } from "@/lib/paths/data";
import { getBroadestThemes } from "@/lib/explore/broadest-themes";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Discover — Your Quran Learning Hub",
  description:
    "Find your starting point in the Quran: curated learning paths for different audiences, topics ranked by breadth, and all 10 dimensions of exploration.",
  alternates: { canonical: absoluteUrl("/discover") },
};

export default function DiscoverPage() {
  const dimensions = getAllDimensions();
  const broadestThemes = getBroadestThemes(6);
  const audiences = Object.keys(RECOMMENDED_PATHS) as Array<keyof typeof RECOMMENDED_PATHS>;

  return (
    <div className="space-y-12 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Discover — Your Quran Learning Hub",
            description:
              "Find your starting point in the Quran: curated learning paths, topics, and dimensions.",
            url: absoluteUrl("/discover"),
            inLanguage: ["en", "ar"],
          },
        ]}
      />

      {/* Hero ------------------------------------------------------------- */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-gold" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Discover your starting point
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          The Quran offers many entry points. This hub brings together learning
          paths, topics, and dimensions to help you find where to begin — or
          where to go next.
        </p>
      </header>

      {/* Start with a path (audience-based) -------------------------------- */}
      <section aria-labelledby="start-with-path" className="space-y-5">
        <div>
          <h2
            id="start-with-path"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            Start with a path
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated learning sequences for different audiences and goals. Each
            path is a structured journey through selected ayat with objectives
            and reflection prompts.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((audience) => {
            const pathSlug = RECOMMENDED_PATHS[audience][0];
            const path = PATHS.find((p) => p.slug === pathSlug);
            if (!path) return null;

            return (
              <Link
                key={audience}
                href={`/learn/paths/${path.slug}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">
                      For {AUDIENCE_LABELS[audience]}
                    </p>
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <p
                      className="arabic-display text-base text-gold mt-0.5"
                      lang="ar"
                      dir="rtl"
                    >
                      {path.arabicTitle}
                    </p>
                  </div>
                  <GraduationCap
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {path.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  {path.steps.length} steps · {AUDIENCE_DESCRIPTIONS[audience]}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/learn/paths"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <GraduationCap className="h-4 w-4" aria-hidden />
            All learning paths
          </Link>
        </div>
      </section>

      {/* Broadest themes --------------------------------------------------- */}
      <section aria-labelledby="broadest-themes" className="space-y-5">
        <div>
          <h2
            id="broadest-themes"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            Broadest themes
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Topics that appear across the most dimensions. These themes connect
            multiple areas of life and offer rich entry points for exploration.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {broadestThemes.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p
                    className="arabic-display text-lg text-gold mt-0.5"
                    lang="ar"
                    dir="rtl"
                  >
                    {topic.arabicTitle}
                  </p>
                </div>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {topic.dimensionCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {topic.summary}
              </p>
              <p className="mt-2 text-xs font-medium text-primary group-hover:underline">
                In {topic.dimensionCount} dimension
                {topic.dimensionCount === 1 ? "" : "s"} →
              </p>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            All topics
          </Link>
        </div>
      </section>

      {/* All 10 dimensions ------------------------------------------------- */}
      <section aria-labelledby="all-dimensions" className="space-y-5">
        <div>
          <h2
            id="all-dimensions"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            Explore by dimension
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ten life dimensions — spiritual, personal, family, and more — as
            entry points for reflection. Each dimension connects to curated
            topics and search.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((dim) => (
            <Link
              key={dim.id}
              href={`/explore/dimension/${dim.id}`}
              className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="flex items-start gap-3 mb-2">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {dim.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {dim.title}
                  </h3>
                  <p
                    className="arabic-display text-lg text-gold mt-0.5"
                    lang="ar"
                    dir="rtl"
                  >
                    {dim.arabicTitle}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {dim.covers}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {dim.topicSlugs.length > 0
                  ? `${dim.topicSlugs.length} topic${dim.topicSlugs.length === 1 ? "" : "s"}`
                  : "No topics mapped yet"}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Compass className="h-4 w-4" aria-hidden />
            Full dimension explorer
          </Link>
        </div>
      </section>

      {/* Go deeper --------------------------------------------------------- */}
      <section
        aria-labelledby="go-deeper"
        className="rounded-2xl border border-border/80 bg-card p-6"
      >
        <h2
          id="go-deeper"
          className="font-display text-xl font-semibold tracking-tight mb-4"
        >
          Go deeper
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/explore/graph"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <Compass className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                Knowledge Graph
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              See how dimensions connect to topics, and how topics relate to
              each other. Every node carries its review status.
            </p>
          </Link>

          <Link
            href="/search"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                Search the Quran
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Find verses by reference, Arabic text, translation, or topic.
            </p>
          </Link>

          <Link
            href="/quran"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                Read the Quran
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Browse all 114 surahs with Uthmani text and translations.
            </p>
          </Link>

          <Link
            href="/learn"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                Learning Dashboard
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Track your progress, take quizzes, and manage your study plans.
            </p>
          </Link>
        </div>
      </section>

      {/* Review status notice ---------------------------------------------- */}
      <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
        <p>
          All topics, dimensions, and learning paths on this page carry their
          editorial review status (currently pending-scholarly-review). These
          are curated starting points, not tafsir or scholarly classifications.
        </p>
      </aside>
    </div>
  );
}
