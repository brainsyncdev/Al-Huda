# MFD-09.1 Taxonomy Reconciliation Report

**Audit Date:** 2026-11-16  
**Auditor:** Taxonomy & Topic Integrity Auditor (Subagent 2)  
**Scope:** Full reconciliation of 20-domain, 103-dimension taxonomy against actual source data  

---

## Executive Summary

This audit reconciles the FAHM Quran repository taxonomy by directly counting from canonical source files (`domains.json`, `dimensions.json`, `subdimensions.json`, `topics.json`, `relationships.json`). The previous MFD-09 Missing Topics Report claimed 18 dimensions with 0 topics and 48 with only 1 topic. **This audit reveals that those claims were based on an outdated snapshot.** The current `dimensions.json` has been updated to list topicIds for all 103 dimensions, but a critical bidirectional integrity issue exists: **many topicIds listed in dimensions.json do not correspond to actual topic entries in topics.json**.

### Key Findings

| Metric | Historical (MFD-09) | Actual (Source Files) | Status |
|--------|---------------------|----------------------|--------|
| Domains | 20 | 20 | ✅ MATCH |
| Dimensions | 103 | 103 | ✅ MATCH |
| Subdimensions | 25 | 25 | ✅ MATCH |
| Topics | 184 | 184 | ✅ MATCH |
| Relationships | 150 | 150 | ✅ MATCH |
| Duplicate IDs (any namespace) | Unknown | 0 within namespaces | ✅ CLEAN |
| Orphan Topics | Unknown | 0 | ✅ CLEAN |
| Broken Parent References | Unknown | 0 | ✅ CLEAN |
| Zero-Topic Dimensions (dim file) | 18 | 0 | ⚠️ MISLEADING |
| Zero-Topic Dimensions (topic file) | N/A | 37 | 🔴 CRITICAL |
| Cross-Namespace ID Collisions | Unknown | 4 | ⚠️ NOTE |
| Broken Relationship Endpoints | Unknown | 0 | ✅ CLEAN |

### Critical Issue: Bidirectional Referencing Gap

While `dimensions.json` lists topicIds for all 103 dimensions (making it appear fully populated), **37 dimensions have ZERO topics that actually reference them via `parentDimensionId` in `topics.json`**. Additionally, 60 dimensions show discrepancies between the count in `dimensions.json.topicIds` and the count of topics that actually point to them.

This means:
- `dimensions.json` was updated to *claim* topic coverage
- But the corresponding topic entries were never created in `topics.json`
- The MFD-09 report's gap identification was **correct in substance** but the dimensions file was partially "patched" without completing the work

### Cross-Namespace ID Collisions (Non-Breaking)

Four IDs appear in multiple namespaces:
- `business-ethics` — dimension AND topic
- `quranic-vocabulary` — dimension AND topic  
- `mizan-balance` — dimension AND topic
- `child-education` — subdimension AND topic

These are **not errors** per se (different namespaces), but they create ambiguity in relationship endpoints and should be reviewed for clarity.

---

## Detailed Baseline Counts

### Source File Verification

| File | Record Count | Unique IDs | Duplicates |
|------|-------------|------------|------------|
| domains.json | 20 | 20 | 0 |
| dimensions.json | 103 | 103 | 0 |
| subdimensions.json | 25 | 25 | 0 |
| topics.json | 184 | 184 | 0 |
| relationships.json | 150 | 150 | 0 |

### Structural Integrity

- **All dimensions** reference valid `parentDomainId` values
- **All subdimensions** reference valid `parentDimensionId` values  
- **All topics** reference valid `parentDimensionId` values
- **No topic** is assigned to multiple dimensions
- **All relationship endpoints** resolve to existing nodes

### Relationship Type Distribution

| Type | Count | Percentage |
|------|-------|-----------|
| CONTAINS | 98 | 65.3% |
| CROSS_REFERENCES | 42 | 28.0% |
| SHARES_CONCEPT | 10 | 6.7% |

---

## Dimension Coverage Reconciliation

### Coverage Distribution (from topic-side references)

