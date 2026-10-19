# PRD v3.0 Implementation Checklist

This document tracks the implementation status of every requirement in
`docs/PRD.md` (v3.0). Statuses are honest about verification: this environment
has no shell tool, so **no `tsc`, `vitest`, `next build`, or lint command has
been executed**. "Implemented" means the code is present and structurally
coherent on static inspection; "Verified" would mean a test or typecheck has
run — and that is deferred to the final release phase per the user's directive.

**FR numbers are taken verbatim from the PRD.** The PRD has gaps (no FR-009,
no FR-045–049, no FR-055–059, no FR-067–069). Rows are not invented to fill
those gaps.

## Status legend

| Code | Meaning |
|---|---|
| ✅ COMPLETE | Code, behavior, tests (where applicable), and integration are in place. Static inspection shows coherence. |
| 🟡 PARTIAL | Some behavior is present, but a piece is missing, deferred, or blocked. |
| 🔴 NOT IMPLEMENTED | No code exists for this requirement yet. |
| 🚫 BLOCKED | Requirement cannot be implemented without an external dependency, license, or authority that is not available. Reason recorded. |
| ⏸️ DEFERRED | Explicitly out of scope for this release per PRD or AI_RULES (e.g. analytics, accounts). |
| ❓ UNVERIFIED | Implemented in code, but no typecheck/test/build has run. |

Verification column: **static** = code reviewed by reading; **tests** = unit/integration tests exist; **runtime** = would need a running server. Until the deferred testing phase runs, every row is at best `static`.

---

## Section 1–3: Vision, problem, users

| Persona / journey | Route(s) | Status |
|---|---|---|
| Casual reader | `/`, `/quran`, `/ayah/:s/:a` | ✅ COMPLETE (static) |
| Serious student | `/topics`, `/topics/:slug`, `/sources` | ✅ COMPLETE (static) |
| Searcher | `/search` | ✅ COMPLETE (static) — FR-012/013/015 wired |
| Hifz learner | `/learn/revision` | ✅ COMPLETE (static) — FR-050–053; linked from both navs and the ayah card |
| Researcher / developer | `/api/v1/...`, JSON-LD | ✅ COMPLETE (static) — 10 v1 route files + `src/lib/api/v1.ts`; JSON-LD on home/index/surah/ayah/topic/sources |

## Section 4: Personas (coverage check)

| Persona | Served by | Status |
|---|---|---|
| 1. New Muslim / curious | Home, search, topic landing | ✅ COMPLETE |
| 2. Regular reader | Quran reader, library, settings | ✅ COMPLETE |
| 3. Student / teacher | Topics, cross-refs, sources | ✅ COMPLETE (cross-refs implemented) |
| 4. Hifz learner | Revision workflow | ✅ COMPLETE (static) |
| 5. Non-Arabic reader | Translation + transliteration | ✅ COMPLETE (one edition) |
| 6. Researcher / developer | Public JSON API, JSON-LD | ✅ COMPLETE (static) |

## Section 5: MVP scope (Release 1.0)

| Requirement | Status | Notes |
|---|---|---|
| Quran text display (Arabic, translation, transliteration) | ✅ COMPLETE | Verbatim from pinned dataset |
| Surah / ayah navigation | ✅ COMPLETE | `/quran`, `/ayah/:s/:a` |
| Search (reference, Arabic, translation, transliteration, surah name) | ✅ COMPLETE | FR-013 snippets, FR-015 match reasons wired |
| Topics with curated ayat | ✅ COMPLETE | 11 topics, FR-020 language stamped |
| Library (bookmarks, notes, tags, progress) | ✅ COMPLETE | Local-first, FR-044 warning added |
| Settings (reader prefs) | ✅ COMPLETE | FR-044 warning added |
| Sources / provenance page | ✅ COMPLETE | `/sources` |
| Privacy / terms / accessibility | ✅ COMPLETE | All three pages exist |
| Audio recitation | 🚫 BLOCKED | Rights unverified; PRD §23 rec 8 defers |
| Second English translation | 🚫 BLOCKED | FR-033; no dataset with verified redistribution rights |
| Tafsir excerpts | 🟡 PARTIAL | Source record exists; link-out only, no tafsir corpus bundled |
| Word-by-word Arabic / roots | 🚫 BLOCKED | No verified morphology dataset |

