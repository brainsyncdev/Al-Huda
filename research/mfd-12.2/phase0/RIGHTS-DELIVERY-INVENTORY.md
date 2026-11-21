# Rights-Sensitive Content Delivery Inventory

> **MFD-12.2 Phase 0** — Exhaustive inventory of every code path that delivers
> content from external sources in the FAHM Quran App.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. External Content Delivery Paths

### 1.1 Tanzil.net Translation Proxy

| Field | Value |
|---|---|
| **File** | `src/app/api/translations/[id]/route.ts` |
| **Lines** | 15, 41–47 |
| **External URL** | `https://tanzil.net/trans/{editionId}` |
| **Content Type** | Translation text (plain text, `surah\|ayah\|text` format) |
| **Delivery Mechanism** | Server-side proxy (Next.js API route fetches on behalf of client; browser cannot fetch directly due to missing CORS headers) |
| **Caching** | Next.js data cache: `revalidate: 86400` (24 h). Browser: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` |
| **Rights Metadata** | License stated in source catalog (`sources.ts` line 94): "Tanzil terms of use (attribution + no modification)". No per-edition license field in response. |
| **Rights-Gate Coverage** | **YES** — `isEditionGated(id)` checked at line 36; returns 403 with structured `GatedResponse` when gated |
| **Risk if Ungated** | **HIGH** — This is the primary delivery path for 100+ translations in 44 languages. All non-bundled editions transit this route. |

### 1.2 Tanzil.net Direct Fetch (Server-Side Search)

| Field | Value |
|---|---|
| **File** | `src/lib/quran/translation-search.ts` |
| **Lines** | 46–55 |
| **External URL** | `https://tanzil.net/trans/{editionId}` |
| **Content Type** | Translation text (same format as proxy) |
| **Delivery Mechanism** | Server-side direct fetch (no CORS issue server-side); result cached in process memory (`Map`) for server lifetime + Next.js data cache 24 h |
| **Caching** | In-memory `Map<string, Map<string, string>>` (process lifetime). Next.js `revalidate: 86400`. In-flight dedup via `inflight` Map. |
| **Rights Metadata** | Same as proxy path — Tanzil terms of use |
| **Rights-Gate Coverage** | **YES** — `isEditionGated(id)` checked at line 39; returns `null` (treated as load error) when gated |
| **Risk if Ungated** | **HIGH** — Used by `/api/v1/search?edition={id}` and tafsir search. Bypasses the proxy route entirely with its own fetch. |

### 1.3 Tafsir Search (Dual Edition)

| Field | Value |
|---|---|
| **File** | `src/lib/quran/tafsir-search.ts` |
| **Lines** | 44–46 |
| **External URL** | Indirectly `https://tanzil.net/trans/ar.jalalayn` and `https://tanzil.net/trans/ar.muyassar` via `searchTranslationEdition()` |
| **Content Type** | Classical Arabic tafsir text |
| **Delivery Mechanism** | Delegates to `translation-search.ts` → direct Tanzil fetch |
| **Caching** | Same as translation-search (in-memory + Next.js data cache) |
| **Rights Metadata** | Tanzil terms of use; source records `tafsir-jalalayn` and `tafsir-muyassar` in `sources.ts` lines 134–162 |
| **Rights-Gate Coverage** | **YES** — `filterGatedEditions(TAFSIR_EDITION_IDS)` at line 44 removes gated editions before searching |
| **Risk if Ungated** | **HIGH** — Delivers copyrighted tafsir text. Both editions are in `PROXY_TAFSIR_EDITIONS` set. |

### 1.4 Islamic Network CDN Audio Streaming

