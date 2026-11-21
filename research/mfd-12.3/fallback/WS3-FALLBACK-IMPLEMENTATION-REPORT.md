# MFD-12.3 WS3: Translation Fallback Implementation Report

**Work Stream:** WS3 — Translation Fallback Implementation  
**Date:** 2026-11-21  
**Proposed By:** ai-assisted  
**Review Status:** pending-review  

---

## Executive Summary

Implemented a transparent, rights-aware fallback mechanism for gated translations. When `TANZIL_RIGHTS_ENFORCEMENT=true` and a user's preferred translation (e.g., `ur.jalandhry`) is gated due to unverified rights, the system now:

1. **Preserves user preferences** — the saved `translationId` is never silently changed
2. **Accurately labels displayed content** — UI shows what is actually displayed, not what was requested
3. **Provides graceful degradation** — falls back to bundled `en.sahih` (CC-BY-4.0) read from local quran-json files
4. **Works transparently** — no behavior change when enforcement is disabled
5. **Handles server-side search** — gated editions fall back in search results with accurate attribution

---

## Files Modified

### 1. `src/lib/quran/rights-gate.ts`

**Changes:**
- Added `FALLBACK_CHAIN` constant: ordered list of bundled, rights-cleared editions (`["en.sahih", "en.transliteration"]`)
- Added `resolveFallbackEdition(requestedId: string): string | null` function
- Added `GatedFallbackResponse` interface for structured fallback metadata

**Behavior:**
- Returns `null` when enforcement is disabled (transparent pass-through)
- Returns `null` when requested edition is not gated (no fallback needed)
- Returns first available fallback from chain when edition is gated
- Returns `null` if all fallback candidates are also gated (should never occur with current chain)

### 2. `src/app/api/translations/[id]/route.ts`

**Changes:**
- Added bundled edition loading from quran-json chapter files on disk (eliminates network dependency for fallback content)
- Integrated `resolveFallbackEdition` into the proxy route
- When a gated edition has an available fallback:
  - Serves bundled text from local quran-json files instead of fetching from Tanzil
  - Adds `X-Fallback-Requested-Id` and `X-Fallback-Reason` response headers
  - Logs audit event `rights-gate-fallback` (integrates with WS4 Gap 7 logging)
- When no fallback is available:
  - Preserves original 403 behavior with `buildGatedResponse`
  - Logs audit event `rights-gate-blocked`

**New Infrastructure:**
- `QURAN_JSON_DIR`: Path to bundled chapter files
- `loadSurahVerses()`: Lazy-loads surah verse data from disk with caching
- `buildBundledText()`: Generates Tanzil-format text from quran-json for en.sahih/en.transliteration
- `BUNDLED_EDITION_IDS`: Set of editions served from local files

**Headers Added (fallback responses):**
```
X-Fallback-Requested-Id: <original-requested-id>
X-Fallback-Reason: rights-under-review
```

### 3. `src/lib/quran/translation-store.ts`

**Changes:**
- Added `fallbackMap: Map<string, string>` to track requested → actual edition mappings
- Added `isFallback(requestedId: string): boolean` helper
- Added `getActualEdition(requestedId: string): string` helper
- Added `clearFallback(requestedId: string): void` for preference restoration
- Modified `isLoaded`, `getCached`, `getVerse` to resolve through fallback mapping
- Modified `ensureLoaded` to parse fallback metadata from response headers
- Cache now keyed by ACTUAL edition ID to prevent duplicate storage
- Automatic fallback clearing when server returns direct response (enforcement lifted)

**Key Logic:**
```typescript
// Detect fallback from proxy response headers
const actualId = res.headers.get("X-Translation-Id") ?? id;
const fallbackRequested = res.headers.get("X-Fallback-Requested-Id");

if (fallbackRequested && actualId !== id) {
  fallbackMap.set(fallbackRequested, actualId);
} else if (!fallbackRequested && actualId === id) {
  // Clear stale fallback when enforcement is lifted
  fallbackMap.delete(id);
}

// Cache under actual ID
cache.set(actualId, map);
```

### 4. `src/lib/quran/translation-search.ts`

**Changes:**
- Added `fallbackFromEditionId` field to `TranslationSearchResults` interface
- Modified `searchTranslationEdition` to resolve fallback when requested edition is gated
- Uses effective edition's metadata for normalization direction (Arabic vs Latin)
- Returns `fallbackFromEditionId` in all result paths so callers can display notices

**Behavior:**
- When searching a gated edition, transparently searches the fallback edition instead
- The `edition` field in results still references the originally requested edition (for UI display)
- `fallbackFromEditionId` signals that hits come from a different source

### 5. `src/components/quran/ayah-card.tsx`

**Changes:**
- Imports `isFallback`, `getActualEdition` from translation-store
- Resolves `actualTranslationId` before fetching metadata
- Uses actual edition for language, direction, snippet eligibility, and credit attribution
- Added subtle fallback indicator above translation text:
  ```
  ⚠ Showing Saheeh International — your selected translation (Jalandhry) is under rights review.
  ```
- Updated `ParallelTranslationBlock` to show fallback badge when applicable

### 6. `src/components/quran/translation-selector.tsx`

