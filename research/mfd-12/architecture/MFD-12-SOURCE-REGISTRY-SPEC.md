# MFD-12 Source Registry Specification

**Status:** Design Proposal  
**Module:** WS4 — Tafsir & Evidence Integration  
**Date:** 2026-11-21  
**Supersedes:** Ad-hoc source records in `src/lib/quran/sources.ts` (MFD-11)  
**Depends on:** MFD-12-CANONICAL-DATA-MODEL, DATA-PROVENANCE.md

---

## 1. Purpose

Define a canonical, machine-readable registry for all documentary sources referenced by the FAHM Knowledge Architecture: tafsir works, hadith collections, fiqh manuals, lexicons, modern scholarship, and digital datasets. This registry is the single authority for bibliographic identity, edition disambiguation, rights status, and citation resolution.

The MFD-11 `sources.ts` file contains 13 flat records with inconsistent granularity. This specification replaces that pattern with a structured, extensible schema that supports:

- Multi-edition works (Ibn Kathir 1st ed. vs. 2nd ed. vs. English translation)
- Machine-parseable reference locators (volume:page, digital offset)
- Rights-aware display/export gating
- Append-only provenance auditing

---

## 2. Source Entity Schema

```jsonc
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "mfd-12/source-record",
  "title": "MFD-12 Canonical Source Record",
  "type": "object",
  "required": ["sourceId", "title", "sourceType", "rightsStatus", "createdAt"],
  "additionalProperties": false,
  "properties": {
    "sourceId": {
      "type": "string",
      "pattern": "^src-[a-z0-9][a-z0-9-]{2,63}$",
      "description": "Stable, unique identifier. Lowercase kebab-case. Never reused."
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "description": "Primary display title in the work's original language or established English title."
    },
    "arabicTitle": { "type": "string", "description": "Arabic title when applicable." },
    "transliteratedTitle": { "type": "string", "description": "Romanized title per ISO 233-2 or common scholarly convention." },
    "authorOrInstitution": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": { "enum": ["individual", "institution", "anonymous", "composite"] },
        "name": { "type": "string" },
        "deathYearHijri": { "type": "integer", "description": "For classical authors." },
        "deathYearGregorian": { "type": "integer" },
        "institutionName": { "type": "string" }
      }
    },
    "sourceType": {
      "enum": [
        "tafsir-classical",
        "tafsir-modern",
        "hadith-collection",
        "fiqh-manual",
        "aqeedah-creed",
        "lexicon",
        "seerah",
        "modern-scholarship",
        "digital-dataset",
        "translation",
        "recitation",
        "mushaf-metadata"
      ],
      "description": "Determines validation rules and display conventions."
    },
    "language": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[a-z]{2}(-[A-Z]{2})?$" },
      "minItems": 1,
      "description": "BCP 47 language tags. Primary language first."
    },
    "editions": {
      "type": "array",
      "items": { "$ref": "#/definitions/edition" },
      "minItems": 1,
      "description": "At least one edition must be registered. See §3."
    },
    "rightsStatus": {
      "enum": [
        "public-domain",
        "cc-by-4.0",
        "cc-by-sa-4.0",
        "cc-by-nc-4.0",
        "cc-by-nc-sa-4.0",
        "cc-zero-1.0",
        "mit",
        "apache-2.0",
        "proprietary-restricted",
        "rights-unverified",
        "rights-disputed"
      ],
      "description": "Most restrictive applicable license across all editions. See §5."
    },
    "rightsNotes": {
      "type": "string",
      "description": "Narrative explanation of rights complexity, unresolved questions, or edition-specific variations."
    },
    "displayConstraints": {
      "type": "object",
      "properties": {
        "inAppText": { "type": "boolean", "default": true, "description": "Whether full text may be displayed in-app." },
        "exportAllowed": { "type": "boolean", "default": true },
        "excerptMaxLength": { "type": "integer", "description": "Max characters for quoted excerpts when full display is restricted." },
        "attributionRequired": { "type": "boolean", "default": true },
        "linkOutOnly": { "type": "boolean", "default": false, "description": "If true, never render content; only link to external source." }
      }
    },
    "provenance": {
      "type": "object",
      "required": ["ingestionMethod", "verifiedAt"],
      "properties": {
        "ingestionMethod": { "enum": ["vendored-package", "manual-entry", "api-import", "ocr-derived", "community-contributed"] },
        "checksumSha256": { "type": "string", "pattern": "^[a-f0-9]{64}$" },
        "versionPin": { "type": "string" },
        "verifiedAt": { "type": "string", "format": "date-time" },
        "verifiedBy": { "type": "string" }
      }
    },
    "notes": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "definitions": {
    "edition": {
      "type": "object",
      "required": ["editionId", "label"],
      "additionalProperties": false,
      "properties": {
        "editionId": {
          "type": "string",
          "pattern": "^ed-[a-z0-9][a-z0-9-]{1,47}$",
          "description": "Unique within this source. See §3 for naming convention."
        },
        "label": { "type": "string", "description": "Human-readable edition designation." },
        "publicationYear": { "type": "integer" },
        "publicationYearHijri": { "type": "integer" },
        "publisher": { "type": "string" },
        "publicationPlace": { "type": "string" },
        "editor": { "type": "string" },
        "translator": { "type": "string" },
        "volumes": { "type": "integer", "minimum": 1 },
        "digitalLocatorScheme": {
          "enum": ["volume-page", "chapter-section", "ayah-range", "digital-offset", "paragraph-number", "none"],
          "description": "How references into this edition are structured. See §4."
        },
        "rightsOverride": {
          "type": "string",
          "enum": ["public-domain", "cc-by-4.0", "cc-by-sa-4.0", "cc-by-nc-4.0", "proprietary-restricted", "rights-unverified"],
          "description": "If this specific edition has different rights than the source-level default."
        },
        "isPrimaryEdition": { "type": "boolean", "default": false, "description": "The edition used as the canonical reference target unless otherwise specified." }
      }
    }
  }
}
```

