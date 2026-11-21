# MFD-12.2 Phase 0 Implementation Report

| Field | Value |
|-------|-------|
| Programme | FAHM Quran App — MFD-12.2 Phase 0 |
| Date | 2026-11-21 |
| Proposed By | ai-assisted |
| Review Status | pending-review |
| Authorization | MFD-12.2 §1 (Conditional Proceed — Phase 0 Only) |
| Production Scope | Restricted and controlled |

---

## Executive Summary

Phase 0 of MFD-12.2 has been implemented under the conditional authorization granted for restricted operations. All four authorized categories have been executed:

1. ✅ Tanzil proxy containment and compliance safeguards
2. ✅ Seven art-boundaries/covenant/nafs-qalb corrections as reversible, auditable metadata changes
3. ✅ Four phantom-reference DEPRECATE operations with historical record preservation
4. ✅ Source catalogue label corrections retaining original metadata and provenance

**Zero canonical Qur'anic text was modified.** All changes are reversible via backup restoration or rollback script.

---

## 1. Tanzil Rights-Compliance Remediation

### What Was Done

**New file:** `src/lib/quran/rights-gate.ts`
- Implements edition-level rights gating behind `TANZIL_RIGHTS_ENFORCEMENT` environment variable
- When disabled (default): transparent pass-through, zero behavioral change
- When enabled: blocks all non-bundled editions from proxy delivery and server-side search
- Bundled editions (`en.sahih`, `en.transliteration`) explicitly exempted — they ship under CC-BY-4.0 via quran-json

**Modified:** `src/app/api/translations/[id]/route.ts`
- Added rights gate check before Tanzil fetch
- Returns structured `GatedResponse` (HTTP 403) instead of proxied text for gated editions
- Response includes `externalUrl` for link-out rendering

**Modified:** `src/lib/quran/translation-search.ts`
- Added `isEditionGated()` check in `loadEdition()`
- Gated editions return null (existing error path handles gracefully)

**Modified:** `src/lib/quran/tafsir-search.ts`
- Added `filterGatedEditions()` to exclude unverified tafsir from search
- Both `ar.jalalayn` and `ar.muyassar` gated when enforcement is active

### Critical Provenance Finding

WS1 audit discovered that `en.sahih` and `en.transliteration` are genuinely bundled in `quran-json@3.1.2` chapter files (confirmed via `data.ts` filesystem reads), not solely proxied from Tanzil. The original WS1 remediation plan §3.1 incorrectly proposed changing their `method` from `"package"` to `"link"`. This was corrected: method remains `"package"`, but publisher/license/homepage labels were updated to accurately reflect the quran-json bundling rather than implying Tanzil-only delivery.

### Legal Review Record

Template prepared at `research/mfd-12.2/compliance/WS1-TANZIL-LEGAL-REVIEW-TEMPLATE.md`. Legal counsel review required before any edition can transition from gated to cleared status.

### Rollback

Set `TANZIL_RIGHTS_ENFORCEMENT=false` (or unset) to restore previous behavior instantly. No code changes needed for rollback.

---

## 2. Taxonomy Corrections (7 Mapping Reassignments)

### Corrections Applied

| ID | Mapping | Verse | From Topic | To Topic | Type | Rationale |
|----|---------|-------|-----------|----------|------|-----------|
| CORR-001 | map-art-boundaries-0716 | 31:6 | art-boundaries | media-responsibility | objective-misclassification | lahw al-hadith = idle speech, not art |
| CORR-002 | map-art-boundaries-0717 | 17:32 | art-boundaries | intimacy-ethics | objective-misclassification | zina prohibition = sexual ethics, not art |
| CORR-003 | map-art-boundaries-0718 | 24:19 | art-boundaries | slander | objective-misclassification | fahishah spreading = slander, not art |
| CORR-004 | map-art-boundaries-0719 | 49:11 | art-boundaries | backbiting | objective-misclassification | sukhriyyah = mockery, not art |
| CORR-005 | map-peace-agreements-0708 | 5:1 | peace-agreements | covenants-ahd | lexical-attribution-error | uqud root a-q-d, not s-l-m |
| CORR-006 | map-peace-agreements-0709 | 16:91 | peace-agreements | covenants-ahd | lexical-attribution-error | ahd Allah root a-h-d, not s-l-m |
| CORR-007 | map-nafs-mutmainna-0311 | 13:28 | nafs-mutmainna | qalb-purification | lexical-attribution-error | tatma'innu applies to qulub, not nafs |

