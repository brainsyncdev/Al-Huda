// Domain-topic relationship tests — pin the invariants of the mapping layer.
//
// These tests enforce that:
//   - Every shipped relationship references a real domain and a real topic.
//   - IDs are deterministic, unique, and pair-deduplicated.
//   - Navigation-only relationships can never be presented as scholarly.
//   - Machine-verified evidence can never satisfy an interpretive claim.
//   - Approval requires a real reviewer id and qualifying evidence.
//   - Nothing is auto-promoted: every shipped relationship is pending-review.
//   - The domain catalog, the 10 dimensions, and the 11 topics are untouched.

import { describe, expect, it } from "vitest";
import {
  DOMAIN_TOPIC_RELATIONS,
  domainTopicRelationId,
  getDomainTopicRelations,
  getDomainTopics,
  getTopicDomainRelations,
  getTopicDomains,
  validateDomainTopicCatalog,
  validateDomainTopicRelation,
  type DomainTopicRelation,
} from "./domain-topics";
import { DOMAINS, DOMAIN_PROVENANCE } from "./domains";
import type { DomainId } from "./domains";
import { DIMENSIONS, DIMENSION_PROVENANCE } from "@/lib/explore/dimensions";
import { TOPICS, getTopic } from "@/lib/topics/data";

function makeRelation(
  overrides: Partial<DomainTopicRelation> = {}
): DomainTopicRelation {
  const domainId = (overrides.domainId ?? "ethics-character") as DomainId;
  const topicSlug = overrides.topicSlug ?? "patience";
  return {
    id: domainTopicRelationId(domainId, topicSlug),
    domainId,
    topicSlug,
    semantics: "organizational-membership",
    purpose: "Test purpose for this relationship.",
    evidence: [
      {
        type: "editorial",
        statement: "Editorial rationale citing subject overlap.",
        sources: [],
      },
    ],
    provenance: {
      method: "test",
      assertedBy: "test-curator",
      assertedAt: "2026-10-26",
      state: "pending-review",
      decisions: [],
      sources: [],
    },
    ...overrides,
  };
}

