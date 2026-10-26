# Sprint 37 Report — Root Data Verification & Quranic Morphology Import

**Sprint:** 37
**Date:** 2026-10-26
**Status:** Complete (validation scaffolding implemented; morphology data import blocked)
**Scope:** Audit repository Quran data, evaluate morphology sources, build independently testable validation scaffolding, document blocker.

---

## 1. Repository Audit

### Quran Text Data

**Primary dataset: quran-json@3.1.2 (CC-BY-4.0)**
- 114 surahs, 6,236 ayat
- Structure: `{ id, name, transliteration, translation, type, total_verses, link }`
- Verses: Arabic text (Uthmani), English translation (Saheeh International), transliteration
- No morphology, root, lemma, or part-of-speech fields

**Word-by-word data: public/word-data/ (vendored from quran.com v4 API)**
- 77,429 word tokens across 6,236 ayat
- 114 surah JSON files + manifest.json
- Source pin: "quran.com API v4 (QUL word data), fetched 2026-10-23"
- Keys: `"surah:ayah"` format (e.g., `"1:1"`, `"2:255"`)
- Values: `[arabic, translation, transliteration]` arrays
- No root/lemma/stem fields

**Type definitions: src/lib/quran/types.ts**
- `Ayah` = `{ surah, ayah, arabic, translation, transliteration }` — no morphology
- `SurahMeta` = `{ id, slug, arabicName, transliteration, meaning, revelation, ayahCount }`
- `AyahRef` = `{ surah, ayah }` — stable 1-based reference
- `WordToken` (src/lib/quran/words.ts) = `{ arabic, translation, transliteration, position }` — no root/lemma

**Catalog counts:**
- 11 curated topics (patience, gratitude, trust-in-god, etc.)
- 10 exploration dimensions
- 14 domains
- 11 domain-topic relationships (all pending-review)

### Morphology Data Status

**Local inventory:**
- No morphology.ts, roots.ts, or similar module in src/lib/ (before this sprint)
- No morphology files in public/
- No data/ directory
- Scripts mention roots only in comments/validation context

**Existing /explore/root/[root]/page.tsx:**
- Deliberately NOT a functioning root discovery page
- States plainly: "Al-Huda does not currently hold validated Arabic morphology data"
- Points to working discovery surfaces (dimensions, topics, graph, search)
- robots: noindex
- Comment: "this file is the single place to replace the unavailable body with the real root-discovery experience"

**cross-references.ts:13-14:**
- Explicitly states: "SAME_ROOT or any morphological link" not produced
- "The pinned dataset carries no validated morphology"

---

## 2. Morphology Source Evaluation

### Quranic Arabic Corpus (corpus.quran.com)

- Downloadable (requires email), version 0.4
- GPL license with attribution requirement
- Citation: "source clearly indicated, link to corpus.quran.com"
- "CHANGING IT IS NOT ALLOWED" for verbatim copies
- **Commercial use concerns**: Al-Huda has Pro tier — GPL commercial use restrictions need legal review
- Not cleared for integration without licensing decision

### QUL Morphology (qul.tarteel.ai)

- Resource page exists: `/resources/morphology` — SQLite format, 77,432 count
- Sub-resources: Word root, Word lemma, Ayah Root, Word stem
- **Download requires login** — redirects to email/password portal
- **No public API** — all API probes return 404
- **No license stated** on any resource page
- **No upstream source attribution** — doesn't say if derived from Corpus
- GitHub repo (TarteelAI/quranic-universal-library) is MIT but doesn't include morphology files
- Documentation says "API: Coming soon"

### quran.com v4 API

- Tested `word_fields=root,lemma,stem` — API returns text/translation/transliteration only
- Morphology fields NOT exposed through the public API

---

## 3. Validation Scaffolding Implemented

Per the mission's instruction to "implement only the independently testable validation scaffolding," the following modules were created:

### src/lib/morphology/types.ts

Typed morphology record model:
- `MorphologyRecord` — ref, wordPosition (optional), token, canonicalArabic, root (optional), lemma (optional), partOfSpeech (optional), sourceId
- `MorphologySource` — dataset provenance (id, name, version, license, attribution, homepage, notes)
- `MorphologyValidationResult` — valid + issues list
- `MorphologyValidationIssue` — code, message, severity (error | warning)
- `MorphologyDiscrepancyReport` — batch validation summary with counts and sample issues

