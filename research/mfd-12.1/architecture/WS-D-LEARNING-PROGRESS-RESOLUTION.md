# WS-D: Q29 — LearningPath Progress Tracking Resolution

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 (Data Model Architecture Resolution) |
| Question | Q29 from FAHM Programme Dashboard §39 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-D, agent-106) |
| Review Status | pending-scholarly-review |

---

## 1. CURRENT STATE

### Canonical Model (`MFD-12-CANONICAL-DATA-MODEL.md`)
- **LearningPath entity (§4Q)** defines an ordered sequence of `moduleIds[]` but contains NO progress tracking fields.
- **LearningModule entity (§4R)** defines content and prerequisites but no completion state.
- Section 7 (Unresolved Questions) states: "Should learner progress be modeled as a separate entity (e.g., LearningProgress) or embedded within LearningPath? Deferred to UX design phase."

### Local-First Spec (`MFD-12-LOCAL-FIRST-SPEC.md`)
- Section 2.2 lists `Reading Progress` as a user data entity: `{ surah, ayah, at }` stored in IndexedDB `progress` store.
- This is verse-level reading position only, NOT learning path/module completion tracking.
- All user data is local-only, no cloud sync, no accounts.
- Privacy guarantee: "User data never leaves the browser."

### Legacy Data
- No learning path or progress data exists in `data/`. These are new entities for MFD-12.

---

## 2. OPTION ANALYSIS

### Option A: Embed Progress in LearningPath
Add `progress: { moduleId: string, completedAt: string, score?: number }[]` array directly to the LearningPath entity.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Single entity read for path + progress; simple schema |
| **Cons** | Violates separation of concerns (path definition ≠ user state); LearningPath is shared/public while progress is personal/private; multi-device sync impossible without merging entire path; versioning conflict (path update vs progress update); cannot track partial module progress or quiz attempts independently |
| **Privacy** | Mixes public curriculum with private user data in same record |
| **Local-First Fit** | Poor: requires writing to canonical entity store for personal data |

### Option B: Separate LearningProgress Entity (Recommended)
Create a dedicated `LearningProgress` entity in Group E (User & Research Workspace) that references LearningPath and LearningModule by ID. Stored exclusively in local IndexedDB, never bundled with canonical data.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Clean separation of curriculum (canonical) from user state (personal); supports multiple paths per user; enables granular tracking (started, completed, quiz scores, time spent); aligns with local-first privacy model; independent versioning; supports resume functionality naturally |
| **Cons** | Requires join query to display path with progress; one additional entity type |
| **Privacy** | User progress stays in IndexedDB; canonical LearningPath remains shareable/public |
| **Local-First Fit** | Perfect: matches existing Reading Progress pattern in §2.2 |

### Option C: Hybrid (Progress Reference in Path)
Keep LearningProgress separate but add optional `lastProgressId` field to LearningPath for quick access.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Fast lookup of current position |
| **Cons** | Re-introduces coupling; `lastProgressId` becomes stale if progress deleted; adds write dependency on canonical entity when updating progress |

---

## 3. RECOMMENDED RESOLUTION

**Option B: Separate LearningProgress entity in Group E, stored locally.**

### Rationale
1. **Privacy Alignment**: The local-first spec explicitly guarantees user data sovereignty. Mixing progress into LearningPath would require storing personal data alongside public curriculum, violating this principle.
2. **Separation of Concerns**: LearningPath is a *curriculum definition* (potentially shared/public). LearningProgress is *personal state*. These have different lifecycles, different owners, and different storage requirements.
3. **Resume Functionality**: A separate entity naturally supports `lastActiveModuleId`, `lastPosition`, and `resumedAt` fields without polluting the path definition.
4. **Multi-Path Support**: Users may have progress on multiple paths simultaneously. Embedded progress assumes single-path focus.
5. **Granularity**: Module-level progress needs sub-fields (started, completed, quizScore, timeSpentSeconds, attempts). An embedded array lacks structure; a dedicated entity provides it.
6. **Sync Future-Proofing**: If optional device-to-device sync is ever added (via user-initiated export/import), separate entities merge cleanly. Embedded arrays require full-path reconciliation.

---

## 4. SCHEMA CHANGES

### 4.1 New Entity: LearningProgress

