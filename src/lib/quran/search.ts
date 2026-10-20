// Quran search: references, Arabic text (normalized), English translation, and
// transliteration. Runs server-side against the full 6,236-ayah corpus.
//
// Arabic normalization is for MATCHING ONLY and never mutates stored text:
// we build a parallel normalized copy used solely for lookup. Per PRD, the
// displayed Arabic remains exactly as provided by the dataset.

import type { Ayah, ParsedReference } from "./types";
import type { MatchReason } from "./match-reasons";
import { getSurah, getSurahIndex } from "./data";
import { parseReference } from "./reference";
import { TOPICS, type Topic } from "../topics/data";

// The union is declared once, in ./match-reasons — a module with no filesystem
// dependency, so client components can import the FR-015 labels without
// dragging the server-only Quran loader into the bundle. Re-exported here so
// existing importers of search.ts keep working.
export type { MatchReason };

/** Strip Quranic diacritics/marks and unify common letter variants for lookup. */
export function normalizeArabic(input: string): string {
  return input
    .normalize("NFC")
    // Remove harakat, superscript alef, Quranic annotation marks, tatweel.
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    // Unify alef forms.
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    // Alef maqsura -> ya.
    .replace(/\u0649/g, "\u064A")
    // Ta marbuta -> ha (helps matching transliteration-style queries).
    .replace(/\u0629/g, "\u0647")
    .toLowerCase();
}

/** Lowercase, collapse whitespace, strip light punctuation for English lookups. */
export function normalizeLatin(input: string): string {
  return input
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface SearchHit {
  surah: number;
  ayah: number;
  surahTransliteration: string;
  surahSlug: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reason: MatchReason;
}

export interface SearchResults {
  query: string;
  reference: ParsedReference | null;
  hits: SearchHit[];
  /** True when the reference resolved to a surah/ayah but was out of range. */
  referenceOutOfRange: boolean;
  totalScanned: number;
}

let corpusCache: { arabic: Map<number, string>; latin: Map<number, string> } | null =
  null;

function key(surah: number, ayah: number): number {
  return surah * 1000 + ayah;
}

function ensureCorpus(): { arabic: Map<number, string>; latin: Map<number, string> } {
  if (corpusCache) return corpusCache;
  const arabic = new Map<number, string>();
  const latin = new Map<number, string>();
  for (const meta of getSurahIndex()) {
    const surah = getSurah(meta.id);
    if (!surah) continue;
    for (const a of surah.ayat) {
      const k = key(a.surah, a.ayah);
      arabic.set(k, normalizeArabic(a.arabic));
      latin.set(
        k,
        `${normalizeLatin(a.translation)} ${normalizeLatin(a.transliteration)}`
      );
    }
  }
  corpusCache = { arabic, latin };
  return corpusCache;
}

export interface SearchOptions {
  limit?: number;
}

// --- FR-014: curated topic-term expansion ---------------------------------
//
// This is NOT semantic / embedding-based retrieval. It is a bounded lexical
// expansion: query words are matched against curated topic titles and slugs
// using the same normalizeLatin already used for translation search. When a
// word matches a topic, that topic's editorially-selected ayat are appended
// as hits with reason "topic-term" so the UI can label them honestly.
//
// Full semantic retrieval (vector index, embeddings model) remains out of
// scope for the local-only architecture; the capability needed is recorded
// in docs/PRD-CHECKLIST.md.

/** Common English stopwords excluded from topic-term expansion. */
const TOPIC_STOPWORDS = new Set([
  "about", "above", "after", "again", "against", "also", "because", "before",
  "being", "below", "between", "both", "cannot", "could", "does", "doing",
  "down", "during", "each", "from", "further", "have", "having", "here",
  "hers", "herself", "him", "himself", "into", "itself", "just", "more",
  "most", "only", "other", "ours", "our", "over", "same", "should", "some",
  "such", "than", "that", "the", "their", "theirs", "them", "themselves",
  "then", "there", "these", "they", "this", "those", "through", "under",
  "until", "very", "were", "what", "when", "where", "which", "while",
  "with", "would", "your", "you",
]);

/** Extract meaningful query words for topic expansion (length >= 4, not stopword). */
function topicQueryTerms(normalizedQuery: string): string[] {
  return normalizedQuery
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !TOPIC_STOPWORDS.has(w));
}

interface TopicTermMatch {
  topic: Topic;
  term: string;
}

/**
 * Match query terms against curated topic titles, slugs, and Arabic titles
 * (normalized). Deterministic: topics in file order, first matching term wins
 * per topic.
 */
