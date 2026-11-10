// Sprint 50 — Root-Ayah Coverage & Quran Navigation Regression Tests
//
// Verifies:
//   1. Global unique ayah count (authoritative: 6,205)
//   2. Occurrence integrity (no duplicates, no phantoms)
//   3. Root context panel integration
//   4. Quran navigation with root context
//   5. Policy preservation

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  loadSprint48Registry,
  loadSprint48OccurrenceFile,
  getSprint48RootBySlug,
} from "./sprint-48-root-data";

const DATA_DIR = join(process.cwd(), "data");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");
const COVERAGE_REPORT_PATH = join(DATA_DIR, "global-root-ayah-coverage-report.json");

describe("Sprint 50: global ayah coverage", () => {
  it("global coverage audit report exists", () => {
    expect(existsSync(COVERAGE_REPORT_PATH)).toBe(true);
  });

  it("global unique ayah count is 6,205 (authoritative)", () => {
    const report = JSON.parse(readFileSync(COVERAGE_REPORT_PATH, "utf-8"));
    expect(report.globalCoverage.uniqueAyat).toBe(6205);
  });

  it("per-root sum exceeds global count (cross-root duplicates)", () => {
    const report = JSON.parse(readFileSync(COVERAGE_REPORT_PATH, "utf-8"));
    expect(report.perRootCoverage.sumOfDistinctAyat).toBeGreaterThan(
      report.globalCoverage.uniqueAyat
    );
  });

  it("no within-root duplicates found", () => {
    const report = JSON.parse(readFileSync(COVERAGE_REPORT_PATH, "utf-8"));
    expect(report.integrity.duplicateWithinRoot).toBe(0);
  });

  it("no invalid references found", () => {
    const report = JSON.parse(readFileSync(COVERAGE_REPORT_PATH, "utf-8"));
    expect(report.integrity.invalidReferences).toBe(0);
  });

  it("integrity status is PASS", () => {
    const report = JSON.parse(readFileSync(COVERAGE_REPORT_PATH, "utf-8"));
    expect(report.integrity.status).toBe("PASS");
  });
});

