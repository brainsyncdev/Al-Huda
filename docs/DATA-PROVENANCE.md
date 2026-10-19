# Data Provenance and Source Documentation

## Overview

This document records the sources, licenses, and provenance of all Quranic content used in the Al-Huda application.

## Quran Text, Translations, and Structure

### Primary Dataset: quran-json v3.1.2

We use the [`quran-json`](https://github.com/risan/quran-json) package (v3.1.2) as our canonical data source.

**License:** CC-BY-4.0  
**Homepage:** https://github.com/risan/quran-json  
**Author:** Risan Bagja Pradana (risanbagja@gmail.com)

### Source Attribution (from README)

| Content | Source | Author/Translator |
|---|---|---|
| Uthmani Quran Text | [The Noble Qur'an Encyclopedia](https://quranenc.com/en/home) | — |
| English Transliteration | [Tanzil.net](https://tanzil.net/trans/en.transliteration) | — |
| Arabic Chapters Metadata | [The Noble Qur'an Encyclopedia](https://quranenc.com/en/home) | — |
| English Translation | [Tanzil.net](https://tanzil.net/trans/en.sahih) | Umm Muhammad (Saheeh International) |
| Urdu Translation (where available in package) | [Tanzil.net](https://tanzil.net/trans/ur.maududi) | Abul A'la Maududi |

### Compliance Notes

- The quran-json package is released under CC-BY-4.0 (Creative Commons Attribution 4.0 International). Attribution must be maintained in documentation and where appropriate in the UI.
- We treat the canonical numbering convention, Surah/ayah ordering, and Uthmani text as provided by the dataset. Any future corrections require validation against an independent reference before publication.
- We do **not** redistribute tafsir, hadith, or audio assets from this package. Tafsir/audio will only be integrated if separately licensed/approved.
- All content is ingested as immutable - changes to the underlying source require versioning and explicit review.

### Data Integrity

- **Canonical reference format:** `surah:ayah` (e.g., `2:255` for Al-Baqarah 255). We normalize to 1-based Surah and ayah numbers per the dataset.
- **Validation requirements (per PRD 9):** Confirm 114 Surahs and 6,236 ayat (or dataset-actual count), detect duplicates/missing/reordered records, validate Unicode normalization without altering text, compare sampled passages against trusted reference, store source URL/version/checksum/import date, regression tests against known references, rollback procedure for corrections.

## Planned Content Additions

| Content Type | Status | Notes |
|---|---|---|
| Additional translations (Urdu, others) | MVP+ | Only after verifying license compatibility and attribution |
| Tafsir excerpts | Release 1.1+ | Must track work/author/edition/language/licensing/permitted use per FR-030–FR-032 |
| Word-by-word | Release 1.1+ | Only from verified licensed dataset (FR-009) |
| Audio recitation | Release 1.1+ (if licensed) | Provider/rights/integrity metadata required; must be optional |
| Topics/cross-refs | Phase 2+ | Must record provenance, reviewer, status, relation type (typed relations, not generic) |

## Editorial/AI Safety Notes

- Quran text, translation, tafsir source are clearly labeled; editorial topic connections and AI-assisted summaries must be distinct from Quran text (PRD 10).
- No AI-generated Quranic Arabic, no invented ayah/hadith/tafsir citations, no definitive rulings without qualified sourced review workflow.
- Retrieval-grounded only; citations at claim level; abstain when insufficient evidence.

---

## Known limitations (Release 1.1)

- **Side-by-side translations (FR-033):** Not implemented. The vendored `quran-json@3.1.2` package bundles one translation per language, and per-edition Tanzil redistribution terms cannot be verified offline. No second translation dataset or placeholder is bundled.
- **Juz page ranges:** `src/lib/quran/juz.ts` stores approximate page ranges for a standard 604-page Mushaf. These values are estimates only and are not rendered as exact Mushaf page numbers; UI displays Juz numbers only.
- **Content-issue reporting:** No verified feedback destination is configured, so no report link is presented. This is intentionally omitted rather than shown as a misleading affordance.

---

**Last Updated:** 2026-10-19
**Data Maintainer:** TBD (see PRD 20 roles)
**Source Version:** quran-json@3.1.2
