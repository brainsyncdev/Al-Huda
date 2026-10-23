import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { SearchBox } from "@/components/search/search-box";
import { SearchFilters } from "@/components/search/search-filters";
import { AyahCard } from "@/components/quran/ayah-card";
import { findSnippetRange, searchQuran } from "@/lib/quran/search";
import { REASON_DESCRIPTIONS, REASON_LABELS } from "@/lib/quran/match-reasons";
import { getSurah, getSurahIndex } from "@/lib/quran/data";
import { TOPICS, getTopic } from "@/lib/topics/data";
import { PATHS } from "@/lib/paths/data";
import { absoluteUrl } from "@/lib/site";
import { getJuzForAyah } from "@/lib/quran/juz";
import { SemanticSearchPanel } from "@/components/search/semantic-search-panel";
import { searchTranslationEdition } from "@/lib/quran/translation-search";
import type { TranslationSearchHit } from "@/lib/quran/translation-search";
import { searchTafsir } from "@/lib/quran/tafsir-search";
import type { TafsirSearchResults } from "@/lib/quran/tafsir-search";
import { getTranslation, TRANSLATIONS } from "@/lib/quran/translations";
import type { TranslationMeta } from "@/lib/quran/translations";

interface Props {
  searchParams: Promise<{
    q?: string;
    surah?: string;
    type?: string;
    juz?: string;
    topic?: string;
    edition?: string;
    mode?: string;
    language?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Search the Quran",
  description:
    "Search by reference (2:255), surah name, Arabic text, translation, or transliteration. Filter by Surah, revelation type, Juz, or curated topic. Search within 100+ translations or classical tafsirs.",
  // PRD §15 keeps "internal search states" out of the index. Every `?q=`
  // variant is a user-specific query state, and the query-less page is only
  // the empty state plus the methodology panel — thin by itself. `follow`
  // stays on so the ayah links rendered in results are still discovered.
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/search") },
};

/** Snippet padding (characters of context either side of the match). */
const SNIPPET_PAD = 60;

export default async function SearchPage({ searchParams }: Props) {
  const {
    q,
    surah: surahFilter,
    type: typeFilter,
    juz: juzFilter,
    topic: topicFilter,
    edition: editionFilter,
    mode: modeFilter,
    language: languageFilter,
  } = await searchParams;
  const query = q?.trim() ?? "";
  const index = getSurahIndex();

  // Validate filter values defensively — reject anything outside the known
  // ranges rather than silently filtering every result away.
  const parsedSurah = surahFilter ? Number(surahFilter) : NaN;
  const surahId =
    Number.isInteger(parsedSurah) && parsedSurah >= 1 && parsedSurah <= 114
      ? parsedSurah
      : null;
  const parsedJuz = juzFilter ? Number(juzFilter) : NaN;
  const juzNum =
    Number.isInteger(parsedJuz) && parsedJuz >= 1 && parsedJuz <= 30
      ? parsedJuz
      : null;
  const revelationType =
    typeFilter === "meccan" || typeFilter === "medinan" ? typeFilter : null;
  const topicSlug = topicFilter && getTopic(topicFilter) ? topicFilter : null;

  // Language narrows the default search to Arabic-text or Latin-script
  // matches. It has no meaning for edition/tafsir search, where the single
  // edition already fixes the language, so those branches ignore it.
  const language =
    languageFilter === "ar" || languageFilter === "en" ? languageFilter : null;

  const hasFilters = Boolean(
    surahId || revelationType || juzNum || topicSlug || language
  );
  const invalidFilters =
    (Boolean(surahFilter) && surahId === null) ||
    (Boolean(juzFilter) && juzNum === null) ||
    (Boolean(typeFilter) && revelationType === null) ||
    (Boolean(topicFilter) && topicSlug === null) ||
    (Boolean(languageFilter) && language === null);

  // Structural filters (surah / revelation / juz / topic) are identical for
  // default, edition, and tafsir results: they all address a verse by
  // reference. Resolving them once here keeps the three result branches from
  // drifting apart.
  const revelationBySurah = new Map(index.map((s) => [s.id, s.revelation]));
  const topicRefs = topicSlug
    ? new Set(
        (getTopic(topicSlug)?.relations ?? []).map(
          (r) => `${r.ref.surah}:${r.ref.ayah}`
        )
      )
    : null;

  function passesStructuralFilters(surah: number, ayah: number): boolean {
    if (surahId !== null && surah !== surahId) return false;
    if (
      revelationType !== null &&
      revelationBySurah.get(surah) !== revelationType
    ) {
      return false;
    }
    if (juzNum !== null && getJuzForAyah(surah, ayah) !== juzNum) return false;
    if (topicRefs !== null && !topicRefs.has(`${surah}:${ayah}`)) return false;
    return true;
  }

  const surahOptions = index.map((s) => ({
    id: s.id,
    transliteration: s.transliteration,
  }));
  const topicOptions = TOPICS.map((t) => ({ slug: t.slug, title: t.title }));

  const filterShell = (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-border/80 bg-card p-4 text-sm text-muted-foreground">
          Loading filters…
        </div>
      }
    >
      <SearchFilters
        surahOptions={surahOptions}
        topicOptions={topicOptions}
        editions={TRANSLATIONS}
      />
    </Suspense>
  );

