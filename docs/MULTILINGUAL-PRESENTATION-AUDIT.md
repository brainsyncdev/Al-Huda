# Multilingual Presentation Audit

**Sprint 53, Workstream E**  
**Date:** November 11, 2026  
**Status:** ✅ PASSED

## Executive Summary

This audit verified the presentation of Arabic, Urdu, and English content across the Quran Al Huda application. The audit confirmed that all Arabic text renders with correct RTL (right-to-left) directionality and language attributes. Urdu translation infrastructure is in place but no Urdu titles have been added to the content yet.

## Audit Scope

### Components Audited
1. **Explore Topics Index** (`src/app/explore/topics/page.tsx`)
2. **Topic Detail** (`src/app/topics/[slug]/page.tsx`)
3. **Study Journeys Index** (`src/app/study-journeys/page.tsx`)
4. **Study Journey Detail** (`src/app/study-journeys/[slug]/page.tsx`)

### Data Sources Audited
1. **Topics Data** (`src/lib/topics/data.ts`) - 18 topics
2. **Study Journeys Data** (`src/lib/study-journeys/data.ts`) - 4 journeys

## RTL/LTR Rendering Approach

### Arabic Content (lang="ar" dir="rtl")

All Arabic text elements now include:
- `lang="ar"` - BCP 47 language tag for Arabic
- `dir="rtl"` - Right-to-left text direction
- `className="arabic-display"` - Typography class for proper Arabic font rendering

**Example:**
```tsx
<span className="arabic-display text-2xl text-gold" lang="ar" dir="rtl">
  {topic.arabicTitle}
</span>
```

### English Content (LTR - Default)

English content uses the default left-to-right directionality. No explicit `dir="ltr"` is needed as this is the browser default for English text.

### Urdu Content (lang="ur" dir="rtl")

Urdu content, when present, should use:
- `lang="ur"` - BCP 47 language tag for Urdu
- `dir="rtl"` - Right-to-left text direction
- Same typography classes as Arabic for consistent Nastaliq/Naskh rendering

**Note:** Urdu translations are not yet implemented in the content data.

## Current State of Multilingual Support

### Topics with Verified Urdu Titles

**None** - The `urduTitle` field exists in the data structure but no Urdu translations have been added yet.

### Topics Missing Urdu Titles

All 18 topics are missing Urdu translations:

1. `patience` - الصبر
2. `gratitude` - الشكر
3. `trust-in-god` - التوكل
4. `mercy-and-forgiveness` - الرحمة والمغفرة
5. `remembrance` - الذكر
6. `giving` - الإنفاق
7. `justice` - العدل
8. `parents-and-family` - الوالدان والأسرة
9. `hardship-and-ease` - العسر واليسر
10. `knowledge-and-reflection` - العلم والتدبر
11. `the-hereafter` - الآخرة
12. `tawheed` - التوحيد
13. `prayer` - الصلاة
14. `supplication` - الدعاء
15. `god-consciousness` - التقوى
16. `repentance` - التوبة
17. `prophets` - الأنبياء
18. `good-character` - حسن الخلق

### Study Journeys with Verified Urdu Titles

**None** - The `urduTitle` field does not exist in the study journeys data structure.

### Study Journeys Missing Urdu Titles

All 4 study journeys are missing Urdu translations:

1. `understanding-tawheed` - فهم التوحيد
2. `patience-through-difficulties` - الصبر على المصائب
3. `gratitude-and-contentment` - الشكر والقناعة
4. `building-relationship-with-allah` - بناء العلاقة مع الله

## Issues Found and Fixed

### Issue 1: Missing dir="rtl" in Explore Topics Index
**File:** `src/app/explore/topics/page.tsx`  
**Problem:** Arabic title element had `lang="ar"` but was missing `dir="rtl"`  
**Fix:** Added `dir="rtl"` attribute to the Arabic title span  
**Status:** ✅ Fixed

### Issue 2: Missing dir="rtl" in Study Journeys Index
**File:** `src/app/study-journeys/page.tsx`  
**Problem:** Arabic title element had `lang="ar"` but was missing `dir="rtl"`  
**Fix:** Added `dir="rtl"` attribute to the Arabic title span  
**Status:** ✅ Fixed

