# MFD-12 — AI & Retrieval Integration Architecture

| Field | Value |
|-------|-------|
| Workstream | WS6 (AI & Retrieval Integration) |
| Programme | MFD-12 (Unified FAHM Knowledge Architecture) |
| Date | 2026-11-21 |
| Status | draft-specification |
| Depends On | MFD-12-APPLICATION-ARCHITECTURE.md, MFD-12-SEARCH-SPEC.md, MFD-11.5 Terminology Spec, evidence-link.schema.json, DATA-PROVENANCE.md |
| Scope | RESEARCH ONLY — no modifications to src/, data/, or production files |

---

## 1. Executive Summary

This specification defines the architectural boundaries, orchestration flow, and safety constraints for AI-assisted features within the Quran Al Huda application. AI is positioned strictly as an **untrusted analytical assistant** with **read-only access** to canonical sources and scholarly records. It operates under the principle of **epistemic transparency**: every AI-generated output carries explicit provenance, uncertainty markers, and limitations.

Public-facing AI religious answers remain **DISABLED** until separate scholarly and governance approval is granted. This spec enables only private, local-first AI assistance within the RESEARCH experience, gated behind explicit user opt-in and clear disclaimers.

### Core Principles
1.  **Textual Primacy Preservation:** AI never modifies, overrides, or reinterprets the verified Uthmani Arabic text (`quran-json@3.1.2`) or canonical taxonomy.
2.  **Epistemic Humility:** AI outputs are always labeled as model-generated, carry confidence/uncertainty indicators, and explicitly state limitations.
3.  **Evidence-Bound Generation:** Every AI claim must link to retrievable evidence conforming to `evidence-link.schema.json`. No unsupported assertions.
4.  **Local-First Sovereignty:** AI processing occurs on-device where possible; cloud processing requires explicit opt-in. User queries and AI responses are never logged server-side by default.
5.  **Scholarly Non-Automation:** AI cannot approve claims, create verified tafsir evidence, convert editorial categories to established interpretations, infer fatwas, or resolve scholarly disagreement.
6.  **Rights Respect:** AI respects `RIGHTS_RESTRICTED` and `UNAVAILABLE` source statuses per DATA-PROVENANCE.md. Never presents uncleared content as verified.

---

## 2. AI Service Boundaries

### 2.1 What AI CAN Do
- Retrieve and summarize content from cleared sources (quran-json corpus, verified terminology index, cleared tafsir editions).
- Generate structured draft responses linking claims to evidence via `evidence-link` format.
- Surface polysemy, morphological relationships, and thematic connections based on indexed data.
- Express uncertainty using the defined taxonomy (§6).
- Refuse to answer when constraints are violated (§6).
- Operate within the RESEARCH experience as a private study aid.
- Function offline using locally cached/embedded models after initial hydration.

### 2.2 What AI CANNOT Do (Hard Constraints)
| Constraint | Rationale | Enforcement |
|------------|-----------|-------------|
| Modify canonical text or taxonomy | Violates textual primacy and immutability (FR-071) | Read-only data adapters; no write endpoints exposed |
| Auto-approve claims or evidence | Scholarly review is human-only | AI outputs marked `model-generated`; never promoted to `verified` |
| Create verified tafsir evidence | Tafsir requires scholarly authority | AI tafsir references limited to existing cleared editions |
| Convert editorial → established interpretation | Editorial gloss ≠ scholarly consensus | UI enforces layer separation per MFD-11.5 §5 |
| Infer fatwas or legal rulings | Outside app scope; high harm risk | Hard refusal trigger; logged as safety event |
| Hide scholarly disagreement | Violates epistemic transparency | Must surface `alternativeAnalyses` / `rootDisputed` flags |
| Present RIGHTS_RESTRICTED content as cleared | Legal/compliance violation | Source status filter pre-generation |
| Generate without evidence linkage | Hallucination prevention | Claim validator rejects unlinked statements |
| Override user-selected search mode | Respects explicit intent (§2.1 Search Spec) | Mode passed as immutable context |
| Train on user annotations/private data | Privacy/local-first sovereignty | Annotations never enter AI context |

### 2.3 Deferred Capabilities (NOOR Layer)
Per MFD-12-APPLICATION-ARCHITECTURE.md §2.D, the following are **deferred** until post-MFD-12:
- Personalized spiritual guidance
- Adaptive learning sequencing
- Community wisdom integration
- Reflective prompts