function matchTopicTerms(query: string): TopicTermMatch[] {
  const terms = topicQueryTerms(normalizeLatin(query));
  if (terms.length === 0) return [];
  const matches: TopicTermMatch[] = [];
  for (const topic of TOPICS) {
    const titleHay = normalizeLatin(`${topic.title} ${topic.slug.replace(/-/g, " ")}`);
    for (const term of terms) {
      if (titleHay.includes(term)) {
        matches.push({ topic, term });
        break;
      }
    }
  }
  return matches;
}

/** Cap on how many curated ayat a single topic-term match may contribute. */
const MAX_TOPIC_HITS_PER_TERM = 6;
/** Cap on total topic-term hits appended to any one search result set. */
const MAX_TOPIC_TERM_HITS = 12;

/** Full search entry point. Deterministic ordering: reference first (when the
 *  query is a valid reference), then surah-name matches, then verse-text
 *  matches ranked by lexical relevance tier (whole-word occurrences outrank
 *  substring echoes; translation outranks transliteration), with canonical
 *  mushaf order breaking every tie, then curated topic-term expansions
 *  (labeled). The tiers are rule-based scoring over the same normalized text
 *  the keyword search already used — not semantic similarity. See the FR-014
 *  note above for what full semantic retrieval would additionally require. */
