# WS-A Consolidated Scholarly Review Package — MFD-12.1

- **Workstream:** MFD-12.1 WS-A (Conceptual Framework Scholarly Review Preparation)
- **Agent:** WS-A / agent-103
- **Generated At:** 2026-11-21T09:23:00+05:00[Asia/Karachi]
- **proposedBy:** ai-assisted
- **reviewStatus:** pending-scholarly-review
- **Scope:** RESEARCH ONLY — no modifications to data/, src/, or production files

---

## Executive Summary

This package assembles evidence-backed scholarly review briefs for **6 conceptual framework questions** that block MFD-12 architecture decisions. All briefs are structured identically: Evidence Summary → Scholarly Positions → Architecture Impact → Recommended Review Format → Deferral Justification.

**No scholarly decisions have been made.** This package provides the evidence and options that qualified scholars need to make informed decisions.

| # | Question | Brief File | Status |
|---|----------|-----------|--------|
| Q1 | Nafs Typology: Unified Qur'anic framework or Sufi systematization? | [WS-A-NAFS-TYPOLOGY-BRIEF.md](./WS-A-NAFS-TYPOLOGY-BRIEF.md) | Ready for review |
| Q6 | Arts Domain: Confirm dissolution per MFD-11.3-B | [WS-A-ARTS-DOMAIN-BRIEF.md](./WS-A-ARTS-DOMAIN-BRIEF.md) | Ready for review |
| Q10 | Art-Boundaries Mappings: Salvageable or reclassify all? | [WS-A-ARTS-DOMAIN-BRIEF.md](./WS-A-ARTS-DOMAIN-BRIEF.md) §3 | Ready for correction |
| Q5 | Jihād vs Qitāl: Unified or distinct taxonomic treatment? | [WS-A-JIHAD-QITAL-BRIEF.md](./WS-A-JIHAD-QITAL-BRIEF.md) | Ready for review |
| Q9 | Salām/Silm Polysemy: Dual mapping or single assignment for 2:208? | [WS-A-SALAM-SILM-BRIEF.md](./WS-A-SALAM-SILM-BRIEF.md) | Ready for review |
| Q11 | Ṣulḥ Reconciliation: Independent topic or sub-dimension of peace? | [WS-A-SULH-RECONCILIATION-BRIEF.md](./WS-A-SULH-RECONCILIATION-BRIEF.md) | Ready for review |

**Deferrals Identified:** NONE. All six questions have sufficient evidence for scholarly deliberation.

---

## Cross-Reference Matrix

Several questions share dependencies or overlapping evidence:

| Shared Element | Questions Affected | Notes |
|---------------|-------------------|-------|
| s-l-m root polysemy | Q9, Q11 | 8:61 bridges salām/silm and ṣulḥ concepts; decision on one affects the other |
| War-peace-conflict domain structure | Q5, Q9, Q11 | All three affect dimension/topic organization within this domain |
| Provenance classification (Qur'anic vs hadith vs editorial) | Q1, Q5, Q6 | Each involves distinguishing Qur'anic-explicit content from later interpretive layers |
| Thematic vs lexical mapping validity | Q1, Q5 | Both involve mappings where verses are assigned thematically without explicit lexical match |
| Covenant/treaty concept (ʿahd/mīthāq) | Q9, Q11 | Peace-agreements topic currently mixes s-l-m and ʿ-h-d roots; needs separation regardless of other decisions |

---

## Priority Recommendations

### Immediate Corrections (No Scholarly Deliberation Needed)

These are objective errors that should be corrected upon council acknowledgment:

1. **Q10: Reclassify all 4 art-boundaries mappings** — 31:6, 17:32, 24:19, 49:11 are demonstrably misclassified. No scholarly position supports their current placement.
2. **Q9 Sub-question: Move 5:1 and 16:91 from peace-agreements** — These use ʿ-h-d root (covenant), not s-l-m (peace). Belong under covenant topic.
3. **Q1 Cross-cutting: Reclassify 13:28 from nafs-mutmainna** — Uses *tatma'innu qulūbuhum* (hearts finding rest), applying ṭ-m-n to *qalb* not *nafs*. Should move to qalb-purification.

### High-Impact Decisions (Require Scholarly Deliberation)

Ordered by architectural impact magnitude:

1. **Q6: Arts domain dissolution** — Affects 1 domain, 5 dimensions, ~10 topics, ~30 mappings. Largest structural change.
2. **Q5: Jihād/Qitāl separation** — Affects core war-peace taxonomy; 4 mapping reassignments minimum; dimension restructuring.
3. **Q1: Nafs typology status** — Affects 3 topics, 7 mappings; interpretive framework question with downstream effects on spiritual-states dimension.
4. **Q11: Ṣulḥ topic creation** — Fills identified gap; moderate effort; cross-domain implications.
5. **Q9: 2:208 polysemy handling** — Single verse decision but sets precedent for representing interpretive ambiguity in the data model.

---

## Evidence Sources Referenced

| Source | Path | Content |
|--------|------|---------|
| MFD-11.3-A War/Peace Report | `research/mfd-11/reports/MFD-11.3-WORKSTREAM-A-WAR-PEACE.md` | Complete j-h-d, q-t-l, ṣ-l-ḥ, s-l-m, ʿ-h-d evidence registers |
| MFD-11.3-B Arts/Beauty Report | `research/mfd-11/reports/MFD-11.3-WORKSTREAM-B-ARTS-BEAUTY.md` | Complete j-m-l, z-y-n, ḥ-s-n analysis; domain dissolution recommendation |
| Root Assignment Audit | `research/mfd-11/reports/root-assignment-audit.json` | Morphological validation for all roots |
| Arabic Text Verification | `research/mfd-11/reports/arabic-text-verification.json` | Verbatim verse text confirmation |
| Topics Taxonomy | `data/taxonomy/topics.json` | Current topic definitions, scopes, mappings |
| Topic-Ayah Mappings | `data/taxonomy/topic-ayah-mappings.json` | All mapping records with rationales |
| Root Occurrences | `data/root-occurrences/*.json` | Exhaustive root-level occurrence data |

---

## Metadata Standards Applied

All briefs conform to MFD-12.1 metadata requirements:
- `proposedBy: ai-assisted`
- `reviewStatus: pending-scholarly-review`
- No production data modified
- All evidence cited with surah:ayah references
- Scholarly positions labeled by tradition/school
- Architecture impacts quantified (topics, mappings, dimensions affected)
- Review format includes structured options with implications

---

## Next Steps After Scholarly Council Review

1. Council renders decisions on each question using the provided options
2. Decisions recorded as `scholarlyDecision` annotations in respective briefs
3. WS-B (Architecture Implementation) receives decided briefs and executes migrations
4. Migration scripts reference specific mapping IDs and topic changes documented here
5. Post-migration audit verifies all changes against council decisions

---

*This consolidated package was assembled by AI assistance. All scholarly judgments remain pending qualified human review.*