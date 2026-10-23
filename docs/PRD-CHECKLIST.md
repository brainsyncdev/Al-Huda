# PRD v3.0 Implementation Checklist

**Document control:** reconciled 2026-10-23 against the repository. This
revision supersedes the earlier text that claimed no typecheck, test, build, or
validation command had been executed.

This document tracks every requirement in `docs/PRD.md` (v3.0). FR numbers are
taken verbatim from the PRD. The PRD has gaps (no FR-009, no FR-045-049, no
FR-055-059, no FR-067-069); rows are not invented to fill them.

## Verification basis

The latest audit reported the results below. They are recorded as **reported
results**, not re-executed during this documentation pass.

| Check | Reported result |
| --- | --- |
| `npm run typecheck` (`tsc --noEmit`) | Clean |
| `npm test` (`vitest run`) | 188 tests in 11 files, all passing |
| `npm run build` (`next build`) | Exit 0, compiled successfully |
| `npm run validate:quran` | 114 surahs, 6,236 ayat, 0 issues |
| `npm run validate:licenses` | 13 source records, 0 issues |

These results establish that the current tree typechecks, the unit suite
passes, a production build completes, and the two data validators report no
issues. They do **not** establish production readiness, licensing clearance,
scholarly approval, accessibility conformance, Core Web Vitals, rendered
Open Graph/Twitter output, end-to-end journey correctness, or that every PRD
requirement is satisfied. No lint result, Lighthouse run, Playwright/Cypress
suite, automated axe audit, or SEO test is recorded.

> **A passing validator is not permission.** `validate:licenses` checks the
> fields the rights register requires; it cannot grant rights. Audio
> recordings, the Tanzil translation catalog, and in-app tafsir text remain
> subject to legal/licensing review. See `docs/DATA-PROVENANCE.md`.

## Status legend

| Code | Meaning |
| --- | --- |
| COMPLETE | Code, behavior, integration, and the stated verification basis are in place. |
| PARTIAL | Some behavior exists, but a named piece is missing, unverified, or blocked. |
| NOT IMPLEMENTED | No code exists for this requirement. |
| BLOCKED | Cannot be completed without an external dependency, licence, authority, or architectural change. |
| DEFERRED | Explicitly out of scope per the PRD or AI_RULES. |
| UNVERIFIED | Implemented in code, but no measurement or rendered-output check exists. |

---

## Sections 1-3: Vision, problem, users

| Persona / journey | Route(s) | Status |
| --- | --- | --- |
| Casual reader | `/`, `/quran`, `/ayah/:s/:a` | COMPLETE |
| Serious student | `/topics`, `/topics/:slug`, `/sources` | COMPLETE |
| Searcher | `/search` | COMPLETE - lexical and opt-in semantic paths |
| Hifz learner | `/learn/revision` | COMPLETE - FR-050-053 |
| Researcher / developer | `/api/v1/...`, JSON-LD | COMPLETE (static route inventory) |

## Section 4: Personas

| Persona | Served by | Status |
| --- | --- | --- |
| 1. New Muslim / curious | Home, search, topic landing | COMPLETE |
| 2. Regular reader | Quran reader, library, settings | COMPLETE |
| 3. Student / teacher | Topics, cross-refs, sources, tafsir viewer | COMPLETE |
| 4. Hifz learner | Revision workflow | COMPLETE |
| 5. Non-Arabic reader | 100+ translations, transliteration, word-by-word | COMPLETE (licensing review outstanding) |
| 6. Researcher / developer | Public JSON API, JSON-LD | COMPLETE (static route inventory) |

## Section 5: MVP scope (Release 1.0)

| Requirement | Status | Notes |
| --- | --- | --- |
| Quran text display | COMPLETE | Arabic and built-in English verbatim from `quran-json@3.1.2`; selected Tanzil edition loads on demand with built-in English fallback while loading |
| Surah / ayah navigation | COMPLETE | `/quran`, `/ayah/:s/:a` |
| Search | COMPLETE | Indexes Arabic and the built-in English translation; the selected runtime translation is not indexed |
| Topics with curated ayat | COMPLETE | 11 topics, provenance-stamped, `pending-scholarly-review` |
| Library | COMPLETE | Local-first |
| Settings | COMPLETE | Includes translation, audio, and parallel-translation controls |
| Sources / provenance page | COMPLETE | `/sources` |
| Privacy / terms / accessibility | COMPLETE | Pages exist; no automated a11y audit recorded |
| Audio recitation | PARTIAL | Streaming implemented; recording rights not established |
| Additional translations | PARTIAL | 100+ Tanzil editions via runtime proxy; per-edition licensing not individually verified |
| Tafsir excerpts | COMPLETE | Two Arabic tafsirs readable in-app via proxy; two English tafsirs link-out only; licensing review outstanding |
| Word-by-word | COMPLETE | QUL (MIT) word data vendored; roots not provided |
| Mushaf metadata (FR-008) | COMPLETE | Tanzil CC-BY boundaries verified at build time |
| Cross-references | COMPLETE | Dataset-derived ayah-to-ayah |
| Topic graph (FR-025) | COMPLETE | SVG with keyboard-focusable nodes |

