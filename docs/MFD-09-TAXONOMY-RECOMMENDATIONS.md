# MFD-09 Taxonomy Recommendations Report

**Audit Date:** 2026-11-13  
**Auditor:** Taxonomy & Curated Topic Architect  
**Scope:** Prioritized recommendations for improving the Quranic thematic taxonomy

---

## Executive Summary

This report synthesizes findings from the comprehensive audit of 20 domains, 103 dimensions, 25 subdimensions, 184 topics, and 150 relationships. The taxonomy is conceptually sound in its core theological and ethical areas but suffers from severe imbalances in specialized domains.

**Key Statistics:**
- **Current State:** 184 topics, 103 dimensions, 20 domains
- **Critical Gaps:** 18 dimensions with 0 topics, 8 topics without ayah mappings
- **Severe Underrepresentation:** 48 dimensions with only 1 topic
- **Recommended Expansion:** ~205 new topics to achieve balance

**Overall Assessment:** The taxonomy has a strong foundation but requires significant expansion to fulfill its mission as a comprehensive Quranic thematic framework.

---

## Priority 1: Critical Actions (Immediate - Weeks 1-4)

### 1.1 Add Ayah Mappings to Unmapped Topics

**Issue:** 8 topics added in MFD-08 have no ayah mappings.

**Topics Requiring Mappings:**
1. `wealth-ownership` (economic-conduct)
2. `evidence-standards` (law-obligations)
3. `public-accountability` (governance-political-authority)
4. `environmental-corruption` (environment-stewardship)
5. `day-of-judgment` (eschatology-afterlife)
6. `non-combatant-protection` (war-peace-conflict)
7. `interest-free-finance` (economic-conduct)
8. `covenants-ahd` (law-obligations)

**Action Plan:**
- Assign scholarly team to identify 3-5 relevant ayahs per topic
- Update `topic-ayah-mappings.json` with new mappings
- Set provenance to "scholarly-reviewed" upon completion

**Estimated Effort:** 2-3 weeks

---

### 1.2 Resolve Duplicate Dimension ID

**Issue:** `education-systems` appears in both human-experiences and creation-signs domains.

**Action Plan:**
- Investigate intent behind duplicate ID
- Rename to distinct IDs:
  - `education-systems-human` (human-experiences domain)
  - `education-systems-creation` (creation-signs domain) OR remove if redundant
- Update all references in dimensions.json and topics.json

**Estimated Effort:** 1 week

---

### 1.3 Clarify Tawheed Concept Overlap

**Issue:** `tawheed-fundamentals` and `divine-unity` have significant semantic overlap.

**Action Plan:**
- Update descriptions to make distinction explicit:
  - `tawheed-fundamentals`: Theological framework and principles
  - `divine-unity`: Metaphysical concept of absolute oneness
- Review relatedTopicIds to ensure accurate connections
- Consider merging if distinction cannot be clearly maintained

**Estimated Effort:** 1 week

---

### 1.4 Fill Critical Dimension Gaps (0 Topics)

**Issue:** 18 dimensions have zero topics.

**Priority Dimensions:**
1. **quranic-linguistics** (revelation-guidance) - Add 4 topics
2. **gender-cultural-experiences** (human-experiences) - Add 4 topics
3. **education-systems** (human-experiences) - Add 4 topics
4. **modern-economic-issues** (economic-conduct) - Add 4 topics
5. **scientific-knowledge-observation** (creation-signs) - Add 3 topics
6. **mathematics-measurement** (creation-signs) - Add 2 topics
7. **human-biology-ecology** (creation-signs) - Add 2 topics
8. **natural-resources** (creation-signs) - Add 2 topics
9. **agriculture-farming** (creation-signs) - Add 2 topics
10. **travel-exploration** (creation-signs) - Add 2 topics
11. **time-seasons** (creation-signs) - Add 2 topics
12. **death-dying** (eschatology-afterlife) - Add 4 topics
13. **people-of-book** (interfaith-communities) - Add 4 topics
14. **religious-communities** (interfaith-communities) - Add 3 topics
15. **quranic-arabic** (language-vocabulary) - Add 2 topics
16. **linguistics-eloquence** (language-vocabulary) - Add 2 topics
17. **physical-health** (health-medicine) - Add 2 topics
18. **body-as-trust** (health-medicine) - Add 2 topics
19. **creativity-design** (arts-beauty-aesthetics) - Add 2 topics
20. **adornment-ethics** (arts-beauty-aesthetics) - Add 2 topics
21. **architecture-engineering** (arts-beauty-aesthetics) - Add 3 topics
22. **prophetic-professions** (work-vocation) - Add 2 topics
23. **craftsmanship** (work-vocation) - Add 2 topics

