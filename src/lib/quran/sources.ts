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
    /**
     * BCP 47 tag for the language of the content this record describes. Left
     * unset where a single record spans several languages (the Quran package
     * carries Arabic, English translation and Latin transliteration at once), so
     * the absence of a value is meaningful rather than a missing fact. FR-030
     * requires tafsir language to be displayed, which is why the link-only tafsir
     * records set it explicitly.
     */
    language?: string;
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
    id: "tanzil-translations",
    provides: "Quran translations in 50+ languages (Urdu, Persian, Turkish, French, German, Spanish, Indonesian, and many more)",
    attribution: "Various translators — see tanzil.net/trans/ for full list",
    publisher: "Tanzil.net",
    license: "Tanzil terms of use (attribution + no modification)",
    licenseUrl: "https://tanzil.net/docs/terms",
    homepage: "https://tanzil.net/trans/",
    version: "Current as of access date",
    method: "link",
    language: "multi",
    notes:
      "Translations are fetched on-demand from Tanzil.net via the /api/translations/[id] proxy and cached in memory for the session. Default translation is Urdu (Jalandhry). Users can switch between 100+ translations in reader controls or settings.",
  },
  {
    id: "islamic-network-audio",
    provides: "Per-ayah audio recitation (verse-by-verse MP3, 12 reciters)",
    attribution:
      "Various reciters (Alafasy, Husary, Minshawi, Sudais, Shuraim, Abdul Basit, and others); recordings sourced from everyayah.com",
    publisher: "Islamic Network CDN (cdn.islamic.network)",
    license:
      "Streamed at runtime under the CDN's terms; no recording files are redistributed by this app",
    licenseUrl: "https://islamic.network/",
    homepage: "https://cdn.islamic.network/quran/",
    version: "Live CDN endpoint (not version-pinned); global ayah ordinal pinned by generated metadata",
    method: "link",
    language: "ar",
    notes:
      "Audio is optional and off by default. The player requests one MP3 only after the visitor presses play. The CDN publishes no explicit copyright licence for the recordings, so this app streams rather than bundles them and makes no redistribution claim. See docs/DATA-PROVENANCE.md.",
  },
  {
    id: "tanzil-mushaf-metadata",
    provides:
      "Juz, page (Madani Mushaf), hizb, quarter, ruku, manzil, and sajda boundaries",
    attribution: "Tanzil Quran metadata (quran-data.xml)",
    publisher: "Tanzil.net",
    license: 'CC-BY (declared in the source file header: license="cc-by")',
    licenseUrl: "https://tanzil.net/docs/terms",
    homepage: "https://tanzil.net/res/text/metadata/quran-data.xml",
    version: "Snapshot generated by scripts/generate-mushaf-data.js",
    method: "package",
    notes:
      "Boundary tables are generated at build time from a vendored copy of quran-data.xml. The generator verifies 30 juz, 604 pages, 240 quarters, 556 rukus, 7 manzils, 15 sajda verses, and 6,236 ayat before writing, so a dataset change fails the build rather than shipping silently.",
  },
  {
    id: "tafsir-jalalayn",
    provides: "Tafsir al-Jalalayn (Arabic) — classical tafsir text",
    attribution: "Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti (15th century CE)",
    publisher: "Tanzil.net (ar.jalalayn)",
    license:
      "Tanzil terms of use (attribution + no modification); text is fetched on-demand and not redistributed by this app",
    licenseUrl: "https://tanzil.net/docs/terms",
    homepage: "https://tanzil.net/trans/ar.jalalayn",
    language: "ar",
    version: "As served by Tanzil.net at request time",
    method: "link",
    notes:
      "Classical Arabic tafsir served through the /api/translations/[id] proxy, the same delivery path as translations. The app does not bundle or redistribute the text. Displayed with author, period, language and licence so it is never mistaken for Quran translation (FR-030).",
  },
  {
    id: "tafsir-muyassar",
    provides: "Tafsir al-Muyassar (Arabic) — contemporary tafsir text",
    attribution: "King Fahd Complex for the Printing of the Holy Quran",
    publisher: "Tanzil.net (ar.muyassar)",
    license:
      "Tanzil terms of use (attribution + no modification); text is fetched on-demand and not redistributed by this app",
    licenseUrl: "https://tanzil.net/docs/terms",
    homepage: "https://tanzil.net/trans/ar.muyassar",
    language: "ar",
    version: "As served by Tanzil.net at request time",
    method: "link",
    notes:
      "Contemporary Arabic tafsir served through the /api/translations/[id] proxy. Not bundled; displayed with full attribution and licence (FR-030/FR-032).",
  },
  {
    id: "semantic-embeddings",
    provides:
      "Precomputed sentence embeddings for semantic search over the built-in English translation",
    attribution:
      "Xenova/all-MiniLM-L6-v2 (sentence-transformers family); embeddings generated by scripts/generate-embeddings.mjs over quran-json's English translation",
    publisher: "Hugging Face (model); vendored by this app (embedding index)",
    license: "Apache-2.0 (model); embedding index is derived data under the same terms",
    licenseUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    homepage: "https://huggingface.co/Xenova/all-MiniLM-L6-v2",
    language: "en",
    version: "Snapshot generated 2026-10-23; 6,236 verses × 384 dimensions, float16 (4.57 MB)",
    method: "package",
    notes:
      "The generator runs at build time, packs the vectors as float16, and writes a sha256 manifest. At runtime the browser loads the same model from a CDN, embeds the user's query locally, and compares against the vendored index — no query leaves the device.",
  },
  {
    id: "qul-word-data",
    provides: "Word-by-word segmentation: Uthmani token, transliteration, English gloss",
    attribution: "Quranic Universal Library (QUL) by TarteelAI",
    publisher: "Quran.com API v4 (serving QUL word data); vendored by scripts/generate-word-data.js",
    license: "MIT (QUL repository); generated artifact is vendored with a sha256 manifest",
    licenseUrl: "https://github.com/TarteelAI/quranic-universal-library/blob/main/LICENSE",
    homepage: "https://github.com/TarteelAI/quranic-universal-library",
    language: "en",
    version: "Snapshot fetched 2026-10-23; 6,236 verses / 77,429 words",
    method: "package",
    notes:
      "The generator downloads the corpus once at build time, writes per-surah JSON to public/word-data, and records a sha256 for every file. The app serves its own vendored copy — it never fetches word data from a third party at runtime.",
  },
  {
    id: "tafsir-ibn-kathir",
    provides: "Tafsir excerpts — Tafsir Ibn Kathir (English abridged)",
    attribution: "Isma'il ibn Umar ibn Kathir; English translation by Darussalam",
    publisher: "Available via external references (link-out only, not bundled)",
    license: "Check external source; not redistributed by this app (FR-032)",
        homepage: "https://www.qtafsir.com/",
        language: "en",
        version: "Link target, not version-pinned in this app",
    method: "link",
    notes:
      "Outbound link only for this edition (FR-031 distinguishes link-to-external). Two other classical Arabic tafsirs (al-Jalalayn, al-Muyassar) are readable in-app through the translation proxy; this English abridgement is not bundled. Licensing and permitted display remain with the linked publisher.",
  },
  {
    id: "tafsir-ma(arif)",
    provides: "Tafsir excerpts — Ma'ariful Quran (English)",
    attribution: "Mufti Muhammad Shafi Usmani",
    publisher: "Available via external references (link-out only)",
    license: "Check external source; not redistributed by this app (FR-032)",
        homepage: "https://www.maarifulquran.org/",
        language: "en",
        version: "Link target, not version-pinned in this app",
    method: "link",
    notes: "Link-out only for tafsir; no text bundled.",
  },
];

