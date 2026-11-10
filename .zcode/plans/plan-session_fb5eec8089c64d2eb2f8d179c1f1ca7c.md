# Sprint 44: Global Root Discovery & Automated Batch Publication Pipeline

## Context

The current system has 10 manually configured root entries in `ROOT_ALLOWLIST`, but the morphology index contains 1,642 distinct source-backed roots. Sprint 44 bridges this gap by building a scalable discovery and batch publication system that processes all roots through one deterministic pipeline while preserving existing manual decisions and maintaining the three-dimension separation (occurrence validity / lemma coverage / thematic classification).

## Implementation Approach

### Phase 1: Root Discovery Layer

**Create `src/lib/morphology/root-discovery.ts`**

- Function `discoverAllRoots(index: MorphologyRecord[]): RootCandidate[]`
- Scans morphology index, filters to word-level records only (`wordPosition !== undefined`)
- Groups by root, computes per-root stats:
  - `slug`: Arabic root string (e.g., "صبر") — stable, deterministic
  - `root`: Arabic root
  - `totalWordRecords`, `distinctAyahCount`, `distinctSurahCount`
  - `recordsWithLemma`, `missingLemmaCount`, `lemmaCoverageRatio`
  - `observedLemmas`: sorted unique lemmas
  - `occurrenceAlignmentStatus`: "valid" | "invalid" | "unknown"
  - `discoveryStatus`: "eligible" | "needs-validation" | "blocked"
  - `publicationStatus`: "not-published" | "published" | "blocked"
  - `sourceDatasetVersion`, `policyVersion`
- Output: `data/root-discovery-registry.json` (deterministic, no timestamps, stable ordering by root)

**Create `scripts/discover-roots.ts`**

- CLI: `npx tsx scripts/discover-roots.ts [--dry-run] [--json]`
- Loads morphology index, calls `discoverAllRoots()`, writes registry
- Dry-run shows counts without writing

### Phase 2: Batch Eligibility Engine

**Create `src/lib/morphology/batch-eligibility.ts`**

- Function `evaluateBatchEligibility(candidates: RootCandidate[], index: MorphologyRecord[], existingEntries: RootTopicEntry[]): BatchEligibilityResult`
- For each candidate:
  - Extract word-level records for that root
  - Run validation (reuse `validateRootRecords()` from review-pipeline.ts)
  - Check Policy B eligibility (reuse `decidePublication()` logic)
  - If candidate matches existing manual entry (by slug or root), preserve manual fields (`reviewState`, `includedLemmas`, `notes`)
  - Generate `PublicationDecision` for each root
- Output: per-root eligibility with reasons, blocked roots with explicit reasons

**Eligibility rules (Policy B):**
- Publish when: source-backed, alignment valid, no error-severity issues, provenance available, policy current
- Block when: alignment invalid, source contradictory, provenance missing, validation stale, policy unsupported
- Missing lemmas disclosed but don't block (Policy B)
- Ambiguity flags still block (separate semantic review dimension)

### Phase 3: Batch Publication Engine

**Create `scripts/batch-publish-roots.ts`**

- CLI: `npx tsx scripts/batch-publish-roots.ts [--dry-run] [--json]`
- Loads discovery registry, evaluates eligibility, generates occurrence indexes for eligible roots
- For each eligible root:
  - Build occurrence index (reuse `buildRootTopicIndex()` from occurrence-index.ts)
  - Write to `data/root-occurrences/{slug}.json`
- Preserves existing manual entries: if a discovered root matches an existing `ROOT_ALLOWLIST` entry, merge only computed fields, never overwrite `reviewState`, `includedLemmas`, or manual metadata
- Generate `data/batch-publication-report.json` with:
  - Total discovered, eligible, published, blocked, review-required
  - Per-root decisions with reasons
  - Reconciliation: discovered = eligible + blocked; eligible = published + eligible-but-not-published
  - Totals: word-level occurrences, distinct ayat, missing lemmas
  - Validation errors

**Merge strategy for manual entries:**
- Match by slug (if discovered slug matches existing slug) OR by root (if discovered root matches existing `roots[0]`)
- Preserve: `reviewState`, `includedLemmas`, `title`, `arabicTitle`, `notes`, `assertedBy`, `assertedAt`
- Merge computed: `totalWordRecords`, `distinctAyahCount`, `lemmaCoverageRatio`, etc.
- Never auto-approve `includedLemmas` from observed lemmas

### Phase 4: UI Enhancements

**Update `src/app/explore/root/page.tsx`**

