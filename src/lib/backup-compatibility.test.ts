import { describe, it, expect, vi } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

// Mock React context modules to avoid JSX parsing issues
vi.mock("@/lib/prefs/context", () => {
  const ARABIC_SIZES = ["sm", "md", "lg", "xl"];
  const LINE_HEIGHTS = ["compact", "normal", "loose"];
  
  const DEFAULT_PREFS = {
    arabicSize: "md",
    lineHeight: "normal",
    showTranslation: true,
    showTransliteration: false,
    translationId: "en.sahih",
    showAudio: false,
    reciterId: "ar.alafasy",
    parallelMode: false,
    parallelTranslationIds: [],
  };
  
  const normalizePrefs = (raw: unknown) => {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      return DEFAULT_PREFS;
    }
    const parsed = raw as Record<string, unknown>;
    return {
      arabicSize: ARABIC_SIZES.includes(parsed.arabicSize as string)
        ? parsed.arabicSize
        : DEFAULT_PREFS.arabicSize,
      lineHeight: LINE_HEIGHTS.includes(parsed.lineHeight as string)
        ? parsed.lineHeight
        : DEFAULT_PREFS.lineHeight,
      showTranslation: typeof parsed.showTranslation === "boolean" 
        ? parsed.showTranslation 
        : DEFAULT_PREFS.showTranslation,
      showTransliteration: typeof parsed.showTransliteration === "boolean" 
        ? parsed.showTransliteration 
        : DEFAULT_PREFS.showTransliteration,
      translationId: typeof parsed.translationId === "string" 
        ? parsed.translationId 
        : DEFAULT_PREFS.translationId,
      showAudio: typeof parsed.showAudio === "boolean" 
        ? parsed.showAudio 
        : DEFAULT_PREFS.showAudio,
      reciterId: typeof parsed.reciterId === "string" 
        ? parsed.reciterId 
        : DEFAULT_PREFS.reciterId,
      parallelMode: typeof parsed.parallelMode === "boolean" 
        ? parsed.parallelMode 
        : DEFAULT_PREFS.parallelMode,
      parallelTranslationIds: Array.isArray(parsed.parallelTranslationIds) 
        ? parsed.parallelTranslationIds 
        : DEFAULT_PREFS.parallelTranslationIds,
    };
  };
  
  return { DEFAULT_PREFS, normalizePrefs };
});

vi.mock("@/lib/quran/translations", () => ({
  DEFAULT_TRANSLATION_ID: "en.sahih",
  getTranslation: (id: string) => id === "en.sahih" || id === "en.pickthall" ? { id } : undefined,
}));

vi.mock("@/lib/quran/audio", () => ({
  DEFAULT_RECITER_ID: "ar.alafasy",
  getReciter: (id: string) => id === "ar.alafasy" ? { id } : undefined,
}));

import { parseBackup, buildBackup, BACKUP_VERSION } from "./backup";

const FIXTURES_DIR = join(__dirname, "..", "..", "tests", "fixtures", "backup");

function loadFixture(version: number): string {
  const filename = `v${version}-backup.json`;
  const filePath = join(FIXTURES_DIR, filename);
  return readFileSync(filePath, "utf-8");
}

