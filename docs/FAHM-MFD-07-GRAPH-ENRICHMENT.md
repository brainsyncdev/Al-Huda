# MFD-07 Phase 7: Knowledge Graph Expansion

## Overview

Phase 7 enriches the canonical knowledge graph with Quranic reference data
without overwhelming the SVG visualization. Instead of adding 6,236 ayah nodes
or 1,642 root nodes (which would make the graph unreadable), we attach
**enrichment metadata** to existing topic nodes.

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│  Data Sources (server-side)                                    │
│  ├─ data/taxonomy/topic-ayah-mappings.json  (792 mappings)     │
│  ├─ data/root-discovery-registry.json       (1,642 roots)      │
│  └─ Canonical taxonomy topics                                  │
└────────────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  src/lib/graph/canonical-graph-enrichment.ts                   │
│  • Loads mappings & roots (cached on globalThis)               │
│  • Heuristic root-topic matching (curated + text search)       │
│  • Exports getGraphEnrichmentData()                            │
└────────────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  src/lib/graph/canonical-knowledge-graph.ts                    │
│  • Calls getGraphEnrichmentData() at build time                │
│  • Attaches quranicEnrichment to each topic node               │
│  • Exposes graph.quranicCoverage summary                       │
└────────────────────────────────────────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  src/components/graph/canonical-graph-explorer.tsx (client)    │
│  • Renders enrichment indicators on topic nodes                │
│  • Detail panel shows Quranic section for topics               │
│  • Filter by enrichment status                                 │
│  • URL state persistence                                       │
│  • Hover tooltips                                              │
└────────────────────────────────────────────────────────────────┘
```

## Enrichment Data Structure

### `TopicQuranicEnrichment`

```typescript
interface TopicQuranicEnrichment {
  topicId: string;
  ayahCount: number;                    // # of ayah mappings for this topic
  uniqueSurahs: number[];               // surah numbers referenced
  mappingTypes: Record<string, number>; // DIRECT_REFERENCE, etc.
  hasDirectReferences: boolean;
  hasExplicitInstructions: boolean;
  hasPropheticNarratives: boolean;
  hasThematicReferences: boolean;
  relatedRoots: string[];               // top 5 Arabic root slugs
  translationAvailable: boolean;
  tafsirAvailable: boolean;
}
```

### `GraphEnrichmentData`

```typescript
interface GraphEnrichmentData {
  topicEnrichments: Record<string, TopicQuranicEnrichment>;
  totalTopicsWithAyahMappings: number;
  totalTopicsWithoutMappings: number;
  totalUniqueAyatReferenced: number;
  totalUniqueRootsLinked: number;
}
```

### `CanonicalKnowledgeGraph.quranicCoverage`

```typescript
quranicCoverage: {
  totalTopicsWithMappings: number;
  totalTopicsWithoutMappings: number;
  totalUniqueAyatReferenced: number;
  totalUniqueRootsLinked: number;
}
```

## Root-Topic Linking Strategy

Since we don't have explicit topic-root mappings, we derive them heuristically
using a **two-strategy approach**:

### Strategy 1: Curated Keyword Mapping (High Confidence)

A hand-curated dictionary maps common Islamic concept keywords to Arabic root
slugs. Examples:

| English keyword | Arabic root |
|-----------------|-------------|
| `tawheed`       | وحد         |
| `mercy`         | رحم         |
| `prayer`        | صلو         |
| `patience`      | صبر         |
| `prophet`       | نبي         |
| `paradise`      | جنن         |

The dictionary contains ~150 entries covering core theological, moral, legal,
and narrative concepts. When a keyword appears in a topic's slug or title, the
corresponding root is linked with high confidence (score 10).

### Strategy 2: Heuristic Text Matching (Lower Confidence)

For each root in the registry, we extract keywords from:
- The root slug (Arabic)
- The root's included lemmas (Arabic word forms)

We then search the topic's title, description, and search aliases for these
keywords. Each match adds 1 point to the root's score for that topic.

### Result

Roots are sorted by score descending, and the **top 5** are attached to each
topic. This limit prevents noise from overwhelming the UI.

**Important:** These links are marked as "suggested connections" in the UI and
in the documentation. They are **not** authoritative scholarly classifications.

## Visual Indicators

### Node Rendering

- **Enriched topic nodes** (those with `ayahCount > 0`) receive:
  - A gold glow ring around the node
  - A small gold badge dot in the top-right corner
  - A slightly larger radius (scales from 4px to 8px based on ayah count)
- **Non-enriched topics** render as plain blue circles (4px radius)
- **Domains, dimensions, subdimensions** render unchanged

### Detail Panel

When a topic node is selected, the detail panel shows a dedicated
**Quranic Enrichment** section containing:

- **Summary stats**: ayah count, unique surahs, suggested roots count
- **Mapping type breakdown**: bar-style list showing distribution across
  DIRECT_REFERENCE, EXPLICIT_INSTRUCTION, PROPHETIC_NARRATIVE, THEMATIC_REFERENCE
- **Suggested Arabic roots**: clickable chips linking to `/explore/root/[slug]`
- **Availability badges**: Translation available, Tafsir links available
- **View all ayat** button linking to the topic page's ayahs section

### Legend

The legend includes a new entry: "Enriched topic" showing the gold-glow
indicator.

## Filters

A new **Quranic enrichment filter** dropdown provides three options:

| Value     | Effect                                                  |
|-----------|---------------------------------------------------------|
| `all`     | Show all topics                                         |
| `with`    | Show only topics with ayah mappings (enriched)          |
| `without` | Show only topics without ayah mappings (gaps)           |

This filter composes with the existing node-type and edge-type filters.

## URL State Persistence

The explorer synchronizes its state to URL query parameters using
`router.replace` (shallow, no scroll):

| Parameter    | Effect                                         |
|--------------|------------------------------------------------|
| `filter`     | Node type filter (`domain`, `dimension`, etc.) |
| `enrichment` | Enrichment filter (`with`, `without`)          |
| `search`     | Search query                                   |
| `selected`   | Selected node ID                               |

Example shareable URL:
```
/explore/graph?filter=topic&enrichment=with&selected=topic:tawheed-fundamentals
```

Browser back/forward buttons work correctly because we use `router.replace`
instead of `router.push` — the URL reflects the current state without
cluttering history.

## Hover Tooltips

Tooltips appear after a **300ms hover delay** and follow the cursor. Content
varies by node kind:

- **Domain**: "Domain: [name]\nX dimensions"
- **Dimension**: "Dimension: [name]\nX subdimensions"
- **Subdimension**: "Subdimension: [name]\nX topics"
- **Topic (enriched)**: "Topic: [name]\nX ayat referenced · Y roots"
- **Topic (plain)**: "Topic: [name]"

Tooltips use `role="tooltip"` and are positioned relative to the SVG container.
They disappear immediately on mouse leave.

## Performance Considerations

- **Enrichment data is computed once** and cached on `globalThis` across HMR
  reloads. Subsequent calls to `getGraphEnrichmentData()` return the cached
  result.
- **No additional nodes or edges** are added to the graph — enrichment is
  metadata on existing topic nodes.
- **Root-topic matching** runs once during graph build, not on every render.
- **Client bundle**: The enrichment module uses `fs` and is server-only. The
  client component imports only the `TopicQuranicEnrichment` **type** (erased
  at compile time). Enrichment data reaches the client via the graph prop
  serialized from the server component.

## Files

### Created
- `src/lib/graph/canonical-graph-enrichment.ts` — enrichment computation
- `docs/FAHM-MFD-07-GRAPH-ENRICHMENT.md` — this file

### Modified
- `src/lib/graph/canonical-knowledge-graph.ts` — attaches enrichment to topic
  nodes, exposes `quranicCoverage`
- `src/components/graph/canonical-graph-explorer.tsx` — UI enhancements

### Not Modified
- `data/taxonomy/topic-ayah-mappings.json`
- `data/root-discovery-registry.json`
- `src/lib/taxonomy/topic-translation-data.ts`
- `src/lib/taxonomy/topic-tafsir-data.ts`
- Legacy graph system (`src/lib/graph/knowledge-graph.ts`)

## Validation Checklist

- [x] TypeScript compiles without errors
- [x] Graph page loads without errors
- [x] Topic nodes show enrichment indicators (gold glow + badge)
- [x] Topic node radius scales with ayah count
- [x] Detail panel shows Quranic enrichment section for topics
- [x] Mapping type breakdown renders correctly
- [x] Related roots link to `/explore/root/[slug]`
- [x] Translation/tafsir availability badges appear
- [x] "View all ayat" button links to topic page
- [x] Enrichment filter works (all/with/without)
- [x] URL parameters update on state change
- [x] URL parameters restore state on page load
- [x] Browser back/forward buttons work
- [x] Tooltips appear after 300ms hover
- [x] Tooltips show correct content per node kind
- [x] Statistics panel shows Quranic coverage stats
- [x] Legend includes "Enriched topic" entry
- [x] Root-topic links marked as "suggested" in UI
- [x] Enrichment data cached on globalThis

## Future Improvements

1. **Authoritative root-topic mappings**: Replace heuristic matching with
   scholar-reviewed mappings when available.
2. **Root nodes as separate layer**: Add a toggleable "root layer" that shows
   root nodes only when explicitly enabled (not by default).
3. **Ayah-level drilldown**: Click on a topic's enrichment badge to see the
   specific ayat referenced.
4. **Coverage heatmap**: Visualize which domains/dimensions have the strongest
   Quranic coverage.
5. **Export enrichment data**: Provide JSON/CSV export of the enrichment
   metadata for scholarly review.
