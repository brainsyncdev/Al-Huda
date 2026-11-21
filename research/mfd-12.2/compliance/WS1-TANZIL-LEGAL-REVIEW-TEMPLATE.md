# WS1: Tanzil Legal Review Record Template

**MFD-12.2 Workstream 1 — Tanzil Rights-Compliance Remediation**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-review  
**Prerequisites:** WS1-TANZIL-COMPLIANCE-AUDIT.md, WS1-TANZIL-REMEDIATION-PLAN.md  
**Classification:** RESEARCH AND PLANNING ONLY — no production code modified

---

## Purpose

This template defines the structure for legal review records documenting counsel's evaluation of Tanzil content usage in the Quran Al Huda application. Each completed record constitutes a `ReviewDecision` with `reviewScope: RIGHTS` per MFD-12.1 WS-E-TANZIL-RIGHTS-POLICY.md §5.

One record should be completed **per edition** (or per group of editions sharing identical licensing terms) before transitioning from `link-out-enforced` to `full-display-cleared`.

---

## Review Record Structure

### 1. Identification

| Field | Value |
|-------|-------|
| **Review ID** | TANZIL-RIGHTS-YYYY-NNN (sequential) |
| **Date Initiated** | YYYY-MM-DD |
| **Date Completed** | YYYY-MM-DD |
| **Reviewer** | [Name, firm/role] |
| **Review Scope** | RIGHTS |
| **Edition(s) Under Review** | [e.g., "ur.jalandhry", "en.sahih"] |
| **Source Record ID(s)** | [e.g., "tanzil-translations", "tanzil-sahih"] |
| **Upstream URL** | https://tanzil.net/trans/{id} |
| **Publisher** | Tanzil.net |
| **Attributed Translator/Author** | [e.g., "Abdul Majid Daryabadi"] |

### 2. Usage Description

Legal counsel must evaluate the **specific usage pattern**, not abstract concepts. Provide:

#### 2.1 Technical Delivery Mechanism
- Server-side Next.js API route fetches plain text from `https://tanzil.net/trans/{id}`
- Response cached server-side for 24 hours (Next.js data cache)
- Text returned to browser with permissive CORS headers
- Browser caches parsed text in memory for session duration
- Text rendered inline alongside Arabic Quran text in reader interface
- Text searchable via server-side substring matching (`/api/v1/search?edition={id}`)
- Text used as grounding context for AI-generated responses
- No modification, transformation, or derivative creation
- Attribution displayed in reader UI and on /sources page

#### 2.2 Scale of Usage
- Number of editions accessed: [e.g., 116 translations + 2 tafsirs]
- Estimated monthly unique users accessing proxied content: [TBD — requires analytics]
- Estimated monthly API requests to Tanzil.net: [TBD — requires logging]
- Geographic distribution of users: [TBD]

#### 2.3 Commercial Context
- Application is [free/paid/freemium/ad-supported]
- Revenue model: [describe]
- Entity operating the application: [legal entity name]
- Jurisdiction of operation: [country/countries]

### 3. License Analysis

#### 3.1 Applicable License Terms
- **License identified:** [e.g., "Tanzil Terms of Use", "CC-BY-4.0", "Proprietary", "Unclear"]
- **License URL:** https://tanzil.net/docs/terms
- **License version/date:** [if applicable]
- **Full license text archived:** [Yes/No — attach or link to archived copy]

#### 3.2 Permitted Uses Analysis

For each right, document counsel's determination:

| Right | Permitted? | Conditions/Limitations | Counsel Notes |
|-------|-----------|----------------------|---------------|
| Reproduction (server caching) | ☐ Yes ☐ No ☐ Unclear | | |
| Public display (in-app rendering) | ☐ Yes ☐ No ☐ Unclear | | |
| Redistribution (proxying to users) | ☐ Yes ☐ No ☐ Unclear | | |
| Modification/derivative works | ☐ Yes ☐ No ☐ Unclear | | |
| Commercial use | ☐ Yes ☐ No ☐ Unclear | | |
| Search/indexing | ☐ Yes ☐ No ☐ Unclear | | |
| AI/ML training or grounding | ☐ Yes ☐ No ☐ Unclear | | |
| Sub-licensing | ☐ Yes ☐ No ☐ Unclear | | |

#### 3.3 Attribution Requirements
- **Required attribution format:** [exact wording/format specified by license]
- **Current app attribution:** [describe how attribution is currently displayed]
- **Compliance assessment:** ☐ Meets requirements ☐ Partially meets ☐ Does not meet ☐ N/A
- **Remediation needed:** [if any]

#### 3.4 Jurisdiction-Specific Considerations
- **Fair use / fair dealing analysis:** [applicable jurisdiction, conclusion]
- **Database rights:** [EU/UK sui generis database right assessment if applicable]
- **Moral rights:** [waiver/attribution requirements]
- **Contractual vs. license:** [is this a contractual agreement or unilateral license?]

### 4. Risk Assessment

#### 4.1 Legal Risk Rating

| Risk Level | Definition | Assigned |
|-----------|-----------|----------|
| 🟢 LOW | Clear permission; minimal litigation risk | ☐ |
| 🟡 MEDIUM | Ambiguous terms; defensible but contested interpretation possible | ☐ |
| 🔴 HIGH | No clear permission; significant litigation risk | ☐ |
| ⚫ BLOCKED | Explicitly prohibited or legally untenable | ☐ |

