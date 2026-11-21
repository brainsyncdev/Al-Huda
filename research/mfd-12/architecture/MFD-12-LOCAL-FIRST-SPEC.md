# MFD-12 — Local-First Persistence & Offline Operation Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Product & Application Integration) |
| Date | 2026-11-21 |
| Status | draft-specification |
| Depends On | MFD-12-APPLICATION-ARCHITECTURE.md, MFD-12-UX-INTEGRATION-SPEC.md |
| Scope | RESEARCH ONLY — no modifications to src/ or data/ |

---

## 1. Core Principle: User Data Sovereignty

All personal study data — bookmarks, notes, annotations, collections, investigations, preferences — resides **exclusively on the user's device**. No account, no cloud sync, no analytics, no telemetry. The application functions fully offline after initial data hydration. This is not a limitation but a feature: privacy, speed, and ownership are foundational to the FAHM knowledge architecture.

---

## 2. Data Classification

### 2.1 Canonical Data (Read-Only, Cached Locally)

| Dataset | Source | Cache Strategy | Update Frequency |
|---------|--------|----------------|------------------|
| Quran Corpus (Arabic, Translation, Transliteration) | `quran-json@3.1.2` | Bundled at build time | Only on version pin change |
| Surah Metadata | `quran-json` + editorial | Bundled | Rarely |
| Terminology Index | MFD-11.5 validated entries | Fetched on first visit, persisted to IndexedDB | On scholarly review completion |
| Root Occurrences | `data/root-occurrences/*.json` | Lazy-loaded per root, persisted | On data pipeline update |
| Canonical Taxonomy | Domains, Dimensions, Topics | Bundled | On taxonomy revision |
| Classical Tafsirs | Tanzil.net (Jalalayn, Muyassar) | Fetched on first use, persisted | Rarely |
| Learning Paths | Editorial curation | Bundled | On path revision |

**Immutability Guarantee:** Canonical data is never modified by client-side code. Updates require new build or explicit data refresh triggered by user action.

### 2.2 User Data (Read-Write, Local-Only)

| Entity | Schema | Storage | Sync |
|--------|--------|---------|------|
| Bookmark | `{ surah, ayah, createdAt, label? }` | IndexedDB `bookmarks` store | None |
| Note | `{ id, surah?, ayah?, content, createdAt, updatedAt, tags[] }` | IndexedDB `notes` store | None |
| Collection | `{ id, name, description?, ayahRefs[], createdAt, updatedAt }` | IndexedDB `collections` store | None |
| Annotation | `{ id, ayahRef, type, content, color?, createdAt, updatedAt }` | IndexedDB `annotations` store | None |
| Investigation | `{ id, title, description?, linkedAyahs[], notes[], tags[], createdAt, updatedAt }` | IndexedDB `investigations` store | None |
| Reading Progress | `{ surah, ayah, at }` (stack, max 100) | IndexedDB `progress` store | None |
| Preferences | `{ fontSize, arabicFont, translationId, theme, ... }` | IndexedDB `preferences` store | None |
| Search History | `{ query, mode, filters, at }` (max 200) | IndexedDB `searchHistory` store | None |
| Graph View State | `{ zoom, pan, selectedNodes[], expandedDomains[] }` | IndexedDB `graphState` store | None |

**Privacy Guarantee:** User data never leaves the browser. No analytics, no crash reporting, no feature flags tied to user identity. Export is user-initiated only.

---

## 3. Storage Architecture

### 3.1 IndexedDB Schema

Database Name: `fahm-local-storage`
Version: 1 (schema migration strategy defined below)

```typescript
interface FahmDB {
  bookmarks: {
    key: string; // `${surah}:${ayah}`
    value: Bookmark;
    indexes: { createdAt: number; label: string };
  };
  notes: {
    key: string; // UUID
    value: Note;
    indexes: { updatedAt: number; tags: string[] };
  };
  collections: {
    key: string; // UUID
    value: Collection;
    indexes: { updatedAt: number };
  };
  annotations: {
    key: string; // UUID
    value: Annotation;
    indexes: { ayahRef: string; type: string; updatedAt: number };
  };
  investigations: {
    key: string; // UUID
    value: Investigation;
    indexes: { updatedAt: number; tags: string[] };
  };
  progress: {
    key: number; // auto-increment
    value: ReadingProgress;
    indexes: { at: number };
  };
  preferences: {
    key: string; // preference key
    value: any;
  };
  searchHistory: {
    key: number; // auto-increment
    value: SearchHistoryEntry;
    indexes: { at: number };
  };
  graphState: {
    key: string; // view identifier
    value: GraphViewState;
  };
  canonicalCache: {
    key: string; // dataset identifier
    value: { data: any; fetchedAt: number; version: string };
  };
}
```

### 3.2 Schema Migration Strategy