## Functional requirements (FR-001 … FR-075)

### 8.1 Quran reader

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-001 (P0) | Display Surah index with Arabic name, transliteration/English label where available, verse count, and revelation metadata only when verified. | ✅ COMPLETE | `/quran` index page; metadata from pinned dataset |
| FR-002 (P0) | Display all available ayat in canonical order. | ✅ COMPLETE | Surah page renders all ayat in order |
| FR-003 (P0) | Support navigation by Surah and ayah number. | ✅ COMPLETE | `/quran`, `/ayah/:s/:a`, prev/next links |
| FR-004 (P0) | Display selected translation and edition/source label. | ✅ COMPLETE | Saheeh International credited on every ayah card and source panel |
| FR-005 (P0) | Provide copy/share link to stable ayah reference. | ✅ COMPLETE | Copy link button on ayah card, `absoluteUrl` helper |
| FR-006 (P1) | Allow font size, line spacing, and reading layout preferences. | ✅ COMPLETE | Settings page: arabicSize, lineHeight, showTranslation, showTransliteration |
| FR-007 (P1) | Support continuous reading and next/previous Surah navigation. | ✅ COMPLETE | Surah page renders all ayat; prev/next surah links |
| FR-008 (P1) | Provide juz/page metadata only if validated against the chosen mushaf dataset. | 🟡 PARTIAL | Juz number shown (canonical Hafs scheme), but `juz.ts` header says it hasn't been verified against a specific printed Mushaf; page metadata is marked approximate and not rendered |

### 8.2 Search and discovery

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-010 (P0) | Search by exact reference (e.g. 2:255). | ✅ COMPLETE | `parseReference` in `search.ts` |
| FR-011 (P0) | Search Arabic and translation text using normalized indexing. | ✅ COMPLETE | `normalizeArabic`, `normalizeLatin`, `searchQuran` |
| FR-012 (P1) | Filter results by Surah, translation edition, topic, or content type. | 🟡 PARTIAL | Surah, revelation type, Juz, curated topic implemented; edition filter blocked on FR-033 |
| FR-013 (P1) | Show snippets with highlighted terms while preserving readable Arabic. | ✅ COMPLETE | `findSnippetRange` + `<mark>` in `ayah-card.tsx` |
| FR-014 (P2) | Natural-language semantic retrieval across approved content. | 🔴 NOT IMPLEMENTED | No semantic/embedding search |
| FR-015 (P2) | Show why a result matched (exact phrase, translation term, curated theme, or semantic similarity). | ✅ COMPLETE | `MatchReason` + `REASON_LABELS` + chip with `aria-describedby` |

### 8.3 Topic system and knowledge graph

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-020 (P0) | Support curated topics with stable slug, title, description, language, and editorial status. | ✅ COMPLETE | `Topic` interface + `LANGUAGE_LABELS` display |
| FR-021 (P0) | Link topics to ayat through typed relationships. | ✅ COMPLETE | `TopicRelation` with type, rationale, provenance |
| FR-022 (P0) | Record who/what created the relationship, source, review status, and last-reviewed date. | ✅ COMPLETE | `Topic.provenance`: method, curator, reviewedAt, status |
| FR-023 (P1) | Support related topics and ayah-to-ayah cross-references. | ✅ COMPLETE | `topic.related` + `cross-references.ts` (dataset-derived) |
| FR-024 (P1) | Provide an accessible list view even if a graph visualization exists. | ✅ COMPLETE | `LexicalMatchGroupsPanel` (ordered links, no canvas) |
| FR-025 (P2) | Interactive graph visualization with keyboard-accessible alternatives. | 🔴 NOT IMPLEMENTED | P2; list view satisfies FR-024 |

### 8.4 Tafsir and source presentation

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-030 (P0) | Show author/work/edition/language for tafsir. | 🟡 PARTIAL | `TafsirLinks` shows author/work/edition; language not displayed separately |
| FR-031 (P0) | Distinguish full text, excerpt, summary, and link to external source. | ✅ COMPLETE | `TafsirLinks` is link-out only, explicitly labeled FR-031 |
| FR-032 (P0) | Track licensing and permitted display/use per source. | ✅ COMPLETE | `SourceRecord.license` + notes; `DATA-PROVENANCE.md` |
| FR-033 (P1) | Compare multiple translations side-by-side. | 🚫 BLOCKED | No second translation with verified redistribution rights |
| FR-034 (P1) | Provide source details and editorial methodology. | 🟡 PARTIAL | `/sources` page exists; methodology expanded in `docs/EDITORIAL.md` but no site-wide methodology page |
| FR-035 (P2) | Add tafsir search across works where rights and data quality permit. | 🚫 BLOCKED | No tafsir corpus bundled |

