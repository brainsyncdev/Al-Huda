# WS2: Per-Recording Rights & Cache Invalidation — Implementation Report

> **MFD-12.4 WS2 Gaps A & B** — Completes two unmet mandatory conditions:
> per-recording rights metadata and cache invalidation/withdrawal procedures.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. Summary

This report documents the implementation of two gaps identified in the original
WS2 Audio Rights Implementation:

- **Gap A**: Per-recording rights metadata was absent. The registry was keyed
  only by `reciterId`, making it impossible to distinguish between different
  recording variants (e.g., Murattal vs Mujawwad) with different rights status.
- **Gap B**: Cache invalidation and withdrawal procedures were missing. Cached
  audio responses could be served for up to 24 hours after rights withdrawal
  due to `stale-while-revalidate=86400` and no cache-busting mechanism.

Both gaps are now fully resolved.

---

## 2. Gap A: Per-Recording Rights Metadata

### 2.1 New Types

| Type | Purpose |
|---|---|
| `RecordingStyle` | Union: `'murattal' \| 'mujawwad' \| 'unspecified'` |
| `RecordingRightsMetadata` | Per-recording rights: recordingId, reciterId, recordingStyle, distribution/performer status, withdrawnAt, clearedAt, notes |

### 2.2 Extended ReciterRightsMetadata

Added `recordings: RecordingRightsMetadata[]` field. Every reciter in the
registry now has at least one default recording entry keyed by the CDN edition
id (which IS the primary recording).

### 2.3 Recording Style Inference

- `ar.abdulbasit` → `'murattal'` (evidenced by catalog label "Abdul Basit (Murattal)" in `audio.ts` line 33)
- All others → `'unspecified'`

### 2.4 New Functions

| Function | Behavior |
|---|---|
| `getRecordingRights(reciterId, recordingId)` | Returns specific recording metadata or null |
| `isRecordingGated(reciterId, recordingId)` | Default-deny per recording; unknown recordingId is gated |
| `getPrimaryRecordingId(reciterId)` | Returns first recording's ID (CDN edition id) |

### 2.5 Updated isReciterGated()

A reciter is now ungated ONLY if:
1. It appears in `CLEARED_RECITERS`, AND
2. At least one recording has `distributionRightsStatus === 'cleared'` AND `performerRightsStatus === 'authorized' | 'waived'`, AND
3. That recording has no `withdrawnAt` timestamp

This prevents indiscriminate clearance of all recordings when only one variant
is verified.

### 2.6 Proxy Route Integration

The `/api/audio/[reciter]/[globalAyah]` route now:
- Accepts optional `?recording=` query parameter
- Defaults to the reciter's primary recording when omitted
- Checks both `isReciterGated()` AND `isRecordingGated()` before serving
- Includes `recordingId` and `gateLevel` in audit logs

---

## 3. Gap B: Cache Invalidation & Withdrawal

### 3.1 RIGHTS_CACHE_VERSION

New constant (env-configurable via `RIGHTS_CACHE_VERSION`, default `'1'`):
- Extracted to `src/lib/quran/audio-rights-version.ts` to avoid circular dependency
- Re-exported from `audio-rights.ts` for backward compatibility
- Included in every proxy URL as `?rv=N` query parameter
- Included in every ETag computation

### 3.2 Cache-Control Changes

| Before | After |
|---|---|
| `public, max-age=3600, stale-while-revalidate=86400` | `public, max-age=300` |
| No ETag | ETag derived from `reciterId:recordingId:globalAyah:bitrate:rvN` |
| Withdrawn content servable for 24h | Max 5 min natural expiry; version bump forces immediate invalidation |

### 3.3 Conditional Request Support

The proxy now handles `If-None-Match` headers:
- If client's ETag matches current version → 304 Not Modified
- If version bumped → ETag differs → full response or 403

### 3.4 Withdrawal Runbook

Complete operational runbook at `research/mfd-12.4/audio/WS2-AUDIO-WITHDRAWAL-RUNBOOK.md`
covers:
- Single recording withdrawal
- Full reciter withdrawal
- Emergency withdrawal (nuclear option)
- Verification checklist
- Reinstatement procedure
- Version history tracking

---

## 4. Files Changed

| File | Change |
|---|---|
| `src/lib/quran/audio-rights-version.ts` | **NEW** — Cache version constant (breaks circular dep) |
| `src/lib/quran/audio-rights.ts` | Added `RecordingRightsMetadata`, `RecordingStyle`, `recordings[]` field, `getRecordingRights()`, `isRecordingGated()`, `getPrimaryRecordingId()`, updated `isReciterGated()` |
| `src/lib/quran/audio.ts` | Added `recordingId` param and `rv=` cache version to `ayahAudioProxyUrl()` |
| `src/app/api/audio/[reciter]/[globalAyah]/route.ts` | Added recording param parsing, dual gate check, ETag, reduced cache headers, 304 support |
| `src/lib/quran/audio-rights.test.ts` | Added 17 new tests for per-recording metadata, recording gating, cache version |
| `src/lib/quran/audio-proxy-url.test.ts` | Updated URL assertions for `rv=` param; added cache version tests |
| `research/mfd-12.4/audio/WS2-AUDIO-WITHDRAWAL-RUNBOOK.md` | **NEW** — Operational withdrawal procedures |
| `research/mfd-12.4/audio/WS2-PER-RECORDING-RIGHTS-REPORT.md` | **NEW** — This report |
| `research/mfd-12.4/audio/WS2-AUDIO-IMPLEMENTATION-REPORT.md` | Updated §5, §9, added per-recording and cache invalidation sections |

---

## 5. Test Results

- **Typecheck**: Exit code 0 ✅
- **Tests**: 224 passed, 0 failed across 13 files ✅
- **New tests**: 17 (per-recording metadata, recording gating, cache version, URL params)
- **Updated tests**: 6 (adjusted expectations for new isReciterGated semantics)
- **Zero regressions**: All pre-existing tests pass

---

## 6. Safeguards Verified

| Safeguard | Status |
|---|---|
| Canonical Qur'anic text NOT modified | ✅ |
| Default-deny holds when enforcement ON | ✅ |
| Transparent pass-through when enforcement OFF | ✅ |
| No client-side direct CDN URL delivery | ✅ |
| DEFAULT_TRANSLATION_ID unchanged | ✅ |
| node_modules/ and data/ untouched | ✅ |

---

## 7. Known Limitations

1. **Registry is static**: Recording metadata is defined at module load time.
   Adding new recording variants requires code changes and redeployment.
2. **No runtime registry mutation**: Cannot clear/withdraw individual recordings
   without editing source and restarting. Future enhancement could add an admin API.
3. **Single primary recording**: The proxy defaults to the first recording entry.
   Clients must explicitly pass `?recording=` for non-primary variants.
4. **Version bump is manual**: No automated trigger when registry changes.
   Operators must remember to bump `RIGHTS_CACHE_VERSION` per the runbook.
