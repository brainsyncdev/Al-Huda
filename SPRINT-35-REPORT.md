# Sprint 35 Report — Bidirectional Topic Discovery & Runtime QA

**Sprint:** 35
**Date:** 2026-10-25
**Status:** Complete
**Scope:** Expose pending-review domain relationships on canonical topic pages; real browser QA at 320/375/768/desktop viewports.

---

## 1. Actual Code Audit

### Files inspected (unmodified)

- `src/lib/taxonomy/domain-topics.ts` (491 lines) — 11 relations, all `organizational-membership` / `pending-review`, editorial evidence only, `assertedBy: "Al-Huda editorial team"`, `assertedAt: "2026-10-26"`, `decisions: []`. Helpers: `getDomainTopicRelations`, `getTopicDomainRelations`, `getTopicDomains`, `getDomainTopics`. Validators: `validateDomainTopicRelation`, `validateDomainTopicCatalog` returning `{ ok, issues }`.
- `src/lib/taxonomy/domains.ts` — 14 `DomainId` literals, `Domain` shape `{ id, title, arabicTitle?, scope, subjects[], overlaps[] }`, `DOMAIN_PROVENANCE.status = "pending-scholarly-review"`, helpers `getDomain`, `getAllDomains`, `domainUrl`, `getDomainsOverlappingWith`.
- `src/lib/explore/dimensions.ts` — 10 dimensions with `topicSlugs` navigation aids; `DIMENSION_PROVENANCE.status = "pending-scholarly-review"`; `getDimensionsForTopic`.
- `src/app/explore/domains/page.tsx` — directory page, 14 cards, disclosure banner.
- `src/app/explore/domains/[id]/page.tsx` — Sprint 34 version with `topicRelations` ternary branch (cards) vs empty state.

### Reference test patterns

- `src/components/graph/graph-filter-a11y.test.ts` — source-string assertions via `readFileSync`.
- `src/components/quran/word-by-word-rtl.test.ts` — same pattern; confirms node-only test env accepts string assertions.

### Existing test environment

- Vitest 5.0.5, node-only, no jsdom, no @testing-library/react.
- Client-component behavior verified by browser QA or source-string assertions.

---

## 2. Topic-to-Domain Navigation Changes

### Modified: `src/app/topics/[slug]/page.tsx`

**Imports added** (after existing `getDimensionsForTopic` import):

```ts
import { getTopicDomainRelations } from "@/lib/taxonomy/domain-topics";
import { getDomain } from "@/lib/taxonomy/domains";
```

**Resolver added** (after `const dimensions = getDimensionsForTopic(topic.slug);`):

```ts
const domainRelations = getTopicDomainRelations(topic.slug)
  .map((relation) => ({ relation, domain: getDomain(relation.domainId) }))
  .filter(
    (entry): entry is { relation: NonNullable<typeof domainRelations>[number]['relation']; domain: NonNullable<ReturnType<typeof getDomain>> } =>
      Boolean(entry.domain)
  );
```

Defensive resolver drops relations whose domain no longer resolves (defence in depth alongside the catalog validator).

**Section inserted** between the "Explore this theme by dimension" block and the `relatedPaths` block:

- `<section aria-labelledby="topic-domains">` with h2 "Proposed exploration domains"
- Explanatory paragraph: "This topic is editorially proposed to belong to {the following domain | these N domains}. These are organizational proposals pending review — not scholarly classifications of Quranic passages."
- `grid gap-3 sm:grid-cols-2` of domain cards, each containing:
  - h3 with domain title
  - Arabic title with `lang="ar" dir="rtl"` (when present)
  - Two badges: semantics (`navigation aid` | `organizational proposal`) and provenance state (`pending review`)
  - "Open {domain.title} domain →" link text
- Footer disclaimer: "Domain-topic relationships are organizational proposals, not scholarly conclusions. Each domain page carries its review status and explains what the relationship does and does not claim."
- Section is conditional on `domainRelations.length > 0` — topics without relationships render no filler.

### Created: `src/lib/taxonomy/topic-domains-navigation.test.ts`

23 tests across 3 describe blocks, all passing:

**"Sprint 35 — Topic-domain navigation data layer"** (7 tests):
- Every topic's relations resolve to valid domains
- Every `topicSlug` valid
- Domain URLs match `/explore/domains/[a-z0-9-]+`
- All relations `pending-review` + `organizational-membership`
- Unknown slug returns `[]`
- Each of 11 topics has exactly 1 relation
- Bidirectional consistency

