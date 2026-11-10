# Urdu Translation Review Workflow

**Sprint 54** — Establishing a responsible, editorial review process for Urdu translations of topic titles.

## Overview

This document defines the workflow, data model, and policy decisions for managing Urdu translations of the 18 curated topic titles in the Quran Al Huda application.

**Current Status: 0 of 18 topics have verified Urdu translations.**

All 18 topics currently have English and Arabic titles, but no Urdu titles have been translated, reviewed, or published. This is intentional — we do not auto-generate translations.

---

## Translation Data Model

### UrduTranslationRecord

Each topic has an associated `UrduTranslationRecord` that tracks the translation lifecycle:

```typescript
interface UrduTranslationRecord {
  topicSlug: string;              // Must match a topic in src/lib/topics/data.ts
  englishTitle: string;           // Reference: English title
  arabicTitle: string;            // Reference: Arabic title
  proposedUrduTitle?: string;     // Proposed translation (optional until reviewed)
  translationSource?: string;     // Source of translation (e.g., "manual translation")
  translatorAttribution?: string; // Only when verified by a real translator
  reviewState: UrduTranslationReviewState;
  reviewNotes?: string;           // Editorial notes
  lastReviewedDate?: string;      // ISO date (only when real review occurred)
  knownLimitations: string[];     // Caveats, scope disclosures
}
```

### Review States

```typescript
type UrduTranslationReviewState =
  | "missing"       // No translation attempted yet
  | "draft"         // Translation exists but needs review
  | "needs_review"  // Ready for editorial review
  | "reviewed"      // Reviewed and approved
  | "published";    // Live in the application
```

**State Transitions:**
- `missing` → `draft` (when a translator proposes a translation)
- `draft` → `needs_review` (when ready for editorial review)
- `needs_review` → `reviewed` (when approved by editor)
- `reviewed` → `published` (when deployed to production)
- Any state → `missing` (if translation is rejected or withdrawn)

---

## Review Workflow

### Step 1: Translation Proposal

A qualified translator proposes an Urdu title for a topic. The proposal includes:
- The proposed Urdu text
- Translation source (manual, scholarly reference, etc.)
- Known limitations or caveats

**Do NOT:**
- Auto-generate translations using AI/ML
- Invent translator names or credentials
- Skip the review process

### Step 2: Editorial Review

An editor reviews the proposed translation for:
- Accuracy and fidelity to the original meaning
- Appropriate terminology and register
- Consistency with other translations
- RTL rendering correctness

The editor updates the record:
- Sets `reviewState` to `"needs_review"` or `"reviewed"`
- Adds `reviewNotes` with feedback
- Sets `lastReviewedDate` to the actual review date
- Adds `translatorAttribution` (only if verified)

### Step 3: Publication

Once reviewed and approved, the translation can be published:
- Sets `reviewState` to `"published"`
- The topic's `urduTitle` field in `src/lib/topics/data.ts` can be updated
- The translation appears in the UI with proper RTL rendering

---

## Translation Standards

### Quality Requirements

1. **Accuracy**: Translation must faithfully represent the original meaning
2. **Clarity**: Must be understandable to Urdu-speaking readers
3. **Consistency**: Terminology should be consistent across topics
4. **Attribution**: Real translator must be credited (no fabricated names)
5. **Limitations**: Any caveats must be documented

### RTL Rendering

Urdu uses the Arabic script and is written right-to-left (RTL). The application must:

1. Apply `dir="rtl"` to Urdu text containers
2. Use appropriate Urdu/Arabic fonts (e.g., Noto Nastaliq Urdu)
3. Ensure proper text alignment and line breaks
4. Test with screen readers for accessibility

**Implementation:**
```tsx
<span dir="rtl" lang="ur" className="font-urdu">
  {urduTitle}
</span>
```

### Fallback Behavior

When a Urdu translation is not available:
- Display the English title (primary fallback)
- Optionally display the Arabic title alongside
- Do NOT display a placeholder or auto-generated text
- Log the missing translation for editorial follow-up

---

## Current Status

**0 of 18 topics have verified Urdu translations.**

All 18 topics have:
- ✅ English titles
- ✅ Arabic titles
- ❌ Urdu titles (none verified)

The translation infrastructure is in place:
- ✅ Data model (`urdu-types.ts`)
- ✅ Storage layer (`urdu-storage.ts`)
- ✅ React context (`urdu-context.tsx`)
- ✅ Test suite (`urdu-translations.test.ts`)
- ✅ Audit script (`audit-urdu-translation-completeness.mjs`)

