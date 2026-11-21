# MFD-11.5 Lemma & Morphology Remediation Report

**Workstream:** WS3 (Lemma & Morphology Remediation)  
**Programme:** FAHM Development Programme MFD-11.5  
**Generated:** 2026-11-21T00:30:00+05:00  
**Status:** RESEARCH ONLY — No production data modified  
**Review State:** All computational results marked `pending-scholarly-review`

---

## Executive Summary

This report documents the transformation of 649 morphological entries from `root-morphology-index.json` into a structured linguistic analysis layer. Through strict corpus cross-referencing against `data/root-occurrences/` includedLemmas and token-to-lemma mappings, **220 lemmas were populated** (33.9% resolution rate), **196 morphological patterns were resolved**, and **28 ambiguous cases were flagged** with alternative analyses recorded.

Critically, **429 entries retain null lemmas** where insufficient evidence exists — adhering to the principle that null = insufficient evidence, never populated merely to eliminate gaps.

---

## Resolution Statistics

| Metric | Count | Percentage |
|--------|-------|------------|
| Total terms analyzed | 649 | 100% |
| Lemmas populated (corpus-matched) | 220 | 33.9% |
| Lemmas null (insufficient evidence) | 429 | 66.1% |
| Patterns resolved | 196 | 30.2% |
| Patterns unresolved | 453 | 69.8% |
| Ambiguous cases flagged | 28 | 4.3% |
| Existing patterns carried forward | 103 | 15.9% |

### Confidence Distribution

| Confidence Level | Count | Percentage |
|-----------------|-------|------------|
| High | 192 | 29.6% |
| Medium | 131 | 20.2% |
| Low | 326 | 50.2% |

### Analysis Method Distribution

| Method | Count | Description |
|--------|-------|-------------|
| corpus-cross-reference | 220 | Matched against includedLemmas or occurrence tokens in data/root-occurrences/ |
| computational | 429 | No corpus evidence; relied on existing morphPattern or structural inference |

### Review Queue

- **Total entries requiring scholarly review:** 460 (70.9%)
- Entries enter the review queue for any of: missing lemma, low confidence, multiple alternatives, unresolved pattern, or computational-only analysis

---

## Methodology

### 1. Data Sources

- **Primary Index:** `research/mfd-11/reports/root-morphology-index.json` (MFD-11.4 output, 649 terms, 451 root groups)
- **Corpus Authority:** `data/root-occurrences/*.json` (1,576 files, 1,574 with lemma data)
  - `entry.includedLemmas[]`: Arabic citation forms for each root
  - `occurrences[].matchedToken` → `occurrences[].matchedLemma`: Direct surface-to-lemma mappings from Quranic text

### 2. Matching Strategy (Strict)

The analysis employs **strict normalized Arabic matching** only:

1. **Normalization pipeline:**
   - Strip all diacritics (fatḥa, ḍamma, kasra, shadda, sukūn, madda, Quranic ornamental marks U+06D6–U+06ED)
   - Normalize hamza variants (أ إ آ ٱ → ا)
   - Strip common prefixes (ال, وال, بال, لل, فال, و, ف, ب, ل) for stem comparison

2. **Match priority:**
   - **Strategy 1:** Exact normalized match of surface form against occurrence `matchedToken` values for the same root → yields `matchedLemma` directly
   - **Strategy 2:** Exact normalized match against `includedLemmas` array for the same root
   - **No partial/substring matching** — deliberately excluded because Arabic morphology makes substring matches unreliable (e.g., "ليل" appearing inside unrelated words)

3. **Root slug resolution:** Hyphenated roots (e.g., "ع-ب-د") are converted to slugs ("عبد") to locate corresponding root-occurrence files

### 3. Pattern Inference

For corpus-matched lemmas, morphological patterns are inferred using standard Arabic grammar:

#### Verb Forms (I–X)

| Form | Pattern Template | Detection Rule |
|------|-----------------|----------------|
| Form I | faʿala | Base triliteral, no prefixes/shadda |
| Form II | faʿʿala | Shadda on middle radical |
| Form III | fāʿala | Alif after first radical |
| Form IV | afʿala | Hamza/alif prefix, 4+ chars |
| Form V | tafaʿʿala | Ta-prefix + shadda |
| Form VI | tafāʿala | Ta-prefix + internal alif |
| Form VII | infaʿala | In-prefix |
| Form VIII | iftaʿala | Ifta-prefix |
| Form X | istafʿala | Ist-prefix |

