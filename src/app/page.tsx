import { JsonLd } from "@/components/seo/json-ld";
import { quranJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import { getSurahIndex } from "@/lib/quran/data";
import { TOPICS } from "@/lib/topics/data";
import { getAllDimensions } from "@/lib/explore/dimensions";
import { SITE_NAME } from "@/lib/site";
import { HomeClient } from "./home-client";

/** Featured surahs shown as quick entry points (widely read selections). */
const FEATURED_SURAH_IDS = [1, 2, 36, 55, 67, 18] as const;

export default function HomePage() {
  const index = getSurahIndex();
  const featured = FEATURED_SURAH_IDS.map((id) =>
    index.find((s) => s.id === id)
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const featuredTopics = TOPICS.slice(0, 6);
  const dimensions = getAllDimensions().slice(0, 5);

  return (
    <div className="space-y-14 pb-8">
      <JsonLd nodes={[websiteJsonLd(), quranJsonLd()]} />
      <HomeClient
        featured={featured}
        featuredTopics={featuredTopics}
        dimensions={dimensions}
        siteName={SITE_NAME}
      />
    </div>
  );
}
