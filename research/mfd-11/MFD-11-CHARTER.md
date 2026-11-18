# MFD-11 — Complete Qur'anic Knowledge Extraction

**Status:** Phase 0 (baseline) — research-only workstream
**Started:** 2026-11-18
**Destination:** FAHM Quran application (integration is gated; see Phase D)

## 1. Objective

Extract, organise and cross-reference the complete subject matter of all 114
sūrahs from the pinned Uthmani Arabic corpus, then produce a comprehensive
Qur'an-derived knowledge inventory. The number of topics is **not** decided in
advance; it must emerge from careful analysis.

This workstream builds on the existing FAHM evidence and review infrastructure
(MFD-10.2) without disrupting the application or its production data.

## 2. Three concepts that must never be conflated

1. **Qur'anic extraction** — what subjects and concepts are actually present in
   the Qur'an, with exact references and verbatim Arabic evidence.
2. **Taxonomic classification** — how those subjects are organised into
   domains, dimensions and topics. This is editorial structure, not revelation.
3. **Scholarly validation** — how qualified scholars assess the accuracy of
   interpretations and classifications. Only this step can approve anything.

Every artefact produced here is a **proposal** until a human scholarly review
record approves it through the project's governance process.

## 3. Immutable rules (non-negotiable)

- Never modify, normalize, reconstruct or regenerate the Qur'anic Arabic.
- Never invent an āyah or a reference. Every cited key must exist in the pinned
  corpus; every quoted Arabic fragment must match the corpus verbatim
  (mechanically checked by `scripts/mfd11-validate-extraction.mjs`).
- Never label an editorial category as a direct Qur'anic topic.
- Never treat a translation as equivalent to the original Arabic.
- Never automatically approve a mapping or a topic.
- Never fabricate tafsir evidence or source references.
- Preserve every source reference and its review history.
- Keep the existing 789 production mappings and all production taxonomy intact
  until the new extraction has been compared and reviewed.
- Do not assume every Arabic word or phrase should become a separate topic.
- AI is never represented as a scholar or an evidence source. All AI-produced
  records carry `proposedBy: "ai-assisted"` and
  `reviewStatus: "pending-scholarly-review"`.
- Public AI religious answers remain OFF; NOOR remains deferred.

## 4. Source corpus

The complete corpus is already pinned in this repository — no upload needed:

- Package: `quran-json@3.1.2` (CC-BY-4.0), exact pin in `package.json`.
- Path: `node_modules/quran-json/dist/chapters/en/{1..114}.json` + `index.json`.
- Arabic provenance: The Noble Qur'an Encyclopedia (quranenc.com), via
  quran-json; English translation: Saheeh International (Tanzil). See
  `docs/DATA-PROVENANCE.md`.
- The app reads this corpus verbatim through `src/lib/quran/data.ts`
  (server-only). MFD-11 reads the same bytes and never writes to them.

Phase 0 records a SHA-256 hash of every verse's Arabic text (verbatim, no
normalization), every corpus file, and every production taxonomy file.
`node scripts/mfd11-phase0-baseline.mjs --verify` recomputes and compares;
any drift fails the run. This is the immutability guard for the workstream.

## 5. Data architecture (research is separate from production)

```
research/mfd-11/
  MFD-11-CHARTER.md            this document
  README.md                    how to run the tooling
  schemas/                     JSON Schema contracts for research records
  data/                        Phase 0 baseline (inventory, hashes, snapshot)
  extractions/                 Pass A: passage-by-passage extraction records
  candidates/                  topic candidates with āyah evidence links
  synthesis/                   Pass B: deduplication, hierarchy, relationships
  reports/                     comparison, missing-topic/mapping, phase reports
  integration/                 Phase D: gated FAHM integration specification
```

Nothing under `research/` is imported by the application. Production data
(`data/taxonomy/*`, `src/lib/topics/data.ts`, `src/lib/explore/dimensions.ts`)
is read-only for this workstream.

## 6. Phases

### Phase 0 — Baseline (this phase)
Corpus inventory, per-verse immutability hashes, read-only production snapshot,
charter, schemas, extraction validator. No production changes.

### Pass A — Sūrah and passage analysis
Read the Qur'an from al-Fātiḥah to al-Nās preserving passage context. For each
passage extract: main and subordinate subjects; explicit commands and
prohibitions; divine names and attributes; prophetic narratives and historical
events; human conditions and spiritual states; relationships between Allah,
humanity and creation; social, economic and civilisational subjects; relevant
Arabic expressions and terminology. Pilot order: Sūrah al-Fātiḥah (complete),
then al-Baqarah 2:1–20, to validate the schemas before scaling.

### Pass B — Cross-Qur'anic synthesis
After the complete corpus is examined: identify concepts repeated across
sūrahs; concepts that develop progressively; similar but non-identical
concepts; context-specific subjects; relationships between concepts;
consolidate duplicate candidates; establish the proposed topic hierarchy.
This pass prevents a collection of disconnected verse labels.

### Phase C — Comparison and gap reports
Compare the extraction against the existing taxonomy (20 domains, 103
dimensions, 184 scholarly topics, 18 curated topics, 789 mappings). Produce:
existing-taxonomy comparison, missing-topic report, missing-mapping report,
proposed domain/dimension hierarchy, Arabic terminology and conceptual
relationship index.

### Phase D — Gated FAHM integration specification
A final implementation specification for FAHM. **No production change happens
until qualified human reviewers approve it.** The specification must reuse the
MFD-10.2 evidence/review governance (append-only history, verified-evidence
requirement for approval, no auto-approval).

## 7. Scholarly verification plan

- Every extraction record and topic candidate is born
  `pending-scholarly-review`.
- Reviewers use the existing `/editorial/mappings` workspace governance model;
  research records will be mapped into it only at Phase D, after approval.
- Approval requires an identified human reviewer, a recorded rationale, and
  verified evidence — exactly as MFD-10.2 enforces for production mappings.
- Tafsir evidence is attached only through the existing source registry and
  evidence states; unavailable sources are never represented as verified.

## 8. Verification commands

```
node scripts/mfd11-phase0-baseline.mjs            # generate Phase 0 baseline
node scripts/mfd11-phase0-baseline.mjs --verify   # immutability guard
node scripts/mfd11-validate-extraction.mjs <files...>  # schema + corpus checks
node scripts/validate-all.mjs                     # existing production validators
```
