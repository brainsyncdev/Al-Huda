// /explore/topics — Unified Topic Explorer
// MFD-07 Phase 6: Shows BOTH canonical (182) and legacy (18) topics

import Link from "next/link";
import type { Metadata } from "next";
import { TOPICS } from "@/lib/topics/data";
import {
  getCanonicalTopics,
  getCanonicalDomain,
  type CanonicalTopic,
} from "@/lib/taxonomy/canonical-adapter";
import topicAyahMappings from "../../../../data/taxonomy/topic-ayah-mappings.json";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import {
  AlertTriangle,
  BookOpen,
  Compass,
  FolderTree,
  Tag,
} from "lucide-react";

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

export const metadata: Metadata = {
  title: "Explore Topics — Unified Quranic Themes",
  description:
    "Discover the Quran through 182 canonical topics and 18 curated editorial topics. Explore themes with ayah mappings, rationales, and scholarly context.",
  alternates: { canonical: absoluteUrl("/explore/topics") },
};

export default function ExploreTopicsPage() {
  const canonicalTopics = getCanonicalTopics();
  const allMappings = topicAyahMappings as AyahMapping[];
  const legacyTopics = TOPICS;

  // Build ayah count index for canonical topics
  const ayahCountByTopicId: Record<string, number> = {};
  for (const mapping of allMappings) {
    if (!ayahCountByTopicId[mapping.topicId]) {
      ayahCountByTopicId[mapping.topicId] = 0;
    }
    ayahCountByTopicId[mapping.topicId] +=
      mapping.ayahEnd - mapping.ayahStart + 1;
  }

  // Statistics
  const totalCanonicalAyahMappings = allMappings.length;
  const domainsWithTopics = new Set(
    canonicalTopics.map((t) => t.parentDomainId)
  ).size;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Explore Topics — Unified Quranic Themes",
    description:
      "Discover the Quran through 182 canonical topics and 18 curated editorial topics.",
    url: absoluteUrl("/explore/topics"),
    inLanguage: ["en", "ar", "ur"],
  };

  return (
    <div className="space-y-10 pb-12">
      <JsonLd nodes={[jsonLd]} />

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Tag className="h-8 w-8 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore Topics
          </h1>
        </div>
        <p className="max-w-3xl text-lg text-muted-foreground">
          Discover the Quran through a unified collection of{" "}
          <strong>{canonicalTopics.length} canonical topics</strong> (expanded
          taxonomy with ayah mappings) and{" "}
          <strong>{legacyTopics.length} curated editorial topics</strong>{" "}
          (well-known verses grouped by theme).
        </p>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Canonical Topics
            </p>
            <p className="text-2xl font-semibold text-primary">
              {canonicalTopics.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Editorial Topics
            </p>
            <p className="text-2xl font-semibold text-primary">
              {legacyTopics.length}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Ayah Mappings
            </p>
            <p className="text-2xl font-semibold text-primary">
              {totalCanonicalAyahMappings}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Domains Covered
            </p>
            <p className="text-2xl font-semibold text-primary">
              {domainsWithTopics}
            </p>
          </div>
        </div>

        <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Pending scholarly review.</strong> Canonical topics are
              part of the expanded taxonomy with ayah mappings. Editorial topics
              are curated selections of well-known ayat. Neither represents a
              scholarly classification of the Quran.
            </span>
          </p>
        </aside>
      </header>

      {/* Section 1: Canonical Topics */}
      <section
        aria-labelledby="canonical-topics-heading"
        className="space-y-5"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2
              id="canonical-topics-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              Canonical Topics ({canonicalTopics.length})
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Expanded taxonomy with ayah mappings, rationales, and domain
              classification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" aria-hidden />
            <span className="text-xs text-muted-foreground">
              Organized by domain
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {canonicalTopics.slice(0, 60).map((topic: CanonicalTopic) => {
            const domain = getCanonicalDomain(topic.parentDomainId);
            const ayahCount = ayahCountByTopicId[topic.id] || 0;

            return (
              <Link
                key={topic.id}
                href={`/explore/topics/${topic.id}`}
                className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  {topic.arabicTitle && (
                    <span
                      className="arabic-display text-xl text-gold shrink-0"
                      lang="ar"
                      dir="rtl"
                      aria-hidden
                    >
                      {topic.arabicTitle}
                    </span>
                  )}
                </div>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {topic.description}
                </p>

                <div className="mt-auto pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {ayahCount} ayah{ayahCount === 1 ? "" : "s"}
                    </span>
                    <span className="text-primary font-medium group-hover:underline">
                      Explore →
                    </span>
                  </div>

                  {domain && (
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                        <FolderTree className="h-2.5 w-2.5 mr-1" />
                        {domain.title}
                      </span>
                      {topic.specialized && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
                          specialized
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {canonicalTopics.length > 60 && (
          <p className="text-sm text-muted-foreground text-center">
            Showing 60 of {canonicalTopics.length} canonical topics. Use the
            domain explorer to browse by category.
          </p>
        )}
      </section>

      {/* Section 2: Featured Thematic Topics (Legacy) */}
      <section
        aria-labelledby="legacy-topics-heading"
        className="space-y-5"
      >
        <div>
          <h2
            id="legacy-topics-heading"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            Featured Thematic Entry Points ({legacyTopics.length})
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Curated editorial topics — well-known verses grouped by theme. Each
            topic is an entry point for reflection, not tafsir.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...legacyTopics]
            .sort((a, b) => b.relations.length - a.relations.length)
            .map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <span
                    className="arabic-display text-2xl text-gold shrink-0"
                    lang="ar"
                    dir="rtl"
                    aria-hidden
                  >
                    {topic.arabicTitle}
                  </span>
                </div>

                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {topic.summary}
                </p>

                <div className="mt-auto pt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <BookOpen className="h-3 w-3" />
                      {topic.relations.length} verse
                      {topic.relations.length === 1 ? "" : "s"}
                    </span>
                    <span className="text-primary font-medium group-hover:underline">
                      Explore →
                    </span>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-gold-soft px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    editorial selection
                  </span>
                </div>
              </Link>
            ))}
        </div>
      </section>

      {/* About section */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          About the Two Topic Systems
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" aria-hidden />
              Canonical Topics
            </h3>
            <p className="text-sm text-muted-foreground">
              Part of the expanded taxonomy (182 topics across 20 domains). Each
              topic has ayah mappings with typed relationships (direct reference,
              explicit instruction, thematic connection) and rationales. These
              provide structured knowledge discovery.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" aria-hidden />
              Editorial Topics
            </h3>
            <p className="text-sm text-muted-foreground">
              18 curated selections of well-known ayat — entry points for
              reflection. Each verse relation is typed (thematic association,
              lexical match, cross-reference, sequential context) with a neutral
              rationale. These are not tafsir and not rulings.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation hints */}
      <aside className="rounded-2xl border border-border/80 bg-muted/30 p-5 text-sm text-muted-foreground space-y-2">
        <p>
          Looking for structured learning? Try{" "}
          <Link
            href="/learn/journeys"
            className="text-primary hover:underline font-medium"
          >
            Study Journeys
          </Link>
          , which organize topics and ayat into sequenced learning experiences.
        </p>
        <p>
          Browse by domain? Visit the{" "}
          <Link
            href="/explore/domains"
            className="text-primary hover:underline font-medium"
          >
            Domain Explorer
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
