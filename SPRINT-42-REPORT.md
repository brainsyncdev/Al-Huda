# Sprint 42 — Missing Lemma Recovery & Root/Theme Separation

**Date:** 2026-10-27  
**Status:** Complete  
**Tests:** 786 passing (46 files)  
**Gates:** lint ✓, typecheck ✓, test ✓, build ✓

---

## Executive Summary

Sprint 42 investigated missing lemma records in the morphology index for three roots (علم, غفر, كبر) that were flagged during Sprint 41's automated review. The investigation found:

- **39 word-level records** across these three roots have no lemma in the source dataset (علم: 6, غفر: 29, كبر: 4)
- **All 39 are genuinely absent** from the QUL morphology source databases — verified by exact string lookup in `word-lemma.db`
- **1,669 total word-level records** across 158 roots have a root but no lemma (systemic gap, not root-specific)
- **0 lemmas recovered** — no fabrication, inference, or silent deletion
- **No importer defect** — the importer merges on exact `surah:ayah:wordPos` keys, and these keys are not in the lemma source

The sprint delivered:
1. A machine-readable audit artifact (`data/lemma-recovery-audit.json`) with per-record evidence
2. Publication policy v1.1.0 with an explicit missing-lemma gate
3. 12 regression tests proving root publication cannot mutate curated topic membership
4. UI coverage-gap disclosure on root detail pages
5. Confirmation that root occurrence indices and thematic topics are separate data structures with independent lifecycles

---

## §1 Preflight Audit

**Repository state:** Sprint 41 complete (774 tests, SPRINT-41-REPORT.md delivered).  
**Source databases:** QUL morphology v1 SQLite files in `data/` (6 databases: `word-lemma.db`, `word-root.db`, `ayah-root.db`, etc.).  
**Importer:** `scripts/import-morphology.py` merges on exact `f"{surah}:{ayah}:{word_pos}"` keys.  
**Pipeline:** Deterministic, idempotent, no wall-clock timestamps in committed artifacts.  
**Policy:** v1.0.0 at sprint start; stages kept separate (source validation, alignment, AI review, eligibility).

**Key finding during preflight:** The Sprint 41 report's 6/29/4 missing-lemma counts were correct, but for a non-obvious reason. A naive filter (`root ∈ {علم,غفر,كبر} && !lemma`) returns 1,288 records because it includes ayah-level root markers from `ayah-root.db` that never had lemma data by design. Filtering to `wordPosition !== undefined` yields the true word-level figure: **39**.

---

## §2 Missing Lemma Investigation

### Methodology

For each root (علم, غفر, كبر):
1. Extract all word-level records (`wordPosition !== undefined`) from `data/morphology-index.json` where `root` is set and `lemma` is empty
2. For each record, construct the exact `word_location` key (`surah:ayah:word_pos`)
3. Look up that key in `word-lemma.db` (72,510 locations in `lemma_words` joined to `lemmas.text`)
4. Verify the location exists in `word-root.db` (50,298 locations) to confirm the root mapping is authentic
5. Classify as `recovered-from-source`, `absent-from-source`, or `source-db-unavailable`

### Results

| Root | Word-level records | Missing lemmas | Verified absent | Recovered |
|------|-------------------|----------------|-----------------|-----------|
| علم  | 854               | 6              | 6               | 0         |
| غفر  | 234               | 29             | 29              | 0         |
| كبر  | 161               | 4              | 4               | 0         |
| **Total** | **1,249**    | **39**         | **39**          | **0**     |

**All 39 are genuinely absent from the source.** Each location was looked up by exact string in `word-lemma.db`: 0 hits. All 39 do exist in `word-root.db`, so the root mapping is authentic and only the lemma is missing.

### Systemic Gap

Expanding the audit to all roots with missing lemmas:

- **1,669 word-level records** across **158 roots** have a root but no lemma
- Top roots by missing count: كون (353), امن (130), شيا (118), نفس (106), اتي (97), دعو (44), ولي (42), نور (36), سوا (34), خلق (33)
- **0 recovered** — no fabrication, inference, or silent deletion
- **Source DB available:** yes

