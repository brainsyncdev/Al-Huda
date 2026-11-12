"use client";

import { CaseSensitive, AlignJustify } from "lucide-react";
import { toast } from "sonner";
import {
  usePrefs,
  type ArabicSize,
  type LineHeight,
} from "@/lib/prefs/context";
import { cn } from "@/lib/utils";
import { TranslationSelector } from "./translation-selector";
import { useTranslation } from "@/lib/i18n/context";

const SIZE_VALUES: ArabicSize[] = ["sm", "md", "lg", "xl"];
const LINE_HEIGHT_VALUES: LineHeight[] = ["compact", "normal", "loose"];

/**
 * Reader display controls (FR-006): translation edition selector, Arabic text
 * size, line spacing, and content visibility. All state is local-only and
 * applied immediately across the reader.
 */
export function ReaderControls() {
  const t = useTranslation();
  const {
    arabicSize,
    setArabicSize,
    lineHeight,
    setLineHeight,
    showTranslation,
    setShowTranslation,
    showTransliteration,
    setShowTransliteration,
  } = usePrefs();

  return (
    // The reserved min-height prevents a hydration layout shift: the
    // size-button group carries min-h-[44px] buttons, and without a reserved
    // container height the SSR render and the hydrated render would disagree
    // on the row's height, producing a CLS spike on surah reader pages.
    <div className="flex min-h-[76px] flex-col gap-2 rounded-2xl border border-border/80 bg-card p-3 sm:gap-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
      <fieldset className="flex items-center gap-2 sm:gap-3">
        <legend className="sr-only">Translation edition</legend>
        <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
          {t("reader.translation")}
        </span>
        <TranslationSelector compact />
      </fieldset>

      <fieldset className="flex items-center gap-2 sm:gap-3">
        <legend className="sr-only">Arabic text size</legend>
        <CaseSensitive className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
          {t("reader.textSize")}
        </span>
        <div
          className="flex items-center gap-0.5 rounded-full bg-secondary p-0.5 sm:gap-1 sm:p-1"
          role="group"
          aria-label="Arabic text size"
        >
          {SIZE_VALUES.map((value) => {
            const label = value === "sm" ? "S" : value === "md" ? "M" : value === "lg" ? "L" : "XL";
            const accessibleLabel = value === "sm" ? t("reader.smallAria") : value === "md" ? t("reader.mediumAria") : value === "lg" ? t("reader.largeAria") : t("reader.extraLargeAria");
            return (
              <button
                key={value}
                type="button"
                onClick={() => setArabicSize(value)}
                aria-pressed={arabicSize === value}
                aria-label={accessibleLabel}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors sm:min-h-[44px] sm:min-w-[44px] sm:px-2.5",
                  arabicSize === value
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary-foreground hover:bg-background/70"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="flex items-center gap-2 sm:gap-3">
        <legend className="sr-only">Line spacing</legend>
        <AlignJustify className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
          {t("reader.spacing")}
        </span>
        <div
          className="flex items-center gap-0.5 rounded-full bg-secondary p-0.5 sm:gap-1 sm:p-1"
          role="group"
          aria-label="Line spacing"
        >
          {LINE_HEIGHT_VALUES.map((value) => {
            const label = value === "compact" ? t("reader.compact") : value === "normal" ? t("reader.normal") : t("reader.loose");
            return (
              <button
                key={value}
                type="button"
                onClick={() => setLineHeight(value)}
                aria-pressed={lineHeight === value}
                className={cn(
                  "inline-flex h-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors sm:min-h-[44px] sm:px-2.5 sm:py-1",
                  lineHeight === value
                    ? "bg-primary text-primary-foreground"
                    : "text-secondary-foreground hover:bg-background/70"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <TogglePill
          checked={showTranslation}
          onChange={(next) => {
            setShowTranslation(next);
            toast.success(next ? t("reader.translationsShown") : t("reader.translationsHidden"));
          }}
          label={t("reader.translation")}
        />
        <TogglePill
          checked={showTransliteration}
          onChange={(next) => {
            setShowTransliteration(next);
            toast.success(next ? t("reader.transliterationShown") : t("reader.transliterationHidden"));
          }}
          label={t("reader.transliteration")}
        />
      </div>
    </div>
  );
}

function TogglePill({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        checked
          ? "border-primary/30 bg-emerald-soft text-primary"
          : "border-border bg-background text-muted-foreground hover:text-foreground"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-2 w-2 rounded-full",
          checked ? "bg-primary" : "bg-muted-foreground/40"
        )}
      />
      {label}
    </button>
  );
}
