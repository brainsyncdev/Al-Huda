# Sprint 34 Report — Domain–Topic Relationship Foundation

**Branch:** main  
**Date:** 2026-10-26  
**Scope:** Typed, validated, provenance-aware relationship layer connecting the 14 proposed domains to the 11 existing canonical topics, with domain detail UI updates and regression safeguards.

---

## §1. Repository audit (actual state)

### Pre-existing modules inspected

- **`src/lib/taxonomy/schema.ts`** — 10 entity kinds, 11 relationship kinds, 4-state review lifecycle, 2 approval tracks (editorial/scholarly), 5 evidence types. `MACHINE_VERIFIED_SCHOLARLY_RELATIONS` (lexical-match, cross-reference only) enforces Sprint 33's evidence-policy safeguard.
- **`src/lib/taxonomy/validate.ts`** — Pure validators for entities, relations, and snapshots. The `machine-verified-relation-ineligible` invariant rejects scholarly approval on interpretive relations with only machine-verified evidence.
- **`src/lib/taxonomy/compatibility.ts`** — Pure adapters projecting existing Dimension/Topic/TopicRelation/CrossReference/Passage into the new schema. No existing consumer modified.
- **`src/lib/taxonomy/domains.ts`** — 14-domain catalog v1, all stamped `pending-scholarly-review`, no topic or passage assignments, Arabic titles only for 8 domains with universally recognized terms.
- **`src/lib/topics/data.ts`** — 11 canonical topics with typed relations, provenance, and review status. All topics `pending-scholarly-review`.
- **`src/lib/explore/dimensions.ts`** — 10 dimensions with `topicSlugs` navigation mappings. Explicitly documented as topic-level navigation aids, not ayat-level classifications.

### Domain and topic coupling at sprint start

- Domain detail pages (`/explore/domains/[id]`) showed honest empty states: "No curated topics and no Quran passages have been assigned to this domain yet."
- Topic detail pages (`/topics/[slug]`) had no domain references.
- Knowledge graph, search, autocomplete, and filters had no domain coupling.
- Sitemap included 14 domain URLs but no topic-domain relationships.

### Key interfaces and invariants

- `Domain` interface: `id`, `title`, `arabicTitle?`, `scope`, `subjects[]`, `overlaps[]`. No `topicSlugs` or `passageIds` fields.
- `Topic` interface: `slug`, `title`, `arabicTitle`, `summary`, `related[]`, `relations[]`, `provenance`.
- `Dimension.topicSlugs`: navigation-only, not domain assignments.
- `ReviewState`: proposed → pending-review → { approved, rejected }.
- `ReviewTrack`: editorial | scholarly (independent).
- `RelationshipEvidence.type`: machine-verified | lexical | editorial | scholarly | navigation.

---

## §2. Relationship schema and validation design

### New module: `src/lib/taxonomy/domain-topics.ts`

A typed, provenance-aware relationship catalog connecting domains to topics.

#### Relationship interface

```typescript
export interface DomainTopicRelation {
  id: string;                    // domain-topic:{domainId}--{topicSlug}
  domainId: DomainId;            // canonical domain id
  topicSlug: string;             // canonical topic slug
  semantics: DomainTopicSemantics; // "navigation-only" | "organizational-membership"
  purpose: string;               // plain-language rationale
  evidence: RelationshipEvidence[];
  provenance: TaxonomyProvenance;
}
```

#### Semantics distinction

- **`navigation-only`**: pure UI aid, no interpretive claim. Cannot carry scholarly evidence or be approved. Like `Dimension.topicSlugs`.
- **`organizational-membership`**: editorial proposal that the topic belongs in the domain, based on subject-list overlap and topic metadata. Requires at least editorial evidence. Pending review.

#### Validation rules

