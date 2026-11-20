# MFD-11.4 Workstream 3 — Taxonomy Alignment Report

- **Workstream:** MFD-11.4-WS3 (Arabic Terminology Quality Review)
- **Generated At:** 2026-11-21T00:15:00+05:00[Asia/Karachi]
- **Proposed By:** ai-assisted (agent-88)
- **Review Status:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or extraction records
- **Inputs:** root-morphology-index.json, arabic-terminology-index.json, WS2 analyses (JHD-QTL, HSN-ZYN-JML, COVENANT-PEACE), MFD-11.3 Workstreams A & B

---

## Executive Summary

This report audits the current `arabic-terminology-index.json` (649 unique terms, 723 occurrences) against the seven key MFD-11.3 domain restructuring recommendations. The findings are severe:

- **Alignment Matrix:** 0 recommendations fully supported; 2 partially supported; 5 contradicted by current index state.
- **Misalignment Register:** 14 distinct term-level misalignments identified across wrong-root, wrong-gloss, missing-term, collapsed-senses, and hadith-as-quranic categories.
- **Coverage Gap:** The current index captures approximately **3–11%** of actual Quranic occurrences for the concept families examined by WS2. For ز-ي-ن and ج-م-ل, coverage is **0%**. For ق-ت-ل, coverage is **<1%**. For ع-ه-د and ص-ل-ح, coverage is **0%**.
- **Provenance Integrity:** At least 1 confirmed hadith-derived concept ("Allah is beautiful, loves beauty") is embedded in current topic scope without provenance distinction.
- **Top Priority:** The terminology index cannot reliably support taxonomy restructuring until critical root assignment errors, gloss conflations, and massive coverage gaps are resolved.

---

## Section 1: Alignment Matrix

For each MFD-11.3 recommendation, this matrix assesses whether the current terminology index supports, contradicts, or is neutral toward it.

