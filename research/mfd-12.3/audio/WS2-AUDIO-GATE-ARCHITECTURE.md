# WS2: Audio Gate Architecture — Options Analysis

> **MFD-12.3** — Evaluation of approaches for server-enforced audio rights controls.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## Problem Statement

Audio URLs are generated entirely client-side by `ayahAudioUrl()` in `src/lib/quran/audio.ts`. The browser fetches MP3s directly from `cdn.islamic.network` with zero server involvement. This means:

1. The existing `rights-gate.ts` module cannot intercept audio requests.
2. There is no mechanism to disable audio delivery pending rights verification.
3. Any user can construct and access any of the ~449K possible audio URLs without passing through application logic.
4. The RIGHTS-DELIVERY-INVENTORY.md classifies this as a **MEDIUM** risk gap.

---

## Option A: Server Proxy (Translation Pattern)

Route all audio through a new Next.js API route: `/api/audio/[reciter]/[globalAyah]`

### How It Works

```
Browser → /api/audio/ar.alafasy/1 → Server checks rights-gate
  → ALLOWED: Server fetches cdn.islamic.network/.../1.mp3, streams response
  → GATED: Returns 403 with structured GatedAudioResponse
```

### Pros

| Advantage | Detail |
|---|---|
| **Full server control** | Every audio request passes through app logic; identical pattern to translations |
| **Reuses existing gate** | Can extend `rights-gate.ts` with `isReciterGated()` alongside `isEditionGated()` |
| **Can enforce per-reciter granularity** | Individual reciters can be cleared or blocked independently |
| **Observability** | Server logs every audio request; can track usage, detect abuse |
| **Cache control** | App sets `Cache-Control`, `ETag`, revalidation policy |
| **Fallback UX** | Can return structured JSON error that the player renders as a message |
| **Reversible disable** | Single env var controls all audio, same as translations |

### Cons

| Disadvantage | Detail |
|---|---|
| **Bandwidth cost** | All audio bytes transit the app server (~30–80 KB per ayah at 64 kbps) |
| **Latency** | Extra hop adds ~50–200ms per request vs. direct CDN |
| **Server load** | 6,236 potential concurrent streams during peak usage |
| **Infrastructure** | Requires sufficient server bandwidth/storage for proxying |
| **Complexity** | Must handle range requests, streaming responses, error propagation |
| **Single point of failure** | If app server is down, audio is unavailable even if CDN is up |

### Effort Estimate

| Task | Effort |
|---|---|
| New API route with streaming proxy | Medium |
| Extend rights-gate.ts | Low |
| Update audio-player.tsx to use proxy URL | Low |
| Cache strategy (stale-while-revalidate) | Medium |
| Error handling & fallback UX | Low |
| **Total** | **~2–3 days** |

### Caching Implications

- Server-side: Next.js data cache with `revalidate: 86400` (matches translation pattern)
- Browser: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- CDN: Bypassed (app server becomes the cache layer)

---

## Option B: Client-Side Gate

Check rights status before generating the URL. Modify `ayahAudioUrl()` to accept or check gate state.

### How It Works

```
ahAudioUrl(reciterId, surah, ayah)
  → if (isReciterGated(reciterId)) return null
  → else return CDN URL as before
```

The `<AudioPlayer>` already handles `null` return (line 46: `if (!src) return null`).

### Pros

| Advantage | Detail |
|---|---|
| **Zero bandwidth cost** | No server proxying; CDN delivers directly |
| **Zero latency impact** | Direct CDN access preserved |
| **Minimal code change** | ~5 lines in `audio.ts` + gate extension |
| **No infrastructure change** | No new API route, no server capacity planning |
| **Offline-compatible** | Works with cached audio even when server is unreachable |

### Cons

| Disadvantage | Detail |
|---|---|
| **Trivially bypassed** | User can construct CDN URL manually or modify client JS |
| **Gate state must reach client** | Requires embedding gate config in page payload or fetching it |
| **No observability** | Server never sees blocked requests; cannot audit |
| **No cache control** | CDN headers still apply; app cannot override |
| **Inconsistent with translation pattern** | Two different gating models in the same app |
| **Not enforceable** | Does not meet "server-enforced" requirement from objective |

### Effort Estimate

| Task | Effort |
|---|---|
| Extend rights-gate.ts | Low |
| Modify ayahAudioUrl() signature | Low |
| Pass gate state to client component | Medium |
| **Total** | **~0.5–1 day** |

### Caching Implications

- No change to existing caching behavior
- Gate state itself needs caching (embedded in SSR or fetched once)

---

## Option C: Hybrid — Signed/Temporary URLs

Server issues short-lived signed URLs after rights check. Browser uses signed URL to fetch directly from CDN.

