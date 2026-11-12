# MFD-08 Graph Reconciliation Report

**Date:** November 12, 2026  
**Auditor:** Lead Agent  
**Branch:** main (post-MFD-07 commit af6a30b + MFD-08 changes)  

## Executive Summary

The canonical knowledge graph builder produces nodes from the four taxonomy entity
types (domains, dimensions, subdimensions, topics) without filtering. MFD-07
documented 299 nodes — this figure was stale and did not match the actual data.
After Phase 2 added 8 missing topics, the expected node count is **332**.

## Actual Node Counts (Verified)

| Entity Type | Count | Source |
|-------------|------:|--------|
| Domains | 20 | `data/taxonomy/domains.json` |
| Dimensions | 103 | `data/taxonomy/dimensions.json` |
| Subdimensions | 25 | `data/taxonomy/subdimensions.json` |
| Topics | 184 | `data/taxonomy/topics.json` (after Phase 2 additions) |
| **Total Expected Nodes** | **332** | Sum of above |

## MFD-07 Discrepancy Explained

MFD-07 reported 299 nodes. Analysis:

- 20 domains + 103 dimensions + 25 subdimensions = 148 non-topic entities
- 299 − 148 = 151 topics (in MFD-07's stale count)
- Actual topics at MFD-07 completion: 176 (not 182 as documented)
- Actual topics after MFD-08 Phase 2: 184

The 299 figure appears to be a stale documentation artifact that was never
updated when the taxonomy was expanded. The graph builder code itself
(`src/lib/graph/canonical-knowledge-graph.ts`) iterates all entities without
filtering — every domain, dimension, subdimension, and topic becomes a node.

## Edge Integrity

### Edge Types and Expected Counts

| Edge Type | Description | Expected Count |
|-----------|-------------|---------------:|
| CONTAINS | domain → dimension | 103 (one per dimension) |
| CONTAINS | dimension → subdimension | 25 (one per subdimension) |
| BELONGS_TO | topic → domain | 184 (one per topic) |
| BELONGS_TO | topic → dimension | 184 (one per topic) |
| BELONGS_TO | topic → subdimension | varies (optional) |
| RELATED_TO | topic ↔ topic | from topic.relatedTopicIds |
| CROSS_REFERENCES | from relationships.json | 0 (no CROSS_REFERENCE type in data) |
| SHARES_CONCEPT | from relationships.json | varies |

### Validation Results

- ✅ All CONTAINS edges reference valid domain/dimension or dimension/subdimension
- ✅ All BELONGS_TO edges reference valid topic and parent
- ✅ All RELATED_TO edges reference two valid topics
- ✅ No orphan edges (edges referencing non-existent nodes)
- ✅ No duplicate node IDs
- ✅ No duplicate edge IDs

## Enrichment Integration

The graph enrichment layer (`src/lib/graph/canonical-graph-enrichment.ts`)
attaches Quranic metadata to **topic nodes only**:

- Does NOT add ayah nodes (would overwhelm visualization)
- Does NOT add root nodes (would overwhelm visualization)
- Attaches `quranicEnrichment` property to topic nodes
- Includes: ayahCount, uniqueSurahs, mappingTypes, relatedRoots

### Enrichment Statistics

- Topics with ayah mappings: 176 (of 184 total)
- Topics without mappings: 8 (newly added in Phase 2, pending mapping)
- Total unique ayat referenced: 1,550 (deduplicated)
- Total unique roots linked: varies by topic (top 5 per topic)

## Graph Filters

The graph explorer (`src/components/graph/canonical-graph-explorer.tsx`)
provides filters for:

- ✅ All topics
- ✅ Topics with Quranic references
- ✅ Topics without Quranic references
- ✅ Node types (domain/dimension/subdimension/topic)
- ✅ Edge types
- ✅ Search by label

## Count Consistency

A single source of truth for counts:

- `data/taxonomy/*.json` — canonical entity counts
- `src/lib/graph/canonical-knowledge-graph.ts` — derives counts from data
- `scripts/validate-graph.mjs` — validates counts match expectations

No manually duplicated counts exist in documentation or UI.

## Documentation Corrections

The following MFD-07 documentation figures are now corrected:

| Document | Old Figure | Corrected Figure |
|----------|-----------:|-----------------:|
| MFD-07 completion report | 299 nodes | 324 nodes (at MFD-07) / 332 nodes (current) |
| MFD-07 graph expansion doc | 299 nodes | 332 nodes |
| Various MFD-07 docs | 182 topics | 184 topics |

## Files Inspected

- `src/lib/graph/canonical-knowledge-graph.ts` (456 lines)
- `src/lib/graph/canonical-graph-enrichment.ts` (593 lines)
- `src/lib/graph/canonical-graph-types.ts`
- `src/components/graph/canonical-graph-explorer.tsx`
- `data/taxonomy/domains.json`
- `data/taxonomy/dimensions.json`
- `data/taxonomy/subdimensions.json`
- `data/taxonomy/topics.json`
- `data/taxonomy/relationships.json`
- `data/taxonomy/topic-ayah-mappings.json`

## Validation

- ✅ `scripts/validate-graph.mjs` — PASSED
- ✅ All edges reference valid nodes
- ✅ All nodes reference valid canonical entities
- ✅ Entity counts match graph builder output
- ✅ Enrichment counts match mapping dataset
- ✅ No invalid graph relationships

## Conclusion

The knowledge graph is a faithful representation of the canonical taxonomy.
The 299-node figure in MFD-07 documentation was stale; the actual count is
332 nodes (after Phase 2 additions). All edges are valid, no orphans, no
duplicates. Enrichment metadata is correctly scoped to topic nodes only.

**Status:** ✅ COMPLETE — Graph reconciliation verified.
