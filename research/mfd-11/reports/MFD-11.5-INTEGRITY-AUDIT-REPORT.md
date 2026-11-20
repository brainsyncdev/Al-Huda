# MFD-11.5 Arabic Terminology Integrity Audit Report

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 (Arabic Terminology Remediation) |
| Date | 2026-11-20 |
| Proposed By | ai-assisted |
| Review Status | pending-scholarly-review |
| Methodology | Exhaustive (no sampling) |

## Executive Summary

This audit verifies ALL 649 entries in the Arabic terminology index against the pinned quran-json@3.1.2 corpus and the authoritative data/root-occurrences/ infrastructure (1,576 root files).

| Metric | Value |
|--------|-------|
| Total terms audited | 649 |
| Verified in corpus | 649 |
| Not found in corpus | 0 |
| Root verified via root-occurrences | 284 |
| Root mismatch (known errors) | 7 |
| Root missing from infrastructure | 358 |
| Duplicate groups | 16 |
| Transliteration issues | 1 |
| Surah distribution mismatches | 0 |
| Gloss quality flags | 637 |
| Critical errors | 7 |
| Major warnings | 17 |
| Minor issues | 637 |

## Priority Root Coverage Analysis

Denominator: total corpus occurrences per root from data/root-occurrences/. Numerator: occurrences captured in terminology index.

| Root | Corpus Occurrences | Indexed | Coverage % | Lemmas | Review State |
|------|-------------------|---------|------------|--------|--------------|
| جهد | 41 | 10 | 24.39% | 5 | auto-accepted |
| قتل | 170 | 28 | 16.47% | 8 | auto-accepted |
| حسن | 194 | 30 | 15.46% | 12 | auto-accepted |
| زين | 46 | 6 | 13.04% | 3 | auto-accepted |
| جمل | 11 | 1 | 9.09% | 5 | auto-accepted |
| عهد | 46 | 2 | 4.35% | 3 | auto-accepted |
| وثق | 34 | 7 | 20.59% | 6 | auto-accepted |
| سلم | 136 | 20 | 14.71% | 16 | auto-accepted |
| صلح | 180 | 13 | 7.22% | 7 | auto-accepted |

## Critical Error Register

| # | Term | Type | Detail |
|---|------|------|--------|
| 1 | -ihn-manfush | WRONG_ROOT_KNOWN | Root لمن flagged as incorrect by WS2 analysis |
| 2 | -iqab | WRONG_ROOT_KNOWN | Root لعق flagged as incorrect by WS2 analysis |
| 3 | al-mujahidoona | WRONG_ROOT_KNOWN | Root لمج flagged as incorrect by WS2 analysis |
| 4 | al-munafiqeen | WRONG_ROOT_KNOWN | Root لمن flagged as incorrect by WS2 analysis |
| 5 | amanah | WRONG_ROOT_KNOWN | Root لمن flagged as incorrect by WS2 analysis |
| 6 | ashab-al-yamin | WRONG_ROOT_KNOWN | Root لمن flagged as incorrect by WS2 analysis |
| 7 | majalis | WRONG_ROOT_KNOWN | Root لمج flagged as incorrect by WS2 analysis |

## Duplicate Groups (Top 20)

- **al-yaqin, haqq-al-yaqin, ilm-al-yaqin**: normalized Arabic identical, transliterations differ (al-yaqin vs haqq al-yaqin vs ilm al-yaqin)
- **arsh, dhi-al-arsh, dhu-al-arsh**: normalized Arabic identical, transliterations differ (arsh vs dhi al-arsh vs dhu al-arsh)
- **asra, isra-**: normalized Arabic identical, transliterations differ (asra vs isra')
- **awliya, walayah**: normalized Arabic identical, transliterations differ (awliya vs walayah)
- **bil-qist, bil-qisti, qist**: normalized Arabic identical, transliterations differ (bil-qist vs bil-qisti vs qist)
- **ghuluww, taghloo**: normalized Arabic identical, transliterations differ (ghuluww vs taghloo)
- **haneef, haneefan, hanif**: normalized Arabic identical, transliterations differ (haneef vs haneefan vs hanif)
- **hijarah-min-sijjil, sijjeel**: normalized Arabic identical, transliterations differ (hijarah min sijjil vs sijjeel)
- **hut, sahib-al-hut**: normalized Arabic identical, transliterations differ (hut vs sahib al-hut)
- **kalimah, kalimat-al-taqwa**: normalized Arabic identical, transliterations differ (kalimah vs kalimat al-taqwa)
- **muhsin, muhsinin**: normalized Arabic identical, transliterations differ (muhsin vs muhsinin)
- **naqah, naqat-allah**: normalized Arabic identical, transliterations differ (naqah vs naqat Allah)
- **nutfah, nutfah-amshaj**: normalized Arabic identical, transliterations differ (nutfah vs nutfah amshaj)
- **rasul, rasul-karim**: normalized Arabic identical, transliterations differ (rasul vs rasul karim)
- **sultan, sultanan**: normalized Arabic identical, transliterations differ (sultan vs sultanan)
- **umm-al-kitab, umm-al-qura**: normalized Arabic identical, transliterations differ (umm al-kitab vs umm al-qura)

## Worst Coverage Roots (Bottom 20)

| Root | Corpus Occ | Indexed | Coverage % |
|------|-----------|---------|------------|
| اسف | 5 | 0 | 0% |
| الو | 37 | 0 | 0% |
| امم | 13 | 0 | 0% |
| بخس | 7 | 0 | 0% |
| برز | 9 | 0 | 0% |
| برق | 7 | 0 | 0% |
| بضع | 7 | 0 | 0% |
| بطش | 10 | 0 | 0% |
| بكر | 12 | 0 | 0% |
| بكم | 6 | 0 | 0% |
| بور | 5 | 0 | 0% |
| بيض | 12 | 0 | 0% |
| ثبر | 5 | 0 | 0% |
| ثور | 5 | 0 | 0% |
| جبر | 10 | 0 | 0% |
| جثم | 5 | 0 | 0% |
| جحد | 12 | 0 | 0% |
| جدد | 9 | 0 | 0% |
| جلد | 13 | 0 | 0% |
| جلو | 5 | 0 | 0% |

## Remediation Priorities

1. **CRITICAL**: Fix 7 known root assignment errors (cross-reference WS2 findings)
2. **CRITICAL**: Investigate 0 terms not found anywhere in pinned corpus
3. **MAJOR**: Resolve 16 duplicate groups through scholarly sense-distinction review
4. **MAJOR**: Expand coverage for priority roots (j-h-d, q-t-l, etc.) using data/root-occurrences/ as source
5. **MAJOR**: Standardize transliteration across all 1 flagged terms to ISO 233-2
6. **MINOR**: Fix 0 surah distribution mismatches (automated recomputation)
7. **MINOR**: Revise 637 flagged glosses per MFD-11.5 specification rubric

## Scholarly Review Questions

1. For the 16 duplicate groups: which represent genuine polysemy requiring separate entries vs. extraction artifacts to merge?
2. Should the terminology index be rebuilt entirely from data/root-occurrences/ (1,576 roots, validated) rather than patching the Phase C output?
3. What minimum coverage percentage is required before the index can serve as a reliable research tool?
4. How should disputed root assignments (flagged by WS2 and WS4) be resolved — defer to classical lexicons or computational morphology?

---
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*No production files modified. Research-only output.*
