# WS-G Policy: Gloss Epistemology & Editorial Stance (Q15)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-G (Coverage Thresholds & Normalization) |
| Question ID | Q15 |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |
| Scope | RESEARCH ONLY — no production data modified |

---

## 1. Evidence Base

### 1.1 Current gloss quality crisis

From `MFD-11.5-LEXICAL-QUALITY-REPORT.md` (649 terms):

| Quality Category | Count | Percentage |
|-----------------|-------|------------|
| Adequate (all 4 layers) | 9 | 1.4% |
| Editorial-only (Layer 4 only) | 637 | 98.2% |
| Polysemy collapsed | 283 | 43.6% |
| Missing tafsīr note | 42 | 6.5% |
| Too broad | 420 | 64.7% |

**Finding:** ~99% of glosses fail the four-layer adequacy threshold defined in `gloss-quality-rubric.md`. The index currently presents editorial classification labels as if they were lexical definitions.

### 1.2 The Four-Layer Rubric (already adopted)

From `gloss-quality-rubric.md`:

| Layer | Name | Source Authority | Failure Mode |
|-------|------|-----------------|--------------|
| L1 | Lexical Meaning | Classical Arabic lexicography | Circular definition restating the Arabic term |
| L2 | Contextual Sense | Specific āyah siyāq | Collapsing multiple senses into one undifferentiated gloss |
| L3 | Tafsīr Interpretation | Classical exegetical sources, explicitly labeled | Presenting tafsīr as Qur'anic fact without attribution |
| L4 | Editorial Gloss | FAHM taxonomy classification | Editorial gloss contradicting Layers 1-3 |

### 1.3 Where classical tafsīr and modern linguistics diverge

The divergence is not hypothetical; it is structurally embedded in Quranic studies:

1. **Semantic narrowing/broadening:** Classical mufassirūn often assign context-specific meanings that become canonical in tafsīr tradition but are narrower than the root's lexical range. Example: *taqwā* lexically means "to guard/protect oneself" (L1), but tafsīr tradition expands it to comprehensive God-consciousness (L3).

2. **Theological overlay:** Terms like *kufr*, *shirk*, *nifāq* have precise lexical meanings (covering, association, hypocrisy) that classical tafsīr invests with detailed theological frameworks exceeding the semantic field.

3. **Etymological vs. synchronic meaning:** Classical exegetes frequently employ etymology (*ishtiqāq*) as a hermeneutical tool, deriving meanings from root semantics that modern historical linguistics would consider folk etymology or semantic extension.

4. **Loanword treatment:** Words like *sijjīl*, *zanjabīl*, *firdaws* have non-Arabic origins. Modern linguistics identifies them as loanwords; some classical tafsīr traditions Arabize their etymologies.

5. **Polysemy resolution:** Where modern semantics identifies genuine polysemy (multiple related meanings), tafsīr may select one meaning based on theological coherence, sometimes collapsing distinct senses.

### 1.4 Root disagreements as gloss epistemology problem

From the Root Remediation Report, 8 terms have legitimate classical disagreements (e.g., *ababil*: ببل vs ابل vs بيل). These are not merely morphological disputes — they produce different L1 lexical meanings and cascade through all four layers.

---

## 2. Policy Recommendation

### 2.1 Governing principle

> **FAHM is a descriptive scholarly apparatus, not a prescriptive theological authority. Glosses must represent the landscape of meaning transparently, attributing every interpretive claim to its source tradition, and never presenting any single reading as the unqualified meaning of the Qur'an.**

### 2.2 Epistemic status of each layer

| Layer | Epistemic Status | Editorial Obligation |
|-------|-----------------|---------------------|
| L1 (Lexical) | Descriptive linguistic fact grounded in classical lexicography | Must cite at least one Tier 1-3 source (per Q12 hierarchy). If sources disagree, record all attested lexical values. |
| L2 (Contextual) | Analytical judgment about siyāq | Must reference specific āyah(s). Where context narrows or shifts L1, explain the mechanism (metaphor, metonymy, specialization). |
| L3 (Tafsīr) | Attributed scholarly opinion | MUST carry explicit source attribution (e.g., "al-Ṭabarī states...", "Ibn Kathīr interprets..."). NEVER presented as the Qur'an's own meaning. When mufassirūn disagree, record major positions. |
| L4 (Editorial) | FAHM project classification | Must be clearly labeled as FAHM's taxonomic decision. Must not contradict L1-L3. Serves navigation/discovery, not exegesis. |

### 2.3 Divergence handling protocol

When classical tafsīr interpretation (L3) diverges from modern linguistic semantics (L1/L2):

1. **Record both positions fully.** Do not suppress either.
2. **Label the epistemic basis:** "Lexical analysis yields X" vs. "Al-Qurṭubī's exegetical reading yields Y."
3. **Do not adjudicate.** FAHM is not a mufti. Present the divergence as scholarly content.
4. **Explain the divergence mechanism when known:** e.g., "This difference arises because classical exegetes employed etymological derivation (ishtiqāq) while modern semantics relies on attested usage patterns."
5. **Flag for council review:** Terms with significant L1↔L3 divergence receive a `DIVERGENCE_FLAG` requiring scholarly deliberation before publication.

