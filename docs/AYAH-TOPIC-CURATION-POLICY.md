# Ayah-to-Topic Curation Policy

**Date:** November 11, 2026  
**Sprint:** 52  
**Status:** Implemented  
**Version:** 1.0

## Overview

This document defines the policy for curating ayah-to-topic relationships. Every published topic must have meaningful, source-backed Quranic ayat with explicit editorial provenance.

## Principles

### 1. Explicit Relationships

Every topic-to-ayah relationship must be explicit. There is no automatic assignment based on morphological roots, keywords, or AI inference.

**Rationale:** Thematic classifications require editorial judgment. Automatic assignment would misrepresent the Quran's thematic structure and could introduce errors.

### 2. Editorial Provenance

Every published relationship must have traceable provenance:

- **Method:** How the selection was produced (e.g., "editorial curation", "scholarly review")
- **Curator:** Who produced it (e.g., "Al-Huda editorial team")
- **Reviewed At:** ISO date of the last editorial pass
- **Status:** `pending-scholarly-review` or `editorial-approved`

**Rationale:** Transparency about the editorial process allows users to evaluate the reliability of the classification.

### 3. No Fabricated Scholarly Approvals

Do not invent scholar names, reviewer identities, source URLs, or scholarly citations. If a relationship lacks sufficient evidence or review, keep it unpublished or explicitly pending review.

**Rationale:** Fabricating scholarly approvals would mislead users and violate the product's commitment to source transparency.

### 4. Neutral Rationales

Each relationship must include a neutral rationale explaining why the ayah is included. Rationales must be purely descriptive (what the verse addresses) and never assert interpretation.

**Example:**
- ✅ "This verse addresses the command to establish prayer."
- ❌ "This verse proves that prayer is obligatory."

**Rationale:** The product does not present AI-generated religious interpretation as authoritative. Rationales should describe the verse's content without asserting theological conclusions.

### 5. Typed Relations

Each relationship must have a typed relation:

- **LEXICAL_MATCH:** The ayah contains a key term related to the topic
- **TOPIC_ASSOCIATION:** The ayah addresses the topic thematically
- **CROSS_REFERENCE:** The ayah is referenced by other ayat on the topic
- **SEQUENTIAL_CONTEXT:** The ayah provides context for the topic

**Rationale:** Typed relations allow users to understand why each ayah is included and how it relates to the topic.

### 6. No Duplicate Memberships

An ayah should not appear multiple times within the same topic. If an ayah is relevant to multiple topics, it may appear in each topic separately.

**Rationale:** Duplicate memberships within a topic would double-render the same verse under one heading, creating confusion.

### 7. Canonical Ayah Identity

Use canonical ayah identity: `surahNumber:ayahNumber`. Do not use alternative reference systems.

**Rationale:** Consistent reference format ensures all ayat resolve correctly and prevents ambiguity.

### 8. Content Integrity

- Use the existing authoritative Quran text
- Never rewrite Arabic Quranic text
- Never generate translations
- Preserve existing translations
- Preserve Tafsir and citations
- Do not invent references

**Rationale:** The product preserves the integrity of the Quranic text and scholarly sources.

## Curation Process

### 1. Topic Definition

Define the topic with:
- Stable slug and ID
- English and Arabic titles
- Short description
- Dimension and domain associations

### 2. Ayah Selection

Select ayat that:
- Are well-known and widely recognized as related to the topic
- Have clear thematic or lexical connection to the topic
- Represent different aspects of the topic
- Provide a balanced overview of the topic

### 3. Relation Typing

For each ayah, determine the relation type:
- **LEXICAL_MATCH:** The ayah contains a key term (e.g., "salah" for prayer topic)
- **TOPIC_ASSOCIATION:** The ayah addresses the topic thematically
- **CROSS_REFERENCE:** The ayah is referenced by other ayat on the topic
- **SEQUENTIAL_CONTEXT:** The ayah provides context for the topic

### 4. Rationale Writing

Write a neutral rationale for each ayah:
- Describe what the verse addresses
- Avoid asserting interpretation
- Keep it concise (one sentence)

### 5. Provenance Recording

Record the provenance:
- **Method:** "editorial curation" (or other method)
- **Curator:** "Al-Huda editorial team" (or other curator)
- **Reviewed At:** ISO date
- **Status:** "pending-scholarly-review" (default)

### 6. Validation

Validate the curation:
- All ayat resolve to valid surah:ayah pairs
- No duplicate memberships within the topic
- All relations have typed relations and rationales
- All relations have provenance
- Topic has sufficient ayat (minimum 4-5)

## Examples

