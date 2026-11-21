# WS1: Evidence Package — Per-Source Licensing Evidence and Gap Analysis

**MFD-12.3 Workstream 1 — Legal Review Commissioning**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-legal-review  
**Classification:** RESEARCH AND DOCUMENTATION ONLY — no production code modified

---

## Purpose

This document assembles, for each content source in the Quran Al Huda application:
1. The license text or URL currently on record
2. The attribution currently displayed in the application
3. The attribution required by the applicable license
4. A gap analysis identifying what is missing or uncertain

This is factual documentation for counsel's review. No compliance determinations are made.

---

## Source 1: Tanzil Translations (Proxy)

| Field | Value |
|-------|-------|
| **Source ID** | `tanzil-translations` |
| **Content** | 116 translations in 44 languages |
| **Delivery** | Server-side proxy via `/api/translations/[id]` → `https://tanzil.net/trans/{id}` |
| **Method** | `link` (runtime fetch, not bundled) |

### License on Record
- **Stated license:** "Tanzil terms of use (attribution + no modification)"
- **License URL:** https://tanzil.net/docs/terms
- **Full text archived:** ❌ No
- **License version/date:** Not recorded

### Current Attribution Display
- **Reader UI:** Individual translator name shown per translation selection
- **Sources page:** "116 translations in 44 languages via Tanzil.net (default: Urdu — Jalandhry)" (`TRANSLATION_CREDIT` constant, `sources.ts` line 258–259)
- **Per-edition attribution:** Translator name from `translations.ts` catalog entry displayed in selector and reader
- **License link on /sources:** Yes — links to https://tanzil.net/docs/terms

### Attribution Required by License
- **Unknown.** Tanzil Terms of Use have NOT been reviewed by counsel. The source record states "attribution + no modification" but this is a summary, not verified legal text.
- [COUNSEL DETERMINATION REQUIRED]: What specific attribution format does Tanzil ToU require?
- [COUNSEL DETERMINATION REQUIRED]: Is per-edition attribution required, or is aggregate attribution sufficient?
- [COUNSEL DETERMINATION REQUIRED]: Must the license text be reproduced or is a link sufficient?

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| License text not archived | 🔴 HIGH | If Tanzil changes or removes their ToU page, there is no record of what terms applied at the time of use |
| License terms not reviewed | 🔴 HIGH | "Attribution + no modification" is an unverified summary; actual terms may impose additional conditions |
| Proxy redistribution unaddressed | 🔴 HIGH | ToU may not contemplate server-side proxying; current attribution assumes display-only use |
| AI grounding not addressed | 🟡 MEDIUM | Text used as AI grounding context; unclear if this constitutes modification or derivative work |
| Search indexing not addressed | 🟡 MEDIUM | Full-text server-side indexing may exceed permitted use |
| Commercial use status unknown | 🟡 MEDIUM | ToU may distinguish commercial vs. non-commercial; app's commercial status not documented |
| Per-edition rights variation ignored | 🟡 MEDIUM | Different translators/publishers may have different terms; batch treatment assumes uniformity |

---

## Source 2: Tafsir al-Jalalayn (Proxy)

| Field | Value |
|-------|-------|
| **Source ID** | `tafsir-jalalayn` |
| **Content** | Classical Arabic tafsir (15th century CE) |
| **Authors** | Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti |
| **Delivery** | Same proxy as translations: `/api/translations/ar.jalalayn` |
| **Method** | `link` |

### License on Record
- **Stated license:** "Tanzil terms of use (attribution + no modification)"
- **License URL:** https://tanzil.net/docs/terms
- **Full text archived:** ❌ No

### Current Attribution Display
- **Tafsir viewer:** Author, period, language, and licence displayed per FR-030
- **Sources page:** Full source record with attribution, publisher, license URL
- **Credit line:** Included in tafsir panel header

### Attribution Required by License
- Same unknowns as Tanzil translations above
- **Additional consideration:** Classical text (15th century) may be public domain in many jurisdictions, but Tanzil's digital edition may carry separate rights
- [COUNSEL DETERMINATION REQUIRED]: Does the classical authorship affect the applicable rights framework?
- [COUNSEL DETERMINATION REQUIRED]: Does Tanzil claim rights in the digital encoding/edition separate from the underlying text?

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| Same gaps as Tanzil translations | 🔴 HIGH | All proxy-related gaps apply identically |
| Public domain status unverified | 🟡 MEDIUM | Classical text may be PD, but digital edition rights are separate |
| Government/institutional rights unclear | 🟢 LOW | Not a government publication (unlike al-Muyassar) |

---

## Source 3: Tafsir al-Muyassar (Proxy)

