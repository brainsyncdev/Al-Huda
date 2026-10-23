# Sprint 7 Report — Knowledge Graph Data Quality & Editorial Governance

**Date:** 2026-10-23  
**Scope:** Audit and improve the editorial data-quality and review-state handling of the Knowledge Graph established in Sprints 1–6.  
**Status:** Complete. All verification gates pass.

---

## 1. Files Inspected

**Core graph implementation:**
- `src/lib/graph/knowledge-graph.ts` — pure module, deterministic serialization, conservative provenance rules
- `src/lib/explore/dimensions.ts` — 10 dimensions with `topicSlugs` mappings
- `src/lib/topics/data.ts` — 11 topics with `related` arrays and typed ayah relations
- `src/app/api/v1/graph/route.ts` — read-only endpoint
- `src/components/graph/knowledge-graph-explorer.tsx` — UI consumer
- `src/app/explore/graph/page.tsx` — server page

**Related context:**
- `SPRINT-3-REPORT.md` — graph foundation design decisions
- `SPRINT-4-REPORT.md` — graph explorer UI implementation
- `src/lib/api/v1.ts` — API response envelope and rate limiting

---

## 2. Data-Integrity Invariants Checked

Every invariant documented in `knowledge-graph.ts` was verified by automated tests (25 new assertions) and manual inspection:

| Invariant | Result |
|-----------|--------|
| Every node references a valid dimension or canonical topic | ✅ PASS |
| Every dimension-topic edge matches `Dimension.topicSlugs` exactly | ✅ PASS |
| Every topic relationship resolves to valid canonical topic IDs | ✅ PASS |
| Undirected topic relationships are not duplicated | ✅ PASS |
| Every edge has complete and truthful provenance metadata | ✅ PASS |
| Review statuses are consistent and not silently upgraded | ✅ PASS |
| Missing or unresolved references remain explicitly observable | ✅ PASS (none in current data) |

**Specific checks:**
- All 21 node IDs are unique
- All edge endpoints reference existing nodes
- `DIMENSION_TOPIC` edges match the dimension catalog's `topicSlugs` field exactly (no missing, no extra)
- `TOPIC_RELATION` edges are deduplicated on unordered pairs (patience↔hardship-and-ease appears once, not twice)
- Topic relation endpoints are sorted alphabetically (source < target)
- Every edge has at least one provenance declaration with a `declaredBy` that matches a node ID
- Bidirectional declarations are merged: if A→B and B→A both exist, one edge is emitted with two declarations
- All nodes carry non-empty provenance (method, curator, reviewedAt, status)
- No node or edge claims `editorial-approved` in the current data
- Edge status is conservative: if any declaration is pending, the edge is pending
- Every edge has a non-empty `scopeNote` explaining what it asserts
- `relationshipScope` matches edge type (`editorial-navigation-mapping` for DIMENSION_TOPIC, `curated-topic-relationship` for TOPIC_RELATION)
- Unresolved references have complete fields (from, field, value, reason)
- In the current data, all dimension `topicSlugs` resolve to canonical topics (zero unresolved)
- In the current data, all topic `related` slugs resolve to canonical topics (zero unresolved)
- Two calls to `buildKnowledgeGraph()` produce identical output (deterministic)
- The interfaith dimension has zero topic mappings (left empty by design)
- `counts` object matches the actual arrays (nodes, edges, pendingReviewNodes, pendingReviewEdges)

---

## 3. Node and Edge Counts

**Before Sprint 7:**
- 21 nodes (10 dimensions + 11 topics)
- 38 edges (22 DIMENSION_TOPIC + 16 TOPIC_RELATION)

**After Sprint 7:**
- 21 nodes (unchanged)
- 38 edges (unchanged)

**Exact counts from the graph (measured via automated test):**
```
nodes: 21
dimensionNodes: 10
topicNodes: 11
edges: 38
dimensionTopicEdges: 22
topicRelationEdges: 16
pendingReviewNodes: 21
pendingReviewEdges: 38
```

Edge declaration distribution: 32 edges carry a single provenance declaration, 6 edges (the bidirectional topic pairs) carry two declarations merged into one edge.

No data was added, removed, or modified. The audit confirmed the existing data is internally consistent.

---

## 4. Provenance and Review-State Findings

**Current state (verified):**
- All 10 dimensions carry `DIMENSION_PROVENANCE` with status `pending-scholarly-review`
- All 11 topics carry `REVIEW` provenance with status `pending-scholarly-review`
- All 38 edges inherit pending status from their declarations
- Zero nodes or edges claim `editorial-approved`
- The interfaith dimension is correctly empty (no fabricated mappings)

**Provenance fields present on every node:**
- `method`: describes how the selection was produced
- `curator`: identifies who produced it ("Al-Huda editorial team" or "Al-Huda editorial seed")
- `reviewedAt`: ISO date of last editorial pass
- `status`: `pending-scholarly-review` or `editorial-approved`

