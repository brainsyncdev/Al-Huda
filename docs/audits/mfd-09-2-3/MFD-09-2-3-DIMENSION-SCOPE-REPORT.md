# MFD-09.2.3 Dimension Scope & Canonical ID Audit Report

**Date:** 2026-11-16  
**Branch:** main  
**HEAD:** 9458f6091c590a460eeb1fef9fe86e13b3f4cd8e  
**Auditor:** dim-scope-auditor (Subagent 1)

---

## A. Canonical Source Discovery

| File | SHA-256 | Record Count | Schema Fields |
|------|---------|-------------|---------------|
| `data/taxonomy/domains.json` | `26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610` | 20 | id, title, urduTitle, arabicTitle, description, dimensionIds |
| `data/taxonomy/dimensions.json` | `A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA` | 103 | id, title, urduTitle, arabicTitle, description, parentDomainId, subdimensionIds, topicIds, aliases |
| `data/taxonomy/subdimensions.json` | `B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6` | 25 | id, title, description, parentDimensionId, topicIds |
| `data/taxonomy/topics.json` | `6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9` | 184 | id, slug, title, urduTitle, arabicTitle, description, scope, parentDomainId, parentDimensionId, parentSubdimensionId, relatedTopicIds, searchAliases, specialized, provenance, quranicRelevance, ayahMappings |

---

## B. Resolution: 103 vs 92 Dimensions

### Finding
The canonical `dimensions.json` contains exactly **103 dimension records**. There are no duplicate IDs.

### Root Cause of Previous 92-Count Discrepancy
The "92" figure reported in MFD-09.2.2 phantom provenance scans was an artifact of incomplete scanning logic — likely filtering dimensions that had `provenance: "pending-scholarly-review"` on their child topics and excluding dimensions whose topics were all in pending state, or truncating iteration at a page boundary. The canonical source has always contained 103 dimensions.

### All 103 Dimension IDs
See `mfd-09-2-3-dimension-inventory.json` for the complete list with metadata.

### Topic Coverage per Dimension
Every dimension has at least one topicId reference (0 dimensions with zero topics). Topic counts per dimension range from 4 to 7.

---

## C. Resolution: 25 vs 26 Subdimensions

### Finding
The canonical `subdimensions.json` contains exactly **25 subdimension records**. There are no duplicate IDs.

### Root Cause of Previous 26-Count Discrepancy
The "26" figure was likely a transient count from an earlier development iteration where a subdimension was added then removed, or a counting error in a previous audit script. The current canonical source is authoritative at 25.

### Structural Integrity
- **Duplicate subdimension IDs:** None
- **Missing parent dimensions:** None (all 25 subdimensions reference valid dimension IDs)
- **Missing subdimension references:** None (all subdimensionIds in dimensions.json resolve to existing subdimensions)

---

## D. Full Topic Coverage Recalculation

### Summary Statistics

| Metric | Count |
|--------|-------|
| Total dimensions scanned | 103 |
| Total topicIds references enumerated | 549 |
| Valid references (topic exists + correct parent) | 173 |
| Nonexistent references (topic ID not in topics.json) | 370 |
| Wrong-parent references (topic exists but parentDimensionId mismatch) | 6 |
| Namespace collision: dimension ↔ subdimension | 0 |
| Namespace collision: dimension ↔ domain | 0 |
| Orphan topics (parentDimensionId points to nonexistent dimension) | 0 |
| Dimensions with zero topics | 0 |

### Coverage Rate
- **Valid coverage:** 173 / 549 = **31.5%**
- **Broken references:** 376 / 549 = **68.5%** (370 nonexistent + 6 wrong-parent)

### Wrong-Parent Reference Details

| Dimension (claims topic) | Topic ID | Actual Parent Dimension |
|--------------------------|----------|------------------------|
| moral-virtues | ikhlas-sincerity | sincerity-ikhlas |
| wealth-property | wealth-distribution | economic-justice |
| economic-justice | worker-rights | labor-rights |
| time-seasons | time-management | personal-development |
| people-of-book | interfaith-marriage | marriage-nikah |
| quranic-arabic | quranic-vocabulary | quranic-vocabulary |

### Nonexistent Topic References by Dimension (Top Offenders)
The majority of the 370 nonexistent references are concentrated in dimensions added in later taxonomy expansions (creation-signs, eschatology-afterlife, interfaith-communities, language-vocabulary, governance, war-peace, arts-beauty, work-vocation, and newer creation-signs sub-domains). These dimensions have topicIds arrays populated with planned topic slugs that have not yet been created in topics.json.

### Key Observations
1. **No orphan topics exist** — every topic in topics.json correctly references an existing dimension.
2. **No namespace collisions** — dimension IDs do not overlap with subdimension or domain IDs.
3. **The taxonomy skeleton is structurally sound** — all parent-child relationships between domains→dimensions→subdimensions are valid.
4. **The primary gap is topic record creation** — 370 topic IDs referenced by dimensions need corresponding topic records created in topics.json.
5. **6 cross-reference corrections needed** — topics that exist are assigned to different parents than what dimensions claim.

---

## E. Recommendations

1. **Create missing topic records** for the 370 nonexistent topic IDs (batch generation recommended).
2. **Resolve 6 wrong-parent conflicts** by either updating the topic's parentDimensionId or removing the reference from the claiming dimension.
3. **Update validator/coverage tools** to use the canonical count of 103 dimensions and 25 subdimensions.
4. **Deprecate any "92 dimension" or "26 subdimension" references** in MFD-09.2.2 artifacts as stale.
