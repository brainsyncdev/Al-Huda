# MFD-12 — Data Dictionary

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Work Package | WS1 — Canonical Schema Design |
| Date | 2026-11-21 |
| Status | draft-design |
| Companion Document | MFD-12-CANONICAL-DATA-MODEL.md |

---

## 1. Introduction

This data dictionary provides field-level definitions for every entity in the MFD-12 Canonical Data Model. Each entry specifies the field name, data type, requirement status, format constraints, validation rules, and semantic meaning. This document is the authoritative reference for implementers, validators, and schema authors.

All fields are defined in accordance with the design principles established in MFD-12-CANONICAL-DATA-MODEL.md §1.

---

## 2. Common Enums

### ReviewStatusEnum
Used by all mutable entities to track scholarly review lifecycle.

| Value | Definition |
|-------|------------|
| `DRAFT` | Initial creation; not yet submitted for review |
| `PENDING_SCHOLARLY_REVIEW` | Submitted for scholarly review; awaiting decision |
| `APPROVED` | Reviewed and approved by authorized scholar |
| `REVISED` | Previously approved but subsequently revised; carries new contentVersion |
| `DEPRECATED` | Superseded or withdrawn; retained for audit trail |

### EvidenceClassEnum
Classifies the strength of textual evidence linking a claim to a verse.

| Value | Definition |
|-------|------------|
| `EXPLICIT_TEXT` | The concept's terms appear verbatim in the verse |
| `THEMATIC` | Meaningful thematic relationship without explicit terminology |
| `CONTEXTUAL` | Derives from passage context or siyāq, not isolated verse |

### MorphConfidenceEnum
Indicates certainty level of morphological or root analysis.

| Value | Definition |
|-------|------------|
| `HIGH` | Uncontested; verified against multiple classical sources |
| `MEDIUM` | Generally accepted but minor uncertainties exist |
| `LOW` | Significant uncertainty; single-source or computational only |
| `DISPUTED` | Classical scholars disagree; multiple valid positions exist |

### PartOfSpeechEnum

| Value | Definition |
|-------|------------|
| `VERB` | Finite verb form (any form I–XV) |
| `NOUN` | Noun including verbal noun (maṣdar) |
| `ADJECTIVE` | Adjective / active participle used attributively |
| `PARTICIPLE` | Active or passive participle used nominally |
| `PARTICLE` | Preposition, conjunction, adverb, interjection |
| `PRONOUN` | Personal, demonstrative, relative pronoun |
| `OTHER` | Does not fit above categories |

### RelationshipTypeEnum

Canonical types aligned with MFD-12-RELATIONSHIP-TAXONOMY.json (WS2). Legacy MFD-11 relationships.json types map as follows: `CONTAINS` → `EDITORIAL_CLASSIFICATION`, `CROSS_REFERENCES` / `SHARES_CONCEPT` → `THEMATIC_RELATION`.

| Value | Definition |
|-------|------------|
| `DIRECT_QURANIC_REFERENCE` | Topic or Dimension explicitly grounded in specific Quranic verses |
| `LEXICAL_RELATION` | Shared Arabic root, morphological form, or semantic field |
| `MORPHOLOGICAL_RELATION` | Derivation through specific Arabic verb forms or noun patterns |
| `THEMATIC_RELATION` | Cross-domain conceptual link based on shared thematic clusters |
| `TAFSIR_SUPPORTED` | Validated or explained by classical/exegetical commentary |
| `EDITORIAL_CLASSIFICATION` | Structural hierarchy created by curators (replaces legacy CONTAINS) |
| `CONTRAST` | Opposition, negation, or complementary duality between concepts |
| `CONTEMPORARY_APPLICATION` | Links foundational concepts to modern issues or contexts |
| `NARRATIVE_RELATION` | Chronological, causal, or character-based connections within stories |
| `CUSTOM` | User-defined; requires customType field |

### ReviewDecisionEnum
Specific to ReviewDecision entity.

| Value | Definition |
|-------|------------|
| `APPROVE` | Entity meets scholarly standards |
| `REQUEST_REVISION` | Requires changes before approval |
| `REJECT` | Does not meet standards; not salvageable |
| `FLAG_FOR_DISCUSSION` | Requires scholarly consultation |
| `SUPERSEDE` | Replaces a prior decision (must set priorDecisionId) |
| `ENDORSE` | Affirms another reviewer's decision |

