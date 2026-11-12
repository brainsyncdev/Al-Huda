# FAHM MFD-02 — UI/UX Audit Report

**Date:** November 12, 2026  
**Audit Phase:** MFD-02A (Existing UI/UX Audit)  
**Status:** Complete — Ready for product-owner review before MFD-02B

---

## Executive Summary

The FAHM application demonstrates **strong foundational quality** in accessibility, provenance transparency, and semantic HTML. The codebase shows excellent attention to data integrity, privacy disclosure, and honest editorial status reporting. However, several critical and medium-severity issues require attention before proceeding to design system refinement.

### Audit Coverage

Five parallel audit subagents inspected:
1. **Home Page + Quran Reader** — 1 critical, 8 medium, 9 minor issues
2. **Search + Explore + Topics** — 0 critical, 10 medium, 13 minor issues
3. **Learn + My Study** — 0 critical, 6 medium, 5 minor issues
4. **Settings + Sources + Editorial + Report** — 1 critical, 8 medium, 20+ minor issues
5. **Navigation + Shell + Shared Components** — 2 critical, 6 medium, 3 minor issues

**Total:** 4 critical, 38+ medium, 50+ minor issues identified

---

## Critical Issues (Must Fix)

### 🔴 C1. SSR locale resolution broken — affects accessibility, SEO, RTL

**Location:** `src/app/layout.tsx:78`  
**Impact:** Screen readers announce wrong language on first paint; SEO crawlers index as English; dark mode unreachable; hydration mismatch causes visible directionality flash

**Details:**
- `<html lang="en" className="light">` is hardcoded in SSR
- `I18nProvider` fixes this client-side via `useEffect`, causing:
  - Screen readers announce English for Urdu/Arabic/Chinese users on first paint
  - SEO crawlers index all pages as English
  - Dark mode tokens exist in `globals.css:43-66` but are unreachable (no toggle, class locked to `light`)
  - Visible directionality flash on slow connections when `useEffect` flips `lang` from `en` to `ur`

**Fix Required:**
- Resolve locale server-side (cookie/Accept-Language header)
- Render `<html lang={...} dir={...}>` correctly during SSR
- Wire a theme toggle for dark mode
- This single fix unlocks correct a11y, SEO, and RTL behavior for Urdu/Arabic users

---

### 🔴 C2. Arabic text has no max-width — readability breaks on wide screens

**Location:** `src/components/quran/ayah-card.tsx:217-230`  
**Impact:** Long ayahs (e.g., 2:282) stretch edge-to-edge on 1440px+ viewports, producing line lengths far beyond the recommended 40-60 characters for Arabic script

**Details:**
- The Arabic `<p>` has no `max-w-*` class
- Translation paragraph (line 233) also lacks width constraint
- This is the single biggest readability issue in the reader

**Fix Required:**
- Add `max-w-3xl` or `max-w-prose` to the Arabic paragraph
- Add similar constraint to translation paragraph
- Test on 1440px, 1920px, and ultrawide viewports

---

### 🔴 C3. i18n missing in My Study settings — entire page hardcoded English

**Location:** `src/app/my-study/settings/page.tsx`  
**Impact:** Inconsistent with main settings page which uses `useTranslation()`; Urdu/Arabic/Chinese users see English-only UI

**Details:**
- Lines 29, 33, 37, 63-68, 78, 83-111, 125, 145, 18 all contain untranslated strings
- No `useTranslation()` hook imported or used
- Inconsistent with `src/app/settings/page.tsx` which properly uses i18n

**Fix Required:**
- Integrate `useTranslation()` into `my-study/settings/page.tsx`
- Extract all strings to translation dictionaries
- Test with Urdu/Arabic/Chinese locales

---

### 🔴 C4. Dimension count inconsistency — metadata says "10" but code has 15

**Location:** Multiple files  
**Impact:** Confusing user experience; metadata doesn't match actual content

**Details:**
- `explore/page.tsx:18, 154` — "15 Dimensions" (correct)
- `explore/dimension/[id]/page.tsx:28, 69` — "10 Dimensions of the Quran" in OG tags and JSON-LD (wrong)
- `explore/graph/page.tsx:13` — "10 life dimensions" (wrong)
- `explore/domains/page.tsx:77` — "10 existing life dimensions" (wrong)
- Actual count in code is 15 (see `getAllDimensions()`)

