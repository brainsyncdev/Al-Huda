# WS2: Audio Rights Gate — Implementation Specification

> **MFD-12.3** — Detailed specification for server-proxied audio delivery with rights gating.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. Overview

This specification implements **Option A (Server Proxy)** from WS2-AUDIO-GATE-ARCHITECTURE.md.
All audio requests will transit a new Next.js API route that enforces rights checks
before proxying MP3 bytes from the Islamic Network CDN.

### Design Principles

1. **Identical pattern to translations** — reuse `rights-gate.ts` conventions.
2. **Reversible** — env-var controlled; disabling enforcement restores current behavior.
3. **Per-reciter granularity** — individual reciters can be cleared or blocked.
4. **Zero client-side URL construction** — `ayahAudioUrl()` is replaced by a server endpoint.
5. **Graceful degradation** — gated audio shows structured messaging, not errors.

---

## 2. New and Modified Files

### 2.1 New Files

| File | Purpose |
|---|---|
| `src/app/api/audio/[reciter]/[globalAyah]/route.ts` | Streaming proxy API route with rights gate |
| `src/lib/quran/audio-rights.ts` | Audio-specific rights metadata and gate logic |

### 2.2 Modified Files

| File | Change |
|---|---|
| `src/lib/quran/audio.ts` | Replace `ayahAudioUrl()` with `ayahAudioProxyUrl()` pointing to `/api/audio/...`; add deprecation notice to old function |
| `src/lib/quran/sources.ts` | Enrich `islamic-network-audio` record with `rightsStatus`, per-reciter metadata |
| `src/components/quran/audio-player.tsx` | Use new proxy URL function; handle structured gated response |
| `src/lib/quran/rights-gate.ts` | Add `isReciterGated()` and `AUDIO_RIGHTS_ENFORCEMENT` env var support |

---

## 3. API Contract: `/api/audio/[reciter]/[globalAyah]`

### 3.1 Request

```
GET /api/audio/{reciterId}/{globalAyah}?bitrate={bitrate}
```

| Parameter | Type | Required | Validation |
|---|---|---|---|
| `reciterId` | string (path) | Yes | Must exist in `RECITERS` array |
| `globalAyah` | number (path) | Yes | Integer 1–6236 |
| `bitrate` | number (query) | No | One of `AUDIO_BITRATES`; defaults to 64 |

### 3.2 Success Response (200)

```
Content-Type: audio/mpeg
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
X-Audio-Source: cdn.islamic.network
X-Audio-Reciter: ar.alafasy
X-Audio-Global-Ayah: 1

[binary MP3 stream]
```

The server streams the response using `fetch()` with `ReadableStream` piping to avoid
buffering entire files in memory.

### 3.3 Gated Response (403)

```json
{
  "gated": true,
  "reason": "rights-under-review",
  "reciterId": "ar.alafasy",
  "externalUrl": "https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3",
  "message": "Audio for this reciter is temporarily unavailable while rights are verified."
}
```

``` 
Content-Type: application/json
Cache-Control: no-store
```

### 3.4 Error Responses

| Status | Condition | Body |
|---|---|---|
| 400 | Invalid reciter ID or global ayah | `{ "error": "invalid-parameter", ... }` |
| 403 | Reciter is gated | See §3.3 |
| 502 | CDN unreachable or returned non-200 | `{ "error": "upstream-failure", ... }` |
| 500 | Internal error | `{ "error": "internal", ... }` |

---

## 4. Audio Rights Module: `audio-rights.ts`

```typescript
// Proposed interface (not final code)

export interface ReciterRights {
  reciterId: string;
  status: "verified" | "under-review" | "unverified" | "restricted";
  licenseType?: string;
  licenseUrl?: string;
  copyrightHolder?: string;
  notes?: string;
}

/** Returns rights metadata for a reciter, or null if unknown. */
export function getReciterRights(reciterId: string): ReciterRights | null;

/** Returns true when the reciter should be blocked from delivery. */
export function isReciterGated(reciterId: string): boolean;

/** Whether audio rights enforcement is active. */
export function isAudioRightsEnforcementEnabled(): boolean;
```

### Default State

When `AUDIO_RIGHTS_ENFORCEMENT` is unset or `"false"`:
- `isReciterGated()` returns `false` for all reciters
- Proxy passes through all requests (current behavior preserved)

