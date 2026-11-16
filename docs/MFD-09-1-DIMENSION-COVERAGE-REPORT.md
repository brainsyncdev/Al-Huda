# MFD-09.1 Dimension Coverage Report

**Audit Date:** 2026-11-16  
**Data Source:** Canonical taxonomy files in `data/taxonomy/`  

---

## Coverage Methodology

Coverage was calculated from TWO independent sources and compared:

1. **Dimension-side:** `dimensions.json` → `topicIds[]` array for each dimension
2. **Topic-side:** `topics.json` → `parentDimensionId` field for each topic

True coverage requires BOTH sources to agree. A dimension is only truly covered when topics exist in `topics.json` that reference it.

---

## Coverage Distribution

### From Dimension-Side (dimensions.json topicIds)

| Status | Count | Notes |
|--------|-------|-------|
| ZERO_TOPICS | 0 | All dimensions list ≥5 topicIds |
| ONE_TOPIC | 0 | — |
| TWO_TOPICS | 0 | — |
| THREE_TO_FOUR_TOPICS | 9 | Minor discrepancy range |
| FIVE_OR_MORE_TOPICS | 94 | Majority |

### From Topic-Side (topics.json parentDimensionId)

| Status | Count | Percentage |
|--------|-------|-----------|
| ZERO_TOPICS | 37 | 35.9% |
| ONE_TOPIC | 19 | 18.4% |
| TWO_TOPICS | 8 | 7.8% |
| THREE_TO_FOUR_TOPICS | 9 | 8.7% |
| FIVE_OR_MORE_TOPICS | 30 | 29.1% |

### Discrepancy Summary

**97 of 103 dimensions** show a discrepancy between dimension-side and topic-side counts. Only 6 dimensions have perfect bidirectional agreement.

---

## Dimensions Requiring Review (Discrepancies)

| Dimension | Dim-Side Count | Topic-Side Count | Gap |
|-----------|---------------|-----------------|-----|
| quran-science | 6 | 5 | 1 |
| sunnah-prophetic-tradition | 5 | 4 | 1 |
| divine-scriptures | 4 | 2 | 2 |
| prophetic-guidance | 4 | 2 | 2 |
| quranic-linguistics | 4 | 0 | 4 |
| prophethood-messengership | 5 | 3 | 2 |
| minor-prophets | 7 | 3 | 4 |
| prophetic-lessons | 4 | 0 | 4 |
| dreams-visions | 4 | 2 | 2 |
| salah-prayer | 7 | 8 | -1 |
| zakat-obligatory-charity | 5 | 2 | 3 |
| sawm-fasting | 5 | 2 | 3 |
| hajj-umrah-pilgrimage | 5 | 1 | 4 |
| purification-ritual | 5 | 3 | 2 |
| congregational-worship | 5 | 2 | 3 |
| spiritual-states-nafs | 6 | 4 | 2 |
| moral-virtues | 7 | 8 | -1 |
| moral-vice | 9 | 7 | 2 |
| character-development | 5 | 1 | 4 |
| sincerity-ikhlas | 5 | 2 | 3 |
| human-creation-purpose | 6 | 5 | 1 |
| life-stages | 5 | 4 | 1 |
| intellect-reason | 5 | 6 | -1 |
| psychology-emotions | 6 | 3 | 3 |
| personal-development | 6 | 3 | 3 |
| gender-cultural-experiences | 4 | 0 | 4 |
| marriage-nikah | 7 | 5 | 2 |
| spousal-relations | 6 | 3 | 3 |
| parenting-child-development | 7 | 3 | 4 |
| parents-elderly-care | 5 | 3 | 2 |
| kinship-extended-family | 5 | 1 | 4 |
| divorce-separation | 7 | 3 | 4 |
| ummah-community | 5 | 2 | 3 |
| equality-diversity | 5 | 2 | 3 |
| human-rights | 5 | 2 | 3 |
| social-responsibility | 5 | 1 | 4 |
| poverty-welfare | 6 | 2 | 4 |
| urban-rural-media-ethics | 6 | 2 | 4 |
| trade-commerce | 7 | 1 | 6 |
| business-ethics | 5 | 0 | 5 |
| wealth-property | 5 | 1 | 4 |
| finance-debt | 6 | 2 | 4 |
| charity-giving | 5 | 1 | 4 |
| economic-justice | 5 | 1 | 4 |
| modern-economic-issues | 5 | 0 | 5 |
| shariah-legal-principles | 6 | 0 | 6 |
| criminal-law | 7 | 2 | 5 |
| international-law | 5 | 0 | 5 |
| oaths-vows-covenants | 5 | 2 | 3 |
| food-dietary-laws | 6 | 2 | 4 |
| animals-creation | 7 | 1 | 6 |
| natural-resources | 7 | 0 | 7 |
| environment-balance | 5 | 1 | 4 |
| agriculture-farming | 6 | 0 | 6 |
| travel-exploration | 6 | 0 | 6 |
| time-seasons | 5 | 0 | 5 |
| human-biology-ecology | 4 | 0 | 4 |
| resurrection-judgment | 5 | 2 | 3 |
| paradise-jannah | 5 | 1 | 4 |
| hell-jahannam | 5 | 1 | 4 |
| signs-of-hour | 5 | 2 | 3 |
| death-dying | 5 | 0 | 5 |
| people-of-book | 5 | 0 | 5 |
| religious-communities | 5 | 0 | 5 |
| interfaith-dialogue | 5 | 1 | 4 |
| quranic-arabic | 5 | 0 | 5 |
| linguistics-eloquence | 5 | 0 | 5 |
| quranic-vocabulary | 5 | 1 | 4 |
| physical-health | 5 | 0 | 5 |
| mental-wellbeing | 5 | 1 | 4 |
| healing-medicine | 5 | 1 | 4 |
| body-as-trust | 5 | 0 | 5 |
| khalifah-stewardship | 5 | 1 | 4 |
| fasad-prohibition | 5 | 2 | 3 |
| mizan-balance | 5 | 0 | 5 |
| environmental-protection | 6 | 1 | 5 |
| shura-consultation | 5 | 1 | 4 |
| leadership-authority | 5 | 1 | 4 |
| public-administration | 5 | 0 | 5 |
| accountability | 5 | 2 | 3 |
| jihad-concept | 5 | 1 | 4 |
| warfare-ethics | 5 | 2 | 3 |
| peace-treaties | 5 | 1 | 4 |
| conflict-resolution | 5 | 0 | 5 |
| husn-beauty | 5 | 1 | 4 |
| artistic-expression | 5 | 1 | 4 |
| creativity-design | 5 | 0 | 5 |
| adornment-ethics | 5 | 0 | 5 |
| work-dignity | 5 | 1 | 4 |
| prophetic-professions | 5 | 0 | 5 |
| craftsmanship | 5 | 0 | 5 |
| labor-rights | 5 | 1 | 4 |
| scientific-knowledge-observation | 5 | 0 | 5 |
| mathematics-measurement | 5 | 0 | 5 |
| education-systems | 5 | 0 | 5 |
| architecture-engineering | 5 | 0 | 5 |
| digital-technology-ethics | 5 | 0 | 5 |

---

## Conclusion

The taxonomy has a significant **phantom reference problem**: `dimensions.json` was updated to list topic IDs that don't exist in `topics.json`. This creates the illusion of coverage while the actual topic content is missing. The 37 zero-topic dimensions (topic-side) represent genuine gaps that need to be filled with real topic entries.
