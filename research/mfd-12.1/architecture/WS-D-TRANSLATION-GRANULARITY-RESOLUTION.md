# WS-D: Q25 — Translation Granularity Resolution

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 (Data Model Architecture Resolution) |
| Question | Q25 from FAHM Programme Dashboard §39 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-D, agent-106) |
| Review Status | pending-scholarly-review |

---

## 1. CURRENT STATE

### Canonical Model (`MFD-12-CANONICAL-DATA-MODEL.md`)
- **Translation entity (§4C)** is per-verse only. The `text` field contains the full translated verse.
- ID format: `trans-{lang}-{translator}-v{n}-{surah}-{ayah}` — unique per verse per edition.
- No word-level translation entity exists.
- Section 7 (Unresolved Questions) states: "Should Translation be per-verse (current design) or support per-word translation for interlinear study? Per-word would require a separate WordTranslation entity linked to MorphologicalAnalysis."

### Existing Infrastructure
- **Token addressing** is defined in `MFD-12-LINGUISTIC-INTEGRATION-SPEC.md` §2: `{surah}:{ayah}:{wordPosition}` (1-based).
- **MorphologicalAnalysis** already references specific word positions within verses.
- **Lemma** entities carry `occurrences[]` with `wordPosition` per token.
- The Quran corpus (`quran-json@3.1.2`) provides word-count per verse (`QuranVerse.wordCount`).
- Total tokens across the Quran: approximately 77,430 words.

### Legacy Data
- No per-word translation data exists in `data/`. All existing translations are per-verse.
- The local-first spec (`MFD-12-LOCAL-FIRST-SPEC.md`) lists "Word Morphology & Glosses" as available offline but does not mention word-level translations.

### External Corpus Support
- Open-source interlinear datasets exist (e.g., Quran Word-by-Word Translation by Tafsir Ibn Kathir project, Corpus Quran word-by-word). These could serve as import sources but are not currently integrated.

---

## 2. OPTION ANALYSIS

### Option A: Per-Verse Only (Status Quo)
Maintain the current Translation entity as-is. Word-level understanding comes exclusively from LexicalEntry glosses and MorphologicalAnalysis.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Simple schema; ~6,236 verses × N editions = manageable record count; no new entity type; aligns with how most published translations work |
| **Cons** | Users cannot see word-by-word correspondence; interlinear study requires manual cross-referencing between translation text and lexical entries; limits pedagogical utility for Arabic learners |
| **Data Volume** | ~6,236 records per translation edition |
| **Use Cases Served** | Reading, reference, thematic study |
| **Use Cases Blocked** | Interlinear study, word-by-word learning, precise translation comparison |

### Option B: Separate WordTranslation Entity (Recommended — Deferred Activation)
Define a `WordTranslation` entity type that maps individual tokens to translated glosses. Keep it as an optional, independently-loadable dataset. Link to MorphologicalAnalysis via token address.

| Aspect | Assessment |
|--------|------------|
| **Pros** | Enables interlinear display; supports Arabic language learners; each word translation carries its own provenance; can be loaded lazily (not bundled); preserves per-verse Translation as the primary reading experience |
| **Cons** | ~77,430 records per word-translation edition (12× data volume increase vs per-verse); requires external corpus sourcing; adds schema complexity; scholarly review burden for each word mapping |
| **Data Volume** | ~77,430 records per edition; at ~200 bytes each ≈ 15 MB per edition (acceptable for lazy-load) |
| **Use Cases Served** | All per-verse cases + interlinear study, word-level comparison, language learning |
| **Use Cases Blocked** | None |

### Option C: Embed Word Translations in Translation Entity
Add an optional `wordTranslations[]` array to the existing Translation entity.

| Aspect | Assessment |
|--------|------------|
| **Pros** | No new entity type; keeps related data together |
| **Cons** | Violates Design Principle 2 (Separation of Knowledge Entities); bloats Translation records (average 12+ items per verse); makes it impossible to load per-verse translations without also loading word data; complicates versioning (a word translation correction changes the entire verse record); couples two distinct scholarly products |
| **Data Volume** | Same total bytes as Option B but concentrated in fewer, larger records |

---

## 3. RECOMMENDED RESOLUTION

**Option B: Define WordTranslation as a separate entity, but defer population to a future workstream.**

### Rationale
1. **Schema Readiness**: Defining the entity now prevents future schema-breaking changes when interlinear support is needed. The canonical model should anticipate this requirement.
2. **Separation of Concerns**: Per-verse translations are authored by translators as complete sentences. Word-by-word glosses are a different scholarly product (often derived from morphological analysis). They have different provenance, different review processes, and different licensing.
3. **Local-First Compatibility**: At ~15 MB per edition, word translations are too large to bundle but perfectly suited for lazy-load into IndexedDB on demand — matching the architecture in `MFD-12-LOCAL-FIRST-SPEC.md` §2.1.
4. **Linkage to Existing Infrastructure**: The `{surah}:{ayah}:{wordPosition}` addressing scheme and MorphologicalAnalysis entities already provide the anchor points. WordTranslation simply adds a translated gloss layer on top.
5. **Deferred Activation**: No word-translation data currently exists in the project. Creating the schema without requiring immediate population avoids blocking the migration timeline.

