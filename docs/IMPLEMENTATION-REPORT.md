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

`src/lib/seo/jsonld.ts` is the single source of truth for JSON-LD
(WebSite, QuranWork, breadcrumbs, package dataset), emitted through a
`JsonLd` component that escapes `<` and Unicode line terminators against
script breakout. Sitemap and robots are present; canonical `alternates` are
set on every indexable route; private/utility pages (library, settings,
revision, editorial, report) are explicitly noindexed.

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
- `/report`: correction intake (react-hook-form + zod), critical categories
  first, copy-to-clipboard delivery, and an explicit statement that **no
  delivery destination is configured yet**. Linked from the site footer and
  the accessibility statement's feedback section.
- `docs/EDITORIAL.md`: roles, the seven-step workflow, correction handling,
  rollback procedures, and the deliberate scope gaps.
- `scripts/validate-quran-data.mjs` (schema, duplicates, ordering, counts) and
  `scripts/validate-source-licenses.mjs` (rights register fields).

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
| FR-066 has no report destination | Corrections cannot actually reach anyone | Configure an address/tracker — release blocker |
| No qualified reviewer assigned | Every topic stays `pending-scholarly-review`; AI gate `editorial-reviewer` unmet | Assign a reviewer |
| AI evaluation set never executed | Gates `evaluation-dataset`, `citation-coverage`, `abstention-rate`, `hallucination-zero` cannot be marked met | Run the suite in the verification phase |
| Two validation scripts never run | FR-070/075 not demonstrated end-to-end | Run `node scripts/validate-quran-data.mjs` and `…-licenses.mjs` |
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
node scripts/validate-quran-data.mjs        # expect 114 surahs, 6236 ayat, 0 issues
node scripts/validate-source-licenses.mjs   # expect all source records complete
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
