# WS5: Affected Components Assessment

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 WS5 (Validated UTF-8/Mojibake Normalization) |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-review |
| Scope | PLANNING ONLY — no production data modified |

---

## 1. Executive Summary

Normalization of `data/taxonomy/topics.json` will affect **30+ UI components and API routes** that render `urduTitle` and/or `arabicTitle`. Since this is a pure data fix (correcting corrupted bytes to valid Unicode), **no code changes are required**. All components already expect valid Arabic/Urdu strings and will render correctly once the data is fixed.

The change is **backward-compatible at the API level** (same field names, same types) but **visually breaking** in the sense that users will see correct Arabic/Urdu instead of garbled Latin characters.

---

## 2. Data Source Architecture

### 2.1 Primary Data Files

| File | Encoding Status | Affected by Normalization |
|------|----------------|---------------------------|
| `data/taxonomy/topics.json` | Triple-encoded mojibake | ✅ YES (target) |
| `data/taxonomy/dimensions.json` | Clean UTF-8 | ❌ No |
| `data/taxonomy/domains.json` | Clean UTF-8 | ❌ No |

### 2.2 Hardcoded Data (Not Affected)

These files contain inline Arabic/Urdu that is already correctly encoded and will NOT be modified:

- `src/lib/topics/data.ts` — 20+ hardcoded topics with correct Arabic titles
- `src/lib/taxonomy/domains.ts` — Domain labels with correct Arabic
- `src/lib/explore/dimensions.ts` — Dimension metadata with correct Arabic
- `src/lib/paths/data.ts` — Learning path Arabic titles

### 2.3 Data Loading Pipeline

```
data/taxonomy/topics.json
    ↓ (import/require)
src/lib/topics/data.ts (or direct import)
    ↓
Various page components and API routes
    ↓
Browser rendering with lang="ar" dir="rtl"
```

---

## 3. Affected UI Components

### 3.1 Page Components Rendering arabicTitle

| Component Path | Field Used | Display Context |
|---------------|------------|------------------|
| `src/app/home-client.tsx` | `dim.arabicTitle`, `topic.arabicTitle` | Homepage dimension/topic cards |
| `src/app/explore/page.tsx` | `path.arabicTitle`, `dim.arabicTitle`, `topic.arabicTitle` | Explore landing page |
| `src/app/explore/domains/page.tsx` | `domain.arabicTitle`, `domain.urduTitle` | Domain listing |
| `src/app/explore/domains/[id]/page.tsx` | `domain.arabicTitle`, `domain.urduTitle`, `dimension.arabicTitle`, `topic.arabicTitle` | Domain detail |
| `src/app/explore/dimension/[id]/page.tsx` | `dim.arabicTitle`, `topic.arabicTitle` | Dimension detail |
| `src/app/explore/dimensions/[id]/page.tsx` | `dimension.arabicTitle`, `dimension.urduTitle`, `parentDomain.arabicTitle`, `topic.arabicTitle`, `topic.urduTitle`, `relDim.arabicTitle` | Canonical dimension detail |
| `src/app/explore/topics/page.tsx` | `topic.arabicTitle` | Topics listing |
| `src/app/explore/topics/[id]/page.tsx` | `canonicalTopic.arabicTitle`, `legacyTopic.arabicTitle`, `topic.arabicTitle`, `topic.urduTitle`, `relatedTopic.arabicTitle`, `dim.arabicTitle`, `domain.arabicTitle`, `ct.arabicTitle` | Topic detail page |
| `src/app/explore/sub-dimensions/[id]/page.tsx` | `topic.urduTitle`, `topic.arabicTitle` | Sub-dimension detail |
| `src/app/explore/root/[root]/page.tsx` | `manualEntry.arabicTitle`, `entry.arabicTitle`, `topic.arabicTitle` | Root word detail |
| `src/app/topics/page.tsx` | `topic.arabicTitle` | Legacy topics listing |
| `src/app/topics/[slug]/page.tsx` | `topic.arabicTitle`, `t.arabicTitle`, `dim.arabicTitle`, `domain.arabicTitle`, `entry.arabicTitle`, `path.arabicTitle`, `journey.arabicTitle` | Legacy topic detail |
| `src/app/discover/discover-client.tsx` | `path.arabicTitle`, `topic.arabicTitle`, `dim.arabicTitle` | Discovery interface |
| `src/app/search/page.tsx` | `topic.arabicTitle` | Search results |
| `src/app/ayah/[surah]/[ayah]/page.tsx` | `t.arabicTitle`, `topic.arabicTitle`, `path.arabicTitle` | Ayah detail page |
| `src/app/study-journeys/page.tsx` | `journey.arabicTitle` | Study journeys listing |
| `src/app/study-journeys/[slug]/page.tsx` | `journey.arabicTitle` | Study journey detail |
| `src/app/learn/paths/[slug]/page.tsx` | `path.arabicTitle` | Learning path detail |
| `src/app/learn/journeys/page.tsx` | `journey.arabicTitle` | Learn journeys listing |
| `src/app/learn/journeys/[slug]/page.tsx` | `journey.arabicTitle` | Learn journey detail |

### 3.2 Editorial/Admin Components

| Component Path | Field Used | Display Context |
|---------------|------------|------------------|
| `src/app/editorial/review/review-client.tsx` | `wbRoot.arabicTitle`, `selectedRoot.arabicTitle` | Scholarly review interface |
| `src/app/editorial/quality/page.tsx` | `topic.urduTitle` | Quality dashboard |

### 3.3 Shared Components

