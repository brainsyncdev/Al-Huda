# Sprint 23 Report — Reader Control Touch Targets & TranslationSelector Reliability

**Branch:** main
**Date:** 2026-10-25
**Scope:** Fix undersized reader text-size controls and diagnose the TranslationSelector hydration anomaly documented in Sprint 22.

---

## §1. Root-Cause Investigation and Evidence

### TranslationSelector "Loading…" Anomaly

**Symptom (Sprint 22):** TranslationSelector rendered its `!hydrated` fallback ("Loading…") indefinitely on `/settings` and `/quran/al-baqarah`, despite other `usePrefs()` consumers on the same page working correctly.

**Root cause identified:** The dev server's `.next` cache was corrupted. All `_next/static/chunks/*.js` requests returned HTTP 404, preventing React from loading and hydrating. The `window.next` global was `null`, `body` display was `block` (not `flex` — the CSS hadn't loaded either), and no client-side JavaScript executed.

**Evidence chain:**

| Observation | Value | Source |
|-------------|-------|--------|
| `window.next` | `null` | `evaluate()` on `/settings` |
| `body` computed display | `block` (should be `flex`) | `evaluate()` |
| `_next/static/chunks/webpack.js` | HTTP 404 | `curl` |
| `_next/static/chunks/main-app.js` | HTTP 404 | `curl` |
| Dev server log | Repeated 404s for all chunk requests | `/tmp/dev-sprint20.log` |
| `usePrefs().hydrated` for other consumers | `true` (checkboxes, size buttons worked) | `evaluate()` |

**Fix:** Killed the corrupted dev server (PID 10836), ran `rm -rf .next`, restarted `next dev -p 3000`. After restart, all chunks returned HTTP 200 with `text/javascript` content type, `window.next.version` reported `"15.3.8"`, and TranslationSelector hydrated correctly on both `/settings` and `/quran/al-fatihah`.

**Conclusion:** This was an environmental issue (corrupted dev server cache), not a code defect. The TranslationSelector source code is correct.

### Reader Text-Size Buttons at 21px

**Symptom (Sprint 22):** Size buttons measured 21px tall via `getBoundingClientRect()`.

**Root cause:** The button classes were `min-w-9 rounded-full px-2.5 py-1` — the `py-1` (4px vertical padding) plus text height produced only 21px total height.

**Fix:** Changed to `min-h-[44px] min-w-[44px] rounded-full px-2.5` with `inline-flex items-center justify-center` for vertical centering.

**Before/after (browser-measured):**

| Button | Before (w×h) | After (w×h) |
|--------|-------------|-------------|
| S | 25×21 | 44×44 |
| M | 27×21 | 44×44 |
| L | 23×21 | 44×44 |
| XL | 32×21 | 44×44 |

**Overlap check:** No adjacent buttons overlap after the fix (verified via bounding-box intersection test in browser on both `/settings` and `/quran/al-fatihah`).

---

## §2. Reader-Control Dimensions Before and After

Measured via `getBoundingClientRect()` in the ZCode in-app browser:

**Before (Sprint 22 measurement on `/quran/al-fatihah`):**
```
S:  25×21px   aria-label="Small text size"       aria-pressed="false"
M:  27×21px   aria-label="Medium text size"      aria-pressed="true"
L:  23×21px   aria-label="Large text size"       aria-pressed="false"
XL: 32×21px   aria-label="Extra large text size" aria-pressed="false"
```

**After (Sprint 23 measurement on `/quran/al-fatihah`):**
```
S:  44×44px   aria-label="Small text size"       aria-pressed="false"
M:  44×44px   aria-label="Medium text size"      aria-pressed="true"
L:  44×44px   aria-label="Large text size"       aria-pressed="false"
XL: 44×44px   aria-label="Extra large text size" aria-pressed="false"
```

**After (Sprint 23 measurement on `/settings`):**
```
sm: 45×28px   aria-label="Text size: small"       aria-pressed="false"
md: 66×28px   aria-label="Text size: medium"      aria-pressed="true"
lg: 39×28px   aria-label="Text size: large"       aria-pressed="false"
xl: 38×28px   aria-label="Text size: extra large" aria-pressed="false"
```

