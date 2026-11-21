# WS-A Scholarly Review Brief: Jihād vs Qitāl (Q5)

- **Workstream:** MFD-12.1 WS-A (Conceptual Framework Scholarly Review Preparation)
- **Agent:** WS-A / agent-103
- **Generated At:** 2026-11-21T09:20:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or production files

---

## 1. Evidence Summary

### 1.1 Linguistic Distinction (Confirmed by MFD-11.3-A)

The MFD-11.3 Workstream A investigation established that jihād and qitāl are lexically, morphologically, and contextually distinct concepts in the Qur'an, despite being conflated in the current taxonomy.

#### Jihād (Root j-h-d)
- **Form:** Form III verb *jāhada/yujāhidu*, masdar *jihād*, active participle *mujāhidūn*
- **Meaning:** To strive, exert effort, struggle (broad semantic range)
- **Occurrences in war-peace corpus:** ~17 verses (see MFD-11.3-A Section 2.1)
- **Contexts:** Spiritual perseverance (29:6, 29:69), verbal/Qur'anic advocacy (25:52), material sacrifice (49:15, 61:11), military mobilization when paired with *infirū* (9:41)
- **Key finding:** Only a SUBSET of jihād verses relate to armed conflict. The majority address spiritual, intellectual, or material striving.

#### Qitāl (Root q-t-l)
- **Form:** Form I *qatala* (to kill), Form III *qātala/yuqātilu* (to fight/combat), masdar *qitāl* (fighting/warfare)
- **Meaning:** Armed combat, fighting, warfare (strictly martial)
- **Occurrences in war-peace corpus:** ~30+ verses (see MFD-11.3-A Section 2.2)
- **Contexts:** Defensive permission (22:39-40), proportionality (2:190), obligation (2:216), liberation (4:75), prisoner treatment (47:4), booty (8:41)
- **Key finding:** Qitāl is strictly MARTIAL. It does not encompass spiritual striving or verbal advocacy.

### 1.2 Current Taxonomy Conflation

**Topic `jihad-definition` (topics.json:4604):**
- Parent domain: `war-peace-conflict`
- Parent dimension: `jihad-concept`
- Scope: "Linguistic, technical meanings, types"
- Related topics: `jihad-types`, `greater-lesser-jihad`

