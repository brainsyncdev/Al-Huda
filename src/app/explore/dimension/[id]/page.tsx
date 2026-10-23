import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";
import { getDimension, getAllDimensions, DIMENSION_PROVENANCE } from "@/lib/explore/dimensions";
import { getTopic } from "@/lib/topics/data";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs } from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getAllDimensions().map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dim = getDimension(id);
  if (!dim) return {};
  return {
    title: `${dim.title} (${dim.arabicTitle}) — Explore the Quran`,
    description: dim.description,
    alternates: { canonical: absoluteUrl(`/explore/dimension/${dim.id}`) },
  };
}

export default async function DimensionPage({ params }: Props) {
  const { id } = await params;
  const dim = getDimension(id);
  if (!dim) notFound();

  // Resolve mapped topics. A topic slug that does not exist is reported
  // rather than silently dropped, so the visible count is never overstated.
  const resolvedTopics = dim.topicSlugs
    .map((slug) => getTopic(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const unresolvedSlugs = dim.topicSlugs.filter(
    (slug) => !getTopic(slug)
  );

  // Build a search query from the dimension's search terms.
  const searchQuery = dim.searchTerms.slice(0, 3).join(" ");

  const dimensionPagePath = `/explore/dimension/${dim.id}`;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Explore", path: "/explore" },
            { name: dim.title, path: dimensionPagePath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${dim.title} — 10 Dimensions of the Quran`,
            description: dim.description,
            url: absoluteUrl(dimensionPagePath),
            inLanguage: ["en", "ar"],
          },
        ]}
      />

      <header className="space-y-4">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All dimensions
        </Link>

        <div className="flex items-start gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold shrink-0">
            {dim.number}
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {dim.title}
            </h1>
            <p
              className="arabic-display text-3xl text-gold mt-1"
              lang="ar"
              dir="rtl"
            >
              {dim.arabicTitle}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Covers
          </p>
          <p className="text-base text-foreground">{dim.covers}</p>
          <p className="mt-3 text-muted-foreground">{dim.description}</p>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              This is a topic-level navigation aid. Individual ayat have not
              been tagged to this dimension. The topics below are curated
              starting points whose themes overlap the dimension&apos;s description.
              Each topic carries its own review status ({DIMENSION_PROVENANCE.status.replace(/-/g, " ")}).
              This is not tafsir and not a scholarly classification.
            </span>
          </p>
        </div>
      </header>

      {resolvedTopics.length > 0 && (
        <section
          aria-labelledby="curated-topics-heading"
          className="space-y-4"
        >
          <h2
            id="curated-topics-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Curated starting points ({resolvedTopics.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {resolvedTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p
                      className="arabic-display text-xl text-gold mt-1"
                      lang="ar"
                      dir="rtl"
                    >
                      {topic.arabicTitle}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {topic.summary}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium text-primary group-hover:underline">
                  {topic.relations.length} curated verse
                  {topic.relations.length === 1 ? "" : "s"} →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {unresolvedSlugs.length > 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p>
            {unresolvedSlugs.length} topic slug{unresolvedSlugs.length === 1 ? "" : "s"} in
            this dimension&apos;s mapping could not be resolved:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs">
            {unresolvedSlugs.map((slug) => (
              <li key={slug}>{slug}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            This is a data-integrity problem in the dimension mapping, not a
            missing topic. It is surfaced rather than silently dropped.
          </p>
        </div>
      )}

      {resolvedTopics.length === 0 && unresolvedSlugs.length === 0 && (
        <section
          aria-labelledby="no-topics-heading"
          className="rounded-2xl border border-border/80 bg-muted/30 p-6"
        >
          <h2
            id="no-topics-heading"
            className="font-display text-lg font-semibold tracking-tight mb-2"
          >
            No curated topics yet
          </h2>
          <p className="text-muted-foreground">
            This dimension does not yet have curated topic mappings. You can
            still explore verses related to this theme through search.
          </p>
        </section>
      )}

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
            Explore further
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Search the Quran for verses related to {dim.title.toLowerCase()}. Try
          these terms:{" "}
          {dim.searchTerms.map((term, i) => (
            <span key={term}>
              <Link
                href={`/search?q=${encodeURIComponent(term)}`}
                className="text-primary hover:underline"
              >
                {term}
              </Link>
              {i < dim.searchTerms.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <Link
          href={`/search?q=${encodeURIComponent(searchQuery)}`}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Search className="h-4 w-4" aria-hidden />
          Search for &quot;{searchQuery}&quot;
        </Link>
      </section>

      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All dimensions
        </Link>
      </nav>
    </div>
  );
}
