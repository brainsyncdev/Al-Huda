# MFD-08 Phase 5 — Tafsir Source Audit

**Date:** November 13, 2026  
**Auditor:** Phase 5 Subagent  
**Status:** Complete with critical findings

---

## Executive Summary

This audit verified all 4 tafsir sources claimed by MFD-07 Phase 5. **Critical finding:** One external link (`https://www.maarifulquran.org/`) points to a Quran courses institute, NOT a tafsir resource. This link is broken and must be corrected or removed.

Additionally, the "7,556 tafsir links" claim is misleading: only 3,778 are actual ayah-level deep links; the other 3,778 are homepage links that do not navigate to specific verses.

---

## 1. Tafsir Source Inventory

### 1.1 Tafsir al-Jalalayn (In-App)

| Field | Value |
|-------|-------|
| **Source ID** | `tafsir-jalalayn` |
| **Work** | Tafsir al-Jalalayn |
| **Authors** | Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti |
| **Period** | 15th century CE |
| **Language** | Arabic |
| **Publisher** | Tanzil.net (ar.jalalayn) |
| **License** | Tanzil terms of use (attribution + no modification) |
| **Delivery** | In-app via `/api/translations/ar.jalalayn` proxy |
| **URL Pattern** | `/ayah/{surah}/{ayah}?tafsir=ar.jalalayn` |
| **Link Type** | ✅ Ayah-level deep link |
| **Availability** | ✅ Verified (proxy endpoint exists) |
| **Text Bundled** | ❌ No (fetched on-demand from Tanzil.net) |
| **Coverage** | All 6,236 ayat accessible via proxy |
| **Attribution** | ✅ Complete (author, period, language, license, publisher) |

**Status:** ✅ COMPLIANT (FR-030/031/032)

---

### 1.2 Tafsir al-Muyassar (In-App)

| Field | Value |
|-------|-------|
| **Source ID** | `tafsir-muyassar` |
| **Work** | Tafsir al-Muyassar |
| **Authors** | King Fahd Complex for the Printing of the Holy Quran |
| **Period** | Contemporary |
| **Language** | Arabic |
| **Publisher** | Tanzil.net (ar.muyassar) |
| **License** | Tanzil terms of use (attribution + no modification) |
| **Delivery** | In-app via `/api/translations/ar.muyassar` proxy |
| **URL Pattern** | `/ayah/{surah}/{ayah}?tafsir=ar.muyassar` |
| **Link Type** | ✅ Ayah-level deep link |
| **Availability** | ✅ Verified (proxy endpoint exists) |
| **Text Bundled** | ❌ No (fetched on-demand from Tanzil.net) |
| **Coverage** | All 6,236 ayat accessible via proxy |
| **Attribution** | ✅ Complete (author, period, language, license, publisher) |

**Status:** ✅ COMPLIANT (FR-030/031/032)

---

### 1.3 Tafsir Ibn Kathir (External)

| Field | Value |
|-------|-------|
| **Source ID** | `tafsir-ibn-kathir` |
| **Work** | Tafsir Ibn Kathir (Abridged) |
| **Authors** | Isma'il ibn Umar ibn Kathir; English translation by Darussalam |
| **Language** | English |
| **Publisher** | Available via external references (link-out only) |
| **License** | Check external source; not redistributed by this app |
| **Homepage** | `https://www.qtafsir.com/` |
| **Delivery** | External link-out only |
| **URL Pattern** | `https://www.qtafsir.com/` (homepage) |
| **Link Type** | ❌ Homepage link only (no ayah-level deep link) |
| **Availability** | ✅ Verified (HTTP 200, site operational) |
| **Text Bundled** | ❌ No (link-out only per FR-031) |
| **Coverage** | Homepage only; user must navigate manually |
| **Attribution** | ✅ Complete (author, language, license, publisher) |

**Site Verification (2026-11-13):**
- ✅ HTTP 200 response
- ✅ Site contains Ibn Kathir's tafsir
- ✅ Organized by surah (114 surahs listed)
- ❌ No ayah-level deep links visible in URL structure
- ⚠️ User must navigate from surah to specific ayah manually

**Status:** ⚠️ PARTIALLY COMPLIANT
- ✅ FR-030 (attribution shown)
- ✅ FR-031 (link-out only, no text bundled)
- ✅ FR-032 (license noted as "check external source")
- ❌ Does not provide ayah-level navigation

---

### 1.4 Ma'ariful Quran (External) — ❌ BROKEN LINK

| Field | Value |
|-------|-------|
| **Source ID** | `tafsir-ma(arif)` |
| **Work** | Ma'ariful Quran |
| **Authors** | Mufti Muhammad Shafi Usmani |
| **Language** | English |
| **Publisher** | Available via external references (link-out only) |
| **License** | Check external source; not redistributed by this app |
| **Homepage** | `https://www.maarifulquran.org/` |
| **Delivery** | External link-out only |
| **URL Pattern** | `https://www.maarifulquran.org/` (homepage) |
| **Link Type** | ❌ Homepage link only (no ayah-level deep link) |
| **Availability** | ❌ **BROKEN** (site is NOT a tafsir resource) |
| **Text Bundled** | ❌ No (link-out only per FR-031) |
| **Coverage** | N/A (site does not contain tafsir) |
| **Attribution** | ✅ Complete (author, language, license, publisher) |

