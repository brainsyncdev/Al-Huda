// Canonical Knowledge Graph — integrates taxonomy data with graph visualization
//
// PURE MODULE: no React, no fs, no network. Safe to import from server routes
// and client code.
//
// This module builds a knowledge graph from the canonical taxonomy data
// (data/taxonomy/*.json) created in MFD-03. It extends the existing graph
// infrastructure to support the expanded taxonomy (20 domains, 98 dimensions,
// 25 subdimensions, 176 topics) with richer relationship types.
//
// NODE KINDS:
//   - domain: 20 canonical domains
//   - dimension: 98 canonical dimensions
//   - subdimension: 25 canonical subdimensions
//   - topic: 176 canonical topics
//
// EDGE TYPES:
//   - CONTAINS: domain → dimension, dimension → subdimension
//   - BELONGS_TO: topic → domain, topic → dimension, topic → subdimension
//   - RELATED_TO: topic ↔ topic (semantic relationships)
//   - CROSS_REFERENCES: topic ↔ topic (cross-domain links)
//   - SHARES_CONCEPT: topic ↔ topic (shared thematic concepts)
//
// PROVENANCE:
//   All nodes and edges carry "pending-scholarly-review" status from the
//   canonical taxonomy data.

import {
  getCanonicalDomains,
  getCanonicalDimensions,
  getCanonicalSubdimensions,
  getCanonicalTopics,
  getCanonicalRelationships,
} from "@/lib/taxonomy/canonical-adapter";
import type { TopicQuranicEnrichment, GraphEnrichmentData } from "./canonical-graph-types";

// Re-export enrichment type so client components can import from the graph
// module (the public API) without touching the server-only enrichment module.
export type { TopicQuranicEnrichment } from "./canonical-graph-types";

export const CANONICAL_GRAPH_VERSION = "1" as const;

export type CanonicalGraphNodeKind =
  | "domain"
  | "dimension"
  | "subdimension"
  | "topic";

export type CanonicalGraphEdgeType =
  | "CONTAINS"
  | "BELONGS_TO"
  | "RELATED_TO"
  | "CROSS_REFERENCES"
  | "SHARES_CONCEPT";

export const CANONICAL_GRAPH_EDGE_TYPE_LABELS: Record<
  CanonicalGraphEdgeType,
  string
> = {
  CONTAINS: "Hierarchical containment",
  BELONGS_TO: "Membership relationship",
  RELATED_TO: "Semantic relationship",
  CROSS_REFERENCES: "Cross-domain reference",
  SHARES_CONCEPT: "Shared thematic concept",
};

export interface CanonicalGraphNode {
  id: string;
  kind: CanonicalGraphNodeKind;
  slug: string;
  label: string;
  arabicLabel?: string;
  urduLabel?: string;
  url: string;
  description: string;
  status: string;
  parentIds: string[];
  childIds: string[];
  relatedIds: string[];
  /** Quranic enrichment metadata — only present on topic nodes */
  quranicEnrichment?: TopicQuranicEnrichment;
}

export interface CanonicalGraphEdge {
  id: string;
  source: string;
  target: string;
  type: CanonicalGraphEdgeType;
  description: string;
  status: string;
}

export interface CanonicalKnowledgeGraph {
  version: typeof CANONICAL_GRAPH_VERSION;
  nodes: CanonicalGraphNode[];
  edges: CanonicalGraphEdge[];
  counts: {
    totalNodes: number;
    totalEdges: number;
    domains: number;
    dimensions: number;
    subdimensions: number;
    topics: number;
    edgesByType: Record<CanonicalGraphEdgeType, number>;
  };
  /** Quranic coverage summary — computed from enrichment data */
  quranicCoverage: {
    totalTopicsWithMappings: number;
    totalTopicsWithoutMappings: number;
    totalUniqueAyatReferenced: number;
    totalUniqueRootsLinked: number;
  };
  notes: string[];
}

