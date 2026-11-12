# FAHM Information Architecture & Navigation Redesign — Implementation Roadmap

**Status:** PROPOSED (not yet approved)  
**Date:** November 11, 2026  
**Baseline:** Sprint 54 (commit `e875bbd`)  
**Reconciliation:** See `docs/FAHM-IA-FINAL-RECONCILIATION.md` and `docs/FAHM-IA-FINAL-IMPLEMENTATION-PLAN.md` for authoritative decisions. This roadmap has been surgically corrected: Learn already exists in mobile nav (not added); backup controls already exist at `/my-study/settings` (not added); `/read` route does not exist; `/explore/roots` rename reversed (keep singular `/explore/root`); `/explore/topics` redirects to `/topics` (not vice versa).
**Companion Documents:**
- `docs/FAHM-PRODUCT-AUDIT.md` — functionality baseline
- `docs/FAHM-FUNCTIONALITY-MAP.md` — feature inventory
- `docs/FAHM-IA-NAVIGATION-PROPOSAL.md` — design specification
- `docs/FAHM-IA-ROUTE-AUDIT.md` — route audit (Document 4)

**Author:** AI Agent (IA redesign working group)
**Purpose:** Provide a phased, risk-managed implementation plan for the IA redesign. Each phase is independently shippable and independently rollbackable.

---

## Executive Summary

This roadmap decomposes the IA redesign into **five sequential phases**, ordered by risk and dependency. Phases 1–4 are structural; Phase 5 is polish and validation. Every phase is designed to leave the application in a shippable state — no phase depends on a later phase, and every phase can be rolled back independently.

**Total estimated effort:** 3–4 weeks of focused work (one developer).
**Critical path:** Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5.
**Parallelizable:** Phase 3 and Phase 4 can run in parallel after Phase 2.

### Phase Overview

| Phase | Name | Effort | Risk | Dependencies | Est. Duration |
|-------|------|--------|------|--------------|---------------|
| 1 | Low-Risk Navigation Improvements | Low | Low | None | 2–4 hours |
| 2 | My Study / Library Consolidation | Medium | Medium | Phase 1 | 1–2 days |
| 3 | Learn Section Reorganization | Medium | Medium | Phase 1 | 1–2 days |
| 4 | Explore Section Enhancement | Medium | Medium | Phase 1 | 2–3 days |
| 5 | UX Refinement & Validation | High | High | Phases 1–4 | 1–2 weeks |

### Key Principles

1. **Ship incrementally.** Each phase produces a working build.
2. **Preserve deep links.** Every moved route gets an HTTP 308 redirect via `next.config.js` `redirects()` with `permanent: true`.
3. **No data migration.** All user data lives in localStorage; no server-side changes.
4. **Rollback-ready.** Every phase has a documented revert path.
5. **Test at every phase.** Each phase ships with its own acceptance tests.

---

## Phase 1: Low-Risk Navigation Improvements

### Goal
Fix the most critical usability problems without restructuring routes or data. This phase delivers immediate user-visible value with minimal engineering risk.

### Scope
- Add **"My Study"** to desktop header and mobile bottom nav
- Reduce mobile bottom nav from 7 tabs to 5 tabs (retain Learn, remove Search/Library/Settings)
- Remove redundant items from desktop header (Discover, Topics, Plans, Quiz, Library)
- Fix **"10 Dimensions"** metadata bug → **"15 Dimensions"**

### Affected Routes / Components

| File | Change |
|------|--------|
| `src/components/layout/site-header.tsx` | Remove Plans/Quiz nav items; add My Study nav item |
| `src/components/layout/mobile-bottom-nav.tsx` | Replace Library icon with My Study; add Learn tab |
| `src/app/explore/page.tsx` | Fix metadata title/description and any heading text |
| `src/lib/graph/knowledge-graph.ts` | Fix "10 Dimensions" note text to "15 Dimensions" |

