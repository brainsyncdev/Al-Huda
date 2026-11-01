# Sprint 43 — Global Morphology Data-Quality Policy & Automated Coverage Audit

**Date:** 2026-10-27  
**Status:** Complete  
**Tests:** 795 passing (47 files)  
**Gates:** lint ✓, typecheck ✓, test ✓, build ✓ (EXIT=0, 0 prerender errors)

---

## Executive Summary

Sprint 43 finalized a deterministic, source-backed global data-quality policy for Al-Huda's Quran morphology and root-occurrence index. The objective was to handle hundreds of roots through one reliable pipeline instead of manually processing every root.

**Key findings:**

- **124,147 total morphology records** (74,179 word-level + 49,968 ayah-level markers)
- **50,298 word-level records with valid root mappings** (67.8% of word-level)
- **72,510 word-level records with lemma mappings** (97.7% of word-level)
- **1,669 word-level records with root but no lemma** (2.3% of word-level, distributed across 158 of 1,642 unique roots)
- **Zero integrity defects:** 0 duplicates, 0 invalid locations, 0 malformed roots
- **Full reconciliation:** per-root totals sum exactly to global totals

**Policy decision:** Policy B (disclosed source coverage) chosen over Policy A (strict completeness). Missing lemmas are disclosed in UI and metadata but do not block publication when occurrence alignment is valid. This allows publication of roots with valid source-backed occurrences while being transparent about lemma-coverage limitations.

**Deliverables:**
1. Versioned global data-quality policy document (`docs/POLICY-DECISION-43.md`)
2. Reproducible automated audit command (`scripts/global-morphology-audit.py`)
3. Machine-readable global and per-root coverage reports (`data/global-morphology-audit.json`)
4. Publication policy v2.0.0 with coverage metadata fields
5. 9 regression tests proving Policy B behavior
6. Updated UI with honest coverage disclosure

---

## §1 Existing System Audit

### Baseline Counts

| Metric | Count | Notes |
|--------|------:|-------|
| Total records | 124,147 | All morphology index entries |
| Word-level records | 74,179 | Have `wordPosition` field |
| Ayah-level markers | 49,968 | Root assignments at ayah granularity, never have lemmas |
| Word-level with root | 50,298 | 67.8% of word-level |
| Word-level without root | 23,881 | 32.2% of word-level |
| Word-level with lemma | 72,510 | 97.7% of word-level |
| Word-level without lemma | 1,669 | 2.3% of word-level |
| Word-level with root + lemma | 48,629 | 65.5% of word-level |
| Word-level with root, no lemma | 1,669 | **The gap under investigation** |

**Critical distinction:** Ayah-level root markers from `ayah-root.db` never have lemma data by design. Including them in word-level missing-lemma statistics would inflate the gap to 1,288+ records. Filtering to `wordPosition !== undefined` yields the true word-level figure: **1,669**.

### Data Quality Checks

| Check | Result |
|-------|--------|
| Duplicate locations (same surah:ayah:wordPosition) | 0 |
| Invalid locations (surah < 1 or > 114, ayah < 1) | 0 |
| Malformed roots (empty or non-Arabic) | 0 |
| Per-root totals reconcile with global totals | ✓ All pass |

**Conclusion:** The morphology index is structurally sound. The 1,669 missing lemmas are a source-data limitation, not a code defect.

---

## §2 Source Coverage Verification

### Available Source Datasets

Six QUL morphology v1 SQLite databases in `data/`:

| Database | Tables | Used by importer? | Contains lemma data? |
|----------|--------|-------------------|----------------------|
| `word-root.db` | roots, root_words | ✓ Yes | No (root mappings only) |
| `word-lemma.db` | lemmas, lemma_words | ✓ Yes | ✓ Yes (72,510 word locations) |
| `ayah-root.db` | ayah_roots | ✓ Yes | No (ayah-level only) |
| `word-stem.db` | stems, stem_words | ✗ No | No (stems ≠ lemmas) |
| `ayah-lemma.db` | lemmas | ✗ No | No (ayah-level only) |
| `ayah-stem.db` | stems | ✗ No | No (ayah-level only) |

