// Spaced-repetition scheduling core (FR-050–FR-053).
//
// PURE MODULE: no React, no localStorage, no node:fs, no network. Every
// function is deterministic given its arguments, which is why the date
// functions accept an explicit reference instant rather than calling
// `new Date()` internally. Storage lives in ./context.tsx and the UI in
// src/components/revision/.
//
// Design constraints taken from the PRD:
//   * §9 RevisionItem / ReviewEvent — "user, ayah/range, due date, review
//     outcome, algorithm version". `owner` stands in for "user": this build has
//     no accounts, so the only honest value is the local anonymous one.
//   * FR-052 — the algorithm is configurable. Three interval ladders are
//     offered; the choice is stored per item so changing the default later does
//     not retroactively rewrite someone's schedule.
//   * FR-053 / Journey E acceptance — "no-streak / no-shame". There is
//     deliberately no streak field, no missed-day counter, no rank, and no
//     comparison against other people. `statsFor()` returns neutral counts and
//     a test pins the absence of a streak so a future edit cannot quietly add
//     one.
//   * Journey E step 5 — "User can edit or reset the schedule." `resetItem()`
//     returns an item to step 0 without deleting it or its event history, so
//     the audit trail survives a reset.
//
// Due dates are DATE-ONLY ("YYYY-MM-DD"), not timestamps. Day granularity is
// all a revision ladder needs, and it removes an entire class of timezone
// bugs from the "is this due today?" comparison. Audit timestamps
// (`addedAt`, `at`, `lastReviewedAt`) are full ISO strings.

export type Rating = "easy" | "difficult" | "missed";

/**
 * Event kinds recorded in the audit log. `added` was removed: adding a verse
 * is not a review, and the item's `addedAt` timestamp already records when it
 * entered the plan. Keeping it as an event would have inflated the review
 * count on day one.
 */
export type EventKind = "recall" | "reset" | "edited";

/** Stable identity for the single local user this build supports. */
export const OWNER = "local-anonymous" as const;

/** Bumped when interval arithmetic changes, so old events stay interpretable. */
export const ALGORITHM_VERSION = "alhuda-srs-v1";

/**
 * Upper bound on one range selection.
 *
 * The number is a product judgement, not a storage limit: the longest surah
 * has 286 ayat, so a cap above that could never fire and would be a bound in
 * name only. 200 keeps a single addition to a plan a person can actually see
 * and act on, and it is reachable by a real request (Surah 2, ayat 1–286).
 */
export const MAX_RANGE_SIZE = 200;

export interface IntervalLadder {
  id: string;
  label: string;
  description: string;
  /** Days until the next review, indexed by step. The last value repeats. */
  intervals: number[];
}

/**
 * Three ladders, all starting at one day so a newly added verse is reviewed
 * tomorrow regardless of temperament. They differ in how fast they stretch.
 */
export const LADDERS: IntervalLadder[] = [
  {
    id: "gentle",
    label: "Gentle",
    description:
      "Shorter gaps. Good when you want frequent contact with a passage and do not mind reviewing more often.",
    intervals: [1, 2, 4, 7, 14, 21, 30],
  },
  {
    id: "standard",
    label: "Standard",
    description:
      "The default balance between retention and review load.",
    intervals: [1, 3, 7, 14, 30, 60, 120],
  },
  {
    id: "spacious",
    label: "Spacious",
    description:
      "Longer gaps. Good once a passage feels settled and you want fewer scheduled reviews.",
    intervals: [1, 4, 10, 21, 45, 90, 180],
  },
];

export const DEFAULT_LADDER_ID = "standard";

export function getLadder(id: string): IntervalLadder {
  return LADDERS.find((l) => l.id === id) ?? LADDERS[1]!;
}

export interface RevisionItem {
  /** Canonical stable reference, e.g. "2:255". Also the primary key. */
  reference: string;
  surah: number;
  ayah: number;
  owner: typeof OWNER;
  ladderId: string;
  /** Index into the ladder's intervals array. Resets to 0 on a miss. */
  step: number;
  /** Date-only due date, YYYY-MM-DD. */
  dueDate: string;
  addedAt: string;
  lastReviewedAt: string | null;
  /** Monotonic count of recall events recorded for this item. */
  reviewCount: number;
}

