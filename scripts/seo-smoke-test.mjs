#!/usr/bin/env node
// SEO smoke-test runner.
//
// Usage:
//   node scripts/seo-smoke-test.mjs <base-url> [<expected-origin>]
//
// Example:
//   node scripts/seo-smoke-test.mjs http://localhost:3002
//   node scripts/seo-smoke-test.mjs https://al-huda.app https://al-huda.app
//
// The base URL must be supplied explicitly. The script never defaults to a
// guessed domain. When `expected-origin` is omitted, it is derived from the
// base URL.
//
// Exit codes:
//   0 — all applicable checks passed
//   1 — one or more checks failed
//   2 — usage error (missing base URL)

const USAGE =
  "Usage: node scripts/seo-smoke-test.mjs <base-url> [<expected-origin>]";

const baseUrl = process.argv[2];
if (!baseUrl) {
  console.error(USAGE);
  process.exit(2);
}

const expectedOrigin = process.argv[3] ?? new URL(baseUrl).origin;

let passed = 0;
let failed = 0;
const failures = [];

function pass(label, detail = "") {
  passed++;
  console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  failed++;
  failures.push({ label, detail });
  console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
}

async function fetchText(url) {
  const res = await fetch(url, { redirect: "manual" });
  return { status: res.status, headers: res.headers, body: await res.text() };
}

async function fetchHead(url) {
  const res = await fetch(url, { redirect: "manual", method: "HEAD" });
  return { status: res.status, headers: res.headers };
}

async function checkRobots() {
  console.log("\n[robots.txt]");
  const { status, body } = await fetchText(`${baseUrl}/robots.txt`);
  if (status !== 200) {
    fail("robots.txt returns 200", `got ${status}`);
    return;
  }
  pass("robots.txt returns 200");

  if (!body.toLowerCase().includes("user-agent")) {
    fail("robots.txt contains User-Agent directive");
  } else {
    pass("robots.txt contains User-Agent directive");
  }

  const sitemapMatch = body.match(/Sitemap:\s*(\S+)/i);
  if (!sitemapMatch) {
    fail("robots.txt contains Sitemap reference");
    return;
  }
  const sitemapUrl = sitemapMatch[1];
  if (!sitemapUrl.startsWith(expectedOrigin)) {
    fail(
      "robots.txt sitemap origin matches expected",
      `got ${sitemapUrl}, expected origin ${expectedOrigin}`
    );
  } else {
    pass("robots.txt sitemap origin matches expected", sitemapUrl);
  }
  if (sitemapUrl.endsWith("/sitemap.xml")) {
    pass("robots.txt sitemap points to /sitemap.xml");
  } else {
    fail("robots.txt sitemap points to /sitemap.xml", `got ${sitemapUrl}`);
  }
}

async function checkSitemap() {
  console.log("\n[sitemap.xml]");
  const { status, body } = await fetchText(`${baseUrl}/sitemap.xml`);
  if (status !== 200) {
    fail("sitemap.xml returns 200", `got ${status}`);
    return;
  }
  pass("sitemap.xml returns 200");

  if (!body.includes("<urlset")) {
    fail("sitemap.xml contains <urlset>");
    return;
  }
  pass("sitemap.xml contains <urlset>");

  const urls = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    fail("sitemap.xml contains at least one <loc>");
    return;
  }
  pass("sitemap.xml contains <loc> entries", `${urls.length} URLs`);

  const unique = new Set(urls);
  if (unique.size !== urls.length) {
    fail(
      "sitemap.xml has no duplicate URLs",
      `${urls.length - unique.size} duplicates`
    );
  } else {
    pass("sitemap.xml has no duplicate URLs");
  }

  const localhostUrls = urls.filter((u) => u.includes("localhost"));
  if (expectedOrigin.includes("localhost")) {
    if (localhostUrls.length === urls.length) {
      pass(
        "sitemap.xml URLs all use localhost (expected for local build)",
        `${localhostUrls.length} URLs`
      );
    } else {
      fail(
        "sitemap.xml URLs all use localhost (expected for local build)",
        `only ${localhostUrls.length}/${urls.length}`
      );
    }
  } else {
    if (localhostUrls.length > 0) {
      fail(
        "sitemap.xml contains no localhost URLs",
        `found ${localhostUrls.length}`
      );
    } else {
      pass("sitemap.xml contains no localhost URLs");
    }
  }

  const offOrigin = urls.filter((u) => {
    try {
      return new URL(u).origin !== expectedOrigin;
    } catch {
      return true;
    }
  });
  if (offOrigin.length > 0) {
    fail(
      "all sitemap URLs share expected origin",
      `${offOrigin.length} URLs off ${expectedOrigin}`
    );
  } else {
    pass("all sitemap URLs share expected origin");
  }
}

