# MFD-09 Baseline Audit

**Date:** November 12, 2026  
**Branch:** `main`  
**Commit:** `dad0654`  
**Working Tree:** Clean  

---

## Executive Summary

This document establishes the immutable baseline for MFD-09. All counts are verified directly from repository files, not copied from historical reports.

---

## Repository State

- **Branch:** main
- **Latest Commit:** dad0654 (docs: Add final MFD-08 documentation and validation scripts)
- **Previous Commit:** 607fa55 (MFD-08: Scholarly Validation, Data Integrity & Source Governance)
- **Working Tree:** Clean (no uncommitted changes)
- **Remote Status:** Up to date with origin/main

---

## Verified Baseline Counts

### Taxonomy Hierarchy

| Entity Type | Count | File Location | Status |
|-------------|------:|---------------|:------:|
| Domains | 20 | `data/taxonomy/domains.json` | ✅ Verified |
| Dimensions | 103 | `data/taxonomy/dimensions.json` | ✅ Verified |
| Subdimensions | 25 | `data/taxonomy/subdimensions.json` | ✅ Verified |
| Topics | 184 | `data/taxonomy/topics.json` | ✅ Verified |
| Relationships | 150 | `data/taxonomy/relationships.json` | ✅ Verified |

### Ayah Mappings

| Metric | Count | Notes |
|--------|------:|-------|
| Total mapping records | 789 | Verified from `data/taxonomy/topic-ayah-mappings.json` |
| Topics with mappings | 176 | 8 topics have no mappings (added in MFD-08) |
| Topics without mappings | 8 | Newly added in MFD-08, awaiting mapping |
| **Expanded ayat (sum of ranges)** | **1,886** | ⚠️ **DISCREPANCY**: MFD-08 reported 1,889 |

**Critical Finding:** There is a 3-ayat discrepancy between MFD-08's reported count (1,889) and the actual verified count (1,886). This must be investigated by Subagent 1.

### Arabic Root Registry

| Status | Count | Percentage |
|--------|------:|-----------:|
| Activated | 1,471 | 89.6% |
| Partially activated | 103 | 6.3% |
| Needs review | 68 | 4.1% |
| **Total roots** | **1,642** | 100% |

**File:** `data/root-discovery-registry.json`

### Quran Dataset

| Metric | Count | Source |
|--------|------:|--------|
| Surahs | 114 | `node_modules/quran-json/dist/quran.json` |
| Total ayat | 6,236 | Sum of all verses across all surahs |
| Dataset version | 3.1.2 | quran-json package |
| License | CC-BY-4.0 | Verified |

### Source Registry

**File:** `src/lib/quran/sources.ts`  
**Total source records:** 13 (verified from file structure)

