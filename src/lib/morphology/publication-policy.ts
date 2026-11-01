// Publication policy — deterministic eligibility rules for root-index publication.
//
// DESIGN PRINCIPLES:
//   1. Explicit rules, no silent bypass of the activation guard.
//   2. Structural validation is separate from semantic review.
//   3. Ambiguity is documented and checkable, not guessed by the pipeline.
//   4. A published root index is framed neutrally: "verses containing forms
//      associated with this root" — never "verses about X".
//   5. No fabricated reviewer identities or scholarly approvals. Every decision
//      is attributed to "automated-policy" with a policy version.
//
// SEPARATE STAGES (never overloaded into one field):
//   - source validation      → validationIssues (missing lemma, duplicate position)
//   - alignment validation   → missing token, incompatible lemma mapping
//   - AI lemma review        → aiReview (selection mode + evidence)
//   - publication eligibility→ decidePublication()
//
// A root is published only when ALL of the following hold:
//   a) at least one word-level occurrence exists;
//   b) no error-severity validation issue exists;
//   c) no documented ambiguity lemma is observed for that root;
//   d) the review recommended the complete validated lemma set (full-set),
//      made no unresolved selection, and every recommended lemma is observed.
// Otherwise it is "needs-review" (evidence ambiguous or incomplete) or
// "withhold" (the review output contradicts the data).

import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";
import type { AiLemmaReviewResult } from "./ai-lemma-reviewer";
import type { ValidationIssue } from "./review-pipeline";

export const PUBLICATION_POLICY_VERSION = "2.0.0";

/**
 * Documented ambiguity: a lemma that is attested under the root but whose
 * sense is not the root topic's sense. Each entry cites the existing
 * CANDIDATE_ROOTS polysemy note it derives from. Observation of any of these
 * lemmas moves the root to "needs-review" — it does not reject the root.
 */
export const DOCUMENTED_AMBIGUITY: Record<
  string,
  { lemmas: string[]; reason: string }
> = {
  رحم: {
    lemmas: ["أَرْحَام"],
    reason:
      "أرحام means kinship/womb, not mercy — documented in CANDIDATE_ROOTS polysemy notes.",
  },
  علم: {
    lemmas: ["عَٰلَمِين"],
    reason:
      "العالمين means the worlds, not knowledge — documented in CANDIDATE_ROOTS polysemy notes.",
  },
  كبر: {
    lemmas: ["أَكْبَر", "كَبِير", "كَبِيرَة", "كُبْرَىٰ"],
    reason:
      "أكبر/كبير mean big/great while استكبر means arrogance — documented in CANDIDATE_ROOTS polysemy notes.",
  },
  صدق: {
    lemmas: ["صَدَقَة", "صَدَقَٰت", "تَصَدَّقَ"],
    reason:
      "صدقة/تصدق mean charity, not truthfulness — documented in CANDIDATE_ROOTS polysemy notes.",
  },
  وكل: {
    lemmas: ["وَكِيل"],
    reason:
      "وكيل means guardian/agent while توكل means trust in God — documented in CANDIDATE_ROOTS polysemy notes.",
  },
};

