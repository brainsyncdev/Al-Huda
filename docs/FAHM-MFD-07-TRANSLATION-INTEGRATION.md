# MFD-07 Phase 4: Translation Integration

**Status:** Complete  
**Date:** 2026-11-12  
**Phase:** 4 of 6  

## Overview

Phase 4 connects the 767 ayah-topic mappings created in Phase 3 to actual Quran translation content. This integration layer enables users to view the actual Arabic text, English translations, and transliterations for all ayat referenced by each topic.

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  data/taxonomy/topic-ayah-mappings.json                    │
│  (767 mapping records)                                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  src/lib/taxonomy/topic-translation-data.ts                │
│  (Translation Enrichment Layer)                             │
│                                                             │
│  • Loads mappings                                           │
│  • Resolves ayah references                                 │
│  • Caches results                                           │
│  • Provides typed accessors                                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  src/lib/quran/data.ts                                      │
│  (Quran Dataset Loader)                                     │
│                                                             │
│  • getAyah(surah, ayah)                                     │
│  • getSurahIndex()                                          │
│  • Returns: { arabic, translation, transliteration }        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  src/components/taxonomy/topic-translation-viewer.tsx      │
│  (UI Component)                                             │
│                                                             │
│  • Groups ayat by mapping type                              │
│  • Displays Arabic (RTL), English, transliteration          │
│  • Shows rationale and metadata                             │
│  • Collapsible sections                                     │
│  • Statistics header                                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Layers

#### 1. Data Layer (`topic-translation-data.ts`)

**Responsibilities:**
- Load and cache the 767 mapping records
- Resolve each mapping to actual ayah content
- Handle ayah ranges (ayahStart to ayahEnd)
- Provide typed accessor functions
- Validate mapping integrity

**Key Functions:**

```typescript
// Get all ayahs for a topic with full text
getTopicTranslations(topicId: string): TopicTranslationResult | null

// Get just the ayah texts (convenience wrapper)
getTopicAyahTexts(topicId: string): AyahText[]

// Get summary statistics
getTopicTranslationSummary(topicId: string): TranslationSummary | null

// Get all available topic IDs
getAllTopicIds(): string[]

// Validate all mappings can be resolved
validateMappings(): { totalMappings, totalAyat, issues }
```

**Caching Strategy:**
- Mappings cached on `globalThis` across HMR reloads
- Indexed by topicId for O(1) lookup
- Quran data cached by the underlying `data.ts` loader

#### 2. UI Layer (`topic-translation-viewer.tsx`)

**Responsibilities:**
- Display all mapped ayat for a topic
- Group ayat by mapping type (DIRECT_REFERENCE, EXPLICIT_INSTRUCTION, etc.)
- Show Arabic text with proper RTL rendering
- Display English translation and transliteration
- Show rationale and metadata
- Provide navigation to full ayah pages

**Features:**
- Collapsible sections for each mapping type
- Statistics header with coverage metrics
- Color-coded mapping type badges
- Accessible markup (ARIA labels, keyboard navigation)
- Responsive design

## Data Types

### Core Types

```typescript
interface AyahText {
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  transliteration: string;
  mappingId: string;
  mappingType: string;
  rationale: string;
}

interface TopicTranslationResult {
  topicId: string;
  topicTitle: string;
  ayahs: AyahText[];
  totalAyahs: number;
  mappingTypeDistribution: Record<string, number>;
}

interface TranslationSummary {
  topicId: string;
  totalAyahs: number;
  uniqueSurahs: number[];
  mappingTypes: Record<string, number>;
  hasDirectReferences: boolean;
  hasExplicitInstructions: boolean;
  hasPropheticNarratives: boolean;
  hasThematicReferences: boolean;
}
```

### Mapping Types

The system supports four mapping types:

1. **DIRECT_REFERENCE** - Explicit mention of the topic concept
2. **EXPLICIT_INSTRUCTION** - Direct command or prohibition related to the topic
3. **PROPHETIC_NARRATIVE** - Stories of prophets illustrating the topic
4. **THEMATIC_REFERENCE** - Indirect thematic connection

## Usage Examples

### Basic Usage

```typescript
import { getTopicTranslations } from "@/lib/taxonomy/topic-translation-data";

// Get all ayat for a topic
const result = getTopicTranslations("tawheed-fundamentals");

if (result) {
  console.log(`Topic: ${result.topicTitle}`);
  console.log(`Total ayat: ${result.totalAyahs}`);
  console.log(`Mapping types:`, result.mappingTypeDistribution);
  
  // Access individual ayat
  for (const ayah of result.ayahs) {
    console.log(`${ayah.surahNumber}:${ayah.ayahNumber}`);
    console.log(`Arabic: ${ayah.arabicText}`);
    console.log(`Translation: ${ayah.englishTranslation}`);
    console.log(`Type: ${ayah.mappingType}`);
  }
}
```

