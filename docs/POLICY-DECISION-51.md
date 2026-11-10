# Policy Decision 51: Personal Quran Study Experience

**Date:** November 10, 2026  
**Sprint:** 51  
**Status:** Implemented

## Context

Sprint 51 introduces a comprehensive personal study workspace at `/my-study` that consolidates bookmarks, notes, collections, and reading progress into a unified dashboard. This decision documents the architectural choices and constraints that guided implementation.

## Decision 1: Local-First, No Accounts

**Choice:** All personal data (bookmarks, notes, collections, progress) stored exclusively in browser localStorage. No user accounts, no cloud synchronization, no analytics.

**Rationale:**
- Privacy-first design aligns with Islamic study context — personal reflections should remain private
- Eliminates server infrastructure costs and complexity
- Avoids data breach risk for sensitive religious study notes
- Users retain full control; clearing browser data erases everything
- Backup/export system provides portability without centralization

**Tradeoffs:**
- Users must manually export backups to avoid data loss
- No cross-device sync (by design)
- localStorage has ~5-10MB limit per origin (sufficient for personal study data)

## Decision 2: Collections as User-Created Groupings

**Choice:** Collections are user-created, mutable groupings of ayat. An ayah can belong to multiple collections. Collections are distinct from bookmarks (single-ayah saves) and notes (text annotations).

**Rationale:**
- Supports thematic study (e.g., "Verses on Patience", "Ramadan Reflections")
- Mirrors physical Quran study habits where learners mark multiple passages per topic
- Collections are personal organization, not official Quranic topics — we never claim scholarly authority
- Separate from bookmarks to preserve semantic distinction: bookmarks = "save this ayah", collections = "group these ayat"

**Data Model:**
```typescript
interface Collection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CollectionAyah {
  id: string;
  collectionId: string;
  surah: number;
  ayah: number;
  createdAt: string;
}
```

**Constraints:**
- Duplicate membership within same collection prevented at write time
- Deleting a collection removes all its memberships but does NOT delete bookmarks or notes on those ayat
- Collections are included in backup envelope (v7+)

## Decision 3: Unified Dashboard at /my-study

**Choice:** New `/my-study` route serves as the personal workspace entry point, replacing the previous `/library` route for personal data management. Existing `/library` route remains for backward compatibility but is not linked from navigation.

**Rationale:**
- Clearer naming: "My Study" vs "Library" (which could imply official content)
- Consolidates all personal data features in one place
- Empty state guides new users to start with the Quran reader
- Overview stats provide at-a-glance progress tracking

**Sub-routes:**
- `/my-study/bookmarks` — saved ayat with sort options
- `/my-study/notes` — private notes with search and tag filtering
- `/my-study/collections` — collection management
- `/my-study/search` — unified local search across all personal data
- `/my-study/settings` — privacy disclosure, backup controls, data clearing

## Decision 4: Validation Pattern from Revision Storage

**Choice:** Collection normalization follows the same field-by-field validation pattern established in `src/lib/revision/storage.ts`. Malformed entries are dropped individually, never wholesale.

**Rationale:**
- Consistency across the codebase reduces cognitive load
- Graceful degradation: one corrupted entry doesn't erase all collections
- Same pattern used for bookmarks, notes, progress, revision plans, quiz attempts, reading plans
- Prevents data loss from partial corruption (e.g., manual localStorage edits, browser bugs)

**Implementation:**
```typescript
export function normalizeLibraryState(raw: unknown): LibraryState {
  // ... validate bookmarks, notes, progress ...
  
  const collections: Collection[] = [];
  if (Array.isArray(parsed.collections)) {
    for (const item of parsed.collections) {
      if (typeof item !== "object" || item === null) continue;
      const c = item as Record<string, unknown>;
      if (typeof c.id !== "string" || !c.id) continue;
      if (typeof c.name !== "string" || !c.name.trim()) continue;
      collections.push({
        id: c.id,
        name: c.name.trim(),
        createdAt: typeof c.createdAt === "string" ? c.createdAt : "",
        updatedAt: typeof c.updatedAt === "string" ? c.updatedAt : "",
      });
    }
  }
  
  // ... same pattern for collectionAyat ...
}
```

