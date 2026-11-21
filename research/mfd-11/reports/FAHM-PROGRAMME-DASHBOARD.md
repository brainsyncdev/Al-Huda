# FAHM Development Programme Dashboard

| Field | Value |
|-------|-------|
| Programme | FAHM Quran App — MFD-11.5 + MFD-12 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-scholarly-review |
| Production Integrity | UNCHANGED (verified) |
| Immutability Baseline | PASSED (6,236 verse hashes identical) |
| HEAD | See git log for latest commit |

---

## Workstream Completion Matrix

| WS | Name | Status | Key Deliverables | Critical Findings |
|----|------|--------|-----------------|-------------------|
| **MFD-11.5 WS1** | UX Research | ✅ Complete | UX Report, Journey Map, UX Spec, 48 Acceptance Tests | 5 friction points; no persistent research context; evidence provenance requires deep navigation |
| **MFD-11.5 WS2** | Root Remediation | ✅ Complete | Root Audit (649 entries), Error Register (323 errors), Arabic Verification (96.8%), Disagreement Register (8) | 9 critical errors resolved; 235 systemic slug defects discovered; 223 entries need manual review |
| **MFD-11.5 WS3** | Morphology | ✅ Complete | Morphology Schema, Lemma Analysis (649 terms), Review Queue (460 entries) | 220 lemmas populated (33.9%); 196 patterns resolved; 429 null = insufficient evidence (correct) |
| **MFD-11.5 WS4** | Lexical Quality | ✅ Complete | Transliteration Standard (ISO 233-2), Migration Map (649 terms), 23 Duplicate Groups, Gloss Rubric, Gloss Register (640 flagged) | 37.8% transliteration violations; 98.6% glosses fail four-layer rubric; 23 duplicate groups adjudicated |
| **MFD-11.5 WS5** | Coverage & Reproducibility | ✅ Complete | Scope Definition, Extraction Methodology, Config, Denominator Register, Coverage Report, Reproducibility Report | Original Phase C methodology explained (whitespace-split fragments); root-occurrences established as authoritative source |
| **MFD-11.5 WS6** | QA & Release Governance | ✅ Complete | Integrity Baseline, Validation Report, Regression Report (22 tests), Release Decision | Release NOT READY: 6/9 priority roots absent from morphology index (key-format mismatch); 9/22 regression tests untested |
| **MFD-12 WS1** | Canonical Schema | ✅ Complete | Data Model (21 entities), Data Dictionary, 21 JSON Schemas | Concept≠Topic separation; multiple RootAnalysis per entry; append-only ReviewDecision; version-pinned approvals |
| **MFD-12 WS2** | Knowledge Graph | ✅ Complete | KG Spec, Relationship Taxonomy (9 types), Integrity Rules | War-peace-conflict selected as pilot domain; Arts-beauty-aesthetics dissolution accommodated; 7-level evidence trust hierarchy |
| **MFD-12 WS3** | Linguistic Integration | ✅ Complete | Integration Spec, API Contracts | Token addressing {surah}:{ayah}:{wordPosition}; 5 critical gaps identified (476 undetermined patterns, no prefix/suffix parsing, flat glosses, 358 missing roots, unverified transliteration) |
| **MFD-12 WS4** | Evidence Integration | ✅ Complete | Source Registry Spec, Evidence Model, Review Workflow Spec | Three independent axes (verification/support/approval); four review scopes (TECHNICAL/RIGHTS/SCHOLARLY/TAXONOMIC); 8 rights/licensing questions unresolved |
| **MFD-12 WS5** | Product Integration | ✅ Complete | Application Architecture, UX Integration Spec, Search Spec (5 modes), Local-First Spec | Four experiences defined; Arts domain dissolved; War-Peace as semantic network; zero-telemetry local-first |
| **MFD-12 WS6** | AI Integration | ✅ Complete | AI Architecture, Retrieval Contracts (6 modules), AI Governance Spec | AI as untrusted assistant; 10 explicit prohibitions; graduated response model; public AI religious answers DISABLED; kill switch mandatory |
| **MFD-12 WS7** | Migration & Compatibility | ✅ Complete | Migration Map, Migration Plan (8 phases), Compatibility Report, Rollback Plan | 65% mapping coverage; 243 phantom references (41.6% of relatedTopicIds); rollback feasible within 30 days; ID alias table MANDATORY |

---

## Programme Metrics

