# WS-B: Reviewer Identity & Credentialing Specification

**Status:** Design Proposal (research only — no production schema or data modified)
**Module:** MFD-12.1 Governance & Credentialing
**Date:** 2026-11-21
**Extends:** MFD-12-REVIEW-WORKFLOW-SPEC §6; MFD-12-EVIDENCE-MODEL §10 q8
**Depends on:** MFD-12-CANONICAL-DATA-MODEL §4P (ReviewDecision)
**proposedBy:** ai-assisted | **reviewStatus:** pending-scholarly-review

---

## 1. Requirements Analysis

### 1.1 What the architecture needs

MFD-12-REVIEW-WORKFLOW-SPEC §6.2 identifies the gap: "No scholar identity infrastructure exists. Until one exists, `reviewerId` values are opaque strings and `signature.method` defaults to `recorded-manual`." This creates three concrete risks:

1. **Authority verification failure.** Without credential records, there is no way to verify that a person issuing a SCHOLARLY APPROVE actually holds the qualifications the system claims they hold.
2. **Scope enforcement failure.** The review workflow defines four scopes (TECHNICAL, RIGHTS, SCHOLARLY, TAXONOMIC) and restricts which roles can issue decisions in each scope. Without an identity-to-role mapping, scope restrictions are advisory prose, not enforced constraints.
3. **Audit trail opacity.** When a future reviewer or auditor asks "why was this approved?", the answer must include not just the rationale text but the reviewer's authority to make that judgment. An opaque string provides no such context.

### 1.2 Functional requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| RC-F1 | Register reviewer identities with verifiable qualification metadata | MUST |
| RC-F2 | Scope authority by domain (linguistics, tafsir, fiqh, hadith, creed) and review type | MUST |
| RC-F3 | Support activation/deactivation without deleting historical decisions | MUST |
| RC-F4 | Record the authorization chain: who authorized this reviewer for this scope | MUST |
| RC-F5 | Support multiple traditions/schools per reviewer for transparency | SHOULD |
| RC-F6 | Distinguish human scholars from automated agents at the identity level | MUST |
| RC-F7 | Provide a query interface: "is reviewer X currently authorized for scope Y on entity Z?" | MUST |
| RC-F8 | Preserve reviewer identity even after deactivation (decisions remain attributed) | MUST |

### 1.3 Non-functional requirements

| ID | Requirement |
|----|-------------|
| RC-NF1 | Identity records are mutable (credentials updated); decisions referencing them are immutable |
| RC-NF2 | Compatible with local-first operation (no server-side auth dependency) |
| RC-NF3 | Privacy-respecting: minimum necessary PII; support pseudonymous scholarly identities |
| RC-NF4 | Audit-log all credential changes |

---

## 2. Design Options

### Option A: Embedded Credentials in ReviewDecision

Store qualification metadata directly in each ReviewDecision record.

**Pros:** Self-contained; no join needed; simple migration.
**Cons:** Credential updates require new decisions; no centralized authority management; duplicates data across every decision; cannot deactivate a reviewer without affecting historical records' semantics.

**Verdict:** Rejected. Violates separation of concerns; makes credential lifecycle inseparable from decision lifecycle.

### Option B: Standalone ReviewerIdentity Entity (Recommended)

Create a first-class `ReviewerIdentity` entity that ReviewDecision references via `reviewerId`. Credentials, scopes, and activation status live on the identity; decisions reference it by stable ID.

**Pros:** Clean lifecycle separation; credentials update independently; deactivation is a flag on the identity, not a cascade; supports authorization chains; compatible with existing `reviewerId` field.
**Cons:** Requires join for display; new entity to manage; authorization queries need index support.

**Verdict:** Recommended. Matches the architecture's pattern of separating concerns (cf. EvidenceRecord vs ClaimSupport vs ReviewDecision).

### Option C: External Identity Provider Integration

Delegate identity to an external system (ORCID, institutional SSO, etc.) and store only a reference.

