// Knowledge-graph integrity tests (Sprint 7).
//
// These tests verify the invariants documented in knowledge-graph.ts:
// every node references a valid catalog entry, every edge's endpoints
// exist, topic relations are deduplicated on unordered pairs, provenance
// is complete, and unresolved references surface integrity gaps rather
// than being silently dropped.

import { describe, it, expect } from "vitest";
import {
  buildKnowledgeGraph,
  GRAPH_VERSION,
  type KnowledgeGraph,
} from "./knowledge-graph";
import { TOPICS, getTopic } from "../topics/data";
import { getAllDimensions } from "../explore/dimensions";

// Deterministic, so a single build is safe to share across assertions.
const graph: KnowledgeGraph = buildKnowledgeGraph();

function loadGraph(): KnowledgeGraph {
  return graph;
}

describe("knowledge-graph — structure", () => {
  it("returns the documented version", () => {
    const g = loadGraph();
    expect(g.version).toBe(GRAPH_VERSION);
  });

  it("has the expected node counts (10 dimensions + 11 topics = 21)", () => {
    const g = loadGraph();
    expect(g.counts.nodes).toBe(21);
    expect(g.counts.dimensionNodes).toBe(10);
    expect(g.counts.topicNodes).toBe(TOPICS.length);
  });

  it("emits one node per dimension with correct kind and ordinal", () => {
    const g = loadGraph();
    const dims = g.nodes.filter((n) => n.kind === "dimension");
    expect(dims).toHaveLength(10);
    for (const dim of dims) {
      expect(dim.ordinal).toBeGreaterThanOrEqual(1);
      expect(dim.ordinal).toBeLessThanOrEqual(10);
      expect(dim.language).toBeNull();
    }
  });

  it("emits one node per canonical topic with correct kind", () => {
    const g = loadGraph();
    const topics = g.nodes.filter((n) => n.kind === "topic");
    expect(topics).toHaveLength(TOPICS.length);
    for (const topic of topics) {
      expect(topic.ordinal).toBeNull();
      expect(topic.language).toBe("en");
      expect(getTopic(topic.slug)).toBeDefined();
    }
  });

  it("has unique node ids", () => {
    const g = loadGraph();
    const ids = g.nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("knowledge-graph — edge integrity", () => {
  it("every edge references existing nodes at both endpoints", () => {
    const g = loadGraph();
    const nodeIds = new Set(g.nodes.map((n) => n.id));
    for (const edge of g.edges) {
      expect(nodeIds.has(edge.source), `edge ${edge.id} missing source ${edge.source}`).toBe(true);
      expect(nodeIds.has(edge.target), `edge ${edge.id} missing target ${edge.target}`).toBe(true);
    }
  });

  it("DIMENSION_TOPIC edges match Dimension.topicSlugs exactly", () => {
    const g = loadGraph();
    const dimTopicEdges = g.edges.filter((e) => e.type === "DIMENSION_TOPIC");

    // Build the expected set from the dimension catalog.
    const expected = new Set<string>();
    for (const dim of getAllDimensions()) {
      for (const slug of dim.topicSlugs) {
        if (getTopic(slug)) {
          expected.add(`dimension-topic:${dim.id}--${slug}`);
        }
      }
    }

    const actual = new Set(dimTopicEdges.map((e) => e.id));
    expect(actual).toEqual(expected);
  });

  it("TOPIC_RELATION edges are deduplicated on unordered pairs", () => {
    const g = loadGraph();
    const topicRelEdges = g.edges.filter((e) => e.type === "TOPIC_RELATION");
    const keys = topicRelEdges.map((e) => {
      // ids are already sorted alphabetically: topic-relation:a--b
      return e.id;
    });
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("TOPIC_RELATION endpoints are sorted alphabetically", () => {
    const g = loadGraph();
    const topicRelEdges = g.edges.filter((e) => e.type === "TOPIC_RELATION");
    for (const edge of topicRelEdges) {
      // source is "topic:<a>", target is "topic:<b>", a < b
      const a = edge.source.replace("topic:", "");
      const b = edge.target.replace("topic:", "");
      expect(a < b, `edge ${edge.id}: ${a} should be < ${b}`).toBe(true);
    }
  });

  it("every TOPIC_RELATION edge corresponds to at least one Topic.related declaration", () => {
    const g = loadGraph();
    const topicRelEdges = g.edges.filter((e) => e.type === "TOPIC_RELATION");
    for (const edge of topicRelEdges) {
      const a = edge.source.replace("topic:", "");
      const b = edge.target.replace("topic:", "");
      const topicA = getTopic(a);
      const topicB = getTopic(b);
      expect(topicA, `topic ${a} not found`).toBeDefined();
      expect(topicB, `topic ${b} not found`).toBeDefined();

      // At least one side must declare the other.
      const aDeclaresB = topicA!.related.includes(b);
      const bDeclaresA = topicB!.related.includes(a);
      expect(
        aDeclaresB || bDeclaresA,
        `edge ${edge.id}: neither ${a} nor ${b} declares the relationship`
      ).toBe(true);
    }
  });

  it("every edge has at least one provenance declaration", () => {
    const g = loadGraph();
    for (const edge of g.edges) {
      expect(edge.provenance.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("every edge provenance declaration has a declaredBy that matches a node id", () => {
    const g = loadGraph();
    const nodeIds = new Set(g.nodes.map((n) => n.id));
    for (const edge of g.edges) {
      for (const decl of edge.provenance) {
        expect(
          nodeIds.has(decl.declaredBy),
          `edge ${edge.id}: declaredBy ${decl.declaredBy} is not a node`
        ).toBe(true);
      }
    }
  });
});

describe("knowledge-graph — provenance and review state", () => {
  it("all nodes carry a non-empty provenance record", () => {
    const g = loadGraph();
    for (const node of g.nodes) {
      expect(node.provenance.method).toBeTruthy();
      expect(node.provenance.curator).toBeTruthy();
      expect(node.provenance.reviewedAt).toBeTruthy();
      expect(["pending-scholarly-review", "editorial-approved"]).toContain(node.status);
    }
  });

  it("no node or edge claims editorial-approved in the current data", () => {
    const g = loadGraph();
    const approvedNodes = g.nodes.filter((n) => n.status === "editorial-approved");
    const approvedEdges = g.edges.filter((e) => e.status === "editorial-approved");
    expect(approvedNodes).toHaveLength(0);
    expect(approvedEdges).toHaveLength(0);
  });

  it("edge status is conservative: pending if any declaration is pending", () => {
    const g = loadGraph();
    for (const edge of g.edges) {
      const anyPending = edge.provenance.some(
        (d) => d.status === "pending-scholarly-review"
      );
      if (anyPending) {
        expect(edge.status).toBe("pending-scholarly-review");
      }
    }
  });

  it("every edge has a non-empty scopeNote", () => {
    const g = loadGraph();
    for (const edge of g.edges) {
      expect(edge.scopeNote.length).toBeGreaterThan(0);
    }
  });

  it("relationshipScope matches edge type", () => {
    const g = loadGraph();
    for (const edge of g.edges) {
      if (edge.type === "DIMENSION_TOPIC") {
        expect(edge.relationshipScope).toBe("editorial-navigation-mapping");
      } else {
        expect(edge.relationshipScope).toBe("curated-topic-relationship");
      }
    }
  });
});

describe("knowledge-graph — unresolved references", () => {
  it("unresolved references have complete fields", () => {
    const g = loadGraph();
    for (const u of g.unresolved) {
      expect(u.from).toBeTruthy();
      expect(["topicSlugs", "related"]).toContain(u.field);
      expect(u.value).toBeTruthy();
      expect(u.reason).toBeTruthy();
    }
  });

  it("in the current data, all dimension topicSlugs resolve to canonical topics", () => {
    // This test documents the current state. If a slug is added that does
    // not resolve, this test will fail and the unresolved list will grow.
    const g = loadGraph();
    const unresolvedSlugs = g.unresolved.filter((u) => u.field === "topicSlugs");
    expect(unresolvedSlugs).toHaveLength(0);
  });

  it("in the current data, all topic related slugs resolve to canonical topics", () => {
    const g = loadGraph();
    const unresolvedRelated = g.unresolved.filter((u) => u.field === "related");
    expect(unresolvedRelated).toHaveLength(0);
  });
});

describe("knowledge-graph — determinism", () => {
  it("two calls produce identical output", () => {
    const a = buildKnowledgeGraph();
    const b = buildKnowledgeGraph();
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("knowledge-graph — topic relationship symmetry", () => {
  it("undirected topic relationships are not duplicated in the edge list", () => {
    const g = loadGraph();
    const topicRelEdges = g.edges.filter((e) => e.type === "TOPIC_RELATION");

    // Build a set of unordered pairs from the raw Topic.related data.
    const expectedPairs = new Set<string>();
    for (const topic of TOPICS) {
      for (const relatedSlug of topic.related) {
        if (!getTopic(relatedSlug)) continue;
        const [a, b] =
          topic.slug < relatedSlug
            ? [topic.slug, relatedSlug]
            : [relatedSlug, topic.slug];
        expectedPairs.add(`${a}--${b}`);
      }
    }

    // The edge list should have exactly one edge per unordered pair.
    const actualPairs = new Set(
      topicRelEdges.map((e) => {
        const a = e.source.replace("topic:", "");
        const b = e.target.replace("topic:", "");
        return `${a}--${b}`;
      })
    );

    expect(actualPairs).toEqual(expectedPairs);
  });

  it("bidirectional declarations are merged into one edge with multiple declarations", () => {
    const g = loadGraph();
    // Find a pair where both sides declare each other.
    // patience -> hardship-and-ease, and hardship-and-ease -> patience.
    const edge = g.edges.find(
      (e) =>
        e.type === "TOPIC_RELATION" &&
        e.source === "topic:hardship-and-ease" &&
        e.target === "topic:patience"
    );
    expect(edge).toBeDefined();
    // Both topics declare this relationship, so there should be 2 declarations.
    expect(edge!.provenance).toHaveLength(2);
    const declarers = edge!.provenance.map((d) => d.declaredBy).sort();
    expect(declarers).toEqual(["topic:hardship-and-ease", "topic:patience"]);
  });
});

describe("knowledge-graph — interfaith dimension", () => {
  it("the interfaith dimension has no topic mappings (left empty by design)", () => {
    const g = loadGraph();
    const interfaithEdges = g.edges.filter(
      (e) => e.type === "DIMENSION_TOPIC" && e.source === "dimension:interfaith"
    );
    expect(interfaithEdges).toHaveLength(0);
  });
});

describe("knowledge-graph — counts consistency", () => {
  // Pins the baseline the project commits to preserving: 21 nodes and 38
  // edges (22 dimension→topic mappings + 16 undirected topic relationships).
  // A change here is a data change and must be a deliberate editorial act.
  it("matches the documented 21-node / 38-edge baseline", () => {
    const g = loadGraph();
    expect(g.counts.nodes).toBe(21);
    expect(g.counts.edges).toBe(38);
    expect(g.counts.dimensionTopicEdges).toBe(22);
    expect(g.counts.topicRelationEdges).toBe(16);
  });

  it("counts match the actual arrays", () => {
    const g = loadGraph();
    expect(g.counts.nodes).toBe(g.nodes.length);
    expect(g.counts.edges).toBe(g.edges.length);
    expect(g.counts.dimensionTopicEdges).toBe(
      g.edges.filter((e) => e.type === "DIMENSION_TOPIC").length
    );
    expect(g.counts.topicRelationEdges).toBe(
      g.edges.filter((e) => e.type === "TOPIC_RELATION").length
    );
    expect(g.counts.pendingReviewNodes).toBe(
      g.nodes.filter((n) => n.status === "pending-scholarly-review").length
    );
    expect(g.counts.pendingReviewEdges).toBe(
      g.edges.filter((e) => e.status === "pending-scholarly-review").length
    );
  });
});
