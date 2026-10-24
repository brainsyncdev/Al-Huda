# Sprint 11 Report: Topic Filter in Search

## Summary

Sprint 11 verified, hardened, and documented the existing topic filter in the Quran search page. Inspection revealed that the filter UI, URL persistence, validation, and application logic were already wired end-to-end across all three search modes (default, edition-scoped, tafsir). The sprint's work was to prove the filtering semantics with focused unit tests, extract the filter logic into a testable module, and confirm behavior via browser QA.

## 1. Existing Filtering Logic and Supported Modes

### Pre-existing implementation (verified, not built this sprint)

The topic filter was already implemented across three layers:

1. **URL parameter parsing** (`src/app/search/page.tsx`): `topic` query parameter validated against canonical `TOPICS` via `getTopic()`; invalid slugs set `topicSlug = null` and flagged `invalidFilters`.
2. **Filter application** (`src/app/search/page.tsx`): `topicRefs` set built from `getTopic(topicSlug).relations`, applied via `passesStructuralFilters()` in all three result branches (default, edition, tafsir).
3. **UI component** (`src/components/search/search-filters.tsx`): `<select>` dropdown populated from `topicOptions`, active filter chip with remove button, URL state preservation across filter changes, mutual exclusion of edition/mode, contextual note explaining curated-only matching.

### Supported modes

All three search modes support the topic filter:

- **Default lexical search** (`/search?q=...&topic=patience`): topic filter intersects with lexical matches.
- **Edition-scoped search** (`/search?q=...&edition=en.pickthall&topic=patience`): topic filter intersects with edition substring matches.
- **Tafsir search** (`/search?q=...&mode=tafsir&topic=patience`): topic filter intersects with tafsir substring matches.

### Filter semantics (verified)

- Topic filter uses canonical `Topic.relations` array — each relation has a `ref: { surah, ayah }`.
- Filtering is set intersection: a verse must match the lexical query AND be in the topic's relation set.
- Multiple filters combine with AND logic (surah + juz + topic + revelation type).
- Invalid topic slugs are rejected and flagged; the filter is ignored, not applied.
- Empty topic (no `?topic=` param) means no topic filtering.

## 2. Files Created or Modified

### Created
- **`src/lib/search/filters.ts`** (new, ~230 lines)
  - Extracted filter parsing, validation, and URL-building logic from the search page and filters component.
  - Exports: `parseSearchFilters()`, `passesStructuralFilters()`, `buildRevelationMap()`, `buildFilterUrl()`, `buildSearchInUrl()`.
  - Types: `RawSearchParams`, `ValidatedSearchFilters`.
  - Pure functions with no side effects; testable in isolation.

- **`src/lib/search/filters.test.ts`** (new, 51 tests)
  - Query parsing: trimming, missing, whitespace-only.
  - Surah validation: valid 1–114, rejects 0/115/non-integer/non-numeric.
  - Juz validation: valid 1–30, rejects 0/31/non-integer.
  - Revelation type validation: accepts meccan/medinan, rejects unknown.
  - Topic validation: accepts canonical slugs, rejects unknown, builds `topicRefs` set.
  - Language validation: accepts ar/en, rejects ur/other.
  - Edition/mode mutual exclusion: mode takes precedence.
  - `hasFilters` and `invalidFilters` flags.
  - `passesStructuralFilters`: surah, revelation, topic, combined AND logic.
  - `buildFilterUrl`: query preservation, filter preservation, clear-on-empty, edition/mode mutual exclusion.
  - `buildSearchInUrl`: default/tafsir/edition switching, filter preservation.

### Modified
- **`src/app/search/page.tsx`**
  - Replaced inline filter parsing (lines 52–121) with call to `parseSearchFilters()`.
  - Replaced inline `passesStructuralFilters()` with wrapper around imported `checkStructuralFilters()`.
  - Removed unused destructured variables (`surahId`, `juzNum`, `revelationType`, `topicSlug`) to satisfy lint.
  - Preserved all result branches, topic chips, learning-path chips, and empty states.

### Not Modified
- **`src/components/search/search-filters.tsx`** — already implements the UI correctly; no changes needed. The component's `updateFilter()` and `updateSearchIn()` functions mirror the extracted helpers but were left in place to avoid unnecessary churn; the extracted module covers the logic for testing.
- **`src/app/api/v1/search/route.ts`** — API contract preserved; topic filter is page-only.
- **`src/lib/topics/data.ts`** — `getTopic()` and `TOPICS` unchanged.

