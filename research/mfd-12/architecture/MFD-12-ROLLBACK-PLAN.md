# MFD-12 — Rollback Plan

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Work Package | WS7 — Migration & Compatibility |
| Date | 2026-11-21 |
| Status | draft-design |
| Companion Documents | MFD-12-MIGRATION-MAP.json, MFD-12-MIGRATION-PLAN.md, MFD-12-COMPATIBILITY-REPORT.md |

---

## 1. Philosophy

The MFD-12 migration follows a **non-destructive, append-first** strategy. Legacy production data files are never modified in place; canonical entities are written to a new store alongside them. Rollback is therefore a matter of switching the active data source pointer, not reversing mutations.

---

## 2. Pre-Migration Safeguards

### 2.1 Snapshot Creation

Before any migration phase executes:

```bash
# Create immutable snapshot of production data
cp -r data/ data/.pre-mfd12-snapshot-{YYYY-MM-DDTHH-MM}/

# Generate checksums for integrity verification
find data/ -name "*.json" -exec sha256sum {} \; > data/.checksums-pre-migration.txt

# Tag in version control
git tag mfd12-pre-migration-{YYYYMMDD}
```

### 2.2 Snapshot Contents

The snapshot captures:
- `data/taxonomy/` — all 12 JSON files + 7 PowerShell build scripts
- `data/root-occurrences/` — all 1,576 JSON files
- `data/audit/` — all 11 audit report files

### 2.3 Snapshot Verification

After creation, verify:
1. File count matches expected inventory
2. SHA-256 checksums computed successfully
3. Snapshot directory is marked read-only to prevent accidental modification

---

## 3. Rollback Scenarios

### Scenario A: Migration Fails Mid-Execution

**Trigger**: Any phase validation checkpoint fails (V1-V8)

**Rollback Procedure**:
1. Halt migration pipeline immediately
2. Discard partially-written canonical entity store
3. Application continues reading from legacy `data/taxonomy/` and `data/root-occurrences/`
4. No user-facing impact (canonical store was never activated)
5. Log failure details for debugging

**Data Loss Risk**: None. Legacy files untouched.

---

### Scenario B: Migration Completes but Validation Fails Post-Activation

**Trigger**: Schema validation errors, referential integrity violations, or semantic drift detected after canonical store is activated

**Rollback Procedure**:
1. Switch application data source pointer from canonical store back to legacy files
   - Configuration change: `DATA_SOURCE=legacy` instead of `DATA_SOURCE=canonical`
2. Restart application services
3. Verify legacy data loads correctly using pre-migration checksums
4. Quarantine canonical store for forensic analysis (do NOT delete)
5. Notify scholarly team of rollback

**Data Loss Risk**: Low. User interactions during the brief canonical-active window may reference canonical IDs. Cross-reference with ID alias table to remap.

---

### Scenario C: Phantom Reference Removal Causes Downstream Issues

**Trigger**: Applications or user bookmarks depended on the 243 phantom references that were logged and excluded during migration

**Rollback Procedure**:
1. Restore phantom references from `migration-phantom-log.json`
2. Create stub Topic entities for referenced-but-missing IDs
3. Mark stubs with `reviewStatus: "DEPRECATED"` and `description: "Auto-restored phantom reference"`
4. Re-run Phase 3 validation

