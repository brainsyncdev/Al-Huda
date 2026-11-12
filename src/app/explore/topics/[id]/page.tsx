// /explore/topics/[id] — Unified Topic Detail Page
// MFD-07 Phase 6 + Phase 10: Handles BOTH canonical and legacy topics
// 
// This unified page resolves the Next.js routing conflict that occurred when
// having separate [id] and [slug] dynamic segments at the same path level.
// It first attempts to find a canonical topic by ID, then falls back to
// legacy topic lookup by slug.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Compass,
  FolderTree,
  Layers,
  Map,
  Search,
  Tag,
} from "lucide-react";
import {
  getCanonicalTopic,
  getCanonicalTopics,
  getCanonicalDomain,
  getCanonicalDimension,
  getCanonicalSubdimension,
  type CanonicalTopic,
} from "@/lib/taxonomy/canonical-adapter";
import { getTopic, TOPICS, RELATION_TYPE_LABELS } from "@/lib/topics/data";
import {
  getAllDimensionsForTopic,
  getAllDomainsForTopic,
  getJourneysForTopic,
  getDimensionUrl,
  getDomainUrl,
  getJourneyUrl,
  getTopicUrl,
} from "@/lib/topics/navigation";
import { getCanonicalTopicsForLegacyTopic } from "@/lib/topics/legacy-canonical-mapping";
import topicAyahMappings from "../../../../../data/taxonomy/topic-ayah-mappings.json";
import { getSurah } from "@/lib/quran/data";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { getTopicEnrichment } from "@/lib/graph/canonical-graph-enrichment";
import { getSprint48RootBySlug } from "@/lib/morphology/sprint-48-root-data";

interface Props {
  params: Promise<{ id: string }>;
}

interface AyahMapping {
  id: string;
  topicId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  mappingType: string;
  rationale: string;
  sourceIds: string[];
  provenance: string;
  status: string;
}

