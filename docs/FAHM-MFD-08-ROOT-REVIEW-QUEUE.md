# MFD-08 Phase 6: Root Review Queue

**Date:** November 13, 2026  
**Purpose:** Track roots requiring review and heuristic root-topic connections

---

## 1. Roots Needing Review

### Summary
- **Total roots needing review:** 68
- **Percentage of total:** 4.1%
- **Status:** `needs-review`

### Characteristics of Roots Needing Review
These roots have lemmas that require further investigation before activation:
- Lemmas may have ambiguous morphology
- Lemmas may appear in very few contexts
- Automated validation could not confidently accept/reject

### Sample Roots Needing Review

| Root | Total Lemmas | Needs Review | Occurrences | Distinct Ayat |
|------|--------------|--------------|-------------|---------------|
| ابب | 1 | 1 | 0 | 0 |
| اتي | 7 | 2 | 450 | 412 |
| ... | ... | ... | ... | ... |

**Note:** Full list of 68 roots available in `data/root-discovery-registry.json` by filtering for `status: "needs-review"`.

### Review Priorities

#### High Priority (High Occurrence Count)
Roots with many occurrences but lemmas needing review should be prioritized:

1. **اتي** (ata) — 450 occurrences, 412 ayat, 2 lemmas need review
   - High-frequency root
   - Impact: Affects many verses
   - Recommendation: Review lemmas for "أَتَى" derivatives

#### Medium Priority (Moderate Occurrence Count)
Roots with moderate usage that would benefit from activation:

- Review roots with 50-200 occurrences
- Focus on common theological concepts

#### Low Priority (Low Occurrence Count)
Roots with minimal impact:

- Roots with <50 occurrences
- Can be reviewed after high-priority items

### Review Workflow Recommendations

1. **Automated Pre-screening**
   - Generate lemma context reports (show all occurrences)
   - Highlight ambiguous morphology cases
   - Flag potential homonyms

2. **Scholarly Review Process**
   - Present lemmas with full contextual usage
   - Allow approve/reject per lemma
   - Record rationale for decisions

3. **Batch Processing**
   - Group roots by semantic field (e.g., all worship-related roots)
   - Review related roots together for consistency

4. **Documentation**
   - Record review decisions in root registry
   - Update status to `activated` or `partially-activated`
   - Track reviewer and review date

---

## 2. Topics with Heuristic Root Connections

### Overview
All topics with root connections use heuristic matching. The system does not currently distinguish between:
- **Curated connections** (from keyword map, higher confidence)
- **Heuristic connections** (from text matching, lower confidence)

### Connection Methodology

#### Curated Keyword Map (~150 entries)
High-confidence connections for common Islamic concepts:

**Theological Concepts:**
- tawheed/unity/oneness → وحد
- faith/belief/iman → امن
- kufr/disbelief → كفر
- shirk/polytheism → شرك

**Divine Attributes:**
- mercy/rahmah → رحم
- forgiveness/maghfirah → غفر
- patience/sabr → صبر
- gratitude/shukr → شكر

**Worship Practices:**
- prayer/salah → صلو
- fasting/sawm → صوم
- zakat → زكو
- hajj/pilgrimage → حجج

**Moral Concepts:**
- justice/adl → عدل
- goodness/ihsan → حسن
- truth/sidq → صدق
- knowledge/ilm → علم

#### Heuristic Text Matching
Lower-confidence connections based on:
- Root slug appearing in topic text
- Root lemmas appearing in topic description
- Substring matching (minimum 3 characters)

### Topics Most Likely to Have Heuristic Connections

Topics with generic titles or broad descriptions are more likely to have heuristic (lower confidence) connections:

1. **Broad conceptual topics** (e.g., "Ethics," "Worship," "Guidance")
   - May match multiple roots through text matching
   - Connections may be tangential

2. **Topics with common words in titles**
   - Words like "life," "heart," "soul" appear in many contexts
   - May generate false positive connections

3. **Topics without direct keyword map entries**
   - If topic title doesn't match curated keywords
   - Falls back to heuristic matching only

### Recommended Review Priorities

#### Priority 1: High-Impact Topics
Topics with many ayah mappings and root connections:

- Review topics with 20+ ayah mappings
- Verify root connections are semantically appropriate
- Document any incorrect connections

#### Priority 2: Theological Core Topics
Topics central to Islamic theology:

- Tawheed (Monotheism)
- Prophethood
- Afterlife
- Worship

Ensure root connections are accurate and well-documented.

#### Priority 3: Specialized Topics
Topics with narrow focus:

