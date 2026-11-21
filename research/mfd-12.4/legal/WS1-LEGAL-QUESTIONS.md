# Structured Legal Questions for Counsel

**MFD-12.4 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** COMMISSIONING DOCUMENT — Not legal advice; not a compliance determination

---

## Purpose

This document organizes specific legal questions by content source, with cross-references to the Evidence Package sections where factual context is documented. Each question is framed for counsel's independent determination. AI-assisted observations are noted where relevant but carry no legal weight.

---

## Source 1: Tanzil Translations (Proxy) — Batch B1 (~114 editions)

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 1  
**Remediation References:** R-01, R-02, R-03, R-10

### License and Terms

| # | Question | Evidence Context |
|---|----------|------------------|
| 1.1 | What are the current operative terms at https://tanzil.net/docs/terms? Do they constitute an offer capable of acceptance, a unilateral license, or informational guidance? | Evidence §License on Record: "attribution + no modification" is an unverified summary; full text not archived |
| 1.2 | Does Tanzil's ToU permit server-side caching of full translation text (24-hour Next.js data cache)? | Evidence §Gap: "Proxy redistribution unaddressed" 🔴 HIGH |
| 1.3 | Does Tanzil's ToU permit process-lifetime in-memory retention of parsed text in server search modules? | Remediation R-02: distinguishes transient cache, process memory, and forwarded copy |
| 1.4 | Does Tanzil's ToU permit forwarding full text to end-user browsers with public Cache-Control headers? | Evidence §Delivery: `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` |
| 1.5 | Does in-app display of full translation text alongside Arabic Quran text constitute "public display" under Tanzil's ToU? | Evidence §Gap: "Proxy redistribution unaddressed" 🔴 HIGH |
| 1.6 | Does server-side full-text substring search and indexing exceed permitted use under Tanzil's ToU? | Evidence §Gap: "Search indexing not addressed" 🟡 MEDIUM |
| 1.7 | Does Tanzil's ToU distinguish commercial vs. non-commercial use? If so, how does the app's status affect permission? | Evidence §Gap: "Commercial use status unknown" 🟡 MEDIUM; blocked by R-09 |

### Attribution

| # | Question | Evidence Context |
|---|----------|------------------|
| 1.8 | What specific attribution format does Tanzil's ToU require? | Evidence §Attribution Required: Unknown; current display shows translator name per edition + aggregate credit on /sources |
| 1.9 | Is per-edition attribution required, or is aggregate attribution ("116 translations via Tanzil.net") sufficient? | Evidence §Current Attribution: Individual translator names shown in reader UI |
| 1.10 | Must the license text be reproduced, or is a hyperlink to https://tanzil.net/docs/terms sufficient? | Evidence §Gap: License text not archived 🔴 HIGH |

### Batch Validity and Carve-Outs

