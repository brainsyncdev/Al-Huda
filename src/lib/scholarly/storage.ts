// MFD-10.2 — Scholarly Evidence & Review local persistence.
//
// FREE MODULE: no React, no fs, no network. Safe to import from client
// contexts and from the shared backup helper (src/lib/backup.ts v10).
//
// Everything in localStorage is treated as untrusted: it may come from an
// older version, a hand-edited file, or a corrupted disk write.
// `normalizeScholarlyState` rebuilds the state field by field rather than
// casting, dropping only records that cannot be validated. The same function
// backs backup import, so a restored file and a stored one take exactly the
// same validation path — there is no second, stricter validator hiding behind
// the first.
//
// GOVERNANCE:
// - Review history is append-only; normalization never rewrites decisions,
//   it only drops structurally invalid records.
// - reviewer.credentialVerified defaults to FALSE and is preserved ONLY when
//   explicitly recorded as true through a governance action. It can never be
//   inferred from a role note or display name.
// - Priorities are human-set strings stored separately from decisions.

import {
  SCHOLARLY_EVIDENCE_STORAGE_KEY,
  SCHOLARLY_REVIEW_STORAGE_KEY,
  SCHOLARLY_SCHEMA_VERSION,
  type EvidenceRecord,
  type EvidenceStatus,
  type ReviewDecision,
  type ReviewRecord,
} from "./types";
import { REVIEW_PRIORITIES } from "./reviews";

// ─── State Shape ─────────────────────────────────────────────────────────────

/** Locally entered reviewer identity. NOT authenticated. */
export interface ScholarlyReviewerIdentity {
  id: string;
  displayName: string;
  /** Self-declared role note; never a verified credential. */
  roleNote?: string;
  /**
   * Defaults to false. May only become true through an explicit recorded
   * governance action (see context.setReviewer with credentialVerification).
   * When false, every surface must say "locally entered, not independently
   * authenticated".
   */
  credentialVerified: boolean;
}

/** Combined scholarly store persisted under the two contract keys. */
export interface ScholarlyState {
  schemaVersion: typeof SCHOLARLY_SCHEMA_VERSION;
  reviews: ReviewRecord[];
  evidence: EvidenceRecord[];
  reviewer: ScholarlyReviewerIdentity;
  /** mappingId -> human-set priority ("NORMAL" | "HIGH" | "LOW"). */
  priorities: Record<string, string>;
  lastSavedAt: string;
}

export const EMPTY_REVIEWER_IDENTITY: ScholarlyReviewerIdentity = {
  id: "",
  displayName: "",
  credentialVerified: false,
};

export const EMPTY_SCHOLARLY_STATE: ScholarlyState = {
  schemaVersion: SCHOLARLY_SCHEMA_VERSION,
  reviews: [],
  evidence: [],
  reviewer: { ...EMPTY_REVIEWER_IDENTITY },
  priorities: {},
  lastSavedAt: "",
};

// ─── Validation Helpers ──────────────────────────────────────────────────────

const VALID_DECISIONS: readonly ReviewDecision[] = [
  "APPROVED",
  "REJECTED",
  "REVISION_REQUIRED",
  "INSUFFICIENT_EVIDENCE",
  "DEFERRED",
];

const VALID_EVIDENCE_STATUSES: readonly EvidenceStatus[] = [
  "NOT_ATTACHED",
  "SOURCE_IDENTIFIED",
  "REFERENCE_PENDING_VERIFICATION",
  "VERIFIED",
  "UNAVAILABLE",
  "RIGHTS_RESTRICTED",
  "REJECTED",
];

const VALID_EVIDENCE_TYPES: readonly EvidenceRecord["evidenceType"][] = [
  "TAFSIR_CLASSICAL",
  "TAFSIR_CONTEMPORARY",
  "TRANSLATION_NOTE",
  "EDITORIAL",
  "OTHER",
];

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ─── Record Normalizers ──────────────────────────────────────────────────────

/**
 * Validate one imported review record. Required fields, known decision
 * values, and ISO timestamps are mandatory; malformed records are dropped
 * individually so one bad entry never discards the rest of the history.
 */
