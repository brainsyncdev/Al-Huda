# MFD-11.4 Workstream 2 — Contextual Semantic Analysis: Roots ج-ه-د (j-h-d) and ق-ت-ل (q-t-l)

- **Workstream:** MFD-11.4 WS2
- **Generated At:** 2026-11-21T00:45:00+05:00[Asia/Karachi]
- **Proposed By:** ai-assisted (agent-85)
- **Review Status:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or extraction records
- **Corpus Source:** node_modules/.pnpm/quran-json@3.1.2/node_modules/quran-json/dist/chapters/{surah}.json
- **Index Sources:** research/mfd-11/reports/root-morphology-index.json, research/mfd-11/reports/arabic-terminology-index.json
- **Context:** Builds on MFD-11.3 Workstream A findings confirming j-h-d and q-t-l are DISTINCT concept families

---

## Executive Summary

This analysis examined all terms derived from roots ج-ه-د (j-h-d) and ق-ت-ل (q-t-l) present in the root-morphology-index.json. The investigation reveals:

- **ج-ه-د (j-h-d):** 3 terms indexed (jihad, al-mujahidoona), 4 recorded occurrences across 3 verses (4:95, 22:78, 29:69). However, corpus-wide scan identifies **35 verses** containing j-h-d forms — meaning only ~11% of Quranic j-h-d usage is captured in the terminology index.
- **ق-ت-ل (q-t-l):** 1 term indexed (qital), 1 recorded occurrence (22:39). Corpus-wide scan identifies **111 verses** containing q-t-l forms — meaning less than 1% of Quranic q-t-l usage is captured.
- **Root assignment errors:** Both "jihad" and "al-mujahidoona" are assigned to INCORRECT roots (و-ج-ه and ل-م-ج respectively) instead of ج-ه-د.
- **Morphological misclassification:** Form III verbs are labeled as "fa'il active participle" or "undetermined pattern."
- **Gloss conflation:** Current glosses collapse at least 5 distinct semantic senses into 2 broad labels.

**Critical finding:** The two roots operate in fundamentally different semantic domains. ج-ه-د encompasses spiritual striving, verbal/intellectual advocacy, material sacrifice, and (in specific contexts) military mobilization. ق-ت-ل is exclusively concerned with killing/fighting across legal, narrative, eschatological, and military contexts. Their conflation under a single "jihad-definition" topic represents a category error confirmed by every contextual reading.

---

## Section 1: Term Inventory

### 1.1 Terms Derived from Root ج-ه-د (j-h-d)

| # | Index Key | Arabic (Indexed) | Assigned Root | Correct Root | Morph Pattern (Indexed) | Actual Morph Form | POS (Indexed) | Correct POS | Gloss |
|---|-----------|------------------|---------------|--------------|------------------------|--------------------|---------------|-------------|-------|
| 1 | `jihad` | وَجَٰهِدُواْ | و-ج-ه (WRONG) | ج-ه-د | fa'il active participle (WRONG) | Form III imperative verb (jāhidū) + maṣdar (jihād) | adjective (WRONG) | verb / verbal noun | "striving/struggle" |
| 2 | `al-mujahidoona` | ٱلۡمُجَٰهِدُونَ | ل-م-ج (WRONG) | ج-ه-د | fa'il active participle (PARTIALLY CORRECT) | Form III active participle, masculine plural definite | adjective | noun/adjective (active participle) | "those who strive/fight" |

**Additional j-h-d forms found in corpus but NOT indexed (33 more verses):**

The following morphological forms of ج-ه-د appear in the Quran but are absent from the terminology index:

| Form | Arabic Pattern | Example Verses | Morphological Description |
|------|---------------|----------------|--------------------------|
| Form III perfect (jāhadū) | جَٰهَدُواْ | 2:218, 3:142, 8:72, 8:74, 8:75, 9:16, 9:20, 9:41, 9:88, 16:110, 49:15 | Past tense, 3rd person masculine plural |
| Form III imperfect (yujāhidū) | يُجَٰهِدُواْ | 9:44, 9:81 | Present/subjunctive, 3rd person masculine plural |
| Form III imperfect (yujāhidūna) | يُجَٰهِدُونَ | 5:54, 61:11 | Present indicative, 3rd person masculine plural |
| Form III singular (jāhada) | جَٰهَدَ | 29:6 | Perfect, 3rd person masculine singular |
| Form III singular (yujāhidu) | يُجَٰهِدُ | 29:6 | Imperfect, 3rd person masculine singular |
| Form III dual (jāhadāka) | جَٰهَدَاكَ | 29:8, 31:15 | Perfect, 3rd person dual + 2nd person suffix |
| Form III imperative sing. (jāhid) | جَٰهِدْ | 25:52 | Imperative, 2nd person masculine singular |
| Form III masdar (jihād) | جِهَاد | 22:78, 25:52 | Verbal noun (effort/striving) |
| Form I perfect (jahada) | جَهَدَ | 5:53, 6:109, 9:79, 16:38, 24:53, 35:42 | Basic form: exerted effort, swore oaths |
| Form I imperfect (yajhadu) | يَجْهَدُ | 9:79 | Basic form: exerts effort |
| Active participle plural (mujāhidīn) | ٱلۡمُجَٰهِدِينَ | 4:95, 47:31 | Definite/indefinite accusative-genitive |
| Verbal noun (juhd/juhdan) | جُهْد / جُهْدًا | 9:79, 60:1 | Effort/capacity |