- Database version incremented on schema change.
- Migration scripts run in `onupgradeneeded` handler.
- Backward-compatible migrations preferred (additive changes only).
- Breaking changes require user consent dialog: "Your study data needs to be upgraded. This cannot be undone. Continue?"
- Backup export offered before destructive migration.

### 3.3 Storage Limits & Quota Management

- Monitor storage quota via `navigator.storage.estimate()`.
- Warn user at 80% quota usage.
- Offer cleanup options: clear search history, prune old progress entries, remove unused cached datasets.
- Never silently delete user data (notes, annotations, investigations).
- Canonical cache can be safely purged and re-fetched.

---

## 4. Offline Operation

### 4.1 Service Worker Strategy

- **Cache-First for Canonical Data:** Serve bundled/cached corpus, taxonomy, and terminology from Cache API or IndexedDB. Network fallback only for uncached datasets.
- **Network-First for User Actions:** Not applicable (all user actions are local). Service worker does not intercept user data writes.
- **Precache Manifest:** Generated at build time listing all bundled assets (JS, CSS, fonts, core JSON).
- **Runtime Caching:** Tafsir editions, additional translations cached on first fetch with stale-while-revalidate strategy.

### 4.2 Offline Capability Matrix

| Feature | Offline Available | Notes |
|---------|-------------------|-------|
| Quran Reading (Arabic + Built-in Translation) | ✅ Yes | Bundled |
| Word Morphology & Glosses | ✅ Yes | After first fetch |
| Search (Exact, Linguistic, Conceptual) | ✅ Yes | Indices cached |
| Search (Evidence / Tafsir) | ⚠️ Partial | Only previously fetched editions |
| Explore (Domains, Dimensions, Topics) | ✅ Yes | Bundled |
| Knowledge Graph | ✅ Yes | Bundled |
| Annotations, Notes, Bookmarks | ✅ Yes | Always local |
| Investigations & Export | ✅ Yes | Always local |
| Additional Translations | ⚠️ Partial | Only previously fetched |
| Semantic Search | ❌ No | Deferred; would require model download |

### 4.3 Offline UX Indicators

- Subtle offline badge in header when network unavailable.
- Disabled states for features requiring network (unfetched tafsirs, new translations).
- Clear messaging: "You're offline. Previously loaded content is available. Connect to access new translations or tafsirs."
- No error states for offline access to cached/local data.

---

## 5. Data Portability

### 5.1 Export Formats

| Entity | Format | Notes |
|--------|--------|-------|
| Bookmarks | JSON, CSV | Includes surah/ayah refs, labels, timestamps |
| Notes | Markdown, JSON | Markdown includes verse refs as links |
| Collections | JSON | Includes member ayah refs |
| Annotations | JSON | Includes ayah refs, types, content |
| Investigations | JSON, Markdown | Markdown renders as readable research notebook |
| Preferences | JSON | For backup/restore across devices |
| Full Backup | ZIP (JSON + metadata) | Complete local storage snapshot |

### 5.2 Import Capabilities

- Import full backup ZIP to restore state on new device.
- Import individual JSON files to merge specific entities.
- Conflict resolution: Imported items with same ID prompt user to overwrite/skip/rename.
- Validation: Imported data validated against current schema before ingestion.

### 5.3 Citation Export

- Stable verse URIs: `https://quranalhuda.com/ayah/{surah}/{ayah}`
- Supported formats: Chicago, APA, MLA, BibTeX.
- Includes accessed date, translation edition, and app version.
- Preview before copy/download.

---

## 6. Security & Privacy

### 6.1 Data Isolation

- All user data stored in origin-scoped IndexedDB. No cross-origin access.
- No cookies, localStorage tokens, or third-party scripts touching user data.
- Content Security Policy restricts script execution to trusted sources.

### 6.2 No Telemetry

- Zero analytics, crash reporting, or feature flag services.
- No IP logging, fingerprinting, or behavioral tracking.
- Privacy policy explicitly states: "We collect nothing. Your study is yours alone."

### 6.3 User Control

- "Clear All Data" button in settings with confirmation dialog.
- Granular deletion: Clear search history only, clear progress only, etc.
- Export before delete prompt.
- No data retention beyond user's browser session/storage.

---

## 7. Performance Targets

| Operation | Target Latency |
|-----------|----------------|
| App Load (Cached) | < 1s |
| Verse Render | < 50ms |
| Search (Exact, Cached) | < 100ms |
| Annotation Save | < 10ms (optimistic UI) |
| Export Generation | < 500ms |
| Storage Quota Check | < 5ms |

---

## 8. Non-Goals

- Cloud sync or multi-device synchronization.
- User accounts or authentication.
- Collaborative annotations or shared workspaces.
- Server-side rendering of personal data.
- Automatic backup to external services.

---

*This specification defines the local-first contract for MFD-12. Implementation must guarantee user data sovereignty, offline operation, and zero telemetry while maintaining performant access to cached canonical data.*
