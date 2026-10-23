import { describe, it, expect } from "vitest";
import { normalizePathsState } from "./storage";
import { EMPTY_PATHS_STATE } from "./data";

describe("normalizePathsState", () => {
  it("returns empty state for null or non-object input", () => {
    expect(normalizePathsState(null)).toEqual(EMPTY_PATHS_STATE);
    expect(normalizePathsState(undefined)).toEqual(EMPTY_PATHS_STATE);
    expect(normalizePathsState("string")).toEqual(EMPTY_PATHS_STATE);
    expect(normalizePathsState(123)).toEqual(EMPTY_PATHS_STATE);
    expect(normalizePathsState([])).toEqual(EMPTY_PATHS_STATE);
  });

  it("returns empty state for empty object", () => {
    expect(normalizePathsState({})).toEqual(EMPTY_PATHS_STATE);
  });

  it("normalizes valid progress entries", () => {
    const raw = {
      progress: {
        "first-steps": {
          pathSlug: "first-steps",
          completedSteps: [1, 2, 3],
          startedAt: "2026-10-23T10:00:00.000Z",
          lastActivityAt: "2026-10-23T11:00:00.000Z",
        },
      },
      selectedGoal: "new-muslim",
      onboardingCompleted: true,
    };

    const result = normalizePathsState(raw);
    expect(result.selectedGoal).toBe("new-muslim");
    expect(result.onboardingCompleted).toBe(true);
    expect(result.progress["first-steps"]).toBeDefined();
    expect(result.progress["first-steps"].completedSteps).toEqual([1, 2, 3]);
  });

  it("drops progress entries with invalid path slugs", () => {
    const raw = {
      progress: {
        "nonexistent-path": {
          pathSlug: "nonexistent-path",
          completedSteps: [1],
          startedAt: "2026-10-23T10:00:00.000Z",
          lastActivityAt: "2026-10-23T11:00:00.000Z",
        },
      },
    };

    const result = normalizePathsState(raw);
    expect(Object.keys(result.progress)).toHaveLength(0);
  });

  it("deduplicates and sorts completedSteps", () => {
    const raw = {
      progress: {
        "first-steps": {
          pathSlug: "first-steps",
          completedSteps: [3, 1, 2, 1, 3],
          startedAt: "2026-10-23T10:00:00.000Z",
          lastActivityAt: "2026-10-23T11:00:00.000Z",
        },
      },
    };

    const result = normalizePathsState(raw);
    expect(result.progress["first-steps"].completedSteps).toEqual([1, 2, 3]);
  });

  it("drops progress entries with invalid timestamps", () => {
    const raw = {
      progress: {
        "first-steps": {
          pathSlug: "first-steps",
          completedSteps: [1],
          startedAt: "not-a-date",
          lastActivityAt: "2026-10-23T11:00:00.000Z",
        },
      },
    };

    const result = normalizePathsState(raw);
    expect(Object.keys(result.progress)).toHaveLength(0);
  });

  it("normalizes selectedGoal to null for invalid values", () => {
    const raw = {
      selectedGoal: "invalid-audience",
    };

    const result = normalizePathsState(raw);
    expect(result.selectedGoal).toBeNull();
  });

  it("normalizes onboardingCompleted to false for non-boolean values", () => {
    const raw = {
      onboardingCompleted: "yes",
    };

    const result = normalizePathsState(raw);
    expect(result.onboardingCompleted).toBe(false);
  });
});
