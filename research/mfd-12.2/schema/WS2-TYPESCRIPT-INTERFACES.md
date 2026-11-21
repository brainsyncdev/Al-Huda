# WS2: TypeScript Interface Contracts

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 (Canonical Schema Implementation Planning) |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-review |
| Depends On | WS2-SUBDIMENSION-SCHEMA.json, WS2-WORD-TRANSLATION-SCHEMA.json, WS2-LEARNING-PROGRESS-SCHEMA.json, WS2-UPDATED-RELATIONSHIP-SCHEMA.json |

---

## 1. Overview

This document defines the TypeScript interface contracts for the 3 new canonical entities (Subdimension, WordTranslation, LearningProgress), the updated Relationship entity with CROSS_LINGUAL_VARIANT support, and the Concept entity modification with crossLingualNotes. These interfaces are implementation-ready and map 1:1 to their respective JSON Schemas.

### Design Conventions

- All interfaces use `readonly` properties where the entity is immutable (Group A).
- Mutable entities (Groups C, E) omit `readonly` to allow in-place updates before persistence.
- Enum types are extracted as string literal unions for tree-shaking compatibility.
- ProvenanceObject is shared across all curated entities and defined once.
- Each interface includes a companion type guard function signature.

---

## 2. Shared Types

```typescript
/**
 * Standard review lifecycle status used by all mutable curated entities.
 * Defined in MFD-12-DATA-DICTIONARY.md §2.
 */
export type ReviewStatus =
  | 'DRAFT'
  | 'PENDING_SCHOLARLY_REVIEW'
  | 'APPROVED'
  | 'REVISED'
  | 'DEPRECATED';

/**
 * Provenance metadata attached to every curated entity.
 * Matches ProvenanceObject in MFD-12-DATA-DICTIONARY.md §3.4.
 */
export interface ProvenanceObject {
  /** Process, script, or scholar name that produced this data. */
  readonly origin: string;
  /** How the data was produced (e.g., 'manual-curation', 'array-expansion'). */
  readonly method: string;
  /** Pinned corpus version if applicable. */
  readonly corpusVersion?: string;
  /** ISO 8601 timestamp of assertion. */
  readonly assertedAt: string;
  /** Agent identifier (human or automated). */
  readonly assertedBy: string;
}

/** Type guard for ProvenanceObject. */
export function isProvenanceObject(value: unknown): value is ProvenanceObject {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.origin === 'string' && obj.origin.length > 0 &&
    typeof obj.method === 'string' && obj.method.length > 0 &&
    typeof obj.assertedAt === 'string' &&
    typeof obj.assertedBy === 'string' && obj.assertedBy.length > 0
  );
}
```

---

## 3. Subdimension Interface

**Source Schema**: WS2-SUBDIMENSION-SCHEMA.json
**Entity Group**: C (Knowledge Taxonomy)
**Mutability**: Mutable, Curated
**Target File**: `src/types/entities/subdimension.ts`