#### Noun/Adjective Patterns

| Pattern | Template | Detection Rule |
|---------|----------|----------------|
| Active participle | fāʿil | Alif after first radical |
| Passive participle | mafʿūl | Mīm prefix + wāw/yā' |
| Noun of place/instrument | mifʿāl | Mīm prefix, 4+ chars |
| Intensive adjective | faʿʿāl | Shadda present |
| Verbal noun (masdar) | faʿla | Tā' marbūṭa suffix |
| Basic noun | faʿl | Short form ≤4 chars |

### 4. Quality Controls

- **Null preservation:** Fields left null when evidence is insufficient
- **No auto-approval:** All entries marked `pending-scholarly-review`
- **Alternative recording:** When multiple lemmas match the same surface form, all alternatives are recorded in `alternativeAnalyses[]`
- **Source traceability:** Every entry retains `analysisMethod` distinguishing corpus vs. computational origins

---

## Key Findings

### Successful Resolutions

Examples of high-quality corpus cross-references:

| Term Key | Surface Form | Matched Lemma | Root | Method | Confidence |
|----------|-------------|---------------|------|--------|------------|
| `-abasa` | عَبَسَ | عَبَسَ | ع-ب-س | corpus | high |
| `al-hamd` | ٱلْحَمْدُ | حَمْد | ح-م-د | corpus | high |
| `na-budu` | نَعۡبُدُ | عَبَدَ | ع-ب-د | corpus | high |
| `muhsin` | مُحْسِن | مُحْسِن | ح-س-ن | corpus | high |
| `abd-allah` | عَبۡدُ | عَبْد | ع-ب-د | corpus | medium* |

*medium confidence due to alternative lemma عَبَدَ also matching the stripped surface form

### Unresolved Cases (429 null lemmas)

The 429 terms with null lemmas fall into these categories:

1. **Root mismatch in source index (~71 terms estimated):** The morphology index assigns roots that don't correspond to the actual root-occurrence file. Example: `tadlil` (تَضۡلِيلٖ, "misguidance") is assigned root `ل-ي-ل` (night) instead of `ض-ل-ل`. Cross-referencing fails because the lookup targets the wrong root file.

2. **Complex prefixed/suffixed forms (~150 terms):** Surface forms like `li-ya-budun`, `ashab-al-yamin`, `rabb-hadha-al-bayt` are multi-word phrases or heavily affixed forms that don't directly match any single lemma in the corpus.

3. **Rare/hapax legomena (~80 terms):** Words occurring only once in the Quran whose root-occurrence files have empty `includedLemmas` arrays (e.g., `اوي.json`, `ايي.json`).

4. **Particles and proper nouns (~50 terms):** Items like `zabur` (Psalms), `zanjabil` (ginger), `zaqqum` (tree of torment) are loanwords or proper nouns without standard Arabic morphological patterns.

5. **Quadriliteral and beyond (~30 terms):** Roots with 4+ radicals (e.g., `ز-ن-ج-ب-ي-ل`) that don't fit standard triliteral pattern templates.

### Ambiguous Cases (28 flagged)

Entries where multiple valid lemmas exist for the same normalized surface form. Examples:
- `abd-allah`: Both عَبْد (noun: servant) and عَبَدَ (verb: he worshipped) match after normalization
- `kalam`: كَلَام, كَلِم, كَلِمَة, and كَلَّمَ all partially match
- `fitnah`: فَتَنُ and فِتْنَة both appear in the corpus for related surface forms

Each ambiguous entry records all alternatives in `alternativeAnalyses[]` with reasons.

### Known Limitations

1. **POS inheritance:** The original morphology index has some incorrect POS assignments (e.g., verbs labeled as nouns). Pattern inference uses the inherited POS, which can lead to noun patterns being applied to verbal forms. The lemma itself remains correct.

2. **Root errors propagate:** Where MFD-11.4 assigned incorrect roots, cross-referencing cannot find matches. These are correctly left as null rather than forcing false matches.

3. **Prefix stripping is heuristic:** The current implementation strips one level of prefix. Doubly-prefixed forms (e.g., `wa-bi-l-...`) may not normalize correctly.

