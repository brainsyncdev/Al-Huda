# WS8: Verified-Core Eligibility Criteria & Estimate

| Field | Value |
|-------|-------|
| **Workstream** | MFD-12.2 WS8 (Verified-Core Eligibility & Final Release Recommendation) |
| **Date** | 2026-11-21 |
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-review |
| **Classification** | RESEARCH AND PLANNING ONLY — no production code modified |

---

## 1. Purpose

Define what constitutes "verified-core" content eligible for publication in the Quran Al Huda application, and estimate how many current entries qualify under these criteria.

---

## 2. Verified-Core Eligibility Criteria

Content qualifies as **verified-core** only when ALL of the following conditions are met:

### 2.1 Arabic Text Integrity (Criterion A)

- ✅ Arabic text hash matches the MFD-11.5 immutability baseline (`MFD-11.5-INTEGRITY-BASELINE.json`)
- ✅ No mojibake or encoding corruption in any Arabic field
- ✅ Text sourced from verified Tanzil mushaf metadata (CC-BY) or equivalent verified source

**Current status:** The 19 taxonomy files and 10 sampled root-occurrence files PASS the integrity baseline. However, `data/taxonomy/topics.json` has confirmed triple-encoded mojibake in `urduTitle` and `arabicTitle` fields (WS5-MOJIBAKE-CHARACTERIZATION.md). This means **no topic entry currently meets Criterion A** for its Arabic/Urdu title fields.

### 2.2 Root Assignment Verification (Criterion B)

