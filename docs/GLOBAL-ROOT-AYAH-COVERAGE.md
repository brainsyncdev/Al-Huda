# Global Root-Ayah Coverage

**Date:** 2026-11-10  
**Status:** ✅ Verified by independent audit  
**Authoritative count:** 6,205 unique ayat  

## Executive Summary

This document reports the authoritative global unique ayah count across all activated Quranic roots. The count has been independently verified by the `scripts/audit-global-root-ayah-coverage.mjs` audit script.

**Authoritative global unique ayah count: 6,205**

## Key Distinction

There are two ways to count ayat covered by roots:

### 1. Global Union Count (Authoritative)

**Count: 6,205 unique ayat**

Each surah:ayah pair is counted ONCE, even if multiple roots occur in it.

**Example:** Ayah 2:255 (Ayat al-Kursi) contains words from roots علم, كبر, رحم, etc. When counting globally, it's counted once.

This is the authoritative count of unique ayat covered by at least one activated root.

### 2. Per-Root Sum

**Count: 39,720**

Each ayah is counted once for each root it contains. This allows duplicates.

**Example:** Ayah 2:255 is counted once for علم, once for كبر, once for رحم, etc.

This sum exceeds the global count because ayat can appear in multiple roots. This is expected and correct.

## Why the Difference?

Many ayat contain words from multiple roots. For example:

- Ayah 2:255 (Ayat al-Kursi) contains words from roots:
  - علم (knowledge)
  - كبر (greatness)
  - رحم (mercy)
  - And others

When counting globally (union), this ayah is counted once.
When summing per-root, this ayah is counted once for each root.

## Verified Metrics

| Metric | Count |
|---|---:|
| Global unique ayat (union) | 6,205 |
| Sum of per-root distinct ayat | 39,720 |
| Total occurrences | 44,550 |
| Populated occurrence files | 1,574 |
| Activated roots | 1,471 |
| Partially activated roots | 103 |
| Needs-review roots | 68 |
| Within-root duplicates | 0 |
| Invalid references | 0 |

## Data Integrity

### Verified by Independent Audit

- **0 within-root duplicates** — No duplicate occurrences within a root
- **0 invalid references** — All surah/ayah references are valid (1-114 surah, 1+ ayah)
- **0 phantom occurrences** — All lemmas are in includedLemmas
- **44,550 total occurrences** — All source-backed
- **1,574 populated files** — All have totalMatches > 0

### Audit Script

The audit script `scripts/audit-global-root-ayah-coverage.mjs` independently verifies:

1. Global unique ayat count (union)
2. Per-root sum of distinct ayat
3. Occurrence integrity (no duplicates, no phantoms)
4. Valid surah/ayah references
5. Status distribution

The script generates a machine-readable report at `data/global-root-ayah-coverage-report.json`.

## How to Verify

Run the audit script:

```bash
node scripts/audit-global-root-ayah-coverage.mjs
```

Expected output:

```
=== Sprint 50: Global Root-Ayah Coverage Audit ===

Loaded registry with 1642 roots

=== 1. Global Unique Ayat (Union) ===

Global unique ayat (union): 6205

=== 2. Per-Root Distinct Ayat (Sum) ===

Sum of per-root distinctAyahCount: 39720

=== 3. Occurrence Integrity ===

Duplicate occurrences within same root: 0
Invalid surah/ayah references: 0
Integrity: ✓ PASS

=== Audit Complete ===

Authoritative global unique ayah count: 6205
```

## Public Statistics Policy

When reporting coverage statistics:

- **Use 6,205** for "unique ayat covered by activated roots"
- **Use 39,720** only when explicitly stating "sum of per-root distinct ayat counts"
- **Never conflate** the two metrics
- **Always clarify** which metric is being reported

## Coverage Disclosure

When displaying root occurrence data, disclose:

- Total source lemmas
- Auto-accepted lemmas
- Needs-review lemmas
- Missing lemma records

Example:

> "Showing source-backed occurrences for the currently activated lemma set. This root has N total lemmas in the source, of which M are auto-accepted and K remain under review."

## Related Documentation

- `docs/SPRINT-49-RECONCILIATION.md` — Sprint 49 data reconciliation
- `docs/POLICY-DECISION-50.md` — Sprint 50 policy decisions
- `docs/SPRINT-50-REPORT.md` — Sprint 50 complete report
- `data/global-root-ayah-coverage-report.json` — Machine-readable audit report

## Conclusion

The authoritative global unique ayah count is **6,205**. This has been independently verified and documented. The per-root sum (39,720) exceeds the global count due to cross-root duplicates, which is expected and correct.
