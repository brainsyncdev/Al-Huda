# MFD-12 — Canonical Data Model for FAHM Knowledge Architecture

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Work Package | WS1 — Canonical Schema Design |
| Date | 2026-11-21 |
| Status | draft-design |
| Supersedes | Ad-hoc MFD-11 schemas for new entities |
| Extends | MFD-11 evidence-link, passage-extraction, topic-candidate schemas |

---

## 1. Design Principles

This canonical data model is governed by the following principles derived from the FAHM Programme Specification Part IV:

1. **Immutable Canonical Sources**: Quranic text (Surah, Verse, Translation) are immutable references. They are never modified, only referenced.
2. **Separation of Knowledge Entities**: Verse ≠ Word ≠ Concept ≠ Topic ≠ Claim. Each has its own entity type with distinct identity.
3. **Typed Relationships**: All relationships between entities are explicit, typed, and carry their own provenance.
4. **Evidence-Bearing Claims**: Every scholarly claim must be linked to specific evidence records with verifiable corpus references.
5. **Explicit Uncertainty**: Confidence levels, disputed analyses, and alternative interpretations are first-class data, not afterthoughts.
6. **Append-Only Scholarly Decisions**: ReviewDecision entities are append-only. Corrections create new decisions that reference prior ones; prior decisions are never deleted or mutated.
7. **Versioned Compatibility**: All mutable entities carry schema version and content version fields to support evolution without breaking local-first sync.
8. **Local-First Operation**: All identifiers are stable, non-semantic UUIDs or deterministic slugs. No server-generated sequential IDs.
9. **Modular Intelligence**: Entity groups can be queried, indexed, and reasoned over independently.

---

## 2. Entity Groups Overview

### Group A: Quranic Canon (Immutable)
- **QuranSurah** — Chapter metadata
- **QuranVerse** — Individual verse with positional identity
- **Translation** — Versioned translation of a verse

### Group B: Lexical Analysis (Mutable, Evidence-Based)
- **LexicalEntry** — Dictionary entry for a lemma
- **RootAnalysis** — Morphological/root analysis (multiple per LexicalEntry allowed)
- **Lemma** — Specific morphological form occurrence
- **MorphologicalAnalysis** — Detailed grammatical breakdown

### Group C: Knowledge Taxonomy (Mutable, Curated)
- **Concept** — Abstract semantic unit (distinct from Topic)
- **Topic** — Curated thematic subject with taxonomy placement
- **Domain** — Top-level taxonomy category
- **Dimension** — Mid-level taxonomy grouping
- **Relationship** — Typed edge between any two taxonomy entities

### Group D: Scholarly Apparatus (Mutable, Append-Only Decisions)
- **Source** — Bibliographic reference (tafsīr, lexicon, hadith collection)
- **EvidenceRecord** — Verifiable link between a claim and corpus text
- **ScholarlyClaim** — An interpretive assertion about meaning, classification, or relationship
- **ReviewDecision** — Append-only scholarly review action

### Group E: User & Research Workspace (Mutable, Personal)
- **LearningPath** — Ordered sequence of learning modules
- **LearningModule** — Self-contained educational unit
- **ResearchWorkspace** — Named investigation context
- **ResearchAnnotation** — User note attached to any entity
- **SavedInvestigation** — Persisted query/research state

---

## 3. Identifier Strategy