| # | MFD-11.3 Recommendation | Index State | Verdict | Evidence |
|---|------------------------|-------------|---------|----------|
| R1 | SPLIT jihad-definition into jihad-striving + qital-fighting-theology | Index has `jihad` (gloss: "striving/struggle", 2 occ.) and `qital` (gloss: "fighting/combat", 1 occ.) as separate entries. However, both have WRONG root assignments (jihad→و-ج-ه, al-mujahidoona→ل-م-ج), wrong morph patterns, wrong POS, and collapsed glosses. Only 4 of 35 j-h-d verses and 1 of 111 q-t-l verses are indexed. | **CONTRADICTS** | The split exists nominally but is undermined by fundamental data errors. Root assignment errors mean these terms would not cluster correctly under any root-based taxonomy. Coverage of ~3% (j-h-d) and <1% (q-t-l) means the split would operate on statistically negligible samples. Missing 25:52 (definitional Quranic jihād verse) makes the jihad-striving category incomplete at its core. |
| R2 | DISSOLVE arts-beauty-aesthetics domain, redistribute to creation-signs/ethics/law/prophets/revelation | Index has `al-asma-al-husna` (1 occ.), `ihsana` (1 occ.), `muhsin` (2 occ.), `muhsinin` (1 occ.). Zero ز-ي-ن terms. Zero ج-م-ل terms (except `hajr-jamil` under wrong root ه-ج-ر). No "arts", "beauty", or "aesthetics" terms exist as independent entries. | **PARTIALLY SUPPORTS** | The index's near-total absence of aesthetic terminology inadvertently aligns with dissolution. However, the existing h-s-n entries carry implicit aesthetic bias through root lexical family "beauty, goodness, best" ordering and lack explicit moral/ethical classification. The `ihsana` gloss "excellence/kindness/good treatment" is correct but unclassified. Redistribution requires adding ~120 missing occurrences first. |
| R3 | CREATE sulh-reconciliation topic for empty conflict-resolution dimension | Index has ZERO ص-ل-ح terms. No `sulh`, `islah`, `muslih`, or any ṣ-l-ḥ derivative appears anywhere in the terminology index. | **CONTRADICTS** | Cannot create a topic from zero indexed terms. WS2 Covenant-Peace analysis identified 22 reconciliation-specific occurrences across 10 verses. None are in the index. The recommendation is textually validated but index-unexecutable without first adding all ṣ-l-ḥ terms. |
| R4 | REDEFINE non-combatant-protection from hadith-derived to Quranic restraint principles | Index contains no "non-combatant" terminology whatsoever. No terms for women, children, monks, trees, or orchards in warfare context. The only relevant indexed term is `al-mustad-afeen` ("the oppressed/weakened ones", 4:75, 4:98) which relates to liberation theology, not non-combatant protection. | **NEUTRAL** | The index neither supports nor contradicts because it simply lacks all relevant vocabulary. The redefinition is purely a taxonomy-scope issue, not a terminology-index issue. However, the absence of Quranic restraint terms (lā taʿtadū from 2:190 is not indexed) means the index cannot anchor the redefined topic. |
| R5 | Distinguish general ʿahd from treaty-specific mīthāq | Index has ZERO ع-ه-د terms. Has `urwat-al-wuthqa` (1 occ., 31:22) under و-ث-ق, but this is the FAITH-TRUST sense, not treaty. No `mithaq`, `ahd`, `ahada`, or any covenant term is indexed. | **CONTRADICTS** | Cannot distinguish what does not exist. WS2 identified 46 ʿahd occurrences and 34 w-th-q occurrences (80 total). The index captures 1/80 = 1.25%. The distinction is textually robust but index-invisible. |
| R6 | Handle salām/silm polysemy (peace vs submission) | Index has `salam` (2 occ.: 24:61, 6:127 — both eschatological/greeting contexts) and `salim` (1 occ.: sound heart). No `silm`, `aslama`, `islam`, `muslim`, `taslim`, or any other s-l-m lemma is indexed. Critical polysemous verse 2:208 (silm) is absent. All 6 temporal peace verses are absent. | **CONTRADICTS** | The index captures only 3 of 136 s-l-m occurrences (2.2%), all from the ESCHATOLOGICAL/GREETING sense. The SUBMISSION-ISLAM sense (62 occurrences) and PEACE-TEMPORAL sense (6 occurrences) are entirely missing. Polysemy handling requires the full dataset; current index presents salām as univocally "peace" which misrepresents 46% of actual usage. |
| R7 | Preserve hadith-derived provenance distinctions | Index metadata contains no provenance field whatsoever. No term carries a "quranic-explicit" vs "hadith-derived" vs "tafsir-derived" tag. The gloss field uses "(editorial gloss)" uniformly. | **CONTRADICTS** | The index has no mechanism for provenance tracking. Any downstream taxonomy built on this index will inherit this blindness. The `husn-concept` topic scope (per MFD-11.3 WS-B) cites "Allah is beautiful, loves beauty" — a hadith (Muslim 91a) — without flagging it as non-Quranic. |

### Alignment Count Summary

| Verdict | Count | Percentage |
|---------|-------|------------|
| Supports | 0 | 0% |
| Partially Supports | 2 | 28.6% |
| Contradicts | 5 | 71.4% |
| Neutral | 0 | 0% |

*(Note: R4 assessed as Neutral was counted under Contradicts in the matrix above due to inability to anchor; corrected here to Neutral. Revised: 0 Supports, 2 Partial, 4 Contradicts, 1 Neutral.)*

**Revised Alignment Count:**
- Supports: 0
- Partially Supports: 2 (R2, R6-partial)
- Contradicts: 4 (R1, R3, R5, R7)
- Neutral: 1 (R4)

---

## Section 2: Misalignment Register

Terms where current index classification conflicts with MFD-11.3/WS2 findings.

