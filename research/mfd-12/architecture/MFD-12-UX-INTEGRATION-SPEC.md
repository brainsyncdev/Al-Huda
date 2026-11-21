# MFD-12 — UX Integration Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Product & Application Integration) |
| Date | 2026-11-21 |
| Status | draft-specification |
| Depends On | MFD-12-APPLICATION-ARCHITECTURE.md, MFD-11.5 Terminology Spec, MFD-11.3-A/B Reports |
| Scope | RESEARCH ONLY — no modifications to src/ or data/ |

---

## 1. Purpose

This specification translates the four Application Experiences defined in `MFD-12-APPLICATION-ARCHITECTURE.md` into concrete UX requirements, interaction patterns, and component contracts. It bridges scholarly findings from MFD-11 with the existing Next.js App Router implementation, ensuring that architectural decisions manifest as coherent user-facing behavior.

---

## 2. Experience-to-Route Mapping

### 2.1 FAHM (Understanding)

| Existing Route | UX Enhancement | Notes |
|----------------|----------------|-------|
| `/quran` | Add persistent reading position indicator; inline word-tap morphological drawer | Current reader is functional but lacks word-level investigation |
| `/ayah/[surah]/[ayah]` | Add four-layer gloss panel (lexical, contextual, tafsir, editorial) per MFD-11.5 §5 | Requires terminology index integration |
| `/quran/[slug]` | Preserve as surah landing page; add thematic summary from canonical metadata | No structural change needed |

**New Interaction Patterns:**
- **Word Tap/Hover:** Opens non-modal drawer showing root, lemma, form, pattern, POS, morphConfidence badge, and gloss layers. Drawer does not navigate away from reading context.
- **Context Breadcrumbs:** Surah > Juz > Hizb > Ayah navigation always visible above verse content.
- **Evidence Confidence Indicator:** Small colored dot (green=high, amber=medium, red=low/disputed) next to any gloss or morphological claim. Hover/tap reveals rationale.

### 2.2 EXPLORE (Discovery)

| Existing Route | UX Enhancement | Notes |
|----------------|----------------|-------|
| `/explore` | Already comprehensive; add dissolution notice for Arts & Beauty domain per MFD-11.3-B | Redirect notices must link to new canonical homes |
| `/explore/domains/[id]` | Show redistributed concepts with provenance tags | War & Peace domain shows semantic network, not flat list |
| `/explore/dimensions/[id]` | Add "Related Concepts" sidebar derived from knowledge graph edges | Requires graph data layer |
| `/explore/graph` | Enhance with force-directed layout; nodes sized by occurrence count; edges typed by relationship | Current graph is basic; needs richer interaction |
| `/topics/[slug]` | Add provenance banner distinguishing Quranic-Explicit vs Hadith-Derived vs Editorial scope | Critical for epistemic transparency |
| `/learn/paths/*` | Preserve as-is; paths are already audience-segmented | No change needed |

**New Interaction Patterns:**
- **Domain Redistribution Notice:** When a dissolved domain (Arts & Beauty) is accessed, show a clear explanation card: "This domain has been restructured based on textual analysis. Its constituents now reside in [Creation-Signs], [Ethics], [Law], [Prophets]." With direct links.
- **Concept Relationship Visualization:** On any topic/dimension page, show a mini-graph of immediate neighbors (shared roots, co-occurring terms, editorial cross-references). Clickable to navigate.
- **Audience Path Recommendations:** On `/explore`, surface personalized path suggestions based on previously visited dimensions (local-only inference, no tracking).

### 2.3 RESEARCH (Investigation)

| Existing Route | UX Enhancement | Notes |
|----------------|----------------|-------|
| `/search` | Add explicit mode selector tabs (Exact, Linguistic, Conceptual, Evidence, Semantic) | Current search is implicit lexical; modes must be deliberate |
| `/my-study/*` | Rebrand as RESEARCH workspace; add annotation tools, saved investigations, export | Current my-study is bookmarks/notes only; expand scope |
| `/explore/root/[root]` | Enhance with full morphological paradigm table, occurrence heatmap across surahs | Currently basic root page |
| `/explore/root` | Add root browser with filter by form, POS, occurrence count | Entry point for linguistic research |

**New Routes (Proposed):**
- `/research/investigate/[id]` — Saved investigation notebook with linked verses, annotations, and export options.
- `/research/export` — Citation generator with format selection and stable URI generation.

**New Interaction Patterns:**
- **Annotation Layer:** Private notes appear as margin highlights with distinct visual treatment (dashed border, user-icon badge). Never visually identical to scholarly evidence.
- **Evidence Mapper Workspace:** Drag-and-drop interface to link verses to custom claims. Claims are private artifacts stored locally.
- **Side-by-Side Tafsir:** Split-pane view comparing Jalalayn and Muyassar (or future editions) for the same verse range. Synchronized scrolling.
- **Export Preview:** Before generating citation, show formatted preview with editable fields.

### 2.4 NOOR (Illumination) — DEFERRED

No UX requirements for MFD-12. Future design must respect integration boundaries defined in Architecture spec §2.D.

---

## 3. Evidence & Uncertainty Display Contracts

### 3.1 Provenance Labels

All displayed information carries one of these provenance tags:

| Tag | Meaning | Visual Treatment |
|-----|---------|------------------|
| QURANIC-EXPLICIT | Directly stated in verified Arabic text | Green badge, solid border |
| HADITH-DERIVED | From Prophetic tradition, not Quran text | Amber badge, dashed border |
| TAFSIR-INTERPRETATION | Classical exegetical opinion | Blue badge, italic label |
| EDITORIAL | FAHM team classification/taxonomy decision | Gray badge, "Editorial" prefix |
| USER-ANNOTATION | Private user-generated content | Purple badge, user icon |
| AI-GENERATED | Future NOOR layer output | Red badge, "AI" prefix (deferred) |

