# WS1: Legal Review Commissioning Package

**MFD-12.3 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** RESEARCH AND DOCUMENTATION ONLY — no production code modified  
**Prerequisites:** WS1-TANZIL-COMPLIANCE-AUDIT.md, RIGHTS-DELIVERY-INVENTORY.md, BUNDLED-EDITION-VERIFICATION.md

---

## Purpose

This document is a **commissioning package** for independent legal counsel. It completes every AI-determinable field of the WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md template using findings from the compliance audit, delivery inventory, and bundled edition verification. Fields requiring legal judgment are marked `[COUNSEL DETERMINATION REQUIRED]` and left for human review.

This document does **not** constitute legal advice, does **not** declare any source compliant or non-compliant, and does **not** replace counsel's independent analysis.

---

## 1. Identification

| Field | Value |
|-------|-------|
| **Review ID** | TANZIL-RIGHTS-2026-001 (batch review covering all Tanzil-proxied editions) |
| **Date Initiated** | 2026-11-21 |
| **Date Completed** | [COUNSEL DETERMINATION REQUIRED] |
| **Reviewer** | [COUNSEL DETERMINATION REQUIRED — Name, firm/role] |
| **Review Scope** | RIGHTS |
| **Edition(s) Under Review** | Batch B1–B5 (see §9 below): 116 translations + 2 tafsirs via Tanzil proxy; plus bundled quran-json content, Islamic Network audio, semantic embeddings, QUL word data |
| **Source Record ID(s)** | `tanzil-translations`, `tanzil-sahih`, `tanzil-translit`, `tafsir-jalalayn`, `tafsir-muyassar`, `tanzil-mushaf-metadata`, `quran-json`, `quranenc`, `islamic-network-audio`, `semantic-embeddings`, `qul-word-data` |
| **Upstream URL(s)** | `https://tanzil.net/trans/{id}`, `https://cdn.islamic.network/quran/audio/...`, `https://github.com/risan/quran-json`, `https://huggingface.co/Xenova/all-MiniLM-L6-v2`, `https://github.com/TarteelAI/quranic-universal-library` |
| **Publisher(s)** | Tanzil.net, Islamic Network CDN, Risan Bagja Pradana (quran-json), Hugging Face / Xenova, TarteelAI (QUL), QuranEnc |
| **Attributed Translator/Author(s)** | See WS1-EVIDENCE-PACKAGE.md per-source table |

---

## 2. Usage Description

### 2.1 Technical Delivery Mechanism

The application uses **six distinct delivery mechanisms**. Counsel must evaluate each separately:

#### Mechanism A: Tanzil Translation/Tafsir Proxy (PRIMARY RISK)
- Server-side Next.js API route (`/api/translations/[id]`) fetches plain text from `https://tanzil.net/trans/{id}`
- Response cached server-side for 24 hours (Next.js data cache, `revalidate: 86400`)
- Text returned to browser with permissive CORS headers (`Cache-Control: public, max-age=3600, stale-while-revalidate=86400`)
- Browser caches parsed text in memory for session duration
- Text rendered inline alongside Arabic Quran text in reader interface
- Text searchable via server-side substring matching (`/api/v1/search?edition={id}`)
- Text used as grounding context for AI-generated responses (via `src/lib/ai/grounding.ts`)
- No modification or transformation of text content
- Attribution displayed in reader UI and on `/sources` page
- **Rights gate exists** (`isEditionGated(id)` at route line 36) but currently gates zero editions — all catalog-listed editions pass through

#### Mechanism B: Bundled quran-json Content
- Arabic Uthmani text, English translation (Saheeh International), Latin transliteration read from `node_modules/quran-json/dist/chapters/en/*.json` via `node:fs` at build/server time
- Served via API routes (`/api/v1/ayhs/...`, `/api/v1/surahs/...`)
- Never fetched from external sources at runtime
- Licensed under CC-BY-4.0 via npm package

#### Mechanism C: Islamic Network CDN Audio Streaming
- Client-side direct streaming via `<audio>` element src attribute
- URL pattern: `https://cdn.islamic.network/quran/audio/{bitrate}/{reciterId}/{globalAyah}.mp3`
- No server proxy; no app-level caching; browser HTTP cache only
- 12 reciters × 6 bitrate options × 6,236 ayahs = ~449K constructible URLs
- Audio off by default; user must enable in Settings and press play
- No recording files redistributed by the app

