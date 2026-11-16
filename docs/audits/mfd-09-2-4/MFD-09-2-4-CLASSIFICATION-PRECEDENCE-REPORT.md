# MFD-09.2.4 — Classification Precedence & Canonical Inventory Audit

**Audit ID:** MFD-09.2.4  
**Auditor:** Specialist Subagent A — Classification Precedence & Canonical Inventory Auditor (`classification-auditor`)  
**Date:** 2026-11-16 (Asia/Karachi)  
**Branch:** `main`  
**HEAD:** `0b83f684fa429d9fc885a70dc0db6dc0a960c56e`

---

## 1. Repository state and immutability evidence

| Item | Value |
|---|---|
| Working directory | `C:\Users\Dawood\dyad-apps\Quran Al Huda` |
| Branch | `main` |
| HEAD | `0b83f684fa429d9fc885a70dc0db6dc0a960c56e` |
| Working tree | 36 pre-existing unrelated deletions of `docs/FAHM-MFD-*` reports; new untracked `docs/audits/mfd-09-2-4/`; nothing else |
| Scope check | `git status --porcelain -- data src public docs/audits/mfd-09-2-3` returned **empty** |

### Production hashes (SHA-256) — verified identical to the MFD-09.2.3 baseline recorded since `d056d83`

| File | SHA-256 | Status |
|---|---|---|
| dimensions.json | `A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA` | unchanged |
| subdimensions.json | `B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6` | unchanged |
| domains.json | `26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610` | unchanged |
| topics.json | `6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9` | unchanged |
| relationships.json | `D545121703FFBC825A6F185052E49DC93BF415D233CC3FC188E355DF60E1B82A` | unchanged |
| topic-ayah-mappings.json | `3CA33A47925E25E1BA282E28D3C3212F9654CE2DC897BA0A4150EB974D2C2CED` | unchanged |

No Quran Arabic text, mapping classification, or scholarly review status was read-modified-written.
No topic was created, renamed, reassigned, or deleted. No phantom reference was auto-resolved.
MFD-10 was not started. Every file created or modified lives under `docs/audits/mfd-09-2-4/`.

---

## 2. Task A.1 — Source inspection and root cause

### Files read completely

| File | Size / structure |
|---|---|
| `docs/audits/mfd-09-2-3/run-inventory.ps1` | 129 lines, PowerShell 5.x style |
| `docs/audits/mfd-09-2-3/mfd-09-2-3-all-topic-references.json` | 5,492 lines; flat array of 549 objects, keys: `dimensionId`, `domainId`, `referencedTopicId`, `topicExists`, `actualParentDimensionId`, `classification`, `evidenceSource`, `evidencePath` |
| `data/taxonomy/dimensions.json` | 1,135 lines; array of **103** dimension objects (`id`, `parentDomainId`, `subdimensionIds[]`, `topicIds[]`) |
| `data/taxonomy/subdimensions.json` | 177 lines; array of **25** subdimension objects (`id`, `parentDimensionId`, `topicIds[]`) |
| `data/taxonomy/domains.json` | 182 lines; array of **20** domain objects (`id`, `dimensionIds[]`) |
| `data/taxonomy/topics.json` | 5,342 lines; array of **184** topic objects (`id`, `parentDomainId`, `parentDimensionId`, `parentSubdimensionId`, `provenance`, `ayahMappings[]`) |

### Exact logic used by the buggy script

The old pipeline iterated `dimensions[].topicIds` and initialised every record to
`classification = 'NONEXISTENT'` (line 46). It then entered a single guard:

```powershell
if ($topicMap.ContainsKey($tid)) {      # line 51  <-- TOPIC EXISTENCE GATE
    ...
    if ($dimMap.ContainsKey($tid)) { ... NAMESPACE_COLLISION_DIMENSION }        # line 58
    elseif ($dim.subdimensionIds -contains $tid) { ... NS_SUBDIMENSION }        # line 62
    else { ...domain scan... WRONG_PARENT... VALID }                            # lines 67-85
}
# else remains NONEXISTENT                                                      # line 87
```

**Root cause:** all three namespace-collision checks are nested *inside* the topic-existence
gate at line 51. Any referenced ID that exists as a dimension / subdimension / domain but is
**absent from `topics.json`** never reaches the collision branches and silently keeps the
initial `NONEXISTENT` value from line 46.

Two secondary defects were also found in the old script:

1. **Subdimension detection was scope-local.** Line 62 tested only `$dim.subdimensionIds`
   (the referencing dimension's own list) instead of the global `subdimensions.json` registry.
2. **Domain detection was inferred, not authoritative.** Lines 69–74 scanned
   `dimensions[].parentDomainId` for a match instead of reading `domains.json`. This can only
   find domains that happen to have dimensions and cannot see the canonical domain registry.

Both are corrected in the new script.

---

## 3. Task A.2 — Corrected classifier

New file: `docs/audits/mfd-09-2-4/classify-references.mjs` (Node.js ESM, no dependencies).

It loads all four canonical registries read-only and builds `Set`/`Map` lookups, then applies
this exact precedence, with **no topic-existence gate ahead of the collision checks**:

| Order | Classification | Condition |
|---|---|---|
| 1 | `NAMESPACE_COLLISION_DIMENSION` | ref ID ∈ `dimensions.json` ids |
| 2 | `NAMESPACE_COLLISION_SUBDIMENSION` | ref ID ∈ `subdimensions.json` ids (global registry) |
| 3 | `NAMESPACE_COLLISION_DOMAIN` | ref ID ∈ `domains.json` ids (authoritative registry) |
| 4 | `NONEXISTENT` | ref ID ∉ `topics.json` **and** not any collision above |
| 5 | `WRONG_PARENT` | topic exists and `parentDimensionId !== referencingDimensionId` |
| 6 | `VALID` | topic exists and `parentDimensionId === referencingDimensionId` |

An ID that exists as a dimension can therefore never be classified `NONEXISTENT`.
The script writes all three artifacts and exits with code `1` if any regression test fails.

---

## 4. Task A.3 — Regression tests (20 assertions, 0 failures)

### The 6 known namespace collisions

| Referenced ID | Referencing dimension | Expected | Result |
|---|---|---|---|
| conflict-resolution | spousal-relations | NS_DIMENSION | PASS |
| business-ethics | trade-commerce | NS_DIMENSION | PASS |
| mizan-balance | environment-balance | NS_DIMENSION | PASS |
| accountability | resurrection-judgment | NS_DIMENSION | PASS |
| quranic-vocabulary | quranic-arabic | NS_DIMENSION | PASS |
| child-education | parenting-child-development | NS_SUBDIMENSION | PASS |

### Edge cases

| Case | Record | Result |
|---|---|---|
| Genuinely nonexistent | `quran-interpretation-principles` @ quran-science → NONEXISTENT | PASS |
| Valid | `tawheed-fundamentals` @ allah-divine-attributes → VALID | PASS |
| Wrong parent | `ikhlas-sincerity` @ moral-virtues → WRONG_PARENT | PASS |
| Wrong parent | `wealth-distribution` @ wealth-property → WRONG_PARENT | PASS |
| Wrong parent | `worker-rights` @ economic-justice → WRONG_PARENT | PASS |
| Wrong parent | `time-management` @ time-seasons → WRONG_PARENT | PASS |
| Wrong parent | `interfaith-marriage` @ people-of-book → WRONG_PARENT | PASS |

### Direct precedence unit assertions on the classifier function

| Assertion | Result |
|---|---|
| `accountability` (absent from topics.json) ≠ NONEXISTENT → NS_DIMENSION | PASS |
| `conflict-resolution` (absent from topics.json) ≠ NONEXISTENT → NS_DIMENSION | PASS |
| `child-education` subdimension collision outranks VALID | PASS |
| `belief-theology` domain ID → NS_DOMAIN | PASS |
| synthetic absent ID → NONEXISTENT | PASS |
| matching parent → VALID | PASS |
| mismatched parent → WRONG_PARENT | PASS |

**Important semantics discovered while building the suite:** classification is a property of the
**(dimensionId, referencedTopicId) pair**, not of the topic ID alone. `wealth-distribution`,
`worker-rights`, `time-management`, and `interfaith-marriage` are each `VALID` under their true
parent dimension and `WRONG_PARENT` only under the other dimension that also lists them.
The first draft of the suite asserted per-ID and produced 4 false failures; the assertions were
corrected to be pair-scoped (`assertPair`). The classifier itself was never wrong — final run:
**20 passed, 0 failed, exit code 0.**

---

## 5. Task A.4 — Recomputed counts vs comparison targets

All 549 references recomputed from canonical source. Targets were used only for comparison,
never hardcoded into the computation.

| Category | Target | Actual | Delta |
|---|---|---|---|
| VALID | 170 | **170** | 0 |
| NONEXISTENT | 368 | **368** | 0 |
| WRONG_PARENT | 5 | **5** | 0 |
| NAMESPACE_COLLISION_DIMENSION | 5 | **5** | 0 |
| NAMESPACE_COLLISION_SUBDIMENSION | 1 | **1** | 0 |
| NAMESPACE_COLLISION_DOMAIN | 0 | **0** | 0 |
| **Total** | **549** | **549** | **0** |

Sum of categories = 549 = total scanned. All targets met exactly.

### Exactly which records changed vs MFD-09.2.3, and why

The MFD-09.2.3 summary reported `NONEXISTENT: 370`, `NS_DIMENSION: 3`. Two records changed;
no others did (reference key sets are byte-for-byte identical, 549 unique keys).

| Dimension | Referenced ID | Old | New | Why |
|---|---|---|---|---|
| resurrection-judgment | accountability | NONEXISTENT | NAMESPACE_COLLISION_DIMENSION | `accountability` is a dimension id (`dimensions.json`, parentDomainId `governance-political-authority`) but has no topic record. The old topic-existence gate hid the collision. |
| spousal-relations | conflict-resolution | NONEXISTENT | NAMESPACE_COLLISION_DIMENSION | `conflict-resolution` is a dimension id (parentDomainId `war-peace-conflict`) but has no topic record. Same gate defect. |

Net effect: `NONEXISTENT 370 → 368`, `NS_DIMENSION 3 → 5`. These two IDs were removed from the
phantom set; nothing was added to it.

The other four collisions were already correct in MFD-09.2.3 because those IDs *do* exist as
topics, so they passed the old gate: `business-ethics`, `mizan-balance`, `quranic-vocabulary`
(NS_DIMENSION) and `child-education` (NS_SUBDIMENSION).

### Independent cross-check

A separate PowerShell reimplementation of the same precedence (independent of the Node script)
recomputed all 549 records: `VALID=170 NONEXISTENT=368 WRONG_PARENT=5 NS_DIM=5 NS_SUB=1 NS_DOM=0`.
Comparison against the generated artifact: **0 mismatches across all 549 records.**

---

## 6. Task A.5 — Regenerated artifacts

| File | Contents |
|---|---|
| `mfd-09-2-4-canonical-reference-inventory.json` | All **549** references with corrected classification, `topicExists`, `actualParentDimensionId`, and evidence pointers |
| `mfd-09-2-4-classification-summary.json` | Category totals, sum check, `phantomCount: 368`, and all 20 regression test results |
| `mfd-09-2-4-dimension-inventory.json` | Per-dimension breakdown for all **103** dimensions |

### Phantom-set purity (verified programmatically)

The phantom set is exactly the 368 records classified `NONEXISTENT`.

| Check | Count |
|---|---|
| Phantom records whose ID exists in dimensions.json | 0 |
| Phantom records whose ID exists in subdimensions.json | 0 |
| Phantom records whose ID exists in domains.json | 0 |
| Phantom records whose ID exists in topics.json | 0 |
| Phantom records with `topicExists = true` | 0 |
| Phantom records with non-null `actualParentDimensionId` | 0 |
| Namespace-collision records inside phantom set | 0 |
| WRONG_PARENT records inside phantom set | 0 |

---

## 7. Task A.6 — Dimension-level reconciliation

103 rows, one per dimension, each reporting `dimensionId`, `domainId`, `totalRefs`,
`validCount`, `nonexistentCount`, `wrongParentCount`, `nsCollisionCount`.

| Reconciliation check | Result |
|---|---|
| Rows in dimension inventory | 103 (= dimensions.json count) |
| Σ totalRefs | **549** = global total |
| Σ validCount | 170 |
| Σ nonexistentCount | 368 |
| Σ wrongParentCount | 5 |
| Σ nsCollisionCount | 6 |
| Per-dimension internal sum mismatches (`valid+nonexistent+wrongParent+ns != totalRefs`) | **0** |
| Dimensions with zero references | 0 |
| Distinct dimensions represented in inventory | 103 |
| Distinct domains represented | 20 |

### Dimensions carrying non-VALID classifications of interest

| dimensionId | domainId | totalRefs | valid | nonexistent | wrongParent | nsCollision |
|---|---|---|---|---|---|---|
| spousal-relations | family-relationships | 6 | 3 | 2 | 0 | 1 |
| parenting-child-development | family-relationships | 7 | 2 | 4 | 0 | 1 |
| trade-commerce | economic-conduct | 7 | 0 | 6 | 0 | 1 |
| environment-balance | creation-signs | 5 | 0 | 4 | 0 | 1 |
| resurrection-judgment | eschatology-afterlife | 5 | 2 | 2 | 0 | 1 |
| quranic-arabic | language-vocabulary | 5 | 0 | 4 | 0 | 1 |
| moral-virtues | ethics-character | 7 | 4 | 2 | 1 | 0 |
| wealth-property | economic-conduct | 5 | 1 | 3 | 1 | 0 |
| economic-justice | economic-conduct | 5 | 1 | 3 | 1 | 0 |
| time-seasons | creation-signs | 5 | 0 | 4 | 1 | 0 |
| people-of-book | interfaith-communities | 5 | 0 | 4 | 1 | 0 |

The full 103-row table is in `mfd-09-2-4-dimension-inventory.json`.

### WRONG_PARENT detail (all 5)

| Referencing dimension | Referenced topic | Actual parent dimension |
|---|---|---|
| moral-virtues | ikhlas-sincerity | sincerity-ikhlas |
| wealth-property | wealth-distribution | economic-justice |
| economic-justice | worker-rights | labor-rights |
| time-seasons | time-management | personal-development |
| people-of-book | interfaith-marriage | marriage-nikah |

### NAMESPACE_COLLISION detail (all 6)

| Referencing dimension | Referenced ID | Classification | Topic record exists? |
|---|---|---|---|
| spousal-relations | conflict-resolution | NS_DIMENSION | no |
| resurrection-judgment | accountability | NS_DIMENSION | no |
| trade-commerce | business-ethics | NS_DIMENSION | yes |
| environment-balance | mizan-balance | NS_DIMENSION | yes |
| quranic-arabic | quranic-vocabulary | NS_DIMENSION | yes |
| parenting-child-development | child-education | NS_SUBDIMENSION | yes |

`NS_DOMAIN = 0`: no `dimensions[].topicIds` entry matches any of the 20 domain IDs.

---

## 8. Additional observations (informational, no action taken)

- 549 references resolve to **538 distinct referenced IDs**; 11 IDs are referenced by more than
  one dimension. All 549 `(dimensionId, referencedTopicId)` pairs are unique.
- **9 topics in `topics.json` are never referenced by any `dimensions[].topicIds`**:
  `balance-moderation`, `trust-responsibility`, `signs-and-reflection`, `gratitude-ingratitude`,
  `trial-and-test`, `justice-oppression`, `remembrance-forgetfulness`, `patience-haste`,
  `knowledge-ignorance`. This is the reverse direction of the phantom problem (orphan topics,
  not phantom references) and is out of scope for MFD-09.2.4; flagged for the lead only.
- `topics.json` contains mojibake in many `urduTitle` / `arabicTitle` strings (double-encoded
  UTF-8). This is pre-existing production data, was **not** touched, and does not affect ID-based
  classification.

---

## 9. Deliverables

| Path | Bytes | SHA-256 (final verified run) |
|---|---|---|
| `docs/audits/mfd-09-2-4/classify-references.mjs` | 11,101 | `9AB10EB4E6637BA9CA3856220925D97032B95530F000038EF6E7C000842C03D7` |
| `docs/audits/mfd-09-2-4/mfd-09-2-4-canonical-reference-inventory.json` | 195,928 | `442B5E8185BFA73AA2C87D331EA94E061D1720BC00FC1D2985003997688F2868` |
| `docs/audits/mfd-09-2-4/mfd-09-2-4-classification-summary.json` | 3,786 | `F53F832FCB3EFC485E19172F43E29C30FE5A957E2DB2E2381EC77F753BD3C014` |
| `docs/audits/mfd-09-2-4/mfd-09-2-4-dimension-inventory.json` | 21,470 | `F62FDEAC250CE198CA6BAEB031D560A6C227DAF51793D649C3DA0EC1A93E1002` |

The summary hash above corresponds to the final run at `generatedAt = 2026-11-16T11:2xZ`
(UTC; 16:2x Asia/Karachi). Re-running regenerates only that timestamp field.

Reproduce with:

```powershell
node docs/audits/mfd-09-2-4/classify-references.mjs
```

Expected: 549 total, 170 / 368 / 5 / 5 / 1 / 0, dimension sum 549, 20 tests passed, exit code 0.
The inventory and dimension-inventory JSON are deterministic; only the summary's `generatedAt`
varies between runs.
