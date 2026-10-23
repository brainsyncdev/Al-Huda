// Re-export from the new comprehensive mushaf-data module.
// This file exists for backward compatibility — all Juz/metadata lookups
// now go through mushaf-data.ts which has verified boundaries for juz, page,
// hizb, quarter, ruku, manzil, and sajda from the Tanzil CC-BY dataset.

export {
  getJuzForAyah,
  getPageForAyah,
  getHizbForAyah,
  getRubElHizbForAyah,
  getRukuForAyah,
  getManzilForAyah,
  getSajdaForAyah,
  isSajdaAyah,
  getAyahMetadata,
  type AyahMetadata,
} from "./mushaf-data";

/** Legacy interface for backward compatibility. */
export interface JuzInfo {
  juz: number;
  startSurah: number;
  startAyah: number;
  approximatePages: [number, number];
}

/** @deprecated Use getAyahMetadata() from mushaf-data.ts instead. */
export const JUZ_DATA: JuzInfo[] = [];

/** @deprecated Use getAyahMetadata() from mushaf-data.ts instead. */
export function getJuzInfo(_juz: number): JuzInfo | null {
  return null;
}