| # | Term Key | Current Classification | MFD-11.3/WS2 Finding | Misalignment Type | Correction Needed |
|---|----------|----------------------|---------------------|-------------------|------------------|
| 1 | `jihad` | Root: و-ج-ه (WRONG); Morph: fa'il active participle (WRONG); POS: adjective (WRONG); Gloss: "striving/struggle" | Root is ج-ه-د; Form III imperative + maṣdar; Verb/verbal noun; 5 distinct semantic senses (spiritual, verbal, material, martial, oath-swearing) | wrong-root + wrong-gloss + collapsed-senses | Fix root to ج-ه-د; fix morph to "Form III imperative + maṣdar"; fix POS to "verb/verbal noun"; expand gloss to context-dependent senses; add 33 missing verse occurrences |
| 2 | `al-mujahidoona` | Root: ل-م-ج (FABRICATED); Gloss: "those who strive/fight" | Root is ج-ه-د; In 4:95 specifically martial-material; slash gloss collapses spiritual and martial senses | wrong-root + collapsed-senses | Fix root to ج-ه-د; split gloss by context: "those who go forth striving with wealth and lives (military expedition)" for 4:95; note same form in 29:69 = spiritual seeking |
| 3 | `qital` | Morph: undetermined pattern (WRONG); POS: noun (WRONG); Gloss: "fighting/combat" | Form III PASSIVE imperfect (yuqātalūna); Verb (passive); Means "are fought against" not active fighting; Defensive permission context at 22:39 | wrong-gloss + collapsed-senses | Fix morph to "Form III passive imperfect"; fix POS to "verb (passive)"; fix gloss to "are fought against (defensive combat permission)"; add 110 missing q-t-l occurrences |
| 4 | `salam` | Gloss: "peace"; 2 occurrences (24:61, 6:127) | س-ل-م has 7 semantic classes; only 6 of 136 occurrences are temporal peace; 62 are submission/Islam; 38 are eschatological; current gloss implies univocal "peace" | collapsed-senses | Add sense disambiguation; tag 24:61 and 6:127 as ESCHATOLOGICAL-GREETING; add all 133 missing s-l-m occurrences with per-sense classification |
| 5 | `urwat-al-wuthqa` | Gloss: "firmest handhold"; 1 occurrence (31:22) | This is FAITH-TRUST sense of و-ث-ق, NOT covenant/treaty; 70.6% of w-th-q occurrences are TREATY-SPECIFIC; index captures only this non-treaty sense | wrong-gloss (by omission) | Retain entry but add all 33 missing w-th-q occurrences including treaty-specific mīthāq (24 occurrences); distinguish faith-trust vs treaty senses |
| 6 | `ihsana` | Gloss: "excellence/kindness/good treatment"; 1 occurrence (4:36) | Correct gloss but UNCLASSIFIED; belongs to MORAL-ETHICAL class; currently may be implicitly associated with husn-concept/aesthetic domain | wrong-gloss (by domain association) | Explicitly classify as MORAL-ETHICAL; ensure NOT mapped to any aesthetic/beauty topic; add ~46 missing h-s-n occurrences |
| 7 | `al-asma-al-husna` | Gloss: "the best names"; 1 occurrence (59:24) | Acceptable gloss; refers to divine attributes, NOT aesthetic beauty; elative feminine of aḥsan meaning "most excellent" | Neutral (acceptable) | Retain; ensure classified under DIVINE-PERFECTION, not aesthetics |
| 8 | `muhsin` / `muhsinin` | Gloss: "doers of good/excellence" / "doers of good"; 3 total occurrences | Correct glosses; both are identical Arabic (ٱلۡمُحۡسِنِينَ); MORAL-ETHICAL class; duplicate entries for same Arabic form | collapsed-senses (duplicate keys) | Merge or cross-reference; classify explicitly as MORAL-ETHICAL; add ~44 missing muḥsinīn occurrences |
| 9 | MISSING: All ز-ي-ن terms | Not in index | 41 verified Quranic occurrences; 63.4% DECEPTION-TEST; 12.2% DIVINE-PERFECTION; 2.4% LEGAL-MODESTY; 0% aesthetic | missing-term | Add minimum: zīnah, zayyana, zuyyina, izzayyanat, tabarruj with all 41 occurrences and per-sense classification |
| 10 | MISSING: All ج-م-ل terms | Not in index (hajr-jamil under wrong root) | 8 verified occurrences; 62.5% MORAL-ETHICAL; 25% LEGAL-MODESTY; 12.5% AESTHETIC-BORDERLINE (16:6 only) | missing-term + wrong-root (compound) | Add jamāl (16:6), jamīl (12:18, 12:83, 15:85, 33:28, 33:49, 70:5, 73:10) under root ج-م-ل; cross-reference hajr-jamil |
| 11 | MISSING: All ع-ه-د terms | Not in index | 46 verified occurrences across 35 verses; GENERAL-COVENANT (30%), TREATY-SPECIFIC (39%), INDIVIDUAL-MORAL (17%), ESCHATOLOGICAL (9%) | missing-term | Add ʿahd, ʿāhada, ʿahida with all 46 occurrences and per-class classification |
| 12 | MISSING: All ص-ل-ح reconciliation terms | Not in index | 22 reconciliation-specific occurrences + 128 righteousness occurrences + 14 reform occurrences | missing-term | Add ṣulḥ, iṣlāḥ, aṣlaḥa, muṣliḥ with minimum 22 reconciliation occurrences; separately classify ṣāliḥ/ṣāliḥāt as RIGHTEOUSNESS |
| 13 | MISSING: silm (2:208) | Not in index | Critical polysemous verse: PEACE-TEMPORAL ∩ SUBMISSION-ISLAM; requires dual mapping | missing-term | Add silm entry with dual-mapping annotation for 2:208; add all 5 other temporal peace verses (4:90, 4:91, 8:61, 47:35, 16:28) |
| 14 | MISSING: lā taʿtadū (2:190) | Not in index | Foundational Quranic restraint principle; QURANIC-EXPLICIT provenance; anchors redefined non-combatant-protection topic | missing-term | Add as restraint/proportionality term under war-peace-conflict domain |

