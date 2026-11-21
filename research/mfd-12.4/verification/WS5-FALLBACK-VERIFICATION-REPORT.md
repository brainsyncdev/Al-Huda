# WS5: Translation Fallback Verification Report

**Work Stream:** WS5 — Translation Fallback Verification (MFD-12.4)  
**Date:** 2026-11-21  
**Proposed By:** ai-assisted  
**Review Status:** pending-review  

---

## Executive Summary

This report independently verifies the translation fallback mechanism implemented in MFD-12.3 WS3. Verification was performed through static code analysis, data-flow tracing, and execution of existing unit tests. **No source files were modified.**

### Overall Verdict

| Requirement | Status |
|-------------|--------|
| 1. Translation identity accuracy | ✅ PASS |
| 2. Attribution accuracy | ✅ PASS |
| 3. User preference preservation | ✅ PASS |
| 4. No silent substitution | ⚠️ PASS WITH CONCERNS |
| 5. Both enforcement modes | ✅ PASS |
| 6. Unavailable state | ✅ PASS |

All 16 existing unit tests pass.

---

## 1. Scenario Traces

### 1a. New user, no saved preference, enforcement ON

**Flow:**
1. `DEFAULT_TRANSLATION_ID` = `"ur.jalandhry"` (`src/lib/quran/translations.ts:221`)
2. `PrefsProvider` hydrates with `translationId: "ur.jalandhry"` (`src/lib/prefs/context.tsx:51`)
3. `AyahCard` calls `useTranslationText("ur.jalandhry", ...)` → triggers `ensureLoaded("ur.jalandhry")`
4. Client fetches `/api/translations/ur.jalandhry`
5. Server: `isEditionGated("ur.jalandhry")` → `true` (non-bundled, enforcement on)
6. Server: `resolveFallbackEdition("ur.jalandhry")` → `"en.sahih"` (first in `FALLBACK_CHAIN`)
7. Server: sets `effectiveId = "en.sahih"`, reads bundled text from quran-json
8. Server: response headers include `X-Translation-Id: en.sahih`, `X-Fallback-Requested-Id: ur.jalandhry`
9. Client store: detects mismatch, records `fallbackMap.set("ur.jalandhry", "en.sahih")`
10. UI: `getActualEdition("ur.jalandhry")` → `"en.sahih"`; `isFallback("ur.jalandhry")` → `true`
11. AyahCard renders amber fallback indicator + Saheeh International text

**Verdict:** ✅ PASS — User sees en.sahih with visible fallback indicator. Preference remains ur.jalandhry.

### 1b. Returning user with ur.jalandhry saved, enforcement ON

**Flow:**
1. localStorage has `{"translationId": "ur.jalandhry", ...}`
2. `normalizePrefs()` validates it exists in catalog → keeps `"ur.jalandhry"` (`context.tsx:84-88`)
3. Same server fallback flow as 1a
4. `fallbackMap` is module-scoped (per-tab), so on fresh page load it re-establishes via headers
5. localStorage is NEVER written by the fallback mechanism

**Verdict:** ✅ PASS — Saved preference preserved in localStorage; fallback mapping is ephemeral session state.

### 1c. User switches from gated to cleared edition

**Flow:**
1. User selects a non-gated edition (e.g., `"en.sahih"`) via `TranslationSelector`
2. `setTranslationId("en.sahih")` persists to localStorage
3. `ensureLoaded("en.sahih")` fetches `/api/translations/en.sahih`
4. Server: `isEditionGated("en.sahih")` → `false` (bundled); no fallback headers set
5. Client store: `!fallbackRequested && actualId === id` → `fallbackMap.delete("en.sahih")` (`translation-store.ts:220`)
6. If user later switches back to `"ur.jalandhry"` and enforcement has been lifted:
   - Server returns direct response without `X-Fallback-Requested-Id`
   - Client clears stale mapping via `fallbackMap.delete(id)`

**Verdict:** ✅ PASS — Automatic cleanup when enforcement lifts. Manual switch updates preference correctly.

### 1d. Enforcement OFF

