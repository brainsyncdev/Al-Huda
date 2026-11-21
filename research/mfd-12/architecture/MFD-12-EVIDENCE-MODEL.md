# MFD-12 Evidence and Claim Model Specification

**Status:** Design Proposal (research only — no production schema or data modified)  
**Module:** WS4 — Tafsir & Evidence Integration  
**Date:** 2026-11-21  
**Extends:** `research/mfd-11/schemas/evidence-link.schema.json`, `topic-candidate.schema.json`  
**Depends on:** MFD-12-CANONICAL-DATA-MODEL (§4M–4P), MFD-12-SOURCE-REGISTRY-SPEC, MFD-12-REVIEW-WORKFLOW-SPEC

---

## 1. Purpose and Scope

This specification defines how tafsir sources, evidence records, scholarly claims, and review decisions integrate into the FAHM canonical architecture. It separates three concerns that the current pipeline conflates:

1. **Evidence Verification** — Does the cited text actually exist where we say it exists? (mechanical / documentary fact-checking)
2. **Claim Support** — Does that verified text support the interpretive claim? (scholarly reasoning)
3. **Review Decision** — Has an authorised reviewer approved, rejected, or deferred the item? (governance)

These are distinct lifecycles with different actors, failure modes, and data requirements. Conflating them produces false confidence: a mechanically matched excerpt is not scholarly endorsement of the interpretation built on it.

### 1.1 Evidence from the existing repository

| Observation | Source |
|---|---|
| Evidence today is `{key, excerpt, evidenceClass, rationale}` with `excerpt` "mechanically checked" and `evidenceClass` explicitly "never conflated with scholarly approval" | [evidence-link.schema.json](<research/mfd-11/schemas/evidence-link.schema.json>) |
| Candidates hard-code `proposedBy: "ai-assisted"`, `reviewStatus: "pending-scholarly-review"`, `definitionStatus: "editorial-draft"` — proposal state is structurally locked | [topic-candidate.schema.json](<research/mfd-11/schemas/topic-candidate.schema.json>) |
| Production mappings carry `sourceIds: ["quran-json"]`, `provenance: "pending-scholarly-review"`, `status: "MAPPED"` — i.e. mapped but never reviewed | [topic-ayah-mappings.json](<data/taxonomy/topic-ayah-mappings.json>) |
| Batch reviews already separate grounding strength from disposition (RETAIN / MERGE / RECLASSIFY) and record open scholarly questions rather than resolving them | [BATCH1](<research/mfd-11/reports/MFD-11.2-SCHOLARLY-REVIEW-BATCH1.md>), [BATCH3](<research/mfd-11/reports/MFD-11.2-SCHOLARLY-REVIEW-BATCH3.md>) |
| "Delivered ≠ Cleared": a clean licence validator run proves field completeness, not permission | [DATA-PROVENANCE.md](<docs/DATA-PROVENANCE.md>) |

The last row is the governing analogy for this whole specification: **delivered ≠ cleared**, and by extension **verified ≠ supported ≠ approved**.

---

## 2. Core Entity Relationships

```text
Source ──1:N──▶ Edition ──1:N──▶ ReferenceLocator
                                      ▲
QuranVerse ◀──N:1── EvidenceRecord ───┘
                        │  │
         append-only    │  └──N:M via ClaimSupport──▶ ScholarlyClaim
         VerificationRecord                                  │
                                                             ▼
                                              ReviewDecision (append-only)
                                                             │
                                              DisagreementSet (optional)
```

### 2.1 Separation principle

| Concern | Entity | Actor | Mutability |
|---|---|---|---|
| What the text says / where it is | EvidenceRecord + VerificationRecord | pipeline, then human verifier | EvidenceRecord fields mutable; verification history append-only |
| What the text means for a claim | ScholarlyClaim + ClaimSupport | scholar / editorial team | versioned; supersession chain |
| Whether the programme accepts it | ReviewDecision | authorised reviewer | strictly append-only |
| That scholars genuinely differ | DisagreementSet | designated reviewer | append-only |

---

## 3. EvidenceRecord (extended)

Base fields are inherited unchanged from MFD-12-CANONICAL-DATA-MODEL §4N (`id`, `verseId`, `excerpt`, `wordPositions`, `evidenceClass`, `rationale`, `claimId`, `sourceIds`, `verifiedAgainstCorpus`, `corpusVersion`, `createdBy`, `createdAt`, `schemaVersion`). WS4 adds:

| Field | Type | Required | Description |
|---|---|---|---|
| `evidenceKind` | enum | ✅ | `QURAN_VERSE` \| `TAFSIR_PASSAGE` \| `HADITH_REPORT` \| `LEXICON_ENTRY` \| `FIQH_RULING` \| `MODERN_ARGUMENT`. Determines which locator rules apply. |
| `verificationState` | enum | ✅ | Lifecycle state, §4. Derived from the latest VerificationRecord; never hand-edited. |
| `citation` | ReferenceLocator | conditional | Required when `evidenceKind ≠ QURAN_VERSE`. Structured locator per SOURCE-REGISTRY-SPEC §4. |
| `quotedText` | string | ❌ | Verbatim quotation from the cited non-Quranic source, in its original language. Distinct from `excerpt`, which is always corpus Arabic. |
| `quotedTranslation` | object | ❌ | `{ text, translator, language, sourceEditionId }`. Never presented as the source's own words. |
| `rightsAtUse` | enum | ✅ | Snapshot of effective rights at attach time (see SOURCE-REGISTRY-SPEC §5). Re-evaluated on rights change. |
| `displayPolicy` | enum | ✅ | `FULL` \| `EXCERPT_ONLY` \| `CITATION_ONLY` \| `BLOCKED`. Computed from rights, never authored directly. |
| `contentVersion` | integer | ✅ | Monotonic revision counter, consistent with other mutable entities. |

**Invariant E1.** `excerpt` MUST be a verbatim substring of `QuranVerse.textArabic` at `verseId` under `corpusVersion`. This is the existing MFD-11 mechanical rule, preserved.

**Invariant E2.** `quotedText` MUST NOT be substituted for `excerpt`. Quranic text and exegetical text occupy different fields so that a UI can never render tafsir as revelation.

**Invariant E3.** An EvidenceRecord may exist with no `claimId` (WS1 §6.4). Evidence gathering precedes claim formulation.

---

## 4. Evidence Verification Lifecycle

### 4.1 States

```text
NOT_ATTACHED
   │ attach reference
   ▼
SOURCE_IDENTIFIED ──────────────► UNAVAILABLE  (source/edition cannot be obtained)
   │ extract + locate                ▲
   ▼                                 │ cannot locate
REFERENCE_PENDING_VERIFICATION ──────┘
   │ confirm against edition/corpus
   ▼
VERIFIED ──► RIGHTS_RESTRICTED  (rights audit blocks display)
   │              │ clearance
   │              └──► VERIFIED
   └──► REJECTED  (terminal: citation invalid / fabricated / misattributed)
```

### 4.2 Transition table

| From | To | Trigger | Authority | Reversible |
|---|---|---|---|---|
| NOT_ATTACHED | SOURCE_IDENTIFIED | verse key or source+locator recorded | editor / pipeline | yes |
| SOURCE_IDENTIFIED | REFERENCE_PENDING_VERIFICATION | excerpt/quote extracted, candidate match computed | pipeline | yes |
| SOURCE_IDENTIFIED | UNAVAILABLE | edition not held, not digitised, or not obtainable | verifier | yes (new edition) |
| REFERENCE_PENDING_VERIFICATION | VERIFIED | exact or documented-normalised match confirmed | verifier (human for non-Quranic) | via new record only |
| REFERENCE_PENDING_VERIFICATION | UNAVAILABLE | passage not found at cited location | verifier | yes |
| VERIFIED | RIGHTS_RESTRICTED | rights status resolves to restricted/disputed/unverified-for-display | rights reviewer | yes |
| RIGHTS_RESTRICTED | VERIFIED | rights clearance decision recorded | rights reviewer + ReviewDecision | yes |
| any non-terminal | REJECTED | citation invalid, misattributed, or fabricated | ReviewDecision `REJECT_EVIDENCE` | no |

**Critical constraint V1.** `VERIFIED` asserts only *documentary accuracy*: the text exists at the cited location in the cited edition. It carries **no** statement about claim support and **no** scholarly approval. UI strings must say "reference verified", never "verified evidence" without qualification.

**Critical constraint V2.** `RIGHTS_RESTRICTED` is orthogonal to truth. The record persists; only display/export is gated. A restricted record may still be cited bibliographically.

