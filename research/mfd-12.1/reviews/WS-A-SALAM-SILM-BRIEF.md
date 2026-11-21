# WS-A Scholarly Review Brief: Salām/Silm Polysemy (Q9)

- **Workstream:** MFD-12.1 WS-A (Conceptual Framework Scholarly Review Preparation)
- **Agent:** WS-A / agent-103
- **Generated At:** 2026-11-21T09:21:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or production files

---

## 1. Evidence Summary

### 1.1 Root s-l-m Polysemy

The root s-l-m is one of the most polysemous roots in the Qur'an, producing:
- **Salām** (noun/masdar): peace, safety, wholeness; divine greeting; divine name (al-Salām, 59:23)
- **Silm** (noun): peace/submission as state or condition
- **Islam/Muslim**: submission to God (same root)
- **Aslama/yuslimu**: to submit/surrender
- **Taslīm**: greeting of peace; submission

This polysemy means EVERY occurrence of s-l-m derivatives carries potential dual resonance between "peace" and "submission."

### 1.2 Critical Verse: 2:208

| Verse | Arabic | Translation Options |
|-------|--------|--------------------|
| 2:208 | يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ | **Option A:** "Enter into al-silm completely" (peace)\n**Option B:** "Enter into Islam completely" (submission) |

**Contextual analysis:**
- Preceding verses (2:204-207) discuss hypocrites whose speech pleases but who spread corruption
- Following verse (2:209) warns of clear signs being sent after guidance has come
- The phrase *udkhulū fī l-silm kaffatan* uses *silm* (not *islām* explicitly), but both readings are lexically valid
- Saheeh International renders it "Islam" but acknowledges ambiguity
- Classical tafsir is split: Ibn Kathīr reads it as Islam/submission; al-Ṭabarī records both readings; some early authorities read it as "peace" meaning cessation of hostility

### 1.3 Other Temporal Peace Verses

| Verse | Arabic Portion | Reading |
|-------|---------------|--------|
| 8:61 | وَإِن جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا | Wartime peace reciprocity; uses *salm/silm*; unambiguously temporal/political peace |
| 47:35 | فَلَا تَهِنُوا وَتَدْعُوا إِلَى السَّلْمِ | Prohibition on defeatist peacemaking while superior; uses *salm*; temporal |
| 4:90 | وَأَلْقَوْا إِلَيْكُمُ السَّلَمَ | Offering peace grants immunity; uses *salam*; temporal |

### 1.4 Eschatological/Divine Peace Verses

Majority of salām occurrences describe paradise greetings or divine attributes:
- 16:32, 19:62, 25:63, 25:75, 33:44, 36:58, 39:73, 56:26, 97:5 — Paradise/divine greeting
- 59:23 — Divine name *al-Salām*

These are NOT about temporal/political peace.

### 1.5 Current Taxonomy

**Topic `peace-agreements` (topics.json:4664):**
- Parent domain: `war-peace-conflict`
- Parent dimension: `peace-treaties`
- Scope: "Treaties, ceasefire, conditions"
- 6 mappings: 8:61, 9:4, 9:7, 47:35, 5:1, 16:91

