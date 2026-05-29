"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Bookmark, Share2, Volume2, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";
import { authenticHadiths, hadithBooks } from "@/data/hadith-data";

export default function HadithPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [currentHadith, setCurrentHadith] = useState(0);
  const [showArabic, setShowArabic] = useState(true);
  const [savedHadiths, setSavedHadiths] = useState<number[]>([1]);

  const filteredHadiths = authenticHadiths.filter((h) => {
    const matchesSearch =
      searchQuery === "" ||
      h.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.arabic.includes(searchQuery) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBook = !selectedBook || h.book === selectedBook;
    return matchesSearch && matchesBook;
  });

  const hadith = filteredHadiths[currentHadith];

  const toggleSave = (id: number) => {
    setSavedHadiths((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const uniqueBooks = [...new Set(authenticHadiths.map((h) => h.book))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Hadith Collection</h1>
              <p className="text-xs text-muted-foreground">احادیث — Sayings of the Prophet ﷺ</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hadiths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border-0"
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Books Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setSelectedBook(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
              !selectedBook ? "bg-indigo-600 text-white" : "bg-secondary text-muted-foreground"
            }`}
          >
            All Books
          </button>
          {uniqueBooks.map((book) => (
            <button
              key={book}
              onClick={() => setSelectedBook(book)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedBook === book ? "bg-indigo-600 text-white" : "bg-secondary text-muted-foreground"
              }`}
            >
              {book.split(" ")[0]}
            </button>
          ))}
        </div>

        {filteredHadiths.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hadiths found</p>
          </div>
        ) : (
          <>
            {/* Navigation */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Hadith {currentHadith + 1} of {filteredHadiths.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentHadith(Math.max(0, currentHadith - 1))}
                  disabled={currentHadith === 0}
                  className="p-2 rounded-lg border disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentHadith(Math.min(filteredHadiths.length - 1, currentHadith + 1))}
                  disabled={currentHadith === filteredHadiths.length - 1}
                  className="p-2 rounded-lg border disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Hadith Card */}
            {hadith && (
              <div className="bg-card rounded-2xl border overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b bg-indigo-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{hadith.book}</h3>
                      <p className="arabic-text text-sm text-indigo-600" dir="rtl">
                        {hadith.bookArabic}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">
                      #{hadith.hadithNumber}
                    </span>
                  </div>
                  {hadith.narrator && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Narrated by: {hadith.narrator}
                    </p>
                  )}
                </div>

                {/* Arabic Text */}
                <div className="p-6 border-b">
                  <button
                    onClick={() => setShowArabic(!showArabic)}
                    className="flex items-center gap-2 text-sm text-muted-foreground mb-3"
                  >
                    <BookOpen className="h-4 w-4" />
                    {showArabic ? "Hide Arabic" : "Show Arabic"}
                  </button>
                  
                  {showArabic && (
                    <p className="arabic-text text-xl leading-loose text-right" dir="rtl">
                      {hadith.arabic}
                    </p>
                  )}
                </div>

                {/* Transliteration */}
                <div className="p-4 bg-gray-50">
                  <p className="text-sm italic text-gray-600">
                    {hadith.transliteration}
                  </p>
                </div>

                {/* Translation */}
                <div className="p-6 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">English Translation</h4>
                    <p className="text-gray-700">"{hadith.translation}"</p>
                  </div>
                  
                  <div className="bg-teal-50 rounded-xl p-4">
                    <h4 className="font-medium mb-2">اردو ترجمہ</h4>
                    <p className="urdu-text text-gray-700" dir="rtl">
                      {hadith.urduTranslation}
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div className="px-6 pb-4">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                    {hadith.category}
                  </span>
                </div>

                {/* Benefits */}
                {hadith.benefits.length > 0 && (
                  <div className="p-4 border-t">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <span className="text-amber-500">✨</span>
                      Key Benefits
                    </h4>
                    <ul className="space-y-2">
                      {hadith.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-emerald-500">•</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t flex gap-3">
                  <button
                    onClick={() => toggleSave(hadith.id)}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                      savedHadiths.includes(hadith.id)
                        ? "bg-red-100 text-red-600"
                        : "bg-secondary"
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${savedHadiths.includes(hadith.id) ? "fill-red-500" : ""}`} />
                    {savedHadiths.includes(hadith.id) ? "Saved" : "Save"}
                  </button>
                  <button className="py-3 px-4 rounded-xl border flex items-center justify-center gap-2">
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button className="py-3 px-4 rounded-xl border flex items-center justify-center gap-2">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Source */}
                <div className="px-4 pb-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Source: {hadith.source}
                  </p>
                </div>
              </div>
            )}

            {/* Hadith Books */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Popular Hadith Books</h3>
              <div className="grid grid-cols-2 gap-4">
                {hadithBooks.slice(0, 6).map((book) => (
                  <div key={book.id} className="bg-card rounded-xl border p-4">
                    <p className="arabic-text text-lg text-indigo-600 mb-1" dir="rtl">
                      {book.arabic}
                    </p>
                    <h4 className="font-medium">{book.name}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {book.hadiths.toLocaleString()} Hadiths
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}