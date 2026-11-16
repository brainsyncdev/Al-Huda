# MFD-09.2 Canonical Mapping & Evidence Integrity Report

**Generated:** 2026-11-16T10:30:00+05:00  
**Auditor:** Subagent mfd092-mapping-auditor (Independent Audit)  
**Scope:** All 789 mapping records in `data/taxonomy/topic-ayah-mappings.json`

---

## Executive Summary

This independent audit verifies every statistic in the MFD-09.1 canonical dataset against actual source files. **All core data is intact and internally consistent.** One methodological discrepancy was identified in multi-topic ayah counting that requires documentation clarification but does not indicate data corruption.

### Validation Result: ✅ PASSED

---

## 1. Independent Ayah Statistics Verification

All statistics calculated independently from actual ranges (`ayahEnd - ayahStart + 1`):

| Metric | MFD-09.1 Reported | MFD-09.2 Computed | Match |
|--------|-------------------|-------------------|-------|
| Total Mapping Records | 789 | 789 | ✅ |
| Expanded Ayah Occurrences | 1,886 | 1,886 | ✅ |
| Unique Surah-Ayah Combinations | 1,550 | 1,550 | ✅ |
| Ayat Mapped to Multiple Topics | 236 | 230* | ⚠️ |
| Ayat Mapped to 3+ Topics | 74 | 74 | ✅ |
| Maximum Overlap (single Ayah) | 6 | 6 | ✅ |
| Invalid Ranges | 0 | 0 | ✅ |
| Duplicate Mapping IDs | 0 | 0 | ✅ |
| Duplicate Mapping Records | 0 | 0 | ✅ |

### ⚠️ Multi-Topic Ayah Discrepancy Explained

**Root Cause:** MFD-09.1 used a **raw count** methodology (counting each mapping record touching an ayah), while MFD-09.2 uses a **unique-topic** methodology (counting distinct topics per ayah).

- **236 (raw):** Counts every mapping record that touches an ayah, including cases where the same topic is assigned twice to the same ayah range
- **230 (unique):** Counts only distinct topics per ayah, eliminating duplicate topic assignments

**7 ayat have duplicate topic assignments** (same topic mapped twice to the same ayah range):

| Ayah | Duplicated Topic |
|------|-----------------|
| 22:27 | hajj-rites |
| 22:28 | hajj-rites |
| 22:29 | hajj-rites |
| 22:33 | hajj-rites |
| 22:34 | hajj-rites |
| 17:23 | elderly-care |
| 2:184 | ramadan-fasting |

**Recommendation:** Use 230 (unique topics) as the canonical metric. Document 236 as the raw count. Investigate whether the 7 duplicate topic assignments are intentional or should be deduplicated.

---

## 2. Verdict Distribution Verification

Recalculated from `data/audit/mfd-09-1-canonical-mapping-audit.json`:

| Verdict | Count | Percentage |
|---------|-------|------------|
| ACCEPT_AS_DIRECT | 661 | 83.8% |
| ACCEPT_AS_THEMATIC | 128 | 16.2% |
| **Total** | **789** | **100%** |

✅ Sum equals 789. Distribution matches MFD-09.1 reports exactly.

---

## 3. Mapping Type Distribution

| Type | Count | Percentage |
|------|-------|------------|
| DIRECT_REFERENCE | 468 | 59.3% |
| EXPLICIT_INSTRUCTION | 115 | 14.6% |
| THEMATIC_REFERENCE | 128 | 16.2% |
| PROPHETIC_NARRATIVE | 78 | 9.9% |

✅ Matches MFD-09.1 reports exactly.

---

## 4. Historical Reclassification Candidates

All 5 MFD-09 historical reclassification candidates were investigated:

| Mapping ID | Ayah | Exists | Current Type | Verdict | Recommended | Changed | Needs Review |
|-----------|------|--------|-------------|---------|-------------|---------|-------------|
| map-worker-rights-0729 | 2:233 | ✅ | DIRECT_REFERENCE | ACCEPT_AS_DIRECT | None | No | Yes |
| map-marital-rights-0480 | 2:228 | ✅ | DIRECT_REFERENCE | ACCEPT_AS_DIRECT | None | No | Yes |
| map-divorce-types-0514 | 2:230 | ✅ | DIRECT_REFERENCE | ACCEPT_AS_DIRECT | None | No | Yes |
| map-child-custody-hadanah-0519 | 65:6 | ✅ | DIRECT_REFERENCE | ACCEPT_AS_DIRECT | None | No | Yes |
| map-sadaqah-jariyah-0584 | 57:18 | ✅ | DIRECT_REFERENCE | ACCEPT_AS_DIRECT | None | No | Yes |

**Finding:** All 5 candidates exist in current source data, retain their original `DIRECT_REFERENCE` classification, received `ACCEPT_AS_DIRECT` verdicts, have no recommended reclassification, and remain `PENDING_SCHOLARLY_REVIEW`. No actual changes were made during MFD-09.1 — consistent with the conservative approach documented in MFD-09-1-RECLASSIFICATION-RECONCILIATION.md.

