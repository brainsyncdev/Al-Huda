import type { Metadata } from "next";
import { getSurahIndex } from "@/lib/quran/data";
import { RevisionWorkspace } from "@/components/revision/workspace";
import type { SurahOption } from "@/lib/revision/surah-options";

// Server component on purpose. The dataset loader reads node:fs and cannot be
// imported into a client bundle, so surah metadata (including each surah's real
// verse count, which bounds range selection) is read here and handed down as
// props. Verse text for the recall step is fetched from /api/v1 instead.

export const metadata: Metadata = {
  title: "Revision",
  description:
    "A local, self-paced revision schedule for the ayat you are memorizing. Your plan stays in your own browser.",
  // Local-only tool shell: it renders no user content server-side, so there is
  // nothing a reader would want surfaced in search results. Kept out of the
  // index and out of sitemap.ts for the same reason (PRD §15).
  robots: { index: false, follow: false },
};

export default function RevisionPage() {
  const surahOptions: SurahOption[] = getSurahIndex().map((surah) => ({
    id: surah.id,
    transliteration: surah.transliteration,
    arabicName: surah.arabicName,
    ayahCount: surah.ayahCount,
  }));

  return <RevisionWorkspace surahOptions={surahOptions} />;
}
