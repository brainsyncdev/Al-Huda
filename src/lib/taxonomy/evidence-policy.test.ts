// Evidence-governance regression tests.
//
// These tests pin the policy that a reproducible machine-verified fact
// (text identity) is NOT sufficient to approve a thematic, doctrinal, or
// interpretive relation on the scholarly track. Only the purely textual
// relation kinds (lexical-match, cross-reference) can be approved by
// machine evidence; every other kind requires a real scholarly reviewer
// decision.
//
// Why this matters:
//
//   "Ayat 2:5 and 2:6 share identical wording" is a different epistemic
//   category from "this ayah expresses tawakkul." The first is a
//   reproducible mechanical comparison; the second is an interpretive
//   classification that requires qualified expertise. Treating both as
//   equally approvable by machine evidence would fabricate scholarly
//   endorsement the project is not authorized to grant.

import { describe, expect, it } from "vitest";
import {
  type TaxonomyRelationship,
  MACHINE_VERIFIED_SCHOLARLY_RELATIONS,
} from "./schema";
import { validateRelation } from "./validate";

function makeRelation(
  kind: TaxonomyRelationship["kind"],
  evidenceTypes: Array<"machine-verified" | "editorial" | "scholarly" | "navigation" | "lexical">,
  decisions: Array<{
    state: "approved" | "rejected";
    track: "editorial" | "scholarly";
  }> = []
): TaxonomyRelationship {
  // Use ordered endpoints for undirected kinds; doesn't matter for this test
  const [source, target] = ["passage:2:255", "topic:test"]; // source < target alphabetically
  return {
    id: `${kind}:${source}--${target}`,
    kind,
    source,
    target,
    scopeNote: "Test relation.",
    evidence: evidenceTypes.map((type) => ({
      type,
      statement: `Evidence of type ${type}.`,
      sources: [],
    })),
    provenance: {
      method: "test",
      assertedBy: "test-curator",
      assertedAt: "2026-10-26",
      state: decisions.some((d) => d.state === "approved")
        ? "approved"
        : "pending-review",
      decisions: decisions.map((d) => ({
        ...d,
        decidedAt: "2026-10-26",
        decidedBy: d.track === "scholarly" ? "scholar-x" : "editor-y",
      })),
      sources: [],
    },
  };
}

describe("evidence governance — machine-verified relations", () => {
  it("MACHINE_VERIFIED_SCHOLARLY_RELATIONS contains only lexical-match and cross-reference", () => {
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.size).toBe(2);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("lexical-match")).toBe(true);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("cross-reference")).toBe(true);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("thematic-overlap")).toBe(false);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("expresses-value")).toBe(false);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("references-passage")).toBe(false);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("threads-through")).toBe(false);
    expect(MACHINE_VERIFIED_SCHOLARLY_RELATIONS.has("lens-overlays")).toBe(false);
  });

  it("machine-verified evidence on thematic-overlap cannot yield scholarly approval", () => {
    const r = makeRelation(
      "thematic-overlap",
      ["machine-verified"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    const hit = issues.find(
      (i) => i.code === "machine-verified-relation-ineligible"
    );
    expect(hit).toBeDefined();
    expect(hit?.severity).toBe("error");
  });

  it("machine-verified evidence on expresses-value cannot yield scholarly approval", () => {
    const r = makeRelation(
      "expresses-value",
      ["machine-verified"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "machine-verified-relation-ineligible")
    ).toBe(true);
  });

  it("machine-verified evidence on references-passage cannot yield scholarly approval", () => {
    const r = makeRelation(
      "references-passage",
      ["machine-verified"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "machine-verified-relation-ineligible")
    ).toBe(true);
  });

  it("machine-verified evidence on threads-through cannot yield scholarly approval", () => {
    const r = makeRelation(
      "threads-through",
      ["machine-verified"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "machine-verified-relation-ineligible")
    ).toBe(true);
  });

  it("machine-verified evidence on lexical-match CAN yield scholarly approval", () => {
    // lexical-match is purely textual; text identity is independently
    // reproducible, so a machine comparison is legitimate scholarly evidence.
    const r = makeRelation(
      "lexical-match",
      ["machine-verified"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r).filter((i) => i.severity === "error");
    expect(issues).toHaveLength(0);
  });

  it("machine-verified evidence on cross-reference CAN yield scholarly approval", () => {
    const r = makeRelation(
      "cross-reference",
      ["machine-verified"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r).filter((i) => i.severity === "error");
    expect(issues).toHaveLength(0);
  });

  it("editorial evidence with a scholarly decision is rejected on non-textual relations", () => {
    // Pure editorial evidence cannot satisfy a scholarly decision on a
    // thematic relation — even before this sprint's change, this was
    // already rejected; pinning the invariant as a regression test.
    const r = makeRelation(
      "thematic-overlap",
      ["editorial"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    expect(issues.some((i) => i.severity === "error")).toBe(true);
  });

  it("navigation evidence alone cannot yield scholarly approval", () => {
    const r = makeRelation(
      "lens-overlays",
      ["navigation"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    // No scholarly evidence exists, so the generic approval guard fires.
    expect(
      issues.some((i) => i.code === "approval-without-qualifying-evidence")
    ).toBe(true);
  });

  it("a navigation-only relation cannot carry scholarly evidence even under a scholarly approval claim", () => {
    // The navigation-only invariant is about scholarly *evidence* on a
    // navigation relation, not about approval bookkeeping. Pin it.
    const r = makeRelation(
      "lens-overlays",
      ["navigation", "scholarly"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "navigation-cannot-be-scholarly")
    ).toBe(true);
  });

  it("scholarly evidence satisfies scholarly track on any non-navigation relation", () => {
    const r = makeRelation(
      "thematic-overlap",
      ["scholarly"],
      [{ state: "approved", track: "scholarly" }]
    );
    const issues = validateRelation(r).filter((i) => i.severity === "error");
    expect(issues).toHaveLength(0);
  });

  it("machine-verified evidence still satisfies EDITORIAL track on thematic relations", () => {
    // The editorial track still accepts machine-verified evidence on any
    // relation — the policy change is scholarly-track-only.
    const r = makeRelation(
      "thematic-overlap",
      ["machine-verified"],
      [{ state: "approved", track: "editorial" }]
    );
    const issues = validateRelation(r).filter((i) => i.severity === "error");
    expect(issues).toHaveLength(0);
  });
});