| Entity | ID Format | Example | Rationale |
|--------|-----------|---------|----------|
| QuranSurah | `surah-{number}` | `surah-001` | Stable, positional, human-readable |
| QuranVerse | `{surah-number}:{ayah-number}` | `2:255` | Universal Quranic reference convention |
| Translation | `trans-{lang}-{translator}-v{n}-{surah}-{ayah}` | `trans-en-saheeh-v3-002-255` | Per-verse record: edition identity + verse key (an edition-only ID would collide across verses) |
| LexicalEntry | `lex-{slug}` | `lex-jahada` | Deterministic slug from primary lemma |
| RootAnalysis | `ra-{uuid}` | `ra-a1b2c3d4-...` | UUID because multiple analyses per entry |
| Lemma | `lem-{root}-{form-code}` | `lem-jhd-f3` | Root + form identifier |
| MorphologicalAnalysis | `morph-{uuid}` | `morph-e5f6g7h8-...` | UUID for independent analysis records |
| Concept | `cpt-{slug}` | `cpt-divine-mercy` | Semantic slug, language-independent |
| Topic | `topic-{slug}` | `topic-tawheed-fundamentals` | Matches existing taxonomy convention |
| Domain | `dom-{slug}` | `dom-belief-theology` | Matches existing taxonomy convention |
| Dimension | `dim-{slug}` | `dim-allah-divine-attributes` | Matches existing taxonomy convention |
| Relationship | `rel-{source}-{target}-{type}` | `rel-dom-belief-dim-tawheed-CONTAINS` | Deterministic composite key |
| Source | `src-{slug}` | `src-ibn-kathir-tafsir` | Bibliographic slug |
| EvidenceRecord | `ev-{uuid}` | `ev-i9j0k1l2-...` | UUID for independent evidence items |
| ScholarlyClaim | `claim-{uuid}` | `claim-m3n4o5p6-...` | UUID; claims may be revised |
| ReviewDecision | `rev-{uuid}` | `rev-q7r8s9t0-...` | UUID; append-only |
| LearningPath | `lp-{uuid}` | `lp-u1v2w3x4-...` | UUID; user-created |
| LearningModule | `mod-{uuid}` | `mod-y5z6a7b8-...` | UUID |
| ResearchWorkspace | `ws-{slug}` | `ws-jihad-semantics` | User-chosen slug |
| ResearchAnnotation | `ann-{uuid}` | `ann-c9d0e1f2-...` | UUID |
| SavedInvestigation | `inv-{uuid}` | `inv-g3h4i5j6-...` | UUID |

---

## 4. Entity Definitions

### 4A. QuranSurah

Immutable metadata for each of the 114 chapters.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `surah-{number}` (zero-padded to 3 digits) |
| number | integer | ✅ | 1–114 |
| nameArabic | string | ✅ | Arabic name with full diacritics |
| nameTransliterated | string | ✅ | ISO 233-2 transliteration |
| nameEnglish | string | ✅ | Standard English name |
| revelationOrder | integer | ✅ | Chronological order of revelation (1–114) |
| revelationPlace | enum | ✅ | `MECCAN` \| `MEDINAN` |
| totalVerses | integer | ✅ | Verified against pinned corpus |
| juzStart | integer | ✅ | Starting juz' number |
| bismillahPresent | boolean | ✅ | Whether basmalah is part of verse 1 |
| corpusVersion | string | ✅ | Pinned corpus version (`quran-json@3.1.2`) |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Has many → QuranVerse

---

### 4B. QuranVerse

Immutable verse record with positional identity.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `{surah}:{ayah}` format |
| surahId | string | ✅ | Reference to QuranSurah.id |
| ayahNumber | integer | ✅ | Within-surah position |
| textArabic | string | ✅ | Full diacritical text from pinned corpus |
| wordCount | integer | ✅ | Token count in corpus |
| juzNumber | integer | ✅ | Juz' containing this verse |
| hizbNumber | integer | ✅ | Hizb containing this verse |
| sajdaType | enum | ❌ | `OBLIGATORY` \| `RECOMMENDED` \| null |
| corpusVersion | string | ✅ | Must match QuranSurah.corpusVersion |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Belongs to → QuranSurah; Referenced by → EvidenceRecord, Lemma, TopicAyahMapping

---

### 4C. Translation

Versioned translation record for a specific verse.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `trans-{lang}-{translator}-v{n}-{surah}-{ayah}` (unique per verse; edition identity is language+translator+version) |
| verseId | string | ✅ | Reference to QuranVerse.id |
| language | string | ✅ | ISO 639-1 code |
| translator | string | ✅ | Translator or organization name |
| version | string | ✅ | Edition/version identifier |
| text | string | ✅ | Translated text |
| footnotes | array | ❌ | Optional annotation objects |
| licenseType | string | ✅ | Copyright/license identifier |
| publishedDate | string | ❌ | ISO 8601 date |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Translates → QuranVerse

---

### 4D. LexicalEntry

