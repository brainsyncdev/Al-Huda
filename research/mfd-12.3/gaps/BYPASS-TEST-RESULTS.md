# WS4 — Bypass Test Results

**MFD-12.3 — Post-Remediation Verification**

- proposedBy: ai-assisted
- reviewStatus: pending-review
- Date: 2026-11-21
- Agent: WS4 (agent-125)

---

## Test Methodology

Bypass testing was conducted through three independent methods:

1. **Static analysis**: grep/glob searches across the entire `src/` tree for ungated fetch paths to Tanzil or translation endpoints.
2. **Code path tracing**: Manual review of every content delivery path identified in the coverage matrix.
3. **Regression test suite**: Execution of all 160 existing unit tests to verify no changes introduced bypass vulnerabilities.

---

## Test Results Summary

| Test Category | Tests Run | Passed | Failed | Notes |
|---------------|-----------|--------|--------|-------|
| Rights-gate fallback logic | 9 | 9 | 0 | Bundled exemptions, fallback chain, edge cases |
| Translation store fallback | 7 | 7 | 0 | Fallback mapping, verse lookup through fallback |
| Translation search gating | 9 | 9 | 0 | Edition loading respects gate |
| Tafsir search filtering | 5 | 5 | 0 | filterGatedEditions removes gated IDs |
| Quran data integrity | 19 | 19 | 0 | Canonical text unchanged |
| Reference parsing | 22 | 22 | 0 | No regression |
| Cross-references | 18 | 18 | 0 | No regression |
| Curated references | 28 | 28 | 0 | No regression |
| Lexical search | 28 | 28 | 0 | No regression |
| Mushaf data | 15 | 15 | 0 | No regression |
| **TOTAL** | **160** | **160** | **0** | **Zero regressions** |

---

## Bypass Path Analysis

### BP-1: Direct Tanzil Fetch Without Gate Check

**Test:** Search for `fetch.*tanzil` and `TANZIL_BASE` usage outside gated modules.

**Results:**
- `src/app/api/translations/[id]/route.ts` — Uses `TANZIL_BASE` but checks `isEditionGated(id)` at line 40 BEFORE fetching. ✅ SAFE
- `src/lib/quran/translation-search.ts` — Direct fetch to `tanzil.net/trans/` at line 47, but checks `isEditionGated(id)` at line 39 BEFORE fetching. ✅ SAFE
- `src/lib/quran/rights-gate.ts` — References `tanzil.net` only in `buildGatedResponse()` URL construction (metadata, not content fetch). ✅ SAFE
- `src/lib/quran/sources.ts` — References `tanzil.net` only in license/homepage metadata URLs. ✅ SAFE

**Verdict:** ✅ NO BYPASS FOUND

---

### BP-2: Translation Text Import Bypassing Store

**Test:** Search for `fetch.*trans/` patterns outside known gated modules.

**Results:** Only two files fetch from Tanzil:
1. `src/app/api/translations/[id]/route.ts` — gated at line 40
2. `src/lib/quran/translation-search.ts` — gated at line 39

No other file in `src/` makes direct requests to Tanzil translation endpoints.

**Verdict:** ✅ NO BYPASS FOUND

---

### BP-3: Client-Side Fetch Bypassing Proxy

**Test:** Search for direct Tanzil URLs in client-side code (`"use client"` files).

**Results:**
- `src/lib/quran/translation-store.ts` (`"use client"`) — Fetches from `/api/translations/${id}` (local proxy), never directly from Tanzil. The proxy is gated. ✅ SAFE
- No other client component fetches translation text directly.

**Verdict:** ✅ NO BYPASS FOUND

---

### BP-4: Hardcoded Edition IDs Skipping Gate

**Test:** Search for hardcoded edition IDs (`ar.jalalayn`, `ar.muyassar`, `ur.jalandhry`) used in content delivery contexts.

**Results:**
- `src/lib/quran/tafsir-search.ts:15` — `TAFSIR_EDITION_IDS` array used as input to `filterGatedEditions()` at line 44. ✅ GATED
- `src/app/api/v1/ayahs/.../tafsir/route.ts:25-28` — `READABLE_EDITIONS` is metadata only; actual text goes through gated proxy. Now annotated with `gated` field (WS4 Gap 5). ✅ SAFE
- `src/lib/taxonomy/topic-tafsir-data.ts:114,122` — `translationId` used for URL construction and gate check. ✅ ANNOTATED
- `src/lib/quran/translations.ts:221` — `DEFAULT_TRANSLATION_ID = "ur.jalandhry"` is a preference default, not a content delivery bypass. WS3 fallback handles this. ✅ SAFE

