# Al-Huda — Product Requirements Document (PRD)

Version: 4.0
Status: Implementation baseline + roadmap — single source of truth
Prepared: 09 November 2026
Product category: Quran learning, discovery, reflection, and knowledge platform
Platform: SEO-first responsive web application (local-first, account-free)
Stack: Next.js 15 App Router, TypeScript, Tailwind CSS, Radix/shadcn UI, Vitest

**Supersession.** This document supersedes both earlier PRDs, which are preserved in `archive/`:

- [`archive/PRD-v3.0.md`](archive/PRD-v3.0.md) — the corrective web-first rewrite.
- [`archive/AL-HUDA-PRD-v2.0-COMPLETE.md`](archive/AL-HUDA-PRD-v2.0-COMPLETE.md) — the aspirational Flutter/NestJS/kids-mode blueprint. Most of its scope was never built and is now explicitly deferred (Appendix A).

Every statement in this document marked **COMPLETE**, **PARTIAL**, or **BLOCKED** is grounded in the source code as of Sprint 44 (2026-11-02). Claims cite repository paths. Where a capability is implemented in code but not measured or human-verified, it is marked **UNVERIFIED**.

---

## 1. Executive Summary

Al-Huda is a Quran-centered web product that helps people move from fragmented Quran reading and searching to a connected experience. It links Quranic ayat with verified translations, tafsir, themes, roots, cross-references, learning and memorization tools, and private personal reflections.

**The product that exists today** is a local-first, account-free, SEO-first Next.js application. It ships:

- All **114 surahs / 6,236 ayat** from a pinned, versioned dataset (`quran-json@3.1.2`, CC-BY-4.0), structurally validated at build time.
- **116 translation editions across 44 languages** delivered on demand from Tanzil.net through a constrained first-party proxy (default: Urdu — Jalandhry). Rights review outstanding.
- **Two classical Arabic tafsirs** readable in-app via the same proxy (al-Jalalayn, al-Muyassar) and two English tafsirs as outbound links.
- **Word-by-word analysis** from vendored QUL data (77,429 words, sha256-manifested).
- **Root and morphology exploration**: 1,642 source-backed roots discovered, 1,469 published through an automated, deterministic pipeline; a 124,147-record morphology index.
- **11 curated topics**, **10 life-dimensions** (topic-level navigation aid), and a **14-domain catalog** (organizational proposal), all stamped `pending-scholarly-review`.
- **Spaced-repetition revision, deterministic quizzes, curated learning paths, and user-defined reading plans** — all stored locally.
- A **4-locale UI** (English default, Urdu, Arabic, Chinese) with RTL handling.
- A **public read-only `/api/v1` surface** (13 self-documenting endpoints) plus JSON-LD, sitemap, robots, and canonical URL integrity.
- **AI religious answers compile-time disabled** (`AI_ANSWER_FEATURE_ENABLED = false as const`); a grounded-answer harness and seven safety gates exist, of which only one (`source-registry`) is met.

**The core product idea** is an interconnected Quran knowledge system: users can begin with an ayah, a topic, a root, a dimension, or a search query and discover relevant Quranic passages with clear references and trustworthy scholarly context.

Al-Huda does **not** present AI-generated religious interpretation as authoritative. Quran text, translations, tafsir, recitation metadata, and scholarly references have explicit provenance. AI may help users search, navigate, summarize approved sources, and organize personal learning, but it must not fabricate verses, citations, hadith, rulings, or scholarly consensus.

**Product thesis.** Make the Quran easier to explore, understand in context, revisit, memorize, and connect across topics — without altering the text or replacing qualified scholarship.

---

## 2. Vision, Mission, and Principles

**Vision.** A trusted, accessible, interconnected Quran platform for Muslims and anyone sincerely exploring the Quran.

**Mission.** Bring Quranic text, reliable source material, thematic discovery, and personal learning into one coherent experience.

**Product principles** (carried verbatim from v3.0; still correct):

1. **Textual integrity**: The Quranic Arabic text must be sourced, versioned, and validated. Never silently alter it.
2. **Source transparency**: Every translation, tafsir excerpt, audio asset, and scholarly claim has a source and edition where applicable.
3. **Clear epistemic boundaries**: Distinguish Quran text, translation, tafsir, editorial topic mapping, AI-generated explanation, and personal notes.
4. **Respectful UX**: No manipulative streaks, guilt-driven notifications, or gamification that trivializes worship.
5. **Privacy by default**: Personal reflections and learning activity are private unless the user explicitly chooses otherwise.
6. **Accessibility**: Support Arabic RTL, readable typography, keyboard navigation, screen readers, and low-bandwidth use.
7. **SEO with integrity**: Public reference pages should be useful and accurate, not thin pages generated solely to capture search traffic.
8. **Incremental delivery**: Ship a reliable Quran reader and discovery foundation before advanced AI or social features.

---

## 3. Goals and Non-Goals

**Product goals.**

- Provide accurate, fast access to all 114 Surahs and 6,236 ayat in the canonical dataset, with dataset-specific numbering conventions documented.
- Support Arabic text, transliteration, translations, and sourced tafsir.
- Connect ayat to topics, roots, dimensions, and cross-references through an auditable relationship model.
- Enable search by reference, Arabic text, translation text, topic, root, and natural-language intent.
- Offer private bookmarks, notes, reading progress, and memorization/revision.
- Create indexable, canonical public pages for Surahs, ayat, topics, roots, and dimensions.
- Build a maintainable architecture that can later support mobile clients.

**Non-goals for the active product.** These v2.0 ambitions are explicitly deferred to Appendix A and are NOT part of the normative scope:

- NOOR kids mode (3–12) with AI-generated personalized stories.
- Flutter Android/iOS native clients.
- A NestJS backend service.
- Monetization, subscriptions, and a scholar partnership program.
- A hadith corpus (Sihah Sitta / 50,884 hadiths).
- An AI story generator and a live "guidance mode" chat.
- Ayah-level 10-dimension tagging of all 6,236 ayat.

**Continuing non-goals** (from v3.0):

