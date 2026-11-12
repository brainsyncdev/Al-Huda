"use client";

// Client component for tracking study journey progress.
//
// Uses the JourneysProvider context to manage progress state. Shows a progress
// bar and allows learners to mark stages as complete.

import { useJourneys } from "@/lib/study-journeys/context";
import { getJourney } from "@/lib/study-journeys/data";
import { useTranslation } from "@/lib/i18n/context";
import { CheckCircle, Circle, Play } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

interface JourneyProgressTrackerProps {
  journeySlug: string;
}

export function JourneyProgressTracker({
  journeySlug,
}: JourneyProgressTrackerProps) {
  const { hydrated, startJourney, completeStage, isStageComplete, getProgress } =
    useJourneys();
  const t = useTranslation();

  const journey = getJourney(journeySlug);
  const progress = getProgress(journeySlug);

  // Auto-start the journey when the page loads (if not already started).
  useEffect(() => {
    if (hydrated && journey && !progress) {
      startJourney(journeySlug);
      toast.success(t("learn.journeyStarted"), {
        description: t("learn.journeyStartedDescription"),
      });
    }
  }, [hydrated, journey, progress, journeySlug, startJourney, t]);

  if (!hydrated || !journey) {
    return null;
  }

  const totalStages = journey.stages.length;
  const completedCount = progress?.completedStages.length ?? 0;
  const progressPercent = totalStages > 0 ? (completedCount / totalStages) * 100 : 0;
  const isComplete = completedCount === totalStages;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          Your Progress
        </h2>
        <span className="text-sm text-muted-foreground">
          {completedCount} of {totalStages} stages
        </span>
      </div>

      <div className="space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {isComplete && (
          <p className="text-sm font-medium text-primary">
            ✓ Journey complete
          </p>
        )}
      </div>

      <div className="space-y-2">
        {journey.stages.map((stage) => {
          const complete = isStageComplete(journeySlug, stage.order);
          return (
            <button
              key={stage.order}
              type="button"
              onClick={() => completeStage(journeySlug, stage.order)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                complete
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/80 bg-card hover:border-primary/30 hover:bg-secondary/40"
              }`}
              aria-label={`Mark stage ${stage.order} as ${complete ? "incomplete" : "complete"}`}
            >
              {complete ? (
                <CheckCircle className="h-5 w-5 flex-shrink-0 text-primary" />
              ) : (
                <Circle className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    complete ? "text-primary" : "text-foreground"
                  }`}
                >
                  Stage {stage.order}: {stage.title}
                </p>
              </div>
              {!complete && (
                <Play className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
