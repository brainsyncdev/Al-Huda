// Sprint 47 — Layer C: Decision Engine
//
// Deterministic policy rules that produce the final outcome for each
// root-lemma mapping. This layer synthesizes:
//   - Layer A: deterministic structural checks + compatibility analysis
//   - Layer B: AI recommendation (if available, advisory only)
//   - Source evidence: the immutable QUL morphology records
//
// DECISION TABLE (from Sprint 47 spec):
//
// | Evidence condition                              | Outcome       |
// |------------------------------------------------|---------------|
// | Source-backed, all mandatory checks pass       | auto-accepted |
// | Source-backed but compatibility uncertain      | needs-review  |
// | Source contradicted by authoritative evidence  | rejected      |
// | Missing or incomplete source evidence          | needs-review  |
// | AI recommendation conflicts with deterministic | needs-review  |
//
// CRITICAL RULES:
//   - AI recommendations alone NEVER override source evidence.
//   - Missing evidence means needs-review, NEVER rejected.
//   - Rejection requires a verified source contradiction.
//   - No scholarly-approval wording.

import type {
  AiRecommendation,
  AutoReviewOutcome,
  CompatibilityResult,
  DeterministicChecks,
} from "./types";

/**
 * Input to the decision engine for one lemma.
 */
export interface DecisionInput {
  /** Whether the lemma exists in the QUL source with valid records. */
  hasSourceRecords: boolean;
  /** Deterministic structural check results. */
  structuralChecks: DeterministicChecks;
  /** Morphological compatibility classification. */
  compatibilityResult: CompatibilityResult;
  /** AI recommendation, or null if no provider is configured. */
  aiRecommendation: AiRecommendation | null;
  /** Whether the root has weak letters (affects compatibility interpretation). */
  rootHasWeakLetters: boolean;
}

/**
 * Output of the decision engine.
 */
export interface DecisionOutput {
  outcome: AutoReviewOutcome;
  reasonCodes: string[];
  explanation: string;
}

/**
 * Produce the final outcome for one root-lemma mapping.
 *
 * This function is PURE and DETERMINISTIC. Given the same inputs, it always
 * produces the same output. It never reads from external state.
 */
export function decideOutcome(input: DecisionInput): DecisionOutput {
  const reasonCodes: string[] = [];

  // === CASE 1: Missing source records ===
  // Missing or incomplete source evidence -> needs-review (never rejected)
  if (!input.hasSourceRecords) {
    reasonCodes.push("MISSING_SOURCE_RECORDS");
    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "No word-level source records found for this lemma in the QUL morphology dataset. " +
        "Missing evidence requires further morphological review; it is never grounds for rejection.",
    };
  }

  // === CASE 2: Structural failures ===
  // If basic structural checks fail, route to needs-review.
  if (!input.structuralChecks.hasLemmas) {
    reasonCodes.push("MISSING_LEMMA_FIELD");
    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "One or more source records have an empty lemma field. " +
        "This requires investigation of the specific records.",
    };
  }

  if (!input.structuralChecks.hasWordLocations) {
    reasonCodes.push("MISSING_WORD_LOCATIONS");
    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "One or more source records lack a valid word position. " +
        "Word-location consistency cannot be verified without further investigation.",
    };
  }

  if (!input.structuralChecks.noDuplicates) {
    reasonCodes.push("DUPLICATE_POSITIONS");
    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "Duplicate surah:ayah:wordPosition entries detected. " +
        "This indicates a structural inconsistency in the source data that requires review.",
    };
  }

  // === CASE 3: Compatibility analysis ===
  if (input.compatibilityResult === "contradicted") {
    // Sprint 47 policy: "Do not reject a source-backed mapping merely because
    // a simplistic consonantal heuristic fails."
    //
    // A "contradicted" classification (zero shared consonantal structure,
    // no weak letters on either side) is a strong deterministic signal but
    // NOT authoritative evidence. Rejection requires verified source
    // contradiction from authoritative evidence — a heuristic failure is
    // not sufficient. Route to needs-review for human investigation.
    reasonCodes.push("CONSONANTAL_CONTRADICTION_HEURISTIC");

    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "Requires further morphological review: the lemma's consonantal skeleton " +
        "shares zero structure with the assigned root, and no weak-letter derivation " +
        "explains the discrepancy. This heuristic signal is not sufficient for " +
        "rejection — human investigation is needed to determine if this is a " +
        "source-data error or an unusual but valid morphological derivation.",
    };
  }

  if (input.compatibilityResult === "inconclusive") {
    // Source-backed but compatibility is uncertain -> needs-review
    reasonCodes.push("COMPATIBILITY_INCONCLUSIVE");

    // If the root has weak letters, note it as a specific reason
    if (input.rootHasWeakLetters) {
      reasonCodes.push("WEAK_LETTER_DERIVATION");
    }

    // AI agreement check: if AI says auto-accepted, still route to needs-review
    // because deterministic validation is inconclusive.
    if (
      input.aiRecommendation &&
      input.aiRecommendation.recommendation === "auto-accepted"
    ) {
      reasonCodes.push("AI_SUGGESTS_ACCEPT_BUT_DETERMINISTIC_INCONCLUSIVE");
    }

    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "The mapping is source-backed but morphological compatibility is inconclusive. " +
        (input.rootHasWeakLetters
          ? "The root contains weak letters (ا و ي), which commonly produce " +
            "derivations that a simple consonantal heuristic cannot verify. "
          : "") +
        "This requires further morphological analysis or human review.",
    };
  }

  // === CASE 4: Compatible ===
  // compatibilityResult === "compatible"

  // Check AI disagreement
  if (
    input.aiRecommendation &&
    input.aiRecommendation.recommendation === "rejected"
  ) {
    // AI says reject but deterministic says compatible -> needs-review
    reasonCodes.push("COMPATIBLE_BUT_AI_REJECTS");
    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "Deterministic analysis found the mapping compatible, but the AI " +
        "recommendation suggests rejection. Routing to needs-review for " +
        "human investigation. Deterministic evidence takes precedence over " +
        "AI suggestions for acceptance, but AI disagreement triggers review.",
    };
  }

  // All mandatory checks pass and compatibility is confirmed.
  reasonCodes.push("ALL_CHECKS_PASS");
  reasonCodes.push("COMPATIBILITY_CONFIRMED");

  return {
    outcome: "auto-accepted",
    reasonCodes,
    explanation:
      "Automated morphological acceptance: the lemma exists in the QUL source, " +
      "is associated with the root, passes all structural checks, and its " +
      "consonantal skeleton is fully compatible with the root. " +
      "This is a morphological data-validation result, not a scholarly or " +
      "thematic classification.",
  };
}

/**
 * Batch decision for multiple lemmas of one root.
 * Returns outcomes keyed by lemma string.
 */
export function decideOutcomesForRoot(
  lemmaInputs: Array<{ lemma: string; input: DecisionInput }>
): Map<string, DecisionOutput> {
  const results = new Map<string, DecisionOutput>();
  for (const { lemma, input } of lemmaInputs) {
    results.set(lemma, decideOutcome(input));
  }
  return results;
}
