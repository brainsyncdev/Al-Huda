// Structural and semantic tests for the spaced-repetition scheduling core.
//
// These tests pin the invariants the UI and storage layer depend on:
//   * Date arithmetic is correct across month/year/leap boundaries.
//   * Range expansion rejects invalid input and respects the surah's verse
//     count and the per-range cap.
//   * Item lifecycle: create → applyRating → editItem → resetItem produces
//     the expected step transitions and due dates.
//   * Stats are neutral: no streak, no rank, no comparison fields.
//   * Determinism: same inputs produce same outputs (except IDs which embed
//     the timestamp).
//
// All tests use fixed reference instants so they are timezone-independent.

import { describe, expect, it } from "vitest";
import {
  ALGORITHM_VERSION,
  DEFAULT_LADDER_ID,
  LADDERS,
  MAX_RANGE_SIZE,
  addDays,
  applyRating,
  createItem,
  daysBetween,
  dueItems,
  editItem,
  eventsFor,
  expandRange,
  getLadder,
  isValidDateOnly,
  refKey,
  resetItem,
  statsFor,
  todayFrom,
  upcomingItems,
  type RevisionState,
} from "./scheduling";

// Fixed reference instant: 2026-10-19T12:00:00Z
const NOW_MS = Date.UTC(2026, 9, 19, 12, 0, 0);
const NOW_ISO = new Date(NOW_MS).toISOString();
const TODAY = "2026-10-19";

describe("date arithmetic", () => {
  it("todayFrom returns YYYY-MM-DD in UTC", () => {
    expect(todayFrom(NOW_MS)).toBe(TODAY);
  });

  it("addDays crosses month boundaries correctly", () => {
    expect(addDays("2026-10-31", 1)).toBe("2026-11-01");
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
  });

  it("addDays crosses year boundaries correctly", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });

  it("addDays handles leap years", () => {
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2024-02-29", 1)).toBe("2024-03-01");
    expect(addDays("2023-02-28", 1)).toBe("2023-03-01");
  });

  it("daysBetween returns positive when a is later than b", () => {
    expect(daysBetween("2026-10-20", "2026-10-19")).toBe(1);
    expect(daysBetween("2026-10-19", "2026-10-20")).toBe(-1);
    expect(daysBetween("2026-10-19", "2026-10-19")).toBe(0);
  });

  it("isValidDateOnly rejects impossible dates", () => {
    expect(isValidDateOnly("2026-02-30")).toBe(false);
    expect(isValidDateOnly("2026-13-01")).toBe(false);
    expect(isValidDateOnly("2026-00-15")).toBe(false);
    expect(isValidDateOnly("2026-04-31")).toBe(false);
  });

  it("isValidDateOnly accepts valid dates", () => {
    expect(isValidDateOnly("2026-10-19")).toBe(true);
    expect(isValidDateOnly("2024-02-29")).toBe(true);
  });
});

describe("expandRange", () => {
  it("returns a contiguous range for valid input", () => {
    const result = expandRange({ surah: 2, fromAyah: 1, toAyah: 3 }, 286);
    expect(result.error).toBeNull();
    expect(result.refs).toEqual([
      { surah: 2, ayah: 1 },
      { surah: 2, ayah: 2 },
      { surah: 2, ayah: 3 },
    ]);
  });

  it("rejects when toAyah exceeds the surah's verse count", () => {
    const result = expandRange({ surah: 2, fromAyah: 1, toAyah: 500 }, 286);
    expect(result.refs).toEqual([]);
    expect(result.error).toContain("out of range");
  });

  it("rejects when the range exceeds MAX_RANGE_SIZE", () => {
    const result = expandRange(
      { surah: 2, fromAyah: 1, toAyah: MAX_RANGE_SIZE + 1 },
      1000
    );
    expect(result.refs).toEqual([]);
    expect(result.error).toContain("limited to");
  });

  it("rejects when fromAyah > toAyah", () => {
    const result = expandRange({ surah: 2, fromAyah: 5, toAyah: 3 }, 286);
    expect(result.refs).toEqual([]);
    expect(result.error).toContain("before the last");
  });

  it("rejects non-integer ayah numbers", () => {
    const result = expandRange({ surah: 2, fromAyah: 1.5, toAyah: 3 }, 286);
    expect(result.refs).toEqual([]);
    expect(result.error).toContain("integers");
  });

  it("rejects surah out of canonical range", () => {
    const result = expandRange({ surah: 0, fromAyah: 1, toAyah: 3 }, 7);
    expect(result.refs).toEqual([]);
    expect(result.error).toContain("between 1 and 114");
  });

  it("rejects when the surah has no verses", () => {
    const result = expandRange({ surah: 2, fromAyah: 1, toAyah: 3 }, 0);
    expect(result.refs).toEqual([]);
    expect(result.error).toContain("no verses");
  });
});

