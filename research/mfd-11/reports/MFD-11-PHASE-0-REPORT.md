# MFD-11 — Phase 0 + Pass A Pilot Report

**Date:** 2026-11-18 (Asia/Karachi)
**Workstream:** MFD-11 — Complete Qur'anic Knowledge Extraction (research-only)
**Baseline gitHead:** `f5ba511b34f7d37b33fb9bdb63937837fe9fbf4c`
**Production data modified:** NO — verified by hash comparison, empty `git diff -- data/ src/`, and 5/5 production validators.

---

## 1. Summary

Phase 0 is complete: the pinned corpus is inventoried, every verse's Arabic text
is SHA-256 hashed verbatim, the production taxonomy is snapshotted read-only,
and the charter, schemas, and validation tooling are in place. The first Pass A
pilot (Sūrah al-Fātiḥah, complete) is authored and mechanically validated
against the corpus. All records are proposals pending human scholarly review.

## 2. Corpus inventory (measured)

| Item | Value |
|---|---|
| Package | `quran-json@3.1.2` (exact pin in `package.json`) |
| License | CC-BY-4.0 |
| Arabic provenance | The Noble Qur'an Encyclopedia (quranenc.com), via quran-json; see `docs/DATA-PROVENANCE.md` |
| Sūrahs | 114 |
| Verses | 6,236 |
| Corpus files hashed | 115 (114 chapter files + `index.json`) |
| Per-verse Arabic hashes | 6,236 (SHA-256, verbatim, no normalization) |

Structural checks enforced by the baseline script: chapter id matches file
number, verse ids are sequential from 1, verse count equals `total_verses`,
no empty Arabic text, no duplicate verse keys, total = 6,236.

Artifact: `research/mfd-11/data/corpus-inventory.json` (per-sūrah metadata,
verse counts, first/last verse keys).

## 3. Immutability baseline and verification (actual output)

```
node scripts/mfd11-phase0-baseline.mjs --verify
MFD-11 immutability verification PASSED
  6236 verse hashes identical
  115 corpus file hashes identical
  6 production/curated file hashes identical
  production counts and distributions identical
VERIFY_EXIT: 0
```

Artifacts:
- `research/mfd-11/data/corpus-hashes.json` — file + per-verse hashes.
- `research/mfd-11/data/production-baseline.json` — read-only production snapshot.

The six guarded production/curated files: `data/taxonomy/domains.json`,
`dimensions.json`, `topics.json`, `topic-ayah-mappings.json`,
`src/lib/topics/data.ts`, `src/lib/explore/dimensions.ts`.

## 4. Production snapshot (measured, read-only)

| Metric | Value |
|---|---|
| Domains | 20 |
| Dimensions (scholarly) | 103 |
| Topics (scholarly) | 184 |
| Topic–āyah mappings | 789 (all ids unique) |
| Expanded āyāt (range expansion) | 1,886 |
| Unique āyah keys mapped | 1,550 |
| Unique mapped topicIds | 176 |
| Mapped topicIds resolved in topics.json | 176 / 176 (0 unresolved) |
| Scholarly topics without any mapping | 8 |
| Curated topics (reader layer) | 18 |
| UI dimensions (Explore) | 15 |

Distributions (unchanged, all pending review):
- mappingType: DIRECT_REFERENCE 468, THEMATIC_REFERENCE 128, EXPLICIT_INSTRUCTION 115, PROPHETIC_NARRATIVE 78
- mapping provenance: `pending-scholarly-review` × 789; status: `MAPPED` × 789
- topic provenance: `pending-scholarly-review` × 184

The 8 scholarly topics with no āyah mappings (from the baseline file):
`covenants-ahd`, `day-of-judgment`, `environmental-corruption`,
`evidence-standards`, `interest-free-finance`, `non-combatant-protection`,
`public-accountability`, `wealth-ownership`.

## 5. Deliverables created (research-only)

| Path | Purpose |
|---|---|
| `research/mfd-11/MFD-11-CHARTER.md` | Objective, immutable rules, phases, governance |
| `research/mfd-11/README.md` | Layout and commands |
| `research/mfd-11/schemas/passage-extraction.schema.json` | Pass A record contract |
| `research/mfd-11/schemas/topic-candidate.schema.json` | Topic candidate contract |
| `research/mfd-11/schemas/evidence-link.schema.json` | Āyah evidence link contract |
| `research/mfd-11/data/corpus-inventory.json` | Corpus inventory |
| `research/mfd-11/data/corpus-hashes.json` | Immutability hashes |
| `research/mfd-11/data/production-baseline.json` | Read-only production snapshot |
| `research/mfd-11/extractions/001-al-fatiha.json` | Pass A pilot extraction |
| `research/mfd-11/candidates/candidates-001.json` | 7 topic candidates from the pilot |
| `scripts/mfd11-phase0-baseline.mjs` | Baseline generator + `--verify` guard |
| `scripts/mfd11-validate-extraction.mjs` | Schema + corpus-grounding validator |
| `scripts/mfd11-dump-passage.mjs` | Verbatim passage read utility |
| `research/mfd-11/corpus-view/.gitignore` | Derived views are regenerable, never committed |

Nothing under `research/` is imported by the application.

## 6. Pass A pilot — Sūrah al-Fātiḥah (1:1–1:7)

