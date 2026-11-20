# MFD-11.5 — Arabic Terminology Remediation Specification

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 (Arabic Terminology Remediation) |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-scholarly-review |
| Supersedes | mfd11-phasec-arabic-terms.mjs extraction methodology |

---

## 1. Scope Definition: Curated Thematic Lexicon

The Arabic terminology index is a **curated thematic lexicon**, not an exhaustive Qur'anic word list.

### Inclusion Criteria
A term qualifies for inclusion if it meets at least one of these conditions:
1. It represents a concept identified in the MFD-11 Pass A extraction as a distinct Qur'anic subject matter (e.g., *tawḥīd*, *ṣabr*, *jihād*, *mīthāq*).
2. It is a key morphological form of a root that carries significant theological, legal, ethical, or narrative weight across multiple surahs.
3. It was explicitly extracted as a `terminology` entry in any of the 473 passage extraction records.

### Exclusion Criteria
1. Common grammatical particles and prepositions unless they carry specific theological meaning (e.g., *inna*, *laysa* excluded; *lawlā* included only where exegetically significant).
2. Proper nouns already covered by dedicated extraction categories (prophet names, place names) unless they function as conceptual terms.
3. Hapax legomena with no broader conceptual significance beyond their immediate narrative context.

### Denominator
The target denominator is the set of all terms meeting inclusion criteria above, estimated at 800–1,200 unique lemmas based on the 1,576 roots already catalogued in `data/root-occurrences/`. The current 649-term index is a subset that must be expanded systematically, not arbitrarily.

---

## 2. Data Source Architecture

**Critical finding from MFD-11.4 WS4:** The original Phase C extraction pipeline (`scripts/mfd11-phasec-arabic-terms.mjs`) whitespace-split candidate evidence excerpts, producing fragments rather than verified corpus occurrences. This is the root cause of the ~7% coverage estimate.

**MFD-11.5 authoritative source:** The existing `data/root-occurrences/*.json` infrastructure (1,576 root files) contains validated lemma-to-verse mappings with word positions against the pinned `quran-json@3.1.2` corpus. Example: root ج-ه-د has 41 verified occurrences across 36 āyāt with 5 lemmas (جَهْد، جَٰهَدَ، جُهْد، جِهَاد، مُجَٰهِدِين), all auto-accepted via deterministic morphology review.

### Pipeline
```
data/root-occurrences/{root}.json  →  Lemma extraction + occurrence verification
                                      ↓
research/mfd-11/extractions/*.json  →  Cross-reference: which extracted passages use this term
                                      ↓
Terminology index entry             →  Root + lemma + form + occurrences + gloss + provenance
```

No term should appear in the index without its occurrences being verifiable against `data/root-occurrences/` OR the pinned corpus directly.

---

## 3. What Constitutes an "Occurrence"

An occurrence is defined as:
- A specific token in the pinned `quran-json@3.1.2` Arabic text (`verses[].text`) that matches a lemma derived from the target root.
- Identified by surah number, ayah number, and word position within the ayah.
- Verified by exact string match (with diacritics) against the corpus, NOT by transliteration approximation or English keyword search.

### Counting Methodology
- **Lemma occurrences**: Each appearance of a specific morphological form counts as one occurrence.
- **Root occurrences**: Sum of all lemma occurrences under that root.
- **Distinct āyāt**: Number of unique surah:ayah pairs containing any form of the root.
- Repeated forms within a single ayah each count separately (e.g., if *Allāh* appears twice in one verse, that is 2 occurrences, 1 distinct ayah).

Percentage-based coverage claims must state: numerator (indexed occurrences), denominator (total corpus occurrences of included terms), counting methodology (lemma vs. root vs. distinct ayah), and treatment of repeated forms.

---

## 4. Transliteration Standard

Adopt **ISO 233-2** as the primary scholarly transliteration standard with simplified search aliases.