```typescript
import type { ProvenanceObject, ReviewStatus } from './shared';

/**
 * Fourth-level taxonomy grouping beneath Dimension.
 * Elevated from embedded string references to first-class entity per WS-D Q24 resolution.
 *
 * ID Format: `subdim-{slug}` (e.g., 'subdim-divine-names')
 */
export interface Subdimension {
  /** Unique identifier with subdim- prefix. Pattern: ^subdim-[a-z0-9-]+$ */
  id: string;

  /** English title. Min length: 1. */
  titleEn: string;

  /** Arabic title with tashkīl. Optional. */
  titleAr?: string;

  /** Urdu title in Urdu script. Optional. */
  titleUr?: string;

  /** Scope description of this subdimension. Min length: 1. */
  description: string;

  /** Reference to parent Dimension.id. Pattern: ^dim-[a-z0-9-]+$ */
  parentDimensionId: string;

  /**
   * Direct child topic IDs. Pattern: ^topic-[a-z0-9-]+$
   * Authoritative containment represented by EDITORIAL_CLASSIFICATION edges.
   * This array is maintained for human readability and legacy compatibility.
   */
  topicIds?: string[];

  /** Search aliases for discovery. Each min length: 1. */
  aliases?: string[];

  /** Origin metadata. Required. */
  provenance: ProvenanceObject;

  /** Current scholarly review state. Required. */
  reviewStatus: ReviewStatus;

  /** Entity schema version (SemVer). Required. */
  schemaVersion: string;

  /** Content revision counter; monotonically increasing. Minimum: 1. */
  contentVersion: number;
}

/** Brand type for compile-time ID safety. */
export type SubdimensionId = string & { readonly __brand: 'SubdimensionId' };

/** Validate that a string matches the Subdimension ID pattern. */
export function isSubdimensionId(value: string): value is SubdimensionId {
  return /^subdim-[a-z0-9-]+$/.test(value);
}

/** Type guard for Subdimension entity. */
export function isSubdimension(value: unknown): value is Subdimension {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' && isSubdimensionId(obj.id) &&
    typeof obj.titleEn === 'string' && obj.titleEn.length > 0 &&
    typeof obj.description === 'string' && obj.description.length > 0 &&
    typeof obj.parentDimensionId === 'string' && /^dim-[a-z0-9-]+$/.test(obj.parentDimensionId) &&
    isProvenanceObject(obj.provenance) &&
    ['DRAFT', 'PENDING_SCHOLARLY_REVIEW', 'APPROVED', 'REVISED', 'DEPRECATED'].includes(obj.reviewStatus as string) &&
    typeof obj.schemaVersion === 'string' && obj.schemaVersion.length > 0 &&
    typeof obj.contentVersion === 'number' && obj.contentVersion >= 1
  );
}

/**
 * Cross-reference validation rules (to be implemented in validation layer):
 * - Subdimension.parentDimensionId → MUST exist in Dimension.id
 * - Subdimension.topicIds[] → Each MUST exist in Topic.id
 * - Dimension.subdimensionIds[] → Each MUST exist in Subdimension.id
 * - Topic.parentSubdimensionId → If present, MUST exist in Subdimension.id
 */
export interface SubdimensionCrossRefValidator {
  validateParentDimension(subdimension: Subdimension, dimensionExists: (id: string) => boolean): boolean;
  validateTopicIds(subdimension: Subdimension, topicExists: (id: string) => boolean): string[];
}
```

---

## 4. WordTranslation Interface

**Source Schema**: WS2-WORD-TRANSLATION-SCHEMA.json
**Entity Group**: A (Quranic Canon)
**Mutability**: Immutable (corpus-pinned)
**Population Status**: Deferred — schema only, no data until future workstream
**Target File**: `src/types/entities/word-translation.ts`

