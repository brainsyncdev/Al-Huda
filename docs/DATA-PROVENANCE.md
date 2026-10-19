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

## Rejected source paths (rights or provenance not verified)

Recorded per FR-032 (track licensing/permitted use per source) and FR-071
(immutable source/version metadata). A path listed here is **not** a candidate
for silent re-introduction: it was evaluated and rejected, and the reason is on
the record.

| Path | Content it would have supplied | Why rejected |
|---|---|---|
| `src/services/quran-api.ts` (removed) | Chapters, verses, multiple translations by hardcoded resource IDs, juz metadata, and `verses.quran.com` audio URLs, all fetched at runtime from `api.quran.com` | **No source record, no license, no version pin, no checksum.** Runtime fetching defeats the immutability requirement (FR-071): the text a visitor reads would depend on a third party's current database state, so a verse could change under the app without any release, review, or rollback. The bundled audio URL builder contradicts the PRD's explicit audio deferral (§5, §23 recommendation 8) and no rights were verified. Two translation resource IDs were passed with no attribution or edition labelling, which would have breached FR-030/FR-033. It also returned `any[]`, bypassing the typed provenance model in §9. |

The removal was verified as safe: no module imported it (a repo-wide search for
the string `quran-api` returned zero hits outside the file itself, and any
`@/services/quran-api` import would have matched).

**Replacement rule.** Any future translation, tafsir excerpt, word-by-word
dataset, or audio asset must arrive as a **versioned, checksummed, vendored
artifact** with a `SourceRecord` entry in `src/lib/quran/sources.ts` before it
is reachable from any page. Runtime fetching of Quran content is not an
accepted ingestion path.

---

## Known limitations (Release 1.1)

- **Side-by-side translations (FR-033):** Not implemented. The vendored `quran-json@3.1.2` package bundles one translation per language, and per-edition Tanzil redistribution terms cannot be verified offline. No second translation dataset or placeholder is bundled.
- **Juz page ranges:** `src/lib/quran/juz.ts` stores approximate page ranges for a standard 604-page Mushaf. These values are estimates only and are not rendered as exact Mushaf page numbers; UI displays Juz numbers only.
- **Content-issue reporting:** No verified feedback destination is configured, so no report link is presented. This is intentionally omitted rather than shown as a misleading affordance.

---

**Last Updated:** 2026-10-19
**Data Maintainer:** TBD (see PRD 20 roles)
**Source Version:** quran-json@3.1.2
