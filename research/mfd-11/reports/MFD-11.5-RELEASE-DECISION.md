# MFD-11.5 Release Readiness Assessment

> **proposedBy:** ai-assisted  
> **reviewStatus:** pending-scholarly-review  
> **generatedAt:** 2026-11-21T00:30:00+05:00  
> **Assessor:** WS6 (Quality Assurance & Release Governance)

---

## Executive Summary

**Release Decision: ⛔ NOT READY — Conditional Approval Pending**

The production integrity baseline has been successfully established and core validation checks pass. However, 9 of 22 regression tests remain unexecuted, and a significant data integration gap exists in root-morphology coverage for priority roots. MFD-11.5 outputs **must not** be promoted to production until the gate criteria below are satisfied.

---

## Files Baselined

| Asset Class | Count | Hash Algorithm | Baseline File |
|-------------|-------|----------------|---------------|
| Qur'anic corpus (en chapters) | 114 | SHA-256 | `MFD-11.5-INTEGRITY-BASELINE.json` → `corpus` |
| Production taxonomy | 19 | SHA-256 | `MFD-11.5-INTEGRITY-BASELINE.json` → `taxonomy` |
| Root-occurrences (sampled) | 10 of 1576 | SHA-256 | `MFD-11.5-INTEGRITY-BASELINE.json` → `rootOccurrences.sampledFiles` |

**Total protected files baselined:** 143 (114 + 19 + 10 sampled)

---

## Validation Results Summary

| Check | Result | Detail |
|-------|--------|--------|
| Schema structural validity | ✅ PASS | All 3 schemas structurally valid (note: draft/2020-12, not draft-07) |
| Extraction schema conformance (sample 10) | ✅ PASS | 10/10 extractions conform to passage-extraction.schema.json |
| Referential integrity (sample 50/789 mappings) | ✅ PASS | 0 broken references |
| Arabic text verbatim match (10 files, 59 excerpts) | ✅ PASS | 0 mismatches against pinned corpus |
| Root-morphology consistency (9 priority roots) | ⚠️ WARN | 6/9 roots missing from morphology index; 3/9 have term-key mismatch |

---

## Explicit Gate Criteria for Release

All gates must be marked ✅ before MFD-11.5 output can be merged or deployed.

### Gate 1: Production Data Immutability ✅
- [x] SHA-256 baseline captured for all corpus, taxonomy, and sampled root-occurrences files
- [x] No writes to `data/` or `src/` during this audit session
- [ ] Post-pipeline re-verification confirms zero hash changes (RG-01, RG-02)

### Gate 2: Linguistic Accuracy ✅ (Sampled)
- [x] Arabic excerpts verified verbatim against pinned corpus (sampled)
- [x] Verse key format validated
- [ ] Full-scan Arabic verification across all 473 extractions (LC-01 full)
- [ ] Evidence link verse existence check across all candidates (LC-05)

### Gate 3: Morphological Data Integration ⚠️ BLOCKED
- [ ] Resolve absence of 6 priority roots from `root-morphology-index.json` (جهد, زين, جمل, عهد, وثق, صلح)
- [ ] Resolve term-key mismatch for 3 present roots (قتل, حسن, سلم) — transliteration keys in index vs Arabic keys in occurrences
- [ ] Document resolution or obtain scholarly waiver

### Gate 4: Regression Test Completion ⚠️ INCOMPLETE
- [ ] Execute remaining 9 untested regression tests (see REGRESSION-REPORT.md)
- [ ] All 22 tests must reach PASS or documented WAIVED status

### Gate 5: Scholarly Review Sign-off ⏳ PENDING
- [ ] All outputs carry `reviewStatus: "pending-scholarly-review"`
- [ ] Qualified scholar reviews and approves extraction methodology
- [ ] Root-morphology discrepancies reviewed and adjudicated

---

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Undetected Arabic text corruption in unsampled extractions | High | Low | Expand LC-01 to full 473-file scan before release |
| Root-morphology gaps propagate to downstream synthesis | Medium | High | Block release until Gate 3 resolved |
| Schema draft version mismatch causes validator failures | Low | Medium | Pin Ajv 8.x with draft-2020 support; document deviation |
| Post-pipeline data mutation goes undetected | Critical | Low | Mandatory RG-01/RG-02 post-run hash verification |

---

## Recommendations

1. **Immediate:** Execute the 9 remaining regression tests, prioritizing RG-01, RG-02, and LC-05.
2. **Before release:** Resolve root-morphology index gaps for the 9 priority roots. This likely requires regenerating `root-morphology-index.json` with Arabic-key lookups instead of transliteration-key lookups.
3. **Process improvement:** Upgrade schema `$schema` declarations to explicitly state draft/2020-12 acceptance, or downgrade schemas to draft-07 for broader validator compatibility.
4. **Ongoing:** Automate baseline hash verification as a CI gate so no future pipeline can silently mutate production data.

---

## Deliverables Produced

| File | Description |
|------|-------------|
| [`MFD-11.5-INTEGRITY-BASELINE.json`](./MFD-11.5-INTEGRITY-BASELINE.json) | SHA-256 hashes for 143 protected files |
| [`MFD-11.5-VALIDATION-REPORT.json`](./MFD-11.5-VALIDATION-REPORT.json) | Schema, referential, Arabic text, and morphology validation results |
| [`MFD-11.5-REGRESSION-REPORT.md`](./MFD-11.5-REGRESSION-REPORT.md) | 22-test regression suite with current pass/fail status |
| [`MFD-11.5-RELEASE-DECISION.md`](./MFD-11.5-RELEASE-DECISION.md) | This release readiness assessment |

---

*This assessment was produced by automated audit tooling. All findings require human scholarly review before acting on release decisions.*
