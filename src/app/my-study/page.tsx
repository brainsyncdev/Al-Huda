"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  FolderHeart,
  NotebookPen,
  Search,
  Settings,
} from "lucide-react";
import { useLibrary } from "@/lib/library/context";

export default function MyStudyDashboard() {
  const { bookmarks, notes, collections, progress, hydrated } =
    useLibrary();

  const recent = useMemo(() => progress.slice(0, 5), [progress]);
  const lastRead = progress[0];

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          My Study
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Your private Quran study workspace. Bookmarks, notes, collections,
          and reading progress — stored only on this device. No account,
          no cloud sync, no analytics.
        </p>
      </header>

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading your study workspace…
        </div>
      )}

      {hydrated &&
        bookmarks.length === 0 &&
        notes.length === 0 &&
        collections.length === 0 &&
        progress.length === 0 && (
          <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
            <BookOpen
              className="mx-auto h-8 w-8 text-muted-foreground"
              aria-hidden
            />
            <h2 className="mt-3 font-display text-lg font-semibold">
              Welcome to your study workspace
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by opening the Quran reader. Bookmark ayat, write private
              notes, and organize them into collections — everything stays on
              your device.
            </p>
            <Link
              href="/quran"
              className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open Quran reader
            </Link>
          </div>
        )}

      {hydrated &&
        (bookmarks.length > 0 ||
          notes.length > 0 ||
          collections.length > 0 ||
          progress.length > 0) && (
          <>
            {/* Overview stats */}
            <section aria-labelledby="overview" className="space-y-3">
              <h2
                id="overview"
                className="font-display text-xl font-semibold tracking-tight"
              >
                Overview
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  label="Bookmarks"
                  value={bookmarks.length}
                  icon={<Bookmark className="h-4 w-4 text-gold" aria-hidden />}
                />
                <StatCard
                  label="Notes"
                  value={notes.length}
                  icon={<NotebookPen className="h-4 w-4 text-gold" aria-hidden />}
                />
                <StatCard
                  label="Collections"
                  value={collections.length}
                  icon={<FolderHeart className="h-4 w-4 text-gold" aria-hidden />}
                />
                <StatCard
                  label="Recent reads"
                  value={progress.length}
                  icon={<BookOpen className="h-4 w-4 text-gold" aria-hidden />}
                />
              </div>
            </section>

            {/* Continue reading */}
            {lastRead && (
              <section
                aria-labelledby="continue-reading"
                className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-soft/50 to-secondary/30 p-5"
              >
                <h2
                  id="continue-reading"
                  className="font-display text-lg font-semibold tracking-tight"
                >
                  Continue reading
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Last read Surah {lastRead.surah}:
                  {lastRead.ayah} ·{" "}
                  {new Date(lastRead.at).toLocaleString()}
                </p>
                <Link
                  href={`/ayah/${lastRead.surah}/${lastRead.ayah}`}
                  className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Resume
                </Link>
              </section>
            )}

            {/* Quick actions */}
            <section aria-labelledby="quick-actions" className="space-y-3">
              <h2
                id="quick-actions"
                className="font-display text-xl font-semibold tracking-tight"
              >
                Quick actions
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <QuickAction
                  href="/my-study/bookmarks"
                  label="Bookmarks"
                  icon={<Bookmark className="h-5 w-5" aria-hidden />}
                />
                <QuickAction
                  href="/my-study/notes"
                  label="My notes"
                  icon={<NotebookPen className="h-5 w-5" aria-hidden />}
                />
                <QuickAction
                  href="/my-study/collections"
                  label="Collections"
                  icon={<FolderHeart className="h-5 w-5" aria-hidden />}
                />
                <QuickAction
                  href="/my-study/search"
                  label="Search"
                  icon={<Search className="h-5 w-5" aria-hidden />}
                />
                <QuickAction
                  href="/my-study/settings"
                  label="Settings"
                  icon={<Settings className="h-5 w-5" aria-hidden />}
                />
              </div>
            </section>

            {/* Recently read */}
            {recent.length > 0 && (
              <section aria-labelledby="recent" className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2
                    id="recent"
                    className="font-display text-xl font-semibold tracking-tight"
                  >
                    Recently read
                  </h2>
                  <Link
                    href="/my-study"
                    className="text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
                  >
                    View all
                  </Link>
                </div>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {recent.map((p) => (
                    <li key={`${p.surah}:${p.ayah}:${p.at}`}>
                      <Link
                        href={`/ayah/${p.surah}/${p.ayah}`}
                        className="flex h-full items-center justify-between gap-2 rounded-2xl border border-border/80 bg-card px-4 py-3 text-sm transition-colors hover:bg-secondary/40"
                      >
                        <span className="font-medium">
                          Surah {p.surah}:{p.ayah}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(p.at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border/80 bg-card p-4 text-center transition-colors hover:bg-secondary/40"
    >
      <span className="text-gold">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
