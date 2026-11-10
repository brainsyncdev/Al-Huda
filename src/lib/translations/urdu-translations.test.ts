import { describe, it, expect, vi } from "vitest";
import {
  type UrduTranslationRecord,
  VALID_REVIEW_STATES,
  isValidReviewState,
  validateTranslationRecord,
} from "./urdu-types";
import {
  normalizeTranslationRecord,
  normalizeStore,
  readStoreFromStorage,
  writeStoreToStorage,
  type StorageLike,
  type UrduTranslationsStore,
  STORAGE_KEY,
} from "./urdu-storage";

// Mock storage backend for testing pure functions
function createMockStorage(): StorageLike & { store: Record<string, string> } {
  const store: Record<string, string> = {};
  return {
    store,
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
}

describe("Urdu Translation Types", () => {
  describe("isValidReviewState", () => {
    it("accepts all valid review states", () => {
      for (const state of VALID_REVIEW_STATES) {
        expect(isValidReviewState(state)).toBe(true);
      }
    });

    it("rejects invalid review states", () => {
      expect(isValidReviewState("invalid")).toBe(false);
      expect(isValidReviewState("")).toBe(false);
      expect(isValidReviewState("pending")).toBe(false);
    });
  });

  describe("validateTranslationRecord", () => {
    it("validates a complete valid record", () => {
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        proposedUrduTitle: "صبر",
        translationSource: "manual translation",
        translatorAttribution: "Scholar X",
        reviewState: "published",
        reviewNotes: "Reviewed and approved",
        lastReviewedDate: "2026-11-10",
        knownLimitations: ["Limited to title only"],
      };
      const errors = validateTranslationRecord(record);
      expect(errors).toHaveLength(0);
    });

    it("validates a minimal valid record", () => {
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        reviewState: "missing",
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors).toHaveLength(0);
    });

    it("rejects missing topicSlug", () => {
      const record = {
        topicSlug: "",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        reviewState: "missing" as const,
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("topicSlug");
    });

    it("rejects invalid reviewState", () => {
      const record = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        reviewState:
          "invalid" as
            | "missing"
            | "draft"
            | "needs_review"
            | "reviewed"
            | "published",
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("reviewState");
    });

    it("rejects publishing without proposedUrduTitle", () => {
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        reviewState: "published",
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("proposedUrduTitle");
    });

    it("rejects translatorAttribution before review", () => {
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        proposedUrduTitle: "صبر",
        translatorAttribution: "Scholar X",
        reviewState: "draft",
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("translatorAttribution");
    });

    it("rejects lastReviewedDate before review", () => {
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        proposedUrduTitle: "صبر",
        reviewState: "draft",
        lastReviewedDate: "2026-11-10",
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0]).toContain("lastReviewedDate");
    });

    it("allows translatorAttribution when reviewed", () => {
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        proposedUrduTitle: "صبر",
        translatorAttribution: "Scholar X",
        reviewState: "reviewed",
        lastReviewedDate: "2026-11-10",
        knownLimitations: [],
      };
      const errors = validateTranslationRecord(record);
      expect(errors).toHaveLength(0);
    });
  });
});

