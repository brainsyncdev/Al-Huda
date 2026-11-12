# MFD-07 Phase 5 — Tafsir Integration

> **Status:** Implemented · **Date:** 2026-11-12 · **Parent epic:** MFD-07 (Taxonomy Enrichment)

This document describes the tafsir enrichment layer that connects the 792
`topic-ayah-mappings.json` records (expanding to 1,889 individual ayat) to the
app's four tafsir sources. It covers the architecture, data flow, policy
constraints, and public API.

---

## 1. Overview

The tafsir integration layer is a **navigation aid**, not a content renderer.
It takes a topic ID, looks up every mapped ayah, and returns a set of tafsir
links — two in-app (classical Arabic, served via the translation proxy) and
two external (English, link-out only).

**What this module does:**

- Resolves topic → mapped ayat → tafsir links.
- Preserves full attribution, language, and licensing metadata from the source
  catalog (`src/lib/quran/sources.ts`).
- Distinguishes in-app vs. external tafsirs at the type level.

**What this module does NOT do:**

- Display or cache tafsir text.
- Generate or fabricate tafsir content.
- Replace the per-ayah `TafsirViewer` component.

---

## 2. Tafsir Sources

| Source ID | Work | Language | Delivery | Publisher |
|-----------|------|----------|----------|-----------|
| `tafsir-jalalayn` | Tafsir al-Jalalayn | Arabic | In-app via `/api/translations/ar.jalalayn` | Tanzil.net |
| `tafsir-muyassar` | Tafsir al-Muyassar | Arabic | In-app via `/api/translations/ar.muyassar` | Tanzil.net |
| `tafsir-ibn-kathir` | Tafsir Ibn Kathir (Abridged) | English | External → `https://www.qtafsir.com/` | Darussalam |
| `tafsir-ma(arif)` | Ma'ariful Quran | English | External → `https://www.maarifulquran.org/` | Mufti Muhammad Shafi Usmani |

**In-app delivery.** The two Arabic tafsirs are served through the existing
translation proxy (`src/app/api/translations/[id]/route.ts`) and rendered by
the per-ayah `TafsirViewer` component (`src/components/quran/tafsir-viewer.tsx`).
Text is fetched on-demand and cached for 24 hours by Next's data cache.

**External delivery.** The two English tafsirs are link-out only. The app does
not bundle, cache, or redistribute their text. Licensing and permitted display
remain with the publishers (FR-032).

---

## 3. Architecture

```
data/taxonomy/topic-ayah-mappings.json  (792 records → 1,889 expanded ayat)
            │
            ▼
src/lib/taxonomy/topic-translation-data.ts   ← loads & indexes mappings
            │
            ▼
src/lib/taxonomy/topic-tafsir-data.ts        ← enrichment layer (NEW)
            │
            ├── getTopicTafsirLinks(topicId)     → TopicTafsirResult
            ├── getTafsirLinkForAyah(s, a, id)   → TafsirLink
            ├── getTopicTafsirSummary(topicId)   → TafsirSummary
            └── getAllTafsirSources()            → source metadata list
            │
            ▼
src/components/taxonomy/topic-tafsir-viewer.tsx  ← UI (NEW)
            │
            ├── Statistics header (total ayat, in-app count, external count, languages)
            ├── Collapsible per-ayah list with tafsir link grid
            ├── "About tafsir" info section with full attribution
            └── Policy disclaimer
```

### 3.1 Data Flow

1. **Input:** A `topicId` string (e.g. `"tawheed-fundamentals"`).
2. **Mapping lookup:** `getMappingsByTopic()` returns all `TopicMapping` records
   for that topic from the cached index.
3. **Ayah expansion:** Each mapping's `ayahStart…ayahEnd` range is expanded
   into individual ayah references.
4. **Link generation:** For each ayah, four `TafsirLink` objects are built —
   two in-app URLs (`/ayah/[surah]/[ayah]?tafsir=[editionId]`) and two external
   URLs (publisher homepages).
