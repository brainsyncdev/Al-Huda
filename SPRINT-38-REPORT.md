# Sprint 38 Report — QUL Morphology Data Acquisition & Validation

**Sprint:** 38  
**Date:** 2026-10-26  
**Status:** BLOCKED on morphology data access; validation scaffolding enhanced  
**Scope:** Acquire authentic Quranic Arabic morphology data, inspect schemas, validate against existing datasets, prepare root-based discovery index.

---

## 1. Executive Summary

**BLOCKED.** Sprint 38 attempted to acquire actual Quranic morphology data from the Quranic Universal Library (QUL) and Quranic Arabic Corpus. Both sources have access barriers that prevent automatic acquisition in this environment:

- **QUL morphology** (qul.tarteel.ai/resources/morphology): Offers 6 SQLite files (Word root, Word lemma, Word stem, Ayah root, Ayah lemma, Ayah stem), but download links use placeholder URLs (`#_`) and login appears required. No license explicitly stated.
- **Quranic Arabic Corpus** (corpus.quran.com): GPL license, but download page may require registration and timed out during investigation.

**What was completed:**
- Preflight audit of all existing morphology scaffolding, types, validators, and root-allowlist configuration
- Verified word-data counts: 77,429 words across 6,236 verses in 114 surah files
- Documented exact access blockers and required files
- Enhanced validation scaffolding with additional tests for edge cases
- All quality gates pass (lint, typecheck, test, build)

**What is blocked:**
- Actual morphology data import
- Schema inspection of real records
- Word-to-morphology alignment validation
- Root allowlist activation (requires real data)

**Human action required:** Developer must manually download morphology SQLite files from QUL (after creating account if needed) and place them in the repository, or provide licensing clearance for Corpus data.

---

## 2. Files Inspected and Repository State Confirmed

### Documentation
- `SPRINT-37-REPORT.md` — Confirmed Sprint 37 delivered validation scaffolding (types, validators, root-allowlist, occurrence-index) with 62 new tests, 665 total passing
- `docs/DATA-PROVENANCE.md` — Confirmed source registry, licensing status, and runtime delivery deviations

### Core Types
- `src/lib/quran/types.ts` — Confirmed `Ayah`, `SurahMeta`, `AyahRef` types; no morphology fields
- `src/lib/quran/cross-references.ts` — Confirmed explicit statement: "SAME_ROOT or any morphological link" not produced; "The pinned dataset carries no validated morphology"

### Morphology Scaffolding (from Sprint 37)
- `src/lib/morphology/types.ts` — MorphologyRecord, MorphologySource, validation result/report types
- `src/lib/morphology/validators.ts` — validateMorphologyRecord, validateMorphologyBatch
- `src/lib/morphology/root-allowlist.ts` — RootTopicEntry schema, ROOT_ALLOWLIST (empty), CANDIDATE_ROOTS (12 with polysemy docs)
- `src/lib/morphology/occurrence-index.ts` — RootOccurrence, RootTopicIndex, buildRootTopicIndex
- `src/lib/morphology/morphology-scaffolding.test.ts` — 62 tests across 6 describe blocks

### Word Data
- `public/word-data/manifest.json` — Confirmed 77,429 words, 6,236 verses, 114 files, source pin "quran.com API v4 (QUL word data), fetched 2026-10-23"
- Verified actual counts match manifest: **77,429 words total**

### Existing Discovery Surfaces
- 11 curated topics (src/lib/topics/data.ts)
- 10 exploration dimensions
- 14 domains
- 11 domain-topic relationships (all pending-review)

**Repository state confirmed:** All Sprint 37 scaffolding intact, no morphology data present, ROOT_ALLOWLIST intentionally empty.

---

## 3. Exact Morphology Sources Investigated

### Source 1: Quranic Universal Library (QUL) Morphology

**Official resource page:** https://qul.tarteel.ai/resources/morphology

**Available files (6 SQLite databases):**
1. **Word root** — Morphological root information for individual words
2. **Word lemma** — Morphological lemma information for individual words
3. **Word stem** — Morphological stem information for individual words
4. **Ayah Root** — Morphological root information organized by verse
5. **Ayah Lemma** — Morphological lemma information organized by verse
6. **Ayah Stem** — Morphological stem information organized by verse

**File format:** SQLite (.sqlite or .db)

**Access requirements:**
- Download links use placeholder URLs (`#_`) — actual file URLs not visible in page source
- Login button present on page
- Unclear if authentication is mandatory for download
- No license explicitly stated on morphology resource page
- QUL GitHub repo (TarteelAI/quranic-universal-library) is MIT-licensed but does not contain morphology files

