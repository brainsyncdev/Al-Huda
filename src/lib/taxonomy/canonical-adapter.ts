// Canonical Taxonomy Adapter — bridges data/taxonomy/*.json with TypeScript contracts
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// This module loads the canonical JSON taxonomy data created in MFD-03 and
// provides typed accessor functions for the application. It preserves the
// existing 14 domains and 15 dimensions as the active navigation system while
// exposing the expanded taxonomy (20 domains, 98 dimensions, 176 topics) for
// the Domain Explorer and Knowledge Graph.
//
// DESIGN PRINCIPLES:
//
//   1. The existing 14 domains in src/lib/taxonomy/domains.ts remain the
//      "organizational proposal" with pending-scholarly-review status.
//
//   2. The existing 15 dimensions in src/lib/explore/dimensions.ts remain the
//      "active navigation system" with topic-level mappings.
//
//   3. The new canonical data (data/taxonomy/*.json) provides the expanded
//      taxonomy for MFD-04 (Domain Explorer) and MFD-05 (Knowledge Graph).
//
//   4. All canonical data carries "pending-scholarly-review" provenance.
//
//   5. No fabrication: if a field is missing in JSON, it remains undefined.

import domainsData from "../../../data/taxonomy/domains.json";
import dimensionsData from "../../../data/taxonomy/dimensions.json";
import subdimensionsData from "../../../data/taxonomy/subdimensions.json";
import topicsData from "../../../data/taxonomy/topics.json";
import relationshipsData from "../../../data/taxonomy/relationships.json";

// ---------------------------------------------------------------------------
// Type definitions (matching the JSON schema)
// ---------------------------------------------------------------------------

export interface CanonicalDomain {
  id: string;
  title: string;
  urduTitle?: string;
  arabicTitle?: string;
  description: string;
  scope: string;
  dimensionIds: string[];
}

export interface CanonicalDimension {
  id: string;
  title: string;
  urduTitle?: string;
  arabicTitle?: string;
  description: string;
  parentDomainId: string;
  subdimensionIds: string[];
  topicIds: string[];
  aliases: string[];
}

export interface CanonicalSubdimension {
  id: string;
  title: string;
  description: string;
  parentDimensionId: string;
  topicIds: string[];
}

export interface CanonicalTopic {
  id: string;
  slug: string;
  title: string;
  urduTitle?: string;
  arabicTitle?: string;
  description: string;
  scope: string;
  parentDomainId: string;
  parentDimensionId: string;
  parentSubdimensionId?: string | null;
  relatedTopicIds: string[];
  searchAliases: string[];
  quranicRelevance: string;
  specialized: boolean;
  provenance: string;
}

export interface CanonicalRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: "CONTAINS" | "BELONGS_TO" | "RELATED_TO" | "CROSS_REFERENCES" | "SHARES_CONCEPT";
  description: string;
  provenance: string;
}

// ---------------------------------------------------------------------------
// Canonical data accessors
// ---------------------------------------------------------------------------

/** All 20 canonical domains from data/taxonomy/domains.json */
export function getCanonicalDomains(): CanonicalDomain[] {
  return domainsData as CanonicalDomain[];
}

/** Look up a canonical domain by id. Returns null if not found. */
export function getCanonicalDomain(id: string): CanonicalDomain | null {
  return (domainsData as CanonicalDomain[]).find((d) => d.id === id) ?? null;
}

/** All 98 canonical dimensions from data/taxonomy/dimensions.json */
export function getCanonicalDimensions(): CanonicalDimension[] {
  return dimensionsData as CanonicalDimension[];
}

/** Look up a canonical dimension by id. Returns null if not found. */
export function getCanonicalDimension(id: string): CanonicalDimension | null {
  return (dimensionsData as CanonicalDimension[]).find((d) => d.id === id) ?? null;
}

/** Get all dimensions within a specific domain */
export function getDimensionsForDomain(domainId: string): CanonicalDimension[] {
  return (dimensionsData as CanonicalDimension[]).filter(
    (d) => d.parentDomainId === domainId
  );
}

/** All 25 canonical subdimensions from data/taxonomy/subdimensions.json */
export function getCanonicalSubdimensions(): CanonicalSubdimension[] {
  return subdimensionsData as CanonicalSubdimension[];
}

/** Look up a canonical subdimension by id. Returns null if not found. */
export function getCanonicalSubdimension(id: string): CanonicalSubdimension | null {
  return (subdimensionsData as CanonicalSubdimension[]).find((s) => s.id === id) ?? null;
}

/** Get all subdimensions within a specific dimension */
export function getSubdimensionsForDimension(dimensionId: string): CanonicalSubdimension[] {
  return (subdimensionsData as CanonicalSubdimension[]).filter(
    (s) => s.parentDimensionId === dimensionId
  );
}

/** All 176 canonical topics from data/taxonomy/topics.json */
export function getCanonicalTopics(): CanonicalTopic[] {
  return topicsData as CanonicalTopic[];
}

/** Look up a canonical topic by id or slug. Returns null if not found. */
export function getCanonicalTopic(idOrSlug: string): CanonicalTopic | null {
  const topics = topicsData as CanonicalTopic[];
  return (
    topics.find((t) => t.id === idOrSlug || t.slug === idOrSlug) ?? null
  );
}