- Issuing fatwas or acting as a religious authority.
- Replacing scholars, teachers, or established tafsir works.
- Unreviewed AI-generated tafsir presented as fact.
- Public social feed, open comments, follower graphs, or debate forums.
- Full Quran audio hosting unless licensing and infrastructure are confirmed.
- User-generated public interpretations or unmoderated verse-topic claims.

---

## 4. Target Users and Jobs to Be Done

**Primary segments served by the shipped product.**

1. **Everyday reader**: Clean Quran reading experience, translation, bookmarks, continuity. Served by `/`, `/quran`, `/ayah/:s/:a`, `/library`.
2. **Topic explorer**: Explore themes (sabr, shukr, tawakkul, mercy, justice, family, loss, hope). Served by `/topics`, `/explore`.
3. **Learner/student**: Compare translations, inspect context, consult referenced tafsir and roots. Served by `/topics`, `/explore/root`, `/sources`.
4. **Hifz learner**: Structured, adjustable ayah revision workflow. Served by `/learn/revision`.
5. **New Muslim or non-Muslim explorer**: Clear language, introductory navigation, transparent references. Served by `/onboarding`, `/learn/paths`, home.
6. **Researcher/developer**: Stable references, structured data, provenance, documented read-only API. Served by `/api/v1`, JSON-LD.

**Jobs to be done.**

- "When I encounter an ayah, help me understand where it sits in the Surah and find reliable explanations."
- "When I have a topic or root in mind, help me discover relevant ayat without claiming a verse says more than its source supports."
- "When I save an ayah, let me attach a private reflection and find it again later."
- "When I memorize, help me revise at an appropriate interval and track my own progress."
- "When I share a reference, give others a stable, readable page with correct citations."

> v2.0's additional personas (children in NOOR mode, non-Muslim "Kashf" seekers) are deferred with their modes to Appendix A.

---

## 5. Release Priorities

**MVP (shipped).** Quran reader, surah/ayah navigation, Arabic + built-in English translation, on-demand 116-edition translation catalog, word-by-word, mushaf metadata, search (lexical + opt-in semantic), curated topics, 10 dimensions, 14 domains, root/morphology explorer, knowledge-graph API/UI, discover hub, library (local), settings, revision, reading plans, quizzes, learning paths, onboarding, sources/provenance, editorial log, report intake, SEO + JSON-LD + sitemap + robots, 4-locale UI, `/api/v1`. AI answers disabled.

**Release 1.x (next).** Clear the release blockers in §19 (licensing reviews, qualified reviewer, report destination, a11y audit, Core Web Vitals, rendered social metadata, durable rate limiting). Expand curated topics and root activation behind human review.

**Release 2 (later).** Grounded AI assistant after all seven safety gates pass. Deeper taxonomy (domain → topic/passage assignments). Interactive graph visualization refinement.

**Deferred.** Everything in Appendix A.

---

## 6. Current State — What Is Built

This section is the audit anchor. Every row cites a repository path verifiable in the source tree as of Sprint 44.

### 6.1 Route inventory (from `src/app/`)

**Public content.** `/` (home), `/quran`, `/quran/[slug]`, `/ayah/[surah]/[ayah]`, `/topics`, `/topics/[slug]`, `/search`, `/discover`.

**Explore.** `/explore` (hub), `/explore/dimension/[id]`, `/explore/domains`, `/explore/domains/[id]`, `/explore/graph`, `/explore/root`, `/explore/root/[root]`, `/explore/theme/[name]` (redirect).

**Learn.** `/learn` (hub), `/learn/paths`, `/learn/paths/[slug]`, `/learn/plans`, `/learn/quiz`, `/learn/revision`.

**Personal (local-first).** `/library`, `/library/notes`, `/settings`, `/settings/privacy`, `/onboarding` (noindex).

**Trust & legal.** `/sources`, `/editorial`, `/report`, `/about`, `/privacy`, `/terms`, `/accessibility`.

**System.** `error.tsx`, `not-found.tsx`, `robots.ts`, `sitemap.ts`, `layout.tsx`.

Canonical URL conventions are enforced by tests: `src/app/url-integrity.test.ts`, `src/app/sitemap.test.ts`.

### 6.2 Data assets

| Asset | Path | Facts |
|---|---|---|
| Quran core | `quran-json@3.1.2` (npm, pinned) | 114 surahs, 6,236 ayat, Arabic + built-in English + transliteration. CC-BY-4.0. |
| Morphology index | `data/morphology-index.json` | 124,147 records (74,179 word-level + 49,968 ayah-level). |
| QUL SQLite DBs | `data/word-root.db`, `word-lemma.db`, `ayah-root.db`, `word-stem.db`, etc. | Imported by `scripts/import-morphology.py`. |
| Root occurrence indexes | `data/root-occurrences/` | 1,469 per-root files. |
| Root discovery registry | `data/root-discovery-registry.json` | 1,642 discovered roots. |
| Batch publication report | `data/batch-publication-report.json` | Reconciliation of eligible/blocked/published. |
| Word-by-word data | `public/word-data/` | 115 files, 77,429 words, sha256 manifest (QUL, MIT). |
| Semantic embeddings | `public/embeddings/` | 6,236 × 384 float16, Xenova/all-MiniLM-L6-v2 (Apache-2.0). |
| Mushaf metadata | `src/lib/quran/mushaf-data.ts` | Generated from `quran-data.xml`; build-verified 30 juz / 604 pages / 240 quarters / 556 rukus / 7 manzils / 15 sajda / 6,236 ayat. |
| Editorial review log | `content/editorial/reviews.json` | 23 entries (11 topics, 6 sources, 6 features). |

### 6.3 Quality facts

| Check | Reported value | Command |
|---|---|---|
| Test suite | 809 tests / 48 files passing | `pnpm vitest run` |
| Quran data validation | 114 surahs, 6,236 ayat, 0 issues | `pnpm validate:quran` |
| License register validation | 13 source records, 0 issues | `pnpm validate:licenses` |
| Production build | 6,433 static pages, exit 0 | `pnpm build` |
| Lint / typecheck | clean | `pnpm lint`, `pnpm typecheck` |
| Build gate | blocks localhost/invalid `NEXT_PUBLIC_SITE_URL` | `scripts/validate-build-env.mjs` |

