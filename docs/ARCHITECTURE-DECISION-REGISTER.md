# Architecture Decision Register

**Document Status:** Approved — D-01 through D-08 approved; D-09 and D-10 confirmed; Q-1 through Q-7 pending  
**Decision Date:** November 11, 2026  
**Purpose:** Record approved architecture decisions and track open questions  
**Baseline:** PRD v4.1 / Sprint 54  
**Decision Reference:** STAKEHOLDER-DECISION-2026-11-11.md

---

## Status Summary

- **D-01 through D-08:** ✅ APPROVED (November 11, 2026)
- **D-09 and D-10:** ✅ CONFIRMED — EXISTING CONSTRAINTS
- **Q-1 through Q-7:** ⏳ PENDING — awaiting stakeholder decisions

**Authorization Boundary:**
- Architecture direction: Approved
- Implementation authorization: **Not granted**
- NOOR implementation: Blocked pending child-safety specification (D-07)
- EXPLORE implementation: Not authorized
- FAHM implementation changes: Not authorized
- Sprint 55: Not started or authorized
- Deployment: Not authorized

---

## Part 1: Architecture Decisions (D-01 through D-10)

### D-01: Restore NOOR, FAHM, and EXPLORE as Product Experiences

| Field | Value |
|-------|-------|
| **ID** | D-01 |
| **Decision** | Restore the original three-mode product vision (NOOR, FAHM, EXPLORE) as distinct audience experiences |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | Original PRD v2.0 defines three modes; current PRD v4.1 defers NOOR and EXPLORE |
| **Rationale** | The three-mode architecture addresses distinct audiences (children, Muslims, seekers) with different needs, content presentation, and interaction models. Restoring this vision aligns with the original product strategy while leveraging the current technical foundation. |
| **Dependencies** | D-02 (retain Next.js), D-03 (shared foundation), D-07 (NOOR child-safety spec) |
| **Risks** | Significant UX design work required; NOOR requires child-safety specification; EXPLORE requires beginner-friendly content standards; mode switching and navigation architecture must be designed |
| **Recommendation** | Approve in principle, but require detailed specifications for each mode before implementation |

---

### D-02: Retain Next.js Web-First Architecture

| Field | Value |
|-------|-------|
| **ID** | D-02 |
| **Decision** | Continue using Next.js 15 App Router as the technical foundation rather than migrating to Flutter/NestJS |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | Current product is built on Next.js 15.3.8 with React 19, TypeScript, Tailwind CSS. Sprint 54 validated this architecture with 1,288 tests passing. |
| **Rationale** | The current architecture is production-ready, well-tested, and aligned with the web-first strategy. Migrating to Flutter/NestJS would require significant rewrite with no clear benefit. The three-mode experience can be implemented within the existing Next.js architecture. |
| **Dependencies** | None (this is a continuation decision) |
| **Risks** | None identified — this preserves the current working foundation |
| **Recommendation** | Approve. Retain Next.js architecture. Avoid premature framework migration. |

---

### D-03: Use One Shared Quran and Reference Foundation

| Field | Value |
|-------|-------|
| **ID** | D-03 |
| **Decision** | Maintain a single shared foundation for Quran text, translations, Tafsir, morphology, and reference data across all three modes |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | Current architecture already uses shared data layers. No duplication exists between Quran text, translations, or morphology data. |
| **Rationale** | A shared foundation ensures data consistency, reduces maintenance burden, and prevents divergence of canonical references. Modes may present data differently but must not modify the underlying source. |
| **Dependencies** | D-02 (retain Next.js) |
| **Risks** | None — this is the current architecture and aligns with data integrity principles |
| **Recommendation** | Approve. Shared foundation is essential for data integrity. |

---

### D-04: FAHM Continues the Current Product

| Field | Value |
|-------|-------|
| **ID** | D-04 |
| **Decision** | Treat FAHM as the primary continuation of the current product, building on existing functionality rather than rebuilding |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | Current product includes Quran reader, translations, Tafsir, word-by-word study, 18 topics, 15 dimensions, 14 domains, 4 study journeys, personal study tools. All aligned with FAHM's intended scope. |
| **Rationale** | The current product already implements FAHM's core features. Treating it as the FAHM experience avoids unnecessary rebuild and preserves working functionality. Future improvements should enhance the existing FAHM experience. |
| **Dependencies** | D-01 (restore three modes), D-02 (retain Next.js) |
| **Risks** | None — this is a recognition of current state, not a change |
| **Recommendation** | Approve. Current product is the FAHM experience. |

