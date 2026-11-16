# MFD-09.2.1 — Final Reconciliation Report

| Field | Value |
|---|---|
| **Audit ID** | MFD-09.2.1 |
| **Starting commit** | `a68cf79b88efc6cc625f3ca138b22906b1949e99` (branch `main`) |
| **Ending commit** | `5bce7e2dfbecbab15e4158b339d66736f578217a` (pushed to `origin/main`; ahead/behind = 0/0) |
| **Working-tree status** | 36 pre-existing unrelated `docs/FAHM-MFD-*` deletions preserved untouched; only audit-scope files added |
| **Subagents used** | exactly 2 — `validator-auditor`, `report-auditor`; Lead Orchestrator = `lead` |
| **Files inspected** | 6 production taxonomy JSON, 3 audit JSON, 4 MFD-09.2 Markdown reports, `package.json`, `scripts/validate-mfd-09-2.mjs`, `scripts/validate-all.mjs`, `src/lib/ai/feature-flag.ts` |
| **Files created** | 10 deliverables in `docs/audits/mfd-09-2-1/` + `scripts/generate-mfd-09-2-1-reports.mjs` + `scripts/validate-mfd-09-2-1.mjs` |
| **Files modified** | none outside audit scope; historical MFD-09.2 reports preserved verbatim |
| **Production data modification** | NONE — all six SHA-256 hashes unchanged |
| **Validator result** | MFD-09.2: 39/39 PASS, exit 0 · MFD-09.2.1: 80/80 PASS, exit 0 · existing suite: 5/5 PASS, exit 0 |
| **Report generator result** | CREATED and PROVEN deterministic — two runs byte-identical by SHA-256 |
| **Final acceptance status** | **TECHNICALLY ACCEPTED** |

---

## 1. Executive findings

### 1.1 The validator contradiction is resolved — Outcome A, no defect

`node scripts/validate-mfd-09-2.mjs` was executed twice by the Lead Orchestrator. Both runs printed **39 ✓ marks, 0 ✗ marks, "Results: 39 passed, 0 failed"**, exit code **0**. The claim is reproduced, not assumed.

The `validationPassed: false` at line 135 of `data/audit/mfd-09-2-taxonomy-integrity.json` is **not read by that validator**. It is upstream metadata recording that known data-integrity issues exist (370 phantom references, bidirectional asymmetry, 7 cross-report inconsistencies). Checks #38 and #39 assert those issues are *documented* (arrays non-empty), not absent.

Both statements are true in their own scopes:

| Statement | Scope | Truth |
|---|---|---|
| `validationPassed: false` | Upstream taxonomy audit: known integrity issues exist in the data | TRUE |
| Validator 39/39 passed | MFD-09.2 structural checks + issue documentation | TRUE |

No production data was altered to force a pass. No failed check was relabelled.

### 1.2 CRITICAL SELF-CORRECTION — the earlier MFD-09.2.1 count finding was WRONG and is formally retracted

Earlier rounds of this audit reported that MFD-09.2's multi-topic figures were "materially incorrect" and asserted replacement values of **149/370/1** (Lead) and **138/337/0** (Subagent 2).

**Both were methodology defects. Both are retracted.** Full range expansion over the canonical file reproduces MFD-09.2 exactly:

| Metric | MFD-09.2 claimed | Recomputed (canonical method) | Agreement |
|---|---|---|---|
| Mapping records | 789 | 789 | MATCH |
| Expanded ayah occurrences | 1,886 | 1,886 | MATCH |
| Unique Surah:Ayah | 1,550 | 1,550 | MATCH |
| Multi-topic ayat (distinct topics) | 230 | 230 | MATCH |
| Multi-topic ayat (raw occurrence basis) | 236 | 236 | MATCH |
| Ayat with 3+ topics | 74 | 74 | MATCH |
| Maximum overlap | 6 | 6 | MATCH |
| Duplicate topic assignments | 7 | 7 | MATCH |

All seven duplicate ayat named by MFD-09.2 exist exactly as described: `2:184`, `17:23`, `22:27`, `22:28`, `22:29`, `22:33`, `22:34`.

