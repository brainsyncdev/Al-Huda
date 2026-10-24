/**
 * Unit tests for autocomplete suggestion engine.
 *
 * Verifies:
 * - Reference parsing and navigation
 * - Surah name matching (prefix and substring)
 * - Topic title matching (English and Arabic)
 * - Deterministic ordering (reference > surah > topic)
 * - Empty/short query handling
 * - Invalid reference handling
 */

import { describe, expect, it } from "vitest";
import { getSuggestions } from "./autocomplete";

describe("getSuggestions", () => {
  describe("empty and short queries", () => {
    it("returns empty array for empty string", () => {
      expect(getSuggestions("")).toEqual([]);
    });

    it("returns empty array for whitespace-only string", () => {
      expect(getSuggestions("   ")).toEqual([]);
    });

    it("returns empty array for single character", () => {
      expect(getSuggestions("a")).toEqual([]);
    });

    it("returns suggestions for two characters", () => {
      const results = getSuggestions("al");
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe("reference suggestions", () => {
    it("suggests ayah for numeric reference pattern", () => {
      const results = getSuggestions("2:255");
      expect(results.length).toBeGreaterThan(0);
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/ayah/2/255");
      expect(ref?.label).toContain("Al-Baqarah");
      expect(ref?.label).toContain("255");
    });

    it("suggests surah for surah-only numeric reference", () => {
      const results = getSuggestions("36");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/quran/ya-sin");
      expect(ref?.label).toBe("Ya-Sin");
    });

    it("suggests ayah for name + ayah pattern", () => {
      const results = getSuggestions("al-baqarah 255");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/ayah/2/255");
    });

    it("suggests surah for name-only pattern", () => {
      const results = getSuggestions("al-baqarah");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/quran/al-baqarah");
    });

    it("returns no reference suggestion for invalid reference", () => {
      const results = getSuggestions("999:999");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeUndefined();
    });

    it("returns no reference suggestion for unparseable pattern", () => {
      const results = getSuggestions("not a reference");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeUndefined();
    });

    it("prioritizes reference suggestions over surah/topic", () => {
      const results = getSuggestions("2:255");
      expect(results[0].type).toBe("reference");
      expect(results[0].priority).toBe(0);
    });
  });

  describe("surah suggestions", () => {
    it("matches surah by transliteration prefix", () => {
      const results = getSuggestions("al-ba");
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs.length).toBeGreaterThan(0);
      const baqarah = surahs.find((s) => s.label === "Al-Baqarah");
      expect(baqarah).toBeDefined();
      expect(baqarah?.href).toBe("/quran/al-baqarah");
    });

    it("matches surah by transliteration substring", () => {
      const results = getSuggestions("baqarah");
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs.length).toBeGreaterThan(0);
      const baqarah = surahs.find((s) => s.label === "Al-Baqarah");
      expect(baqarah).toBeDefined();
    });

    it("matches surah case-insensitively", () => {
      const results = getSuggestions("AL-BA");
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs.length).toBeGreaterThan(0);
      const baqarah = surahs.find((s) => s.label === "Al-Baqarah");
      expect(baqarah).toBeDefined();
    });

    it("includes meaning and ayah count in sublabel", () => {
      const results = getSuggestions("al-baqarah");
      const surah = results.find((s) => s.type === "surah" && s.label === "Al-Baqarah");
      expect(surah?.sublabel).toContain("The Cow");
      expect(surah?.sublabel).toContain("286");
    });

    it("sorts surahs alphabetically within type", () => {
      const results = getSuggestions("al-");
      const surahs = results.filter((s) => s.type === "surah");
      for (let i = 1; i < surahs.length; i++) {
        expect(surahs[i - 1].label.localeCompare(surahs[i].label)).toBeLessThanOrEqual(0);
      }
    });

    it("limits total suggestions to 10", () => {
      const results = getSuggestions("al-");
      expect(results.length).toBeLessThanOrEqual(10);
    });
  });

  describe("topic suggestions", () => {
    it("matches topic by English title prefix", () => {
      const results = getSuggestions("pat");
      const topics = results.filter((s) => s.type === "topic");
      expect(topics.length).toBeGreaterThan(0);
      const patience = topics.find((s) => s.label === "Patience");
      expect(patience).toBeDefined();
      expect(patience?.href).toBe("/topics/patience");
    });

    it("matches topic by English title substring", () => {
      const results = getSuggestions("tience");
      const topics = results.filter((s) => s.type === "topic");
      expect(topics.length).toBeGreaterThan(0);
      const patience = topics.find((s) => s.label === "Patience");
      expect(patience).toBeDefined();
    });

    it("matches topic by Arabic title", () => {
      const results = getSuggestions("الصبر");
      const topics = results.filter((s) => s.type === "topic");
      expect(topics.length).toBeGreaterThan(0);
      const patience = topics.find((s) => s.label === "Patience");
      expect(patience).toBeDefined();
    });

    it("includes Arabic title in sublabel", () => {
      const results = getSuggestions("patience");
      const topic = results.find((s) => s.type === "topic" && s.label === "Patience");
      expect(topic?.sublabel).toBe("الصبر");
    });

    it("sorts topics alphabetically within type", () => {
      const results = getSuggestions("a");
      const topics = results.filter((s) => s.type === "topic");
      for (let i = 1; i < topics.length; i++) {
        expect(topics[i - 1].label.localeCompare(topics[i].label)).toBeLessThanOrEqual(0);
      }
    });
  });

  describe("suggestion ordering", () => {
    it("prioritizes reference > surah > topic", () => {
      // Query that matches all three types
      const results = getSuggestions("al-baqarah");
      const types = results.map((s) => s.type);
      const refIndex = types.indexOf("reference");
      const surahIndex = types.indexOf("surah");
      const topicIndex = types.findIndex((t) => t === "topic");

      // Reference should come first if present
      if (refIndex !== -1) {
        expect(refIndex).toBe(0);
      }

      // Surahs should come before topics
      if (surahIndex !== -1 && topicIndex !== -1) {
        expect(surahIndex).toBeLessThan(topicIndex);
      }
    });

    it("returns empty array when no matches found", () => {
      const results = getSuggestions("xyz123nonexistent");
      expect(results).toEqual([]);
    });
  });

  describe("deterministic behavior", () => {
    it("returns same results for same query", () => {
      const results1 = getSuggestions("mercy");
      const results2 = getSuggestions("mercy");
      expect(results1).toEqual(results2);
    });

    it("trims whitespace before matching", () => {
      const results1 = getSuggestions("  patience  ");
      const results2 = getSuggestions("patience");
      expect(results1).toEqual(results2);
    });
  });
});

describe("suggestion structure", () => {
  it("all suggestions have required fields", () => {
    const results = getSuggestions("al-baqarah");
    for (const suggestion of results) {
      expect(suggestion.type).toBeDefined();
      expect(suggestion.label).toBeDefined();
      expect(suggestion.href).toBeDefined();
      expect(suggestion.priority).toBeDefined();
      expect(["surah", "topic", "reference"]).toContain(suggestion.type);
      expect(suggestion.href.startsWith("/")).toBe(true);
    }
  });

  it("reference suggestions have correct href format", () => {
    const results = getSuggestions("2:255");
    const ref = results.find((s) => s.type === "reference");
    expect(ref?.href).toMatch(/^\/ayah\/\d+\/\d+$/);
  });

  it("surah suggestions have correct href format", () => {
    const results = getSuggestions("al-baqarah");
    const surah = results.find((s) => s.type === "surah");
    expect(surah?.href).toMatch(/^\/quran\/[a-z-]+$/);
  });

  it("topic suggestions have correct href format", () => {
    const results = getSuggestions("patience");
    const topic = results.find((s) => s.type === "topic");
    expect(topic?.href).toMatch(/^\/topics\/[a-z-]+$/);
  });
});