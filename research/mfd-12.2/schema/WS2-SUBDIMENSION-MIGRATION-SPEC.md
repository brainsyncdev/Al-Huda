# WS2: Subdimension Migration Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 (Canonical Schema Implementation Planning) |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-review |
| Source Data | `data/taxonomy/subdimensions.json` (25 records) |
| Target Schema | WS2-SUBDIMENSION-SCHEMA.json |
| Depends On | WS-D-SUBDIMENSION-RESOLUTION.md, WS-D-REVISED-SCHEMA-SPECIFICATIONS.md §8 |

---

## 1. Overview

This specification defines the exact transformation steps for migrating the 25 legacy subdimension records from `data/taxonomy/subdimensions.json` into first-class `Subdimension` entities conforming to the MFD-12 canonical schema. The migration also updates all referencing entities (Dimensions, Topics) to use the new `subdim-` prefixed identifiers.

### Legacy Format

Each record in `data/taxonomy/subdimensions.json` has:
- `id`: bare slug (e.g., `"divine-names"`)
- `title`: English title string
- `description`: scope description string
- `parentDimensionId`: bare dimension slug (e.g., `"allah-divine-attributes"`)
- `topicIds`: array of bare topic slugs (e.g., `["asma-ul-husna-names", ...]`)

### Target Format

Each `Subdimension` entity requires:
- `id`: prefixed slug (`"subdim-divine-names"`)
- `titleEn`: mapped from legacy `title`
- `description`: carried forward
- `parentDimensionId`: prefixed (`"dim-allah-divine-attributes"`)
- `topicIds`: prefixed, filtered for phantoms (`["topic-asma-ul-husna-names", ...]`)
- `provenance`: generated object
- `reviewStatus`: `"PENDING_SCHOLARLY_REVIEW"`
- `schemaVersion`: `"1.0.0"`
- `contentVersion`: `1`

---

## 2. Source Data Inventory

Based on analysis of `data/taxonomy/subdimensions.json` (177 lines, 25 records):

| # | Legacy ID | Parent Dimension | Topic Count |
|---|-----------|-----------------|-------------|
| 1 | divine-names | allah-divine-attributes | 3 |
| 2 | divine-attributes-categories | allah-divine-attributes | 4 |
| 3 | angels-specific | angels-unseen-world | 5 |
| 4 | jinn-shaytan | angels-unseen-world | 5 |
| 5 | quran-revelation | quran-science | 4 |
| 6 | quran-interpretation | quran-science | 4 |
| 7 | hadith-sciences | sunnah-prophetic-tradition | 4 |
| 8 | sunnah-application | sunnah-prophetic-tradition | 4 |
| 9 | adam-ibrahim-musa | major-prophets-stories | 5 |
| 10 | isa-muhammad | major-prophets-stories | 5 |
| 11 | salah-obligatory | salah-prayer | 4 |
| 12 | salah-voluntary | salah-prayer | 5 |
| 13 | dua-supplication | salah-prayer | 5 |
| 14 | nafs-levels | spiritual-states-nafs | 4 |
| 15 | qalb-heart | spiritual-states-nafs | 4 |
| 16 | marriage-preparation | marriage-nikah | 4 |
| 17 | marriage-ceremony | marriage-nikah | 5 |
| 18 | child-rights | parenting-child-development | 5 |
| 19 | child-education | parenting-child-development | 5 |
| 20 | business-operations | trade-commerce | 5 |
| 21 | market-ethics | trade-commerce | 5 |
| 22 | legal-sources | shariah-legal-principles | 5 |
| 23 | jurisprudence | shariah-legal-principles | 5 |
| 24 | specific-animals | animals-creation | 6 |
| 25 | animal-ethics | animals-creation | 5 |

**Total topic references**: 115
**Phantom topic references**: 89 (77.4% phantom rate per MFD-12-MIGRATION-MAP.json §phantomReferences)
**Valid topic references**: ~26 (to be confirmed against topics.json during execution)

