// Sprint 41 — automated root review and publishing pipeline.
//
// These tests pin the properties the mission actually requires:
//   - deterministic, idempotent batch output
//   - validation separated from review and from publication eligibility
//   - AI output validated against the data, never trusted on its own
//   - documented ambiguity and alignment failures block publication
//   - no fabricated reviewer identities or scholarly approvals
//   - canonical Quran text is never modified
//   - dry-run writes nothing; live reruns are byte-identical
//
// The real-data assertions run against the committed morphology index and the
// committed publication file, so they also guard those artifacts against drift.

import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";
import { ROOT_ALLOWLIST } from "./root-allowlist";
import {
  computeSourceFingerprint,
  extractRootRecords,
  validateRootRecords,
  computeLemmaDistribution,
  reviewRoot,
  runBatchReview,
  PIPELINE_VERSION,
} from "./review-pipeline";
import {
  reviewLemmasDeterministic,
  reviewLemmasWithModel,
  type AiLemmaReviewResult,
} from "./ai-lemma-reviewer";
import {
  decidePublication,
  findIncompatibleLemmas,
  normalizeLetters,
  DOCUMENTED_AMBIGUITY,
  PUBLICATION_POLICY_VERSION,
} from "./publication-policy";
import {
  canPublishRootIndex,
  buildPublishedIndexEntry,
} from "./publication-status";
import { buildRootTopicIndex } from "./occurrence-index";
import { getSurah } from "@/lib/quran/data";
import { runCli } from "../../../scripts/review-roots";

const INDEX_PATH = join(process.cwd(), "data", "morphology-index.json");
const PUBLICATIONS_PATH = join(process.cwd(), "data", "root-publications.json");

let cachedIndex: MorphologyRecord[] | null = null;

function indexRecords(): MorphologyRecord[] {
  if (cachedIndex) return cachedIndex;
  const parsed: MorphologyRecord[] = JSON.parse(
    readFileSync(INDEX_PATH, "utf-8")
  );
  cachedIndex = parsed;
  return parsed;
}

function makeEntry(
  overrides: Partial<RootTopicEntry> & { slug: string; roots: string[] }
): RootTopicEntry {
  return {
    title: "Test",
    arabicTitle: "اختبار",
    includedLemmas: [],
    reviewState: "pending-review",
    assertedBy: "test fixture",
    assertedAt: "2026-10-26",
    ...overrides,
  };
}

function rec(
  surah: number,
  ayah: number,
  wordPosition: number,
  token: string,
  root: string,
  lemma?: string
): MorphologyRecord {
  return {
    ref: { surah, ayah },
    wordPosition,
    token,
    canonicalArabic: "",
    root,
    lemma,
    sourceId: "test",
  };
}

