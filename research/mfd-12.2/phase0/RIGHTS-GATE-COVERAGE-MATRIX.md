# Rights Gate Coverage Matrix

> **MFD-12.2 Phase 0** — Maps every content delivery path to its rights-gate
> coverage status.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## Gate Mechanism

- **Module**: `src/lib/quran/rights-gate.ts`
- **Env toggle**: `TANZIL_RIGHTS_ENFORCEMENT` (must be `"true"` to activate)
- **Bundled exemptions**: `en.sahih`, `en.transliteration` (never gated)
- **Tafsir editions tracked**: `ar.jalalayn`, `ar.muyassar`
- **Gate function**: `isEditionGated(id)` → blocks all non-bundled editions when enforcement is on
- **Filter function**: `filterGatedEditions(ids)` → removes gated IDs from arrays

---

## Coverage Matrix

| # | Delivery Path | File:Line | External Source | Content Type | Gated? | Notes |
|---|---|---|---|---|---|---|
| 1 | Translation proxy route | `src/app/api/translations/[id]/route.ts:36` | tanzil.net | Translation text | ✅ YES | Returns 403 + `GatedResponse` when gated |
| 2 | Server-side translation search fetch | `src/lib/quran/translation-search.ts:39` | tanzil.net | Translation text | ✅ YES | Returns `null` (load error) when gated |
| 3 | Tafsir search (dual edition) | `src/lib/quran/tafsir-search.ts:44` | tanzil.net (indirect) | Tafsir text | ✅ YES | `filterGatedEditions()` removes gated IDs before search |
| 4 | `/api/v1/search?edition={id}` | `src/app/api/v1/search/route.ts:117` | tanzil.net (via #2) | Translation text | ✅ YES | Delegates to `searchTranslationEdition()` which checks gate |
| 5 | `/api/v1/search/tafsir` | `src/app/api/v1/search/tafsir/route.ts:78` | tanzil.net (via #3) | Tafsir text | ✅ YES | Delegates to `searchTafsir()` which filters gated editions |
| 6 | Audio streaming (CDN) | `src/lib/quran/audio.ts:68` | cdn.islamic.network | MP3 audio | ❌ NO | Client-side URL generation; no gate check exists |
| 7 | Semantic model CDN load | `src/lib/quran/semantic-search.ts:122` | cdn.jsdelivr.net | ML library + weights | ⬜ N/A | Apache-2.0 software, not Quran content |
| 8 | Semantic embedding index | `src/lib/quran/semantic-search.ts:76,93` | Local (`/embeddings/`) | Precomputed vectors | ⬜ N/A | Vendored at build time from CC-BY-4.0 source |
| 9 | Word-by-word data | `src/lib/quran/words.ts:114` | Local (`/word-data/`) | Word segmentation | ⬜ N/A | MIT licensed, vendored at build time |
| 10 | Bundled Quran text | `src/lib/quran/data.ts:16-23` | Local (node_modules) | Arabic + translation | ⬜ N/A | CC-BY-4.0 via quran-json; explicitly exempted |
| 11 | Mushaf metadata | `src/lib/quran/mushaf-data.ts` | Build-time vendor | Boundary tables | ⬜ N/A | CC-BY, compiled into bundle |
| 12 | Client translation store | `src/lib/quran/translation-store.ts:109` | Local proxy → tanzil.net | Translation text | ✅ YES (indirect) | Fetches `/api/translations/{id}` which is gated at the proxy |

---

## Specific Verification Answers

### Q1: Does the rights gate cover `/api/v1/search?edition={id}`?

**YES.** The search route at `src/app/api/v1/search/route.ts:117` calls `searchTranslationEdition()`, which in turn calls `loadEdition()` in `translation-search.ts`. That function checks `isEditionGated(id)` at line 39 and returns `null` if gated, causing the search endpoint to return a 502 `edition_unavailable` error.

### Q2: Does the rights gate cover `/api/v1/ayahs/[surah]/[ayah]/tafsir`?

**PARTIAL / NOT APPLICABLE.** This endpoint (`src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts`) does NOT serve tafsir text — it returns metadata about available editions and links to the translation proxy. The actual text delivery happens through `/api/translations/{id}`, which IS gated. The tafsir availability endpoint itself lists `ar.jalalayn` and `ar.muyassar` as readable editions regardless of gate state, but clicking through to read them hits the gated proxy.

### Q3: Does the rights gate cover audio playback paths?

**NO.** Audio URLs are generated entirely client-side by `ayahAudioUrl()` in `src/lib/quran/audio.ts:68`. The function constructs `https://cdn.islamic.network/quran/audio/{bitrate}/{reciterId}/{globalAyah}.mp3` with no rights-gate check. The `rights-gate.ts` module has zero audio-related logic. There is no server-side audio proxy.

### Q4: Are there any direct Tanzil fetches that bypass the proxy route?

**YES, but they are gated.** `src/lib/quran/translation-search.ts:46-55` makes a direct server-side `fetch()` to `https://tanzil.net/trans/{id}` that does NOT go through the `/api/translations/[id]` proxy route. However, this path IS independently gated by `isEditionGated(id)` at line 39 of the same file. So while it bypasses the proxy *route*, it does not bypass the gate *logic*.

### Q5: Is semantic search affected?

**NO.** Semantic search uses:
- A locally vendored embedding index (`/embeddings/quran-minilm.bin`) derived from the bundled CC-BY-4.0 English translation
- A client-side ML model loaded from jsdelivr CDN (Apache-2.0 software)
- Query embedding happens entirely in the browser; no query leaves the device

No external Quran content is fetched during semantic search. The fallback path (when semantic search fails) is lexical search over bundled data, which is also unaffected.

---

## Risk Summary

| Risk Level | Paths | Action Needed |
|---|---|---|
| 🔴 HIGH | None currently ungated for text delivery | Text paths are covered |
| 🟡 MEDIUM | Audio CDN streaming (#6) | No license verification for recordings; consider adding audio gate or license audit |
| 🟢 LOW | All N/A paths (#7-11) | Properly licensed or vendored; no action needed |

---

## Gate Activation Status

The gate is controlled by `process.env.TANZIL_RIGHTS_ENFORCEMENT === "true"`. When unset or `"false"`, **all gates are transparent** and every edition is served without restriction. This preserves backward compatibility until legal review completes.
