import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, BookOpen, Layers, Tag } from "lucide-react";
import {
  getCanonicalDimension,
  getCanonicalDimensions,
  getSubdimensionsForDimension,
  getTopicsForDimension,
  getCanonicalDomain,
  getRelationshipsFor,
  getCanonicalDimension as getDimensionById,
} from "@/lib/taxonomy/canonical-adapter";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs } from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getCanonicalDimensions().map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dimension = getCanonicalDimension(id);
  if (!dimension) return {};

  const canonical = absoluteUrl(`/explore/dimensions/${dimension.id}`);

  return {
    title: `${dimension.title}${dimension.arabicTitle ? ` (${dimension.arabicTitle})` : ""} — Canonical Dimension`,
    description: dimension.description,
    alternates: { canonical },
    openGraph: {
      title: `${dimension.title} — Canonical Dimension`,
      description: dimension.description,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
    },
  };
}

export default async function CanonicalDimensionPage({ params }: Props) {
  const { id } = await params;
  const dimension = getCanonicalDimension(id);
  if (!dimension) notFound();

  const parentDomain = getCanonicalDomain(dimension.parentDomainId);
  const subdimensions = getSubdimensionsForDimension(dimension.id);
  const topics = getTopicsForDimension(dimension.id);
  const relationships = getRelationshipsFor(dimension.id);

  // Get related dimensions from relationships
  const relatedDimensionIds = relationships
    .filter((r) => r.type === "RELATED_TO" || r.type === "SHARES_CONCEPT")
    .map((r) => (r.sourceId === dimension.id ? r.targetId : r.sourceId));

  const relatedDimensions = relatedDimensionIds
    .map((dimId) => getDimensionById(dimId))
    .filter((d): d is NonNullable<typeof d> => d !== null);

  const dimensionPagePath = `/explore/dimensions/${dimension.id}`;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Explore", path: "/explore" },
            { name: "Domains", path: "/explore/domains" },
            ...(parentDomain
              ? [
                  {
                    name: parentDomain.title,
                    path: `/explore/domains/${parentDomain.id}`,
                  },
                ]
              : []),
            { name: dimension.title, path: dimensionPagePath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${dimension.title} — Canonical Dimension`,
            description: dimension.description,
            url: absoluteUrl(dimensionPagePath),
            inLanguage: ["en", "ar", "ur"],
          },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link href="/explore" className="text-primary hover:underline">
              Explore
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href="/explore/domains"
              className="text-primary hover:underline"
            >
              Domains
            </Link>
          </li>
          {parentDomain && (
            <>
              <li aria-hidden>/</li>
              <li>
                <Link
                  href={`/explore/domains/${parentDomain.id}`}
                  className="text-primary hover:underline"
                >
                  {parentDomain.title}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>/</li>
          <li className="text-muted-foreground">{dimension.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <Link
          href={parentDomain ? `/explore/domains/${parentDomain.id}` : "/explore/domains"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {parentDomain ? `Back to ${parentDomain.title}` : "All domains"}
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {dimension.title}
            </h1>
            {dimension.arabicTitle && (
              <p
                className="arabic-display text-3xl text-gold mt-2"
                lang="ar"
                dir="rtl"
              >
                {dimension.arabicTitle}
              </p>
            )}
            {dimension.urduTitle && (
              <p
                className="text-2xl text-gold mt-1"
                lang="ur"
                dir="rtl"
              >
                {dimension.urduTitle}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full border border-gold/40 bg-gold-soft/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
            canonical
          </span>
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Description
          </p>
          <p className="text-base text-foreground leading-relaxed">
            {dimension.description}
          </p>
        </div>

        {/* Parent Domain Link */}
        {parentDomain && (
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Parent Domain
            </p>
            <Link
              href={`/explore/domains/${parentDomain.id}`}
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              {parentDomain.title}
              {parentDomain.arabicTitle && (
                <span
                  className="arabic-display text-gold"
                  lang="ar"
                  dir="rtl"
                >
                  ({parentDomain.arabicTitle})
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="h-5 w-5 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Subdimensions
              </p>
            </div>
            <p className="text-2xl font-semibold">{subdimensions.length}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-5 w-5 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Topics
              </p>
            </div>
            <p className="text-2xl font-semibold">{topics.length}</p>
          </div>
        </div>

        {/* Provenance Notice */}
        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Provenance: pending-scholarly-review.</strong> This
              dimension is part of the expanded canonical taxonomy (98
              dimensions across 20 domains). It has not been reviewed or
              approved by scholars. This is not a scholarly classification of
              the Quran.
            </span>
          </p>
        </div>
      </header>

      {/* Subdimensions Section */}
      {subdimensions.length > 0 && (
        <section aria-labelledby="subdimensions-heading" className="space-y-4">
          <div>
            <h2
              id="subdimensions-heading"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Subdimensions ({subdimensions.length})
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Finer-grained categories within this dimension.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {subdimensions.map((subdim) => (
              <Link
                key={subdim.id}
                href={`/explore/sub-dimensions/${subdim.id}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {subdim.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {subdim.description}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium text-primary group-hover:underline">
                  {subdim.topicIds.length} topic
                  {subdim.topicIds.length === 1 ? "" : "s"} →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Topics Section */}
      {topics.length > 0 && (
        <section aria-labelledby="topics-heading" className="space-y-4">
          <div>
            <h2
              id="topics-heading"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Topics ({topics.length})
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Specific subjects covered within this dimension.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/explore/topics/${topic.id}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    {topic.arabicTitle && (
                      <p
                        className="arabic-display text-lg text-gold mt-1"
                        lang="ar"
                        dir="rtl"
                      >
                        {topic.arabicTitle}
                      </p>
                    )}
                    {topic.urduTitle && (
                      <p
                        className="text-base text-gold mt-0.5"
                        lang="ur"
                        dir="rtl"
                      >
                        {topic.urduTitle}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {topic.description}
                    </p>
                  </div>
                </div>
                {topic.scope && (
                  <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
                    <span className="font-medium">Scope:</span> {topic.scope}
                  </p>
                )}
                <p className="mt-3 text-xs font-medium text-primary group-hover:underline">
                  View topic →
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Dimensions Section */}
      {relatedDimensions.length > 0 && (
        <section aria-labelledby="related-heading" className="space-y-4">
          <div>
            <h2
              id="related-heading"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Related Dimensions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Other dimensions that share conceptual connections with this one.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {relatedDimensions.map((relDim) => (
              <Link
                key={relDim.id}
                href={`/explore/dimensions/${relDim.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
              >
                {relDim.arabicTitle && (
                  <span
                    className="arabic-display text-base text-gold"
                    lang="ar"
                    dir="rtl"
                    aria-hidden
                  >
                    {relDim.arabicTitle}
                  </span>
                )}
                {relDim.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Aliases Section */}
      {dimension.aliases.length > 0 && (
        <section aria-labelledby="aliases-heading" className="space-y-3">
          <h2
            id="aliases-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Alternative Names
          </h2>
          <ul className="flex flex-wrap gap-2">
            {dimension.aliases.map((alias) => (
              <li
                key={alias}
                className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-sm"
              >
                {alias}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={parentDomain ? `/explore/domains/${parentDomain.id}` : "/explore/domains"}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {parentDomain ? `Back to ${parentDomain.title}` : "All domains"}
        </Link>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Explore Home
        </Link>
      </nav>
    </div>
  );
}