### Example 1: Prayer Topic

**Topic:** Prayer (الصلاة)

**Ayah 1:**
- **Ref:** 2:43
- **Type:** LEXICAL_MATCH
- **Rationale:** "This verse contains the command to establish prayer."
- **Provenance:** method: "editorial curation", curator: "Al-Huda editorial team", reviewedAt: "2026-11-11", status: "pending-scholarly-review"

**Ayah 2:**
- **Ref:** 2:238
- **Type:** TOPIC_ASSOCIATION
- **Rationale:** "This verse emphasizes the importance of maintaining prayer."
- **Provenance:** method: "editorial curation", curator: "Al-Huda editorial team", reviewedAt: "2026-11-11", status: "pending-scholarly-review"

### Example 2: Patience Topic

**Topic:** Patience (الصبر)

**Ayah 1:**
- **Ref:** 2:153
- **Type:** TOPIC_ASSOCIATION
- **Rationale:** "This verse commands believers to seek help through patience and prayer."
- **Provenance:** method: "editorial curation", curator: "Al-Huda editorial team", reviewedAt: "2026-11-11", status: "pending-scholarly-review"

**Ayah 2:**
- **Ref:** 2:155
- **Type:** TOPIC_ASSOCIATION
- **Rationale:** "This verse describes the trials that test patience."
- **Provenance:** method: "editorial curation", curator: "Al-Huda editorial team", reviewedAt: "2026-11-11", status: "pending-scholarly-review"

## Anti-Patterns

### ❌ Automatic Assignment from Roots

Do not automatically assign ayat to topics based on morphological roots. Root occurrences are linguistic units; topics are thematic categories.

**Example:**
- ❌ "The root ṣ-b-r occurs in 2:153, so this ayah is automatically assigned to the patience topic."
- ✅ "The root ṣ-b-r occurs in 2:153. An editor reviewed this ayah and determined it is thematically related to the patience topic."

### ❌ AI-Generated Classifications

Do not use AI to automatically publish thematic classifications. AI may assist with editorial workflow (candidate discovery, duplicate detection) but must not publish classifications automatically.

**Example:**
- ❌ "AI analyzed the Quran and classified 500 ayat as related to the patience topic."
- ✅ "AI identified 50 candidate ayat for the patience topic. An editor reviewed each candidate and selected 5 for publication."

### ❌ Fabricated Scholarly Approvals

Do not invent scholar names, reviewer identities, or scholarly citations.

**Example:**
- ❌ "This ayah was reviewed by Sheikh Abdullah bin Bayyah and approved for the patience topic."
- ✅ "This ayah was curated by the Al-Huda editorial team and is pending scholarly review."

### ❌ Interpretive Rationales

Do not assert theological conclusions in rationales.

**Example:**
- ❌ "This verse proves that patience is obligatory for all believers."
- ✅ "This verse addresses the command to seek help through patience."

## Validation

### Automated Validation

The following validations run automatically:

- All ayat resolve to valid surah:ayah pairs
- No duplicate memberships within the topic
- All relations have typed relations and rationales
- All relations have provenance
- Topic has sufficient ayat (minimum 4-5)

### Manual Validation

The following validations require manual review:

- Ayat are well-known and widely recognized as related to the topic
- Rationales are neutral and descriptive
- Provenance is accurate and traceable
- Topic provides a balanced overview of the subject

## Metrics

### Sprint 52 Metrics

- **Topics:** 18 (was 11, +7 new)
- **Total Ayat:** 93 (was 56, +37 new)
- **Average Ayat per Topic:** 5.2
- **Relation Types:** 4 (LEXICAL_MATCH, TOPIC_ASSOCIATION, CROSS_REFERENCE, SEQUENTIAL_CONTEXT)
- **Provenance Status:** 100% pending-scholarly-review

### Quality Indicators

- All ayat resolve correctly
- No duplicate memberships
- All relations have typed relations and rationales
- All relations have provenance
- All topics have minimum 4 ayat

## Future Work

- Expand topic library (currently 18, could grow to 25-30)
- Add more ayat to existing topics (currently 5-6 per topic, could grow to 10-15)
- Implement scholarly review workflow
- Add per-relation provenance overrides
- Implement topic-to-journey cross-references
- Add search functionality for topics and ayat

## References

- [SPRINT-52-REPORT.md](SPRINT-52-REPORT.md) — Implementation report
- [POLICY-DECISION-52.md](POLICY-DECISION-52.md) — Policy decisions
- [QURANIC-TAXONOMY-52.md](QURANIC-TAXONOMY-52.md) — Taxonomy documentation