**Provenance fields present on every edge:**
- Array of `EdgeProvenanceDeclaration` objects, one per catalog record that asserted the edge
- Each declaration includes `declaredBy` (node ID), `method`, `curator`, `reviewedAt`, `status`

**Review-state clarity in UI:**
- Topic pages display: "Review status: pending scholarly review — curated by [curator] via [method] (last pass [date])"
- Dimension pages display: "Each topic carries its own review status (pending-scholarly-review)"
- Graph explorer detail panel displays: review status, curator, method, last editorial pass for selected nodes
- Graph explorer connections list displays: edge status next to each connection
- Scope notice above the graph explicitly states: "Every node and edge carries its review status — all are pending scholarly review in this release"

**No fabricated approvals:**
- The codebase contains no mechanism to silently upgrade a pending status to approved
- The `effectiveStatus()` function is conservative: one pending declaration keeps the whole edge pending
- No reviewer identities, approval dates, or review outcomes are fabricated anywhere

---

## 5. Tests Added

**New file:** `src/lib/graph/knowledge-graph.test.ts` (25 tests)

**Test categories:**

1. **Structure (5 tests):**
   - Returns the documented version
   - Has the expected node counts (10 dimensions + 11 topics = 21)
   - Emits one node per dimension with correct kind and ordinal
   - Emits one node per canonical topic with correct kind
   - Has unique node IDs

2. **Edge integrity (7 tests):**
   - Every edge references existing nodes at both endpoints
   - DIMENSION_TOPIC edges match Dimension.topicSlugs exactly
   - TOPIC_RELATION edges are deduplicated on unordered pairs
   - TOPIC_RELATION endpoints are sorted alphabetically
   - Every TOPIC_RELATION edge corresponds to at least one Topic.related declaration
   - Every edge has at least one provenance declaration
   - Every edge provenance declaration has a declaredBy that matches a node ID

3. **Provenance and review state (5 tests):**
   - All nodes carry a non-empty provenance record
   - No node or edge claims editorial-approved in the current data
   - Edge status is conservative: pending if any declaration is pending
   - Every edge has a non-empty scopeNote
   - relationshipScope matches edge type

4. **Unresolved references (3 tests):**
   - Unresolved references have complete fields
   - In the current data, all dimension topicSlugs resolve to canonical topics
   - In the current data, all topic related slugs resolve to canonical topics

5. **Determinism (1 test):**
   - Two calls produce identical output

6. **Topic relationship symmetry (2 tests):**
   - Undirected topic relationships are not duplicated in the edge list
   - Bidirectional declarations are merged into one edge with multiple declarations

7. **Interfaith dimension (1 test):**
   - The interfaith dimension has no topic mappings (left empty by design)

8. **Counts consistency (1 test):**
   - counts match the actual arrays

**Test infrastructure change:**
- `vitest.config.ts` — added `@/` alias to match tsconfig.json's `paths` entry. This was necessary because the graph module itself imports through `@/`, and vitest needs to resolve those specifiers. Existing tests using relative imports are unaffected.

---

## 6. Verification Results

All four gates pass:

```
pnpm lint       → clean (0 errors, 0 warnings)
pnpm typecheck  → clean
pnpm test       → 227 passed (14 files), 2.52s
                  (includes 25 new graph integrity tests)
pnpm build      → successful, all routes rendered
```

**Test breakdown:**
- 13 existing test files (202 tests) — all pass
- 1 new test file (25 tests) — all pass
- Total: 227 tests across 14 files

---

## 7. Confirmed Defects vs Recommendations

**Confirmed defects:** None.

The audit found zero data-integrity defects in the current graph implementation. All invariants hold, all provenance is complete, all review states are accurate, and no relationships are fabricated.

**Recommendations for future sprints:**

1. **Reviewer identity field (not implemented):**
   - The current `ProvenanceRecord` has `curator` (a team name) but no field for individual reviewer identity
   - If a real scholarly review workflow is established, a `reviewer` or `reviewedBy` field could be added
   - This would require actual reviewer identities, not fabricated names
   - **Status:** Documented gap, not implemented (no real reviewers exist yet)

2. **Review decision and audit trail (not implemented):**
   - The current model records `reviewedAt` (last editorial pass) but not the decision made or the history of changes
   - A future workflow could add `decision` (approved/rejected/revision-requested) and `changeHistory` fields
   - This would require an actual review process, not just data structure changes
   - **Status:** Documented gap, not implemented (no review workflow exists)

3. **Per-relation reviewer identity (not implemented):**
   - The `TopicRelation` interface already supports an optional `provenance` override (FR-073)
   - No relation in the current data carries an individual review record
   - If individual relations are reviewed in the future, the override mechanism is ready
   - **Status:** Infrastructure exists, no data uses it yet (by design — no fabricated reviews)

