# WS3: Permission Test Cases for Governance Infrastructure

**Status:** Design Proposal (research only — no production code modified)
**Module:** MFD-12.2 Governance Infrastructure Planning
**Date:** 2026-11-21
**Extends:** WS-B-REVIEWER-CREDENTIALING-SPEC §3.2, WS-B-REVIEW-ENFORCEMENT-SPEC §3
**Depends on:** WS3-REVIEWER-IDENTITY-SCHEMA.json, WS3-ENFORCEMENT-MIDDLEWARE-SPEC.md, WS3-BOOTSTRAP-PROCESS-SPEC.md
**proposedBy:** ai-assisted | **reviewStatus:** pending-review

---

## 1. Overview

These test cases define the acceptance criteria for the governance infrastructure. ALL cases must pass before the system is considered functional for production review operations. Tests are organized by enforcement layer and cross-cutting concerns.

### Test Conventions

- **PASS**: Operation completes successfully with expected result
- **REJECT**: Operation fails with specified error code
- **AUDIT**: Operation produces expected audit log entry
- Setup creates minimal required entities; teardown cleans up test data
- All timestamps use UTC ISO-8601 format

---

## 2. ReviewerIdentity Authorization Tests

### TC-AUTH-001: Active scholar can issue SCHOLARLY decision

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-test-scholar` exists with `reviewerType: HUMAN_SCHOLAR`, `authorizedScopes: ["SCHOLARLY"]`, `domainExpertise: [{domain: "TAFSIR"}]`, `activeUntil: null` |
| **Action** | Create ReviewDecision with `decision: APPROVE`, `reviewScope: SCHOLARLY`, `reviewerId: sch-test-scholar`, targeting a TAFSIR-type ScholarlyClaim |
| **Expected** | PASS — decision created successfully |
| **Validates** | AUTH-1, AUTH-3 |

### TC-AUTH-002: Inactive scholar cannot issue any decision

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-inactive` with `activeUntil: 2026-01-01T00:00:00Z` |
| **Action** | Create ReviewDecision with `reviewerId: sch-inactive` |
| **Expected** | REJECT — `REVIEWER_UNAUTHORIZED` with message indicating deactivation |
| **Validates** | AUTH-5 |

### TC-AUTH-003: Automated agent rejected for SCHOLARLY scope

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-bot-1` with `reviewerType: AUTOMATED_AGENT`, `authorizedScopes: ["TECHNICAL"]` |
| **Action** | Attempt to create ReviewDecision with `reviewScope: SCHOLARLY` |
| **Expected** | REJECT — `REVIEWER_UNAUTHORIZED` |
| **Validates** | AUTH-2 |

### TC-AUTH-004: Editor cannot issue SCHOLARLY decision

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-editor-1` with `reviewerType: HUMAN_EDITOR`, `authorizedScopes: ["TAXONOMIC", "TECHNICAL"]` |
| **Action** | Attempt to create ReviewDecision with `reviewScope: SCHOLARLY` |
| **Expected** | REJECT — `REVIEWER_UNAUTHORIZED` |
| **Validates** | AUTH-1, Authority Scoping Matrix |

### TC-AUTH-005: Scholar without matching domain rejected for domain-specific claim

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-hadith-only` with `domainExpertise: [{domain: "HADITH"}]`, `authorizedScopes: ["SCHOLARLY"]` |
| **Action** | Create SCHOLARLY APPROVE targeting a FIQH-type ScholarlyClaim |
| **Expected** | REJECT — `REVIEWER_UNAUTHORIZED` with domain mismatch detail |
| **Validates** | AUTH-4, Authority Scoping Matrix |

### TC-AUTH-006: Rights reviewer can issue RIGHTS decision

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-rights-1` with `reviewerType: HUMAN_RIGHTS_REVIEWER`, `authorizedScopes: ["RIGHTS"]` |
| **Action** | Create ReviewDecision with `reviewScope: RIGHTS` |
| **Expected** | PASS |
| **Validates** | Authority Scoping Matrix |

### TC-AUTH-007: Deactivated reviewer's historical decisions remain queryable

| Field | Value |
|-------|-------|
| **Precondition** | ReviewerIdentity `sch-retired` deactivated; 5 historical ReviewDecisions exist |
| **Action** | Query ReviewDecisions where `reviewerId = sch-retired` |
| **Expected** | PASS — all 5 decisions returned with full attribution |
| **Validates** | AUTH-6, AUTH-8 |

---

## 3. Append-Only Enforcement Tests

### TC-ENF-001: UPDATE on ReviewDecision rejected at application layer

| Field | Value |
|-------|-------|
| **Precondition** | Existing ReviewDecision `rev-existing` |
| **Action** | Attempt UPDATE operation on `rev-existing` |
| **Expected** | REJECT — `REVIEW_DECISION_IMMUTABLE` |
| **Validates** | EN-F1, Layer 1 ImmutableOperationValidator |

### TC-ENF-002: DELETE on ReviewDecision rejected at application layer

