// MFD-12.4 WS2: Unit tests for audio rights gate logic.
//
// Verifies default-deny behavior, env var controls, per-reciter gating,
// dual-rights metadata, and bypass prevention.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to re-import modules after changing env vars, so use dynamic imports
// and vi.resetModules() between tests.

describe("audio-rights gate (MFD-12.4 WS2)", () => {
  const originalEnforcement = process.env.AUDIO_RIGHTS_ENFORCEMENT;
  const originalCleared = process.env.CLEARED_RECITERS;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    if (originalEnforcement === undefined) {
      delete process.env.AUDIO_RIGHTS_ENFORCEMENT;
    } else {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = originalEnforcement;
    }
    if (originalCleared === undefined) {
      delete process.env.CLEARED_RECITERS;
    } else {
      process.env.CLEARED_RECITERS = originalCleared;
    }
  });

  // ---------------------------------------------------------------------------
  // U-AR-01 to U-AR-03: isAudioEnforcementEnabled()
  // ---------------------------------------------------------------------------

  describe("isAudioEnforcementEnabled", () => {
    it("U-AR-01: returns false when env is unset", async () => {
      delete process.env.AUDIO_RIGHTS_ENFORCEMENT;
      const { isAudioEnforcementEnabled } = await import("./audio-rights");
      expect(isAudioEnforcementEnabled()).toBe(false);
    });

    it('U-AR-02: returns false when env is "false"', async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "false";
      const { isAudioEnforcementEnabled } = await import("./audio-rights");
      expect(isAudioEnforcementEnabled()).toBe(false);
    });

    it('U-AR-03: returns true when env is "true"', async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      const { isAudioEnforcementEnabled } = await import("./audio-rights");
      expect(isAudioEnforcementEnabled()).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // U-AR-04 to U-AR-07: isReciterGated()
  // ---------------------------------------------------------------------------

  describe("isReciterGated", () => {
    it("U-AR-04: returns false for any reciter when enforcement is off", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "false";
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("ar.alafasy")).toBe(false);
      expect(isReciterGated("ar.husary")).toBe(false);
      expect(isReciterGated("ar.minshawi")).toBe(false);
    });

    it("U-AR-05: returns true for all reciters when enforcement is on and none cleared", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      delete process.env.CLEARED_RECITERS;
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("ar.alafasy")).toBe(true);
      expect(isReciterGated("ar.husary")).toBe(true);
      expect(isReciterGated("ar.sudais")).toBe(true);
    });

    it("U-AR-06: returns false for reciters in CLEARED_RECITERS when enforcement is on", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy,ar.husary";
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("ar.alafasy")).toBe(false);
      expect(isReciterGated("ar.husary")).toBe(false);
      // Others remain gated
      expect(isReciterGated("ar.minshawi")).toBe(true);
      expect(isReciterGated("ar.sudais")).toBe(true);
    });

    it("U-AR-07: returns true for unknown/invalid reciter IDs when enforcement is on", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("invalid.reciter")).toBe(true);
      expect(isReciterGated("")).toBe(true);
      expect(isReciterGated("../etc/passwd")).toBe(true);
    });

    it("handles whitespace in CLEARED_RECITERS gracefully", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = " ar.alafasy , ar.husary ";
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("ar.alafasy")).toBe(false);
      expect(isReciterGated("ar.husary")).toBe(false);
    });

    it("ignores empty CLEARED_RECITERS value", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "";
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("ar.alafasy")).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // U-AR-08 to U-AR-09: getReciterRights()
  // ---------------------------------------------------------------------------

  describe("getReciterRights", () => {
    it("U-AR-08: returns valid ReciterRightsMetadata for known reciter", async () => {
      const { getReciterRights } = await import("./audio-rights");
      const rights = getReciterRights("ar.alafasy");
      expect(rights).not.toBeNull();
      expect(rights!.reciterId).toBe("ar.alafasy");
      expect(rights!.status).toBe("under-review");
      expect(rights!.distributionRightsStatus).toBe("unverified");
      expect(rights!.performerRightsStatus).toBe("unknown");
      expect(rights!.moralRightsAcknowledged).toBe(false);
      expect(rights!.commercialUseAllowed).toBe(false);
      expect(rights!.performerIdentity.name).toBe("Mishary Rashid Alafasy");
    });

    it("U-AR-09: returns null for nonexistent reciter", async () => {
      const { getReciterRights } = await import("./audio-rights");
      expect(getReciterRights("nonexistent")).toBeNull();
      expect(getReciterRights("")).toBeNull();
    });

    it("returns metadata for all 12 reciters", async () => {
      const { getReciterRights } = await import("./audio-rights");
      const { RECITERS } = await import("./audio");
      for (const reciter of RECITERS) {
        const rights = getReciterRights(reciter.id);
        expect(rights).not.toBeNull();
        expect(rights!.reciterId).toBe(reciter.id);
      }
    });
  });

  // ---------------------------------------------------------------------------
  // buildAudioGatedResponse
  // ---------------------------------------------------------------------------

  describe("buildAudioGatedResponse", () => {
    it("returns structured response with correct fields", async () => {
      const { buildAudioGatedResponse } = await import("./audio-rights");
      const response = buildAudioGatedResponse("ar.alafasy", 64, 1);
      expect(response.gated).toBe(true);
      expect(response.reason).toBe("rights-under-review");
      expect(response.reciterId).toBe("ar.alafasy");
      expect(response.externalUrl).toContain("cdn.islamic.network");
      expect(response.externalUrl).toContain("ar.alafasy");
      expect(response.message).toContain("Mishary Rashid Alafasy");
    });

    it("includes correct bitrate and global ayah in external URL", async () => {
      const { buildAudioGatedResponse } = await import("./audio-rights");
      const response = buildAudioGatedResponse("ar.husary", 128, 100);
      expect(response.externalUrl).toBe(
        "https://cdn.islamic.network/quran/audio/128/ar.husary/100.mp3"
      );
    });

    it("falls back to reciter ID when reciter not in catalog", async () => {
      const { buildAudioGatedResponse } = await import("./audio-rights");
      const response = buildAudioGatedResponse("unknown.reciter", 64, 1);
      expect(response.reciterId).toBe("unknown.reciter");
      expect(response.message).toContain("unknown.reciter");
    });
  });

  // ---------------------------------------------------------------------------
  // filterGatedReciters
  // ---------------------------------------------------------------------------

  describe("filterGatedReciters", () => {
    it("returns all reciters when enforcement is off", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "false";
      const { filterGatedReciters } = await import("./audio-rights");
      const ids = ["ar.alafasy", "ar.husary", "ar.minshawi"];
      expect(filterGatedReciters(ids)).toEqual(ids);
    });

    it("filters out gated reciters when enforcement is on", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy";
      const { filterGatedReciters } = await import("./audio-rights");
      const ids = ["ar.alafasy", "ar.husary", "ar.minshawi"];
      expect(filterGatedReciters(ids)).toEqual(["ar.alafasy"]);
    });
  });

  // ---------------------------------------------------------------------------
  // isReciterFullyVerified (dual-rights check)
  // ---------------------------------------------------------------------------

  describe("isReciterFullyVerified", () => {
    it("returns false for all reciters in default state (both rights unverified)", async () => {
      const { isReciterFullyVerified } = await import("./audio-rights");
      const { RECITERS } = await import("./audio");
      for (const reciter of RECITERS) {
        expect(isReciterFullyVerified(reciter.id)).toBe(false);
      }
    });

    it("returns false for unknown reciter", async () => {
      const { isReciterFullyVerified } = await import("./audio-rights");
      expect(isReciterFullyVerified("nonexistent")).toBe(false);
    });
  });
});
