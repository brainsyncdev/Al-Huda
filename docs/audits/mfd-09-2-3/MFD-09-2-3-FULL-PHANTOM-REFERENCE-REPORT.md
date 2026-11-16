# MFD-09.2.3 Full Phantom Reference & Validator Integrity Audit Report

**Date:** 2026-11-16  
**Auditor:** phantom-validator-auditor (Subagent)  
**Branch:** main @ 9458f6091c590a460eeb1fef9fe86e13b3f4cd8e  
**Outcome Classification:** ✅ VERIFIED_COMPLETE

---

## 1. Executive Summary

This audit produces the **complete, untruncated** inventory of all 549 topic references from `dimensions.json`, classifies each against `topics.json`, and reconciles the 39-vs-80 check count discrepancy reported in prior audits.

### Key Findings

| Metric | Value |
|--------|-------|
| Total dimension-side topic references scanned | **549** |
| VALID (topic exists, correct parent) | **170** |
| NONEXISTENT (phantom — no matching topic record) | **370** |
| WRONG_PARENT (topic exists but under different dimension) | **5** |
| NAMESPACE_COLLISION_DIMENSION (topic ID = dimension ID) | **3** |
| NAMESPACE_COLLISION_SUBDIMENSION (topic ID = subdimension ID) | **1** |
| NAMESPACE_COLLISION_DOMAIN (topic ID = domain ID) | **0** |
| Sum of classifications | **549** ✅ |
| Counts match total | **True** ✅ |

### Validator Reconciliation

| Question | Answer |
|----------|--------|
| Why does D07 mention 39 checks? | D07 is a meta-check verifying the *older* MFD-09.2 validator results JSON records 39 checks |
| Why does the JSON record 80 checks? | The *current* MFD-09.2.1 validator has 80 check() calls |
| Are both from different validators? | **Yes** — MFD-09.2 (39 checks) vs MFD-09.2.1 (80 checks) |
| Were 80 checks actually executed? | **Yes** — independently verified by MFD-09.2.2 auditor |
| Does the validator cover all canonical dimensions? | **Yes** — reads all taxonomy files directly |
| Finding classification | **VERIFIED** — no defect |

---

## 2. Methodology

### 2.1 Reference Inventory (Task A)

1. Read `data/taxonomy/dimensions.json` (103 dimensions) completely
2. Read `data/taxonomy/topics.json` (184 topics) completely
3. For every dimension, enumerate every `topicId` in its `topicIds` array
4. Classify each reference using precedence: NAMESPACE_COLLISION > WRONG_PARENT > NONEXISTENT > VALID
5. Write ALL 549 references to `mfd-09-2-3-all-topic-references.json`
6. Write ALL 370 NONEXISTENT references to `mfd-09-2-3-phantom-reference-full-list.json` (no sampling, no truncation)

### 2.2 Validator Investigation (Task B)

1. Read `scripts/validate-mfd-09-2-1.mjs` completely (289 lines)
2. Count actual `check()` and `warn()` calls: **80 total**
3. Read `docs/audits/mfd-09-2-2/MFD-09-2-2-VALIDATOR-EXECUTION-REPORT.md`
4. Read `docs/audits/mfd-09-2-2/mfd-09-2-2-validator-results.json`
5. Read `docs/audits/mfd-09-2-1/mfd-09-2-1-validator-results.json` (the older 39-check artifact)
6. Trace check D07 to determine what "39" refers to

---

## 3. Classification Definitions

| Classification | Definition | Precedence |
|---------------|------------|------------|
| NAMESPACE_COLLISION_DIMENSION | Referenced topic ID matches an existing dimension ID | Highest |
| NAMESPACE_COLLISION_SUBDIMENSION | Referenced topic ID matches a subdimension ID within the referencing dimension | 2nd |
| NAMESPACE_COLLISION_DOMAIN | Referenced topic ID matches a domain ID used as parentDomainId | 3rd |
| WRONG_PARENT | Topic exists in topics.json but its parentDimensionId differs from the referencing dimension | 4th |
| NONEXISTENT | No topic record with this ID exists in topics.json | 5th |
| VALID | Topic exists and parentDimensionId matches the referencing dimension | Lowest |

---

## 4. Distribution Analysis

### 4.1 By Classification

```
VALID:                          170  (30.97%)
NONEXISTENT:                    370  (67.39%)
WRONG_PARENT:                     5  ( 0.91%)
NAMESPACE_COLLISION_DIMENSION:    3  ( 0.55%)
NAMESPACE_COLLISION_SUBDIMENSION: 1  ( 0.18%)
NAMESPACE_COLLISION_DOMAIN:       0  ( 0.00%)
─────────────────────────────────────────────
TOTAL:                          549  (100.00%)
```

