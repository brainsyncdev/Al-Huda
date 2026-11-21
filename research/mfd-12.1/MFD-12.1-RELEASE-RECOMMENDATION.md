# MFD-12.1 Release Recommendation

| Field | Value |
|-------|-------|
| Programme | FAHM Quran App — MFD-12.1 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-H, agent-110) |
| Review Status | pending-scholarly-review |
| Scope | RESEARCH ONLY — no production modifications |
| Supersedes | MFD-11.5/MFD-12 Release Decision (⛔ NOT READY) |

---

## Executive Summary

MFD-12.1 has resolved **20 of 39** scholarly questions across five completed workstreams (WS-A through WS-E). Two workstreams (WS-F: Lexical, WS-G: Remaining Scholarly) have not yet produced consolidated outputs, leaving **19 questions PENDING**.

**Recommendation: ⚠️ CONDITIONAL PROCEED**

Engineering implementation may begin on all resolved items with appropriate safeguards. Full public release remains blocked until:
1. Scholarly council ratifies the 20 resolved recommendations
2. WS-F and WS-G complete their workstreams
3. Tanzil proxy enforcement is deployed (URGENT legal risk)
4. Reviewer bootstrap governance charter is defined

---

## Gate-by-Gate Assessment

### Gate A — Research Integrity: ⚠️ CONDITIONAL PASS

**What can proceed:**
- ✅ All 6,236 verse hashes verified identical (immutability baseline PASSED)
- ✅ 649/649 root entries audited and dispositioned
- ✅ 9/9 known critical errors resolved
- ✅ WS-A identified 3 immediate corrections ready for application (Q10 art-boundaries, Q9 covenant misplacements, Q1 nafs/qalb reclassification)
- ✅ WS-C phantom reconciliation complete with actionable dispositions

**What remains blocking:**
- ⏳ 235 systemic slug defects require WS-F scholarly verification before batch correction
- ⏳ 6/9 priority roots absent from morphology index (key-format mismatch from MFD-11.5)
- ⏳ Coverage threshold (Q13) undefined — current ~65% mapping rate needs scholarly acceptance
- ⏳ 429 null morphology entries need WS-F confirmation as valid representation

**Separation of concerns:**
- *Engineering*: Can apply WS-A immediate corrections and WS-C DEPRECATE operations now
- *Scholarly Council*: Must verify slug corrections, confirm null morphology policy, set coverage threshold

---

### Gate B — Scholarly Governance: ⚠️ PARTIAL PASS

**What can proceed:**
- ✅ 20/39 questions resolved with evidence-backed recommendations
- ✅ WS-B governance specifications complete (credentialing, quorum, expiry, enforcement, hadith integration)
- ✅ WS-D schema resolutions complete (3 new entities, 1 new relationship type)
- ✅ No AI-generated claim is represented as approved in any output

**What remains blocking:**
- ⏳ 19 questions pending WS-F (12) and WS-G (7) completion
- ⏳ Scholarly council must ratify or revise all 20 resolved recommendations
- ⏳ Reviewer bootstrap governance charter undefined (who authorizes first scholars?)
- ⏳ Quorum T3/T4 activation requires minimum reviewer pool size

**Separation of concerns:**
- *Engineering*: Can implement WS-B schema extensions, enforcement middleware, and CRDT merge rules
- *Scholarly Council*: Must define bootstrap charter, ratify recommendations, complete WS-F/WS-G

---

### Gate C — Technical Integrity: ✅ PASS

**Status:** All technical integrity checks passed.

- ✅ Corpus integrity verified (6,236 verse hashes)
- ✅ Schema validation passed for all existing entities
- ✅ Referential integrity clean (post WS-C phantom reconciliation)
- ✅ WS-D schema extensions fully specified with cross-reference integrity rules
- ✅ Migration plan amended with new phases for Subdimension, edge generation, and cross-lingual notes
- ✅ Append-only enforcement architecture designed (three-layer defense-in-depth)

**No blocking issues.** Engineering can proceed with schema implementation.

---

### Gate D — User Experience: ⏳ PENDING