function aiResult(
  lemmas: string[],
  overrides: Partial<AiLemmaReviewResult> = {}
): AiLemmaReviewResult {
  return {
    recommendedLemmas: lemmas,
    selectionMode: "full-set",
    rationale: "fixture",
    evidence: [],
    reviewer: "deterministic-fallback",
    warnings: [],
    selectionRequired: false,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Source fingerprint and determinism
// ---------------------------------------------------------------------------

describe("pipeline determinism", () => {
  it("computes a 64-character hex SHA-256 fingerprint of the source index", () => {
    const fingerprint = computeSourceFingerprint(INDEX_PATH);
    expect(fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  it("returns 'missing' for an absent index rather than throwing", () => {
    expect(computeSourceFingerprint(join(tmpdir(), "does-not-exist.json"))).toBe(
      "missing"
    );
  });

  it("produces identical output on two consecutive runs", () => {
    const first = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    const second = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });

  it("carries no wall-clock timestamp that would break reproducibility", () => {
    const report = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    expect(Object.keys(report)).not.toContain("generatedAt");
    expect(JSON.stringify(report)).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  });

  it("matches the committed publication decisions exactly", () => {
    const report = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    const committed = JSON.parse(readFileSync(PUBLICATIONS_PATH, "utf-8"));
    expect(report.decisions).toEqual(committed);
  });

  it("records the pipeline and policy versions", () => {
    const report = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    expect(report.pipelineVersion).toBe(PIPELINE_VERSION);
    expect(report.sourceDatasetId).toBe("qul-morphology-v1");
    for (const decision of report.decisions) {
      expect(decision.policyVersion).toBe(PUBLICATION_POLICY_VERSION);
    }
  });
});

// ---------------------------------------------------------------------------
// Record extraction and structural validation
// ---------------------------------------------------------------------------

describe("record extraction", () => {
  it("excludes ayah-level markers and sorts by surah, ayah, word position", () => {
    const records: MorphologyRecord[] = [
      rec(3, 200, 2, "ب", "صبر"),
      { ref: { surah: 2, ayah: 1 }, token: "", canonicalArabic: "", root: "صبر", sourceId: "t" },
      rec(2, 153, 5, "ا", "صبر"),
    ];
    const extracted = extractRootRecords(records, "صبر");
    expect(extracted).toHaveLength(2);
    expect(extracted.map((r) => `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition}`)).toEqual([
      "2:153:5",
      "3:200:2",
    ]);
  });
});

describe("structural validation", () => {
  it("flags a missing lemma as an error", () => {
    const issues = validateRootRecords([rec(1, 1, 1, "ا", "صبر", "")], "صبر");
    const issue = issues.find((i) => i.code === "missing-lemma");
    expect(issue?.severity).toBe("error");
  });

  it("flags a missing token as a warning only", () => {
    const issues = validateRootRecords([rec(1, 1, 1, "", "صبر", "صبر")], "صبر");
    const issue = issues.find((i) => i.code === "missing-token");
    expect(issue?.severity).toBe("warning");
    expect(issues.find((i) => i.code === "missing-lemma")).toBeUndefined();
  });

  it("flags duplicate word positions as an error", () => {
    const issues = validateRootRecords(
      [rec(1, 1, 1, "ا", "صبر", "صبر"), rec(1, 1, 1, "ب", "صبر", "صبر")],
      "صبر"
    );
    const issue = issues.find((i) => i.code === "duplicate-position");
    expect(issue?.severity).toBe("error");
  });

  it("flags a lemma whose consonants cannot derive from the root", () => {
    const issues = validateRootRecords([rec(1, 1, 1, "كان", "غفر", "كَانَ")], "غفر");
    expect(issues.some((i) => i.code === "incompatible-lemma")).toBe(true);
  });

  it("accepts legitimate weak-letter derivations", () => {
    const records = [rec(1, 1, 1, "صابر", "صبر", "صَابِر")];
    expect(findIncompatibleLemmas(records, "صبر")).toEqual([]);
  });

  it("normalizes hamza and ta-marbuta for comparison only", () => {
    expect(normalizeLetters("أَكْبَر")).toEqual(["ا", "ك", "ب", "ر"]);
    expect(normalizeLetters("رَحْمَة")).toEqual(["ر", "ح", "م", "ه"]);
  });
});

// ---------------------------------------------------------------------------
// AI reviewer (deterministic fallback)
// ---------------------------------------------------------------------------

describe("deterministic lemma reviewer", () => {
  const entry = makeEntry({ slug: "sabr", roots: ["صبر"] });

  it("recommends the complete validated set and labels itself as a fallback", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر"), rec(3, 200, 1, "صابر", "صبر", "صابر")];
    const distribution = computeLemmaDistribution(records);
    const result = reviewLemmasDeterministic(entry, records, distribution);

    expect(result.selectionMode).toBe("full-set");
    expect(result.reviewer).toBe("deterministic-fallback");
    expect(result.selectionRequired).toBe(false);
    expect(result.recommendedLemmas.sort()).toEqual(["صابر", "صبر"]);
    expect(result.rationale).toMatch(/structural validation only/i);
  });

  it("refuses to recommend anything when records lack lemmas", () => {
    const records = [rec(1, 1, 1, "ا", "صبر", ""), rec(1, 2, 1, "ب", "صبر", "صبر")];
    const result = reviewLemmasDeterministic(
      entry,
      records,
      computeLemmaDistribution(records)
    );
    expect(result.selectionRequired).toBe(true);
    expect(result.recommendedLemmas).toEqual([]);
  });

  it("refuses to recommend anything when positions collide", () => {
    const records = [rec(1, 1, 1, "ا", "صبر", "صبر"), rec(1, 1, 1, "ب", "صبر", "صبر")];
    const result = reviewLemmasDeterministic(
      entry,
      records,
      computeLemmaDistribution(records)
    );
    expect(result.selectionRequired).toBe(true);
  });

  it("does not claim scholarly or infallible authority", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const result = reviewLemmasDeterministic(
      entry,
      records,
      computeLemmaDistribution(records)
    );
    expect(result.rationale.toLowerCase()).not.toMatch(/scholar|approved by|infallible/);
  });

  it("has no model provider wired and throws instead of fabricating one", async () => {
    await expect(
      reviewLemmasWithModel(
        entry,
        [rec(2, 153, 1, "صبر", "صبر", "صبر")],
        [{ lemma: "صبر", count: 1 }],
        "any-model"
      )
    ).rejects.toThrow(/not implemented/i);
  });
});

// ---------------------------------------------------------------------------
// Publication policy
// ---------------------------------------------------------------------------

describe("publication policy", () => {
  const entry = makeEntry({ slug: "sabr", roots: ["صبر"] });

  it("withholds a root with no word-level records as needs-review", () => {
    const decision = decidePublication(entry, [], [], aiResult([]));
    expect(decision.decision).toBe("needs-review");
    expect(decision.includedLemmas).toEqual([]);
  });

  it("publishes only when review and data agree on the full observed set", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر"), rec(3, 200, 1, "صابر", "صبر", "صابر")];
    const decision = decidePublication(
      entry,
      records,
      [],
      aiResult(["صابر", "صبر"])
    );
    expect(decision.decision).toBe("publish");
    expect(decision.includedLemmas).toEqual(["صابر", "صبر"]);
    expect(decision.decidedBy).toBe("automated-policy");
  });

  it("withholds when the review recommends a lemma absent from the data", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const decision = decidePublication(entry, records, [], aiResult(["صبر", "زzz"]));
    expect(decision.decision).toBe("withhold");
    expect(decision.includedLemmas).toEqual([]);
  });

  it("withholds when a full-set claim omits observed lemmas", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر"), rec(3, 200, 1, "صابر", "صبر", "صابر")];
    const decision = decidePublication(entry, records, [], aiResult(["صبر"]));
    expect(decision.decision).toBe("withhold");
    expect(decision.reasons[0]).toMatch(/full-set/);
  });

  it("withholds when the review recommends nothing despite data", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const decision = decidePublication(entry, records, [], aiResult([]));
    expect(decision.decision).toBe("withhold");
  });

  it("blocks publication when the review could not resolve a selection", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const decision = decidePublication(
      entry,
      records,
      [],
      aiResult([], { selectionRequired: true, warnings: ["missing lemma"] })
    );
    expect(decision.decision).toBe("needs-review");
    expect(decision.reasons.join(" ")).toMatch(/missing lemma/);
  });

  it("blocks publication when a semantic subset is not supported", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const decision = decidePublication(
      entry,
      records,
      [],
      aiResult(["صبر"], { selectionMode: "semantic-subset", semanticConfidence: "uncertain" })
    );
    expect(decision.decision).toBe("needs-review");
  });

  it("blocks publication on documented ambiguity and records the evidence", () => {
    const ambiguous = DOCUMENTED_AMBIGUITY["صدق"];
    const records = [rec(2, 3, 1, "صدقة", "صدق", ambiguous.lemmas[0])];
    const decision = decidePublication(
      makeEntry({ slug: "sidq", roots: ["صدق"] }),
      records,
      [],
      aiResult([ambiguous.lemmas[0]])
    );
    expect(decision.decision).toBe("needs-review");
    expect(decision.ambiguityFlags).toHaveLength(1);
    expect(decision.includedLemmas).toEqual([]);
  });

  it("blocks publication on an incompatible lemma mapping", () => {
    const records = [rec(1, 1, 1, "كان", "غفر", "كَانَ")];
    const decision = decidePublication(
      makeEntry({ slug: "maghfirah", roots: ["غفر"] }),
      records,
      [],
      aiResult(["كَانَ"])
    );
    expect(decision.decision).toBe("needs-review");
    expect(decision.incompatibleLemmas).toHaveLength(1);
  });

  it("blocks publication on error-severity validation issues", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const decision = decidePublication(
      entry,
      records,
      [{ code: "missing-lemma", message: "1 record has a missing lemma", severity: "error", affectedRecords: [] }],
      aiResult(["صبر"])
    );
    expect(decision.decision).toBe("needs-review");
  });

  it("never attributes a decision to a human or scholarly identity", () => {
    const records = [rec(2, 153, 1, "صبر", "صبر", "صبر")];
    const decision = decidePublication(entry, records, [], aiResult(["صبر"]));
    expect(decision.decidedBy).toBe("automated-policy");
    expect(JSON.stringify(decision)).not.toMatch(/scholar|reviewer name|approved by/i);
  });
});