---

## Policy Decisions

### 1. No Auto-Generated Translations

**Decision**: We do NOT use AI/ML to auto-generate Urdu translations.

**Rationale**: Religious content requires human scholarly review. Auto-generated translations risk inaccuracy, misinterpretation, and loss of nuance. All translations must be produced and verified by qualified human translators.

### 2. Separate Storage from Backup Envelope

**Decision**: Urdu translations use a separate localStorage key (`alhuda.urdu-translations.v1`) and are NOT included in the shared backup envelope.

**Rationale**: 
- Avoids schema churn in the backup system
- Urdu translations have a distinct lifecycle (editorial review) separate from user data
- Keeps the backup envelope focused on user-generated content (reflections, bookmarks, etc.)
- Simplifies migration and versioning

### 3. No Fabricated Attribution

**Decision**: `translatorAttribution` and `lastReviewedDate` must only be set when a real review occurred.

**Rationale**: Fabricating translator names or review dates violates editorial integrity. If a translation has not been reviewed, the record must honestly reflect that state.

### 4. Validation on Every Write

**Decision**: All translation records are validated before being written to storage.

**Rationale**: Prevents invalid data from entering the system. Catches errors like:
- Publishing without a proposed translation
- Setting attribution before review
- Invalid review states

### 5. Explicit Review States

**Decision**: The `reviewState` field is required and must be one of the five defined states.

**Rationale**: Makes the translation lifecycle explicit and auditable. Prevents ambiguity about whether a translation has been reviewed.

---

## Storage

### localStorage Key

```
alhuda.urdu-translations.v1
```

### Store Structure

```typescript
interface UrduTranslationsStore {
  version: 1;
  records: Record<string, UrduTranslationRecord>;
  lastUpdated: string; // ISO date
}
```

### API

```typescript
// Get a single record
getTranslationRecord(topicSlug: string): UrduTranslationRecord | null

// Create or update a record (validates before writing)
setTranslationRecord(record: UrduTranslationRecord): UrduTranslationRecord

// Delete a record
deleteTranslationRecord(topicSlug: string): void

// Get all records
getAllTranslationRecords(): UrduTranslationRecord[]

// Export entire store
exportUrduTranslations(): UrduTranslationsStore

// Import store (validates all records)
importUrduTranslations(data: unknown): { success: boolean; errors: string[] }

// Clear all records
clearUrduTranslations(): void
```

---

## Testing

The test suite (`urdu-translations.test.ts`) covers:

- ✅ Type validation (review states, required fields)
- ✅ CRUD operations (create, read, update, delete)
- ✅ Review state transitions
- ✅ Validation rules (no publishing unreviewed, no fabricated attribution)
- ✅ RTL rendering (Arabic script detection)
- ✅ Fallback behavior (missing translations)
- ✅ Export/import functionality
- ✅ Error handling (corrupted localStorage)

Run tests:
```bash
pnpm test src/lib/translations/urdu-translations.test.ts
```

---

## Audit Script

The audit script (`scripts/audit-urdu-translation-completeness.mjs`) verifies:

- ✅ All 18 topics exist
- ✅ No topics have `urduTitle` set (policy: no auto-generated translations)
- ✅ Translation infrastructure files exist
- ✅ Documentation covers required sections
- ✅ Tests cover required scenarios

Run audit:
```bash
node scripts/audit-urdu-translation-completeness.mjs
```

Expected output:
```
✅ All Urdu translation completeness checks passed.
📋 Current Status: 0 of 18 topics have verified Urdu translations.
```

---

## Next Steps

To add Urdu translations:

1. **Identify qualified translators** with expertise in Quranic Arabic and Urdu
2. **Propose translations** for each topic, documenting sources and limitations
3. **Editorial review** by qualified editors
4. **Update records** with review dates and attribution
5. **Publish** approved translations
6. **Update topic data** in `src/lib/topics/data.ts` with verified `urduTitle` values

---

## References

- Topic data: `src/lib/topics/data.ts`
- Translation types: `src/lib/translations/urdu-types.ts`
- Translation storage: `src/lib/translations/urdu-storage.ts`
- Translation context: `src/lib/translations/urdu-context.tsx`
- Test suite: `src/lib/translations/urdu-translations.test.ts`
- Audit script: `scripts/audit-urdu-translation-completeness.mjs`
- Sprint 53 audit: `scripts/audit-topic-editorial-integrity.mjs`
