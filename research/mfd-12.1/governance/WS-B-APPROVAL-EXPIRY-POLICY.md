# WS-B: Scholarly Approval Expiry Policy

**Status:** Design Proposal (research only — no production schema or data modified)
**Module:** MFD-12.1 Governance & Credentialing
**Date:** 2026-11-21
**Extends:** MFD-12-REVIEW-WORKFLOW-SPEC §3.2, §12 q5
**Depends on:** MFD-12-EVIDENCE-MODEL §6.3 (version-pinned approval)
**proposedBy:** ai-assisted | **reviewStatus:** pending-scholarly-review

---

## 1. Requirements Analysis

### 1.1 What the architecture needs

MFD-12-REVIEW-WORKFLOW-SPEC §12 q5 asks: "Should a SCHOLARLY APPROVE have an expiration date requiring periodic re-affirmation, or is it valid indefinitely until superseded? Classical tafsir doesn't expire, but contemporary scholarship might."

Key observations from the batch reviews:
- Classical tafsir interpretations (Ibn Kathir, al-Jalalayn) represent established scholarly positions that do not decay over time
- Contemporary scholarship (modern tafsir, linguistic analysis) may be revised as methodologies evolve
- Source rights statuses DO change (licenses expire, disputes resolve) — already handled by RIGHTS scope
- Corpus re-pinning (quran-json version updates) already triggers re-verification via version-pinned approvals
- The existing version-pinning mechanism (§3.2) handles content drift but not interpretive staleness

### 1.2 Functional requirements

| ID | Requirement |
|----|-------------|
| EX-F1 | Define expiry policy by claim/evidence category |
| EX-F2 | Classical interpretations default to no expiry |
| EX-F3 | Contemporary scholarship carries configurable expiry |
| EX-F4 | Expiry returns entity to PENDING_SCHOLARLY_REVIEW without invalidating the historical decision |
| EX-F5 | Re-affirmation creates a new ENDORSE decision, not a modification of the original |
| EX-F6 | Expiry metadata stored on ReviewDecision, not globally |
| EX-F7 | Grace period before expired approval blocks publication |

---

## 2. Design Options

### Option A: No Temporal Expiry

Approvals are valid forever unless superseded or content-version invalidated.

**Pros:** Matches classical scholarly practice; zero maintenance burden; no risk of accidental content loss.
**Cons:** Contemporary scholarship may become stale; no mechanism for periodic quality assurance; assumes all knowledge is equally timeless.

**Verdict:** Partially adopted for classical content. Insufficient alone.

### Option B: Per-Decision Expiry with Category Defaults (Recommended)

Each ReviewDecision carries an optional `expiresAt` timestamp. Default expiry is determined by claim category. Expired approvals trigger re-review without deletion.

**Pros:** Granular; respects classical timelessness while addressing contemporary staleness; explicit and auditable; compatible with append-only model.
**Cons:** Adds complexity; requires category-based default policy; re-affirmation workflow needs definition.

**Verdict:** Recommended.

### Option C: Global Periodic Re-review Cycle

All approvals expire after N years regardless of category.

**Pros:** Simple; ensures nothing goes unexamined.
**Cons:** Wastes reviewer time on stable classical content; risks losing approved content to reviewer unavailability; contradicts scholarly norms for established interpretations.

**Verdict:** Rejected. Too blunt.

---

## 3. Recommended Specification: Per-Decision Expiry with Category Defaults

### 3.1 Expiry Policy by Category

| Category | Default Expiry | Rationale |
|----------|---------------|-----------|
| Classical tafsir interpretation (pre-1900 CE / pre-1318 AH) | No expiry | Established scholarly consensus; timeless within its tradition |
| Lexical/morphological analysis (classical sources) | No expiry | Rooted in canonical lexicons (Lisan al-Arab, Taj al-Arus) |
| Quranic verse mapping (explicit text) | No expiry | Direct textual reference does not decay |
| Thematic/contextual mapping | 10 years | Interpretive frameworks evolve; periodic reassessment beneficial |
| Contemporary scholarship (post-1900 CE) | 5 years | Active research area; methodologies and findings evolve |
| Legal/fiqh application to modern contexts | 5 years | Contemporary fatwa and application evolve with circumstances |
| Creedal claims using modern argumentation | 7 years | Modern kalām engages evolving philosophical landscape |
| Rights clearance | Per license terms | Already handled by RIGHTS scope; noted here for completeness |

