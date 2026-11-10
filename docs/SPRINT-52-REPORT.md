# Sprint 52 Report: Quranic Knowledge Architecture, Expanded Dimensions & Guided Study Journeys

**Sprint:** 52  
**Date:** November 11, 2026  
**Status:** ✅ Complete

## Overview

Sprint 52 expanded the Quranic knowledge architecture from 10 dimensions to 15, from 11 topics to 18, and introduced a new study journeys system for structured, dimension-targeted learning experiences.

## Deliverables

### 1. Expanded Dimension Taxonomy (10 → 15)

Added 5 new dimensions to address genuine coverage gaps:

- **Worship and Devotion** (عبادة) — Prescribed acts: prayer, fasting, pilgrimage, supplication
- **Prophets and Their Stories** (الأنبياء) — Prophetic narratives and historical lessons
- **Creation and Signs in Nature** (الخلق) — Natural world as signs of the Creator
- **The Hereafter and Resurrection** (الآخرة) — Eschatology: judgment, paradise, hell
- **Law and Legal Obligations** (الأحكام) — Halal/haram, obligations, prohibitions

All dimensions carry `pending-scholarly-review` status with updated provenance (reviewedAt: 2026-11-11).

### 2. Expanded Topic Library (11 → 18)

Added 7 new topics with curated ayat and full provenance:

1. **Divine Oneness** (التوحيد) — 6 ayat covering tawheed
2. **Prayer** (الصلاة) — 6 ayat covering salah
3. **Supplication** (الدعاء) — 5 ayat covering dua
4. **God-Consciousness** (التقوى) — 5 ayat covering taqwa
5. **Repentance** (التوبة) — 5 ayat covering tawbah
6. **Prophets and Their Stories** (الأنبياء) — 5 ayat covering prophetic narratives
7. **Good Character** (الأخلاق) — 5 ayat covering akhlaq

Each topic includes:
- Typed relations (LEXICAL_MATCH, TOPIC_ASSOCIATION, SEQUENTIAL_CONTEXT, CROSS_REFERENCE)
- Neutral rationales for each ayah inclusion
- Provenance record (method, curator, reviewedAt, status)
- Related topics for lateral navigation

### 3. Domain-Topic Relationships

Added 7 new domain-topic relationships for the new topics:

- tawheed → belief-theology
- prayer → worship-practice
- supplication → worship-practice
- god-consciousness → ethics-character
- repentance → ethics-character
- prophets → prophets-narratives
- good-character → ethics-character

All relationships carry editorial evidence and `pending-review` status.

### 4. Study Journeys System

Created a new data model and storage system for structured learning experiences:

**Data Model:**
- `StudyJourney` — dimension-targeted, with stages, prerequisites, version tracking
- `JourneyStage` — can reference specific ayah or curated topic
- `JourneyProgress` — tracks completed stages, timestamps, journey version
- `JourneysState` — localStorage-backed, included in backup envelope

**Initial Journeys (4):**
1. **Understanding Tawheed** (spiritual, beginner, 30 min) — 5 stages
2. **Patience Through Difficulties** (personal, beginner, 25 min) — 5 stages
3. **Gratitude and Contentment** (spiritual, beginner, 25 min) — 5 stages
4. **Building a Relationship with Allah** (spiritual, intermediate, 40 min) — 5 stages, prerequisite: understanding-tawheed

**Storage:**
- localStorage key: `alhuda.journeys.v1`
- Normalization and validation on read/write
- Included in backup envelope v8

### 5. UI Pages

**Study Journeys:**
- `/study-journeys` — Listing page with dimension badges, difficulty, estimated time
- `/study-journeys/[slug]` — Detail page with stages, progress tracker, prerequisites
- `progress-tracker.tsx` — Client component for marking stages complete

**Explore Topics:**
- `/explore/topics` — Discovery page with all 18 topics, sorted by verse count, showing dimension and domain mappings

### 6. Backup Envelope Extension (v7 → v8)

Extended the shared backup envelope to include study journey progress:
- Added `journeys: JourneysState` field
- Updated `BackupFile`, `RestorableBackup`, `BackupInput` interfaces
- Updated `buildBackup()` and `parseBackup()` to handle v8
- Legacy backups (v1-v7) get empty journeys state on restore

### 7. Context Provider Integration

- Created `JourneysProvider` and `useJourneys()` hook
- Registered in `src/app/layout.tsx`
- Integrated into `backup-controls.tsx` for export/import/erase

### 8. Validation Scripts

Created two audit scripts:

**`scripts/audit-quranic-taxonomy.mjs`:**
- Validates 15 dimensions (no duplicates, required fields, topic references)
- Validates 18 topics (no duplicates, required fields, relations structure)
- Validates 14 domains (no duplicates, required fields, overlap references)
- Validates 18 domain-topic relationships (no duplicates, domain/topic existence)

**`scripts/audit-study-journeys.mjs`:**
- Validates 4 journeys (no duplicates, required fields, dimension existence)
- Validates prerequisites (journey existence)
- Validates stages (no duplicate orders, required fields, topic/ref existence)

