# MFD-11.5 WS2: Arabic Root & Lexical Remediation Report

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 (FAHM Development Programme) |
| Phase | WS2 - Arabic Root & Lexical Remediation |
| Date | 2026-11-21 |
| Agent | agent-91 (AI-assisted) |
| Review Status | pending-scholarly-review |
| Scope | RESEARCH ONLY - No production files modified |

---

## 1. Executive Summary

This report documents the comprehensive audit of 649 Arabic terminology entries and their 595 root assignments against the authoritative `data/root-occurrences/` infrastructure (1,576 validated root files). The audit revealed a **systemic defect** in the root-morphology-index.json: 235 of 451 root keys are invalid slugs that do not exist in the root-occurrences infrastructure, primarily due to erroneous prefix characters prepended to valid roots.

### Key Findings
- **Entries audited:** 649/649 (100%)
- **Coverage reconciliation:** 595 terms have root assignments, 54 lack them (confirmed discrepancy)
- **Valid root assignments:** 272 terms directly match valid root-occurrence slugs
- **Lexical corrections applied:** 100 terms corrected via classical lexicon cross-reference
- **Unresolved assignments:** 223 terms require manual scholarly review
- **Critical errors resolved:** 9/9 known errors from MFD-11.4 WS4 investigated and documented
- **Corpus verification:** 630 fully verified, 19 partial matches, 0 mismatches
- **Root disagreements flagged:** 8 terms with legitimate alternative classical analyses

> **CRITICAL DISCLAIMER:** All corrections, root assignments, and verifications are marked `pending-scholarly-review`. Computational tools are candidate generators only; human scholarly review is the validation mechanism. No entry has been marked as scholarly-approved.

---

## 2. Methodology

### 2.1 Data Sources
| Source | Path | Purpose |
|--------|------|---------|
| Terminology Index | `research/mfd-11/reports/arabic-terminology-index.json` | 649 unique terms with Arabic surface, transliteration, gloss, verse occurrences |
| Morphology Index | `research/mfd-11/reports/root-morphology-index.json` | 595 root assignments with confidence levels and morphological patterns |
| Root Occurrences | `data/root-occurrences/*.json` | 1,576 validated root files serving as authoritative slug registry |
| Quran Corpus | `node_modules/quran-json/dist/chapters/en/{surah}.json` | Pinned quran-json@3.1.2 corpus for Arabic text verification |
| Quality Audit | `research/mfd-11/reports/MFD-11.4-QUALITY-AUDIT-REPORT.md` | MFD-11.4 WS4 findings including 9 critical errors |

### 2.2 Audit Process
1. **Reconciliation:** Cross-referenced all 649 term keys against morphology index to identify exactly 54 unassigned terms
2. **Slug Validation:** Extracted clean Arabic root letters from each assigned root and checked existence in `data/root-occurrences/`
3. **Lexical Correction:** Built a correction map of 100+ terms using Lane Lexicon, Hans Wehr, and classical tafsir sources
4. **Corpus Verification:** Normalized Arabic text (removed tashkeel, alef-wasla, tatweel) and performed substring matching against quran-json verses
5. **Disagreement Analysis:** Identified terms where classical scholars hold multiple valid root derivations

### 2.3 Root Assignment Record Format
Each corrected entry follows the prescribed format:
`json
{
  "originalKey": "term-key",
  "arabicSurface": "Arabic text",
  "normalizedArabic": "Arabic text",
  "proposedRoot": "corrected-root-slug",
  "alternativeRoots": [],
  "analysisMethod": "computational-lexical-cross-reference",
  "lexicalSources": ["Lane Lexicon", "Hans Wehr", "root-occurrences/"],
  "computationalSource": "root-morphology-index.json",
  "reviewerIdentity": "ai-assisted",
  "reviewStatus": "pending-scholarly-review",
  "rationale": "Explanation of correction",
  "versionHistory": [{"date": "2026-11-21", "action": "MFD-11.5-WS2-audit", "agent": "agent-91"}]
}
`

---

## 3. Coverage Reconciliation (Task 1)

The 595-vs-649 discrepancy is confirmed: **exactly 54 terms lack root assignments** in the morphology index.

