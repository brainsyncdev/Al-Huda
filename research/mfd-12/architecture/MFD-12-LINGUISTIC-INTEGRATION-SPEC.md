# MFD-12 — Arabic Linguistic Data Integration Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Component | WS3 — Linguistic Data Integration |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (agent-96) |
| Review Status | pending-scholarly-review |
| Supersedes | Ad-hoc terminology index structures from MFD-11 Phase C |

---

## 1. Overview

This specification defines how existing Arabic linguistic data sources integrate into the canonical FAHM Knowledge Architecture entities. The integration preserves all scholarly nuance, supports multiple competing analyses per token, and maintains full provenance for every linguistic claim.

### Source Systems

| Source | Records | Role |
|--------|---------|------|
| `data/root-discovery-registry.json` | 1,642 roots | Root metadata, activation status, lemma lists |
| `data/root-occurrences/*.json` | 1,576 files | Verified token-level occurrences against quran-json@3.1.2 |
| `research/mfd-11/reports/root-morphology-index.json` | 649 terms | Morphological patterns and root assignments (to be corrected) |
| `research/mfd-11/reports/MFD-11.5-TERMINOLOGY-SPECIFICATION.md` | N/A | Gloss rubric, transliteration standard, inclusion criteria |

### Canonical Target Entities

- **LexicalEntry** — One per lemma; the dictionary headword with semantic and morphological metadata
- **RootAnalysis** — Root assignment(s) for a lexical entry, supporting multiple competing analyses
- **Lemma** — Normalized citation form linked to a LexicalEntry
- **MorphologicalAnalysis** — Per-occurrence morphological parse tied to a specific verse token
- **TokenReference** — Addressing scheme for individual words within verses

---

## 2. Token-to-Verse Addressing Scheme

### Canonical Format

```
{surah}:{ayah}:{wordPosition}
```

Example: `9:41:4` refers to Surah At-Tawbah, Ayah 41, Word Position 4.

### Definition

- **surah**: Integer 1–114
- **ayah**: Integer 1–N (where N is the number of ayat in that surah)
- **wordPosition**: 1-based integer index of the token within the ayah's `text` field in `quran-json@3.1.2`

### Constraints

- Word positions are defined by exact string match against the pinned corpus (`quran-json@3.1.2`), NOT by whitespace splitting or transliteration approximation.
- Multiple tokens in the same ayah each receive distinct wordPosition values.
- The triplet `(surah, ayah, wordPosition)` is globally unique across the entire Qur'an.

### Mapping from Existing Data

The `root-occurrences/*.json` files already use this scheme via `ref.surah`, `ref.ayah`, and `wordPosition`. No transformation is required.

---

## 3. LexicalEntry Integration

### Source → Target Mapping

A **LexicalEntry** corresponds to one unique lemma as defined in `data/root-occurrences/{root}.json → entry.includedLemmas[]`.

| Canonical Field | Source | Notes |
|----------------|--------|-------|
| `id` | Generated UUID | Stable identifier independent of slug changes |
| `lemma.arabic` | `includedLemmas[i]` | Exact diacritical form from root-occurrences |
| `lemma.transliteration` | Derived via ISO 233-2 | Per MFD-11.5 §4 transliteration standard |
| `lemma.searchAliases` | Computed | Simplified variants for user-facing search |
| `root.primary` | `entry.roots[0]` | Primary root assignment |
| `root.alternatives` | See §6 | Competing root analyses if disputed |
| `partOfSpeech` | Inferred from pattern | noun / verb / adjective / particle / phrase |
| `morphologicalPattern` | `root-morphology-index.json → morphologicalPatterns` | e.g., "Form III", "mafʿūl", "faʿil" |
| `gloss` | Per MFD-11.5 §5 rubric | Four-layer structure: lexical, contextualSenses, tafsirNote, editorialGloss |
| `provenance` | See §7 | Required for every entry |
| `confidence` | `root-morphology-index.json → confidence` OR `entry.reviewState` | high / medium / low / disputed |

### What Is Gained

- Structured four-layer gloss replacing flat text descriptions
- Explicit search aliases alongside scholarly transliteration
- Direct link to verified corpus occurrences (not extracted fragments)
- Support for alternative root analyses without data loss

