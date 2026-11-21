# Tanzil Rights-Gate Gaps & Coverage Analysis

**MFD-12.2 Phase 0 — Bypass Path & Gap Identification**

- proposedBy: ai-assisted
- reviewStatus: pending-review
- Date: 2026-11-21

---

## Executive Summary

**No bypass paths were found.** The rights-gate is correctly integrated at every identified content delivery point. However, several coverage gaps and hardening opportunities exist that should be addressed before legal review completes.

---

## Gap 1: Dead Code — `PROXY_TAFSIR_EDITIONS` Unused

**Severity:** Low (documentation/maintenance risk)

**Location:** `src/lib/quran/rights-gate.ts:22-25`

```typescript
const PROXY_TAFSIR_EDITIONS: ReadonlySet<string> = new Set([
  "ar.jalalayn",
  "ar.muyassar",
]);
```

**Issue:** This constant is declared but never referenced by any function in the module or imported elsewhere. The gate logic uses a universal approach: *all* non-bundled editions are gated. This set suggests a future intent to gate only specific tafsir editions, but currently serves no purpose.

**Risk:** A future maintainer might assume only these two tafsir editions are gated and add new editions without realizing they're automatically gated too. Or conversely, someone might try to "use" this set thinking it controls gating behavior.

**Recommendation:** Either remove it or add a comment explicitly stating it's documentation-only. If the intent is to eventually allow selective un-gating, document that roadmap.

---

## Gap 2: Client-Side GatedResponse Handling Not Verified

**Severity:** Medium (UX gap, not a security gap)

**Location:** Client-side translation loader (not audited in this phase)

**Issue:** The server correctly returns `403 + GatedResponse` for gated editions. However, this verification did not audit the client-side code that consumes the proxy response. If the client translation loader treats any non-200 response as a generic error rather than checking for `response.gated === true`, users will see "failed to load" instead of the intended link-out card.

**What to verify:**
- Does the client fetch handler parse JSON on 403 responses?
- Does it check `data.gated === true` before falling through to error handling?
- Does the UI render the `externalUrl` and `message` fields from GatedResponse?
- Is there a fallback translation offered when the preferred edition is gated?

**Recommendation:** Add client-side integration tests for GatedResponse consumption. This is covered by Test Scenario F but requires explicit implementation verification.

---

## Gap 3: DEFAULT_TRANSLATION_ID Is a Gated Edition

**Severity:** Medium (first-run UX issue)

**Location:** `src/lib/quran/translations.ts:221`

```typescript
export const DEFAULT_TRANSLATION_ID = "ur.jalandhry";
```

**Issue:** When `TANZIL_RIGHTS_ENFORCEMENT=true`, the default translation (`ur.jalandhry`) is gated. Every new user or user without saved preferences will hit a gated edition on first load.

**Impact:** Without proper client-side GatedResponse handling (Gap 2), new users see errors. Even with proper handling, the first impression is a link-out card rather than readable content.

**Recommendation:** Consider making `FALLBACK_TRANSLATION_ID` (`en.sahih`, which is bundled) the effective default when enforcement is enabled. Or add a server-side check that returns the fallback when the default is gated.

---

## Gap 4: Topic-Tafsir Data References Gated Editions

**Severity:** Low (metadata only, not a content bypass)

**Location:** `src/lib/taxonomy/topic-tafsir-data.ts:114-126`

**Issue:** Topic-tafsir linkage records contain hardcoded references to `ar.jalalayn` and `ar.muyassar` with URLs like `/ayah/{surah}/{ayah}?tafsir=ar.jalalayn`. These generate navigation links in the UI.

**Why it's not a bypass:** The actual text delivery goes through `/api/translations/{id}`, which is gated. Clicking the link triggers a gated response.

**UX concern:** Users see tafsir links in topic pages that lead to gated content. The UI should either:
1. Hide tafsir links when the edition is gated, or
2. Show the link with a visual indicator that it leads to external content

**Recommendation:** Add a client-side check using `isEditionGated()` (or an API equivalent) to conditionally render tafsir links.

---

## Gap 5: Tafsir Availability Endpoint Exposes Gated Edition Metadata

**Severity:** Low (information disclosure, not content disclosure)

**Location:** `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts:25-28`

```typescript
const READABLE_EDITIONS = [
  { translationId: "ar.jalalayn", sourceId: "tafsir-jalalayn" },
  { translationId: "ar.muyassar", sourceId: "tafsir-muyassar" },
];
```

**Issue:** This endpoint lists `ar.jalalayn` and `ar.muyassar` as "readable editions" with `textEndpoint` URLs regardless of enforcement status. When enforcement is enabled, those endpoints return 403.

**Why it's not a bypass:** The endpoint serves metadata, not text. The text endpoint it references is properly gated.

**UX concern:** API consumers may attempt to fetch the listed `textEndpoint` and receive 403 unexpectedly.

**Recommendation:** Filter `READABLE_EDITIONS` through `filterGatedEditions()` or add a `gated: boolean` field to each entry so consumers know upfront.

---

## Gap 6: No Runtime Toggle

**Severity:** Low (operational flexibility)

**Issue:** `isRightsEnforcementEnabled()` reads `process.env.TANZIL_RIGHTS_ENFORCEMENT` on every call, which is good. However, in Node.js/Next.js, `process.env` is typically populated at startup and doesn't change during runtime. Toggling enforcement requires a server restart.

**Impact:** If legal review clears an edition mid-deployment, or if enforcement needs to be disabled urgently, a redeploy/restart is required.

**Recommendation:** Document this operational constraint. Consider a config file or database flag for production environments where restarts are costly.

---

## Gap 7: No Audit Logging of Gate Decisions

**Severity:** Low (observability gap)

**Issue:** When an edition is gated, the server returns 403 silently. There is no structured log entry recording which edition was requested, by whom, and that it was gated.

**Impact:** During legal review, there's no way to measure demand for gated editions or detect unusual access patterns.

**Recommendation:** Add structured logging (e.g., `console.warn` or a metrics emitter) when `isEditionGated()` returns `true` in the proxy route.

---

## Confirmed Non-Gaps

These were investigated and confirmed safe:

| Concern | Finding |
|---------|---------|
| Direct Tanzil fetch bypassing proxy | ✅ None found. All fetches go through gated paths. |
| Translation text import bypassing store | ✅ Zero matches for `fetch.*trans/` outside gated modules. |
| AI grounding accessing gated content | ✅ Uses only bundled dataset. Refuses tafsir claims. Feature-flagged off. |
| Hardcoded edition IDs skipping gate | ✅ All hardcoded references are metadata/config, not content delivery. |
| Search API bypassing gate | ✅ Both `/api/v1/search` and `/api/v1/search/tafsir` use gated search functions. |
| Cache poisoning (gated content cached then served after toggle) | ✅ Cache is per-process memory; gated editions never populate it. Toggle requires restart which clears cache. |

---

## Priority Matrix

| Gap | Severity | Effort | Priority |
|-----|----------|--------|----------|
| Gap 2: Client GatedResponse handling | Medium | Medium | **P1** — Must verify before enabling enforcement |
| Gap 3: Default translation is gated | Medium | Low | **P1** — First-run UX blocker |
| Gap 1: Dead code | Low | Trivial | P2 — Cleanup |
| Gap 4: Topic-tafsir links to gated content | Low | Low | P2 — UX polish |
| Gap 5: Availability endpoint metadata | Low | Low | P2 — API correctness |
| Gap 7: Audit logging | Low | Low | P3 — Observability |
| Gap 6: Runtime toggle | Low | High | P3 — Operational |
