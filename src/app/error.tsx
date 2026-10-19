"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

/**
 * Root error boundary. Reached when a server or client component throws and
 * no nearer boundary handles it — for example if the bundled Quran dataset
 * fails its structural validation and a loader throws.
 *
 * The dataset loaders throw rather than degrade, so this screen is the
 * honest place to say "reading is unavailable" instead of rendering partial
 * or reconstructed text.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced to the browser console for diagnosis. There is no error
    // reporting service in this app by design (no analytics, PRD §10).
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl space-y-6 py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-destructive">
        Something went wrong
      </p>

      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Reading is unavailable right now
      </h1>

      <p className="text-pretty text-muted-foreground">
        The verse text could not be loaded. Rather than show partial or
        substituted text, Al-Huda stops here. Your bookmarks, notes, and
        reading history are stored on this device and are unaffected.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          Back to home
        </Link>
      </div>

      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      )}
    </div>
  );
}