> These are **reported** results from Sprint 44, recorded as the verification basis. A passing validator is structural assurance, not licensing clearance or scholarly approval.

### 6.4 Source catalog (from `src/lib/quran/sources.ts`)

| ID | Provides | License | Method |
|---|---|---|---|
| `quran-json` | Structure, surah metadata, Arabic, translation, transliteration | CC-BY-4.0 | package |
| `quranenc` | Uthmani Arabic text + Arabic chapter metadata | per quran-json CC-BY metadata | package |
| `tanzil-sahih` | English (Saheeh International) | Tanzil terms | package |
| `tanzil-translit` | Latin transliteration | Tanzil terms | package |
| `tanzil-translations` | 116 editions / 44 languages on demand | Tanzil terms | link (proxy) |
| `islamic-network-audio` | Per-ayah MP3, 12 reciters | streamed, no recording licence published | link |
| `tanzil-mushaf-metadata` | juz/page/hizb/quarter/ruku/manzil/sajda | CC-BY | package |
| `tafsir-jalalayn` | Tafsir al-Jalalayn (Arabic) | Tanzil terms | link (proxy) |
| `tafsir-muyassar` | Tafsir al-Muyassar (Arabic) | Tanzil terms | link (proxy) |
| `semantic-embeddings` | English semantic search index | Apache-2.0 | package |
| `qul-word-data` | Word-by-word segmentation/gloss | MIT | package |
| `tafsir-ibn-kathir` | Tafsir Ibn Kathir (English abridged) | external | link-out |
| `tafsir-ma(arif)` | Ma'ariful Quran (English) | external | link-out |

**Delivered ≠ Cleared.** Per [`DATA-PROVENANCE.md`](DATA-PROVENANCE.md): *Delivered* means the mechanism exists and content is reachable; *Cleared* means a human reviewed the terms and permission is established. Nothing in this repository establishes clearance for the audio recordings, the Tanzil proxy catalog, or the two in-app tafsirs. These remain **release dependencies**, not cleared assets.

---

## 7. Information Architecture

**Primary navigation.** Home, Read Quran, Explore (Topics / Dimensions / Domains / Roots / Graph), Search, Discover, Learn (Paths / Plans / Quiz / Revision), My Library (local), Settings, About / Sources.

**URL and SEO rules.**

- Use stable, human-readable URLs.
- Canonical convention: `/quran/[slug]`, `/ayah/[surah]/[ayah]` (no colon in path), `/topics/[slug]`, `/explore/root/[root]`, `/explore/dimension/[id]`.
- Enforced consistently; duplicate indexed routes for the same ayah are prevented and asserted by `src/app/url-integrity.test.ts`.
- User-specific pages (`/library`, `/settings`, `/onboarding`) are local and noindex.
- Correct Arabic page direction and language metadata per content block.

---

## 8. Core User Journeys

**Journey A — Read an ayah.** Open index or shared link → select surah → read Arabic + chosen translation → open ayah detail → see reference, surrounding context, tafsir, related topics → save or copy stable link.
Acceptance: references consistent with dataset; Arabic selectable and RTL; translation edition labeled; missing tafsir shown as unavailable, not fabricated. — **COMPLETE**.

**Journey B — Explore a topic/root/dimension.** Select curated topic/root/dimension or search → results show ayat with reference, translation, relevance → open ayah for context/sources → move to related items.
Acceptance: curated relationships carry provenance and review status; UI distinguishes lexical matches from thematic/editorial associations; curated lists never implied exhaustive. — **COMPLETE**.

**Journey C — Ask a question (AI).** User submits question → system retrieves from approved corpus → concise cited answer or abstention.
— **BLOCKED by design.** `AI_ANSWER_FEATURE_ENABLED = false as const` (`src/lib/ai/feature-flag.ts`). No `/api/ai/ask` route exists. Re-opening requires all seven safety gates (§11).

**Journey D — Save and revisit.** Bookmark ayah → add private note/tag → find in Library → export/delete.
Acceptance: notes private by default; export/delete functional (backup envelope v4); local-only persistence disclosed. — **COMPLETE (local-only)**.

**Journey E — Memorization/revision.** Choose ayat/range → select revision mode/frequency → mark recall → scheduler proposes reviews → user edits/resets.
Acceptance: reminders optional; no shame/streak; progress is personal learning data, not a measure of faith. — **COMPLETE**.

---

## 9. Functional Requirements — Statused Ledger

Priority: **P0** = release blocker; **P1** = important; **P2** = later. Status legend in §9.10. FR numbers FR-001–FR-075 are preserved verbatim from v3.0; status reflects Sprint-44 code. FR-009 (a v3.0 gap) is assigned to word-by-word analysis, which is built. Gaps FR-045–049, FR-055–059, FR-067–069 remain reserved and are **not** backfilled. New built capabilities use FR-076+ blocks.

### 9.1 Quran reader

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-001 | P0 | Surah index with Arabic name, transliteration/English, verse count, verified revelation metadata | COMPLETE |
| FR-002 | P0 | Display all available ayat in canonical order | COMPLETE |
| FR-003 | P0 | Navigation by Surah and ayah number | COMPLETE |
| FR-004 | P0 | Display selected translation with edition/source label | COMPLETE — built-in English + 116 Tanzil editions on demand |
| FR-005 | P0 | Copy/share link to stable ayah reference | COMPLETE |
| FR-006 | P1 | Font size, line spacing, reading layout preferences | COMPLETE |
| FR-007 | P1 | Continuous reading + next/previous Surah navigation | COMPLETE |
| FR-008 | P1 | Juz/page metadata validated against chosen mushaf dataset | COMPLETE — Tanzil CC-BY boundaries verified at build |
| FR-009 | P1 | Word-by-word analysis from a verified dataset | COMPLETE — QUL vendored (`src/lib/quran/words.ts`, `public/word-data/`); roots not bundled here |

