# MFD-11.2 Scholarly Review — Batch 7

## 1. Peace Agreements (`peace-agreements`)

### 1. Conceptual Definition
The topic `peace-agreements` claims to represent "Islamic peace agreements" with scope defined as "Treaties, ceasefire, conditions." It is positioned under the `war-peace-conflict` domain and `peace-treaties` dimension. The Arabic title is الاتفاقيات السلمية (al-ittifāqiyyāt al-silmiyya) and the Urdu title is امن کے معاہدے (amn ke muʿāhidah). Search alias: "peace treaties." Related topics are listed as `treaty-fulfillment` and `conflict-prevention`, but neither exists in the current taxonomy (verified via lookup — both return empty). The topic asserts 6 āyah mappings, all with provenance "pending-scholarly-review." Provenance status confirms this topic has never been validated by scholarly review.

**Critical observation:** Unlike many previously audited topics that imposed modern frameworks onto Qur'anic material, `peace-agreements` addresses a genuinely Qur'anic subject. The Qur'an explicitly legislates on treaties (ʿahd, mīthāq), truces (sulḥ/silm), and covenant fulfillment in multiple direct injunctions. However, the English label "Peace Agreements" carries modern diplomatic connotations (formal interstate accords, UN-style frameworks) that may narrow or distort the broader Qur'anic concept of ʿahd/mīthāq, which encompasses divine-human covenants, inter-communal treaties, commercial contracts, and prophetic pledges alongside what we would call "peace treaties."

### 2. Qur'anic Grounding

| Verse | Mapping Type | Content Summary | Assessment |
|-------|-------------|------------------|------------|
| 8:61 | EXPLICIT_INSTRUCTION | "وَإِن جَنَحُواْ لِلسَّلۡمِ فَٱجۡنَحۡ لَهَا وَتَوَكَّلۡ عَلَى ٱللَّهِ" — And if they incline to peace (al-silm), then incline to it [also] and rely upon Allah. | **Strongest possible grounding.** This is the primary Qur'anic directive on reciprocal peacemaking during armed conflict. Extraction file `008-al-anfal-p3.json` confirms the full text. The extraction notes describe this as "Peace-reciprocity (8:61) balances martial readiness with diplomatic openness." Correctly classified as EXPLICIT_INSTRUCTION. This verse alone justifies the topic's existence. |
| 9:4 | DIRECT_REFERENCE | "إِلَّا ٱلَّذِينَ عَٰهَدتُّم مِّنَ ٱلۡمُشۡرِكِينَ ثُمَّ لَمۡ يَنقُصُوكُمۡ شَيۡـٔٗا... فَأَتِمُّوٓاْ إِلَيۡهِمۡ عَهۡدَهُمۡ إِلَىٰ مُدَّتِهِمۡ" — Except those polytheists with whom you made a treaty (ʿāhadttum) who have not been deficient toward you... complete their treaty (ʿahdahum) to its term. | **Direct Qur'anic legislation on treaty obligations.** Extraction file `009-at-tawbah-p1.json` confirms. Commands fulfillment of existing treaties even with polytheists during wartime, conditioned on their compliance. Correctly classified as DIRECT_REFERENCE. |
| 9:7 | DIRECT_REFERENCE | "كَيۡفَ يَكُونُ لِلۡمُشۡرِكِينَ عَهۡدٌ عِندَ ٱللَّهِ وَعِندَ رَسُولِهِۦٓ إِلَّا ٱلَّذِينَ عَٰهَدتُّمۡ عِندَ ٱلۡمَسۡجِدِ ٱلۡحَرَامِۖ فَمَا ٱسۡتَقَٰمُواْ لَكُمۡ فَٱسۡتَقِيمُواْ لَهُمۡ" — How can there be a treaty for polytheists with Allah and His Messenger? Except those with whom you made a treaty at al-Masjid al-Haram; so long as they are upright toward you, be upright toward them. | **Direct Qur'anic legislation on conditional reciprocity.** Extraction file `009-at-tawbah-p1.json` confirms. Establishes mutual uprightness (istiqāmah) as the operating principle for treaty relations. Correctly classified as DIRECT_REFERENCE. |
| 47:35 | DIRECT_REFERENCE | "فَلَا تَهِنُواْ وَتَدۡعُوٓاْ إِلَى ٱلسَّلۡمِ وَأَنتُمُ ٱلۡأَعۡلَوۡنَ" — So do not weaken and call for peace (al-silm) while you are superior. | **Contextually relevant counterbalance.** This verse restricts premature peacemaking when Muslims hold military advantage. It qualifies 8:61 by establishing that peace-seeking must not stem from weakness or defeatism. Correctly classified as DIRECT_REFERENCE. Important for preventing one-sided reading of the peace mandate. |
| 5:1 | EXPLICIT_INSTRUCTION | "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓاْ أَوۡفُواْ بِٱلۡعُقُودِ" — O you who have believed, fulfill [all] contracts (al-ʿuqūd). | **General covenant-fulfillment command.** While this verse addresses all contractual obligations (commercial, social, political), it provides the foundational ethical principle underlying treaty observance. Classified as EXPLICIT_INSTRUCTION. Note: this verse is broader than "peace agreements" specifically — it covers all ʿuqūd (contracts/covenants). Its inclusion here is defensible but indicates the topic may be absorbing general covenant theology. |
| 16:91 | EXPLICIT_INSTRUCTION | "وَأَوۡفُواْ بِعَهۡدِ ٱللَّهِ إِذَا عَٰهَدتُّمۡ وَلَا تَنقُضُواْ ٱلۡأَيۡمَٰنَ بَعۡدَ تَوۡكِيدِهَا" — Fulfill the covenant of Allah (ʿahd Allāh) when you have taken it, and do not break oaths after their confirmation. | **Explicit covenant-fulfillment command.** Extraction file `016-an-nahl-p3.json` confirms. The following verse (16:92) warns against breaking oaths like the woman who unravels her spun thread, and prohibits using oaths as deception between communities. Correctly classified as EXPLICIT_INSTRUCTION. Like 5:1, this addresses covenant fidelity broadly, not exclusively peace treaties. |

**Key passages referenced in task instructions but NOT mapped to this topic:**

| Verse | Actual Content | Current Status |
|-------|---------------|----------------|
| 4:90 | "إِلَّا ٱلَّذِينَ يَصِلُونَ إِلَىٰ قَوۡمِۭ بَيۡنَكُمۡ وَبَيۡنَهُم مِّيثَٰقٌ... فَإِنِ ٱعۡتَزَلُوكُمۡ فَلَمۡ يُقَٰتِلُوكُمۡ وَأَلۡقَوۡاْ إِلَيۡكُمُ ٱلسَّلَمَ فَمَا جَعَلَ ٱللَّهُ لَكُمۡ عَلَيۡهِمۡ سَبِيلٗا" — Those who join a people with whom you have a treaty (mīthāq)... if they withdraw and do not fight you and offer peace (al-salam), Allah has not given you authority over them. | **NOT mapped to peace-agreements.** Extraction file `004-an-nisa-p10.json` confirms this verse addresses treaty-based immunity from combat. This is a critical omission — 4:90 directly legislates on the legal consequences of treaty relationships during war. |
| 17:34 | "وَأَوۡفُواْ بِٱلۡعَهۡدِۖ إِنَّ ٱلۡعَهۡدَ كَانَ مَسۡـُٔولٗا" — Fulfill the covenant (al-ʿahd); indeed, the covenant will be questioned about. | **NOT mapped to peace-agreements.** Extraction file `017-al-isra-p2.json` confirms. Establishes eschatological accountability for covenant violation. Another significant omission. |
| 16:92 | Warning against breaking oaths as deception between communities (dakhala baynakum an takūna ummatun hiya arbā min ummah). | **NOT mapped.** Directly addresses misuse of treaties as strategic deception — highly relevant to peace-agreements scope. |
| 2:208 | "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُواْ ٱدۡخُلُواْ فِي ٱلسِّلۡمِ كَآفَّةٗ" — Enter into peace/submission (al-silm) completely. | **NOT mapped.** Foundational silm command. Extraction `002-al-baqarah-p32.json` labels this "command to enter peace/silm completely." |

