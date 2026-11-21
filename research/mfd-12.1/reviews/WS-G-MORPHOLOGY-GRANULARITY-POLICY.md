# WS-G Policy: Morphological Granularity for Publication (Q14)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-G (Coverage Thresholds & Normalization) |
| Question ID | Q14 |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |
| Scope | RESEARCH ONLY — no production data modified |

---

## 1. Evidence Base

### 1.1 What the morphology layer actually contains

From `MFD-11.5-MORPHOLOGY-REPORT.md` (649 terms):

| Field | Populated | Null / unresolved |
|---|---|---|
| Lemma | 220 (33.9%) | 429 (66.1%) |
| Pattern | 196 (30.2%) | 453 (69.8%) |
| Confidence high | 192 (29.6%) | — |
| Confidence medium | 131 (20.2%) | — |
| Confidence low | 326 (50.2%) | — |
| Ambiguity flagged | 28 (4.3%) | — |
| Review queue | 460 (70.9%) | — |

Analysis method split: 220 `corpus-cross-reference`, 429 `computational`. Only the former has direct corpus evidence (`matchedToken → matchedLemma` or `includedLemmas` equality).

### 1.2 Documented limitations that constrain publishable granularity

The report's own "Known Limitations" section is decisive:

1. **POS inheritance is unreliable** — verbs labelled as nouns in the source index; pattern inference inherits the wrong POS, so patterns can be wrong even when the lemma is right.
2. **Root errors propagate** — ~71 terms estimated to have wrong roots (e.g. `tadlil` assigned ل-ي-ل "night" instead of ض-ل-ل), causing cross-reference failure.
3. **Prefix stripping is heuristic** — one level only; doubly-prefixed forms (`wa-bi-l-…`) may normalize incorrectly.
4. **No semantic disambiguation** — homographs (عين eye/spring) cannot be separated computationally.

Additionally, pattern inference uses **surface heuristics** ("alif after first radical", "mīm prefix, 4+ chars", "short form ≤4 chars"). These are string-shape rules, not grammatical analysis; they will misfire on weak roots, quadriliterals, and loanwords.

### 1.3 Categories that resist full parsing

Report's breakdown of the 429 null lemmas: ~71 root mismatch, ~150 complex prefixed/phrasal, ~80 hapax/rare, ~50 particles and proper nouns, ~30 quadriliteral+. Roughly **260 of 429** are structurally unsuited to triliteral template parsing, independent of bug fixes.

### 1.4 Established schema and the null rule

`morphology-schema.json` already defines: `surfaceForm`, `lemma`, `root`, `partOfSpeech`, `morphForm`, `pattern`, `gender`, `number`, `person`, `caseOrMood`, `features{definite, constructState, gemination, weakRoot, hamzatAlWasl, voice}`, `alternativeAnalyses[]`, `analysisMethod`, `confidence`, `reviewStatus`.

> **Critical rule (already adopted):** `null` means insufficient evidence. Fields are NEVER populated merely to eliminate nulls.

### 1.5 Cross-workstream constraints

- Q12: 235/451 invalid root slugs; roots must be re-established under the authority hierarchy before downstream features are trusted.
- Root report: 54 terms have no root at all, including phrasal terms, ḥurūf muqaṭṭaʿāt, and particles — categories where a single root is *linguistically inappropriate*, not merely missing.
- Q13: quality gates bind independently of coverage.

---

## 2. Policy Recommendation

### 2.1 Governing principle

> **Publish the analysis you can defend, at the granularity you can defend it.** Granularity is per-entry and evidence-bound, not a global product setting. Absence of evidence renders as an explicit, reasoned null — never as an inferred guess and never as a silent blank.

### 2.2 Three publication tiers

