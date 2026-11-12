# FAHM Information Architecture — Final Review Readiness Report

**Document Status:** ✅ READY FOR PRODUCT-OWNER APPROVAL  
**Date:** November 11, 2026  
**Baseline:** Sprint 54 (commit `e875bbd`)  
**Companion Documents:**
- `docs/FAHM-IA-FINAL-RECONCILIATION.md` (authoritative decisions)
- `docs/FAHM-IA-FINAL-IMPLEMENTATION-PLAN.md` (phased implementation plan)

---

## Executive Summary

All documentation inconsistencies identified during product-owner review have been resolved. The three authoritative documents now present a single, internally consistent view of the FAHM information architecture and implementation plan.

**Final Status:** ✅ **READY FOR PRODUCT-OWNER APPROVAL**

---

## 1. Corrections Performed

### 1.1 HTTP Redirect Status Codes (301 → 308)

**Issue:** Documents incorrectly specified HTTP 301 for route migrations. Next.js 15 `next.config.js` redirects with `permanent: true` produce HTTP 308, not 301.

**Corrections Applied:**

| Document | Lines Updated | Change |
|---|---|---|
| `FAHM-IA-FINAL-RECONCILIATION.md` | §11.1, §14.1 | All redirect tables now specify HTTP 308 |
| `FAHM-IA-FINAL-IMPLEMENTATION-PLAN.md` | §1.4, §3.4, §3.6, §3.8, §3.9, §4.5, §4.7, §5.7, §5.9, §5.10, §7.3, §7.4, §8.2, §8.3 | All acceptance criteria, code examples, and testing requirements now specify HTTP 308 |
| `FAHM-IA-IMPLEMENTATION-ROADMAP.md` | §Key Principles, §Phase 2, §Phase 3, §Phase 4, §Route Migration Table, §Deep Links, §Testing | All references updated to HTTP 308 |

**Redirect Strategy (Authoritative):**

```js
// next.config.js
async redirects() {
  return [
    {
      source: '/library',
      destination: '/my-study',
      permanent: true,  // HTTP 308
    },
    // ... all other migrations use permanent: true
  ];
}
```

**Key Points:**
- `permanent: true` produces HTTP 308 (permanent, method- and body-preserving)
- App Router `redirect()` produces HTTP 307 by default and is **not** used
- `redirect(url, 'replace')` does **not** produce HTTP 301
- Query strings are automatically forwarded by `next.config.js` redirects
- Dynamic parameters (`:slug`, `:root`) are forwarded via `:param` syntax

### 1.2 Discover Migration Scope

**Issue:** Inconsistency between executive summary, Discover analysis, and Phase 4 implementation plan regarding what content to migrate.

**Resolution:**

**Unique Content Worth Preserving:**
- ✅ Audience-based recommended paths (Beginner, Intermediate, Advanced, Scholar)
  - Uses existing `RECOMMENDED_PATHS`, `PATHS`, `AUDIENCE_LABELS`, `AUDIENCE_DESCRIPTIONS` data
  - No new recommendation logic required

**Content Already Represented on `/explore` (No Migration Needed):**
- ❌ Broadest themes — already accessible via Topics hub
- ❌ All 15 dimensions — already rendered inline on `/explore`
- ❌ Go Deeper cards — just navigation links
- ❌ Hero section — redundant with Home hero

**Final Decision:**
1. Migrate **only** the audience-based paths section to `/explore`
2. Reuse existing recommendation data and components
3. Preserve all existing Explore functionality
4. Do not introduce new recommendation algorithms or learning features
5. Redirect `/discover` → `/explore` (HTTP 308) **after** audience-paths migration completes

**Classification:** Category 2 (existing functionality restructuring) — reuses existing data without expansion.

### 1.3 Category 2 vs Category 3 Classification

**Issue:** Audience-path migration was inconsistently classified.

**Authoritative Definitions:**

**Category 1 — Navigation-only:**
- Navigation visibility, ordering, labels, responsive behavior
- No route changes, no content changes

**Category 2 — Existing functionality restructuring:**
- Route consolidation, content relocation, component reuse
- Existing functionality reorganized without changing behavior
- **Audience-paths migration is Category 2** — reuses existing `RECOMMENDED_PATHS` data

