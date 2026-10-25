# Sprint 24 Report — Accessibility Closure & Browser Verification

**Branch:** main
**Date:** 2026-10-25
**Scope:** Close the remaining Sprint 20–23 verification gaps: settings button target sizes, knowledge-graph keyboard interaction, word-by-word RTL rendering, audio-player touch targets.

---

## §1. Initial Audit and Current-State Findings

All four previous sprint reports were re-read. Source files re-inspected before any edits:

| Component | Sprint 23 status | Sprint 24 starting measurement |
|-----------|-----------------|-------------------------------|
| `reader-controls.tsx` size buttons | Fixed to 44×44 in Sprint 23 | N/A (already verified) |
| `settings/page.tsx` size buttons | Reported at ~28px in Sprint 23 | **28px tall, 38–66px wide** (confirmed below) |
| `settings/page.tsx` spacing buttons | Not in Sprint 23 scope | **28px tall, 62–89px wide, no `aria-label`** |
| `knowledge-graph-explorer.tsx` | Arrow handlers present but unverified in browser | See §2B |
| `word-by-word.tsx` | `dir="rtl"` on `<ol>` added in Sprint 21, unverified visually | See §2C |
| `audio-player.tsx` | `min-h-[44px]` added in Sprint 21, unverified with audio enabled | See §2D |

Dev server baseline: `/_next/static/chunks/webpack.js` returned HTTP 200; `/_next/static/chunks/main-app.js` returned HTTP 200. Gates clean at start: lint ✓, typecheck ✓, 423/423 tests across 28 files.

---

## §2. Confirmed Defects and Root Causes

### 2A. Settings text-size and line-spacing buttons undersized

**Root cause:** `settings/page.tsx` uses `ARABIC_SIZES` / `LINE_HEIGHTS` from the prefs context and renders its own button groups. These buttons used `px-3.5 py-1.5` (14px horizontal + 6px vertical padding) with no minimum-size constraint, producing ~28px-tall targets. Sprint 23's 44px fix was applied only to `reader-controls.tsx`, which renders the reader-page buttons from a separate `SIZES` array. The settings buttons are independent and were missed.

Additionally, the **line-spacing buttons had no `aria-label`** at all — only visible text ("Compact" / "Normal" / "Loose") — so a screen reader announces only "Compact, button, pressed" with no context about what the button controls. This was a Sprint 20/23 gap.

**Fix applied:** `src/app/settings/page.tsx` — both groups:
- Replaced `py-1.5` with `min-h-[44px] min-w-[44px] inline-flex items-center justify-center`.
- Added `aria-label={`Line spacing: ${lh}`}` to the spacing buttons (size buttons already had `aria-label` from Sprint 20).

### 2B. Knowledge-graph keyboard interaction

**Finding:** Source handlers are correct (Sprint 21). Sprint 22 could not verify runtime because synthetic `KeyboardEvent` dispatch on SVG `<g>` elements did not reach React's event delegation. **This sprint verified with real browser keyboard input via `locator.press()`** — see §5 for results. No code change required.

### 2C. Word-by-word RTL rendering

**Finding:** Source carries `dir="rtl"` on the `<ol>` (Sprint 21). Sprint 22 could not verify because `/word-data/2.json` did not finish loading within the test time budget. This sprint re-ran with a longer polling budget — see §5 for results. No code change required.

### 2D. Audio player touch target

**Finding:** Source carries `min-h-[44px] px-4 py-2` (Sprint 21). Sprint 22 could not verify because `showAudio: false` in the test environment. This sprint enabled audio via `localStorage` seeding — see §5 for results. No code change required.

---

## §3. Files Changed

| File | Change | Rationale |
|------|--------|-----------|
| `src/app/settings/page.tsx` | Size buttons: `py-1.5` → `min-h-[44px] min-w-[44px] inline-flex items-center justify-center` | WCAG 2.5.5 target size |
| `src/app/settings/page.tsx` | Spacing buttons: same size fix + added `aria-label={`Line spacing: ${lh}`}` | Target size + Sprint 20/23 accessible-name gap |

### New test files

| File | Tests | What it pins |
|------|-------|-------------|
| `src/app/settings/settings-targets.test.ts` | 6 | 44px min-h/w on both groups, both groups carry contextual `aria-label` templates, `aria-pressed` preserved on both |

**Total: 6 new tests, 429 total (was 423).**

---

## §4. Before/After Measurements

### Settings text-size buttons (measured via `getBoundingClientRect()` in IAB at 1280×720)

| Button | Before (w×h) | After (w×h) | `aria-label` |
|--------|-------------|-------------|--------------|
| sm | 45×28 | **45×44** | "Text size: small" |
| md | 66×28 | **66×44** | "Text size: medium" |
| lg | 39×28 | **44×44** | "Text size: large" |
| xl | 38×28 | **44×44** | "Text size: extra large" |

