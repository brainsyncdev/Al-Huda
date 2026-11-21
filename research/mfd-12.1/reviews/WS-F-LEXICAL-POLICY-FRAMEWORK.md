# WS-F: Lexical & Gloss Prioritization Policy Framework (MFD-12.1)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-F (Lexical & Gloss Prioritization) |
| Date | 2026-11-21 |
| Agent | agent-108 (AI-assisted) |
| Questions Addressed | Q16–Q22 |
| Evidence Base | MFD-11.5 Lexical Quality Report, Root Remediation Report, Transliteration Standard, Duplicate Registers, Gloss Review Register |
| Status | RESEARCH ONLY — No production files modified |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |

---

## Executive Summary

This document establishes the scholarly review prioritization framework for the 649-entry FAHM terminology index. It resolves seven lexical quality questions (Q16–Q22) identified on the programme dashboard, each backed by evidence from MFD-11.5 deliverables. All policies are proposals awaiting scholarly adjudication.

| Question | Topic | Policy Decision |
|----------|-------|-----------------|
| Q16 | Index scope | Curated thematic lexicon; exhaustive coverage deferred to Phase D |
| Q17 | Transliteration standard | ISO 233-2 canonical + ASCII search aliases |
| Q18 | Polysemy handling | Unified entry with enumerated senses as default |
| Q19 | Root disagreements | Preserve all competing analyses; no forced resolution |
| Q20 | Morphology null values | Null = legitimate absence; gap = flagged for review |
| Q21 | 235 slug defects | Three-tier verification workflow |
| Q22 | 23 duplicate groups | Four-criteria test for genuine polysemy vs artifact |

---

## Q16: Index Scope — Curated Thematic Lexicon

### Question
Confirm curated thematic lexicon scope; is exhaustive coverage deferred? What are the boundaries?

### Evidence
- MFD-11.5 Lexical Quality Report analyzed **649 terms** extracted during Phase C (line 7).
- The gloss quality assessment found **~99% of entries fail the four-layer adequacy threshold** (line 100), indicating depth remediation is needed before breadth expansion.
- Root Remediation Report confirmed **54 terms lack root assignments** and **223 require manual scholarly review** (lines 73–105), demonstrating the current set itself is incomplete.
- Recommendation #5 in the Lexical Quality Report explicitly states: "Rebuild index from data/root-occurrences/ for complete coverage" (line 112), implying exhaustive coverage is a future-phase activity.

### Policy Recommendation

**ADOPT: Curated thematic lexicon with deferred exhaustive coverage.**

1. **Current scope boundary**: The 649-entry index represents a *curated thematic subset* of Qur'anic vocabulary, selected for theological significance, frequency, and user-facing relevance during Phase C extraction.
2. **Exhaustive coverage target**: Deferred to Phase D (post-MFD-12), contingent on:
   - Completion of four-layer gloss remediation for current 649 entries
   - Resolution of all 235 systemic slug defects (Q21)
   - Scholarly validation of all 8 root disagreement cases (Q19)
3. **Expansion criteria** (for Phase D):
   - Terms appearing ≥3 times in the Qur'anic corpus
   - Terms central to Islamic creed (ʿaqīdah), jurisprudence (fiqh), or spirituality (tazkiyah)
   - Terms with significant tafsīr discussion requiring disambiguation
4. **Explicit exclusion**: Grammatical particles, pronouns, and purely functional words remain excluded unless they carry independent theological weight (e.g., *inna*, *laysa* in doctrinal contexts).

### Rationale
Attempting exhaustive coverage before achieving adequate gloss depth would compound the existing quality deficit. The 98.6% editorial-only gloss rate means the current index already requires substantial scholarly investment. Depth before breadth ensures each term meets the four-layer rubric before new terms are admitted.

---

## Q17: Transliteration Standard — ISO 233-2 with Search Aliases

### Question
ISO 233-2 adopted; are search aliases separate from canonical identifiers? Define alias policy.

### Evidence
- Transliteration Standard document formally adopts **ISO 233-2:1993** (line 8).
- Canonical Convention Table defines **28 consonants + 6 vowels + 3 special characters** with explicit search alias mappings (lines 34–83).
- Application Rule 2 specifies: "A `searchAliases` array provides simplified ASCII variants for user-facing search" (lines 92–99).
- Lexical Quality Report found **245 transliteration violations (37.8%)** requiring migration (lines 18–19).
- Migration protocol explicitly states: "Never auto-merge entries based on normalized form alone" (line 134).