---

## 3. Edition Identifier Scheme

### 3.1 Naming Convention

Edition IDs follow the pattern: `ed-{descriptor}` where descriptor is lowercase kebab-case, unique within the parent source.

| Source | Edition ID | Label |
|--------|-----------|-------|
| Ibn Kathir Tafsir | `ed-ar-1st-cairo` | Arabic, 1st ed., Cairo 1388H |
| Ibn Kathir Tafsir | `ed-en-abridgement-2000` | English abridgement, Darussalam 2000 |
| Sahih al-Bukhari | `ed-ar-fath-al-bari` | Fath al-Bari commentary edition |
| Quran JSON | `ed-v3-1-2` | v3.1.2 pinned package |
| Tanzil Translations | `ed-ur-jalandhry` | Urdu Jalandhry via Tanzil |

### 3.2 Disambiguation Rules

When multiple editions exist:

1. **Language variant** → prefix with BCP 47 tag (`ar-`, `en-`, `ur-`)
2. **Chronological ordering** → include year or ordinal (`1st`, `2nd`, `1388h`, `2000`)
3. **Editorial tradition** → include editor/commentary name (`fath-al-bari`, `tahdhib`)
4. **Digital version** → include version pin (`v3-1-2`, `v4-api`)

Exactly one edition per source MUST carry `isPrimaryEdition: true`. This is the default target for unqualified references.

### 3.3 Immutability

Edition IDs are **never reassigned**. If an edition record is found to be erroneous, it is marked deprecated (via a `deprecatedAt` timestamp field) and a new edition ID is minted. References to the old ID resolve to a deprecation notice pointing to the replacement.

---

## 4. Precise Reference Locators

### 4.1 Locator Format

All citations use a structured locator object, not free-text strings:

```jsonc
{
  "editionId": "ed-ar-1st-cairo",
  "locatorType": "volume-page",   // matches edition.digitalLocatorScheme
  "locator": {
    "volume": 3,
    "page": 142,
    "line": null                   // optional refinement
  },
  "displayText": "III:142"         // human-renderable form
}
```

### 4.2 Locator Types

| Type | Schema | Example | Use Case |
|------|--------|---------|----------|
| `volume-page` | `{volume: int, page: int, line?: int}` | `III:142` | Classical printed tafsir |
| `chapter-section` | `{chapter: string, section?: string}` | `Kitab al-Tawhid, Bab 3` | Hadith collections |
| `ayah-range` | `{surah: int, ayahStart: int, ayahEnd: int}` | `2:255-257` | Quran-commentary cross-ref |
| `digital-offset` | `{offset: int, length?: int}` | `@14832+200` | Digital-only texts |
| `paragraph-number` | `{paragraph: int}` | `§4.2.1` | Modern scholarship |
| `none` | `{}` | — | Works without stable pagination |

### 4.3 Machine Parseability

Every locator MUST be parseable by a deterministic function `parseLocator(editionId, locatorObject) → normalizedForm`. Free-text citations like "see Ibn Kathir vol. 3 p. 142" are **not acceptable** as primary references; they may appear in `displayText` for human rendering only.

### 4.4 Cross-Edition Alignment

When the same passage exists in multiple editions of the same work, alignment records map locators across editions:

```jsonc
{
  "alignmentId": "align-ibn-kathir-2-255",
  "sourceId": "src-ibn-kathir-tafsir",
  "anchors": [
    { "editionId": "ed-ar-1st-cairo", "locator": { "volume": 1, "page": 312 } },
    { "editionId": "ed-en-abridgement-2000", "locator": { "volume": 1, "page": 89 } }
  ]
}
```

