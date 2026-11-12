# FAHM MFD-07 — Baseline Audit Report

**Date:** November 12, 2026  
**Phase:** MFD-07 Phase 1 — Repository & Source Inventory  
**Status:** ✅ Complete

---

## Executive Summary

Comprehensive audit of FAHM repository completed across 6 workstreams:

1. **Routes & Navigation** — 48 routes, content-based navigation
2. **Graph Infrastructure** — Two parallel systems (legacy + canonical)
3. **Arabic Roots & Vocabulary** — 1,642 roots, full morphology pipeline
4. **Legacy Topics** — 18 curated editorial topics
5. **Quran/Translation/Tafsir** — 114 surahs, 6,236 ayat, 14 source records
6. **Taxonomy** — 20 domains, 98 dimensions, 25 subdimensions, 176 topics

---

## 1. Routes & Navigation Audit

### Route Inventory

**Total routes:** 48

**Key routes:**
- `/` — Home
- `/quran`, `/quran/[slug]` — Quran reader
- `/explore` — Explore landing
- `/explore/domains`, `/explore/domains/[id]` — Domain Explorer
- `/explore/dimensions/[id]` — Dimension detail
- `/explore/sub-dimensions/[id]` — Subdimension detail
- `/explore/topics`, `/explore/topics/[slug]` — Legacy topics
- `/explore/graph` — Knowledge Graph
- `/explore/root`, `/explore/root/[root]` — Root Explorer
- `/topics`, `/topics/[slug]` — Legacy topics (alternate)
- `/learn`, `/learn/journeys`, `/learn/paths` — Learning
- `/my-study` — Personal study
- `/search` — Global search
- `/sources` — Source registry

### Navigation Components

**Site Header** (`src/components/layout/site-header.tsx`):
- 4 primary nav items: Read, Explore, Learn, My Study
- 3 utility icons: Search, Language Selector, Settings
- Desktop: full nav; Mobile: logo + search only

**Mobile Bottom Nav** (`src/components/layout/mobile-bottom-nav.tsx`):
- 5 tabs: Home, Read, Explore, Learn, My Study
- Fixed bottom navigation for small screens

### Redirects

**Critical redirect issue:**
```
/explore/topics → /topics (permanent)
/explore/topics/:slug → /topics/:slug (permanent)
```

This means canonical topic pages at `/explore/topics/[slug]` are being redirected to legacy `/topics/[slug]` routes.

**Other redirects:**
- `/library` → `/my-study`
- `/study-journeys` → `/learn/journeys`
- `/discover` → `/explore`

### Cross-Navigation

**Rich cross-navigation exists:**
- Topic pages link to: dimensions, domains, roots, learning paths, study journeys
- Ayah pages link to: surah, topics, learning paths, root context
- Dimension pages link to: topics, search
- Graph links to: entity detail pages
- Root Explorer links to: root detail pages

### Issues

1. **No NOOR/FAHM/EXPLORE mode switcher** — App uses content-based navigation
2. **Redirect conflict** — `/explore/topics` redirects to legacy `/topics`
3. **Domain Explorer marked as "proposal"** — Despite being fully implemented
4. **Multiple explore sub-routes not prominently linked** — `/explore/dimensions/[id]`, `/explore/sub-dimensions/[id]`, `/explore/theme/[name]`

---

## 2. Graph Infrastructure Audit

### Legacy Graph

**File:** `src/lib/graph/knowledge-graph.ts`

**Entity types:** 2 (dimension, topic)  
**Edge types:** 2 (DIMENSION_TOPIC, TOPIC_RELATION)  
**Counts:** ~26 nodes, ~50 edges

**Features:**
- Provenance tracking
- Unresolved reference detection
- Deterministic serialization
- Conservative edge status
- Scope notes

**Explorer:** `src/components/graph/knowledge-graph-explorer.tsx`
- Concentric ring layout (dimensions outer, topics inner)
- Filter by dimension (pill buttons)
- Node selection with detail panel
- Keyboard navigation (spatial)
- Legend
- List view fallback
- 44px touch targets

**Missing:** Search, edge type filtering

### Canonical Graph

**File:** `src/lib/graph/canonical-knowledge-graph.ts`

