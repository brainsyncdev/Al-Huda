## Implementation Plan: Transform Al-Huda into a Learning Platform

### Phase 0: Fix Existing Bugs (Prerequisite)
- Fix 8 type errors in `src/lib/ai/grounding.ts` (union type narrowing)
- Fix 1 type error in `src/lib/revision/storage.ts` (null safety)
- Fix failing test in `src/lib/quran/cross-references.test.ts` (memoization assertion)
- Fix failing test in `src/lib/revision/scheduling.test.ts` (editItem due date logic)

### Phase 1: Learning Paths Foundation
- Create `src/lib/paths/` with types, curated data (5 paths), storage, context provider
- Paths: "First Steps" (new muslim), "Key Themes" (patience/gratitude), "Short Surahs", "The Merciful", "Justice"
- All content marked `pending-scholarly-review` following topic pattern
- Integrate into backup envelope (bump version to 3)

### Phase 2: Learning Path UI
- `/learn/paths` — path index grouped by audience
- `/learn/paths/[slug]` — path detail with step workspace
- Step view: AyahCard + objective + reflection prompt + "mark complete"
- Progress tracking with no-shame design

### Phase 3: Onboarding
- `/onboarding` — 3-screen goal selection flow
- Goal → recommended path mapping
- Home page personalization based on onboarding state

### Phase 4: Active Learning (Quizzes)
- Create `src/lib/quiz/` with types, generator, storage, context
- 4 quiz types: surah identification, translation match, ayah ordering, topic matching
- `/learn/quiz` — quiz interface with scoring
- Self-assessment only, no shame/comparison

### Phase 5: Comprehension Scaffolding
- Add contextual notes for 20-30 key ayat
- "Show context" button on AyahCard
- Editorial notes marked pending-scholarly-review

### Phase 6: Navigation & Discovery
- Update nav: "Revise" → "Learn" with dropdown (Paths, Revision, Quiz)
- Home page: personalized cards based on onboarding
- Search: show "In path: [title]" chips for ayat in learning paths

### Phase 7: Testing & Verification
- Unit tests for all pure modules
- Integration tests for backup, onboarding, progress persistence
- Run typecheck, tests, build, validators — expect 0 errors

### Key Constraints
- No AI-generated religious interpretation (neutral, descriptive content only)
- Local-first (localStorage, no accounts)
- Textual integrity (verbatim Quran text)
- No-shame design (no streaks, no comparisons)
- Provenance transparency (review status displayed)
- Accessibility (keyboard nav, aria labels, RTL)

### Estimated Effort: 20-25 hours