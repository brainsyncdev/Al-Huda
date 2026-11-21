# MFD-12 — Retrieval Interface Contracts for AI Integration

| Field | Value |
|-------|-------|
| Workstream | WS6 (AI & Retrieval Integration) |
| Programme | MFD-12 (Unified FAHM Knowledge Architecture) |
| Date | 2026-11-21 |
| Status | draft-specification |
| Depends On | MFD-12-AI-ARCHITECTURE.md, MFD-12-LINGUISTIC-API-CONTRACTS.md, MFD-12-SOURCE-REGISTRY-SPEC.md, MFD-12-SEARCH-SPEC.md, evidence-link.schema.json |
| Scope | RESEARCH ONLY — no modifications to src/, data/, or production files |

---

## 1. Overview

This document defines the interface contracts for all retrieval modules consumed by the AI orchestration layer specified in `MFD-12-AI-ARCHITECTURE.md`. Each module is a **read-only query interface** that returns provenance-tagged results. The AI layer treats every module as an untrusted data source: outputs are validated before inclusion in any generated response.

### Design Principles
1. **Uniform Provenance:** Every module returns source metadata conforming to `MFD-12-SOURCE-REGISTRY-SPEC.md`.
2. **Rights-Aware Filtering:** Modules accept a `rightsFilter` parameter; AI always passes `exclude: ["rights-disputed"]` at minimum.
3. **No Side Effects:** All interfaces are GET/query operations. No module accepts mutation requests from the AI layer.
4. **Deterministic Pagination:** Cursor-based pagination with opaque cursors per `MFD-12-LINGUISTIC-API-CONTRACTS.md` §1.
5. **Schema Conformance:** All inputs/outputs validate against JSON Schema 2020-12.
6. **Alignment with Search Modes:** Module selection maps to the five explicit search modes defined in `MFD-12-SEARCH-SPEC.md`.

---

## 2. Common Types

These types are shared across all retrieval modules.

### 2.1 SourceReference
```jsonc
{
  "sourceId": "string (matches mfd-12/source-record pattern)",
  "editionId": "string | null",
  "rightsStatus": "public-domain | cc-by-4.0 | cc-by-sa-4.0 | cc-by-nc-4.0 | proprietary-restricted | rights-unverified | rights-disputed",
  "clearanceLevel": "cleared | pending-review | restricted | unavailable",
  "displayConstraints": {
    "inAppText": "boolean",
    "exportAllowed": "boolean",
    "excerptMaxLength": "integer | null",
    "linkOutOnly": "boolean"
  }
}
```

### 2.2 EvidenceLink (extends evidence-link.schema.json)
```jsonc
{
  "key": "string (surah:ayah)",
  "excerpt": "string (verbatim Arabic from pinned corpus)",
  "evidenceClass": "EXPLICIT_TEXT | THEMATIC | CONTEXTUAL",
  "rationale": "string",
  "supportLevel": "FULLY_SUPPORTS | PARTIALLY_SUPPORTS | DOES_NOT_SUPPORT",
  "validationStatus": "verified | pending-review | failed-validation",
  "sourceReferences": ["SourceReference[]"]
}
```

### 2.3 RightsFilter
```jsonc
{
  "include": ["rightsStatus values to allow"],
  "exclude": ["rightsStatus values to block"],
  "minimumClearance": "cleared | pending-review | restricted | unavailable"
}
```
Default for AI queries: `{ "exclude": ["rights-disputed"], "minimumClearance": "pending-review" }`.

### 2.4 TokenReference
Format: `{surah}:{ayah}:{wordPosition}` (1-based). Per `MFD-12-LINGUISTIC-API-CONTRACTS.md` §1.

### 2.5 ConfidenceLevel
Enum: `high | medium | low | disputed | undetermined`.
Per `MFD-11.5-TERMINOLOGY-SPECIFICATION.md` §6 and `MFD-12-AI-ARCHITECTURE.md` §6.1.

---

## 3. Module: quran-source

**Purpose:** Retrieve canonical Qur'anic text, translations, transliterations, and structural metadata for specific verse references.

**Aligns with Search Mode:** EXACT (§2.1 Search Spec).

### 3.1 Query: getVerse

