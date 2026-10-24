# Sprint 17 Report: Global Search Shortcut & Discoverability

## Summary

Sprint 17 added a global `/` keyboard shortcut that focuses the most appropriate visible search input on the page, or navigates to `/search` when none is present. The implementation is a single pure hook (`useSearchShortcut`) plus a renderless client component (`GlobalSearchShortcut`) installed once in the root layout, together with a `data-search-box` marker and a visually-subtle `<kbd>/</kbd>` hint on the existing `SearchBox`. No search behavior, autocomplete logic, Quran content, or licensing state was changed.

## 1. Existing Search Architecture

Inspected before any changes:

- **`SearchBox` only exists on `/` and `/search`** — it is not in the persistent site header or mobile bottom nav. On any other route there is no search input in the DOM at all.
- **`SiteHeader` and `MobileBottomNav` are both server components (or thin link lists)** and carry no keyboard shortcut handling.
- **Only one global `keydown` listener existed** before this sprint: `Cmd/Ctrl+B` in `src/components/ui/sidebar.tsx`. The new hook follows the same pattern.
- **No `<kbd>` styling existed** in the design system. A hint element was added inline, styled as a small bordered mono badge consistent with the existing pill/badge conventions.
- **`SearchBox` already owns ArrowUp/ArrowDown/Enter/Escape** when its suggestion panel is open; the new shortcut operates on a different code path (bare `/` with no modifier, at the `window` level), so there is no overlap.
- **Many editable targets to guard against** across the app: inputs in report/settings/reading-plans/revision/quiz, textareas in report and ayah-card notes, selects in search-filters and settings, and the `SearchBox`'s own `role="combobox"` input.

## 2. Shortcut Implementation and Focus-Selection Logic

### New file: `src/hooks/use-search-shortcut.ts`

A `"use client"` React hook with three exported pure helpers and one hook:

- **`isEditableTarget(target)`** — returns `true` for `INPUT`, `TEXTAREA`, `SELECT`, `contentEditable`, or ARIA roles `combobox`, `textbox`, `searchbox`, `spinbutton`. Returns `false` for null, non-element targets, and plain divs.
- **`findVisibleSearchInput(root)`** — returns the first enabled, visible `[data-search-box]` input, or null. Uses `offsetParent === null` to detect hidden elements.
- **`isModalOpen(root)`** — returns true when any Radix overlay selector is present: `[data-radix-dialog-content]`, `[data-radix-alert-dialog-content]`, `[data-radix-sheet-content]`, `[data-radix-popover-content]`, `[data-radix-dropdown-menu-content]`, or `[role='dialog']:not([aria-hidden='true'])`.
- **`useSearchShortcut({ navigate, searchUrl })`** — installs a single `window` `keydown` listener with proper cleanup.

**Guard rules, in evaluation order:**

1. Key must be exactly `/` with no `Meta`, `Ctrl`, or `Alt` modifier.
2. Event must not have already been `defaultPrevented`.
3. Target must not be an editable element.
4. No Radix overlay or dialog-like element may be open.
5. `preventDefault()` is called **before** any focus or navigation, so a literal `/` is never inserted into the focused field.

**Focus selection:**

1. If a visible, enabled `[data-search-box]` input exists, focus it and call `input.select()` so typing immediately replaces any existing text (matches browser-omnibox behavior).
2. Otherwise call `navigate(searchUrl)` (default `/search`).

**Listener lifecycle:**

- The handler is memoized via `useCallback` with an empty dependency array.
- The latest `navigate` callback and `searchUrl` are kept in `useRef`s that are updated in a separate `useEffect`, so the listener is never reinstalled when the caller's closure identity changes. Verified by unit test (three re-renders with new navigate closures produce no new `addEventListener` calls).
- React StrictMode mount/unmount/remount cycles leave exactly one live listener. Verified by unit test.

### New file: `src/components/search/global-search-shortcut.tsx`

A renderless `"use client"` component. Uses `next/navigation`'s `useRouter` and passes a `useCallback`-wrapped `router.push` as the `navigate` callback. Returns `null` (renders nothing).

### Modified: `src/components/search/search-box.tsx`

Two surgical changes:

