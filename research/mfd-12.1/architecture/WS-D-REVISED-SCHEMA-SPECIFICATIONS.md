# WS-D: Revised Schema Specifications (Consolidated)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 (Data Model Architecture Resolution) |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-D, agent-106) |
| Review Status | pending-scholarly-review |
| Supersedes | MFD-12-CANONICAL-DATA-MODEL.md §7 unresolved questions Q24, Q25, Q27, Q29, Q38 |
| Depends On | WS-D-SUBDIMENSION-RESOLUTION.md, WS-D-TRANSLATION-GRANULARITY-RESOLUTION.md, WS-D-LEARNING-PROGRESS-RESOLUTION.md, WS-D-IMPLICIT-EDGES-RESOLUTION.md, WS-D-CROSSLINGUAL-ALIGNMENT-RESOLUTION.md |

---

## 1. Overview

This document consolidates all schema changes proposed by WS-D to resolve five architecture-blocking data model ambiguities. These changes are **proposed revisions** to the MFD-12 Canonical Data Model and are NOT applied to production schemas until scholarly review completes.

### Resolutions Summary

| Question | Resolution | New Entities | Modified Entities | New Relationship Types |
|----------|-----------|--------------|-------------------|----------------------|
| Q24 (Subdimension) | Elevate to first-class entity | Subdimension | Dimension, Topic | None (uses EDITORIAL_CLASSIFICATION) |
| Q25 (Translation Granularity) | Separate WordTranslation entity (deferred population) | WordTranslation | None | None |
| Q29 (Learning Progress) | Separate LearningProgress entity (local-only) | LearningProgress | None | None |
| Q38 (Implicit Edges) | Generate explicit EDITORIAL_CLASSIFICATION edges | None | Domain, Dimension (documentation only) | None (uses existing type) |
| Q27 (Cross-Lingual Alignment) | Hub-and-spoke with divergence annotation | None | Concept | CROSS_LINGUAL_VARIANT |

### Net Impact
- **New entity types**: 3 (Subdimension, WordTranslation, LearningProgress)
- **Modified entity types**: 4 (Dimension, Topic, Concept, Domain documentation)
- **New relationship types**: 1 (CROSS_LINGUAL_VARIANT)
- **Total canonical entities after approval**: 24 (was 21)
- **Total relationship types after approval**: 11 (was 10)

---

## 2. New Entity Schemas

### 2.1 Subdimension

