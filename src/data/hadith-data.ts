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
  benefits: string[];
  source?: string;
}

export const authenticHadiths: Hadith[] = [
  {
    id: 1,
    book: "Sahih Bukhari",
    bookArabic: "صحیح بخاری",
    hadithNumber: 1,
    arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ",
    transliteration: "Innamal a'maalu binniyyaat, wa innamaa likulli imri'in maa nawaa, faman kaanat hijratuhu ilaa Allaahi warasoolihi fahijratuhu ilaa Allaahi warasoolihi, wa man kaanat hijratuhu lidunyaa yusiibuhaa aw imra'atin yankiihuhaa fahijratuhu ilaa maa haajara ilayhi",
    translation: "Actions are but by intentions and every person will be rewarded according to their intention. So whoever emigrated for Allah and His Messenger, their emigration was for Allah and His Messenger. And whoever emigrated for worldly gain or to marry a woman, their emigration was for that which they emigrated.",
    urduTranslation: "اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی۔ پس جس کی ہجرت اللہ اور اس کے رسول کی طرف ہو تو اس کی ہجرت اللہ اور اس کے رسول کی طرف ہے۔ اور جس کی ہجرت دنیا حاصل کرنے یا کسی عورت سے شادی کے لیے ہو تو اس کی ہجرت اسی چیز کی طرف ہے جس کے لیے اس نے ہجرت کی۔",
    category: "Foundations of Islam",
    narrator: "Umar ibn al-Khattab (RA)",
    benefits: [
      "The foundation of Islam is based on intention",
      "All deeds are judged by their intention",
      "True worship requires sincere intention for Allah",
      "Reward depends on the purity of intention"
    ],
    source: "Sahih Bukhari, Hadith #1"
  },
  {
    id: 2,
    book: "Sahih Bukhari",
    bookArabic: "صحیح بخاری",
    hadithNumber: 8,
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا أَنَّ الْحَارِثَ بْنَ هِشَامٍ رَضِيَ اللَّهُ عَنْهُ سَأَلَ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فَقَالَ يَا رَسُولَ اللَّهِ كَيْفَ يَأْتِيكَ الْوَحْيُ فَقَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الْجَرَسِ وَهُوَ أَشَدُّهُ عَلَيَّ فَيُفْصَمُ عَنِّي وَقَدْ وَعَيْتُ عَنْهُ مَا قَالَ وَأَحْيَانًا يَأْتِينِي الْمَلَكُ رَجُلًا فَيُنَادِينِي فَأُنَادِيهِ",
    transliteration: "Ahyaanan ya'tiini mithla salasalati al-jarasi wa huwa ashadduhu 'alayya fa yufsamhu 'annii wa qad wa'a'tu 'amma qaala wa ahyaanan ya'tiini al-malaku rajulan fa yunaadiini fa unadiihi",
    translation: "The Messenger of Allah (ﷺ) said: Sometimes the revelation comes to me like the ringing of a bell, and that is the hardest on me, then it departs from me and I have memorized what was said. And sometimes the Angel comes to me as a man and speaks to me, and I memorize what he says.",
    urduTranslation: "رسول اللہ ﷺ نے فرمایا: کبھی وحی مجھ پر گھنٹی کی آواز کی طرح آتی ہے اور یہ مجھ پر سب سے سخت ہوتی ہے، پھر وہ مجھ سے جدا ہو جاتی ہے اور جو کچھ کہا گیا میں نے یاد کر لیا ہوتا ہے۔ اور کبھی فرشتہ آدمی کی شکل میں آتا ہے اور مجھ سے بات کرتا ہے اور جو کچھ وہ کہتا ہے میں یاد کر لیتا ہوں۔",
    category: "Revelation",
    narrator: "Aisha (RA)",
    benefits: [
      "Revelation is a physical experience for the Prophet ﷺ",
      "The Prophet ﷺ had complete understanding of revelation",
      "The Prophet ﷺ was protected from error in conveying revelation"
    ],
    source: "Sahih Bukhari, Hadith #8"
  },
  {
    id: 3,
    book: "Sahih Muslim",
    bookArabic: "صحیح مسلم",
    hadithNumber: 1,
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ قَالَ: قَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ: مَنْ حَسُنَ إِسْلَامُهُ لَمْ يُلَمْ عَلَى زَلَّةٍ",
    transliteration: "Man hasuna islaamahu lam yulam 'alaa zallatin",
    translation: "Whoever sincerely embraces Islam, their past mistakes are forgiven.",
    urduTranslation: "جس کا اسلام اچھا ہو اس کی پہلی غلطیاں معاف کر دی جاتی ہیں۔",
    category: "Mercy",
    narrator: "Abu Hurairah (RA)",
    benefits: [
      "Sincere conversion washes away all previous sins",
      "Islam offers a fresh start to those who truly embrace it",
      "This is a manifestation of Allah's infinite mercy"
    ],
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
    benefits: [
      "True faith requires universal love for fellow Muslims",
      "Jealousy and selfishness are signs of weak faith",
      "This hadith promotes brotherhood and unity in the ummah"
    ],
    source: "Sahih Bukhari, Hadith #13"
  },
  {
    id: 5,
    book: "Al-Adab Al-Mufrad",
    bookArabic: "ادب المفرد",
    hadithNumber: 12,
    arabic: "عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو رَضِيَ اللَّهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    transliteration: "Al-muslim man salima al-muslimuna min lisaanihi wa yadehi",
    translation: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    urduTranslation: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔",
    category: "Behavior",
    narrator: "Abdullah ibn Amr (RA)",
    benefits: [
      "A true Muslim protects others from harm",
      "Both speech and actions must be safe for others",
      "This is the minimum requirement of being a Muslim"
    ],
    source: "Al-Adab Al-Mufrad, Hadith #12"
  },
  {
    id: 6,
    book: "Sahih Bukhari",
    bookArabic: "صحیح بخاری",
    hadithNumber: 48,
    arabic: "عَنْ عَائِشَةَ رَضِيَ اللَّهُ عَنْهَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: مَنْ أَحْدَثَ فِي أَمْرِنَا هَذَا مَا لَيْسَ مِنْهُ فَهُوَ رَدٌّ",
    transliteration: "Man ahdatha fii amrinaa hadhaa maa laysa minhu fahuwa raddun",
    translation: "Whoever does an action which is not in accordance with this matter of ours (Islam), it will be rejected.",
    urduTranslation: "جو شخص ہمارے دین میں کوئی ایسی چیز متعارف کرائے جو اس کا حصہ نہ ہو تو وہ رد کر دی جائے گی۔",
    category: "Legislation",
    narrator: "Aisha (RA)",
    benefits: [
      "Innovation in religion (bid'ah) is rejected in Islam",
      "Only Quran and Sunnah are sources of Islamic law",
      "Every action must be validated by authentic sources"
    ],
    source: "Sahih Bukhari, Hadith #48"
  },
  {
    id: 7,
    book: "Sahih Muslim",
    bookArabic: "صحیح مسلم",
    hadithNumber: 100,
    arabic: "عَنْ أَبِي هُرَيْرَةَ رَضِيَ اللَّهُ عَنْهُ أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    transliteration: "Man kaana yu'minu billaahi wal-yawmil-aakhiril fal-yaqul khairan aw liyasmut",
    translation: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
    urduTranslation: "جو شخص اللہ اور یوم آخرت پر ایمان رکھتا ہو وہ اچھی بات کہے یا خاموش رہے۔",
    category: "Speech",
    narrator: "Abu Hurairah (RA)",
    benefits: [
      "Faith requires控制 of one's tongue",
      "Speaking good brings reward, silence protects from sin",
      "This is a comprehensive rule for daily life"
    ],
    source: "Sahih Muslim, Hadith #100"
  },
  {
    id: 8,
    book: "Jami` at-Tirmidhi",
    bookArabic: "جامع ترمذی",
    hadithNumber: 2616,
    arabic: "عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: لَا تَنْظُرُوا إِلَى مَنْ مَاتَ مِنَ الْأَغْنِيَاءِ وَلَكِنِ انْظُرُوا إِلَى مَنْ يَنْظُرُ إِلَيْكُمْ مِنَ الْمَسَاكِينِ",
    transliteration: "Laa tanzuruu ilaa man maata minal-aghniyaa'i walakin tanzuruu ilaa man yanzuru ilaykum minal-masaakiin",
    translation: "Do not look at those who have died wealthy, but look at those poor people who are looking at you.",
    urduTranslation: "تم امیر لوگوں کو نہ دیکھو جو مر گئے بلکہ ان مسکینوں کو دیکھو جو تمہیں دیکھ رہے ہیں۔",
    category: "Charity",
    narrator: "Anas ibn Malik (RA)",
    benefits: [
      "True wealth is measured by giving, not possessing",
      "We should be concerned about those in need",
      "This encourages generosity and gratitude"
    ],
    source: "Jami` at-Tirmidhi, Hadith #2616"
  },
  {
    id: 9,
    book: "Sunan Abu Dawud",
    bookArabic: "سنن ابوداؤد",
    hadithNumber: 4806,
    arabic: "عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو رَضِيَ اللَّهُ عَنْهُمَا أَنَّ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ قَالَ: الْمُسْلِمُ الَّذِي يَخَالِطُ النَّاسَ وَيَصْبِرُ عَلَى أَذَاهُمْ أَعْظَمُ أَجْرًا مِنَ الْمُسْلِمِ الَّذِي لَا يَخَالِطُ النَّاسَ وَلَا يَصْبِرُ عَلَى أَذَاهُمْ",
    transliteration: "Al-muslim alladhi yakhoolithu an-naas wa yasbiru 'alaa azaahum a'zamu ajran minal-muslim alladhi laa yakhoolithu an-naas wa laa yasbiru 'alaa azaahum",
    translation: "The Muslim who mixes with people and bears their annoyance will have a greater reward than the Muslim who does not mix with people and does not bear their annoyance.",
    urduTranslation: "وہ مسلمان جو لوگوں سے ملتا جلتا ہے اور ان کے ایذا دیتا ہے اس کا اجر اس مسلمان سے زیادہ ہے جو لوگوں سے نہیں ملتا اور ان کی ایذا نہیں برداشت کرتا۔",
    category: "Patience",
    narrator: "Abdullah ibn Amr (RA)",
    benefits: [
      "Social interaction with patience is highly rewarded",
      "Avoiding people out of pride is not the Islamic way",
      "True patience requires engaging with society"
    ],
    source: "Sunan Abu Dawud, Hadith #4806"
  },
  {
    id: 10,
    book: "Sahih Bukhari",
    bookArabic: "صحیح بخاری",
    hadithNumber: 3269,
    arabic: "عَنْ أَبِي سَعِيدٍ الْخُدْرِيِّ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْت رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ فَإِنْ لَمْ يَسْتَطِعْ فَبِلِسَانِهِ فَإِنْ لَمْ يَسْتَطِعْ فَبِقَلْبِهِ وَذَلِكَ أَضْعَفُ الْإِيمَانِ",
    transliteration: "Man ra'a minkum munkaran fal-yughayyirhu biyadihi fa-in lam yastati' fal-bilisanihi fa-in lam yastati' falbiqalbihi wa dhaalika ad'afu al-eemaan",
    translation: "Whoever among you sees an evil action, let him change it with his hand; if he cannot, then with his tongue; if he cannot, then with his heart - and that is the weakest of faith.",
    urduTranslation: "تم میں سے جو شخص کوئی برائی دیکھے وہ اپنے ہاتھ سے اسے روکے۔ اگر نہیں کر سکتا تو اپنی زبان سے۔ اور اگر یہ بھی نہیں کر سکتا تو اپنے دل سے۔ اور یہ ایمان کا کمزور ترین درجہ ہے۔",
    category: "Enjoining Good",
    narrator: "Sa'd ibn Mu'adh (RA)",
    benefits: [
      "Commanding good and forbidding evil is obligatory",
      "The level of action depends on one's ability",
      "Even heart-felt disapproval is part of faith"
    ],
    source: "Sahih Bukhari, Hadith #3269"
  }
];