describe("Backup Compatibility - Version Migration", () => {
  describe("v3 Migration", () => {
    it("parses v3 backup successfully", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(3);
      }
    });

    it("preserves bookmarks from v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.bookmarks).toHaveLength(2);
        expect(result.data.library.bookmarks[0].surah).toBe(2);
        expect(result.data.library.bookmarks[0].ayah).toBe(255);
      }
    });

    it("preserves notes from v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.notes).toHaveLength(1);
        expect(result.data.library.notes[0].surah).toBe(1);
        expect(result.data.library.notes[0].ayah).toBe(1);
      }
    });

    it("preserves reading progress from v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.progress).toHaveLength(1);
        expect(result.data.library.progress[0].surah).toBe(1);
      }
    });

    it("preserves revision state from v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Object.keys(result.data.revision.items)).toHaveLength(1);
        expect(result.data.revision.items["2:255"]).toBeDefined();
        expect(result.data.revision.events).toHaveLength(1);
      }
    });

    it("preserves preferences from v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.preferences.arabicSize).toBe("lg");
      }
    });

    it("preserves paths state from v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.paths.selectedGoal).toBe("regular-reader");
        expect(result.data.paths.onboardingCompleted).toBe(true);
      }
    });

    it("provides defaults for missing sections in v3", () => {
      const text = loadFixture(3);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.quiz.attempts).toEqual([]);
        expect(result.data.readingPlans.targets).toEqual([]);
        expect(result.data.journeys.progress).toEqual({});
        expect(result.data.reflections.reflections).toEqual([]);
      }
    });
  });

  describe("v4 Migration", () => {
    it("parses v4 backup successfully", () => {
      const text = loadFixture(4);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(4);
      }
    });

    it("preserves translationId from v4", () => {
      const text = loadFixture(4);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.preferences.translationId).toBe("en.sahih");
      }
    });

    it("preserves bookmarks from v4", () => {
      const text = loadFixture(4);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.bookmarks).toHaveLength(3);
      }
    });

    it("preserves notes from v4", () => {
      const text = loadFixture(4);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.notes).toHaveLength(2);
      }
    });

    it("preserves revision items from v4", () => {
      const text = loadFixture(4);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Object.keys(result.data.revision.items)).toHaveLength(2);
      }
    });
  });

  describe("v5 Migration", () => {
    it("parses v5 backup successfully", () => {
      const text = loadFixture(5);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(5);
      }
    });

    it("preserves quiz attempts from v5", () => {
      const text = loadFixture(5);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.quiz.attempts).toHaveLength(1);
        expect(result.data.quiz.attempts[0].id).toBe("attempt-v5-1");
      }
    });

    it("preserves quiz responses from v5", () => {
      const text = loadFixture(5);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const attempt = result.data.quiz.attempts[0];
        expect(attempt.responses["q-v5-1"]).toBeDefined();
      }
    });

    it("preserves quiz configuration from v5", () => {
      const text = loadFixture(5);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const attempt = result.data.quiz.attempts[0];
        expect(attempt.config).toBeDefined();
        expect(attempt.config?.source.kind).toBe("default");
      }
    });
  });

  describe("v6 Migration", () => {
    it("parses v6 backup successfully", () => {
      const text = loadFixture(6);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(6);
      }
    });

    it("preserves reading plans from v6", () => {
      const text = loadFixture(6);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.readingPlans.targets).toHaveLength(2);
        expect(result.data.readingPlans.targets[0].id).toBe("plan-v6-1");
      }
    });

    it("preserves reading plan progress from v6", () => {
      const text = loadFixture(6);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const plan = result.data.readingPlans.targets[0];
        expect(plan.currentPosition.surah).toBe(18);
        expect(plan.currentPosition.ayah).toBe(51);
      }
    });
  });

  describe("v7 Migration", () => {
    it("parses v7 backup successfully", () => {
      const text = loadFixture(7);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(7);
      }
    });

    it("preserves collections from v7", () => {
      const text = loadFixture(7);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.collections).toHaveLength(2);
        expect(result.data.library.collections[0].id).toBe("coll-v7-1");
        expect(result.data.library.collections[0].name).toBe("Verses of Mercy");
      }
    });

    it("preserves collection ayat from v7", () => {
      const text = loadFixture(7);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.collectionAyat).toHaveLength(3);
        expect(result.data.library.collectionAyat[0].collectionId).toBe("coll-v7-1");
      }
    });

    it("preserves audio preferences from v7", () => {
      const text = loadFixture(7);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.preferences.showAudio).toBe(true);
        expect(result.data.preferences.reciterId).toBe("ar.alafasy");
      }
    });
  });

  describe("v8 Migration", () => {
    it("parses v8 backup successfully", () => {
      const text = loadFixture(8);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(8);
      }
    });

    it("preserves study journeys from v8", () => {
      const text = loadFixture(8);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.journeys.progress["understanding-tawheed"]).toBeDefined();
      }
    });

    it("preserves journey progress from v8", () => {
      const text = loadFixture(8);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const progress = result.data.journeys.progress["understanding-tawheed"];
        expect(progress.completedStages).toEqual([1, 2, 3]);
        expect(progress.journeyVersion).toBe(1);
      }
    });
  });

  describe("v9 Migration", () => {
    it("parses v9 backup successfully", () => {
      const text = loadFixture(9);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.sourceVersion).toBe(9);
      }
    });

    it("preserves reflections from v9", () => {
      const text = loadFixture(9);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.reflections.reflections).toHaveLength(3);
        expect(result.data.reflections.reflections[0].id).toBe("ref-v9-1");
      }
    });

    it("preserves reflection content from v9", () => {
      const text = loadFixture(9);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        const reflection = result.data.reflections.reflections[0];
        expect(reflection.targetType).toBe("ayah");
        expect(reflection.targetRef).toBe("2:255");
        expect(reflection.content).toContain("Allah's complete knowledge");
      }
    });

    it("preserves all data comprehensively in v9", () => {
      const text = loadFixture(9);
      const result = parseBackup(text);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.library.bookmarks).toHaveLength(3);
        expect(result.data.library.notes).toHaveLength(2);
        expect(result.data.library.collections).toHaveLength(2);
        expect(result.data.library.collectionAyat).toHaveLength(2);
        expect(Object.keys(result.data.revision.items)).toHaveLength(2);
        expect(result.data.quiz.attempts).toHaveLength(1);
        expect(result.data.readingPlans.targets).toHaveLength(1);
        expect(Object.keys(result.data.journeys.progress)).toHaveLength(1);
        expect(result.data.reflections.reflections).toHaveLength(3);
      }
    });
  });
});

