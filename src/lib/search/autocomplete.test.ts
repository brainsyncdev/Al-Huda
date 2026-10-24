// Unit tests for the autocomplete suggestion engine.
//
// The engine must stay deterministic and canonical-only: suggestions come
// from the surah index, the curated topic list, and the existing reference
// parser — never from search history, trends, or generated content. Every
// suggested destination must be a route that actually exists, so reference
// suggestions are range-checked against each surah's canonical verse count.

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
    it("suggests an ayah for a numeric reference pattern", () => {
      const results = getSuggestions("2:255");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/ayah/2/255");
      expect(ref?.label).toContain("Al-Baqarah");
      expect(ref?.label).toContain("255");
    });

    it("accepts separator variants of the same reference", () => {
      for (const q of ["2.255", "2-255", "2 255"]) {
        const ref = getSuggestions(q).find((s) => s.type === "reference");
        expect(ref?.href).toBe("/ayah/2/255");
      }
    });

    it("suggests the surah page for a surah-only numeric reference", () => {
      const results = getSuggestions("36");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/quran/ya-sin");
      expect(ref?.label).toBe("Ya-Sin");
    });

    it("suggests an ayah for a name + ayah pattern", () => {
      const results = getSuggestions("al-baqarah 255");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/ayah/2/255");
    });

    it("suggests the surah page for a name-only pattern", () => {
      const results = getSuggestions("al-baqarah");
      const ref = results.find((s) => s.type === "reference");
      expect(ref).toBeDefined();
      expect(ref?.href).toBe("/quran/al-baqarah");
    });

    it("accepts the last valid ayah of a surah", () => {
      // Al-Baqarah has 286 ayat.
      const ref = getSuggestions("2:286").find((s) => s.type === "reference");
      expect(ref?.href).toBe("/ayah/2/286");
    });

    it("rejects an ayah beyond the surah's canonical verse count", () => {
      // Al-Baqarah has 286 ayat, so 2:287 must not be suggested.
      const results = getSuggestions("2:287");
      expect(results.find((s) => s.type === "reference")).toBeUndefined();
    });

    it("rejects an out-of-range ayah for a short surah", () => {
      // Al-Fatihah has 7 ayat.
      expect(
        getSuggestions("1:8").find((s) => s.type === "reference")
      ).toBeUndefined();
      expect(
        getSuggestions("1:7").find((s) => s.type === "reference")?.href
      ).toBe("/ayah/1/7");
    });

    it("returns no suggestions for unknown surah numbers", () => {
      expect(getSuggestions("999:999")).toEqual([]);
      expect(getSuggestions("0:1")).toEqual([]);
    });

    it("returns no reference suggestion for an unparseable pattern", () => {
      const results = getSuggestions("not a reference");
      expect(results.find((s) => s.type === "reference")).toBeUndefined();
    });

    it("puts reference suggestions first", () => {
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
      const baqarah = results.find(
        (s) => s.type === "surah" && s.label === "Al-Baqarah"
      );
      expect(baqarah).toBeDefined();
    });

    it("matches surah case-insensitively", () => {
      const results = getSuggestions("AL-BA");
      const baqarah = results.find(
        (s) => s.type === "surah" && s.label === "Al-Baqarah"
      );
      expect(baqarah).toBeDefined();
    });

    it("includes meaning and ayah count in the sublabel", () => {
      const results = getSuggestions("baqarah");
      const surah = results.find(
        (s) => s.type === "surah" && s.label === "Al-Baqarah"
      );
      expect(surah?.sublabel).toContain("The Cow");
      expect(surah?.sublabel).toContain("286");
    });

    it("sorts surahs alphabetically within type", () => {
      const results = getSuggestions("al-");
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs.length).toBeGreaterThan(1);
      for (let i = 1; i < surahs.length; i++) {
        expect(
          surahs[i - 1].label.localeCompare(surahs[i].label)
        ).toBeLessThanOrEqual(0);
      }
    });

    it("limits total suggestions to 10", () => {
      const results = getSuggestions("al-");
      expect(results.length).toBeLessThanOrEqual(10);
    });
  });

  describe("Arabic surah name suggestions", () => {
    it("matches surah by Arabic name prefix", () => {
      // "البقر" — first five letters of البقرة (Al-Baqarah)
      const results = getSuggestions("\u0627\u0644\u0628\u0642\u0631");
      const surahs = results.filter((s) => s.type === "surah");
      const baqarah = surahs.find((s) => s.label === "Al-Baqarah");
      expect(baqarah).toBeDefined();
      expect(baqarah?.href).toBe("/quran/al-baqarah");
    });

    it("matches surah by Arabic name substring", () => {
      // "بقرة" (without the leading ال) should still match Al-Baqarah
      const results = getSuggestions("\u0628\u0642\u0631\u0629");
      const baqarah = results.find(
        (s) => s.type === "surah" && s.label === "Al-Baqarah"
      );
      expect(baqarah).toBeDefined();
    });

    it("matches surahs with diacritics stripped from the query", () => {
      // Adding a fatha (U+064E) to البقرة should still match after
      // normalization strips the diacritic.
      const withDiacritic = "\u0627\u0644\u0628\u064E\u0642\u0631\u0629";
      const results = getSuggestions(withDiacritic);
      const baqarah = results.find(
        (s) => s.type === "surah" && s.label === "Al-Baqarah"
      );
      expect(baqarah).toBeDefined();
    });

    it("unifies alef variants in the query", () => {
      // Al-An'am's canonical Arabic name الأنعام contains alef-with-hamza-above
      // (أ, U+0623). Normalization converts that to plain alef, so a query
      // with a plain alef ("انعام") must still match the surah.
      const results = getSuggestions(
        "\u0627\u0646\u0639\u0627\u0645"
      );
      const anam = results.find(
        (s) => s.type === "surah" && s.label === "Al-An'am"
      );
      expect(anam).toBeDefined();
      expect(anam?.href).toBe("/quran/al-anam");
    });

    it("does not duplicate surahs matched by both transliteration and Arabic", () => {
      // Dedup is by href, so each surah appears at most once regardless of
      // how many matching rules hit it.
      const results = getSuggestions("\u0627\u0644\u0628\u0642\u0631");
      const hrefs = results
        .filter((s) => s.type === "surah")
        .map((s) => s.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    });

    it("returns canonical surah page destinations for Arabic queries", () => {
      // الفاتحة (Al-Fatihah)
      const results = getSuggestions(
        "\u0627\u0644\u0641\u0627\u062a\u062d\u0629"
      );
      const fatihah = results.find(
        (s) => s.type === "surah" && s.label === "Al-Fatihah"
      );
      expect(fatihah?.href).toBe("/quran/al-fatihah");
    });

    it("matches multiple surahs from a short Arabic prefix", () => {
      // ال matches many surahs (almost all Arabic names start with ال)
      const results = getSuggestions("\u0627\u0644");
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs.length).toBeGreaterThan(1);
      // Results are capped at 10.
      expect(results.length).toBeLessThanOrEqual(10);
    });

    it("preserves existing transliteration matching for Latin queries", () => {
      const results = getSuggestions("al-ba");
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs.length).toBeGreaterThan(0);
      const baqarah = surahs.find((s) => s.label === "Al-Baqarah");
      expect(baqarah).toBeDefined();
    });

    it("keeps reference suggestions prioritized over surah name matches", () => {
      const results = getSuggestions("2:255");
      expect(results[0].type).toBe("reference");
      expect(results[0].href).toBe("/ayah/2/255");
    });

    it("returns empty for unmatched Arabic queries", () => {
      // A string of Arabic characters that does not match any surah name
      const results = getSuggestions(
        "\u0632\u064A\u0646\u0628\u0642\u0639"
      );
      const surahs = results.filter((s) => s.type === "surah");
      expect(surahs).toHaveLength(0);
    });
  });

  describe("topic suggestions", () => {
    it("matches topic by English title prefix", () => {
      const results = getSuggestions("pat");
      const patience = results.find(
        (s) => s.type === "topic" && s.label === "Patience"
      );
      expect(patience).toBeDefined();
      expect(patience?.href).toBe("/topics/patience");
    });

    it("matches topic by English title substring", () => {
      const results = getSuggestions("tience");
      const patience = results.find(
        (s) => s.type === "topic" && s.label === "Patience"
      );
      expect(patience).toBeDefined();
    });

    it("matches topic by Arabic title", () => {
      const results = getSuggestions("\u0627\u0644\u0635\u0628\u0631");
      const patience = results.find(
        (s) => s.type === "topic" && s.label === "Patience"
      );
      expect(patience).toBeDefined();
    });

    it("includes the Arabic title in the sublabel", () => {
      const results = getSuggestions("patience");
      const topic = results.find(
        (s) => s.type === "topic" && s.label === "Patience"
      );
      expect(topic?.sublabel).toBe("\u0627\u0644\u0635\u0628\u0631");
    });

    it("sorts topics alphabetically within type", () => {
      // "an" occurs inside several topic titles ("...and...").
      const results = getSuggestions("an");
      const topics = results.filter((s) => s.type === "topic");
      for (let i = 1; i < topics.length; i++) {
        expect(
          topics[i - 1].label.localeCompare(topics[i].label)
        ).toBeLessThanOrEqual(0);
      }
    });
  });

  describe("ordering and de-duplication", () => {
    it("puts the reference suggestion first when the query parses as one", () => {
      const results = getSuggestions("al-baqarah");
      expect(results[0].type).toBe("reference");
    });

    it("de-duplicates suggestions that share a destination", () => {
      // "al-baqarah" parses as a surah reference AND prefix-matches the
      // surah name; both point at /quran/al-baqarah, so only one entry —
      // the higher-priority reference — may survive.
      const results = getSuggestions("al-baqarah");
      const toSurahPage = results.filter(
        (s) => s.href === "/quran/al-baqarah"
      );
      expect(toSurahPage).toHaveLength(1);
      expect(toSurahPage[0].type).toBe("reference");
    });

    it("returns empty array when no matches are found", () => {
      expect(getSuggestions("xyz123nonexistent")).toEqual([]);
    });
  });

  describe("deterministic behavior", () => {
    it("returns the same results for the same query", () => {
      expect(getSuggestions("mercy")).toEqual(getSuggestions("mercy"));
    });

    it("trims whitespace before matching", () => {
      expect(getSuggestions("  patience  ")).toEqual(
        getSuggestions("patience")
      );
    });
  });
});

describe("suggestion structure", () => {
  it("every suggestion has required fields and an internal route", () => {
    const results = getSuggestions("al-baqarah");
    expect(results.length).toBeGreaterThan(0);
    for (const suggestion of results) {
      expect(["surah", "topic", "reference"]).toContain(suggestion.type);
      expect(suggestion.label.length).toBeGreaterThan(0);
      expect(suggestion.href.startsWith("/")).toBe(true);
      expect([0, 1, 2]).toContain(suggestion.priority);
    }
  });

  it("reference suggestions have the canonical ayah href format", () => {
    const ref = getSuggestions("2:255").find((s) => s.type === "reference");
    expect(ref?.href).toMatch(/^\/ayah\/\d+\/\d+$/);
  });

  it("surah suggestions have the canonical surah href format", () => {
    const surah = getSuggestions("baqarah").find((s) => s.type === "surah");
    expect(surah?.href).toMatch(/^\/quran\/[a-z-]+$/);
  });

  it("topic suggestions have the canonical topic href format", () => {
    const topic = getSuggestions("patience").find((s) => s.type === "topic");
    expect(topic?.href).toMatch(/^\/topics\/[a-z-]+$/);
  });
});
