# Sprint 20 Report — Accessibility Audit & Targeted Remediation

**Branch:** main
**Date:** 2026-10-24
**Scope:** Accessibility audit across 9 representative routes, with targeted fixes for 8 confirmed findings.

---

## §1. Audit Scope and Methodology

### Routes audited
`/`, `/discover`, `/explore/graph`, `/search`, `/quran/al-baqarah`, `/ayah/2/255`, `/topics/patience`, `/settings`, `/report`

### Methodology
1. **Static code analysis** — Two parallel exploration agents examined all components, layout, CSS, and hooks across the 9 routes for accessibility patterns and gaps.
2. **WCAG 2.2 AA mapping** — Each finding mapped to the relevant success criterion.
3. **Severity classification** — Critical / High / Medium / Low based on impact to keyboard, screen-reader, and low-vision users.
4. **Automated gate verification** — lint, typecheck, test (387 tests), and production build.
5. **curl-based HTML verification** — Confirmed rendered HTML contains the expected ARIA attributes, lang tags, form elements, and structural markers.

### Audit categories
1. Keyboard-only navigation and visible focus indicators
2. Heading hierarchy, landmarks and accessible names
3. Search combobox/listbox semantics and announcements
4. Dialog, popover, dropdown and menu keyboard behavior
5. Arabic text direction, language attributes and screen-reader pronunciation
6. Text contrast, control contrast and focus visibility
7. Responsive layouts, zoom and text resizing
8. Form labels, validation messages and error announcements
9. Interactive SVG knowledge-graph nodes and non-visual alternatives
10. Word-by-word Quran study controls and meaningful reading order
11. Reduced-motion preferences
12. Touch-target usability on mobile

---

## §2. Confirmed Findings

### High Severity (1)

| ID | Finding | WCAG | Route | Fix |
|----|---------|------|-------|-----|
| 8.2 | TranslationSelector custom dropdown lacked focus management, Escape key handling, and ARIA overlay semantics | 2.1.2, 2.4.3 | `/quran/[slug]`, `/settings`, `/ayah/[s]/[a]` | Rewrote with `role="dialog"`, `aria-label`, Escape handler, focus return, backdrop `aria-hidden` |

### Medium Severity (9 found, 7 fixed)

| ID | Finding | WCAG | Route | Fix |
|----|---------|------|-------|-----|
| 2.1 | Desktop nav missing `aria-current="page"` | 2.4.8 | All desktop routes | Added `usePathname()` hook + `aria-current` on matching links |
| 3.1 | Search suggestion count not announced via `aria-live` | 4.1.3 | `/search`, `/` | Added `aria-live="polite"` status region announcing suggestion count |
| 4.1 | Transliteration text missing `lang` attribute in ayah card | 3.1.2 | `/quran/[slug]`, `/ayah/[s]/[a]` | Added `lang="ar-Latn"` |
| 5.1 | Reader control size buttons had single-letter accessible names | 4.1.2 | `/quran/[slug]` | Added `accessibleLabel` field ("Small text size" etc.) |
| 6.1 | Transliteration missing `lang` in word-by-word | 3.1.2 | `/ayah/[s]/[a]` | Added `lang="ar-Latn"` on transliteration, `lang="en"` on gloss |
| 9.2 | Settings size/spacing buttons lacked group context | 4.1.2 | `/settings` | Added `role="group" aria-label` wrappers + `aria-label` on each button |
| 10.1 | Report page missing `<form>` element | 1.3.1, 3.2.2 | `/report` | Wrapped fields in `<form>`, changed submit button to `type="submit"` |

### Medium Severity (2 deferred)

| ID | Finding | WCAG | Reason for deferral |
|----|---------|------|---------------------|
| 4.2 | Ayah cards lack heading elements | 1.3.1 | Adding h2/h3 per ayah would create 286+ headings on al-Baqarah — a worse experience. The `aria-label` + `id` pattern provides jump-to-anchor capability. Larger redesign needed. |
| 6.3 | Word-by-word grid layout may cause visual/DOM reading order mismatch | 1.3.2 | The `<ol>` preserves DOM reading order correctly for screen readers. Visual grid is a CSS concern that requires a layout redesign to fully resolve. |

### Low Severity (10 found, documented for future sprints)

