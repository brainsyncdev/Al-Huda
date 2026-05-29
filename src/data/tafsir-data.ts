"use client";

export interface TafsirData {
  surahId: number;
  ayahNumber: number;
  tafsir IbnKathir: string;
  tafsirUrdu: string;
  tafsirEnglish: string;
  benefits: string[];
  context: string;
  relatedAyah: Array<{ surah: number; ayah: number; text: string }>;
}

export const tafsirData: TafsirData[] = [
  {
    surahId: 1,
    ayahNumber: 1,
    tafsir IbnKathir: "Allah began the Quran with Bismillah Al-Rahman Al-Raheem. This is the greatest verse in the Book of Allah, and the进门 of the Quran.",
    tafsirUrdu: "بسم اللہ تعالیٰ سے قرآن کا آغاز کرنا سنت ہے۔ اس میں اللہ تعالیٰ کی دو عظیم صفتیں بیان کی گئی ہیں: رحمن اور رحیم۔ رحمن دنیا کی رحمت ہے اور رحیم آخرت کی رحمت ہے۔",
    tafsirEnglish: "In the name of Allah, the Most Gracious, the Most Merciful. This verse is a means of seeking blessings in all acts. It contains affirmation of two of Allah's attributes: Ar-Rahman (The Entirely Merciful) and Ar-Raheem (The Especially Merciful).",
    benefits: [
      "Reciting it before any action brings barakah",
      "It is Sunnah to begin all important acts with it",
      "Contains affirmation of Allah's mercy",
      "Removes difficulties and brings ease"
    ],
    context: "This verse is the进门 of the Quran and every act of worship should begin with it. It was revealed in Makkah and contains the foundation of tawheed.",
    relatedAyah: [
      { surah: 27, ayah: 30, text: "إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" }
    ]
  },
  {
    surahId: 1,
    ayahNumber: 2,
    tafsir IbnKathir: "All praise belongs to Allah, Who created the heavens and the earth, and made darkness and light. Yet the disbelievers set up equals with their Lord.",
    tafsirUrdu: "ہر طرح کی تعریف اللہ تعالیٰ کے لیے ہے جو آسمانوں اور زمین کا پیدا کرنے والا ہے۔ اس نے اندھیری اور روشنی بنائی۔ مگر کافروں نے اپنے رب کے ساتھ شریک مقرر کیے۔",
    tafsirEnglish: "All praise is due to Allah alone, the Lord of all that exists. He created the heavens and earth in six days and established all matters. He created darkness and light, then the disbelievers ascribe equals to their Lord.",
    benefits: [
      "Acknowledging Allah as the sole Creator",
      "Understanding the purpose of creation",
      "Recognizing the balance in creation"
    ],
    context: "This verse establishes Allah's lordship over all creation. It mentions the creation of opposites - darkness and light, night and day - to show Allah's wisdom.",
    relatedAyah: [
      { surah: 6, ayah: 1, text: "الْحَمْدُ لِلَّهِ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ" }
    ]
  },
  {
    surahId: 2,
    ayahNumber: 255,
    tafsir IbnKathir: "Allah - there is no deity except Him, the Alive, the Eternal. Neither slumber nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that could intercede with Him except by His permission?",
    tafsirUrdu: "اللہ - اس کے سوا کوئی معبود نہیں، وہ زندہ ہمیشہ رہنے والا ہے۔ نیند اور کا Camargo اسے捉 نہیں کرتی۔ اسی کے پاس جو کچھ آسمانوں اور زمین میں ہے سب کچھ ہے۔ کیا اس کے سوا کوئی اس کے پاس شفاعت کر سکتا ہے؟",
    tafsirEnglish: "Ayat al-Kursi is the greatest verse in the Quran. It affirms Allah's oneness, His self-subsistence, and His authority over all creation. No one can intercede without His permission.",
    benefits: [
      "Protection from Shaytan",
      "Guarantee of Paradise for one who recites it before sleeping",
      "Contains the greatest name of Allah",
      "Affirms Allah's lordship and names"
    ],
    context: "This verse is known as Ayat al-Kursi (the Throne Verse). It was revealed in Madinah and contains the declaration of Allah's absolute sovereignty.",
    relatedAyah: [
      { surah: 20, ayah: 5, text: "الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ" },
      { surah: 57, ayah: 4, text: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ" }
    ]
  },
  {
    surahId: 112,
    ayahNumber: 1,
    tafsir IbnKathir: "Say: He is Allah, [the] One. Allah, the Eternal Refuge. He begets not, nor was He begotten. And there is none comparable to Him.",
    tafsirUrdu: "کہو: وہ اللہ ایک ہے۔ اللہ اپنی ذات پر کافی ہے۔ اس نے کسی کو پیدا نہیں کیا اور نہ ہی اسے کسی نے پیدا کیا۔ اور اس کا کوئی ہمسر نہیں۔",
    tafsirEnglish: "This Surah affirms the absolute oneness of Allah (Tawheed). It refutes the Christian concept of trinity and the pagan belief that angels are daughters of Allah. It declares that Allah is One, Eternal, without offspring or parents.",
    benefits: [
      "Equivalent to one-third of the Quran in reward",
      "Affirms absolute Tawheed",
      "Removes doubts about Allah's oneness",
      "Recommended to recite in prayer and daily life"
    ],
    context: "This Surah was revealed in Makkah and is one of the first complete Surahs revealed. It is also called Al-Ikhlas (Sincerity) because it establishes pure monotheism.",
    relatedAyah: [
      { surah: 112, ayah: 2, text: "اللَّهُ الصَّمَدُ" },
      { surah: 2, ayah: 163, text: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ" }
    ]
  },
  {
    surahId: 55,
    ayahNumber: 1,
    tafsir IbnKathir: "The Most Merciful - He has taught the Quran. He created man. He taught him speech.",
    tafsirUrdu: "نہایت مہربان نے قرآن سکھایا۔ اس نے انسان کو پیدا کیا۔ اسے بیان سکھایا۔",
    tafsirEnglish: "Ar-Rahman introduces Himself and mentions His greatest blessings: teaching the Quran, creating mankind, and teaching them speech. This Surah contains the famous response 'Lathew qaama' (Then yes).",
    benefits: [
      "Reciting it brings closeness to Allah's mercy",
      "Contains 31 verses, each mentioning Allah's blessings",
      "The response 'Lathew qaama' is obligatory for believers"
    ],
    context: "This Surah was revealed in Madinah and is unique because it repeatedly mentions Allah's blessings and each time asks 'Then which of the favors of your Lord will you deny?'",
    relatedAyah: [
      { surah: 55, ayah: 13, text: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ" }
    ]
  },
  {
    surahId: 67,
    ayahNumber: 1,
    tafsir IbnKathir: "Blessed is He in whose hand is the dominion, and He is over all things competent. He who created death and life to test you of which of you is best in deed.",
    tafsirUrdu: "پاک ہے وہ جس کے ہاتھ میں بادشاہت ہے اور وہ ہر چیز پر قادر ہے۔ جس نے موت اور زندگی پیدا کی تاکہ تمہاری آزمائش ہو کہ تم میں سے کون اعمال میں بہتر ہے۔",
    tafsirEnglish: "This Surah establishes Allah's absolute sovereignty. He alone holds dominion over everything. Life and death are not random - they are a test to determine who performs the best deeds.",
    benefits: [
      "Known as 'Al-Mulk' - the protector from Hellfire",
      "Reciting it before sleeping protects from Hellfire",
      "Contains praise of Allah's power and dominion"
    ],
    context: "This Surah was revealed in Makkah and is recommended to recite before sleeping. It emphasizes Allah's control over all affairs and the purpose of life as worship.",
    relatedAyah: [
      { surah: 67, ayah: 2, text: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ" }
    ]
  }
];

// Helper function to get tafsir for a specific verse
export function getTafsirForVerse(surahId: number, ayahNumber: number): TafsirData | undefined {
  return tafsirData.find(t => t.surahId === surahId && t.ayahNumber === ayahNumber);
}

// Get all tafsir for a surah
export function getTafsirForSurah(surahId: number): TafsirData[] {
  return tafsirData.filter(t => t.surahId === surahId);
}