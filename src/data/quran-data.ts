import { Surah, Ayah, Translation, TafsirEntry, Theme, Story, Hadith, RootWord } from '@/types/quran';

export const surahs: Surah[] = [
  { id: 1, nameArabic: 'الفاتحة', nameUrdu: 'الفاتحہ', transliteration: 'Al-Fatiha', meaningUrdu: 'افتتاح', meaningEnglish: 'The Opening', revelationType: 'meccan', totalVerses: 7, juzStart: 1, orderRevealed: 5 },
  { id: 2, nameArabic: 'البقرة', nameUrdu: 'البقرہ', transliteration: 'Al-Baqarah', meaningUrdu: 'گائے', meaningEnglish: 'The Cow', revelationType: 'medinan', totalVerses: 286, juzStart: 1, orderRevealed: 87 },
  { id: 3, nameArabic: 'آل عمران', nameUrdu: 'آل عمران', transliteration: 'Aal-E-Imran', meaningUrdu: 'عمران کا خاندان', meaningEnglish: 'The Family of Imran', revelationType: 'medinan', totalVerses: 200, juzStart: 3, orderRevealed: 89 },
  { id: 36, nameArabic: 'يس', nameUrdu: 'یس', transliteration: 'Ya-Sin', meaningUrdu: 'یاسین', meaningEnglish: 'Ya Sin', revelationType: 'meccan', totalVerses: 83, juzStart: 22, orderRevealed: 41 },
  { id: 55, nameArabic: 'الرحمن', nameUrdu: 'الرحمٰن', transliteration: 'Ar-Rahman', meaningUrdu: 'بڑا مہربان', meaningEnglish: 'The Beneficent', revelationType: 'medinan', totalVerses: 78, juzStart: 27, orderRevealed: 97 },
  { id: 67, nameArabic: 'الملك', nameUrdu: 'المُلک', transliteration: 'Al-Mulk', meaningUrdu: 'بادشاہت', meaningEnglish: 'The Sovereignty', revelationType: 'meccan', totalVerses: 30, juzStart: 29, orderRevealed: 77 },
  { id: 112, nameArabic: 'الإخلاص', nameUrdu: 'اخلاص', transliteration: 'Al-Ikhlas', meaningUrdu: 'خالص', meaningEnglish: 'Sincerity', revelationType: 'meccan', totalVerses: 4, juzStart: 30, orderRevealed: 22 },
  { id: 114, nameArabic: 'الناس', nameUrdu: 'ناس', transliteration: 'An-Nas', meaningUrdu: 'لوگ', meaningEnglish: 'Mankind', revelationType: 'meccan', totalVerses: 6, juzStart: 30, orderRevealed: 21 },
];

