# WS-F: Lexical & Gloss Prioritization — Consolidated Deliverable (MFD-12.1)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-F (Lexical & Gloss Prioritization) |
| Date | 2026-11-21 |
| Agent | agent-108 (AI-assisted) |
| Questions Resolved | Q16–Q23 (8 of 8) |
| Evidence Base | MFD-11.5 Lexical Quality Report, Root Remediation Report, Transliteration Standard, Duplicate Registers, Gloss Review Register, Terminology Index Scope, FAHM Programme Dashboard |
| Status | RESEARCH ONLY — No production files modified |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |

---

## Executive Summary

WS-F has established the complete scholarly review prioritization framework for the 649-entry FAHM terminology index. All 8 lexical quality questions from the programme dashboard (Q16–Q23) have been addressed with evidence-backed policy recommendations.

### Deliverables Produced

| File | Description | Size |
|------|-------------|------|
| [WS-F-LEXICAL-POLICY-FRAMEWORK.md](./WS-F-LEXICAL-POLICY-FRAMEWORK.md) | Q16–Q22 resolutions with full rationale and evidence citations | ~7 policies |
| [WS-F-GLOSS-PRIORITIZATION-QUEUE.md](./WS-F-GLOSS-PRIORITIZATION-QUEUE.md) | Q23 ordered queue with 5-tier prioritization of 640 flagged glosses | ~640 entries scored |
| [WS-F-LEXICAL-CONSOLIDATED.md](./WS-F-LEXICAL-CONSOLIDATED.md) | This summary document | N/A |

### Key Decisions Summary

| Question | Decision | Impact |
|----------|----------|--------|
| Q16 (Scope) | Curated thematic lexicon confirmed; exhaustive coverage deferred to Phase D | Maintains depth-before-breadth approach; 649 terms are sufficient current scope |
| Q17 (Transliteration) | ISO 233-2 canonical + ASCII search aliases strictly separated | 245 violations must be migrated before new terms added |
| Q18 (Polysemy) | Unified entry with enumerated senses as default; split only on 4-criteria test | Reduces fragmentation; aligns with classical lexicographic tradition |
| Q19 (Root Disagreements) | Multi-root storage with primary designation; never force resolution | Preserves scholarly integrity for 8 disputed terms |
| Q20 (Null Values) | Typed null system: NULL_NATURE, NULL_EVIDENCE, NULL_GAP, NULL_CORRUPT | Enables accurate reporting and actionable remediation queues |
| Q21 (Slug Defects) | Three-tier verification workflow (automated → spot-check → full manual) | Matches rigor to complexity; 100 Tier-1 corrections can proceed immediately |
| Q22 (Duplicates) | Four-criteria test applied; 15 groups proposed for merge, 8 confirmed keep-separate | Net reduction of ~27 entries through consolidation |
| Q23 (Gloss Queue) | Five-tier prioritization by frequency × theology × visibility × dependency | rahmah (4.75) first; fitnah, jihad, furqan, al-ruh in Tier 1 Critical |

---

## Policy Framework Highlights (Q16–Q22)

### Q16: Index Scope
The 649-entry index is a **curated thematic subset**, not an exhaustive concordance. Exhaustive coverage deferred until four-layer gloss remediation is complete for current entries. Expansion criteria defined for Phase D: ≥3 corpus occurrences OR creedal/legal/spiritual centrality OR significant tafsīr discussion.

### Q17: Transliteration Standard
ISO 233-2:1993 adopted as canonical. Every entry stores exactly ONE ISO 233-2 transliteration. Search aliases array provides ASCII variants. Migration map in `transliteration-migration.json` is authoritative for correcting 245 violations (37.8% of index).

### Q18: Polysemy Handling
Default structure: one entry per lemma with numbered contextual senses under Layer 2. Splitting permitted ONLY when all four criteria met: morphological independence, semantic divergence, independent lexical tradition, distinct user-facing function. Classical Arabic lexicographic practice (Lane, Lisān al-ʿArab) organizes by root with sub-entries.

### Q19: Root Disagreements
Eight terms documented with legitimate alternative classical analyses. Storage schema supports `primaryRoot` + `alternativeRoots[]` + `rootDisagreement` object with type, disposition, sources, and scholarly note. Display rules distinguish scholarly view (full panel) from general view (primary + footnote). Huruf muqattaat handled as special case with `primaryRoot: null`.

### Q20: Morphology Null Values
Four typed nulls replace bare `null`: NULL_NATURE (legitimate absence), NULL_EVIDENCE (insufficient evidence), NULL_GAP (processing miss), NULL_CORRUPT (invalid slug). Each type has specific display rules and remediation actions. The 54 unassigned terms classified across these types.

