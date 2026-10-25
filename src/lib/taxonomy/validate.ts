// Schema invariants — pure runtime validators for taxonomy data.
//
// These validators run over an in-memory `TaxonomySnapshot` (or over
// individual entities/relations) and report every invariant violation as a
// structured issue rather than throwing. A future data-loading layer will
// run them before accepting new records.
//
// PURE: no side effects, no fs, no network, no clock. Safe to import from
// any context.
//
// The invariants enforced here are the MINIMUM the schema promises:
//
//   1. Every entity has a non-empty id and a valid kind.
//   2. Every relation references entities that exist (no orphans) — unless
//      the snapshot is deliberately partial, in which case the caller must
//      opt in via `{ allowOrphans: true }`.
//   3. Relations between the same (kind, source, target) triple cannot
//      duplicate (deterministic id).
//   4. Undirected relation kinds have source ≤ target (alphabetical).
//   5. `lens-overlays` relations cannot carry scholarly-approval evidence
//      (navigation-only invariant).
//   6. Approved relations require at least one evidence record whose type
//      satisfies MIN_EVIDENCE_FOR_TRACK for the approving track.
//   7. `ReviewDecision.decidedBy` cannot be empty when a decision exists.
//   8. Passage entities have ayahStart ≥ 1 and ayahEnd ≥ ayahStart.
//   9. Entity ids are unique across the snapshot.
//  10. Relation ids are unique across the snapshot.

import {
  type TaxonomyEntity,
  type TaxonomyRelationship,
  type TaxonomySnapshot,
  type RelationshipEvidence,
  type ReviewDecision,
  type ReviewTrack,
  UNDIRECTED_RELATION_KINDS,
  NAVIGATION_ONLY_RELATION_KINDS,
  MIN_EVIDENCE_FOR_TRACK,
} from "./schema";

export type Severity = "error" | "warning";

export interface InvariantIssue {
  severity: Severity;
  code: string;
  /** The entity or relation id this issue concerns. */
  subject: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  issues: InvariantIssue[];
}

function issue(
  severity: Severity,
  code: string,
  subject: string,
  message: string
): InvariantIssue {
  return { severity, code, subject, message };
}

export interface ValidateOptions {
  /**
   * When true, relation references to entities not present in the snapshot
   * are reported as warnings rather than errors. Used for partial snapshots
   * (e.g., a single topic's neighborhood) where the caller knows the rest
   * of the catalog exists elsewhere.
   */
  allowOrphans?: boolean;
}

/**
 * Validate a single entity in isolation. No cross-references — those are
 * checked at the snapshot level.
 */
export function validateEntity(entity: TaxonomyEntity): InvariantIssue[] {
  const out: InvariantIssue[] = [];
  // Structural view sidesteps the discriminated-union narrowing problem:
  // `!entity.id` on a union whose every branch declares `id: string`
  // collapses the type to `never`, breaking subsequent property access.
  // A structural cast preserves runtime behaviour (the fields are still
  // accessed) while keeping the type system happy.
  const e = entity as {
    id?: string;
    kind?: string;
    labels?: { primary?: string; primaryLanguage?: string };
    provenance?: TaxonomyEntity["provenance"];
  };
  if (!e.id || e.id.length === 0) {
    out.push(
      issue("error", "empty-entity-id", "(unknown)", "Entity id is empty.")
    );
  }
  if (!e.kind) {
    out.push(
      issue("error", "missing-kind", e.id ?? "(unknown)", "Entity has no `kind` field.")
    );
  }
  if (!entity.labels || !entity.labels.primary) {
    out.push(
      issue(
        "warning",
        "missing-primary-label",
        entity.id,
        "Entity has no primary label."
      )
    );
  }
  if (!entity.labels || !entity.labels.primaryLanguage) {
    out.push(
      issue(
        "warning",
        "missing-primary-language",
        entity.id,
        "Entity has no primary-language BCP 47 tag."
      )
    );
  }
  if (!entity.provenance) {
    out.push(
      issue("error", "missing-provenance", entity.id, "Entity has no provenance record.")
    );
  } else {
    out.push(...validateProvenance(entity.id, entity.provenance));
  }

  if (entity.kind === "passage") {
    if (entity.ayahStart < 1) {
      out.push(
        issue(
          "error",
          "invalid-ayah-start",
          entity.id,
          `Passage ayahStart must be ≥ 1, got ${entity.ayahStart}.`
        )
      );
    }
    if (entity.ayahEnd < entity.ayahStart) {
      out.push(
        issue(
          "error",
          "invalid-ayah-range",
          entity.id,
          `Passage ayahEnd (${entity.ayahEnd}) must be ≥ ayahStart (${entity.ayahStart}).`
        )
      );
    }
    if (entity.surah < 1 || entity.surah > 114) {
      out.push(
        issue(
          "error",
          "invalid-surah",
          entity.id,
          `Passage surah must be 1..114, got ${entity.surah}.`
        )
      );
    }
  }
  return out;
}

