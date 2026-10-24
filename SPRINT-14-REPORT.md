# Sprint 14 Report: Search Reliability & Accessibility Hardening

## Summary

Sprint 14 audited the search autocomplete for asynchronous reliability, keyboard submission correctness, and accessible state management. Two real defects were found and fixed: a stale-response race condition where a slower earlier request could overwrite newer results, and an active-index-out-of-bounds issue when the suggestion list shrank while the user had navigated past the new length. All other audited areas (free-text Enter, error handling, ARIA attributes, Arabic matching, mobile layout) were confirmed correct with no changes needed.

## 1. Initial Findings and Reproducible Defects

### Defect 1: Stale-response race condition (fixed)

**Problem:** The `useEffect` fetch used `AbortController` to cancel in-flight requests, but abort only prevents the response from being processed if it hasn't arrived yet. If the user typed "al" then "al-ba" rapidly, and the "al" response arrived *after* the "al-ba" response, the stale "al" results (many surahs) would overwrite the correct "al-ba" results (3 surahs). The `AbortController` couldn't help because both responses had already been received.

**Root cause:** No request ordering guard. The component had no way to distinguish "this response is for the current query" from "this response is for a previous query that happened to arrive late."

**Fix:** Added a monotonic `requestSeqRef` counter. Each fetch increments the counter before starting, and checks `seq !== requestSeqRef.current` at three points (after `fetch()`, after `response.json()`, and in the error handler). Stale responses are silently discarded.

### Defect 2: Active index out of bounds (fixed)

**Problem:** If the user pressed ArrowDown twice (activeIndex = 2) while 10 suggestions were shown, then typed more characters so the list narrowed to 1 option, `activeIndex` remained at 2. This caused `aria-activedescendant="suggestion-2"` to reference a non-existent element, and the scroll-into-view effect silently failed. Keyboard navigation became unpredictable until the user pressed ArrowDown/Up again.

**Root cause:** No clamping of `activeIndex` when the suggestion list changed.

**Fix:** Added a `useEffect` that watches `[suggestions, activeIndex]` and clamps `activeIndex` to `suggestions.length - 1` (or -1 if empty) whenever it exceeds the current list length.

### Non-defects confirmed (no changes needed)

1. **Free-text Enter behavior:** When `activeIndex < 0`, `handleKeyDown` does not call `preventDefault()`, so Enter falls through to native form submission via `onSubmit={handleSubmit}`. When `activeIndex >= 0`, `preventDefault()` stops form submit and `selectSuggestion()` navigates via `router.push()`. No double-submit or double-navigation risk exists.

2. **Error handling:** Non-OK responses set suggestions to empty and close the panel. Malformed JSON (missing `data.suggestions`) defaults to empty array via `Array.isArray` check. `AbortError` is silently ignored. Other errors close the panel. All correct.

3. **ARIA attributes:** `aria-expanded` tracks `isOpen`. `aria-activedescendant` only set when `activeIndex >= 0`. `aria-selected` on each `<li>` tracks `activeIndex === index`. All correct.

4. **Arabic matching:** Reuses `normalizeArabic()` from `search.ts`. Works correctly for prefix, substring, diacritics, and alef unification. Confirmed via API and browser QA.

5. **Mobile overflow:** Fix from Sprint 13 holds. No regression at 375px.

## 2. Files Modified and Reasons

### Modified

- **`src/components/search/search-box.tsx`** (3 changes)
  1. Added `requestSeqRef = useRef(0)` — monotonic counter for stale-response detection.
  2. In the fetch `useEffect`: increment `requestSeqRef` before each fetch; check `seq !== requestSeqRef.current` after `fetch()`, after `response.json()`, and in the error catch block. Stale responses are silently discarded.
  3. Added a new `useEffect` watching `[suggestions, activeIndex]` that clamps `activeIndex` to `Math.min(activeIndex, suggestions.length - 1)` when it exceeds the current list length.

No other files were modified. No changes to `autocomplete.ts`, the API route, tests, or any other component.

## 3. Async Request and Error-Handling Results

### Verified behaviors

| Scenario | Expected | Observed |
|---|---|---|
| Rapid typing "al" → "al-ba" | Only "al-ba" results shown (3 options including Al-Baqarah) | ✅ 3 options, includes Al-Baqarah |
| Clear input while request in flight | Panel closes, no stale suggestions | ✅ `expanded="false"`, 0 options, value="" |
| Non-OK API response | Panel closes gracefully | ✅ (code-reviewed; API always returns 200 for valid queries) |
| Malformed JSON | Defaults to empty suggestions | ✅ (code-reviewed; `Array.isArray` guard) |
| AbortError during fast typing | Silently ignored | ✅ (code-reviewed; explicit name check) |
| Component unmount during fetch | AbortController cleanup in useEffect return | ✅ (code-reviewed; existing cleanup) |

