# WS-E: Edition-Level Rights Variance Validation (Q33)

**Status:** Proposed  
**proposedBy:** ai-assisted  
**reviewStatus:** pending-scholarly-review  
**Date:** 2026-11-21  
**Module:** MFD-12.1 Evidence Governance Framework  
**Input Reference:** MFD-12-SOURCE-REGISTRY-SPEC.md §3, §5.1, §7(Q5)

---

## 1. Current State

### Documentation Status
- **MFD-12-SOURCE-REGISTRY-SPEC.md §5.1**: Defines two-level rights hierarchy:
  1. Source-level `rightsStatus`: Most restrictive across all editions (default)
  2. Edition-level `rightsOverride`: Optional per-edition override
- Resolution rule: `effectiveRights(edition) = edition.rightsOverride ?? source.rightsStatus`
- **§7 Open Question Q5**: Asks whether multi-language sources with different rights should be modeled as separate sources or editions; notes current design uses editions and requests validation.

### Schema Status
- `edition.rightsOverride` enum: `["public-domain", "cc-by-4.0", "cc-by-sa-4.0", "cc-by-nc-4.0", "proprietary-restricted", "rights-unverified"]`
- Source-level `rightsStatus` includes additional values: `cc-by-nc-sa-4.0`, `cc-zero-1.0`, `mit`, `apache-2.0`, `rights-disputed`
- **Asymmetry detected**: Edition override enum is a strict subset of source status enum. Missing: `cc-by-nc-sa-4.0`, `cc-zero-1.0`, `mit`, `apache-2.0`, `rights-disputed`.

### Real-World Cases to Validate
1. **Ibn Kathir**: Arabic original (public domain, d. 774H) vs. English abridgement (CC-BY-NC or proprietary)
2. **Tanzil Translations**: Multiple translators, mixed licenses, single aggregation source
3. **Modern Tafsir**: Original Arabic (author copyright) vs. English translation (translator/publisher copyright)
4. **Hadith Collections**: Classical text (PD) vs. critical edition (editor copyright) vs. translation (translator copyright)
5. **Digital Datasets**: Derived works where base is PD but curation/annotation is copyrighted

---

## 2. Risk Analysis

### Legal Risk
| Scenario | Current Model Handling | Risk |
|----------|----------------------|------|
| PD original + CC-BY-NC translation | `rightsOverride` on translation edition | LOW — correctly modeled |
| PD original + proprietary critical edition | `rightsOverride` on critical edition | LOW — correctly modeled |
| Translation A (CC-BY) + Translation B (Proprietary) same source | Both get `rightsOverride` | LOW — correctly modeled |
| Edition with MORE restrictive terms than source default | Source default is "most restrictive" | MEDIUM — contradicts §5.1 definition |
| Edition with UNKNOWN rights while source is cleared | `rightsOverride: rights-unverified` | LOW — correctly modeled |
| Dataset derived from PD source but annotations copyrighted | Not clearly modeled | HIGH — needs clarification |

### Scholarly Risk
- Incorrect rights inheritance may cause scholars to assume broader permissions than exist.
- Missing `rights-disputed` at edition level prevents granular dispute tracking.
- Critical editions often contain scholarly apparatus (footnotes, introductions) with separate copyrights not captured.

### Technical Risk
- Enum asymmetry causes validation failures or silent data loss during edition creation.
- Resolution rule assumes fallback to source, but "most restrictive" semantic conflicts with permissive source + restrictive edition scenarios.

---

## 3. Recommended Policy

### Primary Recommendation: Clarify Semantics + Fix Enum Asymmetry + Add Derivative Works Support

**Rationale:** The two-level model is fundamentally sound but has implementation gaps and semantic ambiguities that create edge-case failures.

### Policy Directives

1. **Fix Enum Asymmetry Immediately**: Edition `rightsOverride` MUST support all values from source `rightsStatus`. Current omission of `cc-by-nc-sa-4.0`, `cc-zero-1.0`, `mit`, `apache-2.0`, `rights-disputed` is a schema bug.

2. **Clarify "Most Restrictive" Semantic**: 
   - Source-level `rightsStatus` represents the MOST RESTRICTIVE status across ALL editions.
   - This is a COMPUTED property, not an authored one.
   - When any edition changes rights, source-level must be recomputed.
   - Add invariant: `source.rightsStatus === max_restrictiveness(editions[].effectiveRights)`

3. **Handle Derivative Works Explicitly**:
   - Add `edition.derivativeOfWork` field linking to parent source/edition.
   - Derivative editions inherit base rights UNLESS `rightsOverride` specified.
   - Annotations/critical apparatus treated as separate intellectual property.

4. **Multi-Language Modeling Decision**:
   - CONFIRMED: Translations ARE editions of the same source, not separate sources.
   - Rationale: Bibliographic identity is shared; only expression differs.
   - Exception: When translation includes substantial commentary/adaptation beyond linguistic conversion, model as separate source with `relatedSources` link.

