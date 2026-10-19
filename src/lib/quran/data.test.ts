// Unit tests for the filesystem-backed Quran data loader.
//
// These run in Node (see vitest.config.ts) and read the SAME vendored files
// the app reads, so they verify the real shipped dataset — never a fixture.
// The verbatim-integrity suite compares loader output byte-for-byte against
// the raw source JSON, which is what enforces the PRD rule that bundled Quran
// text, translation, and transliteration are never altered.
//
// Unicode-sensitive assertions are built from escaped ranges (new RegExp with
// \\uXXXX) so no Arabic literal has to survive source encoding to be valid.

import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getAyah,
  getAyahContext,
  getSurah,
  getSurahIdBySlug,
  getSurahIndex,
  getSurahSlug,
  slugifyTransliteration,
  validateDataset,
} from "./data";

const CHAPTER_DIR = path.join(
  process.cwd(),
  "node_modules",
  "quran-json",
  "dist",
  "chapters",
  "en"
);

/** Harakat, superscript alef, Quranic annotation marks, and tatweel —
 *  exactly the ranges normalizeArabic() strips for matching. */
const DIACRITICS = new RegExp("[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]");

interface RawChapter {
  id: number;
  verses: {
    id: number;
    text: string;
    translation: string;
    transliteration: string;
  }[];
}

function readRawChapter(id: number): RawChapter {
  return JSON.parse(
    fs.readFileSync(path.join(CHAPTER_DIR, `${id}.json`), "utf-8")
  ) as RawChapter;
}

describe("surah index", () => {
  it("contains exactly 114 surahs in canonical order", () => {
    const index = getSurahIndex();
    expect(index).toHaveLength(114);
    index.forEach((meta, i) => {
      expect(meta.id).toBe(i + 1);
    });
  });

  it("gives every surah a non-empty name, slug, meaning, and valid metadata", () => {
    const slugs = new Set<string>();
    for (const meta of getSurahIndex()) {
      expect(meta.slug.length).toBeGreaterThan(0);
      expect(meta.arabicName.length).toBeGreaterThan(0);
      expect(meta.transliteration.length).toBeGreaterThan(0);
      expect(meta.meaning.length).toBeGreaterThan(0);
      expect(["meccan", "medinan"]).toContain(meta.revelation);
      expect(meta.ayahCount).toBeGreaterThan(0);
      slugs.add(meta.slug);
    }
    expect(slugs.size).toBe(114);
  });
});

describe("slugifyTransliteration", () => {
  it("lowercases, strips apostrophes, and hyphenates", () => {
    expect(slugifyTransliteration("Al-Ma'idah")).toBe("al-maidah");
    expect(slugifyTransliteration("Al-Fatihah")).toBe("al-fatihah");
    expect(slugifyTransliteration("'Abasa")).toBe("abasa");
    expect(slugifyTransliteration("Al-'Ashr")).toBe("al-ashr");
  });

  it("is idempotent across all 114 dataset slugs", () => {
    for (const meta of getSurahIndex()) {
      expect(slugifyTransliteration(meta.slug)).toBe(meta.slug);
    }
  });
});

describe("slug / id resolution", () => {
  it("resolves slugs and numeric strings to surah ids", () => {
    expect(getSurahIdBySlug("al-baqarah")).toBe(2);
    expect(getSurahIdBySlug("an-nas")).toBe(114);
    expect(getSurahIdBySlug("2")).toBe(2);
    expect(getSurahIdBySlug("114")).toBe(114);
  });

  it("returns null for unknown slugs and out-of-range numbers", () => {
    expect(getSurahIdBySlug("nope")).toBeNull();
    expect(getSurahIdBySlug("")).toBeNull();
    expect(getSurahIdBySlug("0")).toBeNull();
    expect(getSurahIdBySlug("115")).toBeNull();
    expect(getSurahIdBySlug("999")).toBeNull();
  });

  it("maps ids back to canonical slugs", () => {
    expect(getSurahSlug(2)).toBe("al-baqarah");
    expect(getSurahSlug(114)).toBe("an-nas");
    expect(getSurahSlug(0)).toBe("");
    expect(getSurahSlug(999)).toBe("");
  });
});

