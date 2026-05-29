"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, BookOpen, Heart, Calendar, ChevronRight } from "lucide-react";

export default function JournalPage() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: "March 15, 2025",
      surah: "Al-Baqarah",
      ayah: "153",
      reflection: "Ya Allah, when I read this ayah about sabr, I realize how impatient I've been with my family...",
      mood: "reflective",
    },
    {
      id: 2,
      date: "March 14, 2025",
      surah: "Al-Fatiha",
      ayah: "6",
      reflection: "Guide us to the straight path... I keep asking for this but do I follow it?",
      mood: "thoughtful",
    },
  ]);

  const [newReflection, setNewReflection] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleSave = () => {
    if (!newReflection.trim()) return;
    
    setEntries([
      {
        id: entries.length + 1,
        date: new Date().toLocaleDateString(),
        surah: "Al-Fatiha",
        ayah: "1-7",
        reflection: newReflection,
        mood: "reflective",
      },
      ...entries,
    ]);
    setNewReflection("");
    setShowAdd(false);
  };

  const moodEmojis: Record<string, string> = {
    reflective: "🤔",
    thoughtful: "💭",
    grateful: "🤲",
    hopeful: "✨",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                ←
              </Link>
              <div>
                <h1 className="font-semibold">Journal</h1>
                <p className="text-xs text-muted-foreground">یادداشت — Reflections</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white font-medium"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Add Entry Form */}
        {showAdd && (
          <div className="bg-card rounded-2xl border p-4 mb-6">
            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Which ayah touched you?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Surah (e.g., Al-Fatiha)"
                  className="flex-1 px-4 py-2 rounded-xl border bg-background"
                />
                <input
                  type="text"
                  placeholder="Ayah"
                  className="w-20 px-4 py-2 rounded-xl border bg-background text-center"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm font-medium mb-2 block">
                Your reflection
              </label>
              <textarea
                value={newReflection}
                onChange={(e) => setNewReflection(e.target.value)}
                placeholder="What did this ayah mean to you today?"
                className="w-full px-4 py-3 rounded-xl border bg-background min-h-[120px]"
                dir="auto"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-3 rounded-xl border font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-semibold"
              >
                Save Reflection
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Entries</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">7</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">23</p>
            <p className="text-xs text-muted-foreground">Ayaat</p>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-card rounded-xl border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {entry.date}
                  </div>
                  <span className="text-2xl">{moodEmojis[entry.mood]}</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 text-sm">
                    📖 {entry.surah} {entry.ayah}
                  </span>
                </div>

                <p className="urdu-text text-sm text-foreground/80 mb-3" dir="rtl">
                  {entry.reflection}
                </p>

                <div className="flex items-center justify-between pt-3 border-t">
                  <button className="flex items-center gap-1 text-sm text-teal-600">
                    <Heart className="h-4 w-4" />
                    Like
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground">
                    Share
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && !showAdd && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No journal entries yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start reflecting on the Quran
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold"
            >
              Add First Entry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}