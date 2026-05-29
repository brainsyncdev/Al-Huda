"use client";

export interface QuizQuestion {
  id: number;
  question: string;
  questionUrdu: string;
  options: string[];
  correct: number;
  explanation: string;
  explanationUrdu: string;
  category: string;
  source?: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Quran Basics
  {
    id: 1,
    question: "How many Surahs (chapters) are in the Holy Quran?",
    questionUrdu: "قرآن میں کتنی سورتیں ہیں؟",
    options: ["114", "112", "118", "110"],
    correct: 0,
    explanation: "The Holy Quran contains 114 Surahs (chapters) and 6236 verses (Ayahs).",
    explanationUrdu: "قرآن مجید میں 114 سورتیں اور 6236 آیتیں ہیں۔",
    category: "Quran Basics",
    source: "Universal Islamic Knowledge"
  },
  {
    id: 2,
    question: "Which Surah is known as 'The Heart of the Quran'?",
    questionUrdu: "کون سی سورت کو 'قرآن کا دل' کہتے ہیں؟",
    options: ["Al-Baqarah", "Al-Fatiha", "Ya-Sin", "Al-Ikhlas"],
    correct: 2,
    explanation: "Surah Ya-Sin (36) is often called 'Qulhu al-Qalb' (Heart of the Quran) because it contains the essence of Islamic faith.",
    explanationUrdu: "سورت یاسین (36) کو قرآن کا دل کہتے ہیں کیونکہ اس میں ایمان کا خلاصہ ہے۔",
    category: "Quran Basics"
  },
  {
    id: 3,
    question: "Which Surah is equal to one-third of the Quran in reward?",
    questionUrdu: "کون سی سورت کا ثواب قرآن کے ایک تہائی کے برابر ہے؟",
    options: ["Al-Fatiha", "Al-Ikhlas", "Al-Falaq", "Al-Nas"],
    correct: 1,
    explanation: "Surah Al-Ikhlas (112) is equal to one-third of the Quran in reward. The Prophet ﷺ said so in an authentic hadith.",
    explanationUrdu: "سورت اخلاص (112) کا ثواب قرآن کے ایک تہائی کے برابر ہے۔",
    category: "Quran Basics"
  },
  {
    id: 4,
    question: "Which Surah begins with 'Alif Lam Mim' (الم)?",
    questionUrdu: "کون سی سورت 'الم' سے شروع ہوتی ہے؟",
    options: ["Al-Baqarah", "Aal-Imran", "Al-An'am", "All of the above"],
    correct: 3,
    explanation: "Several Surahs begin with Muqatta'at (disjointed letters) including Al-Baqarah, Aal-Imran, Al-An'am, and others.",
    explanationUrdu: "متعدد سورتیں مقطعات الحروف سے شروع ہوتی ہیں جن میں البقرہ، آل عمران، الانعام اور دیگر شامل ہیں۔",
    category: "Quran Basics"
  },
  {
    id: 5,
    question: "Which Surah has no Bismillah at the beginning?",
    questionUrdu: "کون سی سورت کے شروع میں بسم اللہ نہیں ہے؟",
    options: ["At-Tawbah", "An-Naml", "Al-Hajj", "Al-Muddaththir"],
    correct: 0,
    explanation: "Surah At-Tawbah (9) is the only Surah that does not begin with Bismillah. Some scholars say this is because it begins with a declaration of disassociation from shirk.",
    explanationUrdu: "سورت توبہ (9) واحد سورت ہے جس کے شروع میں بسم اللہ نہیں ہے۔",
    category: "Quran Basics"
  },
  
