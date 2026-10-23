# Sprint 3 Report — Knowledge Graph Foundation

**Date:** 2026-10-23
**Scope:** A minimal, provenance-aware, serializable graph connecting the ten Explore dimensions and the curated topic catalog.
**Status:** Implemented; verification commands NOT run per instruction.

---

## What was inspected first

- `src/components/topics/topic-graph.tsx` — existing circular SVG graph. Edges come only from `Topic.related`; nodes are `Topic` objects; no dimension nodes, no serialized form, no edge provenance.
- `src/lib/topics/data.ts` — 11 curated topics, each with `related: string[]`, typed ayah relations, and a `ProvenanceRecord`.
- `src/lib/explore/dimensions.ts` — 10 dimensions with `topicSlugs: string[]` and `DIMENSION_PROVENANCE`.
- `src/app/api/v1/topics/route.ts`, `src/app/api/v1/topics/[slug]/route.ts` — existing response envelope, provenance serialization, and note conventions.
- `src/lib/api/v1.ts` — `apiOk(data, meta)`, `apiError(code, message, status, hint)`, `guarded()`, and rate limiting.
- `src/app/api/v1/route.ts` — API inventory.

---

## Design decision

The PRD (§12.3) envisions a graph covering dimensions, surahs, roots, and ayat. Only two relationships are actually supported by existing editorial data:

1. **Dimension → topic navigation** from `Dimension.topicSlugs`.
2. **Topic ↔ topic lateral curation** from `Topic.related`.

No ayah-level dimension tags, root nodes, or surah-dimension edges exist in the data, and inventing them would create unsupported religious claims. Sprint 3 therefore serializes only these two relationship types, with the distinction made explicit in each edge's `type` and `relationshipScope`. No D3/Cytoscape dependency was added; the existing `TopicGraph` component is untouched and continues to work.

---

## Graph schema

Module: `src/lib/graph/knowledge-graph.ts` (pure; no React, fs, or network).

```ts
type KnowledgeGraph = {
  version: "1";
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  counts: KnowledgeGraphCounts;
  unresolved: UnresolvedReference[];
  notes: string[];
};
```

### Node

```ts
type KnowledgeGraphNode = {
  id: string;                 // "dimension:spiritual" | "topic:patience"
  kind: "dimension" | "topic";
  slug: string;               // canonical catalog slug
  label: string;              // English title
  arabicLabel: string;
  url: string;                // /explore/dimension/... or /topics/...
  ordinal: number | null;     // dimension number 1–10; null for topics
  language: string | null;    // topic editorial BCP 47 tag; null for dimensions
  description: string;        // editorial summary/description; never Quran text
  status: "pending-scholarly-review" | "editorial-approved";
  provenance: { method, curator, reviewedAt, status };
};
```

### Edge

```ts
type KnowledgeGraphEdge = {
  id: string;                 // "dimension-topic:spiritual--patience"
                              // "topic-relation:patience--hardship-and-ease"
  type: "DIMENSION_TOPIC" | "TOPIC_RELATION";
  typeLabel: string;
  source: string;             // node id
  target: string;             // node id
  relationshipScope:
    | "editorial-navigation-mapping"
    | "curated-topic-relationship";
  scopeNote: string;          // plain-language boundary of what the edge asserts
  status: "pending-scholarly-review" | "editorial-approved";
  provenance: EdgeProvenanceDeclaration[];
};

type EdgeProvenanceDeclaration = {
  declaredBy: string;         // node id of the catalog record that declared it
  method: string;
  curator: string;
  reviewedAt: string;
  status: "pending-scholarly-review" | "editorial-approved";
};
```

### Unresolved reference

```ts
type UnresolvedReference = {
  from: string;               // declaring node id
  field: "topicSlugs" | "related";
  value: string;              // the slug that failed to resolve
  reason: string;
};
```

---

## Supported relationship types

| Type | Source field | Direction | Scope | Meaning |
|------|--------------|-----------|-------|---------|
| `DIMENSION_TOPIC` | `Dimension.topicSlugs` | dimension → topic | `editorial-navigation-mapping` | "This dimension's theme overlaps this curated topic." It does **not** assert that any ayah belongs to the dimension. |
| `TOPIC_RELATION` | `Topic.related` | undirected; endpoints sorted alphabetically | `curated-topic-relationship` | A curated lateral link between two editorial topics. Not interpretation, not tafsir, not a ruling. |

