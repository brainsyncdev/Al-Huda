# FAHM MFD-07 — Taxonomy Expansion Report

**Date:** November 12, 2026  
**Phase:** MFD-07 Phase 2 — Taxonomy Completion + Bug Fixes  
**Status:** ✅ Complete

---

## Executive Summary

Expanded the FAHM canonical taxonomy from **98 dimensions** to **103 dimensions** by adding 5 meaningful new dimensions that address gaps identified in the MFD-07 baseline audit. Additionally, added 6 missing topics to resolve broken references in relationships.json.

---

## New Dimensions Added (5)

### 1. Scientific Knowledge & Observation
- **ID:** `scientific-knowledge-observation`
- **Parent Domain:** `creation-signs` (Creation & Signs)
- **Description:** Scientific observation, empirical knowledge, and study of natural phenomena as divine signs
- **Topics:** observation-nature, empirical-knowledge, natural-phenomena, scientific-inquiry, experimental-method
- **Rationale:** The Quran repeatedly encourages observation of natural phenomena (afala tatafakkarun, afala ya'qilun). This dimension captures the scientific method and empirical inquiry as a form of divine sign recognition, filling a gap in the taxonomy between general creation signs and specific scientific disciplines.

### 2. Mathematics & Measurement
- **ID:** `mathematics-measurement`
- **Parent Domain:** `creation-signs` (Creation & Signs)
- **Description:** Mathematical concepts, measurement, calculation, and numerical precision in Quran
- **Topics:** mathematical-concepts, measurement-precision, calculation-methods, numerical-patterns, proportional-relationships
- **Rationale:** The Quran contains numerous references to measurement, calculation, and numerical precision (e.g., inheritance calculations, time measurements, proportional creation). This dimension captures the mathematical dimension of divine order that was missing from the taxonomy.

### 3. Education & Learning Systems
- **ID:** `education-systems`
- **Parent Domain:** `human-experiences` (Human Experiences)
- **Description:** Educational principles, learning methods, teaching ethics, and knowledge transmission
- **Topics:** teaching-methods, learning-ethics, knowledge-transmission, educational-institutions, mentorship-guidance
- **Rationale:** While "intellect-reason" covers cognitive aspects, the systematic transmission of knowledge through teaching, mentorship, and educational institutions is a distinct Quranic theme (e.g., Prophet as teacher, Luqman's instruction, teacher-student relationships). This dimension fills that gap.

### 4. Architecture & Engineering
- **ID:** `architecture-engineering`
- **Parent Domain:** `arts-beauty-aesthetics` (Arts, Beauty & Aesthetics)
- **Description:** Construction, architecture, engineering principles, and built environment in Islamic context
- **Topics:** construction-principles, architectural-design, engineering-ethics, mosque-architecture, urban-planning
- **Rationale:** The Quran references construction extensively (e.g., Kaaba building, Masjid al-Dirar, ant colony architecture, spider web). This dimension captures the built environment and engineering principles as expressions of divine beauty and human stewardship, complementing the existing artistic expression dimensions.

### 5. Digital Technology & Ethics
- **ID:** `digital-technology-ethics`
- **Parent Domain:** `society-justice` (Society & Justice)
- **Description:** Ethical considerations of digital technology, artificial intelligence, privacy, and information age
- **Topics:** digital-privacy, artificial-intelligence-ethics, information-technology, social-media-responsibility, digital-economy-ethics
- **Rationale:** Contemporary application of Quranic principles to digital age challenges. While not explicitly mentioned in the Quran, the underlying principles (privacy, truth verification, avoiding harm, economic justice) apply directly to modern digital contexts. This dimension bridges classical Islamic ethics with contemporary technological challenges.

---

## Missing Topics Added (6)

These topics were referenced in relationships.json but did not exist in topics.json, causing broken references:

### 1. Wealth Ownership
- **ID:** `wealth-ownership`
- **Parent Domain:** `economic-conduct`
- **Parent Dimension:** `wealth-property`
- **Description:** Concept of wealth ownership in Islam
- **Scope:** Allah as ultimate owner, human as trustee, property rights
- **Referenced by:** `rel-cross-zakat-wealth` (zakat-calculation → wealth-ownership)

### 2. Evidence Standards
- **ID:** `evidence-standards`
- **Parent Domain:** `law-obligations`
- **Parent Dimension:** `criminal-law`
- **Description:** Standards of evidence in Islamic law
- **Scope:** Witness requirements, documentation, burden of proof
- **Referenced by:** `rel-cross-hudud-evidence` (hudud-punishments → evidence-standards)

### 3. Public Accountability
- **ID:** `public-accountability`
- **Parent Domain:** `governance-political-authority`
- **Parent Dimension:** `accountability`
- **Description:** Accountability of public officials and leaders
- **Scope:** Transparency, oversight, anti-corruption mechanisms
- **Referenced by:** `rel-cross-corruption-accountability` (corruption-prohibition → public-accountability)

### 4. Environmental Corruption
- **ID:** `environmental-corruption`
- **Parent Domain:** `environment-stewardship`
- **Parent Dimension:** `fasad-prohibition`
- **Description:** Environmental corruption and destruction
- **Scope:** Deforestation, pollution, resource depletion as fasad
- **Referenced by:** `rel-cross-fasad-environment` (fasad-fil-ard → environmental-corruption)

### 5. Day of Judgment
- **ID:** `day-of-judgment`
- **Parent Domain:** `eschatology-afterlife`
- **Parent Dimension:** `resurrection-judgment`
- **Description:** The Day of Judgment and final accountability
- **Scope:** Events of the day, judgment process, outcomes
- **Referenced by:** `rel-cross-resurrection-judgment` (resurrection-process → day-of-judgment)

### 6. Non-Combatant Protection
- **ID:** `non-combatant-protection`
- **Parent Domain:** `war-peace-conflict`
- **Parent Dimension:** `warfare-ethics`
- **Description:** Protection of civilians and non-combatants in warfare
- **Scope:** Women, children, elderly, religious figures, environmental protection
- **Referenced by:** `rel-cross-rules-engagement` (rules-of-engagement → non-combatant-protection)

---

## Domain Updates

Updated parent domain dimensionIds arrays to include new dimensions:

1. **creation-signs** — Added: `scientific-knowledge-observation`, `mathematics-measurement`
2. **human-experiences** — Added: `education-systems`
3. **society-justice** — Added: `digital-technology-ethics`
4. **arts-beauty-aesthetics** — Added: `architecture-engineering`

---

## Validation Results

### Pre-Expansion
- **Dimensions:** 98
- **Topics:** 176
- **Broken references:** 6

### Post-Expansion
- **Dimensions:** 103 ✅ (target: 100+)
- **Topics:** 182 ✅ (176 + 6 new)
- **Broken references:** 0 ✅

### Data Integrity Checks
- ✅ All dimension IDs are valid kebab-case
- ✅ All parentDomainId references point to existing domains
- ✅ All new topics have valid parentDimensionId references
- ✅ No broken references in relationships.json
- ✅ TypeScript compilation passes (`npx tsc --noEmit`)

---

## Bug Fixes Applied

### Bug 1: Dimension Detail Page Related Dimensions Filter
**File:** `src/app/explore/dimensions/[id]/page.tsx`  
**Line:** 62  
**Issue:** Code filtered related dimensions by `id.startsWith('dim-')` but dimension IDs use kebab-case without 'dim-' prefix  
**Fix:** Removed the `.startsWith('dim-')` filter. Related dimensions are now correctly fetched from relationships where the dimension is the source or target.

### Bug 2: Broken References in relationships.json
**File:** `data/taxonomy/relationships.json`  
**Issue:** 6 CROSS_REFERENCES relationships referenced non-existent topic IDs  
**Fix:** Added all 6 missing topics to topics.json with proper schema and parent references

### Bug 3: Dimension Count Below 100
**File:** `data/taxonomy/dimensions.json`  
**Issue:** Only 98 dimensions, target was 100+  
**Fix:** Added 5 meaningful new dimensions addressing identified gaps

### Bug 4: Topic Links (Documented as Known Limitation)
**Issue:** Canonical topics link to `/explore/topics/[slug]` but legacy system uses different slugs  
**Status:** Documented in FAHM-MFD-07-BASELINE-AUDIT.md as known limitation to be resolved in Phase 6 (Unified Topic Explorer)

---

## Design Rationale

### Why These 5 Dimensions?

1. **Scientific Knowledge & Observation** — Fills gap between general creation signs and specific scientific disciplines. Quranic emphasis on observation (tadabbur, tafakkur) as worship.

2. **Mathematics & Measurement** — Captures numerical precision and proportional creation mentioned throughout Quran. Inheritance calculations, time measurements, and mathematical order reflect divine wisdom.

3. **Education & Learning Systems** — Distinguishes systematic knowledge transmission from general intellect. Prophet as teacher, Luqman's wisdom, mentorship relationships are distinct Quranic themes.

4. **Architecture & Engineering** — Built environment as expression of divine beauty and human stewardship. Kaaba construction, mosque architecture, urban planning reflect Islamic civilization.

5. **Digital Technology & Ethics** — Contemporary application of classical principles. While technology is new, underlying ethical principles (privacy, truth, avoiding harm) are timeless Quranic concerns.

### Why Not More?

The expansion was deliberately conservative (5 dimensions, not 10+) to:
- Maintain quality over quantity
- Ensure each dimension has clear Quranic grounding
- Avoid over-fragmentation of the taxonomy
- Leave room for future scholarly review and expansion

---

## Future Work

### Phase 3: Quranic Ayah Mapping
- Map all 182 topics to relevant ayat
- Use 6,236 ayat from quran-json dataset
- Classify mappings (DIRECT_REFERENCE, THEMATIC_REFERENCE, etc.)

### Phase 6: Unified Topic Explorer
- Fix redirect issue (`/explore/topics` → `/topics`)
- Create canonical topic detail pages
- Merge legacy and canonical systems
- Add ayah relations to canonical topics

### Future Taxonomy Expansions
- Medicine & Healthcare Systems (expand existing)
- Agriculture & Food Systems (expand existing)
- Manufacturing & Industry
- Infrastructure & Logistics
- Communication Technology
- Privacy & Cybersecurity
- Public Health & Disaster Management
- Disability & Accessibility
- Child Protection (expand existing)

These areas can be added in future phases as scholarly review progresses.

---

## Conclusion

The FAHM canonical taxonomy now contains **103 dimensions** across **20 domains**, with **182 topics** and **zero broken references**. All data integrity checks pass. The expansion addresses meaningful gaps while maintaining the taxonomy's scholarly integrity and Quranic grounding.

**Status:** ✅ Phase 2 Complete  
**Next:** Phase 3 (Quranic Ayah Mapping)
