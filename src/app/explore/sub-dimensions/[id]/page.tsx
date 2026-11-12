import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, FolderTree, Layers } from "lucide-react";
import {
  getCanonicalSubdimension,
  getCanonicalDimension,
  getCanonicalDomain,
  getTopicsForSubdimension,
  getCanonicalSubdimensions,
} from "@/lib/taxonomy/canonical-adapter";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs } from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getCanonicalSubdimensions().map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const subdimension = getCanonicalSubdimension(id);
  if (!subdimension) return {};

  const pagePath = `/explore/sub-dimensions/${subdimension.id}`;
  const canonical = absoluteUrl(pagePath);

  return {
    title: `${subdimension.title} — Explore the Quran`,
    description: subdimension.description,
    alternates: { canonical },
    openGraph: {
      title: `${subdimension.title} — Subdimension`,
      description: subdimension.description,
      url: canonical,
      type: "website",
      siteName: SITE_NAME,
    },
  };
}

export default async function SubdimensionPage({ params }: Props) {
  const { id } = await params;
  const subdimension = getCanonicalSubdimension(id);
  if (!subdimension) notFound();

  const dimension = getCanonicalDimension(subdimension.parentDimensionId);
  const domain = dimension
    ? getCanonicalDomain(dimension.parentDomainId)
    : null;

  const topics = getTopicsForSubdimension(subdimension.id);

  const subdimensionPath = `/explore/sub-dimensions/${subdimension.id}`;
  const dimensionPath = dimension
    ? `/explore/dimensions/${dimension.id}`
    : null;
  const domainPath = domain ? `/explore/domains/${domain.id}` : null;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Explore", path: "/explore" },
            ...(domain
              ? [{ name: "Domains", path: "/explore/domains" }]
              : []),
            ...(domain && domainPath
              ? [{ name: domain.title, path: domainPath }]
              : []),
            ...(dimension && dimensionPath
              ? [{ name: dimension.title, path: dimensionPath }]
              : []),
            { name: subdimension.title, path: subdimensionPath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${subdimension.title} — Subdimension`,
            description: subdimension.description,
            url: absoluteUrl(subdimensionPath),
            inLanguage: ["en"],
          },
        ]}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              Explore
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link
              href="/explore/domains"
              className="hover:text-primary transition-colors"
            >
              Domains
            </Link>
          </li>
          {domain && domainPath && (
            <>
              <li aria-hidden>·</li>
              <li>
                <Link
                  href={domainPath}
                  className="hover:text-primary transition-colors"
                >
                  {domain.title}
                </Link>
              </li>
            </>
          )}
          {dimension && dimensionPath && (
            <>
              <li aria-hidden>·</li>
              <li>
                <Link
                  href={dimensionPath}
                  className="hover:text-primary transition-colors"
                >
                  {dimension.title}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden>·</li>
          <li className="text-foreground">{subdimension.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <Link
          href={dimensionPath ?? "/explore"}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {dimension ? `Back to ${dimension.title}` : "Back to Explore"}
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {subdimension.title}
            </h1>
          </div>
          <span className="shrink-0 rounded-full border border-gold/40 bg-gold-soft/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
            pending review
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Description
          </p>
          <p className="text-base text-foreground">{subdimension.description}</p>
        </div>

        {/* Provenance notice */}
        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Pending scholarly review.</strong> This subdimension is
              part of the expanded canonical taxonomy. It is an organizational
              proposal for future editorial and scholarly work. No Quran passage
              has been assigned to this subdimension. Review status:{" "}
              <strong>pending scholarly review</strong>.
            </span>
          </p>
        </div>
      </header>

      {/* Parent hierarchy */}
      <section
        aria-labelledby="parent-hierarchy-heading"
        className="rounded-2xl border border-border/80 bg-card p-5 space-y-4"
      >
        <h2
          id="parent-hierarchy-heading"
          className="font-display text-lg font-semibold tracking-tight"
        >
          Parent hierarchy
        </h2>
        <div className="flex flex-wrap gap-3">
          {dimension && dimensionPath && (
            <Link
              href={dimensionPath}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <Layers className="h-4 w-4 text-primary" aria-hidden />
              <span>{dimension.title}</span>
            </Link>
          )}
          {domain && domainPath && (
            <Link
              href={domainPath}
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
            >
              <FolderTree className="h-4 w-4 text-primary" aria-hidden />
              <span>{domain.title}</span>
            </Link>
          )}
        </div>
      </section>

      {/* Statistics */}
      <section
        aria-labelledby="statistics-heading"
        className="rounded-2xl border border-border/80 bg-card p-5"
      >
        <h2
          id="statistics-heading"
          className="font-display text-lg font-semibold tracking-tight mb-3"
        >
          Statistics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border/60 bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Topics
            </p>
            <p className="text-2xl font-semibold text-foreground">
              {topics.length}
            </p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Parent dimension
            </p>
            <p className="text-sm font-medium text-foreground">
              {dimension?.title ?? "Unknown"}
            </p>
          </div>
        </div>
      </section>

      {/* Topics section */}
      {topics.length > 0 ? (
        <section aria-labelledby="topics-heading" className="space-y-4">
          <div>
            <h2
              id="topics-heading"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Topics in this subdimension ({topics.length})
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Topics organized under this subdimension. Each topic is an
              editorial entry point for reflection, not a scholarly
              classification.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`/explore/topics/${topic.id}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    {topic.urduTitle && (
                      <p
                        className="text-sm text-muted-foreground mt-0.5"
                        lang="ur"
                        dir="rtl"
                      >
                        {topic.urduTitle}
                      </p>
                    )}
                    {topic.arabicTitle && (
                      <p
                        className="arabic-display text-lg text-gold mt-1"
                        lang="ar"
                        dir="rtl"
                      >
                        {topic.arabicTitle}
                      </p>
                    )}
                  </div>
                  {topic.specialized && (
                    <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                      specialized
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {topic.description}
                </p>
                {topic.scope && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
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
      ) : (
        <section
          aria-labelledby="no-topics-heading"
          className="rounded-2xl border border-border/80 bg-muted/30 p-6"
        >
          <h2
            id="no-topics-heading"
            className="font-display text-lg font-semibold tracking-tight mb-2"
          >
            No topics yet
          </h2>
          <p className="text-sm text-muted-foreground">
            This subdimension does not yet have topics assigned to it. Topics
            will be added as part of future editorial work.
          </p>
        </section>
      )}

      {/* What this page does not claim */}
      <section
        aria-labelledby="what-this-page-does-not-claim-heading"
        className="rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground"
      >
        <h2
          id="what-this-page-does-not-claim-heading"
          className="font-display text-base font-semibold tracking-tight text-foreground mb-2"
        >
          What this page does NOT claim
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>That the Quran has been classified into these subdimensions.</li>
          <li>That any specific ayah belongs to this subdimension.</li>
          <li>That this subdimension is an exhaustive or canonical category.</li>
          <li>
            That this taxonomy has been reviewed or approved by a scholar.
          </li>
          <li>That topic assignments represent actual content.</li>
        </ul>
      </section>

      {/* Bottom navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-3">
        {dimension && dimensionPath ? (
          <Link
            href={dimensionPath}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {dimension.title}
          </Link>
        ) : (
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Explore
          </Link>
        )}
        <Link
          href="/explore/domains"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          All domains
        </Link>
      </nav>
    </div>
  );
}
