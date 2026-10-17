# Al-Huda — Product Requirements Document (PRD)

Version: 3.0
Status: Product blueprint / implementation baseline
Prepared: 17 October 2026
Product category: Quran learning, discovery, reflection, and knowledge platform
Initial platform: SEO-first responsive web application
Primary stack direction: Next.js App Router, TypeScript, Tailwind CSS

---

## 1. Executive Summary

Al-Huda is a Quran-centered digital product that helps people move from fragmented Quran reading and searching to a connected experience. It links Quranic ayat with verified translations, tafsir, themes, cross-references, learning and memorization tools, and private personal reflections.

The core product idea is an interconnected Quran knowledge system: users should be able to begin with an ayah, a topic, a question, or a life situation and discover relevant Quranic passages with clear references and trustworthy scholarly context.

Al-Huda must not present AI-generated religious interpretation as authoritative. Quran text, translations, tafsir, recitation metadata, and scholarly references must have explicit provenance. AI may help users search, navigate, summarize approved sources, and organize personal learning, but it must not fabricate verses, citations, hadith, rulings, or scholarly consensus.

**Product thesis**

Make the Quran easier to explore, understand in context, revisit, memorize, and connect across topics—without altering the text or replacing qualified scholarship.

**Initial product promise**

- Find relevant ayat through Surah, ayah, keyword, theme, or natural-language question.
- Explore verified relationships between ayat and topics.
- Read translations and approved tafsir with clear source attribution.
- Save passages, take private notes, and return to them.
- Build a sustainable Quran reading and revision routine.

## 2. Vision, Mission, and Principles

**Vision**

A trusted, accessible, interconnected Quran platform for Muslims and anyone sincerely exploring the Quran.

**Mission**

Bring Quranic text, reliable source material, thematic discovery, and personal learning into one coherent experience.

**Product principles**

1. **Textual integrity**: The Quranic Arabic text must be sourced, versioned, and validated. Never silently alter it.
2. **Source transparency**: Every translation, tafsir excerpt, audio asset, and scholarly claim has a source and edition where applicable.
3. **Clear epistemic boundaries**: Distinguish Quran text, translation, tafsir, editorial topic mapping, AI-generated explanation, and personal notes.
4. **Respectful UX**: No manipulative streaks, guilt-driven notifications, or gamification that trivializes worship.
5. **Privacy by default**: Personal reflections and learning activity are private unless the user explicitly chooses otherwise.
6. **Accessibility**: Support Arabic RTL, readable typography, keyboard navigation, screen readers, and low-bandwidth use.
7. **SEO with integrity**: Public reference pages should be useful and accurate, not thin pages generated solely to capture search traffic.
8. **Incremental delivery**: Ship a reliable Quran reader and discovery foundation before advanced AI or social features.

## 3. Goals and Non-Goals

**Product goals**

- Provide accurate, fast access to all 114 Surahs and 6,236 ayat in the selected canonical dataset, with dataset-specific numbering conventions documented.
- Support Arabic text, transliteration where licensed/available, translations, and sourced tafsir.
- Connect ayat to topics and cross-references through an auditable relationship model.
- Enable search by reference, Arabic text, translation text, topic, and natural-language intent.
- Offer private bookmarks, notes, reading progress, and optional memorization/revision.
- Create indexable, canonical public pages for Surahs, ayat, and curated topics.
- Build a maintainable architecture that can later support Android/iOS clients.

**Non-goals for MVP**

- Issuing fatwas or acting as a religious authority.
- Replacing scholars, teachers, or established tafsir works.
- Unreviewed AI-generated tafsir presented as fact.
- Public social feed, open comments, follower graphs, or debate forums.
- Full Quran audio hosting unless licensing and infrastructure are confirmed.
- A comprehensive Islamic lifestyle super-app (prayer times, qibla, mosque finder, commerce) in the first release.
- User-generated public interpretations or unmoderated verse-topic claims.

## 4. Target Users and Jobs to Be Done

**Primary segments**

1. **Everyday reader**: Wants a clean Quran reading experience, translation, bookmarks, and continuity.
2. **Topic explorer**: Wants to explore themes such as sabr, shukr, tawakkul, mercy, justice, family, loss, or hope.
3. **Learner/student**: Wants to compare translations, inspect context, and consult referenced tafsir.
4. **Hifz learner**: Wants a structured, adjustable ayah revision workflow.
5. **New Muslim or non-Muslim explorer**: Wants clear language, introductory navigation, and transparent references without assuming prior knowledge.
6. **Researcher/developer**: Wants stable references, structured data, provenance, and potentially documented APIs or export tools.

