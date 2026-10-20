// FR-065 — audit records for the grounded-answer harness.
//
// PRIVACY BY CONSTRUCTION, NOT BY PROMISE. `AiAuditRecord` has no user field,
// no question field, and no free-text payload: the only strings in it are
// enums, source ids, model names, and counts. A future edit cannot leak a
// private question through this type unless it first adds a field to the
// interface, which is exactly the review point AI-SAFETY asks for.
//
// Nothing here is written to disk or sent anywhere. `recordAudit` keeps a
// bounded, process-local ring of the most recent records so a gate report can
// be produced from a running evaluation; persistence policy is deliberately
// left to the privacy review gate (`privacy-review` in feature-flag.ts), which
// is not yet met.

// Relative imports: see the note at the top of grounding.ts. Aliasing here breaks
// the AI suite's resolution, not the app build.
import {
  AI_MODEL_NAME,
  AI_MODEL_VERSION,
  AI_ANSWER_FEATURE_ENABLED,
} from "./feature-flag";
import type { RequestClass } from "./grounding";

export type AuditOutcome =
  | "answered"
  | "abstained"
  | "redirected"
  | "rejected-flag-off";

/** Where the call came from; only harness records can serve as gate evidence. */
export type AuditOrigin = "evaluation-harness" | "runtime";

export interface AiAuditRecord {
  id: string;
  /** ISO timestamp of the evaluation. */
  at: string;
  /**
   * The feature flag as it stood when the record was written, typed as the
   * literal `false` this build ships. The audit trail of an off feature is
   * still evidence: it is what the gate report reads.
   */
  featureEnabled: typeof AI_ANSWER_FEATURE_ENABLED;
  outcome: AuditOutcome;
  requestClass: RequestClass;
  origin: AuditOrigin;
  /** Approved-source ids actually cited. Empty on abstention. */
  sourceIds: string[];
  model: string;
  modelVersion: string;
  claimCount: number;
  citationCount: number;
  /** Claims that failed validation — a non-zero value blocks gate evidence. */
  validationFailures: number;
}

export interface AuditInput {
  outcome: AuditOutcome;
  requestClass: RequestClass;
  sourceIds: string[];
  claimCount: number;
  citationCount: number;
  validationFailures: number;
  origin: AuditOrigin;
  /** Injectable only so evaluation cases get stable ids in tests. */
  now?: Date;
}

function recordId(now: Date): string {
  return `ai:${now.getTime().toString(36)}:${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function buildAuditRecord(input: AuditInput): AiAuditRecord {
  const now = input.now ?? new Date();
  return {
    id: recordId(now),
    at: now.toISOString(),
    featureEnabled: AI_ANSWER_FEATURE_ENABLED,
    outcome: input.outcome,
    requestClass: input.requestClass,
    origin: input.origin,
    // Deduped and sorted so two records citing the same sources compare equal.
    sourceIds: [...new Set(input.sourceIds)].sort(),
    model: AI_MODEL_NAME,
    modelVersion: AI_MODEL_VERSION,
    claimCount: input.claimCount,
    citationCount: input.citationCount,
    validationFailures: input.validationFailures,
  };
}

/**
 * Whether a record may be cited as evidence for an AI-SAFETY evaluation gate.
 *
 * Requirements, each of which has failed in practice and is therefore explicit:
 *   * It must come from the evaluation harness, not from public traffic —
 *     only the harness runs a known, reviewable input set.
 *   * It must have been written while the feature was off, because evidence
 *     gathered with the feature on would pre-empt the gate it is meant to clear.
 *   * It must be an `answered` record with at least one citation and no failed
 *     validations: abstentions and flag rejections prove only that refusal
 *     works, and cannot certify citation coverage or zero hallucination.
 */
export function isGateEvidence(record: AiAuditRecord): boolean {
  return (
    record.origin === "evaluation-harness" &&
    !record.featureEnabled &&
    record.outcome === "answered" &&
    record.citationCount > 0 &&
    record.claimCount > 0 &&
    record.validationFailures === 0
  );
}

// ---------------------------------------------------------------------------
// Process-local ring (bounded, no persistence)
// ---------------------------------------------------------------------------

const MAX_RETAINED = 200;

type AuditStore = { entries: AiAuditRecord[] };

const store: AuditStore = (
  globalThis as unknown as { __alhudaAiAudit?: AuditStore }
).__alhudaAiAudit ?? { entries: [] };
(globalThis as unknown as { __alhudaAiAudit?: AuditStore }).__alhudaAiAudit =
  store;

/** Append a record, dropping the oldest beyond the retention bound. */
export function recordAudit(record: AiAuditRecord): void {
  store.entries.unshift(record);
  if (store.entries.length > MAX_RETAINED) {
    store.entries.length = MAX_RETAINED;
  }
}

/** Newest-first snapshot of what this process has recorded. */
export function recentAudits(limit = MAX_RETAINED): AiAuditRecord[] {
  return store.entries.slice(0, limit);
}

/** Counts by outcome — the shape the gate report consumes. */
export function auditSummary(records: AiAuditRecord[] = recentAudits()) {
  const summary = {
    total: records.length,
    answered: 0,
    abstained: 0,
    rejectedFlagOff: 0,
    gateEvidenceCount: 0,
    sources: new Set<string>(),
  };
  for (const record of records) {
    if (record.outcome === "answered") summary.answered += 1;
    else if (record.outcome === "abstained" || record.outcome === "redirected")
      summary.abstained += 1;
    else summary.rejectedFlagOff += 1;
    if (isGateEvidence(record)) summary.gateEvidenceCount += 1;
    for (const id of record.sourceIds) summary.sources.add(id);
  }
  return {
    ...summary,
    sources: [...summary.sources].sort(),
  };
}
