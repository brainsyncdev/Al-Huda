"use client";

export interface Dua {
  id: number;
  title: string;
  titleUrdu: string;
  arabic: string;
  transliteration: string;
  translation: string;
  urduTranslation: string;
  source: string;
  category: string;
  when?: string;
  benefits?: string[];
}

export const duas: Dua[] = [
  // Morning/Evening Duas
  {
    id: 1,
    title: "Morning Dua",
    titleUrdu: "صبح کی دعا",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Asbahnaa wa asbahal-mulku lillah rabbil-'aalameen",
    translation: "We have reached the morning and at this very moment all the kingdoms belong to Allah, Lord of all that exists.",
    urduTranslation: "ہم نے صبح کیا اور سارا بادشاہت اللہ کے لیے ہے جو تمام جہانوں کا رب ہے۔",
    source: "Sahih Muslim",
    category: "Morning/Evening",
    when: "After Fajr prayer",
    benefits: ["Remembering Allah's sovereignty", "Gratitude for another day"]
  },
  {
    id: 2,
    title: "Evening Dua",
    titleUrdu: "شام کی دعا",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Amsaynaa wa amsal-mulku lillah rabbil-'aalameen",
    translation: "We have reached the evening and at this very moment all the kingdoms belong to Allah.",
    urduTranslation: "ہم نے شام کی اور سارا بادشاہت اللہ کے لیے ہے۔",
    source: "Sahih Muslim",
    category: "Morning/Evening",
    when: "After Maghrib prayer"
  },
  
  // Sleep/Wake Up Duas
  {
    id: 3,
    title: "Before Sleep",
    titleUrdu: "سونے سے پہلے کی دعا",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    urduTranslation: "اے اللہ! تیرے نام سے مرتا اور جیتا ہوں۔",
    source: "Sahih al-Bukhari",
    category: "Sleep/Wake Up",
    when: "Before sleeping",
    benefits: ["Protection through the night", "Connecting death and life to Allah"]
  },
  {
    id: 4,
    title: "After Waking Up",
    titleUrdu: "جاگنے کے بعد",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Al-hamdu lillahil-ladhi ahyaanaa ba'da maa amaatanaa wa ilayhi-n-nushoor",
    translation: "All praise is for Allah who gave us life after death and to Him is our return.",
    urduTranslation: "شکر اللہ کا ہے جس نے ہمیں مرنے کے بعد زندہ کیا اور اسی کی طرف لوٹنا ہے۔",
    source: "Sahih al-Bukhari",
    category: "Sleep/Wake Up",
    when: "After waking up"
  },
  
  // Food/Drink Duas
  {
    id: 5,
    title: "Before Eating",
    titleUrdu: "کھانے سے پہلے",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    translation: "In the name of Allah and with the blessings of Allah.",
    urduTranslation: "اللہ کے نام سے اور اللہ کی برکت کے ساتھ۔",
    source: "Sahih Muslim",
    category: "Food/Drink",
    when: "Before eating"
  },
  {
    id: 6,
    title: "After Eating",
    titleUrdu: "کھانے کے بعد",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Al-hamdu lillahil-ladhi at'amanaa wa saqaanaa wa ja'alanaa muslimeen",
    translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
    urduTranslation: "شکر اللہ کا جو نے ہمیں کھلایا پلایا اور مسلمان بنایا۔",
    source: "Sahih Muslim",
    category: "Food/Drink",
    when: "After eating"
  },
  
  // General Duas
  {
    id: 7,
    title: "Dua for Guidance",
    titleUrdu: "ہدایت کی دعا",
    arabic: "رَبِّ اشْرَحْ صَدْرِي وَيَسِّرْ أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي",
    transliteration: "Rabbi ishrah sadrI wa yassir amri wal-hul 'uqdatan min lisaani",
    translation: "My Lord, expand my chest, ease my task, and remove the impediment from my speech.",
    urduTranslation: "اے میرے رب! میرا سینہ کھول دے اور میرا کام آسان کر دے اور میری زبان سے گرہانی نکال دے۔",
    source: "Quran 20:25-28",
    category: "General",
    when: "When facing difficulty in speech or task"
  },
  {
    id: 8,
    title: "Forgiveness Dua",
    titleUrdu: "معافی کی دعا",
    arabic: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
    transliteration: "Rabbigh-fir lii wa tub 'alayya innaka anta-t-tawwabu r-raheem",
    translation: "My Lord, forgive me and accept my repentance. You are the Acceptor of repentance, the Most Merciful.",
    urduTranslation: "اے میرے رب! مجھے معاف فرما اور میری توبہ قبول فرما۔ بے شک یقینا تو ہی توبہ قبول کرنے والا مہربان ہے۔",
    source: "Quran",
    category: "Forgiveness",
    benefits: ["Repentance acceptance", "Allah's mercy"]
  },
  
  // Travel Duas
  {
    id: 9,
    title: "Travel Dua",
    titleUrdu: "سفر کی دعا",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Subhaanal-ladhi sakkhara lanaa haadha wa maa kunna lahu muqrineen wa inna ilaa rabbinaa lamunqaliboon",
    translation: "Glory to the One who subdued this for us, for we could not have done it. Indeed, to our Lord we are returning.",
    urduTranslation: "پاک ہے وہ جس نے ہمارے لیے یہ تابع کیا اور ہم اس کے قابو میں نہ تھے اور ہم اپنے رب کی طرف لوٹنے والے ہیں۔",
    source: "Quran",
    category: "Travel"
  },
  
  // Protection Duas
  {
    id: 10,
    title: "Morning & Evening Protection",
    titleUrdu: "صبح و شام حفاظت",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'udhu bikalimAtillahit-tammAt min sharri ma khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    urduTranslation: "میں اللہ کے کامل کلمات کی پناہ چاہتا ہوں اس کی مخلوق کے شر سے۔",
    source: "Sahih Muslim",
    category: "Protection",
    benefits: ["Protection from harm", "Daily morning/evening fortification"]
  },
  {
    id: 11,
    title: "Ayat al-Kursi",
    titleUrdu: "آیت الکرسی",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    transliteration: "Allahu laa ilaha illa huwa al-hayyu al-qayyumu laa ta'khuthu sinatu wa laa nawm lahu ma fi as-samaawaati wa ma fi al-ard",
    translation: "Allah! There is no deity except Him, the Alive, the Eternal. Neither slumber nor sleep overtakes Him. To Him belongs all in heavens and earth. Who is it that intercedes with Him except by His permission?",
    urduTranslation: "اللہ! اس کے سوا کوئی معبود نہیں وہ زندہ ہمیشہ قائم رہنے والا ہے۔ نیند نہیں اسے آتی نہ تھکاوٴ اور اسی کے پاس ہے جو کچھ آسمانوں اور زمین میں ہے۔",
    source: "Quran 2:255",
    category: "Protection",
    benefits: ["Guardian of the house", "Protection from Shaytan"]
  },
  
  // Special Occasions
  {
    id: 12,
    title: "Tashahhud",
    titleUrdu: "تشہد",
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ",
    transliteration: "At-tahiyyatu lillah was-salawatu wat-tayyibatu as-salamu 'alayka ayyuha-n-nabiyyu wa rahmatullahi wa barakatuh",
    translation: "All greetings, prayers, and good words are for Allah. Peace be upon you, O Prophet, and Allah's mercy and blessings.",
    urduTranslation: "اللہ کے لیے سب تحیات ہیں اور اللہ کے لیے نمازیں اور پاکیاں۔ اے نبی! تم پر اللہ کی رحمت اور برکتیں ہوں۔",
    source: "Sahih al-Bukhari",
    category: "Salah"
  }
];

export const duasCategories = [
  { id: "all", name: "All Duas" },
  { id: "Morning/Evening", name: "Morning & Evening" },
  { id: "Sleep/Wake Up", name: "Sleep & Wake" },
  { id: "Food/Drink", name: "Food & Drink" },
  { id: "Protection", name: "Protection" },
  { id: "Forgiveness", name: "Forgiveness" },
  { id: "Travel", name: "Travel" },
  { id: "General", name: "General" }
];

export function getDuaByCategory(category: string): Dua[] {
  if (category === "all") return duas;
  return duas.filter((d) => d.category === category);
}