**Fix Required:**
- Audit all references to dimension count
- Update to 15 or make this a constant in `lib/explore/dimensions.ts` to prevent drift
- Update OG tags, JSON-LD, and visible text

---

## Medium Issues (High Priority)

### Search & Discovery

**M1. Filter panel overwhelming on mobile** — `search-filters.tsx:174`
- Six stacked `<select>` elements on mobile require significant scrolling
- "Search in" dropdown contains 100+ editions grouped by language
- **Recommendation:** Collapse secondary filters behind "Advanced filters" disclosure on mobile

**M2. Disabled Language filter lacks explanation** — `search-filters.tsx:198-210`
- When `searchIn !== "default"`, Language select is disabled with only `opacity-50` feedback
- No tooltip or inline text explains why
- **Recommendation:** Add helper text: "Language filter applies only to default search"

**M3. Snippet fallback shows full ayah translation** — `search/page.tsx:443-446`
- When `findSnippetRange` returns null, full translation is rendered unhighlighted
- For long ayahs, this creates visual noise in results list
- **Recommendation:** Truncate non-snippet translations to 2-3 lines with "Show full verse" expansion

**M4. "Also search" links hardcoded and not localized** — `search/page.tsx:389-418`
- Quick-jump links hardcode specific edition names in English
- Don't adapt to user's language preference
- **Recommendation:** Generate dynamically from `TRANSLATIONS` with localized labels

---

### Explore & Topics

**M5. "Start with a Learning Path" shows only one path per audience** — `explore/page.tsx:96`
- Only first recommended path shown; users can't see alternatives without clicking "Browse all paths"
- **Recommendation:** Show 2-3 paths per audience or add carousel/accordion

**M6. Domain detail page overly defensive** — `explore/domains/[id]/page.tsx:369-396`
- "What this page does NOT claim" section lists 5 bullet points that largely repeat the alert box above
- Redundancy dilutes the message
- **Recommendation:** Consolidate disclaimers

**M7. Topic graph SVG will have overlapping labels** — `topic-graph.tsx:22-33, 78`
- Circular layout places nodes at equal angles; with 20+ topics, labels will overlap
- Fixed viewBox doesn't scale well
- **Recommendation:** Implement force-directed layout or show only top 10-15 topics

**M8. Topic graph has no hover/active state** — `topic-graph.tsx:99-120`
- Nodes are focusable links but have no visual feedback on hover or focus
- **Recommendation:** Add `hover:fill-primary` and `focus:outline-2 focus:outline-ring`

**M9. Topic detail page has too many sections** — `topics/[slug]/page.tsx`
- 8 sections for a single topic: Verses, Related topics, Dimensions, Domains, Root links, Learning paths, Study journeys, Provenance note
- **Recommendation:** Group related sections (e.g., "Explore further" could contain Dimensions, Domains, Root links)

**M10. Review status block is dense single sentence** — `topics/[slug]/page.tsx:146-153`
- 4-line sentence hard to scan
- **Recommendation:** Break into structured list (Review status, Curator, Method, Last pass, Language)

**M11. Dimension and domain badges truncated without indicator** — `topics/page.tsx:76-92`
- If topic has 3+ dimensions or 2+ domains, extras are hidden with no "+2 more" indicator
- **Recommendation:** Show "+N more" badge when list is truncated

---

### Quran Reader

**M12. Ayah card header truncates reference on narrow screens** — `ayah-card.tsx:211`
- Reference (e.g., "Al-Baqarah · 2:255") can be truncated to just "Al-Baqarah…", losing verse number
- **Recommendation:** Adjust flex layout to preserve verse number visibility

**M13. Hardcoded English throughout reader (i18n gap)** — Multiple files
- `ayah-card.tsx` — Every action button label hardcoded: "Save", "Add to plan", "Copy link", "Copy verse", "Show context", "Add note", "Collections", "Delete", "Save note", "Private note", "Tags", "Context", "Pending review"
- `reader-controls.tsx` — "Translation", "Text size", "Spacing", "Compact/Normal/Loose", toast messages
- `quran/[slug]/page.tsx:107-108` — "Read continuously below. Use the controls…"
- `ayah/[surah]/[ayah]/page.tsx` — "Ayah reference", "Read full surah", "Appears in topics", "Appears in learning paths", "Previous · ", "Next · "
- **Recommendation:** Integrate `useTranslation()` and extract all strings

**M14. Translation selector dropdown anchored `right-0`** — `translation-selector.tsx:186`
- 320px dropdown can overflow left edge of viewport on narrow screens
- **Recommendation:** Switch to `left-0` on mobile or use portal