**Node kinds:** 4 (domain, dimension, subdimension, topic)  
**Edge types:** 5 (CONTAINS, BELONGS_TO, RELATED_TO, CROSS_REFERENCES, SHARES_CONCEPT)  
**Counts:** 299 nodes, ~230 edges

**Features:**
- Hierarchical taxonomy
- Multi-language support (EN, AR, UR)
- Rich relationship types
- Query utilities (filter, search, connected nodes)
- Parent/child/related tracking

**Explorer:** `src/components/graph/canonical-graph-explorer.tsx`
- Multi-ring layout (domains outer, dimensions middle, subdimensions inner, topics center spiral)
- Search with autocomplete
- Node type filter
- Edge type filter
- Node selection with detail panel
- Legend with counts
- Statistics panel
- Mobile fallback
- Keyboard navigation (connected-nodes cycling)
- Color-coded nodes by kind

**Missing:** Zoom/pan, node expansion, edge highlighting, force-directed layout

### Graph Page

**File:** `src/app/explore/graph/page.tsx`

**Uses:** Canonical graph builder  
**Displays:** Statistics cards, provenance notice, canonical explorer, about section

### Issues

1. **No zoom/pan controls** — Neither system has them
2. **No node expansion/collapse** — Can't expand node clusters
3. **No edge highlighting on hover**
4. **No force-directed layout option**
5. **Legacy and canonical systems operate independently** — No integration

---

## 3. Arabic Roots & Vocabulary Audit

### Roots Data

**Sprint 48 Registry** (`data/root-discovery-registry.json`):
- **Total roots:** 1,642
- **Activated:** 1,471
- **Partially activated:** 103
- **Needs review:** 68
- **Total occurrences:** 44,550
- **Total distinct ayat:** 39,720
- **Total lemmas activated:** 4,350
- **Source:** qul-morphology-v1

**Manual Root Allowlist** (`src/lib/morphology/root-allowlist.ts`):
- **Total roots:** 10 (sabr, shukr, rahmah, ilm, tawbah, maghfirah, kibr, khushu, sidq, tawakkul)
- **Status:** All pending review
- **Included lemmas:** None approved yet

**Occurrence files:** `data/root-occurrences/` — 1,600+ individual JSON files

### Root Explorer Pages

**Listing page** (`src/app/explore/root/page.tsx`):
- Header with title and statistics
- Data availability checks
- Delegates to RootListingClient

**Listing client** (`src/app/explore/root/root-listing-client.tsx`):
- Search by Arabic root, transliteration, or slug
- Status filter (all, activated, partially-activated, needs-review, discovered)
- Sort options (alphabetical, occurrences-desc, ayat-desc, transliteration)
- Pagination (50 roots per page)
- Root cards with Arabic, transliteration, counts, status

**Detail page** (`src/app/explore/root/[root]/page.tsx`):
- Root header with Arabic, transliteration, status badge
- Lemma distribution grid
- Word occurrences list with pagination (25 per page)
- Each occurrence: ayah Arabic, translation, reference, matched lemma, matched token
- Coverage disclosure
- Source integrity footer

**Views:** ManualRootView, Sprint48RootView, Sprint48NeedsReviewView, Sprint48DiscoveredView, RootIndexView, PendingReviewRootView, RejectedRootView

### Vocabulary Data

**Status:** Word-by-word only  
**File:** `src/lib/quran/words.ts`  
**Data:** `public/word-data/{surah}.json` (per-surah files)  
**Source:** Quran.com API v4 (QUL word data)

**Features:**
- Lazy loading per surah
- In-memory caching
- React hook: `useVerseWords(surah, ayah)`
- Preload function: `preloadSurahWords(surah)`

**Issues:**
- No dedicated vocabulary dataset (frequency, definitions, usage patterns)
- Word data is per-verse segmentation, not vocabulary learning resource
- No vocabulary explorer or word study tools

### Concepts Data

**Status:** Topics only, no concepts  
**File:** `src/lib/topics/data.ts`  
**Description:** Editorial selections of well-known ayat organized by theme — NOT automated concept extraction

**Schema:**
- Topic: slug, title, arabicTitle, summary, editorialDescription, knownLimitations, reviewState, relations, provenance
- TopicRelation: ref (AyahRef), type, rationale, provenance

