# Sprint 0 Reality Audit — Al-Huda

**Date:** 2026-10-23
**Scope:** Read-only audit of the current repository against `AL-HUDA-PRD-v2.0-COMPLETE.md` (the PRD file committed to the repo root). No code was modified, no verification commands were run, no new files were created beyond this report.
**Method:** Filesystem inspection, source reading, and cross-referencing PRD sections against actual routes, modules, and content. Every claim below is backed by a file path or a line in a named document.

> **Note on PRD versions.** The repo contains two PRD documents: `AL-HUDA-PRD-v2.0-COMPLETE.md` (untracked, in the repo root) and `docs/PRD.md` (v3.0, tracked). The companion `docs/PRD-CHECKLIST.md` and `docs/IMPLEMENTATION-REPORT.md` were reconciled against v3.0 on 2026-10-23. This audit is against v2.0 as requested; where v2.0 and v3.0 diverge, the divergence is noted.

---

## A. Executive Summary

The repository is a **Next.js 15.3.8 local-first Quran reader** with a substantial, well-structured codebase that implements a significant subset of the PRD's reading, search, topic, revision, and editorial features. The AI answer feature is **deliberately and correctly disabled** (`AI_ANSWER_FEATURE_ENABLED = false as const`), with a full safety harness in place but no live endpoint. The app has **no accounts, no analytics, no server-side user data**, and no database — this is an architectural choice, not an omission.

**What is real and working:**
- 114 surahs, 6,236 ayat loaded verbatim from `quran-json@3.1.2` (CC-BY-4.0)
- 30+ page routes covering reading, search, topics, library, revision, settings, editorial, sources, legal pages
- 16 API routes under `/api/v1/` plus utility routes
- 11 curated topics with typed, provenance-stamped relations (all `pending-scholarly-review`)
- Lexical search with ranked relevance, snippet highlighting, and curated topic-term expansion
- Opt-in client-side semantic search (MiniLM embeddings, English-only)
- Revision workflow with localStorage persistence
- Backup/restore envelope (v6 in code, v4 in docs — discrepancy noted below)
- Comprehensive JSON-LD structured data
- 188 unit tests reported passing; typecheck and build reported clean

**What is not ready for release:**
- Audio recording rights are unresolved (streaming works, permission is not established)
- Translation catalog rights are unresolved (100+ editions proxied, per-edition terms unverified)
- In-app tafsir rights are unresolved (two Arabic tafsirs proxied)
- No qualified reviewer is assigned; every topic remains `pending-scholarly-review`
- AI feature is correctly off, but no live evaluation has been run
- No accessibility audit, no Core Web Vitals measurement, no rendered SEO verification
- No mobile/Flutter implementation (PRD §18 roadmap Month 1-2 claims "Flutter — basic Android reading" as ✅, but no Flutter code exists in this repo)

**Bottom line:** The codebase is a credible, privacy-first reading MVP with substantial discovery and editorial infrastructure. It is not a production release. The remaining blockers are almost entirely **human decisions** (licensing review, reviewer assignment, accessibility audit) rather than missing code.

---

## B. Feature Matrix

Cross-reference of PRD v2.0 features against repository evidence. Status codes: **✅ Implemented**, **⚠️ Partial**, **❌ Not implemented**, **🚫 Blocked by design**, **🔒 Disabled (safety)**.

