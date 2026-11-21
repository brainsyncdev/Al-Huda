# WS-F: Gloss Prioritization Queue (Q23) — MFD-12.1

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-F (Lexical & Gloss Prioritization) |
| Date | 2026-11-21 |
| Agent | agent-108 (AI-assisted) |
| Question Addressed | Q23 (640 gloss revisions prioritization) |
| Evidence Base | gloss-review-register.json, MFD-11.5-LEXICAL-QUALITY-REPORT.md, root-disagreement-register.json, duplicate-candidate-groups.json |
| Status | RESEARCH ONLY — No production files modified |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |

---

## Executive Summary

This document establishes the prioritized scholarly review queue for the **640 flagged glosses** identified in MFD-11.5 WS4 (gloss-review-register.json). Of 649 total terms, only 9 (1.4%) meet the four-layer adequacy threshold; 640 require remediation.

Prioritization uses a weighted composite score across four axes:
1. **Corpus Frequency** — occurrence count in the Qur'anic text
2. **Theological Significance** — centrality to Islamic creed, law, or spirituality
3. **User-Facing Visibility** — likelihood of encounter by non-specialist users
4. **Dependency on Unresolved Questions** — blocked by Q18–Q22 outcomes

The queue is organized into five tiers, from immediate priority (Tier 1) to deferred (Tier 5).

---

## Scoring Methodology

### Axis Weights

| Axis | Weight | Rationale |
|------|--------|-----------|
| Corpus Frequency (F) | 25% | Higher-frequency terms affect more reading sessions |
| Theological Significance (T) | 35% | FAHM's mission centers on theological education; creedal terms carry disproportionate weight |
| User-Facing Visibility (V) | 20% | Terms appearing in surah names, daily prayers, or common discourse need higher quality |
| Dependency Risk (D) | 20% | Terms blocked by unresolved Q18–Q22 questions should be sequenced AFTER their blockers are resolved |

### Scoring Rubric (1–5 per axis)

#### Frequency (F)
| Score | Occurrences | Count in Register |
|-------|-------------|-------------------|
| 5 | ≥4 | 2 terms |
| 4 | 3 | 11 terms |
| 3 | 2 | 47 terms |
| 2 | 1 (high-profile surah) | ~120 terms |
| 1 | 1 (other) | ~460 terms |

#### Theological Significance (T)
| Score | Category | Examples |
|-------|----------|----------|
| 5 | Core creedal (tawḥīd, prophethood, eschatology, divine attributes) | Allāh, rūḥ, yaqīn, ḥaqq, qadar |
| 4 | Major legal/ethical concepts | jihād, ṣabr, tawakkul, amānah, mīzān |
| 3 | Narrative/significant thematic | nūḥ, naqah, al-fīl, hijrah |
| 2 | Descriptive/contextual | abqārī, aḫinnah, mughīrāt |
| 1 | Grammatical/incidental | particles, rare hapax with no doctrinal weight |

#### User-Facing Visibility (V)
| Score | Criterion | Examples |
|-------|-----------|----------|
| 5 | Surah name OR daily prayer term | al-fātiḥah, al-ʿaṣr, al-falaq, salām |
| 4 | Commonly discussed in sermons/education | fitnah, ghayb, taqwā, shirk |
| 3 | Appears in well-known passages | kun fa-yakūn, al-muddaththir |
| 2 | Specialist interest | morphological forms, rare roots |
| 1 | Obscure/hapax legomenon | iḥn manfūsh, dakkatan dakka |

#### Dependency Risk (D) — INVERTED (lower risk = higher priority score)
| Score | Meaning | Action |
|-------|---------|--------|
| 5 | No dependencies; can be authored immediately | Prioritize |
| 4 | Depends only on Q17 (transliteration) which is resolved | Prioritize after migration |
| 3 | Depends on Q22 (duplicate merge decision) | Wait for Q22 resolution |
| 2 | Depends on Q18 (polysemy structure) or Q19 (root disagreement) | Wait for policy application |
| 1 | Depends on Q21 (slug correction) — root not yet verified | Defer until Tier 1/2 slug fix |

### Composite Priority Score
```
Priority = (F × 0.25) + (T × 0.35) + (V × 0.20) + (D × 0.20)
```
Maximum possible: 5.0. Minimum: 1.0.

---

## Tier Definitions

