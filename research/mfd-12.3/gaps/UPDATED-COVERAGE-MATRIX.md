# Rights Gate Coverage Matrix — Post-Remediation

> **MFD-12.3 WS4** — Updated coverage matrix after gap remediation.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## Gate Mechanism

- **Module**: `src/lib/quran/rights-gate.ts`
- **Env toggle**: `TANZIL_RIGHTS_ENFORCEMENT` (must be `"true"` to activate)
- **Bundled exemptions**: `en.sahih`, `en.transliteration` (never gated)
- **Gate function**: `isEditionGated(id)` → blocks all non-bundled editions when enforcement is on
- **Filter function**: `filterGatedEditions(ids)` → removes gated IDs from arrays
- **Fallback resolution**: `resolveFallbackEdition(id)` → returns bundled fallback when edition is gated (WS3)
- **Client detection**: `getGatedMetadata(id)` / `isGated(id)` in translation-store.ts (WS4 Gap 2)
- **Runtime toggle**: NOT available — requires server restart (WS4 Gap 6 documented)
- **Audit logging**: Structured JSON via `console.warn` on gate decisions (WS4 Gap 7)

---

## Coverage Matrix

| # | Delivery Path | File:Line | External Source | Content Type | Gated? | Post-WS4 Notes |
|---|---|---|---|---|---|---|
| 1 | Translation proxy route | `src/app/api/translations/[id]/route.ts:40` | tanzil.net | Translation text | ✅ YES | Returns 403 + GatedResponse OR transparent fallback (WS3). Audit logged (WS4 Gap 7). |
| 2 | Server-side translation search fetch | `src/lib/quran/translation-search.ts:39` | tanzil.net | Translation text | ✅ YES | Returns `null` (load error) when gated. No change needed. |
| 3 | Tafsir search (dual edition) | `src/lib/quran/tafsir-search.ts:44` | tanzil.net (indirect) | Tafsir text | ✅ YES | `filterGatedEditions()` removes gated IDs before search. No change needed. |
| 4 | `/api/v1/search?edition={id}` | `src/app/api/v1/search/route.ts:117` | tanzil.net (via #2) | Translation text | ✅ YES | Delegates to `searchTranslationEdition()` which checks gate. No change needed. |
| 5 | `/api/v1/search/tafsir` | `src/app/api/v1/search/tafsir/route.ts:78` | tanzil.net (via #3) | Tafsir text | ✅ YES | Delegates to `searchTafsir()` which filters gated editions. No change needed. |
| 6 | Audio streaming (CDN) | `src/lib/quran/audio.ts:68` | cdn.islamic.network | MP3 audio | ❌ NO | Out of scope for WS4 (audio rights handled by WS2). |
| 7 | Semantic model CDN load | `src/lib/quran/semantic-search.ts:122` | cdn.jsdelivr.net | ML library + weights | ⬜ N/A | Apache-2.0 software, not Quran content. |
| 8 | Semantic embedding index | `src/lib/quran/semantic-search.ts:76,93` | Local (`/embeddings/`) | Precomputed vectors | ⬜ N/A | Vendored at build time from CC-BY-4.0 source. |
| 9 | Word-by-word data | `src/lib/quran/words.ts:114` | Local (`/word-data/`) | Word segmentation | ⬜ N/A | MIT licensed, vendored at build time. |
| 10 | Bundled Quran text | `src/lib/quran/data.ts:16-23` | Local (node_modules) | Arabic + translation | ⬜ N/A | CC-BY-4.0 via quran-json; explicitly exempted. |
| 11 | Mushaf metadata | `src/lib/quran/mushaf-data.ts` | Build-time vendor | Boundary tables | ⬜ N/A | CC-BY, compiled into bundle. |
| 12 | Client translation store | `src/lib/quran/translation-store.ts:133` | Local proxy → tanzil.net | Translation text | ✅ YES | **WS4 Gap 2 FIXED**: Now parses 403 JSON responses, stores GatedMetadata, exposes `isGated()` and `getGatedMetadata()`. |
| 13 | Tafsir availability endpoint | `src/app/api/v1/ayahs/.../tafsir/route.ts:67` | Metadata only | Edition list | ✅ ANNOTATED | **WS4 Gap 5 FIXED**: Each readableEdition entry now includes `gated: boolean`. |
| 14 | Topic-tafsir link generation | `src/lib/taxonomy/topic-tafsir-data.ts:157` | Metadata only | Navigation links | ✅ ANNOTATED | **WS4 Gap 4 FIXED**: `TafsirLink.gated` field added. Server-rendered pages get correct value; client-side falls back to store detection. |

---

## Gap Remediation Status

| Gap | Severity | Pre-WS4 Status | Post-WS4 Status | Resolution |
|-----|----------|----------------|-----------------|------------|
| Gap 1: Dead code `PROXY_TAFSIR_EDITIONS` | Low | Unused constant present | ✅ REMOVED | Deleted from rights-gate.ts |
| Gap 2: Client GatedResponse handling | Medium | Generic error on 403 | ✅ IMPLEMENTED | JSON parsing, GatedMetadata cache, exported accessors |
| Gap 3: DEFAULT_TRANSLATION_ID gated | Medium | First-run UX issue | ✅ VERIFIED | WS3 fallback handles this; gate correctly exempts bundled editions |
| Gap 4: Topic-tafsir links to gated content | Low | No gate awareness | ✅ IMPLEMENTED | `gated` field on TafsirLink with documented client limitation |
| Gap 5: Availability endpoint metadata | Low | No gate annotation | ✅ IMPLEMENTED | `gated: boolean` on each readableEdition |
| Gap 6: No runtime toggle | Low | Undocumented constraint | ✅ DOCUMENTED | Comprehensive comment block in rights-gate.ts header |
| Gap 7: No audit logging | Low | Silent 403s | ✅ IMPLEMENTED | Structured JSON logging via console.warn (WS3 added, WS4 verified) |

---

## Specific Verification Answers (Updated)

### Q1: Does the rights gate cover `/api/v1/search?edition={id}`?

**YES.** Unchanged from MFD-12.2. The search route delegates to `searchTranslationEdition()`, which checks `isEditionGated(id)` at line 39 and returns `null` if gated.

### Q2: Does the rights gate cover `/api/v1/ayahs/[surah]/[ayah]/tafsir`?

**YES — NOW ANNOTATED.** Previously this endpoint listed gated editions without indicating their status. **WS4 Gap 5 fix**: Each entry in `readableEditions` now includes `gated: true/false`. The actual text delivery remains gated through `/api/translations/{id}`.

### Q3: Does the rights gate cover audio playback paths?

**NO.** Audio URLs are generated entirely client-side. This is tracked separately under WS2 (Audio Rights Gate).

### Q4: Are there any direct Tanzil fetches that bypass the proxy route?

**NO BYPASS.** `translation-search.ts` makes a direct server-side fetch but independently checks `isEditionGated(id)` before fetching. All paths are gated.

### Q5: Is semantic search affected?

**NO.** Uses locally vendored embeddings and client-side ML. No external Quran content fetched.

### Q6: Does the client correctly handle gated responses?

**YES — WS4 Gap 2 FIXED.** The translation store now:
1. Parses JSON on non-200 responses
2. Detects `body.gated === true`
3. Stores `GatedMetadata` in a dedicated cache
4. Exposes `isGated(id)` and `getGatedMetadata(id)` for UI components
5. Calls `notify()` so subscribed components re-render with gating info

### Q7: Do topic-tafsir links indicate gated status?

**YES — WS4 Gap 4 FIXED.** `TafsirLink` now carries a `gated: boolean` field. Server-rendered pages have accurate values. Client-side rendering defaults to `false` (safe) due to `process.env` unavailability in browser bundles; client components should use `getGatedMetadata()` from the translation store as the primary detection mechanism.

---

## Risk Summary (Updated)

| Risk Level | Paths | Action Needed |
|---|---|---|
| 🔴 HIGH | None | All text delivery paths are gated |
| 🟡 MEDIUM | Audio CDN streaming (#6) | Tracked under WS2 |
| 🟢 LOW | All N/A paths (#7-11) | Properly licensed or vendored |
| 🟢 RESOLVED | Client GatedResponse handling | WS4 Gap 2 fixed |
| 🟢 RESOLVED | Tafsir metadata exposure | WS4 Gap 5 annotated |
| 🟢 RESOLVED | Topic-tafsir link awareness | WS4 Gap 4 annotated |

---

## Gate Activation Status

The gate is controlled by `process.env.TANZIL_RIGHTS_ENFORCEMENT === "true"`. When unset or `"false"`, **all gates are transparent** and every edition is served without restriction. This preserves backward compatibility until legal review completes.

**Operational note (WS4 Gap 6):** Changing this env var requires a server restart. Plan deployments around legal review milestones.
