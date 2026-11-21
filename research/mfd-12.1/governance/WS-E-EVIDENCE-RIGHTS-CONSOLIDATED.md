# WS-E: Evidence & Rights Standards Consolidated Report (MFD-12.1)

**Status:** Proposed  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-scholarly-review  
**Date:** 2026-11-21  
**Module:** MFD-12.1 Evidence Governance Framework  
**Work Stream:** WS-E (Evidence & Rights Standards)

---

## Executive Summary

This consolidated report resolves four open questions from the MFD-12 programme dashboard regarding evidence and rights policy. Each question has been analyzed against current specifications, real-world implementation gaps, legal/scholarly/UX risks, and produced concrete schema recommendations.

**Key Findings:**
1. **Tanzil Proxy (Q30)**: Safe default is adequate BUT not currently enforced in production. Immediate enforcement required.
2. **Audio Rights (Q31)**: Current model conflates distribution and performer rights. Dual-rights schema extension needed.
3. **Community Threshold (Q32)**: Binary gate insufficient. Four-tier trust model recommended.
4. **Edition Variance (Q33)**: Two-level model sound but has enum asymmetry bug and missing derivative-works support.

**Total Schema Changes Proposed:** 12 field additions/modifications across Source, Edition, and EvidenceRecord entities.

---

## Policies Recommended

### P1: Tanzil Proxy Enforcement Policy
- **Directive**: All `rights-unverified` + `api-import` sources MUST enforce `linkOutOnly: true` at API layer.
- **Effective Date**: Immediate upon MFD-12.1 adoption.
- **Clearance Path**: Per-edition legal review via `ReviewDecision` queue.
- **Reference**: [WS-E-TANZIL-RIGHTS-POLICY.md](./WS-E-TANZIL-RIGHTS-POLICY.md)

### P2: Recitation Dual-Rights Policy
- **Directive**: All `sourceType: "recitation"` sources require both `distributionRightsStatus` and `performerRightsStatus`.
- **Default**: Playback gated until both layers verified.
- **Graceful Degradation**: Partial clearance allowed with prominent disclaimer.
- **Reference**: [WS-E-AUDIO-RIGHTS-POLICY.md](./WS-E-AUDIO-RIGHTS-POLICY.md)

### P3: Community Trust Tier Policy
- **Directive**: Four-tier model (UNVETTED → BASIC_VERIFIED → RIGHTS_ASSESSED → LEGAL_CLEARED).
- **Promotion**: Requires human verification at each tier; no automated promotion.
- **Demotion**: Triggered by contradictory evidence or rights-holder contact.
- **Reference**: [WS-E-COMMUNITY-SOURCE-THRESHOLD.md](./WS-E-COMMUNITY-SOURCE-THRESHOLD.md)

### P4: Edition Rights Variance Policy
- **Directive**: Fix enum asymmetry; clarify "most restrictive" as computed property; add derivative-works support.
- **Modeling Decision**: Translations confirmed as editions, not separate sources.
- **Computation**: Source `rightsStatus` auto-derived from editions; manual override requires justification.
- **Reference**: [WS-E-EDITION-RIGHTS-VARIANCE.md](./WS-E-EDITION-RIGHTS-VARIANCE.md)

---

## Schema Changes Specified

### Source Entity Modifications

| Field | Action | Purpose | Policy |
|-------|--------|---------|--------|
| `displayConstraints.proxyComplianceMode` | ADD | Explicit proxy enforcement tracking | P1 |
| `recitationRights` | ADD (conditional) | Dual-rights for audio sources | P2 |
| `trustTier` | ADD | Community contribution tier | P3 |
| `tierHistory` | ADD | Append-only tier transition log | P3 |
| `provenance.communitySubmissionMetadata` | ADD | Community submission context | P3 |
| `computedFromEditions` | ADD | Rights computation indicator | P4 |

### Edition Entity Modifications

| Field | Action | Purpose | Policy |
|-------|--------|---------|--------|
| `proxyEndpoint` | ADD | Audit proxied content source | P1 |
| `rightsOverride` enum | FIX | Add missing license values | P4 |
| `derivativeOfWork` | ADD | Link derivative editions to base | P4 |
| `editorialContributionType` | ADD | Classify editorial IP components | P4 |
| `componentRights` | ADD | Granular multi-component rights | P4 |

### EvidenceRecord Entity Modifications

| Field | Action | Purpose | Policy |
|-------|--------|---------|--------|
| `audioLocator` | ADD | Structured audio evidence reference | P2 |

