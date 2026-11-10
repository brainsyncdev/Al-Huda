# Policy Decision 48 — Full Morphology Activation

**Policy Version:** 1.0.0 (extends Sprint 47 AUTOMATED_MORPHOLOGY_REVIEW_POLICY)  
**Date:** 2026-11-10  
**Status:** Enforced  

## 1. Purpose

Sprint 48 completes the end-to-end Quranic root morphology pipeline by activating all eligible roots, not merely the 10 manual roots from Sprint 47.

## 2. Activation Policy

### Auto-acceptance (carried from Sprint 47)

A root-lemma mapping is auto-accepted when:

1. The source lemma exists in the morphology dataset.
2. The source explicitly associates it with the root.
3. Source identifiers and word locations are valid.
4. Morphological compatibility passes deterministic checks.
5. No unresolved structural contradiction exists.
6. The mapping can be traced to the original source.

### Needs-review (carried from Sprint 47)

A mapping remains in needs-review when:

- Weak-letter derivation is uncertain.
- Source records conflict.
- Orthographic variation cannot be resolved.
- Lemma identity is ambiguous.
- Source evidence is missing or incomplete.

### Rejection (carried from Sprint 47)

A mapping is rejected ONLY when authoritative evidence establishes an invalid mapping. A heuristic mismatch alone is never sufficient for rejection.

## 3. Sprint 48 Additions

### Full-scale activation

- All 1,642 discovered roots are processed through the review engine.
- Every root with at least one auto-accepted lemma is activated.
- Occurrence indexes are populated for all eligible roots.
- Roots with zero auto-accepted lemmas remain unpopulated.

### Independent verification

- An independent audit script verifies every activated occurrence against the source.
- No phantom or duplicate occurrences are permitted.
- Every source record is reconciled into an explicit category.

### Discovery registry

- The registry reflects actual activation state.
- A root is NOT reported as activated when its occurrence index is empty.
- Statuses: `activated`, `partially-activated`, `needs-review`, `discovered`.

## 4. AI Provider Policy

- No AI provider is configured in this sprint.
- `detectAiProvider()` returns `"none"`.
- `analyzeWithAi()` returns `null`.
- The system never fabricates AI recommendations.
- The provider-independent interface is preserved for future integration.

## 5. Polysemy Policy

Morphological acceptance does NOT imply semantic categorization. The 6 mandatory polysemy cases are:

| Root | Lemma | Morphological outcome | Semantic note |
|---|---|---|---|
| رحم | أرحام | auto-accepted | Kinship/womb, not mercy |
| علم | العالمين | auto-accepted | Worlds, not knowledge |
| كبر | أكبر | auto-accepted | Size, not arrogance |
| كبر | استكبر | auto-accepted | Arrogance context |
| صدق | صدقة | auto-accepted | Charity, not truthfulness |
| وكل | وكيل | auto-accepted | Legal agency, not spiritual trust |

The غفر/كَانَ mapping remains `needs-review` — the heuristic flags it as uncertain, but no authoritative evidence exists to reject it.

## 6. Results

- **1,642 roots processed**
- **1,331 roots activated** (81.1%)
- **4 roots partially activated** (have both auto-accepted and needs-review lemmas)
- **4 roots need review** (only needs-review lemmas)
- **307 roots discovered** (no auto-accepted lemmas)
- **4,350 lemmas auto-accepted** (92.4% of 4,709)
- **359 lemmas need review** (7.6%)
- **0 lemmas rejected**
- **44,550 occurrences activated**
- **29,684 distinct ayat covered**
- **50,298 source records fully reconciled** (zero unexplained)

## 7. Quality Gates

All quality gates pass:
- `pnpm lint` — 0 errors
- `pnpm typecheck` — 0 errors
- `pnpm vitest run` — 938 tests pass (53 files)
- Independent audit — 0 failures, 0 warnings
- Reconciliation — all 50,298 source records accounted for
