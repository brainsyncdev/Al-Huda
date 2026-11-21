# WS-G Policy: Coverage Thresholds & Denominator Discipline (Q13)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-G (Coverage Thresholds & Normalization) |
| Question ID | Q13 |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |
| Scope | RESEARCH ONLY — no production data modified, no extraction or normalization executed |

---

## 1. Evidence Base

### 1.1 Why the legacy ~7% estimate is not a usable metric

`coverage-report.json` (`legacyIndexAnalysis`) documents that the legacy index was built by **whitespace-split extraction from candidate evidence excerpts**, with these declared defects:

- surface forms never normalized to lemmas;
- no root assignment at extraction time;
- occurrence counts reflect *excerpt mentions*, not corpus reality;
- fragments produced by whitespace splitting;
- no corpus verification.

Consequently the numerator and denominator of any legacy percentage measure different things. The register states this explicitly for the thematic denominator: "The 649-term count from the legacy index is NOT a reliable denominator" (`coverage-denominator-register.json`, `thematicCoverage.notes`).

**Conclusion:** the ~7% figure must be retired as a headline claim, not merely re-labelled. It is an artifact ratio (curated excerpt terms ÷ corpus tokens), not lexical coverage.

### 1.2 Corpus statistics available today

| Quantity | Value | Source |
|---|---|---|
| Legacy index unique terms | 649 | coverage-report.json `executiveSummary` |
| Legacy index occurrences | 723 | coverage-report.json `executiveSummary` |
| Registered roots | 1,642 | denominator register `rootCoverage.currentValue` |
| Roots with occurrence files | 1,576 | same; verified |
| Root files carrying lemma data | 1,574 | MFD-11.5 Morphology Report §Data Sources |
| Pass A extraction records | 473 | denominator register `versionDependencies` |
| Corpus āyāt | 6,236 | denominator register `corpusTokenCoverage` |
| Corpus tokens (approx.) | 77,430 | same, status `approximate` |
| Sample root جهد | 41 occurrences / 36 āyāt / 5 lemmas | coverage-report.json `sampleRootMetrics` |
| Sample root سلم | 136 occurrences / 90 āyāt / 16 lemmas | same |

Two priority roots alone yield 177 verified occurrences against a legacy total of 723 — the report's own demonstration that the legacy pipeline undercounts by an order of magnitude in places.

### 1.3 Quality-side ceilings on what can honestly be claimed

From the three MFD-11.5 remediation reports (all `pending-scholarly-review`):

| Layer | Verified / adequate | Unresolved |
|---|---|---|
| Root assignment | 272 direct + 100 lexically corrected = 372/649 (57.3%) | 223 unresolved + 54 unassigned = 277 (42.7%) |
| Lemma | 220/649 (33.9%) corpus-matched | 429 null (66.1%) |
| Pattern | 196 resolved (30.2%) | 453 unresolved (69.8%) |
| Gloss adequacy (4-layer rubric) | 9/649 (1.4%) | 640 flagged (98.6%) |
| Transliteration ISO 233-2 | 404 compliant (62.2%) | 245 violations (37.8%) |
| Arabic surface vs pinned corpus | 630 fully verified (96.8%) | 19 partial, 0 mismatch |

### 1.4 Existing standards already adopted

- `coverage-report.json.recommendations.doNotAdopt50PercentTarget`: do not set arbitrary targets before denominators are agreed.
- `calculationRules.percentageReporting.requiredFields`: every published percentage must carry numerator, denominator, counting methodology, treatment of repeated forms.
- Inclusion threshold already drafted for verbs/nouns: **≥3 distinct āyāt OR ≥5 occurrences**; particles only when theologically load-bearing; proper nouns only when functioning conceptually.
- `corpusTokenCoverage` is declared **informational only** — FAHM is a curated thematic lexicon, not a concordance.

---

## 2. Policy Recommendation

### 2.1 Governing principle

> **Coverage is measured against a declared, versioned, inclusion-filtered denominator — never against the whole corpus, and never against the legacy index.** A percentage without its denominator register entry is not publishable.

### 2.2 Four separate metrics, never averaged into one number

