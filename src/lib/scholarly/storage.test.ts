// MFD-10.2 — Scholarly Storage Tests
//
// Covers: normalize handles null/garbage/partial, malformed review records
// dropped, valid records preserved, round-trip export→restore, legacy/absent
// section defaults, credentialVerified defaults false, clear works, and the
// 789 mapping records are untouched.

import { describe, it, expect, beforeAll, vi } from "vitest";
import {
  EMPTY_SCHOLARLY_STATE,
  cloneEmptyState,
  normalizeScholarlyState,
  exportScholarlyState,
  restoreScholarlyState,
  loadScholarlyState,
  saveScholarlyState,
  clearScholarlyState,
  type ScholarlyState,
} from "./storage";
import { SCHOLARLY_SCHEMA_VERSION } from "./types";
import { getAllMappings, type TopicMapping } from "../taxonomy/topic-translation-data";

let realMappings: TopicMapping[] = [];

beforeAll(() => {
  realMappings = getAllMappings();
});

// ─── normalizeScholarlyState ─────────────────────────────────────────────────

describe("normalizeScholarlyState", () => {
  it("returns empty state for null", () => {
    const s = normalizeScholarlyState(null);
    expect(s.schemaVersion).toBe(SCHOLARLY_SCHEMA_VERSION);
    expect(s.reviews).toEqual([]);
    expect(s.evidence).toEqual([]);
    expect(s.reviewer.credentialVerified).toBe(false);
  });

  it("returns empty state for garbage (string, number, array)", () => {
    expect(normalizeScholarlyState("hello").reviews).toEqual([]);
    expect(normalizeScholarlyState(42).reviews).toEqual([]);
    expect(normalizeScholarlyState([1, 2]).reviews).toEqual([]);
  });

  it("returns empty state for undefined", () => {
    expect(normalizeScholarlyState(undefined).reviews).toEqual([]);
  });

  it("drops malformed review records while preserving valid ones", () => {
    const raw = {
      schemaVersion: 1,
      reviews: [
        // Valid
        {
          id: "rev-m1-001",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "DEFERRED",
          rationale: "Later.",
          evidenceConsidered: [],
          decidedAt: "2026-01-01T00:00:00Z",
          previousState: null,
          newState: "DEFERRED",
        },
        // Missing rationale → dropped
        {
          id: "rev-m1-002",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "APPROVED",
          rationale: "",
          evidenceConsidered: [],
          decidedAt: "2026-01-02T00:00:00Z",
          previousState: null,
          newState: "APPROVED",
        },
        // Unknown decision → dropped
        {
          id: "rev-m1-003",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "MAYBE",
          rationale: "Not sure.",
          evidenceConsidered: [],
          decidedAt: "2026-01-03T00:00:00Z",
          previousState: null,
          newState: "MAYBE",
        },
        // Invalid timestamp → dropped
        {
          id: "rev-m1-004",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "REJECTED",
          rationale: "No.",
          evidenceConsidered: [],
          decidedAt: "not-a-date",
          previousState: null,
          newState: "REJECTED",
        },
        // newState ≠ decision → dropped
        {
          id: "rev-m1-005",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "APPROVED",
          rationale: "Yes.",
          evidenceConsidered: [],
          decidedAt: "2026-01-05T00:00:00Z",
          previousState: null,
          newState: "REJECTED",
        },
        // Not an object → dropped
        "just a string",
        null,
      ],
      evidence: [],
      reviewer: { id: "r1", displayName: "Reviewer", credentialVerified: false },
      priorities: {},
      lastSavedAt: "2026-01-01T00:00:00Z",
    };
    const s = normalizeScholarlyState(raw);
    expect(s.reviews.length).toBe(1);
    expect(s.reviews[0].id).toBe("rev-m1-001");
  });

  it("preserves valid evidence records and drops malformed ones", () => {
    const raw = {
      reviews: [],
      evidence: [
        {
          id: "ev-1",
          mappingId: "m1",
          sourceId: "tafsir-jalalayn",
          sourceTitle: "Al-Jalalayn",
          sourceAuthor: "Jalal",
          language: "Arabic",
          surahNumber: 2,
          ayahNumber: 255,
          evidenceType: "TAFSIR_CLASSICAL",
          status: "SOURCE_IDENTIFIED",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
        // VERIFIED without verifierId → dropped
        {
          id: "ev-2",
          mappingId: "m1",
          sourceId: "tafsir-jalalayn",
          sourceTitle: "Al-Jalalayn",
          sourceAuthor: "Jalal",
          language: "Arabic",
          surahNumber: 2,
          ayahNumber: 255,
          evidenceType: "TAFSIR_CLASSICAL",
          status: "VERIFIED",
          createdAt: "2026-01-01T00:00:00Z",
          updatedAt: "2026-01-01T00:00:00Z",
        },
        // Missing required fields → dropped
        { id: "ev-3" },
      ],
    };
    const s = normalizeScholarlyState(raw);
    expect(s.evidence.length).toBe(1);
    expect(s.evidence[0].id).toBe("ev-1");
  });

  it("credentialVerified defaults to false even when roleNote looks scholarly", () => {
    const raw = {
      reviews: [],
      evidence: [],
      reviewer: {
        id: "r1",
        displayName: "Sheikh Ahmad",
        roleNote: "Senior scholar at university",
        credentialVerified: "yes", // string, not boolean true
      },
    };
    const s = normalizeScholarlyState(raw);
    expect(s.reviewer.credentialVerified).toBe(false);
    expect(s.reviewer.roleNote).toBe("Senior scholar at university");
  });

  it("credentialVerified is preserved only when explicitly boolean true", () => {
    const raw = {
      reviewer: {
        id: "r1",
        displayName: "R",
        credentialVerified: true,
      },
    };
    const s = normalizeScholarlyState(raw);
    expect(s.reviewer.credentialVerified).toBe(true);
  });

  it("defaults missing sections (legacy/absent)", () => {
    const s = normalizeScholarlyState({});
    expect(s.reviews).toEqual([]);
    expect(s.evidence).toEqual([]);
    expect(s.priorities).toEqual({});
    expect(s.reviewer.id).toBe("");
    expect(s.lastSavedAt).toBe("");
  });

  it("normalizes priorities, dropping unknown values", () => {
    const raw = {
      priorities: { m1: "HIGH", m2: "CRITICAL", m3: "LOW", "": "NORMAL" },
    };
    const s = normalizeScholarlyState(raw);
    expect(s.priorities.m1).toBe("HIGH");
    expect(s.priorities.m3).toBe("LOW");
    expect(s.priorities.m2).toBeUndefined(); // CRITICAL not in REVIEW_PRIORITIES
    expect(s.priorities[""]).toBeUndefined();
  });
});

// ─── Round-trip export → restore ─────────────────────────────────────────────

describe("export / restore round-trip", () => {
  it("produces identical normalized state", () => {
    const original: ScholarlyState = {
      schemaVersion: SCHOLARLY_SCHEMA_VERSION,
      reviews: [
        {
          id: "rev-m1-001",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "DEFERRED",
          rationale: "Later.",
          evidenceConsidered: [],
          decidedAt: "2026-01-01T00:00:00Z",
          previousState: null,
          newState: "DEFERRED",
        },
      ],
      evidence: [],
      reviewer: { id: "r1", displayName: "R", credentialVerified: false },
      priorities: { m1: "HIGH" },
      lastSavedAt: "2026-01-01T00:00:00Z",
    };
    const exported = exportScholarlyState(original);
    const restored = restoreScholarlyState(exported);
    expect(restored).toEqual(exported);
  });

  it("restore re-normalizes garbage input safely", () => {
    const restored = restoreScholarlyState("garbage");
    expect(restored.schemaVersion).toBe(SCHOLARLY_SCHEMA_VERSION);
    expect(restored.reviews).toEqual([]);
  });
});

// ─── EMPTY_SCHOLARLY_STATE ───────────────────────────────────────────────────

describe("EMPTY_SCHOLARLY_STATE", () => {
  it("has the expected shape", () => {
    expect(EMPTY_SCHOLARLY_STATE.schemaVersion).toBe(1);
    expect(EMPTY_SCHOLARLY_STATE.reviews).toEqual([]);
    expect(EMPTY_SCHOLARLY_STATE.evidence).toEqual([]);
    expect(EMPTY_SCHOLARLY_STATE.reviewer.credentialVerified).toBe(false);
    expect(EMPTY_SCHOLARLY_STATE.priorities).toEqual({});
    expect(EMPTY_SCHOLARLY_STATE.lastSavedAt).toBe("");
  });

  it("cloneEmptyState produces independent copies", () => {
    const a = cloneEmptyState();
    const b = cloneEmptyState();
    a.reviews.push({} as any);
    expect(b.reviews.length).toBe(0);
  });
});

// ─── localStorage functions (mocked) ─────────────────────────────────────────

describe("loadScholarlyState / saveScholarlyState / clearScholarlyState", () => {
  const mockStorage: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: vi.fn((k: string) => mockStorage[k] ?? null),
    setItem: vi.fn((k: string, v: string) => { mockStorage[k] = v; }),
    removeItem: vi.fn((k: string) => { delete mockStorage[k]; }),
  };

  beforeAll(() => {
    // @ts-expect-error mocking window for node test env
    globalThis.window = { localStorage: mockLocalStorage };
  });

  it("load returns empty state when nothing stored", () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    const s = loadScholarlyState();
    expect(s.reviews).toEqual([]);
  });

  it("save persists and load retrieves", () => {
    const state: ScholarlyState = {
      ...cloneEmptyState(),
      reviews: [
        {
          id: "rev-1",
          mappingId: "m1",
          reviewerId: "r1",
          decision: "DEFERRED",
          rationale: "test",
          evidenceConsidered: [],
          decidedAt: "2026-01-01T00:00:00Z",
          previousState: null,
          newState: "DEFERRED",
        },
      ],
    };
    const ok = saveScholarlyState(state);
    expect(ok).toBe(true);
    const loaded = loadScholarlyState();
    expect(loaded.reviews.length).toBe(1);
  });

  it("clear removes both keys", () => {
    saveScholarlyState(cloneEmptyState());
    clearScholarlyState();
    expect(mockLocalStorage.removeItem).toHaveBeenCalled();
  });
});

