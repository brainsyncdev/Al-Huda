"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Copy, Share2, Volume2, Bookmark } from "lucide-react";

const duas = [
  {
    id: 1,
    title: "Morning Dua",
    titleUr: "صبح کی دعا",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Asbahnaa wa asbahal-mulku lillah rabbil-'aalameen",
    translation: "We have reached the morning and at this very moment all the kingdoms belong to Allah, the Lord of all that exists.",
    category: "Morning",
    times: "Once in the morning",
  },
  {
    id: 2,
    title: "Evening Dua",
    titleUr: "شام کی دعا",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    transliteration: "Amsaynaa wa amsal-mulku lillah rabbil-'aalameen",
    translation: "We have reached the evening and at this very moment all the kingdoms belong to Allah.",
    category: "Evening",
    times: "Once in the evening",
  },
  {
    id: 3,
    title: "Before Sleep",
    titleUr: "سونے سے پہلے",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name, O Allah, I die and I live.",
    category: "Sleep",
    times: "Before sleeping",
  },
  {
    id: 4,
    title: "After Waking Up",
    titleUr: "اٹھنے کے بعد",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Al-hamdu lillahil-ladhi ahyaanaa ba'da maa amaatanaa wa ilayhi-n-nushoor",
    translation: "All praise is for Allah who gave us life after death and to Him is our return.",
    category: "Morning",
    times: "After waking up",
  },
  {
    id: 5,
    title: "Before Eating",
    titleUr: "کھانے سے پہلے",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    translation: "In the name of Allah and with the blessings of Allah.",
    category: "Food",
    times: "Before eating",
  },
  {
    id: 6,
    title: "After Eating",
    titleUr: "کھانے کے بعد",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    transliteration: "Al-hamdu lillahil-ladhi at'amanaa wa saqaanaa wa ja'alanaa muslimeen",
    translation: "All praise is for Allah who fed us, gave us drink, and made us Muslims.",
    category: "Food",
    times: "After eating",
  },
];

const categories = ["All", "Morning", "Evening", "Sleep", "Food", "Travel", "Rain"];

export default function DuasPage() {
  const [selectedCat, setSelectedCat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDua, setSelectedDua] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredDuas = duas.filter((dua) => {
    const matchesCat = selectedCat === "All" || dua.category === selectedCat;
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.titleUr.includes(searchQuery) ||
      dua.arabic.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDua = duas.find((d) => d.id === selectedDua);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Duas Collection</h1>
              <p className="text-xs text-muted-foreground">دعائیں — Supplications</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search duas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border-0"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCat === cat
                    ? "bg-teal-600 text-white"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.map((dua) => (
            <div
              key={dua.id}
              className="bg-card rounded-2xl border overflow-hidden"
            >
              <button
                onClick={() => setSelectedDua(selectedDua === dua.id ? null : dua.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{dua.title}</h3>
                    <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                      {dua.titleUr}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 text-xs">
                    {dua.category}
                  </span>
                </div>
              </button>

              {selectedDua === dua.id && (
                <div className="p-4 pt-0 border-t">
                  <div className="bg-teal-50 rounded-xl p-4 mb-4">
                    <p className="arabic-text text-xl text-right mb-4" dir="rtl">
                      {dua.arabic}
                    </p>
                    <p className="text-sm italic text-muted-foreground mb-2">
                      {dua.transliteration}
                    </p>
                    <p className="text-sm text-teal-800">
                      {dua.translation}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>📖 {dua.times}</span>
                    <span>📖 {dua.category}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl border flex items-center justify-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Listen
                    </button>
                    <button
                      onClick={() => handleCopy(dua.arabic)}
                      className="flex-1 py-2 rounded-xl border flex items-center justify-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {copied ? "Copied!" : "Copy"}
                    </button>
                    <button className="p-2 rounded-xl border">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-xl border">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDuas.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No duas found</p>
          </div>
        )}
      </main>
    </div>
  );
}