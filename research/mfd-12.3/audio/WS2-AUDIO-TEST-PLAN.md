# WS2: Audio Rights Gate — Test Plan

> **MFD-12.3** — Verification test cases for audio rights controls.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. Test Scope

This plan covers verification of the server-proxied audio delivery system
specified in WS2-AUDIO-IMPLEMENTATION-SPEC.md.

### In Scope

- API route correctness (success, gated, error responses)
- Rights gate enforcement logic
- Client-side player behavior under all states
- Caching behavior
- Environment variable controls
- Direct CDN access prevention

### Out of Scope

- Audio quality/bitrate fidelity (assumed correct from CDN)
- Performance/load testing (separate concern)
- Mobile-specific playback (covered by general player tests)

---

## 2. Unit Tests

### 2.1 `audio-rights.ts`

| ID | Test Case | Expected Result |
|---|---|---|
| U-AR-01 | `isAudioRightsEnforcementEnabled()` with env unset | Returns `false` |
| U-AR-02 | `isAudioRightsEnforcementEnabled()` with env `"false"` | Returns `false` |
| U-AR-03 | `isAudioRightsEnforcementEnabled()` with env `"true"` | Returns `true` |
| U-AR-04 | `isReciterGated("ar.alafasy")` with enforcement off | Returns `false` |
| U-AR-05 | `isReciterGated("ar.alafasy")` with enforcement on, not cleared | Returns `true` |
| U-AR-06 | `isReciterGated("ar.alafasy")` with enforcement on, in CLEARED_RECITERS | Returns `false` |
| U-AR-07 | `isReciterGated("invalid.reciter")` | Returns `true` (unknown = gated) |
| U-AR-08 | `getReciterRights("ar.alafasy")` returns valid ReciterRights object | Non-null with required fields |
| U-AR-09 | `getReciterRights("nonexistent")` | Returns `null` |

### 2.2 `audio.ts` — URL Generation

| ID | Test Case | Expected Result |
|---|---|---|
| U-AU-01 | `ayahAudioProxyUrl("ar.alafasy", 1, 1)` | Returns `/api/audio/ar.alafasy/1?bitrate=64` |
| U-AU-02 | `ayahAudioProxyUrl("ar.alafasy", 1, 1, 128)` | Returns `/api/audio/ar.alafasy/1?bitrate=128` |
| U-AU-03 | `ayahAudioProxyUrl("invalid", 1, 1)` | Returns `null` |
| U-AU-04 | `ayahAudioProxyUrl("ar.alafasy", 0, 1)` | Returns `null` (invalid surah) |
| U-AU-05 | `ayahAudioProxyUrl("ar.alafasy", 1, 8)` | Returns `null` (Al-Fatiha has 7 ayahs) |
| U-AU-06 | `ayahAudioProxyUrl("ar.alafasy", 114, 6)` | Valid URL (An-Nas has 6 ayahs) |
| U-AU-07 | `ayahAudioProxyUrl("ar.alafasy", 114, 7)` | Returns `null` (An-Nas has only 6) |

---

## 3. Integration Tests — API Route

### 3.1 Success Path

| ID | Test Case | Expected Result |
|---|---|---|
| I-API-01 | GET `/api/audio/ar.alafasy/1?bitrate=64` (enforcement off) | 200, Content-Type: audio/mpeg, valid MP3 bytes |
| I-API-02 | GET `/api/audio/ar.alafasy/1?bitrate=192` | 200, larger file size than 64kbps |
| I-API-03 | GET `/api/audio/ar.alafasy/6236` (last ayah) | 200, valid MP3 |
| I-API-04 | Response headers include `Cache-Control: public, max-age=3600` | Header present |
| I-API-05 | Response headers include `X-Audio-Source: cdn.islamic.network` | Header present |
| I-API-06 | Response is streamed (not buffered) | Memory usage stays constant for large files |

### 3.2 Gated Path

