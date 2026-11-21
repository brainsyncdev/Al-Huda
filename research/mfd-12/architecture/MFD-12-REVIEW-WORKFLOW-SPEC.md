# MFD-12 Scholarly Review Lifecycle and Decision Model

**Status:** Design Proposal (research only — no production schema or data modified)  
**Module:** WS4 — Tafsir & Evidence Integration  
**Date:** 2026-11-21  
**Extends:** MFD-12-CANONICAL-DATA-MODEL §4P, §6.3; MFD-12-DATA-DICTIONARY §3.16, ReviewDecisionEnum  
**Depends on:** MFD-12-EVIDENCE-MODEL, MFD-12-SOURCE-REGISTRY-SPEC

---

## 1. Purpose

This specification defines the scholarly review lifecycle for the FAHM Knowledge Architecture. It formalises the workflow patterns already demonstrated in MFD-11.2 BATCH1–7 into a machine-representable, append-only governance model.

The central thesis, drawn directly from the batch reviews: **technical review is not scholarly approval, evidence verification is not claim support, and editorial disposition is not theological endorsement.** Each requires its own actor, its own record, and its own gate.

### 1.1 What the batch reviews proved

| Pattern observed | Batch | Implication for this spec |
|---|---|---|
| Every mapping carries `provenance: "pending-scholarly-review"` regardless of how well-formed it is | 1–7 | A structural state, not a temporary flag; the system must represent "never reviewed" as a first-class condition |
| Dispositions are RETAIN, MERGE, RECLASSIFY, SPLIT, DEFER — not just approve/reject | 1 (MERGE), 2 (MERGE), 3 (RETAIN), 7 (RETAIN implied) | The decision vocabulary must include taxonomic operations, not only binary verdicts |
| Every review ends with open questions, not closed answers | 1 (§6), 2 (§6), 3 (§6), 7 | Questions are data to be carried forward, not prose to be filed away |
| Strong Qur'anic grounding does not prevent a MERGE recommendation when the topic imposes an alien framework | 1 (tawheed-evidence: all contextual, MERGE), 2 (prophetic-wisdom: 3/4 explicit ḥikmah, still MERGE) | Grounding quality and taxonomic validity are independent axes |
| A single explicit verse can justify standalone status against dimensional pressure to merge | 3 (zakat-recipients: 9:60 alone justifies RETAIN) | The model needs a way to record *why* a topic survived merge pressure |
| Apparent contradictions may be scope/sense errors rather than genuine ikhtilāf | 2 (ḥikmah as revealed corpus vs daʿwah method vs judicial discernment) | Disagreement classification must distinguish genuine divergence from conflation |
| Missing verses matter as much as mapped ones | 7 (peace-agreements: 4:90, 17:34, 16:92, 2:208 absent despite direct relevance) | Review completeness is itself a reviewable property |

---

## 2. Review Scope Taxonomy

Every ReviewDecision carries a `reviewScope` that determines what it can and cannot do. This is the structural enforcement of the separation the batch reports perform manually.

| Scope | Question answered | Permitted actors (`reviewerRole`) | Can change publication status? |
|---|---|---|---|
| `TECHNICAL` | Is the record well-formed, parseable, and structurally valid? | `AUTOMATED`, `EDITOR` | No |
| `RIGHTS` | May this content be displayed, exported, or cited under applicable law/policy? | `RIGHTS_REVIEWER`, `EDITOR` | Blocks display if negative; does not approve content |
| `SCHOLARLY` | Is the interpretation sound, the citation accurate in context, and the reasoning valid? | `SCHOLAR`, `PEER_REVIEWER` | Yes — required for publication |
| `TAXONOMIC` | Does this entity belong in this position in the hierarchy? Is it distinct from siblings? | `SCHOLAR`, `EDITOR`, `PEER_REVIEWER` | Yes — governs topic structure |

