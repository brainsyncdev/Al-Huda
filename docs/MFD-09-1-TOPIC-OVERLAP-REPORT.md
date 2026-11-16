# MFD-09.1 Topic Boundary & Overlap Report

**Audit Date:** 2026-11-16  
**Scope:** Investigation of reported topic clusters for potential duplication or boundary issues  

---

## Investigated Clusters

### Cluster 1: tawheed-fundamentals vs divine-unity

| Attribute | tawheed-fundamentals | divine-unity |
|-----------|---------------------|--------------|
| Dimension | allah-divine-attributes | allah-divine-attributes |
| Description | Foundational principles of Islamic monotheism | Concept of Allah's absolute oneness |
| Scope | Core concept of divine unity | Oneness in essence, attributes, and actions |
| Specialized | false | false |
| Ayah Mappings | 6 | 3 |
| Related Topics | tawheed-rububiyyah, tawheed-uluhiyyah, shirk-prohibition | tawheed-fundamentals, tawheed-rububiyyah |

**Analysis:** These are DISTINCT topics. `tawheed-fundamentals` is the broader foundational entry covering the concept systematically, while `divine-unity` focuses specifically on the theological doctrine of absolute oneness (wahdaniyyah). They cross-reference each other appropriately. The overlap is intentional and pedagogically sound.

**Recommendation:** RETAIN BOTH — clarify scope descriptions to distinguish systematic foundation vs. specific doctrinal focus.

---

### Cluster 2: qalb-purification vs tazkiyah

| Attribute | qalb-purification | tazkiyah |
|-----------|------------------|----------|
| Dimension | spiritual-states-nafs | spiritual-states-nafs |
| Subdimension | qalb-heart | (listed in dimension topicIds but NOT in topics.json as separate entry) |
| Description | Purification of the heart | (Not found as standalone topic) |
| Ayah Mappings | 5 | N/A |

**Analysis:** `tazkiyah` appears in `dimensions.json` topicIds for `spiritual-states-nafs` and in `subdimensions.json` under `qalb-heart`, but there is NO standalone topic entry with id `tazkiyah` in `topics.json`. The concept is covered within `qalb-purification` which lists "tazkiyah" as a search alias.

**Finding:** This is a PHANTOM TOPIC REFERENCE. `tazkiyah` is referenced in dimensions.json and subdimensions.json but never created as a topic.

**Recommendation:** Either CREATE `tazkiyah` as a distinct topic (broader than qalb-purification, covering self-purification generally) OR remove it from dimensions.json/subdimensions.json topicIds and keep it as an alias of qalb-purification.

---

### Cluster 3: prophetic-methodology vs prophetic-wisdom

| Attribute | prophetic-methodology | prophetic-wisdom |
|-----------|----------------------|------------------|
| Dimension | prophetic-guidance | prophetic-guidance |
| Description | Methodology of prophetic teaching | Wisdom in prophetic teachings |
| Scope | How prophets conveyed message | Hikmah in prophetic guidance |
| Specialized | true | false |
| Ayah Mappings | 4 | 4 |
| Related Topics | prophetic-wisdom, prophetic-miracles | prophetic-methodology, following-prophets |

**Analysis:** These are DISTINCT topics with clear boundaries. `prophetic-methodology` covers the METHODS and APPROACHES prophets used to convey their message (pedagogy, communication style, gradual revelation). `prophetic-wisdom` covers the CONTENT of wise teachings and hikmah-based guidance. They are complementary, not duplicative.

**Recommendation:** RETAIN BOTH — no action needed.

---

### Cluster 4: wealth-ownership vs wealth-stewardship

| Attribute | wealth-ownership | wealth-stewardship |
|-----------|-----------------|--------------------|
| Exists in topics.json | YES | NO |
| Dimension | wealth-property | (not assigned) |
| Description | (exists as topic) | (phantom reference) |

**Analysis:** `wealth-ownership` exists as a valid topic in `topics.json` under `wealth-property`. However, `wealth-stewardship` does NOT exist as a topic entry. It may be referenced in dimensions.json but was never created.

**Finding:** Similar to tazkiyah, this is a PHANTOM REFERENCE. The concept of wealth stewardship is partially covered by `wealth-ownership` and potentially by topics in `khalifah-stewardship` dimension.

**Recommendation:** Either CREATE `wealth-stewardship` as a distinct topic focusing on the amanah/trust aspect of wealth, OR ensure the concept is adequately covered within existing topics and remove phantom references.

---

## Summary of Findings

| Cluster | Status | Action Required |
|---------|--------|----------------|
| tawheed-fundamentals / divine-unity | Distinct, healthy overlap | None — retain both |
| qalb-purification / tazkiyah | Phantom reference (tazkiyah missing) | Create topic or clean references |
| prophetic-methodology / prophetic-wisdom | Distinct, complementary | None — retain both |
| wealth-ownership / wealth-stewardship | Phantom reference (stewardship missing) | Create topic or clean references |

## General Observation

The reported overlaps are largely **non-issues**. Where genuine problems exist, they are phantom references (topicIds listed in dimensions.json/subdimensions.json without corresponding topic entries) rather than actual duplicate topics. This reinforces the primary finding of this audit: the taxonomy structure was updated without completing topic creation.
