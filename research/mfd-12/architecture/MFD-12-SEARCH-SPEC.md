# MFD-12 — Search Interface Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Product & Application Integration) |
| Date | 2026-11-21 |
| Status | draft-specification |
| Depends On | MFD-12-APPLICATION-ARCHITECTURE.md, MFD-11.5 Terminology Spec |
| Scope | RESEARCH ONLY — no modifications to src/ or data/ |

---

## 1. Overview

Search in FAHM is not a single monolithic function but a **suite of five explicit modes**, each optimized for a distinct research intent. Users select their mode deliberately; the system never infers intent implicitly. This prevents the common failure mode where lexical searches return irrelevant conceptual matches or vice versa.

### Design Principles
1.  **Explicit Mode Selection:** Users choose their search mode via visible tabs/selectors. Default is Exact.
2.  **Transparent Matching Logic:** Each mode explains its matching rules in plain language before results appear.
3.  **Provenance-Aware Results:** Every result carries source type (Quran text, translation, tafsir, terminology index, editorial topic) and confidence level.
4.  **Structural Filters Apply Universally:** Surah, juz, revelation type, and topic filters work across all modes.
5.  **Local-First Execution:** All search modes execute client-side or against locally cached data after initial hydration.

---

## 2. Search Modes

### 2.1 EXACT Mode (Default)

**Intent:** Find specific words, phrases, or references with precision.

**Matching Rules:**
- Reference parsing: `2:255`, `al-baqarah 153`, `Surah Yasin` → direct verse lookup.
- Arabic exact match: Diacritic-insensitive substring match against Uthmani text. Whole-word matches ranked above substrings.
- Translation exact match: Case-insensitive substring match against built-in English translation. Whole-word priority.
- Transliteration match: ISO 233-2 normalized match against transliterated text.
- Ranking: Reference > Arabic whole-word > Translation whole-word > Arabic substring > Translation substring > Transliteration. Mushaf order breaks ties.

**Data Sources:** `quran-json` corpus (Arabic, translation, transliteration), surah index.

**Result Metadata:** Match reason label (`reference`, `arabic`, `translation`, `transliteration`), snippet with highlighted match, surah/ayah reference.

**Existing Implementation:** Current `/search` page implements this mode. MFD-12 formalizes it as one explicit mode among five.

### 2.2 LINGUISTIC Mode

**Intent:** Explore morphological families, root derivations, and lexical patterns.

**Matching Rules:**
- Root search: Input root (e.g., `j-h-d`, `ج-ه-د`) returns all lemmas under that root with occurrence counts per lemma.
- Lemma search: Input lemma (e.g., `جَاهَدَ`) returns all occurrences with word position, form, and contextual sense enumeration.
- Pattern search: Input morphological pattern (e.g., `fāʿala`, `mafʿūl`) returns all matching forms across roots.
- Form filter: Restrict by verb form (I-X) or noun pattern.
- POS filter: Restrict by part of speech (verb, noun, participle, etc.).

**Data Sources:** `data/root-occurrences/*.json` (1,576 files), MFD-11.5 terminology index, morphological metadata.

**Result Metadata:** Root, lemma, form, pattern, POS, morphConfidence badge, occurrence count, verse list with snippets.

**UI Behavior:** Results grouped by lemma under root header. Expandable paradigm table showing all forms. Occurrence heatmap across surahs/juz.

### 2.3 CONCEPTUAL Mode

**Intent:** Find verses related to a thematic concept, even without lexical overlap.

**Matching Rules:**
- Topic title/alias match: Query matched against canonical topic titles, arabicTitles, urduTitles, descriptions, and searchAliases.
- Dimension/domain expansion: If query matches a dimension or domain title, include all verses mapped to topics under that dimension/domain.
- Editorial mapping traversal: Follow topic-to-verse mappings curated by FAHM editorial team.
- **NOT semantic/embedding-based.** This mode uses structured editorial metadata, not vector similarity.

**Data Sources:** Canonical taxonomy (domains, dimensions, topics), editorial verse mappings, topic searchAliases.

**Result Metadata:** Matched topic(s), provenance tag (EDITORIAL), mapping confidence, related topics.

**Uncertainty Display:** Results clearly labeled "Curated theme match — editorial mapping, not lexical or semantic similarity." Review status of matched topic shown.

### 2.4 EVIDENCE Mode

**Intent:** Locate scholarly evidence, tafsir discussions, or provenance-classified content.

**Matching Rules:**
- Tafsir full-text: Literal substring match against classical tafsir corpora (Jalalayn, Muyassar; extensible to future editions).
- Provenance filter: Restrict to QURANIC-EXPLICIT, HADITH-DERIVED, or TAFSIR-INTERPRETATION content.
- Gloss layer search: Search within specific gloss layers (lexical, contextual, tafsir note, editorial) of terminology index entries.
- Disputed/uncertain filter: Surface only entries with LOW or DISPUTED confidence for critical analysis.

