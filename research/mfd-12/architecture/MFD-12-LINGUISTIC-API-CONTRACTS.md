# MFD-12 — Linguistic Data API Contracts

| Field | Value |
|-------|-------|
| Workstream | MFD-12 (Unified FAHM Knowledge Architecture) |
| Component | WS3 — Linguistic Data Integration |
| Date | 2026-11-21 |
| Proposed By | ai-assisted (agent-96) |
| Review Status | pending-scholarly-review |
| Companion Document | MFD-12-LINGUISTIC-INTEGRATION-SPEC.md |

---

## 1. Overview

This document defines the interface contracts for services that expose Arabic linguistic data in the canonical FAHM Knowledge Architecture. All contracts are read-only query interfaces; mutation APIs are out of scope for MFD-12.

### Conventions

- All endpoints return JSON
- Arabic text is UTF-8 encoded
- Transliterations follow ISO 233-2 per MFD-11.5 §4
- Token references use the format `{surah}:{ayah}:{wordPosition}`
- Pagination uses `cursor`-based pagination with opaque cursors
- Confidence filtering is available on all list endpoints via `?minConfidence=high|medium|low`
- Alternative analyses are included by default; use `?primaryOnly=true` to exclude them

---

## 2. LexicalEntry Service

### GET /api/v1/lexical-entries/{id}

Retrieve a single LexicalEntry by ID.

**Response:**
```json
{
  "id": "lex-jhd-001",
  "lemma": {
    "arabic": "جَٰهَدَ",
    "transliteration": "jāhada",
    "searchAliases": ["jahada", "jaahada"]
  },
  "rootAnalyses": [
    {
      "root": "ج-ه-د",
      "rootTranslit": "j-h-d",
      "lexicalFamily": "striving, exertion, effort",
      "confidence": "high",
      "primary": true,
      "assertedBy": "Lane's Lexicon",
      "assertedAt": "2026-11-10T00:00:00Z",
      "source": "Lane's Lexicon, vol. 1, p. 389"
    }
  ],
  "partOfSpeech": "verb",
  "morphologicalPattern": {
    "form": "Form III",
    "template": "fāʿala"
  },
  "gloss": {
    "lexical": "striving, exertion",
    "contextualSenses": [
      {"sense": "spiritual striving", "verses": ["29:69", "25:52"], "confidence": "high"},
      {"sense": "armed struggle", "verses": ["9:41", "9:44"], "confidence": "high"}
    ],
    "tafsirNote": "Classical exegetes distinguish greater/lesser jihad; this distinction is hadith-derived, not explicit in Qur'anic text",
    "editorialGloss": "Comprehensive striving in Allah's cause"
  },
  "provenance": {
    "assertedBy": "automated-morphology-review",
    "assertedAt": "2026-11-10T00:00:00Z",
    "methodology": "deterministic-validation",
    "reviewState": "auto-accepted"
  },
  "confidence": "high",
  "verifiedOccurrenceCount": 41
}
```

### GET /api/v1/lexical-entries

List LexicalEntries with filtering.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `root` | string | Filter by root (Arabic script, e.g., "جهد") |
| `lemma` | string | Filter by lemma (Arabic or transliteration) |
| `pos` | enum | noun / verb / adjective / particle / phrase |
| `minConfidence` | enum | high / medium / low |
| `hasGloss` | boolean | Filter for entries with structured gloss data |
| `cursor` | string | Pagination cursor |
| `limit` | integer | Page size (1–100, default 25) |

---

## 3. RootAnalysis Service

### GET /api/v1/roots/{root}

Retrieve root metadata and all associated lexical entries.

**Response:**
```json
{
  "root": "ج-ه-د",
  "rootTranslit": "j-h-d",
  "lexicalFamily": "striving, exertion, effort",
  "totalOccurrences": 41,
  "distinctAyat": 36,
  "lemmas": ["جَهْد", "جَٰهَدَ", "جُهْد", "جِهَاد", "مُجَٰهِدِين"],
  "lexicalEntries": ["lex-jhd-001", "lex-jhd-002", "lex-jhd-003", "lex-jhd-004", "lex-jhd-005"],
  "status": "activated",
  "reviewState": "auto-accepted",
  "assertedAt": "2026-11-10T00:00:00Z"
}
```

### GET /api/v1/roots/{root}/alternative-analyses

Retrieve competing root analyses for disputed roots.

**Response:**
```json
{
  "root": "ل-م-ن",
  "analyses": [
    {
      "root": "ن-ف-ق",
      "confidence": "high",
      "assertedBy": "Lane's Lexicon",
      "primary": true,
      "rationale": "Classical consensus for al-munafiqeen",
      "affectedEntries": ["lex-nfq-003"]
    },
    {
      "root": "ل-م-ن",
      "confidence": "low",
      "assertedBy": "automated-morphology-review",
      "primary": false,
      "rationale": "Erroneous assignment from Sprint 48; flagged by WS2 audit",
      "affectedEntries": ["lex-nfq-003"],
      "reviewState": "retracted",
      "supersededBy": "analysis-nfq-primary"
    }
  ]
}
```

---

