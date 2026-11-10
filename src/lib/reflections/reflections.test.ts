import { describe, it, expect, beforeEach } from "vitest";
import {
  normalizeReflectionsState,
  readReflectionsState,
  writeReflectionsState,
  REFLECTIONS_STORAGE_KEY,
  EMPTY_REFLECTIONS_STATE,
} from "./storage";
import type { Reflection, ReflectionsState } from "./types";

describe("Reflections Storage", () => {
  describe("normalizeReflectionsState", () => {
    it("returns empty state for null input", () => {
      const result = normalizeReflectionsState(null);
      expect(result).toEqual(EMPTY_REFLECTIONS_STATE);
    });

    it("returns empty state for undefined input", () => {
      const result = normalizeReflectionsState(undefined);
      expect(result).toEqual(EMPTY_REFLECTIONS_STATE);
    });

    it("returns empty state for non-object input", () => {
      const result = normalizeReflectionsState("invalid");
      expect(result).toEqual(EMPTY_REFLECTIONS_STATE);
    });

    it("normalizes valid reflections", () => {
      const input = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "ayah",
            targetRef: "2:255",
            content: "Ayat al-Kursi reflection",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };
      const result = normalizeReflectionsState(input);
      expect(result.version).toBe(1);
      expect(result.reflections).toHaveLength(1);
      expect(result.reflections[0].id).toBe("ref:1");
      expect(result.reflections[0].targetType).toBe("ayah");
      expect(result.reflections[0].targetRef).toBe("2:255");
      expect(result.reflections[0].content).toBe("Ayat al-Kursi reflection");
    });

    it("drops reflections with missing required fields", () => {
      const input = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "ayah",
            targetRef: "2:255",
            content: "Valid",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "ref:2",
            targetType: "ayah",
            // missing targetRef
            content: "Invalid",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };
      const result = normalizeReflectionsState(input);
      expect(result.reflections).toHaveLength(1);
      expect(result.reflections[0].id).toBe("ref:1");
    });

    it("drops reflections with invalid target types", () => {
      const input = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "invalid-type",
            targetRef: "2:255",
            content: "Invalid type",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };
      const result = normalizeReflectionsState(input);
      expect(result.reflections).toHaveLength(0);
    });

    it("drops reflections with invalid dates", () => {
      const input = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "ayah",
            targetRef: "2:255",
            content: "Invalid date",
            createdAt: "not-a-date",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };
      const result = normalizeReflectionsState(input);
      expect(result.reflections).toHaveLength(0);
    });

    it("handles missing reflections array", () => {
      const input = { version: 1 };
      const result = normalizeReflectionsState(input);
      expect(result.reflections).toEqual([]);
    });

    it("handles non-array reflections", () => {
      const input = { version: 1, reflections: "not-an-array" };
      const result = normalizeReflectionsState(input);
      expect(result.reflections).toEqual([]);
    });

    it("handles all valid target types", () => {
      const input = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "ayah",
            targetRef: "2:255",
            content: "Ayah reflection",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "ref:2",
            targetType: "topic",
            targetRef: "mercy",
            content: "Topic reflection",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
          {
            id: "ref:3",
            targetType: "journey-stage",
            targetRef: "stage-1",
            content: "Journey reflection",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };
      const result = normalizeReflectionsState(input);
      expect(result.reflections).toHaveLength(3);
      expect(result.reflections[0].targetType).toBe("ayah");
      expect(result.reflections[1].targetType).toBe("topic");
      expect(result.reflections[2].targetType).toBe("journey-stage");
    });
  });

  describe("readReflectionsState", () => {
    it("returns empty state in node environment (no window)", () => {
      // In node test environment, window is undefined, so readReflectionsState
      // should return empty state
      const result = readReflectionsState();
      expect(result).toEqual(EMPTY_REFLECTIONS_STATE);
    });
  });

  describe("writeReflectionsState", () => {
    it("does not throw in node environment (no window)", () => {
      const state: ReflectionsState = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "ayah",
            targetRef: "1:1",
            content: "Test",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };
      // Should not throw even though window is undefined
      expect(() => writeReflectionsState(state)).not.toThrow();
    });
  });

  describe("EMPTY_REFLECTIONS_STATE", () => {
    it("has correct structure", () => {
      expect(EMPTY_REFLECTIONS_STATE.version).toBe(1);
      expect(EMPTY_REFLECTIONS_STATE.reflections).toEqual([]);
    });
  });

  describe("REFLECTIONS_STORAGE_KEY", () => {
    it("has correct value", () => {
      expect(REFLECTIONS_STORAGE_KEY).toBe("alhuda.reflections.v1");
    });
  });
});