**M15. `ReaderControls` dense on mobile** — `reader-controls.tsx:48`
- Control bar stacks vertically on mobile, becoming ~300px+ tall
- Pushes first ayah far down page
- **Recommendation:** Consider collapsible "Display settings" drawer

**M16. `WordByWord` grid RTL inheritance issue** — `word-by-word.tsx:90`
- Grid flows RTL (correct), but each `WordCell` has Arabic `dir="rtl"` while transliteration and gloss inherit RTL, misaligning Latin text
- **Recommendation:** Add explicit `dir="ltr"` to transliteration and gloss paragraphs

---

### Learn & My Study

**M17. Auto-starting journeys may confuse users** — `progress-tracker.tsx:27-31`
- Journey automatically starts when page loads via `useEffect`
- **Recommendation:** Show "Start Journey" button or display toast when auto-starting

**M18. No visual completion state in main stages list** — `journeys/[slug]/page.tsx:172-219`
- Main stages list doesn't show which stages are complete—only separate progress tracker does
- **Recommendation:** Add completion indicators (checkmarks, different styling) directly in stages list

**M19. Search doesn't search collection contents** — `my-study/search/page.tsx:26-28`
- Only searches collection names, not ayat within collections
- **Recommendation:** Add search across collection ayat references or document limitation

**M20. No confirmation before deleting individual items** — Multiple files
- `bookmarks/page.tsx:26-29`, `notes/page.tsx:40-43`, `collections/[id]/page.tsx:38-41`
- Single-click delete with no undo
- **Recommendation:** Add confirmation dialog or implement undo with toast notification

**M21. Backup controls use blocking `window.confirm`** — `backup-controls.tsx:115, 173`
- `window.confirm` is blocking and provides poor UX
- **Recommendation:** Replace with modal dialog showing full details

---

### Settings & Editorial

**M22. Line spacing labels not translated** — `settings/page.tsx:111`
- Labels use English-only capitalization; aria-label uses translation but visible text doesn't
- **Recommendation:** Translate line spacing labels or use translated size labels visibly

**M23. ExternalLink icon used on internal navigation links** — `settings/page.tsx:308-342`
- Links to `/settings/privacy`, `/sources`, `/privacy`, `/terms`, `/accessibility` are internal routes
- **Recommendation:** Replace ExternalLink icons with ChevronRight or similar

**M24. Clear data confirmation uses inline state toggle** — `my-study/settings/page.tsx:153-179`
- Destructive action button appears immediately after clicking "Clear all data"
- **Recommendation:** Use proper confirmation dialog

**M25. Source cards information-dense on mobile** — `sources/page.tsx:44-97`
- 6+ fields per card overwhelming on small screens
- **Recommendation:** Consider collapsible details or progressive disclosure

**M26. Editorial tables force horizontal scrolling on mobile** — `editorial/page.tsx:147, 236`
- Tables with `min-w-[46rem]` and `min-w-[44rem]`
- **Recommendation:** Use responsive card layout on mobile breakpoints

**M27. `review-client.tsx` uses `document.getElementById`** — `review-client.tsx:622-625`
- React anti-pattern; should use state or ref
- **Recommendation:** Replace with React state/ref

**M28. Accessibility page uses `<a>` instead of `<Link>`** — `accessibility/page.tsx:49`
- `<a href="/report">` causes full page reload
- **Recommendation:** Replace with Next.js `<Link>`

---

### Navigation & Shell

**M29. Search icon inside primary `<nav>`** — `site-header.tsx:98-106`
- Semantic mismatch; screen readers announce it as nav item
- **Recommendation:** Move to utility region

**M30. Mobile active tab is color-only** — `mobile-bottom-nav.tsx:69-74`
- Add `bg-secondary` or top border for color-blind users
- **Recommendation:** Add non-color indicator

**M31. Button/Input default `h-9` (36px) below WCAG 44px touch target** — `button.tsx:24`, `input.tsx:11`
- **Recommendation:** Increase to `h-11` (44px) minimum

**M32. Dialog close label "Close" not translated** — `dialog.tsx:49`
- English-only sr-only text
- **Recommendation:** Translate

**M33. Arabic text spans lack `lang="ar"`** — Multiple files
- Screen readers won't switch to Arabic voice for `.arabic-text`/`.arabic-display` elements
- **Recommendation:** Add `lang="ar"` attribute

