# Policy Decision 52: Quranic Knowledge Architecture Expansion

**Date:** November 11, 2026  
**Sprint:** 52  
**Status:** Implemented  
**Supersedes:** None (new policy)  
**Preserves:** All Sprint 8–51 taxonomy decisions

## Summary

Sprint 52 expands the Quranic knowledge architecture from 10 dimensions to 15, from 11 topics to 18, and introduces a new study journeys system. This document records the policy decisions made during expansion.

## Decision 1: Dimension Expansion Criteria

**Decision:** New dimensions are added only when they address genuine coverage gaps in the existing taxonomy, not to reach a marketing target.

**Rationale:** The original 10 dimensions were derived from a careful audit of Quranic guidance areas. Adding dimensions without clear justification would dilute the taxonomy and create navigation confusion.

**Application:** Five new dimensions were added after auditing the existing topic library:
- Worship and Devotion (عبادة) — distinct from spiritual dimension (outward practice vs. inner relationship)
- Prophets and Their Stories (الأنبياء) — distinct from history dimension (focused on prophetic narratives)
- Creation and Signs in Nature (الخلق) — distinct from knowledge dimension (focused on natural world as signs)
- The Hereafter and Resurrection (الآخرة) — distinct from spiritual dimension (eschatology vs. present-life faith)
- Law and Legal Obligations (الأحكام) — distinct from governance dimension (specific rulings vs. leadership/justice)

Each new dimension has:
- Clear scope and boundaries documented in its description
- No overlap with existing dimensions
- Verified Arabic and English labels
- Stable ID and slug

## Decision 2: Topic Expansion Criteria

**Decision:** New topics are added only when they represent distinct Quranic subjects with sufficient curated ayat to justify a dedicated page.

**Rationale:** Topics are editorially curated entry points for reflection. Adding topics without meaningful content would create empty shells that mislead users.

**Application:** Seven new topics were added, each with 5-6 curated ayat:
- Divine Oneness (التوحيد) — foundational theological concept
- Prayer (الصلاة) — central act of worship
- Supplication (الدعاء) — personal communication with God
- God-Consciousness (التقوى) — ethical and spiritual awareness
- Repentance (التوبة) — spiritual return and renewal
- Prophets and Their Stories (الأنبياء) — narrative guidance
- Good Character (الأخلاق) — ethical conduct

Each topic includes:
- Typed relations (LEXICAL_MATCH, TOPIC_ASSOCIATION, SEQUENTIAL_CONTEXT, CROSS_REFERENCE)
- Neutral rationales for each ayah inclusion
- Provenance record (method, curator, reviewedAt, status)
- Related topics for lateral navigation

## Decision 3: Domain-Topic Relationship Policy

**Decision:** Domain-topic relationships are organizational proposals, not scholarly classifications. Each relationship carries editorial evidence and pending-review status.

**Rationale:** Domains are organizational categories, not approved taxonomy. Relationships between domains and topics must be transparent about their provisional nature.

**Application:** Seven new domain-topic relationships were added for the new topics:
- tawheed → belief-theology
- prayer → worship-practice
- supplication → worship-practice
- god-consciousness → ethics-character
- repentance → ethics-character
- prophets → prophets-narratives
- good-character → ethics-character

Each relationship includes:
- Editorial evidence explaining the connection
- `pending-review` status
- `organizational-membership` semantics
- No fabricated scholarly approvals

## Decision 4: Study Journeys vs. Learning Paths

**Decision:** Study journeys are dimension-targeted learning experiences, distinct from audience-targeted learning paths.

**Rationale:** Learning paths (Sprint 46) organize content by learner goals (beginner, intermediate, advanced). Study journeys organize content by thematic dimensions (spiritual, personal, family, etc.). The two systems are complementary, not competing.

**Application:** Study journeys have:
- Dimension targeting (each journey belongs to a dimension)
- Prerequisites (some journeys require completing others first)
- Version tracking (journeys can be updated editorially)
- Local-first progress storage
- Stage-based structure (not time-based like reading plans)

## Decision 5: Local-First Journey Progress

**Decision:** Journey progress is stored in localStorage with versioned schema, included in the backup envelope, and requires no account or cloud sync.

**Rationale:** The product is local-first and account-free. Journey progress must follow the same privacy model as bookmarks, notes, and reading plans.

**Application:**
- localStorage key: `alhuda.journeys.v1`
- Schema version: 1
- Normalization and validation on read/write
- Included in backup envelope v8
- Export/import/erase integrated with existing backup controls

## Decision 6: Provenance Transparency

**Decision:** All new taxonomy content carries `pending-scholarly-review` status and displays this prominently in the UI.

