"use client";

import Link from "next/link";
import { useId, useMemo, useState, useCallback } from "react";
import type { KeyboardEvent } from "react";
import type {
  KnowledgeGraph,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
} from "@/lib/graph/knowledge-graph";
import { GRAPH_EDGE_TYPE_LABELS } from "@/lib/graph/knowledge-graph";
import { AlertTriangle, X } from "lucide-react";

interface KnowledgeGraphExplorerProps {
  graph: KnowledgeGraph;
}

interface LayoutNode extends KnowledgeGraphNode {
  x: number;
  y: number;
  ring: "dimension" | "topic";
}

/**
 * Deterministic concentric layout.
 *
 * Dimensions sit on the outer ring, topics on the inner ring. Both rings are
 * evenly distributed by catalog order so the layout is stable across renders.
 */
function layoutNodes(graph: KnowledgeGraph): LayoutNode[] {
  const cx = 400;
  const cy = 350;
  const outerR = 280;
  const innerR = 150;

  const dimensions = graph.nodes.filter((n) => n.kind === "dimension");
  const topics = graph.nodes.filter((n) => n.kind === "topic");

  const dimNodes: LayoutNode[] = dimensions.map((node, i) => {
    const angle = (2 * Math.PI * i) / dimensions.length - Math.PI / 2;
    return {
      ...node,
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
      ring: "dimension",
    };
  });

  const topicNodes: LayoutNode[] = topics.map((node, i) => {
    const angle = (2 * Math.PI * i) / topics.length - Math.PI / 2;
    return {
      ...node,
      x: cx + innerR * Math.cos(angle),
      y: cy + innerR * Math.sin(angle),
      ring: "topic",
    };
  });

  return [...dimNodes, ...topicNodes];
}

type FilterId = "all" | `dimension:${string}`;