### 2.4 Polysemy policy

From the lexical quality report, 283 terms (43.6%) have collapsed polysemy. Policy:

1. **Enumerate all attested senses** with verse references for each.
2. **Order by frequency** in the corpus, not by theological importance.
3. **Do not merge senses** into a single super-gloss for display convenience.
4. **Link related senses** via a semantic map showing how meanings connect (metaphorical extension, specialization, etc.).

### 2.5 Gloss adequacy threshold for publication

| Publication Stage | Minimum Required Layers |
|-------------------|------------------------|
| v1 Research Preview | L1 + L4 (with L4 clearly labeled as provisional) |
| v1 Scholarly Release | L1 + L2 + L4 |
| v2 Full Publication | L1 + L2 + L3 + L4 |

**Rationale:** Releasing with only L4 (current state: 98.2%) is not publishable under any standard. L1 is the minimum for lexical integrity. L3 requires substantial tafsīr research that may exceed v1 timeline.

### 2.6 Anti-pattern prohibitions

1. **No translation-dependent glosses:** Glosses derived from English translations rather than Arabic semantics are rejected (flagged as `TRANSLATION_DEPENDENT` in rubric).
2. **No circular definitions:** "Jihād means jihād" or "Taqwā means being muttaqī" provides zero semantic content.
3. **No unattributed tafsīr:** Exegetical claims without source citation are treated as unsourced assertions.
4. **No editorial overreach:** L4 must never contradict L1-L3 or present itself as exegesis.
5. **No suppression of minority readings:** If a classical scholar held a minority position that is textually defensible, it is recorded even if not adopted as primary.

---

## 3. Implementation Impact

### Data Pipeline
- Gloss schema must expand from a single string to a structured object with four explicit layer fields plus metadata (sources, flags, divergence markers).
- Automated extraction of L1 from classical lexicons is feasible for common roots; L2-L3 require human scholarship or curated tafsīr databases.
- The 640 flagged glosses need batch remediation prioritized by theological significance (terms in Theology/Covenant domains first).
- Divergence detection can be partially automated by comparing L1 lexical range against L3 tafsīr claims, but adjudication is manual.

### Display
- UI must render four distinct layers, not a single merged paragraph.
- L3 entries display with source badges (e.g., "📖 al-Ṭabarī").
- Divergence flags render as informational notices, not error states.
- Polysemous terms show expandable sense lists, not truncated summaries.
- Users can toggle between "lexical view" (L1+L2) and "exegetical view" (L1+L2+L3).

### Scholarly Review
- Council must approve the epistemic stance (§2.1) as foundational project philosophy.
- Divergence cases require dedicated review sessions with scholars competent in both linguistics and tafsīr.
- The v1/v2 staging (§2.5) needs council approval to set realistic publication expectations.
- 42 terms flagged as `MISSING_TAFSIR_NOTE` are Priority 1 for L3 enrichment.

---

## 4. Scholarly Review Format

> **Question for Council (Q15):** Given that 98.6% of current glosses provide only an editorial label (L4) without lexical grounding (L1), contextual analysis (L2), or attributed exegesis (L3):
>
> 1. Do you approve the principle that **FAHM is descriptive, not prescriptive**, and that glosses must represent divergent scholarly positions without adjudicating between them?
> 2. Do you accept the **four-layer structure** as mandatory, with L3 always carrying explicit source attribution?
> 3. For terms where **classical tafsīr diverges from modern lexical semantics**, do you approve recording both positions with epistemic labels rather than selecting one as authoritative?
> 4. Is the **staged publication threshold** (v1: L1+L2+L4; v2: full L1-L4) acceptable, or does scholarly integrity require all four layers before any release?
> 5. Should the 283 **polysemy-collapsed** terms be remediated before v1, or is partial sense enumeration acceptable for initial release?
> 6. Are there specific terms where the council wishes to **override the non-adjudication principle** and adopt a particular tafsīr reading as FAHM's primary gloss? If so, what criteria justify this exception?
>
> **Decision requested:** approve / amend / reject each item. Record the approved epistemic stance as a governing document for all gloss workstreams.

---

## 5. Uncertainties & Validation Needs

- The 9 adequate glosses (1.4%) should be examined as exemplars to calibrate reviewer expectations.
- Whether existing tafsīr databases are machine-readable enough to accelerate L3 population is unknown.
- The boundary between L2 (contextual sense) and L3 (tafsīr interpretation) may blur in practice; council guidance on edge cases is needed.
- No production gloss files were modified; schema expansion proposals are research artifacts only.

---

*proposedBy: ai-assisted | reviewStatus: pending-scholarly-review*
*No production files modified.*