export function getSource(id: string): SourceRecord | undefined {
  return SOURCES.find((s) => s.id === id);
}

/** Display names for `SourceRecord.language` tags (FR-030). */
export const SOURCE_LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  ar: "Arabic",
};

/**
 * FR-030 requires tafsir language to be shown. An absent tag is reported as
 * unspecified rather than inferred from the work's country of origin, and an
 * unrecognised tag is shown raw rather than mapped to a guess.
 */
export function sourceLanguageLabel(language?: string): string {
  if (!language) return "unspecified";
  return SOURCE_LANGUAGE_LABELS[language] ?? language;
}

/**
 * Version label for display. FR-075: the version field is required, but only
 * one record in the catalog carries a numeric release number. The others
 * record HOW content is pinned ("As pinned by quran-json@3.1.2", "Link target,
 * not version-pinned in this app"), and rendering those with a bare "v" prefix
 * produced nonsense like "vAs pinned by quran-json@3.1.2" on /sources and
 * /editorial — two pages whose entire purpose is stating provenance.
 *
 * Prefixed only when the string names a numbered release, so the label can
 * never misstate the pin state it is describing. Takes the record rather than
 * the string because both call sites hold one.
 */
export function sourceVersionLabel(record: SourceRecord): string {
  return /^\d/.test(record.version) ? `v${record.version}` : record.version;
}

/** Default translation credit line shown in the reader. */
export const TRANSLATION_CREDIT =
  "100+ translations in 50+ languages via Tanzil.net (default: Urdu — Jalandhry)";

/** Arabic text credit line. */
export const ARABIC_CREDIT = "Arabic text: Uthmani and chapter metadata via quranenc.com";

/** Package credit line. */
export const PACKAGE_CREDIT = "Content package: quran-json v3.1.2 (CC-BY-4.0)";
