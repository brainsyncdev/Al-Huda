# WS1: Remediation Requirements — Actions Requiring Legal Counsel Determination

**MFD-12.3 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** RESEARCH AND DOCUMENTATION ONLY — no production code modified

---

## Purpose and Reading Instructions

This document lists candidate remediation actions for counsel to evaluate, prioritise, and either recommend, modify, or reject. Each item states the observed fact, the question counsel must answer, and the engineering work that would follow **only if counsel recommends it**.

Nothing here is a recommendation from this review. Items are phrased as "candidate action" precisely because the underlying legal question is unresolved. No source file has been modified in producing this package, and none should be modified on the basis of this document alone.

Every item carries an owner split:
- **Counsel decision** — the legal determination only counsel can make.
- **Engineering follow-up** — the implementation that becomes possible once the decision exists (out of scope for MFD-12.3 WS1).

---

## Priority Key

| Priority | Meaning |
|----------|---------|
| P0 | Blocks any release posture claim; counsel input needed before further engineering direction |
| P1 | Needed for a complete rights determination; can proceed in parallel with P0 |
| P2 | Hygiene and durability improvements; low legal ambiguity |

Priorities express **sequencing need**, not legal severity. They are AI-assigned scheduling hints, not risk ratings.

---

## R-01 — Archive Tanzil Terms of Use (P0)

**Observed fact:** `sources.ts` records `licenseUrl: "https://tanzil.net/docs/terms"` for five Tanzil-related records. No dated copy of those terms exists anywhere in the repository. The audit (§4.3) confirms the URL has never been reviewed by counsel.

**Counsel decision required:** Retrieve the current terms, record the retrieval date, and determine whether the text constitutes an offer capable of acceptance, a unilateral licence, or merely informational guidance.

**Candidate action:** Capture a dated, verbatim archive of the terms page (and any linked sub-pages counsel considers operative) into the evidence directory.

**Engineering follow-up if recommended:** Add an archived-copy artifact under `research/mfd-12.3/legal/evidence/` with retrieval timestamp and URL; reference it from each affected `SourceRecord.notes`. No runtime change.

**Why P0:** Every downstream Tanzil determination depends on knowing what the terms actually say. Without an archive, a later terms change silently invalidates the record.

---

## R-02 — Determine Whether Server-Side Proxying Is Permitted (P0)

**Observed fact:** `/api/translations/[id]` fetches full edition text from `https://tanzil.net/trans/{id}`, caches it for 24 hours server-side (`revalidate: 86400`), and returns it to the browser with `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`. A second path, `translation-search.ts`, fetches the same upstream directly and holds parsed text in process memory for the server lifetime. `tafsir-search.ts` inherits that behaviour for `ar.jalalayn` and `ar.muyassar`.

`DATA-PROVENANCE.md` characterises this arrangement as "not redistribution" because files are not bundled. That characterisation is a project assertion, not a legal conclusion, and counsel should treat it as an open question rather than a premise.

**Counsel decision required:** Does fetching, caching, and forwarding full text on a user's behalf fall within the permission granted by Tanzil's terms? Answer separately for (a) transient server cache, (b) process-lifetime in-memory retention, (c) forwarded browser copy.

**Candidate actions counsel may choose among:**
1. Confirm proxying is permitted → record the determination and the conditions attached.
2. Determine proxying is not permitted → direct link-out-only for affected editions.
3. Determine the terms are silent → advise whether to seek written permission from Tanzil, or to adopt link-out pending an answer.
4. Determine excerpt-limited display is the defensible middle position → specify a maximum excerpt length in characters.

**Engineering follow-up if recommended:** Enforce the chosen constraint at all four layers identified in the audit — proxy route, both server search modules, client store, and consuming UI components. The inventory confirms `isEditionGated()` already exists at the proxy route and translation-search entry points, so a gate mechanism is present; what is absent is a counsel-supplied set of determinations to populate it.

**Why P0:** This is the single question that governs 118 editions and the app's headline translation feature.

---

## R-03 — Resolve the Spec–Reality Gap Interim Posture (P0)

**Observed fact:** Two input documents describe the gating state differently, and the discrepancy is material to counsel's brief:

| Document | Claim |
|----------|-------|
| WS1-TANZIL-COMPLIANCE-AUDIT.md §5.2, finding 6 | "Zero runtime enforcement of the `linkOutOnly` safe default exists anywhere in the codebase" |
| RIGHTS-DELIVERY-INVENTORY.md §1.1–1.3 | Rights-gate coverage **YES** — `isEditionGated(id)` checked at proxy line 36, translation-search line 39, `filterGatedEditions()` at tafsir-search line 44 |

The most consistent reading is that the gate *mechanism* was added between the two documents, while the *determination set* it consults remains empty — so the mechanism exists but gates nothing. This package does not assert which reading is correct; verifying it requires reading `rights-gate.ts` and its callers, which is engineering work outside this commissioning task.

**Counsel decision required:** What interim posture should apply while the review is in progress — continue current delivery, restrict to link-out, or restrict to excerpts?

**Candidate action:** Counsel issues an interim directive independent of the final determination, so the project is not operating on an unexamined default during the review period.

**Engineering follow-up if recommended:** First reconcile the two documents against actual code, then populate the gate's determination set per the interim directive.

**Why P0:** Counsel cannot assess exposure without an accurate statement of what is currently enforced. This reconciliation should be commissioned explicitly rather than assumed.

---

## R-04 — Obtain a Separate AI Grounding Determination (P0)

**Observed fact:** `src/lib/ai/grounding.ts` references `tanzil-sahih` for AI citation generation (audit §3.3, lines 155 and 305). The audit notes the module does not fetch text directly but assumes the edition is available for display. Separately, the semantic-embeddings index is derived from quran-json's English translation.

**Counsel decision required:** Three distinct questions, which should not be collapsed:
1. Does reproducing licensed text inside a model prompt exceed the display permission?
2. Does potential incorporation of that text into generated output constitute adaptation or derivative creation?
3. For CC-BY-4.0 bundled content specifically, does AI grounding require any additional notice beyond standard attribution?

**Candidate action:** Counsel completes §5.3 of the commission template per batch, treating AI grounding as a use distinct from display.

**Engineering follow-up if recommended:** Populate `displayConstraints.aiGroundingAllowed` per edition and enforce it in the grounding module's edition selection. Note that `tanzil-sahih` is bundled (batch B2), so the AI-grounding question for the currently referenced edition is a CC-BY-4.0 question, not a Tanzil-terms question — counsel should confirm this scoping before analysis.

**Why P0:** AI grounding is a live code path with no rights analysis attached, and it is the use least likely to be contemplated by terms drafted before widespread LLM deployment.

---

## R-05 — Establish a Legal Basis for Audio Streaming (P0)

**Observed fact:** `audio.ts` constructs `https://cdn.islamic.network/quran/audio/{bitrate}/{reciterId}/{global}.mp3` for 12 named reciters across 6 bitrates. The module's own header comment states the CDN "describes itself as free for open-source applications but publishes no explicit copyright licence for the recordings." `sources.ts` records the same absence. `DATA-PROVENANCE.md` marks audio PARTIAL and records shipping the player as a deviation from the PRD's defer-audio default. The inventory confirms **no rights-gate coverage** for audio URLs.

**Counsel decision required:**
1. Does a CDN operator's general "free for open-source" statement grant any rights in the underlying recordings, given the operator may not hold them?
2. What rights do the 12 named performers hold independently of recording copyright, and does streaming implicate them?
3. Does everyayah.com — the stated origin of the recording set — impose terms that reach downstream CDN consumers?
4. Is the app's commercial status (undetermined, see R-09) material to any "open-source applications" condition?

**Candidate actions counsel may choose among:**
1. Seek written permission from the CDN operator and, where counsel advises, from rights holders or their representatives.
2. Determine streaming is defensible on the current record → document the reasoning and any conditions.
3. Direct replacement with a recording set whose terms expressly permit this use.
4. Direct that audio remain disabled until a basis is established.

**Engineering follow-up if recommended:** Extend rights-gating to the audio URL generator (currently ungated), or swap the reciter catalog, or gate the `showAudio` preference behind a clearance flag — depending on which option counsel selects.

**Why P0:** This is the only source with **no published licence at all**, and the only rights-sensitive path with no gate mechanism whatsoever.

---

## R-06 — Verify QuranEnc's Independent Terms (P1)

