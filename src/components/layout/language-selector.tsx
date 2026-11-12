"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Languages, Check, ChevronDown } from "lucide-react";
import { LOCALES } from "@/lib/i18n/locales";
import type { Locale } from "@/lib/i18n/types";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/**
 * Accessible language selector.
 *
 * Renders as a button that opens a popover menu listing every supported
 * locale in its own script. The active locale is marked with a check icon
 * and `aria-current="true"`. Keyboard navigation follows the WAI-ARIA
 * menu pattern: Arrow keys move focus, Enter/Space select, Escape closes.
 *
 * Changing the locale updates the entire document (lang + dir attributes)
 * via the I18nProvider. The current page and query state are preserved
 * because the locale is not part of the URL.
 */
export function LanguageSelector({
  compact = false,
}: {
  /** When true, renders just the icon button (for mobile bottom nav area). */
  compact?: boolean;
} = {}) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [focusIndex, setFocusIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeConfig = LOCALES.find((l) => l.code === locale);

  const close = useCallback(() => {
    setOpen(false);
    setFocusIndex(-1);
    buttonRef.current?.focus();
  }, []);

  const select = useCallback(
    (code: Locale) => {
      setLocale(code);
      close();
    },
    [setLocale, close]
  );

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, close]);

  // Focus first item when menu opens
  useEffect(() => {
    if (open) {
      const idx = LOCALES.findIndex((l) => l.code === locale);
      setFocusIndex(idx >= 0 ? idx : 0);
    }
  }, [open, locale]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex >= 0 && itemRefs.current[focusIndex]) {
      itemRefs.current[focusIndex]?.focus();
    }
  }, [focusIndex]);

  function handleButtonKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  function handleMenuKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusIndex((i) => (i + 1) % LOCALES.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusIndex(
          (i) => (i - 1 + LOCALES.length) % LOCALES.length
        );
        break;
      case "Home":
        e.preventDefault();
        setFocusIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusIndex(LOCALES.length - 1);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  }

  if (compact) {
    return (
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-label={t("languageSelector.aria")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="relative inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Languages className="h-5 w-5" aria-hidden />
        {open && (
          <div
            ref={menuRef}
            role="listbox"
            aria-label={t("languageSelector.title")}
            onKeyDown={handleMenuKeyDown}
            className="absolute bottom-full end-0 mb-2 w-44 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
          >
            {LOCALES.map((loc, i) => (
              <button
                key={loc.code}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                role="option"
                aria-selected={loc.code === locale}
                aria-current={loc.code === locale ? "true" : undefined}
                onClick={() => select(loc.code)}
                className={cn(
                  "flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  loc.code === locale
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-secondary/60"
                )}
                dir={loc.dir}
              >
                <span className="font-medium">{loc.nativeName}</span>
                {loc.code === locale && (
                  <Check className="h-4 w-4 text-primary" aria-hidden />
                )}
              </button>
            ))}
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleButtonKeyDown}
        aria-label={t("languageSelector.aria")}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
          "text-foreground/75 hover:bg-secondary hover:text-secondary-foreground",
          "focus-visible:outline-2 focus-visible:outline-ring"
        )}
      >
        <Languages className="h-4 w-4" aria-hidden />
        <span>{activeConfig?.nativeName ?? "English"}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />
      </button>

      {open && (
        <div
          ref={menuRef}
          role="listbox"
          aria-label={t("languageSelector.title")}
          onKeyDown={handleMenuKeyDown}
          className="absolute end-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-popover shadow-lg"
        >
          <div className="border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
            {t("languageSelector.choose")}
          </div>
          {LOCALES.map((loc, i) => (
            <button
              key={loc.code}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="option"
              aria-selected={loc.code === locale}
              aria-current={loc.code === locale ? "true" : undefined}
              onClick={() => select(loc.code)}
              className={cn(
                "flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors",
                loc.code === locale
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground hover:bg-secondary/60"
              )}
              dir={loc.dir}
            >
              <span className="flex flex-col items-start">
                <span className="font-medium">{loc.nativeName}</span>
                <span className="text-xs text-muted-foreground">
                  {loc.name}
                </span>
              </span>
              {loc.code === locale && (
                <Check className="h-4 w-4 text-primary" aria-hidden />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
