"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, RotateCcw, Play, Check, ChevronRight, BookOpen } from "lucide-react";

interface Letter {
  arabic: string;
  name: string;
  transliteration: string;
  audio: string;
}

const letters: Letter[] = [
  { arabic: "بَ", name: "Ba", transliteration: "ba", audio: "ba" },
  { arabic: "تَ", name: "Ta", transliteration: "ta", audio: "ta" },
  { arabic: "ثَ", name: "Tha", transliteration: "tha", audio: "tha" },
  { arabic: "جَ", name: "Jim", transliteration: "jim", audio: "jim" },
  { arabic: "حَ", name: "Ha", transliteration: "ha", audio: "ha" },
  { arabic: "خَ", name: "Kha", transliteration: "kha", audio: "kha" },
  { arabic: "دَ", name: "Dal", transliteration: "dal", audio: "dal" },
  { arabic: "ذَ", name: "Dhal", transliteration: "dhal", audio: "dhal" },
  { arabic: "رَ", name: "Ra", transliteration: "ra", audio: "ra" },
  { arabic: "زَ", name: "Zay", transliteration: "zay", audio: "zay" },
  { arabic: "سَ", name: "Sin", transliteration: "sin", audio: "sin" },
  { arabic: "شَ", name: "Shi", transliteration: "shi", audio: "shi" },
];

export default function ReadingPage() {
  const [currentLetter, setCurrentLetter] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const letter = letters[currentLetter];

  const handleComplete = () => {
    if (!completed.includes(currentLetter)) {
      setCompleted([...completed, currentLetter]);
    }
    if (currentLetter < letters.length - 1) {
      setCurrentLetter(currentLetter + 1);
      setShowHint(false);
    }
  };

  const progress = Math.round((completed.length / letters.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-teal-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Arabic Reading</h1>
              <p className="text-xs text-muted-foreground">تلاوت — Practice</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-teal-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-8">
        {/* Letter Card */}
        <div className="bg-card rounded-2xl border p-8 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Tap the letter to hear pronunciation
          </p>

          <div className="w-40 h-40 mx-auto rounded-2xl bg-teal-100 flex items-center justify-center mb-6 cursor-pointer hover:bg-teal-200 transition-colors">
            <span className="arabic-text text-7xl text-teal-700" dir="rtl">
              {letter.arabic}
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-2xl font-bold text-teal-700">{letter.name}</p>
            <p className="text-lg text-teal-600">{letter.transliteration}</p>
          </div>

          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 rounded-xl bg-teal-600 text-white font-medium flex items-center gap-2 hover:bg-teal-700 transition-colors">
              <Volume2 className="h-5 w-5" />
              Listen
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-6 py-3 rounded-xl border font-medium"
            >
              {showHint ? "Hide" : "Hint"}
            </button>
          </div>

          {showHint && (
            <div className="mt-6 bg-amber-50 rounded-xl p-4 text-left">
              <p className="text-sm text-amber-800">
                💡 <strong>Tip:</strong> This letter is pronounced by pressing the tip of your tongue behind your upper front teeth.
              </p>
            </div>
          )}
        </div>

        {/* Practice Button */}
        <button
          onClick={handleComplete}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 ${
            completed.includes(currentLetter)
              ? "bg-emerald-100 text-emerald-700"
              : "bg-teal-600 text-white"
          }`}
        >
          {completed.includes(currentLetter) ? (
            <>
              <Check className="h-5 w-5" />
              Completed ✓
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Mark as Practiced
            </>
          )}
        </button>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => {
              if (currentLetter > 0) {
                setCurrentLetter(currentLetter - 1);
                setShowHint(false);
              }
            }}
            disabled={currentLetter === 0}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (currentLetter < letters.length - 1) {
                setCurrentLetter(currentLetter + 1);
                setShowHint(false);
              }
            }}
            disabled={currentLetter === letters.length - 1}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* All Letters */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">All Letters</h3>
          <div className="grid grid-cols-6 gap-2">
            {letters.map((l, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentLetter(idx);
                  setShowHint(false);
                }}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-colors ${
                  currentLetter === idx
                    ? "bg-teal-600 text-white"
                    : completed.includes(idx)
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-teal-50 text-teal-700 hover:bg-teal-100"
                }`}
              >
                <span className="arabic-text text-lg" dir="rtl">{l.arabic}</span>
                {completed.includes(idx) && (
                  <Check className="h-3 w-3 mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Link */}
        {progress === 100 && (
          <Link
            href="/fahm"
            className="block w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold text-center"
          >
            Continue to Next Lesson →
          </Link>
        )}
      </main>
    </div>
  );
}