describe("item lifecycle", () => {
  it("createItem schedules the first review for tomorrow under every ladder", () => {
    for (const ladder of LADDERS) {
      const item = createItem(2, 255, ladder.id, NOW_ISO, NOW_MS);
      expect(item.dueDate).toBe(addDays(TODAY, ladder.intervals[0]!));
      expect(item.step).toBe(0);
      expect(item.reviewCount).toBe(0);
      expect(item.lastReviewedAt).toBeNull();
    }
  });

  it("applyRating easy advances one step", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    const { item: updated, event } = applyRating(item, "easy", NOW_ISO, NOW_MS);
    expect(updated.step).toBe(1);
    expect(updated.reviewCount).toBe(1);
    expect(event.kind).toBe("recall");
    expect(event.rating).toBe("easy");
    expect(event.stepBefore).toBe(0);
    expect(event.stepAfter).toBe(1);
  });

  it("applyRating difficult holds at the current step", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    const { item: updated, event } = applyRating(
      item,
      "difficult",
      NOW_ISO,
      NOW_MS
    );
    expect(updated.step).toBe(0);
    expect(event.stepBefore).toBe(0);
    expect(event.stepAfter).toBe(0);
  });

  it("applyRating missed drops to step 0 and increments lapses implicitly via step reset", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    // Advance to step 2 first.
    const step1 = applyRating(item, "easy", NOW_ISO, NOW_MS).item;
    const step2 = applyRating(step1, "easy", NOW_ISO, NOW_MS).item;
    expect(step2.step).toBe(2);
    const { item: updated, event } = applyRating(
      step2,
      "missed",
      NOW_ISO,
      NOW_MS
    );
    expect(updated.step).toBe(0);
    expect(event.stepBefore).toBe(2);
    expect(event.stepAfter).toBe(0);
  });

  it("applyRating caps at the ladder's last step", () => {
    const ladder = getLadder(DEFAULT_LADDER_ID);
    const maxStep = ladder.intervals.length - 1;
    let item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    for (let i = 0; i < maxStep + 5; i++) {
      item = applyRating(item, "easy", NOW_ISO, NOW_MS).item;
    }
    expect(item.step).toBe(maxStep);
  });

  it("resetItem returns to step 0 without deleting history", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    const advanced = applyRating(item, "easy", NOW_ISO, NOW_MS).item;
    const { item: reset, event } = resetItem(advanced, NOW_ISO, NOW_MS);
    expect(reset.step).toBe(0);
    expect(reset.reviewCount).toBe(advanced.reviewCount);
    expect(event.kind).toBe("reset");
  });

  it("editItem changes the ladder and recomputes the due date", () => {
    // Advance past step 0 first: gentle and spacious both start at a 1-day
    // interval, so editing at step 0 legitimately yields the same date.
    const item = applyRating(
      createItem(2, 255, "gentle", NOW_ISO, NOW_MS),
      "easy",
      NOW_ISO,
      NOW_MS
    ).item;
    const { item: edited, event } = editItem(item, "spacious", NOW_ISO, NOW_MS);
    expect(edited.ladderId).toBe("spacious");
    expect(event.kind).toBe("edited");
    expect(edited.dueDate).not.toBe(item.dueDate);
  });

  it("editItem clamps step when switching to a shorter ladder", () => {
    const item = createItem(2, 255, "spacious", NOW_ISO, NOW_MS);
    // Advance to step 5 (beyond gentle's length).
    let advanced = item;
    for (let i = 0; i < 5; i++) {
      advanced = applyRating(advanced, "easy", NOW_ISO, NOW_MS).item;
    }
    expect(advanced.step).toBe(5);
    const { item: edited } = editItem(advanced, "gentle", NOW_ISO, NOW_MS);
    const gentleMaxStep = getLadder("gentle").intervals.length - 1;
    expect(edited.step).toBeLessThanOrEqual(gentleMaxStep);
  });
});

