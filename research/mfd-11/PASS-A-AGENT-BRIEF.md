# MFD-11 Pass A — Shared Agent Brief

Every per-surah extraction agent follows this brief. Your dispatch message gives you
only your **surah number** and your **allocation**. Everything else is here.

Working directory: `C:\Users\Dawood\dyad-apps\Quran Al Huda`

## 1. Your allocation (never write outside it)

Read `research/mfd-11/data/pass-a-registry.json` and find the entry in `allocations`
whose `surah` equals your assigned number. It gives you:

| Field | Meaning |
|---|---|
| `fromAyah` / `toAyah` | The verse range you must cover completely |
| `filePrefix` | Filename stem for your extraction files |
| `passageBudget` | Target number of passages (adjust ±1 if the text warrants) |
| `candidateStart` / `candidateEnd` | Your reserved candidate-ID block |
| `candidateBatchFile` | Your one candidates file under `research/mfd-11/candidates/` |
| `generatorScript` | Your one generator script path under `scripts/` |
| `corpusView` | Your verbatim corpus dump path |

Other agents run concurrently on other surahs. Writing any file outside your
allocation corrupts their work. You may **read** anything.

Extraction filenames: `research/mfd-11/extractions/<filePrefix>-p<N>.json` where N
starts at 1. Extraction IDs: `ext-<SSS>-p<N>` with SSS = zero-padded surah number.

## 2. Hard rules (non-negotiable)

1. NEVER modify anything under `data/`, `src/`, or `node_modules/`. This is a
   research-only workstream; production taxonomy and the 789 mappings are frozen.
2. Every Arabic string MUST be an exact substring of the pinned corpus, obtained
   programmatically (`indexOf` + `slice`, or whole-verse copy). **Never hand-type
   Arabic or write `\uXXXX` escapes for verse content** — diacritic ordering will
   not match and validation will fail.
3. Every record carries `"proposedBy": "ai-assisted"` and
   `"reviewStatus": "pending-scholarly-review"`. Nothing is ever auto-approved.
4. Never fabricate tafsir, asbab al-nuzul, or source citations. If a question needs
   tafsir, record it in `notes` as deferred to scholarly review — do not assert an answer.
5. Editorial glosses must say "(editorial gloss)". Never present them as scholarship.
6. Only cite verse keys inside your own range, and every subject's `keys` must fall
   inside its own passage's `fromAyah..toAyah`.
7. Do NOT run `git add`, `git commit`, or `git push`. The lead integrates.

## 3. Method (the proven generator pattern)

Hand-written JSON fails. Use a generator script.

```bash
# 1. Dump the verbatim corpus for YOUR range
node scripts/mfd11-dump-passage.mjs <surah> <fromAyah> <toAyah> <corpusView>
```

2. Read your `corpusView` **in full**. Use each verse's `translation` to understand
   what it actually says; use `text` verbatim for any Arabic.
3. Read `scripts/mfd11-gen-maidah4.mjs` as the reference implementation.
4. Write your `generatorScript`. It reads the corpus dump, builds the records, and
   writes them with `JSON.stringify(..., null, 2)`. Extract terms with a
   whitespace-splitting word finder rather than fixed-length slices, so no term is
   truncated mid-diacritic.
5. Run it, then validate (section 5). Fix the **generator**, regenerate, re-validate.
   Never patch the emitted JSON by hand — regeneration would undo it.

## 4. Contracts and quality limits

Schemas (read these first):
- `research/mfd-11/schemas/passage-extraction.schema.json`
- `research/mfd-11/schemas/topic-candidate.schema.json`
- `research/mfd-11/schemas/evidence-link.schema.json`

Style reference: `research/mfd-11/extractions/005-al-maidah-p14.json` and
`research/mfd-11/candidates/candidates-026.json`.

The semantic audit (`scripts/mfd11-audit-semantics.mjs`) enforces what the schema
validator cannot:

| Check | Requirement |
|---|---|
| `C_long_label` | `passage.label` **under 400 chars** |
| `C_long_main_subject` | `mainSubject.label` **under 700 chars** |
| `B_partial_evidence` | Candidate `evidence[].excerpt` must be the **FULL verse text** |
| `F_definition_key_mismatch` | If a definition opens `In S:A`, that ayah must be among its evidence keys |
| `D_dup_subordinate` | No duplicate subordinate labels within one record |
| `E_shared_subordinate` | No identical subordinate label across records — add context to differentiate |

Write concise descriptions from the actual verses. **Do not paste summaries from
your dispatch prompt into labels** — earlier batches did that and produced prose
describing the wrong verses. That defect class is why this audit exists.

Omit optional arrays that have no grounded content rather than filling them by inference.

## 5. Topic overlap — verify, never assume

Only reference IDs/slugs you have confirmed exist:
- Scholarly layer: `data/taxonomy/topics.json` → topic `.id`
- Curated layer: `src/lib/topics/data.ts` → `slug`

Grep the catalogs. Many plausible names (`people-of-book`, `charity-giving`,
`unity-brotherhood`, `food-dietary-laws`, …) are dimension IDs or absent entirely.
An unverified reference fails validation. When nothing matches, leave
`existingTopicOverlap: []` and note it as a gap candidate — gaps are valuable output.

## 6. Verify before reporting

All four must pass, and the audit must show **zero findings naming your files**:

```bash
node <generatorScript>
node scripts/mfd11-validate-extraction.mjs <your extraction files...> <your candidateBatchFile>
node scripts/mfd11-phase0-baseline.mjs --verify
node scripts/mfd11-audit-semantics.mjs
```

The audit reports findings from older batches too. Ignore those — they are other
agents' scope. Filter for your `filePrefix` and your `candidateBatchFile`.

If `--verify` ever fails, STOP and report immediately: it means corpus or production
data changed, which is a charter violation.

## 7. Report back

Report: passage count and ranges, candidate count and ID range, evidence-link count,
distinct verse keys (must equal your full range), verbatim excerpts verified, all four
exit codes, audit findings for your files (must be 0), verified topic overlaps, and
any tafsir questions you deferred.
