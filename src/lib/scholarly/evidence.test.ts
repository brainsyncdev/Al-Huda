// MFD-10.2 — Evidence Module Tests
//
// Covers: creation, verification, rejection, unavailability, rights-restriction,
// reference validation, summarization, derived mapping status, and edge cases.
// Uses real mapping fixtures from getAllMappings() where practical.

import { describe, it, expect, beforeAll } from "vitest";
import {
  createEvidenceRecord,
  verifyEvidence,
  rejectEvidence,
  markUnavailable,
  markRightsRestricted,
  validateEvidenceReference,
  summarizeEvidence,
  deriveEvidenceStatusForMapping,
  getAvailableTafsirSourcesForAyah,
  isVerified,
  isAttachable,
  EVIDENCE_STATUS_LABELS,
  EVIDENCE_STATUS_DESCRIPTIONS,
} from "./evidence";
import type { EvidenceRecord } from "./types";
import { getAllMappings, type TopicMapping } from "../taxonomy/topic-translation-data";

let realMappings: TopicMapping[] = [];

beforeAll(() => {
  realMappings = getAllMappings();
});

function getFirstMapping(): TopicMapping {
  if (realMappings.length === 0) {
    throw new Error("No mappings loaded — check data/taxonomy/topic-ayah-mappings.json");
  }
  return realMappings[0];
}

// ─── Creation ────────────────────────────────────────────────────────────────

describe("createEvidenceRecord", () => {
  it("creates a valid record for a known in-app tafsir source", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      volumePage: "Vol. 1, p. 42",
    });
    expect(result.ok).toBe(true);
    expect(result.record).toBeDefined();
    expect(result.record!.id).toBe(`ev-${m.id}-tafsir-jalalayn`);
    expect(result.record!.sourceId).toBe("tafsir-jalalayn");
    expect(result.record!.status).toBe("REFERENCE_PENDING_VERIFICATION");
    expect(result.record!.language).toBe("Arabic");
    expect(result.record!.volumePage).toBe("Vol. 1, p. 42");
  });

  it("returns error for unknown source ID", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "nonexistent-source",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Unknown source ID");
  });

  it("forces UNAVAILABLE for tafsir-ma(arif)", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-ma(arif)",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      volumePage: "Vol. 2, p. 100",
    });
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("UNAVAILABLE");
  });

  it("defaults to SOURCE_IDENTIFIED for external link-only without ayah-level ref", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-ibn-kathir",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      // No volumePage, no sourceUrl → homepage-only
    });
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("SOURCE_IDENTIFIED");
  });

  it("sets REFERENCE_PENDING_VERIFICATION when specific URL provided for external source", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-ibn-kathir",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      sourceUrl: "https://www.qtafsir.com/surah/1/ayah/1",
    });
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("REFERENCE_PENDING_VERIFICATION");
  });

  it("generates deterministic IDs", () => {
    const m = getFirstMapping();
    const r1 = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    const r2 = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    expect(r1.record!.id).toBe(r2.record!.id);
  });

  it("resolves an ayah-level URL from the registry for in-app tafsirs", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      // No explicit sourceUrl: the registry must supply the ayah route.
    });
    expect(result.ok).toBe(true);
    expect(result.record!.sourceUrl).toBe(
      `/ayah/${m.surahNumber}/${m.ayahStart}?tafsir=ar.jalalayn`
    );
    expect(result.record!.status).toBe("REFERENCE_PENDING_VERIFICATION");
  });

  it("allows verification of an in-app tafsir attached without a manual URL", () => {
    const m = getFirstMapping();
    const created = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-muyassar",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    const verified = verifyEvidence(created.record!, {
      verifierId: "reviewer-001",
      notes: "Read the al-Muyassar passage for this ayah; it addresses the mapping.",
    });
    expect(verified.ok).toBe(true);
    expect(verified.record!.status).toBe("VERIFIED");
  });

  it("never resolves an external homepage into an ayah-level reference", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-ibn-kathir",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    expect(result.record!.sourceUrl).toBe("https://www.qtafsir.com/");
    expect(result.record!.status).toBe("SOURCE_IDENTIFIED");
  });

  it("caches source metadata at creation time", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-muyassar",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    expect(result.ok).toBe(true);
    expect(result.record!.sourceTitle).toBeTruthy();
    expect(result.record!.sourceAuthor).toBeTruthy();
    expect(result.record!.language).toBe("Arabic");
  });
});

