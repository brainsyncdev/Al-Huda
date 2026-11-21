# WS5: Translation Fallback Edge Case Analysis

**Work Stream:** WS5 — Translation Fallback Verification (MFD-12.4)  
**Date:** 2026-11-21  
**Proposed By:** ai-assisted  
**Review Status:** pending-review  

---

## Executive Summary

This document analyzes edge cases in the MFD-12.3 WS3 translation fallback implementation. Each edge case is traced through the codebase to determine whether it is handled correctly, partially handled, or represents a gap requiring attention.

---

## 1. Parallel Translations Where Some Are Gated

### Scenario
User has `parallelMode: true` with `parallelTranslationIds: ["ur.jalandhry", "fr.hamidullah", "en.transliteration"]`. Enforcement is ON.

### Trace
1. `AyahCard` renders `ParallelTranslationBlock` for each ID (`ayah-card.tsx:303-309`)
2. Each block independently calls:
   - `getActualEdition(translationId)` → resolves per-edition fallback
   - `useTranslationText(translationId, ...)` → triggers independent `ensureLoaded()`
   - `isFallback(translationId)` → checks individual mapping
3. Server processes each request independently via `/api/translations/[id]`
4. `ur.jalandhry` → gated → falls back to `en.sahih`, shows ⚠ badge
5. `fr.hamidullah` → gated → falls back to `en.sahih`, shows ⚠ badge
6. `en.transliteration` → bundled → served directly, no badge

### Cache Deduplication
Both `ur.jalandhry` and `fr.hamidullah` fall back to `en.sahih`. The store caches under the **actual** edition ID (`cache.set(actualId, map)` at `translation-store.ts:224`). So `en.sahih` text is stored only once, even though two parallel columns reference it.

### Concern: Multiple Fetches Before Dedup
The `inflight` map is keyed by **requested** ID (`inflight.set(id, promise)` at line 232). Two parallel requests for different gated editions that both resolve to `en.sahih` will make two separate fetches to the proxy before deduplication kicks in at the cache level. This is wasteful but not incorrect.

**Severity:** Low (performance, not correctness)

### Verdict
✅ **HANDLED** — Each parallel translation is resolved independently with correct per-column fallback badges. Cache deduplication prevents double storage.

---

## 2. Search with Gated Edition

### Scenario
User navigates to `/search?q=mercy&edition=ur.jalandhry` with enforcement ON.

### Server-Side Trace
1. `search/page.tsx:297` calls `searchTranslationEdition("ur.jalandhry", query, 100)`
2. `translation-search.ts:114`: `isEditionGated("ur.jalandhry")` → `true`
3. `resolveFallbackEdition("ur.jalandhry")` → `"en.sahih"`
4. `effectiveEditionId = "en.sahih"`, `fallbackFromId = "ur.jalandhry"`
5. `loadEdition("en.sahih")` → fetches from Tanzil (server-side, no CORS issue)
6. Returns results with `fallbackFromEditionId: "ur.jalandhry"`

### UI Rendering Gap
In `search/page.tsx:320-330`, the `EditionSearchResultsView` component receives:
- `edition={editionMeta}` — this is the metadata for the **originally requested** edition (`ur.jalandhry`), NOT the effective one
- The `fallbackFromEditionId` field on the result is **never read or displayed**

Looking at `EditionSearchResultsView` (`search/page.tsx:591-669`):
```tsx
<p>
  {hits.length} matches in <span>{edition.name}</span> ({edition.languageLabel})
</p>
```

This displays "matches in Jalandhry (Urdu)" when the actual hits are from Saheeh International (English). The text direction and language attributes also use the original edition's metadata.

### API Route
`/api/v1/search/route.ts:138-157` similarly returns `editionResult.edition.name` which is the originally requested edition's name, not the fallback's. The `fallbackFromEditionId` field exists on the internal result but is never included in the API response.

**Severity:** Medium — Misleading search results attribution. Users see Urdu edition name but English content.

### Verdict
⚠️ **PARTIALLY HANDLED** — Server correctly falls back and signals via `fallbackFromEditionId`, but neither the search page nor the API endpoint renders this signal. The user sees incorrect attribution.

---

## 3. Tafsir Fallback

### Scenario
Tafsir editions (`ar.jalalayn`, `ar.muyassar`) are non-bundled and therefore gated when enforcement is ON.

### Tafsir Search Path
1. `tafsir-search.ts:44`: `filterGatedEditions(TAFSIR_EDITION_IDS)` → filters OUT all gated editions
2. With enforcement ON, both tafsirs are gated → `searchableIds` is empty
3. No tafsir search occurs → returns empty results
4. Unlike translations, there is **no fallback mechanism** for tafsir search