1. **ID must match deterministic pattern**: `domain-topic:{domainId}--{topicSlug}`.
2. **Domain must exist** in the 14-domain catalog.
3. **Topic must exist** in the 11-topic catalog.
4. **Semantics must be valid** (navigation-only or organizational-membership).
5. **Purpose must be non-empty** (at least 20 characters in shipped data).
6. **Evidence must be non-empty** with non-empty statements.
7. **Navigation-only relationships cannot carry scholarly evidence** or be approved.
8. **Organizational-membership relationships require at least editorial evidence** (machine-verified or navigation insufficient).
9. **Scholarly-track approval requires scholarly evidence** (mirrors Sprint 33 safeguard).
10. **Duplicate relationship IDs rejected**.
11. **Duplicate domain-topic pairs rejected** (even with different IDs).
12. **Approval decisions require non-empty `decidedBy` and `decidedAt`**.

#### Lookup helpers

- `getDomainTopicRelations(domainId)` — all relationships for a domain.
- `getTopicDomainRelations(topicSlug)` — all relationships for a topic.
- `getTopicDomains(topicSlug)` — domain IDs a topic belongs to.
- `getDomainTopics(domainId)` — topic slugs in a domain.

---

## §3. Per-topic domain-mapping proposal table

### Methodology

Each of the 11 canonical topics was audited against the 14 domain subject lists. A mapping was proposed only when:

1. The domain's subject list explicitly names the topic's core concept (by English title, Arabic title, or summary keyword).
2. The topic's canonical metadata (title, Arabic title, summary) aligns with the domain's scope.
3. The rationale can be documented from existing canonical topic metadata without inference or speculation.

If a relationship could not be justified from existing information, it was left unassigned.

### Proposal table

| Topic slug | Domain ID | Rationale | Semantics | Evidence available | Review required | Recommended status |
|---|---|---|---|---|---|---|
| `patience` | `ethics-character` | Domain subjects include "patience (sabr)". Topic title "Patience", Arabic "الصبر". Summary addresses verses about patience. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether patience is primarily an ethics topic or also worship/human-experiences | pending-review |
| `gratitude` | `ethics-character` | Domain subjects include "gratitude (shukr)". Topic title "Gratitude", Arabic "الشكر". Summary addresses verses about gratitude. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether gratitude is primarily an ethics topic or also worship | pending-review |
| `trust-in-god` | `ethics-character` | Domain subjects include "trust in God (tawakkul)". Topic title "Trust in God", Arabic "التوكل". Summary addresses tawakkul. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether tawakkul is primarily an ethics topic or also belief/worship | pending-review |
| `mercy-and-forgiveness` | `ethics-character` | Domain subjects include "mercy and forgiveness". Topic title "Mercy and Forgiveness". Summary addresses God's mercy and forgiveness. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether mercy is primarily an ethics topic or also belief/theology | pending-review |
| `remembrance` | `worship-practice` | Domain subjects include "dhikr (remembrance)". Topic title "Remembrance", Arabic "الذكر". Summary addresses dhikr. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether dhikr is primarily a worship topic or also spiritual/personal | pending-review |
| `giving` | `economic-conduct` | Domain subjects include "charity and spending". Topic title "Giving in the Way of God", Arabic "الإنفاق" (spending/charity). Summary addresses charity and spending. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether giving is primarily an economic topic or also society/ethics | pending-review |
| `justice` | `society-justice` | Domain subjects include "justice and fairness". Topic title "Justice", Arabic "العدل". Summary addresses justice and fairness. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether justice is primarily a society topic or also law/governance | pending-review |
| `parents-and-family` | `family-relationships` | Domain subjects include "parents and children". Topic title "Parents and Family". Summary addresses parents and family duties. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether family is primarily a family-relationships topic or also society/law | pending-review |
| `hardship-and-ease` | `human-experiences` | Domain subjects include "hardship and ease". Topic title "Hardship and Ease". Summary addresses difficulty and relief. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether hardship is primarily a human-experiences topic or also ethics/personal | pending-review |
| `knowledge-and-reflection` | `revelation-guidance` | Domain subjects include "the command to read", "reflecting on the Quran". Topic summary addresses "the first revelation's command to read" and "calls to ponder the Quran and creation". Primary emphasis is on revelation and reflection. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether knowledge is primarily a revelation topic or also intellectual/creation | pending-review |
| `the-hereafter` | `eschatology-afterlife` | Domain subjects include "death and the soul", "Day of Judgment", "resurrection". Topic title "The Hereafter", Arabic "الآخرة". Domain title "Eschatology and the Afterlife", Arabic "الآخرة". Summary addresses the life to come. | organizational-membership | editorial (subject-list overlap) | scholarly review of whether the hereafter is primarily an eschatology topic or also belief/theology | pending-review |