---

## 5. Evidence Integrity Verification

### Evidence Source Resolution

✅ **All 789 mappings** reference `quran-json` as their sole evidence source.  
✅ `quran-json` is a valid source in `src/lib/quran/sources.ts` (line 41).  
✅ No mappings reference non-existent source IDs.

### Evidence Type Accuracy

| Evidence Type | Count | Accurate |
|--------------|-------|----------|
| TRANSLATION_SUPPORTED | 789 | ✅ |
| QURAN_TEXT_ONLY | 0 | ✅ |
| TAFSIR_ATTACHED | 0 | ✅ |
| TAFSIR_VERIFIED | 0 | ✅ |
| SCHOLAR_REVIEWED | 0 | ✅ |

✅ All evidence types accurately reflect what exists. `quran-json` provides Arabic text + English translation (Saheeh International) but NOT tafsir, so `TRANSLATION_SUPPORTED` is correct for all 789.

### Tafsir Evidence Status

| Status | Count |
|--------|-------|
| NOT_ATTACHED | 789 |

✅ Accurate — no tafsir sources are attached to any mapping.

### Translation Evidence Status

| Status | Count |
|--------|-------|
| ATTACHED | 789 |

✅ Accurate — `quran-json` bundles Saheeh International translation.

### Scholarly Review Status

| Status | Count |
|--------|-------|
| PENDING_SCHOLARLY_REVIEW | 789 |

✅ All 789 records correctly marked as pending. No false scholarly approval states detected.

### Confirmation: quran-json Capabilities

Per `src/lib/quran/sources.ts`:
- ✅ Provides: Quran structure, surah metadata, Arabic text, translation, transliteration
- ❌ Does NOT provide: Tafsir, scholarly commentary, classical interpretation

---

## 6. JSON vs Markdown Inconsistency Detection

### Inconsistencies Found

| # | Field | JSON Value | Markdown Value | Source File | Severity | Resolution |
|---|-------|-----------|---------------|-------------|----------|------------|
| 1 | multiTopicAyat | 230 | 236 | MFD-09-1-MAPPING-RECONCILIATION-REPORT.md | LOW | Methodology difference (unique vs raw count). Document both. |
| 2 | multiTopicAyat | 230 | 236 | MFD-09-1-AYAH-COUNT-RECONCILIATION.md | LOW | Same as above. |
| 3 | multiTopicAyat | 230 | 236 | MFD-09-1-AYAH-OVERLAP-AUDIT.md | LOW | Same as above. |
| 4 | duplicateTopicAssignments | 7 detected | Not mentioned | ALL MFD-09.1 REPORTS | MEDIUM | 7 ayat have duplicate topic assignments. Should be documented or deduplicated. |

### Reports Verified Consistent

- ✅ MFD-09-1-EVIDENCE-INTEGRITY-REPORT.md — All claims verified accurate
- ✅ MFD-09-1-RECLASSIFICATION-RECONCILIATION.md — All claims verified accurate
- ✅ Verdict distribution (661/128) consistent across all reports
- ✅ Mapping type distribution consistent across all reports
- ✅ Evidence integrity claims consistent across all reports

---

## 7. Overlap Distribution

| Topics per Ayah | Count |
|----------------|-------|
| 1 topic | 1,320 |
| 2 topics | 156 |
| 3 topics | 54 |
| 4 topics | 16 |
| 5 topics | 3 |
| 6 topics | 1 |

---

## 8. Recommendations

1. **Document counting methodology**: Explicitly distinguish between raw (236) and unique-topic (230) multi-topic counts in all future reports
2. **Investigate duplicate topic assignments**: Determine whether the 7 duplicate topic assignments (e.g., hajj-rites appearing twice for 22:27) are intentional or should be deduplicated
3. **Maintain evidence integrity**: Continue the current practice of accurate evidence labeling — no fabricated tafsir or scholarly approvals
4. **Scholarly review pipeline**: All 789 mappings remain PENDING_SCHOLARLY_REVIEW; establish workflow before marking any as approved
5. **Tafsir attachment**: Consider attaching available tafsir sources (tafsir-jalalayn, tafsir-muyassar) to DIRECT_REFERENCE mappings where applicable

---

## 9. Deliverables

1. `data/audit/mfd-09-2-mapping-integrity.json` — Machine-readable audit results
2. This report (`docs/MFD-09-2-MAPPING-INTEGRITY-REPORT.md`)

---

## Appendix: Audit Methodology

- **Source data**: `data/taxonomy/topic-ayah-mappings.json` (789 records)
- **Audit JSON**: `data/audit/mfd-09-1-canonical-mapping-audit.json` (789 records)
- **Source catalog**: `src/lib/quran/sources.ts` (14 source records)
- **Markdown reports**: 5 MFD-09.1 mapping-related reports
- **Calculation method**: PowerShell scripts processing full JSON datasets
- **Multi-topic counting**: Both raw and unique-topic methodologies applied
- **No modifications made**: This audit is read-only per immutable rules