4. **Editorial dashboard (not implemented):**
   - No public or internal dashboard exists for managing review status
   - The current model is read-only: provenance is declared in the source code, not managed through a UI
   - A future workflow could add an editorial interface, but it would need authentication, authorization, and audit logging
   - **Status:** Out of scope for this sprint, not recommended without a real review process

---

## 8. Editorial Workflow Gaps Requiring Human Decision

The following gaps cannot be resolved by code changes alone — they require actual human decisions about whether and how to establish a scholarly review workflow:

1. **Who are the reviewers?**
   - No reviewer identities exist in the codebase
   - Adding fake names would fabricate authority
   - **Decision needed:** Are there actual scholars willing to review the content? If so, who?

2. **What is the review process?**
   - No review workflow exists (no approval/rejection mechanism, no revision requests, no versioning)
   - **Decision needed:** Is a formal review process desired? If so, what are the steps?

3. **What does "editorial-approved" mean?**
   - The status exists in the type system but is never used
   - **Decision needed:** What criteria must be met for content to transition from `pending-scholarly-review` to `editorial-approved`?

4. **How is review history tracked?**
   - No audit trail exists (no change log, no version history, no decision records)
   - **Decision needed:** Is an audit trail required? If so, what should it record?

5. **Who can change review status?**
   - Currently, status is hardcoded in the source code
   - **Decision needed:** Should status be editable through a UI? If so, who has permission?

These gaps are documented, not defects. The current implementation is honest about what it does and does not do. It does not fabricate a review workflow that does not exist.

---

## 9. Files Modified

**New (1):**
1. `src/lib/graph/knowledge-graph.test.ts` — 25 integrity tests covering structure, edge integrity, provenance, unresolved references, determinism, symmetry, and counts

**Modified (1):**
1. `vitest.config.ts` — added `@/` alias to match tsconfig.json's `paths` entry, necessary because the graph module imports through `@/`

**Deliberately unchanged:**
- All graph data (nodes, edges, provenance, review states)
- All topic and dimension content
- All API contracts
- All UI components
- AI feature flag (remains disabled)
- Licensing, audio, translation, tafsir behavior
- Local-first storage
- Quran text and mappings

---

## 10. Remaining Risks

1. **No ayah-level dimension tagging:**
   - The PRD envisions every ayah tagged across 10 dimensions
   - This requires scholarly work that does not exist
   - Adding it now would fabricate religious claims
   - **Risk:** Low — the current graph is honest about its scope

2. **No path nodes in the graph:**
   - Learning paths reference topics but are not graph nodes
   - **Risk:** Low — paths are a separate feature, not a graph integrity issue

3. **No zoom/pan for larger graphs:**
   - The current 21-node graph fits in a static SVG
   - A larger graph would need interactive zoom/pan
   - **Risk:** Low — not needed until the graph grows

4. **No scholarly approval workflow:**
   - All content is pending review
   - No mechanism exists to transition to approved
   - **Risk:** Low — the implementation is honest about this gap

5. **No reviewer identity or audit trail:**
   - No way to record who reviewed what, when, or why
   - **Risk:** Low — no fake data is fabricated; the gap is documented

---

## 11. Recommended Next Sprint

If the product owner decides to establish a real scholarly review workflow, the next sprint could:

1. Add a `reviewer` field to `ProvenanceRecord` (optional, for individual reviewers)
2. Add a `decision` field to track approval/rejection/revision-requested
3. Add a `changeHistory` array to track status transitions
4. Build a minimal editorial interface (authenticated, authorized, audited)
5. Migrate existing provenance records to include real reviewer identities

However, this should only happen if actual reviewers are identified and willing to participate. Fabricating reviewer identities or approval records would violate the project's commitment to honesty.

If no review workflow is planned, the current implementation is complete and correct. The graph is internally consistent, all provenance is truthful, and all review states are accurate.

---

## 12. Confirmation

Sprint 7 is complete. No Sprint 8 work was started. No data was fabricated. No review workflow was invented. All verification gates pass. The knowledge graph is internally consistent, all provenance is truthful, and all review states are accurately represented.

**Verified facts:**
- 21 nodes, 38 edges, all internally consistent
- All provenance complete and truthful
- All review states accurate (all pending, none approved)
- 25 new tests verify all documented invariants
- All four verification gates pass

**Assumptions:**
- None — all findings are based on code inspection and automated tests

**Recommendations:**
- Future sprints could add reviewer identity and audit trail fields if a real review workflow is established
- These additions require actual human decisions, not just code changes

**Gaps requiring human decision:**
- Who are the reviewers?
- What is the review process?
- What does "editorial-approved" mean?
- How is review history tracked?
- Who can change review status?

The current implementation is honest about what it does and does not do. It does not fabricate a review workflow that does not exist.