| PRD Feature | Status | Evidence |
|---|---|---|
| Quran text display (Arabic + translation) | ✅ | `src/lib/quran/data.ts` loads `quran-json@3.1.2` verbatim; `src/app/quran/[slug]/page.tsx` and `src/app/ayah/[surah]/[ayah]/page.tsx` render it |
| Surah index and navigation | ✅ | `src/app/quran/page.tsx`, prev/next links on every surah page |
| Ayah reference pages | ✅ | `src/app/ayah/[surah]/[ayah]/page.tsx` with Juz, page, hizb, ruku, manzil, sajda badges |
| Search (reference, Arabic, translation, transliteration) | ✅ | `src/lib/quran/search.ts` with ranked lexical relevance; `src/app/search/page.tsx` |
| Search filters (surah, juz, topic, revelation type) | ✅ | `src/components/search/search-filters.tsx` |
| Search within specific translation edition | ⚠️ | `/search?edition=<id>` mode; per-edition rights unverified |
| Search within classical tafsirs | ✅ | `/search?mode=tafsir` across al-Jalalayn and al-Muyassar |
| Semantic search (embedding-based) | ⚠️ | `src/lib/quran/semantic-search.ts`; opt-in, English-only, client-side |
| Curated topics with provenance | ✅ | `src/lib/topics/data.ts`; 11 topics, all `pending-scholarly-review` |
| Topic relationship graph | ✅ | `src/components/topics/topic-graph.tsx` (SVG, keyboard-focusable) |
| Cross-references (ayah-to-ayah) | ✅ | `src/lib/quran/cross-references.ts`; dataset-derived |
| Word-by-word analysis | ✅ | `public/word-data/*.json` (QUL, MIT); 114 surah files, 77,429 words |
| Mushaf metadata (Juz, page, hizb, ruku, manzil, sajda) | ✅ | `src/lib/quran/mushaf-data.ts`; build-time verified from Tanzil CC-BY |
| Audio recitation (streaming) | ⚠️ | `src/lib/quran/audio.ts`; 12 reciters from Islamic Network CDN; **rights unresolved** |
| Additional translations (100+) | ⚠️ | `src/lib/quran/translations.ts`; runtime proxy via `/api/translations/[id]`; **per-edition rights unverified** |
| Parallel translation mode | ✅ | `parallelTranslationIds` in prefs; up to 3 additional editions |
| Tafsir viewer (in-app) | ⚠️ | `src/components/quran/tafsir-viewer.tsx`; two Arabic tafsirs via proxy; **rights unresolved** |
| Tafsir link-out (English) | ✅ | Ibn Kathir and Ma'arif link-out only |
| User library (bookmarks, notes) | ✅ | `src/app/library/page.tsx`; localStorage; no accounts |
| Cross-device sync | 🚫 | No accounts by design; FR-042 blocked intentionally |
| Backup and restore | ✅ | `src/lib/backup.ts`; envelope v6 in code (v4 in docs — discrepancy) |
| Revision workflow (memorization) | ✅ | `src/app/learn/revision/page.tsx`; three review ladders, localStorage |
| Quiz generation | ✅ | `src/app/learn/quiz/page.tsx`; `src/lib/quiz/generator.ts` |
| Learning paths | ✅ | `src/app/learn/paths/page.tsx`; `src/lib/paths/data.ts` |
| Reading plans | ✅ | `src/app/learn/plans/page.tsx`; `src/lib/reading-plans/storage.ts` |
| AI answer feature | 🔒 | `src/lib/ai/grounding.ts`; flag off; no `/api/ai/ask` endpoint |
| AI safety gates | 🔒 | `src/lib/ai/feature-flag.ts`; 7 gates, only `source-registry` met |
| Editorial review log | ✅ | `content/editorial/reviews.json`; `src/lib/editorial/reviews.ts` |
| Decap CMS admin | ⚠️ | `public/admin/`; scaffolded, local backend only, no hosted identity |
| Correction intake (/report) | ⚠️ | `src/app/report/page.tsx`; copy/clipboard/download work; **no delivery destination configured** |
| Sources page | ✅ | `src/app/sources/page.tsx`; rights register displayed |
| Editorial page | ✅ | `src/app/editorial/page.tsx`; dataset validation, topic status, AI gates |
| JSON-LD structured data | ✅ | `src/lib/seo/json-ld.ts`; WebSite, Book, Chapter, WebPage, DataCatalog, BreadcrumbList |
| Sitemap and robots | ✅ | `src/app/robots.ts`; per-route noindex on private pages |
| RTL and Arabic typography | ✅ | `arabic-display` class; `dir="rtl"` on Arabic text |
| Accessibility (skip link, landmarks, ARIA) | ✅ (code) | Skip-to-content link, landmarks, ARIA labels; **no automated audit recorded** |
| Privacy / terms / accessibility pages | ✅ | `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/accessibility/page.tsx` |
| Onboarding | ✅ | `src/app/onboarding/page.tsx` |
| Settings (translation, audio, parallel) | ✅ | `src/app/settings/page.tsx` |
| Prayer times | ❌ | No route, no module |
| Journal / personal notes (beyond library notes) | ❌ | No dedicated journal feature; library notes exist |
| Kids / Noor stories | ❌ | No route, no content |
| Explore mode (non-Muslim audience) | ❌ | No route |
| Guidance mode (RAG) | ❌ | AI feature off; no RAG implementation |
| Hifz engine (dedicated) | ⚠️ | Revision workflow exists; no dedicated "Hifz engine" as described in PRD §18 |
| Taraweeh mode | ❌ | No route |
| Family accounts | ❌ | No accounts by design |
| Payment integration (JazzCash, EasyPaisa) | ❌ | No payment code |
| Pro tier / subscription | ❌ | No payment code |
| Mobile app (Flutter) | ❌ | No Flutter code in this repo; PRD §18 claims it as ✅ but it does not exist here |
| Knowledge graph (visual explorer) | ❌ | Topic graph exists; not the "10 dimensions" knowledge graph from PRD §18 |
| Scholar advisory program | ❌ | No scholar assigned; editorial reviewer role unfilled |
| Analytics / metrics | 🚫 | No analytics by design; PRD §20 metrics unmeasurable |

