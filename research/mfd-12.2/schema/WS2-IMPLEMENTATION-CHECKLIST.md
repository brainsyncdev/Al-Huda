# WS2: Implementation Checklist

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 (Canonical Schema Implementation Planning) |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-review |
| Prerequisite | Scholarly approval of WS-D resolutions (Q24, Q25, Q27, Q29, Q38) |

---

## 1. Overview

This checklist enumerates every file that must be created or modified during implementation of the MFD-12.2 canonical schema changes. Items are grouped by phase and dependency order. **No files should be modified until scholarly review completes.**

### Legend

- 🆕 = New file to create
- ✏️ = Existing file to modify
- 📋 = Documentation update
- ⚙️ = Code/configuration change
- 🗄️ = Data migration

---

## 2. Phase 1: Schema Files

Create new JSON Schema files in `research/mfd-12/architecture/entity-schemas/`.

- [ ] 🆕 Create `subdimension.schema.json` — Copy from `research/mfd-12.2/schema/WS2-SUBDIMENSION-SCHEMA.json` (remove `x-mfd-metadata` extension)
- [ ] 🆕 Create `word-translation.schema.json` — Copy from `research/mfd-12.2/schema/WS2-WORD-TRANSLATION-SCHEMA.json` (remove `x-mfd-metadata` extension)
- [ ] 🆕 Create `learning-progress.schema.json` — Copy from `research/mfd-12.2/schema/WS2-LEARNING-PROGRESS-SCHEMA.json` (remove `x-mfd-metadata` extension)
- [ ] ✏️ Update `dimension.schema.json` — Add pattern constraint `^subdim-[a-z0-9-]+$` to `subdimensionIds` items; add description to `subdimensionIds` and `topicIds`
- [ ] ✏️ Update `topic.schema.json` — Add pattern constraint `^subdim-[a-z0-9-]+$` to `parentSubdimensionId`; add description
- [ ] ✏️ Update `concept.schema.json` — Add optional `crossLingualNotes` object with `AlignmentNote` definition
- [ ] ✏️ Update `relationship.schema.json` — Add `CROSS_LINGUAL_VARIANT` to enum; add conditional required fields (`divergenceRationale`, `languagesAffected`) via `allOf`/`if`/`then`; add pattern constraints for CROSS_LINGUAL_VARIANT source/target

---

## 3. Phase 2: Documentation Updates

- [ ] 📋 Update `research/mfd-12/architecture/MFD-12-CANONICAL-DATA-MODEL.md`
  - Add Subdimension to Group C entity list (§4L)
  - Add WordTranslation to Group A entity list (§4C.1)
  - Add LearningProgress to Group E entity list (§4V)
  - Update Identifier Strategy Table (§3) with 3 new entries
  - Update Entity Groups Overview (§6) with new entities
  - Update Relationship Map (§8) with WordTranslation, Subdimension, CROSS_LINGUAL_VARIANT
  - Add Design Decision 6.7 (WordTranslation Separation)
  - Remove Q24, Q25, Q27, Q29, Q38 from Unresolved Questions (§7)

- [ ] 📋 Update `research/mfd-12/architecture/MFD-12-DATA-DICTIONARY.md`
  - Add §3.22 Subdimension field definitions
  - Add §3.23 WordTranslation field definitions
  - Add §3.24 LearningProgress field definitions
  - Add CrossLingualNotesObject definition to §3.8 Concept
  - Add `CROSS_LINGUAL_VARIANT` to RelationshipTypeEnum (§2)
  - Add integrity rules 21–29 to §4

- [ ] 📋 Update `research/mfd-12/architecture/MFD-12-RELATIONSHIP-TAXONOMY.json`
  - Add `CROSS_LINGUAL_VARIANT` entry to `relationship_types[]`

- [ ] 📋 Update `research/mfd-12/architecture/MFD-12-MIGRATION-MAP.json`
  - Add Subdimension entity mapping with ID prefix rule
  - Add EDITORIAL_CLASSIFICATION edge generation spec for Dimension→Subdimension
  - Add phantom reference handling procedure

