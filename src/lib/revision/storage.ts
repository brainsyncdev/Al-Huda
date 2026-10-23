// Local persistence for the revision plan (FR-050–FR-053), with validation.
//
// Everything a learner writes to localStorage is treated as untrusted: the
// file may be a leftover from an older version, hand-edited, or truncated by a
// full disk. `normalizeRevisionState` therefore rebuilds the state field by
// field rather than casting, and drops only the entries it cannot identify.
// The same function backs backup import, so a restored file and a stored one
// take exactly the same path — there is no second, stricter validator hiding
// behind the first.
//
// FREE MODULE: no React, no network. Safe to import from client contexts and
// from the shared backup helper.

import {
  ALGORITHM_VERSION,
  DEFAULT_LADDER_ID,
  LADDERS,
  OWNER,
  getLadder,
  isValidDateOnly,
  refKey,
  type EventKind,
  type Rating,
  type RevisionItem,
  type RevisionState,
  type ReviewEvent,
} from "./scheduling";

export const REVISION_STORAGE_KEY = "alhuda.revision.v1";

/**
 * Cap on stored review events (see the note in scheduling.ts: `recordedReviews`
 * counts what the local record holds, per-item counts are exact). The cap keeps
 * one long-running plan from growing localStorage without bound; only the most
 * recent events are dropped, never an item or its schedule.
 */
export const MAX_RECORDED_EVENTS = 500;

const RATINGS: readonly string[] = ["easy", "difficult", "missed"];
const EVENT_KINDS: readonly string[] = ["recall", "reset", "edited"];
const LADDER_IDS: readonly string[] = LADDERS.map((l) => l.id);

/** Longest surah in the corpus; an upper bound for stored ayah numbers. */
const MAX_AYAH = 286;

function asInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

/** A ladder id the build actually ships; anything else falls back to the default. */
function normalizeLadderId(value: unknown): string {
  return typeof value === "string" && LADDER_IDS.includes(value)
    ? value
    : DEFAULT_LADDER_ID;
}

function normalizeItem(value: unknown): RevisionItem | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const surah = asInteger(raw.surah);
  const ayah = asInteger(raw.ayah);
  // Identity is the point: an entry that cannot name its verse cannot be
  // scheduled, reviewed, or cited, so it is dropped rather than guessed at.
  if (surah === null || ayah === null) return null;
  if (surah < 1 || surah > 114 || ayah < 1 || ayah > MAX_AYAH) return null;
  // An invalid due date is repaired (item kept, rescheduled) rather than
  // dropped — losing a planned verse silently would be worse than restarting
  // its spacing.
  const dueDate = isValidDateOnly(String(raw.dueDate ?? ""))
    ? String(raw.dueDate)
    : null;
  if (dueDate === null) return null;

  const ladderId = normalizeLadderId(raw.ladderId);
  const ladder = getLadder(ladderId);
  const maxStep = ladder.intervals.length - 1;
  const stepRaw = asInteger(raw.step);
  const step = stepRaw === null ? 0 : Math.min(Math.max(stepRaw, 0), maxStep);
  const reviewCountRaw = asInteger(raw.reviewCount);
  const lastReviewedAt =
    typeof raw.lastReviewedAt === "string" ? raw.lastReviewedAt : null;

  return {
    reference: refKey(surah, ayah),
    surah,
    ayah,
    // Always the local owner of this build: a stored value claiming another
    // owner must not change who the item belongs to.
    owner: OWNER,
    ladderId,
    step,
    dueDate,
    // Unknown-but-unrendered audit metadata is left empty rather than faked.
    addedAt: typeof raw.addedAt === "string" ? raw.addedAt : "",
    lastReviewedAt,
    reviewCount: reviewCountRaw === null ? 0 : Math.max(reviewCountRaw, 0),
  };
}

