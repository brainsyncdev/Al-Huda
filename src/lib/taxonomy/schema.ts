// Extensible Quran Knowledge Taxonomy — schema types.
//
// TYPES-ONLY MODULE: this file defines the shape of a future knowledge graph
// that can represent multiple complementary classification systems. It does
// NOT populate any entities, migrate any existing data, or change any runtime
// behavior. Existing `Dimension`, `Topic`, `CrossReference`, and
// `LearningPath` modules remain authoritative for the entities they own;
// this schema is a forward-looking contract for subsequent sprints.
//
// Why a schema-first sprint rather than a data-first sprint:
//
//   The current 15 dimensions and 11 topics are an initial navigation
//   foundation, not an exhaustive representation of the Quran. Adding more
//   concepts, stories, entities, and linguistic facts without a stable shape
//   would either (a) force every new idea into one of two existing buckets,
//   or (b) require a redesign each time a new classification dimension is
//   discovered. This module locks the SHAPE while leaving the CONTENT to be
//   populated incrementally and review-gated.
//
// DESIGN PRINCIPLES:
//
//   1. Entity kinds are a discriminated union, not a stringly-typed field.
//      Adding a new kind is an additive TypeScript change, not a migration.
//
//   2. Relationships carry an explicit KIND and optional directionality.
//      "Broader/narrower" is not the same relation as "thematically overlaps"
//      and should not be conflated.
//
//   3. Every edge carries an EVIDENCE array. A proposed relation with no
//      evidence cannot be marked approved.
//
//   4. Review state is explicit and multi-valued:
//      proposed → pending-review → { approved, rejected }
//      with separate scholarly and editorial tracks where appropriate.
//
//   5. Stable identifiers are independent of display names. Slugs may change
//      for display reasons; `id` does not.
//
//   6. Labels are multilingual by default (Arabic + English minimum), with
//      optional additional languages. No language is fabricated.
//
//   7. Empty or incomplete categories are allowed. The schema does not
//      require every entity to have a parent, children, or relations.
//
// COMPATIBILITY:
//
//   The existing `Dimension`, `Topic`, and `CrossReference` entities can be
//   represented in this schema via the adapters in ./compatibility.ts. Those
//   adapters are type-level only — no existing consumer needs to change.

// ---------------------------------------------------------------------------
// Schema versioning
// ---------------------------------------------------------------------------

/**
 * Bumped when the schema shape changes in a way that would break a
 * hypothetical serializer. Content (entities, relations) is not versioned
 * here — that is a separate concern for a future data layer.
 */
export const TAXONOMY_SCHEMA_VERSION = "1" as const;

// ---------------------------------------------------------------------------
// Review state
// ---------------------------------------------------------------------------

/**
 * Lifecycle of a claim (entity existence, relation assertion, evidence).
 *
 * - proposed:       asserted by a contributor, no review started
 * - pending-review: under editorial or scholarly review
 * - approved:       review completed in favor (track-specific — see
 *                   `ReviewTrack`)
 * - rejected:       review completed against; kept for audit, never shown
 *                   as authoritative
 *
 * Rejected records are retained (not deleted) so the same proposal cannot be
 * silently re-asserted without a fresh review.
 */
export type ReviewState =
  | "proposed"
  | "pending-review"
  | "approved"
  | "rejected";

/**
 * Approval tracks. A relation may be editorially approved (the editorial
 * team accepts the classification as a reasonable starting point) without
 * being scholarly approved (a qualified scholar has reviewed and endorsed
 * it). The two tracks are independent; a UI can show either or both.
 */
export type ReviewTrack = "editorial" | "scholarly";

/**
 * A review decision. `decidedAt` is the actual decision timestamp; never
 * backdate or fabricate. `decidedBy` is a stable reviewer identifier — a
 * string key into a real reviewer registry, not a free-form name. When no
 * real reviewer has made a decision, this record must not exist.
 */
