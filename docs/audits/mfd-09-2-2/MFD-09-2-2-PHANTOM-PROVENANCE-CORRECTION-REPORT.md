# MFD-09.2.2 Phantom Reference Provenance Correction Report

**Audit ID**: MFD-09.2.2  
**Date**: 2026-11-16  
**Auditor**: Subagent 2 — Report, Taxonomy & Git Integrity Auditor  
**Branch**: main  
**HEAD**: 455d286556072a6291fa544ea599daf799bfe811  

---

## 1. Provenance Correction Statement

> **CRITICAL CORRECTION**: The phantom references audited in this report originate from the relationship  
> `data/taxonomy/dimensions.json → topicIds → data/taxonomy/topics.json`  
> They do **NOT** originate from `topic-ayah-mappings.json`. Any prior characterization of these findings as stemming from ayah mapping files is incorrect.

The audit validates that each `topicId` referenced in a dimension's `topicIds` array resolves to an existing topic record in `topics.json` with a matching `parentDimensionId`.

---

## 2. Audit Scope

| Parameter | Value |
|---|---|
| Source file | `data/taxonomy/dimensions.json` |
| Target file | `data/taxonomy/topics.json` |
| Collision check files | `subdimensions.json`, `dimensions.json`, `domains.json` |
| Total dimensions scanned | 92 |
| Total dimension→topic references | 549 |
| Total topics in canonical topics.json | 373+ (file truncated during read; all IDs indexed via PowerShell) |

---

## 3. Classification Results

### 3.1 Summary

| Category | Count | Mutually Exclusive |
|---|---|---|
| NONEXISTENT | 368 | ✅ Yes |
| WRONG_PARENT | 6 | ✅ Yes |
| NAMESPACE_COLLISION_DIMENSION | 2 | ✅ Yes |
| NAMESPACE_COLLISION_SUBDIMENSION | 0 | — |
| NAMESPACE_COLLISION_DOMAIN | 0 | — |
| **Total flagged** | **376** | — |
| Valid references | 173 | — |
| **Total references** | **549** | — |

### 3.2 Reconciliation Against Claimed Figures

| Claimed (MFD-09.2) | Actual (Canonical) | Match? |
|---|---|---|
| 368 nonexistent | 368 | ✅ Exact match |
| 2 namespace collisions | 2 | ✅ Exact match |
| 6 wrong-parent | 6 | ✅ Exact match |

**Conclusion**: All three claimed figures are confirmed exactly against canonical data. The categories are mutually exclusive — no reference belongs to more than one category.

---

## 4. WRONG_PARENT Details (6 records)

Each record below shows a topic that exists in `topics.json` but whose `parentDimensionId` does not match the dimension that references it.

| # | Dimension (referrer) | Topic ID | Expected Parent | Actual Parent |
|---|---|---|---|---|
| 1 | moral-virtues | ikhlas-sincerity | moral-virtues | sincerity-ikhlas |
| 2 | wealth-property | wealth-distribution | wealth-property | economic-justice |
| 3 | economic-justice | worker-rights | economic-justice | labor-rights |
| 4 | time-seasons | time-management | time-seasons | personal-development |
| 5 | people-of-book | interfaith-marriage | people-of-book | marriage-nikah |
| 6 | quranic-arabic | quranic-vocabulary | quranic-arabic | quranic-vocabulary |

**Note**: These represent legitimate cross-dimensional references where a topic is canonically parented under one dimension but referenced by another. They are structural integrity observations, not necessarily errors requiring repair.

---

## 5. NAMESPACE_COLLISION Details (2 records)

These topicIds in dimension `topicIds` arrays do not exist in `topics.json` but collide with IDs in other taxonomy entity types.

| # | Dimension (referrer) | Topic ID | Collision Type | Colliding Entity |
|---|---|---|---|---|
| 1 | spousal-relations | conflict-resolution | NAMESPACE_COLLISION_DIMENSION | Dimension `conflict-resolution` (war-peace-conflict domain) |
| 2 | resurrection-judgment | accountability | NAMESPACE_COLLISION_DIMENSION | Dimension `accountability` (governance-political-authority domain) |

---

## 6. NONEXISTENT References (368 records)

368 topicIds referenced in dimension `topicIds` arrays have no corresponding record in `topics.json` and no namespace collision with any other entity type. A representative sample (first 20):

| # | Dimension | Missing Topic ID |
|---|---|---|
| 1 | quran-science | quran-interpretation-principles |
| 2 | sunnah-prophetic-tradition | prophetic-example |
| 3 | divine-scriptures | scripture-corruption |
| 4 | divine-scriptures | belief-in-scriptures |
| 5 | prophetic-guidance | following-prophets |
| 6 | prophetic-guidance | prophetic-miracles |
| 7 | quranic-linguistics | quranic-arabic-style |
| 8 | quranic-linguistics | quranic-rhetoric |
| 9 | quranic-linguistics | quranic-vocabulary-study |
| 10 | quranic-linguistics | linguistic-miracle |
| 11 | prophethood-messengership | prophetic-qualities |
| 12 | prophethood-messengership | prophetic-mission |
| 13 | minor-prophets | idris-story |
| 14 | minor-prophets | shuayb-story |
| 15 | minor-prophets | dhul-kifl |
| 16 | minor-prophets | uzair-story |
| 17 | prophetic-lessons | patience-lessons |
| 18 | prophetic-lessons | trust-in-allah |
| 19 | prophetic-lessons | perseverance-lessons |
| 20 | prophetic-lessons | moral-lessons-from-prophets |

*Full list of all 368 records is available in the companion JSON artifact.*

---

## 7. Immutable Restrictions Compliance

- ✅ No production data in `data/taxonomy/` was modified
- ✅ No Quran Arabic text or mapping classifications were changed
- ✅ No scholarly review statuses were altered
- ✅ No phantom references were automatically repaired
- ✅ MFD-10 was not started
- ✅ Only files under `docs/audits/mfd-09-2-2/` were created

---

## 8. Companion Artifacts

- Machine-readable results: [`mfd-09-2-2-phantom-provenance.json`](./mfd-09-2-2-phantom-provenance.json)
