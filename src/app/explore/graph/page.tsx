import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buildKnowledgeGraph } from "@/lib/graph/knowledge-graph";
import { KnowledgeGraphExplorer } from "@/components/graph/knowledge-graph-explorer";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Knowledge Graph Explorer — Explore the Quran",
  description:
    "Interactive graph of the 10 life dimensions and curated topics, showing editorial navigation mappings and lateral topic relationships with full provenance.",
  alternates: { canonical: absoluteUrl("/explore/graph") },
};

export default function GraphPage() {
  const graph = buildKnowledgeGraph();

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
            name: "Knowledge Graph Explorer — 10 Dimensions of the Quran",
            description:
              "Interactive graph of dimensions and curated topics with editorial navigation mappings and provenance.",
            url: absoluteUrl("/explore/graph"),
            inLanguage: ["en", "ar"],
          },
        ]}
      />

      <header className="space-y-3">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Explore
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Knowledge Graph Explorer
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A visual map of the ten life dimensions and curated topics, showing
          how dimensions connect to topics and how topics relate to each other.
          Every node and edge carries its editorial review status.
        </p>
      </header>

      <KnowledgeGraphExplorer graph={graph} />
    </div>
  );
}
