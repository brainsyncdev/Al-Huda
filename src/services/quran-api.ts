"use client";

const API_BASE_URL = "https://api.quran.com/api/v4";

export interface Surah {
  id: number;
  name_arabic: string;
  name_simple: string;
  transliteration: string;
  translation: string;
  revelation_place: string;
  revelation_order: number;
  verses_count: number;
  pages: number[];
}

export interface Verse {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani: string;
  page_number: number;
  translations: Translation[];
}

export interface Translation {
  id: number;
  resource_id: number;
  text: string;
  language_name: string;
  resource_name: string;
}

export interface Chapter {
  id: number;
  name_arabic: string;
  name_simple: string;
  transliteration: string;
  translated_name: { name: string };
  revelation_place: string;
  revelation_order: number;
  verses_count: number;
  pages: number[];
  bismillah_pre: boolean;
}

export interface VerseResponse {
  verses: Verse[];
  pagination: {
    per_page: number;
    current_page: number;
    next_page: number | null;
    total_pages: number;
    total_records: number;
  };
}

// Fetch all chapters (surahs)
export async function getAllChapters(): Promise<Chapter[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters?language=en`);
    if (!response.ok) throw new Error("Failed to fetch chapters");
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
}

// Fetch single chapter details
export async function getChapter(chapterNumber: number): Promise<Chapter | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/chapters/${chapterNumber}?language=en`);
    if (!response.ok) throw new Error("Failed to fetch chapter");
    const data = await response.json();
    return data.chapter;
  } catch (error) {
    console.error("Error fetching chapter:", error);
    return null;
  }
}

// Fetch verses with translations
export async function getVerses(chapterNumber: number, translationIds: number[] = [131, 85]): Promise<VerseResponse | null> {
  try {
    const translationsParam = translationIds.join(",");
    const response = await fetch(
      `${API_BASE_URL}/verses/by_chapter/${chapterNumber}?translations=${translationsParam}&language=en&words=false&per_page=300`
    );
    if (!response.ok) throw new Error("Failed to fetch verses");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching verses:", error);
    return null;
  }
}

// Search Quran
export async function searchQuran(query: string, translationIds: number[] = [131]): Promise<any[]> {
  try {
    const translationsParam = translationIds.join(",");
    const response = await fetch(
      `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&size=20&translations=${translationsParam}`
    );
    if (!response.ok) throw new Error("Search failed");
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching:", error);
    return [];
  }
}

// Get verse by key (e.g., "2:255")
export async function getVerse(verseKey: string, translationIds: number[] = [131, 85]): Promise<Verse | null> {
  try {
    const translationsParam = translationIds.join(",");
    const response = await fetch(
      `${API_BASE_URL}/verses/${verseKey}?translations=${translationsParam}&language=en`
    );
    if (!response.ok) throw new Error("Failed to fetch verse");
    const data = await response.json();
    return data.verse;
  } catch (error) {
    console.error("Error fetching verse:", error);
    return null;
  }
}

// Audio URLs for recitations
export function getAudioUrl(reciterId: number = 5, chapterNumber: number): string {
  // reciterId 5 = Mishary Rashid Alafasy
  return `https://verses.quran.com/Alafasy_${chapterNumber.toString().padStart(3, "0")}.mp3`;
}

// Get juz (part) data
export async function getJuz(juzNumber: number): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/juzs/${juzNumber}?language=en`);
    if (!response.ok) throw new Error("Failed to fetch juz");
    const data = await response.json();
    return data.juz;
  } catch (error) {
    console.error("Error fetching juz:", error);
    return null;
  }
}