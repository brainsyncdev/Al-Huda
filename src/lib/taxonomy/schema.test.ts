// Schema contract tests — exercise the taxonomy schema's invariants
// using hand-built fixtures. These tests are the SAFETY NET for future
// sprints that add real data: any change that weakens an invariant will
// cause one of these tests to fail.
//
// Coverage:
//   - Entity kinds narrow correctly under the discriminated union.
//   - Review state transitions are well-formed.
//   - Validators catch empty ids, missing provenance, undirected ordering,
//     navigation-only scholarly evidence, and approval without qualifying
//     evidence.
//   - Compatibility adapters produce entities that pass validation.
//   - Existing Dimension / Topic catalogs (10 dims + 11 topics) project
//     cleanly into the new schema.

import { describe, expect, it } from "vitest";
import {
  type TaxonomyEntity,
  type TaxonomySnapshot,
  type TaxonomyRelationship,
  type RelationshipEvidence,
  TAXONOMY_SCHEMA_VERSION,
  UNDIRECTED_RELATION_KINDS,
  NAVIGATION_ONLY_RELATION_KINDS,
  MIN_EVIDENCE_FOR_TRACK,
} from "./schema";
import {
  validateEntity,
  validateRelation,
  validateSnapshot,
  evidenceSatisfiesTrack,
} from "./validate";
import {
  adaptDimension,
  adaptDimensionTopicMapping,
  adaptTopic,
  adaptTopicRelation,
  adaptTopicRelatedLink,
  adaptCrossReference,
  adaptPassage,
  entityId,
  relationId,
} from "./compatibility";
import { DIMENSIONS, DIMENSION_PROVENANCE } from "@/lib/explore/dimensions";
import { TOPICS } from "@/lib/topics/data";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function validProvenance(overrides: Partial<TaxonomyEntity["provenance"]> = {}) {
  return {
    method: "editorial-selection",
    assertedBy: "test-curator",
    assertedAt: "2026-10-25",
    state: "pending-review" as const,
    decisions: [],
    sources: [],
    ...overrides,
  };
}

function validEntity(overrides: Partial<TaxonomyEntity> = {}): TaxonomyEntity {
  return {
    id: "topic:test-topic",
    kind: "topic",
    labels: { primary: "Test Topic", primaryLanguage: "en", arabic: "موضوع تجريبي" },
    summary: "A test topic used by schema tests.",
    provenance: validProvenance(),
    domainIds: [],
    themeIds: [],
    ...overrides,
  } as TaxonomyEntity;
}

