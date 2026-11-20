# MFD-11.1 — Gap Audit Batch 4

**Generated:** 2026-11-21
**Scope:** Divine Unity (divine-unity)
**Status:** AI-assisted analysis, pending scholarly review
**Auditor:** agent-46

---

## 4. Divine Unity (`divine-unity`)

### Topic Definition (Production)
- **Title:** Divine Unity
- **Urdu Title:** الٰہی وحدت
- **Arabic Title:** الوحدانیة الإلهیة
- **Description:** Concept of Allah's absolute oneness
- **Scope:** Oneness in essence, attributes, and actions
- **Parent Domain:** belief-theology
- **Parent Dimension:** allah-divine-attributes
- **Related Topics:** tawheed-fundamentals, tawheed-rububiyyah
- **Search Aliases:** oneness, unity
- **Specialized:** false
- **Provenance:** pending-scholarly-review
- **Quranic Relevance:** 3 ayah mapping(s) identified
- **Existing Production Mappings:** 3 (map-divine-unity-0011 through map-divine-unity-0013)

### Comparison with Tawheed Topics
No standalone `tawheed` topic exists in production taxonomy. Instead, tawheed is decomposed into 5 specialized subtopics under `allah-divine-attributes` and `tawheed-oneness`:

| Topic ID | Scope | Mapped Verses |
|---|---|---|
| `tawheed-fundamentals` | Core concept of divine unity | 6 (2:163, 2:255, 3:18, 4:171, 6:102, 112:1-4) |
| `tawheed-rububiyyah` | Allah as sole Creator, Sustainer, Owner | 4 |
| `tawheed-uluhiyyah` | Directing all worship to Allah alone | 4 |
| `tawheed-asma-wa-sifat` | Affirming divine names without distortion | 4 |
| `tawheed-evidence` | Arguments for monotheism | 4 |

**Critical Overlap:** All 3 `divine-unity` verses (2:163, 4:171, 112:1-4) are **also** mapped to `tawheed-fundamentals`. This is **100% verse-level overlap**.

### Evidence Found in Extractions

> **Note on schema:** Extraction files use `mainSubject` / `subordinateSubjects` arrays with per-subject `keys`, not a flat `passages[]` array. Initial counts using incorrect schema returned 0; corrected analysis below.

- **Extraction files scanned:** 473
- **Files with any divine-unity/tawheed-related subject match:** 57
- **Broad tawheed-pattern subjects** (worship Allah alone, tawheed, associate nothing): **71 subjects** covering **~400 distinct verse keys**
- **Ontological divine-unity subjects** (wahid, ahad, one God, la ilaha illa, sole deity, divine oneness): **32 subjects** covering **~102 distinct verse keys**
- **Files with `divine-unity` in `topicCandidateIds`:** 0 (ZERO) — extractions use opaque candidate IDs (e.g., `cand-0089`) rather than direct topic IDs
- **Files with `tawheed-fundamentals` in `topicCandidateIds`:** 0 (ZERO)
- **Production topic tags applied during extraction:** None found for either topic

#### Sample Extraction Subjects (Ontological Divine Unity, Untagged)
The following subordinate/main subjects contain explicit divine-unity content but carry NO production topic mapping:

| File | Verse Keys | Subject Label |
|---|---|---|
| 002-al-baqarah-p26.json | 2:163 | "Tawheed declaration: Ilahukum ilahun wahidun" |
| 002-al-baqarah-p37.json | 2:255 | "Ayat al-Kursi: Allah la ilaha illa huwa al-Hayy al-Qayyum" |
| 003-al-imran-p1.json | 3:2 | "Tawheed declaration: la ilaha illa huwa al-Hayy al-Qayyum" |
| 004-an-nisa-p19.json | 4:171 | "Tawheed: Allah one God exalted above having son" |
| 005-al-maidah-p9.json | 5:73 | "Trinity doctrine rejected: no god except One God" |
| 006-al-anam-p11.json | 6:102 | "Tawheed-formula: la ilaha illa huwa with exclusive worship-command" |
| 006-al-anam-p2.json | 6:19 | "Tawheed declaration: ilahun wahidun with bara'a from shirk" |
| 014-ibrahim-p2.json | 14:52 | "Quran as notification warning people establishing one God" |
| 016-an-nahl-p2.json | 16:51 | "Prohibition against taking two deities affirming one God" |
| 021-al-anbiya-p1.json | 21:25 | "Universal messenger message affirming no deity except Allah" |
| 023-al-muminun-p2.json | 23:52 | "Ummah wahidah principle declaring religious unity under single Lord" |

