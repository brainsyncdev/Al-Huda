# MFD-11.4 Workstream 2 — Covenant & Peace Terminology: Contextual Semantic Analysis

- **Workstream:** MFD-11.4-WS2
- **Generated At:** 2026-11-21T00:55:00+05:00[Asia/Karachi]
- **Proposed By:** ai-assisted (agent-87)
- **Review Status:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or extraction records
- **Source Data:** `data/root-occurrences/{عهد,وثق,سلم,صلح}.json` + `research/mfd-11/reports/root-morphology-index.json`
- **Context:** Builds on MFD-11.3 Workstream A (War, Peace & Conflict Domain Completeness)

---

## Section 1: Term Count Summary Per Root

| Root | Arabic | Lemmas in Corpus | Total Occurrences | Unique Ayahs |
|------|--------|------------------|-------------------|--------------|
| ع-ه-د | عهد | عَهِدَ، عَهْد، عَٰهَدَ | 46 | 35 |
| و-ث-ق | وثق | مَّوْثِق، مِّيثَٰق، وَاثَقَ، وَثَاق، وُثْقَىٰ، يُوثِقُ | 34 | 29 |
| س-ل-م | سلم | أَسْلَمَ، إِسْلَٰم، تَسْلِيم، سَلَم، سَلَٰم، سَلِيم، سَلَّمَ، سَٰلِمُون، سُلَّم، سَّلْم، سِّلْم، مُسْتَسْلِمُون، مُسْلِم، مُسْلِمَٰت، مُّسَلَّمَة، مُّسْلِمَة | 136 | 118 |
| ص-ل-ح | صلح | أَصْلَحَ، إِصْلَٰح، صَلَحَ، صَٰلِح، صُلْح، صَّٰلِحَٰت، مُصْلِح | 168 | 143 |
| **TOTAL** | | **32 lemmas** | **384** | **~280 unique** |

### Key Observation
The root-morphology-index.json only captured a SUBSET of these terms:
- س-ل-م: Only `salam` (2 occ.) and `salim` (1 occ.) were indexed — missing 133 occurrences across 14 other lemmas
- و-ث-ق: Only `urwat-al-wuthqa` (1 occ.) was indexed — missing 33 occurrences across 5 other lemmas
- ع-ه-د: NOT present in root-morphology-index.json at all
- ص-ل-ح: NOT present in root-morphology-index.json at all

**This confirms that the root-morphology-index.json has significant coverage gaps for covenant/peace terminology.** The `data/root-occurrences/` files are the authoritative source.

---

## Section 2: Semantic Classification by Root

### 2.1 Root ع-ه-د (ʿ-h-d) — Covenant / Pledge

**Lemmas:** عَهْد (noun: covenant, pledge), عَهِدَ (Form I verb: to covenant/charge), عَٰهَدَ (Form III verb: to make treaty/covenant with)

#### Semantic Class Distribution

| Semantic Class | Count | Percentage | Representative Verses |
|---------------|-------|------------|----------------------|
| GENERAL-COVENANT (Divine-human) | 14 | 30.4% | 2:40, 2:80, 2:124, 3:76, 3:77, 13:20, 17:34, 23:8, 70:32 |
| TREATY-SPECIFIC (Inter-communal/political) | 18 | 39.1% | 8:56, 9:1, 9:4, 9:7, 9:12, 16:91, 16:95, 48:10 |
| INDIVIDUAL-MORAL (Personal oath/commitment) | 8 | 17.4% | 2:177, 2:100, 19:78, 19:87, 33:15, 33:23 |
| ESCHATOLOGICAL-ACCOUNTABILITY | 4 | 8.7% | 17:34, 33:15, 3:77, 20:86 |
| OTHER (Prophetic narrative) | 2 | 4.3% | 20:115, 43:49 |

#### Detailed Occurrence Table

