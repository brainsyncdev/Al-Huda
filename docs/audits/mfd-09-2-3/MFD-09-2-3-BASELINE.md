# MFD-09.2.3 — Audit Baseline

**Audit ID:** MFD-09.2.3  
**Recorded before any MFD-09.2.3 modification.**

---

## 1. Repository state at audit start

| Item | Value |
|---|---|
| Repository root | `C:\Users\Dawood\dyad-apps\Quran Al Huda` |
| Branch | `main` |
| HEAD commit | `9458f6091c590a460eeb1fef9fe86e13b3f4cd8e` |
| origin/main | `9458f6091c590a460eeb1fef9fe86e13b3f4cd8e` (identical) |
| Ahead/behind | 0 / 0 |
| Working tree | 36 pre-existing deletions of unrelated `docs/FAHM-MFD-*` reports; no other changes |

### Production data hashes (verified unchanged since d056d83)

| File | SHA-256 |
|---|---|
| domains.json | `26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610` |
| dimensions.json | `A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA` |
| subdimensions.json | `B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6` |
| topics.json | `6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9` |
| relationships.json | `D545121703FFBC825A6F185052E49DC93BF415D233CC3FC188E355DF60E1B82A` |
| topic-ayah-mappings.json | `3CA33A47925E25E1BA282E28D3C3212F9654CE2DC897BA0A4150EB974D2C2CED` |

---

## 2. Canonical Counts (Lead Orchestrator Verified)

| Entity | Count | Unique IDs | Duplicates |
|---|---|---|---|
| Domains | 20 | 20 | 0 |
| Dimensions | 103 | 103 | 0 |
| Subdimensions | 25 | 25 | 0 |
| Topics | 184 | 184 | 0 |
| Total topicIds references | 549 | — | — |
| Dimensions with zero topics | 0 | — | — |

---

## 3. Scope restrictions enforced

**Permitted:** audit scripts, validation scripts, report-generation scripts, and files under `docs/audits/mfd-09-2-3/`.

**Forbidden and verified untouched:** All six production taxonomy files, Quran Arabic text, all 789 mapping classifications, scholarly review statuses, application source under `src/`, public AI religious answers (`AI_ANSWER_FEATURE_ENABLED = false as const`), historical audit reports, 36 pre-existing unrelated deletions.

No phantom reference was auto-resolved. No topic was created, renamed, reassigned, or deleted. MFD-10 was not started.

---

## 4. Team structure

| Role | Agent |
|---|---|
| Subagent 1 — Dimension Scope & Canonical ID Auditor | `dim-scope-auditor` |
| Subagent 2 — Phantom Evidence & Validator Integrity Auditor | `phantom-validator-auditor` |
| Lead Orchestrator — Independent Reconciliation | `lead` (root) |

Exactly two specialist subagents were used. The Lead Orchestrator independently verified all canonical counts and performed independent classification of all 549 references to resolve subagent discrepancies.