**Category 3 — New functionality (requires separate approval):**
- New recommendation logic, data aggregation, user-facing capabilities
- Search palette, breadcrumbs, loading skeletons, empty states
- **Audience-paths migration is NOT Category 3** — no new logic introduced

### 1.4 LearnNav Mobile Responsive Specification

**Issue:** Implementation plan acknowledged possible overflow at 320px but did not establish definitive responsive specification.

**Resolution:** Added §4.7.1 to implementation plan with explicit requirements:

**Requirements:**
- All six destinations (Dashboard, Journeys, Paths, Plans, Revise, Quiz) must remain accessible at all viewport widths
- No tab may disappear or be hidden on smaller screens
- No horizontal page overflow (no scrollbars on the page itself)
- Keyboard accessible (Tab key cycles through all tabs)
- Visible active state (highlighted tab with `aria-current="page"`)

**Responsive Layout Strategy:**
- **Desktop (768px+):** Horizontal tab bar, full labels visible
- **Tablet (375px–767px):** Horizontal tab bar, labels may truncate with ellipsis if needed
- **Mobile (320px–374px):** Horizontal tab bar with horizontal scrolling within the tab container (not the page). Each tab maintains minimum touch target of 44×44px. Use `overflow-x: auto` with `-webkit-overflow-scrolling: touch` for smooth scrolling on iOS.

**Testing:**
- Visual test at 320px, 375px, 768px, 1024px, 1440px widths
- Keyboard test: Tab through all 6 tabs, verify focus visible
- Touch test: swipe horizontally on mobile to access all tabs
- Active state test: verify correct tab highlighted on each route

### 1.5 Backup/Restore Functionality Clarification

**Issue:** Implementation plan required existing backup/restore to remain working, but Category 3 table listed "Import/restore functionality" as new feature.

**Resolution:**

**Existing functionality (PRESERVED — verified in source):**
- ✅ `BackupControls` component at `src/components/library/backup-controls.tsx` (250 lines)
- ✅ Export functionality (`handleExport` function, lines 67-90)
- ✅ Import functionality (`handleFile` function with `parseBackup` + `restoreState`, lines 92-169)
- ✅ Delete all data functionality (`handleErase` function, lines 171-195)
- ✅ Backup JSON compatibility (v1, v2, v3 formats supported)
- ✅ All localStorage keys preserved
- ✅ Privacy and data-management controls

**This is NOT new functionality.** It is existing functionality that must be preserved through all route migrations.

**Removed from Category 3:** "Import/restore functionality" entry removed from deferred-scope table.

**New functionality (DEFERRED to Category 3):**
- New backup import workflows not currently implemented
- New restore capabilities not currently implemented
- New backup formats or schema migrations
- Cloud backup or synchronization
- Account-based data recovery

### 1.6 Data Preservation Acceptance Criteria

**Issue:** Data preservation checks were mentioned but not made mandatory release criteria.

**Resolution:** Added explicit data preservation acceptance criteria to all relevant phases:

**Phase 2 (Route Consolidation):**
- [ ] Existing bookmarks remain accessible at `/my-study/bookmarks`
- [ ] Existing notes remain accessible at `/my-study/notes`
- [ ] Existing collections remain accessible at `/my-study/collections`
- [ ] Existing reading history remains accessible at `/my-study`
- [ ] Backup and restore continue to work via `/my-study/settings`
- [ ] All localStorage keys unchanged (`alhuda.library.v1`, etc.)
- [ ] Existing backup JSON files remain compatible

**Phase 3 (Learn Reorganization):**
- [ ] Existing journey progress intact (stored in `alhuda.journeys.v1`)
- [ ] All localStorage keys unchanged

**Testing Requirements:**
- Data preservation test: create test bookmarks/notes/collections before migration, verify accessible after
- Data preservation test: create test journey progress before migration, verify intact after

**Mandatory Release Checks:**
- Existing bookmarks remain accessible
- Existing notes remain accessible
- Existing collections remain accessible
- Existing reading history remains accessible
- Existing journey progress remains intact
- Backup and restore continue to work
- Existing localStorage keys remain unchanged
- Existing backup compatibility remains intact

**Constraint:** No account system, cloud synchronization, or database migration may be introduced.

