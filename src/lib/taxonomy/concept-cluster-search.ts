// Concept cluster search integration (Layer 3 + Layer 7).
//
// Matches user search queries against known SHARES_CONCEPT relationship
// descriptions to surface relevant concept clusters in search results.
//
// PURE MODULE: no React, no fs, no network. Safe to import from server and client.

import {
  getCanonicalRelationships,
  getCanonicalTopic,
  type CanonicalRelationship,
  type CanonicalTopic,
} from "./canonical-adapter";

export interface ConceptClusterMatch {
  relationship: CanonicalRelationship;
  themeLabel: string;
  sourceTopic: CanonicalTopic | null;
  targetTopic: CanonicalTopic | null;
}

/**
 * Extract a short theme label from a SHARES_CONCEPT relationship description.
 *
 * Descriptions follow the pattern: "Cross-cutting theme: <Label> (<Arabic>) spans ..."
 * We extract the label portion for display as the cluster heading.
 */
export function extractThemeLabel(description: string): string {
  const match = description.match(/^Cross-cutting theme:\s*(.+?)\s*\(/);
  if (match) return match[1].trim();

  const spansIdx = description.indexOf(" spans ");
  if (spansIdx > 0) {
    return description
      .slice(0, spansIdx)
      .replace(/^Cross-cutting theme:\s*/, "")
      .trim();
  }

  return description.length > 60 ? description.slice(0, 57) + "…" : description;
}

/**
 * Find concept clusters whose theme label or description matches the query.
 *
 * Returns at most `limit` matches, sorted by relevance (exact theme label
 * match first, then substring matches in description).
 *
 * This is intentionally conservative: only SHARES_CONCEPT relationships
 * are considered, and matching is case-insensitive substring. No AI or
 * fuzzy matching — only transparent, deterministic text matching.
 */
export function findConceptClustersForQuery(
  query: string,
  limit = 3
): ConceptClusterMatch[] {
  if (!query || query.trim().length < 2) return [];

  const q = query.toLowerCase().trim();
  const relationships = getCanonicalRelationships();
  const sharesConceptRels = relationships.filter(
    (r) => r.type === "SHARES_CONCEPT"
  );

  // Score each relationship: lower score = better match
  const scored: { rel: CanonicalRelationship; score: number }[] = [];

  for (const rel of sharesConceptRels) {
    const label = extractThemeLabel(rel.description);
    const labelLower = label.toLowerCase();
    const descLower = rel.description.toLowerCase();

    let score = Infinity;

    // Exact theme label match (case-insensitive)
    if (labelLower === q) {
      score = 0;
    }
    // Theme label contains query
    else if (labelLower.includes(q)) {
      score = 1;
    }
    // Query contains theme label (e.g., user searches "patience and haste")
    else if (q.includes(labelLower) && labelLower.length >= 3) {
      score = 2;
    }
    // Description contains query
    else if (descLower.includes(q)) {
      score = 3;
    }

    if (score < Infinity) {
      scored.push({ rel, score });
    }
  }

  scored.sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(({ rel }) => ({
    relationship: rel,
    themeLabel: extractThemeLabel(rel.description),
    sourceTopic: getCanonicalTopic(rel.sourceId),
    targetTopic: getCanonicalTopic(rel.targetId),
  }));
}
