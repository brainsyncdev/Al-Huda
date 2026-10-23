import type { Metadata } from "next";
import { getSurahIndex } from "@/lib/quran/data";
import { ReadingPlansWorkspace } from "@/components/reading-plans/workspace";
import type { SurahOption } from "@/lib/revision/surah-options";

export const metadata: Metadata = {
  title: "Reading Plans — Al-Huda",
  description: "Set personal reading targets for systematic Quran study. Track your progress through surahs or custom ranges.",
  robots: { index: false, follow: false },
};

export default function ReadingPlansPage() {
  const surahOptions: SurahOption[] = getSurahIndex().map((surah) => ({
    id: surah.id,
    transliteration: surah.transliteration,
    arabicName: surah.arabicName,
    ayahCount: surah.ayahCount,
  }));

  return <ReadingPlansWorkspace surahOptions={surahOptions} />;
}