**Observed fact:** `sources.ts` records `quranenc` with license "As stated by source publisher; distributed via quran-json under CC-BY-4.0 metadata" and **no `licenseUrl`**. The Arabic Uthmani text and chapter metadata — the app's most-displayed content — flow through this record.

**Counsel decision required:** Does quran-json's CC-BY-4.0 package licence validly convey rights in the QuranEnc-sourced Arabic text and metadata, or does QuranEnc retain terms that must be satisfied independently? A downstream packager cannot licence what it did not have permission to licence.

**Candidate action:** Counsel examines quranenc.com's stated terms and quran-json's own upstream attribution, then determines whether the chain is sound.

**Engineering follow-up if recommended:** Populate `licenseUrl` on the `quranenc` record with the verified terms location; adjust `ARABIC_CREDIT` wording if counsel specifies a required format.

---

## R-07 — Confirm CC-BY-4.0 Attribution Sufficiency (P1)

**Observed fact:** Current attribution comprises `PACKAGE_CREDIT` ("Content package: quran-json v3.1.2 (CC-BY-4.0)"), `ARABIC_CREDIT`, a full `/sources` record with licence URL and homepage, and per-verse-card attribution described in `DATA-PROVENANCE.md`.

**Counsel decision required:** Does this satisfy CC-BY-4.0 §3(a)(1) in the specific context of a web application — particularly (a) whether a hyperlink to the licence deed suffices versus reproducing licence text, (b) whether attribution placement on a separate `/sources` page is "reasonable to the medium" for content displayed on the reader page, and (c) whether the upstream contributors (Tanzil, QuranEnc, Saheeh International) require naming beyond the package-level credit.

**Candidate action:** Counsel confirms sufficiency or specifies exact required wording and placement.

**Engineering follow-up if recommended:** Adjust credit constants and/or add an inline attribution affordance adjacent to displayed text. This is the lowest-cost remediation in the package if counsel finds a gap.

---

## R-08 — Determine Derived-Data Status of Embeddings (P1)

**Observed fact:** `semantic-embeddings` records license "Apache-2.0 (model); embedding index is derived data under the same terms." The index is 6,236 × 384 float16 vectors generated by `scripts/generate-embeddings.mjs` from quran-json's English translation. The model is Apache-2.0; the *source text* is CC-BY-4.0. The record's phrase "under the same terms" conflates two different licences.

**Counsel decision required:**
1. Do numerical vector representations of licensed text constitute "Adapted Material" under CC-BY-4.0, or fall outside copyright as non-expressive data?
2. Which licence governs the combined artifact — the model's Apache-2.0, the source text's CC-BY-4.0, or both in their respective scopes?
3. If the index is Adapted Material, what attribution and modification-indication obligations attach?

**Candidate action:** Counsel determines the status and specifies the correct licence expression for the record.

**Engineering follow-up if recommended:** Correct the `license` string to distinguish model licence from index licence; add whatever notice counsel requires. Note the model itself is fetched from jsdelivr at runtime rather than vendored, which counsel should factor into any redistribution analysis.

---

## R-09 — Document Commercial Context and Operating Entity (P1)

**Observed fact:** The commission template §2.3 fields — pricing model, revenue model, operating legal entity, jurisdiction of operation — are all unfilled. No input document supplies them. The audit's quick-reference question 8 refers to a "Pakistan-based project" but this is not corroborated by any corporate or registration record in the inputs.

**Counsel decision required:** These are facts counsel needs *from the product owner*, not determinations counsel makes. Counsel should specify which facts are material to the analysis so the owner knows what to supply.

**Candidate action:** Product owner completes §2.3; counsel confirms whether the stated jurisdiction is the operative one given globally distributed users and internationally hosted upstreams.

**Engineering follow-up:** None. This is a business-information gap, not a code gap.

**Note:** Several other determinations (R-02 commercial-use limb, R-05 "open-source applications" condition) cannot be completed until this item is resolved. It is a dependency, not merely a parallel task.

---

## R-10 — Assess Per-Edition Rights Variation Within Batch B1 (P1)

**Observed fact:** The template's batch guidance groups ~114 translations under a single "Tanzil Terms of Use" heading, while warning that batch review is permissible only where the analysis is genuinely identical. `translations.ts` carries no per-edition rights metadata (audit finding 5, E5). Different editions have different translators, publishers, and jurisdictions of origin.

