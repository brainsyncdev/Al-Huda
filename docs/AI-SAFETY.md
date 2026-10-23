# AI and Religious-Content Safety Guidelines

This document implements the AI safety requirements specified in the Al-Huda
PRD (Section 10).

## Current implementation status

**The public AI religious-answer feature is disabled.**

- `AI_ANSWER_FEATURE_ENABLED = false as const` in
  `src/lib/ai/feature-flag.ts`. This is a compile-time constant, not a
  runtime toggle.
- No `/api/ai/ask` route exists. Every call is rejected with
  `rejected-flag-off` by construction.
- Seven gates are declared; only `source-registry` is `met: true`. The six
  unmet gates are `evaluation-dataset`, `citation-coverage`,
  `abstention-rate`, `hallucination-zero`, `privacy-review`, and
  `editorial-reviewer`.
- The evaluation set (22 cases, ground truth derived from the dataset at run
  time) exists and is unit-tested for gate conditions, flag-off rejection, and
  audit privacy, but has never been executed against a live model.
- `AUDIT_RETENTION` is defined in one exported place
  (`src/lib/ai/audit.ts`): process memory only, bounded to 200 records, never
  persisted, discarded when the process exits. The `privacy-review` gate
  itself remains unmet — a privacy review has to be performed by a person, not
  inferred from the existence of a constant.
- No qualified reviewer/advisor is assigned; the `editorial-reviewer` gate
  remains unmet.

**Allowlist nuance.** `src/lib/ai/approved-sources.ts` derives the retrieval
allowlist from `method === "package"` in `src/lib/quran/sources.ts`. That
field currently admits seven records, of which four are legitimate prose
sources (quran-json, quranenc, tanzil-sahih, tanzil-translit) and three are
non-prose bundled datasets (semantic-embeddings, qul-word-data,
tanzil-mushaf-metadata). Enabling AI would require narrowing the allowlist to
prose sources before any gate could honestly be marked met.

The rest of this document states the principles, pipeline, and gates that
apply when and if the feature is turned on. They are preserved as the target
state, not as a description of what currently ships.

## Core Principles

1. **Textual integrity**: AI must never generate, reconstruct, or alter Quranic Arabic text.
2. **Source transparency**: All factual claims must be traceable to approved, versioned sources with citations.
3. **Epistemic boundaries**: Clearly distinguish Quran text, translation, tafsir, editorial topic mapping, AI-generated explanation, and personal notes.
4. **Abstention over fabrication**: If retrieval cannot support an answer, the system must explicitly say so and not invent citations/references.
5. **Privacy by default**: User questions for AI features (when enabled) must not be logged with full PII unnecessarily; audit logs must store source IDs, model/version, and minimal metadata only per policy.

## Permitted AI Tasks

- Find relevant ayat in approved, allowlisted sources.
- Summarize retrieved source passages with clear labels.
- Explain navigation/terminology in plain language.
- Help users organize their own notes (non-religious interpretation assistance).
- Translate interface text (reviewed).

## Restricted/Disallowed Behavior

- Generating or reconstructing Quranic Arabic text.
- Inventing ayah references, hadith citations, tafsir quotations, or scholarly attributions.
- Declaring definitive rulings (fatwas) without a qualified sourced review workflow.
- Claiming a specific verse guarantees cure/financial outcome/worldly result.
- Presenting thematic associations as the only/universally accepted interpretation.
- Concealing uncertainty or failing to show source boundaries.
- Presenting personal opinions as Quran/hadith/tafsir/fatwa/scholarly consensus.

## Grounded Answer Pipeline (PRD 10)

1. **Classify**: Identify request type (factual reference, explanation, ruling, sensitive advice).
2. **Retrieve**: Search only allowlisted versioned corpus (Quran text/translation, licensed tafsir excerpts, curated reviewed topics).
3. **Validate**: Each citation must reference a canonical ayah (surah:ayah) that exists in the current validated dataset; translation/tafsir work must be in source registry.
4. **Generate**: Compose answer using only retrieved material. Clearly separate quotations from generated summary.
5. **Cite**: Attach citations at claim level (reference + source edition/work + snippet if excerpt).
6. **Verify**: Run citation/reference validation before returning.
7. **Abstain/Redirect**: If insufficient evidence or high-risk (rulings/medical/legal), abstain and direct to qualified scholar. Also redirect for questions requiring tafsir beyond excerpts or corpus scope.
8. **Audit**: Record source IDs, model name/version, timestamp, outcome (answered/abstained/redirected), and minimal non-PII metadata for quality audits. Do not store full private user questions unless explicitly permitted with consent.

## User-Facing Labels (Required)

Always label content types:
- **Quran text** (Arabic canonical text with edition/version)
- **Translation** (with edition/translator/language)
- **Tafsir source** (work/author/edition/language/licensing)
- **Editorial topic connection** (reviewed status, relation type, rationale)
- **AI-assisted summary** (generated from retrieved material; not authoritative)
- **Your private note** (local/private, never shared/public)

## Citation Requirements

- Every substantive religious claim citing Quran must include exact reference (surah:ayah) and translation edition used.
- Tafsir citations must include work, author, edition, and location (page/volume/section) or specific excerpt ID.
- When similarity/semantic retrieval is used, label as "retrieved match" and show confidence/relevance, noting it's not proof of interpretation.
- Do not present "related verses" without relation type (LEXICAL_MATCH / CROSS_REFERENCE / TOPIC_ASSOCIATION / SEQUENTIAL_CONTEXT etc.) and provenance.

## High-Risk Scenarios (Mandatory Abstention/Redirect)

- Requests for fatwas or definitive legal rulings.
- Medical, psychological, financial, or other advice presented as guaranteed by Quran.
- Questions about unseen matters requiring specialist theological rulings.
- Requests to generate Arabic Quran text or complete tafsir.
- Any claim that could be presented as scholarly consensus without explicit sourced consensus documentation.

## Evaluation Gates (Before Enabling Public AI Features)

Per PRD 10/23/24, the following must pass before enabling any public AI religious-answer feature:

| Gate | Current state |
| --- | --- |
| Evaluation dataset of reference queries with ground-truth citations — target 100% validated references | 22 cases exist; never executed against a live model. `met: false` |
| Citation validation coverage: every claim has verifiable citation in allowlisted corpus | Implemented in code; unverified end-to-end. `met: false` |
| Abstention rate meets threshold for high-risk queries | Implemented; unverified. `met: false` |
| Hallucination tests: 0 fabricated ayah/hadith/tafsir citations | Implemented; unverified. `met: false` |
| Source registry complete with versioning and licenses | 13 records, validator-clean. `met: true` |
| Privacy review: audit logging policy reviewed and minimal retention defined | `AUDIT_RETENTION` defined (process memory, 200 records, never persisted); privacy review not performed by a person. `met: false` |
| Editorial governance: qualified reviewer/advisor assigned | Not assigned. `met: false` |

## Implementation Notes

- Keep all model keys and prompts server-side only.
- Rate-limit `/api/ai/*` endpoints (when they exist).
- Validate all references against canonical Quran database before rendering citations.
- Do not train on user private notes/questions without explicit informed permission.
- Provide user feedback/reporting flow for inaccurate or inappropriate answers (FR-066). `/report` exists; no delivery destination is configured.

---

**Last Updated:** 2026-10-23 (documentation reconciliation)
**Approved by:** TBD (governance per PRD 20)
**Applies to:** All AI/retrieval features (present and future)
**Current state:** Feature disabled; six of seven gates unmet.
