# MFD-11.1 — Gap Audit Batch 5

**Generated:** 2026-11-20
**Scope:** Elderly Care (`elderly-care`)
**Status:** AI-assisted analysis, pending scholarly review
**HEAD:** bd34760

---

## 3. Elderly Care (`elderly-care`)

### Topic Definition (Production)
- **Title:** Elderly Care
- **Urdu Title:** بزرگوں کی خدمت
- **Arabic Title:** رعاية المسنين
- **Scope:** Service, respect, dignity
- **Description:** Caring for elderly parents and relatives
- **Parent Domain:** family-relationships
- **Parent Dimension:** parents-elderly-care
- **Related Topics:** mother-rights, old-age-wisdom
- **Search Aliases:** elderly parents
- **Specialized:** false
- **Provenance:** pending-scholarly-review
- **Existing production mappings:** 3 (map-elderly-care-0505 → 17:23, map-elderly-care-0506 → 17:23, map-elderly-care-0507 → 16:70)
- **Sibling topics in same dimension:** mother-rights (3 mappings), father-rights (3 mappings)
- **Note:** `respecting-parents` does NOT exist in the taxonomy (184 topics). The dimension `parents-elderly-care` contains only mother-rights, father-rights, and elderly-care.

### Evidence Found in Extractions
- **Grep matches for elderly/old-age keywords:** 52 across 20+ extraction files
- **Candidates mapping to `elderly-care`:** 0 (zero)
- **Candidates mapping to `old-age-wisdom`:** 1 (cand-0662 → 16:70)
- **Candidate covering 17:23:** cand-0682 maps to `parents-and-family` + `good-character`, NOT `elderly-care`
- **All 3 production mappings have status:** `no-candidate-coverage` in missing-mappings.json

**Distinct verse keys with elderly/old-age evidence in extractions:**
| Verse Key | Extraction Content | Currently Mapped To |
|---|---|---|
| 17:23-24 | Parental kindness decreed alongside tawheed; speech-nobility and non-repulsion in old age | cand-0682 → parents-and-family, good-character |
| 16:70 | Human lifecycle reversal: reversed to decrepit old age knowing nothing after having known | cand-0662 → old-age-wisdom, divine-knowledge |
| 22:5 | Life stages from dust to maturity to decrepit old age as resurrection sign | Not mapped to elderly-care |
| 30:54 | Weakness-strength-weakness-white hair cycle demonstrating divine creative sovereignty | Not mapped to elderly-care |
| 36:68 | Reversed in creation for those granted long life | Not mapped to elderly-care |
| 46:15 | Forty years maturity; gratitude for self and parents; righteous offspring supplication | Not mapped to elderly-care |
| 31:14 | Weakness upon weakness; weaning two years; gratitude to Allah and parents | Not mapped to elderly-care |
| 19:2-15 | Zakariyya's supplication despite old age and barren wife; Yahya granted | Not mapped to elderly-care |
| 14:37 | Ibrahim's praise for granting Ishmael and Isaac in old age | Not mapped to elderly-care |
| 15:54 | Abraham questions glad tidings given advanced old age | Not mapped to elderly-care |
| 51:29 | Wife's alarm at son announcement despite barrenness and old age | Not mapped to elderly-care |
| 12:78 | Brothers plead Yusuf's father is an old man (shaykh kabir) | Not mapped to elderly-care |
| 28:23 | Two women at Madyan well; father is an old man | Not mapped to elderly-care |
| 24:60 | Post-menstrual women's clothing relaxation | Not mapped to elderly-care |
| 40:67 | Staged creation from dust through old age to appointed term | Not mapped to elderly-care |

### Key Qur'anic Passages Identified

| Passage | Arabic Term | Content Type | Belongs To | Extraction Status |
|---|---|---|---|---|
| 17:23-24 | *kibar* (old age), *birr al-wālidayn* | Prescriptive: parental kindness when aged | **Parental kindness** (not general elderly care) | ✅ Extracted (cand-0682) |
| 46:15 | *balagha ashuddahu* (reached maturity), forty years | Prescriptive: gratitude to parents at maturity | **Parental kindness** + life-stage reflection | ✅ Extracted |
| 31:14 | *waṣṣaynā al-insāna bi-wālidayhi* | Prescriptive: goodness to parents | **Parental kindness** | ✅ Extracted |
| 16:70 | *ardhal al-ʿumur* (most decrepit age) | Descriptive: lifecycle reversal as divine sign | **Creation signs** (not care prescription) | ✅ Extracted (cand-0662) |
| 22:5 | *ardhal al-ʿumur* | Descriptive: life stages proving resurrection | **Creation signs** | ✅ Extracted |
| 30:54 | *ḍaʿf wa-shayb* (weakness and white hair) | Descriptive: weakness-strength-weakness cycle | **Creation signs** | ✅ Extracted |
| 36:68 | *nunakkisu-hu fī al-khalq* (reversed in creation) | Descriptive: longevity as reversal | **Creation signs** | ✅ Extracted |
| 40:67 | *shaykh* (old age stage) | Descriptive: staged creation to appointed term | **Creation signs** | ✅ Extracted |
| 19:2-15 | *kibar* (old age), *ʿitiyy* (extreme old age) | Narrative: Zakariyya's miraculous son despite age | **Prophetic narrative** | ✅ Extracted |
| 14:37 | *ʿalā kibar* (in old age) | Narrative: Ibrahim's gratitude for children in old age | **Prophetic narrative** | ✅ Extracted |
| 12:78 | *shaykh kabīr* (old man) | Narrative: Yusuf's brothers describe father's age | **Prophetic narrative** | ✅ Extracted |
| 28:23 | *shaykh kabīr* (old man) | Narrative: Shu'ayb's daughters describe father | **Prophetic narrative** | ✅ Extracted |
| 24:60 | *al-qawāʿid min al-nisāʾ* (post-menstrual women) | Legal: clothing concession for elderly women | **Legal ruling** (not care prescription) | ✅ Extracted |