function validRelation(
  overrides: Partial<TaxonomyRelationship> = {}
): TaxonomyRelationship {
  return {
    id: "thematic-overlap:passage:2:255--topic:test-topic",
    kind: "thematic-overlap",
    source: "passage:2:255",
    target: "topic:test-topic",
    scopeNote: "Test relation.",
    evidence: [
      {
        type: "editorial",
        statement: "The verse addresses the topic.",
        sources: [],
      },
    ],
    provenance: validProvenance(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Schema shape
// ---------------------------------------------------------------------------

describe("taxonomy schema shape", () => {
  it("schema version is a stable string literal", () => {
    expect(TAXONOMY_SCHEMA_VERSION).toBe("1");
  });

  it("undirected relation kinds include thematic-overlap, lexical-match, cross-reference", () => {
    expect(UNDIRECTED_RELATION_KINDS.has("thematic-overlap")).toBe(true);
    expect(UNDIRECTED_RELATION_KINDS.has("lexical-match")).toBe(true);
    expect(UNDIRECTED_RELATION_KINDS.has("cross-reference")).toBe(true);
    expect(UNDIRECTED_RELATION_KINDS.has("broader")).toBe(false);
  });

  it("navigation-only kinds include lens-overlays", () => {
    expect(NAVIGATION_ONLY_RELATION_KINDS.has("lens-overlays")).toBe(true);
    expect(NAVIGATION_ONLY_RELATION_KINDS.has("thematic-overlap")).toBe(false);
  });

  it("MIN_EVIDENCE_FOR_TRACK accepts machine-verified for scholarly", () => {
    expect(
      (MIN_EVIDENCE_FOR_TRACK.scholarly as readonly string[]).includes(
        "machine-verified"
      )
    ).toBe(true);
  });

  it("MIN_EVIDENCE_FOR_TRACK rejects pure-editorial evidence for scholarly track", () => {
    expect(
      (MIN_EVIDENCE_FOR_TRACK.scholarly as readonly string[]).includes(
        "editorial"
      )
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Entity validation
// ---------------------------------------------------------------------------

describe("validateEntity", () => {
  it("accepts a well-formed topic entity", () => {
    const issues = validateEntity(validEntity());
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("rejects an entity with empty id", () => {
    const issues = validateEntity(validEntity({ id: "" }));
    expect(issues.some((i) => i.code === "empty-entity-id")).toBe(true);
  });

  it("warns when primary label is missing", () => {
    const e = validEntity();
    e.labels = { primary: "", primaryLanguage: "en" };
    const issues = validateEntity(e);
    expect(issues.some((i) => i.code === "missing-primary-label")).toBe(true);
  });

  it("rejects a passage entity with ayahStart < 1", () => {
    const p = adaptPassage(1, 1);
    (p as { ayahStart: number }).ayahStart = 0;
    const issues = validateEntity(p);
    expect(issues.some((i) => i.code === "invalid-ayah-start")).toBe(true);
  });

  it("rejects a passage entity with ayahEnd < ayahStart", () => {
    const p = adaptPassage(2, 255);
    (p as { ayahEnd: number }).ayahEnd = 254;
    const issues = validateEntity(p);
    expect(issues.some((i) => i.code === "invalid-ayah-range")).toBe(true);
  });

  it("rejects an entity whose provenance carries a decision with no decidedBy", () => {
    const e = validEntity();
    e.provenance = validProvenance({
      state: "approved",
      decisions: [
        {
          state: "approved",
          track: "editorial",
          decidedAt: "2026-10-25",
          decidedBy: "",
        },
      ],
    });
    const issues = validateEntity(e);
    expect(issues.some((i) => i.code === "empty-decided-by")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Relation validation
// ---------------------------------------------------------------------------

describe("validateRelation", () => {
  it("accepts a well-formed undirected relation with ordered endpoints", () => {
    const issues = validateRelation(validRelation());
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("rejects undirected relation with reversed alphabetical order", () => {
    const r = validRelation({
      source: "topic:zzz",
      target: "passage:2:255",
    });
    const issues = validateRelation(r);
    expect(issues.some((i) => i.code === "undirected-ordering")).toBe(true);
  });

  it("rejects a relation with no evidence", () => {
    const r = validRelation({ evidence: [] });
    const issues = validateRelation(r);
    expect(issues.some((i) => i.code === "no-evidence")).toBe(true);
  });

  it("rejects scholarly evidence on a navigation-only relation", () => {
    const r = validRelation({
      kind: "lens-overlays",
      evidence: [
        {
          type: "scholarly",
          statement: "Scholar endorses the mapping.",
          sources: [],
        },
      ],
    });
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "navigation-cannot-be-scholarly")
    ).toBe(true);
  });

  it("rejects approval on a track without qualifying evidence", () => {
    const r = validRelation({
      evidence: [
        {
          type: "editorial",
          statement: "Editorial judgment.",
          sources: [],
        },
      ],
      provenance: validProvenance({
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-25",
            decidedBy: "scholar-x",
          },
        ],
      }),
    });
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "approval-without-qualifying-evidence")
    ).toBe(true);
  });

  it("rejects scholarly approval on a thematic relation with only machine-verified evidence", () => {
    // Sprint 33 hardened this rule: text identity cannot establish that an
    // ayah "expresses" a value or "overlaps" a theme. The base fixture is
    // thematic-overlap, so machine-verified evidence is insufficient here.
    const r = validRelation({
      evidence: [
        {
          type: "machine-verified",
          statement: "Text identity in pinned dataset.",
          sources: [],
        },
      ],
      provenance: validProvenance({
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-25",
            decidedBy: "scholar-x",
          },
        ],
      }),
    });
    const issues = validateRelation(r);
    expect(
      issues.some((i) => i.code === "machine-verified-relation-ineligible")
    ).toBe(true);
  });

  it("accepts scholarly approval on a textual relation with machine-verified evidence", () => {
    // lexical-match is purely textual; text identity is independently
    // reproducible, so machine evidence is legitimate scholarly evidence.
    const r = validRelation({
      id: "lexical-match:passage:2:255--topic:test-topic",
      kind: "lexical-match",
      evidence: [
        {
          type: "machine-verified",
          statement: "Text identity in pinned dataset.",
          sources: [],
        },
      ],
      provenance: validProvenance({
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-25",
            decidedBy: "scholar-x",
          },
        ],
      }),
    });
    const errors = validateRelation(r).filter((i) => i.severity === "error");
    expect(errors).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Snapshot validation
// ---------------------------------------------------------------------------

describe("validateSnapshot", () => {
  it("accepts a well-formed snapshot", () => {
    const e = validEntity();
    const p = adaptPassage(2, 255);
    const r = validRelation();
    const snapshot: TaxonomySnapshot = {
      schemaVersion: TAXONOMY_SCHEMA_VERSION,
      entities: { [e.id]: e, [p.id]: p },
      relations: { [r.id]: r },
      orphans: [],
      notes: [],
    };
    const result = validateSnapshot(snapshot);
    expect(result.ok).toBe(true);
  });

  it("detects dangling relation endpoints by default", () => {
    const r = validRelation(); // references topic:test-topic and passage:2:255 — neither present
    const snapshot: TaxonomySnapshot = {
      schemaVersion: TAXONOMY_SCHEMA_VERSION,
      entities: {},
      relations: { [r.id]: r },
      orphans: [],
      notes: [],
    };
    const result = validateSnapshot(snapshot);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === "dangling-endpoint")).toBe(
      true
    );
  });

  it("downgrades orphans to warnings when allowOrphans is set", () => {
    const r = validRelation();
    const snapshot: TaxonomySnapshot = {
      schemaVersion: TAXONOMY_SCHEMA_VERSION,
      entities: {},
      relations: { [r.id]: r },
      orphans: [],
      notes: [],
    };
    const result = validateSnapshot(snapshot, { allowOrphans: true });
    expect(result.ok).toBe(true);
    const orphan = result.issues.find((i) => i.code === "dangling-endpoint");
    expect(orphan?.severity).toBe("warning");
  });

  it("detects duplicate entity ids", () => {
    const e = validEntity();
    const snapshot: TaxonomySnapshot = {
      schemaVersion: TAXONOMY_SCHEMA_VERSION,
      entities: { [e.id]: e, [e.id + "_dup"]: { ...e } },
      relations: {},
      orphans: [],
      notes: [],
    };
    // Manually force a duplicate key by reassigning id on the second copy
    // (the map keys are different but the entity.id is the same)
    const result = validateSnapshot(snapshot);
    expect(result.issues.some((i) => i.code === "duplicate-entity-id")).toBe(
      true
    );
  });
});

// ---------------------------------------------------------------------------
// evidenceSatisfiesTrack
// ---------------------------------------------------------------------------

describe("evidenceSatisfiesTrack", () => {
  const editorial: RelationshipEvidence = {
    type: "editorial",
    statement: "Curator judgment.",
    sources: [],
  };
  const machine: RelationshipEvidence = {
    type: "machine-verified",
    statement: "Text identity.",
    sources: [],
  };
  const scholarly: RelationshipEvidence = {
    type: "scholarly",
    statement: "Scholar endorsement.",
    sources: [],
  };

  it("editorial evidence satisfies editorial track", () => {
    expect(evidenceSatisfiesTrack(editorial, "editorial")).toBe(true);
  });

  it("editorial evidence does not satisfy scholarly track", () => {
    expect(evidenceSatisfiesTrack(editorial, "scholarly")).toBe(false);
  });

  it("machine-verified evidence satisfies both tracks", () => {
    expect(evidenceSatisfiesTrack(machine, "editorial")).toBe(true);
    expect(evidenceSatisfiesTrack(machine, "scholarly")).toBe(true);
  });

  it("scholarly evidence satisfies both tracks", () => {
    expect(evidenceSatisfiesTrack(scholarly, "editorial")).toBe(true);
    expect(evidenceSatisfiesTrack(scholarly, "scholarly")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Compatibility adapters against the real catalogs
// ---------------------------------------------------------------------------

describe("compatibility adapters", () => {
  it("entityId produces stable, kind-prefixed ids", () => {
    expect(entityId("topic", "patience")).toBe("topic:patience");
    expect(entityId("exploration-lens", "spiritual")).toBe(
      "exploration-lens:spiritual"
    );
  });

  it("relationId is deterministic from (kind, source, target)", () => {
    expect(relationId("thematic-overlap", "a", "b")).toBe(
      "thematic-overlap:a--b"
    );
    expect(relationId("thematic-overlap", "a", "b")).toBe(
      relationId("thematic-overlap", "a", "b")
    );
  });

  it("adaptDimension produces a valid ExplorationLensEntity", () => {
    const spiritual = DIMENSIONS.find((d) => d.id === "spiritual")!;
    const entity = adaptDimension(spiritual);
    expect(entity.kind).toBe("exploration-lens");
    expect(entity.lensKind).toBe("dimension");
    expect(entity.ordinal).toBe(1);
    const issues = validateEntity(entity);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("adaptDimensionTopicMapping produces a valid navigation-only relation", () => {
    const spiritual = DIMENSIONS.find((d) => d.id === "spiritual")!;
    const rel = adaptDimensionTopicMapping(spiritual, "patience");
    expect(rel.kind).toBe("lens-overlays");
    const issues = validateRelation(rel);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
    // Must NOT be promotable to scholarly — navigation-only invariant
    expect(rel.evidence.every((e) => e.type !== "scholarly")).toBe(true);
  });

  it("adaptTopic produces a valid TopicEntity with empty domainIds/themeIds", () => {
    const patience = TOPICS.find((t) => t.slug === "patience")!;
    const entity = adaptTopic(patience);
    expect(entity.kind).toBe("topic");
    expect(entity.domainIds).toEqual([]);
    expect(entity.themeIds).toEqual([]);
    const issues = validateEntity(entity);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("adaptTopicRelation produces a valid typed relation with editorial evidence", () => {
    const patience = TOPICS.find((t) => t.slug === "patience")!;
    const rel = adaptTopicRelation(patience, patience.relations[0]);
    expect(["thematic-overlap", "lexical-match", "cross-reference", "sequential-context"]).toContain(rel.kind);
    const issues = validateRelation(rel);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
    // Undirected kinds must be alphabetically ordered
    if (UNDIRECTED_RELATION_KINDS.has(rel.kind)) {
      expect(rel.source <= rel.target).toBe(true);
    }
  });

  it("adaptTopicRelatedLink produces an undirected thematic-overlap relation", () => {
    const patience = TOPICS.find((t) => t.slug === "patience")!;
    const related = patience.related[0];
    const rel = adaptTopicRelatedLink(patience, related);
    expect(rel.kind).toBe("thematic-overlap");
    expect(rel.source <= rel.target).toBe(true);
    const issues = validateRelation(rel);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("adaptCrossReference produces a machine-verified lexical-match relation", () => {
    const ref = {
      source: { surah: 2, ayah: 5 },
      target: { surah: 2, ayah: 6 },
      relation: "LEXICAL_MATCH" as const,
      evidence: "Identical Uthmani Arabic text.",
      reviewStatus: "machine-verified-text-identity" as const,
    };
    const rel = adaptCrossReference(ref);
    expect(rel.kind).toBe("lexical-match");
    expect(rel.evidence[0].type).toBe("machine-verified");
    const issues = validateRelation(rel);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("adaptPassage produces a valid passage entity with ayahStart === ayahEnd", () => {
    const p = adaptPassage(2, 255);
    expect(p.kind).toBe("passage");
    expect(p.surah).toBe(2);
    expect(p.ayahStart).toBe(255);
    expect(p.ayahEnd).toBe(255);
    const issues = validateEntity(p);
    expect(issues.filter((i) => i.severity === "error")).toHaveLength(0);
  });

  it("all 15 dimensions and 11 topics project into entities that pass validation", () => {
    const allEntities: TaxonomyEntity[] = [];
    for (const dim of DIMENSIONS) allEntities.push(adaptDimension(dim));
    for (const topic of TOPICS) allEntities.push(adaptTopic(topic));
    for (const entity of allEntities) {
      const errors = validateEntity(entity).filter(
        (i) => i.severity === "error"
      );
      expect(errors, `entity ${entity.id} has errors: ${JSON.stringify(errors)}`).toHaveLength(0);
    }
    expect(allEntities).toHaveLength(DIMENSIONS.length + TOPICS.length);
  });

  it("all dimension-to-topic mappings project into relations that pass validation", () => {
    for (const dim of DIMENSIONS) {
      for (const slug of dim.topicSlugs) {
        const rel = adaptDimensionTopicMapping(dim, slug);
        const errors = validateRelation(rel).filter(
          (i) => i.severity === "error"
        );
        expect(
          errors,
          `relation ${rel.id} has errors: ${JSON.stringify(errors)}`
        ).toHaveLength(0);
      }
    }
  });

  it("all topic.relations project into relations that pass validation", () => {
    for (const topic of TOPICS) {
      for (const r of topic.relations) {
        const rel = adaptTopicRelation(topic, r);
        const errors = validateRelation(rel).filter(
          (i) => i.severity === "error"
        );
        expect(
          errors,
          `relation ${rel.id} has errors: ${JSON.stringify(errors)}`
        ).toHaveLength(0);
      }
    }
  });

  it("DIMENSION_PROVENANCE has not been silently promoted to approved", () => {
    // Critical invariant: the dimension→topic mapping is editorial navigation
    // and MUST NOT be presented as scholarly-approved. This test pins that
    // invariant so a future edit cannot weaken it without a real review.
    expect(DIMENSION_PROVENANCE.status).toBe("pending-scholarly-review");
    const adapted = adaptDimension(
      DIMENSIONS.find((d) => d.id === "spiritual")!
    );
    expect(adapted.provenance.state).toBe("pending-review");
    expect(adapted.provenance.decisions).toHaveLength(0);
  });
});
