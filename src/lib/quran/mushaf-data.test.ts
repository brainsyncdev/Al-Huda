// Tests for the verified mushaf metadata module (FR-008).
//
// Every assertion here is checked against the Tanzil quran-data.xml boundary
// tables that `scripts/generate-mushaf-data.js` emits. The generator itself
// fails the build if the counts drift, so these tests guard the resolution
// logic (binary search, ordinal conversion, point markers).

import { describe, expect, it } from "vitest";
import { getSurah, getSurahIndex } from "./data";
import {
  getAyahMetadata,
  getHizbForAyah,
  getJuzForAyah,
  getManzilForAyah,
  getPageForAyah,
  getRubElHizbForAyah,
  getRukuForAyah,
  getSajdaForAyah,
  isSajdaAyah,
  toGlobalOrdinal,
} from "./mushaf-data";

describe("toGlobalOrdinal", () => {
  it("maps the first and last verse of the corpus", () => {
    expect(toGlobalOrdinal(1, 1)).toBe(1);
    expect(toGlobalOrdinal(114, 6)).toBe(6236);
  });

  it("accounts for every preceding surah", () => {
    // Al-Baqarah starts immediately after Al-Fatihah's 7 verses.
    expect(toGlobalOrdinal(2, 1)).toBe(8);
    // Al-Ikhlas (112) starts after the sum of verse counts for surahs 1..111.
    // Compute from the dataset rather than hardcoding, so the test stays
    // correct if the dataset's verse counts ever change.
    let sum = 0;
    for (let s = 1; s <= 111; s++) {
      const meta = getSurah(s);
      expect(meta).not.toBeNull();
      sum += meta!.ayahCount;
    }
    expect(toGlobalOrdinal(112, 1)).toBe(sum + 1);
  });

  it("rejects invalid references instead of guessing", () => {
    expect(toGlobalOrdinal(1, 8)).toBeNull();
    expect(toGlobalOrdinal(2, 287)).toBeNull();
    expect(toGlobalOrdinal(115, 1)).toBeNull();
    expect(toGlobalOrdinal(0, 1)).toBeNull();
    expect(toGlobalOrdinal(2, 0)).toBeNull();
    expect(toGlobalOrdinal(1.5, 1)).toBeNull();
    expect(toGlobalOrdinal(2, Number.NaN)).toBeNull();
  });
});

describe("Juz boundaries", () => {
  it("places the well-known Juz starts correctly", () => {
    expect(getJuzForAyah(1, 1)).toBe(1);
    expect(getJuzForAyah(2, 141)).toBe(1);
    expect(getJuzForAyah(2, 142)).toBe(2);
    expect(getJuzForAyah(2, 252)).toBe(2);
    expect(getJuzForAyah(2, 253)).toBe(3);
    expect(getJuzForAyah(3, 92)).toBe(3);
    expect(getJuzForAyah(3, 93)).toBe(4);
    expect(getJuzForAyah(67, 1)).toBe(29);
    expect(getJuzForAyah(78, 1)).toBe(30);
    expect(getJuzForAyah(114, 6)).toBe(30);
  });

  it("covers every ayah with exactly one Juz, monotonically", () => {
    let prev = 0;
    let total = 0;
    const seen = new Set<number>();

    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      expect(surah).not.toBeNull();
      for (const a of surah!.ayat) {
        const juz = getJuzForAyah(a.surah, a.ayah);
        expect(juz).not.toBeNull();
        expect(juz!).toBeGreaterThanOrEqual(prev);
        prev = juz!;
        seen.add(juz!);
        total++;
      }
    }

    expect(total).toBe(6236);
    expect(prev).toBe(30);
    expect(seen.size).toBe(30);
  });

  it("never classifies an invalid reference", () => {
    expect(getJuzForAyah(1, 8)).toBeNull();
    expect(getJuzForAyah(114, 7)).toBeNull();
    expect(getJuzForAyah(0, 1)).toBeNull();
    expect(getJuzForAyah(2, -1)).toBeNull();
  });
});

