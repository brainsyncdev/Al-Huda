# Sprint 1 Report — Explore Mode & 10-Dimensional Knowledge Foundation

**Date:** 2026-10-23
**Scope:** PRD v2.0 §04.3 (10 dimensions), §05.3 (Explore features), §12.1 (Explore routes), §12.3 (Knowledge Graph Explorer — partial)
**Status:** Implemented, verification commands NOT run per user instruction

**Final cleanup:** Removed the unused `TOPICS` named import from `src/app/explore/dimension/[id]/page.tsx`. The page only resolves topics through `getTopic()`, so no behavior, content, metadata, routes, or styling changed. Grep confirms no remaining `TOPICS` reference in that file.

---

## What was built

### 1. Ten-dimension catalog (`src/lib/explore/dimensions.ts`)

A pure TypeScript module defining all 10 dimensions from PRD §04.3 with:
- Dimension IDs, ordinals, English titles, Arabic labels, coverage descriptions
- Topic-level navigation mappings (which curated topics overlap each dimension)
- Suggested search terms for "explore further" links
- Full provenance record (`pending-scholarly-review`, editorial-navigation-mapping-v1)
- Helper functions: `getDimension()`, `getAllDimensions()`, `getDimensionsWithTopics()`, `getDimensionsWithoutTopics()`

**Critical design decision — scope of mapping:**
The PRD envisions every ayah tagged across 10 dimensions. That requires AI/scholarly tagging that does not exist. This module provides **topic-level navigation only** — each dimension lists existing curated topic slugs whose themes overlap the dimension's description. Nothing in this module asserts that a specific ayah belongs to a dimension. The mapping is editorial, not ayat-level, and carries the same `pending-scholarly-review` status as the topics it references.

**Dimension → topic mappings (all pending scholarly review):**

| # | Dimension | Arabic | Mapped topics |
|---|-----------|--------|---------------|
| 1 | Spiritual | روحاني | patience, gratitude, trust-in-god, mercy-and-forgiveness, remembrance, the-hereafter |
| 2 | Personal | شخصي | patience, hardship-and-ease, trust-in-god, knowledge-and-reflection |
| 3 | Family | أسري | parents-and-family |
| 4 | Social | اجتماعي | justice, giving, parents-and-family |
| 5 | Economic | اقتصادي | giving, justice |
| 6 | Intellectual | عقلي | knowledge-and-reflection |
| 7 | Governance | سياسي | justice |
| 8 | Jihad | جهاد | patience, hardship-and-ease |
| 9 | Interfaith | تعددي | *(none — no curated topic maps clearly; left empty with honest notice)* |
| 10 | Ilm | علم | knowledge-and-reflection, remembrance |

### 2. Explore index page (`src/app/explore/page.tsx`)

- Server component with metadata, JSON-LD (CollectionPage schema)
- Hero with scope notice (gold banner): "The dimensions below are a topic-level navigation aid. Individual ayat have not been tagged to dimensions..."
- Grid of all 10 dimension cards with number, title, Arabic label, coverage, topic count
- "Start with curated topics" strip (first 8 topics as pills)
- Search CTA section
- Notice about dimensions without curated topics (Interfaith)

### 3. Dimension detail pages (`src/app/explore/dimension/[id]/page.tsx`)

- Static generation via `generateStaticParams()` for all 10 dimensions
- Per-dimension metadata with canonical URLs
- JSON-LD breadcrumbs (Home → Explore → Dimension)
- Back-link to /explore
- Dimension header with number badge, title, Arabic label, covers, description
- Scope notice (gold banner) with provenance status
- Resolved curated topics as cards (title, Arabic, summary, verse count)
- Unresolved slug reporting (data-integrity transparency — surfaced, not silently dropped)
- "No curated topics yet" state for dimensions without mappings
- "Explore further" section with search term links and pre-filled search CTA

### 4. Navigation entry points

- **Desktop header** (`src/components/layout/site-header.tsx`): Added "Explore" with Compass icon between Read and Topics
- **Mobile bottom nav** (`src/components/layout/mobile-bottom-nav.tsx`): Added "Explore" tab between Read and Search, with proper `isActive()` routing for `/explore/*` paths

### 5. Sitemap & SEO

- **`src/app/sitemap.ts`**: Added `/explore` to static routes; added all 10 `/explore/dimension/[id]` routes at priority 0.6
- **`src/app/robots.ts`**: `/explore` is NOT in the disallow list — it is indexable (correct for discovery content)

### 6. API endpoints

- **`GET /api/v1/explore/dimensions`** — returns all 10 dimensions with topic mappings, provenance, and scope notes
- **`GET /api/v1/explore/dimensions/{id}`** — returns one dimension with resolved topic metadata; unresolved slugs reported; 404 with available IDs for unknown dimension
- **`src/app/api/v1/route.ts`**: Both endpoints added to the API inventory with descriptions