### Policy Recommendation

**ADOPT: Strict separation of canonical form and search aliases.**

1. **Canonical identifier**: Exactly ONE ISO 233-2 transliteration per entry. This is the authoritative, display-ready form.
   - Example: `ṣabr` (not `sabr`, not `sabr`)
   - Stored in field: `transliteration`
2. **Search aliases**: Array of simplified ASCII forms for user search tolerance.
   - Must include: ASCII-only transliteration (diacritics stripped)
   - May include: Common variant spellings, assimilated forms, legacy spellings
   - Example: `["sabr", "sabir"]`
   - Stored in field: `searchAliases`
3. **Alias generation rules**:
   - Every canonical form MUST have at least one ASCII alias
   - Assimilated al-lām forms MAY appear as aliases (e.g., `ash-shams` as alias for `al-shams`)
   - Hamzat al-waṣl omission variants SHOULD be included (e.g., `ism` alongside canonical `ism`)
   - Tā' marbūṭah pausal/construct variants SHOULD both appear as aliases where applicable
4. **Migration priority**: The 245 violations identified in MFD-11.5 must be corrected before any new terms are added. Migration map in [transliteration-migration.json](../../mfd-11/reports/transliteration-migration.json) serves as the authoritative correction reference.
5. **Display rule**: User-facing interfaces show canonical ISO 233-2 by default. Search accepts both canonical and alias forms. URL slugs use ASCII-normalized aliases for accessibility.

### Rationale
Separating canonical from alias preserves scholarly precision while enabling practical search. ISO 233-2 diacritical marks (ḥ, ṣ, ḍ, ṭ, ẓ, š, ḫ, ġ, ḏ, ṯ, ā, ū, ī, ʾ, ʿ) are essential for distinguishing phonemes but create barriers for non-specialist users. The alias layer bridges this gap without compromising the authoritative record.

---

## Q18: Polysemy Handling — Unified Entry with Enumerated Senses

### Question
One entry with contextual senses as default? When should polysemous words be split vs kept unified?

### Evidence
- Gloss Quality Rubric identifies **POLYSEMY_COLLAPSED** as a flag affecting **283 terms (43.6%)** (line 96).
- Failure mode definition: "Collapsing multiple senses into one undifferentiated gloss" (rubric line 22).
- Duplicate detection found **23 groups / 50 terms** where normalized Arabic forms matched but glosses differed (Lexical Quality Report lines 50–79).
- All 23 duplicate groups received disposition `keep-separate` with rationale "Distinct glosses suggest genuine polysemy or contextual sense differentiation" (duplicate-resolution-register.json).
- Classical lexicography tradition (Lane, Lisān al-ʿArab) organizes by root with numbered sub-entries for distinct senses.

### Policy Recommendation

**ADOPT: Unified entry per lemma with enumerated contextual senses as the default structure.**

1. **Default: Single entry, multiple senses**
   - One canonical entry per unique Arabic lemma (normalized form)
   - Each distinct meaning enumerated as a numbered sense within Layer 2 (Contextual Sense)
   - Each sense linked to specific verse occurrences
   - Example structure:
     ```
     Term: ḥaqq (الحق)
     Sense 1: "truth, reality" — 13:1, 34:49
     Sense 2: "the Truth (divine attribute)" — 103:3
     Sense 3: "right, due obligation" — 6:151
     ```

2. **Splitting criteria** (create separate entries ONLY when ALL apply):
   - **Different morphological form**: Different derived forms (e.g., Form I vs Form IV) that produce distinct semantic fields
   - **Independent lexical tradition**: Classical lexicons treat them as separate headwords
   - **No shared semantic core**: The meanings cannot be explained as extensions of a single root concept
   - **User confusion risk**: Keeping them unified would mislead non-specialist readers

3. **Cases currently marked keep-separate that SHOULD be unified**:
   Based on analysis of the 23 duplicate groups, the following appear to be extraction artifacts rather than genuine polysemy:
   - `al-haqq` / `haqq` — Same word with/without definite article; should be ONE entry with sense enumeration
   - `al-qalam` / `qalam` — Same word with/without definite article
   - `haneef` / `haneefan` / `hanif` — Same adjective in different grammatical states
   - `muhsin` / `muhsinin` — Same participle singular/plural
   - `sultan` / `sultanan` — Same noun indefinite/accusative
   - `bil-qist` / `bil-qisti` / `qist` — Same noun with/without preposition

