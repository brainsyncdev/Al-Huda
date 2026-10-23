// Shared plumbing for the public read-only API (PRD §14).
//
// This module is deliberately FREE of any node:fs dependency — it imports only
// the pure source catalog. The dataset loader (@/lib/quran/data) is pulled in
// by the route handlers themselves, so this file stays importable from client
// code if a consumer ever needs the response types.
//
// Constraints taken verbatim from §14 "API requirements", and how each is met:
//   * Explicit versioning ......... every route lives under /api/v1 and every
//                                   success payload carries `version`.
//   * Consistent error format ..... apiError() is the only error constructor.
//   * Input validation, bounded ... boundedInt() rejects anything non-numeric
//                                   or out of range before a loader call; the
//                                   search query is length-capped.
//   * Pagination .................. list endpoints take limit/offset and
//                                   report `truncated` rather than inventing a
//                                   total the scan cap cannot know.
//   * No sensitive personal data .. user state is localStorage-only and has no
//                                   server representation, so there is nothing
//                                   here to expose. Library endpoints are
//                                   intentionally absent from this surface.
//   * Rate limits ................. checkRateLimit(), best-effort and
//                                   per-process; see its doc comment for what
//                                   it does and does not protect against.

import { NextResponse } from "next/server";
import type { Ayah, RevelationType, SurahMeta } from "@/lib/quran/types";
import { getSource } from "@/lib/quran/sources";

export const API_VERSION = "v1";

// ---------------------------------------------------------------------------
// Provenance
// ---------------------------------------------------------------------------

const PKG = getSource("quran-json");

/** Label for the pinned content package, derived so it cannot drift from the
 *  source catalog rendered on /sources. */
export const DATASET_PACKAGE = PKG ? `${PKG.id}@${PKG.version}` : "quran-json (version unavailable)";

/**
 * Edition/version block attached to every verse payload (§9 Ayah entity:
 * "stable reference, Surah number, ayah number, Arabic text, text
 * edition/version"). Text is never transformed between the dataset and this
 * response, so the dataset's own edition is the correct attribution.
 */
export const EDITION = Object.freeze({
  datasetPackage: DATASET_PACKAGE,
  arabic: `Uthmani script, chapter metadata via quranenc.com, distributed by ${DATASET_PACKAGE}`,
  translation: `Built-in English: Saheeh International. Active translation is user-selectable (100+ editions via Tanzil.net). Dataset distributed by ${DATASET_PACKAGE}`,
  transliteration: `Tanzil transliteration, distributed by ${DATASET_PACKAGE}`,
  license: PKG?.license ?? "unspecified",
  licenseUrl: PKG?.licenseUrl ?? null,
});

/** Compact provenance for envelope-level use. */
export function contentProvenance() {
  const arabic = getSource("quranenc");
  const translation = getSource("tanzil-sahih");
  const transliteration = getSource("tanzil-translit");
  return {
    datasetPackage: DATASET_PACKAGE,
    arabicText: arabic ? `${arabic.attribution} — ${arabic.license}` : null,
    translation: translation ? `${translation.attribution} — ${translation.license}` : null,
    transliteration: transliteration ? `${transliteration.attribution} — ${transliteration.license}` : null,
    sourceCatalog: "/sources",
    apiIndex: "/api/v1",
  };
}

// ---------------------------------------------------------------------------
// Response envelopes
// ---------------------------------------------------------------------------

const BASE_HEADERS: Record<string, string> = {
  // The dataset is pinned, so public content is cacheable. A short freshness
  // window keeps a deploy from serving stale shapes for long.
  "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
  "X-Content-Type-Options": "nosniff",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  Vary: "Accept-Encoding",
};

function withBaseHeaders(res: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(BASE_HEADERS)) {
    if (!res.headers.has(key)) res.headers.set(key, value);
  }
  return res;
}

/** The single success constructor: { version, meta?, data }. */
export function apiOk<T>(data: T, meta?: Record<string, unknown>): NextResponse {
  return withBaseHeaders(
    NextResponse.json({
      version: API_VERSION,
      ...(meta ? { meta } : {}),
      data,
    })
  );
}

/** The single error constructor: { error: { code, message, hint? } }. */
export function apiError(
  code: string,
  message: string,
  status: number,
  hint?: string
): NextResponse {
  return withBaseHeaders(
    NextResponse.json(
      { error: { code, message, ...(hint ? { hint } : {}) } },
      { status }
    )
  );
}

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQUESTS = 120;
const RATE_MAX_TRACKED_KEYS = 4_000;

type Bucket = { count: number; resetAt: number };

const rateStore = (
  globalThis as unknown as { __alhudaApiRate?: Map<string, Bucket> }
).__alhudaApiRate ?? new Map<string, Bucket>();
(
  globalThis as unknown as { __alhudaApiRate?: Map<string, Bucket> }
).__alhudaApiRate = rateStore;

function bucketKey(request: Request): string {
  return (request.headers.get("x-forwarded-for")?.split(",")[0] ?? "").trim() || "anonymous";
}

