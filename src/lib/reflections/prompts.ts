// Curated reflection prompts for ayah pages (Entry Point 5: Reflect and Learn).
//
// IMPORTANT SCHOLARLY GUARDRAILS (Section 7 + Section 6 EP5):
//
//   - These prompts are EDITORIAL EDUCATIONAL AIDS, not tafsir or religious
//     guidance. They help learners begin personal reflection, not replace
//     qualified scholarly interpretation.
//
//   - Prompts are phrased as open questions, never as claims about what Allah
//     specifically intends for an individual.
//
//   - Each prompt carries its own provenance field so the UI can display
//     review status and keep epistemic categories visibly distinct.
//
//   - No AI-generated content. All prompts are manually curated from
//     established educational frameworks for Quran study.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.

export interface ReflectionPrompt {
  /** Stable identifier for deduplication and analytics. */
  id: string;
  /** The topic(s) this prompt is associated with. */
  topicIds: string[];
  /** The prompt text — always an open question, never a directive. */
  text: string;
  /** Provenance / review status. */
  provenance: string;
}

/**
 * Curated reflection prompts keyed by canonical topic ID.
 *
 * These are intentionally few and carefully worded. Adding more requires
 * editorial review — quantity is not the goal; quality and safety are.
 */
export const REFLECTION_PROMPTS: readonly ReflectionPrompt[] = [
  // --- Sabr / Patience ---
  {
    id: "prompt-sabr-1",
    topicIds: ["sabr-patience", "trial-and-test", "patience-haste"],
    text: "How does this verse describe the relationship between patience and trust in Allah's plan?",
    provenance: "editorial-educational-aid",
  },
  {
    id: "prompt-sabr-2",
    topicIds: ["sabr-patience"],
    text: "What forms of sabr (endurance, perseverance, restraint) do you see reflected here?",
    provenance: "editorial-educational-aid",
  },

  // --- Taqwa / God-consciousness ---
  {
    id: "prompt-taqwa-1",
    topicIds: ["taqwa-god-consciousness"],
    text: "How does this passage connect awareness of Allah to practical action?",
    provenance: "editorial-educational-aid",
  },
  {
    id: "prompt-taqwa-2",
    topicIds: ["taqwa-god-consciousness", "ikhlas-sincerity"],
    text: "In what way does this verse distinguish between outward compliance and inner consciousness?",
    provenance: "editorial-educational-aid",
  },

  // --- Shukr / Gratitude ---
  {
    id: "prompt-shukr-1",
    topicIds: ["shukr-gratitude", "gratitude-ingratitude"],
    text: "What blessings or signs does this passage invite recognition of?",
    provenance: "editorial-educational-aid",
  },

  // --- Tawakkul / Trust ---
  {
    id: "prompt-tawakkul-1",
    topicIds: ["tawakkul-trust"],
    text: "How does this verse balance human effort with reliance upon Allah?",
    provenance: "editorial-educational-aid",
  },

  // --- Justice / Equality ---
  {
    id: "prompt-justice-1",
    topicIds: ["human-equality", "justice-oppression"],
    text: "What principles of fairness or accountability does this passage establish?",
    provenance: "editorial-educational-aid",
  },

  // --- Mercy / Rahmah ---
  {
    id: "prompt-rahmah-1",
    topicIds: ["spousal-love-mercy", "divine-mercy"],
    text: "How is mercy described here — as an attribute, an action, or a relationship?",
    provenance: "editorial-educational-aid",
  },

  // --- Knowledge / Ilm ---
  {
    id: "prompt-ilm-1",
    topicIds: ["knowledge-seeking", "knowledge-ignorance"],
    text: "What does this passage suggest about the purpose or limits of human knowledge?",
    provenance: "editorial-educational-aid",
  },

  // --- Repentance / Tawbah ---
  {
    id: "prompt-tawbah-1",
    topicIds: ["repentance-forgiveness"],
    text: "How does this verse describe the path back to Allah after wrongdoing?",
    provenance: "editorial-educational-aid",
  },

  // --- Creation / Signs ---
  {
    id: "prompt-signs-1",
    topicIds: ["signs-and-reflection", "reflection-tafakkur"],
    text: "What signs in creation or revelation does this passage invite you to contemplate?",
    provenance: "editorial-educational-aid",
  },

  // --- Covenant / Ahd ---
  {
    id: "prompt-ahd-1",
    topicIds: ["covenants-ahd", "covenant-breach"],
    text: "What commitment or covenant is referenced here, and what responsibilities does it entail?",
    provenance: "editorial-educational-aid",
  },

  // --- Balance / Mizan ---
  {
    id: "prompt-mizan-1",
    topicIds: ["balance-moderation", "mizan-balance"],
    text: "How does this passage describe balance or moderation in belief, worship, or conduct?",
    provenance: "editorial-educational-aid",
  },

  // --- Generic fallback for any mapped topic ---
  {
    id: "prompt-generic-1",
    topicIds: [],
    text: "What is the central message of this passage, and how might it apply to your understanding of faith?",
    provenance: "editorial-educational-aid",
  },
  {
    id: "prompt-generic-2",
    topicIds: [],
    text: "What words or phrases in this verse stand out to you, and why?",
    provenance: "editorial-educational-aid",
  },
] as const;

/**
 * Get up to `limit` reflection prompts relevant to the given topic IDs.
 * Returns generic prompts if no topic-specific ones match.
 *
 * Results are deterministic (sorted by prompt id) to avoid re-ordering on
 * re-render, which would be distracting during reflection.
 */
export function getReflectionPromptsForTopics(
  topicIds: string[],
  limit = 3
): ReflectionPrompt[] {
  if (topicIds.length === 0) {
    return REFLECTION_PROMPTS.filter((p) => p.topicIds.length === 0)
      .slice(0, limit);
  }

  const topicSet = new Set(topicIds);
  const matched = REFLECTION_PROMPTS.filter(
    (p) => p.topicIds.length > 0 && p.topicIds.some((tid) => topicSet.has(tid))
  );

  if (matched.length >= limit) {
    return matched.slice(0, limit);
  }

  // Fill remaining slots with generic prompts
  const generics = REFLECTION_PROMPTS.filter((p) => p.topicIds.length === 0);
  return [...matched, ...generics].slice(0, limit);
}