### 9.2 Search and discovery

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-010 | P0 | Search by exact reference (e.g. 2:255) | COMPLETE |
| FR-011 | P0 | Search Arabic and translation text with normalized indexing | COMPLETE — Arabic + built-in English indexed; runtime translation not indexed |
| FR-012 | P1 | Filter by Surah, edition, topic, content type | COMPLETE — surah/topic/juz/revelation filters; edition search as separate mode |
| FR-013 | P1 | Snippets with highlighted terms preserving readable Arabic | COMPLETE — highlighting for built-in English |
| FR-014 | P2 | Natural-language semantic retrieval over approved content | PARTIAL — lexical default; opt-in client-side embeddings, English-only |
| FR-015 | P2 | Show why a result matched | COMPLETE |

### 9.3 Topic system and knowledge graph

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-020 | P0 | Curated topics with stable slug, title, description, language, editorial status | COMPLETE |
| FR-021 | P0 | Link topics to ayat through typed relationships | COMPLETE |
| FR-022 | P0 | Record creator/source/review status/last-reviewed per relationship | COMPLETE |
| FR-023 | P1 | Related topics and ayah-to-ayah cross-references | COMPLETE |
| FR-024 | P1 | Accessible list view alongside any graph visualization | COMPLETE |
| FR-025 | P2 | Interactive graph visualization with keyboard-accessible alternatives | COMPLETE — SVG with keyboard-focusable nodes (`/explore/graph`) |

### 9.4 Tafsir and source presentation

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-030 | P0 | Show author/work/edition/language for tafsir | COMPLETE |
| FR-031 | P0 | Distinguish full text, excerpt, summary, external link | COMPLETE |
| FR-032 | P0 | Track licensing and permitted display/use per source | COMPLETE — rights register in `src/lib/quran/sources.ts` |
| FR-033 | P1 | Compare multiple translations side-by-side | PARTIAL — parallel mode up to 3 editions; per-edition rights unverified |
| FR-034 | P1 | Source details and editorial methodology | COMPLETE |
| FR-035 | P2 | Tafsir search across works where rights/quality permit | COMPLETE — merged search over al-Jalalayn + al-Muyassar (`/search?mode=tafsir`) |

### 9.5 User library

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-040 | P0 | Allow authenticated users to bookmark ayat | PARTIAL — bookmarking works locally; no accounts exist; FR-044 is the deliberate substitute |
| FR-041 | P1 | Private notes and tags | COMPLETE |
| FR-042 | P1 | Sync library across devices | BLOCKED — no accounts/server store by design |
| FR-043 | P1 | Export and delete personal data | COMPLETE — backup envelope v4 |
| FR-044 | P2 | Local-only anonymous library with transparent persistence limits | COMPLETE — this is the architecture, not an alternative |

### 9.6 Learning and memorization

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-050 | P1 | Select a revision range | COMPLETE |
| FR-051 | P1 | Record review events and self-rated recall | COMPLETE |
| FR-052 | P1 | Schedule reviews with configurable spaced repetition | COMPLETE |
| FR-053 | P1 | No-streak / no-shame progress interface | COMPLETE |
| FR-054 | P2 | Audio-assisted review if licensed assets/playback ready | PARTIAL — streaming implemented; recording rights unresolved |

### 9.7 AI assistant

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-060 | P2 | Retrieve only from approved, versioned source material | PARTIAL — allowlist + refusal path in code; runtime disabled; allowlist admits non-prose package records and must be narrowed |
| FR-061 | P2 | Return citations with each factual claim | PARTIAL — claim-level checks unit-tested; never run against a live model |
| FR-062 | P2 | Separate retrieved quotations from generated summaries | PARTIAL — implemented; unverified end-to-end |
| FR-063 | P2 | Abstain when retrieval is insufficient | PARTIAL — abstention paths implemented; unverified |
| FR-064 | P2 | Avoid presenting opinion/generated content as Quran/hadith/tafsir/fatwa/consensus | PARTIAL — non-authority claims refused before retrieval |
| FR-065 | P2 | Log source IDs and model/version metadata for audits | PARTIAL — `AUDIT_RETENTION` defined; records hold no user/prompt; privacy review gate unmet |
| FR-066 | P2 | User feedback/reporting for inaccurate answers | PARTIAL — `/report` intake exists; no destination configured; no AI answers to report |

The feature flag is off (`src/lib/ai/feature-flag.ts`); no `/api/ai/ask` route exists. See §11.

### 9.8 Editorial/admin tooling

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-070 | P0 | Import datasets with schema validation and duplicate detection | COMPLETE — package pin + validation scripts |
| FR-071 | P0 | Immutable source/version metadata for Quran text and translations | PARTIAL — version string + structural scan; no byte-level checksum baseline for the core package |
| FR-072 | P0 | Review and approve topic-to-ayah mappings before publication | PARTIAL — workflow + review log exist; no qualified reviewer, so nothing can be approved |
| FR-073 | P1 | Track changes, reviewers, publication state | PARTIAL — current state/curator/date recorded; per-event history relies on git |
| FR-074 | P1 | Roll back an incorrect mapping or dataset release | COMPLETE — revert commit / re-pin, documented |
| FR-075 | P1 | Display content rights and source status to editors | COMPLETE — `/sources`, `/editorial` |

### 9.9 Reference & attribution display standard (new)

This block ports the mandatory reference-card rule from v2.0 §05.5 into the normative spec, statused against actual code.

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-076 | P0 | Every displayed ayah carries surah name, ayah number, and a stable reference path | COMPLETE — `/ayah/[surah]/[ayah]` header, `src/lib/quran/reference.ts` |
| FR-077 | P1 | Ayah view shows juz, page, hizb, ruku, manzil, and sajda markers from validated mushaf metadata | COMPLETE — `src/app/ayah/[surah]/[ayah]/page.tsx` via `src/lib/quran/juz.ts` |
| FR-078 | P1 | Tafsir/attribution is labeled with author, language, and license and never mistaken for Quran translation | COMPLETE — `TafsirLinks`, `TafsirViewer`, `SourcePanel` on the ayah page |
| FR-079 | P2 | Public API publishes validated juz/page references | PARTIAL — juz published; page numbers deliberately withheld from `/api/v1` pending printed-mushaf verification (`src/app/api/v1/route.ts`) |

