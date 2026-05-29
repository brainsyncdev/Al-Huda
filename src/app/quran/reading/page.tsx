"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, List, Settings, Maximize2 } from "lucide-react";
import { realSurahs } from "@/data/real-quran-data";

export default function QuranReadingPage() {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [showSurahList, setShowSurahList] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const surah = realSurahs.find((s) => s.id === currentSurah);
  const nextSurah = realSurahs.find((s) => s.id === currentSurah + 1);
  const prevSurah = realSurahs.find((s) => s.id === currentSurah - 1);

  // Reciter options
  const reciters = [
    { id: 1, name: "Mishary Rashid Alafasy", lang: "ar" },
    { id: 2, name: "Abdul Rahman Al-Sudais", lang: "ar" },
    { id: 3, name: "Saad Al-Ghamdi", lang: "ar" },
    { id: 4, name: "Maher Al Muaiqly", lang: "ar" },
  ];
  const [selectedReciter, setSelectedReciter] = useState(1);

  // Generate audio URL
  const getAudioUrl = (surahNum: number, reciterId: number = selectedReciter) => {
    return `https://cdn.islamic.network/quran/audio-surah/128/${reciterId}/${surahNum}.mp3`;
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSurahChange = (newSurah: number) => {
    setCurrentSurah(newSurah);
    setCurrentAyah(1);
    setShowSurahList(false);
    if (audioRef.current) {
      audioRef.current.src = getAudioUrl(newSurah);
      audioRef.current.load();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={getAudioUrl(currentSurah)}
        onEnded={() => {
          setIsPlaying(false);
          if (nextSurah) {
            handleSurahChange(currentSurah + 1);
          }
        }}
      />

      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link href="/quran" className="p-2 rounded-lg hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="font-semibold">Audio Recitation</h1>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Current Surah Card */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 mb-8 text-center">
          <p className="arabic-text text-5xl mb-4" dir="rtl">
            {surah?.nameArabic}
          </p>
          <h2 className="text-2xl font-bold mb-1">{surah?.nameEnglish}</h2>
          <p className="text-teal-200">{surah?.transliteration}</p>
          <p className="text-teal-300 text-sm mt-2">
            {surah?.totalVerses} Verses • {surah?.revelationType}
          </p>
        </div>

        {/* Reciter Selection */}
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block">Reciter</label>
          <select
            value={selectedReciter}
            onChange={(e) => setSelectedReciter(parseInt(e.target.value))}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white"
          >
            {reciters.map((r) => (
              <option key={r.id} value={r.id} className="bg-gray-800">
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Playback Controls */}
        <div className="bg-white/5 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-center gap-8 mb-6">
            <button
              onClick={() => prevSurah && handleSurahChange(currentSurah - 1)}
              disabled={!prevSurah}
              className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30"
            >
              <SkipBack className="h-6 w-6" />
            </button>

            <button
              onClick={handlePlayPause}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg"
            >
              {isPlaying ? (
                <Pause className="h-10 w-10" />
              ) : (
                <Play className="h-10 w-10 ml-1" />
              )}
            </button>

            <button
              onClick={() => nextSurah && handleSurahChange(currentSurah + 1)}
              disabled={!nextSurah}
              className="p-3 rounded-full hover:bg-white/10 disabled:opacity-30"
            >
              <SkipForward className="h-6 w-6" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <Volume2 className="h-5 w-5 text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="flex-1 accent-teal-500"
            />
          </div>
        </div>

        {/* Surah List Button */}
        <button
          onClick={() => setShowSurahList(!showSurahList)}
          className="w-full py-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 hover:bg-white/5"
        >
          <List className="h-5 w-5" />
          Browse Surahs
        </button>

        {/* Surah List */}
        {showSurahList && (
          <div className="mt-6 bg-white/5 rounded-2xl p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {realSurahs.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSurahChange(s.id)}
                  className={`p-2 rounded-lg text-center transition-colors ${
                    s.id === currentSurah
                      ? "bg-teal-600 text-white"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-bold">{s.id}</span>
                  <p className="arabic-text text-xs mt-1" dir="rtl">
                    {s.nameArabic}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {prevSurah ? (
            <button
              onClick={() => handleSurahChange(currentSurah - 1)}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{prevSurah.nameEnglish}</span>
            </button>
          ) : (
            <div />
          )}
          {nextSurah && (
            <button
              onClick={() => handleSurahChange(currentSurah + 1)}
              className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <span className="text-sm">{nextSurah.nameEnglish}</span>
              <span>→</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}