## Section 6: Information Architecture

| Route | Status |
| --- | --- |
| `/`, `/quran`, `/ayah/:s/:a` | COMPLETE |
| `/topics`, `/topics/:slug` | COMPLETE |
| `/search` | COMPLETE |
| `/sources`, `/editorial`, `/report` | COMPLETE |
| `/library`, `/learn/revision`, `/settings` | COMPLETE |
| `/admin` (Decap) | PARTIAL — scaffolded, local backend only |

## Section 7: Core User Journeys

| Journey | Status |
| --- | --- |
| A — Read an ayah | COMPLETE |
| B — Explore a topic | COMPLETE |
| C — Ask a question | BLOCKED — AI feature off |
| D — Save and revisit | COMPLETE (local-only) |
| E — Memorization/revision | COMPLETE |

## Section 8: Functional Requirements

### 8.1 Quran reader

| FR | Status | Notes |
| --- | --- | --- |
| FR-001 | COMPLETE | |
| FR-002 | COMPLETE | |
| FR-003 | COMPLETE | |
| FR-004 | COMPLETE | Built-in English + 100+ Tanzil editions on demand |
| FR-005 | COMPLETE | |
| FR-006 | COMPLETE | |
| FR-007 | COMPLETE | |
| FR-008 | COMPLETE | Tanzil CC-BY boundaries, build-time verified |

### 8.2 Search and discovery

| FR | Status | Notes |
| --- | --- | --- |
| FR-010 | COMPLETE | |
| FR-011 | COMPLETE | Arabic + built-in English indexed; runtime translation not indexed |
| FR-012 | COMPLETE | Surah/topic/juz/revelation filters on default search; translation-edition search implemented as a separate mode (`/search?edition=<id>`) rather than a filter on default results |
| FR-013 | COMPLETE | Snippet highlighting for built-in English only |
| FR-014 | PARTIAL | Lexical ranking is default; embedding search is a separate opt-in mode; English-only |
| FR-015 | COMPLETE | |

### 8.3 Topic system

| FR | Status | Notes |
| --- | --- | --- |
| FR-020 | COMPLETE | |
| FR-021 | COMPLETE | |
| FR-022 | COMPLETE | Provenance record per topic; per-relation override available but unused |
| FR-023 | COMPLETE | |
| FR-024 | COMPLETE | |
| FR-025 | COMPLETE | |

### 8.4 Tafsir and source presentation

| FR | Status | Notes |
| --- | --- | --- |
| FR-030 | COMPLETE | |
| FR-031 | COMPLETE | |
| FR-032 | COMPLETE | Rights register in sources.ts |
| FR-033 | PARTIAL | 100+ editions via Tanzil proxy; per-edition licensing not individually verified |
| FR-034 | COMPLETE | |
| FR-035 | COMPLETE | Merged search across al-Jalalayn and al-Muyassar (`/search?mode=tafsir`, `/api/v1/search/tafsir`); hits labeled with edition |

### 8.5 User library

| FR | Status | Notes |
| --- | --- | --- |
| FR-040 | PARTIAL | Bookmarking works locally; the requirement says "authenticated users", and this build has no accounts. FR-044 is the deliberate local-only substitute |
| FR-041 | COMPLETE | |
| FR-042 | BLOCKED | No sync by design (no accounts, no server store) |
| FR-043 | COMPLETE | Backup envelope v4 |
| FR-044 | COMPLETE | Local-only is the architecture, not an alternative |

### 8.6 Learning and memorization

| FR | Status | Notes |
| --- | --- | --- |
| FR-050 | COMPLETE | |
| FR-051 | COMPLETE | |
| FR-052 | COMPLETE | |
| FR-053 | COMPLETE | |
| FR-054 | PARTIAL | Streaming implemented; recording rights not established |

### 8.7 AI assistant