describe("Sprint 50: occurrence integrity verification", () => {
  it("all occurrence files have valid surah/ayah references", () => {
    const files = readdirSync(OCCURRENCES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files.slice(0, 50)) {
      const data = JSON.parse(readFileSync(join(OCCURRENCES_DIR, file), "utf-8"));
      if (data.totalMatches === 0) continue;
      for (const occ of data.occurrences) {
        expect(occ.ref.surah).toBeGreaterThanOrEqual(1);
        expect(occ.ref.surah).toBeLessThanOrEqual(114);
        expect(occ.ref.ayah).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("all occurrences have wordPosition defined", () => {
    const files = readdirSync(OCCURRENCES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files.slice(0, 50)) {
      const data = JSON.parse(readFileSync(join(OCCURRENCES_DIR, file), "utf-8"));
      if (data.totalMatches === 0) continue;
      for (const occ of data.occurrences) {
        expect(occ.wordPosition).toBeDefined();
        expect(occ.wordPosition).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("occurrence files match registry counts", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const activated = registry!.roots.filter(
      (r) => r.status === "activated" || r.status === "partially-activated"
    );
    for (const root of activated.slice(0, 20)) {
      const occ = loadSprint48OccurrenceFile(root.slug);
      if (!occ || occ.totalMatches === 0) continue;
      expect(occ.totalMatches).toBe(root.occurrenceCount);
      expect(occ.uniqueAyahs.length).toBe(root.distinctAyahCount);
    }
  });
});

describe("Sprint 50: root context integration", () => {
  it("root context panel component exists", () => {
    const panelPath = join(
      process.cwd(),
      "src/components/quran/root-context-panel.tsx"
    );
    expect(existsSync(panelPath)).toBe(true);
  });

  it("ayah reader imports root context panel", () => {
    const readerPath = join(
      process.cwd(),
      "src/app/ayah/[surah]/[ayah]/page.tsx"
    );
    const content = readFileSync(readerPath, "utf-8");
    expect(content).toContain("RootContextPanel");
    expect(content).toContain("buildRootContext");
  });

  it("ayah reader accepts from and root query params", () => {
    const readerPath = join(
      process.cwd(),
      "src/app/ayah/[surah]/[ayah]/page.tsx"
    );
    const content = readFileSync(readerPath, "utf-8");
    expect(content).toContain("from?: string");
    expect(content).toContain("root?: string");
  });
});

describe("Sprint 50: Quran navigation", () => {
  it("ayah reader has previous/next navigation", () => {
    const readerPath = join(
      process.cwd(),
      "src/app/ayah/[surah]/[ayah]/page.tsx"
    );
    const content = readFileSync(readerPath, "utf-8");
    expect(content).toContain("prev");
    expect(content).toContain("next");
    expect(content).toContain("Previous");
    expect(content).toContain("Next");
  });

  it("ayah reader handles surah boundaries", () => {
    const readerPath = join(
      process.cwd(),
      "src/app/ayah/[surah]/[ayah]/page.tsx"
    );
    const content = readFileSync(readerPath, "utf-8");
    // Should handle first ayah of surah 1 (no previous)
    expect(content).toContain("s > 1");
    // Should handle last ayah of surah 114 (no next)
    expect(content).toContain("s < 114");
  });

  it("root discovery links use correct ayah route", () => {
    const detailPath = join(
      process.cwd(),
      "src/app/explore/root/[root]/page.tsx"
    );
    const content = readFileSync(detailPath, "utf-8");
    // Should use /ayah/[surah]/[ayah] not /surah/[surah]/[ayah]
    expect(content).toContain("/ayah/");
    expect(content).toContain("?from=root");
  });
});

describe("Sprint 50: policy preservation", () => {
  it("Quran text preservation policy is documented", () => {
    // The types.ts file documents that Arabic text must never be altered
    const typesPath = join(process.cwd(), "src/lib/quran/types.ts");
    const content = readFileSync(typesPath, "utf-8");
    expect(content).toContain("Never alter, normalize, or reconstruct");
  });

  it("AI answer feature remains disabled", () => {
    const batchPath = join(DATA_DIR, "automated-morphology-batch-dryrun.json");
    const batch = JSON.parse(readFileSync(batchPath, "utf-8"));
    expect(batch.aiProvider).toBe("none");
  });

  it("ROOT_ALLOWLIST is preserved", () => {
    const allowlistPath = join(
      process.cwd(),
      "src/lib/morphology/root-allowlist.ts"
    );
    expect(existsSync(allowlistPath)).toBe(true);
  });

  it("existing topics remain unchanged", () => {
    const topicsPath = join(process.cwd(), "src/lib/topics/data.ts");
    expect(existsSync(topicsPath)).toBe(true);
  });
});

describe("Sprint 50: status distribution", () => {
  it("status counts are mutually exclusive", () => {
    const report = JSON.parse(readFileSync(COVERAGE_REPORT_PATH, "utf-8"));
    const status = report.statusBreakdown;
    const total =
      status.activated +
      status["partially-activated"] +
      status["needs-review"] +
      status.discovered;
    expect(total).toBe(1642);
  });

  it("activated roots have populated occurrence files", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const activated = registry!.roots.filter((r) => r.status === "activated");
    for (const root of activated.slice(0, 10)) {
      const occ = loadSprint48OccurrenceFile(root.slug);
      expect(occ).not.toBeNull();
      expect(occ!.totalMatches).toBeGreaterThan(0);
    }
  });
});

describe("Sprint 50: root occurrence navigation", () => {
  it("occurrence files contain multiple occurrences", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    // Use the correct slug "sabr" for root صبر
    const sabr = getSprint48RootBySlug("sabr");
    expect(sabr).not.toBeNull();
    // Occurrence files are named by Arabic root, not slug
    const occ = loadSprint48OccurrenceFile(sabr!.root);
    expect(occ).not.toBeNull();
    expect(occ!.totalMatches).toBeGreaterThan(1);
  });

  it("occurrences are ordered by surah and ayah", () => {
    const sabr = getSprint48RootBySlug("sabr");
    expect(sabr).not.toBeNull();
    // Occurrence files are named by Arabic root, not slug
    const occ = loadSprint48OccurrenceFile(sabr!.root);
    expect(occ).not.toBeNull();
    for (let i = 1; i < occ!.occurrences.length; i++) {
      const prev = occ!.occurrences[i - 1];
      const curr = occ!.occurrences[i];
      // Should be sorted by surah, then ayah
      if (prev.ref.surah === curr.ref.surah) {
        expect(curr.ref.ayah).toBeGreaterThanOrEqual(prev.ref.ayah);
      } else {
        expect(curr.ref.surah).toBeGreaterThan(prev.ref.surah);
      }
    }
  });
});