```typescript
/**
 * Per-word translation gloss for interlinear study.
 * Optional dataset loaded on demand into IndexedDB.
 * Defined per WS-D Q25 resolution; population deferred.
 *
 * ID Format: `wtrans-{lang}-{source}-v{n}-{surah}-{ayah}-{wordPos}`
 * Example: 'wtrans-en-corpus-v1-002-255-4'
 */
export interface WordTranslation {
  /** Composite key encoding edition + token position. */
  readonly id: string;

  /** Reference to QuranVerse.id (surah:ayah). Pattern: ^[0-9]{1,3}:[0-9]{1,3}$ */
  readonly verseId: string;

  /** 1-based word position within verse; matches Linguistic Integration Spec §2. */
  readonly wordPosition: number;

  /** Exact surface form from pinned quran-json corpus with full tashkīl. */
  readonly tokenArabic: string;

  /** ISO 639-1 target language code. Pattern: ^[a-z]{2}$ */
  readonly language: string;

  /** Word-translation corpus name or scholar attribution. */
  readonly source: string;

  /** Edition/version identifier of the word-translation dataset. */
  readonly version: string;

  /** Word-level translation or gloss in target language. */
  readonly gloss: string;

  /** Brief part-of-speech or grammatical label in target language. Optional. */
  readonly grammaticalRole?: string;

  /** Copyright or license identifier for this word-translation dataset. */
  readonly licenseType: string;

  /** Must match pinned quran-json corpus version used for token alignment. */
  readonly corpusVersion: string;

  /** Entity schema version (SemVer). */
  readonly schemaVersion: string;
}

/** Brand type for compile-time ID safety. */
export type WordTranslationId = string & { readonly __brand: 'WordTranslationId' };

/** Validate that a string matches the WordTranslation ID pattern. */
export function isWordTranslationId(value: string): value is WordTranslationId {
  return /^wtrans-[a-z]{2}-[a-z0-9-]+-v[0-9]+-[0-9]{3}-[0-9]{1,3}-[0-9]+$/.test(value);
}

/** Type guard for WordTranslation entity. */
export function isWordTranslation(value: unknown): value is WordTranslation {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' && isWordTranslationId(obj.id) &&
    typeof obj.verseId === 'string' && /^[0-9]{1,3}:[0-9]{1,3}$/.test(obj.verseId) &&
    typeof obj.wordPosition === 'number' && Number.isInteger(obj.wordPosition) && obj.wordPosition >= 1 &&
    typeof obj.tokenArabic === 'string' && obj.tokenArabic.length > 0 &&
    typeof obj.language === 'string' && /^[a-z]{2}$/.test(obj.language) &&
    typeof obj.source === 'string' && obj.source.length > 0 &&
    typeof obj.version === 'string' && obj.version.length > 0 &&
    typeof obj.gloss === 'string' && obj.gloss.length > 0 &&
    typeof obj.licenseType === 'string' && obj.licenseType.length > 0 &&
    typeof obj.corpusVersion === 'string' && obj.corpusVersion.length > 0 &&
    typeof obj.schemaVersion === 'string' && obj.schemaVersion.length > 0
  );
}

/**
 * Token address parsed from WordTranslation composite ID.
 * Useful for joining with MorphologicalAnalysis and Lemma occurrences.
 */
export interface TokenAddress {
  readonly surah: number;
  readonly ayah: number;
  readonly wordPosition: number;
}

/** Parse a verseId string into its numeric components. */
export function parseVerseId(verseId: string): TokenAddress | null {
  const match = verseId.match(/^(\d{1,3}):(\d{1,3})$/);
  if (!match) return null;
  return { surah: parseInt(match[1], 10), ayah: parseInt(match[2], 10), wordPosition: 0 };
}

/**
 * Cross-reference validation rules:
 * - WordTranslation.verseId → MUST exist in QuranVerse.id
 * - WordTranslation.wordPosition → MUST be ≤ QuranVerse.wordCount for referenced verse
 * - WordTranslation.corpusVersion → MUST match QuranVerse.corpusVersion
 */
export interface WordTranslationCrossRefValidator {
  validateVerseReference(wt: WordTranslation, getVerseWordCount: (verseId: string) => number | null, getVerseCorpusVersion: (verseId: string) => string | null): boolean;
}
```

---

## 5. LearningProgress Interface

**Source Schema**: WS2-LEARNING-PROGRESS-SCHEMA.json
**Entity Group**: E (User & Research Workspace)
**Mutability**: Mutable, Personal
**Storage**: Local IndexedDB only — never bundled, never synced
**Target File**: `src/types/entities/learning-progress.ts`

