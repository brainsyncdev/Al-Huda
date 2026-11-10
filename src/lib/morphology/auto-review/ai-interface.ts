// Sprint 47 — Layer B: Provider-Independent AI Analysis Interface
//
// This module defines the contract for AI-assisted morphological analysis and
// detects whether an actual provider is configured.
//
// IMPORTANT: No AI provider is currently configured in this repository. There
// are no API keys, no model connectors, and no inference calls. Until a real
// provider is wired up, `detectAiProvider()` returns "none" and
// `analyzeWithAi()` returns null. The system never fabricates an AI
// recommendation, and never presents deterministic output as AI analysis.
//
// The AI answer feature (religious answers) is a separate, disabled feature
// (`AI_ANSWER_FEATURE_ENABLED = false`). Sprint 47 is morphological data
// processing only.

import type { AiRecommendation, AutoReviewOutcome } from "./types";

/**
 * Known provider identifiers. Extend this when a real connector is added.
 * "none" means no provider is configured.
 */
export type AiProviderId = "none" | "openai" | "anthropic" | "google" | "custom";

/**
 * The shape a configured provider must return. Responses are validated against
 * this schema before being accepted; malformed output is treated as "no AI
 * analysis", never as acceptance.
 */
export interface AiAnalysisInput {
  root: string;
  lemma: string;
  sourceOccurrenceCount: number;
  sampleWordLocations: string[];
  deterministicCompatibility: string;
}

/**
 * Detect whether an AI provider is configured.
 *
 * Server-side only. Reads environment variables without exposing them. This
 * implementation checks for the presence of common provider key variables; if
 * none are set, it returns "none".
 *
 * NOTE: This deliberately does NOT read or return secret values. It only
 * reports which provider, if any, appears to be configured.
 */
export function detectAiProvider(): AiProviderId {
  if (typeof process === "undefined" || !process.env) return "none";
  const env = process.env as Record<string, string | undefined>;

  // Check common provider keys. Order defines preference.
  if (env.OPENAI_API_KEY && env.OPENAI_API_KEY.length > 0) return "openai";
  if (env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.length > 0) return "anthropic";
  if (env.GEMINI_API_KEY && env.GEMINI_API_KEY.length > 0) return "google";
  if (env.AI_PROVIDER_ENDPOINT && env.AI_PROVIDER_ENDPOINT.length > 0) return "custom";

  return "none";
}

/**
 * Validate a raw AI response against the recommendation schema.
 * Returns a well-formed AiRecommendation or null if invalid.
 */
export function validateAiResponse(
  raw: unknown,
  modelId: string,
  modelVersion: string
): AiRecommendation | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;

  const recommendation = obj.recommendation;
  const validOutcomes: AutoReviewOutcome[] = ["auto-accepted", "needs-review", "rejected"];
  if (!validOutcomes.includes(recommendation as AutoReviewOutcome)) return null;

  if (typeof obj.explanation !== "string" || obj.explanation.length === 0) return null;

  // Evidence references are mandatory: an AI recommendation without evidence
  // is rejected (treated as no recommendation).
  if (!Array.isArray(obj.evidenceRefs) || obj.evidenceRefs.length === 0) return null;
  const evidenceRefs = obj.evidenceRefs.filter((r): r is string => typeof r === "string");
  if (evidenceRefs.length === 0) return null;

  const confidence =
    obj.confidence === "high" || obj.confidence === "medium" || obj.confidence === "low"
      ? obj.confidence
      : null;

  return {
    recommendation: recommendation as AutoReviewOutcome,
    explanation: obj.explanation,
    confidence,
    modelId,
    modelVersion,
    promptVersion: "sprint-47-morphology-v1",
    analyzedAt: new Date().toISOString(),
    evidenceRefs,
  };
}

/**
 * Analyze a root-lemma mapping with the configured AI provider.
 *
 * CURRENT STATE: No provider is configured, so this always returns null. The
 * function exists so that a real provider can be wired in later without
 * changing the decision engine.
 *
 * When a provider is added, this function must:
 *   1. Call the provider with a structured prompt.
 *   2. Parse and validate the JSON response via validateAiResponse().
 *   3. Return null on timeout, network failure, or invalid output.
 *   4. Never fabricate a recommendation.
 */
export async function analyzeWithAi(
  _input: AiAnalysisInput
): Promise<AiRecommendation | null> {
  const provider = detectAiProvider();
  if (provider === "none") {
    // No provider configured. Do not pretend analysis occurred.
    return null;
  }

  // A real implementation would call the provider here. Since none is wired,
  // we return null rather than invent output.
  return null;
}