/**
 * Best-effort in-process request bucket.
 *
 * WHAT IT IS: a fairness brake, so one client cannot trivially drive unbounded
 * full-corpus scans against a single server process.
 *
 * WHAT IT IS NOT: a security control. The key comes from `x-forwarded-for`,
 * which is client-supplied and therefore spoofable, and the bucket lives in
 * process memory — it resets on deploy and does not coordinate across
 * instances. Genuine enforcement belongs at the CDN/edge or in a durable
 * store. That is a deployment requirement, recorded here and in the service
 * index response, not something this function solves.
 *
 * Returns a 429 response when over budget, otherwise null.
 */
export function checkRateLimit(request: Request): NextResponse | null {
  const key = bucketKey(request);
  const now = Date.now();

  let bucket = rateStore.get(key);
  if (!bucket || bucket.resetAt <= now) {
    // Sweep expired entries before inserting, and hard-cap the map, so a
    // spoofed-header flood cannot grow it without bound.
    if (rateStore.size >= RATE_MAX_TRACKED_KEYS) {
      for (const [k, b] of rateStore) {
        if (b.resetAt <= now) rateStore.delete(k);
      }
      if (rateStore.size >= RATE_MAX_TRACKED_KEYS) rateStore.clear();
    }
    bucket = { count: 0, resetAt: now + RATE_WINDOW_MS };
    rateStore.set(key, bucket);
  }

  bucket.count += 1;

  if (bucket.count > RATE_MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    const res = apiError(
      "rate_limited",
      "Too many requests in this minute.",
      429,
      "Budget is per server process and keyed on a client-supplied header; it is a fairness brake, not a security control."
    );
    res.headers.set("Retry-After", String(retryAfter));
    res.headers.set("X-RateLimit-Limit", String(RATE_MAX_REQUESTS));
    res.headers.set("X-RateLimit-Remaining", "0");
    res.headers.set("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));
    return res;
  }

  return null;
}

/**
 * Wraps a handler with rate limiting, rate headers, and a catch-all that never
 * leaks loader internals or stack traces to a public endpoint.
 */
export async function guarded(
  request: Request,
  fn: () => NextResponse | Promise<NextResponse>
): Promise<NextResponse> {
  const denied = checkRateLimit(request);
  if (denied) return denied;

  try {
    const res = await fn();
    if (!res.headers.has("X-RateLimit-Limit")) {
      const bucket = rateStore.get(bucketKey(request));
      res.headers.set("X-RateLimit-Limit", String(RATE_MAX_REQUESTS));
      res.headers.set(
        "X-RateLimit-Remaining",
        String(Math.max(0, RATE_MAX_REQUESTS - (bucket?.count ?? 0)))
      );
      if (bucket) {
        res.headers.set("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));
      }
    }
    return res;
  } catch (error) {
    // Server-side log only; the public body stays generic.
    console.error("[api/v1] unhandled error", error);
    return apiError("internal_error", "The request could not be completed.", 500);
  }
}

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

/**
 * Parse a non-negative integer within [min, max] from an untrusted string.
 * Returns null for anything absent, non-numeric, or out of range — callers
 * translate null into a 400 rather than proceeding.
 */
export function boundedInt(
  raw: string | null | undefined,
  min: number,
  max: number
): number | null {
  if (raw === null || raw === undefined) return null;
  const trimmed = raw.trim();
  if (!/^\d{1,6}$/.test(trimmed)) return null;
  const n = Number(trimmed);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export function invalidSurahError(received?: string): NextResponse {
  return apiError(
    "invalid_surah",
    "surahNumber must be an integer between 1 and 114.",
    400,
    received === undefined ? undefined : `Received ${JSON.stringify(received)}.`
  );
}

export function invalidAyahError(received?: string): NextResponse {
  return apiError(
    "invalid_ayah",
    "ayahNumber must be a positive integer within the surah's verse count.",
    400,
    received === undefined ? undefined : `Received ${JSON.stringify(received)}.`
  );
}

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

export interface ApiSurahMeta {
  number: number;
  slug: string;
  arabicName: string;
  transliteration: string;
  englishMeaning: string;
  revelation: RevelationType;
  verseCount: number;
}

export function toApiSurahMeta(meta: SurahMeta): ApiSurahMeta {
  return {
    number: meta.id,
    slug: meta.slug,
    arabicName: meta.arabicName,
    transliteration: meta.transliteration,
    englishMeaning: meta.meaning,
    revelation: meta.revelation,
    verseCount: meta.ayahCount,
  };
}

export interface ApiAyah {
  /** Canonical stable reference, e.g. "2:255". */
  reference: string;
  surah: number;
  ayah: number;
  arabic: string;
  translation: string;
  transliteration: string;
  /** Canonical Hafs juz number, or null when unresolvable. */
  juz: number | null;
  edition: typeof EDITION;
}

export function toApiAyah(ayah: Ayah, juz: number | null): ApiAyah {
  return {
    reference: `${ayah.surah}:${ayah.ayah}`,
    surah: ayah.surah,
    ayah: ayah.ayah,
    arabic: ayah.arabic,
    translation: ayah.translation,
    transliteration: ayah.transliteration,
    juz,
    edition: EDITION,
  };
}