Dictionary entry for a unique lemma. One entry per lemma; polysemy handled via contextual senses sub-array.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `lex-{slug}` |
| lemmaArabic | string | ✅ | Citation form with full diacritics |
| lemmaTransliterated | string | ✅ | ISO 233-2 primary transliteration |
| searchAliases | array<string> | ❌ | Simplified search variants |
| rootIds | array<string> | ✅ | One or more RootAnalysis.id (supports disputed roots) |
| primaryRootId | string | ✅ | Most widely attested classical analysis |
| rootDisputed | boolean | ✅ | True if classical lexicons disagree |
| partOfSpeech | enum | ✅ | `VERB` \| `NOUN` \| `ADJECTIVE` \| `PARTICIPLE` \| `PARTICLE` \| `PRONOUN` \| `OTHER` |
| gloss | GlossObject | ✅ | Four-layer gloss per MFD-11.5 §5 |
| contextualSenses | array<SenseObject> | ✅ | Polysemous senses with verse references |
| morphConfidence | enum | ✅ | `HIGH` \| `MEDIUM` \| `LOW` \| `DISPUTED` |
| alternativeAnalyses | array<AltAnalysis> | ❌ | Competing scholarly views when confidence < HIGH |
| provenance | ProvenanceObject | ✅ | Origin and verification metadata |
| reviewStatus | enum | ✅ | `DRAFT` \| `PENDING_SCHOLARLY_REVIEW` \| `APPROVED` \| `REVISED` \| `DEPRECATED` |
| createdAt | string | ✅ | ISO 8601 datetime |
| updatedAt | string | ✅ | ISO 8601 datetime |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Monotonically increasing revision counter |

**GlossObject**: `{ lexical: string, contextualSenses: SenseObject[], tafsirNote?: string, editorialGloss: string }`

**SenseObject**: `{ sense: string, verses: string[], notes?: string }`

**Relationships**: Has many → RootAnalysis, Lemma; Referenced by → ScholarlyClaim

---

### 4E. RootAnalysis

One morphological/root analysis. Multiple RootAnalysis entities may reference the same LexicalEntry when scholars disagree on root assignment.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `ra-{uuid}` |
| lexicalEntryId | string | ✅ | Reference to LexicalEntry.id |
| rootArabic | string | ✅ | Triliteral/quadriliteral root with hyphens (e.g., `ج-ه-د`) |
| rootTransliterated | string | ✅ | ISO 233-2 root transliteration |
| verbForm | string | ❌ | e.g., `Form I`, `Form III`, `N/A` |
| pattern | string | ❌ | Specific ṣīghah template (e.g., `fāʿala`, `mafʿūl`) |
| derivationNotes | string | ❌ | Scholarly notes on derivation |
| sourceIds | array<string> | ✅ | References to Source.id (lexicons consulted) |
| confidence | enum | ✅ | `HIGH` \| `MEDIUM` \| `LOW` \| `DISPUTED` |
| assertedBy | string | ✅ | Agent or process that produced this analysis |
| assertedAt | string | ✅ | ISO 8601 date |
| reviewStatus | enum | ✅ | Same enum as LexicalEntry |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Analyzes → LexicalEntry; Cites → Source

---

### 4F. Lemma

A specific morphological form as it occurs in the corpus. Derived from `data/root-occurrences/` verified data.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `lem-{root}-{form-code}` |
| lexicalEntryId | string | ✅ | Parent LexicalEntry |
| rootAnalysisId | string | ✅ | Parent RootAnalysis |
| formArabic | string | ✅ | Exact diacritical form |
| formTransliterated | string | ✅ | ISO 233-2 |
| partOfSpeech | enum | ✅ | Same enum as LexicalEntry |
| occurrences | array<OccurrenceRef> | ✅ | Verified corpus positions |
| totalOccurrences | integer | ✅ | Count of occurrences array |
| distinctAyahCount | integer | ✅ | Unique surah:ayah pairs |
| corpusVersion | string | ✅ | Must match pinned corpus |
| schemaVersion | string | ✅ | Entity schema version |

**OccurrenceRef**: `{ verseId: string, wordPosition: integer, matchedToken: string }`

**Relationships**: Instance of → LexicalEntry, RootAnalysis; Occurs in → QuranVerse

---

### 4G. MorphologicalAnalysis

Detailed grammatical breakdown for a specific token occurrence.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `morph-{uuid}` |
| lemmaId | string | ✅ | Reference to Lemma.id |
| verseId | string | ✅ | Reference to QuranVerse.id |
| wordPosition | integer | ✅ | Position within verse |
| case | string | ❌ | Nominative, accusative, genitive |
| mood | string | ❌ | Indicative, subjunctive, jussive |
| gender | string | ❌ | Masculine, feminine |
| number | string | ❌ | Singular, dual, plural |
| person | string | ❌ | 1st, 2nd, 3rd |
| voice | string | ❌ | Active, passive |
| prefix | string | ❌ | Attached prefix (wa-, fa-, bi-, etc.) |
| suffix | string | ❌ | Attached suffix (pronoun, tanween) |
| analysisMethod | string | ✅ | Tool or scholar that produced analysis |
| confidence | enum | ✅ | `HIGH` \| `MEDIUM` \| `LOW` |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Analyzes → Lemma at → QuranVerse