describe("Urdu Translation Storage", () => {
  describe("normalizeTranslationRecord", () => {
    it("normalizes a complete record", () => {
      const input = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        proposedUrduTitle: "صبر",
        reviewState: "draft" as const,
        knownLimitations: ["Test limitation"],
      };
      const normalized = normalizeTranslationRecord(input);
      expect(normalized.topicSlug).toBe("patience");
      expect(normalized.reviewState).toBe("draft");
      expect(normalized.knownLimitations).toEqual(["Test limitation"]);
    });

    it("normalizes a partial record with defaults", () => {
      const input = {
        topicSlug: "patience",
      };
      const normalized = normalizeTranslationRecord(input);
      expect(normalized.topicSlug).toBe("patience");
      expect(normalized.englishTitle).toBe("");
      expect(normalized.arabicTitle).toBe("");
      expect(normalized.reviewState).toBe("missing");
      expect(normalized.knownLimitations).toEqual([]);
    });

    it("converts invalid reviewState to missing", () => {
      const input = {
        topicSlug: "patience",
        reviewState:
          "invalid" as
            | "missing"
            | "draft"
            | "needs_review"
            | "reviewed"
            | "published",
      };
      const normalized = normalizeTranslationRecord(input);
      expect(normalized.reviewState).toBe("missing");
    });
  });

  describe("normalizeStore", () => {
    it("normalizes an empty store", () => {
      const normalized = normalizeStore({});
      expect(normalized.version).toBe(1);
      expect(normalized.records).toEqual({});
      expect(normalized.lastUpdated).toBeTruthy();
    });

    it("normalizes a store with records", () => {
      const input = {
        version: 1,
        records: {
          patience: {
            topicSlug: "patience",
            englishTitle: "Patience",
            arabicTitle: "الصبر",
            reviewState: "missing",
            knownLimitations: [],
          },
        },
        lastUpdated: "2026-11-10T00:00:00.000Z",
      };
      const normalized = normalizeStore(input);
      expect(normalized.records.patience).toBeTruthy();
      expect(normalized.records.patience.topicSlug).toBe("patience");
    });

    it("handles invalid input gracefully", () => {
      expect(normalizeStore(null)).toBeTruthy();
      expect(normalizeStore(undefined)).toBeTruthy();
      expect(normalizeStore("invalid")).toBeTruthy();
    });
  });

  describe("readStoreFromStorage", () => {
    it("returns empty store when storage is undefined", () => {
      const result = readStoreFromStorage(undefined);
      expect(result.version).toBe(1);
      expect(result.records).toEqual({});
    });

    it("returns empty store when key doesn't exist", () => {
      const storage = createMockStorage();
      const result = readStoreFromStorage(storage);
      expect(result.version).toBe(1);
      expect(result.records).toEqual({});
    });

    it("reads and normalizes stored data", () => {
      const storage = createMockStorage();
      const data: UrduTranslationsStore = {
        version: 1,
        records: {
          patience: {
            topicSlug: "patience",
            englishTitle: "Patience",
            arabicTitle: "الصبر",
            reviewState: "draft",
            knownLimitations: [],
          },
        },
        lastUpdated: "2026-11-10T00:00:00.000Z",
      };
      storage.setItem(STORAGE_KEY, JSON.stringify(data));

      const result = readStoreFromStorage(storage);
      expect(result.records.patience).toBeTruthy();
      expect(result.records.patience.topicSlug).toBe("patience");
    });

    it("handles corrupted JSON gracefully", () => {
      const storage = createMockStorage();
      storage.setItem(STORAGE_KEY, "invalid json");

      const result = readStoreFromStorage(storage);
      expect(result.version).toBe(1);
      expect(result.records).toEqual({});
    });
  });

  describe("writeStoreToStorage", () => {
    it("does nothing when storage is undefined", () => {
      const store: UrduTranslationsStore = {
        version: 1,
        records: {},
        lastUpdated: "2026-11-10T00:00:00.000Z",
      };
      expect(() => writeStoreToStorage(undefined, store)).not.toThrow();
    });

    it("writes store to storage", () => {
      const storage = createMockStorage();
      const store: UrduTranslationsStore = {
        version: 1,
        records: {
          patience: {
            topicSlug: "patience",
            englishTitle: "Patience",
            arabicTitle: "الصبر",
            reviewState: "missing",
            knownLimitations: [],
          },
        },
        lastUpdated: "2026-11-10T00:00:00.000Z",
      };

      writeStoreToStorage(storage, store);

      expect(storage.setItem).toHaveBeenCalledWith(
        STORAGE_KEY,
        expect.any(String)
      );
      const written = JSON.parse(storage.store[STORAGE_KEY]);
      expect(written.records.patience).toBeTruthy();
    });
  });

  describe("CRUD operations with storage", () => {
    it("creates and retrieves a record", () => {
      const storage = createMockStorage();
      const record: UrduTranslationRecord = {
        topicSlug: "patience",
        englishTitle: "Patience",
        arabicTitle: "الصبر",
        reviewState: "missing",
        knownLimitations: [],
      };

      // Write initial store
      const initialStore: UrduTranslationsStore = {
        version: 1,
        records: {},
        lastUpdated: new Date().toISOString(),
      };
      writeStoreToStorage(storage, initialStore);

      // Add record
      const store = readStoreFromStorage(storage);
      store.records[record.topicSlug] = record;
      writeStoreToStorage(storage, store);

      // Retrieve
      const retrieved = readStoreFromStorage(storage);
      expect(retrieved.records.patience).toBeTruthy();
      expect(retrieved.records.patience.topicSlug).toBe("patience");
    });

    it("deletes a record", () => {
      const storage = createMockStorage();
      const store: UrduTranslationsStore = {
        version: 1,
        records: {
          patience: {
            topicSlug: "patience",
            englishTitle: "Patience",
            arabicTitle: "الصبر",
            reviewState: "missing",
            knownLimitations: [],
          },
        },
        lastUpdated: new Date().toISOString(),
      };
      writeStoreToStorage(storage, store);

      // Delete record
      const current = readStoreFromStorage(storage);
      delete current.records.patience;
      writeStoreToStorage(storage, current);

      // Verify deletion
      const result = readStoreFromStorage(storage);
      expect(result.records.patience).toBeUndefined();
    });

    it("clears all records", () => {
      const storage = createMockStorage();
      const store: UrduTranslationsStore = {
        version: 1,
        records: {
          patience: {
            topicSlug: "patience",
            englishTitle: "Patience",
            arabicTitle: "الصبر",
            reviewState: "missing",
            knownLimitations: [],
          },
          gratitude: {
            topicSlug: "gratitude",
            englishTitle: "Gratitude",
            arabicTitle: "الشكر",
            reviewState: "missing",
            knownLimitations: [],
          },
        },
        lastUpdated: new Date().toISOString(),
      };
      writeStoreToStorage(storage, store);

      // Clear
      storage.removeItem(STORAGE_KEY);

      // Verify
      const result = readStoreFromStorage(storage);
      expect(result.records).toEqual({});
    });
  });
});