**Rule R1.** A `TECHNICAL` approval satisfies zero scholarly gates. The existing `validate-source-licenses.mjs` (field-completeness check, not rights determination per DATA-PROVENANCE.md) is the canonical example of a TECHNICAL review that must never be rendered as clearance.

**Rule R2.** `AUTOMATED` reviewers may issue decisions only within `TECHNICAL` scope. This prevents AI pipelines from minting scholarly approvals — the same protection the MFD-11 candidate schema achieved by hard-coding `reviewStatus: "pending-scholarly-review"` and `proposedBy: "ai-assisted"`.

**Rule R3.** RIGHTS decisions gate *display*, not *existence*. A rights-blocked source remains in the registry for scholarly reference; its `displayPolicy` becomes `BLOCKED` or `CITATION_ONLY` per MFD-12-SOURCE-REGISTRY-SPEC §5.4.

---

## 3. Entity Review Status Lifecycle

All mutable entities carry a `reviewStatus` field using the standard enum from MFD-12-CANONICAL-DATA-MODEL §6:

```
DRAFT → PENDING_SCHOLARLY_REVIEW → APPROVED
                                   ↕
                              REVISED (re-enters PENDING after edit)
                                   ↓
                              DEPRECATED (terminal removal from active use)

Any non-terminal state → FLAG_FOR_DISCUSSION (parallel track, not sequential)
```

### 3.1 State definitions

| State | Meaning | How entered | How exited |
|---|---|---|---|
| `DRAFT` | Created but not submitted for review | Initial creation by editor/AI | Submission triggers transition |
| `PENDING_SCHOLARLY_REVIEW` | Submitted; awaiting qualified reviewer | Explicit submission or post-REVISION resubmission | SCHOLARLY ReviewDecision |
| `APPROVED` | Meets scholarly standards for current version | SCHOLARLY APPROVE decision at matching `targetContentVersion` | Content edit (→ REVISED → PENDING) or SUPERSEDE decision |
| `REVISED` | Previously approved content was edited | Any mutation to an APPROVED entity | Resubmission → PENDING |
| `DEPRECATED` | Withdrawn from active use; retained for audit | SCHOLARLY REJECT or editorial deprecation decision | Terminal (data preserved, excluded from queries) |
| `FLAG_FOR_DISCUSSION` | Requires multi-scholar consultation before decision | FLAG_FOR_DISCUSSION decision | New decision resolving the flag |

### 3.2 Version-pinned approval

Per MFD-12-EVIDENCE-MODEL §6.3 Rule D3: a SCHOLARLY APPROVE decision records `targetContentVersion`. If the entity is subsequently edited, `contentVersion` increments and the prior approval no longer covers the current text. The entity returns to `PENDING_SCHOLARLY_REVIEW` automatically.

This prevents the silent drift problem: a reviewer approved version 3, someone edits to version 4, and the UI still shows "approved" because the old decision was never invalidated. Under this model, the effective approval query is:

```text
effectiveApproval(entityId) = latest ReviewDecision
  WHERE targetEntityId = entityId
    AND reviewScope = 'SCHOLARLY'
    AND decision IN ('APPROVE', 'ENDORSE')
    AND targetContentVersion = entity.currentContentVersion
    AND NOT superseded
```

If no such decision exists, the entity is not approved for display regardless of historical decisions.

---

## 4. Review Workflow Phases

### 4.1 Phase 1: Intake and Technical Validation

**Actor:** Automated pipeline / Editor  
**Scope:** TECHNICAL

1. Entity created (by AI extraction, editorial drafting, or scholar submission)
2. Schema validation runs (JSON Schema conformance, required fields present)
3. Corpus match verification for Quranic excerpts (automated-corpus-match per EVIDENCE-MODEL §4)
4. Source registry lookup for cited sources (edition exists, locator scheme matches)
5. TECHNICAL ReviewDecision recorded: APPROVE (well-formed) or REQUEST_REVISION (malformed)