| Field | Value |
|---|---|
| **File** | `src/lib/quran/audio.ts` |
| **Lines** | 68 |
| **External URL** | `https://cdn.islamic.network/quran/audio/{bitrate}/{reciterId}/{globalAyah}.mp3` |
| **Content Type** | Per-ayah MP3 audio recitation (12 reciters, 6 bitrate options) |
| **Delivery Mechanism** | Client-side direct streaming (`<audio>` element src). No server proxy. URL constructed by `ayahAudioUrl()`. |
| **Caching** | Browser HTTP cache only (CDN headers). No app-level caching. |
| **Rights Metadata** | Source record `islamic-network-audio` (`sources.ts` lines 104–118): "Streamed at runtime under the CDN's terms; no recording files are redistributed." CDN publishes no explicit copyright license. |
| **Rights-Gate Coverage** | **NO** — Audio URLs are generated client-side with no gate check. The rights-gate module has no audio-related logic. |
| **Risk if Ungated** | **MEDIUM** — Streams only (no redistribution), but 12 reciters × 6236 ayahs = ~75K MP3 URLs are constructible. No license verification exists. |

### 1.5 Semantic Search Model CDN Load

| Field | Value |
|---|---|
| **File** | `src/lib/quran/semantic-search.ts` |
| **Lines** | 39–40, 122 |
| **External URL** | `https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2` |
| **Content Type** | ML library code (Transformers.js) + model weights (`Xenova/all-MiniLM-L6-v2`) |
| **Delivery Mechanism** | Client-side dynamic `import()` with `webpackIgnore`. Model loaded via Transformers.js pipeline. |
| **Caching** | Browser cache (`mod.env.useBrowserCache = true`). jsdelivr CDN cache. |
| **Rights Metadata** | Apache-2.0 (model). Source record `semantic-embeddings` (`sources.ts` lines 164–178). |
| **Rights-Gate Coverage** | **NOT APPLICABLE** — This is a software library + open-weight model, not Quran content. No rights gate needed. |
| **Risk if Ungated** | **LOW** — Apache-2.0 licensed. Query embedding happens locally; no query leaves the device. |

### 1.6 Semantic Search Embedding Index

| Field | Value |
|---|---|
| **File** | `src/lib/quran/semantic-search.ts` |
| **Lines** | 36–37, 76, 93 |
| **External URL** | None — fetched from local `/embeddings/quran-minilm.json` and `/embeddings/quran-minilm.bin` |
| **Content Type** | Precomputed sentence embeddings (float16, 6236 × 384 dimensions) |
| **Delivery Mechanism** | Client-side fetch from app's own `public/` directory |
| **Caching** | Browser HTTP cache. Loaded once per tab session. |
| **Rights Metadata** | Derived data from quran-json English translation (CC-BY-4.0). Source record `semantic-embeddings`. |
| **Rights-Gate Coverage** | **NOT APPLICABLE** — Vendored at build time from bundled CC-BY-4.0 content. No external fetch at runtime. |
| **Risk if Ungated** | **LOW** — Derived from already-bundled, licensed content. |

### 1.7 Word-by-Word Data

| Field | Value |
|---|---|
| **File** | `src/lib/quran/words.ts` |
| **Lines** | 114 |
| **External URL** | None — fetched from local `/word-data/{surah}.json` |
| **Content Type** | Word segmentation: Uthmani token, transliteration, English gloss |
| **Delivery Mechanism** | Client-side fetch from app's own `public/word-data/` directory |
| **Caching** | In-memory `Map` per surah (tab lifetime). Browser HTTP cache. |
| **Rights Metadata** | MIT (QUL repository). Source record `qul-word-data` (`sources.ts` lines 180–192). Vendored at build time with sha256 manifest. |
| **Rights-Gate Coverage** | **NOT APPLICABLE** — Vendored, MIT-licensed, no runtime external fetch. |
| **Risk if Ungated** | **LOW** — MIT licensed, vendored with integrity checks. |

### 1.8 Bundled Quran Text (quran-json)

