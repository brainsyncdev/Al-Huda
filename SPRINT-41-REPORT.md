# Sprint 41 — Automated AI Root Review & Publishing Pipeline

**Date:** 2026-10-26
**Status:** Complete — all gates pass
**Pipeline version:** 1.0.0
**Policy version:** 1.0.0

## Summary

Sprint 41 transforms the manual root-by-root review workflow into a scalable, evidence-driven pipeline. The pipeline processes candidate roots in batches, proposes lemma inclusion via a deterministic fallback, validates every recommendation against the source data, records provenance, and auto-publishes only the roots that satisfy explicit publication policies.

**Result:** 4 of 10 candidate roots published; 6 withheld pending resolution of documented ambiguity or missing source data. No scholarly approvals were fabricated. No Quran text was modified.

## Architecture

### Modules

| Module | Purpose |
|--------|---------|
| `src/lib/morphology/review-pipeline.ts` | Core batch pipeline: extraction, validation, statistics, AI review, publication decision. Deterministic and idempotent. |
| `src/lib/morphology/ai-lemma-reviewer.ts` | Provider-independent interface + deterministic fallback. Validates structural integrity; recommends full lemma set for neutral root-index framing. |
| `src/lib/morphology/publication-policy.ts` | Deterministic eligibility rules. Checks validation issues, documented ambiguity, incompatible lemmas, and AI review output. |
| `src/lib/morphology/publications.ts` | Server-only loader for `data/root-publications.json`. Validates schema and caches across HMR. |
| `src/lib/morphology/publication-status.ts` | UI gate: bridges automated publication decisions to pages without mutating `reviewState`. |
| `scripts/review-roots.ts` | CLI runner with `--dry-run` and `--json` modes. Refactored to expose `runCli()` for in-process testing. |

### Pipeline stages

1. **Extract** word-level records for each candidate root (ayah-level markers excluded).
2. **Validate** structural integrity: missing tokens (warning), missing lemmas (error), duplicate positions (error), incompatible lemma mappings (error).
3. **Compute statistics**: occurrence count, distinct ayat, lemma distribution, sample ayat.
4. **AI lemma review** (deterministic fallback): if validation passes, recommend the full attested lemma set; otherwise return `selectionRequired: true`.
5. **Publication eligibility**: check validation issues, documented ambiguity, incompatible lemmas, and AI review output.
6. **Generate structured output** with evidence references and provenance.

### Design principles

- **Deterministic:** same input produces byte-identical output. No wall-clock timestamps in committed artifacts.
- **Idempotent:** safe to rerun without duplicate or inconsistent output.
- **Provider-independent:** AI reviewer interface accepts any model provider; no paid API dependency added.
- **Evidence-backed:** every recommendation carries supporting record references.
- **Transparent:** publication decisions are logged with reasons and attributed to `automated-policy`, never a human or scholarly identity.
- **Safe:** dry-run mode shows proposed changes without modifying configuration.

## Source-data reconciliation

The Sprint 39 import report stated 100,263 records. The actual morphology index contains **124,147 records**, broken down as:

| Source | Records | Notes |
|--------|---------|-------|
| `word-root.db` | 50,298 | Word-level records with root |
| `word-lemma.db` (new) | 23,881 | Lemma-only records created when lemma location has no matching root record |
| `word-lemma.db` (merged) | 48,629 | Lemma data merged into existing word-root records |
| `ayah-root.db` | 49,968 | Ayah-level root markers (no word position) |
| **Total** | **124,147** | |
| **Word-level** | **74,179** | 50,298 + 23,881 (records with `wordPosition` defined) |

The discrepancy arose because Sprint 39 omitted the 23,881 lemma-only records. The importer (`scripts/import-morphology.py`) creates these records when a lemma location has no matching root record. They are word-level (have `wordPosition`) but lack a root field. The pipeline filters them out when extracting records for a root, so they do not affect root-level counts.

## Roots processed

| Slug | Root | Occurrences | Ayat | Lemmas | Decision | Reason |
|------|------|-------------|------|--------|----------|--------|
| sabr | صبر | 103 | 93 | 8 | **publish** | Structural validation passed; no ambiguity |
| shukr | شكر | 75 | 69 | 6 | **publish** | Structural validation passed; no ambiguity |
| tawbah | توب | 87 | 69 | 7 | **publish** | Structural validation passed; no ambiguity |
| khushu | خشع | 17 | 16 | 3 | **publish** | Structural validation passed; no ambiguity |
| rahmah | رحم | 339 | 313 | 9 | needs-review | Documented ambiguity: أرحام (12×) means kinship/womb, not mercy |
| ilm | علم | 854 | 728 | 14 | needs-review | 6 records have missing lemmas; documented ambiguity: العالمين (73×) means the worlds, not knowledge |
| maghfirah | غفر | 234 | 202 | 10 | needs-review | 29 records have missing lemmas |
| kibr | كبر | 161 | 153 | 19 | needs-review | 4 records have missing lemmas |
| sidq | صدق | 155 | 144 | 19 | needs-review | Documented ambiguity: صدقة (5×), صدقات (8×) mean charity, not truthfulness |
| tawakkul | وكل | 70 | 61 | 4 | needs-review | Documented ambiguity: وكيل (24×) means guardian/agent, not trust in God |