**Relation types:** TOPIC_ASSOCIATION, LEXICAL_MATCH, CROSS_REFERENCE, SEQUENTIAL_CONTEXT

**Issues:**
- No dedicated "concepts" dataset separate from topics
- Topics are editorial, not algorithmically derived
- No concept explorer or concept-based navigation
- Root-to-topic links gated by `canActivateRootTopic()`

### Morphology Data

**Status:** Fully implemented  
**Core index:** `data/morphology-index.json` — 1.2M+ records  
**Source:** qul-morphology-v1

**Modules:** 43 files in `src/lib/morphology/`
- types.ts, validators.ts, occurrence-index.ts
- root-data.ts, sprint-48-root-data.ts, root-discovery.ts
- root-allowlist.ts, root-links.ts
- publication-status.ts, publication-policy.ts
- batch-eligibility.ts, ai-lemma-reviewer.ts, review-pipeline.ts
- human-review/, auto-review/

**Test coverage:** Sprint 39-50 (12 test files)

**Features:**
- Deterministic root discovery
- Lemma coverage tracking
- Automated lemma review with AI assistance
- Human review workflow
- Publication policy enforcement
- Occurrence indexing with pagination
- Topic-to-root navigational links
- Source integrity validation

### Issues

1. **No dedicated vocabulary dataset** — Only word-by-word segmentation
2. **No "concepts" dataset** — Only editorial topics
3. **Review bottleneck** — 10 manual roots all pending review
4. **Data duplication** — Two root data sources (manual + Sprint 48)
5. **Performance** — 1.2M+ morphology records loaded into memory
6. **Limited integration** — Root explorer and topics are separate systems

---

## 4. Legacy Topics Audit

### Legacy Topic Data

**File:** `src/lib/topics/data.ts`  
**Count:** 18 curated topics

**Schema:**
- slug (URL-safe kebab-case)
- language (BCP 47, stamped as 'en')
- title (English)
- arabicTitle
- urduTitle (optional)
- summary (one paragraph)
- editorialDescription (expanded scope)
- knownLimitations (string[])
- reviewState ('draft' | 'needs_review' | 'reviewed' | 'published') — all 18 are 'reviewed'
- related (string[] — other topic slugs)
- relations (TopicRelation[] — ayah refs with type, rationale, provenance)
- provenance (ProvenanceRecord)

**Relation types:** TOPIC_ASSOCIATION, LEXICAL_MATCH, CROSS_REFERENCE, SEQUENTIAL_CONTEXT

**Review status:** All 'pending-scholarly-review'

**Topic slugs:**
patience, gratitude, trust-in-god, mercy-and-forgiveness, remembrance, giving, justice, parents-and-family, hardship-and-ease, knowledge-and-reflection, the-hereafter, tawheed, prayer, supplication, god-consciousness, repentance, prophets, good-character

### Legacy Navigation

**File:** `src/lib/topics/navigation.ts`

**Functions:**
- `getTopicsForAyah(surah, ayah)` — Reverse index
- `getJourneysForTopic(topicSlug)` — Find study journeys
- `getDimensionForTopic(topicSlug)` — Primary dimension
- `getAllDimensionsForTopic(topicSlug)` — All dimensions
- `getDomainForTopic(topicSlug)` — Primary domain
- `getAllDomainsForTopic(topicSlug)` — All domains
- `getTopicUrl(topicSlug)` → `/topics/${slug}`
- `getDimensionUrl(dimensionId)` → `/explore/dimension/${id}`
- `getDomainUrl(domainId)` → `/explore/domains/${id}`
- `getJourneyUrl(journeySlug)` → `/learn/journeys/${slug}`

**URL patterns:**
- Topic: `/topics/[slug]` (note: no /explore prefix)
- Dimension: `/explore/dimension/[id]` (SINGULAR)
- Domain: `/explore/domains/[id]` (PLURAL)
- Journey: `/learn/journeys/[slug]`

### Legacy Pages

**Topic detail** (`src/app/explore/topics/[slug]/page.tsx`):
- Breadcrumb (Explore > Topics > [title])
- Header with title, arabicTitle, summary
- Review status notice
- Contextual navigation: dimensions, domains, study journeys
- Curated ayat list: relation type, rationale, reference, 'View ayah' link
- Related topics chips
- Editorial provenance section
- Back navigation

