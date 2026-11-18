// MFD-10.2 — Scholarly Review Workflow Tests
//
// Covers: valid approval, rejection of approval without rationale, rejection
// of approval without verified evidence, missing reviewer identity, all five
// decisions, history preservation across multiple decisions, reversal creates
// a new record and keeps old, invalid transition (all transitions are actually
// legal per policy but we verify the gate), governance bucket never approves
// on technical validation alone, priority is human-set, and the 789 mapping
// records are untouched by review operations.

import { describe, it, expect, beforeAll } from "vitest";
import {
  validateDecision,
  recordDecision,
  getReviewHistory,
  deriveMappingReviewState,
  deriveGovernanceBucket,
  setPriority,
  getPriority,
  REVIEW_DECISION_LABELS,
  REVIEW_DECISION_DESCRIPTIONS,
  ALLOWED_TRANSITIONS,
  isAllowedTransition,
  REVIEW_STATUS_BUCKETS,
  type ValidateDecisionInput,
} from "./reviews";
import {
  SCHOLARLY_SCHEMA_VERSION,
  type EvidenceRecord,
  type ReviewDecision,
  type ReviewRecord,
  type ScholarlyReviewStore,
} from "./types";
import { getAllMappings, type TopicMapping } from "../taxonomy/topic-translation-data";

let realMappings: TopicMapping[] = [];

beforeAll(() => {
  realMappings = getAllMappings();
});

function emptyStore(): ScholarlyReviewStore {
  return {
    schemaVersion: SCHOLARLY_SCHEMA_VERSION,
    reviews: [],
    lastSavedAt: "",
  };
}

function baseInput(overrides?: Partial<ValidateDecisionInput>): ValidateDecisionInput {
  return {
    mappingId: "map-tawheed-fundamentals-0001",
    reviewerId: "local-reviewer-1",
    decision: "DEFERRED",
    rationale: "Postponing until more evidence is gathered.",
    evidenceConsidered: [],
    verifiedEvidenceIds: [],
    ...overrides,
  };
}

// ─── Decision Labels & Descriptions ──────────────────────────────────────────

describe("REVIEW_DECISION_LABELS / DESCRIPTIONS", () => {
  it("covers all five decisions", () => {
    const keys = Object.keys(REVIEW_DECISION_LABELS);
    expect(keys).toContain("APPROVED");
    expect(keys).toContain("REJECTED");
    expect(keys).toContain("REVISION_REQUIRED");
    expect(keys).toContain("INSUFFICIENT_EVIDENCE");
    expect(keys).toContain("DEFERRED");
  });

  it("descriptions clarify DEFERRED ≠ rejection and INSUFFICIENT_EVIDENCE ≠ wrong", () => {
    expect(REVIEW_DECISION_DESCRIPTIONS.DEFERRED.toLowerCase()).toMatch(/not.*rejection|postpon/i);
    expect(REVIEW_DECISION_DESCRIPTIONS.INSUFFICIENT_EVIDENCE.toLowerCase()).toMatch(
      /does not mean.*wrong|not proof|cannot determine/i
    );
  });
});

// ─── ALLOWED_TRANSITIONS ─────────────────────────────────────────────────────

describe("ALLOWED_TRANSITIONS", () => {
  it("includes UNREVIEWED as a source state", () => {
    expect(ALLOWED_TRANSITIONS.UNREVIEWED).toBeDefined();
    expect(ALLOWED_TRANSITIONS.UNREVIEWED.length).toBe(5);
  });

  it("every decision can follow every prior state (documented policy)", () => {
    for (const key of Object.keys(ALLOWED_TRANSITIONS)) {
      expect(ALLOWED_TRANSITIONS[key as keyof typeof ALLOWED_TRANSITIONS].length).toBe(5);
    }
  });
});

// ─── Validation ──────────────────────────────────────────────────────────────