```typescript
/**
 * Progress status for a learning module.
 */
export type LearningProgressStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'PAUSED';

/**
 * Personal learning progress state for a specific module within a path.
 * Stored locally in IndexedDB only; never bundled or synced.
 * Defined per WS-D Q29 resolution.
 *
 * ID Format: UUID v4
 */
export interface LearningProgress {
  /** UUID v4; device-local personal identifier. */
  id: string;

  /** Reference to LearningPath.id (UUID v4). */
  learningPathId: string;

  /** Local device user identifier (or 'default' for single-user mode). */
  userId: string;

  /** Reference to LearningModule.id (UUID v4); must be member of referenced LearningPath.moduleIds[]. */
  moduleId: string;

  /** Current progress state for this module. */
  status: LearningProgressStatus;

  /** ISO 8601 timestamp when user first started this module. Optional. */
  startedAt?: string;

  /** ISO 8601 timestamp when user completed this module. Optional. */
  completedAt?: string;

  /** ISO 8601 timestamp of most recent activity on this module. Required. */
  lastActiveAt: string;

  /** Cumulative time spent on this module in seconds. Optional. */
  timeSpentSeconds?: number;

  /** Normalized quiz score if applicable (0.0–1.0). Optional. */
  quizScore?: number;

  /** Number of quiz or completion attempts. Optional. */
  attempts?: number;

  /** Personal reflection or notes on this module. Optional. */
  notes?: string;

  /** ISO 8601 creation timestamp. Required. */
  createdAt: string;

  /** ISO 8601 last modification timestamp. Required. */
  updatedAt: string;

  /** Entity schema version (SemVer). Required. */
  schemaVersion: string;
}

/** UUID v4 regex pattern for validation. */
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Validate that a string is a UUID v4. */
export function isUuidV4(value: string): boolean {
  return UUID_V4_PATTERN.test(value);
}

/** Type guard for LearningProgress entity. */
export function isLearningProgress(value: unknown): value is LearningProgress {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.id === 'string' && isUuidV4(obj.id) &&
    typeof obj.learningPathId === 'string' && isUuidV4(obj.learningPathId) &&
    typeof obj.userId === 'string' && obj.userId.length > 0 &&
    typeof obj.moduleId === 'string' && isUuidV4(obj.moduleId) &&
    ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'PAUSED'].includes(obj.status as string) &&
    typeof obj.lastActiveAt === 'string' &&
    typeof obj.createdAt === 'string' &&
    typeof obj.updatedAt === 'string' &&
    typeof obj.schemaVersion === 'string' && obj.schemaVersion.length > 0 &&
    (obj.timeSpentSeconds === undefined || (typeof obj.timeSpentSeconds === 'number' && obj.timeSpentSeconds >= 0)) &&
    (obj.quizScore === undefined || (typeof obj.quizScore === 'number' && obj.quizScore >= 0.0 && obj.quizScore <= 1.0)) &&
    (obj.attempts === undefined || (typeof obj.attempts === 'number' && obj.attempts >= 0))
  );
}

/**
 * Factory function to create a new LearningProgress record with defaults.
 */
export function createLearningProgress(
  learningPathId: string,
  moduleId: string,
  userId: string = 'default'
): LearningProgress {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    learningPathId,
    userId,
    moduleId,
    status: 'NOT_STARTED',
    lastActiveAt: now,
    createdAt: now,
    updatedAt: now,
    schemaVersion: '1.0.0',
  };
}

/**
 * Cross-reference validation rules:
 * - LearningProgress.learningPathId → MUST exist in LearningPath.id
 * - LearningProgress.moduleId → MUST exist in LearningModule.id AND be member of LearningPath.moduleIds[]
 */
export interface LearningProgressCrossRefValidator {
  validatePathReference(lp: LearningProgress, pathExists: (id: string) => boolean): boolean;
  validateModuleMembership(lp: LearningProgress, getPathModuleIds: (pathId: string) => string[] | null): boolean;
}
```

---

## 6. Updated Relationship Interface (with CROSS_LINGUAL_VARIANT)

**Source Schema**: WS2-UPDATED-RELATIONSHIP-SCHEMA.json
**Entity Group**: C (Knowledge Taxonomy)
**Change**: Added CROSS_LINGUAL_VARIANT to enum; conditional required fields
**Target File**: Update `src/types/entities/relationship.ts`

