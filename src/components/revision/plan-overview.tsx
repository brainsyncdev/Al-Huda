"use client";

// FR-052 (configurable algorithm) and FR-053 (no-streak / no-shame progress).
//
// The no-shame requirement is implemented structurally, not just in the copy:
// the numbers rendered here come from `statsFor()`, which has no streak, rank,
// consecutive-days, or comparison field, and a test in
// @/lib/revision/scheduling.test.ts asserts their absence so a future edit
// cannot reintroduce one silently. Nothing on this page computes how many days
// a verse has been overdue, and "missed" appears only as a tally of ratings —
// never as a debt.
//
// The review log is capped in storage (see @/lib/revision/context), so the
// heading says "recent" rather than implying a complete history. Per-item
// review counts are exact and uncapped, which is why those are the numbers used
// for anything a learner might act on.

import { useState } from "react";
import { Activity, CalendarClock, Check, ListTree, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRevision } from "@/lib/revision/context";
import {
  LADDERS,
  daysBetween,
  eventsFor,
  getLadder,
  statsFor,
  type RevisionItem,
} from "@/lib/revision/scheduling";
import type { SurahOption } from "@/lib/revision/surah-options";
import { cn } from "@/lib/utils";

const SECTION_HEADING =
  "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function formatDue(dueDate: string, today: string): string {
  const delta = daysBetween(dueDate, today);
  if (delta === 0) return "today";
  if (delta === 1) return "tomorrow";
  if (delta < 0) return `${Math.abs(delta)} days ago`;
  if (delta < 14) return `in ${delta} days`;
  if (delta < 60) return `in ${Math.round(delta / 7)} weeks`;
  return `in ${Math.round(delta / 30)} months`;
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-background/60 p-3">
      <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ItemRow({
  item,
  today,
  surahOptions,
}: {
  item: RevisionItem;
  today: string;
  surahOptions: SurahOption[];
}) {
  const { changeLadder, resetSchedule, removeItem } = useRevision();
  const [pendingRemoval, setPendingRemoval] = useState(false);

  const ladder = getLadder(item.ladderId);
  const surahName =
    surahOptions.find((option) => option.id === item.surah)?.transliteration ??
    `Surah ${item.surah}`;

  return (
    <li className="rounded-xl border border-border/80 bg-background/60 p-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-foreground">
          {surahName} · {item.reference}
        </p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {formatDue(item.dueDate, today)}
        </p>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {ladder.label} spacing · step {item.step + 1} of {ladder.intervals.length} ·
        reviewed {item.reviewCount} time{item.reviewCount === 1 ? "" : "s"}
      </p>

      <details className="group mt-2">
        <summary className="cursor-pointer list-none text-xs font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-2 focus-visible:outline-ring">
          Adjust
        </summary>
        <div className="mt-3 space-y-3 border-t border-border/70 pt-3">
          <div>
            <label
              htmlFor={`ladder-${item.reference}`}
              className="block text-xs font-medium text-foreground/80"
            >
              Review spacing
            </label>
            <select
              id={`ladder-${item.reference}`}
              value={item.ladderId}
              onChange={(event) => {
                changeLadder(item.reference, event.target.value);
                toast.success(`${item.reference} moved to ${getLadder(event.target.value).label} spacing.`);
              }}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              {LADDERS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Changing spacing reschedules the next review from today.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                resetSchedule(item.reference);
                toast.success(`${item.reference} is back at the first step. Its review history is kept.`);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors",
                "hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Restart this verse
            </button>

            {pendingRemoval ? (
              <span className="inline-flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    removeItem(item.reference);
                    toast.success(`${item.reference} removed from your plan. Its recorded reviews stay in your backup.`);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-destructive px-3 py-1.5 text-xs font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden />
                  Confirm removal
                </button>
                <button
                  type="button"
                  onClick={() => setPendingRemoval(false)}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
                >
                  Keep
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setPendingRemoval(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Remove from plan
              </button>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Restarting moves the verse back to the shortest gap without deleting
            it or its history. Removing it takes it out of the plan; the reviews
            already recorded are kept, because they are a record of study that
            happened.
          </p>
        </div>
      </details>
    </li>
  );
}

export function PlanOverview({
  nowMs,
  surahOptions,
}: {
  nowMs: number;
  surahOptions: SurahOption[];
}) {
  const revision = useRevision();
  const { state, items, events } = revision;

  const today = new Date(nowMs).toISOString().slice(0, 10);
  const stats = statsFor(state, nowMs);
  const allItems = Object.values(items).sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || a.reference.localeCompare(b.reference)
  );
  const upcoming = allItems.filter((item) => item.dueDate > today);
  const recentEvents = eventsFor(state).slice(0, 20);

  const grouped = new Map<string, RevisionItem[]>();
  for (const item of upcoming) {
    const bucket = grouped.get(item.dueDate);
    if (bucket) bucket.push(item);
    else grouped.set(item.dueDate, [item]);
  }

  return (
    <div className="space-y-6">
      {/* --- Progress (FR-053) -------------------------------------------- */}
      <section aria-labelledby="progress-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="progress-heading" className={SECTION_HEADING}>
          <ListTree className="h-4 w-4 text-gold" aria-hidden />
          Your plan
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Verses in plan" value={stats.totalItems} />
          <StatCard label="Due today" value={stats.dueToday} />
          <StatCard label="Scheduled later" value={stats.upcoming} />
          <StatCard label="Reviews in log" value={stats.recordedReviews} />
        </div>

        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Ratings in this log: {stats.ratingCounts.easy} easy,{" "}
          {stats.ratingCounts.difficult} difficult, {stats.ratingCounts.missed} missed.
          The log keeps the most recent entries only, so this is a count of
          recorded reviews rather than a lifetime total — each verse's own review
          count above is exact.
        </p>

        <p className="mt-3 max-w-prose rounded-xl border border-border/70 bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground">
          There is no streak here, no score, and no comparison to anyone else.
          These are your own learning records, kept on your own device, and they
          are a measure of nothing but where your attention has been.
        </p>
      </section>

      {/* --- Upcoming ----------------------------------------------------- */}
      <section aria-labelledby="upcoming-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="upcoming-heading" className={SECTION_HEADING}>
          <CalendarClock className="h-4 w-4 text-gold" aria-hidden />
          Coming up
        </h2>
        {grouped.size === 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Nothing is scheduled beyond today. Add more verses whenever you are
            ready — there is no ceiling to reach.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {[...grouped.entries()].map(([dueDate, group]) => (
              <div key={dueDate}>
                <p className="text-xs font-medium tabular-nums text-muted-foreground">
                  {formatDue(dueDate, today)}
                </p>
                <ul className="mt-2 space-y-2">
                  {group.map((item) => (
                    <ItemRow
                      key={item.reference}
                      item={item}
                      today={today}
                      surahOptions={surahOptions}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Whole plan --------------------------------------------------- */}
      {allItems.length > 0 && (
        <section aria-labelledby="all-items-heading" className="rounded-2xl border border-border/80 bg-card p-5">
          <h2 id="all-items-heading" className={SECTION_HEADING}>
            Everything in your plan
            <span className="tabular-nums">({allItems.length})</span>
          </h2>
          <ul className="mt-4 space-y-2">
            {allItems.map((item) => (
              <ItemRow
                key={item.reference}
                item={item}
                today={today}
                surahOptions={surahOptions}
              />
            ))}
          </ul>
        </section>
      )}

      {/* --- Review log --------------------------------------------------- */}
      <section aria-labelledby="activity-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="activity-heading" className={SECTION_HEADING}>
          <Activity className="h-4 w-4 text-gold" aria-hidden />
          Recent activity
        </h2>
        {recentEvents.length === 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No reviews recorded yet. The log fills in as you rate verses.
          </p>
        ) : (
          <>
            <ol className="mt-4 space-y-1.5">
              {recentEvents.map((event, index) => (
                <li
                  key={`${event.id}:${index}`}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-xs"
                >
                  <span className="font-medium text-foreground">
                    {event.reference}
                    {event.rating ? ` · ${event.rating}` : ` · ${event.kind}`}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {event.newDueDate}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              Showing the {recentEvents.length} most recent of{" "}
              {events.length} logged entr{events.length === 1 ? "y" : "ies"}. The
              full log is in your exported backup.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
