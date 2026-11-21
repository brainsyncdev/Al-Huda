# Document Checklist — Materials Provided to Legal Counsel

**MFD-12.4 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** COMMISSIONING DOCUMENT — Not legal advice; not a compliance determination

---

## Purpose

This checklist provides a complete inventory of all documents and materials provided to independent legal counsel as part of the MFD-12.4 legal review engagement. Each entry includes the document path, description, relevance, and any caveats counsel should note.

---

## MFD-12.4 Commissioning Documents (Primary)

These documents were produced specifically for this engagement and constitute the primary briefing materials.

| # | Document | Path | Description | Relevance |
|---|----------|------|-------------|-----------|
| 1 | Legal Engagement Letter | `research/mfd-12.4/legal/WS1-LEGAL-ENGAGEMENT-LETTER.md` | Formal commission letter defining scope, deliverables, timeline, confidentiality, fee structure, and conflict disclosure requirements | Governing engagement terms |
| 2 | Executive Briefing for Counsel | `research/mfd-12.4/legal/WS1-COUNSEL-BRIEFING.md` | Two-page summary covering FAHM architecture, 5 P0 items, 6 contradictions, technical state, and AI-vs-counsel distinction | Orientation and prioritization |
| 3 | Structured Legal Questions | `research/mfd-12.4/legal/WS1-LEGAL-QUESTIONS.md` | Organized question list by source with evidence cross-references | Primary work assignment |
| 4 | Document Checklist (this file) | `research/mfd-12.4/legal/WS1-DOCUMENT-CHECKLIST.md` | Complete inventory of provided materials | Reference and completeness verification |

---

## MFD-12.3 Commissioning Package (Preparatory)

These documents were produced in the preceding phase (MFD-12.3) and contain the factual record, gap analysis, and determination framework.

| # | Document | Path | Description | Caveats |
|---|----------|------|-------------|---------|
| 5 | Legal Review Commission Template | `research/mfd-12.3/legal/WS1-LEGAL-REVIEW-COMMISSION.md` | Complete review template with all AI-determinable fields filled; 9 batch groups defined; §5–§6 determination framework left blank for counsel | AI-generated field values are factual transcriptions, not legal conclusions; preliminary risk ratings carry no legal weight |
| 6 | Evidence Package | `research/mfd-12.3/legal/WS1-EVIDENCE-PACKAGE.md` | Nine per-source evidence sheets: license on record, current attribution, required attribution, gap analysis table | License URLs have NOT been visited or verified; attribution requirements quoted from license texts are reading aids, not authoritative interpretations |
| 7 | Remediation Requirements | `research/mfd-12.3/legal/WS1-REMEDIATION-REQUIREMENTS.md` | Sixteen candidate actions (R-01 through R-16) with priority, decision owner, dependencies, and engineering follow-up descriptions | Items are candidate actions, not recommendations; priorities reflect sequencing need, not legal severity |
| 8 | Scope and Limitations | `research/mfd-12.3/legal/WS1-SCOPE-AND-LIMITATIONS.md` | Defines what is in/out of scope, hard limits of AI-assisted review, known contradictions, and recommended reading order | Section 4 lists matters AI cannot determine; section 5 surfaces unresolved contradictions |

---

## MFD-12.2 Compliance Audit (Foundational)

These documents contain the original technical audit findings that motivated the legal review.

| # | Document | Path | Description | Caveats |
|---|----------|------|-------------|---------|
| 9 | Tanzil Compliance Audit | `research/mfd-12.2/compliance/WS1-TANZIL-COMPLIANCE-AUDIT.md` | Technical audit of all code paths serving Tanzil content; identifies 6 source records, 1 API route, 2 server modules, 1 client store, 118 editions, zero runtime enforcement of safe default | Finding 6 ("zero runtime enforcement") contradicts later inventory document; see R-03 and Scope §5 contradiction #1 |
| 10 | Legal Review Record Template | `research/mfd-12.2/compliance/WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md` | Original template structure for per-edition ReviewDecision records; includes batch review guidance and lifecycle definition | Superseded in structure by MFD-12.3 commission template but retained for reference |

---

## Referenced Repository Files (Not Attached — Available in Codebase)

These files are referenced throughout the commissioning materials but are not duplicated here. Counsel may request access to the repository or specific file extracts.