**Assessment:** Of 6 mapped verses, all 6 are genuinely relevant and correctly classified. Three (8:61, 9:4, 9:7) are specifically about interstate/conflict treaties. Two (5:1, 16:91) are general covenant-fulfillment commands that provide ethical foundation but are broader than "peace agreements" per se. One (47:35) provides essential qualification. The mapping quality is significantly higher than most audited topics. However, critical verses (4:90, 17:34, 16:92, 2:208) are missing, indicating incomplete coverage despite genuine Qur'anic grounding.

### 3. Semantic Integrity
- **English label "Peace Agreements"**: Functional but potentially narrowing. Modern English "peace agreement" typically refers to formal diplomatic instruments ending armed conflict (e.g., Oslo Accords, Dayton Agreement). The Qur'anic concept encompasses a wider semantic field: ʿahd (covenant/treaty/pact), mīthāq (solemn covenant/charter), ʿuqūd (contracts/bonds), silm/salām (peace/submission/reconciliation), and sulḥ (settlement/reconciliation). The English label captures the conflict-resolution dimension but may exclude the broader covenant-theology dimension (divine-human covenants, prophetic pledges, commercial bonds).
- **Arabic label "الاتفاقيات السلمية" (al-ittifāqiyyāt al-silmiyya)**: A modern Arabic compound meaning "peaceful agreements/accords." The term ittifāqiyyāt is contemporary diplomatic vocabulary, not classical fiqh or tafsīr terminology. Classical sources use ʿahd, mīthāq, ṣulḥ, muwādaʿah, hudnah, amān. The adjective silmiyya derives from silm/salām but the compound phrase is editorial rather than traditional.
- **Urdu title "امن کے معاہدے" (amn ke muʿāhidah)**: More semantically faithful than the Arabic. Muʿāhidah is the standard Urdu/Arabic term for treaty/covenant and appears in classical Islamic legal discourse. Amn (peace/security) is Qur'anic vocabulary. This label better preserves the Qur'anic conceptual meaning than the Arabic or English versions.
- **Scope note "Treaties, ceasefire, conditions"**: Reasonably accurate but "ceasefire" is anachronistic (modern military term). The Qur'anic equivalents would be hudnah (truce), muwādaʿah (mutual non-aggression), or tark al-qitāl (cessation of fighting). "Conditions" appropriately signals that Qur'anic peace is conditional (reciprocity, compliance), not absolute pacifism.

**Verdict:** Moderate semantic integrity. The concept is genuinely Qur'anic, unlike framework-imposed topics such as `emotional-intelligence`. However, the English and Arabic labels carry modern diplomatic connotations that slightly narrow the Qur'anic semantic field. The Urdu label is the most faithful. The core issue is whether "peace agreements" should absorb general covenant theology (5:1, 16:91) or remain focused on conflict-specific treaties (8:61, 9:4, 9:7, 47:35).

### 4. Taxonomic Distinction

| Sibling/Related Topic | Domain/Dimension | Mappings | Relationship to peace-agreements |
|----------------------|-------------------|----------|----------------------------------|
| `treaty-fulfillment` | Listed as relatedTopicId | N/A | **Does not exist.** Referenced in topic definition but absent from taxonomy. This is a phantom relationship. If created, it would likely overlap heavily with `peace-agreements` since 5:1, 16:91, and 17:34 are fundamentally about fulfillment rather than agreement-making. |
| `conflict-prevention` | Listed as relatedTopicId | N/A | **Does not exist.** Another phantom relationship. Would presumably cover deterrence (8:60), preparedness, and de-escalation themes. |
| General covenant topics | Various domains | Many | **Potential absorption risk.** The grep results show extensive covenant (ʿahd/mīthāq) content across Al-Baqarah, Al-Imran, Ta-Ha, Ahzab, and other surahs covering divine-human covenants, prophetic pledges, Bani Israel covenant violations, and Adamic covenant. If a general "covenants-ahd" topic exists or is created, verses 5:1 and 16:91 may belong there rather than under `peace-agreements`. |
| War/combat topics | war-peace-conflict domain | Various | **Complementary distinction.** Verses about fighting (qitāl), preparation (8:60), and prisoner ethics (8:67-71) are properly separated from peace-agreement verses. The taxonomy correctly distinguishes war-making from peace-making within the same domain. |

**Critical observations on duplication/conflation:**

1. **Phantom related topics**: Both `treaty-fulfillment` and `conflict-prevention` are referenced but do not exist. This suggests the topic was designed as part of a planned cluster that was never implemented. These gaps should be addressed either by creating the missing topics or removing the phantom references.

2. **Covenant vs. treaty boundary**: Verses 5:1 ("fulfill all contracts") and 16:91 ("fulfill Allah's covenant") are general covenant commands, not specific to peace treaties. Their inclusion under `peace-agreements` conflates the specific (interstate/conflict treaties) with the general (all contractual/covenantal obligations). A cleaner taxonomy would either (a) restrict `peace-agreements` to conflict-specific verses (8:61, 9:4, 9:7, 47:35, 4:90) and place general covenant verses under a separate topic, or (b) explicitly redefine the topic as "Covenants and Peace Agreements" to honestly reflect its broader scope.

3. **Missing key verses indicate incomplete extraction-to-mapping pipeline**: 4:90 (treaty-based combat immunity), 17:34 (covenant accountability), 16:92 (oath-breaking as deception), and 2:208 (enter silm completely) are all present in extraction files but unmapped. This confirms the MFD-11.1 finding that war-peace-conflict had zero candidate coverage despite rich extraction evidence — the raw material exists but was never connected to topics.

4. **Domain placement is correct**: Unlike `emotional-intelligence` (misplaced under psychology-emotions when its content belongs to ethics-character), `peace-agreements` is correctly situated under war-peace-conflict/peace-treaties. The domain architecture itself is sound for this topic.

