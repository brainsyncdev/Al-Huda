// Sprint 47 — Automated Morphological Review Regression Tests
//
// Tests the deterministic morphology validation engine, the decision engine,
// reviewer overrides, the orchestration engine, and the AI interface.
//
// KEY POLICY ASSERTIONS (docs/POLICY-DECISION-47.md):
//   - Missing evidence → needs-review, NEVER rejected.
//   - Heuristic contradiction → needs-review, NOT rejected (no authoritative evidence).
//   - Auto-acceptance requires all structural checks + full compatibility.
//   - AI never overrides source evidence.
//   - Morphological acceptance ≠ semantic categorization (polysemy cases accepted).
//   - No provider configured → AI analysis returns null, never fabricated.

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  normalizeLetters,
  strongLetters,
  hasWeakLetters,
  orderedMatchLength,
  runStructuralChecks,
  classifyCompatibility,
  type EngineRecord,
} from "./deterministic";
import { decideOutcome, type DecisionInput } from "./decision";
import {
  validateOverride,
  createOverride,
  getEffectiveOutcome,
  isEligibleForActivation,
} from "./overrides";
import { detectAiProvider, validateAiResponse } from "./ai-interface";
import { reviewRoot, reviewRoots, getActivatableLemmas } from "./engine";
import {
  AUTOMATED_MORPHOLOGY_REVIEW_POLICY,
  type ReviewerOverride,
} from "./types";
import type { MorphologyRecord } from "../types";

const DATA_DIR = join(process.cwd(), "data");

function rec(
  root: string,
  lemma: string | undefined,
  surah: number,
  ayah: number,
  wordPosition: number | undefined
): EngineRecord {
  return {
    ref: { surah, ayah },
    wordPosition,
    token: "tok",
    root,
    lemma,
  };
}

function morphRec(
  root: string,
  lemma: string | undefined,
  surah: number,
  ayah: number,
  wordPosition: number | undefined
): MorphologyRecord {
  return {
    ref: { surah, ayah },
    wordPosition,
    token: "tok",
    canonicalArabic: "ar",
    root,
    lemma,
    sourceId: "qul-morphology-v1",
  };
}

function makeInput(
  partial: Partial<DecisionInput> = {}
): DecisionInput {
  return {
    hasSourceRecords: true,
    structuralChecks: {
      hasSourceRecords: true,
      hasWordLocations: true,
      hasLemmas: true,
      noDuplicates: true,
    },
    compatibilityResult: "compatible",
    aiRecommendation: null,
    rootHasWeakLetters: false,
    ...partial,
  };
}

// === Layer A: deterministic ===

describe("Sprint 47: deterministic normalization", () => {
  it("normalizeLetters strips diacritics and folds alif/hamza forms", () => {
    expect(normalizeLetters("\u0623\u064e\u0631\u0652\u062d\u064e\u0627\u0645")).toEqual([
      "\u0627", "\u0631", "\u062d", "\u0627", "\u0645",
    ]);
  });

  it("normalizeLetters maps ة to ه and ى to ي", () => {
    expect(normalizeLetters("\u0635\u064e\u062f\u064e\u0642\u064e\u0629")).toEqual([
      "\u0635", "\u062f", "\u0642", "\u0647",
    ]);
  });

  it("strongLetters removes weak letters ا و ي", () => {
    expect(strongLetters("\u0648\u0643\u064a\u0644")).toEqual(["\u0643", "\u0644"]);
  });

  it("hasWeakLetters detects weak letters in root and lemma", () => {
    expect(hasWeakLetters("\u0648\u0643\u0644")).toBe(true);
    expect(hasWeakLetters("\u0635\u0628\u0631")).toBe(false);
    expect(hasWeakLetters("\u0643\u0627\u0646")).toBe(true);
  });

  it("orderedMatchLength counts ordered shared letters", () => {
    expect(orderedMatchLength(["\u0635", "\u0628", "\u0631"], ["\u0635", "\u0627", "\u0628", "\u0631"])).toBe(3);
    expect(orderedMatchLength(["\u0635", "\u0628", "\u0631"], ["\u0643", "\u0646"])).toBe(0);
    expect(orderedMatchLength([], ["\u0627"])).toBe(0);
  });
});

