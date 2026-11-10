# Three-Dimension Quality Model

**Sprint 54** | November 11, 2026

## Overview

The Al-Huda Quranic Topics application uses a three-dimension quality model to independently track different aspects of content quality. This separation ensures that technical validation, editorial completeness, and scholarly review are treated as distinct concerns.

## The Three Dimensions

### 1. Technical Integrity

**Purpose:** Validates that data structures are correct and internally consistent.

**Checks:**
- All ayah references (surah:ayah) exist in the Quran
- No duplicate ayah references within a topic
- All required fields are present
- All relations have valid types
- All rationales are non-empty

**Status Values:**
- `passed` — All technical checks pass
- `failed` — One or more technical checks failed
- `not_checked` — Validation not yet run

**Implementation:**
```typescript
validateTopicTechnicalIntegrity(topic: Topic): TechnicalIntegrityResult
validateJourneyTechnicalIntegrity(journey: StudyJourney): TechnicalIntegrityResult
```

**Key Principle:** Technical integrity is binary — either the data is structurally valid or it isn't. This dimension does not assess content quality, only structural correctness.

### 2. Editorial Completeness

**Purpose:** Tracks whether content has the required editorial metadata.

**Checks:**
- `editorialDescription` present and >50 characters
- `knownLimitations` is a non-empty array
- `reviewState` is a valid value (draft, needs_review, reviewed, published)
- All ayah references have rationales
- Urdu translation status (optional, tracked separately)

**Status Values:**
- `complete` — All required editorial elements present
- `incomplete` — Missing required editorial elements
- `needs_review` — Has elements but quality uncertain
- `not_applicable` — Editorial metadata not required

**Implementation:**
```typescript
validateTopicEditorialCompleteness(topic: Topic): EditorialCompletenessResult
validateJourneyEditorialCompleteness(journey: StudyJourney): EditorialCompletenessResult
```

**Key Principle:** Editorial completeness is about process, not quality. A topic can be editorially complete (has all metadata) while still being technically invalid (bad ayah references) or pending scholarly review.

### 3. Scholarly Review

**Purpose:** Tracks whether content has been reviewed by qualified scholars.

**Status Values:**
- `pending` — Not yet submitted for scholarly review
- `in_review` — Currently under scholarly review
- `reviewed` — Scholarly review completed
- `revision_requested` — Scholar requested changes

**Implementation:**
```typescript
validateTopicScholarlyReview(topic: Topic): ScholarlyReviewResult
validateJourneyScholarlyReview(journey: StudyJourney): ScholarlyReviewResult
```

**Key Principle:** Scholarly review is independent of technical and editorial status. A topic can be technically valid and editorially complete while still pending scholarly review. **No AI-generated content is treated as scholarly review.**

## Dimension Independence

The three dimensions are **fully independent**:

✅ A topic can pass technical validation but still be `pending-scholarly-review`  
✅ A topic can be editorially complete but have technical failures  
✅ A topic can be scholarly reviewed but have incomplete editorial metadata  

**Example:**
```
Topic: "patience"
- Technical Integrity: passed (all ayah refs valid)
- Editorial Completeness: complete (has description, limitations, review state)
- Scholarly Review: pending (no scholar has reviewed yet)
```

This is the **correct and expected state** for all 18 topics after Sprint 53.

## Policy Decisions

### Decision 1: No Fabricated Scholarly Approvals

**Rule:** Never set `provenance.status` to anything other than `pending-scholarly-review` unless a real scholar has reviewed the content.

**Rationale:**
- AI-generated analysis is not scholarly review
- Fabricating reviewer names or credentials is unethical
- Users must know when content is AI-curated vs. scholar-approved
- Transparency builds trust

**Implementation:**
- All 18 topics have `provenance.status: "pending-scholarly-review"`
- Editorial dashboard displays this status prominently
- No automated process can change this status

### Decision 2: Urdu Translation Workflow

**Rule:** Urdu translations require verified human translation and review.

**Rationale:**
- Religious content requires accurate translation
- Auto-generated translations risk theological errors
- Translation review is a separate scholarly process
- Users deserve verified translations, not machine guesses

**Implementation:**
- `urduTitle` field exists but is undefined for all topics
- Separate localStorage key (`alhuda.urdu-translations.v1`) for translation records
- Translation records have their own review lifecycle
- Editorial dashboard shows translation status as informational, not error

### Decision 3: Editorial Metadata ≠ Scholarly Approval

**Rule:** Sprint 53's editorial metadata enhancement is not scholarly review.

**Rationale:**
- Editorial metadata (descriptions, limitations) improves transparency
- But it doesn't validate theological accuracy
- Scholarly review requires domain expertise
- Users must distinguish between "editorially complete" and "scholarly approved"

**Implementation:**
- `reviewState: "reviewed"` = editorial workflow state (has metadata)
- `provenance.status: "pending-scholarly-review"` = scholarly status
- These are displayed separately in the editorial dashboard

## Quality State Structure