> Page numbers ARE shown in the UI (Madani Mushaf via CC-BY Tanzil metadata, build-verified for 604 pages) but are withheld from the machine-readable API until verified against a specific printed mushaf. This asymmetry is intentional.

### 9.10 Status legend

| Code | Meaning |
|---|---|
| COMPLETE | Code, behavior, integration, and the stated verification basis are in place. |
| PARTIAL | Some behavior exists, but a named piece is missing, unverified, or blocked. |
| NOT IMPLEMENTED | No code exists for this requirement. |
| BLOCKED | Cannot be completed without an external dependency, licence, authority, or architectural change. |
| DEFERRED | Explicitly out of scope (see Appendix A). |
| UNVERIFIED | Implemented in code, but no measurement or rendered-output check exists. |

### 9.11 Discovery & taxonomy (new)

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-080 | P1 | 10 life-dimensions as topic-level navigation aids (not ayah-level tags) | COMPLETE — `src/lib/explore/dimensions.ts`, `/explore/dimension/[id]` |
| FR-081 | P2 | 14-domain organizational catalog (proposal; no topic/passage assignments) | COMPLETE — `src/lib/taxonomy/domains.ts`, `/explore/domains` |
| FR-082 | P1 | Knowledge-graph nodes/edges with scope, provenance, review status | COMPLETE — `src/lib/graph/knowledge-graph.ts`, `/api/v1/graph` |
| FR-083 | P1 | Discover hub aggregating entry points | COMPLETE — `/discover` |
| FR-084 | P2 | Deterministic verse-of-the-day from curated refs | COMPLETE — 34 curated refs, day-of-year (`src/lib/quran/verse-of-day.ts`) |
| FR-085 | P2 | Onboarding for goal-based path selection (noindex) | COMPLETE — `/onboarding` |
| FR-086 | P2 | Content report intake | PARTIAL — `/report` + `src/lib/report-destination.ts`; destination unconfigured |

### 9.12 Morphology & roots (new)

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-090 | P1 | Import and validate QUL morphology with reconciliation | COMPLETE — `scripts/import-morphology.py`, `data/morphology-index.json` |
| FR-091 | P1 | Separate occurrence validity / lemma coverage / thematic classification | COMPLETE — three-dimension separation enforced |
| FR-092 | P1 | Disclosed-coverage publication policy (Policy B) | COMPLETE — `docs/POLICY-DECISION-43.md`, publication-policy v2.0.0 |
| FR-093 | P2 | AI-assisted lemma review harness | PARTIAL — `src/lib/morphology/ai-lemma-reviewer.ts`; offline, never run against a live model |
| FR-094 | P1 | Deterministic root discovery + batch publication preserving manual decisions | COMPLETE — `root-discovery.ts`, `batch-eligibility.ts`, `scripts/batch-publish-roots.ts` |
| FR-095 | P1 | Searchable/filterable root listing and per-root detail | COMPLETE — `/explore/root`, `/explore/root/[root]` |
| FR-096 | P1 | Guarantee: no fabricated roots/lemmas, no automatic scholarly approval or topic creation | COMPLETE — enforced and regression-tested |

### 9.13 Learning extensions (new)

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-100 | P2 | Deterministic seeded quiz generator from dataset/topics/paths (no fabricated content) | COMPLETE — `src/lib/quiz/`, `/learn/quiz` |
| FR-101 | P1 | Curated learning paths with provenance and review status | COMPLETE — 5 paths (`src/lib/paths/data.ts`), `/learn/paths` |
| FR-102 | P2 | User-defined reading plans with position/goal tracking | COMPLETE — `src/lib/reading-plans/`, `/learn/plans` |
| FR-103 | P2 | Ayah-level backlinks from topics and learning paths | COMPLETE — ayah page shows topic + path membership |

### 9.14 Localization (new)

| FR | Priority | Requirement | Status |
|---|---|---|---|
| FR-110 | P1 | 4-locale UI (en default / ur / ar / zh) with correct RTL/LTR direction | COMPLETE — `src/lib/i18n/` |
| FR-111 | P1 | Content translations managed separately from UI locale | COMPLETE — via FR-004/FR-033 catalog |

---

## 10. Content, Data, and Provenance Model

**Core entities** (match `src/lib/quran/types.ts`, `src/lib/topics/data.ts`, `src/lib/quran/sources.ts`): Surah, Ayah, TranslationEdition, AyahTranslation, TafsirWork, TafsirEntry, Topic, AyahTopicRelation, CrossReference, AudioAsset, UserBookmark, UserNote, RevisionItem/ReviewEvent, SourceRecord.

**Typed relationship types** (match `RelationType` in `src/lib/topics/data.ts`): `TOPIC_ASSOCIATION`, `LEXICAL_MATCH`, `CROSS_REFERENCE`, `SEQUENTIAL_CONTEXT`. Root occurrence links are a separate, neutral dimension ("verses containing forms associated with this root"), not a thematic claim.

**Provenance record** (`ProvenanceRecord`): method, curator, reviewedAt, status. Every topic, dimension mapping, domain, and learning path carries one. All 11 topics are `pending-scholarly-review`.

**Data validation gates** (PRD §9 lineage): expected-record check, duplicate/missing/reorder/malformed detection, Arabic normalization without altering canonical text, sampled comparison against a trusted reference, translation edition + license verification, source URL/version/checksum/import-date storage, regression tests, review + rollback procedure. Gates 1–3 and 6–8 are structurally enforced; gate 4 (sampled human comparison) and gate 5 (license verification) have no recorded human sign-off.

**Policy B (disclosed coverage).** Per [`POLICY-DECISION-43.md`](POLICY-DECISION-43.md): missing lemmas (1,669 of 50,298 word-level records, 3.3%) are disclosed in UI and metadata but do not block publication when occurrence alignment is valid. Publication (automated) is separate from activation (human gate).

**Delivered vs Cleared** runs through all ingestion: see §6.4 and [`DATA-PROVENANCE.md`](DATA-PROVENANCE.md).

---

## 11. AI and Religious-Content Safety