---

## 2. Final Redirect Strategy

### 2.1 Implementation Method

All route migrations use `next.config.js` `redirects()` with `permanent: true`, which produces **HTTP 308** (permanent, method- and body-preserving) in Next.js 15.

### 2.2 Expected HTTP Status

| Old Route | New Route | HTTP Status | Implementation |
|---|---|---|---|
| `/library` | `/my-study` | 308 | `next.config.js` `redirects()` entry |
| `/library/notes` | `/my-study/notes` | 308 | `next.config.js` `redirects()` entry |
| `/study-journeys` | `/learn/journeys` | 308 | `next.config.js` `redirects()` entry |
| `/study-journeys/[slug]` | `/learn/journeys/[slug]` | 308 | `next.config.js` `redirects()` entry with `:slug` parameter |
| `/explore/topics` | `/topics` | 308 | `next.config.js` `redirects()` entry |
| `/explore/topics/[slug]` | `/topics/[slug]` | 308 | `next.config.js` `redirects()` entry with `:slug` parameter |
| `/discover` | `/explore` | 308 | `next.config.js` `redirects()` entry (after content migration) |

### 2.3 Query-String and Path-Parameter Preservation

- **Query strings:** Automatically forwarded by Next.js `redirects()`. No additional configuration needed.
- **Path parameters:** Forwarded via `:param` syntax (e.g., `:slug`, `:root`).

### 2.4 Verification Requirements

All redirects must be verified with `curl -I`:
- HTTP status is 308 (not 301, 302, or 307)
- Target route resolves correctly
- Query strings preserved
- Path parameters preserved (for dynamic routes)

---

## 3. Final Discover Migration Scope

### 3.1 What to Migrate

**Only the audience-based recommended paths section:**
- Section heading: "Start with a path"
- Audience-based recommended paths (Beginner, Intermediate, Advanced, Scholar)
- Each card links to `/learn/paths/[slug]`
- Uses existing `RECOMMENDED_PATHS`, `PATHS`, `AUDIENCE_LABELS`, `AUDIENCE_DESCRIPTIONS` data from `@/lib/paths/data`

### 3.2 What NOT to Migrate

- Broadest themes (already accessible via Topics hub on `/explore`)
- All 15 dimensions (already rendered inline on `/explore`)
- Go Deeper cards (just navigation links)
- Hero section (redundant with Home hero)

### 3.3 Implementation Sequence

1. Add audience-paths section to `/explore` page
2. Reuse existing recommendation data and components
3. Verify all 4 audience paths accessible from `/explore`
4. **Then** redirect `/discover` → `/explore` (HTTP 308)
5. Remove Discover from desktop nav (already done in Phase 1)

### 3.4 Out of Scope

- No new recommendation algorithms
- No new learning features
- No new data aggregation
- Strictly a relocation of existing audience-path content

---

## 4. Final Feature Classification

### 4.1 Category 1 — Navigation-Only Changes

| Change | Files Affected |
|---|---|
| Add My Study to desktop header | `src/components/layout/site-header.tsx` |
| Add My Study to mobile bottom nav | `src/components/layout/mobile-bottom-nav.tsx` |
| Remove redundant desktop nav items | `src/components/layout/site-header.tsx` |
| Remove Search, Library, Settings from mobile bottom nav | `src/components/layout/mobile-bottom-nav.tsx` |
| Add Dashboard + Journeys tabs to LearnNav | `src/components/learn/learn-nav.tsx` |
| Fix "10 Dimensions" → "15 Dimensions" | `src/app/explore/page.tsx` |
| Add slim mobile header with search icon | New component or `src/app/layout.tsx` |

### 4.2 Category 2 — Existing Functionality Restructuring