async function checkRouteMetadata(path, expectations) {
  console.log(`\n[${path}]`);
  const { status, body } = await fetchText(`${baseUrl}${path}`);
  if (status !== 200) {
    fail(`${path} returns 200`, `got ${status}`);
    return;
  }
  pass(`${path} returns 200`);

  // jsdom is not a project dependency; use regex extraction to stay dependency-free.
  const titleMatch = body.match(/<title>([^<]+)<\/title>/);
  if (!titleMatch) {
    fail(`${path} has <title>`);
  } else {
    pass(`${path} has <title>`, titleMatch[1].slice(0, 60));
  }

  const canonicalMatch = body.match(/rel="canonical"\s+href="([^"]+)"/);
  if (!canonicalMatch) {
    fail(`${path} has <link rel="canonical">`);
  } else {
    const canonical = canonicalMatch[1];
    if (canonical.startsWith(expectedOrigin)) {
      pass(`${path} canonical origin matches`, canonical);
    } else {
      fail(
        `${path} canonical origin matches`,
        `got ${canonical}, expected ${expectedOrigin}`
      );
    }
  }

  const ogTitleMatch = body.match(
    /property="og:title"\s+content="([^"]+)"/
  );
  if (!ogTitleMatch) {
    fail(`${path} has og:title`);
  } else if (expectations.ogTitle && !ogTitleMatch[1].includes(expectations.ogTitle)) {
    fail(
      `${path} og:title contains expected substring`,
      `expected "${expectations.ogTitle}" in "${ogTitleMatch[1]}"`
    );
  } else {
    pass(`${path} has og:title`, ogTitleMatch[1].slice(0, 60));
  }

  const ogUrlMatch = body.match(/property="og:url"\s+content="([^"]+)"/);
  if (!ogUrlMatch) {
    fail(`${path} has og:url`);
  } else {
    const ogUrl = ogUrlMatch[1];
    try {
      if (new URL(ogUrl).origin !== expectedOrigin) {
        fail(
          `${path} og:url origin matches`,
          `got ${ogUrl}, expected ${expectedOrigin}`
        );
      } else {
        pass(`${path} og:url origin matches`, ogUrl);
      }
    } catch {
      fail(`${path} og:url is well-formed`, ogUrl);
    }
  }
}

async function checkStatus(path, expectedStatus, label) {
  console.log(`\n[${label}]`);
  const { status } = await fetchHead(`${baseUrl}${path}`);
  if (status === expectedStatus) {
    pass(`${path} returns ${expectedStatus}`);
  } else {
    fail(`${path} returns ${expectedStatus}`, `got ${status}`);
  }
}

async function checkNoindex(path) {
  console.log(`\n[${path} noindex]`);
  const { status, body } = await fetchText(`${baseUrl}${path}`);
  if (status !== 200) {
    fail(`${path} returns 200`, `got ${status}`);
    return;
  }
  pass(`${path} returns 200`);
  if (/name="robots"\s+content="[^"]*noindex/i.test(body)) {
    pass(`${path} has noindex robots directive`);
  } else {
    fail(`${path} has noindex robots directive`);
  }
}

async function checkTranslationCompression() {
  console.log("\n[/api/translations/ur.jalandhry — compression probe]");
  const plainRes = await fetch(
    `${baseUrl}/api/translations/ur.jalandhry`
  );
  const plainBytes = Number(plainRes.headers.get("content-length") || 0);
  const plainBody = await plainRes.text();

  // Fetch again with gzip acceptance.
  const gzipRes = await fetch(
    `${baseUrl}/api/translations/ur.jalandhry`,
    { headers: { "Accept-Encoding": "gzip, deflate, br" } }
  );
  const encoding = gzipRes.headers.get("content-encoding");
  const vary = gzipRes.headers.get("vary") || "";
  const gzipBody = await gzipRes.text();

  if (plainBody !== gzipBody) {
    fail(
      "compressed and plain responses decode identically",
      `bodies differ (plain ${plainBody.length} chars, decoded ${gzipBody.length})`
    );
  } else {
    pass(
      "compressed and plain responses decode identically",
      `${plainBody.length} chars`
    );
  }

  if (encoding) {
    pass(`Content-Encoding present`, encoding);
  } else {
    fail(
      "Content-Encoding present (gzip/br)",
      "header absent — compression is not applied at this layer. Configure gzip at the reverse proxy or CDN."
    );
  }

  if (vary.toLowerCase().includes("accept-encoding")) {
    pass("Vary includes Accept-Encoding");
  } else {
    // Not a failure when compression is absent; informational only.
    console.log(
      `  ℹ Vary header does not include Accept-Encoding (expected when no compression is applied): "${vary}"`
    );
  }

  console.log(
    `  ℹ Uncompressed body size (decoded): ${plainBody.length} chars, ${new TextEncoder().encode(plainBody).length} bytes`
  );
  console.log(
    `  ℹ Content-Length header (plain): ${plainBytes || "not set"}`
  );
}

async function main() {
  console.log(`SEO smoke test`);
  console.log(`  base URL:        ${baseUrl}`);
  console.log(`  expected origin: ${expectedOrigin}`);

  await checkRobots();
  await checkSitemap();

  await checkRouteMetadata("/", { ogTitle: "Al-Huda" });
  await checkRouteMetadata("/quran/al-baqarah", {
    ogTitle: "Surah Al-Baqarah",
  });
  await checkRouteMetadata("/ayah/2/255", { ogTitle: "Quran 2:255" });
  await checkRouteMetadata("/topics/patience", { ogTitle: "Patience" });
  await checkRouteMetadata("/explore/dimension/spiritual", {
    ogTitle: "Spiritual",
  });
  await checkRouteMetadata("/discover", { ogTitle: "Discover" });

  await checkStatus("/ayah/999/1", 404, "invalid ayah surah → 404");
  await checkStatus("/ayah/1/999", 404, "invalid ayah number → 404");
  await checkStatus("/quran/nonexistent", 404, "invalid surah slug → 404");
  await checkStatus("/topics/nonexistent", 404, "invalid topic slug → 404");

  await checkStatus(
    "/explore/theme/patience",
    308,
    "theme redirect → 308"
  );

  await checkNoindex("/search");
  await checkNoindex("/explore/root/grace");

  await checkTranslationCompression();

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log("\nFailures:");
    for (const f of failures) {
      console.log(`  - ${f.label}${f.detail ? ` — ${f.detail}` : ""}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
