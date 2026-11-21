# WS-B: Multi-Reviewer Quorum Policy Specification

**Status:** Design Proposal (research only — no production schema or data modified)
**Module:** MFD-12.1 Governance & Credentialing
**Date:** 2026-11-21
**Extends:** MFD-12-REVIEW-WORKFLOW-SPEC §4.3, §12 q2
**Depends on:** WS-B-REVIEWER-CREDENTIALING-SPEC, MFD-12-EVIDENCE-MODEL §6
**proposedBy:** ai-assisted | **reviewStatus:** pending-scholarly-review

---

## 1. Requirements Analysis

### 1.1 What the architecture needs

MFD-12-REVIEW-WORKFLOW-SPEC §12 q2 asks: "Does a single SCHOLAR APPROVE suffice, or should certain entity types (e.g., creedal claims) require N-of-M reviewer consensus?"

The batch reviews demonstrate that single-reviewer approval is insufficient for high-stakes claims:
- BATCH1 found tawheed-evidence imposed kalām epistemology — a single reviewer might miss this if they share the same tradition
- BATCH2 found ḥikmah conflation across four distinct senses — requires multi-tradition awareness
- BATCH7 identified missing verses despite thorough review — completeness benefits from independent verification

### 1.2 Functional requirements

| ID | Requirement |
|----|-------------|
| QP-F1 | Define quorum rules by claim category |
| QP-F2 | Single-reviewer approval sufficient for low-risk categories |
| QP-F3 | Multi-reviewer quorum required for creedal, legal, and contested claims |
| QP-F4 | Quorum computation must be deterministic and auditable |
| QP-F5 | Dissenting opinions count toward quorum participation but not approval |
| QP-F6 | Quorum unmet → entity remains PENDING_SCHOLARLY_REVIEW |
| QP-F7 | Support both synchronous (batch) and asynchronous (rolling) quorum accumulation |

---

## 2. Design Options

### Option A: Uniform Single-Reviewer Approval

Every SCHOLARLY APPROVE immediately sets reviewStatus to APPROVED.

**Pros:** Simple; fast throughput; matches current implicit behavior.
**Cons:** No protection against individual blind spots; contradicts batch review findings; no mechanism for high-stakes scrutiny.

**Verdict:** Rejected. Insufficient for creedal/legal domains.

### Option B: Category-Based Quorum Tiers (Recommended)

Define quorum tiers based on claim sensitivity. Low-risk claims need 1 approval; medium-risk need 2; high-risk need 3+ with tradition diversity.

**Pros:** Proportional scrutiny; matches scholarly practice; allows efficient processing of routine items while protecting sensitive ones.
**Cons:** More complex policy; requires claim categorization upfront; tradition-diversity requirement may bottleneck small communities.

**Verdict:** Recommended.

### Option C: Universal N-of-M Consensus

All claims require N≥2 approvals regardless of category.

**Pros:** Maximum safety; uniform rule.
**Cons:** Throughput bottleneck; over-scrutinizes routine lexical/taxonomic work; impractical for early-stage content with limited reviewer pool.

**Verdict:** Rejected. Disproportionate cost for low-risk content.

---

## 3. Recommended Specification: Category-Based Quorum Tiers

### 3.1 Quorum Tier Definitions

| Tier | Claim Categories | Min Approvers | Tradition Diversity | Additional Requirements |
|------|-----------------|---------------|--------------------|------------------------|
| T1 — Standard | LINGUISTIC, MORPHOLOGICAL, TAXONOMIC, HISTORICAL | 1 | None | Single SCHOLAR APPROVE at current contentVersion |
| T2 — Interpretive | SEMANTIC (non-creedal), contextual tafsir mappings | 2 | Preferred but not required | Two independent SCHOLAR APPROVE or one APPROVE + one ENDORSE |
| T3 — Creedal/Legal | THEOLOGICAL (aqeedah), LEGAL (fiqh rulings), claims about divine attributes, prophetic infallibility, halal/haram determinations | 3 | Required: ≥2 distinct traditions represented | Three SCHOLAR APPROVE from reviewers with different `domainExpertise.traditions`; any CONTRADICTS ClaimSupport triggers FLAG_FOR_DISCUSSION regardless of approval count |
| T4 — Contested | Claims inside an active DisagreementSet with `isGenuine: true` | All participating traditions | Mandatory | Each tradition represented in the DisagreementSet must have at least one reviewer approve their tradition's position before ANY position displays as approved |

### 3.2 Claim Category Assignment

Categories are determined by `ScholarlyClaim.claimType` plus explicit tagging:

```text
function getQuorumTier(claim):
    if claim.claimType == "THEOLOGICAL" or claim.tags contains "aqeedah":
        return T3
    if claim.claimType == "LEGAL" or claim.tags contains "fiqh-ruling":
        return T3
    if claim.subjectEntityId is member of any DisagreementSet where isGenuine == true:
        return T4
    if claim.claimType == "SEMANTIC":
        return T2
    return T1
```

### 3.3 Quorum Computation Algorithm

```text
function isQuorumMet(claimId):
    tier = getQuorumTier(claim)
    currentVersion = getEntity(claimId).contentVersion
    
    // Get all effective SCHOLARLY APPROVE/ENDORSE decisions at current version
    decisions = query(ReviewDecision)
        .where(targetEntityId = claimId)
        .where(reviewScope = 'SCHOLARLY')
        .where(decision IN ('APPROVE', 'ENDORSE'))
        .where(targetContentVersion = currentVersion)
        .where(NOT superseded)
    
    approvers = decisions.map(d => resolveReviewer(d.reviewerId))
    
    switch tier:
        case T1:
            return approvers.filter(a => a.decision == 'APPROVE').length >= 1
        case T2:
            approves = approvers.filter(a => a.decision == 'APPROVE').length
            endorses = approvers.filter(a => a.decision == 'ENDORSE').length
            return approves >= 2 OR (approves >= 1 AND endorses >= 1)
        case T3:
            approves = approvers.filter(a => a.decision == 'APPROVE')
            if approves.length < 3: return false
            traditions = new Set(approvers.flatMap(a => a.reviewer.domainExpertise
                .filter(e => e.domain matches claim.domain)
                .flatMap(e => e.traditions)))
            return traditions.size >= 2
        case T4:
            // Each tradition in the DisagreementSet must have approval
            disSets = query(DisagreementSet).where(claimIds contains claimId).where(isGenuine == true)
            for dis in disSets:
                for tradition in dis.traditions:
                    hasApproval = approvers.some(a => 
                        a.reviewer.domainExpertise.traditions contains tradition
                    )
                    if !hasApproval: return false
            return true
```

### 3.4 Rolling vs Batch Quorum

| Mode | Description | Use Case |
|------|-------------|----------|
| Rolling | Decisions accumulate over time; quorum checked on each new decision | Ongoing review of individual submissions |
| Batch | All decisions submitted together in a ReviewBatch; quorum evaluated atomically | Scheduled batch review cycles (BATCH1–7 model) |

Both modes use the same quorum computation. Batch mode adds atomicity: either all decisions in the batch commit or none do (see REVIEW-WORKFLOW-SPEC §12 q3).

### 3.5 Dissent Handling

- A REJECT or REQUEST_REVISION decision does NOT count toward quorum
- A dissenting decision triggers FLAG_FOR_DISCUSSION if quorum would otherwise be met
- In T3/T4, dissent from a tradition not yet represented does NOT block other traditions' approvals but DOES prevent the dissented position from displaying as consensus
- Dissenting decisions are always preserved in the audit chain

---

## 4. Integration Points

| Existing Entity | Integration |
|----------------|-------------|
| ReviewDecision | Quorum computed from effective decisions; new field `quorumTier` recommended as denormalized cache |
| ScholarlyClaim | `claimType` drives tier assignment; add optional `quorumOverride` for exceptional cases |
| DisagreementSet | `isGenuine: true` elevates to T4; traditions list defines required representation |
| ReviewerIdentity | `domainExpertise.traditions` used for T3/T4 diversity check |
| ReviewBatch | Batch atomicity interacts with quorum; partial batch failure returns all to PENDING |
| Publication Gates (§8 of REVIEW-WORKFLOW-SPEC) | Quorum met is added as a gate condition alongside existing gates |

---

## 5. Implementation Prerequisites

| Prerequisite | Status | Owner |
|-------------|--------|-------|
| ReviewerIdentity entity with domainExpertise.traditions | ⏳ Specified in WS-B-REVIEWER-CREDENTIALING-SPEC | WS-B |
| DisagreementSet.isGenuine field | ✅ Defined in EVIDENCE-MODEL §7.2 | WS4 |
| ScholarlyClaim.claimType enum | ✅ Defined in CANONICAL-DATA-MODEL §4O | WS1 |
| ReviewDecision supersession tracking | ✅ Defined in REVIEW-WORKFLOW-SPEC §5 | WS4 |
| Tag system for claims (aqeedah/fiqh markers) | ❌ Pending | WS1/Editorial |
| Batch atomicity mechanism | ❌ Pending (REVIEW-WORKFLOW-SPEC §12 q3) | Infrastructure |

---

*End of Specification*