// ---------------------------------------------------------------------------
// Publication status gate (UI side)
// ---------------------------------------------------------------------------

describe("publication status gate", () => {
  const entry = makeEntry({ slug: "sabr", roots: ["صبر"] });
  const decision = decidePublication(
    entry,
    [rec(2, 153, 1, "صبر", "صبر", "صبر")],
    [],
    aiResult(["صبر"])
  );

  it("accepts a current, matching publish decision", () => {
    expect(canPublishRootIndex(entry, decision).canPublish).toBe(true);
  });

  it("fails closed when no decision exists", () => {
    const gate = canPublishRootIndex(entry, null);
    expect(gate.canPublish).toBe(false);
    expect(gate.reasons[0]).toMatch(/No automated review decision/);
  });

  it("fails closed when the decision used a different policy version", () => {
    const stale = { ...decision, policyVersion: "0.9.0" };
    const gate = canPublishRootIndex(entry, stale);
    expect(gate.canPublish).toBe(false);
    expect(gate.reasons.join(" ")).toMatch(/Re-run the review pipeline/);
  });

  it("fails closed on a slug or root mismatch", () => {
    expect(canPublishRootIndex(entry, { ...decision, slug: "shukr" }).canPublish).toBe(false);
    expect(canPublishRootIndex(entry, { ...decision, root: "شكر" }).canPublish).toBe(false);
  });

  it("fails closed on a non-publish decision", () => {
    expect(
      canPublishRootIndex(entry, { ...decision, decision: "needs-review" }).canPublish
    ).toBe(false);
  });

  it("substitutes lemmas without touching reviewState", () => {
    const published = buildPublishedIndexEntry(entry, decision);
    expect(published.includedLemmas).toEqual(["صبر"]);
    expect(published.reviewState).toBe(entry.reviewState);
    expect(published.reviewState).not.toBe("approved");
  });

  it("makes the published lemmas actually produce occurrences", () => {
    const published = buildPublishedIndexEntry(entry, decision);
    const index = buildRootTopicIndex(published, [rec(2, 153, 1, "صبر", "صبر", "صبر")]);
    expect(index.totalMatches).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Real data integration
// ---------------------------------------------------------------------------

describe("real morphology data", () => {
  const records = indexRecords();
  const entryFor = (slug: string): RootTopicEntry => {
    const entry = ROOT_ALLOWLIST.find((e) => e.slug === slug);
    if (!entry) throw new Error(`missing allowlist entry ${slug}`);
    return entry;
  };

  it("publishes sabr with its full attested lemma set", () => {
    const result = reviewRoot(entryFor("sabr"), records, "test");
    expect(result.publication.decision).toBe("publish");
    expect(result.totalOccurrences).toBe(103);
    expect(result.distinctAyat).toBe(93);
    expect(result.publication.includedLemmas).toHaveLength(result.lemmaCount);
  });

  it("keeps ilm in needs-review because a documented ambiguity is present", () => {
    const result = reviewRoot(entryFor("ilm"), records, "test");
    expect(result.publication.decision).toBe("needs-review");
    expect(result.publication.ambiguityFlags.length).toBeGreaterThan(0);
  });

  it("keeps roots with missing lemmas out of publication", () => {
    for (const slug of ["ilm", "maghfirah", "kibr"]) {
      const result = reviewRoot(entryFor(slug), records, "test");
      expect(result.publication.decision).toBe("needs-review");
      expect(result.publication.includedLemmas).toEqual([]);
    }
  });

  it("publishes nothing that carries an ambiguity flag or incompatible lemma", () => {
    const report = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    for (const decision of report.decisions.filter((d) => d.decision === "publish")) {
      expect(decision.ambiguityFlags).toEqual([]);
      expect(decision.incompatibleLemmas).toEqual([]);
      expect(decision.includedLemmas.length).toBeGreaterThan(0);
    }
  });

  it("recommends only lemmas that are actually observed", () => {
    const report = runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    for (const result of report.results.filter((r) => r.publication.decision === "publish")) {
      const observed = new Set(result.lemmaDistribution.map((l) => l.lemma));
      for (const lemma of result.publication.includedLemmas) {
        expect(observed.has(lemma)).toBe(true);
      }
    }
  });

  it("does not modify the morphology source while reviewing", () => {
    const before = computeSourceFingerprint(INDEX_PATH);
    runBatchReview(ROOT_ALLOWLIST, INDEX_PATH);
    expect(computeSourceFingerprint(INDEX_PATH)).toBe(before);
  });

  it("leaves canonical Quran text untouched", () => {
    // 2:153 is in the sabr publication set. The canonical string is read from
    // the pinned dataset and must still contain the U+06E1 small high meem that
    // the importer never rewrites.
    const surah = getSurah(2);
    const ayah = surah?.ayat.find((a) => a.ayah === 153);
    expect(ayah).toBeDefined();
    expect(ayah!.arabic).toContain("\u06E1");
  });
});

// ---------------------------------------------------------------------------
// CLI: dry-run and idempotency
// ---------------------------------------------------------------------------

describe("batch review CLI", () => {
  function fixture() {
    const dir = mkdtempSync(join(tmpdir(), "alhuda-review-"));
    const indexPath = join(dir, "index.json");
    const resultsPath = join(dir, "results.json");
    const publicationsPath = join(dir, "publications.json");
    const candidate = makeEntry({ slug: "sabr", roots: ["صبر"], title: "Patience" });
    const index: MorphologyRecord[] = [
      rec(2, 153, 1, "صبر", "صبر", "صبر"),
      rec(2, 153, 2, "صابر", "صبر", "صابر"),
    ];
    writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf-8");
    return { dir, indexPath, resultsPath, publicationsPath, candidate };
  }

  it("writes nothing in dry-run mode", () => {
    const f = fixture();
    const result = runCli({
      argv: ["--dry-run"],
      candidates: [f.candidate],
      indexPath: f.indexPath,
      resultsPath: f.resultsPath,
      publicationsPath: f.publicationsPath,
      log: () => {},
    });
    expect(result.dryRun).toBe(true);
    expect(result.wrote).toEqual([]);
    expect(existsSync(f.resultsPath)).toBe(false);
    expect(existsSync(f.publicationsPath)).toBe(false);
  });

  it("does not overwrite an existing publication file in dry-run mode", () => {
    const f = fixture();
    writeFileSync(f.publicationsPath, "SENTINEL", "utf-8");
    runCli({
      argv: ["--dry-run"],
      candidates: [f.candidate],
      indexPath: f.indexPath,
      resultsPath: f.resultsPath,
      publicationsPath: f.publicationsPath,
      log: () => {},
    });
    expect(readFileSync(f.publicationsPath, "utf-8")).toBe("SENTINEL");
  });

  it("writes both outputs on a live run and publishes the clean root", () => {
    const f = fixture();
    const result = runCli({
      argv: [],
      candidates: [f.candidate],
      indexPath: f.indexPath,
      resultsPath: f.resultsPath,
      publicationsPath: f.publicationsPath,
      log: () => {},
    });
    expect(result.wrote).toEqual([f.resultsPath, f.publicationsPath]);
    expect(result.report.publishedCount).toBe(1);
    expect(existsSync(f.resultsPath)).toBe(true);
    expect(existsSync(f.publicationsPath)).toBe(true);
  });

  it("produces byte-identical files when rerun", () => {
    const f = fixture();
    const options = {
      argv: [] as string[],
      candidates: [f.candidate],
      indexPath: f.indexPath,
      resultsPath: f.resultsPath,
      publicationsPath: f.publicationsPath,
      log: () => {},
    };
    runCli(options);
    const firstResults = readFileSync(f.resultsPath, "utf-8");
    const firstPublications = readFileSync(f.publicationsPath, "utf-8");
    runCli(options);
    expect(readFileSync(f.resultsPath, "utf-8")).toBe(firstResults);
    expect(readFileSync(f.publicationsPath, "utf-8")).toBe(firstPublications);
  });
});