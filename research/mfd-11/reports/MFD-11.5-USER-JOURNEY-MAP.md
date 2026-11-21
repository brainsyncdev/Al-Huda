---
proposedBy: ai-assisted
reviewStatus: pending-scholarly-review
title: "MFD-11.5 User Journey Map: Current & Proposed Research Journeys"
date: 2026-11-21
programme: FAHM Development Programme MFD-11.5
workstream: WS1 (Product Experience & User Research)
---

# MFD-11.5 User Journey Map

## Document Purpose

This document maps current user journeys through the Quran Al Huda application and proposes enhanced research-grade journeys for the four interfaces specified in §7.WS1. Each journey is documented as a sequence of steps, decision points, friction encounters, and emotional states.

---

## Part 1: Current State Journeys

### CJ-1: Quran Reading (Linear Surah Navigation)

**Persona:** Devotional reader or student following a reading plan  
**Entry Point:** `/quran` or direct link to `/quran/[slug]`

| Step | Action | System Response | Friction |
|------|--------|----------------|----------|
| 1 | Browse surah index | Grid of 114 surah cards with Arabic name, transliteration, verse count | None — clean listing |
| 2 | Select surah | Navigate to `/quran/[slug]`; full surah rendered with all ayat | Long surahs load entire text; no lazy loading |
| 3 | Read ayah | Scroll through AyahCard components | No inline word-level analysis without navigating away |
| 4 | Want tafsir | Click TafsirLinks at bottom of page | Tafsir is separate section, not integrated with reading flow |
| 5 | Navigate to next surah | Use prev/next links at top and bottom | Must scroll to bottom for forward navigation on long surahs |
| 6 | Jump to specific ayah | Use browser find or manual scroll | No in-page ayah navigation control visible by default |

**Emotional Arc:** Calm → Focused → Mild frustration (long scrolls) → Satisfied (if finding target)

**Key Gap:** No persistent reading position memory across sessions.

---

### CJ-2: Verse Discovery via Search

**Persona:** Researcher or student looking for a specific concept  
**Entry Point:** `/search`

| Step | Action | System Response | Friction |
|------|--------|----------------|----------|
| 1 | Enter query | SearchBox accepts input; suggestions appear via API | Suggestions limited to known terms |
| 2 | Submit search | Results render server-side with match reason labels | Canonical topic matches appear above results but styled similarly |
| 3 | Filter results | Apply surah/juz/topic/language filters via URL params | Filters require page reload; no instant filtering |
| 4 | Find relevant result | Scan result list with snippets | Snippets only for translation matches; Arabic/reference matches show full text |
| 5 | Verify context | Click ayah link to navigate to `/ayah/[surah]/[ayah]` | Loses search context; cannot return to exact scroll position |
| 6 | Explore related topics | Click topic badges on ayah page | Navigates away from ayah; no side-panel preview |
| 7 | Cross-reference check | View CrossReferencePanel on ayah page | Panel shows linked ayat but requires clicking each to see content |

**Emotional Arc:** Hopeful → Engaged → Overwhelmed (many results) → Frustrated (context loss) → Partially satisfied

**Key Gap:** No way to collect multiple search results into a working set without permanent bookmarking.

---

### CJ-3: Concept Exploration via Topics

**Persona:** Thematic researcher exploring a Quranic concept  
**Entry Point:** `/topics` or `/explore/topics/[id]`

| Step | Action | System Response | Friction |
|------|--------|----------------|----------|
| 1 | Browse topics index | Sorted by relation count; graph visualization available | Legacy and canonical topics mixed in navigation |
| 2 | Select topic | Navigate to unified detail page | Must determine if viewing legacy or canonical version |
| 3 | Read description | Description + scope displayed | Canonical topics have richer metadata but different layout |
| 4 | Review ayah mappings | Grouped by mapping type with rationales | Rationales are text-only; no visual evidence highlighting |
| 5 | Check review status | Gold banner with disclaimer | Status applies to entire topic, not individual mappings |
| 6 | Explore related topics | Click related topic badges | Flat badge list; no relationship type visualization inline |
| 7 | Navigate to dimension/domain | Click parent hierarchy links | Leaves topic context entirely |
| 8 | Compare with another topic | Open new tab manually | No built-in comparison capability |

**Emotional Arc:** Curious → Oriented → Confused (dual taxonomy) → Cautious (review disclaimers) → Incomplete

**Key Gap:** Cannot trace which specific ayah mappings within a topic have been individually reviewed vs. batch-imported.

---

### CJ-4: Arabic Root/Terminology Lookup

