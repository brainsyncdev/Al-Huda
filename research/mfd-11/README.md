# MFD-11 research workstream

Qur'an-first knowledge extraction. Research-only: nothing here is imported by
the FAHM application, and nothing here modifies production data.

Read `MFD-11-CHARTER.md` first — it defines the immutable rules and the
separation between extraction, classification, and scholarly validation.

## Layout

- `schemas/` — JSON Schema contracts (passage extraction, topic candidate,
  evidence link).
- `data/` — Phase 0 baseline: `corpus-inventory.json`, `corpus-hashes.json`
  (SHA-256 per verse, verbatim), `production-baseline.json` (read-only
  snapshot of the production taxonomy and curated layer).
- `extractions/` — Pass A records, one per passage.
- `candidates/` — topic candidates with exact āyah evidence.
- `synthesis/`, `reports/`, `integration/` — later phases.

## Commands (run from the repository root)

```
# Regenerate the Phase 0 baseline (only if intentionally re-baselining):
node scripts/mfd11-phase0-baseline.mjs

# Verify immutability — fails on ANY drift in corpus or production files:
node scripts/mfd11-phase0-baseline.mjs --verify

# Validate extraction/candidate records against the schemas AND the corpus.
# Every cited verse key must exist; every Arabic excerpt must match the
# pinned corpus verbatim; reviewStatus must be pending-scholarly-review:
node scripts/mfd11-validate-extraction.mjs research/mfd-11/extractions/001-al-fatiha.json research/mfd-11/candidates/candidates-001.json

# Existing production validators (must stay green):
node scripts/validate-all.mjs
```

## Record provenance

Every AI-produced record carries:

```json
{ "proposedBy": "ai-assisted", "reviewStatus": "pending-scholarly-review" }
```

No record in this workstream is approved. Approval is a human scholarly
governance action, never an automated step.