| Tier | Score Range | Count (Est.) | Scholarly Effort | Timeline |
|------|------------|--------------|------------------|----------|
| **Tier 1: Critical** | 4.0–5.0 | ~15 | Immediate, highest-qualified reviewer | Week 1–2 |
| **Tier 2: High** | 3.0–3.9 | ~45 | Priority batch review | Week 2–4 |
| **Tier 3: Standard** | 2.0–2.9 | ~180 | Systematic batch processing | Month 2–3 |
| **Tier 4: Low** | 1.5–1.9 | ~250 | Bulk processing after Tiers 1–3 | Month 3–5 |
| **Tier 5: Deferred** | 1.0–1.4 | ~150 | Post-Q21/Q22 resolution | Month 5+ |

---

## TIER 1: CRITICAL PRIORITY (Score ≥ 4.0)

These terms combine high frequency, maximum theological significance, and broad user visibility. They must be authored first because they define the quality benchmark for the entire index.

| # | Term Key | Arabic | Occ | Flags | F | T | V | D | Score | Dependencies | Rationale |
|---|----------|--------|-----|-------|---|---|---|---|-------|--------------|-----------|
| 1 | al-ruh | وَٱلرُّوحُ | 3 | EDITORIAL_ONLY, TOO_BROAD, MISSING_TAFSIR_NOTE | 4 | 5 | 5 | 4 | 4.55 | None | "The Spirit" — one of the most theologically debated terms in the Qur'an. Requires extensive tafsīr layer (Tabari, Ibn Kathir, Razi). Central to creedal discussions about Jibril, divine command, and the human soul. |
| 2 | ruh | ٱلرُّوحُ | 2 | EDITORIAL_ONLY, MISSING_TAFSIR_NOTE, TOO_BROAD | 3 | 5 | 5 | 4 | 4.30 | Q22 (merge with al-ruh) | Same theological weight as al-ruh. Pending Q22 merge decision; author unified entry after merge. |
| 3 | haqq | ٱلْحَقُّ | 2 | EDITORIAL_ONLY, MISSING_TAFSIR_NOTE, POLYSEMY_COLLAPSED, TOO_BROAD | 3 | 5 | 5 | 3 | 4.10 | Q22 (merge with al-haqq) | "Truth/Reality" — divine name and epistemological concept. Four distinct senses collapsed. Needs verse-by-verse disambiguation. |
| 4 | al-haqq | بِٱلْحَقِّ | 1 | EDITORIAL_ONLY, TOO_BROAD, MISSING_TAFSIR_NOTE | 2 | 5 | 5 | 3 | 3.85 | Q22 | See haqq above. Merge candidate. |
| 5 | fitnah | فِتْنَةٌ | 3 | EDITORIAL_ONLY, MISSING_TAFSIR_NOTE, POLYSEMY_COLLAPSED, TOO_BROAD | 4 | 5 | 4 | 4 | 4.35 | None | Trial/persecution/sedition — at least 4 distinct Qur'anic senses. Massive tafsīr literature. Frequently misunderstood by modern readers. |
| 6 | jihad | جِهَاد | 2 | EDITORIAL_ONLY, MISSING_TAFSIR_NOTE, POLYSEMY_COLLAPSED, TOO_BROAD | 3 | 5 | 5 | 3 | 4.10 | Q21 (root correction j-h-d confirmed) | Most externally scrutinized Qur'anic term. MFD-11.4 WS2 already analyzed j-h-d vs w-j-h. Needs careful Layer 2 sense enumeration (armed struggle vs spiritual striving vs verbal argumentation). |
| 7 | sultan | سُلْطَان | 4 | EDITORIAL_ONLY, POLYSEMY_COLLAPSED, TOO_BROAD | 5 | 4 | 4 | 4 | 4.25 | Q22 (merge with sultanan) | Highest frequency term (4 occ). Authority/proof/clear case. Needs morphological precision. |
| 8 | furqan | فُرْقَان | 4 | EDITORIAL_ONLY, POLYSEMY_COLLAPSED, TOO_BROAD | 5 | 5 | 4 | 4 | 4.60 | None | "Criterion/Distinction" — second-highest frequency. Theological term for the Qur'an itself and the faculty of discernment. |
| 9 | rahmah | رَحْمَة | 3 | EDITORIAL_ONLY, MISSING_TAFSIR_NOTE, TOO_BROAD | 4 | 5 | 5 | 5 | 4.75 | None | "Mercy" — central divine attribute. No dependencies. Highest composite score. Author first. |
| 10 | tawakkul | تَوَكُّل | 2 | EDITORIAL_ONLY, MISSING_TAFSIR_NOTE, POLYSEMY_COLLAPSED | 3 | 5 | 4 | 5 | 4.20 | None | Reliance on Allah — core spiritual concept. No blockers. |
| 11 | ghayb | غَيْب | 2 | EDITORIAL_ONLY, TOO_BROAD | 3 | 5 | 5 | 5 | 4.50 | None | "The Unseen" — foundational epistemological concept. Defines boundary between human knowledge and divine knowledge. |
| 12 | salam | سَلَام | 2 | EDITORIAL_ONLY, TOO_BROAD | 3 | 4 | 5 | 5 | 4.15 | None | "Peace" — greeting, divine name, eschatological state. High user visibility. |
| 13 | dhikr | ذِكْر | 3 | EDITORIAL_ONLY, TOO_BROAD | 4 | 4 | 5 | 4 | 4.20 | Q22 (merge with dhikr-allah) | Remembrance — central worship practice. |
| 14 | al-yaqin | ٱلْيَقِينُ | 1 | EDITORIAL_ONLY, TOO_BROAD, POLYSEMY_COLLAPSED, MISSING_TAFSIR_NOTE | 2 | 5 | 4 | 3 | 3.65 | Q22 (yaqin group) | Certainty/death — dual meaning requires careful Layer 2 treatment. |
| 15 | kun-fa-yakun | كُن فَيَكُون | 2 | EDITORIAL_ONLY | 3 | 5 | 5 | 5 | 4.50 | None | "Be, and it is" — divine creative command. Maximum theological significance despite low flag count. |

