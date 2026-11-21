# WS2: Storage Adapter Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 (Canonical Schema Implementation Planning) |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-review |
| Depends On | WS2-SUBDIMENSION-SCHEMA.json, WS2-WORD-TRANSLATION-SCHEMA.json, WS2-LEARNING-PROGRESS-SCHEMA.json |

---

## 1. Overview

This specification defines the storage adapter requirements for the 3 new canonical entities introduced in MFD-12.2. Each entity has distinct storage characteristics based on its group assignment:

- **Subdimension** (Group C): Bundled canonical data, read-only at runtime, stored alongside Dimensions/Topics.
- **WordTranslation** (Group A): Optional lazy-loaded dataset, stored in IndexedDB, loaded on demand.
- **LearningProgress** (Group E): Personal user data, local IndexedDB only, never bundled or synced.

The existing project uses `localStorage` for paths/progress (`src/lib/paths/storage.ts`) and JSON imports for canonical taxonomy (`src/lib/taxonomy/canonical-adapter.ts`). The MFD-12 architecture specifies IndexedDB (`fahm-local-storage`) as the canonical local-first store per `MFD-12-LOCAL-FIRST-SPEC.md` §3.1.

---

## 2. IndexedDB Schema Additions

Database Name: `fahm-local-storage`
Current Version: 1
Required Version After Implementation: 2

### 2.1 New Object Stores

Add the following stores in the `onupgradeneeded` handler when upgrading from version 1 to 2:

```typescript
// In db.ts onupgradeneeded handler:
if (event.oldVersion < 2) {
  // Store 1: Subdimensions (canonical cache — populated from bundle on first load)
  const subdimStore = db.createObjectStore('subdimensions', { keyPath: 'id' });
  subdimStore.createIndex('parentDimensionId', 'parentDimensionId', { unique: false });
  subdimStore.createIndex('reviewStatus', 'reviewStatus', { unique: false });

  // Store 2: Word Translations (lazy-loaded optional dataset)
  const wtStore = db.createObjectStore('wordTranslations', { keyPath: 'id' });
  wtStore.createIndex('verseId', 'verseId', { unique: false });
  wtStore.createIndex('language', 'language', { unique: false });
  wtStore.createIndex('verseAndPosition', ['verseId', 'wordPosition'], { unique: false });
  wtStore.createIndex('source', 'source', { unique: false });

  // Store 3: Learning Progress (personal user data)
  const lpStore = db.createObjectStore('learningProgress', { keyPath: 'id' });
  lpStore.createIndex('learningPathId', 'learningPathId', { unique: false });
  lpStore.createIndex('moduleId', 'moduleId', { unique: false });
  lpStore.createIndex('userId', 'userId', { unique: false });
  lpStore.createIndex('status', 'status', { unique: false });
  lpStore.createIndex('lastActiveAt', 'lastActiveAt', { unique: false });
  lpStore.createIndex('pathAndUser', ['learningPathId', 'userId'], { unique: false });
}
```

### 2.2 Updated FahmDB Interface

```typescript
interface FahmDB {
  // ... existing stores (bookmarks, notes, collections, etc.) ...

  // NEW: Canonical taxonomy cache for subdimensions
  subdimensions: {
    key: string; // Subdimension.id (subdim-{slug})
    value: Subdimension;
    indexes: { parentDimensionId: string; reviewStatus: string };
  };

  // NEW: Lazy-loaded word translations
  wordTranslations: {
    key: string; // WordTranslation.id (composite key)
    value: WordTranslation;
    indexes: {
      verseId: string;
      language: string;
      verseAndPosition: [string, number];
      source: string;
    };
  };

  // NEW: Personal learning progress
  learningProgress: {
    key: string; // UUID v4
    value: LearningProgress;
    indexes: {
      learningPathId: string;
      moduleId: string;
      userId: string;
      status: string;
      lastActiveAt: string;
      pathAndUser: [string, string];
    };
  };
}
```

---

## 3. Subdimension Storage Adapter

**Classification**: Canonical data (bundled)
**Read/Write**: Read-only at runtime; written during bundle hydration
**Persistence**: Populated from `data/taxonomy/subdimensions.json` (post-migration format) into IndexedDB `subdimensions` store

### 3.1 Adapter Interface