**Group**: C (Knowledge Taxonomy)
**ID Format**: `subdim-{slug}`
**Source File**: `research/mfd-12/architecture/entity-schemas/subdimension.schema.json` (to be created)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/subdimension",
  "title": "MFD-12 Subdimension",
  "description": "Fourth-level taxonomy grouping beneath Dimension. Elevated from embedded string references to first-class entity per WS-D Q24 resolution.",
  "type": "object",
  "required": ["id", "titleEn", "description", "parentDimensionId", "provenance", "reviewStatus", "schemaVersion", "contentVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^subdim-[a-z0-9-]+$" },
    "titleEn": { "type": "string", "minLength": 1 },
    "titleAr": { "type": "string" },
    "titleUr": { "type": "string" },
    "description": { "type": "string", "minLength": 1 },
    "parentDimensionId": { "type": "string", "pattern": "^dim-[a-z0-9-]+$" },
    "topicIds": { "type": "array", "items": { "type": "string", "pattern": "^topic-[a-z0-9-]+$" } },
    "aliases": { "type": "array", "items": { "type": "string", "minLength": 1 } },
    "provenance": { "$ref": "#/definitions/ProvenanceObject" },
    "reviewStatus": { "enum": ["DRAFT", "PENDING_SCHOLARLY_REVIEW", "APPROVED", "REVISED", "DEPRECATED"] },
    "schemaVersion": { "type": "string", "minLength": 1 },
    "contentVersion": { "type": "integer", "minimum": 1 }
  }
}
```

**Cross-Reference Integrity Rules**:
- `Subdimension.parentDimensionId` → MUST exist in Dimension.id
- `Subdimension.topicIds[]` → Each MUST exist in Topic.id
- `Dimension.subdimensionIds[]` → Each MUST exist in Subdimension.id
- `Topic.parentSubdimensionId` → If present, MUST exist in Subdimension.id

---

### 2.2 WordTranslation

**Group**: A (Quranic Canon)
**ID Format**: `wtrans-{lang}-{source}-v{n}-{surah}-{ayah}-{wordPos}`
**Source File**: `research/mfd-12/architecture/entity-schemas/word-translation.schema.json` (to be created)
**Status**: SCHEMA ONLY — no data population until future workstream

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/word-translation",
  "title": "MFD-12 WordTranslation",
  "description": "Per-word translation gloss for interlinear study. Optional dataset loaded on demand. Schema defined per WS-D Q25 resolution; population deferred.",
  "type": "object",
  "required": ["id", "verseId", "wordPosition", "tokenArabic", "language", "source", "version", "gloss", "licenseType", "corpusVersion", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^wtrans-[a-z]{2}-[a-z0-9-]+-v[0-9]+-[0-9]{3}-[0-9]{1,3}-[0-9]+$" },
    "verseId": { "type": "string", "pattern": "^[0-9]{1,3}:[0-9]{1,3}$" },
    "wordPosition": { "type": "integer", "minimum": 1 },
    "tokenArabic": { "type": "string", "minLength": 1 },
    "language": { "type": "string", "pattern": "^[a-z]{2}$" },
    "source": { "type": "string", "minLength": 1 },
    "version": { "type": "string", "minLength": 1 },
    "gloss": { "type": "string", "minLength": 1 },
    "grammaticalRole": { "type": "string" },
    "licenseType": { "type": "string", "minLength": 1 },
    "corpusVersion": { "type": "string", "minLength": 1 },
    "schemaVersion": { "type": "string", "minLength": 1 }
  }
}
```

**Cross-Reference Integrity Rules**:
- `WordTranslation.verseId` → MUST exist in QuranVerse.id
- `WordTranslation.wordPosition` → MUST be ≤ QuranVerse.wordCount
- `WordTranslation.corpusVersion` → MUST match QuranVerse.corpusVersion

---

### 2.3 LearningProgress

**Group**: E (User & Research Workspace)
**ID Format**: UUID v4
**Source File**: `research/mfd-12/architecture/entity-schemas/learning-progress.schema.json` (to be created)
**Storage**: Local IndexedDB only (never bundled, never synced)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/learning-progress",
  "title": "MFD-12 LearningProgress",
  "description": "Personal learning progress state for a specific module within a path. Stored locally per WS-D Q29 resolution.",
  "type": "object",
  "required": ["id", "learningPathId", "userId", "moduleId", "status", "lastActiveAt", "createdAt", "updatedAt", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "learningPathId": { "type": "string", "format": "uuid" },
    "userId": { "type": "string", "minLength": 1 },
    "moduleId": { "type": "string", "format": "uuid" },
    "status": { "enum": ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED"] },
    "startedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "lastActiveAt": { "type": "string", "format": "date-time" },
    "timeSpentSeconds": { "type": "integer", "minimum": 0 },
    "quizScore": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "attempts": { "type": "integer", "minimum": 0 },
    "notes": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "schemaVersion": { "type": "string", "minLength": 1 }
  }
}
```

**Cross-Reference Integrity Rules**:
- `LearningProgress.learningPathId` → MUST exist in LearningPath.id
- `LearningProgress.moduleId` → MUST exist in LearningModule.id AND be member of LearningPath.moduleIds[]

---

## 3. Modified Entity Schemas

### 3.1 Dimension (Modified)

**Change**: Pattern constraint on `subdimensionIds` items + documentation clarification.

In `dimension.schema.json`, change:
```json
// BEFORE
"subdimensionIds": { "type": "array", "items": { "type": "string" } }

