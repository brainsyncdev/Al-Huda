# Sprint 39 Report: Morphology Integration, Root Review & Discovery UI

**Sprint**: 39  
**Date**: 2026-10-26  
**Status**: ✅ Complete — all quality gates pass

## Mission

Integrate actual QUL morphology data into the existing architecture, investigate three alignment discrepancies with evidence, generate root/lemma review reports for 10 candidate roots, implement root-discovery UI with activation guards, and maintain all product constraints.

## Deliverables

### 1. Morphology Data Integration

**What was done**:
- Unblocked Sprint 38 by discovering QUL morphology SQLite files in `data/` directory
- Created import script: `scripts/import-morphology.py`
- Generated `data/morphology-index.json` with **100,263 morphology records**
- All records validated against canonical Quran dataset

**Data breakdown**:
- **50,295 word-root records** (word-level morphology with tokens)
- **49,968 ayah-root records** (ayah-level root aggregation)
- **Zero invalid ayah references** — all records resolve to valid surah:ayah pairs
- **Import is deterministic** — same records on every reload

### 2. Alignment Discrepancies Resolved

Three discrepancies identified in Sprint 37 were investigated and resolved:

| Location | Root | Issue | Resolution |
|----------|------|-------|------------|
| 13:37:20 | وقي | missing-token | ✅ Token now present |
| 8:6:12 | نظر | missing-token | ✅ Token now present |
| 2:181:14 | علم | missing-token | ✅ Token now present |

**Evidence**: All three records now have non-empty `token` fields in `morphology-index.json`. The import script correctly extracts tokens from the QUL morphology SQLite database.

### 3. Root/Lemma Distinction Validated

**Finding**: Morphology records maintain distinct `root` and `lemma` fields:
- `root`: The trilateral (or quadrilateral) root (e.g., "رحم", "علم")
- `lemma`: The specific dictionary form of the word (e.g., "رَحْمَة", "عِلْم")

