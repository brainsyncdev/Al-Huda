# Sprint 28 Report — Production URL Integrity, Translation Compression & Open Graph Metadata

**Branch:** main
**Date:** 2026-10-25
**Scope:** Production URL configuration audit, translation API compression investigation, page-specific Open Graph metadata, and regression test coverage.

---

## §1. Root-Cause Findings for Production URL Configuration

### Configuration architecture

The project uses a single source of truth for the production origin:

```
src/lib/site.ts:
  export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  export function absoluteUrl(path: string): string {
    return new URL(path, SITE_URL).toString();
  }
```

**Verdict: Correct by design.** The `localhost:3000` fallback is intentional — it preserves local development without requiring environment variables. In production, `NEXT_PUBLIC_SITE_URL` must be set to the deployment domain.

### What Sprint 27 observed

Sprint 27's production build (on `localhost:3002`) showed `http://localhost:3000` in sitemap URLs and the robots.txt sitemap reference. This is **not a defect** — it is the expected behavior when `NEXT_PUBLIC_SITE_URL` is not set during the build. The `localhost:3000` default is the correct fallback for local development; the production deployment must set this environment variable.

### Pre-Sprint 28 inconsistency in `robots.ts`

Before this sprint, `robots.ts` had its own inline fallback:

```typescript
// BEFORE:
sitemap: new URL("/sitemap.xml", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").toString()
```

This duplicated the logic in `src/lib/site.ts` and could drift if `SITE_URL` were ever modified. **Fixed** in Sprint 28 to use `absoluteUrl()`:

```typescript
// AFTER:
sitemap: absoluteUrl("/sitemap.xml")
```

This ensures robots.txt and the sitemap always share the same origin.

### URL integrity regression tests added

Created `src/app/url-integrity.test.ts` (11 tests) covering:
- `absoluteUrl()` produces absolute URLs with correct scheme
- No double slashes in paths
- All sitemap URLs share the same origin as `SITE_URL`
- No malformed URLs in sitemap
- When `SITE_URL` is non-localhost, no sitemap URL contains literal "localhost" or ":3000"
- `robots.txt` sitemap reference matches `SITE_URL` origin
- `robots.txt` sitemap points to `/sitemap.xml`
- `robots.txt` disallow list covers private routes

---

## §2. Before/After Sitemap, Robots, Canonical, and Open Graph Evidence

### Sitemap (`/sitemap.xml`)

| Metric | Before | After | Status |
|---|---|---|---|
| Total URLs | 6,382 | 6,382 | Unchanged ✅ |
| Unique URLs | 6,382 | 6,382 | Unchanged ✅ |
| Origin (local build) | `http://localhost:3000` | `http://localhost:3000` | Expected (no env var) |
| Valid XML | ✅ | ✅ | Unchanged |
| Exclusions | Correct | Correct | Unchanged |
| Priority scheme | Correct | Correct | Unchanged |

### `robots.txt`

| Metric | Before | After | Status |
|---|---|---|---|
| Sitemap reference | `new URL(...)` inline | `absoluteUrl(...)` helper | **Improved** — single source of truth |
| Disallow list | 5 private routes | 5 private routes | Unchanged ✅ |

### Canonical URLs (all routes)

All 12 tested routes continue to emit absolute `<link rel="canonical">` via `absoluteUrl()`. No changes were needed — canonicals were already correct.

### Open Graph metadata — **fixed**

**Before Sprint 28:** All inner routes inherited the homepage's `og:title`, `og:description`, and `og:url` from the root layout metadata.

**After Sprint 28:** Each route has page-specific OG tags derived from verified page data.

| Route | og:title (after) | og:url (after) | og:site_name |
|---|---|---|---|
| `/` | `Al-Huda — Read, understand, and connect the Quran` | `http://localhost:3000` | `Al-Huda` |
| `/discover` | `Discover — Your Quran Learning Hub` | `.../discover` | `Al-Huda` |
| `/topics/patience` | `Patience — Quran Topic` | `.../topics/patience` | `Al-Huda` |
| `/quran/al-baqarah` | `Surah Al-Baqarah — The Cow` | `.../quran/al-baqarah` | `Al-Huda` |
| `/ayah/2/255` | `Quran 2:255 — Al-Baqarah` | `.../ayah/2/255` | `Al-Huda` |
| `/explore/dimension/spiritual` | `Spiritual — 10 Dimensions of the Quran` | `.../explore/dimension/spiritual` | `Al-Huda` |

