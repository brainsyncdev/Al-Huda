"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, BookOpen, Volume2, Share2, Bookmark } from "lucide-react";
import { surahs } from "@/data/quran-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TafsirPage({ params }: PageProps) {
  const { id } = use(params);
  const surahId = parseInt(id);
  const surah = surahs.find((s) => s.id === surahId);

  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Surah not found</p>
      </div>
    );
  }

  // Mock tafsir data
  const tafsirData = {
    meaning: {
      urdu: "یہ سورت کا مطلب ہے 'فیل'۔ اس سورت میں اللہ تعالیٰ نے اہل حبشہ کے لشکر کو ہلاک کرنے کا واقعہ بیان کیا ہے۔",
      english: "This surah means 'The Elephant'. It describes how Allah destroyed the army of Abraha al-Ashram who came with elephants to destroy the Ka'bah.",
    },
    benefits: [
      "Reading this Surah brings reward equal to Hashr (gathering on Day of Judgment)",
      "It protects from smallpox and plague",
      "Reciting it during travel provides safety",
    ],
    context: "This Surah was revealed in Makkah and contains 5 verses. It references the year of the Elephant (Aam al-Fil) when Abraha attempted to destroy the Ka'bah.",
    relatedAyaat: [
      { surah: "Al-Baqarah", ayah: "114", text: "وَمَنْ أَظْلَمُ مِمَّنْ مَنَعَ مَسَاجِدَ اللَّهِ..." },
      { surah: "Al-Hajj", ayah: "39-40", text: "أُذِنَ لِلَّذِينَ يُقَاتَلُونَ بِأَنَّهُمْ ظُلِمُوا..." },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/quran/${id}`} className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Tafsir: {surah.nameArabic}</h1>
                <p className="text-xs text-muted-foreground">
                  {surah.meaningEnglish} — تفسیر
                </p>
              </div>
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
        {/* Surah Header */}
        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-6 mb-6 text-center">
          <p className="arabic-text text-3xl mb-2" dir="rtl">
            {surah.nameArabic}
          </p>
          <h2 className="text-xl font-bold">{surah.meaningEnglish}</h2>
          <p className="text-amber-700">{surah.meaningUrdu}</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-amber-700">
            <span>{surah.totalVerses} Verses</span>
            <span>•</span>
            <span>{surah.revelationType}</span>
          </div>
        </div>

        {/* Meaning Section */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-600" />
            Meaning
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">اردو</p>
              <p className="urdu-text" dir="rtl">
                {tafsirData.meaning.urdu}
              </p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">English</p>
              <p>{tafsirData.meaning.english}</p>
            </div>
          </div>
        </div>

        {/* Context Section */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">Historical Context</h3>
          <p className="text-muted-foreground">
            {tafsirData.context}
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4">Benefits of Reading</h3>
          <ul className="space-y-3">
            {tafsirData.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-emerald-800">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Related Ayaat */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <h3 className="font-semibold mb-4">Related Verses</h3>
          <div className="space-y-4">
            {tafsirData.relatedAyaat.map((ref, idx) => (
              <Link
                key={idx}
                href="/quran"
                className="block bg-secondary/50 rounded-xl p-4 hover:bg-secondary transition-colors"
              >
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">
                  {ref.surah} : {ref.ayah}
                </span>
                <p className="arabic-text text-right mt-2" dir="rtl">
                  {ref.text}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Audio Section */}
        <div className="bg-card rounded-2xl border p-6">
          <h3 className="font-semibold mb-4">Listen to Recitation</h3>
          <button className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium flex items-center justify-center gap-2">
            <Volume2 className="h-5 w-5" />
            Play Audio (Mishary Alafasy)
          </button>
        </div>
      </main>
    </div>
  );
}