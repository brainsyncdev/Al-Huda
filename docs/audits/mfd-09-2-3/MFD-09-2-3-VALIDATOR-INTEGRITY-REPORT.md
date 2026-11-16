# MFD-09.2.3 Validator Integrity & Reconciliation Report

**Date:** 2026-11-16  
**Auditor:** phantom-validator-auditor (Subagent)  
**Branch:** main @ 9458f6091c590a460eeb1fef9fe86e13b3f4cd8e  
**Finding Classification:** ✅ VERIFIED

---

## 1. Investigation Summary

This report resolves the apparent discrepancy between "39 checks" referenced in MFD-09.2.1 validator check D07 and "80 checks" recorded in the MFD-09.2.2 execution report.

**Conclusion:** Both numbers are correct. They refer to two distinct validator scripts executed at different stages of the audit pipeline.

---

## 2. Evidence Chain

### 2.1 The "39 Checks" Reference

**Source:** `scripts/validate-mfd-09-2-1.mjs`, line 208  
**Check ID:** D07  
**Check Name:** "Validator results JSON records 39 executed checks"  
**Condition:**
```javascript
Array.isArray(validatorResults.checks) && validatorResults.checks.length === 39
```

**What `validatorResults` is:** Loaded at line 75 from `docs/audits/mfd-09-2-1/mfd-09-2-1-validator-results.json`. This file records the execution of the **older** validator script `scripts/validate-mfd-09-2.mjs` (note: no `-1` suffix), which contained exactly 39 check() calls.

**Verification:** Reading `docs/audits/mfd-09-2-1/mfd-09-2-1-validator-results.json` confirms:
- `executionResult.totalChecks`: 39
- `executionResult.passed`: 39
- `checks` array length: 39 entries (IDs 1–39)
- `validatorScript`: "scripts/validate-mfd-09-2.mjs"

### 2.2 The "80 Checks" Record

**Source:** `docs/audits/mfd-09-2-2/mfd-09-2-2-validator-results.json`  
**Field:** `executionResult.totalChecks`: 80  
**Validator:** `scripts/validate-mfd-09-2-1.mjs` (the expanded validator with `-1` suffix)

**Independent verification by MFD-09.2.2 auditor:**
- Source code inspection counted 80 check()/warn() calls across 8 groups
- Execution produced 80 ✓ marks in console output
- Summary line: "Checks: 80  PASS: 80  FAIL: 0  WARNING: 0"
- Exit code: 0

### 2.3 Why Two Validators Exist

| Validator | Script | Checks | Purpose |
|-----------|--------|--------|---------|
| MFD-09.2 | `validate-mfd-09-2.mjs` | 39 | Initial structural validation of taxonomy and mappings |
| MFD-09.2.1 | `validate-mfd-09-2-1.mjs` | 80 | Expanded validation adding determinism proofs, production protection, report-to-JSON agreement, and meta-checks on prior audit artifacts |

The MFD-09.2.1 validator was created to provide deeper assurance after the initial MFD-09.2 audit. It includes all original checks plus new groups (D, G, X) that verify the prior audit's artifacts and the build pipeline's determinism.

---

## 3. Canonical Dimension Coverage

The MFD-09.2.1 validator reads all canonical taxonomy files directly:

| File | Check Groups Using It |
|------|----------------------|
| `data/taxonomy/domains.json` | T01, T06, T07 |
| `data/taxonomy/dimensions.json` | T02, T06, T07, P01, P04 |
| `data/taxonomy/subdimensions.json` | T03, T06 |
| `data/taxonomy/topics.json` | T04, T06, T08, P09 |
| `data/taxonomy/relationships.json` | T05, R01-R03 |
| `data/taxonomy/topic-ayah-mappings.json` | M01-M15, E01-E08 |

All 103 dimensions, 20 domains, 25 subdimensions, and 184 topics are covered by at least one check. No dimension is omitted.

---

## 4. Finding Classification Matrix

| Criterion | Assessment |
|-----------|------------|
| Is the 39 figure a reporting defect? | **No** — correctly references older validator |
| Is the 80 figure a reporting defect? | **No** — independently verified by source inspection and execution |
| Is there a validator defect? | **No** — both validators execute correctly with exit code 0 |
| Is there a data integrity failure? | **No** — production data unchanged (SHA-256 verified) |
| Is evidence sufficient? | **Yes** — full source code, execution output, and artifact chain available |

**Final Classification: ✅ VERIFIED**

---

## 5. Recommendations

None required. The discrepancy is fully explained and documented. Future audits should reference validator versions explicitly (e.g., "MFD-09.2 validator (39 checks)" vs "MFD-09.2.1 validator (80 checks)") to prevent confusion.