### 5. Epistemic Provenance
- **Classification type:** Mixed — Qur'anic core with juristic/modern editorial framing
- **Source indicators:**
  - All 6 ayah mappings carry `provenance: "pending-scholarly-review"` and `sourceIds: ["quran-json"]`, indicating automated extraction without scholarly validation
  - 3 mappings are EXPLICIT_INSTRUCTION (8:61, 5:1, 16:91) and 3 are DIRECT_REFERENCE (9:4, 9:7, 47:35) — this is the strongest classification profile seen in any audited topic, confirming genuine Qur'anic basis
  - The extraction files use authentic Qur'anic terminology (ʿahd, mīthāq, silm, salam, ʿuqūd) rather than modern diplomatic language, proving the extraction layer identified these concepts organically
  - The Arabic label الاتفاقيات السلمية is modern editorial vocabulary, not classical
  - Specific fiqh rules about hudna duration limits, conditions for treaty dissolution, territorial classifications (dār al-islām/dār al-ḥarb), and diplomatic protocols are entirely absent from the topic definition and mappings — confirming the topic stays at the Qur'anic level without importing juristic elaboration
  - The phantom related topics suggest editorial planning that preceded implementation
- **Qur'anic vs. derived:** Predominantly Qur'anic. The 6 mapped verses are all direct Qur'anic injunctions about treaties, covenants, and peace. No hadith-derived or tafsīr-derived content has been imported. The modern element is limited to labeling (الأتفاقيات السلمية) and scope framing ("ceasefire"), not to the substantive content. This stands in sharp contrast to topics like `emotional-intelligence` where the entire construct was externally imposed.

### 6. Disposition
**RETAIN**

### Rationale
`peace-agreements` should be retained with targeted improvements for the following reasons:

1. **Genuine Qur'anic basis confirmed**: All 6 mapped verses are authentic, correctly classified, and directly relevant. Three are EXPLICIT_INSTRUCTION — the highest confidence category. This is not a framework-imposed topic; it addresses a subject the Qur'an explicitly legislates on.

2. **Strongest mapping profile in audit batch**: Compared to `emotional-intelligence` (1 erroneous mapping, 2 triple-mapped, 1 tangential), `peace-agreements` has zero erroneous mappings and zero triple-mappings. Every mapped verse genuinely supports the topic.

3. **Correct domain placement**: Properly situated under war-peace-conflict/peace-treaties, unlike psychology topics that misplace ethical content.

4. **Incomplete but fixable coverage**: Missing verses (4:90, 17:34, 16:92, 2:208) represent gaps in the extraction-to-mapping pipeline, not conceptual flaws. Adding these would strengthen the topic significantly.

5. **Addresses documented gap**: MFD-11.1 found zero candidate coverage in war-peace-conflict despite rich extraction evidence. This topic represents legitimate recovery of that missed content.

**Required remediation (not blocking RETAIN):**

1. **Add missing verse mappings**: 4:90 (treaty-based combat immunity), 17:34 (covenant accountability), 16:92 (oath-breaking prohibition), and 2:208 (enter silm completely) should be mapped to this topic or to a sibling topic if one is created.

2. **Resolve covenant/treaty boundary**: Decide whether 5:1 and 16:91 (general covenant commands) belong under `peace-agreements` or under a separate "covenants-ahd" topic. If retained here, update the description to acknowledge the broader scope. If moved, replace with conflict-specific verses (4:90, 2:208).

3. **Address phantom related topics**: Either create `treaty-fulfillment` and `conflict-prevention` or remove them from relatedTopicIds to eliminate dead references.

4. **Consider Arabic label revision**: Replace الاتفاقيات السلمية with a more classically grounded term such as المعاهدات والسلم (al-muʿāhadāt wa-l-silm) or العهد والميثاق في السلم والحرب (al-ʿahd wa-l-mīthāq fī l-silm wa-l-ḥarb) to better reflect the Qur'anic vocabulary.

5. **Update scope note**: Replace "ceasefire" with "truce (hudnah)" or "cessation of hostilities" to avoid anachronistic military terminology.

6. **Scholarly validation**: Change provenance from "pending-scholarly-review" to validated status once the above remediations are complete and reviewed.

### Scholarly Review Questions
1. Should verses 5:1 and 16:91 (general covenant fulfillment) remain under `peace-agreements`, or should a separate `covenants-ahd` topic be created to house general covenant theology while `peace-agreements` focuses exclusively on conflict-specific treaties?
2. Given that 4:90, 17:34, 16:92, and 2:208 are extracted but unmapped, should these be added to `peace-agreements` directly, or do some belong under other topics (e.g., 2:208 under a potential "silm-submission" topic)?
3. Is the modern Arabic label الاتفاقيات السلمية acceptable as a navigational aid despite being non-classical, or does it risk imposing contemporary diplomatic categories onto Qur'anic treaty law?
4. Should the phantom related topics (`treaty-fulfillment`, `conflict-prevention`) be created as part of completing the war-peace-conflict dimension, or removed as artifacts of abandoned planning?
5. Does the inclusion of 47:35 ("do not call for peace while superior") adequately balance the peace mandate of 8:61, or should additional qualification verses be mapped to prevent pacifist misreading?
6. How should the taxonomy handle the extensive Bani Israel covenant-violation material (2:83-84, 2:93, 3:81, 3:187, etc.) — is this relevant to `peace-agreements` as negative exemplars of treaty-breaking, or does it belong exclusively under a theological/historical topic?

---

## 2. Mental Health (`mental-health`)

### 1. Conceptual Definition
The topic `mental-health` claims to represent "Islamic approach to mental health" with scope defined as "Spiritual, emotional wellbeing." It is positioned under the `health-medicine` domain and `mental-wellbeing` dimension. The Arabic title is الصحة النفسية في الإسلام (al-ṣiḥḥa al-nafsiyya fī l-islām) and the Urdu title is اسلام میں ذہنی صحت (islām mein zihnī ṣiḥat). Search alias: "mental wellbeing." Related topics are listed as `stress-relief` and `emotional-balance`, but neither exists as a valid topic ID in the current taxonomy (verified via lookup — both return empty). The topic asserts 4 āyah mappings, all with provenance "pending-scholarly-review." Provenance status confirms this topic has never been validated by scholarly review.

