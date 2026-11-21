# WS1: Tanzil Proxy Remediation Plan

**MFD-12.2 Workstream 1 — Tanzil Rights-Compliance Remediation**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-review  
**Prerequisite:** WS1-TANZIL-COMPLIANCE-AUDIT.md  
**Classification:** RESEARCH AND PLANNING ONLY — no production code modified

---

## 1. Remediation Objective

Enforce `linkOutOnly` behavior for all Tanzil-sourced content with `rights-unverified` status at every layer where Tanzil text is fetched, cached, or displayed. Preserve existing UI functionality through graceful degradation. Provide clear user-facing messaging about why content is link-out-only. Enable per-edition rights clearance to restore in-app display on a case-by-case basis.

---

## 2. Implementation Phases

### Phase 1: API Layer Enforcement (Priority: IMMEDIATE)

**Goal:** Block all Tanzil text delivery at the proxy and search layers for rights-unverified editions.

#### Step 1.1: Add Rights Gate to Proxy Route

**File:** `src/app/api/translations/[id]/route.ts`

**Change:** Before fetching from Tanzil, check the source record's rights status. If `rights-unverified` (or equivalent), return a structured gating response instead of proxying text.

**Proposed Logic:**
```typescript
// Pseudocode — not production implementation
const source = getSourceByTranslationId(id);
if (source && isRightsUnverified(source)) {
  return NextResponse.json({
    gated: true,
    reason: "rights-under-review",
    externalUrl: source.homepage,
    message: "This translation is available externally. Rights are under review.",
    sourceId: source.id,
    attribution: source.attribution,
  }, { status: 403 });
}
```

**Mapping function needed:** A new `getSourceByTranslationId(translationId)` function that maps translation IDs (e.g., `en.sahih`, `ur.jalandhry`, `ar.jalalayn`) to their corresponding `SourceRecord`. Currently no such mapping exists — the translation catalog and source catalog are separate arrays with no foreign key relationship.

**Affected editions:** All 116 translations + 2 tafsirs except those mapped to `tanzil-mushaf-metadata` (which is genuinely vendored and CC-BY).

#### Step 1.2: Add Rights Gate to Server-Side Search

**File:** `src/lib/quran/translation-search.ts`

**Change:** In `loadEdition()`, check rights status before fetching. Return null (existing error path) for gated editions.

**Impact:** `/api/v1/search?edition={id}` will return empty results for gated editions. The existing `loadError: true` response shape can be extended with a `gated: true` flag.

#### Step 1.3: Add Rights Gate to Tafsir Search

**File:** `src/lib/quran/tafsir-search.ts`

**Change:** Filter `TAFSIR_EDITION_IDS` to exclude gated editions before searching.

**Impact:** `/api/v1/search/tafsir` will return results only from cleared tafsir editions.

#### Step 1.4: Update Public API Metadata Endpoints

**Files:**
- `src/app/api/v1/translations/route.ts`
- `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts`

**Change:** Add `rightsStatus` and `displayMode` fields to edition metadata responses. For gated editions, set `displayMode: "link-out-only"` and omit or mark `textEndpoint` as unavailable.

---

### Phase 2: Client-Side Graceful Degradation (Priority: HIGH)

**Goal:** Handle gated API responses gracefully in the UI without broken states.

#### Step 2.1: Update Translation Store

**File:** `src/lib/quran/translation-store.ts`

**Changes:**
- Parse gated responses from `/api/translations/[id]`
- Store gating metadata alongside cached translations
- Export `isGated(id: string): boolean` and `getGatingInfo(id: string)` functions
- Modify `useTranslationText()` to return null for gated editions (existing fallback behavior already handles null)

#### Step 2.2: Update AyahCard Component

**File:** `src/components/quran/ayah-card.tsx`