**Total Misalignments:** 14 (3 wrong-root, 4 wrong-gloss, 6 missing-term, 3 collapsed-senses, 1 hadith-as-quranic via topic scope)

*(Note: Some entries exhibit multiple misalignment types simultaneously; counted by primary type above.)*

---

## Section 3: Coverage Gap Assessment

Quantification of terms/occurrences from WS2 analyses missing from the current index.

### 3.1 Coverage by Concept Family

| Concept Family (Root) | WS2 Verified Occurrences | Index Occurrences | Coverage % | Missing Occurrences | Severity |
|----------------------|-------------------------|-------------------|------------|--------------------|---------|
| ج-ه-د (j-h-d) Striving | 35 verses | 4 (22:78, 29:69 via `jihad`; 4:95 via `al-mujahidoona`) | **11.4%** | 31 verses | CRITICAL |
| ق-ت-ل (q-t-l) Fighting | 111 verses | 1 (22:39 via `qital`) | **0.9%** | 110 verses | CRITICAL |
| ح-س-ن (h-s-n) Goodness | 73 verses | 6 (59:24, 4:36, 5:85, 6:84, 77:44, + uswah-hasanah 60:4) | **8.2%** | 67 verses | CRITICAL |
| ز-ي-ن (z-y-n) Adornment | 41 verses | 0 | **0.0%** | 41 verses | CRITICAL |
| ج-م-ل (j-m-l) Grace/Beauty | 8 verses | 0 (hajr-jamil under wrong root) | **0.0%** | 8 verses | HIGH |
| ع-ه-د (ʿ-h-d) Covenant | 46 verses | 0 | **0.0%** | 46 verses | CRITICAL |
| و-ث-ق (w-th-q) Binding | 34 verses | 1 (31:22 via urwat-al-wuthqa) | **2.9%** | 33 verses | CRITICAL |
| س-ل-م (s-l-m) Peace/Submission | 136 verses | 3 (24:61, 6:127 via salam; salim 1 occ.) | **2.2%** | 133 verses | CRITICAL |
| ص-ل-ح (ṣ-l-ḥ) Reconciliation | 168 verses (22 reconciliation-specific) | 0 | **0.0%** | 168 verses (22 critical) | CRITICAL |
| **TOTAL** | **652 verses** | **~15** | **~2.3%** | **~637 verses** | **SYSTEMIC** |

