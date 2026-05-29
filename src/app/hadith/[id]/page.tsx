"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, Volume2, ChevronRight, ChevronLeft, Bookmark, ExternalLink, Copy } from "lucide-react";
import { authenticHadiths } from "@/data/hadith-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function HadithDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const hadithId = parseInt(id);
  const [showArabic, setShowArabic] = useState(true);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const hadith = authenticHadiths.find(h => h.id === hadithId);
  const currentIndex = authenticHadiths.findIndex(h => h.id === hadithId);
  const prevHadith = currentIndex > 0 ? authenticHadiths[currentIndex - 1] : null;
  const nextHadith = currentIndex < authenticHadiths.length - 1 ? authenticHadiths[currentIndex + 1] : null;

  if (!hadith) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Hadith not found</p>
      </div>
    );
  }

  const handleCopy = () => {
    const text = `${hadith.arabic}\n\n${hadith.translation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/hadith" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">{hadith.book}</h1>
                <p className="text-xs text-muted-foreground">Hadith #{hadith.hadithNumber}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSaved(!saved)}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <Bookmark className={`h-5 w-5 ${saved ? "fill-indigo-500 text-indigo-500" : ""}`} />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Hadith Card */}
        <div className="bg-card rounded-2xl border overflow-hidden mb-6">
          {/* Header */}
          <div className="bg-indigo-50 p-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{hadith.book}</h2>
                <p className="arabic-text text-sm text-indigo-600" dir="rtl">{hadith.bookArabic}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
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
          {showArabic && (
            <div className="p-6 border-b">
              <p className="arabic-text text-2xl leading-loose text-right" dir="rtl">
                {hadith.arabic}
              </p>
            </div>
          )}

          {/* Transliteration */}
          <div className="bg-gray-50 p-4 border-b">
            <p className="text-sm italic text-gray-600">{hadith.transliteration}</p>
          </div>

          {/* Translation */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-medium mb-2">English Translation</h3>
              <p className="text-gray-700">"{hadith.translation}"</p>
            </div>
            
            <div className="bg-teal-50 rounded-xl p-4">
              <h3 className="font-medium mb-2">اردو ترجمہ</h3>
              <p className="text-gray-700 urdu-text" dir="rtl">{hadith.urduTranslation}</p>
            </div>
          </div>

          {/* Category & Grade */}
          <div className="px-6 pb-4 flex gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
              {hadith.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
              ✅ {hadith.grade.charAt(0).toUpperCase() + hadith.grade.slice(1)}
            </span>
          </div>

          {/* Benefits */}
          {hadith.benefits && hadith.benefits.length > 0 && (
            <div className="px-6 pb-4">
              <h3 className="font-medium mb-3">✨ Key Benefits</h3>
              <ul className="space-y-2">
                {hadith.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-medium flex items-center justify-center gap-2 hover:bg-indigo-200 transition-colors">
              <Volume2 className="h-5 w-5" />
              Listen
            </button>
            <button
              onClick={handleCopy}
              className="py-3 px-4 rounded-xl bg-secondary flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
            >
              <Copy className="h-5 w-5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Source */}
          <div className="px-6 pb-4 text-center">
            <p className="text-xs text-muted-foreground">Source: {hadith.source}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          {prevHadith ? (
            <Link
              href={`/hadith/${prevHadith.id}`}
              className="flex items-center gap-2 p-4 rounded-xl border hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Previous</p>
                <p className="font-medium">{prevHadith.book}</p>
              </div>
            </Link>
          ) : <div />}
          
          {nextHadith && (
            <Link
              href={`/hadith/${nextHadith.id}`}
              className="flex items-center gap-2 p-4 rounded-xl border hover:bg-secondary"
            >
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next</p>
                <p className="font-medium">{nextHadith.book}</p>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* External Links */}
        <div className="mt-6 bg-card rounded-xl border p-4">
          <h3 className="font-medium mb-3">📚 Related Resources</h3>
          <a
            href={`https://sunnah.com/${hadith.collectionSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between py-2 hover:text-indigo-600"
          >
            <span>View on sunnah.com</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </main>
    </div>
  );
}