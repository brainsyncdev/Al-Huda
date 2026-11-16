# MFD-09.1 Mapping Reconciliation Report

**Generated:** 2026-11-16T04:44:31.218Z
**Auditor:** Subagent 1 — Ayah Mapping & Evidence Integrity Auditor

## Executive Summary

This report reconciles all 789 mapping records in `data/taxonomy/topic-ayah-mappings.json` against the canonical schema requirements for MFD-09.1.

## Key Findings

| Metric | Value |
|--------|-------|
| Total Mapping Records | 789 |
| Total Expanded Ayah Occurrences | 1886 |
| Unique Surah-Ayah Combinations | 1550 |
| Ayat Mapped to Multiple Topics | 236 |
| Ayat Mapped to 3+ Topics | 74 |
| Maximum Overlap (single Ayah) | 6 |
| Invalid Ranges | 0 |
| Duplicate Mapping Records | 0 |
| Duplicate IDs | 0 |

## Historical Comparison

| Metric | Expected | Actual | Delta |
|--------|----------|--------|-------|
| Records | 789 | 789 | 0 |
| Expanded Ayahs | 1886 | 1886 | 0 |
| Unique Ayahs | 1550 | 1550 | 0 |

## Mapping Type Distribution

| Type | Count | Percentage |
|------|-------|------------|
| DIRECT_REFERENCE | 468 | 59.3% |
| EXPLICIT_INSTRUCTION | 115 | 14.6% |
| THEMATIC_REFERENCE | 128 | 16.2% |
| PROPHETIC_NARRATIVE | 78 | 9.9% |

## Audit Verdict Distribution

| Verdict | Count |
|---------|-------|
| ACCEPT_AS_DIRECT | 661 |
| ACCEPT_AS_THEMATIC | 128 |

## Critical Issues

### 1. Duplicate Mapping IDs
No duplicate IDs found.

### 2. Evidence Source Concerns
- **789 of 789** mappings reference ONLY `quran-json` as their evidence source
- **0** mappings reference a Tafsir source
- **0** mappings reference a dedicated translation source
- `quran-json` provides Quran text AND English translation (Saheeh International), but NOT Tafsir

### 3. Scholarly Review Status
- **ALL 789 records** have `reviewStatus: PENDING_SCHOLARLY_REVIEW`
- No human scholarly review has been documented for any mapping
- Technical validation ≠ scholarly validation

## Deliverables

1. `data/audit/mfd-09-1-canonical-mapping-audit.json` — Full canonical audit dataset
2. `scripts/validate-mfd-09-1-mappings.mjs` — Automated validation script
3. This report and companion documents

## Recommendations

1. Resolve duplicate mapping IDs immediately
2. Attach actual Tafsir sources where thematic interpretations are used
3. Establish scholarly review workflow before marking any mapping as approved
4. Consider reclassifying EDITORIAL_INTERPRETATION and CONTEMPORARY_APPLICATION mappings with stronger evidence requirements
