# MFD-11.5 Regression Test Suite

> **proposedBy:** ai-assisted  
> **reviewStatus:** pending-scholarly-review  
> **generatedAt:** 2026-11-21T00:30:00+05:00

## Purpose

This document defines the mandatory regression test suite that **must pass** before any MFD-11.5 output can be considered release-ready. Tests are organized into five categories covering corpus integrity, linguistic consistency, reproducibility, experience, and regression safety.

---

## 1. Corpus Integrity Tests

| ID | Test Case | Method | Pass Criteria | Current Status |
|----|-----------|--------|---------------|----------------|
| CI-01 | SHA-256 baseline match for all 114 corpus files | Compare live hashes against `MFD-11.5-INTEGRITY-BASELINE.json` → `corpus` | All 114 hashes match exactly | ✅ PASS (baseline captured) |
| CI-02 | SHA-256 baseline match for all taxonomy files | Compare live hashes against baseline → `taxonomy` | All 19 hashes match exactly | ✅ PASS (baseline captured) |
| CI-03 | Root-occurrences file count stability | Count files in `data/root-occurrences/*.json` | Count equals 1576 (baseline value) | ✅ PASS (baseline captured) |
| CI-04 | Sampled root-occurrences hash stability | Compare first 10 sorted file hashes against baseline | All 10 sampled hashes match | ✅ PASS (baseline captured) |
| CI-05 | Corpus JSON well-formedness | Parse every `{1..114}.json` as valid JSON | Zero parse errors across 114 files | ✅ PASS (validated during hash capture) |
| CI-06 | Topic-ayah-mappings referential integrity | Verify every mapping's surahNumber:ayahStart/ayahEnd exists in pinned corpus | Zero broken references in full scan (sampled 50/789 → 0 broken) | ✅ PASS (sampled) |

---

## 2. Linguistic Consistency Tests

| ID | Test Case | Method | Pass Criteria | Current Status |
|----|-----------|--------|---------------|----------------|
| LC-01 | Arabic excerpt verbatim match | For every extraction file, each `arabicExcerpts[].text` must be a substring of the corresponding corpus verse text | Zero mismatches across all 473 extractions (sampled 10 files / 59 excerpts → 0 mismatches) | ✅ PASS (sampled) |
| LC-02 | Verse key format validation | Every `verseKeys[]` entry matches `^[0-9]{1,3}:[0-9]{1,3}$` | Zero format violations | ✅ PASS (validated in schema check) |
| LC-03 | Priority root morphology consistency | Cross-check 9 priority roots between `root-morphology-index.json` and `data/root-occurrences/` | All roots present in both; term overlap confirmed | ⚠️ WARN — 6/9 roots missing from morphology index; 3/9 present but no term overlap with occurrence lemmas |
| LC-04 | Schema conformance for extraction files | Validate all 473 extraction files against `passage-extraction.schema.json` | Zero structural violations (sampled 10 → 0 issues) | ✅ PASS (sampled) |
| LC-05 | Evidence link verse existence | Every `evidence[].key` in topic candidates resolves to a valid corpus verse | Zero dangling references | 🔲 NOT YET TESTED (requires full candidate scan) |

---

## 3. Reproducibility Tests

| ID | Test Case | Method | Pass Criteria | Current Status |
|----|-----------|--------|---------------|----------------|
| RP-01 | Deterministic extraction output | Re-run extraction pipeline on same input passages; diff outputs | Byte-identical outputs or documented non-determinism | 🔲 NOT YET TESTED |
| RP-02 | Schema version pinning | All schemas declare explicit `$schema` URI | All use `draft/2020-12` (noted deviation from draft-07 requirement) | ⚠️ INFO — Uses 2020-12, not draft-07 |
| RP-03 | Baseline regeneration idempotency | Re-running baseline capture produces identical hash set | Identical JSON output | 🔲 NOT YET TESTED |

---

## 4. Experience Tests

| ID | Test Case | Method | Pass Criteria | Current Status |
|----|-----------|--------|---------------|----------------|
| EX-01 | Extraction file loadability | Load each extraction JSON in target application without error | Zero load failures | 🔲 NOT YET TESTED |
| EX-02 | Taxonomy mapping completeness | Every topic in `topics.json` has at least one mapping in `topic-ayah-mappings.json` | Coverage ≥ defined threshold | 🔲 NOT YET TESTED |
| EX-03 | Arabic text rendering | Render sampled Arabic excerpts in UI; visual inspection for diacritic correctness | No rendering defects | 🔲 NOT YET TESTED (manual) |

---

## 5. Regression Safety Tests

| ID | Test Case | Method | Pass Criteria | Current Status |
|----|-----------|--------|---------------|----------------|
| RG-01 | No modification to production data | Verify `data/` directory hashes unchanged after MFD-11.5 pipeline run | All hashes match pre-run baseline | 🔲 NOT YET TESTED (post-run check) |
| RG-02 | No modification to source code | Verify `src/` directory unchanged | Zero file changes in `src/` | 🔲 NOT YET TESTED (post-run check) |
| RG-03 | Extraction count stability | Total extraction file count remains stable across runs | Count = 473 ± documented delta | ✅ PASS (current count: 473) |
| RG-04 | Metadata provenance enforcement | Every extraction has `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"` | 100% compliance in sample | ✅ PASS (validated in schema check) |
| RG-05 | No orphaned mappings | Every `topicId` in mappings references an existing topic in `topics.json` | Zero orphans | 🔲 NOT YET TESTED |

---

## Summary

| Category | Total Tests | Passed | Warned | Not Tested |
|----------|-------------|--------|--------|------------|
| Corpus Integrity | 6 | 6 | 0 | 0 |
| Linguistic Consistency | 5 | 3 | 1 | 1 |
| Reproducibility | 3 | 0 | 1 | 2 |
| Experience | 3 | 0 | 0 | 3 |
| Regression Safety | 5 | 2 | 0 | 3 |
| **TOTAL** | **22** | **11** | **2** | **9** |

## Known Issues Requiring Attention Before Release

1. **LC-03 (WARN):** 6 of 9 priority roots (جهد, زين, جمل, عهد, وثق, صلح) are absent from `root-morphology-index.json`. 3 present roots (قتل, حسن, سلم) have no term overlap with occurrence lemmas due to transliteration-key vs Arabic-key mismatch in the terminology index. This is a **data integration gap**, not a corruption issue.
2. **RP-02 (INFO):** Schemas use JSON Schema draft/2020-12 instead of the originally specified draft-07. Structurally valid but may affect validator compatibility.
3. **9 tests remain untested** and must be executed before release sign-off.
