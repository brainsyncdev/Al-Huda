// Sprint 42 — Root/Topic separation regression tests.
//
// These tests prove that publishing a root (via automated pipeline or human
// approval) cannot mutate the curated topic membership. The root occurrence
// index and the curated topic system are separate data structures with
// independent lifecycles.

import { describe, it, expect } from "vitest";
import { TOPICS, getTopic } from "@/lib/topics/data";
import { ROOT_ALLOWLIST } from "./root-allowlist";
import { buildRootTopicIndex } from "./occurrence-index";
import type { MorphologyRecord } from "./types";
import {
  canPublishRootIndex,
  buildPublishedIndexEntry,
} from "./publication-status";
import type { PublicationDecision } from "./publication-status";
import { PUBLICATION_POLICY_VERSION } from "./publication-policy";
import { TOPIC_ROOT_LINKS } from "./root-links";

describe("Sprint 42 — Root/Topic separation", () => {
  describe("Data structure independence", () => {
    it("curated topics are defined in topics/data.ts, not derived from roots", () => {
      // Topics are hardcoded editorial selections with typed relations.
      // They do not read from morphology data or root allowlist.
      const patienceTopic = getTopic("patience");
      expect(patienceTopic).toBeDefined();
      expect(patienceTopic!.relations.length).toBeGreaterThan(0);
      expect(patienceTopic!.relations[0].type).toBeDefined();

      // The topic's ayah list is static and comes from the curated data file,
      // not from any root query or morphology index.
      const topicAyahs = patienceTopic!.relations.map((r) => r.ref);
      expect(topicAyahs.length).toBe(6);
    });

    it("root allowlist entries do not contain ayah lists", () => {
      // Root entries specify roots and includedLemmas, but not ayahs.
      // Ayahs are derived mechanically from morphology records at query time.
      for (const entry of ROOT_ALLOWLIST) {
        expect(entry).toHaveProperty("roots");
        expect(entry).toHaveProperty("includedLemmas");
        expect(entry).not.toHaveProperty("ayat");
        expect(entry).not.toHaveProperty("occurrences");
      }
    });

    it("publishing a root does not mutate TOPICS array", () => {
      // Snapshot the topics before any root operation
      const topicsBefore = TOPICS.map((t) => ({
        slug: t.slug,
        relationCount: t.relations.length,
        ayahs: t.relations.map((r) => `${r.ref.surah}:${r.ref.ayah}`).sort(),
      }));

      // Create a synthetic entry with populated includedLemmas
      const sabrEntry = {
        slug: "sabr",
        title: "Patience",
        arabicTitle: "الصبر",
        roots: ["صبر"],
        includedLemmas: ["صَبَرَ"],
        reviewState: "approved" as const,
        assertedBy: "test",
        assertedAt: "2026-10-27",
      };

      // Create a synthetic morphology record set
      const syntheticRecords: MorphologyRecord[] = [
        {
          ref: { surah: 2, ayah: 153 },
          wordPosition: 5,
          token: "الصَّلَوٰةِ",
          canonicalArabic: "",
          sourceId: "test",
          root: "صبر",
          lemma: "صَبَرَ",
        },
      ];

      // Build root topic index (this is what happens when a root is published)
      const index = buildRootTopicIndex(sabrEntry, syntheticRecords);

      // Verify the index was built
      expect(index.totalMatches).toBe(1);

      // Verify TOPICS array is unchanged
      const topicsAfter = TOPICS.map((t) => ({
        slug: t.slug,
        relationCount: t.relations.length,
        ayahs: t.relations.map((r) => `${r.ref.surah}:${r.ref.ayah}`).sort(),
      }));

      expect(topicsAfter).toEqual(topicsBefore);
    });

    it("root occurrence index does not add ayat to curated topics", () => {
      // Even if a root occurrence index includes an ayah that is NOT in the
      // curated topic, the curated topic's relation list remains unchanged.
      const patienceTopic = getTopic("patience");
      expect(patienceTopic).toBeDefined();

      const patienceAyahs = new Set(
        patienceTopic!.relations.map((r) => `${r.ref.surah}:${r.ref.ayah}`)
      );

      // Create a morphology record for an ayah NOT in the patience topic
      const nonTopicAyah: MorphologyRecord = {
        ref: { surah: 100, ayah: 1 }, // This ayah is not in patience topic
        wordPosition: 1,
        token: "صَبَرَ",
        canonicalArabic: "",
        sourceId: "test",
        root: "صبر",
        lemma: "صَبَرَ",
      };

      // Create a synthetic entry with populated includedLemmas
      const sabrEntry = {
        slug: "sabr",
        title: "Patience",
        arabicTitle: "الصبر",
        roots: ["صبر"],
        includedLemmas: ["صَبَرَ"],
        reviewState: "approved" as const,
        assertedBy: "test",
        assertedAt: "2026-10-27",
      };

      // Build root index with this record
      const index = buildRootTopicIndex(sabrEntry, [nonTopicAyah]);

      // The root index includes this ayah
      expect(index.uniqueAyahs.length).toBe(1);
      expect(index.uniqueAyahs[0].surah).toBe(100);

      // But the patience topic is unchanged
      const patienceAyahsAfter = new Set(
        patienceTopic!.relations.map((r) => `${r.ref.surah}:${r.ref.ayah}`)
      );
      expect(patienceAyahsAfter).toEqual(patienceAyahs);
      expect(patienceAyahsAfter.has("100:1")).toBe(false);
    });
  });

  describe("Publication policy isolation", () => {
    it("canPublishRootIndex does not mutate entry.reviewState", () => {
      const entry = ROOT_ALLOWLIST.find((e) => e.slug === "sabr");
      expect(entry).toBeDefined();

      const reviewStateBefore = entry!.reviewState;

      // Create a synthetic publication decision
      const decision: PublicationDecision = {
        slug: "sabr",
        root: "صبر",
        decision: "publish",
        reasons: [],
        includedLemmas: ["صَبَرَ", "صَابِر"],
        ambiguityFlags: [],
        incompatibleLemmas: [],
        missingLemmaCount: 0,
        totalWordRecords: 103,
        recordsWithLemma: 103,
        lemmaCoverageRatio: 1.0,
        occurrenceAlignmentStatus: "valid",
        coverageDisclosure: "",
        decidedBy: "automated-policy",
        policyVersion: PUBLICATION_POLICY_VERSION,
      };

      // Check publication eligibility
      const canPublish = canPublishRootIndex(entry!, decision);
      expect(canPublish.canPublish).toBe(true);

      // Build published entry (this substitutes includedLemmas)
      const publishedEntry = buildPublishedIndexEntry(entry!, decision);

      // Verify reviewState is unchanged
      expect(entry!.reviewState).toBe(reviewStateBefore);
      expect(publishedEntry.reviewState).toBe(reviewStateBefore);

      // Only includedLemmas is substituted (sorted by the builder)
      expect(publishedEntry.includedLemmas).toEqual(["صَابِر", "صَبَرَ"]);
    });

    it("buildPublishedIndexEntry creates a new object, does not mutate original", () => {
      const entry = ROOT_ALLOWLIST.find((e) => e.slug === "shukr");
      expect(entry).toBeDefined();

      const originalIncludedLemmas = [...entry!.includedLemmas];

      const decision: PublicationDecision = {
        slug: "shukr",
        root: "شكر",
        decision: "publish",
        reasons: [],
        includedLemmas: ["شَكَرَ"],
        ambiguityFlags: [],
        incompatibleLemmas: [],
        missingLemmaCount: 0,
        totalWordRecords: 75,
        recordsWithLemma: 75,
        lemmaCoverageRatio: 1.0,
        occurrenceAlignmentStatus: "valid",
        coverageDisclosure: "",
        decidedBy: "automated-policy",
        policyVersion: PUBLICATION_POLICY_VERSION,
      };

      const published = buildPublishedIndexEntry(entry!, decision);

      // Original is unchanged
      expect(entry!.includedLemmas).toEqual(originalIncludedLemmas);

      // Published has new lemmas
      expect(published.includedLemmas).toEqual(["شَكَرَ"]);

      // They are different objects
      expect(published).not.toBe(entry);
    });
  });

  describe("Topic root links are navigation-only", () => {
    it("topic→root links have semantics='navigation-only'", () => {
      // The root-links module explicitly marks links as navigation-only.
      // This is a compile-time guarantee via the type system.
      for (const link of TOPIC_ROOT_LINKS) {
        expect(link.semantics).toBe("navigation-only");
        expect(link.note).toBeDefined();
        expect(link.note.length).toBeGreaterThan(0);
      }
    });

    it("topic root links do not assert thematic classification", () => {
      for (const link of TOPIC_ROOT_LINKS) {
        // The note must explicitly state this is not a classification
        expect(link.note).toMatch(/does not assert|not a classification|navigation/i);
      }
    });
  });

  describe("Occurrence index vs curated topic", () => {
    it("buildRootTopicIndex filters by includedLemmas, not by topic membership", () => {
      // The occurrence index filters morphology records by root and lemma.
      // It does not check whether an ayah is in a curated topic.
      const entry = {
        slug: "test-root",
        title: "Test",
        arabicTitle: "اختبار",
        roots: ["صبر"],
        includedLemmas: ["صَبَرَ"],
        reviewState: "approved" as const,
        assertedBy: "test",
        assertedAt: "2026-10-27",
      };

      const records: MorphologyRecord[] = [
        {
          ref: { surah: 2, ayah: 153 }, // In patience topic
          wordPosition: 5,
          token: "صَبَرَ",
          canonicalArabic: "",
          sourceId: "test",
          root: "صبر",
          lemma: "صَبَرَ",
        },
        {
          ref: { surah: 999, ayah: 999 }, // NOT in patience topic
          wordPosition: 1,
          token: "صَبَرَ",
          canonicalArabic: "",
          sourceId: "test",
          root: "صبر",
          lemma: "صَبَرَ",
        },
      ];

      const index = buildRootTopicIndex(entry, records);

      // Both ayat are in the root occurrence index
      expect(index.uniqueAyahs.length).toBe(2);

      // But the patience topic still has only its curated ayat
      const patienceTopic = getTopic("patience");
      expect(patienceTopic!.relations.length).toBe(6);
    });

    it("root publication cannot add ayat to curated topics", () => {
      // This is the key invariant: publishing a root (which builds an
      // occurrence index) does not mutate the curated topic data.
      const patienceTopic = getTopic("patience");
      expect(patienceTopic).toBeDefined();

      const initialRelationCount = patienceTopic!.relations.length;
      const initialAyahs = patienceTopic!.relations
        .map((r) => `${r.ref.surah}:${r.ref.ayah}`)
        .sort();

      // Create a synthetic entry with populated includedLemmas
      const sabrEntry = {
        slug: "sabr",
        title: "Patience",
        arabicTitle: "الصبر",
        roots: ["صبر"],
        includedLemmas: ["صَبَرَ"],
        reviewState: "approved" as const,
        assertedBy: "test",
        assertedAt: "2026-10-27",
      };

      const newAyah: MorphologyRecord = {
        ref: { surah: 500, ayah: 500 },
        wordPosition: 1,
        token: "صَبَرَ",
        canonicalArabic: "",
        sourceId: "test",
        root: "صبر",
        lemma: "صَبَرَ",
      };

      const index = buildRootTopicIndex(sabrEntry, [newAyah]);
      expect(index.uniqueAyahs.length).toBe(1);

      // Patience topic is unchanged
      expect(patienceTopic!.relations.length).toBe(initialRelationCount);
      const finalAyahs = patienceTopic!.relations
        .map((r) => `${r.ref.surah}:${r.ref.ayah}`)
        .sort();
      expect(finalAyahs).toEqual(initialAyahs);
    });
  });

  describe("Type separation", () => {
    it("RootTopicEntry does not have topic-like fields", () => {
      // Root entries are occurrence-index configuration, not topics.
      for (const entry of ROOT_ALLOWLIST) {
        expect(entry).toHaveProperty("slug");
        expect(entry).toHaveProperty("roots");
        expect(entry).toHaveProperty("includedLemmas");
        expect(entry).toHaveProperty("reviewState");

        // These are topic fields that root entries should NOT have
        expect(entry).not.toHaveProperty("summary");
        expect(entry).not.toHaveProperty("related");
        expect(entry).not.toHaveProperty("relations");
        expect(entry).not.toHaveProperty("provenance");
      }
    });

    it("Topic does not have root-index fields", () => {
      // Topics are curated editorial selections, not root indices.
      for (const topic of TOPICS) {
        expect(topic).toHaveProperty("slug");
        expect(topic).toHaveProperty("title");
        expect(topic).toHaveProperty("summary");
        expect(topic).toHaveProperty("relations");
        expect(topic).toHaveProperty("provenance");

        // These are root-index fields that topics should NOT have
        expect(topic).not.toHaveProperty("roots");
        expect(topic).not.toHaveProperty("includedLemmas");
        expect(topic).not.toHaveProperty("reviewState");
      }
    });
  });
});
