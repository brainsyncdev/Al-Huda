# WS3: Quorum Computation Algorithm Specification

**Status:** Design Proposal (research only — no production code modified)
**Module:** MFD-12.2 Governance Infrastructure Planning
**Date:** 2026-11-21
**Extends:** WS-B-QUORUM-POLICY-SPEC §3.2–§3.5
**Depends on:** WS3-REVIEWER-IDENTITY-SCHEMA.json, WS3-ENFORCEMENT-MIDDLEWARE-SPEC.md, WS3-EXPIRY-SERVICE-SPEC.md
**proposedBy:** ai-assisted | **reviewStatus:** pending-review

---

## 1. Purpose and Scope

This document turns the tier policy of WS-B-QUORUM-POLICY-SPEC into an implementation-ready algorithm: exact inputs, deterministic ordering, edge-case handling, output contract, and complexity bounds. It is a pure computation specification — the algorithm never writes decisions; it only reads effective decisions and returns a verdict plus an audit trace.

### 1.1 Design corrections relative to WS-B §3.3

The WS-B pseudocode is directionally correct but has four gaps this spec closes:

| Gap in WS-B §3.3 | Correction here |
|------------------|-----------------|
| Tier precedence puts T4 check after T3, so a THEOLOGICAL claim inside a genuine DisagreementSet would be evaluated as T3 | T4 takes precedence over T3/T2 when the claim belongs to a genuine DisagreementSet (§3) |
| ENDORSE decisions counted without checking they are re-affirmations of a live approval chain | ENDORSE counts only when its `priorDecisionId` chain roots at an APPROVE for the same target+version (§4.2) |
| Expired approvals still counted toward quorum | Decisions past expiry + grace period are excluded (§4.1 filter E4) |
| No defined behavior for duplicate reviewer decisions or deactivated reviewers mid-quorum | Deduplication by reviewer with latest-effective rule; deactivation does not retroactively remove decisions (§4.3) |

These corrections are proposals requiring scholarly sign-off; they tighten, never loosen, the WS-B policy.

---

## 2. Inputs and Output Contract

### 2.1 Inputs

```text
INPUTS:
  claim                : ScholarlyClaim (must include claimType, tags?, contentVersion, subjectEntityId)
  decisions            : ReviewDecision[] — all decisions where targetEntityId == claim.id
                         (caller may pre-filter; algorithm re-filters defensively)
  identities           : Map<reviewerId, ReviewerIdentity>
  disagreementSets     : DisagreementSet[] — sets containing claim.id or claim.subjectEntityId
  now                  : ISO-8601 timestamp (injectable clock; never read wall-clock internally)
  policy               : QuorumPolicyConfig (tier thresholds, grace days; defaults per WS-B §3.1)
```

### 2.2 Output

```text
OUTPUT QuorumResult:
  met              : boolean
  tier             : 'T1' | 'T2' | 'T3' | 'T4'
  requiredApprovals: integer          // tier threshold (T4: number of required traditions)
  countedApprovals : integer
  countedEndorses  : integer
  traditionsCovered: string[]         // sorted, deduplicated
  traditionsMissing: string[]         // T4 only; sorted
  dissentPresent   : boolean          // any effective REJECT / REQUEST_REVISION / FLAG_FOR_DISCUSSION
  flagForDiscussion: boolean          // true when dissent exists and numeric quorum otherwise met
  excludedDecisions: { id, reason }[] // every decision dropped by a filter, with reason code
  trace            : string[]         // ordered human-readable evaluation steps (audit trail)
```

Determinism requirement (QP-F4): identical inputs MUST produce byte-identical `QuorumResult`, including array ordering. All sets are sorted lexicographically before emission.

---

## 3. Tier Assignment (getQuorumTier)

```text
function getQuorumTier(claim, disagreementSets):
    genuineSets = disagreementSets.filter(ds => ds.isGenuine == true
        AND (claim.id IN ds.claimIds OR claim.subjectEntityId IN ds.claimIds))

    // CORRECTION C1: T4 has highest precedence — contested claims always
    // require per-tradition representation, even if creedal/legal.
    if genuineSets is not empty:
        return (T4, genuineSets)

    if claim.claimType == 'THEOLOGICAL' OR 'aqeedah' IN claim.tags:
        return (T3, [])
    if claim.claimType == 'LEGAL' OR 'fiqh-ruling' IN claim.tags:
        return (T3, [])
    if claim.claimType == 'SEMANTIC':
        return (T2, [])

    // LINGUISTIC, MORPHOLOGICAL, TAXONOMIC, HISTORICAL
    return (T1, [])
```