**Counsel decision required:** Is uniform treatment defensible, or must specific editions be carved out for individual review? Counsel should identify which distinguishing factors trigger carve-out — living translator, identifiable commercial publisher, known restrictive jurisdiction.

**Candidate action:** Counsel either approves the batch or returns a carve-out list.

**Engineering follow-up if recommended:** Add per-edition rights fields to the translation catalog for carved-out editions; the gate mechanism can then act on them individually.

**Special attention within B1:** `ur.jalandhry` is the app's **default** translation (`TRANSLATION_CREDIT`, `DATA-PROVENANCE.md`). Whatever the batch outcome, the default edition warrants individual confirmation because it is displayed to every user who has not changed settings.

---

## R-11 — Assess al-Muyassar Government-Publication Status (P1)

**Observed fact:** `tafsir-muyassar` attributes authorship to the King Fahd Complex for the Printing of the Holy Quran. The record applies Tanzil's terms without reference to any KSA government-publication framework.

**Counsel decision required:** Do Saudi government-publication rules apply to this work, and do they interact with — permit, restrict, or supersede — Tanzil's stated terms? Two rights layers may be operative simultaneously.

**Candidate action:** Counsel determines the applicable framework for batch B5 separately from B1.

**Engineering follow-up if recommended:** Update the `tafsir-muyassar` licence field and viewer attribution to reflect the verified framework.

---

## R-12 — Assess al-Jalalayn Public-Domain Interaction (P1)

**Observed fact:** `tafsir-jalalayn` attributes the work to al-Mahalli and al-Suyuti, 15th century CE. The underlying authored text is long out of any copyright term. The record nonetheless applies Tanzil's terms to the digital edition.

**Counsel decision required:** Does Tanzil hold any protectable right in its digital encoding, transcription, or markup of a public-domain work, and does that right reach this app's use? A separate question from whether the underlying text is free.

**Candidate action:** Counsel determines whether B4 can be cleared on public-domain grounds, on digital-edition grounds, or requires permission.

**Engineering follow-up if recommended:** Record the determination; potentially clear B4 ahead of B1 if the analysis diverges.

---

## R-13 — Confirm MIT and Apache-2.0 Notice Delivery for a Web App (P2)

**Observed fact:** `qul-word-data` (MIT) is vendored as 114 per-surah JSON files with a sha256 manifest. `semantic-embeddings` model is Apache-2.0. Both carry licence URLs on `/sources`; neither has a bundled NOTICE or LICENSE artifact in the served application.

**Counsel decision required:** MIT requires the notice in "all copies or substantial portions"; Apache-2.0 §4 requires a NOTICE file where one exists upstream. Does a `/sources` page satisfy these for a web application whose artifacts are served rather than distributed as a package? Does the vendored word-data JSON count as a "copy" carrying the obligation?

**Candidate action:** Counsel confirms sufficiency or directs bundling of licence/notice artifacts.

**Engineering follow-up if recommended:** Emit a `public/licenses/` directory at build time containing the relevant texts, linked from `/sources`. Low-cost, mechanically verifiable.

---

## R-14 — Correct Mushaf Metadata Licence URL (P2)

**Observed fact:** `tanzil-mushaf-metadata` declares license `CC-BY (declared in the source file header: license="cc-by")` but sets `licenseUrl: "https://tanzil.net/docs/terms"` — pointing at Tanzil's general terms rather than a Creative Commons deed. The XML header says `cc-by` without a version number.

**Counsel decision required:** Which CC-BY version does the header declaration denote, and what is the correct canonical licence URL? An unversioned "cc-by" is ambiguous between 1.0 through 4.0, which differ in attribution mechanics.

**Candidate action:** Counsel identifies the intended version (or advises seeking clarification from Tanzil) and specifies the URL.

**Engineering follow-up if recommended:** Update `licenseUrl` and the `license` string to name the version explicitly.

---

## R-15 — Establish Terms-Change Monitoring (P2)

**Observed fact:** No input document records how often Tanzil's terms change, whether notice is given, or what happens to cached content if permission is withdrawn. The audit lists term stability and revocability as unknowns (§4.3, and template §4.2).