### Dependencies
- None. This phase is the foundation for all subsequent phases.

### Risk Assessment
- **Risk Level:** Low
- **What could go wrong:**
  - Nav item ordering breaks responsive layout (low — CSS flex handles it)
  - Mobile bottom nav exceeds 5-tab limit on small screens (medium — must test on 320px width)
  - Metadata change affects SEO indexing (low — change is a correction, not a removal)
- **Mitigation:** Visual QA on 3 breakpoints (320px, 768px, 1440px); run `next build` to catch metadata regressions.

### Acceptance Criteria

- [ ] Desktop header has exactly 6 items: **Read, Explore, Learn, My Study, Search, Settings**
- [ ] Mobile bottom nav has exactly 5 tabs: **Home, Read, Explore, Learn, My Study**
- [ ] All occurrences of "10 Dimensions" replaced with "15 Dimensions" (grep-verified)
- [ ] All nav items link to correct routes (no 404s)
- [ ] Visual QA passes on mobile (320px), tablet (768px), desktop (1440px)
- [ ] `next build` succeeds with no new warnings
- [ ] Existing tests still pass (1,287/1,288 baseline)

### Estimated Effort
**Low** — 2–4 hours of focused work.

### Rollback Plan
1. `git revert <commit-sha>` for the Phase 1 commit
2. No data changes to undo
3. No redirects to remove
4. Verify nav returns to pre-Phase 1 state

### Testing Checklist
- [ ] Unit test: nav item count and labels
- [ ] Visual regression test: header at 3 breakpoints
- [ ] Grep test: zero occurrences of "10 Dimensions"

---

## Phase 2: My Study and Library Consolidation

### Goal
Resolve the `/my-study` vs `/library` overlap by establishing `/my-study` as the single personal workspace and redirecting all `/library` routes to it.

### Scope
- Keep `/my-study` as the primary personal workspace (backup controls already present at `/my-study/settings`)
- Redirect `/library` → `/my-study` (HTTP 308 via `next.config.js` `permanent: true`)
- Redirect `/library/notes` → `/my-study/notes`
- Update all internal links from `/library` to `/my-study`
- Remove Library icon from navigation (already done in Phase 1)
- Note: `/library/collections` and `/library/bookmarks` routes do not exist — only `/library` and `/library/notes` need redirects

### Affected Routes / Components

| File | Change |
|------|--------|
| `src/app/my-study/settings/page.tsx` | Add `<BackupControls />` component |
| `src/app/library/page.tsx` | Replace content with `redirect('/my-study')` |
| `src/app/library/notes/page.tsx` | Replace content with `redirect('/my-study/notes')` |
| `src/app/library/collections/page.tsx` | Replace content with `redirect('/my-study/collections')` |
| `src/app/library/bookmarks/page.tsx` | Replace content with `redirect('/my-study/bookmarks')` |
| `src/app/my-study/page.tsx` | Ensure all Library features are present |
| `src/components/my-study/backup-controls.tsx` | New component for export/import |
| All files containing `/library` | Search/replace internal links |

### Dependencies
- Phase 1 must be complete (navigation already updated).

### Risk Assessment
- **Risk Level:** Medium
- **What could go wrong:**
  - Old bookmarks to `/library/*` break (mitigated by HTTP 308 redirects)
  - Internal links missed in search/replace (mitigated by grep audit)
  - SEO impact from redirect chain (mitigated by direct 308s, no chains)
  - Backup controls introduce data loss risk (mitigated by read-only export first)
- **Mitigation:** Full grep audit for `/library` references; test all redirects with curl; existing `BackupControls` component already supports both export and import (verified in `src/components/library/backup-controls.tsx`) — preserve through migration.

### Acceptance Criteria