**Note on `/settings`:** The settings page uses a different button layout (`ARABIC_SIZES` from `usePrefs` context, not the `SIZES` array in `reader-controls.tsx`). These buttons have `aria-label` attributes but were not the target of this sprint's fix — they use the settings page's own rendering. The 44px fix applies to the reader-controls component used on surah and ayah pages, where all four buttons now measure exactly 44×44px.

All reader-controls buttons now meet the WCAG 2.5.5 minimum target size of 44×44 CSS px. The visual label text remains compact (S/M/L/XL); only the interactive box was enlarged.

---

## §3. TranslationSelector Hydration Findings

After restarting the dev server with a clean `.next` cache:

| Check | `/settings` | `/quran/al-fatihah` |
|-------|-------------|---------------------|
| `window.next` loaded | ✅ `true` | ✅ `true` |
| `window.next.version` | `"15.3.8"` | `"15.3.8"` |
| TranslationSelector trigger rendered | ✅ `true` | ✅ `true` |
| Trigger text | "Jalandhry" | "Jalandhry" |
| "Loading…" elements | `0` | `0` |
| Reader size buttons at 44×44px | N/A (different component) | ✅ 44×44px |

### Runtime interaction tests (all on `/settings`, single continuous tab session)

| Test | Expected | Observed | Status |
|------|----------|----------|--------|
| TranslationSelector hydrated | Trigger rendered, no loading state | ✅ `triggerExists: true`, text "Jalandhry", `loadingCount: 0`, `nextVersion: "15.3.8"` | Pass |
| Opening dialog focuses search input | Search input focused | ✅ `searchInputFocused: true` | Pass |
| Dialog has `aria-modal="true"` | Attribute present | ✅ `ariaModal: "true"` | Pass |
| Backdrop has `aria-hidden="true"` | Attribute present | ✅ `backdropAriaHidden: "true"` | Pass |
| Listbox has `aria-label` | "Available translations" | ✅ `listboxAriaLabel: "Available translations"` | Pass |
| Full catalog loads | All translations listed | ✅ 115 `role="option"` elements | Pass |
| Tab from search input stays in dialog | Focus inside dialog | ✅ Focus moved to `BUTTON role="option"`, `insideDialog: true` | Pass |
| Shift+Tab from search input wraps | Focus wraps, stays inside | ✅ Focus moved to `BUTTON role="option"`, `insideDialog: true` | Pass |
| Focus-trap wrap-around (zero-option filter) | Tab and Shift+Tab cannot escape | ✅ Filtered to 0 options; both Tab and Shift+Tab kept focus on the search input inside the dialog (`wrapOnEmptyForward` / `wrapOnEmptyBackward`, both `insideDialog: true`) | Pass |
| Escape closes dialog | Dialog removed from DOM | ✅ `dialogClosed: true` | Pass |
| Focus returns to trigger after Escape | Trigger focused | ✅ `focusOnTrigger: true` | Pass |
| Search filtering works | Options filtered | ✅ Filter "Sahih" → exactly 1 option: "Saheeh International" | Pass |
| Selecting option applies and closes | Dialog removed, focus on trigger, prefs persisted | ✅ `dialogClosed: true`, `focusOnTrigger: true`, `translationId: "en.sahih"`, trigger text now "Saheeh International" | Pass |
| Backdrop click closes dialog | Dialog removed, focus on trigger | ✅ `dialogClosed: true`, `focusOnTrigger: true` — via `dispatchEvent(new MouseEvent("click"))` on the backdrop element, because the IAB locator API does not support `click({ position })`; the component's real `onClick` handler ran and its effects were observed | Pass |

All 14 runtime interaction tests passed in one continuous real-browser session. One honest caveat: deep Tab traversal through all 115 options was not exercised — the IAB CUA `keypress` API rejected the string form of `keys` (it requires an array), so Tab/Shift+Tab behavior was verified with one real press from the search input into the option list plus the zero-option boundary wrap-around, which is the case that actually exercises the focus trap's wrap logic.

---

## §4. Files Changed and Tests Added

### Files modified

| File | Change |
|------|--------|
| `src/components/quran/reader-controls.tsx` | Size buttons: `min-w-9 px-2.5 py-1` → `min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2.5` |

### New test files

| File | Tests | What it pins |
|------|-------|-------------|
| `src/components/quran/reader-controls-targets.test.ts` | 4 | 44px min-height/width classes, accessible labels, `aria-pressed`, no icon-substitute pattern |

