"use client";

import Link from "next/link";
import { Check, ExternalLink, ShieldCheck, X } from "lucide-react";
import { BackupControls } from "@/components/library/backup-controls";
import {
  ARABIC_SIZES,
  LINE_HEIGHTS,
  MAX_PARALLEL_TRANSLATIONS,
  arabicSizeClass,
  usePrefs,
} from "@/lib/prefs/context";
import { TranslationSelector } from "@/components/quran/translation-selector";
import { RECITERS } from "@/lib/quran/audio";
import { TRANSLATIONS, getTranslation } from "@/lib/quran/translations";

export default function SettingsPage() {
  const {
    arabicSize,
    lineHeight,
    showTranslation,
    showTransliteration,
    translationId,
    showAudio,
    reciterId,
    parallelMode,
    parallelTranslationIds,
    setArabicSize,
    setLineHeight,
    setShowTranslation,
    setShowTransliteration,
    setShowAudio,
    setReciterId,
    setParallelMode,
    toggleParallelTranslation,
    hydrated: prefsHydrated,
  } = usePrefs();

  const primaryTranslation = getTranslation(translationId);
  const availableParallel = TRANSLATIONS.filter(
    (t) => t.id !== translationId && !parallelTranslationIds.includes(t.id)
  );

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
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Arabic text size">
              {ARABIC_SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setArabicSize(s)}
                  aria-pressed={arabicSize === s}
                  aria-label={`Text size: ${s === "sm" ? "small" : s === "md" ? "medium" : s === "lg" ? "large" : "extra large"}`}
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

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">Line spacing</h3>
              <p className="text-sm text-muted-foreground">Adjust vertical spacing between Arabic lines.</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Line spacing">
              {LINE_HEIGHTS.map((lh) => (
                <button
                  key={lh}
                  type="button"
                  onClick={() => setLineHeight(lh)}
                  aria-pressed={lineHeight === lh}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    lineHeight === lh
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {lineHeight === lh && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {lh.charAt(0).toUpperCase() + lh.slice(1)}
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

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold">Translation edition</h3>
              <p className="text-sm text-muted-foreground">
                Choose from 100+ translations in 50+ languages. Default: Urdu (Jalandhry).
              </p>
              <TranslationSelector />
            </div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={showTranslation}
                onChange={(e) => setShowTranslation(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <span>
                <span className="font-medium">Show translation</span>
                <p className="text-sm text-muted-foreground">Toggle translation visibility. The selected edition is shown above.</p>
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

            <div className="space-y-3 border-t border-border/70 pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={showAudio}
                  onChange={(e) => setShowAudio(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span>
                  <span className="font-medium">Audio recitation</span>
                  <p className="text-sm text-muted-foreground">
                    Show a Listen button under each verse. Audio streams only when you press play.
                  </p>
                </span>
              </label>
              {showAudio && (
                <div className="space-y-1.5 pl-7">
                  <label htmlFor="reciter-select" className="block text-xs font-medium text-muted-foreground">
                    Reciter
                  </label>
                  <select
                    id="reciter-select"
                    value={reciterId}
                    onChange={(e) => setReciterId(e.target.value)}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
                  >
                    {RECITERS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                        {r.nameArabic ? ` — ${r.nameArabic}` : ""}
                      </option>
                    ))}
                  </select>
                  <p className="text-[0.6875rem] text-muted-foreground">
                    Verse-by-verse MP3s from the Islamic Network CDN (everyayah.com recordings), streamed at 64 kbps.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 border-t border-border/70 pt-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={parallelMode}
                  onChange={(e) => setParallelMode(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <span>
                  <span className="font-medium">Compare translations side by side</span>
                  <p className="text-sm text-muted-foreground">
                    Show up to {MAX_PARALLEL_TRANSLATIONS} extra translations beneath the primary edition.
                  </p>
                </span>
              </label>

              {parallelMode && (
                <div className="space-y-3 pl-7">
                  <p className="text-xs text-muted-foreground">
                    Primary:{" "}
                    <span className="font-medium text-foreground">
                      {primaryTranslation
                        ? `${primaryTranslation.name} (${primaryTranslation.languageLabel})`
                        : translationId}
                    </span>
                  </p>

                  {parallelTranslationIds.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {parallelTranslationIds.map((id) => {
                        const meta = getTranslation(id);
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              onClick={() => toggleParallelTranslation(id)}
                              aria-label={`Remove ${meta?.name ?? id}`}
                              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              {meta ? `${meta.name} — ${meta.languageLabel}` : id}
                              <X className="h-3 w-3" aria-hidden />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {parallelTranslationIds.length < MAX_PARALLEL_TRANSLATIONS ? (
                    <div className="space-y-1.5">
                      <label htmlFor="parallel-add" className="block text-xs font-medium text-muted-foreground">
                        Add a translation
                      </label>
                      <select
                        id="parallel-add"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) toggleParallelTranslation(e.target.value);
                        }}
                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
                      >
                        <option value="">Choose a translation…</option>
                        {availableParallel.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} — {t.languageLabel}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[0.6875rem] text-muted-foreground">
                      Maximum of {MAX_PARALLEL_TRANSLATIONS} additional translations reached. Remove one to add another.
                    </p>
                  )}

                  <p className="text-[0.6875rem] text-muted-foreground">
                    Each edition downloads once per session and is held in memory — roughly 1.5 MB per translation.
                  </p>
                </div>
              )}
            </div>
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