**Jobs to be done**

- "When I encounter an ayah, help me understand where it sits in the Surah and find reliable explanations."
- "When I have a topic in mind, help me discover relevant ayat without claiming that a verse says more than its source supports."
- "When I save an ayah, let me attach a private reflection and find it again later."
- "When I memorize, help me revise at an appropriate interval and track my own progress."
- "When I share a reference, give others a stable, readable page with correct citations."

## 5. Product Scope and Release Priorities

**MVP — required**

- Home/discovery page
- Quran reader: Surah list, Surah page, ayah navigation
- Arabic text with one verified translation initially
- Ayah detail/reference view
- Search by Surah/ayah reference and text
- Curated topic pages with reviewed ayah links
- Basic cross-reference links where source-backed
- Tafsir/source panel for content available and licensed for use
- Bookmarks and reading progress
- Responsive design, Arabic RTL, accessibility baseline
- SEO metadata, canonical URLs, sitemap, robots rules
- Admin/editor workflow or controlled data-import pipeline for reviewed topic/source content
- Error states, loading states, monitoring, backups, privacy policy, terms

**Release 1.1 — after MVP validation**

- Additional licensed translations
- Word-by-word analysis, only from a verified dataset
- Audio recitation integration, subject to rights and provider reliability
- Personal notes and tags
- Reading plans and optional reminders
- Improved search filters and result snippets
- Export of user data

**Release 2 — advanced learning**

- Spaced-repetition memorization/revision
- Weak-ayah review and configurable revision schedule
- Topic knowledge graph visualization
- AI-assisted retrieval grounded in approved source corpus, with citations
- Natural-language question interface with safety boundaries
- Cross-device sync and mobile app shell/client

**Explicitly deferred**

- Public sharing of personal journals by default
- Open user-generated tafsir
- Automated religious rulings
- AI-generated Arabic Quran text
- Unreviewed claims that a particular ayah is a guaranteed remedy for a medical, financial, or psychological condition

## 6. Information Architecture

**Primary navigation**

- Home
- Read Quran
- Explore Topics
- Search
- My Library (signed-in users)
- About / Sources

**Public routes**

- `/` — homepage
- `/quran` — Surah index
- `/quran/[surah-slug]` — Surah page
- `/ayah/[surah-number]/[ayah-number]` — stable ayah reference
- `/topics` — curated topic index
- `/topics/[topic-slug]` — topic page
- `/search?q=...` — search results, with indexation policy determined by query quality
- `/sources` — source catalog and editorial methodology
- `/about` — mission and limitations
- `/privacy`, `/terms`, `/accessibility`

**Authenticated routes**

- `/library` — bookmarks, notes, reading history
- `/library/notes`
- `/learn/revision`
- `/settings`
- `/settings/privacy`

**URL and SEO rules**

- Use stable, human-readable URLs.
- Pick one canonical URL convention and enforce it consistently.
- Avoid duplicate indexed routes for the same ayah.
- Do not use a colon in the canonical path if it complicates routing or sharing; e.g. `/ayah/2/255`.
- Topic pages must be editorially meaningful and source-backed.
- User-specific pages must be private and noindex.
- Search-result pages with low-value or user-specific query states should generally be noindex.
- Use correct Arabic page direction and language metadata.
- Do not claim React/Vite makes SEO impossible; the chosen reason for Next.js is its strong SSR/SSG, routing, metadata, and ecosystem support.

## 7. Core User Journeys

**Journey A — Read an ayah**

1. User opens Quran index or a shared Surah link.
2. Selects a Surah.
3. Reads Arabic and chosen translation.
4. Opens an ayah detail panel.
5. Sees reference, surrounding ayat, available tafsir, and related topics.
6. Saves the ayah or copies a stable share link.

Acceptance criteria

- Surah and ayah references are consistent with the selected dataset.
- Arabic text is selectable and rendered RTL.
- Translation edition is clearly labeled.
- Missing tafsir or translation is shown as unavailable, not fabricated.

**Journey B — Explore a topic**

1. User selects a curated topic or enters a search query.
2. Results show ayat with reference, translation, and relevance explanation.
3. User opens an ayah to inspect context and sources.
4. User can move to related topics or verified cross-references.

Acceptance criteria