describe("validateDecision", () => {
  it("accepts a valid DEFERRED decision", () => {
    const result = validateDecision(baseInput());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.decision).toBe("DEFERRED");
      expect(result.value.newState).toBe("DEFERRED");
      expect(result.value.previousState).toBeNull();
    }
  });

  it("rejects missing reviewer identity", () => {
    const result = validateDecision(baseInput({ reviewerId: "" }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/reviewer identity|required/i);
  });

  it("rejects approval without rationale", () => {
    const result = validateDecision(
      baseInput({
        decision: "APPROVED",
        rationale: "",
        evidenceConsidered: ["ev-1"],
        verifiedEvidenceIds: ["ev-1"],
      })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/rationale/i);
  });

  it("rejects approval without any evidence considered", () => {
    const result = validateDecision(
      baseInput({
        decision: "APPROVED",
        rationale: "Looks correct.",
        evidenceConsidered: [],
        verifiedEvidenceIds: [],
      })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/evidence/i);
  });

  it("rejects approval when no considered evidence is VERIFIED", () => {
    const result = validateDecision(
      baseInput({
        decision: "APPROVED",
        rationale: "Looks correct.",
        evidenceConsidered: ["ev-1", "ev-2"],
        verifiedEvidenceIds: ["ev-99"], // none of the considered ones
      })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/verified/i);
  });

  it("accepts valid APPROVED with verified evidence", () => {
    const result = validateDecision(
      baseInput({
        decision: "APPROVED",
        rationale: "Direct Quranic declaration confirmed by al-Jalalayn.",
        evidenceConsidered: ["ev-1"],
        verifiedEvidenceIds: ["ev-1"],
      })
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value.decision).toBe("APPROVED");
  });

  it("accepts REVISION_REQUIRED with rationale", () => {
    const result = validateDecision(
      baseInput({
        decision: "REVISION_REQUIRED",
        rationale: "Ayah range should be narrower.",
      })
    );
    expect(result.ok).toBe(true);
  });

  it("accepts INSUFFICIENT_EVIDENCE with rationale", () => {
    const result = validateDecision(
      baseInput({
        decision: "INSUFFICIENT_EVIDENCE",
        rationale: "No tafsir supports this thematic link yet.",
      })
    );
    expect(result.ok).toBe(true);
  });

  it("accepts REJECTED with rationale", () => {
    const result = validateDecision(
      baseInput({
        decision: "REJECTED",
        rationale: "This ayah does not address the claimed topic.",
      })
    );
    expect(result.ok).toBe(true);
  });

  it("rejects unknown decision value", () => {
    const result = validateDecision(
      baseInput({ decision: "MAYBE" as unknown as ReviewDecision })
    );
    expect(result.ok).toBe(false);
  });

  it("rejects empty mappingId", () => {
    const result = validateDecision(baseInput({ mappingId: "" }));
    expect(result.ok).toBe(false);
  });
});

// ─── Record Decision (append-only) ──────────────────────────────────────────

describe("recordDecision", () => {
  it("appends a record with deterministic sequential id", () => {
    let store = emptyStore();
    const r1 = recordDecision(store, baseInput());
    expect(r1.ok).toBe(true);
    if (r1.ok) {
      expect(r1.record.id).toBe("rev-map-tawheed-fundamentals-0001-001");
      expect(r1.store.reviews.length).toBe(1);
      store = r1.store;
    }
    const r2 = recordDecision(store, baseInput({ decision: "REJECTED", rationale: "Wrong." }));
    expect(r2.ok).toBe(true);
    if (r2.ok) {
      expect(r2.record.id).toBe("rev-map-tawheed-fundamentals-0001-002");
      expect(r2.record.previousState).toBe("DEFERRED");
      expect(r2.store.reviews.length).toBe(2);
    }
  });

  it("returns error instead of mutating when validation fails", () => {
    const store = emptyStore();
    const result = recordDecision(store, baseInput({ reviewerId: "" }));
    expect(result.ok).toBe(false);
    expect(store.reviews.length).toBe(0); // original untouched
  });
});