**Persona:** Linguistic researcher or Arabic student  
**Entry Point:** `/explore/root`

| Step | Action | System Response | Friction |
|------|--------|----------------|----------|
| 1 | Browse root discovery | List of 1,642 roots with activation status | Large list; search/filter essential |
| 2 | Search by transliteration | Client-side filtering in RootListingClient | Only works if morphology data is loaded |
| 3 | Select root | Navigate to `/explore/root/[root]` | Three possible views: activated, needs-review, discovered-only |
| 4 | View occurrences | Paginated list with lemma/form details | Each occurrence is one word instance, not grouped by ayah |
| 5 | Filter by lemma | Click lemma distribution card | Reloads page with filtered set |
| 6 | Navigate to ayah | Click "View ayah" link with `?from=root&root=<slug>` | Arrives at ayah page with root context panel |
| 7 | Find thematic connections | Scroll to "Related Topics" section | Heuristic keyword matches explicitly labeled as non-authoritative |
| 8 | Verify linguistic basis | No mechanism to verify root→topic connection | Must consult external scholarship |

**Emotional Arc:** Motivated → Productive (finding occurrences) → Uncertain (thematic bridges) → Blocked (no verification path)

**Key Gap:** Morphological data and thematic taxonomy exist in separate silos with only heuristic bridges.

---

### CJ-5: Evidence Verification for Scholarly Review

**Persona:** Scholar or editor reviewing content accuracy  
**Entry Point:** `/editorial/review` or topic/ayah detail pages

| Step | Action | System Response | Friction |
|------|--------|----------------|----------|
| 1 | Access review workbook | Load human lemma review interface | Only covers 10 curated roots; not comprehensive |
| 2 | Review lemma evidence | See source morphology data per lemma | Decisions stored in localStorage; not shareable |
| 3 | Check topic mapping rationale | Navigate to canonical topic detail | Must find specific ayah within potentially hundreds of mappings |
| 4 | Verify cross-references | View CrossReferencePanel on ayah page | References listed but not annotated with verification status |
| 5 | Assess provenance | Read footer/editorial notes | Provenance info scattered across page sections |
| 6 | Make approval decision | No inline approval mechanism in public UI | Review tools separated from consumption experience |

**Emotional Arc:** Diligent → Methodical → Fatigued (scattered evidence) → Uncertain (incomplete coverage)

**Key Gap:** No unified evidence dossier view that aggregates all provenance signals for a single ayah or topic.

---

## Part 2: Proposed Research Journeys

### PJ-A: Quranic Exploration Interface

**Target Persona:** Serious researcher conducting thematic Quranic study  
**Solves:** FP-1 (No Persistent Research Context)

| Step | Action | Enhanced System Response | Improvement Over Current |
|------|--------|-------------------------|-------------------------|
| 1 | Begin research session | Create named research thread with auto-generated ID | Explicit context container replaces ephemeral browsing |
| 2 | Navigate to ayah/topic/root | Breadcrumb trail encodes full path history | Visual thread showing "Root ك-ت-ب → Ayah 2:282 → Topic: Contracts" |
| 3 | Add item to thread | Pin ayah/topic to active research thread | Items persist across navigation; no tab management needed |
| 4 | Branch exploration | Fork thread at any point to explore tangent | Original thread preserved; branches visually linked |
| 5 | Resume previous session | Thread list with last-active timestamps | Return to exact state without browser history reliance |
| 6 | Export thread | Generate structured JSON/Markdown of thread contents | Shareable research artifact |

**New Capabilities:** Research thread persistence, visual navigation history, branching exploration, exportable artifacts.

---

### PJ-B: Arabic Terminology Explorer Interface

**Target Persona:** Linguistic researcher studying Quranic Arabic semantics  
**Solves:** FP-3 (Arabic Terminology Lacks Semantic Bridge)

| Step | Action | Enhanced System Response | Improvement Over Current |
|------|--------|-------------------------|-------------------------|
| 1 | Search root | Unified search across morphology + thematic databases | Single entry point instead of separate discovery pages |
| 2 | View root profile | Morphological data + verified thematic connections side-by-side | Clear separation of "linguistically verified" vs. "heuristic suggestion" |
| 3 | Explore semantic field | Visual map of related roots sharing semantic domain | Discover ك-ت-ب ↔ س-ج-ل ↔ ق-ر-أ relationships |
| 4 | Trace word→concept path | Interactive pathway showing root → lemmas → ayat → topics → dimensions | Full chain with epistemic status at each link |
| 5 | Filter by confidence | Show only verified / only suggested / all with labels | User controls evidence threshold |
| 6 | Compare root usage across periods | Meccan/Medinan distribution chart with lemma breakdown | Temporal analysis currently impossible |

