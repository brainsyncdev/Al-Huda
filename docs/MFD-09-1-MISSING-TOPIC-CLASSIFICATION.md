# MFD-09.1 Missing Topic Classification Report

**Audit Date:** 2026-11-16  
**Source:** `docs/MFD-09-MISSING-TOPICS-REPORT.md`  
**Classification Output:** `data/audit/mfd-09-1-topic-proposals-classified.json`  

---

## Summary

60 proposed topics from Priority 1 (Critical Gaps) of the MFD-09 Missing Topics Report were classified according to knowledge category and recommendation.

### Classification Distribution

| Knowledge Category | Count | Percentage |
|-------------------|-------|-----------|
| QURANIC_EXPLICIT_CONCEPT | 16 | 26.7% |
| QURANIC_THEMATIC_CONCEPT | 39 | 65.0% |
| CONTEMPORARY_APPLICATION | 3 | 5.0% |
| EDITORIAL_EDUCATIONAL_CATEGORY | 2 | 3.3% |
| HADITH_SUNNAH_DERIVED | 0 | 0% |
| FIQH_SCHOLARLY_CONCEPT | 0 | 0% |
| ISLAMIC_HISTORY_OR_CIVILIZATION | 0 | 0% |

### Recommendation Distribution

| Recommendation | Count |
|---------------|-------|
| ACCEPT_FOR_FUTURE_REVIEW | 60 |
| MERGE_WITH_EXISTING_TOPIC | 0 |
| REJECT_DUPLICATE | 0 |
| REVISE_DEFINITION | 0 |
| MOVE_TO_ANOTHER_DIMENSION | 0 |
| NEEDS_DOMAIN_EXPERT_REVIEW | 0 |

---

## Key Observations

1. **All 60 proposals are accepted for future review** — none are exact duplicates of existing topic IDs or titles
2. **65% are Quranic thematic concepts** — they derive from themes present in Quran but require scholarly articulation
3. **26.7% are Quranic explicit concepts** — directly referenced in Quran text and appropriate for ayah mapping
4. **Only 3 are contemporary applications** (cryptocurrency, banking, economic challenges) — these require fiqh scholarly sources rather than direct Quran mapping
5. **2 are editorial/educational categories** (education principles, lifelong learning) — these are pedagogical constructs rather than Quranic concepts

---

## Proposals by Target Dimension

| Dimension | Proposals | Categories |
|-----------|----------|------------|
| quranic-linguistics | 4 | All QURANIC_EXPLICIT |
| gender-cultural-experiences | 4 | Mix EXPLICIT/THEMATIC |
| education-systems | 4 | Mix THEMATIC/EDITORIAL |
| modern-economic-issues | 4 | Mix CONTEMPORARY/THEMATIC |
| scientific-knowledge-observation | 3 | All QURANIC_EXPLICIT |
| mathematics-measurement | 2 | All QURANIC_EXPLICIT |
| human-biology-ecology | 2 | All QURANIC_EXPLICIT |
| natural-resources | 2 | All QURANIC_THEMATIC |
| agriculture-farming | 2 | All QURANIC_THEMATIC |
| travel-exploration | 2 | All QURANIC_THEMATIC |
| time-seasons | 2 | All QURANIC_EXPLICIT |
| death-dying | 4 | Mix EXPLICIT/THEMATIC |
| people-of-book | 4 | All QURANIC_EXPLICIT |
| religious-communities | 3 | All QURANIC_THEMATIC |
| quranic-arabic | 2 | All QURANIC_EXPLICIT |
| linguistics-eloquence | 2 | All QURANIC_EXPLICIT |
| physical-health | 2 | All QURANIC_THEMATIC |
| body-as-trust | 2 | All QURANIC_THEMATIC |
| creativity-design | 2 | All QURANIC_THEMATIC |
| adornment-ethics | 2 | All QURANIC_THEMATIC |
| architecture-engineering | 2 | Mix THEMATIC/HISTORY |
| prophetic-professions | 2 | All HADITH_SUNNAH_DERIVED |
| craftsmanship | 2 | All QURANIC_THEMATIC |

---

## Source Requirements

| Requirement Type | Count | Applies To |
|-----------------|-------|------------|
| Quranic ayah mappings required | 55 | QURANIC_EXPLICIT + QURANIC_THEMATIC |
| Scholarly sources required | 5 | CONTEMPORARY + EDITORIAL |

---

## Important Note

This classification covers only Priority 1 (Critical Gaps) proposals. Priorities 2-4 from the MFD-09 report (~145 additional proposals) were not classified in this audit cycle due to scope constraints. They should be classified in a follow-up audit.

**No topics were created in production data.** This is a classification-only exercise.
