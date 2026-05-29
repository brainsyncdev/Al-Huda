"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { themes } from "@/data/quran-data";

interface PageProps {
  params: Promise<{ theme: string }>;
}

export default function ThemePage({ params }: PageProps) {
  const { theme } = use(params);
  const decodedTheme = decodeURIComponent(theme);
  const themeData = themes.find(
    (t) => t.nameEnglish.toLowerCase() === decodedTheme.toLowerCase()
  );

  // Mock ayaat for this theme
  const themeAyaat = [
    {
      surah: "Al-Baqarah",
      id: 2,
      ayah: 153,
      arabic: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ",
      meaning: "And seek help through patience and prayer",
    },
    {
      surah: "Aal-E-Imran",
      id: 3,
      ayah: 200,
      arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا",
      meaning: "O you who believe! Persevere and endure",
    },
    {
      surah: "Az-Zumar",
      id: 39,
      ayah: 10,
      arabic: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ",
      meaning: "Indeed, the patient will be given their reward without measure",
    },
  ];

  if (!themeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Theme not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/explore" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold flex items-center gap-2">
                <span className="text-2xl">{themeData.icon}</span>
                {themeData.nameUrdu}
              </h1>
              <p className="text-xs text-muted-foreground">{themeData.totalAyaat} verses in Quran</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Theme Info */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-8">
          <div className="text-6xl mb-4">{themeData.icon}</div>
          <h2 className="text-2xl font-bold mb-2" dir="rtl">
            {themeData.nameArabic}
          </h2>
          <p className="text-white/80">{themeData.descriptionUrdu}</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-sm">
              <strong>{themeData.totalAyaat}</strong> ayaat across the Quran
            </p>
          </div>
        </div>

        {/* Knowledge Graph Preview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Connected Themes</h3>
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl mx-auto mb-2">
                  {themeData.icon}
                </div>
                <p className="text-sm font-medium">{themeData.nameEnglish}</p>
              </div>
              
              <div className="flex items-center gap-2">
                {["Sabr", "Shukr", "Tawakkul", "Dua"].map((connected) => (
                  <div key={connected} className="flex items-center gap-1 text-muted-foreground">
                    <div className="w-8 h-0.5 bg-border" />
                    <span className="text-xs">{connected}</span>
                  </div>
                ))}
              </div>

              {["Sabr", "Shukr", "Tawakkul"].map((node, i) => (
                <div key={node} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-xl mx-auto mb-2">
                    {["🫠", "🤲", "✨"][i]}
                  </div>
                  <p className="text-xs font-medium">{node}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              Explore the full knowledge graph to discover all connections
            </p>
          </div>
        </div>

        {/* Ayaat List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Key Verses</h3>
          <div className="space-y-4">
            {themeAyaat.map((item) => (
              <Link
                key={`${item.id}:${item.ayah}`}
                href={`/quran/${item.id}`}
                className="block bg-card rounded-xl border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">
                    {item.surah} {item.id}:{item.ayah}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="arabic-text text-xl mb-3" dir="rtl">
                  {item.arabic}
                </p>
                <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                  {item.meaning}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}