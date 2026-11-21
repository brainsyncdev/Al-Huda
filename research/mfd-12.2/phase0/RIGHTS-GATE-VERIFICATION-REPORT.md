# Tanzil Rights-Gate Verification Report

**MFD-12.2 Phase 0 — Independent Verification**

- proposedBy: ai-assisted
- reviewStatus: pending-review
- Date: 2026-11-21

---

## 1. Module Under Review

`src/lib/quran/rights-gate.ts` (78 lines)

### Exported Functions & Logic

| Export | Signature | Behavior |
|--------|-----------|----------|
| `isRightsEnforcementEnabled()` | `() => boolean` | Returns `true` only when `process.env.TANZIL_RIGHTS_ENFORCEMENT === "true"`. Strict equality — `"1"`, `"yes"`, `"TRUE"` all return `false`. |
| `isEditionGated(editionId)` | `(string) => boolean` | Returns `false` when enforcement is disabled. Returns `false` for bundled editions (`en.sahih`, `en.transliteration`). Returns `true` for **all other edition IDs** when enforcement is enabled. |
| `buildGatedResponse(editionId)` | `(string) => GatedResponse` | Constructs a structured response with `gated: true`, `reason: "rights-under-review"`, the edition ID, an external URL to `tanzil.net/trans/{id}`, and a human-readable message. |
| `filterGatedEditions(ids)` | `(readonly string[]) => string[]` | When enforcement is disabled, returns a shallow copy of the input array. When enabled, filters out any ID for which `isEditionGated()` returns `true`. |
| `GatedResponse` (interface) | — | `{ gated: true; reason: "rights-under-review"; editionId: string; externalUrl: string; message: string }` |

### Constants

- `BUNDLED_EDITIONS`: `Set(["en.sahih", "en.transliteration"])` — never gated.
- `PROXY_TAFSIR_EDITIONS`: `Set(["ar.jalalayn", "ar.muyassar"])` — declared but **not referenced by any function**. This set is informational/dead code within this module. The gate logic does not use it; instead, `isEditionGated()` gates *all* non-bundled editions universally.

---

## 2. Integration Point: Proxy Route

**File:** `src/app/api/translations/[id]/route.ts` (74 lines)

### Gate Placement
✅ **CORRECT.** The gate check occurs at line 36, **before** the Tanzil fetch at line 41:

```typescript
if (isEditionGated(id)) {
  return NextResponse.json(buildGatedResponse(id), { status: 403 });
}
```

### HTTP Status
✅ Returns **403 Forbidden** for gated editions.

### Response Body
✅ Matches `GatedResponse` interface exactly via `buildGatedResponse(id)`.

### Catalog Check
✅ The route first validates the edition exists in the catalog (line 25–31, returns 404 for unknown IDs) before checking the gate. This prevents the route from being used as an arbitrary proxy.

---

## 3. Integration Point: Translation Search

**File:** `src/lib/quran/translation-search.ts` (166 lines)

### Gate Placement
✅ **CORRECT.** `isEditionGated()` is called inside `loadEdition()` at line 39:

```typescript
if (isEditionGated(id)) return null;
```

This occurs **before** any cache lookup or network fetch.

### Behavior When Gated
When `isEditionGated()` returns `true`, `loadEdition()` returns `null`. The caller `searchTranslationEdition()` (line 100–103) then returns:

```typescript
{ edition: meta, query, hits: [], totalScanned: 0, loadError: true }
```

✅ This correctly signals a load failure to consumers without exposing gated content.

### Import Verification
✅ Line 14: `import { isEditionGated } from "./rights-gate";`

---

## 4. Integration Point: Tafsir Search

**File:** `src/lib/quran/tafsir-search.ts` (72 lines)

### Gate Placement
✅ **CORRECT.** `filterGatedEditions()` is applied to `TAFSIR_EDITION_IDS` at line 44:

```typescript
const searchableIds = filterGatedEditions(TAFSIR_EDITION_IDS);
```

This occurs **before** the iteration loop that calls `searchTranslationEdition()`.

### Behavior When Gated
When enforcement is enabled, both `ar.jalalayn` and `ar.muyassar` are filtered out (neither is in `BUNDLED_EDITIONS`). The loop body never executes, resulting in:
- `hits: []`
- `totalScanned: 0`
- `editionsSearched: []`

✅ No gated tafsir content is fetched or returned.

### Double-Gate Safety
Even if an edition somehow passed `filterGatedEditions()`, the subsequent call to `searchTranslationEdition()` would still hit the `isEditionGated()` check inside `loadEdition()`. ✅ Defense in depth.