4. **Cases correctly kept separate**:
   - `asra` (captives, 8:67) / `isra'` (night journey, 17:1) — Genuinely different semantic fields despite surface similarity
   - `awliya` (allies) / `walayah` (guardianship) — Different morphological patterns with related but distinct meanings
   - `umm al-kitab` / `umm al-qura` — Compound terms with different referents

5. **Remediation action**: Re-evaluate all 23 keep-separate dispositions against the splitting criteria above. Estimated 12–15 groups should be merged into unified entries with sense enumeration.

### Rationale
The classical Arabic lexicographic tradition organizes by root and enumerates senses. Creating separate entries for every surface-form variant fragments the semantic field and obscures the underlying unity of Qur'anic vocabulary. However, genuinely distinct concepts (even if etymologically related) deserve separate treatment when their semantic divergence is significant enough to cause reader confusion.

---

## Q19: Root Disagreements — Preserve Competing Analyses

### Question
Preserve competing analyses without forcing resolution? Define display and storage rules.

### Evidence
- Root Disagreement Register documents **8 terms** with legitimate alternative classical analyses (root-disagreement-register.json).
- Disagreement types span: etymological dispute (ababil, sijjeel), morphological dispute (al-ma'un), derivational dispute (al-kawthar), toponym dispute (al-judiyy), loanword dispute (al-tin), huruf muqattaat (alif-lam-mim), semantic dispute (ghassaq).
- All 8 entries have `recommendedDisposition` values: `record-all-alternatives` (5), `primary-k-th-r-note-proper-noun-view` (1), `note-toponym-uncertainty` (1), `no-root-defer-to-tafsir` (1).
- Root Remediation Report confirms these represent "legitimate alternative classical analyses" not computational errors (line 150).

### Policy Recommendation

**ADOPT: Multi-root storage with primary designation and full alternative preservation.**

1. **Storage schema**:
   ```json
   {
     "termKey": "ababil",
     "primaryRoot": "ببل",
     "alternativeRoots": ["ابل", "بيل"],
     "rootDisagreement": {
       "type": "etymological-dispute",
       "disposition": "record-all-alternatives",
       "sources": ["Lane Lexicon", "Lisan al-Arab", "Al-Qurtubi"],
       "scholarlyNote": "Some scholars derive from a-b-l (flocks/camels), others from b-b-l (non-Arabic loanword), others consider it a proper noun with no triliteral root."
     }
   }
   ```

2. **Primary root selection rules**:
   - If majority of classical sources agree → that root is primary
   - If no majority → most widely attested in pre-Islamic poetry is primary
   - If purely speculative → mark primary as `null` with `disposition: "defer-to-tafsir"`
   - Primary root is used for indexing and cross-referencing; alternatives are always visible

3. **Display rules**:
   - **Scholarly view**: Show primary root with badge "⚠️ Disputed" linking to full disagreement panel
   - **General view**: Show primary root only, with footnote indicator
   - **Disagreement panel**: List all alternatives with source attributions, clearly labeled as scholarly opinions (not platform assertions)
   - **Never**: Present any single analysis as definitively correct when classical sources disagree

4. **Special case: Huruf muqattaat** (`alif-lam-mim`):
   - `primaryRoot: null`
   - `alternativeRoots: []`
   - Display: "Disjointed letters — meaning deferred to tafsīr tradition"
   - Link to tafsīr summary panel with major opinions (Tabari, Qurtubi, Ibn Kathir, Suyuti)

5. **Review trigger**: Any term with `rootDisagreement` MUST be reviewed by a qualified scholar before being marked as approved. AI-assisted analysis provides candidate documentation only.

### Rationale
Qur'anic root etymology is a legitimate domain of scholarly disagreement. Forcing artificial resolution would misrepresent the Islamic intellectual tradition. The multi-root storage model preserves scholarly integrity while maintaining functional indexing through primary designation.

---

## Q20: Morphology Null Values — Legitimate Absence vs Gap

### Question
Acceptable representation of insufficient evidence? Define when null is correct vs when it indicates a gap.

### Evidence
- Root Remediation Report identifies **54 terms lacking root assignments** (lines 73–76).
- These 54 terms fall into 5 categories: phrasal/compound terms, hapax legomena, huruf muqattaat, grammatical particles, and processing gaps (lines 78–84).
- Of these, only huruf muqattaat and some grammatical particles legitimately lack roots; the rest represent gaps.
- The systemic slug defect affected **235 of 451 root keys** (line 91), meaning many apparent nulls may actually be corrupted assignments.

### Policy Recommendation

**ADOPT: Typed null system distinguishing legitimate absence from remediation gaps.**

1. **Null taxonomy**:

   | Null Type | Code | Meaning | Action Required |
   |-----------|------|---------|-----------------|
   | Legitimate absence | `NULL_NATURE` | Term type does not have a triliteral root (particles, proper nouns, loanwords, huruf muqattaat) | None; document reason |
   | Insufficient evidence | `NULL_EVIDENCE` | Root exists but cannot be determined from available sources | Flag for scholarly review |
   | Processing gap | `NULL_GAP` | Term was missed during automated extraction pipeline | Assign to remediation queue |
   | Corrupted assignment | `NULL_CORRUPT` | Previous assignment was invalid (slug defect); not yet corrected | Priority remediation |

2. **Classification rules for the 54 unassigned terms**:

   - **NULL_NATURE** (legitimate): `alif-lam-mim` (huruf muqattaat), `ham` (particle), `hillun` (functional word)
   - **NULL_EVIDENCE** (needs review): `ababil` (disputed etymology), `iram` (rare toponym), `wadd` (pre-Islamic deity name)
   - **NULL_GAP** (processing miss): `awliya`, `walayah`, `waliy` (should have been assigned w-l-y), `nabi` (should have n-b-'), `yatim` (should have y-t-m)
   - **NULL_CORRUPT**: Any term whose previous root assignment was among the 235 invalid slugs

3. **Storage format**:
   ```json
   {
     "root": null,
     "rootNullType": "NULL_GAP",
     "rootNullReason": "Term 'awliya' derives from w-l-y but was missed during batch extraction",
     "remediationPriority": "high"
   }
   ```

4. **Display rules**:
   - `NULL_NATURE`: Display "N/A" with tooltip explaining why
   - `NULL_EVIDENCE`: Display "Under review" with link to disagreement panel
   - `NULL_GAP`: Display "Pending assignment" (internal/admin view only)
   - `NULL_CORRUPT`: Display "Correction in progress" (internal/admin view only)

5. **Remediation SLA**: All `NULL_GAP` and `NULL_CORRUPT` entries must be resolved before the index reaches scholarly-approved status.

### Rationale
A bare `null` conflates fundamentally different situations. Typed nulls enable accurate reporting ("X terms legitimately lack roots" vs "Y terms need work"), prevent false completeness claims, and provide actionable queues for remediation teams.

---

## Q21: 235 Systemic Slug Defects — Verification Workflow

### Question
Scholarly verification workflow for corrections identified by WS2?

### Evidence
- Root Remediation Report discovered **235 of 451 root keys are invalid slugs** (line 91).
- Primary defect pattern: erroneous prepending of Arabic prefix letters (lam, ba, fa, ta) to valid roots (lines 91–96).
- Audit results: 272 valid, 100 corrected via lexical lookup, 223 unresolved (lines 99–105).
- 9 critical errors from MFD-11.4 WS4 fully investigated and documented (lines 111–125).
- All corrections carry `reviewStatus: pending-scholarly-review` (line 173).

### Policy Recommendation

**ADOPT: Three-tier verification workflow with escalating scholarly involvement.**

#### Tier 1: Automated Validation (No Scholar Required)
- **Scope**: Corrections where the proposed root exactly matches an existing file in `data/root-occurrences/` AND the semantic mapping is unambiguous
- **Count estimate**: ~100 terms (the lexical-lookup corrections already validated against root-occurrences infrastructure)
- **Verification**: Automated check that proposed slug exists + Arabic surface text verifies against quran-json corpus
- **Output**: Mark as `verified-computational`; still requires scholarly sign-off but lower priority

#### Tier 2: Semi-Automated Review (Scholar Spot-Check)
- **Scope**: Corrections where the proposed root exists in root-occurrences but the semantic mapping requires judgment (e.g., multiple possible roots for the same surface form)
- **Count estimate**: ~123 terms
- **Process**: AI generates correction proposal with evidence; scholar reviews batch of 20–30 terms per session using structured review interface
- **Output**: Mark as `verified-scholarly` or `rejected-with-rationale`

#### Tier 3: Full Scholarly Analysis (Manual Investigation)
- **Scope**: Terms where no root-occurrences match exists, or where the correction itself is disputed
- **Count estimate**: ~100 terms (the 223 unresolved minus those resolvable at Tier 2)
- **Process**: Scholar conducts original research using classical lexicons (Lane, Lisān al-ʿArab, Taj al-ʿArūs) and tafsīr sources
- **Output**: New root assignment with full provenance, or `NULL_EVIDENCE` with documented rationale

#### Pipeline Integration
1. **Fix the extraction algorithm** that caused prefix-prepending BEFORE running any further batch operations
2. **Apply Tier 1 corrections** immediately (automated, logged, reversible)
3. **Queue Tier 2 batches** for scholarly review sessions (estimated 4–6 sessions of 30 terms each)
4. **Assign Tier 3 terms** to specialist researchers with domain expertise
5. **Re-run corpus verification** after all corrections applied to confirm no regressions

#### Quality Gates
- No correction enters production without passing its tier's verification gate
- All corrections retain version history with before/after values
- Batch corrections require sign-off from at least one qualified reviewer
- Regression testing: verify that corrected slugs resolve to valid root-occurrences files

### Rationale
Treating all 235 defects uniformly would either waste scholarly time on trivially verifiable corrections or rush complex cases through inadequate review. The tiered approach matches verification rigor to correction complexity, maximizing throughput while maintaining scholarly integrity.

---

## Q22: 23 Duplicate Groups — Polysemy vs Artifact Criteria

### Question
Criteria for distinguishing genuine polysemy from extraction artifacts?

### Evidence
- Duplicate detection found **23 groups comprising 50 terms** (Lexical Quality Report lines 20–21).
- All 23 received disposition `keep-separate` with identical rationale: "Distinct glosses suggest genuine polysemy or contextual sense differentiation" (duplicate-resolution-register.json).
- However, inspection reveals many groups differ only by:
  - Presence/absence of definite article (al-)
  - Grammatical case endings (tanwīn)
  - Prepositional prefixes (bi-, li-)
  - Singular/plural forms
- These are extraction artifacts, not genuine polysemy.

### Policy Recommendation

**ADOPT: Four-criteria test for genuine polysemy vs extraction artifact.**

#### The Four-Criteria Test
A pair/group should be classified as **genuine polysemy** (keep separate) ONLY if it satisfies AT LEAST TWO of:

| Criterion | Description | Example (Genuine) | Example (Artifact) |
|-----------|-------------|-------------------|--------------------|
| C1: Morphological independence | Different derived forms (I, II, III, IV, etc.) or different patterns | `awliya` (pl. active participle) vs `walayah` (verbal noun) | `haneef` vs `haneefan` (same adjective, different case) |
| C2: Semantic divergence | Meanings cannot be explained as contextual extensions of one concept | `asra` (captives) vs `isra'` (night journey) | `al-haqq` (the truth) vs `haqq` (truth) — same concept |
| C3: Independent lexical tradition | Classical lexicons list as separate headwords | Lane lists `walayah` and `awliya` under same root but as distinct entries | Lane lists `qalam` once; `al-qalam` is just definite form |
| C4: Distinct user-facing function | Users would search for these as separate concepts | `umm al-kitab` (Mother of Book) vs `umm al-qura` (Mother of Cities) | `bil-qist` vs `qist` — same concept, prepositional phrase vs noun |

#### Reclassification of Current 23 Groups

| Group | Current | Proposed | Rationale |
|-------|---------|----------|-----------|
| البيت (al-bayt-al-ma'mur / rabb-hadha-al-bayt) | keep-separate | **MERGE** | Same noun bayt; compounds should be senses under bayt entry |
| الحق (al-haqq / haqq) | keep-separate | **MERGE** | Definite/indefinite variant of same word |
| القلم (al-qalam / qalam) | keep-separate | **MERGE** | Definite/indefinite variant |
| الروح (al-ruh / ruh) | keep-separate | **MERGE** | Definite/indefinite variant |
| اليقين (al-yaqin / haqq-al-yaqin / ilm-al-yaqin) | keep-separate | **KEEP** | Compound terms with distinct theological concepts (C2+C4) |
| العرش (arsh / dhi-al-arsh / dhu-al-arsh) | keep-separate | **MERGE** | arsh is the noun; dhi/dhu-al-arsh are divine epithets referencing it |
| اسري (asra / isra-) | keep-separate | **KEEP** | Genuine semantic divergence: captives vs night journey (C2+C3) |
| اولياء (awliya / walayah) | keep-separate | **KEEP** | Different morphological forms with distinct semantic ranges (C1+C2) |
| القسط (bil-qist / bil-qisti / qist) | keep-separate | **MERGE** | Prepositional/nominal variants of same word |
| ذكر (dhikr / dhikr-allah) | keep-separate | **MERGE** | dhikr-Allah is a compound phrase under dhikr |
| تغلوا (ghuluww / taghloo) | keep-separate | **KEEP** | Different morphological forms: verbal noun vs verb (C1) |
| حنيفا (haneef / haneefan / hanif) | keep-separate | **MERGE** | Same adjective in different grammatical states |
| سجيل (hijarah-min-sijjil / sijjeel) | keep-separate | **MERGE** | Phrase containing the noun; sijjeel is the headword |
| الحوت (hut / sahib-al-hut) | keep-separate | **MERGE** | sahib-al-hut is an epithet referencing hut |
| كلمه (kalimah / kalimat-al-taqwa) | keep-separate | **MERGE** | Compound phrase under kalimah |
| المحسنين (muhsin / muhsinin) | keep-separate | **MERGE** | Singular/plural of same participle |
| ناقه (naqah / naqat-allah) | keep-separate | **MERGE** | naqat-Allah is construct phrase under naqah |
| نطفه (nutfah / nutfah-amshaj) | keep-separate | **KEEP** | amshaj adds qualifying concept "mixed" (C2) |
| قدر (qadar / qaddara-fa-hada) | keep-separate | **KEEP** | Noun vs verb phrase with distinct semantic range (C1+C2) |
| رسول (rasul / rasul-karim) | keep-separate | **MERGE** | rasul-karim is qualified form of rasul |
| روح (roohun / ruh-minhu) | keep-separate | **MERGE** | ruh-minhu is contextual phrase under ruh |
| سلطنا (sultan / sultanan) | keep-separate | **MERGE** | Indefinite/accusative variant |
| ام (umm-al-kitab / umm-al-qura) | keep-separate | **KEEP** | Distinct compound terms with different referents (C2+C4) |

#### Summary
- **Proposed merges**: 15 groups → consolidate into single entries with sense enumeration
- **Confirmed keep-separate**: 8 groups → genuine polysemy or distinct compounds
- **Net reduction**: ~27 entries eliminated through consolidation

### Rationale
The current blanket `keep-separate` disposition treats extraction artifacts as scholarly findings. Applying rigorous criteria prevents the index from fragmenting single concepts across multiple entries, which degrades both scholarly utility and user experience. The 8 confirmed keep-separate groups represent genuine lexical distinctions worthy of separate treatment.

---

## Cross-Question Dependencies

| Dependency | Upstream | Downstream | Impact |
|------------|----------|------------|--------|
| Q21 → Q19 | Slug defect resolution | Root disagreement analysis | Cannot finalize disagreement dispositions until slugs are corrected |
| Q22 → Q18 | Duplicate reclassification | Polysemy handling policy | Merge decisions determine how sense enumeration is structured |
| Q17 → Q21 | Transliteration standard | Slug correction workflow | Corrected slugs must conform to ISO 233-2 |
| Q20 → Q21 | Null classification | Slug defect remediation | NULL_CORRUPT entries feed directly into Tier 1/2/3 queues |
| Q16 → Q23 | Scope boundary | Gloss prioritization | Only in-scope terms enter the gloss review queue |
| Q18 → Q23 | Polysemy structure | Gloss authoring | Sense enumeration format determines gloss authoring template |

---

## Implementation Sequence

```
Phase A (Immediate):
  Q17 → Finalize transliteration migration
  Q22 → Reclassify 23 duplicate groups
  
Phase B (Week 1-2):
  Q21-Tier1 → Apply automated slug corrections
  Q20 → Classify all 54 null assignments
  
Phase C (Week 2-4):
  Q18 → Restructure merged entries with sense enumeration
  Q19 → Document all 8 root disagreements per storage schema
  Q21-Tier2 → Begin scholarly batch review
  
Phase D (Ongoing):
  Q16 → Maintain curated scope; plan Phase D expansion
  Q21-Tier3 → Specialist research for unresolved terms
  Q23 → Execute gloss prioritization queue (see companion document)
```

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*Generated: 2026-11-21T09:30:00+05:00*
*No production files modified. Research-only output.*