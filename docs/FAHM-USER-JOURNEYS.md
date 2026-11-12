# FAHM User Journeys: Navigation & Information Architecture

**Document 4 of 5** | FAHM Information Architecture & Navigation Redesign  
**Status:** Specification Draft  
**Date:** November 2026  
**Reconciliation:** See `docs/FAHM-IA-FINAL-RECONCILIATION.md` for authoritative decisions. Key correction: root explorer route is `/explore/root` (singular, not `/explore/roots`).

---

## Overview

This document maps the 7 critical user journeys through the FAHM application, documenting current navigation paths (verified from source inspection), identifying friction points, and proposing improved navigation flows. Each journey represents a core user intent that must be supported by the redesigned information architecture.

**Legend:**
- ✅ VERIFIED — Current state confirmed from source code inspection
- 🔄 PROPOSED — Recommended improvement for redesign

---

## Journey 1: Read and Understand an Ayah

### Journey Description
User wants to read a specific ayah with full study context: Arabic text, translation, tafsir (exegesis), and word-by-word analysis.

### Starting Point
- Home page (`/`)
- Or direct URL: `/quran` or `/ayah/[surah]/[ayah]`

### User Intent
"I want to read Surah Al-Fatihah, ayah 5, and understand its meaning through translation, tafsir, and detailed word analysis."

### Current Navigation Path ✅ VERIFIED

```
1. Home → Click surah card OR navigate to /quran → Select surah
2. Surah page → Scroll to ayah OR click ayah number
3. Ayah page (/ayah/[surah]/[ayah])
   - Shows Arabic text, translation, transliteration
4. Click "Tafsir" tab → Opens TafsirViewer
   - Arabic tafsirs available: ar.jalalayn, ar.muyassar
5. Click "Word by word" → Opens WordByWord component
6. Available actions: bookmark, add note, copy link
```

**Route Structure:**
```
/ → /quran → /surah/[id] → /ayah/[surah]/[ayah]
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| English tafsir requires link-out | High | Ibn Kathir, Ma'ariful Quran are external links; only Arabic tafsirs in-app |
| Word-by-word not prominent | Medium | Collapsible component, not immediately visible |
| No study vs reading mode distinction | Medium | Same interface for casual reading and deep study |
| Cross-references limited | Low | Only intra-surah references (documented limitation) |
| Tafsir discovery unclear | Medium | User must know to click "Tafsir" tab |

### Proposed Navigation Path 🔄 PROPOSED

```
1. Home → Click surah card OR /quran → Select surah
2. Surah page → Scroll to ayah OR click ayah number
3. Ayah page (/ayah/[surah]/[ayah])
   - Enhanced layout with prominent "Study tools" panel
   - Clear indication of available resources:
     * Tafsir (Arabic + English when available)
     * Word-by-word analysis
     * Root exploration
     * Cross-references
4. One-click access to study tools
5. Optional "Study mode" toggle for enhanced focus
```

**Improved Route Structure:**
```
/ → /quran → /surah/[id] → /ayah/[surah]/[ayah]
                              ↓
                    [Study Tools Panel]
                    ├─ Tafsir (inline or modal)
                    ├─ Word-by-word
                    ├─ Explore root
                    └─ Related ayat
```

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Clicks to access tafsir | 2-3 | 1 | 50-67% reduction |
| Discovery of study tools | Manual exploration | Prominent panel | Clear affordance |
| Context switching | Multiple views | Integrated panel | Reduced cognitive load |

### Contextual Actions at Each Step

**At Ayah Page:**
- Bookmark (immediate save)
- Add note (quick capture)
- Copy link (share)
- Study tools panel (tafsir, word-by-word, root, cross-refs)
- Navigation: previous/next ayah, surah overview

### Dependencies and Limitations

**Must Exist:**
- TafsirViewer component with Arabic tafsir support
- WordByWord component with morphological data
- Ayah data structure with translation, transliteration
- Bookmark/note storage (localStorage)

**Limitations:**
- English tafsir requires external links (content licensing)
- Cross-references limited to intra-surah (data structure constraint)
- Word-by-word requires morphological analysis data

---

## Journey 2: Explore a Quranic Root

### Journey Description
User encounters an unfamiliar Arabic word and wants to understand its root, morphology, and all occurrences throughout the Quran.

### Starting Point
- Ayah page (`/ayah/[surah]/[ayah]`)
- Or root explorer: `/explore/root`

### User Intent
"I see the word 'ṣabr' (صبر) in this ayah. What does its root mean? Where else does it appear? What's the morphological pattern?"

### Current Navigation Path ✅ VERIFIED

```
1. Ayah page → RootContextPanel shows root (if visible)
2. Click root → Navigate to /explore/root/[root]
   - Shows occurrences, lemma, statistics
