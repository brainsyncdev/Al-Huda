"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Users, ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import { ModeSelector } from "@/components/onboarding/ModeSelector";
import { themes } from "@/data/quran-data";

export default function HomePage() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <ModeSelector onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg" dir="rtl">ھ</span>
          </div>
          <span className="font-semibold text-foreground">Al-Huda</span>
        </div>
        <Link
          href="/quran"
          className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
        >
          Open App
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          {/* Bismillah */}
          <p className="arabic-text text-4xl text-primary mb-6" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            The Book That
            <span className="text-primary"> Speaks To You</span>
          </h1>

          <p className="urdu-text text-xl text-muted-foreground mb-8" dir="rtl">
            قرآن — سمجھیں، زندگی بدلیں
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            1.8 billion people recite the Quran daily. Most don't understand what they're saying.
            <br />
            <span className="font-medium text-foreground">Al-Huda reconnects you — to the complete Quran.</span>
          </p>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <ModeCard
              icon="🌙"
              title="NOOR"
              subtitle="نور"
              description="Kids Age 3-12"
              details="Storytelling • Arabic Learning • Games"
              color="from-purple-500 to-purple-600"
              href="/noor"
            />
            <ModeCard
              icon="📖"
              title="FAHM"
              subtitle="فہم"
              description="Muslims Age 13+"
              details="Tilawat • Guidance • Hifz Engine"
              color="from-teal-600 to-teal-700"
              href="/fahm"
              featured
            />
            <ModeCard
              icon="🔍"
              title="EXPLORE"
              subtitle="کشف"
              description="Non-Muslims & Seekers"
              details="Discovery • No Pressure • Wisdom"
              color="from-blue-500 to-blue-600"
              href="/explore"
            />
          </div>

          {/* Verse */}
          <div className="bg-card rounded-2xl p-8 shadow-sm border max-w-2xl mx-auto">
            <p className="arabic-text text-2xl text-foreground mb-4" dir="rtl">
              أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ
            </p>
            <p className="urdu-text text-lg text-muted-foreground mb-2" dir="rtl">
              کیا وہ قرآن میں غور و فکر نہیں کرتے؟
            </p>
            <p className="text-sm text-muted-foreground">
              "Do they not reflect on the Quran?" — Surah An-Nisa 4:82
            </p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20"
        >
          <h2 className="text-2xl font-bold text-center mb-12">What Makes Al-Huda Different</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Living Knowledge Graph"
              description="Every ayah connected to 6 others. Explore themes, roots, and stories across 6,236 verses."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Personalized Guidance"
              description="Tell us your situation. The Quran speaks back with authentic, verified answers."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="3 Modes, 1 App"
              description="Kids learn through stories. Muslims understand what they recite. Seekers explore freely."
            />
            <FeatureCard
              icon={<Heart className="h-6 w-6" />}
              title="10 Dimensions"
              description="Spiritual, Economic, Intellectual, Family, Social — the complete Quran, not just 5 topics."
            />
            <FeatureCard
              icon={<Star className="h-6 w-6" />}
              title="Root Word System"
              description="Learn 500 Arabic roots. Cover 70% of the Quran. Read with understanding."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Authentic Sources"
              description="Every ayah cited from Tanzil.net. Every hadith from sunnah.com. Verify everything."
            />
          </div>
        </motion.div>

        {/* Themes Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Explore by Theme</h2>
          <p className="text-muted-foreground mb-8">The complete Quran — all 10 dimensions</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {themes.map((theme) => (
              <Link
                key={theme.id}
                href={`/explore/theme/${theme.nameEnglish.toLowerCase()}`}
                className="px-4 py-2 rounded-full bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
              >
                {theme.icon} {theme.nameUrdu}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-primary/5 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold mb-2">Ready to Experience the Quran?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands rediscovering the Book that speaks to their life.
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Start Your Journey
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Al-Huda — "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ"
          </p>
          <p className="text-xs text-muted-foreground">
            Quran text from Tanzil.net • Hadith from sunnah.com • All sources verified
          </p>
        </div>
      </footer>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  subtitle,
  description,
  details,
  color,
  href,
  featured = false,
}: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  details: string;
  color: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative rounded-2xl p-6 bg-gradient-to-br ${color} text-white cursor-pointer ${
          featured ? "ring-2 ring-accent ring-offset-4" : ""
        }`}
      >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-80 mb-3" dir="rtl">{subtitle}</p>
        <p className="text-sm font-medium mb-1">{description}</p>
        <p className="text-xs opacity-70">{details}</p>
        {featured && (
          <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">
            Most Popular
          </div>
        )}
      </motion.div>
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}