## Decision 5: Backup Envelope Versioning

**Choice:** Backup envelope bumped from v6 to v7 to include collections. Parser accepts v3-v7 for backward compatibility.

**Rationale:**
- Envelope version is independent of individual store schemas
- Older backups (v3-v6) restore successfully; missing collections field defaults to empty arrays
- Forward compatibility: v7+ backups rejected by older builds with clear error message
- Single envelope carries all stores (library, revision, preferences, paths, quiz, reading plans, collections)

**Migration Path:**
- v6 backup → v7 build: collections field missing, normalized to `[]`
- v7 backup → v6 build: rejected with "this build reads versions 3-6" error
- v7 backup → v7 build: full restore including collections

## Decision 6: Privacy Disclosure

**Choice:** `/my-study/settings` includes explicit privacy disclosure listing what is and isn't stored, with no external data transmission.

**Rationale:**
- Transparency builds trust, especially for religious study applications
- Users deserve to know their reflections are truly private
- Compliance with privacy-by-design principles
- Clear statement that clearing browser data erases everything (unless backed up)

**Disclosure Points:**
- ✓ All data stored locally in browser
- ✓ No account required
- ✓ No cloud synchronization
- ✓ No analytics or tracking
- ✓ No data sent to external servers
- ✓ Clearing browser data erases study data unless backed up

## Decision 7: No AI Religious Answers

**Choice:** Sprint 51 does NOT enable AI-generated religious answers or interpretations. `AI_ANSWER_FEATURE_ENABLED` remains `false`.

**Rationale:**
- AI cannot provide authoritative Islamic guidance
- Personal notes are user-authored reflections, not AI-generated tafsir
- Preserves integrity of Quranic content (no AI hallucinations in sacred text)
- Aligns with project policy: AI assists with technical features, not religious content

## Decision 8: Ayah Reader Integration

**Choice:** Ayah card includes a "Collections" button that opens a picker showing all collections with checkmarks for membership. Adding/removing is immediate with toast feedback.

**Rationale:**
- Low-friction workflow: user is already reading the ayah, can add it to a collection in one click
- Visual feedback (checkmarks) shows current membership state
- Picker lists all collections, not just "add to new" — supports organizing existing ayat
- Toast confirms action without requiring page navigation

**UX Flow:**
1. User reads ayah
2. Clicks "Collections" button
3. Picker opens showing all collections
4. Clicks collection name → ayah added/removed
5. Toast confirms action
6. Picker stays open for rapid multi-collection organization

## Constraints Preserved

The following constraints from the project PRD were preserved throughout Sprint 51:

1. **No modification of Quran text, translations, Tafsir, or morphology data** — all content remains verbatim from the dataset
2. **No deployment** — Sprint 51 is local development only
3. **No Sprint 52 work** — scope boundaries enforced
4. **Canonical ayah identity** — always `surahNumber:ayahNumber`, never by text
5. **RTL Arabic rendering** — `lang="ar" dir="rtl"` and `arabic-display` class preserved
6. **Privacy: noindex on /library and /my-study routes** — search engines excluded

## Testing Strategy

- **Unit tests:** `normalizeLibraryState` validates collections and collectionAyat
- **Integration tests:** Collection CRUD operations in `useLibrary()` context
- **Manual testing:** Dashboard rendering, collection picker UX, backup/restore cycle
- **Quality gates:** typecheck ✅, lint ✅, build ✅, test suite (998 tests, 56 files)

## Future Considerations

Sprint 51 establishes the foundation for personal study. Future sprints may explore:

- Collection sharing (export as JSON, not cloud sync)
- Advanced search (regex, Arabic text search in notes)
- Reading streaks and gamification (without compromising privacy)
- Collection templates (pre-built thematic collections, user-created)

These are NOT part of Sprint 51 and require separate policy decisions.

## Conclusion

Sprint 51 delivers a privacy-first, local-only personal study workspace that respects user autonomy and religious sensitivity. Collections provide flexible organization without claiming scholarly authority. The architecture prioritizes data integrity, graceful degradation, and transparent privacy practices.