export const ayahsData: Record<number, Ayah[]> = {
  1: [
    { id: 1, surahId: 1, ayahNumber: 1, arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', arabicClean: 'بسم الله الرحمن الرحيم', juz: 1, page: 1, sajda: false, globalIndex: 1 },
    { id: 2, surahId: 1, ayahNumber: 2, arabicText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', arabicClean: 'الحمد لله رب العالمين', juz: 1, page: 1, sajda: false, globalIndex: 2 },
    { id: 3, surahId: 1, ayahNumber: 3, arabicText: 'الرَّحْمَٰنِ الرَّحِيمِ', arabicClean: 'الرحمن الرحيم', juz: 1, page: 1, sajda: false, globalIndex: 3 },
    { id: 4, surahId: 1, ayahNumber: 4, arabicText: 'مَالِكِ يَوْمِ الدِّينِ', arabicClean: 'مالك يوم الدين', juz: 1, page: 1, sajda: false, globalIndex: 4 },
    { id: 5, surahId: 1, ayahNumber: 5, arabicText: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', arabicClean: 'إياك نعبد وإياك نستعين', juz: 1, page: 1, sajda: false, globalIndex: 5 },
    { id: 6, surahId: 1, ayahNumber: 6, arabicText: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', arabicClean: 'اهدنا الصراط المستقيم', juz: 1, page: 1, sajda: false, globalIndex: 6 },
    { id: 7, surahId: 1, ayahNumber: 7, arabicText: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', arabicClean: 'صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين', juz: 1, page: 1, sajda: false, globalIndex: 7 },
  ],
  2: [
    { id: 8, surahId: 2, ayahNumber: 1, arabicText: 'الم', arabicClean: 'الم', juz: 1, page: 1, sajda: false, globalIndex: 8 },
    { id: 255, surahId: 2, ayahNumber: 255, arabicText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', arabicClean: 'الله لا إله إلا هو الحي القيوم', juz: 3, page: 42, sajda: false, globalIndex: 262 },
  ],
};

export const translationsData: Record<number, Translation[]> = {
  1: [
    { id: 1, ayahId: 1, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'نام اللہ کا جو بڑا مہربان نہایت رحم والا ہے', sourceVerified: true, scholarApproved: true },
    { id: 2, ayahId: 2, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'سب تعریف اللہ ہی کے لیے ہے جو تمام جہانوں کا پالنے والا ہے', sourceVerified: true, scholarApproved: true },
    { id: 3, ayahId: 3, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'بڑا مہربان نہایت رحم والا', sourceVerified: true, scholarApproved: true },
    { id: 4, ayahId: 4, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'قیامت کے دن کا بادشاہ', sourceVerified: true, scholarApproved: true },
    { id: 5, ayahId: 5, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'صرف تجھے ہی پوجتے ہیں اور صرف تجھے ہی مدد مانگتے ہیں', sourceVerified: true, scholarApproved: true },
    { id: 6, ayahId: 6, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'ہمیں سیدھی راہ دکھا', sourceVerified: true, scholarApproved: true },
    { id: 7, ayahId: 7, language: 'ur', translator: 'Fateh Muhammad Jalandhari', translation: 'جن لوگوں پر تو نے انعام کیا ہے ان کی راہ جو ناراض نہیں ہوئے اور نہ گمراہ ہوئے', sourceVerified: true, scholarApproved: true },
  ],
};

export const tafsirData: Record<number, TafsirEntry[]> = {
  1: [
    {
      id: 1,
      ayahId: 1,
      scholar: 'Ibn Kathir',
      workName: 'Tafsir al-Quran al-Azeem',
      language: 'ur',
      level: 'simple',
      content: 'اس آیت میں اللہ تعالیٰ نے اپنی رحمت کا ذکر فرمایا ہے جو اس کے نام کے ساتھ وابستہ ہے',
      contentUrdu: 'اس آیت میں اللہ تعالیٰ نے اپنی رحمت کا ذکر فرمایا ہے جو اس کے نام کے ساتھ وابستہ ہے۔ بسم اللہ کا مطلب ہے اللہ کے نام سے شروع کرتا ہوں اور الرحمن الرحیم اللہ کے دو نام ہیں جن میں سے پہلا عام رحمت کا اور دوسرا خاص رحمت کا حامل ہے۔',
      sourceRef: 'Ibn Kathir, Tafsir, Vol 1',
      refUrl: 'https://quran.com/1:1',
      scholarApproved: true,
    },
  ],
};

export const themes: Theme[] = [
  { id: 1, nameUrdu: 'صبر', nameEnglish: 'Patience', nameArabic: 'الصبر', descriptionUrdu: 'مشکلات میں ثابت قدم رہنا', icon: '🫠', totalAyaat: 90 },
  { id: 2, nameUrdu: 'رحمت', nameEnglish: 'Mercy', nameArabic: 'الرحمة', descriptionUrdu: 'اللہ کی بے انتہا رحمت', icon: '💚', totalAyaat: 338 },
  { id: 3, nameUrdu: 'ایمان', nameEnglish: 'Faith', nameArabic: 'الإيمان', descriptionUrdu: 'اللہ پر یقین و اعتقاد', icon: '✨', totalAyaat: 150 },
  { id: 4, nameUrdu: 'شکر', nameEnglish: 'Gratitude', nameArabic: 'الشكر', descriptionUrdu: 'اللہ کے انعامات کا شکر', icon: '🤲', totalAyaat: 65 },
  { id: 5, nameUrdu: 'توکل', nameEnglish: 'Trust in Allah', nameArabic: 'التوكل', descriptionUrdu: 'اللہ پر بھروسہ', icon: '🌟', totalAyaat: 45 },
  { id: 6, nameUrdu: 'عدل', nameEnglish: 'Justice', nameArabic: 'العدل', descriptionUrdu: 'انصاف اور دیانت داری', icon: '⚖️', totalAyaat: 78 },
  { id: 7, nameUrdu: 'علم', nameEnglish: 'Knowledge', nameArabic: 'العلم', descriptionUrdu: 'اللہ کی نشانیوں کا علم', icon: '📚', totalAyaat: 854 },
  { id: 8, nameUrdu: 'تقویٰ', nameEnglish: 'Piety', nameArabic: 'التقوى', descriptionUrdu: 'اللہ کا خوف', icon: '🌿', totalAyaat: 56 },
];

export const stories: Story[] = [
  { id: 1, prophetNameUr: 'یوسف', prophetNameAr: 'يوسف', titleUr: 'حضرت یوسف علیہ السلام کی کہانی', totalEpisodes: 10, ageRange: '3-12', difficulty: 1, mainLessonUr: 'صبر اور اعتماد' },
  { id: 2, prophetNameUr: 'نوح', prophetNameAr: 'نوح', titleUr: 'حضرت نوح علیہ السلام کی کہانی', totalEpisodes: 8, ageRange: '3-12', difficulty: 1, mainLessonUr: 'استقامت' },
  { id: 3, prophetNameUr: 'ابراہیم', prophetNameAr: 'إبراهيم', titleUr: 'حضرت ابراہیم علیہ السلام کی کہانی', totalEpisodes: 9, ageRange: '3-12', difficulty: 1, mainLessonUr: 'ایمان کی مضبوطی' },
  { id: 4, prophetNameUr: 'موسیٰ', prophetNameAr: 'موسى', titleUr: 'حضرت موسیٰ علیہ السلام کی کہانی', totalEpisodes: 12, ageRange: '3-12', difficulty: 2, mainLessonUr: 'قیادت اور ایمان' },
  { id: 5, prophetNameUr: 'یونس', prophetNameAr: 'يونس', titleUr: 'حضرت یونس علیہ السلام کی کہانی', totalEpisodes: 5, ageRange: '3-12', difficulty: 1, mainLessonUr: 'توبہ اور نئی شروعات' },
];

export const hadiths: Hadith[] = [
  {
    id: 1,
    collection: 'Sahih al-Bukhari',
    collectionSlug: 'bukhari',
    bookNumber: 1,
    hadithNumber: 1,
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    urduText: 'اعمال کا دارومدار نیتوں پر ہے',
    englishText: 'Actions are but by intentions',
    grade: 'sahih',
    narrator: 'Umar ibn al-Khattab (RA)',
    refUrl: 'https://sunnah.com/bukhari:1',
  },
  {
    id: 2,
    collection: 'Sahih al-Bukhari',
    collectionSlug: 'bukhari',
    bookNumber: 8,
    hadithNumber: 47,
    arabicText: 'مَنْ حَفِظَ عَلَى أَصْحَابِهِ حَفِظَهُ اللَّهُ',
    urduText: 'جو اپنے ساتھیوں کی عزت کرے گا اللہ اس کی عزت کرے گا',
    englishText: 'Whoever safeguards his companions, Allah will safeguard him',
    grade: 'sahih',
    narrator: 'Abu Hurairah (RA)',
    refUrl: 'https://sunnah.com/bukhari:47',
  },
];

export const rootWords: RootWord[] = [
  { id: 1, rootArabic: 'ص-ب-ر', rootMeaningUrdu: 'صبر', rootMeaningEnglish: 'Patience', quranFrequency: 90, difficultyLevel: 1 },
  { id: 2, rootArabic: 'ر-ح-م', rootMeaningUrdu: 'رحمت', rootMeaningEnglish: 'Mercy', quranFrequency: 338, difficultyLevel: 1 },
  { id: 3, rootArabic: 'ع-ل-م', rootMeaningUrdu: 'علم', rootMeaningEnglish: 'Knowledge', quranFrequency: 854, difficultyLevel: 2 },
  { id: 4, rootArabic: 'ش-ک-ر', rootMeaningUrdu: 'شکر', rootMeaningEnglish: 'Gratitude', quranFrequency: 65, difficultyLevel: 1 },
  { id: 5, rootArabic: 'ا-ی-م-ن', rootMeaningUrdu: 'ایمان', rootMeaningEnglish: 'Faith', quranFrequency: 150, difficultyLevel: 2 },
];

// Helper functions
export function getSurah(id: number): Surah | undefined {
  return surahs.find(s => s.id === id);
}

export function getAyahs(surahId: number): Ayah[] {
  return ayahsData[surahId] || [];
}

export function getTranslation(ayahId: number, language: string = 'ur'): Translation | undefined {
  for (const translations of Object.values(translationsData)) {
    const found = translations.find(t => t.ayahId === ayahId && t.language === language);
    if (found) return found;
  }
  return undefined;
}

export function getTafsir(ayahId: number): TafsirEntry | undefined {
  for (const tafsirs of Object.values(tafsirData)) {
    const found = tafsirs.find(t => t.ayahId === ayahId);
    if (found) return found;
  }
  return undefined;
}