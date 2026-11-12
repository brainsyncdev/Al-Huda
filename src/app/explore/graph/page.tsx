import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GitBranch, Layers, Tag } from "lucide-react";
import { buildCanonicalKnowledgeGraph } from "@/lib/graph/canonical-knowledge-graph";
import { getGraphEnrichmentData } from "@/lib/graph/canonical-graph-enrichment";
import { CanonicalGraphExplorer } from "@/components/graph/canonical-graph-explorer";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Knowledge Graph Explorer — Quran Knowledge System",
  description:
    "Interactive graph of 20 domains, 98 dimensions, 25 subdimensions, and 176 topics showing hierarchical and semantic relationships across the Quranic knowledge taxonomy.",
  alternates: { canonical: absoluteUrl("/explore/graph") },
};

export default function GraphPage() {
  const enrichmentData = getGraphEnrichmentData();
  const graph = buildCanonicalKnowledgeGraph(enrichmentData);

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Explore", path: "/explore" },
            { name: "Knowledge Graph", path: "/explore/graph" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Knowledge Graph Explorer — Quran Knowledge System",
            description:
              "Interactive graph of the canonical taxonomy with hierarchical and semantic relationships.",
            url: absoluteUrl("/explore/graph"),
            inLanguage: ["en", "ar", "ur"],
          },
        ]}
      />

      <header className="space-y-4">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Explore
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Knowledge Graph Explorer
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              A visual map of the canonical taxonomy showing how domains,
              dimensions, subdimensions, and topics connect through hierarchical
              and semantic relationships. Every node and edge carries its
              editorial review status.
            </p>
          </div>
          <GitBranch className="h-8 w-8 shrink-0 text-primary" aria-hidden />
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Domains
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {graph.counts.domains}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Dimensions
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {graph.counts.dimensions}
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
              {graph.counts.topics}
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <GitBranch className="h-4 w-4 text-primary" aria-hidden />
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Relationships
              </p>
            </div>
            <p className="text-2xl font-semibold text-primary">
              {graph.counts.totalEdges}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <span className="mt-0.5 h-4 w-4 shrink-0 text-gold">⚠</span>
            <span>
              <strong>Pending scholarly review.</strong> This graph visualizes{" "}
              {graph.counts.totalNodes} entities and{" "}
              {graph.counts.totalEdges} relationships from the canonical
              taxonomy. All content carries{" "}
              <strong>pending-scholarly-review</strong> status. This is an
              organizational framework for knowledge discovery, not a scholarly
              classification of the Quran.
            </span>
          </p>
        </div>
      </header>

      <CanonicalGraphExplorer graph={graph} />

      <section className="rounded-2xl border border-border/80 bg-card p-6">
        <h2 className="font-display text-lg font-semibold tracking-tight mb-3">
          About this graph
        </h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Node types:</strong> Domains (broad areas), Dimensions
            (major knowledge areas), Subdimensions (specialized groupings),
            Topics (individual subjects).
          </p>
          <p>
            <strong>Relationship types:</strong> CONTAINS (hierarchical),
            BELONGS_TO (membership), RELATED_TO (semantic), CROSS_REFERENCES
            (cross-domain), SHARES_CONCEPT (thematic).
          </p>
          <p>
            <strong>Navigation:</strong> Click nodes to see details. Use filters
            to focus on specific entity types or relationship types. Search to
            find specific entities.
          </p>
        </div>
      </section>
    </div>
  );
}