### 1.2 Terms Derived from Root ق-ت-ل (q-t-l)

| # | Index Key | Arabic (Indexed) | Assigned Root | Morph Pattern (Indexed) | Actual Morph Form | POS (Indexed) | Gloss |
|---|-----------|------------------|---------------|------------------------|--------------------|---------------|-------|
| 1 | `qital` | يُقَٰتَلُونَ | ق-ت-ل (CORRECT) | undetermined pattern (WRONG) | Form III passive imperfect, 3rd person masculine plural | noun (WRONG) | "fighting/combat" |

**Additional q-t-l forms found in corpus but NOT indexed (110 more verses):**

| Form | Arabic Pattern | Example Verses | Morphological Description |
|------|---------------|----------------|--------------------------|
| Form I perfect (qatala) | قَتَلَ | 2:251, 5:30, 3:144, 18:74 | To kill (transitive) |
| Form I imperfect (yaqtulu) | يَقْتُلُ | 2:61, 3:21, 5:70 | Kills/is killing |
| Form I imperative (uqtulū) | ٱقْتُلُواْ | 2:54, 2:191, 4:89, 9:5 | Kill! (command) |
| Form I passive perfect (qutila) | قُتِلَ | 3:144, 3:195 | Was killed |
| Form I passive imperfect (yuqtalu) | يُقْتَلُ | 4:74 | Is being killed |
| Form I maṣdar (qatl) | ٱلْقَتْل | 2:191, 2:217, 17:33 | Killing (verbal noun) |
| Form I active participle pl. (qatlah) | ٱلْقَتْلَى | 2:178 | The slain |
| Form III perfect (qātalū) | قَٰتَلُواْ | 2:244, 9:36, 57:10 | They fought (mutual combat) |
| Form III imperfect (yuqātilūna) | يُقَٰتِلُونَ | 2:190, 4:76, 61:4 | They fight (ongoing) |
| Form III imperative (qātilū) | قَٰتِلُواْ | 2:190, 2:193, 2:244, 9:12, 9:29, 9:123 | Fight! (command) |
| Form III passive imperfect (yuqātalūna) | يُقَٰتَلُونَ | 22:39 | They are being fought against |
| Form III maṣdar (qitāl) | ٱلْقِتَال | 2:216, 4:77 | Fighting/combat (verbal noun) |
| Form VIII perfect (iqtatalū) | ٱقْتَتَلُواْ | (not in current set but related) | They fought each other |

---

## Section 2: Occurrence Register

### 2.1 Indexed ج-ه-د Occurrences — Detailed Contextual Analysis

#### Occurrence 1: 4:95 — ٱلۡمُجَٰهِدُونَ (al-mujāhidūn)