### src/lib/morphology/validators.ts

Independent validators (no morphology data required):
- `validateMorphologyRecord(record)` — checks ayah ref resolves, token/canonicalArabic non-empty, wordPosition positive, root/lemma non-empty if present
- `validateMorphologyBatch(records)` — batch validation with discrepancy report: counts valid/invalid/warning, missing ayah refs, duplicates, missing root/lemma, collects up to 50 sample issues

### src/lib/morphology/root-allowlist.ts

Root-topic configuration schema:
- `RootTopicEntry` — slug, title, arabicTitle, roots (array for root sets), includedLemmas (explicit allow, not exclusion), maxResults (optional), reviewState, assertedBy, assertedAt, notes
- `ROOT_ALLOWLIST` — empty (no roots enabled yet)
- `CANDIDATE_ROOTS` — 12 starter candidates with polysemy concerns documented:
  - ص-ب-ر (patience), ش-ك-ر (gratitude), ر-ح-م (mercy — includes الأرحام), ع-ل-م (knowledge — includes العالمين), ت-و-ب (repentance), غ-ف-ر (forgiveness), ك-ب-ر (greatness/arrogance — spans both), خ-ش-ع (humility), ص-د-ق (truthfulness — includes صدقة), و-ك-ل (trust/delegation), ن-ف-ق (spending/hypocrisy — two concepts), ق-س-ط (justice — includes both just and wrongdoers)
- `validateRootTopicEntry(entry)` — structural validation
- `validateRootAllowlist(entries)` — checks duplicate slugs and duplicate roots (one root = one topic invariant)
- `getEnabledRootTopics(entries)` — filters to non-candidate, non-rejected, with includedLemmas

### src/lib/morphology/occurrence-index.ts

Ayah-level occurrence index:
- `RootOccurrence` — ref, matchedToken, matchedLemma, matchedRoot, wordPosition
- `RootTopicIndex` — entry, occurrences, uniqueAyahs (deduplicated), totalOccurrences
- `buildRootTopicIndex(entry, records)` — pure function, filters morphology records by roots and includedLemmas, applies maxResults cap
- `buildAllRootTopicIndices(entries, records)` — batch builder

---

## 4. Integrity Validation Results

**No morphology dataset is available to validate.** The validators are tested against synthetic records and the canonical Quran dataset (quran-json). They will validate real morphology records once a dataset is integrated.

**Tested invariants:**
- Invalid surah/ayah references are rejected
- Empty tokens and canonicalArabic are rejected
- Empty root/lemma fields (present but empty) produce warnings, not errors
- Missing root/lemma (undefined) is accepted (optional fields)
- Non-positive wordPosition is rejected
- Duplicate records (same ref + wordPosition + token) are counted
- Batch report correctly summarizes valid/invalid/warning counts
- Root allowlist enforces one-root-one-topic invariant
- Occurrence index correctly filters by roots and includedLemmas
- Occurrence index deduplicates ayahs
- maxResults cap is applied

---

## 5. Discrepancy Counts

**Not applicable** — no morphology dataset imported. The discrepancy report structure is defined and tested, but has no real data to report on.

---

## 6. Verified Allowlist Entries

**Zero entries enabled.** The `ROOT_ALLOWLIST` is intentionally empty. The `CANDIDATE_ROOTS` list has 12 entries with documented polysemy concerns, but none are enabled until:
1. A morphology dataset is integrated
2. A lemma breakdown report is produced for each candidate root
3. A reviewer selects includedLemmas for each topic

---

## 7. Occurrence Index

**Not populated** — depends on morphology data. The builder function is implemented and tested with synthetic data. It correctly:
- Filters by root set
- Filters by includedLemmas
- Deduplicates ayahs
- Applies maxResults cap
- Preserves matched token, lemma, and root on each occurrence

---

## 8. Tests and Quality Gates

### New tests: src/lib/morphology/morphology-scaffolding.test.ts