---

## C. Route Gap Map

### Routes that exist

**Pages (30):**
- `/` — home
- `/quran` — surah index
- `/quran/[slug]` — surah reader
- `/ayah/[surah]/[ayah]` — ayah reference page
- `/search` — search (lexical, edition, tafsir, semantic)
- `/topics` — topic index
- `/topics/[slug]` — topic detail
- `/sources` — source registry
- `/editorial` — editorial dashboard (noindex)
- `/report` — correction intake (noindex)
- `/library` — user library (noindex)
- `/library/notes` — personal notes (noindex)
- `/learn` — learning dashboard (noindex)
- `/learn/revision` — revision workflow (noindex)
- `/learn/quiz` — quiz (noindex)
- `/learn/paths` — learning paths index (noindex)
- `/learn/paths/[slug]` — path detail (noindex)
- `/learn/plans` — reading plans (noindex)
- `/settings` — settings (noindex)
- `/settings/privacy` — privacy settings (noindex)
- `/onboarding` — onboarding
- `/about` — about
- `/privacy` — privacy policy
- `/terms` — terms of use
- `/accessibility` — accessibility statement

**API routes (16):**
- `/api/v1/` — API root
- `/api/v1/surahs` — surah list
- `/api/v1/surahs/[surahNumber]` — single surah
- `/api/v1/ayahs/[surahNumber]/[ayahNumber]` — single ayah
- `/api/v1/ayahs/[surahNumber]/[ayahNumber]/tafsir` — tafsir availability
- `/api/v1/search` — search
- `/api/v1/search/tafsir` — tafsir search
- `/api/v1/topics` — topic list
- `/api/v1/topics/[slug]` — single topic
- `/api/v1/topics/[slug]/ayahs` — topic ayat
- `/api/v1/sources` — source registry
- `/api/v1/translations` — translation list
- `/api/v1/quiz/generate` — quiz generation
- `/api/translations/[id]` — translation proxy (Tanzil)
- `/api/verse-of-day` — verse of the day
- `/api/validate-dataset` — dataset validation

### Routes that do NOT exist (PRD gaps)

