# WS3: Reviewer Bootstrap Process Specification

**Status:** Design Proposal (research only — no production code modified)
**Module:** MFD-12.2 Governance Infrastructure Planning
**Date:** 2026-11-21
**Extends:** WS-B-REVIEWER-CREDENTIALING-SPEC §3.2 AUTH-7
**Depends on:** WS3-REVIEWER-IDENTITY-SCHEMA.json, WS3-ENFORCEMENT-MIDDLEWARE-SPEC.md
**proposedBy:** ai-assisted | **reviewStatus:** pending-review

---

## 1. Problem Statement

The governance infrastructure faces a chicken-and-egg problem: creating a `ReviewerIdentity` requires authorization from an existing reviewer (via `authorizationChain.authorizedBy`), but no reviewers exist when the system is first deployed. AUTH-7 in WS-B-REVIEWER-CREDENTIALING-SPEC permits `authorizedBy: "system-bootstrap"` during initial setup but does not define the process, controls, or audit requirements for this exceptional operation.

This specification defines the complete bootstrap process to ensure:
1. Initial reviewers are registered with proper authority documentation
2. The bootstrap window is explicitly opened and closed
3. All bootstrap actions are auditable and non-repudiable
4. Post-bootstrap, normal authorization rules apply without exception

---

## 2. Bootstrap Governance Body

### 2.1 Composition

The **Bootstrap Authorization Committee (BAC)** consists of 3–5 individuals:

| Role | Count | Responsibility |
|------|-------|----------------|
| Project Lead / Founder | 1 | Ultimate accountability for initial reviewer selection |
| Senior Scholar Advisor | 1–2 | Validates scholarly qualifications of initial reviewers |
| Technical Lead | 1 | Executes bootstrap operations; verifies system integrity |
| Independent Observer | 0–1 | Documents process; provides external accountability |

### 2.2 Authority Source

The BAC derives its authority from the project's founding governance document (e.g., project charter, waqf deed, or institutional mandate). This document MUST be referenced in the bootstrap audit log as `authorityDocumentRef`.

### 2.3 Decision Rule

All bootstrap reviewer registrations require **unanimous consent** of the BAC. Dissenting members must record their objection in the bootstrap audit log.

---

## 3. Bootstrap Process Steps

### Phase 1: Preparation

| Step | Action | Actor | Output |
|------|--------|-------|--------|
| 1.1 | Draft initial reviewer candidate list with qualifications | Project Lead | Candidate roster |
| 1.2 | Verify each candidate's qualifications via documentary evidence | Scholar Advisor(s) | Verification records |
| 1.3 | Assign proposed scopes and domain expertise to each candidate | Full BAC | Scope assignment matrix |
| 1.4 | Generate unique `sch-*` identifiers for each candidate | Technical Lead | ID registry |
| 1.5 | Open bootstrap window by setting `BOOTSTRAP_MODE=active` in system config | Technical Lead | Config change logged |

### Phase 2: Registration

| Step | Action | Actor | Output |
|------|--------|-------|--------|
| 2.1 | Create ReviewerIdentity records with `authorizedBy: "system-bootstrap"` | Technical Lead | Identity records created |
| 2.2 | Attach qualification verification documents to each identity | Technical Lead | Qualifications populated |
| 2.3 | Set `authorizationChain[].rationale` to reference BAC decision record | Technical Lead | Audit trail established |
| 2.4 | Run all Layer 1 validators EXCEPT ReviewerAuthorizationValidator (bypassed in bootstrap mode) | System | Validation pass/fail |
| 2.5 | Record each creation in the Bootstrap Audit Log | System | Immutable log entries |

### Phase 3: Verification & Closure

| Step | Action | Actor | Output |
|------|--------|-------|--------|
| 3.1 | Each bootstrap reviewer issues one test TECHNICAL decision on a designated test entity | Bootstrap Reviewers | Test decisions |
| 3.2 | Verify test decisions pass all enforcement layers | Technical Lead | Enforcement validation |
| 3.3 | BAC reviews all created identities and test decisions | Full BAC | Sign-off record |
| 3.4 | Close bootstrap window: set `BOOTSTRAP_MODE=closed` | Technical Lead | Config change logged |
| 3.5 | After closure, `authorizedBy: "system-bootstrap"` is REJECTED by all validators | System | Normal enforcement active |

---

## 4. Bootstrap Audit Log Schema

Each bootstrap operation produces an immutable audit entry:

```jsonc
{
  "logId": "uuid",
  "timestamp": "ISO-8601",
  "operation": "BOOTSTRAP_REGISTER" | "BOOTSTRAP_WINDOW_OPEN" | "BOOTSTRAP_WINDOW_CLOSE" | "BOOTSTRAP_TEST_DECISION",
  "targetReviewerId": "sch-*",       // null for window open/close
  "bacMembersPresent": ["name-1", "name-2", ...],
  "consensusReached": true | false,
  "dissentingMembers": ["name"],     // empty if unanimous
  "authorityDocumentRef": "charter-v1.0 §3.2",
  "scopesGranted": ["TECHNICAL", "SCHOLARLY"],
  "qualificationsVerified": true,
  "operatorId": "technical-lead-id",
  "systemConfigSnapshot": { "BOOTSTRAP_MODE": "active" }
}
```

The audit log is append-only and stored in the same storage backend as ReviewDecision records.

---

## 5. Bootstrap Constraints

| Constraint | Description |
|------------|-------------|
| BC-1 | Maximum 20 reviewers may be bootstrapped in a single session |
| BC-2 | Bootstrap window MUST NOT remain open longer than 72 hours |
| BC-3 | No SCHOLARLY scope may be granted during bootstrap without Scholar Advisor sign-off |
| BC-4 | AUTOMATED_AGENT identities may NOT be bootstrapped; they are registered post-bootstrap via normal authorization |
| BC-5 | Bootstrap-created identities are indistinguishable from normally-created ones after bootstrap closure |
| BC-6 | The `system-bootstrap` authorizer string is reserved and cannot be used as a real reviewer ID |
| BC-7 | If bootstrap window closes before all candidates are registered, remaining candidates require normal authorization |

---

## 6. Post-Bootstrap Transition

After bootstrap closure:

1. **Normal authorization chain activates.** All new ReviewerIdentity creations require `authorizedBy` referencing an existing active reviewer with appropriate scope.
2. **Bootstrap reviewers can authorize others.** They hold full authority per their granted scopes.
3. **Audit log remains accessible.** Future auditors can trace every initial identity to its bootstrap origin.
4. **Re-bootstrap requires governance amendment.** If additional bootstrap is needed (e.g., all initial reviewers become unavailable), a formal governance amendment process must re-open the window with fresh BAC approval.

---

## 7. Integration Points

| Entity/System | Integration |
|---------------|-------------|
| ReviewerIdentity.authorizationChain | Contains `system-bootstrap` entries during bootstrap phase |
| Enforcement Middleware (Layer 1) | ReviewerAuthorizationValidator bypassed when `BOOTSTRAP_MODE=active` |
| System Configuration | `BOOTSTRAP_MODE` flag controls validator behavior |
| Bootstrap Audit Log | New append-only log specific to bootstrap operations |
| WS3-PERMISSION-TEST-CASES | Bootstrap test cases validate the entire process |

---

*End of Specification*
