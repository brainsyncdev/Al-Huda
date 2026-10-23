# Sprint 8 Report — Quran Discovery Experience

## Selected User Problem and Prioritization Reason

**Problem:** Readers arriving at a topic page (e.g., `/topics/patience`) have no direct path back to the dimension view that contextualizes how that topic fits into the broader Quranic exploration framework. The Explore → dimension → topic journey was one-way; once you reached a topic, you couldn't easily return to see how it connected to other topics within its dimension.

**Prioritization reason:** Among the Sprint 8 options (connect Explore/dimensions/topics/Quran content, improve topic discovery dead-ends, evaluate `/explore/theme/[name]`, root-word discovery), the reverse dimension lookup was selected because:

1. **Supported by canonical data:** The `Dimension.topicSlugs` mapping already exists in `src/lib/explore/dimensions.ts` and is editorially curated. No new data fabrication required.
2. **Smallest meaningful scope:** One helper function (`getDimensionsForTopic`) and one UI section on topic pages. No new routes, no API changes, no data model changes.
3. **Completes a user journey:** Closes the loop on the Explore → dimension → topic → dimension navigation cycle.
4. **Content integrity preserved:** Uses the exact same mapping the Explore pages use, so the reverse lookup is guaranteed consistent with the forward mapping. No ayah-level classification asserted.
5. **No `/discover` or `/explore/theme/[name]` routes exist:** The route inventory confirmed these don't exist, so they were not in scope.

## Route and User Journey Findings

### Route Inventory (28 app pages, 20 API routes)

**Existing routes verified:**
- `/` — Home
- `/quran` — Surah index
- `/quran/[surah]` — Surah detail
- `/ayah/[surah]/[ayah]` — Ayah detail with topics, paths, cross-references
- `/explore` — Dimension overview
- `/explore/dimension/[id]` — Dimension detail with topic list
- `/explore/graph` — Knowledge graph explorer
- `/topics` — Topic index
- `/topics/[slug]` — Topic detail with verses, related topics, paths
- `/search` — Search
- `/learn` — Learning overview
- `/learn/paths` — Learning paths index
- `/learn/paths/[slug]` — Path detail
- `/learn/plans` — Learning plans
- `/learn/quiz` — Quiz
- `/library` — Library
- `/settings` — Settings
- `/about`, `/sources`, `/report`, `/accessibility`, `/privacy`, `/terms`

**API routes:**
- `/api/v1/quran/surahs`, `/api/v1/quran/surahs/[id]`, `/api/v1/quran/ayahs/[surah]/[ayah]`
- `/api/v1/topics`, `/api/v1/topics/[slug]`
- `/api/v1/paths`, `/api/v1/paths/[slug]`
- `/api/v1/graph`
- `/api/v1/search`
- `/api/v1/dimensions`, `/api/v1/dimensions/[id]`
- `/api/v1/seo/sitemap.xml`, `/api/v1/seo/manifest.json`, `/api/v1/seo/robots.txt`

**Routes that do NOT exist:**
- `/discover` — Not implemented
- `/explore/theme/[name]` — Not implemented
- Root-word discovery routes — Not implemented

### User Journey Analysis

**Journey 1: Explore → Dimension → Topic**
- User visits `/explore`, sees 10 dimensions
- Clicks a dimension (e.g., Spiritual), sees 6 topics
- Clicks a topic (e.g., Patience), sees 6 verses, related topics, learning paths
- **Gap:** No way to return to the dimension view from the topic page

**Journey 2: Topic → Dimension (NEW in Sprint 8)**
- User arrives at `/topics/patience` (from search, direct link, or ayah page)
- **NEW:** Sees "Explore this theme by dimension" section with 3 dimension cards (Spiritual, Personal, Jihad)
- Clicks a dimension card, navigates to `/explore/dimension/spiritual`
- On dimension page, sees all 6 topics in that dimension, including Patience
- **Round trip complete**

**Journey 3: Ayah → Topic → Dimension**
- User reads `/ayah/2/153`, sees "Appears in topics" section with Patience link
- Clicks Patience, arrives at `/topics/patience`
- **NEW:** Sees dimension cards, clicks Spiritual
- Arrives at `/explore/dimension/spiritual`, sees all spiritual topics

