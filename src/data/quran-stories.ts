"use client";

export interface QuranStory {
  id: number;
  title: string;
  titleArabic: string;
  titleUrdu: string;
  prophet: string;
  prophetArabic: string;
  summary: string;
  summaryUrdu: string;
  keyAyah: string;
  lessons: string[];
  moralLessons: string[];
}

export const quranStories: QuranStory[] = [
  {
    id: 1,
    title: "The Story of Prophet Adam (AS)",
    titleArabic: "قصة آدم عليه السلام",
    titleUrdu: "حضرت آدم کی کہانی",
    prophet: "Adam",
    prophetArabic: "آدم",
    summary: "Allah created Adam from dust and clay, breathed into him His spirit, and taught him the names of all things. The angels were commanded to prostrate to Adam, which they did except for Iblis who refused out of pride.",
    summaryUrdu: "اللہ نے حضرت آدم کو مٹی اور چینی سے پیدا کیا، ان میں اپنی روح پھونکی اور انہیں تمام چیزوں کے نام سکھائے۔ فرشتوں کو حکم دیا گیا کہ وہ آدم کو سجدہ کریں، سب نے کیا مگر ابلیس نے تکبر کی وجہ سے انکار کر دیا۔",
    keyAyah: "وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً",
    lessons: [
      "Humans were created to be Allah's vicegerents on earth",
      "Knowledge of names distinguishes humans from angels",
      "Pride is the cause of Iblis's downfall",
      "Adam repented and was forgiven"
    ],
    moralLessons: [
      "Seek knowledge to excel",
      "Avoid pride and arrogance",
      "Repentance cleanses all sins"
    ]
  },
  {
    id: 2,
    title: "The Story of Prophet Nuh (AS)",
    titleArabic: "قصة نوح عليه السلام",
    titleUrdu: "حضرت نوح کی کہانی",
    prophet: "Noah",
    prophetArabic: "نوح",
    summary: "Prophet Noah was sent to guide his people who worshipped idols. He preached for 950 years, but only a few believed. When they rejected him completely, Allah commanded him to build an ark. The flood came and destroyed the disbelievers while Noah and those who believed were saved.",
    summaryUrdu: "حضرت نوح کو اپنی قوم کی ہدایت کے لیے بھیجا گیا جو بتوں کی پوجا کرتے تھے۔ انہوں نے 950 سال تک وعظ کیا مگر صرف چند افراد نے ایمان لایا۔ جب انہوں نے بالکل مسترد کر دیا تو اللہ نے انہیں کشتی بنانے کا حکم دیا۔ سیلاب آیا اور کافروں کو ڈبویا گیا جبکہ نوح اور ایمان والے بچ گئے۔",
    keyAyah: "وَلَقَدْ نَادَانَا نُوحٌ فَلَنِعْمَ الْمُجِيبُونَ",
    lessons: [
      "Patience in calling to Allah",
      "A small group with truth can overcome many",
      "Allah always fulfills His promises",
      "Divine punishment comes to those who persist in disbelief"
    ],
    moralLessons: [
      "Be patient in doing good",
      "Never despair of Allah's mercy",
      "Truth will always prevail"
    ]
  },
  {
    id: 3,
    title: "The Story of Prophet Ibrahim (AS)",
    titleArabic: "قصة إبراهيم عليه السلام",
    titleUrdu: "حضرت ابراہیم کی کہانی",
    prophet: "Abraham",
    prophetArabic: "إبراهيم",
    summary: "Prophet Ibrahim was a firm monotheist who broke his people's idols. He was thrown into a fire by Nimrod but was saved by Allah. He migrated with his wife Hajar and son Ismail. The Ka'bah was built by Ibrahim and Ismail at Allah's command.",
    summaryUrdu: "حضرت ابراہیم توحید کے پرندے تھے جنہوں نے اپنی قوم کے بت توڑے۔ انہیں نمرود نے آگ میں پھینکا مگر اللہ نے بچا لیا۔ وہ اپنی بیوی ہاجرہ اور بیٹے اسماعیل کے ساتھ ہجرت کر گئے۔ اللہ کے حکم سے کعبہ ابراہیم اور اسماعیل نے بنایا۔",
    keyAyah: "إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا",
    lessons: [
      "Complete surrender to Allah",
      "The journey of Hajj connects to Ibrahim's legacy",
      "Allah tests those He loves",
      "The foundation of Islam is Hajj and sacrifice"
    ],
    moralLessons: [
      "Stand firm for truth",
      "Trust Allah in all difficulties",
      "Build your life on submission to Allah"
    ]
  },
  {
    id: 4,
    title: "The Story of Prophet Yusuf (AS)",
    titleArabic: "قصة يوسف عليه السلام",
    titleUrdu: "حضرت یوسف کی کہانی",
    prophet: "Joseph",
    prophetArabic: "يوسف",
    summary: "Prophet Yusuf was sold into slavery by his brothers out of jealousy. He endured false accusations and prison, yet remained steadfast. Eventually, he rose to prominence in Egypt and forgave his brothers when they came seeking help during famine.",
    summaryUrdu: "حضرت یوسف کو ان کے بھائیوں نے حسد کی وجہ سے بیچ دیا۔ انہوں نے جھوٹے الزامات اور قید برداشت کی مگر ثابت قدم رہے۔ آخر کار وہ مصر میں بلند مقام پر پہنچے اور جب قحط کے زمانے میں ان کے بھائی مدد کے لیے آئے تو انہیں معاف کر دیا۔",
    keyAyah: "ادْخُلُوا مِصْرَ إِنْ شَاءَ اللَّهُ آمِنِينَ",
    lessons: [
      "Allah's plan is always better than our own",
      "Patience through trials leads to honor",
      "True nobility is in character, not status",
      "Forgiveness is a mark of greatness"
    ],
    moralLessons: [
      "Trust Allah's timing",
      "Maintain good character in all situations",
      "Good deeds are never wasted"
    ]
  },
  {
    id: 5,
    title: "The Story of Prophet Musa (AS)",
    titleArabic: "قصة موسى عليه السلام",
    titleUrdu: "حضرت موسیٰ کی کہانی",
    prophet: "Moses",
    prophetArabic: "موسى",
    summary: "Prophet Musa was sent to Pharaoh and his people. Through Allah's signs, he confronted Pharaoh who claimed to be god. The plagues came upon Egypt, and finally the sea was split for Musa and the believers to cross, while Pharaoh and his army drowned.",
    summaryUrdu: "حضرت موسیٰ کو فرعون اور اس کی قوم کی ہدایت کے لیے بھیجا گیا۔ اللہ کی نشانیوں کے ذریعے انہوں نے فرعون کا سامنا کیا جو خدا ہونے کا دعویٰ کرتا تھا۔ مصر پر آفات آئیں اور آخر میں موسیٰ اور مومنین کے لیے دریا پھٹا جبکہ فرعون اور اس کی فوج ڈوب گئے۔",
    keyAyah: "فَانظُرُوا إِلَىٰ آثَارِ رَحْمَتِ اللَّهِ كَيْفَ يُحْيِي الْأَرْضَ بَعْدَ مَوْتِهَا",
    lessons: [
      "Truth will always triumph over falsehood",
      "Divine punishment awaits oppressors",
      "Miracles are signs for those who reflect",
      "Freedom comes through faith and patience"
    ],
    moralLessons: [
      "Stand against oppression",
      "Trust in Allah's help",
      "Seek knowledge and reflection"
    ]
  },
  {
    id: 6,
    title: "The People of the Cave (Ashab al-Kahf)",
    titleArabic: "أصحاب الكهف",
    titleUrdu: "کھدائی والے",
    prophet: "Various Believers",
    prophetArabic: "مومنین",
    summary: "A group of young men believed in the truth and fled their oppressive king. They took refuge in a cave where Allah caused them to sleep for 309 years. When they awoke, they sent one to buy food, and their coin was found to be ancient.",
    summaryUrdu: "نوجوانوں کی ایک جماعت نے حق کو مان لیا اور اپنے ظالم بادشاہ سے بھاگ کر کھدائی میں پناہ لی۔ اللہ نے انہیں 309 سال سے زیادہ سوتے رکھا۔ جب وہ جاگے تو ایک کو کھانا خریدنے بھیجا گیا، اس کا سکہ قدیم نکلا۔",
    keyAyah: "وَكَذَٰلِكَ أَعْثَرْنَا عَلَيْهِمْ لِيَعْلَمُوا أَنَّ وَعْدَ اللَّهِ حَقٌّ",
    lessons: [
      "Allah protects those who stand firm in faith",
      "Time in Allah's hands is different from human time",
      "The Quran mentions them as a lesson for all times",
      "Earthly life is temporary, the afterlife is eternal"
    ],
    moralLessons: [
      "Choose faith over comfort",
      "Trust in Allah's protection",
      "This world is not our final home"
    ]
  },
  {
    id: 7,
    title: "The Story of Prophet Yunus (AS)",
    titleArabic: "قصة يونس عليه السلام",
    titleUrdu: "حضرت یونس کی کہانی",
    prophet: "Jonah",
    prophetArabic: "يونس",
    summary: "Prophet Yunus left his people in anger and was swallowed by a whale. In the darkness of the whale's belly, he called to Allah, who answered and saved him. He then returned to his people, who believed, and were saved.",
    summaryUrdu: "حضرت یونس اپنی قوم سے ناراض ہو کر چلے گئے اور مچھلی نے انہیں نگل لیا۔ مچھلی کے پیٹ کے اندھیرے میں انہوں نے اللہ سے پکارا، اس نے سن لیا اور بچا لیا۔ پھر وہ اپنی قوم کے پاس واپس گئے جنہوں نے ایمان لایا اور بچ گئے۔",
    keyAyah: "فَنَبَذْنَاهُ بِالْعَرَاءِ وَهُوَ سَقِيمٌ",
    lessons: [
      "Never despair of Allah's mercy",
      "Leaving duty in anger is not the Islamic way",
      "Even when far away, Allah hears our call",
      "Repentance at the moment of distress is answered"
    ],
    moralLessons: [
      "Stay patient in your duty",
      "Never lose hope in Allah's mercy",
      "Turn to Allah in all situations"
    ]
  },
  {
    id: 8,
    title: "The Story of Dhul-Qarnayn",
    titleArabic: "ذو القرنين",
    titleUrdu: "ذوالقرنین کی کہانی",
    prophet: "Dhul-Qarnayn",
    prophetArabic: "ذو القرنين",
    summary: "Dhul-Qarnayn was a righteous king who traveled the earth. He built a wall to protect people from Gog and Magog (Yajuj wa Majuj). He ruled with justice and was guided by Allah.",
    summaryUrdu: "ذوالقرنین ایک نیک بادشاہ تھے جنہوں نے زمین کا سفر کیا۔ انہوں نے یاجوج وماجوج سے لوگوں کی حفاظت کے لیے ایک دیوار بنایا۔ انہوں نے انصاف کے ساتھ حکومت کی اور اللہ نے انہیں ہدایت کی۔",
    keyAyah: "وَيَسْأَلُونَكَ عَن ذِي الْقَرْنَيْنِ قُلْ سَأَتْلُو عَلَيْكُم مِّنْهُ ذِكْرًا",
    lessons: [
      "Power should be used for justice",
      "Travel and seeking knowledge broaden perspectives",
      "Righteous rulers are a mercy from Allah",
      "Evil will be contained until the Day of Judgment"
    ],
    moralLessons: [
      "Use power wisely",
      "Seek knowledge through experience",
      "Balance between power and righteousness"
    ]
  }
];