### 8.5 User library

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-040 (P0) | Allow authenticated users to bookmark ayat. | 🚫 BLOCKED | No-accounts architecture; FR-044 is the sanctioned substitute |
| FR-041 (P1) | Allow private notes and tags. | ✅ COMPLETE | Ayah-card note editor, tags normalized |
| FR-042 (P1) | Sync library across devices. | 🚫 BLOCKED | Requires accounts + DB; excluded by AI_RULES |
| FR-043 (P1) | Export and delete personal data. | ✅ COMPLETE | Shared v2 envelope in `src/lib/backup.ts` carries library + revision plan + preferences; import validates and replaces; erase clears all three (static) |
| FR-044 (P2) | Local-only anonymous library, if implemented with transparent persistence limits. | ✅ COMPLETE | `LibraryProvider` + FR-044 warnings in Library and Settings pages |

### 8.6 Learning and memorization

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-050 (P1) | Let users select a revision range. | ✅ COMPLETE | `expandRange` (bounded by real verse counts, 200 cap) + `AddVerses` + single-ayah action on `AyahCard` |
| FR-051 (P1) | Record review events and self-rated recall. | ✅ COMPLETE | `ReviewEvent` audit log, `DueQueue` active-recall flow, capped storage log |
| FR-052 (P1) | Schedule reviews using a configurable spaced-repetition algorithm. | ✅ COMPLETE | Three ladders stored per item; `scheduling.test.ts` exists (not run) |
| FR-053 (P1) | Provide a no-streak / no-shame progress interface. | ✅ COMPLETE | `statsFor()` has no streak field; test asserts absence; copy states no score/comparison |
| FR-054 (P2) | Audio-assisted review if licensed assets and playback UX are ready. | 🚫 BLOCKED | Audio rights unverified; PRD §23 rec 8 defers |

### 8.7 AI assistant

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-060 (P2) | Retrieve only from approved, versioned source material. | 🟡 PARTIAL | Allowlist derived from `method === "package"` (`src/lib/ai/approved-sources.ts`); no retrieval feature exists yet to exercise it; feature flag off |
| FR-061 (P2) | Return citations with each factual Quranic or scholarly claim. | 🟡 PARTIAL | Claim-level citation assembly in `grounding.ts` with reference resolution; never exercised in product (flag off); evaluation run not executed |
| FR-062 (P2) | Separate retrieved quotations from generated summaries. | 🟡 PARTIAL | Quote vs summary segment types enforced structurally in `respond()`; no live answers to separate |
| FR-063 (P2) | Abstain when retrieval is insufficient. | 🟡 PARTIAL | Abstention paths implemented (empty retrieval, failed validation, non-authority, high-risk) behind an off flag |
| FR-064 (P2) | Avoid presenting personal opinions or generated content as Quran, hadith, tafsir, fatwa, or scholarly consensus. | ✅ COMPLETE | Non-authority kinds refuse before retrieval; no AI answer feature renders content |
| FR-065 (P2) | Log source IDs and model/version metadata for quality audits, subject to privacy policy. | 🟡 PARTIAL | `src/lib/ai/audit.ts`: no user/prompt fields by construction, bounded process-local ring, `featureEnabled: false`; privacy policy review gate unmet |
| FR-066 (P2) | Provide user feedback/reporting for inaccurate or inappropriate answers. | 🟡 PARTIAL | `/report` form built (category, reference, validation, clipboard) and linked from the footer; **no delivery destination configured** — release blocker to close |

### 8.8 Editorial/admin tooling