// Hadith books information
export const hadithBooks = [
  { id: 1, name: "Sahih Bukhari", arabic: "صحیح بخاری", author: "Imam Bukhari", hadiths: 7563 },
  { id: 2, name: "Sahih Muslim", arabic: "صحیح مسلم", author: "Imam Muslim", hadiths: 7275 },
  { id: 3, name: "Sunan Abu Dawud", arabic: "سنن ابوداؤد", author: "Imam Abu Dawud", hadiths: 5274 },
  { id: 4, name: "Jami` at-Tirmidhi", arabic: "جامع ترمذی", author: "Imam Tirmidhi", hadiths: 3956 },
  { id: 5, name: "Sunan an-Nasa'i", arabic: "سنن نسائی", author: "Imam Nasa'i", hadiths: 5662 },
  { id: 6, name: "Sunan Ibn Majah", arabic: "سنن ابن ماجہ", author: "Imam Ibn Majah", hadiths: 4341 },
  { id: 7, name: "Riyad as-Salihin", arabic: "ریاض الصالحین", author: "Imam Nawawi", hadiths: 1896 },
  { id: 8, name: "Al-Adab Al-Mufrad", arabic: "ادب المفرد", author: "Imam Bukhari", hadiths: 1322 },
];

// Search hadiths
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