| ID | Test Case | Expected Result |
|---|---|---|
| I-API-07 | GET `/api/audio/ar.alafasy/1` (enforcement on, not cleared) | 403, JSON body with `gated: true` |
| I-API-08 | Gated response includes `reason: "rights-under-review"` | Field present |
| I-API-09 | Gated response includes valid `externalUrl` | URL points to CDN |
| I-API-10 | Gated response has `Cache-Control: no-store` | Header present |
| I-API-11 | GET `/api/audio/ar.alafasy/1` (enforcement on, ar.alafasy cleared) | 200, audio delivered |

### 3.3 Error Path

| ID | Test Case | Expected Result |
|---|---|---|
| I-API-12 | GET `/api/audio/invalid.reciter/1` | 400, JSON error |
| I-API-13 | GET `/api/audio/ar.alafasy/0` | 400, invalid global ayah |
| I-API-14 | GET `/api/audio/ar.alafasy/9999` | 400, out of range |
| I-API-15 | GET `/api/audio/ar.alafasy/abc` | 400, non-numeric |
| I-API-16 | CDN returns 404 (simulated) | 502, upstream-failure error |
| I-API-17 | CDN timeout (simulated) | 502, upstream-failure error |
| I-API-18 | Missing bitrate param | 200, defaults to 64 kbps |

---

## 4. Client Component Tests

### 4.1 AudioPlayer Behavior

| ID | Test Case | Expected Result |
|---|---|---|
| C-AP-01 | Player renders with valid props | Play button visible |
| C-AP-02 | Click play → audio loads from proxy URL | Network request to `/api/audio/...` |
| C-AP-03 | Audio plays successfully | Playing state, pause button shown |
| C-AP-04 | Proxy returns 403 gated | Gated message displayed, no retry |
| C-AP-05 | Proxy returns 502 error | "Audio unavailable" message shown |
| C-AP-06 | Invalid reciter prop | Component renders nothing |
| C-AP-07 | Compact mode | Smaller button, condensed layout |
| C-AP-08 | Reciter change while playing | Stops current, resets state |
| C-AP-09 | Ayah change while playing | Stops current, resets state |
| C-AP-10 | Keyboard accessibility | Space/Enter toggles play |
| C-AP-11 | aria-label updates with state | Correct label for screen readers |

### 4.2 AyahCard Integration

| ID | Test Case | Expected Result |
|---|---|---|
| C-AC-01 | `showAudio=true` | AudioPlayer rendered |
| C-AC-02 | `showAudio=false` | No AudioPlayer in DOM |
| C-AC-03 | Audio disabled globally | No audio UI elements |

---

## 5. Security Tests

| ID | Test Case | Expected Result |
|---|---|---|
| S-01 | Construct CDN URL directly in browser | Works (CDN is public), but app UI never exposes it |
| S-02 | Modify client JS to bypass proxy | Possible, but server proxy is the only path from app UI |
| S-03 | Path traversal in reciter param (`../etc/passwd`) | 400, rejected by validation |
| S-04 | SQL injection in params | N/A (no database), but input sanitized |
| S-05 | Excessive request rate | Rate limiting applied (if configured) |
| S-06 | Large globalAyah value (overflow) | 400, rejected by validation |
| S-07 | Negative bitrate | 400 or ignored, defaults to 64 |

---

## 6. Caching Tests

| ID | Test Case | Expected Result |
|---|---|---|
| CA-01 | First request → cache miss | Server fetches from CDN, returns 200 |
| CA-02 | Second request (within max-age) → browser cache | No server request observed |
| CA-03 | Request after max-age, within stale-while-revalidate | Stale response served, background revalidation |
| CA-04 | Gated response caching | Never cached (`no-store`) |
| CA-05 | Toggle enforcement on → previously cached audio | Browser may serve stale; new requests hit gate |
| CA-06 | Toggle enforcement off → previously gated | New requests succeed; no stale gate response |

---

## 7. Environment Variable Tests

| ID | Test Case | Expected Result |
|---|---|---|
| E-01 | Start with enforcement off → all audio works | Confirmed |
| E-02 | Set enforcement on, restart → all audio gated | Confirmed |
| E-03 | Add reciter to CLEARED_RECITERS, restart → that reciter works | Confirmed |
| E-04 | Remove reciter from CLEARED_RECITERS, restart → that reciter gated | Confirmed |
| E-05 | Set enforcement off, restart → all audio works again | Confirmed |
| E-06 | Invalid CLEARED_RECITERS value (typo) | Ignored, reciter remains gated |