function normalizeEvent(value: unknown): ReviewEvent | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const reference = asString(raw.reference);
  const kind = asString(raw.kind);
  if (reference === null || kind === null || !EVENT_KINDS.includes(kind)) return null;
  if (!/^\d{1,3}:\d{1,3}$/.test(reference)) return null;

  const rating =
    typeof raw.rating === "string" && RATINGS.includes(raw.rating)
      ? (raw.rating as Rating)
      : null;
  // A recall without a rating cannot be tallied, and a non-recall event never
  // carries one — either way is malformed.
  if ((kind === "recall") !== (rating !== null)) return null;

  const previousDueDate = String(raw.previousDueDate ?? "");
  const newDueDate = String(raw.newDueDate ?? "");
  if (!isValidDateOnly(previousDueDate) || !isValidDateOnly(newDueDate)) {
    return null;
  }

  const stepBefore = asInteger(raw.stepBefore);
  const stepAfter = asInteger(raw.stepAfter);
  if (stepBefore === null || stepAfter === null) return null;

  return {
    id: asString(raw.id) ?? `evt:${reference}:${kind}:${raw.at ?? "unknown"}`,
    reference,
    owner: OWNER,
    kind: kind as EventKind,
    rating,
    previousDueDate,
    newDueDate,
    stepBefore: Math.max(stepBefore, 0),
    stepAfter: Math.max(stepAfter, 0),
    at: asString(raw.at) ?? "",
    algorithmVersion: asString(raw.algorithmVersion) ?? ALGORITHM_VERSION,
  };
}

/**
 * Rebuild a revision state from arbitrary parsed JSON.
 *
 * Per-item failures are isolated: one malformed entry never discards the rest
 * of the plan. The result is always a structurally complete state, so callers
 * can assign it directly with no fallback branch.
 */
export function normalizeRevisionState(raw: unknown): RevisionState {
  const fallback: RevisionState = {
    items: {},
    events: [],
    settings: { ladderId: DEFAULT_LADDER_ID },
  };
  if (typeof raw !== "object" || raw === null) return fallback;
  const source = raw as Record<string, unknown>;

  const items: Record<string, RevisionItem> = {};
  if (typeof source.items === "object" && source.items !== null) {
    for (const value of Object.values(source.items)) {
      const item = normalizeItem(value);
      // Key from the validated identity, not from the source key: the two can
      // disagree after a hand-edit, and the verse itself is authoritative.
      if (item) items[item.reference] = item;
    }
  }

  const events: ReviewEvent[] = [];
  if (Array.isArray(source.events)) {
    for (const value of source.events) {
      const event = normalizeEvent(value);
      if (event) events.push(event);
    }
  }
  events.sort((a, b) => b.at.localeCompare(a.at));

  const settings =
    typeof source.settings === "object" && source.settings !== null
      ? (source.settings as Record<string, unknown>)
      : {};

  return {
    items,
    events: events.slice(0, MAX_RECORDED_EVENTS),
    settings: { ladderId: normalizeLadderId(settings.ladderId) },
  };
}

/** Read the stored plan. Returns the empty state on any failure. */
export function readRevisionState(): RevisionState {
  if (typeof window === "undefined") return normalizeRevisionState(null);
  try {
    const raw = window.localStorage.getItem(REVISION_STORAGE_KEY);
    if (!raw) return normalizeRevisionState(null);
    return normalizeRevisionState(JSON.parse(raw));
  } catch {
    return normalizeRevisionState(null);
  }
}

/** Write the plan, capping the event log first. Storage failures are silent. */
export function writeRevisionState(state: RevisionState): void {
  if (typeof window === "undefined") return;
  try {
    const capped: RevisionState = {
      ...state,
      events: state.events.slice(0, MAX_RECORDED_EVENTS),
    };
    window.localStorage.setItem(REVISION_STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // Full or unavailable storage: the UI keeps working in memory, which is the
    // same degradation the library provider already accepts.
  }
}