All four buttons now meet WCAG 2.5.5 (minimum 44×44 CSS px). Clicking "lg" toggled `aria-pressed` to `"true"` and persisted `arabicSize: "lg"` to `localStorage` — interactivity preserved.

### Settings line-spacing buttons

| Button | Before (w×h) | Before `aria-label` | After (w×h) | After `aria-label` |
|--------|-------------|---------------------|-------------|-------------------|
| Compact | 79×28 | **null** | **79×44** | "Line spacing: compact" |
| Normal | 89×28 | **null** | **89×44** | "Line spacing: normal" |
| Loose | 62×28 | **null** | **62×44** | "Line spacing: loose" |

Clicking "Loose" toggled `aria-pressed` to `"true"` and persisted `lineHeight: "loose"` to `localStorage` — interactivity preserved.

---

## §5. Browser Verification Matrix

All checks performed in the ZCode in-app browser (IAB, Chromium-based, Playwright-shaped Tab API). Dev server confirmed healthy before QA (`webpack.js` → 200).

| # | Route | Viewport | Action | Evidence | Classification |
|---|-------|----------|--------|----------|----------------|
| 1 | `/settings` | 1280×720 | Page load + hydration | `nextVersion: "15.3.8"`, size buttons present with `aria-label="Text size: small/medium/large/extra large"`, spacing buttons present | Runtime ✅ |
| 2 | `/settings` | 1280×720 | Pre-fix measurement | All 7 buttons measured at **28px tall** — confirmed undersized | Runtime ✅ |
| 3 | `/explore/graph` | 1280×720 | Page load | 21 nodes rendered with `data-node-id`; `<details>` fallback with 21 links; first link `/explore/dimension/spiritual` | Runtime ✅ |
| 4 | `/explore/graph` | 1280×720 | Click `dimension:spiritual` | Focus moved to `<g>`, `aria-pressed: "true"`, detail panel appeared with `aria-label="Details for Spiritual"` | Runtime ✅ |
| 5 | `/explore/graph` | 1280×720 | `locator.press("Enter")` on focused node | `aria-pressed: "false"`, detail panel closed — **toggle works** | Runtime ✅ |
| 6 | `/explore/graph` | 1280×720 | `locator.press("Enter")` to re-select, then `locator.press("ArrowRight")` | Focus moved to `dimension:personal` — **ArrowRight cycles within dimension ring** | Runtime ✅ |
| 7 | `/explore/graph` | 1280×720 | `locator.press("ArrowDown")` from dimension node | Focus moved to `topic:gratitude` — **ArrowDown switches rings by angular proximity** | Runtime ✅ |
| 8 | `/explore/graph` | 1280×720 | `locator.press("ArrowUp")` from topic node | Focus moved back to `dimension:personal` — **ArrowUp returns to dimension ring** | Runtime ✅ |
| 9 | `/ayah/2/255` | 1280×720 | Page load + Word-by-word toggle click | Heading found (count 1), toggle clicked | Runtime ✅ |
| 10 | `/ayah/2/255` | 1280×720 | Wait for word-data fetch (polled up to 30s) | `ol[dir="rtl"]` rendered with **50 word items** (`itemCount: 50`), computed CSS `direction: "rtl"`, toggle `aria-expanded="true"` | Runtime ✅ |
| 10a | `/ayah/2/255` | 1280×720 | RTL same-row pairwise check | **49 pairs across 4 rows; `allPairsRTL: true`** — every earlier-DOM word sits to the RIGHT of every later-DOM word on the same row (Ayatul Kursi: `ٱللَّهُ` → `لَآ` → `إِلَـٰهَ` → `إِلَّا` → `هُوَ` → `ٱلْحَىُّ` → `ٱلْقَيُّومُ` → `لَا` → `تَأْخُذُهُۥ` → `سِنَةٌۭ` …) | Runtime ✅ |
| 10b | `/ayah/2/255` | 1280×720 | Lang attributes on word cells | Arabic cells `lang="ar" dir="rtl"`; transliteration `lang="ar-Latn"` (e.g., "al-lahu", "lā", "ilāha"); gloss `lang="en"` (e.g., "Allah", "(there is) no", "God") | Runtime ✅ |
| 11 | `/quran/al-fatihah` | 1280×720 | Seeded `showAudio: true` in prefs + reload | 7 audio play buttons rendered (`allPressedCount: 28` includes non-audio toggles) | Runtime ✅ |
| 12 | `/quran/al-fatihah` | 1280×720 | Measure first 5 audio buttons | All measured **44×86px** (`aria-label="Play recitation — Mishary Rashid Alafasy"`) | Runtime ✅ |
| 13 | `/quran/al-fatihah` | 1280×720 | Click first audio button | `aria-pressed` toggled to `"true"`, text changed "Listen" → "Pause", `aria-label` updated to "Pause recitation — …" | Runtime ✅ |
| 14 | `/settings` | 1280×720 | Post-fix: re-measure size + spacing buttons | All 7 buttons **44px tall**; widths 44–89px; nextVersion `"15.3.8"` (hydration clean) | Runtime ✅ |
| 15 | `/settings` | 1280×720 | Post-fix: click "large" size button | `aria-pressed: "true"`, `localStorage.arabicSize: "lg"` | Runtime ✅ |
| 16 | `/settings` | 1280×720 | Post-fix: click "loose" spacing button | `aria-pressed: "true"`, `localStorage.lineHeight: "loose"` | Runtime ✅ |
| 17 | `/settings` | 1280×720 | Post-fix: TranslationSelector Escape still works | Trigger clicked → dialog opened → search input pressed Escape → `dialogGone: true`, `focusOnTrigger: true` | Runtime ✅ |

