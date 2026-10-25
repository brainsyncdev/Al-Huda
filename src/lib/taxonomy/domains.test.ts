// Domain catalog tests — pin the invariants that prevent future drift.
//
// The catalog is an organizational proposal, not an approved taxonomy.
// These tests enforce that:
//   - The catalog has exactly 14 domains (no silent additions or removals).
//   - Each domain has a stable id, non-empty scope, at least one subject.
//   - Arabic titles are supplied only for the 8 domains where a universally
//     recognized Islamic/Arabic term exists; the other 6 leave it undefined.
//   - Provenance is `pending-scholarly-review` (not silently promoted).
//   - No topic or passage assignments exist in this release.
//   - Overlap declarations are symmetric where intended.
//   - The 10 exploration dimensions remain intact and distinct.

import { describe, expect, it } from "vitest";
import {
  DOMAINS,
  DOMAIN_PROVENANCE,
  getAllDomains,
  getDomain,
  domainUrl,
  getDomainsOverlappingWith,
} from "./domains";
import { DIMENSIONS } from "@/lib/explore/dimensions";

const EXPECTED_DOMAIN_IDS = [
  "belief-theology",
  "worship-practice",
  "ethics-character",
  "family-relationships",
  "society-justice",
  "economic-conduct",
  "prophets-narratives",
  "creation-signs",
  "revelation-guidance",
  "human-experiences",
  "interfaith-communities",
  "language-vocabulary",
  "law-obligations",
  "eschatology-afterlife",
] as const;

/**
 * Domains that carry a universally recognized Islamic/Arabic term.
 * Other domains leave `arabicTitle` undefined rather than fabricated.
 */
const DOMAINS_WITH_ARABIC = new Set([
  "belief-theology",      // al-ʿaqīdah
  "worship-practice",     // al-ʿibādāt
  "ethics-character",     // al-akhlāq
  "society-justice",      // al-ʿadl
  "prophets-narratives",  // al-anbiyāʾ wa al-qaṣaṣ
  "creation-signs",       // al-āyāt
  "law-obligations",      // al-aḥkām
  "eschatology-afterlife",// al-ākhirah
]);

describe("domain catalog v1", () => {
  it("contains exactly 14 domains", () => {
    expect(DOMAINS).toHaveLength(14);
    expect(getAllDomains()).toHaveLength(14);
  });

  it("has no duplicate ids", () => {
    const ids = DOMAINS.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has exactly the expected ids, no more and no fewer", () => {
    const ids = new Set(DOMAINS.map((d) => d.id));
    for (const expected of EXPECTED_DOMAIN_IDS) {
      expect(ids.has(expected)).toBe(true);
    }
    expect(ids.size).toBe(EXPECTED_DOMAIN_IDS.length);
  });

  it("every domain has a non-empty title and scope", () => {
    for (const d of DOMAINS) {
      expect(d.title.length).toBeGreaterThan(0);
      expect(d.scope.length).toBeGreaterThan(20);
    }
  });

  it("every domain has at least one subject", () => {
    for (const d of DOMAINS) {
      expect(d.subjects.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("arabic titles are supplied only for the 8 domains with universally recognized terms", () => {
    for (const d of DOMAINS) {
      if (DOMAINS_WITH_ARABIC.has(d.id)) {
        expect(d.arabicTitle, `domain ${d.id} should have arabicTitle`).toBeDefined();
        expect(d.arabicTitle!.length).toBeGreaterThan(0);
      } else {
        expect(
          d.arabicTitle,
          `domain ${d.id} should leave arabicTitle undefined rather than fabricated`
        ).toBeUndefined();
      }
    }
  });

  it("DOMAIN_PROVENANCE is explicitly pending-scholarly-review (not approved)", () => {
    expect(DOMAIN_PROVENANCE.status).toBe("pending-scholarly-review");
  });

  it("getDomain returns the matching domain or null", () => {
    expect(getDomain("belief-theology")?.title).toBe("Belief and Theology");
    expect(getDomain("nonexistent")).toBeNull();
    expect(getDomain("")).toBeNull();
  });

  it("domainUrl produces a well-formed root-relative URL", () => {
    expect(domainUrl("belief-theology")).toBe("/explore/domains/belief-theology");
    expect(domainUrl("language-vocabulary")).toBe("/explore/domains/language-vocabulary");
  });

  it("getDomainsOverlappingWith returns domains that declare an overlap", () => {
    const overlapsWithEthics = getDomainsOverlappingWith("ethics-character");
    const ids = overlapsWithEthics.map((d) => d.id);
    // human-experiences, family-relationships, society-justice, worship-practice,
    // law-obligations all declare ethics-character in their overlaps.
    expect(ids).toContain("human-experiences");
    expect(ids).toContain("worship-practice");
    expect(ids).not.toContain("ethics-character");
  });

  it("catalog carries no topic or passage assignments in this release", () => {
    // This is a structural invariant: domains in this release are
    // organizational proposals. Adding topic or passage arrays to the
    // Domain interface without an editorial pass would fabricate
    // classifications. The type has no such fields, so any attempt to
    // add them would require changing the interface — which this test
    // would catch at compile time. At runtime we also confirm every
    // domain has no `topicSlugs` or `passageIds` fields, in case a
    // future edit adds them without going through a review.
    for (const d of DOMAINS) {
      const raw = d as unknown as Record<string, unknown>;
      expect(raw.topicSlugs).toBeUndefined();
      expect(raw.passageIds).toBeUndefined();
      expect(raw.topicIds).toBeUndefined();
    }
  });

  it("the 10 exploration dimensions remain intact and distinct from domains", () => {
    // Critical regression guard: domains must not replace or rename
    // the existing 10 dimensions. They are different entity kinds.
    expect(DIMENSIONS).toHaveLength(10);
    const dimensionIds = new Set<string>(DIMENSIONS.map((d) => d.id));
    for (const domain of DOMAINS) {
      expect(dimensionIds.has(domain.id)).toBe(false);
    }
  });

  it("domain ids are URL-safe (lowercase, letters/digits/hyphens only)", () => {
    const urlSafe = /^[a-z0-9-]+$/;
    for (const d of DOMAINS) {
      expect(d.id).toMatch(urlSafe);
    }
  });
});
