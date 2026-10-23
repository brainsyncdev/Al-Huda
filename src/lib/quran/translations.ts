// Translation catalog from Tanzil.net
// Each entry maps a translation ID to its metadata.
// Source: https://tanzil.net/trans/
// Licensing: See individual translator/publisher terms at tanzil.net/docs/terms

export interface TranslationMeta {
  id: string; // e.g. "en.sahih", "ur.jalandhry"
  name: string; // Display name (translator or publisher)
  language: string; // BCP 47 tag (e.g. "en", "ur", "ar")
  languageLabel: string; // Human-readable label (e.g. "English", "Urdu")
  direction?: "ltr" | "rtl"; // Text direction; defaults to "ltr"
}

/** All translations available on Tanzil.net */
export const TRANSLATIONS: TranslationMeta[] = [
  // English (default: en.sahih)
  { id: "en.sahih", name: "Saheeh International", language: "en", languageLabel: "English" },
  { id: "en.pickthall", name: "Pickthall", language: "en", languageLabel: "English" },
  { id: "en.yusufali", name: "Yusuf Ali", language: "en", languageLabel: "English" },
  { id: "en.shakir", name: "Shakir", language: "en", languageLabel: "English" },
  { id: "en.arberry", name: "Arberry", language: "en", languageLabel: "English" },
  { id: "en.hilali", name: "Hilali & Khan", language: "en", languageLabel: "English" },
  { id: "en.maududi", name: "Maududi", language: "en", languageLabel: "English" },
  { id: "en.ahmedali", name: "Ahmed Ali", language: "en", languageLabel: "English" },
  { id: "en.qaribullah", name: "Qaribullah & Darwish", language: "en", languageLabel: "English" },
  { id: "en.itani", name: "Itani", language: "en", languageLabel: "English" },
  { id: "en.daryabadi", name: "Daryabadi", language: "en", languageLabel: "English" },
  { id: "en.sarwar", name: "Sarwar", language: "en", languageLabel: "English" },
  { id: "en.wahiduddin", name: "Wahiduddin Khan", language: "en", languageLabel: "English" },
  { id: "en.qarai", name: "Ali Quli Qarai", language: "en", languageLabel: "English" },
  { id: "en.mubarakpuri", name: "Mubarakpuri", language: "en", languageLabel: "English" },
  { id: "en.ahmedraza", name: "Ahmed Raza Khan", language: "en", languageLabel: "English" },
  { id: "en.transliteration", name: "English Transliteration", language: "en", languageLabel: "English" },

  // Urdu (default: ur.jalandhry)
  { id: "ur.jalandhry", name: "Jalandhry", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.maududi", name: "Maududi", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.junagarhi", name: "Junagarhi", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.ahmedali", name: "Ahmed Ali", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.kanzuliman", name: "Ahmed Raza Khan", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.qadri", name: "Tahir ul Qadri", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.jawadi", name: "Jawadi", language: "ur", languageLabel: "Urdu", direction: "rtl" },
  { id: "ur.najafi", name: "Najafi", language: "ur", languageLabel: "Urdu", direction: "rtl" },

  // Arabic
  { id: "ar.jalalayn", name: "Tafsir al-Jalalayn", language: "ar", languageLabel: "Arabic", direction: "rtl" },
  { id: "ar.muyassar", name: "Al-Muyassar", language: "ar", languageLabel: "Arabic", direction: "rtl" },

  // Persian
  { id: "fa.makarem", name: "Makarem Shirazi", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.fooladvand", name: "Fooladvand", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.ayati", name: "Ayati", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.khorramshahi", name: "Khorramshahi", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.sadeqi", name: "Sadeqi Tehrani", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.gharaati", name: "Gharaati", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.ansarian", name: "Ansarian", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.bahrampour", name: "Bahrampour", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.ghomshei", name: "Elahi Ghomshei", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.khorramdel", name: "Khorramdel", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.safavi", name: "Safavi", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.mojtabavi", name: "Mojtabavi", language: "fa", languageLabel: "Persian", direction: "rtl" },
  { id: "fa.moezzi", name: "Moezzi", language: "fa", languageLabel: "Persian", direction: "rtl" },

  // Turkish
  { id: "tr.diyanet", name: "Diyanet İşleri", language: "tr", languageLabel: "Turkish" },
  { id: "tr.vakfi", name: "Diyanet Vakfı", language: "tr", languageLabel: "Turkish" },
  { id: "tr.yazir", name: "Elmalılı Hamdi Yazır", language: "tr", languageLabel: "Turkish" },
  { id: "tr.ozturk", name: "Öztürk", language: "tr", languageLabel: "Turkish" },
  { id: "tr.bulac", name: "Ali Bulaç", language: "tr", languageLabel: "Turkish" },
  { id: "tr.yildirim", name: "Suat Yıldırım", language: "tr", languageLabel: "Turkish" },
  { id: "tr.ates", name: "Süleyman Ateş", language: "tr", languageLabel: "Turkish" },
  { id: "tr.yuksel", name: "Edip Yüksel", language: "tr", languageLabel: "Turkish" },
  { id: "tr.golpinarli", name: "Abdulbakî Gölpınarlı", language: "tr", languageLabel: "Turkish" },
  { id: "tr.transliteration", name: "Çeviriyazı", language: "tr", languageLabel: "Turkish" },

  // Indonesian
  { id: "id.indonesian", name: "Indonesian Ministry of Religious Affairs", language: "id", languageLabel: "Indonesian" },
  { id: "id.muntakhab", name: "Quraish Shihab", language: "id", languageLabel: "Indonesian" },
  { id: "id.jalalayn", name: "Tafsir Jalalayn", language: "id", languageLabel: "Indonesian" },

  // Malay
  { id: "ms.basmeih", name: "Basmeih", language: "ms", languageLabel: "Malay" },

  // Bengali
  { id: "bn.bengali", name: "Muhiuddin Khan", language: "bn", languageLabel: "Bengali" },
  { id: "bn.hoque", name: "Zohurul Hoque", language: "bn", languageLabel: "Bengali" },

  // French
  { id: "fr.hamidullah", name: "Hamidullah", language: "fr", languageLabel: "French" },

  // German
  { id: "de.bubenheim", name: "Bubenheim & Elyas", language: "de", languageLabel: "German" },
  { id: "de.khoury", name: "Khoury", language: "de", languageLabel: "German" },
  { id: "de.aburida", name: "Abu Rida", language: "de", languageLabel: "German" },
  { id: "de.zaidan", name: "Zaidan", language: "de", languageLabel: "German" },

  // Spanish
  { id: "es.garcia", name: "García", language: "es", languageLabel: "Spanish" },
  { id: "es.cortes", name: "Cortés", language: "es", languageLabel: "Spanish" },
  { id: "es.bornez", name: "Bórnez", language: "es", languageLabel: "Spanish" },

  // Russian
  { id: "ru.kuliev", name: "Kuliev", language: "ru", languageLabel: "Russian" },
  { id: "ru.krachkovsky", name: "Krachkovsky", language: "ru", languageLabel: "Russian" },
  { id: "ru.osmanov", name: "Osmanov", language: "ru", languageLabel: "Russian" },
  { id: "ru.porokhova", name: "Porokhova", language: "ru", languageLabel: "Russian" },
  { id: "ru.abuadel", name: "Abu Adel", language: "ru", languageLabel: "Russian" },
  { id: "ru.kalam", name: "Kalâm Şerif", language: "ru", languageLabel: "Russian" },
  { id: "ru.muntahab", name: "Al-Muntahab", language: "ru", languageLabel: "Russian" },
  { id: "ru.kuliev-alsaadi", name: "Kuliev + as-Saadi", language: "ru", languageLabel: "Russian" },
  { id: "ru.sablukov", name: "Sablukov", language: "ru", languageLabel: "Russian" },

  // Chinese
  { id: "zh.jian", name: "Ma Jian (Simplified)", language: "zh", languageLabel: "Chinese" },
  { id: "zh.majian", name: "Ma Jian (Traditional)", language: "zh", languageLabel: "Chinese" },

  // Dutch
  { id: "nl.keyzer", name: "Keyzer", language: "nl", languageLabel: "Dutch" },
  { id: "nl.leemhuis", name: "Leemhuis", language: "nl", languageLabel: "Dutch" },
  { id: "nl.siregar", name: "Siregar", language: "nl", languageLabel: "Dutch" },

  // Italian
  { id: "it.piccardo", name: "Piccardo", language: "it", languageLabel: "Italian" },

  // Portuguese
  { id: "pt.elhayek", name: "El-Hayek", language: "pt", languageLabel: "Portuguese" },

  // Swedish
  { id: "sv.bernstrom", name: "Bernström", language: "sv", languageLabel: "Swedish" },

  // Norwegian
  { id: "no.berg", name: "Einar Berg", language: "no", languageLabel: "Norwegian" },

  // Polish
  { id: "pl.bielawskiego", name: "Bielawskiego", language: "pl", languageLabel: "Polish" },

  // Romanian
  { id: "ro.grigore", name: "Grigore", language: "ro", languageLabel: "Romanian" },

  // Albanian
  { id: "sq.nahi", name: "Efendi Nahi", language: "sq", languageLabel: "Albanian" },
  { id: "sq.mehdiu", name: "Feti Mehdiu", language: "sq", languageLabel: "Albanian" },
  { id: "sq.ahmeti", name: "Sherif Ahmeti", language: "sq", languageLabel: "Albanian" },

  // Bosnian
  { id: "bs.korkut", name: "Korkut", language: "bs", languageLabel: "Bosnian" },
  { id: "bs.mlivo", name: "Mlivo", language: "bs", languageLabel: "Bosnian" },

  // Bulgarian
  { id: "bg.theophanov", name: "Theophanov", language: "bg", languageLabel: "Bulgarian" },

  // Czech
  { id: "cs.hrbek", name: "Hrbek", language: "cs", languageLabel: "Czech" },
  { id: "cs.nykl", name: "Nykl", language: "cs", languageLabel: "Czech" },

  // Azerbaijani
  { id: "az.mammadaliyev", name: "Məmmədəliyev & Bünyadov", language: "az", languageLabel: "Azerbaijani" },
  { id: "az.musayev", name: "Musayev", language: "az", languageLabel: "Azerbaijani" },

  // Amharic
  { id: "am.sadiq", name: "Sadiq & Sani Habib", language: "am", languageLabel: "Amharic" },

  // Hausa
  { id: "ha.gumi", name: "Gumi", language: "ha", languageLabel: "Hausa" },

  // Hindi
  { id: "hi.farooq", name: "Farooq Khan & Ahmad", language: "hi", languageLabel: "Hindi" },
  { id: "hi.hindi", name: "Farooq Khan & Nadwi", language: "hi", languageLabel: "Hindi" },

  // Japanese
  { id: "ja.japanese", name: "Japanese", language: "ja", languageLabel: "Japanese" },

  // Korean
  { id: "ko.korean", name: "Korean", language: "ko", languageLabel: "Korean" },

  // Kurdish
  { id: "ku.asan", name: "Asan", language: "ku", languageLabel: "Kurdish" },

  // Malayalam
  { id: "ml.abdulhameed", name: "Abdul Hameed & Parappoor", language: "ml", languageLabel: "Malayalam" },
  { id: "ml.karakunnu", name: "Karakunnu & Elayavoor", language: "ml", languageLabel: "Malayalam" },

  // Pashto
  { id: "ps.abdulwali", name: "Abdulwali", language: "ps", languageLabel: "Pashto" },

  // Sindhi
  { id: "sd.amroti", name: "Amroti", language: "sd", languageLabel: "Sindhi" },

  // Somali
  { id: "so.abduh", name: "Abduh", language: "so", languageLabel: "Somali" },

  // Swahili
  { id: "sw.barwani", name: "Al-Barwani", language: "sw", languageLabel: "Swahili" },

  // Tajik
  { id: "tg.ayati", name: "Oyatī", language: "tg", languageLabel: "Tajik" },

  // Tamil
  { id: "ta.tamil", name: "Jan Turst Foundation", language: "ta", languageLabel: "Tamil" },

  // Tatar
  { id: "tt.nugman", name: "Yakub Ibn Nugman", language: "tt", languageLabel: "Tatar" },

  // Thai
  { id: "th.thai", name: "King Fahad Quran Complex", language: "th", languageLabel: "Thai" },

  // Uyghur
  { id: "ug.saleh", name: "Muhammad Saleh", language: "ug", languageLabel: "Uyghur" },

  // Uzbek
  { id: "uz.sodik", name: "Muhammad Sodik", language: "uz", languageLabel: "Uzbek" },

  // Divehi
  { id: "dv.divehi", name: "Office of the President of Maldives", language: "dv", languageLabel: "Divehi" },

  // Amazigh
  { id: "ber.mensur", name: "At Mensur", language: "ber", languageLabel: "Amazigh" },
];

/** Default translation: Urdu Jalandhry as requested */
export const DEFAULT_TRANSLATION_ID = "ur.jalandhry";

/** Fallback translation for provenance (used when no user preference exists) */
export const FALLBACK_TRANSLATION_ID = "en.sahih";

/** Get translation metadata by ID */
export function getTranslation(id: string): TranslationMeta | undefined {
  return TRANSLATIONS.find((t) => t.id === id);
}

/** Group translations by language for UI display */
export function getTranslationsByLanguage(): Record<string, TranslationMeta[]> {
  const grouped: Record<string, TranslationMeta[]> = {};
  for (const t of TRANSLATIONS) {
    if (!grouped[t.language]) {
      grouped[t.language] = [];
    }
    grouped[t.language].push(t);
  }
  return grouped;
}

/** Language display labels */
export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  ur: "Urdu",
  ar: "Arabic",
  fa: "Persian",
  tr: "Turkish",
  id: "Indonesian",
  ms: "Malay",
  bn: "Bengali",
  fr: "French",
  de: "German",
  es: "Spanish",
  ru: "Russian",
  zh: "Chinese",
  nl: "Dutch",
  it: "Italian",
  pt: "Portuguese",
  sv: "Swedish",
  no: "Norwegian",
  pl: "Polish",
  ro: "Romanian",
  sq: "Albanian",
  bs: "Bosnian",
  bg: "Bulgarian",
  cs: "Czech",
  az: "Azerbaijani",
  am: "Amharic",
  ha: "Hausa",
  hi: "Hindi",
  ja: "Japanese",
  ko: "Korean",
  ku: "Kurdish",
  ml: "Malayalam",
  ps: "Pashto",
  sd: "Sindhi",
  so: "Somali",
  sw: "Swahili",
  tg: "Tajik",
  ta: "Tamil",
  tt: "Tatar",
  th: "Thai",
  ug: "Uyghur",
  uz: "Uzbek",
  dv: "Divehi",
  ber: "Amazigh",
};