### SourceTypeEnum

| Value | Definition |
|-------|------------|
| `TAFSIR` | Classical or modern Quranic commentary |
| `LEXICON` | Arabic dictionary or lexicon |
| `HADITH_COLLECTION` | Compiled hadith corpus |
| `GRAMMAR` | Arabic grammar reference |
| `MODERN_SCHOLARSHIP` | Contemporary academic work |
| `CORPUS` | Digital text corpus |
| `OTHER` | Unclassified source |

### MappingTypeEnum
For TopicAyahMapping.

| Value | Definition |
|-------|------------|
| `DIRECT_REFERENCE` | Verse explicitly addresses the topic |
| `THEMATIC` | Verse thematically relates to the topic |
| `CONTEXTUAL` | Connection derived from surrounding passage |

### SajdaTypeEnum

| Value | Definition |
|-------|------------|
| `OBLIGATORY` | Obligatory prostration verse |
| `RECOMMENDED` | Recommended prostration verse |

### ContentTypeEnum
For LearningModule.

| Value | Definition |
|-------|------------|
| `TEXT` | Primarily textual content |
| `INTERACTIVE` | Interactive exercises |
| `QUIZ` | Assessment/quiz |
| `MULTIMEDIA` | Audio/video content |
| `MIXED` | Combination of types |

### AudienceLevelEnum

| Value | Definition |
|-------|------------|
| `BEGINNER` | No prior knowledge assumed |
| `INTERMEDIATE` | Basic familiarity expected |
| `ADVANCED` | Substantial background required |
| `SCHOLAR` | Specialized scholarly audience |

### VisibilityEnum

| Value | Definition |
|-------|------------|
| `PRIVATE` | Visible only to creator |
| `SHARED` | Visible to workspace members |
| `PUBLIC` | Visible to all users |

### AnnotationTypeEnum

| Value | Definition |
|-------|------------|
| `NOTE` | General observation |
| `QUESTION` | Open question for further research |
| `INSIGHT` | Noteworthy finding |
| `TODO` | Action item |
| `BOOKMARK` | Reference marker |

### ReviewerRoleEnum

| Value | Definition |
|-------|------------|
| `SCHOLAR` | Qualified Islamic scholar |
| `EDITOR` | Editorial staff |
| `AUTOMATED` | Algorithmic/computational process |
| `PEER_REVIEWER` | Peer review participant |

### ClaimTypeEnum

| Value | Definition |
|-------|------------|
| `SEMANTIC` | About meaning or interpretation |
| `TAXONOMIC` | About classification or categorization |
| `MORPHOLOGICAL` | About word form or root |
| `THEOLOGICAL` | About creed or doctrine |
| `LEGAL` | About fiqh or legal ruling |
| `HISTORICAL` | About historical context or event |
| `LINGUISTIC` | About language or rhetoric |

---

## 3. Entity Field Definitions

