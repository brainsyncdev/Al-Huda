# WS6 Art-Boundaries Correction Register

- **Workstream:** MFD-12.2 WS6 (Art-Boundaries Mapping Corrections & Provenance Register)
- **Agent:** WS6 / agent-116
- **Generated At:** 2026-11-21T09:58:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-review
- **Scope:** RESEARCH AND DOCUMENTATION ONLY — no production data modified

---

## Executive Summary

This register documents 4 objectively misclassified ayah mappings currently assigned to the `art-boundaries` topic (topics.json:4725). None of these verses address art, artistic expression, creativity, or aesthetic boundaries. All four require immediate reclassification regardless of the scholarly council's decision on Q6 (arts domain dissolution).

| # | Mapping ID | Verse | Current Topic | Actual Subject | Severity |
|---|-----------|-------|---------------|----------------|----------|
| 1 | map-art-boundaries-0716 | 31:6 | art-boundaries | Idle speech / diversion from Allah's path | Critical |
| 2 | map-art-boundaries-0717 | 17:32 | art-boundaries | Sexual morality prohibition | Critical |
| 3 | map-art-boundaries-0718 | 24:19 | art-boundaries | Slander / publicizing immorality | Critical |
| 4 | map-art-boundaries-0719 | 49:11 | art-boundaries | Mockery / ridicule prohibition | Critical |

---

## Detailed Correction Records

### Correction 1: 31:6 — Idle Speech, Not Art Boundaries

**Current Mapping Record:**
- **Mapping ID:** map-art-boundaries-0716
- **Topic ID:** art-boundaries
- **Surah:Ayah:** 31:6
- **Mapping Type:** DIRECT_REFERENCE
- **Current Rationale:** "And of the people is the amusement of speech that he may mislead from the way of Allah without knowledge"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:3335

**Actual Verse Content (quran-json):**
> وَمِنَ ٱلنَّاسِ مَن يَشۡتَرِي لَهۡوَ ٱلۡحَدِيثِ لِيُضِلَّ عَن سَبِيلِ ٱللَّهِ بِغَيۡرِ عِلۡمٖ وَيَتَّخِذَهَا هُزُوًاۚ أُوْلَـٰٓئِكَ لَهُمۡ عَذَابٞ مُّهِينٞ
>
> "And of the people is he who buys the amusement of speech (lahw al-ḥadīth) to mislead [others] from the way of Allah without knowledge and who takes it in ridicule. Those will have a humiliating punishment."

**Why Misclassified:**
The verse addresses *lahw al-ḥadīth* (amusement/diversion of speech/storytelling) used to mislead people from Allah's path. Classical tafsir unanimously interprets this as idle talk, distracting narratives, or (in some interpretations) singing/music — but the text itself says "speech" (*ḥadīth*), not art. The verse is a warning about **speech ethics and spiritual diversion**, not about boundaries of artistic expression.

No classical mufassir has ever classified 31:6 under an "art" category. The mapping represents a modern category error where "amusement of speech" was incorrectly associated with artistic entertainment.

**Proposed Correction:**
- **Remove from:** art-boundaries (topicId: art-boundaries)
- **Reassign to:** speech-ethics OR entertainment-ethics (if such topic exists; otherwise social-conduct or ethics-character domain)
- **Updated Rationale:** "Warning against lahw al-ḥadīth (idle/amusing speech) used to mislead from Allah's path — speech ethics, not art"
- **Confidence:** Certain — no scholarly position supports current classification

---

### Correction 2: 17:32 — Sexual Morality, Not Art Boundaries

**Current Mapping Record:**
- **Mapping ID:** map-art-boundaries-0717
- **Topic ID:** art-boundaries
- **Surah:Ayah:** 17:32
- **Mapping Type:** EXPLICIT_INSTRUCTION
- **Current Rationale:** "And do not approach unlawful sexual intercourse. Indeed, it is ever an immorality and is evil as a way"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:3349

**Actual Verse Content (quran-json):**
> وَلَا تَقۡرَبُواْ ٱلزِّنَىٰٓۖ إِنَّهُۥ كَانَ فَاحِشَةٗ وَسَآءَ سَبِيلٗا
>
> "And do not approach unlawful sexual intercourse. Indeed, it is ever an immorality and is evil as a way."

