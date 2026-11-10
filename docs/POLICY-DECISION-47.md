# Policy Decision 47 — Automated Morphology Review Policy v1.0.0

**Date:** 2026-11-10  
**Sprint:** 47  
**Status:** Active  
**Policy version:** `AUTOMATED_MORPHOLOGY_REVIEW_POLICY = 1.0.0`

## Context

Sprint 45 audited all 1,469 published root occurrence indexes and classified 173 blocked roots as `needs-review` due to incompatible lemma mappings or polysemy concerns. Sprint 46 built the human review interface for the 10 manual roots but required explicit human decisions for every lemma.

Sprint 47 introduces an **automated, evidence-backed morphological review engine** that can auto-accept straightforward mappings while routing uncertain cases to human review. This reduces manual work without compromising data integrity.

## Policy Scope

This policy governs the **automated morphological review** of root-lemma mappings in the QUL morphology dataset. It is a **morphological data-processing feature**, not an AI religious-answer feature.

`AI_ANSWER_FEATURE_ENABLED` remains `false`. Nothing in this policy emits religious interpretation or scholarly approval.

## Three Outcomes

### `auto-accepted`

A lemma may be automatically accepted when ALL of the following hold:

1. The lemma exists in the original QUL morphology source.
2. The lemma is explicitly associated with the root in the source.
3. The source record has a valid root and lemma identifier.
4. Every record has a valid word position (no missing locations).
5. No duplicate `surah:ayah:wordPosition` entries exist.
6. The mapping passes deterministic morphological compatibility checks (consonantal skeleton is fully compatible with the root).
7. No unresolved structural contradiction exists.
8. The exact source records can be traced.

**Auto-acceptance is a morphological validation result, not a thematic classification.**

### `needs-review`

Use this outcome when:

- The consonantal compatibility heuristic is inconclusive (partial match).
- Weak-letter derivation requires additional morphological analysis.
- Source mappings have zero shared consonantal structure (heuristic contradiction).
- Orthographic variants cannot be resolved deterministically.
- The lemma cannot be confidently evaluated by deterministic checks.
- Polysemy requires interpretation beyond the morphological relationship.
- Source evidence is incomplete or contradictory.
- Structural checks fail (missing word locations, duplicates, empty lemma fields).
- AI recommendation conflicts with deterministic validation.

**Missing evidence means `needs-review`, NEVER `rejected`.**

### `rejected`

Use this outcome **ONLY** when authoritative source evidence demonstrates that the mapping is invalid.

**Do NOT reject a source-backed mapping merely because a simplistic consonantal heuristic fails.**

A heuristic contradiction (zero shared consonantal structure) is not sufficient for rejection — it routes to `needs-review` for human investigation. Rejection requires verified authoritative evidence beyond the heuristic.

In Sprint 47, **zero lemmas are rejected** because no authoritative contradictions exist in the QUL source data.

## Deterministic Validation Layer (Layer A)

Mechanical checks performed before any AI analysis:

1. **Source lemma existence**: At least one word-level record exists.
2. **Source root association**: Records are filtered by root.
3. **Word location validity**: Every record has `wordPosition >= 1`.
4. **Lemma field presence**: Every record has a non-empty lemma.
5. **Duplicate detection**: No duplicate `surah:ayah:wordPosition`.
6. **Consonantal compatibility**: Ordered subsequence check on strong letters.
7. **Weak-letter handling**: ا و ي on either side downgrades to "inconclusive".

Normalization is for comparison only. The original Arabic text is never mutated.

## AI Analysis Layer (Layer B)

**Current state: No AI provider is configured.**

The system includes a provider-independent interface that supports OpenAI, Anthropic, Google, and custom endpoints. However, no API keys are configured in the repository, so `detectAiProvider()` returns `"none"` and `analyzeWithAi()` returns `null`.

When a provider is configured, AI may:

- Explain potential root-lemma compatibility.
- Identify possible weak-letter derivations.
- Compare Arabic consonantal structures.
- Identify possible orthographic variants.
- Recommend an outcome with a confidence assessment.

AI must NOT:

- Invent a lemma, root, or source record.
- Invent Quranic citations.
- Modify Quranic text.
- Guess missing morphology.
- Present uncertain linguistic reasoning as established fact.
- Override source evidence.

