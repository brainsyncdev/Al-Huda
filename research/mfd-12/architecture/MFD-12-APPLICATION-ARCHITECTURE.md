# MFD-12 — Unified FAHM Knowledge Architecture: Application Experiences

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Product & Application Integration) |
| Date | 2026-11-21 |
| Status | draft-architecture |
| Inputs | MFD-11.5 Terminology Spec, MFD-11.3-A War & Peace, MFD-11.3-B Arts & Beauty, Existing App Router Structure |
| Scope | RESEARCH ONLY — no modifications to src/ or data/ |

---

## 1. Architectural Vision

The Quran Al Huda application is restructured around four distinct **Application Experiences**. These are not separate apps but coherent interaction modes within a single unified codebase, each optimized for a specific user intent and depth of engagement. This architecture translates the scholarly rigor established in MFD-11 into product surfaces that respect both the text's complexity and the user's cognitive load.

### Core Principles
1.  **Textual Primacy:** All experiences anchor to the verified Uthmani Arabic text (`quran-json@3.1.2`). No experience may present derived content without traceable provenance.
2.  **Epistemic Transparency:** Every piece of information carries an explicit confidence/review status. User-generated content is visually and structurally segregated from scholarly evidence.
3.  **Local-First Sovereignty:** Personal study data never leaves the device by default. The app functions fully offline after initial hydration.
4.  **Progressive Disclosure:** Complexity is revealed on demand. FAHM is the default entry; RESEARCH is the deep-dive destination.

---

## 2. Experience Definitions

### A. FAHM (Understanding)
The primary reading and immediate comprehension experience. Optimized for flow, clarity, and direct textual encounter.

*   **Target Audience:** Daily readers, students of meaning, spiritual seekers, non-specialists.
*   **Primary Capabilities:**
    *   Verse-by-verse reading with synchronized Arabic/translation/transliteration.
    *   Instant word-level morphological breakdown (root, form, lemma).
    *   Context navigation (previous/next ayah, surah outline, juz boundary).
    *   Inline evidence inspection: tap any term to see its gloss layers (lexical, contextual, tafsir, editorial) per MFD-11.5 §5.
    *   Audio recitation with verse highlighting.
*   **Data Requirements:**
    *   `quran-json` corpus (Arabic, translation, transliteration).
    *   Verified terminology index (MFD-11.5 compliant entries only).
    *   Surah metadata (revelation type, chronology, theme summaries).
*   **Evidence/Uncertainty Display:**
    *   Glosses show confidence badges (High/Medium/Low/Disputed).
    *   Polysemous terms display sense enumeration with verse references.
    *   Tafsir excerpts explicitly labeled "Exegetical Interpretation" vs "Qur'anic Text".
*   **Local-First Persistence:** Reading progress, last position, font/display preferences.
*   **Accessibility:** WCAG 2.1 AA compliant. Adjustable font sizes, high contrast mode, screen reader optimized Arabic vocalization hints.

### B. EXPLORE (Discovery)
Thematic browsing and knowledge graph navigation. Optimized for serendipity, connection-making, and domain orientation.

*   **Target Audience:** Curious learners, thematic researchers, educators preparing lessons.
*   **Primary Capabilities:**
    *   Domain/Dimension/Topic hierarchical browsing (preserving existing `/explore/domains`, `/explore/dimensions` routes).
    *   Knowledge graph visualization showing concept relationships.
    *   Thematic pathway recommendations based on audience profiles.
    *   Related verse discovery via shared roots, topics, or semantic proximity.
    *   "Concept Cards" summarizing a term's distribution across domains.
*   **Data Requirements:**
    *   Canonical taxonomy (domains, dimensions, topics) with review status.
    *   Knowledge graph edges (derived from co-occurrence, root sharing, editorial mapping).
    *   Learning paths metadata.
*   **Evidence/Uncertainty Display:**
    *   Nodes/edges carry provenance tags (Quranic-Explicit, Hadith-Derived, Editorial, Cultural).
    *   Dissolved domains (e.g., Arts & Beauty per MFD-11.3-B) show redistribution notices linking to new canonical homes.
    *   Empty/unmapped dimensions clearly marked as "Proposed" not "Verified".
*   **Local-First Persistence:** Bookmarked exploration paths, collapsed/expanded graph states, visited node history.
*   **Accessibility:** Graph keyboard navigation, text-only fallback for visualizations, ARIA landmarks for hierarchical sections.

### C. RESEARCH (Investigation)
Advanced scholarly tooling for deep textual analysis. Optimized for precision, comparison, annotation, and export.

*   **Target Audience:** Students of Islamic sciences, academics, translators, serious self-study researchers.
*   **Primary Capabilities:**
    *   Multi-mode search (exact, linguistic, conceptual, evidence, semantic) — see `MFD-12-SEARCH-SPEC.md`.
    *   Root/Lemma explorer with full morphological paradigm tables.
    *   Side-by-side tafsir comparison (Jalalayn, Muyassar, future editions).
    *   Evidence mapping workspace: link verses to claims, tag with custom labels.
    *   Private annotation system (strictly segregated from public/scholarly data).
    *   Saved investigations / research notebooks.
    *   Citation export (Chicago, APA, BibTeX) with stable verse URIs.