**Critical constraint V3.** `UNAVAILABLE` is not `REJECTED`. "We could not obtain the edition" must never be rendered as "the citation is wrong" — BATCH7 shows how easily absence is misread as failure.

### 4.3 VerificationRecord (append-only)

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/verification-record",
  "title": "MFD-12 Evidence Verification Record (append-only)",
  "type": "object",
  "required": ["id", "evidenceRecordId", "fromState", "toState", "method", "performedBy", "performedAt", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^vr-[0-9a-f-]{36}$" },
    "evidenceRecordId": { "type": "string", "pattern": "^ev-[0-9a-f-]{36}$" },
    "fromState": { "enum": ["NOT_ATTACHED","SOURCE_IDENTIFIED","REFERENCE_PENDING_VERIFICATION","VERIFIED","UNAVAILABLE","RIGHTS_RESTRICTED"] },
    "toState": { "enum": ["SOURCE_IDENTIFIED","REFERENCE_PENDING_VERIFICATION","VERIFIED","UNAVAILABLE","RIGHTS_RESTRICTED","REJECTED"] },
    "method": { "enum": ["automated-corpus-match","manual-visual-inspection","cross-edition-collation","printed-edition-check","rights-audit","scholarly-confirmation"] },
    "performerRole": { "enum": ["AUTOMATED","EDITOR","VERIFIER","SCHOLAR","RIGHTS_REVIEWER"] },
    "corpusVersion": { "type": "string" },
    "editionId": { "type": "string", "description": "Edition actually consulted, when non-Quranic." },
    "locatorChecked": { "type": "object", "description": "The exact locator inspected." },
    "matchConfidence": { "enum": ["EXACT","NORMALIZED_MATCH","PARTIAL","FAILED"] },
    "normalizationProfile": { "type": "string", "description": "Named profile used for NORMALIZED_MATCH; see §4.4." },
    "failureReason": { "type": "string", "description": "Required for UNAVAILABLE, REJECTED, RIGHTS_RESTRICTED." },
    "decisionRef": { "type": "string", "description": "ReviewDecision.id when the transition is governance-driven." },
    "priorVerificationId": { "type": "string", "description": "Set when correcting an earlier verification." },
    "performedBy": { "type": "string" },
    "performedAt": { "type": "string", "format": "date-time" },
    "notes": { "type": "string" },
    "schemaVersion": { "type": "string" }
  }
}
```

VerificationRecords are append-only. A mistaken verification is corrected by appending a new transition with `priorVerificationId`, never by editing or deleting. `EvidenceRecord.verificationState` is a **projection** of the newest record — a cache, not an independent truth.

### 4.4 Normalisation profiles

To keep matching deterministic and auditable, normalisation is named, not ad hoc:

| Profile | Transformations | Permitted for |
|---|---|---|
| `exact` | none | final `VERIFIED` on Quranic `excerpt` |
| `diacritic-insensitive` | strip tashkīl, tatwīl | candidate retrieval only |
| `orthographic-fold` | alif variants → ا, ى → ي, ة → ه | candidate retrieval only |
| `punctuation-fold` | strip waqf marks, verse numerals | printed-edition collation |

**Rule N1.** A Quranic `excerpt` reaches `VERIFIED` only under `exact`. Any other profile yields at most `REFERENCE_PENDING_VERIFICATION` with `matchConfidence: NORMALIZED_MATCH`, requiring human confirmation. This mirrors the existing tafsir-search behaviour (literal substring after Arabic normalisation) while refusing to let normalisation silently certify a quotation.

---

## 5. Claim-Support Relationships

### 5.1 Why a separate entity

Verification asks: *does 9:60 enumerate eight categories?* Support asks: *does 2:215 support the claim "zakat has eight recipient categories"?* BATCH3 answers the second question negatively for 2:215 while confirming the verse is correctly quoted — proof that the two axes vary independently.

### 5.2 ClaimSupport schema

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/claim-support",
  "title": "MFD-12 Claim-Support Assessment",
  "type": "object",
  "required": ["id","claimId","evidenceRecordId","supportOutcome","assertedBy","assertedByRole","assertedAt","schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^cs-[0-9a-f-]{36}$" },
    "claimId": { "type": "string", "pattern": "^claim-[0-9a-f-]{36}$" },
    "evidenceRecordId": { "type": "string", "pattern": "^ev-[0-9a-f-]{36}$" },
    "supportOutcome": { "enum": ["SUPPORTS","PARTIALLY_SUPPORTS","DOES_NOT_SUPPORT","CONTRADICTS","NOT_ASSESSED"] },
    "reasoning": { "type": "string", "minLength": 1 },
    "qualification": { "type": "string", "description": "Conditions under which support holds." },
    "scopeLimit": { "enum": ["NONE","CONTEXT_BOUND","SENSE_BOUND","AUDIENCE_BOUND","TIME_BOUND"] },
    "tradition": { "type": "string", "description": "Madhhab / interpretive school when assessment is tradition-specific." },
    "assertedBy": { "type": "string" },
    "assertedByRole": { "enum": ["AI_ASSISTED","EDITOR","SCHOLAR","PEER_REVIEWER"] },
    "assertedAt": { "type": "string", "format": "date-time" },
    "supersedesId": { "type": "string", "description": "Prior ClaimSupport this replaces; prior record is retained." },
    "decisionRef": { "type": "string", "description": "ReviewDecision recording this assessment, if reviewed." },
    "schemaVersion": { "type": "string" }
  }
}
```