| Field | Value |
|-------|-------|
| **Source ID** | `tafsir-muyassar` |
| **Content** | Contemporary Arabic tafsir |
| **Author/Publisher** | King Fahd Complex for the Printing of the Holy Quran |
| **Delivery** | Same proxy: `/api/translations/ar.muyassar` |
| **Method** | `link` |

### License on Record
- **Stated license:** "Tanzil terms of use (attribution + no modification)"
- **License URL:** https://tanzil.net/docs/terms
- **Full text archived:** ❌ No

### Current Attribution Display
- Same pattern as al-Jalalayn: author, period, language, licence in viewer; full record on /sources

### Attribution Required by License
- Same unknowns as Tanzil translations
- **Additional consideration:** King Fahd Complex is a Saudi government entity; KSA government publications may have specific terms
- [COUNSEL DETERMINATION REQUIRED]: Do KSA government publication rules apply? Are they compatible with Tanzil's stated terms?

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| Same gaps as Tanzil translations | 🔴 HIGH | All proxy-related gaps apply identically |
| Government publication terms unverified | 🟡 MEDIUM | KSA government works may have specific licensing frameworks |
| Dual-rights chain unclear | 🟡 MEDIUM | Both Tanzil ToU AND KSA government terms may apply |

---

## Source 4: quran-json (Bundled)

| Field | Value |
|-------|-------|
| **Source ID** | `quran-json` |
| **Content** | Quran structure, surah metadata, Arabic text, English translation (Saheeh International), Latin transliteration |
| **Version** | 3.1.2 (pinned in package.json) |
| **Delivery** | Bundled in `node_modules`; read via `node:fs` at build/server time |
| **Method** | `package` |

### License on Record
- **License:** CC-BY-4.0
- **License URL:** https://creativecommons.org/licenses/by/4.0/
- **Full text archived:** ✅ Standard Creative Commons license text
- **Package homepage:** https://github.com/risan/quran-json
- **Author:** Risan Bagja Pradana

### Current Attribution Display
- **Footer:** "Content package: quran-json v3.1.2 (CC-BY-4.0)" (`PACKAGE_CREDIT`, `sources.ts` line 265)
- **Sources page:** Full record with attribution, license URL, version, homepage
- **Per-verse card:** Attribution rendered via source panel

### Attribution Required by CC-BY-4.0
Per §3(a)(1)(A) of CC-BY-4.0:
1. ✅ Retain identification of creator(s) — "quran-json by Risan Bagja Pradana"
2. ✅ Retain copyright notice — Present in /sources record
3. ✅ Retain license notice — CC-BY-4.0 linked
4. ✅ Retain disclaimer/warranty notice — N/A (none in original)
5. ✅ URI/hyperlink to licensed material — Homepage URL present
6. ✅ Indicate if modified — No modifications made; noted in sources record
7. ☐ Provide license text or link — Link provided; [COUNSEL: is link sufficient or must full text be included?]

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| Upstream source chain opacity | 🟡 MEDIUM | quran-json aggregates from Tanzil and QuranEnc; CC-BY-4.0 covers the package but individual upstream sources' permissions for inclusion in quran-json are not independently verified |
| AI grounding under CC-BY-4.0 | 🟡 MEDIUM | CC-BY-4.0 does not explicitly address AI/ML use; derived embeddings may constitute adaptation |
| Sub-component attribution granularity | 🟢 LOW | QuranEnc and Tanzil contributions within quran-json may warrant separate attribution beyond the package-level credit |

---

## Source 5: QuranEnc (via quran-json)

| Field | Value |
|-------|-------|
| **Source ID** | `quranenc` |
| **Content** | Uthmani Arabic Quran text and Arabic chapter metadata |
| **Delivery** | Bundled within quran-json package |
| **Method** | `package` |

### License on Record
- **Stated license:** "As stated by source publisher; distributed via quran-json under CC-BY-4.0 metadata"
- **License URL:** N/A (no direct license URL recorded)
- **Homepage:** https://quranenc.com/en/home
- **Full text archived:** ❌ No

### Current Attribution Display
- **Sources page:** "The Noble Qur'an Encyclopedia (quranenc.com)"
- **Arabic text credit:** "Arabic text: Uthmani and chapter metadata via quranenc.com" (`ARABIC_CREDIT`, `sources.ts` line 262)