| Missing Route | PRD Reference | Notes |
|---|---|---|
| `/prayer-times` | PRD §18 Month 7-8 | No prayer times feature |
| `/hifz` | PRD §18 Month 7-8 | Revision workflow exists at `/learn/revision`; no dedicated Hifz engine |
| `/journal` | PRD §18 Month 3-4 | No journal feature; library notes exist |
| `/kids` or `/noor` | PRD §18 Month 5-6, 7-8 | No kids content or Noor stories |
| `/explore` | PRD §18 Month 7-8 | No Explore mode for non-Muslim audience |
| `/guidance` | PRD §18 Month 5-6 | AI feature off; no RAG guidance mode |
| `/taraweeh` | PRD §18 Month 7-8 | No Taraweeh mode |
| `/family` | PRD §18 Month 7-8 | No family accounts; no accounts at all |
| `/api/ai/ask` | PRD §10, §14 | AI feature off; no endpoint (correct) |
| `/api/v1/users/*` | PRD §14 | No accounts; authenticated endpoints do not exist |
| `/api/v1/library/sync` | PRD §14 | No sync; local-only by design |
| `/api/v1/payments/*` | PRD §18 Month 5-6 | No payment integration |

### Discrepancy: PRD §18 roadmap claims

PRD §18 (12-Month Roadmap) marks many items as ✅ that do not exist in this repository:
- "Flutter — basic Android reading" (Month 1-2) — **no Flutter code**
- "NOOR mode — 5 stories (Android)" (Month 5-6) — **no Noor content**
- "Guidance mode (RAG — basic)" (Month 5-6) — **AI feature off**
- "Knowledge graph — 3 dimensions" (Month 5-6) — **topic graph exists, not a multi-dimensional knowledge graph**
- "Payment integration (JazzCash + EasyPaisa)" (Month 5-6) — **no payment code**
- "Pro tier launch" (Month 5-6) — **no subscription code**
- "EXPLORE mode launch" (Month 7-8) — **no Explore route**
- "Hifz engine" (Month 7-8) — **revision workflow exists, not a dedicated engine**
- "Taraweeh mode" (Month 7-8) — **no Taraweeh route**
- "Family accounts" (Month 7-8) — **no accounts**
- "10 more Noor stories" (Month 7-8) — **no Noor content**
- "iOS beta" (Month 9-10) — **no iOS code**
- "Scholar Community Program launch" (Month 9-10) — **no scholar assigned**

**Conclusion:** The PRD §18 roadmap is aspirational, not a record of what is built. The actual repository implements Phase 0 (partial) and Phase 1 (reading MVP) of the PRD, with substantial Phase 2 (discovery) and Phase 3 (personal learning) infrastructure. Phases 4 (AI), 5 (mobile), and the monetization/scale features are not implemented.

---

## D. Sprint Breakdown

Recommended sprint structure based on current state and remaining blockers. This is a **recommendation**, not a commitment.

### Sprint 1: Licensing and Rights Resolution (1-2 weeks)

**Goal:** Close the three licensing blockers that prevent any release claim.

1. **Audio recording rights** — Legal review of the Islamic Network CDN recording set. The CDN publishes no explicit copyright licence. Options: (a) obtain written permission, (b) switch to a licenced recording set, (c) disable audio until rights are clear.
2. **Translation catalog rights** — Legal review of Tanzil terms and each of the 100+ editions proxied via `/api/translations/[id]`. A clean `validate:licenses` run is not permission to redistribute or proxy.
3. **In-app tafsir rights** — Legal review of the two Arabic tafsirs (al-Jalalayn, al-Muyassar) proxied through the same endpoint.

**Deliverable:** A rights register with explicit permission statements for audio, translations, and tafsir, or a decision to disable those features.

### Sprint 2: Editorial Governance (1 week)

**Goal:** Assign a qualified reviewer and close the editorial gap.

1. **Assign a qualified reviewer** — The PRD requires a named, qualified scholar to review topic mappings and AI outputs. No reviewer is assigned; every topic remains `pending-scholarly-review`.
2. **Review the 11 curated topics** — A qualified reviewer must examine each topic's relations, rationales, and provenance, and either approve them or request changes.
3. **Configure the report delivery destination** — Set `NEXT_PUBLIC_REPORT_EMAIL` or configure an issue tracker so `/report` corrections actually reach someone.

**Deliverable:** At least one topic marked `editorial-approved`; a configured report destination.

### Sprint 3: Accessibility and Performance Audit (1 week)

**Goal:** Measure and record accessibility conformance and Core Web Vitals.