**Critical observation:** "Mental health" is a modern clinical/psychiatric category that emerged in the late 19th–20th centuries through Western medical science. The Qur'an addresses psychological states extensively — grief (ḥuzn), fear (khawf), despair (ya's), tranquillity (sakīnah/ṭuma'nīna), heart-sickness (maraḍ al-qalb), whispered temptation (waswasa), and accusations of madness (junūn) — but within a spiritual-theological framework, not a clinical-medical one. This topic imposes a contemporary psychiatric taxonomy onto Qur'anic material that operates on fundamentally different epistemic premises. Sibling audits in this batch series already recommended REMOVE for `anxiety-relief` and flagged `stress-management` as an editorial construct. This audit assesses whether `mental-health` should receive the same disposition.

### 2. Qur'anic Grounding

| Verse | Mapping Type | Content Summary | Assessment |
|-------|-------------|------------------|------------|
| 13:28 | DIRECT_REFERENCE | "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ" — Unquestionably, by the remembrance of Allah hearts are assured/tranquil. | **Genuine Qur'anic concept, misclassified.** This verse describes *ṭuma'nīnat al-qulūb* (tranquillity of hearts) achieved through *dhikr Allāh*. This is a spiritual-theological state, not a mental health intervention. The verse belongs under `remembrance-dhikr`, `heart-qalb`, or `tranquillity-sakinah` — not under a clinical "mental health" category. Correctly extracted but incorrectly categorized. |
| 94:5-6 | DIRECT_REFERENCE | "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا إِنَّ مَعَ ٱلْعُسْرِ يُسْرًۭا" — For indeed, with hardship [will be] ease. | **General divine promise, not mental health.** This is a universal theological assurance about divine providence accompanying difficulty. It provides hope and resilience but is not specific to psychological pathology or therapeutic intervention. Already properly mapped to broader themes of divine mercy and testing. Its inclusion here reflects the tendency to absorb general Qur'anic comfort into a clinical frame. |
| 2:286 | DIRECT_REFERENCE | "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا" — Allah does not charge a soul except [with that within] its capacity. | **Capacity principle, not mental health.** This foundational theological axiom establishes divine justice in obligation-setting. While psychologically reassuring, it addresses the scope of religious duty (taklīf), not psychological diagnosis or treatment. Extraction file `002-al-baqarah-p42.json` correctly identifies this as part of the creedal summary closing Al-Baqarah. Misplaced under mental-health. |
| 3:173 | DIRECT_REFERENCE | "حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ" — Sufficient for us is Allah, and [He is] the best Disposer of affairs. | **Trust declaration (tawakkul), not mental health.** This is the canonical *hasbuna Allah* formula expressing complete reliance on divine sufficiency. Extraction file `003-al-imran-p19.json` identifies it as "Hasbuna Allah formula (3:173) canonical trust declaration." This belongs under `trust-in-god-tawakkul`, not under a clinical mental health category. |

**Key passages referenced in extraction files but NOT mapped to this topic:**

The grep search for mental-health-adjacent terms returned 69 matches across extraction files covering extensive psychological content that remains unmapped:

| Theme | Representative Verses | Current Status |
|-------|----------------------|----------------|
| Heart-sickness (maraḍ al-qalb) | 2:10, 5:52, 9:125, 22:53, 24:50, 33:12, 33:60, 47:20, 47:29, 74:31 | **NOT mapped to mental-health.** These address spiritual hypocrisy and moral corruption, not clinical pathology. Correctly excluded from this topic but demonstrate the Qur'an's distinct conceptual framework. |
| Grief/despair (ḥuzn/ya's) | 2:62, 3:156, 12:86, 15:55, 18:6, 35:34, 39:53, 41:49 | **NOT mapped.** These describe prophetic and believer emotional states within a theological narrative, not clinical depression. |
| Madness accusations (junūn) | 7:184, 15:6, 23:70, 34:46, 51:52, 52:29, 54:9, 68:2, 68:51, 81:22 | **NOT mapped.** These are polemical responses to disbeliever accusations against prophets, affirming prophetic sanity. Not equivalent to psychiatric discourse. |
| Whispered temptation (waswasa) | 7:200, 15:39, 20:120, 50:16, 114:4-5 | **NOT mapped.** These describe satanic/spiritual intrusion, not OCD or intrusive thoughts as clinical categories. |
| Hypocrite psychology | 3:119, 3:156, 3:167, 4:62, 4:72, 9:56-57, 9:67, 9:74, 33:12-20, 59:11-17, 63:1-8 | **NOT mapped.** Detailed psychological portraits of nifāq but framed as moral-spiritual diagnosis, not clinical assessment. |
| Fear/anxiety (khawf/faza') | 2:155, 3:173, 8:10, 21:102, 27:89, 34:51, 41:30, 55:46 | **Partially overlaps with 3:173 mapping.** Most remain unmapped. Framed as tests of faith, not anxiety disorders. |

**Assessment:** Of 4 mapped verses, all 4 are genuine Qur'anic content but NONE support the clinical "mental health" framing. Each verse represents a spiritual-theological concept (dhikr-tranquillity, divine ease, capacity principle, tawakkul) that has been recontextualized under a modern psychiatric label. Meanwhile, the extensive psychological content actually present in the Qur'an (69+ extraction matches) remains unmapped because it does not fit the clinical category either — it operates on a different epistemic plane entirely. The topic captures neither what the Qur'an says about psychological states nor what modern mental health science addresses.

### 3. Semantic Integrity
- **English label "Mental Health"**: A 20th-century clinical term encompassing psychiatric diagnosis, psychotherapeutic intervention, pharmacological treatment, and public health frameworks. None of these categories exist in the Qur'an. The Qur'an has no concept of "mental illness" as a medical condition distinct from spiritual states. Applying this label to Qur'anic content inevitably distorts both the source text and the modern concept.
- **Arabic label "الصحة النفسية في الإسلام" (al-ṣiḥḥa al-nafsiyya fī l-islām)**: A direct calque of the English "mental health." The term *ṣiḥḥa nafsiyya* is modern Arabic psychiatric vocabulary, not classical Islamic terminology. Classical sources use *ṭuma'nīna* (tranquillity), *sakīna* (divine peace), *salāmat al-ṣadr* (soundness of breast), *ṭīb al-nafs* (wellness of soul), *marāḍ al-qalb* (heart-sickness), *waswasa* (whispering), and *junūn* (possession/madness) — none of which map cleanly onto "mental health."
- **Urdu title "اسلام میں ذہنی صحت" (islām mein zihnī ṣiḥat)**: Similarly a modern translation. *Zihnī ṣiḥat* is contemporary Urdu psychiatric vocabulary.
- **Scope note "Spiritual, emotional wellbeing"**: This partial retreat from the clinical label acknowledges the mismatch but creates ambiguity. If the scope is "spiritual, emotional wellbeing," then the topic duplicates `patience`, `trust-in-god`, `remembrance-dhikr`, `heart-qalb`, and `tranquillity-sakinah`. If the scope is genuinely clinical mental health, then the Qur'an does not contain this category.

**Verdict:** Low semantic integrity. The label imposes a modern clinical-psychiatric framework onto Qur'anic spiritual-theological content. Neither the English, Arabic, nor Urdu labels preserve the Qur'anic conceptual meaning. The scope note attempts to bridge the gap but succeeds only in creating taxonomic redundancy with established spiritual topics.

### 4. Taxonomic Distinction

| Sibling/Related Topic | Domain/Dimension | Mappings | Relationship to mental-health |
|----------------------|-------------------|----------|-------------------------------|
| `stress-management` | human-experiences / psychology-emotions | 5 mappings | **Heavy overlap.** Scope: "Coping, relief, trust in Allah." Already flagged as editorial construct in sibling audits. Both topics attempt to categorize Qur'anic coping/resilience material under modern psychological labels. If `stress-management` is removed, `mental-health` absorbs nothing unique from it. |
| `anxiety-relief` | human-experiences / psychology-emotions | 5 mappings | **Heavy overlap.** Scope: "Quranic remedies, dua, trust." Already recommended REMOVE in sibling audits. Both topics attempt to extract therapeutic content from spiritual verses. Redundant with `mental-health` and with each other. |
| `patience` (sabr) | Multiple domains | Extensive | **Absorbs core content.** The 4 mapped verses for `mental-health` are all fundamentally sabr/tawakkul/dhikr verses. Patience is the primary Qur'anic framework for endurance, resilience, and emotional regulation. `mental-health` adds nothing beyond what sabr already covers. |
| `trust-in-god` (tawakkul) | Multiple domains | Extensive | **Absorbs mapped content.** Verse 3:173 (hasbuna Allah) is a canonical tawakkul declaration. The capacity principle (2:286) and ease-after-hardship (94:5-6) are also tawakkul-adjacent. `mental-health` duplicates rather than distinguishes. |
| `remembrance-dhikr` | worship-devotion | Extensive | **Absorbs mapped content.** Verse 13:28 is the quintessential dhikr-tranquillity verse. Already properly categorized elsewhere. |
| `heart-qalb` | theology-spirituality | Extensive | **Overlaps with unmapped content.** Heart-sickness, heart-sealing, heart-tranquillity, and heart-hardening are all qalb concepts that the Qur'an addresses extensively but which do not map to clinical mental health. |
| `stress-relief` | Listed as relatedTopicId | N/A | **Does not exist.** Phantom relationship. |
| `emotional-balance` | Listed as relatedTopicId | N/A | **Does not exist.** Phantom relationship. |

**Critical observations on duplication/conflation:**

1. **Complete absorption by existing topics**: Every one of the 4 mapped verses is better served by an existing, well-grounded topic: 13:28 → `remembrance-dhikr`; 94:5-6 → `divine-mercy` or `testing-trials`; 2:286 → `accountability-responsibility` or `divine-justice`; 3:173 → `trust-in-god-tawakkul`. The topic contributes zero unique Qur'anic coverage.

2. **Redundancy with sibling constructs**: `mental-health`, `stress-management`, and `anxiety-relief` form a cluster of modern-psychological-framework topics that all attempt to extract therapeutic content from the same pool of spiritual verses. All three suffer from identical epistemic problems. Consistency demands the same disposition for all three.

3. **Phantom related topics**: Both `stress-relief` and `emotional-balance` are referenced but do not exist, suggesting abandoned planning for a psychology-themed topic cluster that was never completed.

4. **Domain placement problematic**: Positioned under `health-medicine` / `mental-wellbeing`, which implies a medical-clinical framework. The Qur'an has no medicine-psychology distinction; its psychological content is embedded in theology, ethics, and worship. Even if the concept were retained, the domain placement would need fundamental restructuring.

5. **Unmapped psychological richness**: The 69+ extraction matches for psychological themes demonstrate that the Qur'an contains extensive material on human interiority — but this material resists clinical categorization precisely because it operates on spiritual-theological premises. Creating a `mental-health` topic does not recover this content; it obscures it behind an inappropriate framework.

### 5. Epistemic Provenance
- **Classification type:** Contemporary editorial application imposed onto Qur'anic spiritual content
- **Source indicators:**
  - All 4 ayah mappings carry `provenance: "pending-scholarly-review"` and `sourceIds: ["quran-json"]`, indicating automated extraction without scholarly validation
  - All 4 mappings are classified as DIRECT_REFERENCE, but none reference mental health terminology — they reference dhikr, ease, capacity, and tawakkul
  - The extraction files contain extensive authentic psychological vocabulary (ḥuzn, khawf, ya's, marāḍ al-qalb, waswasa, junūn, sakīna, ṭuma'nīna) but NONE of this vocabulary appears in the topic definition or mappings
  - The Arabic and Urdu labels are modern psychiatric calques, not classical Islamic terminology
  - No hadith-derived, tafsīr-derived, or scholarly-synthesis content supports the topic — it is purely an editorial construction
  - The topic definition contains no reference to any classical Islamic scholar, medical tradition, or psychological framework — no Ibn Sina, no Razi, no Ghazali, no Balkhi despite their extensive writings on psychological states
- **Qur'anic vs. derived:** Entirely contemporary editorial application. The underlying verses are Qur'anic, but their aggregation under "mental health" is a modern interpretive act with no basis in Qur'anic self-description, classical tafsīr, or traditional Islamic scholarship. The Qur'an describes its own psychological content as guidance (hudā), healing (shifā'), mercy (raḥma), and reminder (dhikr) — never as mental health treatment.

### 6. Disposition
**REMOVE**

### Rationale
`mental-health` should be removed from the taxonomy for the following reasons:

1. **Category error**: "Mental health" is a modern clinical-psychiatric category that does not exist in the Qur'an. The Qur'an addresses human psychological states within a spiritual-theological framework using its own conceptual vocabulary (ṭuma'nīna, sakīna, marāḍ al-qalb, waswasa, ḥuzn, khawf, sabr, tawakkul). Imposing a clinical taxonomy onto this material distorts both the source text and the modern concept.

2. **Zero unique coverage**: All 4 mapped verses are better served by existing, well-grounded topics (dhikr, tawakkul, divine-mercy, accountability). The topic contributes nothing that is not already captured more accurately elsewhere.

3. **Consistency with sibling dispositions**: `anxiety-relief` was recommended REMOVE and `stress-management` was flagged as an editorial construct in prior audits. `mental-health` suffers from identical epistemic problems. Retaining it while removing its siblings would be inconsistent.

4. **Semantic distortion risk**: Maintaining a "mental health" topic signals to users that the Qur'an contains mental health guidance comparable to clinical resources. This risks both trivializing clinical mental health conditions (by suggesting Qur'anic verses substitute for professional care) and distorting Qur'anic content (by reading therapeutic intent into spiritual-theological texts).

5. **Phantom infrastructure**: Both related topics (`stress-relief`, `emotional-balance`) are non-existent, indicating this was part of an incomplete editorial plan rather than an organically developed category.

6. **Rich alternative available**: The extensive psychological content in the extraction files (69+ matches) can be properly recovered through existing spiritual-theological topics (`heart-qalb`, `patience`, `trust-in-god`, `remembrance-dhikr`, `testing-trials`, `repentance-tawbah`) without imposing a clinical framework. The Qur'an's psychological wisdom is accessible through its own categories.

**Recommended post-removal actions:**

1. **Remap 4 verses to appropriate existing topics**: 13:28 → `remembrance-dhikr`; 94:5-6 → `divine-mercy` or `testing-trials`; 2:286 → `accountability-responsibility`; 3:173 → `trust-in-god-tawakkul`.

2. **Remove phantom related topic references** from any remaining topics that reference `mental-health`, `stress-relief`, or `emotional-balance`.

3. **Consider creating authentically grounded topics** for Qur'anic psychological content if gaps exist: e.g., `heart-tranquillity-tumaninah`, `grief-huzn`, `whispered-temptation-waswasa`, `heart-sickness-marad-al-qalb` — each using Qur'anic vocabulary and operating within the spiritual-theological framework.

4. **Add advisory note** to the taxonomy documentation explaining why clinical-psychiatric categories are not used as topic labels, directing users to the appropriate spiritual-theological topics for Qur'anic guidance on psychological states.

### Scholarly Review Questions
1. Given that the Qur'an addresses psychological states extensively but within a spiritual-theological framework, should the taxonomy create replacement topics using Qur'anic vocabulary (e.g., `heart-tranquillity-tumaninah`, `grief-huzn`, `heart-sickness-marad-al-qalb`) to recover this content without imposing clinical categories?

2. Should the 4 currently mapped verses (13:28, 94:5-6, 2:286, 3:173) be redistributed to existing topics, or do some warrant new spiritually-grounded topics (e.g., a dedicated `ease-after-hardship-yusr` topic for 94:5-6)?

3. Is there value in creating a meta-topic or cross-reference guide titled something like "Qur'anic Perspectives on Human Interiority" that maps the various spiritual-theological topics relevant to psychological experience without imposing a clinical framework?

4. Given that classical Islamic scholars (Ibn Sina, Razi, Ghazali, Balkhi) wrote extensively on psychological states using Islamic frameworks, should the taxonomy incorporate a separate dimension for "classical Islamic psychology" distinct from both modern mental health and pure theology?

5. Should the removal of `mental-health`, `anxiety-relief`, and potentially `stress-management` trigger a review of the entire `health-medicine` domain and `mental-wellbeing` dimension to assess whether other topics similarly impose modern medical categories onto Qur'anic content?

6. How should the taxonomy handle user search queries for "mental health," "depression," "anxiety," and similar clinical terms? Should these be redirected as search aliases to the appropriate spiritual-theological topics, or should a disclaimer/guidance note be provided explaining the taxonomic approach?

---

## 4. Jihad Definition (`jihad-definition`)

### 1. Conceptual Definition
The topic `jihad-definition` claims to represent "Definition and scope of jihad" with scope defined as "Linguistic, technical meanings, types." It is positioned under the `war-peace-conflict` domain and `jihad-concept` dimension. The Arabic title is تعريف الجهاد (taʿrīf al-jihād) and the Urdu title is جہاد کی تعریف (jihād kī taʿrīf). Search alias: "jihad." Related topics are listed as `jihad-types` and `greater-lesser-jihad`. The topic asserts 6 āyah mappings, all with provenance "pending-scholarly-review."

**Critical conceptual problem:** The topic title "Jihad Definition" and its placement under `war-peace-conflict` presuppose that *jihād* is primarily a warfare concept requiring definition within a military domain. However, the Qur'anic semantic field of *j-h-d* (jahada/yujāhidu/jihādan) encompasses **striving, struggling, and exerting effort** in a broad sense that includes but is not limited to armed combat. The narrowed military sense of "jihad" is largely a product of later fiqh categorization (al-jihād fī sabīl Allāh as a chapter heading in hadith collections and legal manuals), not the primary Qur'anic usage. By placing "jihad-definition" exclusively under `war-peace-conflict`, the taxonomy imposes a post-Qur'anic intellectual framework that predetermines the concept's meaning before the verses are even examined.

The 6 mapped verses themselves reveal this tension: only 2 of 6 use the root *j-h-d* at all (9:41, 25:52); the other 4 use *q-t-l* (fighting) or address fighting without using either root. This confirms the topic is functioning as a proxy for "Qur'anic warfare theology" rather than a genuine lexical-conceptual study of *jihād*.

### 2. Qur'anic Grounding

| Verse | Mapping Type | Root Used | Content Summary | Assessment |
|-------|-------------|-----------|------------------|------------|
| 2:190 | EXPLICIT_INSTRUCTION | q-t-l | "وَقَٰتِلُواْ فِي سَبِيلِ ٱللَّهِ ٱلَّذِينَ يُقَٰتِلُونَكُمۡ وَلَا تَعۡتَدُوٓاْ" — Fight in Allah's way those who fight you, but do not transgress. | **Misclassified as jihad-definition.** This verse uses *qātilū* (fight), not *jāhidū* (strive). It establishes rules of engagement and proportionality, not the definition of jihad. Extraction file `002-al-baqarah-p30.json` confirms the full text. Should map to `rules-of-engagement` instead. |
| 2:216 | DIRECT_REFERENCE | q-t-l | "كُتِبَ عَلَيۡكُمُ ٱلۡقِتَالُ وَهُوَ كُرۡهٞ لَّكُمۡ" — Fighting has been prescribed upon you though it is hateful to you. | **Misclassified as jihad-definition.** Uses *al-qitāl* (fighting/combat), not *jihād*. Addresses the psychology of obligatory combat and divine wisdom in prescribing what humans dislike. Should map to `rules-of-engagement` or a dedicated `qital-fighting` topic. |
| 4:75 | EXPLICIT_INSTRUCTION | q-t-l | "وَمَا لَكُمۡ لَا تُقَٰتِلُونَ فِي سَبِيلِ ٱللَّهِ وَٱلۡمُسۡتَضۡعَفِينَ" — Why do you not fight in Allah's cause and for the oppressed? | **Misclassified as jihad-definition.** Uses *tuqātilūna* (fight), not *tujāhidūna* (strive). Establishes liberation theology as motivation for combat. Extraction `004-an-nisa-p8.json` confirms. Belongs under `rules-of-engagement` or a potential `liberation-oppressed` topic. |
| 9:41 | EXPLICIT_INSTRUCTION | j-h-d | "ٱنفِرُواْ خِفَافٗا وَثِقَالٗا وَجَٰهِدُواْ بِأَمۡوَٰلِكُمۡ وَأَنفُسِكُمۡ فِي سَبِيلِ ٱللَّهِ" — Go forth light or heavy and strive with your wealth and lives in Allah's cause. | **Genuine jihad verse.** Uses *jāhidū* explicitly. Combines material sacrifice (*amwāl*) and personal sacrifice (*anfus*) under the verb *jihād*. Extraction `009-at-tawbah-p2.json` confirms mobilization context. Correctly classified. However, note this verse pairs jihād with *infirū* (go forth/mobilize), indicating military expedition context specifically. |
| 22:39 | DIRECT_REFERENCE | q-t-l | "أُذِنَ لِلَّذِينَ يُقَٰتَلُونَ بِأَنَّهُمۡ ظُلِمُواْ" — Permission [to fight] given to those fought against because they were wronged. | **Misclassified as jihad-definition.** Uses *yuqātalūna* (are fought against), passive of *q-t-l*, not *j-h-d*. This is the foundational defensive-warfare permission verse. Extraction `022-al-hajj-p2.json` confirms it opens the fighting-permission block (22:38-60). Should map to `rules-of-engagement` or a `defensive-warfare` topic. |
| 25:52 | EXPLICIT_INSTRUCTION | j-h-d | "فَلَا تُطِعِ ٱلۡكَٰفِرِينَ وَجَٰهِدۡهُم بِهِۦ جِهَادٗا كَبِيرٗا" — Do not obey the disbelievers and strive against them with it [the Quran] a great striving. | **Genuine jihad verse — but NON-MILITARY.** Uses *jāhidhum bihi jihādan kabīran* (strive against them with it a great striving), where "it" refers to the Qur'an. This is explicitly verbal/intellectual/spiritual striving through revelation, NOT armed combat. Extraction `025-al-furqan-p2.json` confirms. This verse directly contradicts the assumption that jihad-definition belongs exclusively under war-peace-conflict. |

**Key passages referenced in task instructions but NOT mapped to this topic:**

| Verse | Root | Actual Content | Current Status |
|-------|------|---------------|----------------|
| 29:69 | j-h-d | "وَٱلَّذِينَ جَٰهَدُواْ فِينَا لَنَهۡدِيَنَّهُمۡ سُبُلَنَا" — Those who strive for Us, We will surely guide them to Our ways. | **NOT mapped.** Extraction `029-al-ankabut-p3.json` confirms explicit *jāhadū* with editorial gloss "striving/struggle." Purely spiritual striving — no military context. Critical omission for any genuine jihad-definition topic. |
| 22:78 | j-h-d | "وَجَٰهِدُواْ فِي ٱللَّهِ حَقَّ جِهَادِهِۦ" — Strive in Allah with the striving due to Him. | **NOT mapped.** Extraction `022-al-hajj-p3.json` confirms explicit *jāhidū* with gloss "striving/struggle." Closing command of Surah Al-Hajj linking jihād to millat Ibrāhīm. Non-military context. Another critical omission. |
| 49:15 | j-h-d | "إِنَّمَا ٱلۡمُؤۡمِنُونَ... وَجَٰهَدُواْ بِأَمۡوَٰلِهِمۡ وَأَنفُسِهِمۡ فِي سَبِيلِ ٱللَّهِ" — True believers strive with wealth and lives in Allah's cause. | **NOT mapped.** Extraction `049-al-hujurat-p3.json` confirms. Defines true belief (*ṣādiqūn*) through jihād with wealth and self. Parallel to 9:41 but in a definitional rather than mobilization context. |
| 60:1 | j-h-d | "إِن كُنتُمۡ خَرَجۡتُمۡ جِهَٰدٗا فِي سَبِيلِي وَٱبۡتِغَآءَ مَرۡضَاتِي" — If you went out striving in My cause seeking My approval. | **NOT mapped.** Extraction `060-al-mumtahanah-p1.json` confirms explicit *jihādan fī sabīlī*. Context is emigration/alliance prohibition, not combat per se. |
| 61:10-14 | j-h-d | "هَلۡ أَدُلُّكُمۡ عَلَىٰ تِجَٰرَةٖ... تُؤۡمِنُونَ بِٱللَّهِ وَرَسُولِهِۦ وَتُجَٰهِدُونَ فِي سَبِيلِ ٱللَّهِ" — Shall I guide you to a transaction... believe and strive in Allah's cause. | **NOT mapped.** Extraction `061-as-saff-p3.json` confirms. Frames jihād as a salvific transaction (*tijārah*). |
| 66:9 | j-h-d | "يَٰٓأَيُّهَا ٱلنَّبِيُّ جَٰهِدِ ٱلۡكُفَّٰرَ وَٱلۡمُنَٰفِقِينَ وَٱغۡلُظۡ عَلَيۡهِمۡ" — O Prophet, strive against the disbelievers and hypocrites and be harsh upon them. | **NOT mapped.** Extraction `066-at-tahrim-p2.json` confirms. Prophetic jihād command encompassing both disbelievers AND hypocrites — the latter cannot be fought militarily, confirming non-combat dimensions. |
| 5:35 | s-ʿ-y | "وَٱسۡعَوۡاْ إِلَيۡهِ وَسَٰهِدُواْ فِي سَبِيلِهِۦ" (uses s-ʿ-y not j-h-d, but conceptually adjacent) | **NOT mapped.** Extraction `005-al-maidah-p4.json` labels "seek wasilah and strive in Allah's way for success." Adjacent striving vocabulary. |
| 53:39 | s-ʿ-y | "وَأَن لَّيۡسَ لِلۡإِنسَٰنِ إِلَّا مَا سَعَىٰ" — Man has only what he strives for. | **NOT mapped.** Extraction `053-an-najm-p3.json` confirms. Universal striving principle (*saʿy*), broader than jihād but semantically related. |

**Assessment:** Of 6 mapped verses, only 2 (9:41, 25:52) actually use the root *j-h-d*. The other 4 (2:190, 2:216, 4:75, 22:39) use *q-t-l* (fighting/combat) and are misclassified under a "jihad definition" topic. Meanwhile, at least 6 genuine *j-h-d* verses (29:69, 22:78, 49:15, 60:1, 61:10-14, 66:9) are extracted but unmapped. The current mapping set defines *qitāl* (fighting), not *jihād* (striving). This is a fundamental category error.

### 3. Semantic Integrity
- **English label "Jihad Definition"**: Problematic. The English word "jihad" has acquired heavily militarized connotations in Western discourse since the 20th century. Using it as a topic label within a `war-peace-conflict` domain reinforces this narrowing. The Qur'anic *jihād* derives from *j-h-d* meaning effort, exertion, striving — a semantic field that includes spiritual struggle (29:69), intellectual advocacy (25:52), material sacrifice (9:41, 49:15), prophetic confrontation of hypocrisy (66:9), and yes, armed defense (when combined with *qitāl* contexts). The label predetermines a military reading.
- **Arabic label "تعريف الجهاد" (taʿrīf al-jihād)**: More neutral than the English. *Taʿrīf* (definition) is standard scholarly vocabulary. However, pairing it exclusively with the war-peace-conflict domain still narrows the concept.
- **Urdu title "جہاد کی تعریف" (jihād kī taʿrīf)**: Same issue as Arabic — linguistically accurate but domain-constrained.
- **Scope note "Linguistic, technical meanings, types"**: The phrase "types" likely alludes to the classical fiqh distinction between greater/lesser jihad, defensive/offensive jihad, individual/communal obligation (farḍ ʿayn vs. farḍ kifāyah). These are post-Qur'anic juristic categories. The Qur'an itself does not classify jihad into "types" — it uses *jihād* and *qitāl* in various contexts without systematic typology. The scope note imports a fiqh framework.
- **Related topics `jihad-types` and `greater-lesser-jihad`**: Both reinforce the fiqh-derived typological framework. "Greater vs. lesser jihad" is a hadith-based distinction (the famous ḥadīth returning from battle: "We have returned from the lesser jihad to the greater jihad") whose authenticity is debated among scholars. Building taxonomy structure around it elevates a contested tradition to organizational principle.

**Verdict:** Low semantic integrity. The English label carries modern militarized baggage. The domain placement (`war-peace-conflict`) pre-commits the concept to warfare before the verses are consulted. The scope and related topics import fiqh typologies absent from the Qur'an. Most critically, 4 of 6 mapped verses don't even use the word *jihād* — they use *qitāl*. The topic as currently constituted conflates two distinct Qur'anic concepts: *jihād* (broad striving) and *qitāl* (armed fighting).

### 4. Taxonomic Distinction

| Sibling/Related Topic | Domain/Dimension | Mappings | Relationship to jihad-definition |
|----------------------|-------------------|----------|----------------------------------|
| `rules-of-engagement` | war-peace-conflict / warfare-ethics | 6 mappings (map-0698 to map-0703) | **HEAVY OVERLAP.** Four of jihad-definition's six mapped verses (2:190, 2:216, 4:75, 22:39) are actually about fighting rules, not jihad definition. They logically belong here. The MFD-11.1 audit already reviewed this topic. |
| `non-combatant-protection` | war-peace-conflict / warfare-ethics | Audited in MFD-11.1 | **Complementary.** Addresses who may not be targeted; jihad-definition addresses why/how fighting occurs. Properly distinct IF jihad-definition were redefined to focus on actual *jihād* rather than *qitāl*. |
| `peace-agreements` | war-peace-conflict / peace-treaties | 6 mappings (audited above) | **Complementary.** Peace-making vs. striving/fighting. Properly distinct. |
| `jihad-types` | Listed as relatedTopicId | N/A | **Does not exist in topics.json.** Phantom relationship. Would presumably codify fiqh typologies (defensive/offensive, individual/communal, greater/lesser). |
| `greater-lesser-jihad` | Listed as relatedTopicId | N/A | **Does not exist in topics.json.** Phantom relationship based on contested hadith. |

**Critical observations on duplication/conflation:**

1. **Category error confirmed**: The topic labeled "jihad-definition" is functionally operating as a second `rules-of-engagement` topic. Verses 2:190, 2:216, 4:75, and 22:39 all address *when, why, and how to fight* — precisely the scope of `rules-of-engagement`. Only 9:41 and 25:52 genuinely address the concept of *jihād* itself.

2. **Phantom related topics**: Both `jihad-types` and `greater-lesser-jihad` are referenced but do not exist. Like `peace-agreements`, this suggests planned cluster never implemented.

3. **Missing spiritual-striving dimension**: Genuine *jihād* verses about non-military striving (29:69, 22:78, 25:52, 66:9) have no natural home in the current taxonomy. They don't fit `war-peace-conflict` because they aren't about war. They would need either (a) a separate dimension under a different domain (e.g., `spiritual-development` or `faith-practice`) or (b) an expanded `jihad-concept` dimension that honestly encompasses both martial and non-martial striving.

4. **Domain architecture failure**: The `war-peace-conflict` domain cannot adequately house a genuine "jihad definition" topic because *jihād* transcends the war/peace binary. The Qur'an uses *jihād* for spiritual perseverance (29:69), Qur'anic advocacy (25:52), prophetic confrontation of internal community problems (66:9), and material sacrifice in community defense (9:41, 49:15). Forcing all of this into `war-peace-conflict` distorts the concept.

### 5. Epistemic Provenance
- **Classification type:** Mixed — partial Qur'anic grounding with significant fiqh-derived framing and misclassification artifacts
- **Source indicators:**
  - All 6 ayah mappings carry `provenance: "pending-scholarly-review"` and `sourceIds: ["quran-json"]`
  - 4 mappings are EXPLICIT_INSTRUCTION and 2 are DIRECT_REFERENCE — strong classification profile, but applied to wrong concept (qitāl mapped as jihād)
  - The extraction files correctly distinguish *jihād* from *qitāl* in their terminology sections (e.g., `029-al-ankabut-p3.json` line 371: transliteration "jihad", gloss "striving/struggle"; `022-al-hajj-p3.json` line 317: same pattern). The extraction layer understood the distinction; the mapping layer collapsed it.
  - Related topics `jihad-types` and `greater-lesser-jihad` reflect classical fiqh/hadith categorization, not Qur'anic self-classification
  - Scope note "types" imports juristic typology
  - Domain placement under `war-peace-conflict` reflects post-Qur'anic narrowing of jihād to military endeavor
- **Qur'anic vs. derived:** The 2 genuine *j-h-d* mappings (9:41, 25:52) are authentically Qur'anic. The 4 *q-t-l* mappings are Qur'anic verses misclassified under a jihād heading. The overall topic structure (domain, scope, related topics) is fiqh-derived and editorial. The missing verses (29:69, 22:78, 49:15, 60:1, 61:10-14, 66:9) represent genuine Qur'anic *jihād* content that was extracted but never connected, confirming the MFD-11.1 gap finding.

### 6. Disposition
**SPLIT**

### Rationale
`jihad-definition` must be split because it currently conflates two distinct Qur'anic concepts that require separate taxonomic treatment:

1. **Concept A: Jihād (Striving)** — The broad Qur'anic concept of exertion in Allah's cause, encompassing spiritual perseverance (29:69), Qur'anic advocacy (25:52), material/personal sacrifice (9:41, 49:15), prophetic confrontation (66:9), and communal solidarity (60:1, 61:10-14). This concept **transcends the war-peace-conflict domain** and requires either a new dimension (e.g., `striving-jihad` under a broader domain like `faith-practice` or `spiritual-development`) or a reconceived `jihad-concept` dimension that honestly includes non-martial striving.

2. **Concept B: Qitāl (Armed Fighting)** — The Qur'anic legislation on when, why, and how to engage in armed combat, including defensive permission (22:39), proportionality (2:190), psychological preparation (2:216), liberation motivation (4:75), and mobilization (9:41 in its military context). This concept properly belongs under `war-peace-conflict/warfare-ethics` and should be merged with or mapped to `rules-of-engagement`.

**Why not RETAIN:** Retaining the topic as-is perpetuates the category error of treating *qitāl* verses as *jihād* definitions and excludes genuine *jihād* verses that don't fit the warfare frame.

**Why not REDEFINE alone:** Redefining the topic to cover genuine *jihād* while keeping it under `war-peace-conflict` would still exclude non-martial striving verses (29:69, 25:52, 66:9) that don't belong in a warfare domain. The domain itself is the constraint.

**Why not MERGE:** Merging into `rules-of-engagement` would solve the *qitāl* problem but erase the distinct *jihād* concept entirely.

**Split specification:**
- **New topic `qital-fighting-theology`** (or expand `rules-of-engagement`): Receives 2:190, 2:216, 4:75, 22:39, plus additional *q-t-l* verses from extractions (8:39-41, 9:12-16, 47:4, etc.). Stays under `war-peace-conflict/warfare-ethics`.
- **Redefined `jihad-striving`** (replaces `jihad-definition`): Receives 9:41, 25:52, plus currently unmapped 29:69, 22:78, 49:15, 60:1, 61:10-14, 66:9. Requires new domain/dimension placement outside `war-peace-conflict` OR an expanded dimension that encompasses both martial and non-martial striving.
- **Remove phantom related topics** (`jihad-types`, `greater-lesser-jihad`) unless independently justified by Qur'anic evidence.

### Scholarly Review Questions
1. Does the Qur'an establish a unified concept of *jihād* that encompasses both spiritual striving and armed fighting, or are these better understood as two distinct concepts (*jihād* and *qitāl*) that later Islamic tradition merged? The answer determines whether SPLIT or REDEFINE is more appropriate.
2. Given that 25:52 explicitly commands *jihād* through the Qur'an (not arms) and 29:69 describes *jihād* as spiritual seeking, can a topic housed under `war-peace-conflict` ever faithfully represent the Qur'anic *jihād* concept? Or does the domain architecture itself need restructuring?
3. Is the hadith-based distinction between "greater jihad" (spiritual) and "lesser jihad" (military) an appropriate organizing principle for taxonomy, given its debated authenticity and absence from the Qur'an? Should `greater-lesser-jihad` be created as a topic at all?
4. How should the 6 currently unmapped *j-h-d* verses (29:69, 22:78, 49:15, 60:1, 61:10-14, 66:9) be handled? They represent genuine Qur'anic *jihād* content that was extracted but never connected to any topic — a direct instance of the MFD-11.1 gap finding.
5. Should 9:41 ("strive with wealth and lives") be classified as military *jihād* (given its mobilization context with *infirū*) or as general sacrifice applicable to both martial and non-martial contexts? Its dual nature makes it a boundary case for any split.
6. Does the current conflation of *jihād* and *qitāl* in this topic reflect a broader pattern across the `war-peace-conflict` domain where Qur'anic concepts have been filtered through fiqh categories rather than derived from the text itself? If so, should the entire domain undergo structural review beyond individual topic audits?