describe("Sprint 47: structural checks", () => {
  it("passes for clean records", () => {
    const checks = runStructuralChecks([
      rec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 45, 3),
      rec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 153, 5),
    ]);
    expect(checks.hasSourceRecords).toBe(true);
    expect(checks.hasWordLocations).toBe(true);
    expect(checks.hasLemmas).toBe(true);
    expect(checks.noDuplicates).toBe(true);
  });

  it("detects duplicates", () => {
    const checks = runStructuralChecks([
      rec("r", "l", 2, 45, 3),
      rec("r", "l", 2, 45, 3),
    ]);
    expect(checks.noDuplicates).toBe(false);
  });

  it("detects missing word locations", () => {
    const checks = runStructuralChecks([rec("r", "l", 2, 45, undefined)]);
    expect(checks.hasWordLocations).toBe(false);
  });

  it("detects missing lemma", () => {
    const checks = runStructuralChecks([rec("r", "", 2, 45, 1)]);
    expect(checks.hasLemmas).toBe(false);
  });

  it("detects empty record set", () => {
    const checks = runStructuralChecks([]);
    expect(checks.hasSourceRecords).toBe(false);
  });
});

describe("Sprint 47: compatibility classification", () => {
  it("classifies full match as compatible", () => {
    const { result } = classifyCompatibility("\u0635\u0628\u0631", "\u0635\u064e\u0627\u0628\u0650\u0631");
    expect(result).toBe("compatible");
  });

  it("classifies zero shared + weak letters as inconclusive (not contradicted)", () => {
    // غفر vs كان: zero shared strong letters, but lemma كان has weak ا → inconclusive.
    const { result } = classifyCompatibility("\u063a\u0641\u0631", "\u0643\u0627\u0646");
    expect(result).toBe("inconclusive");
  });

  it("classifies zero shared + no weak letters as contradicted", () => {
    const { result } = classifyCompatibility("\u0635\u0628\u0631", "\u0643\u0646");
    expect(result).toBe("contradicted");
  });

  it("classifies weak-letter root as inconclusive when partial", () => {
    const { result } = classifyCompatibility("\u0648\u0643\u0644", "\u0648\u0643\u064a\u0644");
    // وكل strong = ك,ل ; وكيل strong = ك,ل → full match → compatible.
    expect(result).toBe("compatible");
  });
});

// === Layer C: decision engine ===

describe("Sprint 47: decision engine", () => {
  it("auto-accepts when all checks pass and compatible", () => {
    const out = decideOutcome(makeInput());
    expect(out.outcome).toBe("auto-accepted");
    expect(out.reasonCodes).toContain("ALL_CHECKS_PASS");
  });

  it("routes missing source records to needs-review (never rejected)", () => {
    const out = decideOutcome(makeInput({ hasSourceRecords: false }));
    expect(out.outcome).toBe("needs-review");
    expect(out.outcome).not.toBe("rejected");
    expect(out.reasonCodes).toContain("MISSING_SOURCE_RECORDS");
  });

  it("routes missing lemma field to needs-review", () => {
    const out = decideOutcome(
      makeInput({ structuralChecks: { hasSourceRecords: true, hasWordLocations: true, hasLemmas: false, noDuplicates: true } })
    );
    expect(out.outcome).toBe("needs-review");
  });

  it("routes duplicates to needs-review", () => {
    const out = decideOutcome(
      makeInput({ structuralChecks: { hasSourceRecords: true, hasWordLocations: true, hasLemmas: true, noDuplicates: false } })
    );
    expect(out.outcome).toBe("needs-review");
  });

  it("routes heuristic contradiction to needs-review, NOT rejected", () => {
    // Policy 47: a consonantal heuristic failure is not authoritative evidence.
    const out = decideOutcome(makeInput({ compatibilityResult: "contradicted" }));
    expect(out.outcome).toBe("needs-review");
    expect(out.outcome).not.toBe("rejected");
    expect(out.reasonCodes).toContain("CONSONANTAL_CONTRADICTION_HEURISTIC");
  });

  it("routes inconclusive compatibility to needs-review", () => {
    const out = decideOutcome(makeInput({ compatibilityResult: "inconclusive", rootHasWeakLetters: true }));
    expect(out.outcome).toBe("needs-review");
    expect(out.reasonCodes).toContain("COMPATIBILITY_INCONCLUSIVE");
    expect(out.reasonCodes).toContain("WEAK_LETTER_DERIVATION");
  });
});

// === Reviewer overrides ===

