# MFD-08 Entity Count Report

**Date:** November 12, 2026  
**Source:** Canonical JSON files + validation scripts  

## Canonical Entity Counts (Verified from JSON)

| Entity Type | Count | Source File |
|-------------|------:|-------------|
| Domains | 20 | `data/taxonomy/domains.json` |
| Dimensions | 103 | `data/taxonomy/dimensions.json` |
| Subdimensions | 25 | `data/taxonomy/subdimensions.json` |
| Topics | 184 | `data/taxonomy/topics.json` |
| Relationships | 150 | `data/taxonomy/relationships.json` |
| Topic-Ayah Mappings | 789 | `data/taxonomy/topic-ayah-mappings.json` |

## Graph Node Counts (from builder)

| Node Kind | Count |
|-----------|------:|
| domain | 20 |
| dimension | 103 |
| subdimension | 25 |
| topic | 184 |
| **Total** | **332** |

## Reconciliation

| Metric | Canonical JSON | Graph Builder | Match? |
|--------|---------------:|--------------:|--------|
| Domains | 20 | 20 | ✅ |
| Dimensions | 103 | 103 | ✅ |
| Subdimensions | 25 | 25 | ✅ |
| Topics | 184 | 184 | ✅ |
| **Total** | **332** | **332** | ✅ |

No filtering or exclusion. Every canonical entity becomes a graph node.

## Discrepancy History

| Phase | Reported Topics | Actual Topics | Notes |
|-------|----------------:|--------------:|-------|
| MFD-07 baseline | 176 | 176 | Verified |
| MFD-07 completion | 182 | 176 | Documentation error — 6 topics claimed but not added |
| MFD-08 Phase 2 | 184 | 184 | 8 topics added (6 from MFD-07 + 2 discovered) |

## Mapping Coverage

| Metric | Count |
|--------|------:|
| Topics with ayah mappings | 176 |
| Topics without mappings | 8 |
| Total mapping records | 789 |
| Expanded ayat (sum of ranges) | 1,889 |
| Unique ayat (deduplicated) | 1,550 |
| Surahs referenced | 95 of 114 |

### Unmapped Topics (8)

These were added in Phase 2 to resolve broken relationship references.
They are valid taxonomy entities awaiting future ayah mapping:

1. `wealth-ownership` — Wealth Ownership
2. `evidence-standards` — Evidence Standards
3. `public-accountability` — Public Accountability
4. `environmental-corruption` — Environmental Corruption
5. `day-of-judgment` — Day of Judgment
6. `non-combatant-protection` — Non-Combatant Protection
7. `interest-free-finance` — Interest-Free Finance
8. `covenants-ahd` — Covenants (Ahd)

## Quran Dataset

| Metric | Count |
|--------|------:|
| Surahs | 114 |
| Total ayat | 6,236 |
| Source | `quran-json@3.1.2` (CC-BY-4.0) |

## Arabic Roots

| Metric | Count |
|--------|------:|
| Total roots | 1,642 |
| Activated | 1,471 |
| Partially activated | 103 |
| Needs review | 68 |
| Source | `qul-morphology-v1` |

## Translation Sources

| Metric | Count |
|--------|------:|
| Source records | 13 |
| Bundled translations | 1 (Saheeh International) |
| Proxy translations | 115 (via Tanzil) |
| Total translations | 116 |
| Languages | 44 |

## Tafsir Sources

| Source | Status | Link Type |
|--------|--------|-----------|
| al-Jalalayn | ✅ Working | Ayah-level deep link |
| al-Muyassar | ✅ Working | Ayah-level deep link |
| Ibn Kathir | ⚠️ Working | Homepage link only |
| Ma'ariful Quran | ❌ Unavailable | Broken link (marked unavailable) |

## Validation Status

All counts verified by:
- `scripts/validate-taxonomy.mjs` — PASSED
- `scripts/validate-ayah-mappings.mjs` — PASSED
- `scripts/validate-roots.mjs` — PASSED
- `scripts/validate-graph.mjs` — PASSED
- `scripts/validate-quran-data.mjs` — PASSED (0 issues)
- `scripts/validate-source-licenses.mjs` — PASSED (0 issues)

**Status:** ✅ All entity counts reconciled and validated.