- [ ] `/library` returns HTTP 308 → `/my-study` (verified with `curl -I`)
- [ ] `/library/notes` returns HTTP 308 → `/my-study/notes`
- [ ] Query strings preserved on all redirects
- [ ] **Data preservation verified:** existing bookmarks, notes, collections, reading history all accessible from `/my-study`
- [ ] Backup and restore continue to work via `/my-study/settings`
- [ ] All localStorage keys unchanged
- [ ] `/my-study/settings` displays backup controls (export JSON)
- [ ] Zero internal links point to `/library/*` (grep-verified)
- [ ] All personal data (bookmarks, notes, collections, highlights) accessible from `/my-study`
- [ ] No broken links site-wide (run link checker)
- [ ] Existing tests still pass

### Estimated Effort
**Medium** — 1–2 days.

### Rollback Plan
1. Remove redirect files in `src/app/library/`
2. Restore original Library page components from git history
3. Re-add Library nav item to `site-header.tsx` and `mobile-bottom-nav.tsx`
4. Revert internal link changes
5. No data migration to undo (localStorage keys unchanged)

### Testing Checklist
- [ ] Integration test: each `/library/*` route returns HTTP 308
- [ ] Unit test: BackupControls exports valid JSON
- [ ] Grep audit: zero `/library` references in source (excluding redirects)

---

## Phase 3: Learn Section Reorganization

### Goal
Consolidate all learning features under `/learn` by moving `/study-journeys` to `/learn/journeys` and updating the LearnNav to surface all learning tools.

### Scope
- Move `/study-journeys` → `/learn/journeys`
- Move `/study-journeys/[slug]` → `/learn/journeys/[slug]`
- Add HTTP 308 redirect from `/study-journeys` → `/learn/journeys` via `next.config.js` `permanent: true`
- Update `LearnNav` to include Journeys tab
- Update all internal links from `/study-journeys` to `/learn/journeys`
- Ensure `/learn` dashboard shows active journeys

### Affected Routes / Components

| File | Change |
|------|--------|
| `src/app/study-journeys/page.tsx` | Move to `src/app/learn/journeys/page.tsx` |
| `src/app/study-journeys/[slug]/page.tsx` | Move to `src/app/learn/journeys/[slug]/page.tsx` |
| `src/app/study-journeys/layout.tsx` | Move to `src/app/learn/journeys/layout.tsx` |
| `src/app/study-journeys/page.tsx` (new) | HTTP 308 redirect to `/learn/journeys` |
| `src/components/learn/learn-nav.tsx` | Add Journeys tab; reorder tabs |
| `src/app/learn/page.tsx` | Ensure LearningDashboard includes journeys widget |
| All files containing `/study-journeys` | Search/replace internal links |

### Dependencies
- Phase 1 must be complete (Learn is in navigation).

### Risk Assessment
- **Risk Level:** Medium
- **What could go wrong:**
  - Deep links to `/study-journeys/[slug]` break (mitigated by HTTP 308 redirect)
  - LearnNav tab order confuses users (mitigated by usability review)
  - Journey state (localStorage) keyed by old route breaks (mitigated — localStorage keys are route-independent)
  - SEO impact from route change (mitigated by HTTP 308 redirect)
- **Mitigation:** Test all journey deep links post-migration; verify localStorage keys are not route-dependent; run link checker.

### Acceptance Criteria

- [ ] `/study-journeys` returns HTTP 308 → `/learn/journeys` (verified with `curl -I`)
- [ ] `/study-journeys/[slug]` returns HTTP 308 → `/learn/journeys/[slug]` (parameter preserved)
- [ ] Query strings preserved on all redirects
- [ ] **Data preservation verified:** existing journey progress intact (stored in `alhuda.journeys.v1`)
- [ ] All localStorage keys unchanged
- [ ] LearnNav has 5 tabs: **Dashboard, Journeys, Paths, Plans, Revise, Quiz**
- [ ] All journey deep links work (test with 3 sample slugs)
- [ ] Learning dashboard shows active journeys
- [ ] Zero internal links point to `/study-journeys/*` (grep-verified)
- [ ] Existing tests still pass
- [ ] Journey localStorage data persists across migration

