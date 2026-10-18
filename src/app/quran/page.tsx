import Link from "next/link";
import { getSurahIndex } from "@/lib/quran/data";

export const metadata = {
  title: "Quran index",
  description:
    "Browse all 114 surahs of the Quran by name, meaning, revelation, and ayah count.",
};

export default function QuranIndexPage() {
  const index = getSurahIndex();

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Quran index
        </h1>
        <p className="text-muted-foreground">
          All 114 surahs — Uthmani script with trusted Saheeh International
          translation.
        </p>
      </header>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {index.map((surah) => (
          <li key={surah.id}>
            <Link
              href={`/quran/${surah.slug}`}
              className="group flex h-full items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold"
                aria-label={`Surah ${surah.id}`}
              >
                {surah.id}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate font-medium text-foreground">
                    {surah.transliteration}
                  </p>
                  <p
                    lang="ar"
                    dir="rtl"
                    className="arabic-display shrink-0 text-xl text-foreground/70"
                  >
                    {surah.arabicName}
                  </p>
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {surah.meaning} · {surah.revelation} · {surah.ayahCount} ayat
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
