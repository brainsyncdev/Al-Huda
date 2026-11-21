# WS1: Scope and Limitations

**MFD-12.3 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** RESEARCH AND DOCUMENTATION ONLY — no production code modified

---

## 1. What This Package Is

A commissioning brief. It gathers the factual record an independent legal reviewer needs, fills every field of the existing review template that can be filled from repository evidence, and marks the remainder as requiring counsel. It is designed so a reviewer can begin work without asking engineering for further context.

It is not a legal opinion, not a compliance certification, and not an authorisation to change any code.

---

## 2. In Scope

### 2.1 Content Sources Covered

| # | Source | Delivery | Question Put to Counsel |
|---|--------|----------|------------------------|
| 1 | Tanzil.net translations (116 editions, 44 languages) | Server-side proxy + direct server fetch for search | Do Tanzil's terms permit proxying, caching, in-app display, and search indexing? |
| 2 | Tafsir al-Jalalayn (`ar.jalalayn`) | Same proxy | Same, plus public-domain/digital-edition interaction |
| 3 | Tafsir al-Muyassar (`ar.muyassar`) | Same proxy | Same, plus KSA government-publication framework |
| 4 | quran-json@3.1.2 (Arabic, English, transliteration, metadata) | Bundled npm package | Are CC-BY-4.0 attribution obligations met in this web-app medium? |
| 5 | QuranEnc (via quran-json) | Bundled within package | Does the upstream publisher retain independent terms? |
| 6 | Islamic Network CDN audio (12 reciters) | Client-side streaming | What legal basis permits streaming recordings with no published licence? |
| 7 | Xenova/all-MiniLM-L6-v2 embeddings | Vendored index + CDN model | Are the vectors Adapted Material under CC-BY-4.0? Which licence governs? |
| 8 | QUL word data (TarteelAI) | Vendored per-surah JSON | Is MIT notice delivery satisfied by a `/sources` page? |
| 9 | Tanzil mushaf metadata (`quran-data.xml`) | Build-time snapshot | Which CC-BY version does the unversioned header denote? |

### 2.2 Use Patterns Covered

Each is put to counsel as a distinct question rather than folded into "display":

- Server-side reproduction (24-hour Next.js data cache)
- Process-lifetime in-memory retention (search modules)
- Forwarded browser copy and browser HTTP caching
- In-app public display alongside Arabic text
- Parallel display of up to three additional editions
- Server-side full-text substring search and result excerpts
- AI grounding (prompt reproduction, potential output incorporation)
- Client-side audio streaming
- Build-time derivation (embeddings, word data, boundary tables)
- Vendored redistribution of build-time artifacts

### 2.3 Deliverables Produced

| File | Contents |
|------|----------|
| [WS1-LEGAL-REVIEW-COMMISSION.md](<research/mfd-12.3/legal/WS1-LEGAL-REVIEW-COMMISSION.md>) | Template with all AI-determinable fields filled; nine batch groups; determination framework left blank |
| [WS1-EVIDENCE-PACKAGE.md](<research/mfd-12.3/legal/WS1-EVIDENCE-PACKAGE.md>) | Nine per-source evidence sheets: licence on record, current attribution, required attribution, gap table |
| [WS1-REMEDIATION-REQUIREMENTS.md](<research/mfd-12.3/legal/WS1-REMEDIATION-REQUIREMENTS.md>) | Sixteen candidate actions (R-01…R-16) with decision owner, priority, dependencies |
| [WS1-SCOPE-AND-LIMITATIONS.md](<research/mfd-12.3/legal/WS1-SCOPE-AND-LIMITATIONS.md>) | This document |

---

## 3. Out of Scope

### 3.1 Explicitly Excluded From This Review