**Changes:**
- Imports `isFallback`, `getActualEdition` from translation-store
- Displays actual translation name in trigger button when in fallback mode
- Shows warning icon (⚠) next to translation name with tooltip explaining the situation
- User's saved preference remains unchanged in settings

---

## Test Coverage

### New Test Files

1. **`src/lib/quran/rights-gate-fallback.test.ts`** (9 tests)
   - Tests `resolveFallbackEdition` with enforcement on/off
   - Verifies fallback chain priority (en.sahih before en.transliteration)
   - Edge cases: empty strings, unknown IDs, bundled editions

2. **`src/lib/quran/translation-store-fallback.test.ts`** (7 tests)
   - Tests `isFallback` and `getActualEdition` helpers
   - Mocks fetch to simulate proxy responses with fallback headers
   - Verifies cache deduplication under actual edition ID
   - Tests verse lookup through fallback mapping

### Test Results

```
 ✓ src/lib/quran/rights-gate-fallback.test.ts (9 tests)
 ✓ src/lib/quran/translation-store-fallback.test.ts (7 tests)
 ✓ src/lib/quran/translation-search.test.ts (9 tests)
 ✓ All other quran lib tests (135 tests)

 Test Files  10 passed (10)
      Tests  160 passed (160)
```

### Running Tests

```bash
npm run test -- --run src/lib/quran/
```

---

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| User switches from gated to cleared edition | Preference restored automatically via `fallbackMap.delete()` when server returns direct response |
| Multiple parallel translations, some gated | Each resolved independently; fallback badge shown per-translation |
| Search results when searched edition is gated | Server-side search uses fallback edition; `fallbackFromEditionId` signals substitution |
| Enforcement disabled | All functions return pass-through values; zero overhead |
| Fallback edition also unavailable | Returns 403 with structured gating response (should never happen with bundled fallbacks) |
| Bundled file read failure | Returns 500 error with descriptive message |
| New user with no saved preference | DEFAULT_TRANSLATION_ID (ur.jalandhry) triggers fallback to en.sahih transparently |

---

## Backward Compatibility

- ✅ `DEFAULT_TRANSLATION_ID` constant unchanged (`ur.jalandhry`)
- ✅ `FALLBACK_TRANSLATION_ID` constant unchanged (`en.sahih`)
- ✅ Existing user preferences preserved in localStorage
- ✅ No changes to canonical Qur'anic text
- ✅ No changes to existing API contracts (only additive headers)
- ✅ Transparent pass-through when `TANZIL_RIGHTS_ENFORCEMENT != "true"`
- ✅ Non-bundled editions still transit Tanzil proxy when not gated

---

## Integration Points

- **WS4 Gap 7 Audit Logging:** Fallback substitutions logged as `rights-gate-fallback` events alongside blocked requests
- **WS4 Gap 2 Gated Metadata:** Client store preserves `getGatedMetadata`/`isGated` functions for editions with no fallback
- **Translation Selector:** Shows accurate current translation with fallback indicator
- **Ayah Card:** Displays correct attribution and fallback notice
- **Server-Side Search:** Falls back transparently; results carry `fallbackFromEditionId` for UI notices
- **Bundled Content:** en.sahih and en.transliteration served from local quran-json files, eliminating network dependency

---

## Architecture Decisions

### Why Bundle Fallback Content Locally?

The fallback editions (en.sahih, en.transliteration) ship inside the quran-json npm package under CC-BY-4.0. Reading from disk instead of fetching from Tanzil:
- Guarantees availability even when Tanzil is unreachable
- Eliminates network latency for fallback content
- Ensures rights-cleared content is always deliverable
- Reduces external dependencies for core functionality

### Why Preserve User Preferences?

Silently changing a user's saved `translationId` would be confusing and destructive. When enforcement is lifted or the edition is cleared, the user should see their preferred translation again without manual intervention. The fallback mapping is ephemeral (per-session), while preferences persist in localStorage.

### Why Headers Instead of JSON Response?

The existing client store expects plain-text Tanzil format. Changing to JSON would require rewriting the parser and breaking backward compatibility. Custom headers carry metadata without altering the response body format.

---

## Future Considerations

1. **User Notification:** Consider adding a dismissible toast notification when fallback activates
2. **Preference Recovery:** When a gated edition is cleared, notify users their preference is available again
3. **Expanded Fallback Chain:** Could add language-matched fallbacks (e.g., Urdu → other Urdu editions) before falling back to English
4. **Analytics:** Track fallback activation rates to prioritize rights clearance for high-demand editions
5. **Search UI Notice:** Display fallback notice on search results page when `fallbackFromEditionId` is set

---

## Verification Checklist

- [x] `resolveFallbackEdition` returns correct fallback for gated editions
- [x] Proxy route serves bundled fallback text with metadata headers
- [x] Client store parses fallback headers and records mapping
- [x] UI components display accurate attribution
- [x] Fallback indicator visible but non-intrusive
- [x] User preferences never silently modified
- [x] Tests pass for both enforcement states
- [x] No regressions in existing translation functionality
- [x] Server-side search handles gated editions gracefully
- [x] Bundled content loads from local quran-json files
- [x] Preference restoration works when enforcement lifts
