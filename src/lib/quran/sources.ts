// Source catalog. Every content record in the app is traceable to one of the
// entries below (PRD: explicit provenance for Quran text, translations, tafsir).
// Rendered on /sources and referenced from the reader's source panel.

export interface SourceRecord {
  id: string;
  /** What content this source provides. */
  provides: string;
  /** Original work/author/translator. */
  attribution: string;
  /** Publisher/maintainer of the digital edition used. */
  publisher: string;
  license: string;
  licenseUrl?: string;
  homepage: string;
  /** Version/edition pinned by the app. */
  version: string;
  /** How the hub obtains the content. */
  method: "package" | "link";
  notes?: string;
}

export const SOURCES: SourceRecord[] = [
  {
    id: "quran-json",
    provides: "Quran structure, surah metadata, Arabic text, translation, transliteration",
    attribution: "quran-json by Risan Bagja Pradana",
    publisher: "npm package quran-json (v3.1.2)",
    license: "CC-BY-4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    homepage: "https://github.com/risan/quran-json",
    version: "3.1.2",
    method: "package",
    notes:
      "Content is ingested verbatim and never modified. Package verified in package.json.",
  },
  {
    id: "quranenc",
    provides: "Uthmani Arabic Quran text and Arabic chapter metadata",
    attribution: "The Noble Qur'an Encyclopedia (quranenc.com)",
    publisher: "quranenc.com",
    license: "As stated by source publisher; distributed via quran-json under CC-BY-4.0 metadata",
    homepage: "https://quranenc.com/en/home",
    version: "As pinned by quran-json@3.1.2",
    method: "package",
  },
  {
    id: "tanzil-sahih",
    provides: "English translation (Saheeh International)",
    attribution: "Saheeh International (Umm Muhammad et al.)",
    publisher: "Tanzil.net (en.sahih)",
    license: "Tanzil terms of use (attribution + no modification)",
    licenseUrl: "https://tanzil.net/docs/terms",
    homepage: "https://tanzil.net/trans/en.sahih",
    version: "As pinned by quran-json@3.1.2",
    method: "package",
  },
  {
    id: "tanzil-translit",
    provides: "Latin transliteration",
    attribution: "Tanzil transliteration",
    publisher: "Tanzil.net (en.transliteration)",
    license: "Tanzil terms of use",
    licenseUrl: "https://tanzil.net/docs/terms",
    homepage: "https://tanzil.net/trans/en.transliteration",
    version: "As pinned by quran-json@3.1.2",
    method: "package",
  },
  {
    id: "tafsir-ibn-kathir",
    provides: "Tafsir excerpts — Tafsir Ibn Kathir (English abridged)",
    attribution: "Isma'il ibn Umar ibn Kathir; English translation by Darussalam",
    publisher: "Available via external references (link-out only, not bundled)",
    license: "Check external source; not redistributed by this app (FR-032)",
    homepage: "https://www.qtafsir.com/",
    version: "Link target, not version-pinned in this app",
    method: "link",
    notes:
      "The app provides outbound links only for tafsir (FR-031 distinguishes link-to-external). No tafsir text is displayed or stored locally. Licensing, permitted display, and edition details are the responsibility of the linked publisher.",
  },
  {
    id: "tafsir-ma(arif)",
    provides: "Tafsir excerpts — Ma'ariful Quran (English)",
    attribution: "Mufti Muhammad Shafi Usmani",
    publisher: "Available via external references (link-out only)",
    license: "Check external source; not redistributed by this app (FR-032)",
    homepage: "https://www.maarifulquran.org/",
    version: "Link target, not version-pinned in this app",
    method: "link",
    notes: "Link-out only for tafsir; no text bundled.",
  },
];

export function getSource(id: string): SourceRecord | undefined {
  return SOURCES.find((s) => s.id === id);
}

/** Default translation credit line shown in the reader. */
export const TRANSLATION_CREDIT =
  "English translation: Saheeh International (Umm Muhammad), via Tanzil.net";

/** Arabic text credit line. */
export const ARABIC_CREDIT = "Arabic text: Uthmani and chapter metadata via quranenc.com";

/** Package credit line. */
export const PACKAGE_CREDIT = "Content package: quran-json v3.1.2 (CC-BY-4.0)";
