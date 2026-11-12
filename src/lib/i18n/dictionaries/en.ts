/**
 * English dictionary — the source of truth for the translation key surface.
 *
 * Values may be a string or a CLDR plural object. Keys are flat and
 * dot-namespaced so missing-key reporting and completeness tests are simple.
 */
export const en = {
  "common.loading": "Loading…",
  "common.error": "Something went wrong",
  "common.notFound": "Not found",
  "common.tryAgain": "Try again",
  "common.backToHome": "Back to home",
  "common.close": "Close",
  "common.cancel": "Cancel",
  "common.save": "Save",
  "common.delete": "Delete",
  "common.search": "Search",
  "common.noResults": "No results found",
  "common.unavailable": "Unavailable",
  "common.previous": "Previous",
  "common.next": "Next",
  "common.back": "Back",
  "common.continue": "Continue",
  "common.skip": "Skip",
  "common.submit": "Submit",
  "common.copy": "Copy",
  "common.copied": "Copied",
  "common.menu": "Menu",
  "common.settings": "Settings",
  "common.home": "Home",
  "common.language": "Language",
  "common.openMenu": "Open menu",
  "common.closeMenu": "Close menu",
  "common.remove": "Remove",
  "common.viewAll": "View all",
  "common.learnMore": "Learn more",
  "common.readMore": "Read more",
  "common.all": "All",
  "common.none": "None",
  "common.optional": "Optional",
  "common.required": "Required",
  "common.yes": "Yes",
  "common.no": "No",

  "nav.discover": "Discover",
  "nav.read": "Read",
  "nav.explore": "Explore",
  "nav.topics": "Topics",
  "nav.search": "Search",
  "nav.learn": "Learn",
  "nav.plans": "Plans",
  "nav.quiz": "Quiz",
  "nav.library": "Library",
  "nav.myStudy": "My Study",
  "nav.settings": "Settings",
  "nav.primary": "Primary",
  "nav.footer": "Footer",
  "nav.skipToContent": "Skip to main content",

  "layout.siteName": "Al-Huda",
  "layout.siteTagline": "Read, understand, and connect the Quran",
  "layout.madeWithDyad": "Made with Dyad",

  "footer.about": "About",
  "footer.sources": "Sources",
  "footer.report": "Report an issue",
  "footer.accessibility": "Accessibility",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.tagline": "A calm, source-first place to read and study the Quran.",
  "footer.arabicCredit":
    "Arabic text (Uthmani): via quranenc.com, distributed through quran-json v3.1.2 (CC-BY-4.0).",
  "footer.translationCredit":
    "Translations in 100+ languages via Tanzil.net. Transliteration via Tanzil.net.",
  "footer.editorialNote":
    "Topic selections are editorial reading aids — not tafsir, not rulings. See the review status on every topic page.",
  "footer.licenseNote": "Content licenses respected; see /sources.",
  "footer.copyright":
    "© {year} {site}. Content licenses respected; see /sources.",

  "home.verseOfDay": "Verse of the day",
  "home.verseOfDayUnavailable": "Verse of the day is unavailable right now.",
  "home.verseOfDayError":
    "Could not load today's verse. It will appear on your next visit to this page.",
  "home.continueReading": "Continue reading",
  "home.lastVisited": "Last visited {date}",
  "home.openFullPage": "Open full page",
  "home.translationCredit": "Translation: {edition} · ",
  "home.sourceDetails": "source details",
  "home.continueLearning": "Continue learning",
  "home.startLearning": "Start learning",
  "home.recommendedFor": "Recommended for {audience}",
  "home.allLearningPaths": "All learning paths",
  "home.learningHubDescription":
    "Guided learning paths for studying the Quran — structured curriculum with sequenced steps, reflection prompts, and self-assessment.",
  "home.takeGuidedTour": "Take the guided tour",
  "home.browsePaths": "Browse paths",
  "home.steps": "steps",
  "home.ayahReference": "Ayah {surah}:{ayah}",

  "discover.title": "Discover your starting point",
  "discover.intro":
    "The Quran offers many entry points. This hub brings together learning paths, broad themes, dimensions, and search so you can begin where you are.",
  "discover.startWithPath": "Start with a path",
  "discover.pathDescription":
    "Curated learning sequences for different audiences and goals. Each path is sequenced and marked with its review status.",
  "discover.forAudience": "For {audience}",
  "discover.allPaths": "All learning paths",
  "discover.broadestThemes": "Broadest themes",
  "discover.themesDescription":
    "Topics that appear across the most dimensions. These themes connect several areas of life and study.",
  "discover.inDimensions": "In {count} dimensions",
  "discover.allTopics": "All topics",
  "discover.exploreByDimension": "Explore by dimension",
  "discover.dimensionDescription":
    "Ten life dimensions — spiritual, personal, family, and more — as editorial navigation aids.",
  "discover.fullDimensionExplorer": "Full dimension explorer",
  "discover.goDeeper": "Go deeper",
  "discover.knowledgeGraph": "Knowledge Graph",
  "discover.graphDescription":
    "See how dimensions connect to topics, and how topics relate to one another.",
  "discover.searchQuran": "Search the Quran",
  "discover.searchDescription":
    "Find verses by reference, Arabic text, translation, or topic.",
  "discover.readQuran": "Read the Quran",
  "discover.readDescription":
    "Browse all 114 surahs with Uthmani text and translations.",
  "discover.learningDashboard": "Learning Dashboard",
  "discover.dashboardDescription":
    "Track your progress, take quizzes, and manage your study plans.",
  "discover.editorialNote":
    "All topics, dimensions, and learning paths on this page carry their review status. Editorial selections are reading aids, not tafsir or rulings.",

  "explore.title": "Explore the Quran",
  "explore.intro":
    "Discover the Quran through 10 life dimensions. Each dimension connects to curated topics and offers search terms for further study.",
  "explore.dimensionNote":
    "The dimensions below are a topic-level navigation aid. Individual ayat are not classified by dimension.",
  "explore.covers": "Covers",
  "explore.exploreArrow": "Explore →",
  "explore.startWithTopics": "Start with curated topics",
  "explore.topicsDescription":
    "These topics are mapped to dimensions as navigation aids. Each topic page shows its review status.",
  "explore.domainExplorer": "Domain Explorer",
  "explore.domainDescription":
    "Domains are different from dimensions: domains organize broad subject areas for editorial planning.",
  "explore.browseDomains": "Browse domain catalog",
  "explore.graphExplorer": "Knowledge Graph Explorer",
  "explore.graphDescription":
    "See how the ten dimensions connect to curated topics, and how topics relate to one another.",
  "explore.openGraph": "Open graph explorer",
  "explore.searchTitle": "Search the Quran",
  "explore.searchDescription":
    "Looking for something specific? Search by reference, Arabic text, translation, or topic.",
  "explore.openSearch": "Open search",

  "quran.title": "Quran",
  "quran.intro":
    "Every surah, in canonical order, with its Arabic name and verse count.",
  "quran.surah": "Surah",
  "quran.ayah": "Ayah",
  "quran.juz": "Juz {number}",
  "quran.page": "Page {number}",
  "quran.hizb": "Hizb {number}",
  "quran.ruku": "Ruku {number}",
  "quran.manzil": "Manzil {number}",
  "quran.sajdah": "Sajda verse",
  "quran.readFullSurah": "Read full surah",
  "quran.appearsInTopics": "Appears in topics",
  "quran.topicsNote":
    "Topic pages mark the review status and are not tafsir.",
  "quran.appearsInPaths": "Appears in learning paths",
  "quran.pathsNote":
    "Learning paths are curated study sequences. Each path marks its review status and is not tafsir.",
  "quran.previousAyah": "Previous · {surah}:{ayah}",
  "quran.nextAyah": "Next · {surah}:{ayah}",
  "quran.breadcrumb": "Quran",
  "quran.surahVerses": "Surah verses",
  "quran.readContinuously":
    "Read continuously below. Use the controls to adjust Arabic size and toggle translation/transliteration.",
  "quran.navigateInstruction":
    "Navigate by ayah number or use the table of contents in the index.",
  "quran.previousSurah": "Previous: {surah}",
  "quran.nextSurah": "Next: {surah}",
  "quran.ayahReference": "Ayah reference",
  "quran.surahOf":
    "Surah {surah} of 114 · {translation} · {revelation}",

  "reader.translation": "Translation",
  "reader.arabicSize": "Arabic text size",
  "reader.textSize": "Text size",
  "reader.lineSpacing": "Line spacing",
  "reader.spacing": "Spacing",
  "reader.transliteration": "Transliteration",
  "reader.small": "Small",
  "reader.medium": "Medium",
  "reader.large": "Large",
  "reader.extraLarge": "Extra large",
  "reader.compact": "Compact",
  "reader.normal": "Normal",
  "reader.loose": "Loose",
  "reader.translationsShown": "Translations shown",
  "reader.translationsHidden": "Translations hidden",
  "reader.transliterationShown": "Transliteration shown",
  "reader.transliterationHidden": "Transliteration hidden",
  "reader.translationEdition": "Translation edition",
  "reader.smallAria": "Small text size",
  "reader.mediumAria": "Medium text size",
  "reader.largeAria": "Large text size",
  "reader.extraLargeAria": "Extra large text size",
  "reader.lineHeightAria": "Line spacing: {value}",

  "translationSelector.select": "Select translation",
  "translationSelector.aria": "Translation selector",
  "translationSelector.searchPlaceholder": "Search translations…",
  "translationSelector.searchAria": "Search translations",
  "translationSelector.available": "Available translations",
  "translationSelector.rtl": "(RTL)",
  "translationSelector.noMatches": "No translations match \"{search}\"",
  "translationSelector.viaTanzil": "Translations via Tanzil.net",
  "translationSelector.loading": "Loading…",

  "searchPage.title": "Search the Quran",
  "searchPage.placeholder":
    "Find verses by reference (e.g. \"2:255\", \"al-baqarah 153\"), surah name, Arabic text, translation, or topic.",
  "searchPage.loadingFilters": "Loading filters…",
  "searchPage.invalidFilters":
    "One or more filter values were invalid and have been ignored.",
  "searchPage.filterNote":
    "Filters narrow a search rather than browse the text on their own. Type a word or a reference above to see the verses that match them.",
  "searchPage.matchingNote":
    "Matching is rule-based and transparent. Reference matches come first, then lexical matches.",
  "searchPage.editionSearch":
    "Search within a specific translation or classical tafsir edition. The text is fetched from Tanzil.net on first use and cached.",
  "searchPage.chooseEdition": "Choose an edition…",
  "searchPage.searchEdition": "Search edition",
  "searchPage.editionNote":
    "An edition search looks only inside that edition, so a term that appears elsewhere may not be found.",
  "searchPage.typeMore": "Type at least two characters to search.",
  "searchPage.unknownEdition":
    "Unknown edition: {edition}. Choose an edition from the search controls.",
  "searchPage.backToDefault": "Back to default search",
  "searchPage.tryAgainLater": "Please try again later.",
  "searchPage.parsedAsRef": "Parsed as reference: {results}",
  "searchPage.refOutOfRange": "Reference out of range for that surah.",
  "searchPage.noMatches":
    "No matches found. Try a different query or adjust your filters.",
  "searchPage.activeFilters":
    "Active filters are narrowing the result set. Clearing them will broaden the search.",
  "searchPage.inPath": "In path: {path}",
  "searchPage.noMatchesEdition":
    "No matches found in {edition} for \"{query}\".",
  "searchPage.editionScoped":
    "Edition-scoped search matches literal substrings in the translation text.",
  "searchPage.tafsirLoadError":
    "One or more tafsir editions could not be loaded. Results below are incomplete.",
  "searchPage.tafsirScoped":
    "Tafsir search matches literal substrings in the classical Arabic text.",
  "searchPage.wordsToSearch": "Words to search for in the chosen edition",
  "searchPage.searchModes": "Search modes",
  "searchPage.wordsPlaceholder": "Words to find in the edition…",
  "searchPage.tafsirJalalayn": "Tafsir al-Jalalayn",
  "searchPage.alMuyassar": "Al-Muyassar",
  "searchPage.pickthall": "Pickthall",
  "searchPage.jalandhry": "Jalandhry (Urdu)",

  "searchBox.placeholder": "Search a reference, translation, or Arabic text…",
  "searchBox.aria": "Search the Quran",
  "searchBox.button": "Search",
  "searchBox.shortcut": "Press slash to focus search",
  "searchBox.suggestions": "Search suggestions",
  "searchBox.suggestionCount": "{count} suggestions available",
  "searchBox.verse": "Verse",
  "searchBox.surah": "Surah",
  "searchBox.topic": "Topic",

  "searchFilters.defaultMode": "Default (Arabic + built-in English)",
  "searchFilters.tafsirMode": "Both classical tafsirs",
  "searchFilters.any": "Any",
  "searchFilters.arabicOnly": "Arabic text only",
  "searchFilters.englishOnly": "English text only",
  "searchFilters.allSurahs": "All surahs",
  "searchFilters.allTypes": "All types",
  "searchFilters.meccan": "Meccan",
  "searchFilters.medinan": "Medinan",
  "searchFilters.allJuz": "All juz",
  "searchFilters.allTopics": "All topics",
  "searchFilters.classicalTafsirs": "Classical tafsirs",
  "searchFilters.arabic": "Arabic only",
  "searchFilters.english": "English only",
  "searchFilters.removeFilter": "Remove {label}",

  "topics.title": "Explore by topic",
  "topics.intro":
    "Editorial entry points that group well-known verses by theme. Each topic page states its review status.",
  "topics.allTopics": "All topics",
  "topics.relationsNote":
    "All topic relations are typed (thematic, lexical, cross-reference, or editorial) and marked with their review status.",
  "topics.reviewStatus":
    "Review status: {status} — curated by {curator} via {method} (last pass {date}).",
  "topics.editorialNote":
    "Editorial selections are not tafsir and are not intended as rulings.",
  "topics.versesOnTopic": "Verses on this topic",
  "topics.curatedCount": "{shown} of {total} curated verses shown",
  "topics.unresolvedCount":
    "{count} curated references could not be resolved against the pinned Quran dataset and are therefore not shown.",
  "topics.unresolvedNote":
    "This is a data-integrity problem in the editorial selection, not a missing verse. It is surfaced rather than silently dropped so the count above is never overstated.",
  "topics.relatedTopics": "Related topics",
  "topics.exploreByDimension": "Explore this theme by dimension",
  "topics.dimensionMapping":
    "This topic appears in the editorial navigation mapping for {count} dimensions. Each dimension page shows how this theme connects to other topics.",
  "topics.openDimension": "Open {dimension} dimension →",
  "topics.dimensionNote":
    "Dimension-to-topic mappings are editorial navigation aids, not ayah-level classifications.",
  "topics.proposedDomains": "Proposed exploration domains",
  "topics.domainMapping":
    "This topic is editorially proposed to belong to {count} domains. These are organizational proposals pending review — not scholarly classifications of Quranic passages.",
  "topics.navigationAid": "navigation aid",
  "topics.organizationalProposal": "organizational proposal",
  "topics.openDomain": "Open {domain} domain →",
  "topics.domainNote":
    "Domain-topic relationships are organizational proposals, not scholarly conclusions.",
  "topics.learningPaths": "Learning paths on this theme",
  "topics.pathsDescription":
    "These paths include steps that reference this topic. Each path marks its review status and is not tafsir.",
  "topics.provenance":
    "Provenance: each verse above shows its effective review record. A relation with no individual review inherits the topic-level record. No AI-generated exegesis is presented as scripture.",

  "graph.title": "Knowledge Graph Explorer",
  "graph.filterByDimension": "Filter by dimension",
  "graph.all": "All",
  "graph.scopeNote":
    "This graph shows editorial navigation mappings between dimensions and curated topics, plus lateral relationships between curated topics. It does not classify individual ayat by dimension. Every node and edge carries its review status.",
  "graph.nodeCount":
    "{nodes} nodes ({dimensions} dimensions, {topics} topics), {edges} edges. Click or tab to a node for details.",
  "graph.dimensionNode": "Dimension node",
  "graph.topicNode": "Topic node",
  "graph.dimensionTopicMapping": "Dimension → topic mapping",
  "graph.topicRelationship": "Topic ↔ topic relationship",
  "graph.aria":
    "Knowledge graph showing dimensions and topics with their editorial relationships",
  "graph.svgTitle": "Knowledge Graph Explorer",
  "graph.svgDesc":
    "Concentric layout: dimensions on the outer ring, topics on the inner ring, with editorial relationships as edges.",
  "graph.keyboardHelp":
    "Keyboard accessible: Tab between nodes, Arrow Left/Right to cycle within a ring, Arrow Up/Down to switch rings, Enter or Space to select.",
  "graph.listView": "List view of all nodes ({count})",
  "graph.dimension": "Dimension",
  "graph.topic": "Topic",
  "graph.details": "Details for {label}",
  "graph.closeDetails": "Close details",
  "graph.reviewStatus": "Review status:",
  "graph.curator": "Curator:",
  "graph.method": "Method:",
  "graph.lastPass": "Last editorial pass:",
  "graph.connections": "Connections ({count})",
  "graph.openPage": "Open {type} page →",
  "graph.unresolvedCount":
    "{count} unresolved references in the graph data.",
  "graph.topicGraph":
    "Graph showing relationships between curated Quran topics",
  "graph.topicGraphTitle": "Topic relationship graph",

  "learn.paths": "Paths",
  "learn.plans": "Plans",
  "learn.revise": "Revise",
  "learn.quiz": "Quiz",
  "learn.sections": "Learning sections",
  "learn.dashboard": "Learning hub",
  "learn.dashboardDescription":
    "Your personalized entry point for guided Quran study. Continue where you left off, revise what you've learned, or explore new topics.",
  "learn.reviseDue": "Revise due ayat",
  "learn.versesDue": "{count} verses are due for review today.",
  "learn.continueQuiz": "Continue quiz",
  "learn.quizInProgress": "You have an in-progress quiz session.",
  "learn.continuePath": "Continue {path}",
  "learn.continueLearning": "Continue learning path",
  "learn.stepsComplete": "{done} of {total} steps complete.",
  "learn.pickUpWhereLeft": "Pick up where you left off.",
  "learn.continueReading": "Continue reading: {plan}",
  "learn.resumePlan": "Resume your reading plan.",
  "learn.startWithPath": "Start with a learning path",
  "learn.pathDescription":
    "Guided curriculum for structured Quran study.",
  "learn.takeQuiz": "Take a self-assessment quiz",
  "learn.quizDescription":
    "Check what you know and what is worth revisiting.",
  "learn.learningHub": "Learning hub",
  "learn.hubDescription":
    "Your personalized entry point for guided Quran study.",
  "learn.startJourney": "Start your learning journey",
  "learn.journeyDescription":
    "You haven't started any paths, quizzes, or revision plans yet. Begin with a guided learning path to build a foundation.",
  "learn.browsePaths": "Browse learning paths",
  "learn.continue": "Continue",
  "learn.dueForReview": "Due for review",
  "learn.pathsInProgress": "Paths in progress",
  "learn.quizAttempts": "Quiz attempts",
  "learn.revisionPlan": "Revision plan",
  "learn.lastRead": "Last read: Surah {surah}:{ayah}",
  "learn.readOn": "Read on {date}",
  "learn.inProgressQuiz": "In-progress quiz",
  "learn.questionsAnswered":
    "{answered} of {total} questions answered",
  "learn.readingPlan": "Reading plan: {label}",
  "learn.goalPerSession": "Goal: {count} ayat per session",
  "learn.explore": "Explore",

  "paths.title": "Learning Paths",
  "paths.description":
    "Structured curriculum for guided Quran study. Each path is designed for a specific audience and learning goal, with sequenced steps that build understanding progressively.",
  "paths.backToPaths": "Back to paths",
  "paths.stepsCompleted": "{done} of {total} steps completed",
  "paths.stepNavigation": "Step navigation",
  "paths.step": "Step {number}",
  "paths.objective": "Objective",
  "paths.reflection": "Reflection prompt",
  "paths.verse": "Verse {surah}:{ayah}",
  "paths.markComplete": "Mark complete",
  "paths.completed": "Completed",
  "paths.testRecall": "Test your recall with a quiz",
  "paths.editorialStatus": "Editorial status:",
  "paths.statusNote":
    "This path is {status}. The content has been curated by the Al-Huda editorial team but has not yet been reviewed by a qualified scholar. Nothing here is presented as authoritative religious interpretation.",
  "paths.loading": "Loading…",
  "paths.welcome": "Welcome to Al-Huda",
  "paths.chooseGoal":
    "Choose your learning goal to get personalized recommendations.",
  "paths.skipForNow": "Skip for now",
  "paths.recommended": "Recommended for you",
  "paths.recommendedDesc":
    "Based on your goal, we recommend starting with these paths.",
  "paths.steps": "{count} steps",
  "paths.startLearning": "Start learning",

  "quiz.surahId": "Surah identification",
  "quiz.translationMatch": "Translation match",
  "quiz.ayahOrdering": "Ayah ordering",
  "quiz.topicMatch": "Topic match",
  "quiz.ayahRecall": "Ayah recall",
  "quiz.missingWord": "Missing word",
  "quiz.refRecognition": "Reference recognition",
  "quiz.emptyPlan":
    "Your revision plan is empty. Add verses to revise first.",
  "quiz.generationFailed": "Generation failed",
  "quiz.couldNotGenerate":
    "Could not generate questions from the given source",
  "quiz.failedToGenerate": "Failed to generate quiz",
  "quiz.defaultMix": "Default mix",
  "quiz.specificSurah": "Specific surah",
  "quiz.learningPath": "Learning path",
  "quiz.topic": "Topic",
  "quiz.myRevision": "My revision plan",
  "quiz.selectSurah": "Select a surah",
  "quiz.selectPath": "Select a path",
  "quiz.selectTopic": "Select a topic",
  "quiz.generating": "Generating…",
  "quiz.generate": "Generate quiz",
  "quiz.answerRecorded": "Answer recorded.",
  "quiz.selectAnswer": "Select an answer to continue.",
  "quiz.seeResults": "See results",
  "quiz.nextQuestion": "Next question",
  "quiz.correct": "Correct",
  "quiz.incorrect": "Incorrect",
  "quiz.unanswered": "Unanswered",
  "quiz.selfAssessed": "Self-assessed",
  "quiz.allInPlan":
    "All of these ayat are already in your revision plan.",

  "readingPlans.title": "Reading plans",
  "readingPlans.description":
    "Set personal reading targets for systematic Quran study. Track your progress through surahs or custom ranges.",
  "readingPlans.newPlan": "New reading plan",
  "readingPlans.createPlan": "Create a reading plan",
  "readingPlans.planLabel": "Plan label",
  "readingPlans.labelPlaceholder": "e.g., Surah Al-Baqarah, Juz 1-5",
  "readingPlans.start": "Start",
  "readingPlans.end": "End",
  "readingPlans.ayahPlaceholder": "Ayah",
  "readingPlans.ayatInSurah": "{count} ayat in this surah",
  "readingPlans.goalPerSession": "Goal per session",
  "readingPlans.ayatPerSession": "{count} ayah/ayat per session",
  "readingPlans.create": "Create plan",
  "readingPlans.noPlans": "No reading plans yet",
  "readingPlans.noPlansDesc":
    "Create your first reading plan to track progress through specific surahs or custom ranges.",
  "readingPlans.yourPlans": "Your plans",
  "readingPlans.resume": "Resume",
  "readingPlans.pause": "Pause",
  "readingPlans.delete": "Delete",
  "readingPlans.currentPosition": "Current position:",
  "readingPlans.complete": "Complete",
  "readingPlans.read": "Read",
  "readingPlans.lastActivity": "Last activity: {date}",

  "revision.title": "Memorization",
  "revision.subtitle": "Revision",
  "revision.description":
    "A quiet schedule for the ayat you are holding. Add a verse or a span, recall it from memory when it comes due, and rate how it went. The spacing adjusts itself; nothing here is graded, timed, or compared.",
  "revision.planNote":
    "Your plan lives only in this browser. There is no account and no server copy, which means clearing site data, using a private window, or switching device will remove it. Export a backup from your library if you intend to keep it. The app never sends reminders — there is no notification or messaging capability here.",
  "revision.loading": "Loading your plan from this browser…",
  "revision.missedIt": "Missed it",
  "revision.backToShortest": "Back to the shortest gap",
  "revision.difficult": "Difficult",
  "revision.sameGap": "Same gap again",
  "revision.easy": "Easy",
  "revision.longerGap": "Longer gap next time",
  "revision.incompleteText":
    "The verse text came back incomplete, so nothing is shown. Nothing is invented to fill the gap.",
  "revision.connectionError":
    "The verse text could not be reached. Check your connection and try again.",
  "revision.surahUnavailable": "Surah metadata is unavailable.",
  "revision.versesInPlan": "Verses in plan",
  "revision.dueToday": "Due today",
  "revision.scheduledLater": "Scheduled later",
  "revision.reviewsInLog": "Reviews in log",

  "library.title": "Your library",
  "library.description":
    "Bookmarks, private notes, and recent reads — stored only on this device. Nothing is uploaded; there is no account and no analytics.",
  "library.loading": "Loading your local library…",
  "library.noItems":
    "No saved items yet. Open any ayah to bookmark it or add a private note — it will appear here.",
  "library.recentReading": "Recent reading",
  "library.bookmarks": "Bookmarks",
  "library.openAyah": "Open ayah",
  "library.privateNotes": "Private notes",
  "library.viewAllNotes": "View all notes & filter by tag",
  "library.updated": "Updated {date}",
  "library.viewAyah": "View ayah",
  "library.manageCopy": "Manage this copy",
  "library.exportNote":
    "Export writes one JSON file holding your bookmarks, notes, reading history, and preferences.",
  "library.whereDataLives":
    "Where this data lives — and how it can be lost",
  "library.dataLivesDesc":
    "Your library is stored only in this browser's local storage. There is no server copy to restore from.",
  "library.backToLibrary": "Back to library",
  "library.notes": "Notes",
  "library.notesDescription":
    "Your private notes, filterable by tag — stored only on this device. There is no account and no server copy.",
  "library.loadingNotes": "Loading your notes from this browser…",
  "library.filterByTag": "Filter notes by tag",
  "library.allCount": "All ({count})",
  "library.noTagNotes": "No notes carry this tag yet.",
  "library.noNotes": "You haven't added any notes yet.",
  "library.openAyahNote":
    "Open any ayah and choose \"Add note\" to start.",

  "backup.exported":
    "Backup exported — {bookmarks} bookmarks, {notes} notes, {verses} planned verses.",
  "backup.tooLarge":
    "This file is larger than 5 MB, which no Al-Huda backup reaches. Nothing was imported.",
  "backup.notImported": "Backup not imported",
  "backup.confirmReplace":
    "Replace everything on this device with the backup?",
  "backup.importCancelled":
    "Import cancelled. Nothing on this device was changed.",
  "backup.imported": "Backup imported.",
  "backup.couldNotRead":
    "The file could not be read. Nothing was imported.",
  "backup.confirmErase": "Erase all local data on this device?",
  "backup.eraseWarning":
    "There is no server copy to restore from. Export a backup first if you want to keep any of it. This cannot be undone.",
  "backup.allDataErased":
    "All local data erased from this device.",
  "backup.exportBackup": "Export backup",
  "backup.reading": "Reading…",
  "backup.importBackup": "Import backup",
  "backup.deleteAll": "Delete all local data",
  "backup.chooseFile": "Choose an Al-Huda backup file",

  "settings.title": "Settings",
  "settings.description": "Reader preferences stored only on this device.",
  "settings.readingPrefs": "Reading preferences",
  "settings.translationNote":
    "Choose from 100+ translations in 50+ languages. Default: Urdu (Jalandhry).",
  "settings.audioNote":
    "Show a Listen button under each verse. Audio streams only when you press play.",
  "settings.reciter": "Reciter",
  "settings.reciterNote":
    "Verse-by-verse MP3s from the Islamic Network CDN (everyayah.com recordings), streamed at 64 kbps.",
  "settings.parallelNote":
    "Show up to {count} extra translations beneath the primary edition.",
  "settings.primary": "Primary:",
  "settings.addTranslation": "Add a translation",
  "settings.chooseTranslation": "Choose a translation…",
  "settings.maxTranslations":
    "Maximum of {count} additional translations reached. Remove one to add another.",
  "settings.editionNote":
    "Each edition downloads once per session and is held in memory — roughly 1.5 MB per translation.",
  "settings.localData": "Your local data",
  "settings.localDataDesc":
    "Bookmarks, private notes, reading history, your revision plan, and preferences are stored only in this browser.",
  "settings.notBackup": "Local storage is not a backup.",
  "settings.notBackupDesc":
    "Because nothing is uploaded, there is no server copy to restore from. Clearing site data or cookies, browsing in a private window, or switching devices can delete this data permanently.",
  "settings.exportFirst":
    "Export a backup first if you want to keep them.",
  "settings.policies": "Policies & compliance",
  "settings.privacyLocal": "Privacy & local storage",
  "settings.sourcesProvenance": "Sources & provenance",
  "settings.privacyPolicy": "Privacy policy",
  "settings.termsOfUse": "Terms of use",
  "settings.accessibilityStatement": "Accessibility statement",
  "settings.arabicSizeAria": "Arabic text size",
  "settings.lineSpacingAria": "Line spacing",
  "settings.textSizeAria": "Text size: {value}",
  "settings.lineHeightAria": "Line spacing: {value}",
  "settings.removeTranslation": "Remove {name}",
  "settings.uiLanguage": "Interface language",
  "settings.uiLanguageNote":
    "Changes the language of buttons, navigation, and labels. The Quran text and your translation edition stay independent.",

  "privacy.title": "Privacy policy",
  "privacy.description":
    "How this application handles your data — locally, without accounts or analytics.",
  "privacy.policyIntro":
    "This application does not require an account, does not collect personal information, does not use analytics or tracking, and does not send your reading data to a server. Bookmarks, notes, and reading preferences are stored in your browser's localStorage.",
  "privacy.whatIsStored": "What is stored",
  "privacy.storedDesc":
    "Everything you create here stays in your browser's localStorage:",
  "privacy.libraryLabel": "Library:",
  "privacy.libraryDesc":
    "bookmarks, private notes and tags, reading history",
  "privacy.revisionLabel": "Revision plan:",
  "privacy.revisionDesc":
    "ayat, review schedule, ladders, and a capped review log",
  "privacy.prefsLabel": "Preferences:",
  "privacy.prefsDesc":
    "Arabic size, line height, translation/transliteration toggles, and interface language",
  "privacy.noAccount":
    "There is no account, no server copy of personal data, and no analytics.",
  "privacy.whatWeDontStore": "What we do not store",
  "privacy.noIds": "No user identifiers, emails, or passwords",
  "privacy.noServerData":
    "No server-side bookmarks, notes, or reading history",
  "privacy.noTracking": "No tracking or analytics beacons",
  "privacy.noAiPrompts":
    "No AI prompts or answers are persisted by default",
  "privacy.exportRestoreErase": "Export, restore, or erase",
  "privacy.exportDesc":
    "Export a versioned backup of your bookmarks, notes, revision plan, and preferences. Import replaces this device's copy after confirmation. Delete erases the supported local data permanently.",
  "privacy.lossConditions": "Loss conditions",
  "privacy.lossDesc":
    "Because nothing is uploaded, clearing site data/cookies, using a private/incognito window, switching browser or device, or uninstalling the browser can delete this data permanently. Export a JSON backup if you intend to keep it.",
  "privacy.aiFeatures": "AI features",
  "privacy.aiDesc":
    "AI answer generation is disabled. The feature flag remains off until every safety gate is met.",
  "privacy.see": "See ",
  "privacy.forDetails": "for details.",
  "privacy.quranText":
    "Quran text and translation are displayed from a pinned, openly licensed dataset bundled with the application. External links open in new tabs; those sites have their own privacy policies.",
  "privacy.noChildren":
    "Because no personal data is collected, the application does not knowingly collect information from children or any other user.",
  "privacy.policyChanges":
    "If this policy changes, the update date above will be revised. The current version is always available at this URL.",

  "terms.title": "Terms of use",
  "terms.intro":
    "Quran text and translation are reproduced from openly licensed sources listed on the Sources page. Reproduction must respect each source's license and attribution requirements. Arabic text and translations must not be altered.",
  "terms.editorial":
    "Topic pages, curation, and any editorial text on this site are reading aids. They are not tafsir, fatwa, or legal rulings. Always consult qualified scholarship for religious guidance.",
  "terms.disclaimer":
    "This application is provided \"as is\" without warranties of any kind, express or implied. We do not guarantee completeness, accuracy, or availability.",
  "terms.liability":
    "To the maximum extent permitted by law, the authors and contributors shall not be liable for any indirect, incidental, or consequential damages arising from use of this application.",
  "terms.changes":
    "These terms may be updated. Continued use after changes constitutes acceptance of the revised terms. The current version is always available at this URL.",

  "about.title": "About {site}",
  "about.principles": "Principles",
  "about.contentIntegrity": "Content integrity first",
  "about.provenance": "Provenance on display",
  "about.respectfulUx": "Respectful UX",
  "about.pinnedDataset": "Pinned dataset",
  "about.seeCatalog": "See full source catalog →",

  "accessibility.title": "Accessibility statement",
  "accessibility.intro":
    "This application aims to meet WCAG 2.1 Level AA where practical. We test with keyboard-only navigation, screen readers, and high-contrast preferences during development.",
  "accessibility.keyboard":
    "Keyboard-navigable layout and skip-to-content support.",
  "accessibility.zoom":
    "Text scales with browser zoom up to 200% without loss of content.",
  "accessibility.landmarks":
    "Semantic HTML landmarks and ARIA labels for navigation landmarks.",
  "accessibility.reducedMotion":
    "Reduced-motion preference respected for animations.",
  "accessibility.contrast":
    "Sufficient color contrast for body text on light backgrounds.",
  "accessibility.arabicText":
    "Arabic text uses a dedicated Quran font; script rendering may vary across screen readers. We are actively improving Arabic screen-reader support.",
  "accessibility.barrier":
    "If you encounter an accessibility barrier, use the ",
  "accessibility.report": "Report an issue",

  "sourcesPage.title": "Sources & provenance",
  "sourcesPage.description":
    "Every verse shown here traces to a recorded source with attribution, license, and a stable package version.",
  "sourcesPage.catalog": "Source catalog",
  "sourcesPage.visitSource": "Visit source",
  "sourcesPage.licenseTerms": "License terms",
  "sourcesPage.methodology": "Editorial methodology",
  "sourcesPage.pinnedPackage":
    "Content arrives only as a pinned, versioned npm package.",
  "sourcesPage.everySource":
    "Every source — packaged dataset, tafsir link record, or excluded source — is listed with its attribution.",
  "sourcesPage.topicPages":
    "Topic pages are editorial selections of well-known ayat — entry points for study, not tafsir.",
  "sourcesPage.relationship":
    "Each relationship carries a typed relationship kind and its review status.",
  "sourcesPage.publicationState":
    "The publication state of every topic is shown on its topic page.",
  "sourcesPage.noReviewer":
    "No qualified scholarly reviewer has been assigned.",
  "sourcesPage.pendingReview": "pending-scholarly-review",
  "sourcesPage.reportInaccuracy":
    "Anyone can report an inaccurate verse, reference, translation, or topic selection.",
  "sourcesPage.versionedData":
    "Because all content is versioned source-of-truth data, rollback is a package change.",
  "sourcesPage.aiSafety":
    "AI safety boundary: AI answer generation is disabled.",
  "sourcesPage.quranTextNote":
    "AI must not generate Quran text, tafsir, hadith, fatwa, or scholarly consensus.",
  "sourcesPage.catalogNote":
    "This catalog is the single source of truth for attribution in this application.",

  "report.title": "Report an issue",
  "report.description":
    "For inaccuracies in verse text, topic curation, or AI answers. Reports are prepared on this device — there is no server endpoint for them.",
  "report.category": "Category",
  "report.location": "Location / URL",
  "report.details": "Details",
  "report.stepsToReproduce": "Steps to reproduce",
  "report.expectedBehaviour": "Expected behaviour",
  "report.prepareReport": "Prepare report",
  "report.copyToClipboard": "Copy to clipboard",
  "report.downloadAsFile": "Download as file",
  "report.emailReport": "Email this report",
  "report.noAddress":
    "No delivery address is configured for this deployment (set NEXT_PUBLIC_REPORT_EMAIL to enable email delivery). Copy or download the report instead.",
  "report.locationPlaceholder": "e.g. /quran/al-baqarah or https://...",
  "report.detailsPlaceholder":
    "Describe the issue as precisely as possible. Include references (surah:ayah) if relevant.",
  "report.stepsPlaceholder": "What did you do?",
  "report.expectedPlaceholder": "What should have happened?",
  "report.copied": "Report copied to clipboard",
  "report.couldNotCopy": "Could not copy",
  "report.openingEmail": "Opening your email app",
  "report.downloaded": "Report downloaded",

  "onboarding.title": "Welcome to Al-Huda",
  "onboarding.description":
    "Choose your learning goal to get started with personalized Quran study paths.",

  "errors.somethingWrong": "Something went wrong",
  "errors.readingUnavailable": "Reading is unavailable right now",
  "errors.bodyText":
    "The verse text for this page could not be loaded. This is a display problem, not a problem with the Quran text itself.",
  "errors.reference": "Reference:",

  "notFound.title": "Not found",
  "notFound.description": "That reference is not in the Quran",
  "notFound.bodyText":
    "The Quran has 114 surahs, and each surah has a fixed number of ayat. The address you followed does not match any of them.",
  "notFound.browseSurahs": "Browse all 114 surahs",
  "notFound.searchInstead": "Search instead",

  "pagination.aria": "pagination",
  "pagination.previous": "Go to previous page",
  "pagination.next": "Go to next page",

  "breadcrumb.aria": "breadcrumb",
  "breadcrumb.home": "Home",

  "languageSelector.label": "Language",
  "languageSelector.aria": "Choose interface language",
  "languageSelector.title": "Interface language",
  "languageSelector.choose": "Choose a language",

  "metadata.homeTitle": "{site} — {tagline}",
  "metadata.homeDescription":
    "Read the Quran in Uthmani script with translations in 100+ languages, stable ayah references, search, and curated topic entry points.",
  "metadata.quranTitle": "Quran",
  "metadata.quranDescription":
    "Every surah, in canonical order, with its Arabic name and verse count.",
  "metadata.discoverTitle": "Discover — Your Quran Learning Hub",
  "metadata.discoverDescription":
    "Learning paths, broad themes, dimensions, and search: find your starting point.",
  "metadata.exploreTitle": "Explore — 10 Dimensions of the Quran",
  "metadata.exploreDescription":
    "Discover the Quran through ten life dimensions and curated topics.",
  "metadata.topicsTitle": "Topics",
  "metadata.topicsDescription":
    "Editorial entry points that group well-known verses by theme.",
  "metadata.domainsTitle": "Domains — Quran Exploration Areas",
  "metadata.domainsDescription":
    "Broad subject areas for editorial planning, distinct from dimensions.",
  "metadata.graphTitle": "Knowledge Graph Explorer",
  "metadata.graphDescription":
    "See how dimensions connect to topics, and how topics relate to one another.",
  "metadata.searchTitle": "Search the Quran",
  "metadata.searchDescription":
    "Find verses by reference, Arabic text, translation, or topic.",
  "metadata.settingsTitle": "Settings",
  "metadata.settingsDescription":
    "Reader preferences and interface language, stored only on this device.",
  "metadata.privacyTitle": "Privacy policy",
  "metadata.privacyDescription":
    "How this application handles your data — locally, without accounts or analytics.",
  "metadata.termsTitle": "Terms of use",
  "metadata.termsDescription":
    "Terms for using this Quran reading application.",
  "metadata.aboutTitle": "About — {site}",
  "metadata.aboutDescription":
    "About the calm, source-first Quran reading hub.",
  "metadata.accessibilityTitle": "Accessibility statement",
  "metadata.accessibilityDescription":
    "Accessibility commitments for this application.",
  "metadata.sourcesTitle": "Sources & provenance",
  "metadata.sourcesDescription":
    "Recorded sources, licenses, and attribution for every verse shown.",
  "metadata.reportTitle": "Report a problem",
  "metadata.reportDescription":
    "Report inaccuracies in verse text, topic curation, or AI answers.",
  "metadata.learnTitle": "Learn",
  "metadata.learnDescription": "Personalized Quran learning dashboard.",
  "metadata.notFoundTitle": "Not found",
  "metadata.errorTitle": "Something went wrong",

  "counts.steps": { one: "{count} step", other: "{count} steps" },
  "counts.verses": { one: "{count} verse", other: "{count} verses" },
  "counts.ayat": { one: "{count} ayah", other: "{count} ayat" },
  "counts.suggestions": {
    one: "{count} suggestion available",
    other: "{count} suggestions available",
  },
  "counts.references": {
    one: "{count} reference",
    other: "{count} references",
  },
  "counts.topics": { one: "{count} topic", other: "{count} topics" },
  "counts.domains": { one: "{count} domain", other: "{count} domains" },
  "counts.dimensions": {
    one: "{count} dimension",
    other: "{count} dimensions",
  },
  "counts.results": { one: "{count} result", other: "{count} results" },
  "counts.notes": { one: "{count} note", other: "{count} notes" },
  "counts.bookmarks": {
    one: "{count} bookmark",
    other: "{count} bookmarks",
  },
  "counts.translations": {
    one: "{count} translation",
    other: "{count} translations",
  },
  "counts.questions": {
    one: "{count} question",
    other: "{count} questions",
  },
  "counts.paths": { one: "{count} path", other: "{count} paths" },
  "counts.reviews": { one: "{count} review", other: "{count} reviews" },
  "counts.days": { one: "{count} day", other: "{count} days" },

  "settings.subtitle": "Reader preferences stored only on this device.",
  "settings.arabicSize": "Arabic text size",
  "settings.arabicSizeDesc": "Affects Uthmani Arabic in readers and topic pages.",
  "settings.arabicSizeLabel": "Text size: {size}",
  "settings.sizeSmall": "small",
  "settings.sizeMedium": "medium",
  "settings.sizeLarge": "large",
  "settings.sizeExtraLarge": "extra large",
  "settings.lineSpacing": "Line spacing",
  "settings.lineSpacingDesc": "Adjust vertical spacing between Arabic lines.",
  "settings.lineSpacingLabel": "Line spacing: {spacing}",
  "settings.arabicPreview": "Preview of Arabic size",
  "settings.translationEdition": "Translation edition",
  "settings.translationEditionDesc": "Choose from 100+ translations in 50+ languages. Default: Urdu (Jalandhry).",
  "settings.showTranslation": "Show translation",
  "settings.showTranslationDesc": "Toggle translation visibility. The selected edition is shown above.",
  "settings.showTransliteration": "Show transliteration",
  "settings.showTransliterationDesc": "Only for reading aid; never a substitute for Arabic text.",
  "settings.audioRecitation": "Audio recitation",
  "settings.audioRecitationDesc": "Show a Listen button under each verse. Audio streams only when you press play.",
  "settings.audioSource": "Verse-by-verse MP3s from the Islamic Network CDN (everyayah.com recordings), streamed at 64 kbps.",
  "settings.parallelMode": "Compare translations side by side",
  "settings.parallelModeDesc": "Show up to {count} extra translations beneath the primary edition.",
  "settings.parallelMaxReached": "Maximum of {count} additional translations reached. Remove one to add another.",
  "settings.parallelMemory": "Each edition downloads once per session and is held in memory — roughly 1.5 MB per translation.",
  "settings.localDataWarning": "Local storage is not a backup.",
  "settings.localDataWarningDesc": "Because nothing is uploaded, there is no server copy to restore from. Clearing site data or cookies, browsing in a private or incognito window, switching browser or device, or uninstalling the browser will erase these preferences, your library, and your revision plan. Use Export backup first if you want to keep them.",

  "home.heroTitle": "Read the Quran with its sources in plain view",
  "home.heroDescription": "Uthmani text, translations in 100+ languages (default: Urdu — Jalandhry), stable references you can share, and calm search — no clutter, no streaks, nothing unattributed.",
  "home.searchHint": "Try \"2:255\", \"baqarah 153\", \"patience\", or Arabic text.",
  "home.discoverLink": "Or discover a guided starting point",
  "home.attributedHeading": "Every verse is attributed",
  "home.attributedDescription": "Arabic text, translation, and transliteration each carry a license, publisher, and version you can inspect on the Sources page.",
  "home.reviewSources": "Review sources",
  "home.startReading": "Start reading",
  "home.featuredSurahsDescription": "Common entry points — or browse all 114 surahs.",
  "home.allSurahs": "All surahs",
  "home.ayat": "ayat",
  "home.exploreByDimension": "Explore by dimension",
  "home.dimensionsDescription": "Ten life dimensions — spiritual, personal, family, and more — as entry points for reflection.",
  "home.allDimensions": "All dimensions",
  "home.exploreByTopic": "Explore by topic",
  "home.topicsDescription": "Editorial entry points with review status — not tafsir.",
  "home.allTopics": "All topics",
} as const;

export type TranslationKey = keyof typeof en;