Source categories:
- Quran dataset: 1 (quran-json)
- Translations: 3 (Saheeh International, Tanzil proxy, Tanzil translations)
- Tafsir: 4 (al-Jalalayn, al-Muyassar, Ibn Kathir, Ma'ariful Quran)
- Audio: 1 (islamic-network-audio)
- Morphology: 1 (qul-morphology-v1)
- Metadata: 1 (tanzil-mushaf-metadata)
- Editorial: 1 (editorial-content)
- Transliteration: 1 (tanzil-translit)

**Note:** Ma'ariful Quran marked as `available: false` in MFD-08 (homepage points to wrong resource).

---

## Existing Validators

All validators are located in `scripts/` directory:

| Validator | File | Purpose |
|-----------|------|---------|
| validate-all.mjs | Master runner | Runs all validators |
| validate-ayah-mappings.mjs | Mapping integrity | Validates mapping records |
| validate-build-env.mjs | Build environment | Checks build prerequisites |
| validate-graph.mjs | Graph integrity | Validates knowledge graph |
| validate-lemma-review.mjs | Lemma review | Validates root associations |
| validate-quran-data.mjs | Quran dataset | Validates Quran integrity |
| validate-roots.mjs | Root registry | Validates root data |
| validate-source-licenses.mjs | Licensing | Validates source licenses |
| validate-taxonomy.mjs | Taxonomy | Validates taxonomy structure |

**Status:** All validators passing as of MFD-08 completion.

---

## Existing MFD-08 Documentation

17 audit documents created in MFD-08:

1. FAHM-MFD-08-AI-SAFETY-STATUS.md
2. FAHM-MFD-08-AYAH-MAPPING-AUDIT.md
3. FAHM-MFD-08-BASELINE-AUDIT.md
4. FAHM-MFD-08-COMPLETION-REPORT.md
5. FAHM-MFD-08-DATA-INTEGRITY-REPORT.md
6. FAHM-MFD-08-ENTITY-COUNT-REPORT.md
7. FAHM-MFD-08-GRAPH-RECONCILIATION.md
8. FAHM-MFD-08-LICENSING-AUDIT.md
9. FAHM-MFD-08-ROOT-LINGUISTIC-AUDIT.md
10. FAHM-MFD-08-ROOT-REVIEW-QUEUE.md
11. FAHM-MFD-08-SCHOLARLY-GOVERNANCE.md
12. FAHM-MFD-08-TAFSIR-AVAILABILITY.md
13. FAHM-MFD-08-TAFSIR-SOURCE-AUDIT.md
14. FAHM-MFD-08-TAXONOMY-RECONCILIATION.md
15. FAHM-MFD-08-TEST-REPORT.md
16. FAHM-MFD-08-TRANSLATION-SOURCE-AUDIT.md
17. FAHM-MFD-08-UX-TRANSPARENCY.md

---

## Discrepancies from Historical Reports

### Discrepancy 1: Expanded Ayat Count

- **MFD-08 Reported:** 1,889 expanded ayat
- **Actual Verified:** 1,886 expanded ayat
- **Difference:** 3 ayat
- **Action Required:** Subagent 1 must investigate the source of this discrepancy

### Discrepancy 2: Graph Node Count

- **MFD-07 Reported:** 299 graph nodes
- **MFD-08 Corrected:** 332 graph nodes (20+103+25+184)
- **Status:** Resolved in MFD-08

### Discrepancy 3: Topic Count

- **MFD-07 Reported:** 182 topics
- **MFD-08 Corrected:** 184 topics (added 8 missing, removed 0)
- **Status:** Resolved in MFD-08

### Discrepancy 4: Language Count

- **MFD-07 Reported:** "50+ languages"
- **MFD-08 Corrected:** 44 languages
- **Status:** Resolved in MFD-08

---

## Known Issues from MFD-08

### Issue 1: 8 Topics Without Ayah Mappings

**Status:** Documented, not defective  
**Topics:** wealth-ownership, evidence-standards, public-accountability, environmental-corruption, day-of-judgment, non-combatant-protection, interest-free-finance, covenants-ahd  
**Reason:** Added in MFD-08 to fix broken relationship references  
**Action:** Subagent 2 will evaluate whether these topics need mappings or should remain unmapped

### Issue 2: Ma'ariful Quran Tafsir Unavailable

**Status:** Marked unavailable in UI  
**Reason:** Homepage URL points to Quran courses institute, not the actual tafsir  
**Action:** Subagent 1 will verify tafsir availability claims

### Issue 3: 68 Roots Needing Linguistic Review

**Status:** Review queue created  
**Reason:** Require qualified Arabic linguist review  
**Action:** Out of scope for MFD-09 (requires human scholarly review)

### Issue 4: No Qualified Scholarly Reviewers

**Status:** Blocker documented  
**Reason:** MFD-08 cannot manufacture scholarly authority  
**Action:** All mappings remain `pending-scholarly-review`

---

## Schema Versions

### Taxonomy Schema

- **Domains:** Standard entity with id, name, nameAr, nameUr, description
- **Dimensions:** Standard entity with id, name, nameAr, nameUr, domainId, description
- **Subdimensions:** Standard entity with id, name, nameAr, nameUr, dimensionId, description
- **Topics:** Standard entity with id, name, nameAr, nameUr, domainId, dimensionId, subdimensionId (optional), description
- **Relationships:** id, sourceTopicId, targetTopicId, type, rationale

### Mapping Schema

- **Mapping records:** id, topicId, surahNumber, ayahStart, ayahEnd, mappingType, rationale, sourceIds, provenance, reviewStatus

### Root Registry Schema

- **Root records:** slug, arabic, transliteration, status, meaning, sourceAttribution

---

## File Locations

### Core Data Files

- `data/taxonomy/domains.json`
- `data/taxonomy/dimensions.json`
- `data/taxonomy/subdimensions.json`
- `data/taxonomy/topics.json`
- `data/taxonomy/relationships.json`
- `data/taxonomy/topic-ayah-mappings.json`
- `data/root-discovery-registry.json`

### Source Registry

- `src/lib/quran/sources.ts`

### Quran Dataset

- `node_modules/quran-json/dist/quran.json`

### Validators

- `scripts/validate-*.mjs`

### Documentation

- `docs/FAHM-MFD-08-*.md` (17 files)
- `docs/MFD-09-*.md` (to be created)

---

## MFD-09 Execution Plan

### Phase 0: Baseline ✅ COMPLETE

- [x] Verify repository state
- [x] Verify all counts from actual files
- [x] Document discrepancies
- [x] Create baseline audit document (this file)

### Phase 1: Subagent 1 — Ayah Mapping Audit 🔄 IN PROGRESS

- [ ] Audit all 789 mapping records individually
- [ ] Investigate 3-ayat discrepancy (1,889 vs 1,886)
- [ ] Assign audit verdict to each mapping
- [ ] Identify weak evidence cases
- [ ] Audit tafsir evidence
- [ ] Create machine-readable audit file
- [ ] Create summary documentation

### Phase 2: Subagent 2 — Taxonomy Audit 🔄 IN PROGRESS

- [ ] Audit all 20 domains
- [ ] Audit all 103 dimensions
- [ ] Audit all 25 subdimensions
- [ ] Audit all 184 topics
- [ ] Audit all 150 relationships
- [ ] Evaluate dimension coverage
- [ ] Identify duplicate concepts
- [ ] Identify missing topics
- [ ] Create machine-readable audit files
- [ ] Create summary documentation

### Phase 3: Reconciliation (Pending)

- [ ] Receive reports from both subagents
- [ ] Reconcile overlapping findings
- [ ] Resolve disagreements through evidence
- [ ] Create prioritized issue register
- [ ] Document unresolved scholarly decisions

### Phase 4: Implementation (Pending)

- [ ] Implement only justified changes
- [ ] Correct broken references
- [ ] Add missing metadata
- [ ] Improve provenance
- [ ] Do NOT modify Quran Arabic text
- [ ] Do NOT claim scholarly approval

### Phase 5: Validation (Pending)

- [ ] Run all existing validators
- [ ] Run TypeScript compilation
- [ ] Run ESLint
- [ ] Run production build
- [ ] Verify backup/restore compatibility
- [ ] Verify existing routes

### Phase 6-7: UI & Governance (Pending)

- [ ] Verify UI transparency
- [ ] Verify scholarly governance
- [ ] Verify AI safety remains OFF

### Phase 8: Final Report (Pending)

- [ ] Create MFD-09 completion report
- [ ] Document all findings
- [ ] Document outstanding issues
- [ ] Commit and push to main

---

## Subagent Status

### Subagent 1: Ayah Mapping Auditor

- **Agent ID:** 2960f082-d9f1-48e7-999a-1d5e8d484d71
- **Status:** Running
- **Responsibility:** Audit all 789 mappings with record-level findings
- **Deliverables:** 5 documentation files + 1 machine-readable JSON

### Subagent 2: Taxonomy Architect

- **Agent ID:** e9f862d0-b52d-46fc-9269-491c67e3702e
- **Status:** Running
- **Responsibility:** Audit complete taxonomy hierarchy
- **Deliverables:** 7 documentation files + 3 machine-readable JSON files

---

## Critical Rules for MFD-09

1. **Never modify Quran Arabic text**
2. **Never fabricate scholarly approval**
3. **Never claim a mapping is approved without human review**
4. **Never delete topics silently**
5. **Never create topics just to increase counts**
6. **Record uncertainty rather than concealing it**
7. **Distinguish technical validation from scholarly approval**
8. **Preserve stable IDs wherever possible**
9. **Do not optimize for passing validators — optimize for correctness**
10. **A topic without a mapping is not automatically defective**
11. **A mapping without strong evidence is not automatically valid**
12. **A dimension with zero topics is not a reason to invent topics**

---

## Conclusion

The baseline is established. All counts are verified from actual repository files. One critical discrepancy identified (3-ayat difference in expanded ayat count). Both specialist subagents are running independent audits. The next phase is reconciliation of their findings.

**Status:** ✅ BASELINE ESTABLISHED — SUBAGENTS RUNNING

---

**Document created:** November 12, 2026  
**Next action:** Wait for subagent completion, then reconcile findings