## 3. Actual Filtering Semantics and Limitations

### Verified behavior

- **Default search**: `q=mercy` returns 100 results; `q=mercy&topic=patience` returns 1 result (2:153, which mentions mercy and is in the patience topic); `q=mercy&topic=justice` returns 0 results (no mercy matches in the justice topic).
- **Edition search**: `q=mercy&edition=en.pickthall` returns 100 matches; `q=mercy&edition=en.pickthall&topic=patience` returns 0 matches (Pickthall's mercy translations do not overlap with patience-topic ayat in the top 100); `q=mercy&edition=en.pickthall&topic=mercy-and-forgiveness` returns 2 matches.
- **Tafsir search**: `q=صبر&mode=tafsir` returns 100 matches; `q=صبر&mode=tafsir&topic=patience` returns 5 matches.
- **Invalid topic**: `q=mercy&topic=nonexistent` shows "One or more filter values were invalid and have been ignored" message; filter is not applied.
- **URL state**: changing the topic filter preserves `q`, `surah`, `juz`, and other filters; clearing the topic filter removes only `topic=` from the URL.

### Limitations (pre-existing, not addressed)

1. **Curated-only matching**: topic filter shows verses a reviewer placed in that topic, not every verse on the theme. Topic pages state their review status.
2. **No topic autocomplete**: users must know the topic slug or browse the dropdown.
3. **No multi-topic filter**: users can select only one topic at a time.
4. **No topic exclusion**: users cannot say "show me everything except patience."
5. **Topic-term expansion is lexical**: searching "patience" does not semantically expand to related concepts; the topic filter is a separate mechanism.
6. **No total count**: search does not publish a total match count (by design, see Sprint 10 report).

### What was NOT fabricated

- No new topic-ayah relationships were invented.
- No scholarly approval or review status was claimed.
- No semantic similarity was presented as direct textual matching.
- No comprehensive coverage was claimed without verifying indexed data.

## 4. Tests and Browser QA Results

### Unit tests (51 new, all passing)

```
✓ src/lib/search/filters.test.ts (51 tests)
  - parseSearchFilters: query parsing (3 tests)
  - parseSearchFilters: surah validation (7 tests)
  - parseSearchFilters: juz validation (5 tests)
  - parseSearchFilters: revelation type validation (3 tests)
  - parseSearchFilters: topic validation (4 tests)
  - parseSearchFilters: language validation (3 tests)
  - parseSearchFilters: edition/mode mutual exclusion (3 tests)
  - parseSearchFilters: hasFilters flag (4 tests)
  - parseSearchFilters: invalidFilters flag (3 tests)
  - passesStructuralFilters: no filters (3 tests)
  - passesStructuralFilters: surah (3 tests)
  - passesStructuralFilters: revelation (3 tests)
  - passesStructuralFilters: topic (2 tests)
  - passesStructuralFilters: combined AND (3 tests)
  - buildFilterUrl: query preservation (1 test)
  - buildFilterUrl: filter preservation (1 test)
  - buildFilterUrl: clear-on-empty (2 tests)
  - buildFilterUrl: edition/mode mutual exclusion (3 tests)
  - buildSearchInUrl: default/tafsir/edition (3 tests)
  - buildSearchInUrl: filter preservation (1 test)
```

### Browser QA (in-app browser)

- **Topic filter selection**: opened `/search?q=mercy`, changed topic dropdown to "Patience", URL updated to `/search?q=mercy&topic=patience`, page showed "1 result after filtering", "Topic: Patience" chip visible.
- **Filter removal**: clicked "Remove Topic: Patience" button, URL updated to `/search?q=mercy`, topic chip disappeared, result count returned to 100.
- **Narrow viewport** (449×563): topic filter dropdown renders correctly, no horizontal overflow, topic chip visible, select value reflects URL state.
- **Invalid topic**: `/search?q=mercy&topic=nonexistent` shows "One or more filter values were invalid and have been ignored" message.
- **URL preservation**: `/search?q=mercy&topic=patience&surah=2` renders both filters active; changing one preserves the other.

### Verified across all three search modes

- Default: `q=mercy&topic=patience` → 1 result (2:153).
- Edition: `q=mercy&edition=en.pickthall&topic=mercy-and-forgiveness` → 2 matches.
- Tafsir: `q=صبر&mode=tafsir&topic=patience` → 5 matches.

## 5. All Verification Gate Results

### Lint
```
> next-template@0.1.0 lint
> eslint .
```
✅ Clean (no errors or warnings) after removing unused destructured variables and unused import.

### Typecheck
```
> next-template@0.1.0 typecheck
> tsc --noEmit
```
✅ Clean (no type errors).

### Tests
```
> next-template@0.1.0 test
> vitest run

 Test Files 17 passed (17)
      Tests 306 passed (306)
```
✅ All 306 tests passed across 17 files (255 prior + 51 new).

### Build
```
> next-template@0.1.0 build
> next build
```
✅ Build succeeded.
- `/search` is dynamic (server-rendered on demand) — correct for search page.
- All topic pages prerendered via `generateStaticParams`.

## 6. Confirmed Defects Versus Pre-existing Limitations

### Confirmed defects (none)

No defects were found in the existing topic filter implementation. The filter logic, UI, URL state, and validation all worked correctly across all three search modes.

### Pre-existing limitations (documented, not addressed)

1. **Curated-only matching**: topic filter shows verses a reviewer placed in that topic, not every verse on the theme.
2. **No multi-topic filter**: users can select only one topic at a time.
3. **No topic exclusion**: users cannot exclude a topic.
4. **No topic autocomplete**: users must know the topic slug or browse the dropdown.
5. **No total count**: search does not publish a total match count (by design).
6. **Topic-term expansion is lexical**: searching "patience" does not semantically expand to related concepts.

These are documented gaps, not regressions. They were present before Sprint 11 and remain after.

## 7. Remaining PRD Gaps and Recommended Next Sprint

### Search-related PRD gaps

1. **No autocomplete**: search does not offer suggestions as users type (significant UX complexity).
2. **No search history**: users cannot revisit previous searches (local-first; no tracking).
3. **No advanced search syntax**: users cannot use operators like "AND", "OR", "NOT" (would require parser).
4. **No fuzzy matching**: misspellings or variant transliterations may not match (would require edit-distance algorithm).
5. **No semantic search integration**: client-side semantic search is separate from server-side lexical search (would require architectural decision).
6. **No multi-topic filter**: users can select only one topic at a time.
7. **No topic exclusion**: users cannot exclude a topic.

### Other PRD gaps (not search-related)

1. **Scholarly review workflow**: no reviewer identity, decision field, or audit trail exists (documented gap from Sprint 7).
2. **Personalization**: no reading history beyond single-item `progress[0]` in `alhuda.library.v1`; personalization would require new tracking and privacy-policy update (documented decision from Sprint 9).
3. **Interfaith dimension**: empty (no verified mappings exist; documented gap).
4. **AI answers**: disabled (no AI-generated religious recommendations; documented decision).

### Recommended next sprint options

**Sprint 12 Option A: Search Autocomplete**
- Add autocomplete suggestions as users type.
- Suggest surah names, topic titles, and common queries.
- Requires new UI component and client-side logic.
- Medium effort, high value for discoverability.

**Sprint 12 Option B: Multi-Topic Filter**
- Allow users to select multiple topics (OR logic) or exclude topics.
- Requires UI changes (checkboxes or multi-select) and filter logic updates.
- Medium effort, moderate value for power users.

**Sprint 12 Option C: Scholarly Review Workflow**
- Implement reviewer identity, decision field, and audit trail.
- Allow topics and dimensions to progress from `pending-scholarly-review` to `approved`.
- Requires data model changes and editorial UI.
- High effort, critical for content governance.

**Sprint 12 Option D: Personalization Architecture**
- Extend local storage to track multi-item reading history.
- Implement deterministic recommendations based on reading patterns.
- Requires privacy-policy update and new storage keys.
- Medium effort, high value for user engagement.

**Recommendation**: Sprint 12 Option A (Search Autocomplete) — highest immediate value for discoverability, builds on Sprint 10's topic chips and Sprint 11's topic filter, and completes the search UX.

---

**Sprint 11 delivered**: Verified and tested the existing topic filter across all three search modes, extracted filter logic into a testable module, added 51 focused unit tests, confirmed behavior via browser QA.

**Sprint 11 did not deliver**: A complete solution to the entire Quran search problem. The search system remains lexical (not semantic), lacks advanced features like autocomplete and search history, and does not publish total match counts. These are documented gaps, not regressions.

**Sprint 12 is not started**.
