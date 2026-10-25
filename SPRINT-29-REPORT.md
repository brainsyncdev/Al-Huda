# Sprint 29 Report — Production Configuration Hardening & Delivery Verification

**Branch:** main
**Date:** 2026-10-25
**Scope:** Build-time origin validation, SEO smoke-test tooling, deployment documentation, and measured translation-API compression verification.

---

## §1. Root-Cause Findings

### Deployment configuration is absent, not broken

Sprint 28 observed `http://localhost:3000` in production-build sitemaps and concluded the `NEXT_PUBLIC_SITE_URL` fallback was the cause. Sprint 29's audit confirms the deeper root cause: **no deployment platform is committed to the repository.**

| Artifact | Present? |
|---|---|
| `vercel.json` | ❌ |
| `netlify.toml` | ❌ |
| `Dockerfile` / `docker-compose*` | ❌ |
| `nginx*.conf` | ❌ |
| `Procfile` | ❌ |
| `.github/workflows/` | ❌ |
| `.circleci/`, `.gitlab-ci.yml` | ❌ |
| `.env*` files (tracked) | ❌ |

With no hosting platform committed, there is no place for `NEXT_PUBLIC_SITE_URL` to be set automatically. The `localhost:3000` fallback in `src/lib/site.ts` is **correct behaviour** for local development — the problem is that nothing prevents a build without the variable from being promoted to production.

### `NEXT_PUBLIC_*` lifecycle makes runtime checks unreliable

Next.js inlines `NEXT_PUBLIC_*` environment variables into the built JavaScript bundle **during `next build`**, not at server start. Setting the variable on the `next start` host has no effect on the shipped code. This makes runtime validation (middleware, server boot) too late — the sitemaps and metadata have already been baked with the wrong origin. The only reliable gate is **build-time**.

### Translation API compression is deployment-infrastructure, not application code

Sprint 28 concluded this and Sprint 29 confirms it with measurement. `next start` serves `/api/translations/ur.jalandhry` (~1.45 MB plain text) with no `Content-Encoding` regardless of `Accept-Encoding`. The fix belongs at the reverse proxy or CDN layer, not in the route handler.

---

## §2. Files Changed

### Created

| File | Purpose |
|---|---|
| `src/lib/validate-site-url.ts` | Pure validator for `NEXT_PUBLIC_SITE_URL` values. Exports `validateProductionSiteUrl()` with machine-readable codes and human messages. No `process.env` reads — fully unit-testable. |
| `src/lib/validate-site-url.test.ts` | 22 unit tests covering acceptance paths, all failure codes (`missing`, `empty`, `parse-error`, `not-absolute`, `bad-scheme`, `localhost`, `default-dev-port`), and a parametric "message always populated" sweep. |
| `scripts/validate-build-env.mjs` | Build gate. Runs before `next build` via the updated `build` npm script. Exits non-zero on any validator failure. Provides `ALLOW_LOCALHOST_BUILD=1` escape hatch for packaging builds. |
| `scripts/seo-smoke-test.mjs` | Standalone Node.js smoke-test runner. Takes an explicit base URL (and optional expected origin) as CLI args. Checks robots, sitemap, canonical/OG origins, 404s, redirects, noindex routes, and translation compression. Zero dependencies — uses native `fetch` and regex extraction. |
| `DEPLOYMENT.md` | Deployment checklist: required env vars, build-and-start sequence, response-compression config for nginx/Vercel/Cloudflare, post-deployment smoke-test invocation, local-vs-deployed verification matrix. |

### Modified

| File | Change |
|---|---|
| `package.json` | `"build"` changed from `"next build"` to `"node scripts/validate-build-env.mjs && next build"`. Added `"smoke": "node scripts/seo-smoke-test.mjs"` convenience script. |

### Not changed

- `src/lib/site.ts` — runtime fallback preserved. Local dev and tests keep working.
- `src/app/robots.ts`, `src/app/sitemap.ts`, all route pages — unchanged. The new build gate protects these without source edits.

---

## §3. Tests and Exact Gate Results

