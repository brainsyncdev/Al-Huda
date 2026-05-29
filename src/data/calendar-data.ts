"use client";

export interface IslamicEvent {
  id: number;
  name: string;
  nameArabic: string;
  nameUrdu: string;
  hijriDate: string;
  description: string;
  type: "celebration" | "worship" | "historical";
}

export const islamicEvents: IslamicEvent[] = [
  {
    id: 1,
    name: "Islamic New Year",
    nameArabic: "أول محرم",
    nameUrdu: "یکم محرم",
    hijriDate: "1 Muharram",
    description: "The Islamic New Year marks the migration of Prophet Muhammad ﷺ from Makkah to Madinah.",
    type: "historical"
  },
  {
    id: 2,
    name: "Day of Ashura",
    nameArabic: "عاشورا",
    nameUrdu: "عاشوراء",
    hijriDate: "10 Muharram",
    description: "Day of Ashura - fasting recommended. Prophet Musa (AS) was saved this day.",
    type: "worship"
  },
  {
    id: 3,
    name: "Mawlid al-Nabi",
    nameArabic: "میلاد النبی ﷺ",
    nameUrdu: "ولادت نبی ﷺ",
    hijriDate: "12 Rabi al-Awwal",
    description: "Celebration of the birth of Prophet Muhammad ﷺ. Celebrated with prayers and gatherings.",
    type: "celebration"
  },
  {
    id: 4,
    name: "Miraj",
    nameArabic: "اسراء و معراج",
    nameUrdu: "رات معراج",
    hijriDate: "27 Rajab",
    description: "The Night Journey and Ascension of Prophet Muhammad ﷺ to the heavens.",
    type: "historical"
  },
  {
    id: 5,
    name: "Laylat al-Barat",
    nameArabic: "شب برات",
    nameUrdu: "شب برات",
    hijriDate: "15 Sha'ban",
    description: "Night of Forgiveness - seek Allah's mercy and forgiveness.",
    type: "worship"
  },
  {
    id: 6,
    name: "First Ramadan",
    nameArabic: "روزہ اول",
    nameUrdu: "پہلا روزہ",
    hijriDate: "1 Ramadan",
    description: "First day of the blessed month of fasting.",
    type: "worship"
  },
  {
    id: 7,
    name: "Laylat al-Qadr",
    nameArabic: "لیلة القدر",
    nameUrdu: "رات قدر",
    hijriDate: "27 Ramadan",
    description: "Night of Power - better than a thousand months. Seek Laylat al-Qadr in odd nights of last 10 days.",
    type: "worship"
  },
  {
    id: 8,
    name: "Eid al-Fitr",
    nameArabic: "عید الفطر",
    nameUrdu: "عید الفطر",
    hijriDate: "1 Shawwal",
    description: "Festival of Breaking Fast - celebration after Ramadan.",
    type: "celebration"
  },
  {
    id: 9,
    name: "Hajj",
    nameArabic: "حج",
    nameUrdu: "حج",
    hijriDate: "8-12 Dhul Hijjah",
    description: "Pilgrimage to Makkah - fifth pillar of Islam.",
    type: "worship"
  },
  {
    id: 10,
    name: "Eid al-Adha",
    nameArabic: "عید الاضحیٰ",
    nameUrdu: "عید الاضحیٰ",
    hijriDate: "10 Dhul Hijjah",
    description: "Festival of Sacrifice - commemorating Ibrahim's willingness to sacrifice his son.",
    type: "celebration"
  }
];

export const hijriMonths = [
  "Muharram", "Safar", "Rabi al-Awwal", "Rabi al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

export function getEventForDate(month: number, day: number) {
  return islamicEvents.find(e => {
    const [eventMonth, eventDay] = e.hijriDate.split(" ")[0] === String(day) 
      ? [hijriMonths.findIndex(m => e.hijriDate.includes(m)) + 1 : -1;
    return eventMonth === month && eventDay === day;
  });
}