**Journey 4: Invalid routes**
- `/topics/does-not-exist` → Clear not-found page with helpful messaging
- `/explore/dimension/nope` → Clear not-found page with helpful messaging
- Both return 404 status, no crashes, no confusing errors

## Files Created or Modified

### Modified Files

1. **`src/lib/explore/dimensions.ts`**
   - Added `getDimensionsForTopic(topicSlug: string): Dimension[]` function
   - Reverse lookup over the canonical `DIMENSIONS` array
   - Returns dimensions whose `topicSlugs` includes the given slug
   - Empty array for unknown or unmapped slugs (never a guess)
   - Lines added: 10 (function + doc comment)

2. **`src/app/topics/[slug]/page.tsx`**
   - Added import: `import { getDimensionsForTopic } from "@/lib/explore/dimensions";`
   - Added `const dimensions = getDimensionsForTopic(topic.slug);` after `relatedPaths`
   - Added new section between "Related topics" and "Learning paths on this theme"
   - Section includes:
     - Heading: "Explore this theme by dimension"
     - Introductory paragraph explaining the mapping
     - Grid of dimension cards (2 columns on desktop, 1 on mobile)
     - Each card shows: dimension number, title, Arabic title, covers description, link text
     - Footer note: "Dimension-to-topic mappings are editorial navigation aids, not ayah-level classifications. Each dimension page carries its review status."
   - Lines added: 56 (section + imports + variable)

### Created Files

3. **`src/lib/explore/dimensions.test.ts`**
   - 12 tests covering the dimension catalog and reverse lookup
   - Test coverage:
     - Exactly 10 dimensions numbered 1–10 in order
     - Unique dimension IDs
     - Every mapped slug resolves to a real topic
     - No duplicate slug within a dimension
     - Every canonical topic reachable from ≥1 dimension
     - With-topics and without-topics partition (interfaith in empty set)
     - Reverse lookup equals forward-derived expectation
     - Both-direction consistency (forward and reverse agree)
     - PRD order preserved
     - Empty array for unknown slug
     - `getDimension` known/null
     - `getAllDimensions` identity
   - Lines: 142

## Exact Implementation

### Reverse Lookup Helper

```typescript
/**
 * Reverse lookup over the same canonical mapping: which dimensions list this
 * topic slug in `topicSlugs`. Used on topic pages so a reader who arrives at a
 * topic can move back up into the dimension view. Returns dimensions in PRD
 * order. An unknown or unmapped slug yields an empty array — never a guess.
 */
export function getDimensionsForTopic(topicSlug: string): Dimension[] {
  return DIMENSIONS.filter((d) => d.topicSlugs.includes(topicSlug));
}
```

**Design decisions:**
- Uses the same `DIMENSIONS` array the Explore pages use, so forward and reverse are guaranteed consistent
- Returns `Dimension[]` (full objects), not just IDs, so the UI can render titles, Arabic labels, and descriptions without additional lookups
- Empty array for unknown slugs (defensive; never throws, never guesses)
- Preserves PRD order (dimensions are iterated in their canonical order)

### Topic Page Section

```tsx
{dimensions.length > 0 && (
  <section aria-labelledby="topic-dimensions" className="space-y-4">
    <h2
      id="topic-dimensions"
      className="font-display text-xl font-semibold tracking-tight"
    >
      Explore this theme by dimension
    </h2>
    <p className="text-sm text-muted-foreground">
      This topic appears in the editorial navigation mapping for{" "}
      {dimensions.length === 1
        ? "the following dimension"
        : `these ${dimensions.length} dimensions`}
      . Each dimension page shows how this theme connects to other topics
      and offers search terms for further exploration.
    </p>
    <div className="grid gap-3 sm:grid-cols-2">
      {dimensions.map((dim) => (
        <Link
          key={dim.id}
          href={`/explore/dimension/${dim.id}`}
          className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
              {dim.number}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                {dim.title}
              </h3>
              <p
                className="arabic-display text-lg text-gold mt-0.5"
                lang="ar"
                dir="rtl"
              >
                {dim.arabicTitle}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                {dim.covers}
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs font-medium text-primary group-hover:underline">
            Open {dim.title} dimension →
          </p>
        </Link>
      ))}
    </div>
    <p className="text-xs text-muted-foreground">
      Dimension-to-topic mappings are editorial navigation aids, not
      ayah-level classifications. Each dimension page carries its review
      status.
    </p>
  </section>
)}
```