### 3.1 QuranSurah

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^surah-[0-9]{3}$` | Stable identifier, zero-padded surah number |
| number | integer | ✅ | Range: 1–114 | Canonical surah position in muṣḥaf order |
| nameArabic | string | ✅ | Min length: 1 | Arabic name with full tashkīl |
| nameTransliterated | string | ✅ | ISO 233-2 | Scholarly transliteration |
| nameEnglish | string | ✅ | Min length: 1 | Standard English rendering |
| revelationOrder | integer | ✅ | Range: 1–114 | Chronological revelation sequence |
| revelationPlace | enum | ✅ | MECCAN \| MEDINAN | Place of primary revelation |
| totalVerses | integer | ✅ | ≥ 1 | Verified against pinned corpus |
| juzStart | integer | ✅ | Range: 1–30 | Starting juz' |
| bismillahPresent | boolean | ✅ | — | Whether basmalah counts as verse 1 |
| corpusVersion | string | ✅ | SemVer or package ref | Pinned corpus version |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.2 QuranVerse

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^[0-9]{1,3}:[0-9]{1,3}$` | Surah:ayah composite key |
| surahId | string | ✅ | Must reference valid QuranSurah.id | Parent surah |
| ayahNumber | integer | ✅ | ≥ 1 | Within-surah position |
| textArabic | string | ✅ | Min length: 1; must match corpus | Full diacritical Arabic text |
| wordCount | integer | ✅ | ≥ 1 | Token count per corpus tokenization |
| juzNumber | integer | ✅ | Range: 1–30 | Juz' containing this verse |
| hizbNumber | integer | ✅ | Range: 1–60 | Hizb containing this verse |
| sajdaType | enum | ❌ | OBLIGATORY \| RECOMMENDED \| null | Prostration classification |
| corpusVersion | string | ✅ | Must match QuranSurah.corpusVersion | Corpus version pinning |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.3 Translation

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^trans-[a-z]{2}-[a-z0-9-]+-v[0-9]+-[0-9]{3}-[0-9]{1,3}$` | Edition (language-translator-version) + zero-padded surah + ayah; unique per verse |
| verseId | string | ✅ | Must reference valid QuranVerse.id | Translated verse |
| language | string | ✅ | ISO 639-1 (e.g., `en`, `ur`) | Target language |
| translator | string | ✅ | Min length: 1 | Translator or organization |
| version | string | ✅ | Min length: 1 | Edition identifier |
| text | string | ✅ | Min length: 1 | Translated text |
| footnotes | array<object> | ❌ | Each: `{marker: string, text: string}` | Optional annotations |
| licenseType | string | ✅ | Min length: 1 | Copyright/license info |
| publishedDate | string | ❌ | ISO 8601 date (YYYY-MM-DD) | Publication date |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.4 LexicalEntry

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^lex-[a-z0-9-]+$` | Deterministic slug from primary lemma |
| lemmaArabic | string | ✅ | Min length: 1; full tashkīl | Citation form |
| lemmaTransliterated | string | ✅ | ISO 233-2 | Primary scholarly transliteration |
| searchAliases | array<string> | ❌ | Each: min length 1 | Simplified search variants |
| rootIds | array<string> | ✅ | Min items: 1; each references RootAnalysis.id | All associated root analyses |
| primaryRootId | string | ✅ | Must be member of rootIds | Preferred root analysis |
| rootDisputed | boolean | ✅ | — | True if classical disagreement exists |
| partOfSpeech | enum | ✅ | PartOfSpeechEnum | Grammatical category |
| gloss | object | ✅ | See GlossObject below | Four-layer gloss structure |
| contextualSenses | array<object> | ✅ | Min items: 1; see SenseObject | Polysemous sense enumeration |
| morphConfidence | enum | ✅ | MorphConfidenceEnum | Analysis certainty level |
| alternativeAnalyses | array<object> | ❌ | See AltAnalysisObject | Competing scholarly views |
| provenance | object | ✅ | See ProvenanceObject | Origin metadata |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Current review state |
| createdAt | string | ✅ | ISO 8601 datetime | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 datetime | Last modification timestamp |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1; monotonically increasing | Content revision counter |

#### GlossObject

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| lexical | string | ✅ | Core semantic value independent of context |
| contextualSenses | array<SenseObject> | ✅ | Context-dependent meanings with verse refs |
| tafsirNote | string | ❌ | Classical exegetical insight (explicitly labeled) |
| editorialGloss | string | ✅ | FAHM's proposed classification gloss |

#### SenseObject

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sense | string | ✅ | Description of this contextual sense |
| verses | array<string> | ✅ | Verse IDs where this sense applies |
| notes | string | ❌ | Additional clarification |

#### AltAnalysisObject

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| rootArabic | string | ✅ | Alternative root assignment |
| proponent | string | ✅ | Scholar or lexicon supporting this view |
| rationale | string | ✅ | Why this analysis is proposed |
| sourceIds | array<string> | ✅ | Supporting Source references |

#### ProvenanceObject

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| origin | string | ✅ | Process, script, or scholar name |
| method | string | ✅ | How the data was produced |
| corpusVersion | string | ❌ | Pinned corpus version if applicable |
| assertedAt | string | ✅ | ISO 8601 timestamp |
| assertedBy | string | ✅ | Agent identifier |

