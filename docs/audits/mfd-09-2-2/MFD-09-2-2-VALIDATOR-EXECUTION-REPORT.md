# MFD-09.2.2 Validator Execution & Integrity Audit Report

**Date:** 2026-11-16  
**Auditor:** validator-exec-auditor (Subagent)  
**Target:** `scripts/validate-mfd-09-2-1.mjs`  
**Branch:** main @ 455d286  
**Outcome Classification:** ✅ VERIFIED_PASS

---

## 1. Executive Summary

The MFD-09.2.1 validator was independently inspected, executed, and cross-validated against the project-wide validation suite. All claimed results are **reproducible and accurate**.

- **Validator Checks:** 80 total → 80 PASS, 0 FAIL, 0 WARNING
- **Exit Code:** 0 (correct for all-pass state)
- **Hardcoded Passes:** None detected; all checks evaluate live data or recomputed values
- **Production Data:** Unchanged (SHA-256 verified + git clean)
- **Full Suite:** 5/5 validators passed with exit code 0

---

## 2. Source Inspection Findings

### 2.1 Check Register

| Group | ID Range | Count | Severity Mix | Reads Canonical? |
|-------|----------|-------|--------------|------------------|
| Mapping Integrity | M01–M15 | 15 | 14 CRITICAL, 1 HIGH | Yes (live recompute from `topic-ayah-mappings.json`) |
| Evidence/Status | E01–E08 | 8 | 6 CRITICAL, 2 HIGH | Yes (reads mappings + audit JSON) |
| Taxonomy Integrity | T01–T15 | 15 | 12 CRITICAL, 3 HIGH | Yes (reads all taxonomy files) |
| Phantom References | P01–P09 | 9 | 7 CRITICAL, 2 HIGH | Yes (independent recompute from dimensions.json) |
| Relationships/Proposals | R01–R04, Q01–Q07 | 11 | 8 CRITICAL, 3 HIGH | Yes (reads relationships.json + proposals) |
| Report-to-JSON Agreement | D01–D08 | 8 | 6 CRITICAL, 2 HIGH | Yes (regex/content match on .md + .json) |
| Deterministic Generation | G01–G04 | 4 | 3 CRITICAL, 1 HIGH | Yes (runs generator, compares SHA-256 before/after) |
| Production Protection | X01–X10 | 10 | 8 CRITICAL, 2 HIGH | Yes (SHA-256 baselines + git diff + feature flag read) |
| **TOTAL** | | **80** | **64 CRITICAL, 16 HIGH** | |

### 2.2 Hardcoded-Pass Analysis

Every `check()` call passes a **computed boolean expression** as its condition argument. No check uses a literal `true`, no-op, or tautology. Key examples:

- **M04**: `expanded === 1886` — expanded is computed by iterating all mapping ranges at runtime
- **P01**: `phantomCalc === 370` — phantomCalc is independently counted from dimensions.topicIds vs topics.id set
- **G03**: `drift.length === 0` — drift computed by comparing SHA-256 hashes before and after running the generator
- **X01–X06**: Each compares live `sha256(path)` against a hardcoded baseline constant (not `true`)
- **D01/D02**: Negative regex tests (`!/pattern/.test(md)`) that would fail if retracted figures reappeared

**Conclusion: Zero hardcoded passes.**

### 2.3 Exit Code Behavior

Line 289: `process.exit(failed > 0 ? 1 : 0);`  
Warnings do NOT affect exit code (by design, line 14). Critical/HIGH failures produce exit 1. This is correct and enforced.

### 2.4 Canonical Source Reading

All inputs are read directly from:
- `data/taxonomy/*.json` (6 files)
- `data/audit/mfd-09-1-topic-proposals-classified.json`
- `docs/audits/mfd-09-2-1/*.json` and `*.md` (generated artifacts)
- `src/lib/ai/feature-flag.ts`

No stale copies, cached intermediates, or test fixtures are used.

---

## 3. Execution Output (Full)