### Tier 1 Notes
- **rahmah** (score 4.75) should be the FIRST gloss authored as a template exemplar for all subsequent work.
- **fitnah** and **jihad** require the most extensive Layer 3 (tafsīr) documentation due to contemporary misappropriation.
- **furqan** and **sultan** have the highest corpus frequency (4 each) and set the standard for handling POLYSEMY_COLLAPSED flags.
- All Tier 1 terms except those depending on Q22 merges can begin IMMEDIATELY.

---

## TIER 2: HIGH PRIORITY (Score 3.0–3.9)

Terms with significant theological weight or high frequency that may have minor dependencies.

| # | Term Key | Arabic | Occ | Primary Flags | Est. Score | Dependencies | Notes |
|---|----------|--------|-----|---------------|------------|--------------|-------|
| 16 | hawa | هَوَى | 3 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.80 | None | Desire/inclination — ethical psychology concept |
| 17 | baghy | بَغْي | 3 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.70 | None | Transgression — legal/ethical boundary term |
| 18 | rijs | رِجْس | 3 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.60 | None | Defilement/impurity — ritual purity concept |
| 19 | jinn | جِنّ | 3 | POLYSEMY_COLLAPSED | 3.80 | None | Creedal entity — requires ontological clarity |
| 20 | nutfah | نُطْفَة | 3 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | Q22 (merge with nutfah-amshaj) | Embryology — science-and-Quran discourse |
| 21 | qard-hasan | قَرْض حَسَن | 3 | TOO_BROAD | 3.40 | None | Goodly loan — economic ethics |
| 22 | zaqqum | زَقُّوم | 3 | (none listed beyond editorial) | 3.50 | None | Eschatological — Hell imagery |
| 23 | noor | نُور | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.70 | None | Light — divine attribute + physical metaphor |
| 24 | waliy | وَلِيّ | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.60 | None | Protector/guardian — theological-political |
| 25 | awliya | أَوْلِيَاء | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | Q22 (merge with walayah) | Plural of waliy |
| 26 | ummah | أُمَّة | 2 | POLYSEMY_COLLAPSED, TOO_BROAD, MISSING_TAFSIR_NOTE | 3.80 | None | Community/nation — sociopolitical concept |
| 27 | sidq | صِدْق | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.40 | None | Truthfulness — ethical virtue |
| 28 | fisq | فِسْق | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | None | Disobedience — legal category |
| 29 | fawz | فَوْز | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.30 | None | Success/triumph — eschatological |
| 30 | millah | مِلَّة | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.40 | None | Religious community — interfaith concept |
| 31 | mathal | مَثَل | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.30 | None | Parable — literary/Quranic method |
| 32 | hafiz | حَافِظ | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.30 | None | Guardian/preserver — divine + human |
| 33 | mizan | مِيزَان | 2 | TOO_BROAD | 3.50 | None | Balance — justice + eschatological |
| 34 | rasul | رَسُول | 2 | TOO_BROAD | 3.60 | Q22 (merge with rasul-karim) | Messenger — prophethood concept |
| 35 | sur | صُور | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | None | Trumpet — eschatological |
| 36 | wizr | وِزْر | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.20 | None | Burden — moral responsibility |
| 37 | shiya- | شِيَع | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.10 | None | Sects/factions — communal division |
| 38 | hizb | حِزْب | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.10 | None | Party/group — political terminology |
| 39 | qadr/qadar | قَدَر/قَدَار | 2+1 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.70 | Q22 | Predestination — creedal pillar |
| 40 | arsh | عَرْش | 2 | TOO_BROAD | 3.60 | Q22 (merge group) | Throne — divine sovereignty |
| 41 | hanif | حَنِيف | 2 | POLYSEMY_COLLAPSED | 3.50 | Q22 (merge haneef group) | Monotheist inclination — Abrahamic identity |
| 42 | hudud-allah | حُدُود اللَّه | 2 | EDITORIAL_ONLY | 3.40 | None | Limits of Allah — legal boundaries |
| 43 | ihram | إِحْرَام | 2 | EDITORIAL_ONLY | 3.30 | None | Pilgrimage state — fiqh concept |
| 44 | naqah | نَاقَة | 2 | TOO_BROAD | 3.00 | Q22 (merge with naqat-allah) | She-camel — prophetic narrative |
| 45 | muhsin | مُحْسِن | 2 | POLYSEMY_COLLAPSED | 3.20 | Q22 (merge with muhsinin) | Doers of good — ethical category |
| 46 | sultanan | سُلْطَانًا | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | Q22 (merge with sultan) | See sultan |
| 47 | haqq-al-yaqin | حَقّ الْيَقِين | 2 | MISSING_TAFSIR_NOTE | 3.40 | Q22 (yaqin group) | True certainty — epistemological |
| 48 | al-nafs-al-lawwamah | اللَّوَّامَة | 1 | MISSING_TAFSIR_NOTE | 3.60 | None | Reproaching soul — nafs typology (MFD-11.1 Q1) |
| 49 | al-nafs-al-mutma-innah | الْمُطْمَئِنَّة | 1 | MISSING_TAFSIR_NOTE | 3.60 | None | Reassured soul — nafs typology |
| 50 | ahl-al-taqwa | التَّقْوَى | 1 | POLYSEMY_COLLAPSED, MISSING_TAFSIR_NOTE | 3.70 | None | Worthy of taqwa — creedal |
| 51 | shuhh-al-nafs | شُحّ النَّفْس | 2 | MISSING_TAFSIR_NOTE | 3.30 | None | Stinginess of soul — ethical psychology |
| 52 | al-din | الدِّين | 1 | POLYSEMY_COLLAPSED, TOO_BROAD, MISSING_TAFSIR_NOTE | 3.80 | None | Religion/judgement/recompense — multi-sense |
| 53 | al-sabr | الصَّبْر | 1 | TOO_BROAD, MISSING_TAFSIR_NOTE | 3.70 | None | Patience — virtue ethics |
| 54 | ta-wil | تَأْوِيل | 2 | POLYSEMY_COLLAPSED | 3.30 | None | Interpretation — hermeneutics |
| 55 | al-asr | الْعَصْر | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | None | Time/epoch — surah name |
| 56 | al-haqqah | الْحَاقَّة | 1 | MISSING_TAFSIR_NOTE | 3.40 | None | Inevitable Reality — eschatological |
| 57 | al-mujahidoona | الْمُجَاهِدُون | 1 | POLYSEMY_COLLAPSED | 3.50 | Q21 (root j-h-d fixed) | Those who strive — derivative of jihad |
| 58 | al-wasilah | الْوَسِيلَة | 1 | POLYSEMY_COLLAPSED | 3.40 | None | Means of approach — theological |
| 59 | amanah | الْأَمَانَة | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 3.50 | None | Trust — cosmic covenant concept |
| 60 | anfal | أَنْفَال | 1 | POLYSEMY_COLLAPSED | 3.20 | None | Spoils — legal/surah name |