describe("RTL Rendering", () => {
  it("Urdu text contains RTL characters", () => {
    const urduText = "صبر";
    // Urdu uses Arabic script which is RTL
    // Check that the text contains characters in the Arabic Unicode block
    const arabicRegex = /[\u0600-\u06FF]/;
    expect(arabicRegex.test(urduText)).toBe(true);
  });

  it("Arabic text contains RTL characters", () => {
    const arabicText = "الصبر";
    const arabicRegex = /[\u0600-\u06FF]/;
    expect(arabicRegex.test(arabicText)).toBe(true);
  });
});

describe("Fallback Behavior", () => {
  it("returns empty store when no data exists", () => {
    const storage = createMockStorage();
    const result = readStoreFromStorage(storage);
    expect(result.records).toEqual({});
  });

  it("returns null for non-existent record", () => {
    const storage = createMockStorage();
    const store = readStoreFromStorage(storage);
    expect(store.records["nonexistent"]).toBeUndefined();
  });

  it("handles corrupted storage gracefully", () => {
    const storage = createMockStorage();
    storage.setItem(STORAGE_KEY, "invalid json");
    const result = readStoreFromStorage(storage);
    expect(result.version).toBe(1);
    expect(result.records).toEqual({});
  });
});

describe("Validation Rules", () => {
  it("prevents publishing without a proposed translation", () => {
    const record: UrduTranslationRecord = {
      topicSlug: "patience",
      englishTitle: "Patience",
      arabicTitle: "الصبر",
      reviewState: "published",
      knownLimitations: [],
    };
    const errors = validateTranslationRecord(record);
    expect(errors.some((e) => e.includes("proposedUrduTitle"))).toBe(true);
  });

  it("prevents attribution before review", () => {
    const record: UrduTranslationRecord = {
      topicSlug: "patience",
      englishTitle: "Patience",
      arabicTitle: "الصبر",
      proposedUrduTitle: "صبر",
      translatorAttribution: "Scholar X",
      reviewState: "draft",
      knownLimitations: [],
    };
    const errors = validateTranslationRecord(record);
    expect(errors.some((e) => e.includes("translatorAttribution"))).toBe(true);
  });

  it("prevents review date before review", () => {
    const record: UrduTranslationRecord = {
      topicSlug: "patience",
      englishTitle: "Patience",
      arabicTitle: "الصبر",
      proposedUrduTitle: "صبر",
      reviewState: "draft",
      lastReviewedDate: "2026-11-10",
      knownLimitations: [],
    };
    const errors = validateTranslationRecord(record);
    expect(errors.some((e) => e.includes("lastReviewedDate"))).toBe(true);
  });

  it("validation passes for a fully reviewed record", () => {
    const record: UrduTranslationRecord = {
      topicSlug: "patience",
      englishTitle: "Patience",
      arabicTitle: "الصبر",
      proposedUrduTitle: "صبر",
      translatorAttribution: "Scholar X",
      reviewState: "published",
      lastReviewedDate: "2026-11-10",
      knownLimitations: ["Limited to title"],
    };
    const errors = validateTranslationRecord(record);
    expect(errors).toHaveLength(0);
  });
});