This enables UI features like "show this passage in another edition" without requiring identical pagination.

---

## 5. Rights and Licensing Metadata

### 5.1 Rights Hierarchy

Rights are evaluated at two levels:

1. **Source-level `rightsStatus`**: The most restrictive status across all editions. This is the default.
2. **Edition-level `rightsOverride`**: Optional per-edition override when editions have distinct rights (e.g., original Arabic is public domain but English translation is CC-BY).

Resolution rule: `effectiveRights(edition) = edition.rightsOverride ?? source.rightsStatus`

### 5.2 Display/Export Gating

The `displayConstraints` object controls runtime behavior:

| Constraint | Effect |
|-----------|--------|
| `inAppText: false` | Text never rendered inline; show attribution + external link only |
| `exportAllowed: false` | Exclude from PDF/EPUB/data exports |
| `excerptMaxLength: N` | Truncate displayed text to N characters with ellipsis |
| `linkOutOnly: true` | Equivalent to `inAppText: false` + `exportAllowed: false` |
| `attributionRequired: true` | Always show source attribution adjacent to content |

### 5.3 Unresolved Rights

Per DATA-PROVENANCE.md, many current sources carry `rights-unverified`. This specification preserves that status explicitly rather than assuming clearance. The transition path is:

```
rights-unverified → [legal review] → public-domain | cc-* | proprietary-restricted | rights-disputed
```

No automated process may change `rightsStatus`. All transitions require a `ReviewDecision` entity (see MFD-12-REVIEW-WORKFLOW-SPEC.md).

### 5.4 Impact Matrix

| Rights Status | In-App Display | Export | Citation | API Access |
|--------------|----------------|--------|----------|------------|
| public-domain | ✅ Full | ✅ | ✅ | ✅ |
| cc-by-4.0 | ✅ Full + attribution | ✅ + attribution | ✅ | ✅ |
| cc-by-nc-4.0 | ✅ Full + attribution | ❌ Non-commercial only | ✅ | ⚠️ Restricted |
| proprietary-restricted | ⚠️ Excerpt only / link-out | ❌ | ✅ | ❌ |
| rights-unverified | ⚠️ Link-out only (safe default) | ❌ | ✅ | ❌ |
| rights-disputed | ❌ Blocked pending resolution | ❌ | ✅ (metadata only) | ❌ |

---

## 6. Migration from MFD-11

The 13 records in `src/lib/quran/sources.ts` map to this schema as follows:

| MFD-11 sourceId | MFD-12 sourceId | sourceType | Notes |
|----------------|-----------------|------------|-------|
| quran-json | src-quran-json | digital-dataset | Single edition, CC-BY-4.0 |
| tanzil-sahih | src-tanzil-translation-en-sahih | translation | Edition: en-sahih |
| tanzil-translit | src-tanzil-transliteration | digital-dataset | Not a standalone source; consider merging |
| tanzil-mushaf-metadata | src-tanzil-mushaf-metadata | mushaf-metadata | CC-BY |
| semantic-embeddings | src-semantic-embeddings | digital-dataset | Apache-2.0 model, derived index |
| qul-word-data | src-qul-word-data | digital-dataset | MIT |
| islamic-network-audio | src-islamic-network-audio | recitation | rights-unverified |
| tafsir-jalalayn | src-tafsir-al-jalalayn | tafsir-classical | rights-unverified |
| tafsir-muyassar | src-tafsir-al-muyassar | tafsir-modern | rights-unverified |
| tafsir-ibn-kathir | src-ibn-kathir-tafsir | tafsir-classical | Multiple editions needed |
| tafsir-maarif | src-maarif-ul-quran | tafsir-modern | link-out only |

Migration is non-destructive: existing records remain valid until replaced. New records follow this schema exclusively.

---

## 7. Open Questions

1. **Tanzil proxy rights**: The current proxy arrangement is documented as a deviation in DATA-PROVENANCE.md. Does this specification's `rights-unverified` + `linkOutOnly` safe-default adequately gate Tanzil content until legal review completes?
2. **Audio recordings**: Islamic Network CDN serves recordings with no explicit license. Should `recitation` sources have additional fields for performer rights separate from distribution rights?
3. **Community-contributed sources**: What verification threshold applies before a community-submitted source record transitions from `rights-unverified` to a cleared status?
4. **Deprecated editions**: Should deprecated edition IDs redirect automatically in the API, or return a 410 Gone with metadata?
5. **Multi-language sources**: When a single work exists in Arabic and translation with different rights, should these be modeled as separate sources or as editions of one source? Current design uses editions; validate this against real-world cases.