### What Is Lost

- Nothing substantive. The legacy `arabic-terminology-index.json` flat structure is fully subsumed.
- Legacy Phase C extraction artifacts (whitespace-split fragments) are explicitly excluded per MFD-11.5 §2.

### Polysemy Handling

One LexicalEntry per lemma. Contextual senses are enumerated as sub-entries within `gloss.contextualSenses[]`. Separate LexicalEntries are created ONLY when classical lexicography treats them as distinct homographs (different roots despite identical spelling).

---

## 4. RootAnalysis Integration

### Source → Target Mapping

A **RootAnalysis** represents one scholarly opinion about which root a lexical entry derives from.

| Canonical Field | Source | Notes |
|----------------|--------|-------|
| `root` | `root-morphology-index.json → roots[key].root` | Triliteral/quadriliteral in Arabic script |
| `rootTranslit` | `root-morphology-index.json → roots[key].rootTranslit` | ISO 233-2 transliteration |
| `lexicalFamily` | `root-morphology-index.json → roots[key].lexicalFamily` | Semantic field description |
| `confidence` | `root-morphology-index.json → roots[key].confidence` | high / medium / low / disputed |
| `assertedBy` | Provenance record | Scholar, computational system, or review body |
| `assertedAt` | ISO 8601 timestamp | When this analysis was made |
| `source` | Reference to lexicon or methodology | e.g., "Lane's Lexicon", "Hans Wehr", "automated-morphology-review" |
| `rationale` | Free text | Why this root was selected over alternatives |

### Multiple Analyses Per Entry

When `root-morphology-index.json` marks `confidence: "medium"` or `"disputed"`, or when MFD-11.5 §8 identifies a root disagreement:

```json
{
  "rootAnalyses": [
    {
      "root": "ن-ف-ق",
      "confidence": "high",
      "assertedBy": "Lane's Lexicon",
      "primary": true,
      "rationale": "Classical consensus for al-munafiqeen"
    },
    {
      "root": "ل-م-ن",
      "confidence": "low",
      "assertedBy": "automated-morphology-review",
      "primary": false,
      "rationale": "Erroneous assignment from Sprint 48; flagged by WS2 audit"
    }
  ]
}
```

The `primary: true` analysis is used for default display and indexing. All analyses are preserved and queryable.

### Critical Error Remediation

The 7 known WRONG_ROOT_KNOWN errors from MFD-11.5 Integrity Audit must be represented as non-primary RootAnalysis entries with explicit correction provenance referencing the WS2 findings.

---

## 5. Lemma Integration

### Source → Target Mapping

Lemmas come from `data/root-occurrences/{root}.json → entry.includedLemmas[]`.

| Canonical Field | Source | Notes |
|----------------|--------|-------|
| `arabic` | `includedLemmas[i]` | Exact form with full tashkeel |
| `transliteration` | Computed via ISO 233-2 | Single canonical transliteration |
| `searchAliases` | Computed | Array of simplified variants |
| `parentLexicalEntry` | FK to LexicalEntry.id | Each lemma belongs to exactly one entry |
| `verifiedOccurrences` | Count from root-occurrences | Number of corpus matches for this specific lemma |

### Key Design Decision

Lemmas are NOT independently authored. They are extracted deterministically from `data/root-occurrences/` which has been validated against the pinned corpus. Any lemma not present in root-occurrences requires explicit scholarly justification before inclusion.

### Duplicate Resolution

The 16 duplicate groups identified in MFD-11.5 Integrity Audit are resolved by:
1. Normalizing Arabic text (removing alif-lām, normalizing hamza, removing trailing tāʾ marbūṭa variations)
2. Checking whether normalized forms map to the same root AND same contextual sense
3. If yes → merge into single LexicalEntry with combined occurrence counts
4. If no → retain as separate entries with explicit disambiguation note

---

## 6. MorphologicalAnalysis Integration

### Critical Principle

**MorphologicalAnalysis is occurrence-specific.** It describes the morphological state of a particular token at a particular verse position. It is NEVER copied wholesale from a dictionary entry.