**Changes:**
- When `useTranslationText()` returns null for a gated edition, render a link-out card instead of empty space
- Display: "[Translation Name] is available externally. Rights are under review. [Read at Tanzil.net ↗]"
- Preserve the translation selector dropdown but add a visual indicator (e.g., 🔒 icon) for gated editions

#### Step 2.3: Update TafsirViewer Component

**File:** `src/components/quran/tafsir-viewer.tsx`

**Changes:**
- When tafsir text is gated, render a link-out panel instead of the tabbed text viewer
- Display attribution, language, period, and external link
- Maintain FR-030/FR-032 compliance (language display, distinction from translation)

#### Step 2.4: Update Translation Selector

**File:** `src/components/quran/translation-selector.tsx`

**Changes:**
- Add visual indicator for gated editions in the selection list
- Optionally group gated editions separately with explanatory header
- Ensure selecting a gated edition triggers the link-out UI rather than a loading spinner

#### Step 2.5: Update Settings Page

**File:** `src/app/settings/page.tsx`

**Changes:**
- If user's saved `translationId` becomes gated, show informational banner
- Offer to switch to a cleared edition or keep the gated selection (link-out mode)
- Do not silently change the user's preference

---

### Phase 3: Source Catalog Corrections (Priority: HIGH)

**Goal:** Fix inaccurate metadata that misrepresents delivery method.

#### Step 3.1: Correct Method Fields

**File:** `src/lib/quran/sources.ts`

**Changes:**
- Change `tanzil-sahih` from `method: "package"` to `method: "link"` (it is runtime-proxied, not bundled)
- Change `tanzil-translit` from `method: "package"` to `method: "link"` (same reason)
- Keep `tanzil-mushaf-metadata` as `method: "package"` (genuinely vendored via build script)
- Add `notes` explaining the correction

#### Step 3.2: Add Rights Status Field

**File:** `src/lib/quran/sources.ts`

**Change:** Add an explicit `rightsStatus` field to each Tanzil source record. Until legal review completes, all proxied Tanzil sources receive `rightsStatus: "rights-unverified"`.

**Note:** This aligns the codebase with the MFD-12 Source Registry schema even though the full MFD-12 migration is not yet complete.

#### Step 3.3: Create Translation-to-Source Mapping

**New file or addition to existing:** Create a mapping function `getSourceByTranslationId(id: string): SourceRecord | undefined` that links translation IDs to their governing source record. This is required for the API-layer rights gate (Phase 1).

**Proposed mapping logic:**
- `ar.jalalayn` → `tafsir-jalalayn`
- `ar.muyassar` → `tafsir-muyassar`
- `en.sahih` → `tanzil-sahih`
- `en.transliteration` → `tanzil-translit`
- All other IDs → `tanzil-translations`

---

### Phase 4: User Communication (Priority: HIGH)

**Goal:** Clearly communicate why content is link-out-only without implying technical failure.

#### Step 4.1: Standardized Gating Message

Define a consistent message template used across all UI surfaces:

> **[Translation/Tafsir Name]** is available externally.  
> Rights for this edition are under review.  
> [Read at Tanzil.net ↗](external-url)

**Never say:** "Content unavailable", "Error loading", "Failed to fetch", or any phrasing that implies technical failure.

#### Step 4.2: Sources Page Update

**File:** `src/app/editorial/page.tsx` (renders `/sources`)

**Change:** For gated sources, add a visible badge: "🔒 Rights under review — link-out only" with a tooltip explaining the compliance rationale.

#### Step 4.3: Reader Contextual Help

Add a dismissible info banner in the reader when the active translation is gated, linking to `/sources` for full explanation.

---

### Phase 5: Rights Clearance Infrastructure (Priority: MEDIUM)

**Goal:** Enable per-edition rights clearance to restore in-app display.

#### Step 5.1: Define Clearance Transition Schema

Per WS-E-TANZIL-RIGHTS-POLICY.md §5:
- Every transition from `link-out-enforced` → `full-display-cleared` requires a `ReviewDecision` with `reviewScope: RIGHTS`
- Create a review queue entry template for Tanzil editions
- Document what evidence legal counsel needs (see WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md)

