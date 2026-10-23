# Sprint 9 Report — Discover Hub

## Summary

Sprint 9 implemented `/discover`, a central entry point for Quran exploration that surfaces learning paths, topics ranked by breadth, all 10 dimensions, and deeper exploration tools. The implementation is non-personalized, deterministic, and reuses only existing canonical data without introducing new tracking or architectural changes.

## Existing Routes and Data Reused

### Canonical Data Sources

All content on `/discover` derives from existing, pure modules:

1. **`src/lib/explore/dimensions.ts`** — 10 dimensions with `topicSlugs` mappings
   - Used for: "Explore by dimension" section (all 10 dimensions)
   - No changes to this module

2. **`src/lib/topics/data.ts`** — 11 canonical topics
   - Used for: "Broadest themes" section (top 6 by dimension count)
   - No changes to this module

3. **`src/lib/paths/data.ts`** — 5 learning paths with audience targeting
   - `RECOMMENDED_PATHS`: maps each `TargetAudience` to its primary path slug
   - `AUDIENCE_LABELS`: display labels for the four audiences
   - `AUDIENCE_DESCRIPTIONS`: one-line descriptions for each audience
   - Used for: "Start with a path" section (4 audience-based cards)
   - No changes to this module

### Existing Routes Linked

`/discover` links to 21 existing routes:

**Learning paths (4):**
- `/learn/paths/first-steps` (new-muslim audience)
- `/learn/paths/key-themes` (regular-reader audience)
- `/learn/paths/the-merciful` (student audience)
- `/learn/paths/short-surahs` (explorer audience)

**Topics (6):**
- `/topics/patience` (3 dimensions)
- `/topics/justice` (3 dimensions)
- `/topics/knowledge-and-reflection` (3 dimensions)
- `/topics/trust-in-god` (2 dimensions)
- `/topics/remembrance` (2 dimensions)
- `/topics/giving` (2 dimensions)

**Dimensions (10):**
- All 10 dimension detail pages: `/explore/dimension/[id]`

**Deeper exploration (4):**
- `/explore/graph` — Knowledge graph explorer
- `/search` — Quran search
- `/quran` — Surah index
- `/learn` — Learning dashboard

All 21 destination routes return HTTP 200 (verified via curl).

## Discovery Page Behavior and Recommendation Logic

### Page Structure

`/discover` is a server component (`src/app/discover/page.tsx`) with:

1. **Hero section** — Single h1: "Discover your starting point"
2. **"Start with a path" section** — 4 audience-based path cards
3. **"Broadest themes" section** — 6 topics ranked by dimension count
4. **"Explore by dimension" section** — All 10 dimensions
5. **"Go deeper" section** — 4 exploration tools (graph, search, quran, learn)
6. **Review status notice** — Aside disclosing pending-scholarly-review status

### Recommendation Logic

**Audience-based paths (deterministic, transparent):**

The page iterates over `Object.keys(RECOMMENDED_PATHS)` and renders one card per audience. Each card shows the first recommended path for that audience:

```typescript
const audiences = Object.keys(RECOMMENDED_PATHS) as Array<keyof typeof RECOMMENDED_PATHS>;
// For each audience, render the first path in RECOMMENDED_PATHS[audience]
```

This is a direct mapping from the canonical `RECOMMENDED_PATHS` record — no ranking algorithm, no personalization, no AI. The UI labels each card "For [audience label]" so the learner sees exactly why a path is shown.

**Broadest themes (data-derived, transparent):**

Topics are ranked by how many dimensions list them in `topicSlugs`. This is computed by `getTopicsByDimensionCount()` in `src/lib/explore/broadest-themes.ts`:

```typescript
export function getTopicsByDimensionCount(): TopicWithDimensionCount[] {
  return TOPICS.map((topic, index) => ({
    topic,
    index,
    dimensionCount: DIMENSIONS.reduce(
      (count, dim) => count + (dim.topicSlugs.includes(topic.slug) ? 1 : 0),
      0
    ),
  }))
    .sort((a, b) => b.dimensionCount - a.dimensionCount || a.index - b.index)
    .map(({ topic, dimensionCount }) => ({ ...topic, dimensionCount }));
}
```

The ranking is:
- **3 dimensions:** patience, justice, knowledge-and-reflection
- **2 dimensions:** trust-in-god, remembrance, giving, hardship-and-ease, parents-and-family, mercy-and-forgiveness, the-hereafter, gratitude

The page shows the top 6 (all with 2+ dimensions). Each card displays the exact count: "In 3 dimensions →". This is a factual metric derived from the editorial navigation mapping, not a subjective curation or AI recommendation.

**Why this ranking?**

