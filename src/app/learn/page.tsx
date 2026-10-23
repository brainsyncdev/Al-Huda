import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Sparkles } from "lucide-react";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Learn — Al-Huda",
  description: "Personalized Quran learning dashboard",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/learn") },
};

export default function LearnPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Learning hub
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Your personalized entry point for guided Quran study. Continue where you left off, revise what you've learned, or explore new topics.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Learning Paths */}
        <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-5 w-5" aria-hidden />
            <h2 className="font-display text-xl font-semibold">Learning paths</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Structured curriculum for guided Quran study. Each path is designed for a specific audience and learning goal.
          </p>
          <Link
            href="/learn/paths"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse paths
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        {/* Revision */}
        <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-5 w-5" aria-hidden />
            <h2 className="font-display text-xl font-semibold">Revision</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            A quiet schedule for the ayat you are memorizing. Add verses, recall them from memory, and rate how it went.
          </p>
          <Link
            href="/learn/revision"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start revising
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>

        {/* Quiz */}
        <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-5 w-5" aria-hidden />
            <h2 className="font-display text-xl font-semibold">Self-assessment quiz</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Check what you already know and what is worth revisiting. No timers, no rankings.
          </p>
          <Link
            href="/learn/quiz"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Take a quiz
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>
    </div>
  );
}
