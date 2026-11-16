# MFD-09.2.2 Relationship Distribution Reconciliation Report

**Audit ID**: MFD-09.2.2  
**Date**: 2026-11-16  
**Auditor**: Subagent 2 — Report, Taxonomy & Git Integrity Auditor  
**Branch**: main  
**HEAD**: 455d286556072a6291fa544ea599daf799bfe811  

---

## 1. Canonical Authority

All figures in this report are derived directly from the canonical source file:  
`data/taxonomy/relationships.json`

No inferred, cached, or previously reported values are used as authority.

---

## 2. Independent Calculation Results

| Metric | Value |
|---|---|
| Total relationship records | 150 |
| Unique relationship IDs | 150 |
| Duplicate IDs | 0 |
| Self-references (sourceId == targetId) | 0 |
| Missing/invalid endpoints | 0 |

### 2.1 Relationship Type Distribution

| Type | Count | Percentage |
|---|---|---|
| CONTAINS | 98 | 65.3% |
| CROSS_REFERENCES | 42 | 28.0% |
| SHARES_CONCEPT | 10 | 6.7% |
| **Total** | **150** | **100%** |

---

## 3. Discrepancy Resolution

### 3.1 Historical Claims vs. Canonical Data

| Source | CONTAINS | CROSS_REFERENCES | SHARES_CONCEPT | Total |
|---|---|---|---|---|
| MFD-09.2 (historical) | 99 | 42 | 9 | 150 |
| MFD-09.2.1 (reported) | 98 | 42 | 10 | 150 |
| **Canonical (this audit)** | **98** | **42** | **10** | **150** |

### 3.2 Resolution

- **MFD-09.2.1 is correct.** The canonical `relationships.json` contains exactly CONTAINS=98, CROSS_REFERENCES=42, SHARES_CONCEPT=10.
- **MFD-09.2 historical claim of CONTAINS=99, SHARES_CONCEPT=9 was inaccurate.** It appears one CONTAINS relationship was reclassified as SHARES_CONCEPT between MFD-09.2 and MFD-09.2.1, or the original count contained an error that was subsequently corrected.
- The total count of 150 relationships has been consistent across all reports.

---

## 4. Structural Validity Assessment

| Check | Result | Notes |
|---|---|---|
| All IDs unique | ✅ Pass | 150/150 unique |
| No self-references | ✅ Pass | 0 found |
| No duplicate IDs | ✅ Pass | 0 found |
| All endpoints valid | ✅ Pass | Every sourceId and targetId resolves to a known domain, dimension, subdimension, or topic |
| Type values valid | ✅ Pass | Only CONTAINS, CROSS_REFERENCES, SHARES_CONCEPT present |
| Provenance field present | ✅ Pass | All 150 records have provenance set to "pending-scholarly-review" |

---

## 5. Semantic / Scholarly Validity Distinction

This audit verifies **structural validity only**. The following are explicitly out of scope:

- Whether CONTAINS relationships correctly reflect the intended taxonomy hierarchy (semantic correctness)
- Whether CROSS_REFERENCES relationships represent meaningful scholarly connections
- Whether SHARES_CONCEPT relationships accurately capture thematic overlap
- Whether the provenance status "pending-scholarly-review" should be updated

All 150 relationships carry `provenance: "pending-scholarly-review"`, indicating none have been formally validated by scholars.

---

## 6. Endpoint Validation Detail

All relationship endpoints were validated against the union of all entity IDs from:
- `domains.json` (20 entities)
- `dimensions.json` (92 entities)
- `subdimensions.json` (26 entities)
- `topics.json` (373+ entities)

**Result**: Zero missing endpoints. Every `sourceId` and `targetId` in every relationship record resolves to an existing entity.

---

## 7. Immutable Restrictions Compliance

- ✅ No production data in `data/taxonomy/` was modified
- ✅ No Quran Arabic text or mapping classifications were changed
- ✅ No scholarly review statuses were altered
- ✅ MFD-10 was not started
- ✅ Only files under `docs/audits/mfd-09-2-2/` were created

---

## 8. Companion Artifacts

- Machine-readable results: [`mfd-09-2-2-relationship-reconciliation.json`](./mfd-09-2-2-relationship-reconciliation.json)
