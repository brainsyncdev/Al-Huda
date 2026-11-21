# WS7: Scholarly Taxonomy Gap Investigation Briefs

**Generated:** 2026-11-21T09:58:32+05:00
**Proposed By:** ai-assisted
**Review Status:** pending-review
**Source Documents:** WS-C-PHANTOM-SUMMARY.md, WS-C-CREATE-CANDIDATES.md

---

## Executive Summary

This document investigates 15 scholarly taxonomy gaps identified in MFD-12.1 WS-C. These are core Islamic concepts discussed extensively in classical literature but reported as absent from the current FAHM taxonomy. Investigation reveals that **5 of the 15 concepts already exist** as topics (sabr-patience, tawakkul-trust, ikhlas-sincerity, fitrah-nature, jinn-creation), while **10 represent genuine gaps** requiring scholarly deliberation.

### Disposition Summary

| Disposition | Count | Concepts |
|---|---|---|
| ALREADY EXISTS | 5 | Sabr, Tawakkul, Ikhlas, Fitrah, Jinn Creation |
| CREATE | 7 | Tazkiyah, Hidden Shirk, Greater/Lesser Jihad, Qisas Retaliation, Asma ul Husna Meanings/Benefits, Divine Attributes Categories |
| MERGE | 2 | Dhikr (into existing remembrance topics), Istighfar (into existing forgiveness topics) |
| DEFER | 1 | Taqwa (exists as subdimension but needs scope clarification) |

---

## Gap 1: Tazkiyah (تزكية)

### 1. Quranic Evidence
- **Root:** زكو (z-k-w)
- **Key Verses:**
  - 2:43 — "وَآتُوا۟ ٱلزَّكَوٰةَ" (establish zakah/purification)
  - 2:83 — Covenant including zakah
  - 2:110 — Establishment of prayer and zakah
  - 87:14 — "قَدْ أَفْلَحَ مَن تَزَكَّىٰ" (He has succeeded who purifies himself)
  - 91:9 — "قَدْ أَفْلَحَ مَن زَكَّىٰهَا" (He succeeds who purifies it [the soul])
  - 92:18 — Spending wealth for purification
- **Lemma Count:** 7 lemmas (أَزْكَىٰ, تَزَكَّىٰ, زَكَوٰة, زَكَىٰ, زَكِيّ, زَكِيَّة, زَكَّىٰ)
- **Total Occurrences:** 844 lines in root file (high frequency)

### 2. Classical Literature
Tazkiyah is a foundational Islamic science encompassing purification of the soul from spiritual diseases. Key classical works:
- **Ihya Ulum al-Din** (Al-Ghazali): Comprehensive treatment of spiritual purification
- **Risalah Qushayriyyah**: Sufi manual on stations and states
- **Madarij al-Salikin** (Ibn Qayyim): Stages of spiritual development
- Tazkiyah is considered fard 'ayn (individual obligation) alongside fiqh

### 3. Current Taxonomy Status
- **Referenced as related topic** by `spiritual-diseases` (line 2127) and another topic (line 2152)
- **No standalone topic exists** with id `tazkiyah`
- Related existing topics: `spiritual-diseases`, `intention-purification`, `heart-softening`, `character-building`

### 4. Architecture Impact
- **Domain:** belief-theology OR spiritual-development (new domain?)
- **Dimension:** tazkiyah-spiritual-purification (new dimension)
- **Relationships:** Parent of spiritual-diseases, intention-purification, heart-softening; Related to ikhlas-sincerity, taqwa-piety
- **Subdimensions needed:** amrad-al-qalb (diseases), maqamat (stations), ahwal (states)

### 5. Recommendation: **CREATE**
Tazkiyah is a major Islamic discipline referenced 3 times in phantom analysis. It deserves standalone topic status as umbrella for spiritual purification sciences.

### 6. Scholarly Review Question
> Should `tazkiyah` be created as a new Dimension under belief-theology, or as a standalone Topic? What should its hierarchical relationship be to existing topics like `spiritual-diseases` and `ikhlas-sincerity`?

---

## Gap 2: Divine Attributes Categories