---

### D-05: Study Journeys Remain a Feature, Not a Fourth Mode

| Field | Value |
|-------|-------|
| **ID** | D-05 |
| **Decision** | Treat Study Journeys as a feature within FAHM (and potentially other modes), not as a separate audience mode |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | Study Journeys are structured learning experiences organized around dimensions. They reference topics and ayat. They serve the FAHM audience (Muslims seeking deep study). |
| **Rationale** | Study Journeys are a learning methodology, not an audience segment. They fit naturally within FAHM's scope. Creating a fourth mode would fragment the product unnecessarily. |
| **Dependencies** | D-01 (three modes), D-04 (FAHM continuation) |
| **Risks** | None — this preserves the current architecture |
| **Recommendation** | Approve. Study Journeys are a feature, not a mode. |

---

### D-06: Learn Remains a Functional Area, Not a Fourth Mode

| Field | Value |
|-------|-------|
| **ID** | D-06 |
| **Decision** | Treat "Learn" as a functional area (navigation section) within modes, not as a separate audience mode |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | "Learn" appears in navigation structures but does not represent a distinct audience. It is a functional category for educational content. |
| **Rationale** | "Learn" is a verb, not an audience. It describes what users do, not who they are. Treating it as a mode would confuse the architecture. |
| **Dependencies** | D-01 (three modes) |
| **Risks** | None — this is a clarification, not a change |
| **Recommendation** | Approve. Learn is a functional area, not a mode. |

---

### D-07: Require Child-Safety Specification Before NOOR Implementation

| Field | Value |
|-------|-------|
| **ID** | D-07 |
| **Decision** | NOOR implementation must not begin until a dedicated child-safety and privacy specification is approved |
| **Status** | ✅ APPROVED (November 11, 2026) — hard prerequisite for NOOR |
| **Evidence** | NOOR targets children ages 3-12. This age range triggers child protection regulations (COPPA, GDPR-K, etc.). No child-safety specification currently exists. |
| **Rationale** | Children require special protections: parental consent, data minimization, restricted data collection, no external links without approval, no social features, age-appropriate content filtering. These requirements must be explicitly defined before implementation. |
| **Dependencies** | D-01 (restore three modes) |
| **Risks** | Delaying NOOR until safety spec is complete. However, this is a necessary delay — implementing without a safety spec would create legal and ethical risks. |
| **Recommendation** | Approve. Child-safety specification is a hard prerequisite for NOOR. |

---

### D-08: Build EXPLORE as a Beginner-First Discovery Experience

| Field | Value |
|-------|-------|
| **ID** | D-08 |
| **Decision** | EXPLORE should be designed as a beginner-first discovery experience for seekers and curious visitors, not as a stripped-down FAHM |
| **Status** | ✅ APPROVED (November 11, 2026) |
| **Evidence** | Original PRD v2.0 describes EXPLORE as "pressure-free discovery" for non-Muslims and seekers. Current product does not include an EXPLORE experience. |
| **Rationale** | Seekers have different needs than Muslims: they need context, explanations of unfamiliar terms, respectful comparative context, and no conversion pressure. EXPLORE must be designed from the ground up for this audience, not adapted from FAHM. |
| **Dependencies** | D-01 (restore three modes), D-03 (shared foundation) |
| **Risks** | Requires new content strategy, UX design, and editorial standards for beginner-friendly presentation. Must avoid overwhelming seekers with Islamic terminology. |
| **Recommendation** | Approve in principle. Requires detailed specification before implementation. |

---

### D-09: Preserve Account-Free, Local-First Behavior

| Field | Value |
|-------|-------|
| **ID** | D-09 |
| **Decision** | Preserve the current account-free, local-first personal study data model unless separately authorized |
| **Status** | ✅ CONFIRMED — EXISTING CONSTRAINT (November 11, 2026) |
| **Evidence** | Current product uses localStorage for bookmarks, notes, collections, and journey progress. No accounts or cloud sync implemented. PRD v4.1 explicitly defers accounts and cloud sync. |
| **Rationale** | Account-free usage reduces friction, preserves privacy, and aligns with the project's local-first philosophy. Introducing accounts would require significant infrastructure (authentication, database, sync logic) and raise privacy concerns. |
| **Dependencies** | None (this is an existing constraint) |
| **Risks** | None — this preserves the current architecture |
| **Recommendation** | Confirm. Continue with account-free, local-first model. |

---

### D-10: Keep AI Religious Answers Disabled

