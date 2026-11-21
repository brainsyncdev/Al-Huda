# WS6 Cross-Cutting Corrections: Q9 Sub-Question & Q1 Root Attribution

- **Workstream:** MFD-12.2 WS6 (Art-Boundaries Mapping Corrections & Provenance Register)
- **Agent:** WS6 / agent-116
- **Generated At:** 2026-11-21T09:59:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-review
- **Scope:** RESEARCH AND DOCUMENTATION ONLY — no production data modified

---

## Executive Summary

This document records two additional cross-cutting taxonomy corrections identified in MFD-12.1 WS-A that require immediate attention alongside the art-boundaries corrections:

1. **Q9 Sub-question:** Verses 5:1 and 16:91 mapped under `peace-agreements` use the ʿ-h-d root (covenant/oath), not s-l-m (peace). They belong under a covenant/treaty-fulfillment topic.
2. **Q1 Cross-cutting:** Verse 13:28 mapped under `nafs-mutmainna` applies the ṭ-m-n root to *qalb* (heart), not *nafs* (self/soul). It belongs under qalb-purification or heart-tranquility.

Both are objective lexical attribution errors that can be corrected without scholarly deliberation.

---

## Correction A: Q9 Sub-Question — Covenant Verses Misattributed to Peace Agreements

### Background

The `peace-agreements` topic (topics.json:4664) currently contains 6 mappings (map-peace-agreements-0704 through 0709). Two of these — 5:1 and 16:91 — use the Arabic root ʿ-h-d (ع-ه-د, covenant/oath/pledge) rather than s-l-m (س-ل-م, peace/safety/submission). While covenants and peace agreements overlap conceptually, the taxonomic principle of lexical fidelity requires separating them.

### Affected Mappings

#### Mapping A1: 5:1

**Current Record:**
- **Mapping ID:** map-peace-agreements-0708
- **Topic ID:** peace-agreements
- **Surah:Ayah:** 5:1
- **Mapping Type:** EXPLICIT_INSTRUCTION
- **Current Rationale:** "O you who have believed, fulfill [all] contracts"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:3223

**Actual Verse Content (quran-json):**
> يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓاْ أَوۡفُواْ بِٱلۡعُقُودِ
>
> "O you who have believed, fulfill [all] contracts (al-ʿuqūd)."

**Lexical Analysis:**
The key term is *al-ʿuqūd* (العقود), plural of *ʿaqd* (عقد), from the root ʿ-q-d (ع-ق-د) meaning "to tie, bind, contract." This is closely related to ʿ-h-d (ع-ه-د) in the semantic field of covenant/obligation. The verse commands fulfillment of **contracts/covenants generally** — not specifically peace treaties.

**Why Misclassified:**
The verse addresses general contract/covenant fulfillment (*ʿuqūd*), which encompasses commercial contracts, marriage contracts, treaties, oaths, and all binding agreements. Classifying it narrowly under "peace agreements" is both lexically inaccurate (no s-l-m root present) and semantically too narrow.

**Proposed Correction:**
- **Remove from:** peace-agreements (topicId: peace-agreements)
- **Reassign to:** covenant-fulfillment / treaty-fulfillment / oath-keeping topic
- **Note:** If a dedicated `treaty-fulfillment` topic already exists (listed as relatedTopicIds in peace-agreements), this mapping should move there. Otherwise, create a new `covenant-obligation` topic.
- **Updated Rationale:** "Command to fulfill all ʿuqūd (contracts/covenants) — general covenant obligation, not specifically peace treaties"

#### Mapping A2: 16:91

**Current Record:**
- **Mapping ID:** map-peace-agreements-0709
- **Topic ID:** peace-agreements
- **Surah:Ayah:** 16:91
- **Mapping Type:** EXPLICIT_INSTRUCTION
- **Current Rationale:** "And fulfill the covenant of Allah when you have taken it, and do not break oaths after their confirmation"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:3237