  // Prophets
  {
    id: 6,
    question: "How many prophets are mentioned in the Quran?",
    questionUrdu: "قرآن میں کتنے prophets کا ذکر ہے؟",
    options: ["25", "26", "28", "30"],
    correct: 0,
    explanation: "25 prophets are mentioned by name in the Quran. The Quran mentions 25 prophets: Adam, Idris, Nuh, Hud, Salih, Ibrahim, Lut, Ismail, Ishaq, Ya'qub, Yusuf, Shuayb, Ayyub, Dhul-Kifl, Yunus, Harun, Dawud, Sulayman, Ilyas, Al-Yasa, Zakariyya, Yahya, Isa, Muhammad (ﷺ) and others.",
    explanationUrdu: "قرآن میں 25 prophets کا ذکر ہے۔",
    category: "Prophets"
  },
  {
    id: 7,
    question: "Which prophet was swallowed by a whale?",
    questionUrdu: "کونے نبی کو مچھلی نے نگلا تھا؟",
    options: ["Prophet Yunus (AS)", "Prophet Nuh (AS)", "Prophet Ayyub (AS)", "Prophet Ibrahim (AS)"],
    correct: 0,
    explanation: "Prophet Yunus (AS) was swallowed by a whale. He called upon Allah from the darkness of the whale's belly and was saved.",
    explanationUrdu: "حضرت یونس (علیہ السلام) کو مچھلی نے نگلا تھا۔ انہوں نے مچھلی کے پیٹ کے اندھیرے سے اللہ کو پکارا اور بچا لیا گیا۔",
    category: "Prophets"
  },
  {
    id: 8,
    question: "Which prophet's name is mentioned 4 times in Bismillah?",
    questionUrdu: "کس نبی کا نام بسم اللہ میں 4 بار آیا ہے؟",
    options: ["Prophet Ibrahim (AS)", "Prophet Musa (AS)", "Prophet Isa (AS)", "Prophet Muhammad (ﷺ)"],
    correct: 0,
    explanation: "Prophet Ibrahim (AS) is mentioned 4 times in Bismillah: 'Allah', 'Ar-Rahman', 'Ar-Rahim', and 'Maliki Yaumid Din' all relate to Ibrahim's mission.",
    explanationUrdu: "حضرت ابراہیم (علیہ السلام) کا تذکرہ بسم اللہ میں 4 بار ہوتا ہے۔",
    category: "Prophets"
  },
  
  // Hadith
  {
    id: 9,
    question: "What is the first hadith in Sahih Bukhari?",
    questionUrdu: "صحیح بخاری میں پہلی حدیث کیا ہے؟",
    options: [
      "Actions are by intentions",
      "Seeking knowledge is obligatory",
      "Cleanliness is half of faith",
      "All deeds are judged by intention"
    ],
    correct: 0,
    explanation: "The first hadith in Sahih Bukhari is about intentions. Ibn Umar narrated that the Prophet ﷺ said: 'Actions are but by intentions.'",
    explanationUrdu: "صحیح بخاری میں پہلی حدیث نیتوں کے بارے میں ہے۔ رسول اللہ ﷺ نے فرمایا: 'اعمال کا دارومدار نیتوں پر ہے۔'",
    category: "Hadith"
  },
  {
    id: 10,
    question: "Which hadith states: 'The strong is not one who wrestles, but the strong is one who controls himself when angry'?",
    questionUrdu: "کون سی حدیث میں ہے: 'زوردار وہ نہیں جو کشتی لڑے بلکہ زوردار وہ ہے جو غصے میں قابو پالے'؟",
    options: ["Sahih Bukhari", "Sahih Muslim", "Jami` at-Tirmidhi", "Sunan Abu Dawud"],
    correct: 0,
    explanation: "This hadith is narrated in Sahih Bukhari. Abu Hurairah reported the Prophet ﷺ said this about true strength being self-control.",
    explanationUrdu: "یہ حدیث صحیح بخاری میں ہے۔ ابو ہریرہ رضی اللہ عنہ نے بیان کیا کہ نبی کریم ﷺ نے فرمایا: 'زوردار وہ نہیں جو کشتی لڑے...'",
    category: "Hadith"
  },
  