**Topics listing** (`src/app/explore/topics/page.tsx`):
- Header with count (18 curated topics)
- Review status notice
- Topics grid sorted by relation count
- Each card: title, arabicTitle, summary, verse count, dimension chips, domain chips
- About Topic Curation section
- Link to /learn/journeys

**Dimension page** (`src/app/explore/dimension/[id]/page.tsx` — SINGULAR):
- Breadcrumb (Home > Explore > [dimension title])
- Header with number badge, title, arabicTitle, covers, description
- Review status notice
- Curated starting points: resolved topics
- Unresolved slugs warning
- Empty state if no topics
- Search section with dimension's searchTerms
- Back to /explore

### Comparison with Canonical

**Legacy count:** 18  
**Canonical count:** 177 (note: audit said 176, but actual file has 177)

**Granularity difference:**
- Legacy: Broad thematic entry points (e.g., 'patience', 'gratitude', 'tawheed')
- Canonical: Granular specialized subjects (e.g., 'sabr-patience', 'shukr-gratitude', 'tawheed-rububiyyah')

**ID/slug overlap:** NO direct overlap
- Legacy uses slugs like 'patience', 'gratitude'
- Canonical uses ids like 'sabr-patience', 'shukr-gratitude'
- Different naming conventions

**Subject mapping examples:**
- patience ≈ sabr-patience
- gratitude ≈ shukr-gratitude
- trust-in-god ≈ tawakkul-trust
- mercy-and-forgiveness ≈ divine-mercy + divine-wrath (canonical splits)
- the-hereafter ≈ resurrection-judgment + paradise-jannah + hell-jahannam (canonical splits into 3)
- tawheed ≈ tawheed-fundamentals + tawheed-rububiyyah + tawheed-uluhiyyah + tawheed-asma-wa-sifat (canonical splits into 4)

**Schema differences:**
- Legacy has: relations (ayah refs), editorialDescription, knownLimitations, reviewState
- Canonical has: id (separate from slug), parentDomainId, parentDimensionId, parentSubdimensionId, relatedTopicIds, searchAliases, quranicRelevance, specialized

### Migration Notes

**Approach:** Legacy topics are editorial entry points; canonical topics are taxonomy-driven granular subjects. They serve different purposes and should not be merged 1:1.

**Options:**
1. Keep legacy as 'featured topics' that link to canonical topics
2. Map legacy to canonical via 'featuredTopicToCanonical' mapping
3. Retire legacy and rebuild entry points from canonical
4. Hybrid: canonical as source of truth, create 'curated collections' grouping canonical topics thematically

**Ayah relations:** Legacy has ayah relations; canonical does not. If canonical needs ayah relations, significant data work required.

**URL routing:** Legacy uses slug-based routing (`/topics/[slug]`); canonical uses id-based routing. Need to decide on canonical URL structure.

### Issues

1. **URL inconsistency** — Dimension page uses singular `/explore/dimension/[id]` but domain uses plural `/explore/domains/[id]`
2. **No direct ID/slug mapping** — Legacy and canonical are completely different systems
3. **Legacy topics don't have parentDomainId/parentDimensionId** — Relationships resolved via navigation helpers
4. **10x granularity difference** — 177 canonical vs 18 legacy
5. **Legacy has ayah relations; canonical doesn't** — Significant data gap
6. **Different schemas** — Legacy uses reviewState, canonical uses parentDomainId/parentDimensionId
7. **No migration path defined**
8. **Different architectural approaches** — Legacy uses external mappings, canonical stores parents directly

---

## 5. Quran/Translation/Tafsir Audit

### Quran Dataset

**Source:** quran-json@3.1.2 (CC-BY-4.0)  
**Location:** `node_modules/quran-json/dist/chapters/en`  
**Surah count:** 114  
**Total ayat:** 6,236

**Schema:**
- RawVerse: id, text (Uthmani Arabic), translation (Saheeh International English), transliteration (Latin)
- RawChapter: id, name (Arabic), transliteration, translation (meaning), type (meccan|medinan), total_verses, verses[]
- RawIndexEntry: id, name, transliteration, translation, type, total_verses