1. **Automated accessibility audit** — Run axe or Lighthouse on every route. Record results. Fix violations.
2. **Manual keyboard navigation test** — Verify skip link, landmarks, focus order, ARIA labels on every page.
3. **Core Web Vitals measurement** — Run Lighthouse on a production build. Record LCP, FID, CLS. Fix regressions.
4. **Rendered SEO verification** — Inspect Open Graph and Twitter tags on a production build. Verify canonical URLs, noindex on private pages, JSON-LD correctness.

**Deliverable:** A recorded accessibility audit, Core Web Vitals report, and rendered SEO inspection.

### Sprint 4: AI Safety Evaluation (1 week, conditional)

**Goal:** If the decision is made to enable the AI feature, run the evaluation suite.

1. **Narrow the AI allowlist** — The current allowlist derives from `method === "package"`, which admits word-data and mushaf-metadata records alongside prose sources. Narrow it to prose sources only.
2. **Run the evaluation suite** — Execute `src/lib/ai/evaluation-set.test.ts` against a live model. Record abstention rate, citation coverage, hallucination rate.
3. **Privacy review** — Review the audit logging policy. Confirm minimal retention. Mark the `privacy-review` gate as met.
4. **Flip the feature flag** — Only if all seven gates in `src/lib/ai/feature-flag.ts` are `met: true`.

**Deliverable:** A signed-off evaluation report, or a decision to keep the AI feature off.

### Sprint 5: Production Hardening (1 week)

**Goal:** Prepare for deployment.

1. **Edge/CDN rate limiting** — The current rate limiting is per-process only. Add edge/CDN rate limiting.
2. **Deployment smoke test** — Deploy to a staging environment. Run a manual smoke test (search, read, revise, export/import backup, verify AI routes 404).
3. **Backup envelope version reconciliation** — The code says v6, the docs say v4. Reconcile.
4. **Byte-level checksum baseline** — FR-071's immutability claim rests on the version string plus the structural scan. Add a checksum baseline.

**Deliverable:** A production-ready deployment with rate limiting, smoke test results, and a checksum baseline.

### Sprint 6+: Roadmap Features (ongoing)

After the above sprints, the app is a production-ready reading MVP. Further sprints can address the PRD §18 roadmap features (prayer times, journal, kids content, Explore mode, etc.) based on priority and user feedback.

---

## E. Data and Content Readiness

### Quran text

- **Source:** `quran-json@3.1.2` (CC-BY-4.0)
- **Content:** 114 surahs, 6,236 ayat, Uthmani Arabic, Saheeh International translation, transliteration
- **Delivery:** Filesystem-backed loader (`src/lib/quran/data.ts`), server-only, cached in memory
- **Validation:** `scripts/validate-quran-data.mjs` checks schema, duplicates, ordering, counts. Reported: 114/6,236/0.
- **Provenance:** `src/lib/quran/sources.ts` records version, licence, publisher, delivery method
- **Status:** ✅ Ready. Licence is CC-BY-4.0, which permits redistribution with attribution. Attribution is displayed on every ayah card and in the site footer.

### Mushaf metadata (Juz, page, hizb, ruku, manzil, sajda)

- **Source:** Tanzil `quran-data.xml` (CC-BY)
- **Delivery:** Build-time generator (`scripts/generate-mushaf-data.js`) → `src/lib/quran/mushaf-data.ts`
- **Validation:** Generator verifies 30 juz, 604 pages, 240 quarters, 556 rukus, 7 manzils, 15 sajda verses, 6,236 ayat before writing
- **Status:** ✅ Ready. CC-BY licence permits use with attribution. Attribution is on `/sources`.

### Word-by-word data

- **Source:** QUL (Quranic Universal Library by TarteelAI, MIT)
- **Delivery:** Build-time generator (`scripts/generate-word-data.js`) → `public/word-data/*.json` (114 files, 77,429 words, 3.40 MB)
- **Validation:** Manifest with sha256 checksums
- **Status:** ✅ Ready. MIT licence permits use. Attribution is on `/sources`.

### Semantic search embeddings