---

## 3. Transformation Rules

### 3.1 ID Generation

```typescript
function transformSubdimensionId(legacyId: string): string {
  return `subdim-${legacyId}`;
}
```

Pattern validation: output must match `^subdim-[a-z0-9-]+$`.
All 25 legacy IDs consist of lowercase alphanumeric characters and hyphens, so this transformation is safe without further sanitization.

### 3.2 Parent Dimension ID Prefixing

```typescript
function transformParentDimensionId(legacyDimId: string): string {
  return `dim-${legacyDimId}`;
}
```

Must validate that `dim-{legacyDimId}` exists in the migrated Dimension entity set. Based on MFD-12-MIGRATION-MAP.json, dimensions are migrated with `dim-` prefix.

### 3.3 Topic ID Prefixing and Phantom Filtering

```typescript
function transformTopicIds(
  legacyTopicIds: string[],
  validTopicSlugs: Set<string>
): { valid: string[]; phantoms: string[] } {
  const valid: string[] = [];
  const phantoms: string[] = [];

  for (const topicId of legacyTopicIds) {
    const prefixed = `topic-${topicId}`;
    if (validTopicSlugs.has(topicId)) {
      valid.push(prefixed);
    } else {
      phantoms.push(topicId);
    }
  }

  return { valid, phantoms };
}
```

**Critical**: Phantoms are LOGGED but NOT created as stub entities. This follows the policy established in MFD-12-MIGRATION-MAP.json §phantomReferences.

### 3.4 Provenance Generation

```typescript
function generateProvenance(fileMtime: string): ProvenanceObject {
  return {
    origin: 'legacy-taxonomy',
    method: 'manual-curation',
    assertedAt: fileMtime, // ISO 8601 from filesystem mtime of subdimensions.json
    assertedBy: 'ws7-migration',
  };
}
```

### 3.5 Default Values

| Field | Default Value | Rationale |
|-------|--------------|-----------|
| `reviewStatus` | `"PENDING_SCHOLARLY_REVIEW"` | Subdimensions were manually curated but not formally reviewed against MFD-12 standards |
| `schemaVersion` | `"1.0.0"` | Initial canonical schema version |
| `contentVersion` | `1` | First version of canonical entity |
| `titleAr` | omitted | Not present in legacy data; can be added during scholarly review |
| `titleUr` | omitted | Not present in legacy data |
| `aliases` | omitted | Not present in legacy data; can be added later |

---

## 4. Complete Transformation Algorithm

```typescript
interface LegacySubdimension {
  id: string;
  title: string;
  description: string;
  parentDimensionId: string;
  topicIds: string[];
}

interface MigrationResult {
  entities: Subdimension[];
  phantomLog: Array<{ subdimensionId: string; phantomTopicIds: string[] }>;
  stats: {
    totalProcessed: number;
    totalPhantomsFiltered: number;
    totalValidTopicRefs: number;
  };
}

async function migrateSubdimensions(
  legacyData: LegacySubdimension[],
  validTopicSlugs: Set<string>,
  validDimensionSlugs: Set<string>,
  fileMtime: string
): Promise<MigrationResult> {
  const entities: Subdimension[] = [];
  const phantomLog: MigrationResult['phantomLog'] = [];
  let totalPhantoms = 0;
  let totalValidRefs = 0;

  for (const legacy of legacyData) {
    // 1. Transform IDs
    const newId = transformSubdimensionId(legacy.id);
    const newParentDimId = transformParentDimensionId(legacy.parentDimensionId);

    // 2. Validate parent dimension reference
    if (!validDimensionSlugs.has(legacy.parentDimensionId)) {
      console.warn(`[MIGRATION] Subdimension ${newId}: parent dimension ${newParentDimId} not found in valid dimensions. Keeping reference for manual review.`);
    }

    // 3. Transform and filter topic references
    const { valid, phantoms } = transformTopicIds(legacy.topicIds, validTopicSlugs);
    totalPhantoms += phantoms.length;
    totalValidRefs += valid.length;

    if (phantoms.length > 0) {
      phantomLog.push({ subdimensionId: newId, phantomTopicIds: phantoms });
    }

    // 4. Construct canonical entity
    const entity: Subdimension = {
      id: newId,
      titleEn: legacy.title,
      description: legacy.description,
      parentDimensionId: newParentDimId,
      topicIds: valid.length > 0 ? valid : undefined,
      provenance: generateProvenance(fileMtime),
      reviewStatus: 'PENDING_SCHOLARLY_REVIEW',
      schemaVersion: '1.0.0',
      contentVersion: 1,
    };

    // 5. Validate against schema
    if (!isSubdimension(entity)) {
      throw new Error(`[MIGRATION] Generated entity failed validation: ${newId}`);
    }

    entities.push(entity);
  }

  return {
    entities,
    phantomLog,
    stats: {
      totalProcessed: legacyData.length,
      totalPhantomsFiltered: totalPhantoms,
      totalValidTopicRefs: totalValidRefs,
    },
  };
}
```