describe("Backup Compatibility - Destructive Import Protection", () => {
  it("rejects invalid JSON", () => {
    const result = parseBackup("not valid json {");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("not valid JSON");
    }
  });

  it("rejects non-object JSON", () => {
    const result = parseBackup('"just a string"');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("not an Al-Huda backup");
    }
  });

  it("rejects array JSON", () => {
    const result = parseBackup("[1, 2, 3]");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("not an Al-Huda backup");
    }
  });

  it("rejects null JSON", () => {
    const result = parseBackup("null");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("not an Al-Huda backup");
    }
  });

  it("rejects unsupported version (too old)", () => {
    const backup = {
      format: "al-huda-backup",
      version: 2,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("version 2");
      expect(result.error).toContain("versions 3–9");
    }
  });

  it("rejects unsupported version (too new)", () => {
    const backup = {
      format: "al-huda-backup",
      version: 10,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("version 10");
    }
  });

  it("rejects files larger than 5MB", () => {
    const largeText = "x".repeat(6 * 1024 * 1024);
    const result = parseBackup(largeText);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("larger than 5 MB");
    }
  });

  it("accepts files just under 5MB", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: { bookmarks: [], notes: [], progress: [], collections: [], collectionAyat: [] },
      revision: { items: {}, events: [], settings: { ladderId: "default" } },
      preferences: {
        arabicSize: "md",
        lineHeight: "normal",
        showTranslation: true,
        showTransliteration: false,
        translationId: "en.sahih",
        showAudio: false,
        reciterId: "ar.alafasy",
        parallelMode: false,
        parallelTranslationIds: [],
      },
      paths: { progress: {}, selectedGoal: null, onboardingCompleted: false },
      quiz: { attempts: [], currentAttemptId: null },
      readingPlans: { targets: [] },
      journeys: { progress: {} },
      reflections: { version: 1, reflections: [] },
    };
    const text = JSON.stringify(backup);
    const paddedText = text + " ".repeat(4 * 1024 * 1024 - text.length);
    const result = parseBackup(paddedText);
    expect(result.ok).toBe(true);
  });

  it("handles missing library gracefully", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.library.bookmarks).toEqual([]);
      expect(result.data.library.notes).toEqual([]);
    }
  });

  it("handles malformed bookmarks", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: {
        bookmarks: [
          { surah: "not-a-number", ayah: 1, savedAt: "2024-01-01" },
          { surah: 2, ayah: 255, savedAt: "2024-01-01" },
        ],
        notes: [],
        progress: [],
        collections: [],
        collectionAyat: [],
      },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.library.bookmarks).toHaveLength(1);
      expect(result.data.library.bookmarks[0].surah).toBe(2);
    }
  });

  it("handles malformed notes", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: {
        bookmarks: [],
        notes: [
          { surah: "invalid", ayah: 1, text: "test", tags: [], createdAt: "", updatedAt: "" },
          { surah: 1, ayah: 1, text: "valid note", tags: [], createdAt: "2024-01-01", updatedAt: "2024-01-01" },
        ],
        progress: [],
        collections: [],
        collectionAyat: [],
      },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.library.notes).toHaveLength(1);
      expect(result.data.library.notes[0].text).toBe("valid note");
    }
  });

  it("handles invalid revision items", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: { bookmarks: [], notes: [], progress: [], collections: [], collectionAyat: [] },
      revision: {
        items: {
          "invalid": { reference: "invalid", surah: 999, ayah: 999 },
          "2:255": {
            reference: "2:255",
            surah: 2,
            ayah: 255,
            owner: "local",
            ladderId: "default",
            step: 1,
            dueDate: "2024-12-31",
            addedAt: "2024-01-01",
            lastReviewedAt: "2024-01-01",
            reviewCount: 1,
          },
        },
        events: [],
        settings: { ladderId: "default" },
      },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(Object.keys(result.data.revision.items)).toHaveLength(1);
      expect(result.data.revision.items["2:255"]).toBeDefined();
    }
  });

  it("handles invalid preferences", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: { bookmarks: [], notes: [], progress: [], collections: [], collectionAyat: [] },
      revision: { items: {}, events: [], settings: { ladderId: "default" } },
      preferences: {
        arabicSize: "invalid-size",
        lineHeight: "invalid-height",
        showTranslation: "not-boolean",
        showTransliteration: "not-boolean",
        translationId: "invalid.translation",
        showAudio: "not-boolean",
        reciterId: "invalid.reciter",
        parallelMode: "not-boolean",
        parallelTranslationIds: "not-array",
      },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.preferences.arabicSize).toBe("md");
      expect(result.data.preferences.lineHeight).toBe("normal");
      expect(result.data.preferences.showTranslation).toBe(true);
    }
  });

  it("handles invalid reflections", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: { bookmarks: [], notes: [], progress: [], collections: [], collectionAyat: [] },
      revision: { items: {}, events: [], settings: { ladderId: "default" } },
      preferences: {
        arabicSize: "md",
        lineHeight: "normal",
        showTranslation: true,
        showTransliteration: false,
        translationId: "en.sahih",
        showAudio: false,
        reciterId: "ar.alafasy",
        parallelMode: false,
        parallelTranslationIds: [],
      },
      paths: { progress: {}, selectedGoal: null, onboardingCompleted: false },
      quiz: { attempts: [], currentAttemptId: null },
      readingPlans: { targets: [] },
      journeys: { progress: {} },
      reflections: {
        version: 1,
        reflections: [
          { id: "", targetType: "ayah", targetRef: "2:255", content: "test", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
          { id: "ref-1", targetType: "invalid-type", targetRef: "2:255", content: "test", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
          { id: "ref-2", targetType: "ayah", targetRef: "2:255", content: "valid", createdAt: "2024-01-01", updatedAt: "2024-01-01" },
        ],
      },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.reflections.reflections).toHaveLength(1);
      expect(result.data.reflections.reflections[0].id).toBe("ref-2");
    }
  });
});

