# Multi-Translation Support

Al-Huda supports **100+ Quran translations across roughly 40 languages**, with
Urdu (Jalandhry) as the default.

**Document control:** reconciled 2026-10-23 against the repository. This
revision corrects the test count (188, not 184), moves parallel translations
from "future" to implemented, and removes the claim that Tanzil's terms have
been reviewed and satisfied — they have not.

## Features

### Translation selection

- **Default translation:** Urdu, Maulana Fateh Muhammad Jalandhry
  (`ur.jalandhry`).
- **Fallback:** `en.sahih`, the translation bundled in `quran-json`.
- **Switching:** change the edition from the reader controls on any page.
- **Persistence:** the choice is stored in `localStorage` under
  `alhuda.prefs.v1` and carried in the backup envelope (v4).
- **RTL support:** automatic right-to-left rendering for Arabic, Urdu,
  Persian, and other RTL languages.
- **Parallel mode:** the primary edition plus up to three additional editions
  rendered beneath it (`MAX_PARALLEL_TRANSLATIONS = 3`).

### Available languages

The catalog covers major languages (English, Urdu, Arabic, Persian, Turkish,
Russian), European languages, Asian languages, and African languages. The
exact list lives in `src/lib/quran/translations.ts`; this document does not
duplicate it.

### Data source

Translations come from **Tanzil.net**:

- The browser requests `/api/translations/[id]`, a first-party Node-runtime
  route that proxies `https://tanzil.net/trans/{id}` for catalog IDs only.
- The proxy revalidates for 24 hours and returns `text/plain`.
- `translation-store.ts` parses the `surah|ayah|text` format and caches each
  edition in memory for the session.
- No translation file is bundled with the app.

**Rights status:** this is runtime delivery, not redistribution and not a
licence review. Attribution is shown, and the text is not modified, but
Tanzil's terms have not been reviewed against this usage and individual
editions were not checked. See `docs/DATA-PROVENANCE.md`. Do not read this
section as a claim that use is cleared.

## Architecture

### Translation catalog (`src/lib/quran/translations.ts`)

- Catalog of 100+ editions with ID, name, language, and direction.
- Grouped by language for the UI.
- `DEFAULT_TRANSLATION_ID = "ur.jalandhry"`,
  `FALLBACK_TRANSLATION_ID = "en.sahih"`.

### Translation store (`src/lib/quran/translation-store.ts`)

- Fetches text from the local proxy, deduplicates in-flight requests, and
  caches parsed maps in a module-scoped `Map`.
- `useTranslationText(id, surah, ayah)` subscribes components so they re-render
  when a load completes.
- A failed load leaves the caller on the built-in English text rather than an
  empty verse.

### Preferences (`src/lib/prefs/context.tsx`)

- `Prefs` carries `translationId`, `parallelMode`, and
  `parallelTranslationIds`, alongside audio and typography settings.
- `normalizePrefs` rejects unknown IDs, drops the primary from the parallel
  list, and caps the list at three. A restored backup cannot inject an
  arbitrary network target.

### UI components

- **Reader controls:** edition selector.
- **AyahCard:** renders the selected translation with the correct `lang` and
  `dir`; while a selected edition is loading it shows the built-in English.
- **ParallelTranslationBlock:** renders each extra edition beneath the primary.

## Backup compatibility

The envelope is **version 4** and carries library, revision plan, preferences,
and paths together. Legacy v1 (library-only) still imports; a v3 or v4 backup
restores the translation preference.

## Performance

- Translations are fetched only when selected.
- Each edition is cached in memory once per session.
- No translation text is in the initial JavaScript bundle.
- The default Urdu edition is one network request; the built-in English text
  needs none.

## Accessibility

- `lang` and `dir` are set per edition.
- The selector is keyboard operable with labelled controls.
- Loading falls back to readable text rather than an empty region.

## Licensing and attribution

- Attribution is displayed on `/sources` and in the reader.
- Translation text is rendered unmodified.
- **Outstanding:** legal/licensing review of Tanzil's terms as they apply to
  this proxy arrangement, and of each edition actually offered.

See `src/lib/quran/sources.ts` for the source registry and
`docs/DATA-PROVENANCE.md` for the rights analysis.

## Future enhancements

- Offline caching in IndexedDB.
- A dedicated verse-comparison view across chosen editions.
- A download manager for frequently used editions.
- Translator footnotes where the source provides them.

## Testing

The most recent audit reported 188 tests across 11 files passing. Translation
behavior covered by tests includes preference normalization and fallback
handling. No browser-level test exercises a live Tanzil fetch.

## Files

**Core:**
- `src/lib/quran/translations.ts` — catalog
- `src/lib/quran/translation-store.ts` — proxy-backed loader and hook
- `src/app/api/translations/[id]/route.ts` — first-party proxy
- `src/lib/prefs/context.tsx` — preference model and normalization
- `src/components/quran/ayah-card.tsx` — primary and parallel rendering
- `src/lib/quran/sources.ts` — source registry
- `src/lib/backup.ts` — v4 envelope