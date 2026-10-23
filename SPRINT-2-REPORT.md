# Sprint 2 Report — Learning-Path Data Integrity

**Date:** 2026-10-23
**Scope:** Fix broken `topicSlug` references in `src/lib/paths/data.ts` that did not resolve to any canonical topic in `src/lib/topics/data.ts`.
**Status:** Implemented, verification commands NOT run per user instruction.

---

## Problem

Five learning paths contained `topicSlug` values that did not match any canonical topic slug. The path workspace component (`src/components/paths/path-workspace.tsx`) silently drops unresolvable slugs (the `TOPICS.find()` returns undefined and the link is not rendered), so the broken references were invisible to users but present in the data — a silent integrity gap.

---

## Slug mappings applied

| # | Old slug | Occurrences | Path(s) affected | Canonical replacement | Evidence |
|---|----------|-------------|------------------|-----------------------|----------|
| 1 | `sabr` | 3 | `key-themes` (steps 1–3) | `patience` | Topic summary verbatim: *"Verses that speak about patience (sabr) — seeking help through patience and prayer…"*. The path steps cite 2:153, 2:155, 2:156 — all of which are already relations of the `patience` topic. |
| 2 | `shukr` | 5 | `key-themes` (steps 4–8) | `gratitude` | Topic summary verbatim: *"Verses about gratitude (shukr) — remembering God's favors…"*. The path steps cite 2:152, 14:7, 31:12, 39:7, 55:13 — themes matching the `gratitude` topic's relations. |
| 3 | `mercy` | 6 | `the-merciful` (steps 1–6) | `mercy-and-forgiveness` | The canonical topic covering divine mercy is `mercy-and-forgiveness` (arabicTitle: *الرحمة والمغفرة*). The path steps cite 6:12, 6:54, 7:156, 21:107, 27:30, 39:53 — all mercy-themed ayat consistent with the topic's scope. |
| 4 | `tawhid` | 1 | `first-steps` (step 4) | **removed — no canonical topic exists** | No topic in `src/lib/topics/data.ts` covers divine oneness (tawhid). The 11 canonical topics are: patience, gratitude, trust-in-god, mercy-and-forgiveness, remembrance, giving, justice, parents-and-family, hardship-and-ease, knowledge-and-reflection, the-hereafter. None is a safe substitute. The `topicSlug` field was removed from this step rather than pointed at an unrelated topic. |

The `justice` slug (6 occurrences in the `justice` path) already matched the canonical `justice` topic and was left unchanged.

---

## Unresolved case — owner decision required

**`tawhid` (divine oneness)** — first-steps, step 4 (surah 112, ayah 1).

No canonical topic covers this theme. Three options for the owner:

1. **Create a new `tawhid` topic** in `src/lib/topics/data.ts` with appropriate ayat (112:1–4 being the core), following the same provenance model. Then re-add `topicSlug: "tawhid"` to this step.
2. **Accept the step has no topic anchor.** The step's objective and reflection prompt remain intact; only the sidebar topic link is absent. This is the current state.
3. **Map to the closest existing topic** (e.g., `trust-in-god` or `remembrance`). Not recommended — these are thematically adjacent but not equivalent, and forcing the link would misrepresent the topic's scope.

A code comment at `src/lib/paths/data.ts:77–80` records this decision point and cross-references this report.

---

## Other references surveyed

A repository-wide search for `tawhid`, `sabr`, `shukr`, and `"mercy"` / `'mercy'` found no other broken slug references:

- **PRD prose** (`AL-HUDA-PRD-v2.0-COMPLETE.md`, `docs/PRD.md`): uses these as Arabic terms in descriptive text, not as slug identifiers.
- **Topic summaries** (`src/lib/topics/data.ts`): uses "(sabr)" and "(shukr)" as parenthetical Arabic glosses inside the `patience` and `gratitude` summaries — not as slug values.
- **Search/tafsir/translation tests** (`src/lib/quran/*.test.ts`): uses `"mercy"` as a search-query string, not as a topic slug.
- **Comprehension notes** (`src/lib/comprehension/notes.ts`): uses "Patience (sabr)" as a gloss, not a slug.

No other code location needed updating.

---

## Files changed

**Modified (1):**
- `src/lib/paths/data.ts` — replaced 14 broken `topicSlug` values (3× `sabr` → `patience`, 5× `shukr` → `gratitude`, 6× `mercy` → `mercy-and-forgiveness`); removed 1 unresolvable `topicSlug` (`tawhid`) with an explanatory comment.

**Created (1):**
- `SPRINT-2-REPORT.md` — this report.

**Not changed:**
- No changes to `src/lib/topics/data.ts` (no alias topics created, no fabrication).
- No changes to Explore dimensions, AI feature flag, licensing, or any other module.
- No changes to path order, wording, progression, objectives, reflection prompts, or ayah references.

---

## Verification of final state

A post-edit scan confirmed:
- All `topicSlug` values in `src/lib/paths/data.ts` now resolve to canonical topics: `patience`, `gratitude`, `mercy-and-forgiveness`, `justice`.
- Zero unresolved slugs remain.
- The only `tawhid` string in `src/` is inside the explanatory comment at lines 77 and 79.

---

## Verification commands NOT run

Per user instruction, the following were **not** executed:
- `npm run typecheck`
- `npm run build`
- `npm test`
- `npm run lint`
- Browser checks

To verify: run the above commands and navigate to `/learn/paths/key-themes`, `/learn/paths/the-merciful`, and `/learn/paths/first-steps` to confirm topic links render correctly.

---

## Summary

Sprint 2 fixed 14 broken `topicSlug` references across 2 learning paths (`key-themes`, `the-merciful`) by mapping them to their unambiguous canonical topics. One additional broken reference (`tawhid` in `first-steps`) was removed rather than guessed, with an explanatory comment and an owner-decision note in this report. The fix is data-only — no behavior, UI, or content wording changed. All path step objectives, reflection prompts, ayah references, ordering, and provenance are preserved verbatim.