// AFTER
"subdimensionIds": {
  "type": "array",
  "items": { "type": "string", "pattern": "^subdim-[a-z0-9-]+$" },
  "description": "References to child Subdimension entities. Authoritative containment represented by EDITORIAL_CLASSIFICATION edges per Q38 resolution."
}
```

Also add description to `topicIds`:
```json
"topicIds": {
  "type": "array",
  "items": { "type": "string", "pattern": "^topic-[a-z0-9-]+$" },
  "description": "Direct child topics. Authoritative containment represented by EDITORIAL_CLASSIFICATION edges per Q38 resolution."
}
```

### 3.2 Topic (Modified)

**Change**: Pattern constraint on `parentSubdimensionId`.

In `topic.schema.json`, change:
```json
// BEFORE
"parentSubdimensionId": { "type": "string" }

// AFTER
"parentSubdimensionId": {
  "type": "string",
  "pattern": "^subdim-[a-z0-9-]+$",
  "description": "Reference to parent Subdimension entity. Must exist in Subdimension.id if present."
}
```

### 3.3 Concept (Modified)

**Change**: Add optional `crossLingualNotes` field.

In `concept.schema.json`, add to properties:
```json
"crossLingualNotes": {
  "type": "object",
  "description": "Semantic alignment annotations across Arabic/English/Urdu per Q27 resolution.",
  "additionalProperties": false,
  "properties": {
    "alignmentConfidence": { "enum": ["CLEAN", "PARTIAL", "DIVERGENT"] },
    "enToAr": {
      "type": "object",
      "properties": {
        "note": { "type": "string" },
        "semanticGaps": { "type": "array", "items": { "type": "string" } }
      }
    },
    "enToUr": {
      "type": "object",
      "properties": {
        "note": { "type": "string" },
        "semanticGaps": { "type": "array", "items": { "type": "string" } }
      }
    },
    "arToUr": {
      "type": "object",
      "properties": {
        "note": { "type": "string" },
        "semanticGaps": { "type": "array", "items": { "type": "string" } }
      }
    },
    "scholarlySources": { "type": "array", "items": { "type": "string", "pattern": "^src-[a-z0-9-]+$" } }
  },
  "required": ["alignmentConfidence"]
}
```

### 3.4 Domain (Documentation Only)

**Change**: Clarify that `dimensionIds[]` is denormalized.

In canonical model §4J, update description:
> `dimensionIds`: Denormalized list of child Dimension IDs. Authoritative containment is represented by EDITORIAL_CLASSIFICATION Relationship entities generated during migration per Q38 resolution. This array is maintained for human readability and legacy compatibility.

No schema file change required.

---

## 4. New Relationship Type

### 4.1 CROSS_LINGUAL_VARIANT

Add to `MFD-12-RELATIONSHIP-TAXONOMY.json` → `relationship_types[]`:

```json
{
  "id": "CROSS_LINGUAL_VARIANT",
  "label": "Cross-Lingual Variant",
  "definition": "Links language-specific concept variants when 1:1 cross-lingual alignment fails. Used only when Concept.crossLingualNotes.alignmentConfidence = DIVERGENT.",
  "semantic_scope": "Captures genuine semantic divergence across Arabic, English, and Urdu concept spaces without fragmenting the default hub-and-spoke alignment model.",
  "allowed_source_types": ["concept"],
  "allowed_target_types": ["concept"],
  "directionality": "bidirectional (symmetric)",
  "cardinality": "one-to-few",
  "evidence_requirements": {
    "min_evidence_level": "scholarly-review",
    "required_fields": ["divergence_rationale", "languages_affected"]
  },
  "provenance_requirements": {
    "must_cite": true,
    "allowed_provenance_tags": ["scholarly-review", "cross-lingual-analysis"]
  },
  "example": {
    "source": "cpt-taqwa",
    "target": "cpt-god-consciousness-en",
    "description": "Arabic taqwa encompasses fear, awareness, and protective piety; English 'God-consciousness' captures only one facet."
  }
}
```

Update `RelationshipTypeEnum` in `relationship.schema.json` and `MFD-12-DATA-DICTIONARY.md` §2 to include `CROSS_LINGUAL_VARIANT`.

---

## 5. Updated Identifier Strategy Table

Additions to MFD-12-CANONICAL-DATA-MODEL.md §3:

| Entity | ID Format | Example | Rationale |
|--------|-----------|---------|----------|
| Subdimension | `subdim-{slug}` | `subdim-divine-names` | Matches taxonomy slug convention; prefixed for disambiguation |
| WordTranslation | `wtrans-{lang}-{source}-v{n}-{surah}-{ayah}-{wordPos}` | `wtrans-en-corpus-v1-002-255-4` | Composite key encoding edition + token position |
| LearningProgress | UUID v4 | `lp-x1y2z3w4-...` | Personal, device-local; no semantic meaning needed |

---

## 6. Updated Entity Groups Overview

### Group A: Quranic Canon (Immutable)
- QuranSurah, QuranVerse, Translation, **WordTranslation** ← NEW

### Group C: Knowledge Taxonomy (Mutable, Curated)
- Concept, Topic, Domain, Dimension, **Subdimension**, Relationship ← Subdimension NEW

### Group E: User & Research Workspace (Mutable, Personal)
- LearningPath, LearningModule, **LearningProgress**, ResearchWorkspace, ResearchAnnotation, SavedInvestigation ← LearningProgress NEW

---

## 7. Updated Cross-Reference Integrity Rules

Additions to MFD-12-DATA-DICTIONARY.md §4:

21. `Subdimension.parentDimensionId` → MUST exist in Dimension.id
22. `Subdimension.topicIds[]` → Each MUST exist in Topic.id
23. `Dimension.subdimensionIds[]` → Each MUST exist in Subdimension.id
24. `Topic.parentSubdimensionId` → If present, MUST exist in Subdimension.id
25. `WordTranslation.verseId` → MUST exist in QuranVerse.id
26. `WordTranslation.wordPosition` → MUST be ≤ QuranVerse.wordCount for referenced verse
27. `WordTranslation.corpusVersion` → MUST match QuranVerse.corpusVersion
28. `LearningProgress.learningPathId` → MUST exist in LearningPath.id
29. `LearningProgress.moduleId` → MUST exist in LearningModule.id AND be member of LearningPath.moduleIds[]

---

## 8. Migration Plan Amendments

### Phase 2 (Taxonomy Restructuring) — Amended
- **New Step**: Transform `data/taxonomy/subdimensions.json` (25 records) into Subdimension entities with `subdim-` prefix, provenance objects, and review status defaults.
- **New Step**: Update all Dimension records' `subdimensionIds[]` with `subdim-` prefix.
- **New Step**: Update all Topic records' `parentSubdimensionId` with `subdim-` prefix where present.
- **Phantom Handling**: Filter 89 phantom subdimension→topic refs; log but do not create stub entities.

### Phase 3 (Relationship Migration) — Amended
- **New Step**: Generate ~500 EDITORIAL_CLASSIFICATION edges from Domain.dimensionIds[], Dimension.subdimensionIds[], and Dimension.topicIds[] arrays.
- **ID Format**: `rel-{parentId}-{childId}-EDITORIAL_CLASSIFICATION` (deterministic, idempotent).
- **Provenance**: `{origin:'legacy-taxonomy', method:'array-expansion', assertedAt:migration-timestamp, assertedBy:'ws7-migration'}`.

### Phase 4 (Concept Extraction) — Amended
- **New Step**: Set `crossLingualNotes.alignmentConfidence = "CLEAN"` as default for all extracted Concepts.
- **New Step**: Flag concepts with known semantic divergence for scholarly review queue.

### New Phases (Deferred)
- **Phase N (Word Translation Population)**: Not scheduled. Schema ready; awaits corpus sourcing and licensing clearance.
- **Phase N (Learning Progress Implementation)**: Implemented at application layer when LearningPath UI is built. No canonical data migration needed.

---

## 9. Updated Relationship Map

```
QuranSurah ──1:N──▶ QuranVerse ◀──N:1── Translation
                         │                    │
                         │                    ◀──N:1── WordTranslation [NEW, DEFERRED]
                         │
                         ├──◀── EvidenceRecord ──▶ ScholarlyClaim ──▶ ReviewDecision
                         │                              │
                         ├──◀── Lemma ──▶ LexicalEntry ──▶ RootAnalysis ──▶ Source
                         │                  │                    │
                         │                  └──▶ MorphologicalAnalysis
                         │
                         └──◀── TopicAyahMapping ──▶ Topic ──▶ Domain
                                                       │         │
                                                       ├──▶ Dimension ──▶ Subdimension [NEW]
                                                       │         │              │
                                                       │         └──▶ Topic     └──▶ Topic
                                                       │
                                                       └──▶ Concept ──CROSS_LINGUAL_VARIANT──▶ Concept [NEW TYPE]
                                                                 │
                                                           Relationship (typed edges)
                                                           Types: DIRECT_QURANIC_REFERENCE, LEXICAL_RELATION,
                                                             MORPHOLOGICAL_RELATION, THEMATIC_RELATION,
                                                             TAFSIR_SUPPORTED, EDITORIAL_CLASSIFICATION,
                                                             CONTRAST, CONTEMPORARY_APPLICATION,
                                                             NARRATIVE_RELATION, CROSS_LINGUAL_VARIANT [NEW], CUSTOM
                                                                 │
                                               LearningPath ──▶ LearningModule
                                                      ▲                ▲
                                                      │                │
                                               LearningProgress [NEW, LOCAL-ONLY]
                                                                 │
                                               ResearchWorkspace ──▶ ResearchAnnotation
                                                       │
                                                       └──▶ SavedInvestigation
