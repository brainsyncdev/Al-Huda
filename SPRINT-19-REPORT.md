# Sprint 19 Report: Quran SEO Coverage & Ayah Sitemap Audit

## Summary

Sprint 19 audited Al-Huda's technical SEO coverage and implemented four justified improvements: (1) adding all 6,236 ayah URLs to the sitemap, (2) pre-rendering all ayah pages at build time, (3) fixing relative canonical URLs on two index pages, and (4) adding a regression test suite for the sitemap. The audit confirmed that the existing robots.txt, invalid-reference handling, and JSON-LD structured data were already correct; the changes made are targeted fixes, not a redesign.

## 1. Initial Audit Findings

### Routes that exist

| Route | Type | Sitemap? | Notes |
|---|---|---|---|
| `/` | Static | ✅ | Home page |
| `/quran` | Static | ✅ | Surah index (114 surahs) |
| `/quran/[slug]` | SSG (114) | ✅ | Individual surah pages |
| `/ayah/[surah]/[ayah]` | SSG (6,236) | ✅ (after fix) | Individual ayah pages |
| `/topics` | Static | ✅ | Topic index (11 topics) |
| `/topics/[slug]` | SSG (11) | ✅ | Individual topic pages |
| `/explore` | Static | ✅ | Dimension index |
| `/explore/dimension/[id]` | SSG (10) | ✅ | Individual dimension pages |
| `/explore/graph` | Static | ✅ | Knowledge graph |
| `/discover` | Static | ✅ | Discovery hub |
| `/search` | Dynamic | ❌ (deliberate) | Noindexed per PRD §15 |
| `/explore/theme/[name]` | Redirect (308) | ❌ (deliberate) | Redirects to `/topics/[slug]` |
| `/explore/root/[root]` | noindex | ❌ (deliberate) | Truthful unavailable state |
| `/library`, `/settings`, `/learn`, `/editorial`, `/report` | Various | ❌ (deliberate) | Disallowed in robots.txt |

### What was correct before Sprint 19

- **robots.txt**: Correctly allows `/`, disallows `/library`, `/settings`, `/learn`, `/editorial`, `/report`. Points to `/sitemap.xml`.
- **Invalid reference handling**: All invalid surah/ayah/topic/dimension references return genuine HTTP 404 responses.
- **`/search` exclusion**: Correctly absent from sitemap and noindexed.
- **Theme redirect and root-unavailable routes**: Correctly excluded from sitemap.
- **JSON-LD structured data**: Comprehensive and accurate across all page types.
- **Canonical URLs on most pages**: Absolute and consistent via `absoluteUrl()` helper.

### Defects found

1. **Ayah pages not in sitemap** (6,236 URLs missing). The sitemap comment said "Ayah pages are not indexed exhaustively" but provided no alternative.
2. **Ayah pages not pre-rendered**. Without `generateStaticParams`, all 6,236 ayah routes were dynamic.
3. **Relative canonical URLs on two pages**: `/quran` and `/topics` used relative paths instead of absolute URLs.
4. **No sitemap tests existed**.

## 2. Implementation Decisions

### Decision 1: Single flat sitemap with all 6,382 URLs

The total count (11 + 114 + 11 + 10 + 6236 = 6382) is well under the sitemap.org limit of 50,000 URLs per file. Partitioning was attempted first but caused a prerender error with Next.js's route-handler static params. The simpler flat approach works correctly, is easier to maintain, and is what crawlers expect for a site of this size.

### Decision 2: Pre-render all 6,236 ayah pages via `generateStaticParams`

The params are derived exclusively from the canonical dataset (`surah.ayahCount`), so no invalid references can be generated.

### Decision 3: Fix relative canonical URLs on `/quran` and `/topics`

Wrapped both in `absoluteUrl()` to match the project-wide convention.

## 3. Files Created and Modified

### Modified

- **`src/app/sitemap.ts`** — Added ayah URL generation loop that iterates all 114 surahs × `ayahCount` ayat, producing 6,236 additional entries with priority 0.4 and monthly changefreq.
- **`src/app/ayah/[surah]/[ayah]/page.tsx`** — Added `generateStaticParams()` that pre-renders all 6,236 ayah routes at build time.
- **`src/app/quran/page.tsx`** — Wrapped canonical URL in `absoluteUrl()`.
- **`src/app/topics/page.tsx`** — Wrapped canonical URL in `absoluteUrl()`.
- **`src/hooks/use-search-shortcut.ts`** — Changed `isEditableTarget()` from `instanceof HTMLElement` to duck-typing so it's testable in the project's Node test environment.

### Created