#### Step 5.2: Per-Edition Granularity

When an edition is cleared:
1. Update its source record's `rightsStatus` to the verified status (e.g., `cc-by-4.0`, `proprietary-permitted`)
2. Set `displayConstraints.linkOutOnly: false` (or equivalent)
3. The API-layer gate automatically allows text delivery
4. No code changes needed — the gate checks rights status dynamically

#### Step 5.3: Priority Queue

Recommended clearance priority based on user demand:
1. `ur.jalandhry` (default translation)
2. `en.sahih` (fallback/built-in reference)
3. `ar.jalalayn` + `ar.muyassar` (in-app tafsirs)
4. Other Urdu editions
5. Other major languages (Turkish, Indonesian, French, German)
6. Remaining editions

---

## 3. Rollback Strategy

### 3.1 Feature Flag

Implement all Phase 1-2 changes behind a feature flag (environment variable or config):

```
TANZIL_RIGHTS_ENFORCEMENT=true|false
```

- Default: `true` in staging/production after deployment
- Set to `false` to immediately restore previous behavior if critical issues arise
- Log a warning when enforcement is disabled

### 3.2 Rollback Procedure

1. Set `TANZIL_RIGHTS_ENFORCEMENT=false`
2. Redeploy (or hot-reload if supported)
3. Verify proxy route serves text again
4. File incident report documenting why rollback was necessary
5. Schedule follow-up to address the issue and re-enable enforcement

### 3.3 Data Preservation

- No data is deleted or modified during enforcement
- User preferences (`translationId`) are preserved even when gated
- Cache entries remain valid; only delivery is blocked
- Rollback restores full functionality without data loss

---

## 4. Testing Strategy

### 4.1 Unit Tests

- Test rights gate logic with mock source records
- Test translation-to-source mapping for all 116 + 2 editions
- Test gated response parsing in translation store
- Test fallback rendering in AyahCard and TafsirViewer

### 4.2 Integration Tests

- Verify `/api/translations/{id}` returns 403 + structured response for gated editions
- Verify `/api/v1/search?edition={id}` returns empty results for gated editions
- Verify `/api/v1/translations` includes `rightsStatus` and `displayMode` fields
- Verify feature flag toggles enforcement on/off

### 4.3 Manual QA

- Navigate to reader with gated translation selected → verify link-out UI
- Switch between gated and cleared translations → verify smooth transition
- Open tafsir panel with gated tafsir → verify link-out panel
- Check /sources page → verify gating badges display correctly
- Test with `TANZIL_RIGHTS_ENFORCEMENT=false` → verify full restoration

---

## 5. Timeline Estimate

| Phase | Effort | Dependencies |
|-------|--------|-------------|
| Phase 1: API Enforcement | 2-3 days | Phase 3.3 (mapping function) |
| Phase 2: Client Degradation | 3-4 days | Phase 1 |
| Phase 3: Catalog Corrections | 1 day | None |
| Phase 4: User Communication | 1-2 days | Phase 2 |
| Phase 5: Clearance Infra | 2-3 days | Phase 1-4 |
| Testing | 2-3 days | All phases |
| **Total** | **11-16 days** | |

**Recommended deployment order:** Phase 3 → Phase 1 → Phase 2 → Phase 4 → Phase 5

---

## 6. Success Criteria

1. ✅ No Tanzil text is served through any API route for rights-unverified editions
2. ✅ All UI surfaces display graceful link-out UI instead of broken states
3. ✅ User-facing messaging clearly explains rights-compliance rationale
4. ✅ Feature flag enables instant rollback
5. ✅ Per-edition clearance path is documented and operational
6. ✅ Source catalog accurately reflects delivery method and rights status
7. ✅ All existing tests pass; new tests cover gating behavior
8. ✅ No user preferences are lost or silently changed