| FR | Status | Notes |
| --- | --- | --- |
| FR-060 | PARTIAL | Allowlist and refusal path implemented in code; runtime disabled. Allowlist derives from `method === "package"`, which now also admits word data and mushaf metadata — not all package records are prose sources |
| FR-061 | PARTIAL | Claim-level citation checks implemented and unit-tested; never exercised against a live model |
| FR-062 | PARTIAL | Quotation/summary separation implemented; unverified end-to-end |
| FR-063 | PARTIAL | High-risk and insufficient-evidence abstention implemented; unverified |
| FR-064 | PARTIAL | Non-authority claims (hadith, tafsir, ruling, consensus) refused before retrieval |
| FR-065 | PARTIAL | `AUDIT_RETENTION` defined; audit records contain no user, prompt, or question field. Privacy review gate unmet |
| FR-066 | PARTIAL | `/report` intake exists; no delivery destination configured; no AI answer to report because the feature is off |

`AI_ANSWER_FEATURE_ENABLED = false as const` in `src/lib/ai/feature-flag.ts`. No
`/api/ai/ask` route exists. All seven gates are declared; only
`source-registry` is `met: true`. The six unmet gates are
`evaluation-dataset`, `citation-coverage`, `abstention-rate`,
`hallucination-zero`, `privacy-review`, and `editorial-reviewer`.

### 8.8 Editorial/admin tooling

| FR | Status | Notes |
| --- | --- | --- |
| FR-070 | COMPLETE | Package pin + validation scripts; reported 114/6,236/0 |
| FR-071 | PARTIAL | Version string and structural scan; no byte-level checksum baseline |
| FR-072 | PARTIAL | Workflow and review log exist; no qualified reviewer, so nothing can be approved |
| FR-073 | PARTIAL | Current publication state, curator, and review date are recorded; per-event who-changed-what history is not (git is the audit trail) |
| FR-074 | COMPLETE | Revert commit / re-pin package, documented |
| FR-075 | COMPLETE | Rights register displayed on `/sources` and `/editorial` |

## Section 9: Content and provenance model