---

## 4. SCHEMA CHANGES

### 4.1 New Entity: WordTranslation

Add to Group A (Quranic Canon) in `MFD-12-CANONICAL-DATA-MODEL.md`, after Translation:

#### Identifier Strategy Addition
| Entity | ID Format | Example | Rationale |
|--------|-----------|---------|----------|
| WordTranslation | `wtrans-{lang}-{source}-v{n}-{surah}-{ayah}-{wordPos}` | `wtrans-en-corpus-v1-002-255-4` | Composite key encoding edition + position |

#### Entity Definition (new §4C.1)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Composite key per above |
| verseId | string | ✅ | Reference to QuranVerse.id |
| wordPosition | integer | ✅ | 1-based position within verse (matches Linguistic Integration Spec §2) |
| tokenArabic | string | ✅ | Exact surface form from pinned corpus |
| language | string | ✅ | ISO 639-1 code |
| source | string | ✅ | Word-translation corpus or scholar name |
| version | string | ✅ | Edition/version identifier |
| gloss | string | ✅ | Word-level translation/gloss |
| grammaticalRole | string | ❌ | Brief POS label in target language |
| licenseType | string | ✅ | Copyright/license identifier |
| corpusVersion | string | ✅ | Must match pinned corpus version |
| schemaVersion | string | ✅ | Entity schema version |

**Relationships**: Translates → token at QuranVerse; May reference → MorphologicalAnalysis (via shared verseId + wordPosition)

### 4.2 New JSON Schema File

Create `research/mfd-12/architecture/entity-schemas/word-translation.schema.json`:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/word-translation",
  "title": "MFD-12 WordTranslation",
  "description": "Per-word translation gloss for interlinear study. Optional dataset loaded on demand.",
  "type": "object",
  "required": ["id", "verseId", "wordPosition", "tokenArabic", "language", "source", "version", "gloss", "licenseType", "corpusVersion", "schemaVersion"],
  "additionalProperties": false,
  "properties": {
    "id": { "type": "string", "pattern": "^wtrans-[a-z]{2}-[a-z0-9-]+-v[0-9]+-[0-9]{3}-[0-9]{1,3}-[0-9]+$" },
    "verseId": { "type": "string", "pattern": "^[0-9]{1,3}:[0-9]{1,3}$" },
    "wordPosition": { "type": "integer", "minimum": 1 },
    "tokenArabic": { "type": "string", "minLength": 1 },
    "language": { "type": "string", "pattern": "^[a-z]{2}$" },
    "source": { "type": "string", "minLength": 1 },
    "version": { "type": "string", "minLength": 1 },
    "gloss": { "type": "string", "minLength": 1 },
    "grammaticalRole": { "type": "string" },
    "licenseType": { "type": "string", "minLength": 1 },
    "corpusVersion": { "type": "string", "minLength": 1 },
    "schemaVersion": { "type": "string", "minLength": 1 }
  }
}
```

### 4.3 Canonical Model Updates
- Update Relationship Map (§8) to show: `QuranVerse ◀──N:1── WordTranslation`
- Add to §6 (Key Design Decisions): "6.7 WordTranslation Separation — WordTranslation is a distinct entity from Translation because they represent different scholarly products with different provenance, granularity, and licensing. WordTranslation is an optional dataset not required for core application function."

### 4.4 Data Dictionary Addition
Add §3.3.1 (WordTranslation) with all field definitions following the pattern established for Translation.

### 4.5 Cross-Reference Integrity Rules
Add to `MFD-12-DATA-DICTIONARY.md` §4:
- `WordTranslation.verseId` → MUST exist in QuranVerse.id
- `WordTranslation.wordPosition` → MUST be ≤ QuranVerse.wordCount for referenced verse
- `WordTranslation.corpusVersion` → MUST match QuranVerse.corpusVersion

---

## 5. MIGRATION IMPACT

### Phase Affected
No immediate migration impact. This is a **schema-only addition** with deferred population.

### Migration Steps (Future — When Data Is Available)
1. Source word-translation corpus (e.g., Corpus Quran, open-source interlinear datasets).
2. Validate each token against `quran-json@3.1.2` using `{surah}:{ayah}:{wordPosition}` addressing.
3. Generate composite IDs.
4. Verify license compatibility for each source.
5. Store as separate file: `data/translations/word-translations-{lang}-{source}.json`.
6. Register in local-first cache manifest as lazy-loadable dataset.

### Risk Assessment
- **Zero risk to current migration**: No existing data needs transformation.
- **Future risk**: Token alignment between external word-translation corpora and `quran-json@3.1.2` may require normalization (different tokenization schemes). This is deferred to the linguistic integration workstream.

---

## 6. BACKWARD COMPATIBILITY

### Existing Backups
- No impact. WordTranslation is additive.
- Existing Translation records remain unchanged.

### Data Portability
- Export format gains an optional `word-translations/` directory.
- Import validation treats WordTranslation files as optional.
- Applications that do not understand WordTranslation simply ignore the files.

### Breaking Changes
- **None**. This is a purely additive schema change.
- Consumers querying Translation entities see no difference.
- The new entity type is invisible until populated.

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted (WS-D, agent-106)" | reviewStatus: "pending-scholarly-review"*