export function KnowledgeGraphExplorer({ graph }: KnowledgeGraphExplorerProps) {
  const titleId = useId();
  const descId = useId();
  const panelId = useId();

  const nodes = useMemo(() => layoutNodes(graph), [graph]);
  const nodeById = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const dimensions = graph.nodes.filter((n) => n.kind === "dimension");

  // Which node ids are "active" under the current filter.
  const activeNodeIds = useMemo(() => {
    if (filter === "all") return new Set(nodes.map((n) => n.id));
    const dimId = filter; // "dimension:<slug>"
    const connected = new Set<string>([dimId]);
    for (const edge of graph.edges) {
      if (edge.type !== "DIMENSION_TOPIC") continue;
      if (edge.source === dimId) connected.add(edge.target);
      if (edge.target === dimId) connected.add(edge.source);
    }
    return connected;
  }, [filter, nodes, graph.edges]);

  const isNodeDimmed = useCallback(
    (id: string) => !activeNodeIds.has(id),
    [activeNodeIds]
  );

  const isEdgeActive = useCallback(
    (edge: KnowledgeGraphEdge) => activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target),
    [activeNodeIds]
  );

  const selectedNode = selectedId ? nodeById.get(selectedId) ?? null : null;

  // Edges connected to the selected node, for the detail panel.
  const selectedEdges = useMemo(() => {
    if (!selectedId) return [];
    return graph.edges.filter(
      (e) => e.source === selectedId || e.target === selectedId
    );
  }, [selectedId, graph.edges]);

  const handleNodeSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleNodeKeyDown = useCallback(
    (e: KeyboardEvent<SVGGElement>, id: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNodeSelect(id);
      }
    },
    [handleNodeSelect]
  );

  const clearSelection = useCallback(() => setSelectedId(null), []);

  return (
    <div className="space-y-6">
      {/* Filter pills */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Filter by dimension
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filter === "all"}
            onClick={() => setFilter("all")}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/80 bg-card text-foreground/75 hover:border-primary/30 hover:bg-secondary/40"
            }`}
          >
            All
          </button>
          {dimensions.map((dim) => {
            const dimFilterId = `dimension:${dim.slug}` as FilterId;
            const isActive = filter === dimFilterId;
            return (
              <button
                key={dim.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(dimFilterId)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/80 bg-card text-foreground/75 hover:border-primary/30 hover:bg-secondary/40"
                }`}
              >
                <span className="mr-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold">
                  {dim.ordinal}
                </span>
                {dim.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scope notice */}
      <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
        <p className="flex items-start gap-2">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-gold"
            aria-hidden
          />
          <span>
            This graph shows editorial navigation mappings between dimensions
            and curated topics, plus lateral relationships between curated
            topics. It does not classify individual ayat by dimension. Every
            node and edge carries its review status — all are pending scholarly
            review in this release.
          </span>
        </p>
      </div>

      {/* Graph SVG */}
      <div
        className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <header className="space-y-1 mb-4">
          <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight">
            Knowledge Graph Explorer
          </h2>
          <p id={descId} className="text-sm text-muted-foreground">
            {graph.counts.nodes} nodes ({graph.counts.dimensionNodes} dimensions, {graph.counts.topicNodes} topics), {graph.counts.edges} edges. Click or tab to a node for details.
          </p>
        </header>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 mb-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-primary" />
            Dimension node
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-full bg-gold" />
            Topic node
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-primary/60" />
            Dimension → topic mapping
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 border-t border-dashed border-muted-foreground/60" />
            Topic ↔ topic relationship
          </span>
        </div>

        <div className="overflow-x-auto">
          <svg
            role="group"
            aria-label="Knowledge graph showing dimensions and topics with their editorial relationships"
            viewBox="0 0 800 700"
            className="mx-auto h-auto w-full max-w-[800px]"
            preserveAspectRatio="xMidYMid meet"
          >
            <title>Knowledge Graph Explorer</title>
            <desc>
              Concentric layout: dimensions on the outer ring, topics on the
              inner ring. Lines connect dimensions to their mapped topics
              (solid) and topics to related topics (dashed). All nodes are
              keyboard-focusable.
            </desc>

            {/* Edges */}
            {graph.edges.map((edge) => {
              const source = nodeById.get(edge.source);
              const target = nodeById.get(edge.target);
              if (!source || !target) return null;
              const active = isEdgeActive(edge);
              const isDimTopic = edge.type === "DIMENSION_TOPIC";
              const isSelected =
                selectedId !== null &&
                (edge.source === selectedId || edge.target === selectedId);

              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  className={
                    isDimTopic
                      ? "stroke-primary/60"
                      : "stroke-muted-foreground/50"
                  }
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={isDimTopic ? undefined : "5 3"}
                  opacity={active ? (isSelected ? 1 : 0.7) : 0.15}
                  style={{ transition: "opacity 0.2s ease" }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const dimmed = isNodeDimmed(node.id);
              const isSelected = selectedId === node.id;
              const isDimension = node.kind === "dimension";
              const r = isDimension ? 14 : 10;

              return (
                <g
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${isDimension ? "Dimension" : "Topic"}: ${node.label}${isSelected ? " (selected)" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => handleNodeSelect(node.id)}
                  onKeyDown={(e) => handleNodeKeyDown(e, node.id)}
                  style={{ cursor: "pointer", outline: "none" }}
                  opacity={dimmed ? 0.2 : 1}
                >
                  {/* Focus ring */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={r + 5}
                      fill="none"
                      className="stroke-primary"
                      strokeWidth="2"
                      opacity={0.5}
                    />
                  )}
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r}
                    className={
                      isDimension
                        ? "fill-primary stroke-background"
                        : "fill-gold stroke-background"
                    }
                    strokeWidth="3"
                  />
                  {/* Label */}
                  <text
                    x={node.x}
                    y={isDimension ? node.y - 22 : node.y - 16}
                    textAnchor="middle"
                    className={
                      isDimension
                        ? "fill-foreground text-[11px] font-semibold"
                        : "fill-foreground text-[9px] font-medium"
                    }
                  >
                    {node.label.length > 18
                      ? `${node.label.slice(0, 16)}…`
                      : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Keyboard accessible: tab through nodes, press Enter or Space to
          select. Use the filter above to focus on one dimension and its
          connected topics.
        </p>

        {/* Non-graph path to every node. The SVG is a visual convenience;
            this list is the accessible equivalent and needs no pointer. */}
        <details className="mt-4 rounded-xl border border-border/70 bg-background/50 p-3">
          <summary className="cursor-pointer text-sm font-medium">
            List view of all nodes ({graph.counts.nodes})
          </summary>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {nodes.map((node) => (
              <li key={node.id} className="text-sm">
                <Link href={node.url} className="text-primary hover:underline">
                  {node.label}
                </Link>
                <span className="ml-2 text-xs text-muted-foreground">
                  {node.kind === "dimension" ? "Dimension" : "Topic"}
                </span>
              </li>
            ))}
          </ul>
        </details>
      </div>

      {/* Selection detail panel */}
      {selectedNode && (
        <section
          id={panelId}
          aria-label={`Details for ${selectedNode.label}`}
          className="rounded-2xl border border-primary/30 bg-card p-5 space-y-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                {selectedNode.kind === "dimension" ? "Dimension" : "Topic"}
                {selectedNode.ordinal !== null && ` #${selectedNode.ordinal}`}
              </p>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                {selectedNode.label}
              </h3>
              <p
                className="arabic-display text-2xl text-gold mt-1"
                lang="ar"
                dir="rtl"
              >
                {selectedNode.arabicLabel}
              </p>
            </div>
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
              aria-label="Close details"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <p className="text-sm text-muted-foreground">
            {selectedNode.description}
          </p>

          <div className="rounded-xl border border-gold/30 bg-gold-soft/40 p-3 text-xs text-accent-foreground space-y-1">
            <p>
              <span className="font-semibold">Review status:</span>{" "}
              {selectedNode.status.replace(/-/g, " ")}
            </p>
            <p>
              <span className="font-semibold">Curator:</span>{" "}
              {selectedNode.provenance.curator}
            </p>
            <p>
              <span className="font-semibold">Method:</span>{" "}
              {selectedNode.provenance.method}
            </p>
            <p>
              <span className="font-semibold">Last editorial pass:</span>{" "}
              {selectedNode.provenance.reviewedAt}
            </p>
          </div>

          {selectedEdges.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Connections ({selectedEdges.length})
              </p>
              <ul className="space-y-1.5">
                {selectedEdges.map((edge) => {
                  const otherId =
                    edge.source === selectedNode.id ? edge.target : edge.source;
                  const other = nodeById.get(otherId);
                  if (!other) return null;
                  return (
                    <li
                      key={edge.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className={`inline-block h-0.5 w-4 ${
                          edge.type === "DIMENSION_TOPIC"
                            ? "bg-primary/60"
                            : "border-t border-dashed border-muted-foreground/60"
                        }`}
                        aria-hidden
                      />
                      <span className="text-muted-foreground text-xs">
                        {GRAPH_EDGE_TYPE_LABELS[edge.type]}:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNodeSelect(otherId)}
                        className="text-primary hover:underline font-medium text-sm"
                      >
                        {other.label}
                      </button>
                      <span className="text-xs text-muted-foreground">
                        ({edge.status.replace(/-/g, " ")})
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <Link
            href={selectedNode.url}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open {selectedNode.kind === "dimension" ? "dimension" : "topic"} page →
          </Link>
        </section>
      )}

      {/* Unresolved references */}
      {graph.unresolved.length > 0 && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p className="font-medium mb-1">
            {graph.unresolved.length} unresolved reference
            {graph.unresolved.length === 1 ? "" : "s"} in the graph data:
          </p>
          <ul className="list-inside list-disc space-y-0.5 text-xs">
            {graph.unresolved.map((u, i) => (
              <li key={i}>
                {u.from} → {u.value} ({u.field}): {u.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
