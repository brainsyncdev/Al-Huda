// Content-integrity tests for HAND-CURATED ayah references.
//
// The other four suites validate the dataset and the algorithms. Nothing here
// validates the *editorial* data: the 56 topic relations in lib/topics/data.ts
// and the 24 verse-of-the-day refs in lib/quran/verse-of-day.ts are typed by
// hand, and both are consumed by code that skips unresolvable refs silently:
//
//   topics/[slug]/page.tsx  ->  if (!verse || !surah) return null
//   verse-of-day.ts         ->  if (!verse) return null
//
// So a transposed rel(ayah, surah) argument or an off-by-one ayah number that
// lands outside its surah's real verse count does not throw, does not fail a
// build, and does not show an error — it just quietly removes a verse, while
// /topics still advertises relations.length. That is an overstatement of
// editorial content, which the PRD treats as a hard rule (no fabricated or
// unsupported citations).
//
// These tests pin every curated ref to a real ayah in the PINNED dataset, so
// the guard runs on every `pnpm test` instead of depending on someone
// re-cross-checking counts by hand.
//
// Runs in Node (see vitest.config.ts) against the same vendored files the app
// reads — never a fixture.

import { describe, expect, it } from "vitest";
import { getAyah, getSurah, getSurahIndex } from "./data";
import { getVerseOfDay } from "./verse-of-day";
import {
  RELATION_TYPE_LABELS,
  TOPICS,
  getTopic,
  topicsForAyah,
  type RelationType,
} from "../topics/data";

const VALID_RELATION_TYPES = Object.keys(RELATION_TYPE_LABELS) as RelationType[];
const VALID_REVIEW_STATUSES = ["pending-scholarly-review", "editorial-approved"];

/** surah -> real verse count, from the loaded index (not from memory). */
const AYAH_COUNTS = new Map<number, number>(
  getSurahIndex().map((s) => [s.id, s.ayahCount])
);

function describeRef(surah: number, ayah: number): string {
  return `${surah}:${ayah} (surah ${surah} has ${AYAH_COUNTS.get(surah) ?? "?"} ayat)`;
}

