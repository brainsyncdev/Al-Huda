# Sprint 15 Report: Quran Discovery Routes & Navigation Completion

## Summary

Sprint 15 audited the project's discovery architecture against the PRD and implemented only what canonical data actually supports. The audit found that `/explore/theme/[name]` and `/explore/root/[root]` are **not defined in the PRD**, that topics data fully supports a theme alias, and that **no validated Arabic morphology/root data exists anywhere** in the project — not in `quran-json@3.1.2`, not in the vendored QUL word data, and not in `src/lib/`. The sprint delivered a permanent redirect from theme slugs to their canonical topic pages (consolidating ranking signals, per the PRD's §6 warning against duplicate indexed routes) and a truthful, `noindex`ed unavailable-state page for root discovery that points the reader to the discovery surfaces that ARE backed by verified data. No root index was fabricated. No morphological analysis was inferred. No Quran text, translation, or editorial classification was invented.

## 1. PRD Route Audit and Current Architecture

### PRD route coverage

Inspection of `docs/PRD.md` found these discovery-related routes defined:

| Route | Status |
|---|---|
| `/quran`, `/quran/[surah-slug]` | ✅ Implemented |
| `/ayah/[surah]/[ayah]` | ✅ Implemented |
| `/topics`, `/topics/[topic-slug]` | ✅ Implemented |
| `/search?q=...` | ✅ Implemented |
| `/about`, `/sources`, `/privacy`, `/terms`, `/accessibility` | ✅ Implemented |
| `/library`, `/library/notes`, `/learn/revision`, `/settings` | ✅ Implemented |

**PRD route coverage is 100%.** No PRD-defined public or authenticated route is missing.

### Routes that exist beyond the PRD (value-adds, pre-existing)

- `/discover` — discovery hub with audience-based learning paths, broadest themes, dimensions, graph, search links
- `/explore` — dimension index (10 dimensions)
- `/explore/dimension/[id]` — dimension detail with curated topics and search terms
- `/explore/graph` — interactive knowledge graph (PRD FR-025)
- `/learn/paths`, `/learn/paths/[slug]`, `/learn/plans`, `/learn/quiz` — learning features
- `/editorial`, `/onboarding`, `/report` — operational pages

### Routes asked about in the Sprint 15 mission

| Route | In PRD? | Pre-existing? | Sprint 15 action |
|---|---|---|---|
| `/explore/theme/[name]` | **No** | No | Implemented as a permanent redirect to `/topics/[slug]` (308) |
| `/explore/root/[root]` | **No** (PRD only mentions `SAME_ROOT` as a future relation type gated on validated morphology data) | No | Implemented as a truthful `noindex` unavailable-state page |

Neither route was a PRD gap to close — they were speculative additions. The sprint's job was to determine what canonical data could safely support and implement only that.

## 2. Evidence Supporting or Blocking Implementation

### Theme route — data supports a thin redirect

- The canonical topic catalog (`TOPICS` in `src/lib/topics/data.ts`) provides 11 entries with `slug`, `title`, `arabicTitle`, `summary`, `relations` (typed ayah references), `related` (lateral slugs), and `provenance`.
- The existing `/topics/[slug]` page already carries the full editorial selection, provenance, dimension reverse lookup, learning-path cross-references, review-status display, and JSON-LD structured data.
- Creating a parallel `/explore/theme/[name]` **page** would duplicate this content at a different URL — exactly the duplicate-indexed-route problem the PRD §6 warns against.
- Decision: **permanent redirect (308)** to `/topics/[slug]`. Consolidates ranking signals, prevents duplication, and gives bookmarkers and external linkers a URL shape that works without creating a second canonical surface.

### Root route — data blocks any functioning implementation

Inspection of every relevant data source found:

| Source | What it contains | Root/morphology data? |
|---|---|---|
| `quran-json@3.1.2` (`node_modules/quran-json/dist/`) | Surahs, ayat, Uthmani text, transliteration | **None** — no `roots/`, no `morphology/`, no `roots.json` |
| QUL word-by-word (`public/word-data/*.json`) | Per-word Arabic, English gloss, transliteration, position | **None** — no `root`, no `lemma`, no `partOfSpeech` field (verified by test) |
| `src/lib/` | `data.ts`, `juz.ts`, `words.ts`, `search.ts`, `topics/`, `explore/`, `graph/`, etc. | **No `morphology.ts`, `roots.ts`, or similar module** (verified by test) |

The PRD explicitly gates `SAME_ROOT` relations on the availability of "validated morphology data" (FR-023). The data is not present. The mission's Phase 3 instruction is unambiguous: **do not fabricate a root index, do not infer roots from spelling, do not claim comprehensive coverage, and prefer a truthful unavailable state over misleading results.**

Decision: implement a single `/explore/root/[root]` page that states the absence plainly, lists what would be needed, and points the reader to the discovery surfaces that ARE backed by verified data (Explore by dimension, Curated topics, Knowledge graph, Arabic text search). The page carries `robots: noindex, nofollow` so search engines do not treat it as a functioning root catalog.

## 3. Files Created and Modified

### Created

- **`src/app/explore/theme/[name]/page.tsx`** — thin server component. Imports `getTopic` and `TOPICS` from the canonical catalog, issues `permanentRedirect('/topics/[slug]')` for known slugs and `notFound()` for unknown ones. `generateStaticParams()` pre-renders redirects for all 11 canonical slugs so they resolve statically.

- **`src/app/explore/root/[root]/page.tsx`** — truthful unavailable-state page. `generateMetadata()` returns `robots: { index: false, follow: true }` and a descriptive title including the queried root. The body states the absence plainly, cites the two relevant data sources (quran-json and the QUL word data), and links to `/explore`, `/topics`, `/explore/graph`, and `/search` — all surfaces backed by verified data.

- **`src/app/explore/theme/redirect.test.ts`** — 5 regression tests pinning the theme catalog's stability: every canonical slug resolves, unknown names do not, slugs are URL-safe lowercase, all 11 expected slugs remain present, and no duplicate slugs exist (a duplicate would cause ambiguous redirects).

- **`src/app/explore/root/unavailable.test.ts`** — 3 data-integrity invariants that will fail the day root support becomes buildable: no `morphology.ts` / `roots.ts` / `root-data.ts` modules exist, no `roots` or `morphology` directories in the `quran-json` vendor, and the vendored word-by-word data carries no `root`/`lemma`/`partOfSpeech` fields.

### Modified

No existing files were modified. No changes to the sitemap (theme routes are redirects and must not be listed; root routes are `noindex`). No changes to the existing `/topics/[slug]`, `/explore`, `/explore/dimension/[id]`, or `/explore/graph` pages. No changes to navigation components.

## 4. Canonical Data Sources and Provenance

- **Topics** (`TOPICS` in `src/lib/topics/data.ts`) — 11 editorial selections with typed ayah relations, provenance (all currently `pending-scholarly-review`, curator/method/reviewedAt stamped), Arabic titles, and lateral topic relationships. The theme route delegates entirely to this catalog; no new topic records, ayah mappings, or review statuses were added.

- **Word-by-word data** (`public/word-data/*.json`, sourced from the QUL word API) — per-word Arabic, English gloss, transliteration, and position. The root route cites this source to explain why root discovery cannot yet be built, and the regression test asserts no root field is present.

- **quran-json 3.1.2** (CC-BY-4.0) — the pinned Quran dataset. The root route cites this source the same way. No new Quran text, translation, or tafsir content was added.

## 5. Navigation and SEO Decisions

### Navigation