**Input:**
```jsonc
{
  "reference": "string (surah:ayah, e.g., '2:255')",
  "includeTranslation": "boolean (default true)",
  "includeTransliteration": "boolean (default false)",
  "translationEditions": ["string[] (edition IDs from source registry, max 4)"],
  "rightsFilter": "RightsFilter"
}
```

**Output:**
```jsonc
{
  "reference": "2:255",
  "arabicText": "string (Uthmani, verbatim from quran-json@3.1.2)",
  "translations": [
    {
      "editionId": "ed-en-sahih",
      "text": "string",
      "source": "SourceReference"
    }
  ],
  "transliteration": "string | null",
  "structuralContext": {
    "surah": 2,
    "ayah": 255,
    "juz": 3,
    "hizb": 5,
    "page": 42,
    "revelationType": "medinan",
    "ruku": 36,
    "manzil": 1,
    "isSajda": false
  },
  "provenance": {
    "corpusVersion": "quran-json@3.1.2",
    "retrievedAt": "ISO8601 UTC"
  }
}
```

**Validation Rules:**
- `reference` must resolve to a valid surah:ayah (1-114, 1-maxAyah).
- `arabicText` is immutable; retrieved directly from vendored corpus.
- Translation editions filtered through `rightsFilter`. Editions with `rights-disputed` or `linkOutOnly: true` return metadata only, not text.

### 3.2 Query: getVerseRange

**Input:**
```jsonc
{
  "startReference": "string (surah:ayah)",
  "endReference": "string (surah:ayah)",
  "maxVerses": "integer (default 50, max 100)",
  "includeTranslation": "boolean",
  "translationEditions": ["string[]"],
  "rightsFilter": "RightsFilter"
}
```

**Output:** Array of `getVerse` results, ordered by mushaf sequence.

### 3.3 Query: searchExact

**Input:**
```jsonc
{
  "query": "string (Arabic substring, English phrase, or reference)",
  "matchType": "arabic | translation | transliteration | reference",
  "surahFilter": ["integer[] | null"],
  "juzFilter": ["integer[] | null"],
  "revelationType": "meccan | medinan | null",
  "limit": "integer (1-100, default 20)",
  "cursor": "string | null"
}
```

**Output:**
```jsonc
{
  "results": [
    {
      "reference": "string",
      "matchReason": "reference | arabic-whole | translation-whole | arabic-substring | translation-substring | transliteration",
      "snippet": "string (with <em> highlights)",
      "score": "number"
    }
  ],
  "totalHits": "integer",
  "nextCursor": "string | null"
}
```
Ranking follows `MFD-12-SEARCH-SPEC.md` §2.1 exactly.

---

## 4. Module: lexical

**Purpose:** Retrieve root, lemma, and morphological family data from the verified terminology index.

**Aligns with Search Mode:** LINGUISTIC (§2.2 Search Spec).

**Depends On:** `MFD-12-LINGUISTIC-API-CONTRACTS.md` LexicalEntry Service.

### 4.1 Query: getLexicalEntry

**Input:**
```jsonc
{
  "entryId": "string (e.g., 'lex-jhd-001')",
  "includeAlternativeAnalyses": "boolean (default true)",
  "minConfidence": "ConfidenceLevel (default 'low')"
}
```

**Output:** Conforms to `GET /api/v1/lexical-entries/{id}` response schema in `MFD-12-LINGUISTIC-API-CONTRACTS.md` §2, augmented with:
```jsonc
{
  "...lexicalEntryFields": "...",
  "aiConsumptionNote": {
    "glossLayersSeparated": true,
    "editorialGlossIsNotScholarly": true,
    "tafsirNoteIsInterpretive": true
  }
}
```

**Validation Rules:**
- Entry must exist in verified terminology index.
- `morphConfidence` propagated from source.
- Four gloss layers (lexical, contextual, tafsir, editorial) returned distinctly per `MFD-11.5-TERMINOLOGY-SPECIFICATION.md` §5.
- AI must never conflate `editorialGloss` with `tafsirNote`.

### 4.2 Query: searchByRoot

**Input:**
```jsonc
{
  "root": "string (Arabic triliteral/quadriliteral, e.g., 'جهد' or 'j-h-d')",
  "includeOccurrences": "boolean (default true)",
  "minConfidence": "ConfidenceLevel",
  "limit": "integer (1-100, default 25)",
  "cursor": "string | null"
}
```

