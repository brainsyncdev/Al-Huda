# MFD-09.2.4 Validator Execution & Git Integrity Report

**Audit ID**: MFD-09.2.4  
**Date**: 2026-11-16  
**Auditor**: Specialist Subagent B — Historical Scope, Validator & Git Evidence Auditor  
**Branch**: main  
**HEAD**: 0b83f684fa429d9fc885a70dc0db6dc0a960c56e  

---

## 1. Validator Execution Results

### 1.1 validate-mfd-09-2.mjs (39-Check Validator)

| Parameter | Value |
|---|---|
| Command | `node scripts/validate-mfd-09-2.mjs` |
| Exit Code | **0** |
| Checks Passed | **39** |
| Checks Failed | **0** |
| Execution window (re-run with exit capture) | start `2026-11-16T16:11:26.0312144+05:00` → end `2026-11-16T16:11:26.0976880+05:00` |
| Exit code capture method | `$LASTEXITCODE` immediately after invocation |

**Output Summary** (per-group counts verified against script source):
```
=== MFD-09.2 VALIDATION ===
Mapping Validation:    19/19 passed   (script lines 52–99)
Taxonomy Validation:   18/18 passed   (script lines 102–157)
Production Protection:  2/2 passed    (script lines 161–162)
Results: 39 passed, 0 failed
✅ All checks passed.
```

**Key Assertions Verified**:
- Mapping record count: 789 ✓
- Expanded ayah occurrences: 1886 ✓
- Unique ayat: 1550 ✓
- Multi-topic ayat (unique): 230 ✓
- 3+ topic ayat: 74 ✓
- Max overlap: 6 ✓
- Domain count: 20 ✓
- **Dimension count: 103** ✓
- **Subdimension count: 25** ✓
- Topic count: 184 ✓
- Relationship count: 150 ✓
- Topic-side distribution sums to 103 ✓
- Dimension-side distribution sums to 103 ✓
- Phantom references documented ✓
- Bidirectional discrepancies documented ✓

### 1.2 validate-mfd-09-2-1.mjs (80-Check Validator)

| Parameter | Value |
|---|---|
| Command | `node scripts/validate-mfd-09-2-1.mjs` |
| Exit Code | **0** |
| Checks Passed | **80** |
| Checks Failed | **0** |
| Warnings | **0** |
| Execution window (re-run with exit capture) | start `2026-11-16T16:11:26.0976880+05:00` → end `2026-11-16T16:11:26.3142803+05:00` |
| Exit code capture method | `$LASTEXITCODE` immediately after invocation |

**Output Summary** (per-group counts verified against script source):
```
=== MFD-09.2.1 INTEGRITY VALIDATION ===
Mapping integrity (M01–M15):        15/15 PASS
Evidence/scholarly status (E01–E08): 8/8 PASS
Taxonomy integrity (T01–T15):       15/15 PASS
Phantom references (P01–P09):        9/9 PASS
Relationships/proposals (R01–R04, Q01–Q07): 11/11 PASS
Report-to-JSON agreement (D01–D08):  8/8 PASS
Deterministic generation (G01–G04):  4/4 PASS
Production protection (X01–X10):    10/10 PASS  (includes SHA-256 hash verification)
Checks: 80  PASS: 80  FAIL: 0  WARNING: 0
```
Arithmetic cross-check: 15 + 8 + 15 + 9 + 11 + 8 + 4 + 10 = **80** ✓

**Notable Checks**:
- [T02] Dimension count 103: PASS
- [T03] Subdimension count 25: PASS
- [G03] Regeneration is byte-identical (SHA-256): PASS
- [X01-X06] All 6 production taxonomy files unchanged (SHA-256 match): PASS
- [X07] Git reports no changes under data/taxonomy or src: PASS
- [X08] Public AI answers remain OFF: PASS

### 1.3 validate-all.mjs (Master Validation Runner)

| Parameter | Value |
|---|---|
| Command | `node scripts/validate-all.mjs` |
| Exit Code | **0** |
| Suites Passed | **5/5** |
| Execution window (re-run with exit capture) | start `2026-11-16T16:11:26.3142803+05:00` → end `2026-11-16T16:11:26.7813023+05:00` |
| Exit code capture method | `$LASTEXITCODE` immediately after invocation |

Note: `validate-all.mjs` runs five suites (`validate-quran-data`, `validate-source-licenses`, `validate-taxonomy`, `validate-ayah-mappings`, `validate-roots`). It does **not** invoke either MFD-09.2 validator; those were executed separately as recorded above.