**Pros:** Leverages existing verification infrastructure; reduces PII storage.
**Cons:** Breaks local-first operation; introduces external dependency; Islamic scholarly credentials don't map cleanly to academic ORCID; many qualified scholars lack institutional affiliations.

**Verdict:** Deferred as optional future enhancement. Core identity must work offline.

---

## 3. Recommended Specification: ReviewerIdentity Entity

### 3.1 Schema

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/reviewer-identity",
  "title": "MFD-12 Reviewer Identity",
  "description": "Registered scholar/reviewer identity with scoped authority. Mutable; decisions referencing this identity remain valid even after deactivation.",
  "type": "object",
  "required": ["id", "displayName", "reviewerType", "authorizedScopes", "activeFrom", "createdAt", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^sch-[a-z0-9][a-z0-9-]{2,63}$",
      "description": "Stable identifier. Lowercase kebab-case. Never reused."
    },
    "displayName": {
      "type": "string",
      "minLength": 1,
      "description": "Public-facing name. May be pseudonymous."
    },
    "reviewerType": {
      "enum": ["HUMAN_SCHOLAR", "HUMAN_EDITOR", "HUMAN_VERIFIER", "HUMAN_RIGHTS_REVIEWER", "AUTOMATED_AGENT"],
      "description": "Distinguishes human from automated reviewers at the identity level."
    },
    "qualifications": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["qualification", "issuingBody", "verifiedAt"],
        "additionalProperties": false,
        "properties": {
          "qualification": { "type": "string", "description": "e.g., 'Ijazah in Tafsir', 'PhD Islamic Studies', 'Alimiyyah Certificate'" },
          "issuingBody": { "type": "string", "description": "Institution or scholar who issued the qualification" },
          "issuedYear": { "type": "integer" },
          "verifiedAt": { "type": "string", "format": "date-time" },
          "verifiedBy": { "type": "string", "description": "Identity of verifier (another sch- ID or system process)" },
          "verificationMethod": { "enum": ["documentary", "oral-confirmation", "institutional-api", "self-declared-unverified"] }
        }
      },
      "description": "Verifiable credentials. Empty array permitted for legacy/imported reviewers."
    },
    "domainExpertise": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["domain", "proficiencyLevel"],
        "additionalProperties": false,
        "properties": {
          "domain": {
            "enum": ["TAFSIR", "HADITH", "FIQH", "AQEEDAH", "LINGUISTICS", "LEXICOGRAPHY", "SEERAH", "HISTORY", "CONTEMPORARY_SCHOLARSHIP", "RIGHTS_LICENSING"],
            "description": "Scholarly domain of expertise"
          },
          "proficiencyLevel": {
            "enum": ["EXPERT", "COMPETENT", "FAMILIAR"],
            "description": "Self-assessed or verified proficiency"
          },
          "traditions": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Schools/traditions within this domain, e.g., ['Hanafi', 'Ash\'ari']. For transparency, not ranking."
          },
          "verifiedAt": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Domain-specific expertise with tradition annotations"
    },
    "authorizedScopes": {
      "type": "array",
      "items": { "enum": ["TECHNICAL", "RIGHTS", "SCHOLARLY", "TAXONOMIC"] },
      "minItems": 1,
      "description": "Review scopes this identity is currently authorized to issue decisions in"
    },
    "authorizationChain": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["authorizedBy", "authorizedAt", "scopeGranted"],
        "additionalProperties": false,
        "properties": {
          "authorizedBy": { "type": "string", "description": "sch- ID of authorizer or 'system-bootstrap' for initial setup" },
          "authorizedAt": { "type": "string", "format": "date-time" },
          "scopeGranted": { "type": "array", "items": { "enum": ["TECHNICAL", "RIGHTS", "SCHOLARLY", "TAXONOMIC"] } },
          "rationale": { "type": "string" }
        }
      },
      "description": "Who authorized this reviewer and for what. Append-only log."
    },
    "activeFrom": { "type": "string", "format": "date-time" },
    "activeUntil": { "type": ["string", "null"], "format": "date-time", "description": "null = currently active" },
    "deactivationReason": { "type": "string", "description": "Required when activeUntil is non-null" },
    "contactHash": { "type": "string", "description": "SHA-256 hash of contact info for deduplication without storing PII" },
    "notes": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "schemaVersion": { "type": "string" }
  }
}
```

### 3.2 Authorization Rules

| Rule | Description |
|------|-------------|
| AUTH-1 | Only identities with `reviewerType: HUMAN_SCHOLAR` may issue SCHOLARLY decisions |
| AUTH-2 | `AUTOMATED_AGENT` identities may only hold `authorizedScopes: ["TECHNICAL"]` |
| AUTH-3 | Scope authorization requires at least one entry in `authorizationChain` granting that scope |
| AUTH-4 | Domain expertise does NOT automatically grant scope; scope is explicitly authorized |
| AUTH-5 | Deactivated identities (`activeUntil != null && activeUntil < now`) cannot issue new decisions |
| AUTH-6 | Historical decisions by deactivated identities remain valid and auditable |
| AUTH-7 | Bootstrap authorization (`authorizedBy: "system-bootstrap"`) is permitted only during initial system setup and must be documented |

### 3.3 Authority Scoping Matrix

| Review Scope | Required reviewerType | Required domainExpertise | Notes |
|-------------|----------------------|-------------------------|-------|
| TECHNICAL | Any | None | Structural validation only |
| RIGHTS | HUMAN_RIGHTS_REVIEWER or HUMAN_EDITOR | RIGHTS_LICENSING | Legal/policy assessment |
| SCHOLARLY | HUMAN_SCHOLAR | Must match claim type domain | TAFSIR for tafsir claims, LINGUISTICS for lexical claims, etc. |
| TAXONOMIC | HUMAN_SCHOLAR or HUMAN_EDITOR | Relevant domain + editorial competence | Joint scholarly-editorial decision |

### 3.4 Query Interface

```
isAuthorized(reviewerId, scope, entityType?) → boolean
  1. Load ReviewerIdentity by id
  2. Check activeFrom <= now AND (activeUntil == null OR activeUntil > now)
  3. Check scope ∈ authorizedScopes
  4. If scope == SCHOLARLY: check domainExpertise covers the entity's claimType
  5. Return true iff all checks pass