```typescript
interface QualityState {
  technical: TechnicalIntegrityResult;
  editorial: EditorialCompletenessResult;
  scholarly: ScholarlyReviewResult;
  lastValidated: string; // ISO timestamp
}

interface QualitySummary {
  totalTopics: number;
  technicalPassed: number;
  technicalFailed: number;
  editorialComplete: number;
  editorialIncomplete: number;
  scholarlyPending: number;
  scholarlyReviewed: number;
}
```

## Editorial Dashboard

The editorial dashboard (`/editorial/quality`) displays all three dimensions:

1. **Technical Integrity Section**
   - Shows pass/fail counts
   - Lists specific failures (invalid refs, duplicates, missing fields)
   - Color-coded: green (pass), red (fail)

2. **Editorial Completeness Section**
   - Shows complete/incomplete counts
   - Lists missing elements
   - Color-coded: green (complete), yellow (incomplete)

3. **Scholarly Review Section**
   - Shows pending/reviewed counts
   - Emphasizes that all topics are pending scholarly review
   - Color-coded: blue (pending), green (reviewed)

**Dashboard Policy:**
- Noindex, nofollow (not for public consumption)
- Internal tool for editorial team
- Displays real-time validation results
- Does not auto-fix issues (manual review required)

## Validation Functions

All validation functions are pure and side-effect free:

```typescript
// Topic validation
validateTopicTechnicalIntegrity(topic: Topic): TechnicalIntegrityResult
validateTopicEditorialCompleteness(topic: Topic): EditorialCompletenessResult
validateTopicScholarlyReview(topic: Topic): ScholarlyReviewResult
buildTopicQualityState(topic: Topic): QualityState

// Journey validation
validateJourneyTechnicalIntegrity(journey: StudyJourney): TechnicalIntegrityResult
validateJourneyEditorialCompleteness(journey: StudyJourney): EditorialCompletenessResult
validateJourneyScholarlyReview(journey: StudyJourney): ScholarlyReviewResult
buildJourneyQualityState(journey: StudyJourney): QualityState
```

**Testing:**
- All validation functions have comprehensive test coverage
- Tests verify dimension independence
- Tests verify no false positives/negatives
- See `src/lib/quality/quality.test.ts` (16 tests)

## Audit Scripts

Automated audit scripts validate quality across the entire dataset:

1. **`scripts/audit-topic-quality-54.mjs`**
   - Validates all 18 topics
   - Checks editorial, technical, translation dimensions
   - Exit 0 = audit completed (issues may exist)
   - Exit 1 = critical failure

2. **`scripts/audit-journey-quality-54.mjs`**
   - Validates all 4 journeys (20 stages)
   - Checks educational quality, progression, prerequisites
   - Exit 0 = audit completed
   - Exit 1 = critical failure

3. **`scripts/audit-reflection-integrity.mjs`**
   - Validates reflection system data integrity
   - Checks storage, privacy, corruption recovery
   - Exit 0 = all checks pass
   - Exit 1 = integrity issues found

4. **`scripts/audit-urdu-translation-completeness.mjs`**
   - Validates Urdu translation infrastructure
   - Checks that no auto-generated translations exist
   - Exit 0 = policy compliant
   - Exit 1 = policy violations

## Current State (Post-Sprint 54)

### Topics (18 total)
- **Technical Integrity:** 18/18 passed (100%)
- **Editorial Completeness:** 18/18 complete (100%)
- **Scholarly Review:** 0/18 reviewed (0% — all pending, by design)
- **Urdu Translations:** 0/18 translated (0% — awaiting human translation)

### Journeys (4 total, 20 stages)
- **Technical Integrity:** 4/4 passed (100%)
- **Editorial Completeness:** 4/4 complete (100%)
- **Scholarly Review:** 0/4 reviewed (0% — all pending, by design)

### Reflection System
- **Data Integrity:** Passed (no corruption, privacy verified)
- **Backup Compatibility:** Passed (v3-v9 migration tested)
- **Storage:** Production-ready (localStorage-backed)

## Future Work

### Scholarly Review Process
- Establish review workflow with qualified scholars
- Create review submission interface
- Track review status changes
- Document reviewer credentials (with permission)

### Urdu Translation Workflow
- Recruit qualified translators
- Implement translation review interface
- Track translation status through lifecycle
- Publish verified translations

### Continuous Quality Monitoring
- Run audit scripts in CI/CD pipeline
- Alert on quality regressions
- Track quality metrics over time
- Generate quality reports for stakeholders

## References

- **Implementation:** `src/lib/quality/validation.ts`
- **Types:** `src/lib/quality/types.ts`
- **Tests:** `src/lib/quality/quality.test.ts`
- **Dashboard:** `src/app/editorial/quality/page.tsx`
- **Sprint 53 Report:** `docs/SPRINT-53-REPORT.md`
- **Sprint 54 Report:** `docs/SPRINT-54-REPORT.md`
- **Urdu Translation Workflow:** `docs/URDU-TRANSLATION-REVIEW.md`