// ─── Verification ────────────────────────────────────────────────────────────

describe("verifyEvidence", () => {
  function makeVerifiableRecord(): EvidenceRecord {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      volumePage: "Vol. 1, p. 42",
    });
    return result.record!;
  }

  it("verifies successfully with valid inputs", () => {
    const record = makeVerifiableRecord();
    const result = verifyEvidence(record, {
      verifierId: "reviewer-001",
      notes: "Confirmed passage supports mapping.",
    });
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("VERIFIED");
    expect(result.record!.verifierId).toBe("reviewer-001");
    expect(result.record!.verificationNotes).toBe(
      "Confirmed passage supports mapping."
    );
    expect(result.record!.verifiedAt).toBeTruthy();
  });

  it("rejects empty verifier ID", () => {
    const record = makeVerifiableRecord();
    const result = verifyEvidence(record, {
      verifierId: "",
      notes: "Some notes.",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Verifier ID");
  });

  it("rejects empty notes", () => {
    const record = makeVerifiableRecord();
    const result = verifyEvidence(record, {
      verifierId: "reviewer-001",
      notes: "   ",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toContain("notes");
  });

  it("rejects homepage-only reference (no volume/page, URL equals homepage)", () => {
    const m = getFirstMapping();
    const result = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-ibn-kathir",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      // No volumePage, no sourceUrl
    });
    const record = result.record!;
    const vResult = verifyEvidence(record, {
      verifierId: "reviewer-001",
      notes: "Trying to verify homepage-only.",
    });
    expect(vResult.ok).toBe(false);
    expect(vResult.error).toContain("ayah-level reference");
  });

  it("does not mutate the input record", () => {
    const record = makeVerifiableRecord();
    const originalStatus = record.status;
    verifyEvidence(record, {
      verifierId: "reviewer-001",
      notes: "Test immutability.",
    });
    expect(record.status).toBe(originalStatus);
    expect(record.verifierId).toBeUndefined();
  });
});

// ─── State Transitions ───────────────────────────────────────────────────────

describe("state transitions", () => {
  function makeRecord(): EvidenceRecord {
    const m = getFirstMapping();
    return createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    }).record!;
  }

  it("rejectEvidence requires a note", () => {
    const record = makeRecord();
    const result = rejectEvidence(record, "");
    expect(result.ok).toBe(false);
    expect(result.error).toContain("note");
  });

  it("rejectEvidence sets REJECTED status", () => {
    const record = makeRecord();
    const result = rejectEvidence(record, "Does not support mapping.");
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("REJECTED");
    expect(result.record!.verificationNotes).toBe(
      "Does not support mapping."
    );
  });

  it("markUnavailable requires a note", () => {
    const record = makeRecord();
    const result = markUnavailable(record, "");
    expect(result.ok).toBe(false);
  });

  it("markUnavailable sets UNAVAILABLE status", () => {
    const record = makeRecord();
    const result = markUnavailable(record, "Link broken.");
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("UNAVAILABLE");
  });

  it("markRightsRestricted requires a note", () => {
    const record = makeRecord();
    const result = markRightsRestricted(record, "");
    expect(result.ok).toBe(false);
  });

  it("markRightsRestricted sets RIGHTS_RESTRICTED status", () => {
    const record = makeRecord();
    const result = markRightsRestricted(
      record,
      "Publisher denied display rights."
    );
    expect(result.ok).toBe(true);
    expect(result.record!.status).toBe("RIGHTS_RESTRICTED");
  });
});

// ─── Reference Validation ────────────────────────────────────────────────────