**Published:** 4 roots (sabr, shukr, tawbah, khushu)
**Needs-review:** 6 roots (rahmah, ilm, maghfirah, kibr, sidq, tawakkul)
**Withheld:** 0 roots

## AI lemma recommendations

The deterministic fallback recommends the **full attested lemma set** for roots that pass structural validation. It does not perform semantic judgment about which lemmas belong to a topic — that requires a model provider or human review.

For the 4 published roots, the pipeline recommended:
- **sabr:** 8 lemmas (اصْطَبِرْ, صَابِر, صَابِرَة, صَابِرُ, صَبَرَ, صَبَّار, صَبْر, صَّٰبِرَٰت)
- **shukr:** 6 lemmas (شَاكِر, شَكَرَ, شَكُور, شُكُور, شُكْر, مَّشْكُور)
- **tawbah:** 7 lemmas (تَابَ, تَوَّاب, تَوْبَة, تَٰٓئِبَٰت, تَّوْب, تَّٰٓئِبُون, مَتَاب)
- **khushu:** 3 lemmas (خَاشِع, خَشَعَتِ, خُشُوع)

For the 6 needs-review roots, the fallback returned `selectionRequired: true` because validation failed (missing lemmas or documented ambiguity). No lemmas were recommended.

## Publication policy

A root is published only when **all** of the following hold:

1. At least one word-level occurrence exists.
2. No error-severity validation issue exists (missing lemma, duplicate position, incompatible lemma mapping).
3. No documented ambiguity lemma is observed for that root.
4. The review recommended the complete validated lemma set (full-set), made no unresolved selection, and every recommended lemma is observed.

Otherwise the root is `needs-review` (evidence ambiguous or incomplete) or `withhold` (the review output contradicts the data).

### Documented ambiguity

The policy encodes known polysemy from `CANDIDATE_ROOTS`:

| Root | Ambiguity lemma | Count | Reason |
|------|-----------------|-------|--------|
| رحم | أَرْحَام | 12 | Means kinship/womb, not mercy |
| علم | عَٰلَمِين | 73 | Means the worlds, not knowledge |
| صدق | صَدَقَة, صَدَقَٰت | 13 | Mean charity, not truthfulness |
| وكل | وَكِيل | 24 | Means guardian/agent, not trust in God |

Observation of any of these lemmas moves the root to `needs-review`. It does not reject the root.

### Incompatible lemma detection

The policy checks whether a lemma's consonantal skeleton can derive from the root using an ordered-subsequence algorithm that ignores weak letters (ا و ي). This catches source mapping errors (e.g., a كان lemma filed under غفر). No incompatible lemmas were found in the 10 candidate roots.

## UI changes

### `/explore/root` listing page

Now presents three distinct states:

- **Published** — a neutral word-occurrence index is available. Either human approval or an automated publication decision.
- **Reviewed, awaiting publication** — the automated review ran and declined to publish (documented ambiguity, incomplete source data, or output that contradicts the data).
- **Needs validation** — no current automated decision exists, or the stored decision predates the current policy version.

Each card shows occurrence count, ayat count, and either lemmas shown (published) or ambiguity flags (not published). Status labels distinguish human-approved from automated-policy.

### `/explore/root/[root]` detail page

Serves automated publications without touching `reviewState`. The `publication-status.ts` gate substitutes `includedLemmas` from the publication decision but leaves `reviewState` untouched, so nothing downstream mistakes this for human approval.

Published pages display a neutral framing: "Verses containing forms associated with this root." Automated publications carry an info box: "Lemma selection produced by automated review (policy 1.0.0) from QUL morphology data. This is not a scholarly approval or a thematic classification."

Pending-review pages show the automated decision reasons when available.

## Tests

**47 new tests** in `src/lib/morphology/sprint-41-review-pipeline.test.ts`:

- Pipeline determinism (6 tests): SHA-256 fingerprint, byte-identical reruns, no wall-clock timestamp, matches committed publication decisions, records pipeline/policy versions.
- Record extraction (1 test): excludes ayah-level markers, sorts by surah/ayah/wordPosition.
- Structural validation (6 tests): missing lemma (error), missing token (warning), duplicate positions (error), incompatible lemma mapping, legitimate weak-letter derivations, normalization.
- Deterministic lemma reviewer (5 tests): recommends full set, refuses on missing lemmas, refuses on duplicate positions, does not claim scholarly authority, model provider throws.
- Publication policy (10 tests): no records → needs-review, full-set agreement → publish, unknown lemma → withhold, full-set mismatch → withhold, empty recommendation → withhold, selectionRequired → needs-review, semantic-subset uncertain → needs-review, documented ambiguity → needs-review, incompatible lemma → needs-review, error validation → needs-review, no fabricated identities.
- Publication status gate (7 tests): accepts current decision, fails closed on missing decision, fails closed on stale policy version, fails closed on slug/root mismatch, fails closed on non-publish decision, substitutes lemmas without touching reviewState, makes published lemmas produce occurrences.
- Real morphology data (7 tests): publishes sabr with full lemma set, keeps ilm in needs-review on ambiguity, keeps roots with missing lemmas out of publication, publishes nothing with ambiguity or incompatible lemmas, recommends only observed lemmas, does not modify source, leaves canonical text untouched.
- Batch review CLI (5 tests): dry-run writes nothing, dry-run does not overwrite existing file, live run writes both outputs, byte-identical on rerun.