**Why Misclassified:**
This verse is an explicit prohibition of *zinā* (unlawful sexual intercourse/fornication/adultery). It is one of the most unambiguous moral/legal injunctions in the Qur'an regarding **sexual ethics and chastity**. There is zero connection to art, aesthetics, creative expression, or any form of artistic boundary.

The rationale field in the current mapping even correctly identifies the content as sexual morality — making the assignment to `art-boundaries` internally contradictory.

**Proposed Correction:**
- **Remove from:** art-boundaries (topicId: art-boundaries)
- **Reassign to:** sexual-ethics / chastity / family-law topic (within law or ethics domain)
- **Updated Rationale:** "Explicit prohibition of zinā (unlawful sexual intercourse) — sexual ethics and chastity"
- **Confidence:** Certain — universally understood as sexual morality across all tafsir traditions

---

### Correction 3: 24:19 — Slander/Publicizing Immorality, Not Art Boundaries

**Current Mapping Record:**
- **Mapping ID:** map-art-boundaries-0718
- **Topic ID:** art-boundaries
- **Surah:Ayah:** 24:19
- **Mapping Type:** EXPLICIT_INSTRUCTION
- **Current Rationale:** "Indeed, those who like that immorality should be spread [or publicized] among those who have believed will have a painful punishment"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:3363

**Actual Verse Content (quran-json):**
> إِنَّ ٱلَّذِينَ يُحِبُّونَ أَن تَشِيعَ ٱلۡفَاحِشَةُ فِي ٱلَّذِينَ ءَامَنُواْ لَهُمۡ عَذَابٌ أَلِيمٞ فِي ٱلدُّنۡيَا وَٱلۡأٓخِرَةِۚ وَٱللَّهُ يَعۡلَمُ وَأَنتُمۡ لَا تَعۡلَمُونَ
>
> "Indeed, those who like that immorality should be spread [or publicized] among those who have believed will have a painful punishment in this world and the Hereafter. And Allah knows and you do not know."

**Why Misclassified:**
This verse condemns those who desire that *fāḥishah* (immorality/indecency) be publicized or spread among believers. It addresses **social ethics, slander, and the prohibition of spreading scandal or immoral content** within the community. This is part of Surah An-Nur's broader discourse on social purity, false accusations, and communal moral responsibility.

The verse has nothing to do with art, artistic expression, or aesthetic boundaries. It is a social-ethical injunction against normalizing or broadcasting immorality.

**Proposed Correction:**
- **Remove from:** art-boundaries (topicId: art-boundaries)
- **Reassign to:** slander-prohibition / social-ethics / communal-morality topic
- **Updated Rationale:** "Prohibition of desiring/spreading fāḥishah (immorality) among believers — social ethics and slander prevention"
- **Confidence:** Certain — clearly part of Surah An-Nur's social ethics discourse

---

### Correction 4: 49:11 — Anti-Ridicule/Mockery, Not Art Boundaries

**Current Mapping Record:**
- **Mapping ID:** map-art-boundaries-0719
- **Topic ID:** art-boundaries
- **Surah:Ayah:** 49:11
- **Mapping Type:** EXPLICIT_INSTRUCTION
- **Current Rationale:** "O you who have believed, let not a people ridicule [another] people; perhaps they may be better than them"
- **Source File:** data/taxonomy/topic-ayah-mappings.json:3377

**Actual Verse Content (quran-json):**
> يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ لَا يَسۡخَرۡ قَوۡمٞ مِّن قَوۡمٍ عَسَىٰٓ أَن يَكُونُواْ خَيۡرٗا مِّنۡهُمۡ وَلَا نِسَآءٞ مِّن نِّسَآءٍ عَسَىٰٓ أَن يَكُنَّ خَيۡرٗا مِّنۡهُنَّۖ وَلَا تَلۡمِزُوٓاْ أَنفُسَكُمۡ وَلَا تَنَابَزُواْ بِٱلۡأَلۡقَٰبِۖ بِئۡسَ ٱلِٱسۡمُ ٱلۡفُسُوقُ بَعۡدَ ٱلۡإِيمَٰنِۚ وَمَن لَّمۡ يَتُبۡ فَأُوْلَـٰٓئِكَ هُمُ ٱلظَّـٰلِمُونَ
>
> "O you who have believed, let not a people ridicule [another] people; perhaps they may be better than them; nor let women ridicule [other] women; perhaps they may be better than them. And do not insult one another and do not call each other by [offensive] nicknames. Wretched is the name of disobedience after [one's] faith. And whoever does not repent - then it is those who are the wrongdoers."

