# MFD-08 Scholarly Governance Framework

**Date:** November 12, 2026  
**Status:** ✅ Infrastructure Complete — Pending Human Review  

## Executive Summary

MFD-08 has established the technical infrastructure for scholarly review but has **not** manufactured scholarly authority. All mappings remain in `pending-scholarly-review` status. No automated system has claimed scholarly approval.

## Review Workflow Implementation

### Review Statuses

The system supports the following review statuses:

| Status | Meaning | Can Be Set By |
|--------|---------|---------------|
| `pending-scholarly-review` | Default state, awaiting review | Automated systems |
| `under-review` | Currently being reviewed by qualified scholar | Authorized reviewers only |
| `needs-revision` | Requires changes before approval | Authorized reviewers only |
| `scholarly-approved` | Verified by qualified human reviewer | Authorized reviewers only |
| `rejected` | Does not meet scholarly standards | Authorized reviewers only |

### Critical Safeguards

1. **No automated approval** — Validators cannot set `scholarly-approved`
2. **No fabricated reviewers** — System does not invent reviewer identities
3. **No automatic authority** — Algorithmic confidence ≠ scholarly verification
4. **Pending by default** — All new mappings start as pending
5. **Audit trail** — Review decisions must record reviewer, timestamp, and notes

### Reviewer Metadata Schema

```typescript
interface ReviewerMetadata {
  reviewerId: string;
  reviewerName?: string;
  qualificationDescription?: string;
  reviewScope: string[];
  reviewTimestamp: string;
  reviewNotes?: string;
  decision: 'approved' | 'rejected' | 'needs-revision';
}
```

**Note:** This schema is defined but not yet populated. No qualified reviewers have been assigned.

## Current Review Status

### Ayah Mappings

- **Total mappings:** 789
- **Status:** All `pending-scholarly-review`
- **Approved:** 0
- **Rejected:** 0
- **Under review:** 0

### Root Connections

- **Total roots:** 1,642
- **Activated:** 1,471
- **Partially activated:** 103
- **Needs review:** 68
- **Scholarly verified:** 0

All root-topic connections are labeled as:
- "Suggested connections"
- "Heuristic suggestions"
- "Not authoritative scholarly classifications"
- "Requires linguistic verification"

### Mapping Types

All 8 mapping types are defined with user-friendly labels:

1. DIRECT_REFERENCE — Direct Quranic reference
2. EXPLICIT_INSTRUCTION — Explicit Quranic instruction
3. THEMATIC_REFERENCE — Thematic connection
4. GENERAL_QURANIC_PRINCIPLE — General Quranic principle
5. PROPHETIC_NARRATIVE — Prophetic narrative
6. TAFSIR_SUPPORTED — Tafsir-supported association
7. EDITORIAL_CROSS_REFERENCE — Editorial cross-reference
8. CONTEMPORARY_APPLICATION — Contemporary application

**Important:** These labels describe the *type* of connection, not its scholarly verification status.

## What MFD-08 Did NOT Do

MFD-08 explicitly did **not**:

- ❌ Claim scholarly approval for any mapping
- ❌ Fabricate reviewer identities
- ❌ Automatically approve religious content
- ❌ Present heuristic matches as verified linguistics
- ❌ Manufacture scholarly authority
- ❌ Activate AI-generated religious answers

## What MFD-08 Did Do

MFD-08 successfully:

- ✅ Established review status infrastructure
- ✅ Created reviewer metadata schema
- ✅ Implemented visual indicators for review status
- ✅ Labeled all heuristic connections appropriately
- ✅ Preserved pending status for all mappings
- ✅ Documented review workflow requirements
- ✅ Prevented automated scholarly approval
- ✅ Created review queue for 68 roots needing linguistic review

## Requirements for Scholarly Completion

To move from **technical completion** to **scholarly completion**, the following is required:

### 1. Qualified Reviewers

- Identify qualified Islamic scholars with expertise in:
  - Quranic exegesis (Tafsir)
  - Arabic linguistics
  - Hadith sciences
  - Islamic jurisprudence (Fiqh)
- Document their qualifications
- Assign review scope

### 2. Review Process

- Scholars review each mapping's rationale
- Scholars verify Quranic references
- Scholars assess root-topic connections
- Scholars document decisions with reasoning
- Scholars sign off with timestamp

### 3. Approval Workflow

- Only authorized reviewers can change status
- Each approval records:
  - Reviewer ID
  - Reviewer name (or approved display identity)
  - Qualification description
  - Review timestamp
  - Review notes
  - Decision (approved/rejected/needs-revision)

### 4. Audit Trail

- Preserve original mapping
- Preserve proposed changes
- Preserve reviewer decision
- Preserve revisions
- Preserve final approval or rejection

## Current Blockers

### Blocker 1: No Qualified Reviewers Assigned

**Status:** BLOCKED  
**Reason:** MFD-08 cannot manufacture scholarly authority  
**Resolution:** Requires human governance decision to identify and engage qualified reviewers

### Blocker 2: No Review Interface

**Status:** NOT IMPLEMENTED  
**Reason:** Account-free architecture prevents authenticated reviewer workflows  
**Resolution:** Future governance decision required — may need separate authenticated system for scholarly review

### Blocker 3: No Review History

**Status:** NOT IMPLEMENTED  
**Reason:** No reviews have occurred yet  
**Resolution:** Will be implemented when reviewers are assigned

## Technical Infrastructure Ready

The following technical infrastructure is in place and ready for scholarly review:

### Data Model

- Review status field on all mappings
- Reviewer metadata schema defined
- Review timestamp support
- Review notes field
- Decision tracking (approved/rejected/needs-revision)

### User Interface

- Visual indicators for review status
- Color-coded badges (amber for pending, emerald for approved, rose for needs-revision)
- Provenance display
- Source attribution
- Mapping type labels with descriptions

### Validation

- Automated validators check structural integrity
- Validators cannot set scholarly approval
- Validators flag issues for human review
- Review queues generated for roots needing linguistic review

## Compliance with MFD-08 Requirements

- ✅ FR-025 (Source attribution) — All sources show attribution
- ✅ FR-026 (Licensing compliance) — All sources properly licensed
- ✅ FR-027 (No AI religious answers) — AI feature remains disabled
- ✅ FR-028 (Distinguish verified vs heuristic) — Clear labeling throughout
- ✅ FR-029 (Review status visibility) — Status indicators implemented
- ✅ FR-030 (Tafsir attribution) — All tafsirs show author/period
- ✅ FR-031 (External link transparency) — Clear indication of link-out content
- ✅ FR-032 (Mapping type clarity) — User-friendly labels and descriptions
- ✅ FR-033 (No misleading claims) — Heuristic connections properly labeled
- ✅ Workstream I (Scholarly review governance) — Infrastructure complete, pending human review

## Conclusion

MFD-08 has achieved **technical completion** of the scholarly governance framework. The system is ready for qualified human scholarly review but has not claimed any scholarly authority.

**Status:** ✅ TECHNICAL COMPLETE — ⏳ PENDING HUMAN SCHOLARLY REVIEW

The infrastructure is in place. The next step requires a human governance decision to identify and engage qualified reviewers.