---

### 4H. Concept

Abstract semantic unit. Distinct from Topic: a Concept is a language-independent meaning node; a Topic is a curated thematic subject placed in the taxonomy. Multiple Topics may express the same Concept; one Topic may encompass multiple Concepts.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `cpt-{slug}` |
| labelEn | string | ✅ | English label |
| labelAr | string | ❌ | Arabic label |
| labelUr | string | ❌ | Urdu label |
| definition | string | ✅ | Precise semantic definition |
| semanticField | string | ❌ | Broader semantic domain |
| relatedConceptIds | array<string> | ❌ | Cross-references to other Concepts |
| lexicalEntryIds | array<string> | ❌ | Associated LexicalEntries |
| provenance | ProvenanceObject | ✅ | Origin metadata |
| reviewStatus | enum | ✅ | Standard review status |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**Relationships**: Expressed by → Topic; Associated with → LexicalEntry

---

### 4I. Topic

Curated thematic subject with explicit taxonomy placement. Extends existing `data/taxonomy/topics.json` structure.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `topic-{slug}` |
| titleEn | string | ✅ | English title |
| titleAr | string | ❌ | Arabic title |
| titleUr | string | ❌ | Urdu title |
| description | string | ✅ | Scope description |
| conceptIds | array<string> | ❌ | Underlying Concepts this topic expresses |
| parentDomainId | string | ✅ | Reference to Domain.id |
| parentDimensionId | string | ❌ | Reference to Dimension.id |
| parentSubdimensionId | string | ❌ | Reference to Subdimension (if applicable) |
| relatedTopicIds | array<string> | ❌ | Peer topics |
| searchAliases | array<string> | ❌ | Search variants |
| specialized | boolean | ✅ | Whether this is a specialized sub-topic |
| ayahMappings | array<TopicAyahMapping> | ✅ | Verified verse associations |
| provenance | ProvenanceObject | ✅ | Origin metadata |
| reviewStatus | enum | ✅ | Standard review status |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**TopicAyahMapping**: `{ id: string, verseId: string, mappingType: enum(DIRECT_REFERENCE|THEMATIC|CONTEXTUAL), rationale: string, evidenceClass: enum(EXPLICIT_TEXT|THEMATIC|CONTEXTUAL), sourceIds: string[] }`

**Relationships**: Belongs to → Domain, Dimension; Expresses → Concept; Maps to → QuranVerse

---

### 4J. Domain

Top-level taxonomy category. Matches existing `data/taxonomy/domains.json`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `dom-{slug}` |
| titleEn | string | ✅ | English title |
| titleAr | string | ❌ | Arabic title |
| titleUr | string | ❌ | Urdu title |
| description | string | ✅ | Scope description |
| dimensionIds | array<string> | ✅ | Child dimensions |
| aliases | array<string> | ❌ | Search aliases |
| provenance | ProvenanceObject | ✅ | Origin metadata |
| reviewStatus | enum | ✅ | Standard review status |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**Relationships**: Contains → Dimension, Topic

---

### 4K. Dimension

Mid-level taxonomy grouping beneath Domain.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `dim-{slug}` |
| titleEn | string | ✅ | English title |
| titleAr | string | ❌ | Arabic title |
| titleUr | string | ❌ | Urdu title |
| description | string | ✅ | Scope description |
| parentDomainId | string | ✅ | Reference to Domain.id |
| subdimensionIds | array<string> | ❌ | Child subdimensions |
| topicIds | array<string> | ❌ | Direct child topics |
| aliases | array<string> | ❌ | Search aliases |
| provenance | ProvenanceObject | ✅ | Origin metadata |
| reviewStatus | enum | ✅ | Standard review status |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**Relationships**: Belongs to → Domain; Contains → Subdimension, Topic

---

### 4L. Relationship

