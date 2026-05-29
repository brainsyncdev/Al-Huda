"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, RotateCcw, Check, X, ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Flashcard {
  id: number;
  arabic: string;
  transliteration: string;
  urdu: string;
  english: string;
  category: string;
}

const cards: Flashcard[] = [
  { id: 1, arabic: "الله", transliteration: "Allah", urdu: "اللہ", english: "God", category: "Names" },
  { id: 2, arabic: "الرحمن", transliteration: "Ar-Rahman", urdu: "رحمن", english: "The Most Merciful", category: "Names" },
  { id: 3, arabic: "الرحيم", transliteration: "Ar-Raheem", urdu: "رحیم", english: "The Especially Merciful", category: "Names" },
  { id: 4, arabic: "الملك", transliteration: "Al-Malik", urdu: "بادشاہ", english: "The King", category: "Names" },
  { id: 5, arabic: "القدوس", transliteration: "Al-Quddus", urdu: "پاک", english: "The Most Holy", category: "Names" },
  { id: 6, arabic: "السلام", transliteration: "Al-Salam", urdu: "سلامتی", english: "The Source of Peace", category: "Names" },
  { id: 7, arabic: "المؤمن", transliteration: "Al-Mumin", urdu: "امنی", english: "The Giver of Faith", category: "Names" },
  { id: 8, arabic: "العزيز", transliteration: "Al-Aziz", urdu: "عزیز", english: "The Mighty", category: "Names" },
  { id: 9, arabic: "الجبار", transliteration: "Al-Jabbar", urdu: "جبار", english: "The Compeller", category: "Names" },
  { id: 10, arabic: "الحكيم", transliteration: "Al-Hakeem", urdu: "حکیم", english: "The Wise", category: "Names" },
];

export default function FlashcardsPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<number[]>([]);
  const [unknownCards, setUnknownCards] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleKnow = () => {
    setKnownCards([...knownCards, currentCard.id]);
    nextCard();
  };

  const handleUnknown = () => {
    setUnknownCards([...unknownCards, currentCard.id]);
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true);
    }
  };

  const resetDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownCards([]);
    setUnknownCards([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
            <Star className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-8">جلسہ مکمل ہوا</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-card rounded-xl border p-6 text-center">
              <p className="text-4xl font-bold text-emerald-600">{knownCards.length}</p>
              <p className="text-sm text-muted-foreground">Known</p>
            </div>
            <div className="bg-card rounded-xl border p-6 text-center">
              <p className="text-4xl font-bold text-red-600">{unknownCards.length}</p>
              <p className="text-sm text-muted-foreground">Need Practice</p>
            </div>
          </div>

          <p className="text-lg font-medium mb-6">
            {knownCards.length >= unknownCards.length ? "Great job! 🎉" : "Keep practicing! 💪"}
          </p>

          <div className="space-y-3">
            <button
              onClick={resetDeck}
              className="w-full py-4 rounded-xl bg-teal-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Practice Again
            </button>
            <Link
              href="/fahm"
              className="block w-full py-4 rounded-xl border font-semibold text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Flashcards</h1>
              <p className="text-xs text-muted-foreground">فلیش کارڈز — Memorize</p>
            </div>
            <button
              onClick={resetDeck}
              className="p-2 rounded-lg hover:bg-secondary"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1}/{cards.length}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Card Category */}
        <div className="text-center mb-4">
          <span className="px-4 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
            {currentCard.category}
          </span>
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative h-80 mb-6 cursor-pointer"
        >
          <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
            {/* Front */}
            <div className={`absolute inset-0 bg-card rounded-2xl border shadow-lg p-6 flex flex-col items-center justify-center backface-hidden ${isFlipped ? "invisible" : ""}`}>
              <p className="text-5xl mb-4">{currentCard.arabic}</p>
              <p className="text-xl text-teal-600 font-medium">{currentCard.transliteration}</p>
              <p className="text-sm text-muted-foreground mt-4">Tap to flip</p>
            </div>

            {/* Back */}
            <div className={`absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-white ${!isFlipped ? "invisible" : ""}`}>
              <p className="text-3xl mb-4 font-bold">{currentCard.english}</p>
              <p className="urdu-text text-2xl mb-2" dir="rtl">{currentCard.urdu}</p>
              <p className="text-teal-200">{currentCard.transliteration}</p>
            </div>
          </div>
        </div>

        {/* Audio Button */}
        <div className="flex justify-center mb-6">
          <button className="p-4 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors">
            <Volume2 className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setIsFlipped(false); } }}
            disabled={currentIndex === 0}
            className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleUnknown}
              className="px-6 py-4 rounded-xl bg-red-100 text-red-600 font-semibold flex items-center gap-2 hover:bg-red-200 transition-colors"
            >
              <X className="h-5 w-5" />
              Don&apos;t Know
            </button>
            <button
              onClick={handleKnow}
              className="px-6 py-4 rounded-xl bg-emerald-100 text-emerald-600 font-semibold flex items-center gap-2 hover:bg-emerald-200 transition-colors"
            >
              <Check className="h-5 w-5" />
              Know It
            </button>
          </div>

          <button
            onClick={nextCard}
            disabled={currentIndex === cards.length - 1}
            className="p-3 rounded-xl bg-secondary hover:bg-secondary/80 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-emerald-600">
            <Check className="h-4 w-4" />
            {knownCards.length} Known
          </div>
          <div className="flex items-center gap-2 text-red-600">
            <X className="h-4 w-4" />
            {unknownCards.length} Learning
          </div>
        </div>
      </main>
    </div>
  );
}