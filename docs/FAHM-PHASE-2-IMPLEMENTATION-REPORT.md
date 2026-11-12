# FAHM Phase 2 — Route Consolidation Implementation Report

**Status:** ⚠️ PARTIALLY COMPLETE — BLOCKER IDENTIFIED  
**Date:** November 11, 2026  
**Baseline:** Sprint 54 (commit `e875bbd`) + Phase 1 changes

---

## Executive Summary

Phase 2 Route Consolidation has been **partially implemented** due to a critical blocker identified during the `/explore/topics` → `/topics` migration analysis.

**Completed:**
- ✅ `/library` → `/my-study` redirect (HTTP 308)
- ✅ `/library/notes` → `/my-study/notes` redirect (HTTP 308)
- ✅ Internal links updated to point to `/my-study`
- ✅ robots.ts updated
- ✅ sitemap.ts comment updated

**Blocked:**
- ⚠️ `/explore/topics` → `/topics` migration — **STOPPED due to functionality loss risk**

---

## Blocker: `/explore/topics` → `/topics` Migration

### Issue Identified

After inspecting both route implementations, significant feature differences were discovered that would result in functionality loss if redirected:

#### `/explore/topics/[slug]` (388 lines) — Enhanced Features:
- Study journeys integration via `getJourneysForTopic()`
- Enhanced navigation helpers: `getDimensionUrl()`, `getDomainUrl()`, `getJourneyUrl()`, `getTopicUrl()`
- `getAllDimensionsForTopic()` and `getAllDomainsForTopic()` (comprehensive getters)
- `RELATION_TYPE_LABELS` display
- Sprint 53 Workstream C enhancements

#### `/topics/[slug]` (452 lines) — Different Features:
- Different dimension/domain getters: `getDimensionsForTopic()` vs `getAllDimensionsForTopic()`
- Root links via `getTopicRootLinks()` (not in explore version)
- PATHS data integration
- **No study journeys integration**

#### Index Pages:
- `/explore/topics` (187 lines): per-topic dimension badges, domain badges, sorted by relation count
- `/topics` (71 lines): simpler list with TopicGraph, no per-topic badges

### Functionality Loss if Redirected

Users would lose:
1. **Study journeys integration** on topic detail pages
2. **Per-topic dimension/domain visual indicators** on the index
3. **Enhanced navigation context** for related content

### Decision

Per your instruction: *"If a destination route is missing or a migration risks losing functionality, stop and report the blocker rather than inventing a replacement."*

**Action taken:** Stopped `/explore/topics` migration and reported blocker.

---

## Completed Implementation: `/library` → `/my-study`

### Files Changed

#### 1. Next.js Configuration
**File:** `next.config.ts`

**Changes:**
- Added `redirects()` function with two permanent redirects (HTTP 308):
  - `/library` → `/my-study`
  - `/library/notes` → `/my-study/notes`

**Code:**
```typescript
async redirects() {
  return [
    {
      source: '/library',
      destination: '/my-study',
      permanent: true, // HTTP 308
    },
    {
      source: '/library/notes',
      destination: '/my-study/notes',
      permanent: true, // HTTP 308
    },
  ];
},
```

#### 2. Internal Link Updates

**File:** `src/app/my-study/page.tsx`
- Line 180: Changed `href="/library"` → `href="/my-study"`

**File:** `src/components/revision/workspace.tsx`
- Line 73: Changed `href="/library"` → `href="/my-study"`
- Line 76: Changed link text "library" → "My Study"

**File:** `src/app/library/page.tsx`
- Line 133: Changed `href="/library/notes"` → `href="/my-study/notes"`

**File:** `src/app/library/notes/page.tsx`
- Line 39: Changed `href="/library"` → `href="/my-study"`
- Line 43: Changed link text "Back to library" → "Back to My Study"

#### 3. SEO Configuration Updates

**File:** `src/app/robots.ts`
- Line 10: Changed disallow list from `["/library", ...]` → `["/my-study", ...]`

**File:** `src/app/sitemap.ts`
- Line 19: Updated comment to reflect `/my-study` instead of `/library`

### Redirect Behavior

- **HTTP Status:** 308 (Permanent, method- and body-preserving)
- **Query Parameters:** Automatically forwarded by Next.js
- **Dynamic Parameters:** N/A (no dynamic segments in these routes)
- **Redirect Chains:** None (direct redirects to final destinations)

### Verification

- ✅ TypeScript compilation: No errors (`npx tsc --noEmit` clean)
- ✅ Git status: Only expected files modified
- ✅ No redirect loops (destination routes exist and are functional)
- ✅ `/my-study` and `/my-study/notes` routes verified to exist

---

## Not Modified (Per Scope Restrictions)

### Routes NOT Migrated

- ❌ `/study-journeys` — Phase 3 work
- ❌ `/discover` — Phase 4 work
- ❌ `/explore/topics` — **BLOCKED** (see above)
- ❌ `/explore/topics/[slug]` — **BLOCKED** (see above)

### Files NOT Modified

