# Sprint 12 Report: Search Autocomplete

## Summary

Sprint 12 added deterministic, accessible autocomplete suggestions to the Quran search interface. Suggestions are drawn exclusively from canonical data — surah transliterations, curated topic titles (English and Arabic), and Quran references parsed by the existing reference parser. Every suggestion destination is validated against canonical verse counts, so a suggestion can never point at a verse that does not exist. No search history is stored, no queries are tracked, and no external or AI services are involved.

## 1. Existing Search Form and Reference-Parsing Findings

### SearchBox component (`src/components/search/search-box.tsx`)

- Client component with controlled input state and form-based submission.
- Submits by navigating to `/search?q=…`, preserving active filters when already on `/search`.
- Used on the home page (`/`) and the search page (`/search`) — both empty-state and results-state.
- Prior to Sprint 12: plain `<input type="search">` with no autocomplete, no combobox semantics, no suggestions.

### Reference parser (`src/lib/quran/reference.ts`)

- `parseReference(input)` handles three patterns:
  1. **Numeric surah:ayah** — `2:255`, `2.255`, `2-255`, `2 255` (separator variants).
  2. **Surah-only numeric** — `36`, `1`, `114`.
  3. **Name + optional ayah** — `al-baqarah`, `al-baqarah 255`, `an-nas 6`.
- Name resolution: lowercases, strips apostrophes, replaces non-alphanumerics with hyphens, matches against surah slugs.
- **Documented limitation**: ayah bounds are NOT validated — `2:287` parses successfully even though Al-Baqarah has 286 ayat. Callers must check via `getAyah()` or `ayahCount`. Sprint 12 added this bounds check in the autocomplete engine.

### Canonical data sources

- **Surahs**: 114 entries from `getSurahIndex()` with fields: `id`, `slug`, `transliteration`, `arabicName`, `meaning`, `revelation`, `ayahCount`. No aliases field exists.
- **Topics**: 11 curated entries from `TOPICS` with fields: `slug`, `title`, `arabicTitle`, `summary`, `relations`, `provenance`.
- **URL conventions**: `/quran/[slug]` for surahs, `/ayah/[surah]/[ayah]` for individual verses, `/topics/[slug]` for topics.

## 2. Supported Suggestion Types and Their Data Sources

| Type | Data source | Matching rule | Destination |
|---|---|---|---|
| **Reference** | `parseReference()` + `getSurahIndex()` | Parses as numeric or name-based reference; ayah range-checked against `ayahCount` | `/ayah/[surah]/[ayah]` or `/quran/[slug]` |
| **Surah** | `getSurahIndex()` | Transliteration prefix or substring match (case-insensitive) | `/quran/[slug]` |
| **Topic** | `TOPICS` | English `title` or `arabicTitle` prefix or substring match | `/topics/[slug]` |

### Matching behavior

- **Minimum query length**: 2 characters (after trimming).
- **Ordering**: references first (priority 0), then surahs (priority 1), then topics (priority 2). Alphabetical within each group.
- **De-duplication**: by destination `href`. A query like "al-baqarah" that parses as a surah reference AND prefix-matches the surah name produces a single entry pointing at `/quran/al-baqarah`.
- **Cap**: 10 suggestions maximum.
- **Arabic matching**: topic suggestions match against `arabicTitle` (e.g., "الصبر" matches "Patience"). Surah matching is transliteration-only.

### What is NOT supported (by design)

- No fuzzy matching or typo tolerance.
- No search history or recent queries.
- No popular/trending queries.
- No AI-generated or semantic similarity suggestions.
- No external autocomplete services or network calls beyond the same-origin API.
- No surah Arabic name matching (only transliteration).
- No aliases or alternative surah names.

## 3. Files Created and Modified

### Created

- **`src/lib/search/autocomplete.ts`** (~175 lines)
  - Pure suggestion engine: `getSuggestions(query)` returns `Suggestion[]`.
  - Three matchers: `tryParseReference()`, `matchSurahs()`, `matchTopics()`.
  - Ayah bounds validation against canonical `ayahCount`.
  - Href-based de-duplication.
  - Exports `Suggestion` interface and `SuggestionType` union.

