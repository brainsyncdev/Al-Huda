# Al-Huda — Implementation Report

Release candidate for PRD v3.0 (`docs/PRD.md`). Companion documents:

- Status of every requirement: `docs/PRD-CHECKLIST.md`
- Provenance and licence decisions: `docs/DATA-PROVENANCE.md`
- AI safety position: `docs/AI-SAFETY.md`
- Editorial operations: `docs/EDITORIAL.md`

**Document control:** reconciled 2026-10-23 against the repository. This
revision replaces the earlier text that described tafsir, additional
translations, audio, and word-by-word as blocked, described the backup
envelope as v2, and stated that no verification command had been run.

## 0. Latest reported verification results

These are results reported by the most recent audit. They were not re-run
during the documentation reconciliation.

| Check | Reported result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | Clean |
| `npm test` (`vitest run`) | 188 tests in 11 files, all passing |
| `npm run build` (`next build`) | Exit 0, compiled successfully |
| `npm run validate:quran` | 114 surahs, 6,236 ayat, 0 issues |
| `npm run validate:licenses` | 13 source records, 0 issues |

They establish that the tree typechecks, the unit suite passes, a production
build completes, and the two data validators report no structural issues. They
do **not** establish production readiness. No lint run, Lighthouse/Core Web
Vitals measurement, Playwright/Cypress suite, automated accessibility audit,
rendered Open Graph/Twitter inspection, or licensing clearance is recorded.

> A clean `validate:licenses` result means every source record carries the
> fields the validator checks. It is not permission to use the content. Audio,
> the Tanzil translation catalog, and the in-app tafsir texts remain subject to
> legal/licensing review.

## 1. What is implemented

### Quran reading, search, topics (PRD §8.1–8.4)

Surah index and reader pages render every ayah of the pinned dataset
(`quran-json@3.1.2`) verbatim: Uthmani Arabic, Saheeh International
translation, transliteration, with credit lines on each card and in the site
footer. Search covers references, Arabic (normalized), translation,
transliteration, and surah names, with highlighted snippets and a stated match
reason (FR-015).

Direct verse matches are ranked by lexical relevance before anything is
truncated: whole-word occurrences of the query outrank substring echoes, a
translation match outranks a transliteration match, and canonical mushaf order
breaks every tie so the same query always returns the same ordering. The
ranking is rule-based scoring over the same normalized text the keyword search
already used — it is not semantic similarity. A bounded curated topic-term
expansion is appended last and labeled "Curated theme match" (FR-014).
Embedding-based retrieval is a separate, opt-in client-side mode described
below; it is not part of the default ranking.

Eleven curated topics carry typed, provenance-stamped relations (`method`,
`curator`, `reviewedAt`, `status`) and dataset-derived ayat-to-ayah
cross-references. The same provenance shape is available per relation as an
optional override; no relation in this release carries one, so all 56 inherit
their topic-level record, and each verse card states that scope rather than
implying an individual review took place.

### Translations (FR-004, FR-033)

The reader offers 100+ translation editions from the Tanzil catalog
(`src/lib/quran/translations.ts`), defaulting to Urdu Jalandhry
(`ur.jalandhry`) with `en.sahih` as the fallback. The built-in English
translation from `quran-json` renders immediately; a selected edition is fetched
on demand from `/api/translations/[id]`, a Node-runtime route that proxies
`https://tanzil.net/trans/{id}` for catalog IDs only, caches for 24 hours, and
returns `text/plain`. The client parses the Tanzil `surah|ayah|text` format and
keeps it in a module-scoped in-memory cache (`translation-store.ts`).

Parallel mode (`parallelMode`, `parallelTranslationIds`) renders the primary
edition plus up to three additional editions beneath it
(`MAX_PARALLEL_TRANSLATIONS = 3`). Unknown IDs are rejected in
`normalizePrefs`, so a restored backup cannot inject an arbitrary network
target.

This is runtime delivery, not redistribution or ingestion. Per-edition rights
have not been individually verified; see `docs/DATA-PROVENANCE.md`.

### Audio recitation (FR-054 / PRD §5)

`src/components/quran/audio-player.tsx` streams verse-by-verse MP3s from the
Islamic Network CDN using the global ayah ordinal (1..6236), derived from the
generated mushaf metadata so a bad reference yields no URL rather than the
wrong verse's audio. Twelve reciters are offered; the default is Alafasy.
Playback is off by default (`showAudio`). No audio file is stored, bundled, or
redistributed.

**Rights are unresolved.** The CDN publishes no explicit copyright licence for
the recordings. Streaming avoids redistribution; it does not establish
permission. This is a documented deviation from the PRD's recommended default
("audio deferred until source and rights are verified") and remains a release
dependency.

