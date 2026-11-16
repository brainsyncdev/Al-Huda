# MFD-09.2.1 — Audit Baseline

**Audit ID:** MFD-09.2.1  
**Recorded before any modification.**

---

## 1. Repository state at audit start

| Item | Value |
|---|---|
| Repository root | `C:\Users\Dawood\dyad-apps\Quran Al Huda` |
| Branch | `main` |
| Starting commit | `a68cf79b88efc6cc625f3ca138b22906b1949e99` |
| Prior milestone commit (MFD-09.2 baseline) | `d056d83693a78ca1dc8b2f42ae836ebc32257fe1` |
| Working tree | 36 pre-existing deletions of unrelated `docs/FAHM-MFD-*` reports; no other changes |

The 36 deleted `FAHM-MFD-*` documents were present before this audit began and are **outside MFD-09.2.1 scope**. They were preserved untouched and are not staged or committed by this phase.

### Commit relationship note

MFD-09.2's final report cites starting commit `d056d83`; MFD-09.2.1 starts at `a68cf79`, which is the commit that *delivered* MFD-09.2. This is a normal predecessor/successor relationship, **not** evidence of data drift. Verified directly:

```
git diff --stat d056d83 HEAD -- data/taxonomy
(empty output, exit 0)
```

No production taxonomy file changed between the two commits.

---

## 2. Production data hashes at audit start (SHA-256)

These six files are immutable for this phase.

| File | Bytes | SHA-256 |
|---|---|---|
| `data/taxonomy/domains.json` | 10373 | `26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610` |
| `data/taxonomy/dimensions.json` | 50095 | `A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA` |
| `data/taxonomy/subdimensions.json` | 7247 | `B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6` |
| `data/taxonomy/topics.json` | 257559 | `6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9` |
| `data/taxonomy/relationships.json` | 35562 | `D545121703FFBC825A6F185052E49DC93BF415D233CC3FC188E355DF60E1B82A` |
| `data/taxonomy/topic-ayah-mappings.json` | 369113 | `3CA33A47925E25E1BA282E28D3C3212F9654CE2DC897BA0A4150EB974D2C2CED` |

All six match the hashes recorded in `docs/MFD-09-2-FINAL-RECONCILIATION-REPORT.md` section 2 (16-char prefixes).

---

## 3. Existing MFD-09.2 artifacts inspected

| Path | Bytes | Role |
|---|---|---|
| `docs/MFD-09-2-BASELINE.md` | 1243 | Scope record |
| `docs/MFD-09-2-FINAL-RECONCILIATION-REPORT.md` | 12992 | Final report under audit |
| `docs/MFD-09-2-MAPPING-INTEGRITY-REPORT.md` | 8509 | Mapping findings |
| `docs/MFD-09-2-TAXONOMY-INTEGRITY-REPORT.md` | 13304 | Taxonomy findings |
| `data/audit/mfd-09-2-mapping-integrity.json` | 5738 | Mapping audit dataset |
| `data/audit/mfd-09-2-taxonomy-integrity.json` | 328424 | Taxonomy audit dataset (`validationPassed: false`) |
| `scripts/validate-mfd-09-2.mjs` | 7810 | 39-check validator |

**Seven** artifacts, not the six stated in the MFD-09.2 final report's section 15. The report's own listing enumerates 4 Markdown + 2 JSON + 1 MJS = 7.

### Other canonical inputs read

- `data/audit/mfd-09-1-topic-proposals-classified.json` — 60 proposals
- `package.json` — validation script inventory
- `scripts/validate-all.mjs` — existing 5-validator runner
- `src/lib/ai/feature-flag.ts` — AI safety gate

### Report generator search result

No `generate-mfd-09-2*.mjs` existed at audit start. Only `scripts/generate-mfd-09-1-audit.mjs` (prior milestone) was present. **MFD-09.2's claim that "report generation is deterministic" was unsupported when made** — a validator is not a generator.

---

## 4. Pipeline script hashes (inputs to the pipeline, recorded here to avoid self-reference cycles)

| Script | Bytes | SHA-256 |
|---|---|---|
| `scripts/validate-mfd-09-2.mjs` (unmodified) | 7810 | `0F2ADD6C8D30C5E56A6583C070B9757A2CB065043BB87E5C7EFBE0D7872E2209` |
| `scripts/generate-mfd-09-2-1-reports.mjs` (created) | 42827 | `E0B4E6EBE14CE5BB6172E2AB2E8BCCB8DFF8C639952DA015FE532E10037CC016` |
| `scripts/validate-mfd-09-2-1.mjs` (created) | 19050 | `B99356980F348A3926BDB7A4C79D9C6E57B9935213216576E2F81F080C6181B3` |

These are deliberately excluded from the generated artifact inventory: hashing a generator inside its own output creates a self-reference cycle that breaks byte-identical regeneration. This was discovered and corrected during the audit (validator check `G03` initially failed for exactly this reason).

---

## 5. Scope restrictions enforced

**Permitted:** audit scripts, validation scripts, report-generation scripts, and files under `docs/audits/mfd-09-2-1/`.

**Forbidden and verified untouched:**

- All six production taxonomy files
- Quran Arabic text and translation source content
- All 789 mapping classifications and topic-to-dimension assignments
- Scholarly review statuses (all remain `pending-scholarly-review`)
- Application source under `src/`
- Public AI religious answers (`AI_ANSWER_FEATURE_ENABLED = false as const`)
- Historical MFD-09.2 reports (preserved verbatim; corrections recorded only in MFD-09.2.1)

No phantom reference was auto-resolved. No topic was created, renamed, reassigned, or deleted. No Tafsir evidence was attached. MFD-10 was not started.

---

## 6. Team structure

| Role | Agent |
|---|---|
| Subagent 1 — Validator Integrity Auditor | `validator-auditor` |
| Subagent 2 — Report & Artifact Integrity Auditor | `report-auditor` |
| Lead Orchestrator — Independent Reconciliation | `lead` (root) |

Exactly two specialist subagents were used. Both completed independently. The Lead Orchestrator re-derived every critical figure from canonical files rather than accepting subagent conclusions — which proved necessary, because **both subagents' count findings and the Lead's own first three attempts were wrong** (see the count reconciliation report).