- Each curated relationship has provenance and review status.
- The UI distinguishes direct lexical matches from thematic/editorial associations.
- The product does not imply that a curated list is exhaustive.

**Journey C — Ask a question**

1. User submits a question in supported language.
2. System retrieves relevant Quran passages and approved source excerpts.
3. Response presents a concise answer only when retrieval supports it.
4. Every substantive religious claim links to the underlying source and exact reference.
5. If evidence is insufficient or the question requires a ruling, the system says so and directs the user to a qualified scholar.

Acceptance criteria

- No unsupported citation is rendered.
- The system never invents an ayah or misattributes a translation.
- The answer labels translation/paraphrase and source excerpts accurately.
- High-risk religious/legal/medical matters receive appropriate limitations.

**Journey D — Save and revisit**

1. User bookmarks an ayah.
2. Optionally adds a private note or tag.
3. Finds it in My Library and filters by tag or date.
4. Deletes or exports their data.

Acceptance criteria

- Notes are private by default.
- Delete/export behavior is explained and functional.
- Anonymous users may use local-only bookmarks if implemented, with a clear warning that browser data may be lost.

**Journey E — Memorization/revision**

1. User chooses ayat or a range.
2. Selects a revision mode and frequency.
3. Marks recall as easy, difficult, or missed.
4. The scheduler proposes future reviews.
5. User can edit or reset the schedule.

Acceptance criteria

- Revision reminders are optional.
- Scheduling supports user control and does not shame the user.
- Progress is presented as personal learning data, not a measure of faith.

## 8. Functional Requirements

Priority definitions: **P0** = release blocker; **P1** = important; **P2** = later enhancement.

### 8.1 Quran reader

- FR-001 (P0): Display Surah index with Arabic name, transliteration/English label where available, verse count, and revelation metadata only when verified.
- FR-002 (P0): Display all available ayat in canonical order.
- FR-003 (P0): Support navigation by Surah and ayah number.
- FR-004 (P0): Display selected translation and edition/source label.
- FR-005 (P0): Provide copy/share link to stable ayah reference.
- FR-006 (P1): Allow font size, line spacing, and reading layout preferences.
- FR-007 (P1): Support continuous reading and next/previous Surah navigation.
- FR-008 (P1): Provide juz/page metadata only if validated against the chosen mushaf dataset.

### 8.2 Search and discovery

- FR-010 (P0): Search by exact reference (e.g. 2:255).
- FR-011 (P0): Search Arabic and translation text using normalized indexing.
- FR-012 (P1): Filter results by Surah, translation edition, topic, or content type.
- FR-013 (P1): Show snippets with highlighted terms while preserving readable Arabic.
- FR-014 (P2): Natural-language semantic retrieval across approved content.
- FR-015 (P2): Show why a result matched (exact phrase, translation term, curated theme, or semantic similarity).

### 8.3 Topic system and knowledge graph

- FR-020 (P0): Support curated topics with stable slug, title, description, language, and editorial status.
- FR-021 (P0): Link topics to ayat through typed relationships.
- FR-022 (P0): Record who/what created the relationship, source, review status, and last-reviewed date.
- FR-023 (P1): Support related topics and ayah-to-ayah cross-references.
- FR-024 (P1): Provide an accessible list view even if a graph visualization exists.
- FR-025 (P2): Interactive graph visualization with keyboard-accessible alternatives.

### 8.4 Tafsir and source presentation

- FR-030 (P0): Show author/work/edition/language for tafsir.
- FR-031 (P0): Distinguish full text, excerpt, summary, and link to external source.
- FR-032 (P0): Track licensing and permitted display/use per source.
- FR-033 (P1): Compare multiple translations side-by-side.
- FR-034 (P1): Provide source details and editorial methodology.
- FR-035 (P2): Add tafsir search across works where rights and data quality permit.

### 8.5 User library

- FR-040 (P0): Allow authenticated users to bookmark ayat.
- FR-041 (P1): Allow private notes and tags.
- FR-042 (P1): Sync library across devices.
- FR-043 (P1): Export and delete personal data.
- FR-044 (P2): Local-only anonymous library, if implemented with transparent persistence limits.

### 8.6 Learning and memorization

- FR-050 (P1): Let users select a revision range.
- FR-051 (P1): Record review events and self-rated recall.
- FR-052 (P1): Schedule reviews using a configurable spaced-repetition algorithm.
- FR-053 (P1): Provide a no-streak / no-shame progress interface.
- FR-054 (P2): Audio-assisted review if licensed assets and playback UX are ready.