A topic that appears in 3 dimensions is "broader" than one in 1 dimension — it connects more areas of life. This helps learners identify themes with wide relevance. The count is transparent and verifiable; no hidden scoring.

### Content Integrity

- **No fabrication:** All topics, dimensions, and paths are canonical. No new data invented.
- **Review status preserved:** All content remains `pending-scholarly-review`. The aside at the bottom of the page discloses this explicitly.
- **Editorial mapping, not classification:** The dimension count is derived from the navigation mapping, not from ayah-level tagging. The page does not claim topics are classified to dimensions.
- **Interfaith dimension:** Listed with "No topics mapped yet" — honest empty state, no fabrication.
- **AI disabled:** No AI-generated recommendations, no personalization claims.

## Files Created or Modified

### Created Files

1. **`src/app/discover/page.tsx`** (280 lines)
   - Server component rendering the discovery hub
   - Imports canonical data, computes audience cards and broadest themes
   - Responsive grid layouts, accessible markup, review status notice
   - Metadata: title "Discover — Your Quran Learning Hub", canonical URL `/discover`

2. **`src/lib/explore/broadest-themes.ts`** (47 lines)
   - Pure module exporting `getTopicsByDimensionCount()` and `getBroadestThemes(limit)`
   - Deterministic ranking by dimension count, stable tie-breaking by canonical order
   - No React, no fs, no network — safe to import from client or server code

3. **`src/lib/explore/broadest-themes.test.ts`** (15 tests, 130 lines)
   - Verifies ranking contract: count derivation, sort order, tie-breaking, determinism
   - Pins the three-dimensional themes (patience, justice, knowledge-and-reflection) as the top 3
   - Confirms no topic has zero dimensions (guarantees "In N dimensions" label is never 0)
   - Tests edge cases: non-positive limits, fractional limits, Interfaith dimension exclusion

### Modified Files

4. **`src/app/sitemap.ts`**
   - Added `/discover` to the `staticRoutes` array
   - Ensures the new route is included in the XML sitemap for search engines

5. **`src/components/layout/site-header.tsx`**
   - Added Discover as the first item in the desktop navigation (before Read, Explore, Topics)
   - Uses the `Sparkles` icon (same as Topics, but distinct label)
   - Desktop-only (mobile bottom nav unchanged — Discover reachable via homepage link)

6. **`src/app/page.tsx`**
   - Added a link below the hero search box: "Or discover a guided starting point →"
   - Provides a mobile-accessible entry point to `/discover` (mobile bottom nav has 7 tabs and is already crowded)
   - Uses existing `ChevronRight` icon import

## Privacy and Local-First Behavior

### No New Tracking

`/discover` does not read or write any localStorage, sessionStorage, IndexedDB, or cookies. It is a purely server-rendered page that computes recommendations from canonical data at build time.

### Why No Personalization?

The Sprint 9 brief allowed personalization if it reused existing local-first mechanisms. Investigation revealed:

1. **No multi-item reading history exists.** The only "recent" signal is `progress[0]` in `alhuda.library.v1` (single most-recent ayah). There is no topic/dimension/path history.
2. **Extending localStorage would require privacy policy updates.** The existing `/privacy` page discloses "reading history" but does not enumerate topic/dimension/path tracking. Adding a new `alhuda.discover.v1` key would require updating the disclosure.
3. **Personalization without history is decorative.** Claiming "recommended for you" without a real signal would be misleading.

**Decision:** Deliver a useful non-personalized hub first. Document personalization as a future decision requiring:
- A privacy policy update disclosing the new localStorage key
- A decision on what signals to track (topic views? dimension clicks? path completions?)
- A ranking algorithm that uses those signals transparently
- An opt-out mechanism (already standard for localStorage, but should be explicit)

### Existing Privacy Protections Preserved

- No accounts, no analytics, no server-side tracking
- No cross-device synchronization
- No new dependencies
- All data stays in the browser (localStorage for other features) or is canonical (for `/discover`)

## Browser QA Results

### Structure Verification

✅ **Single h1:** "Discover your starting point"
✅ **4 audience path cards:** First Steps, Key Themes, The Merciful, Short Surahs
✅ **6 broadest theme cards:** Patience, Justice, Knowledge and Reflection, Trust in God, Remembrance, Giving in the Way of God
✅ **10 dimension cards:** All 10 dimensions rendered with correct IDs
✅ **4 deeper exploration links:** Graph, Search, Quran, Learn
✅ **Review status notice:** Aside with "pending-scholarly-review" text present
✅ **No dead links:** Zero `href="#"` or missing `href` attributes in main content

### Navigation

