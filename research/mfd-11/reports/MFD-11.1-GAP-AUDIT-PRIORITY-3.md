# MFD-11.1 — Priority Gap Audit Report

**Generated:** 2026-11-20
**Scope:** Ikhlāṣ, Child Education, Al-Nafs al-Muṭmaʾinnah
**Status:** AI-assisted analysis, pending scholarly review
**HEAD:** bd34760

## Methodology

Per the user-directed workflow:
1. Inspected original topic definition and scope (from `data/taxonomy/topics.json`)
2. Retrieved all candidate passage references (from `synthesis/candidate-index.json`)
3. Read complete Arabic passages in context (from pinned corpus + extraction records)
4. Identified explicit and contextual evidence (grep across 473 extraction files)
5. Distinguished genuine concepts from editorial labels
6. Compared with existing topics to identify overlap
7. Recorded decision and supporting rationale below
8. Unresolved cases flagged for scholarly review

---

## 1. Ikhlāṣ / Sincerity (`ikhlas-sincerity`)

### Topic Definition (Production)
- **Title:** Ikhlas (Sincerity)
- **Scope:** Pure intention for Allah
- **Description:** Sincerity in worship
- **Parent:** ethics-character → sincerity-ikhlas
- **Related:** riya-showing-off, intention-purification
- **Existing production mappings:** 5

### Evidence Found in Extractions
- **Distinct verse keys with sincerity/ikhlas evidence:** 269
- **Candidates mapping to `ikhlas-sincerity`:** 0
- **Extraction files containing evidence:** 30+ surahs including 002, 003, 004, 006, 007, 009, 010, 015, 017, 018, 023, 028, 029, 030, 036, 037, 039, 040, 046, 066, 092, 098, 107

### Key Qur'anic Expressions Identified
| Expression | Verses | Extraction Coverage |
|---|---|---|
| *mukhlisīna lahu al-dīn* (sincere to Him in religion) | 2:138, 7:29, 29:65, 31:32, 39:2, 39:11, 39:14, 40:14, 40:65, 98:5 | ✅ Present in subordinate subjects |
| *dīn al-qayyim* (correct religion with sincerity) | 98:5 | ✅ Present |
| *lā yushrikūna bi-rabbihim aḥadā* (not associating anyone with their Lord) | 23:59 | ✅ Present |
| *wa-hum mukhlisūn* (and they are sincere) | 2:139 | ✅ Present |
| *riyā'* (showing off) as antithesis | 107:4-6 | ✅ Present |
| *seeking countenance of Lord* | 92:20, 18:28 | ✅ Present |
| *giving despite love (ʿalā ḥubbihi)* | 2:177 | ✅ Present |

### Diagnosis
**MAPPING GAP — not an extraction gap.**

The concept of ikhlāṣ is extensively extracted across 269 verse keys in 30+ surahs with descriptive subordinate subjects. However, zero candidates carry `ikhlas-sincerity` in their `existingTopicOverlap`. The gap analysis flagged 106 matching verses via keyword search, but the actual extraction evidence is far richer (269 keys).

The existing 5 production mappings severely underrepresent this concept.

### Recommendation
1. **Create new candidates** that explicitly map to `ikhlas-sincerity` for the core verses: 39:2-3, 39:11, 39:14, 40:14, 40:65, 98:5, 2:138-139, 7:29, 29:65, 31:32, 18:28, 92:20
2. **Add `ikhlas-sincerity` overlap** to existing candidates covering sincerity themes (estimated 40-60 candidates)
3. **Expand production mappings** from 5 to ~25-30 after scholarly review
4. **Distinguish from related topics:**
   - `intention-purification`: focuses on niyyah before action
   - `ikhlas-sincerity`: focuses on exclusive devotion during and after action
   - `riya-showing-off`: the antithesis, already well-mapped

### Scholarly Review Required
- Whether *mukhlisīna lahu al-dīn* should be treated as a single unified concept or split by context (worship, supplication, spending, prophetic mission)
- Whether 2:138 ("ours is the religion of Allah") qualifies as ikhlāṣ or as millat-Ibrahim declaration

---

## 2. Child Education (`child-education`)

### Topic Definition (Production)
- **Title:** Child Education
- **Scope:** Moral, religious, worldly education
- **Description:** Educating children in Islam
- **Parent:** family-relationships → parenting-child-development → child-education
- **Related:** child-development, righteous-offspring
- **Existing production mappings:** 3

