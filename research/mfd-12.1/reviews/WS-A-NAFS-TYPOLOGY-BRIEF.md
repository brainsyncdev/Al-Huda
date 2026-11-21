# WS-A Scholarly Review Brief: Nafs Typology (Q1)

- **Workstream:** MFD-12.1 WS-A (Conceptual Framework Scholarly Review Preparation)
- **Agent:** WS-A / agent-103
- **Generated At:** 2026-11-21T09:19:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or production files

---

## 1. Evidence Summary

### 1.1 Qur'anic Verses by Nafs State

#### Ammārah (Commanding Self)
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 12:53 | وَمَا أُبَرِّئُ نَفْسِي ۚ إِنَّ النَّفْسَ لَأَمَّارَةٌ بِالسُّوءِ إِلَّا مَا رَحِمَ رَبِّي | *al-nafs al-ammārah bi-l-sū'* | Yusuf's declaration: the nafs commands evil unless Allah shows mercy. Only explicit occurrence of this exact phrase. |

**Current mappings under `nafs-ammara` (topics.json:2062):**
- map-nafs-ammara-0305 → 12:53 (DIRECT_REFERENCE) ✓ Lexically valid
- map-nafs-ammara-0306 → 7:20 (THEMATIC_REFERENCE) — Adam/Eve deception narrative; uses *nafs* but NOT *ammārah*
- map-nafs-ammara-0307 → 79:40-41 (THEMATIC_REFERENCE) — "prevented the soul from inclination"; uses *nafs* and *hawā*, NOT *ammārah*

#### Lawwāmah (Self-Reproaching)
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 75:2 | وَلَا أُقْسِمُ بِالنَّفْسِ اللَّوَّامَةِ | *al-nafs al-lawwāmah* | Divine oath by the reproaching self. Only explicit occurrence. |

**Current mappings under `nafs-lawwama` (topics.json:2089):**
- map-nafs-lawwama-0308 → 75:2 (DIRECT_REFERENCE) ✓ Lexically valid
- map-nafs-lawwama-0309 → 75:14-15 (THEMATIC_REFERENCE) — "man against himself will be witness"; uses *basīrah* (self-insight), NOT *lawwāmah* explicitly

#### Muṭma'innah (Tranquil Self)
| Verse | Arabic Portion | Form | Context |
|-------|---------------|------|--------|
| 89:27-30 | يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً | *al-nafs al-muṭma'innah* | Eschatological address to the tranquil soul at death. Only explicit occurrence. |

**Current mappings under `nafs-mutmainna` (topics.json:2115):**
- map-nafs-mutmainna-0310 → 89:27-30 (DIRECT_REFERENCE) ✓ Lexically valid
- map-nafs-mutmainna-0311 → 13:28 (THEMATIC_REFERENCE) — "hearts find rest in remembrance of Allah"; uses *qulūb tatma'innu* (verb from same root ṭ-m-n applied to *qalb*, not *nafs*)

### 1.2 Root n-f-s Occurrence Data

From `data/root-occurrences/نفس.json`: ~2,566 total occurrences across all forms. The root produces:
- *nafs* (noun): self, soul, person, life
- *tanaffasa* (Form V): to breathe (81:18 only)
- *mutanāfisūn* (Form VI participle): those who compete/rival (83:26 only)