**Status:** Unchanged from MFD-12. Prototypes not yet built.

- ✅ 48 acceptance tests defined (MFD-11.5 WS1)
- ✅ 5 friction points identified
- ✅ UX integration spec complete (MFD-12 WS5)
- ⏳ No prototypes built; acceptance tests not executed
- ⏳ Trust tier badge UI design needed (WS-E P3)
- ⏳ Audio disclaimer pattern design needed (WS-E P2)
- ⏳ Expiry indicator UX research needed (WS-B)

**Separation of concerns:**
- *Engineering*: Can build prototypes against existing specs
- *Design*: Must create trust tier badges, audio disclaimers, expiry indicators
- *QA*: Must execute 48 acceptance tests against prototypes

---

### Gate E — Institutional Approval: ⏳ PENDING

**Status:** Requires human scholarly council action.

- ⏳ Council must review 20 resolved question briefs
- ⏳ Council must complete WS-F and WS-G workstreams
- ⏳ Council must authorize UTF-8 normalization pass (Q39)
- ⏳ Council must define reviewer bootstrap charter
- ⏳ Legal counsel must review Tanzil terms and performer rights template

**This gate cannot be automated or AI-assisted.** It requires qualified human scholarly judgment.

---

### Gate F — Legal/Rights Compliance: ⚠️ CONDITIONAL (NEW)

**Added in MFD-12.1 based on WS-E findings.**

**What can proceed:**
- ✅ Four rights policies fully specified
- ✅ 12 schema field changes designed
- ✅ Implementation roadmap phased over 6 weeks

**What is URGENT:**
- 🔴 **Tanzil proxy enforcement**: Rights-unverified + api-import sources are NOT currently enforcing `linkOutOnly: true`. This constitutes potential unauthorized redistribution. **Must be deployed within Week 1-2.**

**What remains blocking:**
- ⏳ Audio dual-rights schema pending approval
- ⏳ Community trust tier policy pending approval
- ⏳ Edition rights variance fix pending approval
- ⏳ Performer rights authorization template undefined
- ⏳ Tanzil clearance SLA for 100+ editions undefined

**Separation of concerns:**
- *Engineering*: Can deploy Tanzil proxy middleware immediately; can implement schema changes
- *Legal Counsel*: Must review Tanzil terms, create performer rights template, define clearance SLA
- *Scholarly Council*: Must approve rights policies

---

## Recommended Implementation Sequence

### Phase 0: URGENT (Week 1)
1. Deploy Tanzil proxy enforcement middleware (Gate F)
2. Apply WS-A immediate corrections: Q10 art-boundaries reclassification, Q9 covenant misplacements, Q1 nafs/qalb reclassification
3. Apply WS-C DEPRECATE operations (2 erroneous subdimension-as-topic references)

### Phase 1: Schema Foundation (Weeks 2-4)
1. Implement WS-D schema changes: Subdimension, WordTranslation (schema only), LearningProgress entities
2. Add CROSS_LINGUAL_VARIANT relationship type
3. Generate EDITORIAL_CLASSIFICATION edges from arrays (~500 edges)
4. Implement WS-B governance entities: ReviewerIdentity, HadithReport
5. Fix edition rightsOverride enum asymmetry (WS-E P4)

### Phase 2: Governance Infrastructure (Weeks 3-6)
1. Implement three-layer append-only enforcement (middleware + DB triggers + CRDT rules)
2. Build trust tier storage and computation (WS-E P3)
3. Create rights computation service for source-level aggregation
4. Define reviewer bootstrap governance charter (SCHOLARLY COUNCIL ACTION)

### Phase 3: Content & Review Workflow (Weeks 5-10)
1. Execute WS-C CREATE operations (154 new topics, prioritized by reference count)
2. Execute WS-C MERGE operations (21 fuzzy-match consolidations)
3. Build tier-aware display components
4. Build audio dual-rights admin interface
5. Integrate tier promotions into ReviewDecision workflow

