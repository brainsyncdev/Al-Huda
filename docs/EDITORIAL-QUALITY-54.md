# Editorial Quality Dashboard — Sprint 54

**Date:** November 11, 2026  
**URL:** `/editorial/quality`  
**Access:** Internal only (noindex, nofollow)

## Overview

The Editorial Quality Dashboard provides a comprehensive view of content quality across three independent dimensions:

1. **Technical Integrity** — Data structure validation
2. **Editorial Completeness** — Metadata completeness
3. **Scholarly Review** — Scholar approval status

This dashboard is an internal tool for the editorial team to monitor content quality and identify areas needing attention.

## Dashboard Sections

### 1. Technical Integrity

**Purpose:** Verify that all data structures are valid and internally consistent.

**Metrics Displayed:**
- Total topics/journeys validated
- Pass count (green)
- Fail count (red)
- Specific failure details

**Checks Performed:**
- ✅ All ayah references exist in the Quran
- ✅ No duplicate ayah references
- ✅ All required fields present
- ✅ All relations have valid types
- ✅ All rationales are non-empty

**Current Status:**
- Topics: 18/18 passed (100%)
- Journeys: 4/4 passed (100%)

**Action Required:** None — all technical checks pass.

### 2. Editorial Completeness

**Purpose:** Track whether content has required editorial metadata.

**Metrics Displayed:**
- Complete count (green)
- Incomplete count (yellow)
- Missing elements list

**Checks Performed:**
- ✅ `editorialDescription` present and >50 chars
- ✅ `knownLimitations` is non-empty array
- ✅ `reviewState` is valid
- ✅ All ayah references have rationales
- ℹ️ Urdu translation status (informational)

**Current Status:**
- Topics: 18/18 complete (100%)
- Journeys: 4/4 complete (100%)

**Action Required:** None — all editorial metadata present.

### 3. Scholarly Review

**Purpose:** Track scholarly review status (independent of technical/editorial).

**Metrics Displayed:**
- Pending count (blue)
- Reviewed count (green)
- Revision requested count (orange)

**Current Status:**
- Topics: 0/18 reviewed (0% — all pending)
- Journeys: 0/4 reviewed (0% — all pending)

**Action Required:** Establish scholarly review process (future sprint).

**Important Note:** All topics are intentionally in `pending-scholarly-review` status. This is correct — no AI-generated content should be treated as scholarly review.

## Dashboard Design

### Visual Design
- **Layout:** Card-based grid layout
- **Colors:**
  - Green: Passed/Complete/Reviewed
  - Red: Failed
  - Yellow: Incomplete/Needs Review
  - Blue: Pending
  - Orange: Revision Requested
- **Icons:** Lucide React icons (CheckCircle, XCircle, AlertTriangle, Info)
- **Typography:** Tailwind CSS utility classes

### Information Architecture
1. **Header** — Page title and description
2. **Summary Cards** — High-level metrics for each dimension
3. **Detailed Sections** — Breakdown by dimension
4. **Issue Lists** — Specific problems requiring attention
5. **Footer** — Last validated timestamp

### Accessibility
- Semantic HTML
- ARIA labels where appropriate
- Color is not the only indicator (icons + text)
- Keyboard navigable
- Screen reader friendly

## Implementation Details

### File Location
`src/app/editorial/quality/page.tsx`

### Dependencies
- Next.js 15.3.8 App Router
- React 19
- Tailwind CSS
- Lucide React (icons)
- Quality validation functions from `@/lib/quality/validation`

### Data Flow
1. Import all topics and journeys
2. Run validation functions for each item
3. Aggregate results into metrics
4. Render dashboard with current state

### Performance
- Server-side rendering (no client-side state)
- Validation runs on every page load
- No caching (data is small, validation is fast)
- Noindex prevents search engine indexing

## Usage Guidelines

### Who Should Use This Dashboard?
- Editorial team members
- Content curators
- Quality assurance reviewers
- Project managers

### When to Check the Dashboard?
- Before publishing new content
- After making data changes
- During sprint reviews
- When investigating user reports