#### 4.2 Risk Factors
- **Enforcement history:** [Has Tanzil or the translator ever pursued enforcement against similar usage?]
- **Industry practice:** [Do comparable Quran apps use Tanzil content similarly?]
- **Term stability:** [How frequently do Tanzil's terms change? Is there notice?]
- **Revocability:** [Can permission be revoked? What happens to cached content?]
- **Third-party claims:** [Could translators/publishers claim independently of Tanzil?]

### 5. Determination

#### 5.1 Display Authorization

☐ **FULL DISPLAY CLEARED** — In-app text display permitted under identified license  
☐ **EXCERPT ONLY** — Limited excerpts permitted (max length: ___ characters)  
☐ **LINK-OUT ONLY** — No in-app display permitted; bibliographic reference + external link only  
☐ **BLOCKED** — Edition must be removed from catalog entirely  
☐ **CONDITIONAL** — Permitted subject to conditions below

#### 5.2 Conditions (if conditional)

[List specific conditions that must be met for continued use]

1. ___
2. ___
3. ___

#### 5.3 AI Grounding Authorization

☐ **PERMITTED** — Edition may be used as AI grounding context  
☐ **NOT PERMITTED** — Edition must be excluded from AI retrieval  
☐ **NOT APPLICABLE** — AI grounding not relevant to this edition

**Rationale:** [AI grounding involves reproduction in prompts and potential incorporation in generated responses. This may constitute a distinct use requiring separate analysis.]

#### 5.4 Export Authorization

☐ **PERMITTED** — Edition text may be included in PDF/EPUB exports  
☐ **NOT PERMITTED** — Edition must be excluded from exports  
☐ **CONDITIONAL** — [specify conditions]

### 6. Implementation Directives

#### 6.1 Source Record Updates

| Field | Current Value | New Value |
|-------|--------------|----------|
| `rightsStatus` | `rights-unverified` | [e.g., `cc-by-4.0`, `proprietary-permitted`, `link-out-only`] |
| `displayConstraints.linkOutOnly` | N/A | `true` / `false` |
| `displayConstraints.exportAllowed` | N/A | `true` / `false` |
| `displayConstraints.excerptMaxLength` | N/A | [number or null] |
| `displayConstraints.aiGroundingAllowed` | N/A | `true` / `false` |
| `license` | [current] | [verified license identifier] |
| `notes` | [current] | [updated with review summary] |

#### 6.2 Effective Date

**Determination effective:** YYYY-MM-DD  
**Implementation deadline:** YYYY-MM-DD  
**Next review date:** YYYY-MM-DD (recommended: annual)

### 7. Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Legal Counsel | | | |
| Product Owner | | | |
| Engineering Lead | | | |

### 8. Attachments

- [ ] Archived copy of license terms (dated)
- [ ] Screenshot of current attribution display
- [ ] Technical architecture diagram of proxy flow
- [ ] Correspondence with Tanzil/publisher (if any)
- [ ] Fair use/dealing memorandum (if applicable)
- [ ] Prior art / industry practice survey

---

## Batch Review Guidance

For efficiency, editions sharing identical licensing terms may be reviewed as a batch:

| Batch | Editions | Shared License | Notes |
|-------|----------|---------------|-------|
| B1 | All Tanzil translations (non-Sahih, non-translit) | Tanzil Terms of Use | 114 editions |
| B2 | en.sahih | Tanzil Terms of Use (Saheeh International) | May have separate publisher terms |
| B3 | en.transliteration | Tanzil Terms of Use | Algorithmic, not human-authored |
| B4 | ar.jalalayn | Tanzil Terms of Use (classical text) | Public domain in many jurisdictions |
| B5 | ar.muyassar | Tanzil Terms of Use (King Fahd Complex) | Government publication; check KSA terms |

**Important:** Batch review is permissible only when the legal analysis is genuinely identical. If any edition within a batch has distinguishing factors (different translator, different publisher terms, different jurisdiction), it requires individual review.

---

## Review Decision Lifecycle

```
[Initiated] → [In Progress] → [Determination Made] → [Implemented] → [Active]
                                                        ↓
                                                  [Under Re-review]
                                                        ↓
                                              [Revoked / Modified]
```

- **Initiated:** Review record created, assigned to counsel
- **In Progress:** Counsel gathering information, analyzing terms
- **Determination Made:** Section 5 completed, awaiting sign-off
- **Implemented:** Source record updated, API gate adjusted
- **Active:** Determination in effect, next review scheduled
- **Under Re-review:** Triggered by license change, enforcement action, or annual cycle
- **Revoked/Modified:** New determination supersedes previous

---

## Integration with MFD-12 Governance

This template aligns with:
- **MFD-12-SOURCE-REGISTRY-SPEC.md §5.4** — Impact Matrix for rights statuses
- **MFD-12-REVIEW-WORKFLOW-SPEC.md §3** — ReviewDecision schema
- **WS-E-TANZIL-RIGHTS-POLICY.md §3** — Per-edition granularity directive
- **WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md** — Consolidated rights evidence framework

Each completed review record should be stored in `research/mfd-12.2/compliance/reviews/` with filename `TANZIL-RIGHTS-YYYY-NNN-{edition-slug}.md`.

---

## Quick Reference: What Counsel Needs to Evaluate

1. **Does Tanzil's Terms of Use permit server-side proxying?** (reproduction + redistribution)
2. **Does it permit in-app display to end users?** (public performance/display)
3. **Does it permit commercial use?** (depends on app's revenue model)
4. **Are attribution requirements met?** (current UI display)
5. **Does it permit AI grounding use?** (reproduction in prompts, potential incorporation in outputs)
6. **Is the license stable and irrevocable?** (term change risk)
7. **Do individual translators retain independent rights?** (third-party claim risk)
8. **What jurisdiction governs?** (Pakistan-based project, global users, Tanzil hosted internationally)