This is arguably correct: falling back Arabic tafsir to English translation would be semantically wrong. But the user gets no explanation for why tafsir search returns nothing.

### TafsirViewer Component Path
1. `tafsir-viewer.tsx:85-96` iterates `AVAILABLE_TAFSIRS` and renders `TafsirBlock` for each
2. `TafsirBlock` calls `useTranslationText("ar.jalalayn", surah, ayah)`
3. This triggers `ensureLoaded("ar.jalalayn")` → fetches `/api/translations/ar.jalalayn`
4. Server: `isEditionGated("ar.jalalayn")` → `true`
5. Server: `resolveFallbackEdition("ar.jalalayn")` → `"en.sahih"` (!)
6. Server serves **English Saheeh International** as a "fallback" for Arabic Tafsir al-Jalalayn
7. Client records `fallbackMap.set("ar.jalalayn", "en.sahih")`
8. TafsirViewer displays English translation text under the heading "Tafsir al-Jalalayn"

**This is a significant semantic error.** The TafsirViewer labels the content as classical Arabic tafsir, but the fallback mechanism substitutes an English translation. The `TafsirBlock` component does not check `isFallback()` or `isGated()`.

### Topic Tafsir Data
`topic-tafsir-data.ts:173-174` correctly computes `gated` status for tafsir links, and the comment at lines 70-76 documents that client-side detection should use `getGatedMetadata()`. However, the TafsirViewer component doesn't use either mechanism.

**Severity:** High — Semantic mismatch: English translation displayed as Arabic tafsir. This could mislead users about the nature of the content they're reading.

### Verdict
❌ **NOT HANDLED** — TafsirViewer blindly uses `useTranslationText()` which triggers the generic fallback chain. Arabic tafsir falls back to English translation without any indicator. The tafsir search path silently excludes gated editions without user notification.

---

## 4. Race Conditions in Fallback Map

### Scenario
User rapidly switches between translations while network requests are in flight.

### Trace
1. User selects `ur.jalandhry` → `ensureLoaded("ur.jalandhry")` starts fetch
2. Before response arrives, user selects `en.sahih` → `setTranslationId("en.sahih")` updates prefs
3. `ur.jalandhry` response arrives with `X-Fallback-Requested-Id: ur.jalandhry`
4. `fallbackMap.set("ur.jalandhry", "en.sahih")` — but user is already viewing `en.sahih` directly
5. Stale mapping persists until tab refresh or explicit `clearFallback()`

### Impact
Low. The stale mapping means `isFallback("ur.jalandhry")` returns `true` even though the user isn't viewing it. If they switch back, the cached fallback text is shown correctly. The mapping is cleaned up automatically if enforcement lifts (the `else if` branch at `translation-store.ts:216-221`).

**Severity:** Low

### Verdict
✅ **ACCEPTABLE** — Stale mappings are harmless and self-cleaning.

---

## 5. Module State Across Tab Lifecycle

### Concern
`fallbackMap`, `cache`, and `gatedCache` are module-scoped variables in `translation-store.ts`. They persist for the lifetime of the browser tab but are lost on hard refresh.