### 3.2 Schema Extension: ReviewDecision

Add optional fields to ReviewDecision:

```jsonc
{
  "expiresAt": {
    "type": ["string", "null"],
    "format": "date-time",
    "description": "When this approval expires. null = no expiry. Defaults determined by claim category policy."
  },
  "expiryCategory": {
    "type": "string",
    "enum": ["CLASSICAL_PERMANENT", "CONTEMPORARY_5Y", "INTERPRETIVE_10Y", "LEGAL_MODERN_5Y", "CREEDAL_MODERN_7Y", "CUSTOM"],
    "description": "Policy category that determined expiresAt. CUSTOM means reviewer set explicit date."
  },
  "reaffirmedCount": {
    "type": "integer",
    "default": 0,
    "description": "Number of times this approval has been re-affirmed via ENDORSE decisions"
  }
}
```

### 3.3 Expiry Lifecycle

```
APPROVE (expiresAt: 2031-11-21)
    │
    ├── Before expiry: Normal APPROVED state
    │
    ├── At expiry (grace period starts):
    │   ├── Entity remains APPROVED for 90-day grace period
    │   ├── Notification sent to eligible reviewers
    │   └── UI shows "approval expiring soon" badge
    │
    ├── Grace period ends without re-affirmation:
    │   ├── Entity transitions to PENDING_SCHOLARLY_REVIEW
    │   ├── Original APPROVE decision preserved (NOT deleted)
    │   ├── Publication gate blocks display
    │   └── Queue for re-review
    │
    └── Re-affirmation received:
        ├── New ENDORSE decision created with priorDecisionId → original APPROVE
        ├── expiresAt reset per category default
        ├── reaffirmedCount incremented
        └── Entity remains APPROVED
```

### 3.4 Re-affirmation Mechanics

Re-affirmation is NOT a new APPROVE. It is an ENDORSE decision that:
1. References the expiring/expired APPROVE via `priorDecisionId`
2. Carries its own `expiresAt` based on current category policy
3. Includes rationale confirming continued validity
4. Must come from a reviewer meeting the same quorum requirements as the original

This preserves the append-only chain: the original decision is never modified; re-affirmation is a new node in the chain.

### 3.5 Grace Period Rules

| Rule | Description |
|------|-------------|
| GR-1 | Grace period is 90 days from `expiresAt` |
| GR-2 | During grace period, entity displays normally with visual indicator |
| GR-3 | After grace period, entity is excluded from publication queries |
| GR-4 | Data layer retains all records; only display/presentation is affected |
| GR-5 | Re-affirmation during grace period prevents publication interruption |
| GR-6 | Re-affirmation after grace period restores APPROVED status immediately |

### 3.6 Expiry Override

Reviewers may set `expiryCategory: CUSTOM` with an explicit `expiresAt` when:
- A specific claim warrants shorter/longer review cycle than category default
- External events (new manuscript discovery, scholarly controversy) warrant accelerated re-review
- Permanent approval is warranted for a contemporary claim that has achieved consensus

Override requires rationale documenting why the default is inappropriate.

---

## 4. Integration Points

| Existing Entity | Integration |
|----------------|-------------|
| ReviewDecision | Gains `expiresAt`, `expiryCategory`, `reaffirmedCount` fields |
| ScholarlyClaim | `claimType` + creation date determine default expiry category |
| Publication Gates | Add expiry check: `effectiveApproval.expiresAt == null OR effectiveApproval.expiresAt > now OR withinGracePeriod()` |
| Review Workflow §3.2 | Version-pinned approval and temporal expiry are orthogonal; both must be satisfied |
| ENDORSE decision type | Gains semantic role as re-affirmation vehicle |
| ReviewerIdentity | Re-affirmation requires same authorization as original approval |

---

## 5. Implementation Prerequisites

| Prerequisite | Status | Owner |
|-------------|--------|-------|
| ReviewDecision schema extension | ⏳ Proposed above | WS-B |
| Claim category → expiry mapping table | ⏳ Proposed in §3.1 | WS-B + Scholarly Advisory |
| Notification system for expiring approvals | ❌ Pending | Infrastructure |
| Grace period computation in publication query | ❌ Pending | WS4 |
| Re-affirmation workflow in review UI | ❌ Pending | UX/Frontend |
| Date arithmetic library (Hijri/Gregorian dual calendar) | ❌ Pending | Infrastructure |

---

*End of Specification*
