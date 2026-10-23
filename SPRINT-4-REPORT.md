# Sprint 4 Report — Knowledge Graph Explorer UI

**Date:** 2026-10-23
**Scope:** First user-facing graph experience built on the Sprint 3 serialized graph foundation.
**Status:** Implemented; verification commands NOT run per instruction.

---

## What was inspected first

- `src/lib/graph/knowledge-graph.ts` — schema: 21 nodes (10 dimensions + 11 topics), two edge types (`DIMENSION_TOPIC`, `TOPIC_RELATION`), full provenance, deterministic serialization.
- `src/components/topics/topic-graph.tsx` — existing circular SVG graph, keyboard-focusable `<a>`-wrapped nodes, undirected edges from `Topic.related`. No dimensions, no edge provenance, no selection state.
- `src/app/explore/page.tsx` and `src/app/explore/dimension/[id]/page.tsx` — existing Explore layout, gold-banner scope notices, card styling conventions.
- `src/app/api/v1/graph/route.ts` — read-only endpoint returning the full graph.
- `src/lib/api/v1.ts` — response envelope and `guarded()` wrapper.
- `src/app/sitemap.ts` — existing route registration pattern.

**Decision:** 21 nodes is small enough for a deterministic SVG layout. No D3/Cytoscape dependency added. The existing `TopicGraph` component is left untouched.

---

## UI route and components

**New route:** `/explore/graph`

**New files (3):**
1. `src/components/graph/knowledge-graph-explorer.tsx` — client component rendering the graph, filter pills, selection panel, and non-graph node list.
2. `src/app/explore/graph/page.tsx` — server page that imports `buildKnowledgeGraph()`, passes it to the explorer, and emits breadcrumbs + JSON-LD.
3. `SPRINT-4-REPORT.md` — this report.

**Modified files (2):**
1. `src/app/explore/page.tsx` — added a "Knowledge Graph Explorer" card linking to `/explore/graph`, placed between the existing curated-topics strip and the search CTA.
2. `src/app/sitemap.ts` — registered `/explore/graph` in the static routes list.

**Unchanged:**
- `src/components/topics/topic-graph.tsx` — existing topic graph still works.
- `src/lib/graph/knowledge-graph.ts` — schema unchanged; one integrity improvement added (duplicate dimension→topic slug now reported in `unresolved` rather than silently dropped).
- All topic/dimension data, AI feature flag, licensing, local-first storage.

---

## Graph rendering

**Layout:** Concentric rings in an 800×700 SVG viewBox, responsive via `preserveAspectRatio="xMidYMid meet"`.

- **Outer ring (radius 280):** 10 dimension nodes, evenly distributed by catalog order, starting at 12 o'clock.
- **Inner ring (radius 150):** 11 topic nodes, evenly distributed by catalog order, starting at 12 o'clock.
- **Center:** (400, 350).

The layout is deterministic — catalog order drives angle, so two renders produce identical output. No force simulation, no randomness.

**Node visuals:**
- Dimension nodes: primary-colored circle (r=14), bold 11px label above.
- Topic nodes: gold-colored circle (r=10), medium 9px label above.
- Labels truncated at 18 characters with ellipsis.

**Edge visuals:**
- `DIMENSION_TOPIC`: solid primary-colored line (stroke-width 1.5, opacity 0.7).
- `TOPIC_RELATION`: dashed muted-foreground line (stroke-dasharray "5 3", stroke-width 1.5, opacity 0.5).
- Selected edges: thicker (2.5), full opacity.
- Dimmed edges (filter excludes endpoints): opacity 0.15.

**Legend:** Inline above the SVG, showing node colors and edge styles.

---

## Node selection behavior

Clicking a node (or pressing Enter/Space on a focused node) toggles selection. The selected node gets a primary-colored focus ring (r+5, opacity 0.5). Edges connected to the selected node become fully opaque and thicker.

A detail panel appears below the graph showing:
- Node kind (Dimension/Topic) and ordinal (for dimensions).
- Label and Arabic label.
- Description.
- Provenance block: review status, curator, method, last editorial pass.
- Connections list: each edge with type label, the other endpoint as a clickable link (selects that node), and the edge's review status.
- "Open dimension/topic page →" button linking to the node's `url`.

A close button (X icon) clears the selection. Clicking the same node again also deselects.

---

## Filters

A row of filter pills above the graph:
- **All** (default): every node and edge visible.
- **One pill per dimension** (10 pills): shows the dimension's ordinal badge + label. Selecting a dimension highlights that dimension and its connected topics (via `DIMENSION_TOPIC` edges). All other nodes and edges dim to 0.2 opacity.

Filter buttons use `aria-pressed` to communicate active state. The active pill gets primary background; inactive pills get card background with hover state.

Filtering is computed from `activeNodeIds` — a Set of node ids that includes the selected dimension and all topics it maps to. Edges are active only when both endpoints are active. Topic↔topic edges between two active topics remain visible.

---

## Keyboard and mobile accessibility

