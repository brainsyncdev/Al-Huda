# Personal Study Data Model

**Sprint:** 51  
**Date:** November 10, 2026  
**Status:** Implemented

## Overview

The personal study data model stores user-created content (bookmarks, notes, collections, reading progress) in browser localStorage. All data is local-first, no accounts, no cloud sync.

## Storage Location

- **Key:** `alhuda.library.v1`
- **Location:** Browser localStorage
- **Format:** JSON
- **Size limit:** ~5-10MB per origin (browser-dependent)

## Data Types

### Bookmark

A saved ayah reference.

```typescript
interface Bookmark {
  surah: number;  // 1-114
  ayah: number;   // 1-based
  savedAt: string; // ISO timestamp
}
```

**Identity:** `surah:ayah` (e.g., `2:255` for Ayat al-Kursi)

**Constraints:**
- One bookmark per ayah (duplicates prevented at write time)
- `savedAt` is ISO timestamp, may be empty string for legacy data

### Note

A user-authored text annotation on an ayah.

```typescript
interface Note {
  id: string;       // Unique identifier
  surah: number;    // 1-114
  ayah: number;     // 1-based
  text: string;     // User-written content
  tags: string[];   // User-defined labels (max 10)
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

**Identity:** `id` (generated as `${surah}:${ayah}:${updatedAt}` if absent)

**Constraints:**
- One note per ayah (saving to same ayah overwrites existing note)
- `tags` are normalized: trimmed, lowercased, deduplicated, max 10
- `text` may be empty (note deleted but metadata preserved)

### ProgressEntry

A record of an ayah visit for reading history.

```typescript
interface ProgressEntry {
  surah: number;  // 1-114
  ayah: number;   // 1-based
  at: string;     // ISO timestamp
}
```

**Identity:** `surah:ayah:at` (multiple visits to same ayah create multiple entries)

**Constraints:**
- No deduplication (every visit recorded)
- `at` may be empty string for legacy data

### Collection (Sprint 51)

A user-created grouping of ayat.

```typescript
interface Collection {
  id: string;        // Unique identifier
  name: string;      // User-defined name (trimmed, max 80 chars)
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

**Identity:** `id` (generated as `col:${Date.now()}:${random}`)

**Constraints:**
- `name` is trimmed, must be non-empty
- `id` is unique, generated at creation time
- Deleting a collection removes all its memberships but does NOT delete bookmarks or notes

### CollectionAyah (Sprint 51)

Membership of an ayah in a collection.

```typescript
interface CollectionAyah {
  id: string;           // Unique identifier
  collectionId: string; // Reference to Collection.id
  surah: number;        // 1-114
  ayah: number;         // 1-based
  createdAt: string;    // ISO timestamp
}
```

**Identity:** `id` (generated as `ca:${collectionId}:${surah}:${ayah}:${Date.now()}`)

**Constraints:**
- One membership per ayah per collection (duplicates prevented at write time)
- An ayah can belong to multiple collections
- Deleting a collection removes all its memberships
- Deleting an ayah from a collection does NOT delete bookmarks or notes

## LibraryState

The complete library state stored in localStorage.

```typescript
interface LibraryState {
  bookmarks: Bookmark[];
  notes: Note[];
  progress: ProgressEntry[];
  collections: Collection[];       // Sprint 51
  collectionAyat: CollectionAyah[]; // Sprint 51
}
```

**Empty state:**
```typescript
const EMPTY_LIBRARY_STATE: LibraryState = {
  bookmarks: [],
  notes: [],
  progress: [],
  collections: [],
  collectionAyat: [],
};
```

## Validation

### normalizeLibraryState

Rebuilds library state from arbitrary parsed JSON (localStorage or backup file). Every list is checked for being an array, and each entry keeps only the fields this build understands.

**Rules:**
- Non-object or array input → returns `EMPTY_LIBRARY_STATE`
- Missing fields → default to empty arrays
- Malformed entries → dropped individually, never wholesale
- `surah` and `ayah` must be integers
- `id` fields must be non-empty strings
- `name` fields must be non-empty strings after trimming
- `tags` normalized: trimmed, lowercased, deduplicated, max 10

**Example:**
```typescript
const raw = {
  bookmarks: [{ surah: 2, ayah: 255, savedAt: "2026-01-01T00:00:00Z" }],
  notes: [],
  progress: [],
  collections: [
    { id: "col:123", name: "Patience", createdAt: "", updatedAt: "" },
    { id: "", name: "Invalid", createdAt: "", updatedAt: "" }, // DROPPED
  ],
  collectionAyat: [],
};

const state = normalizeLibraryState(raw);
// state.collections.length === 1 (only valid collection kept)
```

### normalizeTags

Normalizes tag arrays for notes.

**Rules:**
- Non-array input → returns `[]`
- Each tag: trimmed, lowercased, empty strings removed
- Deduplicated (case-insensitive)
- Max 10 tags

**Example:**
```typescript
normalizeTags(["Patience", "  PATIENCE  ", "reflection", ""]);
// Returns: ["patience", "reflection"]
```

## Backup Envelope

The library state is part of the backup envelope (v7+).

```typescript
interface BackupFile {
  format: "al-huda-backup";
  version: 7;  // Sprint 51
  app: "Al-Huda";
  exportedAt: string;
  library: LibraryState;  // Includes collections and collectionAyat
  revision: RevisionState;
  preferences: Prefs;
  paths: PathsState;
  quiz: QuizState;
  readingPlans: ReadingPlansState;
}
```

**Backward compatibility:**
- v6 backups → restore successfully, collections default to `[]`
- v7 backups → rejected by v6 builds with clear error message
- v3-v5 backups → restore successfully, missing fields default to empty

## API

### useLibrary() Context

React context providing library state and CRUD operations.

**State:**
- `bookmarks: Bookmark[]`
- `notes: Note[]`
- `progress: ProgressEntry[]`
- `collections: Collection[]`
- `collectionAyat: CollectionAyah[]`
- `hydrated: boolean`

**Methods:**
- `isBookmarked(surah, ayah) → boolean`
- `toggleBookmark(surah, ayah) → void`
- `noteFor(surah, ayah) → Note | undefined`
- `saveNote(surah, ayah, text, tags?) → void`
- `deleteNote(id) → void`
- `recordVisit(surah, ayah) → void`
- `createCollection(name) → string` (returns id)
- `renameCollection(id, name) → void`
- `deleteCollection(id) → void`
- `addToCollection(collectionId, surah, ayah) → void`
- `removeFromCollection(collectionId, surah, ayah) → void`
- `isInCollection(collectionId, surah, ayah) → boolean`
- `getCollectionAyat(collectionId) → CollectionAyah[]`
- `restoreLibrary(raw) → LibraryRestoreResult`
- `clearAll() → void`

**Hydration:**
- `hydrated` is `false` until localStorage is read
- Prevents hydration mismatch in React
- All methods are no-ops before hydration

## Data Flow

### Read Path

1. Component calls `useLibrary()`
2. Context returns current state from React state
3. State initialized from localStorage on mount
4. `hydrated` becomes `true` after read

### Write Path

1. Component calls mutation method (e.g., `toggleBookmark`)
2. Context updates React state
3. Context persists to localStorage
4. React re-renders affected components

### Backup Export

1. User clicks "Export backup"
2. `buildBackup()` collects all stores (library, revision, preferences, etc.)
3. Envelope written as JSON
4. Download triggered

### Backup Import

1. User selects backup file
2. File read as text
3. `parseBackup()` validates envelope
4. `normalizeLibraryState()` validates library section
5. User confirms replacement
6. `restoreLibrary()` replaces localStorage
7. React state updated

### Clear All

1. User clicks "Clear all data"
2. Confirmation dialog shown
3. User confirms
4. `clearAll()` resets to `EMPTY_LIBRARY_STATE`
5. localStorage cleared
6. React state updated

## Privacy

- All data stored locally in browser
- No data sent to external servers
- No analytics or tracking
- No accounts required
- Clearing browser data erases everything (unless backed up)
- Backup files are plain JSON, user-readable

## Security

- No authentication (no accounts)
- No encryption (localStorage is plaintext)
- User responsible for backup file security
- Backup files may contain sensitive reflections — treat as private

## Performance

- localStorage read/write is synchronous
- Typical library size: <100KB (thousands of bookmarks/notes)
- No pagination needed for typical use
- Search is client-side, no debouncing needed for small datasets

## Limitations

- localStorage limit: ~5-10MB per origin
- No cross-device sync (by design)
- No server-side validation
- No conflict resolution (last write wins)
- No versioning within localStorage (backup envelope handles versioning)

## Migration

### v6 → v7

- Collections field added to `LibraryState`
- Existing v6 backups restore successfully with collections defaulting to `[]`
- No data loss

### v7 → v6

- v7 backups rejected by v6 builds with clear error message
- User must upgrade to import v7 backup

## Testing

- Unit tests: `src/lib/library/collections.test.ts`
- Coverage: validation, backward compatibility, edge cases
- All tests pass (6 tests)

## References

- Implementation: `src/lib/library/storage.ts`
- Context: `src/lib/library/context.tsx`
- Backup: `src/lib/backup.ts`
- Tests: `src/lib/library/collections.test.ts`
- Policy: `docs/POLICY-DECISION-51.md`