describe("Export/Import", () => {
  it("exports a store with records", () => {
    const storage = createMockStorage();
    const store: UrduTranslationsStore = {
      version: 1,
      records: {
        patience: {
          topicSlug: "patience",
          englishTitle: "Patience",
          arabicTitle: "الصبر",
          reviewState: "draft",
          knownLimitations: [],
        },
      },
      lastUpdated: "2026-11-10T00:00:00.000Z",
    };
    writeStoreToStorage(storage, store);

    const exported = readStoreFromStorage(storage);
    expect(exported.version).toBe(1);
    expect(exported.records.patience).toBeTruthy();
    expect(exported.records.patience.topicSlug).toBe("patience");
  });

  it("imports a valid store from JSON", () => {
    const storage = createMockStorage();
    const importData = {
      version: 1,
      records: {
        patience: {
          topicSlug: "patience",
          englishTitle: "Patience",
          arabicTitle: "الصبر",
          reviewState: "missing",
          knownLimitations: [],
        },
        gratitude: {
          topicSlug: "gratitude",
          englishTitle: "Gratitude",
          arabicTitle: "الشكر",
          reviewState: "missing",
          knownLimitations: [],
        },
      },
      lastUpdated: "2026-11-10T00:00:00.000Z",
    };

    // Simulate import by writing the normalized data
    const normalized = normalizeStore(importData);
    writeStoreToStorage(storage, normalized);

    const result = readStoreFromStorage(storage);
    expect(result.records.patience).toBeTruthy();
    expect(result.records.gratitude).toBeTruthy();
    expect(Object.keys(result.records)).toHaveLength(2);
  });

  it("import rejects invalid records via validation", () => {
    const importData = {
      version: 1,
      records: {
        patience: {
          topicSlug: "patience",
          englishTitle: "Patience",
          arabicTitle: "الصبر",
          reviewState: "published",
          knownLimitations: [],
        },
      },
      lastUpdated: "2026-11-10T00:00:00.000Z",
    };

    const normalized = normalizeStore(importData);
    const errors: string[] = [];
    for (const record of Object.values(normalized.records)) {
      const recordErrors = validateTranslationRecord(record);
      if (recordErrors.length > 0) {
        errors.push(`${record.topicSlug}: ${recordErrors.join(", ")}`);
      }
    }

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain("patience");
  });

  it("round-trip export/import preserves data", () => {
    const storage = createMockStorage();
    const original: UrduTranslationsStore = {
      version: 1,
      records: {
        patience: {
          topicSlug: "patience",
          englishTitle: "Patience",
          arabicTitle: "الصبر",
          proposedUrduTitle: "صبر",
          reviewState: "reviewed",
          translatorAttribution: "Scholar X",
          lastReviewedDate: "2026-11-10",
          knownLimitations: ["Limited to title"],
        },
      },
      lastUpdated: "2026-11-10T00:00:00.000Z",
    };

    // Export
    writeStoreToStorage(storage, original);
    const exported = readStoreFromStorage(storage);

    // Import to a fresh storage
    const freshStorage = createMockStorage();
    writeStoreToStorage(freshStorage, exported);
    const reimported = readStoreFromStorage(freshStorage);

    expect(reimported.records.patience.topicSlug).toBe("patience");
    expect(reimported.records.patience.proposedUrduTitle).toBe("صبر");
    expect(reimported.records.patience.reviewState).toBe("reviewed");
    expect(reimported.records.patience.translatorAttribution).toBe("Scholar X");
  });
});