When `AUDIO_RIGHTS_ENFORCEMENT` is `"true"`:
- All reciters default to `"under-review"` status
- `isReciterGated()` returns `true` unless explicitly cleared
- Individual reciters can be cleared via a `CLEARED_RECITERS` env var or config file

---

## 5. Source Record Enrichment

Expand `islamic-network-audio` in `sources.ts`:

```typescript
{
  id: "islamic-network-audio",
  provides: "Per-ayah audio recitation (verse-by-verse MP3, 12 reciters)",
  attribution: "Various reciters; recordings sourced from everyayah.com",
  publisher: "Islamic Network CDN (cdn.islamic.network)",
  license: "Streamed at runtime; no explicit license published by CDN",
  licenseUrl: "https://islamic.network/",
  homepage: "https://cdn.islamic.network/quran/",
  version: "Live CDN endpoint (not version-pinned)",
  method: "link",
  language: "ar",
  // NEW FIELDS:
  rightsStatus: "under-review",       // Overall status for all reciters
  rightsReviewDate: "2026-11-21",     // Date of last rights assessment
  disableReason: "rights-under-review", // Reason code for gating
  reciterRights: [                     // Per-reciter granularity
    { reciterId: "ar.alafasy", status: "under-review" },
    { reciterId: "ar.husary", status: "under-review" },
    // ... all 12 reciters
  ],
  notes: "Audio is optional and off by default..."
}
```

---

## 6. Client-Side Changes

### 6.1 `audio.ts` — New URL Function

```typescript
/** Server-proxied audio URL that enforces rights checks. */
export function ayahAudioProxyUrl(
  reciterId: string,
  surah: number,
  ayah: number,
  bitrate: AudioBitrate = DEFAULT_BITRATE
): string | null {
  if (!getReciter(reciterId)) return null;
  const global = toGlobalOrdinal(surah, ayah);
  if (global === null) return null;
  return `/api/audio/${encodeURIComponent(reciterId)}/${global}?bitrate=${bitrate}`;
}
```

The existing `ayahAudioUrl()` is retained but marked deprecated with a JSDoc comment.

### 6.2 `audio-player.tsx` — Gated State Handling

The player must distinguish between:
1. **No URL** (invalid reference) → render nothing (current behavior)
2. **Gated** (403 with `gated: true`) → render informational message
3. **Error** (network failure, 502) → render "Audio unavailable" (current behavior)

Implementation approach:
- On first play attempt, fetch the proxy URL
- If response is 403 with JSON body containing `gated: true`, set `gated` state
- Render gated message instead of retry button

### 6.3 User-Facing Messaging

**Gated state:**
> 🎧 Audio for {reciter name} is temporarily unavailable while distribution rights are verified.
> You can listen externally at [Islamic Network CDN](external-url).

**Error state (unchanged):**
> Audio unavailable

---

## 7. Caching Strategy

| Layer | Policy | Rationale |
|---|---|---|
| Browser | `max-age=3600, stale-while-revalidate=86400` | Audio rarely changes; stale playback acceptable during revalidation |
| Next.js Data Cache | `revalidate: 86400` | Matches translation cache policy |
| CDN (upstream) | Not controlled | App server absorbs cache misses |
| Gated responses | `no-store` | Never cache a gate decision; re-check on every request |

---

## 8. Environment Variables

| Variable | Values | Default | Effect |
|---|---|---|---|
| `AUDIO_RIGHTS_ENFORCEMENT` | `"true"` / `"false"` | `"false"` | Master switch for audio gating |
| `CLEARED_RECITERS` | Comma-separated reciter IDs | *(empty)* | Reciters exempted from gating when enforcement is on |

These mirror the existing `TANZIL_RIGHTS_ENFORCEMENT` pattern for consistency.

---

## 9. Migration Path

1. **Phase 1**: Deploy proxy route alongside existing direct URLs. Both work.
2. **Phase 2**: Switch `audio-player.tsx` to use proxy URL. Direct URL function deprecated.
3. **Phase 3**: Enable `AUDIO_RIGHTS_ENFORCEMENT=true`. All reciters gated by default.
4. **Phase 4**: Clear individual reciters as rights are verified via `CLEARED_RECITERS`.
5. **Phase 5**: Remove deprecated `ayahAudioUrl()` after full migration.

Each phase is independently deployable and reversible.
