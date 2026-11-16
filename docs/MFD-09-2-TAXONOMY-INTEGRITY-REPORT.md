# MFD-09.2 — Taxonomy, Coverage & Report Integrity Audit

**Audit ID:** MFD-09-2  
**Date:** 2026-11-16  
**Auditor:** Subagent 2 (Taxonomy, Coverage & Report Integrity Auditor)  
**Status:** ❌ VALIDATION FAILED  

---

## Executive Summary

This audit independently verified the entire FAHM Quran taxonomy: **20 domains, 103 dimensions, 25 subdimensions, 184 topics, and 150 relationships**. The audit calculated bidirectional coverage for all 103 dimensions, investigated 7 specific count discrepancies, verified 60 topic proposals, validated all relationships, and detected cross-report inconsistencies between MFD-09.1 outputs and actual source data.

### Key Findings

| Metric | Value | Status |
|--------|-------|--------|
| Total Domains | 20 | ✅ Verified |
| Total Dimensions | 103 | ✅ Verified |
| Total Subdimensions | 25 | ✅ Verified |
| Total Topics | 184 | ✅ Verified |
| Total Relationships | 150 | ✅ All Valid |
| Phantom References | 370 | ❌ Critical |
| Cross-Report Inconsistencies | 7 | ❌ Issues Found |
| Topic Proposals Verified | 60 | ✅ All Valid |
| Bidirectional Discrepancies | 103/103 dims checked | ⚠️ Widespread |

**Validation Passed: FALSE** — Due to 370 phantom references and 7 cross-report inconsistencies.

---

## 1. Entity Counts

| Entity Type | Count |
|-------------|-------|
| Domains | 20 |
| Dimensions | 103 |
| Subdimensions | 25 |
| Topics | 184 |
| Relationships | 150 |

> **Note:** The mission brief stated 184 topics; this is confirmed. However, only 184 topic records exist in `topics.json`, while `dimensions.json` references many more topic IDs that do not correspond to actual topic records (phantom references).

---

## 2. Bidirectional Coverage Analysis

For each of the 103 dimensions, two independent counts were calculated:
- **Dimension-side:** Length of `topicIds` array in `dimensions.json`
- **Topic-side:** Count of topics in `topics.json` where `parentDimensionId` equals that dimension

### Coverage Distribution

#### Dimension-Side Distribution (based on `topicIds` array lengths)

| Category | Count |
|----------|-------|
| ZERO_TOPICS | 0 |
| ONE_TOPIC | 0 |
| TWO_TOPICS | 0 |
| THREE_TO_FOUR_TOPICS | 9 |
| FIVE_OR_MORE_TOPICS | 94 |
| **Total** | **103** |

#### Topic-Side Distribution (based on actual topic records pointing to each dimension)

| Category | Count |
|----------|-------|
| ZERO_TOPICS | 31 |
| ONE_TOPIC | 26 |
| TWO_TOPICS | 21 |
| THREE_TO_FOUR_TOPICS | 14 |
| FIVE_OR_MORE_TOPICS | 11 |
| **Total** | **103** |

### Critical Observation

There is a **massive asymmetry** between dimension-side and topic-side counts:
- **94 dimensions** declare 5+ topics in their `topicIds` arrays
- But only **11 dimensions** actually have 5+ topic records pointing to them
- **31 dimensions** have ZERO topic records in `topics.json` pointing to them despite declaring topics in `dimensions.json`

This indicates that `dimensions.json` was populated with planned/aspirational topic IDs that were never created as actual topic records.

---

## 3. Seven Specific Discrepancy Investigations

### 3.1 salah-prayer

| Metric | Value |
|--------|-------|
| Dimension-side count | 7 |
| Topic-side count | 8 |
| MFD-09.1 topicCount | 8 |
| MFD-09.1 topicCountFromDimFile | 7 |
| MFD-09.1 topicCountFromTopicFile | 8 |

**Cause:** Topics.json has 1 topic (`remembrance-forgetfulness`) with `parentDimensionId=salah-prayer` that is NOT listed in the dimension's `topicIds` array. MFD-09.1 correctly counted 8 from topic file but its `topicIds` list includes this extra topic not in dimensions.json.

### 3.2 moral-virtues

| Metric | Value |
|--------|-------|
| Dimension-side count | 7 |
| Topic-side count | 8 |
| MFD-09.1 topicCount | 11 |
| MFD-09.1 topicCountFromDimFile | 7 |
| MFD-09.1 topicCountFromTopicFile | 8 |

**Cause:** Bidirectional mismatch. Dimension file lists 2 topics not in topics.json (`haya-modesty`, `hilm-forbearance`). Topics.json has 4 extra topics pointing here (`balance-moderation`, `trust-responsibility`, `gratitude-ingratitude`, `patience-haste`). MFD-09.1 reported topicCount=11 which matches neither side accurately — it appears to be a union of both sets.

### 3.3 sincerity-ikhlas

