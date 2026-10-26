// Root allowlist configuration for topic discovery.
//
// DESIGN PRINCIPLES (set by user, 2026-10-25):
//
//   1. One root = one topic. No splitting a root into multiple pages.
//   2. Root is a candidate — only explicitly included lemmas enter the topic.
//      This is `includedLemmas`, not `excludedLemmas`.
//   3. No arbitrary ayah-count cap. If a root is too broad, don't make it a
//      topic, or paginate.
//   4. Every root must be verified against the actual imported morphology
//      source before enabling. Candidates listed here are NOT enabled until
//      a lemma breakdown report is reviewed.
//   5. Polysemy is handled per-topic: the reviewer picks which lemmas belong.
//   6. Label: "ayaat jin mein *X* ka lafz aaya hai" — verses in which the
//      word occurs — never "about X".
//
// STATUS: schema + validators only. No roots are enabled yet — the allowlist
// is empty until morphology data is integrated and lemma breakdowns are
// reviewed. Candidate roots are listed in CANDIDATE_ROOTS for reference.

/**
 * Review status for a root-topic entry. Follows the same lifecycle as the
 * taxonomy schema (proposed → pending-review → approved | rejected).
 */
export type RootTopicReviewState =
  | "candidate"
  | "pending-review"
  | "approved"
  | "rejected";

/**
 * One root-topic entry. Maps a root (or root set) to a topic with explicit
 * lemma inclusion, review status, and provenance.
 */
export interface RootTopicEntry {
  /** Stable slug for URL routing (e.g., "sabr", "shukr"). */
  slug: string;
  /** English title. */
  title: string;
  /** Arabic title. */
  arabicTitle: string;
  /**
   * Root or root set. Single root: ["ص-ب-ر"]. Root set: ["ب-ي-ع", "ت-ج-ر"]
   * for concepts like commerce that span multiple roots.
   */
  roots: string[];
  /**
   * Explicitly included lemmas. Only words whose lemma matches one of these
   * will appear in the topic's ayah list. Empty array means "not yet
   * reviewed — no lemmas approved yet."
   */
  includedLemmas: string[];
  /**
   * Maximum results to display. Optional — if set, the UI paginates or
   * truncates. If unset, all matching ayahs are shown.
   */
  maxResults?: number;
  /** Review state. */
  reviewState: RootTopicReviewState;
  /** Who asserted this entry. */
  assertedBy: string;
  /** ISO date of assertion or last review. */
  assertedAt: string;
  /**
   * Notes about polysemy or review decisions. For example, "ع-ل-م includes
   * العالمين (worlds) — excluded from knowledge topic; only علم، يعلم،
   * علماء included."
   */
  notes?: string;
}

/**
 * The root allowlist. Only entries with reviewState !== "candidate" and
 * non-empty includedLemmas are enabled for display.
 *
 * STATUS: empty. No roots are enabled yet.
 */
export const ROOT_ALLOWLIST: RootTopicEntry[] = [];

/**
 * Candidate roots for future topic creation. These are NOT enabled — they
 * are listed for reference and for the lemma-breakdown report that must
 * precede any enabling decision.
 *
 * Each candidate is flagged with known polysemy concerns identified by the
 * user (2026-10-25).
 */
export const CANDIDATE_ROOTS: Array<{
  root: string;
  transliteration: string;
  gloss: string;
  polysemyConcerns: string[];
}> = [
  {
    root: "ص-ب-ر",
    transliteration: "ṣ-b-r",
    gloss: "patience",
    polysemyConcerns: [
      "Relatively unambiguous — primary meaning is patience/perseverance",
    ],
  },
  {
    root: "ش-ك-ر",
    transliteration: "sh-k-r",
    gloss: "gratitude",
    polysemyConcerns: [
      "Relatively unambiguous — primary meaning is gratitude/thankfulness",
    ],
  },
  {
    root: "ر-ح-م",
    transliteration: "r-ḥ-m",
    gloss: "mercy",
    polysemyConcerns: [
      "Includes الأرحام (al-arḥām, kinship/womb) — would pollute mercy topic",
      "Reviewer must decide which lemmas belong",
    ],
  },
  {
    root: "ع-ل-م",
    transliteration: "ʿ-l-m",
    gloss: "knowledge",
    polysemyConcerns: [
      "Includes العالمين (al-ʿālamīn, the worlds) — would put 'Rabb al-alamin' ayahs in knowledge topic",
      "Very high frequency root — may produce thousands of matches",
    ],
  },
  {
    root: "ت-و-ب",
    transliteration: "t-w-b",
    gloss: "repentance",
    polysemyConcerns: [
      "Relatively unambiguous — primary meaning is repentance/return",
    ],
  },
  {
    root: "غ-ف-ر",
    transliteration: "gh-f-r",
    gloss: "forgiveness",
    polysemyConcerns: [
      "Relatively unambiguous — primary meaning is forgiveness/covering",
    ],
  },
  {
    root: "ك-ب-ر",
    transliteration: "k-b-r",
    gloss: "greatness/arrogance",
    polysemyConcerns: [
      "Includes أكبر/كبير (akbar/kabīr, big/great) AND استكبر (istakbara, arrogance)",
      "Same root spans neutral size and negative arrogance — reviewer must split lemmas",
    ],
  },
  {
    root: "خ-ش-ع",
    transliteration: "kh-sh-ʿ",
    gloss: "humility",
    polysemyConcerns: [
      "Relatively unambiguous — primary meaning is humility/submission",
    ],
  },
  {
    root: "ص-د-ق",
    transliteration: "ṣ-d-q",
    gloss: "truthfulness",
    polysemyConcerns: [
      "Includes صدقة (ṣadaqah, charity) — would pollute truthfulness topic",
      "Reviewer must exclude charity-related lemmas",
    ],
  },
  {
    root: "و-ك-ل",
    transliteration: "w-k-l",
    gloss: "trust/delegation",
    polysemyConcerns: [
      "Includes وكيل (wakīl, guardian/agent) and توكل (tawakkal, trust in God)",
      "May need lemma-level split between legal agency and spiritual trust",
    ],
  },
  {
    root: "ن-ف-ق",
    transliteration: "n-f-q",
    gloss: "spending/hypocrisy",
    polysemyConcerns: [
      "Spans إنفاق (infaq, spending) and نفاق (nifāq, hypocrisy)",
      "Two completely different concepts from one root — must be separate topics or lemma-split",
    ],
  },
  {
    root: "ق-س-ط",
    transliteration: "q-s-ṭ",
    gloss: "justice",
    polysemyConcerns: [
      "Includes المقسطين (al-muqsiṭīn, those who act justly) AND القاسطون (al-qāsiṭūn, wrongdoers, 72:15)",
      "Same root form, opposite meanings — reviewer must carefully select lemmas",
    ],
  },
];