3. Browse occurrences → Click to navigate to other ayat
4. Can search for other roots at /explore/root
```

**Route Structure:**
```
/ayah/[surah]/[ayah] → /explore/root/[root]
/explore/root → /explore/root/[root]
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| RootContextPanel not prominent | High | Easy to miss on ayah page |
| No clear call-to-action | Medium | "Explore this root further" not obvious |
| Root explorer orphaned | High | Not in main navigation, hard to discover |
| Morphology data complex | Medium | Not beginner-friendly, overwhelming |
| No integration with word-by-word | Medium | Missed opportunity for contextual learning |

### Proposed Navigation Path 🔄 PROPOSED

```
1. Ayah page → Enhanced RootContextPanel
   - Prominent "Explore root" button
   - Brief root summary (meaning, occurrence count)
2. Click "Explore root" → /explore/root/[root]
   - Simplified overview first:
     * Root meaning
     * Occurrence count
     * Key examples
   - Option to "Dive deeper" for advanced morphology
3. Browse occurrences with contextual snippets
4. Navigate to other occurrences
5. Return to ayah or continue exploration
```

**Improved Route Structure:**
```
/explore/root (index, discoverable — already exists)
/explore/root/[root] (overview — already exists)
/explore/root/[root]/morphology (advanced — proposed)
```

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Discovery of root explorer | Orphaned, hidden | In main nav | 100% improvement |
| Clicks to explore root | 2-3 (if found) | 1 | 50-67% reduction |
| Beginner accessibility | Complex data | Progressive disclosure | Clear improvement |
| Integration with word-by-word | None | Direct link | New capability |

### Contextual Actions at Each Step

**At Ayah Page:**
- "Explore root" button (prominent)
- Quick root summary (hover/tooltip)
- Link to word-by-word view

**At Root Explorer:**
- Occurrence list with contextual snippets
- Navigate to specific occurrence
- "Dive deeper" for morphology
- Related roots (semantic connections)
- Bookmark root for later study

### Dependencies and Limitations

**Must Exist:**
- Root data structure with meanings, occurrences
- Morphological analysis data
- RootContextPanel component
- Root explorer page with search

**Limitations:**
- Morphological data complexity requires careful UX design
- Root exploration requires Arabic literacy
- Semantic connections between roots need curation

---

## Journey 3: Discover a Quranic Topic

### Journey Description
User wants to study a subject (e.g., patience, gratitude, prayer) and find related ayat with scholarly context.

### Starting Point
- Home page → "Explore by topic" section
- Or `/topics` page
- Or `/explore/topics` (proposed)

### User Intent
"I want to study what the Quran says about patience (ṣabr). Show me relevant ayat and their context."

### Current Navigation Path ✅ VERIFIED

```
1. Home → "Explore by topic" section → Click topic
   OR /topics → Browse all 18 topics
2. Topic page (/topics/[slug])
   - Shows related ayat with rationale
   - Indicates "pending-scholarly-review" status
3. Click ayah → Navigate to ayah detail page
4. Can bookmark, add note, continue reading
```

**Route Structure:**
```
/ → /topics → /topics/[slug] → /ayah/[surah]/[ayah]
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| /topics separate from /explore | Medium | Conceptually related but structurally separate |
| "Pending-scholarly-review" prominent | Medium | Honest but may discourage use |
| No cross-linking to dimensions/domains | High | Missed opportunity for deeper exploration |
| Topics not in mobile bottom nav | Medium | Hard to access on mobile |
| Topic discovery limited | Medium | No clear path from home to topic exploration |

### Proposed Navigation Path 🔄 PROPOSED

```
1. Home → Enhanced "Explore by topic" section
   - Prominent topic cards with preview
   OR /explore/topics → Browse all topics
