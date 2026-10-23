// Dimension catalog integrity tests (Sprint 8).
//
// The topic page now links back into the dimension view using
// `getDimensionsForTopic()`. That reverse lookup is only trustworthy if it is
// the exact inverse of `Dimension.topicSlugs`, so these tests pin both
// directions and the data-integrity rule that every mapped slug resolves.

import { describe, expect, it } from "vitest";
import {
  DIMENSIONS,
  getAllDimensions,
  getDimension,
  getDimensionsForTopic,
  getDimensionsWithTopics,
  getDimensionsWithoutTopics,
} from "./dimensions";
import { TOPICS, getTopic } from "../topics/data";

describe("dimensions — catalog integrity", () => {
  it("has exactly ten dimensions numbered 1..10 in order", () => {
    expect(DIMENSIONS).toHaveLength(10);
    expect(DIMENSIONS.map((d) => d.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ]);
  });

  it("has unique ids", () => {
    const ids = DIMENSIONS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every mapped topic slug resolves to a canonical topic", () => {
    for (const dim of DIMENSIONS) {
      for (const slug of dim.topicSlugs) {
        expect(getTopic(slug), `${dim.id} maps unknown topic ${slug}`).toBeDefined();
      }
    }
  });

  it("no dimension lists the same topic twice", () => {
    for (const dim of DIMENSIONS) {
      expect(new Set(dim.topicSlugs).size, `${dim.id} has a duplicate slug`).toBe(
        dim.topicSlugs.length
      );
    }
  });

  it("every canonical topic is reachable from at least one dimension", () => {
    // Not a content requirement — an orphan topic would simply render no
    // dimension section. Asserting it keeps the reverse lookup from silently
    // losing a topic if the mapping is edited later.
    for (const topic of TOPICS) {
      expect(
        getDimensionsForTopic(topic.slug).length,
        `topic ${topic.slug} is not mapped from any dimension`
      ).toBeGreaterThan(0);
    }
  });

  it("getDimensionsWithTopics and getDimensionsWithoutTopics partition the catalog", () => {
    const withTopics = getDimensionsWithTopics();
    const withoutTopics = getDimensionsWithoutTopics();
    expect(withTopics.length + withoutTopics.length).toBe(DIMENSIONS.length);
    expect(withTopics.every((d) => d.topicSlugs.length > 0)).toBe(true);
    expect(withoutTopics.every((d) => d.topicSlugs.length === 0)).toBe(true);
    // The interfaith dimension is deliberately empty (no verified mapping).
    expect(withoutTopics.map((d) => d.id)).toContain("interfaith");
  });
});

describe("dimensions — reverse lookup", () => {
  it("returns exactly the dimensions whose topicSlugs include the slug", () => {
    for (const topic of TOPICS) {
      const expected = DIMENSIONS.filter((d) =>
        d.topicSlugs.includes(topic.slug)
      ).map((d) => d.id);
      expect(getDimensionsForTopic(topic.slug).map((d) => d.id)).toEqual(expected);
    }
  });

  it("is consistent with the forward mapping in both directions", () => {
    for (const dim of DIMENSIONS) {
      for (const slug of dim.topicSlugs) {
        expect(
          getDimensionsForTopic(slug).map((d) => d.id),
          `${slug} should map back to ${dim.id}`
        ).toContain(dim.id);
      }
    }
  });

  it("returns dimensions in PRD order", () => {
    const dims = getDimensionsForTopic("patience");
    const numbers = dims.map((d) => d.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
  });

  it("returns an empty array for an unknown slug", () => {
    expect(getDimensionsForTopic("no-such-topic")).toEqual([]);
  });

  it("getDimension resolves known ids and returns null otherwise", () => {
    expect(getDimension("spiritual")?.number).toBe(1);
    expect(getDimension("interfaith")?.number).toBe(9);
    expect(getDimension("nope")).toBeNull();
  });

  it("getAllDimensions returns the canonical array", () => {
    expect(getAllDimensions()).toBe(DIMENSIONS);
  });
});