// ─── History Preservation & Reversals ────────────────────────────────────────

describe("getReviewHistory", () => {
  it("returns chronological oldest-first history", () => {
    let store = emptyStore();
    const r1 = recordDecision(store, baseInput({ decidedAt: "2026-01-01T00:00:00Z" }));
    if (r1.ok) store = r1.store;
    const r2 = recordDecision(store, baseInput({ decision: "APPROVED", rationale: "OK", evidenceConsidered: ["ev-1"], verifiedEvidenceIds: ["ev-1"], decidedAt: "2026-06-01T00:00:00Z" }));
    if (r2.ok) store = r2.store;

    const history = getReviewHistory(store, "map-tawheed-fundamentals-0001");
    expect(history.length).toBe(2);
    expect(history[0].decidedAt).toBe("2026-01-01T00:00:00Z");
    expect(history[1].decidedAt).toBe("2026-06-01T00:00:00Z");
  });

  it("reversal creates a new record and preserves the old one", () => {
    let store = emptyStore();
    const r1 = recordDecision(store, baseInput({ decision: "APPROVED", rationale: "Confirmed.", evidenceConsidered: ["ev-1"], verifiedEvidenceIds: ["ev-1"] }));
    if (r1.ok) store = r1.store;
    const r2 = recordDecision(store, baseInput({ decision: "REVISION_REQUIRED", rationale: "Re-examined, needs change." }));
    if (r2.ok) store = r2.store;

    const history = getReviewHistory(store, "map-tawheed-fundamentals-0001");
    expect(history.length).toBe(2);
    expect(history[0].decision).toBe("APPROVED");
    expect(history[1].decision).toBe("REVISION_REQUIRED");
    expect(history[1].previousState).toBe("APPROVED");
    // The first record was NOT erased or edited:
    expect(history[0].newState).toBe("APPROVED");
  });
});

// ─── Derived State ───────────────────────────────────────────────────────────