- **Source:** Built from the built-in English translation using `Xenova/all-MiniLM-L6-v2` (Apache-2.0)
- **Delivery:** Build-time generator (`scripts/generate-embeddings.mjs`) → `public/embeddings/quran-minilm.bin` (4.57 MB, 6,236 × 384, float16)
- **Validation:** Manifest with sha256 checksum
- **Status:** ✅ Ready. Apache-2.0 licence permits use. English-only.

### Curated topics

- **Source:** Editorial selection (`src/lib/topics/data.ts`)
- **Content:** 11 topics, 56 relations total, all with typed relation kinds (TOPIC_ASSOCIATION, LEXICAL_MATCH, CROSS_REFERENCE, SEQUENTIAL_CONTEXT), rationales, and provenance records
- **Review status:** All `pending-scholarly-review`
- **Status:** ⚠️ Code-complete, but **no qualified reviewer has examined them**. Cannot be marked approved until a reviewer signs off.

### Translations (100+ editions)

- **Source:** Tanzil catalog (`src/lib/quran/translations.ts`)
- **Delivery:** Runtime proxy via `/api/translations/[id]` → `https://tanzil.net/trans/{id}`
- **Caching:** 24-hour in-memory cache
- **Status:** ⚠️ **Per-edition rights are unverified.** A clean `validate:licenses` run checks the fields the validator requires; it does not grant permission to redistribute or proxy. Legal review needed.

### Audio recordings

- **Source:** Islamic Network CDN (`https://cdn.islamic.network/quran/audio/{bitrate}/{edition}/{globalAyah}.mp3`)
- **Delivery:** Streaming (no files stored or redistributed)
- **Reciters:** 12 (Alafasy, Husary, Minshawi, Sudais, Shuraim, Abdul Basit, Hudhaify, Maher Al Muaiqly, Muhammad Ayyoub, Muhammad Jibreel, Abdullah Basfar, Ayman Sowaid)
- **Status:** ⚠️ **Recording rights are unresolved.** The CDN publishes no explicit copyright licence for the recordings. Streaming avoids redistribution, but it does not establish permission.

### Tafsir texts

- **Source:** Tanzil proxy (al-Jalalayn, al-Muyassar)
- **Delivery:** Runtime proxy via `/api/translations/[id]`
- **Status:** ⚠️ **Rights are unresolved.** Same issue as translations. Legal review needed.
- **English tafsirs:** Ibn Kathir and Ma'arif are link-out only (no in-app text).

### Editorial review log

- **Source:** `content/editorial/reviews.json`
- **Delivery:** Generated by `scripts/build-editorial-log.mjs`, imported by `src/lib/editorial/reviews.ts`
- **Content:** Review entries for topics, sources, and features
- **Status:** ✅ Code-complete. The log is a state record, not a per-event history. Git is the audit trail.

---

## F. Risk Register

| Risk | Probability | Impact | Mitigation | Status |
|---|---|---|---|---|
| **Audio recording rights violation** | Medium | High | Legal review of CDN terms; disable audio if rights unclear | ⚠️ Unresolved |
| **Translation catalog rights violation** | Medium | High | Legal review of Tanzil terms and each edition; disable proxy if rights unclear | ⚠️ Unresolved |
| **Tafsir text rights violation** | Medium | High | Legal review; disable in-app tafsir if rights unclear | ⚠️ Unresolved |
| **AI generates wrong Islamic content** | Low (feature off) | Catastrophic | Feature flag off; safety harness in place; no live endpoint | ✅ Mitigated |
| **Unreviewed topics misrepresent Quran** | Medium | High | Assign qualified reviewer; review all 11 topics before release | ⚠️ Unresolved |
| **Accessibility non-compliance** | Medium | Medium | Run automated and manual accessibility audits; fix violations | ⚠️ Unmeasured |
| **Poor Core Web Vitals** | Low | Medium | Measure Lighthouse on production build; optimize | ⚠️ Unmeasured |
| **SEO metadata incorrect** | Low | Medium | Inspect rendered OG/Twitter tags on production build | ⚠️ Unverified |
| **Rate limiting insufficient** | Medium | Medium | Add edge/CDN rate limiting | ⚠️ Per-process only |
| **Backup envelope version mismatch** | Low | Low | Reconcile code (v6) with docs (v4) | ⚠️ Discrepancy |
| **No byte-level checksum baseline** | Low | Medium | Add checksum baseline for dataset immutability | ⚠️ Unresolved |
| **Scope creep** | High | Medium | Phase gates; focus on licensing and accessibility first | ⚠️ Ongoing |
| **No qualified reviewer assigned** | High | High | Assign a scholar; cannot approve topics or AI outputs without one | ⚠️ Unresolved |
| **Report corrections go nowhere** | Medium | Medium | Configure `NEXT_PUBLIC_REPORT_EMAIL` or issue tracker | ⚠️ Unconfigured |
| **Flutter/mobile not built** | High | Medium | PRD §18 claims it as ✅ but it does not exist; clarify roadmap | ⚠️ Misleading |