describe("Backup Compatibility - Data Integrity", () => {
  it("re-export produces valid v9 backup", () => {
    const text = loadFixture(9);
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const reexported = buildBackup(result.data);
      expect(reexported.version).toBe(BACKUP_VERSION);
      expect(reexported.format).toBe("al-huda-backup");
      expect(reexported.app).toBe("Al-Huda");
    }
  });

  it("preserves data through re-export cycle", () => {
    const text = loadFixture(9);
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const reexported = buildBackup(result.data);
      const reimported = parseBackup(JSON.stringify(reexported));
      expect(reimported.ok).toBe(true);
      if (reimported.ok) {
        expect(reimported.data.library.bookmarks).toHaveLength(3);
        expect(reimported.data.library.notes).toHaveLength(2);
        expect(reimported.data.reflections.reflections).toHaveLength(3);
      }
    }
  });

  it("handles empty backups", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: { bookmarks: [], notes: [], progress: [], collections: [], collectionAyat: [] },
      revision: { items: {}, events: [], settings: { ladderId: "default" } },
      preferences: {
        arabicSize: "md",
        lineHeight: "normal",
        showTranslation: true,
        showTransliteration: false,
        translationId: "en.sahih",
        showAudio: false,
        reciterId: "ar.alafasy",
        parallelMode: false,
        parallelTranslationIds: [],
      },
      paths: { progress: {}, selectedGoal: null, onboardingCompleted: false },
      quiz: { attempts: [], currentAttemptId: null },
      readingPlans: { targets: [] },
      journeys: { progress: {} },
      reflections: { version: 1, reflections: [] },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.library.bookmarks).toHaveLength(0);
      expect(result.data.reflections.reflections).toHaveLength(0);
    }
  });

  it("handles duplicate identifiers", () => {
    const backup = {
      format: "al-huda-backup",
      version: 9,
      app: "Al-Huda",
      exportedAt: new Date().toISOString(),
      library: {
        bookmarks: [
          { surah: 2, ayah: 255, savedAt: "2024-01-01" },
          { surah: 2, ayah: 255, savedAt: "2024-01-02" },
        ],
        notes: [],
        progress: [],
        collections: [],
        collectionAyat: [],
      },
      revision: { items: {}, events: [], settings: { ladderId: "default" } },
      preferences: {
        arabicSize: "md",
        lineHeight: "normal",
        showTranslation: true,
        showTransliteration: false,
        translationId: "en.sahih",
        showAudio: false,
        reciterId: "ar.alafasy",
        parallelMode: false,
        parallelTranslationIds: [],
      },
      paths: { progress: {}, selectedGoal: null, onboardingCompleted: false },
      quiz: { attempts: [], currentAttemptId: null },
      readingPlans: { targets: [] },
      journeys: { progress: {} },
      reflections: { version: 1, reflections: [] },
    };
    const result = parseBackup(JSON.stringify(backup));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.library.bookmarks).toHaveLength(2);
    }
  });
});