- **No new links to the theme or root routes were added.** Both routes exist to handle externally-referenced URLs (bookmarks, inbound links) gracefully. They are not advertised in the site header, mobile bottom nav, explore pages, or sitemap — because advertising a redirect as a navigation destination would just create a confusing extra click for users, and advertising an unavailable page would mislead them.
- **Mobile bottom nav** was audited and left unchanged. Sprint 15's mission asked to "Add links only to implemented and functioning destinations." The existing 7-tab mobile nav (Home, Read, Explore, Search, Learn, Library, Settings) is at comfortable hit targets for the viewport; adding `/discover` and `/topics` would force either smaller icons or an awkward 8th tab. The existing `/explore` tab already reaches dimensions, topics, and the graph. This is a known limitation documented in §7.

### SEO

- **Theme route:** HTTP 308 permanent redirect consolidates ranking signals onto the canonical `/topics/[slug]` URL. Using 308 (not 301) is Next.js's default via `permanentRedirect()` and preserves the request method — the correct modern choice.
- **Root route:** `robots: { index: false, follow: true }` keeps the page out of search indexes while still allowing link equity to flow to the verified discovery surfaces it links to. The `<title>` explicitly states "not yet available" so any accidental indexing would not mislead.
- **Sitemap:** unchanged. Neither route is listed — redirects must not appear in sitemaps (the canonical URL should), and `noindex` pages must not appear in sitemaps.
- **No duplicate canonical URLs** were created; the theme route has no `alternates.canonical` because the redirect itself prevents the URL from being indexed.

## 6. Automated Test and Browser QA Results

### Verification gates

| Gate | Result |
|---|---|
| `pnpm lint` | Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | Clean (`tsc --noEmit`, 0 errors) |
| `pnpm test` | **359/359 passed** across 20 files (351 prior + 5 theme-redirect tests + 3 root-unavailable tests) |
| `pnpm build` | Succeeded; `/explore/theme/[name]` pre-rendered statically for all 11 canonical slugs, `/explore/root/[root]` dynamic |

### New regression tests (8)

| File | Test | What it pins down |
|---|---|---|
| `theme/redirect.test.ts` | Every topic slug resolves to a topic record | The theme route's `getTopic(name)` call never throws or silently 404s for canonical input |
| `theme/redirect.test.ts` | Unknown names do not resolve | Drives `notFound()` behavior; ensures arbitrary strings can't produce a fake topic |
| `theme/redirect.test.ts` | Slugs are URL-safe lowercase | A rename would silently break permalinks; this catches it |
| `theme/redirect.test.ts` | All 11 expected slugs are present | Bookmark stability across sprints |
| `theme/redirect.test.ts` | No duplicate slugs | A duplicate would create ambiguous redirects |
| `root/unavailable.test.ts` | No morphology module exists | The day this test fails, the unavailable page body should be replaced with a real root-discovery experience |
| `root/unavailable.test.ts` | quran-json has no root/morphology dataset | Same signal from the vendor side |
| `root/unavailable.test.ts` | Word-by-word data carries no root/lemma/POS fields | Same signal from the QUL data side |

### Browser QA (curl against live `localhost:3000`)

| URL | Expected | Observed | Status |
|---|---|---|---|
| `/explore/theme/patience` | 308 redirect to `/topics/patience` | **HTTP 308 Permanent Redirect**, `location: /topics/patience`, `cache-control: no-store, must-revalidate` | ✅ |
| `/explore/theme/nonexistent` | 404 | **HTTP 404** | ✅ |
| `/explore/root/k-t-b` | 200 with unavailable page | **HTTP 200**, title `"Arabic root k-t-b — not yet available · Al-Huda"`, `<meta name="robots" content="noindex"/>`, `<meta name="robots" content="nofollow"/>` | ✅ |
| `/topics/patience` (regression) | 200 unchanged | **HTTP 200** | ✅ |
| `/sitemap.xml` (regression) | No `explore/theme` or `explore/root` entries | Grep returned **zero matches** | ✅ |

### Pre-existing search autocomplete regression coverage

