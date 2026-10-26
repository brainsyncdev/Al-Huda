// AI-assisted lemma reviewer — provider-independent interface with deterministic fallback.
//
// DESIGN PRINCIPLES:
//   1. Provider-independent: interface accepts any model provider; no paid API dependency
//   2. Deterministic fallback: when no model is configured, uses structural validation only
//   3. Transparent: clearly marks results as AI-generated, not human scholarly approval
//   4. Evidence-backed: every recommendation carries supporting record references
//   5. Honest: frequency alone never determines semantic inclusion
//   6. Safe: fallback recommends full-set for neutral root-index framing, not topic-scoped
//
// SELECTION MODES:
//   - "full-set": recommend all validated lemmas (neutral root-index framing)
//   - "semantic-subset": recommend a subset based on semantic analysis (requires model provider)
//
// The deterministic fallback only supports "full-set" because it cannot perform
// semantic judgment. It validates structural integrity (all records have lemmas,
// no duplicates, no missing tokens) and recommends the complete lemma set for
// publication under neutral root-index framing ("verses containing forms associated
// with this root"), not topic-scoped framing ("verses about patience").

import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";

export type SelectionMode = "full-set" | "semantic-subset";

export type SemanticConfidence = "supported" | "uncertain" | "unsupported";

export type ReviewerIdentity = "deterministic-fallback" | "model-provider";

export interface AiLemmaReviewResult {
  /** Which lemmas are recommended for inclusion. */
  recommendedLemmas: string[];
  /** How the selection was made. */
  selectionMode: SelectionMode;
  /**
   * For semantic-subset: how confident the reviewer is that the subset is
   * semantically aligned with the root's gloss. Not applicable for full-set.
   */
  semanticConfidence?: SemanticConfidence;
  /** Human-readable rationale explaining the recommendation. */
  rationale: string;
  /** Evidence references supporting the recommendation. */
  evidence: Array<{ lemma: string; count: number; sampleAyat: Array<{ surah: number; ayah: number }> }>;
  /** Who performed the review (deterministic fallback or model provider). */
  reviewer: ReviewerIdentity;
  /** Model name/version if reviewer is model-provider. */
  modelName?: string;
  /** Warnings or caveats about the review. */
  warnings: string[];
  /** True if the reviewer encountered uncertainty or ambiguity. */
  selectionRequired: boolean;
}

/**
 * Deterministic fallback lemma reviewer.
 *
 * This reviewer performs structural validation only:
 *   - All records must have lemmas
 *   - No duplicate word positions
 *   - No missing tokens (warning, not error)
 *
 * If validation passes, it recommends the full lemma set for publication under
 * neutral root-index framing. It does NOT perform semantic judgment about which
 * lemmas belong to a topic — that requires a model provider or human review.
 *
 * The rationale clearly states this is structural validation, not semantic analysis.
 */
export function reviewLemmasDeterministic(
  entry: RootTopicEntry,
  records: MorphologyRecord[],
  lemmaDistribution: Array<{ lemma: string; count: number }>
): AiLemmaReviewResult {
  const warnings: string[] = [];

  // Check for missing lemmas
  const missingLemmas = records.filter((r) => !r.lemma || r.lemma === "");
  if (missingLemmas.length > 0) {
    warnings.push(
      `${missingLemmas.length} records have missing lemmas — cannot validate full set`
    );
  }

  // Check for duplicate positions
  const positionMap = new Map<string, number>();
  for (const r of records) {
    const key = `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition}`;
    positionMap.set(key, (positionMap.get(key) ?? 0) + 1);
  }
  const duplicates = [...positionMap.entries()].filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    warnings.push(
      `${duplicates.length} duplicate word positions detected — data integrity issue`
    );
  }

  // Check for missing tokens
  const missingTokens = records.filter((r) => !r.token || r.token === "");
  if (missingTokens.length > 0) {
    warnings.push(
      `${missingTokens.length} records have missing tokens — alignment may be incomplete`
    );
  }

  // If structural validation fails, return uncertain result
  if (missingLemmas.length > 0 || duplicates.length > 0) {
    return {
      recommendedLemmas: [],
      selectionMode: "full-set",
      rationale:
        "Structural validation failed — cannot recommend lemma set until data integrity issues are resolved.",
      evidence: [],
      reviewer: "deterministic-fallback",
      warnings,
      selectionRequired: true,
    };
  }

  // Structural validation passed — recommend full set for neutral root-index framing
  const allLemmas = lemmaDistribution.map((l) => l.lemma);

  // Build evidence: for each lemma, show count and up to 3 sample ayat
  const evidence = lemmaDistribution.map((l) => {
    const lemmaRecords = records.filter((r) => r.lemma === l.lemma);
    const sampleAyat = [];
    const seen = new Set<string>();
    for (const r of lemmaRecords) {
      const key = `${r.ref.surah}:${r.ref.ayah}`;
      if (!seen.has(key)) {
        seen.add(key);
        sampleAyat.push({ surah: r.ref.surah, ayah: r.ref.ayah });
        if (sampleAyat.length >= 3) break;
      }
    }
    return { lemma: l.lemma, count: l.count, sampleAyat };
  });

  const rationale =
    `Structural validation passed: all ${records.length} records have lemmas, no duplicate positions. ` +
    `Recommending full lemma set (${allLemmas.length} lemmas) for neutral root-index framing. ` +
    `This is structural validation only — no semantic judgment about which lemmas belong to a topic. ` +
    `The root page will display "verses containing forms associated with this root," not "verses about ${entry.title}."`;

  if (missingTokens.length > 0) {
    warnings.push(
      `Note: ${missingTokens.length} records have missing tokens, but all have lemmas — publication allowed with warning`
    );
  }

  return {
    recommendedLemmas: allLemmas,
    selectionMode: "full-set",
    rationale,
    evidence,
    reviewer: "deterministic-fallback",
    warnings,
    selectionRequired: false,
  };
}

/**
 * Interface for model-provider-based lemma review.
 *
 * This is a placeholder for future integration with an AI model provider.
 * The implementation would:
 *   1. Send lemma distribution and sample ayat to a model
 *   2. Ask the model to evaluate semantic alignment with the root's gloss
 *   3. Request a subset recommendation with rationale
 *   4. Validate the response against the TypeScript schema
 *   5. Return an AiLemmaReviewResult with reviewer = "model-provider"
 *
 * The model must NOT be asked to claim scholarly authority or infallibility.
 * The result must clearly state it is AI-generated analysis, not human review.
 *
 * This function is not implemented in Sprint 41 — the deterministic fallback is used.
 */
export async function reviewLemmasWithModel(
  _entry: RootTopicEntry,
  _records: MorphologyRecord[],
  _lemmaDistribution: Array<{ lemma: string; count: number }>,
  _modelName: string
): Promise<AiLemmaReviewResult> {
  throw new Error(
    "Model-provider lemma review is not implemented in Sprint 41. " +
      "Use reviewLemmasDeterministic() for the deterministic fallback."
  );
}
