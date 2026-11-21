# WS2: Audio Rights Withdrawal Runbook

> **MFD-12.4 WS2 Gap B** — Step-by-step procedure for withdrawing audio rights
> for a reciter or individual recording, ensuring no stale content is served.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. Overview

This runbook documents the exact steps to withdraw audio delivery rights for:
- **A specific recording** (e.g., Abdul Basit Mujawwad while keeping Murattal)
- **An entire reciter** (all recordings withdrawn at once)

The system uses a cache-busting version token (`RIGHTS_CACHE_VERSION`) to ensure
withdrawn content cannot be served from browser or CDN caches after withdrawal.

### Key Mechanisms

| Mechanism | Purpose |
|---|---|
| `CLEARED_RECITERS` env var | Controls which reciters are eligible for audio delivery |
| `RecordingRightsMetadata.withdrawnAt` | Per-recording withdrawal timestamp in registry |
| `RIGHTS_CACHE_VERSION` | Cache-busting token; bumping invalidates ALL cached URLs and ETags |
| ETag header | Derived from reciter+recording+ayah+bitrate+version; changes on version bump |
| `Cache-Control: public, max-age=300` | Short TTL (5 min) ensures natural expiry even without version bump |
| No `stale-while-revalidate` | Prevents serving stale content during revalidation |

---

## 2. Withdrawing a Single Recording

Use when one recording variant (e.g., Mujawwad) loses rights but others remain valid.

### Steps

1. **Update the registry** in `src/lib/quran/audio-rights.ts`:
   - Find the `RECITER_RIGHTS_REGISTRY` entry for the parent reciter
   - Locate the specific `RecordingRightsMetadata` in the `recordings[]` array
   - Set `distributionRightsStatus: "disputed"` (or appropriate status)
   - Set `performerRightsStatus: "disputed"` (or appropriate status)
   - Add `withdrawnAt: new Date().toISOString()` timestamp
   - Update `notes` with withdrawal reason

2. **Bump the cache version**:
   - Edit `src/lib/quran/audio-rights-version.ts`
   - Change the default value from `"N"` to `"N+1"` (e.g., `"1"` → `"2"`)
   - OR set the environment variable: `RIGHTS_CACHE_VERSION=N+1`

3. **Restart the server**:
   - Environment variables and module-level constants are read at startup
   - A restart is REQUIRED for changes to take effect

4. **Verify the withdrawal**:
   ```bash
   # Should return 403 with gateLevel: "recording"
   curl -v "http://localhost:3000/api/audio/ar.abdulbasit/1?bitrate=64&recording=ar.abdulbasit.mujawwad"
   
   # Primary recording should still work if not withdrawn
   curl -v "http://localhost:3000/api/audio/ar.abdulbasit/1?bitrate=64"
   ```

5. **Confirm audit log**:
   - Check stderr/logs for `audio-rights-gate-blocked` event
   - Verify `gateLevel: "recording"` and correct `recordingId`

### Expected Propagation Time

- **With version bump + restart**: Immediate for all new requests. Previously cached
  responses expire within 5 minutes (max-age=300) or on next conditional request
  (ETag mismatch triggers 304 → fresh fetch).
- **Without version bump**: Up to 5 minutes for browser cache expiry. NOT recommended
  for urgent withdrawals.

---

## 3. Withdrawing an Entire Reciter

Use when all recordings for a reciter lose distribution rights.

### Steps

1. **Remove from CLEARED_RECITERS**:
   - Edit the `CLEARED_RECITERS` environment variable
   - Remove the reciter ID from the comma-separated list
   - Example: `CLEARED_RECITERS=ar.alafasy,ar.husary` (removed ar.minshawi)

2. **Update the registry** (for documentation/audit trail):
   - In `src/lib/quran/audio-rights.ts`, find the reciter's entry
   - Set all recordings' `withdrawnAt` timestamps
   - Set reciter-level `status: "restricted"`
   - Add withdrawal reason to `notes`

3. **Bump the cache version**:
   - Same as §2 step 2

4. **Restart the server**

5. **Verify the withdrawal**:
   ```bash
   # Should return 403 with gateLevel: "reciter"
   curl -v "http://localhost:3000/api/audio/ar.minshawi/1?bitrate=64"
   
   # All recording variants should also be blocked
   curl -v "http://localhost:3000/api/audio/ar.minshawi/1?bitrate=64&recording=ar.minshawi"
   ```

6. **Confirm no stale delivery**:
   - Test from a browser that previously cached audio
   - The version bump in the URL (`?rv=N+1`) ensures the browser treats it as a new resource
   - Any conditional requests (If-None-Match) will receive a new ETag → full response or 403

---

## 4. Emergency Withdrawal (Immediate)

For legal takedown requests requiring sub-minute response:

1. Set `AUDIO_RIGHTS_ENFORCEMENT=true` (if not already)
2. Clear `CLEARED_RECITERS` entirely (or remove the specific reciter)
3. Bump `RIGHTS_CACHE_VERSION`
4. Restart immediately
5. All audio returns 403 until reciters are re-cleared

This is the nuclear option — it gates ALL reciters, not just the target.
Use only when the specific reciter cannot be isolated quickly enough.

---

## 5. Verification Checklist

After any withdrawal, confirm:

- [ ] Target reciter/recording returns HTTP 403
- [ ] Response body contains `gated: true` and `reason: "rights-under-review"`
- [ ] Audit log shows `audio-rights-gate-blocked` event with correct details
- [ ] Non-withdrawn reciters/recordings continue to return HTTP 200
- [ ] Browser DevTools Network tab shows new URL with updated `rv=` parameter
- [ ] ETag header is present and differs from pre-withdrawal value
- [ ] `Cache-Control` header is `public, max-age=300` (no stale-while-revalidate)
- [ ] Gated responses have `Cache-Control: no-store`

---

## 6. Reinstating After Withdrawal

To restore a previously withdrawn recording:

1. Remove `withdrawnAt` from the recording's metadata
2. Set `distributionRightsStatus: "cleared"` and `performerRightsStatus: "authorized"`
3. Set `clearedAt: new Date().toISOString()`
4. Ensure the parent reciter is in `CLEARED_RECITERS`
5. Bump `RIGHTS_CACHE_VERSION` (to invalidate any cached 403 responses)
6. Restart the server

---

## 7. Version History

| Version | Date | Reason |
|---|---|---|
| 1 | 2026-11-21 | Initial deployment |

Maintain this table. Every bump MUST have a corresponding row documenting why.
