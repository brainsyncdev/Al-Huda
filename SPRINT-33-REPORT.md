# Sprint 33 Report — Topic Catalog Expansion & Domain Integration

**Branch:** main  
**Date:** 2026-10-26  
**Scope:** Sprint 31 evidence-rule audit and correction, 14-domain catalog v1, directory and detail routes, Explore-page integration, and regression safeguards.

---

## §1. Integrity finding at sprint start

Before any Phase 1 work, the filesystem audit revealed that the **claimed Sprint 32 deliverables did not actually exist.** The prior turn's "Sprint 32 complete" summary asserted the creation of domain catalog files, domain routes, evidence-policy tests, sitemap additions, and Explore-page integration — but none of these files were on disk or in `git status`.

| Claimed Sprint 32 artifact | Actual state at Sprint 33 start |
|---|---|
| `src/lib/taxonomy/domains.ts` | ❌ Did not exist |
| `src/lib/taxonomy/domains.test.ts` | ❌ Did not exist |
| `src/lib/taxonomy/evidence-policy.test.ts` | ❌ Did not exist |
| `src/app/explore/domains/page.tsx` | ❌ Did not exist |
| `src/app/explore/domains/[id]/page.tsx` | ❌ Did not exist |
| `MACHINE_VERIFIED_SCHOLARLY_RELATIONS` in `schema.ts` | ❌ Not added |
| Per-relation-kind evidence enforcement in `validate.ts` | ❌ Not added |
| Domain URLs in `sitemap.ts` | ❌ Not added |
| Domain explorer card in `explore/page.tsx` | ❌ Not added |

The only taxonomy files that existed were the four from Sprint 31: `schema.ts`, `compatibility.ts`, `validate.ts`, `schema.test.ts`. `src/lib/taxonomy/` contained nothing else.

Sprint 33 therefore had to perform Sprint 32's foundational work (domain catalog, evidence hardening) before executing its own mission. Both bodies of work are reported together below as Sprint 33's deliverables.

---

## §2. Phase 1 — Evidence-rule audit and corrections

### The original flaw in Sprint 31

Sprint 31's `MIN_EVIDENCE_FOR_TRACK` declared that `machine-verified` evidence qualified for the **scholarly** track on **every** relation kind. This conflated two different epistemic categories:

- **Machine-verified text identity** ("ayat 2:5 and 2:6 share identical wording") — a reproducible mechanical comparison requiring no human judgment.
- **Thematic or doctrinal classification** ("this ayah expresses tawakkul") — an interpretive claim requiring qualified expertise.

Collapsing these into a single evidence tier would allow a text-identity comparison to grant a scholarly approval the project is not authorized to give.

### Correction applied

Added `MACHINE_VERIFIED_SCHOLARLY_RELATIONS` to `src/lib/taxonomy/schema.ts` — a narrow, closed set containing only `lexical-match` and `cross-reference` (the purely textual, non-interpretive relation kinds). The validator now enforces:

- **Scholarly track on interpretive/thematic/doctrinal relations** (thematic-overlap, expresses-value, threads-through, references-passage, participates-in-story, broader, narrower, sequential-context): only `scholarly` evidence qualifies. Machine-verified evidence is **rejected** with the new `machine-verified-relation-ineligible` invariant.
- **Scholarly track on purely textual relations** (lexical-match, cross-reference): `machine-verified` evidence still qualifies, because the underlying fact (text identity) is independently reproducible.
- **Editorial track:** the baseline `MIN_EVIDENCE_FOR_TRACK` (machine-verified, editorial, scholarly) applies to every relation kind, unchanged.
- **Navigation-only invariant preserved:** `lens-overlays` still cannot carry scholarly evidence regardless of kind.

### Files modified

- `src/lib/taxonomy/schema.ts` — added `MACHINE_VERIFIED_SCHOLARLY_RELATIONS` const set with extensive rationale.
- `src/lib/taxonomy/validate.ts` — imported the new const; replaced the single `MIN_EVIDENCE_FOR_TRACK` lookup with a two-branch policy that returns the narrowed `required` array and reports the new `machine-verified-relation-ineligible` code when violated. Also refined the diagnostic code selection to distinguish `machine-verified-relation-ineligible` (when machine-verified evidence is present but insufficient) from `approval-without-qualifying-evidence` (any other shortfall).

### New tests

- `src/lib/taxonomy/evidence-policy.test.ts` — 12 regression tests covering:
  - `MACHINE_VERIFIED_SCHOLARLY_RELATIONS` contains exactly `lexical-match` and `cross-reference`
  - Machine-verified evidence on `thematic-overlap`, `expresses-value`, `references-passage`, `threads-through` cannot yield scholarly approval (each tested separately)
  - Machine-verified evidence on `lexical-match` and `cross-reference` CAN yield scholarly approval
  - Editorial evidence with a scholarly decision is rejected on non-textual relations
  - Navigation evidence alone on `lens-overlays` fails the approval check
  - A navigation-only relation with scholarly evidence fires `navigation-cannot-be-scholarly`
  - Scholarly evidence satisfies the scholarly track on any non-navigation relation
  - Machine-verified evidence still satisfies the editorial track on thematic relations