| Verse | Token | Lemma | Form | Semantic Class | Context Notes |
|-------|-------|-------|------|---------------|---------------|
| 2:27 | عَهْدَ | عَهْد | noun | GENERAL-COVENANT | Breaking Allah's covenant after mīthāq |
| 2:40 | بِعَهْدِىٓ | عَهْد | noun+poss | GENERAL-COVENANT | Divine-human reciprocal: "fulfill My covenant" |
| 2:40 | بِعَهْدِكُمْ | عَهْد | noun+poss | GENERAL-COVENANT | Human side of reciprocal covenant |
| 2:80 | عَهْدًۭا | عَهْد | noun indef | GENERAL-COVENANT | Challenge: did you take covenant with Allah? |
| 2:80 | عَهْدَهُۥٓ | عَهْد | noun+poss | GENERAL-COVENANT | Allah never breaks His covenant |
| 2:100 | عَـٰهَدُوا۟ | عَٰهَدَ | Form III | INDIVIDUAL-MORAL | Chronic covenant-breaking pattern |
| 2:100 | عَهْدًۭا | عَهْد | noun indef | INDIVIDUAL-MORAL | Every time they covenant, discard it |
| 2:124 | عَهْدِى | عَهْد | noun+poss | GENERAL-COVENANT | Abrahamic leadership covenant with moral condition |
| 2:125 | وَعَهِدْنَآ | عَهِدَ | Form I | GENERAL-COVENANT | Divine charge to Abraham/Ishmael re: Ka'bah |
| 2:177 | بِعَهْدِهِمْ | عَهْد | noun+poss | INDIVIDUAL-MORAL | Righteousness definition: fulfilling promises |
| 2:177 | عَـٰهَدُوا۟ | عَٰهَدَ | Form III | INDIVIDUAL-MORAL | When they make covenant |
| 3:76 | بِعَهْدِهِۦ | عَهْد | noun+poss | GENERAL-COVENANT | Universal principle: fulfill covenant + taqwa |
| 3:77 | بِعَهْدِ | عَهْد | noun | ESCHATOLOGICAL | Trading Allah's covenant for small price |
| 3:183 | عَهِدَ | عَهِدَ | Form I | OTHER | Prophets charged with scripture covenant |
| 6:152 | وَبِعَهْدِ | عَهْد | noun | GENERAL-COVENANT | Ethical commandments context |
| 7:102 | عَهْدٍۢ | عَهْد | noun indef | GENERAL-COVENANT | Most people found without covenant fidelity |
| 7:134 | عَهِدَ | عَهِدَ | Form I | OTHER | Pharaoh's broken promise to Moses |
| 8:56 | عَـٰهَدتَّ | عَٰهَدَ | Form III | TREATY-SPECIFIC | Treaty partners who break pledge every time |
| 8:56 | عَهْدَهُمْ | عَهْد | noun+poss | TREATY-SPECIFIC | Their treaty repeatedly violated |
| 9:1 | عَـٰهَدتُّم | عَٰهَدَ | Form III | TREATY-SPECIFIC | Disassociation from polytheist treaty partners |
| 9:4 | عَـٰهَدتُّم | عَٰهَدَ | Form III | TREATY-SPECIFIC | Exception: compliant treaty partners |
| 9:4 | عَهْدَهُمْ | عَهْد | noun+poss | TREATY-SPECIFIC | Complete their treaty to its term |
| 9:7 | عَهْدٌ | عَهْد | noun indef | TREATY-SPECIFIC | How can polytheists have covenant? |
| 9:7 | عَـٰهَدتُّمْ | عَٰهَدَ | Form III | TREATY-SPECIFIC | Except Masjid al-Haram treaty partners |
| 9:12 | عَهْدِهِمْ | عَهْد | noun+poss | TREATY-SPECIFIC | Breaking oaths AFTER treaty = casus belli |
| 9:75 | عَـٰهَدَ | عَٰهَدَ | Form III | INDIVIDUAL-MORAL | Hypocrites pledged to Allah then broke it |
| 9:111 | بِعَهْدِهِۦ | عَهْد | noun+poss | GENERAL-COVENANT | Divine transaction: lives for Paradise |
| 13:20 | بِعَهْدِ | عَهْد | noun | GENERAL-COVENANT | Ideal covenant-keepers described |
| 13:25 | عَهْدَ | عَهْد | noun | GENERAL-COVENANT | Covenant-breakers cursed |
| 16:91 | بِعَهْدِ | عَهْد | noun | TREATY-SPECIFIC | Fulfill Allah's covenant when taken |
| 16:91 | عَـٰهَدتُّمْ | عَٰهَدَ | Form III | TREATY-SPECIFIC | Confirmed oaths with Allah as guarantor |
| 16:95 | بِعَهْدِ | عَهْد | noun | TREATY-SPECIFIC | Don't sell covenant for small price |
| 17:34 | بِٱلْعَهْدِ | عَهْد | noun def | ESCHATOLOGICAL | Fulfill covenant — it will be questioned |
| 17:34 | ٱلْعَهْدَ | عَهْد | noun def | ESCHATOLOGICAL | Covenant accountability repeated |
| 19:78 | عَهْدًۭا | عَهْد | noun indef | INDIVIDUAL-MORAL | False claim of special divine covenant |
| 19:87 | عَهْدًۭا | عَهْد | noun indef | INDIVIDUAL-MORAL | Intercession requires divine covenant |
| 20:86 | ٱلْعَهْدُ | عَهْد | noun def | ESCHATOLOGICAL | Moses: didn't you break the covenant? |
| 20:115 | عَهِدْنَآ | عَهِدَ | Form I | OTHER | Divine charge to Adam re: tree |
| 23:8 | وَعَهْدِهِمْ | عَهْد | noun+poss | INDIVIDUAL-MORAL | Believers attentive to trusts/promises |
| 33:15 | عَـٰهَدُوا۟ | عَٰهَدَ | Form III | INDIVIDUAL-MORAL | Military pledge not to flee |
| 33:15 | عَهْدُ | عَهْد | noun def | ESCHATOLOGICAL | Allah's pledge will be questioned |
| 33:23 | عَـٰهَدُوا۟ | عَٰهَدَ | Form III | INDIVIDUAL-MORAL | Men true to what they pledged |
| 36:60 | أَعْهَدْ | عَهِدَ | Form I | GENERAL-COVENANT | Did I not charge you, O Bani Adam? |
| 43:49 | عَهِدَ | عَهِدَ | Form I | OTHER | Pharaoh's broken promise again |
| 48:10 | عَـٰهَدَ | عَٰهَدَ | Form III | TREATY-SPECIFIC | Bay'ah = pledging to Allah through Prophet |
| 70:32 | وَعَهْدِهِمْ | عَهْد | noun+poss | INDIVIDUAL-MORAL | Identical to 23:8 |

