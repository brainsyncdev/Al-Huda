// Knowledge-graph foundation (PRD §12.3, Sprint 3).
//
// PURE MODULE: no React, no fs, no network. Safe to import from server routes
// and client code.
//
// SCOPE — what this graph does and does not assert
//
//   Nodes  : the ten Explore dimensions and the curated topic catalog.
//   Edges  : two kinds, kept deliberately distinct:
//
//     DIMENSION_TOPIC  — an editorial NAVIGATION mapping taken from
//                        Dimension.topicSlugs. It says "this dimension's theme
//                        overlaps this topic", nothing more. It is NOT an
//                        ayah-level classification.
//
//     TOPIC_RELATION   — a curated LATERAL relationship taken from
//                        Topic.related. It is navigation between editorial
//                        selections, not interpretation and not a ruling.
//
//   No ayah nodes or ayah-level edges are emitted. The PRD envisions every
//   ayah tagged across ten dimensions; that work does not exist, and inventing
//   it would fabricate religious claims. This module serializes only the
//   relationships the existing editorial data actually supports.
//
// PROVENANCE
//
//   Every node carries the ProvenanceRecord of the catalog it came from.
//   Every edge carries one declaration per catalog record that asserted it,
//   including the declaring node id. Edge status is the conservative
//   combination of its declarations: if any declaration is still
//   `pending-scholarly-review`, the edge is pending. In this release every
//   dimension and topic is pending, so no edge is editorial-approved.
//
// UNRESOLVED REFERENCES
//
//   A dimension topic slug or topic `related` slug that does not resolve is
//   collected in `unresolved` rather than silently dropped. Consumers can
//   surface the integrity gap instead of showing a graph that quietly omits
//   edges.

import {
  DIMENSION_PROVENANCE,
  getAllDimensions,
} from "@/lib/explore/dimensions";
import {
  TOPICS,
  getTopic,
  type ProvenanceRecord,
  type ReviewStatus,
} from "@/lib/topics/data";

/** Bump when the serialized shape changes in a breaking way. */
export const GRAPH_VERSION = "1" as const;

export type GraphNodeKind = "dimension" | "topic";

export type GraphEdgeType = "DIMENSION_TOPIC" | "TOPIC_RELATION";

export type GraphRelationshipScope =
  | "curated-topic-relationship"
  | "editorial-navigation-mapping";

export const GRAPH_EDGE_TYPE_LABELS: Record<GraphEdgeType, string> = {
  DIMENSION_TOPIC: "Editorial dimension-to-topic navigation mapping",
  TOPIC_RELATION: "Curated lateral topic relationship",
};

export interface SerializedProvenance {
  method: string;
  curator: string;
  reviewedAt: string;
  status: ReviewStatus;
}

/** One catalog record's assertion of an edge. */
export interface EdgeProvenanceDeclaration extends SerializedProvenance {
  /** Stable node id of the record that declared the edge. */
  declaredBy: string;
}

export interface KnowledgeGraphNode {
  /** Stable id, e.g. "topic:patience" or "dimension:spiritual". */
  id: string;
  kind: GraphNodeKind;
  /** Canonical catalog slug. */
  slug: string;
  label: string;
  arabicLabel: string;
  /** Root-relative app URL. */
  url: string;
  /** Dimension ordinal (1–10); null for topics. */
  ordinal: number | null;
  /** BCP 47 editorial language for topics; null for dimensions. */
  language: string | null;
  /** Editorial summary/description; never Quran text. */
  description: string;
  status: ReviewStatus;
  provenance: SerializedProvenance;
}

export interface KnowledgeGraphEdge {
  /** Stable id, e.g. "topic-relation:patience--hardship-and-ease". */
  id: string;
  type: GraphEdgeType;
  typeLabel: string;
  /** Node id of the edge's first endpoint (alphabetical for topic edges). */
  source: string;
  /** Node id of the edge's second endpoint. */
  target: string;
  relationshipScope: GraphRelationshipScope;
  /** Plain-language boundary of what the edge asserts. */
  scopeNote: string;
  /** Conservative combination of the declarations below. */
  status: ReviewStatus;
  provenance: EdgeProvenanceDeclaration[];
}