**Output:**
```jsonc
{
  "root": "ج-ه-د",
  "rootTranslit": "j-h-d",
  "lexicalFamily": "striving, exertion, effort",
  "totalOccurrences": 41,
  "distinctAyat": 36,
  "lemmas": [
    {
      "lemma": "جَٰهَدَ",
      "form": "Form III",
      "pos": "verb",
      "occurrenceCount": 12,
      "confidence": "high",
      "entryId": "lex-jhd-001"
    }
  ],
  "rootDisputed": "boolean",
  "alternativeRoots": ["string[] | null"],
  "source": "SourceReference (data/root-occurrences/*.json)"
}
```

### 4.3 Query: searchByPattern

**Input:**
```jsonc
{
  "pattern": "string (e.g., 'fāʿala', 'mafʿūl')",
  "formFilter": "string | null (e.g., 'Form III')",
  "posFilter": "noun | verb | adjective | participle | null",
  "limit": "integer (1-100)",
  "cursor": "string | null"
}
```

**Output:** List of matching lexical entries with pattern match highlighted.

---

## 5. Module: morphology

**Purpose:** Retrieve token-level morphological analysis for specific word positions in the corpus.

**Aligns with Search Mode:** LINGUISTIC (§2.2 Search Spec).

**Depends On:** `MFD-12-LINGUISTIC-API-CONTRACTS.md` MorphologicalAnalysis Service.

### 5.1 Query: analyzeToken

**Input:**
```jsonc
{
  "tokenReference": "TokenReference (e.g., '9:41:4')",
  "primaryOnly": "boolean (default false)"
}
```

**Output:** Conforms to `GET /api/v1/morphology/{tokenRef}` in `MFD-12-LINGUISTIC-API-CONTRACTS.md` §4.

**Validation Rules:**
- Token must be verified against `quran-json@3.1.2` via Occurrence Verification Service.
- If `confidence` is `low` or `disputed`, AI must surface uncertainty badge.

### 5.2 Query: batchAnalyzeTokens

**Input:**
```jsonc
{
  "tokenReferences": ["TokenReference[] (max 50)"],
  "primaryOnly": "boolean (default false)"
}
```

**Output:** Array of `analyzeToken` results.

### 5.3 Query: getParadigmTable

**Input:**
```jsonc
{
  "root": "string",
  "lemma": "string | null",
  "formFilter": "string | null"
}
```

**Output:**
```jsonc
{
  "root": "string",
  "paradigm": [
    {
      "form": "string",
      "pattern": "string",
      "pos": "string",
      "lemma": "string",
      "occurrenceCount": "integer",
      "confidence": "ConfidenceLevel"
    }
  ]
}
```
Used for EXPLORE experience concept cards and RESEARCH paradigm display.

---

## 6. Module: tafsir

**Purpose:** Retrieve classical exegetical commentary for specific verses.

**Aligns with Search Mode:** EVIDENCE (§2.4 Search Spec).

### 6.1 Query: getTafsirExcerpt

**Input:**
```jsonc
{
  "reference": "string (surah:ayah)",
  "editionIds": ["string[] (e.g., ['ed-ar-jalalayn', 'ed-ar-muyassar'])"],
  "rightsFilter": "RightsFilter"
}
```

**Output:**
```jsonc
{
  "reference": "2:255",
  "excerpts": [
    {
      "editionId": "ed-ar-jalalayn",
      "workTitle": "Tafsir al-Jalalayn",
      "author": "Jalal al-Din al-Mahalli & Jalal al-Din al-Suyuti",
      "period": "15th century CE",
      "language": "ar",
      "text": "string (verbatim excerpt)",
      "locator": {
        "locatorType": "ayah-range",
        "locator": { "surah": 2, "ayahStart": 255, "ayahEnd": 255 }
      },
      "source": "SourceReference",
      "displayMode": "in-app-text | link-out-only",
      "isInterpretive": true
    }
  ],
  "availabilityRecord": {
    "bundled": false,
    "displayMode": "in-app-text-plus-external-links",
    "readableEditions": ["string[]"],
    "linkMethodWorks": true
  }
}
```