  if (query.length === 0) {
    return (
      <div className="space-y-8 pb-8">
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Search the Quran
          </h1>
          <p className="text-muted-foreground">
            Find verses by reference (e.g. &quot;2:255&quot;, &quot;al-baqarah 153&quot;), surah
            name, Arabic text, or transliteration. Search matches the built-in English translation.
          </p>
        </header>

        <div className="mx-auto max-w-xl">
          <SearchBox initialQuery="" autoFocus />
        </div>

        {filterShell}

        {invalidFilters && (
          <p className="mx-auto max-w-xl text-xs font-medium text-gold">
            One or more filter values were invalid and have been ignored.
          </p>
        )}

        {hasFilters && (
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            Filters narrow a search rather than browse the text on their own.
            Type a word or a reference above to see the verses that match them.
          </p>
        )}

        <div className="mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground space-y-2">
          <p>
            Matching is rule-based and transparent. Reference matches come
            first, then surah-name matches, then verse-text matches ranked by
            lexical relevance: whole-word occurrences of your query outrank
            substring echoes, and a match in the translation outranks one in
            the transliteration. Canonical mushaf order breaks every tie, so
            the same query always returns the same ordering. Arabic diacritics
            are stripped only for matching; displayed Arabic is shown verbatim
            from the source dataset. When your query matches a curated topic
            title, related verses from that topic’s editorial selection are
            included last as “Curated theme match” — lexical expansion, not
            embedding-based semantic similarity.
          </p>
          <p>
            100+ translations in 50+ languages are available. The default
            search matches the built-in English text; you can also search
            within a specific translation edition or both classical Arabic
            tafsirs (al-Jalalayn and al-Muyassar) using the edition picker
            below. Edition text is fetched from Tanzil.net on first use.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <SemanticSearchPanel />
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card p-5 space-y-3">
          <h2 className="font-display text-lg font-semibold">Search in a specific edition</h2>
          <p className="text-sm text-muted-foreground">
            Search within a specific translation or classical tafsir edition.
            The text is fetched from Tanzil.net on first use and cached.
          </p>
          <form
            action="/search"
            method="get"
            className="flex flex-wrap items-center gap-2"
          >
            <input
              type="search"
              name="q"
              placeholder="Words to find in the edition…"
              aria-label="Words to search for in the chosen edition"
              required
              minLength={2}
              autoComplete="off"
              spellCheck={false}
              className="h-10 min-w-[12rem] flex-1 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring"
            />
            <select
              name="edition"
              defaultValue=""
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
            >
              <option value="" disabled>
                Choose an edition…
              </option>
              <optgroup label="Classical tafsirs (Arabic)">
                <option value="ar.jalalayn">Tafsir al-Jalalayn</option>
                <option value="ar.muyassar">Al-Muyassar</option>
              </optgroup>
              <optgroup label="English translations">
                {TRANSLATIONS.filter((t) => t.language === "en").map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Urdu translations">
                {TRANSLATIONS.filter((t) => t.language === "ur").map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other languages">
                {TRANSLATIONS.filter(
                  (t) => t.language !== "en" && t.language !== "ur" && t.language !== "ar"
                ).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.languageLabel} — {t.name}
                  </option>
                ))}
              </optgroup>
            </select>
            <button
              type="submit"
              className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
            >
              Search edition
            </button>
          </form>
          <p className="text-xs text-muted-foreground">
            An edition search looks only inside that edition, so a term that
            appears in a translation but not in the built-in English text will
            be found here and nowhere else. The same query can be re-run
            against both classical tafsirs, or against another edition, from
            the links above a result list.
          </p>
        </div>
      </div>
    );
  }

  if (query.length > 0 && query.length < 2) {
    return (
      <div className="space-y-6 pb-8">
        <SearchBox initialQuery={query} />
        {filterShell}
        <p className="text-sm text-muted-foreground">
          Type at least two characters to search.
        </p>
        {invalidFilters && (
          <p className="text-xs font-medium text-gold">
            One or more filter values were invalid and have been ignored.
          </p>
        )}
      </div>
    );
  }

  // Edition-scoped search (FR-012): when ?edition=<id> is set, search a
  // specific translation or tafsir edition rather than the built-in English.
  // ?mode=tafsir is a convenience that searches both classical Arabic tafsirs
  // (al-Jalalayn and al-Muyassar) in one pass.
  const editionMeta = editionFilter ? getTranslation(editionFilter) : undefined;
  const tafsirMode = modeFilter === "tafsir";

  if (tafsirMode) {
    const tafsirResults = await searchTafsir(query, 100);
    const hits = tafsirResults.hits.filter((h) =>
      passesStructuralFilters(h.surah, h.ayah)
    );
    return (
      <TafsirSearchResultsView
        query={query}
        results={tafsirResults}
        hits={hits}
        filters={filterShell}
      />
    );
  }

  if (editionFilter) {
    if (!editionMeta) {
      return (
        <div className="space-y-6 pb-8">
          <SearchBox initialQuery={query} />
          {filterShell}
          <p className="text-sm text-destructive">
            Unknown edition: {editionFilter}. Choose an edition from the search
            page.
          </p>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className="text-sm text-primary underline-offset-2 hover:underline"
          >
            Back to default search
          </Link>
        </div>
      );
    }
    const editionResult = await searchTranslationEdition(
      editionMeta.id,
      query,
      100
    );
    if (!editionResult || editionResult.loadError) {
      return (
        <div className="space-y-6 pb-8">
          <SearchBox initialQuery={query} />
          {filterShell}
          <p className="text-sm text-destructive">
            {editionMeta.name} could not be loaded from the upstream publisher.
            Please try again later.
          </p>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className="text-sm text-primary underline-offset-2 hover:underline"
          >
            Back to default search
          </Link>
        </div>
      );
    }
    return (
      <EditionSearchResultsView
        query={query}
        edition={editionMeta}
        hits={editionResult.hits.filter((h) =>
          passesStructuralFilters(h.surah, h.ayah)
        )}
        totalScanned={editionResult.totalScanned}
        filters={filterShell}
      />
    );
  }

  const results = searchQuran(query, { limit: 100 });

  // Structural filters are shared with the edition/tafsir branches; the
  // language filter is specific to default search, where one result list can
  // mix Arabic-text and translation matches. A parsed reference is
  // language-agnostic, so it survives either value.
  let filteredHits = results.hits.filter((h) =>
    passesStructuralFilters(h.surah, h.ayah)
  );

  if (language === "ar") {
    filteredHits = filteredHits.filter(
      (h) => h.reason === "arabic" || h.reason === "reference"
    );
  } else if (language === "en") {
    filteredHits = filteredHits.filter((h) => h.reason !== "arabic");
  }

  // Redirect only when no filters are active: a filtered single hit must not
  // hijack the user's filter state.
  if (
    !hasFilters &&
    results.reference &&
    filteredHits.length === 1 &&
    results.reference.ayah !== undefined &&
    !results.referenceOutOfRange
  ) {
    const h = filteredHits[0];
    redirect(`/ayah/${h.surah}/${h.ayah}`);
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-4">
        <SearchBox initialQuery={query} />
        {filterShell}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          {invalidFilters && (
            <p className="w-full text-xs font-medium text-gold">
              One or more filter values were invalid and have been ignored.
            </p>
          )}
          <p>
            {filteredHits.length}{" "}
            {filteredHits.length === 1 ? "result" : "results"}
            {hasFilters ? " after filtering" : ""} for &quot;{results.query}&quot;
          </p>
          {results.reference && (
            <p className="text-xs uppercase tracking-wider">
              Parsed as reference: {results.reference.surah}:
              {results.reference.ayah ?? "*"}
            </p>
          )}
          {results.referenceOutOfRange && (
            <p className="text-xs font-medium text-gold">
              Reference out of range for that surah.
            </p>
          )}
        </div>
        <nav
          aria-label="Search modes"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
        >
          <span className="font-medium text-foreground/80">Also search:</span>
          <Link
            href={`/search?q=${encodeURIComponent(query)}&mode=tafsir`}
            className="text-primary underline-offset-2 hover:underline"
          >
            both classical tafsirs
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(query)}&edition=ar.jalalayn`}
            className="text-primary underline-offset-2 hover:underline"
          >
            Tafsir al-Jalalayn
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(query)}&edition=en.pickthall`}
            className="text-primary underline-offset-2 hover:underline"
          >
            Pickthall
          </Link>
          <Link
            href={`/search?q=${encodeURIComponent(query)}&edition=ur.jalandhry`}
            className="text-primary underline-offset-2 hover:underline"
          >
            Jalandhry (Urdu)
          </Link>
        </nav>
      </header>

      {filteredHits.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          <p>No matches found. Try a different query or adjust your filters.</p>
          {hasFilters && (
            <p className="mt-2 text-xs">
              Active filters are narrowing the result set. Clearing them will
              show the unfiltered matches for this query.
            </p>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredHits.map((hit) => {
            const surah = getSurah(hit.surah);
            if (!surah) return null;

            // FR-013: highlight the matched term inside a padded slice of the
            // verbatim translation. findSnippetRange returns null when the
            // literal does not appear in the raw text (e.g. it only matched
            // after normalization, or the hit is an Arabic/reference/surah-name
            // match), in which case the full translation is shown unhighlighted
            // rather than a fabricated snippet.
            const snippet =
              hit.reason === "translation"
                ? findSnippetRange(hit.translation, query, SNIPPET_PAD)
                : null;

            // Find learning paths that include this ayah.
            const relatedPaths = PATHS.filter((path) =>
              path.steps.some(
                (step) =>
                  step.ref.surah === hit.surah && step.ref.ayah === hit.ayah
              )
            );

            return (
              <li key={`${hit.surah}:${hit.ayah}:${hit.reason}`}>
                <AyahCard
                  ayah={{
                    surah: hit.surah,
                    ayah: hit.ayah,
                    arabic: hit.arabic,
                    translation: hit.translation,
                    transliteration: hit.transliteration,
                  }}
                  surahTransliteration={hit.surahTransliteration}
                  variant="compact"
                  allowNotes={false}
                  snippet={snippet}
                  matchReasonLabel={REASON_LABELS[hit.reason]}
                  matchReasonDescription={REASON_DESCRIPTIONS[hit.reason]}
                />
                {relatedPaths.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {relatedPaths.map((path) => (
                      <Link
                        key={path.slug}
                        href={`/learn/paths/${path.slug}`}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
                      >
                        In path: {path.title}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edition-scoped search results
// ---------------------------------------------------------------------------

function EditionSearchResultsView({
  query,
  edition,
  hits,
  totalScanned,
  filters,
}: {
  query: string;
  edition: TranslationMeta;
  hits: TranslationSearchHit[];
  totalScanned: number;
  filters: ReactNode;
}) {
  const isRtl = edition.direction === "rtl";
  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <SearchBox initialQuery={query} />
        {filters}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>
            {hits.length} {hits.length === 1 ? "match" : "matches"} in{" "}
            <span className="font-medium text-foreground">{edition.name}</span>{" "}
            ({edition.languageLabel}) for &quot;{query}&quot;
          </p>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            Back to default search
          </Link>
        </div>
      </header>

      {hits.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          <p>
            No matches found in {edition.name} for &quot;{query}&quot;.
          </p>
          <p className="mt-2 text-xs">
            {totalScanned} verses scanned. Try a different query or a different
            edition.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {hits.map((hit) => (
            <li
              key={`${hit.surah}:${hit.ayah}`}
              className="rounded-2xl border border-border/80 bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/ayah/${hit.surah}/${hit.ayah}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {hit.surahTransliteration} {hit.surah}:{hit.ayah}
                </Link>
              </div>
              <p
                dir={isRtl ? "rtl" : "ltr"}
                lang={edition.language}
                className={
                  "mt-2 leading-relaxed " +
                  (isRtl ? "text-lg" : "text-sm")
                }
              >
                {hit.snippet ? (
                  <>
                    {hit.snippet.text.slice(0, hit.snippet.matchStart)}
                    <mark className="rounded bg-primary/20 px-0.5 text-foreground">
                      {hit.snippet.text.slice(
                        hit.snippet.matchStart,
                        hit.snippet.matchEnd
                      )}
                    </mark>
                    {hit.snippet.text.slice(hit.snippet.matchEnd)}
                  </>
                ) : (
                  hit.text
                )}
              </p>
            </li>
          ))}
        </ol>
      )}

      <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
        Edition-scoped search matches literal substrings in the translation
        text after normalization. It is not a semantic search. The text is
        fetched from Tanzil.net and cached in process memory; licensing and
        permitted use remain with the original publisher.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tafsir search results
// ---------------------------------------------------------------------------

function TafsirSearchResultsView({
  query,
  results,
  hits,
  filters,
}: {
  query: string;
  results: TafsirSearchResults;
  hits: TafsirSearchResults["hits"];
  filters: ReactNode;
}) {
  const anyLoadError = results.editionsSearched.some((e) => e.loadError);
  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <SearchBox initialQuery={query} />
        {filters}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>
            {hits.length}{" "}
            {hits.length === 1 ? "match" : "matches"} across classical
            tafsirs for &quot;{query}&quot;
          </p>
          <Link
            href={`/search?q=${encodeURIComponent(query)}`}
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            Back to default search
          </Link>
        </div>
        {anyLoadError && (
          <p className="text-xs text-gold">
            One or more tafsir editions could not be loaded. Results below are
            from the editions that were reachable.
          </p>
        )}
      </header>

      {hits.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          <p>No matches found in the classical tafsirs for &quot;{query}&quot;.</p>
          <p className="mt-2 text-xs">
            {results.totalScanned} verses scanned across{" "}
            {results.editionsSearched.filter((e) => !e.loadError).length}{" "}
            edition{results.editionsSearched.length === 1 ? "" : "s"}.
          </p>
        </div>
      ) : (
        <ol className="space-y-3">
          {hits.map((hit, i) => (
            <li
              key={`${hit.editionId}:${hit.surah}:${hit.ayah}:${i}`}
              className="rounded-2xl border border-border/80 bg-card p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <Link
                  href={`/ayah/${hit.surah}/${hit.ayah}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {hit.surahTransliteration} {hit.surah}:{hit.ayah}
                </Link>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.6875rem] font-medium text-secondary-foreground">
                  {hit.editionName}
                </span>
              </div>
              <p
                dir="rtl"
                lang="ar"
                className="mt-2 text-lg leading-loose"
              >
                {hit.snippet ? (
                  <>
                    {hit.snippet.text.slice(0, hit.snippet.matchStart)}
                    <mark className="rounded bg-primary/20 px-0.5 text-foreground">
                      {hit.snippet.text.slice(
                        hit.snippet.matchStart,
                        hit.snippet.matchEnd
                      )}
                    </mark>
                    {hit.snippet.text.slice(hit.snippet.matchEnd)}
                  </>
                ) : (
                  hit.text
                )}
              </p>
            </li>
          ))}
        </ol>
      )}

      <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
        Tafsir search matches literal substrings in the classical Arabic
        exegesis of al-Jalalayn and al-Muyassar after Arabic normalization. A
        match is not a thematic claim and is not a substitute for scholarly
        interpretation; it is a pointer into the text. Consult qualified
        scholarship for interpretation.
      </p>
    </div>
  );
}