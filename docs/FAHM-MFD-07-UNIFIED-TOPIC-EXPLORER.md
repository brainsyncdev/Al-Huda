# MFD-07: Unified Topic Explorer

## Overview

MFD-07 Phase 6 implements the Unified Topic Explorer, which brings together two topic systems into a single discovery interface:

1. **Canonical Topics (176)** — Part of the expanded taxonomy from MFD-03/MFD-04, with ayah mappings, typed relationships, and domain/dimension classification.
2. **Editorial Topics (18)** — Curated selections of well-known ayat grouped by theme, with editorial provenance and review status.

## Architecture

### Legacy vs Canonical Coexistence

The two systems coexist with distinct URL structures and purposes:

| System | Count | URL Pattern | Data Source | Purpose |
|--------|-------|-------------|-------------|---------|
| Canonical | 176 | `/explore/topics/[id]` | `data/taxonomy/topics.json` | Structured knowledge discovery with ayah mappings |
| Editorial | 18 | `/topics/[slug]` | `src/lib/topics/data.ts` | Curated entry points for reflection |

### URL Structure

```
/explore/topics              → Unified listing (both systems)
/explore/topics/[id]         → Canonical topic detail (e.g., /explore/topics/tawheed-fundamentals)
/topics/[slug]               → Editorial topic detail (e.g., /topics/patience)
```

### How the Two Systems Complement Each Other

- **Canonical topics** provide structured, exhaustive coverage with typed ayah mappings (DIRECT_REFERENCE, EXPLICIT_INSTRUCTION, THEMATIC_CONNECTION, etc.) and domain/dimension classification.
- **Editorial topics** provide curated, approachable entry points with neutral rationales and editorial provenance.
- The **legacy-canonical mapping** (`src/lib/topics/legacy-canonical-mapping.ts`) bridges the two, allowing users to discover canonical topics from editorial topic pages.

## Key Files

### New Files

- `src/app/explore/topics/[id]/page.tsx` — Canonical topic detail page with ayah mappings, statistics, related topics, and contextual navigation.
- `src/lib/topics/legacy-canonical-mapping.ts` — Mapping between legacy editorial slugs and canonical topic IDs.

### Modified Files

- `next.config.ts` — Removed `/explore/topics` and `/explore/topics/:slug` redirects that conflicted with the new unified listing.
- `src/app/explore/topics/page.tsx` — Replaced legacy listing with unified listing showing both canonical (176) and editorial (18) topics.
- `src/app/explore/topics/[slug]/page.tsx` — Added "Related Canonical Topics" section using the legacy-canonical mapping.
- `src/app/explore/domains/[id]/page.tsx` — Updated topic links from `/explore/topics/[slug]` to `/explore/topics/[id]`.
- `src/app/explore/dimensions/[id]/page.tsx` — Same fix.
- `src/app/explore/sub-dimensions/[id]/page.tsx` — Same fix.

## Data Flow

### Canonical Topic Detail Page

1. `generateStaticParams()` pre-renders all 176 canonical topics.
2. Page loads topic from `getCanonicalTopic(id)`.
3. Loads all ayah mappings from `data/taxonomy/topic-ayah-mappings.json` and filters by `topicId`.
4. For each mapping, loads the actual Quran text via `getSurah()` from `src/lib/quran/data.ts`.
5. Displays:
   - Breadcrumb navigation
   - Title (EN/AR/UR), parent domain/dimension/subdimension links
   - Description and scope
   - Statistics (total ayat, unique surahs, mapping type breakdown)
   - Ayah mappings grouped by type, each showing Arabic text, translation, transliteration, rationale, and "View full ayah" link
   - Related topics (from `relatedTopicIds`)
   - Search aliases as pill badges linking to `/search?q=[alias]`
   - Contextual navigation (parent domain, dimension, subdimension)
   - SEO metadata + JSON-LD
   - Provenance notice ("pending-scholarly-review")

### Unified Listing Page

1. Loads all 176 canonical topics and 18 editorial topics.
2. Builds ayah count index from mappings.
3. Displays statistics header (total canonical, total editorial, total ayah mappings, domains covered).
4. Section 1: Canonical Topics grid with cards linking to `/explore/topics/[id]`.
5. Section 2: Featured Thematic Entry Points grid with cards linking to `/topics/[slug]`.
6. About section explaining the two systems.

### Legacy-to-Canonical Mapping

The mapping file (`src/lib/topics/legacy-canonical-mapping.ts`) provides:

```typescript
getCanonicalTopicsForLegacyTopic(legacySlug: string): string[]
getLegacyTopicsWithCanonicalMappings(): string[]
hasCanonicalMappings(legacySlug: string): boolean
```

Each legacy topic slug maps to an array of canonical topic IDs. For example:
- `patience` → `['sabr-patience', 'trial-and-test']`
- `tawheed` → `['tawheed-fundamentals', 'tawheed-rububiyyah', 'tawheed-uluhiyyah', 'tawheed-asma-wa-sifat']`
- `prophets` → `['prophet-definition', 'prophet-vs-messenger', 'seal-of-prophethood', 'adam-story', 'ibrahim-story', 'musa-story', 'isa-story', 'muhammad-story']`

All canonical IDs are verified against `data/taxonomy/topics.json`.

## Migration Notes

### Redirect Removal

The following redirects were removed from `next.config.ts`:

```typescript
// REMOVED:
{
  source: '/explore/topics',
  destination: '/topics',
  permanent: true,
},
{
  source: '/explore/topics/:slug',
  destination: '/topics/:slug',
  permanent: true,
},
```

This allows `/explore/topics` to serve the unified listing page directly.

### Link Updates

All topic links in domain, dimension, and subdimension pages were updated from:
```typescript
href={`/explore/topics/${topic.slug}`}
```
to:
```typescript
href={`/explore/topics/${topic.id}`}
```

This ensures links point to the canonical topic detail pages.

### Backward Compatibility

- Legacy `/topics/[slug]` routes remain functional for the 18 editorial topics.
- The legacy topic detail page (`src/app/explore/topics/[slug]/page.tsx`) now includes a "Related Canonical Topics" section.
- Users can navigate from editorial topics to canonical topics for deeper exploration.

## Validation

After implementation:

- ✅ TypeScript compiles without errors (`npx tsc --noEmit`)
- ✅ All 176 canonical topics have detail pages at `/explore/topics/[id]`
- ✅ All 18 editorial topics remain accessible at `/topics/[slug]`
- ✅ `/explore/topics` shows unified listing (no redirect)
- ✅ No 404s when clicking topic links from domain/dimension/subdimension pages
- ✅ Redirect conflict resolved in `next.config.ts`

## Future Work

- Add client-side filtering and search to the unified listing page.
- Implement domain dropdown filter for canonical topics.
- Add ayah mapping statistics to the canonical topic cards.
- Consider merging the two systems into a single unified topic model in a future phase.
- Add scholarly review workflow for canonical topics.

## Provenance

All canonical topics carry `pending-scholarly-review` provenance. Editorial topics carry `editorial-selection-v1` provenance with `pending-scholarly-review` status. Neither system represents a scholarly classification of the Quran.
