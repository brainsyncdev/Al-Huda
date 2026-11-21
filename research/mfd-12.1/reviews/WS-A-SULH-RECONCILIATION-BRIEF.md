# WS-A Scholarly Review Brief: Ṣulḥ Reconciliation (Q11)

- **Workstream:** MFD-12.1 WS-A (Conceptual Framework Scholarly Review Preparation)
- **Agent:** WS-A / agent-103
- **Generated At:** 2026-11-21T09:22:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or production files

---

## 1. Evidence Summary

### 1.1 Root ṣ-l-ḥ Semantic Range

The root ṣ-l-ḥ produces:
- **Ṣulḥ** (Form I masdar): reconciliation, settlement, making peace
- **Aṣlaḥa** (Form IV verb): to reconcile, reform, make right between parties
- **Iṣlāḥ** (Form IV masdar): reform, correction, reconciliation
- **Ṣāliḥ** (active participle): righteous, good, sound (distinct semantic branch — moral righteousness)

**Critical distinction:** Form I/IV derivatives relating to reconciliation/reform are semantically distinct from *ṣāliḥ* (righteous person/good deed). The latter belongs to ethics-character domain. This brief addresses ONLY the reconciliation/settlement sense.

### 1.2 Qur'anic Occurrences by Context

#### Marital Reconciliation
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 4:35 | إِن يُرِيدَا إِصْلَاحًا يُوَفِّقِ اللَّهُ بَيْنَهُمَا | Form IV *iṣlāḥan* | Arbitration between spouses; if arbitrators desire reconciliation, Allah facilitates |
| 4:128 | فَلَا جُنَاحَ عَلَيْهِمَا أَن يُصْلِحَا بَيْنَهُمَا صُلْحًا وَالصُّلْحُ خَيْرٌ | Form IV *yuṣliḥā* + masdar *ṣulḥan* | Wife fears husband's contempt; settlement permissible; "settlement is best" |

#### Inter-Communal Conflict Resolution
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 49:9 | فَأَصْلِحُوا بَيْنَهُمَا... فَإِن فَاءَتْ فَأَصْلِحُوا بَيْنَهُمَا بِالْعَدْلِ | Form IV *fa-aṣliḥū* (×2) | Factional fighting among believers → mediate → if one oppresses, fight oppressor → then settle WITH JUSTICE |
| 49:10 | فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ | Form IV *fa-aṣliḥū* | Believers are brothers → reconcile between your brothers |

#### General Social Reconciliation
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 2:224 | وَتُصْلِحُوا بَيْنَ النَّاسِ | Form IV *tuṣliḥū* | Don't use oaths as excuse against making peace among people |
| 2:182 | فَأَصْلَحَ بَيْنَهُمْ فَلَا إِثْمَ عَلَيْهِ | Form IV *fa-aṣlaḥa* | Correcting bequest errors between heirs; legal reconciliation |

#### Wartime Peacemaking (Bridge to s-l-m)
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 8:61 | وَإِن جَنَحُوا لِلسَّلْمِ فَاجْنَحْ لَهَا | s-l-m (*silm*), NOT ṣ-l-ḥ | Uses silm not ṣulḥ; included here because it bridges the two concepts |

### 1.3 Current Taxonomy Status

**No dedicated ṣulḥ topic exists.** The concept is distributed:
- `peace-agreements` (topics.json:4664) focuses on treaties/covenants (ʿahd/mīthāq), not interpersonal reconciliation
- `rules-of-engagement` includes 8:61 but frames it as warfare ethics
- No topic captures marital reconciliation (4:35, 4:128) or inter-believer mediation (49:9-10)

**Gap identified:** Ṣulḥ as interpersonal/communal reconciliation is entirely absent from the current taxonomy despite having 6 explicit Qur'anic occurrences across diverse contexts.

### 1.4 Relationship to Adjacent Concepts

| Concept | Root | Relationship to Ṣulḥ |
|---------|------|---------------------|
| Salām/Silm | s-l-m | Ṣulḥ is PROCESS; salām is STATE. 8:61 bridges both |
| ʿAhd/Mīthāq | ʿ-h-d / w-th-q | Treaties are CONTRACTUAL; ṣulḥ is RELATIONAL/RESTORATIVE |
| ʿAdl/Qisṭ | ʿ-d-l / q-s-ṭ | Justice is PREREQUISITE for valid ṣulḥ (49:9 explicitly links them) |
| Afw/Ṣafḥ | ʿ-f-w / ṣ-f-ḥ | Forgiveness/pardon is related but distinct; ṣulḥ requires mutual engagement |

---

## 2. Scholarly Positions

### Position A: Ṣulḥ as Independent Qur'anic Category
**Tradition:** Classical fiqh (kitāb al-ṣulḥ in hadith collections); Islamic dispute resolution scholarship.