/**
 * Build a knowledge graph from canonical taxonomy data.
 *
 * This function creates nodes for all domains, dimensions, subdimensions, and
 * topics, then creates edges from the canonical relationships and hierarchy.
 * 
 * @param enrichmentData - Optional Quranic enrichment data. If not provided,
 * topics will not have enrichment metadata attached.
 */
export function buildCanonicalKnowledgeGraph(
  enrichmentData?: GraphEnrichmentData
): CanonicalKnowledgeGraph {
  const domains = getCanonicalDomains();
  const dimensions = getCanonicalDimensions();
  const subdimensions = getCanonicalSubdimensions();
  const topics = getCanonicalTopics();
  const relationships = getCanonicalRelationships();

  const nodes: CanonicalGraphNode[] = [];
  const edges: CanonicalGraphEdge[] = [];

  // Build domain nodes
  for (const domain of domains) {
    const domainDimensions = dimensions.filter(
      (d) => d.parentDomainId === domain.id
    );
    nodes.push({
      id: `domain:${domain.id}`,
      kind: "domain",
      slug: domain.id,
      label: domain.title,
      arabicLabel: domain.arabicTitle,
      urduLabel: domain.urduTitle,
      url: `/explore/domains/${domain.id}`,
      description: domain.description,
      status: "pending-scholarly-review",
      parentIds: [],
      childIds: domainDimensions.map((d) => `dimension:${d.id}`),
      relatedIds: [],
    });
  }

  // Build dimension nodes
  for (const dimension of dimensions) {
    const parentDomain = domains.find((d) => d.id === dimension.parentDomainId);
    const dimSubdimensions = subdimensions.filter(
      (s) => s.parentDimensionId === dimension.id
    );
    nodes.push({
      id: `dimension:${dimension.id}`,
      kind: "dimension",
      slug: dimension.id,
      label: dimension.title,
      arabicLabel: dimension.arabicTitle,
      urduLabel: dimension.urduTitle,
      url: `/explore/dimensions/${dimension.id}`,
      description: dimension.description,
      status: "pending-scholarly-review",
      parentIds: parentDomain ? [`domain:${parentDomain.id}`] : [],
      childIds: dimSubdimensions.map((s) => `subdimension:${s.id}`),
      relatedIds: [],
    });

    // CONTAINS edge: domain → dimension
    if (parentDomain) {
      edges.push({
        id: `edge:contains:${parentDomain.id}:${dimension.id}`,
        source: `domain:${parentDomain.id}`,
        target: `dimension:${dimension.id}`,
        type: "CONTAINS",
        description: `${parentDomain.title} contains ${dimension.title}`,
        status: "pending-scholarly-review",
      });
    }
  }

  // Build subdimension nodes
  for (const subdimension of subdimensions) {
    const parentDimension = dimensions.find(
      (d) => d.id === subdimension.parentDimensionId
    );
    const subTopics = topics.filter(
      (t) => t.parentSubdimensionId === subdimension.id
    );
    nodes.push({
      id: `subdimension:${subdimension.id}`,
      kind: "subdimension",
      slug: subdimension.id,
      label: subdimension.title,
      url: `/explore/sub-dimensions/${subdimension.id}`,
      description: subdimension.description,
      status: "pending-scholarly-review",
      parentIds: parentDimension
        ? [`dimension:${parentDimension.id}`]
        : [],
      childIds: subTopics.map((t) => `topic:${t.id}`),
      relatedIds: [],
    });

    // CONTAINS edge: dimension → subdimension
    if (parentDimension) {
      edges.push({
        id: `edge:contains:${parentDimension.id}:${subdimension.id}`,
        source: `dimension:${parentDimension.id}`,
        target: `subdimension:${subdimension.id}`,
        type: "CONTAINS",
        description: `${parentDimension.title} contains ${subdimension.title}`,
        status: "pending-scholarly-review",
      });
    }
  }

  // Build topic nodes
  for (const topic of topics) {
    const parentDomain = domains.find((d) => d.id === topic.parentDomainId);
    const parentDimension = dimensions.find(
      (d) => d.id === topic.parentDimensionId
    );
    const parentSubdimension = topic.parentSubdimensionId
      ? subdimensions.find((s) => s.id === topic.parentSubdimensionId)
      : null;

    const parentIds: string[] = [];
    if (parentDomain) parentIds.push(`domain:${parentDomain.id}`);
    if (parentDimension) parentIds.push(`dimension:${parentDimension.id}`);
    if (parentSubdimension)
      parentIds.push(`subdimension:${parentSubdimension.id}`);

    const enrichment = enrichmentData?.topicEnrichments[topic.id];

    nodes.push({
      id: `topic:${topic.id}`,
      kind: "topic",
      slug: topic.slug,
      label: topic.title,
      arabicLabel: topic.arabicTitle,
      urduLabel: topic.urduTitle,
      url: `/explore/topics/${topic.slug}`,
      description: topic.description,
      status: topic.provenance,
      parentIds,
      childIds: [],
      relatedIds: topic.relatedTopicIds.map((id) => `topic:${id}`),
      quranicEnrichment: enrichment,
    });

    // BELONGS_TO edges: topic → parent hierarchy
    if (parentDomain) {
      edges.push({
        id: `edge:belongs:${topic.id}:domain:${parentDomain.id}`,
        source: `topic:${topic.id}`,
        target: `domain:${parentDomain.id}`,
        type: "BELONGS_TO",
        description: `${topic.title} belongs to ${parentDomain.title}`,
        status: topic.provenance,
      });
    }
    if (parentDimension) {
      edges.push({
        id: `edge:belongs:${topic.id}:dimension:${parentDimension.id}`,
        source: `topic:${topic.id}`,
        target: `dimension:${parentDimension.id}`,
        type: "BELONGS_TO",
        description: `${topic.title} belongs to ${parentDimension.title}`,
        status: topic.provenance,
      });
    }
    if (parentSubdimension) {
      edges.push({
        id: `edge:belongs:${topic.id}:subdimension:${parentSubdimension.id}`,
        source: `topic:${topic.id}`,
        target: `subdimension:${parentSubdimension.id}`,
        type: "BELONGS_TO",
        description: `${topic.title} belongs to ${parentSubdimension.title}`,
        status: topic.provenance,
      });
    }

    // RELATED_TO edges from topic.relatedTopicIds
    for (const relatedId of topic.relatedTopicIds) {
      const relatedTopic = topics.find((t) => t.id === relatedId);
      if (relatedTopic) {
        edges.push({
          id: `edge:related:${topic.id}:${relatedId}`,
          source: `topic:${topic.id}`,
          target: `topic:${relatedId}`,
          type: "RELATED_TO",
          description: `${topic.title} is related to ${relatedTopic.title}`,
          status: topic.provenance,
        });
      }
    }
  }

  // Add edges from canonical relationships
  for (const rel of relationships) {
    // Skip CONTAINS and BELONGS_TO edges (already created from hierarchy)
    if (rel.type === "CONTAINS" || rel.type === "BELONGS_TO") continue;

    const sourceNode = nodes.find((n) => n.id === rel.sourceId || n.slug === rel.sourceId);
    const targetNode = nodes.find((n) => n.id === rel.targetId || n.slug === rel.targetId);

    if (sourceNode && targetNode) {
      const edgeType =
        rel.type === "CROSS_REFERENCES"
          ? "CROSS_REFERENCES"
          : rel.type === "SHARES_CONCEPT"
            ? "SHARES_CONCEPT"
            : "RELATED_TO";

      edges.push({
        id: `edge:${rel.id}`,
        source: sourceNode.id,
        target: targetNode.id,
        type: edgeType,
        description: rel.description,
        status: rel.provenance,
      });
    }
  }

  // Calculate counts
  const edgesByType: Record<CanonicalGraphEdgeType, number> = {
    CONTAINS: 0,
    BELONGS_TO: 0,
    RELATED_TO: 0,
    CROSS_REFERENCES: 0,
    SHARES_CONCEPT: 0,
  };

  for (const edge of edges) {
    edgesByType[edge.type]++;
  }

  const counts = {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    domains: nodes.filter((n) => n.kind === "domain").length,
    dimensions: nodes.filter((n) => n.kind === "dimension").length,
    subdimensions: nodes.filter((n) => n.kind === "subdimension").length,
    topics: nodes.filter((n) => n.kind === "topic").length,
    edgesByType,
  };

  return {
    version: CANONICAL_GRAPH_VERSION,
    nodes,
    edges,
    counts,
    quranicCoverage: enrichmentData ? {
      totalTopicsWithMappings: enrichmentData.totalTopicsWithAyahMappings,
      totalTopicsWithoutMappings: enrichmentData.totalTopicsWithoutMappings,
      totalUniqueAyatReferenced: enrichmentData.totalUniqueAyatReferenced,
      totalUniqueRootsLinked: enrichmentData.totalUniqueRootsLinked,
    } : {
      totalTopicsWithMappings: 0,
      totalTopicsWithoutMappings: topics.length,
      totalUniqueAyatReferenced: 0,
      totalUniqueRootsLinked: 0,
    },
    notes: [
      "Nodes represent the canonical taxonomy: 20 domains, 98 dimensions, 25 subdimensions, and 176 topics.",
      "CONTAINS edges represent hierarchical relationships (domain → dimension, dimension → subdimension).",
      "BELONGS_TO edges represent topic membership in the hierarchy.",
      "RELATED_TO edges represent semantic relationships between topics.",
      "CROSS_REFERENCES edges represent cross-domain topic links.",
      "SHARES_CONCEPT edges represent topics sharing thematic concepts.",
      "All nodes and edges carry pending-scholarly-review status.",
      "Topic nodes carry Quranic enrichment metadata (ayah counts, related roots, translation/tafsir availability).",
      "Root-topic links are heuristic suggestions, not authoritative scholarly classifications.",
    ],
  };
}

