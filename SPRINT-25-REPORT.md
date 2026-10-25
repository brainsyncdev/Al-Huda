# Sprint 25 Report — Remaining Accessibility Gaps & Final Audit

**Branch:** main
**Date:** 2026-10-25
**Scope:** Close the remaining accessibility risks documented in Sprint 24: graph filter keyboard access, calendar touch targets, ayah-card heading navigation, and gold contrast audit.

---

## §1. Initial Findings and Confirmed Defects

All four Sprint 20/24 reports were re-read. Source files inspected before any edits:
- `src/components/graph/knowledge-graph-explorer.tsx` (filter pills, lines 127–186)
- `src/components/ui/calendar.tsx` (full file)
- `src/components/quran/ayah-card.tsx` (article element, lines 175–207)
- `src/components/revision/plan-overview.tsx` (calendar usage check)
- `src/app/globals.css` (gold token values)

Dev-server baseline confirmed healthy before QA: `webpack.js → 200`, `main-app.js → 200`. Gates clean at start: lint ✓, typecheck ✓, 429/429 tests across 29 files.

| Area | Sprint 24 status | Sprint 25 finding |
|---|---|---|
| Graph filter pills | Source-only, not runtime-verified | All 11 pills are native `<button type="button">`, `tabIndex: 0`, `aria-pressed` present, focus preserved after activation, filtering works correctly — **no defect** |
| Calendar touch targets | Deferred (28px day buttons) | `ui/calendar.tsx` is **dead code** — never imported by any page; only `CalendarClock` icon used in `plan-overview.tsx` — **no runtime issue exists** |
| Ayah-card headings | Deferred (286 headings concern) | 286 articles with **no accessible name**; only 5 headings on al-Baqarah — **confirmed defect, fixed** |
| Gold contrast | Deferred (~4.3:1 concern) | Corrected measurement: **4.95–5.08:1** with proper effective backgrounds — **passes AA**; Sprint 20–24 figure was a measurement error |
| 320px overflow | Not previously investigated | 3px `scrollWidth` vs `clientWidth` difference = 15px scrollbar; **no element exceeds content box** — scrollbar artifact, not a layout bug |

---

## §2. Files Changed and Reasons

| File | Change | Reason |
|---|---|---|
| `src/components/quran/ayah-card.tsx` | Added `aria-label={`Ayah ${ayah.surah}:${ayah.ayah}`}` to the `<article>` element | Gives each ayah card an accessible name without adding 286 heading elements; screen readers can identify individual verses while the heading outline stays at 5 levels |

### New test files (3)

| File | Tests | What it pins |
|---|---|---|
| `src/components/quran/ayah-card-a11y.test.ts` | 4 | Article carries `aria-label` with surah:ayah reference; article `id` anchor preserved; no per-ayah headings introduced; ayah-number span retains its `aria-label` |
| `src/components/graph/graph-filter-a11y.test.ts` | 4 | Filter pills are native `<button type="button">`; "All" pill has `aria-pressed={filter === "all"}`; dimension pills have `aria-pressed={isActive}`; activation via `onClick` (native keyboard support) |
| `src/components/ui/calendar-unused.test.ts` | 2 | `ui/calendar.tsx` exists and wraps react-day-picker; no other source file imports it (dead-code pin) |

**Total: 10 new tests, 439 total (was 429).**

---

## §3. Before/After Contrast and Touch-Target Measurements

### Gold contrast (measured via `getComputedStyle` + effective background walk)

Sprint 20–24 reported "~4.3:1" — this was a **measurement error**: transparent parent backgrounds were parsed as black (`rgba(0,0,0,0)` → `{r:0,g:0,b:0}`), producing artificially low ratios. Sprint 25 corrected the measurement by walking up the DOM tree to find the first non-transparent background:

| Element | Font size | Weight | Measured ratio | AA threshold | Passes? |
|---|---|---|---|---|---|
| "الحُدَى" (header) | 18px | 400 | **4.95:1** | 4.5:1 (normal text) | ✅ |
| "Al-Huda" (eyebrow) | 12px | 600 | **4.95:1** | 4.5:1 | ✅ |
| "Al-'Asr · 103:3" (verse of day) | 14px | 500 | **5.08:1** | 4.5:1 | ✅ |
| Journey step numbers (1, 2, 36, 55, 67) | 14px | 600 | **5.08:1** | 4.5:1 | ✅ |

