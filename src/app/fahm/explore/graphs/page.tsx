"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Share2 } from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  labelEn: string;
  type: "center" | "topic" | "scholar" | "source";
  x: number;
  y: number;
}

interface Edge {
  from: string;
  to: string;
}

export default function KnowledgeGraphPage() {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes: GraphNode[] = [
    { id: "quran", label: "قرآن", labelEn: "The Quran", type: "center", x: 0, y: 0 },
    { id: "tafsir", label: "تفسیر", labelEn: "Tafsir", type: "topic", x: 0, y: -120 },
    { id: "hifz", label: "حفظ", labelEn: "Memorization", type: "topic", x: 120, y: -60 },
    { id: "tilawat", label: "تلاوت", labelEn: "Recitation", type: "topic", x: 120, y: 60 },
    { id: "aqeedah", label: "عقیدہ", labelEn: "Beliefs", type: "topic", x: 0, y: 120 },
    { id: "akhlaq", label: "اخلاق", labelEn: "Ethics", type: "topic", x: -120, y: 60 },
    { id: "fiqh", label: "فقہ", labelEn: "Jurisprudence", type: "topic", x: -120, y: -60 },
    { id: "ibn-kathir", label: "ابن کثیر", labelEn: "Ibn Kathir", type: "scholar", x: 180, y: -120 },
    { id: "bukhari", label: "بخاری", labelEn: "Sahih Bukhari", type: "source", x: -180, y: -120 },
    { id: "tafsir-jalalayn", label: "تفسیر جلالین", labelEn: "Tafsir Jalalayn", type: "scholar", x: 180, y: 120 },
    { id: "muslim", label: "مسلم", labelEn: "Sahih Muslim", type: "source", x: -180, y: 120 },
  ];

  const edges: Edge[] = [
    { from: "quran", to: "tafsir" },
    { from: "quran", to: "hifz" },
    { from: "quran", to: "tilawat" },
    { from: "quran", to: "aqeedah" },
    { from: "quran", to: "akhlaq" },
    { from: "quran", to: "fiqh" },
    { from: "tafsir", to: "ibn-kathir" },
    { from: "tafsir", to: "tafsir-jalalayn" },
    { from: "aqeedah", to: "bukhari" },
    { from: "aqeedah", to: "muslim" },
  ];

  const selectedData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Knowledge Graph</h1>
                <p className="text-xs text-muted-foreground">علم کا جال — Visual Connections</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Graph Container */}
        <div className="bg-card rounded-2xl border overflow-hidden mb-6">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Tap nodes to explore connections</p>
            <div className="flex gap-2">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => { setZoom(1); setSelectedNode(null); }}
                className="p-2 rounded-lg hover:bg-secondary"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative h-[400px] bg-gradient-to-br from-indigo-50 to-purple-50">
            <svg
              width="100%"
              height="100%"
              viewBox="-200 -200 400 400"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Edges */}
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;
                
                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#c7d2fe"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Central Node */}
              <g
                onClick={() => setSelectedNode("quran")}
                className="cursor-pointer"
              >
                <circle
                  cx={0}
                  cy={0}
                  r={50}
                  fill="url(#gradientCenter)"
                  stroke={selectedNode === "quran" ? "#818cf8" : "#6366f1"}
                  strokeWidth={selectedNode === "quran" ? 4 : 2}
                />
                <text x={0} y={5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
                  قرآن
                </text>
              </g>

              {/* Topic Nodes */}
              {nodes.filter(n => n.type === "topic").map(node => (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={40}
                    fill="url(#gradientTopic)"
                    stroke={selectedNode === node.id ? "#818cf8" : "#6366f1"}
                    strokeWidth={selectedNode === node.id ? 3 : 1.5}
                  />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="600">
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Scholar/Source Nodes */}
              {nodes.filter(n => n.type !== "topic").map(node => (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={30}
                    fill="url(#gradientSource)"
                    stroke={selectedNode === node.id ? "#818cf8" : "#a78bfa"}
                    strokeWidth={selectedNode === node.id ? 3 : 1.5}
                  />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="500">
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Gradients */}
              <defs>
                <radialGradient id="gradientCenter">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </radialGradient>
                <radialGradient id="gradientTopic">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </radialGradient>
                <radialGradient id="gradientSource">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedData && (
          <div className="bg-card rounded-2xl border p-4">
            <h3 className="font-semibold text-lg mb-2">{selectedData.labelEn}</h3>
            <p className="urdu-text text-lg text-indigo-600 mb-3" dir="rtl">
              {selectedData.label}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedData.type === "center" && "The central source of Islamic guidance."}
              {selectedData.type === "topic" && "An important branch of Quranic knowledge."}
              {selectedData.type === "scholar" && "A renowned Islamic scholar or commentary."}
              {selectedData.type === "source" && "A primary source of hadith and rulings."}
            </p>
            <Link
              href={`/explore/topic/${selectedData.id}`}
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              Explore Topic
            </Link>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-card rounded-xl border p-4">
          <h4 className="font-medium mb-3">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-600" />
              <span className="text-sm">Center</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-400" />
              <span className="text-sm">Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-400" />
              <span className="text-sm">Scholars</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}