# MFD-12.1 Critical Findings Register

| Field | Value |
|-------|-------|
| Programme | FAHM Quran App — MFD-12.1 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (WS-H, agent-110) |
| Review Status | pending-scholarly-review |
| Scope | RESEARCH ONLY — no production modifications |

---

## Overview

This document catalogs high-severity discoveries across all MFD-12.1 workstreams that require immediate attention, urgent action, or elevated scholarly/legal review. Findings are ordered by severity and urgency.

---

## 🔴 CRITICAL — Immediate Action Required

### CF-01: Tanzil Proxy Compliance Gap (WS-E)

**Severity:** CRITICAL  
**Urgency:** IMMEDIATE (Week 1)  
**Source:** [WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md](./governance/WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md) §P1  
**Question:** Q30

**Finding:** Sources marked `rights-unverified` with `api-import` provenance are NOT currently enforcing `linkOutOnly: true` at the API layer. This means proxied content from Tanzil.net is being served directly to users without verified distribution rights, constituting potential unauthorized redistribution.

**Risk:** Legal liability for copyright infringement. Tanzil.net's terms of service may prohibit direct content serving without explicit licensing agreement.

**Required Action:**
1. Deploy API middleware enforcing `linkOutOnly: true` for all `rights-unverified` + `api-import` sources
2. Add `Source.displayConstraints.proxyComplianceMode` field to track enforcement
3. Add `Edition.proxyEndpoint` field for audit trail
4. Establish per-edition legal review queue via ReviewDecision workflow

**Owner:** Engineering (deployment) + Legal Counsel (terms review)

---

### CF-02: Art-Boundaries Misclassifications (WS-A)

**Severity:** HIGH  
**Urgency:** IMMEDIATE (no scholarly deliberation needed)  
**Source:** [WS-A-CONSOLIDATED-REVIEW-PACKAGE.md](./reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md) §Priority Recommendations  
**Question:** Q10

**Finding:** All 4 topic-ayah mappings under `art-boundaries` are demonstrably misclassified:
- 31:6 — Actually about idle talk/distraction, not art boundaries
- 17:32 — About approaching immorality, not art
- 24:19 — About spreading slander, not art
- 49:11 — About mocking/backbiting, not art

No scholarly position in any tradition supports their current placement under an arts-related topic.

**Required Action:**
1. Remove all 4 TopicAyahMapping records from `art-boundaries`
2. Reassign verses to correct topics (idle-talk, immorality, slander, backbiting)
3. Consider deprecating `art-boundaries` topic entirely pending Q6 arts domain dissolution decision

**Owner:** Engineering (execution) + Scholarly Council (acknowledgment only)

---

### CF-03: Covenant/Peace Topic Contamination (WS-A)

**Severity:** HIGH  
**Urgency:** IMMEDIATE (no scholarly deliberation needed)  
**Source:** [WS-A-CONSOLIDATED-REVIEW-PACKAGE.md](./reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md) §Priority Recommendations  
**Question:** Q9 (sub-question)

**Finding:** Verses 5:1 and 16:91 are currently mapped under `peace-agreements` but use the ʿ-h-d root (covenant/treaty), not s-l-m (peace). These belong under a covenant-specific topic regardless of how Q3 (covenant boundary) is ultimately resolved.

**Required Action:**
1. Move 5:1 and 16:91 mappings from `peace-agreements` to appropriate covenant topic
2. Flag for Q3 resolution whether covenant topic should split into general-ʿahd vs treaty-mīthāq

**Owner:** Engineering (execution) + Scholarly Council (acknowledgment only)

---

### CF-04: Nafs/Qalb Reclassification Error (WS-A)

**Severity:** MEDIUM-HIGH  
**Urgency:** IMMEDIATE (no scholarly deliberation needed)  
**Source:** [WS-A-CONSOLIDATED-REVIEW-PACKAGE.md](./reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md) §Priority Recommendations  
**Question:** Q1 (cross-cutting)

**Finding:** Verse 13:28 is currently mapped under `nafs-mutmainna` but uses *tatma'innu qulūbuhum* (hearts finding rest), applying the ṭ-m-n root to *qalb* (heart), not *nafs* (self/soul). This is a lexical error independent of the broader Q1 nafs typology decision.

**Required Action:**
1. Reclassify 13:28 from `nafs-mutmainna` to `qalb-purification` or equivalent heart-centered topic
2. Note this correction in Q1 brief as objective error separate from typology debate

**Owner:** Engineering (execution) + Scholarly Council (acknowledgment only)

---

## 🟡 HIGH — Requires Elevated Attention

### CF-05: Husn-Concept Hadith Provenance (WS-A)

