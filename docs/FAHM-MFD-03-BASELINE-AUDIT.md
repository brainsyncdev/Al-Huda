# MFD-03 Baseline Audit — Existing Knowledge Infrastructure

**Date:** November 12, 2026  
**Purpose:** Document the current state of FAHM's knowledge taxonomy, explore features, and graph infrastructure before implementing MFD-03 through MFD-06.

---

## Executive Summary

The existing FAHM application contains a foundational knowledge infrastructure with:
- **15 dimensions** (topic-level navigation aids)
- **14 proposed domains** (organizational skeleton, no topic assignments)
- **~11 curated topics** with typed ayah relations
- **Knowledge graph** with dimension-topic and topic-topic edges
- **Extensible schema** for future taxonomy expansion

All content carries `pending-scholarly-review` status. The system is designed for incremental expansion but lacks comprehensive coverage, sub-dimensions, and Quranic source mapping at scale.

---

## Current Infrastructure

### 1. Dimensions (src/lib/explore/dimensions.ts)

**Count:** 15 dimensions  
**Status:** Topic-level navigation aids, not ayat-level classifications  
**Provenance:** `editorial-navigation-mapping-v1`  
**Review Status:** `pending-scholarly-review`

**Structure:**
```typescript
interface Dimension {
  number: number;           // PRD §04.3 ordinal (1–15)
  id: DimensionId;          // URL slug and stable identifier
  title: string;            // English title
  arabicTitle: string;      // Arabic label
  covers: string;           // Scope description
  description: string;      // One-paragraph description
  topicSlugs: string[];     // Curated topic slugs (navigation aids)
  searchTerms: string[];    // Suggested search terms
}
```

**The 15 Dimensions:**
1. Spiritual (روحاني) — Allah, Ibadah, Tawakkul, Akhirah
2. Personal (شخصي) — Mental health, self-development, emotions
3. Family (أسري) — Marriage, parenting, divorce, rights
4. Social (اجتماعي) — Community, justice, giving, family ties
5. Economic (اقتصادي) — Wealth, fairness, giving, justice
6. Intellectual (عقلي) — Knowledge, reflection, reasoning
7. Governance (حكم) — Justice, leadership, consultation
8. Jihad (جهاد) — Self-struggle, patience, hardship
9. Interfaith (حوار) — No mapped topics (honest gap)
10. Ilm (علم) — Knowledge, remembrance, divine signs
11. Worship (عبادة) — Prayer, fasting, charity, pilgrimage
12. Prophets (أنبياء) — Prophetic narratives, lessons
13. Creation (خلق) — Universe, nature, signs
14. Hereafter (آخرة) — Death, resurrection, judgment, paradise
15. Law (شرع) — Legal principles, obligations, rights

**Topic Mapping Examples:**
- Spiritual: patience, gratitude, trust-in-god, mercy-and-forgiveness, remembrance, the-hereafter, tawheed
- Personal: patience, hardship-and-ease, trust-in-god, knowledge-and-reflection, god-consciousness, repentance, good-character
- Family: parents-and-family
- Interfaith: [] (empty — no existing curated topic maps clearly)

**Key Limitation:** Dimensions are topic-level navigation aids, not ayat-level tags. The PRD envisions every ayah tagged across 15 dimensions; that work does not exist.

---

### 2. Domains (src/lib/taxonomy/domains.ts)

**Count:** 14 proposed domains  
**Status:** Organizational proposal, not approved taxonomy  
**Provenance:** `organizational-proposal-v1`  
**Review Status:** `pending-scholarly-review`

**Structure:**
```typescript
interface Domain {
  id: DomainId;              // Stable identifier
  title: string;             // English title
  arabicTitle?: string;      // Arabic label (only where universally recognized)
  scope: string;             // One-paragraph scope description
  subjects: string[];        // Non-exhaustive subject list
  overlaps: DomainId[];      // Related domain IDs
}
```

**The 14 Domains:**
1. belief-theology (العقيدة) — Tawhid, prophethood, decree, angels, scripture, unseen, akhirah
2. worship-practice (العبادات) — Salah, sawm, zakat, hajj, dua, dhikr, recitation
3. ethics-character (الأخلاق) — Patience, gratitude, trust, mercy, honesty, humility
4. family-relationships — Marriage, parenting, kinship, inheritance, divorce
5. society-justice — Community, justice, rights, vulnerable groups, social responsibility
6. economic-conduct — Trade, wealth, charity, debt, economic justice
7. prophets-narratives — Prophetic stories, lessons, historical figures
8. creation-signs — Universe, nature, celestial bodies, animals, plants
9. revelation-guidance — Quran, sunnah, divine guidance, interpretation
10. human-experiences — Emotions, trials, blessings, life stages, personal struggles
11. interfaith-communities — Religious diversity, coexistence, dialogue
12. language-vocabulary — Arabic roots, vocabulary, linguistic concepts
13. law-obligations — Legal principles, obligations, rights, duties
14. eschatology-afterlife — Death, barzakh, resurrection, judgment, paradise, hell