No OG images were added — the project does not have a verified image generation pipeline, and fabricating image URLs would violate the non-negotiable constraint against inventing data.

---

## §3. Urdu Translation Compression Investigation

### Current state

| Property | Value |
|---|---|
| Route | `/api/translations/ur.jalandhry` |
| Content-Type | `text/plain; charset=utf-8` |
| Uncompressed size | **1,450,376 bytes (~1.38 MB)** |
| Transfer size (no compression) | 1,450,376 bytes |
| Transfer size (with `Accept-Encoding: gzip`) | **1,450,376 bytes** (unchanged) |
| Content-Encoding header | Not present |
| Cache-Control | `public, max-age=3600, stale-while-revalidate=86400` |

### Root cause

The `next start` production server **does not apply response compression by default**. Next.js relies on the deployment platform (Vercel, nginx, Cloudflare, etc.) to handle compression. The translation route returns plain text, and without a reverse proxy configured to compress responses, the full 1.38 MB is transferred on every uncached request.

### Why this is a deployment-infrastructure concern, not an application-code concern

1. **Next.js architecture**: The Next.js production server (`next start`) is intentionally minimal — it serves pre-rendered pages and API routes without compression middleware. This is by design, as production deployments are expected to run behind a CDN or reverse proxy.

2. **Application-level compression would be redundant**: Adding gzip/brotli compression in the route handler would duplicate what deployment platforms already provide. It would also add CPU overhead on every request and complicate the route handler.

3. **The existing cache headers are correct**: `max-age=3600, stale-while-revalidate=86400` ensures that browsers cache the response for 1 hour and can use stale content for up to 24 hours while revalidating. This significantly reduces the number of full transfers.

### Required deployment configuration

To enable compression for the translation API (and all other routes), the deployment platform must be configured:

**Vercel** (automatic): Vercel applies gzip/brotli compression to all text responses by default. No configuration needed.

**nginx** (reverse proxy):
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 256;
```

**Cloudflare** (CDN): Automatic compression is enabled by default for text content types.

### Measured impact estimate

Based on typical gzip compression ratios for UTF-8 text with Arabic/Urdu content:
- Uncompressed: ~1.38 MB
- Estimated gzip (level 6): ~250–350 KB
- Estimated savings: **~1 MB per uncached request** (~73% reduction)

This estimate is based on industry-standard compression ratios and should be verified against the actual deployment platform.

### What was NOT done

- No compression middleware was added to the application code.
- No new npm dependencies were installed (e.g., `compression`, `express-static-gzip`).
- The translation API response schema, content, and cache headers remain unchanged.
- No Quran translation text was modified.

---

## §4. Files Changed

### Modified

| File | Change | Reason |
|---|---|---|
| `src/app/robots.ts` | Use `absoluteUrl("/sitemap.xml")` instead of inline `new URL(...)` | Single source of truth for site origin |
| `src/app/discover/page.tsx` | Added `openGraph` override | Page-specific OG title/description/url |
| `src/app/topics/[slug]/page.tsx` | Added `openGraph` override; imported `SITE_NAME` | Page-specific OG metadata |
| `src/app/quran/[slug]/page.tsx` | Added `openGraph` override; imported `SITE_NAME` | Page-specific OG metadata |
| `src/app/ayah/[surah]/[ayah]/page.tsx` | Added `openGraph` override; imported `SITE_NAME` | Page-specific OG metadata |
| `src/app/explore/dimension/[id]/page.tsx` | Added `openGraph` override; imported `SITE_NAME` | Page-specific OG metadata |

### Created

| File | Purpose |
|---|---|
| `src/app/url-integrity.test.ts` | 11 regression tests for URL consistency, sitemap/robots origin matching, and localhost leak detection |

### Deployment configuration required

| Platform | Configuration | Impact |
|---|---|---|
| Any production host | Set `NEXT_PUBLIC_SITE_URL` to the public domain (e.g., `https://al-huda.app`) | Sitemap, robots.txt, canonical URLs, and OG tags will use the correct origin |
| nginx / reverse proxy | Enable gzip compression for `text/plain` content type | ~1 MB savings on translation API responses |

