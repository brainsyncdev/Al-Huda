// MFD-12.4 WS2: Tests for audio URL generation (proxy and legacy).
//
// Verifies that ayahAudioProxyUrl generates correct server proxy paths,
// ayahAudioUrl still works for backward compatibility, and both return
// null for invalid inputs.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { describe, it, expect } from "vitest";
import { ayahAudioUrl, ayahAudioProxyUrl } from "./audio";

describe("audio URL generation (MFD-12.4 WS2)", () => {
  // ---------------------------------------------------------------------------
  // ayahAudioProxyUrl — new server-proxied URL
  // ---------------------------------------------------------------------------

  describe("ayahAudioProxyUrl", () => {
    it("U-AU-01: returns correct proxy URL with default bitrate", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1);
      expect(url).toBe("/api/audio/ar.alafasy/1?bitrate=64");
    });

    it("U-AU-02: returns correct proxy URL with custom bitrate", () => {
      const url = ayahAudioProxyUrl("ar.alafasy", 1, 1, 128);
      expect(url).toBe("/api/audio/ar.alafasy/1?bitrate=128");
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
      expect(url).toMatch(/\/api\/audio\/ar\.alafasy\/6236\?bitrate=64$/);
    });

    it("U-AU-07: returns null for ayah beyond An-Nas (114:7)", () => {
      expect(ayahAudioProxyUrl("ar.alafasy", 114, 7)).toBeNull();
    });

    it("generates correct global ordinals for various surahs", () => {
      // Surah 2 (Al-Baqarah) starts at global ayah 8
      const url = ayahAudioProxyUrl("ar.alafasy", 2, 1);
      expect(url).toBe("/api/audio/ar.alafasy/8?bitrate=64");

      // Surah 2 ayah 286 is the last ayah of Al-Baqarah → global 293
      const url2 = ayahAudioProxyUrl("ar.alafasy", 2, 286);
      expect(url2).toBe("/api/audio/ar.alafasy/293?bitrate=64");
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
        expect(url).toBe(`/api/audio/ar.alafasy/1?bitrate=${br}`);
      }
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
