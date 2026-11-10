import { describe, it, expect } from "vitest";
import { TOPICS, getTopic, topicTitle } from "./data";
import { getSurahIndex } from "../quran/data";

describe("Topic editorial integrity (Sprint 53)", () => {
  it("contains exactly 18 topics", () => {
    expect(TOPICS).toHaveLength(18);
  });

  it("all topics have required editorial fields", () => {
    for (const topic of TOPICS) {
      expect(topic.slug).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.arabicTitle).toBeTruthy();
      expect(topic.summary).toBeTruthy();
      expect(topic.editorialDescription).toBeTruthy();
      expect(topic.editorialDescription.length).toBeGreaterThan(50);
      expect(topic.knownLimitations).toBeInstanceOf(Array);
      expect(topic.knownLimitations.length).toBeGreaterThan(0);
      expect(topic.reviewState).toBeTruthy();
      expect(topic.relations).toBeInstanceOf(Array);
      expect(topic.provenance).toBeTruthy();
    }
  });

  it("all topics have valid reviewState", () => {
    const validStates = ["draft", "needs_review", "reviewed", "published"];
    for (const topic of TOPICS) {
      expect(validStates).toContain(topic.reviewState);
    }
  });

  it("urduTitle is optional and not fabricated", () => {
    // urduTitle should be undefined for all topics since we don't have verified translations
    for (const topic of TOPICS) {
      expect(topic.urduTitle).toBeUndefined();
    }
  });

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

  it("all topics have provenance", () => {
    for (const topic of TOPICS) {
      expect(topic.provenance.method).toBeTruthy();
      expect(topic.provenance.curator).toBeTruthy();
      expect(topic.provenance.reviewedAt).toBeTruthy();
      expect(topic.provenance.status).toBeTruthy();
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

  it("topicTitle returns title or slug as fallback", () => {
    expect(topicTitle("patience")).toBe("Patience");
    expect(topicTitle("non-existent")).toBe("non-existent");
  });

  it("all topics have editorialDescription longer than summary", () => {
    for (const topic of TOPICS) {
      expect(topic.editorialDescription.length).toBeGreaterThan(
        topic.summary.length
      );
    }
  });

  it("all topics have at least 2 known limitations", () => {
    for (const topic of TOPICS) {
      expect(topic.knownLimitations.length).toBeGreaterThanOrEqual(2);
    }
  });
});