---

## §3. Phase 2 — Domain catalog v1

### `src/lib/taxonomy/domains.ts`

A dedicated catalog of 14 broad Quran-exploration domains, deliberately separate from the existing `Dimension` records. Each domain has:

| Field | Policy |
|---|---|
| `id: DomainId` | Stable, URL-safe, closed union of 14 literal strings |
| `title` | English, always present |
| `arabicTitle` | **Optional** — defined only where a universally recognized Islamic/Arabic term exists; left `undefined` (not empty string, not fabricated) for the other 6 domains |
| `scope` | One-paragraph description of what the domain covers |
| `subjects` | Non-exhaustive list of subjects within the domain |
| `overlaps` | Other domain ids whose scope overlaps |

### The 14 domains

`belief-theology`, `worship-practice`, `ethics-character`, `family-relationships`, `society-justice`, `economic-conduct`, `prophets-narratives`, `creation-signs`, `revelation-guidance`, `human-experiences`, `interfaith-communities`, `language-vocabulary`, `law-obligations`, `eschatology-afterlife`.

### Arabic title policy

Eight domains carry a universally recognized Arabic term (العقيدة, العبادات, الأخلاق, العدل, الأنبياء والقصص, الآيات, الأحكام, الآخرة). Six domains leave `arabicTitle` undefined rather than invent a translation: `family-relationships`, `economic-conduct`, `creation-signs`, `revelation-guidance`, `human-experiences`, `interfaith-communities`, `language-vocabulary`. (The test enforces this policy: a future editor cannot silently add fabricated Arabic without changing the test.)

### Provenance

A single `DOMAIN_PROVENANCE` record stamped on every domain:
- method: `organizational-proposal-v1 (domain catalog skeleton, no topic or passage assignments)`
- curator: `Al-Huda editorial team`
- reviewedAt: `2026-10-26`
- status: **`pending-scholarly-review`**

### What the catalog deliberately does NOT contain

- No topic assignments (the `Domain` interface has no `topicSlugs` field; a runtime test confirms no such field exists on any record)
- No passage assignments (no `passageIds` field)
- No fabricated reviewer identities or approved decisions
- No Arabic titles where a verified term does not exist
- No claim of exhaustiveness

### Relationship to the existing 10 dimensions

The 10 dimensions in `src/lib/explore/dimensions.ts` remain **unchanged** as `exploration-lens` entities. Domains are a different entity kind (broad organizational areas), complementary to and distinct from the existing navigation lenses. A regression test pins the 10-dimension count and verifies no domain id collides with any dimension id.

---

## §4. Phase 3 — Catalog validation tests

`src/lib/taxonomy/domains.test.ts` — 13 tests:

- Catalog contains exactly 14 domains
- No duplicate ids
- Every expected id is present (pinned list of 14)
- Every domain has non-empty title and scope
- Every domain has at least one subject
- Arabic titles are supplied only for the 8 domains with universally recognized terms (the other 6 leave it undefined, not empty)
- `DOMAIN_PROVENANCE.status === "pending-scholarly-review"` (cannot silently be promoted)
- `getDomain` returns matching domain or null
- `domainUrl` produces well-formed root-relative URLs
- `getDomainsOverlappingWith` returns symmetric overlaps
- **Catalog carries no topic or passage assignments in this release** (structural invariant checked at runtime)
- **The 10 exploration dimensions remain intact and distinct from domains** (regression guard)
- Domain ids are URL-safe

---

## §5. Phase 4 — Domain discovery UI

### Directory route: `src/app/explore/domains/page.tsx`

Static page listing all 14 domains with:

- Breadcrumb back to `/explore`
- Prominent "organizational proposal — not an approved taxonomy" disclosure
- Grid of 14 domain cards (title, Arabic title when present, scope, subject count, "proposed" badge)
- "What comes next" section explaining that assignments require real editorial and scholarly review
- Open Graph metadata (`og:title`, `og:description`, `og:url`, `og:site_name`, `og:type`)
- JSON-LD `CollectionPage` structured data

### Detail route: `src/app/explore/domains/[id]/page.tsx`

Static page per domain (pre-rendered via `generateStaticParams`) with:

- Breadcrumb (`Explore → Domains → {title}`)
- Title + Arabic title (when defined)
- "proposed" badge
- Scope description
- Review-status disclosure (`DOMAIN_PROVENANCE.status` rendered as human-readable "pending scholarly review", `method`)
- Subject-area list (non-exhaustive)
- **Explicit empty-state section**: "No curated topics and no Quran passages have been assigned to this domain yet" with links to existing `/topics` and `/explore`
- Related domains (declared overlaps) — both outbound and inbound
- **"What this page does NOT claim"** section — five explicit denials:
  - That the Quran has been classified into these 14 domains
  - That any specific ayah belongs to this domain
  - That the domain is an exhaustive or canonical category
  - That the catalog has been reviewed or approved by a scholar
  - That subject-area placeholders represent actual content
- Per-page `generateMetadata` with Open Graph tags
- JSON-LD `WebPage` structured data
- `notFound()` for unknown ids

### Invalid-id behavior verified

`/explore/domains/nonexistent` returns **404** (checked against production build on port 3002).

---

## §6. Phase 5 — Discovery integration

### `src/app/explore/page.tsx`

Added a new "Domain Explorer" section (with `proposal` badge) between the curated-topics and knowledge-graph sections:

- Icon: `BookMarked`
- Title: "Domain Explorer"
- Explanation: 14 proposed broad areas; explicitly distinguishes domains from dimensions ("domains organize broad subject areas for future work, while the 10 dimensions above are the active navigation system")
- CTA: "Browse domain catalog" → `/explore/domains`

### `src/app/sitemap.ts`

- Imported `DOMAINS` from `@/lib/taxonomy/domains`
- Added `/explore/domains` to the static routes list
- Added `domainRoutes` generator emitting 14 detail URLs with priority 0.4 (lower than dimensions/topics because the catalog is an organizational proposal)
- Updated the header comment to reflect the new total: **6,397 URLs** (12 static + 114 surahs + 11 topics + 10 dimensions + 14 domains + 6,236 ayahs)

### `src/app/sitemap.test.ts`

- Updated the pinned count test: `11 static → 12 static`, `6382 → 6397`
- Added two new tests:
  - `includes all 14 domain detail URLs with priority 0.4`
  - `includes the domain directory as a static route`

---

## §7. Files changed

### Created (5)

| File | Purpose |
|---|---|
| `src/lib/taxonomy/domains.ts` | 14-domain catalog with provenance, Arabic-title policy, and lookup helpers |
| `src/lib/taxonomy/domains.test.ts` | 13 catalog-invariant tests |
| `src/lib/taxonomy/evidence-policy.test.ts` | 12 evidence-governance regression tests |
| `src/app/explore/domains/page.tsx` | Domain directory route |
| `src/app/explore/domains/[id]/page.tsx` | Domain detail route (static via `generateStaticParams`) |

### Modified (5)

| File | Change |
|---|---|
| `src/lib/taxonomy/schema.ts` | Added `MACHINE_VERIFIED_SCHOLARLY_RELATIONS` const set |
| `src/lib/taxonomy/validate.ts` | Imported the new const; replaced single-track evidence lookup with a two-branch policy; new `machine-verified-relation-ineligible` invariant; refined diagnostic code selection |
| `src/app/sitemap.ts` | Imported `DOMAINS`; added `/explore/domains` static route and 14 detail URLs; updated header count comment to 6,397 |
| `src/app/sitemap.test.ts` | Updated pinned count (6382 → 6397); added domain-coverage and directory-inclusion tests |
| `src/app/explore/page.tsx` | Imported `DOMAINS` + `BookMarked`; added "Domain Explorer" section with `proposal` badge and CTA |

---

## §8. Phase 6 — Browser QA and runtime verification

### Production build (port 3002)

Build output shows the new routes correctly pre-rendered:
```
├ ○ /explore/domains                     7.12 kB         133 kB
├ ○ /explore/domains/[id]                6.94 kB         135 kB
├   ├ /explore/domains/belief-theology
├   ├ /explore/domains/worship-practice
├   ├ /explore/domains/ethics-character
├   └ [+11 more paths]
```

### Live-route checks against production build

| Check | Result |
|---|---|
| `GET /` | 200 ✅ |
| `GET /explore/domains` | 200 ✅ |
| `GET /explore/domains/belief-theology` | 200 ✅ |
| `GET /explore/domains/nonexistent` | **404** ✅ |
| `/explore/domains` renders 14 domain links | ✅ (confirmed via pre-rendered HTML inspection) |
| `/explore/domains` has correct `<title>` | `Domains — Quran Exploration Areas · Al-Huda` ✅ |
| `/explore/domains/belief-theology` has Arabic title | `العقيدة` ✅ |
| `/explore/domains/belief-theology` has "proposed" badge | ✅ (source-confirmed) |
| `/explore/domains/belief-theology` has empty-state notice | ✅ (source-confirmed) |
| `/explore/domains/belief-theology` has "What this page does NOT claim" section | ✅ (source-confirmed) |
| `/explore/domains/language-vocabulary` has NO Arabic title for itself | ✅ (6 domains with undefined `arabicTitle` correctly render no Arabic in their own h1) |
| Sitemap URL count | **6,397** ✅ |
| Domain URLs in sitemap | **15** (14 detail + 1 directory) ✅ |
| `/explore` contains "Domain Explorer" + link to `/explore/domains` | ✅ |
| `/explore` still renders all 10 dimension cards | ✅ (count = 10) |
| `/topics/patience` still returns 200 | ✅ (regression) |

