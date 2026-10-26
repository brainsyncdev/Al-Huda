// Topic → root cross-references.
//
// A link here says only: "the root page is a useful next place to look from
// this topic page". It is navigational configuration, not a scholarly claim
// that the topic and the root are the same concept, and not evidence that any
// ayah is "about" the topic.
//
// GATING: a link is shown only when the target root entry passes
// canActivateRootTopic(). While the Sabr root is pending review, the mapping
// exists in configuration but renders nothing, so no reader is sent to a page
// that withholds its results.
//
// `evidence` lists ayat that are already in the curated topic AND contain a
// word-level occurrence of the root. That is a checkable lexical fact, not a
// thematic judgement. Keep it small and verifiable.

import type { AyahRef } from "@/lib/quran/types";
import {
  ROOT_ALLOWLIST,
  canActivateRootTopic,
  type RootTopicEntry,
} from "./root-allowlist";

export interface TopicRootLink {
  /** Slug of the curated topic in src/lib/topics/data.ts. */
  topicSlug: string;
  /** Slug of the root entry in ROOT_ALLOWLIST. */
  rootSlug: string;
  /**
   * Ayat shared by the topic selection and the root's morphology records.
   * Used to justify the link and to make it auditable.
   */
  evidence: AyahRef[];
  /** Always navigation-only: this is not a classification. */
  semantics: "navigation-only";
  /** One neutral line explaining what the link does and does not claim. */
  note: string;
}

export const TOPIC_ROOT_LINKS: TopicRootLink[] = [
  {
    topicSlug: "patience",
    rootSlug: "sabr",
    evidence: [
      { surah: 2, ayah: 153 },
      { surah: 3, ayah: 200 },
    ],
    semantics: "navigation-only",
    note: "Both ayat are already in the Patience topic selection and contain a word-level occurrence of the root صبر. This link opens the root's word-occurrence index; it does not assert that every matching ayah is about patience.",
  },
];

export interface ResolvedTopicRootLink {
  link: TopicRootLink;
  entry: RootTopicEntry;
  /** True only when the target root is activatable (approved + lemmas). */
  active: boolean;
}

/**
 * Resolve the root links for a topic against the allowlist. Links whose root
 * entry is missing are dropped rather than rendered with a dead target.
 */
export function getTopicRootLinks(
  topicSlug: string,
  entries: RootTopicEntry[] = ROOT_ALLOWLIST
): ResolvedTopicRootLink[] {
  return TOPIC_ROOT_LINKS.filter((link) => link.topicSlug === topicSlug)
    .map((link) => {
      const entry = entries.find((e) => e.slug === link.rootSlug);
      if (!entry) return null;
      return {
        link,
        entry,
        active: canActivateRootTopic(entry).canActivate,
      };
    })
    .filter((x): x is ResolvedTopicRootLink => x !== null);
}

/** Links that may be rendered to a reader right now. */
export function getActiveTopicRootLinks(
  topicSlug: string,
  entries: RootTopicEntry[] = ROOT_ALLOWLIST
): ResolvedTopicRootLink[] {
  return getTopicRootLinks(topicSlug, entries).filter((l) => l.active);
}
