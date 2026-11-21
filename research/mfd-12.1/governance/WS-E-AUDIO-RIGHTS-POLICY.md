# WS-E: Audio Recording Rights Policy (Q31)

**Status:** Proposed  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-scholarly-review  
**Date:** 2026-11-21  
**Module:** MFD-12.1 Evidence Governance Framework  
**Input Reference:** DATA-PROVENANCE.md §"Audio recitation", MFD-12-SOURCE-REGISTRY-SPEC.md §7(Q2)

---

## 1. Current State

### Documentation Status
- **DATA-PROVENANCE.md**: Islamic Network CDN serves recordings with "no explicit license." Streaming reduces exposure but "does not establish permission."
- 12 reciters offered; default Alafasy. Bitrate 64kbps. Global ayah ordinal computed.
- Source record: `islamic-network-audio` in `sources.ts` with `method: "link"`.
- Editorial review log: Audio marked `pending-scholarly-review` — no explicit recording licence.

### Schema Status
- `sourceType: "recitation"` exists in MFD-12 Source Registry Spec.
- No performer-specific fields exist. Rights are modeled at Source/Edition level only.
- `rightsStatus: "rights-unverified"` applies to the entire audio source.

### Gap Identified
Audio recordings involve **two distinct rights layers** that the current model conflates:
1. **Distribution Rights**: Permission to stream/host the MP3 file (CDN operator → app).
2. **Performer Rights**: Moral and economic rights of the reciter (performer → audience).

These may have different holders, different terms, and different expiry dates.

---

## 2. Risk Analysis

### Legal Risk
| Layer | Risk | Current Mitigation | Adequacy |
|-------|------|-------------------|----------|
| Distribution | CDN may lack sublicensing authority | Streaming-only, no bundling | PARTIAL — streaming is still public performance |
| Performer | Reciter may not have authorized digital distribution | None | INSUFFICIENT — performer rights exist independently |
| Moral Rights | Attribution/integrity violations | Attribution in UI | PARTIAL — depends on jurisdiction |

### Scholarly Risk
- Misattributed recitations undermine tajweed verification.
- Unauthorized recordings may be withdrawn by performers, breaking references.
- No mechanism to distinguish "authorized recording" from "fan upload."

### User Experience Risk
- Audio player works today; future takedown would break functionality.
- Users expect persistent audio; link rot creates trust deficit.
- No way to signal "this recitation is provisionally available pending clearance."

---

## 3. Recommended Policy

### Primary Recommendation: Split Rights Model for Recitation Sources

**Rationale:** Performer rights and distribution rights are legally distinct. Conflating them creates blind spots where one layer is cleared but the other is not.

### Policy Directives

1. **Dual-Rights Requirement**: All `sourceType: "recitation"` sources MUST carry both `distributionRights` and `performerRights` fields. Neither may be omitted.

2. **Default Posture**: Until BOTH layers are verified, recitation sources default to `rightsStatus: "rights-unverified"` with `displayConstraints.inAppText: false` (audio playback gated).

3. **Performer Identity Verification**: Each reciter entry must include verifiable identity metadata (name, death year if applicable, authorization chain if known). Anonymous/unattributed recordings are classified as `rights-disputed` until attributed.

4. **CDN Terms Audit**: Islamic Network CDN terms must be reviewed specifically for:
   - Sublicensing authority
   - Territorial restrictions
   - Commercial/non-commercial distinction
   - Attribution requirements
   - Takedown notice procedure

5. **Graceful Degradation**: When performer rights are unclear but distribution is cleared, allow streaming with prominent disclaimer: "Recording rights verified; performer authorization pending review." Reverse also permitted.

6. **Takedown Response Protocol**: Document procedure for responding to performer/rights-holder takedown requests within 48 hours. Include automated disable capability.

---

## 4. Schema Changes

### Source Entity Extension for Recitation Type

**Add conditional object (required when `sourceType === "recitation"`):**

```jsonc
"recitationRights": {
  "type": "object",
  "required": ["distributionRightsStatus", "performerRightsStatus"],
  "additionalProperties": false,
  "properties": {
    "distributionRightsStatus": {
      "type": "string",
      "enum": ["cleared", "unverified", "disputed", "expired"],
      "description": "Status of CDN/distributor permission to stream."
    },
    "distributionRightsHolder": {
      "type": "string",
      "description": "Entity granting distribution permission."
    },
    "distributionLicenseUrl": {
      "type": "string",
      "format": "uri",
      "description": "Direct link to distribution terms."
    },
    "performerRightsStatus": {
      "type": "string",
      "enum": ["authorized", "unverified", "disputed", "waived", "unknown"],
      "description": "Status of reciter's authorization for this specific recording."
    },
    "performerIdentity": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "deathYearHijri": { "type": "integer" },
        "deathYearGregorian": { "type": "integer" },
        "authorizationChain": { "type": "string", "description": "Ijazah or teacher lineage if relevant." }
      }
    },
    "moralRightsAcknowledged": {
      "type": "boolean",
      "description": "Whether attribution/integrity requirements are documented."
    },
    "territorialRestrictions": {
      "type": "array",
      "items": { "type": "string" },
      "description": "ISO country codes where rights do NOT apply. Empty = worldwide."
    },
    "commercialUseAllowed": {
      "type": "boolean",
      "description": "Whether commercial deployment is permitted."
    }
  }
}
```

### EvidenceRecord Extension

**Add optional field:**
```jsonc
"audioLocator": {
  "type": "object",
  "properties": {
    "reciterId": { "type": "string" },
    "bitrate": { "type": "integer" },
    "durationSeconds": { "type": "number" },
    "checksumSha256": { "type": "string" }
  },
  "description": "Structured locator for audio evidence. Required when evidenceKind relates to recitation verification."
}
```

---

## 5. Implementation Notes

### Storage
- `recitationRights` stored alongside Source record; validated conditionally.
- Migration: existing `islamic-network-audio` source requires manual enrichment with reciter list and dual-rights assessment.

### Display
- Audio player component must check BOTH `distributionRightsStatus` AND `performerRightsStatus` before enabling playback.
- Partial clearance states require UI badge/disclaimer.
- Fully uncleared: player disabled, message explains rights review status.

### Export
- Audio files never exported (streaming only). No export logic change needed.
- Metadata exports include recitation rights status for transparency.

### Monitoring
- Implement periodic CDN availability check (weekly).
- Log playback events for compliance auditing.
- Alert on 403/404 from CDN (potential takedown).

### Reciter Onboarding
- New reciter additions require `recitationRights` population BEFORE activation.
- Community-submitted recitations follow WS-E-COMMUNITY-SOURCE-THRESHOLD policy.
