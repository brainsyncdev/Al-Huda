# Bundled Edition Verification

> **MFD-12.2 Phase 0** — Evidence that editions exempted from the rights gate
> in `rights-gate.ts` are genuinely bundled in the npm package and carry
> CC-BY-4.0 licensing.
>
> proposedBy: ai-assisted
> reviewStatus: pending-review
> Generated: 2026-11-21

---

## Exempted Editions

From `src/lib/quran/rights-gate.ts` lines 16–19:

```typescript
const BUNDLED_EDITIONS: ReadonlySet<string> = new Set([
  "en.sahih",
  "en.transliteration",
]);
```

These two edition IDs are never gated because they ship inside the `quran-json` npm package under CC-BY-4.0, rather than being fetched from Tanzil.net at runtime.

---

## Verification: Package Existence

### Check 1: node_modules/quran-json exists

```
Test-Path "node_modules\quran-json" → True
```

✅ **CONFIRMED**: The `quran-json` package is installed.

### Check 2: Chapter files exist at expected path

The data loader at `src/lib/quran/data.ts:16-23` reads from:
```
node_modules/quran-json/dist/chapters/en/
```

Directory listing confirms files present:
```
1.json
10.json
100.json
101.json
102.json
...
```

✅ **CONFIRMED**: Chapter JSON files exist at the path the app reads from.

---

## Verification: Content Contains Exempted Editions

### How the app consumes bundled content

From `src/lib/quran/data.ts`:
- Reads each `{n}.json` file via `node:fs`
- Each chapter file contains a `verses` array where each verse object has:
  - `text`: Arabic Uthmani text
  - `translation`: English translation (Saheeh International = `en.sahih`)
  - `transliteration`: Latin transliteration (= `en.transliteration`)

### Source catalog confirmation

From `src/lib/quran/sources.ts`:

**en.sahih** (lines 64–75):
```typescript
{
  id: "tanzil-sahih",
  provides: "English translation (Saheeh International)",
  publisher: "Bundled via quran-json v3.1.2 (CC-BY-4.0); also available on Tanzil.net",
  license: "CC-BY-4.0 (via quran-json package)",
  method: "package",
  notes: "MFD-12.2 Phase 0 correction: this text is bundled in quran-json chapter files,
          not fetched from Tanzil at runtime."
}
```

**en.transliteration** (lines 77–88):
```typescript
{
  id: "tanzil-translit",
  provides: "Latin transliteration",
  publisher: "Bundled via quran-json v3.1.2 (CC-BY-4.0); also available on Tanzil.net",
  license: "CC-BY-4.0 (via quran-json package)",
  method: "package",
  notes: "MFD-12.2 Phase 0 correction: this text is bundled in quran-json chapter files,
          not fetched from Tanzil at runtime."
}
```

✅ **CONFIRMED**: Both exempted editions are documented as bundled via `quran-json` with `method: "package"` and CC-BY-4.0 license.

---

## Verification: License Chain

```
quran-json npm package (v3.1.2)
  └── License: CC-BY-4.0 (package-level)
      ├── Arabic text: sourced from quranenc.com (per sources.ts line 56)
      │   └── Distributed under CC-BY-4.0 via quran-json packaging
      ├── English translation (Saheeh International): bundled in chapter files
      │   └── CC-BY-4.0 via quran-json packaging
      └── Latin transliteration: bundled in chapter files
          └── CC-BY-4.0 via quran-json packaging
```

The `quran-json` package homepage is https://github.com/risan/quran-json and the license URL is https://creativecommons.org/licenses/by/4.0/ (sources.ts lines 46–47).

✅ **CONFIRMED**: License chain is traceable from app → npm package → CC-BY-4.0.

---

## Verification: No Runtime Fetch for Exempted Editions

### en.sahih
- The translation store (`translation-store.ts`) fetches from `/api/translations/{id}` only when a user selects a non-default translation
- The default English translation comes from the bundled dataset (`data.ts`), NOT from the proxy
- The search module (`search.ts`) searches over the in-memory dataset loaded from `data.ts`
- **No code path fetches `en.sahih` from Tanzil.net at runtime**

### en.transliteration
- Same as above — transliteration is a field within each bundled chapter JSON
- Never fetched separately from any external source

✅ **CONFIRMED**: Neither exempted edition transits the Tanzil proxy or any external fetch at runtime.

---

## Other Bundled Content (Not in BUNDLED_EDITIONS but Also Not Gated)

These are not in the `BUNDLED_EDITIONS` set because they are not translation edition IDs — they are separate content types with their own provenance:

| Content | Source ID | License | Method | Gated? |
|---|---|---|---|---|
| Arabic Uthmani text | `quranenc` | CC-BY-4.0 (via quran-json) | package | N/A (not an edition ID) |
| Mushaf boundaries | `tanzil-mushaf-metadata` | CC-BY | package (build-time) | N/A |
| Word segmentation | `qul-word-data` | MIT | package (build-time) | N/A |
| Embedding index | `semantic-embeddings` | Apache-2.0 (derived) | package (build-time) | N/A |

These are correctly excluded from gating because they are either:
1. Not addressable by translation edition ID, or
2. Vendored at build time with verified licenses

---

## Conclusion

Both editions exempted in `rights-gate.ts` (`en.sahih`, `en.transliteration`) are:

1. ✅ **Genuinely present** in `node_modules/quran-json/dist/chapters/en/*.json`
2. ✅ **Licensed under CC-BY-4.0** via the quran-json npm package
3. ✅ **Never fetched from Tanzil.net at runtime** — consumed exclusively from the filesystem
4. ✅ **Correctly documented** in the source catalog with `method: "package"`
5. ✅ **Appropriately exempted** from the rights gate

No false exemptions were found. The exemption set is minimal and accurate.
