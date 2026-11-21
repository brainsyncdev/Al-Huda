# MFD-12 Graph Integrity Rules & Validation Constraints

- **Workstream:** MFD-12 (Unified FAHM Knowledge Architecture)
- **Version:** 1.0.0
- **Generated At:** 2026-11-21T01:05:00+05:00[Asia/Karachi]
- **Status:** Draft Specification
- **Scope:** RESEARCH ONLY — Defines validation rules for the knowledge graph. No production data modification.

---

## 1. Core Integrity Principles

The FAHM Knowledge Graph must maintain scholarly rigor, structural coherence, and provenance transparency. All validation rules are designed to prevent semantic drift, ensure evidentiary accountability, and preserve the distinction between Quranic text, scholarly interpretation, and editorial organization.

### 1.1 Evidence Hierarchy Enforcement
All relationships MUST respect the evidence classification hierarchy defined in `MFD-12-RELATIONSHIP-TAXONOMY.json`. Queries and traversals MUST NOT silently cross evidence boundaries.

| Level | Tag | Description | Trust Weight |
|-------|-----|-------------|--------------|
| 1 | `quranic-explicit` | Directly stated in Quranic text with unambiguous wording | Highest |
| 2 | `verified-extraction` | Extracted via validated NLP/corpus analysis with human verification | High |
| 3 | `lexical-analysis` | Derived from root/form/semantic field analysis | Medium-High |
| 4 | `tafsir-reference` | Supported by classical or contemporary exegetical scholarship | Medium |
| 5 | `scholarly-review` | Validated by qualified scholars but not explicit in text | Medium |
| 6 | `fiqh-derived` | Juristic deduction or legal reasoning | Context-Dependent |
| 7 | `editorial-classification` | Structural/taxonomic decision by curators/AI | Lowest (Organizational) |

**Rule:** A relationship cannot claim a higher evidence level than its weakest supporting citation. If multiple evidences exist, the displayed confidence MUST reflect the aggregate quality, not just the highest single source.

---

## 2. Node Integrity Rules

### 2.1 No Orphan Nodes Policy
- **Definition:** Every node (Topic, Dimension, Domain) MUST have at least one incoming or outgoing edge of type `EDITORIAL_CLASSIFICATION` (structural) OR at least one semantic relationship (`DIRECT_QURANIC_REFERENCE`, `THEMATIC_RELATION`, etc.).
- **Rationale:** Orphan nodes indicate incomplete taxonomy integration or abandoned concepts.
- **Exception:** Newly created nodes may remain orphaned for a maximum grace period of 7 days or until the next review cycle, whichever comes first. They must be tagged `status: draft-integration`.
- **Validation Query:** `MATCH (n) WHERE NOT (n)--() RETURN n.id, n.type, n.createdAt`

### 2.2 Node Type Conformance
- Nodes MUST conform to the schema defined in `domains.json`, `dimensions.json`, or `topics.json`.
- Ad-hoc node creation outside these registries is PROHIBITED without a corresponding taxonomy update proposal.
- **Validation:** Foreign key checks against canonical taxonomy files during ingestion.

### 2.3 Provenance Completeness
- Every node MUST have a `provenance` field matching one of the allowed tags in the Relationship Taxonomy.
- Nodes with `provenance: pending-scholarly-review` MUST NOT be used as authoritative sources for `CONTEMPORARY_APPLICATION` or `TAFSIR_SUPPORTED` edges until reviewed.

---

## 3. Edge Integrity Rules

### 3.1 Invalid Edge Type Handling
- Only relationship types defined in `MFD-12-RELATIONSHIP-TAXONOMY.json` are permitted.
- Legacy types (`CONTAINS`, `CROSS_REFERENCES`, `SHARES_CONCEPT`) from `relationships.json` MUST be migrated:
  - `CONTAINS` → `EDITORIAL_CLASSIFICATION`
  - `CROSS_REFERENCES` → `THEMATIC_RELATION` or `LEXICAL_RELATION` (depending on basis)
  - `SHARES_CONCEPT` → `THEMATIC_RELATION`
- **Rejection:** Ingestion pipelines MUST reject undefined edge types with error code `ERR_INVALID_REL_TYPE`.

### 3.2 Duplicate Relationship Handling
- **Definition:** Two edges are duplicates if they share identical `(source_id, target_id, type)` tuples.
- **Policy:** Duplicates are PROHIBITED.
- **Resolution Strategy:**
  1. If metadata differs (e.g., different evidence keys), MERGE into a single edge with an array of `evidence_refs`.
  2. If metadata is identical, DISCARD the redundant entry.
  3. Log all merge/discard actions to `integrity_audit_log`.
- **Validation:** Unique constraint on `(source_id, target_id, type)` in graph database schema.

### 3.3 Directionality Enforcement
- Directed relationships MUST respect the direction specified in the taxonomy.
- Bidirectional relationships MUST be stored as TWO directed edges OR a single undirected edge type if the backend supports it. For property graphs requiring direction, store both `(A)->(B)` and `(B)->(A)` with a shared `relationship_group_id` to prevent accidental deletion of only one half.
- **Violation Detection:** Periodic scan for reverse-direction violations on asymmetric types.