**Full per-record evidence:** `data/lemma-recovery-audit.json` (audit version 1.0.0, deterministic, no timestamps).

### Importer Defect Analysis

The importer merges on exact `f"{surah}:{ayah}:{word_pos}"` keys. Since these 39 keys are not in the lemma source, there is **no importer defect to fix**. The gap is in the source data, not the import logic.

---

## §3 Root/Theme Separation

### Principle

**A shared root, lemma, word form, or occurrence count must never automatically add an ayah to a thematic topic.**

### Implementation

1. **Data structure independence:**
   - Curated topics (`src/lib/topics/data.ts`) are hardcoded editorial selections with typed `TopicRelation[]` arrays
   - Root allowlist entries (`src/lib/morphology/root-allowlist.ts`) specify roots and `includedLemmas`, but not ayat
   - Ayahs are derived mechanically from morphology records at query time, not stored in root entries

2. **Publication policy isolation:**
   - `canPublishRootIndex` checks eligibility but does not mutate `entry.reviewState`
   - `buildPublishedIndexEntry` returns a new object with substituted `includedLemmas`, leaving the original unchanged
   - Two independent axes: `canActivateRootTopic` (human gate) vs. `canPublishRootIndex` (automated gate)

3. **Navigation-only links:**
   - Topic→root links in `src/lib/morphology/root-links.ts` have `semantics: "navigation-only"`
   - UI text on topic pages explicitly states: "Root-topic links are navigational aids, not scholarly claims that the ayat are thematically about the root"

### Regression Tests

**File:** `src/lib/morphology/sprint-42-separation.test.ts` (12 tests, all passing)

**Five describe blocks:**

1. **Data structure independence (4 tests):**
   - Curated topics are defined in `topics/data.ts`, not derived from roots
   - Root allowlist entries do not contain ayah lists
   - Publishing a root does not mutate `TOPICS` array
   - Root occurrence index does not add ayat to curated topics

2. **Publication policy isolation (2 tests):**
   - `canPublishRootIndex` does not mutate `entry.reviewState`
   - `buildPublishedIndexEntry` creates a new object, does not mutate original

3. **Topic root links are navigation-only (2 tests):**
   - Topic→root links have `semantics='navigation-only'`
   - Topic root links do not assert thematic classification

4. **Occurrence index vs curated topic (2 tests):**
   - `buildRootTopicIndex` filters by `includedLemmas`, not by topic membership
   - Root publication cannot add ayat to curated topics

5. **Type separation (2 tests):**
   - `RootTopicEntry` does not have topic-like fields (`summary`, `related`, `relations`, `provenance`)
   - `Topic` does not have root-index fields (`roots`, `includedLemmas`, `reviewState`)

**Key assertion:** Snapshot `TOPICS` before and after building a root index, assert deep equality.

---

## §4 Publication Policy

### Changes

**Policy version:** 1.0.0 → 1.1.0  
**File:** `src/lib/morphology/publication-policy.ts`

**New fields in `PublicationDecision`:**
```typescript
missingLemmaCount: number;  // Word-level records with no lemma in source
totalWordRecords: number;   // Total word-level records examined
```

**New gate:** After `errorIssues` check, before ambiguity check:
```typescript
if (missingLemmaCount > 0) {
  return {
    ...base,
    decision: "needs-review",
    reasons: [
      `${missingLemmaCount} of ${totalWordRecords} word-level records have no lemma in the source dataset. The displayed index would be incomplete. Do not fabricate or infer missing lemmas.`
    ],
    includedLemmas: []
  };
}
```

**Rationale:** Publication requires zero missing lemmas. When `missingLemmaCount > 0`, the root cannot be published because the displayed index would be incomplete. Missing lemmas must not be fabricated, inferred, or silently dropped.

**Stale-decision fail-closed:** Policy version bump ensures any decision written under v1.0.0 fails the `policyVersion !== PUBLICATION_POLICY_VERSION` check in `canPublishRootIndex`.

### Updated Decisions

All 10 roots re-run through the pipeline with policy v1.1.0:

| Slug       | Root | Decision       | Missing | Total | Notes                          |
|------------|------|----------------|---------|-------|--------------------------------|
| sabr       | صبر  | publish        | 0       | 103   |                                |
| shukr      | شكر  | publish        | 0       | 75    |                                |
| rahmah     | رحم  | needs-review   | 0       | 339   | ambiguity أَرْحَام ×12         |
| ilm        | علم  | needs-review   | 6       | 854   | missing lemmas                 |
| tawbah     | توب  | publish        | 0       | 87    |                                |
| maghfirah  | غفر  | needs-review   | 29      | 234   | missing lemmas                 |
| kibr       | كبر  | needs-review   | 4       | 161   | missing lemmas                 |
| khushu     | خشع  | publish        | 0       | 17    |                                |
| sidq       | صدق  | needs-review   | 0       | 155   | ambiguity صَدَقَة ×5, صَدَقَٰت ×8 |
| tawakkul   | وكل  | needs-review   | 0       | 70    | ambiguity وَكِيل ×24           |

**File:** `data/root-publications.json` (regenerated, policy 1.1.0, all 10 roots carry coverage fields).

---

## §5 Root and Topic UI

### Root Listing Page (`/explore/root`)

**Neutral language confirmed:**
- "A published root opens a neutral index of the verses in which forms of that root occur. It is not a claim that those verses are about a topic."
- "Automated publication means the data passed deterministic checks; it is not a scholarly approval."
- Three distinct states: `published`, `reviewed-unpublished`, `needs-validation`

### Root Detail Page (`/explore/root/[root]`)

**Coverage-gap disclosure added** in `PendingReviewRootView`:
```tsx
{decision.missingLemmaCount > 0 && (
  <div className="rounded-lg border border-amber-300/60 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
    <p className="font-medium text-foreground">Source-data coverage gap</p>
    <p className="mt-1">
      {decision.missingLemmaCount} of {decision.totalWordRecords} word-level records for this root have no lemma in the QUL morphology source. The displayed index would therefore be incomplete. Per Sprint 42 policy, missing lemmas are not fabricated, inferred, or silently dropped. The root stays in needs-review until the source data is complete or a documented policy establishes that the displayed index remains honest with the gap disclosed.
    </p>
    <p className="mt-1 text-[11px]">
      Full per-record evidence: <code className="rounded bg-secondary/60 px-1 py-0.5">data/lemma-recovery-audit.json</code>
    </p>
  </div>
)}
```

### Topic Detail Page (`/topics/[slug]`)

**Already compliant** (verified in Sprint 41):
- "Word-occurrence index for the related Arabic root… not a thematic classification of the ayat"
- "Root-topic links are navigational aids, not scholarly claims that the ayat are thematically about the root."

---

## §6 Batch Automation

**Audit script:** `scripts/audit-missing-lemmas.py`

**Functionality:**
- Loads `lemmas`/`lemma_words` from `word-lemma.db` into a `{word_location: lemma_text}` dict
- Loads `root_words` locations from `word-root.db`
- Classifies every word-level index record whose root is set and lemma empty
- Writes `data/lemma-recovery-audit.json` (deterministic, no timestamps)

**Output:**
- 1,669 audited
- 0 recovered
- 1,669 absent
- Source DB available: true
- Verification method: "Each missing word_location was looked up by exact string in word-lemma.db lemma_words joined to lemmas.text. No inference, root matching, spelling similarity, or context was used."

**Per-root breakdown:** 158 roots with missing lemmas, top 10 by count: كون (353), امن (130), شيا (118), نفس (106), اتي (97), دعو (44), ولي (42), نور (36), سوا (34), خلق (33).

---

## §7 Tests and Gates

### Test Results

```
Test Files  46 passed (46)
Tests       786 passed (786)
Duration    8.82s
```

**New tests:** 12 (in `sprint-42-separation.test.ts`)  
**Total tests:** 786 (up from 774 at Sprint 41 end)

### Quality Gates

