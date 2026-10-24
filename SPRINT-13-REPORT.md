# Sprint 13 Report: Arabic Surah Search & Mobile Search Layout Fix

## Summary

Sprint 13 added Arabic surah-name matching to the search autocomplete and fixed the pre-existing mobile horizontal overflow on `/search`. Arabic matching reuses the project's existing `normalizeArabic()` utility — no second normalization implementation was introduced. The mobile overflow root cause was the empty-state edition search form: an input with a 192px minimum width plus an unconstrained `<select>` carrying long option labels. After the fix, there is no page-level horizontal overflow at 320px, 375px, or 430px viewports, and the autocomplete panel stays exactly the width of the search form.

## 1. Findings and Root Causes

### Arabic matching gap

- `matchSurahs()` in `src/lib/search/autocomplete.ts` matched only the Latin `transliteration` field. The canonical `SurahMeta.arabicName` field (e.g. "البقرة") was never consulted.
- A reusable normalization utility already exists: `normalizeArabic()` exported from `src/lib/quran/search.ts`. It is used by the main Quran search engine and its semantics are pinned by `search.test.ts` (normalization is for matching only; displayed text is never altered).
- No aliases exist in the surah index and none were invented.

### Mobile overflow root cause

Inspected the rendered layout and the source of `/search` (empty state), `search-filters.tsx`, and the layout wrapper:

1. **Root cause — the edition search form** (`src/app/search/page.tsx`, empty-state "Search in a specific edition" card):
   - The text input had `min-w-[12rem]` (192px floor) plus `flex-1`.
   - The edition `<select>` had **no width constraint** (`w-full`/`min-w-0`/`max-w-*` all absent) while carrying option labels like "Indonesian — Indonesian Ministry of Religious Affairs". A native `<select>` sizes to its longest option's intrinsic width.
   - Inside the `flex flex-wrap` row, the input's 192px floor plus the select's content-driven width pushed the row's intrinsic minimum width past the viewport at narrow widths, producing the ~434px `scrollWidth` recorded in Sprint 12 at a 375px viewport.