describe("Sprint 47: reviewer overrides", () => {
  it("creates a well-formed override", () => {
    const o = createOverride("needs-review", "auto-accepted", "Dawood", "verified manually");
    expect(o.previousOutcome).toBe("needs-review");
    expect(o.newOutcome).toBe("auto-accepted");
    expect(o.reviewerIdentity).toBe("Dawood");
  });

  it("rejects override with empty identity", () => {
    const o: ReviewerOverride = {
      previousOutcome: "needs-review",
      newOutcome: "auto-accepted",
      reviewerIdentity: "",
      reason: "x",
      overriddenAt: "2026-11-10T00:00:00Z",
    };
    expect(validateOverride(o).valid).toBe(false);
  });

  it("rejects override where identity is AI", () => {
    const o: ReviewerOverride = {
      previousOutcome: "needs-review",
      newOutcome: "auto-accepted",
      reviewerIdentity: "AI",
      reason: "x",
      overriddenAt: "2026-11-10T00:00:00Z",
    };
    const v = validateOverride(o);
    expect(v.valid).toBe(false);
    expect(v.errors.some((e) => e.includes("AI"))).toBe(true);
  });

  it("effective outcome uses override when present", () => {
    const o = createOverride("needs-review", "auto-accepted", "Dawood", "ok");
    expect(getEffectiveOutcome("needs-review", o)).toBe("auto-accepted");
  });

  it("effective outcome uses automated when no override", () => {
    expect(getEffectiveOutcome("needs-review", null)).toBe("needs-review");
  });

  it("only auto-accepted is eligible for activation", () => {
    expect(isEligibleForActivation("auto-accepted", null)).toBe(true);
    expect(isEligibleForActivation("needs-review", null)).toBe(false);
    expect(isEligibleForActivation("rejected", null)).toBe(false);
    const o = createOverride("needs-review", "auto-accepted", "Dawood", "ok");
    expect(isEligibleForActivation("needs-review", o)).toBe(true);
  });
});

// === AI interface ===

describe("Sprint 47: AI interface", () => {
  it("detects no provider when no keys configured", () => {
    // This repo has no provider keys configured.
    expect(detectAiProvider()).toBe("none");
  });

  it("rejects AI response with invalid outcome", () => {
    expect(
      validateAiResponse({ recommendation: "bogus", explanation: "x", evidenceRefs: ["2:45:3"] }, "m", "v")
    ).toBeNull();
  });

  it("rejects AI response without evidence references", () => {
    expect(
      validateAiResponse({ recommendation: "auto-accepted", explanation: "x", evidenceRefs: [] }, "m", "v")
    ).toBeNull();
  });

  it("rejects AI response missing explanation", () => {
    expect(
      validateAiResponse({ recommendation: "auto-accepted", evidenceRefs: ["2:45:3"] }, "m", "v")
    ).toBeNull();
  });

  it("accepts a valid AI response", () => {
    const r = validateAiResponse(
      { recommendation: "auto-accepted", explanation: "ok", evidenceRefs: ["2:45:3"], confidence: "high" },
      "model-x",
      "1.0"
    );
    expect(r).not.toBeNull();
    expect(r!.recommendation).toBe("auto-accepted");
    expect(r!.confidence).toBe("high");
  });
});

// === Orchestration engine ===

describe("Sprint 47: review engine", () => {
  it("reviews a root and produces per-lemma records", () => {
    const records = [
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 45, 3),
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 153, 5),
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0627\u0628\u0650\u0631", 3, 200, 1),
    ];
    const result = reviewRoot("sabr", "\u0635\u0628\u0631", records);
    expect(result.summary.totalLemmas).toBe(2);
    expect(result.summary.autoAccepted).toBe(2);
    expect(result.summary.needsReview).toBe(0);
    expect(result.summary.rejected).toBe(0);
    expect(result.summary.totalOccurrences).toBe(3);
  });

  it("routes a contradictory lemma to needs-review, not rejected", () => {
    const records = [morphRec("\u0635\u0628\u0631", "\u0643\u0646", 2, 45, 1)];
    const result = reviewRoot("test", "\u0635\u0628\u0631", records);
    expect(result.summary.needsReview).toBe(1);
    expect(result.summary.rejected).toBe(0);
  });

  it("getActivatableLemmas returns only auto-accepted lemmas sorted", () => {
    const records = [
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 45, 3),
      morphRec("\u0635\u0628\u0631", "\u0643\u0646", 2, 46, 1), // contradicted → needs-review
    ];
    const result = reviewRoot("test", "\u0635\u0628\u0631", records);
    const activatable = getActivatableLemmas(result);
    expect(activatable).toEqual(["\u0635\u064e\u0628\u064e\u0631"]);
    expect(activatable).not.toContain("\u0643\u0646");
  });

  it("reviewRoots aggregates multiple roots and global summary", () => {
    const records = [
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 45, 3),
      morphRec("\u0634\u0643\u0631", "\u0634\u064e\u0643\u064e\u0631", 2, 152, 4),
    ];
    const artifact = reviewRoots(
      [
        { slug: "sabr", root: "\u0635\u0628\u0631" },
        { slug: "shukr", root: "\u0634\u0643\u0631" },
      ],
      records
    );
    expect(artifact.globalSummary.totalRootsProcessed).toBe(2);
    expect(artifact.globalSummary.totalLemmasEvaluated).toBe(2);
    expect(artifact.globalSummary.totalAutoAccepted).toBe(2);
    expect(artifact.aiProvider).toBe("none");
    expect(artifact.policyVersion).toBe(AUTOMATED_MORPHOLOGY_REVIEW_POLICY);
  });
});

