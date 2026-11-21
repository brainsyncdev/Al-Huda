# WS3: Three-Layer Enforcement Middleware Specification

**Status:** Design Proposal (research only — no production code modified)
**Module:** MFD-12.2 Governance Infrastructure Planning
**Date:** 2026-11-21
**Extends:** WS-B-REVIEW-ENFORCEMENT-SPEC §3
**Depends on:** WS3-REVIEWER-IDENTITY-SCHEMA.json, WS3-BOOTSTRAP-PROCESS-SPEC.md
**proposedBy:** ai-assisted | **reviewStatus:** pending-review

---

## 1. Architecture Overview

The append-only enforcement architecture operates across three independent layers, providing defense-in-depth guarantees for ReviewDecision immutability. Each layer catches violations that others might miss.

```
┌─────────────────────────────────────────────────┐
│              Client / API Request                │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│  LAYER 1: Application Validators (Universal)     │
│  • ImmutableOperationValidator                   │
│  • PriorDecisionRefValidator                     │
│  • AcyclicChainValidator                         │
│  • SingleEffectiveDecisionValidator              │
│  • SupersedeRationaleValidator                   │
│  • ReviewerAuthorizationValidator                │
│  • ContentVersionMatchValidator                  │
│  • BootstrapModeValidator                        │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│  LAYER 2: Database Constraints (SQL Backends)    │
│  • BEFORE UPDATE/DELETE triggers                 │
│  • FK constraint on prior_decision_id            │
│  • Partial unique index (single effective)       │
│  • CHECK constraint (supersede rationale)        │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│  LAYER 3: CRDT Merge Functions (Local-First)     │
│  • Field mutation rejection                      │
│  • Tombstone preservation                        │
│  • Post-merge validation sweep                   │
│  • Lamport/HLC timestamp ordering                │
└──────────────────────┬──────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│              Storage Backend                     │
└─────────────────────────────────────────────────┘
```

---

## 2. Layer 1: Application Validators (Detailed)

### 2.1 Validator Pipeline Interface

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  code: string;           // Machine-readable error code
  message: string;        // Human-readable description
  field?: string;         // Affected field name
  value?: unknown;        // Offending value
  remediation?: string;   // Suggested fix
}