#### Mechanism D: Semantic Embeddings (Derived Data)
- Precomputed sentence embeddings stored in `public/embeddings/quran-minilm.bin` (4.57 MB)
- Derived from quran-json English translation (CC-BY-4.0) at build time
- Model (`Xenova/all-MiniLM-L6-v2`) loaded client-side from jsdelivr CDN (Apache-2.0)
- Query embedding happens locally; no query leaves the device
- Vendored with sha256 manifest

#### Mechanism E: QUL Word Data (Vendored)
- Word segmentation, transliteration, English gloss from `public/word-data/{surah}.json`
- Generated at build time from Quranic Universal Library (MIT)
- Vendored with sha256 manifest; never fetched at runtime

#### Mechanism F: Tanzil Mushaf Metadata (Build-Time Snapshot)
- Juz/page/hizb/quarter/ruku/manzil/sajda boundaries
- Generated at build time from vendored `quran-data.xml` (CC-BY)
- Compiled into bundle; no runtime fetch

### 2.2 Scale of Usage

| Metric | Value | Source |
|--------|-------|--------|
| Tanzil editions accessible via proxy | 116 translations + 2 tafsirs = 118 | `translations.ts` + `tafsir-search.ts` |
| Languages covered | 44 | `sources.ts` line 91 |
| Reciters available | 12 | `audio.ts` RECITERS array |
| Bundled translation editions | 2 (en.sahih, en.transliteration) | `rights-gate.ts` BUNDLED_EDITIONS |
| Estimated monthly unique users | [COUNSEL DETERMINATION REQUIRED — requires analytics] | — |
| Estimated monthly API requests to Tanzil.net | [COUNSEL DETERMINATION REQUIRED — requires logging] | — |
| Geographic distribution of users | [COUNSEL DETERMINATION REQUIRED] | — |

### 2.3 Commercial Context

| Field | Value |
|-------|-------|
| Application pricing | [COUNSEL DETERMINATION REQUIRED — free/paid/freemium/ad-supported] |
| Revenue model | [COUNSEL DETERMINATION REQUIRED] |
| Entity operating the application | [COUNSEL DETERMINATION REQUIRED — legal entity name] |
| Jurisdiction of operation | [COUNSEL DETERMINATION REQUIRED — country/countries] |

---

## 3. License Analysis

### 3.1 Applicable License Terms (Per Source)

| Source ID | License Identified | License URL | Version/Date | Full Text Archived |
|-----------|-------------------|-------------|--------------|-------------------|
| `tanzil-translations` | Tanzil Terms of Use | https://tanzil.net/docs/terms | [COUNSEL: verify current version] | No — [COUNSEL: archive recommended] |
| `tafsir-jalalayn` | Tanzil Terms of Use | https://tanzil.net/docs/terms | Same as above | No |
| `tafsir-muyassar` | Tanzil Terms of Use | https://tanzil.net/docs/terms | Same as above | No |
| `quran-json` | CC-BY-4.0 | https://creativecommons.org/licenses/by/4.0/ | 4.0 (international) | Yes (standard license) |
| `quranenc` | "As stated by source publisher; distributed via quran-json under CC-BY-4.0 metadata" | N/A (distributed via quran-json) | As pinned by quran-json@3.1.2 | No separate license text |
| `tanzil-mushaf-metadata` | CC-BY (declared in XML header) | https://tanzil.net/docs/terms | Snapshot date in generated file | No |
| `islamic-network-audio` | None published | https://islamic.network/ | N/A | N/A — no license exists |
| `semantic-embeddings` | Apache-2.0 (model); derived data status TBD | https://www.apache.org/licenses/LICENSE-2.0 | 2.0 | Yes (standard license) |
| `qul-word-data` | MIT | https://github.com/TarteelAI/quranic-universal-library/blob/main/LICENSE | Current | Yes (standard license) |

### 3.2 Permitted Uses Analysis — Tanzil Proxy (Mechanism A)

> **This is the primary risk area.** All determinations below are flagged for counsel.