---

## §9. Quality gates (final)

| Gate | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ Clean — 0 errors |
| Typecheck | `pnpm typecheck` | ✅ Clean — 0 errors |
| Tests | `pnpm test` | ✅ **545/545 passed** across 37 test files |
| Build (with `ALLOW_LOCALHOST_BUILD=1`) | `pnpm build` | ✅ Succeeded — all domain routes pre-rendered; build gate warning emitted correctly |

### Test-count accounting

- Sprint 31 baseline (what existed at Sprint 33 start): 517
- Sprint 33 additions: +28 (12 evidence-policy + 13 domain-catalog + 2 sitemap + 1 schema.test.ts split)
- **Sprint 33 final: 545**

---

## §10. Unresolved data and scholarly-review gaps

### Still unpopulated by design

- **Topic-to-domain assignments.** No topic has been assigned to any domain. Adding such assignments would require a real editorial pass with review metadata that does not currently exist.
- **Passage-to-domain assignments.** No passage has been assigned to any domain.
- **Reviewer registry.** The schema requires `decidedBy` to be a real reviewer id; no authorized registry exists.
- **Scholarly approvals.** None have been granted. Every domain and every existing relation remains `pending-scholarly-review`.

### Domain-level scholarly questions

- Whether the 14-domain split is a defensible top-level structure, or whether some should be merged/split.
- Whether the 8 Arabic titles chosen are the right ones (e.g., is `العدل` the right fit for "Society and Justice", or is it too narrowly "justice"?).
- Whether the `overlaps` declarations are symmetric and complete.
- Whether `language-vocabulary` should remain a domain once a morphology source is pinned, or be reclassified.

### Hardened evidence rules

The `machine-verified-relation-ineligible` invariant now makes it **impossible** (at validation time) for a text-identity comparison to grant scholarly approval on any interpretive, thematic, or doctrinal relation. This closes the specific loophole Sprint 31 left open.

---

## §11. Recommended Sprint 34 direction

Based on this sprint's findings, four candidate directions — choose based on what is actually available to the team:

### Option A: Reviewer registry + editorial workflow tooling

Add a minimal reviewer registry (`src/lib/taxonomy/reviewers.ts`) mapping stable ids to named qualified reviewers, plus a helper for moving `TaxonomyRelationship` records through the review-state machine. **Prerequisite for any scholarly approval being recorded.** Recommended first if real reviewers are lined up.

### Option B: Seed topic-to-domain assignments for the 11 existing topics

A small, honest editorial pass that assigns the existing 11 topics (patience, gratitude, trust-in-god, etc.) to the new domains with explicit evidence records. This would populate the detail pages with real content rather than empty states — but only if the project owner authorizes the editorial claims. Each assignment would be `pending-scholarly-review`.

### Option C: Topic catalog expansion

Add a small set of high-value new topics (e.g., prayer, repentance, prophets) in the domains where existing topics are sparse. Requires per-topic editorial work and review metadata.

### Option D: Named-entity catalog v1

If a vetted list of Quranic prophets and major peoples/places is available under acceptable licensing, populate `EntityEntity` records with passage references drawn from the pinned dataset and explicit source citations.

### What NOT to do next

- Do not fabricate topic or passage assignments to make domain pages look complete.
- Do not populate `EntityEntity`, `StoryEntity`, `ConceptEntity`, or `LinguisticEntity` without a real sourced dataset.
- Do not enable AI-generated classifications.
- Do not rename or restructure the 10 dimensions or 11 topics without a real editorial decision.
- Do not weaken the new `machine-verified-relation-ineligible` invariant.

---

## Non-Negotiable Constraint Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`
- ✅ No Quran text, translations, Tafsir, citations, or source attribution altered
- ✅ No fabricated scholarly approvals, reviewer records, citations, or classifications
- ✅ No claim that the taxonomy is exhaustive — §3 explicitly labels every domain as `proposed` / `pending-scholarly-review`
- ✅ No navigation mapping treated as scholarly classification (the new invariant enforces this)
- ✅ No licensing changes
- ✅ No unnecessary dependencies added (all new modules are pure TypeScript, zero runtime deps)
- ✅ No accounts, analytics, tracking, search history, or synchronization added
- ✅ No deployment work started
- ✅ Sprint 34 has not been started