// Prophet information
export interface Prophet {
  id: number;
  name: string;
  nameArabic: string;
  nameUrdu: string;
  title: string;
  appearance?: string;
  lifetime: string;
  miracles: string[];
}

export const prophets: Prophet[] = [
  { id: 1, name: "Adam", nameArabic: "آدم", nameUrdu: "آدم", title: "First Prophet", lifetime: "Unknown", miracles: ["Created from dust", "Given knowledge of names"] },
  { id: 2, name: "Idris", nameArabic: "إدريس", nameUrdu: "ادريس", title: "The Patient", lifetime: "Ancient", miracles: ["Wisdom", "Early writing"] },
  { id: 3, name: "Nuh", nameArabic: "نوح", nameUrdu: "نوح", title: "The Preacher", lifetime: "950 years", miracles: ["Ark building", "Surviving flood"] },
  { id: 4, name: "Hud", nameArabic: "هود", nameUrdu: "ہود", title: "To Thamud", lifetime: "Ancient", miracles: ["Saved from punishment"] },
  { id: 5, name: "Salih", nameArabic: "صالح", nameUrdu: "صالح", title: "To Thamud", lifetime: "Ancient", miracles: ["She-camel sign"] },
  { id: 6, name: "Ibrahim", nameArabic: "إبراهيم", nameUrdu: "ابراہیم", title: "Friend of Allah", lifetime: "~2000 BCE", miracles: ["Saved from fire", "Guest of angels", "Son sacrifice"] },
  { id: 7, name: "Lut", nameArabic: "لوط", nameUrdu: "لوط", title: "To Lot's people", lifetime: "Ancient", miracles: ["Delivered from punishment"] },
  { id: 8, name: "Ishmail", nameArabic: "إسماعيل", nameUrdu: "اسماعیل", title: "Son of Ibrahim", lifetime: "Ancient", miracles: ["Building Ka'bah", "Well of Zamzam"] },
  { id: 9, name: "Ishaq", nameArabic: "إسحاق", nameUrdu: "اسحاق", title: "Son of Ibrahim", lifetime: "Ancient", miracles: ["Son of promise"] },
  { id: 10, name: "Ya'qub", nameArabic: "يعقوب", nameUrdu: "یعقوب", title: "Israel", lifetime: "Ancient", miracles: ["Prophetic vision"] },
  { id: 11, name: "Yusuf", nameArabic: "يوسف", nameUrdu: "یوسف", title: "The Beautiful", lifetime: "Ancient Egypt", miracles: ["Dream interpretation", "Wisdom in leadership"] },
  { id: 12, name: "Ayyub", nameArabic: "أَيُّوب", nameUrdu: "ایوب", title: "The Patient", lifetime: "Ancient", miracles: ["Healing from trials"] },
  { id: 13, name: "Dhu al-Kifl", nameArabic: "ذو الكفل", nameUrdu: "ذوالکفل", title: "The Patient", lifetime: "Ancient", miracles: ["Patience and righteousness"] },
  { id: 14, name: "Sulayman", nameArabic: "سليمان", nameUrdu: "سلیمان", title: "King of Kings", lifetime: "~1000 BCE", miracles: ["Wind control", "Animals speech", "Building ability"] },
  { id: 15, name: "Dawud", nameArabic: "داوود", nameUrdu: "داوود", title: "The King", lifetime: "~1000 BCE", miracles: ["Iron softening", "Zabur revelation"] },
  { id: 16, name: "Yunus", nameArabic: "يونس", nameUrdu: "یونس", title: "The Whale Escaped", lifetime: "Ancient", miracles: ["Saved from whale"] },
  { id: 17, name: "Ilyas", nameArabic: "إلياس", nameUrdu: "الیاس", title: "To Israel", lifetime: "Ancient", miracles: ["Calling to truth"] },
  { id: 18, name: "Al-Yasa", nameArabic: "اليسع", nameUrdu: "الیسع", title: "Elisha", lifetime: "Ancient", miracles: ["Healing", "Signs"] },
  { id: 19, name: "Zakariya", nameArabic: "زكريا", nameUrdu: "زکریا", title: "Father of Yahya", lifetime: "~1st century BCE", miracles: ["Son born in old age"] },
  { id: 20, name: "Yahya", nameArabic: "يحيى", nameUrdu: "یحییٰ", title: "John the Baptist", lifetime: "~1st century BCE", miracles: ["Wisdom as child"] },
  { id: 21, name: "Isa", nameArabic: "عيسى", nameUrdu: "عیسیٰ", title: "Jesus Christ", lifetime: "~1st century CE", miracles: ["Healing", "Raising dead", "Creating bird from clay"] },
  { id: 22, name: "Muhammad", nameArabic: "محمد", nameUrdu: "محمد ﷺ", title: "Last Prophet", lifetime: "570-632 CE", miracles: ["Quran", "Isra & Mi'raj", "Moon splitting"] },
];