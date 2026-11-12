import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, BookOpen, Layers, Tag } from "lucide-react";
import {
  getCanonicalDomain,
  getCanonicalDomains,
  getDimensionsForDomain,
  getTopicsForDomain,
  getCanonicalSubdimensions,
  getCanonicalDimension,
} from "@/lib/taxonomy/canonical-adapter";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs } from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getCanonicalDomains().map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const domain = getCanonicalDomain(id);
  if (!domain) return {};
  const canonical = absoluteUrl(`/explore/domains/${domain.id}`);
  return {
    title: `${domain.title} — Quran Domain`,
    description: domain.description,
    alternates: { canonical },
    openGraph: {
      title: `${domain.title} — Quran Domain`,
      description: domain.description,
      url: canonical,
      type: "website",
      siteName: "Al-Huda",
    },
  };
}

export default async function DomainDetailPage({ params }: Props) {
  const { id } = await params;
  const domain = getCanonicalDomain(id);
  if (!domain) return notFound();

  const dimensions = getDimensionsForDomain(domain.id);
  const topics = getTopicsForDomain(domain.id);
  const allSubdimensions = getCanonicalSubdimensions();

  // Group subdimensions by their parent dimension within this domain
  const dimensionIds = new Set(dimensions.map((d) => d.id));
  const domainSubdimensions = allSubdimensions.filter((sd) =>
    dimensionIds.has(sd.parentDimensionId)
  );

  const domainPagePath = `/explore/domains/${domain.id}`;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Explore", path: "/explore" },
            { name: "Domains", path: "/explore/domains" },
            { name: domain.title, path: domainPagePath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${domain.title} — Quran Domain`,
            description: domain.description,
            url: absoluteUrl(domainPagePath),
            inLanguage: ["en", "ar", "ur"],
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-1.5">
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
          <li aria-hidden>/</li>
          <li className="text-muted-foreground">{domain.title}</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <Link
          href="/explore/domains"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All domains
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {domain.title}
            </h1>
            {domain.arabicTitle && (
              <p
                className="arabic-display text-3xl text-gold mt-2"
                lang="ar"
                dir="rtl"
              >
                {domain.arabicTitle}
              </p>
            )}
            {domain.urduTitle && (
              <p
                className="text-xl text-muted-foreground mt-1"
                lang="ur"
                dir="rtl"
              >
                {domain.urduTitle}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full border border-gold/40 bg-gold-soft/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
            pending review
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Scope
          </p>
          <p className="text-base text-foreground">{domain.scope}</p>
          <p className="mt-3 text-muted-foreground">{domain.description}</p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Dimensions
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {dimensions.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Subdimensions
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {domainSubdimensions.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Topics
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {topics.length}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Pending scholarly review.</strong> This domain organizes{" "}
              {dimensions.length} dimensions and {topics.length} topics as an
              editorial framework for knowledge discovery. All content carries{" "}
              <strong>pending-scholarly-review</strong> status. This is not a
              scholarly classification of the Quran.
            </span>
          </p>
        </div>
      </header>

      {/* Dimensions Section */}
      {dimensions.length > 0 && (
        <section aria-labelledby="dimensions-heading" className="space-y-4">
          <h2
            id="dimensions-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Dimensions ({dimensions.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Major areas of knowledge within this domain. Each dimension contains
            subdimensions and specialized topics.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {dimensions.map((dimension) => {
              const dimSubdimensions = allSubdimensions.filter(
                (sd) => sd.parentDimensionId === dimension.id
              );
              return (
                <Link
                  key={dimension.id}
                  href={`/explore/dimensions/${dimension.id}`}
                  className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {dimension.title}
                    </h3>
                  </div>
                  {dimension.arabicTitle && (
                    <p
                      className="arabic-display text-lg text-gold mb-2"
                      lang="ar"
                      dir="rtl"
                    >
                      {dimension.arabicTitle}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {dimension.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {dimSubdimensions.length} subdimension
                      {dimSubdimensions.length === 1 ? "" : "s"} ·{" "}
                      {dimension.topicIds.length} topic
                      {dimension.topicIds.length === 1 ? "" : "s"}
                    </span>
                    <span className="text-primary font-medium group-hover:underline">
                      Explore →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Subdimensions Section */}
      {domainSubdimensions.length > 0 && (
        <section
          aria-labelledby="subdimensions-heading"
          className="space-y-4"
        >
          <h2
            id="subdimensions-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Subdimensions ({domainSubdimensions.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Specialized groupings within dimensions, providing finer-grained
            navigation.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {domainSubdimensions.map((sub) => {
              const parentDim = getCanonicalDimension(sub.parentDimensionId);
              return (
                <Link
                  key={sub.id}
                  href={`/explore/sub-dimensions/${sub.id}`}
                  className="group rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                >
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors mb-1">
                    {sub.title}
                  </h3>
                  {parentDim && (
                    <p className="text-xs text-muted-foreground mb-2">
                      in {parentDim.title}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {sub.description}
                  </p>
                  <p className="mt-2 text-xs text-primary font-medium group-hover:underline">
                    {sub.topicIds.length} topic
                    {sub.topicIds.length === 1 ? "" : "s"} →
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Topics Section */}
      {topics.length > 0 && (
        <section aria-labelledby="topics-heading" className="space-y-4">
          <h2
            id="topics-heading"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Topics ({topics.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Specialized subjects within this domain. Each topic connects to
            related topics across domains through the knowledge graph.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.slice(0, 30).map((topic) => (
              <Link
                key={topic.id}
                href={`/explore/topics/${topic.id}`}
                className="group rounded-xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors mb-1">
                  {topic.title}
                </h3>
                {topic.arabicTitle && (
                  <p
                    className="arabic-display text-sm text-gold mb-1"
                    lang="ar"
                    dir="rtl"
                  >
                    {topic.arabicTitle}
                  </p>
                )}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {topic.description}
                </p>
                {topic.specialized && (
                  <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                    specialized
                  </span>
                )}
              </Link>
            ))}
          </div>
          {topics.length > 30 && (
            <p className="text-sm text-muted-foreground">
              Showing 30 of {topics.length} topics. Use search to find specific
              topics within this domain.
            </p>
          )}
        </section>
      )}

      {/* Empty state */}
      {dimensions.length === 0 && topics.length === 0 && (
        <section
          aria-labelledby="empty-state-heading"
          className="rounded-2xl border border-border/80 bg-muted/30 p-6"
        >
          <h2
            id="empty-state-heading"
            className="font-display text-lg font-semibold tracking-tight mb-2"
          >
            No content yet
          </h2>
          <p className="text-sm text-muted-foreground">
            This domain is a placeholder for future editorial and scholarly
            work. No dimensions or topics have been assigned yet.
          </p>
        </section>
      )}

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
          <li>That the Quran has been classified into these domains.</li>
          <li>That any specific ayah belongs to this domain.</li>
          <li>That this domain is an exhaustive or canonical category.</li>
          <li>That this catalog has been reviewed or approved by a scholar.</li>
        </ul>
      </section>

      <nav className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/explore/domains"
          className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All domains
        </Link>
        <Link
          href="/explore"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          Explore home
        </Link>
      </nav>
    </div>
  );
}