describe("domain-topic catalog — shipped data", () => {
  it("the shipped catalog passes full validation", () => {
    const result = validateDomainTopicCatalog();
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it("every relationship id is unique and matches the deterministic pattern", () => {
    const ids = DOMAIN_TOPIC_RELATIONS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      expect(r.id).toBe(domainTopicRelationId(r.domainId, r.topicSlug));
    }
  });

  it("every relationship references an existing domain and an existing topic", () => {
    const domainIds = new Set(DOMAINS.map((d) => d.id));
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      expect(domainIds.has(r.domainId)).toBe(true);
      expect(getTopic(r.topicSlug), `unknown topic ${r.topicSlug}`).toBeDefined();
    }
  });

  it("no relationship is auto-promoted: all are pending-review with no decisions", () => {
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      expect(r.provenance.state, `${r.id} state`).toBe("pending-review");
      expect(r.provenance.decisions, `${r.id} decisions`).toEqual([]);
    }
  });

  it("no relationship carries scholarly evidence or a reviewer identity", () => {
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      expect(r.evidence.some((e) => e.type === "scholarly")).toBe(false);
      expect(r.provenance.assertedBy).toBe("Al-Huda editorial team");
    }
  });

  it("no relationship contains a passage, ayah, or surah reference", () => {
    // Structural guarantee: the relation interface has no such fields.
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      const raw = r as unknown as Record<string, unknown>;
      expect(raw.passageIds).toBeUndefined();
      expect(raw.ayahRefs).toBeUndefined();
      expect(raw.surah).toBeUndefined();
      expect(raw.ayah).toBeUndefined();
    }
  });

  it("every relationship carries a non-empty purpose and evidence statement", () => {
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      expect(r.purpose.trim().length).toBeGreaterThan(20);
      expect(r.evidence.length).toBeGreaterThan(0);
      for (const e of r.evidence) {
        expect(e.statement.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it("each of the 11 canonical topics is mapped at most once in this release", () => {
    const counts = new Map<string, number>();
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      counts.set(r.topicSlug, (counts.get(r.topicSlug) ?? 0) + 1);
    }
    for (const [slug, count] of counts) {
      expect(count, `${slug} mapped ${count} times`).toBe(1);
    }
    // And every mapped slug is a real topic.
    for (const slug of counts.keys()) {
      expect(TOPICS.some((t) => t.slug === slug)).toBe(true);
    }
  });
});

describe("domain-topic lookup helpers", () => {
  it("getDomainTopicRelations returns only that domain's relations", () => {
    const relations = getDomainTopicRelations("ethics-character");
    expect(relations.length).toBeGreaterThan(0);
    for (const r of relations) {
      expect(r.domainId).toBe("ethics-character");
    }
  });

  it("getTopicDomainRelations is the reverse index", () => {
    const relations = getTopicDomainRelations("patience");
    expect(relations).toHaveLength(1);
    expect(relations[0].domainId).toBe("ethics-character");
    expect(getTopicDomains("patience")).toEqual(["ethics-character"]);
  });

  it("an unmapped topic yields an empty domain list, never a guess", () => {
    expect(getTopicDomains("no-such-topic")).toEqual([]);
    expect(getTopicDomainRelations("no-such-topic")).toEqual([]);
  });

  it("domains without relationships report an empty topic list (honest empty state)", () => {
    const mapped = new Set(DOMAIN_TOPIC_RELATIONS.map((r) => r.domainId));
    const unmapped = DOMAINS.filter((d) => !mapped.has(d.id));
    expect(unmapped.length).toBeGreaterThan(0);
    for (const d of unmapped) {
      expect(getDomainTopics(d.id)).toEqual([]);
    }
  });

  it("getDomainTopics returns canonical topic slugs", () => {
    const slugs = getDomainTopics("ethics-character");
    expect(slugs).toContain("patience");
    for (const slug of slugs) {
      expect(getTopic(slug)).toBeDefined();
    }
  });
});

describe("domain-topic validation — rejection cases", () => {
  it("rejects an unknown domain reference", () => {
    const r = makeRelation({ domainId: "not-a-domain" as DomainId });
    const issues = validateDomainTopicRelation(r);
    expect(issues.some((i) => i.code === "unknown-domain")).toBe(true);
  });

  it("rejects an unknown topic reference", () => {
    const r = makeRelation({ topicSlug: "not-a-topic" });
    const issues = validateDomainTopicRelation(r);
    expect(issues.some((i) => i.code === "unknown-topic")).toBe(true);
  });

  it("rejects a hand-written id that does not match the deterministic pattern", () => {
    const r = makeRelation({ id: "domain-topic:whatever" });
    const issues = validateDomainTopicRelation(r);
    expect(issues.some((i) => i.code === "domain-topic-id-mismatch")).toBe(true);
  });

  it("rejects duplicate relationship ids", () => {
    const first = DOMAIN_TOPIC_RELATIONS[0];
    const result = validateDomainTopicCatalog([
      ...DOMAIN_TOPIC_RELATIONS,
      { ...first },
    ]);
    expect(result.ok).toBe(false);
    expect(result.issues.some((i) => i.code === "duplicate-domain-topic-id")).toBe(
      true
    );
  });

  it("rejects a duplicate domain-topic pair even when the id differs", () => {
    const first = DOMAIN_TOPIC_RELATIONS[0];
    const result = validateDomainTopicCatalog([
      first,
      { ...first, id: "domain-topic:hand-written" },
    ]);
    expect(result.ok).toBe(false);
    expect(
      result.issues.some((i) => i.code === "duplicate-domain-topic-pair")
    ).toBe(true);
  });

  it("rejects an empty purpose", () => {
    const issues = validateDomainTopicRelation(makeRelation({ purpose: "  " }));
    expect(issues.some((i) => i.code === "empty-purpose")).toBe(true);
  });

  it("rejects a relationship with no evidence", () => {
    const issues = validateDomainTopicRelation(makeRelation({ evidence: [] }));
    expect(issues.some((i) => i.code === "no-evidence")).toBe(true);
  });

  it("rejects an empty evidence statement", () => {
    const r = makeRelation({
      evidence: [{ type: "editorial", statement: "", sources: [] }],
    });
    const issues = validateDomainTopicRelation(r);
    expect(issues.some((i) => i.code === "empty-evidence-statement")).toBe(true);
  });
});

describe("domain-topic validation — many-to-many support", () => {
  it("allows one topic to belong to multiple domains when each pair is distinct", () => {
    const result = validateDomainTopicCatalog([
      makeRelation({ domainId: "ethics-character", topicSlug: "patience" }),
      makeRelation({ domainId: "worship-practice", topicSlug: "patience" }),
    ]);
    expect(result.issues).toEqual([]);
    expect(result.ok).toBe(true);
  });
});

describe("domain-topic validation — evidence governance", () => {
  it("navigation-only relationships cannot carry scholarly evidence", () => {
    const r = makeRelation({
      semantics: "navigation-only",
      evidence: [{ type: "scholarly", statement: "Scholar endorsed.", sources: [] }],
    });
    const issues = validateDomainTopicRelation(r);
    expect(
      issues.some((i) => i.code === "navigation-topic-link-cannot-be-scholarly")
    ).toBe(true);
  });

  it("navigation-only relationships cannot be approved", () => {
    const r = makeRelation({
      semantics: "navigation-only",
      evidence: [{ type: "navigation", statement: "UI aid.", sources: [] }],
      provenance: {
        method: "test",
        assertedBy: "test-curator",
        assertedAt: "2026-10-26",
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "editorial",
            decidedAt: "2026-10-26",
            decidedBy: "editor-y",
          },
        ],
        sources: [],
      },
    });
    const issues = validateDomainTopicRelation(r);
    expect(
      issues.some((i) => i.code === "navigation-topic-link-cannot-be-approved")
    ).toBe(true);
  });

  it("machine-verified evidence alone cannot support organizational membership", () => {
    const r = makeRelation({
      evidence: [
        {
          type: "machine-verified",
          statement: "Text identity in pinned dataset.",
          sources: [],
        },
      ],
    });
    const issues = validateDomainTopicRelation(r);
    expect(
      issues.some((i) => i.code === "membership-without-editorial-evidence")
    ).toBe(true);
  });

  it("scholarly approval with machine-verified evidence alone is rejected", () => {
    // Sprint 33's safeguard, extended to this layer: a reproducible text
    // comparison cannot establish that a topic belongs in a domain.
    const r = makeRelation({
      evidence: [
        {
          type: "machine-verified",
          statement: "Text identity in pinned dataset.",
          sources: [],
        },
      ],
      provenance: {
        method: "test",
        assertedBy: "test-curator",
        assertedAt: "2026-10-26",
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-26",
            decidedBy: "scholar-x",
          },
        ],
        sources: [],
      },
    });
    const issues = validateDomainTopicRelation(r);
    expect(
      issues.some(
        (i) => i.code === "scholarly-approval-requires-scholarly-evidence"
      )
    ).toBe(true);
  });

  it("scholarly approval with editorial evidence alone is rejected", () => {
    const r = makeRelation({
      provenance: {
        method: "test",
        assertedBy: "test-curator",
        assertedAt: "2026-10-26",
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-26",
            decidedBy: "scholar-x",
          },
        ],
        sources: [],
      },
    });
    const issues = validateDomainTopicRelation(r);
    expect(
      issues.some(
        (i) => i.code === "scholarly-approval-requires-scholarly-evidence"
      )
    ).toBe(true);
  });

  it("accepts scholarly approval when real scholarly evidence and a reviewer id exist", () => {
    const r = makeRelation({
      evidence: [
        {
          type: "scholarly",
          statement: "A qualified reviewer endorsed this membership.",
          sources: [],
        },
      ],
      provenance: {
        method: "test",
        assertedBy: "test-curator",
        assertedAt: "2026-10-26",
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-26",
            decidedBy: "scholar-x",
          },
        ],
        sources: [],
      },
    });
    expect(validateDomainTopicRelation(r)).toEqual([]);
  });

  it("rejects an approval decision with no reviewer id", () => {
    const r = makeRelation({
      evidence: [
        { type: "scholarly", statement: "Scholar endorsed.", sources: [] },
      ],
      provenance: {
        method: "test",
        assertedBy: "test-curator",
        assertedAt: "2026-10-26",
        state: "approved",
        decisions: [
          {
            state: "approved",
            track: "scholarly",
            decidedAt: "2026-10-26",
            decidedBy: "",
          },
        ],
        sources: [],
      },
    });
    const issues = validateDomainTopicRelation(r);
    expect(issues.some((i) => i.code === "empty-decided-by")).toBe(true);
  });
});