- Verify connections are relevant
- Remove tangential connections
- Consider adding to curated keyword map if connection is valid

---

## 3. Review Workflow Recommendations

### Phase 1: Data Quality Review (Current)
**Goal:** Ensure root registry integrity

**Tasks:**
- [x] Validate root registry structure (COMPLETED)
- [x] Check for duplicate slugs (COMPLETED)
- [x] Verify status values (COMPLETED)
- [ ] Review roots with `needs-review` status
- [ ] Activate high-priority roots after review

### Phase 2: Connection Quality Review
**Goal:** Improve root-topic connection accuracy

**Tasks:**
- [ ] Sample 50 topic-root connections for manual review
- [ ] Identify false positives (incorrect connections)
- [ ] Identify false negatives (missing valid connections)
- [ ] Expand curated keyword map based on findings

### Phase 3: Scholarly Validation
**Goal:** Obtain scholarly approval for key connections

**Tasks:**
- [ ] Select 20 core theological topics
- [ ] Present root connections to scholars
- [ ] Document scholarly feedback
- [ ] Update connections based on scholarly input
- [ ] Mark verified connections as `SCHOLARLY_VERIFIED`

### Phase 4: User Feedback Integration
**Goal:** Incorporate user observations

**Tasks:**
- [ ] Add feedback mechanism to root/topic pages
- [ ] Collect user suggestions for corrections
- [ ] Review feedback quarterly
- [ ] Update connections based on valid feedback

---

## 4. Implementation Recommendations

### Short-Term (Immediate)

1. **Review High-Frequency Roots Needing Review**
   - Focus on roots with 100+ occurrences
   - Prioritize roots in curated keyword map
   - Expected effort: 2-3 days

2. **Document Connection Methodology**
   - Add help text explaining heuristic connections
   - Create FAQ about root-topic linking
   - Expected effort: 1 day

### Medium-Term (1-2 months)

1. **Expand Curated Keyword Map**
   - Add 50-100 more high-confidence entries
   - Focus on common theological concepts
   - Expected effort: 1 week

2. **Implement Connection Metadata**
   - Add `source` field to root connections
   - Distinguish curated vs heuristic in UI
   - Expected effort: 3-5 days

3. **Create Review Dashboard**
   - Show roots needing review
   - Allow filtering by occurrence count
   - Provide lemma context for review
   - Expected effort: 1 week

### Long-Term (3-6 months)

1. **Scholarly Review Workflow**
   - Build interface for scholarly review
   - Track review decisions
   - Update root registry with scholarly input
   - Expected effort: 2-3 weeks

2. **Confidence Scoring**
   - Implement more sophisticated scoring
   - Consider semantic similarity
   - Expose confidence levels to users
   - Expected effort: 2-3 weeks

3. **Machine Learning Enhancement**
   - Train model on verified connections
   - Improve heuristic matching accuracy
   - Reduce false positives
   - Expected effort: 1-2 months

---

## 5. Success Metrics

### Quantitative Metrics
- [ ] Reduce roots needing review from 68 to <20
- [ ] Increase activated roots from 1,471 to 1,550+
- [ ] Expand curated keyword map from 150 to 250+ entries
- [ ] Achieve 95%+ accuracy on sampled root-topic connections

### Qualitative Metrics
- [ ] Scholarly approval for core theological connections
- [ ] Positive user feedback on root-topic relevance
- [ ] Reduced confusion about connection authority
- [ ] Clear documentation of methodology

---

## 6. Risk Mitigation

### Current Risks
1. **False scholarly authority** — MITIGATED by clear UI labeling
2. **Incorrect connections** — MITIGATED by "suggested" labels
3. **User confusion** — MITIGATED by disclaimers

### Future Risks
1. **Scale of review** — 68 roots needing review is manageable
2. **Scholarly availability** — Start with small batch of core topics
3. **Maintenance burden** — Automate where possible, manual review for edge cases

---

## 7. Next Steps

### Immediate Actions (This Week)
1. Review top 10 high-frequency roots needing review
2. Sample 20 topic-root connections for accuracy check
3. Draft user-facing explanation of heuristic connections

### Short-Term Actions (This Month)
1. Complete review of all 68 roots needing review
2. Expand curated keyword map by 50 entries
3. Implement connection metadata in data model

### Medium-Term Actions (Next Quarter)
1. Launch scholarly review for 20 core topics
2. Build review dashboard for ongoing maintenance
3. Collect and integrate user feedback

---

**Document Version:** 1.0  
**Last Updated:** November 13, 2026  
**Next Review:** December 13, 2026