**Mappings under `jihad-definition`:**
| Mapping ID | Verse | Root Used in Verse | Issue |
|-----------|-------|-------------------|-------|
| map-jihad-definition-0692 | 2:190 | q-t-l (*qātilū*) | MISCLASSIFIED — verse uses qitāl, not jihād |
| map-jihad-definition-0693 | 2:216 | q-t-l (*al-qitāl*) | MISCLASSIFIED — explicitly about qitāl |
| map-jihad-definition-0694 | 4:75 | q-t-l (*tuqātilūna*) | MISCLASSIFIED — uses qitāl vocabulary |
| map-jihad-definition-0695 | 9:41 | j-h-d (*jāhidū*) + infirū | VALID — jihād in military mobilization context |
| map-jihad-definition-0696 | 22:39 | q-t-l (*yuqātalūna*) | MISCLASSIFIED — passive qitāl form |
| map-jihad-definition-0697 | 25:52 | j-h-d (*jāhidhum bihi jihādan kabīran*) | VALID — non-martial jihād (Qur'anic striving) |

**Result:** 4 of 6 mappings under `jihad-definition` use q-t-l root, not j-h-d. The topic conflates two distinct concepts.

**Note on `greater-lesser-jihad`:** This related topic references the hadith-based distinction between *al-jihād al-akbar* (spiritual) and *al-jihād al-asghar* (military). This classification is NOT found in the Qur'an. It derives from a hadith reported by al-Bayhaqī and others, widely classified as weak (ḍaʿīf) by muhaddithūn though its meaning is accepted by many Sufi scholars.

### 1.3 Root Occurrence Data

From `data/root-occurrences/`:
- جاهد (j-h-d): Forms include jāhada, yujāhidu, mujāhidūn, jihād
- قتل (q-t-l): Forms include qatala, qātala, yuqātilu, qitāl, maqtūl

These are separate root entries with no morphological overlap.

---

## 2. Scholarly Positions

### Position A: Jihād as Umbrella, Qitāl as Subset
**Tradition:** Classical Sunni jurisprudence (fuqahā'); mainstream tafsir (Ibn Kathīr, al-Ṭabarī).

**Argument:** Jihād is the broader concept of striving in Allah's cause. Qitāl (armed fighting) is one modality of jihād that applies under specific conditions (defense, oppression, treaty violation). All qitāl in Allah's cause is jihād, but not all jihād is qitāl. Ibn Kathīr on 2:216 notes that *kutiba ʿalaykum al-qitāl* prescribes fighting specifically, while jihād encompasses patience, spending, and da'wah.

**Implication for taxonomy:** Qitāl should be a sub-topic or child of jihād, not merged into it. Or they should be sibling topics under a shared parent dimension.

### Position B: Strict Lexical Separation
**Tradition:** Modern linguistic Qur'anic studies; academic Islamic studies (e.g., Toshihiko Izutsu, *God and Man in the Koran*).

**Argument:** Jihād and qitāl have entirely different semantic fields. Jihād belongs to the semantic field of effort/striving/patience. Qitāl belongs to the semantic field of combat/killing/warfare. Conflating them distorts both concepts. The Qur'an deliberately uses q-t-l when commanding fighting and j-h-d when commanding broader striving. Verses like 25:52 (*jihādan kabīran* through the Qur'an) prove jihād operates independently of any martial frame.

**Implication for taxonomy:** Separate topics entirely. Do not nest qitāl under jihād. Create `qital-rules` or `armed-combat` as independent topic.

### Position C: Contextual Overlap Model
**Tradition:** Some contemporary scholars (e.g., Fazlur Rahman, *Major Themes of the Qur'an*).

**Argument:** While lexically distinct, the Qur'an sometimes uses them in overlapping contexts (e.g., 9:41 pairs *infirū* [go forth] with *jāhidū*). In Medinan surahs addressing military campaigns, jihād often carries martial connotation because the context demands it. The relationship is contextual, not definitional.

**Implication for taxonomy:** Maintain separate topics but add cross-references where verses use both roots or where context bridges them.

### On "Greater vs Lesser Jihād"
**Classical Hadith Criticism:** The narration "We return from the lesser jihād to the greater jihād" is transmitted by al-Bayhaqī in *al-Zuhd al-Kabīr* and others. Ibn Taymiyyah, al-ʿIrāqī, and others classified its isnād as weak. However, the CONCEPT (spiritual struggle against the nafs is foundational) is supported by Qur'anic evidence (29:6, 29:69) even without this specific hadith.

**Relevance:** The existing `relatedTopicIds` reference to `greater-lesser-jihad` introduces hadith-derived taxonomy into a Qur'anic data model. This needs scholarly adjudication.

---

## 3. Architecture Impact

### Decision Option 1: Separate Jihād and Qitāl Topics (Recommended by Evidence)

**Changes required:**
1. Rename `jihad-definition` → retain for genuine j-h-d verses only
2. Create new topic `qital-armed-combat` under `war-peace-conflict` domain
3. Reassign mappings:
   - map-jihad-definition-0692 (2:190) → `qital-armed-combat`
   - map-jihad-definition-0693 (2:216) → `qital-armed-combat`
   - map-jihad-definition-0694 (4:75) → `qital-armed-combat`
   - map-jihad-definition-0696 (22:39) → `qital-armed-combat`
   - Retain 0695 (9:41) and 0697 (25:52) under `jihad-definition`
4. Update `rules-of-engagement` topic — its mappings already correctly use q-t-l verses
5. Remove or re-scope `greater-lesser-jihad` related topic (hadith-derived)
6. Update dimension structure: `jihad-concept` dimension may need renaming to `striving-and-combat` or split into `jihad-striving` and `qital-combat`

**Migration effort:** Moderate. ~4 mapping reassignments, 1 new topic creation, dimension restructuring.

### Decision Option 2: Maintain Unified Topic with Sub-Annotations

**Changes required:**
1. Keep `jihad-definition` but add sub-entries distinguishing j-h-d and q-t-l usages
2. Add metadata annotations to each mapping indicating which root is actually used
3. Update scope description to clarify the umbrella nature

**Risk:** Perpetuates lexical imprecision. Users searching for "jihad" get qitāl verses and vice versa.

### Cross-Cutting Concern: `rules-of-engagement`

The existing `rules-of-engagement` topic (topics.json:4634) maps q-t-l verses (2:190, 2:191, 4:90, 8:61, 9:6, 60:8) correctly. If qitāl is separated from jihād, `rules-of-engagement` naturally becomes a child/sibling of `qital-armed-combat` rather than `jihad-definition`. This improves coherence.

---

## 4. Recommended Review Format for Scholarly Council

### Question 5: Jihād vs Qitāl Taxonomic Treatment

**Background:** Computational analysis confirms that jihād (j-h-d) and qitāl (q-t-l) are lexically distinct roots with different semantic ranges. The current `jihad-definition` topic contains 6 mappings, 4 of which use q-t-l root exclusively. The related topic `greater-lesser-jihad` derives from a hadith classified as weak by classical muhaddithūn.

**Evidence Package:** MFD-11.3-WORKSTREAM-A-WAR-PEACE.md Sections 1.1-1.2, 2.1-2.2. Mapping audit above. Root occurrence files for j-h-d and q-t-l.

**Options:**

| Option | Description | Implications |
|--------|-------------|--------------|
| A (Recommended) | Separate into `jihad-striving` and `qital-armed-combat` topics; reassign 4 mappings | Lexically precise; aligns with Position B; moderate migration |
| B | Retain unified `jihad-definition` as umbrella; annotate root-level distinctions | Preserves traditional fiqh framing (Position A); requires metadata enhancement |
| C | Retain unified topic; remove q-t-l mappings to `rules-of-engagement` only | Partial fix; loses qitāl-specific discourse (liberation theology, prisoner ethics) |

**Sub-question 5a:** Should `greater-lesser-jihad` be retained as a topic given its hadith-only provenance and weak chain? Options: (1) Remove from Qur'anic taxonomy, (2) Retain with explicit "hadith-derived" provenance label, (3) Merge into `jihad-definition` as annotation.

**Sub-question 5b:** Does the phrase *jāhidū bi-amwālikum wa-anfusikum* (strive with wealth and lives, e.g., 9:41, 49:15, 61:11) constitute martial jihād or general sacrifice? Context varies: 9:41 is paired with military mobilization (*infirū*), while 49:15 is definitional (describing true believers).

---

## 5. Deferral Justification

**No deferral needed.** The lexical evidence is unambiguous and computationally verified. The question is how to STRUCTURE the taxonomy given the evidence, which is an architectural decision informed by scholarly preference. The council has sufficient data to decide.

**Additional research that would enrich (not block) review:**
- Frequency analysis of j-h-d vs q-t-l across Meccan/Medinan periods to quantify the martial-context correlation
- Survey of classical tafsir headings for Surah al-Tawbah (chapter 9) to see how early mufassirūn categorized its mixed j-h-d/q-t-l content