Notes:
- `claim.tags` is optional today (prerequisite P-TAGS); absent tags fall through to claimType-only rules.
- A `quorumOverride` field on ScholarlyClaim (WS-B §4) may raise but NEVER lower the computed tier. Lowering requires a governance amendment, not data.

---

## 4. Decision Filtering Pipeline

Every candidate decision passes filters F1–F6 in order. Each rejection appends `{id, reason}` to `excludedDecisions`.

```text
function effectiveApprovals(claim, decisions, identities, now, policy):
    result = []
    for d in decisions:
        // F1 — scope and target
        if d.reviewScope != 'SCHOLARLY':        exclude(d, 'WRONG_SCOPE');      continue
        if d.targetEntityId != claim.id:        exclude(d, 'WRONG_TARGET');     continue

        // F2 — version pin (EVIDENCE-MODEL §6.3)
        if d.targetContentVersion != claim.contentVersion:
                                                exclude(d, 'STALE_VERSION');    continue

        // F3 — supersession (REVIEW-WORKFLOW §5)
        if d.supersededAt != null:              exclude(d, 'SUPERSEDED');       continue

        // F4 — decision kind
        if d.decision NOT IN ('APPROVE', 'ENDORSE'):
                                                exclude(d, 'NOT_APPROVAL');     continue

        // F5 — temporal validity (CORRECTION C3; see WS3-EXPIRY-SERVICE-SPEC)
        if d.expiresAt != null AND now > d.expiresAt + policy.graceDays:
                                                exclude(d, 'EXPIRED');          continue

        // F6 — identity resolvable
        reviewer = identities.get(d.reviewerId)
        if reviewer == null:                    exclude(d, 'UNKNOWN_REVIEWER'); continue

        result.append({ decision: d, reviewer: reviewer })
    return result
```

### 4.1 Filter rationale table

| Filter | Reason code | Policy source |
|--------|-------------|---------------|
| F1 | WRONG_SCOPE / WRONG_TARGET | WS-B §3.3 query shape |
| F2 | STALE_VERSION | Version-pinned approval, REVIEW-WORKFLOW §3.2 |
| F3 | SUPERSEDED | Append-only supersession, EN-F5 |
| F4 | NOT_APPROVAL | QP-F5: dissent participates but never approves |
| F5 | EXPIRED | EX-F4 + GR-3: past-grace approvals cannot sustain publication |
| F6 | UNKNOWN_REVIEWER | Fail-closed: unresolvable identity never counts |

Note on F5 vs AUTH-6: deactivation of a reviewer (`activeUntil` in the past) does NOT exclude their decisions — authority is checked at decision-write time only. Expiry (F5) is a property of the decision, not the reviewer, so it DOES exclude.

### 4.2 ENDORSE validation (CORRECTION C2)

```text
function isValidEndorse(entry, allDecisions, claim):
    // An ENDORSE counts only as re-affirmation of an APPROVE chain
    // for the same target at the same contentVersion.
    cursor = entry.decision
    visited = {}
    while cursor.priorDecisionId != null:
        if cursor.id IN visited: return false          // cycle → fail closed
        visited.add(cursor.id)
        cursor = allDecisions.get(cursor.priorDecisionId)
        if cursor == null: return false                // dangling ref → fail closed
    return cursor.decision == 'APPROVE'
       AND cursor.targetEntityId == claim.id
       AND cursor.targetContentVersion == claim.contentVersion
```

A bare ENDORSE with no `priorDecisionId` is excluded with reason `ORPHAN_ENDORSE`. This prevents ENDORSE from being used to bootstrap approval without an original APPROVE.

### 4.3 Deduplication by reviewer

```text
function dedupeByReviewer(entries):
    // One counted vote per reviewer. If a reviewer has multiple effective
    // APPROVE/ENDORSE entries (possible across CRDT replicas), keep the one
    // with the greatest decidedAt (HLC); ties broken by lexicographic id.
    grouped = groupBy(entries, e => e.decision.reviewerId)
    return [ max(group, key = (decidedAt, id)) for each group ]
```

