import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SearchBox } from "@/components/search/search-box";
import { AyahCard } from "@/components/quran/ayah-card";
import { searchQuran } from "@/lib/quran/search";
import { getSurah } from "@/lib/quran/data";
import { absoluteUrl } from "@/lib/site";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Search the Quran",
  description: "Search by reference (2:255), surah name, Arabic text, translation, or transliteration. Rule-based, transparent matching.",
  alternates: { canonical: absoluteUrl("/search") },
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  if (query.length === 0) {
    return (
      <div className="space-y-8 pb-8">
        <header className="mx-auto max-w-2xl space-y-3 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Search the Quran
          </h1>
          <p className="text-muted-foreground">
            Find verses by reference (e.g. “2:255”, “al-baqarah 153”), surah name, Arabic text, English translation, or transliteration.
          </p>
        </header>

        <div className="mx-auto max-w-xl">
          <SearchBox initialQuery="" autoFocus />
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground">
          <p>
            Matching is rule-based and transparent. Results favor reference/surah-name matches first, then exact word/normalized matches. Arabic diacritics are stripped only for matching; displayed Arabic is shown verbatim from the source dataset.
          </p>
        </div>
      </div>
    );
  }

  if (query.length < 2) {
    return (
      <div className="space-y-6 pb-8">
        <SearchBox initialQuery={query} />
        <p className="text-sm text-muted-foreground">
          Type at least two characters to search.
        </p>
      </div>
    );
  }

  const results = searchQuran(query, { limit: 50 });

  // If reference uniquely resolved to one ayah, redirect to ayah page (cleaner URL).
  if (results.reference && results.hits.length === 1 && results.reference.ayah !== undefined && results.referenceOutOfRange === false) {
    const h = results.hits[0];
    redirect(`/ayah/${h.surah}/${h.ayah}`);
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-2">
        <SearchBox initialQuery={query} />
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>
            {results.hits.length} {results.hits.length === 1 ? "result" : "results"} for “{results.query}”
          </p>
          {results.reference && (
            <p className="text-xs uppercase tracking-wider">
              Parsed as reference: {results.reference.surah}:{results.reference.ayah ?? "*"}
            </p>
          )}
          {results.referenceOutOfRange && (
            <p className="text-xs font-medium text-gold">
              Reference out of range for that surah.
            </p>
          )}
        </div>
      </header>

      {results.hits.length === 0 ? (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          <p>No matches found. Try a reference like “2:255”, a surah name, a short Arabic phrase, or an English keyword.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {results.hits.map((hit) => {
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