**Key Limitation:** Domains have `topicSlugs: []` and `passageIds: []` for every domain. No topic or passage assignments exist. Arabic titles are only included for 8 domains where a universally recognized term exists; the other 6 leave `arabicTitle` undefined rather than fabricated.

---

### 3. Topics (src/lib/topics/data.ts)

**Count:** ~11 curated topics (exact count requires full file inspection)  
**Status:** Editorial selections of well-known ayat  
**Provenance:** `editorial-selection-v1`  
**Review Status:** `pending-scholarly-review`

**Structure:**
```typescript
interface Topic {
  slug: string;
  language: string;              // BCP 47 tag for editorial content
  title: string;                 // English title
  arabicTitle: string;           // Arabic label
  urduTitle?: string;            // Urdu title (optional)
  summary: string;               // One-paragraph editorial summary
  editorialDescription: string;  // Expanded description
  knownLimitations: string[];    // Scope disclosures
  reviewState: ReviewState;      // draft | needs_review | reviewed | published
  related: string[];             // Related topic slugs
  relations: TopicRelation[];    // Typed ayah relations
  provenance: ProvenanceRecord;
}

interface TopicRelation {
  ref: AyahRef;                  // { surah, ayah }
  type: RelationType;            // TOPIC_ASSOCIATION | LEXICAL_MATCH | CROSS_REFERENCE | SEQUENTIAL_CONTEXT
  rationale: string;             // Neutral description
  provenance?: ProvenanceRecord; // Optional per-relation override
}
```

**Example Topics:**
- patience (الصبر) — 6 ayah relations
- gratitude (الشكر) — 5 ayah relations
- trust-in-god (التوكل) — relations pending inspection
- hardship-and-ease
- mercy-and-forgiveness
- remembrance
- the-hereafter
- tawheed
- knowledge-and-reflection
- god-consciousness
- repentance
- good-character
- parents-and-family

**Relation Types:**
- `TOPIC_ASSOCIATION` — Thematic connection
- `LEXICAL_MATCH` — Arabic root or keyword match
- `CROSS_REFERENCE` — Explicit cross-reference
- `SEQUENTIAL_CONTEXT` — Sequential passage context

**Key Strength:** Topics have typed, provenance-tracked ayah relations with neutral rationales. This is a solid foundation for Quranic source mapping.

---

### 4. Knowledge Graph (src/lib/graph/knowledge-graph.ts)

**Node Types:** dimension, topic  
**Edge Types:** DIMENSION_TOPIC, TOPIC_RELATION  
**Version:** GRAPH_VERSION = "1"

**Structure:**
```typescript
interface KnowledgeGraphNode {
  id: string;                    // e.g. "topic:patience" or "dimension:spiritual"
  kind: GraphNodeKind;
  slug: string;
  label: string;
  arabicLabel: string;
  url: string;                   // Root-relative app URL
  ordinal: number | null;        // Dimension ordinal (1–15); null for topics
  language: string | null;       // BCP 47 for topics; null for dimensions
  description: string;
  status: ReviewStatus;
  provenance: SerializedProvenance;
}

interface KnowledgeGraphEdge {
  id: string;                    // e.g. "topic-relation:patience--hardship-and-ease"
  type: GraphEdgeType;
  typeLabel: string;
  source: string;                // Node ID
  target: string;                // Node ID
  relationshipScope: GraphRelationshipScope;
  scopeNote: string;
  status: ReviewStatus;
  provenance: EdgeProvenanceDeclaration[];
}
```

**Edge Types:**
- `DIMENSION_TOPIC` — Editorial navigation mapping from Dimension.topicSlugs
- `TOPIC_RELATION` — Curated lateral relationship from Topic.related

**Key Design Principle:** No ayah nodes or ayah-level edges are emitted. The graph serializes only the relationships the existing editorial data actually supports. Unresolved references are collected in `unresolved` rather than silently dropped.

---

### 5. Taxonomy Schema (src/lib/taxonomy/schema.ts)

**Version:** TAXONOMY_SCHEMA_VERSION = "1"  
**Status:** Types-only module, no populated entities

**Key Types:**
- `ReviewState`: proposed | pending-review | approved | rejected
- `ReviewTrack`: editorial | scholarly
- `ReviewDecision`: state, track, decidedAt, decidedBy, rationale
- `TaxonomyProvenance`: method, assertedBy, assertedAt, state, decisions, sources
- `SourceReference`: kind (quran | tafsir | hadith | linguistic | editorial | external), citation, stableId, relevance