**Validation Rules:**
- Only editions with `clearanceLevel` ≥ `pending-review` returned as text; `rights-disputed` returns metadata + external link only.
- Per `DATA-PROVENANCE.md`: Jalalayn and Muyassar available in-app via Tanzil proxy; Ibn Kathir and Ma'arif are link-out only.
- `isInterpretive: true` ALWAYS set. AI must label these as "Exegetical Interpretation" per `MFD-12-APPLICATION-ARCHITECTURE.md` §2.A.
- AI must never present tafsir text as Qur'anic fact.

### 6.2 Query: searchTafsir

**Input:**
```jsonc
{
  "query": "string (Arabic substring)",
  "editionIds": ["string[]"],
  "limit": "integer (1-50)",
  "cursor": "string | null",
  "rightsFilter": "RightsFilter"
}
```

**Output:**
```jsonc
{
  "results": [
    {
      "editionId": "string",
      "reference": "string (surah:ayah)",
      "snippet": "string (with <em> highlights, literal substring match)",
      "source": "SourceReference"
    }
  ],
  "totalHits": "integer",
  "nextCursor": "string | null"
}
```
Matching: literal substring after Arabic normalization per `DATA-PROVENANCE.md` FR-035 implementation.

### 6.3 Query: compareTafsir

**Input:**
```jsonc
{
  "reference": "string (surah:ayah)",
  "editionIds": ["string[] (2-4 editions)"]
}
```

**Output:** Array of `getTafsirExcerpt` results aligned by reference, enabling side-by-side comparison per `MFD-12-APPLICATION-ARCHITECTURE.md` §2.C.

---

## 7. Module: knowledge-graph

**Purpose:** Retrieve concept relationships, domain/dimension hierarchies, and thematic connections from the canonical taxonomy.

**Aligns with Search Mode:** CONCEPTUAL (§2.3 Search Spec).

**Depends On:** `MFD-12-KNOWLEDGE-GRAPH-SPEC.md`, `MFD-12-GRAPH-INTEGRITY-RULES.md`.

### 7.1 Query: getNode

**Input:**
```jsonc
{
  "nodeId": "string (topic/domain/dimension ID)",
  "includeEdges": "boolean (default true)",
  "depth": "integer (1-3, default 1)"
}
```

**Output:**
```jsonc
{
  "nodeId": "topic-jihad",
  "nodeType": "topic | dimension | domain",
  "title": "Jihad",
  "arabicTitle": "جهاد",
  "description": "string",
  "reviewStatus": "verified | proposed | dissolved",
  "provenanceTag": "QURANIC-EXPLICIT | HADITH-DERIVED | EDITORIAL | CULTURAL",
  "edges": [
    {
      "targetNodeId": "topic-sabr",
      "relationshipType": "co-occurs-with | derives-from | contrasted-by | subsumed-under",
      "weight": "number (0-1)",
      "evidenceReferences": ["string[] (surah:ayah)"],
      "provenanceTag": "string",
      "confidence": "ConfidenceLevel"
    }
  ],
  "redistributionNotice": "string | null (for dissolved domains per MFD-11.3-B)"
}
```

**Validation Rules:**
- Dissolved domains (e.g., Arts & Beauty per `MFD-12-APPLICATION-ARCHITECTURE.md` §4 decision 2) return `reviewStatus: "dissolved"` with `redistributionNotice` linking to new canonical homes.
- Empty/unmapped dimensions marked `reviewStatus: "proposed"` not `"verified"`.
- AI must never infer edges not present in the graph.

### 7.2 Query: traversePath

**Input:**
```jsonc
{
  "startNodeId": "string",
  "relationshipTypes": ["string[] | null (filter edge types)"],
  "maxDepth": "integer (1-5, default 3)",
  "maxNodes": "integer (1-100, default 20)"
}
```

**Output:**
```jsonc
{
  "path": [
    {
      "nodeId": "string",
      "title": "string",
      "depth": "integer",
      "edgeFromParent": "Edge object"
    }
  ],
  "truncated": "boolean (if maxNodes reached)"
}
```

### 7.3 Query: searchConceptual

**Input:**
```jsonc
{
  "query": "string (concept name, topic title, alias)",
  "searchAliases": "boolean (default true, searches arabicTitles, urduTitles, descriptions, searchAliases)",
  "domainFilter": ["string[] | null"],
  "limit": "integer (1-50)"
}
```