### Estimated Effort
**Medium** — 1–2 days.

### Rollback Plan
1. Move `src/app/learn/journeys/` back to `src/app/study-journeys/`
2. Remove redirect files
3. Revert LearnNav changes
4. Revert internal link changes
5. No data migration to undo

### Testing Checklist
- [ ] Integration test: `/study-journeys` returns HTTP 308
- [ ] Unit test: LearnNav renders 6 tabs
- [ ] Grep audit: zero `/study-journeys` references (excluding redirects)
- [ ] Manual test: journey localStorage data survives migration

---

## Phase 4: Explore Section Enhancement

### Goal
Consolidate all discovery features under `/explore` by moving `/topics` under `/explore/topics`, renaming `/explore/root` to `/explore/roots`, and clarifying the Explore hub.

### Scope
- Redirect `/explore/topics` → `/topics` (keep `/topics` as canonical, HTTP 308 redirect)
- Move `/topics/[slug]` → `/explore/topics/[slug]`
- Rename `/explore/root` → `/explore/roots` (plural, clearer)
- Rename `/explore/root/[root]` → `/explore/roots/[root]`
- Add HTTP 308 redirects from old routes via `next.config.js` `permanent: true`
- Enhance `/explore` page to show all subsections clearly
- Redirect `/discover` → `/explore` or `/learn` (decide based on content)

### Affected Routes / Components

| File | Change |
|------|--------|
| `src/app/topics/page.tsx` | Move to `src/app/explore/topics/page.tsx` |
| `src/app/topics/[slug]/page.tsx` | Move to `src/app/explore/topics/[slug]/page.tsx` |
| `src/app/topics/layout.tsx` | Move to `src/app/explore/topics/layout.tsx` |
| ⚠️ **SUPERSEDED** | This Phase 4 table is superseded by `docs/FAHM-IA-FINAL-IMPLEMENTATION-PLAN.md` Phase 4. The authoritative plan: `/topics` remains canonical (not moved to `/explore/topics`); `/explore/root` stays singular (not renamed to `/explore/roots`); audience-paths section migrated from `/discover` to `/explore` before redirect. All redirects use HTTP 308 via `next.config.js` `permanent: true`. |
| All files containing `/topics` or `/explore/root` | Search/replace internal links |

### Dependencies
- Phase 1 must be complete (Explore is in navigation).

### Risk Assessment
- **Risk Level:** Medium
- **What could go wrong:**
  - Many route changes increase breakage risk (mitigated by comprehensive redirects)
  - SEO impact from multiple route changes (mitigated by HTTP 308s + sitemap update)
  - Explore hub becomes cluttered (mitigated by clear visual hierarchy)
  - `/discover` redirect decision is ambiguous (mitigated by content audit)
- **Mitigation:** Test all topic deep links post-migration; update sitemap.xml; run full link checker; decide `/discover` destination based on content audit.

### Acceptance Criteria

- [ ] `/explore/topics` returns HTTP 308 → `/topics` (verified with `curl -I`)
- [ ] `/explore/topics/[slug]` returns HTTP 308 → `/topics/[slug]` (parameter preserved)
- [ ] `/discover` returns HTTP 308 → `/explore` (after audience-paths migration)
- [ ] Query strings preserved on all redirects
- [ ] All existing Explore functionality preserved (dimensions, topics, domains, roots, graph)
- [ ] `/explore` page clearly shows: dimensions, topics, domains, roots, graph
- [ ] All topic deep links work (test with 3 sample slugs)
- [ ] All root deep links work (test with 3 sample roots)
- [ ] Zero internal links point to old routes (grep-verified)
- [ ] Sitemap.xml updated with new routes
- [ ] Existing tests still pass

### Estimated Effort
**Medium** — 2–3 days.