function normalizeReviewRecord(value: unknown): ReviewRecord | null {
  if (!isPlainObject(value)) return null;

  const id = asString(value.id);
  const mappingId = asString(value.mappingId);
  const reviewerId = asString(value.reviewerId);
  const rationale = asString(value.rationale);
  const decidedAt = value.decidedAt;
  const decision = value.decision;
  const newState = value.newState;

  if (!id || !mappingId || !reviewerId || !rationale) return null;
  if (typeof decision !== "string" || !VALID_DECISIONS.includes(decision as ReviewDecision)) {
    return null;
  }
  if (typeof newState !== "string" || !VALID_DECISIONS.includes(newState as ReviewDecision)) {
    return null;
  }
  // newState must equal decision: a record whose states disagree is corrupt.
  if (newState !== decision) return null;
  if (!isValidIsoDate(decidedAt)) return null;

  // previousState: null for the first review, otherwise a known decision.
  let previousState: ReviewDecision | null = null;
  if (value.previousState !== null && value.previousState !== undefined) {
    if (
      typeof value.previousState !== "string" ||
      !VALID_DECISIONS.includes(value.previousState as ReviewDecision)
    ) {
      return null;
    }
    previousState = value.previousState as ReviewDecision;
  }

  const evidenceConsidered: string[] = [];
  if (Array.isArray(value.evidenceConsidered)) {
    for (const item of value.evidenceConsidered) {
      const s = asString(item);
      if (s) evidenceConsidered.push(s);
    }
  }

  const record: ReviewRecord = {
    id,
    mappingId,
    reviewerId,
    decision: decision as ReviewDecision,
    rationale,
    evidenceConsidered,
    decidedAt,
    previousState,
    newState: newState as ReviewDecision,
  };
  const role = asString(value.reviewerRole);
  if (role) record.reviewerRole = role;
  return record;
}

/** Validate one imported evidence record against the shared contract. */
function normalizeEvidenceRecord(value: unknown): EvidenceRecord | null {
  if (!isPlainObject(value)) return null;

  const id = asString(value.id);
  const mappingId = asString(value.mappingId);
  const sourceId = asString(value.sourceId);
  const sourceTitle = asString(value.sourceTitle);
  const sourceAuthor = asString(value.sourceAuthor);
  const language = asString(value.language);
  const createdAt = value.createdAt;
  const updatedAt = value.updatedAt;

  if (!id || !mappingId || !sourceId || !sourceTitle || !sourceAuthor || !language) {
    return null;
  }
  if (
    typeof value.surahNumber !== "number" ||
    !Number.isInteger(value.surahNumber) ||
    value.surahNumber < 1 ||
    value.surahNumber > 114
  ) {
    return null;
  }
  if (
    typeof value.ayahNumber !== "number" ||
    !Number.isInteger(value.ayahNumber) ||
    value.ayahNumber < 1
  ) {
    return null;
  }
  if (
    typeof value.status !== "string" ||
    !VALID_EVIDENCE_STATUSES.includes(value.status as EvidenceStatus)
  ) {
    return null;
  }
  if (
    typeof value.evidenceType !== "string" ||
    !VALID_EVIDENCE_TYPES.includes(value.evidenceType as EvidenceRecord["evidenceType"])
  ) {
    return null;
  }
  if (!isValidIsoDate(createdAt) || !isValidIsoDate(updatedAt)) return null;

  const record: EvidenceRecord = {
    id,
    mappingId,
    sourceId,
    sourceTitle,
    sourceAuthor,
    language,
    surahNumber: value.surahNumber,
    ayahNumber: value.ayahNumber,
    evidenceType: value.evidenceType as EvidenceRecord["evidenceType"],
    status: value.status as EvidenceStatus,
    createdAt,
    updatedAt,
  };

  const edition = asString(value.edition);
  if (edition) record.edition = edition;
  const volumePage = asString(value.volumePage);
  if (volumePage) record.volumePage = volumePage;
  const sourceUrl = asString(value.sourceUrl);
  if (sourceUrl) record.sourceUrl = sourceUrl;
  const excerpt = asString(value.excerpt);
  if (excerpt) record.excerpt = excerpt;
  const rightsNote = asString(value.rightsNote);
  if (rightsNote) record.rightsNote = rightsNote;
  const verificationNotes = asString(value.verificationNotes);
  if (verificationNotes) record.verificationNotes = verificationNotes;

  // VERIFIED records must carry verifier + timestamp; otherwise the claim of
  // verification is unsubstantiated and the record is dropped.
  if (record.status === "VERIFIED") {
    const verifierId = asString(value.verifierId);
    if (!verifierId || !isValidIsoDate(value.verifiedAt)) return null;
    record.verifierId = verifierId;
    record.verifiedAt = value.verifiedAt as string;
  } else {
    const verifierId = asString(value.verifierId);
    if (verifierId) record.verifierId = verifierId;
    if (isValidIsoDate(value.verifiedAt)) record.verifiedAt = value.verifiedAt;
  }

  return record;
}

function normalizeReviewer(value: unknown): ScholarlyReviewerIdentity {
  if (!isPlainObject(value)) return { ...EMPTY_REVIEWER_IDENTITY };
  const id = asString(value.id) ?? "";
  const displayName = asString(value.displayName) ?? "";
  const roleNote = asString(value.roleNote);
  // credentialVerified is preserved ONLY when explicitly true. Anything else
  // (missing, string "true", number) resets to false — credentials are never
  // guessed at.
  const credentialVerified = value.credentialVerified === true;
  const reviewer: ScholarlyReviewerIdentity = {
    id,
    displayName,
    credentialVerified,
  };
  if (roleNote) reviewer.roleNote = roleNote;
  return reviewer;
}