### Conventions
| Arabic | ISO 233-2 | Search Alias |
|--------|-----------|--------------|
| ء / ئ / ؤ | ʾ | ' |
| ع | ʿ | ` |
| ث | ṯ | th |
| ح | ḥ | h |
| خ | ḫ | kh |
| ذ | ḏ | dh |
| ش | š | sh |
| ص | ṣ | s |
| ض | ḍ | d |
| ط | ṭ | t |
| ظ | ẓ | z |
| غ | ġ | gh |
| ق | q | q |
| ا (long ā) | ā | a |
| و (long ū) | ū | u |
| ي (long ī) | ī | i |
| ة | ah (pausal) / at (construct) | a |

### Rules
1. Every term entry stores exactly ONE primary transliteration in ISO 233-2.
2. A `searchAliases` array provides simplified variants for user-facing search.
3. Alif-lām prefix is always rendered `al-` with hyphen, never doubled (`al--`).
4. Shadda is represented by doubling the consonant letter.
5. Hamzat al-waṣl is not transliterated in initial position.

---

## 5. Gloss Authoring Rubric

Every gloss must distinguish four layers:

| Layer | Definition | Example for جِهَاد |
|-------|-----------|---------------------|
| **Lexical meaning** | Core semantic value of the root/form independent of context | "striving, exertion, effort" |
| **Contextual sense** | Meaning established by the specific āyah's siyāq | "armed struggle in Allah's way" (9:41) vs. "striving with the Qur'an" (25:52) |
| **Tafsīr interpretation** | Exegetical understanding from classical sources | "Ibn Kathir: includes both inner struggle and armed combat" |
| **Editorial gloss** | FAHM's proposed classification for taxonomy purposes | "Comprehensive striving encompassing spiritual and physical dimensions" |

### Required Format
```json
{
  "gloss": {
    "lexical": "striving, exertion",
    "contextualSenses": [
      {"sense": "spiritual striving", "verses": ["29:69", "25:52"]},
      {"sense": "armed struggle", "verses": ["9:41", "9:44"]}
    ],
    "tafsirNote": "Classical exegetes distinguish greater/lesser jihad; this distinction is hadith-derived, not explicit in Qur'anic text",
    "editorialGloss": "Comprehensive striving in Allah's cause"
  }
}
```

### Prohibitions
- Do NOT assign a single gloss to a polysemous term without noting contextual senses.
- Do NOT derive gloss primarily from English translation (Saheeh International); start from Arabic semantics.
- Do NOT present tafsīr interpretation as Qur'anic fact; label it explicitly.

---

## 6. Morphological Representation

Each term entry must include:

| Field | Description | Example |
|-------|-------------|---------|
| `root` | Triliteral/quadriliteral root | "ج-ه-د" |
| `lemma` | Dictionary citation form | "جَاهَدَ" |
| `form` | Verb form number or noun pattern | "Form III" / "mafʿūl" |
| `pattern` | Specific ṣīghah template | "fāʿala" / "mafʿūl" |
| `pos` | Part of speech | "verb" / "noun" / "active participle" |
| `morphConfidence` | high / medium / low / disputed | "high" |

### Uncertainty Representation
When morphological analysis is uncertain:
- Set `morphConfidence` to "low" or "disputed"
- Provide `alternativeAnalyses` array with competing scholarly views
- Never leave fields null; use "undetermined" only with explicit rationale

Target: resolve all 476 currently undetermined patterns using computational morphology cross-referenced against `data/root-occurrences/` lemma data.

---

## 7. Polysemy Handling

One lexical entry per lemma, with contextual senses enumerated as sub-entries. Separate entries are created ONLY when:
1. Classical Arabic lexicography treats them as distinct homographs (different roots despite identical spelling).
2. The semantic distance between senses is so great that a single entry would mislead (e.g., *ummah* as "community" vs. *ummah* as "period of time" — though both derive from same root, they may warrant separate treatment if exegetically distinct).

Default: **one entry, multiple senses.**

---

## 8. Root Disagreements

When classical lexicons disagree on root assignment:
- Preserve ALL competing analyses in an `alternativeRoots` array.
- Flag the entry with `"rootDisputed": true`.
- Select the most widely attested classical analysis as primary, with rationale.
- Never silently resolve a genuine scholarly disagreement.

---

## 9. Reproducibility Requirements

The following must accompany the index:
1. This specification document (versioned).
2. The extraction script that reads `data/root-occurrences/` and produces the index deterministically.
3. A test suite that verifies every indexed occurrence against the pinned corpus.
4. Version pinning: `quran-json@3.1.2`, ISO 233-2 edition, Hans Wehr edition, Lane's Lexicon reference.

Another researcher must be able to run the script against the same inputs and produce byte-identical output.

---

## 10. Relationship to Existing Infrastructure

| Existing Asset | Role in MFD-11.5 |
|---------------|------------------|
| `data/root-occurrences/*.json` (1,576 files) | **Authoritative source** for lemma-to-verse mappings |
| `data/root-discovery-registry.json` (1,642 roots) | Root metadata, status, activation history |
| `research/mfd-11/extractions/*.json` (473 files) | Cross-reference: which terms were identified during Pass A extraction |
| `research/mfd-11/reports/root-morphology-index.json` | Starting point for morphological data; to be corrected and expanded |
| `research/mfd-11/reports/arabic-terminology-index.json` | Legacy Phase C output; to be superseded, not patched |
| `node_modules/quran-json/dist/chapters/en/*.json` | Pinned corpus for all Arabic text verification |

---

## 11. Scholarly Review Questions

1. Is the curated thematic lexicon scope appropriate, or should FAHM aim for comprehensive coverage of all Qur'anic vocabulary?
2. Should the gloss rubric's four-layer structure be adopted, or does it introduce unnecessary complexity for end users?
3. Which transliteration standard best serves FAHM's multilingual audience while maintaining scholarly precision?
4. How should disputed root assignments be presented in the user interface versus the research data layer?
5. Is the reliance on `data/root-occurrences/` (auto-accepted via Sprint 48 morphology review) sufficiently validated, or does it require independent scholarly verification before serving as the terminological foundation?

---

*This specification is a proposal awaiting scholarly review. No production changes have been made.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
