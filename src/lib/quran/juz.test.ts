// Unit tests for the 30-Juz mapping.
//
// The Juz *starting ayah* boundaries follow the widely used Madinah Mushaf
// (King Fahd Complex) division. The `approximatePages` field is an ESTIMATE
// only and is asserted here purely for internal consistency — it must never
// be rendered as an exact Mushaf page reference (see the disclaimer in
// juz.ts and docs/DATA-PROVENANCE.md).

import { describe, expect, it } from "vitest";
import { getAyah, getSurah, getSurahIndex } from "./data";
import { JUZ_DATA, getJuzForAyah, getJuzInfo } from "./juz";

/** The ayah immediately preceding a reference in canonical mushaf order. */
function previousAyahRef(surah: number, ayah: number): { surah: number; ayah: number } {
  if (ayah > 1) return { surah, ayah: ayah - 1 };
  const prev = getSurah(surah - 1);
  expect(prev).not.toBeNull();
  return { surah: surah - 1, ayah: prev!.ayahCount };
}

describe("JUZ_DATA structure", () => {
  it("contains exactly 30 Juz numbered 1..30", () => {
    expect(JUZ_DATA).toHaveLength(30);
    JUZ_DATA.forEach((j, i) => {
      expect(j.juz).toBe(i + 1);
    });
  });

  it("starts at 1:1 and every start reference is a real ayah in the dataset",
    () => {
      expect(JUZ_DATA[0].startSurah).toBe(1);
      expect(JUZ_DATA[0].startAyah).toBe(1);

      for (const j of JUZ_DATA) {
              const ayah = getAyah(j.startSurah, j.startAyah);
              expect(ayah).not.toBeNull();
              expect(ayah?.surah).toBe(j.startSurah);
        expect(ayah?.ayah).toBe(j.startAyah);
      }
    });

  it("keeps start references strictly increasing in canonical order", () => {
    for (let i = 1; i < JUZ_DATA.length; i++) {
      const prev = JUZ_DATA[i - 1];
      const cur = JUZ_DATA[i];
      const greater =
        cur.startSurah > prev.startSurah ||
        (cur.startSurah === prev.startSurah && cur.startAyah > prev.startAyah);
      expect(greater).toBe(true);
    }
  });

  it("keeps approximatePages internally consistent (values are estimates, not exact)", () => {
    let prevTo = 0;
        for (const j of JUZ_DATA) {
          const [from, to] = j.approximatePages;
          expect(Number.isInteger(from)).toBe(true);
          expect(Number.isInteger(to)).toBe(true);
          expect(from).toBeGreaterThanOrEqual(1);
          expect(to).toBeGreaterThanOrEqual(from);
          // Ranges must be contiguous and never overlap across consecutive Juz.
          expect(from).toBeGreaterThan(prevTo);
          prevTo = to;
        }
    expect(JUZ_DATA[0].approximatePages[0]).toBe(1);
    expect(JUZ_DATA[29].approximatePages[1]).toBe(604);
  });
});