**Expected schema (based on documentation):**
- Word-level tables: word_id, surah_id, ayah_id, position, root/lemma/stem text
- Ayah-level tables: surah_id, ayah_id, aggregated roots/lemmas/stems
- Likely uses standard Quran.com API identifiers (verse_key format: "surah:ayah")

**Source 2: Quranic Arabic Corpus

**Official resource page:** https://corpus.quran.com/download.jsp

**License:** GNU Public License (GPL)

**Access requirements:**
- Download page exists but timed out during investigation
- Sign-in feature present
- Unclear if registration is mandatory

**Known concerns:**
- GPL license may restrict commercial use (Al-Huda has Pro tier)
- License requires attribution and may require derivative works to be GPL
- Not cleared for integration without legal review

**Source 3: Quran.com API v4

**Endpoint:** https://api.quran.com/api/v4

**Morphology endpoints:** None found. API provides text, translation, transliteration, and word-by-word data, but no root/lemma/stem fields.

---

## 4. Whether Actual Data Was Obtained

**NO.** No morphology data was obtained.

**Reason:** Both QUL and Corpus have access barriers (login requirements, unclear licensing, placeholder download URLs) that prevent automatic acquisition in this environment.

---

## 5. Download/Access Blocker

### QUL Morphology

**BLOCKER:** Download links use placeholder URLs (`#_`), suggesting JavaScript-driven download that requires authentication or session state.

**Official download page:** https://qul.tarteel.ai/resources/morphology

**Required files:**
- `word_root.sqlite` (or similar naming)
- `word_lemma.sqlite`
- `word_stem.sqlite` (optional, for validation)
- OR ayah-level equivalents if word-level not available

**Expected format:** SQLite database with tables for word morphology

**License status:** NOT STATED. QUL GitHub repo is MIT, but morphology resources page does not specify license. Must verify terms before integration.

### Quranic Arabic Corpus

**BLOCKER:** Download page timed out; may require registration. GPL license raises commercial-use concerns for Al-Huda Pro tier.

**Official download page:** https://corpus.quran.com/download.jsp

**License:** GPL — requires legal review for commercial use

---

## 6. Actual Schema and Representative Records

**NOT AVAILABLE.** Cannot inspect schema without actual data files.

**Expected schema (based on QUL documentation):**

Word-level table likely contains:
- `word_id` — unique identifier
- `surah_id` — surah number (1-114)
- `ayah_id` — ayah number within surah
- `position` — word position within ayah (1-based)
- `verse_key` — "surah:ayah" format (e.g., "2:255")
- `text` — Arabic surface form
- `root` — root letters (e.g., "ص-ب-ر")
- `lemma` — dictionary form (e.g., "صَبَرَ")
- `stem` — morphological stem

Ayah-level table likely contains:
- `surah_id`, `ayah_id`, `verse_key`
- Aggregated lists of roots/lemmas/stems for the verse

**Adapter implementation:** Blocked until actual schema is inspected.

---

## 7. Current Quran and Word-Data Counts

### Quran Dataset (quran-json@3.1.2)
- **114 surahs** — verified
- **6,236 ayat** — verified
- **CC-BY-4.0 license** — cleared for use with attribution

### Word-by-Word Data (QUL word API, vendored)
- **77,429 words** — verified from manifest.json
- **6,236 verses** — verified (matches Quran dataset)
- **114 surah files** — verified
- **3.57 MB total** — verified
- **Source pin:** "quran.com API v4 (QUL word data), fetched 2026-10-23"

### Word-Count Discrepancy Investigation

**Earlier report:** 77,430 tokens (from Quranic Arabic Corpus documentation)
**Actual count:** 77,429 words (from vendored QUL word-data)

**Discrepancy:** 1 word

**Possible explanations:**
1. Different tokenization rules (Corpus may count a particle or marker that QUL excludes)
2. Different handling of ayah-end markers
3. Rounding or counting error in earlier documentation

**Resolution:** Requires alignment validator that compares word-data tokens against morphology tokens once both are available. The 1-word gap is small and may be benign, but must be investigated before word-level highlighting is enabled.

---

## 8. Validation Methodology and Results

### What Could Be Validated

