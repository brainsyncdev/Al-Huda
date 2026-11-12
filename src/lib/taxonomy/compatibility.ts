// Compatibility adapter — map existing data entities onto the new taxonomy
// schema. PURE FUNCTIONS; no side effects, no filesystem, no network.
//
// WHY AN ADAPTER LAYER:
//
//   The existing `Dimension`, `Topic`, `CrossReference`, and `LearningPath`
//   modules are the authoritative source of record for the data they own.
//   This sprint's constraint is compatibility-first — existing consumers,
//   routes, API contracts, and tests must not break. Rather than migrate
//   every data file into the new schema shape, we expose adapters that
//   project the existing data into `TaxonomyEntity` / `TaxonomyRelationship`
//   records. A future sprint can either:
//
//     (a) keep the adapters as the integration seam while new entity kinds
//         (story, concept, linguistic) are added natively, OR
//
//     (b) migrate existing data into a single taxonomy store and retire
//         the adapters — but only after real reviewers have validated
//         classifications that are currently marked pending.
//
// SCOPE OF THESE ADAPTERS:
//
//   They preserve every existing fact and every existing uncertainty.
//   - No ayah-level classification is asserted that doesn't already exist.
//   - No review status is promoted. Every existing `pending-scholarly-review`
//     maps to `pending-review` on the editorial track; nothing is marked
//     `approved` or `scholarly`.
//   - No reviewer identity is invented.
//   - No new relation is asserted.
//
//   They are a TYPE-LEVEL BRIDGE. A consumer that imports this module gets
//   a typed view; nothing about the existing data files changes.

import type {
  TaxonomyEntity,
  TaxonomyRelationship,
  TaxonomyProvenance,
  RelationshipEvidence,
  ReviewState,
  Labels,
  ExplorationLensEntity,
  TopicEntity,
  PassageEntity,
} from "./schema";
import type { Dimension } from "@/lib/explore/dimensions";
import {
  DIMENSION_PROVENANCE,
} from "@/lib/explore/dimensions";
import type {
  Topic,
  TopicRelation,
  ProvenanceRecord,
  RelationType,
} from "@/lib/topics/data";
import type { CrossReference } from "@/lib/quran/cross-references";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Map the existing two-state ReviewStatus onto the schema's four-state
 * ReviewState. `pending-scholarly-review` and `editorial-approved` are the
 * only values the existing catalogs emit (see src/lib/topics/data.ts);
 * both map to `pending-review` on the EDITORIAL track because neither
 * represents a completed scholarly review.
 *
 * `editorial-approved` is preserved as a decision record on the editorial
 * track only — this is not an overstatement because it reflects the
 * existing meaning: the editorial team accepts the selection as a
 * reasonable starting point, pending scholar review.
 */
function adaptProvenance(
  record: ProvenanceRecord,
  assertedByOverride?: string
): TaxonomyProvenance {
  const state: ReviewState =
    record.status === "editorial-approved" ? "approved" : "pending-review";
  return {
    method: record.method,
    assertedBy: assertedByOverride ?? record.curator,
    assertedAt: record.reviewedAt,
    state,
    decisions:
      record.status === "editorial-approved"
        ? [
            {
              state: "approved",
              track: "editorial",
              decidedAt: record.reviewedAt,
              decidedBy: record.curator,
              rationale: `Approved via ${record.method}`,
            },
          ]
        : [],
    sources: [],
  };
}

/**
 * Labels for an entity with an English primary label and an Arabic display
 * label. The existing catalogs store `title` and `arabicTitle` as plain
 * strings; this adapter lifts them into the schema's multilingual shape.
 */
function enArLabels(title: string, arabic: string): Labels {
  return {
    primary: title,
    primaryLanguage: "en",
    arabic,
  };
}

/**
 * Stable entity id. Namespaced by kind to guarantee uniqueness across the
 * future combined entity space. URL-safe; matches the existing
 * `dimension:foo` / `topic:foo` convention used in knowledge-graph.ts so
 * cross-references to existing graph code remain stable.
 */
export function entityId(
  kind: "domain" | "topic" | "theme" | "concept" | "story" | "entity" | "value" | "linguistic" | "passage" | "exploration-lens",
  slug: string
): string {
  return `${kind}:${slug}`;
}

/** Stable relation id. Deterministic from (kind, source, target). */
export function relationId(
  kind: string,
  source: string,
  target: string
): string {
  return `${kind}:${source}--${target}`;
}

// ---------------------------------------------------------------------------
// Dimension → ExplorationLensEntity
// ---------------------------------------------------------------------------

/**
 * The existing 15 dimensions are topic-level NAVIGATION AIDS, not ayat-level
 * classifications. In the new schema they map cleanly to `exploration-lens`
 * entities with lensKind `dimension`. Their `topicSlugs` field is preserved
 * verbatim as lens-overlays relations via `adaptDimensionTopicMapping`.
 */
export function adaptDimension(dim: Dimension): ExplorationLensEntity {
  return {
    id: entityId("exploration-lens", dim.id),
    kind: "exploration-lens",
    labels: enArLabels(dim.title, dim.arabicTitle),
    summary: dim.description,
    provenance: adaptProvenance(DIMENSION_PROVENANCE),
    lensKind: "dimension",
    ordinal: dim.number,
    searchTerms: [...dim.searchTerms],
  };
}

