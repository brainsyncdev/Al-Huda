# Legal Engagement Letter — Independent Counsel Commission

**MFD-12.4 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** COMMISSIONING DOCUMENT — Not legal advice; not a compliance determination

---

## [Letterhead Placeholder]

**To:** [Independent Legal Counsel Name / Firm]  
**From:** [Product Owner / Authorized Representative], Quran Al Huda Project  
**Re:** Engagement for Content Rights & Licensing Review (MFD-12.4 / TANZIL-RIGHTS-2026-001)  
**Date:** 2026-11-21  

---

Dear Counsel,

We are writing to formally engage your services as independent legal counsel to conduct a comprehensive content rights and licensing review for the **Quran Al Huda** application. This engagement follows an AI-assisted preparatory audit (MFD-12.2 and MFD-12.3) that has assembled a factual record, identified critical gaps, and prepared structured commissioning materials for your review.

This letter defines the scope, deliverables, timeline expectations, and engagement terms. All determinations under this engagement are reserved exclusively for you as qualified legal counsel. The preparatory materials are AI-generated research documentation and do not constitute legal advice or compliance certifications.

---

## 1. Scope of Engagement

### 1.1 Content Sources Under Review

You are asked to evaluate the rights status and permitted uses for **nine distinct content sources** delivered through six technical mechanisms:

| # | Source | Delivery Mechanism | Editions |
|---|--------|-------------------|----------|
| 1 | Tanzil.net translations | Server-side proxy + search fetch | ~116 translations in 44 languages |
| 2 | Tafsir al-Jalalayn (`ar.jalalayn`) | Server-side proxy | 1 classical tafsir |
| 3 | Tafsir al-Muyassar (`ar.muyassar`) | Server-side proxy | 1 contemporary tafsir |
| 4 | quran-json@3.1.2 | Bundled npm package (CC-BY-4.0) | Arabic text, English translation, transliteration |
| 5 | QuranEnc (via quran-json) | Bundled within package | Uthmani Arabic text, chapter metadata |
| 6 | Islamic Network CDN audio | Client-side streaming | 12 reciters × 6 bitrates |
| 7 | Semantic embeddings (Xenova/all-MiniLM-L6-v2) | Vendored index + CDN model | Derived from quran-json English translation |
| 8 | QUL word data (TarteelAI) | Vendored per-surah JSON | Word segmentation, transliteration, gloss |
| 9 | Tanzil mushaf metadata | Build-time snapshot (CC-BY) | Juz/page/hizb boundary data |

### 1.2 Use Patterns Requiring Separate Evaluation

Each of the following is a distinct use that must be evaluated independently:

- Server-side reproduction (24-hour Next.js data cache)
- Process-lifetime in-memory retention (search modules)
- Forwarded browser copy and browser HTTP caching
- In-app public display alongside Arabic Quran text
- Parallel display of up to three additional editions
- Server-side full-text substring search and result excerpts
- AI grounding (reproduction in prompts; potential incorporation in generated outputs)
- Client-side audio streaming
- Build-time derivation (embeddings, word data, boundary tables)
- Vendored redistribution of build-time artifacts

### 1.3 Specific Questions Put to Counsel

The complete structured question list is provided in **WS1-LEGAL-QUESTIONS.md**. Key questions include:

1. Does Tanzil's Terms of Use permit server-side proxying, caching, and redistribution of full translation text?
2. What legal basis permits streaming audio recordings from Islamic Network CDN, which publishes no explicit copyright license?
3. Do precomputed semantic embeddings constitute "Adapted Material" under CC-BY-4.0?
4. Does the current attribution display satisfy CC-BY-4.0 §3(a)(1), MIT, and Apache-2.0 notice requirements in a web application context?
5. What interim posture should apply while the review is in progress?
6. Are there jurisdiction-specific considerations (fair use/fair dealing, database rights, moral rights) applicable to this Pakistan-based project with global users?

### 1.4 Batch Review Groups

For efficiency, editions sharing identical licensing terms may be reviewed as batches (B1–B9). Batch review is permissible only where the legal analysis is genuinely identical. The commission template identifies specific editions requiring individual carve-out review (e.g., `ur.jalandhry` as default translation, `ar.muyassar` as KSA government publication, `ar.jalalayn` as potential public domain).

---

## 2. Deliverables Expected from Counsel

| # | Deliverable | Description |
|---|-------------|-------------|
| D1 | Completed Review Records | One `ReviewDecision` record per batch (or per carved-out edition) using the template in WS1-LEGAL-REVIEW-COMMISSION.md §5–§6 |
| D2 | Interim Posture Directive | Written directive on delivery posture during the review period (R-03) |
| D3 | Archived Tanzil Terms of Use | Dated, verbatim archive of operative terms (R-01) |
| D4 | Remediation Recommendations | Response to each candidate action in WS1-REMEDIATION-REQUIREMENTS.md (recommend, modify, or reject) |
| D5 | Attribution Sufficiency Determination | Confirmation or correction of current attribution for all sources (R-07) |
| D6 | AI Grounding Authorization | Per-batch determination for AI grounding use (R-04) |
| D7 | Audio Streaming Legal Basis | Determination and recommended path forward (R-05) |
| D8 | Sign-Off | Execution of §7 sign-off block in the commission template |