5. **Output:** A `TopicTafsirResult` containing the topic title, the expanded
   ayah list with links, and a deduplicated `availableTafsirs` summary.

### 3.2 URL Patterns

| Tafsir | URL pattern | Example |
|--------|-------------|---------|
| al-Jalalayn (in-app) | `/ayah/{surah}/{ayah}?tafsir=ar.jalalayn` | `/ayah/2/255?tafsir=ar.jalalayn` |
| al-Muyassar (in-app) | `/ayah/{surah}/{ayah}?tafsir=ar.muyassar` | `/ayah/2/255?tafsir=ar.muyassar` |
| Ibn Kathir (external) | `https://www.qtafsir.com/` | (homepage; no ayah-level deep link) |
| Ma'ariful Quran (external) | `https://www.maarifulquran.org/` | (homepage; no ayah-level deep link) |

The in-app URLs point to the existing ayah page, which already hosts the
`TafsirViewer` component. The `?tafsir=` query parameter is reserved for future
auto-expansion of a specific edition.

---

## 4. Public API

### `getTopicTafsirLinks(topicId: string): TopicTafsirResult | null`

Returns all mapped ayat for a topic with tafsir links for each. Returns `null`
when the topic has no mappings.

```ts
const result = getTopicTafsirLinks("tawheed-fundamentals");
// result.topicTitle → "Tawheed Fundamentals"
// result.totalAyahs → number of expanded ayat
// result.ayahs → [{ surahNumber, ayahNumber, mappingId, tafsirLinks: [...] }]
// result.availableTafsirs → deduplicated list of 4 TafsirLink objects
```

### `getTafsirLinkForAyah(surahNumber, ayahNumber, tafsirId): TafsirLink | null`

Returns a single tafsir link for a specific ayah and tafsir source. Returns
`null` when the tafsir ID is unknown or the source record is missing from the
catalog.

```ts
const link = getTafsirLinkForAyah(2, 255, "tafsir-jalalayn");
// link.url → "/ayah/2/255?tafsir=ar.jalalayn"
// link.isExternal → false
// link.tafsirAttribution → "Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti (15th century CE)"
```

### `getTopicTafsirSummary(topicId: string): TafsirSummary | null`

Returns a compact summary for the statistics header.

```ts
const summary = getTopicTafsirSummary("patience");
// { topicId, totalAyahs, inAppTafsirs: 2, externalTafsirs: 2, languages: ["Arabic", "English"] }
```

### `getAllTafsirSources()`

Returns metadata for all four registered tafsir sources — useful for rendering
the "About tafsir" info panel.

---

## 5. UI Component

### `TopicTafsirViewer`

**Location:** `src/components/taxonomy/topic-tafsir-viewer.tsx`

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `topicId` | `string` | yes | The topic to render tafsir links for |
| `title` | `string` | no | Override for the heading (defaults to derived title) |
| `className` | `string` | no | Additional CSS classes |

**Features:**

- **Statistics header** — total ayat, in-app count, external count, languages.
- **Collapsible per-ayah list** — first 3 ayat expanded by default; expand/collapse all buttons.
- **Tafsir link grid** — for each ayah, shows in-app links (primary tone) and external links (muted tone with ↗ indicator).
- **About tafsir section** — collapsible panel explaining what tafsir is, the policy disclaimer, and full attribution for each source.
- **Accessibility** — ARIA labels on all interactive elements, `aria-expanded` on collapsibles, `role="list"` on the ayah list, keyboard-navigable buttons.

**Usage:**

```tsx
import { TopicTafsirViewer } from "@/components/taxonomy/topic-tafsir-viewer";

export function TopicPage({ topicId }: { topicId: string }) {
  return <TopicTafsirViewer topicId={topicId} />;
}
```

---

## 6. Policy Notes

### 6.1 Tafsir is interpretation, not translation

The app enforces a strict separation between translation and tafsir at every
level:

- **Translations** are renderings of the Quran's Arabic text into another
  language. They are bundled, cached, and displayed inline.
- **Tafsir** is scholarly interpretation by qualified exegetes. It is never
  generated or quoted by AI, and is always attributed to its author, period,
  and publisher.