**Rule S1.** `reasoning` is required for every outcome except `NOT_ASSESSED`.

**Rule S2.** Every AI-generated link is created as `NOT_ASSESSED` with `assertedByRole: AI_ASSISTED`. This is the direct successor of `proposedBy: "ai-assisted"` in the MFD-11 candidate schema.

**Rule S3.** A ClaimSupport whose `evidenceRecordId` is not `VERIFIED` may be recorded, but MUST be surfaced as provisional and can never contribute to an approval quorum.

### 5.3 Outcome semantics with repository examples

| Outcome | Definition | Example grounded in the batch reviews |
|---|---|---|
| `SUPPORTS` | Directly and sufficiently grounds the claim | 9:60 → "zakat has eight recipient categories" (BATCH3: exhaustive closed enumeration, *farīḍah*) |
| `PARTIALLY_SUPPORTS` | Contributes but insufficient alone, or supports one aspect only | 2:177 → same claim (overlapping beneficiaries in a *birr* context, not the zakāt asnāf) |
| `DOES_NOT_SUPPORT` | Verified but irrelevant to the claim as worded | 2:215 → "these are the zakāt categories" (voluntary *infāq*, four of eight absent) |
| `CONTRADICTS` | Actively undermines the claim as worded | 47:35 → an unqualified "always seek peace first" reading of 8:61 (BATCH7 treats it as the necessary qualifier) |
| `NOT_ASSESSED` | Linked, no judgment yet | every current `pending-scholarly-review` mapping |

### 5.4 Aggregation is advisory only

Computed roll-up for reviewer triage:

- any `CONTRADICTS` → flag `HAS_CONTRADICTION`, route to discussion, never auto-reject
- all `SUPPORTS` and all `VERIFIED` → `ELIGIBLE_FOR_APPROVAL_REVIEW`
- mixed `SUPPORTS` / `PARTIALLY_SUPPORTS` → `ELIGIBLE_WITH_QUALIFICATIONS`
- any `NOT_ASSESSED` → `INCOMPLETE_ASSESSMENT`
- any evidence not `VERIFIED` → `EVIDENCE_GAP`

**Rule S4.** No roll-up value changes `ScholarlyClaim.reviewStatus`. Only a ReviewDecision does. The roll-up is a queue-ordering hint, not a verdict — this is the structural defence against the false-consensus failure mode.

---

## 6. Scholarly Decision Integration

### 6.1 Base contract

ReviewDecision is defined in MFD-12-CANONICAL-DATA-MODEL §4P and MFD-12-DATA-DICTIONARY §3.16: `id`, `targetEntityType`, `targetEntityId`, `decision`, `rationale`, `reviewerId`, `reviewerRole`, `priorDecisionId`, `evidenceIds`, `decidedAt`, `schemaVersion`. It is **append-only**; corrections create a new decision referencing the prior one. WS4 does not weaken any of that.

### 6.2 WS4 additions (additive, optional unless noted)