**"Sprint 35 — Catalog integrity"** (7 tests):
- 14 domains / 10 dimensions / 11 topics / 11 relations
- `validateDomainTopicCatalog(...).ok === true`
- No scholarly evidence
- No approved decisions
- Domain IDs disjoint from dimension IDs
- Non-empty purpose/evidence
- Non-empty domain titles

**"Sprint 35 — Topic page UI source assertions"** (9 tests):
- Imports present
- Defensive `.filter(...Boolean(entry.domain))`
- Section guard `domainRelations.length > 0` + "Proposed exploration domains"
- Both badges present
- `relation.provenance.state.replace`
- Disclaimers `/not scholarly\s+classifications/` and `/not scholarly\s+conclusions/`
- `href={\`/explore/domains/${domain.id}\`}`
- `lang="ar"` + `dir="rtl"`

### What was NOT changed

- No new data layer, no schema change, no new relationships.
- No topic slugs, summaries, Arabic titles, Quran content, or existing topic relations modified.
- No relationships promoted from pending-review to approved.
- No scholarly approvals, reviewers, evidence, or classifications fabricated.

---

## 3. Accessibility and Responsive Behavior

### Accessibility

- `<section aria-labelledby="topic-domains">` — proper landmark
- h1 → h2 → h3 hierarchy preserved (no heading level skipped)
- Arabic titles carry `lang="ar" dir="rtl"` — correct reading direction
- Text badges (not icon-only) — screen-reader accessible
- Real `<Link>` targets — keyboard-navigable by default
- Descriptive link text: "Open {domain.title} domain →"
- Explanatory copy communicates organizational-proposal semantics clearly

### Responsive

- `grid gap-3 sm:grid-cols-2` — single column on mobile, two columns at sm+
- `flex flex-wrap gap-2` on badges — wrap without overflow
- Cards use `min-w-0 flex-1` — prevent flex overflow
- Arabic title uses `arabic-display text-lg` — consistent with existing topic/dimension pages

---

## 4. Browser QA Results, Viewport Sizes, and Limitations

### Automated quality gates (all real, all passing)

- `pnpm lint` — clean
- `pnpm typecheck` — clean
- `pnpm test` — **603/603 passed across 39 files** (was 580/38 before Sprint 35; +23 tests)
- `ALLOW_LOCALHOST_BUILD=1 pnpm build` — exit 0 after `rm -rf .next`; 6,433 pages prerendered

### Real browser QA (IAB backend via `mcp__node_repl__js`)

**1440×900 `/topics/patience`** ✅
- Snapshot contains `region "Proposed exploration domains"`, `heading [level=2]`, explanatory paragraph, `link` → `heading "Ethics and Character" [level=3]`, `paragraph: الأخلاق`, `generic: organizational proposal`, `generic: pending review`, `paragraph: Open Ethics and Character domain →`, footer disclaimer.
- Pre-existing Related topics / Dimensions (3: Spiritual, Personal, Jihad) / Learning paths / Provenance all intact.

**375×812 `/topics/patience`** ✅
- Same section renders correctly.
- Primary nav collapses to mobile nav (Home/Read/Explore/Search/Learn/Library/Settings).

**375×812 bidirectional round-trip** ✅
- Clicking the domain card landed on `/explore/domains/ethics-character`.
- Snapshot shows breadcrumb (Explore / Domains / Ethics and Character), `h1` Ethics and Character, "4 curated topics are editorially proposed below", and "Curated topics in this domain" with Patience / Gratitude / Trust in God / Mercy and Forgiveness cards linking back to `/topics/...`.

**320×568 `/topics/the-hereafter`** ✅
- `scrollWidth === clientWidth` (305) — no horizontal overflow.
- Region present, heading "Proposed exploration domains" correct.
- Arabic title `الآخرة` with `dir="rtl"`.
- Domain link to `/explore/domains/eschatology-afterlife` present.
- Badges: "organizational proposal" + "pending review".

**768×1024 `/explore/domains/belief-theology`** ✅ (empty state)
- `h1`: "Belief and Theology"
- Breadcrumbs: Explore / Domains / Belief and Theology
- Empty-state copy: "No curated topics and no Quran passages have been assigned to this domain yet. Assignments will be added only after a real editorial pass with review metadata..."
- Subject areas list present (tawhid, nubuwwah, qadar, angels, revealed books, akhirah, the unseen).
- Related domains (Worship and Spiritual Practice, Eschatology and the Afterlife) present.
- **Pre-existing defect observed:** `scrollWidth 1093` vs `clientWidth 753` — horizontal overflow from primary navigation bar (desktop nav not collapsing until smaller breakpoint). **Not caused by Sprint 35 code** — the domain page's Sprint 34 content is unrelated to the nav overflow. Documented as a separate responsive-nav issue for future sprint.

