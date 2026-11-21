# WS-D: Q24 — Subdimension Entity Resolution

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 (Data Model Architecture Resolution) |
| Question | Q24 from FAHM Programme Dashboard §39 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-D, agent-106) |
| Review Status | pending-scholarly-review |

---

## 1. CURRENT STATE

### Legacy Data (`data/taxonomy/subdimensions.json`)
- **25 subdimension records** exist as a standalone JSON array.
- Each record has: `id` (slug), `title`, `description`, `parentDimensionId`, `topicIds[]`.
- Subdimensions are referenced by dimensions via `Dimension.subdimensionIds[]` (an array of string IDs).
- 13 of 103 dimensions have non-empty `subdimensionIds[]` arrays; the remaining 90 have empty arrays.
- Topics reference subdimensions via `Topic.parentSubdimensionId` (a free string, not validated against any schema).
- The migration map (`MFD-12-MIGRATION-MAP.json`) marks this as `"embed-or-elevate"` with `"canonicalTarget": ["Dimension.subdimensionIds (embedded)"]`.

### Canonical Model (`MFD-12-CANONICAL-DATA-MODEL.md`)
- Section 4K (Dimension) lists `subdimensionIds: array<string>` as optional child subdimensions.
- No `Subdimension` entity type is defined in Group C (Knowledge Taxonomy).
- Section 7 (Unresolved Questions) explicitly flags this: "Should Subdimension be a first-class entity type in MFD-12, or remain an embedded property of Dimension?"
- The identifier strategy table (§3) has no entry for Subdimension.

### Relationship Taxonomy
- `EDITORIAL_CLASSIFICATION` allows `source_types: ["domain", "dimension", "subdimension"]` and `target_types: ["dimension", "subdimension", "topic"]`.
- This implies the graph spec already anticipates subdimensions as potential node types, but the canonical model does not define them.

---

## 2. OPTION ANALYSIS

### Option A: Keep Embedded (Status Quo)
Subdimensions remain as string IDs within `Dimension.subdimensionIds[]`. Topic references to subdimensions stay as unvalidated `parentSubdimensionId` strings.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Zero new entities; minimal schema change; matches current data structure; lower migration complexity |
| **Cons** | No schema validation for subdimension references; topics point to unvalidated strings; cannot attach provenance/review status to subdimensions; graph traversal requires special-casing; inconsistent with Domain/Dimension first-class treatment |
| **Query Impact** | Finding all topics under a subdimension requires scanning all topics for matching `parentSubdimensionId` string; no indexed lookup |
| **UI Rendering** | Programme dashboard and knowledge graph must treat subdimensions as second-class; tree navigation needs custom logic |
| **Migration** | Trivial: copy strings as-is |

### Option B: Elevate to First-Class Entity (Recommended)
Create a `Subdimension` entity type in Group C with its own schema, ID format (`subdim-{slug}`), provenance, review status, and versioning. Replace `Dimension.subdimensionIds[]` with explicit `EDITORIAL_CLASSIFICATION` relationships or validated foreign keys. Update `Topic.parentSubdimensionId` to reference `Subdimension.id` with pattern validation.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Full schema validation; consistent taxonomy hierarchy (Domain→Dimension→Subdimension→Topic); each subdimension carries provenance, review status, multilingual titles; graph traversal treats all levels uniformly; enables future expansion without schema redesign |
| **Cons** | Adds 1 new entity type (total 22); requires 25 new entity records; migration script must transform flat file into structured entities; slightly larger data footprint |
| **Query Impact** | Direct indexed lookup by `Subdimension.id`; efficient traversal through uniform relationship edges |
| **UI Rendering** | Knowledge graph renders subdimensions as proper nodes; tree navigation uses uniform hierarchy |
| **Migration** | Moderate: transform 25 records, generate provenance objects, create EDITORIAL_CLASSIFICATION edges |

### Option C: Absorb into Dimension
Eliminate subdimensions entirely by merging their topics directly into parent Dimensions and deleting the subdimension concept.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Simplifies hierarchy to 3 levels (Domain→Dimension→Topic); fewer entities |
| **Cons** | Destroys scholarly classification work; loses meaningful grouping (e.g., "Obligatory Prayers" vs "Voluntary Prayers" within "Salah & Prayer"); 25 subdimensions represent genuine curatorial decisions; breaks backward compatibility with legacy data |
| **Migration** | Complex: must redistribute ~115 topic references across parent dimensions; high risk of information loss |

---

## 3. RECOMMENDED RESOLUTION

**Option B: Elevate Subdimension to first-class entity.**

### Rationale
1. **Consistency**: The taxonomy already has 4 structural levels (Domain→Dimension→Subdimension→Topic). Treating 3 as first-class and 1 as embedded strings violates Design Principle 2 (Separation of Knowledge Entities).
2. **Graph Integrity**: `MFD-12-RELATIONSHIP-TAXONOMY.json` already lists `"subdimension"` in allowed source/target types for `EDITORIAL_CLASSIFICATION`. Elevating closes the gap between the relationship taxonomy and the entity model.
3. **Provenance**: Subdimensions like "Divine Names" vs "Divine Attributes Categories" represent distinct scholarly classification decisions that deserve their own provenance tracking.
4. **Validation**: Currently `Topic.parentSubdimensionId` is an unvalidated free string. Elevation enables pattern-constrained foreign key references.
5. **Scale**: Only 25 records — the overhead is negligible compared to 103 Dimensions and 184 Topics.
6. **Phantom References**: The migration map identifies 77.4% phantom rate in subdimension→topic refs. First-class entities enable systematic auditing of these phantoms.

---

## 4. SCHEMA CHANGES

### 4.1 New Entity: Subdimension