### Tier 2 Notes
- Approximately 25 of these 45 terms depend on Q22 merge decisions. Scholars should author the UNIFIED entry after merges are applied, not individual pre-merge entries.
- Terms 48–49 (nafs types) directly address MFD-11.1 Q1 (nafs typology scholarly question). Their glosses should coordinate with WS-A deliverables.
- **al-din** (score 3.80) has at least 3 distinct Qur'anic senses (religion, judgement day, recompense) and requires the most careful polysemy treatment in this tier.

---

## TIER 3: STANDARD PRIORITY (Score 2.0–2.9)

~180 terms. These include single-occurrence terms with moderate theological significance, terms in well-known surahs, and terms whose flags are primarily TOO_BROAD or EDITORIAL_ONLY without POLYSEMY_COLLAPSED.

### Representative Sample (not exhaustive)

| Term Key | Arabic | Occ | Primary Issue | Est. Score | Notes |
|----------|--------|-----|---------------|------------|-------|
| al-muddaththir | الْمُزَّمِّل | 1 | EDITORIAL_ONLY | 2.80 | Surah name, prophetic narrative |
| al-muzzammil | الْمُدَّثِّر | 1 | EDITORIAL_ONLY | 2.80 | Surah name, prophetic narrative |
| al-duha | الضُّحَى | 1 | EDITORIAL_ONLY | 2.70 | Surah name |
| al-fajr | الْفَجْر | 1 | TOO_BROAD | 2.70 | Surah name |
| al-layl | اللَّيْل | 1 | TOO_BROAD | 2.60 | Surah name |
| al-shams | الشَّمْس | 1 | TOO_BROAD | 2.60 | Surah name |
| al-tin | التِّين | 1 | TOO_BROAD | 2.50 | Surah name, Q19 loanword dispute |
| al-zaytun | الزَّيْتُون | 1 | TOO_BROAD | 2.50 | Oath term |
| al-qalam | الْقَلَم | 1 | TOO_BROAD | 2.70 | Surah name, Q22 merge |
| al-bayyinah | الْبَيِّنَة | 1 | TOO_BROAD | 2.50 | Surah name |
| al-qari-ah | الْقَارِعَة | 2 | EDITORIAL_ONLY | 2.60 | Eschatological |
| al-azifah | الْآزِفَة | 1 | EDITORIAL_ONLY | 2.50 | Eschatological |
| al-sakhkhah | الصَّاخَّة | 1 | EDITORIAL_ONLY | 2.40 | Eschatological |
| al-hutamah | الْحُطَمَة | 1 | TOO_BROAD | 2.50 | Hell name |
| al-jahim | الْجَحِيم | 1 | TOO_BROAD | 2.60 | Hell name |
| saqar | سَقَر | 2 | TOO_BROAD | 2.50 | Hell name |
| ghassaq | غَسَّاق | 2 | TOO_BROAD | 2.60 | Q19 root disagreement |
| al-kawthar | الْكَوْثَر | 1 | POLYSEMY_COLLAPSED | 2.80 | Surah name, Q19 root disagreement |
| al-fil | الْفِيل | 1 | TOO_BROAD | 2.60 | Surah name |
| ababil | أَبَابِيل | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.50 | Q19 root disagreement |
| sijjeel | سِجِّيل | 1 | EDITORIAL_ONLY | 2.40 | Q19 root disagreement |
| al-ma-un | الْمَاعُون | 1 | POLYSEMY_COLLAPSED | 2.60 | Surah name, Q19 root disagreement |
| al-nas | النَّاس | 1 | TOO_BROAD | 2.50 | Surah name |
| al-falaq | الْفَلَق | 1 | TOO_BROAD | 2.60 | Surah name |
| al-ikhlas | الْإِخْلَاص | 1 | TOO_BROAD | 2.70 | Surah name (if present) |
| alaq | عَلَق | 1 | TOO_BROAD | 2.60 | First revelation context |
| alaqah | عَلَقَة | 1 | TOO_BROAD | 2.40 | Embryology |
| al-amanat | الْأَمَانَات | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.50 | Legal/ethical |
| al-rriba | الرِّبَا | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.70 | Economic law |
| al-uqood | الْعُقُود | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.50 | Legal |
| al-nusub | النُّصُب | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.40 | Pre-Islamic practice |
| al-fahishah | الْفَاحِشَة | 1 | POLYSEMY_COLLAPSED | 2.50 | Legal |
| al-miskin | الْمِسْكِين | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.50 | Social ethics |
| al-yatim | الْيَتِيم | 1 | TOO_BROAD | 2.60 | Social ethics |
| al-sa-il | السَّائِل | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.30 | Social ethics |
| al-munafiqeen | الْمُنَافِقِين | 1 | TOO_BROAD | 2.60 | Creedal/social |
| al-mustad-afeen | الْمُسْتَضْعَفِين | 2 | POLYSEMY_COLLAPSED | 2.50 | Social justice |
| ahmad | أَحْمَد | 1 | EDITORIAL_ONLY | 2.70 | Prophetic name |
| al-asma-al-husna | الْأَسْمَاء الْحُسْنَى | 1 | EDITORIAL_ONLY | 2.80 | Divine names |
| al-mursalat | الْمُرْسَلَات | 1 | EDITORIAL_ONLY | 2.50 | Surah name |
| al-naziat | النَّازِعَات | 1 | EDITORIAL_ONLY | 2.50 | Surah name |
| al-nashitat | النَّاشِطَات | 1 | EDITORIAL_ONLY | 2.40 | Surah name |
| al-sabihat | السَّابِحَات | 1 | POLYSEMY_COLLAPSED | 2.40 | Surah name |
| al-muriyat | الْمُورِيَات | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.30 | Oath term |
| al-mughirat | الْمُغِيرَات | 1 | TOO_BROAD | 2.30 | Oath term |
| al-adīyat | الْعَادِيَات | 1 | TOO_BROAD | 2.40 | Surah name |
| al-takathur | التَّكَاثُر | 1 | EDITORIAL_ONLY | 2.50 | Surah name |
| al-humazah | الْهُمَزَة | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.50 | Surah name |
| al-lumazah | اللُّمَزَة | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.40 | Ethical |
| al-mutaffifin | الْمُطَفِّفِين | 1 | EDITORIAL_ONLY | 2.50 | Surah name |
| al-ukhdud | الْأُخْدُود | 1 | TOO_BROAD | 2.50 | Surah name |
| al-buruj | الْبُرُوج | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.40 | Surah name |
| al-tariq | الطَّارِق | 1 | EDITORIAL_ONLY | 2.50 | Surah name |
| al-shafaq | الشَّفَق | 1 | EDITORIAL_ONLY | 2.30 | Oath term |
| al-balad | الْبَلَد | 1 | EDITORIAL_ONLY | 2.50 | Surah name |
| al-aqabah | الْعَقَبَة | 1 | POLYSEMY_COLLAPSED | 2.40 | Metaphorical |
| al-abtar | الْأَبْتَر | 1 | POLYSEMY_COLLAPSED | 2.50 | Historical context |
| al-uzza | الْعُزَّى | 1 | EDITORIAL_ONLY | 2.40 | Pre-Islamic deity |
| al-watin | الْوَتِين | 1 | TOO_BROAD | 2.20 | Anatomical |
| al-sulb | الصُّلْب | 1 | TOO_BROAD | 2.20 | Anatomical |
| al-tara-ib | التَّرَائِب | 1 | TOO_BROAD | 2.10 | Anatomical |
| al-maw-udah | الْمَوْءُودَة | 1 | EDITORIAL_ONLY | 2.50 | Social ethics |
| al-khannas | الْخَنَّاس | 1 | POLYSEMY_COLLAPSED | 2.50 | Q21 corrected root |
| al-khunnas | الْخُنَّس | 1 | EDITORIAL_ONLY | 2.30 | Astronomical |
| al-najm-al-thaqib | الثَّاقِب | 1 | EDITORIAL_ONLY | 2.30 | Astronomical |
| al-nasiyah | النَّاصِيَة | 1 | TOO_BROAD | 2.30 | Metaphorical |
| al-ayah-al-kubra | الْكُبْرَى | 1 | EDITORIAL_ONLY | 2.40 | Prophetic narrative |
| al-darki | الدَّرْك | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.20 | Eschatological |
| thulumat | ظُلُمَات | 2 | TOO_BROAD | 2.40 | Metaphorical |
| nooran | نُورًا | 1 | EDITORIAL_ONLY | 2.50 | Metaphorical |
| ajal | أَجَل | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.50 | Eschatological |
| al-birr | الْبِرّ | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.60 | Q21 critical error |
| adhab | الْعَذَاب | 1 | TOO_BROAD | 2.60 | Q21 critical error |
| al-iqab | الْعِقَاب | 1 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.40 | Q21 critical error |
| al-bayt-al-ma-mur | الْبَيْت الْمَعْمُور | 1 | TOO_BROAD | 2.50 | Q22 merge |
| rabb-hadha-al-bayt | رَبّ هَذَا الْبَيْت | 1 | TOO_BROAD | 2.30 | Q22 merge |
| haraj | حَرَج | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.40 | Legal |
| baqiyyah | بَقِيَّة | 2 | POLYSEMY_COLLAPSED | 2.30 | Narrative |
| fawahish | فَوَاحِش | 2 | TOO_BROAD | 2.30 | Legal |
| awtad | أَوْتَاد | 2 | POLYSEMY_COLLAPSED, TOO_BROAD | 2.20 | Cosmological |
| mu-sadah | مُؤْصَدَة | 2 | POLYSEMY_COLLAPSED | 2.10 | Eschatological |
| nadhir-mubin | نَذِير مُبِين | 2 | TOO_BROAD | 2.50 | Prophetic |
| al-ashqa | الْأَشْقَى | 2 | EDITORIAL_ONLY | 2.30 | Narrative |
| alif-lam-mim | الٓمٓ | 1 | SPECIAL | 2.80 | Q19 huruf muqattaat — unique treatment |

