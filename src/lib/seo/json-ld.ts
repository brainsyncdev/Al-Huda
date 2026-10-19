// Hyphenated import path for the JSON-LD builders (PRD §15).
//
// `./jsonld` is the canonical implementation; this module exists only so page
// imports that read `@/lib/seo/json-ld` keep resolving to exactly the same
// nodes. There is one source of truth for every claim we publish — the aliases
// below are aliases rather than copies, so they cannot drift.

import type { SurahMeta } from "@/lib/quran/types";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { SOURCES } from "@/lib/quran/sources";
import {
  HOME_CRUMB,
  breadcrumbs,
  packageDataset,
  quranWork,
  webSite,
  type JsonLdNode,
} from "./jsonld";

export type { JsonLdNode };
export { breadcrumbs, HOME_CRUMB, packageDataset };

/** Same WebSite node the home page emits. */
export const websiteJsonLd = webSite;

/** Same Quran work node the home page emits. */
export const quranJsonLd = quranWork;

/**
 * The surah index as a CollectionPage.
 *
 * Accepts the index itself or a bare count, because both call shapes appear in
 * page code; the count is all the markup needs either way.
 */
export function surahIndexJsonLd(surahs: SurahMeta[] | number): JsonLdNode {
  const count = typeof surahs === "number" ? surahs : surahs.length;
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Quran — ${count} surahs`,
    url: absoluteUrl("/quran"),
    inLanguage: ["ar", "en"],
    description: `The complete index of the ${count} surahs of the Quran, with Arabic names, transliteration, and verse counts.`,
    isPartOf: quranWork(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: count,
    },
  };
}

/**
 * The source registry as a DataCatalog of Datasets.
 *
 * Each dataset carries its licence, version, and delivery method verbatim from
 * the catalog — including the "link-out only" wording for sources the app does
 * not redistribute, so the markup can never imply rights we do not hold
 * (FR-032).
 */
export function sourcesJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "DataCatalog",
    name: `${SITE_NAME} source registry`,
    description:
      "Every dataset and reference the app draws on, with licence, attribution, version, and how each one is obtained.",
    url: absoluteUrl("/sources"),
    dataset: SOURCES.map((source) => ({
      "@type": "Dataset",
      name: source.provides,
      creator: source.attribution,
      publisher: source.publisher,
      version: source.version,
      license: source.licenseUrl ?? source.license,
      url: source.homepage,
      keywords: source.method === "package" ? "bundled" : "link-out only",
      ...(source.language ? { inLanguage: source.language } : {}),
    })),
    ...(packageDataset() ? { mainEntity: packageDataset() } : {}),
  };
}