Rationale: quorum measures independent scholarly judgments (QP-F3), not decision volume. A reviewer approving twice must not satisfy a 2-of-N tier alone.

---

## 5. Main Algorithm

```text
function computeQuorum(claim, decisions, identities, disagreementSets, now, policy):
    trace = []
    (tier, genuineSets) = getQuorumTier(claim, disagreementSets)
    trace.append("tier=" + tier)

    candidates = effectiveApprovals(claim, decisions, identities, now, policy)

    // Split APPROVE vs validated ENDORSE, then dedupe per reviewer
    approvesRaw = candidates.filter(e => e.decision.decision == 'APPROVE')
    endorsesRaw = candidates.filter(e => e.decision.decision == 'ENDORSE'
                                     AND isValidEndorse(e, indexById(decisions), claim))
    approves = dedupeByReviewer(approvesRaw)
    endorses = dedupeByReviewer(endorsesRaw)
    // A reviewer already counted as APPROVE cannot also count as ENDORSE
    endorses = endorses.filter(e => e.decision.reviewerId NOT IN ids(approves))

    // Dissent detection across ALL effective decisions at current version
    dissent = decisions.any(d => d.reviewScope == 'SCHOLARLY'
        AND d.targetEntityId == claim.id
        AND d.targetContentVersion == claim.contentVersion
        AND d.supersededAt == null
        AND d.decision IN ('REJECT', 'REQUEST_REVISION', 'FLAG_FOR_DISCUSSION'))

    switch tier:

        case T1:
            met = len(approves) >= 1

        case T2:
            met = len(approves) >= 2
               OR (len(approves) >= 1 AND len(endorses) >= 1)

        case T3:
            if len(approves) < 3:
                met = false
            else:
                // Traditions drawn ONLY from approvers' expertise matching
                // the claim's domain (not from endorsers or dissenters).
                domain = domainForClaimType(claim.claimType)   // §5.1
                traditions = sortedUnique(
                    approves.flatMap(a => a.reviewer.domainExpertise
                        .filter(e => e.domain == domain)
                        .flatMap(e => e.traditions)))
                met = len(traditions) >= 2

        case T4:
            requiredTraditions = sortedUnique(
                genuineSets.flatMap(ds => ds.traditions))
            covered = []
            missing = []
            for t in requiredTraditions:
                // Per WS-B §3.1 T4: each tradition needs an APPROVE of its
                // own position; ENDORSE does not substitute here.
                if approves.any(a => traditionRepresented(a.reviewer, t)):
                    covered.append(t)
                else:
                    missing.append(t)
            met = len(missing) == 0

    // Dissent override (QP-F5, WS-B §3.5):
    // numeric quorum + active dissent ⇒ flag, do not display consensus.
    flagForDiscussion = dissent AND met AND tier IN ('T3', 'T4')
    if tier == 'T3' AND hasContradictingClaimSupport(claim):
        flagForDiscussion = true       // WS-B T3 row: CONTRADICTS forces flag
        met = false

    return QuorumResult { met, tier, ...counts, traditionsCovered, traditionsMissing,
                          dissentPresent: dissent, flagForDiscussion,
                          excludedDecisions, trace }
```

### 5.1 Claim-type → domain mapping

| claimType | Required domain in domainExpertise |
|-----------|-------------------------------------|
| THEOLOGICAL | AQEEDAH |
| LEGAL | FIQH |
| SEMANTIC | TAFSIR or LINGUISTICS or LEXICOGRAPHY (any) |
| LINGUISTIC / MORPHOLOGICAL | LINGUISTICS or LEXICOGRAPHY (any) |
| HISTORICAL | HISTORY or SEERAH (any) |
| TAXONOMIC | Any domain (editorial-scholarly joint scope) |
| Claims citing HADITH_REPORT evidence | Additionally require HADITH (per WS-B-HADITH-INTEGRATION-SPEC §4) |

`traditionRepresented(reviewer, t)` returns true iff any `domainExpertise` entry lists `t` in `traditions`. Tradition strings are compared after Unicode NFC normalization and case-folding; the canonical tradition vocabulary is a prerequisite (P-TRAD).

---

## 6. Rolling vs Batch Evaluation