### 3.5 RootAnalysis

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique analysis identifier |
| lexicalEntryId | string | ✅ | Must reference valid LexicalEntry.id | Parent entry |
| rootArabic | string | ✅ | Hyphenated triliteral/quadriliteral | e.g., `ج-ه-د` |
| rootTransliterated | string | ✅ | ISO 233-2 | Root transliteration |
| verbForm | string | ❌ | e.g., `Form I`, `Form III` | Verb form number if applicable |
| pattern | string | ❌ | Ṣīghah template | e.g., `fāʿala`, `mafʿūl` |
| derivationNotes | string | ❌ | Free text | Scholarly derivation notes |
| sourceIds | array<string> | ✅ | Min items: 1 | Lexicons consulted |
| confidence | enum | ✅ | MorphConfidenceEnum | Analysis certainty |
| assertedBy | string | ✅ | Min length: 1 | Producing agent/scholar |
| assertedAt | string | ✅ | ISO 8601 date | Assertion date |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.6 Lemma

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^lem-[a-z]+-[a-z0-9]+$` | Root + form code composite |
| lexicalEntryId | string | ✅ | Must reference valid LexicalEntry.id | Parent entry |
| rootAnalysisId | string | ✅ | Must reference valid RootAnalysis.id | Parent root analysis |
| formArabic | string | ✅ | Full tashkīl | Exact morphological form |
| formTransliterated | string | ✅ | ISO 233-2 | Form transliteration |
| partOfSpeech | enum | ✅ | PartOfSpeechEnum | Grammatical category |
| occurrences | array<OccurrenceRef> | ✅ | Min items: 1 | Verified corpus positions |
| totalOccurrences | integer | ✅ | = occurrences.length | Redundant count for query efficiency |
| distinctAyahCount | integer | ✅ | ≤ totalOccurrences | Unique verse count |
| corpusVersion | string | ✅ | Must match pinned corpus | Corpus version pinning |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

#### OccurrenceRef

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| verseId | string | ✅ | QuranVerse.id reference |
| wordPosition | integer | ✅ | Zero-based or one-based position (specify convention) |
| matchedToken | string | ✅ | Exact corpus token with diacritics |

### 3.7 MorphologicalAnalysis

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique analysis identifier |
| lemmaId | string | ✅ | Must reference valid Lemma.id | Analyzed lemma |
| verseId | string | ✅ | Must reference valid QuranVerse.id | Verse context |
| wordPosition | integer | ✅ | ≥ 0 | Position within verse |
| case | string | ❌ | NOMINATIVE \| ACCUSATIVE \| GENITIVE | Grammatical case |
| mood | string | ❌ | INDICATIVE \| SUBJUNCTIVE \| JUSSIVE | Verb mood |
| gender | string | ❌ | MASCULINE \| FEMININE | Gender |
| number | string | ❌ | SINGULAR \| DUAL \| PLURAL | Number |
| person | string | ❌ | FIRST \| SECOND \| THIRD | Person |
| voice | string | ❌ | ACTIVE \| PASSIVE | Voice |
| prefix | string | ❌ | Free text | Attached prefix(es) |
| suffix | string | ❌ | Free text | Attached suffix(es) |
| analysisMethod | string | ✅ | Min length: 1 | Tool or scholar producing analysis |
| confidence | enum | ✅ | HIGH \| MEDIUM \| LOW | Analysis certainty |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.8 Concept

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^cpt-[a-z0-9-]+$` | Semantic slug |
| labelEn | string | ✅ | Min length: 1 | English label |
| labelAr | string | ❌ | Arabic with tashkīl | Arabic label |
| labelUr | string | ❌ | Urdu script | Urdu label |
| definition | string | ✅ | Min length: 1 | Precise semantic definition |
| semanticField | string | ❌ | Free text | Broader semantic domain |
| relatedConceptIds | array<string> | ❌ | Each references Concept.id | Cross-references |
| lexicalEntryIds | array<string> | ❌ | Each references LexicalEntry.id | Associated lemmas |
| provenance | object | ✅ | ProvenanceObject | Origin metadata |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