**Actual Verse Content (quran-json):**
> وَأَوۡفُواْ بِعَهۡدِ ٱللَّهِ إِذَا عَٰهَدتُّمۡ وَلَا تَنقُضُواْ ٱلۡأَيۡمَٰنَ بَعۡدَ تَوۡكِيدِهَا وَقَدۡ جَعَلۡتُمُ ٱللَّهَ عَلَيۡكُمۡ كَفِيلًاۚ إِنَّ ٱللَّهَ يَعۡلَمُ مَا تَفۡعَلُونَ
>
> "And fulfill the covenant of Allah (ʿahd Allāh) when you have taken it, and do not break oaths after their confirmation while you have made Allah your surety. Indeed, Allah knows what you do."

**Lexical Analysis:**
The key terms are *ʿahd Allāh* (عَهْدِ ٱللَّهِ, covenant of Allah) from root ʿ-h-d, and *al-aymān* (الأيمان, oaths) from root y-m-n. Both are firmly in the covenant/oath semantic field, not the peace/safety field.

**Why Misclassified:**
The verse explicitly uses *ʿahd* (covenant) and *aymān* (oaths), commanding their fulfillment. While covenant-keeping supports peace, the verse's primary subject is **covenant fidelity and oath integrity** as moral obligations to Allah, not interstate peace agreements.

**Proposed Correction:**
- **Remove from:** peace-agreements (topicId: peace-agreements)
- **Reassign to:** covenant-fulfillment / oath-keeping topic (same destination as 5:1)
- **Updated Rationale:** "Command to fulfill ʿahd Allāh (covenant of Allah) and maintain confirmed oaths — covenant fidelity, not peace treaties"

### Remaining Valid Peace-Agreements Mappings

After removing 5:1 and 16:91, the following 4 mappings remain correctly classified under peace-agreements:

| Mapping ID | Verse | Root Present | Justification |
|-----------|-------|-------------|---------------|
| map-peace-agreements-0704 | 8:61 | s-l-m (salām) | "If they incline to peace (salām)..." |
| map-peace-agreements-0705 | 9:4 | ʿ-h-d (but treaty context) | Treaty with polytheists — borderline but acceptable |
| map-peace-agreements-0706 | 9:7 | ʿ-h-d (but treaty context) | Treaty at Masjid al-Haram — borderline but acceptable |
| map-peace-agreements-0707 | 47:35 | s-l-m context | "Do not call for peace..." — war/peace strategic context |

**Note:** Mappings 9:4 and 9:7 also use ʿ-h-d root but are in explicit treaty/war-context passages where peace-agreement classification is defensible. These could be flagged for future review but do not require immediate correction.

---

## Correction B: Q1 Cross-Cutting — Heart Tranquility Misattributed to Nafs

### Background

The `nafs-mutmainna` topic (topics.json:2115) currently contains 2 mappings:
- map-nafs-mutmainna-0310 → 89:27-30 (correctly attributed)
- map-nafs-mutmainna-0311 → 13:28 (incorrectly attributed)

Verse 13:28 uses the ṭ-m-n root applied to *qulūb* (hearts), not *nafs* (self/soul). This is a root-attribution error.

### Affected Mapping

**Current Record:**
- **Mapping ID:** map-nafs-mutmainna-0311
- **Topic ID:** nafs-mutmainna
- **Surah:Ayah:** 13:28
- **Mapping Type:** THEMATIC_REFERENCE
- **Current Rationale:** "Those who have believed and whose hearts find rest in the remembrance of Allah"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:7115

**Actual Verse Content (quran-json):**
> ٱلَّذِينَ ءَامَنُواْ وَتَطۡمَئِنُّ قُلُوبُهُم بِذِكۡرِ ٱللَّهِۗ أَلَا بِذِكۡرِ ٱللَّهِ تَطۡمَئِنُّ ٱلۡقُلُوبُ
>
> "Those who have believed and whose hearts (qulūbuhum) find tranquility (tatma'innu) in the remembrance of Allah. Unquestionably, by the remembrance of Allah do hearts (al-qulūb) find tranquility (tatma'innu)."