The grounded-answer pipeline and permitted/restricted behaviors are defined in [`AI-SAFETY.md`](AI-SAFETY.md) and implemented as code paths in `src/lib/ai/`. **The public feature is off.**

**Seven safety gates** (from `src/lib/ai/feature-flag.ts`):

| Gate | Met | Evidence |
|---|---|---|
| source-registry | ✅ | `src/lib/quran/sources.ts` rendered on `/sources` |
| evaluation-dataset | ❌ | Cases exist in `evaluation-set.ts`; no run executed/signed off |
| citation-coverage | ❌ | Enforced in `grounding.ts`; coverage run not recorded |
| abstention-rate | ❌ | Threshold undefined/unmeasured |
| hallucination-zero | ❌ | Test artifact exists; no executed run |
| privacy-review | ❌ | Records store no user/prompt by construction; policy not reviewed |
| editorial-reviewer | ❌ | No qualified reviewer assigned |

`allGatesMet()` must be true before any answer is emitted. Flipping the flag would not expose an endpoint — none exists. **Enablement additionally requires** narrowing the retrieval allowlist (currently derived from `method === "package"`) to prose sources only, excluding bundled datasets (embeddings, word data, mushaf metadata).

---

## 12. UX and Visual Design

Design direction: premium, calm, modern, respectful, content-first — a reading/research tool, not a social feed or chatbot.

- Desktop: spacious reading column, contextual panels, clear nav. Mobile: single-column, compact controls.
- Arabic: RTL, dedicated font, tested line-height. Mixed Arabic/English/Urdu layouts per content language/direction.
- Legibility over animation; respect reduced-motion; keyboard/screen-reader accessible controls; non-color status indicators; empty/loading/offline/error/not-found states.

**Accessibility.** Sprints 20–25 performed keyboard, focus, touch-target, and browser-verified remediation (see `SPRINT-20`–`SPRINT-25-REPORT.md`). Implemented in code. **WCAG 2.2 AA conformance is UNVERIFIED** — no automated axe audit or formal certification is recorded.

---

## 13. Technical Architecture

**Actual stack.** Next.js 15.3.8 (App Router) · React 19 · TypeScript · Tailwind CSS · Radix/shadcn (`src/components/ui/`) · Lucide · React Hook Form + Zod · Sonner · Recharts · Vitest.

**Deliberate deviations from v3.0's recommended stack** (documented, compliant in spirit):

| v3.0 recommendation | Actual | Reason |
|---|---|---|
| PostgreSQL / relational DB | None — static data + localStorage | Local-first, no accounts |
| Authentication solution | None | No accounts by design |
| Server-side data access for public content | Server components + static JSON | Compliant |
| Dedicated search service | In-memory lexical index + client-side embeddings | Scale not reached |
| Runtime schema validation at import | Build-time validators | No runtime import path |
| Error tracking / observability | None | No analytics/telemetry by design |

**Rendering.** SSG/ISR for stable public pages (6,433 prerendered); client components for reader controls, search filters, quiz, graph. API routes for `/api/v1`, translation proxy, verse-of-day, dataset validation. Secrets stay server-side.

**Deployment.** See [`../DEPLOYMENT.md`](../DEPLOYMENT.md). `NEXT_PUBLIC_SITE_URL` must be a bare `https://` origin inlined at build time via `scripts/validate-build-env.mjs`. No committed hosting config exists. **Known hardening gap:** rate limiting is per-process only; durable enforcement belongs at CDN/edge.

---

## 14. Repository Structure (actual)

```
src/
  app/          routes + api/v1 + sitemap/robots + tests
  components/   ayah, graph, home, layout, learn, library, paths,
                quiz, quran, reading-plans, revision, search, seo,
                topics, ui
  hooks/
  lib/          ai, api, comprehension, editorial, explore, graph,
                i18n, library, morphology, paths, prefs, quiz, quran,
                reading-plans, revision, search, seo, taxonomy, topics
scripts/        import/validate/generate tooling
content/editorial/reviews.json
data/           morphology DBs, indexes, root-occurrences
docs/           PRD, provenance, AI-safety, editorial, policy, archive
public/         embeddings, word-data, admin
```

---

## 15. API Surface (implemented)