```typescript
export interface SubdimensionStorageAdapter {
  /** Retrieve a single subdimension by ID. Returns null if not found. */
  getById(id: string): Promise<Subdimension | null>;

  /** Retrieve all subdimensions. Used for taxonomy hydration. */
  getAll(): Promise<Subdimension[]>;

  /** Retrieve all subdimensions belonging to a specific dimension. */
  getByParentDimension(dimensionId: string): Promise<Subdimension[]>;

  /** Bulk upsert from canonical bundle. Called during app initialization. */
  bulkUpsert(subdimensions: Subdimension[]): Promise<void>;

  /** Clear all cached subdimensions. Used during bundle refresh. */
  clear(): Promise<void>;
}
```

### 3.2 Implementation Notes

- The current codebase loads subdimensions via static JSON import in `src/lib/taxonomy/canonical-adapter.ts` (line 28: `import subdimensionsData from "../../../data/taxonomy/subdimensions.json"`).
- Post-migration, the adapter should replace this static import with an IndexedDB-backed read, falling back to the JSON bundle on first load.
- The adapter must handle the transition from legacy `CanonicalSubdimension` (flat strings) to the new `Subdimension` entity (with provenance, reviewStatus, schemaVersion, contentVersion).
- Index on `parentDimensionId` enables efficient `getSubdimensionsForDimension()` queries currently done via linear scan (canonical-adapter.ts:136).

### 3.3 Migration Bridge

During the transition period, implement a dual-read strategy:
1. Attempt IndexedDB read first.
2. Fall back to static JSON import if store is empty.
3. Populate IndexedDB from JSON on first access.
4. Remove static import fallback after migration is verified complete.

---

## 4. WordTranslation Storage Adapter

**Classification**: Optional lazy-loaded dataset
**Read/Write**: Write-on-import, read-many
**Persistence**: IndexedDB `wordTranslations` store only; populated from external corpus files on user request

### 4.1 Adapter Interface

```typescript
export interface WordTranslationStorageAdapter {
  /** Retrieve a single word translation by composite ID. */
  getById(id: string): Promise<WordTranslation | null>;

  /** Retrieve all word translations for a specific verse in a specific language. */
  getByVerse(verseId: string, language: string): Promise<WordTranslation[]>;

  /** Retrieve word translations for a range of verses (for interlinear display). */
  getByVerseRange(startVerse: string, endVerse: string, language: string): Promise<WordTranslation[]>;

  /** Check if a specific word-translation dataset is already imported. */
  isDatasetImported(language: string, source: string, version: string): Promise<boolean>;

  /** Import a word-translation dataset from a JSON file. Validates each record. */
  importDataset(records: WordTranslation[], language: string, source: string): Promise<{ imported: number; skipped: number; errors: string[] }>;

  /** Delete all word translations for a specific language+source combination. */
  deleteDataset(language: string, source: string): Promise<void>;

  /** List all imported datasets with metadata. */
  listImportedDatasets(): Promise<Array<{ language: string; source: string; version: string; recordCount: number }>>;
}
```

### 4.2 Implementation Notes

- Compound index `verseAndPosition` enables efficient retrieval of all words in a verse sorted by position.
- At ~77,430 records per edition (~15 MB), batch insertion using cursor-based transactions is required to avoid blocking the main thread.
- Import must validate each record against `isWordTranslation()` type guard before insertion.
- The `corpusVersion` field must be checked against the currently pinned `quran-json` version; mismatches are rejected.
- No UI integration required initially; adapter exists for future interlinear feature.

### 4.3 Performance Considerations

- Use `IDBTransaction` with `'readwrite'` mode and batch inserts of 1000 records per transaction.
- Implement backpressure: pause insertion if IndexedDB write queue exceeds threshold.
- Consider using Web Worker for large imports to avoid UI jank.
- Estimated query time for single verse (7-15 words): < 5ms with compound index.

---

## 5. LearningProgress Storage Adapter

**Classification**: Personal user data (local-only)
**Read/Write**: Full CRUD
**Persistence**: IndexedDB `learningProgress` store only; included in backup/export

### 5.1 Adapter Interface