**38 tests across 6 describe blocks:**
- "Sprint 37 — Morphology record validators" (10 tests)
- "Sprint 37 — Batch validation and discrepancy report" (4 tests)
- "Sprint 37 — Root allowlist validators" (12 tests)
- "Sprint 37 — Occurrence index builder" (8 tests)
- "Sprint 37 — Morphology types schema" (3 tests — compile-time type checks)

### Quality gate results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | Clean (0 errors, 0 warnings) |
| Typecheck | `pnpm typecheck` | Clean (0 errors) |
| Test | `pnpm test` | **641/641 passed across 40 files** (was 603/39; +38 tests) |
| Build | `ALLOW_LOCALHOST_BUILD=1 pnpm build` | Exit 0 |

---

## 9. Unresolved Linguistic Questions

**Polysemy (requires lemma breakdown before topic creation):**
- ع-ل-م includes العالمين ("worlds") — would pollute "knowledge" topic
- ك-ب-ر includes أكبر/كبير (big) AND استكبر (arrogance)
- ص-د-ق includes صدقة (charity) not just truth
- ر-ح-م includes الأرحام (kinship) not just mercy
- ن-ف-ق spans infaq (spending) and nifaq (hypocrisy)
- ق-س-ط spans المقسطين (just) and القاسطون (wrongdoers, 72:15)

**Word count discrepancy:**
- QUL reports 77,429 words (vendored word-data)
- Corpus counts 77,430 tokens
- 1-word gap requires alignment validator before word-level highlighting

**Root-to-topic mapping (user decisions):**
- One root = one topic (no splitting into multiple pages)
- No arbitrary ayah-count cap
- `includedLemmas` not `excludedLemmas`
- Label: "ayaat jin mein *X* ka lafz aaya hai" — never "about X"

---

## 10. Blocker: Morphology Data Access

**Phase 2 (actual data import) cannot proceed without morphology data.**

Three paths forward:
1. **Create QUL account and download** — cleanest if license is permissive
2. **Use Corpus with GPL** — requires licensing review for commercial use (Pro tier)
3. **Defer** — until data access and license terms are resolved

**Recommendation:** Path 1 (QUL account) first, since QUL is already the source of vendored word-data. If their terms are unclear, fall back to Path 2 (Corpus GPL review).

---

## 11. What Was NOT Changed

- No Quran text, translations, Tafsir, citations, or source attribution altered
- No existing 11 curated topics modified
- No existing routes changed
- `/explore/root/[root]/page.tsx` still states "not yet available" — will be replaced when data is integrated
- No scholarly approvals fabricated
- No morphology data invented
- `AI_ANSWER_FEATURE_ENABLED` remains false

---

## 12. Recommended Next Sprint

**Option A: Resolve morphology data access** (recommended)
- Create QUL account, download morphology SQLite, verify license terms
- If QUL license is unclear, contact Tarteel or fall back to Corpus GPL review
- Once data is obtained and license is cleared, implement the actual import:
  - Parse the dataset into `MorphologyRecord[]`
  - Run `validateMorphologyBatch()` and produce a discrepancy report
  - Produce lemma breakdown reports for the 12 candidate roots
  - Enable first 5-10 unambiguous roots in `ROOT_ALLOWLIST`
  - Replace `/explore/root/[root]/page.tsx` with real root-discovery page

**Option B: Defer root-based discovery**
- Focus on other Explore improvements that don't require morphology data
- Examples: dimension enrichment, domain-topic relationship review workflow, responsive nav fix at 768px

---

## Summary

**Phase 1 audit complete.** Repository's Quran data structure verified: 114 surahs, 6,236 ayat, 77,429 word tokens, no morphology data locally.

**Phase 2 blocked.** Neither QUL morphology data nor Quranic Arabic Corpus is currently accessible without resolving licensing questions.

**Validation scaffolding implemented.** Types, validators, root-allowlist config, and occurrence-index builder are all in place and tested (38 new tests, 641 total passing). These modules are independently testable and will accept real morphology data once a source is integrated.

**No fabrication.** No morphology data was invented. No root assignments were guessed. The allowlist is intentionally empty.

**Sprint 37 is complete. Sprint 38 has not been started.**
