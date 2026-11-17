// MFD-10.2 — Scholarly Evidence Pure Module
//
// Provides evidence record creation, verification, state transitions,
// validation, and summarization for the FAHM Quran app review workspace.
// All functions are total (no throws); errors returned as values.
// No React, no fs, no network. Reads source metadata from sources.ts only.

import {
  type EvidenceRecord,
  type EvidenceStatus,
  SCHOLARLY_EVIDENCE_STORAGE_KEY,
} from "./types";
import { getSource, sourceLanguageLabel } from "../quran/sources";
import {
  getTafsirLinkForAyah,
  getAllTafsirSources,
} from "../taxonomy/topic-tafsir-data";
import type { TopicMapping } from "../taxonomy/topic-translation-data";

// Re-export storage key for convenience
export { SCHOLARLY_EVIDENCE_STORAGE_KEY };

// ─── Status Labels & Descriptions ────────────────────────────────────────────

/** Plain-language labels for each evidence status. */
export const EVIDENCE_STATUS_LABELS: Record<EvidenceStatus, string> = {
  NOT_ATTACHED: "Not attached",
  SOURCE_IDENTIFIED: "Source identified",
  REFERENCE_PENDING_VERIFICATION: "Reference pending verification",
  VERIFIED: "Verified",
  UNAVAILABLE: "Unavailable",
  RIGHTS_RESTRICTED: "Rights restricted",
  REJECTED: "Rejected",
};

