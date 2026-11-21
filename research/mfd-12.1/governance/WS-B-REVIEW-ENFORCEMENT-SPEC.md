# WS-B: ReviewDecision Append-Only Enforcement Specification

**Status:** Design Proposal (research only — no production schema or data modified)
**Module:** MFD-12.1 Governance & Credentialing
**Date:** 2026-11-21
**Extends:** MFD-12-REVIEW-WORKFLOW-SPEC §5; MFD-12-CANONICAL-DATA-MODEL §7 q5
**Depends on:** MFD-12-EVIDENCE-MODEL §6.4 (supersession mechanics)
**proposedBy:** ai-assisted | **reviewStatus:** pending-scholarly-review

---

## 1. Requirements Analysis

### 1.1 What the architecture needs

MFD-12-CANONICAL-DATA-MODEL §7 q5 asks: "What storage-layer mechanism enforces the append-only constraint? Options include database triggers, application-level middleware, or CRDT-based conflict resolution."

MFD-12-REVIEW-WORKFLOW-SPEC §5.1 defines six invariants that MUST be enforced:
1. No UPDATE on ReviewDecision
2. No DELETE on ReviewDecision
3. `priorDecisionId` must reference existing decision for same target
4. Supersession chains must be acyclic
5. At most one effective (non-superseded) decision per target per scope
6. SUPERSEDE requires non-empty rationale

These invariants are the foundation of scholarly audit integrity. If any can be violated, the entire review chain loses trustworthiness.

### 1.2 Functional requirements

| ID | Requirement |
|----|-------------|
| EN-F1 | Reject all UPDATE operations on ReviewDecision at storage layer |
| EN-F2 | Reject all DELETE operations on ReviewDecision at storage layer |
| EN-F3 | Validate priorDecisionId referential integrity on insert |
| EN-F4 | Detect and reject cyclic supersession chains on insert |
| EN-F5 | Enforce single-effective-decision invariant per target per scope |
| EN-F6 | Validate SUPERSEDE rationale non-empty on insert |
| EN-F7 | Work in both SQL and local-first CRDT storage backends |
| EN-F8 | Provide clear error messages for rejected operations |

---

## 2. Design Options

### Option A: Database Triggers Only

Enforce all invariants via SQL triggers/constraints.

**Pros:** Strong guarantees; impossible to bypass via application bugs; declarative.
**Cons:** Not portable to local-first/file-based storage; trigger logic is DB-specific; hard to test in isolation; CRDT backends cannot use triggers.

**Verdict:** Adopted as primary enforcement for SQL backends. Insufficient alone.

### Option B: Application Middleware Only

Enforce invariants in the application service layer before writes reach storage.

**Pros:** Backend-agnostic; testable; portable across SQL/CRDT/file storage; rich error messages.
**Cons:** Can be bypassed by direct DB access; requires discipline in all code paths; race conditions possible without DB-level backup.

**Verdict:** Adopted as universal enforcement layer. Must be complemented by DB constraints where available.

### Option C: Defense-in-Depth (Recommended)

Three-layer enforcement:
1. **Application middleware** — universal validation, rich errors, backend-agnostic
2. **Database constraints/triggers** — SQL backends only, as safety net
3. **CRDT conflict resolution** — for local-first backends, merge functions reject mutations

**Pros:** Maximum safety; portable; defense-in-depth; each layer catches what others miss.
**Cons:** More implementation effort; must maintain consistency across layers.

**Verdict:** Recommended.

---

## 3. Recommended Specification: Three-Layer Enforcement

### 3.1 Layer 1: Application Middleware (Universal)

All ReviewDecision writes pass through a validation middleware before reaching any storage adapter.

#### 3.1.1 Validation Pipeline

```typescript
interface ReviewDecisionWriteValidator {
  validate(decision: ReviewDecision, context: WriteContext): ValidationResult;
}

// Validators executed in order; first failure short-circuits
const validators = [
  new ImmutableOperationValidator(),     // EN-F1, EN-F2
  new PriorDecisionRefValidator(),       // EN-F3
  new AcyclicChainValidator(),           // EN-F4
  new SingleEffectiveDecisionValidator(), // EN-F5
  new SupersedeRationaleValidator(),     // EN-F6
  new ReviewerAuthorizationValidator(),  // Cross-ref with WS-B-REVIEWER-CREDENTIALING-SPEC
  new ContentVersionMatchValidator(),    // Cross-ref with REVIEW-WORKFLOW-SPEC §3.2
];
```

#### 3.1.2 Validator Specifications

| Validator | Check | Error Code | Message Template |
|-----------|-------|------------|------------------|
| ImmutableOperationValidator | Operation is INSERT only; UPDATE/DELETE rejected | `REVIEW_DECISION_IMMUTABLE` | "ReviewDecision {id} cannot be {operation}. Create a new SUPERSEDE decision instead." |
| PriorDecisionRefValidator | If `priorDecisionId` set, referenced decision exists AND targets same `targetEntityId` | `PRIOR_DECISION_INVALID` | "priorDecisionId {ref} does not exist or targets different entity." |
| AcyclicChainValidator | Walk `priorDecisionId` chain; detect cycles via visited-set | `SUPERSESSION_CYCLE` | "Supersession chain contains cycle: {chain}." |
| SingleEffectiveDecisionValidator | No existing non-superseded decision for same target+scope (excluding self) | `MULTIPLE_EFFECTIVE_DECISIONS` | "Effective decision already exists for {target}/{scope}. Use SUPERSEDE to replace." |
| SupersedeRationaleValidator | If `decision == SUPERSEDE`, `rationale.length > 0` | `SUPERSEDE_REQUIRES_RATIONALE` | "SUPERSEDE decision must include non-empty rationale." |
| ReviewerAuthorizationValidator | Reviewer is authorized for scope at decision time | `REVIEWER_UNAUTHORIZED` | "Reviewer {id} not authorized for {scope} on this entity type." |
| ContentVersionMatchValidator | If SCHOLARLY scope, `targetContentVersion` matches entity's current `contentVersion` | `VERSION_MISMATCH` | "targetContentVersion {v} does not match current contentVersion {current}." |

