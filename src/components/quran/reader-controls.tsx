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

const SIZES: { value: ArabicSize; label: string; accessibleLabel: string }[] = [
  { value: "sm", label: "S", accessibleLabel: "Small text size" },
  { value: "md", label: "M", accessibleLabel: "Medium text size" },
  { value: "lg", label: "L", accessibleLabel: "Large text size" },
  { value: "xl", label: "XL", accessibleLabel: "Extra large text size" },
];

const LINE_HEIGHT_LABELS: { value: LineHeight; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "loose", label: "Loose" },
];

/**
 * Reader display controls (FR-006): translation edition selector, Arabic text
 * size, line spacing, and content visibility. All state is local-only and
 * applied immediately across the reader.
 */
export function ReaderControls() {
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
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <fieldset className="flex items-center gap-3">
        <legend className="sr-only">Translation edition</legend>
        <span className="text-xs font-medium text-muted-foreground">Translation</span>
        <TranslationSelector compact />
      </fieldset>

      <fieldset className="flex items-center gap-3">
        <legend className="sr-only">Arabic text size</legend>
        <CaseSensitive className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="text-xs font-medium text-muted-foreground">Text size</span>
        <div
          className="flex items-center gap-1 rounded-full bg-secondary p-1"
          role="group"
          aria-label="Arabic text size"
        >
          {SIZES.map(({ value, label, accessibleLabel }) => (
            <button
              key={value}
              type="button"
              onClick={() => setArabicSize(value)}
              aria-pressed={arabicSize === value}
              aria-label={accessibleLabel}
              className={cn(
                "min-w-9 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                arabicSize === value
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:bg-background/70"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex items-center gap-3">
        <legend className="sr-only">Line spacing</legend>
        <AlignJustify className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="text-xs font-medium text-muted-foreground">Spacing</span>
        <div
          className="flex items-center gap-1 rounded-full bg-secondary p-1"
          role="group"
          aria-label="Line spacing"
        >
          {LINE_HEIGHT_LABELS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLineHeight(value)}
              aria-pressed={lineHeight === value}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                lineHeight === value
                  ? "bg-primary text-primary-foreground"
                  : "text-secondary-foreground hover:bg-background/70"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <TogglePill
          checked={showTranslation}
          onChange={(next) => {
            setShowTranslation(next);
            toast.success(next ? "Translations shown" : "Translations hidden");
          }}
          label="Translation"
        />
        <TogglePill
          checked={showTransliteration}
          onChange={(next) => {
            setShowTransliteration(next);
            toast.success(next ? "Transliteration shown" : "Transliteration hidden");
          }}
          label="Transliteration"
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