| Field | Value |
|-------|-------|
| **ID** | D-10 |
| **Decision** | Keep AI religious answers disabled. Do not present AI-generated religious interpretation as authoritative. |
| **Status** | ✅ CONFIRMED — EXISTING CONSTRAINT (November 11, 2026) |
| **Evidence** | Current product has no AI provider configured. `batch.aiProvider` is `"none"`. AI safety boundaries documented in `docs/AI-SAFETY.md`. Sprint 48 test verifies AI provider remains disabled. |
| **Rationale** | AI-generated religious answers risk presenting fabricated or inaccurate interpretation as authoritative. This violates data integrity principles and could mislead users on matters of faith. |
| **Dependencies** | None (this is an existing constraint) |
| **Risks** | None — this preserves the current safety boundary |
| **Recommendation** | Confirm. Keep AI religious answers disabled. |

---

## Part 2: Open Questions Requiring Explicit Decisions

### Q-1: Should NOOR be parent-mediated or directly accessible?

| Field | Value |
|-------|-------|
| **Question** | Should NOOR be available to all visitors, or should its entry be parent-mediated (requiring parental consent/setup)? |
| **Current Evidence** | No NOOR implementation exists. Original PRD v2.0 mentions "parent-oriented experience" but does not specify entry model. |
| **Product Implications** | Parent-mediated entry adds friction but ensures parental awareness and consent. Direct access is simpler but may not satisfy child protection requirements. |
| **Technical Implications** | Parent-mediated entry requires a parent setup flow, consent mechanism, and possibly parental controls. Direct access is simpler to implement. |
| **Risks** | Direct access may violate child protection regulations if data is collected. Parent-mediated entry may reduce adoption if parents find it cumbersome. |
| **Recommended Option** | Parent-mediated entry with explicit consent. This satisfies legal requirements and aligns with the "parent-oriented experience" described in the original PRD. |
| **Status** | ⏳ Pending approval |

---

### Q-2: Should EXPLORE be available without onboarding?

| Field | Value |
|-------|-------|
| **Question** | Should EXPLORE be immediately accessible without any onboarding, or should it require a brief introduction? |
| **Current Evidence** | No EXPLORE implementation exists. Original PRD v2.0 emphasizes "pressure-free discovery" but does not specify onboarding requirements. |
| **Product Implications** | No onboarding reduces friction and aligns with "pressure-free" philosophy. Brief introduction may help seekers understand what EXPLORE offers and how to navigate it. |
| **Technical Implications** | No onboarding is simpler to implement. Brief introduction requires a lightweight onboarding flow. |
| **Risks** | No onboarding may leave seekers confused about where to begin. Overly complex onboarding violates the "pressure-free" principle. |
| **Recommended Option** | Minimal onboarding: a brief welcome screen explaining what EXPLORE offers and suggesting entry points (e.g., "Start with common questions" or "Explore by topic"). No account creation, no identity assumptions. |
| **Status** | ⏳ Pending approval |

---

### Q-3: Should users be able to switch modes freely?

| Field | Value |
|-------|-------|
| **Question** | Should users be able to switch between NOOR, FAHM, and EXPLORE modes freely, or should mode selection be permanent? |
| **Current Evidence** | No mode-switching implementation exists. Original PRD v2.0 onboarding offered three choices but did not specify whether the choice was permanent. |
| **Product Implications** | Free switching allows users to explore different experiences (e.g., a Muslim might want to see what EXPLORE offers). Permanent selection simplifies navigation but may trap users in a mode that doesn't fit their needs. |
| **Technical Implications** | Free switching requires a mode selector in the UI and logic to preserve user context across switches. Permanent selection is simpler but less flexible. |
| **Risks** | Free switching adds UI complexity. Permanent selection may frustrate users who want to explore other modes. |
| **Recommended Option** | Free switching with a mode selector in the navigation. Store the last-selected mode locally but allow users to change it at any time. Do not make mode selection a permanent identity label. |
| **Status** | ⏳ Pending approval |

---

### Q-4: Should FAHM retain all existing study tools?

| Field | Value |
|-------|-------|
| **Question** | Should FAHM retain all existing study tools (bookmarks, notes, collections, study journeys, word-by-word study, root discovery) by default? |
| **Current Evidence** | All these tools are implemented and working in the current product. No proposal to remove them. |
| **Product Implications** | Retaining all tools preserves functionality and avoids disrupting existing users. Removing tools would require justification and migration planning. |
| **Technical Implications** | Retaining tools requires no changes. Removing tools requires code changes and data migration. |
| **Risks** | None — retaining tools is the conservative choice. |
| **Recommended Option** | Retain all existing study tools in FAHM. They align with FAHM's purpose (deep Quran study and personal learning). |
| **Status** | ⏳ Pending approval |

