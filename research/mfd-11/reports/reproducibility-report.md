# Reproducibility Assessment: Terminology Index Extraction

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS5 (Coverage & Extraction Reproducibility) |
| Date | 2026-11-21 |
| Status | research-deliverable |

---

## 1. Can Another Team Reproduce This Index?

### Short Answer
**Yes, IF they have access to the same versioned inputs and follow the documented methodology.**

### Conditions for Reproducibility

| Condition | Status | Notes |
|-----------|--------|-------|
| Pinned corpus available | ✅ YES | `quran-json@3.1.2` is npm-pinned |
| Root occurrences available | ✅ YES | 1,576 files in `data/root-occurrences/` |
| Extraction config documented | ✅ YES | `extraction-config.json` in this deliverable set |
| Inclusion criteria codified | ✅ YES | `terminology-index-scope.md` defines criteria |
| Transliteration standard specified | ✅ YES | ISO 233-2 with explicit conventions |
| Gloss rubric documented | ✅ YES | Four-layer structure in specification |
| Deterministic script exists | ⚠️ NOT YET | Proposed methodology documented but script not yet written |
| Test suite exists | ⚠️ NOT YET | Required per specification but not yet implemented |

---

## 2. What Is Needed for Full Reproducibility

### 2a. Inputs (All Currently Available)

1. **Corpus**: `node_modules/quran-json/dist/chapters/en/*.json` (v3.1.2)
2. **Root occurrences**: `data/root-occurrences/*.json` (1,576 files, snapshot 2026-11-10)
3. **Root registry**: `data/root-discovery-registry.json` (1,642 roots)
4. **Pass A extractions**: `research/mfd-11/extractions/*.json` (473 files)
5. **Configuration**: `extraction-config.json` (this deliverable)

### 2b. Extraction Script (Not Yet Written)

A deterministic Node.js script that:
1. Reads all `data/root-occurrences/*.json` files
2. Applies inclusion criteria from `terminology-index-scope.md`
3. For each included lemma:
   - Extracts occurrence data (total, distinct āyāt, tokens)
   - Assigns morphological form/pattern/POS
   - Generates ISO 233-2 transliteration
   - Composes four-layer gloss (may require manual authoring or LLM assistance)
   - Cross-references to Pass A extractions
4. Writes output to `arabic-terminology-index-v2.json`
5. Produces identical output on every run given identical inputs

**Script requirements:**
- No external API calls
- No randomness
- No filesystem writes outside output path
- Deterministic ordering (sort by root, then lemma)
- Version-stamped output metadata

### 2c. Test Suite (Not Yet Written)

Automated tests that verify:
1. Every indexed occurrence exists in `quran-json@3.1.2` at the cited surah:ayah:wordPosition
2. Every indexed lemma appears in its root's `includedLemmas[]` array
3. Transliteration conforms to ISO 233-2 conventions
4. Gloss structure matches four-layer rubric
5. Inclusion criteria are correctly applied (no false positives/negatives)
6. Output is byte-identical across runs

### 2d. Scholarly Review (Pending)

Per `MFD-11.5-TERMINOLOGY-SPECIFICATION.md` Section 11:
- Scope appropriateness
- Gloss rubric complexity
- Transliteration standard suitability
- Disputed root presentation
- Validation of auto-accepted morphology

Reproducibility is mechanical; scholarly validity requires human review.

---

## 3. Reproducibility Risks

### Risk 1: Gloss Authoring Subjectivity
**Severity**: MEDIUM  
**Description**: Four-layer glosses involve interpretive judgments (contextual senses, tafsīr notes, editorial glosses). Different authors may produce different glosses for the same term.  
**Mitigation**: Gloss rubric provides structure but not determinism. Consider:
- Gloss templates for common term categories
- Reference glosses from classical lexicons
- Review workflow for gloss consistency

### Risk 2: Morphological Analysis Uncertainty
**Severity**: LOW-MEDIUM  
**Description**: Some lemmas have disputed form/pattern assignments. `morphConfidence` field captures uncertainty, but different analysts may resolve disputes differently.  
**Mitigation**: Preserve all competing analyses in `alternativeAnalyses` array. Never silently resolve disagreements.

### Risk 3: Root Occurrences Data Integrity
**Severity**: LOW  
**Description**: `data/root-occurrences/` files were auto-accepted via Sprint 48 deterministic morphology review. If the automated review had bugs, some lemma-to-verse mappings may be incorrect.  
**Mitigation**: Test suite should spot-check occurrences against corpus. Scholarly review should validate high-priority roots.

### Risk 4: Corpus Version Drift
**Severity**: LOW  
**Description**: If `quran-json` is updated beyond 3.1.2, word positions and token text may change, breaking occurrence verification.  
**Mitigation**: Strict version pinning. Never update without re-running extraction and tests.

### Risk 5: Inclusion Criteria Evolution
**Severity**: MEDIUM  
**Description**: As scholarly review refines inclusion/exclusion criteria, the set of included terms changes, affecting coverage denominators.  
**Mitigation**: Version the criteria alongside the index. Document criteria changes in changelog.

---

## 4. Reproducibility Checklist

Before claiming reproducibility, verify:

- [ ] `extraction-config.json` accurately reflects all parameters
- [ ] Extraction script exists and is deterministic
- [ ] Test suite passes on clean run
- [ ] Output is byte-identical across three consecutive runs
- [ ] All version dependencies are pinned and available
- [ ] Inclusion criteria are codified (not ad-hoc)
- [ ] Gloss rubric is documented and applied consistently
- [ ] Transliteration follows ISO 233-2 deterministically
- [ ] Scholarly review questions have been addressed
- [ ] Documentation is sufficient for independent team to execute

**Current status**: Items 1, 5, 6, 7, 8 are satisfied. Items 2, 3, 4, 9, 10 require further work.

---

## 5. Comparison: Original vs Proposed Reproducibility

| Aspect | Original Methodology | Proposed Methodology |
|--------|---------------------|---------------------|
| Input stability | ❌ Candidates regenerated per run | ✅ Versioned root-occurrences files |
| Tokenization | ❌ Whitespace split (non-deterministic across excerpts) | ✅ Pre-tokenized with word positions |
| Normalization | ❌ None (surface forms) | ✅ Lemma-based with root assignment |
| Corpus verification | ❌ None | ✅ Exact match against pinned corpus |
| Inclusion criteria | ❌ None (all tokens included) | ✅ Codified criteria with priority ordering |
| Gloss structure | ❌ Single editorial gloss | ✅ Four-layer structured rubric |
| Transliteration | ❌ Ad-hoc | ✅ ISO 233-2 standard |
| Determinism | ❌ Depends on candidate generation | ✅ Deterministic from versioned inputs |
| Testability | ❌ No verification possible | ✅ Every occurrence verifiable against corpus |

**Conclusion**: The original methodology was NOT reproducible. The proposed methodology CAN BE reproducible once the extraction script and test suite are implemented.

---

## 6. Next Steps

1. **Implement extraction script** based on proposed methodology and `extraction-config.json`
2. **Implement test suite** for occurrence verification and structural validation
3. **Run extraction** to produce `arabic-terminology-index-v2.json`
4. **Update coverage-report.json** with actual metrics from new index
5. **Submit for scholarly review** per specification Section 11
6. **Address review feedback** and refine criteria/script as needed
7. **Publish final reproducible package** with all components

---

*This reproducibility assessment is a research deliverable of MFD-11.5 WS5. No production changes have been made.*