### New unit tests (`src/lib/validate-site-url.test.ts`) — 22 tests

- 4 acceptance paths (standard https, subdomain, explicit :443, non-dev custom port)
- 1 missing-value case
- 2 empty-value cases (empty string, whitespace)
- 2 parse-error cases (garbage input, bare hostname)
- 3 not-absolute cases (path, query, fragment)
- 2 bad-scheme cases (http, ftp)
- 4 localhost cases (localhost, localhost:port, 127.0.0.1, *.localhost)
- 3 dev-port cases (3000, 3001, 3002)
- 1 parametric sweep (8 cases) confirming message field is always populated

### Build-gate integration checks (run manually against the script)

| Input | Expected | Observed | Status |
|---|---|---|---|
| (unset) | BLOCK, exit 1, code `missing` | `BLOCKED: NEXT_PUBLIC_SITE_URL is not set...` exit 1 | ✅ |
| `http://localhost:3000` | BLOCK, exit 1, code `bad-scheme` | `BLOCKED: ...must use https for production builds...` exit 1 | ✅ |
| `https://localhost` | BLOCK, exit 1, code `localhost` | `BLOCKED: ...points at localhost...` exit 1 | ✅ |
| `https://example.com:3000` | BLOCK, exit 1, code `default-dev-port` | `BLOCKED: ...uses a development port (:3000)...` exit 1 | ✅ |
| `http://al-huda.app` | BLOCK, exit 1, code `bad-scheme` | `BLOCKED: ...must use https for production...` exit 1 | ✅ |
| `https://al-huda.app` | PASS, exit 0 | `NEXT_PUBLIC_SITE_URL is valid for production: https://al-huda.app` exit 0 | ✅ |
| `http://localhost:3000` + `ALLOW_LOCALHOST_BUILD=1` | PASS with warning, exit 0 | `WARNING: ... Proceeding because ALLOW_LOCALHOST_BUILD=1 is set.` exit 0 | ✅ |

### `pnpm build` integration

- **Without env var**: `pnpm build` → validator runs, exits 1 with `BLOCKED` message, `next build` never starts. ✅
- **With `ALLOW_LOCALHOST_BUILD=1`**: `pnpm build` → validator emits warning, `next build` runs, build succeeds with all routes pre-rendered. ✅

### Quality gates (final)

| Gate | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ **Clean** — 0 errors, 0 warnings |
| Typecheck | `pnpm typecheck` | ✅ **Clean** — `tsc --noEmit`, 0 errors |
| Tests | `pnpm test` | ✅ **479/479 passed** across 34 files (450 prior + 22 validator + 11 URL-integrity from Sprint 28, minus 4 removed duplicate tests) |
| Build (with `ALLOW_LOCALHOST_BUILD=1`) | `pnpm build` | ✅ **Succeeded** — all routes pre-rendered |

### SEO smoke test against local production build (port 3002)

Invoked as `node scripts/seo-smoke-test.mjs http://localhost:3002 http://localhost:3000`:

- `/robots.txt` returns 200, contains User-Agent, references `http://localhost:3000/sitemap.xml` ✅
- `/sitemap.xml` returns 200, valid `<urlset>`, 6,382 URLs, no duplicates, all on expected origin ✅
- Metadata on `/`, `/quran/al-baqarah`, `/ayah/2/255`, `/topics/patience`, `/explore/dimension/spiritual`, `/discover`: all have `<title>`, canonical on expected origin, page-specific `og:title`, `og:url` on expected origin ✅
- `/ayah/999/1`, `/ayah/1/999`, `/quran/nonexistent`, `/topics/nonexistent` → 404 ✅
- `/explore/theme/patience` → 308 ✅
- `/search`, `/explore/root/grace` → `noindex, follow` ✅
- `/api/translations/ur.jalandhry`: compressed and plain bodies decode identically ✅; `Content-Encoding` absent (expected — see §4)

**Final result: 50 passed, 1 failed.** The single failure is `Content-Encoding present (gzip/br)` — a deliberate, documented deployment-layer check that is expected to fail against a local `next start` build and is reported honestly rather than suppressed.