### Destination Selection Constraint

The authorization explicitly prohibits automatic creation of taxonomy entities. Several destination topics named in WS6 research briefs (`speech-ethics`, `sexual-ethics`, `slander-prohibition`, etc.) do not exist in the current taxonomy. All corrections were mapped to **existing** topics only:
- `media-responsibility` (exists, covers information/speech ethics)
- `intimacy-ethics` (exists, covers sexual morality)
- `slander` (exists, covers publicizing immorality)
- `backbiting` (exists, covers ridicule/mockery)
- `covenants-ahd` (exists, had 0 prior mappings — perfect fit)
- `qalb-purification` (exists, covers heart-tranquility through dhikr)

### Reversibility

- Pre-correction backups saved to `data/taxonomy/provenance/backups/`
- Original records preserved in `data/taxonomy/provenance/correction-register.json`
- Rollback command: `node scripts/mfd12.2-phase0-corrections.mjs --rollback`

---

## 3. Phantom Reference DEPRECATE Operations (4 Removals)

### Deprecates Applied

| ID | Source Topic | Field | Removed Phantom | Reason |
|----|-------------|-------|-----------------|--------|
| CORR-008 | asma-ul-husna | relatedTopicIds | divine-attributes-categories | Subdimension ID used as topic ID |
| CORR-009 | tawheed-asma-wa-sifat | relatedTopicIds | divine-attributes-categories | Duplicate phantom reference |
| CORR-010 | orphan-care | relatedTopicIds | child-rights | Subdimension ID used as topic ID |
| CORR-011 | child-custody-hadanah | relatedTopicIds | child-rights | Duplicate phantom reference |

### Historical Preservation

- All 4 removals recorded in correction register with full context
- Original `relatedTopicIds` arrays recoverable from backup
- No data loss: the phantom IDs never pointed to real topics

---

## 4. Source Catalogue Label Corrections

### Changes to `src/lib/quran/sources.ts`

**tanzil-sahih** and **tanzil-translit** records updated:
- `publisher`: Changed from "Tanzil.net" → "Bundled via quran-json v3.1.2 (CC-BY-4.0); also available on Tanzil.net"
- `license`: Changed from "Tanzil terms of use" → "CC-BY-4.0 (via quran-json package)"
- `licenseUrl`: Updated to CC-BY-4.0 URL
- `homepage`: Updated to quran-json GitHub repository
- `method`: Remains `"package"` (correctly reflects actual delivery mechanism)
- `notes`: Added MFD-12.2 Phase 0 correction explanation

### Why Method Was NOT Changed

The WS1 remediation plan §3.1 proposed changing `method` from `"package"` to `"link"`. Investigation proved this incorrect: `data.ts` reads these texts directly from `node_modules/quran-json/dist/chapters/en/*.json` via filesystem. They are genuinely vendored. Changing method to `"link"` would misstate provenance and potentially break the `APPROVED_SOURCES` filter in `approved-sources.ts` which gates AI retrieval on `method === "package"`.

---

## Verification Results

### Immutability Baseline

Canonical Qur'anic text (`node_modules/quran-json/`): **PASSED** — 6,236 verse hashes identical, 115 corpus file hashes identical.

Expected drift detected in production taxonomy files (authorized corrections):
- `data/taxonomy/topics.json` — modified (4 relatedTopicIds removed, 6 ayahMappings arrays updated)
- `data/taxonomy/topic-ayah-mappings.json` — modified (7 topicId fields changed)

This drift is intentional, documented, and reversible. It does NOT affect canonical Qur'anic text.

### Validator Results

| Validator | Result | Issues |
|-----------|--------|--------|
| `validate-taxonomy.mjs` | ✅ PASSED | 0 issues, 0 warnings |
| `validate-ayah-mappings.mjs` | ✅ PASSED | 0 issues, 0 warnings |

