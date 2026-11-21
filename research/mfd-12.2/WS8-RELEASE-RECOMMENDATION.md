# WS8: Independent Release Recommendation

| Field | Value |
|-------|-------|
| **Workstream** | MFD-12.2 WS8 (Verified-Core Eligibility & Final Release Recommendation) |
| **Date** | 2026-11-21 |
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-review |
| **Classification** | RESEARCH AND PLANNING ONLY — no production code modified |
| **Supersedes** | MFD-12.1 Release Recommendation (for MFD-12.2 scope) |

---

## 1. Executive Summary

MFD-12.2 has produced comprehensive research artifacts across five workstreams (WS1–WS5). All workstreams maintained strict research-only discipline with zero production modifications. Production integrity is verified intact.

**Overall Verdict: ⚠️ CONDITIONAL PROCEED — Phase 0 Only**

Only two changes are ready for immediate deployment. All other changes require prerequisite approvals or engineering implementation that has not yet occurred.

---

## 2. Phase 0: Deploy Immediately (Week 1)

These items have sufficient evidence, acceptable risk profiles, and no blocking prerequisites:

### 2.1 Tanzil Proxy Enforcement (WS1)

**Rationale:** Legal risk of continued unauthorized redistribution exceeds regression risk. Feature flag provides instant rollback.

**Prerequisites Met:**
- ✅ Compliance audit complete (WS1-TANZIL-COMPLIANCE-AUDIT.md)
- ✅ Remediation plan detailed with pseudocode (WS1-TANZIL-REMEDIATION-PLAN.md)
- ✅ Rollback strategy defined (feature flag)
- ✅ Testing strategy specified
- ✅ User communication templates designed

**Action Required:**
1. Engineering implements Phase 1 (API layer enforcement) + Phase 2 (client degradation)
2. Deploy behind `TANZIL_RIGHTS_ENFORCEMENT=true` feature flag
3. Monitor for 48 hours; rollback if critical issues arise
4. Begin priority rights clearance queue (ur.jalandhry first)

**Estimated Effort:** 5–7 days engineering + 2 days testing

### 2.2 Art-Boundaries Corrections (WS-A from MFD-12.1)

**Rationale:** Objective error corrections with clear evidence basis. Low regression risk.

**Items:**
- Q10: Art-boundaries topic reclassification
- Q9: Covenant misplacements fix (5:1, 16:91 moved from peace-agreements)
- Q1: Nafs/qalb reclassification (13:28)

**Action Required:**
1. Apply corrections as single atomic commit
2. Verify post-application referential integrity
3. Update integrity baseline hashes

**Estimated Effort:** 0.5 day

---

## 3. Requires Scholarly Council Approval First

These items have complete research but need formal scholarly ratification before engineering can proceed:

### 3.1 Phantom CREATE/MERGE Operations (WS4)

**Status:** All 243 references classified with dispositions. Complete register delivered.

**Blocking:** Scholarly council must approve CREATE (190 refs), MERGE (23 refs), and DEFER (26 refs) dispositions before execution. DEPRECATE (4 refs) can proceed without approval.

**Recommendation:** Execute DEPRECATE operations immediately (Phase 0). Submit CREATE/MERGE dispositions for scholarly review. Prioritize high-reference-count phantoms (marriage-contract: 5 refs, animal-welfare: 3 refs).

### 3.2 Schema Additions (WS2)

**Status:** Complete schemas, TypeScript interfaces, implementation checklist, and migration specs delivered.

**Blocking:** Scholarly approval of WS-D resolutions (Q24, Q25, Q27, Q29, Q38) required before schema deployment.

**Recommendation:** Submit WS-D resolutions for council ratification. Engineering can prepare implementation in staging environment while awaiting approval.

### 3.3 Mojibake Normalization (WS5)

**Status:** Characterization complete. Triple-encoding confirmed with mixed depth.

**Blocking:** Scholarly authorization of UTF-8 normalization pass (Q39) required. Human review of normalized output required before committing.

**Recommendation:** Do NOT execute normalization without Q39 authorization. Mixed encoding depth makes automated correction error-prone. Prepare normalization tooling and test on copies while awaiting authorization.

### 3.4 Coverage Threshold Policy (Q13)

**Status:** Current ~65% mapping rate needs scholarly acceptance as publication threshold.

**Blocking:** No domain currently meets publication gates under any reasonable threshold. Council must define acceptable coverage level.

---

## 4. Requires Legal Review First

### 4.1 Tanzil Terms of Use Review

**Status:** WS1 audit identifies legal risk but Tanzil terms have NOT been reviewed by legal counsel.

**Blocking Questions:**
- Does server-side proxying constitute "redistribution" under Tanzil's terms?
- Does in-app display satisfy "no modification" requirement?
- Are attribution requirements met by current UI?
- Do commercial/non-commercial distinctions apply?

**Recommendation:** Engage legal counsel immediately. Phase 0 enforcement (linkOutOnly) is the safe default regardless of legal outcome. If counsel determines proxying IS permitted, enforcement can be relaxed per-edition through the clearance queue.

### 4.2 Performer Rights Authorization Template

**Status:** Undefined per MFD-12.1 Gate F.

