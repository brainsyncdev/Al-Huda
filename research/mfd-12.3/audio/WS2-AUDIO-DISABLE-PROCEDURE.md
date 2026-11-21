# WS2: Audio Disable Procedure

> **MFD-12.3** — Reversible procedure to disable unverified audio delivery.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## 1. Objective

Provide a safe, reversible mechanism to disable all audio delivery pending rights
clearance, without modifying source code or requiring redeployment.

---

## 2. Immediate Disable (Pre-Implementation)

Before the server proxy is built, audio can be disabled entirely by removing the
UI entry point. This is a **code change** but is trivially reversible.

### Steps

1. In `src/components/quran/ayah-card.tsx`, locate the audio rendering block (line ~274):
   ```tsx
   {showAudio && (
     <AudioPlayer surah={ayah.surah} ayah={ayah.ayah} reciterId={reciterId} />
   )}
   ```

2. Comment out or wrap in a feature flag:
   ```tsx
   {/* AUDIO DISABLED — MFD-12.3 rights remediation */}
   {/* {showAudio && (
     <AudioPlayer surah={ayah.surah} ayah={ayah.ayah} reciterId={reciterId} />
   )} */}
   ```

3. Rebuild and deploy.

### Reversal

Uncomment the block and redeploy. No other changes needed.

### Risk Assessment

| Aspect | Assessment |
|---|---|
| Scope | Single file, single block |
| Side effects | None — audio player is self-contained |
| Data loss | None |
| Recovery time | < 5 minutes |
| Verification | Visual inspection of ayah card |

---

## 3. Post-Implementation Disable (With Server Proxy)

After the server proxy is deployed, audio gating is controlled entirely by environment
variables. No code changes required.

### Disable All Audio

Set the environment variable:

```bash
AUDIO_RIGHTS_ENFORCEMENT=true
```

Restart the application server.

**Effect**: All 12 reciters return 403 with structured gated response. Player shows
informational message. No MP3 bytes are proxied.

### Selectively Enable Verified Reciters

```bash
AUDIO_RIGHTS_ENFORCEMENT=true
CLEARED_RECITERS=ar.alafasy,ar.husary
```

**Effect**: Only Alafasy and Husary audio is delivered. All others remain gated.

### Full Re-enable (Emergency Rollback)

```bash
AUDIO_RIGHTS_ENFORCEMENT=false
```

Or simply unset the variable. Restart the server.

**Effect**: All reciters pass through. Identical to pre-gating behavior.

---

## 4. Verification Checklist

After any disable/enable operation:

- [ ] Navigate to an ayah card with audio enabled
- [ ] Attempt to play audio for each affected reciter
- [ ] Verify expected behavior:
  - **Disabled**: Gated message displayed, no network request to CDN
  - **Enabled**: Audio plays normally
- [ ] Check browser DevTools Network tab:
  - **Disabled**: `/api/audio/...` returns 403 with JSON body
  - **Enabled**: `/api/audio/...` returns 200 with `audio/mpeg`
- [ ] Verify no console errors
- [ ] Confirm translation/text content is unaffected

---

## 5. Communication Template

When audio is disabled, display the following user-facing notice on the reader page:

> **Audio Notice**: Recitation audio is temporarily unavailable while we verify
> distribution rights for our audio sources. We expect to restore this feature
> after completing our rights review. Thank you for your patience.

This notice should be dismissible and stored in localStorage to avoid repeated display.

---

## 6. Audit Trail

Every disable/enable action should be logged:

| Field | Value |
|---|---|
| Timestamp | ISO 8601 |
| Action | `disable-all` / `enable-reciter` / `enable-all` |
| Actor | System administrator name |
| Previous state | Enforcement on/off, cleared reciters list |
| New state | Enforcement on/off, cleared reciters list |
| Reason | Reference to ticket or review document |

Store in application logs or a dedicated audit file at `research/mfd-12.3/audio/AUDIT-LOG.md`.

---

## 7. Emergency Contacts

If audio disable causes unexpected issues:

1. Set `AUDIO_RIGHTS_ENFORCEMENT=false` immediately
2. Restart the server
3. Document the incident in the audit log
4. Investigate root cause before re-enabling enforcement