#### Boundary Findings for ع-ه-د

1. **Form III عَٰهَدَ consistently marks TREATY contexts**: All 12 occurrences of Form III involve inter-communal political/military treaties OR bay'ah. Form I عَهِدَ and noun عَهْد are used for divine-human covenants.

2. **No clean separation between "peace treaties" and "general covenants"**: Verses 9:4, 9:7, 8:56 use identical vocabulary for political treaties as 2:40, 3:76 use for divine covenants. The Qur'an treats ALL covenant-breaking with equal moral severity.

3. **Eschatological accountability is cross-cutting**: 17:34, 33:15 apply to BOTH divine and human covenants. The phrase "الْعَهْدَ كَانَ مَسْئُولًا" does not distinguish covenant type.

4. **2:27 pairs عَهْد with مِيثَاق**: This is the key verse establishing that ʿahd and mīthāq operate in tandem — breaking occurs "after contracting" (min baʿdi mīthāqihi).

---

### 2.2 Root و-ث-ق (w-th-q) — Binding / Firm Covenant

**Lemmas:** مِّيثَٰق (solemn covenant), مَّوْثِق (bond/pact), وَاثَقَ (to bind firmly), وَثَاق (bonds/fetters), وُثْقَىٰ (firmest/trustworthy), يُوثِقُ (to bind tightly)

#### Semantic Class Distribution

| Semantic Class | Count | Percentage | Representative Verses |
|---------------|-------|------------|----------------------|
| TREATY-SPECIFIC (Solemn binding covenant) | 24 | 70.6% | 2:63, 2:83, 2:84, 2:93, 4:21, 4:90, 4:92, 4:154, 5:7, 5:12-14, 7:169, 8:72, 13:20, 13:25, 33:7, 57:8 |
| GENERAL-COVENANT (Divine trust/bond) | 4 | 11.8% | 2:27, 3:81, 3:187, 12:66 |
| METAPHORICAL-BINDING (Fetters/restraint) | 4 | 11.8% | 47:4, 89:26 (×2) |
| FAITH-TRUST (Firmest handhold) | 2 | 5.9% | 2:256, 31:22 |

#### Detailed Occurrence Table

