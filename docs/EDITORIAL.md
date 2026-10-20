# Editorial Governance and Operations

Implements PRD §20 (Editorial Governance) and the editorial half of §8.8
(FR-070 – FR-075). One person may hold several roles initially, but the
responsibilities stay explicit.

## Roles

| Role | Responsibility in this build |
| --- | --- |
| Product owner | Scope and release decisions |
| Data maintainer | Dataset pin, validation scripts, source registry |
| Content editor | Topic drafts, summaries, relation rationales |
| Qualified reviewer/advisor | Reviews religiously substantive mappings — **not yet assigned** |
| Developer/administrator | Application, security, release process |

Status: no qualified reviewer/advisor is assigned. Every topic therefore ships
as `pending-scholarly-review`, and the AI safety gate `editorial-reviewer`
remains unmet (`src/lib/ai/feature-flag.ts`).

## Editorial workflow (PRD §20)

1. Draft content or relationship in `src/lib/topics/data.ts`.
2. Attach source and rationale — `TopicRelation.rationale` must stay purely
   descriptive (what the verse addresses), never an interpretation.
3. Validate references and licensing — `scripts/validate-quran-data.mjs`
   (references) and `scripts/validate-source-licenses.mjs` (rights).
4. Review religiously substantive claims — blocked on a qualified reviewer.
5. Approve and publish — set `provenance.status` to `editorial-approved`
   only at step 4; `pending-scholarly-review` is the default.
6. Record version and review date — `provenance.reviewedAt`.
7. Accept correction reports and provide rollback — see below.

The review board at `/editorial` (noindex, no accounts) renders steps 2, 5 and
6 as they actually stand for every topic, together with dataset validation and
the rights table from step 3.

## Correction process (PRD §20, FR-066)

`/report` accepts corrections for: Quran text, references, translation
attribution, topic links, technical defects, and (future) AI answers. Quran
text and reference errors are treated as critical incidents.

**Known gap:** no delivery destination is configured — the form validates,
formats, and copies the report, and says so plainly. Configuring an address or
issue tracker before launch is a release blocker for closing FR-066/FR-072's
reporting half.

## Rollback (FR-074)

- **Topic mapping**: `src/lib/topics/data.ts` is the single source of truth;
  revert the commit that changed it, or set `provenance.status` back to
  `pending-scholarly-review` to unpublish without deleting history.
- **Dataset release**: the dataset is a pinned npm package
  (`quran-json@3.1.2` in `package.json`). Rolling back means re-pinning the
  previous version and re-running `scripts/validate-quran-data.mjs`. The
  catalogue records which package each text came from
  (`src/lib/quran/sources.ts`).

## Rights and source status (FR-075)

`src/lib/quran/sources.ts` is the rights register: licence, licence URL,
version, homepage, and `method` (`package` = redistributed here, `link` =
outbound only). The `/sources` page shows it publicly; `/editorial` shows the
same data plus the validation state for editors. `method: "link"` records are
never bundled and never retrieved from — the AI allowlist
(`src/lib/ai/approved-sources.ts`) derives from that field.

## Dataset import (FR-070)

There is no free-form import path: content enters by pinning a package in
`package.json`, which is the provenance decision itself. Validation runs
afterwards:

- `scripts/validate-quran-data.mjs` — schema validation, duplicate detection
  (same `surah:ayah` twice), missing/reordered/malformed records, expected
  surah and verse counts, exit code 1 on any issue.
- `scripts/validate-source-licenses.mjs` — every source must carry licence,
  version, and homepage; `link`-method records must not claim redistribution.
- `src/lib/quran/data.ts#validateDataset()` — the same structural scan served
  by `GET /api/validate-dataset` and rendered on `/editorial`.

These scripts are artifacts of this release and have **not been executed in
this environment** (verification deferred); that is recorded in
`docs/PRD-CHECKLIST.md`.

## What is deliberately absent

- No editor accounts or admin UI with write paths — the build has no accounts
  (AI_RULES), so publication state lives in code review, not in a CMS.
- Per-relation review records exist in the schema but not in the data:
  `TopicRelation.provenance` is an optional override that, when present,
  replaces the topic-level record for that one relation (read via
  `relationProvenance`). Every relation shipped in this release has no
  override, so all of them inherit the topic-level record. `/editorial`
  reports that honestly as 0 of 56 individually reviewed, and each verse on a
  topic page labels its review state "inherited from topic" rather than
  implying a per-relation pass took place.
- No change history: who changed what, when, and the identity of the reviewer
  are not recorded per event. That would need a store the build does not
  otherwise have (no accounts, no database), so it stays partial in the
  checklist rather than faked. Git history is the only real audit trail.