**Total: 4 new tests, 423 total (was 419).**

---

## §5. Browser QA Evidence and Tooling Limitations

### Verified in browser (IAB)

| Feature | Evidence |
|---------|----------|
| Reader size buttons at 44×44px | `getBoundingClientRect()` on `/quran/al-fatihah` |
| No overlap between adjacent buttons | Bounding-box intersection check returned `false` |
| TranslationSelector hydrates on `/settings` | Trigger rendered, 0 "Loading…" elements, `nextVersion: "15.3.8"` |
| TranslationSelector hydrates on `/quran/al-fatihah` | Trigger rendered, 0 "Loading…" elements, `nextVersion: "15.3.8"` |
| Dialog opens on trigger click | `dialogExists: true`, `aria-modal: "true"`, 115 options |
| Dialog focuses search input on open | `searchInputFocused: true` |
| Tab from input enters option list inside dialog | `tag: BUTTON`, `role: option`, `insideDialog: true` |
| Shift+Tab wraps and stays inside dialog | `insideDialog: true` |
| Focus-trap wrap-around with zero options | Tab and Shift+Tab both kept focus on the search input inside the dialog |
| Escape closes and returns focus | `dialogClosed: true`, `focusOnTrigger: true` |
| Search filtering | Filter "Sahih" → exactly 1 option ("Saheeh International") |
| Selection updates prefs | `translationId: "en.sahih"` persisted, trigger text updated |
| Backdrop click closes | `dialogClosed: true`, `focusOnTrigger: true` (dispatched MouseEvent — see limitations) |

### Tooling limitations

- **`tab.playwright.keyboard`**: Not exposed in the IAB Playwright API manifest. Used `locator.press()` on the focused element to dispatch Tab/Shift+Tab/Escape — the correct Playwright-compatible API for this runtime.
- **`tab.cua.keypress({ keys: "Tab" })`**: Rejected — the CUA API requires `keys` as an array, not a string (Zod validation error). Multi-step Tab traversal through all 115 options was therefore not exercised; the focus trap was verified with one real press plus the zero-option boundary wrap.
- **Locator `click({ position })`**: Not supported by the IAB locator API. The backdrop close was performed with `dispatchEvent(new MouseEvent("click", ...))` on the backdrop element — a synthetic event, but it ran the component's real `onClick` handler and the effects (dialog removal, focus return) were observed.
- **SVG event dispatch**: Still limited for knowledge graph arrow-key tests (documented in Sprint 22).
- **Dev server cache corruption**: Root cause of Sprint 22's TranslationSelector anomaly; resolved by `rm -rf .next` and dev-server restart. This is a recurring pattern in this project (also hit during Sprint 20 QA): before any browser QA session, verify `/_next/static/chunks/webpack.js` returns HTTP 200; if it returns 404, clear `.next` and restart the dev server.

---

## §6. Lint, Typecheck, Test, and Build Results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | ✅ Clean |
| Typecheck | `pnpm typecheck` | ✅ Clean |
| Tests | `pnpm test` | ✅ **423/423 passed** across 28 files |
| Build | `pnpm build` | ✅ Succeeded — all routes pre-rendered |

---

## §7. Remaining Unverified Behaviors

| Feature | Status | Reason |
|---------|--------|--------|
| Graph arrow-key navigation | ⚠️ Source-verified only | SVG synthetic event dispatch limitation (Sprint 22) |
| Graph node click activation | ⚠️ Source-verified only | SVG `.click()` not available on circles |
| Word-by-word RTL visual order | ⚠️ Source-verified only | Word data file loading delay in dev |
| Audio button 44px height | ⚠️ Source-verified only | `showAudio: false` in test environment |
| Settings page size button heights | ℹ️ 28px | Different component (`ARABIC_SIZES` from prefs context), not in scope for this sprint |

---

## §8. Explicit Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`.
- ✅ No Quran text, translations, Tafsir, citations, or source attribution were altered.
- ✅ No fabricated content, graph relationships, or scholarly-review records were added.
- ✅ No new dependencies were added.
- ✅ No accounts, tracking, analytics, persistent search history, or cross-device synchronization were added.
- ✅ Licensing state unchanged.
- ✅ Sprint 24 has not been started.
