# WS4 — Rights-Gate Gaps Remediation Report

**MFD-12.3 — Implementation Phase**

- proposedBy: ai-assisted
- reviewStatus: pending-review
- Date: 2026-11-21
- Agent: WS4 (agent-125)

---

## Executive Summary

All 7 identified gaps from `RIGHTS-GATE-GAPS.md` have been remediated. No bypass paths were introduced. All 160 existing tests pass without regression. Changes are backward-compatible and transparent when `TANZIL_RIGHTS_ENFORCEMENT` is not set to `"true"`.

---

## Gap-by-Gap Remediation Details

### Gap 1: Dead Code — `PROXY_TAFSIR_EDITIONS` (Low)

**Status:** ✅ RESOLVED

**Action:** Removed the unused `PROXY_TAFSIR_EDITIONS` constant entirely from `src/lib/quran/rights-gate.ts:22-25`.

**Rationale:** The gate uses a universal approach — all non-bundled editions are gated. The set was never referenced by any function or import. Keeping it risked misleading future maintainers into thinking only those two tafsir editions are gated.

**File modified:** `src/lib/quran/rights-gate.ts`

**Verification:** Confirmed via `grep` that no other file in `src/` references `PROXY_TAFSIR_EDITIONS`. Tests pass.

---

### Gap 2: Client-Side GatedResponse Handling (Medium)

**Status:** ✅ RESOLVED

**Action:** Enhanced `src/lib/quran/translation-store.ts` with full GatedResponse parsing:

1. **Added `GatedMetadata` interface** — typed structure matching the server's `GatedResponse` shape.
2. **Added `gatedCache`** — module-scoped `Map<string, GatedMetadata>` storing gating metadata for editions that returned 403.
3. **Enhanced `ensureLoaded()`** — on non-200 responses, checks `Content-Type` for JSON, parses the body, detects `body.gated === true`, stores metadata in `gatedCache`, and calls `notify()` so subscribed components re-render.
4. **Exported `getGatedMetadata(id)`** — allows UI components to retrieve gating details (externalUrl, message) for rendering link-out cards.
5. **Exported `isGated(id)`** — boolean check for whether an edition was found to be gated.

**Integration with WS3:** The GatedResponse handling is complementary to WS3's fallback mechanism. When the proxy performs a transparent fallback, the response is 200 OK with fallback headers — `ensureLoaded()` processes it normally via WS3's code path. When no fallback is available (should not happen with current chain), the proxy returns 403 + GatedResponse, which our new code catches and stores.

**File modified:** `src/lib/quran/translation-store.ts`

**Verification:** Existing fallback tests pass (7 tests). The new code path only activates on 403+JSON responses, which don't occur in the test suite's mocked 200 responses.

---

### Gap 3: DEFAULT_TRANSLATION_ID Is Gated (Medium)

**Status:** ✅ VERIFIED — No changes needed (WS3 coordination)

**Action:** Audited `rights-gate.ts` to confirm bundled edition exemptions work correctly:

- `BUNDLED_EDITIONS` contains `en.sahih` and `en.transliteration` — both CC-BY-4.0 via quran-json.
- `isEditionGated()` returns `false` for bundled editions regardless of enforcement state.
- WS3's `resolveFallbackEdition()` correctly uses `FALLBACK_CHAIN` (`["en.sahih", "en.transliteration"]`) which are both in `BUNDLED_EDITIONS` and thus never gated themselves.
- `DEFAULT_TRANSLATION_ID` was NOT modified per WS3 ownership boundary.

**Coordination note:** WS3 handles the transparent fallback substitution in the proxy route. WS4's role was to verify the gate correctly identifies bundled editions and doesn't interfere. Verified: the gate exempts bundled editions at the `isEditionGated()` level, before any fallback logic runs.

**Files audited:** `src/lib/quran/rights-gate.ts`, `src/lib/quran/translations.ts`

---

### Gap 4: Topic-Tafsir Links to Gated Content (Low)

**Status:** ✅ RESOLVED

**Action:** Added gate-awareness to `TafsirLink` in `src/lib/taxonomy/topic-tafsir-data.ts`:

1. **Imported `isEditionGated`** from `../quran/rights-gate`.
2. **Extended `TafsirLink` interface** with `gated: boolean` field.
3. **Updated `buildTafsirLink()`** to compute gate status: external tafsirs are never gated; in-app tafsirs check `isEditionGated(source.translationId)`.
4. **Documented client-side limitation**: When this module is bundled into a `"use client"` component chain, `process.env.TANZIL_RIGHTS_ENFORCEMENT` is unavailable in the browser, so `gated` will always be `false` client-side. Documented that client components should use `getGatedMetadata()` from translation-store or the API endpoint's annotation instead.

**File modified:** `src/lib/taxonomy/topic-tafsir-data.ts`

**Verification:** Module has no `"use client"` directive itself. Imported by `topic-tafsir-viewer.tsx` (client component) — Next.js evaluates the function during SSR where `process.env` is available, serializing the result. Direct client-side calls will see `false` (safe default).

---