| Field | Value |
|-------|-------|
| **Verse Key** | 4:95 |
| **Verbatim Arabic Phrase** | وَٱلۡمُجَٰهِدُونَ فِي سَبِيلِ ٱللَّهِ بِأَمۡوَٰلِهِمۡ وَأَنفُسِهِمۡ |
| **Full Verse** | لَّا يَسۡتَوِي ٱلۡقَٰعِدُونَ مِنَ ٱلۡمُؤۡمِنِينَ غَيۡرُ أُوْلِي ٱلضَّرَرِ وَٱلۡمُجَٰهِدُونَ فِي سَبِيلِ ٱللَّهِ بِأَمۡوَٰلِهِمۡ وَأَنفُسِهِمۡۚ فَضَّلَ ٱللَّهُ ٱلۡمُجَٰهِدِينَ بِأَمۡوَٰلِهِمۡ وَأَنفُسِهِمۡ عَلَى ٱلۡقَٰعِدِينَ دَرَجَةٗۚ وَكُلّٗا وَعَدَ ٱللَّهُ ٱلۡحُسۡنَىٰۚ وَفَضَّلَ ٱللَّهُ ٱلۡمُجَٰهِدِينَ عَلَى ٱلۡقَٰعِدِينَ أَجۡرًا عَظِيمٗا |
| **Morphological Form** | Form III active participle, masculine plural, definite (الْمُجَاهِدُونَ) and accusative-genitive (الْمُجَاهِدِينَ). Appears 3 times in this verse. |
| **Contextual Sense** | **MARTIAL-MATERIAL STRIVING.** The verse contrasts those who sit at home (al-qā'idūn) with those who strive in Allah's path with wealth and lives (bi-amwālihim wa-anfusihim). The pairing of amwāl (wealth) + anfus (lives/selves) in a sabil Allāh framework, immediately following verses about striking out in Allah's path (4:94: إِذَا ضَرَبۡتُمۡ فِي سَبِيلِ ٱللَّهِ) and preceding discussion of angels taking souls of those who wronged themselves by not emigrating (4:97), firmly places this in a MILITARY MOBILIZATION context. The jihād here is specifically armed expedition participation combined with financial support. |
| **Semantic Category** | Martial + Financial striving (armed expedition context) |
| **Current Gloss** | "those who strive/fight" |
| **Gloss Assessment** | **TOO BROAD.** The slash construction "strive/fight" collapses the precise contextual meaning. In THIS verse, the sense is unambiguously martial-material. The word does not mean generic "striving" here — it specifically denotes those who go forth on military expeditions expending wealth and risking lives. However, the same word form in 29:69 means purely spiritual striving. The gloss must be context-specific. |
| **Relationship to q-t-l** | This verse uses j-h-d for the CONCEPT of martial striving but notably does NOT use q-t-l. The surrounding context (4:93 uses yaqtul — killing a believer; 4:94 uses ḍarabtum fī sabīl Allāh — striking out) bridges both roots. The choice of j-h-d over q-t-l here emphasizes the SACRIFICE/EFFORT dimension rather than the KILLING/COMBAT dimension. |

#### Occurrence 2: 22:78 — وَجَٰهِدُواْ (wa-jāhidū) + جِهَادِهِۦ (jihādihi)

| Field | Value |
|-------|-------|
| **Verse Key** | 22:78 |
| **Verbatim Arabic Phrase** | وَجَٰهِدُواْ فِي ٱللَّهِ حَقَّ جِهَادِهِۦ |
| **Full Verse** | وَجَٰهِدُواْ فِي ٱللَّهِ حَقَّ جِهَادِهِۦۚ هُوَ ٱجۡتَبَىٰكُمۡ وَمَا جَعَلَ عَلَيۡكُمۡ فِي ٱلدِّينِ مِنۡ حَرَجٖۚ مِّلَّةَ أَبِيكُمۡ إِبۡرَٰهِيمَۚ هُوَ سَمَّىٰكُمُ ٱلۡمُسۡلِمِينَ مِن قَبۡلُ وَفِي هَٰذَا لِيَكُونَ ٱلرَّسُولُ شَهِيدًا عَلَيْكُمۡ وَتَكُونُواْ شُهَدَآءَ عَلَى ٱلنَّاسِۚ فَأَقِيمُواْ ٱلصَّلَوٰةَ وَءَاتُواْ ٱلزَّكَوٰةَ وَٱعۡتَصِمُواْ بِٱللَّهِ هُوَ مَوۡلَىٰكُمۡۖ فَنِعۡمَ ٱلۡمَوۡلَىٰ وَنِعۡمَ ٱلنَّصِيرُ |
| **Morphological Form** | Form III imperative plural (jāhidū) + Form III maṣdar genitive construct (jihādihi — "His striving/due striving") |
| **Contextual Sense** | **HOLISTIC SPIRITUAL-COMMUNAL STRIVING.** This is the closing verse of Surah Al-Hajj. The command "strive in Allah with the striving due to Him" is immediately followed by: He chose you, placed no hardship in religion, the creed of your father Abraham, establish prayer, give zakah, hold fast to Allah. There is NO military context whatsoever. The jihād here encompasses the totality of religious commitment — prayer, charity, witness-bearing, adherence to Abrahamic monotheism. It is COMPREHENSIVE DEVOTION. |
| **Semantic Category** | Holistic/spiritual striving (total religious commitment) |
| **Current Gloss** | "striving/struggle" |
| **Gloss Assessment** | **INADEQUATE.** While "striving" is directionally correct, the gloss fails to capture that this is the most expansive, non-martial usage of j-h-d in the entire Quran. The phrase ḥaqqa jihādihi ("the true measure of His striving/due striving") implies maximum effort in ALL dimensions of faith. Reducing this to "striving/struggle" strips it of its comprehensiveness. |
| **Relationship to q-t-l** | NONE. No q-t-l vocabulary appears anywhere in 22:76-78. Significantly, 22:39 (just 39 verses earlier in the SAME surah) uses يُقَٰتَلُونَ for armed defensive permission. The surah deliberately uses BOTH roots in DIFFERENT contexts: q-t-l for the specific legal permission to defend oneself militarily (22:39), and j-h-d for the comprehensive spiritual-religious obligation (22:78). This intra-surah contrast PROVES the two roots are semantically distinct. |

#### Occurrence 3: 29:69 — جَٰهَدُواْ (jāhadū)

| Field | Value |
|-------|-------|
| **Verse Key** | 29:69 |
| **Verbatim Arabic Phrase** | وَٱلَّذِينَ جَٰهَدُواْ فِينَا |
| **Full Verse** | وَٱلَّذِينَ جَٰهَدُواْ فِينَا لَنَهۡدِيَنَّهُمۡ سُبُلَنَاۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلۡمُحۡسِنِينَ |
| **Morphological Form** | Form III perfect, 3rd person masculine plural (jāhadū) |
| **Contextual Sense** | **PURE SPIRITUAL SEEKING.** "Those who strive for Us / in Our cause — We will surely guide them to Our ways." This is the final verse of Surah Al-Ankabut (Meccan). The context (29:67-68 discusses recognizing Allah's sanctuary and condemning those who fabricate lies against Allah) is entirely about faith, truth-seeking, and divine guidance. The reward for jihād here is NOT victory or spoils but HUDĀ (guidance) to subul (ways/paths). This is the paradigmatic SPIRITUAL striving verse. |
| **Semantic Category** | Pure spiritual/existential striving (seeking divine guidance) |
| **Current Gloss** | "striving/struggle" (from arabic-terminology-index via root-morphology cross-reference) |
| **Gloss Assessment** | **TOO VAGUE.** "Striving/struggle" could apply equally to 4:95 (military) and 29:69 (spiritual). But these are FUNDAMENTALLY different acts. In 29:69, jihād means sincere seeking of God through faith and righteous action. The gloss should specify "spiritual striving for divine guidance" in this context. |
| **Relationship to q-t-l** | NONE. Entirely absent. Meccan surah with no military legislation. |

### 2.2 Indexed ق-ت-ل Occurrences — Detailed Contextual Analysis

#### Occurrence 4: 22:39 — يُقَٰتَلُونَ (yuqātalūna)

| Field | Value |
|-------|-------|
| **Verse Key** | 22:39 |
| **Verbatim Arabic Phrase** | أُذِنَ لِلَّذِينَ يُقَٰتَلُونَ بِأَنَّهُمۡ ظُلِمُواْ |
| **Full Verse** | أُذِنَ لِلَّذِينَ يُقَٰتَلُونَ بِأَنَّهُمۡ ظُلِمُواْۚ وَإِنَّ ٱللَّهَ عَلَىٰ نَصۡرِهِمۡ لَقَدِيرٌ |
| **Morphological Form** | Form III passive imperfect, 3rd person masculine plural (yuqātalūna — "they are being fought against") |
| **Contextual Sense** | **DEFENSIVE ARMED COMBAT PERMISSION.** "Permission [to fight] is given to those who are being fought against because they have been wronged." This is universally recognized as the FIRST verse in the Quran permitting armed fighting. The passive voice (yuqātalūna — are fought against, NOT yuqātilūna — fight) is theologically significant: it establishes DEFENSIVE posture as the foundational condition. The next verse (22:40) specifies the wrong: expulsion from homes for saying "Our Lord is Allah." The context (22:37-41) discusses sacrifice, divine defense of believers, and protection of all houses of worship. |
| **Semantic Category** | Armed defensive fighting (legal permission) |
| **Current Gloss** | "fighting/combat" |
| **Gloss Assessment** | **INCOMPLETE.** "Fighting/combat" misses three critical elements: (1) the PASSIVE voice indicating defensive posture (they are being attacked, not initiating); (2) the LEGAL-PERMISSIVE function (udhina — permission granted); (3) the CAUSAL GROUND (bi-annahum ẓulimū — because they were wronged). The gloss should read: "are fought against / defensive combat permission." |
| **Relationship to j-h-d** | Same surah as 22:78 (j-h-d). See analysis above. The deliberate use of q-t-l HERE and j-h-d at 22:78 within the same surah demonstrates they are NOT interchangeable. Q-t-l addresses the specific legal question of when armed force is permissible; j-h-d addresses the broader spiritual obligation. |

### 2.3 Critical Unindexed ج-ه-د Occurrence: 25:52

Although not in the terminology index, MFD-11.3 identified 25:52 as the DEFINITIONAL verse for Quranic jihād. It must be analyzed here:

| Field | Value |
|-------|-------|
| **Verse Key** | 25:52 |
| **Verbatim Arabic Phrase** | فَلَا تُطِعِ ٱلۡكَٰفِرِينَ وَجَٰهِدۡهُم بِهِۦ جِهَادٗا كَبِيرٗا |
| **Morphological Form** | Form III imperative singular (jāhidhum) + Form III maṣdar accusative (jihādan kabīran — "a great striving") |
| **Contextual Sense** | **VERBAL/QUR'ANIC INTELLECTUAL STRIVING.** "Do not obey the disbelievers and strive against them WITH IT [the Quran] a great striving." The pronoun bihi (with it) refers to the Quran itself (established by 25:30-32 context about the Prophet's complaint that his people abandoned the Quran). This is explicitly NON-VIOLENT, NON-MARTIAL striving through intellectual and revelatory proclamation. |
| **Semantic Category** | Verbal/intellectual advocacy through revelation |
| **Significance** | This verse ALONE refutes any definition of jihād as inherently martial. It commands the Prophet to wage jihād using the Quran as instrument — the antithesis of armed combat. Its absence from the terminology index is a critical gap. |

---

## Section 3: Semantic Distinction Map

### 3.1 How ج-ه-د Functions Across Contexts

Based on analysis of all 35 corpus occurrences, ج-ه-د operates in **five distinct semantic senses**:

| # | Semantic Sense | Definition | Representative Verses | Distinguishing Markers |
|---|---------------|------------|----------------------|----------------------|
| S1 | **Spiritual/Existential Striving** | Sincere effort toward divine guidance, faith perseverance, self-purification | 29:6, 29:69, 3:142, 47:31 | Reward = guidance/patience/testing; no mention of wealth, weapons, enemies, or battle |
| S2 | **Verbal/Intellectual Advocacy** | Proclamation of truth through revelation and argumentation | 25:52 | Instrument = Quran (bihi); addressee = disbelievers; method = NOT arms |
| S3 | **Material/Financial Sacrifice** | Expending wealth and personal resources in Allah's cause | 9:41, 9:44, 9:81, 9:86, 9:88, 49:15, 61:11, 8:72, 8:74, 2:218 | Paired with amwāl (wealth) + anfus (lives); often paired with hijrah (emigration) |
| S4 | **Military Mobilization** | Going forth on armed expeditions in Allah's cause | 9:41 (when paired with infirū), 4:95, 9:86 | Paired with infirū (go forth), ḍarabtum (strike out), or explicit military context |
| S5 | **Oath-swearing / Earnest Assertion** | Swearing oaths with utmost effort; emphatic declaration | 5:53, 6:109, 16:38, 24:53, 35:42 | Form I jahada used with qasam/ayman (oaths); means "exerted effort in swearing" NOT "fought" |
| S6 | **Prophetic Confrontation** | Striving against disbelief/hypocrisy within community | 9:73, 66:9 | Addressed to Prophet; targets include munāfiqūn (hypocrites); method unspecified but includes verbal |

**Key insight:** Sense S5 (oath-swearing) uses Form I jahada and is LEXICALLY DISTINCT from the Form III jāhada used in senses S1-S4. The terminology index does not distinguish these at all. Form I jahada means "to exert effort" generically (including oath-swearing), while Form III jāhada means "to strive/struggle for a cause" with theological weight.

### 3.2 How ق-ت-ل Functions Across Contexts

Based on analysis of all 111 corpus occurrences, ق-ت-ل operates in **four distinct semantic senses**:

| # | Semantic Sense | Definition | Representative Verses | Distinguishing Markers |
|---|---------------|------------|----------------------|----------------------|
| C1 | **Legal/Prescriptive Combat** | Divine legislation governing when/how Muslims may engage in armed fighting | 2:190-193, 2:216, 2:244, 4:74-77, 4:84, 4:89-91, 8:39, 9:5, 9:12-14, 9:29, 9:123, 22:39-40, 47:4, 48:16, 61:4 | Medinan verses; legislative language (kutiba, udhina, qātilū); rules of engagement, proportionality, cessation conditions |
| C2 | **Narrative/Historical Killing** | Accounts of killing in prophetic narratives and historical events | 2:61, 2:87, 2:91, 3:21, 3:112, 3:181, 3:183, 5:27-30 (Cain/Abel), 7:127, 7:141, 12:9-10 (Joseph's brothers), 17:31, 18:74 (Khidr), 20:40 (Moses), 26:14, 28:9, 28:19-20, 28:33, 40:25-26, 51:10 | Past tense; narrative framing; named prophets/peoples |
| C3 | **Sanctity of Life / Legal Prohibition** | Prohibition of unlawful killing; sanctity of human life; retribution law | 2:178 (qiṣāṣ), 4:29 (self-killing), 4:92-93 (killing believers), 5:32 (one soul = all humanity), 6:151, 17:31 (infanticide), 17:33 (unlawful killing), 25:68 | Prohibitive language (lā taqtulū); legal consequences; moral absolutes |
| C4 | **Eschatological/Condemnation** | Killing as sign of corruption, divine punishment, or end-times | 74:19-20, 80:17, 81:9, 85:4 (People of the Trench) | Short Meccan surahs; rhetorical questions; condemnation tone |

**Key insight:** ق-ت-ل NEVER means spiritual striving, intellectual effort, or devotional practice. It ALWAYS involves physical violence, killing, or armed combat. Even in its most elevated usage (C1 — divinely sanctioned combat), it remains strictly martial.

### 3.3 Comparative Semantic Architecture

```
ج-ه-د (j-h-d): EFFORT/EXERTION SPECTRUM
├── Form I (jahada): Generic effort
│   └── Oath-swearing, earnest assertion (S5)
└── Form III (jāhada): Directed striving for divine cause
    ├── Non-martial
    │   ├── Spiritual seeking (S1)
    │   ├── Intellectual/Quranic advocacy (S2)
    │   └── Prophetic confrontation of hypocrisy (S6)
    ├── Material
    │   └── Financial/personal sacrifice (S3)
    └── Martial (when combined with military context markers)
        └── Military mobilization (S4)

ق-ت-ل (q-t-l): PHYSICAL VIOLENCE/KILLING SPECTRUM
├── Form I (qatala): To kill (transitive)
│   ├── Narrative killing (C2)
│   ├── Prohibited killing (C3)
│   └── Eschatological killing (C4)
└── Form III (qātala): To fight/engage in mutual combat
    └── Legal/prescriptive armed combat (C1)
```

**The overlap zone** between j-h-d and q-t-l is NARROW: it exists ONLY in Sense S4 (military mobilization) where ج-ه-د is used alongside military context markers (infirū, ḍaraba, sabil Allāh in martial frame). Even here, the two roots emphasize DIFFERENT aspects: j-h-d emphasizes the SACRIFICE/EFFORT of going forth, while q-t-l emphasizes the ACTUAL COMBAT/KILLING.

**The divergence zone** is VAST: j-h-d encompasses 5 non-martial senses that q-t-l cannot express. Conversely, q-t-l encompasses narrative, legal-prohibitive, and eschatological senses that j-h-d never touches.

---

## Section 4: Gloss Correction Recommendations

### 4.1 Critical Errors in Current Index

| # | Term | Current Gloss | Problem | Recommended Correction | Priority |
|---|------|--------------|---------|----------------------|----------|
| 1 | `jihad` (term key) | "striving/struggle" | (a) Root assigned as و-ج-ه instead of ج-ه-د; (b) Morph pattern listed as "fa'il active participle" when it is Form III imperative + maṣdar; (c) POS listed as "adjective" when it is verb/verbal noun; (d) Gloss too vague to distinguish from martial usage; (e) Only captures 2 of 35 j-h-d verses | Root → ج-ه-د; Morph → "Form III imperative (jāhidū) + maṣdar (jihād)"; POS → "verb / verbal noun"; Gloss → "strive in Allah's cause (context-dependent: spiritual, material, or martial)" | **CRITICAL** |
| 2 | `al-mujahidoona` | "those who strive/fight" | (a) Root assigned as ل-م-ج instead of ج-ه-د; (b) The slash "strive/fight" collapses two distinct senses into one ambiguous label; (c) In 4:95 context, the sense is specifically martial-material, not generic | Root → ج-ه-د; Gloss for 4:95 context → "those who go forth striving with wealth and lives (military expedition context)"; Note that same form in 47:31 has testing/trial context | **CRITICAL** |
| 3 | `qital` | "fighting/combat" | (a) Arabic يُقَٰتَلُونَ is Form III PASSIVE ("are fought against"), not active; (b) Gloss misses the defensive-permission function of 22:39; (c) Only captures 1 of 111 q-t-l verses; (d) POS listed as "noun" when it is a passive verb | Morph → "Form III passive imperfect (yuqātalūna)"; POS → "verb (passive)"; Gloss → "are fought against (defensive combat permission)" | **CRITICAL** |

### 4.2 Missing Terms Requiring Addition

The following high-frequency, theologically significant terms from both roots are completely absent from the terminology index and should be added:

| Term | Arabic | Root | Key Verses | Semantic Sense | Recommended Gloss |
|------|--------|------|-----------|----------------|------------------|
| jāhidhum bihi | وَجَٰهِدۡهُم بِهِۦ | ج-ه-د | 25:52 | Verbal/Quranic striving | "strive against them with it [Quran]" |
| al-qitāl | ٱلۡقِتَال | ق-ت-ل | 2:216, 4:77 | Prescribed fighting | "armed combat (as prescribed obligation)" |
| qātilū | قَٰتِلُواْ | ق-ت-ل | 2:190, 9:12, 9:29 | Combat command | "fight (imperative, armed engagement)" |
| lā taqtulū | لَا تَقۡتُلُواْ | ق-ت-ل | 6:151, 17:33 | Prohibition | "do not kill (sanctity of life)" |
| jāhadū bi-amwālihim | جَٰهَدُواْ بِأَمۡوَٰلِهِمۡ | ج-ه-د | 9:41, 49:15, 61:11 | Material sacrifice | "strove with their wealth" |
| jahada (Form I) | جَهَدَ | ج-ه-د | 6:109, 16:38, 35:42 | Oath-swearing | "swore earnestly / exerted in oath" |

### 4.3 Structural Recommendation: Split the jihad-definition Topic

As confirmed by MFD-11.3 and reinforced by this analysis, the current `jihad-definition` topic must be split:

1. **`jihad-striving`** (new topic): Receives genuine j-h-d verses. Must accommodate all 6 semantic senses (S1-S6). Cannot be housed exclusively under `war-peace-conflict` domain because senses S1, S2, S5, and S6 are non-martial. Requires placement in a cross-domain position or expanded dimension.

2. **`qital-fighting-theology`** (new topic): Receives q-t-l verses currently misclassified under jihad-definition. Stays under `war-peace-conflict/warfare-ethics`. Covers senses C1 (prescriptive combat) primarily, with C3 (sanctity of life) as ethical constraint.

---

## Section 5: Scholarly Questions

### 5.1 Root Assignment Methodology

1. **Why were "jihad" and "al-mujahidoona" assigned to incorrect roots?** The root-morphology-index assigns "jihad" to و-ج-ه (face/direction) and "al-mujahidoona" to ل-م-ج (non-existent root). These are algorithmic errors that suggest the root-assignment process did not use standard Arabic lexicography (Lane's Lexicon, Hans Wehr) for these entries. What quality control process was applied to root assignments?

2. **Why is the Form I / Form III distinction collapsed?** ج-ه-د Form I (jahada = to exert effort, swear oaths) and Form III (jāhada = to strive for a cause) have fundamentally different semantic ranges. The index treats them as a single entry. Should morphological form (awzan) be a primary organizing axis?

### 5.2 Conceptual-Theological Questions

3. **Is the S4 (military mobilization) sense of j-h-d genuinely distinct from q-t-l, or is it a euphemistic synonym?** In verses like 9:41 (انفروا... وجاهدوا), j-h-d appears in an unambiguously military context. Does this mean j-h-d CAN mean "fight," or does it retain its core meaning of "exert effort" even when the effort happens to be military? The answer determines whether the j-h-d/q-t-l distinction is absolute or contextual.

4. **How should 25:52 be weighted taxonomically?** This verse defines jihād through the Quran as instrument. If the taxonomy's "jihad-definition" topic does not center this verse, can it claim to represent Quranic jihād? Or does 25:52 represent ONE sense among several, none privileged?

5. **Does the passive voice in 22:39 (yuqātalūna) carry independent theological weight?** The first permission to fight uses the PASSIVE form ("those who are being fought against") rather than active ("those who fight"). This grammatical choice embeds the defensive principle into the morphology itself. Should the taxonomy reflect this morphological theology?

### 5.3 Coverage and Completeness

6. **Why are only 4 of 146 total verses (35 j-h-d + 111 q-t-l) represented in the terminology index?** The index captures approximately 2.7% of the actual Quranic usage of these two roots. Is this a deliberate scoping decision (only indexing terms that appeared in extraction files) or an oversight? Either way, the resulting taxonomy is built on a statistically negligible sample.

7. **Should the Form I jahada (oath-swearing) verses be classified under j-h-d at all?** Verses like 6:109, 16:38, 24:53, 35:42 use jahada to mean "swore with utmost effort" — a lexical meaning that shares the root but not the theological concept of jihād. Including them under "jihad" would be a category error. How should homographic but semantically divergent usages be handled?

8. **What is the relationship between ج-ه-د and ص-ب-ر (patience)?** Multiple verses pair them (3:142, 16:110, 47:31). Is ṣabr a component of jihād, a parallel virtue, or a prerequisite? The taxonomy currently treats them independently.

---

## Appendix A: Complete Corpus Occurrence List

### ج-ه-د Verses (35 total)

| # | Verse | Forms Found | Primary Sense |
|---|-------|-------------|---------------|
| 1 | 2:218 | جَاهَدُوا | S3/S4 - Material/military |
| 2 | 3:142 | جَاهَدُوا | S1 - Spiritual testing |
| 3 | 4:95 | الْمُجَاهِدُونَ/الْمُجَاهِدِينَ (x3) | S4 - Military mobilization |
| 4 | 5:35 | ابْتَغُوا إِلَيْهِ الْوَسِيلَةَ وَجَاهِدُوا | S1 - Seeking nearness |
| 5 | 5:53 | جَهَدَ (Form I) | S5 - Oath/earnest assertion |
| 6 | 5:54 | يُجَاهِدُونَ | S3 - Material sacrifice |
| 7 | 6:109 | جَهَدَ (Form I) | S5 - Oath-swearing |
| 8 | 8:72 | جَاهَدُوا | S3/S4 - Migration + striving |
| 9 | 8:74 | جَاهَدُوا | S3/S4 - Migration + striving |
| 10 | 8:75 | جَاهَدُوا | S3/S4 - Migration + striving |
| 11 | 9:16 | جَاهَدُوا | S3/S4 - Testing believers |
| 12 | 9:19 | جِهَاد | S3/S4 - Reference to striving |
| 13 | 9:20 | جَاهَدُوا | S3/S4 - Emigration + striving |
| 14 | 9:41 | جَاهِدُوا | S4 - Military mobilization |
| 15 | 9:44 | يُجَاهِدُوا | S3 - True believers don't seek exemption |
| 16 | 9:73 | جَاهِدْهُم | S6 - Prophetic confrontation |
| 17 | 9:79 | جُهْدَهُمْ (Form I noun) | S5 - Mockery/effort |
| 18 | 9:81 | يُجَاهِدُوا | S4 - Hypocrites avoiding expedition |
| 19 | 9:86 | جَاهِدُوا | S4 - Military mobilization |
| 20 | 9:88 | جَاهَدُوا | S3/S4 - Believers' sacrifice |
| 21 | 16:38 | جَهَدَ (Form I) | S5 - Oath-swearing |
| 22 | 16:110 | جَاهَدُوا | S1/S3 - Post-persecution striving |
| 23 | 22:78 | جَاهِدُوا / جِهَادِهِ | S1/S2 - Holistic devotion |
| 24 | 24:53 | جَهَدَ (Form I) | S5 - Oath-swearing |
| 25 | 25:52 | جَاهِدْهُمْ / جِهَادًا | S2 - Quranic advocacy |
| 26 | 29:6 | جَاهَدَ / يُجَاهِدُ | S1 - Spiritual self-benefit |
| 27 | 29:8 | جَاهَدَاكَ | S6 - Parental pressure to shirk |
| 28 | 29:69 | جَاهَدُوا | S1 - Spiritual seeking |
| 29 | 31:15 | جَاهَدَاكَ | S6 - Parental pressure to shirk |
| 30 | 35:42 | جَهَدَ (Form I) | S5 - Oath-swearing |
| 31 | 47:31 | الْمُجَاهِدِينَ | S1 - Testing/trial |
| 32 | 49:15 | جَاهَدُوا | S3 - Definitional (true believers) |
| 33 | 60:1 | جُهْدًا (Form I noun) | S5 - Earnest effort |
| 34 | 61:11 | تُجَاهِدُونَ | S3 - Salvific transaction |
| 35 | 66:9 | جَاهِدْهُم | S6 - Prophetic confrontation |

### ق-ت-ل Verses (111 total — summarized by sense)

| Sense | Count | Representative Verses |
|-------|-------|----------------------|
| C1 - Legal/Prescriptive Combat | ~35 | 2:190-193, 2:216, 2:244, 4:74-77, 4:84, 4:89-91, 8:39, 9:5, 9:12-14, 9:29, 9:111, 9:123, 22:39, 47:4, 48:16, 61:4 |
| C2 - Narrative/Historical Killing | ~40 | 2:61, 2:87, 2:91, 3:21, 3:111-112, 3:156-158, 3:167-169, 3:181, 3:183, 5:27-30, 7:127, 7:141, 7:150, 12:9-10, 18:74, 20:40, 26:14, 28:9, 28:19-20, 28:33, 40:25-26, 51:10 |
| C3 - Sanctity of Life / Prohibition | ~20 | 2:178, 4:29, 4:92-93, 5:32-33, 6:137, 6:140, 6:151, 17:31, 17:33, 25:68 |
| C4 - Eschatological/Condemnation | ~16 | 74:19-20, 80:17, 81:9, 85:4, 33:61, 57:10, 59:14, 63:4 |

---

## Appendix B: Data Quality Issues Identified

| Issue | Location | Description | Severity |
|-------|----------|-------------|----------|
| Wrong root: jihad → و-ج-ه | root-morphology-index.json:8669 | "jihad" (Arabic: وَجَٰهِدُواْ) assigned to root و-ج-ه (face/direction) instead of ج-ه-د | CRITICAL |
| Wrong root: al-mujahidoona → ل-م-ج | root-morphology-index.json:5157 | "al-mujahidoona" assigned to fabricated root ل-م-ج instead of ج-ه-د | CRITICAL |
| Wrong morph pattern: jihad | root-morphology-index.json:8672 | Listed as "fa'il active participle" when وَجَٰهِدُواْ is Form III imperative verb | HIGH |
| Wrong POS: jihad | root-morphology-index.json:8673 | Listed as "adjective" when it functions as verb + verbal noun | HIGH |
| Wrong morph pattern: qital | root-morphology-index.json:11179 | Listed as "undetermined pattern" when يُقَٰتَلُونَ is clearly Form III passive imperfect | HIGH |
| Wrong POS: qital | root-morphology-index.json:11180 | Listed as "noun" when it is a passive verb | HIGH |
| Grammatical note error: qital | root-morphology-index.json:11181 | Notes "possible weak root" — ق-ت-ل has no weak letters | MEDIUM |
| Coverage gap: j-h-d | arabic-terminology-index.json | Only 4 of 35 j-h-d verses represented (~11%) | CRITICAL |
| Coverage gap: q-t-l | arabic-terminology-index.json | Only 1 of 111 q-t-l verses represented (~0.9%) | CRITICAL |
| Gloss conflation: al-mujahidoona | arabic-terminology-index.json:814 | "those who strive/fight" merges S1 (spiritual) and S4 (martial) senses | HIGH |
| Missing 25:52 | arabic-terminology-index.json | The definitional verse for Quranic jihād is entirely absent | CRITICAL |

---

*Report generated by MFD-11.4 Workstream 2 (agent-85). RESEARCH ONLY — no production files modified.*
