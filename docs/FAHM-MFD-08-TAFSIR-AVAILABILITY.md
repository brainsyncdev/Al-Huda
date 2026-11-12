# MFD-08 Phase 5 — Tafsir Availability Report

**Date:** November 13, 2026  
**Auditor:** Phase 5 Subagent  
**Status:** Complete with corrections

---

## Executive Summary

This report provides verified tafsir availability metrics, correcting the misleading "7,556 tafsir links" claim from MFD-07. **Actual verified ayah-level links: 3,778 (50% of claimed count).** The remaining 3,778 are homepage-level links, one of which is broken.

---

## 1. Verified Link Counts

### 1.1 MFD-07 Claim vs. Reality

| Metric | MFD-07 Claim | Actual (Verified) | Discrepancy |
|--------|-------------:|------------------:|-------------|
| Total tafsir link objects | 7,556 | 7,556 | ✅ Match |
| Ayah-level deep links | 7,556 | 3,778 | ❌ **-50%** |
| Homepage-level links | 0 | 3,778 | ❌ **+3,778** |
| Broken links | 0 | 1,889 | ❌ **+1,889** |
| Working ayah-level links | 7,556 | 3,778 | ❌ **-50%** |

### 1.2 Breakdown by Source

| Source | Link Type | Count per Ayah | Total (1,889 ayat) | Status |
|--------|-----------|---------------:|-------------------:|--------|
| **al-Jalalayn** | Ayah-level deep link | 1 | 1,889 | ✅ Working |
| **al-Muyassar** | Ayah-level deep link | 1 | 1,889 | ✅ Working |
| **Ibn Kathir** | Homepage link | 1 | 1,889 | ⚠️ Working but homepage-only |
| **Ma'ariful Quran** | Homepage link | 1 | 1,889 | ❌ **BROKEN** |
| **TOTAL** | — | 4 | 7,556 | — |

### 1.3 Breakdown by Link Type

| Link Type | Count | Percentage | Quality |
|-----------|------:|-----------:|---------|
| Ayah-level deep links (in-app) | 3,778 | 50.0% | ✅ High — navigates to specific verse |
| Homepage links (external, working) | 1,889 | 25.0% | ⚠️ Medium — user must navigate manually |
| Broken links (external, wrong site) | 1,889 | 25.0% | ❌ None — points to wrong resource |
| **TOTAL** | **7,556** | **100%** | — |

---

## 2. Verified Availability by Source

### 2.1 Tafsir al-Jalalayn

| Metric | Value |
|--------|-------|
| **Availability** | ✅ VERIFIED |
| **Link type** | Ayah-level deep link |
| **URL pattern** | `/ayah/{surah}/{ayah}?tafsir=ar.jalalayn` |
| **Coverage** | All 6,236 ayat (via translation proxy) |
| **Mapped ayat coverage** | 1,889 / 1,889 (100%) |
| **Text delivery** | On-demand via `/api/translations/ar.jalalayn` |
| **Upstream source** | Tanzil.net (ar.jalalayn) |
| **Caching** | 24-hour Next.js data cache |
| **Attribution** | ✅ Complete |
| **License** | ✅ Tanzil terms of use |

**Verification method:** Proxy endpoint exists and is functional. Text fetched from Tanzil.net on-demand.

---

### 2.2 Tafsir al-Muyassar

| Metric | Value |
|--------|-------|
| **Availability** | ✅ VERIFIED |
| **Link type** | Ayah-level deep link |
| **URL pattern** | `/ayah/{surah}/{ayah}?tafsir=ar.muyassar` |
| **Coverage** | All 6,236 ayat (via translation proxy) |
| **Mapped ayat coverage** | 1,889 / 1,889 (100%) |
| **Text delivery** | On-demand via `/api/translations/ar.muyassar` |
| **Upstream source** | Tanzil.net (ar.muyassar) |
| **Caching** | 24-hour Next.js data cache |
| **Attribution** | ✅ Complete |
| **License** | ✅ Tanzil terms of use |

**Verification method:** Proxy endpoint exists and is functional. Text fetched from Tanzil.net on-demand.

---

### 2.3 Tafsir Ibn Kathir

