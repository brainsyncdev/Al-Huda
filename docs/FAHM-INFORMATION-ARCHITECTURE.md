# FAHM Information Architecture & Navigation Redesign

**Document Status:** PROPOSED  
**Version:** 1.0  
**Date:** November 11, 2026  
**Author:** FAHM Design Team  
**Reconciliation:** See `docs/FAHM-IA-FINAL-RECONCILIATION.md` for authoritative decisions that supersede this document where they conflict. Key reversals: `/topics` is canonical (not `/explore/topics`); `/explore/root` kept singular (not renamed to `/explore/roots`); `/read` route does not exist (Quran reader is at `/quran`).

---

## Table of Contents

1. [Recommended Information Architecture](#1-recommended-information-architecture)
2. [Functional Hierarchy](#2-functional-hierarchy)
3. [Primary Navigation Destinations](#3-primary-navigation-destinations)
4. [Secondary Navigation](#4-secondary-navigation)
5. [Contextual Navigation](#5-contextual-navigation)
6. [Utility Navigation](#6-utility-navigation)
7. [Feature Ownership](#7-feature-ownership)
8. [My Study vs Library Recommendation](#8-my-study-vs-library-recommendation)
9. [English and Urdu Naming](#9-english-and-urdu-naming)
10. [Rationale](#10-rationale)

---

## 1. Recommended Information Architecture

### Design Philosophy

The proposed information architecture follows a **Quran-first, learner-centered** approach that prioritizes:

- **Clarity over comprehensiveness** — Fewer, well-defined destinations reduce cognitive load
- **Progressive disclosure** — Simple entry points with depth available when needed
- **Task-based organization** — Features grouped by user intent, not technical structure
- **Consistent mental models** — Parallel structures across sections reduce learning curve
- **Mobile-first thinking** — Navigation must work within 5-6 items for mobile tab bars

### Core Principles

1. **The Quran Reader is Central** — All other features support or extend the reading experience
2. **Explore Before Learn** — Discovery (what exists) precedes structured learning (how to study)
3. **Personal Workspace is Separate** — User-generated content (notes, bookmarks) lives in its own space
4. **Search is a Utility** — Global access, not a destination
5. **One Concept, One Place** — Each feature appears exactly once in navigation

### Overall Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    FAHM Information Architecture            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PRIMARY DESTINATIONS (5 items)                            │
│  ├── Home (/)                                              │
│  ├── Read (/quran)                                         │
│  ├── Explore (/explore)                                    │
│  ├── Learn (/learn)                                        │
│  └── My Study (/my-study)                                  │
│                                                             │
│  UTILITIES (Always accessible)                             │
│  ├── Search (global)                                       │
│  ├── Settings (global)                                     │
│  └── Language switcher (global)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Functional Hierarchy

### Feature Relationships

The hierarchy follows a clear progression from **passive consumption** to **active engagement** to **personal organization**:

```
                    ┌──────────────┐
                    │     HOME     │  ← Entry point, landing page
                    └──────┬───────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │    READ    │  │  EXPLORE   │  │   LEARN    │
    │  (Quran)   │  │(Discover)  │  │  (Study)   │
    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
          │               │               │
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
                   ┌────────────┐
                   │ MY STUDY   │  ← Personal workspace
                   │ (Organize) │
                   └────────────┘
```

### Functional Layers

**Layer 1: Core Experience**
- **Read** — The Quran reader, the central experience
- All other features support or extend reading

**Layer 2: Discovery & Learning**
- **Explore** — Understanding what exists (dimensions, topics, domains)
- **Learn** — Structured paths through the content

**Layer 3: Personal Organization**
- **My Study** — User's personal workspace for bookmarks, notes, collections

**Layer 4: Utilities**
- **Search** — Find anything across the app
- **Settings** — App configuration, preferences
- **Language** — Switch between English and Urdu

---

## 3. Primary Navigation Destinations

### Overview

**PROPOSED:** Reduce primary navigation from 10 items (desktop) / 7 tabs (mobile) to **5 core destinations**.

### Destination Details

#### 1. Home (`/`)

**Purpose:** Landing page, entry point to the app  
**Content:**
- Continue reading (last position)
- Daily verse or reminder
- Quick access to recent study
- Featured content or announcements

**User Intent:** "I want to quickly resume where I left off or see what's new"

**English Label:** Home  
**Urdu Label:** ہوم  
**Icon Suggestion:** Home/house icon

---

#### 2. Read (`/quran`)

**Purpose:** The Quran reader — the central experience of the app  
**Content:**
- Full Quran text with translations
- Audio playback
- Reading modes (page, surah, juz)
- In-context tools (bookmark, note, share)

**User Intent:** "I want to read the Quran"

**English Label:** Read  
**Urdu Label:** تلاوت  
**Icon Suggestion:** Book/open book icon

**Note:** This is the most important destination. All other features should feel like extensions of the reading experience.

---

#### 3. Explore (`/explore`)

**Purpose:** Discover and understand the structure of Quranic knowledge  
**Content:**
- 15 Dimensions (thematic lenses)
- 18 Topics (subject areas)
- 14 Domains (knowledge domains)
- Root explorer (word roots)
- Knowledge graph visualization

**User Intent:** "I want to understand what's in the Quran and how it's organized"

**English Label:** Explore  
**Urdu Label:** دریافت  
**Icon Suggestion:** Compass/map/compass-rose icon

**Consolidation:** This merges the current `/discover`, `/topics`, and `/explore` routes into a single coherent section.

---

#### 4. Learn (`/learn`)

**Purpose:** Structured learning paths and study tools  
**Content:**
- Study journeys (guided paths)
- Learning paths (skill-based progression)
- Reading plans (time-based schedules)
- Revision tools (spaced repetition)
- Self-assessment (quizzes)

**User Intent:** "I want to study the Quran in a structured way"

**English Label:** Learn  
**Urdu Label:** تعلیم  
**Icon Suggestion:** Graduation cap/school icon

**Consolidation:** This merges `/study-journeys` and consolidates `/learn/plans`, `/learn/quiz` as secondary routes.

---

#### 5. My Study (`/my-study`)

**Purpose:** Personal workspace for user-generated content  
**Content:**
- Bookmarks (saved verses)
- Notes (personal annotations)
- Collections (organized groups)
- Recent reads (history)
- Search within personal content
- Backup/restore controls

**User Intent:** "I want to access my personal study materials"

**English Label:** My Study  
**Urdu Label:** میرا مطالعہ  
**Icon Suggestion:** Bookmark/notebook icon

**Consolidation:** This merges `/library` into `/my-study`, resolving the overlap.

---

### What's Removed from Primary Navigation

| Route | Action | Rationale |
|-------|--------|-----------|
| `/discover` | Merged into `/explore` | Redundant with explore; discovery is part of exploration |
| `/topics` | Moved to `/explore/topics` | Topics are a subset of exploration, not a top-level concept |
| `/library` | Merged into `/my-study` | Overlaps with my-study; personal workspace should be unified |
| `/study-journeys` | Moved to `/learn/journeys` | Journeys are a learning method, belong under learn |

---

## 4. Secondary Navigation

### Explore Section (`/explore`)

```
/explore
├── /explore/dimensions    ← 15 thematic dimensions
├── /explore/topics        ← 18 subject topics
├── /explore/domains       ← 14 knowledge domains
├── /explore/roots         ← Word root explorer
└── /explore/graph         ← Knowledge graph visualization
```

**Navigation Pattern:** Tab bar or card grid at `/explore` hub, with drill-down to each subsection.

**Hub Page Design:**
- Visual overview of all exploration methods
- Quick stats (e.g., "15 dimensions, 18 topics, 14 domains")
- Recommended starting points for new users
- Recent exploration history

---

### Learn Section (`/learn`)

```
/learn
├── /learn (hub)           ← Continue, revise, studied, do next
├── /learn/journeys        ← Study journeys (from /study-journeys)
├── /learn/paths           ← Learning paths
├── /learn/plans           ← Reading plans
├── /learn/revision        ← Spaced repetition
└── /learn/quiz            ← Self-assessment
```

**Navigation Pattern:** Dashboard at `/learn` with cards for each learning method.

**Dashboard Design:**
- "Continue Learning" — resume current journey/plan
- "Revise" — spaced repetition review
- "Recently Studied" — quick access to recent content
- "Recommended Next" — suggestions based on progress

---

### My Study Section (`/my-study`)

```
/my-study
├── /my-study/bookmarks    ← Saved verses
├── /my-study/notes        ← Personal annotations
├── /my-study/collections  ← Organized groups
├── /my-study/recent       ← Reading history
├── /my-study/search       ← Search personal content
└── /my-study/settings     ← Backup/restore controls
```

**Navigation Pattern:** Tab bar or sidebar with sections for each content type.

**Hub Page Design:**
- Overview stats (bookmarks count, notes count, collections count)
- Recent activity feed
- Quick access to most-used features
- Backup status indicator

---

## 5. Contextual Navigation

### Breadcrumbs

**PROPOSED:** Implement breadcrumb navigation for deep pages to show hierarchy.

**Examples:**

```
Home > Explore > Dimensions > Mercy > Verses on Mercy
Home > Learn > Journeys > Journey Name > Step 3
Home > My Study > Collections > Collection Name > Bookmark 5
```

**Implementation:**
- Show below header on pages 2+ levels deep
- Each segment is clickable
- Last segment (current page) is not clickable
- Truncate long paths with ellipsis if needed

---

### In-Page Navigation

**For Long Pages:**
- Table of contents (auto-generated from headings)
- Sticky section headers
- Jump-to links for quick navigation

**For Lists:**
- Filter/sort controls at top
- Pagination or infinite scroll
- "Back to top" button for long lists

---

### Related Links

**Contextual Suggestions:**
- After reading a verse: "Related verses on this topic"
- After completing a journey step: "Continue to next step" or "Explore related topics"
- In bookmarks: "Other bookmarks in this surah"

**Placement:**
- Bottom of content pages
- Sidebar on desktop (if space allows)
- Collapsible section on mobile

---

## 6. Utility Navigation

### Global Search

**PROPOSED:** Make search a utility, not a destination.

**Access Points:**
- Search icon in header (always visible)
- Keyboard shortcut: `Ctrl+K` (desktop) or `Cmd+K` (Mac)
- Swipe down on mobile (optional)

**Search Scope:**
- Quran text (Arabic, translation, transliteration)
- Dimensions, topics, domains
- Study journeys, paths, plans
- Personal content (bookmarks, notes, collections)

**Search Interface:**
- Modal overlay (not a full page)
- Real-time results as user types
- Filter by category (Quran, Explore, Learn, My Study)
- Recent searches (stored locally)

---

### Settings

**Access Points:**
- Gear icon in header or user menu
- Separate settings page at `/settings`

**Settings Categories:**
- **Reading:** Font size, translation preference, reading mode
- **Audio:** Reciter preference, playback speed
- **Notifications:** Reminder settings, daily verse
- **Data:** Backup/restore, export/import, clear cache
- **Language:** English/Urdu toggle
- **About:** Version, credits, feedback

---

### Language Switcher

**Access Points:**
- Language icon in header
- Settings page

**Behavior:**
- Toggle between English and Urdu
- Persist preference in user settings
- Apply to all navigation labels and UI text

---

### User Menu (If Authenticated)

**Access Points:**
- User avatar/icon in header

**Menu Items:**
- Profile
- Settings
- My Study (quick access)
- Sign out

---

## 7. Feature Ownership

### Feature-to-Navigation Mapping

| Feature | Primary Destination | Secondary Route | Notes |
|---------|-------------------|-----------------|-------|
| Quran reader | Read | — | Core experience |
| Dimensions | Explore | `/explore/dimension/[id]` (inline on hub) | Thematic exploration |
| Topics | Explore | `/explore/topics` | Subject exploration |
| Domains | Explore | `/explore/domains` | Knowledge domains |
| Root explorer | Explore | `/explore/root` | Word roots |
| Knowledge graph | Explore | `/explore/graph` | Visual exploration |
| Study journeys | Learn | `/learn/journeys` | Guided paths |
| Learning paths | Learn | `/learn/paths` | Skill-based |
| Reading plans | Learn | `/learn/plans` | Time-based |
| Revision | Learn | `/learn/revision` | Spaced repetition |
| Quiz | Learn | `/learn/quiz` | Self-assessment |
| Bookmarks | My Study | `/my-study/bookmarks` | Saved verses |
| Notes | My Study | `/my-study/notes` | Annotations |
| Collections | My Study | `/my-study/collections` | Organized groups |
| Recent reads | My Study | `/my-study` (dashboard) | History |
| Backup/restore | My Study | `/my-study/settings` | Data management |
| Search | Utility | Global | Not a destination |
| Settings | Utility | `/settings` | App config |
| Language | Utility | In settings | EN/UR toggle |

---

### Removed/Relocated Features

| Old Route | New Location | Action |
|-----------|--------------|--------|
| `/discover` | `/explore` | Redirect (after migrating unique audience-paths content) |
| `/explore/topics` | `/topics` | Redirect (reverse of original proposal — `/topics` is canonical) |
| `/explore/topics/[slug]` | `/topics/[slug]` | Redirect |
| `/library` | `/my-study` | Redirect (My Study is strictly superior) |
| `/library/notes` | `/my-study/notes` | Redirect |
| `/study-journeys` | `/learn/journeys` | Moved under Learn |
| `/study-journeys/[slug]` | `/learn/journeys/[slug]` | Moved under Learn |

---

## 8. My Study vs Library Recommendation

### The Problem

**Current State:**
- `/library` and `/my-study` both exist as separate routes
- Heavy overlap in functionality (both contain bookmarks, notes, collections)
- Users confused about which to use
- Maintenance burden of two similar features
- Neither is in primary navigation (both orphaned)

### Analysis

**What is `/library`?**
- Appears to be a personal content repository
- Contains bookmarks, notes, collections
- May include backup/restore functionality

**What is `/my-study`?**
- Also a personal content repository
- Contains bookmarks, notes, collections
- May include search and history

**Overlap:**
- Both serve the same user need: "access my personal study materials"
- Both contain the same content types
- Users don't distinguish between them

### Recommendation

**PROPOSED:** Consolidate into a single `/my-study` destination.

**Rationale:**
1. **One concept, one place** — Users should have one obvious place for personal content
2. **Clearer mental model** — "My Study" is more intuitive than "Library"
3. **Reduced maintenance** — One feature to maintain instead of two
4. **Better UX** — No confusion about where to find personal content

**Implementation Plan:**

1. **Keep `/my-study` as the primary route**
   - More personal, user-centered naming
   - Aligns with "My Study" concept in learning apps

2. **Deprecate `/library`**
   - Add redirect: `/library` → `/my-study`
   - Show deprecation notice for 1-2 releases
   - Remove after deprecation period

3. **Consolidate features into `/my-study`**
   - Move any unique `/library` features to `/my-study`
   - Ensure all backup/restore controls are in `/my-study/settings`
   - Merge any unique search capabilities

4. **Update navigation**
   - Add `/my-study` to primary navigation
   - Remove `/library` from any navigation references
   - Update documentation and help text

5. **Communicate changes**
   - Release notes explaining the consolidation
   - In-app notification for returning users
   - Update user guides and tutorials

**Migration Path:**

```
Phase 1: Add /my-study to primary nav, keep /library working
Phase 2: Add redirect from /library to /my-study
Phase 3: Show deprecation notice on /library (if accessed directly)
Phase 4: Remove /library route entirely
```

---

## 9. English and Urdu Naming

### Primary Navigation Labels

| Destination | English | Urdu | Icon |
|-------------|---------|------|------|
| Home | Home | ہوم | Home icon |
| Read | Read | تلاوت | Book icon |
| Explore | Explore | دریافت | Compass icon |
| Learn | Learn | تعلیم | Graduation cap icon |
| My Study | My Study | میرا مطالعہ | Bookmark icon |

### Secondary Navigation Labels

#### Explore Section

| Route | English | Urdu |
|-------|---------|------|
| /explore | Explore | دریافت |
| /explore/dimensions | Dimensions | جہات |
| /explore/topics | Topics | موضوعات |
| /explore/domains | Domains | شعبے |
| /explore/roots | Roots | جڑیں |
| /explore/graph | Knowledge Graph | علم کا نقشہ |

#### Learn Section

| Route | English | Urdu |
|-------|---------|------|
| /learn | Learn | تعلیم |
| /learn (hub) | Dashboard | ڈیش بورڈ |
| /learn/journeys | Study Journeys | مطالعے کے سفر |
| /learn/paths | Learning Paths | سیکھنے کے راستے |
| /learn/plans | Reading Plans | پڑھنے کے منصوبے |
| /learn/revision | Revision | دہرائی |
| /learn/quiz | Quiz | کوئز |

#### My Study Section

| Route | English | Urdu |
|-------|---------|------|
| /my-study | My Study | میرا مطالعہ |
| /my-study/bookmarks | Bookmarks | بک مارکس |
| /my-study/notes | Notes | نوٹس |
| /my-study/collections | Collections | مجموعے |
| /my-study/recent | Recent | حال ہی میں |
| /my-study/search | Search | تلاش |
| /my-study/settings | Settings | ترتیبات |

### Utility Labels

| Utility | English | Urdu |
|---------|---------|------|
| Search | Search | تلاش |
| Settings | Settings | ترتیبات |
| Language | Language | زبان |
| Sign In | Sign In | سائن ان |
| Sign Out | Sign Out | سائن آؤٹ |

### Naming Principles

1. **Clarity over cleverness** — Use common, understandable terms
2. **Consistency** — Parallel structures use parallel naming
3. **Cultural appropriateness** — Urdu translations should feel natural, not literal
4. **Brevity** — Labels should be short enough for mobile tabs (max 12 characters)
5. **Action-oriented** — Use verbs where appropriate (Read, Explore, Learn)

---

## 10. Rationale

### Why This Structure?

#### Problem 1: Too Many Navigation Items

**Current State:**
- Desktop: 10 items in primary nav
- Mobile: 7 tabs (crowded)

**Solution:**
- Reduce to 5 primary destinations
- Move secondary features to subsections
- Make search a utility, not a destination

**Benefit:**
- Cleaner, less overwhelming interface
- Easier to understand at a glance
- Works well on mobile (5 tabs is optimal)
- Follows Hick's Law (fewer choices = faster decision)

---

#### Problem 2: Orphaned Routes

**Current State:**
- `/my-study` not in navigation
- `/study-journeys` not in navigation
- Users can't discover these features

**Solution:**
- Add `/my-study` to primary navigation
- Move `/study-journeys` to `/learn/journeys` (discoverable under Learn)

**Benefit:**
- All features are discoverable through navigation
- No hidden or orphaned functionality
- Users can access all features without knowing URLs

---

#### Problem 3: Overlap Between Library and My Study

**Current State:**
- `/library` and `/my-study` both exist
- Heavy functional overlap
- Users confused about which to use

**Solution:**
- Consolidate into `/my-study`
- Deprecate `/library` with redirect
- Move all personal content features to `/my-study`

**Benefit:**
- One clear place for personal content
- Reduced maintenance burden
- Clearer mental model for users
- No confusion about where to find personal materials

---

#### Problem 4: Confusing Discover vs Explore

**Current State:**
- `/discover` and `/explore` both exist
- Unclear difference between them
- Users don't know which to use

**Solution:**
- Merge `/discover` into `/explore`
- Use "Explore" as the single destination for discovery
- Organize exploration methods (dimensions, topics, domains) as subsections

**Benefit:**
- One clear destination for discovery
- No confusion about where to explore
- Logical grouping of exploration methods
- Simpler mental model

---

#### Problem 5: Topics Separate from Explore

**Current State:**
- `/topics` is a top-level route
- Conceptually related to `/explore`
- Creates navigation clutter

**Solution:**
- Move `/topics` to `/explore/topics`
- Make it a subsection of Explore

**Benefit:**
- Topics are clearly part of exploration
- Reduces primary navigation items
- Logical hierarchy
- Easier to understand relationship

---

#### Problem 6: Triple Redundancy in Learn

**Current State:**
- Learn, Plans, Quiz all in desktop nav
- All related to structured learning
- Creates clutter and confusion

**Solution:**
- Keep "Learn" as primary destination
- Move Plans and Quiz to secondary routes under `/learn`
- Use Learn dashboard to surface all learning methods

**Benefit:**
- One clear destination for learning
- All learning methods accessible from Learn hub
- Reduced navigation clutter
- Clearer hierarchy

---

### Why 5 Destinations?

**Cognitive Load:**
- 5 items is optimal for working memory
- Fits comfortably in mobile tab bar
- Leaves room for utility icons (search, settings)

**Coverage:**
- Home: Entry point, quick access
- Read: Core experience (Quran)
- Explore: Discovery and understanding
- Learn: Structured learning
- My Study: Personal organization

**Balance:**
- Not too few (would force deep nesting)
- Not too many (would overwhelm users)
- Covers all major user intents

---

### Why "Read" Instead of "Quran"?

**Considered:**
- "Quran" — direct, but might feel formal
- "Read" — action-oriented, clear intent

**Chose "Read" because:**
- More action-oriented (verb vs noun)
- Clearer user intent ("I want to read")
- Parallel with other action labels (Explore, Learn)
- Still clearly refers to Quran in context

**Urdu Label:** تلاوت (Tilawat) — specifically means Quranic recitation, so it's clear in Urdu

---

### Why "My Study" Instead of "Library"?

**Considered:**
- "Library" — traditional, but impersonal
- "My Study" — personal, user-centered

**Chose "My Study" because:**
- More personal and user-centered
- Implies active engagement, not passive storage
- Aligns with learning app conventions
- Clearer that it contains personal content (notes, bookmarks)

**Urdu Label:** میرا مطالعہ (Mera Mutala) — literally "my study/reading"

---

### Alternative Structures Considered

#### Alternative 1: 4 Destinations (No Home)

```
Read > Explore > Learn > My Study
```

**Pros:**
- Even simpler
- Home is redundant (can use Read as entry)

**Cons:**
- No dedicated landing page
- Loses opportunity for daily reminders, featured content
- Users expect a Home in apps

**Decision:** Rejected — Home provides valuable entry point and personalization

---

#### Alternative 2: 6 Destinations (Add Search)

```
Home > Read > Explore > Learn > My Study > Search
```

**Pros:**
- Search is always one tap away

**Cons:**
- Search is a utility, not a destination
- Takes up valuable tab space
- Search should be accessible from header instead

**Decision:** Rejected — Search as utility is better UX pattern

---

#### Alternative 3: Keep Library Separate

```
Home > Read > Explore > Learn > Library > My Study
```

**Pros:**
- No migration needed
- Preserves existing user habits

**Cons:**
- Maintains confusing overlap
- 6 destinations is too many
- Doesn't solve the core problem

**Decision:** Rejected — Consolidation is necessary for clarity

---

### Implementation Considerations

**Phase 1: Foundation**
- Implement new navigation structure
- Add redirects for deprecated routes
- Update all internal links

**Phase 2: Migration**
- Show deprecation notices
- Guide users to new locations
- Collect feedback

**Phase 3: Cleanup**
- Remove deprecated routes
- Update documentation
- Final testing

**Risk Mitigation:**
- Keep old routes working with redirects during transition
- Provide clear messaging about changes
- Offer help/guidance for returning users
- Collect and act on user feedback

---

## Conclusion

This proposed information architecture addresses all major usability issues identified in the audit:

✅ Reduces navigation from 10/7 items to 5  
✅ Eliminates orphaned routes  
✅ Resolves My Study vs Library overlap  
✅ Clarifies Discover vs Explore confusion  
✅ Consolidates Topics under Explore  
✅ Removes Learn/Plans/Quiz redundancy  
✅ Provides clear English and Urdu labels  
✅ Works well on both desktop and mobile  

The structure is **Quran-first**, **learner-centered**, and **mobile-optimized**, providing a clear, intuitive navigation experience that helps users focus on what matters: engaging with the Quran.

---

## Appendix: Visual Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FAHM NAVIGATION MAP                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PRIMARY NAVIGATION (5 items)                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  HOME   │  │  READ   │  │ EXPLORE │  │  LEARN  │  │MY STUDY │ │
│  │   ہوم   │  │ تلاوت   │  │ دریافت  │  │ تعلیم   │  │میرا     │ │
│  │         │  │         │  │         │  │         │  │مطالعہ   │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │            │            │            │            │       │
│       │            │            │            │            │       │
│  UTILITIES (Always accessible)                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  🔍 Search (Global)  │  ⚙️ Settings  │  🌐 Language (EN/UR) │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

EXPLORE SUBSECTIONS                    LEARN SUBSECTIONS
┌──────────────────────┐              ┌──────────────────────┐
│ /explore             │              │ /learn               │
│ ├── dimensions       │              │ ├── dashboard        │
│ ├── topics           │              │ ├── journeys         │
│ ├── domains          │              │ ├── paths            │
│ ├── roots            │              │ ├── plans            │
│ └── graph            │              │ ├── revision         │
└──────────────────────┘              │ └── quiz             │
                                      └──────────────────────┘

MY STUDY SUBSECTIONS
┌──────────────────────┐
│ /my-study            │
│ ├── bookmarks        │
│ ├── notes            │
│ ├── collections      │
│ ├── search           │
│ └── settings         │
└──────────────────────┘
```

---

**End of Document**