### Diagnosis

**EDITORIAL CONSTRUCT + MAPPING GAP.**

The topic `elderly-care` as defined ("Caring for elderly parents and relatives") is **not independently established by the Qur'an as a distinct concept**. The Qur'anic material splits cleanly into three categories:

**(A) Parental kindness when aged** — This is the substance of 17:23-24, 46:15, and 31:14. These verses prescribe *birr al-wālidayn* (goodness to both parents) with old age as the triggering condition. They do NOT establish care for the elderly as a general social class. This material belongs under `mother-rights`, `father-rights`, or a potential `respecting-parents` / `birr-al-walidayn` topic. The sibling audit for `father-rights` already found conflation with birr al-walidayn; `elderly-care` suffers the identical problem.

**(B) Human life-cycle frailty as a sign of Allah** — Verses 16:70, 22:5, 30:54, 36:68, 40:67 describe old age/decrepitude/reversal as *āyāt* (signs) demonstrating divine power over creation. These are theological/cosmological, not ethical prescriptions about caring for anyone. This material correctly maps to `old-age-wisdom` (under `life-stages`) or `creation-signs`.

**(C) Narrative references to aged individuals** — Zakariyya, Ibrahim, Yusuf's father, Shu'ayb. These are story elements, not normative teachings about elderly care.

**Critical finding:** No verse in the Qur'an prescribes care for the elderly *as a general social class beyond parents*. The only prescriptive content (Category A) is specifically about parents. The topic description "Caring for elderly parents and relatives" conflates:
- Parent-specific obligations (which belong to mother-rights/father-rights)
- A modern social-welfare concept (general elderly care) that lacks direct Qur'anic grounding

The 3 production mappings are all orphaned (`no-candidate-coverage`). The candidate covering 17:23 (cand-0682) maps to `parents-and-family` + `good-character`, not `elderly-care`. The candidate covering 16:70 (cand-0662) maps to `old-age-wisdom`, not `elderly-care`. Zero candidates carry `elderly-care` in their `existingOverlap`.

### Recommendation

1. **Deprecate `elderly-care` as a standalone topic.** The Qur'anic evidence does not support it as an independent concept distinct from parental kindness and creation-signs.
2. **Redistribute Category A verses (17:23-24, 46:15, 31:14)** to `mother-rights` and `father-rights` (or create a new `birr-al-walidayn` topic if scholars approve), since these verses address parental kindness specifically.
3. **Retain Category B verses (16:70, 22:5, 30:54, 36:68, 40:67)** under `old-age-wisdom` (life-stages dimension), where cand-0662 already correctly maps 16:70.
4. **Remove the 3 orphaned production mappings** (map-elderly-care-0505, 0506, 0507) from missing-mappings.json after redistribution.
5. **If `elderly-care` is retained for pastoral/practical reasons**, redefine its scope explicitly as "Qur'anic guidance on treating aging parents with dignity" and add it as a cross-reference alias to the parent-topic rather than a primary topic. Mark it `specialized: true` and note that general elderly care beyond parents derives from hadith and fiqh, not direct Qur'anic text.
6. **Resolve the `respecting-parents` gap:** The dimension `parents-elderly-care` lacks a unifying topic for birr al-walidayn. Consider creating `respecting-parents` or `birr-al-walidayn` to absorb the shared parental-kindness material currently scattered across mother-rights, father-rights, and elderly-care.

### Scholarly Review Required

- Whether `elderly-care` should be deprecated entirely or redefined with a narrower parental-only scope
- Whether 17:23-24 constitutes a distinct "elderly care" obligation or is simply the contextual application of birr al-walidayn when parents reach old age
- Whether any hadith or fiqh sources establish general elderly care (beyond parents) as a Qur'an-adjacent obligation that justifies retaining the topic
- Whether the dimension `parents-elderly-care` should be renamed to `birr-al-walidayn` to accurately reflect its Qur'anic content
- Whether `old-age-wisdom` (life-stages) adequately covers the creation-sign verses, or whether a separate `lifecycle-signs` sub-dimension is warranted
- Resolution of the father-rights / elderly-care overlap identified in the sibling audit

---

*All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"`.*
*AI will never replace scholars. This analysis makes their examination more rigorous, transparent and traceable.*
