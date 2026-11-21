# Extraction Methodology Comparison: Original vs Proposed

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS5 (Coverage & Extraction Reproducibility) |
| Date | 2026-11-21 |
| Status | research-deliverable |

---

## 1. Original Methodology (Phase C)

### Script
`scripts/mfd11-phasec-arabic-terms.mjs`

### Process
```
research/mfd-11/candidates/*.json
  → Iterate candidates[].evidence[].excerpt
  → Whitespace-split excerpt string
  → Filter tokens matching /[\u0600-\u06FF]/ (Arabic Unicode range)
  → Trim and discard tokens < 2 characters
  → Aggregate into Map<token, {occurrences, count}>
  → Sort by frequency descending
  → Write arabic-terminology-index.json
```

### Output Structure
```json
{
  "term": "عَبَسَ",
  "count": 1,
  "uniqueAyahs": 1,
  "sampleOccurrences": [{"candidateId": "...", "ayahKey": "80:1"}]
}
```

### Critical Flaws

#### Flaw 1: Whitespace Splitting Produces Fragments
The script splits `ev.excerpt` on whitespace (`/\s+/`). This produces:
- **Prefix fragments**: "وَٱلْمُجَـٰهِدُونَ" split from surrounding text retains attached conjunctions/articles
- **Suffix fragments**: Tokens with trailing punctuation or waqf marks
- **Multi-word phrases treated as separate tokens**: "ٱلۡمَنفُوشِ" is one token, but "عِيشَةٖ رَّضِيَّةٞ" becomes two unrelated entries

#### Flaw 2: No Root or Lemma Normalization
Each surface form is treated as a unique term:
- جَٰهَدَ، يُجَـٰهِدُ، جَـٰهَدُوا۟ → three separate entries instead of one lemma under root جهد
- No morphological analysis linking inflected forms to dictionary citation forms
- No root assignment enabling semantic grouping

#### Flaw 3: Source is Candidate Evidence, Not Corpus
The script reads from `research/mfd-11/candidates/*.json`, which contains AI-generated evidence excerpts from Pass A extraction. These excerpts:
- Are selective quotations, not exhaustive corpus scans
- May contain transcription errors or incomplete phrases
- Cover only passages that were selected for thematic extraction (473 of 6,236 āyāt)
- Do not represent systematic coverage of any root's occurrences

#### Flaw 4: No Corpus Verification
Extracted tokens are never verified against the pinned `quran-json@3.1.2` corpus:
- No word-position validation
- No diacritic normalization
- No confirmation that the token actually exists in the cited ayah
- Occurrence counts reflect excerpt mentions, not corpus reality

#### Flaw 5: No Inclusion/Exclusion Criteria
The script extracts ALL Arabic tokens meeting minimal length requirements:
- Grammatical particles included indiscriminately
- Proper nouns mixed with conceptual terms
- Hapax legomena weighted equally with core theological vocabulary
- No thematic relevance filtering

### Result
- **649 unique terms / 723 total occurrences**
- Coverage of priority roots ranges from 4% to 24%
- Many entries are fragments or non-normalized surface forms
- Occurrence counts are unreliable (based on excerpt mentions, not corpus)

---

## 2. Proposed Methodology (MFD-11.5)

### Source
`data/root-occurrences/*.json` (1,576 files)

These files contain:
- Validated lemma-to-verse mappings
- Word positions within each ayah
- Exact matched tokens from pinned corpus
- Auto-accepted via Sprint 48 deterministic morphology review

### Process
```
data/root-occurrences/{root}.json
  → Read entry.includedLemmas[]
  → For each occurrence in occurrences[]:
      - Verify matchedToken exists in quran-json@3.1.2 at ref.surah:ref.ayah:wordPosition
      - Record matchedLemma, matchedRoot, wordPosition
  → Aggregate by lemma:
      - Count total occurrences
      - List distinct āyāt
      - Collect all matchedTokens (surface forms)
  → Apply inclusion criteria (see terminology-index-scope.md)
  → For included lemmas:
      - Assign morphological form (verb form / noun pattern)
      - Generate ISO 233-2 transliteration
      - Compose four-layer gloss
      - Cross-reference to Pass A extractions
  → Write terminology index
```