| Change | Files Affected | Notes |
|---|---|---|
| Redirect `/library` → `/my-study` | `next.config.js` | HTTP 308 |
| Redirect `/library/notes` → `/my-study/notes` | `next.config.js` | HTTP 308 |
| Move `/study-journeys` → `/learn/journeys` | File move + `next.config.js` redirect | HTTP 308 |
| Move `/study-journeys/[slug]` → `/learn/journeys/[slug]` | File move + `next.config.js` redirect | HTTP 308, preserves `:slug` parameter |
| Redirect `/explore/topics` → `/topics` | `next.config.js` | HTTP 308 |
| Redirect `/explore/topics/[slug]` → `/topics/[slug]` | `next.config.js` | HTTP 308, preserves `:slug` parameter |
| Migrate audience-paths section from `/discover` to `/explore` | `src/app/explore/page.tsx` (add section) | Reuses existing `RECOMMENDED_PATHS` data; no new logic |
| Redirect `/discover` → `/explore` | `next.config.js` | HTTP 308, **after** audience-paths migration completes |

### 4.3 Category 3 — New Functionality (Requires Separate Approval)

| Feature | Description | Dependency |
|---|---|---|
| Global search command palette (`Cmd/Ctrl+K` / `Ctrl+K`) | Modal command palette with autocomplete, keyboard shortcuts | New component. **Phase 1 search icon navigates to existing `/search` route only.** |
| Enhanced "Continue" section on Home | Unified resume across journeys/paths/reading | New data aggregation |
| Breadcrumbs on detail pages | Navigation aid for deep pages | New component |
| Loading skeletons | For async content | New components |
| Empty states | For all list pages | New components |
| Usability testing | 5-8 user sessions | Research activity |

**Category 3 items must NOT be silently included in navigation-only implementation.** Each requires separate product-owner approval and scope definition.

---

## 5. LearnNav Responsive Requirements

### 5.1 Mandatory Requirements

- All six destinations (Dashboard, Journeys, Paths, Plans, Revise, Quiz) must remain accessible at all viewport widths
- No tab may disappear or be hidden on smaller screens
- No horizontal page overflow (no scrollbars on the page itself)
- Keyboard accessible (Tab key cycles through all tabs)
- Visible active state (highlighted tab with `aria-current="page"`)

### 5.2 Responsive Layout Strategy

| Viewport | Layout | Notes |
|---|---|---|
| Desktop (768px+) | Horizontal tab bar, full labels visible | Standard layout |
| Tablet (375px–767px) | Horizontal tab bar, labels may truncate with ellipsis if needed | Graceful degradation |
| Mobile (320px–374px) | Horizontal tab bar with horizontal scrolling within the tab container | Each tab maintains minimum touch target of 44×44px |

### 5.3 Mobile Implementation

```tsx
<div className="flex overflow-x-auto border-b" style={{ WebkitOverflowScrolling: 'touch' }}>
  {LEARN_TABS.map((tab) => (
    <Link
      key={tab.href}
      href={tab.href}
      className="flex-shrink-0 px-4 py-3 min-w-[80px] text-center"
      aria-current={isActive(pathname, tab.href) ? 'page' : undefined}
    >
      {tab.label}
    </Link>
  ))}
</div>
```

### 5.4 Testing Requirements

- Visual test at 320px, 375px, 768px, 1024px, 1440px widths
- Keyboard test: Tab through all 6 tabs, verify focus visible
- Touch test: swipe horizontally on mobile to access all tabs
- Active state test: verify correct tab highlighted on each route

---

## 6. Data-Preservation Acceptance Criteria

### 6.1 Mandatory Release Checks

**For all route migrations:**
- [ ] Existing bookmarks remain accessible
- [ ] Existing notes remain accessible
- [ ] Existing collections remain accessible
- [ ] Existing reading history remains accessible
- [ ] Existing journey progress remains intact
- [ ] Backup and restore continue to work
- [ ] Existing localStorage keys remain unchanged
- [ ] Existing backup compatibility remains intact

### 6.2 Phase-Specific Checks

**Phase 2 (Route Consolidation):**
- [ ] Existing bookmarks remain accessible at `/my-study/bookmarks`
- [ ] Existing notes remain accessible at `/my-study/notes`
- [ ] Existing collections remain accessible at `/my-study/collections`
- [ ] Existing reading history remains accessible at `/my-study`
- [ ] Backup and restore continue to work via `/my-study/settings`
- [ ] All localStorage keys unchanged (`alhuda.library.v1`, etc.)
- [ ] Existing backup JSON files remain compatible

**Phase 3 (Learn Reorganization):**
- [ ] Existing journey progress intact (stored in `alhuda.journeys.v1`)
- [ ] All localStorage keys unchanged