**Total New Topics Needed:** ~60 topics

**Action Plan:**
- Draft topic definitions for each dimension
- Identify ayah mappings for each new topic
- Add to topics.json with proper parentDomainId, parentDimensionId
- Create subdimensions where appropriate

**Estimated Effort:** 4-6 weeks

---

## Priority 2: High Priority Actions (Weeks 5-12)

### 2.1 Expand Severely Underrepresented Dimensions (1 Topic)

**Issue:** 48 dimensions have only 1 topic.

**Focus Areas:**
- **worship-practice:** hajj-umrah-pilgrimage (+4), zakat-obligatory-charity (+3), sawm-fasting (+3)
- **family-relationships:** kinship-extended-family (+3)
- **society-justice:** social-responsibility (+3)
- **economic-conduct:** All 7 dimensions need +3-4 topics each (~25 topics)
- **law-obligations:** criminal-law (+3), international-law (+3)
- **creation-signs:** animals-creation (+4)
- **eschatology-afterlife:** paradise-jannah (+3), hell-jahannam (+3)
- **interfaith-communities:** interfaith-dialogue (+3)
- **language-vocabulary:** quranic-vocabulary (+3)
- **health-medicine:** mental-wellbeing (+3), healing-medicine (+3)
- **environment-stewardship:** khalifah-stewardship (+3), mizan-balance (+2), environmental-protection (+3)
- **governance-political-authority:** All 4 dimensions need +3-4 topics each (~12 topics)
- **war-peace-conflict:** jihad-concept (+3), peace-treaties (+3), conflict-resolution (+3)
- **arts-beauty-aesthetics:** husn-beauty (+3), artistic-expression (+3)
- **work-vocation:** work-dignity (+3), labor-rights (+3)

**Total New Topics Needed:** ~80 topics

**Action Plan:**
- Prioritize economic-conduct, governance, war-peace, environment domains
- Draft topic definitions with clear scope and ayah mappings
- Ensure balanced distribution across dimensions

**Estimated Effort:** 6-8 weeks

---

### 2.2 Enhance Relationship Specificity

**Issue:** Some CROSS_REFERENCES use generic RELATED_TO type.

**Action Plan:**
- Review all 42 CROSS_REFERENCES
- Replace generic types with specific types:
  - FOUNDATIONAL_TO
  - APPLICATION_OF
  - CONTRASTS_WITH
  - COMPLEMENTS
  - DERIVED_FROM
- Add rationale field to each relationship explaining why it exists

**Estimated Effort:** 2-3 weeks

---

### 2.3 Add Subdimensional Structure

**Issue:** 78 dimensions lack subdimensional structure.

**Action Plan:**
- Identify dimensions with 3+ topics that would benefit from subdimensions
- Create subdimensions for:
  - tawheed-oneness (Rububiyyah, Uluhiyyah, Asma wa Sifat)
  - iman-faith-pillars (6 pillars)
  - divine-decree-qadr (4 levels)
  - moral-virtues (categories of virtues)
  - moral-vice (categories of vices)
  - intellect-reason (knowledge, reason, wisdom)
