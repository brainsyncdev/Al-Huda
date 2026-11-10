# Al-Huda (الهدى) — The Quran, Connected

Al-Huda is a Quran reading, discovery, and learning platform: an interconnected Quran knowledge system built as a local-first, account-free, SEO-first Next.js web application. It connects all 114 surahs / 6,236 ayat to translations (116 editions, 44 languages), tafsir, curated topics, root-word and morphology exploration, cross-references, and private local learning tools (bookmarks, notes, spaced-repetition revision, quizzes, learning paths).

## Status

- Roadmap Phases 1–3 are functionally complete (reader, connected discovery, personal learning); Phase 4 (grounded AI) is harness-only and disabled; see the roadmap and release blockers in `docs/PRD.md` §19–§21.
- **Source of truth:** [`docs/PRD.md`](docs/PRD.md) (v4.0). Superseded PRDs (v3.0, v2.0) are archived in [`docs/archive/`](docs/archive/).
- Content provenance and licensing status: [`docs/DATA-PROVENANCE.md`](docs/DATA-PROVENANCE.md). Content is tracked as *delivered* vs *cleared*; audio, the proxied translation catalog, and in-app tafsir texts still require rights review before publication.
- AI religious-answer features are compile-time disabled (`src/lib/ai/feature-flag.ts`); see [`docs/AI-SAFETY.md`](docs/AI-SAFETY.md).

## Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Useful commands:

```bash
pnpm build              # production build (requires NEXT_PUBLIC_SITE_URL)
pnpm test               # vitest suite
pnpm typecheck          # tsc --noEmit
pnpm lint               # eslint
pnpm validate:quran     # integrity check: 114 surahs / 6,236 ayat
pnpm validate:licenses  # source-register field check
```

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for production build and deployment requirements.

## Documentation

| Document | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document v4.0 — single source of truth |
| [`docs/DATA-PROVENANCE.md`](docs/DATA-PROVENANCE.md) | Sources, licences, and provenance for all Quranic content |
| [`docs/AI-SAFETY.md`](docs/AI-SAFETY.md) | AI and religious-content safety rules and gates |
| [`docs/EDITORIAL.md`](docs/EDITORIAL.md) | Editorial workflow and governance |
| [`AI_RULES.md`](AI_RULES.md) | Stack and library-usage rules for AI-assisted development |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Deployment checklist |

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · Radix/shadcn UI · Vitest. No database and no accounts by design — library state (bookmarks, notes, revision history) lives in the reader's own browser.
