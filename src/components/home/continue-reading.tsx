"use client";

import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { useLibrary } from "@/lib/library/context";

/**
 * "Continue reading" card: links to the most recent ayah visited from the
 * local library. Renders nothing when there is no history (no guilt-tripping,
 * no fake streaks — PRD §10).
 */
export function ContinueReading() {
  const { progress, hydrated } = useLibrary();

  if (!hydrated || progress.length === 0) return null;
  const last = progress[0];

  return (
    <section
      aria-labelledby="continue-reading-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <BookOpen className="h-4 w-4" aria-hidden />
        <h2
          id="continue-reading-heading"
          className="text-xs font-semibold uppercase tracking-wider"
        >
          Continue reading
        </h2>
      </div>

      <Link
        href={`/ayah/${last.surah}/${last.ayah}`}
        className="mt-3 flex items-center justify-between gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-secondary/60"
      >
        <div>
          <p className="font-display text-lg font-semibold text-foreground">
            Ayah {last.surah}:{last.ayah}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Last visited {new Date(last.at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <ChevronRight
          className="h-5 w-5 shrink-0 text-muted-foreground"
          aria-hidden
        />
      </Link>
    </section>
  );
}
