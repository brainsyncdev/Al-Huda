# WS-B: Governance & Credentialing — Consolidated Summary

**Status:** Design Proposal (research only — no production schema or data modified)
**Module:** MFD-12.1 Governance & Credentialing
**Date:** 2026-11-21
**Author:** WS-B (Governance & Credentialing Specification)
**proposedBy:** ai-assisted | **reviewStatus:** pending-scholarly-review

---

## 1. Overview

This document consolidates the five governance specifications produced by WS-B for MFD-12.1. These specifications address the unresolved questions identified in MFD-12-REVIEW-WORKFLOW-SPEC §12 and MFD-12-CANONICAL-DATA-MODEL §7 regarding reviewer identity, quorum, expiry, enforcement, and hadith integration.

**No production data or source code has been modified.** All outputs are design proposals requiring scholarly review before implementation.

---

## 2. Specifications Produced

| # | Document | Question Addressed | Key Decision |
|---|----------|-------------------|--------------|
| 1 | [WS-B-REVIEWER-CREDENTIALING-SPEC.md](./WS-B-REVIEWER-CREDENTIALING-SPEC.md) | Q34: Reviewer identity credentialing | Standalone ReviewerIdentity entity with scoped authority, domain expertise, and authorization chains |
| 2 | [WS-B-QUORUM-POLICY-SPEC.md](./WS-B-QUORUM-POLICY-SPEC.md) | Q35: Multi-reviewer quorum | Category-based quorum tiers (T1–T4) with tradition diversity requirements for creedal/legal claims |
| 3 | [WS-B-APPROVAL-EXPIRY-POLICY.md](./WS-B-APPROVAL-EXPIRY-POLICY.md) | Q36: Temporal expiry | Per-decision expiry with category defaults; classical = permanent; contemporary = 5–10 years; re-affirmation via ENDORSE |
| 4 | [WS-B-REVIEW-ENFORCEMENT-SPEC.md](./WS-B-REVIEW-ENFORCEMENT-SPEC.md) | Q28: Append-only enforcement | Three-layer defense-in-depth: application middleware (universal) + DB constraints (SQL) + CRDT merge rules (local-first) |
| 5 | [WS-B-HADITH-INTEGRATION-SPEC.md](./WS-B-HADITH-INTEGRATION-SPEC.md) | Q26: Hadith integration | Dedicated HadithReport entity with matn, isnād summary, multi-scholar grading; EvidenceRecord references via hadithReportId |

---

## 3. Questions Resolved

| Original Question | Source | Resolution |
|------------------|--------|------------|
| Q34: What infrastructure is needed for reviewer identity? | REVIEW-WORKFLOW-SPEC §12 q1, EVIDENCE-MODEL §10 q8 | ReviewerIdentity entity with qualifications, domain expertise, authorization chains, and activation lifecycle |
| Q35: Should creedal claims require N-of-M consensus? | REVIEW-WORKFLOW-SPEC §12 q2 | Yes. T3 tier requires 3 approvers from ≥2 traditions for THEOLOGICAL/LEGAL claims. T4 requires all traditions in genuine DisagreementSets |
| Q36: Should approvals expire? | REVIEW-WORKFLOW-SPEC §12 q5 | Category-dependent. Classical = no expiry. Contemporary = 5–10 years. Re-affirmation via ENDORSE preserves append-only chain |
| Q28: How is append-only enforced? | CANONICAL-DATA-MODEL §7 q5 | Three-layer enforcement: middleware + DB triggers + CRDT merge rules. Six invariants validated at write time |
| Q26: Is Source.type=HADITH_COLLECTION sufficient? | CANONICAL-DATA-MODEL §7 q3, EVIDENCE-MODEL §10 q1 | No. Dedicated HadithReport entity needed for isnād, per-hadith grading, and variants. Source remains bibliographic container |

---

## 4. New Entities Introduced

| Entity | ID Pattern | Mutability | Purpose |
|--------|-----------|------------|---------|
| ReviewerIdentity | `sch-{slug}` | Mutable (credentials/activation); decisions remain attributed | Scholar registration, scoped authority, qualification tracking |
| HadithReport | `hd-{uuid}` | Mutable (versioned); gradings append-friendly | Individual hadith with matn, isnād summary, multi-scholar grading |

### Entity Relationships Added

```
ReviewerIdentity ◀──── reviewerId ──── ReviewDecision
HadithReport     ◀─── hadithReportId ── EvidenceRecord
HadithReport     ─── variantOf ───────▶ HadithReport (self-ref)
HadithReport     ─── parallelReports ─▶ HadithReport[] (cross-collection)
ReviewerIdentity ─── authorizationChain ▶ ReviewerIdentity (authorizer)
```

---

## 5. Schema Extensions to Existing Entities

