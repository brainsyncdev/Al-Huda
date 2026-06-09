"use client";

export interface Hadith {
  id: number;
  book: string;
  bookArabic: string;
  hadithNumber: number;
  arabic: string;
  transliteration: string;
  translation: string;
  urduTranslation: string;
  category: string;
  narrator?: string;
  grade: string;
  collectionSlug: string;
  benefits: string[];
  source?: string;
}

export const authenticHadiths: Hadith[] = [
  {
    id: 1,
    book: "Sahih Bukhari",
    bookArabic: "صحیح بخاری",
    hadithNumber: 1,
    arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    transliteration: "Innamal a'maalu binniyyaat",
    translation: "Actions are but by intentions and every person will be rewarded according to their intention.",
    urduTranslation: "اعمال کا دارومدار نیتوں پر ہے",
    category: "Foundations of Islam",
    narrator: "Umar ibn al-Khattab (RA)",
    grade: "sahih",
    collectionSlug: "bukhari",
    benefits: [
      "The foundation of Islam is based on intention",
      "All deeds are judged by their intention"
    ],
    source: "Sahih Bukhari, Hadith #1"
  },
  {
    id: 2,
    book: "Sahih Bukhari",
    bookArabic: "صحیح بخاری",
    hadithNumber: 8,
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا أَنَّ الْحَارِثَ بْنَ هِشَامٍ رَضِيَ اللَّهُ عَنْهُ سَأَلَ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
    transliteration: "Ahyaanan ya'tiini mithla salasalati al-jarasi",
    translation: "Sometimes the revelation comes to me like the ringing of a bell...",
    urduTranslation: "کبھی وحی مجھ پر گھنٹی کی آواز کی طرح آتی ہے...",
    category: "Revelation",
    narrator: "Aisha (RA)",
    grade: "sahih",
    collectionSlug: "bukhari",
    benefits: ["Revelation is a physical experience for the Prophet ﷺ"],
    source: "Sahih Bukhari, Hadith #8"
  },
  {
    id: 3,
    book: "Sahih Muslim",
    bookArabic: "صحیح مسلم",
    hadithNumber: 1,
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ حَسُنَ إِسْلَامُهُ لَمْ يُلَمْ عَلَى زَلَّةٍ",
    transliteration: "Man hasuna islaamahu lam yulam 'alaa zallatin",
    translation: "Whoever sincerely embraces Islam, their past mistakes are forgiven.",
    urduTranslation: "جس کا اسلام اچھا ہو اس کی پہلی غلطیاں معاف کر دی جاتی ہیں۔",
    category: "Mercy",
    narrator: "Abu Hurairah (RA)",
    grade: "sahih",
    collectionSlug: "muslim",
    benefits: ["Sincere conversion washes away all previous sins"],
    source: "Sahih Muslim, Hadith #1"
  },
  {
    id: 4,
    book: "Riyad as-Salihin",
    bookArabic: "ریاض الصالحین",
    hadithNumber: 256,
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    transliteration: "Laa yu'minu ahadukum hatta yuhibba li akheehi maa yuhibbu li nafsehi",
    translation: "None of you truly believes until he loves for his brother what he loves for himself.",
    urduTranslation: "تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
    category: "Love",
    narrator: "Abu Hurairah (RA)",
    grade: "sahih",
    collectionSlug: "riyad",
    benefits: ["True faith requires universal love for fellow Muslims"],
    source: "Sahih Bukhari, Hadith #13"
  },
];

export const hadithBooks = [
  { id: 1, name: "Sahih Bukhari", arabic: "صحیح بخاری", author: "Imam Bukhari", hadiths: 7563 },
  { id: 2, name: "Sahih Muslim", arabic: "صحیح مسلم", author: "Imam Muslim", hadiths: 7275 },
];

export function searchHadiths(query: string): Hadith[] {
  const lowerQuery = query.toLowerCase();
  return authenticHadiths.filter(
    h =>
      h.translation.toLowerCase().includes(lowerQuery) ||
      h.arabic.includes(query) ||
      h.category.toLowerCase().includes(lowerQuery) ||
      h.book.toLowerCase().includes(lowerQuery)
  );
}