Typed edge between any two taxonomy or knowledge entities.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `rel-{source}-{target}-{type}` or `rel-{uuid}` for complex cases |
| sourceEntityId | string | ✅ | Any entity id |
| targetEntityId | string | ✅ | Any entity id |
| relationshipType | enum | ✅ | Canonical types from MFD-12-RELATIONSHIP-TAXONOMY.json (WS2): `DIRECT_QURANIC_REFERENCE` \| `LEXICAL_RELATION` \| `MORPHOLOGICAL_RELATION` \| `THEMATIC_RELATION` \| `TAFSIR_SUPPORTED` \| `EDITORIAL_CLASSIFICATION` \| `CONTRAST` \| `CONTEMPORARY_APPLICATION` \| `NARRATIVE_RELATION` \| `CUSTOM`. Legacy MFD-11 mapping: CONTAINS→EDITORIAL_CLASSIFICATION, CROSS_REFERENCES/SHARES_CONCEPT→THEMATIC_RELATION. |
| customType | string | ❌ | Required when relationshipType = CUSTOM |
| description | string | ❌ | Human-readable explanation |
| weight | number | ❌ | 0.0–1.0 relevance/confidence score |
| bidirectional | boolean | ✅ | Whether inverse relationship is implied |
| provenance | ProvenanceObject | ✅ | Origin metadata |
| reviewStatus | enum | ✅ | Standard review status |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Links → any entity pair

---

### 4M. Source

Bibliographic reference for tafsīr, lexicon, hadith collection, or scholarly work.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `src-{slug}` |
| title | string | ✅ | Full bibliographic title |
| author | string | ✅ | Primary author or compiler |
| type | enum | ✅ | `TAFSIR` \| `LEXICON` \| `HADITH_COLLECTION` \| `GRAMMAR` \| `MODERN_SCHOLARSHIP` \| `CORPUS` \| `OTHER` |
| language | string | ✅ | Primary language of work |
| edition | string | ❌ | Edition information |
| publicationYear | integer | ❌ | Year of publication/compilation |
| url | string | ❌ | Digital access URL |
| licenseType | string | ❌ | Copyright status |
| reliabilityGrade | enum | ❌ | `AUTHENTIC` \| `GOOD` \| `WEAK` \| `CONTEMPORARY` \| `UNGRADED` |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Cited by → RootAnalysis, EvidenceRecord, ScholarlyClaim

---

### 4N. EvidenceRecord

Verifiable link between a scholarly claim and specific corpus text. Extends MFD-11 evidence-link schema.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `ev-{uuid}` |
| verseId | string | ✅ | Reference to QuranVerse.id |
| excerpt | string | ✅ | Verbatim substring of corpus Arabic text |
| wordPositions | array<integer> | ❌ | Specific word positions if partial verse |
| evidenceClass | enum | ✅ | `EXPLICIT_TEXT` \| `THEMATIC` \| `CONTEXTUAL` |
| rationale | string | ✅ | Why this verse supports the linked claim |
| claimId | string | ❌ | Reference to ScholarlyClaim.id (may be standalone) |
| sourceIds | array<string> | ❌ | Supporting sources |
| verifiedAgainstCorpus | boolean | ✅ | Mechanically checked against pinned corpus |
| corpusVersion | string | ✅ | Must match pinned corpus |
| createdBy | string | ✅ | Agent or process |
| createdAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Supports → ScholarlyClaim; References → QuranVerse, Source

---

### 4O. ScholarlyClaim

An interpretive assertion about meaning, classification, or relationship. Always evidence-bearing.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `claim-{uuid}` |
| claimType | enum | ✅ | `SEMANTIC` \| `TAXONOMIC` \| `MORPHOLOGICAL` \| `THEOLOGICAL` \| `LEGAL` \| `HISTORICAL` \| `LINGUISTIC` |
| statement | string | ✅ | The claim itself, precisely worded |
| subjectEntityId | string | ✅ | Entity this claim is about |
| evidenceIds | array<string> | ✅ | One or more EvidenceRecord.id |
| sourceIds | array<string> | ❌ | Additional supporting sources |
| confidence | enum | ✅ | `HIGH` \| `MEDIUM` \| `LOW` \| `DISPUTED` |
| alternativeViews | array<AltView> | ❌ | Competing scholarly positions |
| proposedBy | string | ✅ | Agent or scholar |
| reviewStatus | enum | ✅ | Standard review status |
| supersededBy | string | ❌ | If revised, points to newer claim |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**AltView**: `{ statement: string, sourceIds: string[], proponent: string }`

**Relationships**: Supported by → EvidenceRecord; About → any entity; Reviewed by → ReviewDecision

---

### 4P. ReviewDecision (APPEND-ONLY)

