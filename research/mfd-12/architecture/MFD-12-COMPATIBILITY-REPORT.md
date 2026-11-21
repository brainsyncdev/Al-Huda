# MFD-12 — Compatibility Report

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Work Package | WS7 — Migration & Compatibility |
| Date | 2026-11-21 |
| Status | draft-design |
| Companion Documents | MFD-12-MIGRATION-MAP.json, MFD-12-MIGRATION-PLAN.md, MFD-12-ROLLBACK-PLAN.md |

---

## 1. Scope

This report assesses whether existing backup formats (produced by `src/lib/backup.ts`) can be read, restored, and coexist with the MFD-12 Canonical Data Model. It identifies version boundaries, structural incompatibilities, and restoration strategies.

---

## 2. Existing Backup Format Analysis

### 2.1 Backup Envelope Structure

Based on inspection of `src/lib/backup.ts`:

| Property | Value |
|----------|-------|
| Format identifier | `"al-huda-backup"` |
| Current version | `10` |
| Supported read versions | `3–10` (versions 1-2 are legacy library-only exports with limited support) |
| Max file size | 5 MB (`MAX_BACKUP_CHARS = 5 * 1024 * 1024`) |
| App identifier | `"Al-Huda"` |

### 2.2 Version Evolution History

| Version | Added Section | Notes |
|---------|--------------|-------|
| v1 | Library only | Legacy pre-envelope format; separate exporter |
| v2 | Revision, Preferences | Unified envelope introduced |
| v3 | Paths | Reading path tracking |
| v4 | TranslationId in Prefs | Multi-translation support |
| v5 | Quiz | Quiz attempt state |
| v6 | Reading Plans | Structured reading targets |
| v7 | Collections, CollectionAyat | User-curated verse collections |
| v8 | Journeys | Study journey tracking |
| v9 | Reflections | Personal reflections on verses |
| v10 | Scholarly | Evidence + review history (MFD-10.2) |

### 2.3 Backup Contents (v10)

A v10 backup contains **user state only**, not production taxonomy data:

```typescript
interface RestorableBackup {
  library: LibraryState;          // Bookmarks, notes, collections
  revision: RevisionState;        // Spaced repetition state
  preferences: Prefs;             // User settings (locale, translation, theme)
  paths: PathsState;              // Reading progress
  quiz: QuizState;                // Quiz attempts
  readingPlans: ReadingPlansState;// Active reading plans
  journeys: JourneysState;        // Study journeys
  reflections: ReflectionsState;  // Personal reflections
  scholarly: ScholarlyState;      // Evidence links, reviews (added v10)
  sourceVersion: 1|2|3|4|5|6|7|8|9|10;
  exportedAt: string;
}
```

**Critical Finding**: Production taxonomy data (`data/taxonomy/*.json`, `data/root-occurrences/*.json`) is **NOT included in backups**. Backups capture only user-generated state. The taxonomy is treated as application content, not user data.

---

## 3. Compatibility Assessment

### 3.1 Backup ↔ Canonical Model Alignment

| Backup Section | Canonical Equivalent | Compatibility |
|---------------|---------------------|---------------|
| `library.bookmarks` | ResearchAnnotation / SavedInvestigation | **Partial** — bookmarks are simpler than canonical annotations; migration path exists |
| `library.notes` | ResearchAnnotation | **Partial** — notes lack workspace context, targetType classification |
| `library.collections` | LearningPath / SavedInvestigation | **Loose** — collections are ad-hoc; canonical model expects structured paths |
| `revision` | No direct equivalent | **N/A** — spaced repetition is UX concern, not knowledge architecture |
| `preferences` | No direct equivalent | **N/A** — user settings outside canonical scope |
| `paths` | No direct equivalent | **N/A** — reading progress outside canonical scope |
| `quiz` | No direct equivalent | **N/A** — assessment outside canonical scope |
| `readingPlans` | LearningPath | **Partial** — plans could seed LearningPath entities |
| `journeys` | ResearchWorkspace | **Partial** — journeys approximate workspaces |
| `reflections` | ResearchAnnotation | **Direct** — closest alignment; reflections map to NOTE-type annotations |
| `scholarly.evidence` | EvidenceRecord | **Direct** — v10 scholarly section designed for this |
| `scholarly.reviews` | ReviewDecision | **Direct** — append-only compatible |

### 3.2 What the Backup System Does NOT Cover

The backup system is **orthogonal** to the taxonomy migration:

1. **Production taxonomy** (topics, domains, dimensions, relationships, mappings) ships as application assets, not user data. Migration transforms these in-place or into a new store.
2. **Root occurrences** (1,576 files) are static reference data, not backed up.
3. **Audit reports** (11 files) are historical artifacts.

### 3.3 Version Boundaries