| ID | Finding | WCAG | Notes |
|----|---------|------|-------|
| 1.1 | No explicit `dir="ltr"` on `<html>` | 1.3.1 | Default LTR is correct; explicit would be marginally more robust |
| 2.2 | Duplicate "Primary" nav landmarks in DOM | 1.3.1 | One hidden via CSS at each breakpoint; acceptable |
| 2.3 | Hidden Arabic text in header lacks `lang`/`dir` | 3.1.2 | `aria-hidden` makes this moot |
| 4.3 | Comprehension panel missing `aria-controls` | 4.1.2 | Minor — `aria-expanded` is present |
| 6.2 | Word gloss missing `lang="en"` | 3.1.2 | **Fixed** — added `lang="en"` in this sprint |
| 7.1 | No arrow-key navigation between graph nodes | 2.1.1 | Tab-through is functional; arrow keys would be an enhancement |
| 7.2 | Graph edges have no accessible representation | 1.1.1 | Detail panel shows connections; edges are decorative |
| 8.3 | TranslationSelector search input missing `aria-label` | 4.1.2 | **Fixed** — added `aria-label="Search translations"` |
| 8.4 | TranslationSelector listbox missing `aria-label` | 4.1.2 | **Fixed** — added `aria-label="Available translations"` |
| 9.1 | Checkboxes use `focus:` instead of `focus-visible:` | 2.4.7 | Cosmetic inconsistency, not a failure |
| 10.2 | Report form required fields not indicated | 3.3.2 | No fields are actually required (all accept empty input with "not provided" placeholders) |
| 10.3 | Report form lacks validation/error messaging | 3.3.1 | By design — the form accepts partial input |

---

## §3. Changes Made

### Files modified (8)

| File | Change |
|------|--------|
| `src/components/quran/translation-selector.tsx` | Rewrote with `role="dialog"`, `aria-label="Translation selector"`, Escape key handler, focus return to trigger, backdrop `aria-hidden`, search input `aria-label`, listbox `aria-label` |
| `src/components/search/search-box.tsx` | Added `aria-live="polite"` status region announcing suggestion count |
| `src/components/quran/ayah-card.tsx` | Added `lang="ar-Latn"` on transliteration paragraph |
| `src/components/quran/word-by-word.tsx` | Added `lang="ar-Latn"` on transliteration, `lang="en"` on translation gloss |
| `src/components/layout/site-header.tsx` | Added `"use client"`, `usePathname()` hook, `aria-current="page"` on active nav links with visual styling |
| `src/components/quran/reader-controls.tsx` | Added `accessibleLabel` to SIZES array, applied as `aria-label` on each button |
| `src/app/settings/page.tsx` | Added `role="group" aria-label` on size and spacing button groups, `aria-label` on individual size buttons |
| `src/app/report/page.tsx` | Wrapped fields in `<form>`, changed "Prepare report" to `type="submit"` with `onSubmit` handler |

### No new dependencies added.

---

## §4. Before/After Evidence

### Finding 8.2 — TranslationSelector (High)
**Before:** Custom dropdown with `<div>` backdrop, no focus trap, no Escape handling, no ARIA overlay role, search input had no `aria-label`.
**After:** `role="dialog" aria-label="Translation selector"`, `onKeyDown` Escape handler returns focus to trigger, backdrop has `aria-hidden="true"`, search input has `aria-label="Search translations"`, listbox has `aria-label="Available translations"`.
**Verified:** `curl /settings` confirms `aria-haspopup="listbox"` on trigger. Source code confirms all ARIA attributes.

### Finding 3.1 — Search suggestions announcement (Medium)
**Before:** Suggestions appeared silently — screen readers had no notification of the list.
**After:** `<div aria-live="polite" aria-atomic="true" className="sr-only" role="status">` announces "N suggestions available" when the list appears.
**Verified:** `curl /search` confirms `aria-live="polite"` is present in the rendered HTML.

### Finding 4.1 + 6.1 — Transliteration lang attributes (Medium)
**Before:** Transliteration rendered as `<p className="...">` with no `lang` attribute.
**After:** `<p lang="ar-Latn" className="...">` in both ayah-card and word-by-word.
**Verified:** `curl /quran/al-baqarah` confirms `lang="ar-Latn"` appears in the HTML. `curl /ayah/2/255` confirms both `lang="ar-Latn"` and `lang="en"`.

### Finding 2.1 — Desktop nav aria-current (Medium)
**Before:** Desktop nav links had no `aria-current` attribute.
**After:** `usePathname()` determines the current route; matching links get `aria-current="page"` and a visual highlight (`bg-secondary text-foreground`).
**Verified:** `curl /quran/al-baqarah` confirms `aria-current="page"` appears in the rendered HTML.

### Finding 5.1 — Reader controls button names (Medium)
**Before:** Size buttons announced as "S, button, pressed" — no context about what S controls.
**After:** Each button has `aria-label="Small text size"` / `"Medium text size"` / `"Large text size"` / `"Extra large text size"`.
**Verified:** `curl /quran/al-baqarah` confirms `aria-label="Small text size"` in the HTML.

