# MFD-12 Knowledge Graph Specification

- **Workstream:** MFD-12 (Unified FAHM Knowledge Architecture)
- **Version:** 1.0.0
- **Generated At:** 2026-11-21T01:10:00+05:00[Asia/Karachi]
- **Author:** WS2-Agent-95
- **Status:** Draft Specification
- **Dependencies:** 
  - `data/taxonomy/domains.json`
  - `data/taxonomy/dimensions.json`
  - `data/taxonomy/topics.json`
  - `data/taxonomy/relationships.json` (legacy, to be migrated)
  - `research/mfd-11/synthesis/proposed-hierarchy.json`
  - `research/mfd-11/reports/MFD-11.3-WORKSTREAM-A-WAR-PEACE.md`
  - `research/mfd-11/reports/MFD-11.3-WORKSTREAM-B-ARTS-BEAUTY.md`

---

## 1. Overview

This specification defines the architecture for the FAHM (Faith-Aligned Holistic Map) Knowledge Graph. It establishes a rigorous, evidence-based framework for representing Quranic knowledge that distinguishes clearly between divine text, scholarly interpretation, linguistic analysis, and editorial organization. The graph is designed to support scholarly research, educational applications, and semantic search while maintaining strict integrity boundaries.

### 1.1 Design Philosophy
1. **Text-Centric Authority:** The Quranic text is the primary source of truth. All other layers are subordinate and explicitly labeled.
2. **Provenance Transparency:** Every node and edge carries metadata about its origin, confidence level, and review status.
3. **Semantic Precision over Convenience:** Relationships are typed strictly to prevent conflation of lexical, thematic, and structural connections.
4. **Scholarly Review Integration:** The graph architecture embeds review workflows as first-class citizens, not afterthoughts.

---

## 2. Node Types & Schema

The graph consists of four primary node types aligned with the existing taxonomy files.

### 2.1 Domain
- **Source:** `domains.json`
- **Role:** Top-level thematic container (e.g., `belief-theology`, `war-peace-conflict`).
- **Properties:** `id`, `title`, `urduTitle`, `arabicTitle`, `description`, `scope`, `dimensionIds[]`.
- **Constraints:** Must contain at least one Dimension. Cannot be leaf nodes.

### 2.2 Dimension
- **Source:** `dimensions.json`
- **Role:** Sub-thematic grouping within a Domain (e.g., `jihad-concept`, `moral-virtues`).
- **Properties:** `id`, `title`, `parentDomainId`, `subdimensionIds[]`, `topicIds[]`, `aliases[]`.
- **Constraints:** Must belong to exactly one Domain. May contain Subdimensions or Topics.

### 2.3 Topic
- **Source:** `topics.json`
- **Role:** Atomic unit of Quranic knowledge/concept (e.g., `tawheed-fundamentals`, `rules-of-engagement`).
- **Properties:** `id`, `slug`, `title`, `description`, `scope`, `parentDimensionId`, `ayahMappings[]`, `relatedTopicIds[]`, `provenance`, `quranicRelevance`.
- **Constraints:** Must belong to exactly one Dimension (or Subdimension). Leaf node in structural hierarchy but hub in semantic network.

### 2.4 Ayah Mapping / Verse Key
- **Source:** Derived from `ayahMappings` in topics + corpus extraction.
- **Role:** Represents a specific Quranic verse reference linked to a Topic.
- **Properties:** `verse_key` (e.g., "2:190"), `arabic_text_fragment`, `translation_reference`, `root_words[]`, `morphological_form`.
- **Note:** These are treated as first-class nodes to enable verse-centric traversal and lexical analysis.

---

## 3. Relationship Taxonomy Summary

Detailed definitions are provided in `MFD-12-RELATIONSHIP-TAXONOMY.json`. Below is the functional summary.

| ID | Label | Direction | Primary Use Case |
|----|-------|-----------|------------------|
| `DIRECT_QURANIC_REFERENCE` | Direct Quranic Reference | Topic → Ayah | Grounding concepts in text |
| `LEXICAL_RELATION` | Lexical Relation | Bidirectional | Root/shared vocabulary links |
| `MORPHOLOGICAL_RELATION` | Morphological Relation | Directed | Verb form derivations |
| `THEMATIC_RELATION` | Thematic Relation | Bidirectional | Cross-domain concept sharing |
| `TAFSIR_SUPPORTED` | Tafsir Supported | Directed | Exegetical validation |
| `EDITORIAL_CLASSIFICATION` | Editorial Classification | Parent → Child | Structural hierarchy |
| `CONTRAST` | Contrast / Antonymy | Bidirectional | Theological/ethical binaries |
| `CONTEMPORARY_APPLICATION` | Contemporary Application | Principle → App | Modern relevance bridging |
| `NARRATIVE_RELATION` | Narrative Relation | Directed/Bidi | Story/event sequencing |