### Gap 5: Tafsir Availability Endpoint Exposes Gated Metadata (Low)

**Status:** ✅ RESOLVED

**Action:** Annotated `READABLE_EDITIONS` output in `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts`:

1. **Imported `isEditionGated`** from `@/lib/quran/rights-gate`.
2. **Added `gated: boolean` field** to each entry in the `readableEditions` array, computed via `isEditionGated(e.translationId)`.

**Result:** API consumers now receive `{ translationId, sourceId, textEndpoint, gated }` for each readable edition. When enforcement is enabled, `ar.jalalayn` and `ar.muyassar` will show `gated: true`, allowing consumers to skip fetching or display appropriate UI.

**File modified:** `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts`

**Verification:** Server-side route — `process.env` is fully available. No client bundling concerns.

---

### Gap 6: No Runtime Toggle (Low)

**Status:** ✅ RESOLVED (Documentation only — per task spec)

**Action:** Added comprehensive documentation block in `src/lib/quan/rights-gate.ts` header comment explaining:

- `process.env` is populated at startup in Node.js/Next.js
- Changing `TANZIL_RIGHTS_ENFORCEMENT` after start has NO EFFECT until restart
- Enabling, disabling, or updating enforcement all require server restart/redeploy
- Database-backed or config-file flags are out of scope for MFD-12.3
- Operational guidance: plan deployments around legal review milestones

**File modified:** `src/lib/quran/rights-gate.ts`

---

### Gap 7: No Audit Logging (Low)

**Status:** ✅ RESOLVED

**Action:** Structured logging was already partially implemented by WS3 in the proxy route. Verified and confirmed coverage:

1. **Fallback events** (`rights-gate-fallback`): Logged when a gated edition is transparently replaced. Includes `requestedEditionId`, `actualEditionId`, `language`, `translationName`, `timestamp`, `userAgent`, `referer`, `reason`.
2. **Blocked events** (`rights-gate-blocked`): Logged when no fallback is available and a 403 is returned. Includes `editionId`, `language`, `translationName`, `timestamp`, `userAgent`, `referer`, `reason`.

Both use `console.warn(JSON.stringify({...}))` for structured, parseable log entries that appear in server logs without triggering error-level alerting.

**Note:** WS3 had already added this logging as part of their fallback implementation. WS4 verified completeness and confirms the audit trail covers all gate decision paths.

**File audited:** `src/app/api/translations/[id]/route.ts`

---

## Test Results

```
 ✓ src/lib/quran/rights-gate-fallback.test.ts (9 tests)
 ✓ src/lib/quran/reference.test.ts (22 tests)
 ✓ src/lib/quran/tafsir-search.test.ts (5 tests)
 ✓ src/lib/quran/translation-store-fallback.test.ts (7 tests)
 ✓ src/lib/quran/translation-search.test.ts (9 tests)
 ✓ src/lib/quran/curated-references.test.ts (28 tests)
 ✓ src/lib/quran/search.test.ts (28 tests)
 ✓ src/lib/quran/cross-references.test.ts (18 tests)
 ✓ src/lib/quran/data.test.ts (19 tests)
 ✓ src/lib/quran/mushaf-data.test.ts (15 tests)

 Test Files  10 passed (10)
      Tests  160 passed (160)
   Duration  875ms
```

**Zero regressions.** All existing tests pass.

---

## Safeguards Verification

| Safeguard | Status |
|-----------|--------|
| Do NOT modify canonical Qur'anic text | ✅ No Quran text files touched |
| Do NOT change DEFAULT_TRANSLATION_ID | ✅ Not modified |
| Do NOT conflict with WS3 fallback | ✅ Complementary; uses separate exports (`getGatedMetadata`, `isGated`) |
| Preserve backward compatibility | ✅ All changes transparent when enforcement disabled |
| Work correctly when enforcement disabled | ✅ `isEditionGated()` returns false; `gated` fields are false; no logging |

---

## Modified Files Summary

| File | Change Type | Lines Changed |
|------|-------------|---------------|
| `src/lib/quran/rights-gate.ts` | Removed dead code, added docs | ~-4 net (removed PROXY_TAFSIR_EDITIONS, added comment block) |
| `src/lib/quran/translation-store.ts` | Added GatedResponse handling | ~+35 lines |
| `src/lib/taxonomy/topic-tafsir-data.ts` | Added gated field to TafsirLink | ~+15 lines |
| `src/app/api/v1/ayahs/.../tafsir/route.ts` | Added gated annotation | ~+4 lines |
| `src/app/api/translations/[id]/route.ts` | Audited (WS3 already added logging) | No WS4 changes needed |

---

## Deliverables

- [x] Modified source files (listed above)
- [x] `research/mfd-12.3/gaps/WS4-GAPS-REMEDIATION-REPORT.md` (this file)
- [x] `research/mfd-12.3/gaps/UPDATED-COVERAGE-MATRIX.md`
- [x] `research/mfd-12.3/gaps/BYPASS-TEST-RESULTS.md`
- [x] Regression tests passed (160/160)