| Component Path | Field Used | Display Context |
|---------------|------------|------------------|
| `src/components/quran/ayah-card.tsx` | `topic.arabicTitle` | Ayah card in various contexts |
| `src/components/quiz/quiz-workspace.tsx` | `path.arabicTitle`, `t.arabicTitle` | Quiz interface |
| `src/components/paths/path-workspace.tsx` | `path.arabicTitle`, `topic.arabicTitle` | Path workspace |

---

## 4. Affected API Routes

| Route | Field Exposed | Consumers |
|-------|--------------|-----------|
| `src/app/api/v1/topics/route.ts` | `arabicTitle` | External API consumers |
| `src/app/api/v1/topics/[slug]/route.ts` | `arabicTitle` | External API consumers |
| `src/app/api/v1/explore/dimensions/route.ts` | `arabicTitle` | Explore API |
| `src/app/api/v1/explore/dimensions/[id]/route.ts` | `topic.arabicTitle`, `dim.arabicTitle` | Dimension API |

---

## 5. Library/Utility Code

### 5.1 Search & Discovery

| Module | Impact |
|--------|--------|
| `src/lib/explore/discovery.ts` | Searches `arabicTitle` and `urduTitle` — will now match correct Arabic queries |
| `src/lib/search/autocomplete.ts` | Uses `arabicTitle` for sublabels — will display correct text |

### 5.2 SEO & Metadata

| Module | Impact |
|--------|--------|
| `src/lib/seo/json-ld.ts` | Uses `arabicTitle` as `alternateName` in structured data — will emit correct Unicode |
| Page `<title>` tags | Multiple pages include `arabicTitle` in browser tab title |

### 5.3 Knowledge Graph

| Module | Impact |
|--------|--------|
| `src/lib/graph/knowledge-graph.ts` | Uses `arabicLabel` from `dim.arabicTitle` and `topic.arabicTitle` |
| `src/lib/graph/canonical-knowledge-graph.ts` | Uses `arabicLabel` and `urduLabel` from domains and dimensions |

### 5.4 Morphology & Review

| Module | Impact |
|--------|--------|
| `src/lib/morphology/batch-eligibility.ts` | References `arabicTitle` |
| `src/lib/morphology/human-review/types.ts` | Type definition includes `arabicTitle` |
| `src/lib/morphology/sprint-48-root-data.ts` | Root data includes `arabicTitle` |

### 5.5 Taxonomy Compatibility

| Module | Impact |
|--------|--------|
| `src/lib/taxonomy/compatibility.ts` | Maps `arabicTitle` to label pairs |
| `src/lib/taxonomy/canonical-adapter.ts` | Adapts between legacy/canonical formats with `arabicTitle`/`urduTitle` |

### 5.6 Quality & Validation

| Module | Impact |
|--------|--------|
| `src/lib/quality/validation.ts` | Validates `arabicTitle` presence and `urduTitle` optionality |
| `src/lib/topics/quality-audit.test.ts` | Tests assert `arabicTitle` truthiness |
| `src/lib/translations/urdu-types.ts` | Type validation for `arabicTitle` |
| `src/lib/translations/urdu-storage.ts` | Storage serialization of `arabicTitle` |

---

## 6. Visual Impact Assessment

### 6.1 Before Normalization

Users currently see garbled text like:
```
Ã˜ÂªÃ™Ë†Ã˜Â­Ã›Å'Ã˜Â¯ ÃšÂ©Ã›â€™ Ã˜Â¨Ã™â€ Ã›Å'Ã˜Â§Ã˜Â¯Ã›Å' Ã˜Â§Ã˜ÂµÃ™Ë†Ã™â€ž
```

### 6.2 After Normalization

Users will see correct Urdu/Arabic:
```
توحید کے بنیادی اصول
```

### 6.3 Font & Rendering Requirements

All affected components already use:
- `lang="ar"` or appropriate language attribute
- `dir="rtl"` for right-to-left layout
- CSS class `arabic-display` for font styling

No CSS or component changes needed — the rendering infrastructure is already correct.

---

## 7. Downstream Systems

| System | Impact | Action Required |
|--------|--------|-----------------|
| Search index | Will index correct Arabic/Urdu terms | Re-index after normalization |
| Browser cache | May show stale garbled text | Users need hard refresh |
| CDN/cache layers | May serve stale JSON | Purge cache after deployment |
| External API consumers | Will receive correct Unicode | Notify API consumers of data fix |
| Git history | Diff will show large text changes | Commit message must reference WS5/Q39 |

---

## 8. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Over-correction (triple-decode of double-encoded) | Medium | High | Adaptive algorithm stops at first valid Arabic detection |
| Under-correction (some entries still garbled) | Low | Medium | Automated mojibake signature scan catches residuals |
| Breaking search functionality | Very Low | Medium | Search already expects Arabic strings; correct data improves matching |
| API consumer breakage | Very Low | Low | Same field names/types; only content changes from garbled to correct |
| Font rendering issues | Very Low | Low | Fonts already configured for Arabic/Urdu |

---

## 9. Testing Recommendations

Post-normalization testing should cover:

1. **Visual smoke test**: Navigate to homepage, explore pages, topic detail pages — verify Arabic/Urdu renders correctly
2. **Search test**: Search for known Arabic terms (e.g., "توحید", "الصلاة") — verify results appear
3. **API test**: Call `/api/v1/topics` and verify response contains valid Unicode
4. **SEO test**: Inspect page source for correct `alternateName` in JSON-LD
5. **Mobile test**: Verify RTL rendering on mobile viewports

---

*proposedBy: ai-assisted | reviewStatus: pending-review*  
*No production files modified. No normalization scripts executed.*