### 6.3 Testing Requirements

- Data preservation test: create test bookmarks/notes/collections before migration, verify accessible after
- Data preservation test: create test journey progress before migration, verify intact after
- Use test data to verify before-and-after behavior

### 6.4 Constraints

- No account system may be introduced
- No cloud synchronization may be introduced
- No database migration may be introduced
- All user data remains in localStorage with route-independent keys

---

## 7. Documents Updated

### 7.1 Authoritative Documents (Created)

1. **`docs/FAHM-IA-FINAL-RECONCILIATION.md`**
   - Source-verified decisions
   - Route inventory (49 routes verified)
   - Feature comparisons (My Study vs Library)
   - Redirect strategy (HTTP 308)
   - Discover migration scope (audience paths only)
   - Category definitions (1/2/3)

2. **`docs/FAHM-IA-FINAL-IMPLEMENTATION-PLAN.md`**
   - 4-phase implementation plan
   - Exact file changes per phase
   - Acceptance criteria (including data preservation)
   - Testing requirements
   - Rollback strategies
   - LearnNav mobile responsive specification (§4.7.1)

3. **`docs/FAHM-IA-FINAL-REVIEW-READINESS.md`** (this document)
   - Corrections performed
   - Final redirect strategy
   - Final Discover migration scope
   - Final feature classification
   - LearnNav responsive requirements
   - Data-preservation acceptance criteria

### 7.2 Existing Documents (Surgically Updated)

4. **`docs/FAHM-IA-AUDIT.md`**
   - Added reconciliation reference note

5. **`docs/FAHM-INFORMATION-ARCHITECTURE.md`**
   - Fixed `/explore/dimensions` → `/explore/dimension/[id]`
   - Fixed `/explore/roots` → `/explore/root`
   - Fixed `/my-study/recent` → `/my-study` (dashboard)
   - Reversed `/topics` decision (now canonical, not `/explore/topics`)
   - Fixed `/learn/dashboard` → `/learn` (hub)
   - Added reconciliation reference note

6. **`docs/FAHM-NAVIGATION-SPECIFICATION.md`**
   - Fixed `/explore/topics/[slug]` → `/topics/[slug]` (canonical)
   - Added reconciliation reference note

7. **`docs/FAHM-USER-JOURNEYS.md`**
   - Fixed `/explore/roots/[root]` → `/explore/root/[root]`
   - Added reconciliation reference note

8. **`docs/FAHM-IA-IMPLEMENTATION-ROADMAP.md`**
   - Fixed Phase 1 scope (Learn already exists in mobile nav)
   - Fixed Phase 2 scope (backup controls already exist at `/my-study/settings`)
   - Removed non-existent `/read` route
   - Fixed `/learn/revise` → `/learn/revision`
   - Fixed `/explore/dimensions` → inline on `/explore`
   - Reversed `/explore/roots` rename (keep singular `/explore/root`)
   - Reversed `/topics` → `/explore/topics` (now `/explore/topics` → `/topics`)
   - Updated all HTTP 301 references to HTTP 308
   - Added data preservation acceptance criteria
   - Added reconciliation reference note

---

## 8. Files Intentionally Left Unchanged

### 8.1 Application Source Code

**No application source files were modified.** All changes are documentation-only.

Verified via `git status`:
- Zero files in `src/` directory modified
- Zero files in `public/` directory modified
- Zero files in `package.json` modified
- Zero files in `next.config.js` modified

### 8.2 Data Files

Five data files in `data/` directory show minor modifications (unrelated to IA work):
- `data/blocked-root-analysis.json`
- `data/full-morphology-activation-audit.json`
- `data/global-root-ayah-coverage-report.json`
- `data/root-index-integrity-report.json`
- `data/sprint-49-root-reconciliation-report.json`

These are pre-existing modifications from Sprint 49 work and are not part of this IA reconciliation task.

### 8.3 Other Documentation