### Finding 9.2 — Settings button groups (Medium)
**Before:** Size and spacing buttons had no group context on the settings page.
**After:** Both groups wrapped with `role="group" aria-label="Arabic text size"` and `role="group" aria-label="Line spacing"`. Individual size buttons also carry `aria-label="Text size: small"` etc.
**Verified:** `curl /settings` confirms both `role="group"` wrappers.

### Finding 10.1 — Report page form (Medium)
**Before:** Report fields in a `<section>` with no `<form>` element. Enter key did not submit.
**After:** Fields wrapped in `<form onSubmit>`, "Prepare report" changed to `type="submit"`.
**Verified:** `curl /report` confirms `<form` and `type="submit"` in the HTML.

---

## §5. Automated Test Results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | ✅ Clean — no errors, no warnings |
| Typecheck | `pnpm typecheck` | ✅ Clean — no errors |
| Tests | `pnpm test` | ✅ **387/387 passed** across 22 files |
| Build | `pnpm build` | ✅ Succeeded — all routes pre-rendered |

No tests were added this sprint (accessibility changes are primarily attribute-level and structural; the existing test suite already covers component behavior). No tests were broken.

---

## §6. Manual Browser Verification

Browser automation module (`browser-use`) was unavailable at its expected path during QA. Verification was performed via curl-based HTML inspection of the running dev server at `http://localhost:3000`:

| Check | Page | Method | Result |
|-------|------|--------|--------|
| Skip link present | `/` | `curl` grep `#main-content` | ✅ Present |
| HTML `lang="en"` | `/` | `curl` grep `<html` | ✅ Present |
| `aria-current="page"` on active nav | `/quran/al-baqarah` | `curl` grep | ✅ 2 matches (Read + matching prefix) |
| `aria-live="polite"` on search | `/search` | `curl` grep | ✅ Present |
| `lang="ar-Latn"` transliteration | `/quran/al-baqarah` | `curl` grep | ✅ Present |
| `lang="ar-Latn"` + `lang="en"` word-by-word | `/ayah/2/255` | `curl` grep | ✅ Both present |
| `aria-label="Small text size"` | `/quran/al-baqarah` | `curl` grep | ✅ Present |
| `aria-haspopup="listbox"` trigger | `/settings` | `curl` grep | ✅ Present |
| `<form` element on report | `/report` | `curl` grep | ✅ Present |
| `type="submit"` button | `/report` | `curl` grep | ✅ Present |
| `role="group" aria-label` on settings | `/settings` | `curl` grep | ✅ 2 matches |
| Knowledge graph `tabindex="0"` | `/explore/graph` | `curl` grep | ✅ Present |
| Knowledge graph `<details>` fallback | `/explore/graph` | `curl` grep | ✅ Present |
| 404 for invalid references | `/ayah/999/1`, `/quran/nonexistent`, `/topics/nonexistent` | `curl -w %{http_code}` | ✅ All return 404 |
| All 9 routes render | `/`, `/search`, `/quran/al-baqarah`, `/ayah/2/255`, `/settings`, `/report`, `/discover`, `/topics/patience`, `/explore/graph` | `curl` | ✅ All return HTML |

---

## §7. Remaining Barriers and Deferred Work

### For Sprint 21 or later:

1. **Ayah card headings** (Finding 4.2) — Adding per-ayah headings would create an overwhelming heading outline on long surahs. A jump-to-ayah control or landmark-based approach would be better.
2. **Arrow-key navigation in knowledge graph** (Finding 7.1) — Roving tabindex or arrow-key handlers within the SVG would reduce Tab fatigue on dense graphs.
3. **Graph edge accessibility** (Finding 7.2) — Individual edge descriptions would require a parallel data table or description list.
4. **Word-by-word RTL grid reading order** (Finding 6.3) — CSS grid column layout may cause visual order to differ from DOM order on multi-column layouts. Requires a flex-wrap or CSS-only reorder approach.
5. **Touch target sizes** — Calendar days (28px), SVG graph nodes (20–28px), audio button (~30px), and switch (20px) are below the 44px WCAG recommendation. Most are mitigated by keyboard accessibility or wrapping labels.
6. **Contrast** — `text-gold` on card backgrounds (~4.3:1) fails AA for normal-size text. Currently used for decorative elements only, but any body text using `text-gold` would need a darker variant.

---

## §8. Explicit Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`.
- ✅ No Quran text, translations, Tafsir, citations, or source attribution were altered.
- ✅ No fabricated content or scholarly-review records were added.
- ✅ Existing search filters, autocomplete, global `/` shortcut, and keyboard navigation are preserved.
- ✅ No new dependencies or third-party analytics were added.
- ✅ No accounts, tracking, persistent search history, or cross-device synchronization were added.
- ✅ Licensing state unchanged.
- ✅ Responsive behavior preserved — no horizontal overflow introduced.
- ✅ Sprint 21 has not been started.