### Rollback Plan
1. Move `src/app/explore/topics/` back to `src/app/topics/`
2. Rename `src/app/explore/roots/` back to `src/app/explore/root/`
3. Remove all redirect files
4. Revert Explore hub changes
5. Revert internal link changes
6. Restore sitemap.xml
7. No data migration to undo

### Testing Checklist
- [ ] Integration test: all old routes return HTTP 308
- [ ] Unit test: Explore hub renders all subsection cards
- [ ] Grep audit: zero old route references (excluding redirects)
- [ ] SEO audit: sitemap.xml includes all new routes

---

## Phase 5: UX Refinement and Validation

### Goal
Polish the navigation experience, add missing UX patterns (breadcrumbs, loading states, empty states), and validate the redesign with real users.

### Scope
- Add breadcrumbs to all detail pages (topic, dimension, domain, journey, path, ayah)
- Improve active state indicators in navigation
- Add keyboard shortcuts documentation (`?` to open)
- Enhance mobile touch targets (minimum 44×44px)
- Add loading states for all async content
- Add empty states for all lists (no bookmarks, no notes, no journeys)
- Conduct usability testing (5–8 users, if possible)
- Fix any remaining issues identified in testing

### Affected Routes / Components

| File | Change |
|------|--------|
| All detail pages (`topic`, `dimension`, `domain`, `journey`, `path`, `ayah`) | Add `<Breadcrumbs />` component |
| `src/components/layout/site-header.tsx` | Improve active state styling |
| `src/components/layout/mobile-bottom-nav.tsx` | Improve active state styling |
| `src/components/ui/keyboard-shortcuts.tsx` | New component |
| All navigation components | Ensure touch targets ≥ 44×44px |
| All async pages | Add `<Loading />` skeleton |
| All list pages | Add `<EmptyState />` component |
| Usability testing | Recruit 5–8 users, conduct moderated sessions |

### Dependencies
- Phases 1–4 must be complete.

### Risk Assessment
- **Risk Level:** High
- **What could go wrong:**
  - Extensive styling changes introduce visual regressions (mitigated by visual regression tests)
  - Usability testing reveals fundamental IA problems (mitigated by iterative design)
  - Keyboard shortcuts conflict with browser defaults (mitigated by careful key selection)
  - Touch target changes break mobile layout (mitigated by responsive testing)
- **Mitigation:** Visual regression tests at every breakpoint; iterative usability testing; careful keyboard shortcut selection; responsive QA.

### Acceptance Criteria

- [ ] Breadcrumbs on all detail pages (topic, dimension, domain, journey, path, ayah)
- [ ] Clear active states in desktop header and mobile bottom nav
- [ ] All touch targets ≥ 44×44px (verified with axe-core)
- [ ] Loading states for all async content (skeleton screens)
- [ ] Empty states for all lists (bookmarks, notes, collections, journeys, paths)
- [ ] Keyboard shortcuts documentation accessible via `?` key
- [ ] Usability testing completed (5–8 users)
- [ ] All critical usability issues resolved
- [ ] Accessibility audit passes (WCAG 2.1 AA)
- [ ] Visual regression tests pass at 3 breakpoints
- [ ] Existing tests still pass

### Estimated Effort
**High** — 1–2 weeks.

### Rollback Plan
1. Revert styling changes (breadcrumbs, active states, touch targets)
2. Remove loading/empty state components
3. Remove keyboard shortcuts component
4. No data migration to undo
5. Usability testing findings are informational — no code to revert

### Testing Checklist
- [ ] Visual regression test: all detail pages at 3 breakpoints
- [ ] Accessibility test: axe-core passes
- [ ] Unit test: Breadcrumbs renders correct hierarchy
- [ ] Usability test: 5–8 users complete core tasks
- [ ] Touch target audit: all elements ≥ 44×44px

---

## Migration Impact Analysis

### Routes That Remain Unchanged

These routes are not affected by any phase:

- `/` (Home)
- `/quran` (Quran reader)
- `/quran/[slug]` (Surah reader)
- `/ayah/[surah]/[ayah]` (Ayah reader)
- `/my-study` (personal workspace)
- `/my-study/notes`
- `/my-study/collections`
- `/my-study/bookmarks`
- `/my-study/settings`
- `/learn` (Learn hub)
- `/learn/paths`
- `/learn/plans`
- `/learn/revision`
- `/learn/quiz`
- `/explore` (Explore hub — dimensions rendered inline, no separate index)
- `/explore/dimension/[id]`
- `/explore/domains`
- `/explore/domains/[id]`
- `/explore/graph`

### Routes That Need Redirects

| Old Route | New Route | Redirect Type | Phase |
|-----------|-----------|---------------|-------|
| `/library` | `/my-study` | 308 | 2 |
| `/library/notes` | `/my-study/notes` | 308 | 2 |
| `/study-journeys` | `/learn/journeys` | 308 | 3 |
| `/study-journeys/[slug]` | `/learn/journeys/[slug]` | 308 | 3 |
| `/explore/topics` | `/topics` | 308 | 2 |
| `/explore/topics/[slug]` | `/topics/[slug]` | 308 | 2 |
| `/discover` | `/explore` | 308 | 4 (after audience-paths migration) |

### Components That Can Be Reused

These components require no changes: `AyahCard`, `ReaderControls`, `AudioPlayer`, `TafsirViewer`, `WordByWord`, `CrossReferencePanel`, `RootContextPanel`, `SourcePanel`, `TopicGraph`, `KnowledgeGraph`

### Components That Need Restructuring

- `site-header.tsx` — nav item reordering (Phase 1)
- `mobile-bottom-nav.tsx` — nav item reordering (Phase 1)
- `learn-nav.tsx` — add Journeys tab (Phase 3)
- `explore/page.tsx` — enhance hub layout (Phase 4)
- `my-study/settings/page.tsx` — add backup controls (Phase 2)

### SEO Implications

- All route changes use HTTP 308 (permanent, method-preserving) via `next.config.js` `redirects()` with `permanent: true`
- No redirect chains; each old route points directly to new route
- All new pages include canonical URLs pointing to new routes
- `sitemap.xml` updated after each phase
- Meta tags (title, description, og:title, og:description) verified

### Deep Links and Bookmarks

All old routes redirect to new routes (HTTP 308). Users with bookmarks are seamlessly redirected. Test all redirects with `curl -I` and verify:
- HTTP status is 308 (not 301, 302, or 307)
- Target route resolves correctly
- Query strings preserved
- Path parameters preserved (for dynamic routes)

---

## Testing Strategy

**Unit Tests (Jest, React Testing Library):**
- Navigation components: 90%+ coverage
- Redirect logic: 100% coverage
- Nav item count, active states, redirect codes, backup export

**Integration Tests (Next.js test utilities):**
- All old routes return HTTP 308
- Redirect targets resolve correctly
- localStorage data persists across route changes

**E2E Tests (Playwright):**
- Navigate from old bookmark to new location
- Start, resume, complete a journey
- Navigate Explore hub to topic/root detail
- Export and import backup

**Accessibility Testing (axe-core, Lighthouse):**
- WCAG 2.1 AA compliance
- Keyboard navigation, screen reader compatibility
- Color contrast (4.5:1), touch targets (44×44px)
- Focus management

**Mobile Responsiveness Testing:**
- Breakpoints: 320px, 375px, 768px, 1024px, 1440px
- Navigation layout, touch targets, content readability
- No horizontal scroll at any breakpoint

---

## Rollback Strategy

### General Principles

1. **Every phase is independently rollbackable.**
2. **No data migration means no data rollback.**
3. **Redirects are the easiest thing to revert.**
4. **Visual changes are reverted with git.**

### Phase-Specific Rollback

**Phase 1:** `git revert <commit>` — reverts nav/metadata changes