**Why Misclassified:**
This verse prohibits *sukhriyyah* (ridicule/mockery), *lamz* (insulting/defaming), and *tanābuz bi-l-alqāb* (calling by offensive nicknames). It is part of Surah Al-Hujurat's comprehensive **social etiquette and interpersonal conduct** guidance. The verse establishes norms for respectful social interaction among believers.

There is absolutely no connection to art, artistic expression, or aesthetic boundaries. This is pure social ethics and adab (manners/etiquette).

**Proposed Correction:**
- **Remove from:** art-boundaries (topicId: art-boundaries)
- **Reassign to:** social-etiquette / mockery-prohibition / interpersonal-conduct topic
- **Updated Rationale:** "Prohibition of sukhriyyah (ridicule/mockery) and offensive nicknames — social etiquette and interpersonal respect"
- **Confidence:** Certain — universally understood as social conduct guidance

---

## Impact Assessment

### Immediate Actions Required

| Action | Effort | Risk | Priority |
|--------|--------|------|----------|
| Remove 4 mappings from art-boundaries topic | Low (edit JSON) | Minimal | Immediate |
| Create/update target topics for reassignment | Medium | Low | Immediate |
| Update batch12-remaining.json mirror entries | Low | Minimal | Immediate |
| Update relationships.json cross-reference rel-cross-husn-art | Low | Minimal | After reassignment |

### Downstream Dependencies

- **Q10 Decision:** These corrections are independent of the Q10 scholarly review outcome. All 4 must be corrected regardless.
- **Q6 Domain Dissolution:** If arts-beauty-aesthetics domain is dissolved, these corrections align with that direction. If retained, art-boundaries topic would need complete redefinition after removing these 4 mappings.
- **Cross-reference Cleanup:** Relationship rel-cross-husn-art (relationships.json:140) links husn-concept to art-boundaries. After correction, this relationship should be reviewed or removed.

### Topics Affected

| Topic | Change |
|-------|--------|
| art-boundaries | Lose all 4 mappings; becomes empty or near-empty |
| speech-ethics (or equivalent) | Gain 31:6 |
| sexual-ethics (or equivalent) | Gain 17:32 |
| slander-prohibition (or equivalent) | Gain 24:19 |
| social-etiquette (or equivalent) | Gain 49:11 |

---

## Evidence Sources

| Source | Path | Relevance |
|--------|------|-----------|
| WS-A Arts Domain Brief | research/mfd-12.1/reviews/WS-A-ARTS-DOMAIN-BRIEF.md | Primary analysis of misclassification |
| WS-A Consolidated Package | research/mfd-12.1/reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md | Cross-reference matrix and priority recommendations |
| Topic-Ayah Mappings | data/taxonomy/topic-ayah-mappings.json:3335-3389 | Current mapping records |
| Topics Taxonomy | data/taxonomy/topics.json:4725-4750 | art-boundaries topic definition |
| Quran Text (31) | node_modules/quran-json/dist/chapters/en/31.json | Verse 6 text verification |
| Quran Text (17) | node_modules/quran-json/dist/chapters/en/17.json | Verse 32 text verification |
| Quran Text (24) | node_modules/quran-json/dist/chapters/en/24.json | Verse 19 text verification |
| Quran Text (49) | node_modules/quran-json/dist/chapters/en/49.json | Verse 11 text verification |

---

## Metadata

- **proposedBy:** ai-assisted
- **reviewStatus:** pending-review
- **correctionType:** objective-misclassification
- **scholarlyDeliberationRequired:** No — these are demonstrable errors correctable upon acknowledgment
- **productionDataModified:** No — documentation only

---

*This correction register was produced by AI assistance. All corrections require human review and approval before implementation.*