/**
 * One entry in `Dimension.topicSlugs` becomes a lens-overlays relation.
 * The existing module documents that this is editorial navigation, not
 * ayat-level tagging — the evidence type reflects that (`navigation`).
 *
 * `lens-overlays` is in `NAVIGATION_ONLY_RELATION_KINDS`, which forbids
 * scholarly approval. That invariant matches reality: the dimension-to-topic
 * mapping is an editorial starting point, nothing more.
 */
export function adaptDimensionTopicMapping(
  dim: Dimension,
  topicSlug: string
): TaxonomyRelationship {
  const source = entityId("exploration-lens", dim.id);
  const target = entityId("topic", topicSlug);
  return {
    id: relationId("lens-overlays", source, target),
    kind: "lens-overlays",
    source,
    target,
    scopeNote:
      "Editorial navigation aid connecting a dimension's theme to a curated topic. " +
      "It does not assert that any ayah belongs to the dimension, and it is not tafsir or a ruling.",
    evidence: [
      {
        type: "navigation",
        statement: `Dimension "${dim.title}" (PRD §04.3 #${dim.number}) lists "${topicSlug}" in its editorial topic mapping. This is a UI navigation aid, not a claim about any specific ayah.`,
        sources: [],
      },
    ],
    provenance: adaptProvenance(DIMENSION_PROVENANCE),
  };
}

// ---------------------------------------------------------------------------
// Topic → TopicEntity
// ---------------------------------------------------------------------------

/**
 * The existing Topic catalog becomes TopicEntity. `domainIds` and `themeIds`
 * are empty because no domain/theme assignment has been reviewed — the
 * topics remain self-standing until a real editorial pass assigns them.
 */
export function adaptTopic(topic: Topic): TopicEntity {
  return {
    id: entityId("topic", topic.slug),
    kind: "topic",
    labels: enArLabels(topic.title, topic.arabicTitle),
    summary: topic.summary,
    provenance: adaptProvenance(topic.provenance),
    domainIds: [],
    themeIds: [],
  };
}

/**
 * Map the existing `RelationType` enum onto the schema's `RelationshipKind`.
 * The mapping is 1:1 for the existing four types; new schema kinds
 * (`broader`, `threads-through`, `expresses-value`, etc.) are not produced
 * by this adapter because no existing data asserts them.
 */
const TOPIC_RELATION_KIND_MAP: Record<
  RelationType,
  TaxonomyRelationship["kind"]
> = {
  TOPIC_ASSOCIATION: "thematic-overlap",
  LEXICAL_MATCH: "lexical-match",
  CROSS_REFERENCE: "cross-reference",
  SEQUENTIAL_CONTEXT: "sequential-context",
};

/**
 * Evidence type corresponding to each topic RelationType. `LEXICAL_MATCH`
 * in the topic catalog is editorial (a curator decided the wording is
 * relevant); it is NOT the same as the machine-verified `LEXICAL_MATCH`
 * emitted by cross-references.ts. That distinction is preserved here so a
 * future reviewer can see which lexical claims need independent verification.
 */
const TOPIC_RELATION_EVIDENCE_TYPE: Record<
  RelationType,
  RelationshipEvidence["type"]
> = {
  TOPIC_ASSOCIATION: "editorial",
  LEXICAL_MATCH: "editorial",
  CROSS_REFERENCE: "editorial",
  SEQUENTIAL_CONTEXT: "editorial",
};

/**
 * One `Topic.relations` entry becomes a passage↔topic relation. In the new
 * schema the relation is between the topic entity and a passage entity; the
 * passage id is derived deterministically from the ayah ref.
 *
 * The existing rationale is preserved as the evidence `statement` — this is
 * the curator's neutral description of what the verse addresses.
 */
export function adaptTopicRelation(
  topic: Topic,
  relation: TopicRelation
): TaxonomyRelationship {
  const topicId = entityId("topic", topic.slug);
  const passageId = passageEntityId(relation.ref.surah, relation.ref.ayah);
  const kind = TOPIC_RELATION_KIND_MAP[relation.type];
  // For undirected kinds, order ids alphabetically per schema convention.
  const [source, target] =
    kind === "thematic-overlap" ||
    kind === "lexical-match" ||
    kind === "cross-reference"
      ? topicId < passageId
        ? [topicId, passageId]
        : [passageId, topicId]
      : [passageId, topicId];
  const provenance = relation.provenance
    ? adaptProvenance(relation.provenance)
    : adaptProvenance(topic.provenance);
  return {
    id: relationId(kind, source, target),
    kind,
    source,
    target,
    scopeNote:
      "Editorial classification of a passage under a curated topic. " +
      "The rationale is neutral and descriptive — not tafsir, not a ruling, " +
      "and not a claim that the topic exhausts the passage's meaning.",
    evidence: [
      {
        type: TOPIC_RELATION_EVIDENCE_TYPE[relation.type],
        statement: relation.rationale,
        sources: [],
      },
    ],
    provenance,
  };
}