```typescript
export interface LearningProgressStorageAdapter {
  /** Create a new progress record. Generates UUID v4 automatically. */
  create(progress: Omit<LearningProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<LearningProgress>;

  /** Retrieve a progress record by ID. */
  getById(id: string): Promise<LearningProgress | null>;

  /** Get all progress records for a specific learning path and user. */
  getByPath(learningPathId: string, userId?: string): Promise<LearningProgress[]>;

  /** Get progress for a specific module within a path. */
  getByModule(learningPathId: string, moduleId: string, userId?: string): Promise<LearningProgress | null>;

  /** Get all progress records for a user across all paths. */
  getByUser(userId: string): Promise<LearningProgress[]>;

  /** Update an existing progress record. Automatically sets updatedAt. */
  update(id: string, changes: Partial<Omit<LearningProgress, 'id' | 'createdAt'>>): Promise<LearningProgress>;

  /** Mark a module as completed. Sets status, completedAt, and updatedAt. */
  markCompleted(id: string, quizScore?: number): Promise<LearningProgress>;

  /** Record time spent on a module. Increments timeSpentSeconds. */
  addTimeSpent(id: string, additionalSeconds: number): Promise<LearningProgress>;

  /** Delete a progress record. Irreversible. */
  delete(id: string): Promise<void>;

  /** Delete all progress for a specific path and user. */
  deleteByPath(learningPathId: string, userId: string): Promise<void>;

  /** Export all progress records for backup. */
  exportAll(): Promise<LearningProgress[]>;

  /** Import progress records from backup. Merges by ID; newer updatedAt wins. */
  importRecords(records: LearningProgress[]): Promise<{ imported: number; merged: number; skipped: number }>;
}
```

### 5.2 Implementation Notes

- Default `userId` is `'default'` for single-user local-first mode (per WS-D Q29 resolution).
- Compound index `pathAndUser` enables efficient retrieval of all progress for a user's specific path.
- `create()` must use `crypto.randomUUID()` for ID generation (available in modern browsers).
- `update()` must enforce monotonic `updatedAt`: reject if provided timestamp is older than existing.
- `importRecords()` merge strategy: compare `updatedAt` timestamps; keep the newer record. This supports manual device-to-device transfer.
- Include in backup ZIP as `learning-progress.json` per `MFD-12-LOCAL-FIRST-SPEC.md`.

### 5.3 Privacy Guarantees

- LearningProgress NEVER leaves the browser except through explicit user-initiated export.
- Not included in canonical bundle.
- Not accessible via API routes.
- Cleared when user clears site data.
- Complies with `MFD-12-LOCAL-FIRST-SPEC.md` §2.2 privacy model.

### 5.4 Relationship to Existing PathProgress

The current codebase has `PathProgress` in `src/lib/paths/types.ts` (lines 70-78) stored in `localStorage`. The new `LearningProgress` entity operates at a different granularity:

| Aspect | Existing PathProgress | New LearningProgress |
|--------|----------------------|---------------------|
| Granularity | Step-level (completedSteps[]) | Module-level (status, quizScore, timeSpent) |
| Storage | localStorage | IndexedDB |
| Schema | Flat interface | Full canonical entity |
| Target | Reading paths | Structured learning curriculum |

These coexist during transition. `LearningProgress` does NOT replace `PathProgress`; they serve different features. Future consolidation may occur when LearningPath UI is built.

---

## 6. Canonical Cache Integration

The existing `canonicalCache` store in `MFD-12-LOCAL-FIRST-SPEC.md` §3.1 caches fetched datasets. Subdimensions should be registered as a cacheable dataset:

```typescript
// Dataset identifiers for canonicalCache
const CANONICAL_DATASET_IDS = {
  SUBDIMENSIONS: 'taxonomy:subdimensions:v1',
  WORD_TRANSLATIONS_PREFIX: 'translations:words:', // + language + source
} as const;
```

When the canonical bundle is updated, the `subdimensions` store should be invalidated and re-hydrated from the new bundle.

---

## 7. Validation Layer Integration

Each adapter must integrate with the validation functions defined in WS2-TYPESCRIPT-INTERFACES.md:

```typescript
// Before any write operation:
function validateBeforeWrite<T>(entity: unknown, guard: (v: unknown) => v is T): T {
  if (!guard(entity)) {
    throw new ValidationError(`Entity failed type guard validation`, entity);
  }
  return entity;
}
```

Cross-reference validation (integrity rules 21-29 from WS-D-REVISED-SCHEMA-SPECIFICATIONS.md §7) should run asynchronously after writes, not block them. Failed cross-references generate warnings logged to the audit trail, not hard errors (to support partial/offline operation).

---

## 8. Error Handling Strategy

| Scenario | Behavior |
|----------|----------|
| IndexedDB unavailable | Fall back to in-memory Map; warn user; disable persistence |
| Quota exceeded | Trigger cleanup flow per `MFD-12-LOCAL-FIRST-SPEC.md` §3.3 |
| Schema mismatch on read | Log error; skip malformed record; continue loading others |
| Cross-ref integrity failure | Log warning; do not block read/write; flag for audit |
| Concurrent writes | Last-write-wins with updatedAt comparison; no locking needed for single-user |

---

*This document is a design proposal. No production code has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-review"*