| Right | Permitted? | Conditions/Limitations | Counsel Notes |
|-------|-----------|----------------------|---------------|
| Reproduction (server caching) | ☐ Yes ☐ No ☐ Unclear | 24-hour server cache + browser cache | [COUNSEL: Does Tanzil ToU permit server-side caching of full text?] |
| Public display (in-app rendering) | ☐ Yes ☐ No ☐ Unclear | Full text rendered inline with Arabic | [COUNSEL: Does in-app display constitute "public display" under ToU?] |
| Redistribution (proxying to users) | ☐ Yes ☐ No ☐ Unclear | Server fetches on behalf of client; browser receives full text | [COUNSEL: Is server-side proxying redistribution?] |
| Modification/derivative works | ☐ Yes ☐ No ☐ Unclear | No text modification; AI grounding may incorporate excerpts | [COUNSEL: Does AI grounding create derivative works?] |
| Commercial use | ☐ Yes ☐ No ☐ Unclear | Depends on app revenue model | [COUNSEL: Determine based on §2.3 commercial context] |
| Search/indexing | ☐ Yes ☐ No ☐ Unclear | Server-side substring search over full text | [COUNSEL: Does indexing full text exceed permitted use?] |
| AI/ML training or grounding | ☐ Yes ☐ No ☐ Unclear | Used as grounding context for AI responses | [COUNSEL: Distinct use — reproduction in prompts + potential incorporation in outputs] |
| Sub-licensing | ☐ Yes ☐ No ☐ Unclear | N/A — no sub-licensing occurs | [COUNSEL: Confirm] |

### 3.3 Permitted Uses Analysis — Bundled Content (Mechanism B)

| Right | Permitted? | Conditions/Limitations | Counsel Notes |
|-------|-----------|----------------------|---------------|
| Reproduction | ☑ Yes (CC-BY-4.0) | Must attribute | Attribution present in `/sources` and footer |
| Public display | ☑ Yes (CC-BY-4.0) | Must attribute | See above |
| Redistribution | ☑ Yes (CC-BY-4.0) | Must attribute, share-alike not required | CC-BY permits redistribution |
| Modification/derivative works | ☑ Yes (CC-BY-4.0) | Must attribute; modifications must be indicated | No modifications made |
| Commercial use | ☑ Yes (CC-BY-4.0) | No restriction | — |
| Search/indexing | ☑ Yes (CC-BY-4.0) | No restriction | — |
| AI/ML grounding | ☐ Unclear | CC-BY-4.0 does not explicitly address AI use | [COUNSEL: Is AI grounding a permitted use under CC-BY-4.0?] |

### 3.4 Permitted Uses Analysis — Audio Streaming (Mechanism C)

| Right | Permitted? | Conditions/Limitations | Counsel Notes |
|-------|-----------|----------------------|---------------|
| Public performance (streaming) | ☐ Unclear | No explicit license published by CDN | [COUNSEL: Does streaming from a public CDN without license constitute authorized public performance?] |
| Reproduction (browser cache) | ☐ Unclear | Browser caches MP3 per HTTP headers | [COUNSEL: Is transient browser caching reproduction?] |
| Redistribution | ☑ Not applicable | App does not redistribute files | Streams only |
| Performer moral rights | ☐ Unclear | 12 named reciters | [COUNSEL: Do reciters retain moral rights that require consent?] |

### 3.5 Attribution Requirements

