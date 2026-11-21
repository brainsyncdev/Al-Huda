# WS-A Scholarly Review Brief: Arts Domain Dissolution & Art-Boundaries Mappings (Q6, Q10)

- **Workstream:** MFD-12.1 WS-A (Conceptual Framework Scholarly Review Preparation)
- **Agent:** WS-A / agent-103
- **Generated At:** 2026-11-21T09:19:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or production files

---

## 1. Evidence Summary

### 1.1 Arts/Beauty/Aesthetics Domain Overview

The MFD-11.3 Workstream B investigation (`research/mfd-11/reports/MFD-11.3-WORKSTREAM-B-ARTS-BEAUTY.md`) conducted exhaustive lexical analysis of all roots associated with beauty, art, and aesthetics. Key findings:

| Root | Total Occurrences | Aesthetic Usage | Primary Meaning |
|------|------------------|-----------------|-----------------|
| j-m-l (jamāl/jamīl) | 3 | 1 (16:6 livestock beauty) | Beauty/appearance; 2× modifies patience (12:18, 12:83) |
| z-y-n (zīnah) | ~25 | 5 positive cosmic adornment | ~70% negative (deception/test); modesty law (24:31, 33:33) |
| ḥ-s-n (ḥusn/iḥsān) | ~51 | 4-5 borderline (32:7, 40:64, 64:3, 95:4, 27:88) | ~85% moral/ethical/eschatological |

### 1.2 Critical Provenance Finding

The scope description for `husn-concept` (topics.json:4700) states: "Allah is beautiful, loves beauty." This phrase derives from **Hadith** (Ṣaḥīḥ Muslim 91a: *Inna Allāha jamīlun yuḥibbu al-jamāl*), NOT from the Qur'an. No Qur'anic verse uses j-m-l to describe Allah.

### 1.3 Art-Boundaries Mappings (Q10 Detail)

Current `art-boundaries` topic (topics.json:4725) has 4 ayah mappings:

| Mapping ID | Verse | Rationale in Mapping | Actual Subject Matter |
|-----------|-------|---------------------|----------------------|
| map-art-boundaries-0716 | 31:6 | "amusement of speech" | Idle talk (*lahw al-ḥadīth*) misleading from Allah's path — SPEECH ETHICS |
| map-art-boundaries-0717 | 17:32 | "do not approach unlawful sexual intercourse" | Sexual morality prohibition — SEXUAL ETHICS |
| map-art-boundaries-0718 | 24:19 | "immorality spread among believers" | Slander/publicizing immorality — SOCIAL ETHICS |
| map-art-boundaries-0719 | 49:11 | "let not a people ridicule another" | Mockery/ridicule prohibition — SOCIAL ETIQUETTE |

**None of these four verses address art, artistic expression, creativity, or aesthetic boundaries.** They are unambiguously misclassified.

### 1.4 Existing Taxonomy Structure

```
Domain: arts-beauty-aesthetics
  Dimension: husn-beauty → Topic: husn-concept (6 mappings)
  Dimension: artistic-expression → Topic: art-boundaries (4 mappings)
  Related: beauty-islam, divine-beauty, aesthetic-principles, creative-expression, islamic-art, calligraphy, geometric-patterns
```

### 1.5 Root Occurrence Files

Root occurrence data confirms MFD-11.3-B findings:
- `data/root-occurrences/حسن.json` — extensive ethical/moral usage
- `data/root-occurrences/زين.json` — predominantly negative/deceptive contexts
- `data/root-occurrences/جمل.json` — minimal occurrences (3 total)

---

## 2. Scholarly Positions

### On Arts/Beauty as Qur'anic Domain

**Position A: No Independent Qur'anic Aesthetics Domain**
**Tradition:** Textualist/Qur'an-centric scholarship; aligns with MFD-11.3-B findings.

The Qur'an does not establish "art," "beauty," or "aesthetics" as independent subject categories. What later Islamic civilization developed as "Islamic aesthetics" (calligraphy, geometry, arabesque) emerged from cultural synthesis (Persian, Byzantine, Central Asian) guided by general Islamic principles, not from a Qur'anic arts curriculum. Concepts like *jamāl* (1 occurrence for livestock), *zīnah* (mostly negative test/deception), and *ḥusn* (mostly moral excellence) cannot sustain an independent domain.

**Position B: Implicit Aesthetic Theology**
**Tradition:** Sufi metaphysics (Ibn ʿArabī tradition); some contemporary Islamic philosophy.

While explicit aesthetic vocabulary is sparse, the Qur'an's emphasis on divine perfection of creation (32:7, 95:4), cosmic order, color diversity (30:22, 35:27-28), and proportion (*taqwīm*) implies an aesthetic theology. Beauty is a divine attribute reflected in creation. The hadith "Allah is beautiful and loves beauty" provides interpretive lens for reading these Qur'anic signs aesthetically.

**Caveat:** Position B relies on hadith and philosophical interpretation to construct the aesthetic framework; it acknowledges the Qur'an alone is insufficient.

### On Art-Boundaries Specifically

