---
proposedBy: ai-assisted
reviewStatus: pending-scholarly-review
title: "MFD-11.5 UX Research Report: Current State Audit & Friction Analysis"
date: 2026-11-21
programme: FAHM Development Programme MFD-11.5
workstream: WS1 (Product Experience & User Research)
---

# MFD-11.5 UX Research Report

## Executive Summary

This report documents the current state of navigation, search, and knowledge exploration interfaces in the Quran Al Huda application as of Sprint 50. The audit covered **15 primary routes** across four functional domains: Quran reading, search, concept/topic exploration, and Arabic root/terminology lookup. Five critical friction points were identified that impede scholarly research workflows and evidence verification. This report serves as the foundational evidence base for designing four new research-grade interfaces (A–D) specified in programme document §7.WS1.

## 1. Routes Audited

| # | Route | Component File | Functional Domain |
|---|-------|---------------|-------------------|
| 1 | `/quran` | `src/app/quran/page.tsx` | Quran Reading |
| 2 | `/quran/[slug]` | `src/app/quran/[slug]/page.tsx` | Quran Reading |
| 3 | `/ayah/[surah]/[ayah]` | `src/app/ayah/[surah]/[ayah]/page.tsx` | Verse Detail |
| 4 | `/search` | `src/app/search/page.tsx` | Search |
| 5 | `/explore` | `src/app/explore/page.tsx` | Concept Exploration |
| 6 | `/explore/root` | `src/app/explore/root/page.tsx` | Root Discovery |
| 7 | `/explore/root/[root]` | `src/app/explore/root/[root]/page.tsx` | Root Detail |
| 8 | `/explore/graph` | `src/app/explore/graph/page.tsx` | Knowledge Graph |
| 9 | `/explore/topics/[id]` | `src/app/explore/topics/[id]/page.tsx` | Topic Detail (Unified) |
| 10 | `/topics` | `src/app/topics/page.tsx` | Legacy Topics Index |
| 11 | `/editorial/review` | `src/app/editorial/review/page.tsx` | Editorial Review |
| 12 | `/learn/paths/[slug]` | `src/app/learn/paths/[slug]/page.tsx` | Learning Paths |
| 13 | `/my-study/collections/[id]` | `src/app/my-study/collections/[id]/page.tsx` | Personal Study |
| 14 | `/explore/domains/[id]` | `src/app/explore/domains/[id]/page.tsx` | Domain Detail |
| 15 | `/explore/dimensions/[id]` | `src/app/explore/dimensions/[id]/page.tsx` | Dimension Detail |

**Total unique page components inspected:** 15  
**Total API routes discovered:** 12 (v1 REST endpoints for surahs, ayahs, topics, sources, search, tafsir, translations, graph, dimensions, quiz, suggestions, verse-of-day)

## 2. Current Architecture Observations

### 2.1 Dual Taxonomy System
The application maintains two parallel topic systems:
- **Legacy Topics** (`/topics/[slug]`): Curated editorial selections with manual provenance tracking
- **Canonical Topics** (`/explore/topics/[id]`): Expanded taxonomy with 176+ topics, domain/dimension hierarchy, and automated mapping

The unified topic detail page (`/explore/topics/[id]`) resolves both by trying canonical ID first, then falling back to legacy slug. This creates implicit URL ambiguity.

### 2.2 Review Status Pervasiveness
Every exploratory surface carries `pending-scholarly-review` notices. The gold/amber visual language is consistent but repetitive — appearing on:
- Explore hub page (dimensions disclaimer)
- Every canonical topic detail page
- Root discovery pages (automated vs. human-approved distinction)
- Graph explorer
- Search results (canonical topic matches)
- Ayah detail page (canonical topic mappings)

### 2.3 Morphology Data Dependency
Root exploration depends entirely on pre-generated data files:
- Sprint 48 registry for 1,642 discovered roots
- Occurrence files per root
- Morphology index from QUL SQLite

When these are missing, pages show error states with CLI commands rather than graceful degradation.

### 2.4 Search Architecture
Search supports three distinct modes via URL parameters:
1. Default English translation search (lexical, rule-based ranking)
2. Edition-scoped search (`?edition=<id>`) — fetches from Tanzil.net
3. Tafsir mode (`?mode=tafsir`) — searches al-Jalalayn + al-Muyassar

No semantic/embedding search exists despite a `SemanticSearchPanel` component being present.

## 3. Top 5 Friction Points

### FP-1: No Persistent Research Context Across Navigation
**Severity:** Critical  
**Affected Journeys:** All research workflows  
**Description:** When a user navigates from a root → ayah → topic → related root, there is no mechanism to maintain or visualize the research thread. Each page load resets context. The `?from=root&root=<slug>` parameter provides minimal back-linking but no forward path reconstruction. Users cannot see "how I got here" or "what I was investigating."  
**Evidence:** `buildRootContext()` in ayah page only activates when `from=root` is explicitly set; no equivalent exists for topic→ayah or dimension→topic transitions.

