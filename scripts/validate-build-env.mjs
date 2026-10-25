#!/usr/bin/env node
// Build-time environment validator.
//
// Runs before `next build` (invoked via the `build` npm script) and refuses
// to proceed when the production origin is missing or malformed. This keeps
// a production build from silently baking http://localhost:3000 into every
// sitemap URL, canonical link, and Open Graph tag.
//
// Local development (`pnpm dev`) is unaffected — `next dev` is a separate
// npm script and does not invoke this validator.
//
// Escape hatch: setting ALLOW_LOCALHOST_BUILD=1 lets CI or packaging
// environments produce a build with the dev fallback origin. This is
// documented and explicit, never silent.

function validateProductionSiteUrl(candidate) {
  if (candidate === undefined) {
    return {
      ok: false,
      code: "missing",
      message:
        "NEXT_PUBLIC_SITE_URL is not set. A production build requires an explicit public origin (e.g. https://al-huda.app). Set it in the build environment before running `next build`.",
    };
  }
  if (candidate.trim() === "") {
    return {
      ok: false,
      code: "empty",
      message:
        "NEXT_PUBLIC_SITE_URL is set to an empty string. Provide a full absolute URL such as https://al-huda.app.",
    };
  }
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      ok: false,
      code: "parse-error",
      message: `NEXT_PUBLIC_SITE_URL is not a valid URL: "${candidate}". Expected an absolute URL like https://al-huda.app.`,
    };
  }
  if (parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "") {
    return {
      ok: false,
      code: "not-absolute",
      message: `NEXT_PUBLIC_SITE_URL must be a bare origin (scheme + host + optional port), got "${candidate}". Paths, query strings, and fragments are not allowed.`,
    };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      ok: false,
      code: "bad-scheme",
      message: `NEXT_PUBLIC_SITE_URL must use http or https, got "${parsed.protocol}".`,
    };
  }
  if (parsed.protocol !== "https:") {
    return {
      ok: false,
      code: "bad-scheme",
      message: `NEXT_PUBLIC_SITE_URL must use https for production builds, got "${parsed.protocol}//${parsed.host}". Use http only for non-production deployments.`,
    };
  }
  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]" ||
    host.endsWith(".localhost")
  ) {
    return {
      ok: false,
      code: "localhost",
      message: `NEXT_PUBLIC_SITE_URL points at localhost ("${candidate}"). Production builds must use the public deployment origin.`,
    };
  }
  const port = parsed.port;
  if (port === "3000" || port === "3001" || port === "3002") {
    return {
      ok: false,
      code: "default-dev-port",
      message: `NEXT_PUBLIC_SITE_URL uses a development port (:${port}). Production builds must use the public deployment origin (usually port 443, implicit in the URL).`,
    };
  }
  return {
    ok: true,
    code: null,
    message: `NEXT_PUBLIC_SITE_URL is valid for production: ${parsed.origin}`,
  };
}

const candidate = process.env.NEXT_PUBLIC_SITE_URL;
const result = validateProductionSiteUrl(candidate);

if (result.ok) {
  console.log(`[validate-build-env] ${result.message}`);
  process.exit(0);
}

if (process.env.ALLOW_LOCALHOST_BUILD === "1") {
  console.warn(
    `[validate-build-env] WARNING: ${result.message}\n` +
      `[validate-build-env] Proceeding because ALLOW_LOCALHOST_BUILD=1 is set.\n` +
      `[validate-build-env] The resulting build will embed the fallback origin into sitemaps and metadata.`
  );
  process.exit(0);
}

console.error(`[validate-build-env] BLOCKED: ${result.message}`);
console.error(
  `[validate-build-env] Set NEXT_PUBLIC_SITE_URL to the public deployment origin (e.g. https://al-huda.app) and re-run.\n` +
    `[validate-build-env] If you intentionally need a localhost build, set ALLOW_LOCALHOST_BUILD=1.`
);
process.exit(1);
