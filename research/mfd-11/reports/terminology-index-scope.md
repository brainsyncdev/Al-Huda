# Terminology Index Scope Definition

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS5 (Coverage & Extraction Reproducibility) |
| Date | 2026-11-21 |
| Status | research-deliverable |
| Supersedes | Implicit scope of mfd11-phasec-arabic-terms.mjs |

---

## 1. Scope Statement

The FAHM Arabic Terminology Index is a **curated thematic lexicon**, not an exhaustive Qur'anic vocabulary list.

It covers terms that carry theological, legal, ethical, or narrative significance within the FAHM thematic framework, as identified through:
1. MFD-11 Pass A concept extraction (473 passage records)
2. Root-based morphological analysis against the pinned corpus (`quran-json@3.1.2`)
3. Scholarly review of thematic relevance

### What This Index IS
- A structured reference of Qur'anic terms organized by root and lemma
- Each entry includes verified corpus occurrences, morphological form, transliteration (ISO 233-2), and four-layer gloss
- Cross-referenced to FAHM thematic taxonomy and passage extractions
- Reproducible from `data/root-occurrences/` using documented extraction parameters

### What This Index IS NOT
- Not a complete Qur'anic concordance (~77,000+ tokens)
- Not a dictionary of all Arabic words appearing in the Qur'an
- Not a replacement for classical lexicons (Hans Wehr, Lane's Lexicon)
- Not a frequency list ordered purely by occurrence count

---

## 2. Inclusion Criteria

A term qualifies for inclusion if it meets **at least one** of the following conditions:

### Criterion A: Thematic Concept
The term represents a concept identified in MFD-11 Pass A extraction as a distinct Qur'anic subject matter.
- Examples: تَوْحِيد (tawḥīd), صَبْر (ṣabr), جِهَاد (jihād), مِيثَاق (mīthāq)
- Source: `research/mfd-11/extractions/*.json` terminology arrays

### Criterion B: Morphological Significance
The term is a key morphological form of a root that carries significant theological, legal, ethical, or narrative weight across multiple surahs.
- Minimum threshold: appears in ≥3 distinct āyāt OR has ≥5 total occurrences
- Source: `data/root-occurrences/*.json` occurrence counts

### Criterion C: Explicit Extraction
The term was explicitly extracted as a `terminology` entry in any of the 473 passage extraction records.
- Source: `research/mfd-11/extractions/*.json`

### Priority Ordering
When resources limit comprehensive coverage:
1. **Priority 1**: Terms meeting Criterion A AND B (thematically significant + morphologically attested)
2. **Priority 2**: Terms meeting Criterion A only (thematic but low corpus frequency)
3. **Priority 3**: Terms meeting Criterion B only (frequent but not yet thematically tagged)
4. **Priority 4**: Terms meeting Criterion C only (extracted in context but not yet validated)

---

## 3. Exclusion Criteria

### Automatic Exclusions
1. **Grammatical particles and prepositions** unless they carry specific theological meaning
   - Excluded: إِنَّ، لَيْسَ، مِنْ، إِلَى، عَلَى (when purely grammatical)
   - Included: لَوْلَا (when exegetically significant), إِلَّا (in theological contexts)

2. **Proper nouns already covered by dedicated categories**
   - Prophet names → handled by prophet-extraction category
   - Place names → handled by geography-extraction category
   - Exception: proper nouns functioning as conceptual terms (e.g., بَدْر as battle archetype)

3. **Hapax legomena with no broader conceptual significance**
   - Single-occurrence terms whose meaning is entirely context-bound
   - Exception: hapax legomena with significant exegetical discussion

### Conditional Exclusions
4. **Terms with disputed root assignment** are included but flagged with `rootDisputed: true` and `alternativeRoots` array
5. **Terms with uncertain morphology** are included with `morphConfidence: "low"` or `"disputed"`

---

## 4. Denominator Definitions

### 4a. Lexical Coverage Denominator
**Definition**: Total corpus occurrences of all terms meeting inclusion criteria.

**Calculation**: Sum of `totalOccurrences` from `data/root-occurrences/{root}.json` for all roots whose lemmas meet at least one inclusion criterion.

**Current estimate**: Based on 1,576 root files in `data/root-occurrences/`, estimated 800–1,200 unique lemmas qualify. Exact count requires running proposed extraction methodology.

### 4b. Thematic Coverage Denominator
**Definition**: Total distinct concepts extracted in MFD-11 Pass A.

**Calculation**: Count of unique `terminology` entries across all 473 extraction records in `research/mfd-11/extractions/`.

**Current value**: 649 unique terms in current index (but this reflects extraction artifacts, not true thematic denominator). True denominator requires re-extraction using proposed methodology.

### 4c. Root Coverage Denominator
**Definition**: Total roots catalogued in `data/root-discovery-registry.json`.

**Current value**: 1,642 roots registered, 1,576 with occurrence files.

---

## 5. Unit of Analysis

| Metric | Definition | Example |
|--------|-----------|----------|
| Lemma occurrence | Each appearance of a specific morphological form | جَٰهَدَ appears 22 times = 22 occurrences |
| Root occurrence | Sum of all lemma occurrences under that root | جهد = 41 total occurrences |
| Distinct āyah | Unique surah:ayah pair containing any form of root | جهد appears in 36 distinct āyāt |
| Unique lemma | Dictionary citation form under a root | جهد has 5 unique lemmas |

Repeated forms within a single ayah each count separately (e.g., if سَلَـٰمٌ appears twice in one verse, that is 2 occurrences, 1 distinct ayah).

---

## 6. Version Dependencies

| Dependency | Version | Purpose |
|-----------|---------|----------|
| quran-json | 3.1.2 (pinned) | Authoritative Arabic text |
| root-occurrences snapshot | 2026-11-10 (Sprint 48) | Lemma-to-verse mappings |
| ISO 233-2 | 1993 edition | Transliteration standard |
| Hans Wehr | 4th edition | Morphological reference |
| Lane's Lexicon | 1863–1893 | Semantic reference |
| MFD-11 Pass A extractions | 473 files | Thematic concept source |

---

## 7. Relationship to Legacy Index

The current `arabic-terminology-index.json` (649 terms / 723 occurrences) was produced by whitespace-splitting candidate evidence excerpts. It is **superseded, not patched**.

The new index will:
- Use `data/root-occurrences/` as authoritative source
- Include verified corpus occurrences for every term
- Apply consistent morphological analysis
- Provide four-layer glosses per specification
- Be reproducible from versioned inputs

Legacy entries may be migrated if they meet inclusion criteria and can be verified against the corpus.

---

*This scope definition is a research deliverable of MFD-11.5 WS5. No production changes have been made.*
