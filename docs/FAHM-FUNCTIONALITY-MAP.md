---
title: FAHM Functionality Map — Current Product Baseline
status: Draft — Pending Stakeholder Review
baseline: Sprint 54 (current product)
date: 2026-11-11
decision_reference: STAKEHOLDER-DECISION-2026-11-11.md (D-04)
architecture_reference: THREE-MODE-ARCHITECTURE.md
author: Product & Engineering
audience: Stakeholders, Editorial Board, Engineering
---

# FAHM Functionality Map — Current Product Baseline

> **Status:** Draft — Pending Stakeholder Review
> **Baseline:** Sprint 54 (current product, as of 2026-11-11)
> **Decision Reference:** [STAKEHOLDER-DECISION-2026-11-11.md](./STAKEHOLDER-DECISION-2026-11-11.md), Decision D-04
> **Architecture Reference:** [THREE-MODE-ARCHITECTURE.md](./THREE-MODE-ARCHITECTURE.md)
> **Last Updated:** 2026-11-11

---

## 1. Executive Summary

Decision D-04 (2026-11-11) states: **"FAHM continues the current product."**

This document is the authoritative mapping of the existing Al-Huda Quran study product onto the **FAHM** mode of the newly approved three-mode architecture (NOOR / FAHM / EXPLORE). It asserts a foundational principle:

> **The current product IS the FAHM experience. No rebuild is authorized.**

Every feature shipped through Sprint 54 — Quran reader, Tafsir, word-by-word study, root discovery, morphology pipeline, 18 curated topics, 15 life dimensions, 14 domains, 4 study journeys (20 stages), personal study tools, editorial quality dashboard, and backup compatibility — is preserved as FAHM's baseline. This document inventories that functionality, classifies each item's role within FAHM, identifies gaps relative to the original PRD v2.0, and surfaces UX/information-architecture improvements that should precede any new feature work.

FAHM is the deep-study mode for practicing Muslims aged 13+. It shares its foundation with NOOR (children) and EXPLORE (seekers), but retains the full breadth of study tools. Content may be adapted — never duplicated — across the three modes.

---

## 2. FAHM Scope Statement

### 2.1 What FAHM Is

- A **deep Quran study and personal learning experience** for practicing Muslims aged 13 and above.
- The **continuation of the current product** (Sprint 54 baseline), not a rebuild.
- The **richest of the three modes**: it retains every study tool, translation layer, Tafsir integration, morphology pipeline, and curated content set the product has shipped.
- A **scholarly-grounded, policy-compliant** experience: no AI-generated religious answers (D-10), no auto-translations, Urdu workflow only through approved editorial channels.
- A **personal, private** study environment: bookmarks, notes, collections, and progress all remain localStorage-based by default.

### 2.2 What FAHM Is Not

| FAHM is NOT | Why |
|---|---|
| **NOOR** | NOOR is the children's mode (under 13); FAHM is 13+. FAHM retains full study tools; NOOR gets simplified, age-appropriate views. |
| **EXPLORE** | EXPLORE is the seeker/onboarding mode; FAHM assumes a practicing Muslim audience and does not dilute content for discovery. |
| **A fourth mode** | The three-mode architecture is fixed by D-04. FAHM is one of three, not an add-on. |
| **A rebuild target** | D-04 explicitly prohibits rebuilding FAHM. Improvements are incremental. |
| **An AI-fatwa engine** | D-10 prohibits AI-generated religious answers. FAHM surfaces curated scholarly content only. |

### 2.3 Audience

- Primary: Practicing Muslims aged 13+ seeking structured, deep Quran study.
- Secondary: Advanced students, educators, and community leaders using FAHM content as a reference.
- Out of scope: Children under 13 (→ NOOR), non-Muslim seekers (→ EXPLORE).

---

## 3. Existing Functionality Inventory

The following table inventories every shipped feature as of Sprint 54 and classifies its role within FAHM.