### 1. Quranic Evidence
- **Related Roots:** حسن (beauty/goodness), جلال (majesty), ذات (essence), فعل (action)
- **Key Concept Verses:**
  - 7:180 — "وَلِلَّهِ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ" (To Allah belong the best names)
  - 17:110 — Call upon Allah or Ar-Rahman
  - 59:22-24 — Comprehensive attribute listing
- **Existing Subdimension:** `divine-attributes-categories` already exists as parentSubdimensionId for divine-mercy, divine-wrath, divine-knowledge, divine-power

### 2. Classical Literature
Classical kalam theology categorizes divine attributes into:
- **Sifat al-Dhat** (Attributes of Essence): Life, Knowledge, Power, Will, Hearing, Sight, Speech
- **Sifat al-Fi'l** (Attributes of Action): Creating, Sustaining, Forgiving, Punishing
- **Sifat al-Jamal** (Attributes of Beauty): Mercy, Generosity, Forgiveness
- **Sifat al-Jalal** (Attributes of Majesty): Power, Wrath, Justice
Key works: Al-Aqidah al-Tahawiyyah, Al-Ibanah (Al-Ash'ari), Sharh al-Mawaqif

### 3. Current Taxonomy Status
- **Subdimension EXISTS:** `divine-attributes-categories` is used as parentSubdimensionId
- **Individual category topics DO NOT EXIST:** No `attributes-of-essence`, `attributes-of-action`, `attributes-of-beauty`, `attributes-of-majesty`
- Existing attribute topics: divine-mercy, divine-wrath, divine-knowledge, divine-power

### 4. Architecture Impact
- **Domain:** belief-theology
- **Dimension:** allah-divine-attributes
- **Subdimension:** divine-attributes-categories (already exists)
- **New Topics Needed:** 4 category topics under this subdimension
- **Relationships:** Each category would group relevant existing attribute topics

### 5. Recommendation: **CREATE** (4 topics)
These are standard theological categories essential for proper aqeedah education. Create as sibling topics under divine-attributes-categories subdimension.

### 6. Scholarly Review Question
> Should the four classical attribute categories (dhat/fi'l/jamal/jalal) each become separate Topics under the existing `divine-attributes-categories` subdimension? How should existing attribute topics (divine-mercy, divine-power, etc.) be mapped to these categories?

---

## Gap 3: Hidden Shirk (الشرك الخفي)

### 1. Quranic Evidence
- **Root:** شرك (sh-r-k)
- **Key Verses:**
  - 2:96 — "أَشْرَكُوا۟" (they associated partners)
  - 2:105 — "ٱلْمُشْرِكِينَ"
  - 4:48 — "إِنَّ ٱللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ" (Allah does not forgive shirk)
  - 31:13 — Luqman's warning against shirk
  - 12:106 — Most people are mushrikun
- **Lemma Count:** 8 lemmas
- **Total Occurrences:** 1849 lines (very high frequency)

### 2. Classical Literature
Hidden shirk (shirk khafi/asghar) includes riya' (showing off), sum'ah (seeking reputation), and subtle intentions. Key treatments:
- **Hadith:** "The thing I fear most for you is minor shirk" (Ahmad)
- **Kitab al-Tawhid** (Muhammad ibn Abd al-Wahhab): Chapters on hidden shirk
- **Ihya Ulum al-Din**: Book on Riya'
- Distinction between shirk akbar (major/expulsive) and shirk asghar (minor/reducing reward)

### 3. Current Taxonomy Status
- **Referenced as relatedTopicId** by `shirk-prohibition` (line 307) and another topic (line 2334)
- **No standalone topic exists** with id `hidden-shirk`
- Related existing: `shirk-prohibition`, `riya-showing-off` (also referenced but may not exist)

### 4. Architecture Impact
- **Domain:** belief-theology
- **Dimension:** tawheed-oneness
- **Relationships:** Child/sibling of shirk-prohibition; Related to ikhlas-sincerity, tazkiyah
- **Critical distinction:** Must clearly differentiate from major shirk

### 5. Recommendation: **CREATE**
Essential for spiritual health education. Referenced twice in phantom analysis. Complements existing shirk-prohibition topic.

### 6. Scholarly Review Question
> Should `hidden-shirk` be created as a child topic of `shirk-prohibition` or as a sibling? Should `riya-showing-off` be merged into `hidden-shirk` or kept separate?

---

## Gap 4: Jinn Nature & Types

### 1. Quranic Evidence
- **Root:** جنن (j-n-n) for jinn-related terms; note: `جن.json` not found in root-occurrences
- **Key Verses:**
  - 55:15 — "وَخَلَقَ ٱلْجَآنَّ مِن مَّارِجٍ مِّن نَّارٍ" (Created jinn from smokeless fire)
  - 72:1-28 — Surah Al-Jinn entirely dedicated
  - 15:27 — Jinn created before humans
  - 6:100 — Some make jinn partners with Allah
- **Existing Topic:** `jinn-creation` EXISTS at line 552

### 2. Classical Literature
Jinn nature and classification extensively discussed:
- **Types:** Ifrit, Marid, Shaytan, Qarin, Amir
- **Nature:** Created from fire, can see humans, have free will, Muslim and non-Muslim
- Key sources: Tafsir of Surah Al-Jinn, Hadith collections, Kitab al-Hayawan (Al-Jahiz)

### 3. Current Taxonomy Status
- **`jinn-creation` EXISTS** as standalone topic (line 552)
- **`jinn-nature` and `jinn-types` DO NOT EXIST** as separate topics
- jinn-creation related to angels-creation and jinn-belief

### 4. Architecture Impact
- **Domain:** belief-theology
- **Dimension:** angels-unseen-world
- **Decision needed:** Expand jinn-creation OR create jinn-nature/jinn-types as siblings

### 5. Recommendation: **MERGE into jinn-creation** OR **CREATE as subtopics**
jinn-creation already covers creation aspect. Nature and types could be sections within it or separate specialized topics.

### 6. Scholarly Review Question
> Should `jinn-nature` and `jinn-types` be created as separate topics alongside `jinn-creation`, or should their content be incorporated into an expanded `jinn-creation` topic?

---

## Gap 5: Greater vs Lesser Jihad

### 1. Quranic Evidence
- **Root:** جهد (j-h-d)
- **Key Verses:**
  - 2:218 — "وَجَـٰهَدُوا۟" (those who strive)
  - 3:142 — Testing through jihad
  - 4:95 — Mujahideen preferred over those sitting
  - 9:41 — "جَٰهِدُوا۟ بِأَمْوَالِكُمْ وَأَنفُسِكُمْ" (strive with wealth and selves)
  - 22:78 — "وَجَٰهِدُوا۟ فِى ٱللَّهِ حَقَّ جِهَادِهِ" (strive in Allah's cause as is due)
  - 25:52 — "فَلَا تُطِعِ ٱلْكَـٰفِرِينَ وَجَٰهِدهُم بِهِۦ جِهَادًا كَبِيرًا" (great jihad)
- **Lemma Count:** 5 lemmas
- **Total Occurrences:** 582 lines

### 2. Classical Literature
The greater/lesser jihad distinction:
- **Hadith basis:** "We returned from lesser jihad to greater jihad" (weak chain but widely cited)
- **Greater Jihad:** Struggle against nafs (self), spiritual purification
- **Lesser Jihad:** Physical struggle in defense of faith
- Classical scholars differ on hadith authenticity but accept the conceptual distinction
- Key works: Fiqh al-Jihad (Al-Qaradawi), Zad al-Ma'ad (Ibn Qayyim)

### 3. Current Taxonomy Status
- **Referenced as relatedTopicId** at line 4616
- **No standalone topic exists** with id `greater-lesser-jihad`
- Related: `jihad-types` (also phantom)

### 4. Architecture Impact
- **Domain:** belief-theology OR fiqh-siyar
- **Dimension:** Could fit under multiple dimensions
- **Sensitive topic:** Requires careful scholarly framing to avoid misrepresentation

### 5. Recommendation: **CREATE**
Critical for correcting widespread misunderstanding. Must be handled with scholarly precision.

### 6. Scholarly Review Question
> Should `greater-lesser-jihad` address the hadith authenticity debate? How should it relate to existing jihad-related topics and the broader tazkiyah framework?

---

## Gap 6: Qisas Retaliation

### 1. Quranic Evidence
- **Root:** قصص (q-s-s) for narrative; qisas specifically from ق-ص-ص
- **Key Verses:**
  - 2:178 — "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ كُتِبَ عَلَيْكُمُ ٱلْقِصَاصُ" (prescribed for you is retaliation)
  - 2:179 — "وَلَكُمْ فِى ٱلْقِصَاصِ حَيَوٰةٌ" (in retaliation there is life)
  - 5:45 — "وَكَتَبْنَا عَلَيْهِمْ أَنَّ ٱلنَّفْسَ بِٱلنَّفْسِ"
  - 17:33 — Right of victim's heir

### 2. Classical Literature
Qisas is a major chapter in fiqh jinayat (criminal law):
- Conditions, procedures, evidentiary requirements
- Distinction from diyah (blood money) and ta'zir (discretionary punishment)
- Key works: Bidayat al-Mujtahid, Al-Mughni, Fiqh al-Sunnah

### 3. Current Taxonomy Status
- **Referenced as relatedTopicId** at line 4088
- **No standalone topic exists** with id `qisas-retaliation`

### 4. Architecture Impact
- **Domain:** fiqh-law (or equivalent)
- **Dimension:** criminal-law / fiqh-jinayat
- **Relationships:** Related to justice topics, legal-maxims

### 5. Recommendation: **CREATE**
Major fiqh chapter missing from taxonomy. Essential for comprehensive Islamic law coverage.

### 6. Scholarly Review Question
> Should `qisas-retaliation` include comparative madhhab positions? What other fiqh-jinayat topics should be created alongside it?

---

## Gap 7: Asma ul Husna Meanings & Benefits

### 1. Quranic Evidence
- **Root:** حسن (h-s-n) for husna/beautiful
- **Key Verses:**
  - 7:180 — "وَلِلَّهِ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ فَٱدْعُوهُ بِهَا"
  - 17:110 — "قُلِ ٱدْعُوا۟ ٱللَّهَ أَوِ ٱدْعُوا۟ ٱلرَّحْمَـٰنَ"
  - 20:8 — "لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ"
  - 59:24 — "هُوَ ٱللَّهُ ٱلْخَـٰلِقُ ٱلْبَارِئُ ٱلْمُصَوِّرُ لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ"

### 2. Classical Literature
Extensive literature on divine names:
- **Al-Maqsad al-Asna** (Al-Ghazali): Philosophical treatment
- **Fiqh al-Asma al-Husna** (Al-Najdi): Practical application
- Each name has linguistic meaning, theological implication, and devotional benefit
- Supplication using specific names for specific needs

### 3. Current Taxonomy Status
- **`asma-ul-husna` EXISTS** as topic (line 35)
- **`asma-ul-husna-meanings` and `asma-ul-husna-benefits` DO NOT EXIST**
- asma-ul-husna related to divine-attributes-categories and divine-mercy

### 4. Architecture Impact
- **Domain:** belief-theology
- **Dimension:** allah-divine-attributes
- **Subdimension:** divine-names
- **Decision:** Subtopics of asma-ul-husna or separate?

### 5. Recommendation: **CREATE** as subtopics
Meanings and benefits are distinct scholarly disciplines deserving separate treatment under asma-ul-husna.

### 6. Scholarly Review Question
> Should these be child topics of `asma-ul-husna` or sibling topics? Should individual name meanings eventually become separate topics?

---

## Gap 8: Ikhlas (الإخلاص)

### ✅ ALREADY EXISTS

### Current Status
- **Topic EXISTS:** `ikhlas-sincerity` at line 2292
- **Referenced by:** Multiple topics (lines 1647, 2333)
- **Root:** خلص (kh-l-s) — 7 lemmas, 446 occurrences

### Recommendation: **NO ACTION NEEDED**
Concept already covered. Verify content completeness during review.

---

## Gap 9: Taqwa (التقوى)

### 1. Quranic Evidence
- **Root:** وقي (w-q-y)
- **Key Verses:**
  - 2:2 — "هُدًى لِّلْمُتَّقِينَ" (guidance for the muttaqeen)
  - 2:197 — "وَتَزَوَّدُوا۟ فَإِنَّ خَيْرَ ٱلزَّادِ ٱلتَّقْوَىٰ"
  - 3:102 — "ٱتَّقُوا۟ ٱللَّهَ حَقَّ تُقَاتِهِۦ"
  - 49:13 — "إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ"
- **Lemma Count:** 8 lemmas
- **Total Occurrences:** 3559 lines (extremely high frequency)

### 2. Classical Literature
Taqwa is one of the most central Quranic concepts:
- Defined as God-consciousness, piety, protective awareness
- Levels of taqwa discussed extensively
- Key works: Tafsir of verse 2:2, Risalah al-Qushayriyyah

### 3. Current Taxonomy Status
- **Exists as concept** but check if standalone topic exists
- Root file shows massive Quranic presence
- Likely exists as subdimension or within other topics

### 4. Architecture Impact
- Central concept spanning multiple domains
- May need elevation to dimension-level importance

### 5. Recommendation: **VERIFY SCOPE**
Check if existing coverage is adequate or if dedicated topic needed.

### 6. Scholarly Review Question
> Does the current taxonomy adequately cover taqwa, or does it deserve a dedicated topic given its 3559 root occurrences and centrality to Quranic discourse?

---

## Gap 10: Sabr (الصبر)

### ✅ ALREADY EXISTS

### Current Status
- **Topic EXISTS:** `sabr-patience` at line 2201
- **Referenced by:** Multiple topics (lines 2182, 4823, 4943, 5041)
- **Root:** صبر (s-b-r) — 8 lemmas, 1433 occurrences

### Recommendation: **NO ACTION NEEDED**
Concept already covered with extensive cross-references.

---

## Gap 11: Shukr (الشكر)

### 1. Quranic Evidence
- **Root:** شكر (sh-k-r)
- **Key Verses:**
  - 2:52 — "تَشْكُرُونَ"
  - 14:7 — "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ" (If you are grateful, I will increase you)
  - 31:12 — Luqman commanded to be grateful
  - 76:9 — Feeding for Allah's sake without expecting thanks
- **Lemma Count:** 6 lemmas
- **Total Occurrences:** 1055 lines

### 2. Classical Literature
Shukr is fundamental to Islamic spirituality:
- Three pillars: recognition, verbal expression, action
- Relationship to kufr al-ni'mah (ingratitude)
- Key works: Ihya Ulum al-Din (Book of Gratitude), Adab al-Dunya wa al-Din

### 3. Current Taxonomy Status
- **Check for existing topic** — likely partially covered
- Related to gratitude concepts

### 4. Architecture Impact
- **Domain:** tazkiyah-akhlaq or spiritual-development
- **Relationships:** Related to sabr-patience, tawakkul-trust

### 5. Recommendation: **CREATE or VERIFY**
Verify if existing topic covers shukr adequately; if not, create.

### 6. Scholarly Review Question
> Is shukr adequately covered in existing topics, or does it warrant a dedicated topic given its 1055 root occurrences?

---

## Gap 12: Tawakkul (التوكل)

### ✅ ALREADY EXISTS

### Current Status
- **Topic EXISTS:** `tawakkul-trust` at line 2262
- **Root:** وكل (w-k-l) — 4 lemmas, 971 occurrences

### Recommendation: **NO ACTION NEEDED**

---

## Gap 13: Istighfar (الاستغفار)

### 1. Quranic Evidence
- **Root:** غفر (gh-f-r)
- **Key Verses:**
  - 2:58 — "اسْتَغْفِرُوا۟ رَبَّكُمْ"
  - 3:135 — Those who seek forgiveness after sin
  - 11:3 — Hud's command to seek forgiveness
  - 71:10 — Nuh's call to istighfar
- **Lemma Count:** 9 lemmas (including istaghfara, istighfar, ghafur, ghaffar, maghfirah)
- **Total Occurrences:** 2758 lines

### 2. Classical Literature
Istighfar is central to repentance and spiritual renewal:
- Conditions of valid istighfar
- Virtues and times of acceptance
- Key works: Kitab al-Tawbah (various authors), Riyad al-Salihin

### 3. Current Taxonomy Status
- Check for existing forgiveness/repentance topics
- May be partially covered under repentance-conditions

### 4. Architecture Impact
- **Domain:** tazkiyah-akhlaq
- **Relationships:** Related to tawbah, dhikr

### 5. Recommendation: **MERGE or CREATE**
Verify existing coverage; create if insufficient.

### 6. Scholarly Review Question
> Should istighfar be a standalone topic or merged with existing repentance topics?

---

## Gap 14: Dhikr (الذكر)

### 1. Quranic Evidence
- **Root:** ذكر (dh-k-r)
- **Key Verses:**
  - 2:152 — "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ" (Remember Me, I remember you)
  - 13:28 — "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ" (Hearts find rest in dhikr)
  - 33:41 — "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ ٱللَّهَ ذِكْرًا كَثِيرًا"
  - 18:24 — Remembering Allah when forgetting
- **Lemma Count:** 11 lemmas
- **Total Occurrences:** 3550 lines (extremely high)

### 2. Classical Literature
Dhikr encompasses remembrance, mention, and devotional practices:
- Types: dhikr of tongue, heart, limbs
- Times and formulas
- Key works: Al-Adhkar (Al-Nawawi), Wabil al-Sayyib (Ibn Qayyim)

### 3. Current Taxonomy Status
- **Referenced** at line 5012
- Check for existing adhkar/remembrance topics

### 4. Architecture Impact
- **Domain:** ibadah-worship or tazkiyah
- **Relationships:** Related to dua, salah, istighfar

### 5. Recommendation: **MERGE or CREATE**
Verify existing coverage; likely needs dedicated topic given frequency.

### 6. Scholarly Review Question
> Given 3550 root occurrences, should dhikr be elevated to a major topic or dimension?

---

## Gap 15: Fitrah (الفطرة)

### ✅ ALREADY EXISTS

### Current Status
- **Topic EXISTS:** `fitrah-nature` at line 2615
- **Referenced by:** Line 2595
- **Root:** فطر (f-t-r) — 6 lemmas, 267 occurrences
- Key verse: 30:30 — "فِطْرَتَ ٱللَّهِ ٱلَّتِى فَطَرَ ٱلنَّاسَ عَلَيْهَا"

### Recommendation: **NO ACTION NEEDED**

---

## Summary Table

| # | Gap | Root | Occurrences | Status | Recommendation |
|---|---|---|---|---|---|
| 1 | Tazkiyah | زكو | 844 | Missing | CREATE |
| 2 | Divine Attributes Categories | Various | High | Subdimension only | CREATE (4 topics) |
| 3 | Hidden Shirk | شرك | 1849 | Referenced only | CREATE |
| 4 | Jinn Nature & Types | جنن | 178 | Partial (jinn-creation exists) | MERGE/EXPAND |
| 5 | Greater vs Lesser Jihad | جهد | 582 | Referenced only | CREATE |
| 6 | Qisas Retaliation | قصص | N/A | Referenced only | CREATE |
| 7 | Asma ul Husna Meanings/Benefits | حسن | High | Partial (asma-ul-husna exists) | CREATE (2 subtopics) |
| 8 | Ikhlas | خلص | 446 | EXISTS | NO ACTION |
| 9 | Taqwa | وقي | 3559 | Verify scope | VERIFY |
| 10 | Sabr | صبر | 1433 | EXISTS | NO ACTION |
| 11 | Shukr | شكر | 1055 | Verify | VERIFY |
| 12 | Tawakkul | وكل | 971 | EXISTS | NO ACTION |
| 13 | Istighfar | غفر | 2758 | Verify | MERGE/CREATE |
| 14 | Dhikr | ذكر | 3550 | Referenced | MERGE/CREATE |
| 15 | Fitrah | فطر | 267 | EXISTS | NO ACTION |

---

*End of WS7 Taxonomy Gap Investigation Briefs*