- **`src/app/sitemap.test.ts`** — 12 unit tests covering sitemap generation, deduplication, absolute URL enforcement, exclusion rules, ayah URL validity, and priority values.

## 4. Canonical Data Sources and Provenance

All sitemap URLs are derived exclusively from:
- `getSurahIndex()` — 114 surahs with canonical `ayahCount`
- `TOPICS` — 11 curated topics
- `getAllDimensions()` — 10 editorial dimensions
- Static route list (11 public pages)

No URLs were invented or estimated. Quran text, translations, tafsir, and scholarly-review status were not modified.

## 5. Navigation and SEO Decisions

- **Sitemap priority scheme**: Home (1.0) > Static pages (0.7) > Surahs & dimensions (0.6) > Topics (0.5) > Ayahs (0.4). This reflects that ayah pages are typically reached via surah or topic pages.
- **No `hreflang` tags** — would require a language strategy beyond this sprint's scope.
- **No OG images** — separate feature requiring image generation infrastructure.
- **`robots.txt` unchanged** — already correct.
- **JSON-LD unchanged** — already comprehensive.

## 6. Test and Browser QA Results

### Verification gates

| Gate | Result |
|---|---|
| `pnpm lint` | Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | Clean (`tsc --noEmit`, 0 errors) |
| `pnpm test` | **387/387 passed** across 22 files (375 prior + 12 new sitemap tests) |
| `pnpm build` | Succeeded; all 6,236 ayah pages pre-rendered as SSG |

### Live sitemap verification (curl against localhost:3000)

| Check | Result | Status |
|---|---|---|
| `/sitemap.xml` is valid XML | `<urlset>` with proper namespace | ✅ |
| Total URL count | **6,382** | ✅ |
| No `/search` in sitemap | 0 matches | ✅ |
| No `/report` in sitemap | 0 matches | ✅ |
| No `/explore/theme/` in sitemap | 0 matches | ✅ |
| No `/explore/root/` in sitemap | 0 matches | ✅ |
| No `/library` in sitemap | 0 matches | ✅ |
| First ayah URL | `/ayah/1/1` | ✅ |
| Last ayah URL | `/ayah/114/6` | ✅ |
| `robots.txt` points to `/sitemap.xml` | Confirmed | ✅ |

### Invalid-reference handling (curl)

| URL | Expected | Observed |
|---|---|---|
| `/ayah/1/1` | 200 | 200 ✅ |
| `/ayah/2/255` | 200 | 200 ✅ |
| `/ayah/114/6` | 200 | 200 ✅ |
| `/ayah/999/1` | 404 | 404 ✅ |
| `/ayah/1/999` | 404 | 404 ✅ |
| `/ayah/1/0` | 404 | 404 ✅ |
| `/ayah/abc/xyz` | 404 | 404 ✅ |
| `/quran/nonexistent-surah` | 404 | 404 ✅ |
| `/topics/nonexistent` | 404 | 404 ✅ |

### Canonical URL checks

| Page | Canonical | Status |
|---|---|---|
| `/ayah/2/255` | `http://localhost:3000/ayah/2/255` (absolute) | ✅ |
| `/quran` | `http://localhost:3000/quran` (absolute, was relative) | ✅ fixed |
| `/topics` | `http://localhost:3000/topics` (absolute, was relative) | ✅ fixed |

### Mobile layout regression check

| Page | 375px overflow | Status |
|---|---|---|
| Home (`/`) | scrollWidth=360, no overflow | ✅ (Sprint 13 preserved) |
| Search (`/search`) | scrollWidth=360, no overflow | ✅ (Sprint 13 preserved) |
| Ayah (`/ayah/2/255`) | scrollWidth=360, no overflow | ✅ |

### Sprint 17 regression check

| Check | Result |
|---|---|
| `/` shortcut navigates to `/search` from topic page | `preventDefault=true`, URL becomes `/search` | ✅ |

## 7. Known Limitations

1. **`lastModified` uses build time** — all entries share the build timestamp. A more sophisticated approach would track content modification dates, but Quran content doesn't change.
2. **No `hreflang` tags** — would require a language strategy.
3. **No OG images** — separate feature.
4. **Single-file sitemap** — at 6,382 URLs this is fine. If the site grows past ~40,000 URLs, partitioning would become necessary.

## 8. Explicit Confirmations

- **`AI_ANSWER_FEATURE_ENABLED`** remains `false` and was not touched.
- **Quran content was not altered** — no changes to text, translations, tafsir, hadith, citations, morphology, or review status.
- **No fabricated content** — all sitemap URLs are derived from canonical data.
- **No external SEO services** — no third-party tools, analytics, or tracking added.

Sprint 20 has not been started.
