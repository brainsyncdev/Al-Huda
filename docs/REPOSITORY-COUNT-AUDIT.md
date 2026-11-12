# Repository Count Audit

**Date:** November 11, 2026  
**Audit Type:** READ-ONLY — No source code modified  
**Baseline:** PRD v4.1 / Sprint 54  
**Purpose:** Establish canonical counts for architecture validation

---

## Executive Summary

This audit establishes the exact canonical counts for Al-Huda's content entities by inspecting the authoritative source files. All counts have been verified against the actual data structures, not grep patterns or documentation references.

**Result:** The architecture reconciliation document (draft v1.0) accurately reported all counts. No discrepancies found.

---

## 1. Curated Topics

### Canonical Source
- **File:** `src/lib/topics/data.ts`
- **Export:** `TOPICS` array (derived from `RAW_TOPICS`)
- **Type:** `Topic[]`

### Count
- **Total topics:** 18
- **Unique slugs:** 18
- **Duplicate slugs:** 0
- **Deprecated/inactive records:** 0

### Topic List
1. `patience` — Patience (الصبر)
2. `gratitude` — Gratitude (الشكر)
3. `trust-in-god` — Trust in God (التوكل)
4. `mercy-and-forgiveness` — Mercy and Forgiveness (الرحمة والمغفرة)
5. `remembrance` — Remembrance (الذكر)
6. `giving` — Giving in the Way of God (الإنفاق)
7. `justice` — Justice (العدل)
8. `parents-and-family` — Parents and Family (الوالدان والأسرة)
9. `hardship-and-ease` — Hardship and Ease (العسر واليسر)
10. `knowledge-and-reflection` — Knowledge and Reflection (العلم والتدبر)
11. `the-hereafter` — The Hereafter (الآخرة)
12. `tawheed` — Divine Oneness (التوحيد)
13. `prayer` — Prayer (الصلاة)
14. `supplication` — Supplication (الدعاء)
15. `god-consciousness` — God-Consciousness (التقوى)
16. `repentance` — Repentance (التوبة)
17. `prophets` — Prophets and Their Stories (الأنبياء)
18. `good-character` — Good Character (الأخلاق)

### Verification Method
- Counted objects in `RAW_TOPICS` array (lines 91-977)
- Each object has a unique `slug` field
- All topics have `reviewState: "reviewed"` and `provenance.status: "pending-scholarly-review"`
- No subtopics counted as independent topics (data model does not define subtopics)

### Cross-Check
- ✅ Matches architecture reconciliation document claim: "18 topics"
- ✅ No discrepancy

---

## 2. Life Dimensions

### Canonical Source
- **File:** `src/lib/explore/dimensions.ts`
- **Export:** `DIMENSIONS` array
- **Type:** `Dimension[]`

### Count
- **Total dimensions:** 15
- **Unique IDs:** 15
- **Duplicate IDs:** 0
- **Deprecated/inactive records:** 0

### Dimension List
1. `spiritual` — Spiritual (روحاني) — PRD §04.3 #1
2. `personal` — Personal (شخصي) — PRD §04.3 #2
3. `family` — Family (أسري) — PRD §04.3 #3
4. `social` — Social (اجتماعي) — PRD §04.3 #4
5. `economic` — Economic (اقتصادي) — PRD §04.3 #5
6. `intellectual` — Intellectual (عقلي) — PRD §04.3 #6
7. `governance` — Governance (سياسي) — PRD §04.3 #7
8. `jihad` — Jihad (جهاد) — PRD §04.3 #8
9. `interfaith` — Interfaith (تعددي) — PRD §04.3 #9
10. `ilm` — Ilm/Knowledge (علم) — PRD §04.3 #10
11. `worship` — Worship and Devotion (عبادة) — PRD §04.3 #11
12. `prophets` — Prophets and Their Stories (الأنبياء) — PRD §04.3 #12
13. `creation` — Creation and Signs in Nature (الخلق) — PRD §04.3 #13
14. `hereafter` — The Hereafter and Resurrection (الآخرة) — PRD §04.3 #14
15. `law` — Law and Legal Obligations (الأحكام) — PRD §04.3 #15