**Output:** Entity passes technical gate. `reviewStatus` transitions from `DRAFT` to `PENDING_SCHOLARLY_REVIEW` if technically approved.

**Repository precedent:** `scripts/validate-quran-data.mjs` (structural scan), `scripts/validate-source-licenses.mjs` (field completeness). Both are TECHNICAL. Neither constitutes scholarly review.

### 4.2 Phase 2: Rights Assessment

**Actor:** Rights reviewer / Legal counsel  
**Scope:** RIGHTS

1. For each Source/Edition referenced, evaluate `rightsStatus` per SOURCE-REGISTRY-SPEC §5
2. Determine `displayConstraints` (in-app text, export, excerpt limits, link-out-only)
3. Record RIGHTS ReviewDecision
4. If `rights-unverified`: default to safe mode (`linkOutOnly: true`, `exportAllowed: false`) per SOURCE-REGISTRY-SPEC §5.4
5. If `rights-disputed`: block display pending resolution

**Output:** Each EvidenceRecord receives `rightsAtUse` snapshot and `displayPolicy` computation.

**Critical note from DATA-PROVENANCE.md:** "A clean validate:licenses run means every source record carries the fields the validator checks; it says nothing about permission." This specification preserves that distinction structurally: RIGHTS scope is separate from TECHNICAL scope, and field completeness (TECHNICAL) never implies clearance (RIGHTS).

### 4.3 Phase 3: Scholarly Review

**Actor:** Qualified Islamic scholar(s)  
**Scope:** SCHOLARLY

This is the core phase. It evaluates:

1. **Qur'anic grounding strength**: Are the cited verses actually relevant? (BATCH1 found tawheed-evidence's verses were rububiyyah material reframed through kalām epistemology; BATCH3 found zakat-recipients had one exhaustively explicit verse)
2. **Semantic integrity**: Do the labels impose frameworks the Qur'an doesn't use? (BATCH2 found "prophetic wisdom" unified a polyvalent term artificially)
3. **Epistemic provenance**: Is this Qur'anic self-description or later scholarly taxonomy? (BATCH1 distinguished āyāt from adillah; BATCH7 noted "peace agreements" carries modern diplomatic connotations)
4. **Claim-support alignment**: Does verified evidence actually support the specific claim worded? (BATCH3 showed 2:177 and 2:215 are charity verses, not zakāt-asnāf legislation)
5. **Completeness**: Are critical verses missing? (BATCH7 identified 4:90, 17:34, 16:92, 2:208 as unmapped despite direct relevance)

**Decision outcomes:**

| Decision | When used | Effect |
|---|---|---|
| `APPROVE` | Claim/evidence meets scholarly standards | Sets `reviewStatus: APPROVED` at current `contentVersion` |
| `REQUEST_REVISION` | Salvageable but needs changes | Returns to `PENDING_SCHOLARLY_REVIEW` after revision |
| `REJECT` | Fundamentally unsound | Sets `reviewStatus: DEPRECATED`; evidence moves to `REJECTED` state |
| `FLAG_FOR_DISCUSSION` | Requires multi-scholar consultation | Enters discussion queue; no status change until resolved |
| `DEFER` | Insufficient information in current cycle | Remains `PENDING_SCHOLARLY_REVIEW`; scheduled for future batch |
| `ENDORSE` | Affirms another reviewer's APPROVE | Adds supporting weight; does not independently approve |
| `SUPERSEDE` | Replaces a prior decision | Links via `priorDecisionId`; old decision preserved |

### 4.4 Phase 4: Taxonomic Disposition

**Actor:** Scholar + Editorial team  
**Scope:** TAXONOMIC