### Evidence Found in Extractions
- **Grep matches:** 295 across 50+ extraction files
- **Candidates mapping to `child-education`:** 0

### Key Qur'anic Passages Identified
| Passage | Content Type | Extraction Status |
|---|---|---|
| 31:14-17 | Luqman's direct moral instruction to son (prayer, enjoining good, forbidding evil, patience) | ✅ Extracted with per-ayah labels |
| 20:132 | "Enjoin prayer upon your family and be steadfast therein" | ✅ Extracted |
| 2:233 | Nursing period, parental responsibilities, weaning | ✅ Extracted |
| 25:74 | Supplication for offspring as "comfort of eyes" and "example for righteous" | ✅ Extracted |
| 19:5-6 | Zakariyya's supplication for heir who inherits prophethood | ✅ Extracted |
| 66:6 | "Protect yourselves and your families from a Fire" | ✅ Extracted |
| 18:46 | Wealth and children as adornment vs. enduring good deeds | ✅ Extracted |
| 46:15-17 | Parental gratitude, child's ingratitude contrast | ✅ Extracted |
| 17:31 | Prohibition of killing children for fear of poverty | ✅ Extracted |
| 6:140 | Loss of those who killed children in foolishness | ✅ Extracted |
| 4:9 | Fear for weak offspring left behind | ✅ Extracted |
| 31:15 | Disobedience to parents when they command shirk | ✅ Extracted |
| 2:102 | Solomon-era teaching of magic (negative education example) | ✅ Extracted |

### Diagnosis
**COMBINED MAPPING + SCOPE GAP.**

Rich extraction evidence exists across 295 matches in 50+ files. However, the content spans multiple distinct sub-concepts that the single `child-education` topic may not adequately capture:

1. **Direct moral/religious instruction** (31:14-17, 20:132) — genuine child education
2. **Parental responsibility and care** (2:233, 4:9, 46:15) — parenting, not strictly education
3. **Supplication for righteous offspring** (25:74, 19:5-6) — aspiration, not instruction
4. **Children as test/adornment** (18:46, 64:15) — theological framing, not pedagogy
5. **Protection of children from harm** (17:31, 6:140, 66:6) — safeguarding, not teaching
6. **Negative examples of mis-education** (2:102) — cautionary, not prescriptive

Only categories 1 and partially 2 constitute genuine "child education" in the strict sense. Categories 3-6 are related but distinct concepts that may warrant separate topic treatment or sub-dimension classification.

### Recommendation
1. **Map existing extraction evidence** to `child-education` for category 1 verses (31:14-17, 20:132, 2:233 partial)
2. **Evaluate whether `child-education` needs sub-dimensions:**
   - Moral/religious instruction
   - Physical care and nurturing
   - Supplication for righteous offspring
   - Protection from harm
3. **Consider whether `righteous-offspring` (related topic) should absorb category 3**
4. **Expand production mappings** from 3 to ~15-20 after scholarly review and scope clarification
5. **Do NOT map every verse mentioning children** — the user explicitly warned against this

### Scholarly Review Required
- Whether Luqman's instruction (31:14-17) constitutes a paradigmatic model of Islamic child education or a unique prophetic-wisdom tradition
- Whether 2:233 (nursing/weaning) belongs under child-education or under a separate "parental-obligations" topic
- Whether the scope should include adult spiritual education (tarbiyah) or remain restricted to minors
- Whether 66:6 ("protect your families from Fire") is educational instruction or general guardianship obligation

---

## 3. Al-Nafs al-Muṭmaʾinnah (`nafs-mutmainna`)

### Topic Definition (Production)
- **Title:** Nafs al-Mutma'inna
- **Scope:** Self at peace with Allah
- **Description:** The tranquil self
- **Parent:** ethics-character → spiritual-states-nafs → nafs-levels
- **Related:** nafs-lawwama, tazkiyah
- **Specialized:** true
- **Existing production mappings:** 2

### Evidence Found in Extractions
- **Grep matches:** 80 across 25+ extraction files
- **Candidates mapping to `nafs-mutmainna`:** 0

