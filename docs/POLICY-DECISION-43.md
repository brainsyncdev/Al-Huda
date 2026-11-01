# Sprint 43 — Publication Policy Decision

**Date:** 2026-10-27  
**Status:** Decision made  
**Policy chosen:** Policy B — Disclosed source coverage

---

## Context

Sprint 42 identified 1,669 word-level morphology records across 158 roots with missing lemma mappings. These are genuinely absent from the QUL morphology v1 source databases (word-lemma.db). No recovery is possible without fabrication, which is prohibited.

Sprint 43 must decide whether to publish root occurrence indices when lemma coverage is incomplete.

---

## Policy A — Strict Completeness

**Rule:** A root index cannot be published if any of its eligible word-level records have missing lemma mappings.

**Implications:**
- Only roots with 100% lemma coverage can be published
- Current data: 4 of 10 configured roots pass (sabr, shukr, tawbah, khushu)
- 6 roots blocked: ilm (6 missing), maghfirah (29), kibr (4), rahmah (0 missing but ambiguity), sidq (0 missing but ambiguity), tawakkul (0 missing but ambiguity)
- Expanding to all roots: most would be blocked because 1,669 missing lemmas are distributed across 158 roots
- Top blocked roots: كون (353 missing), امن (130), شيا (118), نفس (106), اتي (97)

**Advantages:**
- Simplest rule: binary pass/fail
- No risk of presenting incomplete data as complete
- Aligns with Sprint 42's initial gate

**Disadvantages:**
- Blocks most roots from publication indefinitely
- Users cannot explore occurrence data even when root mappings are valid
- Treats missing lemma (a morphological detail) the same as invalid occurrence alignment (a structural defect)
- Does not distinguish between "lemma filtering incomplete" and "occurrence index invalid"

---

## Policy B — Disclosed Source Coverage

**Rule:** A root occurrence index may be published when its root mappings and occurrence alignment pass deterministic validation, even if some lemma mappings are missing, provided that:
1. All source-backed root occurrences remain available
2. Missing lemma mappings are explicitly counted and disclosed
3. Lemma-based filtering is marked incomplete or restricted appropriately
4. The UI does not claim exhaustive coverage
5. No missing occurrence is silently dropped
6. Invalid or ambiguous occurrence alignment still blocks publication

**Implications:**
- Roots with valid root mappings and alignment can be published
- Missing lemmas are disclosed in UI and metadata
- Lemma-based filtering (e.g., "show only صَبَرَ forms") may be incomplete
- Root occurrence index (e.g., "show all صبر forms") remains complete for source-backed occurrences
- Users see honest disclosure: "X of Y records have lemma data; lemma-based filtering is restricted"

**Advantages:**
- Allows publication of roots with valid occurrence data
- Transparent about limitations
- Distinguishes occurrence validity from lemma coverage
- Users can still explore root occurrences even when lemma filtering is incomplete
- Aligns with Al-Huda's purpose: navigation and discovery, not scholarly claims

**Disadvantages:**
- More complex than Policy A
- Requires explicit UI disclosure and metadata
- Users must understand the distinction between "occurrence index complete" and "lemma filtering incomplete"

---

## Decision: Policy B

**Rationale:**

1. **Al-Huda's purpose is navigation and discovery, not scholarly classification.** Root occurrence indices are navigational aids, not thematic claims. Users exploring "show all occurrences of صبر" benefit from seeing all source-backed occurrences, even if lemma-based filtering is incomplete.

2. **Missing lemmas are a source-data limitation, not a code defect.** The 1,669 missing lemmas are genuinely absent from QUL morphology v1. Blocking publication indefinitely until the source is updated (which may never happen) prevents users from accessing valid occurrence data.

3. **Honest disclosure is sufficient.** Policy B requires explicit disclosure of missing lemma counts, restricted lemma-based filtering, and no claims of exhaustive coverage. This preserves integrity while allowing useful functionality.

4. **Occurrence validity and lemma coverage are independent dimensions.** A root can have valid occurrence alignment (all root-mapped words are correctly located) but incomplete lemma coverage (some of those words have no lemma in the source). These should be treated separately.

5. **Policy A is overly restrictive.** With 1,669 missing lemmas across 158 roots, Policy A would block most roots from publication. This prevents users from exploring occurrence data for roots like كون (353 missing) or امن (130 missing), even though their root mappings are valid.

---

## Implementation Requirements

Policy B requires:

1. **Machine-readable coverage metadata:**
   - `totalWordRecords`: total word-level records for this root
   - `recordsWithLemma`: count with lemma mappings
   - `missingLemmaCount`: count without lemma mappings
   - `lemmaCoverageRatio`: recordsWithLemma / totalWordRecords
   - `occurrenceAlignmentStatus`: "valid" | "invalid" | "unknown"
   - `publicationStatus`: "published" | "needs-review" | "blocked"
   - `coverageDisclosure`: human-readable summary

2. **UI disclosure:**
   - Root pages show missing lemma count and coverage ratio
   - Lemma-based filtering UI indicates when filtering is restricted
   - No claims of exhaustive coverage when lemma coverage < 100%

3. **Publication gate:**
   - Occurrence alignment must be valid (no invalid locations, no malformed roots)
   - Missing lemmas are disclosed, not blocking
   - Ambiguity flags (e.g., أَرْحَام homographs) still block publication until resolved

4. **Regression tests:**
   - Coverage ratio uses correct denominator (word-level only, not ayah-level)
   - Missing lemmas never inferred or fabricated
   - Invalid alignment blocks publication
   - UI disclosure present when lemma coverage < 100%

---

## Policy Version

**Version:** 2.0.0  
**Supersedes:** 1.1.0 (Sprint 42)

**Change log:**
- 1.0.0 (Sprint 41): Initial automated review pipeline
- 1.1.0 (Sprint 42): Added missing-lemma gate (strict completeness)
- 2.0.0 (Sprint 43): Switched to disclosed coverage policy, separated occurrence validity from lemma coverage

---

## Constraints Preserved

✓ No fabricated or inferred lemmas  
✓ No silent deletion of source-backed occurrences  
✓ No conflation of root occurrence indexing with thematic classification  
✓ No fabricated scholarly approval or completeness claims  
✓ Honest disclosure of source-data limitations  
✓ Preserve local-first anonymous behavior  
✓ Keep `AI_ANSWER_FEATURE_ENABLED = false`