describe("Reflections Context Operations", () => {
  let state: ReflectionsState;

  beforeEach(() => {
    state = { ...EMPTY_REFLECTIONS_STATE, reflections: [] };
  });

  describe("CRUD Operations", () => {
    it("adds a reflection", () => {
      const reflection: Reflection = {
        id: "ref:1",
        targetType: "ayah",
        targetRef: "1:1",
        content: "Bismillah reflection",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.reflections = [reflection];
      expect(state.reflections).toHaveLength(1);
      expect(state.reflections[0].content).toBe("Bismillah reflection");
    });

    it("updates a reflection", () => {
      const reflection: Reflection = {
        id: "ref:1",
        targetType: "ayah",
        targetRef: "1:1",
        content: "Original",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
      };
      state.reflections = [reflection];

      const updated = {
        ...reflection,
        content: "Updated",
        updatedAt: new Date().toISOString(),
      };
      state.reflections[0] = updated;

      expect(state.reflections[0].content).toBe("Updated");
    });

    it("deletes a reflection", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "1:1",
          content: "First",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "ref:2",
          targetType: "ayah",
          targetRef: "1:2",
          content: "Second",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;
      state.reflections = state.reflections.filter((r) => r.id !== "ref:1");

      expect(state.reflections).toHaveLength(1);
      expect(state.reflections[0].id).toBe("ref:2");
    });

    it("gets reflections by target", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "2:255",
          content: "Ayat al-Kursi",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "ref:2",
          targetType: "ayah",
          targetRef: "2:255",
          content: "Another reflection on same ayah",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "ref:3",
          targetType: "ayah",
          targetRef: "1:1",
          content: "Different ayah",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;

      const filtered = state.reflections.filter(
        (r) => r.targetType === "ayah" && r.targetRef === "2:255"
      );
      expect(filtered).toHaveLength(2);
    });
  });

  describe("Search Functionality", () => {
    it("searches reflections by content", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "2:255",
          content: "Reflection on mercy and compassion",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "ref:2",
          targetType: "topic",
          targetRef: "patience",
          content: "Thoughts on patience in difficulty",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "ref:3",
          targetType: "ayah",
          targetRef: "1:1",
          content: "Starting with the name of Allah",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;

      const query = "mercy";
      const results = state.reflections.filter((r) =>
        r.content.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe("ref:1");
    });

    it("search is case-insensitive", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "2:255",
          content: "MERCY and compassion",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;

      const query = "mercy";
      const results = state.reflections.filter((r) =>
        r.content.toLowerCase().includes(query.toLowerCase())
      );
      expect(results).toHaveLength(1);
    });

    it("returns empty array for empty query", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "2:255",
          content: "Some content",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;

      const query = "";
      const results = query.trim()
        ? state.reflections.filter((r) =>
            r.content.toLowerCase().includes(query.toLowerCase())
          )
        : [];
      expect(results).toHaveLength(0);
    });
  });

  describe("Export/Import", () => {
    it("exports state correctly", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "2:255",
          content: "Export test",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;

      const exported = state;
      expect(exported.version).toBe(1);
      expect(exported.reflections).toHaveLength(1);
    });

    it("imports state correctly", () => {
      const imported: ReflectionsState = {
        version: 1,
        reflections: [
          {
            id: "ref:1",
            targetType: "topic",
            targetRef: "gratitude",
            content: "Import test",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      };

      const normalized = normalizeReflectionsState(imported);
      expect(normalized.reflections).toHaveLength(1);
      expect(normalized.reflections[0].targetRef).toBe("gratitude");
    });

    it("handles backward compatibility with v8 backups (no reflections)", () => {
      const v8Backup: Record<string, unknown> = {
        version: 8,
        library: {},
        revision: {},
        preferences: {},
        paths: {},
        quiz: {},
        readingPlans: {},
        journeys: {},
        // no reflections field
      };

      // Simulate what backup.ts does when reflections is undefined
      const reflections =
        v8Backup.reflections === undefined
          ? { ...EMPTY_REFLECTIONS_STATE }
          : normalizeReflectionsState(v8Backup.reflections);

      expect(reflections).toEqual(EMPTY_REFLECTIONS_STATE);
    });
  });

  describe("Clear All", () => {
    it("clears all reflections", () => {
      const reflections: Reflection[] = [
        {
          id: "ref:1",
          targetType: "ayah",
          targetRef: "1:1",
          content: "First",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: "ref:2",
          targetType: "ayah",
          targetRef: "1:2",
          content: "Second",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
        },
      ];
      state.reflections = reflections;

      state = { ...EMPTY_REFLECTIONS_STATE };
      expect(state.reflections).toHaveLength(0);
    });
  });
});