### Phase 4: Scholarly Completion (Parallel, Timeline TBD)
1. Complete WS-F (lexical quality & morphology) — 12 questions
2. Complete WS-G (remaining scholarly/technical) — 7 questions
3. Scholarly council ratification of all 20 resolved recommendations
4. UTF-8 normalization pass authorization and execution (Q39)

### Phase 5: UX & Testing (After Phase 1-3)
1. Build prototypes against UX integration spec
2. Design trust tier badges, audio disclaimers, expiry indicators
3. Execute 48 acceptance tests
4. User testing on rights display patterns

---

## Separation of Concerns Matrix

| Decision Category | Engineering Authority | Scholarly Council Authority | Legal Authority |
|------------------|----------------------|----------------------------|----------------|
| Schema implementation | ✅ Implement approved schemas | ✅ Approve schema designs | — |
| Data corrections (objective errors) | ✅ Apply WS-A immediate corrections | ✅ Acknowledge corrections | — |
| Phantom CREATE/DEPRECATE/MERGE | ✅ Execute approved operations | ✅ Approve dispositions | — |
| Tanzil proxy enforcement | ✅ Deploy middleware | — | ✅ Review terms |
| Rights policy approval | ❌ Cannot approve | ✅ Approve policies | ✅ Legal review |
| Reviewer bootstrap charter | ❌ Cannot define | ✅ Define charter | — |
| Coverage threshold | ❌ Cannot set | ✅ Set threshold | — |
| Slug/gloss corrections | ✅ Apply verified corrections | ✅ Verify corrections | — |
| UTF-8 normalization | ✅ Execute authorized pass | ✅ Authorize pass | — |
| Quorum activation | ✅ Implement when pool ready | ✅ Activate T3/T4 tiers | — |
| AI claim representation | ❌ NEVER represent as approved | ✅ Only council-approved claims | — |

---

## Risk Register

| Risk | Severity | Likelihood | Mitigation | Owner |
|------|----------|-----------|------------|-------|
| Tanzil proxy legal exposure | HIGH | CERTAIN (currently unenforced) | Immediate middleware deployment | Engineering + Legal |
| Scholarly council bottleneck | HIGH | MEDIUM | Prioritize high-impact decisions first; parallel WS-F/WS-G execution | Programme Lead |
| Reviewer pool too small for T3/T4 | MEDIUM | HIGH | Start with T1/T2; activate higher tiers when pool grows | Scholarly Council |
| WS-F/WS-G delay blocks full release | HIGH | MEDIUM | Engineering proceeds on resolved items; partial release possible | Programme Lead |
| Premature engineering on unresolved questions | MEDIUM | LOW | Strict gate enforcement; no implementation without RESOLVED status | Engineering Lead |
| Rights display complexity overwhelms users | LOW | MEDIUM | Progressive disclosure; UX research before implementation | Design + UX |
| CRDT merge misses transient violations | LOW | LOW | Periodic full-chain audit sweep | Engineering |

---

## Final Recommendation

**⚠️ CONDITIONAL PROCEED**

The programme has made substantial progress in MFD-12.1, resolving 20 of 39 scholarly questions with evidence-backed recommendations. The technical foundation (Gate C) is solid. Engineering can safely proceed with schema implementation, immediate corrections, and rights enforcement infrastructure.

However, full public release requires:
1. **URGENT**: Tanzil proxy enforcement (legal risk)
2. **REQUIRED**: Scholarly council ratification of 20 resolved questions
3. **REQUIRED**: Completion of WS-F and WS-G workstreams (19 remaining questions)
4. **REQUIRED**: Reviewer bootstrap governance charter definition
5. **REQUIRED**: Legal review of rights policies and performer rights template

**AI's role remains strictly assistive.** All scholarly judgments, rights approvals, and institutional authorizations require qualified human review. No AI-generated recommendation may be represented as approved in any user-facing context.

---

*proposedBy: "ai-assisted (WS-H, agent-110)" | reviewStatus: "pending-scholarly-review"*
*No production files modified. All outputs are research and design artifacts only.*
*AI will never replace scholars. This recommendation serves qualified human review, not automated authority.*