One passage record (`ext-001-p1`) covering the complete sūrah. Extracted:
main subject (praise, exclusive worship/dependence, plea for guidance),
7 subordinate subjects, 1 taught supplication (1:6–7), 5 divine-name/attribute
terms, 4 human-condition states, 4 relationship subjects, 10 terminology
entries. Every Arabic excerpt and term was copied from a verbatim read of the
pinned corpus (`node_modules/quran-json/dist/chapters/en/1.json`), never from
memory. No prophetic-narrative or social/economic subject is stated in this
passage, so those arrays are omitted rather than populated by inference.

Deliberate deferrals recorded in the extraction: identification of the groups
in 1:7 is a tafsir question and is not asserted; basmala numbering follows the
pinned corpus (counted as 1:1).

### Topic candidates (all `pending-scholarly-review`)

| Id | Candidate | Existing overlap (relationship) |
|---|---|---|
| cand-0001 | Praise of Allah (Hamd) | scholarly `shukr-gratitude` (related-not-identical); curated `gratitude` (related-not-identical) |
| cand-0002 | Allah's Lordship of the Worlds (Rabb al-'Alamin) | scholarly `tawheed-rububiyyah` (related-not-identical) |
| cand-0003 | Paired names ar-Rahman / ar-Rahim | scholarly `asma-ul-husna` (narrower), `divine-mercy` (related); curated `mercy-and-forgiveness` (related) |
| cand-0004 | Sovereignty of the Day of Recompense | scholarly `day-of-judgment` (related-not-identical); curated `the-hereafter` (narrower) |
| cand-0005 | Exclusive worship and seeking help (1:5) | scholarly `tawheed-uluhiyyah` (related-not-identical); curated `tawheed` (narrower) |
| cand-0006 | Taught supplication for guidance (1:6–7) | curated `supplication` (narrower) |
| cand-0007 | Three groups: favored / anger-earned / astray (1:7) | none recorded — gap candidate; group identification deferred to tafsir review |

### Validation (actual output)

```
node scripts/mfd11-validate-extraction.mjs research/mfd-11/extractions/001-al-fatiha.json research/mfd-11/candidates/candidates-001.json
MFD-11 extraction validation
  files: 2
  extractions: 1, candidates: 7, evidence links: 9
  distinct verse keys referenced: 7
  verbatim excerpts/terms verified against pinned corpus: 32
PASSED — all records schema-valid, corpus-grounded, and pending scholarly review.
VALIDATOR_EXIT: 0
```

The validator enforces: schema shape (no extra fields), every cited key exists
in the corpus, every excerpt/term is a verbatim substring of its cited verse,
verseKeys exactly cover the passage range, overlap topicIds resolve in the
named catalog layer, and provenance is `ai-assisted` +
`pending-scholarly-review` (no auto-approval path exists).

## 7. Governance posture

- Every record: `proposedBy: "ai-assisted"`, `reviewStatus: "pending-scholarly-review"`.
- No record is approved; approval is a human scholarly governance action only.
- Editorial glosses are labelled as such and never presented as tafsir.
- Public AI religious answers remain OFF; NOOR remains deferred.
- Production validators after all Phase 0 work: **5/5 PASSED**
  (Quran Data, Source Licenses, Taxonomy, Ayah Mappings, Root Registry).
- `git diff --stat -- data/ src/` → empty.

## 8. Observations for Phase C (recorded, not acted on)

1. **Stale code comments:** `src/lib/taxonomy/topic-tafsir-data.ts` header says
   "792 mapping records (1,889 expanded ayat)"; measured values are 789 and
   1,886. Comments only — no data defect; left untouched (research workstream
   does not edit production code).
2. **Earlier narrative vs measurement:** earlier session reports cited "368
   NONEXISTENT topic references" from MFD-09.2.4. The Phase 0 measurement of
   `mapping.topicId → topics.json` shows **0 unresolved**. The earlier figure
   was not re-derived here and may have measured a different relation;
   Phase C will reconcile explicitly.
3. **Unmapped topic with pilot evidence:** `day-of-judgment` is one of the 8
   topics with no mappings, yet cand-0004 records 1:4 as explicit evidence for
   the sovereignty-of-that-Day concept. A potential missing-mapping finding
   for Phase C — pending scholarly review, not auto-created.
4. 176 of 184 scholarly topics carry mappings; 8 do not (list in §4).

## 9. What remains (goal stays active)

- Pass A pilot 2: al-Baqarah 2:1–20 (next round), then the remaining sūrahs
  passage-by-passage to al-Nās.
- Pass B: cross-Qur'anic synthesis, deduplication, concept relationships,
  proposed hierarchy.
- Phase C: existing-taxonomy comparison, missing-topic and missing-mapping
  reports, Arabic terminology index.
- Phase D: gated FAHM integration specification (no production change before
  human scholarly approval).

## 10. Reproduction commands

```
node scripts/mfd11-phase0-baseline.mjs --verify
node scripts/mfd11-validate-extraction.mjs research/mfd-11/extractions/001-al-fatiha.json research/mfd-11/candidates/candidates-001.json
node scripts/mfd11-dump-passage.mjs 2 1 20 research/mfd-11/corpus-view/002-0001-0020.json
node scripts/validate-all.mjs
```
