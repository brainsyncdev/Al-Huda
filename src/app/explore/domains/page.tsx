import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, BookMarked, Search } from "lucide-react";
import { getCanonicalDomains, getTaxonomyStatistics, getDimensionsForDomain, getTopicsForDomain } from "@/lib/taxonomy/canonical-adapter";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Domains — Quran Knowledge Explorer",
  description:
    "Explore the Quran through 20 comprehensive domains covering belief, worship, ethics, family, society, economics, prophets, creation, revelation, human experience, and more. Each domain contains dimensions, subdimensions, and specialized topics.",
  alternates: { canonical: absoluteUrl("/explore/domains") },
  openGraph: {
    title: "Domains — Quran Knowledge Explorer",
    description:
      "20 comprehensive domains for Quranic knowledge exploration with dimensions, subdimensions, and topics.",
    url: absoluteUrl("/explore/domains"),
    type: "website",
    siteName: "Al-Huda",
  },
};

export default function DomainsDirectoryPage() {
  const domains = getCanonicalDomains();
  const stats = getTaxonomyStatistics();

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Domains — Quran Knowledge Explorer",
            description:
              "20 comprehensive domains for Quranic knowledge exploration.",
            url: absoluteUrl("/explore/domains"),
            inLanguage: ["en", "ar", "ur"],
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Explore
        </Link>
      </nav>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Quran Knowledge Domains
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {domains.length} comprehensive domains organizing Quranic knowledge
          across every major area of human life. Each domain contains
          dimensions, subdimensions, and specialized topics for deep exploration.
        </p>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Domains
            </p>
            <p className="text-2xl font-semibold text-primary">{stats.totalDomains}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Dimensions
            </p>
            <p className="text-2xl font-semibold text-primary">{stats.totalDimensions}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Topics
            </p>
            <p className="text-2xl font-semibold text-primary">{stats.totalTopics}</p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Relationships
            </p>
            <p className="text-2xl font-semibold text-primary">{stats.totalRelationships}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Pending scholarly review.</strong> This taxonomy organizes
              Quranic knowledge across 20 domains, {stats.totalDimensions} dimensions,
              and {stats.totalTopics} topics. All content carries{" "}
              <strong>pending-scholarly-review</strong> status. This is an
              organizational framework for knowledge discovery, not a scholarly
              classification of the Quran.
            </span>
          </p>
        </div>
      </header>

      {/* Search */}
      <section className="rounded-2xl border border-border/80 bg-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <Search className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="font-display text-lg font-semibold tracking-tight">
            Search the taxonomy
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Search across all domains, dimensions, subdimensions, and topics by
          title, description, or keywords.
        </p>
        <Link
          href="/search"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Search className="h-4 w-4" aria-hidden />
          Open search
        </Link>
      </section>

      <section aria-labelledby="domains-heading" className="space-y-4">
        <h2
          id="domains-heading"
          className="font-display text-2xl font-semibold tracking-tight"
        >
          All Domains
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain) => {
            const dimensions = getDimensionsForDomain(domain.id);
            const topics = getTopicsForDomain(domain.id);
            
            return (
              <Link
                key={domain.id}
                href={`/explore/domains/${domain.id}`}
                className="group flex flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {domain.title}
                  </h3>
                </div>
                {domain.arabicTitle && (
                  <p
                    className="arabic-display text-xl text-gold mb-2"
                    lang="ar"
                    dir="rtl"
                  >
                    {domain.arabicTitle}
                  </p>
                )}
                {domain.urduTitle && (
                  <p
                    className="text-sm text-muted-foreground mb-2"
                    lang="ur"
                    dir="rtl"
                  >
                    {domain.urduTitle}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {domain.description}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {dimensions.length} dimension{dimensions.length === 1 ? "" : "s"} · {topics.length} topic{topics.length === 1 ? "" : "s"}
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

      <section
        aria-labelledby="what-next-heading"
        className="rounded-2xl border border-border/80 bg-muted/30 p-6"
      >
        <h2
          id="what-next-heading"
          className="font-display text-lg font-semibold tracking-tight mb-2"
        >
          About this taxonomy
        </h2>
        <p className="text-sm text-muted-foreground">
          This comprehensive taxonomy organizes Quranic knowledge across 20
          domains, {stats.totalDimensions} dimensions, {stats.totalSubdimensions} subdimensions,
          and {stats.totalTopics} specialized topics. Each entity is interconnected
          through {stats.totalRelationships} relationships, enabling rich discovery
          and exploration. The existing{" "}
          <Link
            href="/explore"
            className="text-primary hover:underline"
          >
            15 life dimensions
          </Link>{" "}
          remain as an alternative navigation system.
        </p>
      </section>
    </div>
  );
}
