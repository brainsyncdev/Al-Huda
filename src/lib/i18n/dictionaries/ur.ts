import type { TranslationKey } from "./en";

/**
 * Urdu dictionary.
 * Typed against the English key surface so missing keys are caught at build time.
 */
export const ur: Record<TranslationKey, string | { one?: string; other?: string }> = {
  "common.loading": "لوڈ ہو رہا ہے…",
  "common.error": "کچھ غلط ہو گیا",
  "common.notFound": "نہیں ملا",
  "common.tryAgain": "دوبارہ کوشش کریں",
  "common.backToHome": "ہوم پر واپس جائیں",
  "common.close": "بند کریں",
  "common.cancel": "منسوخ کریں",
  "common.save": "محفوظ کریں",
  "common.delete": "حذف کریں",
  "common.search": "تلاش کریں",
  "common.noResults": "کوئی نتائج نہیں ملے",
  "common.unavailable": "دستیاب نہیں",
  "common.previous": "پچھلا",
  "common.next": "اگلا",
  "common.back": "واپس",
  "common.continue": "جاری رکھیں",
  "common.skip": "چھوڑ دیں",
  "common.submit": "جمع کرائیں",
  "common.copy": "کاپی کریں",
  "common.copied": "کاپی ہو گیا",
  "common.menu": "مینو",
  "common.settings": "ترتیبات",
  "common.home": "ہوم",
  "common.language": "زبان",
  "common.openMenu": "مینو کھولیں",
  "common.closeMenu": "مینو بند کریں",
  "common.remove": "ہٹائیں",
  "common.viewAll": "سب دیکھیں",
  "common.learnMore": "مزید جانیں",
  "common.readMore": "مزید پڑھیں",
  "common.all": "سب",
  "common.none": "کوئی نہیں",
  "common.optional": "اختیاری",
  "common.required": "ضروری",
  "common.yes": "ہاں",
  "common.no": "نہیں",

  "nav.discover": "دریافت کریں",
  "nav.read": "پڑھیں",
  "nav.explore": "کھوجیں",
  "nav.topics": "موضوعات",
  "nav.search": "تلاش",
  "nav.learn": "سیکھیں",
  "nav.plans": "منصوبے",
  "nav.quiz": "کوئز",
  "nav.library": "لائبریری",
  "nav.settings": "ترتیبات",
  "nav.primary": "بنیادی",
  "nav.footer": "فوٹر",
  "nav.skipToContent": "مرکزی مواد پر جائیں",

  "layout.siteName": "الہدیٰ",
  "layout.siteTagline": "قرآن پڑھیں، سمجھیں اور جڑیں",
  "layout.madeWithDyad": "Dyad سے بنایا گیا",

  "footer.about": "تعارف",
  "footer.sources": "ماخذ",
  "footer.report": "مسئلہ رپورٹ کریں",
  "footer.accessibility": "رسائی",
  "footer.privacy": "رازداری",
  "footer.terms": "شرائط",
  "footer.tagline": "قرآن پڑھنے اور مطالعہ کرنے کی ایک پرسکون، ماخذ پر مبنی جگہ۔",
  "footer.arabicCredit":
    "عربی متن (عثمانی): quranenc.com کے ذریعے، quran-json v3.1.2 (CC-BY-4.0) کے ذریعے تقسیم کیا گیا۔",
  "footer.translationCredit":
    "100+ زبانوں میں تراجم Tanzil.net کے ذریعے۔ نقلِ حرفی Tanzil.net کے ذریعے۔",
  "footer.editorialNote":
    "موضوعات کا انتخاب ایڈیٹوریل رہنمائی ہے — تفسیر نہیں، فتویٰ نہیں۔ ہر موضوع کے صفحے پر نظرثانی کی حیثیت دیکھیں۔",
  "footer.licenseNote": "مواد کے لائسنس کا احترام کیا گیا؛ /sources دیکھیں۔",
  "footer.copyright": "© {year} {site}۔ مواد کے لائسنس کا احترام کیا گیا؛ /sources دیکھیں۔",

  "home.verseOfDay": "آج کی آیت",
  "home.verseOfDayUnavailable": "آج کی آیت ابھی دستیاب نہیں ہے۔",
  "home.verseOfDayError":
    "آج کی آیت لوڈ نہیں ہو سکی۔ یہ آپ کی اگلی اس صفحے کی ملاقات پر ظاہر ہوگی۔",
  "home.continueReading": "پڑھنا جاری رکھیں",
  "home.lastVisited": "آخری ملاقات {date}",
  "home.openFullPage": "مکمل صفحہ کھولیں",
  "home.translationCredit": "ترجمہ: {edition} · ",
  "home.sourceDetails": "ماخذ کی تفصیلات",
  "home.continueLearning": "سیکھنا جاری رکھیں",
  "home.startLearning": "سیکھنا شروع کریں",
  "home.recommendedFor": "{audience} کے لیے تجویز کردہ",
  "home.allLearningPaths": "تمام سیکھنے کے راستے",
  "home.learningHubDescription":
    "قرآن کی تعلیم کے لیے رہنمائی یافتہ سیکھنے کے راستے — ترتیب شدہ نصاب، ترتیب شدہ مراحل، تفکر کے سوالات، اور خود تشخیص۔",
  "home.takeGuidedTour": "رہنمائی والا دورہ لیں",
  "home.browsePaths": "راستے دیکھیں",

  "discover.title": "اپنا نقطہ آغاز دریافت کریں",
  "discover.intro":
    "قرآن بہت سے داخلے کے نقاط پیش کرتا ہے۔ یہ مرکز سیکھنے کے راستوں، وسیع موضوعات، ابعاد، اور تلاش کو اکٹھا کرتا ہے تاکہ آپ جہاں ہیں وہاں سے شروع کر سکیں۔",
  "discover.startWithPath": "ایک راستے سے شروع کریں",
  "discover.pathDescription":
    "مختلف سامعین اور اہداف کے لیے ترتیب شدہ سیکھنے کے سلسلے۔ ہر راستہ ترتیب دیا گیا ہے اور اس کی نظرثانی کی حیثیت نشان زد ہے۔",
  "discover.forAudience": "{audience} کے لیے",
  "discover.allPaths": "تمام سیکھنے کے راستے",
  "discover.broadestThemes": "وسیع ترین موضوعات",
  "discover.themesDescription":
    "وہ موضوعات جو سب سے زیادہ ابعاد میں ظاہر ہوتے ہیں۔ یہ موضوعات زندگی اور مطالعہ کے کئی شعبوں کو جوڑتے ہیں۔",
  "discover.inDimensions": "{count} ابعاد میں",
  "discover.allTopics": "تمام موضوعات",
  "discover.exploreByDimension": "بعد کے ذریعے کھوجیں",
  "discover.dimensionDescription":
    "دس زندگی کے ابعاد — روحانی، ذاتی، خاندانی، اور مزید — ایڈیٹوریل رہنمائی کے طور پر۔",
  "discover.fullDimensionExplorer": "مکمل بعد کا کھوجی",
  "discover.goDeeper": "گہرائی میں جائیں",
  "discover.knowledgeGraph": "علمی گراف",
  "discover.graphDescription":
    "دیکھیں کہ ابعاد موضوعات سے کیسے جڑتے ہیں، اور موضوعات ایک دوسرے سے کیسے متعلق ہیں۔",
  "discover.searchQuran": "قرآن میں تلاش کریں",
  "discover.searchDescription":
    "حوالہ، عربی متن، ترجمہ، یا موضوع کے ذریعے آیات تلاش کریں۔",
  "discover.readQuran": "قرآن پڑھیں",
  "discover.readDescription":
    "عثمانی متن اور تراجم کے ساتھ تمام 114 سورتیں دیکھیں۔",
  "discover.learningDashboard": "سیکھنے کا ڈیش بورڈ",
  "discover.dashboardDescription":
    "اپنی پیشرفت ٹریک کریں، کوئز لیں، اور اپنے مطالعہ کے منصوبے منظم کریں۔",
  "discover.editorialNote":
    "اس صفحے پر تمام موضوعات، ابعاد، اور سیکھنے کے راستے اپنی نظرثانی کی حیثیت رکھتے ہیں۔ ایڈیٹوریل انتخاب رہنمائی کے لیے ہیں، تفسیر یا فتاویٰ نہیں۔",

  "explore.title": "قرآن کھوجیں",
  "explore.intro":
    "10 زندگی کے ابعاد کے ذریعے قرآن دریافت کریں۔ ہر بعد ترتیب شدہ موضوعات سے جڑتا ہے اور مزید مطالعہ کے لیے تلاش کے الفاظ پیش کرتا ہے۔",
  "explore.dimensionNote":
    "نیچے کے ابعاد موضوع کی سطح کی رہنمائی ہیں۔ انفرادی آیات کو بعد سے درجہ بند نہیں کیا گیا۔",
  "explore.covers": "احاطہ کرتا ہے",
  "explore.exploreArrow": "کھوجیں →",
  "explore.startWithTopics": "ترتیب شدہ موضوعات سے شروع کریں",
  "explore.topicsDescription":
    "یہ موضوعات رہنمائی کے طور پر ابعاد سے منسلک ہیں۔ ہر موضوع کے صفحے پر اس کی نظرثانی کی حیثیت ہے۔",
  "explore.domainExplorer": "ڈومین کھوجی",
  "explore.domainDescription":
    "ڈومینز ابعاد سے مختلف ہیں: ڈومینز ایڈیٹوریل منصوبہ بندی کے لیے وسیع موضوعی شعبوں کو منظم کرتے ہیں۔",
  "explore.browseDomains": "ڈومین کیٹلاگ دیکھیں",
  "explore.graphExplorer": "علمی گراف کھوجی",
  "explore.graphDescription":
    "دیکھیں کہ دس ابعاد ترتیب شدہ موضوعات سے کیسے جڑتے ہیں، اور موضوعات ایک دوسرے سے کیسے متعلق ہیں۔",
  "explore.openGraph": "گراف کھوجی کھولیں",
  "explore.searchTitle": "قرآن میں تلاش کریں",
  "explore.searchDescription":
    "کچھ مخصوص تلاش کر رہے ہیں؟ حوالہ، عربی متن، ترجمہ، یا موضوع کے ذریعے تلاش کریں۔",
  "explore.openSearch": "تلاش کھولیں",

  "quran.title": "قرآن",
  "quran.intro":
    "ہر سورت، ترتیب وار، اپنے عربی نام اور آیتوں کی تعداد کے ساتھ۔",
  "quran.surah": "سورت",
  "quran.ayah": "آیت",
  "quran.juz": "پارہ {number}",
  "quran.page": "صفحہ {number}",
  "quran.hizb": "حزب {number}",
  "quran.ruku": "رکوع {number}",
  "quran.manzil": "منزل {number}",
  "quran.sajdah": "سجدہ والی آیت",
  "quran.readFullSurah": "مکمل سورت پڑھیں",
  "quran.appearsInTopics": "موضوعات میں شامل ہے",
  "quran.topicsNote":
    "موضوع کے صفحات نظرثانی کی حیثیت بتاتے ہیں اور تفسیر نہیں ہیں۔",
  "quran.appearsInPaths": "سیکھنے کے راستوں میں شامل ہے",
  "quran.pathsNote":
    "سیکھنے کے راستے ترتیب شدہ مطالعہ کے سلسلے ہیں۔ ہر راستہ اپنی نظرثانی کی حیثیت بتاتا ہے اور تفسیر نہیں ہے۔",
  "quran.previousAyah": "پچھلی · {surah}:{ayah}",
  "quran.nextAyah": "اگلی · {surah}:{ayah}",
  "quran.breadcrumb": "قرآن",
  "quran.surahVerses": "سورت کی آیات",
  "quran.readContinuously":
    "نیچے مسلسل پڑھیں۔ عربی سائز ایڈجسٹ کرنے اور ترجمہ/نقلِ حرفی ٹوگل کرنے کے لیے کنٹرولز استعمال کریں۔",
  "quran.navigateInstruction":
    "آیت نمبر کے ذریعے نیویگیٹ کریں یا انڈیکس میں فہرست استعمال کریں۔",
  "quran.previousSurah": "پچھلی: {surah}",
  "quran.nextSurah": "اگلی: {surah}",
  "quran.ayahReference": "آیت کا حوالہ",
  "quran.surahOf":
    "114 میں سے سورت {surah} · {translation} · {revelation}",

  "reader.translation": "ترجمہ",
  "reader.arabicSize": "عربی متن کا سائز",
  "reader.textSize": "متن کا سائز",
  "reader.lineSpacing": "لائن کا فاصلہ",
  "reader.spacing": "فاصلہ",
  "reader.transliteration": "نقلِ حرفی",
  "reader.small": "چھوٹا",
  "reader.medium": "درمیانہ",
  "reader.large": "بڑا",
  "reader.extraLarge": "بہت بڑا",
  "reader.compact": "مختصر",
  "reader.normal": "عام",
  "reader.loose": "کھلا",
  "reader.translationsShown": "تراجم دکھائے گئے",
  "reader.translationsHidden": "تراجم چھپائے گئے",
  "reader.transliterationShown": "نقلِ حرفی دکھائی گئی",
  "reader.transliterationHidden": "نقلِ حرفی چھپائی گئی",
  "reader.translationEdition": "ترجمہ ایڈیشن",
  "reader.smallAria": "چھوٹا متن سائز",
  "reader.mediumAria": "درمیانہ متن سائز",
  "reader.largeAria": "بڑا متن سائز",
  "reader.extraLargeAria": "بہت بڑا متن سائز",
  "reader.lineHeightAria": "لائن کا فاصلہ: {value}",

  "translationSelector.select": "ترجمہ منتخب کریں",
  "translationSelector.aria": "ترجمہ منتخب کنندہ",
  "translationSelector.searchPlaceholder": "تراجم تلاش کریں…",
  "translationSelector.searchAria": "تراجم تلاش کریں",
  "translationSelector.available": "دستیاب تراجم",
  "translationSelector.rtl": "(دائیں سے بائیں)",
  "translationSelector.noMatches": "\"{search}\" سے کوئی ترجمہ نہیں ملا",
  "translationSelector.viaTanzil": "تراجم Tanzil.net کے ذریعے",
  "translationSelector.loading": "لوڈ ہو رہا ہے…",

  "searchPage.title": "قرآن میں تلاش کریں",
  "searchPage.placeholder":
    "حوالہ (مثلاً \"2:255\"، \"al-baqarah 153\")، سورت کا نام، عربی متن، ترجمہ، یا موضوع کے ذریعے آیات تلاش کریں۔",
  "searchPage.loadingFilters": "فلٹرز لوڈ ہو رہے ہیں…",
  "searchPage.invalidFilters":
    "ایک یا زیادہ فلٹر قدریں غلط تھیں اور نظر انداز کر دی گئیں۔",
  "searchPage.filterNote":
    "فلٹرز تلاش کو محدود کرتے ہیں نہ کہ خود متن کو دیکھتے ہیں۔ اوپر کوئی لفظ یا حوالہ لکھیں تاکہ مماثل آیات دیکھیں۔",
  "searchPage.matchingNote":
    "مماثلت قاعدہ پر مبنی اور شفاف ہے۔ پہلے حوالہ جات، پھر لفظی مماثلتیں۔",
  "searchPage.editionSearch":
    "ایک مخصوص ترجمہ یا کلاسیکی تفسیر ایڈیشن میں تلاش کریں۔ متن پہلی بار Tanzil.net سے حاصل کیا جاتا ہے اور کیش کیا جاتا ہے۔",
  "searchPage.chooseEdition": "ایڈیشن منتخب کریں…",
  "searchPage.searchEdition": "ایڈیشن میں تلاش کریں",
  "searchPage.editionNote":
    "ایڈیشن کی تلاش صرف اسی ایڈیشن کے اندر دیکھتی ہے، اس لیے کہیں اور موجود لفظ نہیں مل سکتا۔",
  "searchPage.typeMore": "تلاش کے لیے کم از کم دو حروف لکھیں۔",
  "searchPage.unknownEdition":
    "نامعلوم ایڈیشن: {edition}۔ تلاش کنٹرولز سے ایڈیشن منتخب کریں۔",
  "searchPage.backToDefault": "ڈیفالٹ تلاش پر واپس جائیں",
  "searchPage.tryAgainLater": "براہ کرم بعد میں دوبارہ کوشش کریں۔",
  "searchPage.parsedAsRef": "حوالہ کے طور پر سمجھا گیا: {results}",
  "searchPage.refOutOfRange": "اس سورت کے لیے حوالہ حد سے باہر ہے۔",
  "searchPage.noMatches":
    "کوئی مماثلت نہیں ملی۔ مختلف سوال آزمائیں یا اپنے فلٹرز ایڈجسٹ کریں۔",
  "searchPage.activeFilters":
    "فعال فلٹرز نتیجہ سیٹ کو محدود کر رہے ہیں۔ انہیں صاف کرنے سے تلاش وسیع ہوگی۔",
  "searchPage.inPath": "راستے میں: {path}",
  "searchPage.noMatchesEdition":
    "{edition} میں \"{query}\" کے لیے کوئی مماثلت نہیں ملی۔",
  "searchPage.editionScoped":
    "ایڈیشن کی تلاش ترجمہ متن میں لفظی مماثلتیں ڈھونڈتی ہے۔",
  "searchPage.tafsirLoadError":
    "ایک یا زیادہ تفسیر ایڈیشن لوڈ نہیں ہو سکے۔ نیچے کے نتائج نامکمل ہیں۔",
  "searchPage.tafsirScoped":
    "تفسیر کی تلاش کلاسیکی عربی متن میں لفظی مماثلتیں ڈھونڈتی ہے۔",
  "searchPage.wordsToSearch": "منتخب ایڈیشن میں تلاش کے الفاظ",
  "searchPage.searchModes": "تلاش کے موڈز",
  "searchPage.wordsPlaceholder": "ایڈیشن میں تلاش کے الفاظ…",
  "searchPage.tafsirJalalayn": "تفسیر الجلالین",
  "searchPage.alMuyassar": "المیسر",
  "searchPage.pickthall": "پک تھال",
  "searchPage.jalandhry": "جالندھری (اردو)",

  "searchBox.placeholder": "حوالہ، ترجمہ، یا عربی متن تلاش کریں…",
  "searchBox.aria": "قرآن میں تلاش کریں",
  "searchBox.button": "تلاش کریں",
  "searchBox.shortcut": "تلاش پر توجہ کے لیے سلیش دبائیں",
  "searchBox.suggestions": "تلاش کی تجاویز",
  "searchBox.suggestionCount": "{count} تجاویز دستیاب",
  "searchBox.verse": "آیت",
  "searchBox.surah": "سورت",
  "searchBox.topic": "موضوع",

  "searchFilters.defaultMode": "ڈیفالٹ (عربی + بلٹ ان انگریزی)",
  "searchFilters.tafsirMode": "دونوں کلاسیکی تفسیریں",
  "searchFilters.any": "کوئی بھی",
  "searchFilters.arabicOnly": "صرف عربی متن",
  "searchFilters.englishOnly": "صرف انگریزی متن",
  "searchFilters.allSurahs": "تمام سورتیں",
  "searchFilters.allTypes": "تمام اقسام",
  "searchFilters.meccan": "مکی",
  "searchFilters.medinan": "مدنی",
  "searchFilters.allJuz": "تمام پارے",
  "searchFilters.allTopics": "تمام موضوعات",
  "searchFilters.classicalTafsirs": "کلاسیکی تفسیریں",
  "searchFilters.arabic": "صرف عربی",
  "searchFilters.english": "صرف انگریزی",
  "searchFilters.removeFilter": "{label} ہٹائیں",

  "topics.title": "موضوع کے ذریعے کھوجیں",
  "topics.intro":
    "ایڈیٹوریل داخلے کے نقاط جو مشہور آیات کو موضوع کے لحاظ سے گروپ کرتے ہیں۔ ہر موضوع کے صفحے پر اس کی نظرثانی کی حیثیت ہے۔",
  "topics.allTopics": "تمام موضوعات",
  "topics.relationsNote":
    "تمام موضوع کے تعلقات قسم کے ہیں (موضوعی، لفظی، کراس ریفرنس، یا ایڈیٹوریل) اور ان کی نظرثانی کی حیثیت نشان زد ہے۔",
  "topics.reviewStatus":
    "نظرثانی کی حیثیت: {status} — {curator} نے {method} کے ذریعے ترتیب دیا (آخری پاس {date})۔",
  "topics.editorialNote":
    "ایڈیٹوریل انتخاب تفسیر نہیں ہیں اور فتاویٰ کے طور پر مقصود نہیں ہیں۔",
  "topics.versesOnTopic": "اس موضوع پر آیات",
  "topics.curatedCount": "{total} میں سے {shown} ترتیب شدہ آیات دکھائی گئیں",
  "topics.unresolvedCount":
    "{count} ترتیب شدہ حوالے قرآن کے مقررہ ڈیٹا سیٹ سے حل نہیں ہو سکے اور اس لیے نہیں دکھائے گئے۔",
  "topics.unresolvedNote":
    "یہ ایڈیٹوریل انتخاب میں ڈیٹا کی سالمیت کا مسئلہ ہے، نہ کہ غائب آیت کا۔ یہ خاموشی سے چھوڑنے کے بجائے سامنے لایا گیا ہے تاکہ اوپر کی گنتی کبھی بڑھا چڑھا کر نہ بتائی جائے۔",
  "topics.relatedTopics": "متعلقہ موضوعات",
  "topics.exploreByDimension": "اس موضوع کو بعد کے ذریعے کھوجیں",
  "topics.dimensionMapping":
    "یہ موضوع {count} ابعاد کے ایڈیٹوریل رہنمائی میپنگ میں ظاہر ہوتا ہے۔ ہر بعد کا صفحہ دکھاتا ہے کہ یہ موضوع دوسرے موضوعات سے کیسے جڑتا ہے۔",
  "topics.openDimension": "{dimension} بعد کھولیں →",
  "topics.dimensionNote":
    "بعد سے موضوع کی میپنگ ایڈیٹوریل رہنمائی ہیں، آیت کی سطح کی درجہ بندی نہیں۔",
  "topics.proposedDomains": "تجویز کردہ جستجو کے ڈومینز",
  "topics.domainMapping":
    "یہ موضوع ایڈیٹوریل طور پر {count} ڈومینز سے تعلق رکھنے کی تجویز ہے۔ یہ نظرثانی کے منتظم تجاویز ہیں — قرآنی passages کی علمی درجہ بندی نہیں۔",
  "topics.navigationAid": "رہنمائی کا ذریعہ",
  "topics.organizationalProposal": "تنظیمی تجویز",
  "topics.openDomain": "{domain} ڈومین کھولیں →",
  "topics.domainNote":
    "ڈومین سے موضوع کے تعلقات تنظیمی تجاویز ہیں، علمی نتائج نہیں۔",
  "topics.learningPaths": "اس موضوع پر سیکھنے کے راستے",
  "topics.pathsDescription":
    "ان راستوں میں وہ مراحل شامل ہیں جو اس موضوع کا حوالہ دیتے ہیں۔ ہر راستہ اپنی نظرثانی کی حیثیت بتاتا ہے اور تفسیر نہیں ہے۔",
  "topics.provenance":
    "ماخذ: اوپر کی ہر آیت اپنا مؤثر نظرثانی ریکارڈ دکھاتی ہے۔ انفرادی نظرثانی کے بغیر تعلق موضوع کی سطح کا ریکارڈ وراثت میں لیتا ہے۔ کوئی AI سے تیار کردہ تفسیر بطور وحی پیش نہیں کی جاتی۔",

  "graph.title": "علمی گراف کھوجی",
  "graph.filterByDimension": "بعد کے ذریعے فلٹر کریں",
  "graph.all": "سب",
  "graph.scopeNote":
    "یہ گراف ابعاد اور ترتیب شدہ موضوعات کے درمیان ایڈیٹوریل رہنمائی میپنگ دکھاتا ہے، اور ترتیب شدہ موضوعات کے درمیان ضمنی تعلقات۔ یہ انفرادی آیات کو بعد سے درجہ بند نہیں کرتا۔ ہر نوڈ اور کنارہ اپنی نظرثانی کی حیثیت رکھتا ہے۔",
  "graph.nodeCount":
    "{nodes} نوڈز ({dimensions} ابعاد، {topics} موضوعات)، {edges} کنارے۔ تفصیلات کے لیے نوڈ پر کلک کریں یا ٹیب کریں۔",
  "graph.dimensionNode": "بعد کا نوڈ",
  "graph.topicNode": "موضوع کا نوڈ",
  "graph.dimensionTopicMapping": "بعد → موضوع میپنگ",
  "graph.topicRelationship": "موضوع ↔ موضوع تعلق",
  "graph.aria":
    "علمی گراف جو ابعاد اور موضوعات کو ان کے ایڈیٹوریل تعلقات کے ساتھ دکھاتا ہے",
  "graph.svgTitle": "علمی گراف کھوجی",
  "graph.svgDesc":
    "مرکزی ترتیب: بیرونی رنگ میں ابعاد، اندرونی رنگ میں موضوعات، ایڈیٹوریل تعلقات کناروں کے ساتھ۔",
  "graph.keyboardHelp":
    "کی بورڈ سے قابل رسائی: نوڈز کے درمیان ٹیب، رنگ کے اندر سائیکل کرنے کے لیے بائیں/دائیں تیر، رنگ تبدیل کرنے کے لیے اوپر/نیچے تیر، منتخب کرنے کے لیے Enter یا Space۔",
  "graph.listView": "تمام نوڈز کی فہرست ({count})",
  "graph.dimension": "بعد",
  "graph.topic": "موضوع",
  "graph.details": "{label} کی تفصیلات",
  "graph.closeDetails": "تفصیلات بند کریں",
  "graph.reviewStatus": "نظرثانی کی حیثیت:",
  "graph.curator": "کیوریٹر:",
  "graph.method": "طریقہ:",
  "graph.lastPass": "آخری ایڈیٹوریل پاس:",
  "graph.connections": "تعلقات ({count})",
  "graph.openPage": "{type} صفحہ کھولیں →",
  "graph.unresolvedCount":
    "گراف ڈیٹا میں {count} حل نہ شدہ حوالے۔",
  "graph.topicGraph":
    "ترتیب شدہ قرآنی موضوعات کے درمیان تعلقات دکھانے والا گراف",
  "graph.topicGraphTitle": "موضوع کے تعلقات کا گراف",

  "learn.paths": "راستے",
  "learn.plans": "منصوبے",
  "learn.revise": "نظرثانی",
  "learn.quiz": "کوئز",
  "learn.sections": "سیکھنے کے حصے",
  "learn.dashboard": "سیکھنے کا مرکز",
  "learn.dashboardDescription":
    "رہنمائی یافتہ قرآنی مطالعہ کے لیے آپ کا ذاتی نقطہ آغاز۔ جہاں چھوڑا تھا وہاں سے جاری رکھیں، جو سیکھا اس کی نظرثانی کریں، یا نئے موضوعات کھوجیں۔",
  "learn.reviseDue": "نظرثانی واجب النظر آیات",
  "learn.versesDue": "آج نظرثانی کے لیے {count} آیات واجب النظر ہیں۔",
  "learn.continueQuiz": "کوئز جاری رکھیں",
  "learn.quizInProgress": "آپ کا کوئز سیشن جاری ہے۔",
  "learn.continuePath": "{path} جاری رکھیں",
  "learn.continueLearning": "سیکھنے کا راستہ جاری رکھیں",
  "learn.stepsComplete": "{total} میں سے {done} مراحل مکمل۔",
  "learn.pickUpWhereLeft": "جہاں چھوڑا تھا وہاں سے اٹھائیں۔",
  "learn.continueReading": "پڑھنا جاری رکھیں: {plan}",
  "learn.resumePlan": "اپنا پڑھنے کا منصوبہ دوبارہ شروع کریں۔",
  "learn.startWithPath": "سیکھنے کے راستے سے شروع کریں",
  "learn.pathDescription":
    "منظم قرآنی مطالعہ کے لیے رہنمائی یافتہ نصاب۔",
  "learn.takeQuiz": "خود تشخیصی کوئز لیں",
  "learn.quizDescription":
    "چیک کریں کہ آپ کیا جانتے ہیں اور کیا دوبارہ دیکھنے کے قابل ہے۔",
  "learn.learningHub": "سیکھنے کا مرکز",
  "learn.hubDescription":
    "رہنمائی یافتہ قرآنی مطالعہ کے لیے آپ کا ذاتی نقطہ آغاز۔",
  "learn.startJourney": "اپنا سیکھنے کا سفر شروع کریں",
  "learn.journeyDescription":
    "آپ نے ابھی تک کوئی راستے، کوئز، یا نظرثانی کے منصوبے شروع نہیں کیے۔ بنیاد بنانے کے لیے رہنمائی یافتہ سیکھنے کے راستے سے شروع کریں۔",
  "learn.browsePaths": "سیکھنے کے راستے دیکھیں",
  "learn.continue": "جاری رکھیں",
  "learn.dueForReview": "نظرثانی کے لیے واجب النظر",
  "learn.pathsInProgress": "جاری راستے",
  "learn.quizAttempts": "کوئز کی کوششیں",
  "learn.revisionPlan": "نظرثانی کا منصوبہ",
  "learn.lastRead": "آخری پڑھا: سورت {surah}:{ayah}",
  "learn.readOn": "{date} کو پڑھا",
  "learn.inProgressQuiz": "جاری کوئز",
  "learn.questionsAnswered":
    "{total} میں سے {answered} سوالات کے جواب دیے گئے",
  "learn.readingPlan": "پڑھنے کا منصوبہ: {label}",
  "learn.goalPerSession": "مقصد: فی سیشن {count} آیات",
  "learn.explore": "کھوجیں",

  "paths.title": "سیکھنے کے راستے",
  "paths.description":
    "رہنمائی یافتہ قرآنی مطالعہ کے لیے منظم نصاب۔ ہر راستہ مخصوص سامعین اور سیکھنے کے مقصد کے لیے ڈیزائن کیا گیا ہے، ترتیب شدہ مراحل کے ساتھ جو تدریسی طور پر تفہیم بناتے ہیں۔",
  "paths.backToPaths": "راستوں پر واپس",
  "paths.stepsCompleted": "{total} میں سے {done} مراحل مکمل",
  "paths.stepNavigation": "مرحلے کی نیویگیشن",
  "paths.step": "مرحلہ {number}",
  "paths.objective": "مقصد",
  "paths.reflection": "تفکر کا سوال",
  "paths.verse": "آیت {surah}:{ayah}",
  "paths.markComplete": "مکمل نشان زد کریں",
  "paths.completed": "مکمل",
  "paths.testRecall": "کوئز کے ساتھ اپنی یاد آزمائیں",
  "paths.editorialStatus": "ایڈیٹوریل حیثیت:",
  "paths.statusNote":
    "یہ راستہ {status} ہے۔ مواد الہدیٰ کی ایڈیٹوریل ٹیم نے ترتیب دیا ہے لیکن ابھی تکqualified scholar نے نظرثانی نہیں کی۔ یہاں کچھ بھی مستند مذہبی تفسیر کے طور پر پیش نہیں کیا جاتا۔",
  "paths.loading": "لوڈ ہو رہا ہے…",
  "paths.welcome": "الہدیٰ میں خوش آمدید",
  "paths.chooseGoal":
    "ذاتی تجاویز حاصل کرنے کے لیے اپنا سیکھنے کا مقصد منتخب کریں۔",
  "paths.skipForNow": "ابھی کے لیے چھوڑ دیں",
  "paths.recommended": "آپ کے لیے تجویز کردہ",
  "paths.recommendedDesc":
    "آپ کے مقصد کی بنیاد پر، ہم ان راستوں سے شروع کرنے کی تجویز کرتے ہیں۔",
  "paths.steps": "{count} مراحل",
  "paths.startLearning": "سیکھنا شروع کریں",

  "quiz.surahId": "سورت کی شناخت",
  "quiz.translationMatch": "ترجمہ مماثلت",
  "quiz.ayahOrdering": "آیت کی ترتیب",
  "quiz.topicMatch": "موضوع مماثلت",
  "quiz.ayahRecall": "آیت یاد",
  "quiz.missingWord": "غائب لفظ",
  "quiz.refRecognition": "حوالہ شناخت",
  "quiz.emptyPlan":
    "آپ کا نظرثانی کا منصوبہ خالی ہے۔ پہلے نظرثانی کے لیے آیات شامل کریں۔",
  "quiz.generationFailed": "جنریشن ناکام",
  "quiz.couldNotGenerate":
    "دیے گئے ماخذ سے سوالات جنریٹ نہیں ہو سکے",
  "quiz.failedToGenerate": "کوئز جنریٹ کرنے میں ناکامی",
  "quiz.defaultMix": "ڈیفالٹ مکس",
  "quiz.specificSurah": "مخصوص سورت",
  "quiz.learningPath": "سیکھنے کا راستہ",
  "quiz.topic": "موضوع",
  "quiz.myRevision": "میرا نظرثانی کا منصوبہ",
  "quiz.selectSurah": "سورت منتخب کریں",
  "quiz.selectPath": "راستہ منتخب کریں",
  "quiz.selectTopic": "موضوع منتخب کریں",
  "quiz.generating": "جنریٹ ہو رہا ہے…",
  "quiz.generate": "کوئز جنریٹ کریں",
  "quiz.answerRecorded": "جواب ریکارڈ ہو گیا۔",
  "quiz.selectAnswer": "جاری رکھنے کے لیے جواب منتخب کریں۔",
  "quiz.seeResults": "نتائج دیکھیں",
  "quiz.nextQuestion": "اگلا سوال",
  "quiz.correct": "درست",
  "quiz.incorrect": "غلط",
  "quiz.unanswered": "بلا جواب",
  "quiz.selfAssessed": "خود تشخیص شدہ",
  "quiz.allInPlan":
    "یہ تمام آیات پہلے ہی آپ کے نظرثانی کے منصوبے میں ہیں۔",

  "readingPlans.title": "پڑھنے کے منصوبے",
  "readingPlans.description":
    "قرآن کی منظم تعلیم کے لیے ذاتی پڑھنے کے اہداف مقرر کریں۔ سورتوں یا حسب ضرورت رینجز کے ذریعے اپنی پیشرفت ٹریک کریں۔",
  "readingPlans.newPlan": "نیا پڑھنے کا منصوبہ",
  "readingPlans.createPlan": "پڑھنے کا منصوبہ بنائیں",
  "readingPlans.planLabel": "منصوبے کا لیبل",
  "readingPlans.labelPlaceholder": "مثلاً، سورت البقرہ، پارہ 1-5",
  "readingPlans.start": "شروع",
  "readingPlans.end": "اختتام",
  "readingPlans.ayahPlaceholder": "آیت",
  "readingPlans.ayatInSurah": "اس سورت میں {count} آیات",
  "readingPlans.goalPerSession": "فی سیشن مقصد",
  "readingPlans.ayatPerSession": "فی سیشن {count} آیت/آیات",
  "readingPlans.create": "منصوبہ بنائیں",
  "readingPlans.noPlans": "ابھی تک کوئی پڑھنے کا منصوبہ نہیں",
  "readingPlans.noPlansDesc":
    "مخصوص سورتوں یا حسب ضرورت رینجز کے ذریعے پیشرفت ٹریک کرنے کے لیے اپنا پہلا پڑھنے کا منصوبہ بنائیں۔",
  "readingPlans.yourPlans": "آپ کے منصوبے",
  "readingPlans.resume": "دوبارہ شروع کریں",
  "readingPlans.pause": "روکیں",
  "readingPlans.delete": "حذف کریں",
  "readingPlans.currentPosition": "موجودہ پوزیشن:",
  "readingPlans.complete": "مکمل",
  "readingPlans.read": "پڑھیں",
  "readingPlans.lastActivity": "آخری سرگرمی: {date}",

  "revision.title": "حفظ",
  "revision.subtitle": "نظرثانی",
  "revision.description":
    "آپ کی یاد کردہ آیات کے لیے ایک پرسکون شیڈول۔ آیت یا رینج شامل کریں، جب واجب النظر ہو تو یاد سے دہرائیں، اور بتائیں کہ کیسا گیا۔ فاصلہ خود ایڈجسٹ ہوتا ہے؛ یہاں کچھ بھی درجہ بند، ٹائمڈ، یا موازنہ نہیں کیا جاتا۔",
  "revision.planNote":
    "آپ کا منصوبہ صرف اس براؤزر میں رہتا ہے۔ کوئی اکاؤنٹ نہیں اور کوئی سرور کاپی نہیں، جس کا مطلب ہے کہ سائٹ ڈیٹا صاف کرنا، نجی ونڈو استعمال کرنا، یا آلہ تبدیل کرنا اسے ہٹا دے گا۔ اگر آپ اسے رکھنا چاہتے ہیں تو اپنی لائبریری سے بیک اپ ایکسپورٹ کریں۔ ایپ کبھی یاد دہانی نہیں بھیجتی — یہاں کوئی اطلاع یا پیغام رسانی کی صلاحیت نہیں ہے۔",
  "revision.loading": "اس براؤزر سے آپ کا منصوبہ لوڈ ہو رہا ہے…",
  "revision.missedIt": "یاد نہیں آیا",
  "revision.backToShortest": "سب سے چھوٹے فاصلے پر واپس",
  "revision.difficult": "مشکل",
  "revision.sameGap": "وہی فاصلہ دوبارہ",
  "revision.easy": "آسان",
  "revision.longerGap": "اگلی بار لمبا فاصلہ",
  "revision.incompleteText":
    "آیت کا متن نامکمل واپس آیا، اس لیے کچھ نہیں دکھایا گیا۔ خلا پُر کرنے کے لیے کچھ نہیں بنایا جاتا۔",
  "revision.connectionError":
    "آیت کا متن حاصل نہیں ہو سکا۔ اپنا کنکشن چیک کریں اور دوبارہ کوشش کریں۔",
  "revision.surahUnavailable": "سورت کا میٹا ڈیٹا دستیاب نہیں ہے۔",
  "revision.versesInPlan": "منصوبے میں آیات",
  "revision.dueToday": "آج واجب النظر",
  "revision.scheduledLater": "بعد کے لیے شیڈول",
  "revision.reviewsInLog": "لاگ میں نظرثانیاں",

  "library.title": "آپ کی لائبریری",
  "library.description":
    "بک مارکس، ذاتی نوٹس، اور حالیہ پڑھائیاں — صرف اسی آلے پر محفوظ۔ کچھ اپ لوڈ نہیں ہوتا؛ کوئی اکاؤنٹ نہیں اور کوئی تجزیہ نہیں۔",
  "library.loading": "آپ کی مقامی لائبریری لوڈ ہو رہی ہے…",
  "library.noItems":
    "ابھی تک کوئی محفوظ آئٹمز نہیں۔ کسی بھی آیت کو بک مارک کریں یا ذاتی نوٹ شامل کریں — یہ یہاں ظاہر ہوگا۔",
  "library.recentReading": "حالیہ پڑھائی",
  "library.bookmarks": "بک مارکس",
  "library.openAyah": "آیت کھولیں",
  "library.privateNotes": "ذاتی نوٹس",
  "library.viewAllNotes": "تمام نوٹس دیکھیں اور ٹیگ کے مطابق فلٹر کریں",
  "library.updated": "اپڈیٹ {date}",
  "library.viewAyah": "آیت دیکھیں",
  "library.manageCopy": "اس کاپی کا انتظام کریں",
  "library.exportNote":
    "ایکسپورٹ ایک JSON فائل لکھتا ہے جس میں آپ کے بک مارکس، نوٹس، پڑھنے کی تاریخ، اور ترجیحات ہوتی ہیں۔",
  "library.whereDataLives":
    "یہ ڈیٹا کہاں رہتا ہے — اور کیسے ضائع ہو سکتا ہے",
  "library.dataLivesDesc":
    "آپ کی لائبریری صرف اس براؤزر کے لوکل اسٹوریج میں محفوظ ہے۔ بحال کرنے کے لیے کوئی سرور کاپی نہیں ہے۔",
  "library.backToLibrary": "لائبریری پر واپس",
  "library.notes": "نوٹس",
  "library.notesDescription":
    "آپ کے ذاتی نوٹس، ٹیگ کے مطابق فلٹر ہونے والے — صرف اسی آلے پر محفوظ۔ کوئی اکاؤنٹ نہیں اور کوئی سرور کاپی نہیں۔",
  "library.loadingNotes": "اس براؤزر سے آپ کے نوٹس لوڈ ہو رہے ہیں…",
  "library.filterByTag": "ٹیگ کے مطابق نوٹس فلٹر کریں",
  "library.allCount": "سب ({count})",
  "library.noTagNotes": "ابھی تک کوئی نوٹس اس ٹیگ کے ساتھ نہیں ہیں۔",
  "library.noNotes": "آپ نے ابھی تک کوئی نوٹس شامل نہیں کیے۔",
  "library.openAyahNote":
    "کسی بھی آیت کو کھولیں اور شروع کرنے کے لیے \"نوٹ شامل کریں\" منتخب کریں۔",

  "backup.exported":
    "بیک اپ ایکسپورٹ ہو گیا — {bookmarks} بک مارکس، {notes} نوٹس، {verses} منصوبہ بند آیات۔",
  "backup.tooLarge":
    "یہ فائل 5 MB سے بڑی ہے، جو کسی بھی الہدیٰ بیک اپ تک نہیں پہنچتی۔ کچھ امپورٹ نہیں ہوا۔",
  "backup.notImported": "بیک اپ امپورٹ نہیں ہوا",
  "backup.confirmReplace":
    "اس آلے پر ہر چیز کو بیک اپ سے تبدیل کریں؟",
  "backup.importCancelled":
    "امپورٹ منسوخ ہو گیا۔ اس آلے پر کچھ تبدیل نہیں ہوا۔",
  "backup.imported": "بیک اپ امپورٹ ہو گیا۔",
  "backup.couldNotRead":
    "فائل پڑھی نہیں جا سکی۔ کچھ امپورٹ نہیں ہوا۔",
  "backup.confirmErase": "اس آلے پر تمام مقامی ڈیٹا مٹائیں؟",
  "backup.eraseWarning":
    "بحال کرنے کے لیے کوئی سرور کاپی نہیں ہے۔ اگر آپ کچھ رکھنا چاہتے ہیں تو پہلے بیک اپ ایکسپورٹ کریں۔ یہ واپس نہیں ہو سکتا۔",
  "backup.allDataErased":
    "اس آلے سے تمام مقامی ڈیٹا مٹا دیا گیا۔",
  "backup.exportBackup": "بیک اپ ایکسپورٹ کریں",
  "backup.reading": "پڑھ رہا ہے…",
  "backup.importBackup": "بیک اپ امپورٹ کریں",
  "backup.deleteAll": "تمام مقامی ڈیٹا حذف کریں",
  "backup.chooseFile": "الہدیٰ بیک اپ فائل منتخب کریں",

  "settings.title": "ترتیبات",
  "settings.description": "قاری کی ترجیحات صرف اسی آلے پر محفوظ۔",
  "settings.readingPrefs": "پڑھنے کی ترجیحات",
  "settings.translationNote":
    "50+ زبانوں میں 100+ تراجم میں سے منتخب کریں۔ ڈیفالٹ: اردو (جالندھری).",
  "settings.audioNote":
    "ہر آیت کے نیچے سنیں کا بٹن دکھائیں۔ آڈیو صرف آپ کے پلے دبानے پر سٹریم ہوتا ہے۔",
  "settings.reciter": "قاری",
  "settings.reciterNote":
    "آیت بہ آیت MP3s اسلامی نیٹ ورک CDN (everyayah.com ریکارڈنگز) سے، 64 kbps پر سٹریم ہوتے ہیں۔",
  "settings.parallelNote":
    "بنیادی ایڈیشن کے نیچے {count} تک اضافی تراجم دکھائیں۔",
  "settings.primary": "بنیادی:",
  "settings.addTranslation": "ترجمہ شامل کریں",
  "settings.chooseTranslation": "ترجمہ منتخب کریں…",
  "settings.maxTranslations":
    "زیادہ سے زیادہ {count} اضافی تراجم تک پہنچ گئے۔ دوسرا شامل کرنے کے لیے ایک ہٹائیں۔",
  "settings.editionNote":
    "ہر ایڈیشن ہر سیشن میں ایک بار ڈاؤن لوڈ ہوتا ہے اور میموری میں رکھا جاتا ہے — تقریباً 1.5 MB فی ترجمہ۔",
  "settings.localData": "آپ کا مقامی ڈیٹا",
  "settings.localDataDesc":
    "بک مارکس، ذاتی نوٹس، پڑھنے کی تاریخ، آپ کا نظرثانی کا منصوبہ، اور ترجیحات صرف اسی براؤزر میں محفوظ ہیں۔",
  "settings.notBackup": "لوکل اسٹوریج بیک اپ نہیں ہے۔",
  "settings.notBackupDesc":
    "چونکہ کچھ اپ لوڈ نہیں ہوتا، بحال کرنے کے لیے کوئی سرور کاپی نہیں ہے۔ سائٹ ڈیٹا یا کوکیز صاف کرنا، نجی ونڈو میں براؤز کرنا، یا آلات تبدیل کرنا اس ڈیٹا کو مستقل طور پر حذف کر سکتا ہے۔",
  "settings.exportFirst":
    "اگر آپ انہیں رکھنا چاہتے ہیں تو پہلے بیک اپ ایکسپورٹ کریں۔",
  "settings.policies": "پالیسیاں اور تعمیل",
  "settings.privacyLocal": "رازداری اور لوکل اسٹوریج",
  "settings.sourcesProvenance": "ماخذ اور ماخذ",
  "settings.privacyPolicy": "رازداری کی پالیسی",
  "settings.termsOfUse": "استعمال کی شرائط",
  "settings.accessibilityStatement": "رسائی کا بیان",
  "settings.arabicSizeAria": "عربی متن کا سائز",
  "settings.lineSpacingAria": "لائن کا فاصلہ",
  "settings.textSizeAria": "متن کا سائز: {value}",
  "settings.lineHeightAria": "لائن کا فاصلہ: {value}",
  "settings.removeTranslation": "{name} ہٹائیں",
  "settings.uiLanguage": "انٹرفیس کی زبان",
  "settings.uiLanguageNote":
    "بٹنز، نیویگیشن، اور لیبلز کی زبان تبدیل کرتا ہے۔ قرآن کا متن اور آپ کا ترجمہ ایڈیشن آزاد رہتے ہیں۔",

  "privacy.title": "رازداری کی پالیسی",
  "privacy.description":
    "یہ ایپلیکیشن آپ کا ڈیٹا کیسے سنبھالتی ہے — مقامی طور پر، بغیر اکاؤنٹس یا تجزیے کے۔",
  "privacy.policyIntro":
    "یہ ایپلیکیشن اکاؤنٹ کی ضرورت نہیں رکھتی، ذاتی معلومات جمع نہیں کرتی، تجزیہ یا ٹریکنگ استعمال نہیں کرتی، اور آپ کا پڑھنے کا ڈیٹا سرور پر نہیں بھیجتی۔ بک مارکس، نوٹس، اور پڑھنے کی ترجیحات آپ کے براؤزر کے localStorage میں محفوظ ہیں۔",
  "privacy.whatIsStored": "کیا محفوظ ہے",
  "privacy.storedDesc":
    "آپ یہاں جو کچھ بناتے ہیں وہ آپ کے براؤزر کے localStorage میں رہتا ہے:",
  "privacy.libraryLabel": "لائبریری:",
  "privacy.libraryDesc":
    "بک مارکس، ذاتی نوٹس اور ٹیگز، پڑھنے کی تاریخ",
  "privacy.revisionLabel": "نظرثانی کا منصوبہ:",
  "privacy.revisionDesc":
    "آیات، نظرثانی کا شیڈول، سیڑھیاں، اور محدود نظرثانی لاگ",
  "privacy.prefsLabel": "ترجیحات:",
  "privacy.prefsDesc":
    "عربی سائز، لائن کی اونچائی، ترجمہ/نقلِ حرفی ٹوگل، اور انٹرفیس کی زبان",
  "privacy.noAccount":
    "کوئی اکاؤنٹ نہیں، ذاتی ڈیٹا کی سرور کاپی نہیں، اور کوئی تجزیہ نہیں۔",
  "privacy.whatWeDontStore": "ہم کیا محفوظ نہیں کرتے",
  "privacy.noIds": "کوئی صارف شناخت کنندہ، ای میلز، یا پاس ورڈز نہیں",
  "privacy.noServerData":
    "کوئی سرور سائیڈ بک مارکس، نوٹس، یا پڑھنے کی تاریخ نہیں",
  "privacy.noTracking": "کوئی ٹریکنگ یا تجزیہ بیکنز نہیں",
  "privacy.noAiPrompts":
    "کوئی AI پرامپٹس یا جوابات بطور ڈیفالٹ محفوظ نہیں ہوتے",
  "privacy.exportRestoreErase": "ایکسپورٹ، بحال، یا مٹائیں",
  "privacy.exportDesc":
    "آپ کے بک مارکس، نوٹس، نظرثانی کے منصوبے، اور ترجیحات کا ورژن شدہ بیک اپ ایکسپورٹ کریں۔ تصدیق کے بعد امپورٹ اس آلے کی کاپی کو تبدیل کرتا ہے۔ حذف تعاون یافتہ مقامی ڈیٹا کو مستقل طور پر مٹاتا ہے۔",
  "privacy.lossConditions": "نقصان کی شرائط",
  "privacy.lossDesc":
    "چونکہ کچھ اپ لوڈ نہیں ہوتا، سائٹ ڈیٹا/کوکیز صاف کرنا، نجی/انکوگنیٹو ونڈو استعمال کرنا، براؤزر یا آلہ تبدیل کرنا، یا براؤزر ان انسٹال کرنا اس ڈیٹا کو مستقل طور پر حذف کر سکتا ہے۔ اگر آپ اسے رکھنا چاہتے ہیں تو JSON بیک اپ ایکسپورٹ کریں۔",
  "privacy.aiFeatures": "AI خصوصیات",
  "privacy.aiDesc":
    "AI جواب کی جنریشن غیر فعال ہے۔ فیچر فلیگ اس وقت تک بند رہتا ہے جب تک ہر حفاظتی گیٹ پورا نہ ہو جائے۔",
  "privacy.see": "دیکھیں ",
  "privacy.forDetails": "تفصیلات کے لیے۔",
  "privacy.quranText":
    "قرآن کا متن اور ترجمہ ایپلیکیشن کے ساتھ bundled ایک پن شدہ، کھلے لائسنس شدہ ڈیٹا سیٹ سے دکھایا جاتا ہے۔ بیرونی لنکس نئے ٹیبز میں کھلتے ہیں؛ ان سائٹس کی اپنی رازداری کی پالیسیاں ہیں۔",
  "privacy.noChildren":
    "چونکہ کوئی ذاتی ڈیٹا جمع نہیں کیا جاتا، ایپلیکیشن جان بوجھ کر بچوں یا کسی دوسرے صارف سے معلومات جمع نہیں کرتی۔",
  "privacy.policyChanges":
    "اگر یہ پالیسی تبدیل ہوتی ہے، اوپر کی اپڈیٹ کی تاریخ نظرثانی کی جائے گی۔ موجودہ ورژن ہمیشہ اس URL پر دستیاب ہے۔",

  "terms.title": "استعمال کی شرائط",
  "terms.intro":
    "قرآن کا متن اور ترجمہ ماخذ کے صفحے پر درج کھلے لائسنس شدہ ماخذ سے نقل کیے گئے ہیں۔ نقل کو ہر ماخذ کے لائسنس اور حوالہ کی ضروریات کا احترام کرنا ہوگا۔ عربی متن اور تراجم کو تبدیل نہیں کیا جا سکتا۔",
  "terms.editorial":
    "موضوع کے صفحات، کیوریشن، اور اس سائٹ پر کوئی بھی ایڈیٹوریل متن پڑھنے کی مدد ہیں۔ یہ تفسیر، فتویٰ، یا قانونی فیصلے نہیں ہیں۔ مذہبی رہنمائی کے لیے ہمیشہ qualified scholarship سے مشورہ کریں۔",
  "terms.disclaimer":
    "یہ ایپلیکیشن \"جیسی ہے\" فراہم کی گئی ہے بغیر کسی قسم کی وارنٹی کے، ظاہری یا مفہوم۔ ہم مکملیت، درستگی، یا دستیابی کی ضمانت نہیں دیتے۔",
  "terms.liability":
    "قانون کی طرف سے اجازت شدہ زیادہ سے زیادہ حد تک، مصنفین اور تعاون کنندگان اس ایپلیکیشن کے استعمال سے پیدا ہونے والے کسی بھی بالواسطہ، حادثاتی، یا نتیجہ خیز نقصان کے لیے ذمہ دار نہیں ہوں گے۔",
  "terms.changes":
    "یہ شرائط اپ ڈیٹ کی جا سکتی ہیں۔ تبدیلیوں کے بعد مسلسل استعمال نظرثانی شدہ شرائط کی قبولیت ہے۔ موجودہ ورژن ہمیشہ اس URL پر دستیاب ہے۔",

  "about.title": "{site} کے بارے میں",
  "about.principles": "اصول",
  "about.contentIntegrity": "مواد کی سالمیت پہلے",
  "about.provenance": "ماخذ ڈسپلے پر",
  "about.respectfulUx": "محترم UX",
  "about.pinnedDataset": "پن شدہ ڈیٹا سیٹ",
  "about.seeCatalog": "مکمل ماخذ کیٹلاگ دیکھیں →",

  "accessibility.title": "رسائی کا بیان",
  "accessibility.intro":
    "یہ ایپلیکیشن عملی طور پر WCAG 2.1 لیول AA کو پورا کرنے کی کوشش کرتی ہے۔ ہم ترقی کے دوران کی بورڈ صرف نیویگیشن، اسکرین ریڈرز، اور ہائی کنٹراسٹ ترجیحات کے ساتھ ٹیسٹ کرتے ہیں۔",
  "accessibility.keyboard":
    "کی بورڈ سے نیویگیٹ کرنے والا لے آؤٹ اور مواد پر جانے کی حمایت۔",
  "accessibility.zoom":
    "متن براؤزر زوم کے ساتھ 200% تک مواد کے نقصان کے بغیر سکیل ہوتا ہے۔",
  "accessibility.landmarks":
    "نیویگیشن لینڈ مارکس کے لیے سیمینٹک HTML لینڈ مارکس اور ARIA لیبلز۔",
  "accessibility.reducedMotion":
    "اینیمیشنز کے لیے کم حرکت کی ترجیح کا احترام کیا جاتا ہے۔",
  "accessibility.contrast":
    "ہلکے پس منظر پر باڈی متن کے لیے کافی رنگ کنٹراسٹ۔",
  "accessibility.arabicText":
    "عربی متن مخصوص قرآن فونٹ استعمال کرتا ہے؛ اسکرپٹ رینڈرنگ اسکرین ریڈرز کے درمیان مختلف ہو سکتی ہے۔ ہم فعال طور پر عربی اسکرین ریڈر کی حمایت بہتر کر رہے ہیں۔",
  "accessibility.barrier":
    "اگر آپ کو کوئی رسائی کی رکاوٹ ملتی ہے، تو ",
  "accessibility.report": "مسئلہ رپورٹ کریں",

  "sourcesPage.title": "ماخذ اور ماخذ",
  "sourcesPage.description":
    "یہاں دکھائی گئی ہر آیت حوالہ، لائسنس، اور مستحکم پیکیج ورژن کے ساتھ ریکارڈ شدہ ماخذ سے ملتی ہے۔",
  "sourcesPage.catalog": "ماخذ کیٹلاگ",
  "sourcesPage.visitSource": "ماخذ پر جائیں",
  "sourcesPage.licenseTerms": "لائسنس کی شرائط",
  "sourcesPage.methodology": "ایڈیٹوریل میتھڈالوجی",
  "sourcesPage.pinnedPackage":
    "مواد صرف پن شدہ، ورژن شدہ npm پیکیج کے طور پر آتا ہے۔",
  "sourcesPage.everySource":
    "ہر ماخذ — پیکیج شدہ ڈیٹا سیٹ، تفسیر لنک ریکارڈ، یا خارج شدہ ماخذ — اپنے حوالہ کے ساتھ درج ہے۔",
  "sourcesPage.topicPages":
    "موضوع کے صفحات مشہور آیات کے ایڈیٹوریل انتخاب ہیں — مطالعہ کے لیے داخلے کے نقاط، تفسیر نہیں۔",
  "sourcesPage.relationship":
    "ہر تعلق قسم کے تعلق کی قسم اور اس کی نظرثانی کی حیثیت رکھتا ہے۔",
  "sourcesPage.publicationState":
    "ہر موضوع کی اشاعت کی حالت اس کے موضوع کے صفحے پر دکھائی جاتی ہے۔",
  "sourcesPage.noReviewer":
    "کوئی qualified scholarly reviewer مقرر نہیں کیا گیا۔",
  "sourcesPage.pendingReview": "زیر التواء علمی نظرثانی",
  "sourcesPage.reportInaccuracy":
    "کوئی بھی غلط آیت، حوالہ، ترجمہ، یا موضوع کے انتخاب کی رپورٹ کر سکتا ہے۔",
  "sourcesPage.versionedData":
    "چونکہ تمام مواد ورژن شدہ ماخذ کی سچائی کا ڈیٹا ہے، رول بیک پیکیج کی تبدیلی ہے۔",
  "sourcesPage.aiSafety":
    "AI حفاظتی حد: AI جواب کی جنریشن غیر فعال ہے۔",
  "sourcesPage.quranTextNote":
    "AI کو قرآن کا متن، تفسیر، حدیث، فتویٰ، یا علمی اتفاق رائدہ جنریٹ نہیں کرنا چاہیے۔",
  "sourcesPage.catalogNote":
    "یہ کیٹلاگ اس ایپلیکیشن میں حوالہ کی واحد ماخذ کی سچائی ہے۔",

  "report.title": "مسئلہ رپورٹ کریں",
  "report.description":
    "آیت کے متن، موضوع کی کیوریشن، یا AI جوابات میں غلطیوں کے لیے۔ رپورٹس اسی آلے پر تیار کی جاتی ہیں — ان کے لیے کوئی سرور اینڈ پوائنٹ نہیں ہے۔",
  "report.category": "زمرہ",
  "report.location": "مقام / URL",
  "report.details": "تفصیلات",
  "report.stepsToReproduce": "دوبارہ پیدا کرنے کے مراحل",
  "report.expectedBehaviour": "متوقع رویہ",
  "report.prepareReport": "رپورٹ تیار کریں",
  "report.copyToClipboard": "کلپ بورڈ پر کاپی کریں",
  "report.downloadAsFile": "فائل کے طور پر ڈاؤن لوڈ کریں",
  "report.emailReport": "یہ رپورٹ ای میل کریں",
  "report.noAddress":
    "اس تعیناتی کے لیے کوئی ڈیلیوری ایڈریس ترتیب نہیں دیا گیا (ای میل ڈیلیوری کو فعال کرنے کے لیے NEXT_PUBLIC_REPORT_EMAIL سیٹ کریں)۔ اس کے بجائے رپورٹ کاپی یا ڈاؤن لوڈ کریں۔",
  "report.locationPlaceholder": "مثلاً /quran/al-baqarah یا https://...",
  "report.detailsPlaceholder":
    "مسئلے کو جتنا ممکن ہو درستگی سے بیان کریں۔ اگر متعلقہ ہو تو حوالے (سورت:آیت) شامل کریں۔",
  "report.stepsPlaceholder": "آپ نے کیا کیا؟",
  "report.expectedPlaceholder": "کیا ہونا چاہیے تھا؟",
  "report.copied": "رپورٹ کلپ بورڈ پر کاپی ہو گئی",
  "report.couldNotCopy": "کاپی نہیں ہو سکی",
  "report.openingEmail": "آپ کی ای میل ایپ کھل رہی ہے",
  "report.downloaded": "رپورٹ ڈاؤن لوڈ ہو گئی",

  "onboarding.title": "الہدیٰ میں خوش آمدید",
  "onboarding.description":
    "ذاتی نوعیت کے قرآنی مطالعے کے راستوں سے شروع کرنے کے لیے اپنا سیکھنے کا ہدف منتخب کریں۔",

  "errors.somethingWrong": "کچھ غلط ہو گیا",
  "errors.readingUnavailable": "پڑھنا اس وقت دستیاب نہیں",
  "errors.bodyText":
    "اس صفحے کے لیے آیت کا متن لوڈ نہیں ہو سکا۔ یہ نمائش کا مسئلہ ہے، قرآن کے متن کا مسئلہ نہیں۔",
  "errors.reference": "حوالہ:",

  "notFound.title": "نہیں ملا",
  "notFound.description": "یہ حوالہ قرآن میں نہیں ہے",
  "notFound.bodyText":
    "قرآن میں 114 سورتیں ہیں، اور ہر سورہ میں آیات کی مقررہ تعداد ہے۔ آپ نے جو پتہ کھولا وہ ان میں سے کسی سے مماثل نہیں۔",
  "notFound.browseSurahs": "تمام 114 سورتیں دیکھیں",
  "notFound.searchInstead": "اس کے بجائے تلاش کریں",

  "pagination.aria": "صفحہ بندی",
  "pagination.previous": "پچھلے صفحے پر جائیں",
  "pagination.next": "اگلے صفحے پر جائیں",

  "breadcrumb.aria": "بریڈ کرمب",
  "breadcrumb.home": "ہوم",

  "languageSelector.label": "زبان",
  "languageSelector.aria": "انٹرفیس کی زبان منتخب کریں",
  "languageSelector.title": "انٹرفیس کی زبان",
  "languageSelector.choose": "زبان منتخب کریں",

  "metadata.homeTitle": "{site} — {tagline}",
  "metadata.homeDescription":
    "قرآن کو عثمانی رسم الخط میں 100+ زبانوں کے تراجم، مستحکم آیت حوالوں، تلاش اور منتخب موضوعاتی نقطۂ آغاز کے ساتھ پڑھیں۔",
  "metadata.quranTitle": "قرآن",
  "metadata.quranDescription":
    "ہر سورہ، روایتی ترتیب میں، اس کے عربی نام اور آیات کی تعداد کے ساتھ۔",
  "metadata.discoverTitle": "دریافت کریں — آپ کا قرآنی سیکھنے کا مرکز",
  "metadata.discoverDescription":
    "سیکھنے کے راستے، وسیع موضوعات، پہلو اور تلاش: اپنا نقطۂ آغاز تلاش کریں۔",
  "metadata.exploreTitle": "جستجو — قرآن کے 10 پہلو",
  "metadata.exploreDescription":
    "زندگی کے دس پہلوؤں اور منتخب موضوعات کے ذریعے قرآن کو دریافت کریں۔",
  "metadata.topicsTitle": "موضوعات",
  "metadata.topicsDescription":
    "ایڈیٹوریل داخلے کے نقاط جو مشہور آیات کو موضوع کے مطابق گروپ کرتے ہیں۔",
  "metadata.domainsTitle": "شعبے — قرآنی جستجو کے علاقے",
  "metadata.domainsDescription":
    "ایڈیٹوریل منصوبہ بندی کے لیے وسیع موضوعاتی علاقے، پہلوؤں سے الگ۔",
  "metadata.graphTitle": "علمی گراف جستجو",
  "metadata.graphDescription":
    "دیکھیں کہ پہلو موضوعات سے کیسے جڑتے ہیں اور موضوعات آپس میں کیسے متعلق ہیں۔",
  "metadata.searchTitle": "قرآن میں تلاش کریں",
  "metadata.searchDescription":
    "حوالے، عربی متن، ترجمے یا موضوع کے ذریعے آیات تلاش کریں۔",
  "metadata.settingsTitle": "ترتیبات",
  "metadata.settingsDescription":
    "قاری کی ترجیحات اور انٹرفیس کی زبان، صرف اسی ڈیوائس پر محفوظ۔",
  "metadata.privacyTitle": "رازداری کی پالیسی",
  "metadata.privacyDescription":
    "یہ ایپلیکیشن آپ کا ڈیٹا کیسے سنبھالتی ہے — مقامی طور پر، بغیر اکاؤنٹس یا تجزیے کے۔",
  "metadata.termsTitle": "استعمال کی شرائط",
  "metadata.termsDescription":
    "اس قرآنی قرأت ایپلیکیشن کے استعمال کی شرائط۔",
  "metadata.aboutTitle": "تعارف — {site}",
  "metadata.aboutDescription":
    "پرسکون، ماخذ پر مبنی قرآنی قرأت مرکز کے بارے میں۔",
  "metadata.accessibilityTitle": "رسائی کا بیان",
  "metadata.accessibilityDescription":
    "اس ایپلیکیشن کے لیے رسائی کے عہد۔",
  "metadata.sourcesTitle": "ذرائع اور ماخذ",
  "metadata.sourcesDescription":
    "ہر دکھائی گئی آیت کے لیے درج ذرائع، لائسنس اور حوالہ۔",
  "metadata.reportTitle": "مسئلے کی اطلاع دیں",
  "metadata.reportDescription":
    "آیت کے متن، موضوع کی ادارت یا AI جوابات میں غلطیوں کی اطلاع دیں۔",
  "metadata.learnTitle": "سیکھیں",
  "metadata.learnDescription": "ذاتی نوعیت کا قرآنی سیکھنے کا ڈیش بورڈ۔",
  "metadata.notFoundTitle": "نہیں ملا",
  "metadata.errorTitle": "کچھ غلط ہو گیا",

  "counts.steps": { one: "{count} مرحلہ", other: "{count} مراحل" },
  "counts.verses": { one: "{count} آیت", other: "{count} آیات" },
  "counts.ayat": { one: "{count} آیت", other: "{count} آیات" },
  "counts.suggestions": {
    one: "{count} تجویز دستیاب",
    other: "{count} تجاویز دستیاب",
  },
  "counts.references": {
    one: "{count} حوالہ",
    other: "{count} حوالے",
  },
  "counts.topics": { one: "{count} موضوع", other: "{count} موضوعات" },
  "counts.domains": { one: "{count} ڈومین", other: "{count} ڈومینز" },
  "counts.dimensions": {
    one: "{count} بعد",
    other: "{count} ابعاد",
  },
  "counts.results": { one: "{count} نتیجہ", other: "{count} نتائج" },
  "counts.notes": { one: "{count} نوٹ", other: "{count} نوٹس" },
  "counts.bookmarks": {
    one: "{count} بک مارک",
    other: "{count} بک مارکس",
  },
  "counts.translations": {
    one: "{count} ترجمہ",
    other: "{count} تراجم",
  },
  "counts.questions": {
    one: "{count} سوال",
    other: "{count} سوالات",
  },
  "counts.paths": { one: "{count} راستہ", other: "{count} راستے" },
  "counts.reviews": { one: "{count} نظرثانی", other: "{count} نظرثانیاں" },
  "counts.days": { one: "{count} دن", other: "{count} دن" },

  "settings.subtitle": "ریڈر کی ترجیحات صرف اس ڈیوائس پر محفوظ ہوتی ہیں۔",
  "settings.arabicSize": "عربی متن کا سائز",
  "settings.arabicSizeDesc": "ریڈرز اور موضوع کے صفحات میں عثمانی عربی کو متاثر کرتا ہے۔",
  "settings.arabicSizeLabel": "متن کا سائز: {size}",
  "settings.sizeSmall": "چھوٹا",
  "settings.sizeMedium": "درمیانہ",
  "settings.sizeLarge": "بڑا",
  "settings.sizeExtraLarge": "انتہائی بڑا",
  "settings.lineSpacing": "لائن کا فاصلہ",
  "settings.lineSpacingDesc": "عربی سطروں کے درمیان عمودی فاصلہ ایڈجسٹ کریں۔",
  "settings.lineSpacingLabel": "لائن کا فاصلہ: {spacing}",
  "settings.arabicPreview": "عربی سائز کا پیش منظر",
  "settings.translationEdition": "ترجمے کا ایڈیشن",
  "settings.translationEditionDesc": "50+ زبانوں میں 100+ تراجم میں سے منتخب کریں۔ ڈیفالٹ: اردو (جالندھری)۔",
  "settings.showTranslation": "ترجمہ دکھائیں",
  "settings.showTranslationDesc": "ترجمے کی ظاہریت کو ٹوگل کریں۔ منتخب ایڈیشن اوپر دکھایا گیا ہے۔",
  "settings.showTransliteration": "نقل حرفی دکھائیں",
  "settings.showTransliterationDesc": "صرف پڑھنے میں مدد کے لیے؛ عربی متن کا متبادل کبھی نہیں۔",
  "settings.audioRecitation": "آڈیو تلاوت",
  "settings.audioRecitationDesc": "ہر آیت کے نیچے سننے کا بٹن دکھائیں۔ آڈیو صرف پلے دبانے پر سٹریم ہوتا ہے۔",
  "settings.audioSource": "اسلامی نیٹ ورک CDN (everyayah.com ریکارڈنگز) سے آیت بہ آیت MP3s، 64 kbps پر سٹریم۔",
  "settings.parallelMode": "ترجمے کا بغلی موازنہ کریں",
  "settings.parallelModeDesc": "بنیادی ایڈیشن کے نیچے {count} اضافی ترجمے تک دکھائیں۔",
  "settings.parallelMaxReached": "زیادہ سے زیادہ {count} اضافی تراجم تک پہنچ گئے۔ دوسرا شامل کرنے کے لیے ایک ہٹائیں۔",
  "settings.parallelMemory": "ہر ایڈیشن ہر سیشن میں ایک بار ڈاؤن لوڈ ہوتا ہے اور میموری میں رکھا جاتا ہے — تقریباً 1.5 MB فی ترجمہ۔",
  "settings.localDataWarning": "مقامی اسٹورج بیک اپ نہیں ہے۔",
  "settings.localDataWarningDesc": "چونکہ کچھ بھی اپ لوڈ نہیں ہوتا، اس لیے بحال کرنے کے لیے کوئی سرور کاپی نہیں ہے۔ سائٹ ڈیٹا یا کوکیز صاف کرنا، نجی یا انکوگنیٹو ونڈو میں براؤز کرنا، براؤزر یا ڈیوائس تبدیل کرنا، یا براؤزر ان انسٹال کرنا ان ترجیحات، آپ کی لائبریری، اور آپ کے نظرثانی کے منصوبے کو مٹا دے گا۔ اگر آپ انہیں رکھنا چاہتے ہیں تو پہلے ایکسپورٹ بیک اپ استعمال کریں۔",

  "home.steps": "مراحل",
  "home.ayahReference": "آیت {surah}:{ayah}",
  "home.heroTitle": "قرآن کو اس کے ماخذ کے ساتھ واضح طور پر پڑھیں",
  "home.heroDescription": "عثمانی متن، 100+ زبانوں میں تراجم (ڈیفالٹ: اردو — جالندھری)، مستحوالہ حوالہ جات جو آپ شیئر کر سکتے ہیں، اور پرسکون تلاش — کوئی بے ترتیبی نہیں، کوئی سلسلہ نہیں، کچھ بھی بغیر نسبت کے نہیں۔",
  "home.searchHint": "\"2:255\"، \"البقرہ 153\"، \"صبر\"، یا عربی متن آزمائیں۔",
  "home.discoverLink": "یا ایک رہنمائی شدہ starting point دریافت کریں",
  "home.attributedHeading": "ہر آیت نسبت شدہ ہے",
  "home.attributedDescription": "عربی متن، ترجمہ، اور نقل حرفی ہر ایک لائسنس، ناشر، اور ورژن رکھتا ہے جسے آپ ماخذ کے صفحے پر معائنہ کر سکتے ہیں۔",
  "home.reviewSources": "ماخذ کا جائزہ لیں",
  "home.startReading": "پڑھنا شروع کریں",
  "home.featuredSurahsDescription": "عام داخلے کے مقامات — یا تمام 114 سورتیں دیکھیں۔",
  "home.allSurahs": "تمام سورتیں",
  "home.ayat": "آیات",
  "home.exploreByDimension": "جہت کے مطابق دریافت کریں",
  "home.dimensionsDescription": "دس زندگی کی جہات — روحانی، ذاتی، خاندانی، اور مزید — غور و فکر کے لیے داخلے کے مقامات۔",
  "home.allDimensions": "تمام جہات",
  "home.exploreByTopic": "موضوع کے مطابق دریافت کریں",
  "home.topicsDescription": "ادارتی داخلے کے مقامات جائزے کی حیثیت کے ساتھ — تفسیر نہیں۔",
  "home.allTopics": "تمام موضوعات",
} as const;