```

---

## 10. Implementation Checklist

Upon scholarly approval, the following actions are required:

- [ ] Create `subdimension.schema.json` in `research/mfd-12/architecture/entity-schemas/`
- [ ] Create `word-translation.schema.json` in same directory
- [ ] Create `learning-progress.schema.json` in same directory
- [ ] Update `dimension.schema.json` with pattern constraints and descriptions
- [ ] Update `topic.schema.json` with `parentSubdimensionId` pattern
- [ ] Update `concept.schema.json` with `crossLingualNotes` field
- [ ] Update `relationship.schema.json` enum to include CROSS_LINGUAL_VARIANT
- [ ] Update `MFD-12-CANONICAL-DATA-MODEL.md` with new entities, identifier table entries, relationship map
- [ ] Update `MFD-12-DATA-DICTIONARY.md` with new entity definitions, integrity rules
- [ ] Update `MFD-12-RELATIONSHIP-TAXONOMY.json` with CROSS_LINGUAL_VARIANT type
- [ ] Update `MFD-12-MIGRATION-MAP.json` with Subdimension mapping, edge generation spec
- [ ] Update `MFD-12-LOCAL-FIRST-SPEC.md` with LearningProgress IndexedDB store
- [ ] Update `MFD-12-GRAPH-INTEGRITY-RULES.md` with array-edge consistency rule
- [ ] Remove Q24, Q25, Q27, Q29, Q38 from Unresolved Questions (§7)

---

*This document is a design proposal consolidating five WS-D resolutions. No production data or schemas have been modified.*
*proposedBy: "ai-assisted (WS-D, agent-106)" | reviewStatus: "pending-scholarly-review"*