**Scaffolding tests (62 tests, all passing):**
- MorphologyRecord type structure
- validateMorphologyRecord() with valid and invalid records
- validateMorphologyBatch() discrepancy reporting
- Root allowlist validators (slug format, duplicate detection, review state)
- Occurrence index builder (root/lemma filtering, deduplication, maxResults cap)

**Pre-existing data integrity (verified):**
- 114 surahs, 6,236 ayat — matches quran-json package
- 77,429 words — matches manifest.json
- Word-data source pin documented
- No morphology data present (as expected)

### What Is Blocked

**Cannot validate without actual morphology data:**
- Ayah reference resolution (do morphology records reference valid ayat?)
- Word position validation (do positions match word-data?)
- Arabic token alignment (do morphology tokens match word-data tokens?)
- Duplicate detection (are there duplicate word-location keys?)
- Missing record detection (are there ayat with no morphology records?)
- Root/lemma consistency (are roots and lemmas populated correctly?)
- Polysemy filtering (do includedLemmas correctly filter occurrences?)

**Validation pipeline:** Ready to run once data is obtained. The validators in `src/lib/morphology/validators.ts` will accept real MorphologyRecord[] and produce a discrepancy report.

---

## 9. Root Allowlist Changes

**NO CHANGES.** The ROOT_ALLOWLIST remains empty.

**Reason:** No morphology data has been obtained or validated. Activating roots without verified data would fabricate a root catalogue.

**Candidate roots (12 documented, not enabled):**
- ص-ب-ر (patience) — relatively unambiguous
- ش-ك-ر (gratitude) — relatively unambiguous
- ر-ح-م (mercy) — includes الأرحام (kinship), requires lemma filtering
- ع-ل-م (knowledge) — includes العالمين (worlds), high frequency, requires lemma filtering
- ت-و-ب (repentance) — relatively unambiguous
- غ-ف-ر (forgiveness) — relatively unambiguous
- ك-ب-ر (greatness/arrogance) — spans أكبر/كبير (big) and استكبر (arrogance), requires lemma filtering
- خ-ش-ع (humility) — relatively unambiguous
- ص-د-ق (truthfulness) — includes صدقة (charity), requires lemma filtering
- و-ك-ل (trust/delegation) — includes وكيل (guardian) and توكل (trust), may need lemma split
- ن-ف-ق (spending/hypocrisy) — spans إنفاق (spending) and نفاق (hypocrisy), two concepts
- ق-س-ط (justice) — includes المقسطين (just) and القاسطون (wrongdoers, 72:15), opposite meanings

**Activation criteria (not yet met):**
1. Morphology data obtained and validated
2. Lemma breakdown report produced for each candidate root
3. Reviewer selects includedLemmas for each topic
4. Review state changed from "candidate" to "approved"

---

## 10. Tests Added and Quality-Gate Results

### Tests Added

**18 new tests added in Sprint 38:**
- Pagination and totalMatches (8 tests) — verifies no silent truncation, correct totalMatches reporting, pagination metadata
- Root topic activation guard (10 tests) — verifies canActivateRootTopic() rejects entries without approval, lemmas, or required fields

**Existing test coverage (from Sprint 37):**
- Morphology record validators (10 tests)
- Batch validation and discrepancy report (4 tests)
- Root allowlist validators (12 tests)
- Occurrence index builder (8 tests)
- Morphology types schema (3 tests)
- Pre-existing unavailable.test.ts updated to expect morphology directory

**Total:** 683 tests passing across 42 files (665 + 18 new)

### Quality-Gate Results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | **PASS** — 0 errors, 0 warnings |
| Typecheck | `pnpm typecheck` | **PASS** — 0 errors |
| Test | `pnpm test` | **PASS** — 683/683 tests across 42 files |
| Build | `ALLOW_LOCALHOST_BUILD=1 pnpm build` | **PASS** — 6433 static pages generated, exit 0 |

**All four gates pass.**

---

## 11. Remaining Risks and Decisions Requiring Human Review

### BLOCKED — Morphology Data Access

**Decision required:** How to obtain morphology data.

**Option A: QUL account creation**
- Create account at https://qul.tarteel.ai
- Download 6 SQLite files from /resources/morphology
- Verify license terms (not stated on page)
- Place files in repository (e.g., `data/morphology/`)
- **Risk:** License may be unclear or restrictive

**Option B: Quranic Arabic Corpus with GPL**
- Download from https://corpus.quran.com/download.jsp
- Review GPL license for commercial use (Al-Huda Pro tier)
- Provide attribution as required
- **Risk:** GPL may restrict commercial use; legal review needed

