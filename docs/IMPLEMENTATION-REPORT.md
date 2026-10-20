# Al-Huda — Implementation Report

Release candidate for PRD v3.0 (`docs/PRD.md`). Companion documents:

- Status of every requirement: `docs/PRD-CHECKLIST.md`
- Provenance and licence decisions: `docs/DATA-PROVENANCE.md`
- AI safety position: `docs/AI-SAFETY.md`
- Editorial operations: `docs/EDITORIAL.md`

## 1. What is implemented

### Quran reading, search, topics (PRD §8.1–8.4)

Surah index and reader pages render every ayah of the pinned dataset
(`quran-json@3.1.2`) verbatim: Uthmani Arabic, Saheeh International
translation, transliteration, with credit lines on each card and in the site
footer. Search covers references, Arabic (normalized), translation,
transliteration, and surah names, with highlighted snippets and a stated match
reason (FR-015). Eleven curated topics carry typed, provenance-stamped
relations (`method`, `curator`, `reviewedAt`, `status`) and dataset-derived
ayat-to-ayah cross-references. Tafsir and second translations remain
link-out/blocked on rights — see the checklist.

### Revision workflow (FR-050–053)

`/learn/revision` composes four components (range selection, due queue,
active recall, plan overview) over a hydration-gated provider
(`src/lib/revision/context.tsx`) with validated localStorage persistence
(`src/lib/revision/storage.ts`, bounded to 500 recorded events). Three review
ladders, honest statistics with no streaks or comparisons (FR-053), and a
single-ayah "Add to plan" action on every ayah card. Linked from the desktop
header, the mobile bottom nav, and the ayah card itself.

### Backup and personal data (FR-043)

`src/lib/backup.ts` defines one versioned (v2) envelope carrying **library,
revision plan, and preferences together**, parsed defensively (5 MB cap,
legacy v1 accepted as library-only, never throws). `BackupControls` renders
export/import/erase on both the Library and Settings pages; import is
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
or Juz ranges (`DATA-PROVENANCE.md` records the Juz mapping as an
approximation), and no `review`/`lastReviewed` on topics — every curated topic
ships `pending-scholarly-review`, so the real state travels in
`creativeWorkStatus` instead. Provenance claims are derived from `sources.ts`,
so the markup cannot drift from what `/sources` shows a human reader.

Two known thinnesses, recorded rather than silently expanded:
`surahIndexJsonLd` asserts only `numberOfItems` on its `ItemList` rather than
enumerating 114 links, and `ayahJsonLd` names and locates a verse without
inlining its text. Neither is inaccurate; both under-assert.

This path previously held a thin facade re-exporting part of a sibling
`./jsonld` builder module, which let a page import a name the facade never
re-exported and fail only at build time. Both are now one module whose export
list is exactly what its consumers name.

### Grounded AI harness (FR-060–066) — feature **off**

| Module | Responsibility |
| --- | --- |
| `src/lib/ai/feature-flag.ts` | `AI_ANSWER_FEATURE_ENABLED = false`, model name/version, 7 named gates (only "source registry" currently met) |
| `src/lib/ai/approved-sources.ts` | Allowlist derived from `method === "package"` — link-out sources cannot become retrieval sources by editing an array |
| `src/lib/ai/grounding.ts` | Request classification; non-authority claims (hadith, tafsir, ruling, consensus) refuse *before* retrieval; high-risk classes always redirect; Arabic/translation claims must match the dataset verbatim; one failed claim voids the whole draft |
| `src/lib/ai/audit.ts` | Records with no user, prompt, or question field by construction; `isGateEvidence()` excludes abstentions and flag rejections from certifying coverage gates; bounded process-local ring |
| `src/lib/ai/evaluation-set.ts` | 22 cases with ground truth derived from the dataset at run time (never hand-typed Arabic) |
| `src/lib/ai/evaluation-set.test.ts` | Vitest artifact covering gate conditions, flag-off rejection, audit privacy |

Every call is rejected with `rejected-flag-off` while the flag is off. No
`/api/ai/ask` route exists. The intended way to turn answers on is flipping
gates in `feature-flag.ts` — each `met: false` gate names its evidence — not
a single boolean.

### Editorial tooling (FR-070, 072–075, §20)

- `/editorial` (noindex, read-only): dataset validation scan, per-topic
  publication state with unresolved-reference flags, rights register with
  allowlist state, and the AI gate table.
- `/report`: correction intake (category, reference, validation),
  copy-to-clipboard **and download**, plus an optional mailto delivery when
  `NEXT_PUBLIC_REPORT_EMAIL` is set at build time
  (`src/lib/report-destination.ts`). Linked from the site footer and the
  accessibility statement's feedback section.
