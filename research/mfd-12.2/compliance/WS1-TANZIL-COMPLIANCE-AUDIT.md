# WS1: Tanzil Proxy Compliance Audit

**MFD-12.2 Workstream 1 — Tanzil Rights-Compliance Remediation**  
**Date:** 2026-11-21  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-review  
**Classification:** RESEARCH AND PLANNING ONLY — no production code modified

---

## 1. Executive Summary

The Quran Al Huda application currently proxies and displays in-app the full text of 100+ Quran translations and 2 classical Arabic tafsirs sourced from Tanzil.net via a server-side Next.js API route (`/api/translations/[id]`). This constitutes **potential unauthorized redistribution** under most copyright regimes. The MFD-12.1 governance framework (WS-E-TANZIL-RIGHTS-POLICY.md) defines `linkOutOnly: true` as the safe default for `rights-unverified` sources, but this constraint is **not enforced in production code**. The spec-reality gap is the primary compliance risk.

This audit documents every code path through which Tanzil content reaches the user's browser, identifies all affected components, and establishes the factual basis for the remediation plan in WS1-TANZIL-REMEDIATION-PLAN.md.

---

## 2. Current Data Flow Architecture

### 2.1 Server-Side Proxy Route

**File:** `src/app/api/translations/[id]/route.ts` (66 lines)

This is the **primary ingress point** for all Tanzil content. Key characteristics:

- Fetches from `https://tanzil.net/trans/{id}` with a custom User-Agent header
- Caches upstream response for 24 hours via Next.js data cache (`revalidate: 86400`)
- Returns plain text with permissive CORS headers to the browser
- Validates `id` against the translation catalog (prevents open-proxy abuse)
- **No rights/licensing check exists** — any catalog-listed edition is served regardless of rights status
- Sets `Cache-Control: public, max-age=3600, stale-while-revalidate=86400` on responses

### 2.2 Server-Side Search Module

**File:** `src/lib/quran/translation-search.ts` (163 lines)

Used by `/api/v1/search?edition={id}` and the search page's edition-specific mode:

- Fetches directly from `https://tanzil.net/trans/{id}` (bypasses the proxy route)
- Parses the `surah|ayah|text` format into an in-memory Map
- Caches parsed results in process memory for the server lifetime
- Deduplicates concurrent fetches via an inflight promise map
- **No rights check** — searches any catalog-listed edition

### 2.3 Client-Side Translation Store

**File:** `src/lib/quran/translation-store.ts` (170 lines)

Browser-side cache and React integration:

- Fetches from `/api/translations/{id}` (the proxy route above)
- Parses Tanzil plain-text format client-side
- Caches parsed Map in module scope (per browser tab)
- Provides `useTranslationText()` React hook for component consumption
- Deduplicates concurrent loads via inflight promise map
- **No client-side rights gating** — trusts whatever the proxy returns

### 2.4 Tafsir Search Module

**File:** `src/lib/quran/tafsir-search.ts` (69 lines)

Thin wrapper over `translation-search.ts`:

- Searches both `ar.jalalayn` and `ar.muyassar` editions
- Merges results into a single ranked list
- Used by `/api/v1/search/tafsir` and the search page's tafsir mode
- Inherits the same **no-rights-check** behavior from translation-search

### 2.5 Source Catalog

**File:** `src/lib/quran/sources.ts` (261 lines)

Defines 13 source records. Tanzil-related entries:

| Source ID | Method | Rights Status | Content |
|-----------|--------|---------------|---------|
| `tanzil-sahih` | `package` | Unverified | English translation (Saheeh International) |
| `tanzil-translit` | `package` | Unverified | Latin transliteration |
| `tanzil-translations` | `link` | Unverified | 100+ translations in 44 languages |
| `tanzil-mushaf-metadata` | `package` | CC-BY | Juz/page/hizb boundary data |
| `tafsir-jalalayn` | `link` | Unverified | Classical Arabic tafsir |
| `tafsir-muyassar` | `link` | Unverified | Contemporary Arabic tafsir |

**Critical observation:** `tanzil-sahih` and `tanzil-translit` are marked `method: "package"` but are actually fetched at runtime through the same proxy as `link`-method sources. The `method` field does not accurately reflect the delivery mechanism. Only `tanzil-mushaf-metadata` is genuinely vendored (generated at build time from `quran-data.xml`).

