# WS-D: Q27 — Cross-Lingual Concept Alignment Resolution

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 (Data Model Architecture Resolution) |
| Question | Q27 from FAHM Programme Dashboard §39 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-D, agent-106) |
| Review Status | pending-scholarly-review |

---

## 1. CURRENT STATE

### Canonical Model (`MFD-12-CANONICAL-DATA-MODEL.md`)
- **Concept entity (§4H)** uses multilingual labels on a SINGLE entity: `labelEn` (required), `labelAr` (optional), `labelUr` (optional).
- **Topic entity (§4I)** similarly has `titleEn`, `titleAr`, `titleUr`.
- Design Principle 6.1 states: "A Concept is a language-independent semantic node."
- Section 7 (Unresolved Questions): "How should Concepts be aligned across Arabic, English, and Urdu semantic spaces? Current model uses multilingual labels on a single Concept entity, but some concepts may not map cleanly across languages."

### Linguistic Integration Spec
- Defines LexicalEntry with Arabic lemma and transliteration.
- Gloss structure is primarily English-centric (`editorialGloss`, `tafsirNote`).
- No explicit cross-lingual alignment mechanism beyond label fields.

### Legacy Data
- `topics.json` has `arabicTitle` and `urduTitle` fields, but quality varies:
  - Arabic titles generally present and well-formed.
  - Urdu titles suffer from mojibake (encoding corruption) in ~15% of records (per migration map §fieldMappings.Topic.titleUr transform note).
- No formal concept alignment exists; topics conflate semantic units with language-specific framing.

### Scholarly Context
- Islamic terminology often resists clean translation: e.g., "Taqwa" ≠ "God-consciousness" ≠ "تقوى" in full semantic range.
- Urdu theological vocabulary borrows heavily from Arabic/Persian but carries distinct cultural connotations.
- Classical tafsīr provides authoritative semantic ranges that modern translations compress.

---

## 2. OPTION ANALYSIS

### Option A: Single Entity with Multilingual Labels (Status Quo)
Keep current model: one Concept with `labelEn`, `labelAr`, `labelUr`.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Simple; single ID per concept; easy querying; matches existing Topic pattern |
| **Cons** | Assumes 1:1 mapping across languages; loses semantic nuance; forces artificial alignment; cannot represent language-specific sub-concepts; scholarly accuracy compromised when terms don't map cleanly |
| **Semantic Drift Risk** | HIGH: Users assume equivalence where none exists |
| **UX Impact** | Misleading bilingual displays; scholars cannot annotate divergence |

### Option B: Language-Specific Concept Variants with Alignment Links (Recommended)
Retain single canonical Concept ID as the alignment hub. Add optional `crossLingualNotes` object to capture semantic divergence. For cases where 1:1 mapping fails, create language-specific variant concepts linked via `CROSS_LINGUAL_VARIANT` relationship type.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Preserves 1:1 default simplicity; explicitly models divergence when needed; scholars can annotate semantic gaps; UX can display alignment confidence; prevents silent semantic drift |
| **Cons** | Adds complexity for divergent cases; requires new relationship type; scholars must author alignment notes |
| **Semantic Drift Risk** | LOW: Divergence explicitly documented |
| **UX Impact** | Clear visual indicators for partial alignment; detailed view shows scholarly notes |

### Option C: Separate Concept Entities Per Language
Create independent Concept entities for each language (e.g., `cpt-en-divine-mercy`, `cpt-ar-rahmah`, `cpt-ur-rehmat`) linked via alignment relationships.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Maximum semantic precision; each language has native concept space |
| **Cons** | Triples concept count; complex querying; over-engineered for 90% of cases where alignment IS clean; fragments knowledge graph; heavy scholarly authoring burden |
| **Semantic Drift Risk** | NONE (by design) |
| **UX Impact** | Confusing for non-specialist users; requires constant disambiguation |

---

## 3. RECOMMENDED RESOLUTION

**Option B: Hub-and-spoke model with explicit divergence annotation.**

