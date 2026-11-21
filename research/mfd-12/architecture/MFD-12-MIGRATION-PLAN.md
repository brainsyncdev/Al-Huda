# MFD-12 — Migration Plan

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Work Package | WS7 — Migration & Compatibility |
| Date | 2026-11-21 |
| Status | draft-design |
| Companion Documents | MFD-12-MIGRATION-MAP.json, MFD-12-COMPATIBILITY-REPORT.md, MFD-12-ROLLBACK-PLAN.md |

---

## 1. Executive Summary

This plan defines the ordered sequence of transformations required to migrate existing production data (`data/taxonomy/`, `data/root-occurrences/`) into the MFD-12 Canonical Data Model (21 entities). The migration is **non-destructive**: legacy files are preserved until validation passes, and rollback is always possible.

**Key Statistics:**
- Entities inventoried: 8 distinct legacy data types across 3 directories
- Total legacy records: ~2,861 taxonomy records + 1,576 root-occurrence files + 11 audit files
- Mapping coverage: ~65% of canonical entities have direct or partial legacy sources; 13 of 21 canonical entities have NO legacy data (new constructs)
- Phantom references discovered: 243 total (154 in relatedTopicIds, 89 in subdimension→topic refs)
- Critical risks: 3 (see §8)

---

## 2. Pre-Migration Prerequisites

### 2.1 Backup Production State
- Create a complete snapshot of `data/` directory before any transformation
- Tag as `pre-mfd12-migration-{timestamp}`
- Verify backup integrity via checksum

### 2.2 Resolve Unanswered Design Questions
Before migration begins, WS1 must resolve:
1. **Subdimension status**: Elevate to first-class entity or embed? Current plan assumes embedding in Dimension.subdimensionIds.
2. **ID prefix strategy**: Confirm whether existing bare slugs (`belief-theology`) get prefixed (`dom-belief-theology`) or remain unchanged.
3. **Corpus version pin**: Confirm exact `quran-json` version string for all `corpusVersion` fields.

### 2.3 Tooling Requirements
- JSON Schema validator supporting Draft 2020-12
- Referential integrity checker (cross-entity ID validation)
- UTF-8 encoding verifier (legacy Urdu titles show mojibake patterns)

---

## 3. Migration Phases (Ordered)

### Phase 1: Immutable Canon Foundation
**Dependencies**: None
**Entities**: QuranSurah, QuranVerse, Translation

1. Transform `data/taxonomy/surahs-meta.json` → QuranSurah entities
   - Add `corpusVersion: "quran-json@3.1.2"`
   - Add `schemaVersion: "1.0.0"`
   - Generate IDs as `surah-{zero-padded-number}`
2. QuranVerse entities: sourced from pinned corpus, not legacy data
3. Translation entities: sourced from pinned corpus translations

**Validation Checkpoint V1**: All 114 surahs validate against `quran-surah.schema.json`. Verse count matches `totalVerses` per surah.

---

### Phase 2: Taxonomy Skeleton
**Dependencies**: Phase 1
**Entities**: Domain, Dimension, Subdimension (resolution pending)

1. Transform `data/taxonomy/domains.json` (20 records) → Domain entities
   - Prefix IDs: `dom-{existing-id}`
   - Inject default ProvenanceObject
   - Set `reviewStatus: "PENDING_SCHOLARLY_REVIEW"`
   - Set `contentVersion: 1`
2. Transform `data/taxonomy/dimensions.json` (103 records) → Dimension entities
   - Prefix IDs: `dim-{existing-id}`
   - Map `parentDomainId` → prefixed domain reference
   - Inject defaults for missing required fields
3. Handle `data/taxonomy/subdimensions.json` (25 records)
   - If embedded: merge into parent Dimension's `subdimensionIds` array
   - If elevated: create separate entity records

**Validation Checkpoint V2**: 
- All 20 domains validate against `domain.schema.json`
- All 103 dimensions reference valid domain IDs
- Zero orphaned parentDomainId references (currently 0 phantoms confirmed)