interface WriteContext {
  operation: 'INSERT';    // Only INSERT permitted; UPDATE/DELETE caught by first validator
  bootstrapMode: boolean;
  currentTimestamp: string;
  storageBackend: 'sql' | 'crdt' | 'memory';
}
```

### 2.2 Validator Specifications

#### V1: ImmutableOperationValidator

| Property | Value |
|----------|-------|
| **Purpose** | Reject any non-INSERT operation |
| **Check** | `context.operation !== 'INSERT'` → reject |
| **Error Code** | `REVIEW_DECISION_IMMUTABLE` |
| **Message** | `"ReviewDecision is append-only. {operation} is not permitted. Create a new SUPERSEDE decision instead."` |
| **Position** | First in pipeline (short-circuit) |

#### V2: PriorDecisionRefValidator

| Property | Value |
|----------|-------|
| **Purpose** | Validate referential integrity of priorDecisionId |
| **Check** | If `priorDecisionId` is set: (a) referenced decision exists, (b) referenced decision targets same `targetEntityId` |
| **Error Code** | `PRIOR_DECISION_INVALID` |
| **Message** | `"priorDecisionId {ref} does not exist or targets different entity ({expected} vs {actual})."` |
| **Storage Query** | `SELECT target_entity_id FROM review_decisions WHERE id = ?` |

#### V3: AcyclicChainValidator

| Property | Value |
|----------|-------|
| **Purpose** | Detect cycles in supersession chains |
| **Algorithm** | Walk `priorDecisionId` chain using visited-set; max depth 1000 |
| **Error Code** | `SUPERSESSION_CYCLE` |
| **Message** | `"Supersession chain contains cycle involving decisions: {chain}."` |
| **Performance** | O(chain_length); typical chains < 10 deep |

#### V4: SingleEffectiveDecisionValidator

| Property | Value |
|----------|-------|
| **Purpose** | Enforce at most one non-superseded decision per target+scope |
| **Check** | Query for existing effective decisions matching `targetEntityId + reviewScope`, excluding self |
| **Error Code** | `MULTIPLE_EFFECTIVE_DECISIONS` |
| **Message** | `"Effective decision {existing_id} already exists for {target}/{scope}. Use SUPERSEDE to replace it."` |
| **Exception** | Not enforced when `decision == SUPERSEDE` (supersession replaces the existing) |

#### V5: SupersedeRationaleValidator

| Property | Value |
|----------|-------|
| **Purpose** | Ensure SUPERSEDE decisions include justification |
| **Check** | `decision == 'SUPERSEDE' && rationale.trim().length == 0` → reject |
| **Error Code** | `SUPERSEDE_REQUIRES_RATIONALE` |
| **Message** | `"SUPERSEDE decision must include non-empty rationale explaining why the prior decision is being replaced."` |

#### V6: ReviewerAuthorizationValidator

| Property | Value |
|----------|-------|
| **Purpose** | Verify reviewer is authorized for the requested scope |
| **Check** | Call `isAuthorized(reviewerId, scope, entityType)` per WS-B §3.4 |
| **Error Code** | `REVIEWER_UNAUTHORIZED` |
| **Message** | `"Reviewer {id} is not authorized for {scope} on {entityType}. Required: {requirements}."` |
| **Bootstrap Bypass** | When `context.bootstrapMode == true`, skip this validator |

#### V7: ContentVersionMatchValidator

| Property | Value |
|----------|-------|
| **Purpose** | Ensure SCHOLARLY decisions pin to current content version |
| **Check** | If `reviewScope == SCHOLARLY`: load target entity, compare `targetContentVersion` to entity's `contentVersion` |
| **Error Code** | `VERSION_MISMATCH` |
| **Message** | `"targetContentVersion {v} does not match current contentVersion {current}. Content may have changed since review began."` |
| **Scope** | SCHOLARLY only; TECHNICAL/RIGHTS/TAXONOMIC exempt |

#### V8: BootstrapModeValidator (NEW)

| Property | Value |
|----------|-------|
| **Purpose** | Prevent bootstrap authorizations after window closure |
| **Check** | If `authorizationChain[].authorizedBy == "system-bootstrap"` AND `context.bootstrapMode == false` → reject |
| **Error Code** | `BOOTSTRAP_WINDOW_CLOSED` |
| **Message** | `"Bootstrap window is closed. New reviewers must be authorized by an existing active reviewer."` |
| **Position** | Runs only during ReviewerIdentity creation, not ReviewDecision |

### 2.3 Pipeline Execution Rules

| Rule | Description |
|------|-------------|
| P-1 | Validators execute in declared order; first failure short-circuits |
| P-2 | All validators run within a single transaction boundary |
| P-3 | Warnings do not block writes but are logged and returned to caller |
| P-4 | Validator failures produce structured error responses per WS-B §3.4 format |
| P-5 | Pipeline is configurable: validators can be added/removed per deployment |

---

## 3. Layer 2: Database Constraints (SQL)

### 3.1 Trigger Definitions

```sql
-- Prevent UPDATE on review_decisions
CREATE OR REPLACE TRIGGER trg_review_decision_no_update
BEFORE UPDATE ON review_decisions
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'ENF-L2: ReviewDecision is append-only. UPDATE prohibited.';
END;

-- Prevent DELETE on review_decisions
CREATE OR REPLACE TRIGGER trg_review_decision_no_delete
BEFORE DELETE ON review_decisions
FOR EACH ROW
BEGIN
  SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'ENF-L2: ReviewDecision cannot be deleted. Use SUPERSEDE.';
END;
```

### 3.2 Constraint Definitions

```sql
-- Referential integrity for supersession chain
ALTER TABLE review_decisions
ADD CONSTRAINT fk_prior_decision
FOREIGN KEY (prior_decision_id) REFERENCES review_decisions(id)
ON DELETE RESTRICT;

-- Single effective decision per target+scope
CREATE UNIQUE INDEX idx_single_effective_per_target_scope
ON review_decisions (target_entity_id, review_scope)
WHERE superseded_at IS NULL;