---

### Q-5: Which original features remain strategically important?

| Field | Value |
|-------|-------|
| **Question** | Which original PRD v2.0 features remain strategically important: Hifz (memorization), Namaz companion, personal journal, and Quran knowledge graph? |
| **Current Evidence** | None of these features are implemented in the current product. Original PRD v2.0 described them but PRD v4.1 deferred them. |
| **Product Implications** | Each feature serves a different purpose: Hifz supports memorization, Namaz companion supports prayer, journal supports reflection, knowledge graph supports exploration. Prioritization depends on user needs and strategic goals. |
| **Technical Implications** | Each feature requires significant implementation effort. Hifz requires spaced repetition logic. Namaz companion requires prayer-time integration. Journal requires rich text editing. Knowledge graph requires graph visualization. |
| **Risks** | Implementing all features simultaneously would delay other work. Deferring all features may miss opportunities to serve user needs. |
| **Recommended Option** | Prioritize based on user research. If no user research exists, defer all four features until FAHM is fully refined and user feedback indicates which features are most needed. |
| **Status** | ⏳ Pending approval |

---

### Q-6: Should mode preference be stored locally?

| Field | Value |
|-------|-------|
| **Question** | Should the user's last-selected mode be stored locally (localStorage), or should they choose each time? |
| **Current Evidence** | No mode preference storage exists (modes not yet implemented). Current product uses localStorage for other preferences (bookmarks, notes, journey progress). |
| **Product Implications** | Local storage reduces friction (users don't re-select mode each visit). No storage requires mode selection each visit, which may frustrate returning users. |
| **Technical Implications** | Local storage is simple to implement (one localStorage key). No storage requires no implementation. |
| **Risks** | Local storage may persist a mode choice the user no longer wants. However, this is mitigated by allowing free switching (Q-3). |
| **Recommended Option** | Store last-selected mode locally. Allow users to change it at any time. Do not treat it as a permanent identity label. |
| **Status** | ⏳ Pending approval |

---

### Q-7: Which age groups and parental controls should NOOR support at launch?

| Field | Value |
|-------|-------|
| **Question** | What age groups should NOOR target at launch (e.g., 3-6, 7-12), and what parental controls should be available (e.g., progress tracking, content filtering, time limits)? |
| **Current Evidence** | Original PRD v2.0 specifies ages 3-12 but does not break this into sub-groups. No parental controls are specified. |
| **Product Implications** | Age 3-6 requires different interaction models than age 7-12 (e.g., more audio/visual, less text). Parental controls add complexity but may be necessary for child safety and parent comfort. |
| **Technical Implications** | Supporting multiple age groups requires adaptive UI and content. Parental controls require a parent dashboard, settings storage, and possibly time-tracking logic. |
| **Risks** | Supporting too broad an age range at launch may dilute the experience. Parental controls add significant implementation effort. |
| **Recommended Option** | Launch with a single age group (e.g., 7-12) to validate the concept. Add parental controls incrementally based on user feedback. Expand to younger age groups in future releases. |
| **Status** | ⏳ Pending approval |

---

## Summary

### Decisions — Approved (November 11, 2026)
- **D-01 through D-08:** ✅ APPROVED
- **D-09 and D-10:** ✅ CONFIRMED — EXISTING CONSTRAINTS

### Open Questions Requiring Decisions
- Q-1 through Q-7: All pending stakeholder approval

### Authorization Boundary
- **Architecture direction:** Approved
- **Implementation authorization:** Not granted
- **NOOR implementation:** Blocked pending child-safety specification (D-07)
- **EXPLORE implementation:** Not authorized
- **FAHM implementation changes:** Not authorized
- **Sprint 55:** Not started or authorized
- **Deployment:** Not authorized

### Next Steps
1. ~~Review this register with stakeholders~~ ✅ Complete
2. ~~Obtain explicit approval for each decision~~ ✅ Complete (D-01 through D-10)
3. Resolve open questions (Q-1 through Q-7)
4. Proceed to detailed specifications (Phase B through E)
5. Present detailed specifications for stakeholder approval before implementation planning

---

**Document Status:** Approved — D-01 through D-08 approved; D-09 and D-10 confirmed; Q-1 through Q-7 pending  
**Stakeholder decision date:** November 11, 2026  
**No implementation authorized based on this document alone.**