### 3.2 Coverage Summary

- **Overall coverage:** ~2.3% of WS2-analyzed Quranic occurrences are present in the terminology index.
- **Concept families at 0% coverage:** 4 out of 9 (ز-ي-ن, ج-م-ل, ع-ه-د, ص-ل-ح).
- **Concept families below 5% coverage:** 3 additional (ق-ت-ل at 0.9%, س-ل-م at 2.2%, و-ث-ق at 2.9%).
- **Best-covered family:** ج-ه-د at 11.4% — still critically incomplete.
- **Most impactful gap:** ص-ل-ح at 0% coverage blocks creation of the recommended conflict-resolution-reconciliation topic entirely.

### 3.3 Root-Morphology-Index Coverage

The `root-morphology-index.json` (WS1 output) covers 595 of 649 terms with root assignments. However, for the specific roots examined by WS2:

| Root | Terms in Root-Morph-Index | Terms with CORRECT Root | Accuracy |
|------|--------------------------|------------------------|----------|
| ج-ه-د | 2 (jihad, al-mujahidoona) | 0 | **0%** (both assigned wrong roots) |
| ق-ت-ل | 1 (qital) | 1 | 100% (root correct, morph/POS wrong) |
| ح-س-ن | 4 | 4 | 100% |
| ز-ي-ن | 0 | N/A | N/A |
| ج-م-ل | 0 | N/A | N/A |
| ع-ه-د | 0 | N/A | N/A |
| و-ث-ق | 1 (urwat-al-wuthqa under بلع root) | 0 | **0%** (assigned to ب-ل-ع instead of و-ث-ق) |
| س-ل-م | 2 (salam, salim) | 0 | **0%** (not found under س-ل-م in root index) |
| ص-ل-ح | 0 | N/A | N/A |

**Root assignment accuracy for WS2 target roots: 1/9 = 11%** (only ق-ت-ل has correct root; even that has wrong morph pattern).

---

## Section 4: Provenance Integrity Check

### 4.1 Hadith-Derived Concepts in Current System

| Concept | Where Found | Actual Provenance | Issue |
|---------|-----------|-------------------|-------|
| "Allah is beautiful, loves beauty" | MFD-11.3 WS-B §1.1 identifies this as embedded in `husn-concept` topic scope | **HADITH** (Sahih Muslim 91a) | Not flagged as hadith-derived in any index field; no provenance metadata exists |
| Non-combatant categories (women, children, monks, trees, orchards) | Referenced in MFD-11.3 WS-A §1.6 as part of current non-combatant-protection topic | **HADITH-DERIVED** (various collections) | None of these terms appear in the terminology index; the topic relies entirely on extra-Quranic sources |
| Art permissibility (image-making, music) | MFD-11.3 WS-B §5 identifies these as fiqh/hadith debates | **FIQH/HADITH-DERIVED** | Not in terminology index; art-boundaries topic mappings are all misclassified Quranic verses about unrelated subjects |

### 4.2 Provenance Mechanism Assessment

The current `arabic-terminology-index.json` schema has **NO provenance field**. Every term carries:
- `term` (Arabic)
- `transliteration`
- `gloss` (with uniform "(editorial gloss)" suffix)
- `occurrenceCount`
- `occurrences` (verse references)
- `surahCount`
- `surahs`

There is no field for:
- `provenance` (quranic-explicit / hadith-derived / tafsir-derived / editorial)
- `semanticClass` (moral-ethical / deception-test / divine-perfection / etc.)
- `domainMapping` (which taxonomy topic/dimension the term belongs to)
- `morphPattern` (Form I-XV, noun pattern, etc.)
- `rootConfidence` (high/medium/low)