### 4.2 Nonexistent References

All 370 NONEXISTENT records are written in full to `mfd-09-2-3-phantom-reference-full-list.json`. This file contains **every single phantom reference** with no sampling, no truncation, and no summarization. Each record includes:
- `dimensionId`: the dimension that references the missing topic
- `domainId`: the parent domain of that dimension
- `referencedTopicId`: the missing topic ID
- `topicExists`: false
- `actualParentDimensionId`: null
- `classification`: "NONEXISTENT"
- `evidenceSource`: "data/taxonomy/dimensions.json"
- `evidencePath`: JSON path to the referencing array

---

## 5. Validator Integrity Investigation

### 5.1 The 39-vs-80 Discrepancy

**Question:** Why does section D07 of the MFD-09.2.1 validator mention 39 checks while the MFD-09.2.2 report records 80?

**Answer:** These refer to **two different validators**:

| Artifact | Validator Script | Check Count | Location |
|----------|-----------------|-------------|----------|
| MFD-09.2 results | `scripts/validate-mfd-09-2.mjs` | 39 | `docs/audits/mfd-09-2-1/mfd-09-2-1-validator-results.json` |
| MFD-09.2.1 results | `scripts/validate-mfd-09-2-1.mjs` | 80 | `docs/audits/mfd-09-2-2/mfd-09-2-2-validator-results.json` |

Check D07 in `validate-mfd-09-2-1.mjs` (line 208):
```javascript
check('D07', 'Validator results JSON records 39 executed checks',
  Array.isArray(validatorResults.checks) && validatorResults.checks.length === 39,
  'CRITICAL');
```

This reads `validatorResults` from `docs/audits/mfd-09-2-1/mfd-09-2-1-validator-results.json` (line 75), which is the **older** MFD-09.2 validator output. D07 verifies that the historical artifact correctly records its own 39-check execution. It does NOT claim the current validator has 39 checks.

### 5.2 Current Validator Coverage

The MFD-09.2.1 validator (`validate-mfd-09-2-1.mjs`) contains 80 check/warn calls across 8 groups:

| Group | IDs | Count | Severity |
|-------|-----|-------|----------|
| Mapping Integrity | M01–M15 | 15 | 14 CRITICAL, 1 HIGH |
| Evidence/Status | E01–E08 | 8 | 6 CRITICAL, 2 HIGH |
| Taxonomy Integrity | T01–T15 | 15 | 12 CRITICAL, 3 HIGH |
| Phantom References | P01–P09 | 9 | 7 CRITICAL, 2 HIGH |
| Relationships/Proposals | R01–R04, Q01–Q07 | 11 | 8 CRITICAL, 3 HIGH |
| Report-to-JSON Agreement | D01–D08 | 8 | 6 CRITICAL, 2 HIGH |
| Deterministic Generation | G01–G04 | 4 | 3 CRITICAL, 1 HIGH |
| Production Protection | X01–X10 | 10 | 8 CRITICAL, 2 HIGH |
| **TOTAL** | | **80** | **64 CRITICAL, 16 HIGH** |

All 80 checks read canonical source data directly. Zero hardcoded passes. Exit code enforcement confirmed.

### 5.3 Finding Classification

**VERIFIED** — The 39-vs-80 discrepancy is fully explained by two distinct validator generations. No reporting defect, no validator defect, no data integrity failure.

---

## 6. Deliverables

| File | Description |
|------|-------------|
| `mfd-09-2-3-all-topic-references.json` | All 549 references with full classification |
| `mfd-09-2-3-phantom-reference-full-list.json` | All 370 NONEXISTENT references (complete, no sampling) |
| `MFD-09-2-3-FULL-PHANTOM-REFERENCE-REPORT.md` | This report |
| `MFD-09-2-3-VALIDATOR-INTEGRITY-REPORT.md` | Validator reconciliation narrative |
| `mfd-09-2-3-validator-reconciliation.json` | Structured reconciliation data |

---

## 7. Constraints Compliance

- ✅ No production data in `data/taxonomy/` modified
- ✅ No Quran Arabic text or mapping classifications changed
- ✅ No scholarly review statuses altered
- ✅ No phantom references auto-repaired
- ✅ MFD-10 not started
- ✅ All files created under `docs/audits/mfd-09-2-3/`