### 8.7 AI assistant

- FR-060 (P2): Retrieve only from approved, versioned source material.
- FR-061 (P2): Return citations with each factual Quranic or scholarly claim.
- FR-062 (P2): Separate retrieved quotations from generated summaries.
- FR-063 (P2): Abstain when retrieval is insufficient.
- FR-064 (P2): Avoid presenting personal opinions or generated content as Quran, hadith, tafsir, fatwa, or scholarly consensus.
- FR-065 (P2): Log source IDs and model/version metadata for quality audits, subject to privacy policy.
- FR-066 (P2): Provide user feedback/reporting for inaccurate or inappropriate answers.

### 8.8 Editorial/admin tooling

- FR-070 (P0): Import datasets with schema validation and duplicate detection.
- FR-071 (P0): Keep immutable source/version metadata for Quran text and translations.
- FR-072 (P0): Review and approve topic-to-ayah mappings before public publication.
- FR-073 (P1): Track changes, reviewers, and publication state.
- FR-074 (P1): Roll back an incorrect topic mapping or dataset release.
- FR-075 (P1): Display content rights and source status to editors.

## 9. Content, Data, and Provenance Model

**Data policy**

The referenced quran-database project can be evaluated as a candidate source, not automatically trusted as the sole production source. Verify the repository's license, source provenance, schema, text accuracy, numbering conventions, translation rights, maintenance status, and release process before use. Never assume that "open source" means every included translation/audio/tafsir can be redistributed without restrictions.

**Core entities**

- **Surah**: canonical number, Arabic name, transliteration, translated name, verse count, metadata source.
- **Ayah**: stable reference, Surah number, ayah number, Arabic text, text edition/version, optional juz/page metadata.
- **TranslationEdition**: language, translator, title, publisher/source, license, version.
- **AyahTranslation**: ayah reference, edition ID, translated text, provenance.
- **TafsirWork**: title, author, language, edition, rights/license, source URL.
- **TafsirEntry**: work ID, ayah/range reference, content or excerpt, source location.
- **Topic**: slug, localized title, description, editorial state.
- **AyahTopicRelation**: ayah reference, topic ID, relation type, rationale, provenance, reviewer, status.
- **CrossReference**: source ayah, target ayah, relation type, evidence/source, review status.
- **AudioAsset**: reciter, recording edition, ayah/range, provider, rights, URL, integrity metadata.
- **UserBookmark**: user ID, ayah reference, created time.
- **UserNote**: user ID, ayah reference, encrypted/private content where appropriate, timestamps.
- **RevisionItem / ReviewEvent**: user, ayah/range, due date, review outcome, algorithm version.
- **SourceRecord**: source name, URL, license, version, date checked, ingestion date, checksum, validation status.

**Relationship types**

Relationships must be typed rather than treated as generic "related" links. Examples:

- `TOPIC_ASSOCIATION`
- `LEXICAL_MATCH`
- `CROSS_REFERENCE`
- `TAFSIR_REFERENCE`
- `SAME_ROOT` (only with validated morphology data)
- `SEQUENTIAL_CONTEXT`
- `USER_PERSONAL_TAG` (private, not a public religious claim)

**Data validation gates**

Before publishing a dataset:

1. Confirm all expected Surahs and ayat exist according to the chosen source's numbering convention.
2. Detect duplicate, missing, reordered, or malformed records.
3. Validate Arabic Unicode normalization without changing canonical text.
4. Compare sampled passages against a trusted reference.
5. Verify translation edition and license.
6. Store source URL, version, checksum, and import date.
7. Run regression tests against known references.
8. Require a review and rollback procedure for corrections.

## 10. AI and Religious-Content Safety

**Permitted AI tasks**

- Find potentially relevant ayat in approved sources.
- Summarize retrieved source passages with clear labels.
- Explain navigation and terminology in plain language.
- Help users organize their own notes.
- Translate interface text, subject to review.

**Restricted or disallowed behavior**

- Generating or reconstructing Quranic Arabic text from a language model.
- Inventing ayah references, hadith citations, tafsir quotations, or scholarly attributions.
- Declaring a definitive ruling without a qualified, sourced review workflow.
- Claiming that a specific verse guarantees a cure, financial outcome, or other worldly result.
- Presenting a thematic association as the only or universally accepted interpretation.
- Concealing uncertainty or failing to show source boundaries.