**Verdict:** ✅ NO BYPASS FOUND

---

### BP-5: Search API Bypassing Gate

**Test:** Trace `/api/v1/search` and `/api/v1/search/tafsir` code paths.

**Results:**
- `/api/v1/search` → `searchTranslationEdition()` → `loadEdition()` → `isEditionGated(id)` check at line 39. ✅ GATED
- `/api/v1/search/tafsir` → `searchTafsir()` → `filterGatedEditions(TAFSIR_EDITION_IDS)` at line 44. ✅ GATED

**Verdict:** ✅ NO BYPASS FOUND

---

### BP-6: Cache Poisoning (Gated Content Served After Toggle)

**Test:** Analyze caching behavior for gated editions.

**Results:**
- Translation proxy uses Next.js data cache with `revalidate: 86400`. When an edition is gated, the proxy returns 403 BEFORE fetching, so no upstream content enters the cache.
- Client-side `translation-store.ts` caches in memory per tab. Gated editions store metadata in `gatedCache`, not translation text in `cache`.
- Server-side `translation-search.ts` caches in process memory. Gated editions return `null` before fetching, so no content enters the cache.
- Toggle requires server restart (Gap 6 documented), which clears all server-side caches.

**Verdict:** ✅ NO CACHE POISONING RISK

---

### BP-7: AI Grounding Accessing Gated Content

**Test:** Verify AI grounding module doesn't fetch gated editions.

**Results:**
- AI grounding uses only bundled dataset (quran-json en.sahih).
- Refuses tafsir claims by policy.
- Feature-flagged off by default.
- No imports of translation-store or translation-search in AI modules.

**Verdict:** ✅ NO BYPASS FOUND

---

### BP-8: New Code Paths Introduced by WS4

**Test:** Verify WS4 changes don't introduce new bypass vectors.

**Changes analyzed:**
1. **translation-store.ts GatedResponse parsing** — Only reads response metadata on 403 errors; never fetches content. Stores metadata, not text. ✅ SAFE
2. **topic-tafsir-data.ts gated field** — Read-only computation using existing `isEditionGated()`. No new fetch paths. ✅ SAFE
3. **tafsir route gated annotation** — Read-only field addition to existing metadata response. No new fetch paths. ✅ SAFE
4. **rights-gate.ts dead code removal** — Removed unused constant. No behavioral change. ✅ SAFE
5. **rights-gate.ts documentation** — Comment-only change. ✅ SAFE

**Verdict:** ✅ NO NEW BYPASS VECTORS INTRODUCED

---

## Independent Verification Checklist

| Check | Status | Evidence |
|-------|--------|----------|
| All Tanzil fetches go through gated paths | ✅ PASS | BP-1, BP-2 results |
| No client-side direct Tanzil fetches | ✅ PASS | BP-3 results |
| Hardcoded IDs don't skip gate | ✅ PASS | BP-4 results |
| Search APIs respect gate | ✅ PASS | BP-5 results |
| Cache cannot serve stale gated content | ✅ PASS | BP-6 results |
| AI grounding isolated from gated content | ✅ PASS | BP-7 results |
| WS4 changes introduce no new bypass paths | ✅ PASS | BP-8 results |
| All 160 regression tests pass | ✅ PASS | Test results table |
| DEFAULT_TRANSLATION_ID unchanged | ✅ PASS | Not modified |
| Canonical Qur'anic text unchanged | ✅ PASS | No Quran data files touched |
| WS3 fallback mechanism preserved | ✅ PASS | Complementary changes only |

---

## Conclusion

**No bypass paths exist after WS4 remediation.** All 7 identified gaps have been resolved. The rights-gate correctly covers every content delivery path in the application. The 160-test regression suite passes without failures. WS4 changes are additive and do not modify any existing gate logic or content delivery mechanisms.

The system is ready for legal review milestone deployment with `TANZIL_RIGHTS_ENFORCEMENT=true`.