| # | Feature | Current Status | FAHM Role | Notes / Gaps |
|---|---|---|---|---|
| 1 | Quran reader (multi-edition) | Shipped, stable | **Core feature** | Foundation of FAHM; no changes required. |
| 2 | Translation selection (multiple editions) | Shipped | **Core feature** | Urdu workflow policy-compliant; no auto-translations. |
| 3 | Tafsir (scholarly commentary) | Shipped, integrated with ayah display | **Core feature** | Scholarly source; provenance tracked. |
| 4 | Word-by-word study (Arabic analysis) | Shipped | **Core feature** | Unique differentiator; preserve as-is. |
| 5 | Root discovery | 1,574+ roots activated | **Core feature** | Sprint 48 milestone; fully operational. |
| 6 | Morphology pipeline | Shipped (Sprint 48) | **Core feature** | Full pipeline; validation in place. |
| 7 | 18 curated topics | Shipped; **pending scholarly review** | **Core feature** | Editorial review outstanding — blocker for public launch of topic navigation. |
| 8 | 15 life dimensions | Shipped as editorial navigation aids | **Enhancement candidate** | IA refinement needed; see §6. |
| 9 | 14 domains | Shipped as organizational proposal | **Enhancement candidate** | IA refinement needed; see §6. |
| 10 | 4 study journeys (20 stages) | Shipped; local progress tracking | **Core feature** | Understanding Tawheed, Patience Through Difficulties, Gratitude and Contentment, Building a Relationship with Allah. |
| 11 | Bookmarks | Shipped (localStorage) | **Core feature** | Personal, private. |
| 12 | Notes | Shipped (localStorage) | **Core feature** | Personal, private. |
| 13 | Collections | Shipped (localStorage) | **Core feature** | Personal, private. |
| 14 | Personal progress tracking (journeys) | Shipped (localStorage) | **Core feature** | Local-only; no cloud sync in current scope. |
| 15 | Editorial quality dashboard | Shipped (Sprint 54) | **Core feature** | Internal tool; supports ongoing curation. |
| 16 | Backup compatibility (v3–v9 migration) | Shipped, tested | **Core feature** | Data integrity non-negotiable. |
| 17 | Urdu translation workflow | Shipped, policy-compliant | **Core feature** | No auto-translations; editorial channel only. |
| 18 | Audit scripts | Shipped | **Core feature** | Supports data integrity. |
| 19 | Provenance tracking | Shipped | **Core feature** | Required for scholarly compliance. |

---

## 4. Feature Categories

### 4.1 Core Reading

The reading experience is FAHM's foundation.

- **Quran reader** — multi-edition rendering with translation selection.
- **Translations** — multiple editions available; Urdu workflow is policy-compliant (no auto-translations).
- **Tafsir** — scholarly commentary integrated inline with ayah display; provenance-tracked.

### 4.2 Study Tools

FAHM's differentiating depth comes from its linguistic study layer.

- **Word-by-word study** — Arabic analysis per word, surfaced alongside ayah display.
- **Root discovery** — 1,574+ roots activated; users can trace lexical families.
- **Morphology pipeline** — full pipeline shipped in Sprint 48; validated.

### 4.3 Curated Content

Editorial content organizes the Quran thematically for FAHM learners.

- **18 curated topics** — patience, gratitude, trust-in-god, mercy-and-forgiveness, remembrance, giving, justice, parents-and-family, hardship-and-ease, knowledge-and-reflection, the-hereafter, tawheed, prayer, supplication, god-consciousness, repentance, prophets, good-character. **All pending scholarly review.**
- **15 life dimensions** — spiritual, personal, family, social, economic, intellectual, governance, jihad, interfaith, ilm, worship, prophets, creation, hereafter, law. Currently editorial navigation aids.
- **14 domains** — belief-theology, worship-practice, ethics-character, family-relationships, society-justice, economic-conduct, prophets-narratives, creation-signs, revelation-guidance, human-experiences, interfaith-communities, language-vocabulary, law-obligations, eschatology-afterlife. Organizational proposal.

### 4.4 Structured Learning