| Field | Value |
|---|---|
| **File** | `src/lib/quran/data.ts` |
| **Lines** | 16–23 |
| **External URL** | None — reads `node_modules/quran-json/dist/chapters/en/*.json` via `node:fs` at build/server time |
| **Content Type** | Arabic text (Uthmani), English translation (Saheeh International), Latin transliteration, surah metadata |
| **Delivery Mechanism** | Server-side filesystem read. Served via API routes (`/api/v1/ayahs/...`, `/api/v1/surahs/...`). |
| **Caching** | In-memory after first load (module-scoped). Next.js data cache for API routes. |
| **Rights Metadata** | CC-BY-4.0 (quran-json package). Source records `quran-json`, `quranenc`, `tanzil-sahih`, `tanzil-translit` in `sources.ts`. |
| **Rights-Gate Coverage** | **NOT APPLICABLE** — Bundled under CC-BY-4.0. Explicitly exempted in `rights-gate.ts` lines 16–19. |
| **Risk if Ungated** | **LOW** — Verified CC-BY-4.0 license via npm package. |

### 1.9 Mushaf Metadata (Tanzil quran-data.xml)

| Field | Value |
|---|---|
| **File** | `src/lib/quran/mushaf-data.ts` |
| **Lines** | 4–5 (comment reference) |
| **External URL** | None at runtime — generated at build time from vendored `quran-data.xml` |
| **Content Type** | Juz, page, hizb, quarter, ruku, manzil, sajda boundaries |
| **Delivery Mechanism** | Build-time generation → static TypeScript module |
| **Caching** | Compiled into bundle. No runtime fetch. |
| **Rights Metadata** | CC-BY (declared in XML header). Source record `tanzil-mushaf-metadata` (`sources.ts` lines 120–132). |
| **Rights-Gate Coverage** | **NOT APPLICABLE** — Vendored at build time under CC-BY. |
| **Risk if Ungated** | **LOW** — CC-BY licensed, build-time snapshot with validation. |

---

## 2. Client-Side Fetch Summary

All client-side `fetch()` calls found in `src/components/` target **local API routes only**:

| Component | Endpoint | External? |
|---|---|---|
| `verse-of-day.tsx:56` | `/api/verse-of-day` | No |
| `quiz-workspace.tsx:105` | `/api/v1/quiz/generate` | No |
| `quiz-workspace.tsx:161` | `/api/v1/surahs` | No |
| `due-queue.tsx:105` | `/api/v1/ayahs/{s}/{a}` | No |
| `search-box.tsx:90` | `/api/v1/search` | No |
| `semantic-search-panel.tsx:33` | `/api/v1/ayahs/{s}/{a}` | No |
| `translation-store.ts:109` | `/api/translations/{id}` | No (but proxy fetches externally) |

**No component makes a direct external HTTP request.** All external content transits either the translation proxy route or the audio CDN URL generator.

---

## 3. API Route Inventory

| Route | Proxies External? | Gated? |
|---|---|---|
| `/api/translations/[id]` | YES → Tanzil.net | YES |
| `/api/v1/search` (with `edition=`) | YES → Tanzil.net (via translation-search) | YES |
| `/api/v1/search/tafsir` | YES → Tanzil.net (via tafsir-search) | YES |
| `/api/v1/ayahs/[s]/[a]/tafsir` | NO (metadata only, links to proxy) | N/A |
| `/api/v1/ayahs/[s]/[a]` | NO (bundled data) | N/A |
| `/api/v1/surahs` | NO (bundled data) | N/A |
| `/api/v1/surahs/[n]` | NO (bundled data) | N/A |
| `/api/v1/sources` | NO (static catalog) | N/A |
| `/api/v1/topics/*` | NO (editorial data) | N/A |
| `/api/v1/quiz/generate` | NO (uses bundled data) | N/A |
| `/api/v1/graph` | NO (bundled data) | N/A |
| `/api/v1/explore/*` | NO (bundled data) | N/A |
| `/api/v1/search/suggestions` | NO (bundled data) | N/A |
| `/api/verse-of-day` | NO (bundled data) | N/A |
| `/api/validate-dataset` | NO (integrity check) | N/A |