### 3.9 Topic

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^topic-[a-z0-9-]+$` | Taxonomy slug |
| titleEn | string | ✅ | Min length: 1 | English title |
| titleAr | string | ❌ | Arabic with tashkīl | Arabic title |
| titleUr | string | ❌ | Urdu script | Urdu title |
| description | string | ✅ | Min length: 1 | Scope description |
| conceptIds | array<string> | ❌ | Each references Concept.id | Underlying concepts |
| parentDomainId | string | ✅ | Must reference Domain.id | Taxonomic parent |
| parentDimensionId | string | ❌ | Must reference Dimension.id | Mid-level parent |
| parentSubdimensionId | string | ❌ | Free string (embedded subdim) | Sub-dimension if applicable |
| relatedTopicIds | array<string> | ❌ | Each references Topic.id | Peer topics |
| searchAliases | array<string> | ❌ | Each: min length 1 | Search variants |
| specialized | boolean | ✅ | — | Whether specialized sub-topic |
| ayahMappings | array<TopicAyahMappingObj> | ✅ | Min items: 1 | Verse associations |
| provenance | object | ✅ | ProvenanceObject | Origin metadata |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

#### TopicAyahMappingObj

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique mapping identifier |
| verseId | string | ✅ | QuranVerse.id reference |
| mappingType | enum | ✅ | DIRECT_REFERENCE \| THEMATIC \| CONTEXTUAL |
| rationale | string | ✅ | Explanation of mapping |
| evidenceClass | enum | ✅ | EXPLICIT_TEXT \| THEMATIC \| CONTEXTUAL |
| sourceIds | array<string> | ❌ | Supporting sources |

### 3.10 Domain

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^dom-[a-z0-9-]+$` | Taxonomy slug |
| titleEn | string | ✅ | Min length: 1 | English title |
| titleAr | string | ❌ | Arabic | Arabic title |
| titleUr | string | ❌ | Urdu | Urdu title |
| description | string | ✅ | Min length: 1 | Scope description |
| dimensionIds | array<string> | ✅ | Min items: 1 | Child dimensions |
| aliases | array<string> | ❌ | Each: min length 1 | Search aliases |
| provenance | object | ✅ | ProvenanceObject | Origin metadata |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

### 3.11 Dimension

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^dim-[a-z0-9-]+$` | Taxonomy slug |
| titleEn | string | ✅ | Min length: 1 | English title |
| titleAr | string | ❌ | Arabic | Arabic title |
| titleUr | string | ❌ | Urdu | Urdu title |
| description | string | ✅ | Min length: 1 | Scope description |
| parentDomainId | string | ✅ | Must reference Domain.id | Parent domain |
| subdimensionIds | array<string> | ❌ | Embedded subdimension identifiers | Child subdimensions |
| topicIds | array<string> | ❌ | Each references Topic.id | Direct child topics |
| aliases | array<string> | ❌ | Each: min length 1 | Search aliases |
| provenance | object | ✅ | ProvenanceObject | Origin metadata |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

### 3.12 Relationship

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Deterministic composite or UUID | Edge identifier |
| sourceEntityId | string | ✅ | Any valid entity ID | Source node |
| targetEntityId | string | ✅ | Any valid entity ID | Target node |
| relationshipType | enum | ✅ | RelationshipTypeEnum | Edge type |
| customType | string | Conditional | Required when type=CUSTOM | Custom edge label |
| description | string | ❌ | Free text | Human-readable explanation |
| weight | number | ❌ | Range: 0.0–1.0 | Relevance/confidence score |
| bidirectional | boolean | ✅ | — | Whether inverse is implied |
| provenance | object | ✅ | ProvenanceObject | Origin metadata |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.13 Source

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^src-[a-z0-9-]+$` | Bibliographic slug |
| title | string | ✅ | Min length: 1 | Full bibliographic title |
| author | string | ✅ | Min length: 1 | Primary author/compiler |
| type | enum | ✅ | SourceTypeEnum | Source category |
| language | string | ✅ | ISO 639-1 or `ar`/`fa`/`ur` | Primary language |
| edition | string | ❌ | Free text | Edition information |
| publicationYear | integer | ❌ | ≥ 0 | Year of publication |
| url | string | ❌ | Valid URI | Digital access URL |
| licenseType | string | ❌ | Free text | Copyright status |
| reliabilityGrade | enum | ❌ | AUTHENTIC \| GOOD \| WEAK \| CONTEMPORARY \| UNGRADED | Reliability assessment |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.14 EvidenceRecord

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique evidence identifier |
| verseId | string | ✅ | Must reference QuranVerse.id | Cited verse |
| excerpt | string | ✅ | Must be verbatim substring of corpus | Arabic text excerpt |
| wordPositions | array<integer> | ❌ | Each ≥ 0 | Specific word positions |
| evidenceClass | enum | ✅ | EvidenceClassEnum | Evidence strength |
| rationale | string | ✅ | Min length: 1 | Justification |
| claimId | string | ❌ | References ScholarlyClaim.id | Linked claim |
| sourceIds | array<string> | ❌ | Each references Source.id | Supporting sources |
| verifiedAgainstCorpus | boolean | ✅ | — | Mechanical verification flag |
| corpusVersion | string | ✅ | Must match pinned corpus | Corpus version pinning |
| createdBy | string | ✅ | Min length: 1 | Creating agent |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.15 ScholarlyClaim

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique claim identifier |
| claimType | enum | ✅ | ClaimTypeEnum | Claim category |
| statement | string | ✅ | Min length: 1 | Precisely worded assertion |
| subjectEntityId | string | ✅ | Any valid entity ID | Entity under discussion |
| evidenceIds | array<string> | ✅ | Min items: 1 | Supporting evidence |
| sourceIds | array<string> | ❌ | Each references Source.id | Additional sources |
| confidence | enum | ✅ | MorphConfidenceEnum | Certainty level |
| alternativeViews | array<AltViewObj> | ❌ | See below | Competing positions |
| proposedBy | string | ✅ | Min length: 1 | Proposing agent/scholar |
| reviewStatus | enum | ✅ | ReviewStatusEnum | Review state |
| supersededBy | string | ❌ | References ScholarlyClaim.id | Newer replacement claim |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