### Source → Target Mapping

Each entry in `data/root-occurrences/{root}.json → occurrences[]` generates one MorphologicalAnalysis.

| Canonical Field | Source | Notes |
|----------------|--------|-------|
| `tokenReference` | `{surah}:{ayah}:{wordPosition}` | Per §2 addressing scheme |
| `matchedToken` | `occurrences[i].matchedToken` | Exact surface form from corpus |
| `matchedLemma` | `occurrences[i].matchedLemma` | Link to Lemma entity |
| `matchedRoot` | `occurrences[i].matchedRoot` | Link to RootAnalysis |
| `form` | Derived from lemma + context | Verb form number or noun pattern |
| `pattern` | Specific ṣīghah template | e.g., "fāʿala", "mafʿūl" |
| `pos` | Part of speech in this occurrence | May differ from lemma's default POS |
| `prefixes` | Parsed from matchedToken | al-, wa-, fa-, li-, bi-, etc. |
| `suffixes` | Parsed from matchedToken | Pronominal suffixes, case endings |
| `confidence` | Inherited or computed | Per-analysis confidence level |
| `alternativeAnalyses` | Array | Competing parses for ambiguous tokens |

### Alternative Analyses Per Token

When a token admits multiple valid morphological parses:

```json
{
  "morphologicalAnalyses": [
    {
      "tokenReference": "2:282:123",
      "matchedToken": "وَيُعَلِّمُكُمُ",
      "matchedLemma": "عَلَّمَ",
      "form": "Form II",
      "pattern": "yufaʿʿilu",
      "pos": "verb",
      "prefixes": ["wa-"],
      "suffixes": ["-kum"],
      "confidence": "high",
      "primary": true
    },
    {
      "tokenReference": "2:282:123",
      "matchedToken": "وَيُعَلِّمُكُمُ",
      "matchedLemma": "عَلِمَ",
      "form": "Form I",
      "pattern": "yufaʿʿilu",
      "pos": "verb",
      "prefixes": ["wa-"],
      "suffixes": ["-kum"],
      "confidence": "low",
      "primary": false,
      "rationale": "Possible Form I reading rejected by majority of grammarians"
    }
  ]
}
```

### Relationship to Dictionary Entries

The LexicalEntry stores the *canonical* morphological information (default form, pattern, POS). The MorphologicalAnalysis stores the *actual* morphological state of each occurrence. These may differ due to:
- Prefixed/suffixed forms
- Context-dependent POS shifts
- Orthographic variations in the Uthmani script

---

## 7. Source and Reviewer Provenance

### Required Provenance Fields

