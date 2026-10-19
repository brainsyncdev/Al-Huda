// Juz (para) metadata for the Quran.
// Standard division: 30 Juz based on the widely accepted Hafs an Asim
// recitation tradition. Each entry records the starting ayah reference.
//
// IMPORTANT: Page numbers are approximate estimates based on a standard
// 604-page Mushaf layout. They are NOT exact Mushaf page numbers — actual
// page breaks vary by printed edition. Do not present these as authoritative
// page references until verified against a specific printed Mushaf.

export interface JuzInfo {
  juz: number;
  startSurah: number;
  startAyah: number;
  /** Approximate page range in a standard 604-page Mushaf. */
  approximatePages: [number, number];
}

export const JUZ_DATA: JuzInfo[] = [
  { juz: 1, startSurah: 1, startAyah: 1, approximatePages: [1, 20] },
  { juz: 2, startSurah: 2, startAyah: 142, approximatePages: [21, 40] },
  { juz: 3, startSurah: 2, startAyah: 253, approximatePages: [41, 60] },
  { juz: 4, startSurah: 3, startAyah: 93, approximatePages: [61, 80] },
  { juz: 5, startSurah: 4, startAyah: 24, approximatePages: [81, 100] },
  { juz: 6, startSurah: 4, startAyah: 148, approximatePages: [101, 120] },
  { juz: 7, startSurah: 5, startAyah: 82, approximatePages: [121, 140] },
  { juz: 8, startSurah: 6, startAyah: 111, approximatePages: [141, 160] },
  { juz: 9, startSurah: 7, startAyah: 88, approximatePages: [161, 180] },
  { juz: 10, startSurah: 8, startAyah: 41, approximatePages: [181, 200] },
  { juz: 11, startSurah: 9, startAyah: 93, approximatePages: [201, 220] },
  { juz: 12, startSurah: 11, startAyah: 6, approximatePages: [221, 240] },
  { juz: 13, startSurah: 12, startAyah: 53, approximatePages: [241, 260] },
  { juz: 14, startSurah: 15, startAyah: 1, approximatePages: [261, 280] },
  { juz: 15, startSurah: 17, startAyah: 1, approximatePages: [281, 300] },
  { juz: 16, startSurah: 18, startAyah: 75, approximatePages: [301, 320] },
  { juz: 17, startSurah: 21, startAyah: 1, approximatePages: [321, 340] },
  { juz: 18, startSurah: 23, startAyah: 1, approximatePages: [341, 360] },
  { juz: 19, startSurah: 25, startAyah: 21, approximatePages: [361, 380] },
  { juz: 20, startSurah: 27, startAyah: 56, approximatePages: [381, 400] },
  { juz: 21, startSurah: 29, startAyah: 46, approximatePages: [401, 420] },
  { juz: 22, startSurah: 33, startAyah: 31, approximatePages: [421, 440] },
  { juz: 23, startSurah: 36, startAyah: 28, approximatePages: [441, 460] },
  { juz: 24, startSurah: 39, startAyah: 32, approximatePages: [461, 480] },
  { juz: 25, startSurah: 41, startAyah: 47, approximatePages: [481, 500] },
  { juz: 26, startSurah: 46, startAyah: 1, approximatePages: [501, 520] },
  { juz: 27, startSurah: 51, startAyah: 31, approximatePages: [521, 540] },
  { juz: 28, startSurah: 58, startAyah: 1, approximatePages: [541, 560] },
  { juz: 29, startSurah: 67, startAyah: 1, approximatePages: [561, 580] },
  { juz: 30, startSurah: 78, startAyah: 1, approximatePages: [581, 604] },
];

export function getJuzForAyah(surah: number, ayah: number): number | null {
  for (let i = JUZ_DATA.length - 1; i >= 0; i--) {
    const j = JUZ_DATA[i];
    if (surah > j.startSurah || (surah === j.startSurah && ayah >= j.startAyah)) {
      return j.juz;
    }
  }
  return null;
}

export function getJuzInfo(juz: number): JuzInfo | null {
  if (juz < 1 || juz > 30) return null;
  return JUZ_DATA[juz - 1] ?? null;
}
