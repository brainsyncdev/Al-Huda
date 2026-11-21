# WS3: Approval Expiry Checking Service Specification

**Status:** Design Proposal (research only — no production code modified)
**Module:** MFD-12.2 Governance Infrastructure Planning
**Date:** 2026-11-21
**Extends:** WS-B-APPROVAL-EXPIRY-POLICY §3
**Depends on:** WS3-ENFORCEMENT-MIDDLEWARE-SPEC.md, WS3-QUORUM-ALGORITHM.md
**proposedBy:** ai-assisted | **reviewStatus:** pending-review

---

## 1. Purpose

Define the runtime service that assigns expiry metadata at decision-write time, monitors approaching/passed expiries, enforces the 90-day grace period at the publication gate, and drives re-affirmation. The service is local-first compatible: it must function fully offline with an injectable clock and no server dependency (RC-NF2 analog).

### 1.1 Non-goals

- Does NOT delete or modify any ReviewDecision (append-only invariant is absolute)
- Does NOT judge scholarly validity — expiry is a scheduling mechanism, not a verdict
- Does NOT handle RIGHTS license expiry (owned by RIGHTS scope; noted in WS-B §3.1 for completeness only)

---

## 2. Service Architecture

```text
┌────────────────────────────────────────────────────────────┐
│                     ExpiryService                           │
│                                                             │
│  ┌──────────────────┐   ┌──────────────────┐               │
│  │ ExpiryAssigner    │   │ ExpiryScanner     │              │
│  │ (write-path hook) │   │ (periodic sweep)  │              │
│  └────────┬─────────┘   └────────┬─────────┘               │
│           │                      │                          │
│  ┌────────▼──────────────────────▼─────────┐               │
│  │        ExpiryStateEvaluator (pure)       │              │
│  └────────┬──────────────────────┬─────────┘               │
│           │                      │                          │
│  ┌────────▼─────────┐   ┌────────▼─────────┐               │
│  │ PublicationGate   │   │ NotificationQueue │              │
│  │ predicate (read)  │   │ (local outbox)    │              │
│  └──────────────────┘   └──────────────────┘               │
└────────────────────────────────────────────────────────────┘
```

Four components, one shared pure evaluator. All state transitions of the *claim projection* go through the normal review-service write path; the ExpiryService itself only writes to its own scan-state store and notification outbox.

---

## 3. ExpiryAssigner (Write-Path Hook)

Runs inside Layer 1 pipeline AFTER SupersedeRationaleValidator, BEFORE storage write, for every APPROVE and re-affirming ENDORSE.

### 3.1 Category resolution

```text
function assignExpiry(decision, claim, sources, now, policy):
    if decision.expiryCategory == 'CUSTOM':
        require decision.expiresAt != null
        require decision.rationale documents override justification   // WS-B §3.6
        return decision unchanged

    category = resolveCategory(claim, sources)     // table §3.2
    decision.expiryCategory = category
    decision.expiresAt = switch category:
        CLASSICAL_PERMANENT  -> null
        CONTEMPORARY_5Y      -> now + 5 years
        INTERPRETIVE_10Y     -> now + 10 years
        LEGAL_MODERN_5Y      -> now + 5 years
        CREEDAL_MODERN_7Y    -> now + 7 years
    return decision
```

Assignment happens once, at insert. Because decisions are immutable, `expiresAt` can never be edited afterward — re-affirmation creates a NEW decision with a fresh window (EX-F5).

### 3.2 Category resolution table (from WS-B §3.1, made decidable)

Resolution inputs: claim.claimType, cited sources' publication dates, claim tags. Evaluated top-down; first match wins.

| Order | Condition | Category |
|-------|-----------|----------|
| 1 | claimType == LEGAL AND any cited source published ≥ 1900 CE | LEGAL_MODERN_5Y |
| 2 | claimType == THEOLOGICAL AND tag `modern-kalam` present OR any cited source ≥ 1900 CE | CREEDAL_MODERN_7Y |
| 3 | All cited scholarly sources published < 1900 CE (≙ 1318 AH) AND claimType IN (SEMANTIC, LINGUISTIC, MORPHOLOGICAL) with classical lexicon/tafsir sources | CLASSICAL_PERMANENT |
| 4 | Claim is explicit verse-mapping (tag `verse-mapping`, no interpretive layer) | CLASSICAL_PERMANENT |
| 5 | Tag `thematic-mapping` OR contextual tafsir mapping | INTERPRETIVE_10Y |
| 6 | Any cited source published ≥ 1900 CE | CONTEMPORARY_5Y |
| 7 | Fallback (undated sources, ambiguous) | INTERPRETIVE_10Y + warning `EXPIRY_CATEGORY_FALLBACK` |

