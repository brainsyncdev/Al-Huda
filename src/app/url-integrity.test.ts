// Regression tests for production URL integrity.
//
// These tests ensure that:
// 1. Sitemap URLs and robots.txt sitemap reference share a single origin.
// 2. No accidental localhost URLs leak when a production origin is configured.
// 3. The absoluteUrl() helper produces consistent, well-formed URLs.
// 4. The robots.txt sitemap reference matches the sitemap's origin.

import { describe, expect, it, vi, afterEach } from "vitest";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import sitemap from "./sitemap";

describe("URL integrity", () => {
  describe("absoluteUrl helper", () => {
    it("produces absolute URLs with http or https scheme", () => {
      const url = absoluteUrl("/quran");
      expect(url).toMatch(/^https?:\/\//);
    });

    it("does not produce double slashes in path", () => {
      const url = absoluteUrl("/quran/al-baqarah");
      // After the scheme, there should be no double slashes
      const afterScheme = url.replace(/^https?:\/\//, "");
      expect(afterScheme).not.toContain("//");
    });

    it("handles paths with and without leading slash", () => {
      const withSlash = absoluteUrl("/quran");
      const withoutSlash = absoluteUrl("quran");
      // Both should produce valid absolute URLs
      expect(withSlash).toMatch(/^https?:\/\//);
      expect(withoutSlash).toMatch(/^https?:\/\//);
    });

    it("uses the configured SITE_URL as base", () => {
      const url = absoluteUrl("/test");
      expect(url.startsWith(SITE_URL)).toBe(true);
    });
  });

  describe("sitemap URL consistency", () => {
    it("all sitemap URLs share the same origin as SITE_URL", () => {
      const entries = sitemap();
      const siteOrigin = new URL(SITE_URL).origin;
      for (const entry of entries) {
        const entryOrigin = new URL(entry.url).origin;
        expect(entryOrigin).toBe(siteOrigin);
      }
    });

    it("sitemap contains no empty or malformed URLs", () => {
      const entries = sitemap();
      for (const entry of entries) {
        expect(entry.url).toBeTruthy();
        expect(() => new URL(entry.url)).not.toThrow();
      }
    });

    it("no sitemap URL contains literal 'localhost' when SITE_URL is non-localhost", () => {
      // This test protects against accidentally shipping a build where
      // SITE_URL points to a production domain but some URLs still use localhost.
      const siteOrigin = new URL(SITE_URL).origin;
      const isProduction = !siteOrigin.includes("localhost");

      if (isProduction) {
        const entries = sitemap();
        for (const entry of entries) {
          expect(entry.url).not.toContain("localhost");
        }
      }
    });

    it("no sitemap URL contains port 3000 when SITE_URL is non-localhost", () => {
      const siteOrigin = new URL(SITE_URL).origin;
      const isProduction = !siteOrigin.includes("localhost");

      if (isProduction) {
        const entries = sitemap();
        for (const entry of entries) {
          expect(entry.url).not.toMatch(/:3000\//);
        }
      }
    });
  });

  describe("robots.txt integrity", () => {
    // Import dynamically to get the runtime result
    it("robots sitemap URL matches SITE_URL origin", async () => {
      const robots = await import("./robots").then((m) => m.default());
      const siteOrigin = new URL(SITE_URL).origin;
      const sitemapUrl = Array.isArray(robots.sitemap)
        ? robots.sitemap[0]
        : robots.sitemap;
      expect(sitemapUrl).toBeTruthy();
      const sitemapOrigin = new URL(sitemapUrl as string).origin;
      expect(sitemapOrigin).toBe(siteOrigin);
    });

    it("robots sitemap URL points to /sitemap.xml", async () => {
      const robots = await import("./robots").then((m) => m.default());
      const sitemapUrl = Array.isArray(robots.sitemap)
        ? robots.sitemap[0]
        : robots.sitemap;
      expect(sitemapUrl as string).toMatch(/\/sitemap\.xml$/);
    });

    it("robots disallow list covers private routes", async () => {
      const robots = await import("./robots").then((m) => m.default());
      const rules = robots.rules;
      expect(rules).toBeTruthy();
      const disallow = Array.isArray(rules) ? rules[0]?.disallow : rules?.disallow;
      expect(disallow).toContain("/library");
      expect(disallow).toContain("/settings");
      expect(disallow).toContain("/learn");
      expect(disallow).toContain("/editorial");
      expect(disallow).toContain("/report");
    });
  });
});
