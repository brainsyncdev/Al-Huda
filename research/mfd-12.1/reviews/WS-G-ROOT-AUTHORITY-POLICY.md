# WS-G Policy: Root Assignment Authority Hierarchy (Q12)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-G (Coverage Thresholds & Normalization) |
| Question ID | Q12 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-scholarly-review |

---

## 1. Evidence Base

### MFD-11.5 Findings
- **Systemic Computational Failure:** The MFD-11.5 Root Remediation Report identified that **235 of 451 root keys** (52%) in the morphology index were invalid slugs due to prefix-prepending bugs (e.g., storing `لعق` instead of `عقب`).
- **Correction Success Rate:** Lexical cross-reference successfully corrected 100 terms, while 223 remain unresolved without manual scholarly intervention.
- **Legitimate Disagreements:** 8 terms (e.g., *ababil*, *al-ma'un*, *sijjeel*) have documented classical disagreements where multiple roots are valid according to different lexicographers.
- **Corpus Verification:** 96.8% of Arabic surface forms verified against quran-json@3.1.2, confirming that text extraction was accurate even when root assignment was not.

### External Standards
- Classical lexicons (*Lisān al-ʿArab*, *Tāj al-ʿArūs*, Lane Lexicon) represent centuries of philological scholarship and remain the gold standard for Quranic vocabulary.
- Computational morphology tools (e.g., CAMeL Tools, Farasa) are trained primarily on Modern Standard Arabic and frequently misanalyze Quranic archaic forms, hapax legomena, and morphologically irregular words.

---

## 2. Policy Recommendation

### Decision Hierarchy for Root Assignment

When sources conflict, apply the following precedence order:

| Priority | Source Type | Examples | Authority Level |
|----------|------------|----------|------------------|
| 1 | Classical Quranic Lexicography | Lisān al-ʿArab, Tāj al-ʿArūs, Al-Mufradāt fī Gharīb al-Qur'ān | Definitive |
| 2 | Classical Tafsīr Consensus | Tabari, Qurṭubī, Ibn Kathīr (when unanimous) | High |
| 3 | Modern Scholarly Lexicons | Hans Wehr, Lane Lexicon, Brill Dictionary | Medium-High |
| 4 | Corpus-Internal Evidence | data/root-occurrences/ validated mappings | Medium |
| 5 | Computational Morphology | CAMeL, Farasa, automated parsers | Candidate Generator Only |
| 6 | Legacy Index Assignments | root-morphology-index.json (pre-MFD-11.5) | Deprecated |

### Rules of Application

1.  **Computational outputs are NEVER authoritative.** They serve only as candidate generators for human verification.
2.  **Classical lexicography prevails over computational analysis** in all cases of disagreement.
3.  **When classical sources disagree**, record ALL attested positions with source attribution. Do not select a single "correct" root programmatically.
4.  **Corpus-internal evidence** (`data/root-occurrences/`) serves as tiebreaker when classical sources are silent or equally weighted.
5.  **Legacy assignments carry zero weight** unless independently verified against higher-priority sources.
6.  **Null over false:** When no authoritative source supports a confident assignment, the root field MUST be `null`. Never populate to eliminate gaps.

---

## 3. Implementation Impact

### Data Pipeline
- Root extraction scripts must output confidence levels tied to source hierarchy tier.
- Automated pipelines must flag any entry where computational assignment contradicts classical lexicon for mandatory review.
- The 223 unresolved entries from MFD-11.5 require manual lookup in Priority 1-3 sources before publication.

### Display
- UI must support displaying multiple alternative roots with source labels.
- Single-root display should only occur when Priority 1-2 sources are unambiguous.
- Confidence badges should reflect hierarchy tier, not statistical probability.

### Scholarly Review
- Reviewers should be presented with computational candidates alongside classical source excerpts.
- Disagreement cases (8 identified + potential new ones) require dedicated review workflow.

---

## 4. Scholarly Review Format

> **Question for Council:** Does the proposed six-tier authority hierarchy accurately reflect accepted methodologies in Quranic lexicography? Specifically:
> 1. Is the placement of *Al-Mufradāt fī Gharīb al-Qur'ān* at Tier 1 appropriate given its specialized Quranic focus?
> 2. Should corpus-internal evidence (Tier 4) ever override modern scholarly lexicons (Tier 3) for hapax legomena absent from classical works?
> 3. Are there additional classical sources that should be explicitly enumerated in Tier 1?

---

*proposedBy: ai-assisted | reviewStatus: pending-scholarly-review*
