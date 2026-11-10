# Local Data Privacy

**Sprint:** 51  
**Date:** November 10, 2026  
**Status:** Implemented

## Overview

Al-Huda is a privacy-first Quran study application. All personal data (bookmarks, notes, collections, reading progress) is stored exclusively in the user's browser. No accounts, no cloud sync, no analytics, no external data transmission.

## What We Store

### Personal Study Data (Local Only)

- **Bookmarks:** Saved ayah references (surah:ayah)
- **Notes:** User-authored text annotations on ayat
- **Collections:** User-created groupings of ayat
- **Reading progress:** History of visited ayat
- **Revision plans:** Scheduled review items and review logs
- **Learning paths:** Progress through curated learning sequences
- **Quiz attempts:** Completed quizzes and answers
- **Reader preferences:** Font size, translation selection, audio settings

### Storage Location

All data stored in browser localStorage under versioned keys:

- `alhuda.library.v1` — bookmarks, notes, collections, progress
- `alhuda.revision.v1` — revision plans and review logs
- `alhuda.prefs.v1` — reader preferences
- `alhuda.paths.v1` — learning path progress
- `alhuda.quiz.v1` — quiz attempts
- `alhuda.reading-plans.v1` — reading plan targets

### What We Don't Store

- ❌ User accounts or profiles
- ❌ Email addresses or personal identifiers
- ❌ Authentication tokens or passwords
- ❌ Cloud-synced data
- ❌ Analytics or tracking data
- ❌ Usage metrics or telemetry
- ❌ IP addresses or location data
- ❌ Device fingerprints
- ❌ Cookie identifiers

## Data Transmission

### What We Send

**Nothing.** No personal data is transmitted to external servers.

- No API calls for personal data
- No analytics endpoints
- No crash reporting
- No usage tracking
- No A/B testing

### What We Receive

- Quran text, translations, Tafsir, and morphology data (static, bundled with app)
- No dynamic data fetching for personal content

## User Control

### Export

Users can export all personal data as a JSON backup file:

1. Navigate to `/my-study/settings`
2. Click "Export backup"
3. Browser downloads `al-huda-backup-YYYY-MM-DD.json`
4. File contains all personal data in plain JSON

**Backup file contents:**
- Bookmarks, notes, collections, progress
- Revision plans and review logs
- Reader preferences
- Learning path progress
- Quiz attempts
- Reading plan targets

**Security:** Backup files are plain JSON, user-readable. Treat as private — may contain sensitive reflections.

### Import

Users can restore from a backup file:

1. Navigate to `/my-study/settings`
2. Click "Import backup"
3. Select backup file
4. Confirm replacement (import is replace, not merge)
5. All personal data replaced with backup contents

**Validation:** Backup files are validated before import. Malformed entries are dropped individually, never wholesale.

### Clear All

Users can erase all personal data:

1. Navigate to `/my-study/settings`
2. Click "Clear all data"
3. Confirm deletion (two-step confirmation)
4. All localStorage keys cleared
5. All personal data erased from device

**Irreversible:** This action cannot be undone. Export a backup first if you want to keep any data.

## Data Loss Risks

### Browser Data Cleared

If the user clears browser data (cache, cookies, localStorage):

- All personal data is erased
- No recovery possible unless backup was exported
- User must re-import backup to restore data

**Mitigation:** Export backups regularly. Backup files are portable and can be stored anywhere (cloud storage, external drive, email).

### Device Loss

If the user loses their device:

- All personal data is lost
- No recovery possible unless backup was exported and stored elsewhere

**Mitigation:** Export backups and store in multiple locations (cloud storage, external drive, email).

### localStorage Limit

Browser localStorage has a size limit (~5-10MB per origin):

- Typical personal study data: <100KB (thousands of bookmarks/notes)
- Limit is unlikely to be reached for normal use
- If limit reached, writes fail silently (in-memory state still works)

**Mitigation:** Export backups periodically to avoid data loss from corruption.

## Security

### Authentication

**None.** No accounts, no passwords, no authentication tokens.

