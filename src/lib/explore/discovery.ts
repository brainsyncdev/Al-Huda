// Discovery helpers for dimension and topic exploration.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// These functions support the enhanced discovery UI in Sprint 53:
// - Search topics by multilingual titles (English, Arabic, Urdu)
// - Filter topics by dimension or domain
// - Assess topic editorial completeness
//
// IMPORTANT: These helpers do NOT create new classifications. They only
// query existing explicit relationships from the dimension, domain, and
// topic catalogs.

import { TOPICS, getTopic, type Topic } from "@/lib/topics/data";
import { getDimension, getDimensionsForTopic, type Dimension } from "./dimensions";
import { getDomain, type Domain, type DomainId } from "@/lib/taxonomy/domains";
import { getDomainTopicRelations, getTopicDomainRelations } from "@/lib/taxonomy/domain-topics";

/**
 * Search topics by query string. Matches against title, arabicTitle, and
 * urduTitle (if present). Case-insensitive. Returns matching topics in
 * their original catalog order.
 *
 * Empty query returns all topics.
 */
export function searchTopics(query: string): Topic[] {
  if (!query || query.trim().length === 0) {
    return TOPICS;
  }

  const normalizedQuery = query.toLowerCase().trim();

  return TOPICS.filter((topic) => {
    // Match against English title
    if (topic.title.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Match against Arabic title
    if (topic.arabicTitle.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Match against Urdu title if it exists (future-proofing)
    const urduTitle = (topic as { urduTitle?: string }).urduTitle;
    if (urduTitle && urduTitle.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Match against summary for better discoverability
    if (topic.summary.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    return false;
  });
}

/**
 * Filter topics by dimension. Returns topics whose slugs appear in the
 * dimension's topicSlugs array. Returns empty array if dimension not found.
 */
export function filterTopicsByDimension(dimensionId: string): Topic[] {
  const dimension = getDimension(dimensionId);
  if (!dimension) {
    return [];
  }

  return dimension.topicSlugs
    .map((slug) => getTopic(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
}

/**
 * Filter topics by domain. Returns topics that have an explicit
 * domain-topic relationship with the given domain. Returns empty array
 * if domain not found or has no topic relationships.
 */
export function filterTopicsByDomain(domainId: string): Topic[] {
  const domain = getDomain(domainId as DomainId);
  if (!domain) {
    return [];
  }

  const relations = getDomainTopicRelations(domainId as DomainId);
  return relations
    .map((rel) => getTopic(rel.topicSlug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
}

/**
 * Assess editorial completeness of a topic. Checks for the presence of
 * key fields that indicate a well-developed topic entry.
 *
 * Returns:
 * - hasUrduTitle: whether the topic has a urduTitle field (currently none do)
 * - hasEditorialDescription: whether the topic has a non-empty summary
 * - hasKnownLimitations: whether the topic has a knownLimitations field (currently none do)
 * - score: 0-100 based on how many completeness criteria are met
 *
 * IMPORTANT: This does NOT claim a topic is comprehensive or exhaustive.
 * It only reports on the presence of specific editorial metadata fields.
 */
export function getTopicCompleteness(topic: Topic): {
  hasUrduTitle: boolean;
  hasEditorialDescription: boolean;
  hasKnownLimitations: boolean;
  score: number;
} {
  const urduTitle = (topic as { urduTitle?: string }).urduTitle;
  const knownLimitations = (topic as { knownLimitations?: string[] }).knownLimitations;

  const hasUrduTitle = Boolean(urduTitle && urduTitle.trim().length > 0);
  const hasEditorialDescription = Boolean(topic.summary && topic.summary.trim().length > 0);
  const hasKnownLimitations = Boolean(knownLimitations && Array.isArray(knownLimitations) && knownLimitations.length > 0);

  // Calculate score based on available metadata
  // Base: 40 points for having a summary (editorial description)
  // + 30 points for having a Urdu title
  // + 30 points for having known limitations
  let score = 0;
  if (hasEditorialDescription) score += 40;
  if (hasUrduTitle) score += 30;
  if (hasKnownLimitations) score += 30;

  // Bonus for having relations (shows active curation)
  if (topic.relations.length > 0) {
    score = Math.min(100, score + 10);
  }

  return {
    hasUrduTitle,
    hasEditorialDescription,
    hasKnownLimitations,
    score,
  };
}

/**
 * Get all dimensions that a topic belongs to (via the dimension's topicSlugs).
 * Convenience wrapper around getDimensionsForTopic.
 */
export function getTopicDimensions(topicSlug: string): Dimension[] {
  return getDimensionsForTopic(topicSlug);
}

/**
 * Get all domains that a topic belongs to (via domain-topic relationships).
 * Convenience wrapper around getTopicDomainRelations + getDomain.
 */
export function getTopicDomains(topicSlug: string): Domain[] {
  const relations = getTopicDomainRelations(topicSlug);
  return relations
    .map((rel) => getDomain(rel.domainId))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));
}

/**
 * Get the count of curated references (relations) for a topic.
 */
export function getTopicReferenceCount(topic: Topic): number {
  return topic.relations.length;
}

/**
 * Combined search and filter. Applies all filters together.
 * Returns topics matching all criteria.
 */
export function filterAndSearchTopics(options: {
  query?: string;
  dimensionId?: string;
  domainId?: string;
}): Topic[] {
  let results = TOPICS;

  // Apply dimension filter first (most restrictive)
  if (options.dimensionId) {
    const dimensionTopics = filterTopicsByDimension(options.dimensionId);
    results = results.filter((t) => dimensionTopics.some((dt) => dt.slug === t.slug));
  }

  // Apply domain filter
  if (options.domainId) {
    const domainTopics = filterTopicsByDomain(options.domainId);
    results = results.filter((t) => domainTopics.some((dt) => dt.slug === t.slug));
  }

  // Apply search query last
  if (options.query && options.query.trim().length > 0) {
    results = searchTopics(options.query).filter((t) =>
      results.some((r) => r.slug === t.slug)
    );
  }

  return results;
}