describe("Page boundaries (Madani Mushaf)", () => {
  it("matches the standard 604-page layout at known points", () => {
    expect(getPageForAyah(1, 1)).toBe(1);
    // Ayat al-Kursi is on page 42 in the Madani Mushaf.
    expect(getPageForAyah(2, 255)).toBe(42);
    expect(getPageForAyah(114, 6)).toBe(604);
  });

  it("never decreases across the canonical order and ends at 604", () => {
    let prev = 0;
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      for (const a of surah!.ayat) {
        const page = getPageForAyah(a.surah, a.ayah);
        expect(page).not.toBeNull();
        expect(page!).toBeGreaterThanOrEqual(prev);
        expect(page!).toBeLessThanOrEqual(604);
        prev = page!;
      }
    }
    expect(prev).toBe(604);
  });
});

describe("Hizb and quarter", () => {
  it("derives hizb from the rub el hizb quarter", () => {
    const quarter = getRubElHizbForAyah(2, 255);
    expect(quarter).toBe(17);
    expect(getHizbForAyah(2, 255)).toBe(5);
  });

  it("keeps the quarter in 1..240 and the hizb in 1..60", () => {
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      for (const a of surah!.ayat) {
        const q = getRubElHizbForAyah(a.surah, a.ayah)!;
        const h = getHizbForAyah(a.surah, a.ayah)!;
        expect(q).toBeGreaterThanOrEqual(1);
        expect(q).toBeLessThanOrEqual(240);
        expect(h).toBe(Math.ceil(q / 4));
        expect(h).toBeGreaterThanOrEqual(1);
        expect(h).toBeLessThanOrEqual(60);
      }
    }
  });
});

describe("Ruku and manzil", () => {
  it("covers 556 rukus and 7 manzils", () => {
    const rukus = new Set<number>();
    const manzils = new Set<number>();
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      for (const a of surah!.ayat) {
        rukus.add(getRukuForAyah(a.surah, a.ayah)!);
        manzils.add(getManzilForAyah(a.surah, a.ayah)!);
      }
    }
    expect(rukus.size).toBe(556);
    expect(manzils.size).toBe(7);
  });
});

describe("Sajda verses", () => {
  it("returns exactly 15 distinct point markers", () => {
    const found: { surah: number; ayah: number; type: string }[] = [];
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      for (const a of surah!.ayat) {
        const sajda = getSajdaForAyah(a.surah, a.ayah);
        if (sajda) found.push({ surah: a.surah, ayah: a.ayah, type: sajda.type });
      }
    }
    expect(found).toHaveLength(15);
  });

  it("does not treat neighbouring verses as sajda (point marker, not a range)", () => {
    expect(isSajdaAyah(32, 15)).toBe(true);
    expect(getSajdaForAyah(32, 15)).toEqual({ index: 10, type: "obligatory" });
    // 32:16 immediately follows the sajda verse and must not inherit it.
    expect(isSajdaAyah(32, 16)).toBe(false);
    // Likewise before it.
    expect(isSajdaAyah(32, 14)).toBe(false);
    // The last sajda of the corpus.
    expect(isSajdaAyah(96, 19)).toBe(true);
    expect(isSajdaAyah(114, 6)).toBe(false);
  });
});

describe("getAyahMetadata", () => {
  it("returns a coherent record for a known verse", () => {
    const meta = getAyahMetadata(2, 255);
    expect(meta).not.toBeNull();
    expect(meta!.juz).toBe(3);
    expect(meta!.page).toBe(42);
    expect(meta!.hizb).toBe(5);
    expect(meta!.rubElHizb).toBe(17);
    expect(meta!.sajda).toBeNull();
  });

  it("returns null for invalid references", () => {
    expect(getAyahMetadata(1, 8)).toBeNull();
    expect(getAyahMetadata(115, 1)).toBeNull();
  });
});