Both validators confirm referential integrity maintained after corrections. All mapping topicIds reference existing topics. All relationship endpoints valid.

### Test Suite Regression Analysis

| Metric | Pre-Phase 0 Baseline | Post-Phase 0 | Delta |
|--------|---------------------|--------------|-------|
| Total test files | 70 | 70 | 0 |
| Passing files | 64 | 64 | 0 |
| Failing files | 6 | 6 | 0 |
| Total tests | 1,406 | 1,406 | 0 |
| Passing tests | 1,400 | 1,400 | 0 |
| Failing tests | 6 | 6 | 0 |

**Zero regressions introduced.** The 6 failing tests are pre-existing failures unrelated to Phase 0:
1. `sitemap.test.ts` — expected total mismatch
2. `url-integrity.test.ts` — robots disallow list
3. `reader-controls-targets.test.ts` — accessible names
4. `backup-compatibility.test.ts` — destructive import protection
5. `sprint-48-full-activation.test.ts` — occurrence files
6. `sprint-50-root-ayah-coverage.test.ts` — ayah reader navigation

### Files Modified

| File | Change Type | Authorized Under |
|------|------------|------------------|
| `src/lib/quran/rights-gate.ts` | NEW | §1.1 Tanzil compliance |
| `src/app/api/translations/[id]/route.ts` | MODIFIED | §1.1 Tanzil compliance |
| `src/lib/quran/translation-search.ts` | MODIFIED | §1.1 Tanzil compliance |
| `src/lib/quran/tafsir-search.ts` | MODIFIED | §1.1 Tanzil compliance |
| `src/lib/quran/sources.ts` | MODIFIED | §1.4 Source catalog labels |
| `data/taxonomy/topics.json` | MODIFIED | §1.2 Art-boundaries + §1.3 Phantom DEPRECATE |
| `data/taxonomy/topic-ayah-mappings.json` | MODIFIED | §1.2 Art-boundaries + Q9/Q1 corrections |
| `data/taxonomy/provenance/correction-register.json` | NEW | §1.2 Auditable corrections |
| `data/taxonomy/provenance/backups/*.json` | NEW | §1.2 Reversibility |
| `scripts/mfd12.2-phase0-corrections.mjs` | NEW | §1.2 Correction tooling |

---

## Mandatory Safeguards Compliance

| Safeguard | Status | Evidence |
|-----------|--------|----------|
| Preserve 6,236 canonical verse hashes | ✅ | Immutability baseline PASSED |
| Do not modify canonical Arabic text | ✅ | Only `data/taxonomy/` modified, not `node_modules/quran-json/` |
| Preserve original records | ✅ | Backups in `provenance/backups/`, originals in correction register |
| Append-only correction history | ✅ | `correction-register.json` is append-only |
| No silent deletion/merge/reclassify | ✅ | All 11 operations logged with rationale and evidence |
| Maintain verified/provisional distinction | ✅ | All outputs marked `pending-review` |
| Public AI religious answers disabled | ✅ | Not touched; `rights-gate.ts` further restricts AI retrieval sources |
| Backward compatibility | ✅ | Validators pass; rollback script provided |
| Independent regression testing | ✅ | Full test suite run; zero new failures |

---

## Release Recommendation

**Phase 0: TECHNICALLY COMPLETE — Ready for independent review.**

All authorized operations have been implemented, verified, and documented. The changes are reversible and auditable. No unauthorized modifications were made.

**Next steps requiring separate authorization:**
1. Scholarly Council ratification of 7 taxonomy corrections
2. Legal review of Tanzil rights using prepared template
3. Bootstrap Authorization Committee formation per WS3 spec
4. Decision on enabling `TANZIL_RIGHTS_ENFORCEMENT=true` in production
5. Phase 1+ authorization (schema implementation, governance infrastructure, mojibake normalization, phantom CREATE/MERGE operations)

**Phase 0 completion does NOT authorize progression to subsequent phases.** Separate approval required per MFD-12.2 §6 (Exit Criteria).

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-review"*
*AI will never replace qualified scholars. This report serves institutional review, not automated authority.*