| Boundary | Implication |
|----------|------------|
| v1-v2 | Cannot be parsed by current reader (returns error: "not an Al-Huda backup") |
| v3-v9 | Parseable; missing sections default to empty states |
| v10 | Full fidelity; includes scholarly data |
| v11+ (future MFD-12) | Will require new backup version; older readers reject with version mismatch error |

---

## 4. MFD-12 Impact on Backup System

### 4.1 Required Changes to backup.ts

When MFD-12 canonical entities replace legacy structures, the backup envelope must evolve:

1. **New version (v11)**: Adds canonical entity references
   - `canonicalAnnotations: ResearchAnnotation[]` replaces/augments `library.notes`
   - `canonicalWorkspaces: ResearchWorkspace[]` replaces/augments `journeys`
   - `canonicalEvidence: EvidenceRecord[]` augments `scholarly.evidence`
   - `canonicalReviews: ReviewDecision[]` augments `scholarly.reviews`

2. **Backward compatibility**: v11 reader must parse v3-v10 backups
   - Legacy `library.notes` → auto-convert to ResearchAnnotation with `annotationType: "NOTE"`
   - Legacy `journeys` → auto-convert to ResearchWorkspace with default owner
   - Legacy `scholarly` → direct mapping to EvidenceRecord/ReviewDecision

3. **Forward compatibility**: v10 reader encountering v11 backup
   - Will reject with: "This backup was written as version 11, and this build reads versions 3–10"
   - Users must update app before restoring v11 backups

### 4.2 ID Stability Across Migration

| Concern | Resolution |
|---------|-----------|
| User bookmarks reference topic IDs | If topic IDs change (prefix addition), bookmarks break. **Must maintain ID alias table** |
| Reflections reference verse keys | Verse keys (`2:255`) are stable; no impact |
| Scholarly evidence references topics | Same ID stability concern as bookmarks |
| Collections contain ayah refs | Ayah refs are stable; no impact |

### 4.3 Restoration Strategy

**Pre-Migration Backups (v1-v10)**:
- Continue to be restorable by pre-migration app version
- After migration, require adapter layer to translate legacy IDs → canonical IDs
- Adapter uses the ID alias table produced during Phase 3 of migration

**Post-Migration Backups (v11+)**:
- Native canonical format
- All entity references use canonical IDs (`topic-*`, `dom-*`, `cpt-*`)
- Scholarly section fully aligned with EvidenceRecord/ReviewDecision schemas

---

## 5. Compatibility Verdict

### 5.1 Summary

| Aspect | Verdict |
|--------|---------|
| Can existing backups (v3-v10) be read by current system? | ✅ Yes |
| Can existing backups be directly loaded into MFD-12 canonical store? | ❌ No — requires transformation layer |
| Is production taxonomy data in backups? | ❌ No — backups are user-state only |
| Will migration break existing backup restore? | ⚠️ Conditionally — only if IDs change without alias table |
| Is the scholarly section (v10) compatible with canonical EvidenceRecord/ReviewDecision? | ✅ Largely yes — designed for this purpose |
| Are new canonical entities (Concept, LearningPath, etc.) covered by existing backups? | ❌ No — require v11 envelope |

### 5.2 Critical Compatibility Requirements

1. **ID Alias Table**: Mandatory. Without it, all user bookmarks, notes, and reflections referencing topics will break after ID prefix changes.

2. **Adapter Layer**: A `legacy-to-canonical.ts` module must be written to transform v10 backup shapes into v11 canonical shapes during restore.

3. **Dual-Read Period**: During transition, the app should support reading both legacy taxonomy files AND canonical entity stores, falling back gracefully.

4. **Scholarly Section Continuity**: The v10 `scholarly` section was specifically designed for MFD-10.2/12 compatibility. Evidence and review data migrates cleanly.

---

## 6. What Must Be Preserved

Regardless of migration approach, these user data elements are sacrosanct:

1. **User bookmarks and notes** — personal study investment
2. **Spaced repetition state** — learning progress
3. **Quiz attempts** — assessment history
4. **Reading plans and progress** — commitment tracking
5. **Study journeys** — research continuity
6. **Personal reflections** — spiritual/intellectual journal
7. **Scholarly evidence and reviews** — academic contribution
8. **Preferences** — accessibility and UX configuration

None of these are affected by taxonomy restructuring IF the ID alias table is maintained.

---

## 7. Recommendations

1. **Freeze backup version at v10** until MFD-12 migration is complete
2. **Develop v11 backup spec** in parallel with canonical entity implementation
3. **Build adapter layer** before switching production to canonical store
4. **Test round-trip**: v10 backup → canonical restore → v11 re-export → v11 restore
5. **Document version boundaries** in user-facing release notes

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