### 2.6 Translation Catalog

**File:** `src/lib/quran/translations.ts` (289 lines)

Lists 116 translation editions across 44 languages. All entries are served through the proxy. No per-edition rights metadata exists in this file.

---

## 3. Affected Routes and Components

### 3.1 API Routes Serving Tanzil Content

| Route | File | Content Served | Rights Check |
|-------|------|----------------|-------------|
| `/api/translations/[id]` | `src/app/api/translations/[id]/route.ts` | Full translation/tafsir text | ❌ None |
| `/api/v1/search?edition={id}` | Uses `translation-search.ts` | Search hits from any edition | ❌ None |
| `/api/v1/search/tafsir` | Uses `tafsir-search.ts` | Tafsir search hits | ❌ None |
| `/api/v1/ayahs/[s]/[a]/tafsir` | `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts` | Tafsir edition metadata + text endpoint URL | ⚠️ Metadata only, but exposes text endpoint |
| `/api/v1/translations` | `src/app/api/v1/translations/route.ts` | Catalog metadata + text endpoint URLs | ⚠️ Metadata only, but exposes text endpoint |

### 3.2 UI Components Consuming Tanzil Content

| Component | File | Consumption Pattern |
|-----------|------|---------------------|
| `AyahCard` | `src/components/quran/ayah-card.tsx` | `useTranslationText()` for primary + parallel translations |
| `TafsirViewer` | `src/components/quran/tafsir-viewer.tsx` | `useTranslationText()` for ar.jalalayn + ar.muyassar |
| `TopicTafsirViewer` | `src/components/taxonomy/topic-tafsir-viewer.tsx` | Renders tafsir via TafsirViewer |
| `TranslationSelector` | `src/components/quran/translation-selector.tsx` | Triggers `ensureLoaded()` on selection change |
| Settings page | `src/app/settings/page.tsx` | Displays current translation, triggers loads |
| Ayah detail page | `src/app/ayah/[surah]/[ayah]/page.tsx` | Renders TafsirViewer |
| Topic detail page | `src/app/explore/topics/[id]/page.tsx` | Renders TopicTafsirViewer |

### 3.3 AI Grounding Module

**File:** `src/lib/ai/grounding.ts`

- References `tanzil-sahih` as the translation edition for AI citations (line 155, 305)
- Uses it for citation generation in factual-reference responses
- Does not fetch text directly but assumes the edition is available for display

### 3.4 Public API Provenance

**File:** `src/lib/api/v1.ts`

- `contentProvenance()` references `tanzil-sahih` and `tanzil-translit` in every API response envelope
- `EDITION` object claims "Active translation is user-selectable (100+ editions via Tanzil.net)"
- These provenance statements are accurate descriptively but do not address rights status

---

## 4. Rights and Licensing Metadata Analysis

### 4.1 What Exists

- `sources.ts` records `license: "Tanzil terms of use (attribution + no modification)"` for most Tanzil entries
- `licenseUrl: "https://tanzil.net/docs/terms"` is recorded for all Tanzil sources
- `DATA-PROVENANCE.md` explicitly classifies the proxy as a "documented deviation"
- `WS-E-TANZIL-RIGHTS-POLICY.md` defines the safe-default policy but notes it is not enforced

### 4.2 What Is Missing

- **No per-edition rights verification has been performed.** The license field records what Tanzil claims, not what legal counsel has confirmed permits this specific usage pattern (server-side proxying + in-app display).
- **No `displayConstraints.linkOutOnly` enforcement exists in code.** The field exists in the MFD-12 schema spec but has no runtime effect.
- **No `proxyComplianceMode` field exists in the current codebase.** This is a proposed MFD-12 addition not yet implemented.
- **No rights review queue or ReviewDecision records exist for Tanzil editions.**
- **The `method: "package"` designation on `tanzil-sahih` and `tanzil-translit` is misleading** — these are runtime-fetched, not bundled.

### 4.3 Tanzil Terms of Use (Unreviewed)