**Argument:** The Qur'an establishes ṣulḥ as a distinct ethical-legal category with its own principles:
1. Voluntariness (4:128 — "no blame if they settle")
2. Justice requirement (49:9 — "settle with justice")
3. Divine facilitation (4:35 — "Allah will facilitate between them")
4. Fraternity basis (49:10 — "believers are brothers")
5. Priority over litigation ("al-ṣulḥ khayr" — settlement is best)

These principles form a coherent framework distinct from treaty-making (ʿahd) and general peace (salām). Classical fiqh works treat kitāb al-ṣulḥ as independent chapter.

### Position B: Ṣulḥ as Sub-Dimension of Peace
**Tradition:** Modern conflict resolution frameworks; some contemporary Islamic studies.

**Argument:** Ṣulḥ is one modality within the broader peace/conflict-resolution spectrum. Creating a separate topic fragments what should be a unified "peace and reconciliation" dimension. Marital, communal, and interstate reconciliation share underlying principles and should be grouped.

### Position C: Context-Specific Treatment
**Tradition:** Tafsir-based approach; avoids systematic categorization.

**Argument:** Each ṣulḥ verse addresses a specific context (marriage, factional conflict, inheritance). Extracting a general "ṣulḥ concept" risks imposing modern dispute-resolution theory onto context-specific rulings. Better to treat each occurrence within its native domain (family law, social ethics, etc.).

---

## 3. Architecture Impact

### Decision Option 1: Create Independent `sulh-reconciliation` Topic

**Structure:**
```
Domain: war-peace-conflict (or ethics-character)
  Dimension: conflict-resolution (new)
    Topic: sulh-reconciliation
      Mappings: 4:35, 4:128, 49:9, 49:10, 2:224, 2:182
```

**Advantages:** Captures genuine Qur'anic category; fills identified gap; enables cross-domain linking (family + social + conflict).
**Disadvantages:** Adds new topic; requires deciding domain placement (war-peace vs ethics vs family).

### Decision Option 2: Sub-Dimension Under Peace

**Structure:**
```
Domain: war-peace-conflict
  Dimension: peace-treaties → rename to "peace-and-reconciliation"
    Topic: peace-agreements (existing, treaties/covenants)
    Topic: sulh-reconciliation (new, interpersonal/communal)
```

**Advantages:** Groups related concepts; minimal structural disruption.
**Disadvantages:** May conflate contractual (ʿahd) and relational (ṣulḥ) categories.

### Decision Option 3: Distribute by Native Domain

- 4:35, 4:128 → family-law domain (marital arbitration)
- 49:9-10 → social-ethics or community-governance domain
- 2:224 → ethics/social-conduct
- 2:182 → inheritance/law domain

**Advantages:** Respects contextual specificity; no new topic needed.
**Disadvantages:** Loses the cross-cutting ṣulḥ pattern; makes thematic study difficult.

### Cross-Cutting: 8:61 Bridge Annotation

Regardless of option chosen, 8:61 should carry annotations linking both `sulh-reconciliation` (process) and `peace-agreements` (state/treaty) topics, since it uniquely bridges s-l-m and ṣ-l-ḥ conceptual spaces.

---

## 4. Recommended Review Format for Scholarly Council

### Question 11: Ṣulḥ — Independent Topic or Sub-Dimension?

**Background:** The root ṣ-l-ḥ (reconciliation/settlement) appears in 6 Qur'anic verses across marital, communal, and general social contexts. No dedicated topic currently exists. The concept is distinct from treaty-making (ʿahd) and general peace (salām).

**Evidence Package:** MFD-11.3-A Section 1.3. Verse register above. Gap analysis showing absence from current taxonomy.

**Options:**

| Option | Description | Implications |
|--------|-------------|--------------|
| A | Create independent `sulh-reconciliation` topic | Fills gap; captures cross-cutting Qur'anic category; moderate migration |
| B | Sub-dimension under expanded "peace-and-reconciliation" dimension | Groups related concepts; may blur contractual vs relational distinction |
| C | Distribute verses to native domains (family, social, law) | Contextually precise; loses thematic coherence |

**Sub-question 11a:** Should 2:182 (inheritance correction) be included under ṣulḥ, or is it purely legal/administrative reform unrelated to conflict resolution?

**Sub-question 11b:** Does the phrase *wa-l-ṣulḥu khayr* (4:128) establish a general normative principle favoring settlement, or is it context-specific to marital disputes?

---

## 5. Deferral Justification

**No deferral needed.** The evidence is complete and the gap is clearly identified. The question is purely architectural: how to structure an acknowledged Qur'anic concept within the taxonomy. The council has sufficient information to decide.

**Optional enrichment:** Comparative analysis of classical fiqh kitāb al-ṣulḥ chapters to determine whether jurists treated ṣulḥ as unified category or context-specific rulings.