```typescript
import type { ProvenanceObject, ReviewStatus } from './shared';

/**
 * Canonical relationship types.
 * Updated per WS-D Q27 resolution to include CROSS_LINGUAL_VARIANT.
 */
export type RelationshipType =
  | 'DIRECT_QURANIC_REFERENCE'
  | 'LEXICAL_RELATION'
  | 'MORPHOLOGICAL_RELATION'
  | 'THEMATIC_RELATION'
  | 'TAFSIR_SUPPORTED'
  | 'EDITORIAL_CLASSIFICATION'
  | 'CONTRAST'
  | 'CONTEMPORARY_APPLICATION'
  | 'NARRATIVE_RELATION'
  | 'CROSS_LINGUAL_VARIANT'  // NEW per WS-D Q27
  | 'CUSTOM';

/**
 * Base Relationship entity — typed edge between any two taxonomy or knowledge entities.
 */
export interface Relationship {
  /** Deterministic composite or UUID. */
  id: string;

  /** Source entity ID (any valid entity). For CROSS_LINGUAL_VARIANT, must be Concept.id. */
  sourceEntityId: string;

  /** Target entity ID (any valid entity). For CROSS_LINGUAL_VARIANT, must be Concept.id. */
  targetEntityId: string;

  /** Canonical relationship type. */
  relationshipType: RelationshipType;

  /** Required when relationshipType is CUSTOM. */
  customType?: string;

  /** Human-readable explanation of this edge. */
  description?: string;

  /** Relevance or confidence score (0.0–1.0). */
  weight?: number;

  /** Whether inverse relationship is implied. Always true for CROSS_LINGUAL_VARIANT. */
  bidirectional: boolean;

  /** Required when relationshipType is CROSS_LINGUAL_VARIANT. Explains semantic divergence. */
  divergenceRationale?: string;

  /**
   * Required when relationshipType is CROSS_LINGUAL_VARIANT.
   * ISO 639-1 codes of affected languages (2–3 items).
   */
  languagesAffected?: string[];

  /** Origin metadata. Required. */
  provenance: ProvenanceObject;

  /** Current scholarly review state. Required. */
  reviewStatus: ReviewStatus;

  /** Entity schema version (SemVer). Required. */
  schemaVersion: string;
}

/**
 * Narrowed type for CROSS_LINGUAL_VARIANT relationships.
 * Use this when you know the relationship type at compile time.
 */
export interface CrossLingualVariantRelationship extends Relationship {
  relationshipType: 'CROSS_LINGUAL_VARIANT';
  /** Must match ^cpt-[a-z0-9-]+$ */
  sourceEntityId: string;
  /** Must match ^cpt-[a-z0-9-]+$ */
  targetEntityId: string;
  /** Always true for symmetric cross-lingual links. */
  bidirectional: true;
  /** Required: explains why 1:1 alignment fails. */
  divergenceRationale: string;
  /** Required: 2–3 ISO 639-1 codes (e.g., ['ar', 'en']). */
  languagesAffected: [string, string] | [string, string, string];
}

/** Type guard: narrows Relationship to CrossLingualVariantRelationship. */
export function isCrossLingualVariant(rel: Relationship): rel is CrossLingualVariantRelationship {
  if (rel.relationshipType !== 'CROSS_LINGUAL_VARIANT') return false;
  return (
    typeof rel.divergenceRationale === 'string' && rel.divergenceRationale.length > 0 &&
    Array.isArray(rel.languagesAffected) &&
    rel.languagesAffected.length >= 2 &&
    rel.languagesAffected.length <= 3 &&
    rel.languagesAffected.every((l: unknown) => typeof l === 'string' && /^[a-z]{2}$/.test(l)) &&
    rel.bidirectional === true &&
    /^cpt-[a-z0-9-]+$/.test(rel.sourceEntityId) &&
    /^cpt-[a-z0-9-]+$/.test(rel.targetEntityId)
  );
}

/** Type guard for base Relationship entity. */
export function isRelationship(value: unknown): value is Relationship {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  const validTypes: RelationshipType[] = [
    'DIRECT_QURANIC_REFERENCE', 'LEXICAL_RELATION', 'MORPHOLOGICAL_RELATION',
    'THEMATIC_RELATION', 'TAFSIR_SUPPORTED', 'EDITORIAL_CLASSIFICATION',
    'CONTRAST', 'CONTEMPORARY_APPLICATION', 'NARRATIVE_RELATION',
    'CROSS_LINGUAL_VARIANT', 'CUSTOM'
  ];
  if (
    typeof obj.id !== 'string' || obj.id.length === 0 ||
    typeof obj.sourceEntityId !== 'string' || obj.sourceEntityId.length === 0 ||
    typeof obj.targetEntityId !== 'string' || obj.targetEntityId.length === 0 ||
    !validTypes.includes(obj.relationshipType as RelationshipType) ||
    typeof obj.bidirectional !== 'boolean' ||
    !isProvenanceObject(obj.provenance) ||
    !['DRAFT', 'PENDING_SCHOLARLY_REVIEW', 'APPROVED', 'REVISED', 'DEPRECATED'].includes(obj.reviewStatus as string) ||
    typeof obj.schemaVersion !== 'string' || obj.schemaVersion.length === 0
  ) {
    return false;
  }
  // Conditional: CUSTOM requires customType
  if (obj.relationshipType === 'CUSTOM' && (typeof obj.customType !== 'string' || obj.customType.length === 0)) {
    return false;
  }
  // Conditional: CROSS_LINGUAL_VARIANT requires divergenceRationale + languagesAffected
  if (obj.relationshipType === 'CROSS_LINGUAL_VARIANT') {
    if (typeof obj.divergenceRationale !== 'string' || obj.divergenceRationale.length === 0) return false;
    if (!Array.isArray(obj.languagesAffected) || obj.languagesAffected.length < 2) return false;
  }
  return true;
}
```

