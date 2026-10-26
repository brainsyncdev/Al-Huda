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
 * The root allowlist. Only entries with reviewState === "approved" and
 * non-empty includedLemmas are enabled for public display (see canActivateRootTopic).
 *
 * STATUS: 10 entries populated as "pending-review" with empty includedLemmas.
 * No roots are activated yet — human lemma review is required before any root
 * can be approved for public display.
 *
 * The notes field contains computed evidence from the morphology import:
 * occurrence counts, distinct ayat, and top lemmas by frequency. This data
 * is shown in the UI as review information, not as activated content.
 */
export const ROOT_ALLOWLIST: RootTopicEntry[] = [
  {
    slug: "sabr",
    title: "Patience",
    arabicTitle: "الصبر",
    roots: ["صبر"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "103 occurrences across 93 ayat, 8 lemmas. Top: صَبَرَ (58), صَابِر (20), صَبْر (15). Polysemy: relatively unambiguous — primary meaning is patience/perseverance.",
  },
  {
    slug: "shukr",
    title: "Gratitude",
    arabicTitle: "الشكر",
    roots: ["شكر"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "75 occurrences across 69 ayat, 6 lemmas. Top: شَكَرَ (46), شَاكِر (14), شَكُور (10). Polysemy: relatively unambiguous — primary meaning is gratitude/thankfulness.",
  },
  {
    slug: "rahmah",
    title: "Mercy",
    arabicTitle: "الرحمة",
    roots: ["رحم"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "339 occurrences across 313 ayat, 9 lemmas. Top: رَّحِيم (116), رَحْمَة (114), رَّحْمَٰن (57), رَّحِمَ (28), أَرْحَام (12). Polysemy: includes الأرحام (kinship/womb) — reviewer must decide which lemmas belong to mercy topic.",
  },
  {
    slug: "ilm",
    title: "Knowledge",
    arabicTitle: "العلم",
    roots: ["علم"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "854 occurrences across 728 ayat, 14 lemmas. Top: عَلِمَ (382), عَلِيم (163), عِلْم (105), عَٰلَمِين (73), أَعْلَم (49). Polysemy: includes العالمين (the worlds) — would put 'Rabb al-alamin' ayahs in knowledge topic. Very high frequency root.",
  },
  {
    slug: "tawbah",
    title: "Repentance",
    arabicTitle: "التوبة",
    roots: ["توب"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "87 occurrences across 69 ayat, 7 lemmas. Top: تَابَ (63), تَوَّاب (12), تَوْبَة (7). Polysemy: relatively unambiguous — primary meaning is repentance/return.",
  },
  {
    slug: "maghfirah",
    title: "Forgiveness",
    arabicTitle: "المغفرة",
    roots: ["غفر"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "234 occurrences across 202 ayat, 10 lemmas. Top: غَفَرَ (65), غَفُور (58), اسْتَغْفَرَ (40), مَّغْفِرَة (28). Polysemy: relatively unambiguous — primary meaning is forgiveness/covering.",
  },
  {
    slug: "kibr",
    title: "Greatness/Arrogance",
    arabicTitle: "الكبر",
    roots: ["كبر"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "161 occurrences across 153 ayat, 19 lemmas. Top: اسْتَكْبَرَ (40), كَبِير (40), أَكْبَر (24), كَبِيرَة (7). Polysemy: includes أكبر/كبير (big/great) AND استكبر (arrogance) — same root spans neutral size and negative arrogance, reviewer must split lemmas.",
  },
  {
    slug: "khushu",
    title: "Humility",
    arabicTitle: "الخضوع",
    roots: ["خشع"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "17 occurrences across 16 ayat, 3 lemmas. Top: خَاشِع (14), خَشَعَتِ (2), خُشُوع (1). Polysemy: relatively unambiguous — primary meaning is humility/submission.",
  },
  {
    slug: "sidq",
    title: "Truthfulness",
    arabicTitle: "الصدق",
    roots: ["صدق"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "155 occurrences across 144 ayat, 19 lemmas. Top: صَادِق (59), مُصَدِّق (19), صَدَقَ (15), صِدْق (14), صَدَّقَ (10). Polysemy: includes صدقة (charity) — would pollute truthfulness topic, reviewer must exclude charity-related lemmas.",
  },
  {
    slug: "tawakkul",
    title: "Trust/Delegation",
    arabicTitle: "التوكل",
    roots: ["وكل"],
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "Sprint 39 mechanical import (no scholarly review)",
    assertedAt: "2026-10-26",
    notes: "70 occurrences across 61 ayat, 4 lemmas. Top: تَوَكَّلْ (40), وَكِيل (24), مُتَوَكِّلُون (4). Polysemy: includes وكيل (guardian/agent) and توكل (trust in God) — may need lemma-level split between legal agency and spiritual trust.",
  },
];

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

/**
 * Check if a root-topic entry can be activated (displayed publicly).
 * 
 * Activation criteria:
 *   1. Review state must be "approved" (not "candidate", "pending-review", or "rejected")
 *   2. At least one lemma must be in includedLemmas (prevents empty topics)
 *   3. At least one root must be specified
 *   4. All required fields must be present (slug, title, arabicTitle, assertedBy, assertedAt)
 * 
 * This guard prevents root pages from being enabled without validated data
 * and explicit reviewer approval.
 */
export function canActivateRootTopic(entry: RootTopicEntry): {
  canActivate: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (entry.reviewState !== "approved") {
    reasons.push(
      `Review state is "${entry.reviewState}", must be "approved" to activate`
    );
  }

  if (entry.includedLemmas.length === 0) {
    reasons.push(
      "No lemmas in includedLemmas — at least one lemma must be approved"
    );
  }

  if (entry.roots.length === 0) {
    reasons.push("No roots specified — at least one root is required");
  }

  if (!entry.slug || entry.slug.trim() === "") {
    reasons.push("slug is empty");
  }

  if (!entry.title || entry.title.trim() === "") {
    reasons.push("title is empty");
  }

  if (!entry.arabicTitle || entry.arabicTitle.trim() === "") {
    reasons.push("arabicTitle is empty");
  }

  if (!entry.assertedBy || entry.assertedBy.trim() === "") {
    reasons.push("assertedBy is empty — reviewer identity required");
  }

  if (!entry.assertedAt || entry.assertedAt.trim() === "") {
    reasons.push("assertedAt is empty — approval date required");
  }

  return {
    canActivate: reasons.length === 0,
    reasons,
  };
}
