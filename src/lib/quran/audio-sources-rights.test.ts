// MFD-12.4 WS2: Tests for enriched audio source record rights metadata.
//
// Verifies that the islamic-network-audio source record carries all required
// rights metadata fields and per-reciter entries.
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { describe, it, expect } from "vitest";
import { getSource } from "./sources";
import { RECITERS } from "./audio";

describe("audio source record rights metadata (MFD-12.4 WS2)", () => {
  const source = getSource("islamic-network-audio");

  it("source record exists", () => {
    expect(source).toBeDefined();
  });

  it("has rightsStatus set to under-review", () => {
    expect(source!.rightsStatus).toBe("under-review");
  });

  it("has rightsReviewDate", () => {
    expect(source!.rightsReviewDate).toBeDefined();
    expect(source!.rightsReviewDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("has disableReason", () => {
    expect(source!.disableReason).toBe("rights-under-review");
  });

  it("has reciterRights array with entries for all 12 reciters", () => {
    expect(source!.reciterRights).toBeDefined();
    expect(source!.reciterRights!.length).toBe(RECITERS.length);

    const reciterIds = new Set(source!.reciterRights!.map((r) => r.reciterId));
    for (const reciter of RECITERS) {
      expect(reciterIds.has(reciter.id)).toBe(true);
    }
  });

  it("all reciter entries have status under-review by default", () => {
    for (const entry of source!.reciterRights!) {
      expect(entry.status).toBe("under-review");
    }
  });

  it("all reciter entries have distributionRightsStatus unverified", () => {
    for (const entry of source!.reciterRights!) {
      expect(entry.distributionRightsStatus).toBe("unverified");
    }
  });

  it("all reciter entries have performerRightsStatus unknown", () => {
    for (const entry of source!.reciterRights!) {
      expect(entry.performerRightsStatus).toBe("unknown");
    }
  });

  it("preserves existing source record fields", () => {
    expect(source!.provides).toContain("audio");
    expect(source!.publisher).toContain("Islamic Network");
    expect(source!.method).toBe("link");
    expect(source!.language).toBe("ar");
    expect(source!.licenseUrl).toBeDefined();
    expect(source!.homepage).toContain("cdn.islamic.network");
  });
});