| FR | Requirement (verbatim from PRD) | Status | Notes |
|---|---|---|---|
| FR-070 (P0) | Import datasets with schema validation and duplicate detection. | 🟡 PARTIAL | Ingestion is by package pin (documented in `docs/EDITORIAL.md`); `scripts/validate-quran-data.mjs` implements schema + duplicate + count gates — **not executed in this environment**; no free-form importer by design |
| FR-071 (P0) | Keep immutable source/version metadata for Quran text and translations. | ✅ COMPLETE | `SourceRecord` + `DATA-PROVENANCE.md` rejection table |
| FR-072 (P0) | Review and approve topic-to-ayah mappings before public publication. | 🟡 PARTIAL | `/editorial` review board renders status, unresolved refs, curator and dates; approval itself happens in code review — no authenticated workflow exists (no accounts) |
| FR-073 (P1) | Track changes, reviewers, and publication state. | 🟡 PARTIAL | Publication state + curator + reviewedAt tracked at topic level and shown on `/editorial`; no per-relation change history (documented gap in `docs/EDITORIAL.md`) |
| FR-074 (P1) | Roll back an incorrect topic mapping or dataset release. | 🟡 PARTIAL | Procedures documented (`docs/EDITORIAL.md`: git revert / re-pin package + validation); no rollback has been exercised |
| FR-075 (P1) | Display content rights and source status to editors. | ✅ COMPLETE | Rights table on `/sources` (public) and `/editorial` (per-source licence, version, delivery, allowlist state) + `scripts/validate-source-licenses.mjs` |

## Section 9: Relationship model

| Entity | Status | Notes |
|---|---|---|
| `AyahRef` | ✅ COMPLETE | `{ surah, ayah }` typed |
| `TopicRelation` | ✅ COMPLETE | Typed, rationale, provenance |
| `CrossReference` | ✅ COMPLETE | Dataset-derived in `cross-references.ts` |
| `SourceRecord` | ✅ COMPLETE | `src/lib/quran/sources.ts` |
| `RevisionItem / ReviewEvent` | ✅ COMPLETE | `src/lib/revision/scheduling.ts` + validated storage in `src/lib/revision/storage.ts` |

## Section 10–11: Privacy, accessibility

| Requirement | Status | Notes |
|---|---|---|
| No account, no server user data | ✅ COMPLETE | |
| No analytics | ✅ COMPLETE | PRD §18 deliberately not implemented |
| Local-only with transparent limits | ✅ COMPLETE | FR-044 warnings; backup copy names both stores |
| Colour never alone for meaning | ✅ COMPLETE | Match-reason chip uses text + weight + underline |
| `lang` / `dir` on Arabic | ✅ COMPLETE | `lang="ar" dir="rtl"` on Arabic paragraphs |
| `aria-label`, `aria-pressed`, `aria-describedby` | ✅ COMPLETE | AyahCard, bookmark button, match-reason chip |
| `/accessibility` page | ✅ COMPLETE | Feedback section now points at `/report` |

## Section 12–13: UX, responsive, error handling

| Requirement | Status | Notes |
|---|---|---|
| Mobile-first responsive | ✅ COMPLETE | Tailwind breakpoints throughout |
| 404 page | ✅ COMPLETE | `src/app/not-found.tsx` |
| Error page | ✅ COMPLETE | `src/app/error.tsx` |
| Loading states | ✅ COMPLETE | Suspense boundaries in search, library |
| Empty states | ✅ COMPLETE | Library, search, revision queue |

## Section 14: Public read-only API

