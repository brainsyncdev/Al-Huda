"use client";

import Link from "next/link";
import { Check, ChevronRight, ShieldCheck, X } from "lucide-react";
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
import { useTranslation } from "@/lib/i18n/context";

export default function SettingsPage() {
  const t = useTranslation();
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
    (tr) => tr.id !== translationId && !parallelTranslationIds.includes(tr.id)
  );

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("settings.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </header>

      <section aria-labelledby="reading-prefs" className="space-y-4">
        <h2 id="reading-prefs" className="font-display text-xl font-semibold tracking-tight">
          {t("settings.readingPrefs")}
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">{t("settings.arabicSize")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.arabicSizeDesc")}</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("settings.arabicSize")}>
              {ARABIC_SIZES.map((s) => {
                const sizeLabel = s === "sm" ? t("settings.sizeSmall") : s === "md" ? t("settings.sizeMedium") : s === "lg" ? t("settings.sizeLarge") : t("settings.sizeExtraLarge");
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setArabicSize(s)}
                    aria-pressed={arabicSize === s}
                    aria-label={t("settings.arabicSizeLabel", { size: sizeLabel })}
                    className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors ${
                      arabicSize === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {s === arabicSize && <Check className="h-3.5 w-3.5" aria-hidden />}
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold">{t("settings.lineSpacing")}</h3>
              <p className="text-sm text-muted-foreground">{t("settings.lineSpacingDesc")}</p>
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("settings.lineSpacing")}>
              {LINE_HEIGHTS.map((lh) => (
                <button
                  key={lh}
                  type="button"
                  onClick={() => setLineHeight(lh)}
                  aria-pressed={lineHeight === lh}
                  aria-label={t("settings.lineSpacingLabel", { spacing: lh })}
                  className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors ${
                    lineHeight === lh
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {lineHeight === lh && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {lh === "compact" ? t("settings.spacingCompact") : lh === "normal" ? t("settings.spacingNormal") : t("settings.spacingLoose")}
                </button>
              ))}
            </div>
          </div>

          {prefsHydrated && (
            <div className="rounded-xl border border-border/70 bg-background/70 p-4">
              <p lang="ar" dir="rtl" className={`${arabicSizeClass(arabicSize)} arabic-text text-foreground`}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t("settings.arabicPreview")}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold">{t("settings.translationEdition")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("settings.translationEditionDesc")}
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
                <span className="font-medium">{t("settings.showTranslation")}</span>
                <p className="text-sm text-muted-foreground">{t("settings.showTranslationDesc")}</p>
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
                <span className="font-medium">{t("settings.showTransliteration")}</span>
                <p className="text-sm text-muted-foreground">{t("settings.showTransliterationDesc")}</p>
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
                  <span className="font-medium">{t("settings.audioRecitation")}</span>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.audioRecitationDesc")}
                  </p>
                </span>
              </label>
              {showAudio && (
                <div className="space-y-1.5 pl-7">
                  <label htmlFor="reciter-select" className="block text-xs font-medium text-muted-foreground">
                    {t("settings.reciter")}
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
                    {t("settings.audioSource")}
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
                  <span className="font-medium">{t("settings.parallelMode")}</span>
                  <p className="text-sm text-muted-foreground">
                    {t("settings.parallelModeDesc", { count: MAX_PARALLEL_TRANSLATIONS })}
                  </p>
                </span>
              </label>

              {parallelMode && (
                <div className="space-y-3 pl-7">
                  <p className="text-xs text-muted-foreground">
                    {t("settings.primary")}{" "}
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
                              aria-label={t("settings.removeTranslation", { name: meta?.name ?? id })}
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
                        {t("settings.addTranslation")}
                      </label>
                      <select
                        id="parallel-add"
                        value=""
                        onChange={(e) => {
                          if (e.target.value) toggleParallelTranslation(e.target.value);
                        }}
                        className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring sm:w-auto"
                      >
                        <option value="">{t("settings.chooseTranslation")}</option>
                        {availableParallel.map((tr) => (
                          <option key={tr.id} value={tr.id}>
                            {tr.name} — {tr.languageLabel}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-[0.6875rem] text-muted-foreground">
                      {t("settings.parallelMaxReached", { count: MAX_PARALLEL_TRANSLATIONS })}
                    </p>
                  )}

                  <p className="text-[0.6875rem] text-muted-foreground">
                    {t("settings.parallelMemory")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="local-data" className="space-y-4">
        <h2 id="local-data" className="font-display text-xl font-semibold tracking-tight">
          {t("settings.localData")}
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("settings.localDataDesc")}
          </p>
          <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              {t("settings.localDataWarning")}
            </span>{" "}
            {t("settings.localDataWarningDesc")}
          </p>
          <BackupControls />
        </div>
      </section>

      <section aria-labelledby="policies" className="space-y-4">
        <h2 id="policies" className="font-display text-xl font-semibold tracking-tight">
          {t("settings.policies")}
        </h2>
        <ul className="space-y-2">
          <li>
            <Link href="/settings/privacy" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
                {t("settings.privacyLocal")}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/sources" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
                {t("settings.sourcesProvenance")}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              {t("settings.privacyPolicy")}
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/terms" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              {t("settings.termsOfUse")}
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
          <li>
            <Link href="/accessibility" className="flex items-center justify-between rounded-2xl border border-border/80 bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary/40">
              {t("settings.accessibilityStatement")}
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