**Blocking:** Audio content cannot be published without performer rights clearance.

---

## 5. Requires Engineering Implementation Before Testing

### 5.1 Governance Infrastructure (WS3)

**Status:** Complete design specs, schemas, prerequisites checklist, and test case definitions. Zero implementation exists.

**Blocking Prerequisites (from WS3-IMPLEMENTATION-PREREQUISITES.md):**
- ❌ Bootstrap Authorization Committee (P-BAC) not formed
- ❌ Initial reviewer roster (P-ROSTER) not assembled
- ❌ Privacy policy for reviewer PII (P-PRIVACY) undefined
- ❌ ReviewDecision extension schema (P-RD-EXT) not authored
- ❌ Storage adapter interface (P-ADAPTER) not designed
- ❌ Test environment (P-TESTENV) not provisioned

**Recommendation:** Governance infrastructure is a multi-month effort. Begin Stage 0 (decisions & sign-offs) immediately in parallel with Phase 0 deployments. Do not attempt to implement governance code before Stage 0 completes.

### 5.2 Source Catalog Corrections (WS1 Phase 3)

**Status:** Remediation plan specifies corrections but implementation not started.

**Items:**
- Fix `method: "package"` → `method: "link"` for tanzil-sahih and tanzil-translit
- Add `rightsStatus` field to source records
- Create translation-to-source mapping function

**Recommendation:** Implement as part of Phase 0 Tanzil enforcement (these are prerequisites for the rights gate).

---

## 6. Overall Release Readiness Verdict

### What CAN Ship Now (Phase 0)

| Item | Risk | Effort | Legal Block? | Scholarly Block? |
|------|------|--------|-------------|------------------|
| Tanzil proxy enforcement | 🟡 Medium-High (reversible) | 5–7 days | No (safe default) | No |
| Art-boundaries corrections | 🟢 Low | 0.5 day | No | No (objective errors) |
| Phantom DEPRECATE (4 refs) | 🟢 Low | 0.5 day | No | No (erroneous refs) |
| Source catalog corrections | 🟢 Low | 1 day | No | No |

### What CANNOT Ship Yet

| Item | Blocking Reason | Estimated Unblock Timeline |
|------|----------------|---------------------------|
| Phantom CREATE/MERGE | Scholarly approval of dispositions | 2–4 weeks |
| Schema additions | Scholarly approval of WS-D resolutions | 2–4 weeks |
| Mojibake normalization | Q39 authorization + human review | 4–6 weeks |
| Governance infrastructure | Stage 0 prerequisites (BAC, roster, policies) | 2–3 months |
| Full verified-core content | All above + rights clearance pipeline | 6+ months |
| Public release without disclaimers | Verified-core eligibility = 0 entries | 6+ months |

---

## 7. Research-Preview Deployment Recommendation

Given that zero content qualifies as verified-core, the application should deploy with prominent research-preview labelling:

1. **Site-wide banner**: "Research Preview — Content is provisional and unverified"
2. **Per-entry indicators**: Show verification status flags (see WS8-VERIFIED-CORE-ELIGIBILITY.md §4)
3. **Disclaimer on every page**: Standard disclaimer text linking to verification process documentation
4. **No "approved" or "verified" badges**: Until governance infrastructure ships and first reviews complete

This allows continued scholarly utility while being transparent about verification status.

---

## 8. Risk-Benefit Summary

| Scenario | Benefit | Risk | Recommendation |
|----------|---------|------|----------------|
| Deploy Phase 0 now | Eliminates legal exposure; fixes known errors | Medium regression risk (mitigated by feature flag) | ✅ PROCEED |
| Wait for full verification before any deployment | Zero regression risk | Continued legal exposure; delayed user value | ❌ DO NOT WAIT |
| Deploy everything without scholarly approval | Fast feature delivery | Violates governance principles; potential scholarly errors | ❌ DO NOT PROCEED |
| Deploy research-preview with disclaimers | Transparent user communication; continued utility | Users may ignore disclaimers | ✅ PROCEED WITH PHASE 0 |

---

## 9. Final Recommendation

**⚠️ CONDITIONAL PROCEED — Phase 0 Only**

1. **IMMEDIATE (Week 1):** Deploy Tanzil proxy enforcement + art-boundaries corrections + phantom DEPRECATE + source catalog corrections
2. **SHORT-TERM (Weeks 2–4):** Submit scholarly approval requests for phantom CREATE/MERGE dispositions and WS-D schema resolutions
3. **MEDIUM-TERM (Weeks 4–12):** Begin governance Stage 0; prepare mojibake normalization tooling; start priority rights clearance
4. **LONG-TERM (Months 3–6+):** Execute approved phantom operations; deploy schema additions; complete governance bootstrap; achieve first verified-core content

**AI's role remains strictly assistive.** All scholarly judgments, rights approvals, and institutional authorizations require qualified human review. No AI-generated recommendation may be represented as approved in any user-facing context.

---

*proposedBy: ai-assisted | reviewStatus: pending-review*
*No production files modified. All outputs are research and planning artifacts only.*
*AI will never replace scholars. This recommendation serves qualified human review, not automated authority.*