**Grounded answer pipeline**

1. Classify the request and identify whether it asks for a factual reference, explanation, ruling, or sensitive advice.
2. Retrieve from an allowlisted, versioned corpus.
3. Validate each reference against the canonical database.
4. Generate only from retrieved material.
5. Attach citations at claim level.
6. Run citation/reference validation.
7. Abstain or provide a safe redirect if sources are insufficient.
8. Preserve a reviewable audit record without unnecessarily storing private user questions.

**User-facing labels**

Use explicit labels such as:

- Quran text
- Translation
- Tafsir source
- Editorial topic connection
- AI-assisted summary
- Your private note

## 11. UX and Visual Design Requirements

**Design direction**

Premium, calm, modern, respectful, and content-first. The experience should feel like a high-quality reading and research tool rather than a noisy social network or generic AI chatbot.

**Layout**

- Desktop: spacious reading column, optional contextual side panel, clear navigation.
- Mobile: single-column reading experience, compact controls, accessible bottom navigation where useful.
- Arabic text: right-to-left with a dedicated font and tested line-height.
- English/Urdu and other translations: correct language and direction per content.
- Topic pages: editorial introduction, ayah list, context links, sources, and related topics.

**UI rules**

- Prioritize legibility and reading comfort over animation.
- Respect reduced-motion preferences.
- Make audio controls keyboard and screen-reader accessible.
- Never rely on color alone to convey source status or review state.
- Preserve Arabic punctuation and glyph rendering.
- Use skeletons only where they improve perceived loading; avoid layout shifts.
- Include empty, loading, offline, error, and not-found states.
- Avoid intrusive interstitials or ads between ayat.

**Accessibility**

Target WCAG 2.2 AA where practical:

- Keyboard navigation and visible focus.
- Semantic headings and landmarks.
- Screen-reader labels for Arabic controls and audio.
- Adequate contrast and scalable typography.
- RTL/LTR mixed-content testing.
- Reduced motion and non-color status indicators.

## 12. Technical Architecture

**Recommended initial stack**

- Framework: Next.js App Router with TypeScript.
- Styling: Tailwind CSS, accessible component primitives.
- Client state: Zustand only for genuinely shared client-side UI state; keep server data in server components or a query/cache layer as appropriate.
- Data fetching: Server-side data access for public Quran content; use TanStack Query when client-side caching/mutations justify it.
- Database: PostgreSQL recommended for structured relational data and future search extensions; MySQL is also viable if already selected. Do not add a graph database before the relationship model proves it is needed.
- Search: Start with database full-text search and normalized indexes; evaluate a dedicated search engine only when scale/relevance requires it.
- Authentication: Use a maintained auth solution with secure sessions and account deletion/export support.
- Validation: Runtime schema validation at import and API boundaries.
- Testing: Unit, integration, end-to-end, accessibility, and dataset validation tests.
- Observability: Error tracking, structured logs, uptime checks, and performance monitoring.

**Rendering strategy**

- SSG/ISR: Surah pages, stable ayah pages, curated topic pages where content is public and stable.
- SSR: Personalized or request-dependent pages when necessary.
- Client components: Interactive reader controls, search filters, audio controls, graph interactions, and local UI state.
- API routes: Use Next.js route handlers for initial application APIs, search, and tightly scoped AI proxying. Keep secrets server-side.
- Future backend: Extract a dedicated NestJS service only when domain complexity, independent deployment, integrations, or workload justify the extra operational cost.

**Important Capacitor qualification**

Capacitor is not automatically compatible with every Next.js server feature. A fully static export cannot run Next.js server-side rendering, server actions, or dynamic route handlers inside the exported bundle. If mobile apps are required, choose deliberately between:

1. A hosted Next.js website displayed in a Capacitor shell, or
2. A static/mobile client that calls a hosted API.

Do not assume `next export` is a current command; use the supported Next.js `output: 'export'` configuration only if the application avoids unsupported server features.

**High-level architecture**

1. Source ingestion and validation pipeline
2. Canonical Quran/content database
3. Server-side domain/data access layer
4. Public Next.js routes and private user workspace
5. Search/retrieval layer
6. Optional grounded AI service
7. Editorial review and monitoring
8. Backup, restore, and release pipeline

**Security requirements**

