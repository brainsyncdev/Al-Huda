// Unit tests for the /explore/theme/[name] route's resolution logic.
//
// The theme route is a thin redirect onto /topics/[slug]; the behavior
// worth pinning down at the unit level is the "does this name resolve
// to a canonical topic?" question. That is exactly what getTopic()
// answers, and these tests make sure the slugs the theme route depends
// on remain stable — a rename would silently 404 every bookmarked
// theme link, so the catalog is the contract.

import { describe, expect, it } from "vitest";
import { getTopic, TOPICS } from "@/lib/topics/data";

describe("/explore/theme/[name] resolution contract", () => {
  it("every topic slug resolves to a topic record", () => {
    for (const topic of TOPICS) {
      expect(getTopic(topic.slug)).toBeDefined();
      expect(getTopic(topic.slug)?.slug).toBe(topic.slug);
    }
  });

  it("an unknown name does not resolve (drives notFound() in the route)", () => {
    expect(getTopic("nonexistent-theme")).toBeUndefined();
    expect(getTopic("")).toBeUndefined();
    expect(getTopic("Patience")).toBeUndefined(); // title, not slug — must stay strict
  });

  it("slugs are URL-safe and lowercase (a rename would break permalinks)", () => {
    for (const topic of TOPICS) {
      expect(topic.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("the expected theme entry points all resolve", () => {
    // Representative slugs mentioned across sprints 10-14 — if any of
    // these disappears, bookmarks and search-result chips break.
    const mustExist = [
      "patience",
      "gratitude",
      "trust-in-god",
      "mercy-and-forgiveness",
      "remembrance",
      "giving",
      "justice",
      "parents-and-family",
      "hardship-and-ease",
      "knowledge-and-reflection",
      "the-hereafter",
    ];
    for (const slug of mustExist) {
      expect(getTopic(slug), `expected topic '${slug}' to exist`).toBeDefined();
    }
  });

  it("no duplicate slugs in the catalog (duplicate would cause ambiguous redirects)", () => {
    const slugs = TOPICS.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
