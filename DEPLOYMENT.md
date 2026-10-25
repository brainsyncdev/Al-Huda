# Al-Huda — Deployment Checklist

This document is the single source of truth for deploying Al-Huda to production. It assumes a Node.js host capable of running `next start` behind a reverse proxy or CDN. The project has no committed hosting configuration (no `vercel.json`, no `Dockerfile`, no `netlify.toml`, no CI workflow); choose a platform and adapt the steps below.

## 1. Required environment variables

| Variable | Required | Example | Notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **Yes, for production builds** | `https://al-huda.app` | Must be a bare `https://` origin. No path, no query, no fragment. Must not be `localhost`, `127.0.0.1`, or a development port (3000–3002). |
| `ALLOW_LOCALHOST_BUILD` | No | `1` | Escape hatch for packaging builds (e.g. Docker images) that set the origin at runtime. Setting this to `1` lets the build proceed with a localhost fallback, but the resulting sitemaps and metadata will embed that fallback. |

### When the variable must be available

`NEXT_PUBLIC_SITE_URL` is a `NEXT_PUBLIC_*` variable. Next.js inlines these into the built JavaScript bundle **at `next build` time**. The variable must therefore be set in the environment that runs the build, not only in the environment that runs the server. Setting it only on the `next start` host will have no effect on the shipped code.

### What the build gate does

`pnpm build` runs `scripts/validate-build-env.mjs` before invoking `next build`. The validator blocks the build when:

- `NEXT_PUBLIC_SITE_URL` is not set.
- `NEXT_PUBLIC_SITE_URL` is empty, malformed, or a relative URL.
- `NEXT_PUBLIC_SITE_URL` uses `http://` (production requires `https://`).
- `NEXT_PUBLIC_SITE_URL` points at `localhost`, `127.0.0.1`, `[::1]`, or any `*.localhost` subdomain.
- `NEXT_PUBLIC_SITE_URL` uses a development port (`:3000`, `:3001`, `:3002`).

Local development (`pnpm dev`) is not affected — `next dev` does not run the validator.

The validator is a pure function in `src/lib/validate-site-url.ts`, covered by 22 unit tests in `src/lib/validate-site-url.test.ts`. Failure codes are stable strings (`missing`, `empty`, `parse-error`, `not-absolute`, `bad-scheme`, `localhost`, `default-dev-port`) for CI tooling.

## 2. Build and start

```bash
# Set the production origin in the build environment
export NEXT_PUBLIC_SITE_URL=https://al-huda.app

# Install, build, start
pnpm install --frozen-lockfile
pnpm build              # runs validate-build-env.mjs first
pnpm start              # default port 3000
```

To start on a custom port, invoke `next start` directly:

```bash
npx next start -p 3002
```

Do **not** use `pnpm start -- -p 3002` — pnpm forwards `-- -p 3002` as a positional argument, which `next start` interprets as a directory. This is a recurring footgun.

## 3. Response compression

Next.js's `next start` does not compress responses. Configure gzip or brotli at the layer in front of the Node process.

### nginx (reverse proxy)

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript application/xml text/xml;
    gzip_min_length 256;
    gzip_vary on;
}
```

### Vercel

Automatic — Vercel applies gzip/brotli to text responses by default. No configuration required.

### Cloudflare

Automatic — enable **Auto Minify** and **Brotli** in the Speed settings.

### Verification

After deployment, confirm compression is active:

```bash
curl -sI -H "Accept-Encoding: gzip" https://al-huda.app/api/translations/ur.jalandhry \
  | grep -iE 'content-encoding|content-length|transfer-encoding|vary'
```

Expected: `Content-Encoding: gzip` (or `br`), `Vary: Accept-Encoding`, and a transfer size substantially below the uncompressed ~1.45 MB. The decoded body must match the uncompressed response byte-for-byte — the bundled smoke test (`pnpm smoke <url>`) verifies this automatically.

## 4. Post-deployment SEO verification

Run the bundled smoke test against the live public origin:

```bash
pnpm smoke https://al-huda.app
# or, with an explicit expected origin when different from the base URL:
pnpm smoke https://al-huda.app https://al-huda.app
```

The smoke test (`scripts/seo-smoke-test.mjs`) checks:

- `/robots.txt` returns successfully and references the correct public sitemap.
- `/sitemap.xml` is valid XML, contains unique absolute URLs, and has no localhost URLs.
- Canonical URLs and Open Graph URLs use the expected origin.
- Page-specific Open Graph titles are present on `/`, `/quran/al-baqarah`, `/ayah/2/255`, `/topics/patience`, `/explore/dimension/spiritual`, `/discover`.
- Invalid references (`/ayah/999/1`, `/quran/nonexistent`, `/topics/nonexistent`) return 404.
- Theme redirects (`/explore/theme/patience`) return 308.
- Noindex routes (`/search`, `/explore/root/grace`) carry `noindex, follow`.
- `/api/translations/ur.jalandhry` returns the same body with and without `Accept-Encoding: gzip`, and `Content-Encoding` is set when compression is active.

The base URL must be supplied explicitly. The script never defaults to a guessed domain.

## 5. Local vs deployed verification

| Check | Local build (`pnpm build` + `npx next start`) | Deployed production |
|---|---|---|
| Build gate rejects localhost origins | ✅ verified | Not applicable |
| Sitemap valid XML, 6,382 unique URLs | ✅ | ✅ (re-check via smoke test) |
| Sitemap URLs on `localhost:3000` | ✅ expected (env var unset) | ❌ must use public origin |
| `robots.txt` references correct sitemap | ✅ (localhost form) | ✅ (public form) |
| Canonical URLs absolute | ✅ | ✅ |
| Page-specific `og:title` on 6 routes | ✅ | ✅ |
| Response compression active | ❌ (`next start` doesn't compress) | ✅ (reverse proxy / CDN) |
| Invalid refs return 404 | ✅ | ✅ |
| Theme redirects return 308 | ✅ | ✅ |
| Noindex routes carry `noindex` | ✅ | ✅ |

A local build proves the application code is correct. It does **not** prove the deployment is correct. The public-origin and compression checks require the live deployment.

## 6. Secrets and hosting details

This repository does not commit:

- Environment variable values (no `.env*` files are tracked).
- Vercel, Netlify, Docker, or nginx configuration.
- CI workflows (no `.github/workflows/`, no `.circleci/`, no `.gitlab-ci.yml`).

When a hosting platform is chosen, add its configuration file in a dedicated commit and update this checklist with any platform-specific steps (domain binding, DNS, TLS certificate, build command override).