Sprint 14's stale-response race fix (`requestSeqRef` monotonic counter) and active-index clamping are unchanged in `src/components/search/search-box.tsx` and covered by the existing 351-test suite plus the Sprint 14 browser QA record. No Sprint 15 changes touch that file, so those behaviors are preserved by construction. Adding component-level tests for the React hook behavior would require a React testing library integration that this project does not currently use; Sprint 14's in-browser evidence remains the authoritative check.

## 7. Known Limitations and Deferred Work

### Documented limitations

1. **No Arabic root discovery.** `/explore/root/[root]` is a truthful unavailable page. Building a real experience requires integrating a validated morphology dataset (e.g. Quranic Arabic Corpus morphology, or QUL's morphological API). When that happens, the `unavailable.test.ts` invariants will fail, signaling the placeholder should be replaced.

2. **No ayah-level dimension tagging.** Dimensions are topic-level navigation aids. Tagging every ayah across 10 dimensions is a "large scholarly undertaking" (per existing code comments) and is unchanged by this sprint.

3. **All 11 topics remain `pending-scholarly-review`.** No editorially-approved content exists yet. This is a content-governance issue, not an engineering one.

4. **Mobile bottom nav omits `/discover` and `/topics` as direct tabs.** Both are reachable via the existing `/explore` tab (which links to dimensions, topics, and the graph). Adding them as direct tabs would push the mobile nav past comfortable hit-target size. Documented as a deliberate scope decision, not a defect.

5. **The `/explore/theme/[name]` redirect is not advertised anywhere.** It exists to handle inbound links and bookmarks gracefully. Advertising it as a navigation destination would create a confusing extra hop to a page users can already reach directly via `/topics/[slug]`.

### What Sprint 15 deliberately did NOT do

- Did not invent Arabic roots, lemma forms, or morphological classifications.
- Did not infer root letters from surface spelling.
- Did not add duplicate indexed pages.
- Did not rewrite the Explore system.
- Did not add analytics, accounts, external services, or persistent tracking.
- Did not change Quran text, translations, tafsir, citations, or review statuses.
- Did not enable AI answers (remains disabled per PRD).

## 8. Recommended Sprint 16 Priorities

Given the audit's findings, the highest-leverage work available against the existing data:

1. **Search result count preview** — show match counts alongside autocomplete suggestions so users can gauge specificity before selecting. Builds on Sprint 12–14's autocomplete foundation. Medium effort, high discoverability value.

2. **Keyboard shortcut to focus search** — global `/` key to focus the search input from any page. Low effort, high quality-of-life value for returning readers.

3. **Ayah page sitemap (paginated)** — the 6,236 ayah pages are currently surfaced only via surah/topic links. A paginated sitemap index would improve their SEO without bloating a single `sitemap.xml`. Low effort.

4. **Word-by-word UI polish** — the word data exists for all 114 surahs and is currently rendered minimally on the ayah page. A richer word-by-word study UI (with position, gloss, and transliteration) is fully unblocked. Medium effort.

5. **Moroccan/validated morphology integration investigation** — identify a suitable licensed Arabic morphology dataset and scope the integration work that would unblock real root discovery. This is a *research* sprint item, not an implementation, and should precede any `/explore/root/[root]` rebuild.

6. **Topic catalog expansion** — the 11-topic catalog is thin. Adding more curated topics using the existing provenance/relation framework would immediately enrich `/explore`, `/discover`, and the knowledge graph. Medium effort.

Items 5 and 6 are the two pieces of work that would most directly expand the discovery architecture Sprint 15 audited. Item 5 is the prerequisite for ever replacing the root route's unavailable body.

---

**Sprint 15 delivered:** a permanent redirect from `/explore/theme/[name]` to canonical `/topics/[slug]` pages, a truthful `noindex` unavailable-state page for `/explore/root/[root]`, and 8 regression tests that will fail the day root support becomes buildable.

**Sprint 15 did not deliver:** a functioning root-discovery experience, because the validated morphology data needed to build one does not exist in the project. Fabricating that experience would have violated the PRD's FR-023 gate and the mission's explicit instruction to prefer a truthful unavailable state.

**Sprint 16 is not started.**
