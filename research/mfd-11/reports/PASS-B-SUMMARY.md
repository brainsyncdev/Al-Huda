# MFD-11 Pass B — Cross-Qur'anic Synthesis Summary

**Generated:** 2026-11-19
**Status:** Complete (pending scholarly review)
**HEAD:** See git log for latest commit

## Objective

Cross-Qur'anic synthesis, deduplication, and hierarchy proposal across the 2,918
candidates produced by Pass A. Compare against existing 184-topic taxonomy.
Identify gaps, consolidate duplicates, and propose a structured topic hierarchy.

## Key Metrics

| Metric | Value |
|---|---|
| Total candidates analyzed | 2,918 |
| Unique normalized labels | 2,504 |
| Existing taxonomy topics | 184 |
| Topics validated by extraction | 70 (38.0%) |
| Extraction gaps flagged | 45 (24.5%) |
| Partial coverage topics | 34 (18.5%) |
| Scholarly review required | 35 (19.0%) |
| Thematic hubs (≥3 candidates) | 50 |
| Candidates with no existing overlap | 2,710 (92.9%) |

## Deliverables Produced

### 1. Candidate Index (`synthesis/candidate-index.json`)
Consolidated index of all 2,918 candidates with normalized labels, evidence keys,
and existing topic overlaps. Identifies 188 exact duplicate labels (batch generator
artifacts from short surahs) and 32 hot verses cited by ≥5 candidates each.

### 2. Taxonomy Comparison (`synthesis/taxonomy-comparison.json`)
Maps all candidates against the existing 184-topic taxonomy. Domain-level coverage
breakdown shows `law-obligations` (83.3% covered) and `eschatology-afterlife` (66.7%)
as strongest domains; `governance-political-authority`, `war-peace-conflict`,
`health-medicine`, `arts-beauty-aesthetics`, and `work-vocation` at 0% coverage.

### 3. Topic Clusters (`synthesis/topic-clusters.json`)
Semantic clustering attempt using label similarity and evidence-key co-occurrence.
Result: 2,504 clusters (mostly singletons) due to batch-generated placeholder labels.
Confirms that meaningful clustering requires re-extraction with descriptive labels
rather than verse-reference placeholders.

### 4. Synthesis Report (`synthesis/passb-synthesis-report.json`)
Comprehensive report with four sections:
- **Existing Topic Coverage**: Per-topic candidate counts and evidence keys
- **Thematic Hubs**: Top 50 verses cited by ≥3 candidates
- **Surah Thematics**: Per-surah candidate density and label quality assessment
- **New Topic Proposals**: 50 hub-based proposals (all placeholder artifacts)

### 5. Gap Analysis (`reports/gap-analysis.json`)
Classifies 114 uncovered existing topics using keyword matching against full
corpus translations:
- **45 extraction gaps**: Strong Qur'anic evidence exists but wasn't surfaced.
  Top gaps: `khalifah-vicegerent` (218 verses), `diversity-divine-sign` (182),
  `angelic-duties` (106), `ikhlas-sincerity` (106), `child-education` (95).
- **34 partial evidence**: Some Qur'anic grounding but limited coverage.
- **35 editorial or no evidence**: May be taxonomic constructs without direct
  Quranic basis, requiring scholarly determination.

### 6. Proposed Hierarchy (`synthesis/proposed-hierarchy.json`)
Full domain → dimension → topic tree with disposition classification:
- **validated-by-extraction** (70): Covered by Pass A candidates
- **needs-re-extraction** (45): Extraction gaps with strong corpus evidence
- **partial-coverage-review** (34): Limited evidence, needs assessment
- **scholarly-review-required** (35): Editorial constructs or absent evidence

## Scripts Produced

| Script | Purpose |
|---|---|
| `scripts/mfd11-passb-index.mjs` | Build consolidated candidate index |
| `scripts/mfd11-passb-taxonomy-compare.mjs` | Compare candidates vs existing taxonomy |
| `scripts/mfd11-passb-cluster.mjs` | Semantic clustering (label + evidence) |
| `scripts/mfd11-passb-topic-index.mjs` | Topic-to-candidate synthesis report |
| `scripts/mfd11-passb-gap-report.mjs` | Gap analysis with corpus keyword search |
| `scripts/mfd11-passb-hierarchy.mjs` | Proposed hierarchy generation |

## Findings and Recommendations

### 1. Batch Generator Limitation
The batch generator used for surahs 7–114 produced placeholder labels
(`cand-XXXX: Topic from S:A`) and empty `existingTopicOverlap` arrays per
time-saving rules. This means 2,710 candidates (92.9%) lack semantic metadata
needed for meaningful deduplication. **Recommendation:** Re-extract surahs 7–114
with descriptive labels and topic overlap analysis, or run a post-processing
step that assigns real labels based on verse content.

### 2. Extraction Gaps Are Actionable
The 45 extraction gaps have strong Qur'anic evidence (≥5 matching verses each).
These represent high-value targets for targeted re-extraction that would
significantly improve taxonomy coverage from 38% to ~62%.

### 3. Existing Taxonomy Is Well-Structured
The 20-domain, 72-dimension structure holds up well against the extraction.
No structural changes are proposed at this stage; the hierarchy preserves
the existing organization and adds disposition metadata.

### 4. Scholarly Review Gate Remains Intact
All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus:
"pending-scholarly-review"`. No auto-approval has occurred. The 35 topics
classified as `scholarly-review-required` need human determination of whether
they represent genuine Qur'anic concepts or editorial taxonomy constructs.

## Next Steps (Phase C / D)

Per the charter, subsequent phases are:
- **Phase C**: Detailed comparison reports, missing-topic/mapping reports,
  Arabic terminology index (builds on this Pass B output)
- **Phase D**: Gated FAHM integration specification (requires human scholarly
  approval before any production changes)

No further autonomous work proceeds without user direction.