`declaredBy` preserves which catalog record asserted a `TOPIC_RELATION`, so canonicalizing endpoint order does not lose editorial direction. Duplicate assertions of the same unordered pair are collapsed into one edge with multiple declarations.

---

## Provenance rules

1. **Node provenance is inherited verbatim** from the catalog record: `Topic.provenance` for topics, `DIMENSION_PROVENANCE` for dimensions. No new review state is invented.
2. **Edge status is conservative.** An edge is `editorial-approved` only when every declaration is approved. One pending declaration keeps the whole edge `pending-scholarly-review`.
3. **Every edge names its declarer** in `provenance[].declaredBy`, so a consumer can trace an edge back to the exact catalog entry.
4. **No fabricated relationships.** If a `topicSlugs` or `related` slug does not resolve, the reference is placed in `unresolved` and no edge is emitted. It is never silently dropped and never redirected to an unrelated topic.
5. **No ayah-level claims.** The module emits no ayah nodes, no surah nodes, no root nodes, and no dimension-to-ayah edges.
6. **Current state is honest:** all 10 dimensions and all 11 topics are `pending-scholarly-review`, so every node and edge in this release is pending. The graph cannot imply scholarly approval.

---

## Serialization and API

- `buildKnowledgeGraph()` is deterministic: catalog order for nodes, sorted endpoint ids for topic edges. Two calls produce identical output.
- `GET /api/v1/graph` returns the full graph in the standard `{ version, meta, data }` envelope, with `graphVersion` in `meta`. It uses the existing `guarded()` wrapper (rate limiting, generic 500 handling, cache headers).
- The endpoint is registered in the `/api/v1` service index.

---

## Files changed

**New (3):**
1. `src/lib/graph/knowledge-graph.ts` — schema types, `buildKnowledgeGraph()`, scope notes, provenance helpers.
2. `src/app/api/v1/graph/route.ts` — read-only graph endpoint.
3. `SPRINT-3-REPORT.md` — this report.

**Modified (1):**
1. `src/app/api/v1/route.ts` — added `/api/v1/graph` to the endpoint inventory.

**Deliberately unchanged:**
- `src/components/topics/topic-graph.tsx` — existing visualization still works.
- `src/lib/topics/data.ts` and `src/lib/explore/dimensions.ts` — no data changes, no alias topics, no new mappings.
- AI feature flag — remains disabled.
- Licensing/audio/translation/tafsir behavior — untouched.
- Local-first storage — untouched; the graph is stateless and read-only.

---

## Known gaps

1. **No ayah, surah, or root nodes.** The PRD's fuller graph needs ayah-level tagging and morphological data that do not exist. Adding them now would fabricate classifications.
2. **No UI consumer yet.** The new graph is serialized and documented, but no page renders it. The existing SVG topic graph remains the only visual graph. A future sprint can consume `/api/v1/graph` without changing the schema.
3. **Full-graph only.** No `?type=`, `?dimension=`, or neighborhood query parameters. The current graph is small (10 dimension nodes, 11 topic nodes), so a single response is sufficient.
4. **No path nodes.** Learning paths reference topics, but paths are not graph nodes in this foundation.
5. **No scholarly approval.** Every node and edge is pending review by design.
6. **No graph-specific tests.** Verification is deferred.

---

## Owner decisions still open

- Whether/when to add a UI that consumes the serialized graph (the existing SVG graph is unchanged).
- Whether to add ayah-level dimension tagging once scholarly tagging exists (out of scope until then).
- The Sprint 2 `tawhid` gap remains: no canonical topic exists for the `first-steps` step 4 anchor.

---

## Verification

**No verification commands were run.** Per instruction, the following were not executed:

- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run lint`
- Browser checks

To verify later: run the above, then `GET /api/v1/graph` and confirm every `unresolved` entry is empty, every edge's `provenance` is non-empty, and all statuses are `pending-scholarly-review`.

---

## Confirmation

Sprint 3 is complete. No Sprint 4 work was started. No D3/Cytoscape dependency was added, no existing graph visualization was rewritten, the AI answer feature remains disabled, and licensing behavior is unchanged.