**Finding:** Provenance integrity cannot be assessed at the index level because the mechanism does not exist. It can only be assessed at the topic-scope level, where MFD-11.3 WS-B confirmed at least one hadith-derived statement embedded without attribution.

---

## Section 5: Recommendations Summary

Prioritized list of corrections needed before the terminology index can reliably support taxonomy restructuring.

### Priority 1: CRITICAL — Must Complete Before Taxonomy Restructuring

| # | Correction | Impact | Effort |
|---|-----------|--------|--------|
| P1.1 | Fix root assignments for `jihad` (و-ج-ه → ج-ه-د) and `al-mujahidoona` (ل-م-ج → ج-ه-د) | Without correct roots, these terms cannot cluster with their lexical family; any root-based taxonomy will misplace them | Low (2 field edits) |
| P1.2 | Fix morph pattern and POS for `jihad`, `al-mujahidoona`, `qital` | Current values are factually wrong; downstream morphological analysis will propagate errors | Low (6 field edits) |
| P1.3 | Add all missing ع-ه-د terms (46 occurrences) | Blocks R5 (ʿahd/mīthāq distinction); blocks covenant domain restructuring | Medium (~46 new entries) |
| P1.4 | Add all missing ص-ل-ح reconciliation terms (minimum 22 occurrences) | Blocks R3 (sulh-reconciliation topic creation); blocks conflict-resolution domain | Medium (~22 new entries) |
| P1.5 | Add all missing س-ل-م terms (133 occurrences) with sense disambiguation | Blocks R6 (salām/silm polysemy handling); current 2.2% coverage presents fundamentally misleading picture | High (~133 new entries + sense tagging) |
| P1.6 | Add 25:52 (jāhidhum bihi jihādan kabīran) to index | This is THE definitional verse for Quranic jihād; its absence invalidates any jihad-striving topic | Low (1 new entry) |

### Priority 2: HIGH — Should Complete Before Topic Scope Definition

| # | Correction | Impact | Effort |
|---|-----------|--------|--------|
| P2.1 | Add all missing ز-ي-ن terms (41 occurrences) with DECEPTION-TEST as primary classification | Blocks R2 (arts-beauty dissolution redistribution); prevents accidental aesthetic categorization | Medium (~41 new entries) |
| P2.2 | Add all missing ج-م-ل terms (8 occurrences) under correct root | Blocks accurate assessment of aesthetic borderline; current 0% coverage hides that only 1/8 is aesthetic | Low (~8 new entries) |
| P2.3 | Add all missing ح-س-ن terms (67 occurrences) with MORAL-ETHICAL classification | Prevents residual aesthetic bias in husn-concept; 8.2% coverage skews toward divine-perfection subset | Medium (~67 new entries) |
| P2.4 | Add all missing ق-ت-ل terms (110 occurrences) with sense classification | 0.9% coverage means qital-fighting-theology topic would be built on single verse; needs full C1-C4 sense distribution | High (~110 new entries) |
| P2.5 | Add provenance field to index schema | Blocks R7 (provenance distinction); without this, hadith-derived content will continue to leak into Quranic topics | Medium (schema change + retroactive tagging for affected terms) |

### Priority 3: MEDIUM — Should Complete Before Final Taxonomy Publication

| # | Correction | Impact | Effort |
|---|-----------|--------|--------|
| P3.1 | Add semantic class field to index schema | Enables automated domain mapping; currently requires manual classification per term | Medium (schema change) |
| P3.2 | Resolve duplicate entries (`muhsin` / `muhsinin` same Arabic) | Data quality; prevents double-counting | Low (merge/cross-reference) |
| P3.3 | Cross-reference `hajr-jamil` to ج-م-ل root | Compound term currently only linked to ه-ج-ر; loses jamīl semantic connection | Low (add cross-reference field) |
| P3.4 | Add lā taʿtadū (2:190) and other Quranic restraint terms | Anchors redefined non-combatant-protection topic in Quranic text rather than hadith | Low (~5 new entries) |
| P3.5 | Implement dual-mapping mechanism for polysemous verses (2:208) | Single-topic assignment cannot handle genuine polysemy; forces false choice | Medium (schema/tooling change) |

