import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchBox } from "@/components/search/search-box";
import { SearchFilters } from "@/components/search/search-filters";
import { AyahCard } from "@/components/quran/ayah-card";
import { findSnippetRange, searchQuran } from "@/lib/quran/search";
import { REASON_DESCRIPTIONS, REASON_LABELS } from "@/lib/quran/match-reasons";
import { getSurah, getSurahIndex } from "@/lib/quran/data";
import { TOPICS, getTopic } from "@/lib/topics/data";
import { absoluteUrl } from "@/lib/site";
import { getJuzForAyah } from "@/lib/quran/juz";

interface Props {
  searchParams: Promise<{
    q?: string;
    surah?: string;
    type?: string;
    juz?: string;
    topic?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Search the Quran",
  description:
    "Search by reference (2:255), surah name, Arabic text, translation, or transliteration. Filter by Surah, revelation type, Juz, or curated topic.",
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

  const hasFilters = Boolean(surahId || revelationType || juzNum || topicSlug);
  const invalidFilters =
    (Boolean(surahFilter) && surahId === null) ||
    (Boolean(juzFilter) && juzNum === null) ||
    (Boolean(typeFilter) && revelationType === null) ||
    (Boolean(topicFilter) && topicSlug === null);

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
      <SearchFilters surahOptions={surahOptions} topicOptions={topicOptions} />
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
            name, Arabic text, English translation, or transliteration.
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
            One verified English translation (Saheeh International) is shipped.
            A translation-edition filter is not available because no second
            licensed translation has been verified for redistribution (FR-033).
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

  const results = searchQuran(query, { limit: 100 });

  let filteredHits = results.hits;

  if (surahId) {
    filteredHits = filteredHits.filter((h) => h.surah === surahId);
  }

  if (revelationType) {
    const surahMetaMap = new Map(index.map((s) => [s.id, s.revelation]));
    filteredHits = filteredHits.filter(
      (h) => surahMetaMap.get(h.surah) === revelationType
    );
  }

  if (juzNum) {
    filteredHits = filteredHits.filter(
      (h) => getJuzForAyah(h.surah, h.ayah) === juzNum
    );
  }

  // FR-012 topic filter. Resolved as a lookup set from the reviewed topic
  // relations rather than by re-running text matching, so a topic hit means
  // "this ayah is in that curated selection", which is exactly what the
  // editorial record claims.
  if (topicSlug) {
    const topicRefs = new Set(
      (getTopic(topicSlug)?.relations ?? []).map(
        (r) => `${r.ref.surah}:${r.ref.ayah}`
      )
    );
    filteredHits = filteredHits.filter((h) =>
      topicRefs.has(`${h.surah}:${h.ayah}`)
    );
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}