export interface UnresolvedReference {
  /** Node id that declared the reference. */
  from: string;
  field: "topicSlugs" | "related";
  value: string;
  reason: string;
}

export interface KnowledgeGraphCounts {
  nodes: number;
  dimensionNodes: number;
  topicNodes: number;
  edges: number;
  dimensionTopicEdges: number;
  topicRelationEdges: number;
  pendingReviewNodes: number;
  pendingReviewEdges: number;
}

export interface KnowledgeGraph {
  version: string;
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  counts: KnowledgeGraphCounts;
  unresolved: UnresolvedReference[];
  notes: string[];
}

function serializeProvenance(record: ProvenanceRecord): SerializedProvenance {
  return {
    method: record.method,
    curator: record.curator,
    reviewedAt: record.reviewedAt,
    status: record.status,
  };
}

function declaration(
  declaredBy: string,
  record: ProvenanceRecord
): EdgeProvenanceDeclaration {
  return { declaredBy, ...serializeProvenance(record) };
}

/**
 * Conservative edge status: an edge is only `editorial-approved` when every
 * record that asserted it is approved. A single pending declaration keeps the
 * whole edge pending.
 */
function effectiveStatus(
  declarations: EdgeProvenanceDeclaration[]
): ReviewStatus {
  return declarations.some((d) => d.status !== "editorial-approved")
    ? "pending-scholarly-review"
    : "editorial-approved";
}

const DIMENSION_SCOPE_NOTE =
  "Editorial navigation aid connecting a dimension's theme to a curated topic. " +
  "It does not assert that any ayah belongs to the dimension, and it is not " +
  "tafsir or a scholarly ruling.";

const TOPIC_RELATION_SCOPE_NOTE =
  "Curated lateral relationship declared in a topic's `related` list. It is " +
  "navigation between editorial selections, not interpretation, not tafsir, " +
  "and not a ruling.";

/**
 * Build the serializable graph from the canonical catalogs.
 *
 * Deterministic: node and edge order come from catalog order and sorted
 * endpoint ids, never from the clock, so two calls produce identical output.
 */
