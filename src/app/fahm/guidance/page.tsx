"use client";

import { useState } from "react";
import { Send, Lightbulb, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AyahCard } from "@/components/quran/AyahCard";
import { HadithCard } from "@/components/quran/HadithCard";
import { ayahsData, translationsData, tafsirData } from "@/data/quran-data";
import { hadiths } from "@/data/quran-data";
import { getSurah } from "@/data/quran-data";
import { Surah, Ayah, Translation } from "@/types/quran";

interface GuidanceResult {
  ayaat: Array<{ ayah: Ayah; translation: Translation }>;
  hadith?: typeof hadiths[0];
}

export default function GuidancePage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GuidanceResult | null>(null);
  const [showTip, setShowTip] = useState(true);

  // Mock guidance based on query keywords
  const getGuidance = (searchQuery: string): GuidanceResult => {
    const lowerQuery = searchQuery.toLowerCase();
    
    // Business/patience related
    if (lowerQuery.includes("business") || lowerQuery.includes("karobaar") || lowerQuery.includes("dhoka")) {
      return {
        ayaat: [
          { ayah: ayahsData[2]?.[1] || ayahsData[1]?.[0], translation: translationsData[1]?.[0]! },
          { ayah: ayahsData[1]?.[5], translation: translationsData[1]?.[5]! },
        ],
        hadith: hadiths[1],
      };
    }
    
    // Default - show Al-Fatiha related verses
    return {
      ayaat: ayahsData[1]?.map((ayah) => ({
        ayah,
        translation: translationsData[1]?.find((t) => t.ayahId === ayah.id) || translationsData[1]?.[0]!,
      })) || [],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setShowTip(false);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const guidance = getGuidance(query);
    setResult(guidance);
    setIsLoading(false);
  };

  const exampleQueries = [
    "Mere business mein dhoka hua",
    "Gussa aata hai",
    "Family mein problems",
    "Stress aur anxiety",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="px-4 py-4 border-b bg-white/80 backdrop-blur">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">قرآن سے پوچھیں</h1>
              <p className="text-xs text-muted-foreground">Ask the Quran</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-card rounded-2xl border p-4">
            <label className="text-sm font-medium mb-2 block">
              آپ کی بات لکھیں — Share what's on your mind
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mere business mein dhoka hua — kya karoon?"
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border-0 focus:ring-2 focus:ring-teal-500 resize-none min-h-[100px]"
              dir="auto"
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs text-muted-foreground">
                {query.length}/500 characters
              </div>
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    قرآن میں ڈھونڈیں
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Example queries */}
          {showTip && !query && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Try these:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map ( (q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-3 py-1.5 rounded-full bg-secondary/50 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
              </div>
              <p className="text-muted-foreground">قرآن میں ڈھونڈ رہے ہیں...</p>
              <p className="text-sm text-muted-foreground">Searching the Quran...</p>
            </motion.div>
          )}

          {result && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 text-teal-600" />
                <span>Relevant ayaat based on your query</span>
              </div>

              {/* Ayaat */}
              <div className="space-y-4">
                {result.ayaat.map(({ ayah, translation }) => {
                  const surah = getSurah(ayah.surahId);
                  return (
                    <div key={ayah.id} className="bg-card rounded-xl border overflow-hidden">
                      <div className="p-4 border-b bg-teal-50/50">
                        <p className="text-sm font-medium text-teal-700">
                          📖 {surah?.transliteration} {surah?.id}:{ayah.ayahNumber}
                        </p>
                      </div>
                      <div className="p-4">
                        <p className="arabic-text text-2xl text-center mb-4" dir="rtl">
                          {ayah.arabicText}
                        </p>
                        <p className="urdu-text text-center text-muted-foreground" dir="rtl">
                          {translation.translation}
                        </p>
                        <div className="mt-4 pt-4 border-t">
                          <a
                            href={`https://quran.com/${ayah.surahId}:${ayah.ayahNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-teal-600 hover:underline"
                          >
                            View on quran.com ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hadith */}
              {result.hadith && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>📗 Related Hadith</span>
                  </div>
                  <HadithCard hadith={result.hadith} />
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-amber-50 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important Note</p>
                  <p>
                    For specific fiqhi masail (Islamic rulings), please consult a qualified Islamic scholar (alim).
                    This feature provides general guidance from the Quran.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}