// /explore/concepts — Qur'anic Concept Clusters
//
// Layer 3 (Qur'anic Concepts) scaffolding: surfaces existing SHARES_CONCEPT
// relationships from the canonical taxonomy as navigable concept clusters.
//
// IMPORTANT SCHOLARLY GUARDRAILS (Section 4 + Section 7):
//
//   - These clusters are derived from editorial topic relationships, NOT from
//     independent scholarly concept analysis. They are a NAVIGATION AID.
//
//   - Every cluster carries "pending-scholarly-review" provenance. The UI
//     makes this visibly distinct from approved scholarship.
//
//   - A "concept" here means "two or more topics that share an underlying
//     Qur'anic theme" — not a formally defined doctrinal unit.
//
//   - This page does not fabricate concepts. It only exposes relationships
//     already present in data/taxonomy/relationships.json.

import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, BookOpen, Compass } from "lucide-react";
import {
  getCanonicalRelationships,
  getCanonicalTopic,
  type CanonicalRelationship,
  type CanonicalTopic,
} from "@/lib/taxonomy/canonical-adapter";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Qur'anic Concept Clusters — Explore",
  description:
    "Cross-cutting themes that connect multiple Qur'anic topics. Derived from editorial relationships, pending scholarly review.",
  alternates: { canonical: absoluteUrl("/explore/concepts") },
};

interface ConceptCluster {
  /** The relationship that defines this cluster. */
  relationship: CanonicalRelationship;
  /** Source topic (resolved). */
  sourceTopic: CanonicalTopic | null;
  /** Target topic (resolved). */
  targetTopic: CanonicalTopic | null;
}

function buildConceptClusters(): ConceptCluster[] {
  const relationships = getCanonicalRelationships();
  const sharesConceptRels = relationships.filter(
    (r) => r.type === "SHARES_CONCEPT"
  );

  return sharesConceptRels.map((rel) => ({
    relationship: rel,
    sourceTopic: getCanonicalTopic(rel.sourceId),
    targetTopic: getCanonicalTopic(rel.targetId),
  }));
}

export default function ConceptsPage() {
  const clusters = buildConceptClusters();

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Qur'anic Concept Clusters",
            description:
              "Cross-cutting themes connecting multiple Qur'anic topics, derived from editorial relationships.",
            url: absoluteUrl("/explore/concepts"),
            inLanguage: ["en", "ar"],
          },
        ]}
      />

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Compass className="h-8 w-8 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Qur'anic Concept Clusters
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Cross-cutting themes that span multiple areas of Qur'anic guidance.
          Each cluster connects two or more topics through a shared underlying
          concept — patience, gratitude, justice, trust, and others.
        </p>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden
            />
            <span>
              These concept clusters are derived from <strong>editorial topic relationships</strong>,
              not from independent scholarly concept analysis. All connections are{" "}
              <strong>pending scholarly review</strong>. They serve as navigation aids to help you
              discover how Qur'anic themes interconnect — not as established doctrinal definitions.
            </span>
          </p>
        </div>
      </header>

      {/* Concept clusters grid */}
      <section aria-labelledby="clusters-heading" className="space-y-6">
        <div>
          <h2
            id="clusters-heading"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            {clusters.length} Concept Clusters
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Each cluster shows a cross-cutting theme and the topics it connects.
            Select a topic to explore its ayat, related passages, and reflections.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {clusters.map(({ relationship, sourceTopic, targetTopic }) => (
            <div
              key={relationship.id}
              className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              {/* Cluster theme label */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {extractThemeLabel(relationship.description)}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Pending review
                </span>
              </div>

              {/* Theme description */}
              <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                {relationship.description}
              </p>

              {/* Connected topics */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Connects
                </p>
                <div className="flex flex-wrap gap-2">
                  {sourceTopic && (
                    <Link
                      href={`/explore/topics/${sourceTopic.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {sourceTopic.arabicTitle && (
                        <span
                          className="arabic-display text-xs text-gold"
                          lang="ar"
                          dir="rtl"
                          aria-hidden
                        >
                          {sourceTopic.arabicTitle}
                        </span>
                      )}
                      {sourceTopic.title}
                    </Link>
                  )}
                  {targetTopic && (
                    <Link
                      href={`/explore/topics/${targetTopic.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-3 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {targetTopic.arabicTitle && (
                        <span
                          className="arabic-display text-xs text-gold"
                          lang="ar"
                          dir="rtl"
                          aria-hidden
                        >
                          {targetTopic.arabicTitle}
                        </span>
                      )}
                      {targetTopic.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guidance section */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-3">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          How to use concept clusters
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              <strong>Start with a theme</strong> that resonates with your current question or
              situation — patience during difficulty, gratitude for blessings, justice in
              relationships.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              <strong>Follow the connected topics</strong> to discover ayat from different parts
              of the Qur'an that address the same underlying theme.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              <strong>Read across passages</strong> to see how the Qur'an develops a concept in
              different contexts — commands, narratives, parables, and prayers.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
            <span>
              <strong>Reflect personally</strong> using the prompts on each ayah page. Remember
              that these clusters are editorial aids — your understanding should be grounded in
              the Qur'anic text itself and verified scholarly sources.
            </span>
          </li>
        </ul>
      </section>

      {/* Navigation links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          ← Back to Explore
        </Link>
        <Link
          href="/explore/graph"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open Knowledge Graph →
        </Link>
      </div>
    </div>
  );
}

/**
 * Extract a short theme label from a SHARES_CONCEPT relationship description.
 *
 * Descriptions follow the pattern: "Cross-cutting theme: <Label> (<Arabic>) spans ..."
 * We extract the label portion for display as the cluster heading.
 */
function extractThemeLabel(description: string): string {
  // Try to extract "Cross-cutting theme: <Label>" prefix
  const match = description.match(/^Cross-cutting theme:\s*(.+?)\s*\(/);
  if (match) return match[1].trim();

  // Fallback: take first clause before "spans"
  const spansIdx = description.indexOf(" spans ");
  if (spansIdx > 0) return description.slice(0, spansIdx).replace(/^Cross-cutting theme:\s*/, "").trim();

  // Last resort: truncate
  return description.length > 60 ? description.slice(0, 57) + "…" : description;
}