### Verification Methodology

For each of the 1,669 word-level records with root but no lemma:

1. Construct the exact `word_location` key (`surah:ayah:word_pos`)
2. Look up that key in `word-lemma.db` (72,510 locations in `lemma_words` joined to `lemmas.text`)
3. Verify the location exists in `word-root.db` (50,298 locations) to confirm the root mapping is authentic
4. Classify as `recovered-from-source`, `absent-from-source`, or `source-db-unavailable`

**Result:** All 1,669 are genuinely absent from `word-lemma.db`. All 1,669 exist in `word-root.db`, so the root mapping is authentic and only the lemma is missing. **Zero recovery possible without fabrication.**

### Missing Lemma Distribution

**Top 20 roots by missing lemmas:**

| Root | Missing | Total word-level | Coverage ratio |
|------|--------:|-----------------:|---------------:|
| كون | 353 | — | — |
| امن | 130 | — | — |
| شيا | 118 | — | — |
| نفس | 106 | — | — |
| اتي | 97 | — | — |
| دعو | 44 | — | — |
| ولي | 42 | — | — |
| نور | 36 | — | — |
| سوا | 34 | — | — |
| خلق | 33 | — | — |
| شرك | 32 | — | — |
| ضلل | 30 | — | — |
| سال | 29 | — | — |
| ذكر | 29 | — | — |
| غفر | 29 | 234 | 87.6% |
| هدي | 27 | — | — |
| رضو | 25 | — | — |
| قلل | 21 | — | — |
| احد | 19 | — | — |
| كفي | 19 | — | — |

**Top 10 surahs by missing lemmas:**