| Field | Value |
|-------|-------|
| **Precondition** | Existing ReviewDecision `rev-existing` |
| **Action** | Attempt DELETE operation on `rev-existing` |
| **Expected** | REJECT — `REVIEW_DECISION_IMMUTABLE` |
| **Validates** | EN-F2, Layer 1 ImmutableOperationValidator |

### TC-ENF-003: priorDecisionId referencing non-existent decision rejected

| Field | Value |
|-------|-------|
| **Action** | INSERT ReviewDecision with `priorDecisionId: "non-existent-uuid"` |
| **Expected** | REJECT — `PRIOR_DECISION_INVALID` |
| **Validates** | EN-F3, Layer 1 PriorDecisionRefValidator |

### TC-ENF-004: Cyclic supersession chain detected and rejected

| Field | Value |
|-------|-------|
| **Precondition** | Chain: rev-A → rev-B → rev-C (each supersedes prior) |
| **Action** | Attempt to create rev-D with `priorDecisionId: rev-A` where rev-A already has `priorDecisionId: rev-C` forming a cycle |
| **Expected** | REJECT — `SUPERSESSION_CYCLE` |
| **Validates** | EN-F4, Layer 1 AcyclicChainValidator |

### TC-ENF-005: Second effective decision for same target+scope rejected

| Field | Value |
|-------|-------|
| **Precondition** | Effective (non-superseded) APPROVE exists for claim-X / SCHOLARLY |
| **Action** | INSERT another APPROVE for claim-X / SCHOLARLY without SUPERSEDE |
| **Expected** | REJECT — `MULTIPLE_EFFECTIVE_DECISIONS` |
| **Validates** | EN-F5, Layer 1 SingleEffectiveDecisionValidator |

### TC-ENF-006: SUPERSEDE without rationale rejected

| Field | Value |
|-------|-------|
| **Action** | INSERT ReviewDecision with `decision: SUPERSEDE`, `rationale: ""` |
| **Expected** | REJECT — `SUPERSEDE_REQUIRES_RATIONALE` |
| **Validates** | EN-F6, Layer 1 SupersedeRationaleValidator |

### TC-ENF-007: Content version mismatch rejected for SCHOLARLY scope

| Field | Value |
|-------|-------|
| **Precondition** | ScholarlyClaim at `contentVersion: 3` |
| **Action** | INSERT SCHOLARLY ReviewDecision with `targetContentVersion: 2` |
| **Expected** | REJECT — `VERSION_MISMATCH` |
| **Validates** | Layer 1 ContentVersionMatchValidator |

### TC-ENF-008: SQL trigger prevents direct DB UPDATE

| Field | Value |
|-------|-------|
| **Precondition** | SQL backend with triggers installed |
| **Action** | Execute raw SQL `UPDATE review_decisions SET rationale = 'tampered' WHERE id = 'rev-existing'` |
| **Expected** | REJECT — SQLSTATE 45000 with append-only message |
| **Validates** | Layer 2 database trigger |

### TC-ENF-009: CRDT merge rejects field mutation

| Field | Value |
|-------|-------|
| **Precondition** | CRDT backend with ReviewDecision merge function |
| **Action** | Submit concurrent update modifying `rationale` field of existing decision |
| **Expected** | Merge function preserves original value; logs warning |
| **Validates** | Layer 3 CRDT conflict resolution |

---

## 4. Bootstrap Process Tests

### TC-BOOT-001: Bootstrap registration succeeds with valid BAC consensus

| Field | Value |
|-------|-------|
| **Precondition** | `BOOTSTRAP_MODE=active`; BAC consensus documented |
| **Action** | Create ReviewerIdentity with `authorizedBy: "system-bootstrap"` |
| **Expected** | PASS — identity created; audit log entry written |
| **Validates** | AUTH-7, Bootstrap Phase 2 |

### TC-BOOT-002: Bootstrap registration rejected when window closed

| Field | Value |
|-------|-------|
| **Precondition** | `BOOTSTRAP_MODE=closed` |
| **Action** | Attempt to create ReviewerIdentity with `authorizedBy: "system-bootstrap"` |
| **Expected** | REJECT — `BOOTSTRAP_WINDOW_CLOSED` |
| **Validates** | BC-5, Bootstrap Phase 3 |

### TC-BOOT-003: Bootstrap rejects exceeding max reviewer count

| Field | Value |
|-------|-------|
| **Precondition** | 20 reviewers already bootstrapped in current session |
| **Action** | Attempt to register 21st bootstrap reviewer |
| **Expected** | REJECT — `BOOTSTRAP_LIMIT_EXCEEDED` |
| **Validates** | BC-1 |

### TC-BOOT-004: Bootstrap test decision validates enforcement pipeline

| Field | Value |
|-------|-------|
| **Precondition** | Bootstrap reviewer `sch-boot-1` registered |
| **Action** | `sch-boot-1` issues TECHNICAL decision on designated test entity |
| **Expected** | PASS — decision passes all three enforcement layers |
| **Validates** | Bootstrap Phase 3 step 3.2 |