describe("getJuzForAyah boundaries", () => {
  it("maps each Juz start to that Juz and the preceding ayah to the previous Juz", () => {
    for (const j of JUZ_DATA) {
      expect(getJuzForAyah(j.startSurah, j.startAyah)).toBe(j.juz);
      if (j.juz === 1) continue;
      const before = previousAyahRef(j.startSurah, j.startAyah);
      expect(getJuzForAyah(before.surah, before.ayah)).toBe(j.juz - 1);
    }
  });

  it("handles hand-picked boundary cases", () => {
    // Juz 1 -> 2 at 2:142
    expect(getJuzForAyah(1, 7)).toBe(1);
    expect(getJuzForAyah(2, 1)).toBe(1);
    expect(getJuzForAyah(2, 141)).toBe(1);
    expect(getJuzForAyah(2, 142)).toBe(2);
    // Juz 2 -> 3 at 2:253
    expect(getJuzForAyah(2, 252)).toBe(2);
    expect(getJuzForAyah(2, 253)).toBe(3);
    expect(getJuzForAyah(2, 286)).toBe(3);
    // Juz 3 -> 4 at 3:93
    expect(getJuzForAyah(3, 1)).toBe(3);
    expect(getJuzForAyah(3, 92)).toBe(3);
    expect(getJuzForAyah(3, 93)).toBe(4);
    // Juz 28 -> 29 at 67:1
    expect(getJuzForAyah(66, 12)).toBe(28);
    expect(getJuzForAyah(67, 1)).toBe(29);
    expect(getJuzForAyah(77, 1)).toBe(29);
    expect(getJuzForAyah(77, 50)).toBe(29);
    // Juz 29 -> 30 at 78:1
    expect(getJuzForAyah(78, 1)).toBe(30);
    expect(getJuzForAyah(114, 1)).toBe(30);
    expect(getJuzForAyah(114, 6)).toBe(30);
  });

  it("covers every ayah of the corpus with exactly one Juz, monotonically", () => {
    const counts = new Map<number, number>();
    let prev = 0;
    let total = 0;

    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      expect(surah).not.toBeNull();
      for (const a of surah!.ayat) {
        const juz = getJuzForAyah(a.surah, a.ayah);
        expect(juz).not.toBeNull();
        expect(juz!).toBeGreaterThanOrEqual(1);
        expect(juz!).toBeLessThanOrEqual(30);
        // Canonical walk must never move backwards.
                expect(juz!).toBeGreaterThanOrEqual(prev);
        prev = juz!;
        counts.set(juz!, (counts.get(juz!) ?? 0) + 1);
        total++;
      }
    }

    expect(total).toBe(6236);
    expect(prev).toBe(30);
    expect(counts.size).toBe(30);
    for (let j = 1; j <= 30; j++) {
      expect(counts.get(j) ?? 0).toBeGreaterThan(0);
    }
  });

  it("never classifies an invalid reference into a Juz", () => {
    // Valid surah, ayah beyond the surah's real verse count.
    expect(getJuzForAyah(1, 8)).toBeNull(); // Al-Fatihah has 7
    expect(getJuzForAyah(2, 287)).toBeNull(); // Al-Baqarah has 286
    expect(getJuzForAyah(114, 7)).toBeNull(); // An-Nas has 6
    // Out-of-range surahs / non-positive ayahs.
    expect(getJuzForAyah(0, 1)).toBeNull();
    expect(getJuzForAyah(115, 1)).toBeNull();
    expect(getJuzForAyah(-1, 1)).toBeNull();
    expect(getJuzForAyah(2, 0)).toBeNull();
    expect(getJuzForAyah(2, -5)).toBeNull();
    // Non-integers.
    expect(getJuzForAyah(1.5, 1)).toBeNull();
    expect(getJuzForAyah(2, 2.5)).toBeNull();
    expect(getJuzForAyah(Number.NaN, 1)).toBeNull();
    expect(getJuzForAyah(2, Number.NaN)).toBeNull();
  });
});

describe("getJuzInfo", () => {
  it("returns metadata for every valid Juz number", () => {
    for (let j = 1; j <= 30; j++) {
      const info = getJuzInfo(j);
      expect(info).not.toBeNull();
      expect(info!.juz).toBe(j);
      expect(info!.startSurah).toBeGreaterThanOrEqual(1);
      expect(info!.startSurah).toBeLessThanOrEqual(114);
      expect(info!.startAyah).toBeGreaterThanOrEqual(1);
    }
  });

  it("returns null for out-of-range or non-integer Juz numbers", () => {
    expect(getJuzInfo(0)).toBeNull();
    expect(getJuzInfo(31)).toBeNull();
    expect(getJuzInfo(-1)).toBeNull();
    expect(getJuzInfo(1.5)).toBeNull();
    expect(getJuzInfo(Number.NaN)).toBeNull();
  });

  it("agrees with getJuzForAyah at every Juz start", () => {
    for (let j = 1; j <= 30; j++) {
      const info = getJuzInfo(j)!;
      expect(getJuzForAyah(info.startSurah, info.startAyah)).toBe(j);
    }
  });
});