- `docs/EDITORIAL.md`: roles, the seven-step workflow, correction handling,
  rollback procedures, and the deliberate scope gaps.
- `scripts/validate-quran-data.mjs` (schema, duplicates, ordering, counts) and
  `scripts/validate-source-licenses.mjs` (rights register fields).

### Topic relationship graph (FR-025)

`src/components/topics/topic-graph.tsx` renders an SVG layout of curated
topics with `<a>`-wrapped nodes (keyboard-focusable, `aria-label`ed) and
edges derived from `topic.related`. The `/topics` index keeps the existing
list view below the graph, which remains the accessible alternative required
by FR-024.

## 2. Architecture decisions that constrain future work

1. **No accounts, no analytics, no admin write paths** — from AI_RULES. Sync,
   cross-device library, and CMS-style editorial workflows are excluded by
   design, not by omission; the checklist marks them blocked with reasons.
2. **Dataset verbatim** — Quran Arabic/translation never enters this repo as
   typed literal content; even evaluation fixtures pull text from the
   installed package at run time.
3. **AI is gated in code** — refusal and abstention paths are implemented and
   reviewable while the feature is off, so the safety behavior is what ships.
4. **Local-first libraries** — everything user-authored lives in localStorage;
   the backup envelope is the only persistence story.

## 3. Known gaps (honest list)

| Gap | Impact | Needs |
| --- | --- | --- |
| FR-066 destination (mechanics) | Delivery actions implemented (mailto via `NEXT_PUBLIC_REPORT_EMAIL`, file download, clipboard) with honest fallback copy; no address baked in | Set `NEXT_PUBLIC_REPORT_EMAIL` at deployment if email delivery is required |
| No qualified reviewer assigned | Every topic stays `pending-scholarly-review`; AI gate `editorial-reviewer` unmet | Assign a reviewer |
| AI evaluation set never executed | Gates `evaluation-dataset`, `citation-coverage`, `abstention-rate`, `hallucination-zero` cannot be marked met | Run the suite in the verification phase. It previously could not resolve at all: `grounding.ts`, `audit.ts`, `approved-sources.ts` and `evaluation-set.ts` imported via `@/lib/...` while `vitest.config.ts` deliberately configures no alias and Vite does not read tsconfig `paths`. All four now use relative imports, matching `evaluation-set.test.ts` and the existing `src/lib/quran/` suites, with a comment at the top of `grounding.ts` explaining why they must not be "tidied" back |
| Two validation scripts never run | FR-070/075 not demonstrated end-to-end | Run `npm run validate:quran` and `npm run validate:licenses` |
| `quran-json` pin status | `package.json` now pins `quran-json: 3.1.2` exactly | Verify lockfile consistency in testing phase |
| No byte-level checksum baseline | FR-071's immutability claim rests on the version string plus `validate-quran-data.mjs`'s structural scan; a tampered file with correct counts and non-empty text passes both | Deliberately not shipped: a checksum recorder can only be populated by executing it, and verification is deferred, so a committed script would sit permanently at "no baseline" — a false gate dressed as a real one |
| Open Graph / Twitter tags not verified per route | Social previews unconfirmed | Inspect rendered output after a production build |
| Rate limiting is per-process | Not sufficient alone in production | Edge/CDN rate limit (documented in `src/lib/api/v1.ts`) |
| `juz.ts` metadata unverified against a printed Mushaf | Juz shown is canonical Hafs scheme but unverified | Verify against the chosen Mushaf edition |
| Audio / second translation / word-by-word | Blocked on rights and datasets | Licence verification |

## 4. Verification plan (deferred — run before any release claim)

No shell tool was available while implementing, so **nothing below has been
run**. In order:

```bash
npm run typecheck                 # tsc --noEmit: structural gate
npm run test                      # vitest: scheduling, search, sources, cross-refs, storage, evaluation-set
npm run validate:quran               # expect 114 surahs, 6236 ayat, 0 issues
npm run validate:licenses            # expect all source records complete
npm run lint
npm run build                     # then: npm start + manual smoke of the flows below
```

Manual smoke: search a reference and a term; open `/topics/patience`; add an
ayah to the plan from a card; complete a review in `/learn/revision`; export
then import the backup from Settings; confirm `/editorial` shows clean
validation; confirm every AI route/API 404s and `respond()` stays
`rejected-flag-off`.

**Do not call Al-Huda production-ready** until typecheck, tests, both
validators, lint, and build all pass and the release gate in the PRD is
reviewed against `docs/PRD-CHECKLIST.md`.