### Tafsir viewer (FR-030–032)

`src/components/quran/tafsir-viewer.tsx` renders two classical Arabic tafsirs
in-app — Tafsir al-Jalalayn (`ar.jalalayn`) and Tafsir al-Muyassar
(`ar.muyassar`) — through the same Tanzil proxy used for translations. The
section is collapsed by default and lazy-loads text only when expanded. Each
block displays work, author, period, language, licence, publisher, and the
source record's notes, and states that these are classical works, not
translations, and that interpretation is left to qualified scholarship.

The tafsir API route
(`/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir`) returns an **availability
record**, not text: `bundled: false`, `displayMode:
"in-app-text-plus-external-links"`, the readable editions with their text
endpoint, and link-method works. Two English tafsirs (Ibn Kathir, Ma'arif)
remain link-out only.

FR-035 (search across tafsir works) is implemented as a merged search across
the two readable editions (`/search?mode=tafsir`, `/api/v1/search/tafsir`).
Hits are literal substring matches after Arabic normalization, labeled with
their edition; the endpoint returns matched excerpts, never summaries.

### Word-by-word analysis (PRD §5 Release 1.1)

Word segmentation, transliteration, and English glosses are generated at build
time from QUL (Quranic Universal Library by TarteelAI, MIT) and vendored as 114
per-surah JSON files under `public/word-data/` with a sha256 manifest
(77,429 words, 3.40 MB total). The panel loads one surah's file on demand and
caches it in memory. Roots are not provided.

Word-by-word has **no FR number** in the PRD; it is a Release 1.1 scope item.

### Mushaf metadata (FR-008)

Juz, page (Madani Mushaf), hizb, quarter, ruku, manzil, and sajda boundaries
are generated at build time from a vendored copy of Tanzil's `quran-data.xml`
(CC-BY). The generator verifies 30 juz, 604 pages, 240 quarters, 556 rukus, 7
manzils, 15 sajda verses, and 6,236 ayat before writing. `mushaf-data.ts`
resolves boundaries by binary search. `juz.ts` is now a backward-compatibility
re-export whose legacy `JUZ_DATA` and `getJuzInfo` are deprecated and empty.

### Semantic search (FR-014)

The search page offers a secondary semantic mode alongside lexical search. The
query is embedded in the browser with Transformers.js and
`Xenova/all-MiniLM-L6-v2` (quantized ONNX, 384 dimensions, Apache-2.0,
English-only), then compared against a vendored float16 index
(`public/embeddings/quran-minilm.bin`, 4.57 MB, 6,236 × 384). Nothing about the
query leaves the device, and the lexical path does not pay the model-load cost.
The index is built from the built-in English translation only, so semantic
recall is English-only.

This is genuinely embedding-based retrieval, distinct from the lexical ranking
above. FR-014 remains **partial** because the mode is opt-in and
English-only, and because "across approved content" in the PRD is broader than
the one indexed translation.

### Revision workflow (FR-050–053)

`/learn/revision` composes four components (range selection, due queue,
active recall, plan overview) over a hydration-gated provider
(`src/lib/revision/context.tsx`) with validated localStorage persistence
(`src/lib/revision/storage.ts`, bounded to 500 recorded events). Three review
ladders, honest statistics with no streaks or comparisons (FR-053), and a
single-ayah "Add to plan" action on every ayah card. Linked from the desktop
header, the mobile bottom nav, and the ayah card itself.

### Backup and personal data (FR-043)

`src/lib/backup.ts` defines one versioned (**v4**) envelope carrying
**library, revision plan, preferences, and paths** together, parsed defensively
(5 MB cap; legacy v1 accepted as library-only; never throws). `BackupControls`
renders export/import/erase on both the Library and Settings pages; import is
validated, replace-not-merge, and confirmed before it runs, and the erase
action is framed so nobody expects a server copy to exist.

### SEO and structured data (§15)

One self-contained module, `src/lib/seo/json-ld.ts`, emits `WebSite` (with a
`SearchAction` whose URL template matches the real `GET /search?q=` route),
`Book` for the Quran, `Chapter` per surah, `WebPage` + `mainEntity` for ayah
and topic pages, `CollectionPage` for the surah index, `DataCatalog` of
`Dataset` for the source registry, and `BreadcrumbList` trails. It is rendered
by `src/components/seo/json-ld.tsx`, which escapes `<` to `\u003c` plus
U+2028/U+2029 so no editorial string can close the script element. Sitemap and
robots are present; canonical `alternates` are set on every indexable route;
private/utility pages (library, settings, revision, editorial, report) are
explicitly noindexed.

§15 permits structured data only "when semantically appropriate and accurate",
so the module is defined partly by refusals: no `datePublished`/`dateModified`
(the vendored package carries no revelation or edition dates), no page numbers
or Juz ranges in markup, and no `review`/`lastReviewed` on topics — every
curated topic ships `pending-scholarly-review`, so the real state travels in
`creativeWorkStatus` instead. Provenance claims are derived from `sources.ts`,
so the markup cannot drift from what `/sources` shows a human reader.

Two known thinnesses, recorded rather than silently expanded:
`surahIndexJsonLd` asserts only `numberOfItems` on its `ItemList` rather than
enumerating 114 links, and `ayahJsonLd` names and locates a verse without
inlining its text. Neither is inaccurate; both under-assert.

The rendered output of the Open Graph and Twitter tags is **unverified**; that
needs a production build and inspection.

### Grounded AI harness (FR-060–066) — feature **off**

| Module | Responsibility |
| --- | --- |
| `src/lib/ai/feature-flag.ts` | `AI_ANSWER_FEATURE_ENABLED = false as const`, model name/version, 7 named gates (only "source registry" met) |
| `src/lib/ai/approved-sources.ts` | Allowlist derived from `method === "package"` — link-out sources cannot become retrieval sources by editing an array |
| `src/lib/ai/grounding.ts` | Request classification; non-authority claims (hadith, tafsir, ruling, consensus) refuse *before* retrieval; high-risk classes always redirect; Arabic/translation claims must match the dataset verbatim; one failed claim voids the whole draft |
| `src/lib/ai/audit.ts` | Records with no user, prompt, or question field by construction; `isGateEvidence()` excludes abstentions and flag rejections from certifying coverage gates; exported `AUDIT_RETENTION` states the policy in one reviewable place (process memory only, 200-record bound, never persisted, cleared on process exit) |
| `src/lib/ai/evaluation-set.ts` | 22 cases with ground truth derived from the dataset at run time (never hand-typed Arabic) |
| `src/lib/ai/evaluation-set.test.ts` | Vitest artifact covering gate conditions, flag-off rejection, audit privacy |

Every call is rejected with `rejected-flag-off` while the flag is off. No
`/api/ai/ask` route exists. The intended way to turn answers on is flipping
gates in `feature-flag.ts` — each `met: false` gate names its evidence — not
a single boolean.

One nuance to keep visible: because the allowlist derives from
`method === "package"`, it currently admits word-data and mushaf-metadata
records alongside prose sources. Those are legitimate bundled datasets but they
are not answer sources. Enabling AI would require narrowing the allowlist
before any gate could honestly be marked met.

### Editorial tooling (FR-070, 072–075, §20)

- `/editorial` (noindex, read-only): dataset validation scan, per-topic
  publication state with unresolved-reference flags, rights register with
  allowlist state, the AI gate table, and the typed review log.
- `content/editorial/reviews.json` is the review log for topics, sources, and
  features, generated by `scripts/build-editorial-log.mjs` and imported through
  `src/lib/editorial/reviews.ts`. It records current status, curator, method,
  review date, and notes. It is a **state** record, not a per-event history.
- Decap CMS is scaffolded at `public/admin/` (`index.html` + `config.yml`),
  pinned to the local backend and editing only the review JSON. The
  `git-gateway` backend is an inert placeholder until a hosted identity
  provider exists.
- `/report`: correction intake (category, reference, validation),
  copy-to-clipboard **and download**, plus an optional mailto delivery when
  `NEXT_PUBLIC_REPORT_EMAIL` is set at build time
  (`src/lib/report-destination.ts`). Linked from the site footer and the
  accessibility statement's feedback section. **No destination is configured by
  default.**
- `docs/EDITORIAL.md`: roles, the seven-step workflow, correction handling,
  rollback procedures, and the deliberate scope gaps.
- `scripts/validate-quran-data.mjs` (schema, duplicates, ordering, counts) and
  `scripts/validate-source-licenses.mjs` (rights register fields), both
  reported clean in the latest audit.

### Topic relationship graph (FR-025)

`src/components/topics/topic-graph.tsx` renders an SVG layout of curated
topics with `<a>`-wrapped nodes (keyboard-focusable, `aria-label`ed) and
edges derived from `topic.related`. The `/topics` index keeps the existing
list view below the graph, which remains the accessible alternative required
by FR-024.

### Shell, metadata, and access

`src/app/layout.tsx` places a skip-to-content link as the first focusable
element in the tab order (visually hidden until focused, targeting the
`#main-content` landmark on `<main>`), and supplies root-level `openGraph` and
`twitter` metadata alongside `metadataBase`, so every route inherits a social
preview while content pages override title and description per route.

`src/app/robots.ts` disallows `/library`, `/settings`, `/learn`, `/editorial`,
and `/report`, matching the per-route `noindex` metadata on the same pages
rather than relying on one mechanism alone.

## 2. Architecture decisions that constrain future work

1. **No accounts, no analytics** — from AI_RULES. Sync, cross-device library,
   and authenticated admin surfaces are excluded by design, not by omission;
   the checklist marks them blocked with reasons. The Decap scaffolding is a
   local file editor over a versioned JSON file, not an authenticated admin
   surface, and it adds no server-side user data.
2. **Dataset verbatim** — Quran Arabic and the built-in translation never enter
   this repo as typed literal content; even evaluation fixtures pull text from
   the installed package at run time. Additional editions and tafsir are
   delivered at runtime through a proxy rather than vendored.
3. **AI is gated in code** — refusal and abstention paths are implemented and
   reviewable while the feature is off, so the safety behavior is what ships.
4. **Local-first libraries** — everything user-authored lives in localStorage;
   the backup envelope is the only persistence story.
5. **Runtime delivery is a documented deviation** — the earlier provenance rule
   forbade runtime fetching of Quran content. Translations and tafsir now use a
   constrained runtime proxy. This is recorded as a deviation with unresolved
   rights, not presented as compliance with the original rule.

## 3. Known gaps (honest list)

| Gap | Impact | Needs |
| --- | --- | --- |
| Audio recording rights | Streaming works; permission is not established | Legal/licensing review of the CDN recording set |
| Translation catalog rights | 100+ editions are proxied; per-edition terms are unverified | Legal review of Tanzil terms and each edition used |
| In-app tafsir rights | Two Arabic tafsirs are proxied | Legal review; the source records remain `pending-scholarly-review` |
| FR-066 destination | Delivery actions exist (mailto, download, clipboard) with honest fallback copy; no address baked in | Set `NEXT_PUBLIC_REPORT_EMAIL` at deployment if email delivery is required |
| No qualified reviewer assigned | Every topic stays `pending-scholarly-review`; AI gate `editorial-reviewer` unmet | Assign a reviewer |
| AI gates never demonstrated live | `evaluation-dataset`, `citation-coverage`, `abstention-rate`, `hallucination-zero` cannot be marked met from unit tests alone | Run the evaluation suite against a live model in the verification phase |
| FR-012 edition search | Implemented as a search-within-edition mode (`/search?edition=<id>`, `/api/v1/search?edition=<id>`); default lexical search still indexes Arabic + built-in English only | Per-edition redistribution rights remain unverified (FR-033) |
| FR-035 tafsir search | Implemented as merged search across al-Jalalayn and al-Muyassar (`/search?mode=tafsir`, `/api/v1/search/tafsir`); hits are literal substring matches labeled with their edition | No additional licensed tafsir corpus bundled; the two readable editions are the same ones proxied for the viewer |
| No byte-level checksum baseline | FR-071's immutability claim rests on the version string plus the structural scan; a tampered file with correct counts and non-empty text passes both | A checksum baseline generated by executing the recorder |
| Open Graph / Twitter tags not verified per route | Root metadata exists, but emitted markup is unconfirmed | Inspect rendered output after a production build |
| Rate limiting is per-process | Not sufficient alone in production | Edge/CDN rate limit (documented in `src/lib/api/v1.ts`) |
| No per-event editorial history (FR-073) | Current state, curator, and review date are tracked; who-changed-what is not | A store this build deliberately lacks; git history is the only real audit trail |
| Accessibility and Core Web Vitals unmeasured | No axe/Lighthouse/field data recorded | Run audits before release |
| Translation proxy vs. ingestion rule | Runtime proxying contradicts the original "no runtime fetching" rule | Documented deviation; resolve rights and amend the rule or vendor licensed artifacts |

## 4. Verification status (reported, not re-run)

The latest audit reported: typecheck clean; 188 tests in 11 files passing;
`next build` exit 0; `validate:quran` 114/6,236/0; `validate:licenses` 13/0.

Still outstanding before any release claim:

```bash
npm run lint                      # no result recorded
npm run build && npm start        # build reported green; runtime smoke not recorded
```

Manual smoke still to be performed and recorded: search a reference and a term;
open `/topics/patience`; add an ayah to the plan from a card; complete a review
in `/learn/revision`; export then import the backup from Settings; confirm
`/editorial` shows clean validation; confirm every AI route/API 404s and
`respond()` stays `rejected-flag-off`; open a surah and switch translation,
enable parallel mode, and play audio; expand the tafsir viewer and the
word-by-word panel.

**Do not call Al-Huda production-ready** until the unresolved licensing reviews
are closed, a qualified reviewer is assigned, accessibility and Core Web Vitals
are measured, rendered SEO output is inspected, and the release gate in the PRD
is reviewed against `docs/PRD-CHECKLIST.md`.