"use client";

import Link from "next/link";
import { Check, ExternalLink, ShieldCheck } from "lucide-react";
import { BackupControls } from "@/components/library/backup-controls";
import { ARABIC_SIZES, arabicSizeClass, usePrefs } from "@/lib/prefs/context";

export default function SettingsPage() {
  const {
    arabicSize,
    showTranslation,
    showTransliteration,
    setArabicSize,
    setShowTranslation,
    setShowTransliteration,
    hydrated: prefsHydrated,
  } = usePrefs();

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Reader preferences stored only on this device.
        </p>
      </header>

      <section aria-labelledby="reading-prefs" className="space-y-4">
        <h2 id="reading-prefs" className="font-display text-xl font-semibold tracking-tight">
          Reading preferences
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">Arabic text size</h3>
              <p className="text-sm text-muted-foreground">Affects Uthmani Arabic in readers and topic pages.</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ARABIC_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setArabicSize(s)}
                  aria-pressed={arabicSize === s}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    arabicSize === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {s === arabicSize && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {prefsHydrated && (
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p lang="ar" dir="rtl" className={`${arabicSizeClass(arabicSize)} arabic-text text-foreground`}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Preview of Arabic size</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span>
                <span className="font-medium">Show English translation (Saheeh International)</span>
                <p className="text-sm text-muted-foreground">Displayed verbatim from the pinned dataset.</p>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={showTransliteration}
                onChange={(e) => setShowTransliteration(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span>
                <span className="font-medium">Show transliteration</span>
                <p className="text-sm text-muted-foreground">Only for reading aid; never a substitute for Arabic text.</p>
              </span>
            </label>
          </div>
        </div>
      </section>

      <section aria-labelledby="local-data" className="space-y-4">
        <h2 id="local-data" className="font-display text-xl font-semibold tracking-tight">
          Your local data
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Bookmarks, private notes, reading history, your revision plan, and
            preferences stay in your browser’s localStorage. We do not collect them.
          </p>
          {/* FR-044 / Journey D acceptance: state the flip side of local-only
              storage, so the privacy guarantee is not mistaken for durability. */}
          <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Local storage is not a backup.
            </span>{" "}
            Because nothing is uploaded, there is no server copy to restore from.
            Clearing site data or cookies, browsing in a private or incognito
            window, switching browser or device, or uninstalling the browser will
            erase these preferences, your library, and your revision plan. Use
            Export backup first if you want to keep them.
          </p>
          <BackupControls />
        </div>
      </section>

      <section aria-labelledby="policies" className="space-y-4">
        <h2 id="policies" className="font-display text-xl font-semibold tracking-tight">
          Policies &amp; compliance
        </h2>
        <ul className="space-y-2">
          <li>
            <Link href="/settings/privacy" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
                Privacy &amp; local storage
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/sources" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
                Sources &amp; provenance
              </span>
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              Privacy policy
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/terms" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              Terms of use
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/accessibility" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              Accessibility statement
              <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