### 3.4 Cardinality Constraints
- Relationships specifying `one-to-one` cardinality MUST trigger a warning if a second edge is proposed.
- Relationships specifying `one-to-many` MUST enforce max-target limits where defined (e.g., `DIRECT_QURANIC_REFERENCE` typically has no hard cap but should flag >50 mappings per topic for review).

---

## 4. Cycle Detection & Semantics

### 4.1 Allowed Cycles
- **Thematic/Lexical Cycles:** Permitted and expected. Concepts often mutually define each other (e.g., `tawheed` ↔ `shirk` via CONTRAST; `sabr` ↔ `shukr` via THEMATIC).
- **Narrative Cycles:** Permitted within story arcs (e.g., Musa ↔ Firawn ↔ Musa).

### 4.2 Prohibited Cycles
- **Hierarchical Cycles:** `EDITORIAL_CLASSIFICATION` edges MUST form a Directed Acyclic Graph (DAG). A Domain cannot contain itself directly or transitively.
- **Reference Cycles:** `DIRECT_QURANIC_REFERENCE` SHOULD NOT form cycles (a verse mapping should not point back to a topic that points to the same mapping in a circular dependency without intermediate nodes).

### 4.3 Cycle Detection Algorithm
- Run Tarjan’s Strongly Connected Components algorithm on the `EDITORIAL_CLASSIFICATION` subgraph after every batch update.
- Report any SCC with size > 1 as `CRITICAL_INTEGRITY_VIOLATION`.
- For semantic cycles, compute cycle length; flag cycles > 10 hops for manual review as potential "semantic noise."

---

## 5. Evidence Classification Boundaries

### 5.1 Strict Boundary Rule
Queries MUST expose evidence boundaries explicitly. A query for "Quranic teachings on peace" MUST NOT return results derived solely from `fiqh-derived` or `editorial-classification` edges unless the user explicitly opts into "Include Scholarly Extensions."

### 5.2 Provenance Filtering API
All graph traversal endpoints MUST accept an `evidence_filter` parameter:
```json
{
  "min_level": "quranic-explicit",
  "allowed_tags": ["quranic-explicit", "verified-extraction"],
  "exclude_tags": ["pending-scholarly-review"]
}
```
Default behavior: Return ALL levels but TAG results with their highest evidence level. Never silently promote lower-evidence connections.

### 5.3 Cross-Boundary Linking
When a `CONTEMPORARY_APPLICATION` edge links a `quranic-explicit` node to a `fiqh-derived` node:
- The edge itself MUST carry `provenance: fiqh-derived`.
- The UI/rendering layer MUST visually distinguish this link from purely Quranic connections.
- Rationale: Prevents users from assuming modern applications have the same authority as the base text.

---

## 6. Migration & Legacy Data Rules

### 6.1 Existing relationships.json Migration
The current `data/taxonomy/relationships.json` contains 152 entries using legacy types. Migration rules:

| Legacy Type | Target Type | Migration Notes |
|-------------|-------------|------------------|
| `CONTAINS` | `EDITORIAL_CLASSIFICATION` | Preserve parent-child hierarchy exactly. |
| `CROSS_REFERENCES` | `THEMATIC_RELATION` OR `LEXICAL_RELATION` | Requires manual/AI-assisted reclassification based on description field. Default to THEMATIC if uncertain. |
| `SHARES_CONCEPT` | `THEMATIC_RELATION` | Direct mapping. Add `theme_label` property from description. |

### 6.2 Provenance Upgrade Path
All migrated edges inherit `provenance: pending-scholarly-review` regardless of original tag. They must pass through the standard review workflow before being upgraded to `verified-extraction` or higher.

---

## 7. Audit & Compliance

### 7.1 Integrity Audit Log
Every violation, merge, migration, or manual override MUST be logged to `research/mfd-12/logs/integrity_audit.jsonl` with:
- Timestamp
- Actor (agent-id or human-reviewer)
- Rule violated/enforced
- Affected node/edge IDs
- Resolution action taken

### 7.2 Periodic Health Checks
- **Daily:** Orphan node scan, duplicate edge check.
- **Weekly:** Hierarchical cycle detection, provenance completeness audit.
- **Monthly:** Full evidence boundary compliance report.

### 7.3 Scholarly Review Gate
No graph segment can be marked `status: published` until:
1. Zero critical integrity violations.
2. All `pending-scholarly-review` nodes in that segment have been processed.
3. At least one qualified reviewer has signed off on the segment's evidence boundaries.

---

## Appendix: Validation Pseudocode

```python
def validate_edge(edge):
    # 1. Type Check
    if edge.type not in ALLOWED_RELATIONSHIP_TYPES:
        raise IntegrityError(f"Invalid type: {edge.type}")
    
    # 2. Directionality Check
    spec = RELATIONSHIP_TAXONOMY[edge.type]
    if spec.directionality == "directed" and edge.source_type not in spec.allowed_source_types:
        raise IntegrityError(f"Invalid source type for {edge.type}")
    
    # 3. Duplicate Check
    if exists(edge.source_id, edge.target_id, edge.type):
        return ResolutionAction.MERGE_OR_DISCARD
    
    # 4. Evidence Sufficiency
    if edge.evidence_level < spec.min_evidence_level:
        raise IntegrityError(f"Insufficient evidence for {edge.type}")
    
    return ValidationResult.PASS
```

---

*This document is normative for MFD-12 graph construction. Deviations require written exception approval from the Lead Architect.*
