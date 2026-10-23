// Site-wide constants and URL helpers.

export const SITE_NAME = "Al-Huda";
export const SITE_TAGLINE = "Read, understand, and connect the Quran";
export const SITE_DESCRIPTION =
  "Al-Huda is a calm, source-first Quran reading hub: the full Uthmani text with translations in 100+ languages (default: Urdu — Jalandhry), stable ayah references, search, and curated topic entry points. No clutter, no streaks — just the Book and its sources.";

/** Absolute base URL. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Build an absolute URL for canonical links, OG tags, and sitemaps. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