The URL `https://tanzil.net/docs/terms` is referenced but has not been reviewed by legal counsel. Key unknowns:
- Whether server-side proxying constitutes "redistribution" under Tanzil's terms
- Whether in-app display without modification satisfies the "no modification" requirement
- Whether attribution requirements are met by the current UI display
- Whether commercial/non-commercial distinctions apply

---

## 5. Risk Assessment

### 5.1 Legal Risk: HIGH

The current implementation serves full copyrighted text through a proxy without verified distribution rights. Under most jurisdictions, this constitutes either:
- **Reproduction** (server caches full text)
- **Public performance/display** (rendered in user's browser)
- **Redistribution** (proxied to end users)

The `linkOutOnly` safe default defined in WS-E-TANZIL-RIGHTS-POLICY.md is adequate as a temporary posture but is **not enforced**, making the theoretical safety moot.

### 5.2 Spec-Reality Gap: CRITICAL

| Spec Requirement | Production Reality | Gap Severity |
|------------------|--------------------|--------------|
| `rights-unverified` → `linkOutOnly: true` | In-app text display via proxy | 🔴 CRITICAL |
| `method: "link"` sources not redistributed | Proxied and displayed in-app | 🔴 CRITICAL |
| Per-edition rights clearance before display | No clearance performed | 🟡 HIGH |
| `proxyComplianceMode` enforcement | Field does not exist in code | 🟡 HIGH |

### 5.3 User Experience Risk: MEDIUM

Enforcing `linkOutOnly` will remove in-app display of 100+ translations and 2 tafsirs. This is a significant feature regression that must be communicated as a rights-compliance measure, not a technical failure.

### 5.4 Scholarly Utility Risk: MEDIUM

Link-out-only prevents side-by-side comparison of translations with Arabic text within the app, reducing scholarly utility. This is an acceptable trade-off for legal compliance but should be mitigated through clear UX messaging.

---

## 6. Findings Summary

1. **Six Tanzil source records exist** in `sources.ts`; five have unverified rights status.
2. **One API route** (`/api/translations/[id]`) serves all Tanzil text content with no rights gating.
3. **Two server-side modules** (`translation-search.ts`, `tafsir-search.ts`) fetch Tanzil content directly with no rights gating.
4. **One client-side store** (`translation-store.ts`) caches and serves Tanzil content to 7+ UI components with no rights gating.
5. **116 translation editions + 2 tafsir editions** are exposed through these paths.
6. **Zero runtime enforcement** of the `linkOutOnly` safe default exists anywhere in the codebase.
7. **The `method: "package"` designation on two sources is inaccurate** — they are runtime-proxied, not bundled.
8. **No legal review of Tanzil's terms of use has been performed** for this specific usage pattern.
9. **The MFD-12.1 WS-E policy document correctly identifies this gap** and provides adequate remediation guidance.
10. **Remediation requires changes at 4 layers**: API route, server search modules, client store, and UI components.

---

## 7. Evidence Index

| Evidence ID | File | Lines | Description |
|-------------|------|-------|-------------|
| E1 | `src/app/api/translations/[id]/route.ts` | 1-66 | Primary proxy route, no rights check |
| E2 | `src/lib/quran/translation-search.ts` | 34-66 | Server-side fetch, no rights check |
| E3 | `src/lib/quran/translation-store.ts` | 100-125 | Client-side fetch/cache, no rights check |
| E4 | `src/lib/quran/sources.ts` | 64-98, 116-158 | Tanzil source records with unverified rights |
| E5 | `src/lib/quran/translations.ts` | 15-218 | 116 edition catalog, no rights metadata |
| E6 | `src/lib/quran/tafsir-search.ts` | 14, 34-68 | Tafsir search inherits no-rights-check |
| E7 | `src/components/quran/ayah-card.tsx` | 48-50, 100-117 | UI consumes proxied translations |
| E8 | `src/components/quran/tafsir-viewer.tsx` | 33-40, 87-88, 111-129 | UI consumes proxied tafsirs |
| E9 | `research/mfd-12.1/governance/WS-E-TANZIL-RIGHTS-POLICY.md` | 22-27, 54-68 | Policy defines safe default, notes non-enforcement |
| E10 | `docs/DATA-PROVENANCE.md` | 88, 307 | Documents proxy as deviation, notes unverified rights |