### How It Works

```
Browser → /api/audio-token?reciter=ar.alafasy&ayah=1
  → Server checks rights-gate
  → ALLOWED: Returns { url: "https://cdn...?sig=xxx&exp=1700000000" }
  → GATED: Returns 403 with structured GatedAudioResponse
Browser → Fetches signed URL directly from CDN
```

### Pros

| Advantage | Detail |
|---|---|
| **Server-enforced** | Token issuance requires passing gate check |
| **No bandwidth proxying** | Audio bytes flow CDN→browser directly |
| **Time-limited access** | Expired tokens prevent persistent offline access |
| **Auditable** | Token requests logged server-side |
| **CDN-native** | Leverages CDN's native delivery performance |

### Cons

| Disadvantage | Detail |
|---|---|
| **CDN must support signing** | Islamic Network CDN has **no documented signing/token mechanism** |
| **Requires CDN cooperation** | Cannot implement unilaterally; depends on third-party feature |
| **Complexity** | Token generation, validation, expiry, rotation logic |
| **Extra round-trip** | Token request before each audio fetch (or batch pre-fetch) |
| **Not feasible with current CDN** | cdn.islamic.network is a simple static file server with no auth |
| **Migration risk** | Would require switching to a CDN that supports signed URLs |

### Effort Estimate

| Task | Effort |
|---|---|
| Evaluate CDN signing support | Low (already known: unsupported) |
| Migrate to signing-capable CDN | High |
| Token API route | Medium |
| Client token management | Medium |
| **Total** | **~5–10 days (if CDN supports it); NOT FEASIBLE currently** |

### Caching Implications

- Token responses: short `max-age` (seconds to minutes)
- Audio files: CDN cache unaffected; signed URL may bypass shared cache

---

## Comparative Matrix

| Criterion | A: Server Proxy | B: Client Gate | C: Signed URLs |
|---|---|---|---|
| Server-enforced | ✅ Yes | ❌ No | ✅ Yes |
| Bandwidth cost | ❌ High | ✅ Zero | ✅ Zero |
| Latency impact | ❌ Added hop | ✅ None | ⚠️ Token round-trip |
| Implementation effort | ⚠️ Medium | ✅ Low | ❌ High |
| Feasibility with current CDN | ✅ Yes | ✅ Yes | ❌ No |
| Observability | ✅ Full | ❌ None | ✅ Token requests |
| Per-reciter granularity | ✅ Yes | ✅ Yes | ✅ Yes |
| Consistency with translation gate | ✅ Identical pattern | ❌ Different model | ⚠️ Similar but distinct |
| Reversible disable | ✅ Env var | ✅ Env var | ✅ Env var |
| Bypass resistance | ✅ High | ❌ Trivial | ✅ High |
| Offline resilience | ❌ Server-dependent | ✅ CDN-direct | ⚠️ Token-dependent |

---

## Recommendation: Option A (Server Proxy)

### Rationale

1. **Meets the stated objective**: "server-enforced audio rights controls" — only Options A and C provide true server enforcement, and C is infeasible with the current CDN.

2. **Consistency**: The translation delivery path already uses a server proxy with rights gating (`/api/translations/[id]`). Applying the same pattern to audio creates a uniform security model across all external content.

3. **Feasibility**: Works with the existing Islamic Network CDN without requiring any CDN-side changes.

4. **Reversibility**: Controlled by the same env-var pattern (`TANZIL_RIGHTS_ENFORCEMENT` or a new `AUDIO_RIGHTS_ENFORCEMENT`), making disable/enable trivial and auditable.

5. **Granularity**: Supports per-reciter gating from day one, enabling incremental rights clearance.

6. **Risk mitigation**: The MEDIUM risk identified in the inventory is fully resolved — no ungated delivery path remains.

### Addressing the Bandwidth Concern

The primary disadvantage of Option A is bandwidth. Mitigations:

- **Aggressive caching**: `stale-while-revalidate` means repeat plays hit browser cache, not the server.
- **Bitrate default**: 64 kbps ≈ 30–80 KB per ayah. Even heavy users generate modest traffic.
- **Lazy loading**: Audio is only fetched on explicit play action (`preload="none"`), so idle readers generate zero audio traffic.
- **Future optimization**: If bandwidth becomes an issue, migrate to Option C later when a signing-capable CDN is available. The proxy approach is a safe interim solution.

### Decision Record

| Field | Value |
|---|---|
| **Selected option** | A: Server Proxy |
| **Decided by** | AI-assisted analysis (pending human review) |
| **Date** | 2026-11-21 |
| **Supersedes** | Current ungated client-direct delivery |
| **Review trigger** | When Islamic Network CDN adds URL signing support, re-evaluate Option C |