Every linguistic claim (root assignment, gloss, morphological parse, lemma inclusion) MUST include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assertedBy` | string | Yes | Person, system, or review body |
| `assertedAt` | ISO 8601 | Yes | Timestamp of assertion |
| `source` | string | Conditional | Reference work or dataset (required for scholarly claims) |
| `methodology` | string | Conditional | How the claim was derived (required for computational claims) |
| `reviewState` | enum | Yes | auto-accepted / pending-scholarly-review / scholar-approved / disputed / retracted |
| `reviewedBy` | string | Conditional | Required when reviewState is scholar-approved |
| `reviewedAt` | ISO 8601 | Conditional | Required when reviewState is scholar-approved |
| `supersededBy` | FK | Optional | Points to replacement if this claim was superseded |

### Provenance Levels

1. **Computational**: Generated by automated morphology review (e.g., Sprint 48). `assertedBy: "automated-morphology-review"`, `methodology: "deterministic-validation"`. Default `reviewState: "auto-accepted"`.
2. **Scholarly**: Authored or reviewed by a named scholar. Requires `source` reference to classical lexicon or tafsīr work.
3. **Editorial**: FAHM project classification decisions. `assertedBy: "fahm-editorial"`, `methodology: "taxonomy-classification"`.
4. **Corrective**: Fixes to prior errors. Must include `supersededBy` or explicit correction rationale referencing the audit finding.

---

## 8. Uncertainty Handling

### Confidence Levels

| Level | Meaning | Display Behavior |
|-------|---------|------------------|
| `high` | Strong scholarly consensus or deterministic validation | Default display, no warning |
| `medium` | Plausible but not universally agreed | Displayed with subtle indicator |
| `low` | Weak evidence or minority opinion | Displayed only in detailed view |
| `disputed` | Active scholarly disagreement | All competing views shown equally |

### Flow Through the System

1. **Root Level**: `RootAnalysis.confidence` propagates to all Lemmas under that root unless overridden.
2. **Lemma Level**: `LexicalEntry.confidence` may override root-level confidence for specific lemmas.
3. **Occurrence Level**: `MorphologicalAnalysis.confidence` is independent; a high-confidence lemma may have a low-confidence parse at a specific occurrence.
4. **Gloss Level**: Individual `contextualSenses` may carry their own confidence independent of the entry-level confidence.

### Disputed Analyses

When `confidence: "disputed"`:
- ALL competing analyses are displayed with equal visual weight
- No primary analysis is designated
- User interface must clearly indicate the dispute exists
- API responses include all analyses in the `alternativeAnalyses` array

### Retracted Claims

Claims that have been superseded (e.g., the 7 WRONG_ROOT_KNOWN errors) are:
- Retained in the database with `reviewState: "retracted"`
- Linked to their replacement via `supersededBy`
- Never deleted (preserving audit trail)
- Excluded from default queries unless explicitly requested

---

## 9. Integration Gaps Identified

### Gap 1: Missing Morphological Pattern Data

476 of 649 terms in `root-morphology-index.json` have `"undetermined pattern"`. The canonical model requires explicit `form` and `pattern` fields for every MorphologicalAnalysis.

**Resolution**: Computational morphology cross-reference against `data/root-occurrences/` lemma data can resolve most cases. Remaining gaps require scholarly review.

### Gap 2: No Per-Occurrence Morphology in Current Data

`data/root-occurrences/*.json` provides `matchedToken`, `matchedLemma`, and `matchedRoot` but does NOT include parsed prefixes, suffixes, or verb form numbers per occurrence.

**Resolution**: A new processing pipeline must parse each `matchedToken` to extract morphological components. This is a prerequisite for populating MorphologicalAnalysis entities.

### Gap 3: Gloss Data Not Yet Structured

Existing terminology index entries have flat-text glosses, not the four-layer structure required by MFD-11.5 §5.

**Resolution**: Gloss migration requires scholarly authoring. Computational extraction of lexical meaning is possible; contextual senses and tafsīr notes require manual curation.

### Gap 4: 358 Roots Missing from Infrastructure

MFD-11.5 Integrity Audit found 358 terms whose roots are not represented in `data/root-occurrences/`.

**Resolution**: These terms cannot be integrated until their root-occurrences files are generated and validated against the corpus.

### Gap 5: Transliteration Standardization

Only 1 transliteration issue was flagged in the audit, but systematic verification against ISO 233-2 has not been performed for all 649 terms.

**Resolution**: Automated transliteration generation from Arabic text using ISO 233-2 rules, with manual review of edge cases.

---

## 10. Design Decisions Summary

| Decision | Rationale |
|----------|-----------|
| MorphologicalAnalysis is occurrence-specific, not dictionary-derived | Tokens in context may differ from citation forms; copying introduces errors |
| Multiple RootAnalysis entries per LexicalEntry | Preserves scholarly disagreement without forcing premature resolution |
| Token addressing uses `(surah, ayah, wordPosition)` triplet | Globally unique, aligns with existing root-occurrences infrastructure |
| Lemmas extracted from root-occurrences, not authored independently | Ensures every lemma has verified corpus attestation |
| Provenance is mandatory, not optional | Every linguistic claim must be traceable to its source |
| Retracted claims preserved, not deleted | Audit trail integrity; enables reproducibility |
| Confidence flows hierarchically but can be overridden at any level | Reflects reality that a well-attested root may have uncertain individual occurrences |
| One LexicalEntry per lemma, multiple senses within | Avoids artificial fragmentation while supporting polysemy |

---

*This specification is a proposal awaiting scholarly review. No production files have been modified.*
*proposedBy: "ai-assisted (agent-96)" | reviewStatus: "pending-scholarly-review"*