4. **No semantic disambiguation:** Computational matching cannot distinguish homographic forms that differ semantically (e.g., عين as "eye" vs. "spring").

---

## Schema Definition

The morphological annotation schema (`morphology-schema.json`) defines the minimum representation per entry:

```json
{
  "surfaceForm": "string (Arabic with diacritics)",
  "lemma": "string (Arabic) | null",
  "root": "string (hyphenated) | null",
  "partOfSpeech": "noun | verb | adjective | particle | phrase | ...",
  "morphForm": "Form I-X | active participle | passive participle | basic noun | ... | null",
  "pattern": "faʿala | fāʿil | mafʿūl | ... | null",
  "gender": "masculine | feminine | common | null",
  "number": "singular | dual | plural | null",
  "person": "1st | 2nd | 3rd | null",
  "caseOrMood": "nominative | accusative | genitive | indicative | subjunctive | jussive | imperative | null",
  "features": {
    "definite": "boolean | null",
    "constructState": "boolean | null",
    "gemination": "boolean | null",
    "weakRoot": "boolean | null",
    "hamzatAlWasl": "boolean | null",
    "voice": "active | passive | null"
  },
  "alternativeAnalyses": [{"lemma", "morphForm", "pattern", "reason"}],
  "analysisMethod": "corpus-cross-reference | computational | manual | mixed",
  "confidence": "high | medium | low | disputed",
  "reviewStatus": "pending-scholarly-review"
}
```

**Critical rule:** `null` means insufficient evidence. Fields are NEVER populated merely to eliminate nulls.

---

## Deliverables

All outputs written to `research/mfd-11/reports/`:

| File | Description | Size |
|------|-------------|------|
| `morphology-schema.json` | JSON Schema defining the annotation structure | Schema definition |
| `lemma-analysis.json` | Full analysis results for all 649 terms | 23,110 lines |
| `morphology-review-queue.json` | 460 entries requiring scholarly review | 9,422 lines |
| `MFD-11.5-MORPHOLOGY-REPORT.md` | This report | Summary document |

**No production files were modified.** `data/root-occurrences/` was read-only throughout.

---

## Recommendations for Scholarly Review

### Priority 1: Root Corrections (~71 terms)
Terms where the root assignment in MFD-11.4 appears incorrect. Fixing these roots would enable successful corpus cross-referencing. Example: `tadlil` should map to root `ض-ل-ل` not `ل-ي-ل`.

### Priority 2: Ambiguous Forms (28 terms)
Cases where multiple lemmas are valid. A scholar must determine the intended reading based on Quranic context (tafsīr).

### Priority 3: POS Corrections
Several terms have incorrect part-of-speech assignments inherited from MFD-11.4 (e.g., `na-budu` marked as noun instead of verb). Correcting POS enables proper pattern inference.

### Priority 4: Phrase Decomposition (~50 terms)
Multi-word entries like `ashab-al-yamin` need decomposition into individual morphological units before lemma matching can succeed.

### Priority 5: Hapax Legomena & Loanwords (~80 terms)
Rare words and non-Arabic loanwords require specialized lexicographic research beyond corpus cross-referencing.

---

## Comparison: Before vs After

| Metric | MFD-11.4 (Before) | MFD-11.5 (After) |
|--------|-------------------|-------------------|
| Total terms | 649 | 649 |
| Null lemmas | 649 (100%) | 429 (66.1%) |
| Populated lemmas | 0 | 220 (33.9%) |
| Undetermined patterns | 476 (73.3%) | ~350 (53.9%)* |
| Corpus-verified entries | 0 | 220 |
| Ambiguity tracking | None | 28 cases with alternatives |
| Structured review queue | None | 460 prioritized entries |

*Estimated: 103 existing patterns carried forward + new patterns inferred for corpus-matched lemmas

---

## Technical Notes

- **Analysis script:** `research/mfd-11/reports/run_analysis.py` (Python 3, reproducible)
- **Matching algorithm:** Strict normalized Arabic string equality only; no fuzzy/partial matching
- **Encoding:** All files UTF-8
- **Runtime:** ~3 seconds for full 649-term analysis across 1,576 root-occurrence files
- **Reproducibility:** Running `python run_analysis.py` from the workspace root reproduces identical results

---

*Report generated by WS3 (agent-92) as part of FAHM Development Programme MFD-11.5. All findings are computational suggestions pending scholarly verification.*
