"use client";

// Learning hub — personalized entry point for guided learning.
//
// Shows recommended paths based on the learner's onboarding goal, or a
// general invitation to start learning if onboarding hasn't been completed.
// Reads from localStorage via the paths context, so it is client-only.

import Link from "next/link";
import { ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { usePaths } from "@/lib/paths/context";
import {
  AUDIENCE_LABELS,
  getPath,
  RECOMMENDED_PATHS,
} from "@/lib/paths/data";
import { useTranslation, useI18n } from "@/lib/i18n/context";

export function LearningHub() {
  const { hydrated, state } = usePaths();
  const t = useTranslation();
  const { n } = useI18n();

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-6">
        <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
          <div className="h-16 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  const { onboardingCompleted, selectedGoal, progress } = state;

  // If onboarding is complete and a goal is selected, show recommended paths.
  if (onboardingCompleted && selectedGoal) {
    const recommended = RECOMMENDED_PATHS[selectedGoal]
      .map(getPath)
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .slice(0, 2);

    if (recommended.length > 0) {
      return (
        <section
          aria-labelledby="learning-hub-heading"
          className="rounded-2xl border border-border/80 bg-card p-6"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-4 w-4" aria-hidden />
            <h2
              id="learning-hub-heading"
              className="text-xs font-semibold uppercase tracking-wider"
            >
              {t("home.continueLearning")}
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("home.recommendedFor", { audience: AUDIENCE_LABELS[selectedGoal] })}
          </p>
          <ul className="mt-4 space-y-2.5">
            {recommended.map((path) => {
              const prog = progress[path.slug];
              const completedCount = prog?.completedSteps.length ?? 0;
              const percentage =
                path.steps.length > 0
                  ? (completedCount / path.steps.length) * 100
                  : 0;
              const started = Boolean(prog);

              return (
                <li key={path.slug}>
                  <Link
                    href={`/learn/paths/${path.slug}`}
                    className="group flex items-center gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {path.title}
                      </p>
                      {started ? (
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {n(completedCount)}/{n(path.steps.length)}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {n(path.steps.length)} {t("home.steps")}
                        </p>
                      )}
                    </div>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/learn/paths"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("home.allLearningPaths")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      );
    }
  }

  // Default: invite to onboarding or browse paths.
  return (
    <section
      aria-labelledby="learning-hub-heading"
      className="rounded-2xl border border-border/80 bg-card p-6"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <GraduationCap className="h-4 w-4" aria-hidden />
        <h2
          id="learning-hub-heading"
          className="text-xs font-semibold uppercase tracking-wider"
        >
          {t("home.startLearning")}
        </h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("home.learningHubDescription")}
      </p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t("home.takeGuidedTour")}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        <Link
          href="/learn/paths"
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {t("home.browsePaths")}
        </Link>
      </div>
    </section>
  );
}
