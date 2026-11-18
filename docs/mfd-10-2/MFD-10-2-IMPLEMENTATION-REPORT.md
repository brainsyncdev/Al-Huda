# MFD-10.2 — Scholarly Evidence & Review Experience
## Implementation Report

**Status:** COMPLETE  
**Commit:** `1bbf6bc` on `main`  
**Push verified:** `eb43ca4..1bbf6bc main -> main`, exit 0  
**HEAD = origin/main:** ahead/behind 0/0  
**Production Data Modified:** NO — zero taxonomy changes  
**Date:** 2026-11-17

---

## 1. What Was Implemented

MFD-10.2 delivers a trustworthy, traceable human scholarly review experience for Quran Ayah-to-topic mappings within the existing FAHM application. The system was built using exactly 2 specialist subagents + 1 Lead Orchestrator per the directive.

### Agent 1 — Scholarly Evidence & Tafsir Specialist

**Files created:**
- `src/lib/scholarly/evidence.ts` — Pure module: evidence creation, verification, state transitions, validation, summarization
- `src/lib/scholarly/evidence.test.ts` — 41 tests
- `src/components/scholarly/source-attribution.tsx` — Full provenance display for SourceRecord/EvidenceRecord
- `src/components/scholarly/evidence-panel.tsx` — Review workspace panel with 6 visually separate sections
- `src/components/scholarly/mapping-classification.tsx` — Four-category classification display with editorial disclaimer

**Key capabilities:**
- 7 explicit evidence states: NOT_ATTACHED, SOURCE_IDENTIFIED, REFERENCE_PENDING_VERIFICATION, VERIFIED, UNAVAILABLE, RIGHTS_RESTRICTED, REJECTED
- Evidence creation resolves ayah-level URLs from the existing tafsir registry automatically
- Verification requires non-empty verifier ID, notes, AND an ayah-level reference (homepage-only rejected)
- `tafsir-ma(arif)` correctly forces UNAVAILABLE status
- External tafsir sources correctly report `referenceLevel: "HOMEPAGE"`
- Source attribution is always visible text, never hidden in tooltips

### Agent 2 — Review Workflow & Governance Specialist

**Files created:**
- `src/lib/scholarly/reviews.ts` — Pure state machine, validation, append-only recording, governance buckets, priority
- `src/lib/scholarly/reviews.test.ts` — 38 tests
- `src/lib/scholarly/storage.ts` — Total normalizer + localStorage + backup export/restore
- `src/lib/scholarly/storage.test.ts` — 18 tests
- `src/lib/scholarly/context.tsx` — `ScholarlyProvider` / `useScholarly`
- `src/app/editorial/mappings/page.tsx` — Server component, `robots:{index:false,follow:false}`
- `src/app/editorial/mappings/mappings-client.tsx` — Queue + workspace (1,115 lines)

**Key capabilities:**
- Append-only review history: reversals create NEW records, never erase
- APPROVED decisions require rationale + ≥1 VERIFIED evidence explicitly considered
- Six governance buckets: TECHNICALLY_VALIDATED, EVIDENCE_ATTACHED, EVIDENCE_VERIFIED, AWAITING_SCHOLARLY_REVIEW, HUMAN_REVIEWED, GOVERNANCE_APPROVED
- GOVERNANCE_APPROVED can only come from an explicit human APPROVED record, never from technical validation alone
- Reviewer identity defaults to unauthenticated; `credentialVerified` can only become true through explicit governance action
- Five decision categories: APPROVED, REJECTED, REVISION_REQUIRED, INSUFFICIENT_EVIDENCE, DEFERRED
- DEFERRED ≠ rejection; INSUFFICIENT_EVIDENCE ≠ proof mapping is wrong
- Human-set priority (NORMAL/HIGH/LOW), never AI-derived

### Lead Orchestrator — Integration

**Files created/modified:**
- `src/lib/scholarly/types.ts` — Shared data contracts (evidence + review records)
- `src/lib/scholarly/integrity.test.ts` — 12 production integrity regression tests
- `src/lib/backup.ts` — Bumped to BACKUP_VERSION = 10 with scholarly store
- `src/lib/backup-compatibility.test.ts` — Updated for v10 + 10 new v10 migration tests
- `src/components/library/backup-controls.tsx` — Scholarly state in export/import/erase
- `src/app/layout.tsx` — ScholarlyProvider wired into provider tree
- `src/app/explore/topics/[id]/page.tsx` — Fixed pre-existing `Map` constructor shadowing bug
- `tests/fixtures/backup/v10-backup.json` — v10 test fixture