### Key Qur'anic Expressions Identified
| Expression | Verses | Distinct Concept? |
|---|---|---|
| *al-nafs al-muṭmaʾinnah* (the reassured/tranquil soul) | 89:27-30 | ✅ Explicit term, unique occurrence |
| *al-nafs al-lawwāmah* (the reproaching soul) | 75:2 | ✅ Explicit term, unique occurrence |
| *al-nafs al-ammārah bi-l-sūʾ* (the soul commanding evil) | 12:53 | ✅ Explicit term, unique occurrence |
| *sakīnah* (tranquillity sent down) | 48:4, 48:18, 48:26, 9:26, 9:40, 2:248 | ⚠️ Related but distinct: divine gift, not achieved state |
| *iṭmiʾnān al-qalb* (heart assurance) | 13:28, 5:113 | ⚠️ Related but qalb-specific, not nafs-specific |
| *tazkiyat al-nafs* (purification of soul) | 91:7-10, 87:14, 92:18, 80:3 | ⚠️ Process leading to muṭmaʾinnah, not the state itself |
| *nafsun wāḥidah* (single soul) | 4:1, 39:6 | ❌ Creation narrative, unrelated |
| *kullu nafsin dhāʾiqat al-mawt* (every soul tastes death) | 3:185, 21:35, 29:57 | ❌ Mortality principle, unrelated |

### Diagnosis
**MAPPING + DISTINCTION GAP.**

The explicit term *al-nafs al-muṭmaʾinnah* occurs only once (89:27) and is correctly extracted with per-ayah labels. However, the broader conceptual field includes three distinct nafs-states (ammārah, lawwāmah, muṭmaʾinnah) that form a coherent Qur'anic anthropology, plus related concepts (sakīnah, iṭmiʾnān, tazkiyah) that are frequently conflated.

The existing 2 production mappings likely cover only 89:27-28. The extraction evidence for the broader nafs typology is substantial (80 matches) but unmapped.

### Recommendation
1. **Confirm `nafs-mutmainna` scope:** Should it cover only the explicit 89:27 occurrence, or the entire three-state nafs typology?
2. **If narrow scope:** Add mapping for 89:27-30 only; create separate topics for `nafs-lawwama` and `nafs-ammara`
3. **If broad scope:** Rename to `nafs-states-typology` and map all three explicit terms plus tazkiyah process verses
4. **Distinguish clearly from sakīnah:** Sakīnah is a divine gift bestowed upon believers/community; nafs muṭmaʾinnah is an achieved spiritual state of the individual self
5. **Distinguish from iṭmiʾnān al-qalb:** Heart-assurance (13:28) is cognitive/emotional; nafs-muṭmaʾinnah is ontological/spiritual
6. **Map tazkiyah verses** (91:7-10, 87:14, 92:18) as the *process* leading to the muṭmaʾinnah state, not as the state itself

### Scholarly Review Required
- Whether the three nafs-states constitute a unified Qur'anic psychological framework or are independent expressions
- Whether 89:27 addresses the Prophet specifically or establishes a universal eschatological category
- Whether sakīnah (divine tranquillity) and nafs muṭmaʾinnah (achieved tranquillity) should be treated under one dimension or separated
- Whether classical tafsir traditions on the nafs typology should inform the topic structure

---

## Summary of Decisions

| Topic | Gap Type | Extraction Evidence | Candidates Mapped | Production Mappings | Action Required |
|---|---|---|---|---|---|
| ikhlas-sincerity | Mapping gap | 269 verse keys, 30+ surahs | 0 | 5 | Create candidates with explicit overlap; expand mappings |
| child-education | Mapping + scope gap | 295 matches, 50+ files | 0 | 3 | Clarify scope/sub-dimensions; selective mapping |
| nafs-mutmainna | Mapping + distinction gap | 80 matches, 25+ files | 0 | 2 | Define scope (narrow vs. broad); distinguish from sakīnah/tazkiyah |

## Next Steps

1. **Await scholarly direction** on scope decisions for child-education and nafs-mutmainna
2. **Upon approval:** Create targeted candidates with proper `existingTopicOverlap` entries
3. **Update gap-analysis.json** to reclassify these from "extraction-gap" to "mapping-gap"
4. **Proceed to remaining 19 extraction gaps** using same audit methodology
5. **Phase D remains gated** — no production changes until human scholarly approval

---

*All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"`.*
*AI will never replace scholars. This analysis makes their examination more rigorous, transparent and traceable.*