**Suite Results**:
| Suite | Status |
|---|---|
| Quran Data | ✅ PASSED |
| Source Licenses | ✅ PASSED |
| Taxonomy | ✅ PASSED |
| Ayah Mappings | ✅ PASSED |
| Root Registry | ✅ PASSED |

### 1.4 Validator Correspondence Confirmation

| Report Reference | Validator Script | Check Count | Confirmed |
|---|---|---|---|
| "39-check validator" | `scripts/validate-mfd-09-2.mjs` | 39 checks, exit 0 | ✅ Yes |
| "80-check validator" | `scripts/validate-mfd-09-2-1.mjs` | 80 checks, exit 0 | ✅ Yes |

These are two **distinct** validators with different scopes:
- `validate-mfd-09-2.mjs`: Validates MFD-09.2 audit datasets against production source data (mapping counts, taxonomy entity counts, coverage distributions).
- `validate-mfd-09-2-1.mjs`: Validates MFD-09.2.1 audit artifacts including deterministic regeneration, phantom reference recomputation, report-to-JSON agreement, and production hash integrity.

---

## 2. Git Integrity

### 2.1 Branch and HEAD

| Parameter | Value |
|---|---|
| Current Branch | `main` |
| HEAD | `0b83f684fa429d9fc885a70dc0db6dc0a960c56e` |
| origin/main | `0b83f684fa429d9fc885a70dc0db6dc0a960c56e` |
| Ahead/Behind | **0 / 0** (fully synced) |

### 2.2 Recent Commit History

```
0b83f68 MFD-09.2.3: dimension coverage and phantom evidence closure
9458f60 MFD-09.2.2: final technical verification and evidence closure
455d286 MFD-09.2.1: record full commit chain and verification commands in final report
6ff8cc2 MFD-09.2.1: correct ending-commit reference in final reconciliation report
0afead7 MFD-09.2.1: record verified ending commit and push evidence in final report
```

### 2.3 Production Taxonomy Changes Since Baseline

```bash
git diff d056d83..HEAD --stat -- data/taxonomy
```
**Result**: Empty output. **Zero files changed** under `data/taxonomy/` between baseline and HEAD.

### 2.4 Working Tree Status

`git status --short` shows only deleted files under `docs/FAHM-*` (legacy FAHM milestone reports). These are documentation cleanup deletions unrelated to production taxonomy data. No modified or untracked files exist under `data/` or `src/`.

---

## 3. Production Integrity — SHA-256 Hash Verification

| File | Expected Hash | Actual Hash | Status |
|---|---|---|---|
| `domains.json` | `26322BAA...56D8F610` | `26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610` | ✅ MATCH |
| `dimensions.json` | `A88CD118...245138AA` | `A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA` | ✅ MATCH |
| `subdimensions.json` | `B4CC4982...9279E6D6` | `B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6` | ✅ MATCH |
| `topics.json` | `6571E74A...C954C3E9` | `6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9` | ✅ MATCH |
| `relationships.json` | `D5451217...0E1B82A` | `D545121703FFBC825A6F185052E49DC93BF415D233CC3FC188E355DF60E1B82A` | ✅ MATCH |
| `topic-ayah-mappings.json` | `3CA33A47...D2C2CED` | `3CA33A47925E25E1BA282E28D3C3212F9654CE2DC897BA0A4150EB974D2C2CED` | ✅ MATCH |

**Result**: All 6 production taxonomy files are **byte-identical** to their known baselines.

---

## 4. Immutable Restrictions Compliance

- ✅ No production data in `data/taxonomy/` was modified
- ✅ No Quran Arabic text or mapping classifications were changed
- ✅ No scholarly review statuses were altered
- ✅ MFD-10 was not started
- ✅ Only files under `docs/audits/mfd-09-2-4/` were created

---

## 5. Summary

| Check | Result |
|---|---|
| 39-check validator | ✅ 39/39 passed, exit 0 |
| 80-check validator | ✅ 80/80 passed, exit 0 |
| Master validation runner | ✅ 5/5 suites passed, exit 0 |
| Branch sync | ✅ main = origin/main (0/0) |
| Taxonomy changes since baseline | ✅ None |
| Production hash integrity | ✅ All 6 files match |
| Working tree cleanliness (production) | ✅ Clean (only legacy doc deletions) |