### 54 Unassigned Terms
a-ilan-fa-aghna, afwajan, al-yusr, alif-lam-mim, amaniyy, awliya, awtad, awwab, dakkatan-dakka, dallan-fa-hada, dar-al-qarar, din-al-qayyim, diyatan, fataba, fay-, ghawr, ham, hillun, hubban-jamma, huzuw, iram, khawf, khayr-al-bariyyah, khizy, kufuwan, lahw, lam-yalid-wa-lam-yulad, lawh-mahfuz, nabi, nooran, qawl-thaqil, qiyam, rana, ri-a, roohun, saff, saq, shiya-, shuhh-al-nafs, suwa-, tazyin, teen, tuwa, ulu-l--azm, umm-hawiyah, ummah, ummiyyoon, uswah-hasanah, wadd, wahy, walayah, waliy, yaghulla, yatim

### Why These Terms Lack Assignments
Analysis reveals these terms fall into categories the original root-assignment process could not handle:
1. **Phrasal/compound terms** (e.g., dar-al-qarar, din-al-qayyim) - multi-word expressions where single-root assignment is inappropriate
2. **Hapax legomena and rare forms** (e.g., dakkatan-dakka, fay-) - insufficient training data for automated assignment
3. **Huruf muqattaat** (alif-lam-mim) - disjointed letters with no derivable root
4. **Grammatical particles/pronouns** (e.g., ham, hillun) - functional words outside standard root morphology
5. **Processing gaps** - terms that were simply missed during the batch extraction pipeline

---

## 4. Root Assignment Audit (Task 2)

### Systemic Defect Discovery
The audit revealed that **235 of 451 root keys** in the morphology index are invalid slugs. The primary defect pattern is the erroneous prepending of Arabic letters (especially lam, ba, fa, ta) to otherwise valid roots. For example:
- Valid root عقب was stored as key لعق with root value ل-ع-ق
- Valid root نفش was stored under key لمن with root value ل-م-ن
- Valid root برج was stored as key لبر with root value ل-ب-ر

This suggests the root-extraction algorithm had a systematic bug that captured prefix letters (possibly from attached prepositions like li-, bi-, fa-) as part of the root.

### Audit Results Summary
| Category | Count | Percentage |
|----------|-------|------------|
| Valid (direct slug match) | 272 | 41.9% |
| Corrected (lexical lookup) | 100 | 15.4% |
| Unresolved (needs review) | 223 | 34.4% |
| No root assigned | 54 | 8.3% |
| **Total** | **649** | **100%** |

---

## 5. Critical Error Investigation (Task 3)

All 9 critical errors identified by MFD-11.4 WS4 have been investigated and documented.

### Error Register

| # | Term Key | Incorrect Root | Correct Root | Rationale | Source Provenance |
|---|----------|---------------|-------------|-----------|-------------------|
| 1 | -iqab | l-'-q | عقب ('-q-b) | Iqab (penalty/retribution) derives from '-q-b. The assigned root means to lick - semantically unrelated. | Lane Lexicon, root-occurrences/عقب.json |
| 2 | -ihn-manfush | l-m-n | نفش (n-f-sh) | Manfush (fluffed/scattered wool) is passive participle of n-f-sh. Assigned root is fabricated. | Lane Lexicon, root-occurrences/نفش.json |
| 3 | al-birr | r-b-h | برر (b-r-r) | Dual error: Wrong root (birr derives from b-r-r) AND wrong Arabic surface (text at 5:2 means their Lord not birr). | MFD-11.4 WS4, root-occurrences/برر.json |
| 4 | jihad | w-j-h | جهد (j-h-d) | Jihad (striving) derives from j-h-d. Assigned root means face/direction - completely unrelated. | WS2 JHD analysis, root-occurrences/جهد.json |
| 5 | al-mujahidoona | l-m-j | جهد (j-h-d) | Mujahidoona is Form III active participle of j-h-d. Assigned root is fabricated/non-existent. | WS2 JHD analysis, root-occurrences/جهد.json |
| 6 | al-haqq | b-l-h | حقق (h-q-q) | Haqq (truth/reality) derives from h-q-q. Assigned root is unrelated. | Lane Lexicon, root-occurrences/حقق.json |
| 7 | adhab | l-'-dh | عذب ('-dh-b) | Adhab (punishment) derives from '-dh-b. Assigned root includes spurious lam prefix. | Lane Lexicon, root-occurrences/عذب.json |
| 8 | al-maghdub | l-m-gh | غضب (gh-d-b) | Maghdub (angered upon) derives from gh-d-b. Assigned root is fabricated. | Lane Lexicon, root-occurrences/غضب.json |
| 9 | al-khannas | l-kh-n | خنس (kh-n-s) | Khannas (retreating whisperer) derives from kh-n-s. Assigned root includes spurious lam prefix. | Lane Lexicon, root-occurrences/خنس.json |

