import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, BookMarked, Compass, GraduationCap, Search } from "lucide-react";
import {
  getCanonicalDimensions,
  getCanonicalDomains,
  getDimensionsForDomain,
} from "@/lib/taxonomy/canonical-adapter";
import { TOPICS } from "@/lib/topics/data";
import { DOMAINS } from "@/lib/taxonomy/domains";
import {
  PATHS,
  RECOMMENDED_PATHS,
  AUDIENCE_LABELS,
  AUDIENCE_DESCRIPTIONS,
  type TargetAudience,
} from "@/lib/paths/data";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Explore — Dimensions of the Quran",
  description:
    "Discover the Quran through life dimensions organized by domain. Each dimension connects to curated topics and search.",
  alternates: { canonical: absoluteUrl("/explore") },
};

export default function ExplorePage() {
  const allDimensions = getCanonicalDimensions();
  const domains = getCanonicalDomains();

  // Group dimensions by their parent domain
  const dimensionsByDomain = domains.map((domain) => ({
    domain,
    dimensions: getDimensionsForDomain(domain.id),
  })).filter((group) => group.dimensions.length > 0);

  return (
    <div className="space-y-10 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Explore — Dimensions of the Quran",
            description:
              "Discover the Quran through life dimensions organized by domain, each connecting to curated topics and search.",
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
          Discover the Quran through {allDimensions.length} dimensions across{" "}
          {domains.length} domains. Each dimension connects to curated topics
          and search, offering entry points for reflection and study.
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

      {/* Audience-based recommended paths */}
      <section aria-labelledby="recommended-paths-heading" className="space-y-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-6 w-6 text-primary" aria-hidden />
            <h2
              id="recommended-paths-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              Start with a Learning Path
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated journeys tailored to where you are in your Quran study.
            Each path is a sequenced set of ayat with objectives and reflection
            prompts. All content is pending scholarly review.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(RECOMMENDED_PATHS) as TargetAudience[]).map((audience) => {
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
            Browse all paths
          </Link>
        </div>
      </section>

      {/* Dimensions grouped by domain */}
      <section aria-labelledby="dimensions-heading" className="space-y-8">
        <div>
          <h2
            id="dimensions-heading"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            {allDimensions.length} Dimensions
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Organized across {domains.length} domains. Select a dimension to explore its topics and subdimensions.
          </p>
        </div>

        <div className="space-y-10">
          {dimensionsByDomain.map(({ domain, dimensions }) => (
            <div key={domain.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border/50 pb-2">
                <BookMarked className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {domain.title}
                </h3>
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                  {dimensions.length} dimension{dimensions.length === 1 ? "" : "s"}
                </span>
              </div>
              {domain.description && (
                <p className="text-sm text-muted-foreground max-w-3xl">
                  {domain.description}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dimensions.map((dim) => (
                  <Link
                    key={dim.id}
                    href={`/explore/dimensions/${dim.id}`}
                    className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                          {dim.title}
                        </h4>
                        {dim.arabicTitle && (
                          <p
                            className="arabic-display text-xl text-gold mt-1 mb-2"
                            lang="ar"
                            dir="rtl"
                          >
                            {dim.arabicTitle}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {dim.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {dim.topicIds.length > 0
                          ? `${dim.topicIds.length} topic${dim.topicIds.length === 1 ? "" : "s"}`
                          : dim.subdimensionIds.length > 0
                            ? `${dim.subdimensionIds.length} subdimension${dim.subdimensionIds.length === 1 ? "" : "s"}`
                            : "No mapped topics yet"}
                      </span>
                      <span className="text-primary font-medium group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {TOPICS.length > 0 && (
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
                  dir="rtl"
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
        aria-labelledby="domains-heading"
        className="rounded-2xl border border-border/80 bg-card p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <BookMarked className="h-5 w-5 text-primary" aria-hidden />
          <h2
            id="domains-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Domain Explorer
          </h2>
          <span className="rounded-full border border-gold/40 bg-gold-soft/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
            proposal
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {DOMAINS.length} proposed broad areas of Quran exploration —
          belief, worship, ethics, family, society, economics, prophets,
          creation, revelation, human experience, interfaith, language,
          law, and eschatology. This is an organizational catalog, not an
          approved taxonomy; no topic or passage has been assigned yet.
          Domains organize broad subject areas, while the {allDimensions.length} dimensions above
          are the active navigation system.
        </p>
        <Link
          href="/explore/domains"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookMarked className="h-4 w-4" aria-hidden />
          Browse domain catalog
        </Link>
      </section>

      <section
        aria-labelledby="concepts-heading"
        className="rounded-2xl border border-border/80 bg-card p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <BookMarked className="h-5 w-5 text-primary" aria-hidden />
          <h2
            id="concepts-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Concept Clusters
          </h2>
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
            pending review
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Cross-cutting Qur'anic themes — patience, gratitude, justice, trust —
          that connect multiple topics across different areas of guidance.
          Derived from editorial relationships.
        </p>
        <Link
          href="/explore/concepts"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookMarked className="h-4 w-4" aria-hidden />
          Browse concept clusters
        </Link>
      </section>

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
          See how the {allDimensions.length} dimensions connect to curated topics, and how topics
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
    </div>
  );
}
