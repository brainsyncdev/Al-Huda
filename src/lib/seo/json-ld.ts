// JSON-LD builders (PRD §15) — one self-contained module.
//
// This path previously held a thin facade that imported its builders from a
// sibling `./jsonld` and re-exported only PART of that sibling's surface, so a
// page could import a name the facade never re-exported and fail only at build
// time. The sibling is gone and everything lives here now. The export list is
// exactly the set the eight consumers name — nothing else is exported, so the
// surface cannot rot into a superset nobody uses.
//
// §15 permits structured data only "when semantically appropriate and
// accurate", which is a ceiling rather than a target. Refused here:
//   * datePublished/dateModified on the Quran, its chapters or its verses. The
//     vendored package carries no revelation or edition dates, so a build
//     timestamp would be scripture metadata invented at compile time.
//   * Page numbers, numberOfPages, or Juz ranges. docs/DATA-PROVENANCE.md
//     records the Juz mapping as an approximation of a 604-page Mushaf.
//   * review/lastReviewed/reviewedBy on topics. Every curated topic ships as
//     `pending-scholarly-review` (docs/EDITORIAL.md), so review markup would
//     assert a scholarly pass that has not happened. The real state travels in
//     `creativeWorkStatus` instead.
//   * Verse text inlined into markup. A verse is named and located, not
//     duplicated — the page body is the scripture, and re-serialising Arabic
//     into a script tag buys nothing while risking encoding drift.
//
// Every provenance claim is DERIVED from src/lib/quran/sources.ts, so the
// markup cannot fall out of step with what /sources and /editorial show a human
// reader. Link-out sources can never enter the credit string, because the app
// does not redistribute them (FR-032).

import type { SurahMeta } from "@/lib/quran/types";
import { SOURCES, getSource } from "@/lib/quran/sources";
import type { ReviewStatus, Topic } from "@/lib/topics/data";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export type JsonLdNode = Record<string, unknown>;

/** Stable ids so children can reference the parent work within one document. */
export const QURAN_NODE_ID = absoluteUrl("/quran#quran");
export const WEBSITE_NODE_ID = absoluteUrl("/#website");

const PACKAGE = getSource("quran-json");
const LICENSE_URL = PACKAGE?.licenseUrl;

/** Bundled attributions in catalog order. Derived, never retyped. */
const ATTRIBUTION = SOURCES.filter((source) => source.method === "package")
  .map((source) => source.attribution)
  .join("; ");

/** The sentence topic pages show, reused verbatim so markup cannot disagree. */
const NON_TAFSIR_NOTICE =
  "Editorial topic selections are not tafsir and are not intended as rulings.";

/** Exhaustive over the union: a new status becomes a compile error here. */
function statusLabel(status: ReviewStatus): string {
  return status === "editorial-approved"
    ? "Editorial approved"
    : "Pending scholarly review";
}

export interface Crumb {
  name: string;
  /** Root-relative path, e.g. "/quran/al-baqarah". */
  path: string;
}

/** So pages do not hand-build the root crumb. */
export const HOME_CRUMB: Crumb = { name: "Home", path: "/" };

/**
 * BreadcrumbList. `position` is 1-based and the trail is emitted in order, so
 * the markup mirrors the visible navigation rather than inventing a hierarchy.
 */