**All 774 tests pass** (45 test files).

## Quality gates

| Gate | Result |
|------|--------|
| `pnpm lint` | ✅ Clean (0 errors, 0 warnings) |
| `pnpm typecheck` | ✅ Clean (0 errors) |
| `pnpm test` | ✅ 774 tests passed (45 files) |
| `pnpm build` | ✅ Exit code 0 |

## CLI usage

```bash
# Dry-run: show proposed changes without writing files
npx tsx scripts/review-roots.ts --dry-run

# Live: generate publication decisions
npx tsx scripts/review-roots.ts

# JSON output: full pipeline report
npx tsx scripts/review-roots.ts --json
```

**Output files** (skipped in dry-run):
- `data/root-review-results.json` — per-root review with evidence
- `data/root-publications.json` — publication decisions consumed by the UI

Both files are byte-identical on rerun (deterministic, idempotent).

## Remaining limitations

1. **No semantic-subset model.** The deterministic fallback recommends the full attested lemma set. Roots with documented ambiguity (rahmah, ilm, sidq, tawakkul) cannot be published until a model provider or human reviewer selects a semantic subset. The interface is ready (`reviewLemmasWithModel`), but no provider is wired.

2. **Missing source data.** Three roots (ilm, maghfirah, kibr) have records with missing lemmas. The importer could not find lemma data for these word positions in `word-lemma.db`. Publication is blocked until the source data is complete.

3. **No human review workflow.** The pipeline automates structural validation and neutral root-index publication, but it does not replace human scholarly review. Roots published by the automated policy are framed as "verses containing forms associated with this root," not as topic-scoped selections. Human review is still required for semantic classification.

4. **Policy versioning.** The publication gate fails closed when the stored decision predates the current policy version. This is intentional (a stale decision should not publish under rules it was not checked against), but it means the pipeline must be rerun whenever the policy changes.

5. **No multi-root topics.** The pipeline assumes one root per topic. Root sets (e.g., commerce spanning ب-ي-ع and ت-ج-ر) are not yet supported.

## Product constraints satisfied

✅ Preserve Next.js App Router, TypeScript, and Tailwind.
✅ Keep `AI_ANSWER_FEATURE_ENABLED = false`; root review is a separate data-processing workflow.
✅ Preserve anonymous, local-first behavior.
✅ Do not add analytics, tracking, accounts, or cross-device sync.
✅ Do not modify Quran Arabic text, translations, Tafsir, citations, or attribution.
✅ Never fabricate sources, lemmas, reviewer identities, or scholarly approvals.
✅ Keep the current curated topics and domain mappings intact.
✅ Do not deploy the application.
✅ Do not begin Sprint 42.

## Files changed

**New modules:**
- `src/lib/morphology/review-pipeline.ts` (344 lines)
- `src/lib/morphology/ai-lemma-reviewer.ts` (186 lines)
- `src/lib/morphology/publication-policy.ts` (328 lines)
- `src/lib/morphology/publications.ts` (104 lines)
- `src/lib/morphology/publication-status.ts` (91 lines)
- `scripts/review-roots.ts` (135 lines, refactored to expose `runCli()`)
- `src/lib/morphology/sprint-41-review-pipeline.test.ts` (599 lines, 47 tests)

**Modified:**
- `src/app/explore/root/page.tsx` — three-state UI (published, reviewed-unpublished, needs-validation)
- `src/app/explore/root/[root]/page.tsx` — serves automated publications without touching `reviewState`

**Generated:**
- `data/root-review-results.json` (51 KB, 10 root reviews)
- `data/root-publications.json` (7 KB, 10 publication decisions)

Both generated files are deterministic and idempotent.

## Conclusion

Sprint 41 delivers a scalable, evidence-driven pipeline that processes candidate roots in batches, validates every recommendation against the source data, and auto-publishes only the roots that satisfy explicit publication policies. The pipeline is deterministic, idempotent, and transparent. It does not fabricate scholarly approvals or modify Quran text. Four roots are published; six are withheld pending resolution of documented ambiguity or missing source data. The UI clearly distinguishes published from reviewed-unpublished from needs-validation, and every automated publication is labeled as such.