✅ **Click navigation works:** Clicked "First Steps" path card → navigated to `/learn/paths/first-steps` (verified with `expectNavigation`)
✅ **All 21 destination links return HTTP 200:** Verified via curl loop
✅ **No 404s or redirects:** Every link resolves to a valid page

### Narrow Screen Layout

✅ **No horizontal overflow:** Viewport 375×812 (iPhone 14 Pro), document scrollWidth 360px = clientWidth 360px
✅ **Cards stack to single column:** Dimension grid `gridTemplateColumns: "328px"` (single column), all 10 cards full-width
✅ **Readable text:** No truncation issues, no layout breaks

### Keyboard Accessibility

✅ **Visible focus indicator:** 2px solid outline in primary color (rgb(16, 86, 65))
✅ **Focusable elements:** All links are standard `<a href>` elements, keyboard-navigable
✅ **Semantic HTML:** Proper heading hierarchy (h1 → h2 → h3), `aria-labelledby` on sections

### Mobile Accessibility

✅ **Discover reachable on mobile:** Homepage hero includes "Or discover a guided starting point" link
✅ **Mobile bottom nav unchanged:** 7 tabs (Home, Read, Explore, Search, Learn, Library, Settings) — adding Discover would crowd the nav

## Verification Results

### Lint

```bash
$ pnpm lint
> eslint .
✓ Clean (no errors, no warnings)
```

### Typecheck

```bash
$ pnpm typecheck
> tsc --noEmit
✓ Clean (no type errors)
```

### Test

```bash
$ pnpm test
> vitest run
✓ 255 tests passed across 16 test files
  - 15 new tests in src/lib/explore/broadest-themes.test.ts
  - All existing tests still pass (no regressions)
```

### Build

```bash
$ pnpm build
> next build
✓ Build succeeded
  - /discover prerendered as static HTML (○ marker)
  - All pages compiled
  - No build errors
```

## Remaining PRD Gaps and Recommended Next Steps

### What Sprint 9 Did NOT Address

1. **Personalized recommendations:**
   - Not implemented (requires localStorage extension and privacy policy update)
   - Documented as a future decision requiring explicit user consent and transparent signal tracking

2. **Root-word discovery:**
   - Not implemented (out of scope per Sprint 9 brief)
   - Would require morphological analysis data, not currently in the codebase

3. **Theme data model (`/explore/theme/[name]`):**
   - Not implemented (out of scope per Sprint 9 brief)
   - Would require a new data model and curation workflow

4. **Editorial workflow:**
   - Not addressed (documented in Sprint 7, not implemented)
   - No reviewer identity, no decision field, no audit trail
   - Requires human decisions, not code

5. **Content expansion:**
   - Did not add new topics, dimensions, or paths
   - The hub surfaces existing content; expansion is an editorial task

### Recommended Next Sprint (Sprint 10)

**Option A: Personalized discovery (if prioritized)**
- Extend localStorage with `alhuda.discover.v1` tracking topic/dimension/path views
- Update `/privacy` to disclose the new storage
- Implement a transparent ranking algorithm using the tracked signals
- Add an opt-out toggle in `/settings`
- Requires: privacy policy review, user testing, transparent documentation

**Option B: Editorial workflow (if prioritized)**
- Reviewer identity, decision field, audit trail
- Transition mechanism from `pending-scholarly-review` to `editorial-approved`
- Editorial dashboard (admin-only, not public)
- Requires human decisions: who are the reviewers, what is the approval criteria

**Option C: Content expansion (if prioritized)**
- Add more topics (currently 11)
- Add more dimension-to-topic mappings
- Add more learning paths
- Requires editorial curation, not code

**Option D: Search improvements (if prioritized)**
- Advanced search filters (by dimension, by topic, by surah)
- Search suggestions, autocomplete
- Search result ranking improvements

**Recommendation:** Sprint 10 should be chosen based on user feedback and PRD priorities. The codebase is stable, all gates pass, and the foundation is solid for any of these directions.

## Conclusion

Sprint 9 successfully implemented `/discover`, a non-personalized, deterministic discovery hub that surfaces existing canonical content in a structured, accessible way. The implementation:

- **Reuses existing data:** No new data models, no fabrication, no AI
- **Preserves content integrity:** All review statuses visible, editorial mapping distinguished from classification
- **Follows privacy-first principles:** No new tracking, no localStorage writes, no analytics
- **Passes all gates:** Lint, typecheck, 255 tests, build
- **Verified in browser:** Navigation, invalid routes, keyboard, narrow screen all work correctly

The change is backward-compatible, adds no new dependencies, and does not begin Sprint 10. It is a focused, honest improvement that provides a central entry point for Quran exploration without overreaching.