**Universal Agreement:** Classical mufassirūn unanimously understand 31:6 as addressing idle/diverting speech (often interpreted as singing/music by some, but the text says *lahw al-ḥadīth* — amusement of speech/storytelling). Verses 17:32, 24:19, and 49:11 have never been classified under "art" in any classical tafsir tradition. The current mappings represent a modern category error.

---

## 3. Architecture Impact

### Q6: Arts Domain Dissolution

**If dissolved (MFD-11.3-B recommendation confirmed):**

| Concept | Destination | Migration Effort |
|---------|------------|-----------------|
| Divine perfection (32:7, 40:64, 64:3, 95:4, 27:88) | creation-signs domain, new topic `divine-perfection-itqan` | Create 1 topic, move 5 mappings |
| Cosmic adornment (15:16, 37:6, 41:12, 50:6, 67:5) | creation-signs domain, existing signs topic | Reassign mappings |
| Iḥsān (all occurrences currently under husn-concept) | ethics-character domain | Reassign 6 mappings from husn-concept |
| Modesty/adornment (24:31, 33:33) | law domain or family domain | New or existing topic |
| Worldly zīnah warnings (3:14, 57:20, 18:46) | ethics/worldliness | Reassign |
| Sabrun jamīl (12:18, 12:83) | ethics/patience | Reassign |
| Craftsmanship narratives (21:80, 34:10-13) | prophets domain | Reassign |
| Poetry distinction (26:224-227, 36:69) | revelation domain | Reassign |

**Structural impact:**
- Remove domain `arts-beauty-aesthetics` from `data/taxonomy/domains.json`
- Remove dimensions: `husn-beauty`, `artistic-expression`, `creativity-design`, `adornment-ethics`, `architecture-engineering` from `data/taxonomy/dimensions.json`
- Remove/redefine topics: `husn-concept`, `art-boundaries`, and all related empty topics
- Update `data/taxonomy/topics.json` parent references for all affected topics
- Estimated: ~20-30 mapping reassignments, 5-10 topic removals, 1 domain removal

**If retained (against MFD-11.3-B recommendation):**
- Must completely redefine `husn-concept` scope to remove hadith-derived content
- Must remove all 4 `art-boundaries` mappings regardless (they are objectively wrong)
- Domain would be nearly empty, creating structural anomaly

### Q10: Art-Boundaries Mappings

**Recommendation is unambiguous:** All 4 mappings must be reclassified regardless of domain decision. There is no scholarly position under which 17:32 (sexual ethics) or 49:11 (anti-ridicule) constitutes "art boundaries."

| Mapping | Correct Reclassification Target |
|---------|-------------------------------|
| 31:6 | speech-ethics OR entertainment-ethics (if such topic exists; otherwise ethics/social-conduct) |
| 17:32 | sexual-ethics / chastity topic |
| 24:19 | slander-prohibition / social-ethics |
| 49:11 | social-etiquette / mockery-prohibition |

**Migration effort:** 4 mapping record updates in `topic-ayah-mappings.json` + `batch12-remaining.json`. Low risk.

---

## 4. Recommended Review Format for Scholarly Council

### Question 6: Arts/Beauty/Aesthetics Domain

**Background:** Exhaustive lexical analysis (MFD-11.3-B) found that the Qur'an contains no independent discourse on "art" or "aesthetics." The root j-m-l occurs 3 times (1 for livestock beauty, 2 modifying patience). The root ḥ-s-n is ~85% ethical/moral. The root z-y-n is ~70% negative (deception/test). The current `husn-concept` scope cites a hadith (Muslim 91a) as if it were Qur'anic content.

**Evidence Package:** MFD-11.3-WORKSTREAM-B-ARTS-BEAUTY.md (complete). Root occurrence files for j-m-l, z-y-n, ḥ-s-n.

**Options:**

| Option | Description | Implications |
|--------|-------------|--------------|
| A (Recommended by MFD-11.3-B) | Dissolve domain entirely; redistribute concepts to appropriate domains | ~20-30 mapping moves; removes category error; cleanest architecture |
| B | Retain domain but redefine as "Divine Perfection & Signs of Creation" | Keeps structural slot; narrows scope dramatically; may overlap with creation-signs |
| C | Retain domain with explicit "Interpretive/Cultural" provenance label | Acknowledges non-Qur'anic basis; preserves user-facing navigation; creates two-tier provenance system |

### Question 10: Art-Boundaries Mappings

**Background:** All 4 verses mapped to `art-boundaries` address unrelated subjects (idle speech, sexual ethics, slander, ridicule). No classical tafsir classifies these under art.

**Options:**

| Option | Description |
|--------|-------------|
| A (Only viable option) | Reclassify all 4 mappings to their actual subject topics; deprecate `art-boundaries` topic |

**This question does not require scholarly deliberation — it requires correction of objective misclassification.** However, the council should confirm there is no intended interpretive rationale unknown to the AI analysis.

---

## 5. Deferral Justification

**Q6 (Domain dissolution):** No deferral needed. Evidence is comprehensive. Decision is architectural/interpretive and within scholarly council purview.

**Q10 (Art-boundaries):** No deferral needed. Misclassification is demonstrable from primary text. Immediate correction recommended upon council acknowledgment.