| # | Question | Evidence Context |
|---|----------|------------------|
| 1.11 | Is uniform batch treatment of ~114 translations defensible, or must specific editions be carved out for individual review? | Remediation R-10: different translators, publishers, jurisdictions may trigger carve-out |
| 1.12 | Which distinguishing factors trigger individual review — living translator, identifiable commercial publisher, known restrictive jurisdiction? | Remediation R-10 |
| 1.13 | Does `ur.jalandhry` (the app's default translation) warrant individual confirmation regardless of batch outcome? | Remediation R-10: displayed to every user who has not changed settings |

### Third-Party and Chain-of-Title

| # | Question | Evidence Context |
|---|----------|------------------|
| 1.14 | Could individual translators or publishers assert rights independently of Tanzil's stated terms? | Evidence §Gap: "Per-edition rights variation ignored" 🟡 MEDIUM |
| 1.15 | Does Tanzil actually hold the rights it appears to license for each edition in batch B1? | Scope §4.2: chain-of-title verification requires contacting rights holders |

---

## Source 2: Tafsir al-Jalalayn (Proxy) — Batch B4

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 2  
**Remediation Reference:** R-12

| # | Question | Evidence Context |
|---|----------|------------------|
| 2.1 | All questions from Source 1 apply identically (same proxy mechanism, same Tanzil ToU) | Evidence: "Same gaps as Tanzil translations" 🔴 HIGH |
| 2.2 | Does the 15th-century authorship of al-Jalalayn affect the applicable rights framework? Is the underlying text public domain in relevant jurisdictions? | Evidence §Attribution Required: "Classical text may be PD, but digital edition rights are separate" |
| 2.3 | Does Tanzil claim protectable rights in its digital encoding, transcription, or markup of this public-domain work? | Remediation R-12: separate question from whether underlying text is free |
| 2.4 | Can batch B4 be cleared on public-domain grounds, on digital-edition grounds, or does it require permission? | Remediation R-12 |

---

## Source 3: Tafsir al-Muyassar (Proxy) — Batch B5

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 3  
**Remediation Reference:** R-11

| # | Question | Evidence Context |
|---|----------|------------------|
| 3.1 | All questions from Source 1 apply identically (same proxy mechanism, same Tanzil ToU) | Evidence: "Same gaps as Tanzil translations" 🔴 HIGH |
| 3.2 | Do Saudi government-publication rules apply to this work (King Fahd Complex for the Printing of the Holy Quran)? | Evidence §Attribution Required: "KSA government publications may have specific terms" |
| 3.3 | Do KSA government-publication rules interact with — permit, restrict, or supersede — Tanzil's stated terms? | Evidence §Gap: "Dual-rights chain unclear" 🟡 MEDIUM |
| 3.4 | Should batch B5 be evaluated under a different framework than batch B1? | Remediation R-11 |

---

## Source 4: quran-json (Bundled) — Batches B2, B3

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 4  
**Remediation Reference:** R-07

| # | Question | Evidence Context |
|---|----------|------------------|
| 4.1 | Does the current attribution satisfy CC-BY-4.0 §3(a)(1)(A) in a web application context? Specifically: (a) is a hyperlink to the license deed sufficient vs. reproducing license text? (b) is attribution on a separate `/sources` page "reasonable to the medium" for content displayed on the reader page? (c) do upstream contributors (Tanzil, QuranEnc, Saheeh International) require naming beyond the package-level credit? | Evidence §Attribution Required: 6 of 7 CC-BY requirements appear met; item 7 flagged |
| 4.2 | Does quran-json's CC-BY-4.0 license validly cover the Tanzil and QuranEnc content aggregated within it? | Evidence §Gap: "Upstream source chain opacity" 🟡 MEDIUM |
| 4.3 | Does AI grounding of CC-BY-4.0 content (en.sahih translation) require additional notice beyond standard attribution? | Remediation R-04: the AI grounding module references `tanzil-sahih`, which is bundled |

---

## Source 5: QuranEnc (via quran-json)

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 5  
**Remediation Reference:** R-06

| # | Question | Evidence Context |
|---|----------|------------------|
| 5.1 | Does QuranEnc have independent licensing terms that must be satisfied separately from quran-json's CC-BY-4.0 packaging? | Evidence §License on Record: "As stated by source publisher; distributed via quran-json under CC-BY-4.0 metadata" — no direct license URL |
| 5.2 | Is the attribution "via quranenc.com" sufficient, or does QuranEnc require specific wording? | Evidence §Gap: "Attribution format unverified" 🟢 LOW |
| 5.3 | Can a downstream packager (quran-json) validly license content under CC-BY-4.0 if it did not have permission from the original publisher to do so? | Remediation R-06: "A downstream packager cannot licence what it did not have permission to licence" |

---

## Source 6: Islamic Network Audio CDN — Batch B6

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 7  
**Remediation Reference:** R-05

| # | Question | Evidence Context |
|---|----------|------------------|
| 6.1 | What legal basis permits streaming recordings from a CDN that publishes NO explicit copyright license? | Evidence §Gap: "NO EXPLICIT LICENSE EXISTS" 🔴 HIGH |
| 6.2 | Does a CDN operator's general "free for open-source applications" statement grant any rights in the underlying recordings, given the operator may not hold those rights? | Remediation R-05 |
| 6.3 | Do the 12 named reciters retain performer moral rights or performance rights independent of recording copyright? | Evidence §Gap: "Performer moral rights unaddressed" 🟡 MEDIUM |
| 6.4 | Does everyayah.com (the stated origin of recordings) impose terms that reach downstream CDN consumers? | Evidence §Gap: "everyayah.com provenance unverified" 🟡 MEDIUM |
| 6.5 | Is the app's commercial status material to any "open-source applications" condition? | Remediation R-05; blocked by R-09 |
| 6.6 | Does transient browser caching of streamed MP3 files constitute reproduction requiring permission? | Evidence §Gap: "Browser caching = reproduction?" 🟢 LOW |

---

## Source 7: Semantic Embeddings (Derived Data) — Batch B7

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 8  
**Remediation Reference:** R-08

| # | Question | Evidence Context |
|---|----------|------------------|
| 7.1 | Do numerical vector representations of CC-BY-4.0 licensed text constitute "Adapted Material" under CC-BY-4.0 §1(a), or fall outside copyright as non-expressive data? | Evidence §Gap: "Derived-data status under CC-BY-4.0 unverified" 🟡 MEDIUM |
| 7.2 | Which license governs the combined artifact — the model's Apache-2.0, the source text's CC-BY-4.0, or both in their respective scopes? | Evidence §Gap: "Dual-license interaction unclear" 🟡 MEDIUM |
| 7.3 | If the embedding index is Adapted Material, what attribution and modification-indication obligations attach? | Remediation R-08 |
| 7.4 | Is the `/sources` page record sufficient to satisfy Apache-2.0 §4 NOTICE requirements, or must a NOTICE file be distributed with the application? | Evidence §Gap: "NOTICE file distribution" 🟢 LOW |

---

## Source 8: QUL Word Data (Vendored) — Batch B8

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 9  
**Remediation Reference:** R-13

| # | Question | Evidence Context |
|---|----------|------------------|
| 8.1 | Does the `/sources` page satisfy MIT's "included in all copies or substantial portions" requirement for a web application whose artifacts are served rather than distributed as a package? | Evidence §Attribution Required: flagged for counsel |
| 8.2 | Must the MIT license text be bundled in the distributed application artifacts (e.g., in a `public/licenses/` directory)? | Remediation R-13 |
| 8.3 | Does the vendored per-surah JSON count as a "copy" carrying the MIT notice obligation? | Remediation R-13 |

---

## Source 9: Tanzil Mushaf Metadata (Build-Time) — Batch B9

**Evidence Reference:** WS1-EVIDENCE-PACKAGE.md §Source 6  
**Remediation Reference:** R-14

| # | Question | Evidence Context |
|---|----------|------------------|
| 9.1 | Which CC-BY version does the unversioned `license="cc-by"` XML header declaration denote? | Evidence §Gap: "License URL points to Tanzil terms, not CC-BY deed" 🟢 LOW |
| 9.2 | What is the correct canonical license URL for the identified version? | Remediation R-14 |
| 9.3 | Is factual boundary data (juz/page/hizb divisions) copyrightable in relevant jurisdictions, or does CC-BY apply as a precautionary measure? | Evidence §Gap: "Structural data copyrightability uncertain" 🟢 LOW |

---

## Cross-Cutting Questions

### Jurisdiction and Choice of Law

| # | Question | Evidence Context |
|---|----------|------------------|
| X.1 | What jurisdiction governs this review? The project is described as Pakistan-based (uncorroborated), serves global users, and sources content from internationally hosted upstreams. | Scope §4.1; Remediation R-09 |
| X.2 | Does fair use (US) or fair dealing (UK/Commonwealth) apply to the proxying of 116 translations? What is the factor-by-factor analysis? | Scope §4.1 |
| X.3 | Does EU/UK sui generis database right apply to Tanzil's translation corpus? Is the app's extraction substantial? | Scope §4.1 |
| X.4 | Do text-and-data-mining exceptions in any applicable jurisdiction cover the embeddings and AI grounding use cases? | Scope §4.1 |

### Contract and Enforceability

| # | Question | Evidence Context |
|---|----------|------------------|
| X.5 | Is Tanzil's ToU a binding contract, a unilateral license, or non-binding guidance? Is browsewrap-style assent effective here? | Scope §4.3 |
| X.6 | Can Tanzil revoke permission retroactively? What is the legal status of content already in the 24-hour server cache and users' browser caches when permission changes? | Scope §4.3; Remediation R-15 |
| X.7 | What monitoring cadence and re-review triggers are appropriate for terms changes? | Remediation R-15 |

### AI Grounding (Cross-Source)

| # | Question | Evidence Context |
|---|----------|------------------|
| X.8 | Does reproducing licensed text inside a model prompt exceed display permission under any of the applicable licenses? | Remediation R-04 |
| X.9 | Does potential incorporation of licensed text into AI-generated output constitute adaptation or derivative creation? | Remediation R-04 |
| X.10 | For CC-BY-4.0 bundled content specifically (en.sahih), does AI grounding require any additional notice beyond standard attribution? | Remediation R-04 |

### Interim Posture

| # | Question | Evidence Context |
|---|----------|------------------|
| X.11 | What interim delivery posture should apply while the review is in progress — continue current delivery, restrict to link-out-only, or restrict to excerpts? | Remediation R-03 |
| X.12 | Should the interim directive differentiate between sources (e.g., maintain bundled content, restrict proxied content)? | Remediation R-03 |

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Input documents** | WS1-EVIDENCE-PACKAGE.md, WS1-REMEDIATION-REQUIREMENTS.md, WS1-SCOPE-AND-LIMITATIONS.md, WS1-LEGAL-REVIEW-COMMISSION.md |
| **Disclaimer** | This document was generated by AI assistance. It is a structured question list for human legal counsel, not legal advice. All determinations are reserved for qualified legal counsel. |