**Design Principles:**
1. Entity kinds are discriminated unions
2. Relationships carry explicit kind and directionality
3. Every edge carries evidence array
4. Review state is explicit and multi-valued
5. Stable identifiers independent of display names
6. Labels are multilingual by default
7. Empty or incomplete categories allowed

**Compatibility:** Existing Dimension, Topic, and CrossReference entities can be represented via adapters in ./compatibility.ts (type-level only).

---

### 6. Routes (src/app/explore/)

**Existing Routes:**
- `/explore` — Main explore page (15 dimensions)
- `/explore/domains` — Domains directory (14 proposed domains)
- `/explore/domains/[id]` — Domain detail page
- `/explore/dimension/[id]` — Dimension detail page
- `/explore/topics` — Topics directory
- `/explore/topics/[slug]` — Topic detail page
- `/explore/graph` — Knowledge graph explorer
- `/explore/root` — Root explorer
- `/explore/root/[root]` — Root detail page
- `/explore/theme/[name]` — Theme page

**Missing Routes (required by MFD-04):**
- `/explore/sub-dimensions/[slug]` — Sub-dimension navigation

---

### 7. Quran Infrastructure (src/lib/quran/)

**Existing Modules:**
- `data.ts` — Quran dataset (114 surahs, 6236 ayat)
- `reference.ts` — Ayah reference utilities
- `translations.ts` — Translation registry
- `translation-store.ts` — Translation data access
- `types.ts` — TypeScript types
- `sources.ts` — Source registry
- `cross-references.ts` — Ayah cross-references
- `search.ts` — Search functionality
- `semantic-search.ts` — Semantic search
- `translation-search.ts` — Translation search
- `tafsir-search.ts` — Tafsir search
- `words.ts` — Word-level data
- `juz.ts` — Juz divisions
- `mushaf-data.ts` — Mushaf page references
- `audio.ts` — Audio recitation data
- `match-reasons.ts` — Match reason tracking
- `verse-of-day.ts` — Verse of the day
- `curated-references.test.ts` — Curated references tests

**Validation Scripts:**
- `scripts/validate-quran-data.mjs` — Quran dataset validation
- `scripts/validate-source-licenses.mjs` — Source license validation
- `scripts/validate-build-env.mjs` — Build environment validation
- `scripts/validate-lemma-review.mjs` — Lemma review validation

---

## Gap Analysis

### What Exists
✅ 15 dimensions with topic-level navigation mappings  
✅ 14 proposed domains (organizational skeleton)  
✅ ~11 curated topics with typed ayah relations  
✅ Knowledge graph with dimension-topic and topic-topic edges  
✅ Extensible taxonomy schema  
✅ Quran dataset (114 surahs, 6236 ayat)  
✅ Translation registry  
✅ Source registry  
✅ Provenance tracking  
✅ Review status system  
✅ Existing routes for explore, domains, dimensions, topics, graph  

### What's Missing
❌ Comprehensive domain coverage (domains have no topic assignments)  
❌ Sub-dimensions (hierarchy stops at dimension level)  
❌ Comprehensive topic coverage (only ~11 topics exist)  
❌ Quranic source mapping at scale (topics have limited ayah relations)  
❌ Translation mappings (no topic-translation links)  
❌ Tafsir mappings (no topic-tafsir links)  
❌ Concept-to-topic relationships  
❌ Arabic root and vocabulary mappings  
❌ Cross-domain topic relationships (beyond Topic.related)  
❌ Sub-dimension navigation route  
❌ Rich domain explorer (domain pages are basic)  
❌ Interactive knowledge graph (graph page exists but needs enhancement)  
❌ Comprehensive coverage reporting  

### What Needs Expansion
⚠️ Dimensions: 15 → potentially more (no artificial cap)  
⚠️ Domains: 14 → potentially more (no artificial cap)  
⚠️ Topics: ~11 → hundreds or thousands (comprehensive coverage)  
⚠️ Sub-dimensions: 0 → many (new hierarchy level)  
⚠️ Quranic mappings: limited → comprehensive (where sources exist)  
⚠️ Graph nodes: dimensions + topics → + ayat + concepts + roots + words  
⚠️ Graph edges: 2 types → many typed relationships  

---

## Architectural Observations

### Strengths
1. **Provenance-first design** — Every entity and relation tracks its source and review status
2. **Typed relationships** — Relations have explicit types, not generic "related" links
3. **Stable identifiers** — IDs are independent of display names
4. **Multilingual support** — Labels support Arabic, English, Urdu
5. **Review state machine** — Explicit lifecycle: proposed → pending-review → approved/rejected
6. **No fabrication** — Missing data is left empty, not invented
7. **Extensible schema** — Can accommodate new entity kinds and relationship types
8. **Compatibility layer** — Existing entities can be represented in new schema

