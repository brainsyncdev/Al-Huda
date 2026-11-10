import { describe, it, expect } from "vitest";
import {
  JOURNEYS,
  getJourney,
  getAllJourneys,
  journeysByDifficulty,
  EMPTY_JOURNEYS_STATE,
} from "./data";

describe("Study Journeys Data", () => {
  describe("JOURNEYS array", () => {
    it("should have exactly 4 journeys", () => {
      expect(JOURNEYS).toHaveLength(4);
    });

    it("should have all required journey-level fields", () => {
      for (const journey of JOURNEYS) {
        expect(journey.slug).toBeTruthy();
        expect(journey.language).toBe("en");
        expect(journey.title).toBeTruthy();
        expect(journey.arabicTitle).toBeTruthy();
        expect(journey.summary).toBeTruthy();
        expect(journey.learningObjective).toBeTruthy();
        expect(journey.completionCriteria).toBeInstanceOf(Array);
        expect(journey.completionCriteria.length).toBeGreaterThan(0);
        expect(journey.dimensionId).toBeTruthy();
        expect(journey.difficulty).toBeTruthy();
        expect(journey.stages).toBeInstanceOf(Array);
        expect(journey.stages.length).toBeGreaterThan(0);
        expect(journey.prerequisites).toBeInstanceOf(Array);
        expect(journey.provenance).toBeTruthy();
        expect(journey.version).toBeGreaterThan(0);
      }
    });

    it("should have unique slugs", () => {
      const slugs = JOURNEYS.map((j) => j.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("should have valid difficulty levels", () => {
      const validDifficulties = ["beginner", "intermediate", "advanced"];
      for (const journey of JOURNEYS) {
        expect(validDifficulties).toContain(journey.difficulty);
      }
    });
  });

  describe("Journey stages", () => {
    it("should have all required stage-level fields", () => {
      for (const journey of JOURNEYS) {
        for (const stage of journey.stages) {
          expect(stage.order).toBeGreaterThan(0);
          expect(stage.title).toBeTruthy();
          expect(stage.objective).toBeTruthy();
          expect(stage.completionCriteria).toBeTruthy();
          expect(stage.nextStep).toBeTruthy();
          // reflectionPrompt is optional
          // ref or topicSlug should be present
          expect(stage.ref || stage.topicSlug).toBeTruthy();
        }
      }
    });

    it("should have sequential order numbers", () => {
      for (const journey of JOURNEYS) {
        const orders = journey.stages.map((s) => s.order);
        for (let i = 0; i < orders.length; i++) {
          expect(orders[i]).toBe(i + 1);
        }
      }
    });

    it("should have at least one stage per journey", () => {
      for (const journey of JOURNEYS) {
        expect(journey.stages.length).toBeGreaterThan(0);
      }
    });

    it("should have exactly 5 stages per journey", () => {
      for (const journey of JOURNEYS) {
        expect(journey.stages).toHaveLength(5);
      }
    });
  });

  describe("Specific journeys", () => {
    it("should have understanding-tawheed journey", () => {
      const journey = getJourney("understanding-tawheed");
      expect(journey).not.toBeNull();
      expect(journey?.title).toBe("Understanding Tawheed");
      expect(journey?.difficulty).toBe("beginner");
      expect(journey?.dimensionId).toBe("spiritual");
    });

    it("should have patience-through-difficulties journey", () => {
      const journey = getJourney("patience-through-difficulties");
      expect(journey).not.toBeNull();
      expect(journey?.title).toBe("Patience Through Difficulties");
      expect(journey?.difficulty).toBe("beginner");
      expect(journey?.dimensionId).toBe("personal");
    });

    it("should have gratitude-and-contentment journey", () => {
      const journey = getJourney("gratitude-and-contentment");
      expect(journey).not.toBeNull();
      expect(journey?.title).toBe("Gratitude and Contentment");
      expect(journey?.difficulty).toBe("beginner");
      expect(journey?.dimensionId).toBe("spiritual");
    });

    it("should have building-relationship-with-allah journey", () => {
      const journey = getJourney("building-relationship-with-allah");
      expect(journey).not.toBeNull();
      expect(journey?.title).toBe("Building a Relationship with Allah");
      expect(journey?.difficulty).toBe("intermediate");
      expect(journey?.dimensionId).toBe("spiritual");
      expect(journey?.prerequisites).toContain("understanding-tawheed");
    });
  });

  describe("getJourney function", () => {
    it("should return journey by slug", () => {
      const journey = getJourney("understanding-tawheed");
      expect(journey).not.toBeNull();
      expect(journey?.slug).toBe("understanding-tawheed");
    });

    it("should return null for non-existent slug", () => {
      const journey = getJourney("non-existent-journey");
      expect(journey).toBeNull();
    });
  });

  describe("getAllJourneys function", () => {
    it("should return all journeys when no dimension specified", () => {
      const journeys = getAllJourneys();
      expect(journeys).toHaveLength(4);
    });

    it("should filter by dimension", () => {
      const spiritualJourneys = getAllJourneys("spiritual");
      expect(spiritualJourneys.length).toBeGreaterThan(0);
      for (const journey of spiritualJourneys) {
        expect(journey.dimensionId).toBe("spiritual");
      }

      const personalJourneys = getAllJourneys("personal");
      expect(personalJourneys.length).toBeGreaterThan(0);
      for (const journey of personalJourneys) {
        expect(journey.dimensionId).toBe("personal");
      }
    });
  });

  describe("journeysByDifficulty function", () => {
    it("should return journeys by difficulty level", () => {
      const beginnerJourneys = journeysByDifficulty("beginner");
      expect(beginnerJourneys.length).toBeGreaterThan(0);
      for (const journey of beginnerJourneys) {
        expect(journey.difficulty).toBe("beginner");
      }

      const intermediateJourneys = journeysByDifficulty("intermediate");
      expect(intermediateJourneys.length).toBeGreaterThan(0);
      for (const journey of intermediateJourneys) {
        expect(journey.difficulty).toBe("intermediate");
      }
    });
  });

  describe("EMPTY_JOURNEYS_STATE", () => {
    it("should have empty progress object", () => {
      expect(EMPTY_JOURNEYS_STATE.progress).toEqual({});
    });
  });

  describe("Data integrity", () => {
    it("should have total of 20 stages across all journeys", () => {
      const totalStages = JOURNEYS.reduce(
        (sum, journey) => sum + journey.stages.length,
        0
      );
      expect(totalStages).toBe(20);
    });

    it("should have valid ayah references", () => {
      for (const journey of JOURNEYS) {
        for (const stage of journey.stages) {
          if (stage.ref) {
            expect(stage.ref.surah).toBeGreaterThan(0);
            expect(stage.ref.ayah).toBeGreaterThan(0);
          }
        }
      }
    });

    it("should have valid topic slugs when present", () => {
      for (const journey of JOURNEYS) {
        for (const stage of journey.stages) {
          if (stage.topicSlug) {
            expect(stage.topicSlug).toBeTruthy();
            expect(typeof stage.topicSlug).toBe("string");
          }
        }
      }
    });
  });
});
