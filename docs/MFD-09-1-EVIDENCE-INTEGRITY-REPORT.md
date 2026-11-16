# MFD-09.1 Evidence Integrity Report

**Generated:** 2026-11-16T04:44:31.223Z

## Executive Summary

This audit examines what evidence ACTUALLY exists for each mapping in the repository.

## Critical Finding

**ALL 789 mappings reference ONLY `quran-json` as their evidence source.**

`quran-json` (v3.1.2) provides:
- ✓ Quran Arabic text (Uthmani)
- ✓ English translation (Saheeh International via Tanzil)
- ✓ Latin transliteration
- ✓ Surah metadata
- ✗ **NO Tafsir content**
- ✗ **NO scholarly commentary**
- ✗ **NO classical interpretation**

## Evidence Type Distribution

| Evidence Type | Count | Percentage |
|--------------|-------|------------|
| QURAN_TEXT_ONLY | 0 | 0% |
| TRANSLATION_SUPPORTED | 789 | 100.0% |
| TAFSIR_ATTACHED | 0 | 0.0% |
| TAFSIR_VERIFIED | 0 | 0% |
| SCHOLAR_REVIEWED | 0 | 0% |

## Tafsir Evidence Status

| Status | Count |
|--------|-------|
| NOT_ATTACHED | 789 |
| SOURCE_ATTACHED_UNVERIFIED | 0 |
| SOURCE_VERIFIED | 0 |
| AYAH_LEVEL_REFERENCE_VERIFIED | 0 |
| SCHOLAR_REVIEWED | 0 |

## Available Tafsir Sources (from sources.ts)

The following Tafsir sources ARE available in the repository but are NOT attached to any mapping:

| Source ID | Type | Language | Method |
|-----------|------|----------|--------|
| tafsir-jalalayn | Classical Tafsir | Arabic | link (Tanzil) |
| tafsir-muyassar | Contemporary Tafsir | Arabic | link (Tanzil) |
| tafsir-ibn-kathir | Classical Tafsir (abridged) | English | link (external) |
| tafsir-ma(arif) | Contemporary Tafsir | English | link (external, unavailable) |

## Translation Evidence

| Status | Count |
|--------|-------|
| ATTACHED | 789 |
| NOT_ATTACHED | 0 |

Note: `quran-json` bundles Saheeh International translation, so all mappings technically have translation support.

## Scholarly Review Status

- **ALL 789 records**: `PENDING_SCHOLARLY_REVIEW`
- **0 records**: Have documented human scholarly review
- **0 records**: Have verified Tafsir citations at ayah level

## Recommendations

1. **Immediate**: Do not present any mapping as "scholarly verified" or "tafsir-backed"
2. **Short-term**: Attach actual Tafsir sources (tafsir-jalalayn, tafsir-muyassar) to DIRECT_REFERENCE mappings where applicable
3. **Medium-term**: Establish scholarly review workflow with qualified reviewers
4. **Long-term**: Build ayah-level Tafsir citation infrastructure

## Integrity Assurance

This audit confirms:
- ✓ No fabricated Tafsir references
- ✓ No false scholarly approval states
- ✓ All provenance accurately reflects "pending-scholarly-review"
- ✓ Evidence types accurately reflect what exists in the repository
