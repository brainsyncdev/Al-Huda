"use client";

import Link from "next/link";
import { useId, useMemo, useState, useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type {
  CanonicalKnowledgeGraph,
  CanonicalGraphNode,
  CanonicalGraphNodeKind,
  CanonicalGraphEdgeType,
} from "@/lib/graph/canonical-knowledge-graph";
import type { TopicQuranicEnrichment } from "@/lib/graph/canonical-graph-types";
import {
  CANONICAL_GRAPH_EDGE_TYPE_LABELS,
  searchGraphNodes,
  getConnectedNodes,
  getEdgesForNode,
} from "@/lib/graph/canonical-knowledge-graph";
import {
  Search,
  X,
  Filter,
  BookOpen,
  ScrollText,
  Link2,
  Sparkles,
  Info,
} from "lucide-react";

interface CanonicalGraphExplorerProps {
  graph: CanonicalKnowledgeGraph;
}

interface LayoutNode extends CanonicalGraphNode {
  x: number;
  y: number;
  ring: CanonicalGraphNodeKind;
}

const NODE_KIND_COLORS: Record<CanonicalGraphNodeKind, string> = {
  domain: "#d97706",
  dimension: "#059669",
  subdimension: "#7c3aed",
  topic: "#2563eb",
};

const NODE_KIND_LABELS: Record<CanonicalGraphNodeKind, string> = {
  domain: "Domain",
  dimension: "Dimension",
  subdimension: "Subdimension",
  topic: "Topic",
};

const MAPPING_TYPE_LABELS: Record<string, string> = {
  DIRECT_REFERENCE: "Direct reference",
  EXPLICIT_INSTRUCTION: "Explicit instruction",
  PROPHETIC_NARRATIVE: "Prophetic narrative",
  THEMATIC_REFERENCE: "Thematic reference",
  IMPLICIT_REFERENCE: "Implicit reference",
};

const MAPPING_TYPE_COLORS: Record<string, string> = {
  DIRECT_REFERENCE: "#d97706",
  EXPLICIT_INSTRUCTION: "#059669",
  PROPHETIC_NARRATIVE: "#7c3aed",
  THEMATIC_REFERENCE: "#2563eb",
  IMPLICIT_REFERENCE: "#94a3b8",
};

type FilterKind = "all" | CanonicalGraphNodeKind;
type EdgeFilterKind = "all" | CanonicalGraphEdgeType;
type EnrichmentFilter = "all" | "with" | "without";

interface TooltipState {
  nodeId: string;
  x: number;
  y: number;
  content: string;
}

function layoutNodes(graph: CanonicalKnowledgeGraph): LayoutNode[] {
  const cx = 500;
  const cy = 400;
  const outerR = 350;
  const middleR = 250;
  const innerR = 150;
  const centerR = 80;

  const domains = graph.nodes.filter((n) => n.kind === "domain");
  const dimensions = graph.nodes.filter((n) => n.kind === "dimension");
  const subdimensions = graph.nodes.filter((n) => n.kind === "subdimension");
  const topics = graph.nodes.filter((n) => n.kind === "topic");

  const layoutDomainNodes: LayoutNode[] = domains.map((node, i) => {
    const angle = (2 * Math.PI * i) / domains.length - Math.PI / 2;
    return {
      ...node,
      x: cx + outerR * Math.cos(angle),
      y: cy + outerR * Math.sin(angle),
      ring: "domain" as const,
    };
  });

  const layoutDimensionNodes: LayoutNode[] = dimensions.map((node, i) => {
    const angle = (2 * Math.PI * i) / dimensions.length - Math.PI / 2;
    return {
      ...node,
      x: cx + middleR * Math.cos(angle),
      y: cy + middleR * Math.sin(angle),
      ring: "dimension" as const,
    };
  });

  const layoutSubdimensionNodes: LayoutNode[] = subdimensions.map(
    (node, i) => {
      const angle = (2 * Math.PI * i) / subdimensions.length - Math.PI / 2;
      return {
        ...node,
        x: cx + innerR * Math.cos(angle),
        y: cy + innerR * Math.sin(angle),
        ring: "subdimension" as const,
      };
    }
  );

  const layoutTopicNodes: LayoutNode[] = topics.map((node, i) => {
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const angle = i * goldenAngle;
    const radius = centerR * Math.sqrt(i / topics.length);
    return {
      ...node,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      ring: "topic" as const,
    };
  });

  return [
    ...layoutDomainNodes,
    ...layoutDimensionNodes,
    ...layoutSubdimensionNodes,
    ...layoutTopicNodes,
  ];
}

function buildTooltipContent(node: CanonicalGraphNode): string {
  if (node.kind === "domain") {
    const dimCount = node.childIds.filter((id) =>
      id.startsWith("dimension:")
    ).length;
    return `${NODE_KIND_LABELS[node.kind]}: ${node.label}\n${dimCount} dimensions`;
  }
  if (node.kind === "dimension") {
    const subCount = node.childIds.filter((id) =>
      id.startsWith("subdimension:")
    ).length;
    return `${NODE_KIND_LABELS[node.kind]}: ${node.label}\n${subCount} subdimensions`;
  }
  if (node.kind === "subdimension") {
    const topicCount = node.childIds.filter((id) =>
      id.startsWith("topic:")
    ).length;
    return `${NODE_KIND_LABELS[node.kind]}: ${node.label}\n${topicCount} topics`;
  }
  const enrichment = node.quranicEnrichment;
  if (enrichment && enrichment.ayahCount > 0) {
    return `${NODE_KIND_LABELS[node.kind]}: ${node.label}\n${enrichment.ayahCount} ayat referenced · ${enrichment.relatedRoots.length} roots`;
  }
  return `${NODE_KIND_LABELS[node.kind]}: ${node.label}`;
}

export function CanonicalGraphExplorer({
  graph,
}: CanonicalGraphExplorerProps) {
  const titleId = useId();
  const descId = useId();
  const panelId = useId();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const nodes = useMemo(() => layoutNodes(graph), [graph]);
  const nodeById = useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes]
  );

  const initialNodeFilter = searchParams.get("filter");
  const initialSearch = searchParams.get("search") || "";
  const initialSelected = searchParams.get("selected") || null;
  const initialEnrichmentFilter = searchParams.get("enrichment");

  const [nodeFilter, setNodeFilter] = useState<FilterKind>(
    initialNodeFilter === "domain" ||
      initialNodeFilter === "dimension" ||
      initialNodeFilter === "subdimension" ||
      initialNodeFilter === "topic"
      ? initialNodeFilter
      : "all"
  );
  const [edgeFilter, setEdgeFilter] = useState<EdgeFilterKind>("all");
  const [enrichmentFilter, setEnrichmentFilter] = useState<EnrichmentFilter>(
    initialEnrichmentFilter === "with" || initialEnrichmentFilter === "without"
      ? initialEnrichmentFilter
      : "all"
  );
  const [selectedId, setSelectedId] = useState<string | null>(initialSelected);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState<CanonicalGraphNode[]>([]);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (nodeFilter !== "all") params.set("filter", nodeFilter);
    if (enrichmentFilter !== "all") params.set("enrichment", enrichmentFilter);
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedId) params.set("selected", selectedId);

    const current = searchParams.toString();
    const next = params.toString();
    if (current !== next) {
      const url = next ? `${pathname}?${next}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [
    nodeFilter,
    enrichmentFilter,
    searchQuery,
    selectedId,
    router,
    pathname,
    searchParams,
  ]);

  const visibleNodeIds = useMemo(() => {
    let filtered = nodes;

    if (nodeFilter !== "all") {
      filtered = filtered.filter((n) => n.kind === nodeFilter);
    }

    if (enrichmentFilter === "with") {
      filtered = filtered.filter(
        (n) =>
          n.kind !== "topic" ||
          (n.quranicEnrichment && n.quranicEnrichment.ayahCount > 0)
      );
    } else if (enrichmentFilter === "without") {
      filtered = filtered.filter(
        (n) =>
          n.kind !== "topic" ||
          !n.quranicEnrichment ||
          n.quranicEnrichment.ayahCount === 0
      );
    }

    return new Set(filtered.map((n) => n.id));
  }, [nodeFilter, enrichmentFilter, nodes]);

  const visibleEdges = useMemo(() => {
    return graph.edges.filter((edge) => {
      if (edgeFilter !== "all" && edge.type !== edgeFilter) return false;
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target))
        return false;
      return true;
    });
  }, [edgeFilter, visibleNodeIds, graph.edges]);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        const results = searchGraphNodes(graph, query);
        setSearchResults(results.slice(0, 10));
      } else {
        setSearchResults([]);
      }
    },
    [graph]
  );

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedId((prev) => (prev === nodeId ? null : nodeId));
    setFocusedId(nodeId);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<SVGSVGElement>) => {
      if (!focusedId) return;
      const focusedNode = nodeById.get(focusedId);
      if (!focusedNode) return;

      const connectedNodes = getConnectedNodes(graph, focusedId);
      if (connectedNodes.length === 0) return;

      let nextNode: CanonicalGraphNode | null = null;

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const currentIndex = connectedNodes.findIndex(
          (n) => n.id === focusedId
        );
        const nextIndex = (currentIndex + 1) % connectedNodes.length;
        nextNode = connectedNodes[nextIndex];
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const currentIndex = connectedNodes.findIndex(
          (n) => n.id === focusedId
        );
        const prevIndex =
          (currentIndex - 1 + connectedNodes.length) % connectedNodes.length;
        nextNode = connectedNodes[prevIndex];
      } else if (e.key === "Enter" || e.key === " ") {
        handleNodeClick(focusedId);
        e.preventDefault();
        return;
      }

      if (nextNode) {
        setFocusedId(nextNode.id);
        e.preventDefault();
      }
    },
    [focusedId, nodeById, graph, handleNodeClick]
  );

  const handleNodeMouseEnter = useCallback(
    (node: LayoutNode, e: MouseEvent) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      hoverTimerRef.current = setTimeout(() => {
        const svgEl = svgRef.current;
        if (!svgEl) return;
        const rect = svgEl.getBoundingClientRect();
        setTooltip({
          nodeId: node.id,
          x: e.clientX - rect.left + 12,
          y: e.clientY - rect.top + 12,
          content: buildTooltipContent(node),
        });
      }, 300);
    },
    []
  );

  const handleNodeMouseMove = useCallback(
    (e: MouseEvent) => {
      setTooltip((prev) => {
        if (!prev) return null;
        const svgEl = svgRef.current;
        if (!svgEl) return prev;
        const rect = svgEl.getBoundingClientRect();
        return {
          ...prev,
          x: e.clientX - rect.left + 12,
          y: e.clientY - rect.top + 12,
        };
      });
    },
    []
  );

  const handleNodeMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setTooltip(null);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const selectedNode = selectedId ? nodeById.get(selectedId) : null;
  const selectedNodeEdges = selectedId
    ? getEdgesForNode(graph, selectedId)
    : [];

  const quranicStats = useMemo(() => {
    const coverage = graph.quranicCoverage;
    const totalTopics =
      coverage.totalTopicsWithMappings + coverage.totalTopicsWithoutMappings;
    const coveragePercent =
      totalTopics > 0
        ? Math.round((coverage.totalTopicsWithMappings / totalTopics) * 100)
        : 0;
    return { ...coverage, totalTopics, coveragePercent };
  }, [graph.quranicCoverage]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-border/80 bg-card py-2 ps-9 pe-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Search graph entities"
          />
          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-border/80 bg-card shadow-lg">
              {searchResults.map((node) => (
                <button
                  key={node.id}
                  onClick={() => {
                    handleNodeClick(node.id);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-secondary/50"
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: NODE_KIND_COLORS[node.kind],
                    }}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{node.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {NODE_KIND_LABELS[node.kind]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Node type filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
          <select
            value={nodeFilter}
            onChange={(e) => setNodeFilter(e.target.value as FilterKind)}
            className="flex-1 rounded-lg border border-border/80 bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Filter by entity type"
          >
            <option value="all">All entity types</option>
            <option value="domain">Domains only</option>
            <option value="dimension">Dimensions only</option>
            <option value="subdimension">Subdimensions only</option>
            <option value="topic">Topics only</option>
          </select>
        </div>

        {/* Edge type filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
          <select
            value={edgeFilter}
            onChange={(e) => setEdgeFilter(e.target.value as EdgeFilterKind)}
            className="flex-1 rounded-lg border border-border/80 bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Filter by relationship type"
          >
            <option value="all">All relationship types</option>
            <option value="CONTAINS">Contains (hierarchical)</option>
            <option value="BELONGS_TO">Belongs to (membership)</option>
            <option value="RELATED_TO">Related to (semantic)</option>
            <option value="CROSS_REFERENCES">Cross-references</option>
            <option value="SHARES_CONCEPT">Shares concept</option>
          </select>
        </div>

        {/* Quranic enrichment filter */}
        <div className="flex items-center gap-2">
          <Sparkles
            className="h-4 w-4 text-muted-foreground"
            aria-hidden
          />
          <select
            value={enrichmentFilter}
            onChange={(e) =>
              setEnrichmentFilter(e.target.value as EnrichmentFilter)
            }
            className="flex-1 rounded-lg border border-border/80 bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Filter by Quranic enrichment"
          >
            <option value="all">All topics</option>
            <option value="with">Topics with Quranic references</option>
            <option value="without">Topics without references</option>
          </select>
        </div>
      </div>

      {/* Graph visualization */}
      <div className="relative rounded-2xl border border-border/80 bg-card p-4">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 800"
          className="h-[600px] w-full"
          role="img"
          aria-labelledby={titleId}
          aria-describedby={descId}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <title id={titleId}>Canonical Knowledge Graph</title>
          <desc id={descId}>
            Interactive graph showing {graph.counts.totalNodes} entities and{" "}
            {graph.counts.totalEdges} relationships across the canonical
            taxonomy, enriched with Quranic reference data.
          </desc>

          {/* Edges */}
          <g className="edges">
            {visibleEdges.map((edge) => {
              const source = nodeById.get(edge.source);
              const target = nodeById.get(edge.target);
              if (!source || !target) return null;

              const isHighlighted =
                selectedId === edge.source || selectedId === edge.target;
              const opacity = selectedId ? (isHighlighted ? 1 : 0.1) : 0.3;

              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? "#d97706" : "#94a3b8"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  opacity={opacity}
                  className="transition-opacity"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isVisible = visibleNodeIds.has(node.id);
              const isSelected = selectedId === node.id;
              const isFocused = focusedId === node.id;
              const opacity = isVisible
                ? selectedId
                  ? isSelected
                    ? 1
                    : 0.3
                  : 1
                : 0.1;

              const enrichment = node.quranicEnrichment;
              const hasEnrichment =
                node.kind === "topic" &&
                enrichment !== undefined &&
                enrichment.ayahCount > 0;

              let radius =
                node.kind === "domain"
                  ? 12
                  : node.kind === "dimension"
                    ? 8
                    : node.kind === "subdimension"
                      ? 6
                      : 4;

              if (hasEnrichment && enrichment) {
                const scale = Math.min(enrichment.ayahCount / 20, 1);
                radius = 4 + scale * 4;
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  opacity={opacity}
                  className="cursor-pointer transition-opacity"
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={(e) => handleNodeMouseEnter(node, e)}
                  onMouseMove={handleNodeMouseMove}
                  onMouseLeave={handleNodeMouseLeave}
                  onFocus={() => setFocusedId(node.id)}
                  onBlur={() => setFocusedId(null)}
                  role="button"
                  tabIndex={-1}
                  aria-label={`${NODE_KIND_LABELS[node.kind]}: ${node.label}${
                    hasEnrichment
                      ? `, ${enrichment!.ayahCount} ayat referenced`
                      : ""
                  }`}
                >
                  {hasEnrichment && (
                    <circle
                      r={radius + 3}
                      fill="none"
                      stroke="#d97706"
                      strokeWidth={1.5}
                      opacity={0.5}
                    />
                  )}
                  <circle
                    r={radius}
                    fill={NODE_KIND_COLORS[node.kind]}
                    stroke={isSelected || isFocused ? "#fff" : "none"}
                    strokeWidth={isSelected || isFocused ? 2 : 0}
                  />
                  {hasEnrichment && (
                    <circle
                      r={2}
                      cx={radius - 1}
                      cy={-radius + 1}
                      fill="#d97706"
                      stroke="#fff"
                      strokeWidth={0.5}
                    />
                  )}
                  {isSelected && (
                    <text
                      y={-radius - 4}
                      textAnchor="middle"
                      className="fill-foreground text-xs font-medium"
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            role="tooltip"
            className="pointer-events-none absolute z-20 max-w-xs rounded-lg border border-border/80 bg-card px-3 py-2 text-xs shadow-lg"
            style={{
              left: tooltip.x,
              top: tooltip.y,
            }}
          >
            <pre className="whitespace-pre-wrap font-sans">
              {tooltip.content}
            </pre>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="rounded-2xl border border-border/80 bg-card p-4">
        <h3 className="font-display text-sm font-semibold tracking-tight mb-3">
          Legend
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {(Object.keys(NODE_KIND_COLORS) as CanonicalGraphNodeKind[]).map(
            (kind) => {
              const countKey = `${kind}s` as keyof typeof graph.counts;
              const count = graph.counts[countKey] as number;
              return (
                <div key={kind} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: NODE_KIND_COLORS[kind] }}
                    aria-hidden
                  />
                  <span className="text-sm">
                    {NODE_KIND_LABELS[kind]}s ({count})
                  </span>
                </div>
              );
            }
          )}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-gold opacity-50"
                aria-hidden
              />
              <span className="relative inline-flex h-3 w-3 rounded-full border border-gold bg-blue-500" />
            </span>
            <span className="text-sm">Enriched topic</span>
          </div>
        </div>
      </div>

      {/* Selected node detail panel */}
      {selectedNode && (
        <div
          id={panelId}
          className="rounded-2xl border border-border/80 bg-card p-6"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: NODE_KIND_COLORS[selectedNode.kind],
                  }}
                  aria-hidden
                />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {NODE_KIND_LABELS[selectedNode.kind]}
                </span>
              </div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">
                {selectedNode.label}
              </h3>
              {selectedNode.arabicLabel && (
                <p
                  className="arabic-display text-xl text-gold mt-1"
                  lang="ar"
                  dir="rtl"
                >
                  {selectedNode.arabicLabel}
                </p>
              )}
              {selectedNode.urduLabel && (
                <p
                  className="text-lg text-muted-foreground mt-1"
                  lang="ur"
                  dir="rtl"
                >
                  {selectedNode.urduLabel}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="rounded-lg p-2 hover:bg-secondary/50"
              aria-label="Close detail panel"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            {selectedNode.description}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <Link
              href={selectedNode.url}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View details →
            </Link>
            <span className="text-xs text-muted-foreground">
              Status: {selectedNode.status.replace(/-/g, " ")}
            </span>
          </div>

          {/* Quranic enrichment section */}
          {selectedNode.kind === "topic" && selectedNode.quranicEnrichment && (
            <QuranicEnrichmentSection
              node={selectedNode}
              enrichment={selectedNode.quranicEnrichment}
            />
          )}

          {/* Relationships */}
          {selectedNodeEdges.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">
                Relationships ({selectedNodeEdges.length})
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedNodeEdges.slice(0, 20).map((edge) => {
                  const otherNodeId =
                    edge.source === selectedId ? edge.target : edge.source;
                  const otherNode = nodeById.get(otherNodeId);
                  if (!otherNode) return null;

                  const direction = edge.source === selectedId ? "→" : "←";

                  return (
                    <div
                      key={edge.id}
                      className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 p-2 text-sm"
                    >
                      <span className="text-xs font-medium text-muted-foreground min-w-[100px]">
                        {CANONICAL_GRAPH_EDGE_TYPE_LABELS[edge.type]}
                      </span>
                      <span aria-hidden>{direction}</span>
                      <button
                        onClick={() => handleNodeClick(otherNodeId)}
                        className="flex-1 text-left hover:text-primary"
                      >
                        {otherNode.label}
                      </button>
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: NODE_KIND_COLORS[otherNode.kind],
                        }}
                        aria-hidden
                      />
                    </div>
                  );
                })}
                {selectedNodeEdges.length > 20 && (
                  <p className="text-xs text-muted-foreground">
                    Showing 20 of {selectedNodeEdges.length} relationships
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="rounded-2xl border border-border/80 bg-card p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight mb-3">
          Graph Statistics
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Total Nodes
            </p>
            <p className="text-2xl font-semibold">{graph.counts.totalNodes}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Total Edges
            </p>
            <p className="text-2xl font-semibold">{graph.counts.totalEdges}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Visible Nodes
            </p>
            <p className="text-2xl font-semibold">{visibleNodeIds.size}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Visible Edges
            </p>
            <p className="text-2xl font-semibold">{visibleEdges.length}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
              Edges by Type
            </p>
            <div className="space-y-1">
              {(
                Object.keys(graph.counts.edgesByType) as CanonicalGraphEdgeType[]
              ).map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {CANONICAL_GRAPH_EDGE_TYPE_LABELS[type]}
                  </span>
                  <span className="font-semibold">
                    {graph.counts.edgesByType[type]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quranic Coverage Statistics */}
      <div className="rounded-2xl border border-gold/30 bg-gold-soft/40 p-6">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-gold" aria-hidden />
          <h3 className="font-display text-lg font-semibold tracking-tight">
            Quranic Coverage
          </h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Topics with references
            </p>
            <p className="text-2xl font-semibold text-gold">
              {quranicStats.totalTopicsWithMappings}
              <span className="text-sm font-normal text-muted-foreground ms-1">
                / {quranicStats.totalTopics} ({quranicStats.coveragePercent}%)
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Topics without references
            </p>
            <p className="text-2xl font-semibold">
              {quranicStats.totalTopicsWithoutMappings}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Unique ayat referenced
            </p>
            <p className="text-2xl font-semibold text-gold">
              {quranicStats.totalUniqueAyatReferenced.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
              Unique roots linked
            </p>
            <p className="text-2xl font-semibold">
              {quranicStats.totalUniqueRootsLinked.toLocaleString()}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
          Root-topic links are heuristic suggestions based on keyword matching,
          not authoritative scholarly classifications.
        </p>
      </div>

      {/* Mobile fallback */}
      <div className="lg:hidden rounded-2xl border border-border/80 bg-card p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight mb-3">
          Browse by Entity Type
        </h3>
        <div className="space-y-2">
          {(Object.keys(NODE_KIND_LABELS) as CanonicalGraphNodeKind[]).map(
            (kind) => {
              const kindNodes = nodes.filter((n) => n.kind === kind);
              return (
                <details
                  key={kind}
                  className="rounded-lg border border-border/60"
                >
                  <summary className="cursor-pointer px-3 py-2 font-medium hover:bg-secondary/50">
                    {NODE_KIND_LABELS[kind]}s ({kindNodes.length})
                  </summary>
                  <div className="px-3 py-2 space-y-1 max-h-64 overflow-y-auto">
                    {kindNodes.slice(0, 50).map((node) => (
                      <button
                        key={node.id}
                        onClick={() => handleNodeClick(node.id)}
                        className="block w-full text-left px-2 py-1 rounded hover:bg-secondary/50 text-sm"
                      >
                        {node.label}
                      </button>
                    ))}
                    {kindNodes.length > 50 && (
                      <p className="text-xs text-muted-foreground">
                        Showing 50 of {kindNodes.length}
                      </p>
                    )}
                  </div>
                </details>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

function QuranicEnrichmentSection({
  node,
  enrichment,
}: {
  node: CanonicalGraphNode;
  enrichment: TopicQuranicEnrichment;
}) {
  const mappingTypeEntries = Object.entries(enrichment.mappingTypes).sort(
    (a, b) => b[1] - a[1]
  );
  const totalMappings = mappingTypeEntries.reduce(
    (sum, [, count]) => sum + count,
    0
  );

  return (
    <div className="mt-6 rounded-xl border border-gold/30 bg-gold-soft/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ScrollText className="h-4 w-4 text-gold" aria-hidden />
        <h4 className="text-sm font-semibold">Quranic Enrichment</h4>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Ayat referenced
          </p>
          <p className="text-xl font-semibold text-gold">
            {enrichment.ayahCount}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            across {enrichment.uniqueSurahs.length}{" "}
            {enrichment.uniqueSurahs.length === 1 ? "surah" : "surahs"}
          </p>
        </div>
        <div className="rounded-lg border border-border/60 bg-card/60 p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Suggested roots
          </p>
          <p className="text-xl font-semibold">
            {enrichment.relatedRoots.length}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            heuristic keyword matches
          </p>
        </div>
      </div>

      {mappingTypeEntries.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Mapping type breakdown
          </p>
          <div className="space-y-1.5">
            {mappingTypeEntries.map(([type, count]) => {
              const percent =
                totalMappings > 0
                  ? Math.round((count / totalMappings) * 100)
                  : 0;
              const color = MAPPING_TYPE_COLORS[type] ?? "#94a3b8";
              const label =
                MAPPING_TYPE_LABELS[type] ?? type.replace(/_/g, " ");
              return (
                <div key={type} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {count} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {enrichment.relatedRoots.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Link2 className="h-3 w-3" aria-hidden />
            Suggested Arabic roots
          </p>
          <div className="flex flex-wrap gap-1.5">
            {enrichment.relatedRoots.map((rootSlug) => (
              <Link
                key={rootSlug}
                href={`/explore/root/${encodeURIComponent(rootSlug)}`}
                className="inline-flex items-center rounded-full border border-border/60 bg-card px-2.5 py-0.5 text-xs font-medium hover:border-gold hover:text-gold transition-colors"
              >
                <span lang="ar" dir="rtl" className="arabic-display">
                  {rootSlug}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
        {enrichment.translationAvailable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <BookOpen className="h-3 w-3" aria-hidden />
            Translation available
          </span>
        )}
        {enrichment.tafsirAvailable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-600 dark:text-violet-400">
            <ScrollText className="h-3 w-3" aria-hidden />
            Tafsir links available
          </span>
        )}
        {enrichment.ayahCount > 0 && (
          <Link
            href={`${node.url}#ayahs`}
            className="ms-auto inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            View all ayat →
          </Link>
        )}
      </div>
    </div>
  );
}
