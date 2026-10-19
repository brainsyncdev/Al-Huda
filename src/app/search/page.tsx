import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SearchBox } from "@/components/search/search-box";
import { SearchFilters } from "@/components/search/search-filters";
import { AyahCard } from "@/components/quran/ayah-card";
import { searchQuran } from "@/lib/quran/search";
import { getSurah, getSurahIndex } from "@/lib/quran/data";
import { absoluteUrl } from "@/lib/site";
import { getJuzForAyah } from "@/lib/quran/juz";

interface Props {
  searchParams: Promise<{ q?: string; surah?: string; type?: string; juz?: string }>;
}

export const metadata: Metadata = {
  title: "Search the Quran",
  description:
    "Search by reference (2:255), surah name, Arabic text, translation, or transliteration. Filter by Surah, revelation type, or Juz.",
  alternates: { canonical: absoluteUrl("/search") },
};

export default async function SearchPage({ searchParams }: Props) {
  const { q, surah: surahFilter, type: typeFilter, juz: juzFilter } =
    await searchParams;
  const query = q?.trim() ?? "";
  const index = getSurahIndex();

  const surahId = surahFilter ? Number(surahFilter) : null;
  const juzNum = juzFilter ? Number(juzFilter) : null;
  const revelationType =
    typeFilter === "meccan" || typeFilter === "medinan" ? typeFilter : null;
  const hasFilters = Boolean(surahId || revelationType || juzNum);

  if (query.length === 0 && !hasFilters) {
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

        <Suspense
          fallback={
            <div className="rounded-2xl border border-border/80 bg-card p-4 text-sm text-muted-foreground">
              Loading filters…
            </div>
          }
        >
          <SearchFilters
            surahOptions={index.map((s) => ({
              id: s.id,
              transliteration: s.transliteration,
            }))}
          />
        </Suspense>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground">
          <p>
            Matching is rule-based and transparent. Results favor
            reference/surah-name matches first, then exact word/normalized
            matches. Arabic diacritics are stripped only for matching; displayed
            Arabic is shown verbatim from the source dataset.
          </p>
        </div>
      </div>
    );
  }

  if (query.length > 0 && query.length < 2 && !hasFilters) {
    return (
      <div className="space-y-6 pb-8">
        <SearchBox initialQuery={query} />
        <p className="text-sm text-muted-foreground">
          Type at least two characters to search.
        </p>
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

  if (
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
        <Suspense
          fallback={
            <div className="rounded-2xl border border-border/80 bg-card p-4 text-sm text-muted-foreground">
              Loading filters…
            </div>
          }
        >
          <SearchFilters
            surahOptions={index.map((s) => ({
              id: s.id,
              transliteration: s.transliteration,
            }))}
          />
        </Suspense>
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
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
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredHits.map((hit) => {
            const surah = getSurah(hit.surah);
            if (!surah) return null;
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
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