### Implications
- After a hard refresh, fallback must be re-established via server headers (works correctly)
- Opening the app in a new tab creates fresh state (works correctly)
- PWA/service worker caching of the HTML shell does NOT affect these maps (they're runtime JS state)

**Severity:** None — by design.

### Verdict
✅ **BY DESIGN** — Ephemeral state is appropriate for fallback tracking.

---

## 6. clearFallback() Dead Code

### Finding
`clearFallback(requestedId)` is exported from `translation-store.ts:96-98` but is never imported or called anywhere in the production codebase. A grep across `src/` returns zero import references.

The automatic clearing at `translation-store.ts:220` (`fallbackMap.delete(id)`) handles the enforcement-lifted case inline within `ensureLoaded()`, making `clearFallback()` redundant.

**Severity:** Low — dead code, no functional impact.

### Verdict
ℹ️ **DEAD CODE** — Exported but unused. Consider removing or documenting intended external use.

---

## 7. Empty String / Unknown Edition IDs

### Finding
The test file `rights-gate-fallback.test.ts:83-96` verifies that empty strings and unknown IDs are treated as gated (when enforcement is on) and receive fallback to `en.sahih`.

However, the proxy route (`route.ts:94-99`) rejects unknown IDs with 404 BEFORE reaching the gating logic:
```ts
const meta = getTranslation(id);
if (!meta) {
  return NextResponse.json({ error: `Unknown translation id: ${id}` }, { status: 404 });
}
```

So `resolveFallbackEdition("")` returning `"en.sahih"` in unit tests is technically unreachable through the API route. The function is defensive but the defense is never exercised in practice.

**Severity:** None — defensive coding, no gap.

### Verdict
✅ **DEFENSIVE** — Unit tests verify theoretical behavior; API route prevents it from being reached.

---

## 8. Bundled File Read Failure

### Scenario
quran-json chapter files are corrupted or missing from `node_modules`.

### Trace
1. `buildBundledText()` calls `loadSurahVerses(s)` for s=1..114
2. If any surah file fails: `loadSurahVerses` returns `null` → `buildBundledText` returns `null`
3. Route returns 500: `Failed to read bundled edition ${effectiveId} from quran-json`
4. Client: `res.ok` is false, content-type is JSON, but body doesn't have `gated: true`
5. Falls through to generic `throw new Error("HTTP 500")`
6. `useTranslationText` catches → swallows → component shows `ayah.translation` (built-in dataset English)

No visible indicator that the bundled fallback itself failed. However, this is a deployment/installation issue, not a rights-gate issue.

**Severity:** Low (operational, not security/rights)

### Verdict
✅ **ACCEPTABLE** — Degrades to built-in dataset translation. Would benefit from error logging on client side.

---

## 9. Language Mismatch in Fallback

### Concern
When a user selects a non-English translation (e.g., Urdu, French, Turkish) and it falls back to `en.sahih`, the entire experience switches to English without warning beyond the amber indicator. For users who don't read English, this renders the translation feature useless.

The `FALLBACK_CHAIN` only contains English editions (`en.sahih`, `en.transliteration`). There is no language-matched fallback strategy.

This is documented as a future consideration in the WS3 report (line 222): "Could add language-matched fallbacks (e.g., Urdu → other Urdu editions) before falling back to English."

**Severity:** Medium (UX concern, not a bug)

### Verdict
ℹ️ **KNOWN LIMITATION** — Documented for future enhancement. Current behavior is correct per spec.

---

## 10. Concurrent ensureLoaded Calls for Same Gated Edition

### Scenario
Multiple components call `ensureLoaded("ur.jalandhry")` simultaneously (e.g., AyahCard + preloader).

### Trace
1. First call: creates promise, stores in `inflight.set("ur.jalandhry", promise)`
2. Subsequent calls: `inflight.get("ur.jalandhry")` returns existing promise
3. All callers await the same promise
4. When resolved, `fallbackMap` is set once
5. `inflight.delete("ur.jalandhry")` in finally block

**Verdict:** ✅ **CORRECTLY DEDUPED** — Standard inflight deduplication pattern works correctly with fallback.

---

## Summary Matrix

| # | Edge Case | Status | Severity |
|---|-----------|--------|----------|
| 1 | Parallel translations, some gated | ✅ Handled | — |
| 2 | Search with gated edition | ⚠️ Partially handled | Medium |
| 3 | Tafsir fallback | ❌ Not handled | High |
| 4 | Race conditions in fallback map | ✅ Acceptable | Low |
| 5 | Module state across tab lifecycle | ✅ By design | — |
| 6 | clearFallback() dead code | ℹ️ Informational | Low |
| 7 | Empty string / unknown IDs | ✅ Defensive | — |
| 8 | Bundled file read failure | ✅ Acceptable | Low |
| 9 | Language mismatch in fallback | ℹ️ Known limitation | Medium |
| 10 | Concurrent ensureLoaded calls | ✅ Correctly deduped | — |

---

## Recommended Actions

1. **[HIGH]** TafsirViewer should check `isFallback()` / `isGated()` before rendering tafsir text. If the tafsir edition is gated, display a "rights under review" message instead of falling back to English translation.

2. **[MEDIUM]** Search results page (`EditionSearchResultsView`) should read `fallbackFromEditionId` from the search result and display a notice when hits come from a different edition than requested.

3. **[MEDIUM]** API search route (`/api/v1/search/route.ts`) should include `fallbackFromEditionId` in its JSON response so API consumers can detect substitution.

4. **[LOW]** Add `aria-live="polite"` to the fallback indicator banner in AyahCard for screen reader announcement.

5. **[LOW]** Remove or document `clearFallback()` export.

6. **[LOW]** Add unit tests for the auto-clearing behavior when enforcement lifts (the `else if` branch in `ensureLoaded`).

---

*proposedBy: ai-assisted*  
*reviewStatus: pending-review*
