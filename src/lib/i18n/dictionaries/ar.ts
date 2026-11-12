/**
 * Arabic dictionary — complete translation for the Al-Huda Quran app.
 *
 * Values may be a string or a CLDR plural object. Keys are flat and
 * dot-namespaced so missing-key reporting and completeness tests are simple.
 */
import type { TranslationKey } from "./en";

export const ar: Record<
  TranslationKey,
  | string
  | { one?: string; other?: string; few?: string; many?: string }
> = {
  "common.loading": "جارٍ التحميل…",
  "common.error": "حدث خطأ ما",
  "common.notFound": "غير موجود",
  "common.tryAgain": "حاول مرة أخرى",
  "common.backToHome": "العودة إلى الرئيسية",
  "common.close": "إغلاق",
  "common.cancel": "إلغاء",
  "common.save": "حفظ",
  "common.delete": "حذف",
  "common.search": "بحث",
  "common.noResults": "لا توجد نتائج",
  "common.unavailable": "غير متاح",
  "common.previous": "السابق",
  "common.next": "التالي",
  "common.back": "رجوع",
  "common.continue": "متابعة",
  "common.skip": "تخطّي",
  "common.submit": "إرسال",
  "common.copy": "نسخ",
  "common.copied": "تم النسخ",
  "common.menu": "القائمة",
  "common.settings": "الإعدادات",
  "common.home": "الرئيسية",
  "common.language": "اللغة",
  "common.openMenu": "فتح القائمة",
  "common.closeMenu": "إغلاق القائمة",
  "common.remove": "إزالة",
  "common.viewAll": "عرض الكل",
  "common.learnMore": "اعرف المزيد",
  "common.readMore": "اقرأ المزيد",
  "common.all": "الكل",
  "common.none": "لا شيء",
  "common.optional": "اختياري",
  "common.required": "مطلوب",
  "common.yes": "نعم",
  "common.no": "لا",

  "nav.discover": "اكتشف",
  "nav.read": "اقرأ",
  "nav.explore": "استكشف",
  "nav.topics": "المواضيع",
  "nav.search": "بحث",
  "nav.learn": "تعلّم",
  "nav.plans": "الخطط",
  "nav.quiz": "اختبار",
  "nav.library": "المكتبة",
  "nav.myStudy": "دراستي",
  "nav.settings": "الإعدادات",
  "nav.primary": "الرئيسية",
  "nav.footer": "التذييل",
  "nav.skipToContent": "انتقل إلى المحتوى الرئيسي",

  "layout.siteName": "الهدى",
  "layout.siteTagline": "اقرأ وافهم واتصل بالقرآن",
  "layout.madeWithDyad": "صُنع باستخدام Dyad",

  "footer.about": "حول",
  "footer.sources": "المصادر",
  "footer.report": "الإبلاغ عن مشكلة",
  "footer.accessibility": "إمكانية الوصول",
  "footer.privacy": "الخصوصية",
  "footer.terms": "الشروط",
  "footer.tagline": "مكان هادئ لقراءة القرآن ودراسته مع التركيز على المصادر.",
  "footer.arabicCredit":
    "النص العربي (الرسم العثماني): عبر quranenc.com، موزّع عبر quran-json v3.1.2 (CC-BY-4.0).",
  "footer.translationCredit":
    "ترجمات بأكثر من 100 لغة عبر Tanzil.net. النقل الحرفي عبر Tanzil.net.",
  "footer.editorialNote":
    "اختيارات المواضيع وسائل مساعدة للقراءة — ليست تفسيرًا ولا أحكامًا. راجع حالة المراجعة في كل صفحة موضوع.",
  "footer.licenseNote": "تراخيص المحتوى محترمة؛ راجع /sources.",
  "footer.copyright":
    "© {year} {site}. تراخيص المحتوى محترمة؛ راجع /sources.",

  "home.verseOfDay": "آية اليوم",
  "home.verseOfDayUnavailable": "آية اليوم غير متاحة حاليًا.",
  "home.verseOfDayError":
    "تعذّر تحميل آية اليوم. ستظهر عند زيارتك القادمة لهذه الصفحة.",
  "home.continueReading": "متابعة القراءة",
  "home.lastVisited": "آخر زيارة {date}",
  "home.openFullPage": "فتح الصفحة كاملة",
  "home.translationCredit": "الترجمة: {edition} · ",
  "home.sourceDetails": "تفاصيل المصدر",
  "home.continueLearning": "متابعة التعلّم",
  "home.startLearning": "ابدأ التعلّم",
  "home.recommendedFor": "موصى به لـ {audience}",
  "home.allLearningPaths": "جميع مسارات التعلّم",
  "home.learningHubDescription":
    "مسارات تعلّم موجّهة لدراسة القرآن — منهج منظم بخطوات متسلسلة، ومحاور تأمّل، وتقييم ذاتي.",
  "home.takeGuidedTour": "خذ جولة موجّهة",
  "home.browsePaths": "تصفّح المسارات",

  "discover.title": "اكتشف نقطة انطلاقك",
  "discover.intro":
    "يقدّم القرآن نقاط دخول متعددة. يجمع هذا المركز مسارات التعلّم والمحاور العامة والأبعاد والبحث لتبدأ من حيث أنت.",
  "discover.startWithPath": "ابدأ بمسار",
  "discover.pathDescription":
    "مسارات تعلّم مُعدّة لمجموعات وأهداف مختلفة. كل مسار مُرتَّب ومُوسَم بحالة المراجعة.",
  "discover.forAudience": "لـ {audience}",
  "discover.allPaths": "جميع مسارات التعلّم",
  "discover.broadestThemes": "أوسع المحاور",
  "discover.themesDescription":
    "مواضيع تظهر في أكثر الأبعاد. تربط هذه المحاور بين مجالات متعددة من الحياة والدراسة.",
  "discover.inDimensions": "في {count} أبعاد",
  "discover.allTopics": "جميع المواضيع",
  "discover.exploreByDimension": "استكشف حسب البُعد",
  "discover.dimensionDescription":
    "عشرة أبعاد حياتية — روحية وشخصية وأسرية وغيرها — كوسائل تصفّح تحريرية.",
  "discover.fullDimensionExplorer": "مستكشف الأبعاد الكامل",
  "discover.goDeeper": "اذهب أعمق",
  "discover.knowledgeGraph": "خريطة المعرفة",
  "discover.graphDescription":
    "شاهد كيف ترتبط الأبعاد بالمواضيع، وكيف ترتبط المواضيع ببعضها.",
  "discover.searchQuran": "ابحث في القرآن",
  "discover.searchDescription":
    "اعثر على الآيات بالرجوع أو النص العربي أو الترجمة أو الموضوع.",
  "discover.readQuran": "اقرأ القرآن",
  "discover.readDescription":
    "تصفّح جميع السور الـ114 بالنص العثماني والترجمات.",
  "discover.learningDashboard": "لوحة التعلّم",
  "discover.dashboardDescription":
    "تتبع تقدمك، وأدِّ الاختبارات، وأدِر خطط دراستك.",
  "discover.editorialNote":
    "جميع المواضيع والأبعاد ومسارات التعلّم في هذه الصفحة تحمل حالة المراجعة. الاختيارات التحريرية وسائل قراءة وليست تفسيرًا أو أحكامًا.",

  "explore.title": "استكشف القرآن",
  "explore.intro":
    "اكتشف القرآن عبر 10 أبعاد حياتية. كل بُعد يرتبط بمواضيع مُعدّة ويقدم مصطلحات بحث لمزيد من الدراسة.",
  "explore.dimensionNote":
    "الأبعاد أدناه وسائل تصفّح على مستوى المواضيع. الآيات الفردية غير مصنّفة حسب البُعد.",
  "explore.covers": "يغطي",
  "explore.exploreArrow": "استكشف ←",
  "explore.startWithTopics": "ابدأ بالمواضيع المُعدّة",
  "explore.topicsDescription":
    "هذه المواضيع مرتبطة بالأبعاد كوسائل تصفّح. كل صفحة موضوع تُظهر حالة المراجعة.",
  "explore.domainExplorer": "مستكشف المجالات",
  "explore.domainDescription":
    "المجالات تختلف عن الأبعاد: المجالات تنظّم مجالات موضوعية واسعة للتخطيط التحريري.",
  "explore.browseDomains": "تصفّح فهرس المجالات",
  "explore.graphExplorer": "مستكشف خريطة المعرفة",
  "explore.graphDescription":
    "شاهد كيف ترتبط الأبعاد العشرة بالمواضيع المُعدّة، وكيف ترتبط المواضيع ببعضها.",
  "explore.openGraph": "فتح مستكشف الخريطة",
  "explore.searchTitle": "ابحث في القرآن",
  "explore.searchDescription":
    "تبحث عن شيء محدد؟ ابحث بالرجوع أو النص العربي أو الترجمة أو الموضوع.",
  "explore.openSearch": "فتح البحث",

  "quran.title": "القرآن",
  "quran.intro":
    "كل سورة بالترتيب المعتمد، مع اسمها العربي وعدد آياتها.",
  "quran.surah": "سورة",
  "quran.ayah": "آية",
  "quran.juz": "الجزء {number}",
  "quran.page": "الصفحة {number}",
  "quran.hizb": "الحزب {number}",
  "quran.ruku": "الركوع {number}",
  "quran.manzil": "المنزل {number}",
  "quran.sajdah": "آية سجدة",
  "quran.readFullSurah": "اقرأ السورة كاملة",
  "quran.appearsInTopics": "تظهر في المواضيع",
  "quran.topicsNote":
    "صفحات المواضيع تُظهر حالة المراجعة وليست تفسيرًا.",
  "quran.appearsInPaths": "تظهر في مسارات التعلّم",
  "quran.pathsNote":
    "مسارات التعلّم مسارات دراسة مُعدّة. كل مسار يُوسَم بحالة المراجعة وليس تفسيرًا.",
  "quran.previousAyah": "السابقة · {surah}:{ayah}",
  "quran.nextAyah": "التالية · {surah}:{ayah}",
  "quran.breadcrumb": "القرآن",
  "quran.surahVerses": "آيات السورة",
  "quran.readContinuously":
    "اقرأ باستمرار أدناه. استخدم أدوات التحكم لضبط حجم الخط العربي وتبديل الترجمة والنقل الحرفي.",
  "quran.navigateInstruction":
    "تنقّل برقم الآية أو استخدم جدول المحتويات في الفهرس.",
  "quran.previousSurah": "السابقة: {surah}",
  "quran.nextSurah": "التالية: {surah}",
  "quran.ayahReference": "رجوع الآية",
  "quran.surahOf":
    "سورة {surah} من 114 · {translation} · {revelation}",

  "reader.translation": "الترجمة",
  "reader.arabicSize": "حجم النص العربي",
  "reader.textSize": "حجم الخط",
  "reader.lineSpacing": "تباعد الأسطر",
  "reader.spacing": "التباعد",
  "reader.transliteration": "النقل الحرفي",
  "reader.small": "صغير",
  "reader.medium": "متوسط",
  "reader.large": "كبير",
  "reader.extraLarge": "كبير جدًا",
  "reader.compact": "مضغوط",
  "reader.normal": "عادي",
  "reader.loose": "واسع",
  "reader.translationsShown": "الترجمات معروضة",
  "reader.translationsHidden": "الترجمات مخفية",
  "reader.transliterationShown": "النقل الحرفي معروض",
  "reader.transliterationHidden": "النقل الحرفي مخفي",
  "reader.translationEdition": "نسخة الترجمة",
  "reader.smallAria": "حجم خط صغير",
  "reader.mediumAria": "حجم خط متوسط",
  "reader.largeAria": "حجم خط كبير",
  "reader.extraLargeAria": "حجم خط كبير جدًا",
  "reader.lineHeightAria": "تباعد الأسطر: {value}",

  "translationSelector.select": "اختر ترجمة",
  "translationSelector.aria": "مُحدد الترجمة",
  "translationSelector.searchPlaceholder": "ابحث في الترجمات…",
  "translationSelector.searchAria": "البحث في الترجمات",
  "translationSelector.available": "الترجمات المتاحة",
  "translationSelector.rtl": "(من اليمين لليسار)",
  "translationSelector.noMatches": "لا توجد ترجمات تطابق \"{search}\"",
  "translationSelector.viaTanzil": "الترجمات عبر Tanzil.net",
  "translationSelector.loading": "جارٍ التحميل…",

  "searchPage.title": "ابحث في القرآن",
  "searchPage.placeholder":
    "اعثر على الآيات بالرجوع (مثل \"2:255\" أو \"البقرة 153\") أو اسم السورة أو النص العربي أو الترجمة أو الموضوع.",
  "searchPage.loadingFilters": "جارٍ تحميل الفلاتر…",
  "searchPage.invalidFilters":
    "قيمة فلتر واحد أو أكثر غير صالحة وتم تجاهلها.",
  "searchPage.filterNote":
    "الفلاتر تُضيّق البحث ولا تتصفح النص بمفردها. اكتب كلمة أو رجوعًا أعلاه لترى الآيات المطابقة.",
  "searchPage.matchingNote":
    "المطابقة قائمة على قواعد وشفافة. مطابقات الرجوع أولًا، ثم المطابقات المعجمية.",
  "searchPage.editionSearch":
    "ابحث داخل ترجمة محددة أو نسخة تفسير كلاسيكية. يُجلب النص من Tanzil.net عند أول استخدام ويُخزّن مؤقتًا.",
  "searchPage.chooseEdition": "اختر نسخة…",
  "searchPage.searchEdition": "ابحث في النسخة",
  "searchPage.editionNote":
    "البحث في النسخة ينظر فقط داخل تلك النسخة، فالمصطلح الذي يظهر في مكان آخر قد لا يُعثر عليه.",
  "searchPage.typeMore": "اكتب حرفين على الأقل للبحث.",
  "searchPage.unknownEdition":
    "نسخة غير معروفة: {edition}. اختر نسخة من أدوات البحث.",
  "searchPage.backToDefault": "العودة إلى البحث الافتراضي",
  "searchPage.tryAgainLater": "يرجى المحاولة لاحقًا.",
  "searchPage.parsedAsRef": "حُلّ كرجوع: {results}",
  "searchPage.refOutOfRange": "الرجوع خارج نطاق تلك السورة.",
  "searchPage.noMatches":
    "لم يُعثر على مطابقات. جرّب استعلامًا مختلفًا أو عدّل الفلاتر.",
  "searchPage.activeFilters":
    "الفلاتر النشطة تُضيّق مجموعة النتائج. مسحها يوسّع البحث.",
  "searchPage.inPath": "في المسار: {path}",
  "searchPage.noMatchesEdition":
    "لم يُعثر على مطابقات في {edition} لـ \"{query}\".",
  "searchPage.editionScoped":
    "البحث المحدد بالنسخة يطابق السلاسل الحرفية في نص الترجمة.",
  "searchPage.tafsirLoadError":
    "تعذّر تحميل نسخة تفسير واحدة أو أكثر. النتائج أدناه غير مكتملة.",
  "searchPage.tafsirScoped":
    "البحث في التفسير يطابق السلاسل الحرفية في النص العربي الكلاسيكي.",
  "searchPage.wordsToSearch": "كلمات للبحث عنها في النسخة المختارة",
  "searchPage.searchModes": "أوضاع البحث",
  "searchPage.wordsPlaceholder": "كلمات للبحث في النسخة…",
  "searchPage.tafsirJalalayn": "تفسير الجلالين",
  "searchPage.alMuyassar": "المُيَسَّر",
  "searchPage.pickthall": "بِكْثَال",
  "searchPage.jalandhry": "جالاندهري (أردية)",

  "searchBox.placeholder": "ابحث عن رجوع أو ترجمة أو نص عربي…",
  "searchBox.aria": "ابحث في القرآن",
  "searchBox.button": "بحث",
  "searchBox.shortcut": "اضغط الشرطة المائلة للتركيز على البحث",
  "searchBox.suggestions": "اقتراحات البحث",
  "searchBox.suggestionCount": "{count} اقتراح متاح",
  "searchBox.verse": "آية",
  "searchBox.surah": "سورة",
  "searchBox.topic": "موضوع",

  "searchFilters.defaultMode": "افتراضي (العربية + الإنجليزية المدمجة)",
  "searchFilters.tafsirMode": "كلا التفسيرين الكلاسيكيين",
  "searchFilters.any": "أي",
  "searchFilters.arabicOnly": "النص العربي فقط",
  "searchFilters.englishOnly": "النص الإنجليزي فقط",
  "searchFilters.allSurahs": "جميع السور",
  "searchFilters.allTypes": "جميع الأنواع",
  "searchFilters.meccan": "مكية",
  "searchFilters.medinan": "مدنية",
  "searchFilters.allJuz": "جميع الأجزاء",
  "searchFilters.allTopics": "جميع المواضيع",
  "searchFilters.classicalTafsirs": "التفاسير الكلاسيكية",
  "searchFilters.arabic": "العربية فقط",
  "searchFilters.english": "الإنجليزية فقط",
  "searchFilters.removeFilter": "إزالة {label}",

  "topics.title": "استكشف حسب الموضوع",
  "topics.intro":
    "نقاط دخول تحريرية تجمع الآيات المشهورة حسب الموضوع. كل صفحة موضوع تُظهر حالة المراجعة.",
  "topics.allTopics": "جميع المواضيع",
  "topics.relationsNote":
    "جميع علاقات المواضيع مُصنّفة (موضوعية، معجمية، مرجعية، أو تحريرية) ومُوسَمة بحالة المراجعة.",
  "topics.reviewStatus":
    "حالة المراجعة: {status} — أعدها {curator} عبر {method} (آخر مراجعة {date}).",
  "topics.editorialNote":
    "الاختيارات التحريرية ليست تفسيرًا ولا تُقدَّم كأحكام.",
  "topics.versesOnTopic": "آيات في هذا الموضوع",
  "topics.curatedCount": "{shown} من {total} آية مُعدّة معروضة",
  "topics.unresolvedCount":
    "{count} مراجع مُعدّة تعذّر حلّها مقابل مجموعة بيانات القرآن المثبّتة لذلك لم تُعرض.",
  "topics.unresolvedNote":
    "هذه مشكلة تكامل بيانات في الاختيار التحريري، وليست آية مفقودة. تُعرض بدلًا من إسقاطها صامتًا حتى لا يُبالَغ في العدد أعلاه.",
  "topics.relatedTopics": "مواضيع ذات صلة",
  "topics.exploreByDimension": "استكشف هذا المحور حسب البُعد",
  "topics.dimensionMapping":
    "يظهر هذا الموضوع في خريطة التصفح التحريرية لـ {count} أبعاد. كل صفحة بُعد تُظهر كيف يرتبط هذا المحور بمواضيع أخرى.",
  "topics.openDimension": "فتح بُعد {dimension} ←",
  "topics.dimensionNote":
    "خرائط الأبعاد إلى المواضيع وسائل تصفّح تحريرية وليست تصنيفات على مستوى الآيات.",
  "topics.proposedDomains": "مجالات استكشاف مقترحة",
  "topics.domainMapping":
    "هذا الموضوع مقترح تحريريًا لينتمي إلى {count} مجالات. هذه اقتراحات تنظيمية قيد المراجعة — ليست تصنيفات علمية لمقاطع القرآن.",
  "topics.navigationAid": "وسيلة تصفّح",
  "topics.organizationalProposal": "اقتراح تنظيمي",
  "topics.openDomain": "فتح مجال {domain} ←",
  "topics.domainNote":
    "علاقات المجال بالموضوع اقتراحات تنظيمية وليست استنتاجات علمية.",
  "topics.learningPaths": "مسارات تعلّم حول هذا المحور",
  "topics.pathsDescription":
    "تتضمن هذه المسارات خطوات تشير إلى هذا الموضوع. كل مسار يُوسَم بحالة المراجعة وليس تفسيرًا.",
  "topics.provenance":
    "المصدر: كل آية أعلاه تُظهر سجل المراجعة الفعلي. العلاقة بلا مراجعة فردية ترث سجل مستوى الموضوع. لا يُقدَّم أي تفسير مُولَّد بالذكاء الاصطناعي ككتاب.",

  "graph.title": "مستكشف خريطة المعرفة",
  "graph.filterByDimension": "فلترة حسب البُعد",
  "graph.all": "الكل",
  "graph.scopeNote":
    "تُظهر هذه الخريطة خرائط التصفح التحريرية بين الأبعاد والمواضيع المُعدّة، بالإضافة إلى العلاقات الجانبية بين المواضيع المُعدّة. لا تُصنّف الآيات الفردية حسب البُعد. كل عقدة وحافة تحمل حالة المراجعة.",
  "graph.nodeCount":
    "{nodes} عقدة ({dimensions} أبعاد، {topics} مواضيع)، {edges} حواف. انقر أو انتقل بـ Tab إلى عقدة للتفاصيل.",
  "graph.dimensionNode": "عقدة بُعد",
  "graph.topicNode": "عقدة موضوع",
  "graph.dimensionTopicMapping": "خريطة البُعد ← الموضوع",
  "graph.topicRelationship": "علاقة الموضوع ↔ الموضوع",
  "graph.aria":
    "خريطة معرفة تُظهر الأبعاد والمواضيع مع علاقاتها التحريرية",
  "graph.svgTitle": "مستكشف خريطة المعرفة",
  "graph.svgDesc":
    "تخطيط دائري متراكز: الأبعاد على الحلقة الخارجية، المواضيع على الحلقة الداخلية، مع العلاقات التحريرية كحواف.",
  "graph.keyboardHelp":
    "متاح بلوحة المفاتيح: Tab بين العقد، السهم الأيسر/الأيمن للتبديل داخل الحلقة، السهم الأعلى/الأسفل لتبديل الحلقات، Enter أو مسافة للاختيار.",
  "graph.listView": "عرض قائمة لجميع العقد ({count})",
  "graph.dimension": "بُعد",
  "graph.topic": "موضوع",
  "graph.details": "تفاصيل {label}",
  "graph.closeDetails": "إغلاق التفاصيل",
  "graph.reviewStatus": "حالة المراجعة:",
  "graph.curator": "المُعدّ:",
  "graph.method": "الطريقة:",
  "graph.lastPass": "آخر مراجعة تحريرية:",
  "graph.connections": "الاتصالات ({count})",
  "graph.openPage": "فتح صفحة {type} ←",
  "graph.unresolvedCount":
    "{count} مراجع غير محلولة في بيانات الخريطة.",
  "graph.topicGraph":
    "خريطة تُظهر العلاقات بين مواضيع القرآن المُعدّة",
  "graph.topicGraphTitle": "خريطة علاقات المواضيع",

  "learn.paths": "المسارات",
  "learn.plans": "الخطط",
  "learn.revise": "مراجعة",
  "learn.quiz": "اختبار",
  "learn.sections": "أقسام التعلّم",
  "learn.dashboard": "مركز التعلّم",
  "learn.dashboardDescription":
    "نقطة دخولك الشخصية لدراسة القرآن الموجّهة. تابع من حيث توقفت، أو راجع ما تعلّمته، أو استكشف مواضيع جديدة.",
  "learn.reviseDue": "مراجعة الآيات المستحقة",
  "learn.versesDue": "{count} آية مستحقة للمراجعة اليوم.",
  "learn.continueQuiz": "متابعة الاختبار",
  "learn.quizInProgress": "لديك جلسة اختبار قيد التنفيذ.",
  "learn.continuePath": "متابعة {path}",
  "learn.continueLearning": "متابعة مسار التعلّم",
  "learn.stepsComplete": "{done} من {total} خطوات مكتملة.",
  "learn.pickUpWhereLeft": "تابع من حيث توقفت.",
  "learn.continueReading": "متابعة القراءة: {plan}",
  "learn.resumePlan": "تابع خطة القراءة.",
  "learn.startWithPath": "ابدأ بمسار تعلّم",
  "learn.pathDescription":
    "منهج موجّه لدراسة القرآن بشكل منظم.",
  "learn.takeQuiz": "خذ اختبار تقييم ذاتي",
  "learn.quizDescription":
    "تحقق مما تعرفه وما يستحق إعادة النظر.",
  "learn.learningHub": "مركز التعلّم",
  "learn.hubDescription":
    "نقطة دخولك الشخصية لدراسة القرآن الموجّهة.",
  "learn.startJourney": "ابدأ رحلة التعلّم",
  "learn.journeyDescription":
    "لم تبدأ أي مسارات أو اختبارات أو خطط مراجعة بعد. ابدأ بمسار تعلّم موجّه لبناء أساس.",
  "learn.browsePaths": "تصفّح مسارات التعلّم",
  "learn.continue": "متابعة",
  "learn.dueForReview": "مستحقة للمراجعة",
  "learn.pathsInProgress": "مسارات قيد التنفيذ",
  "learn.quizAttempts": "محاولات الاختبار",
  "learn.revisionPlan": "خطة المراجعة",
  "learn.lastRead": "آخر قراءة: سورة {surah}:{ayah}",
  "learn.readOn": "قراءة في {date}",
  "learn.inProgressQuiz": "اختبار قيد التنفيذ",
  "learn.questionsAnswered":
    "{answered} من {total} أسئلة تمت الإجابة عليها",
  "learn.readingPlan": "خطة القراءة: {label}",
  "learn.goalPerSession": "الهدف: {count} آيات لكل جلسة",
  "learn.explore": "استكشف",

  "paths.title": "مسارات التعلّم",
  "paths.description":
    "منهج منظم لدراسة القرآن الموجّه. كل مسار مصمم لمجموعة وهدف تعلّم محدد، بخطوات متسلسلة تبني الفهم تدريجيًا.",
  "paths.backToPaths": "العودة إلى المسارات",
  "paths.stepsCompleted": "{done} من {total} خطوات مكتملة",
  "paths.stepNavigation": "التنقل بين الخطوات",
  "paths.step": "الخطوة {number}",
  "paths.objective": "الهدف",
  "paths.reflection": "محور تأمّل",
  "paths.verse": "آية {surah}:{ayah}",
  "paths.markComplete": "وضع علامة مكتمل",
  "paths.completed": "مكتمل",
  "paths.testRecall": "اختبر تذكّرك باختبار",
  "paths.editorialStatus": "الحالة التحريرية:",
  "paths.statusNote":
    "هذا المسار {status}. المحتوى أُعدّ بواسطة فريق التحرير في الهدى لكنه لم يُراجَع بعد من قِبل عالم مؤهل. لا يُقدَّم هنا أي شيء كتفسير ديني ملزم.",
  "paths.loading": "جارٍ التحميل…",
  "paths.welcome": "مرحبًا بك في الهدى",
  "paths.chooseGoal":
    "اختر هدفك من التعلّم للحصول على توصيات مخصصة.",
  "paths.skipForNow": "تخطّى الآن",
  "paths.recommended": "موصى به لك",
  "paths.recommendedDesc":
    "بناءً على هدفك، نوصي بالبدء بهذه المسارات.",
  "paths.steps": "{count} خطوات",
  "paths.startLearning": "ابدأ التعلّم",

  "quiz.surahId": "تحديد السورة",
  "quiz.translationMatch": "مطابقة الترجمة",
  "quiz.ayahOrdering": "ترتيب الآيات",
  "quiz.topicMatch": "مطابقة الموضوع",
  "quiz.ayahRecall": "تذكّر الآية",
  "quiz.missingWord": "الكلمة المفقودة",
  "quiz.refRecognition": "التعرف على المرجع",
  "quiz.emptyPlan":
    "خطة المراجعة فارغة. أضف آيات للمراجعة أولًا.",
  "quiz.generationFailed": "فشل التوليد",
  "quiz.couldNotGenerate":
    "تعذّر توليد أسئلة من المصدر المحدد",
  "quiz.failedToGenerate": "فشل توليد الاختبار",
  "quiz.defaultMix": "المزيج الافتراضي",
  "quiz.specificSurah": "سورة محددة",
  "quiz.learningPath": "مسار تعلّم",
  "quiz.topic": "موضوع",
  "quiz.myRevision": "خطة المراجعة الخاصة بي",
  "quiz.selectSurah": "اختر سورة",
  "quiz.selectPath": "اختر مسارًا",
  "quiz.selectTopic": "اختر موضوعًا",
  "quiz.generating": "جارٍ التوليد…",
  "quiz.generate": "توليد الاختبار",
  "quiz.answerRecorded": "تم تسجيل الإجابة.",
  "quiz.selectAnswer": "اختر إجابة للمتابعة.",
  "quiz.seeResults": "شاهد النتائج",
  "quiz.nextQuestion": "السؤال التالي",
  "quiz.correct": "صحيح",
  "quiz.incorrect": "خطأ",
  "quiz.unanswered": "لم تُجب",
  "quiz.selfAssessed": "تقييم ذاتي",
  "quiz.allInPlan":
    "جميع هذه الآيات موجودة بالفعل في خطة المراجعة.",

  "readingPlans.title": "خطط القراءة",
  "readingPlans.description":
    "حدد أهداف قراءة شخصية لدراسة منهجية للقرآن. تتبع تقدمك عبر السور أو نطاقات مخصصة.",
  "readingPlans.newPlan": "خطة قراءة جديدة",
  "readingPlans.createPlan": "إنشاء خطة قراءة",
  "readingPlans.planLabel": "اسم الخطة",
  "readingPlans.labelPlaceholder": "مثلًا: سورة البقرة، الأجزاء 1-5",
  "readingPlans.start": "البداية",
  "readingPlans.end": "النهاية",
  "readingPlans.ayahPlaceholder": "الآية",
  "readingPlans.ayatInSurah": "{count} آية في هذه السورة",
  "readingPlans.goalPerSession": "الهدف لكل جلسة",
  "readingPlans.ayatPerSession": "{count} آية/آيات لكل جلسة",
  "readingPlans.create": "إنشاء الخطة",
  "readingPlans.noPlans": "لا توجد خطط قراءة بعد",
  "readingPlans.noPlansDesc":
    "أنشئ أول خطة قراءة لتتبع التقدم في سور محددة أو نطاقات مخصصة.",
  "readingPlans.yourPlans": "خططك",
  "readingPlans.resume": "استئناف",
  "readingPlans.pause": "إيقاف مؤقت",
  "readingPlans.delete": "حذف",
  "readingPlans.currentPosition": "الموضع الحالي:",
  "readingPlans.complete": "مكتمل",
  "readingPlans.read": "اقرأ",
  "readingPlans.lastActivity": "آخر نشاط: {date}",

  "revision.title": "الحفظ",
  "revision.subtitle": "المراجعة",
  "revision.description":
    "جدول هادئ للآيات التي تحتفظ بها. أضف آية أو نطاقًا، واستحضرها من ذاكرتك عند استحقاقها، وقيّم كيف كان أداؤك. التباعد يعدّل نفسه؛ لا يوجد هنا تقييم أو توقيت أو مقارنة.",
  "revision.planNote":
    "خطتك موجودة فقط في هذا المتصفح. لا يوجد حساب ولا نسخة على الخادم، مما يعني أن مسح بيانات الموقع أو استخدام نافذة خاصة أو تبديل الجهاز سيُزيلها. صدّر نسخة احتياطية من مكتبتك إذا كنت تنوي الاحتفاظ بها. التطبيق لا يرسل تذكيرات أبدًا — لا توجد إمكانية للإشعارات أو الرسائل هنا.",
  "revision.loading": "جارٍ تحميل خطتك من هذا المتصفح…",
  "revision.missedIt": "فاتتها",
  "revision.backToShortest": "العودة إلى أقصر فجوة",
  "revision.difficult": "صعب",
  "revision.sameGap": "نفس الفجوة مرة أخرى",
  "revision.easy": "سهل",
  "revision.longerGap": "فجوة أطول المرة القادمة",
  "revision.incompleteText":
    "نص الآية جاء غير مكتمل، لذلك لم يُعرض شيء. لم يُختَرَع شيء لملء الفجوة.",
  "revision.connectionError":
    "تعذّر الوصول لنص الآية. تحقق من اتصالك وحاول مرة أخرى.",
  "revision.surahUnavailable": "بيانات السورة غير متاحة.",
  "revision.versesInPlan": "آيات في الخطة",
  "revision.dueToday": "مستحقة اليوم",
  "revision.scheduledLater": "مجدولة لاحقًا",
  "revision.reviewsInLog": "مراجعات في السجل",

  "library.title": "مكتبتك",
  "library.description":
    "إشارات مرجعية وملاحظات خاصة وقراءات حديثة — مخزنة فقط على هذا الجهاز. لا يُرفَع شيء؛ لا يوجد حساب ولا تحليلات.",
  "library.loading": "جارٍ تحميل مكتبتك المحلية…",
  "library.noItems":
    "لا توجد عناصر محفوظة بعد. افتح أي آية لوضع إشارة مرجعية أو إضافة ملاحظة خاصة — ستظهر هنا.",
  "library.recentReading": "القراءة الأخيرة",
  "library.bookmarks": "الإشارات المرجعية",
  "library.openAyah": "فتح الآية",
  "library.privateNotes": "ملاحظات خاصة",
  "library.viewAllNotes": "عرض جميع الملاحظات وتصفية حسب الوسم",
  "library.updated": "تم التحديث {date}",
  "library.viewAyah": "عرض الآية",
  "library.manageCopy": "إدارة هذه النسخة",
  "library.exportNote":
    "التصدير يكتب ملف JSON واحد يحتوي إشاراتك المرجعية وملاحظاتك وسجل قراءاتك وتفضيلاتك.",
  "library.whereDataLives":
    "أين تعيش هذه البيانات — وكيف يمكن فقدانها",
  "library.dataLivesDesc":
    "مكتبتك مخزنة فقط في التخزين المحلي لهذا المتصفح. لا توجد نسخة على الخادم للاستعادة منها.",
  "library.backToLibrary": "العودة إلى المكتبة",
  "library.notes": "الملاحظات",
  "library.notesDescription":
    "ملاحظاتك الخاصة، قابلة للتصفية حسب الوسم — مخزنة فقط على هذا الجهاز. لا يوجد حساب ولا نسخة على الخادم.",
  "library.loadingNotes": "جارٍ تحميل ملاحظاتك من هذا المتصفح…",
  "library.filterByTag": "تصفية الملاحظات حسب الوسم",
  "library.allCount": "الكل ({count})",
  "library.noTagNotes": "لا توجد ملاحظات تحمل هذا الوسم بعد.",
  "library.noNotes": "لم تضف أي ملاحظات بعد.",
  "library.openAyahNote":
    "افتح أي آية واختر \"إضافة ملاحظة\" للبدء.",

  "backup.exported":
    "تم تصدير النسخة الاحتياطية — {bookmarks} إشارات مرجعية، {notes} ملاحظات، {verses} آيات مخططة.",
  "backup.tooLarge":
    "هذا الملف أكبر من 5 ميجابايت، وهو حجم لا تصل إليه أي نسخة احتياطية للهدى. لم يُستورد شيء.",
  "backup.notImported": "لم تُستورد النسخة الاحتياطية",
  "backup.confirmReplace":
    "استبدال كل شيء على هذا الجهاز بالنسخة الاحتياطية؟",
  "backup.importCancelled":
    "أُلغي الاستيراد. لم يُغيَّر شيء على هذا الجهاز.",
  "backup.imported": "تم استيراد النسخة الاحتياطية.",
  "backup.couldNotRead":
    "تعذّرت قراءة الملف. لم يُستورد شيء.",
  "backup.confirmErase": "مسح جميع البيانات المحلية على هذا الجهاز؟",
  "backup.eraseWarning":
    "لا توجد نسخة على الخادم للاستعادة منها. صدّر نسخة احتياطية أولًا إذا كنت تريد الاحتفاظ بأي شيء. لا يمكن التراجع عن هذا.",
  "backup.allDataErased":
    "تم مسح جميع البيانات المحلية من هذا الجهاز.",
  "backup.exportBackup": "تصدير نسخة احتياطية",
  "backup.reading": "جارٍ القراءة…",
  "backup.importBackup": "استيراد نسخة احتياطية",
  "backup.deleteAll": "حذف جميع البيانات المحلية",
  "backup.chooseFile": "اختر ملف نسخة احتياطية للهدى",

  "settings.title": "الإعدادات",
  "settings.description": "تفضيلات القراءة مخزنة فقط على هذا الجهاز.",
  "settings.readingPrefs": "تفضيلات القراءة",
  "settings.translationNote":
    "اختر من أكثر من 100 ترجمة بأكثر من 50 لغة. الافتراضي: الأردية (جالاندهري).",
  "settings.audioNote":
    "عرض زر استماع تحت كل آية. الصوت يُبث فقط عند الضغط على التشغيل.",
  "settings.reciter": "القارئ",
  "settings.reciterNote":
    "ملفات MP3 آية بآية من شبكة CDN الإسلامية (تسجيلات everyayah.com)، تُبث بمعدل 64 كيلوبت في الثانية.",
  "settings.parallelNote":
    "عرض حتى {count} ترجمات إضافية أسفل النسخة الأساسية.",
  "settings.primary": "الأساسية:",
  "settings.addTranslation": "إضافة ترجمة",
  "settings.chooseTranslation": "اختر ترجمة…",
  "settings.maxTranslations":
    "تم الوصول للحد الأقصى {count} ترجمات إضافية. أزل واحدة لإضافة أخرى.",
  "settings.editionNote":
    "كل نسخة تُحمَّل مرة واحدة لكل جلسة وتُحتفظ في الذاكرة — حوالي 1.5 ميجابايت لكل ترجمة.",
  "settings.localData": "بياناتك المحلية",
  "settings.localDataDesc":
    "الإشارات المرجعية والملاحظات الخاصة وسجل القراءة وخطة المراجعة والتفضيلات مخزنة فقط في هذا المتصفح.",
  "settings.notBackup": "التخزين المحلي ليس نسخة احتياطية.",
  "settings.notBackupDesc":
    "لأنه لا يُرفَع شيء، لا توجد نسخة على الخادم للاستعادة منها. مسح بيانات الموقع أو ملفات تعريف الارتباط، أو التصفح في نافذة خاصة، أو تبديل الأجهزة يمكن أن يحذف هذه البيانات نهائيًا.",
  "settings.exportFirst":
    "صدّر نسخة احتياطية أولًا إذا كنت تريد الاحتفاظ بها.",
  "settings.policies": "السياسات والامتثال",
  "settings.privacyLocal": "الخصوصية والتخزين المحلي",
  "settings.sourcesProvenance": "المصادر والأصل",
  "settings.privacyPolicy": "سياسة الخصوصية",
  "settings.termsOfUse": "شروط الاستخدام",
  "settings.accessibilityStatement": "بيان إمكانية الوصول",
  "settings.arabicSizeAria": "حجم النص العربي",
  "settings.lineSpacingAria": "تباعد الأسطر",
  "settings.textSizeAria": "حجم الخط: {value}",
  "settings.lineHeightAria": "تباعد الأسطر: {value}",
  "settings.removeTranslation": "إزالة {name}",
  "settings.uiLanguage": "لغة الواجهة",
  "settings.uiLanguageNote":
    "تُغيّر لغة الأزرار والتنقل والتسميات. نص القرآن ونسخة الترجمة يبقى كلٌّ مستقلًا.",

  "privacy.title": "سياسة الخصوصية",
  "privacy.description":
    "كيف يتعامل هذا التطبيق مع بياناتك — محليًا، بدون حسابات أو تحليلات.",
  "privacy.policyIntro":
    "هذا التطبيق لا يتطلب حسابًا، ولا يجمع معلومات شخصية، ولا يستخدم تحليلات أو تتبعًا، ولا يرسل بيانات قراءتك إلى خادم. الإشارات المرجعية والملاحظات وتفضيلات القراءة مخزنة في التخزين المحلي لمتصفحك.",
  "privacy.whatIsStored": "ما يُخزَّن",
  "privacy.storedDesc":
    "كل ما تنشئه هنا يبقى في التخزين المحلي لمتصفحك:",
  "privacy.libraryLabel": "المكتبة:",
  "privacy.libraryDesc":
    "الإشارات المرجعية والملاحظات الخاصة والأوسمة وسجل القراءة",
  "privacy.revisionLabel": "خطة المراجعة:",
  "privacy.revisionDesc":
    "الآيات وجدول المراجعة والسلالم وسجل مراجعة محدود",
  "privacy.prefsLabel": "التفضيلات:",
  "privacy.prefsDesc":
    "حجم العربية وارتفاع السطر ومفاتيح الترجمة والنقل الحرفي ولغة الواجهة",
  "privacy.noAccount":
    "لا يوجد حساب ولا نسخة خادم للبيانات الشخصية ولا تحليلات.",
  "privacy.whatWeDontStore": "ما لا نُخزّنه",
  "privacy.noIds": "لا معرّفات مستخدم ولا بريد إلكتروني ولا كلمات مرور",
  "privacy.noServerData":
    "لا إشارات مرجعية ولا ملاحظات ولا سجل قراءة على الخادم",
  "privacy.noTracking": "لا تتبع ولا إشارات تحليلية",
  "privacy.noAiPrompts":
    "لا تُحفظ أوامر الذكاء الاصطناعي أو إجاباته افتراضيًا",
  "privacy.exportRestoreErase": "تصدير أو استعادة أو مسح",
  "privacy.exportDesc":
    "صدّر نسخة احتياطية مُرقّمة من إشاراتك المرجعية وملاحظاتك وخطة المراجعة والتفضيلات. الاستيراد يستبدل نسخة هذا الجهاز بعد التأكيد. الحذف يمسح البيانات المحلية المدعومة نهائيًا.",
  "privacy.lossConditions": "ظروف الفقد",
  "privacy.lossDesc":
    "لأنه لا يُرفَع شيء، مسح بيانات الموقع/ملفات تعريف الارتباط، أو استخدام نافذة خاصة/متخفية، أو تبديل المتصفح أو الجهاز، أو إلغاء تثبيت المتصفح يمكن أن يحذف هذه البيانات نهائيًا. صدّر نسخة JSON احتياطية إذا كنت تنوي الاحتفاظ بها.",
  "privacy.aiFeatures": "ميزات الذكاء الاصطناعي",
  "privacy.aiDesc":
    "توليد إجابات الذكاء الاصطناعي معطّل. علامة الميزة تبقى مُوقَفة حتى تُستوفى جميع بوابات الأمان.",
  "privacy.see": "راجع ",
  "privacy.forDetails": "للتفاصيل.",
  "privacy.quranText":
    "يُعرض نص القرآن والترجمة من مجموعة بيانات مُثبّتة ومرخّصة علنًا ومُضمَّنة مع التطبيق. الروابط الخارجية تفتح في ألسنة جديدة؛ تلك المواقع لها سياسات خصوصية خاصة بها.",
  "privacy.noChildren":
    "لأنه لا تُجمع بيانات شخصية، التطبيق لا يجمع عمدًا معلومات من الأطفال أو أي مستخدم آخر.",
  "privacy.policyChanges":
    "إذا تغيّرت هذه السياسة، سيُحدَّث تاريخ التحديث أعلاه. النسخة الحالية متاحة دائمًا على هذا الرابط.",

  "terms.title": "شروط الاستخدام",
  "terms.intro":
    "نص القرآن والترجمة مُعاد إنتاجها من مصادر مرخّصة علنًا مدرجة في صفحة المصادر. يجب أن يحترم الإنتاج متطلبات الترخيص والإسناد لكل مصدر. لا يجوز تعديل النص العربي والترجمات.",
  "terms.editorial":
    "صفحات المواضيع والإعداد وأي نص تحريري على هذا الموقع وسائل قراءة. ليست تفسيرًا ولا فتوى ولا أحكامًا شرعية. استشر دائمًا العلم المؤهل للتوجيه الديني.",
  "terms.disclaimer":
    "يُقدَّم هذا التطبيق \"كما هو\" بدون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نضمن الاكتمال أو الدقة أو التوفر.",
  "terms.liability":
    "إلى أقصى حد يسمح به القانون، لا يكون المؤلفون والمساهمون مسؤولين عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام هذا التطبيق.",
  "terms.changes":
    "قد تُحدَّث هذه الشروط. الاستخدام المستمر بعد التغييرات يُعدّ قبولًا للشروط المُعدّلة. النسخة الحالية متاحة دائمًا على هذا الرابط.",

  "about.title": "حول {site}",
  "about.principles": "المبادئ",
  "about.contentIntegrity": "سلامة المحتوى أولًا",
  "about.provenance": "المصدر معروض",
  "about.respectfulUx": "تجربة مستخدم محترمة",
  "about.pinnedDataset": "مجموعة بيانات مُثبّتة",
  "about.seeCatalog": "شاهد فهرس المصادر الكامل ←",

  "accessibility.title": "بيان إمكانية الوصول",
  "accessibility.intro":
    "يهدف هذا التطبيق للوفاء بمعايير WCAG 2.1 المستوى AA حيثما كان ذلك عمليًا. نختبر بالتنقل بلوحة المفاتيح فقط وقارئات الشاشة وتفضيلات التباين العالي أثناء التطوير.",
  "accessibility.keyboard":
    "تخطيط قابل للتنقل بلوحة المفاتيح ودعم الانتقال إلى المحتوى.",
  "accessibility.zoom":
    "النص يتمدد مع تكبير المتصفح حتى 200% دون فقدان محتوى.",
  "accessibility.landmarks":
    "معالم HTML دلالية وتسميات ARIA لمعالم التنقل.",
  "accessibility.reducedMotion":
    "تفضيل تقليل الحركة محترم للرسوم المتحركة.",
  "accessibility.contrast":
    "تباين ألوان كافٍ لنص الجسم على خلفيات فاتحة.",
  "accessibility.arabicText":
    "النص العربي يستخدم خط قرآن مخصص؛ قد يختلف عرض الخط عبر قارئات الشاشة. نعمل بنشاط على تحسين دعم قارئ الشاشة للعربية.",
  "accessibility.barrier":
    "إذا واجهت حاجز إمكانية وصول، استخدم ",
  "accessibility.report": "الإبلاغ عن مشكلة",

  "sourcesPage.title": "المصادر والأصل",
  "sourcesPage.description":
    "كل آية معروضة هنا تُعزى لمصدر مسنَد مع الإسناد والترخيص وإصدار حزمة مستقر.",
  "sourcesPage.catalog": "فهرس المصادر",
  "sourcesPage.visitSource": "زيارة المصدر",
  "sourcesPage.licenseTerms": "شروط الترخيص",
  "sourcesPage.methodology": "المنهجية التحريرية",
  "sourcesPage.pinnedPackage":
    "المحتوى يصل فقط كحزمة npm مُثبّتة ومرقّمة.",
  "sourcesPage.everySource":
    "كل مصدر — مجموعة بيانات مُعبّأة أو سجل رابط تفسير أو مصدر مُستبعد — مدرج مع إسنادها.",
  "sourcesPage.topicPages":
    "صفحات المواضيع اختيارات تحريرية لآيات مشهورة — نقاط دخول للدراسة وليست تفسيرًا.",
  "sourcesPage.relationship":
    "كل علاقة تحمل نوع علاقة مُصنَّف وحالة المراجعة.",
  "sourcesPage.publicationState":
    "حالة النشر لكل موضوع معروضة في صفحة موضوعه.",
  "sourcesPage.noReviewer":
    "لم يُعيَّن مراجع علمي مؤهل.",
  "sourcesPage.pendingReview": "معلق على المراجعة العلمية",
  "sourcesPage.reportInaccuracy":
    "يمكن لأي شخص الإبلاغ عن آية غير دقيقة أو مرجع أو ترجمة أو اختيار موضوع.",
  "sourcesPage.versionedData":
    "لأن كل المحتوى بيانات مُرقّمة من مصدر الحقيقة، التراجع هو تغيير حزمة.",
  "sourcesPage.aiSafety":
    "حد أمان الذكاء الاصطناعي: توليد إجابات الذكاء الاصطناعي معطّل.",
  "sourcesPage.quranTextNote":
    "يجب ألا يولّد الذكاء الاصطناعي نص قرآن أو تفسيرًا أو حديثًا أو فتوى أو إجماعًا علميًا.",
  "sourcesPage.catalogNote":
    "هذا الفهرس هو المصدر الوحيد للحقيقة للإسناد في هذا التطبيق.",

  "report.title": "الإبلاغ عن مشكلة",
  "report.description":
    "لأخطاء في نص الآية أو إعداد الموضوع أو إجابات الذكاء الاصطناعي. تُجهَّز التقارير على هذا الجهاز — لا توجد نقطة نهاية خادم لها.",
  "report.category": "الفئة",
  "report.location": "الموقع / الرابط",
  "report.details": "التفاصيل",
  "report.stepsToReproduce": "خطوات إعادة الإنتاج",
  "report.expectedBehaviour": "السلوك المتوقع",
  "report.prepareReport": "تجهيز التقرير",
  "report.copyToClipboard": "نسخ إلى الحافظة",
  "report.downloadAsFile": "تنزيل كملف",
  "report.emailReport": "إرسال هذا التقرير بالبريد",
  "report.noAddress":
    "لم يُهيَّأ عنوان تسليم لهذا النشر (عيّن NEXT_PUBLIC_REPORT_EMAIL لتفعيل تسليم البريد). انسخ أو حمّل التقرير بدلًا من ذلك.",
  "report.locationPlaceholder": "مثلًا /quran/al-baqarah أو https://...",
  "report.detailsPlaceholder":
    "صِف المشكلة بدقة قدر الإمكان. أضف المراجع (سورة:آية) إن لزم.",
  "report.stepsPlaceholder": "ماذا فعلت؟",
  "report.expectedPlaceholder": "ما الذي كان يجب أن يحدث؟",
  "report.copied": "تم نسخ التقرير إلى الحافظة",
  "report.couldNotCopy": "تعذّر النسخ",
  "report.openingEmail": "جارٍ فتح تطبيق البريد",
  "report.downloaded": "تم تنزيل التقرير",

  "onboarding.title": "مرحبًا بك في الهدى",
  "onboarding.description":
    "اختر هدفك من التعلّم للبدء بمسارات دراسة قرآنية مخصصة.",

  "errors.somethingWrong": "حدث خطأ ما",
  "errors.readingUnavailable": "القراءة غير متاحة حاليًا",
  "errors.bodyText":
    "تعذّر تحميل نص الآية لهذه الصفحة. هذه مشكلة عرض وليست مشكلة في نص القرآن نفسه.",
  "errors.reference": "المرجع:",

  "notFound.title": "غير موجود",
  "notFound.description": "ذلك المرجع ليس في القرآن",
  "notFound.bodyText":
    "القرآن يتكون من 114 سورة، ولكل سورة عدد ثابت من الآيات. العنوان الذي تابعته لا يطابق أيًا منها.",
  "notFound.browseSurahs": "تصفّح جميع السور الـ114",
  "notFound.searchInstead": "ابحث بدلًا من ذلك",

  "pagination.aria": "ترقيم الصفحات",
  "pagination.previous": "الانتقال إلى الصفحة السابقة",
  "pagination.next": "الانتقال إلى الصفحة التالية",

  "breadcrumb.aria": "مسار التنقل",
  "breadcrumb.home": "الرئيسية",

  "languageSelector.label": "اللغة",
  "languageSelector.aria": "اختر لغة الواجهة",
  "languageSelector.title": "لغة الواجهة",
  "languageSelector.choose": "اختر لغة",

  "metadata.homeTitle": "{site} — {tagline}",
  "metadata.homeDescription":
    "اقرأ القرآن بالرسم العثماني مع ترجمات بأكثر من 100 لغة، ومراجع آيات مستقرة، وبحث، ونقاط دخول مواضيع مُعدّة.",
  "metadata.quranTitle": "القرآن",
  "metadata.quranDescription":
    "كل سورة بالترتيب المعتمد، مع اسمها العربي وعدد آياتها.",
  "metadata.discoverTitle": "اكتشف — مركز تعلّم القرآن",
  "metadata.discoverDescription":
    "مسارات تعلّم ومحاور واسعة وأبعاد وبحث: اعثر على نقطة انطلاقك.",
  "metadata.exploreTitle": "استكشف — 10 أبعاد للقرآن",
  "metadata.exploreDescription":
    "اكتشف القرآن عبر عشرة أبعاد حياتية ومواضيع مُعدّة.",
  "metadata.topicsTitle": "المواضيع",
  "metadata.topicsDescription":
    "نقاط دخول تحريرية تجمع الآيات المشهورة حسب الموضوع.",
  "metadata.domainsTitle": "المجالات — مجالات استكشاف القرآن",
  "metadata.domainsDescription":
    "مجالات موضوعية واسعة للتخطيط التحريري، مختلفة عن الأبعاد.",
  "metadata.graphTitle": "مستكشف خريطة المعرفة",
  "metadata.graphDescription":
    "شاهد كيف ترتبط الأبعاد بالمواضيع، وكيف ترتبط المواضيع ببعضها.",
  "metadata.searchTitle": "ابحث في القرآن",
  "metadata.searchDescription":
    "اعثر على الآيات بالرجوع أو النص العربي أو الترجمة أو الموضوع.",
  "metadata.settingsTitle": "الإعدادات",
  "metadata.settingsDescription":
    "تفضيلات القراءة ولغة الواجهة، مخزنة فقط على هذا الجهاز.",
  "metadata.privacyTitle": "سياسة الخصوصية",
  "metadata.privacyDescription":
    "كيف يتعامل هذا التطبيق مع بياناتك — محليًا، بدون حسابات أو تحليلات.",
  "metadata.termsTitle": "شروط الاستخدام",
  "metadata.termsDescription":
    "شروط استخدام تطبيق قراءة القرآن هذا.",
  "metadata.aboutTitle": "حول — {site}",
  "metadata.aboutDescription":
    "حول مركز قراءة القرآن الهادئ الذي يركّز على المصادر.",
  "metadata.accessibilityTitle": "بيان إمكانية الوصول",
  "metadata.accessibilityDescription":
    "التزامات إمكانية الوصول لهذا التطبيق.",
  "metadata.sourcesTitle": "المصادر والأصل",
  "metadata.sourcesDescription":
    "مصادر مسجّلة وتراخيص وإسناد لكل آية معروضة.",
  "metadata.reportTitle": "الإبلاغ عن مشكلة",
  "metadata.reportDescription":
    "الإبلاغ عن أخطاء في نص الآية أو إعداد الموضوع أو إجابات الذكاء الاصطناعي.",
  "metadata.learnTitle": "تعلّم",
  "metadata.learnDescription": "لوحة تعلّم القرآن المخصصة.",
  "metadata.notFoundTitle": "غير موجود",
  "metadata.errorTitle": "حدث خطأ ما",

  "counts.steps": {
    one: "{count} خطوة",
    few: "{count} خطوات",
    many: "{count} خطوة",
    other: "{count} خطوة",
  },
  "counts.verses": {
    one: "{count} آية",
    few: "{count} آيات",
    many: "{count} آية",
    other: "{count} آية",
  },
  "counts.ayat": {
    one: "{count} آية",
    few: "{count} آيات",
    many: "{count} آية",
    other: "{count} آية",
  },
  "counts.suggestions": {
    one: "{count} اقتراح متاح",
    few: "{count} اقتراحات متاحة",
    many: "{count} اقتراحًا متاحًا",
    other: "{count} اقتراح متاح",
  },
  "counts.references": {
    one: "{count} مرجع",
    few: "{count} مراجع",
    many: "{count} مرجعًا",
    other: "{count} مرجع",
  },
  "counts.topics": {
    one: "{count} موضوع",
    few: "{count} مواضيع",
    many: "{count} موضوعًا",
    other: "{count} موضوع",
  },
  "counts.domains": {
    one: "{count} مجال",
    few: "{count} مجالات",
    many: "{count} مجالًا",
    other: "{count} مجال",
  },
  "counts.dimensions": {
    one: "{count} بُعد",
    few: "{count} أبعاد",
    many: "{count} بُعدًا",
    other: "{count} بُعد",
  },
  "counts.results": {
    one: "{count} نتيجة",
    few: "{count} نتائج",
    many: "{count} نتيجة",
    other: "{count} نتيجة",
  },
  "counts.notes": {
    one: "{count} ملاحظة",
    few: "{count} ملاحظات",
    many: "{count} ملاحظة",
    other: "{count} ملاحظة",
  },
  "counts.bookmarks": {
    one: "{count} إشارة مرجعية",
    few: "{count} إشارات مرجعية",
    many: "{count} إشارة مرجعية",
    other: "{count} إشارة مرجعية",
  },
  "counts.translations": {
    one: "{count} ترجمة",
    few: "{count} ترجمات",
    many: "{count} ترجمة",
    other: "{count} ترجمة",
  },
  "counts.questions": {
    one: "{count} سؤال",
    few: "{count} أسئلة",
    many: "{count} سؤالًا",
    other: "{count} سؤال",
  },
  "counts.paths": {
    one: "{count} مسار",
    few: "{count} مسارات",
    many: "{count} مسارًا",
    other: "{count} مسار",
  },
  "counts.reviews": {
    one: "{count} مراجعة",
    few: "{count} مراجعات",
    many: "{count} مراجعة",
    other: "{count} مراجعة",
  },
  "counts.days": {
    one: "{count} يوم",
    few: "{count} أيام",
    many: "{count} يومًا",
    other: "{count} يوم",
  },

  "settings.subtitle": "تفضيلات القارئ محفوظة على هذا الجهاز فقط.",
  "settings.arabicSize": "حجم النص العربي",
  "settings.arabicSizeDesc": "يؤثر على النص العربي العثماني في القراءات وصفحات الموضوعات.",
  "settings.arabicSizeLabel": "حجم النص: {size}",
  "settings.sizeSmall": "صغير",
  "settings.sizeMedium": "متوسط",
  "settings.sizeLarge": "كبير",
  "settings.sizeExtraLarge": "كبير جداً",
  "settings.lineSpacing": "تباعد الأسطر",
  "settings.lineSpacingDesc": "اضبط التباعد العمودي بين الأسطر العربية.",
  "settings.lineSpacingLabel": "تباعد الأسطر: {spacing}",
  "settings.arabicPreview": "معاينة حجم النص العربي",
  "settings.translationEdition": "نسخة الترجمة",
  "settings.translationEditionDesc": "اختر من بين أكثر من 100 ترجمة بأكثر من 50 لغة. الافتراضي: الأردية (جالندهري).",
  "settings.showTranslation": "إظهار الترجمة",
  "settings.showTranslationDesc": "تبديل ظهور الترجمة. تُعرض النسخة المحددة أعلاه.",
  "settings.showTransliteration": "إظهار النقل الحرفي",
  "settings.showTransliterationDesc": "للمساعدة في القراءة فقط؛ ليس بديلاً عن النص العربي أبداً.",
  "settings.audioRecitation": "التلاوة الصوتية",
  "settings.audioRecitationDesc": "اعرض زر الاستماع تحت كل آية. يتم بث الصوت فقط عند الضغط على التشغيل.",
  "settings.audioSource": "ملفات MP3 آية بآية من شبكة CDN الإسلامية (تسجيلات everyayah.com)، تُبث بسرعة 64 كيلوبت في الثانية.",
  "settings.parallelMode": "مقارنة الترجمات جنباً إلى جنب",
  "settings.parallelModeDesc": "اعرض ما يصل إلى {count} ترجمات إضافية أسفل النسخة الأساسية.",
  "settings.parallelMaxReached": "تم الوصول إلى الحد الأقصى {count} من الترجمات الإضافية. أزل واحدة لإضافة أخرى.",
  "settings.parallelMemory": "يتم تنزيل كل نسخة مرة واحدة في كل جلسة وتُحتفظ في الذاكرة — حوالي 1.5 ميغابايت لكل ترجمة.",
  "settings.localDataWarning": "التخزين المحلي ليس نسخة احتياطية.",
  "settings.localDataWarningDesc": "لأنه لا يتم رفع شيء، لا توجد نسخة على الخادم لاستعادتها. مسح بيانات الموقع أو ملفات تعريف الارتباط، أو التصفح في نافذة خاصة أو متخفية، أو تغيير المتصفح أو الجهاز، أو إلغاء تثبيت المتصفح سيؤدي إلى محو هذه التفضيلات ومكتبتك وخطة المراجعة الخاصة بك. استخدم تصدير النسخة الاحتياطية أولاً إذا كنت تريد الاحتفاظ بها.",

  "home.steps": "خطوات",
  "home.ayahReference": "آية {surah}:{ayah}",

  "home.heroTitle": "اقرأ القرآن مع مصادره أمامك بوضوح",
  "home.heroDescription": "نص عثماني، وترجمات بأكثر من 100 لغة (الافتراضي: الأردية — جالندهري)، ومراجع مستقرة يمكنك مشاركتها، وبحث هادئ — بلا فوضى، ولا سلاسل، ولا شيء غير منسوب.",
  "home.searchHint": "جرب \"2:255\" أو \"البقرة 153\" أو \"الصبر\" أو نصاً عربياً.",
  "home.discoverLink": "أو اكتشف نقطة بداية موجهة",
  "home.attributedHeading": "كل آية منسوبة",
  "home.attributedDescription": "النص العربي والترجمة والنقل الحرفي يحمل كل منها ترخيصاً وناشراً وإصداراً يمكنك فحصه في صفحة المصادر.",
  "home.reviewSources": "مراجعة المصادر",
  "home.startReading": "ابدأ القراءة",
  "home.featuredSurahsDescription": "نقاط دخول شائعة — أو تصفح جميع السور الـ114.",
  "home.allSurahs": "جميع السور",
  "home.ayat": "آيات",
  "home.exploreByDimension": "استكشف حسب البعد",
  "home.dimensionsDescription": "عشرة أبعاد حياتية — روحية وشخصية وعائلية والمزيد — كنقاط بداية للتأمل.",
  "home.allDimensions": "جميع الأبعاد",
  "home.exploreByTopic": "استكشف حسب الموضوع",
  "home.topicsDescription": "نقاط دخول تحريرية مع حالة مراجعة — ليس تفسيراً.",
  "home.allTopics": "جميع الموضوعات",
} as const;