### What to Do When Issues Are Found?

**Technical Failures:**
1. Identify the failing item (topic/journey)
2. Check the specific failure message
3. Fix the data structure issue
4. Re-run validation
5. Verify the fix

**Editorial Incompleteness:**
1. Identify the incomplete item
2. Add the missing metadata
3. Ensure descriptions are meaningful
4. Document known limitations
5. Re-run validation

**Scholarly Review Pending:**
1. This is expected — no action required
2. When scholarly review process is established, submit content for review
3. Update status when review is complete

## Policy Decisions

### Decision 1: No Auto-Fix

**Rule:** The dashboard displays issues but does not auto-fix them.

**Rationale:**
- Manual review ensures quality
- Auto-fixing risks introducing errors
- Editorial team must understand issues
- Transparency builds trust

### Decision 2: No Public Access

**Rule:** Dashboard is noindex, nofollow — not for public consumption.

**Rationale:**
- Internal tool for editorial team
- Users don't need to see backend quality metrics
- Prevents confusion about content status
- Reduces support burden

### Decision 3: Real-Time Validation

**Rule:** Dashboard validates on every page load (no caching).

**Rationale:**
- Data is small (18 topics, 4 journeys)
- Validation is fast (<100ms)
- Ensures dashboard always shows current state
- No stale data issues

### Decision 4: Three Separate Dimensions

**Rule:** Display technical, editorial, and scholarly dimensions separately.

**Rationale:**
- Dimensions are independent
- Prevents confusion (e.g., "technically valid" ≠ "scholarly approved")
- Clearer action items
- Better mental model for editorial team

## Metrics and KPIs

### Quality Metrics
- **Technical Pass Rate:** % of items passing technical validation
- **Editorial Complete Rate:** % of items with complete metadata
- **Scholarly Review Rate:** % of items with scholarly approval
- **Urdu Translation Rate:** % of items with verified Urdu translations

### Current KPIs (Post-Sprint 54)
- Technical Pass Rate: 100% (22/22)
- Editorial Complete Rate: 100% (22/22)
- Scholarly Review Rate: 0% (0/22) — by design
- Urdu Translation Rate: 0% (0/18) — awaiting human translation

### Target KPIs (Future)
- Technical Pass Rate: ≥95%
- Editorial Complete Rate: ≥90%
- Scholarly Review Rate: ≥50% (after review process established)
- Urdu Translation Rate: ≥25% (after translation workflow established)

## Integration with Audit Scripts

The dashboard complements the automated audit scripts:

| Dashboard | Audit Script | Purpose |
|-----------|--------------|---------|
| Visual overview | `audit-topic-quality-54.mjs` | Quick check vs. detailed report |
| Real-time validation | `audit-journey-quality-54.mjs` | On-demand vs. CI/CD |
| Issue identification | `audit-reflection-integrity.mjs` | Manual vs. automated |
| Status tracking | `audit-urdu-translation-completeness.mjs` | Current state vs. compliance |

**Workflow:**
1. Run audit scripts in CI/CD pipeline
2. Check dashboard for visual overview
3. Investigate issues identified by either
4. Fix issues manually
5. Re-run audit scripts to verify
6. Refresh dashboard to confirm

## Future Enhancements

### Phase 2 (Planned)
- Export quality reports (PDF, CSV)
- Historical trend charts
- Email alerts for quality regressions
- Integration with issue tracker

### Phase 3 (Planned)
- Scholarly review submission interface
- Translation review workflow UI
- Automated quality gates in CI/CD
- Quality scorecards per content type

### Phase 4 (Planned)
- Machine learning for quality prediction
- Anomaly detection
- Automated issue categorization
- Priority-based issue queue

## References

- **Dashboard Code:** `src/app/editorial/quality/page.tsx`
- **Quality Model:** `docs/QUALITY-MODEL.md`
- **Validation Functions:** `src/lib/quality/validation.ts`
- **Audit Scripts:** `scripts/audit-*.mjs`
- **Sprint 54 Report:** `docs/SPRINT-54-REPORT.md`