#### 3.1.3 Write Path Contract

```
Client Request
    ↓
[ImmutableOperationValidator] ← rejects UPDATE/DELETE
    ↓
[PriorDecisionRefValidator] ← validates FK
    ↓
[AcyclicChainValidator] ← walks chain
    ↓
[SingleEffectiveDecisionValidator] ← checks uniqueness
    ↓
[SupersedeRationaleValidator] ← checks rationale
    ↓
[ReviewerAuthorizationValidator] ← checks credentials
    ↓
[ContentVersionMatchValidator] ← checks version pin
    ↓
Storage Adapter Write
    ↓
[DB Constraint / CRDT Merge] ← safety net
    ↓
Success Response
```

### 3.2 Layer 2: Database Constraints (SQL Backends)

```sql
-- Prevent UPDATE
CREATE TRIGGER review_decision_no_update
BEFORE UPDATE ON review_decisions
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'ReviewDecision is append-only. Use SUPERSEDE.';
END;

-- Prevent DELETE
CREATE TRIGGER review_decision_no_delete
BEFORE DELETE ON review_decisions
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'ReviewDecision cannot be deleted. Create SUPERSEDE instead.';
END;

-- Referential integrity for priorDecisionId
ALTER TABLE review_decisions
ADD CONSTRAINT fk_prior_decision
FOREIGN KEY (prior_decision_id) REFERENCES review_decisions(id);

-- Single effective decision per target+scope (partial unique index)
CREATE UNIQUE INDEX idx_single_effective_decision
ON review_decisions (target_entity_id, review_scope)
WHERE superseded_at IS NULL;

-- Non-empty rationale for SUPERSEDE
ALTER TABLE review_decisions
ADD CONSTRAINT chk_supersede_rationale
CHECK (decision != 'SUPERSEDE' OR LENGTH(rationale) > 0);
```

### 3.3 Layer 3: CRDT Conflict Resolution (Local-First Backends)

For CRDT-based storage (Automerge, Yjs, etc.):

| Operation | CRDT Behavior |
|-----------|--------------|
| INSERT new ReviewDecision | Allowed; standard CRDT set/map addition |
| UPDATE existing ReviewDecision | Merge function rejects field mutations; logs warning |
| DELETE existing ReviewDecision | Merge function preserves deleted record; tombstone ignored |
| Concurrent SUPERSEDE | Last-writer-wins on `supersededAt` timestamp; both decisions preserved |
| Cycle detection | Post-merge validation sweep; flagged for manual resolution |

**CRDT-Specific Rule CR1:** Since CRDTs cannot enforce constraints at write time, a post-sync validation sweep runs after each merge. Violations are logged and the offending records are flagged with `validationError` metadata. Human resolution required.

**CRDT-Specific Rule CR2:** The `supersededAt` field (set when a decision is superseded) uses a Lamport timestamp or hybrid logical clock to ensure deterministic ordering across devices.

### 3.4 Error Response Format

```jsonc
{
  "error": "REVIEW_DECISION_VALIDATION_FAILED",
  "code": "PRIOR_DECISION_INVALID",
  "message": "priorDecisionId rev-abc123 does not exist or targets different entity.",
  "details": {
    "field": "priorDecisionId",
    "value": "rev-abc123",
    "expectedTargetEntityId": "claim-def456",
    "actualTargetEntityId": null
  },
  "remediation": "Verify the priorDecisionId references an existing ReviewDecision for the same targetEntityId."
}
```

---

## 4. Integration Points

| Existing Entity | Integration |
|----------------|-------------|
| ReviewDecision | Primary enforcement target; gains `supersededAt` field for CRDT support |
| ReviewerIdentity | Authorization validator cross-references identity record |
| ScholarlyClaim.contentVersion | Version-match validator reads current version |
| Storage Adapters | Must implement Layer 2 (SQL) or Layer 3 (CRDT) in addition to universal Layer 1 |
| Review Workflow §5.2 | Chain traversal algorithm assumes enforcement invariants hold |
| VerificationRecord | Same append-only pattern; enforcement spec serves as template |

---

## 5. Implementation Prerequisites

| Prerequisite | Status | Owner |
|-------------|--------|-------|
| Storage adapter interface defined | ❌ Pending | Infrastructure |
| SQL schema for review_decisions table | ❌ Pending | Infrastructure |
| CRDT library selection (Automerge/Yjs/custom) | ❌ Pending | Infrastructure |
| ReviewerIdentity entity (for authorization validator) | ⏳ Specified in WS-B-REVIEWER-CREDENTIALING-SPEC | WS-B |
| Hybrid logical clock implementation (for CRDT) | ❌ Pending | Infrastructure |
| Integration test suite for all six invariants | ❌ Pending | QA |

---

*End of Specification*
