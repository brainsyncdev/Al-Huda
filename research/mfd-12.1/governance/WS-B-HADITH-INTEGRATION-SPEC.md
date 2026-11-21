# WS-B: Hadith Integration Specification

**Status:** Design Proposal (research only — no production schema or data modified)
**Module:** MFD-12.1 Governance & Credentialing
**Date:** 2026-11-21
**Extends:** MFD-12-EVIDENCE-MODEL §3 (EvidenceRecord), §10 q1; MFD-12-CANONICAL-DATA-MODEL §7 q3
**Depends on:** MFD-12-SOURCE-REGISTRY-SPEC (Source entity with sourceType: hadith-collection)
**proposedBy:** ai-assisted | **reviewStatus:** pending-scholarly-review

---

## 1. Requirements Analysis

### 1.1 What the architecture needs

MFD-12-CANONICAL-DATA-MODEL §7 q3 asks: "Source.type includes HADITH_COLLECTION, but no dedicated Hadith entity exists. Should MFD-12 define a Hadith entity type, or defer hadith modeling to a future workstream?"

MFD-12-EVIDENCE-MODEL §10 q1 adds: "Does hadith evidence need isnād chains, per-muhaddith grading, and matn variants as first-class fields, or a separate HadithEvidence entity?"

Current state:
- `EvidenceRecord.evidenceKind` includes `HADITH_REPORT` (EVIDENCE-MODEL §3)
- `Source.sourceType` includes `hadith-collection` (SOURCE-REGISTRY-SPEC §2)
- `Source.reliabilityGrade` exists in base schema (CANONICAL-DATA-MODEL §4M) but is collection-level, not per-hadith
- No entity captures isnād (chain of narrators), per-narrator biographical evaluation, matn text, or variant transmissions

### 1.2 Why Source + EvidenceRecord alone are insufficient

| Hadith Property | Current Model Support | Gap |
|----------------|----------------------|-----|
| Matn (text) | EvidenceRecord.quotedText | Adequate for single citation |
| Isnād (chain) | Not modeled | Critical for authenticity assessment |
| Per-narrator evaluation | Not modeled | Required for grading |
| Grading (ṣaḥīḥ/ḥasan/ḍaʿīf) | Source.reliabilityGrade (collection-level only) | Hadith within same collection have different grades |
| Variant transmissions | Not modeled | Same hadith in Bukhari vs Muslim may differ |
| Muhaddith attribution | Not modeled | Grading is scholar-specific, not absolute |
| Topical classification (kitāb/bāb) | ReferenceLocator.chapter-section | Partially addressed |
| Cross-collection parallels | Not modeled | Essential for comparative study |

### 1.3 Functional requirements

| ID | Requirement |
|----|-------------|
| HI-F1 | Model individual hadith reports with matn, isnād summary, and grading |
| HI-F2 | Support multiple gradings per hadith (different muhaddithūn) |
| HI-F3 | Link hadith to Source/Edition via structured locator |
| HI-F4 | Support variant transmissions across collections |
| HI-F5 | Integrate with EvidenceRecord without duplicating data |
| HI-F6 | Compatible with existing evidence verification lifecycle |
| HI-F7 | Support hadith-specific review scope considerations |

---

## 2. Design Options

### Option A: Extend EvidenceRecord with Hadith Fields

Add isnād, grading, and variant fields directly to EvidenceRecord when `evidenceKind == HADITH_REPORT`.

**Pros:** No new entity; simple integration; existing lifecycle applies.
**Cons:** EvidenceRecord becomes polymorphic; isnād structure is complex and doesn't fit flat fields; grading is scholar-specific (many-to-many); variants require duplication; violates single-responsibility principle.

**Verdict:** Rejected. Overloads EvidenceRecord beyond its verification-focused purpose.

### Option B: Dedicated HadithReport Entity (Recommended)

Create a first-class `HadithReport` entity that EvidenceRecord references. HadithReport carries matn, isnād summary, gradings, and variants. EvidenceRecord continues to handle verification and claim linkage.

**Pros:** Clean separation; hadith-specific fields properly structured; grading is multi-valued; variants are first-class; EvidenceRecord lifecycle unchanged.
**Cons:** New entity; requires join for display; additional migration path.

**Verdict:** Recommended.

### Option C: Defer to Future Workstream