When implemented, NOOR must:
- Consume FAHM/EXPLORE/RESEARCH outputs as read-only inputs
- Carry explicit "AI-Generated / Reflective" provenance label
- Operate entirely locally or with explicit opt-in cloud processing
- Never modify canonical data or user annotations

---

## 3. AI Orchestration Flow

Per programme spec Part VIII §21, the AI response pipeline follows this deterministic sequence:

```
User Question
    ↓
[1] Intent Classifier → identifies research task type
    ↓
[2] Retrieval Module Selector → selects relevant modules per §4
    ↓
[3] Evidence Retrieval → fetches sources with status filtering
    ↓
[4] Evidence Validation → checks source/reference status, rights, availability
    ↓
[5] Draft Response Generation → AI generates structured claims + evidence links
    ↓
[6] Claim-Level Validation → verifies statement-to-source relationships
    ↓
[7] Provenance Assembly → attaches metadata per §5
    ↓
[8] Response Presentation → displays with explicit limitations + uncertainty
    ↓
[9] Logging (local-only) → records interaction per §7 privacy controls
```

### Critical Invariants
- Steps 4 and 6 are **blocking validators**: failure halts generation and triggers refusal.
- Step 5 produces **structured output** conforming to response schema (§5), not free text.
- Step 8 **always** displays limitations banner; cannot be dismissed or hidden.
- No step modifies canonical data, user annotations, or scholarly records.

---

## 4. Retrieval Interfaces

Detailed contracts specified in `MFD-12-RETRIEVAL-CONTRACTS.md`. Summary:

| Module | Purpose | Key Input | Key Output | Source Filter |
|--------|---------|-----------|------------|---------------|
| quran-source | Canonical text lookup | surah:ayah reference | Arabic text, translation, transliteration | Always cleared (quran-json) |
| lexical | Root/lemma/pattern search | root, lemma, pattern | Morphological data, occurrences | Verified terminology index only |
| morphology | Form/POS/pattern analysis | lemma or form ID | Paradigm table, confidence badge | MFD-11.5 compliant entries |
| tafsir | Classical exegesis retrieval | ayah key + edition | Excerpt, edition metadata | Cleared editions only (Jalalayn, Muyassar) |
| knowledge-graph | Concept relationship traversal | topic/domain ID | Related nodes, edge provenance | Canonical taxonomy only |
| evidence | Evidence link resolution | evidence-link key | Full evidence record + status | Respects RIGHTS_RESTRICTED/UNAVAILABLE |

All modules return **provenance-tagged** results. AI layer consumes these as read-only inputs.

---

## 5. Response Provenance Schema

Every AI-generated response MUST include this metadata block:

```json
{
  "responseType": "ai-generated",
  "generationTimestamp": "ISO8601 UTC",
  "modelIdentifier": "string (e.g., 'local-qwen-4b-fahm-v1')",
  "retrievalSources": [
    {
      "moduleId": "quran-source|lexical|tafsir|...",
      "sourceId": "string (e.g., 'quran-json@3.1.2', 'ar.jalalayn')",
      "status": "cleared|rights-restricted|unavailable|pending-review",
      "itemsRetrieved": "number"
    }
  ],
  "claims": [
    {
      "claimId": "c1",
      "text": "string",
      "evidenceLinks": ["evidence-link-key-1", "..."],
      "supportLevel": "fully-supports|partially-supports|does-not-support",
      "uncertaintyLevel": "high-confidence|medium-confidence|low-confidence|disputed|undetermined"
    }
  ],
  "overallUncertainty": "high|medium|low|refused",
  "limitations": ["string array of explicit limitations"],
  "refusalReason": "null or refusal taxonomy code (§6)"
}
```

### Display Requirements
- `responseType` rendered as persistent banner: "AI-Generated Analysis — Not Scholarly Verification"
- Each claim displays inline citation badge linking to evidence
- `partially-supports` shown with ⚠️ icon + tooltip explaining gap
- `does-not-support` shown with ❌ icon + explanation (rare; usually triggers refusal)
- `limitations` displayed in collapsible section below response
- `refusalReason` triggers full refusal UI (§6)

---

## 6. Uncertainty and Refusal Behaviour

### 6.1 Uncertainty Taxonomy
| Level | Definition | Display |
|-------|------------|----------|
| high-confidence | Multiple cleared sources fully support claim; no dispute | Green badge |
| medium-confidence | Single cleared source OR partial support across sources | Yellow badge |
| low-confidence | Evidence exists but is disputed, context-dependent, or from pending-review source | Orange badge + disclaimer |
| disputed | Active scholarly disagreement documented in alternativeAnalyses | Red badge + "Scholarly Disagreement" link |
| undetermined | Insufficient evidence; AI cannot assess | Grey badge + "Insufficient Evidence" note |