**Loader:** `src/lib/quran/data.ts`  
**Validation:** `validateDataset()` checks 114 surahs, 6236 ayat, sequential IDs, no duplicates

**Features:**
- Slug generation from transliteration
- HMR-safe cache on globalThis
- Context window (±2 ayah radius)

### Translations

**Total sources:** 2

**Source 1: tanzil-sahih**
- Provides: English translation (Saheeh International)
- Attribution: Saheeh International (Umm Muhammad et al.)
- Publisher: Tanzil.net (en.sahih)
- License: Tanzil terms of use (attribution + no modification)
- Method: package (bundled)

**Source 2: tanzil-translations**
- Provides: Quran translations in 50+ languages
- Attribution: Various translators
- Publisher: Tanzil.net
- License: Tanzil terms of use
- Method: link (on-demand)
- Default: Urdu (Jalandhry)
- Notes: Fetched on-demand via `/api/translations/[id]` proxy, cached in memory. 100+ translations available.

**Edition catalog:** `src/lib/quran/translations.ts`  
**Loading mechanism:** On-demand fetch from Tanzil.net, session-cached  
**User interface:** Reader controls and settings allow switching

### Tafsir

**Total sources:** 4  
**In-app readable:** 2  
**Link-out only:** 2

**Source 1: tafsir-jalalayn**
- Provides: Tafsir al-Jalalayn (Arabic) — classical tafsir
- Attribution: Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti (15th century CE)
- Publisher: Tanzil.net (ar.jalalayn)
- License: Tanzil terms
- Language: ar
- Method: link
- Readable in-app: true
- Notes: Served through `/api/translations/[id]` proxy

**Source 2: tafsir-muyassar**
- Provides: Tafsir al-Muyassar (Arabic) — contemporary tafsir
- Attribution: King Fahd Complex for the Printing of the Holy Quran
- Publisher: Tanzil.net (ar.muyassar)
- License: Tanzil terms
- Language: ar
- Method: link
- Readable in-app: true

**Source 3: tafsir-ibn-kathir**
- Provides: Tafsir excerpts — Ibn Kathir (English abridged)
- Attribution: Isma'il ibn Umar ibn Kathir; English translation by Darussalam
- Publisher: External references (link-out only)
- License: Check external source; not redistributed
- Language: en
- Method: link
- Readable in-app: false
- Homepage: https://www.qtafsir.com/

**Source 4: tafsir-ma(arif)**
- Provides: Tafsir excerpts — Ma'ariful Quran (English)
- Attribution: Mufti Muhammad Shafi Usmani
- Publisher: External references (link-out only)
- License: Check external source; not redistributed
- Language: en
- Method: link
- Readable in-app: false
- Homepage: https://www.maarifulquran.org/

**Search module:** `src/lib/quran/tafsir-search.ts`  
**Search capabilities:** Literal substring search across both in-app Arabic tafsirs  
**API endpoint:** `/api/v1/search/tafsir?q={query}&limit={n}&offset={n}`

**Policy notes:**
- Tafsir is interpretation, not translation
- No tafsir text is vendored; fetched on demand
- AI must not generate tafsir citations
- Editorial selections are explicitly marked as 'not tafsir'

### Source Registry

**Location:** `src/lib/quran/sources.ts`  
**Total records:** 14

**Breakdown:**
- quranText: 2
- translations: 2
- tafsir: 4
- audio: 1
- metadata: 1
- embeddings: 1
- wordData: 1
- other: 2

**Records:**
1. quran-json (quran-text, package, CC-BY-4.0)
2. quranenc (quran-text, package, CC-BY-4.0)
3. tanzil-sahih (translation, package, Tanzil terms)
4. tanzil-translit (transliteration, package, Tanzil terms)
5. tanzil-translations (translation, link, Tanzil terms)
6. islamic-network-audio (audio, link, CDN terms)
7. tanzil-mushaf-metadata (metadata, package, CC-BY)
8. tafsir-jalalayn (tafsir, link, Tanzil terms)
9. tafsir-muyassar (tafsir, link, Tanzil terms)
10. semantic-embeddings (embeddings, package, Apache-2.0)
11. qul-word-data (word-data, package, MIT)
12. tafsir-ibn-kathir (tafsir, link, External)
13. tafsir-ma(arif) (tafsir, link, External)