### Attribution Required
- **Unknown.** QuranEnc's own terms are not documented. The app relies on quran-json's CC-BY-4.0 packaging as the licensing layer.
- [COUNSEL DETERMINATION REQUIRED]: Does QuranEnc have independent licensing terms that must be satisfied separately from quran-json's CC-BY-4.0?
- [COUNSEL DETERMINATION REQUIRED]: Is the attribution "via quranenc.com" sufficient, or does QuranEnc require specific wording?

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| No direct license verification | 🟡 MEDIUM | Relies entirely on quran-json's CC-BY-4.0 as intermediary; QuranEnc's own terms not reviewed |
| No license URL recorded | 🟡 MEDIUM | Cannot verify current terms without visiting quranenc.com |
| Attribution format unverified | 🟢 LOW | Current attribution appears reasonable but is not confirmed against QuranEnc's requirements |

---

## Source 6: Tanzil Mushaf Metadata (Build-Time)

| Field | Value |
|-------|-------|
| **Source ID** | `tanzil-mushaf-metadata` |
| **Content** | Juz, page, hizb, quarter, ruku, manzil, sajda boundaries |
| **Delivery** | Generated at build time from vendored `quran-data.xml`; compiled into bundle |
| **Method** | `package` |

### License on Record
- **License:** CC-BY (declared in XML file header: `license="cc-by"`)
- **License URL:** https://tanzil.net/docs/terms
- **Upstream URL:** https://tanzil.net/res/text/metadata/quran-data.xml
- **Full text archived:** ❌ No (but XML header declaration is preserved in generated output)

### Current Attribution Display
- **Sources page:** Full record with "Tanzil Quran metadata (quran-data.xml)" attribution, CC-BY license, generator script reference

### Attribution Required by CC-BY
- Same requirements as Source 4 above
- ✅ Creator identified (Tanzil.net)
- ✅ License referenced (CC-BY)
- ☐ License text/link — Linked to Tanzil terms page rather than CC-BY deed directly

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| License URL points to Tanzil terms, not CC-BY deed | 🟢 LOW | Minor: should link to https://creativecommons.org/licenses/by/4.0/ directly for clarity |
| Structural data copyrightability uncertain | 🟢 LOW | Factual boundary data may not be copyrightable in many jurisdictions; CC-BY may be precautionary |
| Snapshot date not prominently displayed | 🟢 LOW | Version field says "Snapshot generated by scripts/generate-mushaf-data.js" without date |

---

## Source 7: Islamic Network Audio CDN

| Field | Value |
|-------|-------|
| **Source ID** | `islamic-network-audio` |
| **Content** | Per-ayah MP3 recitation (12 reciters, 6 bitrates) |
| **Delivery** | Client-side `<audio>` element streaming from `https://cdn.islamic.network/quran/audio/...` |
| **Method** | `link` |

### License on Record
- **Stated license:** "Streamed at runtime under the CDN's terms; no recording files are redistributed by this app"
- **License URL:** https://islamic.network/
- **CDN homepage:** https://cdn.islamic.network/quran/
- **Explicit copyright license:** ❌ NONE PUBLISHED
- **Recordings sourced from:** everyayah.com (per attribution)

### Current Attribution Display
- **Player UI:** "Audio: Islamic Network CDN (everyayah.com recordings)" (`AUDIO_CREDIT`, `audio.ts` line 72)
- **Sources page:** Full record listing all 12 reciters by name, noting no explicit license

### Attribution Required
- **Unknown.** No license exists to specify attribution requirements.
- [COUNSEL DETERMINATION REQUIRED]: In the absence of an explicit license, what legal basis permits streaming these recordings?
- [COUNSEL DETERMINATION REQUIRED]: Do individual reciters retain performer rights that require consent?
- [COUNSEL DETERMINATION REQUIRED]: Does everyayah.com have terms that govern downstream use of their recordings via third-party CDNs?

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| NO EXPLICIT LICENSE EXISTS | 🔴 HIGH | Streaming without any published license is legally precarious regardless of technical implementation |
| Performer moral rights unaddressed | 🟡 MEDIUM | 12 named reciters may have moral/performance rights independent of recording copyright |
| CDN terms vs. recording copyright conflation | 🟡 MEDIUM | CDN access permission ≠ copyright license for the underlying recordings |
| everyayah.com provenance unverified | 🟡 MEDIUM | Recordings attributed to everyayah.com but that site's own licensing is not documented |
| Browser caching = reproduction? | 🟢 LOW | Transient browser cache may constitute technical reproduction; likely de minimis but unverified |

---

## Source 8: Semantic Embeddings (Derived Data)

| Field | Value |
|-------|-------|
| **Source ID** | `semantic-embeddings` |
| **Content** | Precomputed sentence embeddings (6,236 × 384 float16 vectors) |
| **Model** | Xenova/all-MiniLM-L6-v2 (Apache-2.0) |
| **Source data** | quran-json English translation (CC-BY-4.0) |
| **Delivery** | Vendored at build time; model loaded client-side from jsdelivr CDN |
| **Method** | `package` |