export function generateStaticParams() {
  // Pre-render all canonical topics
  const canonicalParams = getCanonicalTopics().map((t) => ({ id: t.id }));
  // Also pre-render legacy topics (they use slug as the ID param)
  const legacyParams = TOPICS.map((t) => ({ id: t.slug }));
  return [...canonicalParams, ...legacyParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // Try canonical first
  const canonicalTopic = getCanonicalTopic(id);
  if (canonicalTopic) {
    const canonical = absoluteUrl(`/explore/topics/${canonicalTopic.id}`);
    return {
      title: `${canonicalTopic.title} (${canonicalTopic.arabicTitle || canonicalTopic.title}) · Explore Topics · Al-Huda`,
      description: canonicalTopic.description,
      alternates: { canonical },
      openGraph: {
        title: `${canonicalTopic.title} — Quran Topic`,
        description: canonicalTopic.description,
        url: canonical,
        type: "website",
        siteName: "Al-Huda",
      },
    };
  }
  
  // Fall back to legacy
  const legacyTopic = getTopic(id);
  if (legacyTopic) {
    return {
      title: `${legacyTopic.title} (${legacyTopic.arabicTitle}) · Explore Topics · Al-Huda`,
      description: legacyTopic.summary,
      alternates: { canonical: absoluteUrl(`/explore/topics/${id}`) },
    };
  }
  
  return {
    title: "Topic not found · Al-Huda",
    robots: { index: false },
  };
}

export default async function UnifiedTopicDetailPage({ params }: Props) {
  const { id } = await params;
  
  // Try canonical topic first
  const canonicalTopic = getCanonicalTopic(id);
  if (canonicalTopic) {
    return <CanonicalTopicView topic={canonicalTopic} />;
  }
  
  // Fall back to legacy topic
  const legacyTopic = getTopic(id);
  if (legacyTopic) {
    return <LegacyTopicView topic={legacyTopic} />;
  }
  
  notFound();
}

// ============================================================================
// Canonical Topic View
// ============================================================================

async function CanonicalTopicView({ topic }: { topic: CanonicalTopic }) {
  const parentDomain = getCanonicalDomain(topic.parentDomainId);
  const parentDimension = getCanonicalDimension(topic.parentDimensionId);
  const parentSubdimension = topic.parentSubdimensionId
    ? getCanonicalSubdimension(topic.parentSubdimensionId)
    : null;

  // Get all ayah mappings for this topic
  const allMappings = topicAyahMappings as AyahMapping[];
  const topicMappings = allMappings.filter((m) => m.topicId === topic.id);

  // Group mappings by type
  const mappingsByType = topicMappings.reduce(
    (acc, mapping) => {
      if (!acc[mapping.mappingType]) {
        acc[mapping.mappingType] = [];
      }
      acc[mapping.mappingType].push(mapping);
      return acc;
    },
    {} as Record<string, AyahMapping[]>
  );

  // Calculate statistics
  const uniqueSurahs = new Set(topicMappings.map((m) => m.surahNumber));
  const totalAyat = topicMappings.reduce(
    (sum, m) => sum + (m.ayahEnd - m.ayahStart + 1),
    0
  );

  // Get related topics
  const relatedTopics = topic.relatedTopicIds
    .map((id: string) => getCanonicalTopic(id))
    .filter((t): t is CanonicalTopic => t !== null);

  // MFD-07 Phase 9: Get related Arabic roots via enrichment layer
  const enrichment = getTopicEnrichment(topic.id);
  const relatedRoots = (enrichment?.relatedRoots ?? [])
    .map((slug: string) => {
      const rootEntry = getSprint48RootBySlug(slug);
      return rootEntry ? { slug, root: rootEntry.root, transliteration: rootEntry.transliteration } : null;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  const topicPagePath = `/explore/topics/${topic.id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: topic.title,
    description: topic.description,
    url: absoluteUrl(topicPagePath),
    inLanguage: ["en", "ar", "ur"],
    keywords: topic.searchAliases.join(", "),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <JsonLd nodes={[jsonLd]} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              Explore
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link href="/explore/topics" className="hover:text-primary transition-colors">
              Topics
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="text-foreground">{topic.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {topic.title}
            </h1>
            {topic.arabicTitle && (
              <p className="arabic-display text-2xl text-gold" lang="ar" dir="rtl" aria-label={`Arabic title: ${topic.arabicTitle}`}>
                {topic.arabicTitle}
              </p>
            )}
            {topic.urduTitle && (
              <p className="text-xl text-muted-foreground" lang="ur" dir="rtl">
                {topic.urduTitle}
              </p>
            )}
          </div>
          <Tag className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        </div>

        {/* Parent links */}
        <div className="flex flex-wrap gap-2">
          {parentDomain && (
            <Link href={`/explore/domains/${parentDomain.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary">
              <FolderTree className="h-3 w-3" aria-hidden />
              {parentDomain.title}
            </Link>
          )}
          {parentDimension && (
            <Link href={`/explore/dimensions/${parentDimension.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
              <Compass className="h-3 w-3" aria-hidden />
              {parentDimension.title}
            </Link>
          )}
          {parentSubdimension && (
            <Link href={`/explore/sub-dimensions/${parentSubdimension.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80">
              <Layers className="h-3 w-3" aria-hidden />
              {parentSubdimension.title}
            </Link>
          )}
        </div>

        {/* Description */}
        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Description</p>
          <p className="text-base text-foreground leading-relaxed">{topic.description}</p>
          {topic.scope && (
            <>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 mt-4">Scope</p>
              <p className="text-sm text-muted-foreground">{topic.scope}</p>
            </>
          )}
        </div>

        {/* Provenance notice */}
        <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>
              <strong>Pending scholarly review.</strong> This topic is part of the expanded canonical taxonomy. It has not been reviewed or approved by scholars. This is not a scholarly classification of the Quran.
            </span>
          </p>
        </aside>
      </header>

      {/* Statistics */}
      <section aria-labelledby="statistics-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="statistics-heading" className="font-display text-lg font-semibold tracking-tight mb-4">
          Ayah Mappings Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Total Ayat</p>
            <p className="text-2xl font-semibold text-foreground">{totalAyat}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Unique Surahs</p>
            <p className="text-2xl font-semibold text-foreground">{uniqueSurahs.size}</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-background/50 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Mapping Types</p>
            <p className="text-2xl font-semibold text-foreground">{Object.keys(mappingsByType).length}</p>
          </div>
        </div>
      </section>

      {/* Ayah Mappings */}
      {topicMappings.length > 0 && (
        <section aria-labelledby="ayah-mappings-heading" className="space-y-6">
          <div>
            <h2 id="ayah-mappings-heading" className="font-display text-xl font-semibold tracking-tight">
              Ayah Mappings ({topicMappings.length})
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Quranic verses mapped to this topic with their relationship types and rationales.
            </p>
          </div>

          {Object.entries(mappingsByType).map(([mappingType, mappings]) => (
            <div key={mappingType} className="space-y-3">
              <h3 className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {mappingType.replace(/_/g, " ")}
                </span>
                <span className="text-sm font-normal text-muted-foreground">
                  ({mappings.length} mapping{mappings.length === 1 ? "" : "s"})
                </span>
              </h3>

              <div className="space-y-3">
                {mappings.map((mapping) => {
                  const surah = getSurah(mapping.surahNumber);
                  if (!surah) return null;

                  const ayat = surah.ayat.slice(mapping.ayahStart - 1, mapping.ayahEnd);

                  return (
                    <article key={mapping.id} className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">
                            {surah.transliteration} {mapping.surahNumber}:{mapping.ayahStart}
                            {mapping.ayahEnd !== mapping.ayahStart && `-${mapping.ayahEnd}`}
                          </p>
                          <Link href={`/ayah/${mapping.surahNumber}/${mapping.ayahStart}`} className="shrink-0 rounded-lg border border-border/80 bg-card px-3 py-1 text-xs font-medium transition-colors hover:bg-secondary/50">
                            View full ayah →
                          </Link>
                        </div>
                        <p className="text-sm text-muted-foreground">{mapping.rationale}</p>
                      </div>

                      <div className="space-y-3 border-t border-border/40 pt-4">
                        {ayat.map((ayah) => (
                          <div key={ayah.ayah} className="space-y-2">
                            <p className="arabic-display text-2xl leading-loose text-foreground" lang="ar" dir="rtl">
                              {ayah.arabic}
                              <span className="inline-block mx-2 text-gold text-lg">۝{ayah.ayah}</span>
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">{ayah.translation}</p>
                            {ayah.transliteration && (
                              <p className="text-xs italic text-muted-foreground/80">{ayah.transliteration}</p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-3">
                        <span>Mapping ID: {mapping.id}</span>
                        <span className="uppercase tracking-wider">{mapping.status}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Related Topics */}
      {relatedTopics.length > 0 && (
        <section aria-labelledby="related-topics" className="space-y-3">
          <h2 id="related-topics" className="font-display text-lg font-semibold tracking-tight">
            Related Topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {relatedTopics.map((relatedTopic: CanonicalTopic) => (
              <Link key={relatedTopic.id} href={`/explore/topics/${relatedTopic.id}`} className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary">
                {relatedTopic.title}
                {relatedTopic.arabicTitle && (
                  <span className="arabic-display text-xs" lang="ar" dir="rtl" aria-hidden>
                    {relatedTopic.arabicTitle}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Arabic Roots */}
      {relatedRoots.length > 0 && (
        <section aria-labelledby="related-roots" className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
          <div>
            <h2 id="related-roots" className="font-display text-lg font-semibold tracking-tight">
              Related Arabic Roots (suggested connections)
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Root connections are heuristic suggestions based on topic keywords. They are not authoritative classifications.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {relatedRoots.map((root) => (
              <Link key={root.slug} href={`/explore/root/${root.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/40 px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/70">
                <span className="arabic-display text-base text-gold" lang="ar" dir="rtl">
                  {root.root}
                </span>
                {root.transliteration && (
                  <span className="text-xs text-muted-foreground">({root.transliteration})</span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Search Aliases */}
      {topic.searchAliases.length > 0 && (
        <section aria-labelledby="search-aliases" className="space-y-3">
          <h2 id="search-aliases" className="font-display text-lg font-semibold tracking-tight flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" aria-hidden />
            Search Aliases
          </h2>
          <div className="flex flex-wrap gap-2">
            {topic.searchAliases.map((alias: string) => (
              <Link key={alias} href={`/search?q=${encodeURIComponent(alias)}`} className="inline-flex items-center rounded-full border border-border/80 bg-card px-3 py-1.5 text-sm transition-colors hover:border-primary/30 hover:bg-secondary/50">
                {alias}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contextual Navigation */}
      <section aria-labelledby="context-nav" className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
        <h2 id="context-nav" className="font-display text-lg font-semibold tracking-tight">
          Explore in Context
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {parentDomain && (
            <Link href={`/explore/domains/${parentDomain.id}`} className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:bg-secondary/40">
              <div className="flex items-center gap-2 mb-2">
                <FolderTree className="h-4 w-4 text-primary" aria-hidden />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Domain</p>
              </div>
              <p className="text-sm font-medium text-foreground">{parentDomain.title}</p>
            </Link>
          )}
          {parentDimension && (
            <Link href={`/explore/dimensions/${parentDimension.id}`} className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:bg-secondary/40">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="h-4 w-4 text-primary" aria-hidden />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Dimension</p>
              </div>
              <p className="text-sm font-medium text-foreground">{parentDimension.title}</p>
            </Link>
          )}
          {parentSubdimension && (
            <Link href={`/explore/sub-dimensions/${parentSubdimension.id}`} className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:bg-secondary/40">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-primary" aria-hidden />
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Subdimension</p>
              </div>
              <p className="text-sm font-medium text-foreground">{parentSubdimension.title}</p>
            </Link>
          )}
        </div>
      </section>

      {/* Back navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-6">
        <Link href="/explore/topics" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all topics
        </Link>
        <Link href="/explore" className="text-sm text-muted-foreground transition-colors hover:text-primary">
          Explore home
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// Legacy Topic View
// ============================================================================

async function LegacyTopicView({ topic }: { topic: typeof TOPICS[number] }) {
  const allDimensions = getAllDimensionsForTopic(topic.slug);
  const allDomains = getAllDomainsForTopic(topic.slug);
  const relatedJourneys = getJourneysForTopic(topic.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    name: topic.title,
    description: topic.summary,
    url: absoluteUrl(`/explore/topics/${topic.slug}`),
    inLanguage: [topic.language, "ar"],
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <JsonLd nodes={[jsonLd]} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/explore" className="hover:text-primary transition-colors">
              Explore
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li>
            <Link href="/topics" className="hover:text-primary transition-colors">
              Topics
            </Link>
          </li>
          <li aria-hidden>·</li>
          <li className="text-foreground">{topic.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {topic.title}
            </h1>
            <p className="arabic-display text-2xl text-gold" lang="ar" dir="rtl" aria-label={`Arabic title: ${topic.arabicTitle}`}>
              {topic.arabicTitle}
            </p>
          </div>
          <Tag className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        </div>

        <p className="text-lg leading-relaxed text-muted-foreground">{topic.summary}</p>

        {/* Review status notice */}
        <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>
              <strong>Pending scholarly review.</strong> This topic is an editorial selection of well-known ayat — entry points for reflection, not tafsir. Each verse relation carries its editorial method, curator, review date, and status.
            </span>
          </p>
        </aside>
      </header>

      {/* Contextual navigation */}
      <section aria-labelledby="context-nav" className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
        <h2 id="context-nav" className="font-display text-lg font-semibold tracking-tight">
          Explore this topic in context
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {allDimensions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Compass className="h-4 w-4 text-primary" aria-hidden />
                <span>{allDimensions.length === 1 ? "Dimension" : `Dimensions (${allDimensions.length})`}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allDimensions.map((dim) => (
                  <Link key={dim.id} href={getDimensionUrl(dim.id)} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
                    {dim.title}
                    <span className="arabic-display text-xs" lang="ar" dir="rtl" aria-hidden>
                      {dim.arabicTitle}
                    </span>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Dimensions are navigation aids grouping related topics.</p>
            </div>
          )}

          {allDomains.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FolderTree className="h-4 w-4 text-primary" aria-hidden />
                <span>{allDomains.length === 1 ? "Domain" : `Domains (${allDomains.length})`}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allDomains.map((domain) => (
                  <Link key={domain.id} href={getDomainUrl(domain.id)} className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary">
                    {domain.title}
                    {domain.arabicTitle && (
                      <span className="arabic-display text-xs" lang="ar" dir="rtl" aria-hidden>
                        {domain.arabicTitle}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Domains are organizational proposals pending review.</p>
            </div>
          )}
        </div>

        {relatedJourneys.length > 0 && (
          <div className="space-y-2 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Map className="h-4 w-4 text-primary" aria-hidden />
              <span>Related study journey{relatedJourneys.length === 1 ? "" : "s"} ({relatedJourneys.length})</span>
            </div>
            <div className="space-y-2">
              {relatedJourneys.map((journey) => (
                <Link key={journey.slug} href={getJourneyUrl(journey.slug)} className="block rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:bg-secondary/40">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">{journey.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{journey.summary}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      {journey.difficulty}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Curated ayat */}
      <section aria-labelledby="ayat-heading" className="space-y-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 id="ayat-heading" className="font-display text-xl font-semibold tracking-tight">
            Curated ayat ({topic.relations.length})
          </h2>
          <p className="text-xs text-muted-foreground">Editorial selection, not exhaustive</p>
        </div>

        <div className="space-y-3">
          {topic.relations.map((relation, index: number) => {
            const surahNum = relation.ref.surah;
            const ayahNum = relation.ref.ayah;
            const relationTypeLabel = RELATION_TYPE_LABELS[relation.type as keyof typeof RELATION_TYPE_LABELS];

            return (
              <article key={`${surahNum}:${ayahNum}-${index}`} className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-secondary/30">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{relationTypeLabel}</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{relation.rationale}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                      Pending review
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-3">
                    <p className="text-xs text-muted-foreground">Surah {surahNum}, Ayah {ayahNum}</p>
                    <Link href={`/ayah/${surahNum}/${ayahNum}?from=topic&topic=${topic.slug}`} className="shrink-0 rounded-lg border border-border/80 bg-card px-3 py-1 text-xs font-medium transition-colors hover:bg-secondary/50">
                      View ayah →
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Related topics */}
      {topic.related.length > 0 && (
        <section aria-labelledby="related-topics" className="space-y-3">
          <h2 id="related-topics" className="font-display text-lg font-semibold tracking-tight">
            Related topics
          </h2>
          <div className="flex flex-wrap gap-2">
            {topic.related.map((relatedSlug: string) => {
              const relatedTopic = TOPICS.find((t) => t.slug === relatedSlug);
              if (!relatedTopic) return null;
              return (
                <Link key={relatedSlug} href={getTopicUrl(relatedSlug)} className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary">
                  {relatedTopic.title}
                  <span className="arabic-display text-xs" lang="ar" dir="rtl" aria-hidden>
                    {relatedTopic.arabicTitle}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Canonical Topics */}
      {(() => {
        const canonicalIds = getCanonicalTopicsForLegacyTopic(topic.slug);
        const canonicalTopics = canonicalIds
          .map((id) => getCanonicalTopic(id))
          .filter((t): t is NonNullable<typeof t> => t !== null);
        if (canonicalTopics.length === 0) return null;
        return (
          <section aria-labelledby="canonical-topics" className="space-y-3 rounded-2xl border border-border/80 bg-card p-5">
            <h2 id="canonical-topics" className="font-display text-lg font-semibold tracking-tight">
              Related Canonical Topics
            </h2>
            <p className="text-sm text-muted-foreground">
              Explore the expanded taxonomy for deeper knowledge discovery on this theme.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {canonicalTopics.map((ct) => (
                <Link key={ct.id} href={`/explore/topics/${ct.id}`} className="group rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:border-primary/30 hover:bg-secondary/40">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {ct.title}
                    </h3>
                    {ct.arabicTitle && (
                      <span className="arabic-display text-sm text-gold shrink-0" lang="ar" dir="rtl" aria-hidden>
                        {ct.arabicTitle}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{ct.description}</p>
                  {ct.specialized && (
                    <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      specialized
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Provenance */}
      <section className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p className="mb-2">
          <strong className="text-foreground">Editorial provenance:</strong> {topic.provenance.method}
        </p>
        <p>
          Curated by {topic.provenance.curator} · Last reviewed {topic.provenance.reviewedAt} · Status: {topic.provenance.status.replace(/-/g, " ")}
        </p>
      </section>

      {/* Back navigation */}
      <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-6">
        <Link href="/topics" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to all topics
        </Link>
        <Link href="/explore" className="text-sm text-muted-foreground transition-colors hover:text-primary">
          Explore home
        </Link>
      </div>
    </div>
  );
}