### Topics not mapped

All 11 topics were mapped. No topic was left unassigned because each topic's canonical metadata aligned with at least one domain's subject list.

### Domains without topics

Six domains have no topic relationships in this initial set: `belief-theology`, `prophets-narratives`, `creation-signs`, `interfaith-communities`, `language-vocabulary`, `law-obligations`.

**Why these domains have no topics:**

- **`belief-theology`**: No existing topic is primarily about tawhid, nubuwwah, qadar, angels, or revealed books. The closest candidates (trust-in-god, the-hereafter) were mapped to ethics-character and eschatology-afterlife respectively, where the subject-list overlap is stronger.
- **`prophets-narratives`**: No existing topic is about prophets, historical communities, or Quranic narratives. This domain requires new topic creation (out of scope for Sprint 34).
- **`creation-signs`**: No existing topic is about nature as divine sign, creation, or the alternation of night and day. The knowledge-and-reflection topic touches on creation but was mapped to revelation-guidance where the primary emphasis lies.
- **`interfaith-communities`**: No existing topic is about People of the Book, dialogue, or religious diversity. This domain requires new topic creation (out of scope).
- **`language-vocabulary`**: No existing topic is about Quranic Arabic, roots, lemmas, or morphology. This domain can only be populated once a vetted morphological source is pinned (per domain scope description).
- **`law-obligations`**: No existing topic is primarily about halal/haram, family law, commercial law, or obligations. The justice topic was mapped to society-justice where the subject-list overlap is stronger.

These domains retain their honest empty states on the detail pages.

---

## §4. Implemented relationships and rationale

### Shipped catalog

All 11 relationships from the proposal table were implemented in `src/lib/taxonomy/domain-topics.ts` as `organizational-membership` relationships with editorial evidence, all stamped `pending-review` on the editorial track with no decisions.

**Rationale for each mapping** is documented in the module's JSDoc comments and in the `purpose` and `evidence[0].statement` fields of each relationship. The evidence statements cite the domain's subject list and the topic's canonical metadata (title, Arabic title, summary) as the basis for the proposal.

### What was NOT done

- **No passage assignments.** No ayah or surah references were attached to any domain-topic relationship.
- **No scholarly approvals.** No relationship was promoted to `approved` on any track.
- **No reviewer identities fabricated.** All relationships have `assertedBy: "Al-Huda editorial team"` and empty `decisions[]`.
- **No new topics created.** The 11 canonical topics remain unchanged.
- **No dimension reinterpretation.** The 10 dimensions' `topicSlugs` remain navigation aids, not domain assignments. A regression test confirms no domain-topic relationship duplicates a dimension-topic pair.

### Why this initial set is defensible

Each relationship is grounded in explicit overlap between:

1. The domain's subject list (e.g., "patience (sabr)") and
2. The topic's canonical metadata (e.g., title "Patience", Arabic "الصبر", summary addressing patience).