The mapping file hash is identical to the MFD-09.2 baseline, and `git diff --stat d056d83 HEAD -- data/taxonomy` returns empty. **There was never any data drift.** The error was entirely in the verification code written during this audit.

### 1.3 What MFD-09.2 genuinely got wrong

Three real defects survive scrutiny:

1. **Invalid arithmetic.** The report states `236 - 7 = 230`. That equals 229. The operands describe different sets (section 5).
2. **Artifact count.** Section 15 says "6 new files" while listing 4 Markdown + 2 JSON + 1 MJS = **7**.
3. **Unsupported determinism claim.** Acceptance criterion "Report generation is deterministic (validator with 39 checks)" conflated a validator with a generator. No generator existed. That criterion was **not met** when asserted.

All three are now documented, and (3) has been remedied by building an actual generator.

---

## 2. Validator check register summary

Full 39-row register with input files, expected conditions, severities and evidence: [MFD-09-2-1-VALIDATOR-INTEGRITY-REPORT.md](./MFD-09-2-1-VALIDATOR-INTEGRITY-REPORT.md) and [mfd-09-2-1-validator-results.json](./mfd-09-2-1-validator-results.json).

| Group | Checks | Result |
|---|---|---|
| Mapping validation | 19 | 19 PASS |
| Taxonomy validation | 18 | 18 PASS |
| Production protection (documentation assertions) | 2 | 2 PASS |
| **Total** | **39** | **39 PASS, 0 FAIL, 0 SKIPPED** |

Pass/fail mechanics verified by reading the source: `check()` increments `passed` or `failed`; `process.exit(1)` when `failed > 0`. The validator reads canonical production files directly and recomputes values independently — it does not trust stale copies.

**Limitation disclosed:** checks #38/#39 are documentation-presence assertions, weaker than the other 37. They pass when issues are recorded, which is why they cannot detect unresolved phantoms. This is a scope limitation, not a bug.

### New MFD-09.2.1 validator

`scripts/validate-mfd-09-2-1.mjs` — **80 checks across 8 groups**, all PASS, exit 0. Warnings are counted separately and never as passes.

| Group | IDs | Count |
|---|---|---|
| Mapping integrity | M01–M15 | 15 |
| Evidence & scholarly status | E01–E08 | 8 |
| Taxonomy integrity | T01–T15 | 15 |
| Phantom references | P01–P09 | 9 |
| Relationships & proposals | R01–R04, Q01–Q07 | 11 |
| Report-to-JSON agreement | D01–D08 | 8 |
| Deterministic generation | G01–G04 | 4 |
| Production protection | X01–X10 | 10 |

---

## 3. Root-cause analysis

### 3.1 Why three different wrong answers appeared

The canonical rule is: **expand every mapping range to individual ayat**, identity `surahNumber:ayah`.

| Method | Grouping key | Keys | Multi | Raw | Dup excess | Verdict |
|---|---|---|---|---|---|---|
| Canonical range expansion | every ayah in `[start, end]` | 1550 | 230 | 236 | 7 | CORRECT |
| Start-key only (Lead, early rounds) | `surahNumber:ayahStart` | 568 | 149 | 370 | 1 | DEFECTIVE |
| Range-key grouping (Subagent 2) | `surahNumber:ayahStart-ayahEnd` | 590 | 138 | 337 | 0 | DEFECTIVE |

Start-key grouping ignores `ayahEnd`, so an ayah covered by a range beginning elsewhere is never counted. Range-key grouping treats each distinct range as a unit instead of expanding it. Neither reflects the data.

A further earlier defect used the field name `surahId`, which does not exist (the field is `surahNumber`), collapsing all 789 records into `NULL:*` keys. That produced 130/727/19 and was discarded before any conclusion was drawn.

**Lesson recorded:** the Lead Orchestrator's independent verification requirement caught its own error and both subagents' errors. Independent recomputation from canonical files — not agreement between agents — is what established truth.

### 3.2 Generator self-reference cycle (found and fixed)

Validator check `G03` initially **FAILED**: regenerating changed `mfd-09-2-1-artifact-inventory.json` and its Markdown. Cause: the inventory hashed the generator and validator scripts, which are *inputs* to the pipeline. Editing a script changed the artifact recording its hash — a self-reference cycle.

