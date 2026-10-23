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
 * Search result filters (FR-012).
 *
 * Four dimensions: Surah, revelation type, Juz, and curated topic. Translation
 * edition is deliberately absent — the app ships one verified translation, so
 * an edition filter would be a control with one option (FR-033 is blocked on
 * redistribution rights, see docs/DATA-PROVENANCE.md).
 *
 * Every URL value is validated before use, and the next query string is
 * rebuilt from validated values only, so a hand-edited `?surah=999` cannot be
 * carried forward or leave a select blank.
 */
export function SearchFilters({ surahOptions, topicOptions }: SearchFiltersProps) {
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

  const hasFilters = Boolean(surah || type || juz || topic);
  // Show "Clear all" even when the only active params are invalid, so the
  // user has a one-click way out of a bad hand-edited URL.
  const hasAnyFilterParam = Boolean(rawSurah || rawType || rawJuz || rawTopic);

  const FILTER_KEYS = ["surah", "type", "juz", "topic"] as const;

  function updateFilter(key: (typeof FILTER_KEYS)[number], value: string) {
    const next = new URLSearchParams();
    const q = params.get("q");
    if (q) next.set("q", q);
    if (key !== "surah" && surah) next.set("surah", surah);
    if (key !== "type" && type) next.set("type", type);
    if (key !== "juz" && juz) next.set("juz", juz);
    if (key !== "topic" && topic) next.set("topic", topic);
    if (value) next.set(key, value);
    const qs = next.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  }

  function clearAll() {
    const q = params.get("q");
    const next = q ? `?q=${encodeURIComponent(q)}` : "";
    router.push(`/search${next}`);
  }

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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Surah</span>
          <select
            value={surah}
            onChange={(e) => updateFilter("surah", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All surahs</option>
            {surahOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.id}. {s.transliteration}</option>
            ))}
          </select>
        </label>

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

        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Juz</span>
          <select
            value={juz}
            onChange={(e) => updateFilter("juz", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All juz</option>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
              <option key={j} value={j}>Juz {j}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="block text-xs font-medium text-muted-foreground">Curated topic</span>
          <select
            value={topic}
            onChange={(e) => updateFilter("topic", e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="">All topics</option>
            {topicOptions.map((t) => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
        </label>
      </div>

      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-1.5">
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
          {juz && (
            <FilterChip label={`Juz ${juz}`} onRemove={() => updateFilter("juz", "")} />
          )}
          {topic && (
            <FilterChip
              label={`Topic: ${topicOptions.find((t) => t.slug === topic)?.title ?? topic}`}
              onRemove={() => updateFilter("topic", "")}
            />
          )}
        </div>
      )}

      {topic && (
        <p className="mt-3 text-xs text-muted-foreground">
          The topic filter matches curated selections only — it shows verses a
          reviewer placed in that topic, not every verse on the theme. Topic
          pages state their review status.
        </p>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
      {label}
      <button type="button" onClick={onRemove} className="rounded-full p-0.5 hover:bg-primary/20" aria-label={`Remove ${label}`}>
        <X className="h-3 w-3" aria-hidden />
      </button>
    </span>
  );
}