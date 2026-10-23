"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";
import type { TranslationMeta } from "@/lib/quran/translations";

interface SearchFiltersProps {
  surahOptions: { id: number; transliteration: string }[];
  topicOptions: { slug: string; title: string }[];
  /** Available translation editions for edition-scoped search (FR-012). */
  editions?: TranslationMeta[];
}

/**
 * Unified search filters (FR-012, FR-035).
 *
 * Seven dimensions: search scope (default/tafsir/edition), language, Surah,
 * revelation type, Juz, and curated topic. The search scope control unifies
 * the former edition picker and tafsir mode into a single dropdown, so users
 * can switch contexts from the results page without navigating back to the
 * empty state.
 *
 * Every URL value is validated before use, and the next query string is
 * rebuilt from validated values only, so a hand-edited `?surah=999` cannot be
 * carried forward or leave a select blank.
 */
export function SearchFilters({ surahOptions, topicOptions, editions = [] }: SearchFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  const rawSurah = params.get("surah") ?? "";
  const surah = surahOptions.some((s) => String(s.id) === rawSurah) ? rawSurah : "";

  const rawType = params.get("type") ?? "";
  const type = rawType === "meccan" || rawType === "medinan" ? rawType : "";

  const rawJuz = params.get("juz") ?? "";
  const parsedJuz = rawJuz ? Number(rawJuz) : NaN;
  const juz =
    Number.isInteger(parsedJuz) && parsedJuz >= 1 && parsedJuz <= 30
      ? String(parsedJuz)
      : "";

  const rawTopic = params.get("topic") ?? "";
  const topic = topicOptions.some((t) => t.slug === rawTopic) ? rawTopic : "";

  const rawEdition = params.get("edition") ?? "";
  const edition = editions.some((e) => e.id === rawEdition) ? rawEdition : "";

  const rawMode = params.get("mode") ?? "";
  const mode = rawMode === "tafsir" ? "tafsir" : "";

  const rawLanguage = params.get("language") ?? "";
  const language = rawLanguage === "ar" || rawLanguage === "en" ? rawLanguage : "";

  // Compute the "searchIn" value from edition + mode (mutually exclusive).
  let searchIn = "default";
  if (mode === "tafsir") searchIn = "tafsir";
  else if (edition) searchIn = edition;

  const hasFilters = Boolean(surah || type || juz || topic || edition || mode || language);
  const hasAnyFilterParam = Boolean(
    params.get("surah") ||
      params.get("type") ||
      params.get("juz") ||
      params.get("topic") ||
      params.get("edition") ||
      params.get("mode") ||
      params.get("language")
  );

  /**
   * Update one filter key. Edition and mode are mutually exclusive: setting one
   * clears the other. All other filters are preserved across updates.
   */
  function updateFilter(
    key: "surah" | "type" | "juz" | "topic" | "language" | "edition" | "mode",
    value: string
  ) {
    const next = new URLSearchParams();
    const q = params.get("q");
    if (q) next.set("q", q);

    // Preserve existing filters unless this update clears them.
    if (key !== "surah" && surah) next.set("surah", surah);
    if (key !== "type" && type) next.set("type", type);
    if (key !== "juz" && juz) next.set("juz", juz);
    if (key !== "topic" && topic) next.set("topic", topic);
    if (key !== "language" && language) next.set("language", language);

    // Edition and mode are mutually exclusive.
    if (key === "edition") {
      // Setting edition clears mode.
      if (value) next.set("edition", value);
    } else if (key === "mode") {
      // Setting mode clears edition.
      if (value) next.set("mode", value);
    } else {
      // Preserve existing edition/mode.
      if (edition) next.set("edition", edition);
      if (mode) next.set("mode", mode);
    }

    if (value) next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  /**
   * Handle the "Search in" dropdown, which affects two params (edition + mode).
   * Building the URL directly avoids the mutual-exclusion logic in updateFilter.
   */
  function updateSearchIn(value: string) {
    const next = new URLSearchParams();
    const q = params.get("q");
    if (q) next.set("q", q);

    if (value === "default") {
      // Clear both edition and mode.
    } else if (value === "tafsir") {
      next.set("mode", "tafsir");
    } else {
      // Specific edition id.
      next.set("edition", value);
    }

    // Preserve other filters.
    if (surah) next.set("surah", surah);
    if (type) next.set("type", type);
    if (juz) next.set("juz", juz);
    if (topic) next.set("topic", topic);
    if (language) next.set("language", language);

    const qs = next.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function clearAll() {
    const q = params.get("q");
    const next = q ? `?q=${encodeURIComponent(q)}` : "";
    router.push(`/search${next}`);
  }

  // Group editions by language for the select.
  const editionsByLang = new Map<string, TranslationMeta[]>();
  for (const e of editions) {
    const group = editionsByLang.get(e.language) ?? [];
    group.push(e);
    editionsByLang.set(e.language, group);
  }

  // Language filter only applies to default search.
  const languageDisabled = searchIn !== "default";

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" aria-hidden />
          <h2 className="text-sm font-semibold">Filters</h2>
        </div>
        {hasAnyFilterParam && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-3 w-3" aria-hidden />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search in (unifies edition + mode) */}
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Search in</span>
          <select
            value={searchIn}
            onChange={(e) => updateSearchIn(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="default">Default (Arabic + built-in English)</option>
            <option value="tafsir">Both classical tafsirs</option>
            {Array.from(editionsByLang.entries()).map(([lang, eds]) => (
              <optgroup key={lang} label={eds[0].languageLabel}>
                {eds.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        {/* Language (only for default search) */}
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Language</span>
          <select
            value={language}
            onChange={(e) => updateFilter("language", e.target.value)}
            disabled={languageDisabled}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
          >
            <option value="">Any</option>
            <option value="ar">Arabic text only</option>
            <option value="en">English text only</option>
          </select>
        </label>

        {/* Surah */}
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Surah</span>
          <select
            value={surah}
            onChange={(e) => updateFilter("surah", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All surahs</option>
            {surahOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}. {s.transliteration}
              </option>
            ))}
          </select>
        </label>

        {/* Revelation type */}
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Revelation type</span>
          <select
            value={type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All types</option>
            <option value="meccan">Meccan</option>
            <option value="medinan">Medinan</option>
          </select>
        </label>

        {/* Juz */}
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Juz</span>
          <select
            value={juz}
            onChange={(e) => updateFilter("juz", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All juz</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
              <option key={j} value={j}>
                Juz {j}
              </option>
            ))}
          </select>
        </label>

        {/* Curated topic */}
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Curated topic</span>
          <select
            value={topic}
            onChange={(e) => updateFilter("topic", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All topics</option>
            {topicOptions.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {searchIn === "tafsir" && (
            <FilterChip label="Classical tafsirs" onRemove={() => updateFilter("mode", "")} />
          )}
          {searchIn !== "default" && searchIn !== "tafsir" && (
            <FilterChip
              label={`Edition: ${editions.find((e) => e.id === searchIn)?.name ?? searchIn}`}
              onRemove={() => updateFilter("edition", "")}
            />
          )}
          {language && (
            <FilterChip
              label={language === "ar" ? "Arabic only" : "English only"}
              onRemove={() => updateFilter("language", "")}
            />
          )}
          {surah && (
            <FilterChip
              label={`Surah ${surahOptions.find((s) => s.id === Number(surah))?.transliteration ?? surah}`}
              onRemove={() => updateFilter("surah", "")}
            />
          )}
          {type && (
            <FilterChip
              label={type === "meccan" ? "Meccan" : "Medinan"}
              onRemove={() => updateFilter("type", "")}
            />
          )}
          {juz && <FilterChip label={`Juz ${juz}`} onRemove={() => updateFilter("juz", "")} />}
          {topic && (
            <FilterChip
              label={`Topic: ${topicOptions.find((t) => t.slug === topic)?.title ?? topic}`}
              onRemove={() => updateFilter("topic", "")}
            />
          )}
        </div>
      )}

      {/* Contextual notes */}
      {topic && (
        <p className="mt-3 text-xs text-muted-foreground">
          The topic filter matches curated selections only — it shows verses a
          reviewer placed in that topic, not every verse on the theme. Topic
          pages state their review status.
        </p>
      )}
      {searchIn === "tafsir" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Tafsir search matches literal substrings in classical Arabic exegesis
          after normalization. Surah, juz, and topic filters narrow the matched
          verses.
        </p>
      )}
      {searchIn !== "default" && searchIn !== "tafsir" && (
        <p className="mt-3 text-xs text-muted-foreground">
          Edition search matches literal substrings in the translation text
          after normalization. Surah, juz, and topic filters narrow the matched
          verses.
        </p>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="rounded-full p-0.5 hover:bg-primary/20"
        aria-label={`Remove ${label}`}
      >
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  );
}