- Update dimensions.json and subdimensions.json

**Estimated Effort:** 3-4 weeks

---

## Priority 3: Medium Priority Actions (Weeks 13-20)

### 3.1 Expand Underrepresented Dimensions (2 Topics)

**Issue:** ~22 dimensions have only 2 topics.

**Action Plan:**
- Add 1-2 topics to each underrepresented dimension
- Focus on:
  - revelation-guidance: divine-scriptures, prophetic-guidance
  - prophets-narratives: minor-prophets, prophetic-lessons, dreams-visions
  - ethics-character: sincerity-ikhlas
  - human-experiences: psychology-emotions, personal-development
  - family-relationships: spousal-relations, parents-elderly-care, divorce-separation
  - society-justice: ummah-community, equality-diversity, human-rights, poverty-welfare, urban-rural-media-ethics
  - law-obligations: oaths-vows-covenants, food-dietary-laws
  - eschatology-afterlife: resurrection-judgment, signs-of-hour
  - environment-stewardship: fasad-prohibition
  - war-peace-conflict: warfare-ethics
  - governance-political-authority: accountability

**Total New Topics Needed:** ~40 topics

**Estimated Effort:** 4-6 weeks

---

### 3.2 Improve Cross-Domain Connectivity

**Issue:** Many topics in underrepresented domains have few cross-references.

**Action Plan:**
- Identify poorly-connected topics (0-1 relationships)
- Add cross-references to integrate them into the taxonomy
- Ensure each topic has at least 2-3 meaningful connections
- Document cross-domain relationships explicitly

**Estimated Effort:** 3-4 weeks

---

### 3.3 Scholarly Review Process

**Issue:** All topics, dimensions, and relationships have "pending-scholarly-review" provenance.

**Action Plan:**
- Establish scholarly review committee
- Prioritize review of:
  1. Core theological topics (belief-theology domain)
  2. Worship practice topics (worship-practice domain)
  3. Ethics and character topics (ethics-character domain)
- Update provenance status upon completion
- Document review decisions and rationales

**Estimated Effort:** Ongoing (6-12 months for full review)

---

## Priority 4: Low Priority Actions (Months 6-12)

### 4.1 Enhance Well-Covered Dimensions

**Issue:** Even well-covered dimensions can benefit from additional depth.

**Action Plan:**
- Add 1-2 topics to well-covered dimensions:
  - belief-theology: contemporary applications, theological schools
  - ethics-character: applied ethics, contemporary dilemmas
  - worship-practice: spiritual dimensions, contemporary issues
- Focus on quality over quantity

**Total New Topics Needed:** ~10 topics

**Estimated Effort:** 2-3 weeks

---

### 4.2 Standardize Topic Structure

**Issue:** Minor inconsistencies in topic structure across domains.

**Action Plan:**
- Standardize description length and format
- Ensure all topics have:
  - Clear title (English, Urdu, Arabic)
  - Concise description (1-2 sentences)
  - Explicit scope (inclusion/exclusion criteria)
  - 2-3 search aliases
  - 2-3 relatedTopicIds
  - Ayah mappings (where applicable)
- Audit and update topics as needed

**Estimated Effort:** 4-6 weeks

---

### 4.3 Documentation and Metadata Enhancement

**Issue:** Limited documentation for taxonomy structure and decisions.

**Action Plan:**
- Create comprehensive taxonomy documentation
- Document design decisions and rationales
- Create visual diagrams of domain/dimension/topic hierarchy
- Publish glossary of key terms
- Maintain changelog for taxonomy updates

**Estimated Effort:** 4-6 weeks

---

## Implementation Roadmap

### Phase 1: Foundation Stabilization (Weeks 1-4)
- [ ] Add ayah mappings to 8 unmapped topics
- [ ] Resolve duplicate education-systems dimension ID
- [ ] Clarify tawheed concept overlap
- [ ] Begin filling critical dimension gaps (0 topics)