### Output Structure
```json
{
  "root": "ج-ه-د",
  "lemma": "جَٰهَدَ",
  "form": "Form III",
  "pattern": "fāʿala",
  "pos": "verb",
  "morphConfidence": "high",
  "transliteration": "jāhada",
  "searchAliases": ["jahada", "jaahada"],
  "gloss": {
    "lexical": "striving, exertion",
    "contextualSenses": [
      {"sense": "spiritual striving", "verses": ["29:69", "25:52"]},
      {"sense": "armed struggle", "verses": ["9:41", "9:44"]}
    ],
    "tafsirNote": "Classical exegetes distinguish greater/lesser jihad",
    "editorialGloss": "Comprehensive striving in Allah's cause"
  },
  "occurrences": {
    "total": 22,
    "distinctAyahs": 18,
    "tokens": ["جَـٰهَدَ", "يُجَـٰهِدُ", "جَـٰهَدُوا۟", ...]
  },
  "provenance": {
    "rootSource": "data/root-occurrences/جهد.json",
    "corpusVersion": "quran-json@3.1.2",
    "morphologyReview": "Sprint 48 auto-accepted",
    "passACrossRef": ["extraction-xxx.json"]
  }
}
```

### Advantages Over Original

| Aspect | Original | Proposed |
|--------|----------|----------|
| Source | Candidate evidence excerpts | Verified corpus occurrences |
| Tokenization | Whitespace split | Pre-tokenized with word positions |
| Normalization | None | Lemma-based with root assignment |
| Verification | None | Exact match against pinned corpus |
| Morphology | Surface forms only | Form/pattern/POS analysis |
| Gloss | Single editorial gloss | Four-layer structured gloss |
| Coverage | ~7% of corpus occurrences | 100% of included terms' occurrences |
| Reproducibility | Depends on candidate generation | Deterministic from versioned inputs |

---

## 3. Why Original Produced Low Coverage

### Quantitative Explanation

The original script processed candidate evidence excerpts from 473 passage extractions. These excerpts cover a subset of the Qur'an's 6,236 āyāt. Even within covered passages:

1. **Excerpt selection bias**: Only passages deemed thematically relevant were extracted. Roots like سلم (136 occurrences across ~90 āyāt) may appear in only a handful of excerpts.

2. **Whitespace fragmentation**: A single lemma appearing in multiple inflected forms generates multiple index entries, each with artificially low counts. The true occurrence count for جَٰهَدَ (22 occurrences) is split across surface-form entries.

3. **No corpus-wide scan**: The script never reads `data/root-occurrences/`. It cannot discover occurrences outside the candidate evidence set. Root جهد has 41 verified occurrences; the original index likely captured only those mentioned in excerpts.

4. **Denominator mismatch**: Coverage was calculated as (indexed occurrences / total corpus occurrences). Since the numerator came from excerpts and the denominator from corpus, the ratio was inherently deflated.

### Example: Root جهد

| Metric | Original Index | Authoritative Source |
|--------|---------------|---------------------|
| Total occurrences | Unknown (fragmented across surface forms) | 41 |
| Distinct āyāt | Unknown | 36 |
| Lemmas represented | Surface forms only | 5 verified lemmas |
| Corpus verification | None | All 41 verified against quran-json@3.1.2 |

### Example: Root سلم

| Metric | Original Index | Authoritative Source |
|--------|---------------|---------------------|
| Total occurrences | Likely <20 (excerpt-dependent) | 136 |
| Distinct āyāt | Likely <15 | ~90 |
| Lemmas represented | Fragmented surface forms | 16 verified lemmas |

---

## 4. Migration Strategy

### Phase 1: Build New Index from Root Occurrences
- Run proposed extraction against all 1,576 root files
- Apply inclusion criteria to filter to curated thematic lexicon
- Generate entries with full morphological and gloss structure

### Phase 2: Cross-Reference Legacy Entries
- Map legacy 649 terms to new index entries where possible
- Flag legacy entries that cannot be verified against corpus
- Preserve legacy glosses as input to four-layer gloss authoring

### Phase 3: Deprecate Legacy Index
- Archive `arabic-terminology-index.json` as historical artifact
- Update all downstream consumers to use new index
- Document migration in changelog

---

## 5. Reproducibility Guarantees

The proposed methodology is reproducible if:
1. `data/root-occurrences/*.json` files are version-controlled
2. `quran-json@3.1.2` remains pinned
3. Extraction script is deterministic (no randomness, no external API calls)
4. Inclusion criteria are codified (not subjective per-run decisions)
5. Transliteration follows ISO 233-2 deterministically

Another researcher with the same inputs should produce byte-identical output.

---

*This methodology comparison is a research deliverable of MFD-11.5 WS5. No production changes have been made.*
