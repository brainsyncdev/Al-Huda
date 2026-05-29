"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Heart, Volume2, Info } from "lucide-react";

const allNamesOfAllah = [
  { number: 1, name: "Ar-Rahman", arabic: "الرَّحْمَنُ", meaning: "The Most Gracious", meaningUr: "نہایت مہربان", meaningFa: "بخشنده‌ترین" },
  { number: 2, name: "Ar-Rahim", arabic: "الرَّحِيمُ", meaning: "The Most Merciful", meaningUr: "بڑا رحم والا", meaningFa: "مهربان‌ترین" },
  { number: 3, name: "Al-Malik", arabic: "الْمَلِكُ", meaning: "The King", meaningUr: "بادشاہ", meaningFa: "پادشاه" },
  { number: 4, name: "Al-Quddus", arabic: "الْقُدُّوسُ", meaning: "The Most Holy", meaningUr: "پاکیزہ", meaningFa: "پاک" },
  { number: 5, name: "As-Salam", arabic: "السَّلَامُ", meaning: "The Source of Peace", meaningUr: "سلامتی", meaningFa: "سلامت" },
  { number: 6, name: "Al-Mumin", arabic: "الْمُؤْمِنُ", meaning: "The Guarantor", meaningUr: "امن دینے والا", meaningFa: "امنی‌بخش" },
  { number: 7, name: "Al-Muhaymin", arabic: "الْمُهَيْمِنُ", meaning: "The Preserver", meaningUr: "نگران", meaningFa: "نگهبان" },
  { number: 8, name: "Al-Aziz", arabic: "الْعَزِيزُ", meaning: "The Almighty", meaningUr: "عزت والا", meaningFa: "عزتمند" },
  { number: 9, name: "Al-Jabbar", arabic: "الْجَبَّارُ", meaning: "The Compeller", meaningUr: "قوت والا", meaningFa: "قهرآلود" },
  { number: 10, name: "Al-Mutakabbir", arabic: "الْمُتَكَبِّرُ", meaning: "The Greatest", meaningUr: "بڑائی والا", meaningFa: "بزرگ" },
  { number: 11, name: "Al-Khaliq", arabic: "الْخَالِقُ", meaning: "The Creator", meaningUr: "خالق", meaningFa: "آفریننده" },
  { number: 12, name: "Al-Bari", arabic: "الْبَارِئُ", meaning: "The Maker", meaningUr: "بنانے والا", meaningFa: "پدیدآورنده" },
  { number: 13, name: "Al-Musawwir", arabic: "الْمُصَوِّرُ", meaning: "The Fashioner", meaningUr: "صورت والا", meaningFa: "صورتگر" },
  { number: 14, name: "Al-Ghaffar", arabic: "الْغَفَّارُ", meaning: "The Great Forgiver", meaningUr: "بہت بخشنے والا", meaningFa: "بسیارآمرزنده" },
  { number: 15, name: "Al-Qahhar", arabic: "الْقَهَّارُ", meaning: "The Dominant", meaningUr: "زبردست", meaningFa: "چیره" },
  { number: 16, name: "Al-Wahhab", arabic: "الْوَهَّابُ", meaning: "The Bestower", meaningUr: "بڑا دینے والا", meaningFa: "بخشنده" },
  { number: 17, name: "Ad-Darr", arabic: "الْدَّارُ", meaning: "The Harmer", meaningUr: "ضرر پہنچانے والا", meaningFa: "زیان‌رسان" },
  { number: 18, name: "An-Nafi", arabic: "النَّافِعُ", meaning: "The Benefiter", meaningUr: "نفع دینے والا", meaningFa: "سودرسان" },
  { number: 19, name: "An-Nur", arabic: "النُّورُ", meaning: "The Light", meaningUr: "روشنی", meaningFa: "نور" },
  { number: 20, name: "Al-Hadi", arabic: "الْهِدَى", meaning: "The Guide", meaningUr: "رہنما", meaningFa: "هدایت‌کننده" },
  { number: 21, name: "Al-Badi", arabic: "الْبَدِيعُ", meaning: "The Maker", meaningUr: "بہترین بنانے والا", meaningFa: "بی‌همتا" },
  { number: 22, name: "Al-Baqi", arabic: "الْبَاقِي", meaning: "The Everlasting", meaningUr: "ہمیشہ رہنے والا", meaningFa: "جاودان" },
  { number: 23, name: "Al-Warith", arabic: "الْوَارِثُ", meaning: "The Inheritor", meaningUr: "وارث", meaningFa: "میراث‌بر" },
  { number: 24, name: "Ar-Rashid", arabic: "الرَّشِيدُ", meaning: "The Righteous", meaningUr: "راست رو", meaningFa: "راهنما" },
  { number: 25, name: "As-Sabur", arabic: "الصَّبُورُ", meaning: "The Patient", meaningUr: "صبر والا", meaningFa: "صبور" },
  { number: 26, name: "Al-Jami", arabic: "الْجَامِعُ", meaning: "The Gatherer", meaningUr: "جمع کرنے والا", meaningFa: "گردآورنده" },
  { number: 27, name: "Al-Ghani", arabic: "الْغَنِيُّ", meaning: "The Self-Sufficient", meaningUr: "بے نیاز", meaningFa: "بی‌نیاز" },
  { number: 28, name: "Al-Mughni", arabic: "الْمُغْنِي", meaning: "The Enricher", meaningUr: "امیر بنانے والا", meaningFa: "بی‌نیازکننده" },
  { number: 29, name: "Al-Mani", arabic: "الْمَانِعُ", meaning: "The Preventer", meaningUr: "روکنے والا", meaningFa: "بازدارنده" },
  { number: 30, name: "Ad-Darr", arabic: "الضَّارُّ", meaning: "The Harmer", meaningUr: "ضرر دینے والا", meaningFa: "زیان‌رسان" },
  { number: 31, name: "An-Nafi", arabic: "النَّافِعُ", meaning: "The Benefiter", meaningUr: "نفع دینے والا", meaningFa: "سودرسان" },
  { number: 32, name: "Al-Matin", arabic: "الْمَتِينُ", meaning: "The Firm", meaningUr: " مضبوط", meaningFa: "استوار" },
  { number: 33, name: "Al-Wali", arabic: "الْوَلِيُّ", meaning: "The Protector", meaningUr: "سرپرست", meaningFa: "سرپرست" },
  { number: 34, name: "Al-Muhaymin", arabic: "الْمُهَيْمِنُ", meaning: "The Overseer", meaningUr: "نگران", meaningFa: "نگهبان" },
  { number: 35, name: "Al-Hafiz", arabic: "الْحَفِيظُ", meaning: "The Preserver", meaningUr: "حفظ کرنے والا", meaningFa: "نگهبان" },
  { number: 36, name: "Al-Hakim", arabic: "الْحَكِيمُ", meaning: "The Wise", meaningUr: "حکیم", meaningFa: "حکیم" },
  { number: 37, name: "Al-Wadud", arabic: "الْوَدُودُ", meaning: "The Loving", meaningUr: "محبت والا", meaningFa: "دوست‌دار" },
  { number: 38, name: "Al-Majid", arabic: "الْمَجِيدُ", meaning: "The Glorious", meaningUr: "بزرگ", meaningFa: "بزرگوار" },
  { number: 39, name: "Al-Baith", arabic: "الْبَاعِثُ", meaning: "The Resurrector", meaningUr: " اٹھانے والا", meaningFa: "برانگیزاننده" },
  { number: 40, name: "Ash-Shahid", arabic: "الشَّهِيدُ", meaning: "The Witness", meaningUr: "گواہ", meaningFa: "شاهد" },
  { number: 41, name: "Al-Haqq", arabic: "الْحَقُّ", meaning: "The Truth", meaningUr: "سچ", meaningFa: "حق" },
  { number: 42, name: "Al-Wakil", arabic: "الْوَكِيلُ", meaning: "The Trustee", meaningUr: "وکیل", meaningFa: "وکیل" },
  { number: 43, name: "Al-Qawi", arabic: "الْقَوِيُّ", meaning: "The Strong", meaningUr: "قوي", meaningFa: "نیرومند" },
  { number: 44, name: "Al-Matin", arabic: "الْمَتِينُ", meaning: "The Mighty", meaningUr: "زبردست", meaningFa: "نیرومند" },
  { number: 45, name: "Al-Wali", arabic: "الْوَلِيُّ", meaning: "The Friend", meaningUr: "مولی", meaningFa: "سرپرست" },
  { number: 46, name: "Al-Mutaali", arabic: "الْمُتَعَالِي", meaning: "The Most High", meaningUr: "بلند", meaningFa: "والا" },
  { number: 47, name: "Al-Kabir", arabic: "الْكَبِيرُ", meaning: "The Most Great", meaningUr: "بزرگ", meaningFa: "بزرگ" },
  { number: 48, name: "Al-Akhir", arabic: "الْآخِرُ", meaning: "The Last", meaningUr: "آخری", meaningFa: "آخر" },
  { number: 49, name: "Ad-Dahr", arabic: "الدَّهْرُ", meaning: "The Everlasting", meaningUr: "ہمیشہ", meaningFa: "دهر" },
  { number: 50, name: "Al-Muta'ali", arabic: "الْمُتَعَالِي", meaning: "The Exalted", meaningUr: "بلند", meaningFa: "برتر" },
];