/** Explanatory descriptions distinguishing each status. */
export const EVIDENCE_STATUS_DESCRIPTIONS: Record<EvidenceStatus, string> = {
  NOT_ATTACHED:
    "No tafsir or scholarly source has been linked to this mapping yet.",
  SOURCE_IDENTIFIED:
    "A source ID has been recorded but its specific content has not been verified against this mapping.",
  REFERENCE_PENDING_VERIFICATION:
    "A specific volume/page or URL reference has been recorded and is awaiting human verification that it supports this mapping.",
  VERIFIED:
    "A human reviewer has confirmed this evidence is authentic, accessible, and relevant to this specific mapping.",
  UNAVAILABLE:
    "The identified source cannot currently be accessed (broken link, out of print, or otherwise unreachable).",
  RIGHTS_RESTRICTED:
    "The source exists but copyright or licensing restrictions prevent displaying its content here.",
  REJECTED:
    "This evidence was examined and determined not to support the mapping.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Returns true when the status represents a fully verified evidence record. */
export function isVerified(status: EvidenceStatus): boolean {
  return status === "VERIFIED";
}

/**
 * Returns true when an evidence record in this status can still have a
 * reference attached or updated (i.e., it is not in a terminal state).
 */
export function isAttachable(status: EvidenceStatus): boolean {
  switch (status) {
    case "NOT_ATTACHED":
    case "SOURCE_IDENTIFIED":
    case "REFERENCE_PENDING_VERIFICATION":
      return true;
    case "VERIFIED":
    case "UNAVAILABLE":
    case "RIGHTS_RESTRICTED":
    case "REJECTED":
      return false;
  }
}

// ─── Evidence Record Creation ────────────────────────────────────────────────

export interface CreateEvidenceInput {
  mappingId: string;
  sourceId: string;
  surahNumber: number;
  ayahNumber: number;
  volumePage?: string;
  excerpt?: string;
  sourceUrl?: string;
  evidenceType?: EvidenceRecord["evidenceType"];
}

export interface CreateEvidenceResult {
  ok: boolean;
  record?: EvidenceRecord;
  error?: string;
}

/**
 * Build an EvidenceRecord from a mapping + source pair.
 *
 * - Pulls sourceTitle, sourceAuthor, language, rightsNote from getSource().
 * - If the source record has available === false, forces status UNAVAILABLE.
 * - If the source is external link-only and no ayah-level reference was
 *   supplied (no volumePage and sourceUrl equals the homepage), defaults
 *   status to SOURCE_IDENTIFIED (never VERIFIED).
 * - Generates deterministic id: ev-<mappingId>-<sourceId>
 */
export function createEvidenceRecord(
  input: CreateEvidenceInput
): CreateEvidenceResult {
  const source = getSource(input.sourceId);
  if (!source) {
    return {
      ok: false,
      error: `Unknown source ID: ${input.sourceId}`,
    };
  }

  const now = new Date().toISOString();
  const id = `ev-${input.mappingId}-${input.sourceId}`;

  // Resolve the reference URL from the existing tafsir registry when the caller
  // did not supply one. In-app tafsirs resolve to a real ayah-level route
  // (/ayah/{s}/{a}?tafsir=...), which is a concrete reference; external sources
  // resolve only to a publisher homepage, which is NOT an ayah-level reference.
  // Nothing is invented here: the URL comes from topic-tafsir-data, the same
  // registry the reader already uses.
  const registryLink = getTafsirLinkForAyah(
    input.surahNumber,
    input.ayahNumber,
    input.sourceId
  );
  const resolvedUrl =
    input.sourceUrl ?? (registryLink ? registryLink.url : undefined);
  const isAyahLevelUrl =
    !!resolvedUrl &&
    resolvedUrl.trim().length > 0 &&
    resolvedUrl !== source.homepage;

  // Determine initial status
  let status: EvidenceStatus;

  if (source.available === false) {
    status = "UNAVAILABLE";
  } else if (input.volumePage || isAyahLevelUrl) {
    // A concrete reference exists, but no human has confirmed it supports the
    // mapping yet. Identified is never the same as verified.
    status = "REFERENCE_PENDING_VERIFICATION";
  } else {
    // Homepage-only or no reference at all.
    status = "SOURCE_IDENTIFIED";
  }

  const record: EvidenceRecord = {
    id,
    mappingId: input.mappingId,
    sourceId: input.sourceId,
    sourceTitle: source.attribution,
    sourceAuthor: source.attribution,
    edition: source.version,
    language: sourceLanguageLabel(source.language),
    volumePage: input.volumePage,
    surahNumber: input.surahNumber,
    ayahNumber: input.ayahNumber,
    sourceUrl: resolvedUrl,
    excerpt: input.excerpt,
    evidenceType: input.evidenceType ?? "TAFSIR_CLASSICAL",
    status,
    rightsNote: source.notes,
    createdAt: now,
    updatedAt: now,
  };

  return { ok: true, record };
}

// ─── Verification ────────────────────────────────────────────────────────────

export interface VerifyEvidenceInput {
  verifierId: string;
  notes: string;
  verifiedAt?: string;
}

export interface VerifyEvidenceResult {
  ok: boolean;
  record?: EvidenceRecord;
  error?: string;
}

/**
 * Return a NEW record with status VERIFIED only when:
 * - verifierId is non-empty
 * - notes is non-empty
 * - The record references a concrete ayah-level reference
 *   (volumePage present OR sourceUrl present and not equal to the source homepage)
 *
 * Otherwise returns { ok: false, error } explaining why.
 * Never mutates the input record.
 */
export function verifyEvidence(
  record: EvidenceRecord,
  input: VerifyEvidenceInput
): VerifyEvidenceResult {
  if (!input.verifierId || input.verifierId.trim().length === 0) {
    return { ok: false, error: "Verifier ID is required for verification." };
  }
  if (!input.notes || input.notes.trim().length === 0) {
    return {
      ok: false,
      error: "Verification notes are required for verification.",
    };
  }

  // Check for ayah-level reference
  const source = getSource(record.sourceId);
  const homepage = source?.homepage ?? "";
  const hasVolumePage = !!record.volumePage && record.volumePage.trim().length > 0;
  const hasAyahLevelUrl =
    !!record.sourceUrl &&
    record.sourceUrl.trim().length > 0 &&
    record.sourceUrl !== homepage;

  if (!hasVolumePage && !hasAyahLevelUrl) {
    return {
      ok: false,
      error:
        "Cannot verify evidence without an ayah-level reference (volume/page or specific URL). A publisher homepage alone is insufficient.",
    };
  }

  const now = input.verifiedAt ?? new Date().toISOString();
  const verified: EvidenceRecord = {
    ...record,
    status: "VERIFIED",
    verifierId: input.verifierId.trim(),
    verificationNotes: input.notes.trim(),
    verifiedAt: now,
    updatedAt: now,
  };

  return { ok: true, record: verified };
}

// ─── State Transitions ───────────────────────────────────────────────────────

export interface TransitionResult {
  ok: boolean;
  record?: EvidenceRecord;
  error?: string;
}

/** Reject evidence: requires a note explaining why. */
export function rejectEvidence(
  record: EvidenceRecord,
  note: string
): TransitionResult {
  if (!note || note.trim().length === 0) {
    return { ok: false, error: "A note is required when rejecting evidence." };
  }
  return {
    ok: true,
    record: {
      ...record,
      status: "REJECTED",
      verificationNotes: note.trim(),
      updatedAt: new Date().toISOString(),
    },
  };
}

/** Mark evidence as unavailable: requires a note. */
export function markUnavailable(
  record: EvidenceRecord,
  note: string
): TransitionResult {
  if (!note || note.trim().length === 0) {
    return {
      ok: false,
      error: "A note is required when marking evidence unavailable.",
    };
  }
  return {
    ok: true,
    record: {
      ...record,
      status: "UNAVAILABLE",
      verificationNotes: note.trim(),
      updatedAt: new Date().toISOString(),
    },
  };
}

/** Mark evidence as rights-restricted: requires a note. */
export function markRightsRestricted(
  record: EvidenceRecord,
  note: string
): TransitionResult {
  if (!note || note.trim().length === 0) {
    return {
      ok: false,
      error: "A note is required when marking evidence rights-restricted.",
    };
  }
  return {
    ok: true,
    record: {
      ...record,
      status: "RIGHTS_RESTRICTED",
      verificationNotes: note.trim(),
      updatedAt: new Date().toISOString(),
    },
  };
}

// ─── Reference Validation ────────────────────────────────────────────────────

export interface ValidateReferenceResult {
  ok: boolean;
  error?: string;
}

/**
 * Validates that the evidence record's surahNumber/ayahNumber fall within
 * the mapping's surahNumber and ayahStart..ayahEnd range.
 */
export function validateEvidenceReference(
  record: EvidenceRecord,
  mapping: TopicMapping
): ValidateReferenceResult {
  if (record.surahNumber !== mapping.surahNumber) {
    return {
      ok: false,
      error: `Evidence references Surah ${record.surahNumber} but mapping is for Surah ${mapping.surahNumber}.`,
    };
  }
  if (
    record.ayahNumber < mapping.ayahStart ||
    record.ayahNumber > mapping.ayahEnd
  ) {
    return {
      ok: false,
      error: `Evidence references Ayah ${record.ayahNumber} but mapping covers Ayah ${mapping.ayahStart}–${mapping.ayahEnd}.`,
    };
  }
  return { ok: true };
}

// ─── Summarization ───────────────────────────────────────────────────────────

export interface EvidenceSummary {
  total: number;
  byStatus: Record<EvidenceStatus, number>;
  hasVerified: boolean;
  hasAttached: boolean;
  allVerified: boolean;
}

/** Count evidence records per status and derive aggregate flags. */
export function summarizeEvidence(records: EvidenceRecord[]): EvidenceSummary {
  const byStatus: Record<EvidenceStatus, number> = {
    NOT_ATTACHED: 0,
    SOURCE_IDENTIFIED: 0,
    REFERENCE_PENDING_VERIFICATION: 0,
    VERIFIED: 0,
    UNAVAILABLE: 0,
    RIGHTS_RESTRICTED: 0,
    REJECTED: 0,
  };

  for (const r of records) {
    byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  }

  const total = records.length;
  const hasVerified = byStatus.VERIFIED > 0;
  const hasAttached = total > 0;
  // allVerified: every attached record is verified (vacuously false when empty)
  const allVerified = total > 0 && byStatus.VERIFIED === total;

  return { total, byStatus, hasVerified, hasAttached, allVerified };
}

// ─── Derived Mapping Status ──────────────────────────────────────────────────

/**
 * Derive the strongest applicable evidence status for a mapping given its
 * evidence records.
 *
 * Precedence (highest to lowest):
 *   VERIFIED > REFERENCE_PENDING_VERIFICATION > SOURCE_IDENTIFIED >
 *   RIGHTS_RESTRICTED > UNAVAILABLE > REJECTED > NOT_ATTACHED
 *
 * Returns NOT_ATTACHED when records array is empty.
 */
export function deriveEvidenceStatusForMapping(
  _mapping: TopicMapping,
  records: EvidenceRecord[]
): EvidenceStatus {
  if (records.length === 0) return "NOT_ATTACHED";

  // Precedence order
  const precedence: EvidenceStatus[] = [
    "VERIFIED",
    "REFERENCE_PENDING_VERIFICATION",
    "SOURCE_IDENTIFIED",
    "RIGHTS_RESTRICTED",
    "UNAVAILABLE",
    "REJECTED",
  ];

  const statuses = new Set(records.map((r) => r.status));
  for (const s of precedence) {
    if (statuses.has(s)) return s;
  }

  return "NOT_ATTACHED";
}

// ─── Available Tafsir Sources for Ayah ───────────────────────────────────────

export interface AyahTafsirSourceInfo {
  sourceId: string;
  name: string;
  attribution: string;
  language: string;
  license: string;
  publisher: string;
  homepage: string;
  isExternal: boolean;
  available: boolean;
  /** Whether the resolved URL targets a specific ayah or just the publisher homepage. */
  referenceLevel: "AYAH" | "HOMEPAGE";
  url: string;
}

/**
 * Wraps topic-tafsir-data to return source metadata plus whether the URL
 * is ayah-level or homepage-level for a given surah/ayah.
 */
export function getAvailableTafsirSourcesForAyah(
  surah: number,
  ayah: number
): AyahTafsirSourceInfo[] {
  const allSources = getAllTafsirSources();

  return allSources.map((s) => {
    const link = getTafsirLinkForAyah(surah, ayah, s.sourceId);
    const sourceRecord = getSource(s.sourceId);
    const homepage = sourceRecord?.homepage ?? s.homepage;

    // Determine reference level
    let referenceLevel: "AYAH" | "HOMEPAGE" = "HOMEPAGE";
    if (link && link.available) {
      if (!s.isExternal) {
        // In-app tafsir links always target a specific ayah
        referenceLevel = "AYAH";
      } else if (link.url !== homepage) {
        referenceLevel = "AYAH";
      }
    }

    return {
      sourceId: s.sourceId,
      name: s.name,
      attribution: s.attribution,
      language: s.language,
      license: s.license,
      publisher: s.publisher,
      homepage: s.homepage,
      isExternal: s.isExternal,
      available: link?.available ?? false,
      referenceLevel,
      url: link?.url ?? homepage,
    };
  });
}