describe("sprint 34 — no regressions in existing catalogs", () => {
  it("all 14 domains remain intact", () => {
    expect(DOMAINS).toHaveLength(14);
    const ids = new Set(DOMAINS.map((d) => d.id));
    expect(ids.size).toBe(14);
  });

  it("the domain catalog provenance is still pending scholarly review", () => {
    expect(DOMAIN_PROVENANCE.status).toBe("pending-scholarly-review");
  });

  it("the 10 exploration dimensions remain intact", () => {
    expect(DIMENSIONS).toHaveLength(10);
    expect(DIMENSION_PROVENANCE.status).toBe("pending-scholarly-review");
    for (const dim of DIMENSIONS) {
      for (const slug of dim.topicSlugs) {
        expect(getTopic(slug), `dimension ${dim.id} references ${slug}`).toBeDefined();
      }
    }
  });

  it("the 11 canonical topics and their slugs are unchanged", () => {
    expect(TOPICS).toHaveLength(11);
    const slugs = TOPICS.map((t) => t.slug).sort();
    expect(slugs).toEqual(
      [
        "giving",
        "gratitude",
        "hardship-and-ease",
        "justice",
        "knowledge-and-reflection",
        "mercy-and-forgiveness",
        "parents-and-family",
        "patience",
        "remembrance",
        "the-hereafter",
        "trust-in-god",
      ].sort()
    );
  });

  it("each topic retains its canonical URL slug and a non-empty summary", () => {
    for (const t of TOPICS) {
      expect(t.slug).toMatch(/^[a-z0-9-]+$/);
      expect(t.summary.length).toBeGreaterThan(40);
      expect(t.title.length).toBeGreaterThan(0);
    }
  });

  it("the relationship catalog is not a copy of any dimension's topicSlugs", () => {
    // Guard against reinterpreting exploration lenses as domain assignments.
    // The dimension mappings and the domain mappings are different systems;
    // a wholesale copy would make the two indistinguishable.
    const dimensionPairs = new Set<string>();
    for (const dim of DIMENSIONS) {
      for (const slug of dim.topicSlugs) {
        dimensionPairs.add(`${dim.id}::${slug}`);
      }
    }
    // No domain id is a dimension id (different namespaces).
    for (const r of DOMAIN_TOPIC_RELATIONS) {
      expect(dimensionPairs.has(`${r.domainId}::${r.topicSlug}`)).toBe(false);
    }
  });
});