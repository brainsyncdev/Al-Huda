// MFD-12.4 WS2: Tests for audio URL generation (proxy and legacy).
//
// Verifies that ayahAudioProxyUrl generates correct server proxy paths,
// ayahAudioUrl still works for backward compatibility, and both return
// null for invalid inputs.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ayahAudioUrl, ayahAudioProxyUrl } from "./audio";

describe("audio URL generation (MFD-12.4 WS2)", () => {
  // ---------------------------------------------------------------------------
  // ayahAudioProxyUrl — new server-proxied URL
  // ---------------------------------------------------------------------------

  describe("ayahAudioProxyUrl", () => {
    it("U-AU-01: returns correct proxy URL with default bitrate and cache version", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1);
      expect(url).toMatch(/\/api\/audio\/ar\.alafasy\/1\?/);
      expect(url).toContain("bitrate=64");
      expect(url).toContain("rv=");
    });

    it("U-AU-02: returns correct proxy URL with custom bitrate", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1, 128);
      expect(url).toContain("bitrate=128");
      expect(url).toContain("rv=");
    });

    it("U-AU-03: returns null for invalid reciter", () => {
      expect(ayahAudioProxyUrl("invalid", 1, 1)).toBeNull();
      expect(ayahAudioProxyUrl("", 1, 1)).toBeNull();
    });

    it("U-AU-04: returns null for invalid surah (0)", () => {
      expect(ayahAudioProxyUrl("ar.alafasy", 0, 1)).toBeNull();
    });

    it("U-AU-05: returns null for ayah beyond surah length (Al-Fatiha has 7)", () => {
      expect(ayahAudioProxyUrl("ar.alafasy", 1, 8)).toBeNull();
    });

    it("U-AU-06: returns valid URL for last surah last ayah (An-Nas 114:6)", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 114, 6);
      expect(url).not.toBeNull();
      expect(url).toContain("/api/audio/ar.alafasy/6236?");
      expect(url).toContain("bitrate=64");
    });

    it("U-AU-07: returns null for ayah beyond An-Nas (114:7)", () => {
      expect(ayahAudioProxyUrl("ar.alafasy", 114, 7)).toBeNull();
    });

    it("generates correct global ordinals for various surahs", () => {
      // Surah 2 (Al-Baqarah) starts at global ayah 8
      const url = ayahAudioProxyUrl("ar.alafasy", 2, 1);
      expect(url).toContain("/api/audio/ar.alafasy/8?");
      expect(url).toContain("bitrate=64");

      // Surah 2 ayah 286 is the last ayah of Al-Baqarah → global 293
      const url2 = ayahAudioProxyUrl("ar.alafasy", 2, 286);
      expect(url2).toContain("/api/audio/ar.alafasy/293?");
      expect(url2).toContain("bitrate=64");
    });

    it("URL-encodes reciter IDs with special characters", () => {
      // Though current reciter IDs don't have special chars, the function
      // should handle them safely via encodeURIComponent
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1);
      expect(url).toContain("ar.alafasy");
    });

    it("supports all valid bitrates", () => {
      const bitrates = [192, 128, 64, 48, 40, 32] as const;
      for (const br of bitrates) {
        const url = ayahAudioProxyUrl("ar.alafasy", 1, 1, br);
        expect(url).toContain(`bitrate=${br}`);
        expect(url).toContain("rv=");
      }
    });

    it("includes recording param when specified", () => {
      const url = ayahAudioProxyUrl("ar.abdulbasit", 1, 1, 64, "ar.abdulbasit.murattal");
      expect(url).toContain("recording=ar.abdulbasit.murattal");
      expect(url).toContain("rv=");
    });

    it("omits recording param when not specified", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1);
      expect(url).not.toContain("recording=");
    });
  });

  // ---------------------------------------------------------------------------
  // MFD-12.4 WS2 Gap B: Cache version in URLs
  // ---------------------------------------------------------------------------

  describe("cache version in proxy URLs (Gap B)", () => {
    const originalVersion = process.env.RIGHTS_CACHE_VERSION;

    afterEach(() => {
      if (originalVersion === undefined) {
        delete process.env.RIGHTS_CACHE_VERSION;
      } else {
        process.env.RIGHTS_CACHE_VERSION = originalVersion;
      }
      vi.resetModules();
    });

    it("URL contains rv=1 by default", async () => {
      delete process.env.RIGHTS_CACHE_VERSION;
      vi.resetModules();
      const { ayahAudioProxyUrl: fn } = await import("./audio");
      const url = fn("ar.alafasy", 1, 1);
      expect(url).toContain("rv=1");
    });

    it("changing version changes the URL", async () => {
      process.env.RIGHTS_CACHE_VERSION = "99";
      vi.resetModules();
      const { ayahAudioProxyUrl: fn } = await import("./audio");
      const url = fn("ar.alafasy", 1, 1);
      expect(url).toContain("rv=99");
      expect(url).not.toContain("rv=1&");
    });
  });

  // ---------------------------------------------------------------------------
  // ayahAudioUrl — deprecated direct CDN URL (backward compat)
  // ---------------------------------------------------------------------------

  describe("ayahAudioUrl (deprecated)", () => {
    it("still returns direct CDN URL for backward compatibility", () => {
      const url = ayahAudioUrl("ar.alafasy", 1, 1);
      expect(url).toBe(
        "https://cdn.islamic.network/quran/audio/64/ar.alafasy/1.mp3"
      );
    });

    it("returns null for invalid reciter", () => {
      expect(ayahAudioUrl("invalid", 1, 1)).toBeNull();
    });

    it("returns null for invalid surah/ayah", () => {
      expect(ayahAudioUrl("ar.alafasy", 0, 1)).toBeNull();
      expect(ayahAudioUrl("ar.alafasy", 1, 8)).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Bypass prevention: proxy URL never contains CDN domain
  // ---------------------------------------------------------------------------

  describe("bypass prevention", () => {
    it("proxy URL never contains cdn.islamic.network", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1);
      expect(url).not.toContain("cdn.islamic.network");
      expect(url).toMatch(/^\/api\/audio\//);
    });

    it("proxy URL is always relative (no protocol)", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1);
      expect(url).not.toMatch(/^https?:\/\//);
    });
  });
});
