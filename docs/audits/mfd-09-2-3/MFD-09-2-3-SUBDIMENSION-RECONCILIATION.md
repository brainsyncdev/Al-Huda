# MFD-09.2.3 Subdimension Reconciliation Report

**Date:** 2026-11-16  
**Branch:** main  
**HEAD:** 9458f6091c590a460eeb1fef9fe86e13b3f4cd8e  
**Auditor:** dim-scope-auditor (Subagent 1)

---

## Canonical Count

The canonical `subdimensions.json` contains exactly **25 subdimension records**.

### Resolution of 25 vs 26 Discrepancy
The "26" figure reported in previous MFD-09.2.2 artifacts was a stale count. The current authoritative source contains 25 unique subdimension IDs with no duplicates.

---

## Structural Integrity Checks

| Check | Result |
|-------|--------|
| Duplicate subdimension IDs | **None** |
| Missing parent dimensions | **None** — all 25 subdimensions reference valid dimension IDs |
| Dimensions referencing nonexistent subdimensions | **None** — all subdimensionIds in dimensions.json resolve correctly |
| Namespace collisions (subdimension ID = dimension ID) | **None** |
| Namespace collisions (subdimension ID = domain ID) | **None** |

---

## Complete Subdimension Inventory

| # | Subdimension ID | Parent Dimension ID | Topic Count |
|---|----------------|--------------------|-------------|
| 1 | divine-names | allah-divine-attributes | 3 |
| 2 | divine-attributes-categories | allah-divine-attributes | 4 |
| 3 | angels-specific | angels-unseen-world | 5 |
| 4 | jinn-shaytan | angels-unseen-world | 5 |
| 5 | quran-revelation | quran-science | 4 |
| 6 | quran-interpretation | quran-science | 4 |
| 7 | hadith-sciences | sunnah-prophetic-tradition | 4 |
| 8 | sunnah-application | sunnah-prophetic-tradition | 4 |
| 9 | adam-ibrahim-musa | major-prophets-stories | 5 |
| 10 | isa-muhammad | major-prophets-stories | 5 |
| 11 | salah-obligatory | salah-prayer | 4 |
| 12 | salah-voluntary | salah-prayer | 5 |
| 13 | dua-supplication | salah-prayer | 5 |
| 14 | nafs-levels | spiritual-states-nafs | 4 |
| 15 | qalb-heart | spiritual-states-nafs | 4 |
| 16 | marriage-preparation | marriage-nikah | 4 |
| 17 | marriage-ceremony | marriage-nikah | 5 |
| 18 | child-rights | parenting-child-development | 5 |
| 19 | child-education | parenting-child-development | 5 |
| 20 | business-operations | trade-commerce | 5 |
| 21 | market-ethics | trade-commerce | 5 |
| 22 | legal-sources | shariah-legal-principles | 5 |
| 23 | jurisprudence | shariah-legal-principles | 5 |
| 24 | specific-animals | animals-creation | 6 |
| 25 | animal-ethics | animals-creation | 5 |

---

## Parent Dimension Distribution

| Parent Dimension | Subdimension Count |
|-----------------|-------------------|
| allah-divine-attributes | 2 |
| angels-unseen-world | 2 |
| quran-science | 2 |
| sunnah-prophetic-tradition | 2 |
| major-prophets-stories | 2 |
| salah-prayer | 3 |
| spiritual-states-nafs | 2 |
| marriage-nikah | 2 |
| parenting-child-development | 2 |
| trade-commerce | 2 |
| shariah-legal-principles | 2 |
| animals-creation | 2 |

**Dimensions with subdimensions:** 12 out of 103  
**Dimensions without subdimensions:** 91 out of 103

---

## Conclusions

1. The subdimension layer is **structurally complete and consistent**.
2. All 25 subdimensions have valid parent references and topic arrays.
3. No orphaned or dangling subdimension references exist anywhere in the taxonomy.
4. The previous "26" count should be considered deprecated; **25 is canonical**.