export interface ReviewDecision {
  state: "approved" | "rejected";
  track: ReviewTrack;
  decidedAt: string; // ISO 8601
  decidedBy: string; // stable reviewer id — must resolve to a real reviewer
  rationale?: string;
}

/**
 * Publication-state envelope, modeled after the existing ProvenanceRecord
 * in src/lib/topics/data.ts but extended with the richer state machine
 * above. Existing provenance records are backward-compatible: their
 * `status` field maps to `state`, their `reviewedAt` maps to a decision
 * timestamp, and their `curator` maps to `decidedBy`.
 */
export interface TaxonomyProvenance {
  method: string;
  /** Free-form attribution for the initial assertion. */
  assertedBy: string;
  assertedAt: string;
  state: ReviewState;
  /** Zero or more review decisions, one per track. */
  decisions: ReviewDecision[];
  /**
   * Optional source references supporting the assertion itself (not the
   * relations — those live on the relation). Empty when the entity is a
   * structural navigation aid (e.g., an ExplorationLens) rather than a
   * claim about the Quran.
   */
  sources: SourceReference[];
}

/**
 * A cited source for a claim. `kind` distinguishes primary Quran text,
 * named tafsir works, hadith collections, linguistic references, and
 * editorial notes. Never fabricate a source; leave the array empty when
 * the claim is editorial-only.
 */