- Added `data-search-box=""` and `aria-describedby="search-shortcut-hint"` to the `<input>`.
- Added an inline `<kbd id="search-shortcut-hint">/</kbd>` element positioned inside the input's existing right padding (between the Search icon and the submit button), with `aria-label="Press slash to focus search"`.

The kbd hint uses `hidden sm:inline-flex` — hidden on small viewports (mobile/touch users don't need a hint advertising a physical keyboard they may not have), visible at `sm:` (≥640px). Screen readers still announce it via `aria-describedby` on any viewport.

### Modified: `src/app/layout.tsx`

Added `import { GlobalSearchShortcut } from "@/components/search/global-search-shortcut"` and rendered `<GlobalSearchShortcut />` inside the provider tree as a sibling of `<MobileBottomNav />` and `<Toaster />` — once per session, persisting across route navigations.

## 3. Accessibility Decisions

- **`<kbd>` hint is hidden on mobile** (`hidden sm:inline-flex`). On touch-only viewports, displaying a keyboard shortcut would mislead users into thinking a physical keyboard is required. The hint element remains in the DOM so `aria-describedby` still surfaces the shortcut to screen readers on any viewport.
- **`aria-describedby`** links the search input to the hint's `aria-label="Press slash to focus search"` — screen reader users hear the shortcut; screen reader users on mobile hear it too but can safely ignore it.
- **No focus stealing on page load.** The hook only runs on keydown events; it does not call `focus()` during mount. The existing `autoFocus` behavior on `/search` is unchanged.
- **`input.select()` after focus** means a user who already has text in the search box can start fresh immediately.
- **Dialog/sheet/popover guard** prevents the shortcut from stealing focus from an open modal. Uses the canonical Radix `data-radix-*-content` attributes plus `[role='dialog']` for any non-Radix modal.
- **Modifier keys respected.** `Cmd+/`, `Ctrl+/`, `Alt+/` all pass through — important because browser and OS shortcuts (e.g., `Cmd+/` for "toggle comment" in dev tools) must not be intercepted.

## 4. Tests Added

**New file: `src/hooks/use-search-shortcut.test.ts` — 27 tests across 4 describe blocks** (all using `@vitest-environment jsdom`):

`isEditableTarget` (5 tests):
- null/non-element targets return false
- INPUT/TEXTAREA/SELECT return true
- contentEditable returns true
- combobox/textbox/searchbox/spinbutton roles return true
- plain divs/buttons/anchors return false

`findVisibleSearchInput` (3 tests):
- null when no marker
- returns first visible, enabled `[data-search-box]`
- skips hidden inputs (offsetParent null)

`isModalOpen` (4 tests):
- false with no overlay
- true for each Radix overlay selector (5 of them)
- true for `role=dialog` without `aria-hidden`
- false for `role=dialog` with `aria-hidden="true"`

`useSearchShortcut` (17 tests):
- Focuses visible `[data-search-box]` on bare slash
- Calls `navigate('/search')` when no search input is on the page
- Honors custom `searchUrl`
- Does nothing when focus is in INPUT/TEXTAREA/SELECT/contentEditable/combobox
- Does nothing when Meta/Ctrl/Alt is held
- Does nothing when Radix dialog or sheet is open
- Ignores non-slash keys (a, ?, Escape)
- Calls `input.select()` after focusing
- Removes listener on unmount (no duplicates)
- Keeps exactly one live listener across StrictMode mount/unmount/remount
- Does not reinstall the listener when navigate callback identity changes
- Uses the latest navigate callback after re-renders

All 27 tests exercise the real code paths (jsdom + React Testing Library `render`), not mocks of the hook internals.

## 5. Browser QA Evidence

In-app browser, 1280×720 desktop unless noted. Each check below is the result of a live browser interaction on `localhost:3000`.

| Check | Observation | Status |
|---|---|---|
| **A. Home page:** `/` focuses the on-page SearchBox | `preventDefault()=true`, `activeElement` is the `[data-search-box]` INPUT, URL stays at `/` | ✅ observed |
| **A. Kbd hint on desktop** | `#search-shortcut-hint` exists, `display: inline-flex`, `aria-label="Press slash to focus search"`, text `/` | ✅ observed |
| **B. Topic page (no SearchBox):** `/` navigates to `/search` | `[data-search-box]` absent, `preventDefault()=true`, URL becomes `/search` | ✅ observed |
| **C. `/search` with pre-filled query:** `/` refocuses without inserting `/` | Input value was `"mercy"` before slash; remained `"mercy"` after slash; `preventDefault()=true` | ✅ observed |
| **D. Report page textarea:** `/` does not fire | Focus stays in TEXTAREA, `preventDefault()=false`, textarea value empty, URL unchanged | ✅ observed |
| **E. SearchBox combobox itself:** `/` does not fire | Focus stays in the SearchBox INPUT, `preventDefault()=false`, value unchanged | ✅ observed |
| **F. Autocomplete regression:** typing after `/` focus still works | Typed `al-ba` into the slash-focused input → 3 suggestions rendered (Al-Balad, Al-Baqarah, Al-Bayyinah) | ✅ observed |
| **G. Mobile 375px:** kbd hint hidden, no overflow | Hint exists with `display: none`; `scrollWidth=360`, `innerWidth=375`, `overflow: false` | ✅ observed |
| **H. Surah page (no SearchBox):** `/` navigates to `/search` | `[data-search-box]` absent, `preventDefault()=true`, URL becomes `/search` | ✅ observed |

## 6. Verification Gate Results

| Gate | Result |
|---|---|
| `pnpm lint` | Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | Clean (`tsc --noEmit`, 0 errors) |
| `pnpm test` | **386/386 passed** across 21 files (359 prior + 27 new shortcut tests) |
| `pnpm build` | Succeeded — `/` renders as static, `/search` as dynamic, all topic/dimension/quran routes pre-rendered as before |

## 7. Remaining Limitations and Recommended Sprint 18 Priorities

### Limitations of this sprint's implementation

1. **Shortcut only fires on bare `/`.** Some users expect `Cmd+K` / `Ctrl+K` (the now-conventional "command palette" shortcut). The current implementation deliberately does not bind those — the project has no command palette, and adding one is out of scope. A future sprint could add `Cmd/Ctrl+K` as a parallel binding if a command-palette UI is built.
2. **Hint is desktop-only (`sm:` and up).** Touch-only users have no visible indicator that the shortcut exists. The existing mobile bottom nav already has a Search tab linking to `/search`, so discoverability is preserved through that path.
3. **SearchBox must be mounted for focus-to-work.** On pages without a SearchBox (most of the app: surah pages, topic pages, ayah pages, explore pages), the shortcut navigates away to `/search` rather than focusing in place. A future sprint could render a persistent SearchBox in the site header (desktop only) to make the shortcut always focus-in-place; that would be a reader redesign and was intentionally out of scope here.
4. **No focus ring enhancement.** The existing `focus-visible:outline-2 focus-visible:outline-ring` class is unchanged. If screen-reader or keyboard users report difficulty seeing the focused input, a future sprint could add a stronger focus indicator.

### What Sprint 17 did not change

- Quran text, translations, tafsir, citations, or scholarly-review status.
- Existing search filters, URL query parameters, or active-filter preservation.
- Request cancellation, stale-response protection, or active-index clamping (Sprint 14).
- Arabic surah-name autocomplete, ayah-bound validation, href de-duplication (Sprints 12–13).
- Mobile overflow fix from Sprint 13.
- Word-by-word study UI from Sprint 16.
- Theme redirect and root-unavailable pages from Sprint 15.
- `AI_ANSWER_FEATURE_ENABLED` (remains disabled).
- Licensing, analytics, accounts, persistent storage.

### Recommended Sprint 18 priorities

1. **Result-count preview in suggestions** — show how many matches each suggestion would produce. Builds on Sprint 12–14's autocomplete. Medium effort, high discoverability value.
2. **Persistent SearchBox in the site header** — desktop-only; would let the `/` shortcut always focus-in-place instead of navigating. Requires site-header to become (or embed) a client component. Medium effort.
3. **Topic catalog expansion** — 11 topics is thin. Adding curated topics with the existing provenance framework would enrich `/explore`, `/discover`, and the knowledge graph.
4. **Word-by-word study UI enhancements** — Sprint 16 added the panel; a follow-up could add word selection, cross-reference lookup on selected words, and integration with the existing cross-reference panel.
5. **Validated morphology integration research** — prerequisite for any real `/explore/root/[root]` work. Pure research sprint to identify a suitable licensed dataset.

Sprint 18 is not started.