**Rationale:** The product does not fabricate scholarly approvals. All editorial content is transparent about its provisional nature.

**Application:**
- All new dimensions display pending-review notice
- All new topics display pending-review notice
- All new domain-topic relationships display pending-review notice
- All study journeys display provenance footer (method, curator, reviewedAt, status)
- No scholar names, reviewer identities, or source URLs are invented

## Decision 7: Root/Theme Separation

**Decision:** Morphological root occurrences remain independent from thematic classifications. Root data never automatically becomes topic content.

**Rationale:** Roots are linguistic units; topics are thematic categories. Conflating them would misrepresent both the linguistic structure and the thematic organization of the Quran.

**Application:**
- Root occurrence data unchanged (1,642 roots, 1,471 activated)
- Topic ayat are curated editorially, not derived from roots
- Root pages do not display topic associations
- Topic pages do not display root occurrences
- The two systems remain distinct in the data model and UI

## Decision 8: No AI-Generated Religious Content

**Decision:** `AI_ANSWER_FEATURE_ENABLED = false` remains unchanged. AI does not generate religious interpretation, thematic classifications, or scholarly citations.

**Rationale:** The product does not present AI-generated religious content as authoritative. AI may assist with editorial workflow (candidate discovery, duplicate detection, metadata validation) but must not publish classifications automatically.

**Application:**
- No AI-generated topic descriptions
- No AI-generated ayah rationales
- No AI-generated scholarly citations
- All new content is editorially curated with explicit provenance
- AI answer feature remains compile-time disabled

## Decision 9: Backup Envelope Extension

**Decision:** The backup envelope is extended from v7 to v8 to include journey progress, with backward compatibility for v3-v7 backups.

**Rationale:** Journey progress is personal data that should be included in backups. Legacy backups should restore successfully with empty journey state.

**Application:**
- `BackupFile`, `RestorableBackup`, `BackupInput` interfaces extended
- `parseBackup()` accepts versions 3-8
- Missing `journeys` field defaults to `EMPTY_JOURNEYS_STATE`
- Export includes `journeys: journeys.exportState()`
- Import restores `journeys.restoreState(data.journeys)`
- Erase calls `journeys.clearAll()`

## Decision 10: Validation Scripts

**Decision:** Two new audit scripts validate the expanded taxonomy and study journeys.

**Rationale:** Automated validation prevents silent drift in the taxonomy and journey data.

**Application:**
- `scripts/audit-quranic-taxonomy.mjs` — validates 15 dimensions, 18 topics, 14 domains, 18 relationships
- `scripts/audit-study-journeys.mjs` — validates 4 journeys, 20 stages, dimension/topic references
- Both scripts read TypeScript source files directly (no compilation required)
- Both scripts exit with code 0 on success, 1 on failure
- Both scripts are run as part of the quality gates

## Metrics

| Component | Before | After | Change |
|---|---:|---:|---:|
| Dimensions | 10 | 15 | +5 |
| Topics | 11 | 18 | +7 |
| Domain-Topic Relationships | 11 | 18 | +7 |
| Study Journeys | 0 | 4 | +4 |
| Journey Stages | 0 | 20 | +20 |
| Curated Ayat | 56 | 93 | +37 |
| Knowledge Graph Nodes | 21 | 33 | +12 |
| Sitemap Entries | 6,397 | 6,409 | +12 |
| Static Pages | 343 | 347 | +4 |
| Backup Envelope Version | 7 | 8 | +1 |

## Constraints Preserved

- ✅ No modification to Quran text, translations, Tafsir, or morphology data
- ✅ No AI-generated religious answers
- ✅ No accounts or cloud sync
- ✅ No conflation of morphological roots with thematic classifications
- ✅ All existing dimension/domain/topic IDs and slugs preserved
- ✅ All existing tests pass without modification (998 tests, 56 files)
- ✅ All existing routes continue to work
- ✅ No deployment performed

## Future Work

Sprint 53 (not started) could address:
- Integrate topic context into Quran reader (ayah-card.tsx)
- Add breadcrumb navigation across all new routes
- Implement topic-to-journey cross-references
- Add journey completion certificates (local-only)
- Expand study journeys catalog (currently 4, could grow to 10-15)
- Add search functionality for dimensions, topics, domains, journeys
- Implement filtering and sorting on topic discovery page

## Conclusion

Sprint 52 successfully expanded the Quranic knowledge architecture while preserving all existing functionality and quality standards. The new study journeys system provides a structured learning path for learners, and the expanded taxonomy offers richer navigation and discovery. All content carries transparent provenance and review status, maintaining the project's commitment to source transparency and scholarly integrity.