**Keyboard:**
- Every node is a `<g>` with `role="button"`, `tabIndex={0}`, `aria-label` (including "(selected)" when active), and `aria-pressed`.
- Tab navigates through nodes in catalog order (dimensions first, then topics).
- Enter or Space toggles selection.
- Filter buttons are standard `<button>` elements with `aria-pressed`.
- The close button is a standard `<button>` with `aria-label="Close details"`.
- Connection links in the detail panel are `<button>` elements that select the other node.

**SVG role:** Changed from `role="img"` (which would block AT access to child focusable elements) to `role="group"` so screen readers can reach each node.

**Non-graph node list:** A `<details>` element below the SVG provides a plain list of all 21 nodes with links to their detail pages. This is the accessible equivalent for users who cannot interact with the SVG.

**Mobile:**
- SVG scales responsively via `viewBox` and `max-w-[800px]`.
- Filter pills wrap via `flex-wrap`.
- Detail panel stacks vertically.
- Node list uses `sm:grid-cols-2` for wider screens.

---

## Provenance and pending-review communication

**Scope notice (gold banner):** Appears above the graph, stating:
> "This graph shows editorial navigation mappings between dimensions and curated topics, plus lateral relationships between curated topics. It does not classify individual ayat by dimension. Every node and edge carries its review status — all are pending scholarly review in this release."

**Node provenance:** The detail panel shows each selected node's `status`, `curator`, `method`, and `reviewedAt` verbatim from the graph data.

**Edge provenance:** The connections list shows each edge's `status` next to the other endpoint's label. All edges in this release are `pending-scholarly-review`.

**No scholarly approval implied:** Every node and edge in the current data is pending. The UI never displays "approved" or "verified" language.

**Unresolved references:** If `graph.unresolved.length > 0`, a destructive-styled block lists each unresolved reference with `from`, `value`, `field`, and `reason`. In the current data, all slugs resolve, so this block does not render — but the mechanism is in place.

---

## Integrity improvement made during Sprint 4

While implementing the explorer, I noticed that `buildKnowledgeGraph()` silently dropped duplicate `topicSlugs` within a single dimension's mapping via a `Set` guard. This contradicted the module's stated rule that integrity gaps surface in `unresolved` rather than disappearing.

**Fix:** The duplicate check now pushes an entry into `unresolved` with reason "Duplicate topic slug within this dimension's mapping; one edge was emitted and the repeat was not." The schema already supported this — no type changes needed.

In the current data, no dimension has duplicate slugs, so this branch does not fire. But the integrity rule is now consistent.

---

## Remaining graph limitations

1. **No ayah, surah, or root nodes.** The PRD's fuller graph needs scholarly tagging and morphological data that do not exist. Adding them now would fabricate classifications.
2. **No path nodes.** Learning paths reference topics, but paths are not graph nodes.
3. **No query parameters.** The graph is small (21 nodes, ~30 edges); a single response is sufficient. No `?type=`, `?dimension=`, or neighborhood filters.
4. **No zoom/pan.** The SVG scales responsively but does not support pinch-zoom or drag-pan. For 21 nodes this is acceptable; a larger graph would need it.
5. **No force-directed layout.** The concentric layout is deterministic and readable for the current size. A force layout would be non-deterministic and harder to test.
6. **No edge labels in the SVG.** Edge type is communicated by line style (solid vs dashed) and the legend. Adding text labels to every edge would clutter the diagram.
7. **No loading state.** The page is server-rendered with the graph module, so there is no fetch and no loading state. If the graph were empty, the SVG would render nothing; the non-graph list would be empty. An explicit empty-state message could be added if the graph ever becomes dynamic.
8. **No scholarly approval.** Every node and edge is pending review by design.
9. **No graph-specific tests.** Verification is deferred.

---

## Owner decisions still open

- Whether to add zoom/pan for a future larger graph.
- Whether to add ayah-level dimension tagging once scholarly tagging exists (out of scope until then).
- The Sprint 2 `tawhid` gap remains: no canonical topic exists for the `first-steps` step 4 anchor.
- Whether to add path nodes to the graph (paths reference topics but are not currently graph nodes).

---

## Verification

**No verification commands were run.** Per instruction, the following were not executed:

- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run lint`
- Browser checks

To verify later: run the above, then visit `/explore/graph` and confirm:
- All 21 nodes render in concentric rings.
- Clicking a node shows the detail panel with provenance.
- Filter pills highlight the selected dimension and its connected topics.
- Tab navigation reaches every node.
- The non-graph list below the SVG links to all nodes.
- `/explore` shows the "Knowledge Graph Explorer" card linking to `/explore/graph`.

---

## Confirmation

Sprint 4 is complete. No Sprint 5 work was started. No D3/Cytoscape dependency was added. The existing `TopicGraph` component is unchanged. The AI answer feature remains disabled. Licensing behavior is unchanged. Local-first storage is unchanged. All provenance and pending-review states are preserved and communicated.