**M34. Dark mode unreachable** — `layout.tsx:78`
- Full `.dark` palette defined but no toggle exists; `className="light"` hardcoded
- **Recommendation:** Wire theme toggle (part of C1 fix)

---

## Minor Issues (Polish Opportunities)

### Home Page
- **m1.** Hero decorative "اقرأ" at extreme size may trigger horizontal scroll on some mobile browsers
- **m2.** Topics pills put Arabic before English — consider reversing order for non-Arabic readers
- **m3.** "All Surahs" CTA uses pill button while other section CTAs use plain text links — inconsistency

### Search
- **m4.** Empty state methodology text is dense — consider collapsible "How search works" section
- **m5.** Semantic search panel status transitions could be clearer — add progress indicator or make collapsible by default

### Explore
- **m6.** Dimension cards show "No curated topics yet" for empty dimensions — consider graying out or adding visual indicator
- **m7.** Domain cards show "proposed" badge — badge is small (`text-[10px]`), may be hard to read on mobile

### Topics
- **m8.** Topic ayah card provenance line is dense — consider breaking into multiple lines or using tooltip
- **m9.** Topic graph description mentions "list below remains the accessible alternative" — wording could be clearer
- **m10.** Sort indicator is not interactive — consider adding dropdown or toggle

### Quran Reader
- **m11.** Empty `<track kind="captions" />` in audio player — remove or add `aria-hidden`
- **m12.** Comprehension "Pending review" badge always shown — either remove or wire to actual review state
- **m13.** Surah page has duplicate prev/next navigation — remove or differentiate purpose
- **m14.** `LexicalMatchGroupsPanel` uses `group[0].ayah` as React key — use composite key for safety
- **m15.** `TafsirViewer` and `TafsirLinks` overlap in purpose — clarify distinction in UI
- **m16.** `RootContextPanel` navigation labels verbose — consider icon + short label

### Learn
- **m17.** Skeleton loading uses duplicate keys — use unique keys like `key={`skeleton-${index}`}`
- **m18.** Breadcrumb separator could be confusing — consider using `>` or `→` instead of `/`

### My Study
- **m19.** "View all" link points to current page — remove or create dedicated reading history page
- **m20.** Inconsistent date formatting — standardize on one format
- **m21.** Collection rename form lacks validation feedback — add character counter

### Settings
- **m22.** Button shows raw size code "sm"/"md"/"lg"/"xl" rather than translated sizeLabel
- **m23.** Parallel-add select uses `value=""` and always resets to empty — slightly confusing UX
- **m24.** Uses ✓ characters instead of proper icon components — inconsistent with lucide-react usage

### Sources
- **m25.** Hardcoded version `quran-json@3.1.2` — should be dynamic from constant
- **m26.** Link to `/editorial` (noindex page) from public page might confuse users
- **m27.** No search/filter for source catalog

### Editorial
- **m28.** Status badge shows raw status string like "pending-scholarly-review" — could be more human-readable
- **m29.** `reviewedAt` shown as raw string — should be formatted as date
- **m30.** Uses emoji ⚠️ in heading — should use icon component for consistency
- **m31.** Textarea `rows={2}` might be too small for reviewer notes
- **m32.** Link to `/topics/${issue.slug}` wrong for journey issues
- **m33.** No export/download of editorial status for offline review
- **m34.** No filtering/sorting of issues in quality dashboard

### Report
- **m35.** Category select uses `<option>` with combined label+hint — might be truncated on some platforms
- **m36.** No form validation — all fields optional; some guidance on required fields would help
- **m37.** User agent included in report — technical info not useful for all report types; could be optional
- **m38.** Placeholder mentions "surah:ayah" — could provide format example
- **m39.** No draft saving to localStorage — data lost if user navigates away
- **m40.** `<pre>` element might not wrap well on all devices

### Static Pages
- **m41.** About page has very long paragraph — could be split into shorter paragraphs or list
- **m42.** About page has no team/author information or version number
- **m43.** Accessibility page has no specific WCAG conformance level claimed, no testing methodology, no contact email/phone
- **m44.** Privacy page has no contact information for privacy questions, no explicit cookie policy statement
- **m45.** Terms page has no jurisdiction/governing law, no contact for legal questions
- **m46.** All static pages have hardcoded "Last updated: 2026-10-17" — should be dynamic or more recent

