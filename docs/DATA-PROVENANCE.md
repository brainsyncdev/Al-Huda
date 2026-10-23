# Data Provenance and Source Documentation

## Overview

This document records the sources, licences, and provenance of all Quranic
content used in the Al-Huda application, and — just as importantly — which
rights questions remain unresolved.

**Document control:** reconciled 2026-10-23 against the repository. This
revision removes the internally contradictory claim that no Quran content is
fetched at runtime (the app now proxies translations and tafsir), records that
delivery arrangement as a deviation with unresolved rights, and separates
"implemented" from "cleared for use".

Two distinctions run through this document:

- **Delivered** — the mechanism exists and the content is reachable.
- **Cleared** — a human has reviewed the terms and permission to use the
  content in this way is established.

Nothing in this repository establishes the second. A clean
`validate:licenses` run means every source record carries the fields the
validator checks; it says nothing about permission.

## Quran Text, Translations, and Structure

### Primary Dataset: quran-json v3.1.2

We use the [`quran-json`](https://github.com/risan/quran-json) package
(v3.1.2) as our canonical dataset for the built-in Arabic text, English
translation, transliteration, and chapter metadata.

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

- The quran-json package is released under CC-BY-4.0. Attribution is
  maintained in documentation, in the footer, and on each verse card.
- The canonical numbering convention, Surah/ayah ordering, and Uthmani text
  are taken as provided by the dataset. Any future correction requires
  validation against an independent reference before publication.
- We do **not** redistribute the recording files for audio; see the audio
  section below.
- The built-in dataset content is immutable from the app's point of view:
  changes require re-pinning the package and re-running validation.

### Data Integrity

- **Canonical reference format:** `surah:ayah` (e.g. `2:255`). We normalize to
  1-based Surah and ayah numbers per the dataset.
- **Validation (per PRD §9):** `scripts/validate-quran-data.mjs` confirms 114
  Surahs and 6,236 ayat, detects duplicates, missing/reordered/malformed
  records, and exits non-zero on any issue. The most recent audit reported
  114 surahs, 6,236 ayat, 0 issues.
- Structural validation is not the same as human confirmation. No recorded
  sample comparison against a printed Mushaf exists.

## Translation catalog (FR-004, FR-033)

### What is delivered

- `src/lib/quran/translations.ts` catalogues 100+ Tanzil editions across
  roughly 40 languages. Default: `ur.jalandhry` (Urdu, Jalandhry). Fallback:
  `en.sahih`.
- The built-in English text from `quran-json` renders immediately. A selected
  edition is fetched on demand through `/api/translations/[id]`, a Node-runtime
  route that proxies `https://tanzil.net/trans/{id}` for catalog IDs only,
  revalidates for 24 hours, and returns `text/plain`.
- `translation-store.ts` parses the Tanzil `surah|ayah|text` format and caches
  each edition in memory for the browser session.
- Parallel mode renders the primary edition plus up to three additional
  editions (`MAX_PARALLEL_TRANSLATIONS = 3`).

### What this is not

- **It is not redistribution.** The app does not bundle the translation files.
  It proxies them at request time.
- **It is not a verified licence review.** Tanzil publishes usage terms on its
  own site; those terms have not been reviewed against this usage, and
  individual editions were not checked one by one.
- **It is not covered by the quran-json CC-BY licence.** Only the content
  bundled in that package is. Everything fetched from `tanzil.net` falls under
  Tanzil's terms.

### Outstanding action

Legal/licensing review of the Tanzil catalog as used through this proxy,
including whether proxying (rather than linking out or vendoring) is permitted
under Tanzil's terms. Until that review is recorded, the translation catalog is
a **release dependency**, not a cleared asset.

## Runtime delivery: a documented deviation

The original provenance rule in this document read:

> Any future translation, tafsir excerpt, word-by-word dataset, or audio asset
> must arrive as a versioned, checksummed, vendored artifact with a
> `SourceRecord` entry before it is reachable from any page. Runtime fetching of
> Quran content is not an accepted ingestion path.

That rule is preserved above because it is still the intended direction for
ingestion, and it is still what the rejected `src/services/quran-api.ts` path
violated. It is **not** an accurate description of the current translation and
tafsir implementation, which delivers content at runtime through a constrained
proxy.

The proxy is narrower than the rejected path: it is a first-party route, it
accepts only IDs present in the catalog, it pins the upstream host to
`tanzil.net`, it does not accept arbitrary URLs, and it caches. That makes it
auditable, but it does not make it an ingested, checksummed artifact, and it
does not resolve rights.

**Recorded as:** a deliberate deviation, taken to ship FR-004/FR-033/FR-030–032
without vendoring ~100 translation files. It is listed as a known gap in
`docs/IMPLEMENTATION-REPORT.md` and as a release dependency in
`docs/PRD-CHECKLIST.md`. The correct resolution is either (a) obtain rights and
vendor the editions used, or (b) amend the rule with a reviewed, documented
policy for proxying — not to quietly delete the rule.

## Rejected source paths (rights or provenance not verified)

Recorded per FR-032 and FR-071. A path listed here is **not** a candidate for
silent re-introduction: it was evaluated and rejected, and the reason is on the
record.

| Path | Content it would have supplied | Why rejected |
|---|---|---|
| `src/services/quran-api.ts` (removed) | Chapters, verses, multiple translations by hardcoded resource IDs, juz metadata, and `verses.quran.com` audio URLs, all fetched at runtime from `api.quran.com` | **No source record, no license, no version pin, no checksum.** Runtime fetching defeats the immutability requirement (FR-071): the text a visitor reads would depend on a third party's current database state, so a verse could change under the app without any release, review, or rollback. The bundled audio URL builder contradicts the PRD's explicit audio deferral (§5, §23 recommendation 8) and no rights were verified. Two translation resource IDs were passed with no attribution or edition labelling, which would have breached FR-030/FR-033. It also returned `any[]`, bypassing the typed provenance model in §9. |

The removal was verified as safe: no module imported it.

The current translation/tafsir proxy is a different arrangement: it is
first-party, catalog-constrained, attributed in the UI, and recorded in
`sources.ts`. It is still runtime delivery and is treated as such above.

## Audio recitation (FR-054)

Audio is streamed at runtime from the Islamic Network CDN, which serves the
everyayah.com recording set over a public, key-free endpoint:

```
https://cdn.islamic.network/quran/audio/{bitrate}/{edition}/{globalAyah}.mp3
```

- **No files are stored or redistributed.** The player requests one MP3 only
  after the visitor presses play.
- **Rights are unresolved.** The CDN publishes no explicit copyright licence
  for the recordings. Streaming instead of bundling reduces the exposure; it
  does not establish permission. This is why audio is marked PARTIAL in the
  checklist even though the player works.
- **12 reciters** are offered (Alafasy, Husary, Minshawi, Sudais, Shuraim,
  Abdul Basit, Hudhaify, Maher Al Muaiqly, Muhammad Ayyoub, Muhammad Jibreel,
  Abdullah Basfar, Ayman Sowaid). Default: Mishary Rashid Alafasy.
- **Bitrate:** 64 kbps (192/128/48/40/32 also available).
- **Global ayah ordinal** (1..6236) is computed from the generated mushaf
  metadata, so a bad reference returns `null` rather than a wrong verse's
  audio.
- **Off by default.** The `showAudio` preference must be enabled in Settings.
- **Source record:** `islamic-network-audio` in `src/lib/quran/sources.ts`.

The PRD's recommended default was to defer audio until source and rights are
verified. Shipping the player is a documented deviation from that default.

**Outstanding action:** legal/licensing review of the recording set, or
replacement with recordings whose terms permit this use.

## Tafsir (FR-030–032, FR-035)

Two classical Arabic tafsirs are readable in-app — Tafsir al-Jalalayn
(`ar.jalalayn`) and Tafsir al-Muyassar (`ar.muyassar`) — through the same
Tanzil proxy as translations. The viewer is collapsed by default and lazy-loads
text on expansion. Each block displays work, author, period, language, licence,
publisher, and the source record's notes.

`/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir` returns an **availability
record**, not text: `bundled: false`, `displayMode:
"in-app-text-plus-external-links"`, the readable editions and their text
endpoint, and the link-method works. Two English tafsirs (Ibn Kathir,
Ma'arif) remain link-out only.

- **FR-035 tafsir search:** implemented as a merged search across the two
  readable editions (`/search?mode=tafsir`, `/api/v1/search/tafsir`). Hits
  are literal substring matches after Arabic normalization, labeled with
  their edition; matched excerpts are returned, never summaries.
- **Outstanding action:** legal/licensing review of both in-app tafsir texts.
  The source records remain `pending-scholarly-review`.

## Mushaf metadata (FR-008)

Juz, page (Madani Mushaf), hizb, quarter, ruku, manzil, and sajda boundaries
are generated at build time from a vendored copy of Tanzil's `quran-data.xml`
(CC-BY, declared in the file header). The generator
(`scripts/generate-mushaf-data.js`) emits compact boundary tables (32 KB) and
verifies 30 juz, 604 pages, 240 quarters, 556 rukus, 7 manzils, 15 sajda
verses, and 6,236 ayat before writing — a dataset change fails the build rather
than shipping silently.

- **Source record:** `tanzil-mushaf-metadata` in `src/lib/quran/sources.ts`.
- **Module:** `src/lib/quran/mushaf-data.ts` (auto-generated).
- **Tests:** `src/lib/quran/mushaf-data.test.ts` (15 tests).
- **Not verified against a printed Mushaf.** The boundaries are Tanzil's
  dataset, verified for internal consistency, not compared page-by-page with a
  physical copy.

## Semantic search (FR-014)

The search page offers a secondary semantic-search mode alongside lexical
search. The query is embedded in the browser with the same MiniLM model the
build-time generator used, and the top ayat are returned ranked by cosine
similarity. Nothing about the query leaves the device.

- **Model:** `Xenova/all-MiniLM-L6-v2` (quantized ONNX, 21.9 MB, 384
  dimensions, Apache-2.0, sentence-transformers family). English-only, which
  matches the index (the built-in English translation).
- **Index:** `public/embeddings/quran-minilm.bin` (4.57 MB, float16,
  6,236 × 384) + `quran-minilm.json` (metadata + verse index). Generated by
  `scripts/generate-embeddings.mjs` from `quran-json/dist/quran_en.json`.
- **Runtime:** the browser loads Transformers.js from jsdelivr on first use,
  downloads the quantized model once (cached by the browser), and compares the
  query vector against the vendored index. The lexical path does not pay the
  model-load cost.
- **Source record:** `semantic-embeddings` in `src/lib/quran/sources.ts`.

This is embedding-based retrieval, not the lexical ranking used by the default
search. It is opt-in and English-only; FR-014 remains PARTIAL.

## Word-by-word analysis (PRD §5 Release 1.1)

Word segmentation, transliteration, and English glosses are generated at build
time from the Quran.com API v4 (which serves the Quranic Universal Library
word data) and vendored as per-surah JSON under `public/word-data/`.

- **Source:** QUL by TarteelAI (MIT-licensed).
- **Generator:** `scripts/generate-word-data.js` writes 114 per-surah files
  (3.40 MB total, largest 273 KB for al-Baqarah) plus a sha256 manifest.
- **Runtime:** the word-by-word panel loads a surah's file on demand (never on
  every page) and caches it in memory.
- **Source record:** `qul-word-data` in `src/lib/quran/sources.ts`.
- **Roots are not provided.**
- The PRD has **no FR number** for word-by-word; it is a §5 Release 1.1 item.

## Editorial review log

`content/editorial/reviews.json` records review state for topics, sources, and
features (`status`, `curator`, `method`, `reviewedAt`, `notes`). It is generated
by `scripts/build-editorial-log.mjs` and imported at build time through
`src/lib/editorial/reviews.ts`.

Source entries currently record:

- Audio: `pending-scholarly-review` — no explicit recording licence.
- Translations and tafsir: `pending-scholarly-review` — terms not reviewed.
- Tanzil metadata, QUL word data, semantic embeddings: `editorial-approved`
  (technical/licence fields only; this is not a religious-content review).

The log is a **state** record, not a per-event history. See
`docs/EDITORIAL.md`.

## Source registry

`src/lib/quran/sources.ts` holds 13 source records, each with licence, licence
URL, version, homepage, and `method`:

- `method: "package"` — redistributed in this repository (quran-json,
  quranenc, tanzil-sahih, tanzil-translit, tanzil-mushaf-metadata,
  semantic-embeddings, qul-word-data).
- `method: "link"` — not bundled (tanzil-translations, islamic-network-audio,
  tafsir-jalalayn, tafsir-muyassar, tafsir-ibn-kathir, tafsir-maarif).

`scripts/validate-source-licenses.mjs` checks that each record carries the
required fields and that link-method records do not claim redistribution. The
latest audit reported 13 records and 0 issues. That is a field-completeness
check, not a rights determination.

## Content-issue reporting

`/report` collects a category, an optional ayah reference, and a description,
validates the reference against the canonical dataset, and prepares the report
on the visitor's device through clipboard copy and file download. Email
delivery opens the visitor's own mail client only when the deployment sets
`NEXT_PUBLIC_REPORT_EMAIL` (`src/lib/report-destination.ts`); with no address
configured the page states that plainly rather than implying a delivery that
did not happen. Nothing is transmitted or stored server-side.

## Known limitations

- **Side-by-side translations (FR-033):** implemented via the runtime proxy
  described above; per-edition rights unverified.
- **Juz page ranges:** computed from generated mushaf metadata; the old
  approximate `juz.ts` ranges are deprecated and empty.
- **FR-012 translation-edition search:** implemented as a search-within-edition
  mode (`/search?edition=<id>`) rather than a filter on the default lexical
  results. The default search still indexes Arabic and the built-in English
  only; selecting an edition runs a separate substring search against that
  edition's text fetched from Tanzil.net. Per-edition redistribution rights
  remain unverified (see FR-033).
- **FR-035 tafsir search:** implemented as a merged search across the two
  classical Arabic tafsirs readable in-app (`/search?mode=tafsir`,
  `/api/v1/search/tafsir`). Hits are literal substring matches labeled with
  their edition, not thematic or interpretive claims. The underlying texts
  are the same proxied editions (al-Jalalayn, al-Muyassar); no additional
  tafsir corpus is bundled.
- **No byte-level checksum baseline** for the vendored package; FR-071 rests on
  the version pin plus the structural scan.

---

**Last Updated:** 2026-10-23 (documentation reconciliation)
**Data Maintainer:** TBD (see PRD §20 roles)
**Source Version:** quran-json@3.1.2