Rules:
- The 1900 CE / 1318 AH boundary is evaluated on the SOURCE's composition/publication date, not the edition print date. A 1990 reprint of Ibn Kathir stays classical.
- Fallback (row 7) is deliberately conservative: unknown provenance gets a finite window, never permanence.
- Hijri/Gregorian conversion uses a dual-calendar library (prerequisite P-CAL); year arithmetic for windows is performed in Gregorian UTC, with Hijri equivalents stored for display only.

### 3.3 reaffirmedCount handling

`reaffirmedCount` is a derived projection, not a mutable counter on the immutable decision. The service computes it as the length of the ENDORSE chain rooted at the original APPROVE. The field proposed in WS-B §3.2 is retained in the schema as a denormalized cache maintained by the review service on the claim projection, rebuilt from the chain on demand.

---

## 4. ExpiryStateEvaluator (Pure Function)

```text
enum ExpiryState:
    NO_EXPIRY        // expiresAt == null
    ACTIVE           // now <= expiresAt
    GRACE            // expiresAt < now <= expiresAt + 90 days
    LAPSED           // now > expiresAt + 90 days

function evaluateExpiry(decision, now, graceDays = 90):
    if decision.expiresAt == null: return NO_EXPIRY
    if now <= decision.expiresAt:  return ACTIVE
    if now <= decision.expiresAt + graceDays: return GRACE
    return LAPSED
```

Boundary conventions (must be tested):
- Exactly at `expiresAt`: ACTIVE (expiry begins strictly after the instant)
- Exactly at `expiresAt + 90d`: GRACE (lapse begins strictly after)
- All comparisons in UTC; `now` injected, never read from system clock inside the evaluator

### 4.1 Entity-level aggregation

A claim's publication eligibility derives from its quorum-sustaining approvals (see WS3-QUORUM-ALGORITHM §4, filter F5):

```text
function claimExpiryState(claim, quorumApprovals, now):
    states = quorumApprovals.map(d => evaluateExpiry(d, now))
    if any state == LAPSED:  return LAPSED    // one lapsed pillar breaks quorum
    if any state == GRACE:   return GRACE
    if all state == NO_EXPIRY: return NO_EXPIRY
    return ACTIVE
```

Conservative rule: the WORST state among quorum-sustaining approvals governs the claim. A claim approved by three scholars where one approval lapses drops below T3 quorum and becomes ineligible even if two remain ACTIVE.

---

## 5. ExpiryScanner (Periodic Sweep)

### 5.1 Schedule and triggers

| Trigger | Behavior |
|---------|----------|
| Periodic | Every 24 h (configurable, min 1 h) while app runs; local timer, no server cron |
| On app start | Immediate catch-up scan (covers offline downtime; local-first requirement) |
| On clock jump | If injected/system time advances > 48 h since last scan, run immediately |
| On decision insert | Incremental scan of the affected claim only |

### 5.2 Scan algorithm

```text
function scan(now):
    for each claim with reviewStatus == 'APPROVED':
        approvals = current quorum-sustaining approvals (cached or recomputed)
        state = claimExpiryState(claim, approvals, now)
        prev  = scanState.get(claim.id)

        if state != prev:
            switch state:
                ACTIVE -> GRACE:
                    enqueueNotification(REVIEWERS_ELIGIBLE, 'APPROVAL_EXPIRING', claim)
                    setUiBadge(claim, 'expiring-soon', daysRemaining)
                GRACE -> LAPSED:
                    reviewService.transition(claim, 'PENDING_SCHOLARLY_REVIEW')  // EX-F4
                    enqueueNotification(REVIEWERS_ELIGIBLE, 'APPROVAL_LAPSED', claim)
                    invalidateQuorumCache(claim)                                 // WS3-QUORUM §6.1
                    // original decisions untouched (GR-4)
                LAPSED -> ACTIVE:
                    // happened via re-affirmation ENDORSE (GR-6)
                    reviewService.transition(claim, 'APPROVED')
                    clearUiBadge(claim)
            scanState.put(claim.id, state)
```

### 5.3 Idempotency and crash safety

- `scanState` is a small persisted key-value store `(claimId → lastState, lastScanAt)`
- Notifications use a local outbox with dedupe key `(claimId, transitionKind, expiresAt)` — a crash between transition and notification never produces duplicates on replay
- Transitions are idempotent: requesting PENDING_SCHOLARLY_REVIEW on an already-pending claim is a no-op
- Offline devices converge: each device scans independently; because transitions are idempotent projections of immutable decisions, concurrent scans on two devices cannot corrupt state (CRDT-safe)