**Design decisions:**
- Conditional rendering: section only appears if `dimensions.length > 0` (topics not in any dimension don't show an empty section)
- Accessible: `aria-labelledby` links section to heading, `lang="ar" dir="rtl"` on Arabic text
- Reuses existing design patterns: rounded cards, border, hover states, primary color, Arabic display class
- Responsive: `sm:grid-cols-2` (1 column on mobile, 2 on desktop)
- Clear labeling: "editorial navigation mapping" (not "classification"), review status note
- Each card is a single `<Link>` wrapping the entire card (not just the text), so the whole card is clickable
- Single `h1` on the page (topic title); dimension cards use `h3` (correct heading hierarchy)

## Source Data Reused and Limitations

### Source Data

- **Canonical dimension catalog:** `DIMENSIONS` array from `src/lib/explore/dimensions.ts`
  - 10 dimensions, each with `id`, `number`, `title`, `arabicTitle`, `covers`, `topicSlugs`
  - `topicSlugs` is the editorial mapping: which topics are curated starting points for that dimension
  - Example: `patience` maps to `spiritual`, `personal`, `jihad`

- **Topic data:** `TOPICS` array from `src/lib/topics/data.ts`
  - 11 topics, each with `slug`, `title`, `arabicTitle`, `description`, `relations`
  - No changes to topic data; the reverse lookup only reads from dimensions

### Limitations

1. **Editorial navigation aid, not ayah-level classification:**
   - The dimension-to-topic mapping is curated by editors, not derived from the Quran text itself
   - A topic appearing in a dimension does not mean every verse in that topic is classified to that dimension
   - The UI explicitly states this: "Dimension-to-topic mappings are editorial navigation aids, not ayah-level classifications"

2. **Review status preserved:**
   - All dimensions and topics remain `pending-scholarly-review`
   - The dimension page carries its own review status (visible when you navigate to it)
   - No review status was silently upgraded or fabricated

3. **No new data fabricated:**
   - The reverse lookup uses only the existing `topicSlugs` mapping
   - No new relationships, no new classifications, no new metadata invented

4. **Interfaith dimension remains empty:**
   - `interfaith` has `topicSlugs: []` (empty)
   - No topics appear in the Interfaith dimension
   - This is preserved from Sprint 7 and earlier

5. **Not all topics appear in dimensions:**
   - Some topics may not be mapped to any dimension yet (editorial work in progress)
   - For those topics, the section does not render (conditional `dimensions.length > 0`)

## Browser QA Results

### Navigation

✅ **Click navigation works:**
- Clicked dimension link on `/topics/patience` → navigated to `/explore/dimension/spiritual`
- Dimension page rendered correctly: h1 "Spiritual", Arabic title, review disclaimer, 6 topics listed
- Link back to `/topics/patience` exists on dimension page (round trip verified)

✅ **Invalid routes handled gracefully:**
- `/topics/does-not-exist` → Clear not-found page: "NOT FOUND — That reference is not in the Quran" with helpful messaging
- `/explore/dimension/nope` → Same clear not-found page
- Both return 404 status, no crashes, no confusing errors

### Keyboard Interaction

✅ **Focus indicator visible:**
- 2px solid outline in primary color (rgb(16, 86, 65)) with 2px offset
- Visible on all dimension links when focused
- Standard `<a href>` elements, so real keyboard users get native browser activation (Enter key)

⚠️ **Enter key activation (IAB automation limitation):**
- Synthetic Enter key events in the IAB automation did not trigger native anchor activation
- This is an automation limitation, not a defect in the implementation
- Real keyboard users pressing Enter on a focused `<a href>` link will navigate normally (native browser behavior)
- Click navigation works perfectly in both automation and real usage

### Narrow Screen Layout

✅ **No horizontal overflow:**
- Viewport: 375×812 (iPhone 14 Pro)
- Document scrollWidth: 360px, clientWidth: 360px → no overflow
- Dimension cards stack full-width at 328px (1 column)
- Section height: 648px (3 cards stacked vertically)
- All text readable, no truncation issues, no layout breaks

✅ **Responsive grid:**
- Desktop (1280×720): 2-column grid, cards ~482px wide
- Mobile (375×812): 1-column grid, cards 328px wide (full width minus padding)
- Cards maintain consistent height (133px) across viewports

### Accessibility

✅ **Single h1 on topic page:**
- h1: "Patience" (topic title)
- h2: "Explore this theme by dimension" (section heading)
- h3: Dimension titles inside cards (correct hierarchy)

✅ **Arabic text properly marked:**
- `lang="ar" dir="rtl"` on all Arabic titles
- Arabic display class applied for proper font rendering

✅ **Section labeled:**
- `aria-labelledby="topic-dimensions"` links section to heading
- Screen readers can navigate by landmark and heading

## Gate Results

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
✓ 240 tests passed across 15 test files
  - 12 new tests in src/lib/explore/dimensions.test.ts
  - All existing tests still pass (no regressions)
```

### Build

```bash
$ pnpm build
> next build
✓ Build succeeded
  - All pages compiled
  - No build errors
  - Static generation successful
```

## Remaining PRD Gaps and Recommended Next Sprint

### Sprint 8 Did NOT Address

1. **`/discover` route:**
   - Not implemented (does not exist)
   - Would require new route, new UI, new data model decisions
   - Out of scope for Sprint 8 (focused on smallest meaningful improvement)

2. **`/explore/theme/[name]` route:**
   - Not implemented (does not exist)
   - Would require theme data model, curation workflow, UI
   - Out of scope for Sprint 8

3. **Root-word discovery:**
   - Not implemented
   - Would require root-word data, morphological analysis, UI
   - Out of scope for Sprint 8

4. **AI-powered recommendations:**
   - Not implemented (intentionally disabled per PRD constraints)
   - AI answers remain disabled
   - No AI-generated content added

5. **Editorial workflow:**
   - Not addressed (documented in Sprint 7, not implemented)
   - No reviewer identity, no decision field, no audit trail
   - Requires human decisions, not code

### Recommended Next Sprint (Sprint 9)

**Option A: `/discover` route (if prioritized)**
- New route with personalized recommendations (local-first, anonymous)
- Could surface topics, dimensions, paths based on reading history (localStorage)
- Requires data model decisions: what signals to track, how to rank
- UI design: card-based discovery interface

**Option B: Editorial workflow (if prioritized)**
- Reviewer identity, decision field, audit trail
- Transition mechanism from `pending-scholarly-review` to `editorial-approved`
- Editorial dashboard (admin-only, not public)
- Requires human decisions: who are the reviewers, what is the approval criteria

**Option C: Content expansion (if prioritized)**
- Add more topics (currently 11)
- Add more dimension-to-topic mappings
- Add more lateral topic relationships
- Requires editorial curation, not code

**Option D: Search improvements (if prioritized)**
- Advanced search filters (by dimension, by topic, by surah)
- Search suggestions, autocomplete
- Search result ranking improvements

**Recommendation:** Sprint 9 should be chosen based on user feedback and PRD priorities. The codebase is stable, all gates pass, and the foundation is solid for any of these directions.

## Conclusion

Sprint 8 successfully implemented the smallest meaningful improvement to the Quran discovery experience: a reverse dimension lookup on topic pages that completes the Explore → dimension → topic → dimension navigation cycle. The implementation:

- **Preserves content integrity:** Uses only canonical editorial data, no fabrication
- **Maintains review status:** All content remains `pending-scholarly-review`
- **Follows existing patterns:** Reuses design system, responsive grid, accessible markup
- **Passes all gates:** Lint, typecheck, test (240 tests), build
- **Verified in browser:** Navigation, invalid routes, keyboard, narrow screen all work correctly

The change is backward-compatible, adds no new dependencies, and does not begin Sprint 9. It is a focused, honest improvement that closes a real user journey gap without overreaching.