| Field | Type | Required | Description |
|---|---|---|---|
| `reviewScope` | enum | ✅ | `TECHNICAL` \| `RIGHTS` \| `SCHOLARLY` \| `TAXONOMIC`. Makes the technical/scholarly boundary explicit in the record itself. |
| `targetContentVersion` | integer | ✅ for SCHOLARLY | The exact claim/evidence revision reviewed. Prevents an approval silently covering later edits. |
| `dispositionDetail` | enum | ❌ | `RETAIN` \| `MERGE` \| `RECLASSIFY` \| `SPLIT` \| `DEFER` — the vocabulary already used in BATCH1–7. |
| `mergeIntoId` | string | conditional | Required when `dispositionDetail: MERGE`. |
| `openQuestions` | array\<string\> | ❌ | Carries forward the "Scholarly Review Questions" sections of the batch reports as data instead of prose. |
| `tradition` | string | ❌ | School/tradition the decision speaks from; required for decisions inside a DisagreementSet. |
| `dissentRefs` | array\<string\> | ❌ | Other ReviewDecision ids expressing dissent, kept visible. |
| `signature` | object | ❌ | `{ method, value }` for reviewer attestation; method may be `recorded-manual` until an identity system exists. |

### 6.3 Decision vocabulary by scope

| reviewScope | Permitted decisions |
|---|---|
| TECHNICAL | `APPROVE` (well-formedness only), `REQUEST_REVISION`, `REJECT`, `DEFER` |
| RIGHTS | `APPROVE` (clearance), `REJECT` (blocked), `FLAG_FOR_DISCUSSION`, `DEFER` |
| SCHOLARLY | `APPROVE`, `REQUEST_REVISION`, `REJECT`, `FLAG_FOR_DISCUSSION`, `SUPERSEDE`, `ENDORSE`, `DEFER` |
| TAXONOMIC | `APPROVE` + `dispositionDetail`, `REQUEST_REVISION`, `FLAG_FOR_DISCUSSION`, `DEFER` |

**Rule D1.** A `TECHNICAL` `APPROVE` can never satisfy a scholarly gate. Publication requires at least one `SCHOLARLY` `APPROVE` whose `targetContentVersion` equals the current `contentVersion`.

**Rule D2.** `reviewerRole: AUTOMATED` is legal only with `reviewScope: TECHNICAL`. Encoding this prevents an agent from minting scholarly approvals — the same protection the MFD-11 candidate schema achieved by hard-coding `reviewStatus`.

**Rule D3.** Editing a claim increments `contentVersion`, which invalidates the effective scholarly approval for display purposes and returns the item to `PENDING_SCHOLARLY_REVIEW`. Prior decisions remain intact and auditable.

### 6.4 Supersession mechanics

```text
rev-A  APPROVE   claim-001 v1   2026-01-15   (retained forever)
  ▲ priorDecisionId
rev-B  SUPERSEDE claim-001 v1   2026-06-20   rationale: new manuscript evidence
  ▲ priorDecisionId
rev-C  REQUEST_REVISION claim-001 v2 2026-09-01
```

Effective decision = latest decision in the chain for the target at the current contentVersion. Rules:

1. `priorDecisionId` MUST reference an existing decision for the **same** target entity.
2. Chains MUST be acyclic; a decision may be superseded by at most one *effective* successor (later siblings are dissents, not replacements).
3. Nothing is deleted. Audit views render the full chain including superseded nodes.
4. `SUPERSEDE` requires a non-empty `rationale`; "replaced" without a reason is invalid.

### 6.5 Technical review vs scholarly approval

| Dimension | Technical | Scholarly |
|---|---|---|
| Question | Is the record well-formed and the citation locatable? | Is the interpretation sound? |
| Actor | pipeline / developer / verifier | qualified scholar |
| Output | validation result, VerificationRecord | ReviewDecision (`reviewScope: SCHOLARLY`) |
| Re-run | idempotent, repeatable | new decision required |
| Repository precedent | `validate-source-licenses.mjs` = field completeness, not permission | batch reports' dispositions and open questions |

---

## 7. Disagreement Representation

### 7.1 Prohibitions

The system MUST NOT: average competing positions into a synthetic consensus; silently prefer one madhhab; hide a minority view behind a majority label; delete one side of a contradiction; or let an AI roll-up resolve a genuine dispute.

### 7.2 Mechanisms

**(a) Coexisting claims.** Multiple ScholarlyClaims may share a `subjectEntityId`, each with its own evidence, ClaimSupport assessments, tradition, and ReviewDecisions. Neither subsumes the other. This generalises WS1 §6.2 (multiple RootAnalysis per LexicalEntry, `rootDisputed: true`) from morphology to interpretation.

**(b) `alternativeViews` on a claim.** Retained from §4O for lightweight cases where one position is primary and others are noted.

