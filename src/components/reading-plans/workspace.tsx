"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Circle,
  Pause,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useReadingPlans } from "@/lib/reading-plans/context";
import type { SurahOption } from "@/lib/revision/surah-options";
import type { AyahRef } from "@/lib/quran/types";
import { cn } from "@/lib/utils";

interface ReadingPlansWorkspaceProps {
  surahOptions: SurahOption[];
}

export function ReadingPlansWorkspace({ surahOptions }: ReadingPlansWorkspaceProps) {
  const {
    hydrated,
    state,
    addTarget,
    updatePosition,
    pauseTarget,
    resumeTarget,
    removeTarget,
  } = useReadingPlans();

  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [startSurah, setStartSurah] = useState<number>(1);
  const [startAyah, setStartAyah] = useState<number>(1);
  const [endSurah, setEndSurah] = useState<number>(1);
  const [endAyah, setEndAyah] = useState<number>(1);
  const [goalPerSession, setGoalPerSession] = useState<number>(5);

  const startSurahMeta = useMemo(
    () => surahOptions.find((s) => s.id === startSurah),
    [surahOptions, startSurah]
  );
  const endSurahMeta = useMemo(
    () => surahOptions.find((s) => s.id === endSurah),
    [surahOptions, endSurah]
  );

  const addPlan = useCallback(() => {
    if (!label.trim()) return;
    if (!startSurahMeta || !endSurahMeta) return;

    // Validate ranges.
    if (startAyah < 1 || startAyah > startSurahMeta.ayahCount) return;
    if (endAyah < 1 || endAyah > endSurahMeta.ayahCount) return;

    // Validate ordering.
    if (startSurah > endSurah) return;
    if (startSurah === endSurah && startAyah > endAyah) return;

    const start: AyahRef = { surah: startSurah, ayah: startAyah };
    const end: AyahRef = { surah: endSurah, ayah: endAyah };

    addTarget({
      label: label.trim(),
      start,
      end,
      goalPerSession,
      currentPosition: start,
      paused: false,
    });

    // Reset form.
    setLabel("");
    setStartSurah(1);
    setStartAyah(1);
    setEndSurah(1);
    setEndAyah(1);
    setGoalPerSession(5);
    setShowForm(false);
  }, [
    label,
    startSurah,
    startAyah,
    endSurah,
    endAyah,
    goalPerSession,
    startSurahMeta,
    endSurahMeta,
    addTarget,
  ]);

  const markProgress = useCallback(
    (targetId: string, nextSurah: number, nextAyah: number) => {
      updatePosition(targetId, { surah: nextSurah, ayah: nextAyah });
    },
    [updatePosition]
  );

  if (!hydrated) {
    return (
      <div role="status" className="space-y-4">
        <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Reading plans
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Set personal reading targets for systematic Quran study. Track your
          progress through surahs or custom ranges.
        </p>
      </header>

      {/* Add new plan button */}
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" aria-hidden />
          New reading plan
        </button>
      )}

      {/* Add plan form */}
      {showForm && (
        <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
          <h2 className="font-display text-xl font-semibold">Create a reading plan</h2>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Plan label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Surah Al-Baqarah, Juz 1-5"
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Start</label>
              <div className="space-y-2">
                <select
                  value={startSurah}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setStartSurah(id);
                    const meta = surahOptions.find((s) => s.id === id);
                    if (meta && startAyah > meta.ayahCount) {
                      setStartAyah(1);
                    }
                  }}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {surahOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.transliteration} ({s.id})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={startSurahMeta?.ayahCount ?? 1}
                  value={startAyah}
                  onChange={(e) => setStartAyah(Number(e.target.value))}
                  placeholder="Ayah"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
                {startSurahMeta && (
                  <p className="text-xs text-muted-foreground">
                    {startSurahMeta.ayahCount} ayat in this surah
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">End</label>
              <div className="space-y-2">
                <select
                  value={endSurah}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setEndSurah(id);
                    const meta = surahOptions.find((s) => s.id === id);
                    if (meta && endAyah > meta.ayahCount) {
                      setEndAyah(meta.ayahCount);
                    }
                  }}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                >
                  {surahOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.transliteration} ({s.id})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  max={endSurahMeta?.ayahCount ?? 1}
                  value={endAyah}
                  onChange={(e) => setEndAyah(Number(e.target.value))}
                  placeholder="Ayah"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                />
                {endSurahMeta && (
                  <p className="text-xs text-muted-foreground">
                    {endSurahMeta.ayahCount} ayat in this surah
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Goal per session
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={goalPerSession}
              onChange={(e) => setGoalPerSession(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {goalPerSession} {goalPerSession === 1 ? "ayah" : "ayat"} per session
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={addPlan}
              disabled={!label.trim() || !startSurahMeta || !endSurahMeta}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create plan
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      {/* Existing plans */}
      {state.targets.length === 0 && !showForm && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Plus className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <h2 className="font-display text-xl font-semibold">
            No reading plans yet
          </h2>
          <p className="max-w-md mx-auto text-sm text-muted-foreground">
            Create your first reading plan to track progress through specific
            surahs or custom ranges.
          </p>
        </div>
      )}

      {state.targets.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Your plans</h2>
          <div className="space-y-3">
            {state.targets.map((target) => {
              const startMeta = surahOptions.find((s) => s.id === target.start.surah);
              const endMeta = surahOptions.find((s) => s.id === target.end.surah);
              const currentMeta = surahOptions.find(
                (s) => s.id === target.currentPosition.surah
              );

              if (!startMeta || !endMeta || !currentMeta) return null;

              const isComplete =
                target.currentPosition.surah > target.end.surah ||
                (target.currentPosition.surah === target.end.surah &&
                  target.currentPosition.ayah > target.end.ayah);

              return (
                <div
                  key={target.id}
                  className={cn(
                    "rounded-2xl border border-border/80 bg-card p-5 space-y-4",
                    target.paused && "opacity-60"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-display text-lg font-semibold truncate">
                        {target.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {startMeta.transliteration} {target.start.surah}:{target.start.ayah}{" "}
                        → {endMeta.transliteration} {target.end.surah}:{target.end.ayah}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Goal: {target.goalPerSession} {target.goalPerSession === 1 ? "ayah" : "ayat"} per
                        session
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {target.paused ? (
                        <button
                          type="button"
                          onClick={() => resumeTarget(target.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          aria-label="Resume plan"
                        >
                          <Play className="h-3.5 w-3.5" aria-hidden />
                          Resume
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => pauseTarget(target.id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                          aria-label="Pause plan"
                        >
                          <Pause className="h-3.5 w-3.5" aria-hidden />
                          Pause
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Delete this reading plan?")) {
                            removeTarget(target.id);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20"
                        aria-label="Delete plan"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current position:</span>
                      <span className="font-medium">
                        {currentMeta.transliteration} {target.currentPosition.surah}:
                        {target.currentPosition.ayah}
                      </span>
                    </div>
                    {isComplete ? (
                      <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm text-primary">
                        <Check className="h-4 w-4" aria-hidden />
                        <span className="font-medium">Complete</span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          max={currentMeta.ayahCount}
                          defaultValue={target.currentPosition.ayah}
                          onBlur={(e) => {
                            const nextAyah = Number(e.target.value);
                            if (nextAyah >= 1 && nextAyah <= currentMeta.ayahCount) {
                              markProgress(target.id, currentMeta.id, nextAyah);
                            }
                          }}
                          className="w-20 rounded-lg border border-input bg-background px-2 py-1 text-sm"
                          aria-label="Update ayah number"
                        />
                        <select
                          value={target.currentPosition.surah}
                          onChange={(e) => {
                            const nextSurah = Number(e.target.value);
                            const meta = surahOptions.find((s) => s.id === nextSurah);
                            if (meta) {
                              markProgress(target.id, nextSurah, 1);
                            }
                          }}
                          className="flex-1 rounded-lg border border-input bg-background px-2 py-1 text-sm"
                          aria-label="Update surah"
                        >
                          {surahOptions.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.transliteration} ({s.id})
                            </option>
                          ))}
                        </select>
                        <Link
                          href={`/ayah/${target.currentPosition.surah}/${target.currentPosition.ayah}`}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                          Read
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        </Link>
                      </div>
                    )}
                  </div>

                  {target.lastActivityAt && (
                    <p className="text-xs text-muted-foreground">
                      Last activity: {new Date(target.lastActivityAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