function validateProvenance(
  subject: string,
  provenance: TaxonomyEntity["provenance"]
): InvariantIssue[] {
  const out: InvariantIssue[] = [];
  for (const d of provenance.decisions) {
    out.push(...validateDecision(subject, d));
  }
  return out;
}

function validateDecision(
  subject: string,
  decision: ReviewDecision
): InvariantIssue[] {
  const out: InvariantIssue[] = [];
  if (!decision.decidedBy || decision.decidedBy.length === 0) {
    out.push(
      issue(
        "error",
        "empty-decided-by",
        subject,
        `Review decision on ${decision.track} track is missing a reviewer id. Fabricated approvals are forbidden.`,
      )
    );
  }
  if (!decision.decidedAt || decision.decidedAt.length === 0) {
    out.push(
      issue(
        "error",
        "empty-decided-at",
        subject,
        `Review decision on ${decision.track} track is missing a timestamp.`,
      )
    );
  }
  return out;
}

/**
 * Validate a single relation, assuming both endpoints exist. Orphan checks
 * are performed at the snapshot level.
 */
export function validateRelation(
  relation: TaxonomyRelationship
): InvariantIssue[] {
  const out: InvariantIssue[] = [];
  if (!relation.id) {
    out.push(
      issue("error", "empty-relation-id", "(unknown)", "Relation id is empty.")
    );
  }
  if (!relation.source || !relation.target) {
    out.push(
      issue(
        "error",
        "missing-endpoint",
        relation.id,
        "Relation is missing source or target."
      )
    );
  }
  if (
    UNDIRECTED_RELATION_KINDS.has(relation.kind) &&
    relation.source > relation.target
  ) {
    out.push(
      issue(
        "error",
        "undirected-ordering",
        relation.id,
        `Undirected relation kind "${relation.kind}" must order (source, target) alphabetically; got "${relation.source}" > "${relation.target}".`,
      )
    );
  }
  if (!relation.evidence || relation.evidence.length === 0) {
    out.push(
      issue(
        "error",
        "no-evidence",
        relation.id,
        "Relation has no evidence. Every asserted relation must carry at least one evidence record."
      )
    );
  }
  if (
    NAVIGATION_ONLY_RELATION_KINDS.has(relation.kind) &&
    relation.evidence.some((e) => e.type === "scholarly")
  ) {
    out.push(
      issue(
        "error",
        "navigation-cannot-be-scholarly",
        relation.id,
        `Relation kind "${relation.kind}" is navigation-only and must not carry scholarly evidence. Marking it scholarly would overstate what it asserts.`
      )
    );
  }
  // Evidence-type consistency
  for (const e of relation.evidence ?? []) {
    if (!e.statement || e.statement.length === 0) {
      out.push(
        issue(
          "warning",
          "empty-evidence-statement",
          relation.id,
          `Evidence of type "${e.type}" has an empty statement. State what the evidence actually shows.`
        )
      );
    }
  }
  // Provenance + approval evidence consistency
  if (relation.provenance) {
    out.push(...validateProvenance(relation.id, relation.provenance));
    for (const d of relation.provenance.decisions) {
      if (d.state !== "approved") continue;
      // Cast to `readonly string[]` because the tuple type varies per
      // track (editorial has three allowed types, scholarly has two) and
      // the union's `.includes()` parameter would otherwise narrow to the
      // intersection, rejecting legitimate per-track evidence types.
      const required = MIN_EVIDENCE_FOR_TRACK[d.track] as readonly string[];
      const hasQualifying = (relation.evidence ?? []).some((e) =>
        required.includes(e.type)
      );
      if (!hasQualifying) {
        out.push(
          issue(
            "error",
            "approval-without-qualifying-evidence",
            relation.id,
            `Relation is approved on the ${d.track} track but has no evidence of type: ${required.join(", ")}.`,
          )
        );
      }
    }
  }
  return out;
}