---

## 3. Timeline Expectations

| Milestone | Target | Notes |
|-----------|--------|-------|
| Engagement acceptance and conflict check | Within 5 business days of this letter | Required before work begins |
| R-01 (Archive Tanzil ToU) completed | Within 10 business days of acceptance | Dependency for most other items |
| R-03 (Interim posture directive) issued | Within 10 business days of acceptance | Independent; should not wait on other items |
| R-09 facts received from Product Owner | Within 10 business days of acceptance | Product Owner dependency |
| P0 determinations (R-01 through R-05) complete | Within 30 business days of acceptance | Blocks release posture claims |
| P1 determinations (R-06 through R-12) complete | Within 45 business days of acceptance | Can proceed in parallel after P0 |
| P2 determinations (R-13 through R-16) complete | Within 60 business days of acceptance | Hygiene items |
| Final sign-off and implementation directives | Within 70 business days of acceptance | Triggers engineering remediation |

These targets are aspirational and subject to mutual agreement. Please propose adjusted timelines upon acceptance if needed.

---

## 4. Confidentiality and Privilege

### 4.1 Attorney-Client Privilege

This engagement is sought for the purpose of obtaining legal advice. All communications, work product, and determinations produced under this engagement are intended to be protected by attorney-client privilege and/or applicable legal professional privilege. The Quran Al Huda project asserts such privilege over all materials exchanged.

### 4.2 Confidentiality Obligations

All materials provided under this engagement, including source code references, technical architecture documentation, and business context, are confidential. Counsel shall not disclose any engagement materials to third parties without prior written consent, except as required by law or professional obligation.

### 4.3 AI-Assisted Materials Disclaimer

The preparatory materials (MFD-12.2 and MFD-12.3 outputs) were generated with AI assistance. They are factual research documentation, not legal analysis. Counsel should treat them as starting points for independent verification, not as authoritative conclusions. No AI-generated risk rating or preliminary assessment should be relied upon as a legal determination.

---

## 5. Fee Structure

| Item | Rate / Estimate | Notes |
|------|----------------|-------|
| Hourly rate | [TO BE AGREED] | Per counsel's standard rate schedule |
| Estimated hours for P0 items | [TO BE ESTIMATED BY COUNSEL] | R-01 through R-05 |
| Estimated hours for full engagement | [TO BE ESTIMATED BY COUNSEL] | R-01 through R-16 plus sign-off |
| Retainer amount | [TO BE AGREED] | Due upon engagement acceptance |
| Billing frequency | Monthly | Detailed time entries referencing R-item IDs |
| Expense policy | Pre-approval required for expenses >$[AMOUNT] | Includes license archive tools, translation services if needed |

Please provide a detailed fee estimate and retainer requirement upon acceptance of this engagement.

---

## 6. Conflict of Interest Disclosure

Before commencing work, counsel must confirm in writing that:

1. No current or past representation of Tanzil.net, Islamic Network, QuranEnc, Risan Bagja Pradana (quran-json author), TarteelAI, King Fahd Complex for the Printing of the Holy Quran, or any translator/publisher whose works are included in the Tanzil translation corpus creates a conflict of interest.
2. No financial interest in any of the above entities exists.
3. No other engagement would impair independent judgment regarding the rights status of the content sources under review.
4. Any potential or perceived conflict has been disclosed in writing and waived by the client.

If a conflict arises during the engagement, counsel must notify the client immediately and cease work on affected matters until resolution.

---

## 7. Materials Provided

A complete inventory of documents provided with this engagement letter is attached as **WS1-DOCUMENT-CHECKLIST.md**. Key materials include:

- Commission template with all AI-determinable fields completed
- Per-source evidence package with gap analysis
- Remediation requirements with priority sequencing
- Scope and limitations document
- Compliance audit findings
- Legal review record template

---

## 8. Acceptance

Please indicate acceptance of this engagement by signing below and returning a copy to [Product Owner Contact]. Upon acceptance, we will schedule an initial briefing call and provide access to the application repository and live environment as needed.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Legal Counsel | | | |

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Input documents** | WS1-LEGAL-REVIEW-COMMISSION.md, WS1-EVIDENCE-PACKAGE.md, WS1-REMEDIATION-REQUIREMENTS.md, WS1-SCOPE-AND-LIMITATIONS.md, WS1-TANZIL-COMPLIANCE-AUDIT.md, WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md |
| **Disclaimer** | This document was generated by AI assistance. It is a commissioning letter for human legal counsel, not legal advice. All determinations are reserved for qualified legal counsel. |