---

### Phase 3: Topic Migration & Phantom Cleanup
**Dependencies**: Phase 2
**Entities**: Topic

1. Transform `data/taxonomy/topics.json` (184 records) → Topic entities
   - Prefix IDs: `topic-{existing-id}`
   - Map `parentDomainId`, `parentDimensionId` to prefixed references
   - Restructure `ayahMappings` from string ID references to embedded TopicAyahMappingObj arrays (join with Phase 4 data)
2. **Phantom Reference Remediation**:
   - Filter out 154 phantom `relatedTopicIds` (41.6% of 370 refs)
   - Log each phantom for scholarly review (these represent planned-but-uncreated topics)
   - Do NOT create stub topics for phantoms; preserve as audit trail
3. Convert `provenance` string values to ProvenanceObject structure
4. Decode/fix mojibake in `urduTitle` fields (UTF-8 encoding issues detected)

**Validation Checkpoint V3**:
- All 184 topics validate against `topic.schema.json`
- Zero references to non-existent domain/dimension IDs
- Phantom log produced for scholarly review

---

### Phase 4: Ayah Mapping Restructuring
**Dependencies**: Phase 3
**Entities**: TopicAyahMapping (embedded in Topic)

1. Read `data/taxonomy/topic-ayah-mappings.json` (789 records)
2. Group by `topicId`
3. For each group, embed into corresponding Topic's `ayahMappings` array
4. Transform fields:
   - `surahNumber` + `ayahStart` → `verseId: "{surah}:{ayah}"`
   - Add `evidenceClass` default based on `mappingType` (DIRECT_REFERENCE → EXPLICIT_TEXT, else THEMATIC)
   - Preserve `rationale`, `sourceIds`, `provenance`
5. Confirmed: 0 phantom topicId references in mappings (all 789 map to existing topics)

**Validation Checkpoint V4**: Every Topic has ≥1 ayahMapping. Total embedded mappings = 789. No orphaned mapping records.

---

### Phase 5: Relationship Transformation
**Dependencies**: Phase 3
**Entities**: Relationship

1. Transform `data/taxonomy/relationships.json` (150 records) → Relationship entities
2. Type mapping:
   - `CONTAINS` → `CONTAINS` (direct)
   - `CROSS_REFERENCES` → `CROSS_REFERENCES` (direct)
   - `SHARES_CONCEPT` → `RELATED` with optional `customType: "SHARES_CONCEPT"` (deprecated in favor of Concept-based EXPRESSES)
3. Prefix source/target IDs based on resolved entity type
4. Add `bidirectional` field: false for CONTAINS, true for CROSS_REFERENCES/RELATED
5. Convert string provenance to ProvenanceObject

**Validation Checkpoint V5**: All 150 relationships validate. Source and target IDs resolve to existing entities. Zero phantom refs (confirmed by inventory).

---

### Phase 6: Lexical Decomposition
**Dependencies**: Phase 1 (for verse references)
**Entities**: LexicalEntry, RootAnalysis, Lemma

1. Process each of 1,576 `data/root-occurrences/{root}.json` files
2. For each file:
   - Create 1 LexicalEntry per unique slug
   - Create 1+ RootAnalysis per root in `entry.roots[]`
   - Create N Lemma entities per `includedLemmas[]` entry
   - Map `occurrences[]` array to Lemma.occurrences (OccurrenceRef format)
3. Compute `totalOccurrences` and `distinctAyahCount` per Lemma
4. Set `corpusVersion: "quran-json@3.1.2"` on all Lemma entities
5. Default `partOfSpeech: "OTHER"` pending morphological analysis
6. Convert `reviewState: "auto-accepted"` → `morphConfidence: "MEDIUM"`

**Validation Checkpoint V6**: 
- Total LexicalEntries ≤ 1,576 (some roots share slugs)
- All OccurrenceRef.verseIds resolve to valid QuranVerse entities
- File size verification: largest file (قول.json at 425KB) processes without memory issues

