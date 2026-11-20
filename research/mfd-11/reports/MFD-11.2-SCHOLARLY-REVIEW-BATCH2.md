# MFD-11.2 Scholarly Review — Batch 2

## 1. Prophetic Wisdom (`prophetic-wisdom`)

### 1. Conceptual Definition
The topic `prophetic-wisdom` claims to represent "Wisdom in prophetic teachings" with scope defined as "Hikmah in prophetic guidance." It is positioned under the `prophetic-guidance` dimension within `revelation-guidance`, implying a distinct category of wisdom specifically associated with prophets as opposed to divine wisdom (`divine-wisdom`) or general human wisdom.

### 2. Qur'anic Grounding

| Verse | Explicit/Contextual | Content Summary |
|-------|---------------------|-----------------|
| 2:129 | Explicit | Ibrahim's dua: "Our Lord, send among them a messenger from themselves who will recite Your verses, teach them the Book and **wisdom** (al-ḥikmah), and purify them." Hikmah here is paired with al-kitāb as the dual content of prophetic teaching. |
| 3:164 | Explicit | "Allah has conferred favor upon believers by sending a messenger... reciting verses, purifying them, teaching the Book and **wisdom** (al-ḥikmah)." Identical pairing to 2:129; describes Muhammad's mission. |
| 16:125 | Explicit | "Invite to the way of your Lord with **wisdom** (bi-l-ḥikmah) and good instruction (mawʿiẓah ḥasanah)." Hikmah here refers to the *method* of da'wah, not a body of knowledge taught. |
| 43:63–64 | Contextual | "When Isa came with clear proofs (bayyināt)... he said 'I have come to you with **wisdom** (bi-l-ḥikmah) to clarify what you differ about.'" Rationale in mapping file says "clear proofs, fear Allah and obey me" but does not mention hikmah explicitly; the verse uses ḥikmah for Isa's clarifying function. |

**Assessment:** Three of four mappings are DIRECT_REFERENCE with explicit ḥikmah terminology. However, the concept is not uniform:
- In 2:129 and 3:164, ḥikmah is a *revealed corpus* paired with al-kitāb (the Book).
- In 16:125, ḥikmah is a *pedagogical method* (how to invite).
- In 43:63, ḥikmah is a *clarifying authority* brought by Isa.

Critically, the extraction data shows that ḥikmah is attributed to **multiple distinct recipients** across the Qur'an:
- **Ibrahim**: 2:129 (prayer for it), 4:54 ("We gave the family of Ibrahim scripture and wisdom")
- **Yusuf**: 12:22 ("We gave him judgment and knowledge/wisdom")
- **Musa**: 28:14 ("When he reached maturity, We gave him judgment and knowledge")
- **Dawud**: 2:251 ("Allah gave him kingdom and wisdom"), 38:20 ("We strengthened his kingdom and gave him wisdom and decisive speech")
- **Isa**: 3:48 ("He will teach him the Book and wisdom"), 5:110 ("I taught you the Book and wisdom"), 43:63
- **Luqman**: 31:12 ("We gave Luqman wisdom: be grateful to Allah")
- **Muhammad**: 2:151, 3:164, 4:113, 62:2 (all "teaching the Book and wisdom")

This demonstrates that ḥikmah is **not a unified prophetic concept** but a polyvalent term whose meaning shifts contextually: for Dawud it includes judicial discernment and kingship; for Luqman it means gratitude-based ethical counsel; for Yusuf/Musa it means judgment/knowledge at maturity; for Muhammad it is the revealed companion to the Qur'an; for Isa it is clarification of disputed matters.

### 3. Semantic Integrity
- **English label "Prophetic Wisdom"**: Implies a single coherent category belonging to prophets. This imposes a later intellectual framework that treats all instances of prophetic ḥikmah as one thing. The Qur'an does not use the compound phrase "al-ḥikmah al-nabawiyyah" anywhere.
- **Arabic label "الحكمة النبوية" (al-Ḥikmah al-Nabawiyyah)**: Same problem — this is a scholarly construct, not a Qur'anic term. The Qur'an says "wa-yuʿallimuhumu l-kitāba wa-l-ḥikmah" (teaches them the Book and wisdom) without qualifying ḥikmah as "prophetic."
- **Urdu title "نبوی حکمت"**: Mirrors the Arabic scholarly framing.
- **Search alias "prophetic wisdom"**: Reinforces the unified-category assumption.

**Verdict:** The labels impose a unifying taxonomy onto a term (ḥikmah) that the Qur'an uses in at least four distinct senses across different prophets. The English/Arabic labels suggest a single doctrinal category where the Qur'an presents contextual functions.

### 4. Taxonomic Distinction