2. Topic page (/explore/topics/[slug])
   - Clear indication: "Editorial content, not tafsir"
   - Related ayat with rationale
   - Cross-links to related dimensions and domains
   - Scholarly review status (clear but not discouraging)
3. Click ayah → Navigate to ayah detail page
4. "Explore related topics" suggestions
5. Can bookmark, add note, continue reading
```

**Improved Route Structure:**
```
/explore/topics (index, discoverable)
/explore/topics/[slug] (topic detail)
/explore/topics/[slug] → /explore/dimensions/[id] (cross-link)
/explore/topics/[slug] → /explore/domains/[id] (cross-link)
```

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Discovery of topics | Separate section | Integrated in /explore | Clear improvement |
| Cross-linking to dimensions | None | Direct links | New capability |
| Mobile accessibility | Not in bottom nav | Accessible via /explore | Improved |
| Scholarly review messaging | Prominent warning | Clear but encouraging | Better UX |

### Contextual Actions at Each Step

**At Topic Page:**
- Browse related ayat
- Navigate to specific ayah
- Explore related dimensions/domains
- Bookmark topic
- Share topic link
- "Explore related topics" suggestions

**At Ayah Page (from topic):**
- "Back to topic" link
- "Other ayat on this topic" suggestions
- Bookmark, note, study tools

### Dependencies and Limitations

**Must Exist:**
- Topic data structure with slug, title, description
- Ayah-topic relationships with rationale
- Dimension and domain data structures
- Cross-linking logic

**Limitations:**
- Topics are editorial, not tafsir (must be clearly communicated)
- Scholarly review process ongoing (some topics pending)
- Cross-linking requires curated relationships

---

## Journey 4: Start a Study Journey

### Journey Description
User wants a structured learning experience with progressive stages, objectives, and reflection prompts.

### Starting Point
- `/study-journeys` (current, orphaned)
- Or `/learn/journeys` (proposed)
- Or `/learn` dashboard (proposed)

### User Intent
"I want to start a structured study journey on 'The Concept of Tawhid'. Show me the stages and let me track my progress."

### Current Navigation Path ✅ VERIFIED

```
1. User must know URL: /study-journeys (orphaned)
2. Journey index → Shows 4 journeys
   - Dimension, difficulty, estimated time
3. Click journey → /study-journeys/[slug]
   - Shows stages with objectives
4. Click stage → Shows objective, reflection prompt, completion criteria
5. Progress tracked in localStorage
```

**Route Structure:**
```
/study-journeys (orphaned, not in nav)
/study-journeys/[slug]
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| /study-journeys orphaned | Critical | Not in any navigation menu |
| Cannot discover without knowing URL | Critical | Hidden feature |
| No integration with /learn dashboard | High | Missed opportunity |
| LearnNav doesn't include journeys | High | Inconsistent navigation |
| No clear call-to-action | Medium | "Start journey" not prominent |

### Proposed Navigation Path 🔄 PROPOSED

```
1. /learn → Learning dashboard
   - "Study Journeys" section with clear CTA
   OR /learn/journeys → Journey index
2. Journey index (/learn/journeys)
   - Shows available journeys
   - Dimension, difficulty, time estimate
   - "Start journey" button (prominent)
3. Click journey → /learn/journeys/[slug]
   - Shows stages with progress indicator
   - Current stage highlighted
   - "Continue" or "Start stage" button
4. Click stage → Stage detail
   - Objective, reflection prompt, completion criteria
   - "Mark complete" button
5. Progress visible in My Study dashboard
```

**Improved Route Structure:**
```
/learn (dashboard)
/learn/journeys (index)
/learn/journeys/[slug] (journey detail)
/learn/journeys/[slug]/stage/[id] (stage detail)
```

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Discovery | Orphaned, hidden | In main nav (/learn) | 100% improvement |
| Clicks to start journey | Must know URL | 2-3 from /learn | Clear improvement |
| Progress visibility | localStorage only | Dashboard integration | New capability |
| Integration with Learn section | None | Full integration | New capability |

### Contextual Actions at Each Step