Add to Group E (User & Research Workspace) in `MFD-12-CANONICAL-DATA-MODEL.md`:

#### Identifier Strategy Addition
| Entity | ID Format | Example | Rationale |
|--------|-----------|---------|----------|
| LearningProgress | `lp-{uuid}` | `lp-x1y2z3w4-...` | UUID; personal, device-local |

#### Entity Definition (new §4V)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | UUID v4 |
| learningPathId | string | ✅ | Reference to LearningPath.id |
| userId | string | ✅ | Local device user identifier (or 'default' for single-user) |
| moduleId | string | ✅ | Current or last-active LearningModule.id |
| status | enum | ✅ | `NOT_STARTED` \| `IN_PROGRESS` \| `COMPLETED` \| `PAUSED` |
| startedAt | string | ❌ | ISO 8601 datetime |
| completedAt | string | ❌ | ISO 8601 datetime |
| lastActiveAt | string | ✅ | ISO 8601 datetime |
| timeSpentSeconds | integer | ❌ | Cumulative time on this module |
| quizScore | number | ❌ | 0.0–1.0 if applicable |
| attempts | integer | ❌ | Number of quiz/completion attempts |
| notes | string | ❌ | Personal reflection on this module |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Tracks → LearningPath, LearningModule

### 4.2 New JSON Schema File

Create `research/mfd-12/architecture/entity-schemas/learning-progress.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/learning-progress",
  "title": "MFD-12 LearningProgress",
  "description": "Personal learning progress state for a specific module within a path. Stored locally, never synced.",
  "type": "object",
  "required": ["id", "learningPathId", "userId", "moduleId", "status", "lastActiveAt", "createdAt", "updatedAt", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "learningPathId": { "type": "string", "format": "uuid" },
    "userId": { "type": "string", "minLength": 1 },
    "moduleId": { "type": "string", "format": "uuid" },
    "status": { "enum": ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "PAUSED"] },
    "startedAt": { "type": "string", "format": "date-time" },
    "completedAt": { "type": "string", "format": "date-time" },
    "lastActiveAt": { "type": "string", "format": "date-time" },
    "timeSpentSeconds": { "type": "integer", "minimum": 0 },
    "quizScore": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
    "attempts": { "type": "integer", "minimum": 0 },
    "notes": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" },
    "schemaVersion": { "type": "string", "minLength": 1 }
  }
}
```

### 4.3 Local-First Spec Update

Add to `MFD-12-LOCAL-FIRST-SPEC.md` §2.2 User Data table:

| Entity | Schema | Storage | Sync |
|--------|--------|---------|------|
| LearningProgress | `learning-progress.schema.json` | IndexedDB `learningProgress` store | None |

Add to §3.1 IndexedDB Schema:
```typescript
learningProgress: {
  key: string; // UUID
  value: LearningProgress;
  indexes: { learningPathId: string; moduleId: string; status: string; lastActiveAt: number };
};
```

### 4.4 Cross-Reference Integrity Rules
Add to `MFD-12-DATA-DICTIONARY.md` §4:
- `LearningProgress.learningPathId` → MUST exist in LearningPath.id
- `LearningProgress.moduleId` → MUST exist in LearningModule.id AND be member of referenced LearningPath.moduleIds[]

---

## 5. MIGRATION IMPACT

### Phase Affected
No migration impact. LearningProgress is a **new entity with no legacy data**.

### Implementation Notes
- IndexedDB store created during first app launch via `onupgradeneeded`.
- Default empty state: no progress records until user begins a path.
- Export format includes `learning-progress.json` in backup ZIP.
- Import merges by `id`; conflicts resolved by user prompt.

### Risk Assessment
- **Zero risk**: No existing data affected.
- **Privacy risk mitigated**: Progress never touches canonical data stores.

---

## 6. BACKWARD COMPATIBILITY

### Existing Backups
- No impact. Additive entity.
- Old backups restore without LearningProgress; app initializes empty progress store.

### Data Portability
- Export includes LearningProgress in user data bundle.
- Import validates against schema; rejects malformed records.
- Cross-device transfer via manual export/import only (per local-first spec).

### Breaking Changes
- **None**. LearningPath entity unchanged.
- Applications ignoring LearningProgress continue functioning normally.

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted (WS-D, agent-106)" | reviewStatus: "pending-scholarly-review"*