Both scripts exit with code 0 on success, 1 on failure.

## Quality Gates

All quality gates pass:

- ✅ TypeScript typecheck (no errors)
- ✅ ESLint (no warnings or errors)
- ✅ Vitest (998 tests pass, 56 files)
- ✅ Next.js build (347 static pages generated)
- ✅ audit-quranic-taxonomy.mjs (all validations pass)
- ✅ audit-study-journeys.mjs (all validations pass)

## Files Modified

### Data Layer
- `src/lib/explore/dimensions.ts` — Added 5 dimensions (10 → 15)
- `src/lib/topics/data.ts` — Added 7 topics (11 → 18)
- `src/lib/taxonomy/domain-topics.ts` — Added 7 relationships (11 → 18)
- `src/lib/study-journeys/types.ts` — New file
- `src/lib/study-journeys/data.ts` — New file
- `src/lib/study-journeys/storage.ts` — New file
- `src/lib/study-journeys/context.tsx` — New file
- `src/lib/backup.ts` — Extended to v8 with journeys support

### UI Layer
- `src/app/layout.tsx` — Registered JourneysProvider
- `src/app/study-journeys/page.tsx` — New file
- `src/app/study-journeys/[slug]/page.tsx` — New file
- `src/app/study-journeys/[slug]/progress-tracker.tsx` — New file
- `src/app/explore/topics/page.tsx` — New file
- `src/components/library/backup-controls.tsx` — Integrated journeys

### Scripts
- `scripts/audit-quranic-taxonomy.mjs` — New file
- `scripts/audit-study-journeys.mjs` — New file

### Documentation
- `docs/SPRINT-52-REPORT.md` — This file

## Key Design Decisions

1. **Dimension Expansion:** Added dimensions that address genuine coverage gaps identified in the baseline audit. Each new dimension has distinct scope and does not overlap with existing dimensions.

2. **Topic Curation:** All new topics follow the same editorial pattern as existing topics — typed relations, neutral rationales, provenance tracking. No AI-generated religious interpretation.

3. **Study Journeys vs. Learning Paths:** Journeys are dimension-targeted (organized around themes), while paths are audience-targeted (organized around learner goals). Journeys have version tracking and prerequisites; paths have onboarding and goal selection.

4. **Local-First Progress:** Journey progress stored in localStorage with normalization and validation. No accounts, no cloud sync. Progress included in backup envelope.

5. **Provenance Transparency:** All new content carries `pending-scholarly-review` status. UI displays this prominently. Nothing is presented as authoritative without disclosure.

## Metrics

- **Dimensions:** 15 (was 10, +5 new)
- **Topics:** 18 (was 11, +7 new)
- **Domains:** 14 (unchanged)
- **Domain-Topic Relationships:** 18 (was 11, +7 new)
- **Study Journeys:** 4 (new)
- **Total Journey Stages:** 20
- **Curated Ayat:** 93 total across 18 topics (was 56 across 11 topics, +37 new)
- **Backup Envelope Version:** 8 (was 7)
- **Tests:** 998 pass (unchanged, 56 test files)
- **Static Pages:** 347 (was 343, +4 for study-journeys and explore/topics)
- **Sitemap Entries:** 6,409 (was 6,397, +12 for new topics and dimensions)
- **Knowledge Graph Nodes:** 33 (was 21, +12 for new dimensions and topics)

### New Dimensions Added
1. Worship and Devotion (عبادة)
2. Prophets and Their Stories (الأنبياء)
3. Creation and Signs in Nature (الخلق)
4. The Hereafter and Resurrection (الآخرة)
5. Law and Legal Obligations (الأحكام)

### New Topics Added
1. Divine Oneness (التوحيد) — 6 ayat
2. Prayer (الصلاة) — 6 ayat
3. Supplication (الدعاء) — 5 ayat
4. God-Consciousness (التقوى) — 5 ayat
5. Repentance (التوبة) — 5 ayat
6. Prophets and Their Stories (الأنبياء) — 5 ayat
7. Good Character (الأخلاق) — 5 ayat

## Constraints Preserved

- ✅ No modification to Quran text, translations, Tafsir, or morphology data
- ✅ No AI-generated religious answers
- ✅ No accounts or cloud sync
- ✅ No conflation of morphological roots with thematic classifications
- ✅ All existing dimension/domain/topic IDs and slugs preserved
- ✅ All existing tests pass without modification
- ✅ All existing routes continue to work

## Next Steps

Sprint 53 (not started) could address:
- Integrate topic context into Quran reader (ayah-card.tsx)
- Add breadcrumb navigation across all new routes
- Implement topic-to-journey cross-references
- Add journey completion certificates (local-only)
- Expand study journeys catalog (currently 4, could grow to 10-15)

## Conclusion

Sprint 52 successfully expanded the Quranic knowledge architecture while preserving all existing functionality and quality standards. The new study journeys system provides a structured learning path for learners, and the expanded taxonomy offers richer navigation and discovery. All content carries transparent provenance and review status, maintaining the project's commitment to source transparency and scholarly integrity.