### Issue 3: Missing dir="rtl" in Study Journey Detail
**File:** `src/app/study-journeys/[slug]/page.tsx`  
**Problem:** Arabic title element had `lang="ar"` but was missing `dir="rtl"`  
**Fix:** Added `dir="rtl"` attribute to the Arabic title span  
**Status:** ✅ Fixed

## Typography Classes

The application uses the following typography classes for multilingual content:

- **`arabic-display`** - Applied to all Arabic text for proper font rendering and sizing
- **`text-gold`** - Color treatment for Arabic titles to distinguish them visually
- **`text-2xl` / `text-3xl` / `text-4xl`** - Size variations based on context

These classes ensure Arabic text renders with appropriate fonts and visual hierarchy.

## Responsive Layout Considerations

All multilingual content is rendered within responsive layouts:

- **Mobile:** Arabic titles stack vertically with English titles on smaller screens
- **Tablet:** Side-by-side layout with proper spacing
- **Desktop:** Full side-by-side layout with adequate whitespace

The flexbox-based layouts automatically handle RTL/LTR mixing without requiring additional CSS.

## Data Structure Gaps

### Topics Data Structure

The `Topic` interface in `src/lib/topics/data.ts` includes:
- ✅ `language: string` - BCP 47 tag for editorial content
- ✅ `title: string` - English title
- ✅ `arabicTitle: string` - Arabic title
- ❌ `urduTitle?: string` - **Field exists but not populated**

**Recommendation:** Add Urdu translations to topics data when available from translators.

### Study Journeys Data Structure

The `StudyJourney` interface in `src/lib/study-journeys/types.ts` includes:
- ✅ `language: "en"` - Currently hardcoded to English
- ✅ `title: string` - English title
- ✅ `arabicTitle: string` - Arabic title
- ❌ `urduTitle?: string` - **Field does not exist**

**Recommendation:** Add optional `urduTitle` field to the `StudyJourney` interface and populate when translations are available.

## Audit Script

The audit script `scripts/audit-multilingual-presentation.mjs` performs the following checks:

1. **Topics Data Audit**
   - Counts total topics
   - Checks for `urduTitle` field existence
   - Lists topics with/without Urdu titles

2. **Study Journeys Data Audit**
   - Counts total journeys
   - Checks for `urduTitle` field existence
   - Lists journeys with/without Urdu titles

3. **Component RTL/LTR Audit**
   - Verifies all Arabic elements have `lang="ar"` and `dir="rtl"`
   - Verifies all Urdu elements (when present) have `lang="ur"` and `dir="rtl"`
   - Reports any missing attributes

**Exit Codes:**
- `0` - Audit passed (all RTL attributes correct)
- `1` - Audit failed (RTL attributes missing or incorrect)

**Run the audit:**
```bash
node scripts/audit-multilingual-presentation.mjs
```

## Constraints Respected

This audit adhered to the following constraints:

✅ **Preserved Arabic text exactly as stored** - No modifications to existing Arabic content  
✅ **Did not generate missing translations** - Urdu titles were not auto-generated  
✅ **Did not claim full multilingual coverage** - Documentation clearly states Urdu is not yet implemented  
✅ **Correct RTL rendering for Arabic** - All Arabic elements now have proper `dir="rtl"`  
✅ **English LTR rendering** - Default behavior maintained for English content  
✅ **Responsive layouts** - All fixes maintain responsive design across devices

## Recommendations

### Short-term
1. **Add Urdu translations** - Work with translators to add Urdu titles to all topics and journeys
2. **Update data structure** - Add `urduTitle` field to `StudyJourney` interface
3. **Expand audit coverage** - Include additional pages (ayah pages, surah pages, etc.)

### Long-term
1. **Implement language switcher** - Allow users to view content in their preferred language
2. **Add more languages** - Consider Turkish, Indonesian, French, and other major Muslim languages
3. **Automated translation workflow** - Build tools to manage translation submissions and reviews
4. **Scholarly review integration** - Ensure translations are reviewed by qualified scholars

## Conclusion

The multilingual presentation audit confirms that all Arabic content now renders with correct RTL directionality and language attributes. The infrastructure for Urdu support is partially in place (topics data structure) but no Urdu translations have been added yet. The study journeys data structure needs to be extended to support Urdu titles.

All identified rendering issues have been fixed, and the audit script now passes successfully. The application is ready for Urdu translation work when resources are available.

---

**Audit Completed:** November 11, 2026  
**Next Review:** When Urdu translations are added