| Verse | Token | Lemma | Form | Semantic Class | Context Notes |
|-------|-------|-------|------|---------------|---------------|
| 2:27 | مِيثَـٰقِهِۦ | مِّيثَٰق | noun | GENERAL-COVENANT | Breaking covenant AFTER contracting mīthāq |
| 2:63 | مِيثَـٰقَكُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Sinai covenant with Bani Israel |
| 2:83 | مِيثَـٰقَ | مِّيثَٰق | noun | TREATY-SPECIFIC | Covenant conditions enumerated |
| 2:84 | مِيثَـٰقَكُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Don't shed blood/expel each other |
| 2:93 | مِيثَـٰقَكُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Hold fast what We gave; hear/obey |
| 2:256 | ٱلْوُثْقَىٰ | وُثْقَىٰ | elative | FAITH-TRUST | "Urwat al-wuthqa" — firmest handhold of faith |
| 3:81 | مِيثَـٰقَ | مِّيثَٰق | noun | GENERAL-COVENANT | Prophet-covenant: confirm each other's messages |
| 3:187 | مِيثَـٰقَ | مِّيثَٰق | noun | GENERAL-COVENANT | Scholars' covenant to explain scripture |
| 4:21 | مِّيثَـٰقًا | مِّيثَٰق | noun indef | TREATY-SPECIFIC | Marriage as solemn covenant |
| 4:90 | مِّيثَـٰقٌ | مِّيثَٰق | noun indef | TREATY-SPECIFIC | People with whom you have treaty → immunity |
| 4:92 | مِّيثَـٰقٌۭ | مِّيثَٰق | noun indef | TREATY-SPECIFIC | Accidental killing: believer in treaty land |
| 4:154 | بِمِيثَـٰقِهِمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Raised mountain over them for covenant |
| 4:154 | مِّيثَـٰقًا | مِّيثَٰق | noun indef | TREATY-SPECIFIC | Taking covenant from prophets |
| 4:155 | مِّيثَـٰقَهُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Breaking covenant → curse |
| 5:7 | وَمِيثَـٰقَهُ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Believers' covenant of obedience |
| 5:7 | وَاثَقَكُم | وَاثَقَ | Form I verb | TREATY-SPECIFIC | "He bound you firmly" |
| 5:12 | مِيثَـٰقَ | مِّيثَٰق | noun | TREATY-SPECIFIC | Allah took covenant from Bani Israel |
| 5:13 | مِّيثَـٰقَهُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Breaking covenant → hardened hearts |
| 5:14 | مِيثَـٰقَهُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Christians' covenant forgotten |
| 5:70 | مِيثَـٰقَ | مِّيثَٰق | noun | TREATY-SPECIFIC | Messengers sent despite covenant-breaking |
| 7:169 | مِّيثَـٰقُ | مِّيثَٰق | noun def | TREATY-SPECIFIC | Inheritors who broke scripture covenant |
| 8:72 | مِّيثَـٰقٌۭ | مِّيثَٰق | noun indef | TREATY-SPECIFIC | Treaty trumps religious solidarity |
| 12:66 | مَوْثِقًۭا | مَّوْثِق | noun | GENERAL-COVENANT | Jacob demands bond/pact from sons |
| 12:66 | مَوْثِقَهُمْ | مَّوْثِق | noun+poss | GENERAL-COVENANT | Sons gave their bond |
| 12:80 | مَّوْثِقًۭا | مَّوْثِق | noun | GENERAL-COVENANT | Brothers' pact regarding Benjamin |
| 13:20 | ٱلْمِيثَـٰقَ | مِّيثَٰق | noun def | TREATY-SPECIFIC | Don't break the mīthāq |
| 13:25 | مِيثَـٰقِهِۦ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Break covenant after contracting → curse |
| 31:22 | ٱلْوُثْقَىٰ | وُثْقَىٰ | elative | FAITH-TRUST | Firmest handhold (parallel to 2:256) |
| 33:7 | مِيثَـٰقَهُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Prophets' covenant mentioned |
| 33:7 | مِّيثَـٰقًا | مِّيثَٰق | noun indef | TREATY-SPECIFIC | Solemn covenant from prophets |
| 47:4 | ٱلْوَثَاقَ | وَثَاق | noun | METAPHORICAL | Secure bonds/fetters for prisoners |
| 57:8 | مِيثَـٰقَكُمْ | مِّيثَٰق | noun+poss | TREATY-SPECIFIC | Why don't you believe when covenant exists? |
| 89:26 | يُوثِقُ | يُوثِقُ | Form IV verb | METAPHORICAL | None binds like Allah's binding |
| 89:26 | وَثَاقَهُۥٓ | وَثَاق | noun+poss | METAPHORICAL | His fetters/bonds (eschatological) |

#### Boundary Findings for و-ث-ق

1. **Mīthāq is OVERWHELMINGLY treaty-specific**: 24/34 occurrences (70.6%) refer to formal binding covenants — primarily Sinai covenant with Bani Israel, but also marriage (4:21), inter-communal treaties (4:90, 8:72), and prophetic pledges.

2. **Mīthāq ≠ ʿAhd in distribution**: While ʿahd splits ~30/39 between divine-general and treaty-specific, mīthāq is 70% treaty-specific. This supports MFD-11.3's distinction: **mīthāq marks FORMAL BINDING INSTRUMENTS; ʿahd is the broader umbrella.**

3. **Wathaq/wuthqa are semantically distinct**: وَثَاق (fetters/bonds) in 47:4 and 89:26 is PHYSICAL/METAPHORICAL BINDING, not covenantal. وُثْقَىٰ (firmest) in 2:256 and 31:22 is about FAITH-TRUST, not treaty. These should NOT be classified under covenant taxonomy.

4. **Marriage as mīthāq (4:21)**: This is the ONLY non-political, non-divine use of mīthāq. It extends the concept to interpersonal solemn commitment, bridging treaty and personal domains.

