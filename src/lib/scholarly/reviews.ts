// MFD-10.2 — Scholarly Review Workflow & Governance (pure module)
//
// NO React, NO fs, NO network. Every function is total: invalid input returns
// an error value, never a throw.
//
// GOVERNANCE RULES ENFORCED HERE:
//   1. The 789 mapping records are READ-ONLY inputs. Nothing in this module
//      writes to them; review state lives in separate ReviewRecords.
//   2. No auto-approval. APPROVED requires a human rationale AND at least one
//      VERIFIED evidence record explicitly considered.
//   3. Missing evidence is NEVER approval — it is INSUFFICIENT_EVIDENCE or no
//      decision at all.
//   4. Reviewer identity is locally entered and NOT authenticated. This module
//      records what the reviewer typed; it never asserts scholarly credentials.
//   5. History is APPEND-ONLY. A reversal creates a NEW record; earlier records
//      are never erased or edited.
//   6. Technical validation (schema checks, ayah resolution) is NOT scholarly
//      approval. deriveGovernanceBucket can only return GOVERNANCE_APPROVED
//      from an explicit human APPROVED decision.
//   7. Priority is human-set only. No AI-derived ordering anywhere.

import {
  SCHOLARLY_SCHEMA_VERSION,
  type EvidenceRecord,
  type MappingReviewState,
  type ReviewDecision,
  type ReviewRecord,
  type ScholarlyReviewStore,
} from "./types";

// ─── Decision Labels & Descriptions ─────────────────────────────────────────

export const REVIEW_DECISION_LABELS: Record<ReviewDecision, string> = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
  REVISION_REQUIRED: "Revision required",
  INSUFFICIENT_EVIDENCE: "Insufficient evidence",
  DEFERRED: "Deferred",
};

/**
 * Plain-language descriptions. Two distinctions are load-bearing:
 * - DEFERRED is a postponement, NOT a rejection.
 * - INSUFFICIENT_EVIDENCE means we cannot determine correctness yet; it is
 *   NOT proof that the mapping is wrong.
 */
export const REVIEW_DECISION_DESCRIPTIONS: Record<ReviewDecision, string> = {
  APPROVED:
    "A human reviewer confirms this mapping is correct, with a written rationale and at least one verified evidence record considered.",
  REJECTED:
    "A human reviewer determined this mapping is incorrect or unsupported, with a written rationale explaining why.",
  REVISION_REQUIRED:
    "The mapping needs modification before it can be approved. The rationale must say what should change.",
  INSUFFICIENT_EVIDENCE:
    "Correctness cannot be determined with the evidence currently available. This does NOT mean the mapping is wrong — it means more evidence is needed.",
  DEFERRED:
    "Review is postponed to a later time. This is NOT a rejection and carries no judgement about the mapping's correctness.",
};

export const UNREVIEWED_LABEL = "Unreviewed";

// ─── Controlled State Machine ────────────────────────────────────────────────

/**
 * ALLOWED_TRANSITIONS documents the controlled review state machine.
 *
 * POLICY: any decision may follow any prior state (including UNREVIEWED),
 * because scholarly judgement can legitimately reverse itself as new evidence
 * arrives — e.g. APPROVED → REVISION_REQUIRED when a source is found to be
 * misread, or REJECTED → APPROVED after new verified tafsir evidence.
 *
 * The constraint is NOT on which states may follow which; it is that EVERY
 * decision must meet its own requirements before it can be recorded:
 *   - ALL decisions: non-empty reviewerId + non-empty rationale.
 *   - APPROVED additionally: ≥1 evidence id in evidenceConsidered AND ≥1 of
 *     those ids is VERIFIED (checked against verifiedEvidenceIds).
 *   - Reversals append a NEW record; they never edit history.
 *
 * Keeping every transition legal but gating each decision on its own
 * requirements is deliberate: a narrower graph would force reviewers to
 * launder reversals through intermediate states, corrupting the audit trail.
 */
const ALL_DECISIONS: readonly ReviewDecision[] = [
  "APPROVED",
  "REJECTED",
  "REVISION_REQUIRED",
  "INSUFFICIENT_EVIDENCE",
  "DEFERRED",
];