Immutable scholarly review action. Never modified or deleted. Corrections produce new decisions referencing the prior one.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `rev-{uuid}` |
| targetEntityType | enum | ✅ | Entity type being reviewed |
| targetEntityId | string | ✅ | ID of entity under review |
| decision | enum | ✅ | `APPROVE` \| `REQUEST_REVISION` \| `REJECT` \| `FLAG_FOR_DISCUSSION` \| `SUPERSEDE` \| `ENDORSE` |
| rationale | string | ✅ | Detailed reasoning |
| reviewerId | string | ✅ | Scholar or authorized reviewer identifier |
| reviewerRole | enum | ✅ | `SCHOLAR` \| `EDITOR` \| `AUTOMATED` \| `PEER_REVIEWER` |
| priorDecisionId | string | ❌ | If correcting/superseding, references prior ReviewDecision |
| evidenceIds | array<string> | ❌ | Evidence supporting this decision |
| decidedAt | string | ✅ | ISO 8601 timestamp |
| schemaVersion | string | ✅ | Entity schema version |

**⚠️ APPEND-ONLY CONSTRAINT**: This entity type MUST NEVER be updated or deleted. Corrections are expressed by creating a new ReviewDecision with `priorDecisionId` pointing to the decision being corrected. Applications must enforce this invariant at the storage layer.

**Relationships**: Reviews → any entity; May supersede → prior ReviewDecision

---

### 4Q. LearningPath