### Phase 2: Critical Gap Closure (Weeks 5-12)
- [ ] Complete filling all 18 critical dimension gaps (~60 topics)
- [ ] Expand severely underrepresented dimensions (~80 topics)
- [ ] Enhance relationship specificity
- [ ] Begin adding subdimensional structure

### Phase 3: Balance Achievement (Weeks 13-20)
- [ ] Expand underrepresented dimensions (~40 topics)
- [ ] Improve cross-domain connectivity
- [ ] Complete subdimensional structure additions
- [ ] Begin scholarly review process

### Phase 4: Refinement and Enhancement (Months 6-12)
- [ ] Enhance well-covered dimensions (~10 topics)
- [ ] Standardize topic structure
- [ ] Complete documentation and metadata enhancement
- [ ] Continue scholarly review process

---

## Resource Requirements

### Human Resources
- **Taxonomy Architects:** 2-3 (structure, relationships)
- **Islamic Scholars:** 4-6 (content validation, ayah mappings)
- **Linguists:** 2 (Urdu/Arabic translations, terminology)
- **Technical Staff:** 1-2 (JSON updates, data integrity)

### Time Investment
- **Phase 1:** 4 weeks
- **Phase 2:** 8 weeks
- **Phase 3:** 8 weeks
- **Phase 4:** 6 months (ongoing)
- **Total:** ~9 months for major restructuring, ongoing for refinement

### Technical Requirements
- Version control for taxonomy files (Git)
- Validation scripts for JSON structure
- Collaboration platform for scholarly review
- Documentation system for taxonomy decisions

---

## Success Metrics

### Quantitative Metrics
- **Topic Count:** Increase from 184 to ~390 topics
- **Dimension Coverage:** 100% of dimensions have ≥3 topics
- **Ayah Mapping Coverage:** 100% of topics have ayah mappings
- **Relationship Density:** Average 3+ relationships per topic
- **Scholarly Review:** 100% of core topics reviewed

### Qualitative Metrics
- **Conceptual Clarity:** Reduced ambiguity in topic definitions
- **Cross-Domain Integration:** Improved connectivity across domains
- **User Feedback:** Positive feedback from users on comprehensiveness
- **Scholarly Endorsement:** Validation by Islamic scholars
- **Educational Utility:** Effective use in educational contexts

---

## Risk Mitigation

### Risk 1: Scope Creep
- **Mitigation:** Strict adherence to prioritized roadmap
- **Control:** Regular review of progress against milestones

### Risk 2: Scholarly Disagreement
- **Mitigation:** Establish clear review criteria and decision-making process
- **Control:** Document dissenting opinions and rationales

### Risk 3: Data Integrity Issues
- **Mitigation:** Automated validation scripts for JSON structure
- **Control:** Regular backups and version control

### Risk 4: Resource Constraints
- **Mitigation:** Phased implementation allowing for resource adjustments
- **Control:** Prioritize critical actions first

---

## Conclusion

The MFD-09 taxonomy audit reveals a fundamentally sound structure with significant opportunities for improvement. By implementing the recommended actions in priority order, the taxonomy will evolve from a theology-heavy framework to a comprehensive Islamic knowledge system that adequately represents all aspects of Islamic life, thought, and practice.

**Key Takeaways:**
1. **Immediate focus** on ayah mappings and critical dimension gaps
2. **Systematic expansion** of underrepresented domains
3. **Enhanced relationships** for better conceptual integration
4. **Scholarly validation** for credibility and accuracy
5. **Continuous refinement** for long-term sustainability

With approximately 205 new topics and structured improvements, the taxonomy will achieve balanced coverage across all 20 domains and 103 dimensions, fulfilling its mission as a complete Quranic thematic framework.

**Next Steps:**
1. Review and approve this recommendations report
2. Assemble implementation team
3. Begin Phase 1 actions immediately
4. Establish regular progress review cadence
