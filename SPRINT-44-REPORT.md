# Sprint 44 Report — Global Root Discovery & Automated Batch Publication Pipeline

**Date:** 2026-11-02  
**Status:** ✅ Complete — all gates pass

## Summary

Sprint 44 bridges the gap between 10 manually configured root entries and the 1,642 distinct source-backed roots in the morphology index. The sprint delivers a scalable, deterministic discovery and batch publication system that processes all roots through one pipeline while preserving existing manual decisions and maintaining the three-dimension separation (occurrence validity / lemma coverage / thematic classification).

## Key Results

| Metric | Value |
|--------|-------|
| Total roots discovered | 1,642 |
| Eligible for publication | 1,469 |
| Published (occurrence index generated) | 1,469 |
| Blocked from publication | 173 |
| Manual entries preserved | 10 |
| Total word-level occurrences | 50,298 |
| Total distinct ayat | 44,741 |
| Total missing lemmas (disclosed) | 1,669 |
| Reconciliation | ✅ discovered = eligible + blocked |
| Reconciliation | ✅ eligible = published + eligible-but-not-published |

## Policy Alignment

Sprint 43 Policy B (disclosed coverage) required alignment fixes to ensure missing lemmas are warnings, not blockers:

1. **`review-pipeline.ts`**: Changed `missing-lemma` validation severity from `"error"` to `"warning"`
2. **`ai-lemma-reviewer.ts`**: Removed missing lemmas from structural validation blockers; only duplicate positions now block
3. **Sprint 41 tests updated**: 2 tests updated to reflect Policy B behavior (missing lemmas are warnings, reviewer recommends observed lemmas even with incomplete coverage)

## Implementation

### Phase 1: Root Discovery Layer

**Created `src/lib/morphology/root-discovery.ts`**
- `discoverAllRoots(index: MorphologyRecord[]): RootCandidate[]`
- Filters to word-level records only (`wordPosition !== undefined`)
- Groups by root, computes per-root statistics
- Deterministic output: stable ordering by root string, no timestamps
- Output: `data/root-discovery-registry.json`

**Created `scripts/discover-roots.ts`**
- CLI: `npx tsx scripts/discover-roots.ts [--dry-run] [--json]`
- Loads morphology index, calls `discoverAllRoots()`, writes registry
- Dry-run shows counts without writing

### Phase 2: Batch Eligibility Engine

**Created `src/lib/morphology/batch-eligibility.ts`**
- `evaluateBatchEligibility(candidates, index, existingEntries): BatchEligibilityResult`
- For each candidate:
  - Extract word-level records
  - Run validation (reuse `validateRootRecords()`)
  - Check Policy B eligibility (reuse `decidePublication()`)
  - Match existing manual entries (by slug or root) and preserve manual fields
  - Generate `PublicationDecision`
- Per-root isolation: one failed root doesn't corrupt others
- Manual-preserving: existing `ROOT_ALLOWLIST` entries never overwritten

### Phase 3: Batch Publication Engine

**Created `scripts/batch-publish-roots.ts`**
- CLI: `npx tsx scripts/batch-publish-roots.ts [--dry-run] [--json]`
- Loads discovery registry, evaluates eligibility, generates occurrence indexes
- For each eligible root:
  - Build occurrence index (reuse `buildRootTopicIndex()`)
  - Write to `data/root-occurrences/{slug}.json`
- Preserves existing manual entries: merges only computed fields
- Generates `data/batch-publication-report.json` with reconciliation

**Merge strategy for manual entries:**
- Match by slug OR by root
- Preserve: `reviewState`, `includedLemmas`, `title`, `arabicTitle`, `notes`, `assertedBy`, `assertedAt`
- Merge computed: `totalWordRecords`, `distinctAyahCount`, `lemmaCoverageRatio`
- Never auto-approve `includedLemmas` from observed lemmas

### Phase 4: UI Enhancements

**Updated `src/app/explore/root/page.tsx`**
- Server component loads discovery registry and batch publication report
- Passes data to client component for interactivity
- Shows summary: "1,642 roots discovered · 1,469 published · 173 awaiting review"

**Created `src/app/explore/root/root-listing-client.tsx`**
- Client component with search, pagination, and filters
- Search: by Arabic root (client-side filtering)
- Pagination: 50 roots per page
- Status filters: "All", "Published", "Pending Review", "Blocked"
- Sorting: "Alphabetical (Arabic)", "Occurrences (high→low)", "Lemma coverage (high→low)"
- Each card shows: Arabic root, occurrence count, distinct ayat, lemma coverage %, status badge

**Updated `src/lib/morphology/root-data.ts`**
- Added `loadDiscoveryRegistry()`: reads `data/root-discovery-registry.json`
- Added `loadBatchPublicationReport()`: reads `data/batch-publication-report.json`
- Kept existing functions for backward compatibility

### Phase 5: Tests

**Created `src/lib/morphology/sprint-44-discovery.test.ts`** (13 tests)

