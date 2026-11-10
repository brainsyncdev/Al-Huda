import { describe, it, expect } from "vitest";
import { TOPICS, getTopic } from "./data";
import { getSurahIndex } from "../quran/data";
import { getDimensionsForTopic } from "../explore/dimensions";
import { getTopicDomainRelations } from "../taxonomy/domain-topics";

describe("Topic Quality Audit (Sprint 54)", () => {
  describe("Editorial Quality", () => {
    it("all 18 topics have editorialDescription", () => {
      for (const topic of TOPICS) {
        expect(topic.editorialDescription).toBeTruthy();
        expect(topic.editorialDescription.length).toBeGreaterThan(50);
      }
    });

    it("all topics have knownLimitations as non-empty array", () => {
      for (const topic of TOPICS) {
        expect(topic.knownLimitations).toBeInstanceOf(Array);
        expect(topic.knownLimitations.length).toBeGreaterThan(0);
      }
    });

    it("all topics have valid reviewState", () => {
      const validStates = ["draft", "needs_review", "reviewed", "published"];
      for (const topic of TOPICS) {
        expect(validStates).toContain(topic.reviewState);
      }
    });

    it("editorialDescription is longer than summary", () => {
      for (const topic of TOPICS) {
        expect(topic.editorialDescription.length).toBeGreaterThan(
          topic.summary.length
        );
      }
    });

    it("knownLimitations are meaningful (not generic boilerplate)", () => {
      for (const topic of TOPICS) {
        for (const limitation of topic.knownLimitations) {
          expect(limitation.length).toBeGreaterThan(10);
          expect(limitation).not.toBe("None");
          expect(limitation).not.toBe("N/A");
        }
      }
    });
  });

  describe("Technical Integrity", () => {
    it("all ayah references are valid", () => {
      const surahs = getSurahIndex();
      const surahMap = new Map(surahs.map((s) => [s.id, s]));

      for (const topic of TOPICS) {
        for (const relation of topic.relations) {
          const surah = surahMap.get(relation.ref.surah);
          expect(
            surah,
            `Topic ${topic.slug}: surah ${relation.ref.surah} not found`
          ).toBeTruthy();
          expect(relation.ref.ayah).toBeGreaterThanOrEqual(1);
          expect(relation.ref.ayah).toBeLessThanOrEqual(surah!.ayahCount);
        }
      }
    });

    it("no duplicate ayah references within a topic", () => {
      for (const topic of TOPICS) {
        const refKeys = new Set<string>();
        for (const relation of topic.relations) {
          const key = `${relation.ref.surah}:${relation.ref.ayah}`;
          expect(
            refKeys.has(key),
            `Topic ${topic.slug}: duplicate reference ${key}`
          ).toBe(false);
          refKeys.add(key);
        }
      }
    });

    it("all topics have at least one relation", () => {
      for (const topic of TOPICS) {
        expect(topic.relations.length).toBeGreaterThan(0);
      }
    });

    it("all relations have rationales", () => {
      for (const topic of TOPICS) {
        for (const relation of topic.relations) {
          expect(relation.rationale).toBeTruthy();
          expect(relation.rationale.length).toBeGreaterThan(10);
        }
      }
    });

    it("all relations have valid type", () => {
      const validTypes = [
        "TOPIC_ASSOCIATION",
        "LEXICAL_MATCH",
        "CROSS_REFERENCE",
        "SEQUENTIAL_CONTEXT",
      ];
      for (const topic of TOPICS) {
        for (const relation of topic.relations) {
          expect(validTypes).toContain(relation.type);
        }
      }
    });
  });

  describe("Translation Completeness", () => {
    it("Urdu title is optional (not required for all topics)", () => {
      // This is informational - we expect 0 topics to have Urdu titles currently
      let countWithUrdu = 0;
      for (const topic of TOPICS) {
        if (topic.urduTitle) {
          countWithUrdu++;
        }
      }
      // Document the current state
      expect(countWithUrdu).toBeGreaterThanOrEqual(0);
    });

    it("all topics have English title", () => {
      for (const topic of TOPICS) {
        expect(topic.title).toBeTruthy();
        expect(topic.title.length).toBeGreaterThan(0);
      }
    });

    it("all topics have Arabic title", () => {
      for (const topic of TOPICS) {
        expect(topic.arabicTitle).toBeTruthy();
        expect(topic.arabicTitle.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Relationship Validity", () => {
    it("all topics have at least one dimension", () => {
      for (const topic of TOPICS) {
        const dimensions = getDimensionsForTopic(topic.slug);
        expect(
          dimensions.length,
          `Topic ${topic.slug} has no dimensions`
        ).toBeGreaterThan(0);
      }
    });

    it("all topics have at least one domain relationship", () => {
      for (const topic of TOPICS) {
        const domainRels = getTopicDomainRelations(topic.slug);
        expect(
          domainRels.length,
          `Topic ${topic.slug} has no domain relationships`
        ).toBeGreaterThan(0);
      }
    });

    it("topics are distinguishable (no duplicate slugs)", () => {
      const slugs = TOPICS.map((t) => t.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it("topics have minimal scope overlap (different ayah references)", () => {
      // Check that no two topics have identical ayah reference sets
      const topicRefSets = TOPICS.map((topic) => {
        const refs = topic.relations
          .map((r) => `${r.ref.surah}:${r.ref.ayah}`)
          .sort()
          .join(",");
        return { slug: topic.slug, refs };
      });

      for (let i = 0; i < topicRefSets.length; i++) {
        for (let j = i + 1; j < topicRefSets.length; j++) {
          expect(
            topicRefSets[i].refs,
            `Topics ${topicRefSets[i].slug} and ${topicRefSets[j].slug} have identical ayah references`
          ).not.toBe(topicRefSets[j].refs);
        }
      }
    });
  });

  describe("Metadata Quality", () => {
    it("all topics have provenance", () => {
      for (const topic of TOPICS) {
        expect(topic.provenance).toBeTruthy();
        expect(topic.provenance.method).toBeTruthy();
        expect(topic.provenance.curator).toBeTruthy();
        expect(topic.provenance.reviewedAt).toBeTruthy();
        expect(topic.provenance.status).toBeTruthy();
      }
    });

    it("provenance status is pending-scholarly-review (no fabricated approvals)", () => {
      for (const topic of TOPICS) {
        expect(topic.provenance.status).toBe("pending-scholarly-review");
      }
    });

    it("getTopic returns correct topic by slug", () => {
      const patience = getTopic("patience");
      expect(patience).toBeTruthy();
      expect(patience?.slug).toBe("patience");
      expect(patience?.title).toBe("Patience");
    });

    it("getTopic returns undefined for non-existent slug", () => {
      expect(getTopic("non-existent")).toBeUndefined();
    });
  });

  describe("Issue Classification", () => {
    it("no topics have missing_metadata issues", () => {
      for (const topic of TOPICS) {
        expect(topic.slug).toBeTruthy();
        expect(topic.title).toBeTruthy();
        expect(topic.arabicTitle).toBeTruthy();
        expect(topic.summary).toBeTruthy();
        expect(topic.editorialDescription).toBeTruthy();
        expect(topic.knownLimitations).toBeTruthy();
        expect(topic.reviewState).toBeTruthy();
      }
    });

    it("no topics have invalid_reference issues", () => {
      const surahs = getSurahIndex();
      const surahMap = new Map(surahs.map((s) => [s.id, s]));

      for (const topic of TOPICS) {
        for (const relation of topic.relations) {
          const surah = surahMap.get(relation.ref.surah);
          expect(surah).toBeTruthy();
          expect(relation.ref.ayah).toBeGreaterThanOrEqual(1);
          expect(relation.ref.ayah).toBeLessThanOrEqual(surah!.ayahCount);
        }
      }
    });

    it("no topics have duplicate_reference issues", () => {
      for (const topic of TOPICS) {
        const refKeys = new Set<string>();
        for (const relation of topic.relations) {
          const key = `${relation.ref.surah}:${relation.ref.ayah}`;
          expect(refKeys.has(key)).toBe(false);
          refKeys.add(key);
        }
      }
    });

    it("all topics have incomplete_translation status (no Urdu titles)", () => {
      // This is expected - we document it as a known gap
      let incompleteCount = 0;
      for (const topic of TOPICS) {
        if (!topic.urduTitle) {
          incompleteCount++;
        }
      }
      expect(incompleteCount).toBe(18); // All topics lack Urdu titles
    });
  });
});