### 5.4 Notification targets

"Eligible reviewers" = active ReviewerIdentity records authorized for SCHOLARLY scope whose domainExpertise matches the claim domain (same predicate as the authorization validator). Notifications are advisory; the system never auto-creates ENDORSE decisions.

---

## 6. Publication Gate Predicate

Added to the existing gates (REVIEW-WORKFLOW §8) as a pure read-time check — belt-and-braces alongside the scanner, so a stale scan never publishes lapsed content:

```text
function expiryGatePasses(claim, now):
    approvals = quorumSustainingApprovals(claim)     // already excludes LAPSED (F5)
    if approvals is empty: return false
    return claimExpiryState(claim, approvals, now) IN (NO_EXPIRY, ACTIVE, GRACE)
```

| Gate result | Presentation |
|-------------|--------------|
| NO_EXPIRY / ACTIVE | Normal display |
| GRACE | Normal display + "approval expiring soon" badge (GR-2) |
| LAPSED or empty | Excluded from publication queries (GR-3); data retained (GR-4) |

---

## 7. Re-affirmation Flow

```text
1. Reviewer opens expiring/lapsed claim from notification or queue
2. UI presents original APPROVE + rationale + current claim content (at current contentVersion)
3. Reviewer submits ENDORSE:
     priorDecisionId  = original APPROVE id (or latest ENDORSE in its chain)
     decision         = 'ENDORSE'
     rationale        = confirmation of continued validity (non-empty)
     targetContentVersion = claim.contentVersion
     expiryCategory / expiresAt = freshly assigned by ExpiryAssigner (§3)
4. Full Layer 1 pipeline runs (authorization identical to original approval — WS-B §3.4)
5. Quorum recomputed; if the ENDORSE restores/maintains quorum:
     claim stays or returns to APPROVED (GR-5 / GR-6)
6. Original APPROVE untouched; chain grows by one node
```

Constraints:
- Re-affirmation of a version-stale approval is impossible: F2 rejects the ENDORSE if contentVersion moved; a fresh full review is required instead
- For T3/T4 claims, re-affirmation must restore the FULL tier requirement (count + diversity), not merely replace one vote — the quorum algorithm enforces this automatically
- An ENDORSE may itself expire; chains therefore carry a rolling window, and `isValidEndorse` (WS3-QUORUM §4.2) walks to the root APPROVE for validation while F5 checks the ENDORSE's own expiry

---

## 8. Configuration

```jsonc
{
  "expiry": {
    "graceDays": 90,                    // GR-1; governance-approved changes only
    "scanIntervalHours": 24,
    "minScanIntervalHours": 1,
    "clockJumpThresholdHours": 48,
    "categoryDefaults": {               // years; null = permanent
      "CLASSICAL_PERMANENT": null,
      "CONTEMPORARY_5Y": 5,
      "INTERPRETIVE_10Y": 10,
      "LEGAL_MODERN_5Y": 5,
      "CREEDAL_MODERN_7Y": 7
    },
    "classicalBoundaryYearCE": 1900,
    "allowCustomOverride": true         // requires rationale; audited
  }
}
```

All durations are policy values, not code constants; changing them is a governance action recorded in the audit log. Existing decisions keep their originally assigned `expiresAt` — policy changes apply only to future assignments (no retroactive expiry).

---

## 9. Error Codes

| Code | When |
|------|------|
| `EXPIRY_CUSTOM_REQUIRES_DATE` | expiryCategory CUSTOM without expiresAt |
| `EXPIRY_CUSTOM_REQUIRES_RATIONALE` | CUSTOM override without justification in rationale |
| `EXPIRY_CATEGORY_FALLBACK` (warning) | Undated/ambiguous sources; conservative default applied |
| `REAFFIRM_VERSION_STALE` | ENDORSE targets approval whose contentVersion no longer current |
| `REAFFIRM_UNAUTHORIZED` | Re-affirming reviewer fails same authorization as original |

---

## 10. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| EA-1 | All TC-EXP-* cases in WS3-PERMISSION-TEST-CASES pass with injected clock |
| EA-2 | Boundary tests at exactly expiresAt and expiresAt+90d behave per §4 |
| EA-3 | Scanner is idempotent: double scan produces one transition and one notification |
| EA-4 | Offline catch-up: device offline 120 days correctly lapses approvals on next start |
| EA-5 | No code path mutates or deletes a ReviewDecision (verified by Layer 2/3 tests) |
| EA-6 | Publication gate independently blocks LAPSED claims even with scanner disabled |
| EA-7 | Policy change does not alter expiresAt of any existing decision |

---

*End of Specification*