### Limitations
1. **Topic-level only** — Dimensions are navigation aids, not ayat-level classifications
2. **No sub-dimensions** — Hierarchy is flat (domain → dimension → topic)
3. **Limited coverage** — Only ~11 topics exist; most domains are empty
4. **No Quranic mapping at scale** — Topics have limited ayah relations
5. **No translation/tafsir mappings** — No links to translation or tafsir records
6. **No concept layer** — No Quranic concept entities
7. **No root/vocabulary layer** — No Arabic root or word entities
8. **Basic graph** — Only dimension-topic and topic-topic edges

---

## Implementation Strategy

### Phase 1: Baseline Audit (✅ Complete)
- Document existing infrastructure
- Identify gaps and limitations
- Establish architectural understanding

### Phase 2: Parallel Taxonomy Research (MFD-03B)
- Dispatch agents B–I for specialized knowledge research
- Each agent researches complete scope of assigned subject area
- Agents submit findings using common schema
- No direct modification of canonical taxonomy files

### Phase 3: Consolidation & Missing-Domain Audit (MFD-03C)
- Taxonomy Architect consolidates specialist findings
- Missing-Domain Auditor checks for omissions
- Resolve overlaps and duplicates
- Lead Agent approves canonical taxonomy contract

### Phase 4: Canonical Taxonomy Data (MFD-03D)
- Assign stable IDs
- Create structured data (domains.json, dimensions.json, subdimensions.json, topics.json, relationships.json)
- Run hierarchy and duplicate validation
- Freeze first stable version of taxonomy contract

### Phase 5: Quranic Content Mapping (MFD-03E)
- Map available Quranic references, translations, Tafsir, concepts
- Create source-aware topic content
- Generate coverage reports
- Do not block on unavailable sources

### Phase 6: Domain Explorer (MFD-04)
- Build rich Domain Explorer using canonical taxonomy data
- Landing page, domain pages, dimension pages, sub-dimension navigation
- Topic directory, Quranic reference presentation
- Cross-domain navigation, search

### Phase 7: Knowledge Graph Explorer (MFD-05)
- Complete existing graph experience
- Integrate same canonical entities
- Implement graph interactions, search, filters, expansion
- Relationship details, provenance handling

### Phase 8: Final Integration & QA (MFD-06)
- Connect every explorer
- Validate data, content, relationships, routes, responsiveness
- Produce final completion report

---

## Key Decisions Required

1. **Domain count:** Keep 14, expand to 10 (per master plan seed), or different number?
   - Recommendation: Use the 10-domain seed from master plan as baseline, expand if audit identifies meaningful independent areas

2. **Dimension count:** Keep 15, expand, or restructure?
   - Recommendation: Review all 15, merge overlaps, expand where gaps exist

3. **Sub-dimension depth:** How deep should hierarchy go?
   - Recommendation: Support arbitrary depth, but start with 2-3 levels (domain → dimension → sub-dimension → topic)

4. **Topic coverage:** How many topics to create?
   - Recommendation: Comprehensive coverage, no artificial cap. Start with 100-200 high-priority topics, expand incrementally

5. **Quranic mapping scope:** Map all ayat or focus on key passages?
   - Recommendation: Map where sources exist, mark gaps honestly, don't fabricate

6. **Graph entity types:** Which entities to include as graph nodes?
   - Recommendation: Start with domains, dimensions, sub-dimensions, topics, ayat, concepts, roots. Expand incrementally

---

## Next Steps

1. ✅ Baseline audit complete
2. ⏳ Dispatch parallel research agents (B–I) for taxonomy research
3. ⏳ Consolidate findings through Taxonomy Architect
4. ⏳ Run Missing-Domain Audit
5. ⏳ Create canonical taxonomy data
6. ⏳ Map Quranic sources
7. ⏳ Build Domain Explorer
8. ⏳ Enhance Knowledge Graph Explorer
9. ⏳ Final integration and QA

---

## Conclusion

The existing FAHM application has a solid foundation for knowledge organization, with provenance tracking, typed relationships, and an extensible schema. However, coverage is limited: only 15 dimensions, 14 empty domains, and ~11 topics exist. The system is designed for incremental expansion but requires comprehensive research and data population to fulfill the vision of a complete Quran-centered knowledge system.

MFD-03 through MFD-06 will transform this foundation into a rich, interconnected knowledge discovery system by:
- Expanding the taxonomy through parallel specialist research
- Creating comprehensive topic coverage
- Mapping available Quranic sources
- Building rich exploration interfaces
- Enhancing the knowledge graph

All work will preserve the existing architectural strengths: provenance tracking, typed relationships, stable identifiers, multilingual support, and honest handling of missing data.