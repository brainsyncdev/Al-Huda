import type { MetadataRoute } from "next";
import { getSurahIndex } from "@/lib/quran/data";
import { TOPICS } from "@/lib/topics/data";
import { getAllDimensions } from "@/lib/explore/dimensions";
import { absoluteUrl } from "@/lib/site";

/**
 * Single sitemap containing all indexable URLs.
 *
 * Total count: 11 static + 114 surahs + 11 topics + 10 dimensions +
 * 6,236 ayahs = 6,382 URLs. This is well under the sitemap.org limit of
 * 50,000 URLs per file, so partitioning is unnecessary.
 *
 * Deliberately excluded:
 * - /search (noindexed per PRD §15)
 * - /report (disallowed in robots.txt, user-facing form)
 * - /library, /settings, /learn, /editorial (disallowed in robots.txt)
 * - /explore/theme/[name] (redirect route, not indexable)
 * - /explore/root/[root] (noindex placeholder)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const index = getSurahIndex();
  const today = new Date();

  const staticRoutes = [
    "",
    "/quran",
    "/explore",
    "/explore/graph",
    "/discover",
    "/topics",
    "/about",
    "/sources",
    "/privacy",
    "/terms",
    "/accessibility",
  ].map((path) => ({
    url: absoluteUrl(path),
    lastModified: today,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const surahRoutes = index.map((s) => ({
    url: absoluteUrl(`/quran/${s.slug}`),
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const topicRoutes = TOPICS.map((t) => ({
    url: absoluteUrl(`/topics/${t.slug}`),
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const dimensionRoutes = getAllDimensions().map((d) => ({
    url: absoluteUrl(`/explore/dimension/${d.id}`),
    lastModified: today,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // All 6,236 ayah URLs, derived from the canonical dataset.
  // Each surah's ayahCount determines the range; no paths are invented.
  const ayahRoutes: MetadataRoute.Sitemap = [];
  for (const surah of index) {
    for (let ayah = 1; ayah <= surah.ayahCount; ayah++) {
      ayahRoutes.push({
        url: absoluteUrl(`/ayah/${surah.id}/${ayah}`),
        lastModified: today,
        changeFrequency: "monthly" as const,
        priority: 0.4,
      });
    }
  }

  return [
    ...staticRoutes,
    ...surahRoutes,
    ...topicRoutes,
    ...dimensionRoutes,
    ...ayahRoutes,
  ];
}
