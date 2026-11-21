# Tanzil Rights-Gate Test Scenarios

**MFD-12.2 Phase 0 — QA Execution Specification**

- proposedBy: ai-assisted
- reviewStatus: pending-review
- Date: 2026-11-21

---

## Prerequisites

- All scenarios require a running Next.js dev or production server.
- The `TANZIL_RIGHTS_ENFORCEMENT` env var must be settable per-scenario without code changes.
- No test runner is needed; these are manual/integration verification steps.
- Expected responses reference the `GatedResponse` interface: `{ gated: true, reason: "rights-under-review", editionId, externalUrl, message }`.

---

## Scenario A: Enforcement Unset (Default)

**Setup:** `TANZIL_RIGHTS_ENFORCEMENT` is not set in `.env` or process environment.

| Step | Action | Expected Result |
|------|--------|-----------------|
| A1 | `GET /api/translations/en.sahih` | 200, plain text verse lines |
| A2 | `GET /api/translations/ur.jalandhry` | 200, plain text verse lines |
| A3 | `GET /api/translations/ar.jalalayn` | 200, plain text verse lines |
| A4 | `GET /api/v1/search?q=mercy&edition=ur.jalandhry` | 200, hits returned |
| A5 | `GET /api/v1/search/tafsir?q=رحمة` | 200, hits from both ar.jalalayn and ar.muyassar |
| A6 | Verify `isRightsEnforcementEnabled()` returns `false` | Confirmed via logging or debug endpoint |

**Pass Criteria:** All editions accessible. No 403 responses. No `loadError: true` in search results.

---

## Scenario B: Enforcement Explicitly Disabled

**Setup:** `TANZIL_RIGHTS_ENFORCEMENT=false`

| Step | Action | Expected Result |
|------|--------|-----------------|
| B1 | `GET /api/translations/ur.jalandhry` | 200, plain text |
| B2 | `GET /api/translations/ar.muyassar` | 200, plain text |
| B3 | `GET /api/v1/search/tafsir?q=هدى` | 200, hits from both tafsir editions |
| B4 | Set `TANZIL_RIGHTS_ENFORCEMENT=FALSE` (uppercase) | Same as B1–B3 (strict equality means only `"true"` enables) |
| B5 | Set `TANZIL_RIGHTS_ENFORCEMENT=1` | Same as B1–B3 (only `"true"` enables) |

**Pass Criteria:** Behavior identical to Scenario A. Non-`"true"` values do not enable enforcement.

---

## Scenario C: Enforcement Enabled — Bundled Edition Passes

**Setup:** `TANZIL_RIGHTS_ENFORCEMENT=true`

| Step | Action | Expected Result |
|------|--------|-----------------|
| C1 | `GET /api/translations/en.sahih` | 200, plain text (bundled, CC-BY-4.0) |
| C2 | `GET /api/translations/en.transliteration` | 200, plain text (bundled, CC-BY-4.0) |
| C3 | `GET /api/v1/search?q=mercy&edition=en.sahih` | 200, hits returned, `loadError: false` |
| C4 | Verify `isEditionGated("en.sahih")` returns `false` | Confirmed |
| C5 | Verify `isEditionGated("en.transliteration")` returns `false` | Confirmed |

**Pass Criteria:** Bundled editions remain fully accessible under enforcement.

---

## Scenario D: Enforcement Enabled — Non-Bundled Translation Gated

**Setup:** `TANZIL_RIGHTS_ENFORCEMENT=true`

| Step | Action | Expected Result |
|------|--------|-----------------|
| D1 | `GET /api/translations/ur.jalandhry` | **403**, body matches `GatedResponse` |
| D2 | Verify response body | `{ gated: true, reason: "rights-under-review", editionId: "ur.jalandhry", externalUrl: "https://tanzil.net/trans/ur.jalandhry", message: "..." }` |
| D3 | `GET /api/translations/en.pickthall` | **403**, same structure |
| D4 | `GET /api/v1/search?q=mercy&edition=ur.jalandhry` | 502 with `edition_unavailable` error (because `loadEdition` returns null → `loadError: true`) |
| D5 | Verify no Tanzil fetch occurs for gated editions | Check server logs / network tab — zero outbound requests to `tanzil.net/trans/ur.jalandhry` |

**Pass Criteria:** Non-bundled translations blocked at both proxy and search layers. No upstream fetch attempted.

---

## Scenario E: Enforcement Enabled — Tafsir Search Filters Out Gated Editions

**Setup:** `TANZIL_RIGHTS_ENFORCEMENT=true`

| Step | Action | Expected Result |
|------|--------|-----------------|
| E1 | `GET /api/v1/search/tafsir?q=رحمة` | 200, but `hits: []`, `totalScanned: 0`, `editionsSearched: []` |
| E2 | Verify neither ar.jalalayn nor ar.muyassar appears in `editionsSearched` | Both filtered out by `filterGatedEditions()` |
| E3 | `GET /api/translations/ar.jalalayn` | **403**, GatedResponse |
| E4 | `GET /api/translations/ar.muyassar` | **403**, GatedResponse |
| E5 | `GET /api/v1/search?q=هدى&edition=ar.jalalayn` | 502, `edition_unavailable` |

**Pass Criteria:** Tafsir search returns empty results when all tafsir editions are gated. Individual tafsir proxy requests return 403.

---

## Scenario F: User Preference Points to Gated Edition

**Setup:** `TANZIL_RIGHTS_ENFORCEMENT=true`. User has `ur.jalandhry` saved as their preferred translation.

| Step | Action | Expected Result |
|------|--------|-----------------|
| F1 | Load the reader page with saved preference `ur.jalandhry` | UI detects 403/GatedResponse from proxy |
| F2 | Verify UI renders link-out card | Shows external URL `https://tanzil.net/trans/ur.jalandhry` with message about rights review |
| F3 | Verify UI does NOT show generic error | No "failed to load" or crash; graceful degradation |
| F4 | Verify fallback behavior | If app auto-falls back to `en.sahih` (bundled), that content loads normally |
| F5 | Change preference to `en.sahih` | Content loads immediately (bundled, not gated) |
| F6 | Change preference back to `ur.jalandhry` | Link-out card reappears |

**Pass Criteria:** UI handles gated preferences gracefully with link-out, not errors. This is a **client-side** verification scenario.

> ⚠️ **Note:** This scenario requires client-side implementation of GatedResponse handling. The server correctly returns 403 + GatedResponse; the UI must consume it. Verify the client translation loader checks for `response.gated === true` before treating the response as text.

---

## Scenario G: Edge Cases

| Step | Action | Expected Result |
|------|--------|-----------------|
| G1 | `GET /api/translations/nonexistent.id` | 404 (catalog check runs before gate) |
| G2 | `GET /api/translations/en.sahih` with enforcement=true | 200 (bundled exemption) |
| G3 | Rapid toggle: unset → true → unset | Each request evaluated independently; no stale state |
| G4 | Concurrent requests for gated edition | All return 403; no race condition leaks content |
| G5 | `preloadEdition("ur.jalandhry")` with enforcement=true | No-op; `loadEdition` returns null immediately, no fetch |

---

## Verification Checklist

- [ ] All scenarios A–E pass on dev server
- [ ] Scenario F verified in browser with actual UI
- [ ] Server logs confirm zero Tanzil fetches for gated editions under enforcement
- [ ] Response bodies match `GatedResponse` interface exactly
- [ ] HTTP status codes are correct (403 for gated, 200 for allowed, 404 for unknown)
- [ ] No regression in bundled edition delivery