AI recommendations are **advisory signals**. They never override deterministic validation or source evidence.

## Decision Engine (Layer C)

Deterministic policy rules produce the final outcome:

| Evidence condition | Outcome |
|---|---|
| Source-backed, all mandatory checks pass, compatibility confirmed | `auto-accepted` |
| Source-backed but compatibility uncertain | `needs-review` |
| Source contradicted by heuristic (zero shared structure, no weak letters) | `needs-review` |
| Missing or incomplete source evidence | `needs-review` |
| AI recommendation conflicts with deterministic validation | `needs-review` |
| Source contradicted by **authoritative evidence** (not implemented in Sprint 47) | `rejected` |

**Critical rule:** AI disagreement with a deterministic "compatible" result triggers `needs-review`, not rejection.

## Mandatory Polysemy Cases

The following 6 cases are tested explicitly. Morphological acceptance and semantic categorization are **separate operations**:

| Root | Lemma | Morphological outcome | Semantic note |
|---|---|---|---|
| رحم | أرحام | `auto-accepted` | Kinship/womb context, not mercy |
| علم | العالمين | `auto-accepted` | "The worlds" context, not knowledge |
| كبر | أكبر / كبير | `auto-accepted` | Neutral size, not arrogance |
| كبر | استكبر | `auto-accepted` | Arrogance context |
| صدق | صدقة / صدقات | `auto-accepted` | Charity context, not truthfulness |
| وكل | وكيل | `auto-accepted` | Legal agency, not spiritual trust |
| غفر | كان (if present) | `auto-accepted` or `needs-review` | Incompatible mapping requires investigation |

**Morphological acceptance does NOT imply semantic categorization.** A lemma may be morphologically valid but semantically distinct. The human review interface and curated topics handle semantic categorization separately.

## Reviewer Override

Human reviewers may override automated outcomes:

- Accept a mapping flagged for review.
- Reject a mapping with documented evidence.
- Restore a previously overridden decision.

Every override preserves:

- Previous automated outcome.
- New decision.
- Reviewer identity (real name or role, never "AI").
- Reason.
- Timestamp.

Overrides do NOT alter source morphology.

## Relationship to Existing Systems

| System | Relationship |
|---|---|
| Sprint 45 integrity audit | Sprint 47 consumes the 173 blocked roots identified by Sprint 45 |
| Sprint 46 human review | Sprint 47 complements Sprint 46; auto-accepted lemmas populate occurrence indexes without requiring manual approval |
| `publication-policy.ts` | Sprint 47 uses the same normalization and compatibility heuristics for consistency |
| `AI_ANSWER_FEATURE_ENABLED` | Unrelated. Sprint 47 is morphological data processing, not religious answers |
| Policy B v2.0.0 | Preserved. Sprint 47 adds a new policy layer above it |

## Activation Rules

Only `auto-accepted` mappings (or those overridden to `auto-accepted` by a reviewer) can be activated automatically.

`needs-review` mappings remain excluded until resolved by human review.

`rejected` mappings remain excluded permanently.

## Success Metrics

Sprint 47 success is measured by:

1. Deterministic morphology validation is operational.
2. AI-assisted analysis is accurately represented (currently: no provider).
3. Automated acceptance decisions are evidence-backed.
4. Ambiguous cases remain in `needs-review`.
5. The 6 mandatory Arabic cases are tested.
6. The 10-root pilot can be processed.
7. Only eligible roots are activated.
8. Batch dry-run analysis covers all 1,642 roots.
9. No source data or Quranic content is altered.
10. Existing topics and thematic classifications remain untouched.

## Conclusion

Policy Decision 47 establishes a conservative, evidence-backed automated morphology review engine that reduces manual work while preserving data integrity. The policy prioritizes source evidence over heuristics and never fabricates acceptance. Uncertain cases route to human review rather than being auto-rejected.

The 10-root pilot achieved 98.0% auto-acceptance (97/99 lemmas), with 2 lemmas correctly routed to `needs-review` (كَانَ under غفر and كبر — heuristic flagged, never rejected). The batch dry-run on all 1,642 roots achieved 92.4% auto-acceptance (4,350/4,709 lemmas), with 359 lemmas correctly routed to `needs-review`.