The `TopicTafsirViewer` component never displays tafsir text. It only provides
links to the per-ayah `TafsirViewer` (in-app) or to the publisher's site
(external).

### 6.2 Attribution requirements (FR-030 / FR-031 / FR-032)

Every tafsir link carries:

- **Author/work** — e.g. "Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti (15th century CE)"
- **Language** — e.g. "Arabic" or "English"
- **Publisher** — e.g. "Tanzil.net (ar.jalalayn)"
- **License** — e.g. "Tanzil terms of use (attribution + no modification)"
- **Delivery mode** — "In-app" or "External"

All metadata is sourced from `src/lib/quran/sources.ts` and never hard-coded
in the enrichment layer or the UI component.

### 6.3 External links

All external links open in a new tab with `rel="noopener noreferrer"` to prevent
tab-nabbing and referrer leakage. The external URL points to the publisher's
homepage because ayah-level deep links are not guaranteed to be stable across
publisher site updates.

### 6.4 Disclaimer

The component displays a prominent disclaimer:

> **Disclaimer:** Tafsir is scholarly interpretation. Consult qualified scholars
> for detailed understanding. The links below point to classical and
> contemporary works whose licensing and permitted display remain with their
> publishers (FR-032).

---

## 7. Sample Usage

### Server-side (data layer)

```ts
import {
  getTopicTafsirLinks,
  getTopicTafsirSummary,
} from "@/lib/taxonomy/topic-tafsir-data";

export async function TopicTafsirPanel({ topicId }: { topicId: string }) {
  const result = getTopicTafsirLinks(topicId);
  const summary = getTopicTafsirSummary(topicId);

  if (!result || !summary) {
    return <p>No tafsir links available for this topic.</p>;
  }

  return (
    <div>
      <p>{summary.totalAyahs} ayat · {summary.inAppTafsirs} in-app · {summary.externalTafsirs} external</p>
      <ul>
        {result.ayahs.map((a) => (
          <li key={a.mappingId}>
            {a.surahNumber}:{a.ayahNumber} — {a.tafsirLinks.length} tafsir options
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Client-side (UI component)

```tsx
"use client";

import { TopicTafsirViewer } from "@/components/taxonomy/topic-tafsir-viewer";

export function TopicPage({ topicId, title }: { topicId: string; title: string }) {
  return (
    <main>
      <h1>{title}</h1>
      <TopicTafsirViewer topicId={topicId} title={title} />
    </main>
  );
}
```

---

## 8. Validation

After implementation, the following checks pass:

- [x] TypeScript compiles without errors.
- [x] All 792 mappings (1,889 expanded ayat) have tafsir link options (4 links each = 7,556 total links).
- [x] In-app tafsir links point to valid `/ayah/[surah]/[ayah]?tafsir=[id]` routes.
- [x] External tafsir links point to `https://www.qtafsir.com/` and `https://www.maarifulquran.org/`.
- [x] Component renders without errors for sample topics (e.g. `tawheed-fundamentals`, `patience`).
- [x] All attribution is correct and sourced from `src/lib/quran/sources.ts`.
- [x] External links have `target="_blank"` and `rel="noopener noreferrer"`.
- [x] Policy disclaimer is displayed.

---

## 9. Files Created

| File | Purpose |
|------|---------|
| `src/lib/taxonomy/topic-tafsir-data.ts` | Tafsir enrichment layer (data API) |
| `src/components/taxonomy/topic-tafsir-viewer.tsx` | UI component |
| `docs/FAHM-MFD-07-TAFSIR-INTEGRATION.md` | This document |

---

## 10. Related Documents

- [MFD-07 Phase 4 — Translation Integration](./FAHM-MFD-07-TRANSLATION-INTEGRATION.md)
- [Data Provenance](./DATA-PROVENANCE.md)
- [Source Catalog](../src/lib/quran/sources.ts)
- [Tafsir Search Module](../src/lib/quran/tafsir-search.ts)

---

**End of document.**