describe("getSurah / getAyah bounds", () => {
  it("rejects out-of-range or non-integer surah ids", () => {
    expect(getSurah(0)).toBeNull();
    expect(getSurah(115)).toBeNull();
    expect(getSurah(-1)).toBeNull();
    expect(getSurah(1.5)).toBeNull();
    expect(getSurah(Number.NaN)).toBeNull();
  });

  it("resolves a known ayah with all three fields populated", () => {
    const a = getAyah(2, 255);
    expect(a).not.toBeNull();
    expect(a?.surah).toBe(2);
    expect(a?.ayah).toBe(255);
    expect(a?.arabic.length).toBeGreaterThan(0);
    expect(a?.translation.length).toBeGreaterThan(0);
    expect(a?.transliteration.length).toBeGreaterThan(0);
  });

  it("rejects out-of-range and non-integer ayah numbers", () => {
    expect(getAyah(1, 8)).toBeNull(); // Al-Fatihah has 7 ayat
    expect(getAyah(2, 287)).toBeNull(); // Al-Baqarah has 286 ayat
    expect(getAyah(114, 7)).toBeNull(); // An-Nas has 6 ayat
    expect(getAyah(2, 0)).toBeNull();
    expect(getAyah(2, -3)).toBeNull();
    expect(getAyah(2, 2.5)).toBeNull();
    expect(getAyah(2, Number.NaN)).toBeNull();
    expect(getAyah(999, 1)).toBeNull();
  });

  it("declared verse counts match the loaded verses for all 114 surahs", () => {
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      expect(surah).not.toBeNull();
      expect(surah?.ayat).toHaveLength(meta.ayahCount);
    }
  });

  it("numbers ayat sequentially 1..n with no empty Arabic or translation", () => {
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      expect(surah).not.toBeNull();
      surah?.ayat.forEach((a, i) => {
        expect(a.surah).toBe(meta.id);
        expect(a.ayah).toBe(i + 1);
        expect(a.arabic.trim().length).toBeGreaterThan(0);
        expect(a.translation.trim().length).toBeGreaterThan(0);
      });
    }
  });
});

describe("verbatim integrity (PRD: never alter bundled Quran text)", () => {
  it("returns content byte-identical to the vendored source JSON", () => {
    // Spread across short, long, meccan, medinan, and RTL-heavy surahs.
    for (const id of [1, 2, 18, 36, 55, 67, 78, 112, 114]) {
      const raw = readRawChapter(id);
      const surah = getSurah(id);
      expect(surah).not.toBeNull();
      expect(surah?.ayat).toHaveLength(raw.verses.length);
      raw.verses.forEach((v, i) => {
        const a = surah?.ayat[i];
        expect(a?.ayah).toBe(v.id);
        expect(a?.arabic).toBe(v.text);
        expect(a?.translation).toBe(v.translation);
        expect(a?.transliteration).toBe(v.transliteration);
      });
    }
  });

  it("does not strip diacritics from displayed Arabic", () => {
    const a = getAyah(1, 1);
    expect(a).not.toBeNull();
    // The Uthmani text carries harakat / Quranic annotation marks / tatweel.
    expect(DIACRITICS.test(a?.arabic ?? "")).toBe(true);
    // And the loader never mutated it toward a normalized form.
    expect(a?.arabic).toBe(readRawChapter(1).verses[0].text);
  });
});

describe("getAyahContext", () => {
  it("returns the surrounding window with a correct target index", () => {
    const ctx = getAyahContext(2, 255);
    expect(ctx).not.toBeNull();
    expect(ctx?.ayat).toHaveLength(5);
    expect(ctx?.targetIndex).toBe(2);
    expect(ctx?.ayat[2].ayah).toBe(255);
  });

  it("clamps at surah boundaries instead of returning undefined holes", () => {
    const head = getAyahContext(2, 1);
    expect(head?.ayat).toHaveLength(3);
    expect(head?.targetIndex).toBe(0);
    expect(head?.ayat[0].ayah).toBe(1);

    const tail = getAyahContext(2, 286);
    expect(tail?.ayat).toHaveLength(3);
    expect(tail?.targetIndex).toBe(2);
    expect(tail?.ayat[2].ayah).toBe(286);

    const shortSurah = getAyahContext(112, 1);
    expect(shortSurah?.ayat).toHaveLength(3);
    expect(shortSurah?.targetIndex).toBe(0);
  });

  it("honors an explicit radius", () => {
    const ctx = getAyahContext(2, 255, 0);
    expect(ctx?.ayat).toHaveLength(1);
    expect(ctx?.targetIndex).toBe(0);
    expect(ctx?.ayat[0].ayah).toBe(255);
  });

  it("returns null for invalid references", () => {
    expect(getAyahContext(2, 287)).toBeNull();
    expect(getAyahContext(0, 1)).toBeNull();
    expect(getAyahContext(2, 0)).toBeNull();
    expect(getAyahContext(2, 1.5)).toBeNull();
  });
});

describe("validateDataset", () => {
  it("reports zero issues and the canonical totals for the shipped dataset", () => {
    const report = validateDataset();
    expect(report.issues).toEqual([]);
    expect(report.surahCount).toBe(114);
    expect(report.totalAyat).toBe(6236);
  });
});