/** Get all topics within a specific domain */
export function getTopicsForDomain(domainId: string): CanonicalTopic[] {
  return (topicsData as CanonicalTopic[]).filter(
    (t) => t.parentDomainId === domainId
  );
}

/** Get all topics within a specific dimension */
export function getTopicsForDimension(dimensionId: string): CanonicalTopic[] {
  return (topicsData as CanonicalTopic[]).filter(
    (t) => t.parentDimensionId === dimensionId
  );
}

/** Get all topics within a specific subdimension */
export function getTopicsForSubdimension(subdimensionId: string): CanonicalTopic[] {
  return (topicsData as CanonicalTopic[]).filter(
    (t) => t.parentSubdimensionId === subdimensionId
  );
}

/** All 150 canonical relationships from data/taxonomy/relationships.json */
export function getCanonicalRelationships(): CanonicalRelationship[] {
  return relationshipsData as CanonicalRelationship[];
}

/** Get relationships where the given entity is the source */
export function getRelationshipsFrom(sourceId: string): CanonicalRelationship[] {
  return (relationshipsData as CanonicalRelationship[]).filter(
    (r) => r.sourceId === sourceId
  );
}

/** Get relationships where the given entity is the target */
export function getRelationshipsTo(targetId: string): CanonicalRelationship[] {
  return (relationshipsData as CanonicalRelationship[]).filter(
    (r) => r.targetId === targetId
  );
}

/** Get all relationships involving a given entity (source or target) */
export function getRelationshipsFor(entityId: string): CanonicalRelationship[] {
  return (relationshipsData as CanonicalRelationship[]).filter(
    (r) => r.sourceId === entityId || r.targetId === entityId
  );
}

// ---------------------------------------------------------------------------
// Statistics
// ---------------------------------------------------------------------------

export interface TaxonomyStatistics {
  totalDomains: number;
  totalDimensions: number;
  totalSubdimensions: number;
  totalTopics: number;
  totalRelationships: number;
  topicsWithQuranicRelevance: number;
  specializedTopics: number;
}

/** Calculate statistics from the canonical taxonomy */
export function getTaxonomyStatistics(): TaxonomyStatistics {
  const domains = getCanonicalDomains();
  const dimensions = getCanonicalDimensions();
  const subdimensions = getCanonicalSubdimensions();
  const topics = getCanonicalTopics();
  const relationships = getCanonicalRelationships();

  return {
    totalDomains: domains.length,
    totalDimensions: dimensions.length,
    totalSubdimensions: subdimensions.length,
    totalTopics: topics.length,
    totalRelationships: relationships.length,
    topicsWithQuranicRelevance: topics.filter(
      (t) => t.quranicRelevance && t.quranicRelevance !== "pending-scholarly-review"
    ).length,
    specializedTopics: topics.filter((t) => t.specialized).length,
  };
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchResult {
  type: "domain" | "dimension" | "subdimension" | "topic";
  id: string;
  title: string;
  description: string;
  url: string;
}

/** Search across all canonical entities by title, description, or aliases */
export function searchTaxonomy(query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const results: SearchResult[] = [];

  // Search domains
  for (const domain of getCanonicalDomains()) {
    if (
      domain.title.toLowerCase().includes(normalizedQuery) ||
      domain.description.toLowerCase().includes(normalizedQuery) ||
      domain.scope.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        type: "domain",
        id: domain.id,
        title: domain.title,
        description: domain.description,
        url: `/explore/domains/${domain.id}`,
      });
    }
  }

  // Search dimensions
  for (const dimension of getCanonicalDimensions()) {
    if (
      dimension.title.toLowerCase().includes(normalizedQuery) ||
      dimension.description.toLowerCase().includes(normalizedQuery) ||
      dimension.aliases.some((a) => a.toLowerCase().includes(normalizedQuery))
    ) {
      results.push({
        type: "dimension",
        id: dimension.id,
        title: dimension.title,
        description: dimension.description,
        url: `/explore/dimensions/${dimension.id}`,
      });
    }
  }

  // Search subdimensions
  for (const subdimension of getCanonicalSubdimensions()) {
    if (
      subdimension.title.toLowerCase().includes(normalizedQuery) ||
      subdimension.description.toLowerCase().includes(normalizedQuery)
    ) {
      results.push({
        type: "subdimension",
        id: subdimension.id,
        title: subdimension.title,
        description: subdimension.description,
        url: `/explore/sub-dimensions/${subdimension.id}`,
      });
    }
  }

  // Search topics
  for (const topic of getCanonicalTopics()) {
    if (
      topic.title.toLowerCase().includes(normalizedQuery) ||
      topic.description.toLowerCase().includes(normalizedQuery) ||
      topic.searchAliases.some((a) => a.toLowerCase().includes(normalizedQuery))
    ) {
      results.push({
        type: "topic",
        id: topic.slug,
        title: topic.title,
        description: topic.description,
        url: `/explore/topics/${topic.slug}`,
      });
    }
  }

  return results;
}