---

## G. Final Decision List

The following decisions require **human judgment** and cannot be resolved by code alone. They are ordered by priority.

### 1. Audio rights: keep streaming, switch source, or disable?

**Context:** The Islamic Network CDN serves 12 reciters but publishes no explicit copyright licence for the recordings. Streaming avoids redistribution, but it does not establish permission.

**Options:**
- (a) Obtain written permission from the CDN or the recording rights holders
- (b) Switch to a licenced recording set (e.g., purchase a licence from a reciter or publisher)
- (c) Disable audio until rights are clear

**Recommendation:** (c) Disable audio until rights are clear. The risk of a rights violation outweighs the benefit of streaming. Document the decision in `docs/DATA-PROVENANCE.md`.

### 2. Translation catalog: proxy, vendor, or disable?

**Context:** 100+ translations are proxied from Tanzil at runtime. Per-edition rights are unverified. A clean `validate:licenses` run is not permission to redistribute or proxy.

**Options:**
- (a) Legal review of Tanzil terms and each edition used; continue proxying if rights are clear
- (b) Vendor a smaller set of licenced translations (e.g., 5-10 editions with explicit permission)
- (c) Disable the translation proxy until rights are clear; ship only the built-in Saheeh International translation (CC-BY-4.0, already licensed)

**Recommendation:** (c) Disable the translation proxy until rights are clear. The built-in translation is sufficient for an MVP. Document the decision in `docs/DATA-PROVENANCE.md`.

### 3. Tafsir text: keep proxying, link-out only, or disable?

**Context:** Two Arabic tafsirs (al-Jalalayn, al-Muyassar) are proxied from Tanzil. Rights are unresolved.

**Options:**
- (a) Legal review; continue proxying if rights are clear
- (b) Switch to link-out only (like the English tafsirs)
- (c) Disable in-app tafsir until rights are clear

**Recommendation:** (b) Switch to link-out only. This avoids the redistribution risk while still providing access to the texts. Update `src/components/quran/tafsir-viewer.tsx` to show links instead of in-app text.

### 4. Assign a qualified reviewer

**Context:** No qualified reviewer is assigned. Every topic remains `pending-scholarly-review`. The AI gate `editorial-reviewer` is unmet.

**Options:**
- (a) Assign a named scholar to review the 11 topics and (if AI is enabled) AI outputs
- (b) Delay topic approval until a reviewer is available
- (c) Ship with all topics marked `pending-scholarly-review` and a clear notice that they are not authoritative

**Recommendation:** (a) Assign a named scholar. This is a PRD requirement and a trust issue. Without a reviewer, the app cannot claim scholarly approval.

### 5. Configure the report delivery destination

**Context:** `/report` allows users to submit corrections, but no delivery destination is configured. Corrections are copied to clipboard or downloaded, but they do not reach anyone.

**Options:**
- (a) Set `NEXT_PUBLIC_REPORT_EMAIL` to a monitored email address
- (b) Configure an issue tracker (e.g., GitHub Issues) and link to it from `/report`
- (c) Leave unconfigured; users will copy/download corrections manually

**Recommendation:** (a) Set `NEXT_PUBLIC_REPORT_EMAIL` to a monitored email address. This is a minimal change that closes the feedback loop.