/**
 * Validate an entire snapshot: entity uniqueness, relation uniqueness,
 * orphan detection, plus every entity/relation invariant above.
 */
export function validateSnapshot(
  snapshot: TaxonomySnapshot,
  options: ValidateOptions = {}
): ValidationResult {
  const issues: InvariantIssue[] = [];
  // `entityMapKeys` is the set of snapshot map keys; `entityIdValues` is
  // the set of entity.id field values. A snapshot can have different map
  // keys yet still contain duplicate entity.id values (e.g. a
  // hand-built object with two keys pointing at the same entity). Both
  // problems need to be caught.
  const entityMapKeys = new Set<string>();
  const entityIdValues = new Set<string>();
  const relationIds = new Set<string>();

  for (const [mapKey, entity] of Object.entries(snapshot.entities)) {
    if (mapKey !== entity.id) {
      issues.push(
        issue(
          "error",
          "entity-key-mismatch",
          mapKey,
          `Entity is keyed as "${mapKey}" but has entity.id "${entity.id}". Keys must match.`
        )
      );
    }
    if (entityMapKeys.has(mapKey)) {
      issues.push(
        issue("error", "duplicate-entity-map-key", mapKey, "Duplicate entity map key.")
      );
    } else {
      entityMapKeys.add(mapKey);
    }
    if (entityIdValues.has(entity.id)) {
      issues.push(
        issue(
          "error",
          "duplicate-entity-id",
          entity.id,
          "Duplicate entity.id value in snapshot."
        )
      );
    } else {
      entityIdValues.add(entity.id);
    }
    issues.push(...validateEntity(entity));
  }

  for (const [id, rel] of Object.entries(snapshot.relations)) {
    if (id !== rel.id) {
      issues.push(
        issue(
          "error",
          "relation-key-mismatch",
          id,
          `Relation is keyed as "${id}" but has relation.id "${rel.id}".`
        )
      );
    }
    if (relationIds.has(id)) {
      issues.push(
        issue("error", "duplicate-relation-id", id, "Duplicate relation id.")
      );
    } else {
      relationIds.add(id);
    }
    issues.push(...validateRelation(rel));

    const sourcePresent = entityIdValues.has(rel.source);
    const targetPresent = entityIdValues.has(rel.target);
    if (!sourcePresent || !targetPresent) {
      const missing: string[] = [];
      if (!sourcePresent) missing.push(`source="${rel.source}"`);
      if (!targetPresent) missing.push(`target="${rel.target}"`);
      issues.push(
        issue(
          options.allowOrphans ? "warning" : "error",
          "dangling-endpoint",
          rel.id,
          `Relation references a missing entity: ${missing.join(", ")}.`,
        )
      );
    }
  }

  return {
    ok: issues.every((i) => i.severity !== "error"),
    issues,
  };
}

/**
 * Type guard: does this evidence record satisfy the minimum for the given
 * review track? Exported for use by a future data-ingestion layer.
 */
export function evidenceSatisfiesTrack(
  evidence: RelationshipEvidence,
  track: ReviewTrack
): boolean {
  return (MIN_EVIDENCE_FOR_TRACK[track] as readonly string[]).includes(
    evidence.type
  );
}