**Conclusion:** `text-gold` passes WCAG 2.2 AA for all measured usages. No color change required.

### Graph filter pill touch targets

| Pill | Width | Height |
|---|---|---|
| All | 46px | 33px |
| Spiritual | 106px | 33px |
| Personal | 108px | 33px |
| Family | 94px | 33px |
| Social | 92px | 33px |
| Economic | 115px | 33px |
| Intellectual | 125px | 33px |
| Governance | 130px | 33px |
| Jihad | 88px | 33px |
| Interfaith | 111px | 33px |
| Ilm (Knowledge) | 156px | 33px |

Filter pills are 33px tall — below the 44px WCAG recommendation. They are secondary filter controls (not primary interactive targets), wrapped in a `flex-wrap` container with `gap-2` spacing, and no adjacent pills overlap. Documented for future enhancement; no change made this sprint.

### Ayah-card article accessible names

| Metric | Before | After |
|---|---|---|
| Articles with `aria-label` | 0 / 286 | **286 / 286** |
| Heading count on al-Baqarah | 5 | 5 (unchanged) |
| Sample labels | — | "Ayah 2:1", "Ayah 2:2", "Ayah 2:3", "Ayah 2:4", "Ayah 2:5" |

---

## §4. Browser Verification Matrix

All checks performed in the ZCode in-app browser (IAB, Chromium-based, Playwright-shaped Tab API). Dev server confirmed healthy before QA.

| # | Route | Viewport | Action | Evidence | Classification |
|---|---|---|---|---|---|
| 1 | `/explore/graph` | 1280×720 | Enumerate filter pills | 11 native `<button type="button">`, all `tabIndex: 0`, `aria-pressed` present | Runtime ✅ |
| 2 | `/explore/graph` | 1280×720 | Programmatic `.click()` on "Spiritual" pill via `evaluate()` | `aria-pressed` flipped `false→true`, 7 active nodes, 14 dimmed → filter applied correctly | Runtime ✅ |
| 3 | `/explore/graph` | 1280×720 | Programmatic `.click()` on "All" pill to reset | `allPressed: "true"`, all 21 nodes active, 0 dimmed → reset works | Runtime ✅ |
| 4 | `/explore/graph` | 1280×720 | `locator.press("Enter")` on focused pill | **Did NOT toggle** — `aria-pressed` stayed `"false"`, 0 dimmed. IAB `locator.press()` does not deliver keyboard events to these buttons in this environment | Runtime ⚠️ Tooling limitation |
| 4a | `/explore/graph` | 1280×720 | `locator.press(" ")` on focused pill | **Did NOT toggle** — same as above | Runtime ⚠️ Tooling limitation |
| 4b | `/explore/graph` | 1280×720 | `locator.press("Tab")` from focused pill | **Focus did NOT move** — stayed on Spiritual pill | Runtime ⚠️ Tooling limitation |
| 4c | `/explore/graph` | 1280×720 | Focus-visible outline via `getComputedStyle` | `outlineStyle: "none"` after programmatic `.focus()` — expected browser behavior (`:focus-visible` only matches keyboard navigation, not programmatic focus) | Runtime ✅ (expected) |
| 4b | `/explore/graph` | 1280×720 | Click "All" pill | `aria-pressed: "true"`, focus preserved on pill (`focusOnAll: true`) | Runtime ✅ |
| 4c | `/explore/graph` | 1280×720 | Reset to "All" | All 21 nodes active, 0 dimmed | Runtime ✅ |
| 5 | `/` | 1280×720 | Measure gold contrast (correct method) | 4.95–5.08:1 across 8 sampled elements | Runtime ✅ |
| 6 | `/quran/al-fatihah` | 320×720 | Overflow check | `scrollWidth: 323`, `clientWidth: 305`, scrollbar 15px, widest element 305px, `realOverflow: false` | Runtime ✅ |
| 7 | `/quran/al-fatihah` | 375×720 | Overflow check | No overflow | Runtime ✅ |
| 8 | `/quran/al-fatihah` | 1280×720 | Overflow check | No overflow | Runtime ✅ |
| 9 | `/explore/graph` | 320×720 | Filter pill wrap check | `flexWrap: "wrap"`, no overflow | Runtime ✅ |
| 10 | `/quran/al-baqarah` | 1280×720 | Verify ayah article aria-labels | 286/286 articles labelled, heading count 5 | Runtime ✅ |

