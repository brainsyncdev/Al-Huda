// Test artifact for the AI evaluation set (AI-SAFETY evaluation gates).
//
// Written as an implementation artifact and NOT executed in this environment:
// verification is deferred to the final release phase by directive. The gate
// it supports (`evaluation-dataset` in src/lib/ai/feature-flag.ts) therefore
// stays `met: false` — running this file and recording the result is part of
// what flips it.

import { describe, expect, it } from "vitest";
import {
  EVALUATION_SET,
  runCase,
  runEvaluationSet,
} from "./evaluation-set";
import { respond } from "./grounding";
import { AI_ANSWER_FEATURE_ENABLED, allGatesMet } from "./feature-flag";
import { isGateEvidence } from "./audit";

describe("grounded-answer evaluation set", () => {
  it("covers the failure modes the gate names", () => {
    const ids = EVALUATION_SET.map((c) => c.id);
    // Fabricated reference, non-authority refusal, high-risk redirect,
    // generated-Arabic refusal, unknown topic — each must exist as a case.
    expect(ids).toContain("ref-fabricated-2-287");
    expect(ids).toContain("claim-hadith");
    expect(ids).toContain("risk-fatwa");
    expect(ids).toContain("claim-generated-arabic");
    expect(ids).toContain("claim-unknown-topic");
  });

  it("passes every case (target: 100% validated references)", () => {
    const report = runEvaluationSet();
    expect(report.failures).toEqual([]);
    expect(report.allPassed).toBe(true);
    expect(report.total).toBe(EVALUATION_SET.length);
  });

  it("runs each case individually without throwing", () => {
    for (const testCase of EVALUATION_SET) {
      const result = runCase(testCase);
      expect(result.passed, `${result.id}: ${result.detail}`).toBe(true);
    }
  });
});

describe("feature gate and audit", () => {
  it("keeps the answer feature off", () => {
    expect(AI_ANSWER_FEATURE_ENABLED).toBe(false);
    expect(allGatesMet()).toBe(false);
  });

  it("rejects every call while the flag is off", () => {
    const result = respond("What does 2:286 say?", []);
    expect(result.outcome).toBe("rejected-flag-off");
    expect(result.segments).toEqual([]);
  });

  it("writes audit records that carry no user or prompt text", () => {
    const result = respond("What does 2:286 say?", []);
    const keys = Object.keys(result.audit);
    expect(keys).not.toContain("user");
    expect(keys).not.toContain("userId");
    expect(keys).not.toContain("question");
    expect(keys).not.toContain("prompt");
  });

  it("refuses to treat abstentions or flag rejections as gate evidence", () => {
    const rejected = respond("What does 2:286 say?", []);
    expect(isGateEvidence(rejected.audit)).toBe(false);
  });
});