**Phase 2:** Remove redirects in `src/app/library/`, restore Library components, re-add nav item

**Phase 3:** Move `src/app/learn/journeys/` back to `src/app/study-journeys/`, remove redirects, revert LearnNav

**Phase 4:** Move `src/app/explore/topics/` back to `src/app/topics/`, rename roots back, remove redirects, restore sitemap

**Phase 5:** Revert styling changes, remove loading/empty/keyboard components

All phases: No data migration to undo (localStorage unchanged)

### Communication Plan

If rollback needed: Inform team → Notify users if affected → Root cause analysis → Fix and re-deploy → Post-mortem

---

## Success Metrics

### Quantitative Metrics

**Navigation Depth:**
- **Baseline:** Average 3.2 clicks to reach key features
- **Target:** Average 2.0 clicks to reach key features
- **Measurement:** Analytics tracking (if available) or manual audit

**Discoverability:**
- **Baseline:** 4 orphaned features (not in navigation)
- **Target:** 0 orphaned features
- **Measurement:** Feature inventory audit

**Task Completion Time:**
- **Baseline:** Average 45 seconds to complete core tasks
- **Target:** Average 30 seconds to complete core tasks
- **Measurement:** Usability testing (Phase 5)

**Error Rate:**
- **Baseline:** Unknown (no tracking)
- **Target:** < 1% navigation errors (404s, wrong clicks)
- **Measurement:** Analytics tracking (if available)

### Qualitative Metrics

**User Confusion:**
- **Baseline:** Unknown (no support channel)
- **Target:** Zero support questions about navigation
- **Measurement:** Support ticket analysis (if available)

**User Satisfaction:**
- **Baseline:** Unknown
- **Target:** 4.0/5.0 average satisfaction rating
- **Measurement:** Usability testing (Phase 5)

**Accessibility:**
- **Baseline:** Unknown (no audit)
- **Target:** WCAG 2.1 AA compliance
- **Measurement:** axe-core audit

### Long-Term Metrics

- **Retention:** 10% increase in 30-day retention (analytics)
- **Engagement:** 20% increase in daily active users (analytics)
- **Feature Adoption:** 50% of users explore 3+ features (analytics)

---

## Implementation Timeline

**Week 1:** Phase 1 (2-4 hours) + Phase 2 (1-2 days)
**Week 2:** Phase 3 (1-2 days) + Phase 4 (2-3 days)
**Week 3:** Phase 5 polish work (1 week)
**Week 4:** Usability testing (5-8 users) + final QA + launch

Total: 3-4 weeks of focused work.

---

## Risk Mitigation

**Technical Risks:**
- Redirects break deep links → Test with curl; revert if needed
- localStorage data lost → Keys are route-independent; backup controls available
- SEO impact → Use HTTP 308s; update sitemap; monitor search console

**Usability Risks:**
- New navigation confuses users → Usability testing in Phase 5; revert if critical issues
- Touch targets too small → Enforce 44×44px minimum; test on devices
- Keyboard shortcuts conflict → Careful key selection; test in browsers

**Process Risks:**
- Phase dependencies cause delays → Strict ordering; adjust timeline if needed
- Usability testing reveals problems → Iterative design; extend timeline
- Team bandwidth insufficient → Clear scope; reduce Phase 5 if needed

---

## Conclusion

This roadmap provides a clear, phased approach to the FAHM IA redesign. Each phase is independently shippable, testable, and rollbackable. The plan prioritizes low-risk changes first, building confidence before tackling complex restructuring.

**Key Success Factors:**
1. Strict phase ordering
2. Comprehensive testing at every phase
3. Clear acceptance criteria
4. Documented rollback plans
5. Usability validation before launch

**Next Steps:** Review and approve → Assign developer to Phase 1 → Begin implementation

---

**Document Version:** 1.0
**Last Updated:** November 11, 2026
**Status:** PROPOSED (awaiting approval)
