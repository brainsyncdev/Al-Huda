import { DIMENSIONS } from "./dimensions";
import { TOPICS, type Topic } from "../topics/data";

/**
 * Deterministic ranking: how many dimensions list each topic in their
 * `topicSlugs` navigation mapping.
 *
 * This is a transparent, data-derived count — not a subjective curation and
 * not an AI recommendation. A topic mapped to three dimensions is "broader"
 * than one mapped to a single dimension, and the UI states the exact count so
 * a reader can see why a topic is ranked where it is.
 *
 * Editorial mapping only: this says nothing about how individual ayat are
 * classified, and it does not assert any scholarly ranking of themes.
 */
export interface TopicWithDimensionCount extends Topic {
  dimensionCount: number;
}

/**
 * Topics ordered by dimension count (descending). Ties keep the canonical
 * order of the `TOPICS` array, so the result is stable across renders.
 */
export function getTopicsByDimensionCount(): TopicWithDimensionCount[] {
  return TOPICS.map((topic, index) => ({
    topic,
    index,
    dimensionCount: DIMENSIONS.reduce(
      (count, dim) => count + (dim.topicSlugs.includes(topic.slug) ? 1 : 0),
      0
    ),
  }))
    .sort(
      (a, b) => b.dimensionCount - a.dimensionCount || a.index - b.index
    )
    .map(({ topic, dimensionCount }) => ({ ...topic, dimensionCount }));
}

/** The first `limit` entries of the ranking above. */
export function getBroadestThemes(limit: number): TopicWithDimensionCount[] {
  if (!Number.isFinite(limit) || limit <= 0) return [];
  return getTopicsByDimensionCount().slice(0, Math.floor(limit));
}