### Tier 3 Processing Strategy
- Batch by thematic domain (eschatological, legal, narrative, cosmological) so scholars maintain conceptual focus
- Surah-name terms get slight priority within this tier due to user visibility
- Terms affected by Q21 critical errors (al-birr, adhab, al-iqab, al-khannas) should be reviewed alongside their root corrections

---

## TIER 4: LOW PRIORITY (Score 1.5–1.9)

~250 terms. Single-occurrence terms with narrow contextual meaning, limited theological weight, and primarily EDITORIAL_ONLY or TOO_BROAD flags without polysemy complexity.

### Characteristics
- Occurrence count: 1
- Theological significance: Low (descriptive, narrative detail, or incidental vocabulary)
- Typical flags: EDITORIAL_ONLY, sometimes TOO_BROAD
- Examples: `-abasa` (he frowned), `abqari` (fine carpets), `a-ilan-fa-aghna` (poor then enriched), `ankabut` (spider), `alwah` (tablets), `amaniyy` (wishful thinking), `-ihn-manfush` (wool fluffed up), `-amad-mumaddadah` (extended columns), `-ishah-radiyah` (pleasant life), `akhbaraha` (its news), `al-mughirat` (chargers)

### Processing Strategy
- Bulk authoring using standardized templates
- Layer 1 (lexical meaning) often sufficient as primary improvement
- Layer 2 (contextual sense) typically maps to single verse context
- Layer 3 (tafsīr) needed only where classical sources discuss the term specifically
- Can be delegated to junior researchers with senior scholar spot-checks