**Validation status:** All records validated by `scripts/validate-source-licenses.mjs`  
**Interface:** `SourceRecord { id, provides, attribution, publisher, license, licenseUrl?, homepage, language?, version, method, notes? }`

### Rights Metadata

**Validator:** `scripts/validate-source-licenses.mjs`

**Checks:**
- Every record has license, version, homepage, method, attribution fields
- No duplicate source IDs
- Method is either 'package' or 'link'
- Link-out sources explicitly state they are not redistributed
- `docs/DATA-PROVENANCE.md` exists

**Exit codes:**
- 0: All validations passed
- 1: Validation issues found
- 2: Missing rights register file

**Output formats:** human-readable, json (--json flag)  
**Provenance doc:** `docs/DATA-PROVENANCE.md`

**Policy notes:**
- Structural check, not legal opinion
- License field presence verified, not legal validity
- AI_RULES requires provenance documentation

### Issues

1. **Tafsir text not bundled** — Fetched on-demand from Tanzil.net (requires network)
2. **Two English tafsirs link-out only** — Users must visit external sites (licensing restrictions)
3. **Version field uses descriptive text** — No numeric version pinning except quran-json
4. **Audio streaming has no explicit copyright license** — Streams rather than bundles to avoid redistribution claims

---

## 6. Taxonomy Audit

### Taxonomy Data

**Domains** (`data/taxonomy/domains.json`):
- **Count:** 20
- **Schema:** id, title, urduTitle, arabicTitle, description, scope, dimensionIds[]
- **Sample IDs:** belief-theology, revelation-guidance, prophets-narratives, worship-practice, ethics-character
- **Validation:** ✅ Valid

**Dimensions** (`data/taxonomy/dimensions.json`):
- **Count:** 98
- **Schema:** id, title, urduTitle, arabicTitle, description, parentDomainId, subdimensionIds[], topicIds[], aliases[]
- **Sample IDs:** allah-divine-attributes, tawheed-oneness, iman-faith-pillars, angels-unseen-world, divine-decree-qadr
- **Validation:** ✅ Valid

**Subdimensions** (`data/taxonomy/subdimensions.json`):
- **Count:** 25
- **Schema:** id, title, description, parentDimensionId, topicIds[]
- **Sample IDs:** divine-names, divine-attributes-categories, angels-specific, jinn-shaytan, quran-revelation
- **Validation:** ✅ Valid

**Topics** (`data/taxonomy/topics.json`):
- **Count:** 176
- **Schema:** id, slug, title, urduTitle, arabicTitle, description, scope, parentDomainId, parentDimensionId, parentSubdimensionId, relatedTopicIds[], searchAliases[], quranicRelevance, specialized, provenance
- **Sample IDs:** tawheed-fundamentals, asma-ul-husna, divine-unity, divine-mercy, divine-wrath
- **Validation:** ⚠️ Mostly valid — all have `quranicRelevance: 'pending-scholarly-review'` (no actual verse mappings)

**Relationships** (`data/taxonomy/relationships.json`):
- **Count:** 150
- **Schema:** id, sourceId, targetId, type (CONTAINS | BELONGS_TO | RELATED_TO | CROSS_REFERENCES | SHARES_CONCEPT), description, provenance
- **Sample IDs:** rel-belief-theology-contains-allah, rel-belief-theology-contains-tawheed, rel-cross-tawheed-shirk, rel-theme-balance
- **Validation:** ⚠️ Issues — several CROSS_REFERENCES reference non-existent topic IDs

### Adapter Layer

**File:** `src/lib/taxonomy/canonical-adapter.ts`  
**Line count:** 323

**Type definitions:**
- CanonicalDomain, CanonicalDimension, CanonicalSubdimension, CanonicalTopic, CanonicalRelationship, TaxonomyStatistics, SearchResult

**Exported functions:**
- getCanonicalDomains(), getCanonicalDomain(id)
- getCanonicalDimensions(), getCanonicalDimension(id), getDimensionsForDomain(domainId)
- getCanonicalSubdimensions(), getCanonicalSubdimension(id), getSubdimensionsForDimension(dimensionId)
- getCanonicalTopics(), getCanonicalTopic(idOrSlug), getTopicsForDomain(domainId), getTopicsForDimension(dimensionId), getTopicsForSubdimension(subdimensionId)
- getCanonicalRelationships(), getRelationshipsFrom(sourceId), getRelationshipsTo(targetId), getRelationshipsFor(entityId)
- getTaxonomyStatistics(), searchTaxonomy(query)