| Gate       | Result |
|------------|--------|
| `pnpm lint`    | ✓ pass (0 errors, 0 warnings) |
| `pnpm typecheck` | ✓ pass (0 errors) |
| `pnpm test`    | ✓ pass (786/786) |
| `pnpm build`   | ✓ pass (EXIT=0, 0 prerender errors) |

**Build notes:** First attempt hit the known Windows prerender race (memory: `Windows build prerender race`). Retry with `rm -rf .next` succeeded cleanly. This is a documented environmental issue, not a content error.

---

## §8 Deliverables

### Files Created

1. **`src/lib/morphology/sprint-42-separation.test.ts`** — 12 regression tests proving root publication cannot mutate curated topic membership
2. **`scripts/audit-missing-lemmas.py`** — Full-population per-record verification against source
3. **`data/lemma-recovery-audit.json`** — Machine-readable audit artifact (1,669 records, 0 recovered, 1,669 absent)

### Files Modified

1. **`src/lib/morphology/publication-policy.ts`**
   - Policy version 1.0.0 → 1.1.0
   - Added `missingLemmaCount` and `totalWordRecords` to `PublicationDecision`
   - New explicit gate: `missingLemmaCount > 0` → `needs-review`

2. **`src/app/explore/root/[root]/page.tsx`**
   - Added coverage-gap disclosure panel in `PendingReviewRootView`

3. **`data/root-publications.json`**
   - Regenerated with policy 1.1.0
   - All 10 roots carry `missingLemmaCount` and `totalWordRecords`

### Evidence

- **39 root-scoped missing lemmas** (علم 6, غفر 29, كبر 4), all verified absent from source
- **1,669 total word-level records** across 158 roots with root but no lemma (systemic)
- **0 recovered** — no fabrication, inference, or silent deletion
- **No importer defect** — gap is in source data, not import logic
- **12 separation tests** — root publication cannot mutate curated topics

---

## Remaining Gaps

1. **Systemic missing-lemma gap:** 1,669 word-level records across 158 roots have no lemma. This is a source-data limitation, not a code defect. Resolution requires either:
   - Updated QUL morphology data with complete lemma coverage
   - A documented policy establishing that the displayed index remains honest with the gap disclosed

2. **Roots blocked by missing lemmas:** ilm (علم), maghfirah (غفر), kibr (كبر) cannot be published until the source gap is resolved or a documented policy is established

3. **Roots blocked by ambiguity:** rahmah (أَرْحَام ×12), sidq (صَدَقَة ×5, صَدَقَٰت ×8), tawakkul (وَكِيل ×24) — these are separate from the missing-lemma issue and require human review or documented disambiguation policy

---

## Constraints Preserved

✓ Recover lemmas only from authentic source records that can be traced to the source dataset  
✓ Do not infer a lemma from the root, Arabic spelling, surrounding context, or an AI-generated guess  
✓ Do not create fabricated placeholder lemmas  
✓ Do not silently delete records with missing lemmas  
✓ A shared root, lemma, word form, or occurrence count must never automatically add an ayah to a thematic topic  
✓ Do not derive the existing topic's ayah list from a root index  
✓ Do not replace curated topic membership with root-based membership  
✓ Keep `AI_ANSWER_FEATURE_ENABLED = false`  
✓ Preserve existing curated topics and topic-to-domain relationships  
✓ Keep navigation-only root links explicitly marked as navigation, not classification  
✓ Ensure UI text does not describe root matches as "all verses about [theme]"  
✓ Add regression tests proving that publishing a root cannot change any curated topic's ayah membership  
✓ Do not add a new paid model dependency or expose API secrets without explicit authorization  
✓ Do not begin Sprint 43 or deploy the application

---

## Conclusion

Sprint 42 delivered a complete investigation of missing lemma records, a machine-readable audit artifact, an updated publication policy with an explicit missing-lemma gate, and 12 regression tests proving that root publication cannot mutate curated topic membership. The systemic missing-lemma gap (1,669 records across 158 roots) is a source-data limitation, not a code defect. Three roots (ilm, maghfirah, kibr) remain blocked by this gap; three others (rahmah, sidq, tawakkul) are blocked by ambiguity. All quality gates pass. No deployment was performed. Sprint 43 was not begun.