Ordered sequence of learning modules for structured study.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `lp-{uuid}` |
| title | string | ✅ | Path title |
| description | string | ❌ | Overview |
| moduleIds | array<string> | ✅ | Ordered sequence of LearningModule.id |
| targetAudience | enum | ❌ | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` \| `SCHOLAR` |
| estimatedHours | number | ❌ | Total estimated completion time |
| tags | array<string> | ❌ | Categorization tags |
| createdBy | string | ✅ | User or system agent |
| visibility | enum | ✅ | `PRIVATE` \| `SHARED` \| `PUBLIC` |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**Relationships**: Contains → LearningModule (ordered)

---

### 4R. LearningModule

Self-contained educational unit.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `mod-{uuid}` |
| title | string | ✅ | Module title |
| description | string | ❌ | Learning objectives |
| contentType | enum | ✅ | `TEXT` \| `INTERACTIVE` \| `QUIZ` \| `MULTIMEDIA` \| `MIXED` |
| contentBody | string | ✅ | Markdown or structured content |
| topicIds | array<string> | ❌ | Related topics |
| conceptIds | array<string> | ❌ | Related concepts |
| prerequisites | array<string> | ❌ | Module IDs required before this one |
| difficultyLevel | enum | ❌ | `BEGINNER` \| `INTERMEDIATE` \| `ADVANCED` |
| estimatedMinutes | integer | ❌ | Estimated completion time |
| createdBy | string | ✅ | Author |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |
| contentVersion | integer | ✅ | Revision counter |

**Relationships**: Belongs to → LearningPath; References → Topic, Concept

---

### 4S. ResearchWorkspace

Named investigation context for organizing research activities.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `ws-{slug}` |
| name | string | ✅ | Workspace display name |
| description | string | ❌ | Research focus description |
| ownerUserId | string | ✅ | Creator/owner |
| memberUserIds | array<string> | ❌ | Collaborators |
| entityReferences | array<EntityRef> | ❌ | Bookmarked entities of any type |
| tags | array<string> | ❌ | Organizational tags |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |

**EntityRef**: `{ entityType: string, entityId: string, addedAt: string, note?: string }`

**Relationships**: Contains → ResearchAnnotation, SavedInvestigation; References → any entity

---

### 4T. ResearchAnnotation

User note attached to any entity within a workspace.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `ann-{uuid}` |
| workspaceId | string | ✅ | Parent ResearchWorkspace |
| targetEntityType | string | ✅ | Type of annotated entity |
| targetEntityId | string | ✅ | ID of annotated entity |
| content | string | ✅ | Annotation text (Markdown) |
| annotationType | enum | ✅ | `NOTE` \| `QUESTION` \| `INSIGHT` \| `TODO` \| `BOOKMARK` |
| createdBy | string | ✅ | User who created annotation |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Belongs to → ResearchWorkspace; Annotates → any entity

---

### 4U. SavedInvestigation

Persisted query or research state for later retrieval.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | `inv-{uuid}` |
| workspaceId | string | ✅ | Parent ResearchWorkspace |
| title | string | ✅ | Investigation title |
| queryParameters | object | ✅ | Serialized query/filter state |
| resultSnapshot | object | ❌ | Cached results at save time |
| notes | string | ❌ | User commentary on findings |
| createdBy | string | ✅ | User |
| createdAt | string | ✅ | ISO 8601 |
| updatedAt | string | ✅ | ISO 8601 |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Belongs to → ResearchWorkspace

---

## 5. Shared Types

### ProvenanceObject
```json
{
  "origin": "string (process, script, or scholar name)",
  "method": "string (how the data was produced)",
  "corpusVersion": "string (pinned corpus version if applicable)",
  "assertedAt": "string (ISO 8601)",
  "assertedBy": "string (agent identifier)"
}
```

### Standard Review Status Enum
```
DRAFT | PENDING_SCHOLARLY_REVIEW | APPROVED | REVISED | DEPRECATED
```

All mutable entities use this enum. ReviewDecision uses its own decision-specific enum.

---

## 6. Key Design Decisions

### 6.1 Concept vs. Topic Separation
**Decision**: Concept and Topic are distinct entity types.

**Rationale**: A Concept is a language-independent semantic node (e.g., "divine mercy" as an abstract idea). A Topic is a curated, taxonomically-placed subject that may express one or more Concepts and may be framed differently across languages or pedagogical contexts. This separation allows:
- Multiple Topics to express the same Concept (e.g., "Rahmah" and "Divine Mercy" both express `cpt-divine-mercy`)
- Concepts to exist independently of any particular taxonomy arrangement
- Taxonomic restructuring without losing semantic continuity

### 6.2 Multiple RootAnalysis per LexicalEntry
**Decision**: LexicalEntry.rootIds is an array; primaryRootId selects the preferred analysis.

**Rationale**: Classical Arabic lexicography contains genuine disagreements about root assignment (per MFD-11.5 §8). Rather than forcing a single resolution, we preserve all competing analyses as separate RootAnalysis entities, flag the entry with `rootDisputed: true`, and designate the most widely attested view as primary. This follows the principle of never silently resolving scholarly disagreement.

### 6.3 Append-Only ReviewDecision
**Decision**: ReviewDecision entities are never updated or deleted.

**Rationale**: Scholarly review integrity requires an auditable chain of decisions. When a reviewer corrects a prior decision, a new ReviewDecision is created with `priorDecisionId` referencing the corrected decision. This creates an immutable audit trail while allowing the effective review status of an entity to evolve. Storage layers must enforce this constraint.

### 6.4 EvidenceRecord Independence
**Decision**: EvidenceRecord has its own UUID identity and can exist without a linked ScholarlyClaim.

**Rationale**: Evidence may be gathered before claims are formulated, or may support multiple claims. Independent identity enables reuse, cross-referencing, and mechanical verification without coupling to any particular interpretive framework.

### 6.5 Stable Non-Semantic Identifiers
**Decision**: UUIDs for entities whose identity should not encode meaning; deterministic slugs for entities where human readability aids debugging and local-first operation.

**Rationale**: Local-first sync requires identifiers that never collide across devices. Semantic slugs (e.g., `topic-tawheed-fundamentals`) aid human readability and manual inspection but risk collision if naming conventions change. UUIDs eliminate collision risk entirely. We use slugs only for entities where the slug is effectively permanent (taxonomy nodes, surahs) and UUIDs for entities that may be created ad hoc (claims, annotations, workspaces).

### 6.6 Corpus Version Pinning
**Decision**: All entities referencing Quranic text carry explicit `corpusVersion` field.

**Rationale**: The pinned corpus (`quran-json@3.1.2`) is the authoritative source. If the corpus is ever updated, all dependent entities must be explicitly re-verified. The version field makes this dependency explicit and machine-checkable.

---

## 7. Unresolved Questions

1. **Subdimension Entity**: The existing taxonomy includes subdimensions (`data/taxonomy/subdimensions.json`). Should Subdimension be a first-class entity type in MFD-12, or remain an embedded property of Dimension? Current model treats it as embedded; elevation to first-class would add consistency but increase entity count.

2. **Translation Granularity**: Should Translation be per-verse (current design) or support per-word translation for interlinear study? Per-word would require a separate WordTranslation entity linked to MorphologicalAnalysis.

3. **Hadith Integration**: Source.type includes HADITH_COLLECTION, but no dedicated Hadith entity exists. Should MFD-12 define a Hadith entity type, or defer hadith modeling to a future workstream?

4. **Cross-Lingual Concept Alignment**: How should Concepts be aligned across Arabic, English, and Urdu semantic spaces? Current model uses multilingual labels on a single Concept entity, but some concepts may not map cleanly across languages.

5. **ReviewDecision Enforcement**: What storage-layer mechanism enforces the append-only constraint? Options include database triggers, application-level middleware, or CRDT-based conflict resolution. Recommendation: implement at the storage adapter level with runtime validation.

6. **LearningPath Progress Tracking**: Should learner progress be modeled as a separate entity (e.g., LearningProgress) or embedded within LearningPath? Deferred to UX design phase.

---

## 8. Relationship Map

```
QuranSurah ──1:N──▶ QuranVerse ◀──N:1── Translation
                        │
                        ├──◀── EvidenceRecord ──▶ ScholarlyClaim ──▶ ReviewDecision
                        │                              │
                        ├──◀── Lemma ──▶ LexicalEntry ──▶ RootAnalysis ──▶ Source
                        │                  │                    │
                        │                  └──▶ MorphologicalAnalysis
                        │
                        └──◀── TopicAyahMapping ──▶ Topic ──▶ Domain
                                                      │         │
                                                      ├──▶ Dimension
                                                      │         │
                                                      └──▶ Concept
                                                                │
                                                          Relationship (typed edges)
                                                          Types per MFD-12-RELATIONSHIP-TAXONOMY.json (WS2):
                                                            DIRECT_QURANIC_REFERENCE, LEXICAL_RELATION,
                                                            MORPHOLOGICAL_RELATION, THEMATIC_RELATION,
                                                            TAFSIR_SUPPORTED, EDITORIAL_CLASSIFICATION,
                                                            CONTRAST, CONTEMPORARY_APPLICATION,
                                                            NARRATIVE_RELATION, CUSTOM
                                                                │
                                              LearningPath ──▶ LearningModule
                                                                │
                                              ResearchWorkspace ──▶ ResearchAnnotation
                                                      │
                                                      └──▶ SavedInvestigation
