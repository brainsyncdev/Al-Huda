"use client";

// Client component for displaying stages with completion indicators.
// Wraps the stage list to access journey progress context.

import { useJourneys } from "@/lib/study-journeys/context";
import { useTranslation } from "@/lib/i18n/context";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { StudyJourney, JourneyStage } from "@/lib/study-journeys/types";
import type { Topic } from "@/lib/topics/data";
import type { Ayah, Surah } from "@/lib/quran/types";

interface ResolvedStage {
  stage: JourneyStage;
  topic: Topic | null | undefined;
  ayah: Ayah | null;
  surah: Surah | null;
}

interface StageListProps {
  journey: StudyJourney;
  resolvedStages: ResolvedStage[];
}

export function StageList({ journey, resolvedStages }: StageListProps) {
  const { isStageComplete } = useJourneys();
  const t = useTranslation();

  return (
    <ol className="space-y-4">
      {resolvedStages.map(({ stage, topic, ayah, surah }) => {
        const complete = isStageComplete(journey.slug, stage.order);
        return (
          <li
            key={stage.order}
            className={`rounded-2xl border p-5 ${
              complete
                ? "border-primary/30 bg-primary/5"
                : "border-border/80 bg-card"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-semibold text-sm ${
                  complete
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {complete ? (
                  <CheckCircle
                    className="h-5 w-5"
                    aria-label={t("learn.stageCompleted")}
                  />
                ) : (
                  stage.order
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-display text-lg font-semibold tracking-tight ${
                      complete ? "text-primary" : ""
                    }`}
                  >
                    {stage.title}
                  </h3>
                  {complete && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <CheckCircle className="h-3 w-3" aria-hidden />
                      {t("learn.stageCompleted")}
                    </span>
                  )}
                </div>
                {stage.objective && (
                  <p className="text-sm text-muted-foreground">
                    {stage.objective}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {topic && (
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 font-medium text-secondary-foreground hover:bg-secondary"
                    >
                      {topic.title}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  )}
                  {ayah && surah && (
                    <Link
                      href={`/ayah/${ayah.surah}/${ayah.ayah}`}
                      className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-2.5 py-1 hover:border-primary/30 hover:bg-secondary/40"
                    >
                      {surah.transliteration} {ayah.ayah}
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