```

This function is called at decision-write time, not at read time. Decisions written while authorized remain valid after deactivation.

---

## 4. Integration Points

| Existing Entity | Integration |
|----------------|-------------|
| ReviewDecision.reviewerId | References ReviewerIdentity.id; FK constraint recommended |
| ReviewDecision.reviewerRole | Must be consistent with ReviewerIdentity.reviewerType and authorizedScopes |
| ReviewDecision.signature | `signature.method` upgrades from `recorded-manual` to `credential-verified` when identity has verified qualifications |
| ScholarlyClaim.claimType | Used in AUTH-4 domain matching for SCHOLARLY scope |
| EvidenceRecord.evidenceKind | Domain matching: HADITH_REPORT → HADITH expertise required |
| DisagreementSet.traditions | Cross-referenced with reviewer domainExpertise.traditions for transparency |

---

## 5. Implementation Prerequisites

| Prerequisite | Status | Owner |
|-------------|--------|-------|
| ReviewDecision schema finalized with reviewerId field | ✅ Defined in CANONICAL-DATA-MODEL §4P | WS1 |
| Review scope enum finalized | ✅ Defined in REVIEW-WORKFLOW-SPEC §2 | WS4 |
| Claim type enum finalized | ✅ Defined in CANONICAL-DATA-MODEL §4O | WS1 |
| Storage adapter supporting FK constraints | ❌ Pending | Infrastructure |
| Initial reviewer bootstrap process defined | ❌ Pending | Governance body |
| Privacy policy for reviewer PII | ❌ Pending | Legal/Rights |

---

*End of Specification*