Taxonomic disposition is a distinct operation from scholarly approval. A topic can be perfectly grounded in the Qur'an yet taxonomically redundant (BATCH1's tawheed-evidence), or semantically problematic yet containing genuinely valuable mappings that need relocation (BATCH2's prophetic-wisdom).

**Disposition vocabulary** (derived from BATCH1–7 practice):

| Disposition | Definition | Batch precedent |
|---|---|---|
| `RETAIN` | Topic stands as-is in current position | BATCH3 (zakat-recipients) |
| `MERGE` | Absorb into another topic; remove standalone node | BATCH1 (tawheed-evidence → tawheed-rububiyyah), BATCH2 (prophetic-wisdom → hikmah-wisdom) |
| `RECLASSIFY` | Move to different dimension/domain without merging | BATCH1 alternative recommendation |
| `SPLIT` | Divide into multiple topics along sense/context boundaries | Implied by BATCH2's finding that ḥikmah has 4+ distinct senses |
| `DEFER` | Insufficient information for taxonomic decision | General |

**Rule T1.** MERGE requires `mergeIntoId` pointing to the absorbing topic. All EvidenceRecords and ClaimSupport assessments transfer to the target. The merged topic is DEPRECATED, not deleted.

**Rule T2.** SPLIT creates new topics, each inheriting the subset of evidence/claims relevant to its scope. The original is DEPRECATED. Each new topic enters DRAFT → PENDING_SCHOLARLY_REVIEW independently.

**Rule T3.** Taxonomic decisions require both SCHOLARLY and TAXONOMIC scope ReviewDecisions. A scholar approves the content; the editorial team (or scholar) approves the placement. Neither alone suffices for publication.

---

## 5. Append-Only Decision Chain Mechanics

### 5.1 Invariants

These invariants MUST be enforced at the storage layer (per MFD-12-CANONICAL-DATA-MODEL §7 q5):

1. **No UPDATE on ReviewDecision.** Once written, a record is immutable. Storage adapters must reject modification attempts.
2. **No DELETE on ReviewDecision.** Even erroneous decisions are preserved. Correction is via SUPERSEDE.
3. **`priorDecisionId` MUST reference an existing ReviewDecision for the same `targetEntityId`.** Cross-entity supersession is invalid.
4. **Supersession chains MUST be acyclic.** A → B → A is forbidden. Validate on insert.
5. **At most one effective (non-superseded) decision per target per scope at any time.** Multiple dissenting decisions are allowed but only one represents the current programme position.
6. **`SUPERSEDE` decision MUST have non-empty `rationale`.** Silent replacement is prohibited.

### 5.2 Chain traversal algorithm

To compute the effective decision for display/gating:

```text
function getEffectiveDecision(targetEntityId, reviewScope):
    // Get all decisions for this target and scope
    decisions = query(ReviewDecision)
        .where(targetEntityId = targetEntityId)
        .where(reviewScope = reviewScope)
        .orderBy(decidedAt DESC)
    
    // Find decisions that are NOT referenced as priorDecisionId by any other decision
    supersededIds = decisions.map(d => d.priorDecisionId).filter(Boolean)
    effectiveCandidates = decisions.filter(d => !supersededIds.includes(d.id))
    
    // For SCHOLARLY scope, also check contentVersion match
    if reviewScope == 'SCHOLARLY':
        currentVersion = getEntity(targetEntityId).contentVersion
        effectiveCandidates = effectiveCandidates.filter(
            d => d.targetContentVersion == currentVersion
        )
    
    // Return the most recent effective candidate
    return effectiveCandidates[0] ?? null
```

If `null`, no effective decision exists → entity remains in `PENDING_SCHOLARLY_REVIEW` (or `DRAFT`).

### 5.3 Audit view

The full chain is always available:

```text
rev-001  SCHOLARLY APPROVE   claim-001 v1  2026-01-15  scholar-A  "Sound interpretation"
  ▲ priorDecisionId
rev-007  SCHOLARLY SUPERSEDE claim-001 v1  2026-06-20  scholar-B  "New manuscript evidence"
  ▲ priorDecisionId
rev-012  SCHOLARLY REQUEST_REVISION claim-001 v2  2026-09-01  scholar-B  "Needs qualification"
```

All three records persist. The audit view renders them as a linked chain. The effective decision for display purposes is rev-012 (REQUEST_REVISION), meaning the claim is not currently approved despite having been approved in January.

---

## 6. Reviewer Roles and Qualifications

### 6.1 Role definitions

| Role | Authority | Limitations |
|---|---|---|
| `AUTOMATED` | TECHNICAL scope only | Cannot issue SCHOLARLY, RIGHTS, or TAXONOMIC decisions |
| `EDITOR` | TECHNICAL + TAXONOMIC scope | Cannot issue SCHOLARLY approval; can propose taxonomic dispositions |
| `VERIFIER` | TECHNICAL scope (verification-specific) | Confirms textual matches; does not assess meaning |
| `RIGHTS_REVIEWER` | RIGHTS scope | Assesses licensing/legal status; does not evaluate content |
| `SCHOLAR` | SCHOLARLY + TAXONOMIC scope | Full authority over interpretive and structural decisions |
| `PEER_REVIEWER` | SCHOLARLY scope (ENDORSE, FLAG_FOR_DISCUSSION) | Can affirm or question; cannot independently APPROVE without SCHOLAR co-sign |

### 6.2 Identity requirements

Each `reviewerId` must resolve to a registered identity record. Minimum metadata:

```jsonc
{
  "reviewerId": "sch-{slug}",
  "displayName": "string",
  "qualifications": ["string"],  // e.g., "Ijazah in Tafsir", "PhD Islamic Studies"
  "traditions": ["string"],       // e.g., "Hanafi", "Ash'ari" — for transparency, not ranking
  "activeFrom": "ISO 8601",
  "activeUntil": "ISO 8601 | null",
  "authorizedScopes": ["SCHOLARLY", "TAXONOMIC"]
}
```

**Unresolved:** The repository currently has no scholar identity system. Until one exists, `reviewerId` values are opaque strings and `signature.method` defaults to `recorded-manual`. This means scholarly approval is only as trustworthy as the intake process around it — a risk that should be documented in the UI.

---

## 7. Batch Review Operational Model

### 7.1 From prose to structured data

The MFD-11.2 batch reports (BATCH1–7) demonstrate a thorough review methodology but encode results as Markdown prose. MFD-12 formalises this into structured records:

| Batch report section | MFD-12 entity/field |
|---|---|
| "Conceptual Definition" analysis | ScholarlyClaim.statement + ClaimSupport.reasoning |
| "Qur'anic Grounding" table | EvidenceRecord[] + VerificationRecord[] |
| "Assessment" paragraphs | ClaimSupport.reasoning (per evidence-claim pair) |
| "Semantic Integrity" verdict | ClaimSupport.supportOutcome + reasoning |
| "Taxonomic Distinction" table | Relationship edges + DisagreementSet if genuine divergence |
| "Epistemic Provenance" | EvidenceRecord.evidenceKind + Source.sourceType |
| "Disposition" (RETAIN/MERGE/etc.) | ReviewDecision.dispositionDetail |
| "Rationale" | ReviewDecision.rationale |
| "Scholarly Review Questions" | ReviewDecision.openQuestions[] |

### 7.2 Batch execution protocol

1. **Selection:** Identify entities for review (e.g., all topics in a dimension, all candidates from an AI extraction run)
2. **Pre-computation:** Run TECHNICAL validation, generate evidence verification reports, compute overlap matrices
3. **Distribution:** Assign to qualified reviewers based on `authorizedScopes` and domain expertise
4. **Review:** Each reviewer examines pre-computed materials plus primary sources
5. **Decision recording:** Create ReviewDecision entities for each judgment
6. **Open question capture:** Record unresolved items as `openQuestions` array entries
7. **Integration:** Apply dispositions (MERGE, SPLIT, etc.) to taxonomy structure
8. **Publication gate check:** Verify all published entities have effective SCHOLARLY APPROVE at current version

### 7.3 Open questions as persistent data

Every batch report ends with "Scholarly Review Questions" — genuine uncertainties that the reviewer could not or should not resolve unilaterally. These are not footnotes; they are work items.

In MFD-12, they become `ReviewDecision.openQuestions[]`: structured, queryable, and linked to the decision that raised them. A future review cycle can address them explicitly rather than losing them in archived Markdown.

Example from BATCH1 §6:
```json
"openQuestions": [
  "Should the taxonomy distinguish between āyāt (Qur'anic signs) and adillah (scholarly proofs/evidence)?",
  "Is there a subset of verses that explicitly frame themselves as evidence for tawheed using dalīl/burhān/ḥujjah?",
  "Does reflection-tafakkur already absorb the epistemological function tawheed-evidence attempts to serve?"
]
```

These persist across review cycles until a decision explicitly resolves or defers them.

---

## 8. Publication Gates

An entity is eligible for end-user display only when ALL of the following conditions hold:

| Gate | Requirement | Enforcement |
|---|---|---|
| Technical | At least one TECHNICAL APPROVE at current schema version | Pipeline blocks malformed records |
| Rights | Effective RIGHTS decision is not BLOCKED; `displayPolicy ≠ BLOCKED` | UI filters by displayPolicy |
| Scholarly | Effective SCHOLARLY APPROVE or ENDORSE at current `contentVersion` | Query-time filter; no approval = not returned |
| Taxonomic | Effective TAXONOMIC decision places entity in active taxonomy (not DEPRECATED/MERGED-away) | Graph traversal excludes deprecated nodes |
| Evidence | All supporting EvidenceRecords have `verificationState ∈ {VERIFIED, RIGHTS_RESTRICTED}` | Claims with UNAVAILABLE/REJECTED evidence flagged |
| Support | No ClaimSupport with outcome CONTRADICTS is unresolved | Contradictions route to FLAG_FOR_DISCUSSION |

**Rule G1.** Failure at any gate blocks publication. Gates are conjunctive (AND), not disjunctive (OR).

**Rule G2.** Rights-restricted evidence (`RIGHTS_RESTRICTED`) does not block scholarly review — scholars can still assess claims using restricted sources — but it does block end-user display of the restricted content itself. Citation metadata may still appear.

**Rule G3.** A topic with some approved and some unapproved claims may display the approved claims while suppressing unapproved ones. Partial publication is permitted at the claim level, not forced to the topic level.

---

## 9. Integration with Existing Editorial Infrastructure

### 9.1 `content/editorial/reviews.json`

DATA-PROVENANCE.md describes this file as "a state record, not a per-event history." MFD-12 replaces it with the append-only ReviewDecision chain. Migration path:

1. Each current entry in `reviews.json` becomes an initial ReviewDecision (historical import)
2. New reviews go exclusively through the ReviewDecision entity
3. `reviews.json` becomes a derived projection (latest effective decisions) for backward compatibility, not a source of truth

### 9.2 `src/lib/quran/sources.ts`

The 13 source records map to the Source Registry (MFD-12-SOURCE-REGISTRY-SPEC §6). Their current `method: "package"` vs `method: "link"` distinction maps to `provenance.ingestionMethod` and `displayConstraints.linkOutOnly`.

### 9.3 `provenance: "pending-scholarly-review"`

This string appears throughout `topic-ayah-mappings.json` (11,048 lines). Under MFD-12, it is interpreted as: "no ReviewDecision with `reviewScope: SCHOLARLY` and `decision: APPROVE` exists for this mapping." The string itself is replaced by the absence of an effective approval decision — a computed property, not a stored flag.

---

## 10. Entities Defined (Summary)

| Entity | ID Pattern | Purpose | Mutability |
|---|---|---|---|
| ReviewDecision | `rev-{uuid}` | Governance action with scope, disposition, rationale, version pin | Append-only; never mutated |
| ReviewerIdentity | `sch-{slug}` | Scholar/reviewer registration and authorization | Mutable (credentials updated); decisions remain attributed even if reviewer deactivated |
| ReviewBatch | `batch-{slug}` | Groups related ReviewDecisions for operational tracking | Mutable during execution; sealed after completion |

Existing entities extended by this spec (defined in EVIDENCE-MODEL and CANONICAL-DATA-MODEL):
- EvidenceRecord (gains `verificationState`, lifecycle management)
- VerificationRecord (append-only transition log)
- ScholarlyClaim (gains version-pinned approval semantics)
- ClaimSupport (gains role in publication gates)
- DisagreementSet (gains governance integration)

---

## 11. Key Design Decisions

1. **Four scopes, not one review type.** TECHNICAL/RIGHTS/SCHOLARLY/TAXONOMIC prevent category errors where a passing linter check is mistaken for theological approval.

2. **Version-pinned approvals.** An approval covers exactly one `contentVersion`. Edits invalidate approvals automatically. This is the antidote to silent drift.

3. **Dispositions are first-class data.** RETAIN/MERGE/RECLASSIFY/SPLIT/DEFER move from Markdown prose to `dispositionDetail` enum, making batch review outcomes queryable and actionable.

4. **Open questions persist as data.** The "Scholarly Review Questions" sections of BATCH1–7 are not commentary; they are unresolved work items carried forward in `openQuestions[]`.

5. **Append-only chains, not mutable status fields.** The current `reviewStatus` string is a projection of the decision chain, not an independent truth. The chain is authoritative; the status field is derived.

6. **Partial publication at claim granularity.** A topic need not be fully approved to display approved claims within it. This avoids the all-or-nothing bottleneck that stalls useful content.

7. **Rights gate display, not scholarship.** Scholars can work with restricted sources. End users cannot see restricted content. These are separate concerns handled by separate scopes.

8. **No automated resolution of disagreements.** The review workflow explicitly prohibits algorithms from choosing between genuine scholarly positions. DisagreementSets route to human deliberation or permanent coexistence.

---

## 12. Unresolved Questions

1. **Reviewer credentialing system.** No scholar identity infrastructure exists. Who authorizes `SCHOLAR` role assignment? What qualifications are required? Until resolved, `reviewerId` is an opaque trust anchor.

2. **Multi-reviewer quorum.** Does a single SCHOLAR APPROVE suffice, or should certain entity types (e.g., creedal claims) require N-of-M reviewer consensus? Current design uses single-approval; quorum rules would add a policy layer.

3. **Batch atomicity.** When a MERGE disposition affects multiple topics, should all resulting ReviewDecisions be committed atomically, or is partial merge acceptable? Atomicity is safer but harder to implement in local-first CRDT environments.

4. **Cross-batch continuity.** If BATCH1 raises a question that BATCH4 answers, how is that linkage represented? Currently `openQuestions` are per-decision; a cross-reference mechanism is needed.

5. **Temporal expiry of approvals.** Should a SCHOLARLY APPROVE have an expiration date requiring periodic re-affirmation, or is it valid indefinitely until superseded? Classical tafsir doesn't expire, but contemporary scholarship might.

6. **Automated pre-review triage.** Can AI assist in routing entities to appropriate reviewers based on domain/dimension, or is all routing manual? AI routing is TECHNICAL scope; the review itself remains SCHOLARLY.

7. **Editorial vs scholarly boundary for taxonomic decisions.** BATCH1 recommends MERGE based on both scholarly analysis (kalām framework imposition) and editorial concern (duplication). When these conflict — scholarly grounds say RETAIN but editorial efficiency says MERGE — which scope governs?

8. **Re-review triggers.** Beyond content version changes, what events should trigger re-review? Corpus re-pinning? New source discovery? Scholarly community feedback? Policy needed.

---

*End of Specification*