export const ALLOWED_TRANSITIONS: Record<
  ReviewDecision | "UNREVIEWED",
  ReviewDecision[]
> = {
  UNREVIEWED: [...ALL_DECISIONS],
  APPROVED: [...ALL_DECISIONS],
  REJECTED: [...ALL_DECISIONS],
  REVISION_REQUIRED: [...ALL_DECISIONS],
  INSUFFICIENT_EVIDENCE: [...ALL_DECISIONS],
  DEFERRED: [...ALL_DECISIONS],
};

/** True when `next` is a legal successor of `previous` per the documented policy. */
export function isAllowedTransition(
  previous: ReviewDecision | "UNREVIEWED" | null,
  next: ReviewDecision
): boolean {
  const key = previous ?? "UNREVIEWED";
  const allowed = ALLOWED_TRANSITIONS[key];
  return Array.isArray(allowed) && allowed.includes(next);
}

// ─── Decision Validation ─────────────────────────────────────────────────────

export interface ValidateDecisionInput {
  mappingId: string;
  /** Locally entered reviewer identifier. Not authenticated. */
  reviewerId: string;
  /** Self-declared role note; never treated as a verified credential. */
  reviewerRole?: string;
  decision: ReviewDecision;
  rationale: string;
  evidenceConsidered: string[];
  /**
   * IDs of evidence records currently VERIFIED for this mapping. Passed in so
   * this module stays pure (no storage access).
   */
  verifiedEvidenceIds: string[];
  /** Latest prior decision for this mapping, or null/undefined if unreviewed. */
  previousState?: ReviewDecision | null;
  /** ISO timestamp override (tests); defaults to now. */
  decidedAt?: string;
  /** Pre-computed record id; recordDecision supplies the sequential id. */
  id?: string;
}

export type ValidateDecisionResult =
  | { ok: true; value: ReviewRecord }
  | { ok: false; error: string };

/**
 * Validate a proposed decision WITHOUT touching any store.
 * Returns a complete ReviewRecord on success (id defaults to a placeholder
 * when not supplied; recordDecision always supplies the sequential id).
 */
export function validateDecision(
  input: ValidateDecisionInput
): ValidateDecisionResult {
  if (!input.mappingId || input.mappingId.trim().length === 0) {
    return { ok: false, error: "A valid mapping ID is required." };
  }
  if (!input.reviewerId || input.reviewerId.trim().length === 0) {
    return {
      ok: false,
      error:
        "Reviewer identity is required. Enter your local reviewer ID before recording a decision (it is locally entered, not independently authenticated).",
    };
  }
  if (!ALL_DECISIONS.includes(input.decision)) {
    return { ok: false, error: `Unknown review decision: ${String(input.decision)}` };
  }
  if (!input.rationale || input.rationale.trim().length === 0) {
    return {
      ok: false,
      error: "A written rationale is required for every decision, including deferrals.",
    };
  }

  const considered = Array.isArray(input.evidenceConsidered)
    ? input.evidenceConsidered.filter((id) => typeof id === "string" && id.length > 0)
    : [];

  if (input.decision === "APPROVED") {
    if (considered.length === 0) {
      return {
        ok: false,
        error:
          "Approval requires at least one evidence record to be explicitly considered. Missing evidence is never approval.",
      };
    }
    const verified = new Set(input.verifiedEvidenceIds ?? []);
    const hasVerified = considered.some((id) => verified.has(id));
    if (!hasVerified) {
      return {
        ok: false,
        error:
          "Approval requires at least one of the considered evidence records to be VERIFIED by a human. Identified or pending evidence is not sufficient.",
      };
    }
  }

  const previous = input.previousState ?? null;
  if (!isAllowedTransition(previous, input.decision)) {
    return {
      ok: false,
      error: `Transition from ${previous ?? "UNREVIEWED"} to ${input.decision} is not allowed by the review policy.`,
    };
  }

  const decidedAt = input.decidedAt ?? new Date().toISOString();
  const record: ReviewRecord = {
    id: input.id ?? `rev-${input.mappingId}-pending`,
    mappingId: input.mappingId,
    reviewerId: input.reviewerId.trim(),
    ...(input.reviewerRole && input.reviewerRole.trim().length > 0
      ? { reviewerRole: input.reviewerRole.trim() }
      : {}),
    decision: input.decision,
    rationale: input.rationale.trim(),
    evidenceConsidered: considered,
    decidedAt,
    previousState: previous,
    newState: input.decision,
  };
  return { ok: true, value: record };
}