describe("curated topic references resolve against the pinned dataset", () => {
  it("every relation in every topic points at a real ayah", () => {
    const broken: string[] = [];

    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        const verse = getAyah(relation.ref.surah, relation.ref.ayah);
        if (!verse) {
          broken.push(
            `${topic.slug} -> ${describeRef(relation.ref.surah, relation.ref.ayah)}`
          );
          continue;
        }
        // A ref that resolves to a DIFFERENT ayah means the args were
        // transposed somewhere upstream; catch it here rather than rendering
        // the wrong verse under the right label.
        if (verse.surah !== relation.ref.surah || verse.ayah !== relation.ref.ayah) {
          broken.push(
            `${topic.slug} -> requested ${relation.ref.surah}:${relation.ref.ayah}, got ${verse.surah}:${verse.ayah}`
          );
        }
      }
    }

    expect(broken).toEqual([]);
  });

  it("every relation's surah metadata loads (topic pages need both)", () => {
    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        expect(getSurah(relation.ref.surah)).not.toBeNull();
      }
    }
  });

  it("curated refs are non-exhaustive but substantial: 11 topics, >= 4 verses each", () => {
      expect(TOPICS).toHaveLength(11);
      for (const topic of TOPICS) {
        expect(topic.relations.length).toBeGreaterThanOrEqual(4);
      }
      // Pinned so that silently deleting a relation is visible. 56 was counted
      // from the source (every `ref: rel(` line in lib/topics/data.ts), not
      // derived from memory.
      const total = TOPICS.reduce((n, t) => n + t.relations.length, 0);
      expect(total).toBe(56);
    });
  
    it("no topic lists the same ayah twice", () => {
      // 2:152 legitimately appears in two different topics; repeating it inside
      // one topic would double-render the same verse under one heading.
      for (const topic of TOPICS) {
        const refs = topic.relations.map((r) => `${r.ref.surah}:${r.ref.ayah}`);
        expect(new Set(refs).size).toBe(refs.length);
      }
    });

  it("every ayah carries non-empty Arabic and translation", () => {
    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        const verse = getAyah(relation.ref.surah, relation.ref.ayah);
        expect(verse).not.toBeNull();
        expect(verse!.arabic.trim().length).toBeGreaterThan(0);
        expect(verse!.translation.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("topic structure and provenance (PRD editorial-integrity rules)", () => {
  it("slugs are unique and every topic is reachable by slug", () => {
    const slugs = new Set(TOPICS.map((t) => t.slug));
    expect(slugs.size).toBe(TOPICS.length);
    for (const topic of TOPICS) {
      expect(getTopic(topic.slug)?.slug).toBe(topic.slug);
    }
    expect(getTopic("no-such-topic")).toBeUndefined();
  });

  it("titles, arabic titles, and summaries are present", () => {
    for (const topic of TOPICS) {
      expect(topic.title.trim().length).toBeGreaterThan(0);
      expect(topic.arabicTitle.trim().length).toBeGreaterThan(0);
      expect(topic.summary.trim().length).toBeGreaterThan(0);
    }
  });

  it("every relation type is a labelled type (no generic \"related\")", () => {
    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        expect(VALID_RELATION_TYPES).toContain(relation.type);
        expect(RELATION_TYPE_LABELS[relation.type].trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every relation has a non-empty rationale", () => {
    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        expect(relation.rationale.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("provenance is recorded and status is one of the allowed values", () => {
    for (const topic of TOPICS) {
      const p = topic.provenance;
      expect(p.method.trim().length).toBeGreaterThan(0);
      expect(p.curator.trim().length).toBeGreaterThan(0);
      expect(VALID_REVIEW_STATUSES).toContain(p.status);
      expect(Number.isNaN(Date.parse(p.reviewedAt))).toBe(false);
    }
  });

  it("seeded selections are marked pending scholarly review", () => {
    // The PRD forbids presenting unreviewed editorial content as authoritative.
    // Every shipped topic is an editorial seed, so all must be pending.
    for (const topic of TOPICS) {
      expect(topic.provenance.status).toBe("pending-scholarly-review");
    }
  });

  it("every `related` slug points at a real topic", () => {
    const dangling: string[] = [];
    for (const topic of TOPICS) {
      for (const slug of topic.related) {
        if (!getTopic(slug)) dangling.push(`${topic.slug} -> ${slug}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  it("no topic lists itself as related", () => {
    for (const topic of TOPICS) {
      expect(topic.related).not.toContain(topic.slug);
    }
  });
});

describe("topicsForAyah is the exact inverse of the relation lists", () => {
  it("every curated relation is returned by the reverse lookup", () => {
    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        const found = topicsForAyah(relation.ref);
        expect(found.map((t) => t.slug)).toContain(topic.slug);
      }
    }
  });

  it("nothing extra: every topic returned actually lists that ayah", () => {
    for (const topic of TOPICS) {
      for (const relation of topic.relations) {
        for (const returned of topicsForAyah(relation.ref)) {
          expect(
            returned.relations.some(
              (r) =>
                r.ref.surah === relation.ref.surah &&
                r.ref.ayah === relation.ref.ayah
            )
          ).toBe(true);
        }
      }
    }
  });

  it("an ayah in no topic returns an empty list", () => {
    // 1:2 (Al-Fatihah verse 2) appears in no curated selection.
    expect(topicsForAyah({ surah: 1, ayah: 2 })).toEqual([]);
  });

  it("an invalid reference returns an empty list rather than throwing", () => {
    expect(topicsForAyah({ surah: 999, ayah: 1 })).toEqual([]);
    expect(topicsForAyah({ surah: 2, ayah: 999 })).toEqual([]);
  });
});

describe("verse-of-the-day curated references", () => {
  it("every curated ref resolves to a real ayah", () => {
    // Probed through the public API across a full leap year, which exercises
    // all 24 entries (366 % 24 leaves no entry unvisited).
    const seen = new Set<string>();
    const broken: string[] = [];

    for (let day = 0; day < 366; day++) {
      const date = new Date(Date.UTC(2024, 0, 1 + day));
      const result = getVerseOfDay(date);
      if (!result) {
        broken.push(`no verse for 2024-01-${String(1 + day).padStart(2, "0")}`);
        continue;
      }
      seen.add(`${result.surah}:${result.ayah}`);
      expect(result.verse.surah).toBe(result.surah);
      expect(result.verse.ayah).toBe(result.ayah);
    }

    expect(broken).toEqual([]);
    expect(seen.size).toBe(24);
  });

  it("is deterministic: the same day always yields the same verse", () => {
    const a = getVerseOfDay(new Date(Date.UTC(2026, 9, 19)));
    const b = getVerseOfDay(new Date(Date.UTC(2026, 9, 19)));
    expect(a).not.toBeNull();
    expect(`${a!.surah}:${a!.ayah}`).toBe(`${b!.surah}:${b!.ayah}`);
  });

  it("returns text byte-identical to the loader (verbatim integrity)", () => {
    const result = getVerseOfDay(new Date(Date.UTC(2026, 9, 19)));
    expect(result).not.toBeNull();
    const stored = getAyah(result!.surah, result!.ayah);
    expect(stored).not.toBeNull();
    expect(result!.verse.arabic).toBe(stored!.arabic);
    expect(result!.verse.translation).toBe(stored!.translation);
  });

  it("reports the surah's real transliteration and Arabic name", () => {
    const result = getVerseOfDay(new Date(Date.UTC(2026, 9, 19)));
    expect(result).not.toBeNull();
    const surah = getSurah(result!.surah);
    expect(surah).not.toBeNull();
    expect(result!.surahTransliteration).toBe(surah!.transliteration);
    expect(result!.surahArabicName).toBe(surah!.arabicName);
  });

  it("never falls back to a synthetic label for a valid ref", () => {
    // getVerseOfDay uses `?? Surah ${n}` only if the index lookup misses.
    // For every ref that resolves, the real name must be present.
    for (let day = 0; day < 366; day++) {
      const result = getVerseOfDay(new Date(Date.UTC(2024, 0, 1 + day)));
      if (!result) continue;
      expect(result.surahTransliteration).not.toMatch(/^Surah \d+$/);
      expect(result.surahArabicName.length).toBeGreaterThan(0);
    }
  });
});

describe("semantic anchors (a ref shifted to another valid ayah is still caught)", () => {
  // Resolution alone cannot detect rel(153, 2) becoming rel(135, 2): both
  // exist. These pins tie a handful of selections to the relation type and
  // theme actually intended, so accidental edits surface as failures.

  it("patience is anchored on 2:153 as a lexical match", () => {
    const patience = getTopic("patience")!;
    const anchor = patience.relations.find(
      (r) => r.ref.surah === 2 && r.ref.ayah === 153
    );
    expect(anchor).toBeDefined();
    expect(anchor!.type).toBe("LEXICAL_MATCH");
    // Saheeh International 2:153 mentions patience explicitly.
    expect(
      getAyah(2, 153)!.translation.toLowerCase()
    ).toContain("patience");
  });

  it("hardship-and-ease is anchored on Ash-Sharh 94:5 and Al-Baqarah 2:286", () => {
    const topic = getTopic("hardship-and-ease")!;
    const refs = topic.relations.map((r) => `${r.ref.surah}:${r.ref.ayah}`);
    expect(refs).toContain("94:5");
    expect(refs).toContain("2:286");
  });

  it("the-hereafter is anchored on Az-Zalzalah 99:7-8 as a sequential pair", () => {
    const topic = getTopic("the-hereafter")!;
    const good = topic.relations.find((r) => r.ref.ayah === 7 && r.ref.surah === 99);
    const evil = topic.relations.find((r) => r.ref.ayah === 8 && r.ref.surah === 99);
    expect(good!.type).toBe("LEXICAL_MATCH");
    expect(evil!.type).toBe("SEQUENTIAL_CONTEXT");
  });

  it("knowledge-and-reflection opens on the first revealed passage, 96:1", () => {
    const topic = getTopic("knowledge-and-reflection")!;
    const anchor = topic.relations.find(
      (r) => r.ref.surah === 96 && r.ref.ayah === 1
    );
    expect(anchor).toBeDefined();
    expect(anchor!.type).toBe("LEXICAL_MATCH");
  });

  it("trust-in-god is anchored on At-Talaq 65:3", () => {
    const topic = getTopic("trust-in-god")!;
    const anchor = topic.relations.find(
      (r) => r.ref.surah === 65 && r.ref.ayah === 3
    );
    expect(anchor).toBeDefined();
    expect(anchor!.type).toBe("LEXICAL_MATCH");
  });

  it("a verse appearing in two topics is intentional, not duplicated by accident", () => {
    // 2:152 is listed under both gratitude and remembrance by design.
    const topics = topicsForAyah({ surah: 2, ayah: 152 }).map((t) => t.slug);
    expect(topics.sort()).toEqual(["gratitude", "remembrance"]);
  });
});