Keep `evidenceKind: HADITH_REPORT` as a placeholder; model hadith fully in a future MFD-13.

**Pros:** Reduces MFD-12 scope; avoids premature design.
**Cons:** Blocks hadith-dependent claims from proper review; EvidenceRecord.HADITH_REPORT is meaningless without structure; batch reviews already encounter hadith evidence.

**Verdict:** Partially adopted — core entity defined now, advanced features (full isnād graph, narrator biography network) deferred.

---

## 3. Recommended Specification: HadithReport Entity

### 3.1 Schema

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/hadith-report",
  "title": "MFD-12 Hadith Report",
  "description": "Individual hadith report with matn, isnād summary, and multi-scholar grading. Referenced by EvidenceRecord for claim linkage.",
  "type": "object",
  "required": ["id", "sourceId", "editionId", "matnArabic", "locator", "createdAt", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^hd-[0-9a-f-]{36}$",
      "description": "UUID-based identifier"
    },
    "sourceId": {
      "type": "string",
      "pattern": "^src-[a-z0-9-]+$",
      "description": "Reference to Source (hadith-collection type)"
    },
    "editionId": {
      "type": "string",
      "pattern": "^ed-[a-z0-9-]+$",
      "description": "Specific edition within the collection"
    },
    "locator": {
      "$ref": "mfd-12/reference-locator",
      "description": "Structured locator per SOURCE-REGISTRY-SPEC §4"
    },
    "matnArabic": {
      "type": "string",
      "minLength": 1,
      "description": "Full Arabic matn text with diacritics"
    },
    "matnTranslation": {
      "type": "object",
      "properties": {
        "text": { "type": "string" },
        "translator": { "type": "string" },
        "language": { "type": "string" },
        "sourceEditionId": { "type": "string" }
      },
      "description": "Translation of matn; never presented as original text"
    },
    "isnadSummary": {
      "type": "object",
      "properties": {
        "narratorChain": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Ordered list of narrator names from Prophet ﷺ to compiler. Simplified; full narrator graph deferred."
        },
        "chainLength": { "type": "integer" },
        "isContinuous": { "type": "boolean", "description": "Whether chain is unbroken (muttaṣil)" },
        "notableNarrators": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "position": { "type": "integer" },
              "evaluationNote": { "type": "string", "description": "Brief evaluation note, e.g., 'thiqah', 'da\'if'" }
            }
          }
        }
      },
      "description": "Simplified isnād representation. Full narrator biography graph deferred to future workstream."
    },
    "gradings": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["grade", "gradingScholar"],
        "additionalProperties": false,
        "properties": {
          "grade": {
            "enum": ["SAHIH", "HASAN", "DAIF", "MAUDU", "HASAN_LI_GHAIRIHI", "DAIF_JIDDAN", "UNGRADED"],
            "description": "Authenticity grade"
          },
          "gradingScholar": { "type": "string", "description": "Name of muhaddith who assigned this grade" },
          "gradingScholarId": { "type": "string", "description": "Optional link to ReviewerIdentity if scholar is registered" },
          "rationale": { "type": "string", "description": "Brief grading rationale" },
          "gradedAt": { "type": "string", "format": "date-time" }
        }
      },
      "description": "Multiple gradings allowed; different scholars may disagree"
    },
    "classification": {
      "type": "object",
      "properties": {
        "kitab": { "type": "string", "description": "Book/chapter within collection" },
        "bab": { "type": "string", "description": "Section/sub-chapter" },
        "topicTags": { "type": "array", "items": { "type": "string" } }
      }
    },
    "variantOf": {
      "type": "string",
      "pattern": "^hd-[0-9a-f-]{36}$",
      "description": "If this is a variant transmission, references the primary HadithReport"
    },
    "parallelReports": {
      "type": "array",
      "items": { "type": "string", "pattern": "^hd-[0-9a-f-]{36}$" },
      "description": "Same/similar hadith in other collections"
    },
    "contentVersion": { "type": "integer", "minimum": 1 },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "schemaVersion": { "type": "string" }
  }
}
```

### 3.2 Integration with EvidenceRecord

EvidenceRecord references HadithReport when `evidenceKind == HADITH_REPORT`:

```jsonc
// EvidenceRecord additions
{
  "hadithReportId": {
    "type": "string",
    "pattern": "^hd-[0-9a-f-]{36}$",
    "description": "Required when evidenceKind == HADITH_REPORT. References HadithReport.id"
  }
}
```

**Rule HR1:** When `evidenceKind == HADITH_REPORT`, `hadithReportId` is REQUIRED and `excerpt` refers to Quranic text only if the hadith is cited alongside a verse.

**Rule HR2:** `quotedText` on EvidenceRecord carries the hadith matn excerpt used as evidence. Full matn lives on HadithReport.

**Rule HR3:** HadithReport.gradings inform but do NOT determine ClaimSupport outcomes. A ḍaʿīf hadith may still support a claim if the scholar judges it sufficient in context; the grading is data, not verdict.

### 3.3 Hadith-Specific Verification States

Extend EvidenceRecord verification lifecycle for hadith:

| State | Trigger | Notes |
|-------|---------|-------|
| SOURCE_IDENTIFIED | HadithReport located in cited edition | Locator validated |
| REFERENCE_PENDING_VERIFICATION | Matn extracted, awaiting confirmation | Compare against printed/digital edition |
| VERIFIED | Matn confirmed at cited location | Documentary accuracy only; NOT authenticity judgment |
| UNAVAILABLE | Edition not held or passage not found | Not a judgment on hadith authenticity |
| REJECTED | Citation fabricated or misattributed | Terminal; distinct from ḍaʿīf grading |

**Critical distinction:** `VERIFIED` means "this text exists at this location in this edition." It does NOT mean "this hadith is authentic." Authenticity is captured in `HadithReport.gradings[]` and assessed in ClaimSupport reasoning.

### 3.4 Review Considerations

| Aspect | Guidance |
|--------|----------|
| Grading disagreements | Multiple gradings coexist; DisagreementSet if genuine scholarly divergence |
| Isnād analysis | Requires HADITH domain expertise in ReviewerIdentity |
| Matn criticism | Separate from isnād criticism; may warrant separate ClaimSupport |
| Cross-collection variants | Each variant is independent evidence; parallelReports link for reference |
| Weak hadith usage | Permitted with explicit qualification in ClaimSupport.reasoning |

---

## 4. Integration Points

| Existing Entity | Integration |
|----------------|-------------|
| EvidenceRecord | Gains `hadithReportId` field; conditional requirement based on evidenceKind |
| Source | `sourceType: hadith-collection` identifies hadith sources |
| Edition | HadithReport references specific edition via editionId |
| ReferenceLocator | HadithReport uses structured locator per SOURCE-REGISTRY-SPEC §4 |
| ClaimSupport | Hadith grading informs but does not determine support outcome |
| DisagreementSet | Grading disagreements modeled as INTERPRETIVE or TEXTUAL disagreement |
| ReviewerIdentity | HADITH domain expertise required for hadith-related SCHOLARLY decisions |
| VerificationRecord | Hadith verification follows standard lifecycle with hadith-specific methods |

---

## 5. Implementation Prerequisites

| Prerequisite | Status | Owner |
|-------------|--------|-------|
| EvidenceRecord.evidenceKind enum with HADITH_REPORT | ✅ Defined in EVIDENCE-MODEL §3 | WS4 |
| Source.sourceType with hadith-collection | ✅ Defined in SOURCE-REGISTRY-SPEC §2 | WS4 |
| ReferenceLocator schema | ✅ Defined in SOURCE-REGISTRY-SPEC §4 | WS4 |
| HadithReport entity schema | ⏳ Proposed above | WS-B |
| Hadith collection ingestion pipeline | ❌ Pending | Data Engineering |
| Narrator biography database (future) | ❌ Deferred | Future Workstream |
| Hadith-specific verification methods | ❌ Pending | WS4 |
| Grading vocabulary alignment across traditions | ❌ Pending | Scholarly Advisory |

### 5.1 Deferred Features

The following are explicitly deferred to a future workstream:

1. **Full isnād graph**: Narrator-as-entity with biographical evaluation, teacher-student relationships, and geographic/temporal data
2. **Narrator reliability database**: Centralized jarḥ wa-taʿdīl records
3. **Automated hadith matching**: Fuzzy matn search across collections
4. **Hadith commentary integration**: Sharḥ texts linked to specific hadith reports
5. **Multi-language matn alignment**: Parallel Arabic/Urdu/English matn texts

---

*End of Specification*