Core entities are present in typed form (`src/lib/quran/types.ts`,
`src/lib/topics/data.ts`, `src/lib/quran/sources.ts`). Relationship types are
typed. The validation gates in §9 are implemented as structural checks; gate 4
("compare sampled passages against a trusted reference") and gate 5 ("verify
translation edition and license") have no recorded human sign-off.

## Section 10: AI and religious-content safety

Implemented as code paths and unit tests, with the public feature off. See
`docs/AI-SAFETY.md` for the gate-by-gate status.

## Section 11: UX and visual design

| Requirement | Status |
| --- | --- |
| RTL, typography, reduced motion | COMPLETE in code |
| Keyboard navigation, focus, landmarks | COMPLETE in code; no automated axe audit recorded |
| Non-color status indicators | COMPLETE |
| Empty/loading/offline/error/not-found states | COMPLETE |
| WCAG 2.2 AA conformance | UNVERIFIED — no audit performed |

## Section 12: Technical architecture

Deliberate deviations from the recommended stack, all documented:

| PRD recommendation | Actual | Reason |
| --- | --- | --- |
| PostgreSQL / relational database | None; static data + localStorage | Local-first, no accounts |
| Authentication solution | None | No accounts by design |
| Server-side data access for public content | Server components + static JSON | Compliant |
| Dedicated search service | In-memory lexical index + client-side embeddings | Scale not reached |
| Runtime schema validation at import | Build-time validators | No runtime import path |
| Error tracking / observability | None | No analytics or telemetry by design |

## Sections 13-15: Structure, API surface, SEO

- Repository structure follows §13.
- `/api/v1/*` is implemented with a documented static route inventory;
  authenticated endpoints from §14 do not exist because there are no accounts.
  `/api/ai/ask` does not exist.
- JSON-LD, sitemap, robots, canonical URLs, and per-route noindex are
  implemented. Rendered Open Graph/Twitter output is unverified.

## Section 16: Non-functional requirements

| Area | Status | Notes |
| --- | --- | --- |
| Performance / Core Web Vitals | UNVERIFIED | No Lighthouse or field data recorded |
| Reliability | PARTIAL | Reading survives optional-service failure; no database backup (no database); dataset rollback documented |
| Localization | COMPLETE | 100+ translation editions; UI copy English only |
| Privacy | COMPLETE | No accounts, no analytics, no server-side user data; export/delete via backup controls |

## Section 17: Success metrics

**Intentionally unmeasurable in this build.** The product collects no
analytics and has no accounts, so activation, retention, session, and
engagement metrics cannot be computed. Quality metrics that can be measured
offline are covered by the validators. This is a consequence of the
privacy-first architecture, not an oversight; enabling §17 would require the
analytics and identity infrastructure the project deliberately excludes.

## Section 18: Analytics and event taxonomy

**Not implemented, by design.** No event is emitted. No consent, retention, or
access policy is needed because no event data exists.

## Section 19: Testing and QA

| Check | Status |
| --- | --- |
| Unit tests | 188 tests in 11 files, reported passing |
| Import/dataset tests | Covered by `validate:quran`, reported 0 issues |
| Integration tests (search, source retrieval, permissions) | PARTIAL — pure modules tested; no browser-level suite |
| End-to-end tests | NOT IMPLEMENTED |
| Accessibility audit | NOT IMPLEMENTED |
| SEO tests | NOT IMPLEMENTED (metadata asserted in code, not rendered output) |
| AI citation validation | Unit-tested with the flag off; no live run |
| Manual QA checklist | NOT RECORDED |
| Qualified topic review | NOT DONE |

Release blockers from §19 that remain open: missing provenance/rights sign-off
for audio and the translation catalog; no qualified review of topic mappings;
unverified rendered SEO output. Quran text integrity checks pass; no cross-user
access risk exists because there are no accounts.

## Section 20: Editorial governance

Roles are defined; the qualified reviewer role is unfilled. The seven-step
workflow is documented and partly tooled. Correction intake exists without a
configured destination. Rollback is documented. See `docs/EDITORIAL.md`.

## Sections 21-23: Roadmap, risks, open decisions

- Phase 0 (source/licence audit): **incomplete** — licensing review outstanding.
- Phase 1 (reading MVP): complete except accessibility QA.
- Phase 2 (discovery): complete except qualified review and tafsir search.
- Phase 3 (personal learning): complete in local-only form.
- Phase 4 (grounded AI): harness only; disabled.
- Phase 5 (mobile): not started.

Open decisions from §23 and how they were resolved:

| Decision | Resolution |
| --- | --- |
| Initial language | English UI, Arabic text, Urdu default translation |
| Translation source | 100+ Tanzil editions via runtime proxy; per-edition rights unverified |
| Tafsir scope | Two Arabic tafsirs in-app via proxy; two English tafsirs link-out; rights review outstanding |
| Authentication | Anonymous-only |
| Database | None |
| Search | In-memory lexical + client-side embeddings |
| Editorial review | Unassigned |
| Audio | Streamed from Islamic Network CDN; rights unresolved |
| Mobile | Deferred |
| AI launch gate | Not met; feature flag false |

## Section 24: Definition of Done

No feature that touches Quran text, translation, tafsir, or religious claims
meets every DoD clause, because "data provenance and licensing are recorded"
and "product owner accepts the behavior" are not satisfied for audio,
translations, and tafsir. The reading, search, topic, library, revision, and
editorial features meet the functional clauses.

## Summary counts

Counted by FR row (the PRD defines 49 FRs; rows below match those IDs):

| Status | Count |
| --- | --- |
| COMPLETE | 34 |
| PARTIAL | 14 |
| NOT IMPLEMENTED | 0 |
| BLOCKED | 1 (FR-042) |
| **Total** | **49 FRs** |

Scope rows are counted separately. The §5 MVP list and the adjacent delivery
items total 15 rows: 13 COMPLETE, of which tafsir presentation and word-by-word
data still carry outstanding licence review, and 2 PARTIAL (audio recitation and
additional translations, both on rights).

These counts are not a completion percentage for the PRD. A row marked
COMPLETE means the named behavior exists and the stated verification basis
covers it; it does not mean licensing, scholarly review, accessibility, or
production conditions are satisfied.

## Remaining gaps and blockers

**Release dependencies requiring a human decision:**

1. Legal/licensing review of the audio recordings (the CDN publishes no explicit
   recording licence).
2. Legal/licensing review of the Tanzil translation catalog as used through the
   `/api/translations/[id]` proxy. A clean `validate:licenses` run is not
   permission to redistribute or proxy the text.
3. Legal/licensing review of the two in-app tafsir texts.
4. Assignment of a qualified reviewer for topic mappings and AI outputs.
5. Configuration of a report delivery destination (`NEXT_PUBLIC_REPORT_EMAIL`
   or an issue tracker).
6. Accessibility audit (WCAG 2.2 AA) and Core Web Vitals measurement.
7. Rendered SEO/social metadata verification after a production build.
8. Deployment hardening: rate limiting is per-process only.

**Functional gaps:**

- FR-042 cross-device sync (excluded by architecture).
- FR-073 per-event editorial history.
- FR-071 byte-level checksum baseline.
- FR-060–066 live AI behavior (gated off).

**Documentation gaps in the PRD itself:** there is no FR-009, no FR-045–049,
no FR-055–059, and no FR-067–069. Word-by-word analysis is a §5 Release 1.1
item without an FR number. This checklist does not invent identifiers to fill
those gaps.