### Verification Method
- Counted objects in `DIMENSIONS` array (lines 99-336)
- Each object has a unique `id` field matching `DimensionId` type
- `DimensionId` union type (lines 24-39) lists exactly 15 identifiers
- File header comment says "Fifteen-dimension taxonomy" (line 1)
- Note: Comment at line 80 says "The ten dimensions from PRD §04.3" but this is outdated; the actual array contains 15

### Cross-Check
- ✅ Matches architecture reconciliation document claim: "15 dimensions"
- ✅ No discrepancy

---

## 3. Domains

### Canonical Source
- **File:** `src/lib/taxonomy/domains.ts`
- **Export:** `DOMAINS` array
- **Type:** `Domain[]`

### Count
- **Total domains:** 14
- **Unique IDs:** 14
- **Duplicate IDs:** 0
- **Deprecated/inactive records:** 0

### Domain List
1. `belief-theology` — Belief and Theology (العقيدة)
2. `worship-practice` — Worship and Spiritual Practice (العبادات)
3. `ethics-character` — Ethics and Character (الأخلاق)
4. `family-relationships` — Family and Relationships (no Arabic)
5. `society-justice` — Society and Justice (العدل)
6. `economic-conduct` — Economic Conduct (no Arabic)
7. `prophets-narratives` — Prophets and Narratives (الأنبياء والقصص)
8. `creation-signs` — Creation and Signs (الآيات)
9. `revelation-guidance` — Revelation and Guidance (no Arabic)
10. `human-experiences` — Human Experiences and Responsibility (no Arabic)
11. `interfaith-communities` — Interfaith and Other Communities (no Arabic)
12. `language-vocabulary` — Language and Vocabulary (no Arabic)
13. `law-obligations` — Law and Obligations (الأحكام)
14. `eschatology-afterlife` — Eschatology and the Afterlife (الآخرة)

### Verification Method
- Counted objects in `DOMAINS` array (lines 103-385)
- Each object has a unique `id` field matching `DomainId` type
- `DomainId` union type (lines 42-56) lists exactly 14 identifiers
- File header comment says "14 broad areas of Quran exploration" (line 1)
- All domains have `provenance.status: "pending-scholarly-review"`

### Cross-Check
- ✅ Matches architecture reconciliation document claim: "14 domains"
- ✅ No discrepancy

---

## 4. Study Journeys

### Canonical Source
- **File:** `src/lib/study-journeys/data.ts`
- **Export:** `JOURNEYS` array
- **Type:** `StudyJourney[]`

### Count
- **Total journeys:** 4
- **Unique journey slugs:** 4
- **Duplicate journey slugs:** 0
- **Total stages:** 20
- **Unique stage IDs:** N/A (stages use `order` field within each journey, not global IDs)
- **Invalid/missing references:** 0

### Journey List
1. **Understanding Tawheed** (`understanding-tawheed`)
   - Dimension: `spiritual`
   - Difficulty: `beginner`
   - Stages: 5
   - Estimated time: 30 minutes

2. **Patience Through Difficulties** (`patience-through-difficulties`)
   - Dimension: `personal`
   - Difficulty: `beginner`
   - Stages: 5
   - Estimated time: 25 minutes

3. **Gratitude and Contentment** (`gratitude-and-contentment`)
   - Dimension: `spiritual`
   - Difficulty: `beginner`
   - Stages: 5
   - Estimated time: 25 minutes

4. **Building a Relationship with Allah** (`building-relationship-with-allah`)
   - Dimension: `spiritual`
   - Difficulty: `intermediate`
   - Stages: 5
   - Estimated time: 40 minutes
   - Prerequisites: `understanding-tawheed`

### Stage Breakdown
Each journey contains exactly 5 stages:
- Journey 1: stages 1-5 (Surah Al-Ikhlas + Ayat al-Kursi)
- Journey 2: stages 1-5 (patience themes from Surah Al-Baqarah + Surah Ash-Sharh)
- Journey 3: stages 1-5 (gratitude themes from various surahs)
- Journey 4: stages 1-5 (divine relationship through tawheed, remembrance, trust, supplication, taqwa)

### Verification Method
- Counted objects in `JOURNEYS` array (lines 35-409)
- Each journey has a unique `slug` field
- Each journey has a `stages` array
- Summed `stages.length` across all journeys: 5 + 5 + 5 + 5 = 20
- All stages have valid `ref` (ayah reference) or `topicSlug` fields
- No orphaned or invalid references found