Fix: script hashes moved out of generated output into [MFD-09-2-1-BASELINE.md](./MFD-09-2-1-BASELINE.md) section 4. `G03` then passed. The failure and its remedy are preserved here rather than hidden.

### 3.3 Phantom classification replaced heuristic with evidence

Subagent 2 classified phantoms by **substring similarity** (`NAMESPACE_COLLISION` for merely similar strings). That is a guess. The regenerated dataset classifies only what can be proven from canonical files: resolves in another namespace, or does not exist. Similarity scoring removed.

Also corrected: 6 references resolve to **real** topics whose `parentDimensionId` points elsewhere. These are **not phantoms** and are now listed separately as `wrongParentReferences`. Counting them as phantoms had inflated the total to 376; the correct phantom count is **370**.

---

## 4. Report and artifact reconciliation

| Item | Finding |
|---|---|
| File inventory | All 7 MFD-09.2 artifacts exist and are git-tracked; sizes and SHA-256 recorded |
| "6 new files" vs 7 listed | Correct count is **7**; contradiction documented, historical report unchanged |
| Deterministic generation (MFD-09.2) | **NOT DEMONSTRATED** — no generator existed; claim unsupported when made |
| Deterministic generation (MFD-09.2.1) | **DEMONSTRATED** — generator created, two runs byte-identical |
| Starting-commit "mismatch" | Not a defect: `d056d83` → `a68cf79` is predecessor → successor; zero taxonomy diff |
| Count claims in MFD-09.2 | **CORRECT** — earlier MFD-09.2.1 challenge retracted |
| Arithmetic `236-7=230` | **INVALID** — corrected in section 5 |
| Historical reports | Preserved verbatim; all corrections live only in MFD-09.2.1 |

Details: [MFD-09-2-1-REPORT-ARTIFACT-INTEGRITY-REPORT.md](./MFD-09-2-1-REPORT-ARTIFACT-INTEGRITY-REPORT.md), [mfd-09-2-1-artifact-inventory.json](./mfd-09-2-1-artifact-inventory.json).

---

## 5. The 230 / 236 / 7 arithmetic

```
distinct-topic multi-topic ayat                  = 230
ayat whose ONLY topic is duplicated (not multi)  =   6
                                                   ---
raw occurrence-based multi-topic ayat            = 236

total ayat carrying a repeated topicId           =   7
  already inside the 230 set (17:23, 3 topics)   =   1
  outside the 230 set (single-topic ayat)        =   6
```

**`230 + 6 = 236`.** The historical `236 - 7 = 230` is invalid twice over: it equals 229, and 7 counts *duplicate-bearing ayat* while only 6 of them lie outside the 230 set.

| Ayah | Repeated topic | Occurrences | Excess | Distinct topics | Inside 230? |
|---|---|---|---|---|---|
| 2:184 | `ramadan-fasting` | 2 | 1 | 1 | NO |
| 17:23 | `elderly-care` | 2 | 1 | 3 | YES |
| 22:27 | `hajj-rites` | 2 | 1 | 1 | NO |
| 22:28 | `hajj-rites` | 2 | 1 | 1 | NO |
| 22:29 | `hajj-rites` | 2 | 1 | 1 | NO |
| 22:33 | `hajj-rites` | 2 | 1 | 1 | NO |
| 22:34 | `hajj-rites` | 2 | 1 | 1 | NO |

Row-level dataset: all **1,550** per-ayah rows plus the **230**-row multi-topic subset in [mfd-09-2-1-count-reconciliation.json](./mfd-09-2-1-count-reconciliation.json). Narrative: [MFD-09-2-1-COUNT-RECONCILIATION.md](./MFD-09-2-1-COUNT-RECONCILIATION.md).

---

## 6. Phantom-reference classification

| Metric | Value |
|---|---|
| Dimension-side topic references (103 dimensions) | 549 |
| Phantom references (no matching topic record) | **370** |
| Historical MFD-09.2 claim | 370 — CONFIRMED |
| Duplicate references within one dimension array | 0 |
| Existing topics under a different parent (NOT phantoms) | 6 |
| UNRESOLVED | 0 |