| Entity | Field Added | Type | Required | Purpose |
|--------|------------|------|----------|---------|
| ReviewDecision | `expiresAt` | datetime \| null | No | Temporal expiry timestamp |
| ReviewDecision | `expiryCategory` | enum | No | Policy category for expiry default |
| ReviewDecision | `reaffirmedCount` | integer | No | Re-affirmation tracking |
| ReviewDecision | `quorumTier` | enum | No | Denormalized quorum category cache |
| ReviewDecision | `supersededAt` | datetime | No | CRDT-compatible supersession timestamp |
| EvidenceRecord | `hadithReportId` | string | Conditional | Link to HadithReport when evidenceKind=HADITH_REPORT |

---

## 6. Integration Map

```
┌─────────────────────────────────────────────────────────┐
│                  MFD-12 GOVERNANCE LAYER                 │
│                                                         │
│  ReviewerIdentity ──► ReviewDecision ◄── Quorum Policy  │
│       │                      │                          │
│       │              ┌───────┴────────┐                 │
│       │              │                │                  │
│       ▼              ▼                ▼                  │
│  Authorization   Append-Only      Expiry                 │
│  Validator       Enforcement      Engine                 │
│       │              │                │                  │
│       │         ┌────┴────┐           │                  │
│       │         │         │           │                  │
│       ▼         ▼         ▼           ▼                  │
│   Scholarly  DB Triggers  CRDT    Publication            │
│   Claim      (SQL)       Merge    Gates                  │
│       │                              │                   │
│       ▼                              ▼                   │
│  HadithReport ◄── EvidenceRecord ──► Display             │
│                                      Filter              │
└─────────────────────────────────────────────────────────┘
```

---

## 7. Implementation Prerequisites Summary

| Prerequisite | Blocking For | Status |
|-------------|-------------|--------|
| Storage adapter interface | Enforcement, all entities | ❌ Pending |
| SQL schema for new entities | SQL backend deployment | ❌ Pending |
| CRDT library selection | Local-first backend | ❌ Pending |
| Initial reviewer bootstrap process | First SCHOLARLY decisions | ❌ Pending |
| Privacy policy for reviewer PII | ReviewerIdentity deployment | ❌ Pending |
| Tag system for claims | Quorum tier assignment | ❌ Pending |
| Notification system | Expiry re-affirmation | ❌ Pending |
| Hadith collection ingestion | HadithReport population | ❌ Pending |
| Hybrid logical clock | CRDT supersession ordering | ❌ Pending |
| Integration test suite | All enforcement invariants | ❌ Pending |

---

## 8. Dependencies on Other Workstreams

| Dependency | Source | Status |
|-----------|--------|--------|
| ReviewDecision base schema | WS1 (CANONICAL-DATA-MODEL §4P) | ✅ Defined |
| Review scope enum | WS4 (REVIEW-WORKFLOW-SPEC §2) | ✅ Defined |
| Claim type enum | WS1 (CANONICAL-DATA-MODEL §4O) | ✅ Defined |
| EvidenceRecord.evidenceKind | WS4 (EVIDENCE-MODEL §3) | ✅ Defined |
| Source.sourceType | WS4 (SOURCE-REGISTRY-SPEC §2) | ✅ Defined |
| ReferenceLocator schema | WS4 (SOURCE-REGISTRY-SPEC §4) | ✅ Defined |
| DisagreementSet.isGenuine | WS4 (EVIDENCE-MODEL §7.2) | ✅ Defined |
| Publication gates framework | WS4 (REVIEW-WORKFLOW-SPEC §8) | ✅ Defined |
| Batch atomicity mechanism | WS4 (REVIEW-WORKFLOW-SPEC §12 q3) | ❌ Unresolved |

---

## 9. Risks and Open Questions Remaining

| Risk/Question | Mitigation/Next Step |
|--------------|---------------------|
| Reviewer bootstrap: who authorizes the first scholars? | Define governance body charter before implementation |
| Small reviewer pool may bottleneck T3/T4 quorum | Start with T1/T2; activate T3/T4 when pool reaches critical mass |
| Hijri/Gregorian dual calendar for expiry dates | Select date library; specify conversion rules |
| Hadith grading vocabulary varies across traditions | Establish cross-tradition grading alignment table |
| CRDT post-merge validation may miss transient violations | Add periodic full-chain audit sweep |
| ReviewerIdentity privacy vs. transparency tension | Privacy policy must define minimum disclosure standard |
| Expiry grace period may confuse users | UX research on expiry indicators before implementation |

---

## 10. Compliance Statement

All specifications in this workstream:
- ✅ Are research-only design proposals
- ✅ Modify no production data or source code
- ✅ Carry `proposedBy: ai-assisted` and `reviewStatus: pending-scholarly-review`
- ✅ Extend (never contradict) existing MFD-12 specifications
- ✅ Identify implementation prerequisites before build
- ✅ Map integration points to existing entities
- ✅ Preserve append-only invariants for governance records
- ✅ Respect the separation: verified ≠ supported ≠ approved

---

*End of Consolidated Summary*
