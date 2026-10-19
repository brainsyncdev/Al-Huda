// Ayah-to-ayah cross-references (FR-023), DERIVED from the pinned Quran dataset.
//
// SERVER-ONLY: imports ./data, which reads node:fs. Never import this from a
// client component.
//
// Why derived rather than curated: PRD §2 principle 3 and §9 require every
// published relationship to be source-backed. A machine-derived text-identity
// relation can be re-verified by any reader against the same dataset, needs no
// scholarly sign-off, and cannot be fabricated by an editor or a model.
//
// Exactly one relation kind is produced: LEXICAL_MATCH — two ayat whose Arabic
// text is identical after minimal normalization. Deliberately NOT produced:
//   * SAME_ROOT or any morphological link. The pinned dataset carries no
//     validated morphology, and inferring roots from string prefixes would
//     publish edges the sources do not support.
//   * Thematic or interpretive links. Those are editorial claims and belong in
//     src/lib/topics/data.ts, which records curator, method and review status
//     for everything it asserts.
//
// The relation token is intentionally spelled the same as the LEXICAL_MATCH
// member of the topic layer's RelationType, but this module does not import
// that union: domain code must not depend on editorial content. Reconciling
// the two declarations later needs no data migration.
//
// Normalization is intentionally WEAK (strip Unicode combining marks, collapse
// whitespace, nothing else — tatweel and hamza forms are left alone). Weak
// normalization biases toward under-reporting: two ayat differing only in
// orthography may be missed. For a knowledge graph that is the correct
// trade — a missing edge is a gap, a fabricated edge is a false claim.

import type { AyahRef } from "./types";
import { getSurah, getSurahIndex } from "./data";

export type CrossReferenceRelation = "LEXICAL_MATCH";

/**
 * PRD §9 CrossReference: source ayah, target ayah, relation type,
 * evidence/source, review status.
 *
 * `reviewStatus` is NOT the topic layer's editorial status enum. A
 * text-identity fact requires no scholarly approval, and labelling these
 * "editorial-approved" would imply a judgement this module does not make.
 */
export interface CrossReference {
  source: AyahRef;
  target: AyahRef;
  relation: CrossReferenceRelation;
  /** What the dataset actually shows, stated so a reader can re-verify it. */
  evidence: string;
  reviewStatus: "machine-verified-text-identity";
}

/** Canonical provenance note for every edge this module emits. */
export const CROSS_REFERENCE_EVIDENCE =
  "Identical Uthmani Arabic text in the pinned Quran dataset (versioned record: " +
  "src/lib/quran/sources.ts), compared after stripping Unicode combining marks " +
  "and collapsing whitespace.";

export const CROSS_REFERENCE_LABELS: Record<CrossReferenceRelation, string> = {
  LEXICAL_MATCH: "Identical wording",
};

export const CROSS_REFERENCE_DESCRIPTIONS: Record<CrossReferenceRelation, string> = {
  LEXICAL_MATCH:
    "These ayat share the same Arabic wording. Nothing is claimed about why they coincide or what it signifies — that is interpretation, and it is left to the reader and to reviewed tafsir.",
};

function normalizeForIdentity(arabic: string): string {
  return arabic
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Cached across HMR reloads by stashing on globalThis, matching the precedent
// in ./data. `global` is only populated on explicit request — see
// crossSurahTextGroups().
type CrossRefCache = {
  bySurah: Map<number, AyahRef[][]>;
  global: Map<string, AyahRef[]> | null;
};

const cache = (
  globalThis as unknown as { __alhudaCrossRefs?: CrossRefCache }
).__alhudaCrossRefs ?? {
  bySurah: new Map<number, AyahRef[][]>(),
  global: null as Map<string, AyahRef[]> | null,
};
(globalThis as unknown as { __alhudaCrossRefs?: CrossRefCache }).__alhudaCrossRefs =
  cache;

/**
 * Groups of ayat within one surah whose normalized Arabic text is identical.
 * Members are in ascending ayah order, groups ordered by first member, and
 * singleton groups are excluded (a phrase appearing once is not a
 * cross-reference). Cost is bounded by one already-loaded surah.
 */
export function lexicalMatchGroups(surahId: number): AyahRef[][] {
  const cached = cache.bySurah.get(surahId);
  if (cached) return cached;

  const groups: AyahRef[][] = [];
  const surah = getSurah(surahId);

  if (surah) {
    const buckets = new Map<string, AyahRef[]>();
    for (const ayah of surah.ayat) {
      const key = normalizeForIdentity(ayah.arabic);
      const ref: AyahRef = { surah: ayah.surah, ayah: ayah.ayah };
      const bucket = buckets.get(key);
      if (bucket) bucket.push(ref);
      else buckets.set(key, [ref]);
    }
    for (const members of buckets.values()) {
      if (members.length > 1) groups.push(members);
    }
  }

  groups.sort((a, b) => a[0].ayah - b[0].ayah);
  cache.bySurah.set(surahId, groups);
  return groups;
}

/**
 * Cross-references for one ayah, sourced from intra-surah text identity only.
 *
 * Deliberately does not consult the global index: an ayah page must not pay a
 * full-dataset scan. Cross-surah identity is available separately via
 * crossSurahTextGroups() for the dedicated graph/list surface.
 */
export function crossReferencesForAyah(ref: AyahRef): CrossReference[] {
  const out: CrossReference[] = [];
  for (const members of lexicalMatchGroups(ref.surah)) {
    if (!members.some((m) => m.surah === ref.surah && m.ayah === ref.ayah)) {
      continue;
    }
    for (const target of members) {
      if (target.surah === ref.surah && target.ayah === ref.ayah) continue;
      out.push({
        source: { surah: ref.surah, ayah: ref.ayah },
        target,
        relation: "LEXICAL_MATCH",
        evidence: CROSS_REFERENCE_EVIDENCE,
        reviewStatus: "machine-verified-text-identity",
      });
    }
  }
  return out;
}

export interface CrossSurahGroup {
  members: AyahRef[];
  /** Distinct surahs represented in this group. Always >= 2. */
  surahCount: number;
}

/**
 * Groups of ayat whose normalized Arabic text is identical ACROSS surahs.
 *
 * EXPENSIVE BY DESIGN: building this reads all 114 surah files and holds every
 * verse in the process cache, so it is opt-in and memoized per server process.
 * Do not call it from a per-ayah render path.
 */
export function crossSurahTextGroups(): CrossSurahGroup[] {
  if (!cache.global) {
    const index = new Map<string, AyahRef[]>();
    for (const meta of getSurahIndex()) {
      const surah = getSurah(meta.id);
      if (!surah) continue;
      for (const ayah of surah.ayat) {
        const key = normalizeForIdentity(ayah.arabic);
        const ref: AyahRef = { surah: ayah.surah, ayah: ayah.ayah };
        const bucket = index.get(key);
        if (bucket) bucket.push(ref);
        else index.set(key, [ref]);
      }
    }
    cache.global = index;
  }

  const groups: CrossSurahGroup[] = [];
  for (const members of cache.global.values()) {
    if (members.length < 2) continue;
    const surahIds = new Set(members.map((m) => m.surah));
    if (surahIds.size < 2) continue;
    groups.push({ members, surahCount: surahIds.size });
  }
  groups.sort((a, b) => a.members[0].surah - b.members[0].surah);
  return groups;
}