export default function AsmaulHusnaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([1, 2, 19, 36, 41]);
  const [selectedName, setSelectedName] = useState<typeof allNamesOfAllah[0] | null>(null);

  const filteredNames = allNamesOfAllah.filter(
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

          {/* Quick Stats */}
          <div className="flex gap-4 mt-4 text-sm text-emerald-600">
            <span>📿 99 Names</span>
            <span>✨ Reward of reciting each: 10 good deeds</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Info Banner */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Info className="h-6 w-6" />
            <h2 className="font-semibold">Virtue of reciting Allah's Names</h2>
          </div>
          <p className="text-emerald-100">
            "The best remembrance is La ilaha illallah and the best supplication is Alhamdulillah." 
            <span className="urdu-text block mt-1" dir="rtl">— حدیث</span>
          </p>
        </div>

        {/* Names Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredNames.map((name) => (
            <button
              key={name.number}
              onClick={() => setSelectedName(name)}
              className="bg-card rounded-xl border p-4 text-left hover:shadow-md transition-shadow relative"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(name.number);
                }}
                className="absolute top-2 right-2 p-1"
              >
                <Heart
                  className={`h-5 w-5 ${
                    favorites.includes(name.number)
                      ? "text-red-500 fill-red-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
              <span className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700 mb-2">
                {name.number}
              </span>
              <p className="arabic-text text-2xl text-right mb-2" dir="rtl">
                {name.arabic}
              </p>
              <h3 className="font-semibold text-sm">{name.name}</h3>
              <p className="text-xs text-emerald-600">{name.meaning}</p>
            </button>
          ))}
        </div>

        {filteredNames.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No names found</p>
          </div>
        )}

        {/* Detail Modal */}
        {selectedName && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center"
            onClick={() => setSelectedName(null)}
          >
            <div
              className="bg-white rounded-t-3xl w-full max-w-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
              
              <div className="text-center mb-6">
                <span className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-700 mx-auto mb-4">
                  {selectedName.number}
                </span>
                <p className="arabic-text text-5xl mb-3" dir="rtl">
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