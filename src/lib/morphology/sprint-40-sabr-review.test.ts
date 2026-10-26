// Sprint 40 — Sabr root review, alignment verification, and activation policy.
//
// These tests pin the actual data-driven findings of Sprint 40:
//   - Sabr root counts derived from the real morphology index
//   - Three alignment discrepancies verified against word-data
//   - Activation guard still blocks Sabr (no human reviewer yet)
//   - Topic-to-root link exists but is gated until activation
//   - Canonical Arabic text is preserved (tokens appear in ayah text)

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { MorphologyRecord } from "./types";
import {
  ROOT_ALLOWLIST,
  canActivateRootTopic,
} from "./root-allowlist";
import { getTopicRootLinks, getActiveTopicRootLinks } from "./root-links";
import { getSurah } from "@/lib/quran/data";

const INDEX_PATH = join(process.cwd(), "data", "morphology-index.json");

function loadIndex(): MorphologyRecord[] {
  const raw = readFileSync(INDEX_PATH, "utf-8");
  return JSON.parse(raw) as MorphologyRecord[];
}

/** Word-level records only — the index also contains ayah-level markers. */
function wordLevel(records: MorphologyRecord[]): MorphologyRecord[] {
  return records.filter((r) => r.wordPosition !== undefined);
}

describe("Sprint 40 — Sabr root counts (VERIFIED FACT)", () => {
  const sabrWordRecords = () =>
    wordLevel(loadIndex().filter((r) => r.root === "صبر"));

  it("has exactly 103 word-level occurrences of root صبر", () => {
    expect(sabrWordRecords()).toHaveLength(103);
  });

  it("covers exactly 93 distinct ayat", () => {
    const ayat = new Set(
      sabrWordRecords().map((r) => `${r.ref.surah}:${r.ref.ayah}`)
    );
    expect(ayat.size).toBe(93);
  });

  it("has 8 distinct lemmas", () => {
    const lemmas = new Set(
      sabrWordRecords().map((r) => r.lemma).filter((l): l is string => Boolean(l))
    );
    expect(lemmas.size).toBe(8);
  });

  it("top lemma is صَبَرَ with 58 occurrences", () => {
    const counts = new Map<string, number>();
    for (const r of sabrWordRecords()) {
      if (r.lemma) counts.set(r.lemma, (counts.get(r.lemma) ?? 0) + 1);
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    expect(sorted[0]).toEqual(["صَبَرَ", 58]);
  });

  it("every word-level record has a non-empty token", () => {
    for (const r of sabrWordRecords()) {
      expect(r.token).toBeTruthy();
      expect(r.token.length).toBeGreaterThan(0);
    }
  });

  it("every word-level record has a lemma", () => {
    for (const r of sabrWordRecords()) {
      expect(r.lemma).toBeTruthy();
    }
  });

  it("root string is consistently 'صبر' (not 'ص ب ر' with spaces)", () => {
    const roots = new Set(sabrWordRecords().map((r) => r.root));
    expect(roots).toEqual(new Set(["صبر"]));
  });
});

describe("Sprint 40 — alignment discrepancies (VERIFIED FACT)", () => {
  it("13:37:20 resolves to root وقي with token present", () => {
    const data = loadIndex();
    const rec = data.find(
      (r) =>
        r.ref.surah === 13 &&
        r.ref.ayah === 37 &&
        r.wordPosition === 20 &&
        r.root === "وقي"
    );
    expect(rec).toBeDefined();
    expect(rec!.token).not.toBe("");
    expect(rec!.lemma).toBe("وَاق");
  });

  it("8:6:12 resolves to root نظر with token present", () => {
    const data = loadIndex();
    const rec = data.find(
      (r) =>
        r.ref.surah === 8 &&
        r.ref.ayah === 6 &&
        r.wordPosition === 12 &&
        r.root === "نظر"
    );
    expect(rec).toBeDefined();
    expect(rec!.token).not.toBe("");
    // Pinned by code point: the record stores shadda (U+0651) before fatha
    // (U+064E) on the initial nun, which is visually identical to the other
    // combining-mark order but not string-equal.
    expect(rec!.lemma).toBe("\u0646\u0651\u064E\u0638\u064E\u0631\u064E");
  });

  it("2:181:14 resolves to root علم with token present", () => {
    const data = loadIndex();
    const rec = data.find(
      (r) =>
        r.ref.surah === 2 &&
        r.ref.ayah === 181 &&
        r.wordPosition === 14 &&
        r.root === "علم"
    );
    expect(rec).toBeDefined();
    expect(rec!.token).not.toBe("");
    expect(rec!.lemma).toBe("عَلِيم");
  });
});

describe("Sprint 40 — canonical Arabic preservation (VERIFIED FACT)", () => {
  /**
   * Strip Arabic combining marks before comparison.
   *
   * The morphology source and the canonical Quran text disagree on which
   * combining mark represents the same consonant state: word-data writes
   * sukun (U+0652) where the canonical mushaf uses small high meem
   * (U+06E1), and waqf/pause marks differ. These are rendering conventions,
   * not text differences, so the check compares the consonantal skeleton.
   * The literal characters are untouched — this only affects the assertion.
   */
  const skeleton = (s: string) =>
    s.replace(/[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");

  it("every Sabr token's consonantal skeleton appears in its ayah", () => {
    const data = loadIndex();
    const sabr = wordLevel(data.filter((r) => r.root === "صبر"));

    for (const rec of sabr) {
      const surah = getSurah(rec.ref.surah);
      expect(surah).toBeDefined();
      const ayah = surah!.ayat.find((a) => a.ayah === rec.ref.ayah);
      expect(ayah).toBeDefined();
      const firstSegment = rec.token.split(/\s+/)[0];
      expect(skeleton(ayah!.arabic)).toContain(skeleton(firstSegment));
    }
  });

  it("the canonical text itself is never modified by morphology import", () => {
    // Guard against a future "normalization" step editing scripture: the
    // canonical text must still carry its original Uthmani combining marks.
    const surah = getSurah(2);
    const ayah = surah!.ayat.find((a) => a.ayah === 153);
    expect(ayah).toBeDefined();
    expect(ayah!.arabic).toContain("\u06E1"); // small high meem present
  });
});

describe("Sprint 40 — activation policy (HUMAN REVIEW REQUIRED)", () => {
  it("Sabr entry is in ROOT_ALLOWLIST as pending-review", () => {
    const sabr = ROOT_ALLOWLIST.find((e) => e.slug === "sabr");
    expect(sabr).toBeDefined();
    expect(sabr!.reviewState).toBe("pending-review");
    expect(sabr!.includedLemmas).toHaveLength(0);
  });

  it("canActivateRootTopic blocks Sabr (no human reviewer yet)", () => {
    const sabr = ROOT_ALLOWLIST.find((e) => e.slug === "sabr");
    expect(sabr).toBeDefined();
    const result = canActivateRootTopic(sabr!);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("pending-review"))).toBe(true);
    expect(result.reasons.some((r) => r.includes("includedLemmas"))).toBe(true);
  });

  it("a hypothetical approved Sabr entry with lemmas would pass the guard", () => {
    const sabr = ROOT_ALLOWLIST.find((e) => e.slug === "sabr");
    expect(sabr).toBeDefined();
    const hypothetical: typeof sabr = {
      ...sabr!,
      reviewState: "approved",
      includedLemmas: ["صَبَرَ", "صَابِر", "صَبْر"],
      assertedBy: "Hypothetical reviewer (test only)",
      assertedAt: "2026-10-26",
    };
    const result = canActivateRootTopic(hypothetical);
    expect(result.canActivate).toBe(true);
  });
});

describe("Sprint 40 — topic-to-root cross-references", () => {
  it("patience topic has a configured link to the sabr root", () => {
    const links = getTopicRootLinks("patience");
    expect(links).toHaveLength(1);
    expect(links[0].link.rootSlug).toBe("sabr");
    expect(links[0].link.semantics).toBe("navigation-only");
    expect(links[0].link.evidence).toContainEqual({ surah: 2, ayah: 153 });
    expect(links[0].link.evidence).toContainEqual({ surah: 3, ayah: 200 });
  });

  it("the link is NOT active while Sabr is pending-review", () => {
    const active = getActiveTopicRootLinks("patience");
    expect(active).toHaveLength(0);
  });

  it("evidence ayat actually contain the root صبر in the index", () => {
    const data = loadIndex();
    const sabr = wordLevel(data.filter((r) => r.root === "صبر"));
    const sabrAyat = new Set(
      sabr.map((r) => `${r.ref.surah}:${r.ref.ayah}`)
    );
    expect(sabrAyat.has("2:153")).toBe(true);
    expect(sabrAyat.has("3:200")).toBe(true);
  });

  it("no other topic has a root link configured yet", () => {
    for (const slug of [
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
    ]) {
      expect(getTopicRootLinks(slug)).toHaveLength(0);
    }
  });
});

describe("Sprint 40 — root-data word-level filter (bug fix)", () => {
  it("getRootOccurrences returns only word-level records (no ayah-level markers)", async () => {
    const { getRootOccurrences } = await import("./root-data");
    const occs = getRootOccurrences("صبر");
    // Every returned record must have a wordPosition.
    for (const r of occs) {
      expect(r.wordPosition).toBeDefined();
    }
    // And the count must be 103, not 206.
    expect(occs).toHaveLength(103);
  });

  it("getRootStats reports 103 occurrences, not 206", async () => {
    const { getRootStats } = await import("./root-data");
    const stats = getRootStats("صبر");
    expect(stats.totalOccurrences).toBe(103);
    expect(stats.distinctAyat).toBe(93);
  });
});