Add to Group C (Knowledge Taxonomy) in `MFD-12-CANONICAL-DATA-MODEL.md`:

#### Identifier Strategy Addition
| Entity | ID Format | Example | Rationale |
|--------|-----------|---------|----------|
| Subdimension | `subdim-{slug}` | `subdim-divine-names` | Matches existing slug convention; prefixed for disambiguation |

#### Entity Definition (new §4L, renumber subsequent)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `subdim-{slug}` |
| titleEn | string | ✅ | English title |
| titleAr | string | ❌ | Arabic title |
| titleUr | string | ❌ | Urdu title |
| description | string | ✅ | Scope description |
| parentDimensionId | string | ✅ | Reference to Dimension.id |
| topicIds | array<string> | ❌ | Direct child topics |
| aliases | array<string> | ❌ | Search aliases |
| provenance | ProvenanceObject | ✅ | Origin metadata |
| reviewStatus | enum | ✅ | Standard review status |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**Relationships**: Belongs to → Dimension; Contains → Topic

### 4.2 Modified Entity: Dimension

In `dimension.schema.json` and canonical model §4K:
- Change `subdimensionIds` items from `{ "type": "string" }` to `{ "type": "string", "pattern": "^subdim-[a-z0-9-]+$" }`
- Add description: "References to child Subdimension entities"

### 4.3 Modified Entity: Topic

In `topic.schema.json` and canonical model §4I:
- Change `parentSubdimensionId` from `{ "type": "string" }` to `{ "type": "string", "pattern": "^subdim-[a-z0-9-]+$" }`
- Update Data Dictionary constraint: "If present, MUST exist in Subdimension.id"

### 4.4 New JSON Schema File

Create `research/mfd-12/architecture/entity-schemas/subdimension.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/subdimension",
  "title": "MFD-12 Subdimension",
  "description": "Fourth-level taxonomy grouping beneath Dimension.",
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
    "provenance": {
      "type": "object",
      "required": ["origin", "method", "assertedAt", "assertedBy"],
      "additionalProperties": false,
      "properties": {
        "origin": { "type": "string", "minLength": 1 },
        "method": { "type": "string", "minLength": 1 },
        "corpusVersion": { "type": "string" },
        "assertedAt": { "type": "string", "format": "date-time" },
        "assertedBy": { "type": "string", "minLength": 1 }
      }
    },
    "reviewStatus": { "enum": ["DRAFT", "PENDING_SCHOLARLY_REVIEW", "APPROVED", "REVISED", "DEPRECATED"] },
    "schemaVersion": { "type": "string", "minLength": 1 },
    "contentVersion": { "type": "integer", "minimum": 1 }
  }
}
```

### 4.5 Cross-Reference Integrity Rules Addition

Add to `MFD-12-DATA-DICTIONARY.md` §4:
- `Subdimension.parentDimensionId` → MUST exist in Dimension.id
- `Subdimension.topicIds[]` → Each MUST exist in Topic.id
- `Dimension.subdimensionIds[]` → Each MUST exist in Subdimension.id
- `Topic.parentSubdimensionId` → If present, MUST exist in Subdimension.id

---

## 5. MIGRATION IMPACT

### Phase Affected
Migration Plan Phase 2 (Taxonomy Restructuring).

### Migration Steps
1. **Transform**: Read `data/taxonomy/subdimensions.json` (25 records).
2. **Generate IDs**: Prefix each `id` with `subdim-` (e.g., `"divine-names"` → `"subdim-divine-names"`).
3. **Generate Provenance**: For each record, create:
   ```json
   {
     "origin": "legacy-taxonomy",
     "method": "manual-curation",
     "assertedAt": "<file-mtime>",
     "assertedBy": "ws7-migration"
   }
   ```
4. **Set Defaults**: `reviewStatus: "PENDING_SCHOLARLY_REVIEW"`, `schemaVersion: "1.0.0"`, `contentVersion: 1`.
5. **Prefix Parent Refs**: Transform `parentDimensionId` with `dim-` prefix.
6. **Prefix Topic Refs**: Transform `topicIds[]` with `topic-` prefix; filter out 89 phantom references (per migration map §phantomReferences).
7. **Update Dimensions**: In all 103 dimension records, update `subdimensionIds[]` values with `subdim-` prefix.
8. **Update Topics**: In all 184 topic records, update `parentSubdimensionId` with `subdim-` prefix where present.
9. **Generate Relationships**: Optionally create `EDITORIAL_CLASSIFICATION` edges for Dimension→Subdimension containment (see Q38 resolution).

### Risk Assessment
- **Low Risk**: Transformation is mechanical; 25 records is small.
- **Phantom Handling**: 77.4% phantom rate in subdimension→topic refs requires careful filtering. Phantom topic IDs should be logged but NOT created as stub entities.
- **ID Alias Table**: Must include `subdim-*` mappings for rollback support.

---

## 6. BACKWARD COMPATIBILITY

### Existing Backups
- Legacy `data/taxonomy/subdimensions.json` remains unchanged in backups.
- Rollback plan (`MFD-12-ROLLBACK-PLAN.md`) must add Subdimension→legacy mapping to the ID alias table.

### Data Portability
- Export format adds `subdimensions.json` as a new top-level array alongside domains, dimensions, topics.
- Import validation must accept both legacy format (no provenance/schemaVersion) and canonical format.
- Programs reading the old format can continue using `subdimensions.json` directly; programs using the canonical model access Subdimension entities through the standard entity API.

### Breaking Changes
- **None for read-only consumers**: Legacy files untouched.
- **Schema validators**: Must be updated to recognize `subdim-` prefix pattern.
- **Graph consumers**: New node type added; existing traversals unaffected (additive change).

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted (WS-D, agent-106)" | reviewStatus: "pending-scholarly-review"*