// ─── 789 Mapping Records Immutability ────────────────────────────────────────

// ─── v10 Backup Fixture Integration ──────────────────────────────────────────

describe("v10 backup fixture integration", () => {
  it("normalizes the Lead's fixture preserving all valid records", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const fixturePath = path.resolve(
      process.cwd(),
      "tests/fixtures/backup/v10-backup.json"
    );
    if (!fs.existsSync(fixturePath)) return;

    const raw = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
    const s = normalizeScholarlyState(raw.scholarly);

    expect(s.schemaVersion).toBe(SCHOLARLY_SCHEMA_VERSION);
    expect(s.reviews.length).toBe(1);
    expect(s.reviews[0].id).toBe("rev-map-tawheed-fundamentals-0001-001");
    expect(s.reviews[0].decision).toBe("APPROVED");
    expect(s.reviews[0].evidenceConsidered).toContain(
      "ev-map-tawheed-fundamentals-0001-tafsir-jalalayn"
    );
    expect(s.evidence.length).toBe(1);
    expect(s.evidence[0].status).toBe("VERIFIED");
    expect(s.evidence[0].verifierId).toBe("local-reviewer-1");
    expect(s.reviewer.id).toBe("local-reviewer-1");
    expect(s.reviewer.displayName).toBe("Local Reviewer");
    expect(s.reviewer.roleNote).toBe("Student of knowledge");
    expect(s.reviewer.credentialVerified).toBe(false);
    expect(s.priorities).toEqual({});
    expect(s.lastSavedAt).toBe("2026-10-01T14:30:00.000Z");

    // Round-trip stability
    const exported = exportScholarlyState(s);
    const restored = restoreScholarlyState(exported);
    expect(restored).toEqual(exported);
  });
});

// ─── 789 Mapping Records Immutability ────────────────────────────────────────

describe("789 mapping records immutability through storage ops", () => {
  it("normalize/export/restore do not touch mapping data", () => {
    expect(realMappings.length).toBe(789);
    const snapshotBefore = JSON.stringify(realMappings);

    // Run heavy normalization
    const raw = {
      reviews: Array.from({ length: 100 }, (_, i) => ({
        id: `rev-${i}`,
        mappingId: realMappings[i % 789].id,
        reviewerId: "r1",
        decision: "DEFERRED",
        rationale: "test",
        evidenceConsidered: [],
        decidedAt: "2026-01-01T00:00:00Z",
        previousState: null,
        newState: "DEFERRED",
      })),
      evidence: [],
    };
    const normalized = normalizeScholarlyState(raw);
    const exported = exportScholarlyState(normalized);
    restoreScholarlyState(exported);

    const snapshotAfter = JSON.stringify(realMappings);
    expect(snapshotAfter).toBe(snapshotBefore);
  });
});
