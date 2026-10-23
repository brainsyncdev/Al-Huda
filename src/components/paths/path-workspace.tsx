"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePaths } from "@/lib/paths/context";
import type { AyahRef } from "@/lib/quran/types";
import type { ProvenanceRecord, TargetAudience } from "@/lib/paths/types";
import { AUDIENCE_LABELS } from "@/lib/paths/data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Sparkles,
} from "lucide-react";
import { AyahCard } from "@/components/quran/ayah-card";

export interface PathStepDTO {
  order: number;
  ref: AyahRef;
  topicSlug?: string;
  objective: string;
  reflectionPrompt?: string;
  arabic: string;
  translation: string;
  transliteration: string;
  surahTransliteration: string;
}

interface PathMeta {
  slug: string;
  title: string;
  arabicTitle: string;
  summary: string;
  targetAudience: TargetAudience;
  related: string[];
  provenance: ProvenanceRecord;
  totalSteps: number;
}

interface PathWorkspaceProps {
  path: PathMeta;
  steps: PathStepDTO[];
}

export function PathWorkspace({ path, steps }: PathWorkspaceProps) {
  const { hydrated, startPath, completeStep, isStepComplete, getProgress } =
    usePaths();
  const [currentStep, setCurrentStep] = useState(1);
  const [nowMs, setNowMs] = useState<number | null>(null);

  // Hydration gate + time refresh (same pattern as revision workspace).
  useEffect(() => {
    if (!hydrated) return;
    setNowMs(Date.now());
    const interval = setInterval(() => setNowMs(Date.now()), 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") setNowMs(Date.now());
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [hydrated]);

  // Auto-start path on first visit.
  useEffect(() => {
    if (hydrated) {
      startPath(path.slug);
    }
  }, [hydrated, path.slug, startPath]);

  const handleCompleteStep = useCallback(() => {
    completeStep(path.slug, currentStep);
    // Auto-advance to next step if available.
    if (currentStep < path.totalSteps) {
      setTimeout(() => setCurrentStep((s) => s + 1), 300);
    }
  }, [path.slug, currentStep, path.totalSteps, completeStep]);

  if (!hydrated || nowMs === null) {
    return (
      <div role="status" className="space-y-6">
        <div className="h-8 bg-muted rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-64 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  const step = steps.find((s) => s.order === currentStep);
  const progress = getProgress(path.slug);
  const completedCount = progress?.completedSteps.length ?? 0;
  const percentage = path.totalSteps > 0 ? (completedCount / path.totalSteps) * 100 : 0;
  const isComplete = isStepComplete(path.slug, currentStep);

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="space-y-3">
        <Link
          href="/learn/paths"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to paths
        </Link>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {path.title}
          </h1>
          <p className="text-lg text-muted-foreground">{path.arabicTitle}</p>
          <p className="text-muted-foreground max-w-2xl">{path.summary}</p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {completedCount} of {path.totalSteps} steps completed
            </span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Audience badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <Sparkles className="h-3 w-3" aria-hidden />
          {AUDIENCE_LABELS[path.targetAudience]}
        </div>
      </header>

      {/* Step navigation */}
      <nav aria-label="Step navigation" className="flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((s) => {
          const completed = isStepComplete(path.slug, s.order);
          const isCurrent = s.order === currentStep;
          return (
            <button
              key={s.order}
              onClick={() => setCurrentStep(s.order)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : completed
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary"
              )}
              aria-current={isCurrent ? "step" : undefined}
            >
              {completed ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden />
              ) : (
                <Circle className="h-4 w-4" aria-hidden />
              )}
              Step {s.order}
            </button>
          );
        })}
      </nav>

      {/* Current step */}
      {step && (
        <section aria-labelledby="step-objective" className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="space-y-2">
              <h2 id="step-objective" className="font-display text-xl font-semibold text-foreground">
                Objective
              </h2>
              <p className="text-foreground">{step.objective}</p>
            </div>

            {step.reflectionPrompt && (
              <div className="space-y-2 rounded-xl bg-accent/50 p-4">
                <h3 className="text-sm font-semibold text-accent-foreground">
                  Reflection prompt
                </h3>
                <p className="text-accent-foreground italic">
                  {step.reflectionPrompt}
                </p>
              </div>
            )}

            {/* Ayah display */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Verse {step.ref.surah}:{step.ref.ayah}
              </h3>
              <AyahCard
                ayah={{
                  surah: step.ref.surah,
                  ayah: step.ref.ayah,
                  arabic: step.arabic,
                  translation: step.translation,
                  transliteration: step.transliteration,
                }}
                surahTransliteration={step.surahTransliteration}
                variant="full"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/80">
              <button
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Previous
              </button>

              {!isComplete ? (
                <button
                  onClick={handleCompleteStep}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Mark complete
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium">
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Completed
                </span>
              )}

              {currentStep < path.totalSteps ? (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Next
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              ) : (
                <Link
                  href="/learn/paths"
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                >
                  Back to paths
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Provenance notice */}
      <footer className="rounded-xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
        <p>
          <strong>Editorial status:</strong> This path is{" "}
          <em>{path.provenance.status.replace(/-/g, " ")}</em>. The content has
          been curated by the Al-Huda editorial team but has not yet been
          reviewed by a qualified scholar. Nothing here is presented as
          authoritative religious interpretation.
        </p>
      </footer>
    </div>
  );
}
