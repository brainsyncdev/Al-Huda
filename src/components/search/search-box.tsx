"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  /** Initial value (controlled by the URL query on /search). */
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
  /** Called on submit instead of navigating (optional). */
  onSubmitOverride?: (query: string) => void;
}

interface Suggestion {
  type: "surah" | "topic" | "reference";
  label: string;
  sublabel?: string;
  href: string;
  priority: number;
}

/**
 * Search input with autocomplete suggestions.
 *
 * Submits by navigating to /search?q=… so results are linkable and the back
 * button works. Suggestions are fetched from /api/search/suggestions, which
 * returns local-only, deterministic results from canonical surah names, topic
 * titles, and Quran references.
 *
 * Keyboard navigation: Arrow Up/Down to move through suggestions, Enter to
 * select, Escape to close. Mouse click also selects.
 */
export function SearchBox({
  initialQuery = "",
  autoFocus = false,
  className,
  onSubmitOverride,
}: SearchBoxProps) {
  const [value, setValue] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Fetch suggestions as the user types (min 2 chars, debounced)
  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestions(data.suggestions);
        setIsOpen(data.suggestions.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Failed to fetch suggestions:", err);
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce: wait 150ms before fetching
    const timeoutId = setTimeout(fetchSuggestions, 150);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (onSubmitOverride) {
      onSubmitOverride(q);
      return;
    }
    if (!q) return;
    // Preserve active filters when re-submitting from /search. A new query
    // should not wipe the user's surah/juz/topic/edition/language selection;
    // only `q` is replaced. Off-search pages (home, surah) still navigate to
    // a clean /search?q=… so unrelated params are not carried in.
    if (typeof window !== "undefined" && window.location.pathname === "/search") {
      const params = new URLSearchParams(window.location.search);
      params.set("q", q);
      router.push(`/search?${params.toString()}`);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function selectSuggestion(suggestion: Suggestion) {
    setValue(suggestion.label);
    setIsOpen(false);
    setActiveIndex(-1);
    router.push(suggestion.href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  // Scroll active suggestion into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("li");
      if (items[activeIndex]) {
        items[activeIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search a reference, translation, or Arabic text…"
        aria-label="Search the Quran"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
        aria-expanded={isOpen}
        aria-activedescendant={
          activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
        }
        autoComplete="off"
        spellCheck={false}
        className="h-12 w-full rounded-full border border-input bg-card pl-11 pr-24 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        Search
      </button>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-border bg-card shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.type}-${suggestion.href}`}
              id={`suggestion-${index}`}
              role="option"
              aria-selected={activeIndex === index}
              className={cn(
                "cursor-pointer px-4 py-3 text-sm transition-colors",
                activeIndex === index
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted"
              )}
              onClick={() => selectSuggestion(suggestion)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{suggestion.label}</div>
                  {suggestion.sublabel && (
                    <div className="text-xs text-muted-foreground truncate">
                      {suggestion.sublabel}
                    </div>
                  )}
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground/70 flex-shrink-0">
                  {suggestion.type === "reference" && "Verse"}
                  {suggestion.type === "surah" && "Surah"}
                  {suggestion.type === "topic" && "Topic"}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isLoading && isOpen && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-border bg-card p-4 shadow-lg">
          <div className="text-sm text-muted-foreground text-center">Loading suggestions…</div>
        </div>
      )}
    </form>
  );
}