| # | File | Path | Relevance |
|---|------|------|-----------|
| 11 | Source Registry | `src/lib/quran/sources.ts` | Defines 13 source records with license, method, and attribution fields; primary factual source for content provenance |
| 12 | Translation Catalog | `src/lib/quran/translations.ts` | Lists 116 translation editions across 44 languages; no per-edition rights metadata |
| 13 | Audio Configuration | `src/lib/quran/audio.ts` | Defines 12 reciters, 6 bitrates, CDN URL construction; header comment acknowledges no explicit license |
| 14 | Proxy Route | `src/app/api/translations/[id]/route.ts` | Primary ingress point for Tanzil content; 66 lines; contains `isEditionGated()` call at line 36 |
| 15 | Translation Search | `src/lib/quran/translation-search.ts` | Server-side search module; fetches directly from Tanzil; holds parsed text in process memory |
| 16 | Tafsir Search | `src/lib/quran/tafsir-search.ts` | Thin wrapper over translation-search for ar.jalalayn and ar.muyassar |
| 17 | Translation Store | `src/lib/quran/translation-store.ts` | Client-side cache and React integration; trusts whatever proxy returns |
| 18 | AI Grounding Module | `src/lib/ai/grounding.ts` | References `tanzil-sahih` for AI citation generation; lines 155 and 305 |
| 19 | Data Provenance | `docs/DATA-PROVENANCE.md` | Documents proxy as "documented deviation"; contains assertions characterized as project statements, not legal conclusions |
| 20 | Rights Delivery Inventory | `research/mfd-12.2/rights/RIGHTS-DELIVERY-INVENTORY.md` | Documents rights-gate coverage at three call sites; contradicts audit finding 6 on enforcement |
| 21 | Bundled Edition Verification | `research/mfd-12.2/rights/BUNDLED-EDITION-VERIFICATION.md` | Confirms en.sahih and en.transliteration are bundled via quran-json, not fetched from Tanzil at runtime |
| 22 | Tanzil Rights Policy | `research/mfd-12.1/governance/WS-E-TANZIL-RIGHTS-POLICY.md` | Defines `linkOutOnly` safe default for `rights-unverified` sources; notes non-enforcement |

---

## External Resources (Not Attached — Require Counsel Access)

| # | Resource | URL | Notes |
|---|----------|-----|-------|
| 23 | Tanzil Terms of Use | https://tanzil.net/docs/terms | NOT archived; NOT reviewed by counsel; retrieval and archiving is R-01 |
| 24 | CC-BY-4.0 Legal Code | https://creativecommons.org/licenses/by/4.0/legalcode | Standard license; applicable to quran-json, mushaf metadata |
| 25 | Apache-2.0 License | https://www.apache.org/licenses/LICENSE-2.0 | Standard license; applicable to semantic embedding model |
| 26 | MIT License (QUL) | https://github.com/TarteelAI/quranic-universal-library/blob/main/LICENSE | Standard license; applicable to word data |
| 27 | quran-json Repository | https://github.com/risan/quran-json | Upstream package; CC-BY-4.0; aggregates Tanzil and QuranEnc content |
| 28 | QuranEnc Homepage | https://quranenc.com/en/home | No license URL recorded; independent terms unverified |
| 29 | Islamic Network CDN | https://cdn.islamic.network/quran/ | No explicit copyright license published |
| 30 | Islamic Network Homepage | https://islamic.network/ | States "free for open-source applications"; no copyright license |
| 31 | Xenova Model (HuggingFace) | https://huggingface.co/Xenova/all-MiniLM-L6-v2 | Apache-2.0; loaded client-side from jsdelivr CDN |

---

## Materials NOT Provided (Explicitly Out of Scope)

| # | Item | Reason for Exclusion |
|---|------|---------------------|
| 1 | Link-out-only tafsir records (`tafsir-ibn-kathir`, `tafsir-ma(arif)`) | No text delivered; licensing remains with linked publisher |
| 2 | Privacy/GDPR/user-data analysis | Not commissioned; semantic search documented as local-only |
| 3 | Third-party software licenses (Next.js, Transformers.js, etc.) | Ordinary OSS dependencies; not content-rights questions |
| 4 | Export feature analysis (PDF/EPUB) | No implemented export path described in inputs; counsel should confirm if question is live |
| 5 | Trademark/branding analysis | Not raised by any input document |
| 6 | Religious/scholarly correctness review | Separate scholarly review track; not a rights question |
| 7 | Analytics data (user counts, request volumes, geography) | Not available in repository; R-09 requests this from Product Owner |
| 8 | Business entity registration documents | R-09 requests this from Product Owner |

---

## Document Integrity Notes

- All MFD-12.3 and MFD-12.4 documents carry `proposedBy: ai-assisted` and `reviewStatus: pending-legal-review` metadata
- No production source code was modified in producing any of these documents
- License URLs in the evidence package have NOT been visited or verified against current publisher pages
- Preliminary risk ratings (🔴/🟡/🟢) are AI-generated pattern observations, not legal determinations
- Known contradictions between input documents are surfaced in WS1-SCOPE-AND-LIMITATIONS.md §5 and WS1-COUNSEL-BRIEFING.md §3

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Total documents provided** | 10 (4 MFD-12.4 + 4 MFD-12.3 + 2 MFD-12.2) |
| **Repository files referenced** | 12 (available in codebase, not attached) |
| **External resources listed** | 9 (require counsel access) |
| **Disclaimer** | This document was generated by AI assistance. It is a document inventory for human legal counsel, not legal advice. All determinations are reserved for qualified legal counsel. |