**Alternative**: If stubs are undesirable, perform targeted rollback of Phase 3 only:
1. Replace canonical Topic store with legacy `topics.json` (transformed)
2. Keep other phases intact (they don't depend on phantom resolution)

**Data Loss Risk**: Medium. If phantom references were silently used by UI components, their removal causes broken links. Mitigation: comprehensive search for phantom ID usage in `src/` before migration.

---

### Scenario D: Backup Restore Fails Post-Migration

**Trigger**: User attempts to restore a v10 backup after app has migrated to v11 canonical format, and adapter layer fails

**Rollback Procedure**:
1. Fall back to dual-read mode: app reads both legacy and canonical stores
2. Restore v10 backup using legacy adapter path
3. Re-attempt canonical transformation with fixed adapter
4. If adapter cannot be fixed, maintain legacy store alongside canonical indefinitely for this user

**Data Loss Risk**: Low. Backup data is preserved; only the transformation pathway is broken.

---

### Scenario E: Catastrophic Failure (File Corruption, Disk Error)

**Trigger**: Physical data corruption during migration (power loss, disk failure, process crash mid-write)

**Rollback Procedure**:
1. Assess damage scope using checksums
2. Restore corrupted files from `.pre-mfd12-snapshot-{date}/`
3. Verify restored files against `.checksums-pre-migration.txt`
4. Resume migration from last successful checkpoint

**Data Loss Risk**: Minimal if snapshot was created correctly. Maximum exposure window = time between snapshot creation and migration start.

---

## 4. Rollback Decision Matrix

| Condition | Action | Authority |
|-----------|--------|-----------|
| Phase validation failure (V1-V8) | Automatic halt + Scenario A rollback | Migration pipeline |
| >1% schema validation failures post-activation | Scenario B rollback | Automated monitor |
| Any referential integrity violation post-activation | Scenario B rollback | Automated monitor |
| User-reported broken links traced to phantom removal | Scenario C rollback | Engineering team |
| Backup restore failure rate >5% | Scenario D rollback + pause migration | Engineering lead |
| File corruption detected | Scenario E rollback | System administrator |
| Scholarly team rejects Concept extraction quality | Partial rollback of Phase 7 only | Scholarly lead |

---

## 5. Rollback Execution Checklist

When executing any rollback scenario:

- [ ] Confirm trigger condition is genuine (not transient)
- [ ] Notify all active agents/workstreams of rollback
- [ ] Record rollback timestamp and reason in audit log
- [ ] Verify pre-migration snapshot integrity via checksums
- [ ] Execute rollback procedure for applicable scenario
- [ ] Confirm application reads from correct data source
- [ ] Run smoke tests: load domains, dimensions, topics, sample root-occurrence
- [ ] Verify user backup restore works against rolled-back state
- [ ] Document root cause analysis
- [ ] Schedule migration retry with fixes applied

---

## 6. Irreversible Operations

The following operations, once completed, are difficult to reverse:

| Operation | Why Irreversible | Mitigation |
|-----------|-----------------|------------|
| Deleting legacy files | Original data gone | Never delete until canonical validated for 30 days |
| Publishing v11 backup format | Users create v11 backups unreadable by old app | Maintain v10 reader in v11 codebase |
| Scholarly approval of migrated entities | ReviewDecision is append-only | Supersede with new decision rather than delete |
| ID alias table deletion | Cannot map old bookmarks to new IDs | Retain alias table permanently |

---

## 7. Post-Rollback Recovery

After any rollback:

1. **Root Cause Analysis**: Document what failed, why, and how to prevent recurrence
2. **Migration Plan Update**: Revise MFD-12-MIGRATION-PLAN.md with lessons learned
3. **Test Suite Augmentation**: Add regression test for the failure scenario
4. **Staging Rehearsal**: Re-run entire migration in staging environment with fix applied
5. **Scholarly Notification**: Inform reviewers of delay and revised timeline

---

## 8. Rollback Feasibility Verdict

| Aspect | Feasibility |
|--------|------------|
| Full rollback to pre-migration state | ✅ Highly feasible (snapshot-based) |
| Partial rollback (single phase) | ✅ Feasible (phases are loosely coupled) |
| Zero data loss guarantee | ✅ Achievable (non-destructive strategy) |
| User experience continuity during rollback | ⚠️ Brief interruption possible (seconds) |
| Rollback after 30+ days of canonical operation | ⚠️ Complex (user-generated canonical data must be back-migrated) |

**Overall Verdict**: Rollback is highly feasible within the first 30 days post-migration. Beyond 30 days, as users generate new canonical entities (Concepts, Annotations, Claims), rollback complexity increases significantly because new data has no legacy equivalent. At that point, forward-fix is preferred over rollback.

---

## 9. Retention Policy

| Artifact | Retention Period | Purpose |
|----------|-----------------|---------|
| Pre-migration snapshot | Permanent (archive) | Ultimate fallback |
| Checksum manifest | Permanent (archive) | Integrity verification |
| Migration logs | 1 year minimum | Audit trail |
| Phantom reference log | Permanent | Scholarly reference |
| ID alias table | Permanent | Backup compatibility |
| Failed canonical store | 90 days | Forensic analysis |

---

*This document is a design proposal. No production data has been modified.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