### 3.1 Migration from Legacy Types
Existing `relationships.json` uses `CONTAINS`, `CROSS_REFERENCES`, and `SHARES_CONCEPT`. These map as follows:
- `CONTAINS` → `EDITORIAL_CLASSIFICATION`
- `CROSS_REFERENCES` → `THEMATIC_RELATION` (default) or `LEXICAL_RELATION` (if root-based)
- `SHARES_CONCEPT` → `THEMATIC_RELATION`

---

## 4. Traversal Rules & Query Semantics

### 4.1 Evidence-Aware Traversal
All queries MUST respect evidence boundaries. The default traversal mode is `evidence-transparent`, which returns all matches but annotates them with their evidence level. Silent promotion of low-evidence paths is PROHIBITED.

### 4.2 Structural vs. Semantic Paths
- **Structural Traversal:** Follows only `EDITORIAL_CLASSIFICATION` edges. Guaranteed DAG. Used for navigation/browsing.
- **Semantic Traversal:** Follows any non-editorial edge type. May contain cycles. Used for research/discovery.
- **Hybrid Traversal:** Combines both. Must clearly distinguish structural parents from semantic associates in results.

### 4.3 Depth & Fan-Out Limits
- Default max depth: 5 hops for semantic queries to prevent runaway traversal.
- Fan-out warning threshold: >50 edges from a single node triggers pagination/review suggestion.

---

## 5. Pilot Domain Recommendation

### 5.1 Selected Domain: `war-peace-conflict`

**Rationale:**
1. **Rich Semantic Network:** MFD-11.3 Workstream A demonstrated that this domain contains six interconnected concept families (Jihād, Qitāl, Ṣulḥ, ʿAhd/Mīthāq, Salām/Silm, Justice/Ethics) with complex polysemy and overlapping lexical roots.
2. **High Evidence Density:** The workstream identified 128 verbatim verses with clear morphological tagging, providing a robust testbed for `DIRECT_QURANIC_REFERENCE` and `LEXICAL_RELATION` edges.
3. **Critical Disambiguation Needs:** The domain requires precise distinction between martial and non-martial jihād, between silm (peace) and islām (submission), and between treaty obligations and general covenants. This tests the graph's ability to handle nuance.
4. **Cross-Domain Connectivity:** War/peace concepts link to `law-obligations` (treaties), `ethics-character` (restraint, justice), `prophets-narratives` (prophetic battles), and `interfaith-communities` (People of Book treaties). Ideal for validating `THEMATIC_RELATION` traversal.
5. **Contemporary Relevance:** High demand for accurate, evidence-bounded guidance on conflict resolution makes this domain a priority for `CONTEMPORARY_APPLICATION` edge testing with strict evidence boundaries.

### 5.2 Pilot Scope
- **Nodes:** All 4 dimensions (`jihad-concept`, `warfare-ethics`, `peace-treaties`, `conflict-resolution`) + associated topics + 128 extracted verse nodes.
- **Edges:** Full migration of existing relationships + new lexical/morphological edges derived from MFD-11.3 evidence register.
- **Validation Target:** Achieve zero orphan nodes, complete duplicate resolution, and verified evidence tagging for all 128 verse mappings within the pilot scope.

---

## 6. Implementation Roadmap

1. **Phase 1: Schema Deployment** – Load node types and relationship taxonomy into graph DB. Validate against JSON schemas.
2. **Phase 2: Legacy Migration** – Transform `relationships.json` using migration rules. Log all transformations.
3. **Phase 3: Pilot Population** – Ingest `war-peace-conflict` nodes and verse mappings from MFD-11.3 corpus view.
4. **Phase 4: Integrity Validation** – Run full suite of integrity checks (orphans, duplicates, cycles, evidence bounds).
5. **Phase 5: Scholarly Review Gate** – Submit pilot graph segment for review. Iterate based on feedback.
6. **Phase 6: Expansion** – Roll out to remaining domains prioritized by evidence density and user demand.

---

## 7. References

- `MFD-12-RELATIONSHIP-TAXONOMY.json` – Machine-readable relationship definitions.
- `MFD-12-GRAPH-INTEGRITY-RULES.md` – Validation constraints and audit procedures.
- `research/mfd-11/reports/MFD-11.3-WORKSTREAM-A-WAR-PEACE.md` – Source evidence for pilot domain.
- `research/mfd-11/reports/MFD-11.3-WORKSTREAM-B-ARTS-BEAUTY.md` – Cautionary case study in domain dissolution/redistribution.

---

*End of Specification*
