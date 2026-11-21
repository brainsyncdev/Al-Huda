// MFD-12.3 WS3: Unit tests for client-side translation store fallback handling.
//
// Verifies that the store correctly tracks fallback substitutions via
// isFallback() and getActualEdition(), and that verse lookups resolve
// through the fallback mapping.
//
// Note: These tests mock the fetch API to simulate proxy responses with
// fallback metadata headers.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Import after mocking
import {
  ensureLoaded,
  isFallback,
  getActualEdition,
  getVerse,
  isLoaded,
} from "./translation-store";

describe("translation-store fallback handling (MFD-12.3 WS3)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset module state between tests by clearing caches
    // Note: In a real scenario, we'd need to reset the module-level cache
    // For these tests, we rely on unique edition IDs per test
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getActualEdition", () => {
    it("returns the requested ID when no fallback is active", () => {
      expect(getActualEdition("en.sahih")).toBe("en.sahih");
      expect(getActualEdition("nonexistent.id")).toBe("nonexistent.id");
    });
  });

  describe("isFallback", () => {
    it("returns false for editions without fallback substitution", () => {
      expect(isFallback("en.sahih")).toBe(false);
      expect(isFallback("untested.id")).toBe(false);
    });
  });

  describe("ensureLoaded with fallback metadata", () => {
    it("records fallback mapping when X-Fallback-Requested-Id header is present", async () => {
      const tanzilText = "1|1|In the name of Allah\n1|2|The Most Gracious";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(tanzilText),
        headers: new Headers({
          "X-Translation-Id": "en.sahih",
          "X-Fallback-Requested-Id": "ur.jalandhry",
          "X-Fallback-Reason": "rights-under-review",
        }),
      });

      await ensureLoaded("ur.jalandhry");

      // After loading, the fallback mapping should be recorded
      expect(isFallback("ur.jalandhry")).toBe(true);
      expect(getActualEdition("ur.jalandhry")).toBe("en.sahih");
    });

    it("does not record fallback when headers indicate direct serving", async () => {
      const tanzilText = "1|1|Bismillah";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(tanzilText),
        headers: new Headers({
          "X-Translation-Id": "en.sahih",
          // No X-Fallback-Requested-Id header
        }),
      });

      await ensureLoaded("en.sahih-direct");

      expect(isFallback("en.sahih-direct")).toBe(false);
      expect(getActualEdition("en.sahih-direct")).toBe("en.sahih-direct");
    });

    it("caches under actual edition ID to avoid duplicate storage", async () => {
      const tanzilText = "1|1|Test verse";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(tanzilText),
        headers: new Headers({
          "X-Translation-Id": "en.sahih",
          "X-Fallback-Requested-Id": "gated.edition",
        }),
      });

      await ensureLoaded("gated.edition");

      // The actual edition should be loaded
      expect(isLoaded("gated.edition")).toBe(true);
      // Verse lookup should work through the fallback mapping
      expect(getVerse("gated.edition", 1, 1)).toBe("Test verse");
    });
  });

  describe("verse lookup with fallback", () => {
    it("resolves verses through fallback mapping", async () => {
      const tanzilText = "2|255|Allah - there is no deity except Him";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(tanzilText),
        headers: new Headers({
          "X-Translation-Id": "en.sahih",
          "X-Fallback-Requested-Id": "fallback.verse.test",
        }),
      });

      await ensureLoaded("fallback.verse.test");

      // Direct lookup using requested ID should work
      expect(getVerse("fallback.verse.test", 2, 255)).toBe(
        "Allah - there is no deity except Him"
      );

      // Lookup using actual ID should also work
      expect(getVerse("en.sahih", 2, 255)).toBe(
        "Allah - there is no deity except Him"
      );
    });

    it("returns null for missing verses even with fallback", async () => {
      const tanzilText = "1|1|Only verse one";

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(tanzilText),
        headers: new Headers({
          "X-Translation-Id": "en.sahih",
          "X-Fallback-Requested-Id": "missing.verse.test",
        }),
      });

      await ensureLoaded("missing.verse.test");

      // Existing verse
      expect(getVerse("missing.verse.test", 1, 1)).toBe("Only verse one");
      // Non-existent verse
      expect(getVerse("missing.verse.test", 99, 99)).toBeNull();
    });
  });
});