---

## TIER 5: DEFERRED (Score < 1.5)

~150 terms. Blocked by upstream resolutions or representing extraction artifacts that may be eliminated entirely through Q22 merges.

### Deferral Categories

1. **Pending Q22 merge elimination**: If 15 duplicate groups are merged per the Q22 policy recommendation, approximately 20–27 entries will cease to exist as independent terms. Their glosses become senses under the unified entry rather than standalone remediation targets.
   - Affected: `haneef`, `haneefan`, `muhsinin`, `sultanan`, `bil-qisti`, `bil-qist`, `roohun`, etc.

2. **Pending Q21 slug verification**: Terms whose root assignment is still among the 223 unresolved cases cannot receive accurate Layer 1 (lexical meaning) until the root is confirmed. Authoring glosses on incorrect roots produces misinformation.
   - Affected: ~100+ terms from the unresolved pool

3. **Pending Q19 root disagreement resolution**: 8 terms with disputed roots need scholarly adjudication before gloss authoring can proceed definitively.
   - Affected: `ababil`, `al-ma-un`, `al-kawthar`, `al-judiyy`, `al-tin`, `alif-lam-mim`, `ghassaq`, `sijjeel`

4. **Compound phrases that should be subsumed**: Entries like `dhikr-allah`, `naqat-allah`, `rasul-karim`, `kalimat-al-taqwa`, `sahib-al-hut`, `hijarah-min-sijjil`, `qaddara-fa-hada` are phrasal extractions that should become contextual examples under their headword, not independent gloss targets.