---

## 8. Regression Tests

Ensure existing functionality is not broken:

| ID | Test Case | Expected Result |
|---|---|---|
| R-01 | Translation proxy still works | Unaffected by audio changes |
| R-02 | Search functionality works | Unaffected |
| R-03 | Ayah card renders correctly without audio | Layout unchanged |
| R-04 | Reciter selector still lists all 12 reciters | Even if some are gated |
| R-05 | Source catalog displays audio record | Shows enriched metadata |
| R-06 | Page load performance | No significant regression |

---

## 9. Acceptance Criteria Summary

The audio rights gate is considered complete when:

- [ ] All unit tests pass (Section 2)
- [ ] All integration tests pass (Section 3)
- [ ] Client component tests pass (Section 4)
- [ ] Security tests confirm no bypass via app UI (Section 5)
- [ ] Caching behaves as specified (Section 6)
- [ ] Environment variables control gating correctly (Section 7)
- [ ] No regressions in existing features (Section 8)
- [ ] Disable procedure documented and tested (WS2-AUDIO-DISABLE-PROCEDURE.md)
- [ ] Code review completed by human reviewer
- [ ] `reviewStatus` updated from `pending-review` to `approved`

---

## 10. Test Execution Order

1. Unit tests (fastest feedback)
2. Integration tests (API route)
3. Client component tests
4. Security tests
5. Caching tests
6. Environment variable tests
7. Regression tests
8. Manual acceptance testing

Estimated total execution time: ~2 hours for full suite.

---

## 11. Dual-Rights Model Tests (WS-E Alignment)

These tests verify compliance with WS-E-AUDIO-RIGHTS-POLICY.md requirements:

| ID | Test Case | Expected Result |
|---|---|---|
| D-01 | Distribution cleared, performer authorized → playback | 200, audio delivered |
| D-02 | Distribution cleared, performer unverified → gated | 403 or partial clearance per Directive 5 |
| D-03 | Distribution unverified, performer authorized → gated | 403 or partial clearance per Directive 5 |
| D-04 | Both unverified → gated | 403, no audio delivered |
| D-05 | Distribution disputed → gated regardless of performer | 403 |
| D-06 | Performer disputed → gated regardless of distribution | 403 |
| D-07 | Partial clearance disclaimer header present | `X-Rights-Disclaimer` set correctly |
| D-08 | Client renders partial clearance notice | UI shows WS-E §3 Directive 5 message |

---

## 12. Fallback Pattern Tests (WS3 Alignment)

These tests verify the audio proxy follows the same fallback pattern as `/api/translations/[id]/route.ts`:

| ID | Test Case | Expected Result |
|---|---|---|
| F-01 | Requested reciter gated, fallback available | 200 with fallback audio, `X-Fallback-Requested-Id` header |
| F-02 | Requested reciter gated, no fallback available | 403 with structured gated response |
| F-03 | Fallback substitution logged | `console.warn` with `audio-rights-gate-fallback` event |
| F-04 | Blocked request logged | `console.warn` with `audio-rights-gate-blocked` event |
| F-05 | Log format matches WS3 translation fallback format | Same JSON structure, different field names |
| F-06 | User's `reciterId` preference preserved after fallback | `usePrefs().reciterId` unchanged |
| F-07 | Client displays fallback notice | UI shows "Playing X instead of Y" message |
| F-08 | Settings page marks gated reciters | "(under review)" suffix shown |

---

## 13. Takedown Response Tests (WS-E §3 Directive 6)

| ID | Test Case | Expected Result |
|---|---|---|
| T-01 | Remove reciter from CLEARED_RECITERS, restart | That reciter returns 403 |
| T-02 | Previously cached audio for removed reciter | Stale cache may serve once; subsequent requests gated |
| T-03 | Bulk disable via `CLEARED_RECITERS=` empty | All reciters return 403 |
| T-04 | Re-add reciter to CLEARED_RECITERS, restart | That reciter delivers again |
| T-05 | Takedown action logged in audit trail | Entry present with timestamp and reason |
