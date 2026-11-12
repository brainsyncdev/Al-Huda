# Stakeholder Decision Record

**Decision Date:** November 11, 2026  
**Baseline:** PRD v4.1 / Sprint 54  
**Decision Authority:** Product Owner  
**Record Status:** Final

---

## Executive Summary

On November 11, 2026, the product owner reviewed the Architecture Decision Register and approved the three-mode product architecture direction. This decision restores the original PRD v2.0 vision (NOOR, FAHM, EXPLORE) while retaining the current Next.js web-first technical foundation.

**Key Outcomes:**
- ✅ D-01 through D-08: APPROVED
- ✅ D-09 and D-10: CONFIRMED as existing constraints
- ⏳ Q-1 through Q-7: PENDING separate decisions
- ❌ Implementation authorization: NOT GRANTED
- ❌ Deployment authorization: NOT GRANTED

---

## Part 1 — Architecture Decisions

| ID | Decision | Status | Date |
|---|---|---|---|
| D-01 | Restore NOOR, FAHM and EXPLORE as three product experiences | ✅ APPROVED | 2026-11-11 |
| D-02 | Retain Next.js web-first architecture | ✅ APPROVED | 2026-11-11 |
| D-03 | Use one shared Quran and reference foundation | ✅ APPROVED | 2026-11-11 |
| D-04 | FAHM continues the current product | ✅ APPROVED | 2026-11-11 |
| D-05 | Study Journeys remain a feature, not a fourth mode | ✅ APPROVED | 2026-11-11 |
| D-06 | Learn remains a functional area, not a fourth mode | ✅ APPROVED | 2026-11-11 |
| D-07 | Require child-safety specification before NOOR implementation | ✅ APPROVED | 2026-11-11 |
| D-08 | Build EXPLORE as a beginner-first discovery experience | ✅ APPROVED | 2026-11-11 |
| D-09 | Preserve account-free, local-first behavior | ✅ CONFIRMED | 2026-11-11 |
| D-10 | Keep AI religious answers disabled | ✅ CONFIRMED | 2026-11-11 |

---

## Part 2 — Interpretation of Approved Decisions

### D-01: Three-Mode Product Direction
**Approved.** The product will implement three distinct audience experiences:
- **NOOR** — Children (ages 3-12): Age-appropriate Quran learning
- **FAHM** — Muslims (ages 13+): Deep Quran study and personal learning
- **EXPLORE** — Seekers and curious visitors: Pressure-free Quran discovery

### D-02: Technical Foundation
**Approved.** Continue with Next.js 15 App Router. No framework migration authorized.

### D-03: Shared Foundation
**Approved.** Maintain one shared Quran and reference foundation across all three modes. Modes may present data differently but must not modify the underlying source.

### D-04: FAHM Continuation
**Approved.** Build FAHM on the existing product rather than rebuilding. Current product functionality is the FAHM baseline.

### D-05: Study Journeys
**Approved.** Study Journeys remain a learning feature within FAHM (and potentially other modes), not a separate audience mode.

### D-06: Learn Functional Area
**Approved.** "Learn" remains a functional area (navigation section) within modes, not a fourth mode.

### D-07: NOOR Child-Safety Prerequisite
**Approved.** A dedicated child-safety and privacy specification must be completed and approved before NOOR implementation begins. This is a hard prerequisite.

### D-08: EXPLORE Beginner-First Design
**Approved.** EXPLORE must be designed around newcomers and seekers rather than being a reduced FAHM experience. Requires dedicated content and editorial standards.

### D-09: Account-Free, Local-First
**Confirmed.** Existing project constraint. No accounts or cloud synchronization unless separately authorized.

### D-10: AI Religious Answers Disabled
**Confirmed.** Existing project constraint. No AI-generated religious interpretation presented as authoritative.

---

## Part 3 — Open Questions

The following seven questions remain pending separate stakeholder decisions:

| ID | Question | Status | Recommendation |
|---|---|---|---|
| Q-1 | Should NOOR be parent-mediated or directly accessible? | ⏳ PENDING | Parent-mediated with explicit consent |
| Q-2 | Should EXPLORE require onboarding? | ⏳ PENDING | Minimal welcome screen, no account |
| Q-3 | Should users be able to switch modes freely? | ⏳ PENDING | Yes, with mode selector in navigation |
| Q-4 | Should FAHM retain all existing study tools? | ⏳ PENDING | Yes, all tools align with FAHM's purpose |
| Q-5 | Which original features should be prioritized? | ⏳ PENDING | Defer until FAHM refined and user feedback received |
| Q-6 | Should mode preference be stored locally? | ⏳ PENDING | Yes, one localStorage key, changeable anytime |
| Q-7 | Which age groups and parental controls for NOOR at launch? | ⏳ PENDING | Launch with single age group (7-12), add controls incrementally |

**Note:** Previous recommendations remain recommendations, not approved decisions.

---

## Part 4 — Authorization Boundary

### What Is Authorized
- ✅ Architecture direction (three-mode product)
- ✅ Technical foundation (Next.js)
- ✅ Shared foundation approach
- ✅ Detailed specification development

### What Is NOT Authorized
- ❌ **Implementation authorization:** Not granted
- ❌ **NOOR implementation:** Blocked pending child-safety specification (D-07)
- ❌ **EXPLORE implementation:** Not authorized
- ❌ **FAHM implementation changes:** Not authorized
- ❌ **Sprint 55:** Not started or authorized
- ❌ **Deployment:** Not authorized

### What Must Not Change
- No source code modifications
- No application functionality changes
- No Quranic data modifications
- No taxonomy changes
- No morphology data changes
- No configuration changes
- No AI configuration changes

---

## Part 5 — Next Stage

Proceed to detailed architecture specifications and validation planning:

1. ✅ Define the shared three-mode product architecture
2. ✅ Map existing functionality to FAHM
3. ✅ Specify EXPLORE's content and editorial standards
4. ✅ Prepare NOOR's child-safety and privacy specification
5. ✅ Define mode navigation, switching and preference behavior
6. ⏳ Resolve Q-1 through Q-7
7. ⏳ Present the detailed specifications for stakeholder approval before implementation planning

---

## Deliverables Produced

Following this decision, the following specification documents were created:

1. **`docs/THREE-MODE-ARCHITECTURE.md`** — Foundational architecture specification
2. **`docs/FAHM-FUNCTIONALITY-MAP.md`** — Existing features mapped to FAHM
3. **`docs/EXPLORE-CONTENT-STANDARDS.md`** — Content and editorial standards for EXPLORE
4. **`docs/NOOR-CHILD-SAFETY-SPECIFICATION.md`** — Child-safety and privacy specification for NOOR
5. **`docs/MODE-NAVIGATION-SPECIFICATION.md`** — Mode navigation, switching, and preference behavior

All documents are **specifications for stakeholder review**, not implementation authorizations.

---

## Decision Record Status

**Register Status:**
- D-01 through D-08: ✅ APPROVED
- D-09 and D-10: ✅ CONFIRMED
- Q-1 through Q-7: ⏳ PENDING

**Next Action:** Stakeholder review of detailed specifications (documents 1-5 above)

**Implementation Status:** Not authorized

---

**Record prepared by:** Automated quality review  
**Decision date:** November 11, 2026  
**Record status:** Final