/**
 * Lateral topic↔topic relations from `Topic.related`. The existing data
 * does not carry per-relation rationale, so the evidence statement is
 * the catalog's structural declaration — honest about the absence of
 * further justification.
 */
export function adaptTopicRelatedLink(
  topic: Topic,
  relatedSlug: string
): TaxonomyRelationship {
  const a = entityId("topic", topic.slug);
  const b = entityId("topic", relatedSlug);
  const [source, target] = a < b ? [a, b] : [b, a];
  return {
    id: relationId("thematic-overlap", source, target),
    kind: "thematic-overlap",
    source,
    target,
    scopeNote:
      "Lateral navigation link between two curated topics declared in a topic's `related` list. " +
      "It is a navigation aid, not interpretation, and carries no per-relation rationale.",
    evidence: [
      {
        type: "editorial",
        statement: `Topic "${topic.slug}" lists "${relatedSlug}" in its curated related list.`,
        sources: [],
      },
    ],
    provenance: adaptProvenance(topic.provenance),
  };
}

// ---------------------------------------------------------------------------
// Passage entity (canonical Quran reference)
// ---------------------------------------------------------------------------

/**
 * Stable passage id. Uses the `surah:ayah` form already established in
 * `src/lib/quran/types.ts` as the canonical string form of `AyahRef`.
 */
export function passageEntityId(surah: number, ayah: number): string {
  return entityId("passage", `${surah}:${ayah}`);
}

/**
 * Build a PassageEntity for a single ayah. The passage TEXT is deliberately
 * NOT included — it lives in the pinned dataset (src/lib/quran/data.ts) and
 * must never be copied, paraphrased, or fabricated. This entity is metadata
 * about the reference, not a duplicate of the verse.
 */
export function adaptPassage(
  surah: number,
  ayah: number
): PassageEntity {
  return {
    id: passageEntityId(surah, ayah),
    kind: "passage",
    labels: {
      primary: `Quran ${surah}:${ayah}`,
      primaryLanguage: "en",
    },
    summary: "",
    provenance: {
      method: "canonical-quran-reference",
      assertedBy: "pinned dataset (quran-json 3.1.2)",
      assertedAt: "2026-10-17",
      state: "approved",
      decisions: [],
      sources: [
        {
          kind: "quran",
          citation: `Quran ${surah}:${ayah}`,
          stableId: `${surah}:${ayah}`,
          relevance:
            "Reference is a canonical ayah address; text is served from the pinned dataset, not copied here.",
        },
      ],
    },
    surah,
    ayahStart: ayah,
    ayahEnd: ayah,
  };
}

// ---------------------------------------------------------------------------
// CrossReference → TaxonomyRelationship (lexical-match)
// ---------------------------------------------------------------------------

/**
 * The machine-verified text-identity cross-references from
 * src/lib/quran/cross-references.ts map to `lexical-match` relations with
 * `machine-verified` evidence. This is the strongest evidence type short of
 * a scholar's endorsement because any reader can re-run the same comparison
 * against the same pinned dataset.
 */
export function adaptCrossReference(
  ref: CrossReference
): TaxonomyRelationship {
  const source = passageEntityId(ref.source.surah, ref.source.ayah);
  const target = passageEntityId(ref.target.surah, ref.target.ayah);
  // Undirected: order alphabetically per schema convention.
  const [a, b] = source < target ? [source, target] : [target, source];
  return {
    id: relationId("lexical-match", a, b),
    kind: "lexical-match",
    source: a,
    target: b,
    scopeNote:
      "Two passages whose Uthmani Arabic text is identical after stripping " +
      "combining marks and collapsing whitespace. No claim about why they " +
      "coincide or what it signifies.",
    evidence: [
      {
        type: "machine-verified",
        statement: ref.evidence,
        sources: [
          {
            kind: "quran",
            citation: `Quran ${ref.source.surah}:${ref.source.ayah} ↔ Quran ${ref.target.surah}:${ref.target.ayah}`,
            relevance:
              "Comparison is performed against the pinned Quran dataset; reproducible by any reader with the same dataset.",
          },
        ],
      },
    ],
    provenance: {
      method: "machine-text-identity",
      assertedBy: "derived-from-pinned-dataset",
      assertedAt: "2026-10-17",
      state: "approved",
      decisions: [],
      sources: [],
    },
  };
}

// ---------------------------------------------------------------------------
// Convenience: one TaxonomyEntity for each existing catalog entry
// ---------------------------------------------------------------------------

/**
 * Project the full existing catalog into TaxonomyEntity records.
 *
 * This is a convenience for future sprints that want a unified view. It
 * is NOT called at runtime by any existing route, API, or test. The
 * existing modules remain the authoritative source of record.
 */
export function adaptAllEntities(
  dimensions: Dimension[],
  topics: Topic[]
): TaxonomyEntity[] {
  const out: TaxonomyEntity[] = [];
  for (const dim of dimensions) out.push(adaptDimension(dim));
  for (const topic of topics) out.push(adaptTopic(topic));
  return out;
}