describe("validateEvidenceReference", () => {
  it("accepts valid reference within mapping range", () => {
    const m = getFirstMapping();
    const record: EvidenceRecord = {
      id: "test",
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      sourceTitle: "Test",
      sourceAuthor: "Test",
      language: "ar",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      evidenceType: "TAFSIR_CLASSICAL",
      status: "SOURCE_IDENTIFIED",
      createdAt: "",
      updatedAt: "",
    };
    const result = validateEvidenceReference(record, m);
    expect(result.ok).toBe(true);
  });

  it("rejects wrong surah number", () => {
    const m = getFirstMapping();
    const record: EvidenceRecord = {
      id: "test",
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      sourceTitle: "Test",
      sourceAuthor: "Test",
      language: "ar",
      surahNumber: m.surahNumber + 1,
      ayahNumber: m.ayahStart,
      evidenceType: "TAFSIR_CLASSICAL",
      status: "SOURCE_IDENTIFIED",
      createdAt: "",
      updatedAt: "",
    };
    const result = validateEvidenceReference(record, m);
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Surah");
  });

  it("rejects ayah outside mapping range", () => {
    const m = getFirstMapping();
    const record: EvidenceRecord = {
      id: "test",
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      sourceTitle: "Test",
      sourceAuthor: "Test",
      language: "ar",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahEnd + 10,
      evidenceType: "TAFSIR_CLASSICAL",
      status: "SOURCE_IDENTIFIED",
      createdAt: "",
      updatedAt: "",
    };
    const result = validateEvidenceReference(record, m);
    expect(result.ok).toBe(false);
    expect(result.error).toContain("Ayah");
  });
});

// ─── Summarization ───────────────────────────────────────────────────────────

describe("summarizeEvidence", () => {
  it("counts per status correctly", () => {
    const records: EvidenceRecord[] = [
      { status: "VERIFIED" } as EvidenceRecord,
      { status: "VERIFIED" } as EvidenceRecord,
      { status: "SOURCE_IDENTIFIED" } as EvidenceRecord,
      { status: "REJECTED" } as EvidenceRecord,
    ];
    const summary = summarizeEvidence(records);
    expect(summary.total).toBe(4);
    expect(summary.byStatus.VERIFIED).toBe(2);
    expect(summary.byStatus.SOURCE_IDENTIFIED).toBe(1);
    expect(summary.byStatus.REJECTED).toBe(1);
    expect(summary.hasVerified).toBe(true);
    expect(summary.hasAttached).toBe(true);
    expect(summary.allVerified).toBe(false);
  });

  it("reports allVerified when every record is verified", () => {
    const records: EvidenceRecord[] = [
      { status: "VERIFIED" } as EvidenceRecord,
      { status: "VERIFIED" } as EvidenceRecord,
    ];
    const summary = summarizeEvidence(records);
    expect(summary.allVerified).toBe(true);
  });

  it("handles empty array", () => {
    const summary = summarizeEvidence([]);
    expect(summary.total).toBe(0);
    expect(summary.hasVerified).toBe(false);
    expect(summary.hasAttached).toBe(false);
    expect(summary.allVerified).toBe(false);
  });
});

// ─── Derived Mapping Status ──────────────────────────────────────────────────

