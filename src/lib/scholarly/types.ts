// MFD-10.2 — Scholarly Evidence & Review Data Contracts
//
// Shared types used by both the Evidence/Tafsir specialist and the
// Review Workflow/Governance specialist. These types define the
// evidence model and review record schema that integrate with the
// existing 789 mapping records WITHOUT modifying them.
//
// DESIGN PRINCIPLES:
// - Evidence and review records are SEPARATE from mapping records.
// - Original mappings are never mutated.
// - All reviewer identities are locally entered, not authenticated.
// - Evidence verification requires explicit human action.
// - Review history is append-only; corrections create new records.

// ─── Evidence States ────────────────────────────────────────────────────────

/**
 * Evidence attachment and verification states.
 *
 * NOT_ATTACHED: No tafsir source has been linked to this mapping.
 * SOURCE_IDENTIFIED: A source ID has been recorded but content not verified.
 * REFERENCE_PENDING_VERIFICATION: Specific reference (vol/page/URL) recorded,
 *   awaiting human verification that it supports the mapping.
 * VERIFIED: A human reviewer has confirmed the evidence is authentic,
 *   accessible, and relevant to this specific mapping.
 * UNAVAILABLE: The identified source cannot be accessed (broken link,
 *   out of print, etc.).
 * RIGHTS_RESTRICTED: Source exists but copyright/licensing prevents display.
 * REJECTED: Evidence was examined and determined not to support the mapping.
 */
export type EvidenceStatus =
  | "NOT_ATTACHED"
  | "SOURCE_IDENTIFIED"
  | "REFERENCE_PENDING_VERIFICATION"
  | "VERIFIED"
  | "UNAVAILABLE"
  | "RIGHTS_RESTRICTED"
  | "REJECTED";

// ─── Evidence Record ────────────────────────────────────────────────────────

/**
 * An evidence record links a mapping to a specific tafsir or scholarly source.
 * Multiple evidence records can exist per mapping (one per source consulted).
 */
export interface EvidenceRecord {
  /** Unique evidence record ID (e.g., "ev-map-tawheed-fundamentals-0001-jalalayn"). */
  id: string;
  /** Reference to the mapping this evidence supports. */
  mappingId: string;
  /** Source ID from src/lib/quran/sources.ts. */
  sourceId: string;
  /** Human-readable source title (cached from source registry at creation). */
  sourceTitle: string;
  /** Author or institution (cached from source registry). */
  sourceAuthor: string;
  /** Edition or publication info, if applicable. */
  edition?: string;
  /** Language of the evidence. */
  language: string;
  /** Volume and page reference, where applicable. */
  volumePage?: string;
  /** Surah number this evidence references. */
  surahNumber: number;
  /** Ayah number this evidence references. */
  ayahNumber: number;
  /** Stable URL or reference path. */
  sourceUrl?: string;
  /** Brief excerpt or description of relevant passage (copyright-compliant). */
  excerpt?: string;
  /** Type of evidence. */
  evidenceType: "TAFSIR_CLASSICAL" | "TAFSIR_CONTEMPORARY" | "TRANSLATION_NOTE" | "EDITORIAL" | "OTHER";
  /** Current verification status. */
  status: EvidenceStatus;
  /** Identity of person who verified (local identifier, not authenticated). */
  verifierId?: string;
  /** ISO timestamp of verification. */
  verifiedAt?: string;
  /** Notes from verification process. */
  verificationNotes?: string;
  /** Rights/licensing reference. */
  rightsNote?: string;
  /** ISO timestamp when this evidence record was created. */
  createdAt: string;
  /** ISO timestamp of last update. */
  updatedAt: string;
}

// ─── Review Decision Types ──────────────────────────────────────────────────

/**
 * Review decision categories.
 *
 * APPROVED: Mapping is confirmed correct with sufficient evidence.
 * REJECTED: Mapping is determined incorrect or unsupported.
 * REVISION_REQUIRED: Mapping needs modification before approval.
 * INSUFFICIENT_EVIDENCE: Cannot determine correctness with available evidence.
 * DEFERRED: Review postponed (not equivalent to rejection).
 */
