"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Bookmark, Filter } from "lucide-react";
import { authenticHadiths, hadithBooks, type Hadith } from "@/data/hadith-data";

export default function HadithPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [savedHadiths, setSavedHadiths] = useState<number[]>([1]);

  const filteredHadiths: Hadith[] = authenticHadiths.filter((hadith) => {
    const matchesSearch =
      searchQuery === "" ||
      hadith.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hadith.arabic.includes(searchQuery) ||
      hadith.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBook = !selectedBook || hadith.book === selectedBook;
    return matchesSearch && matchesBook;
  });

  const uniqueBooks = [...new Set(authenticHadiths.map((h) => h.book))];

  const toggleSave = (id: number) => {
    setSavedHadiths((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const formatGrade = (grade: string) => grade.charAt(0).toUpperCase() + grade.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-indigo-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Hadith Collection</h1>
              <p className="text-xs text-muted-foreground">احادیث — Sayings of the Prophet ﷺ</p>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search hadiths..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border-0"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedBook(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                !selectedBook ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700"
              }`}
            >
              All Books
            </button>
            {uniqueBooks.map((book) => (
              <button
                key={book}
                onClick={() => setSelectedBook(book)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedBook === book ? "bg-indigo-600 text-white" : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {book.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{authenticHadiths.length}</p>
              <p className="text-xs opacity-80">Total Hadiths</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{uniqueBooks.length}</p>
              <p className="text-xs opacity-80">Books</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{hadithBooks.reduce((acc, b) => acc + b.hadiths, 0).toLocaleString()}</p>
              <p className="text-xs opacity-80">In Collection</p>
            </div>
          </div>
        </div>

        {filteredHadiths.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hadiths found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHadiths.map((hadith) => (
              <Link
                key={hadith.id}
                href={`/hadith/${hadith.id}`}
                className="block bg-card rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-medium">
                        {hadith.book.split(" ")[0]} #{hadith.hadithNumber}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs">
                      ✅ {formatGrade(hadith.grade)}
                    </span>
                  </div>

                  <p className="arabic-text text-xl text-right mb-3" dir="rtl">
                    {hadith.arabic.slice(0, 100)}...
                  </p>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    "{hadith.translation.slice(0, 120)}..."
                  </p>

                  {hadith.narrator && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Narrated by: {hadith.narrator}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs">
                      {hadith.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSave(hadith.id);
                      }}
                      className="p-2 rounded-lg hover:bg-indigo-50"
                    >
                      <Bookmark className={`h-5 w-5 ${
                        savedHadiths.includes(hadith.id) ? "fill-indigo-500 text-indigo-500" : ""
                      }`} />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <h3 className="font-semibold mb-4">📚 Popular Hadith Books</h3>
          <div className="grid grid-cols-2 gap-3">
            {hadithBooks.slice(0, 6).map((book) => (
              <div key={book.id} className="bg-card rounded-xl border p-4">
                <p className="arabic-text text-lg text-indigo-600 mb-1" dir="rtl">
                  {book.arabic}
                </p>
                <h4 className="font-medium">{book.name}</h4>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <p className="text-xs text-indigo-600 mt-1">
                  {book.hadiths.toLocaleString()} Hadiths
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}