**Lexical Analysis:**
- **Root:** ṭ-m-n (ط-م-ن) — tranquility, reassurance, settling
- **Subject:** *qulūb* (قُلُوب, hearts) — mentioned twice explicitly
- **Absent:** *nafs* (نَفْس, self/soul) — NOT present in this verse

The term *mutma'inna* (مُطْمَئِنَّة) in the nafs typology derives from 89:27 (*yā ayyatuhā al-nafs al-mutma'innah* — "O reassured soul"), where ṭ-m-n IS applied to nafs. But 13:28 applies the same root to *qalb*, creating a distinct theological concept: **heart-tranquility through dhikr**, not nafs-tranquility as a spiritual station.

**Why Misclassified:**
The nafs-mutmainna topic specifically addresses the *nafs al-mutma'innah* as a stage of spiritual development (the tranquil/reassured self). Verse 13:28 describes *qulūb* finding tranquility through divine remembrance — a different locus (heart vs. self) and a different mechanism (dhikr-induced vs. spiritual maturity). Conflating qalb-tranquility with nafs-mutmainna introduces a Sufi systematization that the verse itself does not support.

**Proposed Correction:**
- **Remove from:** nafs-mutmainna (topicId: nafs-mutmainna)
- **Reassign to:** qalb-purification (topicId: qalb-purification) OR create new topic `qalb-tranquility` / `heart-dhikr`
- **Updated Rationale:** "Hearts (qulūb) finding tranquility (tatma'innu) through dhikr — qalb-tranquility, not nafs-mutmainna spiritual station"
- **Note:** The existing qalb-purification topic (topics.json:2129, map-qalb-purification-0312 at 26:88-89) focuses on the "sound heart" (*qalb salīm*). Adding 13:28 would expand its scope to include heart-tranquility. Alternatively, a dedicated `qalb-tranquility` topic preserves finer granularity.

### Impact on Nafs Typology

After correction, `nafs-mutmainna` retains only 1 mapping (89:27-30), which is the sole Qur'anic occurrence of *nafs mutma'innah*. This aligns with the lexical evidence: the specific phrase appears only once in the Qur'an.

---

## Implementation Priority

| Correction | Priority | Dependency | Effort |
|-----------|----------|------------|--------|
| Art-boundaries (4 mappings) | Immediate | None | Low |
| Q9 Covenant verses (2 mappings) | High | Identify/create target topic | Low-Medium |
| Q1 Heart tranquility (1 mapping) | High | Decide: expand qalb-purification or create new topic | Low-Medium |

All three corrections are independent of each other and can be implemented in parallel.

---

## Evidence Sources

| Source | Path | Relevance |
|--------|------|-----------|
| WS-A Consolidated Package | research/mfd-12.1/reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md | Priority recommendations §Immediate Corrections |
| WS-A Salām/Silm Brief | research/mfd-12.1/reviews/WS-A-SALAM-SILM-BRIEF.md | Q9 root analysis |
| WS-A Nafs Typology Brief | research/mfd-12.1/reviews/WS-A-NAFS-TYPOLOGY-BRIEF.md | Q1 nafs/qalb distinction |
| Topic-Ayah Mappings | data/taxonomy/topic-ayah-mappings.json | Current mapping records |
| Topics Taxonomy | data/taxonomy/topics.json | Topic definitions |
| Quran Text (5) | node_modules/quran-json/dist/chapters/en/5.json | Verse 1 text |
| Quran Text (16) | node_modules/quran-json/dist/chapters/en/16.json | Verse 91 text |
| Quran Text (13) | node_modules/quran-json/dist/chapters/en/13.json | Verse 28 text |

---

## Metadata

- **proposedBy:** ai-assisted
- **reviewStatus:** pending-review
- **correctionType:** lexical-attribution-error
- **scholarlyDeliberationRequired:** No — root attribution is verifiable from primary text
- **productionDataModified:** No — documentation only

---

*This document was produced by AI assistance. All corrections require human review and approval before implementation.*