export type ReviewDecision =
  | "APPROVED"
  | "REJECTED"
  | "REVISION_REQUIRED"
  | "INSUFFICIENT_EVIDENCE"
  | "DEFERRED";

/**
 * Mapping classification transparency categories.
 * Maps to existing mappingType values plus editorial distinctions.
 */
export type MappingClassification =
  | "DIRECT_QURANIC_REFERENCE"
  | "THEMATIC_REFERENCE"
  | "EDITORIAL_EDUCATIONAL_CATEGORY"
  | "CONTEMPORARY_APPLICATION";

/** Map existing mappingType to classification category. */
export function classifyMappingType(
  mappingType: string
): MappingClassification {
  switch (mappingType) {
    case "DIRECT_REFERENCE":
      return "DIRECT_QURANIC_REFERENCE";
    case "THEMATIC_REFERENCE":
      return "THEMATIC_REFERENCE";
    case "EXPLICIT_INSTRUCTION":
    case "PROPHETIC_NARRATIVE":
      return "EDITORIAL_EDUCATIONAL_CATEGORY";
    default:
      return "EDITORIAL_EDUCATIONAL_CATEGORY";
  }
}

// ─── Review Record ──────────────────────────────────────────────────────────

/**
 * A review record captures one human review decision for a mapping.
 * History is preserved: subsequent decisions create NEW records, never overwrite.
 */
export interface ReviewRecord {
  /** Unique review record ID (e.g., "rev-map-tawheed-fundamentals-0001-001"). */
  id: string;
  /** Reference to the mapping being reviewed. */
  mappingId: string;
  /** Local reviewer identifier (not authenticated; user-entered). */
  reviewerId: string;
  /** Reviewer role or credentials note (self-declared, not verified). */
  reviewerRole?: string;
  /** The review decision. */
  decision: ReviewDecision;
  /** Mandatory rationale explaining the decision. */
  rationale: string;
  /** Evidence record IDs considered in this decision. */
  evidenceConsidered: string[];
  /** ISO timestamp of the decision. */
  decidedAt: string;
  /** Previous review state before this decision (null if first review). */
  previousState: ReviewDecision | null;
  /** New review state after this decision. */
  newState: ReviewDecision;
}

// ─── Review State Summary ───────────────────────────────────────────────────

/**
 * Computed review state for a mapping, derived from its review history.
 * This is NOT stored; it is computed from ReviewRecords.
 */
export interface MappingReviewState {
  mappingId: string;
  /** Most recent decision, or null if never reviewed. */
  currentDecision: ReviewDecision | null;
  /** Total number of review records. */
  reviewCount: number;
  /** ISO timestamp of most recent review. */
  lastReviewedAt: string | null;
  /** Number of evidence records attached. */
  evidenceCount: number;
  /** Number of verified evidence records. */
  verifiedEvidenceCount: number;
  /** Whether any evidence is attached. */
  hasEvidence: boolean;
  /** Whether all attached evidence is verified. */
  allEvidenceVerified: boolean;
}

// ─── Storage Keys ───────────────────────────────────────────────────────────

export const SCHOLARLY_REVIEW_STORAGE_KEY = "alhuda-scholarly-reviews";
export const SCHOLARLY_EVIDENCE_STORAGE_KEY = "alhuda-scholarly-evidence";
export const SCHOLARLY_SCHEMA_VERSION = 1;

// ─── State Containers ───────────────────────────────────────────────────────

export interface ScholarlyReviewStore {
  schemaVersion: typeof SCHOLARLY_SCHEMA_VERSION;
  reviews: ReviewRecord[];
  lastSavedAt: string;
}

export interface ScholarlyEvidenceStore {
  schemaVersion: typeof SCHOLARLY_SCHEMA_VERSION;
  evidence: EvidenceRecord[];
  lastSavedAt: string;
}
