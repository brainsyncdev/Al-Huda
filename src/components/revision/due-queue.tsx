"use client";

// FR-051 — record review events and self-rated recall.
//
// ACTIVE RECALL, NOT RE-READING. The reference is shown and the verse text is
// withheld until the learner has attempted it, then fetched and revealed.
// Showing the translation up front would turn revision into recognition, which
// is the opposite of what a memorization schedule is for.
//
// The text is fetched from /api/v1/ayahs/:s/:a rather than bundled, because the
// dataset loader reads node:fs and cannot reach a client bundle. That endpoint
// returns the pinned Arabic verbatim, so the revealed text is the same bytes a
// reader page would show.
//
// The response is validated before anything is rendered as Quran text. A
// truncated or malformed payload must never be dressed up as a verse; if a
// field is missing, nothing is shown and the gap is stated.
//
// "Not now" adds the reference to a session-local skip set instead of touching
// the schedule. Deferring a verse within one sitting is not a missed review and
// must not reset its step — that is the no-shame requirement (FR-053) applied
// to the interaction design, not just to the copy.

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Eye, Loader2, RotateCcw } from "lucide-react";
import { AyahCard } from "@/components/quran/ayah-card";
import { useRevision } from "@/lib/revision/context";
import { getLadder, type Rating, type RevisionItem } from "@/lib/revision/scheduling";
import type { Ayah } from "@/lib/quran/types";
import type { SurahOption } from "@/lib/revision/surah-options";
import { cn } from "@/lib/utils";

interface RevealedVerse {
  reference: string;
  ayah: Ayah;
  surahName: string;
}

const RATING_BUTTONS: Array<{
  rating: Rating;
  label: string;
  hint: string;
  className: string;
}> = [
  {
    rating: "missed",
    label: "Missed it",
    hint: "Back to the shortest gap",
    className:
      "border-border bg-background text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring",
  },
  {
    rating: "difficult",
    label: "Difficult",
    hint: "Same gap again",
    className:
      "border-border bg-background text-foreground hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring",
  },
  {
    rating: "easy",
    label: "Easy",
    hint: "Longer gap next time",
    className:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring",
  },
];

export function DueQueue({
  due,
  surahOptions,
}: {
  due: RevisionItem[];
  surahOptions: SurahOption[];
}) {
  const { rate } = useRevision();

  const [revealed, setRevealed] = useState<RevealedVerse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set());
  const abortRef = useRef<AbortController | null>(null);

  // Cancel an in-flight fetch if the card unmounts mid-request.
  useEffect(() => () => abortRef.current?.abort(), []);

  const queue = due.filter((item) => !skipped.has(item.reference));
  const current = queue[0] ?? null;

  // Resetting the reveal when the current verse changes keeps a previous
  // verse's text from flashing under a new reference.
  useEffect(() => {
    setRevealed(null);
    setError(null);
  }, [current?.reference]);

  const reveal = useCallback(async (item: RevisionItem) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/v1/ayahs/${item.surah}/${item.ayah}`, {
        signal: controller.signal,
      });
      const payload = (await res.json().catch(() => null)) as {
        data?: Record<string, unknown>;
        error?: { message?: string };
      } | null;

      if (!res.ok) {
        setError(
          payload?.error?.message ??
            `The verse text could not be loaded (status ${res.status}).`
        );
        return;
      }

      const data = payload?.data;
      // Boundary validation: never render a partially-assembled verse as Quran.
      if (
        typeof data?.arabic !== "string" ||
        typeof data?.translation !== "string" ||
        typeof data?.transliteration !== "string"
      ) {
        setError(
          "The verse text came back incomplete, so nothing is shown. Nothing is invented to fill the gap."
        );
        return;
      }

      const surahInformation = data.surahInformation as
        | { transliteration?: unknown }
        | undefined;

      setRevealed({
        reference: item.reference,
        ayah: {
          surah: item.surah,
          ayah: item.ayah,
          arabic: data.arabic,
          translation: data.translation,
          transliteration: data.transliteration,
        },
        surahName:
          typeof surahInformation?.transliteration === "string"
            ? surahInformation.transliteration
            : `Surah ${item.surah}`,
      });
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      setError("The verse text could not be reached. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleRating(item: RevisionItem, rating: Rating) {
    rate(item.reference, rating);
    setRevealed(null);
    setError(null);
  }

  function handleSkip(item: RevisionItem) {
    setSkipped((previous) => new Set(previous).add(item.reference));
    setRevealed(null);
    setError(null);
  }

  // --- Empty states -------------------------------------------------------

  if (due.length === 0) {
    return (
      <section
        aria-labelledby="due-heading"
        className="rounded-2xl border border-border/80 bg-card p-5"
      >
        <h2
          id="due-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Due today
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Nothing is scheduled for today. Verses return to the queue on their
          own dates — there is nothing to catch up on and nothing is counted
          against you for resting.
        </p>
      </section>
    );
  }

  if (!current) {
    return (
      <section
        aria-labelledby="due-heading"
        className="rounded-2xl border border-border/80 bg-card p-5"
      >
        <h2
          id="due-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Due today
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          You have set aside the remaining {due.length} verse
          {due.length === 1 ? "" : "s"} for this sitting. Setting a verse aside
          does not change its schedule or count as a missed review.
        </p>
        <button
          type="button"
          onClick={() => setSkipped(new Set())}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Bring them back
        </button>
      </section>
    );
  }

  const ladder = getLadder(current.ladderId);
  const surahName =
    surahOptions.find((option) => option.id === current.surah)?.transliteration ??
    `Surah ${current.surah}`;

  return (
    <section
      aria-labelledby="due-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="due-heading"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Due today
        </h2>
        {/* aria-live so progress is announced, not just visible (PRD §11). */}
        <p aria-live="polite" className="text-xs tabular-nums text-muted-foreground">
          {queue.length} remaining
          {skipped.size > 0 ? ` · ${skipped.size} set aside` : ""}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {surahName} · {current.reference}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Step {current.step + 1} of {ladder.intervals.length} ·{" "}
          {ladder.label} spacing · reviewed {current.reviewCount} time
          {current.reviewCount === 1 ? "" : "s"}
        </p>
      </div>

      {!revealed ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border bg-background/60 p-6 text-center">
          <p className="mx-auto max-w-prose text-sm leading-relaxed text-foreground/85">
            Recite it from memory, then reveal the verse to check yourself.
            Nothing is shown until you ask — reading along instead of recalling
            is what makes revision feel productive without retaining anything.
          </p>
          <button
            type="button"
            onClick={() => void reveal(current)}
            disabled={loading}
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors",
              "hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring",
              "disabled:cursor-not-allowed disabled:opacity-60"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Loading
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" aria-hidden />
                Reveal verse
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {/* Reusing the reader's card keeps Quran typography, reader
              preferences, and attribution identical to every other page. */}
          <AyahCard
            ayah={revealed.ayah}
            surahTransliteration={revealed.surahName}
            variant="full"
            allowNotes={false}
          />

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              How did it go?
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {RATING_BUTTONS.map(({ rating, label, hint, className }) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => handleRating(current, rating)}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    className
                  )}
                >
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="mt-0.5 block text-xs opacity-80">{hint}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => handleSkip(current)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
        >
          Not now
        </button>
        <p className="text-xs text-muted-foreground">
          Setting a verse aside only moves it out of this sitting. Its scheduled
          date is unchanged.
        </p>
      </div>
    </section>
  );
}
