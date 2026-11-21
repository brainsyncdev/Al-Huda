# WS5: Translation Fallback Gap Remediation Report

**Work Stream:** WS5 — Translation Fallback Verification (MFD-12.4)  
**Date:** 2026-11-21  
**Proposed By:** ai-assisted  
**Review Status:** pending-review  

---

## Executive Summary

This report documents the remediation of 3 actionable gaps identified during WS5 fallback verification. All fixes preserve backward compatibility with enforcement OFF mode and do not modify canonical Qur'anic text or DEFAULT_TRANSLATION_ID.

| Gap | Severity | Status |
|-----|----------|--------|
| 1. TafsirViewer semantic mismatch | HIGH | ✅ FIXED |
| 2. Search results misattribution | MEDIUM | ✅ FIXED |
| 3. No indicator for 403/no-fallback path | MEDIUM | ✅ FIXED |

---

## Gap 1: TafsirViewer Semantic Mismatch [HIGH]

### Problem
When rights enforcement is ON, gated Arabic tafsir editions (`ar.jalalayn`, `ar.muyassar`) fall back to `en.sahih` English translation via the generic fallback chain. The `TafsirBlock` component displayed this English translation under the Arabic tafsir heading with no indicator, creating a semantic mismatch that could mislead users about the nature of the content.

### Root Cause
`TafsirBlock` called `useTranslationText()` which triggers the generic fallback mechanism, but never checked `isFallback()` or `isGated()` from the translation store.

### Fix Applied
**File:** `src/components/quran/tafsir-viewer.tsx`

1. Added imports: `isFallback`, `isGated`, `getGatedMetadata`, `getActualEdition` from translation-store; `ExternalLink` icon from lucide-react.

2. In `TafsirBlock`, added checks for:
   - `isTafsirFallback`: When true, displays an amber notice explaining that the tafsir is under rights review and showing a translation instead, with a link to the original tafsir on Tanzil.net. Adjusts `lang` and `dir` attributes to match the actual (fallback) edition.
   - `isTafsirGated && !isTafsirFallback`: When the tafsir is gated with no fallback available, renders a "translation unavailable" card with external link instead of showing misleading content.
   - Conditionally hides the Arabic text container and source attribution when in gated-no-fallback state.

### Backward Compatibility
When enforcement is OFF, `isFallback()` returns false and `isGated()` returns false, so the component renders identically to before.

---

## Gap 2: Search Results Misattribution [MEDIUM]

### Problem
`EditionSearchResultsView` received search results from `searchTranslationEdition()` which correctly computed `fallbackFromEditionId`, but the component never read or displayed this field. Users saw "matches in Jalandhry (Urdu)" when the actual hits came from Saheeh International (English). The API route also omitted this field from its JSON response.

### Root Cause
The `fallbackFromEditionId` field existed on `TranslationSearchResults` but was not threaded through to the UI component or API response.

### Fix Applied

**File:** `src/app/search/page.tsx`
1. Updated the `EditionSearchResultsView` call site to pass `fallbackFromEditionId={editionResult.fallbackFromEditionId ?? null}`.
2. Added `fallbackFromEditionId` prop to `EditionSearchResultsView` component signature.
3. Added a `role="status"` amber notice banner at the top of search results when fallback occurred, showing both the actual edition serving results and the originally requested edition.

**File:** `src/app/api/v1/search/route.ts`
1. Added `fallbackFromEditionId: editionResult.fallbackFromEditionId ?? null` to the API response body, enabling API consumers to detect substitution.

### Backward Compatibility
When no fallback occurs, `fallbackFromEditionId` is null and no notice is rendered. The API field is always present (nullable), maintaining schema stability.

---

## Gap 3: No Indicator for 403/No-Fallback Path [MEDIUM]

### Problem
When `resolveFallbackEdition()` returns null (no fallback available), the server responds with 403 and the client stores `GatedMetadata` in `gatedCache`. However, `AyahCard` and `ParallelTranslationBlock` never checked `isGated()` or `getGatedMetadata()`. The error was swallowed by `useTranslationText`'s catch handler, and components silently fell back to `ayah.translation` (dataset built-in English) with no visible indicator.

### Root Cause
The gating metadata storage was implemented in WS4 but the UI consumption was incomplete.

### Fix Applied

**File:** `src/components/quran/ayah-card.tsx`

1. Added imports: `isGated`, `getGatedMetadata` from translation-store.

2. **Primary translation section:** Added `isPrimaryGatedNoFallback` check. When the primary translation is gated with no fallback:
   - Renders a red-bordered unavailable notice with the edition name, gating message, and external link to Tanzil.net.
   - Uses `role="status"` for screen reader announcement.
   - Replaces the translation text paragraph entirely (no silent dataset fallback).

3. **ParallelTranslationBlock:** Added `isGatedNoFallback` check. When a parallel translation is gated with no fallback:
   - Shows a red "✕ Unavailable" badge next to the edition name.
   - Renders the gating message and external link instead of translation text.
   - Handles null `meta` gracefully when the edition is gated.

4. Also added `role="status"` to the existing fallback indicator banner (WS5 concern 4b partial fix).

### Backward Compatibility
When enforcement is OFF, `isGated()` returns false, so all new conditional branches are skipped. Components render identically to before.

---

## Test Results

```
 ✓ src/lib/quran/rights-gate-fallback.test.ts (9 tests)
 ✓ src/lib/quran/translation-store-fallback.test.ts (7 tests)
 ✓ src/lib/quran/translation-search.test.ts (9 tests)
 ✓ src/lib/quran/tafsir-search.test.ts (5 tests)
 ✓ src/components/quran/ayah-card-a11y.test.ts (4 tests)
 ✓ All other quran lib/component tests (204 tests)

 Test Files  17 passed (1 pre-existing failure unrelated to these changes)
      Tests  228 passed
```

The single pre-existing failure (`reader-controls-targets.test.ts > keeps accessible names for each size button`) tests for hardcoded English strings in source code that were replaced with i18n keys in a prior sprint. It is unrelated to fallback logic.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/quran/tafsir-viewer.tsx` | Added fallback/gated detection in TafsirBlock; conditional rendering with notices and external links |
| `src/app/search/page.tsx` | Threaded `fallbackFromEditionId` to EditionSearchResultsView; added fallback notice banner |
| `src/app/api/v1/search/route.ts` | Added `fallbackFromEditionId` field to edition-scoped search API response |
| `src/components/quran/ayah-card.tsx` | Added gated-no-fallback detection in primary translation and ParallelTranslationBlock; unavailable state with external links; aria-live role on fallback banner |

---

## Safeguards Verified

- ✅ No canonical Qur'anic text modified
- ✅ DEFAULT_TRANSLATION_ID unchanged
- ✅ No existing functionality removed
- ✅ All fixes work correctly when enforcement is OFF (backward compatible)
- ✅ No conflicts with WS2 audio implementation (different files)
- ✅ External links use `target="_blank" rel="noopener noreferrer"`
- ✅ Accessibility: `role="status"` on notices, `aria-hidden` on decorative icons

---

*proposedBy: ai-assisted*  
*reviewStatus: pending-review*
