"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";
import { useLibrary } from "@/lib/library/context";
import { usePaths } from "@/lib/paths/context";
import { useQuiz } from "@/lib/quiz/context";
import { useRevision } from "@/lib/revision/context";
import { useReadingPlans } from "@/lib/reading-plans/context";
import { dueItems } from "@/lib/revision/scheduling";
import { PATHS } from "@/lib/paths/data";
import { cn } from "@/lib/utils";

/**
 * Personalized learning dashboard — answers "what can I continue / revise /
 * have studied / do next" using only real locally stored state.
 *
 * Deterministic, explainable recommendations. No external AI, no fabricated
 * progress. Clear empty states when nothing exists yet.
 */
export function LearningDashboard() {
  const library = useLibrary();
  const paths = usePaths();
  const quiz = useQuiz();
  const revision = useRevision();
  const readingPlans = useReadingPlans();

  const ready =
    library.hydrated &&
    paths.hydrated &&
    quiz.hydrated &&
    revision.hydrated &&
    readingPlans.hydrated;

  // Compute recommendations from real state.
  const analysis = useMemo(() => {
    if (!ready) return null;

    // Continue: most recent activity across all stores.
    const latestProgress = library.progress[0] ?? null;
    const inProgressPaths = Object.values(paths.state.progress)
      .filter((p) => {
        const path = PATHS.find((path) => path.slug === p.pathSlug);
        if (!path) return false;
        return p.completedSteps.length < path.steps.length;
      })
      .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
    const inProgressPath = inProgressPaths[0] ?? null;
    const currentQuizAttempt = quiz.state.currentAttemptId
      ? quiz.state.attempts.find((a) => a.id === quiz.state.currentAttemptId)
      : null;

    // Revise: due revision items.
    const nowMs = Date.now();
    const due = dueItems(revision.state, nowMs);

    // Reading plans: active (not paused) targets.
    const activeReadingPlans = readingPlans.state.targets.filter((t) => !t.paused);

    // Studied: completed paths, completed quiz attempts, revision items total.
    const completedPaths = Object.values(paths.state.progress).filter((p) => {
      const path = PATHS.find((path) => path.slug === p.pathSlug);
      if (!path) return false;
      return p.completedSteps.length >= path.steps.length;
    });
    const completedQuizAttempts = quiz.state.attempts.filter(
      (a) => a.completedAt !== null
    );
    const revisionItemsTotal = Object.keys(revision.items).length;

    // Do next: deterministic recommendation.
    let recommendation: {
      label: string;
      description: string;
      href: string;
      icon: typeof BookOpen;
    } | null = null;

    if (due.length > 0) {
      recommendation = {
        label: "Revise due ayat",
        description: `${due.length} ${due.length === 1 ? "verse is" : "verses are"} due for review today.`,
        href: "/learn/revision",
        icon: BookOpen,
      };
    } else if (currentQuizAttempt) {
      recommendation = {
        label: "Continue quiz",
        description: "You have an in-progress quiz session.",
        href: "/learn/quiz",
        icon: Sparkles,
      };
    } else if (inProgressPath) {
      const path = PATHS.find((p) => p.slug === inProgressPath.pathSlug);
      recommendation = {
        label: path ? `Continue ${path.title}` : "Continue learning path",
        description: path
          ? `${inProgressPath.completedSteps.length} of ${path.steps.length} steps complete.`
          : "Pick up where you left off.",
        href: `/learn/paths/${inProgressPath.pathSlug}`,
        icon: GraduationCap,
      };
    } else if (activeReadingPlans.length > 0) {
      const plan = activeReadingPlans[0];
      recommendation = {
        label: `Continue reading: ${plan.label}`,
        description: "Resume your reading plan.",
        href: "/learn/plans",
        icon: Target,
      };
    } else if (completedPaths.length === 0 && completedQuizAttempts.length === 0) {
      recommendation = {
        label: "Start with a learning path",
        description: "Guided curriculum for structured Quran study.",
        href: "/learn/paths",
        icon: GraduationCap,
      };
    } else {
      recommendation = {
        label: "Take a self-assessment quiz",
        description: "Check what you know and what is worth revisiting.",
        href: "/learn/quiz",
        icon: Sparkles,
      };
    }

    return {
      latestProgress,
      inProgressPath,
      currentQuizAttempt,
      due,
      activeReadingPlans,
      completedPaths,
      completedQuizAttempts,
      revisionItemsTotal,
      recommendation,
    };
  }, [ready, library, paths, quiz, revision, readingPlans]);

  if (!ready || !analysis) {
    return (
      <div role="status" className="space-y-4">
        <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  const isEmpty =
    analysis.latestProgress === null &&
    analysis.inProgressPath === null &&
    analysis.currentQuizAttempt === null &&
    analysis.due.length === 0 &&
    analysis.activeReadingPlans.length === 0 &&
    analysis.completedPaths.length === 0 &&
    analysis.completedQuizAttempts.length === 0 &&
    analysis.revisionItemsTotal === 0;

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Learning hub
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Your personalized entry point for guided Quran study. Continue where
          you left off, revise what you&apos;ve learned, or explore new topics.
        </p>
      </header>

      {/* Empty state */}
      {isEmpty && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold">Start your learning journey</h2>
          <p className="max-w-md mx-auto text-sm text-muted-foreground">
            You haven&apos;t started any paths, quizzes, or revision plans yet.
            Begin with a guided learning path to build a foundation.
          </p>
          <Link
            href="/learn/paths"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Browse learning paths
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      )}

      {/* Recommendation */}
      {!isEmpty && analysis.recommendation && (
        <section className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
              <analysis.recommendation.icon
                className="h-5 w-5 text-primary"
                aria-hidden
              />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="font-display text-lg font-semibold">
                {analysis.recommendation.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                {analysis.recommendation.description}
              </p>
            </div>
            <Link
              href={analysis.recommendation.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      )}

      {/* Stats */}
      {!isEmpty && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Due for review"
            value={analysis.due.length}
            href="/learn/revision"
            icon={BookOpen}
            tone={analysis.due.length > 0 ? "primary" : "muted"}
          />
          <StatCard
            label="Paths in progress"
            value={
              Object.values(paths.state.progress).filter((p) => {
                const path = PATHS.find((path) => path.slug === p.pathSlug);
                return path && p.completedSteps.length < path.steps.length;
              }).length
            }
            href="/learn/paths"
            icon={GraduationCap}
            tone="muted"
          />
          <StatCard
            label="Quiz attempts"
            value={analysis.completedQuizAttempts.length}
            href="/learn/quiz"
            icon={Sparkles}
            tone="muted"
          />
          <StatCard
            label="Revision plan"
            value={analysis.revisionItemsTotal}
            href="/learn/revision"
            icon={Target}
            tone="muted"
          />
        </div>
      )}

      {/* Continue section */}
      {!isEmpty && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Continue where you left off</h2>

          {/* Recent reading */}
          {analysis.latestProgress && (
            <ContinueCard
              title={`Last read: Surah ${analysis.latestProgress.surah}:${analysis.latestProgress.ayah}`}
              description={`Read on ${new Date(analysis.latestProgress.at).toLocaleDateString()}`}
              href={`/ayah/${analysis.latestProgress.surah}/${analysis.latestProgress.ayah}`}
              icon={BookOpen}
            />
          )}

          {/* In-progress path */}
          {analysis.inProgressPath && (() => {
            const path = PATHS.find((p) => p.slug === analysis.inProgressPath!.pathSlug);
            if (!path) return null;
            const total = path.steps.length;
            const done = analysis.inProgressPath.completedSteps.length;
            const pct = Math.round((done / total) * 100);
            return (
              <ContinueCard
                title={path.title}
                description={`${done} of ${total} steps complete (${pct}%)`}
                href={`/learn/paths/${path.slug}`}
                icon={GraduationCap}
                arabicTitle={path.arabicTitle}
              />
            );
          })()}

          {/* In-progress quiz */}
          {analysis.currentQuizAttempt && (
            <ContinueCard
              title="In-progress quiz"
              description={`${Object.keys(analysis.currentQuizAttempt.responses).length} of ${analysis.currentQuizAttempt.questions.length} questions answered`}
              href="/learn/quiz"
              icon={Sparkles}
            />
          )}

          {/* Active reading plans */}
          {analysis.activeReadingPlans.map((plan) => (
            <ContinueCard
              key={plan.id}
              title={`Reading plan: ${plan.label}`}
              description={`Goal: ${plan.goalPerSession} ayat per session`}
              href="/learn/plans"
              icon={Target}
            />
          ))}
        </section>
      )}

      {/* Quick links */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          title="Learning paths"
          description="Structured curriculum for guided study"
          href="/learn/paths"
          icon={GraduationCap}
        />
        <QuickLink
          title="Revision"
          description="Spaced repetition for memorization"
          href="/learn/revision"
          icon={BookOpen}
        />
        <QuickLink
          title="Self-assessment quiz"
          description="Check what you know"
          href="/learn/quiz"
          icon={Sparkles}
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  icon: typeof BookOpen;
  tone: "primary" | "muted";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-4 space-y-2 transition-colors hover:bg-secondary/40",
        tone === "primary" && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-2xl font-semibold">{value}</p>
    </Link>
  );
}

function ContinueCard({
  title,
  description,
  href,
  icon: Icon,
  arabicTitle,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
  arabicTitle?: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:bg-secondary/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
        <Icon className="h-5 w-5 text-secondary-foreground" aria-hidden />
      </div>
      <div className="flex-1 min-w-0 space-y-0.5">
        <h3 className="font-medium text-foreground truncate">
          {arabicTitle && (
            <span className="arabic-display text-base text-gold mr-2">
              {arabicTitle}
            </span>
          )}
          {title}
        </h3>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}

function QuickLink({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: typeof BookOpen;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 transition-colors hover:bg-secondary/40"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden />
        <h3 className="font-display text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
        Explore
        <ArrowRight className="h-4 w-4" aria-hidden />
      </div>
    </Link>
  );
}
