# Sprint 21 Report — Keyboard Accessibility, Focus Management & Reading Order

**Branch:** main
**Date:** 2026-10-24
**Scope:** Deferred accessibility findings from Sprint 20 — focus trapping, keyboard graph navigation, RTL reading order, and touch targets.

---

## §1. Audit Findings and Implementation Decisions

### Pre-implementation audit

All files from the Sprint 20 remediation were re-read and their current state verified against the Sprint 20 report's findings:

| Component | Sprint 20 state | Sprint 21 gap identified |
|-----------|----------------|--------------------------|
| `translation-selector.tsx` | `role="dialog"`, Escape, focus return added in S20 | **No focus trap** — Tab/Shift+Tab could escape to background content |
| `knowledge-graph-explorer.tsx` | `tabIndex={0}`, Enter/Space, `<details>` fallback in place | **No arrow-key navigation** — users must Tab through every node sequentially |
| `word-by-word.tsx` | `lang="ar"`, `lang="ar-Latn"`, `lang="en"` added in S20 | **Grid fills LTR** — CSS grid columns fill left-to-right, contradicting Arabic reading order |
| `audio-player.tsx` | `aria-pressed`, text label, `role="status"` present | **Touch target ~30px** — below 44px WCAG minimum |
| SVG graph nodes | 14px/10px radius circles | **Touch target 20–28px** — below 44px WCAG minimum |

### Decision: no Radix Dialog for TranslationSelector

The project has `@radix-ui/react-dialog` installed, but using it would change the selector from an inline dropdown to a centered modal — a visual regression on reader pages. A lightweight custom focus trap preserves the existing UX while meeting WCAG 2.4.3 (Focus Order) and 2.1.2 (No Keyboard Trap).

### Decision: deterministic node addressing via `data-node-id`

The initial arrow-key implementation used `aria-label*=` substring matching to find target `<g>` elements, which is fragile when labels share prefixes (e.g., "Patience" and "Patience in Adversity"). Replaced with `data-node-id={node.id}` for O(1) deterministic lookup.

---

## §2. Files Changed

| File | Change |
|------|--------|
| `src/components/quran/translation-selector.tsx` | Added focus trap: `aria-modal="true"`, auto-focus search input on open, Tab/Shift+Tab cycling within dialog, Escape closes and returns focus to trigger |
| `src/components/graph/knowledge-graph-explorer.tsx` | Added ArrowLeft/Right cycling within ring, ArrowUp/Down ring-switching by angular proximity; `data-node-id` on each `<g>`; invisible r=22 hit-area circles; updated instruction text and `<desc>` |
| `src/components/quran/word-by-word.tsx` | Added `dir="rtl"` to the `<ol>` grid container so CSS grid fills right-to-left |
| `src/components/quran/audio-player.tsx` | Enlarged play/pause button to `min-h-[44px]` with `px-4 py-2` padding |

### New test files (4)

| File | Tests | What it pins |
|------|-------|-------------|
| `src/components/quran/translation-selector-a11y.test.ts` | 9 | `aria-modal`, focus trap logic, Escape handler, auto-focus, `aria-haspopup` |
| `src/components/graph/knowledge-graph-hitarea.test.ts` | 6 | `data-node-id`, r=22 hit area, arrow-key directions, `<details>` fallback |
| `src/components/graph/knowledge-graph-keys.test.ts` | 8 | Ring cycling math, wrap-around, angular ring-switch, reachability |
| `src/components/quran/word-by-word-rtl.test.ts` | 5 | `dir="rtl"` on grid, CSS grid classes, lang attributes preserved |
| `src/components/quran/audio-player-a11y.test.ts` | 4 | `min-h-[44px]`, `aria-pressed`, `aria-label`, `role="status"` |

**Total: 32 new tests, 419 total (was 387).**

---

## §3. Before/After Behavior

### Translation Selector — Focus Trap (Phase 2)

**Before:** Tab key could move focus out of the open dropdown into background page content. No `aria-modal`. Search input auto-focused via `autoFocus` attribute (fires on every render).

**After:**
- `aria-modal="true"` on the dialog container
- `searchInputRef` with `requestAnimationFrame`-delayed focus on open (ensures DOM mount)
- Tab on last focusable element wraps to first; Shift+Tab on first wraps to last
- Escape closes and returns focus to the trigger button
- Backdrop click also returns focus to trigger
- `closeAndReturnFocus()` extracted as a `useCallback` so all close paths share one implementation

### Knowledge Graph — Arrow-Key Navigation (Phase 3)

**Before:** Users could only Tab through nodes sequentially. With 21 nodes (10 dimensions + 11 topics), reaching a specific node required up to 21 Tab presses.

**After:**
- **ArrowLeft/Right** cycles through nodes within the current ring (dimension or topic), wrapping at boundaries
- **ArrowUp/Down** switches between rings, targeting the node at the closest angular position
- Focus moves via `data-node-id` attribute lookup — deterministic, no substring matching
- Each `<g>` carries an invisible `r=22` transparent circle (44px diameter) for touch targets
- Enter and Space still activate node selection (unchanged)
- Filter pills, detail panel, `<details>` fallback — all preserved
- Instruction text and SVG `<desc>` updated to document arrow-key operation

### Word-by-Word — RTL Reading Order (Phase 4)