### Gap Classification

**VERDICT: MAPPING GAP (not extraction gap, not redundant)**

#### Rationale
1. **Content Exists Abundantly:** Corrected schema-aware analysis found **32 ontological divine-unity subjects** covering **~102 distinct verse keys** across 57 extraction files. An additional **71 doctrinal/worship tawheed subjects** cover ~400 verse keys. The raw material is thoroughly extracted.
2. **Zero Production Topic Tags Applied:** Despite abundant content, neither `divine-unity` nor any `tawheed-*` topic ID appears in extraction `topicCandidateIds`. Extractions use opaque candidate IDs (e.g., `cand-0089`) that have not been resolved to production topic IDs. This is a systematic tagging/linkage failure, not a content absence.
3. **Partial Redundancy with tawheed-fundamentals:** At the production mapping level, `divine-unity` is 100% subsumed by `tawheed-fundamentals` (all 3 verses overlap). However, the *scope* differs:
   - `divine-unity`: "Oneness in essence, attributes, and actions" (ontological focus)
   - `tawheed-fundamentals`: "Core concept of divine unity" (broader doctrinal entry point)
4. **Distinct Value Proposition:** `divine-unity` serves as a concise ontological anchor that complements the doctrinal decomposition of tawheed into rububiyyah/uluhiyyah/asma-wa-sifat. It captures the *metaphysical assertion* of oneness distinct from its *functional implications* (lordship, worship, naming).
5. **Extraction Evidence Far Exceeds Production Mappings:** Only 3 verses are mapped in production for `divine-unity`, yet extraction subjects identify ~102 distinct verse keys with ontological oneness content. This represents a massive under-mapping.
6. **Sibling Coverage Adequate:** The 5 tawheed-* topics collectively cover 22 verses in production mappings. The conceptual territory is well-covered structurally, but the extraction-to-topic linkage is broken.

#### Recommendations
1. **DO NOT remove `divine-unity`** — it provides a useful ontological entry point distinct from doctrinal subcategories
2. **Fix extraction-to-topic linkage pipeline** — the opaque `topicCandidateIds` (e.g., `cand-0089`) need resolution to production topic IDs; investigate why candidate-to-topic mapping was never completed for divine-unity and tawheed-* topics
3. **Expand `divine-unity` production mappings** — only 3 verses are mapped despite ~102 extraction-subject verse keys containing ontological oneness content; prioritize high-value verses like 2:255 (Ayat al-Kursi), 3:2, 5:73, 6:19, 6:102, 14:52, 16:22, 16:51, 21:25, 23:52
4. **Differentiate scope from tawheed-fundamentals** — consider narrowing `divine-unity` to strictly ontological/metaphysical oneness (wahid, ahad, la ilaha illa declarations) while reserving `tawheed-fundamentals` for broader doctrinal contexts including worship commands and shirk prohibitions
5. **Priority:** Medium-High — the extraction content is rich (~102 verse keys) but production coverage is minimal (3 verses); fixing this gap would significantly improve topic discoverability

### Summary Statistics

| Metric | Value |
|---|---|
| Production mappings (divine-unity) | 3 |
| Production mappings (all tawheed-*) | 22 |
| Verse overlap (divine-unity ∩ tawheed-fundamentals) | 3/3 (100%) |
| Extraction files scanned | 473 |
| Files with divine-unity/tawheed subject matches | 57 |
| Ontological divine-unity subjects | 32 |
| Ontological divine-unity distinct verse keys | ~102 |
| Doctrinal/worship tawheed subjects | 71 |
| Doctrinal/worship tawheed distinct verse keys | ~400 |
| Production topic tags in extractions | 0 |
| Gap type | **MAPPING GAP** |
| Redundant with tawheed? | Partially (verse-level yes, scope-level no) |
| Action required | Fix candidate-to-topic linkage; expand divine-unity mappings to ~20-30 key verses |

---

## 2. Iman and Amal (`iman-and-amal`)