/**
 * Validate a root allowlist entry. Checks structural invariants without
 * requiring morphology data.
 */
export function validateRootTopicEntry(
  entry: RootTopicEntry
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!entry.slug || entry.slug.trim() === "") {
    issues.push("slug is empty");
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(entry.slug)) {
    issues.push(
      `slug "${entry.slug}" is not kebab-case (lowercase letters, digits, hyphens)`
    );
  }
  if (!entry.title || entry.title.trim() === "") {
    issues.push("title is empty");
  }
  if (!entry.arabicTitle || entry.arabicTitle.trim() === "") {
    issues.push("arabicTitle is empty");
  }
  if (!Array.isArray(entry.roots) || entry.roots.length === 0) {
    issues.push("roots array is empty — at least one root is required");
  }
  for (const root of entry.roots) {
    if (!root || root.trim() === "") {
      issues.push("roots array contains an empty string");
    }
  }
  if (!Array.isArray(entry.includedLemmas)) {
    issues.push("includedLemmas is not an array");
  }
  if (
    entry.maxResults !== undefined &&
    (!Number.isInteger(entry.maxResults) || entry.maxResults < 1)
  ) {
    issues.push(`maxResults ${entry.maxResults} is not a positive integer`);
  }
  const validStates: RootTopicReviewState[] = [
    "candidate",
    "pending-review",
    "approved",
    "rejected",
  ];
  if (!validStates.includes(entry.reviewState)) {
    issues.push(`reviewState "${entry.reviewState}" is not a valid state`);
  }
  if (!entry.assertedBy || entry.assertedBy.trim() === "") {
    issues.push("assertedBy is empty");
  }
  if (!entry.assertedAt || entry.assertedAt.trim() === "") {
    issues.push("assertedAt is empty");
  }

  return { valid: issues.length === 0, issues };
}

/**
 * Validate the entire root allowlist. Checks for duplicate slugs and
 * duplicate roots across entries.
 */
export function validateRootAllowlist(entries: RootTopicEntry[]): {
  valid: boolean;
  issues: string[];
  entryResults: Array<{ slug: string; valid: boolean; issues: string[] }>;
} {
  const issues: string[] = [];
  const entryResults: Array<{
    slug: string;
    valid: boolean;
    issues: string[];
  }> = [];

  const slugs = new Set<string>();
  const roots = new Map<string, string>(); // root → first slug that claims it

  for (const entry of entries) {
    const result = validateRootTopicEntry(entry);
    entryResults.push({ slug: entry.slug, ...result });

    if (slugs.has(entry.slug)) {
      issues.push(`duplicate slug "${entry.slug}"`);
    }
    slugs.add(entry.slug);

    for (const root of entry.roots) {
      if (roots.has(root)) {
        issues.push(
          `root "${root}" appears in both "${roots.get(root)}" and "${entry.slug}" — one root = one topic`
        );
      }
      roots.set(root, entry.slug);
    }
  }

  return {
    valid: issues.length === 0 && entryResults.every((r) => r.valid),
    issues,
    entryResults,
  };
}

/**
 * Get enabled entries (non-candidate, with at least one included lemma).
 * These are the entries that should be displayed in the UI.
 */
export function getEnabledRootTopics(
  entries: RootTopicEntry[]
): RootTopicEntry[] {
  return entries.filter(
    (e) =>
      e.reviewState !== "candidate" &&
      e.reviewState !== "rejected" &&
      e.includedLemmas.length > 0
  );
}