**At /learn Dashboard:**
- "Study Journeys" section
- Active journey progress
- "Start new journey" CTA
- Recent activity

**At Journey Index:**
- Browse available journeys
- Filter by dimension, difficulty
- "Start journey" button
- Progress indicator (if started)

**At Stage Detail:**
- Objective, reflection prompt
- Completion criteria
- "Mark complete" button
- Navigation: previous/next stage

### Dependencies and Limitations

**Must Exist:**
- Study journey data structure (stages, objectives)
- Progress tracking (localStorage or backend)
- Integration with /learn dashboard
- LearnNav component with journeys tab

**Limitations:**
- Only 4 journeys currently available
- Progress stored in localStorage (no sync)
- Reflection prompts are text-based (no interactive assessment)

---

## Journey 5: Use Personal Study Tools

### Journey Description
User wants to bookmark ayat, add notes, organize into collections, and retrieve them later.

### Starting Point
- Ayah page (to bookmark/note)
- Or `/my-study` (current, orphaned)
- Or `/library` (current, overlapping)

### User Intent
"I want to bookmark this ayah, add a note, and organize it into my 'Patience' collection. Later, I want to find all my bookmarks and notes."

### Current Navigation Path ✅ VERIFIED

```
1. Ayah page → Click bookmark icon → Saved to localStorage
2. Click "Add note" → Opens note editor → Save
3. Click "Add to collection" → Select or create collection
4. To retrieve:
   - Must know /my-study URL (orphaned)
   - OR /library URL
5. /library → Shows bookmarks, notes, recent reads
6. /my-study → Shows dashboard with stats, quick actions, recent reads
```

**Route Structure:**
```
/ayah/[surah]/[ayah] → bookmark/note/collection
/my-study (orphaned)
/library (overlapping with /my-study)
/my-study/collections (not in /library)
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| /my-study orphaned | Critical | Not in desktop or mobile nav |
| /library overlaps with /my-study | High | Confusing duplication |
| No clear "My Study" entry point | Critical | Users can't find their saved content |
| Collections not in /library | Medium | Inconsistent organization |
| Backup controls duplicated | Medium | In both /library and /settings |

### Proposed Navigation Path 🔄 PROPOSED

```
1. Ayah page → Clear study tools
   - Bookmark button (prominent)
   - Add note button
   - Add to collection button
2. Save action → Confirmation with quick access to collection
3. To retrieve:
   - Desktop: "My Study" in header
   - Mobile: "My Study" in bottom nav
   - Navigate to /my-study
4. /my-study dashboard
   - Recent bookmarks
   - Recent notes
   - Collections
   - Recent reads
   - Stats (total bookmarks, notes, etc.)
5. Backup controls in /my-study/settings
```

**Improved Route Structure:**
```
/my-study (primary, in nav)
/my-study/bookmarks
/my-study/notes
/my-study/collections
/my-study/settings (backup controls)
```

**Deprecated Routes:**
- `/library` → Redirect to `/my-study`

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Discovery of saved content | Orphaned, hidden | In main nav | 100% improvement |
| Confusion between /my-study and /library | High | Single destination | Eliminated |
| Clicks to access bookmarks | Must know URL | 1-2 from nav | Clear improvement |
| Collection management | Scattered | Centralized | Clear improvement |

### Contextual Actions at Each Step

**At Ayah Page:**
- Bookmark (immediate save)
- Add note (quick capture)
- Add to collection (select or create)
- Copy link (share)

**At /my-study Dashboard:**
- Recent bookmarks (quick access)
- Recent notes
- Collections (browse, create, edit)
- Recent reads
- Stats overview
- Backup/restore controls

### Dependencies and Limitations

**Must Exist:**
- Bookmark/note storage (localStorage)
- Collection data structure
- /my-study dashboard component
- Navigation integration (desktop header, mobile bottom nav)

**Limitations:**
- localStorage only (no cloud sync)
- Collections are simple (no tags, advanced filtering)
- No sharing/collaboration features

---

## Journey 6: Continue Previous Study

### Journey Description
User returns to the app and wants to resume where they left off (last read ayah, active journey, active path).

### Starting Point
- Home page (`/`)
- Or `/learn` dashboard
- Or `/my-study` dashboard

### User Intent
"I was reading Surah Al-Baqarah yesterday. I want to pick up where I left off."

### Current Navigation Path ✅ VERIFIED

```
1. Home page → "Continue reading" section
   - Shows last read ayah
   - "Resume" button → /ayah/[surah]/[ayah]