### Cross-Check
- ✅ Matches architecture reconciliation document claim: "4 journeys, 20 stages"
- ✅ No discrepancy

---

## 5. Discrepancy Resolution

### Original Issue
The initial grep-based count reported:
- Topics: 21 slugs (incorrect)
- Dimensions: 18 slugs (incorrect)
- Domains: 18 slugs (incorrect)
- Journeys: 21 slugs (incorrect)

### Root Cause
The grep pattern `slug:` matched **all** slug occurrences in the files, including:
- Topic slugs referenced in dimension `topicSlugs` arrays
- Journey slugs referenced in prerequisite arrays
- Stage-level references (though stages use `order`, not `slug`)
- Type definitions and helper functions

### Resolution
Direct inspection of the canonical arrays (`TOPICS`, `DIMENSIONS`, `DOMAINS`, `JOURNEYS`) provides the authoritative counts. These arrays contain only the top-level entity definitions, not references or nested structures.

### Final Verified Counts
| Category | Canonical Count | Source File | Verification Status |
|----------|----------------:|-------------|---------------------|
| Topics | 18 | `src/lib/topics/data.ts` | ✅ Verified |
| Dimensions | 15 | `src/lib/explore/dimensions.ts` | ✅ Verified |
| Domains | 14 | `src/lib/taxonomy/domains.ts` | ✅ Verified |
| Study Journeys | 4 | `src/lib/study-journeys/data.ts` | ✅ Verified |
| Journey Stages | 20 | `src/lib/study-journeys/data.ts` | ✅ Verified |

---

## 6. Data Integrity Observations

### Provenance Status
- **Topics:** All 18 topics have `provenance.status: "pending-scholarly-review"` ✅
- **Dimensions:** All 15 dimensions inherit `DIMENSION_PROVENANCE` with `status: "pending-scholarly-review"` ✅
- **Domains:** All 14 domains inherit `DOMAIN_PROVENANCE` with `status: "pending-scholarly-review"` ✅
- **Journeys:** All 4 journeys inherit `JOURNEY_PROVENANCE` with `status: "pending-scholarly-review"` ✅

### Editorial Review State
- **Topics:** All 18 topics have `reviewState: "reviewed"` (editorial workflow state, not scholarly certification)
- **Dimensions:** Not applicable (navigation aids, not scholarly classifications)
- **Domains:** Not applicable (organizational proposal, not approved taxonomy)
- **Journeys:** Not applicable (structured learning experiences, not scholarly content)

### Cross-References
- Dimensions reference topic slugs in `topicSlugs` arrays (editorial navigation, not ayat-level tagging)
- Journeys reference topic slugs in stage `topicSlug` fields (optional, for lateral navigation)
- Journeys reference other journey slugs in `prerequisites` arrays (learning path dependencies)
- All cross-references use valid slugs that exist in the canonical arrays

---

## 7. Audit Script Verification

### Existing Audit Scripts
The following audit scripts validate these counts:

1. **`scripts/audit-topic-quality-54.mjs`** — Validates topic structure and provenance
2. **`scripts/audit-journey-quality-54.mjs`** — Validates journey structure and stage completeness
3. **`scripts/audit-study-journeys.mjs`** — Validates all journeys are well-formed
4. **`scripts/audit-quranic-taxonomy.mjs`** — Validates taxonomy integrity

### Audit Results
All audit scripts exit 0, confirming:
- No structural violations
- No missing required fields
- No invalid cross-references
- Provenance metadata intact

---

## 8. Conclusion

The repository contains:
- **18 curated topics** (all pending scholarly review)
- **15 life dimensions** (editorial navigation aids)
- **14 domains** (organizational proposal)
- **4 study journeys** with **20 total stages** (structured learning experiences)

All counts match the architecture reconciliation document. No discrepancies exist between the document and the repository.

**Audit Status:** ✅ COMPLETE  
**Discrepancies:** None  
**Data Integrity:** Verified  
**Ready for Architecture Validation:** Yes

---

**Audit performed by:** Automated quality review  
**Date:** November 11, 2026  
**Method:** Direct inspection of canonical source files  
**Scope:** READ-ONLY — no modifications made