**Option C: Defer morphology integration**
- Focus on other Explore improvements that don't require morphology
- Examples: dimension enrichment, domain-topic review workflow, responsive nav fix
- **Risk:** Root-based discovery remains unavailable

**Recommendation:** Option A (QUL account) first, since QUL is already the source of vendored word-data. If license is unclear, fall back to Option B (Corpus GPL review) or Option C (defer).

### HUMAN REVIEW REQUIRED — Polysemy Decisions

Once morphology data is obtained, a reviewer must decide which lemmas belong in each root-topic. The 12 candidate roots have documented polysemy concerns, but the actual lemma breakdown requires real data.

**Example:** ع-ل-م (knowledge) includes العالمين (worlds). Should "Rabb al-alamin" ayahs appear in the knowledge topic? A reviewer must decide.

### HUMAN REVIEW REQUIRED — License Clearance

Neither QUL morphology nor Corpus GPL has been cleared for use in Al-Huda. A human must review the license terms and decide whether integration is permitted.

### ASSUMPTION — Word-Count Discrepancy

The 1-word gap between QUL (77,429) and Corpus (77,430) is assumed to be benign (different tokenization rules), but must be verified with an alignment validator before word-level highlighting is enabled.

---

## 12. Exact Next Action Required to Unblock Progress

### For the Developer

**Step 1: Obtain morphology data**

Choose one:
- **A.** Create QUL account, download 6 SQLite files, verify license, place in `data/morphology/`
- **B.** Download Corpus data, review GPL license, place in `data/morphology/`
- **C.** Defer morphology integration, focus on other work

**Step 2: If data is obtained (A or B)**

1. Place SQLite files in `data/morphology/` (create directory if needed)
2. Document source, version, retrieval date, and license in `docs/DATA-PROVENANCE.md`
3. Add source record to `src/lib/quran/sources.ts`
4. Run Sprint 38 continuation: inspect schema, build adapter, run validation pipeline, produce lemma breakdown reports, activate roots

**Step 3: If deferred (C)**

1. Close Sprint 38 as BLOCKED
2. Document blocker in project memory
3. Plan Sprint 39 for alternative Explore improvements

### For Sprint 38 Continuation (if data is obtained)

1. Inspect SQLite schema — determine table names, column names, data types
2. Sample records — examine 10-20 records to understand data shape
3. Build adapter — create `src/lib/morphology/qul-adapter.ts` to parse SQLite into MorphologyRecord[]
4. Run validation — call `validateMorphologyBatch()` and produce discrepancy report
5. Investigate discrepancies — review sample issues, determine if they're benign or require filtering
6. Produce lemma breakdown reports — for each of the 12 candidate roots, list all lemmas and their frequencies
7. Activate roots — reviewer selects includedLemmas for each root, changes review state to "approved"
8. Replace /explore/root/[root]/page.tsx — implement real root-discovery page using occurrence index
9. Add tests — adapter parsing, alignment validation, polysemy filtering, pagination
10. Run quality gates — lint, typecheck, test, build

---

## Summary

**VERIFIED FACT:**
- 77,429 words in vendored word-data (matches manifest)
- 6,236 ayat in Quran dataset (matches quran-json)
- 114 surahs (matches quran-json)
- No morphology data present in repository
- ROOT_ALLOWLIST intentionally empty
- All quality gates pass (683/683 tests, lint clean, typecheck clean, build exit 0)

**VALIDATION RESULT:**
- Scaffolding validators tested with synthetic records — all pass
- Pagination and activation guard tested — no silent truncation, proper guards in place
- Real morphology data not available to validate

**ASSUMPTION:**
- 1-word count discrepancy (77,429 vs 77,430) is benign (different tokenization)

**HUMAN REVIEW REQUIRED:**
- License clearance for QUL morphology or Corpus GPL
- Polysemy decisions for each candidate root (which lemmas belong)

**BLOCKED:**
- Morphology data acquisition (QUL download requires login, Corpus may require registration)
- Schema inspection (no data to inspect)
- Word-to-morphology alignment validation (no morphology data)
- Root allowlist activation (no validated data)

**Sprint 38 enhancements completed:**
- Fixed silent truncation in occurrence-index.ts — totalMatches now reports true count before pagination
- Added pagination support (offset/limit parameters) with metadata
- Added canActivateRootTopic() guard to prevent activation without validated data and approval
- 18 new tests for pagination and activation guard

**Sprint 38 is complete with BLOCKED status on data acquisition. Sprint 39 has not been started.**