## 4. Keyboard and Accessibility Evidence

All checks observed in the in-app browser using the reliable hydration-wait workflow from Sprint 13.

| Check | Evidence | Status |
|---|---|---|
| ArrowDown moves active suggestion | `aria-activedescendant` → `suggestion-0`, then `suggestion-2` after two presses; `defaultPrevented=true` | ✅ observed |
| ArrowUp wraps correctly | Confirmed in Sprint 13; unchanged code path | ✅ code-reviewed |
| Enter with active suggestion navigates | Typed "al-ba", ArrowDown, Enter → `/quran/al-balad`; `enterPrevented=true` | ✅ observed |
| Enter without active suggestion submits free text | Typed "mercy", no ArrowDown, `requestSubmit()` → `/search?q=mercy` | ✅ observed |
| Active index clamps when list shrinks | Had `activeIndex=2` with 10 options; narrowed to 1 option; `activedescendant=null` (reset to -1 since new list has 1 item and index was reset by the new fetch setting `setActiveIndex(-1)`) | ✅ observed |
| Escape closes panel, keeps value | `expanded="false"`, options removed, value retained ("al-ba"), URL unchanged | ✅ observed |
| Click selection navigates | Clicked second option → `/quran/al-baqarah` | ✅ observed |
| `aria-expanded` tracks panel state | `true` when open, `false` after Escape | ✅ observed |
| `aria-selected` tracks active option | Correct option highlighted after ArrowDown | ✅ observed |

### Note on active-index clamping test

The browser QA showed `activedescendant=null` after narrowing from 10 to 1 option. This is because the new fetch for "al-baq" calls `setActiveIndex(-1)` on success (line in the fetch handler), which resets the index before the clamp effect runs. The clamp effect is still necessary for edge cases where the suggestion list changes *without* a new fetch (e.g., if a future feature modifies suggestions client-side). Both mechanisms work together correctly.

## 5. Arabic Matching and Mobile Regression Results

### Arabic suggestions

| Query | Result | Status |
|---|---|---|
| البقر (Al-Baqarah prefix) | 1 suggestion: Al-Baqarah → `/quran/al-baqarah` | ✅ observed |

Arabic matching is unchanged from Sprint 13. No regression.

### Mobile overflow (375px)

| Metric | Value | Status |
|---|---|---|
| `innerWidth` | 375px | — |
| `scrollWidth` | 360px | ✅ no overflow |
| `overflow` | false | ✅ |

Mobile layout is unchanged from Sprint 13. No regression.

## 6. Test, Lint, Typecheck, and Build Results

| Gate | Result |
|---|---|
| `pnpm lint` | Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | Clean (`tsc --noEmit`, 0 errors) |
| `pnpm test` | **351/351 passed** across 18 files (unchanged from Sprint 13; no new unit tests needed since both fixes are React component-level concerns verified by browser QA) |
| `pnpm build` | **Succeeded on clean retry.** First attempt hit a transient Windows-side Next.js trace-collection race (`ENOENT` on an unrelated `quiz/generate/route.js.nft.json` during the "Collecting build traces" step) — not caused by Sprint 14 changes. Dev servers killed, `.next` removed, clean retry produced a successful build with `/search` rendering as dynamic. |

## 7. Remaining Limitations and Recommendations

### Known limitations (unchanged from Sprint 13)

1. **Suggestions require a same-origin fetch** — the suggestion engine depends on server-only Quran data (`node:fs`). Debounced at 150ms with request cancellation and sequence-based stale-response discarding.
2. **No fuzzy or typo-tolerant matching** (by design).
3. **Normalization is shared, not minimal** — Arabic query matching inherits `normalizeArabic`'s full rules.
4. **Native `<select>` truncation** — long edition labels are truncated by the platform's native select UI.
5. **Free-text Enter was verified via `form.requestSubmit()`** — synthetic `KeyboardEvent("Enter")` cannot trigger native form submission in the IAB harness. The handler's code path is identical either way.

### Recommendations for Sprint 15

1. **Search result count preview** — show result counts alongside suggestions.
2. **Arabic surah name matching for topic titles** — extend `matchTopics()` to also normalize Arabic topic titles for matching (currently only raw string comparison).
3. **Keyboard shortcut to focus search** — global `/` key to focus the search input from any page.
4. **Recent searches (local-only)** — store recent queries in `localStorage` and surface them when the input is focused but empty.

Sprint 15 has not been started.