**Output:**
```jsonc
{
  "results": [
    {
      "nodeId": "string",
      "title": "string",
      "matchField": "title | arabicTitle | description | searchAlias",
      "provenanceTag": "string",
      "reviewStatus": "string"
    }
  ],
  "matchNote": "Curated theme match — editorial mapping, not lexical or semantic similarity."
}
```
Per `MFD-12-SEARCH-SPEC.md` §2.3: NOT embedding-based. Uses structured editorial metadata only.

---

## 8. Module: evidence

**Purpose:** Resolve, validate, and retrieve evidence links conforming to `evidence-link.schema.json`.

**Aligns with Search Mode:** EVIDENCE (§2.4 Search Spec).

### 8.1 Query: resolveEvidenceLink

**Input:**
```jsonc
{
  "key": "string (surah:ayah)",
  "evidenceClass": "EXPLICIT_TEXT | THEMATIC | CONTEXTUAL | null (all)",
  "rightsFilter": "RightsFilter"
}
```

**Output:**
```jsonc
{
  "key": "2:255",
  "excerpt": "string (verbatim Arabic, mechanically checked against corpus)",
  "evidenceClass": "EXPLICIT_TEXT",
  "rationale": "string",
  "supportLevel": "FULLY_SUPPORTS | PARTIALLY_SUPPORTS | DOES_NOT_SUPPORT",
  "validationStatus": "verified | pending-review | failed-validation",
  "sourceReferences": ["SourceReference[]"],
  "corpusMatch": {
    "verified": true,
    "corpusVersion": "quran-json@3.1.2",
    "wordPositions": ["integer[]"]
  }
}
```

**Validation Rules:**
- `key` pattern: `^[0-9]{1,3}:[0-9]{1,3}$` per evidence-link.schema.json.
- `excerpt` MUST be a verbatim substring of the corpus Arabic text for this key. Mechanically checked.
- `evidenceClass` semantics per schema: EXPLICIT_TEXT = terms appear in verse; THEMATIC = meaningful thematic relationship; CONTEXTUAL = passage context. Never conflated with scholarly approval.
- AI must never generate new evidence links. It can only retrieve and cite existing ones.

### 8.2 Query: validateClaimEvidence

**Input:**
```jsonc
{
  "claimText": "string (the AI-generated claim)",
  "evidenceLinks": [
    {
      "key": "string",
      "evidenceClass": "string",
      "supportLevel": "string"
    }
  ]
}
```

**Output:**
```jsonc
{
  "validationResult": "pass | fail | partial",
  "details": [
    {
      "evidenceKey": "string",
      "status": "confirmed | mismatch | insufficient",
      "reason": "string"
    }
  ],
  "overallSupport": "FULLY_SUPPORTS | PARTIALLY_SUPPORTS | DOES_NOT_SUPPORT | UNVERIFIABLE"
}
```
This is the blocking validator at Step 6 of the AI Orchestration Flow (`MFD-12-AI-ARCHITECTURE.md` §3).

### 8.3 Query: getEvidenceForTopic

**Input:**
```jsonc
{
  "topicId": "string",
  "evidenceClassFilter": ["EXPLICIT_TEXT | THEMATIC | CONTEXTUAL"],
  "limit": "integer (1-100)",
  "cursor": "string | null"
}
```

**Output:** Array of resolved evidence links associated with a canonical topic.

---

## 9. Source Filtering Rules (Cross-Cutting)

All modules enforce these filtering rules before returning data to the AI layer:

### 9.1 Clearance-Based Filtering

| clearanceLevel | AI May Retrieve? | AI May Cite? | Display Constraint |
|----------------|------------------|--------------|--------------------|
| cleared | ✅ Yes | ✅ Yes | Full text with attribution |
| pending-review | ✅ Yes | ⚠️ With disclaimer | Text + "Pending scholarly review" badge |
| restricted | ⚠️ Metadata only | ❌ No | Link-out only, no excerpt |
| unavailable | ❌ No | ❌ No | Not returned; logged as gap |