2. OR /my-study → "Continue reading" section → Resume
3. OR /learn → LearningDashboard
   - Shows "continue" based on paths/quiz/revision
```

**Route Structure:**
```
/ → "Continue reading" → /ayah/[surah]/[ayah]
/my-study → "Continue reading" → /ayah/[surah]/[ayah]
/learn → LearningDashboard → Continue (various)
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| "Continue reading" limited to last ayah | Medium | No "continue journey" or "continue path" |
| /learn dashboard orphaned | High | Not in mobile nav |
| No unified "resume any activity" view | High | Fragmented resume points |
| No "continue journey" on home | Medium | Missed opportunity |
| /my-study orphaned | High | Not in navigation |

### Proposed Navigation Path 🔄 PROPOSED

```
1. Home page → Enhanced "Continue" section
   - Last read ayah
   - Active study journey (if any)
   - Active learning path (if any)
   - "Pick up where you left off" messaging
2. Click "Resume" → Navigate to appropriate destination
   - Ayah → /ayah/[surah]/[ayah]
   - Journey → /learn/journeys/[slug]
   - Path → /learn/paths/[slug]
3. OR /learn dashboard → Primary "resume" destination
   - All active activities
   - Progress indicators
   - Quick resume buttons
4. OR /my-study → Recent activity across all types
```

**Improved Route Structure:**
```
/ → Enhanced "Continue" section
/learn → Primary resume dashboard
/my-study → Recent activity
```

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Resume options | Last ayah only | All active activities | Major improvement |
| Discovery of resume points | Fragmented | Unified on home | Clear improvement |
| /learn dashboard access | Orphaned | In nav | 100% improvement |
| "Continue journey" support | None | Full support | New capability |

### Contextual Actions at Each Step

**At Home Page:**
- "Continue reading" (last ayah)
- "Continue journey" (active journey)
- "Continue path" (active learning path)
- Quick resume buttons

**At /learn Dashboard:**
- All active activities
- Progress indicators
- Quick resume buttons
- Recent activity feed

**At /my-study:**
- Recent bookmarks
- Recent notes
- Recent reads
- Quick access to collections

### Dependencies and Limitations

**Must Exist:**
- Last read tracking (localStorage)
- Active journey tracking
- Active path tracking
- Recent activity feed

**Limitations:**
- localStorage only (no cross-device sync)
- Limited to recent activity (no full history)
- No "resume from specific point" within journey/path

---

## Journey 7: Search Quran and Study Content

### Journey Description
User searches for an ayah, word, root, topic, or other content using lexical, semantic, or translation search.

### Starting Point
- Home page → SearchBox component
- Or search icon in header → `/search`
- Or Cmd/Ctrl+K → Global search shortcut

### User Intent
"I want to find all ayat that mention 'patience' (ṣabr). Show me the Arabic word, translations, and related content."

### Current Navigation Path ✅ VERIFIED

```
1. Home → SearchBox component (prominent)
   OR click Search icon in header → /search page
   OR Cmd/Ctrl+K → Global search shortcut
2. Search page (/search)
   - Lexical search (full corpus)
   - Semantic search (MiniLM model)
   - Translation search
   - Tafsir search
3. Filters: language, edition, mode
4. Results → Click → Navigate to ayah/topic/root/etc.
```

**Route Structure:**
```
/ → SearchBox → /search
/search (full page)
Cmd/Ctrl+K → Global search
```

### Current Friction Points

| Issue | Severity | Evidence |
|-------|----------|----------|
| Search complex (4 modes, many filters) | Medium | Overwhelming for casual users |
| Semantic search requires CDN | Medium | MiniLM model from jsdelivr (network dependency) |
| No search history or suggestions | Medium | Except autocomplete |
| Results don't distinguish content types | Medium | Confusing result list |
| /search not in mobile bottom nav | Low | Only search icon in header |

### Proposed Navigation Path 🔄 PROPOSED