5. **Critical Edition Handling**:
   - Critical editions with editorial apparatus MUST use `rightsOverride` even if base text is PD.
   - Add `edition.editorialContributionType` enum: `["critical-apparatus", "annotations", "introduction", "translation", "abridgement", "none"]`.
   - Each contribution type may have independent rights; document in `rightsNotes`.

6. **Computed Field Enforcement**:
   - Source `rightsStatus` should be auto-computed on edition save.
   - Manual override allowed only with explicit justification in `rightsNotes`.
   - Validation warning when manual source status is less restrictive than any edition.

---

## 4. Schema Changes

### Edition Entity Fixes and Additions

**Fix enum (replace existing `rightsOverride`):**
```jsonc
"rightsOverride": {
  "type": "string",
  "enum": [
    "public-domain",
    "cc-by-4.0",
    "cc-by-sa-4.0",
    "cc-by-nc-4.0",
    "cc-by-nc-sa-4.0",
    "cc-zero-1.0",
    "mit",
    "apache-2.0",
    "proprietary-restricted",
    "rights-unverified",
    "rights-disputed"
  ],
  "description": "Edition-specific rights override. Must match source rightsStatus enum. If absent, inherits source.rightsStatus."
}
```

**Add fields:**
```jsonc
"derivativeOfWork": {
  "type": "object",
  "properties": {
    "parentSourceId": { "type": "string", "pattern": "^src-[a-z0-9][a-z0-9-]{2,63}$" },
    "parentEditionId": { "type": "string" },
    "relationshipType": {
      "enum": ["translation", "abridgement", "commentary", "critical-edition", "adaptation", "digitization"],
      "description": "Nature of derivation."
    }
  },
  "description": "Links derivative editions to their base work. Required for translations and critical editions."
},
"editorialContributionType": {
  "type": "array",
  "items": {
    "enum": ["critical-apparatus", "annotations", "introduction", "translation", "abridgement", "digitization", "none"]
  },
  "description": "Types of editorial contribution in this edition. Each may have independent rights. Document in rightsNotes."
},
"componentRights": {
  "type": "array",
  "items": {
    "type": "object",
    "required": ["component", "rightsStatus"],
    "properties": {
      "component": { "enum": ["base-text", "translation", "annotations", "introduction", "critical-apparatus", "digitization"] },
      "rightsStatus": { "type": "string" },
      "rightsHolder": { "type": "string" },
      "notes": { "type": "string" }
    }
  },
  "description": "Granular rights breakdown when edition contains multiple IP components. Supplements but does not replace rightsOverride."
}
```

### Source Entity Computation Note

**Add documentation field (not stored, computed):**
```jsonc
"computedFromEditions": {
  "type": "boolean",
  "description": "Indicates rightsStatus was auto-derived from edition rights. False if manually set with justification."
}
```

---

## 5. Implementation Notes

### Storage
- Edition `rightsOverride` enum fix requires migration validation (no data loss expected since missing values were unusable).
- `componentRights` array stored inline; indexed for rights queries.
- `derivativeOfWork` creates foreign key relationship; enforce referential integrity.

### Computation Logic
```typescript
function computeSourceRights(editions: Edition[]): RightsStatus {
  const restrictivenessOrder = [
    'rights-disputed',
    'proprietary-restricted', 
    'rights-unverified',
    'cc-by-nc-sa-4.0',
    'cc-by-nc-4.0',
    'cc-by-sa-4.0',
    'cc-by-4.0',
    'apache-2.0',
    'mit',
    'cc-zero-1.0',
    'public-domain'
  ];
  
  return editions.reduce((mostRestrictive, edition) => {
    const effective = edition.rightsOverride ?? mostRestrictive;
    return restrictivenessOrder.indexOf(effective) < restrictivenessOrder.indexOf(mostRestrictive)
      ? effective 
      : mostRestrictive;
  }, 'public-domain');
}
```

### Display
- Edition selector shows per-edition rights badge.
- When viewing derivative edition, show "Based on [Parent]" link.
- Component rights displayed in expandable detail panel.

### Validation
- On edition save: recompute source rights, warn if manual override is less restrictive.
- Block edition creation with `rightsOverride` value not in source enum (after fix, this is moot).
- Require `derivativeOfWork` when `editorialContributionType` includes `translation` or `critical-edition`.

### Edge Cases Handled
1. **PD base + copyrighted translation**: Translation edition gets `rightsOverride: cc-by-nc-4.0`; source auto-computes to `cc-by-nc-4.0`.
2. **Multiple translations, mixed licenses**: Each translation edition has own override; source reflects most restrictive.
3. **Critical edition of PD text**: Edition carries `editorialContributionType: ["critical-apparatus"]` + `componentRights` separating base text (PD) from apparatus (copyrighted).
4. **Disputed edition in cleared source**: Edition gets `rightsOverride: rights-disputed`; source remains at next-most-restrictive cleared edition's status.