| Source | Required Format | Current App Attribution | Gap Assessment |
|--------|----------------|------------------------|----------------|
| Tanzil translations | "attribution + no modification" (per sources.ts) | Credit line on `/sources`: "116 translations in 44 languages via Tanzil.net"; individual translator names shown in reader | [COUNSEL: Does current attribution meet Tanzil ToU requirements? Is per-edition attribution required?] |
| quran-json (CC-BY-4.0) | Attribution + license link + indicate changes | Footer: "Content package: quran-json v3.1.2 (CC-BY-4.0)"; `/sources` has full record with license URL | Appears adequate; [COUNSEL: confirm sufficiency] |
| QuranEnc | Unknown (distributed via quran-json) | "/sources": "The Noble Qur'an Encyclopedia (quranenc.com)" | [COUNSEL: Verify QuranEnc's own attribution requirements independent of quran-json packaging] |
| Islamic Network Audio | None published | "Audio: Islamic Network CDN (everyayah.com recordings)" next to player | [COUNSEL: In absence of license, what attribution is appropriate?] |
| Semantic embeddings (Apache-2.0) | NOTICE file + license copy | `/sources` record with Apache-2.0 license URL | [COUNSEL: Is in-app NOTICE required or is `/sources` sufficient?] |
| QUL word data (MIT) | License copy + copyright notice | `/sources` record with MIT license URL | [COUNSEL: Is MIT license text required in distributed artifact?] |

### 3.6 Jurisdiction-Specific Considerations

All items below require counsel determination:

- **Fair use / fair dealing analysis:** [COUNSEL: Applicable jurisdiction and conclusion for proxying 116 translations]
- **Database rights:** [COUNSEL: EU/UK sui generis database right assessment for Tanzil's translation corpus]
- **Moral rights:** [COUNSEL: Waiver/attribution requirements for translators and reciters]
- **Contractual vs. license:** [COUNSEL: Is Tanzil ToU a contractual agreement or unilateral license? Implications for enforceability]
- **Cross-border considerations:** [COUNSEL: Pakistan-based project, global users, Tanzil hosted internationally — which jurisdiction governs?]

---

## 4. Risk Assessment

### 4.1 Legal Risk Rating (AI-Assisted Preliminary — NOT Counsel Determination)

| Source / Mechanism | Preliminary Risk | Basis |
|--------------------|-----------------|-------|
| Tanzil proxy (translations + tafsirs) | 🔴 HIGH (preliminary) | Full-text redistribution via proxy without verified permission; no enforcement of `linkOutOnly` safe default |
| Bundled quran-json content | 🟢 LOW (preliminary) | Verified CC-BY-4.0; attribution present; no modifications |
| Islamic Network audio | 🟡 MEDIUM (preliminary) | No explicit license; streaming-only reduces exposure but does not establish permission |
| Semantic embeddings | 🟢 LOW (preliminary) | Apache-2.0 model; derived from CC-BY-4.0 content; local processing |
| QUL word data | 🟢 LOW (preliminary) | MIT licensed; vendored with integrity checks |
| Tanzil mushaf metadata | 🟢 LOW (preliminary) | CC-BY; build-time snapshot; structural data only |

> ⚠️ **These preliminary ratings are AI-generated observations for counsel's consideration. They are NOT legal determinations and must not be relied upon as such.**

### 4.2 Risk Factors

| Factor | Observation | Counsel Action Needed |
|--------|------------|----------------------|
| Enforcement history | No known enforcement actions by Tanzil against similar apps identified in audit | [COUNSEL: Conduct enforcement history search] |
| Industry practice | Multiple Quran apps use Tanzil content; unclear if licensed | [COUNSEL: Survey comparable apps' licensing arrangements] |
| Term stability | Tanzil ToU change frequency unknown; no change notification mechanism identified | [COUNSEL: Assess term stability and recommend monitoring] |
| Revocability | Unknown whether Tanzil can revoke permission retroactively | [COUNSEL: Analyze revocability and cached-content implications] |
| Third-party claims | Individual translators may retain independent rights separate from Tanzil | [COUNSEL: Assess third-party claim risk for high-value editions] |
| Spec-reality gap | MFD-12.1 policy defines `linkOutOnly` safe default but it is NOT enforced in code | [COUNSEL: Recommend interim enforcement while review proceeds] |
| AI grounding | Distinct use case not addressed by standard license analysis | [COUNSEL: Separate determination for AI grounding authorization] |

---

## 5. Determination

> **ALL DETERMINATIONS BELOW ARE RESERVED FOR LEGAL COUNSEL.** This section is pre-populated with the decision framework only.

### 5.1 Display Authorization

☐ **FULL DISPLAY CLEARED** — In-app text display permitted under identified license  
☐ **EXCERPT ONLY** — Limited excerpts permitted (max length: ___ characters)  
☐ **LINK-OUT ONLY** — No in-app display permitted; bibliographic reference + external link only  
☐ **BLOCKED** — Edition must be removed from catalog entirely  
☐ **CONDITIONAL** — Permitted subject to conditions below

*[COUNSEL: Complete for each batch B1–B5]*

### 5.2 Conditions (if conditional)

[COUNSEL: List specific conditions that must be met for continued use]

### 5.3 AI Grounding Authorization

☐ **PERMITTED** — Edition may be used as AI grounding context  
☐ **NOT PERMITTED** — Edition must be excluded from AI retrieval  
☐ **NOT APPLICABLE** — AI grounding not relevant to this edition

**Rationale:** [COUNSEL: AI grounding involves reproduction in prompts and potential incorporation in generated responses. This may constitute a distinct use requiring separate analysis.]

### 5.4 Export Authorization

☐ **PERMITTED** — Edition text may be included in PDF/EPUB exports  
☐ **NOT PERMITTED** — Edition must be excluded from exports  
☐ **CONDITIONAL** — [specify conditions]

### 5.5 Audio Streaming Authorization

☐ **PERMITTED** — Streaming from Islamic Network CDN is authorized  
☐ **NOT PERMITTED** — Audio must be disabled or replaced  
☐ **CONDITIONAL** — [specify conditions]

---

## 6. Implementation Directives

> **To be completed by counsel after determination.**

### 6.1 Source Record Updates

| Field | Current Value | New Value |
|-------|--------------|----------|
| `rightsStatus` | `rights-unverified` (Tanzil sources) | [COUNSEL] |
| `displayConstraints.linkOutOnly` | N/A (not enforced) | [COUNSEL] |
| `displayConstraints.exportAllowed` | N/A | [COUNSEL] |
| `displayConstraints.excerptMaxLength` | N/A | [COUNSEL] |
| `displayConstraints.aiGroundingAllowed` | N/A | [COUNSEL] |
| `license` | Various (unverified) | [COUNSEL: verified identifiers] |
| `notes` | Various | [COUNSEL: updated with review summary] |

### 6.2 Effective Date

**Determination effective:** [COUNSEL]  
**Implementation deadline:** [COUNSEL]  
**Next review date:** [COUNSEL: recommended annual]

---

## 7. Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Legal Counsel | | | |
| Product Owner | | | |
| Engineering Lead | | | |

---

## 8. Attachments Checklist

- [ ] Archived copy of Tanzil Terms of Use (dated) — [COUNSEL: obtain and archive]
- [ ] Screenshot of current attribution display — [COUNSEL: capture from live app]
- [ ] Technical architecture diagram of proxy flow — Available: see RIGHTS-DELIVERY-INVENTORY.md §1.1
- [ ] Correspondence with Tanzil/publisher (if any) — [COUNSEL: initiate if needed]
- [ ] Fair use/dealing memorandum (if applicable) — [COUNSEL: prepare if relying on fair use]
- [ ] Prior art / industry practice survey — [COUNSEL: conduct]
- [ ] CC-BY-4.0 full text — Standard; available at https://creativecommons.org/licenses/by/4.0/legalcode
- [ ] Apache-2.0 full text — Standard; available at https://www.apache.org/licenses/LICENSE-2.0
- [ ] MIT license (QUL) — Available at https://github.com/TarteelAI/quranic-universal-library/blob/main/LICENSE

---

## 9. Batch Review Groups

| Batch | Editions | Shared License | Count | Notes |
|-------|----------|---------------|-------|-------|
| B1 | All Tanzil translations (non-Sahih, non-translit) | Tanzil Terms of Use | ~114 | Primary risk group; proxied at runtime |
| B2 | en.sahih | CC-BY-4.0 (bundled via quran-json) | 1 | Bundled; lower risk; also available on Tanzil but NOT fetched from Tanzil at runtime |
| B3 | en.transliteration | CC-BY-4.0 (bundled via quran-json) | 1 | Bundled; same as B2 |
| B4 | ar.jalalayn | Tanzil Terms of Use (classical text) | 1 | Proxied; classical author (15th century) — may be public domain in some jurisdictions |
| B5 | ar.muyassar | Tanzil Terms of Use (King Fahd Complex) | 1 | Proxied; government publication — check KSA terms |
| B6 | Islamic Network audio (all reciters) | No published license | 12 reciters | Streaming only; separate analysis needed |
| B7 | Semantic embeddings | Apache-2.0 (model) + CC-BY-4.0 (source data) | 1 | Derived data status requires counsel analysis |
| B8 | QUL word data | MIT | 1 | Vendored; lowest risk |
| B9 | Tanzil mushaf metadata | CC-BY | 1 | Build-time snapshot; structural data |

---

## 10. Integration with MFD-12 Governance

This commissioning package aligns with:
- **MFD-12-SOURCE-REGISTRY-SPEC.md §5.4** — Impact Matrix for rights statuses
- **MFD-12-REVIEW-WORKFLOW-SPEC.md §3** — ReviewDecision schema
- **WS-E-TANZIL-RIGHTS-POLICY.md §3** — Per-edition granularity directive
- **WS-E-EVIDENCE-RIGHTS-CONSOLIDATED.md** — Consolidated rights evidence framework

Completed review records should be stored in `research/mfd-12.3/legal/reviews/` with filename `TANZIL-RIGHTS-2026-NNN-{edition-slug}.md`.

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Input documents** | WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md, WS1-TANZIL-COMPLIANCE-AUDIT.md, RIGHTS-DELIVERY-INVENTORY.md, BUNDLED-EDITION-VERIFICATION.md, sources.ts, audio.ts, DATA-PROVENANCE.md |
| **Disclaimer** | This document was generated by AI assistance. It is a commissioning package for human legal review, not legal advice. All determinations are reserved for qualified legal counsel. |