| Metric | Value |
|--------|-------|
| Dimension-side count | 5 |
| Topic-side count | 2 |
| MFD-09.1 topicCount | 6 |
| MFD-09.1 topicCountFromDimFile | 5 |
| MFD-09.1 topicCountFromTopicFile | 2 |

**Cause:** Dimension file lists 4 topics not found in topics.json (`ikhlas-definition`, `sincerity-in-worship`, `intention-purification`, `hidden-shirk`). Topics.json has 1 extra topic (`ikhlas-sincerity`) pointing here not in dimension file. MFD-09.1 topicCount=6 appears to be a union.

### 3.4 intellect-reason

| Metric | Value |
|--------|-------|
| Dimension-side count | 5 |
| Topic-side count | 6 |
| MFD-09.1 topicCount | 7 |
| MFD-09.1 topicCountFromDimFile | 5 |
| MFD-09.1 topicCountFromTopicFile | 6 |

**Cause:** Dimension file lists 1 topic not in topics.json (`reason-vs-revelation`). Topics.json has 2 extra topics (`signs-and-reflection`, `knowledge-ignorance`) pointing here. MFD-09.1 topicCount=7 is again a union of both sets.

### 3.5 personal-development

| Metric | Value |
|--------|-------|
| Dimension-side count | 6 |
| Topic-side count | 3 |
| MFD-09.1 topicCount | 7 |
| MFD-09.1 topicCountFromDimFile | 6 |
| MFD-09.1 topicCountFromTopicFile | 3 |

**Cause:** Dimension file lists 4 topics not in topics.json (`habit-formation`, `discipline`, `goal-setting`, `continuous-improvement`). Topics.json has 1 extra topic (`trial-and-test`). MFD-09.1 topicCount=7 is a union.

### 3.6 human-rights

| Metric | Value |
|--------|-------|
| Dimension-side count | 5 |
| Topic-side count | 2 |
| MFD-09.1 topicCount | 6 |
| MFD-09.1 topicCountFromDimFile | 5 |
| MFD-09.1 topicCountFromTopicFile | 2 |

**Cause:** Dimension file lists 4 topics not in topics.json (`right-to-dignity`, `vulnerable-protection`, `universal-rights`, `justice-for-all`). Topics.json has 1 extra topic (`justice-oppression`). MFD-09.1 topicCount=6 is a union.

### 3.7 quranic-vocabulary

| Metric | Value |
|--------|-------|
| Dimension-side count | 5 |
| Topic-side count | 1 |
| MFD-09.1 topicCount | 6 |
| MFD-09.1 topicCountFromDimFile | 5 |
| MFD-09.1 topicCountFromTopicFile | 1 |

**Cause:** Dimension file lists 5 topics not in topics.json (`key-terms`, `quranic-concepts`, `terminology-study`, `word-roots`, `semantic-fields`). Topics.json has 1 topic (`quranic-vocabulary`) pointing here that shares the same ID as the dimension itself. MFD-09.1 topicCount=6 is a union.

### Pattern Across All 7 Discrepancies

In every case, MFD-09.1's `topicCount` represents a **union** of dimension-side and topic-side IDs rather than either count independently. This explains why MFD-09.1 counts consistently exceed both individual measurements.

---

## 4. Phantom Reference Audit

**Total Phantom References: 370**

A phantom reference is a `topicId` listed in a dimension's `topicIds` array in `dimensions.json` that does NOT correspond to any actual topic record in `topics.json`.

### Top 15 Dimensions by Phantom Count

| Dimension | Phantom Count |
|-----------|--------------|
| natural-resources | 7 |
| agriculture-farming | 6 |
| travel-exploration | 6 |
| shariah-legal-principles | 6 |
| animals-creation | 6 |
| trade-commerce | 6 |
| conflict-resolution | 5 |
| death-dying | 5 |
| modern-economic-issues | 5 |
| body-as-trust | 5 |
| public-administration | 5 |
| criminal-law | 5 |
| business-ethics | 5 |
| international-law | 5 |
| mizan-balance | 5 |

### Nature of Phantoms

- **Genuine Missing:** All 370 phantoms are genuine missing topics — they are not subdimension IDs or aliases
- **Requires Human Review:** All 370 require human review to determine whether to create the missing topic records or remove the references from dimensions.json
- **None exist elsewhere:** No phantom was found as a subdimension or alias

### Impact

The 370 phantom references represent the single largest integrity issue in the taxonomy. They indicate that `dimensions.json` was populated with a planned topic structure that was only partially implemented in `topics.json`. Approximately **67%** of all topic references in dimensions.json are phantoms (370 phantoms out of ~550 total topicIds across all dimensions).

---

## 5. Topic Proposal Verification

All **60 proposals** from `mfd-09-1-topic-proposals-classified.json` were verified.

### Verification Results

| Check | Result |
|-------|--------|
| Total Proposals | 60 |
| Unique IDs | 60 (no duplicates) |
| Valid Target Domains | 60/60 ✅ |
| Valid Target Dimensions | 60/60 ✅ |
| Already Existing as Topics | 0/60 ✅ |
| Issues Found | 0 |

### Knowledge Category Distribution