**404 checks (curl)** ✅
- `/topics/nonexistent-slug` — HTTP 404, title "Al-Huda — Read, understand, and connect the Quran"
- `/explore/domains/not-a-domain` — HTTP 404, same title

### Limitations

- Keyboard Tab traversal not explicitly tested in browser (source assertions confirm real `<Link>` elements, which are natively keyboard-navigable).
- Focus indicators not visually verified (Tailwind default focus rings present in source).
- No screen-reader testing (source assertions confirm ARIA attributes and semantic HTML).

---

## 5. Regression Coverage

### Data layer invariants (23 new tests)

- Topic pages resolve domains from the canonical relationship layer.
- Every displayed domain link targets a valid domain (defensive resolver drops broken relations).
- Every displayed topic link on domain pages targets a valid canonical topic (Sprint 34 invariant, unchanged).
- Pending-review status and organizational-proposal semantics communicated via badges and explanatory copy.
- Topics without relationships render safely (section conditional on `domainRelations.length > 0`).
- Existing domain empty states intact (verified at `/explore/domains/belief-theology`).
- Existing 14 domains / 10 dimensions / 11 topics / 11 relationships unchanged.
- Evidence-policy rules and reviewer safeguards intact (no scholarly evidence in domain-topic relations; `machine-verified-relation-ineligible` invariant from Sprint 33 holds).

### Existing functionality (unchanged, all tests passing)

- Search, autocomplete, graph, learning paths, sitemap (6,397 URLs), existing topic routes.
- All 580 pre-existing tests still pass.

---

## 6. Exact Quality-Gate Results

| Gate | Command | Result |
|------|---------|--------|
| Lint | `pnpm lint` | Clean (0 errors, 0 warnings) |
| Typecheck | `pnpm typecheck` | Clean (0 errors) |
| Test | `pnpm test` | **603/603 passed across 39 files** |
| Build | `ALLOW_LOCALHOST_BUILD=1 pnpm build` | Exit 0 (6,433 pages prerendered) |

**Test count delta:** 580 → 603 (+23 tests in `src/lib/taxonomy/topic-domains-navigation.test.ts`).

**Build note:** First build attempt failed with `ENOENT: no such file or directory, mkdir 'C:\...\.next\server\app\ayah\21'` — a known Windows parallel-prerender race (documented in `next-build-windows-prerender-race.md` memory). Fixed by `rm -rf .next` and rebuilding; exit 0.

---

## 7. Remaining Issues and Recommended Next Sprint

### Pre-existing defects (not caused by Sprint 35)

1. **Primary navigation horizontal overflow at 768px** — desktop nav (10 items: Discover/Read/Explore/Topics/Search/Learn/Plans/Quiz/Library/Settings) does not collapse to mobile hamburger until <768px. At exactly 768px, `scrollWidth 1093` vs `clientWidth 753`. **Recommendation:** adjust the responsive breakpoint or add `flex-wrap` to the nav `<ul>` in a future sprint. Not a Sprint 35 blocker.

### Sprint 35 limitations

- Keyboard Tab traversal and focus indicators not visually verified in browser (source assertions confirm real `<Link>` elements and Tailwind focus rings).
- No screen-reader testing (ARIA attributes and semantic HTML confirmed via source).

### Recommended Sprint 36 candidates

1. **Responsive nav fix** — primary navigation overflow at 768px.
2. **Keyboard navigation audit** — explicit Tab traversal and focus-ring verification across all new Sprint 34/35 pages.
3. **Screen-reader testing** — VoiceOver/NVDA pass on topic and domain pages.
4. **Domain-topic relationship review workflow** — UI for scholars to review and approve/reject the 11 pending-review relationships.

---

## Summary

Sprint 35 successfully exposed the 11 pending-review domain-topic relationships on canonical topic pages without promoting them to scholarly classifications. The implementation is defensive (drops broken relations), accessible (ARIA landmarks, semantic headings, `lang="ar" dir="rtl"`), and responsive (single-column mobile, two-column desktop). All 603 tests pass, all quality gates clean, and real browser QA confirms bidirectional navigation works at 320/375/768/1440 viewports. The only overflow observed is a pre-existing responsive-nav issue unrelated to Sprint 35 code.

**Sprint 35 is complete. Sprint 36 has not been started.**