**Flow:**
1. `isRightsEnforcementEnabled()` → `false` (env var not `"true"`)
2. `isEditionGated(any)` → `false` (early return at `rights-gate.ts:48`)
3. `resolveFallbackEdition(any)` → `null` (because `isEditionGated` returns false)
4. Proxy route serves requested edition directly from Tanzil
5. No fallback headers set; `fallbackMap` never populated

**Verdict:** ✅ PASS — Zero overhead, transparent pass-through.

### 1e. All bundled editions gated (hypothetical)

**Flow:**
1. If hypothetically `BUNDLED_EDITIONS` were empty or all candidates gated
2. `resolveFallbackEdition()` iterates `FALLBACK_CHAIN`, finds no non-gated candidate → returns `null`
3. Proxy route: `fallbackId` is null → logs `rights-gate-blocked` event
4. Returns `NextResponse.json(buildGatedResponse(id), { status: 403 })`
5. Client store: `res.ok` is false → parses JSON body → detects `body.gated === true`
6. Stores in `gatedCache`: `gatedCache.set(id, { gated: true, reason, externalUrl, message })`
7. Throws `Error("HTTP 403")` → caught by `useTranslationText`'s `.catch(() => {})`
8. Component falls back to `ayah.translation` (dataset built-in English)

**Verdict:** ✅ PASS — Structured gating response, not an unhandled error. However, see concern §4 below about UI visibility.

---

## 2. Attribution Chain Verification

Traced the complete path from server to UI for the actual edition name:

```
Server (route.ts)
  └─ getTranslation(effectiveId) → effectiveMeta
  └─ headers["X-Translation-Id"] = effectiveId

Client Store (translation-store.ts)
  └─ actualId = res.headers.get("X-Translation-Id") ?? id
  └─ fallbackMap.set(fallbackRequested, actualId)
  └─ cache.set(actualId, map)

UI Components
  └─ getActualEdition(requestedId) → resolves through fallbackMap
  └─ getTranslation(actualId) → correct metadata for displayed content
  └─ ayah-card.tsx:120: translationMeta = getTranslation(actualTranslationId)
  └─ ayah-card.tsx:193-198: translationCredit uses actualTranslationId
  └─ translation-selector.tsx:37-38: currentTranslation = getTranslation(actualTranslationId)
```

**Finding:** The attribution chain is correctly wired. Every component that displays translation metadata resolves through `getActualEdition()` first, ensuring the credit line reflects what is actually shown.

**Verdict:** ✅ PASS

---

## 3. Preference Storage Verification

Checked all paths that write to localStorage:

| Location | Writes translationId? | Called during fallback? |
|----------|----------------------|------------------------|
| `PrefsProvider.persist()` | Yes | No — only called by explicit `setTranslationId()` |
| `setTranslationId()` | Yes | No — only called by user action in `TranslationSelector.handleSelect()` |
| `restorePrefs()` | Yes | No — only called by backup import |
| `normalizePrefs()` | No (read-only) | N/A |
| `fallbackMap` (translation-store) | No (module-scoped Map) | Yes — but never persisted |

The fallback mechanism operates entirely through the ephemeral `fallbackMap` in `translation-store.ts`. This is a module-scoped `Map<string, string>` that lives only in memory for the browser tab session. It is never serialized to localStorage.

**Verdict:** ✅ PASS — User preferences are completely isolated from the fallback mechanism.

---

## 4. Visible Indicator Verification (No Silent Substitution)

### Where indicators exist:

1. **AyahCard primary translation** (`ayah-card.tsx:256-263`):
   ```tsx
   {showingFallback && (
     <p className="mb-1.5 flex items-center gap-1.5 text-[0.6875rem] text-amber-700 dark:text-amber-400">
       <span aria-hidden>⚠</span>
       <span>
         Showing <strong>{translationMeta?.name ?? "alternative"}</strong> — your selected translation ({getTranslation(translationId)?.name ?? translationId}) is under rights review.
       </span>
     </p>
   )}
   ```
   ✅ Visible amber banner with both actual and requested names.

2. **ParallelTranslationBlock** (`ayah-card.tsx:58-62`):
   ```tsx
   {showingFallback && (
     <span className="... bg-amber-100 ... text-amber-800" title="...">
       ⚠ Fallback
     </span>
   )}
   ```
   ✅ Badge per parallel translation column.