---

## 5. Bypass Path Analysis

### 5a. Direct Tanzil Fetches Outside the Proxy

**Search:** `tanzil.net/trans/` across all `.ts` files.

| Location | Context | Bypass? |
|----------|---------|---------|
| `rights-gate.ts:65` | Building external URL string | ❌ No fetch |
| `sources.ts:92,96,141,156` | Attribution/homepage metadata strings | ❌ No fetch |
| `route.ts:6,15` | Comment + constant in proxy route (gated) | ❌ Protected |
| `translation-search.ts:47` | Server-side fetch in `loadEdition()` | ❌ Protected by `isEditionGated()` at line 39 |
| `translations.ts:3` | Comment only | ❌ No fetch |

✅ **No direct Tanzil fetch bypasses the gate.**

### 5b. Translation Text Imports Bypassing the Store

**Search:** `fetch.*trans/` and `axios.*trans/` across all `.ts` files.

✅ **Zero matches.** All Tanzil text retrieval goes through either the proxy route or `loadEdition()` in `translation-search.ts`, both of which are gated.

### 5c. Hardcoded Edition IDs Skipping the Gate

**Search:** All occurrences of `ar.jalalayn`, `ar.muyassar`, `ur.jalandhry`, `en.sahih` across `.ts` files.

Key findings:
- `src/lib/taxonomy/topic-tafsir-data.ts:114,122` — References `ar.jalalayn` and `ar.muyassar` as `translationId` in topic-tafsir linkage data. These are **metadata records** that generate URLs like `/ayah/{surah}/{ayah}?tafsir=ar.jalalayn`. The actual text delivery goes through the proxy route, which is gated. ✅ Not a bypass.
- `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts:26-27` — Lists readable editions with `textEndpoint: /api/translations/${e.translationId}`. This is an **availability endpoint** that returns metadata, not text. The text endpoint it points to is the gated proxy. ✅ Not a bypass.
- `src/lib/quran/translations.ts:221` — `DEFAULT_TRANSLATION_ID = "ur.jalandhry"`. This is a preference default. When the user's saved preference is a gated edition, the proxy route will return 403/GatedResponse. The UI must handle this gracefully (see test scenario F). ⚠️ **UI concern, not a server-side bypass.**
- Test files reference hardcoded IDs but are not production code. ✅ Not a bypass.

### 5d. AI Grounding Module

**File:** `src/lib/ai/grounding.ts` (513 lines)

The grounding module:
- Uses only `getAyah()` from `../quran/data` (the pinned bundled dataset) for Quran text validation.
- Uses only `getSource("tanzil-sahih")` for translation claims — this references the **bundled** en.sahih translation from quran-json, NOT the Tanzil proxy.
- Explicitly refuses `tafsir` claims (line 63-69: `NON_AUTHORITY_KINDS` includes `"tafsir"`).
- Has no import of `rights-gate`, `translation-search`, or `tafsir-search`.
- Has no `fetch()` call to any external URL.
- Is currently disabled by feature flag (`isAiAnswerEnabled()` returns false).

✅ **The AI grounding module cannot retrieve gated content.** It operates exclusively on the bundled dataset and refuses tafsir claims outright.

---

## 6. Summary of Findings

| Check | Result |
|-------|--------|
| Gate logic correctness | ✅ Correct — strict env check, bundled exemption, universal gating |
| Proxy route integration | ✅ Gate called before fetch, correct 403 + GatedResponse |
| Translation search integration | ✅ Gate called before fetch, returns loadError: true |
| Tafsir search integration | ✅ Editions filtered before iteration, double-gated |
| Direct Tanzil fetch bypasses | ✅ None found |
| Translation import bypasses | ✅ None found |
| Hardcoded edition ID bypasses | ✅ None found (metadata-only references) |
| AI grounding bypass | ✅ Cannot access gated content |
| Dead code note | ⚠️ `PROXY_TAFSIR_EDITIONS` set is declared but unused |

### Overall Assessment

**The rights-gate enforcement is correctly implemented and consistently integrated across all identified content delivery paths.** No bypass paths were found. The gate operates as a transparent pass-through when disabled and blocks all non-bundled editions when enabled.

One minor observation: the `PROXY_TAFSIR_EDITIONS` constant in `rights-gate.ts` is dead code — it is never read by any function in the module or imported elsewhere. It appears to be documentation-as-code but could mislead future maintainers into thinking only those two tafsir editions are gated, when in fact *all* non-bundled editions are gated.
