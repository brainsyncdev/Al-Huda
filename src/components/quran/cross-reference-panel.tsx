// SERVER COMPONENT — imports @/lib/quran/cross-references, which reads
// node:fs via @/lib/quran/data. Never add a "use client" directive here.
//
// Two panels, one per surface:
//   * CrossReferencePanel   — the edges belonging to a single ayah (reader page)
//   * LexicalMatchGroupsPanel — every repeated-wording group in a surah, as a
//     plain navigable list (FR-024's accessible view)
//
// Both state their scope explicitly. A knowledge graph that is silent about
// what it does NOT assert is indistinguishable from one that asserts
// everything (PRD §2 principle 3).

import Link from "next/link";
import type { AyahRef } from "@/lib/quran/types";
import type { CrossReference } from "@/lib/quran/cross-references";
import {
  CROSS_REFERENCE_DESCRIPTIONS,
  CROSS_REFERENCE_EVIDENCE,
  CROSS_REFERENCE_LABELS,
} from "@/lib/quran/cross-references";
import { ayahPath } from "@/lib/quran/reference";

function refLabel(ref: AyahRef): string {
  return `${ref.surah}:${ref.ayah}`;
}

const CHIP_CLASS =
  "inline-flex items-center rounded-full border border-border/80 bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground tabular-nums transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring";

/**
 * Edges for one ayah, derived from identical Arabic wording within the same
 * surah. Renders nothing when the ayah has no such twin, so callers do not
 * need to guard.
 */
export function CrossReferencePanel({ items }: { items: CrossReference[] }) {
  if (items.length === 0) return null;

  // Every edge this module emits for a single ayah carries the same relation
  // kind and the same evidence string, so the provenance is stated once rather
  // than repeated per chip.
  const relation = items[0].relation;

  return (
    <section
      aria-labelledby="cross-references"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <h2
        id="cross-references"
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {CROSS_REFERENCE_LABELS[relation]} in this surah
      </h2>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        {CROSS_REFERENCE_DESCRIPTIONS[relation]}
      </p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((x) => (
          <li key={refLabel(x.target)}>
            <Link href={ayahPath(x.target)} className={CHIP_CLASS}>
              <span className="sr-only">Ayah sharing this wording: </span>
              {refLabel(x.target)}
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[0.6875rem] leading-relaxed text-muted-foreground">
        {CROSS_REFERENCE_EVIDENCE} Scope: identical wording inside this surah
        only. Nothing here is a thematic, causal, or legal relationship.
      </p>
    </section>
  );
}

/**
 * Accessible list view of every group of ayat in one surah that share
 * identical wording (FR-024). Ordered links, no canvas, no pointer-only
 * affordance — the graph remains fully navigable by keyboard and readable by
 * assistive tech without a visualisation.
 *
 * Renders nothing when the surah has no repeated wording, which is the common
 * case; callers do not need to guard.
 */
export function LexicalMatchGroupsPanel({ groups }: { groups: AyahRef[][] }) {
  if (groups.length === 0) return null;

  return (
    <section
      aria-labelledby="lexical-match-groups"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <h2
        id="lexical-match-groups"
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Repeated wording in this surah
      </h2>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        {groups.length} phrase{groups.length === 1 ? "" : "s"} in this surah
        appear in identical Arabic wording in more than one place. Jump to any
        ayah below.
      </p>

      <ol className="mt-4 space-y-3">
        {groups.map((group) => (
          <li key={group[0].ayah} className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              {group.length} ayat share identical wording
            </p>
            <ul className="flex flex-wrap gap-2">
              {group.map((ref) => (
                <li key={ref.ayah}>
                  <Link href={ayahPath(ref)} className={CHIP_CLASS}>
                    <span className="sr-only">Ayah </span>
                    {refLabel(ref)}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted-foreground">
        {CROSS_REFERENCE_EVIDENCE} Scope: exact wording identity only. This
        list does not claim that these ayat address the same subject, and it is
        not tafsir.
      </p>
    </section>
  );
}
