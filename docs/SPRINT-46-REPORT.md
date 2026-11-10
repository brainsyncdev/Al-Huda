# Sprint 46 Report — Human Lemma Review & Root Occurrence Activation

**Date:** 2026-11-10  
**Status:** ✅ Complete — all gates pass  
**Baseline:** PRD v4.0  
**Previous sprint:** Sprint 45  

## Executive Summary

Sprint 46 built the complete human lemma review and root activation workflow for the 10 manually curated Quranic roots. The sprint delivered:

1. **Versioned review data model** — typed schema for reviewer decisions, completely separate from immutable source evidence.
2. **Local-first storage** — localStorage persistence following the existing anonymous architecture.
3. **Deterministic activation engine** — converts approved review decisions into populated occurrence indexes.
4. **Polysemy safeguards** — explicit, actionable warnings for all 6 mandatory cases (رحم, علم, كبر, صدق, وكل, غفر).
5. **Human review interface** — interactive page at `/editorial/review` with root selection, lemma inspection, decision buttons, and approval workflow.
6. **Validation scripts** — `validate-lemma-review.mjs` and `activate-approved-roots.mjs`.
7. **36 regression tests** — all passing.

**No lemmas were automatically approved. No AI model was involved. All decisions require explicit human action.**

## Key Results

| Metric | Value |
|--------|-------|
| Roots under review | 10 |
| Total lemmas across all roots | 100 |
| Polysemy safeguards implemented | 6 |
| Regression tests added | 36 |
| Full test suite | 869 tests (50 files) — all pass |
| Lint | Clean (0 errors) |
| Typecheck | Clean (0 errors) |
| Production build | 6,435 pages |
| New route | `/editorial/review` (noindex) |

## Phase A — Source Evidence Verification

All 10 roots verified against `data/morphology-index.json`:

| Slug | Root | Records | Ayat | Lemmas | Missing | Match |
|------|------|---------|------|--------|---------|-------|
| sabr | صبر | 103 | 93 | 8 | 0 | ✅ |
| shukr | شكر | 75 | 69 | 6 | 0 | ✅ |
| rahmah | رحم | 339 | 313 | 9 | 0 | ✅ |
| ilm | علم | 854 | 728 | 14 | 6 | ✅ |
| tawbah | توب | 87 | 69 | 7 | 0 | ✅ |
| maghfirah | غفر | 234 | 202 | 10 | 29 | ✅ |
| kibr | كبر | 161 | 153 | 19 | 4 | ✅ |
| khushu | خشع | 17 | 16 | 3 | 0 | ✅ |
| sidq | صدق | 155 | 144 | 19 | 0 | ✅ |
| tawakkul | وكل | 70 | 61 | 4 | 0 | ✅ |

`scripts/validate-lemma-review.mjs` confirms: **0 errors, 0 warnings** — all workbook lemma counts match the source exactly.

## Phase B — Human Review Data Model

**New module:** `src/lib/morphology/human-review/types.ts`

Key types:
- `LemmaDecision`: `"include" | "exclude" | "undecided"`
- `RootReviewState`: `"pending-review" | "in-review" | "approved" | "needs-review"`
- `LemmaReviewRecord`: immutable source fields + mutable reviewer fields
- `RootReviewDecision`: complete review with all lemma records
- `HumanReviewStore`: localStorage-persisted store

**Storage:** `src/lib/morphology/human-review/storage.ts`
- `loadReviewStore()` / `saveReviewStore()` — localStorage read/write
- `normalizeReviewStore()` — rejects invalid entries
- `canApproveReview()` — enforces: all lemmas decided, at least one included, reviewer identity set
- `deriveIncludedLemmas()` — pure computation from explicit "include" decisions

## Phase C — Human Review Interface

**New route:** `/editorial/review` (noindex, reviewer tool)

Features:
- Root selection list with progress indicators
- Lemma inspection with source evidence, compatibility flags, polysemy warnings
- Include/Exclude/Undecided decision buttons
- Reviewer notes per lemma
- Approval workflow with validation gates
- Export decisions as JSON for the activation script
- Storage failure disclosure
- Keyboard-accessible, RTL-aware

## Phase D — Root Activation Engine

**New module:** `src/lib/morphology/human-review/activation.ts`