**Data Sources:** Classical tafsir corpora, terminology index gloss layers, provenance metadata.

**Result Metadata:** Edition name, snippet with highlight, provenance tag, confidence badge, link to source verse.

**UI Behavior:** Results grouped by source type (Tafsir, Terminology Gloss, Provenance Filter). Side-by-side comparison option for multi-edition hits.

### 2.5 SEMANTIC Mode (Future / Experimental)

**Intent:** Discover thematically similar verses using embedding-based similarity.

**Status:** **DEFERRED to post-MFD-12.** Requires validated embedding model trained on Quranic Arabic + approved translations, plus scholarly review of similarity thresholds.

**Planned Matching Rules:**
- Query embedded via approved model; nearest-neighbor search against pre-computed verse embeddings.
- Similarity threshold configurable by user (default: 0.75 cosine).
- Results ranked by similarity score, then mushaf order.

**Data Sources:** Pre-computed verse embeddings (not yet generated), embedding model weights.

**Uncertainty Display:** Prominent disclaimer: "Semantic similarity is computational, not scholarly. Results may reflect statistical patterns, not theological coherence. Always verify against primary sources."

**Integration Boundary:** When implemented, this mode must consume FAHM/RESEARCH outputs as read-only inputs and carry AI-GENERATED provenance label if enhanced by NOOR layer.

---

## 3. Search Interface Contracts

### 3.1 Mode Selector UI

- Horizontal tab bar above search input: `[Exact] [Linguistic] [Conceptual] [Evidence] [Semantic*]`
- Active tab visually distinct; inactive tabs muted.
- Asterisk on Semantic indicates experimental/deferred status.
- Mode persists in URL query param: `?mode=linguistic&q=j-h-d`
- Changing mode clears results but preserves query text.

### 3.2 Search Input Behavior

- Auto-focus on page load.
- Supports Arabic, English, transliteration, and reference input regardless of mode.
- Mode-specific placeholder text:
    - Exact: "Search by reference, Arabic, or translation…"
    - Linguistic: "Enter root (j-h-d), lemma, or pattern…"
    - Conceptual: "Enter concept, topic, or theme…"
    - Evidence: "Search tafsirs, glosses, or filter by provenance…"
    - Semantic: "Describe what you're looking for…" (deferred)
- Submit on Enter; filters adjustable without re-submitting.

### 3.3 Results Display

- Consistent card layout across modes (AyahCard variant).
- Mode-specific metadata appended below card:
    - Exact: Match reason badge.
    - Linguistic: Morphological info + confidence.
    - Conceptual: Matched topic(s) + editorial provenance.
    - Evidence: Source edition + provenance tag.
    - Semantic: Similarity score + disclaimer (future).
- Pagination: 20 results per page; infinite scroll optional.
- Export results button (RESEARCH experience only): CSV, JSON, or citation format.

### 3.4 Structural Filters

Universal across all modes:
- Surah selector (dropdown or autocomplete).
- Juz selector (1-30).
- Revelation type (Meccan/Medinan).
- Topic filter (canonical topics only).
- Language filter (Arabic/English/Both) — applies to Exact mode primarily.

Filters encoded in URL: `?mode=exact&q=mercy&surah=7&revelation=meccan`

---

## 4. Performance Requirements

| Mode | Max Latency (Client-Cached) | Max Latency (First Fetch) |
|------|------------------------------|----------------------------|
| Exact | < 100ms | < 500ms |
| Linguistic | < 200ms | < 1s |
| Conceptual | < 150ms | < 800ms |
| Evidence | < 300ms | < 2s (tafsir fetch) |
| Semantic | N/A (deferred) | N/A |

**Optimization Strategy:**
- Corpus and terminology index bundled in initial JS payload or precached via service worker.
- Tafsir corpora fetched on-demand and persisted to IndexedDB.
- Search indices pre-built at build time where possible (static generation).
- Linguistic mode leverages `data/root-occurrences/` file structure for lazy loading by root.

---

## 5. Accessibility

- Mode selector keyboard-navigable (arrow keys between tabs, Enter to select).
- Results announced to screen readers with mode context: "Linguistic search results for j-h-d, 12 matches."
- Filter changes announce result count update.
- High contrast mode supported for all result badges and confidence indicators.

---

## 6. Non-Goals

- Natural language query understanding (no chat-style search).
- Cross-language semantic search (e.g., English query → Arabic results via translation embeddings).
- Real-time collaborative search or shared search sessions.
- Modification of canonical data through search interface.

---

*This specification defines the search contract for MFD-12. Implementation must support all four active modes with explicit user control and transparent matching logic.*