| Excluded | Reason |
|----------|--------|
| Link-out-only tafsirs (`tafsir-ibn-kathir`, `tafsir-ma(arif)`) | No text is delivered; licensing remains with the linked publisher. `tafsir-ma(arif)` is additionally marked `available: false`. Counsel may wish to confirm that outbound linking alone raises no question, but no evidence sheet was prepared. |
| Religious/scholarly correctness of any text | This is a rights review. Translation accuracy, tafsir authenticity, and Mushaf conformity are separate scholarly reviews (`pending-scholarly-review` in the editorial log). |
| Data integrity and checksum verification | Structural validation exists (`validate-quran-data.mjs`, sha256 manifests) and is reported as passing. Verifying those runs was not part of this task. |
| Trademark, branding, and app-name questions | Not raised by any input document. |
| Privacy, GDPR, and user-data handling | Semantic search is documented as local-only; no personal-data analysis was commissioned. |
| Third-party software licences beyond the named model | Transformers.js, Next.js, and the wider dependency tree are ordinary OSS dependencies, not content-rights questions. |
| The removed `src/services/quran-api.ts` path | Already rejected and removed per `DATA-PROVENANCE.md`; recorded here only so counsel knows it is not a live path. |
| Export features (PDF/EPUB) | The template asks for an export determination (§5.4) and the framework is preserved, but no input document describes an implemented export path. Counsel should confirm whether the question is live before answering it. |

### 3.2 Not Performed by This Workstream

- No source file was read for modification, and none was modified.
- No licence terms were fetched from the live web. Every licence statement in this package is transcribed from repository records, not verified against the publisher's current page.
- No code execution, test run, or build was performed.
- `rights-gate.ts`, `translation-search.ts`, `tafsir-search.ts`, `translation-store.ts`, `translations.ts`, `grounding.ts`, and the proxy route were **not** read directly. Statements about them are attributed to the audit and inventory, which is why R-03 commissions a reconciliation.

---

## 4. Limitations — What This AI-Assisted Review Cannot Determine

These are hard limits, not gaps that more effort would close.

### 4.1 Jurisdiction-Specific Doctrine

- **Fair use (US) / fair dealing (UK, Commonwealth)** — requires jurisdiction selection and factor-by-factor application to facts including commercial status, which is itself undetermined (R-09).
- **Sui generis database rights (EU/UK)** — whether Tanzil's translation corpus attracts database protection, and whether this app's extraction is substantial.
- **Text-and-data-mining exceptions** — several jurisdictions have TDM carve-outs with differing opt-out mechanics; applicability to embeddings and AI grounding is unanalysed.
- **Government-work doctrine** — KSA treatment of King Fahd Complex publications; whether any public-domain-equivalent rule applies.
- **Public-domain term calculation** — for 15th-century authors across jurisdictions, and whether digital encoding attracts a separate right.
- **Choice of law and forum** — Pakistan-based project (uncorroborated), global users, internationally hosted upstreams.

### 4.2 Rights-Holder and Performer Questions

- **Performer moral rights** — the 12 named reciters may hold rights independent of recording copyright; consent requirements cannot be assessed from repository records.
- **Translator moral rights** — attribution and integrity rights, and whether they are waivable in the relevant jurisdictions.
- **Chain-of-title verification** — whether Tanzil actually holds the rights it appears to licence for each edition, and whether quran-json held permission to repackage QuranEnc and Tanzil material under CC-BY-4.0. This requires contacting rights holders, not reading code.
- **Third-party claim exposure** — whether a translator or publisher could assert rights independently of Tanzil's terms.

### 4.3 Contract and Enforceability

- Whether Tanzil's terms form a binding contract, a unilateral licence, or non-binding guidance — and whether browsewrap-style assent is effective here.
- Revocability, and the legal status of content already cached when permission changes.
- Whether a CDN operator's "free for open-source applications" statement can convey rights the operator may not hold.
- Effect of any terms change on prior use.

### 4.4 Facts Requiring Business Input

Cannot be determined from the repository at all:

- Operating legal entity and its registration
- Pricing and revenue model
- Actual user counts, request volumes, geographic distribution
- Whether any permission correspondence already exists
- Enforcement history and industry licensing practice

### 4.5 Technical Facts Not Independently Verified

This package transcribes rather than verifies. Specifically:

- **The gating discrepancy (R-03).** The audit says zero enforcement exists; the inventory says gates are present at three call sites. Both are cited; neither is adjudicated. Counsel must not treat either as settled.
- **Licence currency.** Every URL is unvisited. Tanzil's terms may have changed since the records were written.
- **The `method: "package"` correction.** The audit calls the designation on `tanzil-sahih`/`tanzil-translit` misleading; the later verification document confirms it as accurate after a Phase 0 correction. This package follows the later document and flags the sequence so counsel can see the record evolved.
- **Scale figures.** Edition counts (116 translations, 44 languages, 12 reciters, 6,236 ayat, 77,429 words) come from the input documents and source constants, not from independent counting.

### 4.6 Structural Limits of AI Assistance

- No professional legal judgement was exercised. Preliminary risk labels in the commission document are pattern observations offered for counsel's consideration and carry no legal weight.
- No source is declared compliant or non-compliant anywhere in this package.
- Where a licence's requirements are quoted (CC-BY-4.0 §3(a)(1), Apache-2.0 §4, MIT notice clause), the quotation is a reading aid. Counsel must verify against the authoritative licence text.
- Absence of a noted gap is not evidence that no gap exists. This review found what the input documents surfaced.

---

## 5. Known Contradictions in the Input Record

Surfaced rather than resolved, so counsel is not misled by a false consensus:

| # | Contradiction | Documents | Handling |
|---|--------------|-----------|----------|
| 1 | Rights-gate enforcement: absent vs present | Audit §5.2/finding 6 vs Inventory §1.1–1.3 | Both cited; R-03 commissions reconciliation |
| 2 | `method: "package"` on two editions: misleading vs corrected | Audit §2.5 vs Verification §"Source catalog confirmation" and current `sources.ts` | Later document followed; sequence flagged |
| 3 | "It is not redistribution" asserted while rights unresolved | `DATA-PROVENANCE.md` line 88 vs same document's clearance disclaimer | Treated as project assertion, not premise; R-16 |
| 4 | Embeddings "derived data under the same terms" conflating Apache-2.0 and CC-BY-4.0 | `sources.ts` `semantic-embeddings` | Flagged as a question, not accepted; R-08 |
| 5 | Unversioned `cc-by` declaration paired with a non-CC licence URL | `sources.ts` `tanzil-mushaf-metadata` | Flagged; R-14 |
| 6 | Translation count varies (100+, 116, ~114 in batch B1) | Audit, `sources.ts`, template batch table | Reported as stated per source; exact count not independently established |

---

## 6. How Counsel Should Use This Package

1. Read [WS1-SCOPE-AND-LIMITATIONS.md](<research/mfd-12.3/legal/WS1-SCOPE-AND-LIMITATIONS.md>) §4–5 first, to see what is not established.
2. Read [WS1-EVIDENCE-PACKAGE.md](<research/mfd-12.3/legal/WS1-EVIDENCE-PACKAGE.md>) for the per-source factual record.
3. Resolve R-01 (archive terms) and request R-09 facts from the product owner — most other items depend on these.
4. Issue an R-03 interim posture so the project is not running on an unexamined default during the review.
5. Complete §3 and §5 of [WS1-LEGAL-REVIEW-COMMISSION.md](<research/mfd-12.3/legal/WS1-LEGAL-REVIEW-COMMISSION.md>) per batch, carving out editions per R-10 where the analysis diverges.
6. Work through [WS1-REMEDIATION-REQUIREMENTS.md](<research/mfd-12.3/legal/WS1-REMEDIATION-REQUIREMENTS.md>), recommending, modifying, or rejecting each candidate action.
7. Sign §7 and set effective/review dates in §6.2.

Completed records go to `research/mfd-12.3/legal/reviews/` as `TANZIL-RIGHTS-2026-NNN-{edition-slug}.md`, per the governance integration in the commission document.

---

## 7. Assurance Statement

This package makes no compliance determination. Every source discussed remains **unreviewed** in the legal sense, including those with well-known open licences — an identified licence is not a confirmed permission for a specific use. The project's own `DATA-PROVENANCE.md` states the position plainly: nothing in the repository establishes clearance, and a clean licence-validation run checks field completeness only. This package does not change that position; it makes the review possible.

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Working directory** | `C:\Users\Dawood\dyad-apps\Quran Al Huda` |
| **Source files modified** | None |
| **Disclaimer** | AI-assisted commissioning document. Not legal advice. All determinations reserved for qualified legal counsel. |