// ─── Append-Only Recording ───────────────────────────────────────────────────

/** Chronological history for one mapping, oldest first. Never mutates the store. */
export function getReviewHistory(
  store: ScholarlyReviewStore,
  mappingId: string
): ReviewRecord[] {
  return store.reviews
    .filter((r) => r.mappingId === mappingId)
    .slice()
    .sort((a, b) => a.decidedAt.localeCompare(b.decidedAt));
}

/** Latest decision for a mapping, or null when never reviewed. */
export function getLatestDecision(
  store: ScholarlyReviewStore,
  mappingId: string
): ReviewDecision | null {
  const history = getReviewHistory(store, mappingId);
  return history.length > 0 ? history[history.length - 1].decision : null;
}

export type RecordDecisionResult =
  | { ok: true; store: ScholarlyReviewStore; record: ReviewRecord }
  | { ok: false; error: string };

/**
 * Append a decision to the store. Returns a NEW store; the input store and
 * all existing records are untouched (append-only).
 *
 * Ids are deterministic and sequential per mapping: rev-<mappingId>-<NNN>,
 * where NNN = existing record count for that mapping + 1, zero-padded to 3.
 * previousState is derived from the latest prior record, never from caller
 * guesswork.
 */
export function recordDecision(
  store: ScholarlyReviewStore,
  input: Omit<ValidateDecisionInput, "previousState" | "id">
): RecordDecisionResult {
  const history = getReviewHistory(store, input.mappingId);
  const previousState =
    history.length > 0 ? history[history.length - 1].decision : null;
  const seq = String(history.length + 1).padStart(3, "0");
  const id = `rev-${input.mappingId}-${seq}`;

  const validated = validateDecision({ ...input, previousState, id });
  if (!validated.ok) return { ok: false, error: validated.error };

  const nextStore: ScholarlyReviewStore = {
    schemaVersion: SCHOLARLY_SCHEMA_VERSION,
    reviews: [...store.reviews, validated.value],
    lastSavedAt: new Date().toISOString(),
  };
  return { ok: true, store: nextStore, record: validated.value };
}

// ─── Derived Review State ────────────────────────────────────────────────────

/**
 * Compute the review state summary for one mapping from its records.
 * Pure derivation — nothing here is persisted.
 */
export function deriveMappingReviewState(
  mappingId: string,
  reviews: ReviewRecord[],
  evidence: EvidenceRecord[]
): MappingReviewState {
  const mine = reviews
    .filter((r) => r.mappingId === mappingId)
    .slice()
    .sort((a, b) => a.decidedAt.localeCompare(b.decidedAt));
  const ev = evidence.filter((e) => e.mappingId === mappingId);
  const verifiedCount = ev.filter((e) => e.status === "VERIFIED").length;

  return {
    mappingId,
    currentDecision: mine.length > 0 ? mine[mine.length - 1].decision : null,
    reviewCount: mine.length,
    lastReviewedAt: mine.length > 0 ? mine[mine.length - 1].decidedAt : null,
    evidenceCount: ev.length,
    verifiedEvidenceCount: verifiedCount,
    hasEvidence: ev.length > 0,
    allEvidenceVerified: ev.length > 0 && verifiedCount === ev.length,
  };
}

// ─── Governance Buckets ──────────────────────────────────────────────────────

/**
 * Governance buckets, ordered from least to most advanced. These distinguish
 * TECHNICAL progress from SCHOLARLY judgement:
 *
 *   TECHNICALLY_VALIDATED       — mapping resolves to real ayat / passes schema
 *                                 checks. Says NOTHING about correctness.
 *   EVIDENCE_ATTACHED           — a source has been linked, unverified.
 *   EVIDENCE_VERIFIED           — a human confirmed the evidence supports the
 *                                 mapping, but no review decision exists yet.
 *   AWAITING_SCHOLARLY_REVIEW   — no human decision recorded.
 *   HUMAN_REVIEWED              — a human decision exists that is not APPROVED
 *                                 (rejected / revision / insufficient / deferred).
 *   GOVERNANCE_APPROVED         — ONLY from an explicit human APPROVED record.
 */