| Category | Count |
|----------|-------|
| QURANIC_EXPLICIT_CONCEPT | 16 |
| QURANIC_THEMATIC_CONCEPT | 39 |
| CONTEMPORARY_APPLICATION | 3 |
| EDITORIAL_EDUCATIONAL_CATEGORY | 2 |
| HADITH_SUNNAH_DERIVED | 0 |
| FIQH_SCHOLARLY_CONCEPT | 0 |
| ISLAMIC_HISTORY_OR_CIVILIZATION | 0 |

### Recommendation Distribution

| Recommendation | Count |
|----------------|-------|
| ACCEPT_FOR_FUTURE_REVIEW | 60 |

All 60 proposals are structurally valid with correct domain/dimension references and unique IDs.

---

## 6. Relationship Integrity

All **150 relationships** were validated.

### Validation Results

| Check | Result |
|-------|--------|
| Total Relationships | 150 |
| Valid | 150 ✅ |
| Invalid | 0 ✅ |
| Self-References | 0 ✅ |
| Duplicate Pairs | 0 ✅ |
| Invalid Types | 0 ✅ |
| Missing Endpoints | 0 ✅ |

### Relationship Type Breakdown

- **CONTAINS:** 99 relationships (Domain→Dimension hierarchy)
- **CROSS_REFERENCES:** 42 relationships (cross-domain topic links)
- **SHARES_CONCEPT:** 9 relationships (thematic cross-cutting themes)

All relationship endpoints exist in the taxonomy entity set. All types are valid. No self-references or duplicates found.

---

## 7. Cross-Report Inconsistency Detection

**7 inconsistencies** found between MFD-09.1 JSON reports and actual source data.

| # | Dimension | Issue |
|---|-----------|-------|
| 1 | salah-prayer | MFD-09.1 includes `remembrance-forgetfulness` not in dimensions.json |
| 2 | moral-virtues | MFD-09.1 includes `balance-moderation`, `trust-responsibility`, `gratitude-ingratitude`, `patience-haste` not in dimensions.json |
| 3 | sincerity-ikhlas | MFD-09.1 includes `ikhlas-sincerity` not in dimensions.json |
| 4 | intellect-reason | MFD-09.1 includes `signs-and-reflection`, `knowledge-ignorance` not in dimensions.json |
| 5 | personal-development | MFD-09.1 includes `trial-and-test` not in dimensions.json |
| 6 | human-rights | MFD-09.1 includes `justice-oppression` not in dimensions.json |
| 7 | quranic-vocabulary | MFD-09.1 includes `quranic-vocabulary` (self-referential topic ID matching dimension ID) not in dimensions.json |

### Root Cause

MFD-09.1's coverage report included topic IDs from the topic-side (topics.json `parentDimensionId` backlinks) that were not listed in the dimension-side (`dimensions.json` `topicIds` arrays). These are the same "extra" topics identified in the 7 discrepancy investigations. MFD-09.1 merged both sides into its `topicIds` list without distinguishing provenance.

---

## 8. Recommendations

### Priority 1 — Critical

1. **Resolve 370 phantom references:** Either create the missing topic records or remove the phantom IDs from `dimensions.json`. This is the most impactful integrity issue.
2. **Reconcile bidirectional mismatches:** For all dimensions where dimension-side ≠ topic-side, decide which side is authoritative and synchronize.

### Priority 2 — High

3. **Fix MFD-09.1 cross-report inconsistencies:** Update MFD-09.1 coverage JSON to clearly distinguish dimension-side vs topic-side topic lists rather than merging them.
4. **Standardize topic counting methodology:** Define whether `topicCount` should reflect dimension-side declarations, topic-side backlinks, or their intersection.

### Priority 3 — Medium

5. **Process 60 accepted proposals:** All proposals are structurally valid and ready for scholarly review and potential creation.
6. **Address the `quranic-vocabulary` self-referential topic:** A topic with ID `quranic-vocabulary` points to dimension `quranic-vocabulary` — determine if this is intentional or a naming collision.

---

## 9. Machine-Readable Output

Full structured audit data is available at:  
`data/audit/mfd-09-2-taxonomy-integrity.json`

Schema:
```json
{
  "entityCounts": { "domains", "dimensions", "subdimensions", "topics", "relationships" },
  "bidirectionalCoverage": [ /* 103 records */ ],
  "sevenDiscrepancies": [ /* 7 investigation records */ ],
  "topicSideDistribution": { /* 5 categories summing to 103 */ },
  "dimensionSideDistribution": { /* 5 categories summing to 103 */ },
  "phantomReferences": [ /* 370 records */ ],
  "proposalVerification": { "totalCount", "categoryDistribution", "recommendationDistribution", "issues" },
  "relationshipValidation": { "totalValid", "totalInvalid", "issues" },
  "crossReportInconsistencies": [ /* 7 strings */ ],
  "validationPassed": false
}
```

---

*Report generated by MFD-09.2 Taxonomy Integrity Auditor. Files left uncommitted for Lead Orchestrator review.*