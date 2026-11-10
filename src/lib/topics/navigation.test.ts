// Tests for navigation helper functions.
//
// Sprint 53 Workstream C: Verify that contextual navigation between topics,
// dimensions, domains, and study journeys works correctly.

import { describe, expect, test } from "vitest";
import {
  getTopicsForAyah,
  getJourneysForTopic,
  getDimensionForTopic,
  getAllDimensionsForTopic,
  getDomainForTopic,
  getAllDomainsForTopic,
  getTopicUrl,
  getDimensionUrl,
  getDomainUrl,
  getJourneyUrl,
} from "./navigation";

describe("navigation helpers", () => {
  describe("getTopicsForAyah", () => {
    test("returns topics containing a specific ayah", () => {
      // Ayah 2:153 is in the "patience" topic
      const topics = getTopicsForAyah(2, 153);
      expect(topics.length).toBeGreaterThan(0);
      expect(topics.some((t) => t.slug === "patience")).toBe(true);
    });

    test("returns empty array for ayah not in any topic", () => {
      // Ayah 1:1 (Al-Fatiha opening) is not in any curated topic
      const topics = getTopicsForAyah(1, 1);
      expect(topics).toEqual([]);
    });

    test("returns multiple topics when ayah appears in several", () => {
      // Ayah 2:152 appears in both "gratitude" and "remembrance"
      const topics = getTopicsForAyah(2, 152);
      expect(topics.length).toBeGreaterThanOrEqual(2);
      const slugs = topics.map((t) => t.slug);
      expect(slugs).toContain("gratitude");
      expect(slugs).toContain("remembrance");
    });
  });

  describe("getJourneysForTopic", () => {
    test("returns journeys with stages referencing a topic", () => {
      // "tawheed" topic should be referenced by "understanding-tawheed" journey
      const journeys = getJourneysForTopic("tawheed");
      expect(journeys.length).toBeGreaterThan(0);
      expect(journeys.some((j) => j.slug === "understanding-tawheed")).toBe(true);
    });

    test("returns empty array for topic not in any journey", () => {
      // Some topics may not be referenced by any journey yet
      const journeys = getJourneysForTopic("nonexistent-topic");
      expect(journeys).toEqual([]);
    });

    test("journeys have at least one stage with matching topicSlug", () => {
      const journeys = getJourneysForTopic("patience");
      for (const journey of journeys) {
        const hasStage = journey.stages.some(
          (stage) => stage.topicSlug === "patience"
        );
        expect(hasStage).toBe(true);
      }
    });
  });

  describe("getDimensionForTopic", () => {
    test("returns primary dimension for a mapped topic", () => {
      // "patience" is in the "spiritual" dimension (first in PRD order)
      const dimension = getDimensionForTopic("patience");
      expect(dimension).not.toBeNull();
      expect(dimension?.id).toBe("spiritual");
    });

    test("returns null for topic not in any dimension", () => {
      const dimension = getDimensionForTopic("nonexistent-topic");
      expect(dimension).toBeNull();
    });

    test("returns first dimension when topic is in multiple", () => {
      // "patience" is in both "spiritual" and "personal" dimensions
      const dimension = getDimensionForTopic("patience");
      expect(dimension).not.toBeNull();
      // Should return the first one (spiritual)
      expect(dimension?.id).toBe("spiritual");
    });
  });

  describe("getAllDimensionsForTopic", () => {
    test("returns all dimensions for a topic in multiple dimensions", () => {
      // "patience" is in "spiritual", "personal", and "jihad"
      const dimensions = getAllDimensionsForTopic("patience");
      expect(dimensions.length).toBeGreaterThanOrEqual(2);
      const ids = dimensions.map((d) => d.id);
      expect(ids).toContain("spiritual");
      expect(ids).toContain("personal");
    });

    test("returns empty array for unmapped topic", () => {
      const dimensions = getAllDimensionsForTopic("nonexistent-topic");
      expect(dimensions).toEqual([]);
    });

    test("returns single dimension for topic in one dimension", () => {
      // "prophets" is only in the "prophets" dimension (dimension 12)
      const dimensions = getAllDimensionsForTopic("prophets");
      expect(dimensions.length).toBe(1);
      expect(dimensions[0].id).toBe("prophets");
    });
  });

  describe("getDomainForTopic", () => {
    test("returns primary domain for a mapped topic", () => {
      // "patience" is in "ethics-character" domain
      const domain = getDomainForTopic("patience");
      expect(domain).not.toBeNull();
      expect(domain?.id).toBe("ethics-character");
    });

    test("returns null for topic not in any domain", () => {
      const domain = getDomainForTopic("nonexistent-topic");
      expect(domain).toBeNull();
    });
  });

  describe("getAllDomainsForTopic", () => {
    test("returns all domains for a topic", () => {
      const domains = getAllDomainsForTopic("patience");
      expect(domains.length).toBeGreaterThan(0);
      expect(domains.some((d) => d.id === "ethics-character")).toBe(true);
    });

    test("returns empty array for unmapped topic", () => {
      const domains = getAllDomainsForTopic("nonexistent-topic");
      expect(domains).toEqual([]);
    });
  });

  describe("URL helpers", () => {
    test("getTopicUrl returns correct path", () => {
      expect(getTopicUrl("patience")).toBe("/topics/patience");
      expect(getTopicUrl("gratitude")).toBe("/topics/gratitude");
    });

    test("getDimensionUrl returns correct path", () => {
      expect(getDimensionUrl("spiritual")).toBe("/explore/dimension/spiritual");
      expect(getDimensionUrl("personal")).toBe("/explore/dimension/personal");
    });

    test("getDomainUrl returns correct path", () => {
      expect(getDomainUrl("ethics-character")).toBe(
        "/explore/domains/ethics-character"
      );
      expect(getDomainUrl("worship-practice")).toBe(
        "/explore/domains/worship-practice"
      );
    });

    test("getJourneyUrl returns correct path", () => {
      expect(getJourneyUrl("understanding-tawheed")).toBe(
        "/study-journeys/understanding-tawheed"
      );
    });
  });

  describe("integration: topic → dimension → domain", () => {
    test("topic has both dimension and domain mappings", () => {
      const topicSlug = "patience";
      const dimension = getDimensionForTopic(topicSlug);
      const domain = getDomainForTopic(topicSlug);

      expect(dimension).not.toBeNull();
      expect(domain).not.toBeNull();

      // Both should be valid entities
      expect(dimension?.title).toBeTruthy();
      expect(domain?.title).toBeTruthy();
    });

    test("topic with journeys has valid dimension", () => {
      const topicSlug = "tawheed";
      const journeys = getJourneysForTopic(topicSlug);
      const dimension = getDimensionForTopic(topicSlug);

      if (journeys.length > 0) {
        expect(dimension).not.toBeNull();
      }
    });
  });
});