**Rationale:** Privacy-first design eliminates authentication complexity and data breach risk.

### Encryption

**None.** localStorage is plaintext JSON.

**Rationale:** Browser localStorage is not encrypted by design. Encryption would add complexity without meaningful security benefit (user has full access to browser storage anyway).

**Mitigation:** Treat backup files as sensitive. Do not share publicly.

### Access Control

**Browser-only.** Data accessible only to the browser origin (same-origin policy).

**Rationale:** Browser security model prevents cross-origin access to localStorage.

**Limitation:** Any JavaScript running on the same origin can read localStorage. Ensure no XSS vulnerabilities.

## Compliance

### GDPR

- ✅ No personal data collected
- ✅ No data processing
- ✅ No data transmission
- ✅ No consent required (no data to consent to)
- ✅ User has full control (export, import, clear)

### CCPA

- ✅ No personal information sold
- ✅ No personal information collected
- ✅ No opt-out required (no data to opt out of)

### COPPA

- ✅ No personal data collected from children
- ✅ No accounts required
- ✅ No tracking

## Privacy by Design

### Principles

1. **Local-first:** All data stored locally, no cloud sync
2. **No accounts:** No authentication, no user profiles
3. **No analytics:** No tracking, no telemetry, no metrics
4. **No external transmission:** No data sent to servers
5. **User control:** Export, import, clear all data
6. **Transparency:** Privacy disclosure in UI
7. **Minimal data:** Only store what user explicitly creates

### Implementation

- **localStorage:** Browser-native storage, no third-party services
- **No cookies:** No tracking cookies, no analytics cookies
- **No third-party scripts:** No Google Analytics, no Mixpanel, no Segment
- **No external APIs:** No server-side processing
- **Open source:** Code is auditable, no hidden data collection

## Privacy Disclosure

The `/my-study/settings` page includes an explicit privacy disclosure:

```
Privacy

✓ All data stored locally in your browser
✓ No account required
✓ No cloud synchronization
✓ No analytics or tracking
✓ No data sent to external servers
✓ Clearing browser data will erase your study data unless you export a backup
```

**Rationale:** Transparency builds trust, especially for religious study applications. Users deserve to know their reflections are truly private.

## Data Portability

### Export Format

Backup files are plain JSON, human-readable:

```json
{
  "format": "al-huda-backup",
  "version": 7,
  "app": "Al-Huda",
  "exportedAt": "2026-11-10T12:00:00.000Z",
  "library": {
    "bookmarks": [...],
    "notes": [...],
    "collections": [...],
    "collectionAyat": [...],
    "progress": [...]
  },
  "revision": {...},
  "preferences": {...},
  "paths": {...},
  "quiz": {...},
  "readingPlans": {...}
}
```

### Portability

- Backup files can be imported on any device with a modern browser
- No vendor lock-in
- No proprietary formats
- Data is user-owned and user-controlled

## Future Considerations

### Potential Privacy Risks

If future sprints add features:

- **Cloud sync:** Would require accounts, encryption, data transmission
- **Social features:** Would require user profiles, data sharing
- **AI features:** Would require data transmission to AI providers
- **Analytics:** Would require tracking, metrics collection

**Policy:** Any feature that compromises privacy requires a separate policy decision and explicit user consent.

### Privacy-Preserving Alternatives

If cloud features are added:

- **End-to-end encryption:** Data encrypted before transmission
- **Zero-knowledge architecture:** Server cannot read user data
- **Opt-in only:** Features disabled by default, user must explicitly enable
- **Granular consent:** User controls what data is shared

**Current status:** None of these features are planned. Local-first design is a core constraint.

## References

- Implementation: `src/lib/library/storage.ts`
- Context: `src/lib/library/context.tsx`
- Backup: `src/lib/backup.ts`
- Settings page: `src/app/my-study/settings/page.tsx`
- Policy decision: `docs/POLICY-DECISION-51.md`
- Data model: `docs/PERSONAL-STUDY-DATA-MODEL.md`

## Contact

For privacy questions or concerns, open an issue on the project repository.

**Last updated:** November 10, 2026