---

### Phase 7: Concept Extraction (Scholarly Task)
**Dependencies**: Phase 3, Phase 5
**Entities**: Concept, new Relationship(EXPRESSES) edges

1. This phase is **NOT fully automatable**. It requires scholarly input.
2. Automated preparation steps:
   - Cluster topics by shared ayahMappings overlap
   - Identify candidate concepts from recurring title/description patterns
   - Generate draft Concept entities with `reviewStatus: "DRAFT"`
3. Scholarly review steps:
   - Validate concept boundaries
   - Assign `definition` text
   - Link Topics to Concepts via `conceptIds` arrays
   - Create EXPRESSES relationships

**Validation Checkpoint V7**: Every Concept has ≥1 linked Topic. No duplicate concept definitions. Scholarly sign-off recorded as ReviewDecision.

---

### Phase 8: Provenance & Review History Seeding
**Dependencies**: All prior phases
**Entities**: ReviewDecision (append-only seeding)

1. For every migrated entity, create an initial ReviewDecision:
   - `decision: "ENDORSE"` (for automated migration)
   - `reviewerRole: "AUTOMATED"`
   - `rationale: "Seeded during MFD-12 migration from legacy taxonomy v1"`
   - `decidedAt`: migration execution timestamp
2. This establishes the append-only audit chain baseline
3. Legacy `provenance: "pending-scholarly-review"` strings are converted to structured ProvenanceObjects, preserving the original intent

**Validation Checkpoint V8**: Entity count of ReviewDecisions = total migrated mutable entities. All decisions are APPEND-ONLY compliant.

---

## 4. Implicit Relationship Gaps

The following relationships are implicit in current data but lack explicit typed edges in either the legacy or canonical taxonomy:

| Implicit Pattern | Legacy Evidence | Canonical Resolution |
|-----------------|-----------------|---------------------|
| Domain→Dimension containment | `domains.dimensionIds[]` array | Explicit `CONTAINS` Relationship entities (Phase 5 covers existing ones; array-based refs become redundant) |
| Dimension→Topic containment | `dimensions.topicIds[]` array | Same as above; currently no Relationship records for these — **GAP: ~hundreds of implicit CONTAINS edges not in relationships.json** |
| Subdimension→Topic membership | `subdimensions.topicIds[]` array | Same gap; 115 implicit edges, 89 pointing to phantom topics |
| Topic↔Topic peer relation | `topics.relatedTopicIds[]` | Only 216 of 370 refs are valid; need CROSS_REFERENCES or RELATED edges created for these |
| Root→Lemma derivation | `root-occurrences.entry.includedLemmas[]` | DERIVED_FROM relationship type exists in canonical enum but not in legacy data |

**Action Required**: Phase 5 must be expanded to generate CONTAINS relationships from array-based references in domains.json and dimensions.json, not just from the existing relationships.json file. Estimated additional relationships: ~300-500.

---

## 5. Deprecated Field Handling

| Legacy Field | Canonical Fate | Rationale |
|-------------|---------------|-----------|
| `topics.slug` | Dropped (redundant with `id`) | Canonical model uses `id` as primary identifier |
| `topics.scope` | Merged into `description` | Canonical model has single description field |
| `topics.quranicRelevance` | Dropped (derived from ayahMappings count) | Computed property, not stored |
| `topics.provenance` (string) | Transformed to ProvenanceObject | Structured provenance required |
| `relationships.provenance` (string) | Transformed to ProvenanceObject | Same |
| `topic-ayah-mappings.status` | Dropped | Replaced by ReviewDecision chain |
| `root-occurrences.entry.reviewState` | Mapped to `morphConfidence` enum | Standardized confidence levels |
| Batch files (`batch*.json`, `*.ps1`) | Archived, not migrated | Build artifacts, not knowledge data |

---

## 6. Default Values for New Required Fields

All entities gain these fields during migration:

| Field | Default Value | Notes |
|-------|--------------|-------|
| `schemaVersion` | `"1.0.0"` | First canonical version |
| `contentVersion` | `1` | Initial migration = version 1 |
| `reviewStatus` | `"PENDING_SCHOLARLY_REVIEW"` | All migrated data requires re-validation |
| `provenance.origin` | `"legacy-taxonomy-v1"` | Identifies pre-migration source |
| `provenance.method` | `"automated-migration-ws7"` | Identifies migration process |
| `provenance.assertedAt` | `{migration-timestamp}` | ISO 8601 execution time |
| `provenance.assertedBy` | `"ws7-migration-agent"` | Agent identifier |
| `createdAt` | `{migration-timestamp}` | Preserves temporal ordering |
| `updatedAt` | `{migration-timestamp}` | Same as createdAt for initial migration |

---

## 7. Validation Strategy

### 7.1 Schema Validation
Every output entity MUST validate against its corresponding JSON Schema in `entity-schemas/`.

### 7.2 Referential Integrity
Run cross-entity validation after each phase:
- All foreign key references resolve to existing entities
- No circular containment (Domain→Dimension→Domain)
- Ayah mappings reference valid verse IDs

### 7.3 Semantic Drift Detection
- Compare pre-migration topic counts per domain against post-migration
- Verify no topics were silently dropped (except confirmed phantoms)
- Spot-check 10% of migrated entities manually

### 7.4 Rollback Trigger Conditions
Migration halts and rolls back if:
- Schema validation failure rate > 1%
- Referential integrity violations > 0 (after phantom remediation)
- Any data loss detected beyond confirmed phantom removal

---

## 8. Risk Assessment

### 8.1 CRITICAL Risks

| # | Risk | Impact | Likelihood | Mitigation |
|---|------|--------|------------|------------|
| R1 | **243 phantom references lost** | Medium-High | Certain (already quantified) | Log all phantoms to `migration-phantom-log.json`; scholarly review determines if stub topics needed |
| R2 | **Concept extraction quality** | High | High (scholarly task) | Phase 7 produces DRAFT concepts only; nothing promoted without ReviewDecision |
| R3 | **Encoding corruption in Urdu/Arabic titles** | Medium | Detected (mojibake in topics.json urduTitle) | UTF-8 normalization pass before migration; verify round-trip encoding |

### 8.2 MODERATE Risks

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R4 | Implicit CONTAINS edges not generated | Medium | Expand Phase 5 to derive from array references |
| R5 | Large root-occurrence files (قول.json = 425KB) cause memory issues | Low | Stream processing, not bulk load |
| R6 | ID prefix changes break external links/bookmarks | Medium | Maintain ID alias table mapping old→new IDs |
| R7 | Subdimension design decision delays migration | Low | Proceed with embedding approach; reversible |

### 8.3 LOW Risks

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| R8 | Provenance timestamps inconsistent | Low | Use single migration execution timestamp |
| R9 | Batch artifact archival incomplete | Negligible | Document location of archived build scripts |

---

## 9. Post-Migration Verification

1. Run full schema validation suite against all 21 entity types
2. Execute referential integrity checker across all entity graphs
3. Compare record counts: pre-migration vs post-migration (expected deltas documented)
4. Load migrated data into test environment; verify UI renders correctly
5. Scholarly team reviews phantom log and concept candidates
6. Sign-off triggers transition from `PENDING_SCHOLARLY_REVIEW` to `APPROVED` per entity

---

## 10. Timeline Dependencies

```
Phase 1 (Canon) ──┬──▶ Phase 2 (Skeleton) ──▶ Phase 3 (Topics) ──┬──▶ Phase 4 (Mappings)
                  │                                               │
                  └──▶ Phase 6 (Lexical)                          ├──▶ Phase 5 (Relationships)
                                                                  │
                                                                  └──▶ Phase 7 (Concepts) ──▶ Phase 8 (Provenance)
```

- Phases 1-6 are mechanically executable
- Phase 7 requires scholarly participation
- Phase 8 runs last to seed the append-only review chain

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