**Issue:** Mapping 5:1 (*awfū bi-l-ʿuqūd* — fulfill contracts) and 16:91 (*awfū bi-ʿahd Allāh* — fulfill Allah's covenant) use ʿ-h-d root, not s-l-m. They address COVENANT FULFILLMENT generally, not peace specifically. These belong under a covenant/ʿahd topic, not peace-agreements.

**No dedicated topic exists for the salām/silm polysemy issue.** The 2:208 ambiguity is currently unaddressed in the taxonomy.

---

## 2. Scholarly Positions

### Position A: Silm in 2:208 = Islam/Submission
**Tradition:** Majority classical tafsir (Ibn Kathīr, al-Qurṭubī); standard translations.

**Argument:** The immediate context addresses believers (*yā ayyuhā alladhīna āmanū*), making "enter into Islam completely" the natural reading. The contrast with Satan's footsteps suggests total religious commitment rather than political peace. The word *silm* is read as synonymous with *islām* here.

### Position B: Silm in 2:208 = Peace
**Tradition:** Some early authorities (cited by al-Ṭabarī); minority contemporary readings.

**Argument:** The lexical form *silm* (with kasr on sīn) more commonly denotes peace/settlement in pre-Islamic usage. The preceding context about corruptors spreading mischief suggests a command to enter communal peace rather than religious conversion. Believers are already Muslim; commanding them to "enter Islam" is redundant.

### Position C: Intentional Polysemy
**Tradition:** Literary/rhetorical Qur'anic studies; some modern scholars.

**Argument:** The Qur'an deliberately exploits s-l-m polysemy. Both meanings are simultaneously intended: complete submission to God IS complete peace. The ambiguity is a feature, not a bug. Taxonomic treatment should preserve this duality through annotation rather than forced disambiguation.

### On 8:61 vs 47:35 Tension

Classical scholars noted that 8:61 (incline to peace if they incline) and 47:35 (don't call for peace while superior) appear contradictory. Resolution approaches:
- **Abrogation (naskh):** Some held 47:35 abrogates 8:61 (minority view)
- **Contextual specification:** 8:61 applies when enemy genuinely seeks peace; 47:35 prohibits premature capitulation disguised as peacemaking (majority view)
- **Strategic wisdom:** Both are situationally applicable; the commander must discern which condition obtains

---

## 3. Architecture Impact

### Decision Option 1: Dual Mapping with Interpretive Annotation

Create an annotation layer for 2:208 that records both readings without forcing a single classification:
- Primary mapping: assign to whichever topic the council determines is primary
- Secondary annotation: record alternative reading with provenance note
- Add metadata field `interpretiveVariants` to mapping schema

**Migration:** Requires schema extension in topic-ayah-mappings.json. Moderate effort.

### Decision Option 2: Assign to Single Topic Based on Scholarly Consensus

If the council determines one reading is authoritative:
- If "Islam": map to existing islam-submission topic (if exists) or create one
- If "peace": map to peace-agreements or new peace-state topic
- Record rejected reading in rationale field as historical note

**Migration:** Low effort — single mapping assignment.

### Decision Option 3: Create Dedicated Polysemy Topic

Create `salam-silm-polysemy` topic under war-peace-conflict or belief-theology domain:
- Maps 2:208 explicitly as polysemous
- Cross-references both peace-agreements and islam-submission topics
- Serves as scholarly reference point

**Migration:** New topic creation + 1 mapping. Low effort.

### Cross-Cutting: Reclassify Covenant Verses

Regardless of 2:208 decision, mappings 5:1 and 16:91 should be moved from `peace-agreements` to a covenant/ʿahd topic. They use ʿ-h-d root and address general covenant fulfillment, not peace specifically.

---

## 4. Recommended Review Format for Scholarly Council

### Question 9: Salām/Silm Polysemy in 2:208

**Background:** The phrase *udkhulū fī l-silm kaffatan* (2:208) admits two lexically valid readings: "enter into peace completely" or "enter into Islam/submission completely." Classical tafsir is divided. The current taxonomy does not address this ambiguity.

**Evidence Package:** MFD-11.3-A Section 1.5. Root s-l-m occurrence data. Classical tafsir positions documented above.

**Options:**

| Option | Description | Implications |
|--------|-------------|--------------|
| A | Assign to Islam/submission (majority classical position) | Aligns with standard translations; loses peace reading |
| B | Assign to peace/state-of-peace | Preserves lexical possibility; diverges from majority |
| C | Dual mapping with interpretive annotation | Preserves both readings; requires schema extension |
| D | Create dedicated polysemy reference topic | Cleanest scholarly representation; adds new topic |

**Sub-question 9a:** Should 5:1 and 16:91 (covenant fulfillment, ʿ-h-d root) remain under `peace-agreements`, or be reclassified to a covenant topic?

**Sub-question 9b:** How should the 8:61 / 47:35 tension be represented? As cross-referenced situational rulings, or with explicit naskh annotation?

---

## 5. Deferral Justification

**No deferral needed.** The polysemy is well-documented in classical literature. The question is architectural (how to represent ambiguity in a structured data model), not evidentiary. The council can decide based on the options presented.

**Optional enrichment:** Survey of how major English/Urdu translations handle 2:208 to document the practical impact of each reading on end-user comprehension.