| Surah | Missing |
|-------|--------:|
| 2 (Al-Baqarah) | 177 |
| 4 (An-Nisa) | 156 |
| 6 (Al-An'am) | 97 |
| 7 (Al-A'raf) | 85 |
| 5 (Al-Ma'idah) | 81 |
| 3 (Ali 'Imran) | 72 |
| 9 (At-Tawbah) | 58 |
| 33 (Al-Ahzab) | 53 |
| 17 (Al-Isra) | 53 |
| 10 (Yunus) | 47 |

**Full per-record evidence:** `data/lemma-recovery-audit.json` (audit version 1.0.0, deterministic, no timestamps).

---

## §3 Publication Policy Decision

### Policy A — Strict Completeness

**Rule:** A root index cannot be published if any of its eligible word-level records have missing lemma mappings.

**Implications:**
- Only roots with 100% lemma coverage can be published
- Current data: 4 of 10 configured roots pass (sabr, shukr, tawbah, khushu)
- 6 roots blocked: ilm (6 missing), maghfirah (29), kibr (4), rahmah (0 missing but ambiguity), sidq (0 missing but ambiguity), tawakkul (0 missing but ambiguity)
- Expanding to all 1,642 roots: most would be blocked because 1,669 missing lemmas are distributed across 158 roots

**Advantages:**
- Simplest rule: binary pass/fail
- No risk of presenting incomplete data as complete
- Aligns with Sprint 42's initial gate

**Disadvantages:**
- Blocks most roots from publication indefinitely
- Users cannot explore occurrence data even when root mappings are valid
- Treats missing lemma (a morphological detail) the same as invalid occurrence alignment (a structural defect)
- Does not distinguish between "lemma filtering incomplete" and "occurrence index invalid"

### Policy B — Disclosed Source Coverage

**Rule:** A root occurrence index may be published when its root mappings and occurrence alignment pass deterministic validation, even if some lemma mappings are missing, provided that:
1. All source-backed root occurrences remain available
2. Missing lemma mappings are explicitly counted and disclosed
3. Lemma-based filtering is marked incomplete or restricted appropriately
4. The UI does not claim exhaustive coverage
5. No missing occurrence is silently dropped
6. Invalid or ambiguous occurrence alignment still blocks publication

**Implications:**
- Roots with valid root mappings and alignment can be published
- Missing lemmas are disclosed in UI and metadata
- Lemma-based filtering (e.g., "show only صَبَرَ forms") may be incomplete
- Root occurrence index (e.g., "show all صبر forms") remains complete for source-backed occurrences
- Users see honest disclosure: "X of Y records have lemma data; lemma-based filtering is restricted"

**Advantages:**
- Allows publication of roots with valid occurrence data
- Transparent about limitations
- Distinguishes occurrence validity from lemma coverage
- Users can still explore root occurrences even when lemma filtering is incomplete
- Aligns with Al-Huda's purpose: navigation and discovery, not scholarly claims

**Disadvantages:**
- More complex than Policy A
- Requires explicit UI disclosure and metadata
- Users must understand the distinction between "occurrence index complete" and "lemma filtering incomplete"

### Decision: Policy B

**Rationale:**

1. **Al-Huda's purpose is navigation and discovery, not scholarly classification.** Root occurrence indices are navigational aids, not thematic claims. Users exploring "show all occurrences of صبر" benefit from seeing all source-backed occurrences, even if lemma-based filtering is incomplete.

2. **Missing lemmas are a source-data limitation, not a code defect.** The 1,669 missing lemmas are genuinely absent from QUL morphology v1. Blocking publication indefinitely until the source is updated (which may never happen) prevents users from accessing valid occurrence data.

3. **Honest disclosure is sufficient.** Policy B requires explicit disclosure of missing lemma counts, restricted lemma-based filtering, and no claims of exhaustive coverage. This preserves integrity while allowing useful functionality.

4. **Occurrence validity and lemma coverage are independent dimensions.** A root can have valid occurrence alignment (all root-mapped words are correctly located) but incomplete lemma coverage (some of those words have no lemma in the source). These should be treated separately.

5. **Policy A is overly restrictive.** With 1,669 missing lemmas across 158 roots, Policy A would block most roots from publication. This prevents users from exploring occurrence data for roots like كون (353 missing) or امن (130 missing), even though their root mappings are valid.

**Full decision record:** `docs/POLICY-DECISION-43.md`

---

## §4 Implementation: Coverage Metadata

### Policy Version

**Version:** 2.0.0  
**Supersedes:** 1.1.0 (Sprint 42)

**Change log:**
- 1.0.0 (Sprint 41): Initial automated review pipeline
- 1.1.0 (Sprint 42): Added missing-lemma gate (strict completeness)
- 2.0.0 (Sprint 43): Switched to disclosed coverage policy, separated occurrence validity from lemma coverage

### New Fields in `PublicationDecision`

```typescript
interface PublicationDecision {
  // ... existing fields ...
  
  /** Word-level records with lemma mappings (totalWordRecords - missingLemmaCount). */
  recordsWithLemma: number;
  
  /** Lemma coverage ratio: recordsWithLemma / totalWordRecords. Range [0, 1]. */
  lemmaCoverageRatio: number;
  
  /**
   * Occurrence alignment status: whether root-mapped word occurrences are
   * correctly aligned to valid locations. "valid" means no structural defects;
   * "invalid" means alignment failures that block publication; "unknown" means
   * validation has not run or is stale.
   */
  occurrenceAlignmentStatus: "valid" | "invalid" | "unknown";
  
  /**
   * Human-readable disclosure summary for UI. Explains coverage limitations
   * when lemma coverage < 100%. Empty string when coverage is complete.
   */
  coverageDisclosure: string;
}
```

### Coverage Computation

```typescript
const missingLemmaCount = records.filter((r) => !r.lemma).length;
const totalWordRecords = records.length;
const recordsWithLemma = totalWordRecords - missingLemmaCount;
const lemmaCoverageRatio =
  totalWordRecords > 0 ? recordsWithLemma / totalWordRecords : 0;

// Occurrence alignment status: derived from validation issues.
const errorIssues = validationIssues.filter((i) => i.severity === "error");
const occurrenceAlignmentStatus: "valid" | "invalid" | "unknown" =
  validationIssues.length === 0
    ? "valid"
    : errorIssues.length > 0
      ? "invalid"
      : "valid"; // warnings only don't block

// Coverage disclosure: human-readable summary for UI.
const coverageDisclosure =
  missingLemmaCount > 0
    ? `${missingLemmaCount} of ${totalWordRecords} word-level records have no lemma in the source dataset. Lemma-based filtering is restricted. All source-backed root occurrences are available.`
    : "";
```

### Publication Logic Changes

**Sprint 42 (Policy A):** Missing lemmas blocked publication:
```typescript
if (missingLemmaCount > 0) {
  return {
    ...base,
    decision: "needs-review",
    reasons: [
      `${missingLemmaCount} of ${totalWordRecords} word-level records have no lemma...`
    ],
    includedLemmas: [],
  };
}
```

**Sprint 43 (Policy B):** Missing lemmas are disclosed, not blocking:
```typescript
// Sprint 43 Policy B: missing lemmas are disclosed, not blocking.
// The occurrence index remains valid for source-backed root mappings.
// Lemma-based filtering may be incomplete, which is disclosed in UI.
```

The missing-lemma gate was removed. Publication now proceeds when:
- Occurrence alignment is valid (no error-severity validation issues)
- No documented ambiguity lemmas observed
- No incompatible lemma mappings detected
- AI review recommended lemmas that are all observed in the data

### Updated Publication Decisions

All 10 roots re-run through the pipeline with policy v2.0.0:

| Slug       | Root | Decision       | Missing | Total | Coverage | Notes                          |
|------------|------|----------------|--------:|------:|---------:|--------------------------------|
| sabr       | صبر  | publish        | 0       | 103   | 100%     |                                |
| shukr      | شكر  | publish        | 0       | 75    | 100%     |                                |
| rahmah     | رحم  | needs-review   | 0       | 339   | 100%     | ambiguity أَرْحَام ×12         |
| ilm        | علم  | needs-review   | 6       | 854   | 99.3%    | AI review unresolved           |
| tawbah     | توب  | publish        | 0       | 87    | 100%     |                                |
| maghfirah  | غفر  | needs-review   | 29      | 234   | 87.6%    | AI review unresolved           |
| kibr       | كبر  | needs-review   | 4       | 161   | 97.5%    | AI review unresolved           |
| khushu     | خشع  | publish        | 0       | 17    | 100%     |                                |
| sidq       | صدق  | needs-review   | 0       | 155   | 100%     | ambiguity صَدَقَة ×5, صَدَقَٰت ×8 |
| tawakkul   | وكل  | needs-review   | 0       | 70    | 100%     | ambiguity وَكِيل ×24           |

**Note:** ilm, maghfirah, and kibr remain in needs-review not because of missing lemmas (Policy B allows publication with disclosed coverage), but because the AI review did not resolve lemma selection. This is a separate gate from coverage.

**File:** `data/root-publications.json` (regenerated, policy 2.0.0, all 10 roots carry coverage fields).

---

## §5 Automated Global Audit

### Audit Script

**File:** `scripts/global-morphology-audit.py`

**Functionality:**
- Loads `data/morphology-index.json`
- Separates word-level from ayah-level records
- Checks integrity: duplicates, invalid locations, malformed roots
- Computes per-root coverage statistics (totalWordRecords, recordsWithLemma, missingLemmaCount, lemmaCoverageRatio, uniqueLemmaCount, surahCount)
- Computes missing-lemma distribution by surah
- Verifies reconciliation: sum of per-root totals equals global totals
- Writes `data/global-morphology-audit.json` (deterministic, no timestamps, stable ordering)
- Exits nonzero when integrity checks fail or reconciliation fails

**Output structure:**
```json
{
  "auditVersion": "1.0.0",
  "sourceDataset": "qul-morphology-v1",
  "globalTotals": {
    "totalRecords": 124147,
    "wordLevelRecords": 74179,
    "ayahLevelMarkers": 49968,
    "wordLevelWithRoot": 50298,
    "wordLevelWithoutRoot": 23881,
    "wordLevelWithLemma": 72510,
    "wordLevelWithoutLemma": 1669,
    "wordLevelWithRootAndLemma": 48629,
    "wordLevelWithRootNoLemma": 1669
  },
  "integrityChecks": {
    "duplicateLocations": 0,
    "invalidLocations": 0,
    "malformedRoots": 0,
    "allChecksPass": true
  },
  "reconciliation": {
    "perRootTotalMatchesGlobal": true,
    "perRootWithLemmaMatchesGlobal": true,
    "perRootMissingMatchesGlobal": true
  },
  "perRootCount": 1642,
  "topMissingLemmaRoots": [...],
  "topMissingLemmaSurahs": [...],
  "perRoot": {
    "root1": {
      "totalWordRecords": ...,
      "recordsWithLemma": ...,
      "missingLemmaCount": ...,
      "lemmaCoverageRatio": ...,
      "uniqueLemmaCount": ...,
      "surahCount": ...
    },
    ...
  }
}
```

**Usage:**
```bash
python3 scripts/global-morphology-audit.py
```

**Exit codes:**
- 0: All integrity checks pass, reconciliation succeeds
- 1: Integrity checks failed or reconciliation failed

**Audit results:**
- 1,642 unique roots
- 0 integrity defects
- Full reconciliation: per-root totals match global totals
- Top missing-lemma root: كون (353 missing)
- Top missing-lemma surah: Surah 2 (177 missing)

**File:** `data/global-morphology-audit.json` (generated, deterministic, no timestamps).

---

## §6 Root/Theme Separation

### Invariants Preserved

All Sprint 42 separation invariants remain enforced:

1. **Root occurrence indexing does not modify curated topic ayah membership.**
   - Curated topics (`src/lib/topics/data.ts`) are hardcoded editorial selections
   - Root allowlist entries specify roots and `includedLemmas`, but not ayat
   - Ayahs are derived mechanically from morphology records at query time

2. **Root publication does not activate a topic.**
   - `canPublishRootIndex` checks eligibility but does not mutate `entry.reviewState`
   - `buildPublishedIndexEntry` returns a new object, leaving the original unchanged
   - Two independent axes: `canActivateRootTopic` (human gate) vs. `canPublishRootIndex` (automated gate)

3. **Topic-to-root links remain navigation-only.**
   - Topic→root links in `src/lib/morphology/root-links.ts` have `semantics: "navigation-only"`
   - UI text on topic pages explicitly states: "Root-topic links are navigational aids, not scholarly claims that the ayat are thematically about the root"

4. **A root page describes occurrences associated with that root, not every verse about a theme.**
   - Root detail pages show "Verses containing forms associated with this root"
   - No claims of thematic classification

5. **Morphology coverage is not presented as scholarly approval.**
   - Root listing page: "Automated publication means the data passed deterministic checks; it is not a scholarly approval."
   - Root detail page: "Automated review decision: {decision} (policy {version}). Not a scholarly approval."

### Regression Tests

**File:** `src/lib/morphology/sprint-42-separation.test.ts` (12 tests, all passing)

Five describe blocks:
1. Data structure independence (4 tests)
2. Publication policy isolation (2 tests)
3. Topic root links are navigation-only (2 tests)
4. Occurrence index vs curated topic (2 tests)
5. Type separation (2 tests)

**Key assertion:** Snapshot `TOPICS` before and after building a root index, assert deep equality.

---

## §7 User-Facing Disclosure

### Root Listing Page (`/explore/root`)

**Neutral language confirmed:**
- "A published root opens a neutral index of the verses in which forms of that root occur. It is not a claim that those verses are about a topic."
- "Automated publication means the data passed deterministic checks; it is not a scholarly approval."
- Three distinct states: `published`, `reviewed-unpublished`, `needs-validation`

### Root Detail Page (`/explore/root/[root]`)

**Coverage disclosure updated for Policy B:**

```tsx
{decision.missingLemmaCount > 0 && (
  <div className="rounded-lg border border-amber-300/60 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
    <p className="font-medium text-foreground">
      Lemma coverage: {decision.recordsWithLemma} of{" "}
      {decision.totalWordRecords} ({Math.round(decision.lemmaCoverageRatio * 100)}%)
    </p>
    <p className="mt-1">
      {decision.missingLemmaCount} word-level records for this
      root have no lemma in the QUL morphology source. All
      source-backed root occurrences are available in the
      occurrence index, but lemma-based filtering (e.g., &ldquo;show
      only specific forms&rdquo;) is restricted because some records
      lack lemma mappings. Missing lemmas are not fabricated,
      inferred, or silently dropped.
    </p>
    <p className="mt-1 text-[11px]">
      Full per-record evidence:{" "}
      <code className="rounded bg-secondary/60 px-1 py-0.5">
        data/lemma-recovery-audit.json
      </code>
    </p>
  </div>
)}
```

**Changes from Sprint 42:**
- Sprint 42: "Source-data coverage gap" — framed as a blocking issue
- Sprint 43: "Lemma coverage: X of Y (Z%)" — framed as disclosed metadata
- Sprint 42: "The displayed index would therefore be incomplete. The root stays in needs-review..."
- Sprint 43: "All source-backed root occurrences are available in the occurrence index, but lemma-based filtering is restricted..."

### Topic Detail Page (`/topics/[slug]`)

**Already compliant** (verified in Sprint 41):
- "Word-occurrence index for the related Arabic root… not a thematic classification of the ayat"
- "Root-topic links are navigational aids, not scholarly claims that the ayat are thematically about the root."

---

## §8 Tests and Quality Gates

### Test Results

```
Test Files  47 passed (47)
Tests       795 passed (795)
Duration    11.87s
```

**New tests:** 9 (in `sprint-43-policy-b.test.ts`)  
**Total tests:** 795 (up from 786 at Sprint 42 end)

**New test file:** `src/lib/morphology/sprint-43-policy-b.test.ts`

Nine regression tests in three describe blocks:

1. **Policy B coverage metadata (3 tests):**
   - Computes coverage metadata correctly for complete coverage
   - Computes coverage metadata correctly for incomplete coverage
   - Coverage ratio uses word-level records only (denominator is totalWordRecords)

2. **Policy B publication behavior (3 tests):**
   - Allows publication with missing lemmas when alignment is valid
   - Blocks publication when alignment is invalid (error-severity issues)
   - Allows publication with warnings (non-error issues)

3. **Policy version enforcement (2 tests):**
   - Policy version is 2.0.0
   - Decisions carry the current policy version

4. **Audit reconciliation (1 test):**
   - Global totals reconcile with per-root totals (verified by global audit script)

### Quality Gates

| Gate       | Result |
|------------|--------|
| `pnpm lint`    | ✓ pass (0 errors, 0 warnings) |
| `pnpm typecheck` | ✓ pass (0 errors) |
| `pnpm test`    | ✓ pass (795/795) |
| `pnpm build`   | ✓ pass (EXIT=0, 0 prerender errors) |

**Build notes:** Clean `.next` directory before build to avoid Windows prerender race (documented in project memory). Build succeeded with 0 prerender errors.

---

## §9 Deliverables

### Files Created

1. **`docs/POLICY-DECISION-43.md`** — Policy A vs Policy B comparison and decision rationale
2. **`scripts/global-morphology-audit.py`** — Reproducible automated audit command
3. **`data/global-morphology-audit.json`** — Machine-readable global and per-root coverage report
4. **`src/lib/morphology/sprint-43-policy-b.test.ts`** — 9 regression tests for Policy B behavior

### Files Modified

1. **`src/lib/morphology/publication-policy.ts`**
   - Policy version 1.1.0 → 2.0.0
   - Added `recordsWithLemma`, `lemmaCoverageRatio`, `occurrenceAlignmentStatus`, `coverageDisclosure` to `PublicationDecision`
   - Removed missing-lemma hard block (Policy B: disclosed, not blocking)
   - Coverage metadata computed for all decisions

2. **`src/app/explore/root/[root]/page.tsx`**
   - Updated coverage-gap panel to reflect Policy B disclosure model
   - Shows "Lemma coverage: X of Y (Z%)" instead of "Source-data coverage gap"
   - Explains that lemma-based filtering is restricted but all source-backed occurrences are available

3. **`data/root-publications.json`**
   - Regenerated with policy 2.0.0
   - All 10 roots carry coverage metadata fields

4. **`data/root-review-results.json`**
   - Regenerated with policy 2.0.0

5. **`src/lib/morphology/sprint-42-separation.test.ts`**
   - Updated synthetic `PublicationDecision` fixtures to include new coverage fields

### Evidence

- **124,147 total morphology records** (74,179 word-level + 49,968 ayah-level)
- **1,669 word-level records with root but no lemma** (2.3% of word-level)
- **0 integrity defects** (0 duplicates, 0 invalid locations, 0 malformed roots)
- **Full reconciliation** (per-root totals match global totals)
- **1,642 unique roots** in morphology index
- **Policy v2.0.0** chosen (Policy B — disclosed coverage)
- **9 new regression tests** proving Policy B behavior
- **795 total tests** passing (up from 786)

---

## Remaining Gaps

1. **Systemic missing-lemma gap:** 1,669 word-level records across 158 roots have no lemma. This is a source-data limitation, not a code defect. Resolution requires either:
   - Updated QUL morphology data with complete lemma coverage
   - Acceptance that lemma-based filtering is restricted for these roots

2. **Roots blocked by AI review:** ilm (علم), maghfirah (غفر), kibr (كبر) remain in needs-review because the AI review did not resolve lemma selection. This is separate from the missing-lemma issue. Under Policy B, missing lemmas would not block publication, but the AI review gate still applies.

3. **Roots blocked by ambiguity:** rahmah (أَرْحَام ×12), sidq (صَدَقَة ×5, صَدَقَٰت ×8), tawakkul (وَكِيل ×24) — these require human review or documented disambiguation policy.

4. **Expansion to all 1,642 roots:** The current allowlist has 10 roots. Expanding to all roots would require:
   - Configuring root-topic entries for each root
   - Running the batch review pipeline
   - Human review for roots with ambiguity or AI review issues
   - This is out of scope for Sprint 43 and should be addressed in a future sprint

---

## Constraints Preserved

✓ No fabricated or inferred Quranic lemmas  
✓ No silent deletion of source-backed occurrences  
✓ No conflation of root occurrence indexing with thematic classification  
✓ No fabricated scholarly approval, source provenance, or completeness claims  
✓ Preserve local-first anonymous behavior  
✓ Keep `AI_ANSWER_FEATURE_ENABLED = false`  
✓ Do not change unrelated features, APIs, or data flows  
✓ Do not deploy or start Sprint 44

---

## Conclusion

Sprint 43 delivered a complete global data-quality policy for Al-Huda's morphology and root-occurrence index. The policy (Policy B — disclosed coverage) allows publication of roots with valid occurrence data while being transparent about lemma-coverage limitations. The automated audit script scans all 1,642 roots, verifies integrity, and produces machine-readable coverage reports. Nine regression tests prove Policy B behavior. All quality gates pass (795 tests, lint, typecheck, build). No deployment was performed. Sprint 44 was not begun.

**Key achievement:** The system can now handle hundreds of roots through one reliable pipeline instead of manually processing every root. Missing lemmas are disclosed, not blocking, allowing users to explore valid occurrence data while being honest about source-data limitations.
