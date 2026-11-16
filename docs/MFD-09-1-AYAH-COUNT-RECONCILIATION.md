# MFD-09.1 Ayah Count Reconciliation

**Generated:** 2026-11-16T04:44:31.220Z

## Independent Count Results

All counts calculated from actual ranges (ayahEnd - ayahStart + 1).

| Metric | Value |
|--------|-------|
| Total mapping records | 789 |
| Total expanded Ayah occurrences | 1886 |
| Unique Surah-Ayah combinations | 1550 |
| Ayat mapped to multiple topics | 236 |
| Ayat mapped to 3+ topics | 74 |
| Maximum overlap for single Ayah | 6 |
| Invalid ranges | 0 |
| Duplicate mapping records | 0 |

## Historical Comparison

| Metric | Historical Value | Current Value | Match? |
|--------|-----------------|---------------|--------|
| Records | 789 | 789 | ✓ |
| Expanded | 1886 | 1886 | ✓ |
| Unique | 1550 | 1550 | ✓ |

## Invalid Ranges Detail

No invalid ranges detected.

## Duplicate Mappings Detail

No duplicate mappings detected.

## Methodology

- Expanded count: Sum of (ayahEnd - ayahStart + 1) for all valid ranges
- Unique count: Distinct "surahNumber:ayahNumber" pairs across all mappings
- Overlap: Count of distinct topics per unique ayah reference
- Validation against quran.json total_verses per surah
