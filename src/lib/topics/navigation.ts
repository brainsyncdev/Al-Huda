// Navigation helpers for contextual exploration between topics, dimensions,
// domains, and study journeys.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// These helpers provide cross-cutting navigation between the topic system,
// dimension taxonomy, domain taxonomy, and study journeys. Each relationship
// is backed by explicit project data — no thematic inference from shared roots.

import type { AyahRef } from "@/lib/quran/types";
import { topicsForAyah, type Topic } from "./data";
import { getDimensionsForTopic, type Dimension } from "@/lib/explore/dimensions";
import { getTopicDomainRelations } from "@/lib/taxonomy/domain-topics";
import { getDomain, type Domain } from "@/lib/taxonomy/domains";
import { JOURNEYS, type StudyJourney } from "@/lib/study-journeys/data";

/**
 * Get all topics that include a specific ayah reference.
 * Returns topics in canonical order (as defined in TOPICS array).
 *
 * @param surah - Surah number (1-114)
 * @param ayah - Ayah number within the surah
 * @returns Array of topics containing this ayah, empty if none
 */
export function getTopicsForAyah(surah: number, ayah: number): Topic[] {
  const ref: AyahRef = { surah, ayah };
  return topicsForAyah(ref);
}

/**
 * Get all study journeys that have at least one stage referencing this topic.
 * Returns journeys in canonical order (as defined in JOURNEYS array).
 *
 * @param topicSlug - Canonical topic slug
 * @returns Array of journeys with stages referencing this topic
 */
export function getJourneysForTopic(topicSlug: string): StudyJourney[] {
  return JOURNEYS.filter((journey) =>
    journey.stages.some((stage) => stage.topicSlug === topicSlug)
  );
}

/**
 * Get the primary dimension for a topic (first dimension in PRD order).
 * Returns null if the topic is not mapped to any dimension.
 *
 * @param topicSlug - Canonical topic slug
 * @returns First dimension containing this topic, or null
 */
export function getDimensionForTopic(topicSlug: string): Dimension | null {
  const dimensions = getDimensionsForTopic(topicSlug);
  return dimensions.length > 0 ? dimensions[0] : null;
}

/**
 * Get all dimensions for a topic (may belong to multiple).
 * Returns dimensions in PRD order.
 *
 * @param topicSlug - Canonical topic slug
 * @returns Array of dimensions containing this topic
 */
export function getAllDimensionsForTopic(topicSlug: string): Dimension[] {
  return getDimensionsForTopic(topicSlug);
}

/**
 * Get the primary domain for a topic (first domain from domain-topics mapping).
 * Returns null if the topic is not mapped to any domain.
 *
 * @param topicSlug - Canonical topic slug
 * @returns First domain containing this topic, or null
 */
export function getDomainForTopic(topicSlug: string): Domain | null {
  const relations = getTopicDomainRelations(topicSlug);
  if (relations.length === 0) return null;
  return getDomain(relations[0].domainId);
}

/**
 * Get all domains for a topic (may belong to multiple).
 * Returns domains in the order they appear in the domain-topics catalog.
 *
 * @param topicSlug - Canonical topic slug
 * @returns Array of domains containing this topic
 */
export function getAllDomainsForTopic(topicSlug: string): Domain[] {
  const relations = getTopicDomainRelations(topicSlug);
  return relations
    .map((r) => getDomain(r.domainId))
    .filter((d): d is NonNullable<typeof d> => d !== null);
}

/**
 * Get the topic URL path for navigation.
 *
 * @param topicSlug - Canonical topic slug
 * @returns URL path to the topic detail page
 */
export function getTopicUrl(topicSlug: string): string {
  return `/topics/${topicSlug}`;
}

/**
 * Get the dimension URL path for navigation.
 *
 * @param dimensionId - Dimension identifier
 * @returns URL path to the dimension detail page
 */
export function getDimensionUrl(dimensionId: string): string {
  return `/explore/dimension/${dimensionId}`;
}

/**
 * Get the domain URL path for navigation.
 *
 * @param domainId - Domain identifier
 * @returns URL path to the domain detail page
 */
export function getDomainUrl(domainId: string): string {
  return `/explore/domains/${domainId}`;
}

/**
 * Get the study journey URL path for navigation.
 *
 * @param journeySlug - Journey slug
 * @returns URL path to the study journey detail page
 */
export function getJourneyUrl(journeySlug: string): string {
  return `/study-journeys/${journeySlug}`;
}