### Topic Definition (Production)
- **Title:** Iman & Amal Relationship
- **Urdu Title:** ایمان اور عمل کا تعلق
- **Arabic Title:** العلاقة بین الایمان والعمل
- **Description:** Relationship between faith and action
- **Scope:** Faith includes belief, speech, and action
- **Parent Domain:** belief-theology
- **Parent Dimension:** iman-faith-pillars
- **Related Topics:** pillars-of-iman, faith-increase-decrease
- **Search Aliases:** faith and deeds
- **Specialized:** true
- **Provenance:** pending-scholarly-review
- **Quranic Relevance:** 4 ayah mapping(s) identified
- **Existing Production Mappings:** 4 (map-iman-and-amal-0058 through map-iman-and-amal-0061)

### Evidence Found in Extractions

> **Note on schema:** Extraction files use `mainSubject` / `subordinateSubjects` arrays with per-subject `keys`, plus opaque `topicCandidateIds` referencing a separate candidate registry. Direct topic IDs do NOT appear in extraction files.

- **Extraction files scanned:** 473 JSON files across all surahs
- **Grep matches for broad faith+deeds / believe+righteous pattern:** 173+ across 52 distinct surahs
- **Distinct verse keys with iman-amal formula in extraction subjects:** 170 unique verse keys (e.g., 2:82, 3:57, 4:124, 5:9, 18:107, 19:96, 84:25, 85:11, 95:6, 98:7, 103:3)
- **Distinct surahs with extracted content matching the formula:** 52 out of 114 (45.6% of the Qur'an)
- **Total distinct topicCandidateIds across corpus:** 2,049 (none currently resolve to `iman-and-amal`)
- **Candidates explicitly carrying `iman-and-amal` topic tag in extractions:** 0 (ZERO)
- **Key recurring formula:** *alladhīna āmanū wa ʿamilū al-ṣāliḥāt* ("those who believe and do righteous deeds") — appears in extraction labels across virtually every major surah grouping
- **Extraction schema note:** The topic-to-verse linkage exists only in `data/taxonomy/topic-ayah-mappings.json`, confirming the gap is entirely at the mapping layer.

### Existing Production Mappings (4 total)

| Mapping ID | Surah:Ayah | Rationale |
|---|---|---|
| map-iman-and-amal-0058 | 2:82 | "Those who believe and do righteous deeds" |
| map-iman-and-amal-0059 | 3:57 | "Those who believe and do righteous deeds - their Lord will guide them" |
| map-iman-and-amal-0060 | 8:2-4 | "Believers are those whose hearts tremble when Allah is mentioned" |
| map-iman-and-amal-0061 | 103:1-3 | "Except those who believe and do righteous deeds" |

### Gap Classification

**VERDICT: EDITORIAL CONSTRUCT + SEVERE MAPPING GAP**

This is NOT a pure extraction gap. The Qur'anic material relevant to the faith-action relationship is among the MOST extensively extracted content in the entire corpus, appearing in 173+ extraction entries across 52 surahs covering 170 distinct verse keys. However, only 4 verses have been mapped to this topic, representing approximately 2-3% of the available evidence.

More critically, there is a fundamental **editorial/conceptual question** about whether `iman-and-amal` should exist as a distinct topic at all:

1. **The formula *alladhīna āmanū wa ʿamilū al-ṣāliḥāt* is the standard Qur'anic description of believers**, not a specialized theological concept. It appears dozens of times as a stock phrase describing the saved/believing community. Treating each occurrence as a separate topical instance would be analogous to creating a topic for "those who pray" or "the righteous" — it describes a category of people rather than articulating a discrete doctrinal teaching.

2. **The existing related topics already cover the constituent elements:**
   - `pillars-of-iman` covers the doctrinal content of faith (3 mappings)
   - `faith-increase-decrease` covers the dynamic relationship between obedience/disobedience and faith levels (4 mappings)
   - No dedicated `righteous-deeds` topic was found in the taxonomy, but righteous action is covered under worship, ethics, and reward dimensions

3. **The 4 existing mappings are inconsistent in scope:**
   - 2:82 and 3:57 are straightforward instances of the formula
   - 8:2-4 defines true believers by internal states (heart trembling, increased faith) AND external actions (prayer, spending) — this is more properly a definition-of-believer passage
   - 103:1-3 adds communal obligations (mutual counsel to truth and patience) beyond individual faith+deeds

4. **The topic's stated scope ("Faith includes belief, speech, and action") reflects a classical Sunni theological position** (specifically the Athari/Ash'ari definition of iman as *i'tiqad + qawl + 'amal*). This is a theological construct derived from hadith and scholarly consensus, not a direct Qur'anic category. The Qur'an does not explicitly define iman as comprising three components; rather, it consistently pairs belief with righteous action as co-requisites for salvation.

