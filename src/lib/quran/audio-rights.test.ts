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

    it("U-AR-06: gates reciters in CLEARED_RECITERS when no recording is cleared (Gap A)", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy,ar.husary";
      const { isReciterGated } = await import("./audio-rights");
      // MFD-12.4 WS2 Gap A: being in CLEARED_RECITERS is necessary but NOT sufficient.
      // Default recordings are unverified, so reciter remains gated.
      expect(isReciterGated("ar.alafasy")).toBe(true);
      expect(isReciterGated("ar.husary")).toBe(true);
      // Others not in CLEARED_RECITERS are also gated
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
      // Whitespace is trimmed correctly; reciters are recognized.
      // But default recordings are unverified → still gated (Gap A).
      expect(isReciterGated("ar.alafasy")).toBe(true);
      expect(isReciterGated("ar.husary")).toBe(true);
      // A reciter NOT in the list is also gated
      expect(isReciterGated("ar.minshawi")).toBe(true);
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
      // MFD-12.4 WS2 Gap A: recordings array must exist with at least one entry
      expect(rights!.recordings).toBeDefined();
      expect(rights!.recordings.length).toBeGreaterThanOrEqual(1);
      expect(rights!.recordings[0].recordingId).toBe("ar.alafasy");
      expect(rights!.recordings[0].reciterId).toBe("ar.alafasy");
      expect(rights!.recordings[0].recordingStyle).toBe("unspecified");
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

    it("filters out all reciters when enforcement is on and no recordings cleared", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy";
      const { filterGatedReciters } = await import("./audio-rights");
      const ids = ["ar.alafasy", "ar.husary", "ar.minshawi"];
      // Gap A: even ar.alafasy is gated because its default recording is unverified
      expect(filterGatedReciters(ids)).toEqual([]);
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

  // ---------------------------------------------------------------------------
  // MFD-12.4 WS2 Gap A: Per-recording rights metadata
  // ---------------------------------------------------------------------------

  describe("per-recording metadata (Gap A)", () => {
    it("every reciter has at least one default recording entry", async () => {
      const { getReciterRights } = await import("./audio-rights");
      const { RECITERS } = await import("./audio");
      for (const reciter of RECITERS) {
        const rights = getReciterRights(reciter.id);
        expect(rights).not.toBeNull();
        expect(rights!.recordings.length).toBeGreaterThanOrEqual(1);
        expect(rights!.recordings[0].recordingId).toBe(reciter.id);
        expect(rights!.recordings[0].reciterId).toBe(reciter.id);
      }
    });

    it("ar.abdulbasit has recordingStyle 'murattal'", async () => {
      const { getReciterRights } = await import("./audio-rights");
      const rights = getReciterRights("ar.abdulbasit");
      expect(rights).not.toBeNull();
      expect(rights!.recordings[0].recordingStyle).toBe("murattal");
    });

    it("other reciters have recordingStyle 'unspecified'", async () => {
      const { getReciterRights } = await import("./audio-rights");
      const nonAbdulBasit = ["ar.alafasy", "ar.husary", "ar.sudais"];
      for (const id of nonAbdulBasit) {
        const rights = getReciterRights(id);
        expect(rights!.recordings[0].recordingStyle).toBe("unspecified");
      }
    });

    it("all default recordings are in unverified state", async () => {
      const { getReciterRights } = await import("./audio-rights");
      const { RECITERS } = await import("./audio");
      for (const reciter of RECITERS) {
        const rights = getReciterRights(reciter.id)!;
        for (const rec of rights.recordings) {
          expect(rec.distributionRightsStatus).toBe("unverified");
          expect(rec.performerRightsStatus).toBe("unknown");
          expect(rec.withdrawnAt).toBeUndefined();
        }
      }
    });
  });

  // ---------------------------------------------------------------------------
  // MFD-12.4 WS2 Gap A: getRecordingRights / isRecordingGated
  // ---------------------------------------------------------------------------

  describe("getRecordingRights", () => {
    it("returns recording metadata for known reciter+recording", async () => {
      const { getRecordingRights } = await import("./audio-rights");
      const rec = getRecordingRights("ar.alafasy", "ar.alafasy");
      expect(rec).not.toBeNull();
      expect(rec!.recordingId).toBe("ar.alafasy");
      expect(rec!.reciterId).toBe("ar.alafasy");
    });

    it("returns null for unknown reciter", async () => {
      const { getRecordingRights } = await import("./audio-rights");
      expect(getRecordingRights("nonexistent", "nonexistent")).toBeNull();
    });

    it("returns null for unknown recording on known reciter", async () => {
      const { getRecordingRights } = await import("./audio-rights");
      expect(getRecordingRights("ar.alafasy", "ar.alafasy.mujawwad")).toBeNull();
    });
  });

  describe("isRecordingGated", () => {
    it("returns false for any recording when enforcement is off", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "false";
      const { isRecordingGated } = await import("./audio-rights");
      expect(isRecordingGated("ar.alafasy", "ar.alafasy")).toBe(false);
      expect(isRecordingGated("ar.husary", "ar.husary")).toBe(false);
    });

    it("returns true for unknown recordingId when enforcement is on (default-deny)", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy";
      const { isRecordingGated } = await import("./audio-rights");
      // Unknown recording variant → gated even if reciter is cleared
      expect(isRecordingGated("ar.alafasy", "ar.alafasy.mujawwad")).toBe(true);
    });

    it("returns true when reciter is not in CLEARED_RECITERS", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      delete process.env.CLEARED_RECITERS;
      const { isRecordingGated } = await import("./audio-rights");
      expect(isRecordingGated("ar.alafasy", "ar.alafasy")).toBe(true);
    });

    it("returns true for default unverified recording even when reciter is cleared", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy";
      const { isRecordingGated } = await import("./audio-rights");
      // Default recording is unverified → gated despite reciter being cleared
      expect(isRecordingGated("ar.alafasy", "ar.alafasy")).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // MFD-12.4 WS2 Gap A: isReciterGated with recordings consideration
  // ---------------------------------------------------------------------------

  describe("isReciterGated with recordings", () => {
    it("gates reciter in CLEARED_RECITERS when no recording is fully cleared", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "true";
      process.env.CLEARED_RECITERS = "ar.alafasy";
      const { isReciterGated } = await import("./audio-rights");
      // All default recordings are unverified → reciter should be gated
      expect(isReciterGated("ar.alafasy")).toBe(true);
    });

    it("preserves pass-through for all reciters when enforcement is off", async () => {
      process.env.AUDIO_RIGHTS_ENFORCEMENT = "false";
      const { isReciterGated } = await import("./audio-rights");
      expect(isReciterGated("ar.alafasy")).toBe(false);
      expect(isReciterGated("ar.husary")).toBe(false);
      expect(isReciterGated("ar.minshawi")).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // MFD-12.4 WS2 Gap B: Cache version
  // ---------------------------------------------------------------------------

  describe("RIGHTS_CACHE_VERSION", () => {
    it("defaults to '1' when env var is unset", async () => {
      delete process.env.RIGHTS_CACHE_VERSION;
      vi.resetModules();
      const { RIGHTS_CACHE_VERSION } = await import("./audio-rights-version");
      expect(RIGHTS_CACHE_VERSION).toBe("1");
    });

    it("reads from RIGHTS_CACHE_VERSION env var when set", async () => {
      process.env.RIGHTS_CACHE_VERSION = "42";
      vi.resetModules();
      const { RIGHTS_CACHE_VERSION } = await import("./audio-rights-version");
      expect(RIGHTS_CACHE_VERSION).toBe("42");
      delete process.env.RIGHTS_CACHE_VERSION;
    });
  });

  // ---------------------------------------------------------------------------
  // MFD-12.4 WS2 Gap A: getPrimaryRecordingId
  // ---------------------------------------------------------------------------

  describe("getPrimaryRecordingId", () => {
    it("returns the CDN edition id as primary recording", async () => {
      const { getPrimaryRecordingId } = await import("./audio-rights");
      expect(getPrimaryRecordingId("ar.alafasy")).toBe("ar.alafasy");
      expect(getPrimaryRecordingId("ar.abdulbasit")).toBe("ar.abdulbasit");
    });

    it("returns null for unknown reciter", async () => {
      const { getPrimaryRecordingId } = await import("./audio-rights");
      expect(getPrimaryRecordingId("nonexistent")).toBeNull();
    });
  });
});