### Verified via source-level regression tests

- Reader-controls size buttons carry `min-h-[44px] min-w-[44px]` (Sprint 21 test, still passes).
- Settings size buttons carry `min-h-[44px] min-w-[44px]` (new Sprint 24 test).
- Settings spacing buttons carry `min-h-[44px] min-w-[44px]` (new Sprint 24 test).
- Settings spacing buttons carry `aria-label={`Line spacing: ${lh}`}` (new Sprint 24 test, pins the Sprint 20/23 accessible-name gap).
- `aria-pressed` preserved on both groups (new Sprint 24 tests).
- TranslationSelector focus trap, Escape, aria-modal, backdrop aria-hidden (Sprint 21 tests, still pass).
- Word-by-word `<ol>` carries `dir="rtl"` and Arabic/translit/gloss lang attributes (Sprint 21 tests, still pass).
- Knowledge-graph nodes carry `data-node-id`, r=22 hit area, arrow-key handler (Sprint 21 tests, still pass).
- Audio button carries `min-h-[44px]` (Sprint 21 test, still pass).

---

## §6. Quality-Gate Results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | ✅ Clean |
| Typecheck | `pnpm typecheck` | ✅ Clean |
| Tests | `pnpm test` | ✅ **429/429 passed** across 29 files (6 new) |
| Build | `pnpm build` | ✅ Succeeded — all routes pre-rendered |

---

## §7. Remaining Accessibility Risks and Unverified Behavior

| Item | Status | Notes |
|------|--------|-------|
| Settings text-size + line-spacing targets | ✅ Closed this sprint | 44×44 verified in browser; interactivity preserved |
| TranslationSelector focus trap + Escape | ✅ Closed this sprint | Re-verified post settings fix — `dialogGone: true`, `focusOnTrigger: true` |
| Knowledge-graph Tab / Enter / Arrow keys | ✅ Closed this sprint | All four directions verified via real `locator.press()` in IAB |
| Word-by-word RTL visual order | ✅ Closed this sprint | Ayatul Kursi: 50 words rendered, all 49 same-row pairs RTL, lang attrs correct |
| Audio player touch target | ✅ Closed this sprint | 44×86px verified; click toggles `aria-pressed` and updates `aria-label` |
| Graph filter pills keyboard operation | Source-only | Standard `<button>` elements; not in Sprint 24 scope |
| Ayah-card per-ayah headings (Sprint 20 finding 4.2) | Deferred | 286+ headings on al-Baqarah would be worse than current state; needs jump-to-ayah control redesign |
| Calendar day touch targets (`react-day-picker` internals) | Deferred | Overriding library classNames risks breaking keyboard nav; library upgrade path |
| `text-gold` contrast on card (~4.3:1) | Deferred | Currently decorative only, not body text; palette redesign if gold is used for interactive indicators |
| Settings size button width variance (sm=45, xl=44) | Noted | Both meet 44px minimum; asymmetry is acceptable visual consequence of content-driven pill widths |

All five Sprint 22 unverified gaps are now closed with real-browser evidence.

---

## §8. Dev-Server Reliability Note

The dev server was killed to run `pnpm build` (the build cannot run while dev is holding `.next`), then restarted for the final QA pass. During the restart the first chunk request returned HTTP 404 for ~12s while webpack compiled — this is the well-documented recurring pattern (see memory `next-cache-corruption-pattern.md`). The second request succeeded, and `curl /settings` returned HTTP 200, confirming the server recovered normally. All §5 rows 14–17 were then collected on this healthy dev server and are marked ✅ above.

Dev-server health at time of QA: `webpack.js → 200`, `main-app.js → 200`, `/settings → 200`, `nextVersion: "15.3.8"`.

---

## §9. Non-Negotiable Constraint Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`.
- ✅ No Quran text, translations, Tafsir, citations, or source attribution were altered.
- ✅ No fabricated Quran data, graph relationships, scholarly-review records, or reviewer identities.
- ✅ No accounts, analytics, tracking, persistent search history, or cross-device synchronization added.
- ✅ No business logic or unrelated API changes.
- ✅ No licensing changes.
- ✅ No new product features outside this sprint's accessibility scope.
- ✅ Existing mobile and desktop behavior preserved — the settings button fix is locally scoped to two `<div role="group">` wrappers.
- ✅ Sprint 25 has not been started.