### Reactivation Criteria
Tier 5 terms are reactivated when:
- Q22 merges are finalized → merged terms enter Tier 3/4 as senses
- Q21 Tier 1/2 corrections are verified → unblocked terms enter Tier 3/4
- Q19 disagreements are documented → terms enter Tier 2/3 with appropriate flags

---

## Dependency Map: Q23 ↔ Q16–Q22

```
                    ┌─────────┐
                    │  Q16    │ Scope boundary
                    │ (Scope) │ determines what enters queue
                    └────┬────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         ┌────────┐ ┌────────┐ ┌────────┐
         │  Q17   │ │  Q18   │ │  Q19   │
         │Translit│ │Polysemy│ │Roots   │
         └───┬────┘ └───┬────┘ └───┬────┘
             │          │          │
             │     ┌────┴────┐     │
             │     ▼         ▼     │
             │ ┌────────┐┌────────┐│
             │ │  Q21   ││  Q22   ││
             │ │ Slugs  ││Dupes   ││
             │ └───┬────┘└───┬────┘│
             │     │         │     │
             │     ▼         ▼     │
             │ ┌──────────────────┐│
             │ │      Q23         ││
             └►│  GLOSS QUEUE     │◄┘
               │  (this document) │
               └──────────────────┘
                         ▲
                         │
                    ┌────┴────┐
                    │  Q20    │
                    │ Nulls   │
                    └─────────┘
```

