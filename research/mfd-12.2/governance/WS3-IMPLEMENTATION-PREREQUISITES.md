# WS3: Implementation Prerequisites Checklist

**Status:** Design Proposal (research only — no production code modified)
**Module:** MFD-12.2 Governance Infrastructure Planning
**Date:** 2026-11-21
**Aggregates:** Prerequisites from all five WS-B specs + WS3 planning outputs
**proposedBy:** ai-assisted | **reviewStatus:** pending-review

---

## 1. Purpose

Single consolidated gate list: everything that must exist, be decided, or be signed off BEFORE governance infrastructure implementation begins. Items are grouped by owner, marked blocking vs non-blocking, and cross-referenced to the spec that requires them. Implementation may not start on a component whose blocking prerequisites are open.

Legend: ✅ ready (defined in prior specs) · ⏳ proposed in WS3, awaiting review · ❌ not yet started · **B** = blocking · NB = non-blocking (can follow in later iteration)

---

## 2. Schema & Data Model Prerequisites

| ID | Prerequisite | Status | Owner | Required by | Blocking |
|----|--------------|--------|-------|-------------|----------|
| P-RD | ReviewDecision base schema with reviewerId, priorDecisionId, decision enum | ✅ mfd-12/architecture/entity-schemas/review-decision.schema.json | WS1 | Everything | B |
| P-RD-EXT | ReviewDecision extension fields: reviewScope, targetContentVersion, supersededAt, expiresAt, expiryCategory | ⏳ Needed by WS-B enforcement/quorum/expiry specs; base schema lacks them — extension schema must be authored and reviewed | WS1 + WS3 review | Enforcement, Quorum, Expiry | B |
| P-RI | ReviewerIdentity schema | ⏳ WS3-REVIEWER-IDENTITY-SCHEMA.json | WS3 → scholarly review | Authorization validator, bootstrap | B |
| P-HR | HadithReport schema | ⏳ WS3-HADITH-REPORT-SCHEMA.json | WS3 → scholarly review | Hadith evidence integration | NB (blocks hadith features only) |
| P-ER-EXT | EvidenceRecord.hadithReportId conditional requirement (HR1) | ❌ Extension to EvidenceRecord schema pending | WS4 | Hadith evidence linkage | NB |
| P-SC | ScholarlyClaim schema with claimType, contentVersion, reviewStatus | ✅ mfd-12/architecture/entity-schemas/scholarly-claim.schema.json | WS1 | Quorum, expiry, version pin | B |
| P-TAGS | Claim tag system (`aqeedah`, `fiqh-ruling`, `thematic-mapping`, `verse-mapping`, `modern-kalam`) | ❌ Pending; quorum tier + expiry category resolution depend on tags | WS1 / Editorial | Quorum §3, Expiry §3.2 | B |
| P-TRAD | Canonical tradition vocabulary (normalized strings: Hanafi, Shafi'i, Ash'ari, Maturidi, …) with NFC/case-folding rules | ❌ Pending; free-text traditions break T3/T4 diversity checks | Scholarly Advisory | Quorum §5.1 | B |
| P-DOMAIN | Claim-type → expertise-domain mapping sign-off (WS3-QUORUM §5.1 table) | ⏳ Proposed | Scholarly Advisory | Authorization + quorum | B |
| P-DS | DisagreementSet.isGenuine + traditions fields | ✅ EVIDENCE-MODEL §7.2 | WS4 | T4 tier | B |
| P-LOC | ReferenceLocator schema alignment: WS3 HadithReport inlines a locator object; must be reconciled with SOURCE-REGISTRY-SPEC §4 `$ref` form | ⏳ Reconciliation needed before codegen | WS4 + WS3 | HadithReport validation | NB |

---

## 3. Storage & Infrastructure Prerequisites