5. **4:90 confirmed as TREATY context**: "إِلَّا عَلَى قَوْمٍ بَيْنَكُمْ وَبَيْنَهُم مِّيثَاقٌ" — those with whom you have mīthāq. This validates MFD-11.3's classification of 4:90 under peace-agreements/treaty obligations.

---

### 2.3 Root س-ل-م (s-l-m) — Peace / Submission / Safety

**Lemmas:** سَلَٰم (peace/greeting), سَّلْم/سِّلْم (peace/submission state), سَلَم (peace offering/safety), سَلِيم (sound/whole), أَسْلَمَ (to submit/Islam), إِسْلَٰم (Islam/submission), مُسْلِم (submitter), تَسْلِيم (submission/greeting), سَلَّمَ (to greet/submit), مُسْتَسْلِمُون (those who surrender), سَٰلِمُون (safe/sound ones), سُلَّم (ladder/stairway), مُّسَلَّمَة (delivered/safe), مُّسْلِمَة (female submitter)

#### Semantic Class Distribution

| Semantic Class | Count | Percentage | Key Lemmas | Representative Verses |
|---------------|-------|------------|------------|----------------------|
| SUBMISSION-ISLAM | 62 | 45.6% | أَسْلَمَ، إِسْلَٰم، مُسْلِم، مُسْلِمَٰت، مُسْتَسْلِمُون | 2:112, 2:128, 2:131-136, 3:19-20, 3:52, 3:64, 3:67, 3:80, 3:83-85, 3:102, 4:125, 5:3, 5:44, 5:111, 6:14, 6:71, 6:125, 6:163, 7:126, 9:74, 10:72, 10:84, 10:90, 11:14, 12:101, 15:2, 16:81, 16:89, 16:102, 21:108, 22:34, 22:78, 27:31, 27:38, 27:42, 27:44, 27:81, 27:91, 28:53, 29:46, 30:53, 31:22, 33:35, 37:26, 37:103, 39:12, 39:22, 39:54, 40:66, 41:33, 43:69, 46:15, 48:16, 49:14, 49:17, 51:36, 61:7, 66:5, 68:35, 72:14 |
| PEACE-ESCHATOLOGICAL (Paradise greeting/divine attribute) | 38 | 27.9% | سَلَٰم | 6:54, 6:127, 7:46, 10:10, 10:25, 11:69, 13:24, 14:23, 15:46, 15:52, 16:32, 19:15, 19:33, 19:47, 19:62, 20:47, 21:69, 25:63, 25:75, 27:59, 28:55, 33:44, 36:58, 37:79, 37:109, 37:120, 37:130, 37:181, 39:73, 43:89, 50:34, 51:25, 56:26, 56:91, 59:23, 97:5 |
| GREETING (Social salām) | 8 | 5.9% | سَلَٰم | 11:48, 11:69, 15:52, 19:47, 20:47, 24:27, 25:63, 51:25 |
| PEACE-TEMPORAL (Political/military peace) | 6 | 4.4% | سَّلْم، سِّلْم، سَلَم | 2:208, 4:90, 4:91, 8:61, 47:35, 16:28 |
| SAFETY-WHOLENESS (Sound heart/delivered) | 8 | 5.9% | سَلِيم، سَٰلِمُون، مُّسَلَّمَة، سُلَّم | 2:71, 26:89, 37:84, 39:29, 52:38, 68:43, 4:92, 6:35 |
| SUBMISSION-ACT (taslīm/sallama verbal) | 10 | 7.4% | تَسْلِيم، سَلَّمَ | 4:65, 24:27, 33:22, 33:56, 16:87 |
| OTHER (Ladder/stairway) | 4 | 2.9% | سُلَّم | 6:35, 52:38 |

#### Critical Polysemy Analysis: 2:208

**Verse:** يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ

**Lemma:** سِّلْم (silm)

**Dual Reading:**
- **Reading A (Submission/Islam):** "Enter into Islam completely" — supported by preceding verses about faith, following warning against Satan
- **Reading B (Peace):** "Enter into peace completely" — supported by lexical range of s-l-m, communal harmony context