| Sibling/Related Topic | Dimension | Mappings | Relationship to prophetic-wisdom |
|----------------------|-----------|----------|----------------------------------|
| `prophetic-methodology` | prophetic-guidance | 4 | Directly related; 16:125 (da'wah with wisdom) is arguably methodology, not a separate "wisdom" topic. Overlap likely. |
| `divine-wisdom` | divine-decree-qadr | 11 | Distinct domain (belief-theology vs revelation-guidance). Divine-wisdom covers Allah's attribute of Ḥakīm and wisdom behind decree. No overlap in mapped āyāt. |
| `old-age-wisdom` | (unknown dim) | 4 | Covers aging-related wisdom (16:70, 22:5, 36:68, 46:15). Distinct life-stage concept. |
| `sunnah-definition` | sunnah-prophetic-tradition | 5 | Sunnah as prophetic example; conceptually adjacent but taxonomically separate. |
| `prophet-definition` | prophethood-messengership | 5 | Definitional; no direct overlap. |

**Critical observations:**
1. **No `hikmah-wisdom` topic exists.** There is no general "wisdom" topic that could serve as the parent category. The taxonomy splits wisdom into three silos: divine-wisdom (decree), prophetic-wisdom (teaching), old-age-wisdom (aging). This fragmentation misses the Qur'anic reality that ḥikmah is a single term with contextual applications.
2. **16:125 belongs more naturally under `prophetic-methodology`** since it prescribes *how* to do da'wah, not *what* wisdom is. The current mapping creates artificial separation.
3. **Major ḥikmah passages are unmapped**: 2:269 ("Allah gives wisdom to whom He wills"), 3:81 (covenant of prophets mentioning scripture and wisdom), 4:54 (family of Ibrahim given scripture and wisdom), 5:110 (Isa taught Book and wisdom), 12:22 (Yusuf given judgment/wisdom), 28:14 (Musa given wisdom at maturity), 31:12 (Luqman given wisdom), 38:20 (Dawud given wisdom). These are either orphaned or misassigned.
4. **43:63-64 mapping rationale is weak**: The rationale cites "clear proofs, fear Allah and obey me" without mentioning ḥikmah, suggesting keyword matching rather than conceptual analysis.

### 5. Epistemic Provenance
- **Classification type:** Contemporary editorial application with partial scholarly synthesis
- **Source indicators:**
  - All four ayah mappings carry `provenance: "pending-scholarly-review"` and `sourceIds: ["quran-json"]`, indicating automated extraction
  - The tripartite split (divine/prophetic/old-age wisdom) reflects modern topical categorization, not classical tafsīr organization
  - Classical tafsīr treats ḥikmah contextually: as tafsīr of the Qur'an (for Muhammad), as judicial discernment (for Dawud), as ethical counsel (for Luqman), as revealed knowledge (for Isa/Yusuf/Musa)
  - The compound "al-ḥikmah al-nabawiyyah" appears in later hadith scholarship (e.g., al-Hakim's usage) but not in Qur'anic self-description
- **Qur'anic vs. derived:** The *term* ḥikmah is Qur'anic; the *unified category "prophetic wisdom"* is editorial

### 6. Disposition
**MERGE**

### Rationale
`prophetic-wisdom` does not represent a unified Qur'anic concept. The Qur'an attributes ḥikmah to multiple prophets in contextually distinct ways, and the current topic artificially unifies these under a single label that the Qur'an never uses. Additionally:

1. **Semantic fragmentation**: The four mapped āyāt span three different senses of ḥikmah (revealed corpus, da'wah method, clarifying authority), making the topic internally incoherent.
2. **Taxonomic gap**: No general `hikmah-wisdom` topic exists to properly organize the Qur'anic ḥikmah concept across its various recipients and senses.
3. **Overlap with `prophetic-methodology`**: 16:125 is methodological, not substantive wisdom content.
4. **Incomplete coverage**: Major ḥikmah passages (2:269, 4:54, 5:110, 12:22, 28:14, 31:12, 38:20) are unmapped, indicating the topic fails to capture even its own claimed scope.
5. **Distinction from `divine-wisdom` is valid but insufficient**: While divine-wisdom (Allah's attribute/decree) is genuinely distinct from human/prophetic ḥikmah, the solution is not to maintain a flawed "prophetic-wisdom" topic but to create a proper `hikmah-wisdom` topic that encompasses all non-divine ḥikmah contexts.

**Recommended action:** MERGE `prophetic-wisdom` into a new or redefined `hikmah-wisdom` topic that:
- Covers ḥikmah as a polyvalent Qur'anic concept across all recipients (prophets, Luqman, believers generally)
- Distinguishes contextual senses (revealed corpus, judicial discernment, ethical counsel, da'wah method, clarifying authority)
- Cross-references `divine-wisdom` for the divine attribute sense
- Cross-references `prophetic-methodology` for 16:125 and similar pedagogical passages
- Absorbs currently unmapped ḥikmah āyāt (2:269, 4:54, 5:110, 12:22, 28:14, 31:12, 38:20)

If creating a new topic is out of scope for this review cycle, then RECLASSIFY `prophetic-wisdom` as a sub-aspect of `prophetic-methodology` (since the strongest mappings relate to teaching/da'wah) and flag the broader ḥikmah taxonomy gap for future work.

### Scholarly Review Questions
1. Should the taxonomy treat ḥikmah as a single polyvalent concept with contextual subtypes, or maintain separate topics per recipient/sense?
2. Is there sufficient Qur'anic basis for distinguishing "prophetic ḥikmah" from "non-prophetic ḥikmah" (e.g., Luqman, believers in 2:269), or is this distinction imposed by later tradition?
3. Does 16:125 belong under methodology (how to teach) or wisdom (what to teach)? The current placement assumes the latter.
4. Are the 4 currently mapped āyāt representative of the full Qur'anic ḥikmah corpus, or were they selected by keyword matching without contextual analysis?
5. Should `divine-wisdom` and any human-wisdom topic share a common parent dimension, or remain in separate domains (belief-theology vs revelation-guidance)?
