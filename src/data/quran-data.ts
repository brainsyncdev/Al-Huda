import { Surah, Ayah, Translation, TafsirEntry } from '@/types/quran';

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