  // Islamic History
  {
    id: 11,
    question: "In which year was the Prophet Muhammad ﷺ born?",
    questionUrdu: "نبی کریم ﷺ کس سال پیدا ہوئے؟",
    options: ["570 CE", "571 CE", "569 CE", "572 CE"],
    correct: 0,
    explanation: "Prophet Muhammad ﷺ was born in the Year of the Elephant, 570 CE, in Makkah al-Mukarramah.",
    explanationUrdu: "نبی کریم ﷺ ہاتھی کے سال 570 عیسوی مکہ مکرمہ میں پیدا ہوئے۔",
    category: "Islamic History"
  },
  {
    id: 12,
    question: "What was the first battle in Islam called?",
    questionUrdu: "اسلام کی پہلی جنگ کا کیا نام تھا؟",
    options: ["Battle of Badr", "Battle of Uhud", "Battle of Khandaq", "Battle of Hunain"],
    correct: 0,
    explanation: "Battle of Badr was the first major battle in Islamic history, fought on 17 Ramadan 2 AH.",
    explanationUrdu: "غزوہ بدر اسلام کی پہلی بڑی جنگ تھی جو 17 رمضان 2 ہجری کو ہوئی۔",
    category: "Islamic History"
  },
  
  // Pillars
  {
    id: 13,
    question: "How many pillars of Islam are there?",
    questionUrdu: "اسلام کے کتنے ارکان ہیں؟",
    options: ["5", "6", "7", "4"],
    correct: 0,
    explanation: "There are 5 pillars of Islam: Shahadah, Salah, Zakat, Sawm, and Hajj.",
    explanationUrdu: "اسلام کے 5 رکن ہیں: شہادت، نماز، زکوٰۃ، روزہ اور حج۔",
    category: "Pillars of Islam"
  },
  {
    id: 14,
    question: "What is the 3rd pillar of Islam?",
    questionUrdu: "اسلام کا تیسرا رکن کیا ہے؟",
    options: ["Zakat", "Salah", "Sawm", "Hajj"],
    correct: 0,
    explanation: "The third pillar is Zakat (obligatory charity). It purifies wealth and helps the poor.",
    explanationUrdu: "تیسرا رکن زکوٰۃ ہے جو دولت کو پاک کرتی ہے اور غریبوں کی مدد کرتی ہے۔",
    category: "Pillars of Islam"
  },
  
  // Quran Verses
  {
    id: 15,
    question: "Which verse is known as 'Ayat al-Kursi'?",
    questionUrdu: "کون سی آیت کو 'آیت الکرسی' کہتے ہیں؟",
    options: ["Surah Al-Baqarah:255", "Surah Al-Baqarah:284", "Surah Al-Fatiha:1", "Surah Al-Ikhlas:1"],
    correct: 0,
    explanation: "Ayat al-Kursi is Surah Al-Baqarah verse 255. It is the greatest verse in the Quran.",
    explanationUrdu: "آیت الکرسی سورہ بقرہ کی آیت 255 ہے۔ یہ قرآن کی سب سے بڑی آیت ہے۔",
    category: "Quran Verses"
  },
  {
    id: 16,
    question: "Which Surah should be recited on Friday?",
    questionUrdu: "جمعہ کے دن کون سی سورت پڑھنی چاہیے؟",
    options: ["Al-Kahf", "Al-Mulk", "Ya-Sin", "Al-A'la"],
    correct: 0,
    explanation: "Surah Al-Kahf should be recited on Friday. The Prophet ﷺ said whoever recites it on Friday will have light until the next Friday.",
    explanationUrdu: "سورہ کہف جمعہ کو پڑھنی چاہیے۔ نبی ﷺ نے فرمایا جو اسے جمعہ کو پڑھے گا اسے اگلے جمعہ تک روشنی ملے گی۔",
    category: "Quran Verses"
  }
];

export const quizCategories = [
  { id: "all", name: "All Questions", icon: "📚" },
  { id: "Quran Basics", name: "Quran Basics", icon: "📖" },
  { id: "Prophets", name: "Prophets", icon: "✉️" },
  { id: "Hadith", name: "Hadith", icon: "💬" },
  { id: "Islamic History", name: "History", icon: "🏛️" },
  { id: "Pillars", name: "Pillars of Islam", icon: "🕌" },
];