#### AltViewObj

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| statement | string | ✅ | Alternative position statement |
| sourceIds | array<string> | ✅ | Supporting sources |
| proponent | string | ✅ | Scholar or school |

### 3.16 ReviewDecision (APPEND-ONLY)

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique decision identifier |
| targetEntityType | string | ✅ | Entity type name | Type under review |
| targetEntityId | string | ✅ | Valid entity ID | Entity under review |
| decision | enum | ✅ | ReviewDecisionEnum | Decision outcome |
| rationale | string | ✅ | Min length: 1 | Detailed reasoning |
| reviewerId | string | ✅ | Min length: 1 | Reviewer identifier |
| reviewerRole | enum | ✅ | ReviewerRoleEnum | Reviewer qualification |
| priorDecisionId | string | ❌ | References ReviewDecision.id | Prior decision being corrected |
| evidenceIds | array<string> | ❌ | Each references EvidenceRecord.id | Supporting evidence |
| decidedAt | string | ✅ | ISO 8601 timestamp | Decision timestamp |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

**⚠️ IMMUTABILITY CONSTRAINT**: Once written, a ReviewDecision record MUST NEVER be modified or deleted. Corrections require creating a new record with `priorDecisionId` referencing the original.

### 3.17 LearningPath

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique path identifier |
| title | string | ✅ | Min length: 1 | Path title |
| description | string | ❌ | Free text | Overview |
| moduleIds | array<string> | ✅ | Min items: 1; ordered | Sequence of modules |
| targetAudience | enum | ❌ | AudienceLevelEnum | Intended level |
| estimatedHours | number | ❌ | > 0 | Total time estimate |
| tags | array<string> | ❌ | Each: min length 1 | Categorization |
| createdBy | string | ✅ | Min length: 1 | Creator identifier |
| visibility | enum | ✅ | VisibilityEnum | Access control |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

### 3.18 LearningModule

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique module identifier |
| title | string | ✅ | Min length: 1 | Module title |
| description | string | ❌ | Free text | Learning objectives |
| contentType | enum | ✅ | ContentTypeEnum | Content format |
| contentBody | string | ✅ | Min length: 1 | Markdown or structured content |
| topicIds | array<string> | ❌ | Each references Topic.id | Related topics |
| conceptIds | array<string> | ❌ | Each references Concept.id | Related concepts |
| prerequisites | array<string> | ❌ | Each references LearningModule.id | Required prior modules |
| difficultyLevel | enum | ❌ | AudienceLevelEnum | Difficulty |
| estimatedMinutes | integer | ❌ | > 0 | Time estimate |
| createdBy | string | ✅ | Min length: 1 | Author identifier |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |
| contentVersion | integer | ✅ | ≥ 1 | Revision counter |