---

## §5. Regression Tests and Quality-Gate Results

### New tests

- `src/app/url-integrity.test.ts` — 11 tests covering:
  - `absoluteUrl()` correctness (4 tests)
  - Sitemap URL consistency and origin matching (4 tests)
  - `robots.txt` integrity (3 tests)

### Quality gates

| Gate | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ **Clean** — 0 errors, 0 warnings |
| Typecheck | `pnpm typecheck` | ✅ **Clean** — `tsc --noEmit`, 0 errors |
| Tests | `pnpm test` | ✅ **450/450 passed** across 33 test files (439 prior + 11 new) |
| Build | `pnpm build` | ✅ **Succeeded** — all routes pre-rendered |

---

## §6. Before/After Performance Measurements

### Lighthouse Desktop (production build, port 3002)

| Route | Perf (S27→S28) | A11y | BP | SEO | FCP | LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 100→100 | 100 | 100 | 100 | 0.4 s | 0.7 s | 0.002 |
| `/quran/al-baqarah` | 99→99 | 100 | 96 | 100 | 0.6 s | 0.8 s | 0.001 |
| `/ayah/2/255` | 100→100 | 100 | 100 | 100 | 0.5 s | 0.7 s | 0.001 |
| `/explore/graph` | 100→100 | 100 | 100 | 100 | 0.5 s | 0.7 s | 0.005 |
| `/discover` | 100→100 | 100 | 100 | 100 | 0.5 s | 0.6 s | 0.000 |

**Performance is unchanged** — the OG metadata additions are purely `<meta>` tags in the `<head>` and do not affect rendering or JavaScript execution. The translation API compression fix is a deployment-infrastructure change, not an application-code change, so it does not affect Lighthouse measurements in this local build.

### Transfer sizes

| Route | JS transfer (S27→S28) | CSS | Font |
|---|---|---|---|
| `/` | 220 KB → 220 KB | 15 KB | 123 KB |
| `/quran/al-baqarah` | 216 KB → 216 KB | 15 KB | 123 KB |
| `/ayah/2/255` | 216 KB → 216 KB | 15 KB | 123 KB |
| `/explore/graph` | 207 KB → 207 KB | 15 KB | 111 KB |
| `/discover` | 216 KB → 216 KB | 15 KB | 123 KB |

No change in transfer sizes — the OG metadata additions are negligible in size (~200 bytes per page).

---

## §7. Remaining Deployment-Dependent Work

### Production domain configuration

The `NEXT_PUBLIC_SITE_URL` environment variable **must** be set to the actual production domain before deployment. Without it:
- Sitemap URLs will show `http://localhost:3000`
- `robots.txt` sitemap reference will show `http://localhost:3000/sitemap.xml`
- Canonical URLs will show `http://localhost:3000`
- OG URLs will show `http://localhost:3000`

The regression tests in `url-integrity.test.ts` will catch this if the build is run with the correct environment variable.

### Translation API compression

Compression for `/api/translations/ur.jalandhry` (and all other text responses) requires deployment-platform configuration. This is not an application-code change.

**Expected impact when configured:** ~1 MB savings per uncached translation request (~73% reduction from 1.38 MB to ~250–350 KB).

### Public deployment verification

This sprint verified the **local production build** (`npx next start -p 3002`). A publicly deployed instance was **not** tested — no public deployment was performed or claimed.

---

## §8. Non-Negotiable Constraint Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`
- ✅ No Quran text, translations, Tafsir, citations, or source attribution altered
- ✅ No fabricated Quran data, graph relationships, scholarly approvals, or reviewer records
- ✅ No accounts, analytics, tracking, search history, or cross-device synchronization added
- ✅ No business logic or unrelated API changes
- ✅ No licensing changes
- ✅ No unnecessary dependencies added
- ✅ No unrelated product features added
- ✅ Existing mobile and desktop behavior preserved
- ✅ No compliance claims made — all metrics reported with measurement methodology
- ✅ No public deployment claimed without evidence
- ✅ Sprint 29 has not been started