export function searchQuran(query: string, options: SearchOptions = {}): SearchResults {
  const limit = options.limit ?? 50;
  const trimmed = query.trim();
  const empty: SearchResults = {
    query: trimmed,
    reference: null,
    hits: [],
    referenceOutOfRange: false,
    totalScanned: 0,
  };
  if (trimmed.length < 2) return empty;

  const index = getSurahIndex();
  const hits: SearchHit[] = [];

  // 1) Reference parsing ("2:255", "baqarah 255", "36").
  const reference = parseReference(trimmed);
  if (reference) {
    const surah = getSurah(reference.surah);
    if (surah) {
      if (reference.ayah !== undefined) {
        const ayah = surah.ayat[reference.ayah - 1];
        if (ayah) {
          hits.push(toHit(surah.transliteration, surah.slug, ayah, "reference"));
          return { query: trimmed, reference, hits, referenceOutOfRange: false, totalScanned: 0 };
        }
        return {
          query: trimmed,
          reference,
          hits,
          referenceOutOfRange: true,
          totalScanned: 0,
        };
      }
      // Surah-only reference: surface its first few ayat as entry points.
      for (const ayah of surah.ayat.slice(0, 3)) {
        hits.push(toHit(surah.transliteration, surah.slug, ayah, "surah-name"));
      }
      return { query: trimmed, reference, hits, referenceOutOfRange: false, totalScanned: 0 };
    }
  }

  // 2) Surah-name matching for non-reference text ("baqarah the cow").
  const latinQuery = normalizeLatin(trimmed);
  if (latinQuery) {
    for (const meta of index) {
      const nameHay = normalizeLatin(
        `${meta.transliteration} ${meta.meaning} ${meta.slug}`
      );
      if (nameHay.includes(latinQuery) && latinQuery.length >= 3) {
        const surah = getSurah(meta.id);
        if (surah) {
          for (const ayah of surah.ayat.slice(0, 2)) {
            hits.push(toHit(meta.transliteration, meta.slug, ayah, "surah-name"));
          }
        }
      }
    }
  }

  // 3) Arabic text search (normalized), then 4) translation/transliteration.
  //
  // The whole corpus is scanned and every match is scored before anything is
  // truncated, so ranking decisions see every candidate (a prefix-truncated
  // scan would rank only whichever surahs happen to come first canonically).
  const arabicQuery = normalizeArabic(trimmed);
  const isArabicQuery = /[\u0600-\u06FF]/.test(trimmed);
  const corpus = ensureCorpus();
  let scanned = 0;

  // Lexical relevance tiers for FR-014/FR-015 — rule-based, not semantic:
  // higher scores mean a closer textual match to the query as typed.
  const SCORE_ARABIC = 100; // direct match against the verse's own Arabic
  const SCORE_TRANSLATION_BASE = 60; // query appears in the English translation
  const SCORE_TRANSLITERATION = 40; // query appears in the Latin transliteration

  // Compiled once: word-boundary occurrences of the query in the translation
  // (normalized text contains only [a-z0-9 -], so \b behaves predictably).
  let wordRe: RegExp | null = null;
  if (latinQuery.length >= 2) {
    try {
      wordRe = new RegExp(
        `\\b${latinQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "g"
      );
    } catch {
      wordRe = null;
    }
  }

  type Scored = { hit: SearchHit; score: number };
  const scored: Scored[] = [];

  for (const meta of index) {
    const surah = getSurah(meta.id);
    if (!surah) continue;
    for (const ayah of surah.ayat) {
      scanned++;
      const k = key(ayah.surah, ayah.ayah);

      if (isArabicQuery && arabicQuery.length >= 2) {
        if (corpus.arabic.get(k)?.includes(arabicQuery)) {
          scored.push({
            hit: toHit(meta.transliteration, meta.slug, ayah, "arabic"),
            score: SCORE_ARABIC,
          });
          continue;
        }
      }

      if (latinQuery.length >= 2) {
        const hay = corpus.latin.get(k) ?? "";
        if (hay.includes(latinQuery)) {
          const tnorm = normalizeLatin(ayah.translation);
          const isTrans = tnorm.includes(latinQuery);
          const reason: MatchReason = isTrans ? "translation" : "transliteration";
          let score = isTrans ? SCORE_TRANSLATION_BASE : SCORE_TRANSLITERATION;
          if (isTrans && wordRe) {
            // Whole-word occurrences outrank substring echoes: for the query
            // "patience", a verse containing "patience" three times ranks
            // above one containing "patient" once. Deterministic and bounded.
            wordRe.lastIndex = 0;
            const matches = tnorm.match(wordRe);
            if (matches) {
              score += Math.min(20, matches.length * 5);
            }
          }
          scored.push({
            hit: toHit(meta.transliteration, meta.slug, ayah, reason),
            score,
          });
        }
      }
    }
  }

  // Relevance first; canonical mushaf order breaks ties so the ordering is
  // fully deterministic (the stable prefix property the search tests pin).
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.hit.surah !== b.hit.surah) return a.hit.surah - b.hit.surah;
    if (a.hit.ayah !== b.hit.ayah) return a.hit.ayah - b.hit.ayah;
    return a.hit.reason.localeCompare(b.hit.reason);
  });
  for (const s of scored) hits.push(s.hit);

  // 5) FR-014: curated topic-term expansion (Latin queries only, bounded).
  //    Skipped for reference queries (they returned early) and for pure
  //    Arabic queries, where topic titles (English/Arabic label) would not
  //    meaningfully expand the result set.
  if (!isArabicQuery && hits.length < limit) {
    const topicMatches = matchTopicTerms(trimmed);
    if (topicMatches.length > 0) {
      const existing = new Set(hits.map((h) => key(h.surah, h.ayah)));
      let topicHits = 0;
      for (const { topic } of topicMatches) {
        if (topicHits >= MAX_TOPIC_TERM_HITS || hits.length >= limit) break;
        let perTopic = 0;
        for (const relation of topic.relations) {
          if (perTopic >= MAX_TOPIC_HITS_PER_TERM || topicHits >= MAX_TOPIC_TERM_HITS || hits.length >= limit) {
            break;
          }
          const k = key(relation.ref.surah, relation.ref.ayah);
          if (existing.has(k)) continue;
          const surah = getSurah(relation.ref.surah);
          const ayah = surah?.ayat[relation.ref.ayah - 1];
          if (!surah || !ayah) continue;
          hits.push(toHit(surah.transliteration, surah.slug, ayah, "topic-term"));
          existing.add(k);
          topicHits++;
          perTopic++;
        }
      }
    }
  }

  return {
    query: trimmed,
    reference,
    hits: hits.slice(0, limit),
    referenceOutOfRange: false,
    totalScanned: scanned,
  };
}

function toHit(
  surahTransliteration: string,
  surahSlug: string,
  ayah: Ayah,
  reason: MatchReason
): SearchHit {
  return {
    surah: ayah.surah,
    ayah: ayah.ayah,
    surahTransliteration,
    surahSlug,
    arabic: ayah.arabic,
    translation: ayah.translation,
    transliteration: ayah.transliteration,
    reason,
  };
}

/** Highlight boundaries for an English quote snippet. Searches the raw
 *  translation text (case-insensitive); returns null when the literal query
 *  does not appear (e.g. only a normalized form matched). */
export function findSnippetRange(
  translation: string,
  query: string,
  pad = 60
): { text: string; matchStart: number; matchEnd: number } | null {
  const needle = query.trim().toLowerCase();
  if (!needle) return null;
  const start = translation.toLowerCase().indexOf(needle);
  if (start < 0) return null;

  const end = start + needle.length;
  const from = Math.max(0, start - pad);
  const to = Math.min(translation.length, end + pad);
  const prefix = from > 0 ? "…" : "";
  const text = `${prefix}${translation.slice(from, to)}${
    to < translation.length ? "…" : ""
  }`;
  return {
    text,
    matchStart: start - from + prefix.length,
    matchEnd: end - from + prefix.length,
  };
}