### Getting Summary Statistics

```typescript
import { getTopicTranslationSummary } from "@/lib/taxonomy/topic-translation-data";

const summary = getTopicTranslationSummary("asma-ul-husna");

if (summary) {
  console.log(`Total ayat: ${summary.totalAyahs}`);
  console.log(`Unique surahs: ${summary.uniqueSurahs.length}`);
  console.log(`Has direct references: ${summary.hasDirectReferences}`);
  console.log(`Has explicit instructions: ${summary.hasExplicitInstructions}`);
}
```

### Using the UI Component

```tsx
import { TopicTranslationViewer } from "@/components/taxonomy/topic-translation-viewer";
import { 
  getTopicTranslations, 
  getTopicTranslationSummary 
} from "@/lib/taxonomy/topic-translation-data";

export default function TopicPage({ topicId }: { topicId: string }) {
  const result = getTopicTranslations(topicId);
  const summary = getTopicTranslationSummary(topicId);
  
  if (!result || !summary) {
    return <div>No translations available</div>;
  }
  
  return <TopicTranslationViewer result={result} summary={summary} />;
}
```

## Performance Considerations

### Caching Strategy

1. **Mapping Cache**: Mappings loaded once and cached on `globalThis`
2. **Index Cache**: Mappings indexed by topicId for O(1) lookup
3. **Quran Data Cache**: Underlying `data.ts` caches surah data
4. **HMR Resilience**: Cache survives hot module reloads during development

### Lazy Loading

- Mappings loaded on first access (not at module import)
- Surah data loaded per-surah on demand
- No upfront loading of all 6,236 ayat

### Memory Footprint

- 767 mapping records: ~150KB
- Cached surah data: ~2-3MB (only loaded surahs)
- Total per-topic: ~10-50KB depending on ayat count

## Validation

### Mapping Validation

The `validateMappings()` function checks:

1. All surah numbers are valid (1-114)
2. All ayah numbers are within valid range
3. All ayah ranges are logical (ayahEnd >= ayahStart)
4. All references resolve to actual ayat

**Expected Results:**
- 767 total mappings
- ~850 total ayat (some mappings cover ranges)
- 0 issues (all mappings valid)

### Data Integrity

- Arabic text never modified
- English translation (Saheeh International) preserved verbatim
- Transliteration preserved verbatim
- All attribution maintained

## Integration with Phase 6

Phase 6 will integrate this component into canonical topic detail pages:

```tsx
// In topic detail page
<TopicTranslationViewer 
  result={translationResult} 
  summary={translationSummary} 
/>
```

The component is designed to be:
- Self-contained (no external dependencies beyond Quran data)
- Reusable (works with any topicId)
- Accessible (ARIA labels, keyboard navigation)
- Responsive (mobile-friendly layout)

## Quality Assurance

### Quality Rules Followed

✅ Arabic text not modified  
✅ No fabricated translations  
✅ Attribution preserved (Saheeh International, Tanzil)  
✅ Missing translations handled gracefully  
✅ Existing Quran data loader reused  
✅ TypeScript types properly defined  
✅ Component accessible (ARIA, keyboard, RTL)  

### Validation Results

- TypeScript compiles without errors
- All 767 mappings resolve to actual ayat
- No broken surah/ayah references
- Component renders without errors
- Translation data matches Quran dataset exactly

## Files Created

1. **`src/lib/taxonomy/topic-translation-data.ts`** (318 lines)
   - Translation enrichment layer
   - Mapping loader and resolver
   - Caching implementation
   - Validation functions

2. **`src/components/taxonomy/topic-translation-viewer.tsx`** (267 lines)
   - UI component for displaying mapped ayat
   - Grouped by mapping type
   - Collapsible sections
   - Statistics header

3. **`docs/FAHM-MFD-07-TRANSLATION-INTEGRATION.md`** (this file)
   - Architecture documentation
   - Usage examples
   - API reference

## Next Steps

Phase 5 will add:
- Additional translation editions (Urdu, etc.)
- Multi-language support
- Translation comparison features

Phase 6 will:
- Integrate into canonical topic detail pages
- Add navigation between topics and ayat
- Implement search within topic ayat

## References

- [MFD-07 Taxonomy Expansion](./FAHM-MFD-07-TAXONOMY-EXPANSION.md)
- [MFD-07 Quranic Ayah Mapping](./FAHM-MFD-07-QURANIC-AYAH-MAPPING.md)
- [Data Provenance](./DATA-PROVENANCE.md)
- [Quran Dataset Sources](../src/lib/quran/sources.ts)
