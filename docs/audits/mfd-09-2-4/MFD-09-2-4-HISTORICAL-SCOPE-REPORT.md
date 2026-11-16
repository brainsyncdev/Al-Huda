# MFD-09.2.4 Historical Scope Report

**Audit ID**: MFD-09.2.4  
**Date**: 2026-11-16  
**Auditor**: Specialist Subagent B — Historical Scope, Validator & Git Evidence Auditor  
**Branch**: main  
**HEAD**: 0b83f684fa429d9fc885a70dc0db6dc0a960c56e  

---

## 1. Investigation: 103 vs 92 Dimensions

### 1.1 Current Canonical State

| Metric | Value | Source |
|---|---|---|
| Dimensions in `data/taxonomy/dimensions.json` | **103** | Direct count via Node.js |
| Validator assertion (`validate-mfd-09-2.mjs:103`) | **103** | Script line 103 |
| Validator assertion (`validate-mfd-09-2-1.mjs:T02`) | **103** | Script check T02 |
| Taxonomy validator output | **103** | `validate-taxonomy.mjs` runtime output |

### 1.2 Prior Audit Claims (MFD-09.2.2)

The following MFD-09.2.2 artifacts record **92 dimensions**:

| Artifact | Location | Stated Value |
|---|---|---|
| `MFD-09-2-2-PHANTOM-PROVENANCE-CORRECTION-REPORT.md` | Line 28 | `Total dimensions scanned: 92` |
| `mfd-09-2-2-phantom-provenance.json` | Line 13 | `"totalDimensionsScanned": 92` |
| `mfd-09-2-2-relationship-reconciliation.json` | Line 61 | `"20 domains + 92 dimensions + 26 subdimensions + 373+ topics"` |
| `MFD-09-2-2-RELATIONSHIP-DISTRIBUTION-REPORT.md` | Line 89 | `dimensions.json (92 entities)` |

### 1.3 Root Cause Investigation

#### Git History
```bash
git log --oneline d056d83..HEAD -- data/taxonomy/dimensions.json
```
**Result**: No output. Zero commits modified `dimensions.json` between baseline `d056d83` and current HEAD `0b83f68`.

#### Script-Level Filtering Search
Searched all `.mjs` and `.js` files under `scripts/` for patterns `92`, `filter`, `slice`, `limit`, `status` in combination with `dimension` or `subdimension`.

**Result**: No filtering logic, pagination limit, status-based exclusion, or slice operation exists in any validation or generation script that would reduce 103 dimensions to 92. All scripts that count dimensions use `dimensions.length` directly against the full parsed array.

#### Production Hash Verification
SHA-256 of `data/taxonomy/dimensions.json` at current HEAD:
```
A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA
```
This matches the known baseline hash exactly, confirming the file has not changed.

### 1.4 Conclusion

**Classification: AUDIT-LEVEL COUNTING ERROR (no source-level filtering or data change)**

No source-level evidence exists explaining why MFD-09.2.2 reported 92 dimensions. The discrepancy cannot be attributed to:
- ❌ Git-level data changes (zero commits to `dimensions.json`)
- ❌ Script-level filtering, pagination, or status exclusion (none found)
- ❌ File truncation during read (the JSON parses completely to 103 records)

The most probable explanation is that the MFD-09.2.2 auditor agent miscounted or used a stale/cached value when generating its report artifacts. The canonical production data has consistently contained 103 dimensions throughout the entire audited period.

---

## 2. Investigation: 25 vs 26 Subdimensions

### 2.1 Current Canonical State

| Metric | Value | Source |
|---|---|---|
| Subdimensions in `data/taxonomy/subdimensions.json` | **25** | Direct count via Node.js |
| Validator assertion (`validate-mfd-09-2.mjs:104`) | **25** | Script line 104 |
| Validator assertion (`validate-mfd-09-2-1.mjs:T03`) | **25** | Script check T03 |

### 2.2 Prior Audit Claims (MFD-09.2.2)

| Artifact | Location | Stated Value |
|---|---|---|
| `mfd-09-2-2-relationship-reconciliation.json` | Line 61 | `"26 subdimensions"` |

### 2.3 Root Cause Investigation

#### Git History
```bash
git log --oneline d056d83..HEAD -- data/taxonomy/subdimensions.json
```
**Result**: No output. Zero commits modified `subdimensions.json`.

#### Production Hash Verification
SHA-256 of `data/taxonomy/subdimensions.json`:
```
B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6
```
Matches baseline exactly.

### 2.4 Conclusion

**Classification: AUDIT-LEVEL COUNTING ERROR (UNVERIFIED — no reconstructable cause)**

No source-level evidence found explaining the 26-subdimension count in MFD-09.2.2. The canonical file has consistently contained 25 subdimensions. No 26th subdimension has ever existed in the production data within the audited commit range. The discrepancy is attributed to the same audit-level counting error identified in the dimension investigation.

---

## 3. Immutable Restrictions Compliance

- ✅ No production data in `data/taxonomy/` was modified
- ✅ No Quran Arabic text or mapping classifications were changed
- ✅ No scholarly review statuses were altered
- ✅ MFD-10 was not started
- ✅ Only files under `docs/audits/mfd-09-2-4/` were created

---

## 4. Evidence Index

| Evidence | Path / Command | Finding |
|---|---|---|
| Dimension count (live) | `node -e "require('./data/taxonomy/dimensions.json').length"` | 103 |
| Subdimension count (live) | `node -e "require('./data/taxonomy/subdimensions.json').length"` | 25 |
| Git diff (taxonomy) | `git log --oneline d056d83..HEAD -- data/taxonomy/` | Empty (no changes) |
| MFD-09.2.2 phantom report | `docs/audits/mfd-09-2-2/MFD-09-2-2-PHANTOM-PROVENANCE-CORRECTION-REPORT.md:28` | States 92 |
| MFD-09.2.2 phantom JSON | `docs/audits/mfd-09-2-2/mfd-09-2-2-phantom-provenance.json:13` | States 92 |
| MFD-09.2.2 relationship JSON | `docs/audits/mfd-09-2-2/mfd-09-2-2-relationship-reconciliation.json:61` | States 92 dims, 26 subs |
| MFD-09.2.2 distribution report | `docs/audits/mfd-09-2-2/MFD-09-2-2-RELATIONSHIP-DISTRIBUTION-REPORT.md:89` | States 92 |
| Script filter search | `grep -rn "92\|filter\|slice\|limit" scripts/*.mjs` | No dimension-filtering logic found |