export const REVIEW_STATUS_BUCKETS = [
  "TECHNICALLY_VALIDATED",
  "EVIDENCE_ATTACHED",
  "EVIDENCE_VERIFIED",
  "AWAITING_SCHOLARLY_REVIEW",
  "HUMAN_REVIEWED",
  "GOVERNANCE_APPROVED",
] as const;

export type ReviewStatusBucket = (typeof REVIEW_STATUS_BUCKETS)[number];

export const REVIEW_STATUS_BUCKET_LABELS: Record<ReviewStatusBucket, string> = {
  TECHNICALLY_VALIDATED: "Technically validated (not scholarly approval)",
  EVIDENCE_ATTACHED: "Evidence attached, unverified",
  EVIDENCE_VERIFIED: "Evidence verified, awaiting decision",
  AWAITING_SCHOLARLY_REVIEW: "Awaiting scholarly review",
  HUMAN_REVIEWED: "Human reviewed (not approved)",
  GOVERNANCE_APPROVED: "Governance approved (explicit human decision)",
};

/**
 * Derive the governance bucket for a mapping.
 *
 * HARD GUARANTEE: GOVERNANCE_APPROVED is returned ONLY when the latest human
 * review record is an explicit APPROVED decision. `technicallyValidated` alone
 * can never produce it — technical validators check structure, not religious
 * correctness, and this function treats them as the floor, not the ceiling.
 */
export function deriveGovernanceBucket(
  state: MappingReviewState,
  technicallyValidated: boolean
): ReviewStatusBucket {
  if (state.currentDecision === "APPROVED") return "GOVERNANCE_APPROVED";
  if (state.currentDecision !== null) return "HUMAN_REVIEWED";
  if (state.verifiedEvidenceCount > 0) return "EVIDENCE_VERIFIED";
  if (state.hasEvidence) return "EVIDENCE_ATTACHED";
  if (technicallyValidated) return "TECHNICALLY_VALIDATED";
  return "AWAITING_SCHOLARLY_REVIEW";
}

// ─── Human-Set Priority ──────────────────────────────────────────────────────

/** Priority values. Human-set only; never derived by any automated process. */
export const REVIEW_PRIORITIES = ["NORMAL", "HIGH", "LOW"] as const;
export type ReviewPriority = (typeof REVIEW_PRIORITIES)[number];

export const REVIEW_PRIORITY_LABELS: Record<ReviewPriority, string> = {
  NORMAL: "Normal",
  HIGH: "High",
  LOW: "Low",
};

/**
 * The priority-bearing slice of the persisted state. Structural typing keeps
 * this module free of any storage import while still accepting the full
 * ScholarlyState object.
 */
export interface PriorityStore {
  priorities: Record<string, string>;
}

/**
 * Set the human-chosen priority for a mapping. Stored SEPARATELY from review
 * decisions (in ScholarlyState.priorities) so ordering can never be confused
 * with scholarly judgement. Returns a NEW store; the input is untouched and
 * no review record is created or modified.
 *
 * Invalid mapping ids or unknown priority values are no-ops that return a
 * shallow copy — priority is only ever what a human explicitly chose.
 */
export function setPriority<T extends PriorityStore>(
  store: T,
  mappingId: string,
  priority: ReviewPriority
): T {
  if (!mappingId || mappingId.trim().length === 0) {
    return { ...store, priorities: { ...store.priorities } };
  }
  if (!REVIEW_PRIORITIES.includes(priority)) {
    return { ...store, priorities: { ...store.priorities } };
  }
  return {
    ...store,
    priorities: { ...store.priorities, [mappingId]: priority },
  };
}

/** Read a mapping's priority from a store, defaulting to NORMAL. */
export function getPriority(
  store: PriorityStore,
  mappingId: string
): ReviewPriority {
  const raw = store.priorities?.[mappingId];
  return REVIEW_PRIORITIES.includes(raw as ReviewPriority)
    ? (raw as ReviewPriority)
    : "NORMAL";
}