```
=== MFD-09.2.1 INTEGRITY VALIDATION ===

Mapping integrity:
  ✓ [M01] Mapping record count is 789
  ✓ [M02] Mapping IDs unique
  ✓ [M03] All ayah ranges valid
  ✓ [M04] Expanded occurrences reproduce 1886
  ✓ [M05] Unique Surah:Ayah reproduces 1550
  ✓ [M06] Multi-topic ayat reproduces 230
  ✓ [M07] Raw occurrence-basis multi-topic ayat reproduces 236
  ✓ [M08] 3+ topic ayat reproduces 74
  ✓ [M09] Max overlap reproduces 6
  ✓ [M10] Duplicate topic excess reproduces 7
  ✓ [M11] Count dataset agrees with recomputation
  ✓ [M12] Row-level dataset covers every unique ayah
  ✓ [M13] Multi-topic row subset length equals 230
  ✓ [M14] Arithmetic 230 + 6 = 236 documented correctly
  ✓ [M15] Historical invalid subtraction flagged

Evidence and scholarly status:
  ✓ [E01] All mappings reference quran-json only
  ✓ [E02] Zero Tafsir attached
  ✓ [E03] Zero Tafsir verified
  ✓ [E04] Zero scholar reviewed
  ✓ [E05] All 789 remain pending scholarly review
  ✓ [E06] No mapping carries a stored audit verdict field
  ✓ [E07] Derived verdict split sums to 789
  ✓ [E08] Verdict derivation disclosed as technical, not scholarly

Taxonomy integrity:
  ✓ [T01] Domain count 20
  ✓ [T02] Dimension count 103
  ✓ [T03] Subdimension count 25
  ✓ [T04] Topic count 184
  ✓ [T05] Relationship count 150
  ✓ [T06] Entity IDs unique within namespaces
  ✓ [T07] All dimension parentDomainId resolve
  ✓ [T08] All topic parentDimensionId resolve
  ✓ [T09] Bidirectional coverage has 103 rows
  ✓ [T10] Topic-side distribution totals 103
  ✓ [T11] Dimension-side distribution totals 103
  ✓ [T12] Distributions reported separately (not merged)
  ✓ [T13] Seven discrepancy investigations present
  ✓ [T14] Upstream validationPassed flag preserved as false
  ✓ [T15] Upstream flag meaning documented

Phantom references:
  ✓ [P01] Phantom count reproduces 370
  ✓ [P02] Dataset phantom count matches recomputation
  ✓ [P03] Historical claim of 370 preserved
  ✓ [P04] Dimension-side reference total reproduces 549
  ✓ [P05] Every phantom classified (no UNRESOLVED left silent)
  ✓ [P06] Classification counts sum to reference count
  ✓ [P07] No phantom marked as auto-resolved
  ✓ [P08] Wrong-parent refs separated from phantoms
  ✓ [P09] Every phantom truly absent from topics.json

Relationships and proposals:
  ✓ [R01] All relationship endpoints resolve
  ✓ [R02] No self-references
  ✓ [R03] No duplicate edges
  ✓ [R04] Semantic/scholarly validity NOT claimed by automation
  ✓ [Q01] Proposal count 60
  ✓ [Q02] Proposal IDs unique
  ✓ [Q03] Proposal titles unique
  ✓ [Q04] Proposal targets resolve
  ✓ [Q05] Category distribution sums to 60
  ✓ [Q06] All proposals remain PENDING
  ✓ [Q07] No proposal implemented in production

Report-to-JSON agreement:
  ✓ [D01] Count Markdown contains no retracted 149 figure as canonical
  ✓ [D02] Count Markdown contains no retracted 138 figure as canonical
  ✓ [D03] Count Markdown states verified 230
  ✓ [D04] Count Markdown states verified 236
  ✓ [D05] Phantom Markdown states 370
  ✓ [D06] Defective methodologies disclosed, not hidden
  ✓ [D07] Validator results JSON records 39 executed checks
  ✓ [D08] Validator results JSON records exit code 0

Deterministic generation:
  ✓ [G01] Generator script exists
  ✓ [G02] Generator exits 0
  ✓ [G03] Regeneration is byte-identical (SHA-256)
  ✓ [G04] Generated output contains no timestamps

Production protection:
  ✓ [X01] Unchanged: domains.json
  ✓ [X02] Unchanged: dimensions.json
  ✓ [X03] Unchanged: subdimensions.json
  ✓ [X04] Unchanged: topics.json
  ✓ [X05] Unchanged: relationships.json
  ✓ [X06] Unchanged: topic-ayah-mappings.json
  ✓ [X07] Git reports no changes under data/taxonomy or src
  ✓ [X08] Public AI answers remain OFF
  ✓ [X09] Inventory records AI feature disabled
  ✓ [X10] Artifact-count contradiction documented (6 vs 7)

========================================
Checks: 80  PASS: 80  FAIL: 0  WARNING: 0
========================================

EXIT CODE: 0
```

**Mark count verification:** 80 ✓ marks, 0 ✗ marks, 0 ! marks. Matches summary line exactly.

---

## 4. Full Validation Suite Results

```
✅ Quran Data: PASSED
✅ Source Licenses: PASSED
✅ Taxonomy: PASSED
✅ Ayah Mappings: PASSED
✅ Root Registry: PASSED

Total: 5 passed, 0 failed
EXIT CODE: 0
```

No conflicts between the MFD-09.2.1 validator and the broader suite.

---

## 5. Outcome Classification

| Criterion | Status |
|-----------|--------|
| Validator script exists | ✅ |
| All 80 checks pass on execution | ✅ |
| No hardcoded passes | ✅ |
| Exit code 0 on all-pass | ✅ |
| Reads canonical sources directly | ✅ |
| Deterministic regeneration confirmed | ✅ |
| Production data unchanged | ✅ |
| Full suite also passes | ✅ |

**Classification: ✅ VERIFIED_PASS**

The claimed 80/80 PASS result is **independently reproduced and fully substantiated**.