The following documentation files were not modified (not relevant to IA reconciliation):
- `docs/FAHM-PRODUCT-AUDIT.md` (functionality baseline)
- `docs/FAHM-FUNCTIONALITY-MAP.md` (feature inventory)
- `docs/ARCHITECTURE-DECISION-REGISTER.md`
- `docs/ARCHITECTURE-VALIDATION-REPORT.md`
- `docs/EXPLORE-CONTENT-STANDARDS.md`
- `docs/MODE-NAVIGATION-SPECIFICATION.md`
- `docs/NOOR-CHILD-SAFETY-SPECIFICATION.md`
- `docs/REPOSITORY-COUNT-AUDIT.md`
- `docs/STAKEHOLDER-DECISION-2026-11-11.md`
- `docs/THREE-MODE-ARCHITECTURE.md`

---

## 9. Git Diff Summary

### 9.1 Documentation Files (Untracked)

All IA documentation files are untracked (not yet committed to git):

```
?? docs/FAHM-IA-FINAL-RECONCILIATION.md
?? docs/FAHM-IA-FINAL-IMPLEMENTATION-PLAN.md
?? docs/FAHM-IA-FINAL-REVIEW-READINESS.md
?? docs/FAHM-IA-AUDIT.md
?? docs/FAHM-INFORMATION-ARCHITECTURE.md
?? docs/FAHM-NAVIGATION-SPECIFICATION.md
?? docs/FAHM-USER-JOURNEYS.md
?? docs/FAHM-IA-IMPLEMENTATION-ROADMAP.md
```

### 9.2 Application Source Files

**Zero application source files modified.**

Verified via `git diff --name-only | Select-String "^src/"`:
- No output (no matches)

### 9.3 Data Files (Pre-existing Modifications)

Five data files show minor modifications (unrelated to IA work):

```
 data/blocked-root-analysis.json                | 2 +-
 data/full-morphology-activation-audit.json     | 2 +-
 data/global-root-ayah-coverage-report.json     | 2 +-
 data/root-index-integrity-report.json          | 2 +-
 data/sprint-49-root-reconciliation-report.json | 2 +-
 5 files changed, 5 insertions(+), 5 deletions(-)
```

These are pre-existing modifications from Sprint 49 work.

---

## 10. Confirmation

### 10.1 No Application Source Code Modified

✅ **Confirmed:** Zero application source files were modified during this documentation correction pass.

**Verification:**
- `git status docs/ --short` shows only documentation files (all untracked)
- `git diff --name-only | Select-String "^src/"` returns no output
- No React components modified
- No Next.js route files modified
- No navigation behavior modified
- No Quran datasets modified
- No translations or Tafsir modified
- No morphology or root data modified
- No localStorage schemas or keys modified
- No APIs modified
- No features added
- Sprint 55 not started
- Nothing deployed

### 10.2 No Functionality Modified

✅ **Confirmed:** Zero application functionality was modified during this documentation correction pass.

**Verification:**
- All changes are documentation-only
- No code execution occurred
- No build process triggered
- No tests run (documentation-only task)
- No deployment attempted

### 10.3 Documentation Consistency Achieved

✅ **Confirmed:** All three authoritative documents now present a single, internally consistent view.

**Verification:**
- All HTTP redirect references specify 308 (not 301)
- Discover migration scope consistently states "audience paths only"
- Category 2/3 classification consistent across all documents
- LearnNav responsive requirements explicit
- Data preservation criteria mandatory
- No contradictions between reconciliation, implementation plan, and roadmap

---

## 11. Final Status

### ✅ READY FOR PRODUCT-OWNER APPROVAL

All documentation inconsistencies have been resolved. The three authoritative documents present a single, internally consistent view of the FAHM information architecture and implementation plan.

**Key Achievements:**
1. ✅ HTTP redirect status codes corrected (301 → 308)
2. ✅ Discover migration scope clarified (audience paths only)
3. ✅ Category 2/3 classification resolved
4. ✅ LearnNav mobile responsive specification added
5. ✅ Data preservation acceptance criteria strengthened
6. ✅ Cross-document consistency verified
7. ✅ No application source code modified
8. ✅ No functionality modified

**Next Steps:**
1. Product-owner review of the three authoritative documents
2. Explicit approval of each implementation phase before starting
3. Phase 1 (navigation cleanup) recommended as starting point

**No further work will proceed without explicit product-owner authorization.**

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2026  
**Status:** ✅ READY FOR PRODUCT-OWNER APPROVAL
