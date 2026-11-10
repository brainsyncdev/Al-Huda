import { describe, it, expect } from "vitest";
import { TOPICS } from "@/lib/topics/data";
import { JOURNEYS } from "@/lib/study-journeys/data";
import {
  validateTopicTechnicalIntegrity,
  validateTopicEditorialCompleteness,
  validateTopicScholarlyReview,
  buildTopicQualityState,
  validateJourneyTechnicalIntegrity,
  validateJourneyEditorialCompleteness,
  validateJourneyScholarlyReview,
  buildJourneyQualityState,
} from "./validation";

describe("Three-dimension quality model", () => {
  describe("Topic quality validation", () => {
    it("validates technical integrity for all 18 topics", () => {
      for (const topic of TOPICS) {
        const result = validateTopicTechnicalIntegrity(topic);
        expect(result.status).toBe("passed");
        expect(result.validatedAt).toBeTruthy();
      }
    });

    it("validates editorial completeness for all 18 topics", () => {
      for (const topic of TOPICS) {
        const result = validateTopicEditorialCompleteness(topic);
        expect(result.completenessScore).toBeGreaterThan(0);
        expect(result.missingElements).toBeDefined();
      }
    });

    it("validates scholarly review status for all 18 topics", () => {
      for (const topic of TOPICS) {
        const result = validateTopicScholarlyReview(topic);
        expect(["pending", "in_review", "reviewed", "revision_requested"]).toContain(result.status);
      }
    });

    it("builds complete quality state for topics", () => {
      for (const topic of TOPICS) {
        const state = buildTopicQualityState(topic);
        expect(state.entityId).toBe(topic.slug);
        expect(state.entityType).toBe("topic");
        expect(state.technicalIntegrity).toBeDefined();
        expect(state.editorialCompleteness).toBeDefined();
        expect(state.scholarlyReview).toBeDefined();
        expect(state.lastUpdated).toBeTruthy();
      }
    });

    it("all topics have pending scholarly review (no fabricated approvals)", () => {
      for (const topic of TOPICS) {
        const result = validateTopicScholarlyReview(topic);
        expect(result.status).toBe("pending");
      }
    });

    it("all topics have high editorial completeness (Sprint 53 work)", () => {
      for (const topic of TOPICS) {
        const result = validateTopicEditorialCompleteness(topic);
        // Sprint 53 added editorial metadata, so completeness should be high
        expect(result.completenessScore).toBeGreaterThanOrEqual(70);
      }
    });

    it("technical integrity is independent of editorial completeness", () => {
      const topic = TOPICS[0];
      const technical = validateTopicTechnicalIntegrity(topic);
      const editorial = validateTopicEditorialCompleteness(topic);

      // These are independent dimensions
      expect(technical.status).toBeDefined();
      expect(editorial.status).toBeDefined();
      // One can pass while the other is incomplete
    });
  });

  describe("Journey quality validation", () => {
    it("validates technical integrity for all 4 journeys", () => {
      for (const journey of JOURNEYS) {
        const result = validateJourneyTechnicalIntegrity(journey);
        expect(result.status).toBe("passed");
      }
    });

    it("validates editorial completeness for all 4 journeys", () => {
      for (const journey of JOURNEYS) {
        const result = validateJourneyEditorialCompleteness(journey);
        expect(result.completenessScore).toBeGreaterThan(0);
      }
    });

    it("validates scholarly review status for all 4 journeys", () => {
      for (const journey of JOURNEYS) {
        const result = validateJourneyScholarlyReview(journey);
        expect(["pending", "in_review", "reviewed", "revision_requested"]).toContain(result.status);
      }
    });

    it("builds complete quality state for journeys", () => {
      for (const journey of JOURNEYS) {
        const state = buildJourneyQualityState(journey);
        expect(state.entityId).toBe(journey.slug);
        expect(state.entityType).toBe("journey");
        expect(state.technicalIntegrity).toBeDefined();
        expect(state.editorialCompleteness).toBeDefined();
        expect(state.scholarlyReview).toBeDefined();
      }
    });

    it("all journeys have pending scholarly review", () => {
      for (const journey of JOURNEYS) {
        const result = validateJourneyScholarlyReview(journey);
        expect(result.status).toBe("pending");
      }
    });

    it("all journeys have high editorial completeness (Sprint 53 work)", () => {
      for (const journey of JOURNEYS) {
        const result = validateJourneyEditorialCompleteness(journey);
        expect(result.completenessScore).toBeGreaterThanOrEqual(70);
      }
    });
  });

  describe("Quality state independence", () => {
    it("technical integrity does not affect scholarly review status", () => {
      const topic = TOPICS[0];
      const technical = validateTopicTechnicalIntegrity(topic);
      const scholarly = validateTopicScholarlyReview(topic);

      // Even if technical passes, scholarly is still pending
      expect(technical.status).toBe("passed");
      expect(scholarly.status).toBe("pending");
    });

    it("editorial completeness does not affect scholarly review status", () => {
      const topic = TOPICS[0];
      const editorial = validateTopicEditorialCompleteness(topic);
      const scholarly = validateTopicScholarlyReview(topic);

      // Even if editorial is complete, scholarly is still pending
      expect(editorial.completenessScore).toBeGreaterThan(70);
      expect(scholarly.status).toBe("pending");
    });

    it("all three dimensions are tracked independently", () => {
      const topic = TOPICS[0];
      const state = buildTopicQualityState(topic);

      // Each dimension has its own status
      expect(state.technicalIntegrity.status).toBeDefined();
      expect(state.editorialCompleteness.status).toBeDefined();
      expect(state.scholarlyReview.status).toBeDefined();

      // They can have different values
      const statuses = [
        state.technicalIntegrity.status,
        state.editorialCompleteness.status,
        state.scholarlyReview.status,
      ];
      // At least scholarly should be different from technical
      expect(statuses[0]).not.toBe(statuses[2]);
    });
  });
});