### Specific Dependencies

| Queue Tier | Depends On | Nature of Dependency |
|------------|-----------|---------------------|
| Tier 1 (partial) | Q22 | 5 terms need merge decisions before authoring |
| Tier 1 (majority) | Q17 | Transliteration must be corrected first (ISO 233-2 canonical form used in gloss display) |
| Tier 2 | Q22 | ~25 terms are merge candidates |
| Tier 2 | Q18 | Polysemy structure template must be defined before sense enumeration begins |
| Tier 3 | Q21 | Terms with corrected roots need root verification before lexical meaning (Layer 1) can be authored |
| Tier 3 | Q19 | 8 disputed-root terms need alternative analysis documentation integrated into Layer 3 |
| Tier 4 | Q16 | Scope confirmation ensures we don't waste effort on terms that fall outside curated boundary |
| Tier 5 | ALL | Entirely dependent on upstream resolutions |

---

## Flag-Specific Remediation Guidance

### For EDITORIAL_ONLY (637 terms)
**Action**: Add Layers 1–3. Start with Lane Lexicon / Hans Wehr for Layer 1. Identify specific verse contexts for Layer 2. Add brief classical tafsīr note for Layer 3 where applicable.

### For TOO_BROAD (420 terms)
**Action**: Narrow the semantic field. Replace generic English equivalents with precise definitions grounded in Arabic morphology. Example: change "punishment" to "retributive suffering inflicted as divine consequence for persistent disbelief" for `adhāb` in eschatological contexts.

### For POLYSEMY_COLLAPSED (283 terms)
**Action**: Enumerate distinct senses. Each sense gets its own numbered entry under Layer 2 with specific verse references. Cross-reference Q22 merge decisions to avoid duplicating senses across entries that should be unified.

### For MISSING_TAFSIR_NOTE (42 terms)
**Action**: Add Layer 3 with explicit source attribution. Focus on terms where classical exegetes disagree or where the tafsīr tradition adds significant interpretive depth beyond the lexical meaning. Priority terms: `fitnah`, `jihad`, `al-ruh`, `taqwa`, `al-nafs` variants.

---

## Quality Assurance Protocol

1. **Template adherence**: Every revised gloss MUST follow the four-layer structure defined in [gloss-quality-rubric.md](../../mfd-11/reports/gloss-quality-rubric.md)
2. **Source citation**: Layer 1 must cite classical lexicon; Layer 3 must cite named exegete
3. **Peer review**: Each Tier 1 gloss reviewed by ≥2 scholars before approval
4. **Version tracking**: All changes logged with date, reviewer, and rationale
5. **Regression check**: After each batch, verify no new circular definitions or contradictions introduced

---

## Implementation Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1 | Weeks 1–2 | Tier 1 complete (15 terms); serves as quality exemplars |
| Phase 2 | Weeks 3–4 | Tier 2 complete (45 terms); Q22 merges applied |
| Phase 3 | Months 2–3 | Tier 3 complete (~180 terms); Q21 verifications integrated |
| Phase 4 | Months 4–5 | Tier 4 bulk processing (~250 terms) |
| Phase 5 | Month 6+ | Tier 5 reactivation and completion (~150 terms) |

**Total estimated timeline**: 6 months for full 640-gloss remediation, assuming 2–3 dedicated scholarly reviewers.

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*Generated: 2026-11-21T09:35:00+05:00*
*No production files modified. Research-only output.*