### 3.2 Morphological Confidence Badges

Per MFD-11.5 §6, every morphological claim displays confidence:

| Level | Meaning | Display |
|-------|---------|----------|
| HIGH | Verified against root-occurrences + deterministic morphology review | ✓ Green check |
| MEDIUM | Cross-referenced but with minor unresolved variants | ~ Amber tilde |
| LOW | Single-source or computationally inferred without verification | ! Orange exclamation |
| DISPUTED | Classical lexicons disagree; alternative analyses preserved | ⚠ Red warning with expandable alternatives |

### 3.3 Polysemy Handling in UI

Per MFD-11.5 §7, polysemous terms show enumerated senses, not a single gloss:

```
جِهَاد (j-h-d, Form III)
├── Sense 1: Spiritual striving (29:69, 25:52)
├── Sense 2: Armed struggle (9:41, 9:44)
└── Editorial Gloss: Comprehensive striving in Allah's cause
    Confidence: HIGH | Source: MFD-11.5 validated
```

UI must never collapse multiple senses into one without explicit user action.

---

## 4. Accessibility Requirements

### 4.1 WCAG 2.1 AA Compliance

- All interactive elements keyboard-navigable with visible focus indicators.
- Color contrast ratios ≥ 4.5:1 for text, ≥ 3:1 for UI components.
- Screen reader announcements for dynamic content (search results, graph updates).
- Arabic text rendered with appropriate font stack and RTL directionality.

### 4.2 Experience-Specific Accessibility

| Experience | Requirement |
|------------|-------------|
| FAHM | Word-tap drawer must be keyboard-triggerable; gloss layers navigable via arrow keys |
| EXPLORE | Graph visualization must have text-only fallback listing all nodes/edges linearly |
| RESEARCH | All research actions (annotate, export, compare) accessible via keyboard shortcuts |
| NOOR | N/A (deferred) |

### 4.3 Cognitive Load Management

- Progressive disclosure: Advanced features hidden behind explicit "Research Mode" toggle.
- Consistent spatial layout: Navigation, content, and evidence panels occupy predictable screen regions.
- No auto-playing audio or animation without user initiation.
- Clear exit paths from deep investigation back to reading flow.

---

## 5. Navigation Contracts

### 5.1 Global Navigation

The primary nav exposes three top-level entries corresponding to active experiences:

1.  **Read** → `/quran` (FAHM entry)
2.  **Explore** → `/explore` (EXPLORE entry)
3.  **Research** → `/search` (RESEARCH entry)

`/my-study` remains accessible but is repositioned as a sub-section of Research, not a parallel experience.

### 5.2 Cross-Experience Transitions

Transitions between experiences preserve context where meaningful:

| From → To | Context Preserved |
|-----------|-------------------|
| FAHM → EXPLORE | Current verse's topics/roots pre-selected in explore view |
| FAHM → RESEARCH | Current verse opened in research workspace |
| EXPLORE → FAHM | Selected concept's first occurrence opened in reader |
| EXPLORE → RESEARCH | Selected concept pre-loaded in search/evidence mapper |
| RESEARCH → FAHM | Investigated verse opened in reading context |
| RESEARCH → EXPLORE | Investigated root/topic opened in graph/browser |

### 5.3 Deep Linking

All canonical entities have stable, human-readable URLs:

- Verses: `/ayah/[surah]/[ayah]`
- Roots: `/explore/root/[root]` (e.g., `/explore/root/j-h-d`)
- Topics: `/topics/[slug]` or `/explore/topics/[id]`
- Investigations: `/research/investigate/[uuid]` (local-only, not SEO-indexed)

---

## 6. Component Contracts

### 6.1 Shared Components

| Component | Used In | Props Contract |
|-----------|---------|----------------|
| `AyahCard` | FAHM, RESEARCH, SEARCH | Must accept `provenanceBadge`, `morphConfidence`, `annotationLayer` props |
| `GlossPanel` | FAHM, RESEARCH | Four-layer structure per MFD-11.5 §5; collapsible layers |
| `ProvenanceBadge` | All experiences | Enum: `quranic-explicit`, `hadith-derived`, `tafsir-interpretation`, `editorial`, `user-annotation` |
| `MorphDrawer` | FAHM, RESEARCH | Root, lemma, form, pattern, POS, confidence, alternatives |
| `SearchModeSelector` | RESEARCH | Tabs for Exact/Linguistic/Conceptual/Evidence/Semantic |

### 6.2 Experience-Specific Components

| Component | Experience | Notes |
|-----------|------------|-------|
| `ReadingProgressBar` | FAHM | Persistent, non-intrusive |
| `GraphVisualizer` | EXPLORE | Force-directed; keyboard-navigable; text fallback |
| `AnnotationMargin` | RESEARCH | Dashed border, user-icon, never matches scholarly styling |
| `TafsirSplitPane` | RESEARCH | Synchronized scroll; edition selector per pane |
| `CitationExporter` | RESEARCH | Format selector; preview; copy/download |

---

## 7. State Management

### 7.1 Client State

- Reading position, display preferences, graph view state: persisted to IndexedDB via LocalPersistenceLayer.
- Search filters, mode selection: URL query params (shareable, bookmarkable).
- Annotation drafts: auto-saved to IndexedDB every 5 seconds during editing.

### 7.2 Server State

- Canonical data (corpus, taxonomy, terminology): fetched at build time or on-demand with SWR caching.
- Tafsir/translation editions: fetched on first use, cached persistently.
- No server-side user state. All personalization is client-local.

---

*This specification defines the UX contract for MFD-12. Implementation must satisfy these requirements while preserving existing route functionality and local-first sovereignty.*