3. **TranslationSelector trigger** (`translation-selector.tsx:172-176`):
   ```tsx
   {currentIsFallback && (
     <span className="ml-1 text-[0.625rem] text-amber-600" title="...">
       ⚠
     </span>
   )}
   ```
   ✅ Warning icon in selector button.

### Concerns identified:

**Concern 4a: Gated state without fallback (403 path)**
When `resolveFallbackEdition` returns `null` and the server responds with 403, the client stores `GatedMetadata` in `gatedCache` but the `AyahCard` does NOT check `isGated()` or `getGatedMetadata()`. The error is swallowed by `useTranslationText`'s catch handler, and the component silently falls back to `ayah.translation` (the dataset's built-in English). There is **no visible indicator** that the user's preferred translation was blocked.

- `isGated()` and `getGatedMetadata()` are exported from `translation-store.ts` but never imported by `ayah-card.tsx`.
- The `topic-tafsir-data.ts` file references these functions in comments (line 74) but the TafsirViewer component does not use them either.

**Severity:** Medium. With the current `FALLBACK_CHAIN` containing two bundled editions that are never gated, this path should be unreachable in practice. But if the chain were misconfigured or extended, users would see silent substitution.

**Concern 4b: Accessibility of fallback indicator**
The primary fallback banner in AyahCard uses `<span aria-hidden>⚠</span>` for the warning emoji, which hides it from screen readers. The adjacent `<span>` contains the full text explanation, which IS accessible. However, the indicator lacks an ARIA role like `role="status"` or `aria-live="polite"` that would proactively announce the fallback to assistive technology users navigating the page.

**Severity:** Low. The text content is accessible, just not proactively announced.

**Verdict:** ⚠️ PASS WITH CONCERNS — Indicators present for active fallback, but missing for the 403/no-fallback edge case.

---

## 5. Enforcement Mode Toggle

Verified both states:

- **ON** (`TANZIL_RIGHTS_ENFORCEMENT=true`): Full gating + fallback logic active. Tested in unit tests.
- **OFF** (unset or any other value): `isRightsEnforcementEnabled()` returns `false`. All gating functions short-circuit. Tested in unit tests.

**Runtime toggle limitation** (documented in `rights-gate.ts:12-23`): The env var is read on every call, but Node.js `process.env` does not update after startup. Changing the env var requires a process restart. This is a documented operational constraint, not a bug.

**Verdict:** ✅ PASS

---

## 6. Test Execution Results

```
 ✓ src/lib/quran/rights-gate-fallback.test.ts (9 tests) 17ms
 ✓ src/lib/quran/translation-store-fallback.test.ts (7 tests) 62ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
```

All 16 tests pass. Coverage includes:
- Enforcement on/off toggling
- Fallback chain priority
- Bundled edition exemption
- Header-based fallback detection
- Cache deduplication under actual ID
- Verse lookup through fallback mapping
- Edge cases (empty strings, unknown IDs)

**Test gaps identified:**
- No test for `clearFallback()` behavior
- No test for automatic fallback clearing when enforcement lifts (the `else if` branch at `translation-store.ts:216-221`)
- No integration test verifying the full server→client→UI flow
- No test for the 403/gated path in `ensureLoaded`

**Verdict:** ✅ PASS (with noted coverage gaps)

---

## Summary of Findings

| # | Finding | Severity | Type |
|---|---------|----------|------|
| 1 | Attribution chain correctly traces actual edition from server to UI | — | Confirmed |
| 2 | localStorage never modified by fallback mechanism | — | Confirmed |
| 3 | Fallback indicators present in AyahCard, ParallelTranslationBlock, TranslationSelector | — | Confirmed |
| 4a | No visible indicator when edition is gated AND no fallback available (403 path) | Medium | Gap |
| 4b | Fallback indicator lacks `aria-live` for proactive screen reader announcement | Low | Enhancement |
| 5 | `clearFallback()` exported but never called in production code | Low | Dead code |
| 6 | Search results page doesn't display `fallbackFromEditionId` notice | Medium | Gap |
| 7 | TafsirViewer doesn't handle gated tafsir editions gracefully | Medium | Gap |
| 8 | No tests for `clearFallback()` or auto-clearing on enforcement lift | Low | Test gap |

---

*proposedBy: ai-assisted*
*reviewStatus: pending-review*