### 6.2 Refusal Triggers (Mandatory)
AI MUST refuse and return structured refusal when:
1. Query requests fatwa, legal ruling, or personal religious guidance
2. All relevant evidence is `RIGHTS_RESTRICTED` or `UNAVAILABLE`
3. Claim validation fails >3 times consecutively (hallucination guard)
4. Query attempts to modify canonical data or override scholarly record
5. User has not opted in to AI features (first-use gate)
6. Local model unavailable AND cloud opt-in not granted
7. Query language/script unsupported by current model

### 6.3 Refusal Response Format
```json
{
  "responseType": "ai-refusal",
  "refusalCode": "FATWA_REQUEST|RIGHTS_RESTRICTED|HALLUCINATION_GUARD|...",
  "userMessage": "Human-readable explanation",
  "alternativeActions": ["Suggested non-AI paths (e.g., manual search, consult scholar)"],
  "loggedLocally": true
}
```

Refusals are **never** silent. User always receives explanation + alternatives.

---

## 7. Logging and Privacy Controls

### 7.1 Default: Local-Only Logging
- All AI interactions logged to device-local IndexedDB store
- Log schema: `{ timestamp, queryHash (SHA-256), responseMetadata, refusalCode?, latencyMs }`
- **Never logged**: raw query text, raw response text, user annotations, reading history
- Logs auto-expire after 90 days unless user extends

### 7.2 Cloud Logging (Opt-In Only)
- Disabled by default
- Requires explicit toggle in Settings > AI Privacy
- When enabled: anonymized telemetry only (query category, refusal codes, latency aggregates)
- Never includes PII, query content, or response content
- Revocable at any time; revocation deletes pending uploads

### 7.3 User Controls
- View/delete local logs anytime
- Export log metadata (JSON) for personal audit
- Disable AI features entirely (removes model + clears cache)
- Per-session ephemeral mode (no persistence)

---

## 8. Release Restrictions

### 8.1 Pre-Release Gates (ALL Required)
| Gate | Owner | Criteria |
|------|-------|----------|
| Scholarly Review of AI Boundaries | FAHM Scholarly Board | Signed approval of §2 constraints |
| Rights Clearance Audit | Legal/Compliance | All retrieval sources marked `cleared` or explicitly excluded |
| Hallucination Rate Benchmark | QA/WS6 | <2% unsupported claims on eval dataset (§9) |
| Refusal Coverage Test | QA/WS6 | 100% correct refusal on trigger set |
| Privacy Audit | Security/Privacy | Local-only logging verified; no leakage paths |
| Performance Baseline | Engineering | p95 latency <3s on target devices |
| Public AI Religious Answers | Executive/Scholarly | **SEPARATE APPROVAL REQUIRED** (currently DISABLED) |

### 8.2 Phased Rollout
1. **Phase 0 (Current):** Research-only spec; no implementation
2. **Phase 1:** Internal alpha with hardcoded test users; local model only
3. **Phase 2:** Closed beta with opt-in researchers; full evaluation suite
4. **Phase 3:** General availability within RESEARCH experience (private use)
5. **Phase 4 (Gated):** Public AI religious answers (requires separate approval)

### 8.3 Kill Switch
- Remote config flag to disable AI features instantly
- Local fallback: if remote config unreachable, AI disabled after 7 days without heartbeat
- User can always disable locally regardless of remote state

---

## 9. Relationship to Existing Specs

| Spec | Integration Point |
|------|-------------------|
| MFD-12-APPLICATION-ARCHITECTURE.md | AI operates within RESEARCH experience; respects NOOR deferral |
| MFD-12-SEARCH-SPEC.md | AI retrieval aligns with 5 search modes; never infers mode |
| MFD-11.5 Terminology Spec | AI uses 4-layer gloss structure; respects morphConfidence |
| evidence-link.schema.json | AI claims conform to this schema; validated pre-presentation |
| DATA-PROVENANCE.md | AI respects source status; never presents uncleared as verified |

---

## 10. Non-Goals for MFD-12 AI

- Public-facing religious Q&A
- Model fine-tuning on user data
- Cross-app AI integration
- Real-time collaborative AI sessions
- Automatic correction of canonical data
- Replacement of human scholarly review

---

*This specification defines the AI architectural contract for MFD-12. Implementation must satisfy all hard constraints (§2.2) and pass all release gates (§8.1) before deployment. Public AI religious answers remain OFF.*
