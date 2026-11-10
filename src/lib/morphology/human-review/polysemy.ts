// Sprint 46 — Phase E: Mandatory Polysemy Safeguards
//
// Explicit polysemy concerns for the 10 manual roots under review.
// These are REVIEW CONCERNS, not predetermined include/exclude decisions.
// The human reviewer must examine each case and make an explicit decision.
//
// DESIGN PRINCIPLES:
//   1. These flags surface potential issues — they do not decide outcomes.
//   2. Each concern cites the specific lemma(s) and the semantic distinction.
//   3. The reviewer sees these warnings in the UI and must address them.
//   4. AI may highlight these concerns but must not decide inclusion/exclusion.

export interface PolysemyConcern {
  /** Root slug this concern applies to. */
  rootSlug: string;
  /** Arabic root string. */
  root: string;
  /** The specific lemma(s) affected. */
  affectedLemmas: string[];
  /** Human-readable description of the concern. */
  description: string;
  /** Severity: "high" = likely wrong inclusion, "medium" = needs attention. */
  severity: "high" | "medium";
  /** What the reviewer should check. */
  reviewerAction: string;
}

/**
 * Mandatory polysemy safeguards for Sprint 46 roots.
 * These are derived from the existing ROOT_ALLOWLIST notes and
 * CANDIDATE_ROOTS polysemy concerns, made explicit and actionable.
 */
export const POLYSEMY_SAFEGUARDS: PolysemyConcern[] = [
  // رحم — Rahmah
  {
    rootSlug: "rahmah",
    root: "\u0631\u062d\u0645",
    affectedLemmas: ["\u0623\u064e\u0631\u0652\u062d\u064e\u0627\u0645"],
    description:
      "أرحام (al-arḥām) means kinship/womb, not mercy. It appears 12 times under root رحم. Including it would add verses about family ties to a mercy topic.",
    severity: "high",
    reviewerAction:
      "Examine the 12 occurrences of أرحام. Decide whether they belong in a mercy topic or should be excluded. Consider: do these verses speak about mercy, or about kinship/womb?",
  },

  // علم — Ilm
  {
    rootSlug: "ilm",
    root: "\u0639\u0644\u0645",
    affectedLemmas: ["\u0639\u064e\u0670\u0644\u064e\u0645\u0650\u064a\u0646"],
    description:
      "العالمين (al-ʿālamīn) means 'the worlds', not knowledge. It appears 73 times under root علم. Including it would put 'Rabb al-ʿālamīn' verses in a knowledge topic.",
    severity: "high",
    reviewerAction:
      "Examine the 73 occurrences of العالمين. These are almost exclusively 'Rabb al-ʿālamīn' (Lord of the worlds). Decide: does this lemma belong in a knowledge topic? The source mapping is correct (same root), but the semantic field is different.",
  },

  // كبر — Kibr
  {
    rootSlug: "kibr",
    root: "\u0643\u0628\u0631",
    affectedLemmas: [
      "\u0623\u064e\u0643\u0652\u0628\u064e\u0631",
      "\u0643\u064e\u0628\u0650\u064a\u0631",
      "\u0643\u064e\u0628\u0650\u064a\u0631\u064e\u0629",
      "\u0643\u064f\u0628\u0652\u0631\u064e\u0649\u0670",
    ],
    description:
      "أكبر/كبير/كبيرة/كبرى mean big/great (neutral size), while استكبر means arrogance (negative). The same root spans neutral magnitude and negative pride. أكبر appears 24 times, كبير 40 times.",
    severity: "high",
    reviewerAction:
      "Decide which lemmas represent arrogance (استكبر, متكبّر, مستكبر) versus neutral greatness (أكبر, كبير). The topic title is 'Greatness/Arrogance' — the reviewer must split lemmas accordingly.",
  },

  // صدق — Sidq
  {
    rootSlug: "sidq",
    root: "\u0635\u062f\u0642",
    affectedLemmas: [
      "\u0635\u064e\u062f\u064e\u0642\u064e\u0629",
      "\u0635\u064e\u062f\u064e\u0642\u064e\u0670\u062a",
      "\u062a\u064e\u0635\u064e\u062f\u0651\u064e\u0642\u064e",
      "\u0645\u064f\u062a\u064e\u0635\u064e\u062f\u0651\u0650\u0642\u0650\u064a\u0646",
      "\u0645\u064f\u062a\u064e\u0635\u064e\u062f\u0651\u064e\u0642\u064e\u0670\u062a",
    ],
    description:
      "صدقة/صدقات/تصدّق mean charity (ṣadaqah), not truthfulness. Including them would pollute a truthfulness topic with charity verses. صَدَقَة appears 5 times, صَدَقَٰت 8 times.",
    severity: "high",
    reviewerAction:
      "Identify all charity-related lemmas (صدقة, صدقات, تصدّق, متصدقين, متصدقات) and decide whether to exclude them from a truthfulness topic.",
  },

  // وكل — Tawakkul
  {
    rootSlug: "tawakkul",
    root: "\u0648\u0643\u0644",
    affectedLemmas: ["\u0648\u064e\u0643\u0650\u064a\u0644"],
    description:
      "وكيل (wakīl) means guardian/agent (legal sense), while توكل (tawakkul) means trust/reliance on God (spiritual sense). وكيل appears 24 times.",
    severity: "medium",
    reviewerAction:
      "Examine the 24 occurrences of وكيل. Determine whether they refer to legal agency (a guardian or representative) or to spiritual trust in God. Decide which sense belongs in a 'Trust/Delegation' topic.",
  },

  // غفر — Maghfirah (incompatible mapping)
  {
    rootSlug: "maghfirah",
    root: "\u063a\u0641\u0631",
    affectedLemmas: ["\u0643\u064e\u0627\u0646\u064e"],
    description:
      "كانَ (kāna, 'was') appears 4 times mapped to root غفر. This is an incompatible consonantal mapping — كان cannot derive from غفر. This is a source-data concern from QUL morphology.",
    severity: "high",
    reviewerAction:
      "Investigate the 4 occurrences where كان is mapped to غفر. This is almost certainly a source-data error. The reviewer should exclude كان and document the finding. Do NOT guess a replacement lemma.",
  },
];

/**
 * Get polysemy concerns for a specific root.
 */
export function getPolysemyConcernsForRoot(
  rootSlug: string
): PolysemyConcern[] {
  return POLYSEMY_SAFEGUARDS.filter((c) => c.rootSlug === rootSlug);
}

/**
 * Get all lemma-level warnings for a root, combining polysemy concerns
 * with compatibility flags.
 */
export function getLemmaWarnings(
  rootSlug: string,
  lemma: string,
  consonantallyCompatible: boolean
): string[] {
  const warnings: string[] = [];

  // Compatibility warning
  if (!consonantallyCompatible) {
    warnings.push(
      `Lemma "${lemma}" cannot derive from this root by consonantal skeleton analysis. This may be a source mapping error or a weak-root derivation.`
    );
  }

  // Polysemy warnings
  const concerns = getPolysemyConcernsForRoot(rootSlug);
  for (const concern of concerns) {
    if (concern.affectedLemmas.includes(lemma)) {
      warnings.push(concern.description);
    }
  }

  return warnings;
}