**Design principles:**
- Pure module (no React, no fs, no network)
- Safe to import from client and server
- Type-safe with full TypeScript interfaces
- Preserves existing 14 domains and 15 dimensions as legacy

### Domain Explorer

**Routes:**
1. `/explore/domains` — 20 domain cards, statistics, search link
2. `/explore/domains/[id]` — Domain overview, dimensions, subdimensions, topics (first 30)
3. `/explore/dimensions/[id]` — Dimension overview, subdimensions, topics, related dimensions
4. `/explore/sub-dimensions/[id]` — Subdimension overview, parent hierarchy, topics

**Missing features:**
- No topic detail page for canonical topics
- Search doesn't index canonical entities
- Topic pages don't show ayah references
- No translation content on topic pages
- No filtering UI for topics
- Domain detail page truncates at 30 topics with no "show more" functionality

**Incomplete implementations:**
- Dimension detail page filters related dimensions by `id.startsWith('dim-')` but dimension IDs don't have that prefix → Related Dimensions section never renders
- Topic links point to `/explore/topics/[slug]` but canonical topics may not have corresponding legacy pages → potential 404s

### Documentation

**MFD-03-BASELINE-AUDIT:** Accurate for baseline state  
**MFD-03-RESEARCH-SUMMARY:** Accurate summary, though final counts differ (98 dimensions, not 108)  
**MFD-03-COMPLETION-REPORT:** Entity counts accurate, but "Valid references" claim questionable due to broken CROSS_REFERENCES  
**MFD-04-COMPLETION-REPORT:** Mostly accurate, but dimension detail page has bug

### Issues

**Critical:**
1. **Dimension detail page related dimensions filter broken** — Filters by `id.startsWith('dim-')` but IDs don't have that prefix
2. **Topic links may lead to 404s** — Canonical topics link to `/explore/topics/[slug]` but legacy system uses different slugs

**Major:**
1. **Broken references in relationships.json** — Several CROSS_REFERENCES reference non-existent topic IDs (wealth-ownership, evidence-standards, public-accountability, environmental-corruption, day-of-judgment, non-combatant-protection)
2. **No Quranic verse mappings** — All 176 topics have `quranicRelevance: 'pending-scholarly-review'`
3. **Domain detail page topic truncation** — Shows only first 30 topics with no "show more" button

**Minor:**
1. **Documentation count discrepancy** — Report claims "319 total entities" but excludes relationships (150). Total should be 469 if counting all entity types.
2. **No search integration for canonical entities** — `searchTaxonomy()` exists but not integrated into global search
3. **Missing topic detail pages for canonical topics** — Only legacy topics have detail pages

---

## Summary Statistics

| Category | Count | Status |
|---|---|---|
| **Routes** | 48 | ✅ Functional |
| **Canonical Domains** | 20 | ✅ Valid |
| **Canonical Dimensions** | 98 | ✅ Valid |
| **Canonical Subdimensions** | 25 | ✅ Valid |
| **Canonical Topics** | 176 | ⚠️ No ayah mappings |
| **Canonical Relationships** | 150 | ⚠️ Broken references |
| **Legacy Topics** | 18 | ✅ Functional |
| **Quran Surahs** | 114 | ✅ Validated |
| **Quran Ayat** | 6,236 | ✅ Validated |
| **Translation Sources** | 2 | ✅ Validated |
| **Tafsir Sources** | 4 | ✅ Validated |
| **Total Source Records** | 14 | ✅ Validated |
| **Arabic Roots** | 1,642 | ✅ Discovered |
| **Activated Roots** | 1,471 | ✅ Activated |
| **Morphology Records** | 1.2M+ | ✅ Loaded |
| **Graph Nodes (Canonical)** | 299 | ✅ Functional |
| **Graph Edges (Canonical)** | ~230 | ✅ Functional |

---

## Critical Bugs to Fix

