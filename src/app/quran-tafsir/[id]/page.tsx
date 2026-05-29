"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Share2, ChevronDown, ChevronUp, BookOpen, Heart, ExternalLink } from "lucide-react";
import { realSurahs } from "@/data/real-quran-data";
import { getTafsirForSurah, getTafsirForVerse } from "@/data/tafsir-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TafsirPage({ params }: PageProps) {
  const { id } = use(params);
  const surahId = parseInt(id);
  const surah = realSurahs.find((s) => s.id === surahId);
  const tafsirList = getTafsirForSurah(surahId);
  
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [savedVerses, setSavedVerses] = useState<number[]>([]);

  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Surah not found</p>
      </div>
    );
  }

  const toggleSave = (ayahNum: number) => {
    setSavedVerses(prev =>
      prev.includes(ayahNum) ? prev.filter(n => n !== ayahNum) : [...prev, ayahNum]
    );
  };

  const tafsirVerses = surahId === 1 
    ? [
        { ayah: 1, title: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", hasTafsir: true },
        { ayah: 2, title: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", hasTafsir: true },
        { ayah: 3, title: "الرَّحْمَٰنِ الرَّحِيمِ", hasTafsir: false },
        { ayah: 4, title: "مَالِكِ يَوْمِ الدِّينِ", hasTafsir: false },
        { ayah: 5, title: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", hasTafsir: true },
        { ayah: 6, title: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", hasTafsir: true },
        { ayah: 7, title: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ", hasTafsir: false },
      ]
    : [
        { ayah: 1, title: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", hasTafsir: true },
        { ayah: 2, title: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", hasTafsir: true },
        { ayah: 3, title: "الرَّحْمَٰنِ الرَّحِيمِ", hasTafsir: false },
        { ayah: 4, title: "مَالِكِ يَوْمِ الدِّينِ", hasTafsir: true },
        { ayah: 5, title: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", hasTafsir: true },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/quran/${id}`} className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Tafsir: {surah.nameEnglish}</h1>
              <p className="text-xs text-muted-foreground">تفسیر — Commentary</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6 text-center">
          <p className="arabic-text text-3xl mb-2" dir="rtl">{surah.nameArabic}</p>
          <h2 className="text-xl font-bold">{surah.nameEnglish}</h2>
          <p className="text-teal-200">{surah.transliteration}</p>
        </div>

        <div className="bg-card rounded-xl border p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Tafsir Ibn Kathir</p>
              <p className="text-sm text-muted-foreground">Authentic Islamic commentary</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {tafsirVerses.map((verse) => {
            const tafsir = getTafsirForVerse(surahId, verse.ayah);
            const isSelected = selectedVerse === verse.ayah;
            const isSaved = savedVerses.includes(verse.ayah);

            return (
              <div key={verse.ayah} className="bg-card rounded-2xl border overflow-hidden">
                <button
                  onClick={() => setSelectedVerse(isSelected ? null : verse.ayah)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                        {verse.ayah}
                      </span>
                      {verse.hasTafsir && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">
                          Tafsir Available
                        </span>
                      )}
                    </div>
                    {isSelected ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  <p className="arabic-text text-2xl mt-3 text-right" dir="rtl">
                    {verse.title}
                  </p>
                </button>

                {isSelected && verse.hasTafsir && tafsir && (
                  <div className="p-4 border-t space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <span className="text-teal-600">📖</span> Translation
                      </h4>
                      <p className="text-muted-foreground">
                        {verse.ayah === 1 && "In the name of Allah, the Entirely Merciful, the Especially Merciful."}
                        {verse.ayah === 2 && "All praise is [due] to Allah, Lord of the worlds -"}
                        {verse.ayah === 5 && "It is You we worship and You we ask for help."}
                        {verse.ayah === 6 && "Guide us to the straight path -"}
                      </p>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <span>📚</span> Ibn Kathir
                      </h4>
                      <p className="text-sm text-amber-800">{tafsir.tafsirIbnKathir}</p>
                    </div>

                    <div className="bg-teal-50 rounded-xl p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <span>اردو</span> تفسیر
                      </h4>
                      <p className="text-sm text-teal-800 urdu-text" dir="rtl">
                        {tafsir.tafsirUrdu}
                      </p>
                    </div>

                    {tafsir.benefits.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">✨ Benefits</h4>
                        <ul className="space-y-1">
                          {tafsir.benefits.map((benefit: string, idx: number) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-emerald-500">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => toggleSave(verse.ayah)}
                        className={`flex-1 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                          isSaved
                            ? "bg-red-100 text-red-600"
                            : "bg-secondary"
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? "fill-red-500" : ""}`} />
                        {isSaved ? "Saved" : "Save"}
                      </button>
                      <a
                        href={`https://quran.com/${surahId}:${verse.ayah}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-4 rounded-lg bg-secondary flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Quran.com
                      </a>
                    </div>
                  </div>
                )}

                {isSelected && !verse.hasTafsir && (
                  <div className="p-4 border-t text-center">
                    <p className="text-muted-foreground">
                      Tafsir for this verse is coming soon...
                    </p>
                    <p className="urdu-text text-sm text-muted-foreground mt-1" dir="rtl">
                      اس آیت کی تفسیر جلد شائع کی جائے گی
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-4">📚 Related Resources</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="https://quran.com/tafsir/ibn-kathir"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-xl border p-4 hover:shadow-md"
            >
              <p className="font-medium">Tafsir Ibn Kathir</p>
              <p className="text-sm text-muted-foreground">Complete online</p>
            </a>
            <a
              href="https://quran.com/tafsir/al-qurtubi"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card rounded-xl border p-4 hover:shadow-md"
            >
              <p className="font-medium">Tafsir Al-Qurtubi</p>
              <p className="text-sm text-muted-foreground">Complete online</p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}