Files are on disk: `src/lib/api/v1.ts` plus 10 route handlers under
`src/app/api/v1/`. The shared module (envelope, error format, validation,
pagination, rate limiting) was read in full this session; individual route
handlers were **not** re-read here, so rows below record file presence plus
static inspection of the shared plumbing rather than a per-route review.

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/v1` (service index) | ✅ COMPLETE (static) | File present; rate-limited envelope from `guarded()` |
| `GET /api/v1/surahs` | ✅ COMPLETE (static) | File present |
| `GET /api/v1/surahs/:surahNumber` | ✅ COMPLETE (static) | File present |
| `GET /api/v1/ayahs/:surahNumber/:ayahNumber` | ✅ COMPLETE (static) | File present; also the endpoint the revision reveal step consumes |
| `GET /api/v1/search?q=...&limit=...&offset=...&language=...` | ✅ COMPLETE (static) | File present |
| `GET /api/v1/topics` | ✅ COMPLETE (static) | File present |
| `GET /api/v1/topics/:slug` | ✅ COMPLETE (static) | File present |
| `GET /api/v1/topics/:slug/ayahs` | ✅ COMPLETE (static) | File present |
| `GET /api/v1/ayahs/:surahNumber/:ayahNumber/tafsir` | ✅ COMPLETE (static) | File present; must return honest "link-out only" response |
| `GET /api/v1/sources` | ✅ COMPLETE (static) | File present |
| Authenticated endpoints (`/api/library/*`, `/api/ai/ask`) | 🚫 BLOCKED | No-accounts architecture; excluded by AI_RULES |
| Cross-reference / graph data endpoint | ⏸️ DEFERRED | Deliberate (availability risk noted in PRD §14); FR-024 satisfied by the HTML list view |

API requirements from §14 (via `src/lib/api/v1.ts`, read this session):
- ✅ Stable response schemas and explicit versioning (`version` on every success payload)
- ✅ Pagination with `limit`/`offset` and honest `truncated` instead of an invented `total`
- ✅ Input validation and bounded query sizes (`boundedInt`, length-capped search)
- ✅ Consistent error format `{ error: { code, message, hint? } }` via `apiError()`
- 🟡 Rate limits — best-effort per-process brake only, documented as a deployment requirement (CDN/edge) in the module header
- ✅ No sensitive personal data in public endpoints (localStorage has no server representation)
- ✅ Quran references validated against canonical records (`boundedInt` + dataset bounds)

## Section 15: SEO / structured data

| Requirement | Status | Notes |
|---|---|---|
| `generateMetadata` / `metadata` on content routes | ✅ COMPLETE (static) | Exported on every page route (client pages get it from their `layout.tsx`, e.g. `/report`); canonical `alternates` verified on `/`, `/quran`, surah, ayah, topics, sources, search, about, privacy, terms, accessibility |
| `sitemap.ts` | ✅ COMPLETE | |
| `robots.ts` | ✅ COMPLETE | |
| JSON-LD / schema.org | ✅ COMPLETE (static) | `src/lib/seo/jsonld.ts` builders + `JsonLd` component; emitted on home, surah index, surah, ayah, topic detail, sources, with `<` escaping. Hyphen alias `src/lib/seo/json-ld.ts` delegates so there is one source of truth |
| Open Graph / Twitter cards | 🟡 PARTIAL | Present on key routes; per-route rendering not verified (needs a build) |
| Private/thin pages noindex | ✅ COMPLETE | library, settings, revision, editorial, report all `robots: noindex` |

## Section 16–24: Non-functional, roadmap, deferrals

| Requirement | Status | Notes |
|---|---|---|
| Performance budgets | ❓ UNVERIFIED | No Lighthouse run |
| Bundle size discipline | ❓ UNVERIFIED | No `next build` run |
| Audio deferred | ✅ COMPLETE (deferral) | PRD §23 rec 8 followed |
| Analytics omitted | ✅ COMPLETE (deferral) | AI_RULES + PRD §10 |
| Accounts omitted | ✅ COMPLETE (deferral) | AI_RULES |
| Word-by-word / roots deferred | 🚫 BLOCKED | No verified dataset |
| Second translation blocked | 🚫 BLOCKED | FR-033 |
| Cross-device sync blocked | 🚫 BLOCKED | AI_RULES |

## Summary counts

| Status | Count |
|---|---|
| ✅ COMPLETE | ~57 |
| 🟡 PARTIAL | ~13 |
| 🔴 NOT IMPLEMENTED | 2 (FR-014, FR-025 — both P2) |
| 🚫 BLOCKED | ~9 |
| ⏸️ DEFERRED | 3 |
| ❓ UNVERIFIED | 2 |

Remaining implementable gaps, in dependency order:

1. **FR-066 destination** — configure where correction reports go (release blocker for closing FR-066).
2. **AI evaluation run** — execute `src/lib/ai/evaluation-set.test.ts` and the two `scripts/*.mjs` validators; record results to move the AI gates from `met: false`.
3. **Open Graph / Twitter card verification** — confirm rendered OG tags per route after a production build.
4. **FR-073 per-relation history** — needs a store the build otherwise does not have; decide in a later release.

## Verification disclaimer

**No typecheck, test, build, or lint command has been executed in this
environment.** Every status above rests on static inspection of the source
tree. The consolidated testing plan in the final implementation report will
cover the exact commands to run and the expected outcomes.