## 4. MorphologicalAnalysis Service

### GET /api/v1/morphology/{tokenRef}

Retrieve morphological analysis for a specific token.

**Path Parameter:** `tokenRef` in format `{surah}:{ayah}:{wordPosition}`

**Response:**
```json
{
  "tokenReference": "9:41:4",
  "matchedToken": "وَجَـٰهِدُوا۟",
  "analyses": [
    {
      "matchedLemma": "جَٰهَدَ",
      "matchedRoot": "جهد",
      "form": "Form III",
      "pattern": "fāʿala",
      "pos": "verb",
      "prefixes": ["wa-"],
      "suffixes": [],
      "confidence": "high",
      "primary": true,
      "assertedBy": "automated-morphology-review",
      "assertedAt": "2026-11-10T00:00:00Z"
    }
  ]
}
```

### GET /api/v1/morphology/by-root/{root}

Retrieve all morphological analyses for occurrences of a root.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `lemma` | string | Filter by specific lemma |
| `form` | string | Filter by verb form or noun pattern |
| `minConfidence` | enum | Confidence threshold |
| `primaryOnly` | boolean | Exclude alternative analyses |
| `cursor` | string | Pagination cursor |
| `limit` | integer | Page size (1–100, default 25) |

---

## 5. Search Service

### GET /api/v1/search/linguistic

Full-text and structured search across linguistic entities.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (Arabic, transliteration, or English gloss) |
| `entityType` | enum | lexicalEntry / root / lemma / occurrence |
| `root` | string | Restrict to specific root |
| `pos` | enum | Part of speech filter |
| `minConfidence` | enum | Confidence threshold |
| `includeRetracted` | boolean | Include retracted analyses (default false) |
| `cursor` | string | Pagination cursor |
| `limit` | integer | Page size (1–100, default 25) |

**Response:**
```json
{
  "results": [
    {
      "entityType": "lexicalEntry",
      "id": "lex-jhd-001",
      "score": 0.95,
      "highlight": {
        "gloss.lexical": "<em>striving</em>, exertion",
        "lemma.arabic": "جَٰهَدَ"
      }
    }
  ],
  "totalHits": 42,
  "nextCursor": "eyJpZCI6ImxleC1qaGQtMDQyIn0="
}
```

---

## 6. Occurrence Verification Service

### GET /api/v1/verify/occurrence/{tokenRef}

Verify that a token reference resolves to a valid corpus token and return its linguistic metadata.

**Response:**
```json
{
  "tokenReference": "2:282:123",
  "valid": true,
  "corpusText": "وَيُعَلِّمُكُمُ",
  "surah": 2,
  "ayah": 282,
  "wordPosition": 123,
  "lexicalEntries": ["lex-ilm-007"],
  "morphologicalAnalyses": [
    {
      "matchedLemma": "عَلَّمَ",
      "matchedRoot": "علم",
      "form": "Form II",
      "confidence": "high",
      "primary": true
    }
  ]
}
```

### POST /api/v1/verify/batch

Batch verification of multiple token references.

**Request Body:**
```json
{
  "tokenReferences": ["2:282:123", "9:41:4", "3:142:10"]
}
```

**Response:** Array of verification results (same schema as single verify).

---

## 7. Provenance Service

### GET /api/v1/provenance/{entityType}/{id}

Retrieve full provenance chain for any linguistic entity.

**Response:**
```json
{
  "entityType": "lexicalEntry",
  "entityId": "lex-jhd-001",
  "provenanceChain": [
    {
      "assertion": "root-assignment",
      "assertedBy": "automated-morphology-review",
      "assertedAt": "2026-11-10T00:00:00Z",
      "methodology": "deterministic-validation",
      "reviewState": "auto-accepted",
      "source": "Sprint 48 automated morphology review"
    },
    {
      "assertion": "gloss-authoring",
      "assertedBy": "fahm-editorial",
      "assertedAt": "2026-11-20T18:36:39Z",
      "methodology": "four-layer-gloss-rubric",
      "reviewState": "pending-scholarly-review"
    }
  ]
}
```

---

## 8. Error Responses

All error responses follow this schema:

```json
{
  "error": {
    "code": "TOKEN_NOT_FOUND",
    "message": "Token reference 99:1:1 does not resolve to a valid corpus token",
    "details": {
      "tokenReference": "99:1:1",
      "maxSurah": 114
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `TOKEN_NOT_FOUND` | 404 | Token reference does not resolve |
| `ENTITY_NOT_FOUND` | 404 | Requested entity ID does not exist |
| `INVALID_CONFIDENCE` | 400 | Invalid confidence filter value |
| `INVALID_CURSOR` | 400 | Malformed or expired pagination cursor |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 9. Versioning

API version is embedded in the URL path (`/api/v1/`). Breaking changes require a new major version. Additive changes (new fields, new endpoints) do not require version bumps.

Clients should check the `X-API-Version` response header for the current server version.

---

*This specification is a proposal awaiting scholarly review. No production services implement these contracts yet.*
*proposedBy: "ai-assisted (agent-96)" | reviewStatus: "pending-scholarly-review"*
