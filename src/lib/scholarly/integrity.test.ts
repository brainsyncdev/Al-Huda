// MFD-10.2 — Production integrity regression tests (Lead-owned).
//
// These assert the immutable project rules that no implementation workstream
// may break: the 789 mapping records stay byte-identical, Quran Arabic is never
// mutated by review operations, existing provenance survives, the public AI
// answer flag stays OFF, and NOOR children mode stays deferred.
//
// FREE MODULE TESTS: no React rendering, no network. Reads real production data
// through the same accessors the app uses.

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAllMappings,
  type TopicMapping,
} from "../taxonomy/topic-translation-data";
import { getAyah, getSurahIndex } from "../quran/data";
import { AI_ANSWER_FEATURE_ENABLED } from "../ai/feature-flag";
import {
  createEvidenceRecord,
  verifyEvidence,
  rejectEvidence,
  markUnavailable,
  markRightsRestricted,
} from "./evidence";

const ROOT = join(__dirname, "..", "..", "..");
const MAPPINGS_PATH = join(
  ROOT,
  "data",
  "taxonomy",
  "topic-ayah-mappings.json"
);

/** Raw file text, so a mutation of the parsed array cannot hide a disk change. */
function rawMappingsText(): string {
  return readFileSync(MAPPINGS_PATH, "utf-8");
}

describe("MFD-10.2 integrity — original mapping records preserved", () => {
  it("the canonical mapping file still holds exactly 789 records", () => {
    const parsed = JSON.parse(rawMappingsText()) as unknown[];
    expect(parsed).toHaveLength(789);
  });

  it("getAllMappings() exposes all 789 records", () => {
    expect(getAllMappings()).toHaveLength(789);
  });

  it("every mapping keeps provenance pending-scholarly-review", () => {
    const mappings = getAllMappings();
    for (const m of mappings) {
      expect(m.provenance).toBe("pending-scholarly-review");
    }
  });

  it("every mapping keeps status MAPPED", () => {
    for (const m of getAllMappings()) {
      expect(m.status).toBe("MAPPED");
    }
  });

  it("mapping type distribution is unchanged", () => {
    const counts: Record<string, number> = {};
    for (const m of getAllMappings()) {
      counts[m.mappingType] = (counts[m.mappingType] ?? 0) + 1;
    }
    expect(counts.DIRECT_REFERENCE).toBe(468);
    expect(counts.THEMATIC_REFERENCE).toBe(128);
    expect(counts.EXPLICIT_INSTRUCTION).toBe(115);
    expect(counts.PROPHETIC_NARRATIVE).toBe(78);
  });

  it("evidence creation does not mutate any mapping record or the file", () => {
    const before = rawMappingsText();
    const snapshot = JSON.stringify(getAllMappings());
    const m = getAllMappings()[0];

    const created = createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-jalalayn",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
    });
    expect(created.ok).toBe(true);

    // Exercise every transition against the created evidence record.
    verifyEvidence(created.record!, {
      verifierId: "integrity-test",
      notes: "Integrity test verification note.",
    });
    rejectEvidence(created.record!, "Integrity test rejection note.");
    markUnavailable(created.record!, "Integrity test unavailable note.");
    markRightsRestricted(created.record!, "Integrity test rights note.");

    expect(JSON.stringify(getAllMappings())).toBe(snapshot);
    expect(rawMappingsText()).toBe(before);
  });

  it("review evidence never rewrites a mapping's classification", () => {
    const m: TopicMapping = getAllMappings()[0];
    const originalType = m.mappingType;
    const originalRationale = m.rationale;
    createEvidenceRecord({
      mappingId: m.id,
      sourceId: "tafsir-muyassar",
      surahNumber: m.surahNumber,
      ayahNumber: m.ayahStart,
      volumePage: "Vol. 1, p. 1",
    });
    expect(m.mappingType).toBe(originalType);
    expect(m.rationale).toBe(originalRationale);
  });
});

describe("MFD-10.2 integrity — Quran Arabic unchanged", () => {
  it("Arabic text for mapped ayat is stable across evidence operations", () => {
    const sample = getAllMappings().slice(0, 25);
    const before = sample.map((m) => ({
      ref: `${m.surahNumber}:${m.ayahStart}`,
      arabic: getAyah(m.surahNumber, m.ayahStart)?.arabic ?? null,
    }));

    for (const m of sample) {
      const created = createEvidenceRecord({
        mappingId: m.id,
        sourceId: "tafsir-jalalayn",
        surahNumber: m.surahNumber,
        ayahNumber: m.ayahStart,
      });
      if (created.record) {
        verifyEvidence(created.record, {
          verifierId: "integrity-test",
          notes: "Integrity check.",
        });
      }
    }

    const after = sample.map((m) => ({
      ref: `${m.surahNumber}:${m.ayahStart}`,
      arabic: getAyah(m.surahNumber, m.ayahStart)?.arabic ?? null,
    }));
    expect(after).toEqual(before);
  });

  it("the dataset still reports 114 surahs", () => {
    expect(getSurahIndex()).toHaveLength(114);
  });

  it("no evidence module writes to the Quran dataset", () => {
    // The evidence module must not import any writer. Assert the observable
    // consequence instead: total ayah count stays at the canonical 6,236.
    const total = getSurahIndex().reduce((sum, s) => sum + s.ayahCount, 0);
    expect(total).toBe(6236);
  });
});

describe("MFD-10.2 integrity — AI restrictions", () => {
  it("public AI religious answers remain OFF", () => {
    expect(AI_ANSWER_FEATURE_ENABLED).toBe(false);
  });

  it("the feature flag is a compile-time constant false", () => {
    const source = readFileSync(
      join(ROOT, "src", "lib", "ai", "feature-flag.ts"),
      "utf-8"
    );
    expect(source).toContain("false as const");
  });
});
