# FAHM Development Programme Dashboard — MFD-12.1

| Field | Value |
|-------|-------|
| Programme | FAHM Quran App — MFD-12.1 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-scholarly-review |
| Production Integrity | UNCHANGED (verified) |
| Immutability Baseline | PASSED (6,236 verse hashes identical) |
| Supersedes | MFD-11.5/MFD-12 FAHM-PROGRAMME-DASHBOARD.md |

---

## Workstream Completion Matrix — MFD-12.1

| WS | Name | Status | Key Deliverables | Critical Findings |
|----|------|--------|-----------------|-------------------|
| **WS-A** | Conceptual Framework Scholarly Review | ✅ Complete | 6 evidence briefs, cross-reference matrix, priority recommendations | 3 immediate corrections identified (art-boundaries, covenant misplacements, nafs/qalb confusion); Arts dissolution confirmed; Jihād/Qitāl distinction confirmed |
| **WS-B** | Governance & Credentialing | ✅ Complete | 5 specifications (credentialing, quorum, expiry, enforcement, hadith integration) | ReviewerIdentity + HadithReport entities designed; three-layer append-only enforcement; T3/T4 quorum tiers for creedal claims |
| **WS-C** | Phantom Reference Reconciliation | ✅ Complete | Full reconciliation of 243 phantoms (200 unique IDs) | 154 CREATE, 2 DEPRECATE, 21 MERGE, 23 DEFER; 15 scholarly taxonomy gaps identified |
| **WS-D** | Data Model Architecture Resolution | ✅ Complete | 5 schema resolutions, 3 new entity schemas, 1 new relationship type | Subdimension elevated to first-class; WordTranslation schema defined (population deferred); CROSS_LINGUAL_VARIANT relationship added |
| **WS-E** | Evidence & Rights Standards | ✅ Complete | 4 policies (Tanzil enforcement, audio dual-rights, community trust tiers, edition variance fix) | Tanzil proxy NOT enforced in production (HIGH severity); 12 schema field changes proposed |
| **WS-F** | Lexical Quality & Morphology | ⏳ Not Started | — | 12 questions (Q12–Q23) remain PENDING; covers root authority, coverage thresholds, transliteration, gloss epistemology |
| **WS-G** | Remaining Scholarly & Technical Questions | ⏳ Not Started | — | 7 questions (Q2–Q4, Q7–Q8, Q39) remain PENDING; covers human equality, covenant boundaries, hadith-derived topics, sunnah definition, mojibake normalization |

---

## Updated Programme Metrics

| Category | Measure | MFD-12 Value | MFD-12.1 Value | Delta |
|----------|---------|-------------|----------------|-------|
| Qur'anic Integrity | Canonical text hash verification | ✅ PASSED | ✅ PASSED | — |
| Linguistic Remediation | Entries audited and dispositioned | 649/649 | 649/649 | — |
| Root Quality | Known critical errors resolved | 9/9 | 9/9 | — |
| Root Quality | Systemic slug defects discovered | 235 | 235 | Awaiting WS-F verification |
| Morphology | Entries with documented analysis | 649/649 | 649/649 | — |
| Gloss Quality | Entries assessed under approved rubric | 649/649 | 649/649 | Awaiting WS-F prioritization |
| Transliteration | Terms needing ISO 233-2 migration | 245/649 | 245/649 | Awaiting WS-F confirmation |
| Duplicates | Groups adjudicated | 23 | 23 | Awaiting WS-F confirmation |
| Architecture | Canonical entities designed | 21 | **24** | +3 (Subdimension, WordTranslation, LearningProgress) |
| Architecture | JSON schemas produced | 21 | **24** | +3 new schemas |
| Architecture | Relationship types defined | 10 | **11** | +1 (CROSS_LINGUAL_VARIANT) |
| Evidence | Review scopes defined | 4 | 4 | — |
| Migration | Legacy entity mapping coverage | ~65% | ~65% | — |
| Migration | Phantom references catalogued | 243 | **243 reconciled** | 154 CREATE, 2 DEPRECATE, 21 MERGE, 23 DEFER |
| AI | Service boundaries defined | 10 prohibitions | 10 prohibitions | — |
| AI | Retrieval module contracts | 6 | 6 | — |
| Governance | New governance entities | 0 | **2** | ReviewerIdentity, HadithReport |
| Governance | Quorum policy tiers | 0 | **4** | T1–T4 defined |
| Governance | Expiry policy categories | 0 | **3** | Classical/Contemporary/Custom |
| Rights | Evidence & rights policies | 0 | **4** | Tanzil, Audio, Trust Tiers, Edition Variance |
| Rights | Schema field additions/modifications | 0 | **12** | Across Source, Edition, EvidenceRecord |
| Scholarly Questions | Total in register | 39 | 39 | — |
| Scholarly Questions | RESOLVED (recommendation made) | 0 | **20** | Via WS-A through WS-E |
| Scholarly Questions | DEFERRED (justified deferral) | 0 | **0** | — |
| Scholarly Questions | PENDING (workstream incomplete) | 39 | **19** | WS-F (12) + WS-G (7) |
| Release Gate Status | Overall | ⛔ NOT READY | ⚠️ CONDITIONAL | Engineering can proceed on resolved items; scholarly council needed for 19 remaining + ratification of 20 resolved |

---

## Consolidated Scholarly Review Register — Disposition Summary