| Tier | Fields published | Evidence required | Status |
|---|---|---|---|
| **T1 — Root layer (publishable floor)** | `surfaceForm` (corpus-verified), `root` (hyphenated + slug), `lexicalSources`, `confidence`, `analysisMethod`, `reviewStatus` | Root resolved at authority Tier 1–4 (Q12) **and** surface fully corpus-verified | **Publishable in v1** after scholarly approval |
| **T2 — Lemma layer (conditional)** | T1 + `lemma`, `partOfSpeech` (corrected), `alternativeAnalyses[]` | `analysisMethod = corpus-cross-reference` (exact normalized match to `matchedLemma` or `includedLemmas`) **and** POS independently confirmed | **Publishable per-entry** where evidence exists |
| **T3 — Full parse (deferred)** | T2 + `morphForm`, `pattern`, `gender`, `number`, `person`, `caseOrMood`, `features{}` | Human scholar or validated grammar confirms each feature; heuristic-only inference insufficient | **Deferred** to a later phase |

**Recommendation: publish T1 universally, T2 selectively, T3 not at all in v1.**

Rationale: T1 rests on 96.8%-verified surfaces plus lexicon-backed roots. T2 rests on 220 exact corpus matches — genuinely strong evidence. T3 rests on inherited POS known to be wrong and string-shape heuristics; publishing it would present guesses as grammatical analysis, which is precisely the failure mode the null rule exists to prevent.

### 2.3 Per-field publication rules

| Field | v1 rule |
|---|---|
| `surfaceForm` | Publish only if fully corpus-verified. The 19 partial matches are held pending investigation. |
| `root` | Publish if Q12 Tier 1–4 resolved. Where classical sources disagree, publish primary + `alternativeRoots[]` with attribution. |
| `lemma` | Publish only when `corpus-cross-reference`. Otherwise `null` + reason code. |
| `partOfSpeech` | Publish only after correction of inherited POS. Never inherit unreviewed. |
| `morphForm` / `pattern` | **Suppress in v1** unless individually scholar-confirmed. Heuristic values retained in research artifacts only. |
| `gender` / `number` / `person` / `caseOrMood` | **Suppress in v1.** Requires full parse validation (T3). |
| `features{}` | **Suppress in v1**, except `weakRoot` and `hamzatAlWasl` which are orthographically determinable and may be shown as informational flags. |
| `alternativeAnalyses[]` | Always publish when present (28 cases). Ambiguity is scholarly content, not a defect. |
| `confidence` | Always publish, mapped to evidence tier — not to a statistical score. |
| `analysisMethod` | Always publish. Readers must be able to distinguish corpus evidence from computation. |

### 2.4 Mandatory null reason codes

Every null must carry a machine-readable reason, so gaps are auditable rather than mysterious:

| Code | Meaning | Approx. affected |
|---|---|---|
| `ROOT_MISMATCH` | Source root wrong; cross-reference targeted wrong file | ~71 |
| `PHRASAL_FORM` | Multi-word expression; single-lemma model inapplicable | ~150 (with affixed forms) |
| `HAPAX_NO_LEMMA_DATA` | Root file has empty `includedLemmas` | ~80 |
| `PARTICLE_OR_PROPER_NOUN` | Outside standard derivational morphology | ~50 |
| `QUADRILITERAL_PLUS` | Beyond triliteral templates | ~30 |
| `MUQATTAAT` | Disjointed letters; no derivable root | subset of 54 unassigned |
| `AMBIGUOUS_UNRESOLVED` | Multiple candidates, awaiting scholar | 28 |
| `INSUFFICIENT_EVIDENCE` | Catch-all; requires free-text justification | remainder |

Counts are the report's estimates, not measured allocations; assigning codes per entry is implementation work for an authorized workstream.

### 2.5 Special-category handling

- **Phrasal terms** (e.g. `ashab-al-yamin`, `rabb-hadha-al-bayt`): publish as phrase entries with constituent roots listed; do **not** force a single root or lemma. Decomposition is deferred (report Priority 4).
- **Ḥurūf muqaṭṭaʿāt** (`alif-lam-mim`): publish in a separate non-root register with tafsīr references; root/lemma permanently `null` with code `MUQATTAAT`. This is a linguistic fact, not a coverage gap (aligns with Q13 §2.4).
- **Loanwords / proper nouns** (`zanjabil`, `zaqqum`, `sijjeel`, `zabur`): publish with loanword status noted; pattern fields `null`. Do not fabricate Arabic patterns for non-Arabic etyma.
- **Quadriliterals**: publish root; defer pattern until a quadriliteral template set is validated.

