# WS8: Regression Risk Assessment

| Field | Value |
|-------|-------|
| **Workstream** | MFD-12.2 WS8 (Verified-Core Eligibility & Final Release Recommendation) |
| **Date** | 2026-11-21 |
| **proposedBy** | ai-assisted |
| **reviewStatus** | pending-review |
| **Classification** | RESEARCH AND PLANNING ONLY — no production code modified |

---

## 1. Purpose

Assess regression risk for each proposed change across all MFD-12.2 workstreams. This matrix evaluates the likelihood that implementing each change will break existing functionality, and recommends mitigation strategies.

---

## 2. Risk Matrix

### 2.1 Tanzil Proxy Enforcement (WS1)

| Risk Factor | Assessment |
|-------------|------------|
| **Change Scope** | API route gating, client store update, UI fallback rendering |
| **Regression Likelihood** | HIGH |
| **Regression Impact** | HIGH — removes in-app display of 116 translations + 2 tafsirs |
| **User-Facing Effect** | Users lose side-by-side translation comparison; must use external links |
| **Data Loss Risk** | NONE — no data deleted; only delivery blocked |
| **Rollback Complexity** | LOW — feature flag `TANZIL_RIGHTS_ENFORCEMENT` enables instant rollback |
| **Test Coverage Needed** | Unit tests for gate logic, integration tests for API responses, manual QA for UI fallback |
| **Mitigation** | Feature flag (WS1 §3.1); graceful degradation UI (WS1 Phase 2); clear user messaging (WS1 Phase 4); priority rights clearance queue (WS1 §5.3) |
| **Overall Risk** | 🟡 **MEDIUM-HIGH** — High impact but fully reversible with feature flag. Legal risk of NOT deploying exceeds regression risk. |

**Key Regression Scenarios:**
1. User's saved `translationId` becomes gated → must show link-out UI, not blank screen
2. Search returns empty results for gated editions → must not crash search page
3. Tafsir panel shows link-out instead of text → must preserve attribution display
4. AI grounding module references gated edition → must handle null gracefully

---

### 2.2 Schema Additions (WS2)

| Risk Factor | Assessment |
|-------------|------------|
| **Change Scope** | 3 new entity types (Subdimension, WordTranslation, LearningProgress), 1 new relationship type (CROSS_LINGUAL_VARIANT), schema constraints on existing entities |
| **Regression Likelihood** | LOW |
| **Regression Impact** | MEDIUM — IndexedDB version upgrade could fail on older browsers |
| **User-Facing Effect** | None initially (schema-only); new features appear after migration |
| **Data Loss Risk** | LOW — additive changes only; existing entities unchanged |
| **Rollback Complexity** | MEDIUM — IndexedDB version cannot be downgraded; requires backup restore |
| **Test Coverage Needed** | Schema validation unit tests, IndexedDB upgrade integration tests, cross-reference validation |
| **Mitigation** | Feature detection for IndexedDB; old DB continues working; ID alias table for backward compatibility; test against copy before production migration |
| **Overall Risk** | 🟢 **LOW** — Additive schema changes with comprehensive implementation checklist. Primary risk is IndexedDB upgrade failure on edge cases. |

**Key Regression Scenarios:**
1. IndexedDB upgrade fails on older browser → graceful degradation, old stores continue working
2. Dimension.subdimensionIds pattern constraint rejects existing data → validate all existing IDs before deploying constraint
3. CROSS_LINGUAL_VARIANT edges created prematurely → schema-only now; edges deferred to scholarly review
4. WordTranslation corpus misalignment → deferred population; corpus version pinning at import

---

### 2.3 Phantom CREATE/MERGE Operations (WS4)

| Risk Factor | Assessment |
|-------------|------------|
| **Change Scope** | Create 190 new topic entries, merge 23 topic pairs, deprecate 4 erroneous references |
| **Regression Likelihood** | MEDIUM |
| **Regression Impact** | MEDIUM — new topics appear in navigation/search; merges change topic identity |
| **User-Facing Effect** | New topics visible in explorer; merged topics redirect to canonical target |
| **Data Loss Risk** | LOW for CREATE (additive); MEDIUM for MERGE (source topic absorbed into target) |
| **Rollback Complexity** | MEDIUM — CREATE can be reversed by deletion; MERGE requires backup restore |
| **Test Coverage Needed** | Post-migration referential integrity check, search index rebuild verification, navigation tree validation |
| **Mitigation** | Execute DEPRECATE first (lowest risk); batch CREATE by reference count priority; MERGE only after scholarly approval; maintain ID alias table for merged topics; full backup before execution |
| **Overall Risk** | 🟡 **MEDIUM** — CREATE operations are low-risk additions. MERGE operations require careful execution with backup. All dispositions already classified and verified. |

**Key Regression Scenarios:**
1. Created topic has duplicate slug with existing topic → slug uniqueness validation before creation
2. Merged topic's incoming references not updated → automated reference rewrite script + post-migration audit
3. Navigation tree exceeds display capacity → pagination/virtualization already implemented
4. Search index stale after bulk creation → trigger reindex post-migration

---

### 2.4 Mojibake Normalization (WS5)