-- Non-empty rationale for SUPERSEDE
ALTER TABLE review_decisions
ADD CONSTRAINT chk_supersede_rationale_not_empty
CHECK (decision != 'SUPERSEDE' OR CHAR_LENGTH(TRIM(rationale)) > 0);

-- ReviewerIdentity FK
ALTER TABLE review_decisions
ADD CONSTRAINT fk_reviewer_identity
FOREIGN KEY (reviewer_id) REFERENCES reviewer_identities(id);
```

### 3.3 Layer 2 Limitations

| Limitation | Mitigation |
|------------|------------|
| Cannot enforce domain-matching logic (requires JOIN) | Layer 1 handles; Layer 2 is safety net only |
| Cannot enforce quorum rules | Layer 1 + application service |
| Trigger syntax varies across RDBMS | Provide dialect-specific scripts per supported backend |
| Direct DB access bypasses Layer 1 | Layer 2 catches basic violations; audit detects advanced ones |

---

## 4. Layer 3: CRDT Merge Functions (Local-First)

### 4.1 Merge Function Contract

```typescript
interface CRDTMergeFunction {
  /**
   * Called when two replicas have conflicting versions of a ReviewDecision.
   * Returns the resolved value. MUST NOT silently accept mutations.
   */
  resolveConflict(local: ReviewDecision, remote: ReviewDecision): MergeResult;
}

interface MergeResult {
  resolved: ReviewDecision;
  warnings: string[];
  violations: string[];  // Non-empty → flag for manual resolution
}
```

### 4.2 Merge Rules

| Conflict Type | Resolution Strategy | Violation? |
|---------------|--------------------|-----------|
| Both INSERT, different IDs | Keep both (no conflict) | No |
| Both INSERT, same ID, different content | Last-writer-wins by HLC timestamp; log warning | Yes |
| Local mutated field vs remote original | Preserve original; log violation | Yes |
| Remote mutated field vs local original | Preserve original; log violation | Yes |
| Both deleted | Preserve tombstone; neither truly deleted | No |
| One deleted, one modified | Preserve original (deletion rejected) | Yes |
| Concurrent SUPERSEDE on same target | Both preserved; latest `supersededAt` wins effective status | No |

### 4.3 Post-Merge Validation Sweep

After every sync/merge cycle:

1. Enumerate all ReviewDecision records modified during merge
2. Run Layer 1 validators against merged state (read-only validation pass)
3. Records failing validation get `validationError` metadata appended
4. Generate alert for human review if violations found
5. Never auto-delete or auto-correct violating records

### 4.4 Timestamp Ordering

All CRDT operations use Hybrid Logical Clocks (HLC):
- `decidedAt` carries HLC value, not wall-clock time
- `supersededAt` uses HLC for deterministic ordering across devices
- Wall-clock time preserved separately in `wallClockTimestamp` for display only

---

## 5. Error Response Standardization

All three layers produce errors in this format:

```jsonc
{
  "error": "REVIEW_DECISION_VALIDATION_FAILED",
  "code": "<ERROR_CODE>",
  "layer": "application" | "database" | "crdt",
  "message": "<human-readable>",
  "details": { /* context-specific */ },
  "remediation": "<actionable suggestion>"
}
```

Layer 2 and Layer 3 errors are translated to this format by the storage adapter before returning to the application.

---

## 6. Testing Strategy

| Layer | Test Approach |
|-------|--------------|
| Layer 1 | Unit tests per validator; integration tests for full pipeline |
| Layer 2 | SQL script execution tests against each supported RDBMS |
| Layer 3 | Simulated conflict scenarios with mock CRDT backend |
| Cross-layer | Same violation triggered at each layer; verify consistent error codes |

See WS3-PERMISSION-TEST-CASES.md for complete test matrix.

---

## 7. Configuration

```jsonc
{
  "enforcement": {
    "layer1": {
      "enabled": true,
      "validators": ["all"],  // or specific list
      "bootstrapMode": false
    },
    "layer2": {
      "enabled": true,          // false for non-SQL backends
      "dialect": "postgresql"   // postgresql | mysql | sqlite
    },
    "layer3": {
      "enabled": true,          // false for SQL-only deployments
      "postMergeValidation": true,
      "hlcNodeId": "node-uuid"
    }
  }
}
```

---

*End of Specification*
