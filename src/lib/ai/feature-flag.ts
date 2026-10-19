// The AI answer feature gate (PRD §10, AI-SAFETY "Evaluation Gates").
//
// The flag is the safety mechanism, not a product switch: no `/api/ai/ask`
// route exists in this build, and every harness module below behaves as if the
// feature is off — because it is. Flipping it here would still not expose an
// endpoint; it would only allow the harness to emit answers.
//
// ENABLING REQUIRES ALL GATES IN `AI_GATES` TO BE `met: true`, each with
// evidence, per docs/AI-SAFETY.md. The gates below record their real current
// state; none of them is marked met on the strength of code existing.

/**
 * Deliberately typed as the literal `false` rather than `boolean`, so a module
 * that narrows on it can never accidentally widen back to "sometimes on" at
 * compile time.
 */
export const AI_ANSWER_FEATURE_ENABLED = false as const;

export type AiAnswerEnabled = typeof AI_ANSWER_FEATURE_ENABLED;

/**
 * Model identity for audit records (FR-065).
 *
 * "unconfigured" is the honest value: no model is wired, no key exists, and no
 * inference call can happen. A placeholder model name that looked real would
 * poison the very audit trail the gate report depends on.
 */
export const AI_MODEL_NAME = "none";
export const AI_MODEL_VERSION = "unconfigured";

export type GateId =
  | "evaluation-dataset"
  | "citation-coverage"
  | "abstention-rate"
  | "hallucination-zero"
  | "source-registry"
  | "privacy-review"
  | "editorial-reviewer";

export interface SafetyGate {
  id: GateId;
  label: string;
  /** True only when evidence exists; see `evidence`. */
  met: boolean;
  /** What would satisfy the gate, or where the evidence lives when met. */
  evidence: string;
}

/**
 * The seven gates from docs/AI-SAFETY.md, evaluated honestly.
 *
 * `source-registry` is met: src/lib/quran/sources.ts pins every source with
 * version, licence, and delivery method, and /sources renders it. The rest are
 * unmet because the work they describe (evaluation runs, privacy sign-off,
 * a named qualified reviewer) has not happened.
 */
export const AI_GATES: SafetyGate[] = [
  {
    id: "source-registry",
    label: "Source registry complete with versioning and licences",
    met: true,
    evidence: "src/lib/quran/sources.ts (versioned, licensed) rendered on /sources",
  },
  {
    id: "evaluation-dataset",
    label: "Evaluation dataset of reference queries passes with validated citations",
    met: false,
    evidence:
      "Cases exist in src/lib/ai/evaluation-set.ts, but no run has been executed or signed off in this release.",
  },
  {
    id: "citation-coverage",
    label: "Every claim carries a verifiable citation in the allowlisted corpus",
    met: false,
    evidence: "Enforced by src/lib/ai/grounding.ts; coverage run not yet recorded.",
  },
  {
    id: "abstention-rate",
    label: "Abstention rate meets threshold on high-risk queries",
    met: false,
    evidence: "Threshold undefined and unmeasured; harness abstains on all high-risk cases.",
  },
  {
    id: "hallucination-zero",
    label: "Zero fabricated ayah, hadith, or tafsir citations",
    met: false,
    evidence: "Test artifact exists; no executed run in this environment.",
  },
  {
    id: "privacy-review",
    label: "Audit logging policy reviewed, minimal retention defined",
    met: false,
    evidence: "Audit records store no user or prompt text by construction; policy not yet reviewed.",
  },
  {
    id: "editorial-reviewer",
    label: "Qualified reviewer/advisor assigned to review AI outputs",
    met: false,
    evidence: "No qualified reviewer is assigned in this build (governance TBD, PRD §20).",
  },
];

/** True only when every gate is met. Callers must gate on this, never on one gate. */
export function allGatesMet(gates: SafetyGate[] = AI_GATES): boolean {
  return gates.every((gate) => gate.met);
}

/**
 * Runtime check used by the harness before any answer is emitted.
 *
 * Kept as a function (not a bare constant read) so call sites read as a
 * decision, and so flipping the flag later changes behavior in one place.
 */
export function isAiAnswerEnabled(): boolean {
  return AI_ANSWER_FEATURE_ENABLED;
}