export interface SourceReference {
  kind:
    | "quran"
    | "tafsir"
    | "hadith"
    | "linguistic"
    | "editorial"
    | "external";
  /** Human-readable citation. For Quran, use "Quran 2:255"-style refs. */
  citation: string;
  /** Stable identifier where one exists (ISBN, hadith number, URL). */
  stableId?: string;
  /** Short note on how the source supports the claim. */
  relevance?: string;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

/**
 * Multilingual labels. `primary` is the canonical editorial language for
 * this entity (e.g., "en" for English-authored topics, "ar" for a root).
 * `arabic` is required when the entity has an Arabic rendering — omit it
 * rather than guess. `additional` is a BCP 47 → string map for any other
 * languages that have actually been supplied.
 */
export interface Labels {
  primary: string;
  primaryLanguage: string; // BCP 47
  arabic?: string;
  transliteration?: string;
  additional?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Entity kinds
// ---------------------------------------------------------------------------

/**
 * The set of entity kinds the schema can represent. Each kind has its own
 * optional fields in the discriminated union below.
 *
 * Adding a new kind:
 *   1. Add a new string literal to this union.
 *   2. Add a new branch to `TaxonomyEntity` with kind-specific fields.
 *   3. Update the documentation in SPRINT-31-REPORT.md (taxonomy gap report).
 *   No existing consumer breaks — the union is closed at compile time but
 *   the runtime shape (a `kind` field plus optional fields) is stable.
 */
export type EntityKind =
  | "domain"
  | "topic"
  | "theme"
  | "concept"
  | "story"
  | "entity"
  | "value"
  | "linguistic"
  | "passage"
  | "exploration-lens";

/**
 * Base fields shared by every entity regardless of kind. Concrete entity
 * types below extend this.
 */
export interface EntityBase {
  /** Stable identifier, independent of display name. URL-safe. */
  id: string;
  kind: EntityKind;
  labels: Labels;
  /** One-paragraph editorial summary. Empty string when genuinely unknown. */
  summary: string;
  provenance: TaxonomyProvenance;
}

/**
 * A broad organizational area (belief, worship, ethics, family, society,
 * creation, …). Domains may have multiple parents and multiple children;
 * they are NOT required to form a tree.
 */
export interface DomainEntity extends EntityBase {
  kind: "domain";
  /** Optional parent domain ids. Empty means top-level. */
  parentIds: string[];
  /**
   * Non-exhaustive list of sub-domain ids. Omit rather than fabricate.
   * Consumers that need the full transitive closure should traverse the
   * relation graph.
   */
  subDomainIds: string[];
}

/**
 * A subject that can be explored independently. This is the direct
 * successor to the existing `Topic` catalog — same concept, richer
 * metadata, many-to-many parent domains.
 */
export interface TopicEntity extends EntityBase {
  kind: "topic";
  /** Domains this topic sits in. Zero or more. */
  domainIds: string[];
  /** Themes this topic participates in. */
  themeIds: string[];
}

/**
 * A recurring concept that connects multiple topics across passages
 * (e.g., "divine mercy" as a cross-cutting thread). Themes are not
 * themselves domains — they are threads that run through domains.
 */
export interface ThemeEntity extends EntityBase {
  kind: "theme";
  /** Topics this theme threads together. */
  topicIds: string[];
}

/**
 * A defined idea with explicit relationships to other concepts
 * (e.g., tawhid, nubuwwah, qadar). Distinct from a topic in that a
 * concept is usually a doctrinal or theological unit rather than a
 * life-situation theme.
 */
export interface ConceptEntity extends EntityBase {
  kind: "concept";
  /** Domain(s) in which this concept is primarily discussed. */
  domainIds: string[];
}

/**
 * A narrative or connected set of passages concerning a prophet,
 * community, or event (e.g., the story of Yusuf, the people of 'Ad).
 * `passageIds` references canonical Quran passages when the story is
 * Quran-sourced; `externalSources` covers extra-Quranic context that
 * has been explicitly cited.
 */
export interface StoryEntity extends EntityBase {
  kind: "story";
  /** Canonical Quran passages that constitute or reference this story. */
  passageIds: string[];
  /** Named entities that appear in this story (prophets, peoples, places). */
  participantIds: string[];
}

/**
 * A referenced person, group, place, or other identifiable entity where
 * supported by verified data. This is NOT a claim that the entity exists
 * historically outside the Quran — it is a record of the entity's
 * presence in the text and in reviewed sources.
 */
export interface EntityEntity extends EntityBase {
  kind: "entity";
  entityClass: "person" | "group" | "place" | "artifact" | "other";
  /**
   * Quran passages where this entity is mentioned. Empty when the entity
   * is extra-Quranic context only.
   */
  mentionedIn: string[];
}

/**
 * A moral or practical principle (e.g., "justice as witness", "prohibition
 * of riba") where supported by evidence. Distinct from a concept by its
 * normative character.
 */
export interface ValueEntity extends EntityBase {
  kind: "value";
  /**
   * "positive" = a principle the Quran enjoins; "negative" = a principle
   * the Quran warns against; "neutral" = descriptive.
   */
  polarity: "positive" | "negative" | "neutral";
  domainIds: string[];
}

/**
 * A verified linguistic fact — word, lemma, root, grammatical feature,
 * or expression. Only to be created when suitable source data exists; the
 * pinned dataset carries word-by-word segmentation but not validated
 * morphology, so root/lemma entities cannot yet be safely populated.
 */
export interface LinguisticEntity extends EntityBase {
  kind: "linguistic";
  linguisticClass: "word" | "lemma" | "root" | "expression" | "grammatical";
  /** The Arabic form itself, in Uthmani script. */
  arabicForm: string;
  /** Occurrences as surah:ayah refs. Empty when not yet indexed. */
  occurrences: string[];
}

/**
 * A canonical reference to a Quran passage — a single ayah, a range of
 * ayat, or a named passage (e.g., Ayat al-Kursi, the Light Verse). The
 * text is supplied by the pinned dataset; this entity is metadata about
 * the reference, not a copy of the text.
 */
export interface PassageEntity extends EntityBase {
  kind: "passage";
  /** 1-based surah number. */
  surah: number;
  /** 1-based start ayah. */
  ayahStart: number;
  /** 1-based end ayah, inclusive. For a single ayah, equals ayahStart. */
  ayahEnd: number;
  /**
   * Optional well-known name (e.g., "Ayat al-Kursi"). Omit rather than
   * invent — most passages have no such name.
   */
  traditionalName?: string;
}

/**
 * A user-facing exploration lens — the existing 15 dimensions fit here,
 * as would any future alternative way of navigating (by story, by root,
 * by chronology). Lenses are navigation aids, not claims about the Quran.
 */
export interface ExplorationLensEntity extends EntityBase {
  kind: "exploration-lens";
  /** What kind of lens this is. */
  lensKind: "dimension" | "chronology" | "audience" | "custom";
  /**
   * Stable ordinal for display ordering within a lens family. The existing
   * 15 dimensions use their PRD §04.3 number here.
   */
  ordinal: number | null;
  /** Suggested search terms — derived, not a controlled vocabulary. */
  searchTerms: string[];
}

/**
 * Discriminated union of all entity kinds. Discriminator is `kind`.
 */
export type TaxonomyEntity =
  | DomainEntity
  | TopicEntity
  | ThemeEntity
  | ConceptEntity
  | StoryEntity
  | EntityEntity
  | ValueEntity
  | LinguisticEntity
  | PassageEntity
  | ExplorationLensEntity;

// ---------------------------------------------------------------------------
// Relationship kinds
// ---------------------------------------------------------------------------

/**
 * Typed relations. Directionality is encoded per kind:
 *
 *   BROADER / NARROWER     — directional (parent → child)
 *   THEMATIC_OVERLAP       — undirected
 *   LEXICAL_MATCH          — undirected, machine-verifiable
 *   CROSS_REFERENCE        — undirected, textual
 *   SEQUENTIAL_CONTEXT     — directional (precedes → follows)
 *   REFERENCES_PASSAGE     — directional (entity → passage)
 *   PARTICIPATES_IN_STORY — directional (entity → story)
 *   EXPRESSES_VALUE        — directional (passage → value)
 *   THREADS_THROUGH        — directional (theme → topic)
 *   LENS_OVERLAYS          — directional (lens → topic/domain)
 *
 * Adding a new kind: extend the union and update the documentation. Do
 * not overload an existing kind to cover a new semantic.
 */
export type RelationshipKind =
  | "broader"
  | "narrower"
  | "thematic-overlap"
  | "lexical-match"
  | "cross-reference"
  | "sequential-context"
  | "references-passage"
  | "participates-in-story"
  | "expresses-value"
  | "threads-through"
  | "lens-overlays";

/**
 * Evidence for one specific relationship. Distinct from the entity-level
 * sources in `TaxonomyProvenance.sources`.
 *
 * Evidence types:
 *   - machine-verified: derived algorithmically from the pinned dataset
 *     (e.g., text-identity match). Requires no scholarly approval.
 *   - lexical: based on shared Arabic vocabulary, without full morphology.
 *     Weaker than machine-verified; requires editorial review.
 *   - editorial: a curator's reasoned judgment, stated transparently.
 *     Requires editorial review at minimum.
 *   - scholarly: a qualified scholar has endorsed the classification.
 *     Requires a real reviewer id in `decidedBy`.
 *   - navigation: a pure UI/navigation aid. No claim about the Quran.
 */
export interface RelationshipEvidence {
  type:
    | "machine-verified"
    | "lexical"
    | "editorial"
    | "scholarly"
    | "navigation";
  /** What the evidence actually shows, in neutral language. */
  statement: string;
  /** Supporting source references, if any. */
  sources: SourceReference[];
}

/**
 * A typed, evidenced relationship between two entities.
 *
 * `source` and `target` are stable entity ids. For undirected kinds
 * (thematic-overlap, lexical-match, cross-reference), the convention is
 * to order ids alphabetically so deduplication is trivial.
 */
export interface TaxonomyRelationship {
  /** Stable id; deterministic from (kind, source, target). */
  id: string;
  kind: RelationshipKind;
  source: string;
  target: string;
  /**
   * Plain-language note on what the relation does and does not assert.
   * Modeled after the existing `scopeNote` in knowledge-graph.ts.
   */
  scopeNote: string;
  /** At least one evidence record required for approval. */
  evidence: RelationshipEvidence[];
  provenance: TaxonomyProvenance;
}

// ---------------------------------------------------------------------------
// Validation helpers (type-level, no runtime data dependency)
// ---------------------------------------------------------------------------

/**
 * Extract the entity record for a given kind. Useful in consumers that
 * narrow from the union to a specific shape.
 */
export type EntityOf<K extends EntityKind> = Extract<
  TaxonomyEntity,
  { kind: K }
>;

/**
 * The set of relation kinds that are symmetric / undirected. Consumers
 * that render bidirectional edges can use this to decide whether to show
 * arrows.
 */
export const UNDIRECTED_RELATION_KINDS: ReadonlySet<RelationshipKind> = new Set(
  [
    "thematic-overlap",
    "lexical-match",
    "cross-reference",
  ]
);

/**
 * Minimum evidence-type required for each review track. This is a
 * policy statement, not a runtime enforcer — downstream code that adds
 * a relationship is expected to honor it. Encoded as a const map so a
 * future validator can read it.
 *
 *   editorial: at least one "editorial" or stronger evidence
 *   scholarly: at least one "scholarly" evidence
 *
 * "machine-verified" evidence counts toward both tracks because the
 * underlying fact (e.g., text identity) is independently re-verifiable.
 */
export const MIN_EVIDENCE_FOR_TRACK = {
  editorial: ["machine-verified", "editorial", "scholarly"],
  scholarly: ["machine-verified", "scholarly"],
} as const satisfies Record<ReviewTrack, RelationshipEvidence["type"][]>;

/**
 * Relation kinds that MUST NOT carry scholarly approval because they are
 * pure navigation aids. Attempting to mark a `lens-overlays` relation
 * as scholarly-approved would overstate what the edge asserts.
 */
export const NAVIGATION_ONLY_RELATION_KINDS: ReadonlySet<RelationshipKind> =
  new Set(["lens-overlays"]);

/**
 * Relation kinds for which `machine-verified` evidence counts toward
 * SCHOLARLY approval. This is a narrow, closed set: only purely textual,
 * non-interpretive relations can be approved by a machine comparison
 * without a human scholar's judgment.
 *
 *   lexical-match     — text identity after normalization
 *   cross-reference   — textual correspondence
 *
 * For every other relation kind (thematic-overlap, expresses-value,
 * threads-through, references-passage, participates-in-story, broader,
 * narrower, sequential-context, lens-overlays), machine-verified evidence
 * is NOT sufficient for the scholarly track. A real authorized reviewer
 * decision is required.
 *
 * Rationale: a reproducible text-identity fact ("ayat 2:5 and 2:6 share
 * identical wording") is a different epistemic category from a thematic
 * or doctrinal classification ("this ayah expresses tawakkul"). The
 * former needs no human judgment; the latter requires qualified expertise.
 * Collapsing these two into a single evidence tier would conflate
 * mechanical derivation with scholarly review and fabricate approval the
 * project is not authorized to grant.
 */
export const MACHINE_VERIFIED_SCHOLARLY_RELATIONS: ReadonlySet<RelationshipKind> =
  new Set(["lexical-match", "cross-reference"]);

// ---------------------------------------------------------------------------
// Schema contract
// ---------------------------------------------------------------------------

/**
 * A complete taxonomy snapshot at a point in time. A future data layer
 * would produce one of these; the schema does not dictate storage.
 *
 * `entities` and `relations` are keyed by id for O(1) lookup. `orphans`
 * is a computed set of entity ids referenced by a relation but absent
 * from the entities map — surfaced rather than silently dropped,
 * matching the existing `unresolved` pattern in knowledge-graph.ts.
 */
export interface TaxonomySnapshot {
  schemaVersion: typeof TAXONOMY_SCHEMA_VERSION;
  entities: Record<string, TaxonomyEntity>;
  relations: Record<string, TaxonomyRelationship>;
  /** Entity ids referenced but not present. */
  orphans: string[];
  /** Human-readable notes about the snapshot. */
  notes: string[];
}
