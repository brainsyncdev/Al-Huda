# MFD-07 Navigation Map

## Overview

Complete navigation paths between all Quranic knowledge systems in the FAHM Explore module. MFD-07 transformed FAHM from a structured topic collection into a connected Quranic knowledge system with seamless cross-navigation.

## Navigation Flows

### 1. Topic → Ayah → Translation → Tafsir

**Start:** `/explore/topics/[id]`

**Flow:**
1. Canonical topic page displays ayah mappings grouped by mapping type
2. Each ayah shows:
   - Arabic text (Uthmani script)
   - English translation (Saheeh International)
   - Transliteration
3. Each ayah links to `/ayah/[surah]/[ayah]` for full context
4. From ayah page, access:
   - Multiple translations (100+ via Tanzil proxy)
   - Classical tafsirs (al-Jalalayn, al-Muyassar in-app; Ibn Kathir, Ma'ariful Quran external)
   - Word-by-word analysis
   - Root context

**Data Sources:**
- Ayah mappings: `data/taxonomy/topic-ayah-mappings.json` (792 records)
- Quran text: `quran-json@3.1.2`
- Translations: Bundled Saheeh International + on-demand Tanzil proxy
- Tafsir: 4 sources (2 in-app Arabic, 2 external English)

### 2. Ayah → Topics

**Start:** `/ayah/[surah]/[ayah]`

**Flow:**
1. Ayah page shows two topic sections:
   - **Editorial Topics** (legacy): Curated thematic connections from original FAHM
   - **Canonical Topics** (MFD-07): Taxonomy-driven references from 182 canonical topics
2. Editorial topics link to `/topics/[slug]`
3. Canonical topics link to `/explore/topics/[id]`

**Implementation:**
- Editorial: `topicsForAyah()` from `src/lib/topics/data.ts`
- Canonical: Filters `topic-ayah-mappings.json` where `surahNumber === surah && ayahStart <= ayah && ayahEnd >= ayah`

**Note:** An ayah may appear in multiple canonical topics (e.g., Al-Fatiha 1:1 appears in 5+ topics).

### 3. Topic → Root

**Start:** `/explore/topics/[id]`

**Flow:**
1. Canonical topic page shows "Related Arabic Roots" section
2. Displays up to 5 root chips with:
   - Arabic root text
   - Transliteration
   - Link to `/explore/root/[rootSlug]`
3. Each root links to root detail page showing all occurrences

**Implementation:**
- Uses `getTopicEnrichment()` from `src/lib/graph/canonical-graph-enrichment.ts`
- Root-topic connections are **heuristic suggestions** based on keyword matching
- Two strategies:
  1. Curated keyword map (~150 Islamic concept keywords → root slugs, high confidence)
  2. Heuristic text matching against root slugs/lemmas (lower confidence)
- Top 5 roots per topic to avoid noise

**Disclaimer:** "Root connections are heuristic suggestions based on topic keywords, not authoritative linguistic analysis."

### 4. Root → Topic

**Start:** `/explore/root/[root]`

**Flow:**
1. Root detail page shows "Topics Referencing This Root" section
2. Lists all canonical topics whose enrichment includes this root
3. Each topic links to `/explore/topics/[id]`

**Implementation:**
- Uses `getGraphEnrichmentData()` from `src/lib/graph/canonical-graph-enrichment.ts`
- Filters topics where `topicEnrichment.relatedRoots.includes(rootSlug)`
- Displays topic title, domain, dimension

**Note:** Connections are bidirectional with Topic → Root, but marked as heuristic in both directions.

### 5. Graph → Topic → Ayah

**Start:** `/explore/graph`

**Flow:**
1. Interactive knowledge graph with 299 nodes (20 domains, 103 dimensions, 25 subdimensions, 182 topics)
2. Click topic node → Detail panel shows:
   - Topic title, description
   - Quranic enrichment stats (ayat count, surah count, mapping types)
   - Related roots (top 5)
   - Translation/tafsir badges
   - "View topic" button → `/explore/topics/[id]`
3. From topic page → ayah mappings → individual ayahs

**Graph Features:**
- Zoom/pan controls (mouse wheel, drag, buttons, keyboard)
- Edge highlighting on hover
- Minimap (bottom-left, real-time viewport tracking)
- Keyboard shortcuts (? for help)
- URL state persistence (`?filter=`, `?enrichment=`, `?search=`, `?selected=`)
- Filters: "All topics / With references / Without references"

**Implementation:**
- Graph builder: `src/lib/graph/canonical-knowledge-graph.ts`
- Enrichment: `src/lib/graph/canonical-graph-enrichment.ts`
- Explorer: `src/components/graph/canonical-graph-explorer.tsx`

### 6. Domain/Dimension/Subdimension → Topic

**Start:** 
- `/explore/domains/[id]`
- `/explore/dimensions/[id]`
- `/explore/sub-dimensions/[id]`

**Flow:**
1. Domain/dimension/subdimension page shows topic cards
2. Each card links to `/explore/topics/[id]`
3. Topic page shows full details with ayah mappings

**Implementation:**
- All topic links use `/explore/topics/[id]` (not slug)
- Fixed in Phase 6 to prevent 404s from legacy slug conflicts

**Note:** Canonical taxonomy hierarchy:
- 20 domains → 103 dimensions → 25 subdimensions → 182 topics

### 7. Legacy Topic → Canonical Topic

**Start:** `/topics/[slug]` (legacy editorial topics)

**Flow:**
1. Legacy topic page shows "Related Canonical Topics" section
2. Lists canonical topics mapped to this legacy topic
3. Each canonical topic links to `/explore/topics/[id]`

**Implementation:**
- Uses `getCanonicalTopicsForLegacyTopic()` from `src/lib/topics/legacy-canonical-mapping.ts`
- Maps 18 legacy slugs to canonical IDs
- Preserves backward compatibility for bookmarks

**Note:** Legacy topics preserved at `/topics/[slug]` for bookmark compatibility; canonical topics at `/explore/topics/[id]`.

### 8. Search → Topics

**Start:** `/search?q=[query]`

**Flow:**
1. Global search indexes both:
   - Editorial topics (legacy)
   - Canonical topics (MFD-07)
2. Search results show:
   - "Editorial Topic" label → `/topics/[slug]`
   - "Canonical Topic" label → `/explore/topics/[id]`
3. Canonical topics searchable by:
   - Title (English, Arabic, Urdu)
   - Description
   - Search aliases
   - Domain/dimension/subdimension titles

**Implementation:**
- Canonical topics loaded via `getCanonicalTopics()` from `src/lib/taxonomy/canonical-adapter.ts`
- Search matches against title, arabicTitle, urduTitle, description, searchAliases
- Results distinguished by labels

**Note:** Canonical topics marked as "pending scholarly review" in search results.

## URL Patterns

| Resource | URL Pattern | Example |
|----------|-------------|---------|
| Canonical topics | `/explore/topics/[id]` | `/explore/topics/faith-in-allah` |
| Legacy topics | `/topics/[slug]` | `/topics/faith` |
| Ayah pages | `/ayah/[surah]/[ayah]` | `/ayah/2/255` |
| Root pages | `/explore/root/[rootSlug]` | `/explore/root/r-h-m` |
| Domain pages | `/explore/domains/[id]` | `/explore/domains/faith-revelation` |
| Dimension pages | `/explore/dimensions/[id]` | `/explore/dimensions/faith-pillars` |
| Subdimension pages | `/explore/sub-dimensions/[id]` | `/explore/sub-dimensions/faith-foundation` |
| Knowledge graph | `/explore/graph` | `/explore/graph` |
| Search | `/search?q=[query]` | `/search?q=mercy` |

## Data Sources

### Canonical Taxonomy
- **Domains:** `data/taxonomy/domains.json` (20 domains)
- **Dimensions:** `data/taxonomy/dimensions.json` (103 dimensions)
- **Subdimensions:** `data/taxonomy/subdimensions.json` (25 subdimensions)
- **Topics:** `data/taxonomy/topics.json` (182 topics)
- **Relationships:** `data/taxonomy/relationships.json` (150+ relationships)
- **Ayah mappings:** `data/taxonomy/topic-ayah-mappings.json` (792 records)

### Quran Dataset
- **Quran text:** `quran-json@3.1.2` (CC-BY-4.0)
- **114 surahs, 6,236 ayat**

### Translations
- **Bundled:** Saheeh International (English)
- **On-demand:** Tanzil proxy (100+ translations, 50+ languages)

### Tafsir
- **In-app Arabic:** al-Jalalayn, al-Muyassar
- **External English:** Ibn Kathir, Ma'ariful Quran (links to publishers)

### Arabic Roots
- **Root registry:** `data/root-discovery-registry.json` (1,642 roots, 1,471 activated)
- **Morphology:** Sprint 48 auto-activated roots

## Navigation Quality Notes

### Canonical vs Legacy
- **Canonical topics** use `/explore/topics/[id]` (ID-based, not slug)
- **Legacy topics** use `/topics/[slug]` (slug-based, preserved for bookmarks)
- Both coexist via mapping layer in `src/lib/topics/legacy-canonical-mapping.ts`

### Root-Topic Connections
- **Heuristic:** Keyword-based matching, not authoritative linguistic analysis
- **Limited:** Top 5 roots per topic to avoid noise
- **Marked:** UI and docs clearly label as "suggested connections"
- **Bidirectional:** Topic → Root and Root → Topic both work

### Ayah-Topic Connections
- **Editorial:** From curated mappings, not AI-generated
- **Provenance:** Each mapping has `provenance` field (e.g., "editorial-curated", "pending-scholarly-review")
- **Status:** All mappings marked as "pending-scholarly-review"
- **Range support:** Mappings can reference ayah ranges (ayahStart to ayahEnd)

### Search Indexing
- **Dual indexing:** Both editorial and canonical topics searchable
- **Distinguished:** Labels clarify which type each result is
- **Canonical disclaimer:** "Pending scholarly review" shown for canonical topics

### Accessibility
- **ARIA labels:** All interactive elements labeled
- **Keyboard navigation:** Full keyboard support (Tab, Enter, Escape, arrows)
- **Focus indicators:** Visible focus rings
- **Screen reader:** Semantic HTML, proper heading hierarchy
- **Mobile responsive:** All navigation works on mobile devices

### Performance
- **Static generation:** All canonical topic pages pre-rendered at build time
- **Caching:** Enrichment data cached on `globalThis` to avoid repeated file reads
- **Lazy loading:** Translation/tafsir data loaded on-demand

## Policy Compliance

### FR-030: Tafsir Attribution
- All tafsir sources clearly attributed
- In-app tafsirs (al-Jalalayn, al-Muyassar) displayed with attribution
- External tafsirs (Ibn Kathir, Ma'ariful Quran) link to publishers

### FR-031: Tafsir vs Translation
- Tafsir clearly labeled as "interpretation" not "translation"
- UI distinguishes between translation (direct rendering) and tafsir (scholarly commentary)

### FR-032: Licensing
- Tafsir content not cached or stored
- External links respect publisher licensing
- In-app tafsirs use licensed datasets

### FR-033: AI Safety
- AI cannot generate Quran text, tafsir, hadith, or rulings
- All religious content from verified sources only
- Enrichment layers are navigation aids, not content generators

## Statistics

- **Canonical topics:** 182
- **Ayah mappings:** 792 records
- **Expanded ayat:** 1,889 (after range expansion)
- **Tafsir links:** 7,556 (1,889 ayat × 4 tafsirs)
- **Arabic roots:** 1,642 (1,471 activated)
- **Knowledge graph nodes:** 299
- **Knowledge graph edges:** ~230

## Future Enhancements

1. **Scholarly review:** Move mappings from "pending-scholarly-review" to "scholarly-approved"
2. **Root-topic authority:** Replace heuristic connections with linguistic analysis
3. **Advanced search:** Semantic search across topics, ayahs, roots
4. **Study paths:** Guided learning journeys through topic-ayah-root networks
5. **Personalization:** User collections of favorite topics/ayahs/roots

## Related Documentation

- `FAHM-MFD-07-BASELINE-AUDIT.md` — Phase 1 audit
- `FAHM-MFD-07-TAXONOMY-EXPANSION.md` — Phase 2 taxonomy completion
- `FAHM-MFD-07-QURANIC-AYAH-MAPPING.md` — Phase 3 ayah mapping
- `FAHM-MFD-07-TRANSLATION-INTEGRATION.md` — Phase 4 translation enrichment
- `FAHM-MFD-07-TAFSIR-INTEGRATION.md` — Phase 5 tafsir enrichment
- `FAHM-MFD-07-UNIFIED-TOPIC-EXPLORER.md` — Phase 6 unified explorer
- `FAHM-MFD-07-GRAPH-ENRICHMENT.md` — Phase 7 graph enrichment
- `FAHM-MFD-07-GRAPH-INTERACTIONS.md` — Phase 8 graph interactions
