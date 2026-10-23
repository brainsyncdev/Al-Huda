// Comprehension notes — contextual scaffolding for key ayat.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// These are neutral, descriptive notes that provide historical, structural,
// or contextual information about well-known ayat. They are NOT tafsir
// (interpretation) and NOT rulings. Every note is marked
// pending-scholarly-review until validated by a qualified reviewer.
//
// CONTENT RULES (same as topics and paths):
// - Notes are factual: where the verse sits in the surah, what occasion is
//   commonly described, what structural role it plays.
// - No AI-generated religious interpretation is presented as fact.
// - Every note is keyed by "surah:ayah" and carries provenance metadata.

import type { AyahRef } from "@/lib/quran/types";
import type { ProvenanceRecord } from "@/lib/topics/data";

export interface ComprehensionNote {
  /** Ayah reference this note applies to. */
  ref: AyahRef;
  /** Neutral, descriptive context. Not interpretive. */
  context: string;
  /** Editorial provenance. */
  provenance: ProvenanceRecord;
}

const NOTE_PROVENANCE: ProvenanceRecord = {
  method: "editorial-curation",
  curator: "Al-Huda editorial team",
  reviewedAt: "2026-10-23",
  status: "pending-scholarly-review",
};

/**
 * Curated comprehension notes for well-known ayat. Each note provides
 * factual context (historical, structural, or contextual) without asserting
 * interpretation. All notes are marked pending-scholarly-review.
 */
export const COMPREHENSION_NOTES: ComprehensionNote[] = [
  {
    ref: { surah: 1, ayah: 1 },
    context:
      "Al-Fatihah (The Opening) is recited in every unit of the formal prayer. It is the first surah in the canonical Quran order and serves as an introduction to the entire text.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 1, ayah: 5 },
    context:
      "This verse frames the relationship between human and divine as direct: 'You alone we worship, You alone we ask for help.' No intermediaries are mentioned.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 2, ayah: 153 },
    context:
      "Patience (sabr) is paired with prayer as a source of divine support. This verse occurs within a longer passage addressing believers during difficulty.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 2, ayah: 255 },
    context:
      "Known as Ayat al-Kursi (the Verse of the Throne), it occurs within the longest surah and is one of the most widely recited verses. It describes divine sovereignty and knowledge.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 2, ayah: 286 },
    context:
      "The final verse of Al-Baqarah. It concludes the surah with a statement about divine justice and human capacity, often recited in communal prayer.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 3, ayah: 8 },
    context:
      "This verse addresses the balance between hope and fear, describing those who reflect on creation and recognize their accountability.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 4, ayah: 135 },
    context:
      "A verse on justice that commands fairness even against oneself or relatives. It occurs within a passage on legal and ethical obligations.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 5, ayah: 8 },
    context:
      "This verse instructs that hatred of a people must not prevent justice. It addresses the tension between personal feeling and ethical obligation.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 6, ayah: 12 },
    context:
      "This verse states that God has 'prescribed mercy upon Himself' — mercy is described as self-imposed, not optional or conditional.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 7, ayah: 156 },
    context:
      "Mercy is described as 'written' — a permanent decree. This verse occurs within a passage on divine attributes and human response.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 13, ayah: 28 },
    context:
      "This verse links remembrance of God with tranquility. It is one of several verses describing the psychological effect of spiritual practice.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 14, ayah: 7 },
    context:
      "A verse on gratitude that states: 'If you are grateful, I will surely increase you.' It presents gratitude as a cause-and-effect framework.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 16, ayah: 90 },
    context:
      "This verse presents a three-part command: justice, good conduct, and giving to relatives. It is often cited as a summary of ethical obligations.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 17, ayah: 23 },
    context:
      "This verse addresses treatment of parents, commanding kindness and humility. It occurs within a passage on family ethics.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 21, ayah: 107 },
    context:
      "This verse describes the Prophet as 'a mercy to the worlds.' It is one of several verses framing mercy as the central mission.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 24, ayah: 35 },
    context:
      "Known as the Light Verse (Ayat an-Nur), it uses the metaphor of light to describe divine guidance. It is one of the most metaphorically rich verses in the Quran.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 27, ayah: 30 },
    context:
      "This verse opens a letter with 'In the name of God, the Merciful, the Compassionate.' It links mercy with guidance before any message is delivered.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 31, ayah: 12 },
    context:
      "This verse states that gratitude benefits the one who gives thanks — God needs no thanks, the act serves the human. It frames gratitude as self-serving.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 39, ayah: 53 },
    context:
      "This verse invites: 'Do not despair of God's mercy.' It frames despair as the problem, not the sin, and is one of the most cited verses on hope.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 49, ayah: 13 },
    context:
      "This verse addresses human diversity, stating that peoples and tribes were created 'so that you may know one another.' It frames difference as intentional.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 55, ayah: 13 },
    context:
      "This verse opens a recurring refrain: 'Which, then, of your Lord's powers can you disavow?' It challenges acknowledgment of blessings, large and small.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 57, ayah: 25 },
    context:
      "This verse states that scripture and balance were sent down 'so that people may uphold justice.' It frames justice as the purpose, not a byproduct.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 99, ayah: 7 },
    context:
      "This verse states that 'an atom's weight of good' and 'an atom's weight of evil' will be seen. It establishes that no act is too small to matter.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 103, ayah: 1 },
    context:
      "Surah Al-Asr opens with an oath: 'By time.' The surah is one of the shortest and most frequently cited, summarizing core ethical principles.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 112, ayah: 1 },
    context:
      "Surah Al-Ikhlas declares absolute divine oneness: 'Say: He is God, the One.' It is one of the most widely recited surahs and summarizes core theology.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 113, ayah: 1 },
    context:
      "Surah Al-Falaq begins with seeking refuge. It is paired with Surah An-Nas (114) and both address protection from harm.",
    provenance: NOTE_PROVENANCE,
  },
  {
    ref: { surah: 114, ayah: 1 },
    context:
      "Surah An-Nas seeks refuge from 'the whisperer.' It is the final surah in the canonical order and addresses internal as well as external sources of misguidance.",
    provenance: NOTE_PROVENANCE,
  },
];

/** Look up a comprehension note by ayah reference. Returns null if none exists. */
export function getComprehensionNote(
  surah: number,
  ayah: number
): ComprehensionNote | null {
  return (
    COMPREHENSION_NOTES.find(
      (n) => n.ref.surah === surah && n.ref.ayah === ayah
    ) ?? null
  );
}

/** Check if a comprehension note exists for an ayah. */
export function hasComprehensionNote(surah: number, ayah: number): boolean {
  return getComprehensionNote(surah, ayah) !== null;
}