Self-documenting read-only index at `GET /api/v1` (`src/app/api/v1/route.ts`). **No authenticated endpoints exist because there are no accounts.**

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/surahs` | All 114 surahs metadata |
| GET | `/api/v1/surahs/{n}` | One surah + every ayah verbatim |
| GET | `/api/v1/ayahs/{s}/{a}` | One ayah + cross-refs + topic membership |
| GET | `/api/v1/ayahs/{s}/{a}/tafsir` | Tafsir availability (editions + link records) |
| GET | `/api/v1/search` | Normalized search, paginated, match-reason + snippet |
| GET | `/api/v1/search/tafsir` | Merged search over the two in-app Arabic tafsirs |
| GET | `/api/v1/search/suggestions` | Autocomplete |
| GET | `/api/v1/translations` | Catalog of readable editions |
| GET | `/api/v1/topics` | Curated topic index |
| GET | `/api/v1/topics/{slug}` | One topic with relations + provenance |
| GET | `/api/v1/topics/{slug}/ayahs` | Resolved verses for a topic |
| GET | `/api/v1/sources` | Source catalog (license/version/method) |
| GET | `/api/v1/explore/dimensions` (+ `/{id}`) | 10 dimensions + mapped topics |
| GET | `/api/v1/graph` | Typed dimension/topic nodes + edges |
| GET | `/api/v1/quiz/generate` | Deterministic quiz questions |

**Support routes.** `/api/translations/[id]` (constrained Tanzil proxy), `/api/verse-of-day`, `/api/validate-dataset`.

**Requirements.** Stable schemas, pagination, bounded queries, consistent errors, rate limits (per-process only — see §13), no sensitive personal data, Quran references validated against canonical records.

---

## 16. SEO and Public Discovery

**Implemented.** JSON-LD (`src/lib/seo/json-ld.ts`), `sitemap.ts`, `robots.ts`, canonical URLs, per-route noindex, URL-integrity tests. Surah, ayah, topic, root, dimension, and domain pages are indexable with meaningful unique metadata.

**Open.** Rendered Open Graph/Twitter output and live crawl/indexation are **UNVERIFIED** (metadata asserted in code, not checked against a production build). This is a release dependency (§19).

**Guardrails.** Index only useful canonical pages; noindex low-value/personal routes; do not mass-generate thin topic pages; each indexed page is editorially meaningful and source-backed.

---

## 17. Non-Functional Requirements

- **Performance.** Target good Core Web Vitals on representative mobile; minimize client JS on reading pages; avoid layout shifts on Arabic font load. **UNVERIFIED** — Lighthouse folders exist in the repo but no recorded pass criteria.
- **Reliability.** Reading survives optional-service (audio/AI) failure; dataset rollback documented; no DB to back up (none exists).
- **Localization.** UI in 4 locales; content translations via catalog. Each text field declares language and direction.
- **Privacy.** Local-only architecture = no server-side user data, no analytics, no telemetry. Export/delete via backup controls. Private notes never leave the browser.

---

## 18. Success Metrics and Analytics

**Analytics: not implemented, by design.** No event is emitted; no consent/retention policy is needed because no event data exists.

**Consequence.** v3.0 §17 engagement metrics (activation, retention, sessions) are intentionally unmeasurable in this build. This is a deliberate outcome of the privacy-first architecture, not an oversight.

**Measurable quality metrics** (the substitute): Quran reference validation pass rate (target 100% for published references), dataset import validation pass rate, published source records with complete provenance, and — once AI is enabled — incorrect/missing citation reports per 1,000 answers.

---

## 19. Testing, QA, and Release Blockers

**Automated.** 809 unit/integration tests (48 files); dataset validators (`validate:quran`, `validate:licenses`); `seo-smoke-test.mjs`; sitemap + URL-integrity + settings tests.

**Missing / not recorded.** End-to-end (Playwright/Cypress) suite, automated axe accessibility audit, rendered-SEO/social verification, manual QA checklist record, qualified topic review.

**Standing release blockers (require a human decision):**

1. Legal/licensing review of audio recordings (CDN publishes no explicit recording licence).
2. Legal/licensing review of the Tanzil translation catalog as proxied via `/api/translations/[id]`.
3. Legal/licensing review of the two in-app tafsir texts.
4. Assignment of a qualified reviewer for topic mappings and (future) AI outputs.
5. Configuration of a report delivery destination (`NEXT_PUBLIC_REPORT_EMAIL` or issue tracker).
6. Accessibility audit (WCAG 2.2 AA).
7. Core Web Vitals measurement.
8. Rendered SEO/social metadata verification after a production build.
9. Deployment hardening: durable rate limiting at CDN/edge.

**Release blockers that are a hard stop if they ever occur:** any known Quran text corruption or incorrect reference; missing provenance for published translations/tafsir; cross-user access to private content; exposed API secrets; public AI answers with unvalidated citations; broken canonical URLs or unusable Arabic reading layout.

---

## 20. Editorial Governance

**Roles.** Product owner, data maintainer, content editor, qualified reviewer/advisor, developer/administrator. One person may hold several initially, but responsibilities stay explicit.

**Current state.** Roles are defined; **the qualified reviewer role is unfilled** — this blocks FR-072 approval and the `editorial-reviewer` AI gate. The seven-step workflow is documented in [`EDITORIAL.md`](EDITORIAL.md). Tooling exists: `content/editorial/reviews.json` (23 entries), `/editorial` page, `scripts/build-editorial-log.mjs`. Correction intake (`/report`) exists without a configured destination. Rollback is documented.

---

## 21. Roadmap

| Phase | Scope | Status |
|---|---|---|
| 0 — Foundation | Source/license audit, canonical refs, validator, provenance registry, CI | **Incomplete** — licensing review outstanding |
| 1 — Reading MVP | Reader, ayah pages, translation, search, bookmarks, SEO, a11y/privacy baseline | Functionally complete; a11y QA + CWV unverified |
| 2 — Connected discovery | Topics, reviewed relations, cross-refs, source panels, editorial tooling | Functionally complete; qualified review outstanding |
| 3 — Personal learning | Notes, reading plans, spaced-repetition, progress | Complete (local-only) |
| 4 — Grounded AI + graph | Retrieval-grounded assistant, citations, abstention, graph viz | Harness only; disabled; 6/7 gates unmet |
| 5 — Mobile | Hosted shell vs API-backed client; offline; audio rights | Not started (deferred pending web stability) |

**Next actions** = the nine human-decision release blockers in §19, in that order.

---

## 22. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect Arabic text or numbering | Critical trust failure | Canonical pinned source, validators, sampled human review, rollback |
| Translation/tafsir/audio licensing uncertainty | Legal + distribution risk | License audit before publication; Delivered≠Cleared; attribution + takedown path |
| AI hallucination / false attribution | Religious misinformation | Retrieval grounding, reference validation, citations, abstention, gates, human review; feature off |
| Topic links oversimplify interpretation | Misleading discovery | Typed relationships, rationale, review status, context-first UI, `pending-scholarly-review` labels |
| SEO creates thin/duplicate pages | Search quality + cost | Index only useful canonical pages; noindex low-value routes |
| Overbuilt architecture | Slow delivery | Local-first; add graph/search/DB services only when justified |
| User notes leak | Privacy failure | No server data by construction; local-only; export/delete |
| Audio provider/rights lapse | Playback/legal risk | Stream only, no redistribution; monitor URLs |
| Notifications become guilt-driven | Trust/retention | Optional reminders, neutral language, no shame streaks |
| Root publication ships a wrong grouping | Scholarly credibility | Policy B disclosure, human activation gate, no automatic approval, regression tests |

---

## 23. Resolved Decisions

All ten v3.0 open decisions and their actual outcomes:

| Decision | Resolution |
|---|---|
| Initial language | English UI; Arabic text; Urdu (Jalandhry) default translation |
| Translation source | 116 Tanzil editions via runtime proxy; per-edition rights unverified |
| Tafsir scope | Two Arabic tafsirs in-app via proxy; two English tafsirs link-out; rights review outstanding |
| Authentication | Anonymous-only (no accounts) |
| Database | None (static data + localStorage) |
| Search | In-memory lexical + client-side embeddings |
| Editorial review | Roles defined; reviewer unassigned |
| Audio | Streamed from Islamic Network CDN; rights unresolved |
| Mobile | Deferred |
| AI launch gate | Not met (6/7 gates); feature flag `false as const` |

**Still open** (not decisions but dependencies): the licensing reviews, reviewer assignment, and report destination listed in §19.

---

## 24. Definition of Done

A feature is done only when:

- Requirements and edge cases are implemented.
- Loading, empty, error, and unavailable-source states are handled.
- Arabic RTL and responsive layouts are tested where applicable.
- Accessibility checks are completed for the relevant flow.
- Data provenance and licensing are recorded for content features.
- Automated tests pass.
- Security/privacy checks pass for user data.
- Analytics events, if any, follow the privacy policy.
- Documentation is updated.
- Product owner accepts the behavior against the acceptance criteria.

For any feature touching Quran text, numbering, translation, tafsir, or religious claims, **content integrity and provenance are release gates — not optional polish.**

---

## Appendix A — Deferred Long-Term Vision (NON-NORMATIVE)

> **DEFERRED — NOT PART OF THE ACTIVE SPEC.** The items below originate from the v2.0 "COMPLETE" PRD. They are preserved here so the long-term ambition is not lost, but they are NOT committed scope. Re-activation requires explicit re-scoping plus the preconditions listed for each. The full original text remains in [`archive/AL-HUDA-PRD-v2.0-COMPLETE.md`](archive/AL-HUDA-PRD-v2.0-COMPLETE.md).

| Item | What it is | Why deferred | Re-activation criteria |
|---|---|---|---|
| **NOOR kids mode** | Story-driven Arabic/Quran learning for ages 3–12 with "Ammi"/"Dadi Jan" narration and AI-personalized stories | High child-safety, COPPA/GDPR-K, app-store kids-category, and misquotation risk | Only after a dedicated child-safety, privacy, and scholarly-safety review; not before Phases 1–3 blockers clear |
| **Seeker mode for non-Muslims** (v2.0 "Kashf") | Pressure-free discovery path with misconceptions Q&A and comparative context | Renamed to avoid collision with the shipped `/explore` area; scope overlaps current reader | Re-scope as an Explore refinement after core discovery is stable |
| **Flutter Android/iOS clients** | Native mobile apps | Web-first; offline + audio rights unresolved | After Phase 5 architecture decision and stable web core |
| **NestJS backend** | Dedicated domain service | No current workload justifies the operational cost | Only when integrations/scale demand it |
| **Monetization & scholar partnerships** | Subscriptions, scholar advisory program | Premature before trust + traffic | After public launch and validated retention |
| **Hadith corpus** | 9–12 books, ~50,884 hadiths with grading | Large licensing + grading burden; Quran layer must be flawless first | After Quran integrity + licensing audit pass and a hadith rights review |
| **AI story generator / guidance chat** | Personalized story + life-guidance generation | Requires the full AI safety gate set, currently 6/7 unmet | Only when all seven gates are met and the allowlist is narrowed |
| **Ayah-level 10-dimension tagging** | Tag all 6,236 ayat across 10 dimensions | A major scholarly undertaking the build deliberately does not attempt | Requires a qualified reviewer program; dimensions remain a topic-level aid meanwhile |
| **NotebookLM content pipeline** | Scholar-PDF → simplified content pipeline | Depends on scholar review capacity | After a reviewer is assigned and the pipeline is validated |

---

## Appendix B — FR ↔ Implementation Evidence Map

Entry points for the next engineer, grouped by FR block.

| FR block | Primary implementation |
|---|---|
| FR-001–009 Reader / word-by-word | `src/lib/quran/data.ts`, `reference.ts`, `words.ts`, `mushaf-data.ts`, `public/word-data/`, `src/app/quran/`, `src/app/ayah/` |
| FR-010–015 Search | `src/lib/quran/search.ts`, `semantic-search.ts`, `translation-search.ts`, `src/lib/search/`, `src/app/search/page.tsx` |
| FR-020–025 Topics / graph | `src/lib/topics/data.ts`, `src/lib/graph/knowledge-graph.ts`, `src/app/topics/`, `src/app/explore/graph/` |
| FR-030–035 Tafsir / sources | `src/lib/quran/sources.ts`, `tafsir-search.ts`, `translations.ts`, `src/app/sources/` |
| FR-040–044 Library | `src/lib/library/context.tsx`, `src/lib/comprehension/notes.ts`, `src/lib/backup.ts`, `src/app/library/` |
| FR-050–054 Revision | `src/lib/revision/`, `src/app/learn/revision/` |
| FR-060–066 AI | `src/lib/ai/` (`feature-flag.ts`, `grounding.ts`, `audit.ts`, `evaluation-set.ts`) |
| FR-070–075 Editorial | `src/lib/editorial/reviews.ts`, `content/editorial/reviews.json`, `scripts/validate-*.mjs`, `src/app/editorial/` |
| FR-076–079 Reference display | `src/app/ayah/[surah]/[ayah]/page.tsx`, `src/lib/quran/juz.ts`, `src/components/quran/source-panel.tsx` |
| FR-080–086 Discovery / taxonomy | `src/lib/explore/dimensions.ts`, `src/lib/taxonomy/`, `src/app/discover/`, `src/lib/quran/verse-of-day.ts` |
| FR-090–096 Morphology / roots | `src/lib/morphology/`, `scripts/import-morphology.py`, `discover-roots.ts`, `batch-publish-roots.ts`, `src/app/explore/root/` |
| FR-100–103 Learning extensions | `src/lib/quiz/`, `src/lib/paths/`, `src/lib/reading-plans/`, `src/app/learn/` |
| FR-110–111 Localization | `src/lib/i18n/` |

---

*End of PRD v4.0. This document is the single source of truth. Update it whenever shipped state, status, or scope changes; archive superseded versions under `docs/archive/`.*
