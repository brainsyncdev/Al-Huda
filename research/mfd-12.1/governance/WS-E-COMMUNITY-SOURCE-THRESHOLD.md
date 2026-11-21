# WS-E: Community-Contributed Source Verification Threshold (Q32)

**Status:** Proposed  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-scholarly-review  
**Date:** 2026-11-21  
**Module:** MFD-12.1 Evidence Governance Framework  
**Input Reference:** MFD-12-SOURCE-REGISTRY-SPEC.md §5.3, §7(Q3); MFD-12-EVIDENCE-MODEL.md §4

---

## 1. Current State

### Documentation Status
- **MFD-12-SOURCE-REGISTRY-SPEC.md §5.3**: Defines transition path `rights-unverified → [legal review] → public-domain | cc-* | proprietary-restricted | rights-disputed`.
- States: "No automated process may change `rightsStatus`. All transitions require a `ReviewDecision` entity."
- **§7 Open Question Q3**: Asks what verification threshold applies before community-submitted sources transition from `rights-unverified` to cleared status.
- **Provenance.ingestionMethod**: Includes `community-contributed` as valid enum value.

### Schema Status
- `provenance.verifiedBy` and `provenance.verifiedAt` exist but have no tiered trust semantics.
- `ReviewDecision` supports `reviewerRole` enum but does not distinguish community vetting levels.
- No structured representation of "trust tier" or "verification depth" exists.

### Gap Identified
Community contributions vary widely in reliability. A single binary gate (`unverified` → `cleared`) fails to capture intermediate confidence levels needed for:
- Prioritizing legal review queues
- Allowing provisional scholarly use with appropriate disclaimers
- Building incremental trust through multiple independent verifications

---

## 2. Risk Analysis

### Legal Risk
| Tier | Risk | Mitigation |
|------|------|-----------|
| Unvetted Community Submission | HIGH | Default `rights-unverified` + `linkOutOnly` |
| Single Verifier (Non-Legal) | MEDIUM | Provisional status; no full display |
| Multi-Verifier Consensus | LOW-MEDIUM | Eligible for legal fast-track |
| Legal Counsel Review | NONE | Full clearance possible |

### Scholarly Risk
- Premature elevation to "cleared" may lead scholars to cite sources later found restricted.
- Lack of tiered visibility means reviewers cannot prioritize high-confidence community finds.
- Over-reliance on AI-assisted verification without human corroboration.

### Operational Risk
- Without tiers, every community submission blocks at the same queue position as complex legal cases.
- No incentive structure for community contributors to provide higher-quality submissions.
- Audit trail lacks granularity to distinguish "quick sanity check" from "deep rights analysis."

---

## 3. Recommended Policy

### Primary Recommendation: Four-Tier Trust Model

**Rationale:** Binary gates create bottlenecks and fail to represent epistemic uncertainty. Tiered trust enables proportional governance.

### Trust Tier Definitions

| Tier | Label | Requirements | Permitted Actions | Display Policy |
|------|-------|--------------|-------------------|----------------|
| T0 | `UNVETTED` | Submitted via community channel | Bibliographic reference only | `linkOutOnly: true` |
| T1 | `BASIC_VERIFIED` | One human verifier confirms: source exists, author attribution plausible, no obvious red flags | Citation in scholarly work with disclaimer | `linkOutOnly: true` + metadata display |
| T2 | `RIGHTS_ASSESSED` | Rights researcher (non-lawyer) documents license terms, checks publisher site, identifies potential conflicts | Eligible for legal review queue priority | `excerptMaxLength: 300` + attribution |
| T3 | `LEGAL_CLEARED` | Legal counsel or authorized reviewer issues `ReviewDecision` with `reviewScope: RIGHTS` + `decision: APPROVE` | Full display/export per license terms | Per license constraints |

### Policy Directives

1. **All community submissions enter at T0.** No automatic promotion.

