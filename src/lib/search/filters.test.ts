// Unit tests for search filter parsing, validation, and URL building.
//
// These tests verify the behavior extracted from the search page and filters
// component: parameter validation, query preservation, filter application,
// and URL construction. The goal is to ensure consistent behavior across
// default, edition-scoped, and tafsir search modes.

import { describe, expect, it } from "vitest";
import {
  buildFilterUrl,
  buildSearchInUrl,
  parseSearchFilters,
  passesStructuralFilters,
  buildRevelationMap,
} from "./filters";

// --- Test fixtures -----------------------------------------------------------

const surahIndex = [
  { id: 1, revelation: "meccan" as const },
  { id: 2, revelation: "medinan" as const },
  { id: 3, revelation: "meccan" as const },
  { id: 114, revelation: "meccan" as const },
];

const revelationMap = buildRevelationMap(surahIndex);

// --- parseSearchFilters ------------------------------------------------------

describe("parseSearchFilters", () => {
  describe("query parsing", () => {
    it("trims whitespace from query", () => {
      const result = parseSearchFilters({ q: "  patience  " });
      expect(result.query).toBe("patience");
    });

    it("returns empty string for missing query", () => {
      const result = parseSearchFilters({});
      expect(result.query).toBe("");
    });

    it("returns empty string for whitespace-only query", () => {
      const result = parseSearchFilters({ q: "   " });
      expect(result.query).toBe("");
    });
  });

  describe("surah validation", () => {
    it("accepts valid surah ID 1", () => {
      const result = parseSearchFilters({ surah: "1" });
      expect(result.surahId).toBe(1);
    });

    it("accepts valid surah ID 114", () => {
      const result = parseSearchFilters({ surah: "114" });
      expect(result.surahId).toBe(114);
    });

    it("rejects surah ID 0", () => {
      const result = parseSearchFilters({ surah: "0" });
      expect(result.surahId).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("rejects surah ID 115", () => {
      const result = parseSearchFilters({ surah: "115" });
      expect(result.surahId).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("rejects non-integer surah", () => {
      const result = parseSearchFilters({ surah: "2.5" });
      expect(result.surahId).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("rejects non-numeric surah", () => {
      const result = parseSearchFilters({ surah: "abc" });
      expect(result.surahId).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("returns null for missing surah", () => {
      const result = parseSearchFilters({});
      expect(result.surahId).toBeNull();
      expect(result.invalidFilters).toBe(false);
    });
  });

  describe("juz validation", () => {
    it("accepts valid juz 1", () => {
      const result = parseSearchFilters({ juz: "1" });
      expect(result.juzNum).toBe(1);
    });

    it("accepts valid juz 30", () => {
      const result = parseSearchFilters({ juz: "30" });
      expect(result.juzNum).toBe(30);
    });

    it("rejects juz 0", () => {
      const result = parseSearchFilters({ juz: "0" });
      expect(result.juzNum).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("rejects juz 31", () => {
      const result = parseSearchFilters({ juz: "31" });
      expect(result.juzNum).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("rejects non-integer juz", () => {
      const result = parseSearchFilters({ juz: "15.5" });
      expect(result.juzNum).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });
  });

  describe("revelation type validation", () => {
    it("accepts 'meccan'", () => {
      const result = parseSearchFilters({ type: "meccan" });
      expect(result.revelationType).toBe("meccan");
    });

    it("accepts 'medinan'", () => {
      const result = parseSearchFilters({ type: "medinan" });
      expect(result.revelationType).toBe("medinan");
    });

    it("rejects invalid revelation type", () => {
      const result = parseSearchFilters({ type: "unknown" });
      expect(result.revelationType).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });
  });

  describe("topic validation", () => {
    it("accepts valid canonical topic slug 'patience'", () => {
      const result = parseSearchFilters({ topic: "patience" });
      expect(result.topicSlug).toBe("patience");
      expect(result.topicRefs).toBeInstanceOf(Set);
      expect(result.topicRefs!.size).toBeGreaterThan(0);
    });

    it("accepts valid canonical topic slug 'justice'", () => {
      const result = parseSearchFilters({ topic: "justice" });
      expect(result.topicSlug).toBe("justice");
      expect(result.topicRefs).toBeInstanceOf(Set);
    });

    it("rejects unknown topic slug", () => {
      const result = parseSearchFilters({ topic: "nonexistent" });
      expect(result.topicSlug).toBeNull();
      expect(result.topicRefs).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });

    it("returns null for missing topic", () => {
      const result = parseSearchFilters({});
      expect(result.topicSlug).toBeNull();
      expect(result.topicRefs).toBeNull();
      expect(result.invalidFilters).toBe(false);
    });
  });

  describe("language validation", () => {
    it("accepts 'ar'", () => {
      const result = parseSearchFilters({ language: "ar" });
      expect(result.language).toBe("ar");
    });

    it("accepts 'en'", () => {
      const result = parseSearchFilters({ language: "en" });
      expect(result.language).toBe("en");
    });

    it("rejects invalid language", () => {
      const result = parseSearchFilters({ language: "ur" });
      expect(result.language).toBeNull();
      expect(result.invalidFilters).toBe(true);
    });
  });

  describe("edition and mode mutual exclusion", () => {
    it("sets tafsirMode when mode is 'tafsir'", () => {
      const result = parseSearchFilters({ mode: "tafsir" });
      expect(result.tafsirMode).toBe(true);
      expect(result.editionId).toBeNull();
    });

    it("sets editionId when edition is provided and mode is not tafsir", () => {
      const result = parseSearchFilters({ edition: "en.pickthall" });
      expect(result.editionId).toBe("en.pickthall");
      expect(result.tafsirMode).toBe(false);
    });

    it("mode takes precedence over edition when both are present", () => {
      const result = parseSearchFilters({ mode: "tafsir", edition: "en.pickthall" });
      expect(result.tafsirMode).toBe(true);
      expect(result.editionId).toBeNull();
    });
  });

  describe("hasFilters flag", () => {
    it("returns false when no filters are present", () => {
      const result = parseSearchFilters({});
      expect(result.hasFilters).toBe(false);
    });

    it("returns true when surah is present", () => {
      const result = parseSearchFilters({ surah: "2" });
      expect(result.hasFilters).toBe(true);
    });

    it("returns true when topic is present", () => {
      const result = parseSearchFilters({ topic: "patience" });
      expect(result.hasFilters).toBe(true);
    });

    it("returns true when tafsirMode is active", () => {
      const result = parseSearchFilters({ mode: "tafsir" });
      expect(result.hasFilters).toBe(true);
    });
  });

  describe("invalidFilters flag", () => {
    it("returns false when all filters are valid", () => {
      const result = parseSearchFilters({ surah: "2", juz: "1", topic: "patience" });
      expect(result.invalidFilters).toBe(false);
    });

    it("returns true when any filter is invalid", () => {
      const result = parseSearchFilters({ surah: "999", juz: "1", topic: "patience" });
      expect(result.invalidFilters).toBe(true);
    });

    it("returns true when topic is invalid even if other filters are valid", () => {
      const result = parseSearchFilters({ surah: "2", topic: "nonexistent" });
      expect(result.invalidFilters).toBe(true);
    });
  });
});

// --- passesStructuralFilters -------------------------------------------------

describe("passesStructuralFilters", () => {
  const baseFilters = parseSearchFilters({});

  it("passes all verses when no filters are active", () => {
    expect(passesStructuralFilters(1, 1, baseFilters, revelationMap)).toBe(true);
    expect(passesStructuralFilters(2, 255, baseFilters, revelationMap)).toBe(true);
    expect(passesStructuralFilters(114, 6, baseFilters, revelationMap)).toBe(true);
  });

  it("filters by surah ID", () => {
    const filters = parseSearchFilters({ surah: "2" });
    expect(passesStructuralFilters(2, 255, filters, revelationMap)).toBe(true);
    expect(passesStructuralFilters(1, 1, filters, revelationMap)).toBe(false);
    expect(passesStructuralFilters(3, 1, filters, revelationMap)).toBe(false);
  });

  it("filters by revelation type", () => {
    const filters = parseSearchFilters({ type: "meccan" });
    expect(passesStructuralFilters(1, 1, filters, revelationMap)).toBe(true);
    expect(passesStructuralFilters(3, 1, filters, revelationMap)).toBe(true);
    expect(passesStructuralFilters(2, 255, filters, revelationMap)).toBe(false);
  });

  it("filters by topic", () => {
    const filters = parseSearchFilters({ topic: "patience" });
    // 2:153 is in the patience topic
    expect(passesStructuralFilters(2, 153, filters, revelationMap)).toBe(true);
    // 1:1 is not in the patience topic
    expect(passesStructuralFilters(1, 1, filters, revelationMap)).toBe(false);
  });

  it("combines multiple filters with AND logic", () => {
    const filters = parseSearchFilters({ surah: "2", topic: "patience" });
    // 2:153 is in surah 2 AND in patience topic
    expect(passesStructuralFilters(2, 153, filters, revelationMap)).toBe(true);
    // 3:1 is in patience topic but not surah 2
    expect(passesStructuralFilters(3, 1, filters, revelationMap)).toBe(false);
    // 2:1 is in surah 2 but not in patience topic
    expect(passesStructuralFilters(2, 1, filters, revelationMap)).toBe(false);
  });
});

// --- buildFilterUrl ----------------------------------------------------------

describe("buildFilterUrl", () => {
  it("preserves query when updating a filter", () => {
    const params = new URLSearchParams("q=mercy");
    const url = buildFilterUrl(params, "topic", "patience");
    expect(url).toBe("/search?q=mercy&topic=patience");
  });

  it("preserves other filters when updating one filter", () => {
    const params = new URLSearchParams("q=mercy&surah=2&juz=1");
    const url = buildFilterUrl(params, "topic", "patience");
    expect(url).toContain("q=mercy");
    expect(url).toContain("surah=2");
    expect(url).toContain("juz=1");
    expect(url).toContain("topic=patience");
  });

  it("clears a filter when value is empty", () => {
    const params = new URLSearchParams("q=mercy&topic=patience");
    const url = buildFilterUrl(params, "topic", "");
    expect(url).toBe("/search?q=mercy");
    expect(url).not.toContain("topic=");
  });

  it("returns /search when all filters are cleared", () => {
    const params = new URLSearchParams("topic=patience");
    const url = buildFilterUrl(params, "topic", "");
    expect(url).toBe("/search");
  });

  it("clears mode when setting edition", () => {
    const params = new URLSearchParams("q=mercy&mode=tafsir");
    const url = buildFilterUrl(params, "edition", "en.pickthall");
    expect(url).toContain("edition=en.pickthall");
    expect(url).not.toContain("mode=tafsir");
  });

  it("clears edition when setting mode", () => {
    const params = new URLSearchParams("q=mercy&edition=en.pickthall");
    const url = buildFilterUrl(params, "mode", "tafsir");
    expect(url).toContain("mode=tafsir");
    expect(url).not.toContain("edition=en.pickthall");
  });

  it("preserves edition when updating non-edition filter", () => {
    const params = new URLSearchParams("q=mercy&edition=en.pickthall");
    const url = buildFilterUrl(params, "topic", "patience");
    expect(url).toContain("edition=en.pickthall");
    expect(url).toContain("topic=patience");
  });
});

// --- buildSearchInUrl --------------------------------------------------------

describe("buildSearchInUrl", () => {
  it("clears both edition and mode when value is 'default'", () => {
    const params = new URLSearchParams("q=mercy&mode=tafsir");
    const url = buildSearchInUrl(params, "default");
    expect(url).toBe("/search?q=mercy");
    expect(url).not.toContain("mode=");
    expect(url).not.toContain("edition=");
  });

  it("sets mode to 'tafsir' when value is 'tafsir'", () => {
    const params = new URLSearchParams("q=mercy");
    const url = buildSearchInUrl(params, "tafsir");
    expect(url).toBe("/search?q=mercy&mode=tafsir");
  });

  it("sets edition when value is an edition ID", () => {
    const params = new URLSearchParams("q=mercy");
    const url = buildSearchInUrl(params, "en.pickthall");
    expect(url).toBe("/search?q=mercy&edition=en.pickthall");
  });

  it("preserves other filters when changing search scope", () => {
    const params = new URLSearchParams("q=mercy&surah=2&topic=patience");
    const url = buildSearchInUrl(params, "tafsir");
    expect(url).toContain("q=mercy");
    expect(url).toContain("surah=2");
    expect(url).toContain("topic=patience");
    expect(url).toContain("mode=tafsir");
  });
});