**New Capabilities:** Verified root→topic bridges, semantic field visualization, confidence-filtered exploration, temporal distribution analysis.

---

### PJ-C: Research Workspace Interface

**Target Persona:** Comparative researcher analyzing multiple verses/concepts  
**Solves:** FP-5 (No Workspace for Comparative Analysis)

| Step | Action | Enhanced System Response | Improvement Over Current |
|------|--------|-------------------------|-------------------------|
| 1 | Create workspace | Named workspace with configurable layout | Dedicated environment vs. ad-hoc tab collection |
| 2 | Add comparison items | Drag-drop ayat/topics/roots into workspace panels | Multi-item view without leaving current context |
| 3 | Configure parallel view | Side-by-side translations (multiple editions) | Currently requires opening separate edition searches |
| 4 | Annotate items | Private notes attached to workspace items | Notes stay with research context, not global bookmarks |
| 5 | Run structural query | Filter workspace items by juz/surah/revelation/type | Dynamic subsetting of working set |
| 6 | Export workspace | PDF/Markdown/JSON with annotations and configuration | Reproducible research output |
| 7 | Share workspace | Generate read-only share link | Collaborative review without account requirement |

**New Capabilities:** Ephemeral working sets, multi-edition parallel view, contextual annotation, exportable/shareable workspaces.

---

### PJ-D: Evidence Presentation Interface

**Target Persona:** Scholar verifying claims or student understanding evidence quality  
**Solves:** FP-2 (Evidence Provenance Requires Deep Navigation), FP-4 (Mixed Verified/Provisional Content)

| Step | Action | Enhanced System Response | Improvement Over Current |
|------|--------|-------------------------|-------------------------|
| 1 | View any ayah/topic/result | Inline provenance badge on each item | Epistemic status visible without navigation |
| 2 | Expand evidence panel | Slide-out panel showing mapping type, rationale, curator, review date, source IDs | All provenance signals aggregated in one place |
| 3 | Trace evidence chain | Interactive breadcrumb showing: Source Dataset → Morphology Index → Lemma Selection → Ayah Mapping → Topic Assignment | Full audit trail visualization |
| 4 | Compare evidence across items | Side-by-side evidence panels for selected items | Identify patterns in review quality |
| 5 | Flag for review | Mark items needing attention with reason code | Structured feedback channel for scholars |
| 6 | View review history | Timeline of status changes for any entity | Transparency about editorial process |
| 7 | Download evidence dossier | Structured report for offline scholarly review | Integration with external review workflows |

**New Capabilities:** Per-item epistemic indicators, aggregated evidence panels, audit trail visualization, structured review flagging, downloadable dossiers.

---

## Part 3: Journey Transition Matrix

| Current Journey | Primary Friction | Target Proposed Journey | Key Capability Added |
|----------------|-----------------|------------------------|---------------------|
| CJ-1: Quran Reading | No position memory, linear only | PJ-A: Quranic Exploration | Persistent threads, branching |
| CJ-2: Verse Discovery | Context loss, no collection | PJ-C: Research Workspace | Ephemeral working sets |
| CJ-3: Concept Exploration | Dual taxonomy confusion, no comparison | PJ-D: Evidence Presentation | Per-item provenance, comparison |
| CJ-4: Root Lookup | No semantic bridge, heuristic-only | PJ-B: Terminology Explorer | Verified bridges, semantic fields |
| CJ-5: Evidence Verification | Scattered provenance, no aggregation | PJ-D: Evidence Presentation | Unified evidence dossier |

---

## Part 4: Emotional State Targets

| Proposed Interface | Current Dominant Emotion | Target Emotion | Design Principle |
|-------------------|-------------------------|---------------|------------------|
| A: Exploration | Frustrated (context loss) | Confident continuity | Never lose your place |
| B: Terminology | Uncertain (unverified bridges) | Calibrated trust | Know what you can rely on |
| C: Workspace | Overwhelmed (tab chaos) | Organized agency | Your research, your structure |
| D: Evidence | Fatigued (scattered signals) | Assured clarity | Evidence at a glance |

---

## Appendix: Journey Validation Criteria

Each proposed journey must be validated against:
1. **Completeness:** Can the user accomplish the stated goal without leaving the interface?
2. **Continuity:** Is context preserved across all transitions?
3. **Transparency:** Is epistemic status always visible?
4. **Reversibility:** Can the user undo/return to any previous state?
5. **Exportability:** Can the research output be extracted in a usable format?