| Metric ID | Numerator | Denominator | Publication role |
|---|---|---|---|
| `M1 inclusion-completeness` | included lemmas actually indexed | all lemmas meeting inclusion criteria (post-extraction) | **Primary gate** |
| `M2 occurrence-completeness` | indexed occurrences of included lemmas | all corpus occurrences of those same lemmas | **Primary gate** |
| `M3 domain-priority coverage` | indexed occurrences per priority root | corpus occurrences of that root | Per-domain reporting |
| `M4 corpus-token share` | tokens of included lemmas | 77,430 corpus tokens (approx.) | Informational only; **no threshold** |

Averaging M1–M4 into a single "coverage %" is prohibited.

### 2.3 Proposed thresholds by domain

Thresholds apply to **M1/M2 restricted to the domain's declared priority roots**, after scholarly sign-off on inclusion criteria. They are gates on *completeness of the included set*, not on breadth of the lexicon.

| Domain | Priority roots (register) | M1 inclusion-completeness | M2 occurrence-completeness | Rationale |
|---|---|---|---|---|
| Theology & Belief | وحد، ربب، إله، كفر، أمن، شرك | **100%** | **≥98%** | Doctrinal error risk highest; omission reads as a theological claim |
| Covenant, Law & Justice | عهد، وعد، حكم، شرع، قسط | **100%** | **≥98%** | Legal/rulings derivation depends on complete attestation |
| War, Peace & Covenant | جهد، سلم، قتل، حرب، صلح، أمن | **100%** | **≥98%** | Ethically sensitive; partial coverage invites misreading (e.g. jihād) |
| Arts, Beauty & Aesthetics | حسن، زين، جمل، نور، بهج | **≥95%** | **≥90%** | Descriptive domain; lower doctrinal risk |
| Non-priority / long-tail domains | — | **≥80%** with explicit exclusion log | **≥75%** | Curated scope is legitimate if exclusions are documented |

Note: أمن appears in both Theology and War/Peace; it is counted once per domain report and never double-counted in any aggregate.

### 2.4 Proposed thresholds by lexical category

| Category | Inclusion rule (existing draft) | M1 gate | Additional condition |
|---|---|---|---|
| Verbs (Forms I–X) | ≥3 distinct āyāt OR ≥5 occurrences | **≥98%** | Every included verb must carry a corpus-matched lemma |
| Nouns incl. maṣdar, ism fāʿil, ism mafʿūl | same | **≥98%** | Same lemma condition |
| Particles / prepositions | only when theologically load-bearing | **100% of the approved list** | List itself requires council approval; denominator is the list, not all particles |
| Proper nouns used conceptually | must function beyond naming | **100% of the approved list** | Loanword/proper-noun status recorded (see Q12/Q14) |
| Ḥurūf muqaṭṭaʿāt | excluded from root morphology | **N/A** | Must appear in an explicit non-root register, not as a coverage gap |
| Hapax legomena | included regardless of frequency when thematically significant | **100% of approved hapax list** | Exempt from the ≥3 āyāt rule; low-frequency exemption must be logged |

**Hapax override:** the frequency threshold must never silently exclude rare but doctrinally significant terms (e.g. صمد-type cases). An explicit exemption register is required so exclusions are visible rather than statistical.

### 2.5 Quality gates that bind publication independently of coverage

High coverage with low quality is not publishable. Proposed release gates, evaluated on the *included* set:

| Gate | Proposed minimum for v1 publication | Current measured state |
|---|---|---|
| Root assignment resolved (Tier 1–4 authority, see Q12) | **100%** of published entries | 57.3% overall — **not met** |
| Arabic surface corpus-verified | **100%** full verification | 96.8% — **not met** (19 partial) |
| Lemma present OR explicitly `null` with reason code | **100%** accounted for | 33.9% populated; remainder must carry reason codes |
| Gloss Layer 1 + Layer 2 present | **100%** of published entries | 1.4% adequate — **not met** |
| Transliteration ISO 233-2 compliant | **100%** | 62.2% — **not met** |
| Entries marked `scholar-approved` | **100%** of published entries | 0% — **not met** |

**Implication:** on present evidence no domain satisfies a publication gate. The honest v1 posture is either (a) a sharply narrowed "verified core" release, or (b) a clearly labelled research preview. This is a recommendation for council decision, not an observed release state.

