"use client";

import Link from "next/link";
import { usePaths } from "@/lib/paths/context";
import type { LearningPath, TargetAudience } from "@/lib/paths/types";
import { BookOpen } from "lucide-react";

interface PathsByAudience {
  audience: TargetAudience;
  label: string;
  paths: LearningPath[];
}

interface PathsIndexClientProps {
  pathsByAudience: PathsByAudience[];
}

export function PathsIndexClient({ pathsByAudience }: PathsIndexClientProps) {
  const { hydrated, getProgress } = usePaths();

  if (!hydrated) {
    return (
      <div role="status" className="space-y-6">
        {pathsByAudience.map((group) => (
          <section key={group.audience} className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {group.label}
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {group.paths.map(() => (
                <div
                  key="skeleton"
                  className="rounded-2xl border border-border/80 bg-card p-5 animate-pulse"
                >
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-full mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {pathsByAudience.map((group) => (
        <section key={group.audience} aria-labelledby={`audience-${group.audience}`} className="space-y-4">
          <h2
            id={`audience-${group.audience}`}
            className="font-display text-xl font-semibold text-foreground"
          >
            {group.label}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {group.paths.map((path) => {
              const progress = getProgress(path.slug);
              const totalSteps = path.steps.length;
              const completedSteps = progress?.completedSteps.length ?? 0;
              const percentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

              return (
                <Link
                  key={path.slug}
                  href={`/learn/paths/${path.slug}`}
                  className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/50"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {path.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {path.summary}
                        </p>
                      </div>
                      <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" aria-hidden />
                    </div>

                    {progress && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {completedSteps} of {totalSteps} steps
                          </span>
                          <span>{Math.round(percentage)}%</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {!progress && (
                      <div className="text-xs text-muted-foreground">
                        {totalSteps} steps
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