| ID | Prerequisite | Status | Owner | Required by | Blocking |
|----|--------------|--------|-------|-------------|----------|
| P-ADAPTER | Storage adapter interface (uniform INSERT-only write path for decisions; read queries for validators) | ❌ Pending | Infrastructure | Layer 1 pipeline | B |
| P-SQL | SQL DDL for review_decisions + reviewer_identities incl. triggers, FK, partial unique index, CHECK (WS3-ENFORCEMENT §3) per supported dialect | ❌ Pending; dialect list must be fixed first (PostgreSQL/MySQL/SQLite differ on partial indexes & trigger syntax) | Infrastructure | Layer 2 | B for SQL deployments |
| P-CRDT | CRDT library selection (Automerge / Yjs / custom) with custom merge-function support | ❌ Pending; note: stock LWW registers do NOT satisfy Layer 3 — chosen library must allow merge interception | Infrastructure | Layer 3 | B for local-first deployments |
| P-HLC | Hybrid Logical Clock implementation with per-device node IDs | ❌ Pending | Infrastructure | CRDT ordering (CR2) | B for local-first |
| P-FK | FK-capable storage for reviewerId → ReviewerIdentity | ❌ Pending (noted in WS-B credentialing §5) | Infrastructure | Authorization integrity | B |
| P-TX | Transaction boundary spanning Layer 1 validation + write (P-2 rule) | ❌ Pending | Infrastructure | Race-free single-effective invariant | B |
| P-BATCH | ReviewBatch atomicity mechanism (all-or-nothing commit) | ❌ Pending (REVIEW-WORKFLOW §12 q3) | Infrastructure | Batch quorum mode | NB (rolling mode ships first) |
| P-CLOCK | Injectable clock abstraction across validators, quorum, expiry | ❌ Pending | Infrastructure | Testability TR-4, EA-1 | B |
| P-CAL | Hijri/Gregorian dual-calendar date library | ❌ Pending | Infrastructure | Expiry category boundary + display | NB (Gregorian-only first) |
| P-NOTIF | Local notification outbox with dedupe (offline-safe) | ❌ Pending | Infrastructure | Expiry scanner §5.3 | NB |
| P-AUDIT | Append-only audit log store (bootstrap log + credential-change log RC-NF4) | ❌ Pending; reuse decision storage pattern | Infrastructure | Bootstrap, credentialing | B |
| P-CONFIG | Governance config surface: BOOTSTRAP_MODE flag, enforcement layers config, expiry policy values — with change auditing | ❌ Pending | Infrastructure | Bootstrap, enforcement §7, expiry §8 | B |

---

## 4. Governance & Human Prerequisites

| ID | Prerequisite | Status | Owner | Required by | Blocking |
|----|--------------|--------|-------|-------------|----------|
| P-BAC | Bootstrap Authorization Committee formed; founding authority document identified (charter/waqf deed) | ❌ Pending — no governance body currently exists | Project Lead | Bootstrap §2 | B |
| P-ROSTER | Initial reviewer candidate roster with documentary qualification evidence | ❌ Pending | Project Lead + Scholar Advisor | Bootstrap Phase 1 | B |
| P-PRIVACY | Privacy policy for reviewer PII (contactHash scheme, pseudonymity rules, retention) | ❌ Pending (WS-B credentialing §5) | Legal / Rights | ReviewerIdentity registration | B |
| P-SIGNOFF-SCHEMAS | Scholarly review sign-off of WS3-REVIEWER-IDENTITY-SCHEMA.json and WS3-HADITH-REPORT-SCHEMA.json (both pending-review) | ⏳ Awaiting review | Scholarly Advisory | All downstream code | B |
| P-SIGNOFF-POLICY | Scholarly sign-off of WS3 corrections C1–C3 to WS-B quorum pseudocode (T4 precedence, ENDORSE rooting, expiry exclusion) | ⏳ Awaiting review | Scholarly Advisory | Quorum implementation | B |
| P-GRADE-VOCAB | Grading vocabulary alignment across traditions (SAHIH/HASAN/DAIF… semantics per school) | ❌ Pending (WS-B hadith §5) | Scholarly Advisory | HadithReport gradings | NB |
| P-EXPIRY-POLICY | Ratification of expiry category table + 90-day grace + 1900 CE boundary as governance policy | ⏳ Proposed in WS-B + WS3 | Scholarly Advisory + Project Lead | ExpiryAssigner | B |
| P-QUORUM-POLICY | Ratification of tier thresholds (T1=1, T2=2, T3=3+diversity, T4=per-tradition) | ⏳ Proposed in WS-B | Scholarly Advisory | Quorum config | B |

---

## 5. Verification & QA Prerequisites