| Metric | Value |
|--------|-------|
| **Availability** | ⚠️ PARTIAL (homepage only) |
| **Link type** | Homepage link (NOT ayah-level) |
| **URL** | `https://www.qtafsir.com/` (static, same for all ayat) |
| **Coverage** | Homepage only; user must navigate manually |
| **Mapped ayat coverage** | 0 / 1,889 (0% ayah-level) |
| **Text delivery** | Link-out only (FR-031) |
| **Upstream source** | qtafsir.com (Yusuf Estes' Guide US TV) |
| **Caching** | N/A (external link) |
| **Attribution** | ✅ Complete |
| **License** | ⚠️ "Check external source" (not verified) |

**Verification method (2026-11-13):**
- ✅ HTTP 200 response
- ✅ Site contains Ibn Kathir's tafsir
- ✅ Organized by surah (114 surahs)
- ❌ No ayah-level deep links in URL structure
- ⚠️ User must navigate: Homepage → Surah → Ayah manually

**Issue:** Links are labeled as "tafsir for this ayah" but actually point to the homepage. Users must navigate manually to find the specific ayah.

---

### 2.4 Ma'ariful Quran — ❌ BROKEN

| Metric | Value |
|--------|-------|
| **Availability** | ❌ **UNAVAILABLE** |
| **Link type** | Homepage link (BROKEN) |
| **URL** | `https://www.maarifulquran.org/` (WRONG SITE) |
| **Coverage** | N/A (site does not contain tafsir) |
| **Mapped ayat coverage** | 0 / 1,889 (0%) |
| **Text delivery** | N/A |
| **Upstream source** | ❌ Site is a Quran courses institute, NOT a tafsir resource |
| **Caching** | N/A |
| **Attribution** | ✅ Complete (but link is wrong) |
| **License** | ❌ N/A (wrong site) |

**Verification method (2026-11-13):**
- ✅ HTTP 200 response
- ❌ **Site is "Maarif ul Quran Institute" — a Quran education center**
- ❌ Offers Tajweed, Tafseer courses, Hifz programs
- ❌ No Ma'ariful Quran tafsir text by Mufti Muhammad Shafi Usmani
- ❌ Completely different organization

**Issue:** The URL points to a Quran courses institute, not the Ma'ariful Quran tafsir. This is a critical broken link affecting 1,889 ayat.

**Resolution:** Marked as unavailable in the source registry. UI now shows "Unavailable" status for this source.

---

## 3. Corrected Availability Metrics

### 3.1 Summary Statistics

| Metric | Value |
|--------|------:|
| **Total tafsir sources registered** | 4 |
| **In-app tafsirs** | 2 |
| **External tafsirs** | 2 |
| **Working ayah-level links** | 3,778 |
| **Working homepage links** | 1,889 |
| **Broken links** | 1,889 |
| **Total link objects** | 7,556 |
| **Actual availability rate** | 75.0% (5,667 / 7,556) |
| **Ayah-level availability rate** | 50.0% (3,778 / 7,556) |

### 3.2 Per-Ayah Availability

For each of the 1,889 mapped ayat:

| Tafsir | Available | Link Type |
|--------|-----------|-----------|
| al-Jalalayn | ✅ Yes | Ayah-level deep link |
| al-Muyassar | ✅ Yes | Ayah-level deep link |
| Ibn Kathir | ⚠️ Yes (homepage) | Homepage link |
| Ma'ariful Quran | ❌ **No** | Broken |

**Actual per-ayah availability:** 2.75 / 4 tafsirs (68.75%)

### 3.3 Coverage by Mapped Ayat

| Coverage Level | Ayat Count | Percentage |
|----------------|-----------:|-----------:|
| 4/4 tafsirs available | 0 | 0% |
| 3/4 tafsirs available | 1,889 | 100% |
| 2/4 tafsirs available | 0 | 0% |
| 1/4 tafsirs available | 0 | 0% |
| 0/4 tafsirs available | 0 | 0% |

**Note:** All 1,889 mapped ayat have 3 working tafsir options (al-Jalalayn, al-Muyassar, Ibn Kathir). Ma'ariful Quran is unavailable for all.

---

## 4. Discrepancies Between Claimed and Actual Availability

### 4.1 MFD-07 Claims

1. **"7,556 tafsir links"** — Technically correct (7,556 TafsirLink objects created)
2. **"1,889 ayat × 4 sources"** — Technically correct (calculation is accurate)
3. **Implied: all links are ayah-level** — ❌ **INCORRECT**
4. **Implied: all links work** — ❌ **INCORRECT**

### 4.2 Actual Reality

1. **7,556 link objects** — ✅ Correct
2. **Only 3,778 are ayah-level deep links** — 50% of claimed
3. **3,778 are homepage links** — Not disclosed in MFD-07
4. **1,889 are broken** — Not disclosed in MFD-07
5. **Actual working availability: 5,667 / 7,556 (75%)**

### 4.3 Root Cause

The MFD-07 implementation counted all TafsirLink objects equally, without distinguishing:
- Ayah-level deep links (in-app) vs. homepage links (external)
- Working links vs. broken links
- Verified resources vs. unverified resources

This created a misleading availability metric that overstated actual coverage by 33% (7,556 vs. 5,667 working links).

---

## 5. Recommendations

### 5.1 Immediate (Required)

1. ✅ **Mark Ma'ariful Quran as unavailable** — Done in this phase
2. ✅ **Update UI to show unavailability** — Done in this phase
3. ✅ **Correct documentation** — This report provides accurate metrics

### 5.2 Short-Term (Recommended)

4. **Update statistics to distinguish link types**
   - Show "X ayah-level links, Y homepage links" instead of "X total links"
   - Show availability rate (working / total)

5. **Add link quality indicators**
   - Label external links as "Homepage — navigate manually"
   - Consider adding note: "Open publisher site and search for surah/ayah"

6. **Verify external links periodically**
   - Add automated link checking to CI/CD
   - Flag broken links for review

### 5.3 Long-Term (Optional)

7. **Find correct Ma'ariful Quran resource**
   - Research if a verified online edition exists
   - If found, add with proper attribution and licensing

8. **Implement ayah-level deep links for external tafsirs**
   - Research if qtafsir.com supports stable URL patterns
   - If stable, implement ayah-level linking

9. **Add more tafsir sources**
   - Consider adding other reputable tafsirs with stable URLs
   - Ensure proper attribution and licensing

---

## 6. Corrected Availability Statement

**MFD-07 claimed:** "7,556 tafsir links (1,889 ayat × 4 sources)"

**Corrected statement:**

> The tafsir integration provides **7,556 link objects** across 1,889 mapped ayat and 4 tafsir sources. Of these:
> - **3,778 are ayah-level deep links** (2 in-app Arabic tafsirs: al-Jalalayn, al-Muyassar)
> - **1,889 are homepage-level links** (1 external English tafsir: Ibn Kathir)
> - **1,889 are broken** (1 external English tafsir: Ma'ariful Quran — marked unavailable)
>
> **Actual verified availability: 5,667 working links (75% of total).**
> **Ayah-level coverage: 3,778 links (50% of total).**

---

## 7. Files Modified

| File | Change |
|------|--------|
| `src/lib/quran/sources.ts` | Added `available?: boolean` field; marked `tafsir-ma(arif)` as unavailable |
| `src/lib/taxonomy/topic-tafsir-data.ts` | Updated `buildTafsirLink` to check `available` field |
| `src/components/taxonomy/topic-tafsir-viewer.tsx` | Updated UI to show "Unavailable" status for broken links |
| `docs/FAHM-MFD-08-TAFSIR-SOURCE-AUDIT.md` | Created (source audit report) |
| `docs/FAHM-MFD-08-TAFSIR-AVAILABILITY.md` | Created (this report) |

---

## 8. Conclusion

The tafsir availability is **75% working** (5,667 / 7,556 links), with **50% ayah-level coverage** (3,778 / 7,556 links). The MFD-07 claim of "7,556 tafsir links" was technically correct but misleading, as it did not distinguish link types or verify availability.

**Critical fix applied:** Ma'ariful Quran link marked as unavailable. UI updated to show unavailability status.

**Status:** Availability report complete. Metrics corrected. Broken link resolved.

---

**End of report.**
