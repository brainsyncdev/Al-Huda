"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter, X } from "lucide-react";

interface SearchFiltersProps {
  surahOptions: { id: number; transliteration: string }[];
}

export function SearchFilters({ surahOptions }: SearchFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  // Validate URL params before using them as controlled values so an invalid
  // manual param cannot leave a select blank or be carried forward.
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
  const hasFilters = Boolean(surah || type || juz);
  // Show "Clear all" even when the only active params are invalid, so the
  // user has a one-click way out of a bad hand-edited URL.
  const hasAnyFilterParam = Boolean(rawSurah || rawType || rawJuz);

  function updateFilter(key: string, value: string) {
    // Rebuild from validated values only; invalid params are dropped.
    const next = new URLSearchParams();
    const q = params.get("q");
    if (q) next.set("q", q);
    if (key !== "surah" && surah) next.set("surah", surah);
    if (key !== "type" && type) next.set("type", type);
    if (key !== "juz" && juz) next.set("juz", juz);
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
        </div>
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