### 9.2 RIGHTS_RESTRICTED Handling
Per `MFD-12-SOURCE-REGISTRY-SPEC.md` §5.4 impact matrix:
- `proprietary-restricted`: Excerpt limited to `excerptMaxLength` characters. AI may summarize but must not reproduce full text.
- `rights-unverified`: Default safe behavior is link-out only. AI cannot use content as evidence.
- `rights-disputed`: Completely blocked. Module returns empty result with reason code.

### 9.3 UNAVAILABLE Evidence Flagging
When requested evidence cannot be retrieved:
```jsonc
{
  "key": "requested-reference",
  "status": "unavailable",
  "reason": "source-not-cleared | edition-missing | network-error | corpus-mismatch",
  "fallbackAction": "omit-claim | reduce-confidence | trigger-refusal"
}
```
If >50% of required evidence for a claim is UNAVAILABLE, the claim validator triggers refusal per `MFD-12-AI-ARCHITECTURE.md` §6.2.

---

## 10. AI-to-Module Interaction Protocol

### 10.1 Request Envelope
Every AI retrieval request includes:
```jsonc
{
  "requestId": "uuid-v4",
  "sessionId": "string (local-only, ephemeral)",
  "timestamp": "ISO8601 UTC",
  "aiModelIdentifier": "string",
  "userOptInConfirmed": true,
  "rightsFilter": "RightsFilter",
  "moduleQuery": "module-specific payload"
}
```

### 10.2 Response Envelope
Every module response includes:
```jsonc
{
  "requestId": "uuid-v4 (echoed)",
  "moduleId": "quran-source | lexical | morphology | tafsir | knowledge-graph | evidence",
  "processedAt": "ISO8601 UTC",
  "latencyMs": "integer",
  "itemsReturned": "integer",
  "itemsFiltered": "integer (count removed by rights filter)",
  "warnings": ["string[] (e.g., '3 sources excluded due to rights-disputed')"],
  "data": "module-specific output"
}
```

### 10.3 Error Handling
Modules return structured errors per `MFD-12-LINGUISTIC-API-CONTRACTS.md` §8. Additional AI-specific error codes:

| Code | Description | AI Action |
|------|-------------|-----------|
| `RIGHTS_BLOCKED` | All matching sources have disputed/restricted rights | Trigger refusal (RIGHTS_RESTRICTED) |
| `EVIDENCE_MISMATCH` | Excerpt does not match corpus | Reject evidence link; do not cite |
| `CORPUS_VERSION_SKEW` | Data from unpinned corpus version | Reject entire response |
| `MODULE_UNAVAILABLE` | Retrieval service offline | Graceful degradation; note in limitations |

---

## 11. Performance Requirements

| Module | Max Latency (Local Cache) | Max Latency (First Fetch) | Timeout |
|--------|--------------------------|--------------------------|---------|
| quran-source | < 50ms | < 200ms | 2s |
| lexical | < 100ms | < 500ms | 3s |
| morphology | < 80ms | < 400ms | 3s |
| tafsir | < 150ms | < 2s (proxy fetch) | 5s |
| knowledge-graph | < 100ms | < 800ms | 3s |
| evidence | < 120ms | < 600ms | 3s |

Timeouts trigger `MODULE_UNAVAILABLE` error. AI proceeds with partial results and notes gaps in limitations metadata.

---

## 12. Relationship to Existing Infrastructure

| Existing Asset | Consumed By Module |
|---------------|-------------------|
| `quran-json@3.1.2` vendored package | quran-source |
| `data/root-occurrences/*.json` (1,576 files) | lexical, morphology |
| `MFD-12-LINGUISTIC-API-CONTRACTS.md` endpoints | lexical, morphology |
| `MFD-12-SOURCE-REGISTRY-SPEC.md` schema | All modules (SourceReference) |
| Tanzil proxy (`/api/translations/[id]`) | quran-source (translations), tafsir |
| `/api/v1/search/tafsir` | tafsir (searchTafsir) |
| `evidence-link.schema.json` | evidence |
| Canonical taxonomy (domains/dimensions/topics) | knowledge-graph |
| `public/embeddings/quran-minilm.bin` | Deferred (semantic mode post-MFD-12) |

---

*This specification defines the retrieval contracts for MFD-12 AI integration. All modules are read-only. Implementation must satisfy rights-filtering rules (§9) and performance requirements (§11) before AI features may proceed past Phase 0.*