### 6. Accessibility audit: fix or ship with notice?

**Context:** No accessibility audit has been performed. The code includes skip links, landmarks, ARIA labels, and keyboard navigation, but conformance is unverified.

**Options:**
- (a) Run an automated audit (axe, Lighthouse) and a manual keyboard navigation test; fix violations before release
- (b) Ship with a notice that accessibility has not been audited
- (c) Delay release until accessibility is verified

**Recommendation:** (a) Run the audit and fix violations. This is a PRD requirement and a legal/ethical obligation.

### 7. AI feature: enable or keep off?

**Context:** The AI feature is correctly disabled. The safety harness is in place, but no live evaluation has been run. Enabling it requires all seven gates in `src/lib/ai/feature-flag.ts` to be `met: true`.

**Options:**
- (a) Keep the AI feature off until a qualified reviewer is assigned and the evaluation suite is run against a live model
- (b) Enable the AI feature after narrowing the allowlist, running the evaluation suite, and marking all gates as met
- (c) Remove the AI harness entirely to reduce complexity

**Recommendation:** (a) Keep the AI feature off. The risk of generating wrong Islamic content is catastrophic. The harness is a good foundation, but it needs live evaluation and scholarly review before it can be enabled.

### 8. PRD §18 roadmap: clarify or revise?

**Context:** PRD §18 marks many items as ✅ that do not exist in this repository (Flutter, Noor stories, Guidance mode, Payment integration, Pro tier, Explore mode, Hifz engine, Taraweeh mode, Family accounts, iOS, Scholar program). This is misleading.

**Options:**
- (a) Revise PRD §18 to reflect actual status (❌ for unimplemented items)
- (b) Add a note to PRD §18 clarifying that it is aspirational, not a record of what is built
- (c) Leave as-is; stakeholders will discover the gap when they try to use the features

**Recommendation:** (b) Add a note to PRD §18 clarifying that it is aspirational. This preserves the roadmap vision while avoiding confusion.

### 9. Backup envelope version: reconcile code and docs

**Context:** `src/lib/backup.ts` says `BACKUP_VERSION = 6`, but `docs/IMPLEMENTATION-REPORT.md` says "backup envelope v4". This is a documentation discrepancy.

**Options:**
- (a) Update the docs to say v6
- (b) Update the code to say v4 (if v6 is a mistake)
- (c) Leave as-is; users will not notice

**Recommendation:** (a) Update the docs to say v6. The code is the source of truth.

### 10. Byte-level checksum baseline: add or skip?

**Context:** FR-071's immutability claim rests on the version string plus the structural scan. A tampered file with correct counts and non-empty text passes both. A checksum baseline would close this gap.

**Options:**
- (a) Add a checksum baseline generated by executing the recorder
- (b) Skip the checksum baseline; rely on the structural scan
- (c) Document the gap and accept the risk

**Recommendation:** (a) Add a checksum baseline. This is a PRD requirement and a data integrity issue.

---

## Appendix: Verification Basis

The following verification results are **reported** by the most recent audit (reconciled 2026-10-23). They were **not re-run** during this Sprint 0 audit.

| Check | Reported result |
|---|---|
| `npm run typecheck` (`tsc --noEmit`) | Clean |
| `npm test` (`vitest run`) | 188 tests in 11 files, all passing |
| `npm run build` (`next build`) | Exit 0, compiled successfully |
| `npm run validate:quran` | 114 surahs, 6,236 ayat, 0 issues |
| `npm run validate:licenses` | 13 source records, 0 issues |

**What these results establish:** The tree typechecks, the unit suite passes, a production build completes, and the two data validators report no structural issues.

**What they do not establish:** Production readiness, licensing clearance, scholarly approval, accessibility conformance, Core Web Vitals, rendered Open Graph/Twitter output, end-to-end journey correctness, or that every PRD requirement is satisfied.

**What was not run during this audit:** Lint, Lighthouse, Playwright/Cypress, automated axe audit, SEO tests, manual QA, rendered output inspection.

---

**End of Sprint 0 Audit.**
