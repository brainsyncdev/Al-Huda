import { describe, expect, test } from "vitest";
import { normalizeLibraryState } from "./storage";

describe("normalizeLibraryState - collections", () => {
  test("accepts valid collections", () => {
    const raw = {
      bookmarks: [],
      notes: [],
      progress: [],
      collections: [
        {
          id: "col:123",
          name: "Patience",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
      ],
      collectionAyat: [
        {
          id: "ca:col:123:2:153:1234567890",
          collectionId: "col:123",
          surah: 2,
          ayah: 153,
          createdAt: "2026-01-01T00:00:00Z",
        },
      ],
    };
    const result = normalizeLibraryState(raw);
    expect(result.collections).toHaveLength(1);
    expect(result.collections[0].name).toBe("Patience");
    expect(result.collectionAyat).toHaveLength(1);
    expect(result.collectionAyat[0].surah).toBe(2);
    expect(result.collectionAyat[0].ayah).toBe(153);
  });

  test("drops malformed collections", () => {
    const raw = {
      bookmarks: [],
      notes: [],
      progress: [],
      collections: [
        { id: "col:1", name: "Valid", createdAt: "", updatedAt: "" },
        { id: "", name: "Missing ID", createdAt: "", updatedAt: "" },
        { id: "col:2", name: "", createdAt: "", updatedAt: "" },
        { id: "col:3", name: "   ", createdAt: "", updatedAt: "" },
        null,
        "not an object",
      ],
      collectionAyat: [],
    };
    const result = normalizeLibraryState(raw);
    expect(result.collections).toHaveLength(1);
    expect(result.collections[0].id).toBe("col:1");
  });

  test("drops malformed collectionAyat", () => {
    const raw = {
      bookmarks: [],
      notes: [],
      progress: [],
      collections: [],
      collectionAyat: [
        {
          id: "ca:1",
          collectionId: "col:1",
          surah: 2,
          ayah: 255,
          createdAt: "",
        },
        {
          id: "",
          collectionId: "col:1",
          surah: 2,
          ayah: 255,
          createdAt: "",
        },
        {
          id: "ca:2",
          collectionId: "",
          surah: 2,
          ayah: 255,
          createdAt: "",
        },
        {
          id: "ca:3",
          collectionId: "col:1",
          surah: "not a number",
          ayah: 255,
          createdAt: "",
        },
        {
          id: "ca:4",
          collectionId: "col:1",
          surah: 2,
          ayah: "not a number",
          createdAt: "",
        },
      ],
    };
    const result = normalizeLibraryState(raw);
    expect(result.collectionAyat).toHaveLength(1);
    expect(result.collectionAyat[0].id).toBe("ca:1");
  });

  test("handles missing collections fields gracefully", () => {
    const raw = {
      bookmarks: [],
      notes: [],
      progress: [],
    };
    const result = normalizeLibraryState(raw);
    expect(result.collections).toEqual([]);
    expect(result.collectionAyat).toEqual([]);
  });

  test("trims collection names", () => {
    const raw = {
      bookmarks: [],
      notes: [],
      progress: [],
      collections: [
        {
          id: "col:1",
          name: "  Patience  ",
          createdAt: "",
          updatedAt: "",
        },
      ],
      collectionAyat: [],
    };
    const result = normalizeLibraryState(raw);
    expect(result.collections[0].name).toBe("Patience");
  });
});

describe("normalizeLibraryState - backward compatibility", () => {
  test("legacy state without collections normalizes to empty arrays", () => {
    const raw = {
      bookmarks: [{ surah: 2, ayah: 255, savedAt: "2026-01-01T00:00:00Z" }],
      notes: [],
      progress: [],
    };
    const result = normalizeLibraryState(raw);
    expect(result.bookmarks).toHaveLength(1);
    expect(result.collections).toEqual([]);
    expect(result.collectionAyat).toEqual([]);
  });
});