### 3.19 ResearchWorkspace

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | Pattern: `^ws-[a-z0-9-]+$` | User-chosen slug |
| name | string | ✅ | Min length: 1 | Display name |
| description | string | ❌ | Free text | Research focus |
| ownerUserId | string | ✅ | Min length: 1 | Owner identifier |
| memberUserIds | array<string> | ❌ | Each: user ID | Collaborators |
| entityReferences | array<EntityRefObj> | ❌ | See below | Bookmarked entities |
| tags | array<string> | ❌ | Each: min length 1 | Organizational tags |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

#### EntityRefObj

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| entityType | string | ✅ | Entity type name |
| entityId | string | ✅ | Referenced entity ID |
| addedAt | string | ✅ | ISO 8601 timestamp |
| note | string | ❌ | Optional context note |

### 3.20 ResearchAnnotation

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique annotation identifier |
| workspaceId | string | ✅ | Must reference ResearchWorkspace.id | Parent workspace |
| targetEntityType | string | ✅ | Entity type name | Annotated entity type |
| targetEntityId | string | ✅ | Valid entity ID | Annotated entity |
| content | string | ✅ | Min length: 1 | Markdown annotation text |
| annotationType | enum | ✅ | AnnotationTypeEnum | Annotation category |
| createdBy | string | ✅ | Min length: 1 | Creator identifier |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

### 3.21 SavedInvestigation

| Field | Type | Required | Format / Constraints | Description |
|-------|------|----------|---------------------|-------------|
| id | string | ✅ | UUID v4 | Unique investigation identifier |
| workspaceId | string | ✅ | Must reference ResearchWorkspace.id | Parent workspace |
| title | string | ✅ | Min length: 1 | Investigation title |
| queryParameters | object | ✅ | Arbitrary JSON | Serialized query state |
| resultSnapshot | object | ❌ | Arbitrary JSON | Cached results |
| notes | string | ❌ | Free text | User commentary |
| createdBy | string | ✅ | Min length: 1 | Creator identifier |
| createdAt | string | ✅ | ISO 8601 | Creation timestamp |
| updatedAt | string | ✅ | ISO 8601 | Last modification |
| schemaVersion | string | ✅ | SemVer | Entity schema version |

---

## 4. Cross-Reference Integrity Rules

1. **QuranVerse.surahId** → MUST exist in QuranSurah.id
2. **Translation.verseId** → MUST exist in QuranVerse.id
3. **LexicalEntry.rootIds[]** → Each MUST exist in RootAnalysis.id
4. **LexicalEntry.primaryRootId** → MUST be member of rootIds
5. **RootAnalysis.lexicalEntryId** → MUST exist in LexicalEntry.id
6. **Lemma.lexicalEntryId** → MUST exist in LexicalEntry.id
7. **Lemma.rootAnalysisId** → MUST exist in RootAnalysis.id
8. **MorphologicalAnalysis.lemmaId** → MUST exist in Lemma.id
9. **MorphologicalAnalysis.verseId** → MUST exist in QuranVerse.id
10. **Topic.parentDomainId** → MUST exist in Domain.id
11. **Topic.parentDimensionId** → If present, MUST exist in Dimension.id
12. **Dimension.parentDomainId** → MUST exist in Domain.id
13. **Relationship.sourceEntityId** → MUST exist (any entity table)
14. **Relationship.targetEntityId** → MUST exist (any entity table)
15. **EvidenceRecord.verseId** → MUST exist in QuranVerse.id
16. **ScholarlyClaim.evidenceIds[]** → Each MUST exist in EvidenceRecord.id
17. **ReviewDecision.priorDecisionId** → If present, MUST exist in ReviewDecision.id
18. **LearningPath.moduleIds[]** → Each MUST exist in LearningModule.id
19. **ResearchAnnotation.workspaceId** → MUST exist in ResearchWorkspace.id
20. **SavedInvestigation.workspaceId** → MUST exist in ResearchWorkspace.id

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "draft-design"*