**Severity:** HIGH  
**Urgency:** Before taxonomy finalization  
**Source:** [WS-A-CONSOLIDATED-REVIEW-PACKAGE.md](./reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md) §Cross-Reference Matrix  
**Question:** Q1, Q5, Q6 (cross-cutting)

**Finding:** Several concepts in the current taxonomy derive primarily from hadith literature rather than explicit Qur'anic text. The provenance classification (Qur'anic-explicit vs hadith-derived vs editorial) has not been systematically applied. This affects:
- Divine names benefits (asma-ul-husna cluster in WS-C phantoms)
- Jihad typology distinctions (greater vs lesser jihad)
- Eschatological details (dajjal, paradise/hell levels)

**Risk:** Presenting hadith-derived concepts with the same epistemic status as Qur'anic-explicit content undermines the app's scholarly integrity and Qur'an-centred mission.

**Required Action:**
1. Systematic provenance audit of all topics in Hadith & Sunnah, Eschatology, and Asma ul Husna clusters
2. Apply provenance tags consistently: `quranic-explicit`, `hadith-derived`, `editorial-synthesis`
3. WS-G must address Q4 (hadith-derived topics status) before these topics are created

**Owner:** Scholarly Council (provenance determination) + Engineering (tag implementation)

---

### CF-06: 15 Scholarly Taxonomy Gaps (WS-C)

**Severity:** HIGH  
**Urgency:** Before phantom CREATE execution  
**Source:** [WS-C-PHANTOM-SUMMARY.md](./reconciliation/WS-C-PHANTOM-SUMMARY.md) §Scholarly Gaps Identified  
**Question:** Q37

**Finding:** 15 phantom CREATE candidates represent genuine gaps where important Islamic concepts discussed in classical tafsir and literature have no corresponding topic in the current taxonomy:

| Domain | Missing Topics | Significance |
|--------|---------------|-------------|
| Divine Attributes | attributes-of-action, attributes-of-beauty, attributes-of-essence, attributes-of-majesty, divine-justice | Standard theological categories (sifat al-fi'l, sifat al-jamal, sifat al-dhat, sifat al-jalal, al-Adl) entirely absent |
| Asma ul Husna | asma-ul-husna-benefits, asma-ul-husna-meanings | Core devotional and theological topics missing |
| Jihad Studies | greater-lesser-jihad, jihad-types | Critical distinctions often misunderstood; needs clear treatment |
| Tawheed | hidden-shirk | Shirk khafi/riya essential for spiritual purification |
| Unseen World | jinn-nature, jinn-types, protection-from-jinn | Fundamental aqeedah topics on unseen creation |
| Fiqh Jinayat | qisas-retaliation | Major fiqh chapter on criminal law missing |
| Spiritual Purification | tazkiyah | Entire discipline of soul purification absent as standalone topic |

**Risk:** Creating these topics without scholarly review risks embedding incorrect definitions, scopes, or mappings. Some (e.g., greater-lesser-jihad) are actively contested in contemporary discourse.

**Required Action:**
1. Prioritize these 15 for scholarly review BEFORE batch CREATE execution
2. Assign to WS-G or dedicated scholarly review session
3. Do not auto-generate content for these topics

**Owner:** Scholarly Council (review and approval) + Engineering (deferred CREATE execution)

---

### CF-07: Audio Performer Rights Conflation (WS-E)

**Severity:** MEDIUM-HIGH  
**Urgency:** Before audio feature launch  
**Source:** [WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md](./governance/WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md) §P2  
**Question:** Q31

**Finding:** Current data model conflates distribution rights (license to distribute recording) with performer rights (reciter's authorization). A source may have valid distribution rights but lack performer authorization, or vice versa. Playback should be gated until both layers are verified.

**Risk:** Playing recitations without performer authorization violates moral rights and potentially contractual obligations. Misattribution undermines tajweed verification credibility.

**Required Action:**
1. Approve dual-rights schema extension (`Source.recitationRights`)
2. Implement playback gating logic
3. Create standardized performer authorization template
4. Audit existing recitation sources for performer rights status

**Owner:** Engineering (schema + gating) + Legal (template) + Scholarly Council (policy approval)

---

## 🟢 MEDIUM — Documented for Tracking

### CF-08: Arts Domain Dissolution Scale (WS-A)

**Severity:** MEDIUM  
**Urgency:** Before migration Phase 2  
**Source:** [WS-A-CONSOLIDATED-REVIEW-PACKAGE.md](./reviews/WS-A-CONSOLIDATED-REVIEW-PACKAGE.md) §Priority Recommendations  
**Question:** Q6

**Finding:** Arts domain dissolution is the largest structural change in MFD-12.1: affects 1 domain, 5 dimensions, ~10 topics, ~30 mappings. While evidence strongly supports dissolution per MFD-11.3-B, the scale requires careful migration planning and post-migration audit.

**Required Action:** Council confirmation before migration; dedicated migration script with rollback capability.

---

### CF-09: Jihād/Qitāl Separation Impact (WS-A)

**Severity:** MEDIUM  
**Urgency:** Before war-peace domain restructuring  
**Source:** [WS-A-JIHAD-QITAL-BRIEF.md](./reviews/WS-A-JIHAD-QITAL-BRIEF.md)  
**Question:** Q5

**Finding:** Confirming jihād/qitāl distinction affects core war-peace taxonomy. Minimum 4 mapping reassignments required. Dimension restructuring needed within war-peace-conflict domain. Cross-cutting with WS-C phantom candidates in Fiqh Siyar cluster (6 topics).

**Required Action:** Council confirmation; coordinated update across WS-A, WS-C, and migration scripts.

---

### CF-10: Edition Rights Enum Asymmetry Bug (WS-E)

**Severity:** MEDIUM  
**Urgency:** Before rights computation service  
**Source:** [WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md](./governance/WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md) §P4  
**Question:** Q33

**Finding:** The `rightsOverride` enum in Edition entity is missing license values present in Source entity, causing asymmetric inheritance computation. Additionally, derivative-works support is absent, preventing proper modeling of translations based on other translations.

**Required Action:** Fix enum; add `derivativeOfWork` linking; implement computed source rights from editions.

---

### CF-11: Community Source Trust Tier Automation Boundaries (WS-E)

**Severity:** MEDIUM  
**Urgency:** Before trust tier implementation  
**Source:** [WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md](./governance/WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md) §Open Questions  
**Question:** Q32

**Finding:** Four-tier trust model requires human verification at each tier. Open question: can any T0→T1 checks be safely automated (e.g., ISBN validation)? Over-automation risks promoting unvetted sources; under-automation creates bottleneck.

**Required Action:** Define automation boundaries before implementation; err on side of human verification.

---

### CF-12: Reviewer Bootstrap Problem (WS-B)

**Severity:** MEDIUM  
**Urgency:** Before first SCHOLARLY decisions  
**Source:** [WS-B-GOVERNANCE-CONSOLIDATED.md](./governance/WS-B-GOVERNANCE-CONSOLIDATED.md) §9  
**Question:** Q34

**Finding:** ReviewerIdentity entity requires authorization chains, but the first scholars have no prior authorized reviewers to credential them. This chicken-and-egg problem requires a governance body charter defining initial credentialing authority.

**Required Action:** Define bootstrap charter before implementing ReviewerIdentity; consider founding council model.

---

## Summary Statistics

| Severity | Count | Immediate Action | Before Migration | Before Launch |
|----------|-------|-----------------|-----------------|---------------|
| 🔴 CRITICAL | 1 | CF-01 | — | — |
| 🟡 HIGH | 3 | CF-02, CF-03, CF-04 | CF-05, CF-06 | CF-07 |
| 🟢 MEDIUM | 5 | — | CF-08, CF-09, CF-10 | CF-11, CF-12 |
| **Total** | **12** | **4** | **5** | **3** |

---

## Cross-Reference to Disposition Register

| Critical Finding | Related Questions | Workstream | Disposition |
|-----------------|------------------|------------|-------------|
| CF-01 Tanzil Proxy | Q30 | WS-E | RESOLVED (enforcement URGENT) |
| CF-02 Art-Boundaries | Q10 | WS-A | RESOLVED (immediate correction) |
| CF-03 Covenant Contamination | Q9, Q3 | WS-A, WS-G | RESOLVED / PENDING |
| CF-04 Nafs/Qalb Error | Q1 | WS-A | RESOLVED (immediate correction) |
| CF-05 Hadith Provenance | Q4, Q1, Q5, Q6 | WS-G, WS-A | PENDING / RESOLVED |
| CF-06 Taxonomy Gaps | Q37 | WS-C | RESOLVED (CREATE deferred for review) |
| CF-07 Audio Rights | Q31 | WS-E | RESOLVED (schema proposed) |
| CF-08 Arts Dissolution | Q6 | WS-A | RESOLVED (council confirmation needed) |
| CF-09 Jihad/Qital | Q5 | WS-A | RESOLVED (council confirmation needed) |
| CF-10 Enum Bug | Q33 | WS-E | RESOLVED (fix proposed) |
| CF-11 Trust Automation | Q32 | WS-E | RESOLVED (boundaries undefined) |
| CF-12 Bootstrap | Q34 | WS-B | RESOLVED (charter undefined) |

---

*proposedBy: "ai-assisted (WS-H, agent-110)" | reviewStatus: "pending-scholarly-review"*
*No production files modified. All outputs are research and design artifacts only.*
*AI will never replace scholars. This register serves qualified human review, not automated authority.*
