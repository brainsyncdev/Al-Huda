"use client";

import Link from "next/link";
import { useId } from "react";
import type { Topic } from "@/lib/topics/data";

interface TopicGraphProps {
  topics: Topic[];
}

interface Node {
  slug: string;
  title: string;
  x: number;
  y: number;
}

export function TopicGraph({ topics }: TopicGraphProps) {
  const titleId = useId();
  const descId = useId();

  const centerX = 220;
  const centerY = 170;
  const radius = 120;

  const nodes: Node[] = topics.map((topic, index) => {
    const angle = (2 * Math.PI * index) / topics.length - Math.PI / 2;
    return {
      slug: topic.slug,
      title: topic.title,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const nodeBySlug = new Map(nodes.map((node) => [node.slug, node]));

  const edges: Array<{ from: Node; to: Node }> = [];
  const seen = new Set<string>();

  for (const topic of topics) {
    const from = nodeBySlug.get(topic.slug);
    if (!from) continue;
    for (const relatedSlug of topic.related) {
      if (relatedSlug === topic.slug) continue;
      const to = nodeBySlug.get(relatedSlug);
      if (!to) continue;
      const key =
        from.slug < to.slug
          ? `${from.slug}--${to.slug}`
          : `${to.slug}--${from.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from, to });
    }
  }

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6"
    >
      <header className="space-y-1">
        <h2 id={titleId} className="font-display text-lg font-semibold tracking-tight">
          Topic relationship graph
        </h2>
        <p id={descId} className="text-sm text-muted-foreground">
          Interactive map of curated topic relationships. Each node is a focusable
          link to that topic page. Use Tab to navigate, and the list below remains
          the accessible alternative.
        </p>
      </header>

      <div className="mt-4 overflow-x-auto">
        <svg
          role="img"
          aria-label="Graph showing relationships between curated Quran topics"
          viewBox="0 0 440 340"
          className="mx-auto h-[280px] w-full max-w-[440px] sm:h-[320px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <title>Topic relationship graph</title>
          <desc>
            Circular layout of topics with lines connecting related topics. All
            nodes are keyboard-focusable links.
          </desc>
          {edges.map((edge, index) => (
            <line
              key={index}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              className="stroke-border"
              strokeWidth="1.5"
              opacity={0.7}
            />
          ))}
          {nodes.map((node) => (
            <g key={node.slug}>
              <a href={`/topics/${node.slug}`} aria-label={node.title}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="10"
                  className="fill-primary/90 stroke-background"
                  strokeWidth="3"
                />
                <text
                  x={node.x}
                  y={node.y - 16}
                  textAnchor="middle"
                  className="fill-foreground text-[10px] font-medium"
                >
                  {node.title.length > 16
                    ? `${node.title.slice(0, 14)}…`
                    : node.title}
                </text>
              </a>
            </g>
          ))}
        </svg>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Keyboard accessible: tab through nodes to open a topic. If your browser
        reduces motion, the static diagram remains readable.
      </p>
    </section>
  );
}