---

## 6. Arabic Text Corpus Verification (Task 4)

### Methodology
Each term's Arabic surface text was compared against the pinned quran-json@3.1.2 corpus. Both texts were normalized by removing tashkeel/diacritics, alef wasla, and tatweel/kashida before substring matching.

### Verification Results
| Status | Count | Description |
|--------|-------|-------------|
| Fully Verified | 630 | Surface text found in all listed verse occurrences |
| Partial Match | 19 | Surface text found in some but not all listed occurrences |
| Mismatched | 0 | Surface text not found in any listed verse occurrence |

### Notable Findings
- **96.8% full verification rate** confirms the extraction pipeline produced accurate Arabic surface text for the vast majority of terms
- The 19 partial matches typically involve terms where one occurrence verifies but another does not, often due to orthographic variants across surahs
- The al-birr entry is confirmed as having wrong Arabic surface text: the index stores rabbihim when the term key implies birr

---

## 7. Root Disagreement Register (Task 5)

Eight terms have been identified where classical Arabic lexicographers and exegetes hold legitimate alternative root analyses.

| Term | Primary Root | Alternative Roots | Disagreement Type | Disposition |
|------|-------------|-------------------|-------------------|-------------|
| ababil | ببل | ابل, بيل | Etymological dispute | Record all alternatives |
| al-ma-un | معن | عون, مين | Morphological dispute | Record all alternatives |
| al-kawthar | كثر | كوثر | Derivational dispute | Primary + note proper noun view |
| al-judiyy | جود | جدي | Toponym dispute | Note uncertainty |
| al-tin | تين | تنن | Loanword dispute | Note loanword status |
| alif-lam-mim | N/A | N/A | Huruf muqattaat | Defer to tafsir |
| ghassaq | غسق | غصص, غشش | Semantic dispute | Record all alternatives |
| sijjeel | سجل | (Persian loan?) | Etymological dispute | Record all alternatives |

---

## 8. Source Provenance (Task 6)

Every correction carries provenance metadata:
- **Computational source:** root-morphology-index.json cross-referenced against data/root-occurrences/ file system
- **Lexical sources:** Lane Arabic-English Lexicon, Hans Wehr Dictionary of Modern Written Arabic
- **Tafsir sources:** Al-Tabari, Ibn Kathir, Al-Qurtubi, Al-Zamakhshari, Al-Razi (for disputed terms)
- **Prior audit:** MFD-11.4 WS4 Quality Audit Report (for 9 critical errors)
- **Reviewer identity:** ai-assisted
- **Review status:** pending-scholarly-review (NO entry marked as approved)

---

## 9. Deliverables

All deliverables written to `research/mfd-11/reports/`:

| File | Description | Entries |
|------|-------------|---------|
| root-assignment-audit.json | Full audit results for all 649 entries with corrected roots | 649 |
| root-error-register.json | All errors found with before/after records | 323 |
| arabic-text-verification.json | Corpus verification results for all 649 terms | 649 |
| root-disagreement-register.json | Entries with legitimate alternative analyses | 8 |
| MFD-11.5-ROOT-REMEDIATION-REPORT.md | This summary report | N/A |

---

## 10. Recommendations

1. **Do NOT deploy corrected roots to production** until scholarly review is complete
2. **Fix the root-extraction pipeline** that produced the systemic prefix-prepending defect (235 invalid slugs)
3. **Correct the Arabic surface text** for al-birr (currently shows rabbihim instead of birr)
4. **Address the 54 unassigned terms** through targeted manual root assignment
5. **Resolve the 8 disagreement cases** through scholarly consultation
6. **Investigate the 19 partial corpus matches** for orthographic normalization issues

---

*Report generated by WS2 agent-91 on 2026-11-21. All findings are computational candidates pending scholarly review.*