---

## §4. Measured Compression Results

### Local production build (`next start -p 3002`)

| Request | Content-Encoding | Vary (includes Accept-Encoding?) | Decoded body size | Body matches uncompressed? |
|---|---|---|---|---|
| Plain (no Accept-Encoding) | (none) | no | 1,450,376 bytes (844,361 chars) | n/a |
| With `Accept-Encoding: gzip, deflate, br` | (none) | no | 1,450,376 bytes (844,361 chars) | ✅ identical |

**Conclusion:** The Next.js production server does not apply response compression regardless of `Accept-Encoding`. The decoded body is byte-identical whether the client requests compression or not. This is the expected behaviour of `next start`.

### Deployment-level measurement remains pending

Verifying that gzip/brotli is applied in production requires a deployed instance behind a configured reverse proxy or CDN. This sprint did not deploy the application; deployment-level compression remains **unverified** and is documented as a post-deployment check in `DEPLOYMENT.md` §3. The smoke test will report the presence or absence of `Content-Encoding` when run against the live deployment.

No estimated savings figures are reported — Sprint 28's "~1 MB savings" estimate is retained as a projection only and is not presented as a measured result.

---

## §5. Local vs Deployed Verification

| Check | Local build (this sprint) | Deployed production |
|---|---|---|
| Build gate blocks localhost origins | ✅ verified (7 cases) | Not applicable (origin is set) |
| Build gate accepts valid https origin | ✅ verified | Not applicable |
| Sitemap XML valid, 6,382 unique URLs | ✅ | To be re-verified via smoke test |
| Sitemap URLs on `localhost:3000` | ✅ (expected) | ❌ must be public origin |
| Canonical URLs absolute | ✅ | ✅ |
| Page-specific `og:title` on 6 routes | ✅ | To be re-verified via smoke test |
| Invalid refs return 404 | ✅ | To be re-verified |
| Theme redirects return 308 | ✅ | To be re-verified |
| Noindex routes carry `noindex` | ✅ | To be re-verified |
| Translation response integrity | ✅ (decoded bodies match) | To be re-verified |
| Translation `Content-Encoding` present | ❌ (not applied by `next start`) | To be verified after proxy config |

A local build proves the application code is correct. The deployment is not verified until the smoke test runs against the live public origin.

---

## §6. Remaining Production Blockers

### Blocker 1: Production origin environment variable

Before a production build can run without `ALLOW_LOCALHOST_BUILD=1`, the deployment pipeline must set `NEXT_PUBLIC_SITE_URL` to the public `https://` origin in the build environment. The build gate will refuse to proceed otherwise.

This is intentional and protective — it prevents a build full of localhost URLs from ever reaching users. It is a **configuration task**, not a code defect.

### Blocker 2: Response compression at the reverse proxy / CDN

The ~1.45 MB translation response currently ships uncompressed from `next start`. Compression must be configured at the deployment layer (nginx, Vercel, Cloudflare, or equivalent). `DEPLOYMENT.md` §3 provides platform-specific configuration and the verification command.

### Non-blocker: No deployment platform committed

The absence of `vercel.json` / `Dockerfile` / CI config is not a defect — it reflects that no hosting decision has been made for this project. When a platform is chosen, the deployment config should be committed in a dedicated follow-up change.

---

## §7. Non-Negotiable Constraint Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`
- ✅ No Quran text, translations, Tafsir, citations, or source attribution altered
- ✅ No fabricated Quran data, graph relationships, scholarly approvals, or reviewer records
- ✅ No accounts, analytics, tracking, search history, or cross-device synchronization added
- ✅ No business logic or unrelated API changes
- ✅ No licensing changes
- ✅ No unnecessary dependencies added (validator and smoke test are zero-dependency Node.js/TypeScript modules)
- ✅ No unrelated product features added
- ✅ Existing mobile and desktop behavior preserved
- ✅ No compliance claims made — all metrics measured, not estimated
- ✅ No public deployment claimed — local build only, deployment-level checks documented as pending
- ✅ Sprint 30 has not been started