**Before:** The `<ol>` grid used default LTR direction. CSS grid filled columns left-to-right, so the first Arabic word appeared in the leftmost column — opposite to the expected RTL reading flow.

**After:** `dir="rtl"` on the `<ol>` container causes CSS grid to fill right-to-left. The first word now appears in the rightmost column, matching Arabic reading order. DOM order is unchanged, so screen readers still read words in the correct Quranic sequence.

### Touch Targets (Phase 5)

**Before:** Audio play/pause button was `px-3 py-1.5` (~30px tall). SVG graph nodes were 20–28px diameter circles.

**After:**
- Audio button: `min-h-[44px] px-4 py-2` — meets WCAG 2.5.5 Target Size
- SVG nodes: invisible `r=22` transparent circle around each node — 44px diameter hit area without changing visible appearance

---

## §4. Automated Test Results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | ✅ Clean |
| Typecheck | `pnpm typecheck` | ✅ Clean |
| Tests | `pnpm test` | ✅ **419/419 passed** across 27 files (32 new) |
| Build | `pnpm build` | ✅ Succeeded — all routes pre-rendered |

### Test breakdown (new files)

| Test file | Tests | Duration |
|-----------|-------|----------|
| `translation-selector-a11y.test.ts` | 9 | ~5ms |
| `knowledge-graph-hitarea.test.ts` | 6 | ~5ms |
| `knowledge-graph-keys.test.ts` | 8 | ~5ms |
| `word-by-word-rtl.test.ts` | 5 | ~5ms |
| `audio-player-a11y.test.ts` | 4 | ~5ms |

---

## §5. Browser Interaction Evidence

### Tooling limitation

The browser-use automation module (`browser-use/dist/index.mjs`) is not available at the expected path in this session. All browser QA was performed via curl-based HTML inspection of the running dev server at `http://localhost:3000`.

**Important:** The TranslationSelector, KnowledgeGraph, and ReaderControls are all `"use client"` components that depend on `usePrefs()` hydration. Server-rendered HTML shows their loading/skeleton state; full ARIA attributes and interactive behavior appear only after client-side JavaScript executes. This is the standard Next.js App Router pattern.

### curl verification results

| Check | Result |
|-------|--------|
| All 9 routes return HTTP 200 | ✅ `/`, `/search`, `/quran/al-baqarah`, `/ayah/2/255`, `/settings`, `/report`, `/discover`, `/topics/patience`, `/explore/graph` |
| Invalid references return 404 | ✅ `/ayah/999/1`, `/quran/nonexistent`, `/topics/nonexistent` |
| Source-level invariants | ✅ All 6 verified via grep: `data-node-id`, `aria-modal`, `dir="rtl"`, `min-h-[44px]`, `ArrowLeft`, `r={22}` |
| `AI_ANSWER_FEATURE_ENABLED` | ✅ Confirmed `false` in `src/lib/ai-answer.ts` |
| Search shortcut preserved | ✅ `data-search-box` attribute present on `/search` |

### What could not be verified via curl

- **Focus trap behavior** — requires a real browser with keyboard interaction to test Tab cycling and focus return
- **Arrow-key navigation in graph** — requires JS hydration and keyboard events
- **Visual RTL grid flow** — requires a browser rendering engine to confirm column fill direction
- **Touch target usability** — requires physical touch interaction or browser devtools device emulation

These are documented as limitations, not as passing tests.

---

## §6. Remaining Accessibility Barriers

### Not addressed this sprint (documented for future work)

1. **Ayah card headings** (Sprint 20 finding 4.2) — Adding per-ayah headings creates 286+ headings on al-Baqarah. Needs a jump-to-ayah control or landmark redesign.

2. **Calendar day touch targets** — `react-day-picker` renders `h-8 w-8` (32px) day buttons. Enlarging requires overriding the library's internal classNames, which risks breaking its keyboard navigation. The calendar is used only in reading-plan date pickers, not on primary Quran reading routes.

3. **Switch component size** — The Radix `@radix-ui/react-switch` primitive renders at `h-5 w-9` (20×36px). The project uses it only in reader-controls toggle pills, which already carry `role="switch"` and `aria-checked`. The wrapping button provides a larger click area.

4. **Slider thumb** — `h-4 w-4` (16px) thumb from `@radix-ui/react-slider`. Used only in specialized controls; the slider track itself provides a larger click target.

5. **Graph edge accessibility** — Edges remain purely visual. The detail panel shows connections for selected nodes, which partially addresses this, but individual edges have no text alternative.

6. **`text-gold` contrast** — ~4.3:1 on card backgrounds fails AA for normal-size text. Currently used only for decorative Arabic display text and accent elements, not for body text or interactive indicators.

---

## §7. Explicit Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`.
- ✅ No Quran text, translations, Tafsir, citations, or source attribution were altered.
- ✅ No fabricated content, graph relationships, or scholarly-review records were added.
- ✅ Existing search filters, autocomplete, global `/` shortcut, and keyboard navigation are preserved.
- ✅ No new dependencies were added.
- ✅ No accounts, tracking, analytics, persistent search history, or cross-device synchronization were added.
- ✅ Licensing state unchanged.
- ✅ Responsive behavior preserved — no horizontal overflow introduced.
- ✅ The non-visual `<details>` list of graph nodes is preserved (Sprint 20 finding 7.1).
- ✅ Sprint 22 has not been started.
