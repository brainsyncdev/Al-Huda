# Executive Briefing for Legal Counsel

**MFD-12.4 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** BRIEFING DOCUMENT — Not legal advice; not a compliance determination

---

## Purpose

This two-page executive briefing provides independent legal counsel with essential context about the Quran Al Huda application, its content delivery architecture, and the specific legal questions requiring determination. It summarizes findings from the AI-assisted preparatory audit (MFD-12.2/12.3) and identifies what requires legal judgment versus what has already been established factually.

---

## 1. What FAHM Is and How It Distributes Content

**FAHM (Quran Al Huda)** is a web-based Quran study application providing multi-language translations, tafsirs, audio recitation, semantic search, and AI-assisted study features. The application serves a global user base from a Pakistan-based development team.

### Content Distribution Architecture

The application uses **six distinct delivery mechanisms**, each with different legal implications:

| Mechanism | Technical Implementation | Legal Character |
|-----------|-------------------------|-----------------|
| **A: Tanzil Proxy** | Server-side Next.js API route fetches full text from `tanzil.net/trans/{id}`, caches 24h server-side, returns to browser with public CORS headers | Potential redistribution via proxy; primary risk area |
| **B: Bundled quran-json** | Read from `node_modules` at build/server time via `node:fs`; never fetched externally at runtime | Licensed redistribution under CC-BY-4.0 |
| **C: Audio Streaming** | Client-side `<audio>` element streams directly from `cdn.islamic.network`; no server proxy or app-level caching | Direct streaming; no published license exists |
| **D: Semantic Embeddings** | Precomputed vectors vendored at build time; derived from CC-BY-4.0 translation using Apache-2.0 model | Derived data status unclear |
| **E: QUL Word Data** | Vendored per-surah JSON generated at build time from MIT-licensed source | Licensed redistribution under MIT |
| **F: Mushaf Metadata** | Build-time snapshot compiled into bundle from CC-BY XML source | Licensed structural data |

### Scale

- **118 editions** accessible via Tanzil proxy (116 translations + 2 tafsirs)
- **44 languages** represented
- **12 reciters** available for audio streaming
- **2 bundled translation editions** (en.sahih, en.transliteration) via quran-json
- Commercial context, user counts, and geographic distribution are **undetermined** (R-09)

---

## 2. Five P0 Items Requiring Immediate Attention

These items block any release posture claim and require counsel input before further engineering direction:

### P0-1: Archive Tanzil Terms of Use (R-01)
No dated copy of Tanzil's Terms of Use exists in the repository. Every downstream determination depends on knowing what the terms actually say. Without an archive, a future terms change silently invalidates the entire record.

### P0-2: Determine Whether Server-Side Proxying Is Permitted (R-02)
The application fetches, caches (24h), and forwards full translation text on behalf of users. Project documentation characterizes this as "not redistribution," but this is a project assertion, not a legal conclusion. This single question governs 118 editions and the app's headline feature.

### P0-3: Resolve Spec–Reality Gap and Set Interim Posture (R-03)
Two preparatory documents describe the gating state differently: one says zero enforcement exists; the other says gates are present at three call sites. The most consistent reading is that the gate *mechanism* exists but the *determination set* it consults is empty — so it gates nothing. Counsel must issue an interim directive so the project does not operate on an unexamined default during review.

### P0-4: Obtain Separate AI Grounding Determination (R-04)
Translation text is used as grounding context for AI-generated responses. This involves reproduction in prompts and potential incorporation in outputs — a use unlikely to be contemplated by terms drafted before widespread LLM deployment. Three sub-questions must be answered separately: prompt reproduction, output incorporation, and CC-BY-4.0 notice obligations.

### P0-5: Establish Legal Basis for Audio Streaming (R-05)
Islamic Network CDN publishes **no explicit copyright license** for its recordings. The CDN describes itself as "free for open-source applications," but this statement may not convey rights the operator does not hold. Twelve named reciters may retain performer rights independent of recording copyright. This is the only source with no published license and the only rights-sensitive path with no gate mechanism.

---

## 3. Six Contradictions in Existing Documentation

These contradictions have been surfaced rather than resolved, so counsel is not misled by false consensus:

| # | Contradiction | Documents | Handling |
|---|--------------|-----------|----------|
| 1 | Rights-gate enforcement: absent vs. present | Audit §5.2/finding 6 vs. Inventory §1.1–1.3 | Both cited; R-03 commissions reconciliation against actual code |
| 2 | `method: "package"` on two editions: misleading vs. corrected | Audit §2.5 vs. Verification document | Later document followed; sequence flagged for transparency |
| 3 | "It is not redistribution" asserted while rights unresolved | DATA-PROVENANCE.md line 88 vs. same document's clearance disclaimer | Treated as project assertion, not premise; R-16 addresses rewording |
| 4 | Embeddings "derived data under the same terms" conflating Apache-2.0 and CC-BY-4.0 | sources.ts `semantic-embeddings` record | Flagged as question for counsel; R-08 |
| 5 | Unversioned `cc-by` declaration paired with non-CC license URL | sources.ts `tanzil-mushaf-metadata` | Flagged; R-14 asks counsel to identify correct version |
| 6 | Translation count varies (100+, 116, ~114 in batch B1) | Audit, sources.ts, template batch table | Reported as stated per source; exact count not independently verified |

---

## 4. Current Technical State

### Rights Gate Mechanism
- A function `isEditionGated(id)` exists at the proxy route (line 36) and search module entry points
- The gate mechanism is **present but inert**: it consults a determination set that contains zero entries
- All catalog-listed editions currently pass through ungated
- Engineering can populate the gate once counsel supplies determinations — no new mechanism needs to be built

### Bundled Editions Verified
- `en.sahih` and `en.transliteration` are confirmed as bundled via quran-json (CC-BY-4.0), NOT fetched from Tanzil at runtime
- These represent lower-risk alternatives for core English-language functionality
- The AI grounding module currently references `tanzil-sahih`, which is the bundled edition — so the immediate AI grounding question is a CC-BY-4.0 question, not a Tanzil-terms question

### Audio Path Ungated
- No rights-gate coverage exists for audio URLs
- Audio is off by default; user must enable in Settings and press play
- No recording files are redistributed by the app

---

## 5. What AI-Assisted Analysis Has Determined vs. What Requires Legal Judgment

### Established Factually (AI-Determined)

✅ Complete inventory of all content sources and delivery mechanisms  
✅ Per-source license identification (where published licenses exist)  
✅ Current attribution display documentation with screenshots/references  
✅ Gap analysis identifying missing or uncertain elements  
✅ Technical architecture mapping of all code paths serving content  
✅ Batch grouping for efficient review  
✅ Remediation candidate list with priority sequencing and dependencies  
✅ Preliminary risk observations (pattern-based, NOT legal determinations)  

### Reserved Exclusively for Counsel

❌ Whether Tanzil's Terms of Use permit proxying, caching, display, search, or AI grounding  
❌ Whether Islamic Network audio streaming has any legal basis  
❌ Whether semantic embeddings constitute Adapted Material under CC-BY-4.0  
❌ Whether current attribution satisfies license requirements in a web-app context  
❌ Fair use / fair dealing analysis for any jurisdiction  
❌ Database rights assessment (EU/UK sui generis)  
❌ Moral rights analysis for translators and performers  
❌ Contractual vs. unilateral license characterization  
❌ Choice of law and forum determination  
❌ Chain-of-title verification for Tanzil editions  
❌ Performer rights assessment for 12 named reciters  
❌ Commercial vs. non-commercial classification impact  
❌ Interim posture recommendation during review period  
❌ All compliance determinations and authorization decisions  

> ⚠️ **Critical Distinction:** AI-generated preliminary risk labels (🔴 HIGH, 🟡 MEDIUM, 🟢 LOW) in the commission documents are pattern observations offered for counsel's consideration. They carry **no legal weight** and must not be treated as determinations. No source is declared compliant or non-compliant anywhere in the preparatory materials.

---

## Recommended Reading Order

1. **This briefing** (WS1-COUNSEL-BRIEFING.md) — orientation and key issues
2. **Scope and Limitations** (WS1-SCOPE-AND-LIMITATIONS.md §4–5) — what is NOT established
3. **Evidence Package** (WS1-EVIDENCE-PACKAGE.md) — per-source factual record
4. **Remediation Requirements** (WS1-REMEDIATION-REQUIREMENTS.md) — candidate actions with priorities
5. **Commission Template** (WS1-LEGAL-REVIEW-COMMISSION.md) — determination framework to complete
6. **Legal Questions** (WS1-LEGAL-QUESTIONS.md) — structured question list by source
7. **Document Checklist** (WS1-DOCUMENT-CHECKLIST.md) — complete inventory of provided materials

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Input documents** | WS1-LEGAL-REVIEW-COMMISSION.md, WS1-EVIDENCE-PACKAGE.md, WS1-REMEDIATION-REQUIREMENTS.md, WS1-SCOPE-AND-LIMITATIONS.md, WS1-TANZIL-COMPLIANCE-AUDIT.md |
| **Disclaimer** | This document was generated by AI assistance. It is a briefing for human legal counsel, not legal advice. All determinations are reserved for qualified legal counsel. |