### 7. Home page strip

- **`src/app/page.tsx`**: Added "Explore by dimension" section showing first 5 dimensions as compact cards with number, title, Arabic label; links to /explore for full list

---

## Files changed

### New files (6)
1. `src/lib/explore/dimensions.ts` — dimension catalog and types
2. `src/app/explore/page.tsx` — Explore index page
3. `src/app/explore/dimension/[id]/page.tsx` — dimension detail pages
4. `src/app/api/v1/explore/dimensions/route.ts` — list dimensions API
5. `src/app/api/v1/explore/dimensions/[id]/route.ts` — single dimension API
6. `SPRINT-1-REPORT.md` — this report

### Modified files (5)
1. `src/components/layout/site-header.tsx` — added Explore nav item
2. `src/components/layout/mobile-bottom-nav.tsx` — added Explore tab + isActive routing
3. `src/app/sitemap.ts` — added /explore and dimension routes
4. `src/app/api/v1/route.ts` — added 2 endpoints to inventory
5. `src/app/page.tsx` — added Explore strip to home page

---

## PRD requirements addressed

| PRD § | Requirement | Status | Notes |
|--------|-------------|--------|-------|
| §04.3 | 10 dimensions with Arabic labels and coverage | ✅ | All 10 defined with verbatim PRD titles |
| §05.3 E-01 | Discovery onboarding | Partial | Dimensions provide entry points; no dedicated onboarding flow |
| §05.3 E-02 | Discovery feed | Partial | Dimension pages surface curated topics as starting points |
| §05.3 E-03 | Misconceptions | ❌ | Not in scope for foundation sprint |
| §05.3 E-04 | "Quran vs What I Heard" | ❌ | Not in scope — requires AI feature (disabled) |
| §05.3 E-05 | Compare & reflect | ❌ | Not in scope for foundation sprint |
| §05.3 E-06 | Save & share | ❌ | Not in scope — library/bookmarks already exist |
| §12.1 | `/explore` route | ✅ | Implemented |
| §12.1 | `/explore/dimension/[name]` routes | ✅ | All 10 statically generated |
| §12.1 | `/explore/theme/[name]` routes | ❌ | Not implemented — themes map to existing /topics |
| §12.1 | `/explore/root/[root]` routes | ❌ | Not implemented — requires morphological data not in dataset |
| §12.3 | Knowledge Graph Explorer (D3/Cytoscape) | ❌ | Not implemented — existing topic-graph.tsx covers topic relations; full graph visualization deferred |

---

## Assumptions

1. **Topic-level mapping is the right scope for Sprint 1.** Ayat-level dimension tagging would require scholarly work that doesn't exist; fabricating it would create religious claims without provenance. The topic-level approach is honest, traceable, and builds the navigation skeleton the PRD envisions.

2. **Interfaith dimension left empty rather than fabricated.** No existing curated topic maps clearly to interfaith themes. Rather than force a mapping, the dimension page honestly states "no curated topics yet" and directs to search. This preserves the integrity of the provenance model.

3. **Search terms are editorial suggestions, not a controlled vocabulary.** They are derived from the dimension's coverage description and link to `/search?q=...`. They are not asserted to be comprehensive or authoritative.

4. **Existing topic slugs are stable.** The dimension → topic mapping references slugs like "patience", "gratitude", etc. If a topic slug changes, the dimension page will report it as unresolved rather than silently dropping it.

5. **No AI-generated religious content.** The AI answer feature remains disabled (`AI_ANSWER_FEATURE_ENABLED = false`). The dimension pages surface curated topics and search — no AI interpretation, no generated guidance.

---

## Remaining gaps

### High priority

1. **Path step topicSlugs don't match actual topic slugs.** `src/lib/paths/data.ts` references "tawhid", "sabr", "shukr", "mercy" but actual slugs are "patience", "gratitude", "mercy-and-forgiveness", etc. This is a pre-existing data integrity issue — paths link to topics that don't exist. Not fixed in Sprint 1 (out of scope) but needs attention.

2. **`/explore/theme/[name]` and `/explore/root/[root]` routes.** PRD §12.1 defines these but they are not implemented. Themes map to existing /topics; roots require morphological data not in the dataset. These could be redirect routes to /topics or /search in a future sprint.

3. **Knowledge Graph Explorer visualization.** PRD §12.3 envisions a D3.js/Cytoscape.js interactive graph with dimension/surah/root filters. The existing `src/components/topics/topic-graph.tsx` covers topic-to-topic relations but not the full cross-dimensional graph. This is a substantial visualization effort deferred to a future sprint.

