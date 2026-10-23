"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePaths } from "@/lib/paths/context";
import {
  AUDIENCE_LABELS,
  AUDIENCE_DESCRIPTIONS,
  RECOMMENDED_PATHS,
  getPath,
} from "@/lib/paths/data";
import type { TargetAudience } from "@/lib/paths/types";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen } from "lucide-react";

const AUDIENCES: TargetAudience[] = [
  "new-muslim",
  "regular-reader",
  "student",
  "explorer",
];

export function OnboardingClient() {
  const router = useRouter();
  const { hydrated, setGoal, completeOnboarding } = usePaths();
  const [selectedGoal, setSelectedGoal] = useState<TargetAudience | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  if (!hydrated) {
    return (
      <div role="status" className="min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleContinue = () => {
    if (!selectedGoal) return;

    if (step === 1) {
      setGoal(selectedGoal);
      setStep(2);
    } else {
      completeOnboarding();
      // Navigate to recommended path.
      const recommended = RECOMMENDED_PATHS[selectedGoal];
      if (recommended.length > 0) {
        router.push(`/learn/paths/${recommended[0]}`);
      } else {
        router.push("/learn/paths");
      }
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.push("/learn/paths");
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-12">
        <header className="space-y-3 text-center">
          <h1 className="font-display text-4xl font-semibold text-foreground">
            Welcome to Al-Huda
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your learning goal to get personalized recommendations.
          </p>
        </header>

        <div className="space-y-3">
          {AUDIENCES.map((audience) => (
            <button
              key={audience}
              onClick={() => setSelectedGoal(audience)}
              className={cn(
                "w-full rounded-2xl border-2 p-5 text-left transition-all",
                selectedGoal === audience
                  ? "border-primary bg-primary/5"
                  : "border-border/80 bg-card hover:border-primary/30 hover:bg-secondary/50"
              )}
            >
              <div className="space-y-1">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {AUDIENCE_LABELS[audience]}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {AUDIENCE_DESCRIPTIONS[audience]}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            disabled={!selectedGoal}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Show recommended paths.
  const recommended = selectedGoal ? RECOMMENDED_PATHS[selectedGoal] : [];
  const recommendedPaths = recommended
    .map((slug) => getPath(slug))
    .filter((p) => p !== null);

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-12">
      <header className="space-y-3 text-center">
        <h1 className="font-display text-4xl font-semibold text-foreground">
          Recommended for you
        </h1>
        <p className="text-lg text-muted-foreground">
          Based on your goal, we recommend starting with these paths.
        </p>
      </header>

      <div className="space-y-3">
        {recommendedPaths.map((path, index) => (
          <div
            key={path!.slug}
            className="rounded-2xl border border-border/80 bg-card p-5 space-y-2"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {path!.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {path!.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  {path!.steps.length} steps
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center pt-4">
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <BookOpen className="h-5 w-5" aria-hidden />
          Start learning
        </button>
      </div>
    </div>
  );
}