### Q21: Slug Verification Workflow
Three tiers: Tier 1 (automated validation against root-occurrences infrastructure, ~100 terms), Tier 2 (scholar spot-check batches of 20–30, ~123 terms), Tier 3 (full manual research, ~100 terms). Pipeline prerequisite: fix the prefix-prepending extraction bug BEFORE running further batch operations.

### Q22: Duplicate Resolution
Four-criteria test applied to all 23 groups. Result: 15 groups proposed for MERGE (extraction artifacts: definite/indefinite variants, singular/plural, prepositional phrases), 8 groups confirmed KEEP-SEPARATE (genuine polysemy or distinct compounds). Net reduction: ~27 entries eliminated through consolidation.

---

## Gloss Prioritization Queue Highlights (Q23)

### Scoring Formula
```
Priority = (Frequency × 0.25) + (TheologicalSignificance × 0.35) + (UserVisibility × 0.20) + (DependencyRisk_inverted × 0.20)
```

### Tier Distribution

| Tier | Score Range | Count | Timeline |
|------|------------|-------|----------|
| Tier 1: Critical | 4.0–5.0 | ~15 | Weeks 1–2 |
| Tier 2: High | 3.0–3.9 | ~45 | Weeks 2–4 |
| Tier 3: Standard | 2.0–2.9 | ~180 | Months 2–3 |
| Tier 4: Low | 1.5–1.9 | ~250 | Months 3–5 |
| Tier 5: Deferred | <1.5 | ~150 | Month 6+ |

### Top 5 Priority Terms

| Rank | Term | Score | Rationale |
|------|------|-------|-----------|
| 1 | rahmah (mercy) | 4.75 | Central divine attribute, no dependencies, high frequency + visibility |
| 2 | furqan (criterion) | 4.60 | Highest frequency (4 occ), theological term for Qur'an itself |
| 3 | al-ruh (the Spirit) | 4.55 | Most debated creedal term, extensive tafsīr literature |
| 4 | ghayb (unseen) | 4.50 | Foundational epistemological concept, no blockers |
| 5 | kun-fa-yakun (Be, and it is) | 4.50 | Divine creative command, maximum theological significance |

### Dependency-Aware Sequencing
- Tier 1 terms without Q22 dependencies begin IMMEDIATELY
- Tier 2 terms dependent on Q22 merges wait for merge application
- Tier 3 terms dependent on Q21 slug verification wait for root confirmation
- Tier 5 entirely deferred until upstream Q18–Q22 resolutions complete

---

## Cross-Question Dependency Map

```
Q16 (Scope) ─────────────────────────────┐
    │                                     │
    ▼                                     ▼
Q17 (Translit) ──► Q21 (Slugs) ──► Q23 (Gloss Queue)
                      ▲                  ▲
                      │                  │
Q20 (Nulls) ──────────┘                  │
                                         │
Q18 (Polysemy) ──► Q22 (Dupes) ─────────┘
                      ▲
                      │
Q19 (Roots) ──────────┘
```

Critical path: Q17 → Q21-Tier1 → Q22 → Q18 → Q23-Tier1

---

## Implementation Sequence

### Phase A: Immediate (Week 1)
1. Finalize Q17 transliteration migration using existing map
2. Apply Q22 four-criteria reclassification to all 23 duplicate groups
3. Begin Tier 1 gloss authoring for non-dependent terms (rahmah, furqan, ghayb, kun-fa-yakun)

### Phase B: Week 2
4. Execute Q21-Tier1 automated slug corrections (~100 terms)
5. Classify all 54 null assignments per Q20 taxonomy
6. Complete remaining Tier 1 glosses (fitnah, jihad, al-ruh after Q22 merge)

### Phase C: Weeks 3–4
7. Restructure merged entries per Q18 sense enumeration template
8. Document all 8 root disagreements per Q19 storage schema
9. Begin Q21-Tier2 scholarly batch review sessions
10. Execute Tier 2 gloss authoring

### Phase D: Months 2–6
11. Systematic Tier 3 processing (~180 terms)
12. Bulk Tier 4 processing (~250 terms)
13. Reactivate and complete Tier 5 after upstream resolutions

---

## Quality Gates

All outputs carry:
- `proposedBy: "ai-assisted"`
- `reviewStatus: "pending-scholarly-review"`
- Zero production file modifications
- Full evidence citations to MFD-11.5 deliverables

No policy takes effect until scholarly review is complete. AI-assisted analysis provides candidate documentation only; human scholarly adjudication is the validation mechanism.

---

*Consolidated deliverable of WS-F (agent-108), MFD-12.1.*
*Generated: 2026-11-21T09:36:00+05:00*
*No production files modified. Research-only output.*