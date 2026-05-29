"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Copy, Share2, Volume2, Bookmark } from "lucide-react";
import { duas, duasCategories } from "@/data/duas-data";

export default function DuasPage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDua, setExpandedDua] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filteredDuas = duas.filter((dua) => {
    const matchesCat = selectedCat === "all" || dua.category === selectedCat;
    const matchesSearch =
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.titleUrdu.includes(searchQuery) ||
      dua.arabic.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
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

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {duasCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCat === cat.id
                    ? "bg-emerald-600 text-white"
                    : "bg-secondary/50 text-muted-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {filteredDuas.map((dua) => (
            <div key={dua.id} className="bg-card rounded-2xl border overflow-hidden">
              <button
                onClick={() => setExpandedDua(expandedDua === dua.id ? null : dua.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{dua.title}</h3>
                    <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                      {dua.titleUrdu}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs">
                    {dua.category}
                  </span>
                </div>
              </button>

              {expandedDua === dua.id && (
                <div className="p-4 pt-0 border-t">
                  <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                    <p className="arabic-text text-xl text-right mb-4" dir="rtl">
                      {dua.arabic}
                    </p>
                    <p className="text-sm italic text-emerald-800 mb-2">
                      {dua.transliteration}
                    </p>
                    <p className="text-emerald-900">
                      {dua.translation}
                    </p>
                    <p className="text-sm text-emerald-700 mt-2 urdu-text" dir="rtl">
                      {dua.urduTranslation}
                    </p>
                  </div>

                  {dua.when && (
                    <p className="text-sm text-muted-foreground mb-4">
                      📖 When: {dua.when}
                    </p>
                  )}
                  
                  <p className="text-xs text-muted-foreground mb-4">
                    Source: {dua.source}
                  </p>

                  {dua.benefits && dua.benefits.length > 0 && (
                    <div className="bg-amber-50 rounded-xl p-3 mb-4">
                      <p className="text-sm font-medium text-amber-800 mb-2">✨ Benefits</p>
                      <ul className="text-sm text-amber-700 space-y-1">
                        {dua.benefits.map((benefit, idx) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 rounded-xl border flex items-center justify-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Listen
                    </button>
                    <button
                      onClick={() => handleCopy(dua.arabic, dua.id)}
                      className="flex-1 py-2 rounded-xl border flex items-center justify-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {copiedId === dua.id ? "Copied!" : "Copy"}
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