*   **Data Requirements:**
    *   Full `data/root-occurrences/` dataset (1,576 roots).
    *   Classical tafsir corpora.
    *   Terminology index with full morphological metadata.
    *   Cross-reference indices (verse-to-topic, root-to-verse, lemma-to-form).
*   **Evidence/Uncertainty Display:**
    *   Raw data views available alongside curated summaries.
    *   Disputed analyses shown in parallel with primary view.
    *   Annotation layer uses distinct color/border treatment to prevent confusion with source text.
*   **Local-First Persistence:** Annotations, saved searches, investigation notebooks, export history, custom tag taxonomies.
*   **Accessibility:** Keyboard shortcuts for all research actions, exportable plain-text alternatives, resizable split panes.

### D. NOOR (Illumination) — DEFERRED
Future integration boundary definition only. Not implemented in MFD-12.

*   **Deferred Scope:** AI-assisted reflection prompts, personalized spiritual guidance, adaptive learning sequencing, community wisdom integration.
*   **Integration Boundaries (for future design):**
    *   Must consume FAHM/EXPLORE/RESEARCH outputs as read-only inputs.
    *   Must never modify canonical data or user annotations.
    *   Must carry explicit "AI-Generated / Reflective" provenance label.
    *   Must operate entirely locally or with explicit opt-in cloud processing.
*   **Rationale for Deferral:** Requires mature canonical foundation (MFD-11/12), validated terminology index, and established user trust before introducing generative/advisory layers.

---

## 3. Module Boundaries & Route Mapping

| Experience | Primary Routes (Existing) | New/Enhanced Routes | Shared Modules |
|------------|---------------------------|---------------------|----------------|
| FAHM | `/quran`, `/ayah/[surah]/[ayah]` | `/fahm/word/[lemma]` (inline drawer) | `QuranReader`, `AyahCard`, `WordTooltip` |
| EXPLORE | `/explore/*`, `/topics/*`, `/learn/paths/*` | `/explore/graph` (enhanced), `/explore/concept/[id]` | `TaxonomyAdapter`, `GraphVisualizer`, `PathCard` |
| RESEARCH | `/search`, `/my-study/*` | `/research/root/[root]`, `/research/investigate/[id]`, `/research/export` | `SearchEngine`, `AnnotationStore`, `CitationGenerator` |
| NOOR | N/A | N/A (deferred) | N/A |

### Shared Infrastructure Modules
*   **CanonicalDataAdapter:** Single source of truth for taxonomy, terminology, and corpus access. Enforces MFD-11.5 validation rules.
*   **ProvenanceRenderer:** Universal component for displaying confidence/status badges consistently across all experiences.
*   **LocalPersistenceLayer:** IndexedDB-backed store with schema versioning. See `MFD-12-LOCAL-FIRST-SPEC.md`.
*   **SearchOrchestrator:** Unified search interface dispatching to mode-specific engines. See `MFD-12-SEARCH-SPEC.md`.

---

## 4. Key Architectural Decisions

1.  **Terminology Index as First-Class Entity:** The MFD-11.5 terminology index is not a secondary lookup but a core navigational primitive. FAHM and RESEARCH treat lemmas as addressable resources (`/fahm/word/[lemma]`, `/research/root/[root]`).
2.  **Dissolution of Arts & Beauty Domain:** Per MFD-11.3-B findings, this domain is dissolved. Its valid constituents are redistributed to Creation-Signs, Ethics, Law, and Prophets. EXPLORE surfaces this redistribution transparently via redirect notices and cross-links.
3.  **War & Peace as Semantic Network, Not Flat Topic:** Per MFD-11.3-A, jihād/qitāl/ṣulḥ/ʿahd/salām are presented as interconnected concepts with explicit relationship edges, not isolated topic pages. EXPLORE graph and RESEARCH evidence mapper reflect this structure.
4.  **Annotations Are Private Artifacts:** User notes, highlights, and tags live exclusively in local storage. They are never merged into canonical data, never displayed to other users, and never used to train models without explicit separate consent.
5.  **Search Modes Are Explicit, Not Implicit:** Users choose their search mode. The system does not guess intent. Default search remains lexical/reference-based; semantic/evidence modes require deliberate activation.
6.  **Offline-First Hydration Strategy:** Core corpus and terminology index are bundled or cached on first load. Subsequent updates are incremental. Research-grade datasets (full root occurrences, tafsir corpora) are fetched on-demand and cached persistently.

---

## 5. Non-Goals for MFD-12

*   Social features, sharing, or community annotations.
*   AI-generated content or reflective prompts (NOOR deferral).
*   Multi-language UI beyond English/Arabic/Urdu.
*   Real-time collaboration or sync between devices.
*   Modification of canonical data through the application interface.

---

*This document defines the architectural contract for MFD-12 implementation. All subsequent specs (UX, Search, Local-First) derive from and must remain consistent with these definitions.*