---

## 5. Quorum Tests

### TC-QRM-001: T1 claim approved with single SCHOLAR APPROVE

| Field | Value |
|-------|-------|
| **Precondition** | LINGUISTIC claim; one effective SCHOLAR APPROVE at current contentVersion |
| **Action** | Evaluate quorum |
| **Expected** | QUORUM_MET |
| **Validates** | QP-F2, Tier T1 |

### TC-QRM-002: T3 claim requires 3 approvals with tradition diversity

| Field | Value |
|-------|-------|
| **Precondition** | THEOLOGICAL claim; 3 SCHOLAR APPROVE from reviewers with traditions [Hanafi], [Shafi'i], [Maliki] |
| **Action** | Evaluate quorum |
| **Expected** | QUORUM_MET |
| **Validates** | QP-F3, Tier T3 |

### TC-QRM-003: T3 claim with 3 same-tradition approvals fails diversity

| Field | Value |
|-------|-------|
| **Precondition** | THEOLOGICAL claim; 3 SCHOLAR APPROVE all from Hanafi tradition |
| **Action** | Evaluate quorum |
| **Expected** | QUORUM_NOT_MET — insufficient tradition diversity |
| **Validates** | Tier T3 diversity requirement |

### TC-QRM-004: Dissent blocks consensus display in T4

| Field | Value |
|-------|-------|
| **Precondition** | Claim in genuine DisagreementSet with traditions [Ash'ari, Maturidi]; Ash'ari reviewer approves; Maturidi reviewer dissents |
| **Action** | Evaluate quorum |
| **Expected** | QUORUM_NOT_MET — Maturidi tradition not represented in approvals |
| **Validates** | QP-F5, Tier T4 |

---

## 6. Expiry Tests

### TC-EXP-001: Classical approval has no expiry

| Field | Value |
|-------|-------|
| **Precondition** | APPROVE on classical tafsir claim with `expiryCategory: CLASSICAL_PERMANENT` |
| **Action** | Check expiry status after 100 years simulated time |
| **Expected** | Still APPROVED; `expiresAt: null` |
| **Validates** | EX-F2 |

### TC-EXP-002: Contemporary approval expires after 5 years

| Field | Value |
|-------|-------|
| **Precondition** | APPROVE with `expiryCategory: CONTEMPORARY_5Y`, `expiresAt: 2031-11-21T00:00:00Z` |
| **Action** | Evaluate at 2031-11-22 |
| **Expected** | Grace period active; entity still displays with warning badge |
| **Validates** | EX-F3, GR-1, GR-2 |

### TC-EXP-003: Expired approval blocks publication after grace period

| Field | Value |
|-------|-------|
| **Precondition** | APPROVE expired 91 days ago; no re-affirmation |
| **Action** | Query publication gate |
| **Expected** | GATE_FAILED — entity excluded from publication |
| **Validates** | EX-F4, GR-3 |

### TC-EXP-004: Re-affirmation restores approval

| Field | Value |
|-------|-------|
| **Precondition** | Expired APPROVE exists; new ENDORSE decision with `priorDecisionId` pointing to it |
| **Action** | Evaluate publication gate |
| **Expected** | GATE_PASSED — entity restored to APPROVED |
| **Validates** | EX-F5, GR-6 |

---

## 7. Cross-Cutting Integration Tests

### TC-INT-001: Full lifecycle — create identity, approve, supersede, verify chain

| Field | Value |
|-------|-------|
| **Steps** | 1. Register reviewer via bootstrap 2. Issue APPROVE 3. Issue SUPERSEDE with rationale 4. Verify chain integrity 5. Verify old decision preserved |
| **Expected** | All steps PASS; chain is acyclic; both decisions queryable |
| **Validates** | End-to-end governance flow |

### TC-INT-002: HadithReport linked to EvidenceRecord enforces HR1

| Field | Value |
|-------|-------|
| **Precondition** | EvidenceRecord with `evidenceKind: HADITH_REPORT` |
| **Action** | Create without `hadithReportId` |
| **Expected** | REJECT — `HADITH_REPORT_ID_REQUIRED` |
| **Validates** | HR1 integration |

### TC-INT-003: All three enforcement layers agree on valid insert

| Field | Value |
|-------|-------|
| **Action** | Insert valid ReviewDecision through full pipeline |
| **Expected** | Layer 1 passes → Layer 2 accepts (or N/A) → Layer 3 merges cleanly → Success |
| **Validates** | Defense-in-depth consistency |

---

## 8. Test Execution Requirements

| Requirement | Description |
|-------------|-------------|
| TR-1 | All tests must be automated and runnable in CI |
| TR-2 | Tests must run against both SQL and CRDT backends |
| TR-3 | Bootstrap tests require isolated test environment (never production) |
| TR-4 | Time-dependent tests (expiry) must support clock injection |
| TR-5 | Test data must be fully isolated between test cases |
| TR-6 | All REJECT assertions must verify both error code AND human-readable message |

---

*End of Specification*
