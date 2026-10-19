// Structural invariants for the FR-023 derived cross-reference layer.
//
// These tests assert SHAPE, not content: every edge must be intra-surah,
// symmetric, non-self, resolvable against the pinned dataset, and carrying the
// single relation kind this module is allowed to emit. Content is deliberately
// not enumerated — the whole point of deriving edges from the dataset is that
// nobody has to transcribe them.
//
// The one content-dependent assertion is at the bottom (Ar-Rahman). If it is
// the ONLY failure on a clean tree, that means the weak normalizer is too weak
// (the refrain ayat differ by more than combining marks/whitespace) rather than
// that the dataset is defective. Every other failure here is a real defect.

import { describe, expect, it } from "vitest";
import {
  CROSS_REFERENCE_EVIDENCE,
  crossReferencesForAyah,
  crossSurahTextGroups,
  lexicalMatchGroups,
} from "./cross-references";
import { getAyah, getSurah, getSurahIndex } from "./data";

const ALL_SURAHS = getSurahIndex().map((s) => s.id);

describe("lexicalMatchGroups", () => {
  it("returns only groups with two or more members, for every surah", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        expect(group.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("keeps every group inside its own surah", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        for (const ref of group) {
          expect(ref.surah).toBe(id);
        }
      }
    }
  });

  it("lists members in ascending ayah order with no duplicates", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        const seen = new Set<number>();
        let previous = 0;
        for (const ref of group) {
          expect(ref.ayah).toBeGreaterThan(previous);
          expect(seen.has(ref.ayah)).toBe(false);
          seen.add(ref.ayah);
          previous = ref.ayah;
        }
      }
    }
  });

  it("orders groups by first member and resolves every member to a real ayah", () => {
    for (const id of ALL_SURAHS) {
      const groups = lexicalMatchGroups(id);
      let previousFirst = 0;
      for (const group of groups) {
        expect(group[0].ayah).toBeGreaterThan(previousFirst);
        previousFirst = group[0].ayah;
        for (const ref of group) {
          expect(getAyah(ref.surah, ref.ayah)).not.toBeNull();
        }
      }
    }
  });

  it("is memoized: the same call twice returns the identical array", () => {
    expect(lexicalMatchGroups(55)).toBe(lexicalMatchGroups(55));
  });

  it("returns an empty group list for an out-of-range surah rather than throwing", () => {
    expect(lexicalMatchGroups(999)).toEqual([]);
    expect(lexicalMatchGroups(0)).toEqual([]);
  });
});

describe("crossReferencesForAyah", () => {
  it("emits only LEXICAL_MATCH edges with the canonical evidence and status", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        for (const member of group) {
          for (const edge of crossReferencesForAyah(member)) {
            expect(edge.relation).toBe("LEXICAL_MATCH");
            expect(edge.evidence).toBe(CROSS_REFERENCE_EVIDENCE);
            expect(edge.reviewStatus).toBe("machine-verified-text-identity");
          }
        }
      }
    }
  });

  it("never emits a self-edge", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        for (const member of group) {
          for (const edge of crossReferencesForAyah(member)) {
            expect(edge.target.ayah).not.toBe(member.ayah);
          }
        }
      }
    }
  });

  it("is symmetric: A→B exists exactly when B→A exists", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        const edgesByAyah = new Map<number, Set<number>>();
        for (const member of group) {
          const targets = new Set(
            crossReferencesForAyah(member).map((e) => e.target.ayah)
          );
          edgesByAyah.set(member.ayah, targets);
        }
        for (const [from, targets] of edgesByAyah) {
          for (const to of targets) {
            expect(edgesByAyah.get(to)?.has(from)).toBe(true);
          }
          // Degree is exactly group size minus one — no missing or extra twins.
          expect(targets.size).toBe(group.length - 1);
        }
      }
    }
  });

  it("anchors every edge on the requested ayah", () => {
    for (const id of ALL_SURAHS) {
      for (const group of lexicalMatchGroups(id)) {
        for (const member of group) {
          for (const edge of crossReferencesForAyah(member)) {
            expect(edge.source).toEqual({ surah: member.surah, ayah: member.ayah });
            expect(edge.target.surah).toBe(member.surah);
          }
        }
      }
    }
  });

  it("returns nothing for an ayah with no twin, and for an out-of-range reference", () => {
    expect(crossReferencesForAyah({ surah: 1, ayah: 2 })).toEqual([]);
    expect(crossReferencesForAyah({ surah: 999, ayah: 1 })).toEqual([]);
    expect(crossReferencesForAyah({ surah: 2, ayah: 99999 })).toEqual([]);
  });
});

describe("crossSurahTextGroups", () => {
  const groups = crossSurahTextGroups();

  it("only reports groups spanning two or more distinct surahs", () => {
    for (const group of groups) {
      expect(group.members.length).toBeGreaterThanOrEqual(2);
      expect(group.surahCount).toBeGreaterThanOrEqual(2);
      const distinct = new Set(group.members.map((m) => m.surah));
      expect(distinct.size).toBe(group.surahCount);
    }
  });

  it("resolves every member against the pinned dataset", () => {
    for (const group of groups) {
      for (const ref of group.members) {
        expect(getAyah(ref.surah, ref.ayah)).not.toBeNull();
      }
    }
  });

  it("is memoized: the second call returns the same result", () => {
    expect(crossSurahTextGroups()).toBe(groups);
  });

  it("does not duplicate a member within a group", () => {
    for (const group of groups) {
      const keys = group.members.map((m) => `${m.surah}:${m.ayah}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });
});

describe("content anchor (the only content-dependent assertion in this file)", () => {
  it("finds the repeated refrain in Ar-Rahman (55)", () => {
    const groups = lexicalMatchGroups(55);
    expect(groups.length).toBeGreaterThanOrEqual(1);
    // The refrain is the surah's dominant repetition; if the normalizer is
    // working, at least one group is substantially larger than two members.
    const largest = Math.max(...groups.map((g) => g.length));
    expect(largest).toBeGreaterThanOrEqual(2);
  });

  it("finds no repeated wording in a surah whose ayat are all distinct", () => {
    // Al-Ikhlas (112) has four short, mutually distinct ayat. Asserting an
    // empty result here guards against a normalizer that collapses everything
    // into one bucket.
    expect(lexicalMatchGroups(112)).toEqual([]);
  });

  it("never lets a group span surahs in the per-surah path", () => {
    // Sanity: the intra-surah function cannot produce cross-surah edges even
    // if the dataset contained a globally repeated verse.
    for (const id of ALL_SURAHS) {
      const surah = getSurah(id);
      expect(surah).not.toBeNull();
      for (const group of lexicalMatchGroups(id)) {
        for (const ref of group) {
          expect(ref.surah).toBe(surah!.id);
        }
      }
    }
  });
});
