// MFD-12.3 WS3: Unit tests for translation fallback resolution logic.
//
// Verifies that resolveFallbackEdition correctly identifies permitted
// fallbacks when a requested edition is gated, and returns null when
// enforcement is disabled or the edition is not gated.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { resolveFallbackEdition, isEditionGated } from "./rights-gate";

describe("rights-gate fallback resolution (MFD-12.3 WS3)", () => {
  const originalEnv = process.env.TANZIL_RIGHTS_ENFORCEMENT;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.TANZIL_RIGHTS_ENFORCEMENT;
    } else {
      process.env.TANZIL_RIGHTS_ENFORCEMENT = originalEnv;
    }
  });

  describe("when TANZIL_RIGHTS_ENFORCEMENT is false", () => {
    beforeEach(() => {
      process.env.TANZIL_RIGHTS_ENFORCEMENT = "false";
    });

    it("returns null for any edition (no fallback needed)", () => {
      expect(resolveFallbackEdition("ur.jalandhry")).toBeNull();
      expect(resolveFallbackEdition("en.sahih")).toBeNull();
      expect(resolveFallbackEdition("ar.jalalayn")).toBeNull();
    });

    it("does not gate any edition", () => {
      expect(isEditionGated("ur.jalandhry")).toBe(false);
      expect(isEditionGated("en.sahih")).toBe(false);
    });
  });

  describe("when TANZIL_RIGHTS_ENFORCEMENT is true", () => {
    beforeEach(() => {
      process.env.TANZIL_RIGHTS_ENFORCEMENT = "true";
    });

    it("returns en.sahih as fallback for gated ur.jalandhry", () => {
      // ur.jalandhry is non-bundled, so it should be gated
      expect(isEditionGated("ur.jalandhry")).toBe(true);
      // Fallback should resolve to en.sahih (first in chain, bundled)
      expect(resolveFallbackEdition("ur.jalandhry")).toBe("en.sahih");
    });

    it("returns null for non-gated bundled editions", () => {
      // en.sahih is bundled and never gated
      expect(isEditionGated("en.sahih")).toBe(false);
      expect(resolveFallbackEdition("en.sahih")).toBeNull();
    });

    it("returns null for en.transliteration (bundled, not gated)", () => {
      expect(isEditionGated("en.transliteration")).toBe(false);
      expect(resolveFallbackEdition("en.transliteration")).toBeNull();
    });

    it("returns en.sahih for other gated non-bundled editions", () => {
      // All non-bundled editions are gated when enforcement is on
      expect(resolveFallbackEdition("fr.hamidullah")).toBe("en.sahih");
      expect(resolveFallbackEdition("de.bubenheim")).toBe("en.sahih");
      expect(resolveFallbackEdition("tr.diyanet")).toBe("en.sahih");
    });

    it("preserves fallback chain priority (en.sahih before en.transliteration)", () => {
      // The first available fallback should always be en.sahih
      const fallback = resolveFallbackEdition("ur.maududi");
      expect(fallback).toBe("en.sahih");
    });
  });

  describe("edge cases", () => {
    it("handles empty string gracefully", () => {
      process.env.TANZIL_RIGHTS_ENFORCEMENT = "true";
      // Empty string is not in BUNDLED_EDITIONS, so it's gated
      // But resolveFallbackEdition should still return a valid fallback
      const result = resolveFallbackEdition("");
      expect(result).toBe("en.sahih");
    });

    it("handles unknown edition IDs", () => {
      process.env.TANZIL_RIGHTS_ENFORCEMENT = "true";
      // Unknown IDs are treated as non-bundled and thus gated
      const result = resolveFallbackEdition("unknown.edition");
      expect(result).toBe("en.sahih");
    });
  });
});
