# WS-D: Q38 — Implicit CONTAINS Edges Resolution

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 (Data Model Architecture Resolution) |
| Question | Q38 from FAHM Programme Dashboard §39 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-D, agent-106) |
| Review Status | pending-scholarly-review |

---

## 1. CURRENT STATE

### Legacy Data (`data/taxonomy/`)
- **`domains.json`**: 20 domains, each with `dimensionIds[]` array (total ~103 dimension references).
- **`dimensions.json`**: 103 dimensions, 13 with non-empty `subdimensionIds[]` (25 total subdimension refs), many with `topicIds[]` arrays (~500+ topic references estimated).
- **`relationships.json`**: 152 explicit relationships. Of these, ~99 are `CONTAINS` edges covering Domain→Dimension containment. **Missing**: Dimension→Subdimension and Dimension→Topic CONTAINS edges are NOT in relationships.json; they exist ONLY as array references in parent entities.
- Total implicit CONTAINS relationships: ~300-500 (Dimension→Subdimension + Dimension→Topic).

### Canonical Model
- **Relationship entity (§4L)** defines typed edges including `EDITORIAL_CLASSIFICATION` (replaces legacy CONTAINS).
- **Domain (§4J)** retains `dimensionIds[]` array.
- **Dimension (§4K)** retains `subdimensionIds[]` and `topicIds[]` arrays.
- Graph Integrity Rules (§3.1) mandate migration of legacy CONTAINS to EDITORIAL_CLASSIFICATION.
- Knowledge Graph Spec (§4.2) distinguishes structural traversal (EDITORIAL_CLASSIFICATION only) from semantic traversal.

### Migration Map
- Maps `relationships.json` CONTAINS → EDITORIAL_CLASSIFICATION.
- Does NOT address generating edges from array fields.

---

## 2. OPTION ANALYSIS

### Option A: Keep Arrays Only (No Generated Edges)
Retain `dimensionIds[]`, `subdimensionIds[]`, `topicIds[]` as the sole representation of containment. Do not generate explicit Relationship entities for them.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Zero additional records; simpler migration; arrays are human-readable in JSON |
| **Cons** | Graph traversal requires special-casing (check arrays AND edges); inconsistent representation (some CONTAINS as edges, some as arrays); violates Principle 3 (Typed Relationships); cannot attach provenance/weight/review status to array-based containment; query complexity increases; graph integrity rules cannot validate array refs uniformly |
| **Graph Traversal** | Requires dual-mode queries: follow edges OR scan parent arrays |
| **Maintenance** | Adding/removing child requires updating parent array AND potentially creating edge |

### Option B: Generate Explicit EDITORIAL_CLASSIFICATION Edges (Recommended)
During migration, auto-generate `EDITORIAL_CLASSIFICATION` Relationship entities for every entry in `dimensionIds[]`, `subdimensionIds[]`, and `topicIds[]`. Retain arrays as denormalized convenience fields but treat edges as authoritative.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Uniform graph traversal (all containment via edges); consistent with Principle 3; enables provenance/weight/review on containment; simplifies query layer (single edge type); graph integrity rules apply uniformly; supports future deprecation of arrays |
| **Cons** | Adds ~400-600 Relationship records; migration script must generate deterministic IDs; arrays become redundant (but kept for readability) |
| **Graph Traversal** | Single-mode: follow EDITORIAL_CLASSIFICATION edges |
| **Maintenance** | Authoritative source is edge; arrays regenerated from edges on export |

### Option C: Remove Arrays Entirely
Generate edges and DELETE array fields from Domain/Dimension schemas.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Single source of truth; no redundancy |
| **Cons** | Breaks human readability of JSON files; complicates manual editing; increases dependency on graph DB for basic hierarchy inspection; higher migration risk |

---

## 3. RECOMMENDED RESOLUTION

**Option B: Generate explicit EDITORIAL_CLASSIFICATION edges; retain arrays as denormalized read-optimization.**