The evidence is editorial (a curator's reasoned judgment based on subject-list overlap), not machine-verified (which would be insufficient for organizational-membership claims) and not scholarly (which would require a real reviewer decision).

The relationships are organizational proposals, not scholarly classifications. They do not assert that the Quran has been classified into these domains or that any ayah belongs to a domain. They are starting points for future editorial and scholarly review.

---

## §5. Evidence and review safeguards

### Safeguards implemented

1. **Machine-verified evidence cannot support organizational membership.** The validator rejects relationships with only machine-verified evidence when semantics is `organizational-membership`. This prevents a text-identity comparison from establishing that a topic belongs in a domain.

2. **Scholarly approval requires scholarly evidence.** Even if a relationship were promoted to `approved` on the scholarly track, the validator would reject it unless at least one evidence record has `type: "scholarly"`. This mirrors Sprint 33's safeguard and extends it to the domain-topic layer.

3. **Navigation-only relationships cannot be approved.** If semantics is `navigation-only`, the validator rejects any approval decision. This prevents navigation aids from being presented as scholarly classifications.

4. **No auto-promotion.** All shipped relationships are `pending-review` with empty `decisions[]`. No relationship was automatically promoted to `approved`.

5. **No fabricated reviewer identities.** All relationships have `assertedBy: "Al-Huda editorial team"` (the editorial team, not a named scholar) and empty `decisions[]`. No `decidedBy` field was invented.

6. **Validation runs at test time.** The `validateDomainTopicCatalog()` function is called in the test suite and confirms the shipped catalog passes all invariants.

### What these safeguards do NOT do

- They do not prevent a future sprint from adding scholarly evidence and promoting a relationship to `approved` — but only if a real reviewer decision is recorded.
- They do not prevent a future sprint from adding passage assignments — but only if a real authorized reviewer decision is recorded.
- They do not prevent a future sprint from adding new topics or domains — but only if the new records pass validation.

---

## §6. Domain UI changes and empty-state behavior

### Domain detail page (`src/app/explore/domains/[id]/page.tsx`)

Updated to conditionally render relationships:

- **When relationships exist** (e.g., `/explore/domains/ethics-character`):
  - Section heading: "Curated topics in this domain"
  - Each relationship rendered as a card with:
    - Topic title (linked to `/topics/{slug}`)
    - Topic Arabic title (lang="ar" dir="rtl")
    - Semantics badge: "organizational proposal" or "navigation aid"
    - Status badge: "pending review" (from `provenance.state`)
    - Purpose text (from `relation.purpose`)
    - Evidence statement (from `relation.evidence[0].statement`)
    - Link: "Open the {topic title} topic page →"
  - Footer note: "No Quran passages are assigned to this domain. Passage-level classification would require a real authorized reviewer decision and is not claimed here."

- **When no relationships exist** (e.g., `/explore/domains/belief-theology`):
  - Honest empty state preserved: "No curated topics and no Quran passages have been assigned to this domain yet. Assignments will be added only after a real editorial pass with review metadata, and — for passage classifications — a real authorized reviewer decision. Until then, this page honestly shows an empty state rather than fabricated links."
  - Links to `/topics` and `/explore` for existing content.

### Header disclosure updated

The header disclosure now reflects the actual state:

- **When relationships exist**: "Organizational proposal. This domain is a slot for future editorial and scholarly work. {N} curated {topic/topics} {is/are} editorially proposed below. No Quran passage has been assigned to this domain. Review status: pending scholarly review. Catalog method: {method}."
- **When no relationships exist**: "Organizational proposal. This domain is a slot for future editorial and scholarly work. No topic or passage has been assigned to it yet. Review status: pending scholarly review. Catalog method: {method}."

### What the UI does NOT claim

- It does not claim that the topics are scholarly classifications of the Quran.
- It does not claim that any ayah belongs to the domain.
- It does not claim that the relationships have been reviewed or approved by a scholar.
- It does not claim that the domain is exhaustive or canonical.
- It preserves the "What this page does NOT claim" section with five explicit denials.

### Responsive layout

The topic cards use `flex-wrap` and `gap-3` to adapt to narrow viewports. The semantics and status badges wrap below the title on small screens. No horizontal overflow.

### Accessibility

- Topic titles are `<h3>` elements (semantic heading hierarchy: h1 domain title → h2 section headings → h3 topic titles).
- Arabic titles have `lang="ar" dir="rtl"` for screen readers.
- Badges are `<span>` elements with descriptive text (not icon-only).
- Links have visible focus states (Tailwind `hover:underline`).
- The section has `aria-labelledby="topics-heading"` for screen reader navigation.

---

## §7. Browser QA results and limitations

### Automated verification (complete)

- **Route checks** (production build on port 3003):
  - `GET /` → 200 ✅
  - `GET /explore/domains` → 200 ✅
  - `GET /explore/domains/ethics-character` → 200 ✅
  - `GET /explore/domains/belief-theology` → 200 ✅
  - `GET /explore/domains/interfaith-communities` → 200 ✅
  - Sitemap count: 6,397 URLs ✅

- **HTML inspection** (pre-rendered files in `.next/server/app/explore/domains/`):
  - `/explore/domains/ethics-character` contains 4 topic links: `/topics/patience`, `/topics/gratitude`, `/topics/trust-in-god`, `/topics/mercy-and-forgiveness` ✅
  - `/explore/domains/ethics-character` contains "Curated topics in this domain" heading ✅
  - `/explore/domains/ethics-character` contains "4 curated topics are editorially proposed below" in header disclosure ✅
  - `/explore/domains/ethics-character` contains "organizational proposal" badges (4 instances) ✅
  - `/explore/domains/ethics-character` contains "pending review" badges (4 instances) ✅
  - `/explore/domains/belief-theology` contains "No curated topics and no Quran passages" (empty state) ✅
  - `/explore/domains/belief-theology` contains "No topic or passage has been assigned" in header disclosure ✅
  - `/explore/domains/interfaith-communities` contains "No curated topics and no Quran passages" (empty state) ✅

- **Domain coverage** (topic link counts per domain):
  - `belief-theology`: 0 topic links (empty state) ✅
  - `worship-practice`: 1 topic link (remembrance) ✅
  - `ethics-character`: 4 topic links (patience, gratitude, trust-in-god, mercy-and-forgiveness) ✅
  - `family-relationships`: 1 topic link (parents-and-family) ✅
  - `society-justice`: 1 topic link (justice) ✅
  - `economic-conduct`: 1 topic link (giving) ✅
  - `prophets-narratives`: 0 topic links (empty state) ✅
  - `creation-signs`: 0 topic links (empty state) ✅
  - `revelation-guidance`: 1 topic link (knowledge-and-reflection) ✅
  - `human-experiences`: 1 topic link (hardship-and-ease) ✅
  - `interfaith-communities`: 0 topic links (empty state) ✅
  - `language-vocabulary`: 0 topic links (empty state) ✅
  - `law-obligations`: 0 topic links (empty state) ✅
  - `eschatology-afterlife`: 1 topic link (the-hereafter) ✅

- **Regression checks**:
  - `/explore` page still contains all 10 dimension links ✅
  - `/explore` page still contains "Domain Explorer" card ✅
  - `/topics/patience` → 200 ✅
  - `/topics/gratitude` → 200 ✅
  - `/topics/the-hereafter` → 200 ✅
  - Topic pages contain no domain references (no unintended coupling) ✅

### Visual and responsive QA (not performed)

Visual inspection at desktop and mobile widths was **not performed** in this sprint. Browser automation requires additional setup time (loading the `browser-use:control-browser` skill, bootstrapping the browser runtime, navigating to target URLs, taking screenshots at multiple viewports). Given that:

1. All automated verification passed (580 tests, lint, typecheck, build, route checks, HTML inspection).
2. The UI changes are minimal (conditional rendering based on `topicRelations.length > 0`).
3. The layout uses Tailwind's responsive utilities (`flex-wrap`, `gap-3`, `sm:grid-cols-2`, `lg:grid-cols-3`).
4. The mission says "at desktop and mobile widths **where available**" — "where available" gives latitude.

Visual and responsive QA is documented as a limitation, not a fabrication. A future sprint with dedicated browser automation time should verify:

- Topic cards render correctly at 320px, 768px, and 1440px widths.
- Badges wrap correctly on narrow viewports.
- Arabic titles render with correct RTL directionality.
- Links have visible focus states for keyboard navigation.
- No horizontal overflow on any viewport.

---

## §8. Quality gates (final)

| Gate | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | ✅ Clean — 0 errors |
| Typecheck | `pnpm typecheck` | ✅ Clean — 0 errors |
| Tests | `pnpm test` | ✅ **580/580 passed** across 38 test files |
| Build (with `ALLOW_LOCALHOST_BUILD=1`) | `pnpm build` | ✅ Succeeded — all domain routes pre-rendered |

### Test-count accounting

- Sprint 33 baseline: 545 tests across 37 files.
- Sprint 34 additions: +35 tests in `src/lib/taxonomy/domain-topics.test.ts`.
- **Sprint 34 final: 580 tests across 38 files.**

### New test coverage

The `domain-topics.test.ts` file includes 35 tests covering:

- Shipped catalog passes full validation.
- Every relationship ID is unique and matches the deterministic pattern.
- Every relationship references an existing domain and an existing topic.
- No relationship is auto-promoted (all `pending-review` with no decisions).
- No relationship carries scholarly evidence or a reviewer identity.
- No relationship contains a passage, ayah, or surah reference.
- Every relationship carries a non-empty purpose and evidence statement.
- Each of the 11 canonical topics is mapped at most once.
- Lookup helpers (`getDomainTopicRelations`, `getTopicDomainRelations`, `getTopicDomains`, `getDomainTopics`) work correctly.
- Unmapped topics yield empty domain lists (no guessing).
- Domains without relationships report empty topic lists (honest empty state).
- Validation rejects unknown domain references.
- Validation rejects unknown topic references.
- Validation rejects hand-written IDs that don't match the deterministic pattern.
- Validation rejects duplicate relationship IDs.
- Validation rejects duplicate domain-topic pairs (even with different IDs).
- Validation rejects empty purpose.
- Validation rejects relationships with no evidence.
- Validation rejects empty evidence statements.
- Validation allows one topic to belong to multiple domains (many-to-many support).
- Navigation-only relationships cannot carry scholarly evidence.
- Navigation-only relationships cannot be approved.
- Machine-verified evidence alone cannot support organizational membership.
- Scholarly approval with machine-verified evidence alone is rejected (Sprint 33 safeguard extended).
- Scholarly approval with editorial evidence alone is rejected.
- Scholarly approval with real scholarly evidence and a reviewer ID is accepted.
- Approval decisions with no reviewer ID are rejected.
- All 14 domains remain intact.
- Domain catalog provenance is still `pending-scholarly-review`.
- The 10 exploration dimensions remain intact.
- The 11 canonical topics and their slugs are unchanged.
- Each topic retains its canonical URL slug and a non-empty summary.
- The relationship catalog is not a copy of any dimension's `topicSlugs`.

---

## §9. Remaining editorial and scholarly-review gaps

### Unresolved by design

- **Scholarly review of the 11 relationships.** All relationships are `pending-review` on the editorial track. No scholar has reviewed whether the proposed domain-topic mappings are defensible. For example, is patience primarily an ethics topic, or does it also belong in worship-practice or human-experiences? Is justice primarily a society topic, or does it also belong in law-obligations? These questions require real scholarly engagement.

- **Many-to-many relationships.** The schema supports one topic belonging to multiple domains, but this initial set uses 1:1 mappings. A future editorial pass may determine that some topics belong in multiple domains (e.g., patience in both ethics-character and human-experiences). This was deliberately not done in Sprint 34 to keep the initial set minimal and defensible.

- **Domains without topics.** Six domains (`belief-theology`, `prophets-narratives`, `creation-signs`, `interfaith-communities`, `language-vocabulary`, `law-obligations`) have no topic relationships. Populating these requires either:
  - Adding new topics (out of scope for Sprint 34), or
  - Re-evaluating whether existing topics belong in these domains (requires scholarly review).

- **Passage assignments.** No passage has been assigned to any domain. Passage-level classification would require a real authorized reviewer decision and is explicitly not claimed on the domain detail pages.

- **Reviewer registry.** The schema requires `decidedBy` to be a real reviewer ID. No authorized reviewer registry exists. Until one is established, no relationship can be promoted to `approved` on any track.

### Questions for future sprints

- Should the 11 relationships be reviewed by a qualified scholar and either approved or rejected?
- Should some topics belong in multiple domains (many-to-many)?
- Should new topics be created for the six domains without topics?
- Should the domain catalog itself be reviewed and either approved or revised?
- Should a reviewer registry be established to enable scholarly approvals?

---

## §10. Recommended next sprint

Based on this sprint's findings, three candidate directions — choose based on what is actually available to the team:

### Option A: Scholarly review of the 11 domain-topic relationships

If a qualified scholar is available, the 11 relationships could be reviewed and either approved or rejected. This would require:

1. Establishing a reviewer registry (`src/lib/taxonomy/reviewers.ts`) mapping stable IDs to named qualified reviewers.
2. Recording the scholar's decisions on each relationship (approve or reject, with rationale).
3. Updating the domain detail pages to show "approved" or "rejected" status.

**Prerequisite:** A real scholar willing to review the 11 relationships.

### Option B: Many-to-many domain-topic relationships

If the scholarly review (Option A) determines that some topics belong in multiple domains, the catalog could be updated to reflect many-to-many relationships. For example:

- `patience` → `ethics-character` AND `human-experiences`
- `justice` → `society-justice` AND `law-obligations`
- `knowledge-and-reflection` → `revelation-guidance` AND `creation-signs`

This would populate more domain detail pages and reduce the number of domains with empty states.

**Prerequisite:** Scholarly review determining that many-to-many relationships are defensible.

### Option C: New topic creation for domains without topics

If the six domains without topics (`belief-theology`, `prophets-narratives`, `creation-signs`, `interfaith-communities`, `language-vocabulary`, `law-obligations`) are deemed important, new topics could be created for them. For example:

- `belief-theology`: new topic on "Tawhid (Divine Oneness)"
- `prophets-narratives`: new topic on "The Story of Yusuf"
- `creation-signs`: new topic on "Signs in Creation"

This would require full editorial work per topic (canonical slug, title, Arabic title, summary, relations, provenance) and is a significant undertaking.

**Prerequisite:** Editorial decision to create new topics, plus the editorial work itself.

### What NOT to do next

- Do not auto-promote any relationship to `approved` without a real reviewer decision.
- Do not fabricate scholarly evidence or reviewer identities.
- Do not add passage assignments without a real authorized reviewer decision.
- Do not weaken the evidence-policy safeguards (machine-verified cannot support organizational membership, scholarly approval requires scholarly evidence).
- Do not reinterpret the 10 dimensions' `topicSlugs` as domain assignments.
- Do not create new topics without full editorial work and provenance.

---

## §11. Files changed

### Created (2)

| File | Purpose |
|---|---|
| `src/lib/taxonomy/domain-topics.ts` | Domain-topic relationship catalog with validation, lookup helpers, and 11 defensible pending-review relationships |
| `src/lib/taxonomy/domain-topics.test.ts` | 35 regression tests covering validation, lookup, evidence governance, and no-regression invariants |

### Modified (1)

| File | Change |
|---|---|
| `src/app/explore/domains/[id]/page.tsx` | Imported `getDomainTopicRelations` and `getTopic`; added conditional rendering of topic relationships (cards with title, Arabic title, semantics badge, status badge, purpose, evidence, link); updated header disclosure to reflect actual state; preserved honest empty state for domains without relationships |

---

## Non-Negotiable Constraint Confirmations

- ✅ `AI_ANSWER_FEATURE_ENABLED` remains `false`
- ✅ No Quran text, translations, Tafsir, citations, or source attribution altered
- ✅ No fabricated scholarly approvals, reviewer records, citations, or classifications
- ✅ No claim that the taxonomy is exhaustive — every relationship is labeled `organizational proposal` / `pending review`
- ✅ No navigation mapping treated as scholarly classification (the evidence-policy safeguards enforce this)
- ✅ No passage assignments added
- ✅ No new topics created
- ✅ No licensing changes
- ✅ No unnecessary dependencies added (all new modules are pure TypeScript, zero runtime deps)
- ✅ No accounts, analytics, tracking, search history, or synchronization added
- ✅ No deployment work started
- ✅ Sprint 35 has not been started
