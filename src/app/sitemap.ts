import type { MetadataRoute } from "next";
import { getSurahIndex } from "@/lib/quran/data";
import { TOPICS } from "@/lib/topics/data";
import { getAllDimensions } from "@/lib/explore/dimensions";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const index = getSurahIndex();
  const today = new Date();

  // `/search` is deliberately absent: it is an internal search state and is
  // noindexed (PRD §15), so listing it here would advertise a URL the robots
  // policy tells crawlers to ignore.
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
  ].map(
    (path) => ({
      url: absoluteUrl(path),
      lastModified: today,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

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

  // Ayah pages are not indexed exhaustively (6,236 URLs) — only surfaced via surah/topic links.
  return [...staticRoutes, ...surahRoutes, ...topicRoutes, ...dimensionRoutes];
}