Every one of the 370 is absent from `topics.json`, absent from `subdimensions.json`, `dimensions.json` and `domains.json`, and well-formed. All are classified `NONEXISTENT_TOPIC_ID` — planned references never implemented. Each carries per-reference evidence and `requiresHumanReview: true`.

Nothing was deleted, renamed, reassigned, or created. Dataset: [mfd-09-2-1-phantom-reference-reconciliation.json](./mfd-09-2-1-phantom-reference-reconciliation.json).

### Coverage distributions (never combined)

| Bucket | Topic-side (actual) | Dimension-side (declared) |
|---|---|---|
| ZERO_TOPICS | 31 | 0 |
| ONE_TOPIC | 26 | 0 |
| TWO_TOPICS | 21 | 0 |
| THREE_TO_FOUR_TOPICS | 14 | 9 |
| FIVE_OR_MORE_TOPICS | 11 | 94 |
| **Total** | **103** | **103** |

---

## 7. Reproducibility evidence

### Commands actually executed

| Command | Exit | Result |
|---|---|---|
| `node scripts/validate-mfd-09-2.mjs` | 0 | 39 passed, 0 failed (run twice; 39 ✓ / 0 ✗ counted) |
| `node scripts/generate-mfd-09-2-1-reports.mjs` | 0 | 8 artifacts emitted |
| `node scripts/validate-mfd-09-2-1.mjs` | 0 | 80 checks, 80 PASS, 0 FAIL, 0 WARNING |
| `node scripts/validate-all.mjs` | 0 | 5 passed, 0 failed |
| `git diff --stat d056d83 HEAD -- data/taxonomy` | 0 | empty — no production change |

TypeScript check and application build were **not executed** and no success is claimed for them.

### Determinism proof — two runs, SHA-256 compared

| Generated file | Bytes | SHA-256 |
|---|---|---|
| `mfd-09-2-1-count-reconciliation.json` | 491139 | `730095F9475F6BD8287838E0657A59174FA18D94A2CB73315EADA951413B8506` |
| `mfd-09-2-1-phantom-reference-reconciliation.json` | 150307 | `806B45F5B9BE0B8C126D446A69E3D6A5C5D665E0BE0BFA9F3C11D9A77FB8CE1D` |
| `mfd-09-2-1-taxonomy-integrity.json` | 60016 | `8EE83E41A04F0000A787B4EB43F8925540ACF958684EAEA03CEF9F81F72B8ADC` |
| `mfd-09-2-1-artifact-inventory.json` | 3661 | `3AB322CFF6627A4021D85AFA78A01FF1F2CE3CE924DF5552ACB943AB4A2E94CA` |
| `mfd-09-2-1-mapping-integrity.json` | 1841 | `ECE5CEC00C05F8FF085156D55034D15A87026024B8C787F1A253312160888BD2` |
| `MFD-09-2-1-COUNT-RECONCILIATION.md` | 3280 | `B5D0BCA181040A5743FE9ECAF7D561FE8B99891FA4F4B6079D7FDCD08C2D1A70` |
| `MFD-09-2-1-PHANTOM-REFERENCE-REPORT.md` | 2483 | `872096A1CC9F7E08F2D0E07605BDA29A45A37EA0E303980C81C20C75661D24FC` |
| `MFD-09-2-1-REPORT-ARTIFACT-INTEGRITY-REPORT.md` | 4120 | `38601C99A4439B409BF589C5DEA626218BC28C2E5909CFB465BC323B837E256B` |

Two consecutive runs separated by a delay produced **identical hashes for every file**. Check `G03` re-verifies this on every validator run by regenerating and comparing. No timestamps appear in generated output (`G04`). Ordering uses locale-independent comparators and recursive key sorting.

### Production hashes — unchanged

| File | SHA-256 |
|---|---|
| `domains.json` | `26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610` |
| `dimensions.json` | `A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA` |
| `subdimensions.json` | `B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6` |
| `topics.json` | `6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9` |
| `relationships.json` | `D545121703FFBC825A6F185052E49DC93BF415D233CC3FC188E355DF60E1B82A` |
| `topic-ayah-mappings.json` | `3CA33A47925E25E1BA282E28D3C3212F9654CE2DC897BA0A4150EB974D2C2CED` |