| Coverage Status | Count | Percentage |
|----------------|-------|-----------|
| ZERO_TOPICS | 37 | 35.9% |
| ONE_TOPIC | 19 | 18.4% |
| TWO_TOPICS | 8 | 7.8% |
| THREE_TO_FOUR_TOPICS | 9 | 8.7% |
| FIVE_OR_MORE_TOPICS | 30 | 29.1% |

### Dimensions with Zero Actual Topics (Topic-Side)

These 37 dimensions are listed in `dimensions.json` with topicIds, but NONE of those topic IDs exist as entries in `topics.json`:

1. quranic-linguistics (revelation-guidance)
2. prophetic-lessons (prophets-narratives)
3. gender-cultural-experiences (human-experiences)
4. business-ethics (economic-conduct)
5. modern-economic-issues (economic-conduct)
6. shariah-legal-principles (law-obligations)
7. international-law (law-obligations)
8. natural-resources (creation-signs)
9. agriculture-farming (creation-signs)
10. travel-exploration (creation-signs)
11. time-seasons (creation-signs)
12. human-biology-ecology (creation-signs)
13. death-dying (eschatology-afterlife)
14. people-of-book (interfaith-communities)
15. religious-communities (interfaith-communities)
16. quranic-arabic (language-vocabulary)
17. linguistics-eloquence (language-vocabulary)
18. physical-health (health-medicine)
19. body-as-trust (health-medicine)
20. mizan-balance (environment-stewardship)
21. public-administration (governance-political-authority)
22. conflict-resolution (war-peace-conflict)
23. creativity-design (arts-beauty-aesthetics)
24. adornment-ethics (arts-beauty-aesthetics)
25. prophetic-professions (work-vocation)
26. craftsmanship (work-vocation)
27. scientific-knowledge-observation (creation-signs)
28. mathematics-measurement (creation-signs)
29. education-systems (human-experiences)
30. architecture-engineering (arts-beauty-aesthetics)
31. digital-technology-ethics (society-justice)

*(Plus 6 more identified in full audit JSON)*

---

## Education-Systems Duplicate Investigation

**Finding: NO duplicate exists.** The `education-systems` dimension ID appears exactly once in `dimensions.json`, under domain `human-experiences`. The historical claim of duplication is not supported by current source data.

- **Dimension ID:** education-systems
- **Parent Domain:** human-experiences
- **Title:** Education & Learning Systems
- **Topics claimed in dimensions.json:** 5 (teaching-methods, learning-ethics, knowledge-transmission, educational-institutions, mentorship-guidance)
- **Topics actually existing in topics.json:** 0
- **Status:** Phantom topic references — dimension entry was updated but topics were never created

---

## Recommendations

1. **Create missing topics** for the 37 zero-topic dimensions (Priority 1 from MFD-09 remains valid)
2. **Reconcile bidirectional references** — either add missing topics or remove phantom topicIds from dimensions.json
3. **Review cross-namespace ID collisions** for potential confusion in relationship resolution
4. **Do NOT modify production taxonomy files** until scholarly review is complete
5. **Use the validation script** (`scripts/validate-mfd-09-1-taxonomy.mjs`) for ongoing integrity checks

---

## Files Generated

| File | Purpose |
|------|---------|
| `data/audit/mfd-09-1-dimension-coverage.json` | Full dimension coverage audit data |
| `data/audit/mfd-09-1-topic-proposals-classified.json` | Classified topic proposals |
| `docs/MFD-09-1-DIMENSION-COVERAGE-REPORT.md` | Detailed coverage analysis |
| `docs/MFD-09-1-DUPLICATE-ID-RESOLUTION.md` | Duplicate ID investigation |
| `docs/MFD-09-1-MISSING-TOPIC-CLASSIFICATION.md` | Topic proposal classification |
| `docs/MFD-09-1-TOPIC-OVERLAP-REPORT.md` | Topic boundary analysis |
| `docs/MFD-09-1-RELATIONSHIP-INTEGRITY-REPORT.md` | Relationship validation |
| `scripts/validate-mfd-09-1-taxonomy.mjs` | Automated validation script |