- **4 study journeys, 20 stages total:**
  1. Understanding Tawheed
  2. Patience Through Difficulties
  3. Gratitude and Contentment
  4. Building a Relationship with Allah
- Local progress tracking per journey.

### 4.5 Personal Study

All personal study tools are **localStorage-based** — private to the user's device.

- **Bookmarks**
- **Notes**
- **Collections**
- **Progress tracking** for study journeys

### 4.6 Editorial & Quality

Internal infrastructure that sustains FAHM's scholarly integrity.

- **Editorial quality dashboard** (Sprint 54).
- **Audit scripts** for content and data integrity.
- **Provenance tracking** for every curated and scholarly source.

### 4.7 Data Integrity

- **Backup compatibility** — v3 through v9 migration tested and verified.
- **Morphology validation** — ensures linguistic data remains consistent across releases.

---

## 5. Gap Analysis

The following items were envisioned in the original PRD v2.0 but are **not present** in the Sprint 54 baseline. Per D-04, FAHM inherits the current product; these gaps are explicitly **deferred**, not authorized for Sprint 55.

| Gap | Original PRD v2.0 Status | FAHM Status | Reference |
|---|---|---|---|
| **Hifz / memorization mode** | Envisioned | **Deferred** | Q-5 |
| **Namaz (prayer) companion** | Envisioned | **Deferred** | Q-5 |
| **Personal journal** | Envisioned | **Deferred** | Q-5 |
| **Quran knowledge graph** | Envisioned | **Deferred** | Q-5 |
| **Root-word curriculum** | Envisioned | **Partially implemented** via morphology pipeline and root discovery (Sprint 48) | — |

> **Note:** Deferral to Q-5 means these items are out of scope for the current planning horizon. They may be reconsidered in a future roadmap cycle after FAHM's baseline is stabilized and the 18 topics complete scholarly review.

---

## 6. Improvement Opportunities

Before adding any new features, the following UX and information-architecture gaps in the current FAHM experience should be addressed. These are **incremental improvements**, not rebuilds.

### 6.1 Curated Topics — Scholarly Review Blocker

All **18 topics** are pending scholarly review. Until review is complete, topic navigation cannot be presented as authoritative. **This is the single largest content blocker for FAHM's public positioning.**

### 6.2 Dimensions & Domains — Information Architecture Refinement

The **15 life dimensions** and **14 domains** currently exist as parallel organizational proposals. Users may encounter both without a clear mental model of how they relate. Recommended work:

- Define the relationship between dimensions and domains (subset, cross-cut, complementary?).
- Decide whether to surface one, both, or a unified view in the navigation.
- Validate the taxonomy with the editorial board before any UI changes.

### 6.3 Study Journey Discoverability

Four journeys (20 stages) exist but may not be prominently surfaced. Consider:

- A dedicated "Journeys" entry point in primary navigation.
- Progress visibility on the home/dashboard surface.
- Clearer onboarding for first-time users.

### 6.4 Personal Study Tools — UX Polish

Bookmarks, notes, and collections are functional but may benefit from:

- Unified "My Library" view.
- Search/filter across notes and collections.
- Export options (preserving localStorage privacy while enabling user portability).

### 6.5 Editorial Dashboard — Operational Use

The Sprint 54 quality dashboard is shipped; its operational cadence and ownership should be formalized so it sustains FAHM's scholarly integrity over time.

---

## 7. FAHM Roadmap Principles

The following principles govern all future FAHM work. They are derived from D-04 and the broader stakeholder decisions of 2026-11-11.

1. **Preserve all existing functionality.** No feature shipped through Sprint 54 may be removed or downgraded in the name of "FAHM alignment."
2. **Incremental improvements over rebuild.** D-04 explicitly prohibits rebuilding FAHM. Every change must be a targeted improvement to the existing baseline.
3. **User feedback drives prioritization.** New work is justified by demonstrated user need, not by feature parity with other modes or by PRD v2.0 leftovers.
4. **Data integrity is non-negotiable.** Backup compatibility (v3–v9) and morphology validation must remain green across every release.
5. **No AI religious answers (D-10).** FAHM surfaces curated scholarly content only. AI may assist with UX, search, and navigation — never with religious interpretation.
6. **Scholarly review is a gate.** No curated content goes public without editorial board sign-off.
7. **Policy compliance is inherited.** Urdu translation workflow, provenance tracking, and audit scripts remain mandatory.