`git diff --name-only HEAD -- data/taxonomy src` → empty. `AI_ANSWER_FEATURE_ENABLED = false as const` confirmed in source.

### Scholarly integrity

All 789 mappings: `provenance = pending-scholarly-review`, `status = MAPPED`, `sourceIds = quran-json` only. Tafsir attached **0**, Tafsir verified **0**, scholar reviewed **0**. No mapping carries a stored `auditVerdict`/`verdict` field — the 661/128 split is **derived** from `mappingType` (468 + 115 + 78 = 661 direct; 128 thematic) and is disclosed as a technical derivation, never as scholarly approval. Relationship semantic and scholarly validity are explicitly `NOT_ASSESSED_BY_AUTOMATION`.

---

## 8. Remaining open items (human decisions, not technical failures)

1. **370 phantom references** — create the missing topics or remove the references. Requires editorial/scholarly decision.
2. **31 zero-topic dimensions** — populate, merge, or retire.
3. **6 wrong-parent references** — reconcile `dimensions.json` against `topics.json`.
4. **7 duplicate topic assignments** — deduplicate or document as intentional.
5. **Counting methodology** — adopt 230 (distinct-topic) as canonical with 236 (raw occurrence) as supplementary, and correct the invalid subtraction in the historical report.
6. **Tafsir evidence** — 0 of 789 mappings; 4 registered sources unused.
7. **Scholarly review** — all 789 mappings pending qualified human review.
8. **60 topic proposals** — all `ACCEPT_FOR_FUTURE_REVIEW` / `PENDING`; triage is not approval.
9. **Historical report hygiene** — MFD-09.2's "6 files" and determinism claims remain uncorrected in the preserved original by design; corrections live here.

None of these blocks technical acceptance of MFD-09.2.1. All are carried forward as explicit human work.

---

## 9. Exact Git status

| Item | Value |
|---|---|
| Branch | `main` |
| Starting commit | `a68cf79b88efc6cc625f3ca138b22906b1949e99` |
| Ending commit | `5bce7e2dfbecbab15e4158b339d66736f578217a` |
| Commit contents | 14 files changed, 30,705 insertions(+), 0 deletions |
| Push verification | `git rev-parse origin/main` == local HEAD; `git rev-list --left-right --count origin/main...HEAD` → `0	0` |
| Production staged check | `git diff --cached --name-only -- data/taxonomy src` → empty before commit |
| Added | `docs/audits/mfd-09-2-1/` (10 deliverables + 2 extra generated JSON), `scripts/generate-mfd-09-2-1-reports.mjs`, `scripts/validate-mfd-09-2-1.mjs` |
| Modified | none outside audit scope |
| Preserved untouched | 36 pre-existing `docs/FAHM-MFD-*` deletions (unrelated, not staged) |
| Removed | 3 temporary verification scripts created during this audit (`scripts/tmp-mfd-09-2-1-*.mjs`) |
| Production diff | empty |

---

## 10. Final decision and recommended next action

### **TECHNICALLY ACCEPTED**

Every acceptance condition is satisfied by reproducible evidence:

- Validator contradiction resolved through executed commands and source inspection — Outcome A.
- 39-check claim **reproduced**, not withdrawn: 39 ✓, 0 ✗, exit 0, twice.
- No critical failure hidden: the `G03` determinism failure and all three defective counting methods are documented in full.
- Deterministic generation **demonstrated** by byte-identical SHA-256 across two runs, re-checked on every validator run.
- File inventory accurate; the 6-vs-7 contradiction resolved.
- 230/236/7 reconciled with exact set arithmetic and a 1,550-row dataset.
- 370 references classified with per-reference evidence; **0 UNRESOLVED**.
- All audit artifacts agree with canonical source data (80/80 checks).
- Production data and scholarly review states unchanged (hashes + git diff).
- Git status reported accurately.

The audit's own earlier false alarm is retracted on the record. MFD-09.2's counts were right; its arithmetic, file count, and determinism claim were not.

### Recommended next action

Correct the three genuine MFD-09.2 defects in a future editorial pass (arithmetic, file count, determinism wording), then begin the human taxonomy and scholarly work in section 8. **Do not start MFD-10 automatically.**
