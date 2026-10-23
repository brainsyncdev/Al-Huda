"use client";

// Semantic search panel (FR-014).
//
// Renders a secondary search mode alongside the lexical search box. When the
// user submits a query here, it is embedded in the browser using the same
// MiniLM model the build-time generator used, and the top ayat are returned
// ranked by cosine similarity. Nothing about the query leaves the device.
//
// The panel is opt-in: the default search path is lexical (fast, transparent).
// Semantic search is offered as a separate mode because the model download
// (~22 MB) and index load (~4.8 MB) are not free, and the results are not
// auditable the way lexical matches are.

import { useState, useEffect } from "react";
import { Brain, Loader2, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import {
  useSemanticSearch,
  preloadSemanticIndex,
  type SemanticHit,
} from "@/lib/quran/semantic-search";
import { cn } from "@/lib/utils";

interface VerseLookup {
  [key: string]: { surahName: string; translation: string } | null;
}

async function fetchVerses(hits: SemanticHit[]): Promise<VerseLookup> {
  const results = await Promise.all(
    hits.map(async (hit) => {
      try {
        const res = await fetch(`/api/v1/ayahs/${hit.surah}/${hit.ayah}`);
        if (!res.ok) return [`${hit.surah}:${hit.ayah}`, null] as const;
        const data = await res.json();
        return [
          `${hit.surah}:${hit.ayah}`,
          {
            surahName: data.surahInformation?.transliteration ?? "",
            translation: data.translation ?? "",
          },
        ] as const;
      } catch {
        return [`${hit.surah}:${hit.ayah}`, null] as const;
      }
    })
  );
  return Object.fromEntries(results);
}

export function SemanticSearchPanel() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SemanticHit[] | null>(null);
  const [verseLookup, setVerseLookup] = useState<VerseLookup>({});
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { status, search } = useSemanticSearch();

  useEffect(() => {
    preloadSemanticIndex();
  }, []);

  async function runSearch() {
    const q = query.trim();
    if (q.length < 2) return;
    setRunning(true);
    setError(null);
    try {
      const results = await search(q, 20);
      setHits(results);
      const lookup = await fetchVerses(results);
      setVerseLookup(lookup);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Semantic search failed"
      );
      setHits(null);
      setVerseLookup({});
    } finally {
      setRunning(false);
    }
  }

  return (
    <section
      aria-labelledby="semantic-search-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <div className="mb-3 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" aria-hidden />
        <h2 id="semantic-search-heading" className="font-display text-lg font-semibold">
          Semantic search
        </h2>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium",
            status === "ready"
              ? "bg-primary/10 text-primary"
              : status === "error"
                ? "bg-destructive/10 text-destructive"
                : "bg-secondary text-secondary-foreground"
          )}
        >
          {status === "loading" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Loading model
            </>
          )}
          {status === "ready" && "Ready"}
          {status === "error" && "Unavailable"}
          {status === "idle" && "Initialising"}
        </span>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        Find verses by meaning, not just keywords. Your query is embedded
        locally — nothing leaves your device. Uses the MiniLM model (22 MB,
        downloaded once and cached by your browser).
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runSearch();
            }}
            placeholder="e.g. patience in hardship, mercy to all beings…"
            disabled={status !== "ready" || running}
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
          />
        </div>
        <button
          type="button"
          onClick={runSearch}
          disabled={status !== "ready" || running || query.trim().length < 2}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {running ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Searching
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {error && (
        <p role="status" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {hits && hits.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          No semantically similar verses found for that query.
        </p>
      )}

      {hits && hits.length > 0 && (
        <ol className="mt-4 space-y-2">
          {hits.map((hit) => {
            const verse = verseLookup[`${hit.surah}:${hit.ayah}`];
            if (!verse) return null;
            return (
              <li
                key={`${hit.surah}:${hit.ayah}`}
                className="rounded-xl border border-border/70 bg-background/60 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Link
                    href={`/ayah/${hit.surah}/${hit.ayah}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {verse.surahName} {hit.surah}:{hit.ayah}
                  </Link>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[0.6875rem] font-medium tabular-nums text-secondary-foreground">
                    {(hit.score * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/85">
                  {verse.translation}
                </p>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-4 text-[0.6875rem] leading-relaxed text-muted-foreground">
        Semantic search is experimental. Results are ranked by vector
        similarity to the built-in English translation and are not a substitute
        for lexical search or scholarly interpretation. Model:{" "}
        <code className="rounded bg-secondary px-1">Xenova/all-MiniLM-L6-v2</code>{" "}
        (Apache 2.0).
      </p>
    </section>
  );
}
