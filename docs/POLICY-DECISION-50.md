# Policy Decision 50 — Quran Reading Experience & Root-Aware Navigation

**Policy Version:** 1.0.0  
**Date:** 2026-11-10  
**Status:** Enforced  

## 1. Purpose

Sprint 50 builds a polished Quran reading experience that connects root morphology discovery to the Quran reading interface. Users can now discover a root, explore its occurrences, read the complete ayah in context, navigate between occurrences of the same root, and return to the root discovery page.

## 2. Scope Constraints

This sprint is strictly a **user-experience and integration sprint**. It does NOT:

- Expand the morphology dataset
- Change the automated acceptance policy
- Enable AI religious answers
- Modify Quran text, translations, or Tafsir
- Alter curated topics or dimensions
- Introduce cloud sync or analytics

## 3. Root Context Preservation

When a user navigates from root discovery to an ayah, the root context is preserved via URL query parameters:

```
/ayah/[surah]/[ayah]?from=root&root=[slug]
```

The ayah reader displays:
- Complete Quranic Arabic text (authoritative, unmodified)
- Translation (existing, unmodified)
- Root context panel showing:
  - Arabic root
  - Transliteration
  - Matching lemma
  - Occurrence index (e.g., "Occurrence 5 of 103")
  - Navigation to previous/next occurrence of the same root
  - Link back to root discovery page

## 4. Quran Navigation

The ayah reader provides:
- Previous ayah (with surah boundary handling)
- Next ayah (with surah boundary handling)
- Surah selection
- Direct ayah navigation
- Return to originating root page when applicable

Boundary behavior:
- Previous ayah on first ayah of surah → last ayah of preceding surah
- Next ayah on last ayah of surah → first ayah of following surah
- First ayah of Quran (1:1) → no previous
- Last ayah of Quran (114:6) → no next

## 5. Root Occurrence Navigation

Distinct from Quran ayah navigation, root occurrence navigation allows users to move between occurrences of the same root:

- Previous occurrence of root X
- Next occurrence of root X
- Preserves root context across navigation
- Does NOT mix with ordinary Quran previous/next ayah navigation

## 6. Global Ayah Coverage

**Authoritative count: 6,205 unique ayat**

This is the global union count — each surah:ayah pair counted once, even if multiple roots occur in it.

The per-root sum (39,720) exceeds the global count because ayat can appear in multiple roots. This is expected and correct.

## 7. Data Integrity

- No Quran text is modified
- No translations are modified
- No Tafsir is modified
- No morphology source data is modified
- All occurrence data is source-backed
- No duplicate occurrences within a root
- No phantom occurrences (all lemmas are in includedLemmas)
- All surah/ayah references are valid

## 8. SEO and Accessibility

- Each ayah page has unique title and description
- Arabic content renders correctly with `lang="ar" dir="rtl"`
- Semantic headings and landmarks
- Keyboard navigation supported
- Accessible names for icon-only controls
- Screen reader friendly

## 9. Performance

- Only required ayah and surrounding context loaded
- Morphology files loaded server-side only
- Root occurrence navigation is server-backed
- Client-side JavaScript minimal
- Static generation preserved where supported

## 10. Results

- **6,205 unique ayat** covered by activated roots (authoritative)
- **39,720** sum of per-root distinct ayat (allows duplicates)
- **44,550** total occurrences
- **1,574** populated occurrence files
- **1,471** activated roots
- **103** partially activated roots
- **0** within-root duplicates
- **0** invalid references
- **All quality gates pass**

## 11. Quality Gates

All quality gates pass:
- `pnpm lint` — 0 errors
- `pnpm typecheck` — 0 errors
- `pnpm vitest run` — 969+ tests pass
- `pnpm build` — production build successful
- `node scripts/audit-global-root-ayah-coverage.mjs` — all checks pass
- `node scripts/audit-sprint-49-root-reconciliation.mjs` — all checks pass
- `node scripts/audit-full-morphology-activation.mjs` — 0 failures, 0 warnings
- `node scripts/audit-root-index-integrity.mjs` — all invariants hold

## 12. Preserved Constraints

- Policy B v2.0.0 — intact
- `AI_ANSWER_FEATURE_ENABLED = false` — intact
- ROOT_ALLOWLIST (10 manual roots) — preserved
- Sprint 47 AUTOMATED_MORPHOLOGY_REVIEW_POLICY 1.0.0 — intact
- All 11 curated topics — unchanged
- Quran text, translations, Tafsir, citations — untouched
- Local-first behavior — preserved
- No cloud sync, analytics, or tracking