---

## 5. Referencing Entity Updates

### 5.1 Dimension.subdimensionIds[] Update

For each of the 103 Dimension records, update `subdimensionIds[]` values:

```typescript
function updateDimensionSubdimensionIds(dimensions: Dimension[]): Dimension[] {
  return dimensions.map(dim => ({
    ...dim,
    subdimensionIds: (dim.subdimensionIds || []).map(id => `subdim-${id}`),
  }));
}
```

**Scope**: Only 13 of 103 dimensions have non-empty `subdimensionIds[]` arrays (per WS-D-SUBDIMENSION-RESOLUTION.md §1). The remaining 90 require no change.

### 5.2 Topic.parentSubdimensionId Update

For each of the 184 Topic records, update `parentSubdimensionId` where present:

```typescript
function updateTopicParentSubdimensionId(topics: Topic[]): Topic[] {
  return topics.map(topic => {
    if (topic.parentSubdimensionId) {
      return { ...topic, parentSubdimensionId: `subdim-${topic.parentSubdimensionId}` };
    }
    return topic;
  });
}
```

**Scope**: Only topics that currently have a non-null `parentSubdimensionId` are affected.

### 5.3 EDITORIAL_CLASSIFICATION Edge Generation (Optional, per Q38)

Generate explicit relationship edges for Dimension→Subdimension containment:

```typescript
function generateEditorialEdges(subdimensions: Subdimension[], timestamp: string): Relationship[] {
  return subdimensions.map(sub => ({
    id: `rel-${sub.parentDimensionId}-${sub.id}-EDITORIAL_CLASSIFICATION`,
    sourceEntityId: sub.parentDimensionId,
    targetEntityId: sub.id,
    relationshipType: 'EDITORIAL_CLASSIFICATION' as const,
    description: `Dimension contains Subdimension: ${sub.titleEn}`,
    bidirectional: false,
    provenance: {
      origin: 'legacy-taxonomy',
      method: 'array-expansion',
      assertedAt: timestamp,
      assertedBy: 'ws7-migration',
    },
    reviewStatus: 'PENDING_SCHOLARLY_REVIEW' as const,
    schemaVersion: '1.0.0',
  }));
}
```

Expected output: 25 EDITORIAL_CLASSIFICATION edges.

---

## 6. ID Alias Table Entries

Append to `MFD-12-ID-ALIAS-TABLE.json` for rollback support:

```json
{
  "subdimensionAliases": [
    { "legacyId": "divine-names", "canonicalId": "subdim-divine-names" },
    { "legacyId": "divine-attributes-categories", "canonicalId": "subdim-divine-attributes-categories" },
    { "legacyId": "angels-specific", "canonicalId": "subdim-angels-specific" },
    { "legacyId": "jinn-shaytan", "canonicalId": "subdim-jinn-shaytan" },
    { "legacyId": "quran-revelation", "canonicalId": "subdim-quran-revelation" },
    { "legacyId": "quran-interpretation", "canonicalId": "subdim-quran-interpretation" },
    { "legacyId": "hadith-sciences", "canonicalId": "subdim-hadith-sciences" },
    { "legacyId": "sunnah-application", "canonicalId": "subdim-sunnah-application" },
    { "legacyId": "adam-ibrahim-musa", "canonicalId": "subdim-adam-ibrahim-musa" },
    { "legacyId": "isa-muhammad", "canonicalId": "subdim-isa-muhammad" },
    { "legacyId": "salah-obligatory", "canonicalId": "subdim-salah-obligatory" },
    { "legacyId": "salah-voluntary", "canonicalId": "subdim-salah-voluntary" },
    { "legacyId": "dua-supplication", "canonicalId": "subdim-dua-supplication" },
    { "legacyId": "nafs-levels", "canonicalId": "subdim-nafs-levels" },
    { "legacyId": "qalb-heart", "canonicalId": "subdim-qalb-heart" },
    { "legacyId": "marriage-preparation", "canonicalId": "subdim-marriage-preparation" },
    { "legacyId": "marriage-ceremony", "canonicalId": "subdim-marriage-ceremony" },
    { "legacyId": "child-rights", "canonicalId": "subdim-child-rights" },
    { "legacyId": "child-education", "canonicalId": "subdim-child-education" },
    { "legacyId": "business-operations", "canonicalId": "subdim-business-operations" },
    { "legacyId": "market-ethics", "canonicalId": "subdim-market-ethics" },
    { "legacyId": "legal-sources", "canonicalId": "subdim-legal-sources" },
    { "legacyId": "jurisprudence", "canonicalId": "subdim-jurisprudence" },
    { "legacyId": "specific-animals", "canonicalId": "subdim-specific-animals" },
    { "legacyId": "animal-ethics", "canonicalId": "subdim-animal-ethics" }
  ]
}
```

---

## 7. Post-Migration Validation Checks

After migration completes, run these assertions:

| # | Check | Expected Result | Failure Action |
|---|-------|----------------|----------------|
| 1 | Total Subdimension entities created | Exactly 25 | Halt; investigate missing records |
| 2 | All IDs match `^subdim-[a-z0-9-]+$` | 25/25 pass | Halt; fix malformed IDs |
| 3 | All `parentDimensionId` values match `^dim-[a-z0-9-]+$` | 25/25 pass | Halt; fix prefixes |
| 4 | All `parentDimensionId` values exist in migrated Dimension set | 25/25 resolve | Warn; log orphan refs |
| 5 | Total phantom topic refs filtered | ~89 | Log; verify against MFD-12-MIGRATION-MAP.json |
| 6 | All surviving `topicIds[]` match `^topic-[a-z0-9-]+$` | 100% pass | Halt; fix prefixes |
| 7 | All surviving `topicIds[]` exist in migrated Topic set | 100% resolve | Warn; log orphan refs |
| 8 | Dimension.subdimensionIds[] all prefixed | 13 dimensions checked | Halt; incomplete update |
| 9 | Topic.parentSubdimensionId all prefixed | All topics checked | Halt; incomplete update |
| 10 | All entities pass `isSubdimension()` type guard | 25/25 pass | Halt; schema violation |
| 11 | No duplicate IDs in output | 0 duplicates | Halt; dedup required |
| 12 | Provenance objects complete | 25/25 have all 4 required fields | Halt; fix generation |

---

## 8. Files Affected During Implementation

### Files That Would Need Modification (DO NOT modify during planning)

Based on grep analysis of the codebase, the following files reference subdimensions and would need updates:

| File | Lines Affected | Change Required |
|------|---------------|-----------------|
| `src/lib/taxonomy/canonical-adapter.ts` | 28, 53, 58-64, 76, 124-138, 168-171, 208, 219, 226, 241, 289-300 | Update `CanonicalSubdimension` interface to match new `Subdimension` entity; update accessor functions to handle prefixed IDs; update search to use new field names (`titleEn` instead of `title`) |
| `src/lib/graph/canonical-knowledge-graph.ts` | 9, 14, 18-19, 31, 46, 102, 119, 130, 161, 175, 192-222, 234-242, 283-289, 355, 377-378 | Update graph builder to use `Subdimension.titleEn` instead of `.title`; update URL generation to use prefixed IDs |
| `src/components/graph/canonical-graph-explorer.tsx` | 45, 52, 85, 108-115, 135, 149, 151, 153, 191, 452, 567 | Verify color/label mappings still work with new entity shape |
| `src/app/explore/sub-dimensions/[id]/page.tsx` | 6, 9-10, 21, 26-27, 29, 33-38, 46-51, 56, 58, 80, 85-87, 137, 154, 166, 177-180, 259-262, 332, 350-352 | Update to use `Subdimension.titleEn`, `Subdimension.description`; update route param handling for `subdim-` prefix |
| `src/app/explore/domains/[id]/page.tsx` | 10, 51, 53, 55, 166-170, 214, 218, 246-247, 262-279 | Update subdimension rendering to use new entity fields |
| `src/app/explore/dimensions/[id]/page.tsx` | 8, 53, 211-214, 245-260 | Update subdimension section rendering |
| `src/app/explore/topics/[id]/page.tsx` | 27, 137-138, 248-251, 494-500 | Update parent subdimension link generation |
| `src/app/explore/page.tsx` | 168, 219-220 | Update subdimension count display |
| `src/app/explore/graph/page.tsx` | 14, 58, 139 | Update metadata text |
| `src/app/explore/domains/page.tsx` | 11, 16, 63, 121, 203 | Update stats display |
| `data/taxonomy/subdimensions.json` | All 25 records | Replace with canonical format OR keep as legacy source and generate new file |
| `data/taxonomy/dimensions.json` | 13 records with subdimensionIds | Prefix all subdimensionIds with `subdim-` |
| `data/taxonomy/topics.json` | Records with parentSubdimensionId | Prefix all parentSubdimensionId values with `subdim-` |

---

## 9. Rollback Procedure

If migration fails validation:

1. Restore `data/taxonomy/subdimensions.json` from backup (unchanged).
2. Restore `data/taxonomy/dimensions.json` from backup.
3. Restore `data/taxonomy/topics.json` from backup.
4. Delete generated `subdimensions-canonical.json` if created.
5. Consult `MFD-12-ID-ALIAS-TABLE.json` for reverse mapping.
6. Log failure reason and notify scholarly review team.

---

## 10. Execution Order

This migration is part of Phase 2 (Taxonomy Restructuring) per WS-D-REVISED-SCHEMA-SPECIFICATIONS.md §8:

1. **Prerequisite**: Complete Domain and Dimension migration (Phase 2 prior steps).
2. **Step 1**: Load `data/taxonomy/subdimensions.json`.
3. **Step 2**: Load valid topic slugs set from migrated topics.
4. **Step 3**: Load valid dimension slugs set from migrated dimensions.
5. **Step 4**: Execute `migrateSubdimensions()`.
6. **Step 5**: Run post-migration validation checks (§7).
7. **Step 6**: Execute `updateDimensionSubdimensionIds()`.
8. **Step 7**: Execute `updateTopicParentSubdimensionId()`.
9. **Step 8**: Generate EDITORIAL_CLASSIFICATION edges (optional, per Q38).
10. **Step 9**: Append ID alias table entries.
11. **Step 10**: Write output files.
12. **Step 11**: Generate phantom report for scholarly review queue.

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-review"*