---

## 2. Evidence Data Model

### EvidenceRecord Schema

```typescript
interface EvidenceRecord {
  id: string;                    // "ev-<mappingId>-<sourceId>"
  mappingId: string;             // Reference to mapping
  sourceId: string;              // From src/lib/quran/sources.ts
  sourceTitle: string;           // Cached from source registry
  sourceAuthor: string;          // Cached from source registry
  edition?: string;              // Edition/publication info
  language: string;              // Display-ready label
  volumePage?: string;           // Vol/page reference
  surahNumber: number;           // Surah this evidence references
  ayahNumber: number;            // Ayah this evidence references
  sourceUrl?: string;            // Stable URL or reference path
  excerpt?: string;              // Copyright-compliant excerpt
  evidenceType: "TAFSIR_CLASSICAL" | "TAFSIR_CONTEMPORARY" | "TRANSLATION_NOTE" | "EDITORIAL" | "OTHER";
  status: EvidenceStatus;        // Current verification state
  verifierId?: string;           // Who verified (local, not authenticated)
  verifiedAt?: string;           // ISO timestamp
  verificationNotes?: string;    // Notes from verification
  rightsNote?: string;           // Rights/licensing reference
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

### Evidence States

| State | Meaning |
|---|---|
| NOT_ATTACHED | No tafsir source linked to this mapping |
| SOURCE_IDENTIFIED | Source ID recorded but content not verified |
| REFERENCE_PENDING_VERIFICATION | Specific reference recorded, awaiting human verification |
| VERIFIED | Human confirmed evidence is authentic, accessible, and relevant |
| UNAVAILABLE | Source cannot be accessed (broken link, out of print) |
| RIGHTS_RESTRICTED | Source exists but copyright prevents display |
| REJECTED | Evidence examined and determined not to support mapping |

### ReviewRecord Schema

```typescript
interface ReviewRecord {
  id: string;                    // "rev-<mappingId>-<NNN>"
  mappingId: string;             // Reference to mapping
  reviewerId: string;            // Local identifier (not authenticated)
  reviewerRole?: string;         // Self-declared role note
  decision: ReviewDecision;      // APPROVED|REJECTED|REVISION_REQUIRED|INSUFFICIENT_EVIDENCE|DEFERRED
  rationale: string;             // Mandatory explanation
  evidenceConsidered: string[];  // Evidence record IDs considered
  decidedAt: string;             // ISO timestamp
  previousState: ReviewDecision | null;  // State before this decision
  newState: ReviewDecision;      // State after this decision
}
```

---

## 3. Review Workflow

### Decision Flow

1. Reviewer browses/searches/filters the 789 mappings in `/editorial/mappings`
2. Selects a mapping to view its rationale, classification, evidence, and history
3. Attaches evidence sources (in-app tafsirs auto-resolve ayah-level URLs)
4. Verifies evidence with explicit notes (requires verifier ID + notes + ayah-level reference)
5. Records a decision via the decision form (requires rationale for ALL decisions)
6. APPROVED additionally requires ≥1 VERIFIED evidence in `evidenceConsidered`
7. Explicit confirmation dialog summarizes what will be recorded before committing
8. Decision is appended to history; previous decisions are never erased

### Validation Rules

- Every decision requires non-empty `reviewerId` and non-empty `rationale`
- APPROVED requires `evidenceConsidered.length > 0` AND at least one considered evidence is VERIFIED
- Missing evidence is NEVER interpreted as approval
- Reviewer identity is locally entered and NOT authenticated
- A reviewer is never described as a qualified scholar unless `credentialVerified: true` through explicit governance action

---

## 4. State Transitions

### Allowed Transitions

Any decision may follow any prior state (including UNREVIEWED), because scholarly judgement can legitimately reverse itself as new evidence arrives. The constraint is NOT on which states may follow which; it is that EVERY decision must meet its own requirements before recording.

```
UNREVIEWED → APPROVED | REJECTED | REVISION_REQUIRED | INSUFFICIENT_EVIDENCE | DEFERRED
APPROVED → APPROVED | REJECTED | REVISION_REQUIRED | INSUFFICIENT_EVIDENCE | DEFERRED
REJECTED → APPROVED | REJECTED | REVISION_REQUIRED | INSUFFICIENT_EVIDENCE | DEFERRED
REVISION_REQUIRED → APPROVED | REJECTED | REVISION_REQUIRED | INSUFFICIENT_EVIDENCE | DEFERRED
INSUFFICIENT_EVIDENCE → APPROVED | REJECTED | REVISION_REQUIRED | INSUFFICIENT_EVIDENCE | DEFERRED
DEFERRED → APPROVED | REJECTED | REVISION_REQUIRED | INSUFFICIENT_EVIDENCE | DEFERRED
```

### Governance Buckets

| Bucket | Meaning |
|---|---|
| TECHNICALLY_VALIDATED | Schema checks pass; NOT scholarly approval |
| EVIDENCE_ATTACHED | At least one evidence record exists |
| EVIDENCE_VERIFIED | At least one VERIFIED evidence record |
| AWAITING_SCHOLARLY_REVIEW | Evidence verified but no human decision yet |
| HUMAN_REVIEWED | At least one human decision recorded |
| GOVERNANCE_APPROVED | Explicit human APPROVED decision with verified evidence |

**Critical:** `deriveGovernanceBucket(state, technicallyValidated=true)` with no human decision returns `TECHNICALLY_VALIDATED`, NEVER `GOVERNANCE_APPROVED`.

---

## 5. Reviewer Governance

### Reviewer Identity

- Locally entered, NOT independently authenticated
- Stored as `{ id, displayName, roleNote?, credentialVerified }`
- `credentialVerified` defaults to `false`
- Can only become `true` through an explicit `CredentialVerificationAction` with `verifiedBy` and `basis` fields
- UI always displays "locally entered, not independently authenticated" when `credentialVerified` is false

### Review History

- Append-only: subsequent decisions create NEW records
- Earlier records are never erased or edited
- Reversals are recorded with `previousState` showing the prior decision
- Full history is visible in the workspace detail view

### Priority

- Human-set only: NORMAL | HIGH | LOW
- Stored separately from review decisions
- Never AI-derived
- Does not create a review record

---

## 6. Backup Compatibility

### Envelope Version 10

MFD-10.2 bumps the backup envelope from v9 to v10. The new `scholarly` section contains:

```json
{
  "schemaVersion": 1,
  "reviews": [...],
  "evidence": [...],
  "reviewer": { "id": "", "displayName": "", "credentialVerified": false },
  "priorities": {},
  "lastSavedAt": ""
}
```

### Backward Compatibility

- All v1–v9 envelopes remain readable
- Missing `scholarly` section in older envelopes restores to an empty store (never a guessed one)
- No existing section changes shape
- Round-trip export→import preserves all data
- `normalizeScholarlyState` is TOTAL: never throws, drops only structurally invalid records

### Storage Keys

- `alhuda-scholarly-reviews` — Review records
- `alhuda-scholarly-evidence` — Evidence records

Both keys store the full normalized envelope. Load merges preferring newer `lastSavedAt`.

---

## 7. Known Limitations

1. **Reviewer identity is local and unauthenticated.** No cloud sync, no multi-device support, no independent credential verification.
2. **No automated scholarly credential verification.** Governance action required to mark `credentialVerified: true`.
3. **0/789 mappings have verified tafsir evidence.** The infrastructure exists; human reviewers must use it.
4. **All 789 mappings retain `provenance: "pending-scholarly-review"`.** No auto-approvals occurred.
5. **368 NONEXISTENT topic references, 5 WRONG_PARENT, 6 namespace collisions** remain as editorial decisions outside this implementation phase.
6. **Production build requires `NEXT_PUBLIC_SITE_URL`** environment variable (enforced by `validate-build-env.mjs`). This is a deployment configuration requirement, not a code defect.
7. **External tafsir links are homepage-level only.** Ibn Kathir and Ma'ariful Quran do not have stable ayah-level deep links.
8. **`tafsir-ma(arif)` is marked UNAVAILABLE** because its homepage points to a courses institute, not the tafsir text.

---

## 8. Test Execution Results

### Feature-Specific Tests

| Suite | Tests | Status |
|---|---|---|
| `src/lib/scholarly/evidence.test.ts` | 41 | ✅ PASS |
| `src/lib/scholarly/integrity.test.ts` | 12 | ✅ PASS |
| `src/lib/scholarly/reviews.test.ts` | 38 | ✅ PASS |
| `src/lib/scholarly/storage.test.ts` | 18 | ✅ PASS |
| `src/lib/backup-compatibility.test.ts` | 58 | ✅ PASS |
| **Total** | **167** | **✅ ALL PASS** |

### TypeScript Check

```
npx tsc --noEmit
TSC_EXIT: 0
```

Zero errors. (Pre-existing `Map` shadowing bug in `explore/topics/[id]/page.tsx` was fixed as part of this implementation.)

### Validation Suite

```
node scripts/validate-all.mjs
✅ Quran Data: PASSED
✅ Source Licenses: PASSED
✅ Taxonomy: PASSED
✅ Ayah Mappings: PASSED
✅ Root Registry: PASSED
Total: 5 passed, 0 failed
```

### Production Build

```
npm run build
BLOCKED: NEXT_PUBLIC_SITE_URL is not set.
```

This is a deployment configuration requirement, not a code defect. The build script requires an explicit public origin before producing production artifacts.

### Production Integrity

- All 789 mapping records remain byte-identical (verified by `integrity.test.ts`)
- Quran Arabic text unchanged across all evidence operations
- All mappings retain `provenance: "pending-scholarly-review"` and `status: "MAPPED"`
- Mapping type distribution unchanged: DIRECT_REFERENCE=468, THEMATIC_REFERENCE=128, EXPLICIT_INSTRUCTION=115, PROPHETIC_NARRATIVE=78
- Public AI religious answers remain OFF (`AI_ANSWER_FEATURE_ENABLED = false as const`)

---

## 9. What Remains Pending Scholarly Input

- All 789 mappings require human scholarly review using the new workspace
- 0/789 mappings currently have verified tafsir evidence
- Reviewer credentials must be verified through governance process before `credentialVerified` can be set to true
- The 368 NONEXISTENT topic references, 5 WRONG_PARENT references, and 6 namespace collisions from MFD-09.2.4 remain as editorial decisions requiring human judgment

---

## 10. Git Evidence

- **Branch:** main
- **Commit:** `1bbf6bc` — 20 files changed, 5,968 insertions(+), 13 deletions(-)
- **Push:** `eb43ca4..1bbf6bc main -> main`, exit 0
- **Remote sync:** HEAD = origin/main, ahead/behind 0/0
- **Working tree:** Clean (only 36 pre-existing unrelated deletions of docs/FAHM-MFD-* files, preserved as-is)
- **Production taxonomy:** Zero changes staged or committed

---

## 11. Files Changed in This Implementation

### New Files (17)
- `src/lib/scholarly/types.ts`
- `src/lib/scholarly/evidence.ts`
- `src/lib/scholarly/evidence.test.ts`
- `src/lib/scholarly/reviews.ts`
- `src/lib/scholarly/reviews.test.ts`
- `src/lib/scholarly/storage.ts`
- `src/lib/scholarly/storage.test.ts`
- `src/lib/scholarly/context.tsx`
- `src/lib/scholarly/integrity.test.ts`
- `src/components/scholarly/source-attribution.tsx`
- `src/components/scholarly/evidence-panel.tsx`
- `src/components/scholarly/mapping-classification.tsx`
- `src/app/editorial/mappings/page.tsx`
- `src/app/editorial/mappings/mappings-client.tsx`
- `tests/fixtures/backup/v10-backup.json`
- `docs/mfd-10-2/MFD-10-2-IMPLEMENTATION-REPORT.md` (this file)

### Modified Files (5)
- `src/lib/backup.ts` — v10 envelope
- `src/lib/backup-compatibility.test.ts` — v10 tests
- `src/components/library/backup-controls.tsx` — Scholarly store integration
- `src/app/layout.tsx` — ScholarlyProvider wiring
- `src/app/explore/topics/[id]/page.tsx` — Map shadowing fix

---

*Per the explicit stopping rule: no MFD-10.2.1 will be initiated. If an implementation defect is discovered, it will be fixed directly within MFD-10.2.*