- Secrets and model API keys must remain server-side.
- Rate-limit search and AI endpoints.
- Validate and sanitize all user input.
- Apply authorization checks to every user-owned record.
- Prevent cross-user access to notes/bookmarks.
- Use secure cookies and standard CSRF protections where applicable.
- Encrypt traffic in transit; protect backups and sensitive stored data.
- Maintain dependency updates and security scanning.
- Define retention and deletion policies for prompts, logs, and user notes.

## 13. Suggested Repository Structure

```
al-huda/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── quran/
│   │   │   ├── page.tsx
│   │   │   └── [surahSlug]/page.tsx
│   │   ├── ayah/
│   │   │   └── [surahNumber]/[ayahNumber]/page.tsx
│   │   ├── topics/
│   │   │   ├── page.tsx
│   │   │   └── [topicSlug]/page.tsx
│   │   ├── search/page.tsx
│   │   ├── library/
│   │   ├── sources/page.tsx
│   │   └── api/
│   ├── components/
│   │   ├── quran/
│   │   ├── topics/
│   │   ├── search/
│   │   ├── library/
│   │   └── ui/
│   ├── lib/
│   │   ├── quran/
│   │   ├── search/
│   │   ├── sources/
│   │   ├── auth/
│   │   └── validation/
│   ├── server/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── ai/
│   ├── data/
│   │   └── seed/
│   ├── types/
│   └── tests/
├── scripts/
│   ├── import-quran-data.*
│   ├── validate-quran-data.*
│   └── validate-source-licenses.*
├── docs/
│   ├── PRD.md
│   ├── DATA-PROVENANCE.md
│   ├── AI-SAFETY.md
│   └── ADR/
├── public/
└── ...
```

This is a suggested structure, not a mandate. Keep the initial implementation simple and avoid creating empty abstraction layers without a current need.

## 14. API Surface (Initial Proposal)

API design should be finalized after the database and auth approach are chosen. Example endpoints:

- `GET /api/surahs`
- `GET /api/surahs/:surahNumber`
- `GET /api/ayahs/:surahNumber/:ayahNumber`
- `GET /api/search?q=...&language=...`
- `GET /api/topics`
- `GET /api/topics/:slug`
- `GET /api/topics/:slug/ayahs`
- `GET /api/ayahs/:surahNumber/:ayahNumber/tafsir`
- `GET /api/library/bookmarks` (authenticated)
- `POST /api/library/bookmarks` (authenticated)
- `DELETE /api/library/bookmarks/:id` (authenticated)
- `POST /api/library/notes` (authenticated)
- `POST /api/ai/ask` (later release, authenticated or rate-limited according to policy)

**API requirements**

- Stable response schemas and explicit versioning strategy.
- Pagination for large result sets.
- Input validation and bounded query sizes.
- Consistent error format.
- Rate limits and abuse controls.
- No sensitive personal data in public endpoints.
- Quran references validated against canonical records.

## 15. SEO and Public Discovery

**Indexable content**

- Surah pages with meaningful unique metadata.
- Ayah reference pages with correct text, edition attribution, and useful surrounding context.
- Curated topic pages with editorially reviewed descriptions and related ayat.
- Source/methodology pages explaining the platform's approach.

**Requirements**

- Server-render useful content for crawlers.
- Use unique titles/descriptions without keyword stuffing.
- Add canonical tags and XML sitemap entries only for valid public pages.
- Include structured data only when semantically appropriate and accurate.
- Keep private notes, account pages, internal search states, and thin pages out of the index.
- Avoid mass-generating low-value topic pages.
- Monitor indexing, crawl errors, duplicate URLs, and Core Web Vitals.

**Example URL convention**

- `/quran/al-baqarah`
- `/ayah/2/255`
- `/topics/sabr`

## 16. Non-Functional Requirements

**Performance**

- Target Core Web Vitals in the "good" range on representative mobile devices.
- Minimize client JavaScript on public reading pages.
- Cache stable public content safely.
- Avoid layout shifts when Arabic fonts load.
- Paginate or virtualize long Surah views if testing shows a need.

**Reliability**

- Public Quran reading should fail gracefully if optional AI/audio services are unavailable.
- Back up the database and test restoration.
- Version imported datasets and provide rollback.
- Monitor API errors, latency, and failed ingestion jobs.

**Localization**

- Architecture should support English and Urdu first, with Arabic source text.
- Pashto and additional languages can follow when translations/UI copy are reviewed.
- Each text field must declare its language and direction.
- Do not assume all translations are licensed for redistribution.

**Privacy**