5. **Mapping coverage is severely deficient regardless of conceptual decision:**
   - If kept as-is: needs expansion from 4 to ~30-50 mappings covering the formula's major occurrences
   - If restructured: constituent verses need redistribution to appropriate topics

### Recommendations

1. **Resolve the conceptual status BEFORE expanding mappings:**
   - **Option A (Keep as Cross-Reference Node):** Retain `iman-and-amal` as a specialized topic linking faith and action concepts, but limit mappings to passages that EXPLICITLY discuss the RELATIONSHIP between faith and deeds (not merely juxtapose them). Estimated 15-25 qualifying verses including 2:82, 3:57, 4:124, 5:9, 6:82, 8:2-4, 10:9, 11:23, 18:30, 19:96, 29:7, 31:8, 32:19, 45:21, 47:2, 48:29, 57:7, 64:9, 65:11, 66:8, 84:25, 85:11, 95:6, 98:7, 103:3.
   - **Option B (Deprecate/Redirect):** Remove as standalone topic; redirect search alias "faith and deeds" to `pillars-of-iman` and relevant ethics/worship topics. Add cross-references in those topics noting the Qur'anic pairing.
   - **Option C (Expand as Major Theme):** Treat as a first-class thematic topic covering all 50+ occurrences of the formula, accepting that it functions as the Qur'an's primary soteriological criterion.

2. **If Option A or C is chosen, immediately expand production mappings:**
   - Current 4 mappings cover <5% of available evidence
   - Priority additions: 4:124, 5:9, 6:82, 10:9, 18:30, 19:96, 29:7, 31:8, 45:21, 47:2, 57:7, 64:9, 84:25, 85:11, 95:6, 98:7 (minimum 16 additional mappings)

3. **Clarify the topic's relationship to hadith-based theology:**
   - The scope statement "Faith includes belief, speech, and action" should note its provenance in prophetic tradition (hadith Jibril, etc.) rather than presenting it as purely Qur'anic
   - Consider adding a `provenanceNote` field distinguishing Qur'anic evidence from theological synthesis

4. **Add missing sibling topic:** Create `righteous-deeds` or `salihat` topic if not already present, since the amal component currently has no dedicated home and is scattered across worship/ethics dimensions.

5. **Update extraction candidate overlap:** Once conceptual decision is made, batch-add `iman-and-amal` (or successor) tags to the 170+ extraction verse keys currently lacking this topic association.

### Scholarly Review Required

- **Primary question:** Is *alladhīna āmanū wa ʿamilū al-ṣāliḥāt* a distinct theological topic requiring its own taxonomy node, or is it the Qur'an's standard descriptive formula for believers that should be handled through cross-referencing existing faith and deeds topics?
- **Secondary question:** Does the topic scope "Faith includes belief, speech, and action" accurately reflect Qur'anic usage, or does it import post-Qur'anic theological categories? The Qur'an pairs iman and amal but does not explicitly decompose iman into three components.
- **Tertiary question:** Should the 4 existing mappings be retained as-is, revised, or redistributed? Mapping 8:2-4 in particular seems better suited to a "definition of true believer" topic.
- **Coverage adequacy:** If retained, what is the appropriate mapping count — minimal representative set (~15-25) or comprehensive coverage (~50+)?
- **Relationship to `faith-increase-decrease`:** How should these two topics be distinguished? Both address the faith-action nexus but from different angles (static pairing vs. dynamic causation).

### Summary Statistics

| Metric | Value |
|---|---|
| Production mappings (iman-and-amal) | 4 |
| Distinct verse keys with formula in extractions | 170 |
| Distinct surahs with matching content | 52 (45.6% of Qur'an) |
| Extraction pattern matches | 173+ |
| Extraction files with topic tag | 0 |
| Gap type | **EDITORIAL CONSTRUCT + MAPPING GAP** |
| Mapping coverage | ~2-3% of available evidence |
| Action required | Resolve conceptual status; expand or deprecate; fix tagging pipeline |

---

*All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"`.*
*AI will never replace scholars. This analysis makes their examination more rigorous, transparent and traceable.*