---

## 7. Updated Concept Interface (crossLingualNotes addition)

**Source Schema**: Modified concept.schema.json per WS-D Q27
**Target File**: Update `src/types/entities/concept.ts`

```typescript
import type { ProvenanceObject, ReviewStatus } from './shared';

/**
 * Semantic alignment confidence between language variants of a concept.
 */
export type AlignmentConfidence = 'CLEAN' | 'PARTIAL' | 'DIVERGENT';

/**
 * Annotation describing semantic gaps between two language pairs.
 */
export interface AlignmentNote {
  /** Free-text note explaining the alignment or gap. */
  note?: string;
  /** Specific semantic elements present in one language but not the other. */
  semanticGaps?: string[];
}

/**
 * Cross-lingual alignment annotations for a Concept.
 * Added per WS-D Q27 resolution. Optional field.
 */
export interface CrossLingualNotes {
  /** Overall alignment confidence across all language pairs. Required within this object. */
  alignmentConfidence: AlignmentConfidence;

  /** English-to-Arabic alignment notes. */
  enToAr?: AlignmentNote;

  /** English-to-Urdu alignment notes. */
  enToUr?: AlignmentNote;

  /** Arabic-to-Urdu alignment notes. */
  arToUr?: AlignmentNote;

  /** References to Source entities supporting these alignment judgments. Pattern: ^src-[a-z0-9-]+$ */
  scholarlySources?: string[];
}

/**
 * Abstract semantic unit. Distinct from Topic: language-independent meaning node.
 * Updated per WS-D Q27 to include optional crossLingualNotes.
 */
export interface Concept {
  /** Semantic slug. Pattern: ^cpt-[a-z0-9-]+$ */
  id: string;

  /** English label. Required. */
  labelEn: string;

  /** Arabic label with tashkīl. Optional. */
  labelAr?: string;

  /** Urdu label in Urdu script. Optional. */
  labelUr?: string;

  /** Precise semantic definition. Required. */
  definition: string;

  /** Broader semantic domain. Optional. */
  semanticField?: string;

  /** Cross-references to related concepts. Pattern: ^cpt-[a-z0-9-]+$ */
  relatedConceptIds?: string[];

  /** Associated lexical entries. Pattern: ^lex-[a-z0-9-]+$ */
  lexicalEntryIds?: string[];

  /**
   * Semantic alignment annotations across Arabic/English/Urdu.
   * NEW per WS-D Q27. Optional.
   * When alignmentConfidence is DIVERGENT, CROSS_LINGUAL_VARIANT relationships should exist.
   */
  crossLingualNotes?: CrossLingualNotes;

  /** Origin metadata. Required. */
  provenance: ProvenanceObject;

  /** Current scholarly review state. Required. */
  reviewStatus: ReviewStatus;

  /** ISO 8601 creation timestamp. Required. */
  createdAt: string;

  /** ISO 8601 last modification timestamp. Required. */
  updatedAt: string;

  /** Entity schema version (SemVer). Required. */
  schemaVersion: string;

  /** Content revision counter. Minimum: 1. */
  contentVersion: number;
}

/** Type guard for CrossLingualNotes. */
export function isCrossLingualNotes(value: unknown): value is CrossLingualNotes {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (!['CLEAN', 'PARTIAL', 'DIVERGENT'].includes(obj.alignmentConfidence as string)) return false;
  if (obj.scholarlySources !== undefined) {
    if (!Array.isArray(obj.scholarlySources)) return false;
    if (!obj.scholarlySources.every((s: unknown) => typeof s === 'string' && /^src-[a-z0-9-]+$/.test(s))) return false;
  }
  return true;
}

/** Type guard for Concept (updated with crossLingualNotes). */
export function isConcept(value: unknown): value is Concept {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  if (
    typeof obj.id !== 'string' || !/^cpt-[a-z0-9-]+$/.test(obj.id) ||
    typeof obj.labelEn !== 'string' || obj.labelEn.length === 0 ||
    typeof obj.definition !== 'string' || obj.definition.length === 0 ||
    !isProvenanceObject(obj.provenance) ||
    !['DRAFT', 'PENDING_SCHOLARLY_REVIEW', 'APPROVED', 'REVISED', 'DEPRECATED'].includes(obj.reviewStatus as string) ||
    typeof obj.schemaVersion !== 'string' || obj.schemaVersion.length === 0 ||
    typeof obj.contentVersion !== 'number' || obj.contentVersion < 1
  ) {
    return false;
  }
  if (obj.crossLingualNotes !== undefined && !isCrossLingualNotes(obj.crossLingualNotes)) return false;
  return true;
}
```