### 2.6 Anti-pattern prohibitions

1. Do not populate any field to raise a completeness percentage.
2. Do not present heuristic pattern inference as grammatical analysis in user-facing text.
3. Do not inherit POS from the legacy index without correction.
4. Do not collapse `alternativeAnalyses[]` to a single value for display convenience.
5. Do not use substring/partial matching to manufacture lemma matches — the strict-equality rule stands.

---

## 3. Implementation Impact

### Data pipeline
- Schema gains `nullReason` (enum above) and `publicationTier` (`T1`/`T2`/`T3`) per entry; both are additive and do not break existing consumers.
- Build step must **partition** research artifacts from publishable artifacts: heuristic `pattern`/`morphForm` values stay in `lemma-analysis.json`, and are filtered out of the publication projection.
- POS correction becomes a blocking prerequisite for T2, not an optional cleanup (report Priority 3).
- Root corrections (~71) unblock lemma matching; sequencing is root-fix → re-cross-reference → T2 promotion. WS-G does not execute this.
- Prefix-stripping limitation must be documented in the pipeline README so future contributors do not mistake single-level stripping for correctness.

### Display
- Entry cards render root always; lemma when T2; a clear "full morphological analysis pending scholarly review" note where T3 fields are suppressed.
- Nulls render as "not established — {reason}" rather than empty space or a dash.
- Alternative analyses render as an expandable list with sources, not as a hidden tooltip.
- Confidence badge maps to evidence tier (corpus-verified / lexicon-backed / unresolved), avoiding false precision.
- Phrase and muqaṭṭaʿāt entries need distinct card templates so users are not shown a misleading single-root field.

### Scholarly review
- Review queue of 460 entries is triaged by null reason code, letting specialists take batches (hapax specialist vs. phrase decomposition vs. POS correction).
- The 28 ambiguity cases go to a tafsīr-competent reviewer, since resolution requires context (report Priority 2).
- T3 promotion requires per-feature sign-off; a scholar approving a lemma is not thereby approving gender/case/mood.

---

## 4. Scholarly Review Format

> **Question for Council (Q14):** The morphology layer currently holds 220 corpus-matched lemmas (33.9%), 196 heuristic patterns (30.2%), and POS labels known to be partly incorrect.
>
> 1. Do you approve **T1 (root) + selective T2 (corpus-matched lemma)** as the v1 publication granularity, with **T3 (full parse) deferred**?
> 2. Is a **corpus-matched lemma with corrected POS** sufficient for publication, or must every published lemma also carry a classical lexicon citation?
> 3. Do you accept the **eight null reason codes** as an honest representation of gaps, or do you require additional categories?
> 4. For **phrasal terms**, do you prefer constituent-root listing in v1, or full decomposition before any publication?
> 5. For **ḥurūf muqaṭṭaʿāt**, do you approve a separate non-root register with tafsīr references and permanently null root/lemma?
> 6. Which of `weakRoot` / `hamzatAlWasl` may be shown as informational orthographic flags in v1 without constituting morphological analysis?
>
> **Decision requested:** approve / amend / reject each item; record the approved publication tier per category in the terminology specification.

---

## 5. Uncertainties & Validation Needs

- Category counts (~71 / ~150 / ~80 / ~50 / ~30) are the source report's **estimates**; per-entry allocation is unverified.
- The report's pattern count is internally inconsistent in places (196 resolved vs. "~350 undetermined" estimate in the before/after table). Reconciliation is needed before any pattern-based claim is published.
- Whether POS correction alone materially raises pattern accuracy is untested; WS-G ran no experiments.
- The 28 ambiguity cases have not been examined against tafsīr context by a qualified reviewer.
- No production schema was altered; `publicationTier` and `nullReason` are proposals only.

---

*proposedBy: ai-assisted | reviewStatus: pending-scholarly-review*
*No production files modified. No scripts executed.*