- ❌ Navigation UI components (Phase 1 work preserved)
- ❌ Business logic, APIs, data models
- ❌ localStorage keys or backup formats
- ❌ Bookmarks, notes, collections, reading history, journey progress
- ❌ Five pre-existing data JSON files
- ❌ Unrelated documentation files

### Git Operations NOT Performed

- ❌ No `git add`
- ❌ No `git commit`
- ❌ No `git push`
- ❌ No deployment

---

## Testing Recommendations

### Manual Testing Checklist

1. **Library Redirects**
   - [ ] Navigate to `/library` — should redirect to `/my-study` with HTTP 308
   - [ ] Navigate to `/library/notes` — should redirect to `/my-study/notes` with HTTP 308
   - [ ] Verify query parameters are preserved (e.g., `/library?foo=bar` → `/my-study?foo=bar`)
   - [ ] Verify POST requests preserve method (HTTP 308 characteristic)

2. **Internal Links**
   - [ ] My Study page "View all" link points to `/my-study`
   - [ ] Revision workspace "My Study" link points to `/my-study`
   - [ ] Library page "View all notes" link points to `/my-study/notes`
   - [ ] Library notes page "Back to My Study" link points to `/my-study`

3. **SEO Configuration**
   - [ ] robots.txt disallows `/my-study` (not `/library`)
   - [ ] Sitemap comment reflects `/my-study`

4. **Existing Functionality**
   - [ ] `/my-study` page loads correctly
   - [ ] `/my-study/notes` page loads correctly
   - [ ] Bookmarks, notes, collections all accessible
   - [ ] Backup/restore functionality works
   - [ ] No broken links or 404 errors

---

## Remaining Work

### Blocked: `/explore/topics` Migration

**Requires decision on:**
1. Should `/explore/topics` unique features be merged into `/topics` before redirecting?
2. Should `/topics` be enhanced with study journeys integration?
3. Should the redirect be deferred until feature parity is achieved?
4. Should `/explore/topics` remain as a separate route indefinitely?

**Recommendation:** 
- Option A: Enhance `/topics` with missing features, then redirect (requires additional development)
- Option B: Keep both routes, update internal links to prefer `/topics` as canonical
- Option C: Defer this migration to a future phase with explicit feature requirements

### Phase 3 (Not Started)

- `/study-journeys` → `/learn/journeys` migration
- Requires separate authorization

### Phase 4 (Not Started)

- `/discover` → `/explore` migration (audience-paths section only)
- Requires separate authorization

---

## Git Status Summary

### Modified Files (Phase 2)

```
M next.config.ts
M src/app/library/notes/page.tsx
M src/app/library/page.tsx
M src/app/my-study/page.tsx
M src/app/robots.ts
M src/app/sitemap.ts
M src/components/revision/workspace.tsx
```

**Total:** 7 source files modified

### Pre-existing Modifications (Preserved)

**Phase 1 files (7 files):**
```
M src/app/explore/page.tsx
M src/components/layout/mobile-bottom-nav.tsx
M src/components/layout/site-header.tsx
M src/lib/i18n/dictionaries/ar.ts
M src/lib/i18n/dictionaries/en.ts
M src/lib/i18n/dictionaries/ur.ts
M src/lib/i18n/dictionaries/zh.ts
```

**Data files (5 JSON files with Sprint 49 timestamp updates):**
```
M data/blocked-root-analysis.json
M data/full-morphology-activation-audit.json
M data/global-root-ayah-coverage-report.json
M data/root-index-integrity-report.json
M data/sprint-49-root-reconciliation-report.json
```

**All pre-existing modifications preserved. No files overwritten or discarded.**

---

## Conclusion

Phase 2 Route Consolidation has been **partially completed**:

**✅ Successfully implemented:**
- `/library` → `/my-study` redirect (HTTP 308)
- `/library/notes` → `/my-study/notes` redirect (HTTP 308)
- All internal links updated
- SEO configuration updated
- Zero functionality broken
- All pre-existing modifications preserved

**⚠️ Blocked:**
- `/explore/topics` → `/topics` migration due to functionality loss risk
- Requires product-owner decision on feature parity approach

**Status:** ⚠️ **PARTIALLY COMPLETE — AWAITING DECISION ON TOPICS MIGRATION**

---

## Next Steps

### For Product Owner

1. **Review** the blocker analysis for `/explore/topics` migration
2. **Decide** on approach:
   - Option A: Enhance `/topics` first, then redirect
   - Option B: Keep both routes, prefer `/topics` as canonical
   - Option C: Defer to future phase
3. **Test** the completed `/library` redirects
4. **Provide guidance** on how to proceed with topics migration

### For Implementation (When Decided)

Once the topics migration approach is decided:
- If Option A: Implement feature enhancements to `/topics`, then add redirects
- If Option B: Update internal links to `/topics`, keep `/explore/topics` as-is
- If Option C: Document the deferral and move to Phase 3

**No further Phase 2 work will proceed without explicit authorization.**

---

**Document Version:** 1.0  
**Last Updated:** November 11, 2026  
**Implementation Status:** PARTIALLY COMPLETE — BLOCKER IDENTIFIED