---

## Risks Documented

### Legal Risks

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Tanzil proxy constitutes unauthorized redistribution | HIGH | Enforce `linkOutOnly` immediately | ACTION REQUIRED |
| Audio performer rights unverified | MEDIUM | Dual-rights schema + playback gating | SCHEMA PROPOSED |
| Community sources promoted without legal review | MEDIUM | Four-tier trust model | POLICY DEFINED |
| Edition rights inheritance errors | LOW-MEDIUM | Computed source rights + validation | SCHEMA FIX PROPOSED |

### Scholarly Risks

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Scholars cite legally unstable content | MEDIUM | Tier-based display restrictions | POLICY DEFINED |
| Audio misattribution undermines tajweed verification | MEDIUM | Performer identity verification requirement | SCHEMA PROPOSED |
| False consensus from premature rights clearance | LOW | Trust tier visibility + annual re-verification | POLICY DEFINED |
| Critical edition apparatus rights ignored | LOW | Component rights modeling | SCHEMA PROPOSED |

### User Experience Risks

| Risk | Severity | Mitigation | Status |
|------|----------|------------|--------|
| Link-out enforcement perceived as regression | MEDIUM | Transparent communication + clearance timeline | COMMUNICATION PLAN NEEDED |
| Audio player disabled during rights review | MEDIUM | Graceful degradation with partial clearance | POLICY DEFINED |
| Trust tier badges confuse users | LOW | Clear iconography + tooltip explanations | UI DESIGN NEEDED |
| Edition selector complexity increases | LOW | Progressive disclosure of rights details | UI DESIGN NEEDED |

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1-2)
1. Deploy Tanzil proxy enforcement middleware (P1)
2. Fix edition `rightsOverride` enum asymmetry (P4)
3. Add `recitationRights` schema validation (P2)

### Phase 2: Trust Infrastructure (Week 3-4)
1. Implement trust tier storage and computation (P3)
2. Build tier-aware display components (P3)
3. Create rights computation service for source-level aggregation (P4)

### Phase 3: Workflow Integration (Week 5-6)
1. Integrate tier promotions into ReviewDecision workflow (P3)
2. Build audio dual-rights admin interface (P2)
3. Implement derivative-works linking UI (P4)

### Phase 4: Audit & Compliance (Ongoing)
1. Quarterly trust tier stagnation reports (P3)
2. Annual audio rights re-verification cycle (P2)
3. Continuous Tanzil clearance queue processing (P1)

---

## Dependencies

- **MFD-12-REVIEW-WORKFLOW-SPEC.md**: Required for tier promotion decisions
- **MFD-12-CANONICAL-DATA-MODEL §4P**: ReviewDecision schema extensions
- **Legal Counsel**: Tanzil terms review, performer rights template
- **UI/UX Design**: Trust tier badges, audio disclaimer patterns
- **Migration Scripts**: Backfill existing sources with new fields

---

## Open Questions Remaining

1. **Tanzil Clearance Timeline**: What is realistic SLA for legal review of 100+ editions?
2. **Performer Rights Template**: Standardized authorization form needed for reciter outreach.
3. **Trust Tier Automation Boundaries**: Can any T0→T1 checks be safely automated (e.g., ISBN validation)?
4. **Derivative Works Taxonomy**: Is the six-value `relationshipType` enum sufficient?
5. **Component Rights Display**: How to render multi-component rights without overwhelming users?
6. **Cross-Jurisdiction Rights**: How to handle territorial restrictions in global deployment?

---

## Approval Tracking

| Policy | Scholarly Review | Legal Review | Technical Review | Status |
|--------|-----------------|--------------|------------------|--------|
| P1: Tanzil Enforcement | Pending | Pending | Pending | PROPOSED |
| P2: Audio Dual-Rights | Pending | Pending | Pending | PROPOSED |
| P3: Community Trust Tiers | Pending | Pending | Pending | PROPOSED |
| P4: Edition Variance Fix | Pending | Pending | Pending | PROPOSED |

---

## Document Control

- **Created**: 2026-11-21
- **Author**: WS-E Agent (ai-assisted)
- **Next Review**: Upon completion of scholarly/legal review cycle
- **Supersedes**: Ad-hoc rights handling in MFD-11 sources.ts
- **Depends On**: MFD-12-SOURCE-REGISTRY-SPEC.md, MFD-12-EVIDENCE-MODEL.md, DATA-PROVENANCE.md