### 2.6 Reporting format (mandatory)

Every coverage claim must be emitted as:

```
X.Y% (numerator/denominator) — metric M#, domain D, category C,
denominator-register vX.Y.Z, corpus quran-json@3.1.2,
root-occurrences snapshot 2026-11-10 (Sprint 48),
counting method: lemma occurrences, repeated forms counted separately
```

Any percentage lacking these fields is rejected at review intake.

### 2.7 Sequencing constraint

Thresholds in §2.3–2.4 are **proposed parameters, not measured results**. They become binding only after:

1. council approves inclusion/exclusion criteria (fixes denominators);
2. the proposed extraction is run by an authorized workstream (**not** WS-G, which is research-only);
3. `coverage-denominator-register.json` is updated with actual values replacing `requires-extraction-run`;
4. coverage is recomputed and re-reviewed.

Until step 3, every domain denominator other than `rootCoverage` remains `null`/estimated and must be displayed as such.

---

## 3. Implementation Impact

### Data pipeline
- Extraction must emit, per domain and category, the four-field percentage record plus a machine-readable denominator reference.
- An **exclusion log** becomes a first-class artifact: every lemma failing inclusion criteria is recorded with the rule that excluded it (frequency, particle status, non-conceptual proper noun, muqaṭṭaʿāt).
- Denominator register must be versioned and hashed; coverage reports pin the register version so historical percentages remain reproducible.
- Repeated-form counting must follow `calculationRules.occurrenceCounting` exactly (repeats within one āyah count separately); `distinctAyahs` reported alongside, never substituted.

### Display
- No global "coverage: N%" badge. Replace with per-domain cards showing metric ID, numerator/denominator, and register version.
- Domains whose denominator is still `requires-extraction-run` render "not yet measured", never 0% and never an estimate presented as fact.
- M4 (corpus-token share) shown only in a methodology appendix, explicitly labelled informational.

### Scholarly review
- Council reviews **criteria first, thresholds second**. Reviewing thresholds before denominators exist repeats the original ~7% error.
- Reviewers receive the exclusion log alongside the coverage table, so scope decisions are auditable.
- Quality gates (§2.5) are reviewed as a separate checklist from coverage; passing one never implies passing the other.

---

## 4. Scholarly Review Format

> **Question for Council (Q13):** Given that the legacy ~7% figure is an artifact of excerpt-based extraction and that valid denominators require an approved inclusion rule set:
>
> 1. Do you approve the inclusion rule **≥3 distinct āyāt OR ≥5 occurrences** for verbs and nouns, with an explicit exemption register for doctrinally significant hapax legomena?
> 2. Do you approve **100% inclusion-completeness** as the gate for Theology, Covenant/Law, and War/Peace, versus ≥95% for Arts/Beauty and ≥80% for long-tail domains — or should all domains hold at 100%?
> 3. Should particles and conceptual proper nouns be governed by a **closed, council-approved list** (denominator = the list) rather than a frequency rule?
> 4. Do you accept that **quality gates bind independently of coverage**, such that a domain at 100% coverage but 1.4% gloss adequacy is still unpublishable?
> 5. For v1, do you prefer a **narrowed verified-core release** or a **labelled research preview**, given that no domain currently meets the proposed gates?
>
> **Decision requested:** approve / amend / reject each of the five items, with the approved inclusion rule set recorded as the authoritative denominator definition.

---

## 5. Uncertainties & Validation Needs (for the reviewing owner)

- All thresholds above are **proposals**; none has been validated against a real extraction run. WS-G executed no scripts.
- Domain denominators other than `rootCoverage` (1,642 registered / 1,576 with files) are unmeasured.
- The 77,430 token figure is flagged `approximate` in the register and must not be used as a hard denominator.
- Whether the 19 partial corpus matches are orthographic variants or genuine occurrence errors is unresolved (cross-reference Q39 normalization discipline).
- The overlap of أمن across two domains needs an explicit de-duplication rule before any aggregate is computed.

---

*proposedBy: ai-assisted | reviewStatus: pending-scholarly-review*
*No production files modified. No extraction, normalization, or validation scripts executed.*