### Medium priority

4. **Dimension pages could show sample ayat.** Currently they show curated topics. A future enhancement could pull 2-3 sample ayat from each mapped topic to give a taste of the dimension's content without claiming comprehensive ayat-level tagging.

5. **Cross-dimensional navigation.** A topic like "patience" appears in Spiritual, Personal, and Jihad dimensions. The topic page could link back to all dimensions it appears in, creating a bidirectional navigation mesh.

6. **Explore mode onboarding.** PRD §05.3 E-01 envisions a discovery onboarding flow. The current implementation provides entry points but no guided tour or introductory modal.

### Low priority

7. **Dimension coverage could be expanded.** Some dimensions have only 1-2 mapped topics. Future scholarly work could identify additional topics or create new topics specifically for underrepresented dimensions (e.g., Interfaith, Governance, Economic).

8. **Arabic dimension descriptions.** The dimension pages show English descriptions. Arabic translations of the descriptions could be added for bilingual users.

---

## Owner decisions required

1. **Path step topicSlugs mismatch.** The paths data references non-existent topic slugs. Options:
   - (a) Update path step topicSlugs to match actual slugs
   - (b) Add alias topics with the old slugs
   - (c) Remove topicSlug references from path steps
   - **Recommendation:** (a) — update the path data to use actual slugs. This is a data fix, not a feature.

2. **`/explore/theme/[name]` and `/explore/root/[root]` routes.** Options:
   - (a) Implement as redirect routes to /topics and /search
   - (b) Leave unimplemented and document as future work
   - (c) Remove from PRD §12.1 if they are not essential
   - **Recommendation:** (a) — redirect routes are low-effort and preserve URL stability.

3. **Knowledge Graph Explorer.** Options:
   - (a) Build full D3/Cytoscape visualization in next sprint
   - (b) Extend existing topic-graph.tsx to show dimension-topic links
   - (c) Defer indefinitely
   - **Recommendation:** (b) — extends existing work without a full visualization rewrite.

4. **Interfaith dimension.** Currently empty. Options:
   - (a) Leave empty with honest notice (current approach)
   - (b) Create a new curated topic for interfaith themes
   - (c) Remove the dimension from the catalog
   - **Recommendation:** (a) — preserves integrity; (b) is a scholarly decision that needs subject-matter input.

---

## Verification

**Verification commands were NOT run per user instruction.**

To verify this work:
```bash
npm run typecheck   # TypeScript compilation
npm run build       # Next.js build (catches bundling breaks)
npm test            # Unit tests
npm run dev         # Manual testing of /explore, /explore/dimension/[id]
```

Manual test checklist:
- [ ] `/explore` loads and shows all 10 dimensions
- [ ] `/explore/dimension/spiritual` loads and shows mapped topics
- [ ] `/explore/dimension/interfaith` shows "no curated topics yet" notice
- [ ] Desktop header shows "Explore" between Read and Topics
- [ ] Mobile bottom nav shows "Explore" tab
- [ ] `/api/v1/explore/dimensions` returns JSON with all 10 dimensions
- [ ] `/api/v1/explore/dimensions/spiritual` returns dimension with resolved topics
- [ ] `/api/v1/explore/dimensions/unknown` returns 404 with available IDs
- [ ] Sitemap includes `/explore` and all 10 dimension routes
- [ ] Home page shows "Explore by dimension" strip with first 5 dimensions

---

## What was NOT done (and why)

1. **Ayat-level dimension tagging.** Would fabricate religious claims without scholarly review. The topic-level approach is honest and traceable.

2. **AI-generated religious guidance.** AI answer feature remains disabled. Dimension pages surface curated content and search, not AI interpretation.

3. **Accounts, analytics, sync, payments.** Out of scope per Sprint 1 constraints. Local-first architecture preserved.

4. **Licensing changes.** No changes to audio, translations, or tafsir availability. Licensing review is out of scope.

5. **Tests, typechecks, builds.** Not run per user instruction. Verification commands listed above for owner to run.

6. **Rebuilding existing features.** Topics, paths, search, library, settings all preserved as-is. Explore mode adds new navigation without altering existing flows.

---

## Summary

Sprint 1 delivers the Explore mode foundation: a typed 10-dimension catalog, `/explore` index, `/explore/dimension/[id]` pages, navigation entry points, API routes, sitemap integration, and a home page strip. The implementation is honest about scope (topic-level navigation, not ayat-level tagging), preserves provenance and review status, and does not fabricate religious claims. All PRD §04.3 dimensions are defined; PRD §12.1 routes are partially implemented (explore index and dimension pages, but not theme/root routes); PRD §12.3 knowledge graph visualization is deferred. The work is ready for verification and owner review.