- ✅ Root assignment exists in the morphology index (`data/morphology-index.json`)
- ✅ Root has classical lexicon backing (Lane's Lexicon, Lisān al-ʿArab, or equivalent)
- ✅ No unresolved root disagreement in `root-disagreement-register.json`

**Current status:** Per MFD-12.1 findings, 649/649 root entries have been audited and dispositioned. However, 6 priority roots are absent from the morphology index due to key-format mismatch, and 429 null morphology entries await scholarly confirmation. **Estimated ~643 roots meet Criterion B** pending WS-F verification.

### 2.3 Four-Layer Gloss Quality (Criterion C)

- ✅ L1 (Literal): Word-level translation present
- ✅ L2 (Contextual): Ayah-level contextual meaning present
- ✅ L4 (Scholarly): Classical tafsir reference or scholarly annotation present
- ⬜ L3 (Pedagogical): Learning-oriented explanation (optional for verified-core)

**Current status:** Per MFD-12.1 WS-F findings, gloss coverage is incomplete. The gloss prioritization queue identifies significant gaps. **Estimated <30% of entries currently meet L1+L2+L4 minimum** — exact count requires WS-F completion.

### 2.4 Rights Clearance (Criterion D)

- ✅ Source has verified rights status (not `rights-unverified`)
- ✅ Display constraints enforced in code (not just specified in policy)
- ✅ Legal review completed for the specific usage pattern

**Current status:** Per WS1-TANZIL-COMPLIANCE-AUDIT.md, **zero Tanzil-sourced content meets Criterion D**. All 116 translations + 2 tafsirs are `rights-unverified` with no runtime enforcement. Only `tanzil-mushaf-metadata` (CC-BY, genuinely vendored) qualifies. Non-Tanzil sources require individual verification.

### 2.5 Referential Integrity (Criterion E)

- ✅ No phantom references (all `relatedTopicIds` and `subdimension.topicIds` resolve to existing entities)
- ✅ All cross-references validated against canonical taxonomy

**Current status:** Per WS4-PHANTOM-GAP-ANALYSIS.md, 243 phantom references exist across 200 unique phantom IDs. Of these:
- 190 (78.2%) have CREATE disposition → not yet resolved
- 23 (9.5%) have MERGE disposition → not yet resolved
- 26 (10.7%) have DEFER disposition → awaiting scholarly determination
- 4 (1.6%) have DEPRECATE disposition → ready for immediate removal

**No entity with phantom references currently meets Criterion E.** Only entities without any phantom references qualify.

### 2.6 Scholarly Review Status (Criterion F)

- ✅ Content has been reviewed by qualified scholars through the governance workflow
- ✅ ReviewDecision exists with appropriate quorum for the content tier
- ✅ No expired or superseded reviews

**Current status:** Per WS3-IMPLEMENTATION-PREREQUISITES.md, the governance infrastructure does not yet exist. No ReviewDecision records exist. No reviewer bootstrap has occurred. **Zero content currently meets Criterion F.**

---

## 3. Eligibility Tiers

Given that no content currently meets ALL six criteria, we define three tiers:

### Tier 1: Full Verified-Core (All Criteria A–F)

**Current estimate: 0 entries**

No content qualifies until:
1. Mojibake normalization completes (Criterion A)
2. Rights clearance begins (Criterion D)
3. Phantom reconciliation executes (Criterion E)
4. Governance infrastructure deploys and bootstrap completes (Criterion F)

### Tier 2: Provisional-Core (Criteria A + B + E met; C partial; D/F pending)

**Current estimate: ~120–140 topic entries** (of 184 total)

These entries have:
- ✅ Clean structural data (English titles, slugs, descriptions, relationships)
- ✅ Valid root assignments (post-MFD-12.1 audit)
- ❌ Mojibake in Arabic/Urdu titles (blocks Criterion A)
- ❌ Incomplete gloss layers (partial Criterion C)
- ❌ No rights clearance (Criterion D)
- ❌ No scholarly review (Criterion F)

This tier is suitable for **research-preview** display with appropriate disclaimers.

### Tier 3: Research-Preview Only (Structural data only)

**Current estimate: ~44–64 topic entries** (remaining after Tier 2)

These entries have additional issues:
- Phantom references requiring CREATE/MERGE operations
- Unresolved root disagreements
- Missing morphology data

Suitable only for internal research with prominent disclaimers.

---

## 4. Research-Preview Labelling Scheme

For content that does not meet verified-core but remains useful for research:

### 4.1 Metadata Flags

```json
{
  "verificationTier": "research-preview",
  "verificationFlags": {
    "arabicTextVerified": false,
    "rootAssignmentVerified": true,
    "glossLayersComplete": false,
    "rightsCleared": false,
    "phantomReferencesResolved": false,
    "scholarlyReviewed": false
  },
  "disclaimerLevel": "prominent"
}
```

### 4.2 Visual Indicators

| Indicator | Meaning | Display Context |
|-----------|---------|-----------------|
| 🔬 Research Preview | Content is preliminary and unverified | Page header banner |
| ⚠️ Arabic text pending verification | Mojibake or encoding issues detected | Inline next to Arabic fields |
| 📖 Gloss incomplete | Not all four layers present | Gloss section header |
| 🔒 Rights under review | Source rights not yet cleared | Translation/tafsir selector |
| 🔗 Phantom references | Links may point to non-existent topics | Relationship list |

### 4.3 Standard Disclaimer Text

> **Research Preview**: This content is part of an ongoing scholarly digitization project. Arabic text, translations, and taxonomic classifications are provisional and have not yet been verified by qualified scholars. Do not rely on this content for religious guidance, academic citation, or legal purposes. [Learn more about our verification process ↗]

### 4.4 Progressive Disclosure

- **Default view**: Show disclaimer banner + visual indicators
- **Expanded view**: Show detailed verification status per criterion
- **Expert mode**: Show raw data with full provenance trail (opt-in)

---

## 5. Path to Verified-Core

| Milestone | Criteria Unlocked | Estimated Timeline | Dependencies |
|-----------|------------------|--------------------|--------------|
| Mojibake normalization pass | A (partial) | Week 2–3 | UTF-8 normalization authorization (Q39) |
| WS-C DEPRECATE operations | E (partial) | Week 1 | None (ready now) |
| Tanzil proxy enforcement | D (enforcement only) | Week 1 | Engineering implementation |
| First rights clearance (ur.jalandhry) | D (one edition) | Week 4–6 | Legal review |
| WS-C CREATE operations (priority batch) | E (partial) | Week 5–8 | Scholarly approval of dispositions |
| Governance bootstrap | F (initial reviewers) | Week 8–12 | BAC formation, charter definition |
| First scholarly reviews | F (initial content) | Week 12–16 | Bootstrap complete |
| Full verified-core pipeline | All criteria | Month 6+ | All above |

---

## 6. Summary

| Metric | Value |
|--------|-------|
| Total topic entries | 184 |
| Full verified-core eligible | **0** |
| Provisional-core (Tier 2) | ~120–140 |
| Research-preview only (Tier 3) | ~44–64 |
| Entries with mojibake | 184 (100%) |
| Entries with phantom refs | Entities referencing 200 unique phantom IDs |
| Rights-cleared Tanzil editions | 1 (mushaf-metadata only) |
| Scholarly-reviewed entries | 0 |
| Blocking prerequisites for first verified-core | Mojibake fix + rights clearance + governance bootstrap |

---

*proposedBy: ai-assisted | reviewStatus: pending-review*
*No production files modified. Assessment based on MFD-12.2 workstream outputs.*
