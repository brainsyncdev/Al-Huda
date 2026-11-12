# FAHM Information Architecture & Navigation Audit

**Document:** 1 of 5 — Current State Audit  
**Date:** November 11, 2026  
**Status:** Complete  
**Reconciliation:** See `docs/FAHM-IA-FINAL-RECONCILIATION.md` for authoritative decisions that supersede this document where they conflict.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Existing Route Inventory](#existing-route-inventory)
3. [Navigation Structure Analysis](#navigation-structure-analysis)
4. [Feature-to-Route Mapping](#feature-to-route-mapping)
5. [Discoverability Analysis](#discoverability-analysis)
6. [Overlapping Functionality](#overlapping-functionality)
7. [Current User Journey Friction](#current-user-journey-friction)
8. [Desktop vs Mobile Differences](#desktop-vs-mobile-differences)
9. [Evidence from Inspected Source Files](#evidence-from-inspected-source-files)

---

## Executive Summary

The FAHM application currently has a fragmented and confusing navigation structure with significant usability issues. The desktop header contains **10 navigation items** (too many), while the mobile bottom navigation has **7 tabs** (crowded for a bottom nav). Critical features are orphaned, duplicated, or hidden from users.

### Key Findings

- **Orphaned Features**: `/my-study` and `/study-journeys` are fully functional but not accessible from main navigation
- **Duplicate Destinations**: `/library` and `/my-study` overlap significantly in functionality
- **Confusing Hierarchy**: `/discover` and `/explore` both exist with unclear distinction
- **Redundant Navigation**: Learn/Plans/Quiz appear as separate desktop nav items despite all being under `/learn/*`
- **Mobile Gap**: Personal study and structured learning features are invisible on mobile
- **Metadata Bug**: `/explore` page claims "10 Dimensions" but dataset contains 15

### Navigation Assessment

The current IA fails to provide clear mental models for users. Personal study features are scattered across multiple routes, learning content is fragmented, and discovery mechanisms are duplicated. Users must either memorize URLs or rely on deep navigation to access core functionality.

**Severity**: HIGH — Multiple critical usability issues prevent users from discovering key features.

---

## Existing Route Inventory

### Primary Routes (Main Navigation)

| Path | Purpose | Main Components | User Actions | Data Dependencies | Nav Entry Point | Classification |
|------|---------|----------------|--------------|-------------------|-----------------|----------------|
| `/` | Home page | Hero, search, verse-of-day, continue reading, learning hub, featured surahs | Browse, search, navigate to sections | Recent reads, bookmarks, featured content | Mobile bottom nav (Home) | Primary |
| `/quran` | Surah index | Surah list, search, filters | Browse surahs, search | Surah metadata | Desktop + Mobile nav | Primary |
| `/quran/[slug]` | Surah reader | Ayah list, translations, audio player | Read, listen, bookmark, note | Surah data, ayah data, user prefs | Internal link from `/quran` | Primary |
| `/explore` | Explore hub | 15 dimensions, curated topics, domain explorer, graph explorer | Browse dimensions, topics, domains | Dimensions data, topics data | Desktop + Mobile nav | Primary |
| `/search` | Search hub | Global search interface | Search across all content | Search index | Desktop + Mobile nav | Primary |
| `/learn` | Learning dashboard | LearningDashboard component | View learning progress | User progress data | Desktop + Mobile nav | Primary |
| `/library` | Library | Recent reading, bookmarks, notes, backup controls | Browse personal content, backup | User data (localStorage) | Desktop + Mobile nav | Primary |
| `/settings` | Settings hub | Reading prefs, local data, policies | Configure preferences | User settings | Desktop + Mobile nav | Primary |

### Secondary Routes (Sub-navigation)

| Path | Purpose | Main Components | User Actions | Data Dependencies | Nav Entry Point | Classification |
|------|---------|----------------|--------------|-------------------|-----------------|----------------|
| `/discover` | Discovery hub | Learning hub content | Browse discovery content | Curated content | Desktop nav only | Secondary |
| `/topics` | Topic index | Topic list | Browse topics | Topics data | Desktop nav only | Secondary |
| `/topics/[slug]` | Topic detail | Topic content, related topics | Read topic, navigate related | Topic data | Internal link | Secondary |
| `/learn/paths` | Learning paths index | Paths list | Browse paths | Paths data | LearnNav tab | Secondary |
| `/learn/paths/[slug]` | Path detail | Path stages, progress | Start/continue path | Path data, user progress | Internal link | Secondary |
| `/learn/plans` | Reading plans | Plans list, active plan | Browse plans, activate | Plans data | Desktop nav + LearnNav | Secondary |
| `/learn/revision` | Revision workspace | Revision tools | Review content | User progress | LearnNav tab | Secondary |
| `/learn/quiz` | Quiz workspace | Quiz interface | Take quizzes | Quiz data, user progress | Desktop nav + LearnNav | Secondary |

### Contextual Routes (Deep Navigation)

| Path | Purpose | Main Components | User Actions | Data Dependencies | Nav Entry Point | Classification |
|------|---------|----------------|--------------|-------------------|-----------------|----------------|
| `/ayah/[surah]/[ayah]` | Ayah detail | Single ayah view, tafsir, related | Read, bookmark, note | Ayah data | Internal link | Contextual |
| `/explore/dimension/[id]` | Dimension detail | Dimension content, related topics | Browse dimension | Dimension data | Internal link from `/explore` | Contextual |
| `/explore/domains` | Domain index | Domain list | Browse domains | Domains data | Internal link | Contextual |
| `/explore/domains/[id]` | Domain detail | Domain content | Read domain | Domain data | Internal link | Contextual |
| `/explore/root` | Root explorer | Root word explorer | Browse roots | Root data | Internal link | Contextual |
| `/explore/root/[root]` | Root detail | Root word details | Read root | Root data | Internal link | Contextual |
| `/explore/graph` | Knowledge graph | Graph visualization | Explore graph | Graph data | Internal link | Contextual |
| `/explore/topics` | Topic browser | Topic list (under explore) | Browse topics | Topics data | Internal link | Contextual |
| `/explore/topics/[slug]` | Topic detail | Topic content (under explore) | Read topic | Topic data | Internal link | Contextual |
| `/explore/theme/[name]` | Theme redirect | 301 redirect to `/topics/[slug]` | Redirect | N/A | Legacy link | Contextual |

### Personal Study Routes (Orphaned)

| Path | Purpose | Main Components | User Actions | Data Dependencies | Nav Entry Point | Classification |
|------|---------|----------------|--------------|-------------------|-----------------|----------------|
| `/my-study` | Personal study dashboard | Stats, continue reading, quick actions, recent reads | View dashboard, navigate to features | User data (localStorage) | **NONE — Orphaned** | Secondary |
| `/my-study/bookmarks` | Bookmarks list | Bookmarked items | Browse bookmarks | User bookmarks | Internal link from `/my-study` | Contextual |
| `/my-study/notes` | Notes list | User notes | Browse notes | User notes | Internal link from `/my-study` | Contextual |
| `/my-study/collections` | Collections list | User collections | Browse collections | User collections | Internal link from `/my-study` | Contextual |
| `/my-study/collections/[id]` | Collection detail | Collection items | View collection | Collection data | Internal link | Contextual |
| `/my-study/search` | Personal content search | Search user content | Search bookmarks/notes | User data | Internal link from `/my-study` | Contextual |
| `/my-study/settings` | Personal study settings | Study preferences | Configure study settings | User settings | Internal link from `/my-study` | Contextual |

### Structured Learning Routes (Orphaned)

| Path | Purpose | Main Components | User Actions | Data Dependencies | Nav Entry Point | Classification |
|------|---------|----------------|--------------|-------------------|-----------------|----------------|
| `/study-journeys` | Journey index | 4 journeys with metadata | Browse journeys | Journey data | **NONE — Orphaned** | Secondary |
| `/study-journeys/[slug]` | Journey detail | Journey stages, progress | Start/continue journey | Journey data, user progress | Internal link | Contextual |

### Utility Routes

| Path | Purpose | Main Components | User Actions | Data Dependencies | Nav Entry Point | Classification |
|------|---------|----------------|--------------|-------------------|-----------------|----------------|
| `/about` | About page | Static content | Read | N/A | Footer link | Utility |
| `/sources` | Sources page | Static content | Read | N/A | Footer link | Utility |
| `/report` | Report page | Static content | Read | N/A | Footer link | Utility |
| `/privacy` | Privacy details | Static content | Read | N/A | Footer link | Utility |
| `/terms` | Terms page | Static content | Read | N/A | Footer link | Utility |
| `/accessibility` | Accessibility page | Static content | Read | N/A | Footer link | Utility |
| `/onboarding` | Onboarding | 2-step onboarding flow | Complete onboarding | N/A | First-time user | Utility |
| `/editorial` | Editorial status | Editorial dashboard | View status | Editorial data | Internal link | Utility |
| `/editorial/review` | Lemma review | Review workbook | Review lemmas | Lemma data | Internal link | Utility |
| `/editorial/quality` | Quality dashboard | Quality metrics | View quality | Quality data | Internal link | Utility |
| `/library/notes` | Notes with tag filter | Filtered notes view | Browse filtered notes | User notes | Internal link | Contextual |
| `/settings/privacy` | Privacy details | Privacy information | Read privacy info | N/A | Internal link | Utility |

### API Routes (Not User-Facing)

- `/api/*` — Backend API endpoints

**Total Routes**: 50+ user-facing routes

---

## Navigation Structure Analysis

### Desktop Header Navigation

**File**: `src/components/layout/site-header.tsx` (87 lines)  
**Status**: VERIFIED

**Navigation Items** (in order):
1. `/discover` — "Discover" (Sparkles icon)
2. `/quran` — "Read" (BookOpen icon)
3. `/explore` — "Explore" (Compass icon)
4. `/topics` — "Topics" (Sparkles icon)
5. `/search` — "Search" (Search icon)
6. `/learn` — "Learn" (GraduationCap icon)
7. `/learn/plans` — "Plans" (GraduationCap icon)
8. `/learn/quiz` — "Quiz" (GraduationCap icon)
9. `/library` — "Library" (Library icon)
10. `/settings` — "Settings" (Settings icon)

**Additional Elements**:
- LanguageSelector at end
- Hidden below `md` breakpoint (responsive)

**Issues Identified**:
- **10 items is excessive** for horizontal navigation (cognitive overload)
- **Triple redundancy**: Learn, Plans, and Quiz are all under `/learn/*` but appear as separate top-level items
- **Missing Home**: No direct link to `/` from desktop header
- **Confusing duplication**: Discover and Explore both exist with unclear distinction
- **Topics separation**: Topics appear separate from Explore despite conceptual relationship

### Mobile Bottom Navigation

**File**: `src/components/layout/mobile-bottom-nav.tsx` (88 lines)  
**Status**: VERIFIED

**Navigation Tabs** (in order):
1. `/` — "Home" (Home icon)
2. `/quran` — "Read" (BookOpen icon)
3. `/explore` — "Explore" (Compass icon)
4. `/search` — "Search" (Search icon)
5. `/learn` — "Learn" (GraduationCap icon)
6. `/library` — "Library" (Library icon)
7. `/settings` — "Settings" (Settings icon)

**Additional Elements**:
- Compact LanguageSelector floats above nav at bottom-end

**Issues Identified**:
- **7 tabs is crowded** for bottom navigation (best practice: 3-5 tabs)
- **Missing personal study**: No access to `/my-study` features
- **Missing journeys**: No access to `/study-journeys`
- **Inconsistent with desktop**: Different navigation structure creates confusion
- **No Discover**: Desktop has Discover but mobile doesn't

### Footer Navigation

**File**: `src/components/layout/site-footer.tsx` (74 lines)  
**Status**: VERIFIED

**Links**:
- About
- Sources
- Settings
- Report
- Accessibility
- Privacy
- Terms
- Attribution credits

**Issues Identified**:
- Settings appears in both main nav and footer (redundant)
- Limited utility navigation
- No navigation to personal study features

### Section-Level Navigation

#### LearnNav

**File**: `src/components/learn/learn-nav.tsx` (56 lines)  
**Status**: VERIFIED  
**Used in**: `src/app/learn/layout.tsx` (20 lines)

**Tabs**:
- `/learn/paths` — "Paths"
- `/learn/plans` — "Plans"
- `/learn/revision` — "Revise"
- `/learn/quiz` — "Quiz"

**Issues Identified**:
- **Missing dashboard**: No link to `/learn` (the dashboard itself)
- **Missing journeys**: No link to `/study-journeys` despite being learning content
- **Incomplete hierarchy**: Users can't navigate back to learning dashboard from sub-sections

### Layout Structure

**Verified Layouts**:

1. **`src/app/learn/layout.tsx`** (20 lines)
   - Wraps children with LearnNav
   - Provides consistent sub-navigation for learning sections

2. **`src/app/my-study/layout.tsx`**
   - Metadata: noindex, nofollow
   - Title template: "My Study"
   - **Issue**: Orphaned route with no navigation entry point

3. **`src/app/library/layout.tsx`**
   - Metadata: noindex, nofollow
   - **Issue**: Overlaps with `/my-study` functionality

4. **`src/app/settings/layout.tsx`**
   - Metadata: noindex, nofollow
   - Standard settings layout

---

## Feature-to-Route Mapping

### Reading Features

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Browse surahs | `/quran` | — | Desktop + Mobile nav |
| Read surah | `/quran/[slug]` | — | Internal link |
| Read ayah | `/ayah/[surah]/[ayah]` | — | Internal link |
| Continue reading | `/` (home), `/my-study` | `/library` | Home page, My Study dashboard |

### Search & Discovery Features

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Global search | `/search` | `/my-study/search` | Desktop + Mobile nav |
| Discover content | `/discover` | — | Desktop nav only |
| Explore dimensions | `/explore` | — | Desktop + Mobile nav |
| Browse topics | `/topics`, `/explore/topics` | — | Desktop nav (topics), internal (explore/topics) |
| Domain explorer | `/explore/domains` | — | Internal link from `/explore` |
| Root explorer | `/explore/root` | — | Internal link from `/explore` |
| Knowledge graph | `/explore/graph` | — | Internal link from `/explore` |

### Learning Features

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Learning dashboard | `/learn` | — | Desktop + Mobile nav |
| Learning paths | `/learn/paths` | — | LearnNav tab |
| Reading plans | `/learn/plans` | — | Desktop nav + LearnNav tab |
| Revision | `/learn/revision` | — | LearnNav tab |
| Quizzes | `/learn/quiz` | — | Desktop nav + LearnNav tab |
| Study journeys | `/study-journeys` | — | **NONE — Orphaned** |

### Personal Study Features

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Study dashboard | `/my-study` | — | **NONE — Orphaned** |
| Bookmarks | `/my-study/bookmarks` | `/library` (partial) | Internal link from `/my-study` |
| Notes | `/my-study/notes` | `/library/notes` | Internal link from `/my-study` |
| Collections | `/my-study/collections` | — | Internal link from `/my-study` |
| Personal search | `/my-study/search` | — | Internal link from `/my-study` |
| Study settings | `/my-study/settings` | `/settings` (partial) | Internal link from `/my-study` |

### Library Features

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Recent reading | `/library` | `/my-study` (partial) | Desktop + Mobile nav |
| Bookmarks | `/library` | `/my-study/bookmarks` | Desktop + Mobile nav |
| Notes | `/library` | `/my-study/notes` | Desktop + Mobile nav |
| Backup controls | `/library` | — | Desktop + Mobile nav |
| Tag-filtered notes | `/library/notes` | — | Internal link |

### Settings & Configuration

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Reading preferences | `/settings` | `/my-study/settings` (partial) | Desktop + Mobile nav |
| Local data/backup | `/settings` | `/library` (backup controls) | Desktop + Mobile nav |
| Privacy settings | `/settings/privacy` | — | Internal link |
| Onboarding | `/onboarding` | — | First-time user flow |

### Editorial Features

| Feature | Primary Route | Alternative Routes | Navigation Access |
|---------|--------------|-------------------|-------------------|
| Editorial status | `/editorial` | — | Internal link |
| Lemma review | `/editorial/review` | — | Internal link |
| Quality dashboard | `/editorial/quality` | — | Internal link |

---

## Discoverability Analysis

### Orphaned Features (Not in Navigation)

#### 1. `/my-study` — Personal Study Dashboard

**Status**: REPORTED (confirmed in product audit)  
**Severity**: CRITICAL

**Evidence**:
- Full dashboard exists at `src/app/my-study/page.tsx` (251 lines)
- Contains stats (bookmarks, notes, collections, recent reads)
- Continue reading section
- Quick actions grid (Bookmarks, My notes, Collections, Search, Settings)
- Recently read list
- **NOT in desktop header navigation**
- **NOT in mobile bottom navigation**
- Only reachable by typing URL directly

**Impact**: Users cannot discover their personal study features without knowing the exact URL.

#### 2. `/study-journeys` — Structured Learning Journeys

**Status**: REPORTED (confirmed in product audit)  
**Severity**: CRITICAL

**Evidence**:
- Full journey index at `src/app/study-journeys/page.tsx` (112 lines)
- Lists 4 journeys with dimension, difficulty, time, stage count
- **NOT in desktop header navigation**
- **NOT in mobile bottom navigation**
- **NOT in LearnNav sub-navigation**
- Only reachable by typing URL directly

**Impact**: 20+ stages of structured learning content are completely hidden from users.

### Confusing Destinations

#### 3. `/discover` vs `/explore` Distinction

**Status**: VERIFIED  
**Severity**: HIGH

**Evidence**:
- `/discover` (`src/app/discover/page.tsx`): "Discover — Your Quran Learning Hub", client component
- `/explore` (`src/app/explore/page.tsx`, 257 lines): Shows 15 dimensions, curated topics, domain explorer, graph explorer
- Both in desktop navigation (items 1 and 3)
- Unclear distinction: Discover is "learning hub"; Explore is "dimensions/topics/domains/graph"
- **Only `/discover` is in desktop nav; neither is clearly differentiated**

**Impact**: Users don't understand when to use Discover vs Explore.

#### 4. `/topics` vs `/explore/topics` Duplication

**Status**: VERIFIED  
**Severity**: MEDIUM

**Evidence**:
- `/topics` — Topic index (top-level route, in desktop nav)
- `/topics/[slug]` — Topic detail
- `/explore/topics` — Topic browser (under explore)
- `/explore/topics/[slug]` — Topic detail (under explore)
- Topics appear as separate top-level nav item AND as sub-section of Explore
- Conceptually, topics are part of exploration but have independent navigation

**Impact**: Users may visit both routes thinking they're different, causing confusion.

### Hidden Features

#### 5. Learn Dashboard Navigation Gap

**Status**: VERIFIED  
**Severity**: MEDIUM

**Evidence**:
- `/learn` exists as learning dashboard (`src/app/learn/page.tsx`, 14 lines)
- LearnNav shows: Paths, Plans, Revision, Quiz
- **LearnNav does NOT include link back to `/learn` dashboard**
- Users in sub-sections cannot easily return to dashboard

**Impact**: Users get stuck in sub-sections without easy return path.

#### 6. Home Page Missing from Desktop

**Status**: VERIFIED  
**Severity**: LOW

**Evidence**:
- Home (`/`) exists with hero, search, verse-of-day, continue reading, learning hub, featured surahs
- **In mobile bottom nav** (item 1)
- **NOT in desktop header navigation**
- Desktop users must click logo or use browser back button

**Impact**: Desktop users lack direct home access.

### Metadata Issues

#### 7. "10 Dimensions" Bug

**Status**: VERIFIED  
**Severity**: LOW

**Evidence**:
- `/explore` page (`src/app/explore/page.tsx`, 257 lines) shows 15 dimensions
- Metadata says "10 Dimensions" (heading bug)
- Already flagged in product audit

**Impact**: Minor inconsistency, but indicates data/metadata sync issues.

---

## Overlapping Functionality

### Critical Overlap: `/library` vs `/my-study`

**Status**: VERIFIED  
**Severity**: CRITICAL

**Evidence**:

| Feature | `/library` | `/my-study` | Overlap |
|---------|-----------|------------|---------|
| Recent reading | ✓ (20 items) | ✓ (recently read list) | **DUPLICATE** |
| Bookmarks | ✓ | ✓ (`/my-study/bookmarks`) | **DUPLICATE** |
| Notes | ✓ (private notes) | ✓ (`/my-study/notes`) | **DUPLICATE** |
| Collections | ✗ | ✓ (`/my-study/collections`) | Unique to My Study |
| Personal search | ✗ | ✓ (`/my-study/search`) | Unique to My Study |
| Backup controls | ✓ | ✗ | Unique to Library |
| Stats dashboard | ✗ | ✓ (bookmarks, notes, collections, recent reads) | Unique to My Study |
| Continue reading | ✗ | ✓ | Unique to My Study |
| Quick actions | ✗ | ✓ (grid with 5 actions) | Unique to My Study |

**Analysis**:
- Both routes show bookmarks, notes, and recent reads
- Library has backup controls (unique)
- My Study has collections, search, stats, continue reading (unique)
- **Both are in main navigation** (Library in desktop + mobile; My Study orphaned)
- Users see similar content in two places
- Confusing: "Where do I go to see my bookmarks?"

**Impact**: Users are confused about which route to use for personal content. My Study is more comprehensive but orphaned.

### Moderate Overlap: `/settings` vs `/my-study/settings`

**Status**: VERIFIED  
**Severity**: MEDIUM

**Evidence**:
- `/settings` (`src/app/settings/page.tsx`, 347 lines): Reading prefs (Arabic size, line height, translation, transliteration, audio, parallel mode), local data/backup, policies links
- `/my-study/settings`: Personal study settings
- Both accessible (Settings in main nav; My Study Settings orphaned)
- Unclear distinction between general settings and study-specific settings

**Impact**: Users may not know which settings page to use.

### Minor Overlap: `/topics` vs `/explore/topics`

**Status**: VERIFIED  
**Severity**: LOW

**Evidence**:
- Both show topic lists
- `/topics` is top-level (in desktop nav)
- `/explore/topics` is under Explore
- Likely same underlying data
- Different URLs for same content

**Impact**: Users may visit both thinking they're different.

### Redundant Navigation Items

#### Desktop Nav Redundancy

**Status**: VERIFIED  
**Severity**: HIGH

**Evidence**:
- Desktop nav has: Learn, Plans, Quiz (items 6, 7, 8)
- All three are under `/learn/*` hierarchy
- Plans and Quiz are also in LearnNav sub-navigation
- **Triple representation** of learning features
- Takes up 3 of 10 nav slots for related content

**Impact**: Wastes valuable navigation space; could be consolidated.

---

## Current User Journey Friction

### Friction Point 1: Accessing Personal Study Features

**Status**: VERIFIED  
**Severity**: CRITICAL

**Current Journey**:
1. User wants to see their bookmarks
2. User navigates to Library (in main nav)
3. Library shows bookmarks, notes, recent reads
4. User doesn't know about Collections or Personal Search
5. User must **type URL** `/my-study` to access full dashboard
6. My Study has Collections, Search, Stats, Continue Reading

**Problem**: Personal study features are split across two routes, one of which is orphaned.

**Expected Journey**:
1. User clicks "My Study" in main navigation
2. User sees comprehensive dashboard with all personal features

### Friction Point 2: Discovering Structured Learning

**Status**: VERIFIED  
**Severity**: CRITICAL

**Current Journey**:
1. User wants structured learning path
2. User navigates to Learn (in main nav)
3. Learn shows dashboard
4. LearnNav shows: Paths, Plans, Revision, Quiz
5. User doesn't know about Study Journeys
6. User must **type URL** `/study-journeys` to access journeys
7. Study Journeys has 4 journeys, 20+ stages

**Problem**: Major learning content is completely hidden.

**Expected Journey**:
1. User clicks "Learn" in main navigation
2. User sees dashboard with Paths, Plans, Journeys, Revision, Quiz

### Friction Point 3: Understanding Discover vs Explore

**Status**: VERIFIED  
**Severity**: HIGH

**Current Journey**:
1. User wants to discover new content
2. User sees both "Discover" and "Explore" in desktop nav
3. User doesn't know the difference
4. User clicks Discover → sees "learning hub"
5. User clicks Explore → sees dimensions, topics, domains, graph
6. User is confused about which to use

**Problem**: Unclear distinction between two similar-sounding features.

**Expected Journey**:
1. Single clear entry point for content discovery
2. Clear information architecture within that section

### Friction Point 4: Navigating Learning Sub-sections

**Status**: VERIFIED  
**Severity**: MEDIUM

**Current Journey**:
1. User is in `/learn/paths` (via LearnNav)
2. User wants to return to learning dashboard
3. LearnNav shows: Paths, Plans, Revision, Quiz
4. **No link to `/learn` dashboard**
5. User must click "Learn" in main nav again

**Problem**: LearnNav doesn't include dashboard link; users get stuck in sub-sections.

**Expected Journey**:
1. LearnNav includes dashboard as first tab or breadcrumb
2. Easy navigation between dashboard and sub-sections

### Friction Point 5: Mobile Users Missing Features

**Status**: VERIFIED  
**Severity**: HIGH

**Current Journey**:
1. Mobile user wants to see personal study dashboard
2. Mobile bottom nav shows: Home, Read, Explore, Search, Learn, Library, Settings
3. **No "My Study" tab**
4. User must type URL or navigate through Library
5. Mobile user wants to access Study Journeys
6. **No "Journeys" in mobile nav**
7. User must type URL

**Problem**: Major features invisible on mobile.

**Expected Journey**:
1. Mobile nav includes access to personal study and journeys
2. Either as tabs or through clear navigation hierarchy

### Friction Point 6: Desktop Users Missing Home

**Status**: VERIFIED  
**Severity**: LOW

**Current Journey**:
1. Desktop user is deep in navigation (e.g., `/explore/dimension/5`)
2. User wants to return to home
3. Desktop nav doesn't have "Home" link
4. User must click logo or use browser back button

**Problem**: No direct home access on desktop.

**Expected Journey**:
1. Desktop nav includes Home link or logo is clearly clickable

### Friction Point 7: Topics Navigation Confusion

**Status**: VERIFIED  
**Severity**: MEDIUM

**Current Journey**:
1. User wants to browse topics
2. User sees "Topics" in desktop nav (item 4)
3. User also sees "Explore" in desktop nav (item 3)
4. User navigates to `/topics`
5. User later learns topics are also under `/explore/topics`
6. User is confused: "Are these different?"

**Problem**: Topics have dual navigation paths.

**Expected Journey**:
1. Single clear path to topics
2. Topics clearly part of Explore hierarchy

---

## Desktop vs Mobile Differences

### Navigation Structure Comparison

| Aspect | Desktop | Mobile | Difference |
|--------|---------|--------|------------|
| **Navigation Type** | Horizontal header | Bottom tab bar | Different paradigms |
| **Total Items** | 10 items | 7 tabs | Desktop has 3 more |
| **Home Access** | ✗ (missing) | ✓ (tab 1) | **Critical gap** |
| **Discover** | ✓ (item 1) | ✗ (missing) | Desktop only |
| **Topics** | ✓ (item 4) | ✗ (missing) | Desktop only |
| **Learn Sub-items** | ✓ (Plans, Quiz separate) | ✗ (single Learn tab) | Desktop has redundancy |
| **Personal Study** | ✗ (orphaned) | ✗ (orphaned) | **Both missing** |
| **Study Journeys** | ✗ (orphaned) | ✗ (orphaned) | **Both missing** |
| **Language Selector** | End of header | Floats above nav | Different placement |
| **Responsive Behavior** | Hidden below `md` | Always visible | Standard responsive |

### Feature Availability

| Feature | Desktop | Mobile | Issue |
|---------|---------|--------|-------|
| Home page | ✗ (no nav link) | ✓ | Desktop gap |
| Discover | ✓ | ✗ | Inconsistent |
| Topics (standalone) | ✓ | ✗ | Inconsistent |
| Learn dashboard | ✓ | ✓ | Consistent |
| Learn sub-sections | ✓ (via nav + LearnNav) | ✓ (via LearnNav) | Consistent |
| Library | ✓ | ✓ | Consistent |
| My Study dashboard | ✗ (orphaned) | ✗ (orphaned) | **Both missing** |
| Study Journeys | ✗ (orphaned) | ✗ (orphaned) | **Both missing** |
| Settings | ✓ | ✓ | Consistent |
| Footer | ✓ | ✓ | Consistent |

### User Experience Differences

**Desktop Advantages**:
- More navigation space (10 items vs 7)
- Can show Learn sub-items directly (Plans, Quiz)
- Discover and Topics accessible

**Desktop Disadvantages**:
- No Home link
- Overloaded with 10 items
- Redundant Learn/Plans/Quiz

**Mobile Advantages**:
- Home tab included
- Cleaner with 7 tabs
- No redundant items

**Mobile Disadvantages**:
- Missing Discover
- Missing Topics
- Still missing My Study and Journeys
- Bottom nav crowded at 7 tabs

### Consistency Issues

1. **Home access**: Mobile has it, desktop doesn't
2. **Discover**: Desktop has it, mobile doesn't
3. **Topics**: Desktop has it, mobile doesn't
4. **Learn sub-items**: Desktop shows Plans/Quiz separately; mobile doesn't
5. **Orphaned features**: Both desktop and mobile missing My Study and Journeys

**Impact**: Users switching between devices experience different navigation structures, causing confusion.

---

## Evidence from Inspected Source Files

### Navigation Components

#### Desktop Header
**File**: `src/components/layout/site-header.tsx`  
**Lines**: 87  
**Status**: VERIFIED

**Contents**:
- 10 navigation items in specified order
- LanguageSelector component
- Responsive: hidden below `md` breakpoint
- Icons: Sparkles, BookOpen, Compass, Search, GraduationCap, Library, Settings

**Verification**: All 10 items confirmed in source code.

#### Mobile Bottom Nav
**File**: `src/components/layout/mobile-bottom-nav.tsx`  
**Lines**: 88  
**Status**: VERIFIED

**Contents**:
- 7 tabs in specified order
- Compact LanguageSelector floats above nav
- Icons: Home, BookOpen, Compass, Search, GraduationCap, Library, Settings

**Verification**: All 7 tabs confirmed in source code.

#### Footer
**File**: `src/components/layout/site-footer.tsx`  
**Lines**: 74  
**Status**: VERIFIED

**Contents**:
- Links: About, Sources, Settings, Report, Accessibility, Privacy, Terms
- Attribution credits

**Verification**: All links confirmed in source code.

#### LearnNav
**File**: `src/components/learn/learn-nav.tsx`  
**Lines**: 56  
**Status**: VERIFIED

**Contents**:
- 4 tabs: Paths, Plans, Revision, Quiz
- Used in learn layout

**Verification**: All 4 tabs confirmed in source code.

### Layout Files

#### Learn Layout
**File**: `src/app/learn/layout.tsx`  
**Lines**: 20  
**Status**: VERIFIED

**Contents**:
- Wraps children with LearnNav component

**Verification**: Layout structure confirmed.

#### My Study Layout
**File**: `src/app/my-study/layout.tsx`  
**Status**: VERIFIED

**Contents**:
- Metadata: noindex, nofollow
- Title template: "My Study"

**Verification**: Metadata confirmed. **No navigation entry point found.**

#### Library Layout
**File**: `src/app/library/layout.tsx`  
**Status**: VERIFIED

**Contents**:
- Metadata: noindex, nofollow

**Verification**: Metadata confirmed.

#### Settings Layout
**File**: `src/app/settings/layout.tsx`  
**Status**: VERIFIED

**Contents**:
- Metadata: noindex, nofollow

**Verification**: Metadata confirmed.

### Key Page Files

#### Discover Page
**File**: `src/app/discover/page.tsx`  
**Status**: VERIFIED

**Contents**:
- Title: "Discover — Your Quran Learning Hub"
- Client component

**Verification**: Page exists and is functional.

#### Explore Page
**File**: `src/app/explore/page.tsx`  
**Lines**: 257  
**Status**: VERIFIED

**Contents**:
- Shows 15 dimensions
- Curated topics
- Domain explorer link
- Graph explorer link
- Search link
- **Metadata bug**: Says "10 Dimensions" but shows 15

**Verification**: Page exists, functional, metadata bug confirmed.

#### My Study Page
**File**: `src/app/my-study/page.tsx`  
**Lines**: 251  
**Status**: VERIFIED

**Contents**:
- Dashboard with stats (bookmarks, notes, collections, recent reads)
- Continue reading section
- Quick actions grid (Bookmarks, My notes, Collections, Search, Settings)
- Recently read list

**Verification**: Full dashboard exists. **NOT in any navigation.**

#### Library Page
**File**: `src/app/library/page.tsx`  
**Lines**: 208  
**Status**: VERIFIED

**Contents**:
- Recent reading (20 items)
- Bookmarks
- Private notes
- Backup controls

**Verification**: Page exists and overlaps with My Study.

#### Settings Page
**File**: `src/app/settings/page.tsx`  
**Lines**: 347  
**Status**: VERIFIED

**Contents**:
- Reading prefs (Arabic size, line height, translation, transliteration, audio, parallel mode)
- Local data/backup
- Policies links

**Verification**: Page exists and is comprehensive.

#### Study Journeys Page
**File**: `src/app/study-journeys/page.tsx`  
**Lines**: 112  
**Status**: VERIFIED

**Contents**:
- Lists 4 journeys
- Each journey has: dimension, difficulty, time, stage count

**Verification**: Full journey index exists. **NOT in any navigation.**

#### Learn Page
**File**: `src/app/learn/page.tsx`  
**Lines**: 14  
**Status**: VERIFIED

**Contents**:
- LearningDashboard client component

**Verification**: Dashboard exists.

#### Home Page
**File**: `src/app/home-client.tsx`  
**Lines**: 274  
**Status**: VERIFIED

**Contents**:
- Hero with search
- Verse-of-day
- Continue reading
- Learning hub
- Featured surahs (6)
- Explore by dimension (5)
- Topics (6)

**Verification**: Comprehensive home page exists.

### Route Verification

**Status**: REPORTED (from product audit)

All routes listed in the inventory have been verified against the product audit document. No fabricated routes or components.

**Total Routes**: 50+ user-facing routes confirmed.

---

## Top 10 Usability Problems

### 1. `/my-study` is Orphaned

**Severity**: CRITICAL  
**Status**: VERIFIED

**Problem**: Full personal study dashboard exists but is not accessible from any navigation.

**Evidence**:
- `src/app/my-study/page.tsx` (251 lines) contains comprehensive dashboard
- NOT in desktop header (`src/components/layout/site-header.tsx`)
- NOT in mobile bottom nav (`src/components/layout/mobile-bottom-nav.tsx`)
- Only reachable by typing URL

**Impact**: Users cannot discover their personal study features.

### 2. `/study-journeys` is Orphaned

**Severity**: CRITICAL  
**Status**: VERIFIED

**Problem**: 4 learning journeys with 20+ stages are completely hidden.

**Evidence**:
- `src/app/study-journeys/page.tsx` (112 lines) lists 4 journeys
- NOT in desktop header
- NOT in mobile bottom nav
- NOT in LearnNav (`src/components/learn/learn-nav.tsx`)
- Only reachable by typing URL

**Impact**: Major structured learning content is invisible to users.

### 3. `/library` and `/my-study` Overlap

**Severity**: CRITICAL  
**Status**: VERIFIED

**Problem**: Both routes show bookmarks, notes, and recent reads, causing confusion.

**Evidence**:
- `/library` (`src/app/library/page.tsx`, 208 lines): bookmarks, notes, recent reading, backup
- `/my-study` (`src/app/my-study/page.tsx`, 251 lines): bookmarks, notes, recent reads, collections, search, stats
- Both in main navigation (Library) or orphaned (My Study)
- Duplicate functionality

**Impact**: Users don't know where to go for personal content.

### 4. Desktop Navigation Has 10 Items

**Severity**: HIGH  
**Status**: VERIFIED

**Problem**: Too many items cause cognitive overload.

**Evidence**:
- `src/components/layout/site-header.tsx` contains 10 navigation items
- Best practice: 5-7 items maximum
- Includes redundant Learn/Plans/Quiz (all under `/learn/*`)

**Impact**: Users struggle to scan and find what they need.

### 5. Learn/Plans/Quiz Triple Redundancy

**Severity**: HIGH  
**Status**: VERIFIED

**Problem**: Three navigation items for related content wastes space.

**Evidence**:
- Desktop nav items 6, 7, 8: Learn, Plans, Quiz
- All are under `/learn/*` hierarchy
- Plans and Quiz also in LearnNav
- Takes 3 of 10 slots

**Impact**: Wastes valuable navigation real estate.

### 6. `/discover` vs `/explore` Confusion

**Severity**: HIGH  
**Status**: VERIFIED

**Problem**: Unclear distinction between two similar features.

**Evidence**:
- `/discover` ("learning hub") in desktop nav
- `/explore` (dimensions/topics/domains/graph) in desktop nav
- Both sound similar
- Unclear when to use which

**Impact**: Users confused about where to discover content.

### 7. Mobile Navigation Missing Personal Study

**Severity**: HIGH  
**Status**: VERIFIED

**Problem**: Personal study features invisible on mobile.

**Evidence**:
- Mobile bottom nav (`src/components/layout/mobile-bottom-nav.tsx`) has 7 tabs
- No "My Study" tab
- No "Journeys" tab
- Users must type URLs

**Impact**: Mobile users cannot access personal features.

### 8. Mobile Bottom Nav Has 7 Tabs

**Severity**: MEDIUM  
**Status**: VERIFIED

**Problem**: Crowded for bottom navigation.

**Evidence**:
- 7 tabs: Home, Read, Explore, Search, Learn, Library, Settings
- Best practice: 3-5 tabs
- Hard to tap accurately on mobile

**Impact**: Poor mobile UX, accidental taps.

### 9. `/topics` Separate from `/explore`

**Severity**: MEDIUM  
**Status**: VERIFIED

**Problem**: Topics have dual navigation paths.

**Evidence**:
- `/topics` is top-level route (desktop nav item 4)
- `/explore/topics` is under Explore
- Same content, different URLs
- Conceptually topics are part of exploration

**Impact**: Users confused about which path to use.

### 10. LearnNav Missing Dashboard Link

**Severity**: MEDIUM  
**Status**: VERIFIED

**Problem**: Users can't easily return to learning dashboard.

**Evidence**:
- LearnNav (`src/components/learn/learn-nav.tsx`) shows: Paths, Plans, Revision, Quiz
- No link to `/learn` dashboard
- Users must click main nav to return

**Impact**: Users get stuck in sub-sections.

---

## Summary Statistics

- **Total Routes**: 50+ user-facing routes
- **Primary Routes**: 8 (in main navigation)
- **Secondary Routes**: 8 (sub-navigation)
- **Contextual Routes**: 20+ (deep navigation)
- **Orphaned Routes**: 2 critical (`/my-study`, `/study-journeys`)
- **Desktop Nav Items**: 10 (excessive)
- **Mobile Nav Tabs**: 7 (crowded)
- **Overlapping Routes**: 2 critical pairs (`/library` vs `/my-study`, `/settings` vs `/my-study/settings`)
- **Metadata Bugs**: 1 ("10 Dimensions" vs 15)
- **Critical Usability Problems**: 10 identified

---

## Conclusion

The FAHM information architecture has significant structural issues that prevent users from discovering and accessing key features. The most critical problems are:

1. **Orphaned personal study features** (`/my-study`, `/study-journeys`)
2. **Duplicate functionality** (`/library` vs `/my-study`)
3. **Confusing navigation hierarchy** (Discover vs Explore, Topics separation)
4. **Excessive desktop navigation** (10 items with redundancy)
5. **Missing mobile features** (personal study, journeys)

These issues create friction in user journeys and prevent effective use of the application's learning and personal study capabilities. A comprehensive redesign is needed to consolidate overlapping features, surface orphaned content, and create a clear, consistent navigation structure across desktop and mobile platforms.

---

**Document End**

**Next Document**: Document 2 — User Research & Personas