---

## 8. Entity Registry Updates

**Target File**: Update `src/types/entities/index.ts`

```typescript
// Add to existing exports:
export type { Subdimension, SubdimensionId } from './subdimension';
export type { WordTranslation, WordTranslationId, TokenAddress } from './word-translation';
export type { LearningProgress, LearningProgressStatus } from './learning-progress';
export type { CrossLingualNotes, AlignmentConfidence, AlignmentNote } from './concept';
export type { CrossLingualVariantRelationship } from './relationship';

// Update CanonicalEntity union type:
import type { Subdimension } from './subdimension';
import type { WordTranslation } from './word-translation';
import type { LearningProgress } from './learning-progress';

/**
 * Union of all canonical entity types.
 * Updated to include 3 new entities (total: 24).
 */
export type CanonicalEntity =
  | QuranSurah
  | QuranVerse
  | Translation
  | WordTranslation      // NEW
  | LexicalEntry
  | RootAnalysis
  | Lemma
  | MorphologicalAnalysis
  | Concept
  | Topic
  | Domain
  | Dimension
  | Subdimension         // NEW
  | Relationship
  | Source
  | EvidenceRecord
  | ScholarlyClaim
  | ReviewDecision
  | LearningPath
  | LearningModule
  | LearningProgress     // NEW
  | ResearchWorkspace
  | ResearchAnnotation
  | SavedInvestigation;

/**
 * String literal union of all entity type names.
 * Updated to include 3 new types (total: 24).
 */
export type EntityType =
  | 'quran-surah'
  | 'quran-verse'
  | 'translation'
  | 'word-translation'   // NEW
  | 'lexical-entry'
  | 'root-analysis'
  | 'lemma'
  | 'morphological-analysis'
  | 'concept'
  | 'topic'
  | 'domain'
  | 'dimension'
  | 'subdimension'        // NEW
  | 'relationship'
  | 'source'
  | 'evidence-record'
  | 'scholarly-claim'
  | 'review-decision'
  | 'learning-path'
  | 'learning-module'
  | 'learning-progress'   // NEW
  | 'research-workspace'
  | 'research-annotation'
  | 'saved-investigation';
```

---

*This document is a design proposal. No production code has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-review"*
