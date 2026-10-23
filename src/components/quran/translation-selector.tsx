"use client";

import { useState, useMemo } from "react";
import { usePrefs } from "@/lib/prefs/context";
import {
  TRANSLATIONS,
  getTranslationsByLanguage,
  LANGUAGE_LABELS,
  getTranslation,
  type TranslationMeta,
} from "@/lib/quran/translations";
import { ensureLoaded, isLoaded } from "@/lib/quran/translation-store";
import { Loader2, Check, Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Translation selector dropdown.
 * Allows users to choose which translation to display.
 * Groups translations by language for easy browsing.
 */
export function TranslationSelector({ compact = false }: { compact?: boolean }) {
  const { translationId, setTranslationId, hydrated } = usePrefs();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const grouped = useMemo(() => getTranslationsByLanguage(), []);
  const currentTranslation = getTranslation(translationId);

  const handleSelect = async (translation: TranslationMeta) => {
    if (translation.id === translationId) {
      setIsOpen(false);
      return;
    }

    setLoading(translation.id);

    // Load translation data if not already cached
    if (!isLoaded(translation.id)) {
      try {
        await ensureLoaded(translation.id);
      } catch {
        console.error(`Failed to load translation: ${translation.id}`);
        setLoading(null);
        return;
      }
    }

    setTranslationId(translation.id);
    setLoading(null);
    setIsOpen(false);
    setSearch("");
  };

  // Filter translations by search
  const filteredGrouped = useMemo(() => {
    if (!search) return grouped;
    const q = search.toLowerCase();
    const result: Record<string, TranslationMeta[]> = {};
    for (const [lang, translations] of Object.entries(grouped)) {
      const matches = translations.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.languageLabel.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
      if (matches.length > 0) {
        result[lang] = matches;
      }
    }
    return result;
  }, [grouped, search]);

  if (!hydrated) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border/60 bg-card text-sm text-muted-foreground",
          compact ? "px-2 py-1.5" : "px-3 py-2"
        )}
      >
        <Globe className="h-4 w-4" />
        <span>Loading…</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border/60 bg-card text-sm font-medium text-foreground transition-colors hover:bg-accent/50",
          compact ? "px-2 py-1.5" : "px-3 py-2"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4 shrink-0" />
        <span className="max-w-[120px] truncate sm:max-w-[200px]">
          {currentTranslation?.name ?? "Select translation"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setSearch("");
            }}
          />

          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border/80 bg-card shadow-lg">
            {/* Search */}
            <div className="border-b border-border/60 p-3">
              <input
                type="text"
                placeholder="Search translations…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                autoFocus
              />
            </div>

            {/* Translation list */}
            <div className="max-h-96 overflow-y-auto" role="listbox">
              {Object.entries(filteredGrouped).map(([lang, translations]) => (
                <div key={lang}>
                  <div className="sticky top-0 bg-muted/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {LANGUAGE_LABELS[lang] ?? lang}
                  </div>
                  {translations.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      role="option"
                      aria-selected={t.id === translationId}
                      onClick={() => handleSelect(t)}
                      disabled={loading !== null}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-accent/50 disabled:opacity-50"
                    >
                      <span className="flex-1">
                        <span className="font-medium">{t.name}</span>
                        {t.direction === "rtl" && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (RTL)
                          </span>
                        )}
                      </span>
                      {t.id === translationId && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                      {loading === t.id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              ))}
              {Object.keys(filteredGrouped).length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No translations match &ldquo;{search}&rdquo;
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">
              Translations via Tanzil.net
            </div>
          </div>
        </>
      )}
    </div>
  );
}
