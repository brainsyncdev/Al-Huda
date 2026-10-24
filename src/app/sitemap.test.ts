// Unit tests for sitemap generation and SEO invariants.
//
// Verifies that the sitemap:
// 1. Generates URLs exclusively from canonical Quran data.
// 2. Contains no duplicate URLs.
// 3. Uses absolute URLs (not relative paths).
// 4. Excludes noindex routes (e.g., /search).
// 5. Every generated ayah URL maps to a valid canonical surah/ayah reference.
// 6. All 6,236 canonical ayat are covered.

import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import { getSurahIndex } from "@/lib/quran/data";
import { TOPICS } from "@/lib/topics/data";
import { getAllDimensions } from "@/lib/explore/dimensions";
import { SITE_URL } from "@/lib/site";

describe("sitemap", () => {
  it("generates entries for all expected route categories", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);

    // Static routes
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/quran`);
    expect(urls).toContain(`${SITE_URL}/explore`);
    expect(urls).toContain(`${SITE_URL}/topics`);
    expect(urls).toContain(`${SITE_URL}/about`);

    // Surah routes (all 114)
    const index = getSurahIndex();
    expect(index).toHaveLength(114);
    for (const surah of index) {
      expect(urls).toContain(`${SITE_URL}/quran/${surah.slug}`);
    }

    // Topic routes (all 11)
    expect(TOPICS).toHaveLength(11);
    for (const topic of TOPICS) {
      expect(urls).toContain(`${SITE_URL}/topics/${topic.slug}`);
    }

    // Dimension routes (all 10)
    const dimensions = getAllDimensions();
    expect(dimensions).toHaveLength(10);
    for (const dim of dimensions) {
      expect(urls).toContain(`${SITE_URL}/explore/dimension/${dim.id}`);
    }
  });

  it("contains no duplicate URLs", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("all URLs are absolute (start with the site URL)", () => {
    const entries = sitemap();
    for (const entry of entries) {
      expect(entry.url.startsWith(SITE_URL)).toBe(true);
      expect(entry.url).toMatch(/^https?:\/\//);
    }
  });

  it("excludes /search (noindex route)", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).not.toContain(`${SITE_URL}/search`);
  });

  it("excludes authenticated/utility routes", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).not.toContain(`${SITE_URL}/library`);
    expect(urls).not.toContain(`${SITE_URL}/settings`);
    expect(urls).not.toContain(`${SITE_URL}/learn`);
    expect(urls).not.toContain(`${SITE_URL}/editorial`);
    expect(urls).not.toContain(`${SITE_URL}/report`);
  });

  it("does not include the theme redirect route", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    const themeUrls = urls.filter((u) => u.includes("/explore/theme/"));
    expect(themeUrls).toHaveLength(0);
  });

  it("does not include the root-unavailable route", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    const rootUrls = urls.filter((u) => u.includes("/explore/root/"));
    expect(rootUrls).toHaveLength(0);
  });

  it("expected total: 11 static + 114 surahs + 11 topics + 10 dimensions + 6236 ayahs = 6382", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(6382);
  });

  it("every ayah URL maps to a valid surah/ayah reference", () => {
    const index = getSurahIndex();
    const entries = sitemap();
    const ayahEntries = entries.filter((e) => e.url.includes("/ayah/"));

    expect(ayahEntries).toHaveLength(6236);

    for (const entry of ayahEntries) {
      const match = entry.url.match(/\/ayah\/(\d+)\/(\d+)$/);
      expect(match, `URL ${entry.url} did not match ayah pattern`).not.toBeNull();
      const surahId = Number(match![1]);
      const ayahNum = Number(match![2]);

      const surah = index.find((s) => s.id === surahId);
      expect(surah, `Surah ${surahId} not found for URL ${entry.url}`).toBeDefined();
      expect(ayahNum).toBeGreaterThanOrEqual(1);
      expect(ayahNum).toBeLessThanOrEqual(surah!.ayahCount);
    }
  });

  it("first ayah entry is 1:1 and last is 114:6", () => {
    const entries = sitemap();
    const ayahEntries = entries.filter((e) => e.url.includes("/ayah/"));

    expect(ayahEntries[0].url).toBe(`${SITE_URL}/ayah/1/1`);
    expect(ayahEntries[ayahEntries.length - 1].url).toBe(`${SITE_URL}/ayah/114/6`);
  });

  it("ayah URLs use priority 0.4 (lower than surah/topic pages)", () => {
    const entries = sitemap();
    const ayahEntries = entries.filter((e) => e.url.includes("/ayah/"));
    for (const entry of ayahEntries) {
      expect(entry.priority).toBe(0.4);
    }
  });

  it("surah URLs use priority 0.6", () => {
    const entries = sitemap();
    const surahEntries = entries.filter(
      (e) => e.url.includes("/quran/") && !e.url.endsWith("/quran")
    );
    for (const entry of surahEntries) {
      expect(entry.priority).toBe(0.6);
    }
  });
});