1. **Dimension detail page** — ✅ FIXED (Phase 2) — Removed `id.startsWith('dim-')` filter in `src/app/explore/dimensions/[id]/page.tsx`
2. **Relationships.json** — ✅ FIXED (Phase 2) — Added 6 missing topics to resolve broken CROSS_REFERENCES
3. **Dimension count** — ✅ FIXED (Phase 2) — Expanded from 98 to 103 dimensions
4. **Redirect conflict** — `/explore/topics` redirects to legacy `/topics`

## Known Limitations (Phase 2 Status)

### Topic Links — Deferred to Phase 6 (Unified Topic Explorer)

**Issue:** Canonical topics in `data/taxonomy/topics.json` link to `/explore/topics/[slug]` but the legacy topic system uses different slugs (e.g., canonical `sabr-patience` vs legacy `patience`). This causes potential 404s when navigating from canonical topic cards.

**Current state:**
- Canonical topics use id-based routing: `/explore/topics/[id]` (e.g., `/explore/topics/sabr-patience`)
- Legacy topics use slug-based routing: `/topics/[slug]` (e.g., `/topics/patience`)
- The redirect `/explore/topics → /topics` means canonical topic URLs currently redirect to legacy topic URLs
- Since slugs don't match 1:1, many canonical topic links will 404 after redirect

**Resolution plan (Phase 6):**
1. Create canonical topic detail pages at `/explore/topics/[id]`
2. Remove the `/explore/topics → /topics` redirect
3. Map legacy topics to canonical topics as "featured entry points"
4. Add ayah relations to canonical topics
5. Implement unified navigation between legacy and canonical systems

**Why deferred:** This requires significant architectural work (new pages, URL routing changes, data migration) that is scoped for Phase 6. Phase 2 focused on data integrity fixes that don't require UI changes.

**Workaround for now:** Users can navigate to canonical topics via the Domain Explorer (`/explore/domains/[id]`) which links to dimension pages, which in turn link to canonical topic cards. The topic cards display correctly but clicking them may 404 until Phase 6 is complete.

---

## MFD-07 Execution Plan

Based on audit findings, execute in this order:

### Phase 2: Taxonomy Completion + Bug Fixes
- Fix broken references in relationships.json
- Fix dimension detail page filter
- Expand dimensions to 100+ (currently 98, need 2+ more)
- Add missing specialized topics where gaps exist
- Update documentation

### Phase 3: Quranic Ayah Mapping
- Map all 176 topics to relevant ayat
- Use 6,236 ayat from quran-json dataset
- Classify mappings (DIRECT_REFERENCE, THEMATIC_REFERENCE, etc.)
- Store mappings in canonical topic records

### Phase 4: Translation Integration
- Connect mapped ayat to Saheeh International (bundled)
- Connect to Tanzil proxy translations (on-demand)
- Preserve attribution and licensing

### Phase 5: Tafsir Integration
- Link to al-Jalalayn and al-Muyassar (in-app Arabic)
- Link-out to Ibn Kathir and Ma'ariful Quran (English)
- Preserve source attribution

### Phase 6: Unified Topic Explorer
- Fix redirect issue (`/explore/topics` → `/topics`)
- Create canonical topic detail pages
- Merge legacy and canonical systems (keep legacy as "featured entry points")
- Add ayah relations to canonical topics

### Phase 7: Knowledge Graph Expansion
- Add Ayah nodes
- Add Concept nodes (derive from topics or create lightweight layer)
- Add Arabic Root nodes (from 1,642 discovered roots)
- Add Arabic Word nodes
- Add Translation and Tafsir relationships

### Phase 8: Graph Interaction Improvements
- Add zoom/pan controls
- Add node expansion/collapse
- Add edge highlighting
- Improve keyboard navigation

### Phase 9: Cross-Navigation
- Connect Domain → Topic → Ayah → Translation → Tafsir
- Connect Topic → Graph
- Connect Ayah → Topic
- Connect Root → Word → Ayah

### Phase 10: Final QA
- Validate all data
- Test all navigation
- Update documentation
- Produce completion report

---

## Next Steps

Proceed to Phase 2 (taxonomy completion + bug fixes) and Phase 3 (Ayah mapping) in parallel using subagents.

**Status:** ✅ Phase 1 Complete  
**Next:** Phase 2 + Phase 3