2. **T0 → T1 requires:**
   - Human verifier (role: `VERIFIER` or `EDITOR`)
   - Confirmation of source existence (URL resolves, book exists in library catalog, etc.)
   - Basic author/publisher attribution check
   - No automated promotion allowed

3. **T1 → T2 requires:**
   - Dedicated rights researcher (role: `RIGHTS_RESEARCHER`)
   - Documented license text or publisher terms screenshot/archive
   - Conflict-of-interest declaration
   - Written assessment in `rightsNotes` field

4. **T2 → T3 requires:**
   - `ReviewDecision` with `reviewScope: RIGHTS`
   - Reviewer role: `RIGHTS_REVIEWER` or `SCHOLAR` with legal training notation
   - Explicit license determination
   - `targetContentVersion` pinning

5. **Demotion triggers:**
   - Contradictory evidence discovered → immediate demotion to appropriate tier
   - Rights holder contact/takedown → demotion to T0 + `rights-disputed` flag
   - Annual re-verification required for T1/T2 (T3 exempt unless license expires)

6. **AI-Assisted Submissions:**
   - Always enter at T0 regardless of AI confidence score
   - AI analysis may be attached as `notes` but does not count toward tier promotion
   - AI-generated rights assessments require human corroboration at each tier

---

## 4. Schema Changes

### Source Entity Addition

**Add field:**
```jsonc
"trustTier": {
  "type": "string",
  "enum": ["UNVETTED", "BASIC_VERIFIED", "RIGHTS_ASSESSED", "LEGAL_CLEARED"],
  "default": "UNVETTED",
  "description": "Community contribution verification tier. See WS-E-COMMUNITY-SOURCE-THRESHOLD.md. Transitions require ReviewDecision or VerificationRecord as appropriate."
}
```

**Add field:**
```jsonc
"tierHistory": {
  "type": "array",
  "items": {
    "type": "object",
    "required": ["tier", "changedAt", "changedBy", "reason"],
    "properties": {
      "tier": { "enum": ["UNVETTED", "BASIC_VERIFIED", "RIGHTS_ASSESSED", "LEGAL_CLEARED"] },
      "changedAt": { "type": "string", "format": "date-time" },
      "changedBy": { "type": "string" },
      "changedByRole": { "enum": ["AUTOMATED", "VERIFIER", "EDITOR", "RIGHTS_RESEARCHER", "RIGHTS_REVIEWER", "SCHOLAR"] },
      "reason": { "type": "string" },
      "decisionRef": { "type": "string", "description": "ReviewDecision.id if applicable" }
    }
  },
  "description": "Append-only history of trust tier transitions."
}
```

### Provenance Object Extension

**Add optional field:**
```jsonc
"communitySubmissionMetadata": {
  "type": "object",
  "properties": {
    "submitterId": { "type": "string" },
    "submissionChannel": { "enum": ["web-form", "email", "api", "github-issue", "other"] },
    "aiAssistedPreparation": { "type": "boolean" },
    "supportingDocuments": { "type": "array", "items": { "type": "string", "format": "uri" } }
  },
  "description": "Metadata for community-contributed sources. Required when ingestionMethod is community-contributed."
}
```

---

## 5. Implementation Notes

### Storage
- `trustTier` stored on Source; indexed for queue filtering.
- `tierHistory` append-only; migrations must preserve existing state as initial T0 entry.

### Display
- UI badges indicate tier: 🔒 T0, 👁️ T1, 📋 T2, ✅ T3.
- T0/T1: External link only.
- T2: Limited excerpt with "Rights assessed; legal clearance pending" notice.
- T3: Full display per license.

### Workflow Integration
- Review queue sortable by tier (T2 prioritized for legal review).
- Automated alerts when T1/T2 sources exceed 90 days without progression.
- Dashboard widget showing tier distribution.

### Export
- T0/T1 sources excluded from all exports.
- T2 sources included in metadata-only exports.
- T3 sources exported per license constraints.

### Audit
- Tier transitions logged with full actor/reason metadata.
- Annual compliance report includes tier stagnation analysis.
- Demotion events trigger notification to dependent claim authors.