- Add search box: search by Arabic root (client-side filtering, no backend needed for 1,642 roots)
- Add pagination: 50 roots per page (server-side via `?page=N`)
- Add status filters: "All", "Published", "Pending Review", "Blocked"
- Add sorting: "Alphabetical (Arabic)", "Occurrence count (high→low)", "Lemma coverage (high→low)"
- Load roots from discovery registry instead of `ROOT_ALLOWLIST`
- Each root card shows: Arabic root, occurrence count, distinct ayat, lemma coverage %, status badge

**Update `src/app/explore/root/[root]/page.tsx`**

- Load root data from `data/root-occurrences/{slug}.json` if exists, else fall back to computing on-the-fly
- No major changes needed — already handles pagination and 3 view states

**Update `src/lib/morphology/root-data.ts`**

- Add `loadDiscoveryRegistry()`: reads `data/root-discovery-registry.json`, caches
- Add `getRootOccurrencesFromRegistry(slug)`: loads pre-computed occurrence data
- Keep existing functions for backward compatibility

### Phase 5: Tests

**Create `src/lib/morphology/sprint-44-discovery.test.ts`**

Test coverage:
- **Discovery:** all distinct roots discovered, no fabricated roots, ayah-level markers excluded, deterministic output, manual entries preserved
- **Eligibility:** Policy B permits incomplete lemma coverage when alignment valid, invalid alignment blocks, stale validation blocks, missing provenance blocks, ambiguity separate from occurrence eligibility
- **Batch publication:** dry-run doesn't mutate artifacts, full execution idempotent, per-root failures don't corrupt others, every blocked root has reason, totals reconcile
- **Manual decisions:** existing human decisions preserved, automatic publication never activates topic, root publication never changes curated topic membership, topic-to-root links navigation-only, no automatic includedLemmas approval
- **UI:** Arabic root search works, pagination accurate, coverage disclosures visible, no false exhaustive claims

### Phase 6: Report

**Write `SPRINT-44-REPORT.md`**

Must include:
- Actual discovered root count (expected: 1,642)
- Eligible, published, blocked, review-required counts
- Occurrence totals and reconciliation results
- Exact policy (2.0.0) and source (qul-morphology-v1) versions
- Changed and created files
- Commands executed
- Test, lint, typecheck, build results
- Remaining limitations
- Roots not published with exact reasons

## Key Files

**New files:**
- `src/lib/morphology/root-discovery.ts` — discovery layer
- `src/lib/morphology/batch-eligibility.ts` — eligibility engine
- `scripts/discover-roots.ts` — discovery CLI
- `scripts/batch-publish-roots.ts` — batch publication CLI
- `src/lib/morphology/sprint-44-discovery.test.ts` — regression tests
- `data/root-discovery-registry.json` — generated registry
- `data/batch-publication-report.json` — generated report
- `data/root-occurrences/{slug}.json` — per-root occurrence data (1,642 files)

**Modified files:**
- `src/app/explore/root/page.tsx` — add search, pagination, filters
- `src/lib/morphology/root-data.ts` — add registry loader
- `src/lib/morphology/publication-policy.ts` — may need minor adjustments for batch processing

**Unchanged (preserved):**
- `src/lib/morphology/root-allowlist.ts` — existing 10 entries untouched
- `src/lib/topics/data.ts` — curated topics unchanged
- `src/lib/morphology/root-links.ts` — navigation-only links unchanged
- All existing tests — must continue passing

## Verification

1. Run discovery: `npx tsx scripts/discover-roots.ts` → verify 1,642 roots discovered
2. Run batch publication: `npx tsx scripts/batch-publish-roots.ts --dry-run` → verify counts, no files written
3. Run batch publication (live): `npx tsx scripts/batch-publish-roots.ts` → verify occurrence files generated
4. Run global audit: `python3 scripts/global-morphology-audit.py` → verify reconciliation
5. Run tests: `pnpm vitest run` → verify all pass (existing + new)
6. Run lint: `pnpm lint` → verify clean
7. Run typecheck: `npx tsc --noEmit` → verify clean
8. Run build: `ALLOW_LOCALHOST_BUILD=1 pnpm build` → verify succeeds
9. Manual UI check: browse `/explore/root`, verify search, pagination, filters work

## Constraints Preserved

✓ No fabricated or inferred roots or lemmas
✓ No silent deletion of source-backed occurrences
✓ No automatic scholarly approval
✓ No automatic thematic classification
✓ No automatic topic creation
✓ No automatic approval of ambiguous lemma selections
✓ Preserve Quran text, translations, Tafsir, citations
✓ Preserve local-first anonymous behavior
✓ Keep `AI_ANSWER_FEATURE_ENABLED = false`
✓ No deployment
✓ Do not begin Sprint 45