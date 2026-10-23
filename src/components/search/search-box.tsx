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

/**
 * Plain search input. Submits by navigating to /search?q=… so results are
 * linkable and the back button works. No fuzzy "AI" suggestions in MVP —
 * matching is transparent and rule-based (see lib/quran/search.ts).
 */
export function SearchBox({
  initialQuery = "",
  autoFocus = false,
  className,
  onSubmitOverride,
}: SearchBoxProps) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

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
        placeholder="Search a reference, translation, or Arabic text…"
        aria-label="Search the Quran"
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
    </form>
  );
}