```
1. Global search (Cmd/Ctrl+K) → Primary entry point
   - Available on every page
   - Quick access to search
2. Search icon in desktop header and mobile header
   - Prominent placement
3. /search page → Simplified UI
   - Clear mode selection:
     * All content (default)
     * Ayah text (lexical)
     * Translations
     * Topics
     * Roots
   - Smart filters (auto-suggest)
4. Results → Grouped by content type
   - Ayahs
   - Topics
   - Roots
   - Study journeys
5. Search history (localStorage)
   - Recent searches
   - Saved searches
```

**Improved Route Structure:**
```
/search (simplified, grouped results)
Cmd/Ctrl+K → Global search (modal)
```

### Expected Reduction in Navigation Complexity

| Metric | Current | Proposed | Improvement |
|--------|---------|----------|-------------|
| Search mode selection | Complex (4 modes) | Simplified (grouped) | Clear improvement |
| Result discovery | Flat list | Grouped by type | Better organization |
| Search history | None | localStorage | New capability |
| Mobile accessibility | Search icon only | Prominent placement | Improved |

### Contextual Actions at Each Step

**At Search Box/Modal:**
- Autocomplete suggestions
- Recent searches (if history enabled)
- Quick mode selection
- Filters (language, edition)

**At Search Results:**
- Grouped by content type
- Contextual snippets
- Quick navigation to result
- "Save search" option
- Refine filters

### Dependencies and Limitations

**Must Exist:**
- Search index (lexical, semantic)
- MiniLM model for semantic search (CDN)
- Search UI components
- Result grouping logic

**Limitations:**
- Semantic search requires network (CDN for model)
- Search index must be kept in sync with content
- No advanced search operators (yet)
- localStorage only for history (no sync)

---

## Summary: Journey Complexity Comparison

| Journey | Current State | Key Friction | Proposed Improvement |
|---------|---------------|--------------|---------------------|
| 1. Read Ayah | ✅ Functional | Tafsir link-out, word-by-word not prominent | Integrated study tools panel |
| 2. Explore Root | ✅ Functional but orphaned | Not in nav, complex data | Prominent in /explore, progressive disclosure |
| 3. Discover Topic | ✅ Functional but separate | Separate from /explore, no cross-links | Integrated in /explore, cross-linking |
| 4. Start Study Journey | ✅ Functional but orphaned | Not in any nav | Integrated in /learn, dashboard visibility |
| 5. Use Study Tools | ✅ Functional but orphaned | /my-study not in nav, /library overlap | Consolidated /my-study, in nav |
| 6. Continue Study | ✅ Functional but fragmented | Limited resume options, /learn orphaned | Enhanced "Continue" section, unified resume |
| 7. Search Content | ✅ Functional but complex | 4 modes, no history, flat results | Simplified UI, grouped results, history |

---

## Key Recommendations

### Navigation Structure

**Desktop Header:**
- Home
- Quran
- Learn (dropdown: Paths, Journeys, Dashboard)
- Explore (dropdown: Topics, Dimensions, Domains, Roots)
- My Study
- Search icon

**Mobile Bottom Nav:**
- Home
- Quran
- Learn
- Explore
- My Study

### Critical Improvements

1. **Integrate orphaned features** — /study-journeys, /my-study, /explore/root must be in main navigation
2. **Consolidate overlapping routes** — /library → /my-study (deprecate /library)
3. **Enhance "Continue" experience** — Unified resume across all activity types
4. **Promote study tools** — Clear affordances on ayah page for tafsir, word-by-word, root exploration
5. **Cross-link content** — Topics ↔ Dimensions ↔ Domains ↔ Roots

### Dependencies for Implementation

- Navigation component updates (desktop header, mobile bottom nav)
- Route restructuring (/explore/*, /learn/*, /my-study/*)
- Dashboard enhancements (/learn, /my-study)
- Search UI simplification
- Cross-linking logic between content types
- localStorage integration for progress, history, bookmarks

---

## Next Steps

This user journey mapping informs the detailed information architecture specification (Document 5), which will define:
- Exact route structure and hierarchy
- Navigation component specifications
- Page layouts and content organization
- Interaction patterns and contextual actions
- Implementation priorities and phasing

---

**End of Document 4**