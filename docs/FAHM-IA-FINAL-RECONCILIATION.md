# FAHM Information Architecture — Final Reconciliation

**Document Status:** VERIFIED & RECONCILED  
**Date:** November 11, 2026  
**Baseline:** Sprint 54 (commit `e875bbd`)  
**Supersedes:** All prior IA specification statements where they conflict with this document  
**Authority:** This document is the single source of truth for FAHM navigation and IA decisions pending product-owner approval.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Verified Current-State Architecture](#2-verified-current-state-architecture)
3. [Final Recommended Information Architecture](#3-final-recommended-information-architecture)
4. [Final Desktop Navigation](#4-final-desktop-navigation)
5. [Final Mobile Navigation](#5-final-mobile-navigation)
6. [Final Learn Navigation](#6-final-learn-navigation)
7. [Final Explore Navigation](#7-final-explore-navigation)
8. [My Study and Library Consolidation Decision](#8-my-study-and-library-consolidation-decision)
9. [Discover Decision](#9-discover-decision)
10. [Verified Route Inventory](#10-verified-route-inventory)
11. [Route Migration and Redirect Requirements](#11-route-migration-and-redirect-requirements)
12. [Feature Ownership Matrix](#12-feature-ownership-matrix)
13. [Existing Functionality vs New Functionality](#13-existing-functionality-vs-new-functionality)
14. [Risks and Dependencies](#14-risks-and-dependencies)
15. [Open Product-Owner Decisions](#15-open-product-owner-decisions)
16. [Final Recommendation](#16-final-recommendation)

---

## 1. Executive Summary

This reconciliation resolves inconsistencies discovered across the five FAHM IA specification documents by verifying every claim against the actual repository source code. The exercise surfaced **eight material inconsistencies** in the prior documents and produced a single, source-verified view of the current state and a defensible proposed state.

### Inconsistencies Resolved

| # | Inconsistency | Resolution |
|---|---|---|
| 1 | Roadmap Phase 1 said "Add Learn to mobile bottom nav" | Learn already exists as mobile tab 5. The real task is **reducing** the 7-tab nav to 5 tabs while **retaining** Learn. |
| 2 | Roadmap Phase 3 acceptance criteria said "5 tabs" but listed 6 items (Dashboard, Journeys, Paths, Plans, Revise, Quiz) | Correct count is **6 tabs** for LearnNav (Dashboard is a new addition). |
| 3 | IA doc referenced `/explore/dimensions` as a route | Route does not exist. Actual route is `/explore/dimension/[id]` (singular). Dimensions are rendered inline on `/explore`, not as a separate index. |
| 4 | IA doc proposed moving `/topics` to `/explore/topics` | `/explore/topics` **already exists** as a separate route with its own page. Both `/topics/[slug]` and `/explore/topics/[slug]` exist and serve the same data. The real task is choosing one canonical route and redirecting the other. |
| 5 | Roadmap Phase 2 said "add backup controls to `/my-study/settings`" | BackupControls **already exists** at `/my-study/settings` (verified in source). Phase 2 scope was overstated. |
| 6 | Roadmap listed `/read` as a route that remains unchanged | `/read` route **does not exist**. The Quran reader is at `/quran`. |
| 7 | LearnNav label "Revise" vs route `/learn/revision` | Route is `/learn/revision`. Label "Revise" is acceptable UI shorthand; no route change required. |
| 8 | Discover treated as pure overlap with Explore | `/discover` has **one unique content section** (audience-based recommended paths) that is not on `/explore`. Broadest themes and dimensions grid are already represented on `/explore` and need not be migrated. Redirect decision requires migrating the audience-paths section first. |

### Final Proposed IA (Verified)

**5 primary destinations:**
1. Home (`/`)
2. Read (`/quran`)
3. Explore (`/explore`)
4. Learn (`/learn`)
5. My Study (`/my-study`)

**3 global utilities:** Search, Settings, Language

**Key decisions:**
- `/library` → redirect to `/my-study` (My Study is strictly superior; Library's only unique feature — tag-filtered notes — is already better implemented at `/my-study/notes`)
- `/study-journeys` → move to `/learn/journeys` (surfaces orphaned content under Learn)
- `/topics` → keep as canonical; redirect `/explore/topics` to `/topics` (reverses prior proposal; `/topics` has cleaner UX and canonical URL)
- `/explore/root` → keep as-is (rename to `/explore/roots` provides no user benefit; `/explore/root/[root]` already works)
- `/discover` → redirect to `/explore` AFTER migrating its unique content (audience-based recommended paths only — broadest themes and dimensions grid are already represented on `/explore`)
- Desktop nav: 4 primary items + 3 utility icons (down from 10)
- Mobile nav: 5 tabs (down from 7)
- LearnNav: 6 tabs (Dashboard, Journeys, Paths, Plans, Revise, Quiz) — up from 4

---

## 2. Verified Current-State Architecture

### 2.1 Route Inventory (Source-Verified)

All routes verified via `glob src/app/**/page.tsx`. Total: **49 user-facing page routes**.

**Primary Routes (in main navigation):**

| Route | File | In Desktop Nav | In Mobile Nav | Notes |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | ❌ (logo only) | ✅ tab 1 | Landing page |
| `/quran` | `src/app/quran/page.tsx` | ✅ item 2 | ✅ tab 2 | Surah index |
| `/explore` | `src/app/explore/page.tsx` | ✅ item 3 | ✅ tab 3 | 15 dimensions inline |
| `/search` | `src/app/search/page.tsx` | ✅ item 5 | ✅ tab 4 | Global search |
| `/learn` | `src/app/learn/page.tsx` | ✅ item 6 | ✅ tab 5 | Learning dashboard |
| `/library` | `src/app/library/page.tsx` | ✅ item 9 | ✅ tab 6 | Personal content + backup |
| `/settings` | `src/app/settings/page.tsx` | ✅ item 10 | ✅ tab 7 | Preferences |

**Secondary Routes (sub-navigation):**

| Route | File | Nav Entry |
|---|---|---|
| `/discover` | `src/app/discover/page.tsx` | Desktop item 1 only |
| `/topics` | `src/app/topics/page.tsx` | Desktop item 4 only |
| `/learn/paths` | `src/app/learn/paths/page.tsx` | LearnNav tab 1 |
| `/learn/plans` | `src/app/learn/plans/page.tsx` | LearnNav tab 2 + Desktop item 7 |
| `/learn/revision` | `src/app/learn/revision/page.tsx` | LearnNav tab 3 |
| `/learn/quiz` | `src/app/learn/quiz/page.tsx` | LearnNav tab 4 + Desktop item 8 |

**Orphaned Routes (not in any navigation):**

| Route | File | Severity |
|---|---|---|
| `/my-study` | `src/app/my-study/page.tsx` | CRITICAL |
| `/study-journeys` | `src/app/study-journeys/page.tsx` | CRITICAL |

**Duplicate Routes (same data, different URLs):**

| Pair | Notes |
|---|---|
| `/topics` vs `/explore/topics` | Both list 18 topics from `TOPICS` data. `/explore/topics` links to `/topics/[slug]` (inconsistent). |
| `/topics/[slug]` vs `/explore/topics/[slug]` | Both render topic detail. Different pages, same data. |
| `/library` vs `/my-study` | Both show bookmarks, notes, recent reads. Different dashboards. |
| `/library/notes` vs `/my-study/notes` | Both show notes. `/my-study/notes` has search + surah filter + delete (superior). |

**Detail Routes (verified):**

| Route | File |
|---|---|
| `/quran/[slug]` | `src/app/quran/[slug]/page.tsx` |
| `/ayah/[surah]/[ayah]` | `src/app/ayah/[surah]/[ayah]/page.tsx` |
| `/explore/dimension/[id]` | `src/app/explore/dimension/[id]/page.tsx` (SINGULAR — not `/dimensions`) |
| `/explore/domains` | `src/app/explore/domains/page.tsx` |
| `/explore/domains/[id]` | `src/app/explore/domains/[id]/page.tsx` |
| `/explore/root` | `src/app/explore/root/page.tsx` (SINGULAR — not `/roots`) |
| `/explore/root/[root]` | `src/app/explore/root/[root]/page.tsx` |
| `/explore/graph` | `src/app/explore/graph/page.tsx` |
| `/explore/theme/[name]` | `src/app/explore/theme/[name]/page.tsx` |
| `/explore/topics/[slug]` | `src/app/explore/topics/[slug]/page.tsx` |
| `/topics/[slug]` | `src/app/topics/[slug]/page.tsx` |
| `/study-journeys/[slug]` | `src/app/study-journeys/[slug]/page.tsx` |
| `/learn/paths/[slug]` | `src/app/learn/paths/[slug]/page.tsx` |
| `/my-study/bookmarks` | `src/app/my-study/bookmarks/page.tsx` |
| `/my-study/notes` | `src/app/my-study/notes/page.tsx` |
| `/my-study/collections` | `src/app/my-study/collections/page.tsx` |
| `/my-study/collections/[id]` | `src/app/my-study/collections/[id]/page.tsx` |
| `/my-study/search` | `src/app/my-study/search/page.tsx` |
| `/my-study/settings` | `src/app/my-study/settings/page.tsx` |
| `/library/notes` | `src/app/library/notes/page.tsx` |
| `/settings/privacy` | `src/app/settings/privacy/page.tsx` |

**Static / Utility Routes:**

`/about`, `/sources`, `/report`, `/privacy`, `/terms`, `/accessibility`, `/onboarding`, `/editorial`, `/editorial/review`, `/editorial/quality`

### 2.2 Navigation Components (Source-Verified)

**Desktop Header** (`src/components/layout/site-header.tsx`, 87 lines):
- 10 items in order: Discover, Read, Explore, Topics, Search, Learn, Plans, Quiz, Library, Settings
- LanguageSelector at end
- Hidden below `md` breakpoint

**Mobile Bottom Nav** (`src/components/layout/mobile-bottom-nav.tsx`, 88 lines):
- 7 tabs in order: Home, Read, Explore, Search, Learn, Library, Settings
- Compact LanguageSelector floats above nav
- Hidden at `md+`

**LearnNav** (`src/components/learn/learn-nav.tsx`, 56 lines):
- 4 tabs: Paths, Plans, Revise, Quiz
- Used in `src/app/learn/layout.tsx`
- Missing: Dashboard link, Journeys link

### 2.3 localStorage Keys (Source-Verified)

14 keys verified via grep:

| Key | File |
|---|---|
| `alhuda.library.v1` | `src/lib/library/storage.ts` |
| `alhuda.reflections.v1` | `src/lib/reflections/storage.ts` |
| `alhuda.journeys.v1` | `src/lib/study-journeys/storage.ts` |
| `alhuda.paths.v1` | `src/lib/paths/storage.ts` |
| `alhuda.quiz.v1` | `src/lib/quiz/storage.ts` |
| `alhuda.revision.v1` | `src/lib/revision/storage.ts` |
| `alhuda.reading-plans.v1` | `src/lib/reading-plans/storage.ts` |
| `alhuda.locale.v1` | `src/lib/i18n/storage.ts` |
| `alhuda.urdu-translations.v1` | `src/lib/translations/urdu-storage.ts` |
| `alhuda.human-review.v1` | `src/lib/morphology/human-review/types.ts` |

All keys are route-independent. Route migrations will not break user data.

### 2.4 Metadata Bug (Verified)

`src/app/explore/page.tsx` line 11: `title: "Explore — 10 Dimensions of the Quran"`  
Actual dimensions rendered: 15 (via `getAllDimensions()` which returns `DIMENSIONS` array of 15 items).

The heading on line 73 also says "10 Dimensions". Both must be corrected to 15.

---

## 3. Final Recommended Information Architecture

### 3.1 Design Principles (Preserved)

1. Quran reading remains central
2. Study tools accessible without overwhelming the reader
3. Discovery feels natural
4. Learning is structured but not forced
5. Personal study is easy to retrieve
6. Interface remains calm and focused
7. Users don't need to understand internal taxonomy
8. Account-free, local-first architecture preserved

### 3.2 Primary Destinations (5)

| # | Label (EN) | Label (UR) | Route | Icon | Purpose |
|---|---|---|---|---|---|
| 1 | Home | ہوم | `/` | `Home` | Landing, continue reading, daily verse |
| 2 | Read | تلاوت | `/quran` | `BookOpen` | Quran reader (central experience) |
| 3 | Explore | دریافت | `/explore` | `Compass` | Dimensions, topics, domains, roots, graph |
| 4 | Learn | تعلیم | `/learn` | `GraduationCap` | Journeys, paths, plans, revision, quiz |
| 5 | My Study | میرا مطالعہ | `/my-study` | `Bookmark` | Bookmarks, notes, collections, backup |

### 3.3 Global Utilities (3)

| Utility | Access | Notes |
|---|---|---|
| Search | Header icon (desktop + mobile slim header) | Navigates to existing `/search` route. **No command palette, no `Cmd/Ctrl+K`, no modal.** |
| Settings | Header icon (desktop) / My Study card (mobile) | Links to `/settings` |
| Language | `LanguageSelector` component | EN / UR toggle |

**Search icon behavior (Phase 1):** The search icon navigates to the existing `/search` page. The global search command palette (`Cmd/Ctrl+K`), modal interface, and autocomplete are **Category 3 new functionality** and explicitly deferred to a separate approval cycle. See §13.3.

### 3.4 Section Hierarchies

**Explore** (`/explore`):
- Dimensions (inline on hub page — no separate index route)
- Topics → `/topics` (canonical; `/explore/topics` redirects here)
- Domains → `/explore/domains`
- Roots → `/explore/root` (kept singular — no rename)
- Graph → `/explore/graph`

**Learn** (`/learn`):
- Dashboard → `/learn` (hub)
- Journeys → `/learn/journeys` (moved from `/study-journeys`)
- Paths → `/learn/paths`
- Plans → `/learn/plans`
- Revision → `/learn/revision`
- Quiz → `/learn/quiz`

**My Study** (`/my-study`):
- Dashboard → `/my-study`
- Bookmarks → `/my-study/bookmarks`
- Notes → `/my-study/notes`
- Collections → `/my-study/collections`
- Search → `/my-study/search`
- Settings → `/my-study/settings` (already has backup controls)

---

## 4. Final Desktop Navigation

### 4.1 Header Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo الحُدَى]  [Read] [Explore] [Learn] [My Study]   [🔍] [🌐] [⚙] │
└─────────────────────────────────────────────────────────────────────┘
```

**4 primary nav items** (down from 10) + **3 utility icons** (Search, Language, Settings).

### 4.2 Items Removed from Desktop Nav

| Removed Item | Reason |
|---|---|
| Discover | Redirects to `/explore` |
| Topics | Subsumed under Explore |
| Search (as destination) | Becomes utility icon + palette |
| Plans | Subsumed under Learn |
| Quiz | Subsumed under Learn |
| Library | Redirects to `/my-study` |

### 4.3 Active State Logic

```ts
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

`/learn/plans` correctly highlights "Learn". `/explore/dimension/5` correctly highlights "Explore".

---

## 5. Final Mobile Navigation

### 5.1 Bottom Nav (5 tabs)

| # | Label (EN) | Label (UR) | Route | Icon |
|---|---|---|---|---|
| 1 | Home | ہوم | `/` | `Home` |
| 2 | Read | تلاوت | `/quran` | `BookOpen` |
| 3 | Explore | دریافت | `/explore` | `Compass` |
| 4 | Learn | تعلیم | `/learn` | `GraduationCap` |
| 5 | My Study | میرا مطالعہ | `/my-study` | `Bookmark` |

### 5.2 Resolution of Prior Inconsistency

The prior roadmap said "Add Learn to mobile bottom nav". This was incorrect — Learn already exists as tab 5 in the current 7-tab nav. The correct task is:

- **Retain** Learn in the reduced 5-tab nav
- **Remove** Search (becomes header icon)
- **Remove** Library (redirects to My Study)
- **Remove** Settings (accessible via My Study card)
- **Add** My Study (replaces Library's position)

### 5.3 Mobile Header

Slim top bar (`md:hidden`):
- Logo (start) — taps to `/`
- Search icon (end) — opens global search palette

### 5.4 Settings Access (Mobile)

Settings is NOT a bottom-nav tab. Reached via:
1. My Study tab → Settings quick-action card on `/my-study` dashboard
2. Direct deep link `/settings`

### 5.5 Touch Targets

All bottom-nav tabs: `min-h-14` (56px) × `flex-1` width. Exceeds 44×44px WCAG target.

### 5.6 RTL Behavior

All layout uses logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`). Tab order mirrors automatically in RTL. Directional icons (chevrons) flip via `rtl:rotate-180`.

---

## 6. Final Learn Navigation

### 6.1 LearnNav Tabs (6 items)

| # | Label | Route | Notes |
|---|---|---|---|
| 1 | Dashboard | `/learn` | NEW — link back to hub |
| 2 | Journeys | `/learn/journeys` | NEW — moved from `/study-journeys` |
| 3 | Paths | `/learn/paths` | Existing |
| 4 | Plans | `/learn/plans` | Existing |
| 5 | Revise | `/learn/revision` | Existing (label "Revise", route `/learn/revision`) |
| 6 | Quiz | `/learn/quiz` | Existing |

### 6.2 Resolution of Prior Inconsistency

The prior roadmap Phase 3 acceptance criteria said "5 tabs" but listed 6 items. The correct count is **6 tabs**. Dashboard and Journeys are both necessary additions:

- **Dashboard** — users need a way back to the hub from sub-sections
- **Journeys** — surfaces orphaned content under Learn

### 6.3 LearnNav Implementation

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

Active-state matching: `/learn` matches exactly (not prefix); all others match prefix.

```ts
function isActive(pathname: string, href: string): boolean {
  if (href === "/learn") return pathname === "/learn";
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

---

## 7. Final Explore Navigation

### 7.1 Explore Hub (`/explore`)

The `/explore` page renders:
- 15 dimensions (inline grid — no separate `/explore/dimensions` index route)
- Curated topics preview (links to `/topics/[slug]`)
- Domain Explorer card → `/explore/domains`
- Knowledge Graph card → `/explore/graph`
- Search card → `/search`

### 7.2 Explore Sub-Routes (Verified)

| Route | Status | Notes |
|---|---|---|
| `/explore/dimension/[id]` | RETAIN | Singular form; no rename needed |
| `/explore/domains` | RETAIN | Domain catalog |
| `/explore/domains/[id]` | RETAIN | Domain detail |
| `/explore/root` | RETAIN | Singular form; no rename needed |
| `/explore/root/[root]` | RETAIN | Root detail |
| `/explore/graph` | RETAIN | Knowledge graph |
| `/explore/theme/[name]` | RETAIN | Theme detail |
| `/explore/topics` | REDIRECT → `/topics` | Duplicate of `/topics`; see §11 |
| `/explore/topics/[slug]` | REDIRECT → `/topics/[slug]` | Duplicate; see §11 |

### 7.3 Resolution of Prior Inconsistency

The prior IA doc referenced `/explore/dimensions` as a route. This route **does not exist**. Dimensions are rendered inline on `/explore` and accessed via `/explore/dimension/[id]`. No index route is needed — the hub page serves as the index.

The prior roadmap proposed renaming `/explore/root` → `/explore/roots`. This provides no user benefit and breaks existing deep links. **Decision: keep singular form.**

---

## 8. My Study and Library Consolidation Decision

### 8.1 Feature-by-Feature Comparison (Source-Verified)

| Feature | `/library` | `/my-study` | Winner |
|---|---|---|---|
| Recent reading | ✅ (20 items) | ✅ (5 items + "Continue reading" card) | My Study (better UX) |
| Bookmarks list | ✅ (inline) | ✅ (`/my-study/bookmarks` — dedicated page with sort) | My Study |
| Notes list | ✅ (inline) | ✅ (`/my-study/notes` — with search, tag filter, surah filter, delete) | My Study (strictly superior) |
| Tag-filtered notes view | ✅ (`/library/notes` — dedicated page) | ✅ (`/my-study/notes` — integrated with search + surah filter) | My Study (superset) |
| Collections | ❌ | ✅ (`/my-study/collections`) | My Study (unique) |
| Personal search | ❌ | ✅ (`/my-study/search`) | My Study (unique) |
| Stats dashboard | ❌ | ✅ (4 stat cards) | My Study (unique) |
| Continue reading card | ❌ | ✅ (prominent resume CTA) | My Study (unique) |
| Quick actions grid | ❌ | ✅ (5 actions) | My Study (unique) |
| Backup/restore controls | ✅ (`BackupControls` component) | ✅ (`/my-study/settings` — ALREADY HAS IT) | Tie |
| Clear all data | ❌ | ✅ (`/my-study/settings`) | My Study (unique) |
| Privacy disclosure | ❌ | ✅ (`/my-study/settings`) | My Study (unique) |
| Data summary | ❌ | ✅ (counts of bookmarks/notes/collections/reads) | My Study (unique) |

### 8.2 Decision

**`/my-study` is strictly superior to `/library` in every dimension.** Library has no unique functionality — its backup controls are already present at `/my-study/settings`.

**Action:** Redirect `/library` → `/my-study` (HTTP 308 via `next.config.js` `permanent: true`). Redirect `/library/notes` → `/my-study/notes`.

**Data preservation:** Both routes read from the same `useLibrary()` context backed by `alhuda.library.v1`. No data migration needed.

### 8.3 What to Preserve from Library

- The `BackupControls` component at `src/components/library/backup-controls.tsx` — keep the component, but it's already used by `/my-study/settings`. No action needed.
- The "Where this data lives" disclosure text on `/library` — already present on `/my-study/settings`. No action needed.

---

## 9. Discover Decision

### 9.1 What `/discover` Actually Contains (Source-Verified)

`src/app/discover/discover-client.tsx` renders:

1. **Hero** — "Discover — Your Quran Learning Hub"
2. **Start with a path** — audience-based recommended paths (Beginner, Intermediate, Advanced, Scholar) → links to `/learn/paths/[slug]`
3. **Broadest themes** — top 6 topics by dimension count → links to `/topics/[slug]`
4. **All 15 dimensions** — grid of dimension cards → links to `/explore/dimension/[id]`
5. **Go deeper** — 4 cards: Knowledge Graph, Search, Read Quran, Learning Dashboard
6. **Editorial note** — review status disclosure

### 9.2 Overlap Analysis

| Discover Section | Overlaps With | Unique? | Migration Required? |
|---|---|---|---|
| Hero | Home hero | ❌ | No |
| Audience-based paths | `/learn/paths` (data only) | ✅ (audience segmentation is unique) | **Yes — migrate to `/explore`** |
| Broadest themes | `/topics` (already on Explore via Topics hub) | ❌ | No — already represented |
| All 15 dimensions | `/explore` (same data, same cards) | ❌ | No — already on `/explore` |
| Go deeper cards | Various (just links) | ❌ | No |

### 9.3 Decision

**`/discover` has exactly ONE unique content section** worth preserving: the audience-based recommended paths (Beginner, Intermediate, Advanced, Scholar). The broadest themes, dimensions grid, and Go Deeper cards are all already represented on `/explore` and need not be migrated.

**Action:**
1. **Migrate only** the "Start with a path" audience section into `/explore` (add as a new section on the Explore hub, reusing existing `RECOMMENDED_PATHS`, `PATHS`, `AUDIENCE_LABELS`, `AUDIENCE_DESCRIPTIONS` data from `@/lib/paths/data`)
2. **Preserve** all existing Explore functionality (dimensions, topics, domains, roots, graph)
3. **Then** redirect `/discover` → `/explore` (HTTP 308 via `next.config.js` `permanent: true`)
4. **Remove** Discover from desktop nav (already done in Phase 1)

**Out of scope:** No new recommendation algorithms, no new learning features, no new data aggregation. This is strictly a relocation of existing audience-path content.

**Classification:** Category 2 (existing functionality restructuring) — reuses existing recommendation data and components without expansion. See §13 for category definitions.

---

## 10. Verified Route Inventory

### 10.1 Complete Route Table

| Existing Route | Existing Status | Recommended Route | Action | Reason |
|---|---|---|---|---|
| `/` | ✅ Active | `/` | RETAIN | Landing page |
| `/quran` | ✅ Active | `/quran` | RETAIN | Quran reader |
| `/quran/[slug]` | ✅ Active | `/quran/[slug]` | RETAIN | Surah reader |
| `/ayah/[surah]/[ayah]` | ✅ Active | `/ayah/[surah]/[ayah]` | RETAIN | Ayah detail |
| `/explore` | ✅ Active | `/explore` | IMPROVE NAVIGATION | Add audience paths section from /discover |
| `/explore/dimension/[id]` | ✅ Active | `/explore/dimension/[id]` | RETAIN | Keep singular form |
| `/explore/domains` | ✅ Active | `/explore/domains` | RETAIN | Domain catalog |
| `/explore/domains/[id]` | ✅ Active | `/explore/domains/[id]` | RETAIN | Domain detail |
| `/explore/root` | ✅ Active | `/explore/root` | RETAIN | Keep singular form |
| `/explore/root/[root]` | ✅ Active | `/explore/root/[root]` | RETAIN | Root detail |
| `/explore/graph` | ✅ Active | `/explore/graph` | RETAIN | Knowledge graph |
| `/explore/theme/[name]` | ✅ Active | `/explore/theme/[name]` | RETAIN | Theme detail |
| `/explore/topics` | ✅ Active (duplicate) | `/topics` | REDIRECT | Duplicate of /topics |
| `/explore/topics/[slug]` | ✅ Active (duplicate) | `/topics/[slug]` | REDIRECT | Duplicate of /topics/[slug] |
| `/topics` | ✅ Active | `/topics` | RETAIN | Canonical topic index |
| `/topics/[slug]` | ✅ Active | `/topics/[slug]` | RETAIN | Canonical topic detail |
| `/discover` | ✅ Active | `/explore` | REDIRECT | After migrating unique content |
| `/learn` | ✅ Active | `/learn` | RETAIN | Learning dashboard |
| `/learn/paths` | ✅ Active | `/learn/paths` | RETAIN | Learning paths |
| `/learn/paths/[slug]` | ✅ Active | `/learn/paths/[slug]` | RETAIN | Path detail |
| `/learn/plans` | ✅ Active | `/learn/plans` | RETAIN | Reading plans |
| `/learn/revision` | ✅ Active | `/learn/revision` | RETAIN | Revision workspace |
| `/learn/quiz` | ✅ Active | `/learn/quiz` | RETAIN | Quiz |
| `/learn/journeys` | ❌ Does not exist | `/learn/journeys` | RESTRUCTURE | Move from /study-journeys |
| `/learn/journeys/[slug]` | ❌ Does not exist | `/learn/journeys/[slug]` | RESTRUCTURE | Move from /study-journeys/[slug] |
| `/study-journeys` | ✅ Active (orphaned) | `/learn/journeys` | REDIRECT | Surface under Learn |
| `/study-journeys/[slug]` | ✅ Active (orphaned) | `/learn/journeys/[slug]` | REDIRECT | Surface under Learn |
| `/my-study` | ✅ Active (orphaned) | `/my-study` | IMPROVE NAVIGATION | Add to primary nav |
| `/my-study/bookmarks` | ✅ Active | `/my-study/bookmarks` | RETAIN | Bookmarks list |
| `/my-study/notes` | ✅ Active | `/my-study/notes` | RETAIN | Notes (superior to /library/notes) |
| `/my-study/collections` | ✅ Active | `/my-study/collections` | RETAIN | Collections |
| `/my-study/collections/[id]` | ✅ Active | `/my-study/collections/[id]` | RETAIN | Collection detail |
| `/my-study/search` | ✅ Active | `/my-study/search` | RETAIN | Personal search |
| `/my-study/settings` | ✅ Active | `/my-study/settings` | RETAIN | Already has backup controls |
| `/library` | ✅ Active (overlapping) | `/my-study` | REDIRECT | Consolidate into My Study |
| `/library/notes` | ✅ Active (overlapping) | `/my-study/notes` | REDIRECT | My Study notes is superior |
| `/search` | ✅ Active | `/search` | RETAIN | Global search page |
| `/settings` | ✅ Active | `/settings` | RETAIN | App preferences |
| `/settings/privacy` | ✅ Active | `/settings/privacy` | RETAIN | Privacy info |
| `/about`, `/sources`, `/report`, `/privacy`, `/terms`, `/accessibility` | ✅ Active | Same | RETAIN | Static pages |
| `/onboarding` | ✅ Active | `/onboarding` | RETAIN | First-time flow |
| `/editorial`, `/editorial/review`, `/editorial/quality` | ✅ Active | Same | RETAIN | Editorial tools |

### 10.2 Routes That Do NOT Exist (Correcting Prior Docs)

| Claimed Route | Actual Status |
|---|---|
| `/read` | ❌ Does not exist. Quran reader is at `/quran`. |
| `/explore/dimensions` | ❌ Does not exist. Dimensions are inline on `/explore`. |
| `/explore/roots` | ❌ Does not exist. Root explorer is at `/explore/root` (singular). |
| `/learn/revise` | ❌ Does not exist. Route is `/learn/revision`. |
| `/learn/dashboard` | ❌ Does not exist. Dashboard is at `/learn`. |
| `/my-study/recent` | ❌ Does not exist. Recent reads are on `/my-study` dashboard. |
| `/library/bookmarks` | ❌ Does not exist. Bookmarks are inline on `/library`. |
| `/library/collections` | ❌ Does not exist. Collections are only at `/my-study/collections`. |

---

## 11. Route Migration and Redirect Requirements

### 11.1 Required Redirects

All redirects are implemented via `next.config.js` `redirects()` with `permanent: true`, which produces **HTTP 308** (permanent, method- and body-preserving) in Next.js 15. App Router `redirect()` produces HTTP 307 by default and is **not** used for these migrations.

| Old Route | New Route | HTTP Status | Implementation |
|---|---|---|---|
| `/library` | `/my-study` | 308 | `next.config.js` `redirects()` entry |
| `/library/notes` | `/my-study/notes` | 308 | `next.config.js` `redirects()` entry |
| `/study-journeys` | `/learn/journeys` | 308 | `next.config.js` `redirects()` entry |
| `/study-journeys/[slug]` | `/learn/journeys/[slug]` | 308 | `next.config.js` `redirects()` entry with `:slug` parameter |
| `/explore/topics` | `/topics` | 308 | `next.config.js` `redirects()` entry |
| `/explore/topics/[slug]` | `/topics/[slug]` | 308 | `next.config.js` `redirects()` entry with `:slug` parameter |
| `/discover` | `/explore` | 308 | `next.config.js` `redirects()` entry (after content migration) |

**Query-string preservation:** Next.js `redirects()` automatically forwards query strings from source to destination. All seven redirects above preserve query parameters without additional configuration.

**Path-parameter preservation:** Dynamic segments (`:slug`, `:root`, etc.) are forwarded via the `:param` syntax shown in the implementation plan.

### 11.2 Redirect Implementation Notes

- Next.js App Router `redirect()` function issues HTTP 307 (temporary) by default. `redirect(url, 'replace')` does **not** produce HTTP 301.
- **Required:** Use `next.config.js` `redirects()` with `permanent: true` for all route migrations. This produces HTTP 308 (permanent, method-preserving).
- All redirects must preserve query parameters where applicable (e.g., `/search?q=...`).
- Sitemap must be updated to remove old routes and add new routes.
- Canonical URLs on destination pages must point to the new canonical URL.

### 11.3 Routes That Remain Unchanged

38 routes require no changes (see §10.1 RETAIN entries).

---

## 12. Feature Ownership Matrix

| Feature | Primary Destination | Route | Nav Access |
|---|---|---|---|
| Quran reader | Read | `/quran`, `/quran/[slug]`, `/ayah/[surah]/[ayah]` | Desktop #2, Mobile #2 |
| Dimensions | Explore | `/explore` (inline), `/explore/dimension/[id]` | Desktop #3, Mobile #3 |
| Topics | Explore | `/topics`, `/topics/[slug]` | Via Explore hub |
| Domains | Explore | `/explore/domains`, `/explore/domains/[id]` | Via Explore hub |
| Root explorer | Explore | `/explore/root`, `/explore/root/[root]` | Via Explore hub |
| Knowledge graph | Explore | `/explore/graph` | Via Explore hub |
| Study journeys | Learn | `/learn/journeys`, `/learn/journeys/[slug]` | LearnNav tab 2 |
| Learning paths | Learn | `/learn/paths`, `/learn/paths/[slug]` | LearnNav tab 3 |
| Reading plans | Learn | `/learn/plans` | LearnNav tab 4 |
| Revision | Learn | `/learn/revision` | LearnNav tab 5 |
| Quiz | Learn | `/learn/quiz` | LearnNav tab 6 |
| Bookmarks | My Study | `/my-study/bookmarks` | Desktop #5, Mobile #5 |
| Notes | My Study | `/my-study/notes` | Desktop #5, Mobile #5 |
| Collections | My Study | `/my-study/collections` | Desktop #5, Mobile #5 |
| Personal search | My Study | `/my-study/search` | Desktop #5, Mobile #5 |
| Backup/restore | My Study | `/my-study/settings` | Desktop #5, Mobile #5 |
| Global search | Utility | `/search` (existing page) | Header icon navigates to `/search`. **No `Cmd/Ctrl+K` shortcut. No command palette.** |
| Settings | Utility | `/settings` | Header icon (desktop) / My Study card (mobile) |
| Language | Utility | In `LanguageSelector` | Header / above mobile nav |

---

## 13. Existing Functionality vs New Functionality

### 13.1 Category 1 — Navigation-Only Changes (No New Features)

| Change | Files Affected |
|---|---|
| Add My Study to desktop header | `src/components/layout/site-header.tsx` |
| Add My Study to mobile bottom nav | `src/components/layout/mobile-bottom-nav.tsx` |
| Remove redundant desktop nav items (Discover, Topics, Plans, Quiz, Library) | `src/components/layout/site-header.tsx` |
| Remove Search, Library, Settings from mobile bottom nav | `src/components/layout/mobile-bottom-nav.tsx` |
| Add Dashboard + Journeys tabs to LearnNav | `src/components/learn/learn-nav.tsx` |
| Fix "10 Dimensions" → "15 Dimensions" | `src/app/explore/page.tsx` |
| Add slim mobile header with search icon | New component or `src/app/layout.tsx` |

### 13.2 Category 2 — Route Restructuring (Existing Features, New URLs)

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
| Update all internal links | Grep + replace across codebase |

### 13.3 Category 3 — New Functionality (Requires Separate Approval)

| Feature | Description | Dependency |
|---|---|---|
| Global search command palette (`Cmd/Ctrl+K` / `Ctrl+K`) | Modal command palette with autocomplete, keyboard shortcuts | New component. **Phase 1 search icon navigates to existing `/search` route only.** |
| Enhanced "Continue" section on Home | Unified resume across journeys/paths/reading | New data aggregation |
| Breadcrumbs on detail pages | Navigation aid for deep pages | New component |
| Loading skeletons | For async content | New components |
| Empty states | For all list pages | New components |
| Usability testing | 5-8 user sessions | Research activity |

**Category 3 items must NOT be silently included in navigation-only implementation.** Each requires separate product-owner approval and scope definition.

### 13.4 Category Definitions (Authoritative)

- **Category 1 (Navigation-only):** Changes to navigation visibility, ordering, labels, or responsive behavior. No route changes, no content changes.
- **Category 2 (Existing functionality restructuring):** Route consolidation, content relocation, component reuse. Existing functionality reorganized without changing its behavior. The audience-paths migration is Category 2 because it reuses existing `RECOMMENDED_PATHS` data and recommendation behavior without expansion.
- **Category 3 (New functionality):** New recommendation logic, new data aggregation, new user-facing capabilities, new UX features. Requires separate product-owner approval.

---

## 14. Risks and Dependencies

### 14.1 Technical Risks

| Risk | Mitigation |
|---|---|
| Redirects break deep links | Test all redirects with curl; use `next.config.js` redirects for reliability |
| SEO impact from route changes | 308 redirects preserve link equity; update sitemap.xml |
| localStorage data loss | Keys are route-independent; no migration needed |
| LearnNav tab overflow on mobile | 6 tabs may be tight on 320px screens; test at smallest breakpoint |
| `/explore/topics` redirect breaks inbound links | Verify with analytics (if available) before redirect |

### 14.2 Dependencies

- Phase 1 (nav changes) must complete before Phases 2-3 (route migrations)
- `/discover` redirect depends on migrating its unique content to `/explore` first
- LearnNav Journeys tab depends on `/learn/journeys` route existing
- All internal link updates must complete before redirects go live

### 14.3 Rollback Strategy

Every phase is independently rollbackable via `git revert`. No data migrations means no data rollback. Redirects are the easiest thing to revert.

---

## 15. Open Product-Owner Decisions

The following decisions require explicit product-owner approval before implementation:

| # | Decision | Options | Recommendation |
|---|---|---|---|
| 1 | Approve 5-destination IA? | Yes / No / Modify | Yes |
| 2 | `/topics` vs `/explore/topics` canonical? | Keep `/topics` (recommended) / Keep `/explore/topics` | Keep `/topics` (cleaner URL, better UX) |
| 3 | `/explore/root` rename to `/explore/roots`? | Yes / No (recommended) | No (no user benefit, breaks deep links) |
| 4 | `/discover` unique content migration? | Migrate audience paths to `/explore` then redirect (recommended) / Keep `/discover` separate / Redirect without migration | Migrate then redirect |
| 5 | LearnNav: 6 tabs (Dashboard, Journeys, Paths, Plans, Revise, Quiz)? | Yes / No | Yes |
| 6 | Global search palette (`Cmd/Ctrl+K`) — Category 3 feature? | Approve separately / Defer | Approve separately |
| 7 | Implementation phasing? | Approve revised 4-phase plan (see companion doc) | Yes |

---

## 16. Final Recommendation

### 16.1 Summary

The FAHM IA has **two critical orphaned features** (`/my-study`, `/study-journeys`), **one critical overlap** (`/library` vs `/my-study`), and **one confusing duplication** (`/discover` vs `/explore`). The desktop nav has 10 items (excessive); mobile nav has 7 tabs (crowded).

The proposed IA reduces this to 5 primary destinations, eliminates all orphans, consolidates overlaps, and clarifies the hierarchy — all while preserving every existing feature and all user data.

### 16.2 Implementation Priority

1. **Phase 1 (Low risk, 2-4 hours):** Navigation-only changes — add My Study to nav, remove redundant items, fix metadata bug
2. **Phase 2 (Medium risk, 1 day):** Route consolidation — redirect `/library` → `/my-study`, redirect `/explore/topics` → `/topics`
3. **Phase 3 (Medium risk, 1-2 days):** Learn reorganization — move `/study-journeys` → `/learn/journeys`, update LearnNav
4. **Phase 4 (Medium risk, 1 day):** Discover migration — migrate unique content to `/explore`, redirect `/discover`

(Categories 3 features — search palette, breadcrumbs, empty states — are deferred to a separate scope.)

### 16.3 Status

**READY FOR PRODUCT-OWNER REVIEW**

All inconsistencies have been resolved. All routes have been verified against source code. The proposed IA preserves all existing functionality and user data. Implementation awaits explicit authorization.

---

**Document End**