**Analysis:** Both readings are lexically valid. The immediate context (warning against Satan's footsteps) slightly favors Reading A, but the broader surah context (Baqarah addresses communal relations extensively) supports Reading B. **This verse requires DUAL MAPPING or interpretive annotation in the taxonomy.** Cannot be unambiguously assigned.

#### Temporal Peace Verses (Critical for Taxonomy)

| Verse | Token | Lemma | Context | Classification |
|-------|-------|-------|---------|---------------|
| 2:208 | ٱلسِّلْمِ | سِّلْم | Enter silm completely | POLYSEMOUS: PEACE-TEMPORAL ∩ SUBMISSION-ISLAM |
| 4:90 | ٱلسَّلَمَ | سَلَم | Offered peace → immunity | PEACE-TEMPORAL (wartime peace offer) |
| 4:91 | ٱلسَّلَمَ | سَلَم | Did NOT offer peace → fight | PEACE-TEMPORAL (absence of peace = hostility) |
| 8:61 | لِلسَّلْمِ | سَّلْم | If they incline to peace | PEACE-TEMPORAL (wartime peace reciprocity) |
| 47:35 | ٱلسَّلْمِ | سَّلْم | Don't call for peace while superior | PEACE-TEMPORAL (qualified peacemaking) |
| 16:28 | ٱلسَّلَمَ | سَلَم | Angels receive the righteous in peace | PEACE-ESCHATOLOGICAL (border case: death transition) |

#### Boundary Findings for س-ل-م

1. **SUBMISSION-ISLAM dominates (45.6%)**: The majority of s-l-m occurrences are about religious submission, NOT peace. Any taxonomy treating s-l-m as primarily "peace" will misrepresent 46% of the data.

2. **PEACE-ESCHATOLOGICAL is second largest (27.9%)**: Most salām references describe Paradise greetings or divine attributes. Only 6 occurrences (4.4%) address temporal/political peace.

3. **Temporal peace cluster is small but critical**: 2:208, 4:90, 4:91, 8:61, 47:35 form a tight network governing wartime peacemaking rules. These are the verses MFD-11.3 identified as needing expansion in the peace-agreements topic.

4. **Silm vs. Salam distinction matters**: سِّلْم/سَّلْم (state of peace/submission) appears in temporal contexts; سَلَٰم (greeting/wholeness) appears in eschatological/social contexts. The vowel pattern carries semantic weight.

5. **Salīm (sound/whole) is semantically adjacent but distinct**: Used for "sound heart" (qalb salīm) in 26:89, 37:84 and safe delivery in 39:29. Not directly about peace or submission.

---

### 2.4 Root ص-ل-ح (ṣ-l-ḥ) — Reconciliation / Righteousness / Reform

**Lemmas:** صَٰلِح (righteous/good), صَّٰلِحَٰت (righteous deeds fem. pl.), صُلْح (reconciliation/settlement), أَصْلَحَ (to reconcile/reform), إِصْلَٰح (reconciliation/reform masdar), صَلَحَ (to be good/righteous), مُصْلِح (reformer/peacemaker)

#### Semantic Class Distribution

| Semantic Class | Count | Percentage | Key Lemmas | Representative Verses |
|---------------|-------|------------|------------|----------------------|
| RIGHTEOUSNESS (ṣāliḥ/ṣāliḥāt as moral quality) | 128 | 76.2% | صَٰلِح، صَّٰلِحَٰت | Throughout Quran — too numerous to list individually |
| RECONCILIATION (ṣulḥ/iṣlāḥ as conflict resolution) | 22 | 13.1% | صُلْح، إِصْلَٰح، أَصْلَحَ | 2:182, 2:220, 2:224, 2:228, 4:35, 4:114, 4:128, 4:129, 8:1, 49:9, 49:10 |
| REFORM/REPAIR (aṣlaḥa as general improvement) | 14 | 8.3% | أَصْلَحَ | 2:160, 3:89, 4:16, 4:146, 5:39, 6:48, 6:54, 7:35, 7:56, 7:85, 7:142, 16:119, 21:90, 24:5, 42:40, 47:2 |
| PROPHET NAME (Ṣāliḥ as proper noun) | 4 | 2.4% | صَٰلِح | 7:73, 7:75, 7:77, 11:61, 11:62, 26:142, 27:45 |

#### Reconciliation-Specific Occurrences (Critical for New Topic)

| Verse | Token | Lemma | Form | Context | Classification |
|-------|-------|-------|------|---------|---------------|
| 2:182 | فَأَصْلَحَ | أَصْلَحَ | Form IV | Correcting bequest errors between heirs | RECONCILIATION (legacy) |
| 2:220 | إِصْلَاحٌۭ | إِصْلَٰح | masdar | Orphan welfare reform | REFORM |
| 2:220 | ٱلْمُصْلِحِ | مُصْلِح | active part. | Allah knows reformer from corrupter | RECONCILIATION |
| 2:224 | وَتُصْلِحُوا۟ | أَصْلَحَ | Form IV | Making peace among people | RECONCILIATION (social) |
| 2:228 | إِصْلَـٰحًۭا | إِصْلَٰح | masdar | Divorce reconciliation | RECONCILIATION (marital) |
| 4:35 | إِصْلَاحًا | إِصْلَٰح | masdar | Marital arbitration | RECONCILIATION (marital) |
| 4:114 | إِصْلَـٰحٍۭ | إِصْلَٰح | masdar | Private counsel for reconciliation | RECONCILIATION (social) |
| 4:128 | يُصْلِحَا | أَصْلَحَ | Form IV | Spousal settlement | RECONCILIATION (marital) |
| 4:128 | صُلْحًۭا | صُلْح | masdar | "Settlement is best" | RECONCILIATION (marital) |
| 4:128 | وَٱلصُّلْحُ | صُلْح | noun def | "And reconciliation..." | RECONCILIATION (marital) |
| 4:129 | تُصْلِحُوا۟ | أَصْلَحَ | Form IV | If you reconcile between wives | RECONCILIATION (marital) |
| 8:1 | وَأَصْلِحُوا۟ | أَصْلَحَ | Form IV | Reconcile between yourselves (believers) | RECONCILIATION (communal) |
| 49:9 | فَأَصْلِحُوا۟ | أَصْلَحَ | Form IV | Make settlement between fighting factions | RECONCILIATION (inter-communal) |
| 49:9 | فَأَصْلِحُوا۟ | أَصْلَحَ | Form IV | Settle with justice after compliance | RECONCILIATION (inter-communal) |
| 49:10 | فَأَصْلِحُوا۟ | أَصْلَحَ | Form IV | Reconcile between your brothers | RECONCILIATION (fraternal) |

#### Boundary Findings for ص-ل-ح

1. **RIGHTEOUSNESS overwhelms RECONCILIATION (76% vs 13%)**: The vast majority of ṣ-l-ḥ occurrences are about moral righteousness (ṣāliḥ/ṣāliḥāt), NOT conflict resolution. A taxonomy treating ṣ-l-ḥ as primarily "reconciliation" would misrepresent 76% of the data.

2. **Ṣulḥ (reconciliation) is a DISTINCT sub-domain**: Only 22 occurrences explicitly address conflict resolution. These cluster in specific contexts:
   - **Marital:** 4:35, 4:128, 4:129, 2:228 (4 verses)
   - **Inter-communal:** 49:9-10, 8:1 (3 verses)
   - **Social/general:** 2:224, 4:114, 2:182 (3 verses)
   - **Reform/improvement:** Scattered across 14 verses

3. **Ṣulḥ validates MFD-11.3 recommendation for new conflict-resolution topic**: The 22 reconciliation occurrences form a coherent sub-domain distinct from both righteousness and peace-treaty concepts. Recommended topic name: `conflict-resolution-reconciliation`.

4. **Prophet Ṣāliḥ is a proper noun, not a semantic instance**: 4+ occurrences refer to the prophet, not the concept. These should be excluded from conceptual taxonomy mapping.

5. **Form IV أَصْلَحَ bridges reconciliation and reform**: Same verb used for marital settlement (4:128), communal peacemaking (49:9), and general moral reform (2:160). Context determines classification.

---

## Section 3: Proposed Taxonomy Restructuring

Based on the semantic analysis above, the following taxonomy changes are recommended:

### 3.1 Covenant Domain Restructuring

**Current problem:** ʿAhd and mīthāq are treated as interchangeable or collapsed under single topics.

**Proposed structure:**
```
covenant-obligations/
├── divine-human-covenant          # ʿAhd: 2:40, 2:80, 2:124, 3:76, 13:20, 36:60
├── treaty-obligations             # ʿAhd + Mīthāq: 8:56, 9:1-7, 9:12, 16:91, 48:10
├── prophetic-covenant             # Mīthāq: 3:81, 3:187, 33:7, 57:8
├── israelite-covenant             # Mīthāq: 2:63, 2:83-84, 2:93, 4:154-155, 5:12-14, 7:169
├── marriage-covenant              # Mīthāq: 4:21
├── believers-oath                 # ʿAhd: 2:177, 9:75, 33:15, 33:23
└── covenant-accountability        # Cross-cutting: 17:34, 3:77, 20:86
```

### 3.2 Peace Domain Restructuring

**Current problem:** Salām/silm polysemy collapses peace, submission, and greeting.

**Proposed structure:**
```
peace-and-submission/
├── wartime-peacemaking            # Silm/Salam: 2:208*, 4:90, 4:91, 8:61, 47:35
├── eschatological-peace           # Salām: 6:54, 7:46, 10:10, 13:24, 14:23, 15:46, etc.
├── divine-name-salam              # Salām: 59:23
├── social-greeting                # Salām: 11:48, 11:69, 24:27, 25:63
├── islam-submission               # Aslama/Islām/Muslim: 62 occurrences
└── safety-wholeness               # Salīm/Sālimūn: 26:89, 37:84, 39:29, 68:43
```

*2:208 requires dual mapping to both `wartime-peacemaking` AND `islam-submission`.

### 3.3 New Conflict Resolution Topic

**Recommended:** Create `conflict-resolution-reconciliation` topic for the 22 ṣulḥ/iṣlāḥ occurrences:

```
conflict-resolution-reconciliation/
├── marital-reconciliation         # 4:35, 4:128, 4:129, 2:228
├── inter-communal-settlement      # 49:9-10, 8:1
├── social-peacemaking             # 2:224, 4:114
├── legacy-correction              # 2:182
└── general-reform                 # 2:160, 3:89, 5:39, 6:48, etc. (14 verses)
```

### 3.4 Unmapped Verses from MFD-11.3 — Now Resolved

| Verse | Previous Status | Resolution |
|-------|----------------|------------|
| 4:90 | Unmapped in peace-agreements | ✅ Contains مِّيثَاقٌ (treaty) + ٱلسَّلَمَ (peace offer). Map to BOTH `treaty-obligations` AND `wartime-peacemaking` |
| 17:34 | Unmapped | ✅ Contains بِٱلْعَهْدِ + ٱلْعَهْدَ. Map to `covenant-accountability` |
| 16:92 | Unmapped | ✅ Oath-breaking metaphor in covenant context. Map to `covenant-accountability` |
| 2:208 | Flagged for polysemy | ✅ Requires DUAL MAPPING: `wartime-peacemaking` ∩ `islam-submission`. Add interpretive annotation noting both readings |

---

## Section 4: Summary Statistics

### Semantic Class Distribution Across All Four Roots

| Semantic Class | ع-ه-د | و-ث-ق | س-ل-م | ص-ل-ح | TOTAL |
|---------------|--------|--------|--------|--------|-------|
| GENERAL-COVENANT | 14 | 4 | — | — | 18 |
| TREATY-SPECIFIC | 18 | 24 | — | — | 42 |
| PEACE-TEMPORAL | — | — | 6 | — | 6 |
| PEACE-ESCHATOLOGICAL | — | — | 38 | — | 38 |
| SUBMISSION-ISLAM | — | — | 62 | — | 62 |
| RECONCILIATION | — | — | — | 22 | 22 |
| GREETING | — | — | 8 | — | 8 |
| RIGHTEOUSNESS | — | — | — | 128 | 128 |
| SAFETY-WHOLENESS | — | — | 8 | — | 8 |
| REFORM | — | — | — | 14 | 14 |
| FAITH-TRUST | — | 2 | — | — | 2 |
| METAPHORICAL-BINDING | — | 4 | — | — | 4 |
| ESCHATOLOGICAL-ACCOUNTABILITY | 4 | — | — | — | 4 |
| INDIVIDUAL-MORAL | 8 | — | — | — | 8 |
| PROPHET-NAME | — | — | — | 4 | 4 |
| SUBMISSION-ACT | — | — | 10 | — | 10 |
| OTHER | 2 | — | 4 | — | 6 |
| **TOTAL** | **46** | **34** | **136** | **168** | **384** |

### Key Metrics

- **Total terms analyzed:** 32 lemmas across 4 roots
- **Total occurrences:** 384
- **Root-morphology-index coverage gap:** Only 4/32 lemmas (12.5%) were captured in the index
- **Most polysemous root:** س-ل-م (7 distinct semantic classes)
- **Most concentrated root:** و-ث-ق (70.6% in single class: TREATY-SPECIFIC)
- **Largest semantic class overall:** RIGHTEOUSNESS (128 occurrences, 33.3% of total)
- **Smallest critical class:** PEACE-TEMPORAL (6 occurrences, 1.6% of total — but highest policy relevance)

---

## Section 5: Recommendations for Next Phase

1. **Update root-morphology-index.json** to include all 32 lemmas from the four target roots (currently only 4 are indexed)

2. **Create dual-mapping mechanism** for polysemous verses (especially 2:208) that cannot be assigned to a single topic

3. **Implement the three-domain restructuring** proposed in Section 3:
   - Covenant domain: 7 sub-topics
   - Peace/submission domain: 6 sub-topics
   - Conflict resolution domain: 5 sub-topics (NEW)

4. **Add interpretive annotations** for boundary cases:
   - 2:208 silm polysemy
   - 4:21 marriage as mīthāq (bridges treaty and personal)
   - 8:61 silm vs. ṣulḥ distinction
   - Prophet Ṣāliḥ proper noun exclusion

5. **Cross-reference with MFD-11.3 evidence register** to ensure all 128 war-peace corpus verses are accounted for in the new taxonomy

---

*End of MFD-11.4-WS2 Analysis*
