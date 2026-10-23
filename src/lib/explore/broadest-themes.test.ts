import { describe, expect, it } from "vitest";
import {
  getBroadestThemes,
  getTopicsByDimensionCount,
} from "./broadest-themes";
import { DIMENSIONS, getAllDimensions } from "./dimensions";
import { TOPICS, getTopic } from "../topics/data";

/**
 * The discovery hub ranks topics by how many dimensions list them. These tests
 * pin the contract: the count is derived from the same canonical mapping the
 * Explore pages use, ordering is deterministic, and no claim outruns the data.
 */

/** Independent recomputation, deliberately not sharing code with the helper. */
function expectedCount(slug: string): number {
  let count = 0;
  for (const dim of DIMENSIONS) {
    if (dim.topicSlugs.includes(slug)) count += 1;
  }
  return count;
}

describe("getTopicsByDimensionCount", () => {
  it("returns every canonical topic exactly once", () => {
    const ranked = getTopicsByDimensionCount();
    expect(ranked).toHaveLength(TOPICS.length);
    expect(new Set(ranked.map((t) => t.slug)).size).toBe(TOPICS.length);
    for (const topic of TOPICS) {
      expect(ranked.some((t) => t.slug === topic.slug)).toBe(true);
    }
  });

  it("only returns topics that resolve in the canonical catalog", () => {
    for (const item of getTopicsByDimensionCount()) {
      expect(getTopic(item.slug)).not.toBeNull();
    }
  });

  it("computes each count from the canonical dimension mapping", () => {
    for (const item of getTopicsByDimensionCount()) {
      expect(item.dimensionCount).toBe(expectedCount(item.slug));
    }
  });

  it("sorts by dimension count descending", () => {
    const counts = getTopicsByDimensionCount().map((t) => t.dimensionCount);
    const sorted = [...counts].sort((a, b) => b - a);
    expect(counts).toEqual(sorted);
  });

  it("breaks ties by canonical TOPICS order", () => {
    const ranked = getTopicsByDimensionCount();
    for (let i = 1; i < ranked.length; i += 1) {
      const prev = ranked[i - 1];
      const curr = ranked[i];
      if (prev.dimensionCount === curr.dimensionCount) {
        const prevIndex = TOPICS.findIndex((t) => t.slug === prev.slug);
        const currIndex = TOPICS.findIndex((t) => t.slug === curr.slug);
        expect(prevIndex).toBeLessThan(currIndex);
      }
    }
  });

  it("ranks the three-dimensional themes first, in catalog order", () => {
    // patience, justice and knowledge-and-reflection are each mapped to three
    // dimensions in the canonical data. This is a data fact, not a judgement.
    expect(
      getTopicsByDimensionCount()
        .slice(0, 3)
        .map((t) => t.slug)
    ).toEqual(["patience", "justice", "knowledge-and-reflection"]);
  });

  it("never assigns a zero count while every topic is mapped somewhere", () => {
    // Guarantees the hub's "In N dimensions" label is never 0 for real data.
    for (const item of getTopicsByDimensionCount()) {
      expect(item.dimensionCount).toBeGreaterThan(0);
    }
  });

  it("is deterministic across calls", () => {
    expect(getTopicsByDimensionCount()).toEqual(getTopicsByDimensionCount());
  });

  it("does not depend on the empty Interfaith mapping", () => {
    const interfaith = DIMENSIONS.find((d) => d.id === "interfaith");
    expect(interfaith?.topicSlugs).toEqual([]);
    // Removing it from the mapping would not change any count.
    for (const item of getTopicsByDimensionCount()) {
      const withoutInterfaith = DIMENSIONS.filter(
        (d) => d.id !== "interfaith"
      ).reduce(
        (n, d) => n + (d.topicSlugs.includes(item.slug) ? 1 : 0),
        0
      );
      expect(item.dimensionCount).toBe(withoutInterfaith);
    }
  });
});

describe("getBroadestThemes", () => {
  it("returns the requested prefix of the ranking", () => {
    const ranked = getTopicsByDimensionCount();
    expect(getBroadestThemes(4)).toEqual(ranked.slice(0, 4));
    expect(getBroadestThemes(6)).toEqual(ranked.slice(0, 6));
  });

  it("only surfaces themes mapped to at least two dimensions", () => {
    for (const item of getBroadestThemes(6)) {
      expect(item.dimensionCount).toBeGreaterThanOrEqual(2);
    }
  });

  it("caps at the number of canonical topics", () => {
    expect(getBroadestThemes(100)).toHaveLength(TOPICS.length);
  });

  it("returns an empty list for non-positive or non-finite limits", () => {
    expect(getBroadestThemes(0)).toEqual([]);
    expect(getBroadestThemes(-3)).toEqual([]);
    expect(getBroadestThemes(Number.NaN)).toEqual([]);
  });

  it("rounds fractional limits down instead of overflowing", () => {
    expect(getBroadestThemes(2.9)).toHaveLength(2);
  });

  it("uses the same ten-dimension catalog the Explore pages render", () => {
    expect(getAllDimensions()).toBe(DIMENSIONS);
    expect(DIMENSIONS).toHaveLength(10);
  });
});