/**
 * Get all nodes of a specific kind.
 */
export function getNodesByKind(
  graph: CanonicalKnowledgeGraph,
  kind: CanonicalGraphNodeKind
): CanonicalGraphNode[] {
  return graph.nodes.filter((n) => n.kind === kind);
}

/**
 * Get all edges of a specific type.
 */
export function getEdgesByType(
  graph: CanonicalKnowledgeGraph,
  type: CanonicalGraphEdgeType
): CanonicalGraphEdge[] {
  return graph.edges.filter((e) => e.type === type);
}

/**
 * Get all edges connected to a specific node.
 */
export function getEdgesForNode(
  graph: CanonicalKnowledgeGraph,
  nodeId: string
): CanonicalGraphEdge[] {
  return graph.edges.filter(
    (e) => e.source === nodeId || e.target === nodeId
  );
}

/**
 * Get connected nodes for a given node.
 */
export function getConnectedNodes(
  graph: CanonicalKnowledgeGraph,
  nodeId: string
): CanonicalGraphNode[] {
  const edges = getEdgesForNode(graph, nodeId);
  const connectedIds = new Set<string>();
  for (const edge of edges) {
    if (edge.source === nodeId) connectedIds.add(edge.target);
    if (edge.target === nodeId) connectedIds.add(edge.source);
  }
  return graph.nodes.filter((n) => connectedIds.has(n.id));
}

/**
 * Search nodes by label, description, or slug.
 */
export function searchGraphNodes(
  graph: CanonicalKnowledgeGraph,
  query: string
): CanonicalGraphNode[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  return graph.nodes.filter(
    (n) =>
      n.label.toLowerCase().includes(normalizedQuery) ||
      n.description.toLowerCase().includes(normalizedQuery) ||
      n.slug.toLowerCase().includes(normalizedQuery) ||
      n.arabicLabel?.toLowerCase().includes(normalizedQuery) ||
      n.urduLabel?.toLowerCase().includes(normalizedQuery)
  );
}