- [ ] 📋 Update `research/mfd-12/architecture/MFD-12-LOCAL-FIRST-SPEC.md`
  - Add LearningProgress to §2.2 User Data table
  - Add `learningProgress` store to §3.1 IndexedDB Schema
  - Add `wordTranslations` as lazy-loadable optional dataset
  - Add `subdimensions` to canonical cache stores

- [ ] 📋 Update `research/mfd-12/architecture/MFD-12-GRAPH-INTEGRITY-RULES.md`
  - Add array-edge consistency rule: `Dimension.subdimensionIds[]` ↔ `Subdimension.parentDimensionId`
  - Add array-edge consistency rule: `Subdimension.topicIds[]` ↔ `Topic.parentSubdimensionId`

---

## 4. Phase 3: TypeScript Implementation

- [ ] ⚙️ Create `src/types/entities/subdimension.ts` — Interface + type guard (from WS2-TYPESCRIPT-INTERFACES.md §3)
- [ ] ⚙️ Create `src/types/entities/word-translation.ts` — Interface + type guard (from WS2-TYPESCRIPT-INTERFACES.md §4)
- [ ] ⚙️ Create `src/types/entities/learning-progress.ts` — Interface + type guard (from WS2-TYPESCRIPT-INTERFACES.md §5)
- [ ] ⚙️ Update `src/types/entities/relationship.ts` — Add CROSS_LINGUAL_VARIANT to enum; add CrossLingualVariantRelationship interface; add type guard
- [ ] ⚙️ Update `src/types/entities/concept.ts` — Add CrossLingualNotes interface; add optional crossLingualNotes field to Concept
- [ ] ⚙️ Update `src/types/entities/index.ts` — Export new entity types; update CanonicalEntity union; update EntityType union
- [ ] ⚙️ Update `src/types/validation.ts` — Add Subdimension, WordTranslation, LearningProgress validation functions

---

## 5. Phase 4: Storage Adapters

- [ ] ⚙️ Create `src/storage/adapters/subdimension-adapter.ts` — Implement SubdimensionStorageAdapter interface
- [ ] ⚙️ Create `src/storage/adapters/word-translation-adapter.ts` — Implement WordTranslationStorageAdapter interface
- [ ] ⚙️ Create `src/storage/adapters/learning-progress-adapter.ts` — Implement LearningProgressStorageAdapter interface
- [ ] ⚙️ Update `src/storage/db.ts` — Increment DB_VERSION; add onupgradeneeded handlers for 3 new stores with indexes
- [ ] ⚙️ Update `src/storage/adapter-registry.ts` — Register new adapters

---

## 6. Phase 5: Data Migration

- [ ] 🗄️ Create `scripts/migrations/migrate-subdimensions.ts` — Implement transformation per WS2-SUBDIMENSION-MIGRATION-SPEC.md
- [ ] 🗄️ Create `scripts/migrations/update-dimension-subdim-refs.ts` — Prefix Dimension.subdimensionIds[]
- [ ] 🗄️ Create `scripts/migrations/update-topic-subdim-refs.ts` — Prefix Topic.parentSubdimensionId
- [ ] 🗄️ Create `scripts/migrations/generate-editorial-classification-edges.ts` — Generate Dimension→Subdimension edges
- [ ] 🗄️ Run migration against test dataset; validate output
- [ ] 🗄️ Append ID alias entries to `MFD-12-ID-ALIAS-TABLE.json`
- [ ] 🗄️ Execute production migration
- [ ] 🗄️ Post-migration validation (all checks in WS2-SUBDIMENSION-MIGRATION-SPEC.md §7)

---

## 7. Phase 6: Bundle & Build Integration

- [ ] ⚙️ Update canonical bundle manifest (`manifest.json`) — Add subdimensions entry
- [ ] ⚙️ Update bundle build script — Include subdimensions.json in canonical output
- [ ] ⚙️ Update backup/export logic — Include learning-progress.json in user data bundle
- [ ] ⚙️ Update import/restore logic — Handle learning-progress.json merge
- [ ] ⚙️ Update entity loader — Register Subdimension entity type for canonical loading
- [ ] ⚙️ Update entity loader — Register WordTranslation as lazy-loadable optional dataset

---

## 8. Phase 7: Testing