| Mode | Trigger | Semantics |
|------|---------|-----------|
| Rolling | After each successful ReviewDecision INSERT | Recompute for the affected claim only; cache result keyed by `(claimId, contentVersion, decisionsHash)` |
| Batch | At ReviewBatch commit | Compute for every claim touched by the batch inside the batch transaction; if ANY claim's post-batch state violates an invariant, roll back the entire batch (atomicity per REVIEW-WORKFLOW §12 q3) |

Both modes call the identical `computeQuorum` function. Batch mode never uses partial results from an uncommitted batch.

### 6.1 Cache invalidation

The cached QuorumResult MUST be invalidated when any of these change:
1. New effective decision for the claim (insert or supersession)
2. `claim.contentVersion` increment
3. DisagreementSet membership or `isGenuine` change
4. An approval crosses its expiry + grace boundary (time-triggered; the expiry service emits this event — see WS3-EXPIRY-SERVICE-SPEC §5)

ReviewerIdentity credential edits do NOT invalidate cached quorums (authority was checked at write time), except edits to `domainExpertise.traditions`, which DO invalidate T3/T4 caches because diversity is computed from current identity data. This asymmetry is deliberate and must be documented in the implementation.

---

## 7. Status Transition Rules

```text
onQuorumResult(claim, result):
    if result.met AND NOT result.flagForDiscussion:
        claim.reviewStatus = 'APPROVED'          // via normal mutable-entity update path
    else if result.flagForDiscussion:
        claim.reviewStatus stays; emit FLAG_FOR_DISCUSSION workflow event
    else:
        claim.reviewStatus = 'PENDING_SCHOLARLY_REVIEW'   // QP-F6
```

The algorithm itself performs no writes; the review service applies transitions. `reviewStatus` on ScholarlyClaim is a mutable projection — the append-only decision chain remains the source of truth and can always rebuild it.

---

## 8. Complexity and Limits

| Aspect | Bound |
|--------|-------|
| Time | O(D + A·C) where D = decisions for claim, A = approvals, C = max chain depth (ENDORSE validation) |
| Chain walk cap | 1000 hops (matches AcyclicChainValidator); exceeding ⇒ fail closed, reason `CHAIN_TOO_DEEP` |
| Space | O(D) |
| Expected scale | D < 50 per claim; algorithm is safe to run synchronously on write path |

---

## 9. Worked Examples

### Example 1 — T3 satisfied

THEOLOGICAL claim v2. Approvals: sch-a (Hanafi, AQEEDAH), sch-b (Shafi'i, AQEEDAH), sch-c (Hanafi, AQEEDAH). All effective, unexpired, v2.
→ approves=3, traditions={hanafi, shafi'i} size 2 ⇒ **met=true**.

### Example 2 — T3 diversity failure

Same claim; all three approvers Hanafi only.
→ approves=3, traditions={hanafi} size 1 ⇒ **met=false**, trace records `T3_DIVERSITY_UNMET`.

### Example 3 — T4 precedence over T3

THEOLOGICAL claim inside genuine DisagreementSet {Ash'ari, Maturidi}. Three approvals, all Ash'ari.
→ tier=T4 (not T3); missing=[maturidi] ⇒ **met=false**. Under WS-B's original ordering this would have passed as T3 — correction C1 prevents that.

### Example 4 — ENDORSE cannot bootstrap

SEMANTIC claim; one ENDORSE with no priorDecisionId, zero APPROVEs.
→ ENDORSE excluded (`ORPHAN_ENDORSE`); approves=0 ⇒ **met=false**.

### Example 5 — Expiry removes a vote

T2 claim; APPROVE by sch-a expired 100 days ago (grace 90), APPROVE by sch-b live.
→ sch-a excluded (`EXPIRED`); approves=1, endorses=0 ⇒ **met=false**; expiry service should already have flagged the claim.

---

## 10. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| QA-1 | All TC-QRM-* cases in WS3-PERMISSION-TEST-CASES pass |
| QA-2 | Property test: adding a non-approval decision never flips met from false→true |
| QA-3 | Property test: removing any counted approval never flips met from false→true (monotonicity) |
| QA-4 | Determinism: shuffled input order yields identical QuorumResult bytes |
| QA-5 | Every excluded decision carries exactly one reason code |
| QA-6 | Injected clock: no direct wall-clock reads anywhere in the implementation |

---

*End of Specification*
