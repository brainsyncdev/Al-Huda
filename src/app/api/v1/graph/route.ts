import type { NextRequest } from "next/server";
import { apiOk, guarded } from "@/lib/api/v1";
import { GRAPH_VERSION, buildKnowledgeGraph } from "@/lib/graph/knowledge-graph";

// GET /api/v1/graph — the provenance-aware knowledge-graph foundation
// (PRD §12.3, Sprint 3). Read-only and deterministic: nodes are the ten
// Explore dimensions plus the curated topic catalog, and edges are only the
// relationships the existing editorial data supports. No ayah-level dimension
// tags are emitted.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return guarded(request, () =>
    apiOk(buildKnowledgeGraph(), { graphVersion: GRAPH_VERSION })
  );
}