// Client component for root listing with search, pagination, and filters.
// Sprint 49: Uses Sprint 48 registry data with transliteration search.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  FileWarning,
  Info,
  Search,
} from "lucide-react";
import type { Sprint48Registry, Sprint48RegistryRoot } from "@/lib/morphology/sprint-48-root-data";

type StatusFilter = "all" | "activated" | "partially-activated" | "needs-review" | "discovered";
type SortOption = "alphabetical" | "occurrences-desc" | "ayat-desc" | "transliteration";

interface RootListingClientProps {
  registry: Sprint48Registry;
}

const PAGE_SIZE = 50;

export default function RootListingClient({ registry }: RootListingClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("alphabetical");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort roots
  const filteredRoots = useMemo(() => {
    let filtered = registry.roots;

    // Search filter (Arabic, transliteration, or slug)
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((r) => {
        // Arabic match
        if (r.root.includes(searchQuery.trim())) return true;
        // Transliteration match
        if (r.transliteration && r.transliteration.includes(query)) return true;
        // Slug match
        if (r.slug.toLowerCase().includes(query)) return true;
        return false;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Sort
    const sorted = [...filtered];
    if (sortOption === "alphabetical") {
      sorted.sort((a, b) => a.root.localeCompare(b.root));
    } else if (sortOption === "occurrences-desc") {
      sorted.sort((a, b) => b.occurrenceCount - a.occurrenceCount);
    } else if (sortOption === "ayat-desc") {
      sorted.sort((a, b) => b.distinctAyahCount - a.distinctAyahCount);
    } else if (sortOption === "transliteration") {
      sorted.sort((a, b) => (a.transliteration ?? "").localeCompare(b.transliteration ?? ""));
    }

    return sorted;
  }, [registry.roots, searchQuery, statusFilter, sortOption]);

  // Pagination
  const totalPages = Math.ceil(filteredRoots.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRoots = filteredRoots.slice(startIndex, startIndex + PAGE_SIZE);

  // Reset to page 1 when filters change
  const handleFilterChange = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    setCurrentPage(1);
  };

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = {
      all: registry.roots.length,
      activated: 0,
      "partially-activated": 0,
      "needs-review": 0,
      discovered: 0,
    };
    for (const root of registry.roots) {
      counts[root.status]++;
    }
    return counts;
  }, [registry.roots]);

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search by Arabic root, transliteration, or slug..."
            value={searchQuery}
            onChange={(e) =>
              handleFilterChange(setSearchQuery, e.target.value)
            }
            className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Search roots"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-muted-foreground"
            >
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) =>
                handleFilterChange(
                  setStatusFilter,
                  e.target.value as StatusFilter
                )
              }
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="activated">Activated ({statusCounts.activated})</option>
              <option value="partially-activated">
                Partially available ({statusCounts["partially-activated"]})
              </option>
              <option value="needs-review">
                Under review ({statusCounts["needs-review"]})
              </option>
              <option value="discovered">
                Not activated ({statusCounts.discovered})
              </option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-option"
              className="text-sm font-medium text-muted-foreground"
            >
              Sort:
            </label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) =>
                handleFilterChange(setSortOption, e.target.value as SortOption)
              }
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="alphabetical">Arabic (A→Z)</option>
              <option value="transliteration">Transliteration (A→Z)</option>
              <option value="occurrences-desc">Most occurrences</option>
              <option value="ayat-desc">Most ayat</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Showing {paginatedRoots.length} of {filteredRoots.length} roots
          {searchQuery.trim() && ` matching "${searchQuery.trim()}"`}
        </p>
      </div>

      {/* Root cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {paginatedRoots.map((root) => (
          <RootCard key={root.slug} root={root} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong className="text-foreground">Source integrity.</strong> All
            occurrence counts are derived from QUL morphology v1 and validated
            against the pinned Quran dataset. Automated activation means the
            data passed deterministic checks; it is not a scholarly approval.
          </span>
        </p>
      </footer>
    </div>
  );
}

function RootCard({ root }: { root: Sprint48RegistryRoot }) {
  const statusLabel =
    root.status === "activated"
      ? "Activated"
      : root.status === "partially-activated"
        ? "Partially available"
        : root.status === "needs-review"
          ? "Under review"
          : "Not activated";

  const statusIcon =
    root.status === "activated" ? (
      <CheckCircle2
        className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
        aria-label="Activated"
      />
    ) : root.status === "partially-activated" ? (
      <CheckCircle2
        className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
        aria-label="Partially available"
      />
    ) : root.status === "needs-review" ? (
      <Clock
        className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
        aria-label="Under review"
      />
    ) : (
      <FileWarning
        className="h-5 w-5 shrink-0 text-muted-foreground"
        aria-label="Not activated"
      />
    );

  const isClickable = root.status === "activated" || root.status === "partially-activated";

  const cardContent = (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold">
            <span className="arabic-display mr-2 text-gold" lang="ar" dir="rtl">
              {root.root}
            </span>
            {root.transliteration && (
              <span className="text-muted-foreground">({root.transliteration})</span>
            )}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {root.occurrenceCount} occurrences · {root.distinctAyahCount} ayat
          </p>
        </div>
        {statusIcon}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Occurrences</div>
          <div className="font-semibold">{root.occurrenceCount}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Ayat</div>
          <div className="font-semibold">{root.distinctAyahCount}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Lemmas</div>
          <div className="font-semibold">{root.autoAcceptedLemmas}</div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{statusLabel}</p>

      {root.missingLemmaRecords > 0 && (
        <p className="text-xs text-muted-foreground">
          {root.missingLemmaRecords} missing lemmas disclosed
        </p>
      )}
    </div>
  );

  if (isClickable) {
    return (
      <Link href={`/explore/root/${root.slug}`} className="group">
        {cardContent}
      </Link>
    );
  }

  return <div className="opacity-70">{cardContent}</div>;
}