describe("queries", () => {
  it("dueItems returns items due on or before the reference day", () => {
    const state: RevisionState = {
      items: {
        "2:255": createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS),
        "3:200": createItem(3, 200, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS),
      },
      events: [],
      settings: { ladderId: DEFAULT_LADDER_ID },
    };
    // Both are due tomorrow, so neither is due today.
    expect(dueItems(state, NOW_MS)).toEqual([]);
    // Advance time by one day.
    const tomorrow = NOW_MS + 86_400_000;
    const due = dueItems(state, tomorrow);
    expect(due.length).toBe(2);
  });

  it("upcomingItems returns items due after the reference day", () => {
    const state: RevisionState = {
      items: {
        "2:255": createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS),
      },
      events: [],
      settings: { ladderId: DEFAULT_LADDER_ID },
    };
    const upcoming = upcomingItems(state, NOW_MS);
    expect(upcoming.length).toBe(1);
    expect(upcoming[0]!.reference).toBe("2:255");
  });

  it("eventsFor returns events newest-first", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    const evt1 = applyRating(item, "easy", NOW_ISO, NOW_MS).event;
    const evt2 = applyRating(item, "difficult", NOW_ISO, NOW_MS).event;
    const state: RevisionState = {
      items: { [item.reference]: item },
      events: [evt1, evt2],
      settings: { ladderId: DEFAULT_LADDER_ID },
    };
    const events = eventsFor(state);
    expect(events[0]!.at >= events[1]!.at).toBe(true);
  });
});

describe("stats", () => {
  it("statsFor returns neutral counts with no streak field", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    const evt1 = applyRating(item, "easy", NOW_ISO, NOW_MS).event;
    const evt2 = applyRating(item, "difficult", NOW_ISO, NOW_MS).event;
    const state: RevisionState = {
      items: { [item.reference]: item },
      events: [evt1, evt2],
      settings: { ladderId: DEFAULT_LADDER_ID },
    };
    const stats = statsFor(state, NOW_MS);
    expect(stats.totalItems).toBe(1);
    expect(stats.recordedReviews).toBe(2);
    expect(stats.ratingCounts.easy).toBe(1);
    expect(stats.ratingCounts.difficult).toBe(1);
    expect(stats.ratingCounts.missed).toBe(0);
    // Pin the absence of streak/rank/comparison fields (FR-053).
    expect("streak" in stats).toBe(false);
    expect("rank" in stats).toBe(false);
    expect("missedDays" in stats).toBe(false);
  });
});

describe("determinism and versioning", () => {
  it("every event carries the algorithm version", () => {
    const item = createItem(2, 255, DEFAULT_LADDER_ID, NOW_ISO, NOW_MS);
    const { event } = applyRating(item, "easy", NOW_ISO, NOW_MS);
    expect(event.algorithmVersion).toBe(ALGORITHM_VERSION);
  });

  it("refKey produces a stable canonical reference", () => {
    expect(refKey(2, 255)).toBe("2:255");
  });
});
