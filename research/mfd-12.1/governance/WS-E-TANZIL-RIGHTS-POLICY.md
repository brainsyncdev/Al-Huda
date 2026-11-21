# WS-E: Tanzil Proxy Rights Policy (Q30)

**Status:** Proposed  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-scholarly-review  
**Date:** 2026-11-21  
**Module:** MFD-12.1 Evidence Governance Framework  
**Input Reference:** DATA-PROVENANCE.md §"Runtime delivery: a documented deviation", MFD-12-SOURCE-REGISTRY-SPEC.md §5, §7(Q1)

---

## 1. Current State

### Documentation Status
- **DATA-PROVENANCE.md** explicitly classifies the Tanzil proxy as a "documented deviation" from the vendored-artifact rule.
- The proxy is described as: first-party route, catalog-constrained, pinned to `tanzil.net`, cached 24h, but **not** an ingested/checksummed artifact.
- Outstanding action recorded: "Legal/licensing review of the Tanzil catalog as used through this proxy."
- Current source records for Tanzil translations carry `rights-unverified` and `method: "link"`.

### Schema Status (MFD-12-SOURCE-REGISTRY-SPEC.md)
- `rightsStatus: "rights-unverified"` is a valid enum value.
- `displayConstraints.linkOutOnly: true` exists as a safe-default gating mechanism.
- Impact Matrix (§5.4) mandates: `rights-unverified` → ⚠️ Link-out only (safe default), Export ❌, API Access ❌.
- Open Question Q30 explicitly asks if this combination is adequate.

### Implementation Reality
- Despite `linkOutOnly` being defined in the spec, the *current production app* renders Tanzil text in-app via proxy (`/api/translations/[id]`). This is a **spec-reality gap**: the safe default defined in MFD-12 has not yet been enforced on the existing MFD-11 proxy implementation.

---

## 2. Risk Analysis

### Legal Risk
| Option | Risk Level | Rationale |
|--------|------------|----------|
| **Current Proxy (In-App Display)** | HIGH | Proxying may constitute redistribution or public performance depending on jurisdiction. Tanzil's terms are unreviewed. No license grant exists for this specific usage pattern. |
| **`linkOutOnly` Enforcement** | LOW | Eliminates reproduction/display concerns entirely. Only bibliographic reference + external hyperlink remains. Safe harbor under most copyright regimes. |
| **Vendoring with License** | NONE (if cleared) | Requires explicit permission; eliminates proxy ambiguity. High effort. |
| **Hybrid (Excerpt Only)** | MEDIUM | `excerptMaxLength` still involves reproduction. Without fair-use/dealing analysis, risk persists. |

### Scholarly Risk
- **Link-out only**: Users cannot verify translation accuracy against the primary Arabic text within the same interface. Increases cognitive load and reduces scholarly utility.
- **Unverified proxy**: Scholars may cite content whose legal status is uncertain, creating reputational risk for the platform.

### User Experience Impact
- **Link-out only**: Significant friction. Users leave the app to read translations. Parallel mode (FR-033) becomes non-functional.
- **Current proxy**: Seamless UX but built on legally unstable foundation.
- **Transition period**: Enforcing `linkOutOnly` now will be perceived as feature regression unless communicated as a rights-compliance measure.

---

## 3. Recommended Policy

### Primary Recommendation: Enforce `linkOutOnly` + Accelerated Clearance Track

**Rationale:** The current spec-defined safe default (`rights-unverified` + `linkOutOnly`) IS adequate as a *temporary* posture but MUST be enforced immediately. The gap between spec and production is the actual risk, not the policy itself.

### Policy Directives

1. **Immediate Enforcement**: All sources with `rightsStatus: "rights-unverified"` AND runtime delivery (currently `method: "link"` in MFD-11; maps to `provenance.ingestionMethod: "api-import"` or equivalent in MFD-12) MUST have `displayConstraints.linkOutOnly: true` enforced at the API layer. In-app text display is blocked until rights clearance.

2. **Clearance Track Priority**: Tanzil translations are high-priority for legal review due to user demand. Create a dedicated `ReviewDecision` queue for Tanzil editions.

3. **Per-Edition Granularity**: Rights clearance should proceed edition-by-edition. A cleared edition transitions to its specific license (e.g., `cc-by-4.0`) and enables `inAppText: true`. Uncleared editions remain `linkOutOnly`.

4. **No Excerpt Compromise**: Do NOT use `excerptMaxLength` as a middle ground for `rights-unverified` proxy sources. Without legal analysis, even excerpts may violate terms.

5. **User Communication**: When `linkOutOnly` is active, display: "This translation is available externally. [Source Name] rights are under review. Read at [External Link]." Never imply content is unavailable due to technical failure.

### Alternative Rejected
- **"Proxy is not redistribution" argument**: Rejected. Legal interpretation varies by jurisdiction; without counsel opinion, assume worst case.
- **Fair-use/fair-dealing reliance**: Rejected for now. Requires case-by-case analysis not yet performed.

---

## 4. Schema Changes

### Source Entity (MFD-12-SOURCE-REGISTRY-SPEC.md §2)

**Add field to `displayConstraints`:**
```jsonc
"proxyComplianceMode": {
  "type": "string",
  "enum": ["none", "link-out-enforced", "excerpt-gated", "full-display-cleared"],
  "default": "none",
  "description": "Tracks compliance posture specifically for runtime-proxied sources. 'link-out-enforced' overrides inAppText when rightsStatus is unverified."
}
```

**Rationale:** Makes the proxy-specific enforcement explicit rather than relying solely on `linkOutOnly` boolean, which may be manually overridden.

### Edition Entity

**Add field:**
```jsonc
"proxyEndpoint": {
  "type": "string",
  "format": "uri-template",
  "description": "For api-import editions: the templated upstream URL. Required when ingestionMethod is api-import. Enables audit of what is actually proxied."
}
```

---

## 5. Implementation Notes

### Storage
- `proxyComplianceMode` stored in Source record; computed at ingest time based on `rightsStatus` + `ingestionMethod`.
- Migration script needed to backfill existing Tanzil sources with `proxyComplianceMode: "link-out-enforced"`.

### Display
- API routes (`/api/translations/[id]`, `/api/v1/ayahs/.../tafsir`) must check `proxyComplianceMode` BEFORE returning text content.
- If `link-out-enforced`: return metadata + external URL only; HTTP 403 or structured response indicating gating.
- Frontend must handle gated response gracefully (no broken UI).

### Export
- PDF/EPUB generators already exclude `exportAllowed: false` sources. No change needed; `linkOutOnly` implies `exportAllowed: false` per §5.4.

### Audit Trail
- Every transition from `link-out-enforced` → `full-display-cleared` requires a `ReviewDecision` with `reviewScope: RIGHTS`.
- Log all proxy requests for compliance auditing (retention policy TBD).

### Backwards Compatibility
- Existing MFD-11 proxy continues to function until MFD-12 migration completes.
- During transition: add middleware check that enforces `linkOutOnly` for `rights-unverified` sources regardless of MFD-11/MFD-12 schema version.