- **`src/lib/search/autocomplete.test.ts`** (35 tests)
  - Empty/short query handling (4 tests).
  - Reference suggestions: numeric, name, separator variants, bounds validation, out-of-range rejection, surah-only (11 tests).
  - Surah suggestions: prefix, substring, case-insensitive, sublabel content, ordering (5 tests).
  - Topic suggestions: English prefix/substring, Arabic title, sublabel, ordering (5 tests).
  - Ordering and de-duplication: priority ordering, href dedupe, no-match empty (3 tests).
  - Deterministic behavior: idempotency, whitespace trimming (2 tests).
  - Structure validation: required fields, href format for each type (5 tests).

- **`src/app/api/v1/search/suggestions/route.ts`**
  - `GET /api/v1/search/suggestions?q=…` — returns `{ suggestions: Suggestion[] }`.
  - Marked `export const dynamic = "force-dynamic"`.
  - Follows the project's `/api/v1/` route convention.

### Modified

- **`src/components/search/search-box.tsx`**
  - Added combobox UI with `<ul role="listbox">` suggestion panel.
  - Debounced (150ms) fetch to `/api/v1/search/suggestions` with abort-controller cleanup.
  - Keyboard navigation: ArrowDown/ArrowUp cycle through suggestions, Enter selects active, Escape closes.
  - `onBlur` closes the panel; `onMouseDown` on list items prevents blur-before-click race.
  - ARIA: `role="combobox"`, `aria-autocomplete="list"`, `aria-controls`, `aria-expanded`, `aria-activedescendant`.
  - Existing form submission and filter-preservation behavior unchanged.

- **`src/lib/search/filters.test.ts`**
  - Fixed 5 stale 2-argument `parseSearchFilters` call sites (carryover from Sprint 11 signature change).

### Deleted

- **`src/app/api/search/`** — old route location removed; replaced by `/api/v1/search/suggestions/`.

## 4. Keyboard and Screen-Reader Interaction Behavior

### Keyboard

| Key | Behavior |
|---|---|
| **ArrowDown** | Moves focus to the next suggestion (wraps to first). |
| **ArrowUp** | Moves focus to the previous suggestion (wraps to last). |
| **Enter** (suggestion active) | Navigates to the active suggestion's destination. |
| **Enter** (no suggestion active) | Submits the free-text query as a normal search. |
| **Escape** | Closes the suggestion panel; input retains its value. |
| **Tab / blur** | Closes the suggestion panel. |

### Screen reader

- Input carries `role="combobox"` with `aria-autocomplete="list"`.
- `aria-expanded` reflects panel open/closed state.
- `aria-activedescendant` points to the currently focused `<li>` by ID.
- Suggestion list carries `role="listbox"` with `aria-label="Search suggestions"`.
- Each suggestion carries `role="option"` with `aria-selected` reflecting active state.
- Suggestion type labels ("Verse", "Surah", "Topic") are rendered as visible text for all users.

### Mouse

- Clicking a suggestion navigates to its destination.
- Hovering a suggestion sets it as active (visual highlight).
- `onMouseDown` prevents the blur-then-click race that would close the panel before selection registers.

## 5. Browser QA Results

### API endpoint QA (curl on localhost:3000)

| Query | Result | Verified |
|---|---|---|
| `q=2:255` | 1 suggestion: `{type: "reference", href: "/ayah/2/255", label: "Al-Baqarah 255"}` | ✅ |
| `q=al-baqarah` | 1 suggestion: `{type: "reference", href: "/quran/al-baqarah"}` (de-duplicated) | ✅ |
| `q=pat` | 1 suggestion: `{type: "topic", href: "/topics/patience", sublabel: "الصبر"}` | ✅ |
| `q=2:287` | Empty (Al-Baqarah has 286 ayat; out-of-range rejected) | ✅ |
| `q=xyz123` | Empty (no matches) | ✅ |
| `q=` (empty) | Empty | ✅ |

### SSR markup QA