The overwhelming majority of *nafs* occurrences use the word generically for "self/person/soul" without any qualifying adjective indicating a spiritual state. The three qualified states (*ammārah*, *lawwāmah*, *muṭma'innah*) each appear exactly ONCE as explicit phrases.

### 1.3 Taxonomy Structure

Current hierarchy in topics.json:
```
Domain: ethics-character
  Dimension: spiritual-states-nafs
    Subdimension: nafs-levels
      Topics: nafs-ammara, nafs-lawwama, nafs-mutmainna
    Subdimension: qalb-heart
      Topic: qalb-purification
```

Related topic IDs reference each other cross-referentially (nafs-ammara ↔ nafs-lawwama ↔ nafs-mutmainna).

---

## 2. Scholarly Positions

### Position A: Unified Qur'anic Developmental Framework
**Tradition:** Mainstream Sunni tafsir (Ibn Kathīr, al-Ṭabarī, al-Qurṭubī); widely adopted in contemporary Islamic psychology.

**Argument:** The three states represent a progressive spiritual journey described implicitly by the Qur'an's overall discourse on the nafs. Though each term appears once, the Qur'an repeatedly describes:
- The struggle against base desires (nafs as enemy: 79:40-41, 50:16)
- Conscience and self-blame after sin (75:14-15)
- Ultimate tranquility through dhikr and faith (13:28, 89:27-30)

The three named states are therefore exegetical labels for a coherent Qur'anic anthropology. Ibn Kathīr on 12:53 notes that the ammārah is the default state, which through discipline becomes lawwāmah, and through divine grace becomes muṭma'innah.

**Key sources:** Ibn Kathīr, Tafsīr al-Qur'ān al-ʿAẓīm (on 12:53, 75:2, 89:27); al-Ṭabarī, Jāmiʿ al-Bayān; al-Qurṭubī, al-Jāmiʿ li-Aḥkām al-Qur'ān.

### Position B: Sufi Systematization Post-Dating the Qur'an
**Tradition:** Academic Islamic studies; some Salafi/Athari critiques of Sufi terminology.

**Argument:** The tripartite nafs typology as a formal developmental system (maqāmāt/aḥwāl) was elaborated by Sufi authors (al-Muḥāsibī d. 857, al-Ghazālī d. 1111, Ibn ʿAṭā' Allāh d. 1309). The Qur'an itself uses *nafs* in dozens of senses (person, self, life, desire) without establishing a technical three-stage taxonomy. Reading these three isolated verses as a systematic framework imposes later mystical categories onto the text.

Al-Ghazālī's *Iḥyā' ʿUlūm al-Dīn* (Book 3, "Disciplining the Soul") explicitly constructs the three-state model as stages of spiritual training, drawing heavily on hadith and philosophical psychology beyond the Qur'anic text alone.

**Key sources:** Annemarie Schimmel, *Mystical Dimensions of Islam*; W.C. Chittick, *The Sufi Path of Knowledge*; Abū Ḥāmid al-Ghazālī, *Iḥyā'*.

### Position C: Lexical-Contextual Middle Ground
**Tradition:** Modern linguistically-grounded tafsir (e.g., al-Shaʿrāwī, Ibn ʿĀshūr).

**Argument:** Each adjective (*ammārah*, *lawwāmah*, *muṭma'innah*) is a genuine Qur'anic descriptor with specific contextual meaning. They describe observable psychological/spiritual conditions rather than formal maqāmāt. The Qur'an does present them as real states, but does not necessarily prescribe a linear progression. They may coexist or alternate within a single individual. This position accepts the terms as Qur'anic while rejecting the rigid Sufi stage-theory superstructure.

**Key sources:** Muḥammad al-Ṭāhir Ibn ʿĀshūr, *al-Taḥrīr wa-l-Tanwīr*; Muḥammad Mutawallī al-Shaʿrāwī, *Tafsīr*.

---

## 3. Architecture Impact

### Decision Option 1: Retain Current Three-Topic Structure
**Impact:** Minimal migration needed. The existing `spiritual-states-nafs` dimension with three topics remains. However, thematic mappings (7:20, 79:40-41, 75:14-15, 13:28) should be annotated as THEMATIC extensions rather than lexical matches, since they do not contain the specific adjectives.

**Risk:** Perpetuates potential conflation of Qur'anic text with post-Qur'anic systematization if the scholarly council determines Position B is correct.

### Decision Option 2: Consolidate into Single "Nafs States" Topic
**Impact:** Merge `nafs-ammara`, `nafs-lawwama`, `nafs-mutmainna` into one topic (e.g., `nafs-spiritual-states`) with sub-entries or annotations for each state. Reduces topic count by 2. Requires updating 7 ayah mappings, related topic cross-references, and dimension structure.

**Rationale:** If scholars determine the three states form a unified concept rather than independent topics, consolidation reflects textual reality better.

### Decision Option 3: Re-scope as Descriptive Conditions, Not Stages
**Impact:** Retain three topics but revise descriptions/scopes to remove implicit developmental progression language. Update search aliases and related topics. Add provenance notes distinguishing Qur'anic-explicit usage from thematic extensions.

**Migration:** Moderate — primarily metadata changes in topics.json and batch5-ethics.json.

### Cross-Cutting Concern
The mapping of 13:28 to `nafs-mutmainna` is lexically problematic: the verse uses *tatma'innu qulūbuhum* (their hearts find rest), applying the ṭ-m-n root to *qalb* not *nafs*. Regardless of which option is chosen, this mapping needs reclassification to `qalb-purification` or a new `heart-tranquility` topic.

---

## 4. Recommended Review Format for Scholarly Council

### Question 1: Status of the Three Nafs States

**Background:** The current taxonomy treats *al-nafs al-ammārah* (12:53), *al-nafs al-lawwāmah* (75:2), and *al-nafs al-muṭma'innah* (89:27) as three distinct topics under a "spiritual-states-nafs" dimension. Each phrase occurs exactly once in the Qur'an. Additional verses are mapped thematically but do not contain these specific terms.

**Evidence Package:** See Section 1 above. Full root occurrence data: `data/root-occurrences/نفس.json` (~2,566 entries). Current mappings: `data/taxonomy/topic-ayah-mappings.json` lines 7031-7127.

**Options for Council Deliberation:**

| Option | Description | Implications |
|--------|-------------|--------------|
| A | Accept as unified Qur'anic framework; retain three topics with thematic extensions | Preserves current structure; requires annotation distinguishing explicit vs. thematic mappings |
| B | Recognize as Sufi systematization; annotate topics as "post-Qur'anic interpretive framework" | Adds provenance layer; may require separating Qur'anic-explicit content from interpretive overlays |
| C | Treat as descriptive conditions (not stages); consolidate into single topic with sub-annotations | Reduces topic count; more faithful to lexical evidence; requires migration of 7 mappings |

**Specific sub-question:** Should 13:28 (*tatma'innu qulūbuhum* — hearts finding rest) remain mapped to `nafs-mutmainna` given it applies the root to *qalb* rather than *nafs*?

---

## 5. Deferral Justification

**No deferral needed.** The evidence package is sufficient for scholarly deliberation. The question is fundamentally interpretive/theological, not evidentiary. All relevant Qur'anic data has been assembled. The scholarly council possesses the expertise to adjudicate between Positions A, B, and C without additional computational research.

**Additional context that would strengthen review (optional, not blocking):**
- Hadith corpus analysis of *nafs* terminology to quantify how much of the tripartite system derives from Prophetic traditions vs. Qur'anic text
- Comparative analysis with Biblical/Hebrew *nefesh* usage for philological context
