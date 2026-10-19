// Surah metadata passed from the server component to the revision client UI.
//
// The dataset loader (@/lib/quran/data) reads node:fs, so it cannot be
// imported by a "use client" component. The revision page reads the index
// server-side and hands these plain objects down; the real verse count is what
// bounds range selection in FR-050, so it travels with every option rather
// than being looked up from a hand-maintained table that could drift.

export interface SurahOption {
  /** Canonical surah number, 1–114. */
  id: number;
  transliteration: string;
  arabicName: string;
  /** Real verse count from the pinned dataset. */
  ayahCount: number;
}
