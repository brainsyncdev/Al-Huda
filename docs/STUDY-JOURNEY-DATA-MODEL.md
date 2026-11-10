# Study Journey Data Model

**Date:** November 11, 2026  
**Sprint:** 52  
**Status:** Implemented  
**Version:** 1.0

## Overview

Study journeys are structured learning experiences that guide users through curated topics and Quranic ayat. Each journey is dimension-targeted and consists of ordered stages.

## Data Model

### StudyJourney

```typescript
interface StudyJourney {
  slug: string;                    // Stable URL-safe identifier
  title: string;                   // English title
  arabicTitle: string;             // Verified Arabic title
  summary: string;                 // Short description
  dimensionId: DimensionId;        // Parent dimension
  difficulty: JourneyDifficulty;   // "beginner" | "intermediate" | "advanced"
  estimatedMinutes: number;        // Estimated completion time
  stages: JourneyStage[];          // Ordered learning stages
  prerequisites: string[];         // Required journey slugs
  provenance: ProvenanceRecord;    // Editorial provenance
  version: number;                 // Schema version for migration
}
```

### JourneyStage

```typescript
interface JourneyStage {
  order: number;                   // Stage order (1-based)
  title: string;                   // Stage title
  objective: string;               // Learning objective
  topicSlug?: string;              // Optional topic reference
  ref?: AyahRef;                   // Optional ayah reference
}
```

A stage must have either `topicSlug` or `ref` (or both). This allows stages to reference either a curated topic or a specific ayah.

### JourneyProgress

```typescript
interface JourneyProgress {
  journeySlug: string;             // Journey identifier
  journeyVersion: number;          // Journey version at start
  completedStages: number[];       // Array of completed stage orders
  lastAccessedAt: string;          // ISO timestamp
  startedAt: string;               // ISO timestamp
}
```

### JourneysState

```typescript
interface JourneysState {
  version: 1;                      // Schema version
  progress: Record<string, JourneyProgress>; // journeySlug -> progress
}
```

## Storage

### localStorage

Journey progress is stored in localStorage:

- **Key:** `alhuda.journeys.v1`
- **Format:** JSON-serialized `JourneysState`
- **Migration:** Version field allows future schema changes

### Backup Envelope

Journey progress is included in the backup envelope (v8+):

```typescript
interface BackupFile {
  version: number;                 // 8 for Sprint 52+
  // ... other fields ...
  journeys: JourneysState;         // Journey progress
}
```

Legacy backups (v3-v7) restore with empty journey state.

## API

### Context Provider

```typescript
interface JourneysContextValue {
  startJourney: (slug: string) => void;
  completeStage: (slug: string, order: number) => void;
  getProgress: (slug: string) => JourneyProgress | null;
  isStageComplete: (slug: string, order: number) => boolean;
  exportState: () => JourneysState;
  restoreState: (state: JourneysState) => void;
  clearAll: () => void;
}
```

### Hooks

```typescript
const journeys = useJourneys();

// Start a journey
journeys.startJourney("understanding-tawheed");

// Mark a stage complete
journeys.completeStage("understanding-tawheed", 1);

// Get progress
const progress = journeys.getProgress("understanding-tawheed");

// Check if stage is complete
const isComplete = journeys.isStageComplete("understanding-tawheed", 1);

// Export state (for backup)
const state = journeys.exportState();

// Restore state (from backup)
journeys.restoreState(state);

// Clear all progress
journeys.clearAll();
```

## Initial Journeys

Four journeys are implemented in Sprint 52:

### 1. Understanding Tawheed

- **Slug:** `understanding-tawheed`
- **Dimension:** spiritual
- **Difficulty:** beginner
- **Duration:** 30 minutes
- **Stages:** 5
- **Prerequisites:** none

**Stages:**
1. Introduction to Divine Oneness (topic: tawheed)
2. The Oneness of Lordship (ref: 2:163)
3. The Oneness of Worship (ref: 1:5)
4. The Oneness of Names and Attributes (ref: 42:11)
5. Living with Tawheed (ref: 51:56)

### 2. Patience Through Difficulties

- **Slug:** `patience-through-difficulties`
- **Dimension:** personal
- **Difficulty:** beginner
- **Duration:** 25 minutes
- **Stages:** 5
- **Prerequisites:** none

**Stages:**
1. Understanding Patience (topic: patience)
2. Patience in Adversity (ref: 2:155-157)
3. Patience in Worship (ref: 20:132)
4. Patience with People (ref: 31:17)
5. The Reward of Patience (ref: 39:10)

### 3. Gratitude and Contentment

- **Slug:** `gratitude-and-contentment`
- **Dimension:** spiritual
- **Difficulty:** beginner
- **Duration:** 25 minutes
- **Stages:** 5
- **Prerequisites:** none

**Stages:**
1. Understanding Gratitude (topic: gratitude)
2. Gratitude for Blessings (ref: 14:7)
3. Gratitude in Worship (ref: 2:172)
4. Gratitude in Speech (ref: 93:11)
5. The Reward of Gratitude (ref: 14:34)

### 4. Building a Relationship with Allah

- **Slug:** `building-relationship-with-allah`
- **Dimension:** spiritual
- **Difficulty:** intermediate
- **Duration:** 40 minutes
- **Stages:** 5
- **Prerequisites:** `understanding-tawheed`

**Stages:**
1. Foundation: Understanding Tawheed (journey prerequisite)
2. Knowing Allah Through His Names (ref: 7:180)
3. Communicating with Allah (topic: supplication)
4. Remembering Allah (topic: remembrance)
5. Trusting Allah (topic: trust-in-god)

## Validation

### `scripts/audit-study-journeys.mjs`

Validates:
- 4 journeys (no duplicates, required fields, dimension existence)
- 20 stages (no duplicate orders, required fields, topic/ref existence)
- Prerequisites (journey existence)
- Dimension references (valid dimension IDs)
- Topic references (valid topic slugs)

### Test Coverage

- Journey loading and validation
- Stage ordering and completion
- Progress persistence
- Backup integration
- Prerequisite checking

## UI Integration

### Journey Listing Page

Route: `/study-journeys`

Displays:
- All available journeys
- Dimension badges
- Difficulty indicators
- Estimated time
- Stage counts
- Pending-review notice

### Journey Detail Page

Route: `/study-journeys/[slug]`

Displays:
- Journey title and description
- Dimension and difficulty
- Prerequisites (if any)
- Stage list with progress tracker
- Provenance footer

### Progress Tracker

Client component: `src/app/study-journeys/[slug]/progress-tracker.tsx`

Features:
- Auto-starts journey on mount
- Progress bar
- Toggleable stage completion buttons
- Real-time progress updates

## Constraints

- No accounts or cloud sync
- No analytics
- No gamified religious scoring
- No streak pressure or leaderboards
- Local-first progress storage
- Versioned schema for migration
- Backup/export compatibility

## Future Work

- Expand journey catalog (currently 4, could grow to 10-15)
- Add journey completion certificates (local-only)
- Implement journey-to-journey navigation
- Add reflection prompts to stages
- Integrate with personal notes and bookmarks
- Add journey recommendations based on user interests

## References

- [SPRINT-52-REPORT.md](SPRINT-52-REPORT.md) — Implementation report
- [POLICY-DECISION-52.md](POLICY-DECISION-52.md) — Policy decisions
- [QURANIC-TAXONOMY-52.md](QURANIC-TAXONOMY-52.md) — Taxonomy documentation