| ID | Prerequisite | Status | Owner | Required by | Blocking |
|----|--------------|--------|-------|-------------|----------|
| P-TESTENV | Isolated test environment with resettable storage; bootstrap tests never touch production (TR-3) | ❌ Pending | QA / Infrastructure | All test cases | B |
| P-TESTSUITE | Automated suite implementing every TC-* in WS3-PERMISSION-TEST-CASES, runnable in CI against BOTH SQL and CRDT backends (TR-1/2) | ❌ Pending | QA | Definition of functional | B |
| P-PROPERTY | Property-based tests for quorum monotonicity/determinism (QA-2..4 in WS3-QUORUM §10) | ❌ Pending | QA | Quorum acceptance | B |
| P-HVM | Hadith-specific verification methods (matn-at-locator comparison procedure) | ❌ Pending (WS-B hadith §5) | WS4 | Hadith verification lifecycle | NB |
| P-INGEST | Hadith collection ingestion pipeline | ❌ Pending | Data Engineering | Populating HadithReport | NB |

---

## 6. Dependency Ordering (Implementation Sequence)

```text
Stage 0 — Decisions & sign-offs (no code)
  P-BAC, P-ROSTER, P-PRIVACY, P-SIGNOFF-SCHEMAS, P-SIGNOFF-POLICY,
  P-QUORUM-POLICY, P-EXPIRY-POLICY, P-DOMAIN, P-TRAD, P-TAGS
        │
Stage 1 — Contracts
  P-RD-EXT (ReviewDecision extension schema)
  P-ADAPTER, P-TX, P-CLOCK, P-CONFIG, P-AUDIT
        │
Stage 2 — Enforcement core
  Layer 1 validators + P-SQL (or P-CRDT + P-HLC) + P-FK
  P-TESTENV + P-TESTSUITE (TC-AUTH-*, TC-ENF-*)
        │
Stage 3 — Identity lifecycle
  Bootstrap process execution (P-CONFIG BOOTSTRAP_MODE)
  TC-BOOT-* green → window closed
        │
Stage 4 — Quorum & expiry
  computeQuorum + ExpiryService (P-CLOCK mandatory)
  TC-QRM-*, TC-EXP-*, property tests green
        │
Stage 5 — Hadith integration (parallelizable after Stage 2)
  P-HR sign-off, P-ER-EXT, P-LOC, P-HVM, P-INGEST, P-GRADE-VOCAB
  TC-INT-002 green
        │
Stage 6 — Batch mode & polish
  P-BATCH, P-CAL, P-NOTIF, full TC-INT-* matrix
```

Hard rules:
1. No production governance code before Stage 0 sign-offs are recorded (schemas are `pending-review` until then).
2. Bootstrap (Stage 3) may only execute after Stage 2 tests are green — the bootstrap test decisions in Phase 3 are meaningless otherwise.
3. Hadith features (Stage 5) are severable: governance core ships without them; `evidenceKind: HADITH_REPORT` remains rejected-with-clear-error until P-HR/P-ER-EXT land.

---

## 7. Risk Register (top items)

| Risk | Impact | Mitigation |
|------|--------|------------|
| No governance body exists yet (P-BAC) | Entire bootstrap blocked; chicken-and-egg persists | Escalate to Project Lead as first action; interim: system operates read-only for review features |
| Base ReviewDecision schema missing reviewScope/targetContentVersion/supersededAt (P-RD-EXT) | Validators reference fields that don't exist; silent no-op enforcement | Author extension schema FIRST in Stage 1; add schema-conformance test asserting field presence |
| Stock CRDT libraries lack merge interception (P-CRDT) | Layer 3 unimplementable as specified | Evaluate early (spike); fallback: event-log CRDT (append-only op log) which is naturally append-only |
| Free-text traditions (P-TRAD) | T3/T4 diversity silently miscounts ("Hanafi" vs "hanafi" vs "Ḥanafī") | Canonical vocabulary + normalization before any T3/T4 claim enters review |
| Single-effective race under concurrent writes | Two effective decisions despite validator | P-TX transaction + Layer 2 partial unique index as arbiter; CRDT: post-merge sweep flags for human resolution (CR1) |
| Expiry scanner downtime on offline devices | Lapsed content briefly visible | Read-time publication gate (§6 of expiry spec) is independent of scanner |

---

## 8. Definition of Ready (summary)

Implementation of the governance core may begin when ALL of the following hold:

- [ ] Every **B**-marked item in §§2–5 is ✅ or has recorded scholarly/governance sign-off
- [ ] WS3 schemas and policy corrections moved from `pending-review` to approved by the Scholarly Advisory body
- [ ] P-RD-EXT extension schema authored, reviewed, and conformance-tested
- [ ] Storage backend(s) selected and adapter contract frozen
- [ ] Test environment provisioned; TC-AUTH/TC-ENF suites scaffolded
- [ ] BAC formed and bootstrap roster verified (may complete during Stage 2, must exist before Stage 3)

---

*End of Specification*