| Check | `/search` | `/` (home) | Verified |
|---|---|---|---|
| `role="combobox"` | Present | Present | ✅ |
| `aria-autocomplete="list"` | Present | Present | ✅ |
| `aria-controls="search-suggestions"` | Present | — | ✅ |
| `/api/v1/search/suggestions` reference | Present (client JS) | Present (client JS) | ✅ |

### Interactive browser QA (ZCode in-app browser, localhost:3000)

| Check | Result | Verified |
|---|---|---|
| Suggestions appear on typing ≥2 chars | `al-ba` → 3 surah options rendered, `aria-expanded="true"` | ✅ |
| In-page fetch works | `fetch("/api/v1/search/suggestions?q=al-ba")` → 200, 3 suggestions | ✅ |
| ArrowDown selects first option | `aria-activedescendant="suggestion-0"`, correct option highlighted | ✅ |
| ArrowDown again selects second option | `aria-activedescendant="suggestion-1"` | ✅ |
| ArrowUp wraps back to first option | `aria-activedescendant="suggestion-0"` | ✅ |
| Enter on active suggestion navigates | Typed `al-ba`, ArrowDown, Enter → `/quran/al-balad` | ✅ |
| Escape closes panel without navigating | `aria-expanded="false"`, list removed, URL unchanged | ✅ |
| Free-text submission (no active suggestion) | Typed `mercy`, Enter → `/search?q=mercy` | ✅ |
| Blur (Tab) closes panel | Panel removed, `aria-expanded="false"` | ✅ |
| Mouse click selects a suggestion | Clicked "Al-Baqarah" option → `/quran/al-baqarah` | ✅ |
| Reference suggestion navigation | Typed `2:255`, ArrowDown, Enter → `/ayah/2/255` | ✅ |
| Mobile viewport (375×667) — list stays in viewport | List fits within viewport (left 16px, right 344px, width 328px), scrollable vertically, `max-height: 320px` | ✅ |

**Mobile layout note:** The autocomplete panel does not introduce horizontal overflow — it is constrained to the input's width and stays within the 375px viewport. The search page itself has a pre-existing `documentElement.scrollWidth` of 434px at this viewport (from the wide filter selects and edition picker, present with or without suggestions open), which is unrelated to this sprint and documented as a pre-existing limitation below.

## 6. Test, Lint, Typecheck, and Build Results

| Gate | Result |
|---|---|
| `pnpm lint` | Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | Clean (`tsc --noEmit` — 0 errors) |
| `pnpm test` | **341/341 passed** across 18 test files (35 new autocomplete tests + 306 existing) |
| `pnpm build` | Succeeded; `/search` renders as dynamic, `/api/v1/search/suggestions` as dynamic |

## 7. Remaining Limitations and Recommended Next Sprint

### Known limitations

1. **No Arabic surah name matching** — surah suggestions match only on transliteration. Typing "البقرة" will not suggest Al-Baqarah. Topic Arabic matching works.
2. **No fuzzy matching** — typos produce no suggestions. This is intentional (transparent, rule-based matching).
3. **Network round-trip** — suggestions require a same-origin fetch. The 150ms debounce keeps rapid typing from stacking requests, but adds perceived latency compared to synchronous suggestions. This was necessary because the suggestion engine depends on server-only Quran data (`node:fs`).
4. **No multi-word or partial reference support** — "baqarah 255" works, but "al baqarah" (without hyphen) does not match because the slug is `al-baqarah`.
5. **No suggestion for translation text** — suggestions index surah names, topic titles, and references only, not verse content.
6. **No total count in suggestions** — the panel does not show how many results a query would produce.

### Recommended Sprint 13 options

1. **Search result count preview** — show result counts alongside suggestions so users can gauge specificity before selecting.
2. **Arabic surah name matching** — extend `matchSurahs()` to also check `arabicName`.
3. **Recent searches (local-only)** — store recent queries in `localStorage` and surface them as suggestions when the input is focused but empty.
4. **Search within edition from autocomplete** — allow edition-scoped suggestion queries.
5. **Keyboard shortcut to focus search** — global `/` key to focus the search input from any page.