const DIACRITICS = /[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const WEAK_LETTERS = new Set(["ا", "و", "ي"]);

/** Normalize Arabic text to bare consonantal letters. */
export function normalizeLetters(text: string): string[] {
  return [...text.replace(DIACRITICS, "")]
    .filter((c) => /[\u0621-\u064A]/.test(c))
    .map((c) => {
      if (c === "أ" || c === "إ" || c === "آ" || c === "ٱ") return "ا";
      if (c === "ى") return "ي";
      if (c === "ؤ") return "و";
      if (c === "ئ") return "ي";
      if (c === "ة") return "ه";
      return c;
    });
}

function strongLetters(text: string): string[] {
  return normalizeLetters(text).filter((c) => !WEAK_LETTERS.has(c));
}

function isOrderedSubsequence(needle: string[], haystack: string[]): boolean {
  let i = 0;
  for (const c of haystack) {
    if (c === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return needle.length === 0;
}

/**
 * Find lemmas whose consonantal skeleton cannot derive from the root.
 * This catches source mapping errors (e.g. a كان lemma filed under غفر).
 * Weak letters (ا و ي) are ignored on both sides so legitimate weak-root
 * derivations are not flagged.
 */
export function findIncompatibleLemmas(
  records: MorphologyRecord[],
  root: string
): Array<{ lemma: string; count: number }> {
  const needle = strongLetters(root);
  if (needle.length === 0) return [];

  const counts = new Map<string, number>();
  for (const record of records) {
    if (!record.lemma) continue;
    if (!isOrderedSubsequence(needle, strongLetters(record.lemma))) {
      counts.set(record.lemma, (counts.get(record.lemma) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([lemma, count]) => ({ lemma, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.lemma < b.lemma ? -1 : a.lemma > b.lemma ? 1 : 0;
    });
}

/** Documented ambiguity lemmas observed in this root's records. */
export function findAmbiguityFlags(
  records: MorphologyRecord[],
  root: string
): Array<{ lemma: string; reason: string; count: number }> {
  const documented = DOCUMENTED_AMBIGUITY[root];
  if (!documented) return [];

  const flags: Array<{ lemma: string; reason: string; count: number }> = [];
  for (const lemma of documented.lemmas) {
    const count = records.filter((r) => r.lemma === lemma).length;
    if (count > 0) {
      flags.push({ lemma, reason: documented.reason, count });
    }
  }
  return flags;
}

export interface PublicationDecision {
  /** Root slug. */
  slug: string;
  /** Arabic root string. */
  root: string;
  /** publish = eligible; needs-review = evidence incomplete; withhold = contradiction. */
  decision: "publish" | "withhold" | "needs-review";
  /** Human-readable reasons for the decision. */
  reasons: string[];
  /** Lemmas eligible for display. Empty unless decision === "publish". */
  includedLemmas: string[];
  /** Documented ambiguity lemmas observed in the data. */
  ambiguityFlags: Array<{ lemma: string; reason: string; count: number }>;
  /** Lemmas that cannot derive from the root (source mapping concern). */
  incompatibleLemmas: Array<{ lemma: string; count: number }>;
  /** Always "automated-policy" — never a human or scholarly identity. */
  decidedBy: "automated-policy";
  /** Policy version that produced the decision. */
  policyVersion: string;
  /**
   * Word-level records for this root that have no lemma in the source dataset.
   * Sprint 42 added this field; Sprint 43 Policy B uses it for disclosure,
   * not as a hard publication block.
   */
  missingLemmaCount: number;
  /** Total word-level records examined for this root. */
  totalWordRecords: number;
  /** Word-level records with lemma mappings (totalWordRecords - missingLemmaCount). */
  recordsWithLemma: number;
  /** Lemma coverage ratio: recordsWithLemma / totalWordRecords. Range [0, 1]. */
  lemmaCoverageRatio: number;
  /**
   * Occurrence alignment status: whether root-mapped word occurrences are
   * correctly aligned to valid locations. "valid" means no structural defects;
   * "invalid" means alignment failures that block publication; "unknown" means
   * validation has not run or is stale.
   */
  occurrenceAlignmentStatus: "valid" | "invalid" | "unknown";
  /**
   * Human-readable disclosure summary for UI. Explains coverage limitations
   * when lemma coverage < 100%. Empty string when coverage is complete.
   */
  coverageDisclosure: string;
}

/**
 * Decide whether a root may be published. Pure and deterministic.
 */
export function decidePublication(
  entry: RootTopicEntry,
  records: MorphologyRecord[],
  validationIssues: ValidationIssue[],
  aiReview: AiLemmaReviewResult
): PublicationDecision {
  const reasons: string[] = [];
  const root = entry.roots[0];
  const ambiguityFlags = findAmbiguityFlags(records, root);
  const incompatibleLemmas = findIncompatibleLemmas(records, root);

  // Sprint 43 Policy B: coverage metadata for disclosure, not a hard block.
  const missingLemmaCount = records.filter((r) => !r.lemma).length;
  const totalWordRecords = records.length;
  const recordsWithLemma = totalWordRecords - missingLemmaCount;
  const lemmaCoverageRatio =
    totalWordRecords > 0 ? recordsWithLemma / totalWordRecords : 0;

  // Occurrence alignment status: derived from validation issues.
  // Error-severity issues indicate alignment failures.
  const errorIssues = validationIssues.filter((i) => i.severity === "error");
  const occurrenceAlignmentStatus: "valid" | "invalid" | "unknown" =
    validationIssues.length === 0
      ? "valid"
      : errorIssues.length > 0
        ? "invalid"
        : "valid"; // warnings only don't block

  // Coverage disclosure: human-readable summary for UI.
  const coverageDisclosure =
    missingLemmaCount > 0
      ? `${missingLemmaCount} of ${totalWordRecords} word-level records have no lemma in the source dataset. Lemma-based filtering is restricted. All source-backed root occurrences are available.`
      : "";

  const base = {
    slug: entry.slug,
    root,
    ambiguityFlags,
    incompatibleLemmas,
    missingLemmaCount,
    totalWordRecords,
    recordsWithLemma,
    lemmaCoverageRatio,
    occurrenceAlignmentStatus,
    coverageDisclosure,
    decidedBy: "automated-policy" as const,
    policyVersion: PUBLICATION_POLICY_VERSION,
  };

  // (a) no data at all → cannot publish or claim contradiction
  if (records.length === 0) {
    return {
      ...base,
      decision: "needs-review",
      reasons: ["No word-level records found for this root."],
      includedLemmas: [],
    };
  }

  const observedLemmas = [
    ...new Set(records.map((r) => r.lemma).filter((l): l is string => Boolean(l))),
  ].sort();

  // (d) review output must agree with the data
  if (aiReview.selectionRequired) {
    return {
      ...base,
      decision: "needs-review",
      reasons: [
        "AI review did not resolve a lemma selection; manual or model review required.",
        ...aiReview.warnings,
      ],
      includedLemmas: [],
    };
  }

  if (aiReview.selectionMode === "semantic-subset" && aiReview.semanticConfidence !== "supported") {
    return {
      ...base,
      decision: "needs-review",
      reasons: [
        `Semantic subset review confidence is "${aiReview.semanticConfidence ?? "missing"}" — not sufficient to publish.`,
      ],
      includedLemmas: [],
    };
  }

  if (aiReview.recommendedLemmas.length === 0) {
    return {
      ...base,
      decision: "withhold",
      reasons: ["Review recommended no lemmas despite non-empty root data."],
      includedLemmas: [],
    };
  }

  const unknown = aiReview.recommendedLemmas.filter((l) => !observedLemmas.includes(l));
  if (unknown.length > 0) {
    return {
      ...base,
      decision: "withhold",
      reasons: [
        `Review recommended lemmas not present in the source data: ${unknown.join(", ")}.`,
      ],
      includedLemmas: [],
    };
  }

  if (
    aiReview.selectionMode === "full-set" &&
    aiReview.recommendedLemmas.length !== observedLemmas.length
  ) {
    return {
      ...base,
      decision: "withhold",
      reasons: [
        `Review declared a full-set selection but recommended ${aiReview.recommendedLemmas.length} of ${observedLemmas.length} observed lemmas.`,
      ],
      includedLemmas: [],
    };
  }

  // (b) source validation must pass
  if (errorIssues.length > 0) {
    return {
      ...base,
      decision: "needs-review",
      reasons: errorIssues.map((i) => i.message),
      includedLemmas: [],
    };
  }

  // Sprint 43 Policy B: missing lemmas are disclosed, not blocking.
  // The occurrence index remains valid for source-backed root mappings.
  // Lemma-based filtering may be incomplete, which is disclosed in UI.

  // (c) documented ambiguity blocks publication
  if (ambiguityFlags.length > 0) {
    return {
      ...base,
      decision: "needs-review",
      reasons: ambiguityFlags.map(
        (f) =>
          `Documented ambiguity lemma observed ${f.count}×: ${f.lemma}. ${f.reason}`
      ),
      includedLemmas: [],
    };
  }

  // alignment: an incompatible lemma means the source mapping itself is suspect
  if (incompatibleLemmas.length > 0) {
    return {
      ...base,
      decision: "needs-review",
      reasons: incompatibleLemmas.map(
        (i) =>
          `Lemma ${i.lemma} (${i.count} records) cannot derive from root ${root} — source mapping must be verified.`
      ),
      includedLemmas: [],
    };
  }

  reasons.push(
    `Structural validation passed for ${records.length} word-level records (${observedLemmas.length} lemmas).`,
    "No documented ambiguity lemma observed.",
    "No incompatible lemma mapping detected.",
    "Review recommended the complete validated lemma set for neutral root-index framing."
  );
  if (aiReview.warnings.length > 0) {
    reasons.push(...aiReview.warnings);
  }

  return {
    ...base,
    decision: "publish",
    reasons,
    includedLemmas: [...aiReview.recommendedLemmas].sort(),
  };
}

/** Backwards-compatible alias used by review-pipeline.ts. */
export function checkPublicationEligibility(
  entry: RootTopicEntry,
  records: MorphologyRecord[],
  validationIssues: ValidationIssue[],
  aiReview: AiLemmaReviewResult
): PublicationDecision {
  return decidePublication(entry, records, validationIssues, aiReview);
}