**(c) DisagreementSet** — first-class record when the divergence is itself the finding:

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/disagreement-set",
  "title": "MFD-12 Scholarly Disagreement Set (append-only)",
  "type": "object",
  "required": ["id","subjectEntityId","claimIds","disagreementType","isGenuine","documentedBy","documentedAt","schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^dis-[0-9a-f-]{36}$" },
    "subjectEntityId": { "type": "string" },
    "claimIds": { "type": "array", "minItems": 2, "items": { "type": "string" } },
    "disagreementType": { "enum": ["INTERPRETIVE","TEXTUAL","JURISPRUDENTIAL","HISTORICAL","TAXONOMIC","LEXICAL"] },
    "traditions": { "type": "array", "items": { "type": "string" } },
    "isGenuine": { "type": "boolean", "description": "true = recognised scholarly ikhtilāf; false = apparent conflict from wording/scope error." },
    "apparentCause": { "type": "string", "description": "Required when isGenuine=false: e.g. sense conflation, scope mismatch." },
    "resolutionPolicy": { "const": "NO_AUTOMATED_RESOLUTION" },
    "decisionRefs": { "type": "array", "items": { "type": "string" } },
    "documentedBy": { "type": "string" },
    "documentedAt": { "type": "string", "format": "date-time" },
    "schemaVersion": { "type": "string" }
  }
}
```

The `isGenuine` flag is the important distinction. BATCH2's ḥikmah finding is an **apparent** conflict caused by sense conflation (revealed corpus vs daʿwah method vs judicial discernment) — remediable by splitting senses. Ashʿarī/Atharī attribute theology is a **genuine** ikhtilāf — not remediable, and any attempt to merge it would be a fabrication. Both need representation; only one may be "fixed".

### 7.3 Display rules

1. Every position holding a current `SCHOLARLY APPROVE` or `ENDORSE` is displayed.
2. Rejected positions leave end-user display but remain in the data layer and audit views.
3. Ordering is neutral (chronological or transliteration-alphabetical); no strength ranking, no "primary" badge inside a genuine disagreement set.
4. Each position is labelled with proponent/tradition and its own citations.
5. The UI states "Scholars differ on this point" and links each position's evidence; it never renders a merged summary.
6. Where `isGenuine: false`, the UI may explain the sense distinction, but the explanation is itself a claim requiring review.

---

## 8. Migration from MFD-11 (non-destructive)

### 8.1 evidence-link → EvidenceRecord

| MFD-11 field | MFD-12 destination | Note |
|---|---|---|
| `key` | `verseId` | identical `surah:ayah` pattern |
| `excerpt` | `excerpt` | unchanged, still exact-substring checked |
| `evidenceClass` | `evidenceClass` | `EXPLICIT_TEXT` / `THEMATIC` / `CONTEXTUAL` preserved verbatim |
| `rationale` | split: linking rationale stays on EvidenceRecord; claim-level argument becomes `ClaimSupport.reasoning` | the split is the whole point of §5 |
| — | `verificationState`, `evidenceKind`, `rightsAtUse`, `displayPolicy`, `contentVersion` | new |

### 8.2 topic-candidate → ScholarlyClaim + Topic proposal

`definitionStatus: "editorial-draft"` maps to a claim with `reviewStatus: DRAFT`; `proposedBy: "ai-assisted"` maps to `assertedByRole: AI_ASSISTED` on its ClaimSupport rows; `reviewStatus: "pending-scholarly-review"` maps to `PENDING_SCHOLARLY_REVIEW` with zero scholarly decisions. Inline `evidence[]` is externalised to independent EvidenceRecords so one verse can serve many claims.

### 8.3 topic-ayah-mappings → EvidenceRecord + ClaimSupport

| Current value | MFD-12 reading |
|---|---|
| `status: "MAPPED"` | evidence attached; `verificationState ≥ SOURCE_IDENTIFIED` |
| `provenance: "pending-scholarly-review"` | no `SCHOLARLY APPROVE` decision exists |
| `mappingType: DIRECT_REFERENCE` | candidate `evidenceClass: EXPLICIT_TEXT`, subject to verification |
| `mappingType: THEMATIC_REFERENCE` | candidate `evidenceClass: THEMATIC` |
| `sourceIds: ["quran-json"]` | registry `src-quran-json`, edition `ed-v3-1-2` |

Note the vocabulary drift already present in production: mapping files use `DIRECT_REFERENCE` / `THEMATIC_REFERENCE`, the data dictionary uses `DIRECT_REFERENCE` / `THEMATIC` / `CONTEXTUAL`, and the batch reports also use `EXPLICIT_INSTRUCTION` and `PROPHETIC_NARRATIVE`. **Recommendation:** keep `evidenceClass` as the single canonical three-value axis and record instruction/narrative flavour as a separate optional `passageFunction` field, rather than widening `evidenceClass`. This is flagged for WS1 arbitration (§10).

No production file is touched by this specification. All migration is described, not performed.

---

## 9. Entities Defined and Key Decisions

### 9.1 Entities

| Entity | ID | Purpose | Mutability |
|---|---|---|---|
| EvidenceRecord (extended) | `ev-{uuid}` | typed, located, rights-aware evidence item | mutable, versioned |
| VerificationRecord | `vr-{uuid}` | one lifecycle transition | append-only |
| ClaimSupport | `cs-{uuid}` | support judgment linking evidence to claim | versioned via `supersedesId` |
| DisagreementSet | `dis-{uuid}` | genuine vs apparent divergence | append-only |
| ScholarlyClaim (WS1, extended here) | `claim-{uuid}` | interpretive assertion | mutable, versioned |
| ReviewDecision (WS1, extended here) | `rev-{uuid}` | governance action with `reviewScope` | append-only |

### 9.2 Key design decisions

1. **Three independent axes.** Verification, support, and approval are separate entities with separate actors. No axis implies another.
2. **Support is an edge, not a boolean.** `ClaimSupport` carries outcome, reasoning, qualification, scope limit, and tradition — enough to express BATCH3's "correct verse, wrong claim" nuance.
3. **Append-only verification too.** Even mechanical checks get an immutable log; corrections append with `priorVerificationId`.
4. **Rights gate presentation, not existence.** `RIGHTS_RESTRICTED` suppresses display/export while preserving the scholarly record and its citation.
5. **Normalisation cannot certify.** Named profiles; only `exact` reaches `VERIFIED` for Quranic excerpts.
6. **`reviewScope` on every decision.** Structural barrier against technical validation masquerading as scholarly approval; `AUTOMATED` reviewers are confined to `TECHNICAL`.
7. **Approvals are version-pinned.** `targetContentVersion` stops an old approval from covering new text.
8. **Genuine vs apparent disagreement.** `isGenuine` lets the system repair sense conflation while refusing to arbitrate real ikhtilāf.
9. **Roll-ups are advisory.** Aggregation orders queues; only humans approve.
10. **Batch-report prose becomes data.** Dispositions and open questions move from Markdown into `dispositionDetail` and `openQuestions`, so review work is queryable and resumable.

---

## 10. Unresolved Questions

1. **Hadith granularity.** Does hadith evidence need isnād chains, per-muhaddith grading, and matn variants as first-class fields, or a separate HadithEvidence entity? Deferred with WS1 §7 q3; `evidenceKind: HADITH_REPORT` reserves the slot.
2. **Cumulative weight across source types.** When Qur'an, hadith, and tafsir all bear on a claim, is there a structured weighting model, or does it remain reviewer narrative? Current design keeps it narrative to avoid inventing a scoring authority.
3. **`evidenceClass` vocabulary drift.** Three competing vocabularies exist (§8.3). Needs WS1 arbitration before any migration; recommendation is a separate `passageFunction` axis.
4. **Corpus re-pin semantics.** On `quran-json@3.1.2` → next pin, do all `VERIFIED` records revert to `REFERENCE_PENDING_VERIFICATION` automatically, or is a diff-scoped re-verification acceptable? Auto-revert is safest but expensive.
5. **ClaimSupport mutability.** Versioned-with-supersession (current) vs strictly append-only like ReviewDecision. Argument for append-only: support judgments are scholarly acts too.
6. **DisagreementSet authorisation.** Who may declare a disagreement genuine? Fabricating ikhtilāf is as harmful as suppressing it; a meta-reviewer role may be needed.
7. **Rights snapshot staleness.** `rightsAtUse` is a snapshot; what event forces re-evaluation across all affected evidence, and who owns that sweep?
8. **Reviewer identity.** No scholar identity/credential system exists. Until it does, `reviewerId` is an opaque string and `signature.method` is `recorded-manual` — meaning scholarly approval is only as trustworthy as the intake process around it.