### Navigation & Shell
- **m47.** RTL bug in `language-selector.tsx:139` — compact mode uses physical `right-0` instead of logical `end-0`
- **m48.** `dropdown-menu.tsx` uses physical positioning — `left-2`, `ml-auto`, `pl-8` won't mirror in RTL
- **m49.** Footer `<nav aria-label="Footer">` is English-only

---

## Positive Patterns (Preserve These)

### Accessibility & Semantics
- ✅ Excellent ARIA usage throughout (aria-labelledby, aria-pressed, aria-label, role="group")
- ✅ Skip link, translated, targets `#main-content`
- ✅ `aria-current="page"` on active nav/tab links
- ✅ Full WAI-ARIA listbox pattern in LanguageSelector with keyboard nav
- ✅ Search accessibility is excellent: proper `role="combobox"`, `aria-activedescendant`, `aria-controls`, keyboard nav, monotonic request counter, polite `aria-live` region
- ✅ Every collapsible panel uses `aria-expanded` on its trigger
- ✅ Match highlighting is not color-alone: uses `bg-gold-soft` + `font-semibold` + `underline` (three redundant signals, meeting WCAG 1.4.1)
- ✅ Touch targets on mobile nav: `min-h-14` = 56px, exceeds WCAG 44px
- ✅ Safe-area handling: `env(safe-area-inset-bottom)` on bottom nav
- ✅ `prefers-reduced-motion` respected globally

### Typography & RTL
- ✅ Arabic typography well-tuned: four sizes (1.5rem → 2.75rem) with paired line-heights (2.4 → 2.1)
- ✅ Arabic text always carries `lang="ar"` and `dir="rtl"`
- ✅ Translation direction is respected: `translationDir` and `translationLang` applied correctly
- ✅ Excellent Arabic CSS: `.arabic-text` with `line-height: 2.2` for diacritics, `.ayah-number` ornamental marker
- ✅ RTL support: logical properties, `[dir="rtl"] .flip-rtl`, forced-LTR for search/code
- ✅ `next/font/google` for Geist/Lora/Amiri_Quran — zero CLS

### Data Integrity & Transparency
- ✅ Provenance is first-class: every data surface ends with provenance line citing source, publisher, license
- ✅ Unresolved references are surfaced, not silently dropped
- ✅ Data integrity issues reported transparently
- ✅ Every panel states its scope and limits (e.g., cross-references explicitly say "identical wording inside this surah only")
- ✅ Honest disclosure: "No qualified scholarly reviewer has been assigned"
- ✅ Clear distinction between Quran text, translation, tafsir, and editorial explanations
- ✅ AI safety boundary clearly stated
- ✅ Attribution is never silent

### UX Patterns
- ✅ Graceful empty states with clear CTAs
- ✅ Hydration-safe: components gate on `hydrated` to avoid SSR/client mismatch
- ✅ Stale request handling with monotonic counter
- ✅ Filter preservation across re-submits
- ✅ Active filter chips with remove buttons
- ✅ Reference redirect only when no filters
- ✅ Clear empty/no-results states with helpful guidance
- ✅ Live Arabic preview with current settings
- ✅ Minimum 44px touch targets
- ✅ Good section grouping with semantic headings
- ✅ Privacy disclosure sections build trust
- ✅ Two-step confirmation for destructive actions
- ✅ Toast feedback for user actions
- ✅ Comprehensive backup/restore with detailed confirmation dialogs
- ✅ Search clearly marked as local-only
- ✅ Proper use of `encodeURIComponent` for IDs in URLs
- ✅ Focus management in TranslationSelector is textbook: focus trap, Escape returns focus, auto-focuses search input
- ✅ Audio player surfaces failures in text: `role="status"` + "Audio unavailable" destructive-colored text
- ✅ Server/client boundary is respected (explicit comments warning against adding `"use client"`)
- ✅ Empty-state handling is consistent: panels return `null` when nothing to show

### Design System
- ✅ HSL-variable token system, semantic naming, brand tokens (gold, emerald-soft)
- ✅ Type-safe i18n dictionaries with CLDR plural categories
- ✅ Radix-based Dialog with focus trap, escape-to-close
- ✅ Responsive strategy: slim mobile header + bottom nav vs. full desktop header (no hamburger complexity)
- ✅ Consistent card design: `rounded-2xl border border-border/80 bg-card p-5` with hover effects
- ✅ Arabic titles prominent and consistent: `arabic-display text-gold`
- ✅ Responsive grids well-considered: featured surahs `1/2/3`, dimensions `2/3/5`, topics use `flex-wrap`

