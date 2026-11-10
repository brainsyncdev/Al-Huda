# Policy Decision 49 — Root Discovery Experience

**Policy Version:** 1.0.0  
**Date:** 2026-11-10  
**Status:** Enforced  

## 1. Purpose

Sprint 49 transforms the existing Quranic root morphology infrastructure into a complete, intuitive, user-facing discovery experience. The goal is to make the 1,574 auto-activated roots from Sprint 48 genuinely useful to ordinary Quran readers.

## 2. Scope Constraints

This sprint is strictly a **user-experience sprint**. It does NOT:

- Expand the morphology dataset
- Change the automated acceptance policy (Sprint 47 policy 1.0.0 remains)
- Enable AI religious answers (`AI_ANSWER_FEATURE_ENABLED` remains `false`)
- Modify the 11 curated topic memberships
- Change the 10 life dimensions or 14-domain catalog
- Alter any Quranic text, translations, tafsir, or citations

## 3. Root Status Taxonomy

Four user-facing statuses are defined:

| Status | Meaning | Display |
|---|---|---|
| **Activated** | All lemmas auto-accepted, occurrence index populated | Green check |
| **Partially available** | Some lemmas auto-accepted, some under review | Amber check |
| **Under review** | All lemmas need human investigation | Amber clock |
| **Not activated** | No auto-accepted lemmas (source gaps) | Gray warning |

Internal terms like `auto-accepted`, `needs-review`, `rejected` are NOT displayed to users. No root is labeled as "scholarly verified" or "scholarly approved."

## 4. Morphology vs. Theme Separation

A root represents a **morphological relationship**, not a thematic classification.

- A root's occurrence list shows verses where forms of that root appear.
- It is NOT a claim that those verses are "about" a particular theme.
- Topic membership is independently curated.
- Root-to-topic links are navigation-only.

## 5. Search Policy

Search supports:

- Arabic root (partial match)
- Transliteration (partial, case-insensitive)
- Slug (partial, case-insensitive)

Search does NOT modify displayed Arabic text. Arabic normalization is for comparison only.

## 6. Coverage Disclosure

Every root detail page must disclose:

- Total source lemmas
- Auto-accepted lemmas
- Needs-review lemmas
- Missing lemma records

Sample disclosure:
> "Showing source-backed occurrences for the currently activated lemma set. This root has N total lemmas in the source, of which M are auto-accepted and K remain under review."

## 7. SEO Policy

- Each root detail page has unique title and description.
- No misleading thematic descriptions (e.g., "All verses about patience").
- Empty or unactivated roots follow the existing no-index policy.
- Canonical URLs are preserved.

## 8. Quran Navigation

Every occurrence links to `/surah/[surah]/[ayah]`. The `?from=root` query parameter preserves the return path. Existing Quran routes remain unchanged.

## 9. Performance

- The morphology index is loaded server-side only.
- Occurrence files are loaded on demand (not all 1,574 at once).
- Client bundles remain small.
- Static generation is preserved where supported.

## 10. Results

- **1,642 roots** in registry
- **1,574 roots activated** (populated occurrence index)
- **103 roots partially activated**
- **68 roots under review**
- **0 roots with status `discovered`** (all have at least one lemma outcome)
- **44,550 occurrences** across **39,720 distinct ayat**
- **4,350 lemmas** auto-accepted
- **359 lemmas** under review
- **0 lemmas** rejected

## 11. Quality Gates

All quality gates pass:
- `pnpm lint` — 0 errors
- `pnpm typecheck` — 0 errors
- `pnpm vitest run` — 969 tests pass (54 files)
- `pnpm build` — production build successful
- Independent audit — 0 failures, 0 warnings

## 12. Preserved Constraints

- Policy B v2.0.0 — intact
- `AI_ANSWER_FEATURE_ENABLED = false` — intact
- ROOT_ALLOWLIST (10 manual roots) — preserved
- Sprint 47 AUTOMATED_MORPHOLOGY_REVIEW_POLICY 1.0.0 — intact
- All 11 curated topics — unchanged
- Quran text, translations, tafsir, citations — untouched