| Category | Measure | Value |
|----------|---------|-------|
| Qur'anic Integrity | Canonical text hash verification | ✅ PASSED (6,236 verses) |
| Linguistic Remediation | Entries audited and dispositioned | 649/649 (100%) |
| Root Quality | Known critical errors resolved | 9/9 |
| Root Quality | Systemic slug defects discovered | 235 |
| Morphology | Entries with documented analysis | 649/649 (220 lemmas, 196 patterns) |
| Gloss Quality | Entries assessed under approved rubric | 649/649 (9 adequate, 640 flagged) |
| Transliteration | Terms needing ISO 233-2 migration | 245/649 (37.8%) |
| Duplicates | Groups adjudicated | 23 |
| Reproducibility | Extraction methodology documented | ✅ (original flaws explained, proposed method specified) |
| UX | Friction points identified | 5 |
| UX | Acceptance tests defined | 48 |
| Architecture | Canonical entities designed | 21 |
| Architecture | JSON schemas produced | 21 |
| Architecture | Relationship types defined | 9 + CUSTOM |
| Evidence | Review scopes defined | 4 (TECHNICAL/RIGHTS/SCHOLARLY/TAXONOMIC) |
| Migration | Legacy entity mapping coverage | ~65% |
| Migration | Phantom references catalogued | 243 |
| AI | Service boundaries defined | 10 prohibitions |
| AI | Retrieval module contracts | 6 |
| Governance | Release decision | ⛔ NOT READY (conditional) |

---

## Consolidated Scholarly Review Register

### From MFD-11.1 (Gap Audits)
1. Nafs typology: Are three states a unified Qur'anic framework or post-Qur'anic Sufi systematization?
2. Human equality: Split into four propositions or retain as modern category?
3. Covenant boundary: General ʿahd vs treaty-specific mīthāq topic separation?
4. Hadith-derived topics: Status in Qur'an-centred taxonomy?

### From MFD-11.2 (Scholarly Review Topics)
5. Jihād vs Qitāl: Unified or distinct concepts? (WS2 confirms distinction)
6. Arts domain: Dissolve or redefine? (WS3 confirms dissolution)
7. Minor/Major signs: Hadith-derived taxonomy in Qur'an-focused system?
8. Sunnah definition: Post-Qur'anic juristic category vs Qur'anic prophetic authority?

### From MFD-11.3 (Domain Completeness)
9. Salām/silm polysemy: Dual mapping or interpretive annotation for 2:208?
10. Art-boundaries mappings: Salvageable or fully reclassify?
11. Ṣulḥ reconciliation: Independent topic or sub-dimension?

### From MFD-11.4 (Terminology Quality)
12. Root assignment authority: Classical lexicons vs computational morphology when they disagree?
13. Coverage threshold: What minimum percentage is acceptable for scholarly publication?
14. Morphological granularity: Root only vs full parsed morphology?
15. Gloss epistemology: Classical tafsir vs modern linguistic semantics when they diverge?

### From MFD-11.5 (Terminology Remediation)
16. Index scope: Curated thematic lexicon confirmed; exhaustive coverage deferred?
17. Transliteration standard: ISO 233-2 adopted; search aliases separate?
18. Polysemy handling: One entry with contextual senses as default?
19. Root disagreements: Preserve competing analyses without forcing resolution?
20. Morphology null values: Acceptable representation of insufficient evidence?
21. 235 systemic slug defects: Scholarly verification of corrections?
22. 23 duplicate groups: Genuine polysemy vs extraction artifacts?
23. 640 gloss revisions: Prioritization order for scholarly authoring?

### From MFD-12 (Architecture)
24. Subdimension entity: Embedded in Dimension or first-class?
25. Translation granularity: Per-verse only or per-word interlinear?
26. Hadith integration: Dedicated entity or Source.type sufficient?
27. Cross-lingual concept alignment across Arabic/English/Urdu?
28. ReviewDecision enforcement mechanism at storage layer?
29. LearningPath progress tracking: Separate entity or embedded?
30. Tanzil proxy rights: Safe-default adequate or more restrictive needed?
31. Audio recording rights: Performer-rights fields needed?
32. Community-contributed source verification threshold?
33. Edition-level rights variance validation against real cases?
34. Reviewer identity credentialing infrastructure?
35. Multi-reviewer quorum for creedal claims?
36. Temporal expiry of scholarly approvals?
37. 243 phantom references: Scholarly determination of which to create vs deprecate?
38. Implicit CONTAINS edges: Generate from arrays or require explicit authoring?
39. Urdu/Arabic mojibake in topics.json: UTF-8 normalization pass authorized?

---

## Release Gate Status

| Gate | Status | Blocking Issues |
|------|--------|----------------|
| A — Research Integrity | ⚠️ Conditional | 6/9 priority roots absent from morphology index; 235 slug defects need verification |
| B — Scholarly Governance | ⏳ Pending | 39 scholarly questions unresolved; no AI-generated claim may be represented as approved |
| C — Technical Integrity | ✅ Pass | Corpus integrity verified; schema validation passed; referential integrity clean |
| D — User Experience | ⏳ Pending | Prototypes not yet built; acceptance tests defined but not executed |
| E — Institutional Approval | ⏳ Pending | Requires human scholarly review of consolidated register above |

**Overall Release Decision: ⛔ NOT READY**

MFD-11.5 and MFD-12 design phases are technically complete. Production implementation awaits scholarly review of the 39 questions above and resolution of the conditional gate A issues.

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*No production files modified. All outputs are research and design artifacts only.*
*AI will never replace scholars. This dashboard serves qualified human review, not automated authority.*
