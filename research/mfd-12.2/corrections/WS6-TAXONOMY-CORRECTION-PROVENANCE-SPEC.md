# WS6 Taxonomy Correction Provenance Register Specification

- **Workstream:** MFD-12.2 WS6 (Art-Boundaries Mapping Corrections & Provenance Register)
- **Agent:** WS6 / agent-116
- **Generated At:** 2026-11-21T10:00:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-review
- **Scope:** RESEARCH AND DOCUMENTATION ONLY — no production data modified

---

## 1. Purpose

This specification defines the format and governance for an **append-only Taxonomy Correction Provenance Register** that maintains a permanent, auditable history of all taxonomy corrections. Every change to topic-ayah mappings, topic definitions, dimension structures, or domain organization must be recorded in this register before implementation.

### Design Principles

1. **Append-only:** Corrections are never deleted or overwritten. Superseded corrections reference their predecessors.
2. **Traceable:** Every correction links to the original mapping, the corrected mapping, the evidence, and the decision authority.
3. **Auditable:** Any stakeholder can reconstruct the full history of any mapping by following the provenance chain.
4. **Non-destructive:** The register documents changes; it does not directly modify production data. Implementation is a separate step.
5. **Scholarly accountability:** Corrections requiring scholarly judgment are clearly distinguished from objective error corrections.

---

## 2. Register Entry Schema

Each correction entry MUST contain the following fields:

```json
{
  "correctionId": "string",
  "correctionType": "enum",
  "originalMappingId": "string",
  "correctedMappingId": "string | null",
  "evidenceVerseKey": "string",
  "reason": "string",
  "evidenceSummary": "string",
  "priorDecisionId": "string | null",
  "proposedBy": "string",
  "correctionDate": "ISO 8601 datetime",
  "reviewStatus": "enum",
  "reviewedBy": "string | null",
  "reviewDate": "ISO 8601 datetime | null",
  "implementedBy": "string | null",
  "implementationDate": "ISO 8601 datetime | null",
  "supersededBy": "string | null",
  "notes": "string | null"
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `correctionId` | string | Yes | Unique identifier. Format: `CORR-{YYYYMMDD}-{NNN}` (e.g., CORR-20261121-001) |
| `correctionType` | enum | Yes | One of: `objective-misclassification`, `lexical-attribution-error`, `scope-redefinition`, `structural-reorganization`, `scholarly-reinterpretation`, `duplicate-removal` |
| `originalMappingId` | string | Yes | The mapping ID being corrected (e.g., `map-art-boundaries-0716`) |
| `correctedMappingId` | string/null | Yes | New mapping ID after correction, or null if mapping is deleted |
| `evidenceVerseKey` | string | Yes | Surah:Ayah reference (e.g., `31:6`) |
| `reason` | string | Yes | Concise explanation of why the correction is needed |
| `evidenceSummary` | string | Yes | Summary of textual/lexical/scholarly evidence supporting the correction |
| `priorDecisionId` | string/null | No | Reference to a prior scholarly decision or correction that this builds upon |
| `proposedBy` | string | Yes | Agent or person proposing the correction (e.g., `ai-assisted`, `ws-a-agent-103`) |
| `correctionDate` | datetime | Yes | ISO 8601 timestamp when correction was proposed |
| `reviewStatus` | enum | Yes | One of: `pending-review`, `approved`, `rejected`, `deferred`, `superseded` |
| `reviewedBy` | string/null | Conditional | Scholar or reviewer who approved/rejected (required when status ≠ pending-review) |
| `reviewDate` | datetime/null | Conditional | When review decision was made |
| `implementedBy` | string/null | No | Agent or person who executed the correction in production data |
| `implementationDate` | datetime/null | No | When correction was applied to production files |
| `supersededBy` | string/null | No | If this correction was later superseded, reference to the newer correctionId |
| `notes` | string/null | No | Additional context, cross-references, or implementation details |

---

## 3. Correction Types

### 3.1 objective-misclassification
A mapping where the verse content demonstrably does not match the assigned topic. No scholarly interpretation supports the current classification.

**Example:** 17:32 (sexual morality) mapped to art-boundaries.

**Evidence standard:** Primary text comparison sufficient. No scholarly deliberation required.

### 3.2 lexical-attribution-error
A mapping where the Arabic root cited or implied does not match the actual root in the verse.

**Example:** 13:28 (ṭ-m-n applied to qalb) mapped to nafs-mutmainna.

**Evidence standard:** Morphological analysis of Arabic text. No scholarly deliberation required.

### 3.3 scope-redefinition
A topic whose scope description includes content not supported by its mapped verses or derived from non-Qur'anic sources.

**Example:** husn-concept scope citing hadith "Allah is beautiful" as if Qur'anic.

**Evidence standard:** Source verification. May require scholarly decision on whether to retain, redefine, or remove.

### 3.4 structural-reorganization
Domain, dimension, or topic restructuring that moves multiple mappings without changing individual mapping validity.

**Example:** Dissolving arts-beauty-aesthetics domain and redistributing topics.

**Evidence standard:** Architectural rationale. Requires scholarly or project-level decision.

### 3.5 scholarly-reinterpretation
A correction based on interpretive judgment where multiple valid readings exist.

**Example:** Whether 2:208 should map to both salām and silm meanings.

**Evidence standard:** Scholarly council decision required. Must cite positions considered.

### 3.6 duplicate-removal
Removing redundant mappings where the same verse-topic pair appears multiple times.

**Evidence standard:** Deduplication check. No scholarly deliberation required.

---

## 4. Governance Rules

### 4.1 Append-Only Enforcement

- Corrections are NEVER deleted from the register.
- If a correction is found to be incorrect, a NEW correction entry supersedes it (setting `supersededBy` on the old entry).
- The register file is append-only at the file level (new entries added to end of array).

### 4.2 Review Requirements by Type

| Correction Type | Minimum Review Level | Can Auto-Approve? |
|----------------|---------------------|-------------------|
| objective-misclassification | Project lead acknowledgment | Yes (upon acknowledgment) |
| lexical-attribution-error | Project lead acknowledgment | Yes (upon acknowledgment) |
| scope-redefinition | Scholarly council | No |
| structural-reorganization | Scholarly council + technical review | No |
| scholarly-reinterpretation | Scholarly council | No |
| duplicate-removal | Technical review | Yes |

### 4.3 Pre-Implementation Checklist

Before any correction is implemented in production data:

- [ ] Correction entry exists in register with `reviewStatus: approved`
- [ ] `reviewedBy` and `reviewDate` are populated
- [ ] Target topic/dimension exists or creation is documented
- [ ] Cross-references (relationships.json) updated if affected
- [ ] Batch files (batch12-remaining.json etc.) synchronized
- [ ] Implementation recorded with `implementedBy` and `implementationDate`

---

## 5. Storage Format

### 5.1 File Location

```
data/taxonomy/provenance/correction-register.json
```

### 5.2 File Structure

```json
{
  "schemaVersion": "1.0.0",
  "lastUpdated": "2026-11-21T10:00:00+05:00",
  "totalCorrections": 7,
  "corrections": [
    {
      "correctionId": "CORR-20261121-001",
      "correctionType": "objective-misclassification",
      "originalMappingId": "map-art-boundaries-0716",
      "correctedMappingId": null,
      "evidenceVerseKey": "31:6",
      "reason": "Verse addresses lahw al-ḥadīth (idle speech), not art boundaries",
      "evidenceSummary": "Classical tafsir unanimously interprets 31:6 as idle/diverting speech. No art connection.",
      "priorDecisionId": null,
      "proposedBy": "ai-assisted",
      "correctionDate": "2026-11-21T09:58:00+05:00",
      "reviewStatus": "pending-review",
      "reviewedBy": null,
      "reviewDate": null,
      "implementedBy": null,
      "implementationDate": null,
      "supersededBy": null,
      "notes": "Part of WS6 art-boundaries correction batch (4 mappings)"
    }
  ]
}
```

### 5.3 Versioning

- Schema version follows semver (major.minor.patch).
- Breaking schema changes increment major version.
- New optional fields increment minor version.
- Documentation-only changes increment patch version.

---

## 6. Initial Register Entries

The following corrections should be the first entries when the register is created:

| CorrID | Type | Original | Verse | Status |
|--------|------|----------|-------|--------|
| CORR-20261121-001 | objective-misclassification | map-art-boundaries-0716 | 31:6 | pending-review |
| CORR-20261121-002 | objective-misclassification | map-art-boundaries-0717 | 17:32 | pending-review |
| CORR-20261121-003 | objective-misclassification | map-art-boundaries-0718 | 24:19 | pending-review |
| CORR-20261121-004 | objective-misclassification | map-art-boundaries-0719 | 49:11 | pending-review |
| CORR-20261121-005 | lexical-attribution-error | map-peace-agreements-0708 | 5:1 | pending-review |
| CORR-20261121-006 | lexical-attribution-error | map-peace-agreements-0709 | 16:91 | pending-review |
| CORR-20261121-007 | lexical-attribution-error | map-nafs-mutmainna-0311 | 13:28 | pending-review |

---

## 7. Integration Points

### 7.1 Mapping Records
Each mapping in `topic-ayah-mappings.json` SHOULD include an optional `correctionHistory` field:

```json
{
  "id": "map-art-boundaries-0716",
  "correctionHistory": ["CORR-20261121-001"]
}
```

### 7.2 Topic Records
Topics affected by corrections SHOULD reference relevant correction IDs in metadata.

### 7.3 Audit Trail
The register enables reconstruction of any mapping's full history:
1. Start with current mapping record
2. Follow `correctionHistory` references to register entries
3. Follow `priorDecisionId` chains for historical context
4. Follow `supersededBy` chains for evolution tracking

---

## 8. Future Enhancements

- **Automated validation:** Script to verify all implemented corrections have approved register entries
- **Diff generation:** Tool to generate migration scripts from approved correction entries
- **Dashboard:** Web UI showing correction pipeline status
- **Scholarly annotation:** Extended fields for scholarly reasoning when applicable
- **Cross-register linking:** Link to external scholarly review decisions

---

## Metadata

- **proposedBy:** ai-assisted
- **reviewStatus:** pending-review
- **specificationVersion:** 1.0.0
- **productionDataModified:** No — specification document only

---

*This specification was produced by AI assistance. Adoption requires project-level approval.*