### Resolved by WS-A (Conceptual Frameworks) — 6 Questions
| Q# | Question | Disposition | Action Required |
|----|----------|-------------|----------------|
| Q1 | Nafs typology | RESOLVED | Council decision on unified vs Sufi framework; immediate correction: reclassify 13:28 |
| Q5 | Jihād vs Qitāl | RESOLVED | Council confirmation of separation; ≥4 mapping reassignments |
| Q6 | Arts domain dissolution | RESOLVED | Council confirmation; largest structural change (~30 mappings) |
| Q9 | Salām/silm polysemy | RESOLVED | Council decision on 2:208 handling; immediate correction: move 5:1, 16:91 |
| Q10 | Art-boundaries mappings | RESOLVED | IMMEDIATE CORRECTION: reclassify all 4 mappings (no deliberation needed) |
| Q11 | Ṣulḥ reconciliation | RESOLVED | Council confirmation to create independent topic |

### Resolved by WS-B (Governance) — 5 Questions
| Q# | Question | Disposition | Action Required |
|----|----------|-------------|----------------|
| Q26 | Hadith integration entity | RESOLVED | Approve HadithReport entity design |
| Q28 | Append-only enforcement | RESOLVED | Approve three-layer enforcement architecture |
| Q34 | Reviewer credentialing | RESOLVED | Approve ReviewerIdentity entity; define bootstrap charter |
| Q35 | Multi-reviewer quorum | RESOLVED | Approve T1–T4 quorum tiers |
| Q36 | Approval temporal expiry | RESOLVED | Approve category-based expiry defaults |

### Resolved by WS-C (Phantom Reconciliation) — 1 Question
| Q# | Question | Disposition | Action Required |
|----|----------|-------------|----------------|
| Q37 | 243 phantom references | RESOLVED | Approve 154 CREATE, 2 DEPRECATE, 21 MERGE; review 23 DEFER candidates; address 15 taxonomy gaps |

### Resolved by WS-D (Architecture) — 5 Questions
| Q# | Question | Disposition | Action Required |
|----|----------|-------------|----------------|
| Q24 | Subdimension entity | RESOLVED | Approve first-class Subdimension schema |
| Q25 | Translation granularity | RESOLVED | Approve WordTranslation schema (population deferred) |
| Q27 | Cross-lingual alignment | RESOLVED | Approve hub-and-spoke model + CROSS_LINGUAL_VARIANT |
| Q29 | Learning progress tracking | RESOLVED | Approve local-only LearningProgress entity |
| Q38 | Implicit CONTAINS edges | RESOLVED | Approve EDITORIAL_CLASSIFICATION edge generation |

### Resolved by WS-E (Evidence & Rights) — 4 Questions
| Q# | Question | Disposition | Action Required |
|----|----------|-------------|----------------|
| Q30 | Tanzil proxy rights | RESOLVED | ⚠️ IMMEDIATE: enforce linkOutOnly in production |
| Q31 | Audio performer rights | RESOLVED | Approve dual-rights schema extension |
| Q32 | Community source threshold | RESOLVED | Approve four-tier trust model |
| Q33 | Edition rights variance | RESOLVED | Approve enum fix + derivative-works support |

### Pending — WS-F (Lexical) — 12 Questions
Q12, Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20, Q21, Q22, Q23

### Pending — WS-G (Remaining Scholarly/Technical) — 7 Questions
Q2, Q3, Q4, Q7, Q8, Q39 (+ partial overlap with WS-F scope)

---

## Release Gate Status — Updated

| Gate | Previous Status | Updated Status | Blocking Issues |
|------|----------------|----------------|----------------|
| A — Research Integrity | ⚠️ Conditional | ⚠️ Conditional | 6/9 priority roots absent from morphology index; 235 slug defects need WS-F verification; 3 immediate corrections from WS-A ready to apply |
| B — Scholarly Governance | ⏳ Pending | ⚠️ Partial Pass | 20/39 questions resolved with recommendations; 19 pending WS-F/WS-G; no AI-generated claim represented as approved |
| C — Technical Integrity | ✅ Pass | ✅ Pass | Corpus integrity verified; schema validation passed; referential integrity clean; WS-D schema extensions ready |
| D — User Experience | ⏳ Pending | ⏳ Pending | Prototypes not yet built; acceptance tests defined but not executed |
| E — Institutional Approval | ⏳ Pending | ⏳ Pending | Requires human scholarly council review of 20 resolved questions + completion of WS-F/WS-G |
| F — Legal/Rights Compliance | NEW | ⚠️ Conditional | Tanzil proxy enforcement URGENT; audio dual-rights schema pending approval; trust tier policy pending approval |

**Overall Release Decision: ⚠️ CONDITIONAL — ENGINEERING CAN PROCEED ON RESOLVED ITEMS**

MFD-12.1 has resolved 20 of 39 scholarly questions with concrete recommendations. Engineering implementation can begin on:
- WS-D schema changes (3 new entities, 1 new relationship type)
- WS-B governance infrastructure (pending bootstrap charter)
- WS-E rights enforcement (Tanzil proxy is URGENT)
- WS-A immediate corrections (Q10 art-boundaries, Q9 covenant misplacements)
- WS-C phantom CREATE/DEPRECATE/MERGE operations (excluding 23 DEFER)

Scholarly council action required before full release:
1. Ratify or revise 20 resolved question recommendations
2. Complete WS-F (lexical) and WS-G (remaining scholarly) workstreams
3. Define reviewer bootstrap governance charter
4. Authorize UTF-8 normalization pass (Q39)

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*No production files modified. All outputs are research and design artifacts only.*
*AI will never replace scholars. This dashboard serves qualified human review, not automated authority.*