describe("deriveEvidenceStatusForMapping", () => {
  const dummyMapping = { id: "test" } as TopicMapping;

  it("returns NOT_ATTACHED when no records", () => {
    expect(deriveEvidenceStatusForMapping(dummyMapping, [])).toBe(
      "NOT_ATTACHED"
    );
  });

  it("returns VERIFIED when present (highest precedence)", () => {
    const records: EvidenceRecord[] = [
      { status: "SOURCE_IDENTIFIED" } as EvidenceRecord,
      { status: "VERIFIED" } as EvidenceRecord,
      { status: "REJECTED" } as EvidenceRecord,
    ];
    expect(deriveEvidenceStatusForMapping(dummyMapping, records)).toBe(
      "VERIFIED"
    );
  });

  it("returns REFERENCE_PENDING_VERIFICATION over SOURCE_IDENTIFIED", () => {
    const records: EvidenceRecord[] = [
      { status: "SOURCE_IDENTIFIED" } as EvidenceRecord,
      { status: "REFERENCE_PENDING_VERIFICATION" } as EvidenceRecord,
    ];
    expect(deriveEvidenceStatusForMapping(dummyMapping, records)).toBe(
      "REFERENCE_PENDING_VERIFICATION"
    );
  });

  it("returns RIGHTS_RESTRICTED over UNAVAILABLE", () => {
    const records: EvidenceRecord[] = [
      { status: "UNAVAILABLE" } as EvidenceRecord,
      { status: "RIGHTS_RESTRICTED" } as EvidenceRecord,
    ];
    expect(deriveEvidenceStatusForMapping(dummyMapping, records)).toBe(
      "RIGHTS_RESTRICTED"
    );
  });

  it("returns REJECTED when only rejected records exist", () => {
    const records: EvidenceRecord[] = [
      { status: "REJECTED" } as EvidenceRecord,
    ];
    expect(deriveEvidenceStatusForMapping(dummyMapping, records)).toBe(
      "REJECTED"
    );
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

describe("helpers", () => {
  it("isVerified returns true only for VERIFIED", () => {
    expect(isVerified("VERIFIED")).toBe(true);
    expect(isVerified("SOURCE_IDENTIFIED")).toBe(false);
    expect(isVerified("NOT_ATTACHED")).toBe(false);
  });

  it("isAttachable returns true for non-terminal states", () => {
    expect(isAttachable("NOT_ATTACHED")).toBe(true);
    expect(isAttachable("SOURCE_IDENTIFIED")).toBe(true);
    expect(isAttachable("REFERENCE_PENDING_VERIFICATION")).toBe(true);
    expect(isAttachable("VERIFIED")).toBe(false);
    expect(isAttachable("UNAVAILABLE")).toBe(false);
    expect(isAttachable("RIGHTS_RESTRICTED")).toBe(false);
    expect(isAttachable("REJECTED")).toBe(false);
  });
});

// ─── Labels & Descriptions ───────────────────────────────────────────────────

describe("labels and descriptions", () => {
  it("every status has a label", () => {
    const statuses = [
      "NOT_ATTACHED",
      "SOURCE_IDENTIFIED",
      "REFERENCE_PENDING_VERIFICATION",
      "VERIFIED",
      "UNAVAILABLE",
      "RIGHTS_RESTRICTED",
      "REJECTED",
    ] as const;
    for (const s of statuses) {
      expect(EVIDENCE_STATUS_LABELS[s]).toBeTruthy();
      expect(typeof EVIDENCE_STATUS_LABELS[s]).toBe("string");
    }
  });

  it("every status has a description", () => {
    const statuses = Object.keys(EVIDENCE_STATUS_LABELS);
    for (const s of statuses) {
      expect(
        EVIDENCE_STATUS_DESCRIPTIONS[s as keyof typeof EVIDENCE_STATUS_DESCRIPTIONS]
      ).toBeTruthy();
    }
  });
});

// ─── Available Tafsir Sources for Ayah ───────────────────────────────────────

describe("getAvailableTafsirSourcesForAyah", () => {
  it("returns 4 sources for any valid ayah", () => {
    const sources = getAvailableTafsirSourcesForAyah(1, 1);
    expect(sources.length).toBe(4);
  });

  it("marks in-app tafsirs as AYAH reference level", () => {
    const sources = getAvailableTafsirSourcesForAyah(1, 1);
    const jalalayn = sources.find((s) => s.sourceId === "tafsir-jalalayn");
    expect(jalalayn).toBeDefined();
    expect(jalalayn!.referenceLevel).toBe("AYAH");
    expect(jalalayn!.isExternal).toBe(false);
  });

  it("marks external tafsirs as HOMEPAGE reference level", () => {
    const sources = getAvailableTafsirSourcesForAyah(1, 1);
    const ibnKathir = sources.find(
      (s) => s.sourceId === "tafsir-ibn-kathir"
    );
    expect(ibnKathir).toBeDefined();
    expect(ibnKathir!.referenceLevel).toBe("HOMEPAGE");
    expect(ibnKathir!.isExternal).toBe(true);
  });

  it("marks tafsir-ma(arif) as unavailable", () => {
    const sources = getAvailableTafsirSourcesForAyah(1, 1);
    const maarif = sources.find((s) => s.sourceId === "tafsir-ma(arif)");
    expect(maarif).toBeDefined();
    expect(maarif!.available).toBe(false);
  });

  it("includes full attribution metadata", () => {
    const sources = getAvailableTafsirSourcesForAyah(1, 1);
    for (const s of sources) {
      expect(s.name).toBeTruthy();
      expect(s.attribution).toBeTruthy();
      expect(s.language).toBeTruthy();
      expect(s.publisher).toBeTruthy();
    }
  });
});