2. **Not the cause:**
   - The `SearchFilters` grid (`grid-cols-1` on mobile; every select inside already `w-full`).
   - The autocomplete panel (absolutely positioned `left-0 right-0` inside the form — it inherits the form's width).
   - No `whitespace-nowrap` or `flex-nowrap` exists anywhere in the search area.
   - No `overflow-x: hidden` exists anywhere in the layout chain, so any oversized child produces page scroll — which is why the fix had to address the root cause rather than mask it.

## 2. Files Created or Modified

### Modified

- **`src/lib/search/autocomplete.ts`**
  - Imported `normalizeArabic` from `@/lib/quran/search` (reuse, not reimplementation).
  - Added `HAS_ARABIC` regex (`/[\u0600-\u06FF]/`) to detect Arabic-script queries.
  - Extended `matchSurahs()`: when the query contains Arabic script, each surah's normalized `arabicName` is checked for prefix/substring match against the normalized query, alongside the unchanged transliteration matching. Prefix hits rank above substring hits, as before.

- **`src/lib/search/autocomplete.test.ts`**
  - Added 10 tests in a new `Arabic surah name suggestions` describe block (details in §5).

- **`src/app/search/page.tsx`** (edition search form only)
  - Input: `min-w-[12rem] flex-1` → `min-w-0 w-full sm:min-w-[12rem] sm:w-auto sm:flex-1`.
  - Select: added `min-w-0 max-w-full w-full sm:w-auto`.
  - Button: added `w-full sm:w-auto`.
  - Desktop (≥640px) reproduces the previous row layout exactly; mobile stacks full-width controls that can never exceed the viewport.

No files were created or deleted. No changes to Quran text, translations, tafsir, topic–ayah mappings, review statuses, licensing, the search API contract, or `AI_ANSWER_FEATURE_ENABLED` (remains disabled).

## 3. Arabic Matching and Normalization Behavior

### Reused normalization

`normalizeArabic()` from `src/lib/quran/search.ts` is applied to **both** the query and each `arabicName` at match time:

| Step | Effect |
|---|---|
| NFC normalization | Canonical Unicode composition |
| Strip `[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]` | Harakat, superscript alef, Quranic annotation marks, tatweel |
| `[\u0622\u0623\u0625\u0671]` → `\u0627` | All alef variants unify onto plain alef |
| `\u0649` → `\u064A` | Alef maqsura → ya |
| `\u0629` → `\u0647` | Ta marbuta → ha |

### Matching rules

- A surah matches if its transliteration matches the (lowercased) query **or** — when the query contains Arabic script — its normalized Arabic name matches the normalized query.
- Prefix matches rank before substring matches; each group is sorted alphabetically by the displayed label.
- The displayed suggestion label remains the canonical transliteration; `arabicName` is read-only and never mutated or displayed differently.
- All existing behavior is preserved: reference suggestions with ayah bounds validation, priority ordering (reference 0 > surah 1 > topic 2), href de-duplication, the 10-suggestion cap, the 2-character minimum, and deterministic ordering.
- Latin queries are byte-for-byte unaffected: the Arabic branch only activates when the query contains Arabic script.
- No Arabic aliases were invented; matching runs strictly against the canonical `arabicName` values from `getSurahIndex()`.

## 4. Mobile Overflow Measurements (Before / After)

Measured as `documentElement.scrollWidth` vs `window.innerWidth` in the in-app browser on `http://localhost:3000/search`, with the panel closed, with the panel open (10 options), and scrolled to the edition section.

| Viewport | Before (Sprint 12) | After (Sprint 13) | Page-level overflow |
|---|---|---|---|
| 320px | not measured (pre-existing issue was recorded only at 375px) | scrollWidth 305px | **none** |
| 375px | **≈434px** scrollWidth (overflow) | scrollWidth 360px | **none** |
| 430px | not measured | scrollWidth 415px | **none** |

Autocomplete panel containment after the fix (panel open, 10 options):

| Viewport | Panel left | Panel right | Panel width | = form width | Within viewport |
|---|---|---|---|---|---|
| 320px | 16px | 288.7px | 272.7px | yes | yes |
| 375px | 16px | 344px | 328px | yes | yes |
| 430px | 16px | 398.7px | 382.7px | yes | yes |

The measurements are identical with the panel open vs closed and in the edition section vs the top of the page, confirming the fix removed the only overflow source rather than relocating it. No global `overflow-x: hidden` was added; the desktop layout (≥640px) retains the original single-row form.

## 5. Tests Added and Verification Results

### New tests (10, in `src/lib/search/autocomplete.test.ts` → `Arabic surah name suggestions`)

All Arabic literals use actual canonical names from the surah index (expressed as `\u` escapes so they survive source encoding):

1. Arabic-name prefix matching — "البقر" → Al-Baqarah, href `/quran/al-baqarah`.
2. Arabic-name substring matching — "بقرة" (without leading ال) → Al-Baqarah.
3. Diacritics stripped from the query — "البَقَرة" with fathas still matches.
4. Alef variant unification — "انعام" (plain alef) matches canonical "الأنعام" (hamza-above alef) → `/quran/al-anam`.
5. Duplicate prevention — a query matching a surah yields at most one entry per href.
6. Canonical destinations for Arabic queries — "الفاتحة" → `/quran/al-fatihah`.
7. Multiple surahs from a short Arabic prefix — "ال" yields >1 surah, total capped at 10.
8. Existing transliteration matching unchanged — "al-ba" still yields Al-Balad/Al-Baqarah/Al-Bayyinah.
9. Reference priority unchanged — "2:255" still yields the reference suggestion first at `/ayah/2/255`.
10. Unmatched Arabic queries are safe — gibberish Arabic yields zero surah suggestions.

One test premise was corrected during development: the original alef-unification test used "إلى", which normalizes to a string that is not a substring of any canonical surah name; it was replaced with the Al-An'am case above, whose premise is grounded in the actual dataset.

### Verification gates

| Gate | Result |
|---|---|
| `pnpm lint` | Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | Clean (`tsc --noEmit`, 0 errors) |
| `pnpm test` | **351/351 passed** across 18 files (45 autocomplete tests: 35 prior + 10 new) |
| `pnpm build` | Succeeded — run with the dev server stopped and a clean `.next` (the documented dev/build corruption hazard) |

## 6. Browser QA Evidence

### Suggestions API (curl against the live dev server, URL-encoded Arabic)

| Query | Response | Status |
|---|---|---|
| `البقر` (Al-Baqarah prefix) | 1 surah suggestion: Al-Baqarah → `/quran/al-baqarah` | ✅ |
| `انعام` (plain alef; canonical is الأنعام) | 1 surah suggestion: Al-An'am → `/quran/al-anam` | ✅ |
| `بقرة` (substring) | 1 surah suggestion: Al-Baqarah → `/quran/al-baqarah` | ✅ |
| `al-ba` (Latin, unchanged) | 3 surahs: Al-Balad, Al-Baqarah, Al-Bayyinah | ✅ |

### Interactive desktop QA (in-app browser, localhost:3000)

Every check below was observed in the browser using the reliable workflow established this sprint: fresh navigation, ~3.5s hydration wait, then fill + poll until the panel renders.

| Check | Evidence | Status |
|---|---|---|
| Suggestions appear when typing | "al-ba" → 3 options, `aria-expanded="true"` | ✅ observed |
| Arabic suggestions on `/search` | Fresh page, "البقر" → exactly 1 option (Al-Baqarah · The Cow · 286 ayat), `expanded="true"` | ✅ observed |
| Arabic suggestions on `/` (home) | "الفاتحة" → 1 option (Al-Fatihah · The Opener · 7 ayat), `expanded="true"` | ✅ observed |
| ArrowDown updates active suggestion | `aria-activedescendant` → `suggestion-0`, `aria-selected="true"` on Al-Balad; `defaultPrevented=true` | ✅ observed |
| ArrowDown again | `aria-activedescendant` → `suggestion-1` (Al-Baqarah selected) | ✅ observed |
| ArrowUp | back to `suggestion-0` | ✅ observed |
| Enter selects active suggestion | navigated to `/quran/al-balad` | ✅ observed |
| Escape closes without navigating | `expanded="false"`, options removed, input retains "al-ba", URL unchanged | ✅ observed |
| Enter with no active suggestion submits free text | `form.requestSubmit()` (same onSubmit handler) → `/search?q=mercy` | ⚠️ observed via requestSubmit — see limitations |
| Click a suggestion navigates | clicked second option → `/quran/al-baqarah` | ✅ observed |
| Screen-reader attributes update | `aria-expanded`, `aria-activedescendant`, `aria-selected` all tracked live state in every check above | ✅ observed |

### Mobile QA

See §4 — overflow measurements at 320/375/430px with the panel open and closed, plus panel containment.

### QA limitations (reported honestly)

1. **Free-text Enter** was verified through `form.requestSubmit()`, which invokes the exact React `onSubmit` handler a real Enter press triggers. Synthetic `KeyboardEvent("Enter")` dispatch cannot trigger native form submission in this harness, so a literal keypress-to-navigation path for free text was not observed. The handler's code path is identical either way, and `handleSubmit` is unchanged from Sprint 11/12 behavior.
2. **One stale-read during the desktop run:** the Arabic-fill step's first capture was taken immediately after the Latin step and briefly showed the previous query's options; a clean re-check on a fresh page load (documented above) superseded it. The API responses for the same Arabic queries were independently correct throughout.
3. Sprint 12's hydration race was fully avoided this sprint by the long post-navigation hydration wait; no check was marked as verified without the panel actually rendering.

## 7. Remaining Known Issues

1. **Suggestions still require a same-origin fetch** — the suggestion engine depends on server-only Quran data (`node:fs`), so local-in-page suggestions are not possible without an API route. Debounced at 150ms with request cancellation.
2. **No fuzzy or typo-tolerant matching** (by design — matching stays transparent and rule-based).
3. **Normalization is shared, not minimal** — Arabic query matching inherits `normalizeArabic`'s full rules (including ta marbuta → ha), applied symmetrically to query and names. This is consistent with the main search engine, but a user typing a name with different letter forms than the canonical dataset relies on those unifications.
4. **Native `<select>` truncation** — long edition labels are still truncated by the platform's native select UI; the fix guarantees they can no longer force the page wider than the viewport.
5. **Filter selects on results pages** were never the overflow source and were intentionally left untouched to avoid unrelated churn.

Sprint 14 has not been started.