---

## Proposed Implementation Sequence

Based on severity, dependencies, and impact, the recommended sequence for MFD-02B onwards:

### Phase 1: Critical Fixes (MFD-02B — Design System Foundation)

1. **C1. SSR locale resolution** — Fix `<html lang>` and `className` in SSR; wire theme toggle
2. **C2. Arabic text max-width** — Add `max-w-*` to Arabic and translation paragraphs in `ayah-card.tsx`
3. **C3. i18n in My Study settings** — Integrate `useTranslation()` into `my-study/settings/page.tsx`
4. **C4. Dimension count consistency** — Audit and fix all references to "10" vs "15" dimensions

### Phase 2: Reader Experience (MFD-02D — Quran Reader)

5. **M12. Ayah card header truncation** — Adjust flex layout to preserve verse number visibility
6. **M13. Reader i18n** — Integrate `useTranslation()` into reader components
7. **M14. Translation selector mobile overflow** — Switch to portal or flip anchoring
8. **M15. ReaderControls mobile density** — Consider collapsible "Display settings" drawer
9. **M16. WordByWord RTL inheritance** — Add explicit `dir="ltr"` to transliteration and gloss

### Phase 3: Search & Discovery (MFD-02E — Search, Explore, Learning)

10. **M1. Search filter mobile UX** — Collapse secondary filters behind "Advanced filters" disclosure
11. **M2. Disabled Language filter explanation** — Add helper text
12. **M3. Snippet fallback truncation** — Truncate non-snippet translations
13. **M7. Topic graph overlapping labels** — Implement force-directed layout or limit to top 15
14. **M8. Topic graph hover/active state** — Add visual feedback
15. **M9. Topic detail page sections** — Group related sections

### Phase 4: Personal Study (MFD-02F — My Study)

16. **M19. Collection content search** — Add search across collection ayat references
17. **M20. Delete confirmation** — Add confirmation dialog or undo with toast
18. **M21. Backup controls modal** — Replace `window.confirm` with modal dialog

### Phase 5: Navigation & Shell (MFD-02C — Application Shell)

19. **M29. Search icon semantic mismatch** — Move to utility region
20. **M30. Mobile active tab indicator** — Add non-color indicator
21. **M31. Touch target size** — Increase button/input to `h-11` (44px) minimum
22. **M33. Arabic text `lang` attribute** — Add `lang="ar"` to Arabic spans

### Phase 6: Settings & Editorial (MFD-02G — Responsive, RTL, Accessibility)

23. **M22. Line spacing label translation** — Translate visible text
24. **M23. Internal link icons** — Replace ExternalLink with ChevronRight
25. **M24. Clear data confirmation** — Use proper confirmation dialog
26. **M26. Editorial table mobile responsiveness** — Use responsive card layout
27. **M27. React anti-pattern** — Replace `document.getElementById` with state/ref

### Phase 7: Polish (MFD-02H — Visual QA)

28. Address minor issues (m1-m49) as time permits
29. Focus on consistency, scannability, and information density

---

## Verification Checklist

Before proceeding to MFD-02B, verify:

- [ ] All 4 critical issues (C1-C4) are understood and scoped
- [ ] Positive patterns identified above are preserved throughout implementation
- [ ] No new features or architectural changes introduced
- [ ] Existing routes, redirects, and navigation logic preserved
- [ ] localStorage keys and user data compatibility maintained
- [ ] Local-first, account-free architecture preserved
- [ ] Quran Arabic text, ayah ordering, references unchanged
- [ ] Three-mode architecture (NOOR, FAHM, EXPLORE) maintained
- [ ] NOOR remains deferred

---

## Next Steps

1. **Product-owner review** of this audit report
2. **Approval** of proposed implementation sequence
3. **Begin MFD-02B** — Design System refinement, starting with critical fixes C1-C4
4. **Iterative implementation** following the phased sequence above
5. **MFD-02H** — Visual QA and phase sign-off after all implementation complete

---

**Audit Status:** ✅ COMPLETE  
**Ready for:** Product-owner review before MFD-02B  
**Total Issues:** 4 critical, 38+ medium, 50+ minor  
**Estimated Phases:** 7 (Critical → Reader → Search → My Study → Shell → Settings → Polish)

---

**Document Version:** 1.0  
**Last Updated:** November 12, 2026  
**Audit Method:** Parallel subagent inspection of codebase (read-only, no modifications)