---

## 8. Relationship to Other Modes

FAHM does not exist in isolation. The three-mode architecture ([THREE-MODE-ARCHITECTURE.md](./THREE-MODE-ARCHITECTURE.md)) defines how FAHM relates to NOOR and EXPLORE.

### 8.1 Shared Foundation

- All three modes share the **same Quran text, translation layer, and scholarly Tafsir source**.
- The **morphology pipeline and root data** (1,574+ roots) are a shared asset.
- **Backup compatibility and data integrity** standards apply across modes.

### 8.2 FAHM's Unique Position

- FAHM retains the **full breadth of study tools**: word-by-word, root discovery, morphology, full Tafsir integration.
- FAHM is the **only mode** that surfaces the complete curated topics, dimensions, and domains without simplification.
- FAHM is the **only mode** that offers the full study journeys (20 stages) with local progress tracking.

### 8.3 Content Adaptation, Not Duplication

- FAHM content **may be adapted** for NOOR (simplified for children) and EXPLORE (framed for seekers).
- Content is **never duplicated** across modes — each mode renders its own view of shared source material.
- NOOR and EXPLORE get **simplified views**; FAHM keeps the full study tools.

### 8.4 Mode Boundaries

| Mode | Audience | Study Depth | Tool Access |
|---|---|---|---|
| **NOOR** | Children under 13 | Age-appropriate | Simplified |
| **FAHM** | Practicing Muslims 13+ | Deep, scholarly | Full |
| **EXPLORE** | Seekers / onboarding | Introductory, guided | Curated subset |

---

## 9. Authorization Boundary

> **This document is a specification, not an implementation authorization.**

- **Sprint 55 has not started.** No sprint commitment is implied by this document.
- **No deployment is authorized.** All work described herein is planning-level until explicitly authorized through the normal sprint-planning process.
- **No rebuild is authorized.** D-04 is unambiguous: FAHM continues the current product.
- **Deferred items (Q-5) remain deferred.** Hifz, Namaz companion, personal journal, and Quran knowledge graph are out of scope for the current planning horizon.
- **Scholarly review of the 18 topics is a prerequisite** for any public positioning of topic navigation as authoritative.

---

## 10. Acceptance Criteria

This document is accepted when:

- [ ] Stakeholders confirm the FAHM scope statement (§2) accurately reflects D-04.
- [ ] The functionality inventory (§3) matches the shipped Sprint 54 baseline.
- [ ] The gap analysis (§5) correctly identifies deferred PRD v2.0 items and their Q-5 references.
- [ ] The improvement opportunities (§6) are acknowledged as the prioritized pre-feature work list.
- [ ] The roadmap principles (§7) are endorsed as binding on future FAHM work.
- [ ] The relationship to NOOR and EXPLORE (§8) is consistent with [THREE-MODE-ARCHITECTURE.md](./THREE-MODE-ARCHITECTURE.md).
- [ ] The authorization boundary (§9) is understood: this is a specification, not a work order.

---

## 11. Next Steps

1. **Stakeholder review** of this draft. Target: sign-off within the current review cycle.
2. **Editorial board** to prioritize scholarly review of the 18 curated topics — this is the critical-path content blocker.
3. **Information architecture working group** to resolve the dimensions/domains relationship before any UI work.
4. **Sprint 55 planning** to consider improvement opportunities (§6) as the first FAHM-aligned work, ahead of any new feature authorization.
5. **Cross-mode alignment review** with NOOR and EXPLORE specification documents once they are drafted, to confirm content adaptation (not duplication) principles are consistently applied.

---

*End of document.*
