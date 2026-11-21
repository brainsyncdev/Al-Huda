# MFD-11.5 — Gloss Quality Rubric

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS4 (Lexical Quality) |
| Date | 2026-11-21 |
| Reference | MFD-11.5-TERMINOLOGY-SPECIFICATION.md §5 |
| Status | Applied to all 649 terms |

---

## Four-Layer Gloss Structure

### Layer 1: Lexical Meaning
Core semantic value of the root/form independent of context. Source: classical Arabic lexicography.
Example for جِهَاد: "striving, exertion, effort"
Failure mode: Circular definition restating the Arabic term.

### Layer 2: Contextual Sense
Meaning established by the specific āyah's siyāq. Source: verse analysis.
Example: "armed struggle" (9:41) vs. "striving with the Qur'an" (25:52)
Failure mode: Collapsing multiple senses into one undifferentiated gloss.

### Layer 3: Tafsīr Interpretation
Exegetical understanding from classical sources, explicitly labeled.
Example: "Ibn Kathir: includes both inner struggle and armed combat"
Failure mode: Presenting tafsīr as Qur'anic fact without attribution.

### Layer 4: Editorial Gloss
FAHM's proposed classification for taxonomy purposes.
Example: "Comprehensive striving encompassing spiritual and physical dimensions"
Failure mode: Editorial gloss contradicting layers 1-3.

---

## Quality Flags

| Flag | Definition | Remedy |
|------|-----------|--------|
| CIRCULAR | Restates term without semantic content | Provide independent definition |
| TOO_BROAD | So general it applies to many terms | Narrow to specific semantic field |
| TRANSLATION_DEPENDENT | Derived from English translation not Arabic semantics | Ground in classical lexicon first |
| POLYSEMY_COLLAPSED | Multiple senses merged into one gloss | Enumerate senses with verse refs |
| EDITORIAL_ONLY | Only Layer 4 provided | Add Layers 1-3 |
| MISSING_TAFSIR_NOTE | Significant exegetical discussion but no tafsīr layer | Add brief classical source note |

---

## Adequacy Threshold

A gloss is adequate if it provides at minimum:
1. ✅ Lexical meaning (Layer 1)
2. ✅ At least one contextual sense with verse reference (Layer 2)
3. ⚠️ Tafsīr note where exegetically significant (Layer 3)
4. ✅ Editorial gloss for taxonomy (Layer 4)

Current index: ~98% provide ONLY Layer 4.

*No production changes made. Research-only output.*