export interface ReviewEvent {
  id: string;
  reference: string;
  owner: typeof OWNER;
  kind: EventKind;
  rating: Rating | null;
  /** Date-only due date the item carried before this event was applied. */
  previousDueDate: string;
  /** Date-only due date after this event was applied. */
  newDueDate: string;
  stepBefore: number;
  stepAfter: number;
  at: string;
  algorithmVersion: string;
}

export interface RevisionState {
  items: Record<string, RevisionItem>;
  events: ReviewEvent[];
  settings: { ladderId: string };
}

export const EMPTY_REVISION_STATE: RevisionState = {
  items: {},
  events: [],
  settings: { ladderId: DEFAULT_LADDER_ID },
};

// ---------------------------------------------------------------------------
// Date helpers (pure — every function takes its own reference instant)
// ---------------------------------------------------------------------------

const DAY_MS = 86_400_000;

/** Format a UTC epoch-ms value as YYYY-MM-DD. Always uses UTC so the output
 *  does not depend on the host machine's timezone setting. */
export function toDateOnly(epochMs: number): string {
  const d = new Date(epochMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today's date-only string, derived from the supplied reference instant. */
export function todayFrom(nowMs: number): string {
  return toDateOnly(nowMs);
}

/** Add N days to a date-only string, returning a date-only string. */
export function addDays(dateOnly: string, n: number): string {
  const [y, m, d] = dateOnly.split("-").map(Number);
  if (!y || !m || !d) return dateOnly;
  // Constructing a Date.UTC gives us midnight-of-that-UTC-day epoch ms,
  // which we can shift safely by whole days.
  const base = Date.UTC(y, m - 1, d);
  return toDateOnly(base + n * DAY_MS);
}

/** Whole-day difference: positive when `a` is later than `b`. */
export function daysBetween(a: string, b: string): number {
  const pa = parseDateOnly(a);
  const pb = parseDateOnly(b);
  if (pa === null || pb === null) return 0;
  return Math.round((pa - pb) / DAY_MS);
}

function parseDateOnly(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const epoch = Date.UTC(y, mo - 1, d);
  // Round-trip: reject impossible dates like 2026-02-30 that Date.UTC silently
  // rolls forward. If the formatted date does not match the input, the input
  // was not a real calendar date.
  if (toDateOnly(epoch) !== s) return null;
  return epoch;
}

/** True when the string is a valid YYYY-MM-DD date-only value. */
export function isValidDateOnly(s: string): boolean {
  return parseDateOnly(s) !== null;
}

/** True when the item is due on or before the supplied reference day. */
export function isDue(item: RevisionItem, nowMs: number): boolean {
  return item.dueDate <= todayFrom(nowMs);
}

// ---------------------------------------------------------------------------
// Range expansion (FR-050)
// ---------------------------------------------------------------------------

export interface RangeInput {
  surah: number;
  fromAyah: number;
  toAyah: number;
}

export interface RangeExpansionResult {
  refs: Array<{ surah: number; ayah: number }>;
  /** Present when the request was rejected; empty refs then. */
  error: string | null;
}

/**
 * Expand a contiguous ayah range within one surah, bounded by the surah's real
 * verse count. The caller supplies that count because this module must not
 * reach into the server-only dataset loader.
 *
 * Rejections are returned as a message rather than thrown, so the UI can show
 * a calm inline explanation instead of a crash boundary.
 */
export function expandRange(
  input: RangeInput,
  surahVerseCount: number
): RangeExpansionResult {
  const { surah, fromAyah, toAyah } = input;

  if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
    return { refs: [], error: "Surah must be between 1 and 114." };
  }
  if (!Number.isInteger(fromAyah) || !Number.isInteger(toAyah)) {
    return { refs: [], error: "Ayah numbers must be integers." };
  }
  if (fromAyah < 1 || toAyah < 1) {
    return { refs: [], error: "Ayah numbers start at 1." };
  }
  if (fromAyah > toAyah) {
    return { refs: [], error: "The first ayah must come before the last." };
  }
  if (surahVerseCount < 1) {
    return { refs: [], error: "The selected surah has no verses in the dataset." };
  }
  if (toAyah > surahVerseCount) {
    return {
      refs: [],
      error: `Surah ${surah} has ${surahVerseCount} ayat, so ayah ${toAyah} is out of range.`,
    };
  }
  const size = toAyah - fromAyah + 1;
  if (size > MAX_RANGE_SIZE) {
    return {
      refs: [],
      error: `A single range is limited to ${MAX_RANGE_SIZE} ayat (you asked for ${size}). Split it into smaller ranges.`,
    };
  }

  const refs: Array<{ surah: number; ayah: number }> = [];
  for (let a = fromAyah; a <= toAyah; a++) {
    refs.push({ surah, ayah: a });
  }
  return { refs, error: null };
}

// ---------------------------------------------------------------------------
// Item lifecycle
// ---------------------------------------------------------------------------

export function refKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

/**
 * Build a fresh item for a verse, dated relative to `nowMs`. Adding a verse
 * always schedules it for tomorrow under every ladder, so the learner sees
 * immediate follow-up regardless of which algorithm they picked.
 */
export function createItem(
  surah: number,
  ayah: number,
  ladderId: string,
  nowIso: string,
  nowMs: number
): RevisionItem {
  const ladder = getLadder(ladderId);
  const firstInterval = ladder.intervals[0] ?? 1;
  return {
    reference: refKey(surah, ayah),
    surah,
    ayah,
    owner: OWNER,
    ladderId: ladder.id,
    step: 0,
    dueDate: addDays(todayFrom(nowMs), firstInterval),
    addedAt: nowIso,
    lastReviewedAt: null,
    reviewCount: 0,
  };
}

/**
 * Apply a recall rating to an item, returning the updated item and the event
 * describing what changed. Pure: nothing here mutates its inputs.
 *
 * Rating semantics (kept deliberately simple and explainable):
 *   easy      → advance one step along the ladder.
 *   difficult → hold at the current step (same interval again).
 *   missed    → drop back to step 0 (shortest interval again).
 *
 * A miss is never punished beyond resetting progress, and the item is retained
 * either way — losing an item entirely would hide the fact that it still
 * exists in the learner's plan.
 */
export function applyRating(
  item: RevisionItem,
  rating: Rating,
  nowIso: string,
  nowMs: number
): { item: RevisionItem; event: ReviewEvent } {
  const ladder = getLadder(item.ladderId);
  const maxStep = ladder.intervals.length - 1;
  const previousDueDate = item.dueDate;

  let stepAfter = item.step;
  if (rating === "easy") {
    stepAfter = Math.min(maxStep, item.step + 1);
  } else if (rating === "missed") {
    stepAfter = 0;
  } else {
    stepAfter = item.step;
  }

  const interval = ladder.intervals[Math.min(stepAfter, maxStep)] ?? 1;
  // Anchor the next due date to TODAY, not to the overdue date. Anchoring to
  // the old due date would compound lateness: a learner who misses three
  // weeks would see a due date still in the past forever.
  const newDueDate = addDays(todayFrom(nowMs), interval);

  const updated: RevisionItem = {
    ...item,
    step: stepAfter,
    dueDate: newDueDate,
    lastReviewedAt: nowIso,
    reviewCount: item.reviewCount + 1,
  };

  const event: ReviewEvent = {
    id: `evt:${item.reference}:${nowIso}`,
    reference: item.reference,
    owner: OWNER,
    kind: "recall",
    rating,
    previousDueDate,
    newDueDate,
    stepBefore: item.step,
    stepAfter,
    at: nowIso,
    algorithmVersion: ALGORITHM_VERSION,
  };

  return { item: updated, event };
}

/**
 * Reset an item's schedule to step 0 without deleting it or its history
 * (Journey E step 5). The next review lands on the ladder's shortest gap.
 */
export function resetItem(
  item: RevisionItem,
  nowIso: string,
  nowMs: number
): { item: RevisionItem; event: ReviewEvent } {
  const ladder = getLadder(item.ladderId);
  const firstInterval = ladder.intervals[0] ?? 1;
  const previousDueDate = item.dueDate;
  const newDueDate = addDays(todayFrom(nowMs), firstInterval);

  const updated: RevisionItem = {
    ...item,
    step: 0,
    dueDate: newDueDate,
  };

  const event: ReviewEvent = {
    id: `evt:reset:${item.reference}:${nowIso}`,
    reference: item.reference,
    owner: OWNER,
    kind: "reset",
    rating: null,
    previousDueDate,
    newDueDate,
    stepBefore: item.step,
    stepAfter: 0,
    at: nowIso,
    algorithmVersion: ALGORITHM_VERSION,
  };

  return { item: updated, event };
}

/**
 * Change an item's ladder (Journey E step 5: "User can edit or reset the
 * schedule"). The step is clamped to the new ladder's last index so switching
 * from a long ladder to a short one does not produce an out-of-bounds lookup.
 * The next due date is recomputed from today using the new ladder's interval
 * at the clamped step.
 */
export function editItem(
  item: RevisionItem,
  newLadderId: string,
  nowIso: string,
  nowMs: number
): { item: RevisionItem; event: ReviewEvent } {
  const newLadder = getLadder(newLadderId);
  const maxStep = newLadder.intervals.length - 1;
  const stepAfter = Math.min(item.step, maxStep);
  const interval = newLadder.intervals[stepAfter] ?? 1;
  const previousDueDate = item.dueDate;
  const newDueDate = addDays(todayFrom(nowMs), interval);

  const updated: RevisionItem = {
    ...item,
    ladderId: newLadder.id,
    step: stepAfter,
    dueDate: newDueDate,
  };

  const event: ReviewEvent = {
    id: `evt:edit:${item.reference}:${nowIso}`,
    reference: item.reference,
    owner: OWNER,
    kind: "edited",
    rating: null,
    previousDueDate,
    newDueDate,
    stepBefore: item.step,
    stepAfter,
    at: nowIso,
    algorithmVersion: ALGORITHM_VERSION,
  };

  return { item: updated, event };
}

// ---------------------------------------------------------------------------
// Queries used by the UI
// ---------------------------------------------------------------------------

export function dueItems(state: RevisionState, nowMs: number): RevisionItem[] {
  const today = todayFrom(nowMs);
  return Object.values(state.items)
    .filter((i) => i.owner === OWNER && i.dueDate <= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.reference.localeCompare(b.reference));
}

export function upcomingItems(state: RevisionState, nowMs: number): RevisionItem[] {
  const today = todayFrom(nowMs);
  return Object.values(state.items)
    .filter((i) => i.owner === OWNER && i.dueDate > today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.reference.localeCompare(b.reference));
}

/**
 * Neutral aggregate counts for the progress surface (FR-053).
 *
 * Deliberately absent: any notion of a streak, consecutive-days figure, rank,
 * score, or comparison to another person. Those are exactly the framings the
 * PRD rules out for memorization data ("Progress is presented as personal
 * learning data, not a measure of faith"). A test asserts their absence so a
 * future edit cannot reintroduce them silently.
 */
export interface RevisionStats {
  totalItems: number;
  dueToday: number;
  upcoming: number;
  /**
   * Count of recall events in the local log. The log is capped for storage
   * reasons (see revision/context.tsx), so this is "as far back as the local
   * record goes" rather than an unbounded lifetime total. Per-item
   * `reviewCount` on RevisionItem is uncapped and exact.
   */
  recordedReviews: number;
  /** Distribution over ratings across all recall events in the local log. */
  ratingCounts: { easy: number; difficult: number; missed: number };
}

export function statsFor(state: RevisionState, nowMs: number): RevisionStats {
  const today = todayFrom(nowMs);
  const items = Object.values(state.items).filter((i) => i.owner === OWNER);
  const ratingCounts = { easy: 0, difficult: 0, missed: 0 };
  let recordedReviews = 0;

  for (const evt of state.events) {
    if (evt.kind !== "recall" || !evt.rating) continue;
    recordedReviews += 1;
    ratingCounts[evt.rating] += 1;
  }

  return {
    totalItems: items.length,
    dueToday: items.filter((i) => i.dueDate <= today).length,
    upcoming: items.filter((i) => i.dueDate > today).length,
    recordedReviews,
    ratingCounts,
  };
}

/** Events newest-first, optionally filtered to one reference. */
export function eventsFor(
  state: RevisionState,
  reference?: string
): ReviewEvent[] {
  const list = reference
    ? state.events.filter((e) => e.reference === reference)
    : state.events;
  return [...list].sort((a, b) => b.at.localeCompare(a.at));
}