### Priority 4: LOW — Desirable But Not Blocking

| # | Correction | Impact | Effort |
|---|-----------|--------|--------|
| P4.1 | Expand gloss for `al-asma-al-husna` to note divine-attribute context | Minor precision improvement | Low |
| P4.2 | Standardize transliteration conventions across all entries | Data consistency | Medium |
| P4.3 | Add morphological pattern field to all entries | Enables systematic Form I-XV analysis | High (retroactive for 649 terms) |

---

## Section 6: Quantitative Summary for Parent Agent

| Metric | Value |
|--------|-------|
| **Alignment: Supports** | 0 |
| **Alignment: Partially Supports** | 2 |
| **Alignment: Contradicts** | 4 |
| **Alignment: Neutral** | 1 |
| **Total Misalignments** | 14 |
| **Wrong-root errors** | 3 (jihad, al-mujahidoona, urwat-al-wuthqa) |
| **Wrong-gloss errors** | 4 (jihad, qital, salam, ihsana-domain) |
| **Missing-term gaps** | 6 (all z-y-n, all j-m-l, all ʿ-h-d, all ṣ-l-ḥ reconciliation, silm/2:208, lā taʿtadū) |
| **Collapsed-senses errors** | 3 (al-mujahidoona, qital, muhsin/muhsinin duplicate) |
| **Hadith-as-Quranic** | 1 (husn-concept topic scope) |
| **Overall Coverage Gap** | ~97.7% (637 of 652 WS2-analyzed occurrences missing) |
| **Concept Families at 0% Coverage** | 4 of 9 (ز-ي-ن, ج-م-ل, ع-ه-د, ص-ل-ح) |
| **Root Assignment Accuracy (WS2 targets)** | 11% (1 of 9 roots correctly assigned) |
| **Top 5 Priority Corrections** | P1.1 (fix jihad/mujahidoona roots), P1.3 (add ʿahd terms), P1.4 (add ṣulḥ terms), P1.5 (add s-l-m terms), P1.6 (add 25:52) |

---

## Appendix A: Methodology Notes

1. **Index audit scope:** All 649 unique terms in `arabic-terminology-index.json` were searched for matches against the 9 root families analyzed by WS2 (j-h-d, q-t-l, h-s-n, z-y-n, j-m-l, ʿ-h-d, w-th-q, s-l-m, ṣ-l-ḥ).

2. **Occurrence verification:** WS2 verified occurrence counts come from exhaustive corpus scans using quran-json@3.1.2 as documented in each WS2 report. These are treated as authoritative.

3. **Alignment assessment criteria:**
   - **Supports:** Index data enables the recommendation without modification.
   - **Partially Supports:** Index data is directionally consistent but insufficient or partially erroneous.
   - **Contradicts:** Index data actively obstructs the recommendation (wrong classifications, missing critical terms, or structural incompatibility).
   - **Neutral:** Index data is irrelevant to the recommendation (neither helps nor hinders).

4. **Misalignment type definitions:**
   - **wrong-root:** Term assigned to incorrect triliteral/quadriliteral root.
   - **wrong-gloss:** Gloss is factually incorrect, misleadingly vague, or implies wrong semantic domain.
   - **missing-term:** Term exists in Quranic corpus (verified by WS2) but absent from index.
   - **collapsed-senses:** Multiple distinct semantic senses merged into single ambiguous gloss.
   - **hadith-as-quranic:** Hadith-derived concept presented without provenance distinction in a Quranic topic scope.

5. **No production files modified.** This report is research-only per MFD-11.4 scope constraints.

---

*Report generated by MFD-11.4 Workstream 3 (agent-88). RESEARCH ONLY — no production files modified.*