### License on Record
- **Model license:** Apache-2.0
- **Model license URL:** https://www.apache.org/licenses/LICENSE-2.0
- **Source data license:** CC-BY-4.0 (quran-json)
- **Derived data status:** Claimed as "derived data under the same terms" in source record
- **Full text archived:** ✅ Standard Apache-2.0 text

### Current Attribution Display
- **Sources page:** Full record with model attribution, Apache-2.0 license URL, generation script reference, sha256 manifest note

### Attribution Required
- **Apache-2.0 (§4):** NOTICE file, license copy, state changes — [COUNSEL: Is `/sources` record sufficient or must a NOTICE file be distributed?]
- **CC-BY-4.0 (source data):** Attribution for the underlying translation used to generate embeddings — Currently attributed via quran-json credit; [COUNSEL: Is separate attribution needed for the embedding index as a derivative?]

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| Derived-data status under CC-BY-4.0 unverified | 🟡 MEDIUM | Whether precomputed embeddings constitute an "Adapted Material" under CC-BY-4.0 §1(a) requires legal analysis |
| Dual-license interaction unclear | 🟡 MEDIUM | Apache-2.0 model + CC-BY-4.0 source data = which license governs the combined artifact? |
| NOTICE file distribution | 🟢 LOW | Apache-2.0 requires NOTICE; current delivery is via /sources page rather than bundled file |
| Model weights redistribution | 🟢 LOW | Model loaded from jsdelivr CDN at runtime, not vendored; reduces redistribution exposure |

---

## Source 9: QUL Word Data (Vendored)

| Field | Value |
|-------|-------|
| **Source ID** | `qul-word-data` |
| **Content** | Word segmentation: Uthmani token, transliteration, English gloss (77,429 words) |
| **Source** | Quranic Universal Library by TarteelAI |
| **Delivery** | Vendored at build time; per-surah JSON in `public/word-data/` |
| **Method** | `package` |

### License on Record
- **License:** MIT
- **License URL:** https://github.com/TarteelAI/quranic-universal-library/blob/main/LICENSE
- **Homepage:** https://github.com/TarteelAI/quranic-universal-library
- **Full text archived:** ✅ Standard MIT license text available at URL
- **Integrity:** sha256 manifest generated at build time

### Current Attribution Display
- **Sources page:** Full record with "Quranic Universal Library (QUL) by TarteelAI" attribution, MIT license URL, generation details

### Attribution Required by MIT
- MIT requires: copyright notice + permission notice in all copies or substantial portions
- [COUNSEL DETERMINATION REQUIRED]: Does the `/sources` page satisfy MIT's "included in all copies" requirement for a web application?
- [COUNSEL DETERMINATION REQUIRED]: Must the MIT license text be bundled in the distributed application artifacts?

### Gap Analysis

| Gap | Severity | Description |
|-----|----------|-------------|
| MIT license text not bundled in app artifacts | 🟢 LOW | Web app distribution model makes "all copies" requirement ambiguous; /sources page likely sufficient |
| Copyright holder identification | 🟢 LOW | "TarteelAI" credited; formal copyright holder name should be verified against repo |

---

## Summary: Evidence Gaps by Priority

### 🔴 Critical Gaps (Require Immediate Counsel Attention)

1. **Tanzil Terms of Use not reviewed** — 118 editions served via proxy with unverified permission
2. **No license text archived** for Tanzil ToU — risk of terms changing without record
3. **Islamic Network Audio has NO published license** — 12 reciters streamed without legal basis
4. **Proxy redistribution mechanism unaddressed** by any license analysis

### 🟡 Medium Gaps (Require Counsel Analysis)

5. AI grounding authorization across all proxied content
6. QuranEnc independent licensing terms
7. Semantic embeddings derived-data status under CC-BY-4.0
8. Performer moral rights for audio reciters
9. Commercial vs. non-commercial use classification
10. Jurisdiction determination for cross-border content delivery

### 🟢 Low Gaps (Minor Remediation)

11. Tanzil mushaf metadata license URL should point to CC-BY deed directly
12. MIT/Apache-2.0 NOTICE distribution method for web apps
13. Snapshot dates for build-time generated content

---

## Document Control

| Field | Value |
|-------|-------|
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-legal-review |
| **Generated** | 2026-11-21 |
| **Input documents** | sources.ts, audio.ts, DATA-PROVENANCE.md, RIGHTS-DELIVERY-INVENTORY.md, BUNDLED-EDITION-VERIFICATION.md, WS1-TANZIL-COMPLIANCE-AUDIT.md |
| **Disclaimer** | This document was generated by AI assistance. It is factual documentation for human legal review, not legal advice. No compliance determinations are made. |
