# FAHM Information Architecture — Final Implementation Plan

**Document Status:** VERIFIED & RECONCILED  
**Date:** November 11, 2026  
**Baseline:** Sprint 54 (commit `e875bbd`)  
**Companion:** `docs/FAHM-IA-FINAL-RECONCILIATION.md` (authoritative decisions)  
**Supersedes:** `docs/FAHM-IA-IMPLEMENTATION-ROADMAP.md` where they conflict with this document

---

## Table of Contents

1. [Plan Overview](#1-plan-overview)
2. [Phase 1 — Navigation Cleanup](#2-phase-1--navigation-cleanup)
3. [Phase 2 — Route Consolidation](#3-phase-2--route-consolidation)
4. [Phase 3 — Learn Reorganization](#4-phase-3--learn-reorganization)
5. [Phase 4 — Discover Migration](#5-phase-4--discover-migration)
6. [Deferred Scope (Category 3)](#6-deferred-scope-category-3)
7. [Cross-Phase Concerns](#7-cross-phase-concerns)
8. [Testing Strategy](#8-testing-strategy)
9. [Rollback Strategy](#9-rollback-strategy)
10. [Approval Gates](#10-approval-gates)

---

## 1. Plan Overview

### 1.1 Why Four Phases (Not Five)

The prior roadmap (`FAHM-IA-IMPLEMENTATION-ROADMAP.md`) proposed 5 phases. Source-code verification revealed:

- **Phase 2 of the prior plan** ("add backup controls to `/my-study/settings`") is **already done** — `BackupControls` is already imported and rendered at `src/app/my-study/settings/page.tsx` line 7.
- **Phase 5 of the prior plan** (UX refinement: breadcrumbs, loading states, empty states, usability testing) is **Category 3 new functionality** that requires separate product-owner approval and is out of scope for this navigation-only implementation.

The revised plan has **4 phases**, each independently shippable and rollbackable.

### 1.2 Phase Summary

| Phase | Name | Effort | Risk | Duration | Dependencies |
|---|---|---|---|---|---|
| 1 | Navigation Cleanup | Low | Low | 2–4 hours | None |
| 2 | Route Consolidation | Medium | Medium | 1 day | Phase 1 |
| 3 | Learn Reorganization | Medium | Medium | 1–2 days | Phase 1 |
| 4 | Discover Migration | Medium | Medium | 1 day | Phase 1 |

**Total estimated effort:** 4–6 days of focused work (one developer).

Phases 2, 3, and 4 can run in parallel after Phase 1 completes.

### 1.3 Key Principles

1. **Ship incrementally.** Each phase produces a working build.
2. **Preserve deep links.** Every moved route gets an HTTP 308 redirect via `next.config.js` `redirects()` with `permanent: true`.
3. **No data migration.** All user data lives in localStorage; keys are route-independent.
4. **Rollback-ready.** Every phase has a documented revert path.
5. **Test at every phase.** Each phase ships with its own acceptance tests.
6. **Separate new features.** Category 3 work (search palette, breadcrumbs, etc.) is explicitly deferred.

### 1.4 Redirect Strategy (Next.js 15)

All route migrations use `next.config.js` `redirects()` with `permanent: true`, which produces **HTTP 308** (permanent, method- and body-preserving).

- App Router `redirect()` produces HTTP 307 by default and is **not** used for these migrations.
- `redirect(url, 'replace')` does **not** turn a redirect into HTTP 301.
- Query strings are automatically forwarded by `next.config.js` redirects.
- Dynamic parameters (`:slug`, `:root`) are forwarded via `:param` syntax.

All acceptance criteria that previously specified "HTTP 301" now correctly specify **HTTP 308**.

---

## 2. Phase 1 — Navigation Cleanup

### 2.1 Objective

Fix the most critical usability problems without restructuring routes or data. Deliver immediate user-visible value with minimal engineering risk.

### 2.2 Scope (Category 1 — Navigation-Only)

| Change | File | Action |
|---|---|---|
| Remove redundant desktop nav items | `src/components/layout/site-header.tsx` | Remove Discover, Topics, Plans, Quiz, Library from `NAV` array |
| Add "My Study" to desktop nav | `src/components/layout/site-header.tsx` | Add `{ href: "/my-study", label: t("nav.myStudy"), icon: Bookmark }` |
| Reduce mobile bottom nav to 5 tabs | `src/components/layout/mobile-bottom-nav.tsx` | Remove Search, Library, Settings; add My Study (replace Library position) |
| Add slim mobile header with search icon | `src/components/layout/site-header.tsx` or new component | `md:hidden` top bar with logo + search icon. **Search icon navigates to existing `/search` route. No command palette, no `Cmd/Ctrl+K`, no modal.** |
| Fix "10 Dimensions" metadata bug | `src/app/explore/page.tsx` | Change title, description, heading, and JSON-LD from "10" to "15" |

### 2.3 Exact Files Likely to Change

1. `src/components/layout/site-header.tsx` — reduce `NAV` array from 10 to 4 items; add mobile header variant
2. `src/components/layout/mobile-bottom-nav.tsx` — reduce `TABS` array from 7 to 5 items
3. `src/app/explore/page.tsx` — 4 string replacements ("10" → "15")
4. `src/lib/i18n/translations/en.ts` and `ur.ts` — add `nav.myStudy` key if missing

### 2.4 Dependencies

None. This phase is the foundation for all subsequent phases.

### 2.5 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Nav item ordering breaks responsive layout | Low | Low | CSS flex handles it; visual QA at 3 breakpoints |
| Mobile bottom nav exceeds 5-tab limit on 320px | Low | Medium | Test on 320px width; tabs use `flex-1` so they shrink gracefully |
| Metadata change affects SEO indexing | Low | Low | Change is a correction, not a removal |
| Missing i18n key for "My Study" | Medium | Low | Add to both `en.ts` and `ur.ts` before shipping |

### 2.6 Data Preservation Requirements

None. No localStorage keys are touched. No user data is affected.

### 2.7 Acceptance Criteria

- [ ] Desktop header has exactly **4 primary nav items** (Read, Explore, Learn, My Study) + **3 utility icons** (Search, Language, Settings)
- [ ] Mobile bottom nav has exactly **5 tabs** (Home, Read, Explore, Learn, My Study)
- [ ] Mobile header shows logo (start) and search icon (end) below `md` breakpoint
- [ ] All occurrences of "10 Dimensions" replaced with "15 Dimensions" in `/explore` (grep-verified: zero matches)
- [ ] All nav items link to correct routes (no 404s)
- [ ] Visual QA passes on mobile (320px), tablet (768px), desktop (1440px)
- [ ] `next build` succeeds with no new warnings
- [ ] Existing tests still pass (1,287/1,288 baseline)
- [ ] `aria-current="page"` correctly highlights active item on all routes

### 2.8 Testing Requirements

- Unit test: nav item count and labels for both desktop and mobile
- Visual regression test: header at 3 breakpoints
- Grep test: zero occurrences of "10 Dimensions"
- Link test: all nav items resolve to 200

### 2.9 Rollback Strategy

1. `git revert <commit-sha>` for the Phase 1 commit
2. No data changes to undo
3. No redirects to remove
4. Verify nav returns to pre-Phase 1 state

### 2.10 Approval Required Before Starting?

**Yes.** Product-owner approval of the 5-destination IA (per Reconciliation §15, Decision #1).

---

## 3. Phase 2 — Route Consolidation

### 3.1 Objective

Resolve the `/library` vs `/my-study` overlap and the `/topics` vs `/explore/topics` duplication by establishing canonical routes and redirecting duplicates.

### 3.2 Scope (Category 2 — Route Restructuring)

| Change | Implementation |
|---|---|
| Redirect `/library` → `/my-study` | Add to `next.config.js` `redirects` array |
| Redirect `/library/notes` → `/my-study/notes` | Add to `next.config.js` `redirects` array |
| Redirect `/explore/topics` → `/topics` | Add to `next.config.js` `redirects` array |
| Redirect `/explore/topics/[slug]` → `/topics/[slug]` | Add to `next.config.js` `redirects` array with parameterized source/destination |
| Update all internal links from `/library` to `/my-study` | Grep + replace across codebase |
| Update all internal links from `/explore/topics` to `/topics` | Grep + replace across codebase |

### 3.3 Exact Files Likely to Change

1. `next.config.js` or `next.config.ts` — add 4 redirect entries
2. `src/app/library/page.tsx` — optionally replace with `redirect('/my-study')` for defense-in-depth
3. `src/app/library/notes/page.tsx` — optionally replace with `redirect('/my-study/notes')`
4. `src/app/explore/topics/page.tsx` — optionally replace with `redirect('/topics')`
5. `src/app/explore/topics/[slug]/page.tsx` — optionally replace with redirect
6. All files containing `/library` or `/explore/topics` — grep audit + replace

### 3.4 Redirect Configuration

```js
// next.config.js
async redirects() {
  return [
    {
      source: '/library',
      destination: '/my-study',
      permanent: true,  // HTTP 308
    },
    {
      source: '/library/notes',
      destination: '/my-study/notes',
      permanent: true,  // HTTP 308
    },
    {
      source: '/explore/topics',
      destination: '/topics',
      permanent: true,  // HTTP 308
    },
    {
      source: '/explore/topics/:slug',
      destination: '/topics/:slug',
      permanent: true,  // HTTP 308, preserves :slug parameter
    },
  ];
}
```

**Note:** `permanent: true` produces HTTP 308 in Next.js 15, not HTTP 301. Query strings are automatically forwarded.

### 3.5 Dependencies

- Phase 1 must be complete (navigation already updated to remove Library from nav)

### 3.6 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Old bookmarks to `/library/*` break | Low | High | HTTP 308 redirects preserve them |
| Internal links missed in search/replace | Medium | Medium | Full grep audit before shipping |
| SEO impact from redirect chain | Low | Medium | Direct 308s, no chains |
| `/explore/topics` inbound links break | Low | Medium | HTTP 308 redirect preserves link equity |

### 3.7 Data Preservation Requirements

Both `/library` and `/my-study` read from the same `useLibrary()` context backed by `alhuda.library.v1`. No data migration needed. localStorage keys are route-independent.

### 3.8 Acceptance Criteria

- [ ] `/library` returns HTTP 308 → `/my-study` (verified with `curl -I`)
- [ ] `/library/notes` returns HTTP 308 → `/my-study/notes`
- [ ] `/explore/topics` returns HTTP 308 → `/topics`
- [ ] `/explore/topics/[slug]` returns HTTP 308 → `/topics/[slug]` (parameter preserved)
- [ ] Query strings preserved on all redirects (verified with `curl -I '/library?test=1'`)
- [ ] Zero internal links point to `/library/*` (grep-verified, excluding redirect config)
- [ ] Zero internal links point to `/explore/topics/*` (grep-verified, excluding redirect config)
- [ ] **Data preservation verified:**
  - [ ] Existing bookmarks remain accessible at `/my-study/bookmarks`
  - [ ] Existing notes remain accessible at `/my-study/notes`
  - [ ] Existing collections remain accessible at `/my-study/collections`
  - [ ] Existing reading history remains accessible at `/my-study`
  - [ ] Backup and restore continue to work via `/my-study/settings`
  - [ ] All localStorage keys unchanged (`alhuda.library.v1`, etc.)
  - [ ] Existing backup JSON files remain compatible
- [ ] No broken links site-wide (run link checker)
- [ ] Existing tests still pass
- [ ] `next build` succeeds

### 3.9 Testing Requirements

- Integration test: each redirected route returns HTTP 308 (verified with `curl -I`)
- Query-string test: verify `?param=value` preserved on all redirects
- Data preservation test: create test bookmarks/notes/collections before migration, verify accessible after
- Grep audit: zero `/library` or `/explore/topics` references in source (excluding redirect config)
- Link checker: no broken internal links

### 3.10 Rollback Strategy

1. Remove redirect entries from `next.config.js`
2. Revert internal link changes
3. No data migration to undo (localStorage keys unchanged)

### 3.11 Approval Required Before Starting?

**Yes.** Product-owner approval of canonical route decisions (per Reconciliation §15, Decisions #2).

---

## 4. Phase 3 — Learn Reorganization

### 4.1 Objective

Consolidate all learning features under `/learn` by moving `/study-journeys` to `/learn/journeys` and updating the LearnNav to surface all learning tools.

### 4.2 Scope (Category 2 — Route Restructuring)

| Change | Implementation |
|---|---|
| Move `/study-journeys` → `/learn/journeys` | File move: `src/app/study-journeys/` → `src/app/learn/journeys/` |
| Move `/study-journeys/[slug]` → `/learn/journeys/[slug]` | File move |
| Add HTTP 308 redirects | `next.config.js` `redirects()` with `permanent: true` |
| Update `LearnNav` to include Dashboard + Journeys tabs | `src/components/learn/learn-nav.tsx` |
| Update all internal links from `/study-journeys` to `/learn/journeys` | Grep + replace |

### 4.3 Exact Files Likely to Change

1. `src/app/study-journeys/page.tsx` → move to `src/app/learn/journeys/page.tsx`
2. `src/app/study-journeys/[slug]/page.tsx` → move to `src/app/learn/journeys/[slug]/page.tsx`
3. `src/components/learn/learn-nav.tsx` — expand `LEARN_TABS` from 4 to 6 items
4. `next.config.js` — add 2 redirect entries
5. All files containing `/study-journeys` — grep audit + replace

### 4.4 LearnNav Update

```tsx
const LEARN_TABS = [
  { href: "/learn",           label: "Dashboard" },
  { href: "/learn/journeys",  label: "Journeys"  },
  { href: "/learn/paths",     label: "Paths"     },
  { href: "/learn/plans",     label: "Plans"     },
  { href: "/learn/revision",  label: "Revise"    },
  { href: "/learn/quiz",      label: "Quiz"      },
] as const;
```

Active-state matching:

```ts
function isActive(pathname: string, href: string): boolean {
  if (href === "/learn") return pathname === "/learn";
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

### 4.5 Redirect Configuration

```js
{
  source: '/study-journeys',
  destination: '/learn/journeys',
  permanent: true,  // HTTP 308
},
{
  source: '/study-journeys/:slug',
  destination: '/learn/journeys/:slug',
  permanent: true,  // HTTP 308, preserves :slug parameter
},
```

### 4.6 Dependencies

- Phase 1 must be complete (Learn already in nav)

### 4.7 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| LearnNav tab overflow on mobile | Medium | Medium | See §4.7.1 for responsive specification |
| Old bookmarks to `/study-journeys/*` break | Low | High | HTTP 308 redirects preserve them |
| Internal links missed | Medium | Medium | Full grep audit |
| Journey progress data breaks | None | None | Progress stored in `alhuda.journeys.v1`, route-independent |

### 4.7.1 LearnNav Mobile Responsive Specification

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

**Implementation:**
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

**Testing:**
- Visual test at 320px, 375px, 768px, 1024px, 1440px widths
- Keyboard test: Tab through all 6 tabs, verify focus visible
- Touch test: swipe horizontally on mobile to access all tabs
- Active state test: verify correct tab highlighted on each route

### 4.8 Data Preservation Requirements

Journey progress is stored in `alhuda.journeys.v1` (localStorage), keyed by journey slug, not by route. No data migration needed.

### 4.9 Acceptance Criteria

- [ ] `/study-journeys` returns HTTP 308 → `/learn/journeys` (verified with `curl -I`)
- [ ] `/study-journeys/[slug]` returns HTTP 308 → `/learn/journeys/[slug]` (parameter preserved)
- [ ] Query strings preserved on all redirects
- [ ] **Data preservation verified:** existing journey progress intact (stored in `alhuda.journeys.v1`)
- [ ] All localStorage keys unchanged
- [ ] LearnNav has exactly 6 tabs: Dashboard, Journeys, Paths, Plans, Revise, Quiz
- [ ] LearnNav "Dashboard" tab links to `/learn` and is active only on exact `/learn` path
- [ ] LearnNav "Journeys" tab is active on `/learn/journeys` and `/learn/journeys/*`
- [ ] Zero internal links point to `/study-journeys/*` (grep-verified, excluding redirect config)
- [ ] All 4 journeys accessible via `/learn/journeys`
- [ ] Journey progress preserved (verify with test data)
- [ ] Existing tests still pass
- [ ] `next build` succeeds

### 4.10 Testing Requirements

- Integration test: each redirected route returns HTTP 308 (verified with `curl -I`)
- Query-string test: verify parameters preserved on all redirects
- Data preservation test: create test journey progress before migration, verify intact after
- Unit test: LearnNav renders 6 tabs with correct labels and routes
- Unit test: active-state logic for Dashboard vs sub-routes
- Grep audit: zero `/study-journeys` references in source (excluding redirect config)
- Manual test: start a journey, verify progress persists, navigate to `/learn/journeys`, verify journey appears

### 4.11 Rollback Strategy

1. Move `src/app/learn/journeys/` back to `src/app/study-journeys/`
2. Remove redirect entries from `next.config.js`
3. Revert LearnNav to 4 tabs
4. Revert internal link changes
5. No data migration to undo

### 4.12 Approval Required Before Starting?

**Yes.** Product-owner approval of Learn reorganization (per Reconciliation §15, Decision #5).

---

## 5. Phase 4 — Discover Migration

### 5.1 Objective

Migrate the unique content from `/discover` (audience-based recommended paths) into `/explore`, then redirect `/discover` to `/explore`.

### 5.2 Scope (Category 2 — Route Restructuring + Content Migration)

| Change | Implementation |
|---|---|
| Add "Start with a path" section to `/explore` | New section in `src/app/explore/page.tsx` or new client component |
| Migrate audience-based path cards from `/discover` | Copy logic from `src/app/discover/discover-client.tsx` |
| Redirect `/discover` → `/explore` | `next.config.js` redirect |
| Remove Discover from desktop nav | Already done in Phase 1 |

### 5.3 Exact Files Likely to Change

1. `src/app/explore/page.tsx` — add new section for audience-based paths
2. `src/app/discover/discover-client.tsx` — reference for content to migrate
3. `next.config.js` — add redirect entry
4. Optionally: new component `src/components/explore/audience-paths.tsx` to encapsulate the migrated section

### 5.4 Content to Migrate

From `src/app/discover/discover-client.tsx` lines 35–91:

- Section heading: "Start with a path"
- Audience-based recommended paths (Beginner, Intermediate, Advanced, Scholar)
- Each card links to `/learn/paths/[slug]`
- Uses `RECOMMENDED_PATHS`, `PATHS`, `AUDIENCE_LABELS`, `AUDIENCE_DESCRIPTIONS` from `@/lib/paths/data`

### 5.5 Redirect Configuration

```js
{
  source: '/discover',
  destination: '/explore',
  permanent: true,
},
```

### 5.6 Dependencies

- Phase 1 must be complete (Discover already removed from nav)

### 5.7 Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Audience paths section clutters `/explore` | Low | Low | Place after dimensions grid; keep same card design |
| Inbound links to `/discover` break | Low | Medium | HTTP 308 redirect preserves link equity |
| i18n keys for discover section missing in explore context | Medium | Low | Reuse existing `discover.*` keys or rename to `explore.paths.*` |

### 5.8 Data Preservation Requirements

None. No user data is affected. This is purely content reorganization.

### 5.9 Acceptance Criteria

- [ ] `/explore` page includes "Start with a path" section with audience-based cards
- [ ] Audience paths section reuses existing `RECOMMENDED_PATHS` data from `@/lib/paths/data`
- [ ] No new recommendation logic introduced (existing behavior preserved)
- [ ] All existing Explore functionality preserved (dimensions, topics, domains, roots, graph)
- [ ] `/discover` returns HTTP 308 → `/explore` (verified with `curl -I`)
- [ ] Query strings preserved on `/discover` redirect
- [ ] All 4 audience paths (Beginner, Intermediate, Advanced, Scholar) accessible from `/explore`
- [ ] Zero internal links point to `/discover` (grep-verified, excluding redirect config)
- [ ] i18n keys work in both EN and UR
- [ ] Existing tests still pass
- [ ] `next build` succeeds

### 5.10 Testing Requirements

- Integration test: `/discover` returns HTTP 308 (verified with `curl -I`)
- Query-string test: verify parameters preserved on `/discover` redirect
- Visual test: audience paths section renders correctly on `/explore`
- Functional test: verify audience paths use existing recommendation data (no new logic)
- Grep audit: zero `/discover` references in source (excluding redirect config)
- Manual test: click each audience path card, verify it navigates to correct `/learn/paths/[slug]`

### 5.11 Rollback Strategy

1. Remove audience paths section from `/explore`
2. Remove redirect entry from `next.config.js`
3. Restore `/discover` page files from git history
4. No data migration to undo

### 5.12 Approval Required Before Starting?

**Yes.** Product-owner approval of Discover migration (per Reconciliation §15, Decision #4).

---

## 6. Deferred Scope (Category 3)

The following items were mentioned in the prior roadmap but are **new functionality** that requires separate product-owner approval and is explicitly out of scope for this navigation-only implementation:

| Item | Description | Reason for Deferral |
|---|---|---|
| Global search command palette (`Cmd/Ctrl+K` / `Ctrl+K`) | Modal command palette with autocomplete, keyboard shortcuts | New component, new interaction pattern. **Phase 1 search icon navigates to existing `/search` route only.** |
| Breadcrumbs on detail pages | Navigation aid for deep pages | New component, UX decision needed |
| Loading skeletons | For async content | New components, performance optimization |
| Empty states | For all list pages | New components, copywriting needed |
| Enhanced "Continue" section on Home | Unified resume across journeys/paths/reading | New data aggregation logic |
| Usability testing | 5–8 user sessions | Research activity, not implementation |
| Touch target audit | Ensure all elements ≥ 44×44px | Audit + remediation, separate scope |

**Note on backup/restore:** Existing backup/export/import functionality (via `BackupControls` component at `src/components/library/backup-controls.tsx`) is **already implemented** and must be preserved through all route migrations. It is NOT deferred. Both export (`handleExport`) and import (`handleFile` with `parseBackup` + `restoreState`) are fully functional. This is a preservation requirement, not a new feature.

These items should be scoped, estimated, and approved in a separate planning session after the navigation-only phases are complete.

---

## 7. Cross-Phase Concerns

### 7.1 Internal Link Audit

Before any redirect goes live, run a full grep audit for the old routes:

```bash
# Phase 2
grep -r "/library" src/ --include="*.tsx" --include="*.ts"
grep -r "/explore/topics" src/ --include="*.tsx" --include="*.ts"

# Phase 3
grep -r "/study-journeys" src/ --include="*.tsx" --include="*.ts"

# Phase 4
grep -r "/discover" src/ --include="*.tsx" --include="*.ts"
```

Replace all matches (excluding redirect config and documentation) with the new routes.

### 7.2 Sitemap Update

After each phase, update `src/app/sitemap.ts` (or equivalent) to:
- Remove old routes
- Add new routes (if any)
- Verify canonical URLs point to new canonical route

### 7.3 SEO Considerations

- All redirects use HTTP 308 (permanent, method-preserving) via `next.config.js` `redirects()` with `permanent: true`
- No redirect chains; each old route points directly to new route
- Canonical URLs on destination pages must point to the new canonical URL
- Meta tags (title, description, og:title, og:description) verified after each phase
- Query strings automatically forwarded by Next.js redirects

### 7.4 Deep Links and Bookmarks

All old routes redirect to new routes (HTTP 308). Users with browser bookmarks are seamlessly redirected. Test all redirects with `curl -I` and verify:
- HTTP status is 308 (not 301, 302, or 307)
- Target route resolves correctly
- Query strings preserved
- Path parameters preserved (for dynamic routes)

### 7.5 i18n Keys

New nav items require i18n keys:
- `nav.myStudy` — "My Study" / "میرا مطالعہ"
- `learn.dashboard` — "Dashboard" / "ڈیش بورڈ"
- `learn.journeys` — "Journeys" / "سفر"

Verify all keys exist in both `en.ts` and `ur.ts` before shipping each phase.

---

## 8. Testing Strategy

### 8.1 Unit Tests (Jest, React Testing Library)

- Navigation components: 90%+ coverage
- Redirect logic: 100% coverage
- Nav item count, active states, redirect codes

### 8.2 Integration Tests (Next.js test utilities)

- All old routes return HTTP 308
- Redirect targets resolve correctly
- Query strings preserved on all redirects
- Path parameters preserved on dynamic routes
- localStorage data persists across route changes

### 8.3 E2E Tests (Playwright)

- Navigate from old bookmark to new location (verify HTTP 308)
- Start, resume, complete a journey (verify progress preserved)
- Navigate Explore hub to topic/root detail
- Verify all personal data accessible from `/my-study`:
  - Bookmarks
  - Notes
  - Collections
  - Reading history
  - Backup/restore functionality

### 8.4 Accessibility Testing (axe-core, Lighthouse)

- WCAG 2.1 AA compliance
- Keyboard navigation, screen reader compatibility
- Color contrast (4.5:1), touch targets (44×44px)
- Focus management

### 8.5 Mobile Responsiveness Testing

- Breakpoints: 320px, 375px, 768px, 1024px, 1440px
- Navigation layout, touch targets, content readability
- No horizontal scroll at any breakpoint

---

## 9. Rollback Strategy

### 9.1 General Principles

1. **Every phase is independently rollbackable.**
2. **No data migration means no data rollback.**
3. **Redirects are the easiest thing to revert.**
4. **Visual changes are reverted with git.**

### 9.2 Phase-Specific Rollback

**Phase 1:** `git revert <commit>` — reverts nav/metadata changes

**Phase 2:** Remove redirect entries from `next.config.js`; revert internal link changes

**Phase 3:** Move `src/app/learn/journeys/` back to `src/app/study-journeys/`; remove redirects; revert LearnNav to 4 tabs

**Phase 4:** Remove audience paths section from `/explore`; remove redirect; restore `/discover` from git

---

## 10. Approval Gates

Each phase requires explicit product-owner approval before starting:

| Phase | Approval Gate | Decision Reference |
|---|---|---|
| 1 | Approve 5-destination IA | Reconciliation §15, Decision #1 |
| 2 | Approve canonical routes (`/topics` over `/explore/topics`, `/my-study` over `/library`) | Reconciliation §15, Decision #2 |
| 3 | Approve Learn reorganization (6-tab LearnNav) | Reconciliation §15, Decision #5 |
| 4 | Approve Discover migration | Reconciliation §15, Decision #4 |

**No phase may begin without explicit authorization.**

---

## Conclusion

This plan provides a clear, phased approach to the FAHM IA redesign. Each phase is independently shippable, testable, and rollbackable. The plan prioritizes low-risk changes first, building confidence before tackling complex restructuring.

**Key Success Factors:**
1. Strict phase ordering (Phase 1 first, then 2/3/4 in parallel)
2. Comprehensive testing at every phase
3. Clear acceptance criteria
4. Documented rollback plans
5. Explicit approval gates before each phase

**Total estimated effort:** 4–6 days of focused work (one developer).

**Next Steps:** Review and approve → Assign developer to Phase 1 → Begin implementation

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2026