- Private notes and learning history must not be public or used for model training without explicit, informed permission.
- Provide account deletion and data export.
- Minimize telemetry and retention.
- Explain what is stored and why.

## 17. Success Metrics

**North-star metric**

Meaningful Quran learning sessions per active user, defined as sessions in which the user reads a passage and completes at least one meaningful action such as opening context, viewing a source, saving a passage, or completing a revision.

**Activation**

- Percentage of new users who open an ayah and view its translation/context.
- Percentage who save a passage or explore a topic in their first session.

**Engagement and retention**

- Weekly returning readers.
- Returning users who continue a reading plan or revision session.
- Topic-to-ayah exploration completion.
- Bookmark and note retrieval usage.

**Quality and trust**

- Quran reference validation pass rate: target 100% for published references.
- Published source records with complete provenance/license status.
- Incorrect/missing citation reports per 1,000 AI answers.
- Dataset import validation pass rate.
- User-reported content errors and time to resolution.

**Performance and reliability**

- Core Web Vitals.
- Search latency and zero-result rate.
- API availability and error rate.
- Failed import/release count.

Do not optimize for session length alone; the product should support focused, respectful use.

## 18. Analytics and Event Taxonomy

Collect only events needed to improve the product, with clear privacy disclosure.

Possible events:

- `surah_opened`
- `ayah_opened`
- `translation_changed`
- `tafsir_opened`
- `topic_opened`
- `topic_ayah_clicked`
- `search_submitted`
- `search_result_opened`
- `bookmark_created`
- `bookmark_removed`
- `note_created`
- `revision_started`
- `revision_completed`
- `source_report_submitted`

Avoid recording the full text of private notes or sensitive free-text questions in general analytics. Define retention, consent, and access rules before launch.

## 19. Testing and Quality Assurance

**Automated tests**

- Unit tests for reference parsing, normalization, route generation, and scheduling.
- Import tests for missing/duplicate ayat and translation coverage.
- Integration tests for search, source retrieval, authentication, and private library permissions.
- End-to-end tests for core reading and bookmarking journeys.
- Accessibility checks for key flows.
- SEO tests for canonical URLs, metadata, sitemap, and robots rules.
- AI citation validation tests before AI features launch.

**Manual QA checklist**

- Verify sample ayat across the beginning, middle, and end of multiple Surahs.
- Test Arabic RTL and mixed Arabic/English/Urdu layouts.
- Test small screens, desktop, keyboard-only navigation, and screen readers.
- Test missing translation/tafsir/audio gracefully.
- Test user A cannot access user B's notes or bookmarks.
- Test source license display and attribution.
- Test backup restoration and dataset rollback.
- Review topic mappings with a qualified reviewer before public release.

**Release blockers**

- Any known Quran text corruption or incorrect reference.
- Missing provenance for published translations or tafsir.
- Cross-user access to private content.
- Exposed API secrets.
- Public AI answers with unvalidated citations.
- Broken canonical URLs or unusable Arabic reading layout.

## 20. Editorial Governance and Operations

**Roles**

- **Product owner**: Defines scope and release decisions.
- **Data maintainer**: Owns import pipelines, source versions, and validation.
- **Content editor**: Drafts topic pages and editorial descriptions.
- **Qualified reviewer/advisor**: Reviews religiously substantive topic mappings and sensitive explanations.
- **Developer/administrator**: Maintains application, security, and release process.

One person may hold multiple roles initially, but the responsibilities should remain explicit.

**Editorial workflow**

1. Draft content or relationship.
2. Attach source and rationale.
3. Validate references and licensing.
4. Review religiously substantive claims.
5. Approve and publish.
6. Record version and review date.
7. Accept correction reports and provide rollback.

**Correction process**

Provide a visible way to report incorrect text, reference, translation attribution, topic link, or technical defect. Prioritize Quran text/reference errors as critical incidents.

## 21. Roadmap

**Phase 0 — Foundation**

- Finalize source selection and licensing audit.
- Define canonical reference and numbering rules.
- Build dataset validator and provenance registry.
- Confirm design system and route convention.
- Establish repository, CI, tests, and deployment.

Exit criteria: Source and license review completed; sample validation passes; data model approved.

**Phase 1 — Quran reading MVP**

- Surah index and reader.
- Ayah reference pages.
- One verified translation.
- Search by reference and text.
- Bookmarks and basic progress.
- SEO metadata and sitemap.
- Accessibility and privacy baseline.