describe("deriveMappingReviewState", () => {
  it("computes correct summary from reviews and evidence", () => {
    const reviews: ReviewRecord[] = [
      {
        id: "rev-1",
        mappingId: "m1",
        reviewerId: "r1",
        decision: "DEFERRED",
        rationale: "Later.",
        evidenceConsidered: [],
        decidedAt: "2026-01-01T00:00:00Z",
        previousState: null,
        newState: "DEFERRED",
      },
    ];
    const evidence: EvidenceRecord[] = [
      {
        id: "ev-1",
        mappingId: "m1",
        sourceId: "s1",
        sourceTitle: "T",
        sourceAuthor: "A",
        language: "en",
        surahNumber: 2,
        ayahNumber: 255,
        evidenceType: "TAFSIR_CLASSICAL",
        status: "VERIFIED",
        verifierId: "v1",
        verifiedAt: "2026-01-01T00:00:00Z",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ];
    const state = deriveMappingReviewState("m1", reviews, evidence);
    expect(state.currentDecision).toBe("DEFERRED");
    expect(state.reviewCount).toBe(1);
    expect(state.evidenceCount).toBe(1);
    expect(state.verifiedEvidenceCount).toBe(1);
    expect(state.hasEvidence).toBe(true);
    expect(state.allEvidenceVerified).toBe(true);
  });

  it("returns nulls/zeros for unreviewed mapping", () => {
    const state = deriveMappingReviewState("unknown", [], []);
    expect(state.currentDecision).toBeNull();
    expect(state.reviewCount).toBe(0);
    expect(state.lastReviewedAt).toBeNull();
    expect(state.hasEvidence).toBe(false);
  });
});

// ─── Governance Bucket ───────────────────────────────────────────────────────

describe("deriveGovernanceBucket", () => {
  it("NEVER returns GOVERNANCE_APPROVED merely because technical validators pass", () => {
    const state = deriveMappingReviewState("m1", [], []);
    // technicallyValidated = true, but no human decision
    const bucket = deriveGovernanceBucket(state, true);
    expect(bucket).not.toBe("GOVERNANCE_APPROVED");
    expect(bucket).toBe("TECHNICALLY_VALIDATED");
  });

  it("returns GOVERNANCE_APPROVED only when latest decision is APPROVED", () => {
    const reviews: ReviewRecord[] = [
      {
        id: "rev-1",
        mappingId: "m1",
        reviewerId: "r1",
        decision: "APPROVED",
        rationale: "Yes.",
        evidenceConsidered: ["ev-1"],
        decidedAt: "2026-01-01T00:00:00Z",
        previousState: null,
        newState: "APPROVED",
      },
    ];
    const state = deriveMappingReviewState("m1", reviews, []);
    expect(deriveGovernanceBucket(state, false)).toBe("GOVERNANCE_APPROVED");
  });

  it("returns HUMAN_REVIEWED for non-approved decisions", () => {
    const reviews: ReviewRecord[] = [
      {
        id: "rev-1",
        mappingId: "m1",
        reviewerId: "r1",
        decision: "REJECTED",
        rationale: "No.",
        evidenceConsidered: [],
        decidedAt: "2026-01-01T00:00:00Z",
        previousState: null,
        newState: "REJECTED",
      },
    ];
    const state = deriveMappingReviewState("m1", reviews, []);
    expect(deriveGovernanceBucket(state, true)).toBe("HUMAN_REVIEWED");
  });
});

// ─── Priority ────────────────────────────────────────────────────────────────

function priorityStore() {
  return { priorities: {} as Record<string, string>, reviews: [] as ReviewRecord[] };
}

describe("setPriority / getPriority", () => {
  it("is human-set only and defaults to NORMAL", () => {
    const next = setPriority(priorityStore(), "m1", "HIGH");
    expect(getPriority(next, "m1")).toBe("HIGH");
    expect(getPriority(next, "m2")).toBe("NORMAL");
  });

  it("ignores invalid priority values", () => {
    const next = setPriority(priorityStore(), "m1", "CRITICAL" as never);
    expect(getPriority(next, "m1")).toBe("NORMAL");
  });

  it("ignores empty mapping ids", () => {
    const next = setPriority(priorityStore(), "", "HIGH");
    expect(Object.keys(next.priorities)).toEqual([]);
  });

  it("returns a NEW store and leaves the input untouched", () => {
    const original = priorityStore();
    const next = setPriority(original, "m1", "LOW");
    expect(next).not.toBe(original);
    expect(original.priorities).toEqual({});
    expect(next.priorities.m1).toBe("LOW");
  });

  it("stores priority separately from decisions (no review record created)", () => {
    const original = priorityStore();
    const next = setPriority(original, "m1", "HIGH");
    expect(next.reviews).toEqual([]);
    expect(next.reviews.length).toBe(0);
  });

  it("never derives priority from AI or automated process", () => {
    // Enforced structurally: setPriority takes an explicit human ReviewPriority
    // parameter. There is no computePriority/derivePriority function exported.
    const next = setPriority(priorityStore(), "m1", "LOW");
    expect(next.priorities["m1"]).toBe("LOW");
  });
});

// ─── Transition Gate & State Machine Documentation ───────────────────────────

describe("isAllowedTransition / ALLOWED_TRANSITIONS gate", () => {
  it("allows any decision from UNREVIEWED", () => {
    for (const d of Object.keys(REVIEW_DECISION_LABELS)) {
      expect(isAllowedTransition(null, d as unknown as ReviewDecision)).toBe(true);
      expect(isAllowedTransition("UNREVIEWED", d as unknown as ReviewDecision)).toBe(true);
    }
  });

  it("allows reversal from APPROVED to REVISION_REQUIRED (documented policy)", () => {
    expect(isAllowedTransition("APPROVED", "REVISION_REQUIRED")).toBe(true);
  });

  it("allows reversal from REJECTED to APPROVED when new evidence arrives", () => {
    expect(isAllowedTransition("REJECTED", "APPROVED")).toBe(true);
  });

  it("every source state lists exactly all five decisions", () => {
    for (const key of Object.keys(ALLOWED_TRANSITIONS)) {
      const allowed = ALLOWED_TRANSITIONS[key as keyof typeof ALLOWED_TRANSITIONS];
      expect(allowed.sort()).toEqual(
        ["APPROVED", "DEFERRED", "INSUFFICIENT_EVIDENCE", "REJECTED", "REVISION_REQUIRED"].sort()
      );
    }
  });

  it("the constraint is on per-decision requirements, not graph edges", () => {
    // APPROVED→APPROVED is structurally legal (re-affirmation), but still
    // requires rationale + verified evidence at validateDecision time.
    expect(isAllowedTransition("APPROVED", "APPROVED")).toBe(true);
  });
});

describe("REVIEW_STATUS_BUCKETS", () => {
  it("contains all six documented buckets in order", () => {
    expect(REVIEW_STATUS_BUCKETS).toEqual([
      "TECHNICALLY_VALIDATED",
      "EVIDENCE_ATTACHED",
      "EVIDENCE_VERIFIED",
      "AWAITING_SCHOLARLY_REVIEW",
      "HUMAN_REVIEWED",
      "GOVERNANCE_APPROVED",
    ]);
  });
});

// ─── v10 Backup Fixture Integration ──────────────────────────────────────────

describe("v10 backup fixture integration", () => {
  it("normalizes and round-trips the Lead's v10 fixture without data loss", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const fixturePath = path.resolve(
      process.cwd(),
      "tests/fixtures/backup/v10-backup.json"
    );
    if (!fs.existsSync(fixturePath)) {
      // Graceful skip when running outside the full checkout.
      return;
    }
    const raw = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
    const scholarly = raw.scholarly;
    expect(scholarly).toBeDefined();
    expect(scholarly.schemaVersion).toBe(1);
    expect(scholarly.reviews.length).toBeGreaterThanOrEqual(1);
    expect(scholarly.evidence.length).toBeGreaterThanOrEqual(1);
    expect(scholarly.reviewer.credentialVerified).toBe(false);

    // Import normalizeScholarlyState dynamically to keep this file focused
    // on reviews logic while still validating the fixture shape.
    const { normalizeScholarlyState, exportScholarlyState, restoreScholarlyState } =
      await import("./storage");
    const normalized = normalizeScholarlyState(scholarly);
    expect(normalized.reviews.length).toBe(scholarly.reviews.length);
    expect(normalized.evidence.length).toBe(scholarly.evidence.length);
    expect(normalized.reviewer.id).toBe("local-reviewer-1");

    const exported = exportScholarlyState(normalized);
    const restored = restoreScholarlyState(exported);
    expect(restored).toEqual(exported);
  });
});

// ─── 789 Mapping Records Immutability ────────────────────────────────────────

describe("789 mapping records immutability", () => {
  it("review operations do not mutate the original mapping dataset", () => {
    expect(realMappings.length).toBe(789);
    const snapshotBefore = JSON.stringify(realMappings);

    // Perform several review operations
    let store = emptyStore();
    for (let i = 0; i < 5; i++) {
      const m = realMappings[i];
      const r = recordDecision(store, baseInput({
        mappingId: m.id,
        decision: "DEFERRED",
        rationale: `Deferring ${m.id}`,
      }));
      if (r.ok) store = r.store;
    }
    // Approve one
    const approveResult = recordDecision(store, baseInput({
      mappingId: realMappings[0].id,
      decision: "APPROVED",
      rationale: "Confirmed after review.",
      evidenceConsidered: ["ev-test"],
      verifiedEvidenceIds: ["ev-test"],
    }));
    if (approveResult.ok) store = approveResult.store;

    const snapshotAfter = JSON.stringify(realMappings);
    expect(snapshotAfter).toBe(snapshotBefore);
  });
});