### FP-2: Evidence Provenance Requires Deep Navigation
**Severity:** High  
**Affected Journeys:** Evidence verification, scholarly review  
**Description:** To verify why an ayah appears under a canonical topic, users must navigate to the topic detail page, scroll to the mapping section, find the specific ayah, and read the rationale. There is no inline evidence badge on search results or ayah cards that surfaces mapping type, rationale excerpt, or review status without leaving the current context.  
**Evidence:** In `search/page.tsx`, canonical topic matches show only title badges. In `ayah/[surah]/[ayah]/page.tsx`, canonical topic mappings show full rationale but require scrolling past the main ayah content.

### FP-3: Arabic Terminology Lookup Lacks Semantic Bridge
**Severity:** High  
**Affected Journeys:** Arabic word/root study, linguistic research  
**Description:** Root pages show morphological occurrences (word forms, lemmas, positions) but provide no direct bridge to thematic concepts. The "Related Topics" section on root detail pages uses heuristic keyword matching via the enrichment layer, explicitly labeled as "not authoritative." A researcher studying root ك-ت-ب cannot reliably discover which canonical topics are linguistically grounded in that root versus merely mentioning it.  
**Evidence:** `getRelatedTopicsForRoot()` in root detail page filters enrichment data by `relatedRoots.includes(rootSlug)` — a string match, not a verified linguistic relationship.

### FP-4: Search Results Mix Verified and Provisional Content Without Visual Distinction
**Severity:** Medium-High  
**Affected Journeys:** Verse discovery, evidence gathering  
**Description:** Search results display canonical topic matches, legacy topic tags, and learning path links with identical visual weight. A user cannot distinguish at a glance whether a topic association is editorially curated (legacy), taxonomically mapped (canonical/pending-review), or algorithmically suggested. The `matchReasonLabel` distinguishes arabic/reference/translation matches but not the epistemic status of associated metadata.  
**Evidence:** In search results, `relatedTopics` and `canonicalTopicMatches` render as similar pill badges with only color differentiation (primary/10 vs primary/10).

### FP-5: No Workspace for Comparative or Multi-Verse Analysis
**Severity:** Medium  
**Affected Journeys:** Thematic research, cross-reference verification  
**Description:** The application treats each ayah as an isolated unit. There is no interface for placing multiple ayat side-by-side, comparing translations across editions, or collecting verses into a temporary working set without committing to a permanent collection. Researchers must open multiple browser tabs or use external tools for comparative analysis.  
**Evidence:** `my-study/collections` requires explicit save actions; no ephemeral comparison mode exists. Cross-reference panel shows linked ayat but doesn't enable inline expansion or comparison.

## 4. Uncertainty Indicator Audit

Current uncertainty indicators found across the application:

| Indicator | Location | Visual Treatment | Scope |
|-----------|----------|-----------------|-------|
| Pending Scholarly Review | Canonical topics, dimensions, graph | Gold border + AlertTriangle icon + text | Page-level |
| Automated Policy | Root detail (Sprint 48) | Info icon + muted text block | Section-level |
| Heuristic Suggestion | Root→Topic connections | Italic text + "suggested connections" label | Inline |
| Editorial Selection | Legacy topics | Gold banner + provenance footer | Page-level |
| Not Tafsir | Multiple locations | Explicit text disclaimer | Inline/banner |
| Coverage Disclosure | Root detail | Info icon + statistics | Section-level |
| Rejected | Manual roots | Red border + XCircle icon | Page-level |
| Needs Review | Sprint 48 roots | Amber border + Clock icon | Page-level |

**Gap:** No inline, per-item uncertainty indicator exists for search results, ayah cards, or cross-reference entries. Status is always page-scoped or section-scoped.

## 5. Data Integrity Observations

- All Quran text derives from pinned dataset; no runtime modification possible
- Morphology data is pre-generated and validated against QUL source
- Topic-ayah mappings stored in static JSON (`data/taxonomy/topic-ayah-mappings.json`)
- Translation editions fetched from Tanzil.net with process-memory caching
- Review workbook for human lemma review stored client-side (localStorage)
- No AI-generated content appears in any public-facing route without explicit disclaimer

## 6. Recommendations for Interface Design (A–D)

Based on this audit, the four proposed interfaces should address:

1. **Interface A (Quranic Exploration):** Solve FP-1 with persistent research threads and breadcrumb trails that encode navigation history
2. **Interface B (Arabic Terminology Explorer):** Solve FP-3 with verified root→topic bridges and clear separation of morphological vs. thematic relationships
3. **Interface C (Research Workspace):** Solve FP-5 with ephemeral comparison sets, multi-edition parallel view, and exportable working collections
4. **Interface D (Evidence Presentation):** Solve FP-2 and FP-4 with inline provenance badges, epistemic status indicators per result item, and expandable rationale panels

All interfaces must implement the uncertainty indicator system defined in the companion UX Specification document.

## Appendix: Files Inspected

See route table in Section 1. Additional library files referenced but not fully audited:
- `@/lib/quran/search.ts`
- `@/lib/morphology/sprint-48-root-data.ts`
- `@/lib/taxonomy/canonical-adapter.ts`
- `@/lib/graph/canonical-graph-enrichment.ts`
- `@/lib/topics/data.ts`
- `@/lib/quran/cross-references.ts`
