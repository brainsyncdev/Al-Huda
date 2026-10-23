import Link from "next/link";
import type { Metadata } from "next";
import { getAllPaths, AUDIENCE_LABELS, type TargetAudience } from "@/lib/paths/data";
import { PathsIndexClient } from "@/components/paths/paths-index-client";

export const metadata: Metadata = {
  title: "Learning Paths — Al-Huda",
  description:
    "Guided learning paths for studying the Quran. Start with the essentials, explore key themes, or dive deep into specific topics.",
  robots: { index: false, follow: false },
};

const AUDIENCE_ORDER: TargetAudience[] = [
  "new-muslim",
  "regular-reader",
  "student",
  "explorer",
];

export default function PathsIndexPage() {
  const pathsByAudience = AUDIENCE_ORDER.map((audience) => ({
    audience,
    label: AUDIENCE_LABELS[audience],
    paths: getAllPaths(audience),
  })).filter((group) => group.paths.length > 0);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Learning Paths
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Structured curriculum for guided Quran study. Each path is designed
          for a specific audience and learning goal, with sequenced steps that
          build understanding progressively.
        </p>
      </header>

      <PathsIndexClient pathsByAudience={pathsByAudience} />
    </div>
  );
}