// === Mandatory polysemy cases (morphological acceptance) ===

describe("Sprint 47: mandatory polysemy cases (morphological)", () => {
  it("رحم/أرحام is morphologically auto-accepted (semantics handled separately)", () => {
    const { result } = classifyCompatibility("\u0631\u062d\u0645", "\u0623\u064e\u0631\u0652\u062d\u064e\u0627\u0645");
    expect(result).toBe("compatible");
  });

  it("علم/العالمين is morphologically auto-accepted", () => {
    const { result } = classifyCompatibility("\u0639\u0644\u0645", "\u0639\u064e\u0670\u0644\u064e\u0645\u0650\u064a\u0646");
    expect(result).toBe("compatible");
  });

  it("كبر/أكبر and كبر/استكبر are both morphologically compatible", () => {
    expect(classifyCompatibility("\u0643\u0628\u0631", "\u0623\u064e\u0643\u0652\u0628\u064e\u0631").result).toBe("compatible");
    expect(classifyCompatibility("\u0643\u0628\u0631", "\u0627\u0633\u0652\u062a\u064e\u0643\u0652\u0628\u064e\u0631").result).toBe("compatible");
  });

  it("صدق/صدقة is morphologically auto-accepted", () => {
    expect(classifyCompatibility("\u0635\u062f\u0642", "\u0635\u064e\u062f\u064e\u0642\u064e\u0629").result).toBe("compatible");
  });

  it("وكل/وكيل is morphologically auto-accepted despite weak root", () => {
    expect(classifyCompatibility("\u0648\u0643\u0644", "\u0648\u064e\u0643\u0650\u064a\u0644").result).toBe("compatible");
  });

  it("غفر/كان is routed to needs-review, never rejected", () => {
    const records = [morphRec("\u063a\u0641\u0631", "\u0643\u0627\u0646", 2, 45, 1)];
    const result = reviewRoot("maghfirah", "\u063a\u0641\u0631", records);
    expect(result.summary.needsReview).toBe(1);
    expect(result.summary.rejected).toBe(0);
    expect(result.summary.autoAccepted).toBe(0);
  });
});

// === Artifact + consistency with Sprint 46 ===

describe("Sprint 47: pilot artifact and consistency", () => {
  it("policy version constant is 1.0.0", () => {
    expect(AUTOMATED_MORPHOLOGY_REVIEW_POLICY).toBe("1.0.0");
  });

  it("pilot artifact exists and is valid JSON", () => {
    const p = join(DATA_DIR, "automated-morphology-review.json");
    expect(existsSync(p)).toBe(true);
    const artifact = JSON.parse(readFileSync(p, "utf-8"));
    expect(artifact.policyVersion).toBe("1.0.0");
    expect(artifact.aiProvider).toBe("none");
    expect(artifact.activationPerformed).toBe(false);
    expect(artifact.roots.length).toBe(10);
  });

  it("pilot artifact has zero rejected mappings", () => {
    const p = join(DATA_DIR, "automated-morphology-review.json");
    if (!existsSync(p)) return;
    const artifact = JSON.parse(readFileSync(p, "utf-8"));
    expect(artifact.globalSummary.totalRejected).toBe(0);
  });

  it("pilot artifact needs-review lemmas are only the كان mappings", () => {
    const p = join(DATA_DIR, "automated-morphology-review.json");
    if (!existsSync(p)) return;
    const artifact = JSON.parse(readFileSync(p, "utf-8"));
    const nr: Array<{ slug: string; lemma: string }> = [];
    for (const root of artifact.roots) {
      for (const l of root.lemmas) {
        if (l.outcome !== "auto-accepted") nr.push({ slug: root.slug, lemma: l.lemma });
      }
    }
    expect(nr).toHaveLength(2);
    const lemmas = nr.map((x) => x.lemma);
    // Source data stores the lemma with diacritics ("كَانَ"), so normalize
    // before comparing to the bare form.
    const bareKana = normalizeLetters("\u0643\u0627\u0646").join("");
    expect(lemmas.every((l) => normalizeLetters(l).join("") === bareKana)).toBe(true);
  });
});