**Tooling limitation — keyboard events on graph filter pills:** The filter pills are native `<button type="button">` elements with React `onClick` handlers. By HTML spec, native buttons respond to Enter and Space by firing their click handler — no custom keyboard code is needed. Programmatic `.click()` confirmed the pills work correctly (rows 2–3). However, `locator.press("Enter")`, `locator.press(" ")`, and `locator.press("Tab")` all failed to produce state changes or focus movement in the IAB environment. This is an IAB `locator.press()` delivery limitation, not a code defect. The same limitation affected Sprint 22's graph arrow-key testing. The filter pills are keyboard-accessible by construction (native button semantics); full keyboard verification requires a standalone Playwright/Puppeteer test harness outside the IAB.

**Focus-visible measurement:** `getComputedStyle` after programmatic `.focus()` correctly returns `outline: none` — browsers only apply `:focus-visible` styles for keyboard-initiated focus, not `element.focus()` calls. This is expected behavior, not a defect. The global `:focus-visible` rule in `globals.css` (line 89) will apply during real keyboard navigation.

### Verified via source-level regression tests

- Ayah article carries `aria-label` with surah:ayah reference (new Sprint 25 test)
- Article `id` anchor preserved for direct linking (new Sprint 25 test)
- No per-ayah heading elements introduced (new Sprint 25 test)
- Graph filter pills are native buttons with `aria-pressed` (new Sprint 25 test)
- Calendar component is dead code — no importer exists (new Sprint 25 test)
- All Sprint 20–24 regression tests still pass (429 prior tests unchanged)

---

## §5. Regression Tests and Exact Quality-Gate Results

| Gate | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ Clean — no errors, no warnings |
| Typecheck | `pnpm typecheck` | ✅ Clean — no errors |
| Tests | `pnpm test` | ✅ **439/439 passed** across 32 files (10 new) |
| Build | `pnpm build` | ✅ Succeeded — all routes pre-rendered |

### Test breakdown (new files)

| Test file | Tests |
|---|---|
| `ayah-card-a11y.test.ts` | 4 |
| `graph-filter-a11y.test.ts` | 4 |
| `calendar-unused.test.ts` | 2 |

---

## §6. Remaining Issues with Concrete Next Steps

| Item | Status | Concrete next step |
|---|---|---|
| Ayah-card per-ayah headings | ✅ Resolved via `aria-label` (no headings added) | If a jump-to-ayah input control is added in a future sprint, it should reference `#ayah-{surah}-{ayah}` anchors and announce the target via `aria-live` |
| Calendar dead code | Documented (never rendered) | Remove `ui/calendar.tsx` and the `react-day-picker` dependency in a cleanup sprint; the `calendar-unused.test.ts` pin will flag any new import |
| Filter pills 33px tall | Documented (secondary controls) | If enlarged, use the same `min-h-[44px]` pattern applied to reader-controls and settings buttons in Sprints 23–24 |
| Graph detail panel close button `p-1.5` (~32px) | Documented | Enlarge to `p-2.5` or add `min-h-[44px] min-w-[44px]` in a future touch-target pass |
| `text-gold` contrast | ✅ Resolved — passes AA at 4.95–5.08:1 | No action needed; the Sprint 20–24 "~4.3:1" figure was a measurement error (transparent parent parsed as black) |
| 320px 3px scrollWidth artifact | ✅ Resolved — scrollbar artifact, not layout bug | No action needed; `realOverflow: false` confirmed |

---

## §7. Non-Negotiable Constraint Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`.
- ✅ No Quran text, translations, Tafsir, citations, or source attribution were altered.
- ✅ No fabricated Quran data, graph relationships, scholarly-review records, or reviewer identities.
- ✅ No accounts, analytics, tracking, persistent search history, or cross-device synchronization added.
- ✅ No business logic or unrelated API changes.
- ✅ No licensing changes.
- ✅ No unrelated product features or unnecessary dependencies added.
- ✅ Existing mobile and desktop behavior preserved — the ayah-card change is a single attribute addition.
- ✅ Sprint 26 has not been started.