**Counsel decision required:** What monitoring cadence and re-review triggers are appropriate? What is the required response window if terms change adversely or permission is revoked — particularly for content already in the 24-hour server cache and in users' browser caches?

**Candidate action:** Counsel specifies a review cycle (the template suggests annual) and a revocation-response procedure.

**Engineering follow-up if recommended:** Periodic re-fetch and diff of the archived terms; cache-invalidation procedure documented for the revocation case.

---

## R-16 — Reconcile Provenance Assertions With Determinations (P2)

**Observed fact:** `DATA-PROVENANCE.md` contains assertions that read as legal conclusions but are project statements: "It is not redistribution" (line 88), and the tafsir records' "not redistributed by this app" phrasing in `sources.ts`. The same document is commendably explicit that nothing establishes clearance, and that a clean `validate:licenses` run is a field-completeness check only.

**Counsel decision required:** Should these assertions be reworded to avoid implying a legal conclusion the project has not reached? Counsel's determination may confirm or contradict them; either way the wording should follow the determination rather than precede it.

**Candidate action:** Counsel flags language that overstates the project's position.

**Engineering follow-up if recommended:** Reword the affected passages and source-record notes to describe mechanism factually and reserve the legal characterisation for the review record.

---

## Dependency Graph

```
R-09 (commercial context / entity / jurisdiction)
  ├──> R-02 (proxy permission — commercial-use limb)
  └──> R-05 (audio — "open-source applications" condition)

R-01 (archive Tanzil terms)
  ├──> R-02 (proxy permission)
  ├──> R-10 (B1 batch validity)
  ├──> R-11 (B5 al-Muyassar)
  ├──> R-12 (B4 al-Jalalayn)
  └──> R-14 (metadata licence version)

R-03 (interim posture + gate-state reconciliation)
  └──> independent; should not wait on R-01/R-02

R-04 (AI grounding)
  ├──> depends on R-02 for proxied editions
  └──> depends on R-07/R-08 for bundled en.sahih (the edition actually referenced)

R-06, R-07, R-08, R-13 — independent of Tanzil chain
R-15, R-16 — follow final determinations
```

---

## Summary Table

| ID | Action | Priority | Decision Owner | Blocked By |
|----|--------|----------|----------------|------------|
| R-01 | Archive Tanzil Terms of Use | P0 | Counsel | — |
| R-02 | Determine proxy permission | P0 | Counsel | R-01, R-09 |
| R-03 | Interim posture + reconcile gate state | P0 | Counsel + Engineering | — |
| R-04 | AI grounding determination | P0 | Counsel | R-02, R-07 |
| R-05 | Audio legal basis | P0 | Counsel | R-09 |
| R-06 | QuranEnc independent terms | P1 | Counsel | — |
| R-07 | CC-BY-4.0 attribution sufficiency | P1 | Counsel | — |
| R-08 | Embeddings derived-data status | P1 | Counsel | — |
| R-09 | Commercial context / entity / jurisdiction | P1 | Product Owner | — |
| R-10 | B1 per-edition variation | P1 | Counsel | R-01 |
| R-11 | al-Muyassar KSA status | P1 | Counsel | R-01 |
| R-12 | al-Jalalayn public-domain interaction | P1 | Counsel | R-01 |
| R-13 | MIT / Apache-2.0 notice delivery | P2 | Counsel | — |
| R-14 | Metadata licence URL and version | P2 | Counsel | R-01 |
| R-15 | Terms-change monitoring | P2 | Counsel | Final determinations |
| R-16 | Reconcile provenance wording | P2 | Counsel | Final determinations |

---

## What This Document Does Not Do

- It does not recommend any specific legal position.
- It does not authorise any code change. Every "engineering follow-up" is conditional on a counsel determination that does not yet exist.
- It does not rank sources by compliance. Priority reflects sequencing need only.
- It does not resolve the audit/inventory gating discrepancy (R-03); it commissions that reconciliation.

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Input documents** | WS1-TANZIL-COMPLIANCE-AUDIT.md, RIGHTS-DELIVERY-INVENTORY.md, BUNDLED-EDITION-VERIFICATION.md, sources.ts, audio.ts, DATA-PROVENANCE.md, WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md |
| **Disclaimer** | AI-assisted commissioning document. Not legal advice. All determinations reserved for qualified legal counsel. |