| Risk Factor | Assessment |
|-------------|------------|
| **Change Scope** | Triple-encoded UTF-8 correction across 184 topic entries (urduTitle + arabicTitle fields) |
| **Regression Likelihood** | MEDIUM-HIGH |
| **Regression Impact** | HIGH — incorrect normalization produces garbled text worse than mojibake |
| **User-Facing Effect** | Arabic/Urdu titles become readable (if correct) or more corrupted (if wrong) |
| **Data Loss Risk** | MEDIUM — incorrect decode pass destroys information irreversibly |
| **Rollback Complexity** | LOW if backup exists; IMPOSSIBLE without backup |
| **Test Coverage Needed** | Per-entry round-trip verification (encode→decode→compare); sample human review of normalized output; automated mojibake signature detection post-normalization |
| **Mitigation** | Full backup before normalization; mixed-depth detection (triple vs double per entry); human review of sampled output; CI lint check for mojibake signatures post-fix; execute on copy first |
| **Overall Risk** | 🔴 **HIGH** — Mixed encoding depth (triple vs double) makes automated normalization error-prone. Requires per-entry depth detection and human verification. Scholarly authorization (Q39) required before execution. |

**Key Regression Scenarios:**
1. Triple-decode applied to double-encoded entry → over-correction produces different mojibake
2. Double-decode applied to triple-encoded entry → still mojibake, just less corrupted
3. Normalization script uses wrong codepage (Latin-1 instead of CP1252) → replacement characters for bytes 0x80–0x9F
4. Partial normalization leaves file in inconsistent state → atomic write (all-or-nothing)

---

### 2.5 Art-Boundaries Corrections (WS-A from MFD-12.1)

| Risk Factor | Assessment |
|-------------|------------|
| **Change Scope** | Reclassify Q10 art-boundaries topic; fix Q9 covenant misplacements (5:1, 16:91); reclassify Q1 nafs/qalb (13:28) |
| **Regression Likelihood** | LOW |
| **Regression Impact** | LOW — small number of targeted corrections |
| **User-Facing Effect** | Corrected ayah-topic mappings improve accuracy |
| **Data Loss Risk** | NONE — reclassification only, no deletion |
| **Rollback Complexity** | LOW — reverse the specific mapping changes |
| **Test Coverage Needed** | Verify corrected mappings resolve to valid topics; verify no orphaned mappings created |
| **Mitigation** | Apply as atomic commit; verify post-application referential integrity; these are objective error corrections identified by WS-A |
| **Overall Risk** | 🟢 **LOW** — Small, well-defined corrections with clear evidence basis. Ready for immediate application per MFD-12.1 recommendation. |

---

### 2.6 Governance Infrastructure (WS3)

| Risk Factor | Assessment |
|-------------|------------|
| **Change Scope** | ReviewDecision enforcement middleware, reviewer identity system, quorum computation, expiry service |
| **Regression Likelihood** | LOW (not deployed yet) |
| **Regression Impact** | N/A — infrastructure does not exist in production |
| **User-Facing Effect** | None until governance features ship |
| **Data Loss Risk** | NONE — purely additive infrastructure |
| **Rollback Complexity** | N/A |
| **Test Coverage Needed** | Full TC-* test suite from WS3-PERMISSION-TEST-CASES; property-based tests for quorum monotonicity |
| **Mitigation** | 6-stage implementation sequence with hard gates; no production code until Stage 0 sign-offs complete |
| **Overall Risk** | 🟢 **LOW** — Not yet in production. Risk is future implementation risk, not current regression risk. Prerequisites checklist ensures readiness before coding begins. |

---

## 3. Risk Summary Table

| Proposed Change | Likelihood | Impact | Overall | Deployable Now? | Blocking Prerequisite |
|-----------------|-----------|--------|---------|-----------------|----------------------|
| Tanzil proxy enforcement | HIGH | HIGH | 🟡 MEDIUM-HIGH | ✅ Yes (with feature flag) | Engineering implementation |
| Schema additions (WS2) | LOW | MEDIUM | 🟢 LOW | ❌ No | Scholarly approval of WS-D resolutions |
| Phantom CREATE operations | LOW | LOW | 🟢 LOW | ⚠️ Partial (DEPRECATE only) | Scholarly approval of dispositions |
| Phantom MERGE operations | MEDIUM | MEDIUM | 🟡 MEDIUM | ❌ No | Scholarly approval + backup |
| Mojibake normalization | MEDIUM-HIGH | HIGH | 🔴 HIGH | ❌ No | Q39 authorization + human review |
| Art-boundaries corrections | LOW | LOW | 🟢 LOW | ✅ Yes | None (ready per MFD-12.1) |
| Governance infrastructure | LOW | N/A | 🟢 LOW | ❌ No | Stage 0 sign-offs (BAC, schemas, policies) |

---

## 4. Cross-Cutting Risks

### 4.1 Cumulative Regression

Implementing multiple changes simultaneously increases interaction risk. Recommended isolation:
- **Batch 1 (independent):** Tanzil enforcement + art-boundaries corrections (no shared code paths)
- **Batch 2 (after Batch 1):** Phantom DEPRECATE operations
- **Batch 3 (after scholarly approval):** Schema additions + phantom CREATE
- **Batch 4 (after Q39 authorization):** Mojibake normalization (standalone, with full backup)
- **Batch 5 (after Stage 0):** Governance infrastructure

### 4.2 Test Infrastructure Gap

No automated test suite currently covers the Tanzil proxy, translation store, or tafsir viewer. Implementing WS1 without tests increases regression risk. **Recommendation:** Write tests BEFORE implementing enforcement.

### 4.3 Backup Verification

Before any data-modifying operation (normalization, phantom CREATE/MERGE), verify that:
1. Full `data/` backup exists and is restorable
2. Git clean state confirmed (no uncommitted production changes)
3. Integrity baseline hashes recorded for post-operation verification

---

*proposedBy: ai-assisted | reviewStatus: pending-review*
*No production files modified. Assessment based on MFD-12.2 workstream outputs.*