### Rationale
1. **Principle 3 Compliance**: "All relationships between entities are explicit, typed, and carry their own provenance." Array references violate this.
2. **Uniform Traversal**: The Knowledge Graph Spec defines structural traversal as following EDITORIAL_CLASSIFICATION edges. If arrays remain authoritative, traversals must branch logic.
3. **Provenance**: Each containment decision (e.g., why "Divine Names" is under "Allah & Divine Attributes") deserves provenance metadata. Arrays cannot carry this.
4. **Integrity Validation**: Graph Integrity Rules (§2.1 No Orphan Nodes) require edge-based checks. Array-only children appear as orphans to the validator.
5. **Scale Manageable**: ~500 additional edges is trivial for any graph store. The existing 152 relationships already include 99 CONTAINS edges; adding 400 more maintains consistency.
6. **Backward Compatibility**: Retaining arrays ensures legacy-format consumers continue working during transition.

---

## 4. SCHEMA CHANGES

### 4.1 Canonical Model Clarification

Update §4J (Domain) and §4K (Dimension) descriptions:
- `dimensionIds`: "Denormalized list of child Dimension IDs. Authoritative containment is represented by EDITORIAL_CLASSIFICATION Relationship entities. This array is maintained for human readability and legacy compatibility."
- `subdimensionIds`: Same clarification.
- `topicIds`: Same clarification.

### 4.2 Migration Script Specification

Add to `MFD-12-MIGRATION-MAP.json` → `fieldMappings`:

```json
"GeneratedContainmentEdges": {
  "source": ["domains.dimensionIds", "dimensions.subdimensionIds", "dimensions.topicIds"],
  "transform": "For each ID in array, generate Relationship entity with: id=rel-{parentId}-{childId}-EDITORIAL_CLASSIFICATION, sourceEntityId=parent, targetEntityId=child, relationshipType=EDITORIAL_CLASSIFICATION, bidirectional=false, provenance={origin:'legacy-taxonomy',method:'array-expansion',assertedAt:migration-timestamp,assertedBy:'ws7-migration'}, reviewStatus=PENDING_SCHOLARLY_REVIEW, schemaVersion=1.0.0",
  "estimatedRecords": 500
}
```

### 4.3 Deterministic Edge ID Format

For generated containment edges:
```
rel-{sourceEntityId}-{targetEntityId}-EDITORIAL_CLASSIFICATION
```
Example: `rel-dim-allah-divine-attributes-subdim-divine-names-EDITORIAL_CLASSIFICATION`

This ensures idempotent regeneration and deduplication.

### 4.4 Graph Integrity Rules Update

Add to `MFD-12-GRAPH-INTEGRITY-RULES.md` §6:
- **Rule 6.3**: "All array-based containment references (Domain.dimensionIds, Dimension.subdimensionIds, Dimension.topicIds) MUST have corresponding EDITORIAL_CLASSIFICATION Relationship entities. Validator flags mismatches as INTEGRITY_WARNING."

---

## 5. MIGRATION IMPACT

### Phase Affected
Migration Plan Phase 2 (Taxonomy Restructuring) + Phase 3 (Relationship Migration).

### Migration Steps
1. Read all Domain records; for each `dimensionIds[]` entry, generate EDITORIAL_CLASSIFICATION edge.
2. Read all Dimension records; for each `subdimensionIds[]` entry, generate edge.
3. Read all Dimension records; for each `topicIds[]` entry, generate edge.
4. Filter phantom topic IDs (89 phantoms in subdimension→topic refs per migration map).
5. Assign deterministic composite IDs.
6. Set provenance to `{origin:'legacy-taxonomy', method:'array-expansion', ...}`.
7. Write to `relationships.json` output alongside migrated legacy edges.
8. Validate: every array ref has matching edge; every edge has matching array ref.

### Risk Assessment
- **Low Risk**: Mechanical transformation; deterministic IDs prevent duplicates.
- **Phantom Handling**: Phantom topic IDs in arrays should NOT generate edges. Log as warnings.
- **Performance**: ~500 edges generated in <1 second.

---

## 6. BACKWARD COMPATIBILITY

### Existing Backups
- Legacy `relationships.json` preserved in backups.
- Generated edges are additive; rollback removes generated edges, restores original arrays.

### Data Portability
- Export includes both arrays (in Domain/Dimension records) AND explicit edges (in relationships.json).
- Import can reconstruct arrays from edges if arrays missing.
- Consumers using only arrays continue working; consumers using graph get uniform edges.

### Breaking Changes
- **None**. Arrays retained. Edges additive.
- Graph consumers gain capability; array consumers unaffected.

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted (WS-D, agent-106)" | reviewStatus: "pending-scholarly-review"*