function normalizePriorities(value: unknown): Record<string, string> {
  const priorities: Record<string, string> = {};
  if (!isPlainObject(value)) return priorities;
  for (const [mappingId, raw] of Object.entries(value)) {
    if (!mappingId) continue;
    if (
      typeof raw === "string" &&
      (REVIEW_PRIORITIES as readonly string[]).includes(raw)
    ) {
      priorities[mappingId] = raw;
    }
  }
  return priorities;
}

// ─── Total Normalizer ────────────────────────────────────────────────────────

/**
 * Rebuild a ScholarlyState from arbitrary parsed JSON. TOTAL: never throws.
 * Malformed records are dropped individually; missing sections default to
 * empty. Used for both localStorage reads and backup imports.
 *
 * Also accepts the two legacy per-store shapes ({schemaVersion, reviews,
 * lastSavedAt} / {schemaVersion, evidence, lastSavedAt}) so data written
 * directly under either contract key can be merged by loadScholarlyState.
 */
export function normalizeScholarlyState(raw: unknown): ScholarlyState {
  if (!isPlainObject(raw)) {
    return cloneEmptyState();
  }

  const reviews: ReviewRecord[] = [];
  if (Array.isArray(raw.reviews)) {
    for (const item of raw.reviews) {
      const record = normalizeReviewRecord(item);
      if (record) reviews.push(record);
    }
  }

  const evidence: EvidenceRecord[] = [];
  if (Array.isArray(raw.evidence)) {
    for (const item of raw.evidence) {
      const record = normalizeEvidenceRecord(item);
      if (record) evidence.push(record);
    }
  }

  return {
    schemaVersion: SCHOLARLY_SCHEMA_VERSION,
    reviews,
    evidence,
    reviewer: normalizeReviewer(raw.reviewer),
    priorities: normalizePriorities(raw.priorities),
    lastSavedAt: isValidIsoDate(raw.lastSavedAt) ? raw.lastSavedAt : "",
  };
}

/** Fresh deep copy of the empty state (arrays/objects never shared). */
export function cloneEmptyState(): ScholarlyState {
  return {
    schemaVersion: SCHOLARLY_SCHEMA_VERSION,
    reviews: [],
    evidence: [],
    reviewer: { ...EMPTY_REVIEWER_IDENTITY },
    priorities: {},
    lastSavedAt: "",
  };
}

// ─── localStorage Persistence ────────────────────────────────────────────────

/**
 * Read both contract keys and merge them into one ScholarlyState.
 *
 * The combined state is written to BOTH keys on save (each key carries the
 * full normalized state), so either key alone is sufficient to recover
 * everything; merging prefers whichever copy has the newer lastSavedAt.
 * Reviewer identity and priorities ride along in the same envelope.
 */
export function loadScholarlyState(): ScholarlyState {
  if (typeof window === "undefined") return cloneEmptyState();

  const readKey = (key: string): ScholarlyState | null => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      return normalizeScholarlyState(JSON.parse(raw));
    } catch {
      return null;
    }
  };

  const fromReviews = readKey(SCHOLARLY_REVIEW_STORAGE_KEY);
  const fromEvidence = readKey(SCHOLARLY_EVIDENCE_STORAGE_KEY);

  if (!fromReviews && !fromEvidence) return cloneEmptyState();
  if (!fromReviews) return fromEvidence as ScholarlyState;
  if (!fromEvidence) return fromReviews;

  // Both present: prefer the newer snapshot. Equal/absent timestamps keep the
  // reviews-key copy (deterministic tie-break).
  return fromEvidence.lastSavedAt > fromReviews.lastSavedAt
    ? fromEvidence
    : fromReviews;
}

/**
 * Persist the state under both contract keys. Returns true on success.
 * Storage failures are reported (false), not thrown; the caller keeps the
 * state in memory and can disclose the failure.
 */
export function saveScholarlyState(state: ScholarlyState): boolean {
  if (typeof window === "undefined") return false;
  try {
    const normalized = normalizeScholarlyState(state);
    const payload = JSON.stringify(normalized);
    window.localStorage.setItem(SCHOLARLY_REVIEW_STORAGE_KEY, payload);
    window.localStorage.setItem(SCHOLARLY_EVIDENCE_STORAGE_KEY, payload);
    return true;
  } catch {
    return false;
  }
}

/** Remove both contract keys. Client-side only; failures are silent. */
export function clearScholarlyState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SCHOLARLY_REVIEW_STORAGE_KEY);
    window.localStorage.removeItem(SCHOLARLY_EVIDENCE_STORAGE_KEY);
  } catch {
    // Ignore clear failures.
  }
}

// ─── Backup Integration (reflections/journeys convention) ────────────────────

/**
 * JSON-serializable snapshot for the shared v10 backup envelope.
 * The Lead wires this as the `scholarly` section of buildBackup().
 */
export function exportScholarlyState(state: ScholarlyState): ScholarlyState {
  return normalizeScholarlyState(state);
}

/**
 * Restore from a parsed backup section. Re-normalizes here as well as in the
 * backup parser, so no caller can bypass validation. TOTAL: never throws.
 */
export function restoreScholarlyState(raw: unknown): ScholarlyState {
  return normalizeScholarlyState(raw);
}