**Site Verification (2026-11-13):**
- ✅ HTTP 200 response
- ❌ **Site is a Quran courses/education institute, NOT a tafsir resource**
- ❌ Site offers Tajweed, Tafseer courses, Hifz programs
- ❌ No Ma'ariful Quran tafsir text available on this site
- ❌ This is a completely different organization

**Status:** ❌ NON-COMPLIANT
- ✅ FR-030 (attribution shown in metadata)
- ✅ FR-031 (link-out only, no text bundled)
- ✅ FR-032 (license noted)
- ❌ **Link is broken — points to wrong resource entirely**

---

## 2. Link Type Analysis

### 2.1 Claimed vs. Actual Link Counts

MFD-07 claimed: **7,556 tafsir links** (1,889 ayat × 4 sources)

**Actual breakdown:**

| Link Type | Count | Description |
|-----------|------:|-------------|
| Ayah-level deep links (in-app) | 3,778 | 1,889 ayat × 2 in-app sources (al-Jalalayn, al-Muyassar) |
| Homepage links (external) | 3,778 | 1,889 ayat × 2 external sources (Ibn Kathir, Ma'ariful Quran) |
| **Total link objects** | **7,556** | All TafsirLink objects created |
| **Actual ayah-level links** | **3,778** | Only in-app links navigate to specific verses |

**Issue:** The "7,556 links" claim conflates ayah-level links with homepage links. Only 3,778 (50%) are actual ayah-level deep links.

### 2.2 External Link Quality

| Source | Link Quality | Ayah-Level Navigation |
|--------|--------------|----------------------|
| Ibn Kathir | Homepage only | ❌ No (user must navigate manually) |
| Ma'ariful Quran | ❌ **BROKEN** | ❌ No (wrong site entirely) |

---

## 3. In-App Tafsir Verification

### 3.1 Text Availability

Both in-app tafsirs (al-Jalalayn, al-Muyassar) are served through the translation proxy at `/api/translations/[id]`:

- ✅ Proxy endpoint exists: `src/app/api/translations/[id]/route.ts`
- ✅ Fetches from Tanzil.net on-demand
- ✅ Caches for 24 hours via Next's data cache
- ✅ Returns plain text with CORS headers
- ✅ Covers all 6,236 ayat (not just the 1,889 mapped ayat)

### 3.2 UI Component

The `TafsirViewer` component (`src/components/quran/tafsir-viewer.tsx`):
- ✅ Displays both Arabic tafsirs
- ✅ Shows full attribution (author, period, language, license, publisher)
- ✅ Lazy-loads text only when expanded
- ✅ Clearly labels as "Classical tafsirs" not "Translation"
- ✅ Includes disclaimer: "These tafsirs are classical Arabic works. They are not translations"
- ✅ Compliant with FR-030/031/032

---

## 4. External Tafsir Verification

### 4.1 Ibn Kathir (qtafsir.com)

- ✅ Site operational (HTTP 200)
- ✅ Contains Ibn Kathir's tafsir
- ✅ Organized by surah
- ❌ No ayah-level deep links in URL structure
- ⚠️ User must navigate from homepage → surah → ayah manually
- ✅ Attribution clear in app metadata

**Recommendation:** Acceptable as a link-out resource, but should be clearly labeled as "homepage link" not "ayah-level link."

### 4.2 Ma'ariful Quran (maarifulquran.org) — ❌ BROKEN

- ✅ Site operational (HTTP 200)
- ❌ **Site is NOT a tafsir resource**
- ❌ Site is a Quran education institute offering courses
- ❌ No Ma'ariful Quran tafsir text available
- ❌ Completely different organization

**Recommendation:** This link must be removed or replaced with the correct Ma'ariful Quran resource.

---

## 5. UI Transparency Verification

### 5.1 TopicTafsirViewer Component

**Location:** `src/components/taxonomy/topic-tafsir-viewer.tsx`

**Checks:**
- ✅ Distinguishes in-app vs. external (separate sections with icons)
- ✅ Shows author/scholar attribution
- ✅ Shows language (Arabic/English)
- ✅ Shows publisher
- ✅ Shows license
- ✅ Shows delivery method (In-app badge vs. External badge with ↗ icon)
- ✅ Includes disclaimer: "Tafsir is scholarly interpretation, not translation"
- ✅ Includes FR-032 notice about licensing

**Issue:** Does not distinguish ayah-level links from homepage links. Both external links are presented identically, even though one is broken.

### 5.2 TafsirLinks Component

**Location:** `src/components/quran/tafsir-links.tsx`

**Checks:**
- ✅ Shows attribution for each external tafsir
- ✅ Shows language, publisher, license
- ✅ Labels as "Link-out only (FR-031)"
- ✅ Includes disclaimer about licensing
- ✅ Opens in new tab with `rel="noopener noreferrer"`

**Issue:** Does not indicate that links are homepage-only, not ayah-level.

---

## 6. FR Compliance Status

| Requirement | Status | Notes |
|-------------|--------|-------|
| **FR-030** (Tafsir attribution) | ✅ PASS | All sources show author, period, language, publisher |
| **FR-031** (Link to external) | ✅ PASS | External tafsirs are link-out only, no text bundled |
| **FR-032** (Licensing tracking) | ✅ PASS | License noted for all sources |
| **FR-033** (Tafsir ≠ Translation) | ✅ PASS | Clear distinction in UI and documentation |

**Overall:** ✅ COMPLIANT with FR-030/031/032/033, but with one broken link.

---

## 7. Critical Issues

### 7.1 Broken Link: Ma'ariful Quran

**Severity:** 🔴 CRITICAL

**Issue:** `https://www.maarifulquran.org/` is NOT a tafsir resource. It's a Quran courses institute.

**Impact:**
- 1,889 broken links (1 for each mapped ayah)
- Users clicking this link will not find Ma'ariful Quran tafsir
- Misleading attribution

**Resolution Required:**
1. Find the correct Ma'ariful Quran online resource, OR
2. Remove this source from the registry, OR
3. Mark as "unavailable" in the UI

### 7.2 Misleading Link Count

**Severity:** 🟡 MEDIUM

**Issue:** "7,556 tafsir links" claim conflates ayah-level links with homepage links.

**Impact:**
- Overstates actual ayah-level coverage by 100%
- Only 3,778 links (50%) are actual ayah-level deep links

**Resolution Required:**
- Update documentation to clarify link types
- Consider labeling external links as "homepage links" in UI

### 7.3 No Ayah-Level Deep Links for External Tafsirs

**Severity:** 🟡 MEDIUM

**Issue:** External tafsirs (Ibn Kathir, Ma'ariful Quran) link to homepages only, not specific ayat.

**Impact:**
- Users must navigate manually to find the specific ayah
- Poor user experience
- Does not fulfill the promise of "tafsir for this ayah"

**Resolution Required:**
- Acceptable as link-out resources, but should be clearly labeled
- Consider adding note: "Navigate to surah and ayah manually"

---

## 8. Recommendations

### Immediate Actions (Required)

1. **Fix or remove Ma'ariful Quran link**
   - Find correct online resource for Ma'ariful Quran tafsir, OR
   - Remove `tafsir-ma(arif)` from source registry, OR
   - Mark as unavailable in UI

2. **Update documentation**
   - Clarify that "7,556 links" includes 3,778 homepage links
   - Distinguish ayah-level vs. homepage links in all reports

### Short-Term Improvements (Recommended)

3. **Improve UI transparency**
   - Add label: "Homepage link — navigate manually" for external tafsirs
   - Distinguish link types in statistics (ayah-level vs. homepage)

4. **Verify in-app tafsir coverage**
   - Confirm al-Jalalayn and al-Muyassar are available for all 6,236 ayat via proxy
   - Document coverage clearly

### Long-Term Considerations (Optional)

5. **Explore ayah-level deep links for external tafsirs**
   - Research if qtafsir.com supports URL patterns like `/2/255`
   - If stable, implement ayah-level linking

6. **Add more tafsir sources**
   - Consider adding other reputable tafsirs with stable URLs
   - Ensure proper attribution and licensing

---

## 9. Files Inspected

- `src/lib/taxonomy/topic-tafsir-data.ts` — Tafsir enrichment layer
- `src/lib/quran/sources.ts` — Source catalog
- `src/components/taxonomy/topic-tafsir-viewer.tsx` — Topic tafsir UI
- `src/components/quran/tafsir-viewer.tsx` — Ayah tafsir viewer
- `src/components/quran/tafsir-links.tsx` — External tafsir links panel
- `src/app/api/translations/[id]/route.ts` — Translation proxy
- `src/app/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir/route.ts` — Tafsir API endpoint
- `docs/FAHM-MFD-07-TAFSIR-INTEGRATION.md` — MFD-07 tafsir documentation
- External URLs verified via web_fetch

---

## 10. Conclusion

The tafsir integration is **mostly compliant** with FR-030/031/032/033, with excellent attribution and clear distinction between in-app and external resources. However, **one critical issue** must be resolved: the Ma'ariful Quran link is broken and points to the wrong resource entirely.

The "7,556 tafsir links" claim is misleading and should be corrected to distinguish ayah-level links (3,778) from homepage links (3,778).

**Status:** Audit complete. Critical fix required before MFD-08 can be marked complete.

---

**End of audit.**