```

---

## 9. Cross-Workstream Alignment Notes

### 9.1 WS2 — Knowledge Graph Specification & Relationship Taxonomy
The `MFD-12-RELATIONSHIP-TAXONOMY.json` defines 9 canonical relationship types with rich metadata (directionality, cardinality, evidence/provenance requirements). The Relationship entity schema in this workstream uses these 9 types as its `relationshipType` enum, plus `CUSTOM`. Legacy `relationships.json` types (`CONTAINS`, `CROSS_REFERENCES`, `SHARES_CONCEPT`) map to `EDITORIAL_CLASSIFICATION` and `THEMATIC_RELATION` respectively per WS2 §3.1.

### 9.2 WS3 — Linguistic Data Integration
The `MFD-12-LINGUISTIC-INTEGRATION-SPEC.md` defines the token addressing scheme `{surah}:{ayah}:{wordPosition}` used by MorphologicalAnalysis and Lemma entities. It also specifies that MorphologicalAnalysis is occurrence-specific (not dictionary-derived), multiple RootAnalysis entries per LexicalEntry are required for disputed roots, and lemmas must be extracted from `data/root-occurrences/` rather than authored independently. All of these constraints are reflected in the schemas above.

### 9.3 WS4 — Source Registry Specification
The `MFD-12-SOURCE-REGISTRY-SPEC.md` extends the Source entity with multi-edition support (`editions[]` array with `editionId`, `digitalLocatorScheme`, `rightsOverride`), structured reference locators, rights-aware display gating (`displayConstraints`), and provenance with checksums. The Source schema in this workstream provides the base bibliographic identity; WS4's edition and locator structures should be adopted when implementing the full source registry. The `sourceType` enum in WS4 is more granular (e.g., `tafsir-classical` vs `tafsir-modern`) than the base schema here—implementers should use the WS4 enum as authoritative.

---

### 9.4 WS2 Knowledge Graph Node Types
The `MFD-12-KNOWLEDGE-GRAPH-SPEC.md` defines four primary node types (Domain, Dimension, Topic, Ayah Mapping) that correspond directly to the Domain, Dimension, Topic entities and the TopicAyahMapping embedded object in this model. The graph spec treats Ayah Mappings as first-class nodes for verse-centric traversal; implementers should note that this canonical model embeds them within Topic.ayahMappings[] but they can be projected as independent graph nodes at the storage/query layer without schema changes.

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "draft-design"*