export function breadcrumbs(trail: Crumb[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * The Quran as one work.
 *
 * Inlined by every child node rather than referenced by `@id` alone: a page that
 * emits only a reference describes nothing a crawler landing directly on it can
 * resolve.
 */
function quranBook() {
  return {
    "@type": "Book",
    "@id": QURAN_NODE_ID,
    name: "The Quran",
    alternateName: "القرآن الكريم",
    url: absoluteUrl("/quran"),
    inLanguage: ["ar", "en"],
    ...(LICENSE_URL ? { license: LICENSE_URL } : {}),
    attribution: ATTRIBUTION,
    creditText: ATTRIBUTION,
  };
}

/** The Quran work on its own, for pages describing the corpus itself. */
export function quranJsonLd(): JsonLdNode {
  return { "@context": "https://schema.org", ...quranBook() };
}

/**
 * WebSite for the home page.
 *
 * The SearchAction is accurate: /search is a GET route that reads `q` from the
 * query string and server-renders results, so the urlTemplate resolves to a real
 * page. Emitted on the home page only, because the action describes the site.
 */
export function websiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_NODE_ID,
    name: SITE_NAME,
    description:
      "Read the Quran with its sources in plain view: Uthmani text, translations in 100+ languages (default: Urdu — Jalandhry), stable references, and calm search.",
    url: absoluteUrl("/"),
    inLanguage: ["en", "ar"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * The surah index.
 *
 * Carries the count rather than a 114-entry ItemList. The count is all that is
 * asserted here and it is true; enumerating every surah would duplicate the
 * visible list without adding a fact. Recorded as thin in the release report
 * rather than silently expanded.
 */
export function surahIndexJsonLd(surahs: SurahMeta[]): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Quran — ${surahs.length} surahs`,
    url: absoluteUrl("/quran"),
    inLanguage: ["ar", "en"],
    description: `The complete index of the ${surahs.length} surahs of the Quran, with Arabic names, transliteration, and verse counts.`,
    isPartOf: quranBook(),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: surahs.length,
    },
  };
}

/**
 * One surah.
 *
 * `Chapter` is a real schema.org type (a subtype of `Book`), and a surah is a
 * division of one work rather than a work with its own edition, so it is the
 * accurate term. `position` is the canonical order number from the validated
 * dataset — a fact, not an editorial ranking.
 */
export function chapterJsonLd(surah: SurahMeta): JsonLdNode {
  const url = absoluteUrl(`/quran/${surah.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: surah.transliteration,
    alternateName: surah.arabicName,
    description: surah.meaning,
    url,
    position: surah.id,
    inLanguage: ["ar", "en"],
    abstract: `Surah ${surah.id} of ${114}: ${surah.ayahCount} ayat, ${surah.revelation} revelation.`,
    ...(LICENSE_URL ? { license: LICENSE_URL } : {}),
    attribution: ATTRIBUTION,
    creditText: ATTRIBUTION,
    isPartOf: quranBook(),
  };
}

/**
 * An ayah reference page.
 *
 * The verse is typed structurally rather than by importing `Ayah`: the field
 * names this function needs are the ones the reader and the AI harness already
 * read off `getAyah()`'s result, and a structural parameter keeps this module's
 * import list to names verified to exist.
 *
 * The page is the `WebPage`; the verse is its `mainEntity`. A single verse is
 * not typed as a top-level `CreativeWork` — it has no edition, ISBN or
 * publication event to anchor that claim.
 */
export function ayahJsonLd(
  verse: { surah: number; ayah: number },
  surah: SurahMeta
): JsonLdNode {
  const url = absoluteUrl(`/ayah/${verse.surah}/${verse.ayah}`);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${surah.transliteration} ${verse.surah}:${verse.ayah} — ${SITE_NAME}`,
    url,
    inLanguage: ["ar", "en"],
    ...(LICENSE_URL ? { license: LICENSE_URL } : {}),
    copyrightNotice: ATTRIBUTION,
    creditText: ATTRIBUTION,
    isPartOf: quranBook(),
    mainEntity: {
      "@type": "CreativeWork",
      name: `Quran ${verse.surah}:${verse.ayah}`,
      position: verse.ayah,
      url,
      inLanguage: ["ar", "en"],
      isPartOf: chapterJsonLd(surah),
    },
  };
}

/**
 * A curated topic page.
 *
 * `creativeWorkStatus` carries the real review state alongside the non-tafsir
 * notice, so the structured record cannot be read as authoritative
 * interpretation even with the page body stripped away. `inLanguage` is the
 * topic's EDITORIAL language — the Quran text on the page is always Arabic and
 * is described by `quranBook`, not by this node.
 */
export function topicJsonLd(topic: Topic): JsonLdNode {
  const url = absoluteUrl(`/topics/${topic.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${topic.title} — Quran topics — ${SITE_NAME}`,
    url,
    inLanguage: topic.language,
    description: topic.summary,
    creativeWorkStatus: `${statusLabel(topic.provenance.status)} — ${NON_TAFSIR_NOTICE}`,
    attribution: topic.provenance.curator,
    creditText: `Curated via ${topic.provenance.method}; last editorial pass ${topic.provenance.reviewedAt}.`,
    isPartOf: { "@id": WEBSITE_NODE_ID },
    about: {
      "@type": "DefinedTerm",
      name: topic.title,
      alternateName: topic.arabicTitle,
      inDefinedTermSet: {
        "@type": "DefinedTermSet",
        name: `${SITE_NAME} curated topics`,
        url: absoluteUrl("/topics"),
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: topic.relations.length,
      itemListElement: topic.relations.map((relation, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: `Quran ${relation.ref.surah}:${relation.ref.ayah}`,
          url: absoluteUrl(`/ayah/${relation.ref.surah}/${relation.ref.ayah}`),
        },
      })),
    },
  };
}

/**
 * The vendored package as a Dataset — the one artifact this app actually
 * ingests, so the one place `Dataset` is accurate.
 */
function packageDataset(): JsonLdNode | null {
  if (!PACKAGE) return null;
  return {
    "@type": "Dataset",
    name: PACKAGE.provides,
    creator: PACKAGE.attribution,
    publisher: PACKAGE.publisher,
    version: PACKAGE.version,
    license: PACKAGE.licenseUrl ?? PACKAGE.license,
    url: PACKAGE.homepage,
    keywords: "bundled",
  };
}

/**
 * The source registry as a DataCatalog, one Dataset per catalog record.
 *
 * Each dataset carries its licence, version and delivery method verbatim from
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