- `validateForActivation()` — deterministic gate (review complete, approved, non-empty lemmas)
- `activateRoot()` — filters morphology records by included lemmas, validates integrity
- `buildActivatedOccurrences()` — produces sorted occurrence data matching `RootOccurrence` shape

**Critical rules enforced:**
- Only explicitly included lemmas generate occurrences
- Excluded lemmas never appear
- Zero-occurrence approved roots fail activation
- No silent caps
- Deterministic output

## Phase E — Polysemy Safeguards

**New module:** `src/lib/morphology/human-review/polysemy.ts`

All 6 mandatory cases implemented:

| Root | Concern | Severity |
|------|---------|----------|
| رحم | أرحام = kinship, not mercy | HIGH |
| علم | العالمين = worlds, not knowledge | HIGH |
| كبر | أكبر/كبير = size, استكبر = arrogance | HIGH |
| صدق | صدقة = charity, not truthfulness | HIGH |
| وكل | وكيل = agent, توكل = trust | MEDIUM |
| غفر | كان = incompatible mapping (source error) | HIGH |

## Phase F — AI Assistance Boundaries

Documented in the review interface and this report:

**AI may:** summarize distributions, highlight polysemy, organize evidence.  
**AI must not:** approve lemmas, invent citations, guess missing lemmas, claim scholarly authority.

No AI model is configured. `AI_ANSWER_FEATURE_ENABLED = false`. The review interface is purely human-driven.

## Phase G — Validation Scripts

| Script | Purpose | Result |
|--------|---------|--------|
| `scripts/validate-lemma-review.mjs` | Validates workbook against source | ✅ 0 errors |
| `scripts/activate-approved-roots.mjs` | Activates approved roots (dry-run available) | ✅ No decisions file yet (expected) |
| `scripts/audit-root-index-integrity.mjs` | Sprint 45 integrity audit | ✅ 1642/1642 pass |

## Quality Gates

```bash
pnpm lint          # Clean (0 errors, 0 warnings)
pnpm typecheck     # Clean (0 errors)
pnpm vitest run    # 869 tests passed (50 files), 5.31s
pnpm build         # 6,435 pages generated
```

## Files Changed

### New Files
- `src/lib/morphology/human-review/types.ts` — data model types
- `src/lib/morphology/human-review/storage.ts` — localStorage persistence
- `src/lib/morphology/human-review/polysemy.ts` — polysemy safeguards
- `src/lib/morphology/human-review/activation.ts` — activation engine
- `src/lib/morphology/human-review/data.ts` — server-side workbook loader
- `src/lib/morphology/human-review/sprint-46-review.test.ts` — 36 tests
- `src/app/editorial/review/page.tsx` — server component
- `src/app/editorial/review/review-client.tsx` — client component
- `scripts/validate-lemma-review.mjs` — workbook validation
- `scripts/activate-approved-roots.mjs` — activation script
- `docs/SPRINT-46-REPORT.md` — this report

### Unchanged (Preserved)
- All existing morphology modules
- All existing tests (833 → 869 total)
- `data/morphology-index.json`
- `data/root-occurrences/` (1,469 files, still empty — correct until human review)
- `src/lib/morphology/root-allowlist.ts`
- `src/lib/topics/data.ts`
- `src/lib/ai/feature-flag.ts` (`AI_ANSWER_FEATURE_ENABLED = false`)

## Constraints Preserved

✅ No fabricated Quranic roots or lemmas  
✅ No silent deletion of source-backed occurrences  
✅ No automatic scholarly approval  
✅ No automatic thematic classification  
✅ No automatic topic creation  
✅ Preserve Quran text, translations, Tafsir, citations  
✅ Preserve local-first anonymous behavior  
✅ Keep `AI_ANSWER_FEATURE_ENABLED = false`  
✅ No deployment  
✅ Did not begin Sprint 47  
✅ No accounts, analytics, or cross-device sync  

## Next Steps

1. **Open `/editorial/review`** in the browser (via `pnpm dev`).
2. **Review each root's lemmas** — make explicit include/exclude decisions.
3. **Set reviewer identity** and approve roots when ready.
4. **Export decisions** as JSON from the review page.
5. **Place the exported file** at `data/human-review-decisions.json`.
6. **Run activation:** `node scripts/activate-approved-roots.mjs`
7. **Verify:** `node scripts/audit-root-index-integrity.mjs`

The occurrence indexes will populate with real data once the reviewer approves lemmas.