- [ ] ⚙️ Create unit tests for Subdimension schema validation
- [ ] ⚙️ Create unit tests for WordTranslation schema validation
- [ ] ⚙️ Create unit tests for LearningProgress schema validation
- [ ] ⚙️ Create unit tests for updated Relationship schema (including CROSS_LINGUAL_VARIANT conditional validation)
- [ ] ⚙️ Create unit tests for Subdimension cross-reference validation
- [ ] ⚙️ Create unit tests for WordTranslation cross-reference validation
- [ ] ⚙️ Create unit tests for LearningProgress cross-reference validation
- [ ] ⚙️ Create integration tests for Subdimension migration script
- [ ] ⚙️ Create integration tests for IndexedDB store creation and indexing
- [ ] ⚙️ Create integration tests for LearningProgress adapter CRUD operations
- [ ] ⚙️ Create integration tests for WordTranslation adapter import/query operations
- [ ] ⚙️ Run full test suite; verify no regressions

---

## 9. Files Modified Summary

### New Files (10)

| File | Purpose |
|------|---------|
| `research/mfd-12/architecture/entity-schemas/subdimension.schema.json` | Subdimension JSON Schema |
| `research/mfd-12/architecture/entity-schemas/word-translation.schema.json` | WordTranslation JSON Schema |
| `research/mfd-12/architecture/entity-schemas/learning-progress.schema.json` | LearningProgress JSON Schema |
| `src/types/entities/subdimension.ts` | TypeScript interface |
| `src/types/entities/word-translation.ts` | TypeScript interface |
| `src/types/entities/learning-progress.ts` | TypeScript interface |
| `src/storage/adapters/subdimension-adapter.ts` | Storage adapter |
| `src/storage/adapters/word-translation-adapter.ts` | Storage adapter |
| `src/storage/adapters/learning-progress-adapter.ts` | Storage adapter |
| `scripts/migrations/migrate-subdimensions.ts` | Migration script (+ 3 helper scripts) |

### Modified Files (14)

| File | Change |
|------|--------|
| `research/mfd-12/architecture/entity-schemas/dimension.schema.json` | Pattern constraints on subdimensionIds |
| `research/mfd-12/architecture/entity-schemas/topic.schema.json` | Pattern constraint on parentSubdimensionId |
| `research/mfd-12/architecture/entity-schemas/concept.schema.json` | Add crossLingualNotes field |
| `research/mfd-12/architecture/entity-schemas/relationship.schema.json` | Add CROSS_LINGUAL_VARIANT + conditional fields |
| `research/mfd-12/architecture/MFD-12-CANONICAL-DATA-MODEL.md` | New entities, identifiers, relationship map |
| `research/mfd-12/architecture/MFD-12-DATA-DICTIONARY.md` | Field definitions, integrity rules, enum update |
| `research/mfd-12/architecture/MFD-12-RELATIONSHIP-TAXONOMY.json` | New relationship type |
| `research/mfd-12/architecture/MFD-12-MIGRATION-MAP.json` | Subdimension mapping, edge generation |
| `research/mfd-12/architecture/MFD-12-LOCAL-FIRST-SPEC.md` | New stores, lazy-load dataset |
| `research/mfd-12/architecture/MFD-12-GRAPH-INTEGRITY-RULES.md` | Array-edge consistency rules |
| `src/types/entities/index.ts` | Exports, union types |
| `src/types/validation.ts` | New validation functions |
| `src/storage/db.ts` | DB version upgrade, new stores |
| `src/storage/adapter-registry.ts` | Register new adapters |

---

## 10. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Phantom topic refs cause data loss | Low | Medium | Phantom logging + no stub creation; manual audit post-migration |
| IndexedDB upgrade fails on older browsers | Low | High | Feature detection + graceful degradation; old DB continues working |
| WordTranslation corpus misalignment | Medium | Medium | Deferred population; corpus version pinning enforced at import |
| CROSS_LINGUAL_VARIANT edges created prematurely | Low | Low | Schema-only now; edges created only during scholarly review |
| Migration script corrupts Dimension/Topic refs | Low | High | ID alias table + rollback procedure; test against copy first |

---

*This document is a design proposal. No production code or data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-review"*
