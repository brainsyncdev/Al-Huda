# MFD-11 Genuine Re-extraction — Wave Brief (v2)

This brief replaces `PASS-A-AGENT-BRIEF.md` for re-extraction work. Read it fully
before writing anything.

Working directory: `C:\Users\Dawood\dyad-apps\Quran Al Huda`

## Why this pass exists

Pass A produced two tiers. Surahs 1–6 and 8 have genuine subject-matter
extraction. Surahs 7 and 9–114 have a **coverage shell**: verbatim Arabic and
verse keys, but subordinate subjects that are truncated English translations,
empty analytical arrays, placeholder candidate labels (`cand-XXXX: Topic from S:A`),
and empty `existingTopicOverlap`. That shell is not extraction.

Your job is to replace the shell for your assigned surah with real analysis of
what the Qur'an actually says.

**The central rule:** extract the Qur'an's actual subject matter. Do not generate
enough labels to make the database look complete. An empty analytical array is
correct when the passage genuinely has no entry for that category. Fabricated
completeness is a defect.

## Hard rules (non-negotiable)

1. NEVER modify anything under `data/`, `src/`, or `node_modules/`. Production
   taxonomy and the 789 mappings are frozen.
2. Every Arabic string MUST be an exact substring of the pinned corpus, obtained
   programmatically (`indexOf` + `slice`, whole-word split, or whole-verse copy).
   Never hand-type Arabic or write `\uXXXX` escapes for verse content.
3. Every record carries `"proposedBy": "ai-assisted"` and
   `"reviewStatus": "pending-scholarly-review"`. Nothing is auto-approved.
4. Never fabricate tafsir, asbab al-nuzul, or source citations. Open interpretive
   questions go in `notes` as deferred to scholarly review — never assert an answer.
5. Editorial glosses must say `(editorial gloss)`. Never present them as scholarship.
6. Only cite verse keys inside your own passage range.
7. Do NOT run `git add`, `git commit`, or `git push`. The lead integrates.
8. Write ONLY your allocated files. Other agents run concurrently on other surahs.

## Method

```bash
# 1. Dump the verbatim corpus for your full surah range
node scripts/mfd11-dump-passage.mjs <surah> <from> <to> <corpusView>
```

2. **Read the entire corpus dump.** Use each verse's `translation` to understand
   what it actually says. This reading is the work — do not skip it.
3. Read `scripts/mfd11-gen-maidah4.mjs` as the reference generator pattern, and
   `research/mfd-11/extractions/005-al-maidah-p14.json` plus
   `research/mfd-11/candidates/candidates-026.json` as style references.
4. Decide **meaningful passage boundaries** from the text: narrative units,
   legislative blocks, argumentative turns, refrains. Arbitrary equal-size verse
   groupings are rejected. Record why each boundary was chosen in `notes`.
5. Write your generator script. It reads the dump, builds records, writes JSON
   with `JSON.stringify(..., null, 2)`. Fix the **generator**, regenerate,
   re-validate. Never patch emitted JSON by hand.

## Quality requirements — every one is checked

| Requirement | Acceptance criterion |
|---|---|
| Arabic integrity | Every excerpt/term matches the pinned source verbatim |
| Passage identification | Meaningful boundaries justified in `notes`, not arbitrary groupings |
| `passage.label` | Descriptive Qur'anic concept summary, **under 400 chars** |
| `mainSubject.label` | Actual subject of the passage, **under 700 chars** |
| `subordinateSubjects` | Explain the actual subject per verse-group. **Never a truncated translation.** No duplicates within or across records |
| `commandsAndProhibitions` | Populated where present: `kind` COMMAND / PROHIBITION / TAUGHT_SUPPLICATION, exact `keys`, full-verse `excerpt`, description |
| `divineNamesAndAttributes` | Actual Qur'anic expressions found verbatim in cited verses, with transliteration and `(editorial gloss)` |
| `propheticNarratives` | Narrative identified with participants and the relevant passage keys |
| `humanConditionsAndSpiritualStates` | Real states named in the text |
| `socialEconomicCivilisational` | Real social/economic/legal content where present |
| `relationships` | Allah–humanity–creation relations stated in the text |
| `terminology` | Meaningful Qur'anic terms, verbatim, with gloss. Not raw token frequency |
| Candidate labels | Descriptive concepts. **Never** `Topic from S:A` |
| Candidate evidence | **FULL verse text** per key (the `fv()` pattern) |
| Candidate definition | If it opens `In S:A`, that ayah must be among its evidence keys |
| `existingTopicOverlap` | Genuine conceptual match with a verified ID and an explanatory `note`. Empty `[]` is acceptable; a wrong ID is not |
| Semantic audit | Zero findings naming your files |

### Verified topic IDs only

Scholarly layer IDs live in `data/taxonomy/topics.json` (`.id`). Curated slugs
live in `src/lib/topics/data.ts` (`slug:`). The curated set is exactly:
`patience, gratitude, trust-in-god, mercy-and-forgiveness, remembrance, giving,
justice, parents-and-family, hardship-and-ease, knowledge-and-reflection,
the-hereafter, tawheed, prayer, supplication, god-consciousness, repentance,
prophets, good-character`.

Do not guess scholarly IDs. Confirm by reading the catalog. When nothing matches
conceptually, leave `existingTopicOverlap: []` and note the gap — gaps are
valuable output.

## Verify before reporting

All four must pass, and the audit must show **zero findings naming your files**:

```bash
node <your generator>
node scripts/mfd11-validate-extraction.mjs <your extraction files...> <your candidate file>
node scripts/mfd11-phase0-baseline.mjs --verify
node scripts/mfd11-audit-semantics.mjs
```

The audit reports older batches too. Filter for your `filePrefix` and your
candidate batch filename. If `--verify` fails, STOP and report immediately —
that means corpus or production data changed, a charter violation.

## Report back

- Passage count, ranges, and the boundary rationale
- Candidate count and ID range
- Evidence-link count, distinct verse keys (must equal your full range)
- Verbatim excerpts/terms verified
- All four exit codes and audit findings for your files (must be 0)
- Which analytical arrays are legitimately empty and why
- Verified topic overlaps with reasoning
- Unresolved interpretive questions deferred to scholars