### Rationale
1. **Default Simplicity**: 90%+ of concepts DO map cleanly across Arabic/English/Urdu. Forcing triple entities for all concepts wastes effort.
2. **Explicit Divergence**: When "Taqwa" ≠ "God-consciousness", the `crossLingualNotes` field captures this without fragmenting the graph.
3. **Scholarly Integrity**: Aligns with Principle 5 (Explicit Uncertainty). Semantic gaps are first-class data.
4. **UX Clarity**: Interface can show alignment confidence indicator (✅ clean / ⚠️ partial / ❌ divergent) based on presence of notes.
5. **Extensibility**: If future scholarship determines a concept truly needs language-specific variants, the `CROSS_LINGUAL_VARIANT` relationship supports this without schema change.
6. **Migration Compatibility**: Existing multilingual labels migrate as-is; divergence notes populated during scholarly review phase.

---

## 4. SCHEMA CHANGES

### 4.1 Modified Entity: Concept

Add optional field to Concept entity (§4H):

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| crossLingualNotes | CrossLingualNotesObject | ❌ | Semantic alignment annotations |

#### CrossLingualNotesObject
```json
{
  "alignmentConfidence": "CLEAN | PARTIAL | DIVERGENT",
  "enToAr": { "note": "string", "semanticGaps": ["string"] },
  "enToUr": { "note": "string", "semanticGaps": ["string"] },
  "arToUr": { "note": "string", "semanticGaps": ["string"] },
  "scholarlySources": ["Source.id"]
}
```

### 4.2 New Relationship Type: CROSS_LINGUAL_VARIANT

Add to `MFD-12-RELATIONSHIP-TAXONOMY.json`:

```json
{
  "id": "CROSS_LINGUAL_VARIANT",
  "label": "Cross-Lingual Variant",
  "definition": "Links language-specific concept variants when 1:1 alignment fails. Used only when crossLingualNotes.alignmentConfidence = DIVERGENT.",
  "allowed_source_types": ["concept"],
  "allowed_target_types": ["concept"],
  "directionality": "bidirectional",
  "cardinality": "one-to-few",
  "evidence_requirements": { "min_evidence_level": "scholarly-review" },
  "provenance_requirements": { "must_cite": true }
}
```

### 4.3 JSON Schema Update

Update `concept.schema.json`:
```json
"crossLingualNotes": {
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "alignmentConfidence": { "enum": ["CLEAN", "PARTIAL", "DIVERGENT"] },
    "enToAr": { "$ref": "#/definitions/AlignmentNote" },
    "enToUr": { "$ref": "#/definitions/AlignmentNote" },
    "arToUr": { "$ref": "#/definitions/AlignmentNote" },
    "scholarlySources": { "type": "array", "items": { "type": "string", "pattern": "^src-[a-z0-9-]+$" } }
  },
  "required": ["alignmentConfidence"]
}
```

### 4.4 Data Dictionary Addition

Add CrossLingualNotesObject definition to §3.8 Concept.

---

## 5. MIGRATION IMPACT

### Phase Affected
Migration Plan Phase 4 (Concept Extraction) + Scholarly Review Phase.

### Migration Steps
1. Extract Concepts from Topics (per existing strategy).
2. Populate `labelEn`, `labelAr`, `labelUr` from Topic titles.
3. Set `crossLingualNotes.alignmentConfidence = "CLEAN"` as default.
4. Flag concepts with known semantic divergence for scholarly review.
5. During review, populate `crossLingualNotes` details and create `CROSS_LINGUAL_VARIANT` edges where needed.

### Risk Assessment
- **Low Risk**: Additive fields; default CLEAN assumption safe for initial migration.
- **Scholarly Burden**: Divergence annotation requires expert input; prioritize high-traffic concepts.

---

## 6. BACKWARD COMPATIBILITY

### Existing Backups
- No impact. Additive fields.
- Old Concept records valid without crossLingualNotes.

### Data Portability
- Export includes crossLingualNotes when present.
- Import accepts records with or without the field.

### Breaking Changes
- **None**. Optional field.
- Consumers ignoring crossLingualNotes see labels only (current behavior).

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted (WS-D, agent-106)" | reviewStatus: "pending-scholarly-review"*