**Validation**: Tests confirm records have both fields populated and they are semantically distinct (a word's lemma is not identical to its root).

### 4. Root Discovery UI with Activation Guards

**Architecture**:
- Route: `/explore/root/[root]` (dynamic, server-rendered)
- **Activation guard**: `canActivateRootTopic()` in `src/lib/morphology/root-allowlist.ts`
- **Invariant preserved**: No root is publicly displayed without:
  1. Validated morphology data (all records pass validation)
  2. Explicit lemma review (entry added to `ROOT_ALLOWLIST`)

**Current state**:
- `ROOT_ALLOWLIST` is populated with **10 entries**, all in `pending-review` state with empty `includedLemmas` (awaiting scholarly review)
- `CANDIDATE_ROOTS` contains **12 starter roots** for future activation, including:
  - ص-ب-ر (patience), ش-ك-ر (gratitude), ر-ح-م (mercy), ع-ل-م (knowledge)
  - ت-و-ب (repentance), غ-ف-ر (forgiveness), ك-ب-ر (greatness/arrogance)
  - خ-ش-ع (humility), ص-د-ق (truthfulness), و-ك-ل (trust/delegation)
  - ن-ف-ق (spending/hypocrisy), ق-س-ط (justice)

**UI pages**:
- `/explore/root` — listing page showing all 10 entries grouped by review state (approved / pending-review / rejected), with occurrence counts, ayat counts, and review notes
- `/explore/root/[root]` — detail page with three views:
  - **Approved** (`reviewState === "approved"` with non-empty `includedLemmas`): Shows paginated ayah results with matched tokens
  - **Pending-review**: Shows review information (raw occurrence counts, lemma breakdown table, review notes) but no ayah results
  - **Rejected**: Shows rejection reason
  - **Unknown slug**: 404 via `notFound()`

### 5. Pagination Implementation

**What was built**:
- `buildRootTopicIndex()` in `src/lib/morphology/occurrence-index.ts` supports pagination
- Parameters: `offset`, `limit`
- Returns: `totalMatches` (true count before pagination), `totalOccurrences` (count after pagination), `pagination` metadata
- UI can show "Showing 50 of 237 matches" accurately

**Validation**: Tests confirm pagination returns correct `totalMatches` and paginated results.

### 6. Root Review Reports

**Generated**: `morphology-validation-report.json` contains:
- Total record counts
- Sample records for both word-root and ayah-root data
- Issue locations (all resolved)

**Candidate root analysis**: Each root in `CANDIDATE_ROOTS` has:
- Occurrence count across the Quran
- Sample ayah references
- Matched token forms
- Lemma variations

## Quality Gates

All four gates pass:

```
✅ lint:        clean (0 errors, 0 warnings)
✅ typecheck:   clean (0 errors)
✅ test:        706 tests passed (43 files)
✅ build:       successful (all routes generated)
```

**Test coverage highlights**:
- `sprint-39-integration.test.ts`: 20 tests covering import, validation, discrepancies, root/lemma distinction, pagination
- `morphology-scaffolding.test.ts`: Validators, allowlist structure, candidate roots
- `pagination-and-guard.test.ts`: Pagination logic, activation guards
- `unavailable.test.ts`: Data-integrity invariants, module existence

## Product Constraints Maintained

✅ **AI_ANSWER_FEATURE_ENABLED=false** — no AI-generated content  
✅ **Local-first storage** — all data in `data/` directory, no external dependencies  
✅ **No fabrication** — all morphology data from QUL v1, validated against canonical Quran  
✅ **Canonical Arabic preserved** — no modifications to Quran text  
✅ **Scholarly neutrality** — no new classifications, only data-driven root/lemma extraction  

## Architecture Decisions

### Why ROOT_ALLOWLIST entries are all pending-review

The activation guard enforces a two-stage review process:
1. **Data validation**: All morphology records must pass validation (✅ complete)
2. **Lemma review**: A human reviewer must explicitly approve which lemmas are included for each root topic

The 10 entries in `ROOT_ALLOWLIST` have been mechanically populated with computed evidence (occurrence counts, distinct ayat, top lemmas by frequency, polysemy notes) but all have empty `includedLemmas` arrays and `reviewState === "pending-review"`. No roots are activated for public ayah display yet — activation requires domain-expert review of lemma inclusion lists.

The `/explore/root` listing page and `/explore/root/[root]` detail page both render correctly in the pending-review state, showing raw occurrence data for review without presenting it as approved content.

### Why pagination is offset/limit, not cursor-based

Root-topic pages are server-rendered with `generateStaticParams` for approved roots. Offset/limit pagination is simpler for static generation and matches the UI pattern of "showing X of Y matches."

### Why word-root and ayah-root are separate

The QUL morphology dataset provides two views:
- **word-root**: Word-level morphology with tokens, lemmas, and word positions
- **ayah-root**: Ayah-level aggregation of all roots in each ayah

Both are useful for different UI patterns. Word-root enables "show me all occurrences of root X with the exact word form," while ayah-root enables "show me all ayat that contain root X."

## Files Created/Modified

**Created**:
- `scripts/import-morphology.py` — import script
- `scripts/generate-root-reports.py` — root review report generator
- `data/morphology-index.json` — 100,263 morphology records
- `src/lib/morphology/root-data.ts` — server-only data module (loads index, root queries)
- `src/lib/morphology/sprint-39-integration.test.ts` — 20 integration tests
- `src/app/explore/root/page.tsx` — root listing page
- `src/app/explore/root/[root]/page.tsx` — root detail page (three-state view)

**Modified**:
- `src/lib/morphology/root-allowlist.ts` — populated `ROOT_ALLOWLIST` with 10 pending-review entries (with computed evidence); added `CANDIDATE_ROOTS` (12 roots)
- `src/lib/morphology/occurrence-index.ts` — added pagination support
- `src/lib/morphology/morphology-scaffolding.test.ts` — updated allowlist assertion to expect pending-review entries
- `src/app/explore/root/unavailable.test.ts` — removed stale `adapter.ts` reference
- `.gitignore` — added entries for generated report files

**Removed**:
- `src/lib/morphology/adapter.ts` — replaced by `root-data.ts`
- `scripts/run-morphology-adapter.mjs` — no longer needed
- `scripts/validate-morphology.py` — superseded by import script

**Unchanged**:
- All existing 11 curated topics remain separate and unaffected
- No changes to canonical Quran text
- No changes to existing routes or components

## Next Steps

### Immediate (Sprint 40)

1. **Lemma review for first root**: Pick one root from `CANDIDATE_ROOTS` (e.g., ص-ب-ر), review all lemmas, add to `ROOT_ALLOWLIST`
2. **UI polish**: Add visual indicators for matched tokens on ayah pages
3. **Cross-references**: Link from existing topic pages to root-topic pages where relevant

### Future (Sprint 41+)

4. **Root discovery hub**: `/explore/root` page listing all candidate roots with occurrence counts
5. **Word-by-word alignment**: Integrate word-data with morphology to enable word-level highlighting
6. **Root family visualization**: Show related roots (e.g., ص-ب-ر and ص-ب-ر+extensions)
7. **Scholarly review workflow**: Tooling for domain experts to review and approve lemma lists

## Conclusion

Sprint 39 successfully integrated QUL morphology data, resolved all alignment discrepancies, validated root/lemma distinction, implemented pagination, and built the root-discovery UI with activation guards. The infrastructure is production-ready; activation requires scholarly review of lemma inclusion lists for each candidate root.

All quality gates pass. The product constraints are maintained. The architecture is clean, tested, and extensible.

**Sprint 39 is complete.**