export function buildKnowledgeGraph(): KnowledgeGraph {
  const dimensions = getAllDimensions();

  const dimensionNodes: KnowledgeGraphNode[] = dimensions.map((dim) => ({
    id: `dimension:${dim.id}`,
    kind: "dimension",
    slug: dim.id,
    label: dim.title,
    arabicLabel: dim.arabicTitle,
    url: `/explore/dimension/${dim.id}`,
    ordinal: dim.number,
    language: null,
    description: dim.description,
    status: DIMENSION_PROVENANCE.status,
    provenance: serializeProvenance(DIMENSION_PROVENANCE),
  }));

  const topicNodes: KnowledgeGraphNode[] = TOPICS.map((topic) => ({
    id: `topic:${topic.slug}`,
    kind: "topic",
    slug: topic.slug,
    label: topic.title,
    arabicLabel: topic.arabicTitle,
    url: `/topics/${topic.slug}`,
    ordinal: null,
    language: topic.language,
    description: topic.summary,
    status: topic.provenance.status,
    provenance: serializeProvenance(topic.provenance),
  }));

  const nodes = [...dimensionNodes, ...topicNodes];

  const unresolved: UnresolvedReference[] = [];
  const edges: KnowledgeGraphEdge[] = [];

  // --- DIMENSION_TOPIC: editorial navigation -------------------------------
  const dimensionEdgeKeys = new Set<string>();

  for (const dim of dimensions) {
    const source = `dimension:${dim.id}`;

    for (const slug of dim.topicSlugs) {
      if (!getTopic(slug)) {
        unresolved.push({
          from: source,
          field: "topicSlugs",
          value: slug,
          reason: "No canonical topic exists with this slug.",
        });
        continue;
      }

      const target = `topic:${slug}`;
      const id = `dimension-topic:${dim.id}--${slug}`;
      if (dimensionEdgeKeys.has(id)) continue;
      dimensionEdgeKeys.add(id);

      edges.push({
        id,
        type: "DIMENSION_TOPIC",
        typeLabel: GRAPH_EDGE_TYPE_LABELS.DIMENSION_TOPIC,
        source,
        target,
        relationshipScope: "editorial-navigation-mapping",
        scopeNote: DIMENSION_SCOPE_NOTE,
        status: DIMENSION_PROVENANCE.status,
        provenance: [declaration(source, DIMENSION_PROVENANCE)],
      });
    }
  }

  // --- TOPIC_RELATION: curated lateral links -------------------------------
  // `Topic.related` is stored per topic, but the current graph UI treats the
  // relationship as undirected. Deduplicate on the unordered pair and retain
  // every declaring topic in `provenance`.
  const relationEdges = new Map<
    string,
    {
      a: string;
      b: string;
      declarations: EdgeProvenanceDeclaration[];
    }
  >();

  for (const topic of TOPICS) {
    for (const relatedSlug of topic.related) {
      if (relatedSlug === topic.slug) continue;

      if (!getTopic(relatedSlug)) {
        unresolved.push({
          from: `topic:${topic.slug}`,
          field: "related",
          value: relatedSlug,
          reason: "No canonical topic exists with this slug.",
        });
        continue;
      }

      const [a, b] =
        topic.slug < relatedSlug
          ? [topic.slug, relatedSlug]
          : [relatedSlug, topic.slug];
      const key = `${a}--${b}`;

      let entry = relationEdges.get(key);
      if (!entry) {
        entry = { a, b, declarations: [] };
        relationEdges.set(key, entry);
      }

      const declaredBy = `topic:${topic.slug}`;
      if (!entry.declarations.some((d) => d.declaredBy === declaredBy)) {
        entry.declarations.push(declaration(declaredBy, topic.provenance));
      }
    }
  }

  for (const { a, b, declarations } of relationEdges.values()) {
    edges.push({
      id: `topic-relation:${a}--${b}`,
      type: "TOPIC_RELATION",
      typeLabel: GRAPH_EDGE_TYPE_LABELS.TOPIC_RELATION,
      source: `topic:${a}`,
      target: `topic:${b}`,
      relationshipScope: "curated-topic-relationship",
      scopeNote: TOPIC_RELATION_SCOPE_NOTE,
      status: effectiveStatus(declarations),
      provenance: declarations,
    });
  }

  const counts: KnowledgeGraphCounts = {
    nodes: nodes.length,
    dimensionNodes: dimensionNodes.length,
    topicNodes: topicNodes.length,
    edges: edges.length,
    dimensionTopicEdges: edges.filter((e) => e.type === "DIMENSION_TOPIC").length,
    topicRelationEdges: edges.filter((e) => e.type === "TOPIC_RELATION").length,
    pendingReviewNodes: nodes.filter(
      (n) => n.status === "pending-scholarly-review"
    ).length,
    pendingReviewEdges: edges.filter(
      (e) => e.status === "pending-scholarly-review"
    ).length,
  };

  return {
    version: GRAPH_VERSION,
    nodes,
    edges,
    counts,
    unresolved,
    notes: [
      "Nodes are the ten Explore dimensions and the curated topic catalog. No ayah nodes are emitted in this foundation.",
      "DIMENSION_TOPIC edges are editorial navigation mappings from the dimension catalog. They do not assert that any ayah belongs to a dimension.",
      "TOPIC_RELATION edges are derived from each topic's curated `related` list. They are lateral navigation aids, not interpretation or rulings.",
      "Every node and edge carries its review status. This release has no editorial-approved node or edge; all are pending scholarly review.",
      "An unresolved slug is reported in `unresolved` rather than silently dropped.",
    ],
  };
}