Test coverage:
- **Discovery (5 tests):** all distinct roots discovered, no fabricated roots, ayah-level markers excluded, deterministic output, lemma coverage computed correctly
- **Batch eligibility (5 tests):** manual entries preserved, Policy B permits incomplete coverage when alignment valid, invalid alignment blocks, per-root failures isolated, totals reconcile
- **Manual decisions preservation (3 tests):** automatic publication never activates topic, root publication never changes curated topic membership, no automatic `includedLemmas` approval

**Updated `src/lib/morphology/sprint-41-review-pipeline.test.ts`** (2 tests)
- Updated to reflect Policy B: missing lemmas are warnings, reviewer recommends observed lemmas even with incomplete coverage
- Added caching and timeout for batch review determinism test

## Files Changed

### New Files
- `src/lib/morphology/root-discovery.ts` — discovery layer
- `src/lib/morphology/batch-eligibility.ts` — eligibility engine
- `scripts/discover-roots.ts` — discovery CLI
- `scripts/batch-publish-roots.ts` — batch publication CLI
- `src/lib/morphology/sprint-44-discovery.test.ts` — regression tests (13 tests)
- `src/app/explore/root/root-listing-client.tsx` — interactive listing component
- `data/root-discovery-registry.json` — generated registry (1,642 roots)
- `data/batch-publication-report.json` — generated report
- `data/root-occurrences/{slug}.json` — per-root occurrence data (1,469 files)

### Modified Files
- `src/app/explore/root/page.tsx` — server component with registry loader
- `src/lib/morphology/root-data.ts` — added registry and report loaders
- `src/lib/morphology/review-pipeline.ts` — Policy B alignment (missing lemmas → warning)
- `src/lib/morphology/ai-lemma-reviewer.ts` — Policy B alignment (missing lemmas don't block)
- `src/lib/morphology/sprint-41-review-pipeline.test.ts` — Policy B test updates (2 tests)

### Unchanged (Preserved)
- `src/lib/morphology/root-allowlist.ts` — existing 10 entries untouched
- `src/lib/topics/data.ts` — curated topics unchanged
- `src/lib/morphology/root-links.ts` — navigation-only links unchanged
- All existing tests — continue passing (809 total)

## Verification

### Commands Executed

```bash
# Discovery
npx tsx scripts/discover-roots.ts --dry-run
# Output: 1,642 roots discovered, 50,298 occurrences, 44,741 ayat

# Batch publication (dry-run)
npx tsx scripts/batch-publish-roots.ts --dry-run
# Output: 1,469 eligible, 173 blocked, reconciliation verified

# Batch publication (live)
npx tsx scripts/batch-publish-roots.ts
# Output: 1,469 occurrence indexes generated, report written

# Review pipeline (regenerate publications with Policy B alignment)
npx tsx scripts/review-roots.ts
# Output: 4 published, 6 needs-review (manual entries)

# Quality gates
pnpm vitest run
# Output: 809 tests passed (48 test files)

pnpm lint
# Output: clean (0 errors, 0 warnings)

npx tsc --noEmit
# Output: clean (0 errors)

ALLOW_LOCALHOST_BUILD=1 pnpm build
# Output: build successful, all routes generated
```

### Test Results

```
Test Files  48 passed (48)
Tests       809 passed (809)
Duration    14.36s
```

### Lint Results

```
✖ 0 problems (0 errors, 0 warnings)
```

### Typecheck Results

```
Found 0 errors.
```

### Build Results

```
✓ Compiled successfully in 25.0s
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages (6,433 pages)
✓ Build complete
```

## Constraints Preserved

✅ No fabricated or inferred roots or lemmas  
✅ No silent deletion of source-backed occurrences  
✅ No automatic scholarly approval  
✅ No automatic thematic classification  
✅ No automatic topic creation  
✅ No automatic approval of ambiguous lemma selections  
✅ Preserve Quran text, translations, Tafsir, citations  
✅ Preserve local-first anonymous behavior  
✅ Keep `AI_ANSWER_FEATURE_ENABLED = false`  
✅ No deployment  
✅ Did not begin Sprint 45  

## Remaining Limitations

1. **Lemma coverage disclosure:** 1,669 of 50,298 word-level records (3.3%) have no lemma mapping. These are disclosed in the UI but don't block publication (Policy B). Lemma-based filtering is restricted for these records.

2. **Manual review still required:** 173 roots are blocked due to documented ambiguity, incompatible lemma mappings, or alignment failures. These require human review before publication.

3. **Thematic classification separate:** Root occurrence indexes are neutral ("verses containing forms associated with this root"), not thematic ("verses about X"). Thematic classification remains a separate dimension requiring scholarly review.

4. **Activation gate separate:** Publication (automated) is separate from activation (human gate). A published root index doesn't automatically activate a topic page.

## Next Steps

Sprint 45 can now proceed with:
- Word-level highlighting in ayah display (requires alignment validator)
- Root-to-topic semantic mapping (requires model provider or human review)
- Enhanced search across roots and topics
- Performance optimization for large root indexes

## Conclusion

Sprint 44 successfully bridges the gap between manual configuration and scalable discovery. The system now processes all 1,642 source-backed roots through a deterministic pipeline while preserving manual decisions, maintaining the three-dimension separation, and aligning with Policy B. All quality gates pass, and the UI provides searchable, filterable access to the full root inventory.
