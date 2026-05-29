"use client";

import { motion } from "framer-motion";
import { Search, Heart, Share2, ChevronRight, BookOpen, Globe, Shield, Sparkles } from "lucide-react";
import { themes } from "@/data/quran-data";
import Link from "next/link";

export default function ExplorePage() {
  const wisdomAyah = {
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    translation: "Verily, in the remembrance of Allah do hearts find rest.",
    source: "Ar-Ra'd 13:28",
    context: "This verse reminds us that spiritual reflection brings peace to the heart — a universal human experience."
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🔍</span>
            </div>
            <div>
              <h1 className="font-semibold">EXPLORE</h1>
              <p className="text-xs text-muted-foreground">کشف — Discovery Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
            <Shield className="h-4 w-4" />
            <span>No pressure</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        {/* Why are you here */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <h2 className="text-xl font-bold mb-2">Discover Quranic Wisdom</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Explore 1,400-year-old guidance on peace, justice, family, and purpose.
            <br />
            <strong>No account required. No conversion pressure.</strong>
          </p>
        </motion.div>

        {/* Featured Wisdom Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Because you care about <span className="font-medium">Peace</span>:
          </p>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <p className="arabic-text text-2xl mb-4 text-center" dir="rtl">
              {wisdomAyah.arabic}
            </p>
            
            <p className="text-center text-white/90 mb-4">
              "{wisdomAyah.translation}"
            </p>

            <div className="bg-white/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-white/80">
                {wisdomAyah.context}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <a
                href="https://quran.com/13:28"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/80 hover:text-white"
              >
                📖 {wisdomAyah.source} ↗
              </a>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                  <Heart className="h-4 w-4" />
                </button>
                <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Explore Topics</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "☮️", label: "Peace & Mental Health", color: "bg-blue-50" },
              { icon: "⚖️", label: "Justice & Ethics", color: "bg-amber-50" },
              { icon: "🔬", label: "Science & Knowledge", color: "bg-green-50" },
              { icon: "👨‍👩‍👧", label: "Family & Relationships", color: "bg-pink-50" },
              { icon: "💰", label: "Business & Finance", color: "bg-purple-50" },
              { icon: "🌍", label: "Society & Community", color: "bg-teal-50" },
            ].map((topic, index) => (
              <motion.div
                key={topic.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className={`${topic.color} p-4 rounded-xl cursor-pointer hover:shadow-md transition-shadow`}
              >
                <span className="text-2xl block mb-2">{topic.icon}</span>
                <p className="font-medium text-sm">{topic.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Common Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Common Questions</h3>
          <div className="space-y-3">
            {[
              { q: "What does Jihad actually mean?", icon: "⚔️" },
              { q: "Does Islam promote violence?", icon: "🕊️" },
              { q: "What does Islam say about women?", icon: "👩" },
              { q: "Is Allah the same as God?", icon: "🌟" },
            ].map((item) => (
              <Link
                key={item.q}
                href="/explore/questions"
                className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:shadow-md transition-shadow"
              >
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{item.q}</p>
                  <p className="text-xs text-muted-foreground">Evidence-based answer from Quran</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Authenticity Promise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-50 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Globe className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Verified Sources</h3>
              <p className="text-sm text-green-800">
                Every verse is cited from the original Arabic text (Tanzil.net).
                Every hadith links to sunnah.com.
                <strong>Verify everything yourself.</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sign up CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="bg-card rounded-2xl p-6 border">
            <Sparkles className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Want to learn more?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a free account for personalized discovery and to save your favorite verses.
            </p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold">
                Sign Up — Free
              </button>
              <button className="flex-1 py-3 rounded-xl border font-semibold">
                Continue Exploring
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          {[
            { icon: BookOpen, label: "Discover", active: true },
            { icon: Search, label: "Search", active: false },
            { icon: Globe, label: "Questions", active: false },
            { icon: Heart, label: "Saved", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-blue-600" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}