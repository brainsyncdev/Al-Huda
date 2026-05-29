"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Volume2, Heart } from "lucide-react";

const namesOfAllah = [
  { number: 1, name: "Ar-Rahman", arabic: "الرَّحْمَنُ", meaning: "The Most Gracious", meaningUr: "نہایت مہربان" },
  { number: 2, name: "Ar-Rahim", arabic: "الرَّحِيمُ", meaning: "The Most Merciful", meaningUr: "بڑا رحم والا" },
  { number: 3, name: "Al-Malik", arabic: "الْمَلِكُ", meaning: "The King", meaningUr: "بادشاہ" },
  { number: 4, name: "Al-Quddus", arabic: "الْقُدُّوسُ", meaning: "The Most Holy", meaningUr: "پاکیزہ" },
  { number: 5, name: "As-Salam", arabic: "السَّلَامُ", meaning: "The Source of Peace", meaningUr: "سلامتی" },
  { number: 6, name: "Al-Mumin", arabic: "الْمُؤْمِنُ", meaning: "The Guarantor", meaningUr: "امن دینے والا" },
  { number: 7, name: "Al-Muhaymin", arabic: "الْمُهَيْمِنُ", meaning: "The Preserver", meaningUr: "نگران" },
  { number: 8, name: "Al-Aziz", arabic: "الْعَزِيزُ", meaning: "The Almighty", meaningUr: "عزت والا" },
  { number: 9, name: "Al-Jabbar", arabic: "الْجَبَّارُ", meaning: "The Compeller", meaningUr: "قوت والا" },
  { number: 10, name: "Al-Mutakabbir", arabic: "الْمُتَكَبِّرُ", meaning: "The Greatest", meaningUr: "بڑائی والا" },
  { number: 11, name: "Al-Khaliq", arabic: "الْخَالِقُ", meaning: "The Creator", meaningUr: "خالق" },
  { number: 12, name: "Al-Bari", arabic: "الْبَارِئُ", meaning: "The Maker", meaningUr: "بنانے والا" },
  { number: 13, name: "Al-Musawwir", arabic: "الْمُصَوِّرُ", meaning: "The Fashioner", meaningUr: "صورت والا" },
  { number: 14, name: "Al-Ghaffar", arabic: "الْغَفَّارُ", meaning: "The Great Forgiver", meaningUr: "بہت بخشنے والا" },
  { number: 15, name: "Al-Qahhar", arabic: "الْقَهَّارُ", meaning: "The Dominant", meaningUr: "زبردست" },
  { number: 16, name: "Al-Wahhab", arabic: "الْوَهَّابُ", meaning: "The Bestower", meaningUr: "بڑا دینے والا" },
  { number: 17, name: "Ad-Darr", arabic: "الْدَّارُ", meaning: "The Harmer", meaningUr: "ضرر پہنچانے والا" },
  { number: 18, name: "An-Nafi", arabic: "النَّافِعُ", meaning: "The Benefiter", meaningUr: "نفع دینےوالا" },
  { number: 19, name: "An-Nur", arabic: "النُّورُ", meaning: "The Light", meaningUr: "روشنی" },
  { number: 20, name: "Al-Hadi", arabic: "الْهِدَى", meaning: "The Guide", meaningUr: "رہنما" },
  { number: 21, name: "Al-Badi", arabic: "الْبَدِيعُ", meaning: "The Maker", meaningUr: "بہترین بنانے والا" },
  { number: 22, name: "Al-Baqi", arabic: "الْبَاقِي", meaning: "The Everlasting", meaningUr: "ہمیشہ رہنے والا" },
  { number: 23, name: "Al-Warith", arabic: "الْوَارِثُ", meaning: "The Inheritor", meaningUr: "وارث" },
  { number: 24, name: "Ar-Rashid", arabic: "الرَّشِيدُ", meaning: "The Righteous", meaningUr: "راست رو" },
  { number: 25, name: "As-Sabur", arabic: "الصَّبُورُ", meaning: "The Patient", meaningUr: "صبر والا" },
];

export default function AsmaulHusnaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 5, 19]);
  const [selectedName, setSelectedName] = useState<typeof namesOfAllah[0] | null>(null);

  const filteredNames = namesOfAllah.filter(
    (name) =>
      name.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.arabic.includes(searchQuery) ||
      name.meaning.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (num: number) => {
    setFavorites((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">99 Names of Allah</h1>
              <p className="text-xs text-muted-foreground">اسماء الحسنیٰ — Asmaul Husna</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border-0"
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Quick Access */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {["All", "Most Loved", "A-D", "E-M", "N-Z"].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === "All"
                  ? "bg-emerald-600 text-white"
                  : "bg-secondary/50 text-muted-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Names Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredNames.map((name) => (
            <button
              key={name.number}
              onClick={() => setSelectedName(name)}
              className="bg-card rounded-xl border p-4 text-left hover:shadow-md transition-shadow relative"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                  {name.number}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(name.number);
                  }}
                  className="p-1"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      favorites.includes(name.number)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </div>
              <p className="arabic-text text-xl text-right mb-2" dir="rtl">
                {name.arabic}
              </p>
              <h3 className="font-semibold text-sm">{name.name}</h3>
              <p className="text-xs text-muted-foreground">{name.meaning}</p>
            </button>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedName && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setSelectedName(null)}
          >
            <div
              className="bg-white rounded-t-3xl w-full max-w-3xl p-6 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              
              <div className="text-center mb-6">
                <span className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-700 mx-auto mb-4">
                  {selectedName.number}
                </span>
                <p className="arabic-text text-4xl mb-3" dir="rtl">
                  {selectedName.arabic}
                </p>
                <h2 className="text-2xl font-bold mb-1">{selectedName.name}</h2>
                <p className="urdu-text text-lg text-emerald-600" dir="rtl">
                  {selectedName.meaningUr}
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-emerald-800">
                  <strong>Meaning:</strong> {selectedName.meaning}
                </p>
                <p className="text-emerald-700 mt-2 text-sm">
                  This name of Allah reminds us of His infinite {selectedName.meaning.toLowerCase()} towards all creation.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleFavorite(selectedName.number)}
                  className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                    favorites.includes(selectedName.number)
                      ? "bg-red-100 text-red-600"
                      : "bg-secondary"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(selectedName.number) ? "fill-red-500" : ""}`} />
                  {favorites.includes(selectedName.number) ? "Saved" : "Save"}
                </button>
                <button className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium flex items-center justify-center gap-2">
                  <Volume2 className="h-5 w-5" />
                  Listen
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}