Exit criteria: Core journeys pass QA; no known text/reference integrity issue; public pages perform acceptably.

**Phase 2 — Connected discovery**

- Curated topics.
- Reviewed ayah-topic relationships.
- Cross-references and source panels.
- Additional translations where licensed.
- Editorial tooling and correction workflow.

Exit criteria: Topic pages have source/provenance coverage and review status.

**Phase 3 — Personal learning**

- Private notes and tags.
- Reading plans.
- Spaced-repetition revision.
- Optional reminders and progress view.

Exit criteria: Privacy and deletion/export tests pass; learning schedule is user-controllable.

**Phase 4 — Grounded AI and graph exploration**

- Retrieval-grounded question interface.
- Claim-level citations and abstention.
- Audit and feedback pipeline.
- Optional interactive graph visualization.

Exit criteria: Evaluation dataset passes citation and reference checks; safety review is approved.

**Phase 5 — Mobile expansion**

- Decide hosted web shell vs dedicated API-backed mobile client.
- Validate offline behavior and audio rights.
- Add platform-specific UX and store compliance.

Exit criteria: Mobile architecture and offline limitations are documented and tested.

## 22. Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect Arabic text or numbering | Critical trust failure | Canonical source, checksums, automated validation, sampled human review, rollback |
| Translation/tafsir licensing uncertainty | Legal and distribution risk | License audit before ingestion/publication; attribution and takedown process |
| AI hallucination or false attribution | Religious misinformation | Retrieval grounding, reference validation, citations, abstention, human review |
| Topic links oversimplify interpretation | Misleading discovery | Typed relationships, editorial rationale, reviewed status, context-first UI |
| SEO creates thin or duplicated pages | Search quality and maintenance cost | Index only useful canonical pages; noindex low-value search/personal routes |
| Overbuilt architecture | Slow delivery and maintenance burden | Start relational; add graph/search services only when justified |
| User notes leak | Severe privacy failure | Authorization tests, private-by-default design, secure sessions, deletion controls |
| Audio provider changes or rights lapse | Playback failure/legal risk | Track provider and rights; make audio optional; monitor URLs |
| Notifications become guilt-driven | Poor trust and retention | Optional reminders, neutral language, no shame-based streaks |

## 23. Open Decisions Before Implementation

These decisions should be resolved explicitly rather than silently assumed:

1. **Initial language**: English-only interface first, or English plus Urdu at launch?
2. **Translation source**: Which edition(s) are licensed and approved for display?
3. **Tafsir scope**: Link externally, show licensed excerpts, or ingest a licensed corpus?
4. **Authentication**: Launch anonymous-first, or require accounts for library features?
5. **Database**: PostgreSQL or MySQL? Choose based on hosting, team familiarity, and deployment constraints.
6. **Search**: Database full-text search initially, or a dedicated search service?
7. **Editorial review**: Who reviews topic mappings and sensitive AI outputs?
8. **Audio**: External links/streaming provider or self-hosted assets?
9. **Mobile**: Is mobile a later responsive/PWA goal or a committed Capacitor app?
10. **AI launch gate**: Which source corpus and evaluation threshold must be met before the assistant is enabled?

**Recommended default decisions for MVP**

- English UI with Arabic Quran text; architect for Urdu and Pashto localization.
- One verified translation with documented license.
- Tafsir links or licensed excerpts only.
- Anonymous public reading; accounts optional for synced library.
- PostgreSQL if no existing database constraint; otherwise use the database the team can operate reliably.
- Database full-text search first.
- Human-reviewed topic relationships.
- Audio deferred until source and rights are verified.
- Responsive web first; decide mobile packaging after the core web experience is stable.
- No public AI religious-answer feature until source grounding, citation validation, and abstention are tested.

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

For any feature touching Quran text, numbering, translation, tafsir, or religious claims, **content integrity and provenance are release gates—not optional polish**.

## 25. Final Product Definition

Al-Huda is a Quran reading, discovery, and personal learning platform built around trustworthy interconnected content. Its differentiator is not simply having a Quran database or an AI chat box; it is the quality of the connections between canonical ayat, sourced scholarship, curated themes, and a user's own private learning journey.

**Build in this order:**

1. Correct text and transparent sources.
2. Excellent reading and search.
3. Reviewed thematic connections.
4. Private library and learning tools.
5. Grounded AI only after trust and validation are established.

That order protects the product's credibility while creating a foundation that can expand into a larger Quran knowledge ecosystem.
