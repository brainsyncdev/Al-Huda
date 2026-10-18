"use client";

// Reader preferences (FR-006): Arabic font size, translation visibility,
// transliteration visibility. Persisted locally; no account needed.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ArabicSize = "sm" | "md" | "lg" | "xl";
export type LineHeight = "compact" | "normal" | "loose";

export const ARABIC_SIZES: ArabicSize[] = ["sm", "md", "lg", "xl"];
export const LINE_HEIGHTS: LineHeight[] = ["compact", "normal", "loose"];

export interface Prefs {
  arabicSize: ArabicSize;
  lineHeight: LineHeight;
  showTranslation: boolean;
  showTransliteration: boolean;
}

const DEFAULTS: Prefs = {
  arabicSize: "md",
  lineHeight: "normal",
  showTranslation: true,
  showTransliteration: false,
};

const STORAGE_KEY = "alhuda.prefs.v1";

interface PrefsContextValue extends Prefs {
  setArabicSize: (size: ArabicSize) => void;
  setLineHeight: (lh: LineHeight) => void;
  setShowTranslation: (show: boolean) => void;
  setShowTransliteration: (show: boolean) => void;
  hydrated: boolean;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Prefs>;
        setPrefs({
          arabicSize: parsed.arabicSize ?? DEFAULTS.arabicSize,
          lineHeight: parsed.lineHeight ?? DEFAULTS.lineHeight,
          showTranslation: parsed.showTranslation ?? DEFAULTS.showTranslation,
          showTransliteration:
            parsed.showTransliteration ?? DEFAULTS.showTransliteration,
        });
      }
    } catch {
      // keep defaults
    }
    setHydrated(true);
  }, []);

  const value = useMemo<PrefsContextValue>(() => {
    const persist = (next: Prefs) => {
      setPrefs(next);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    };
    return {
      ...prefs,
      hydrated,
      setArabicSize: (arabicSize) => persist({ ...prefs, arabicSize }),
      setLineHeight: (lineHeight) => persist({ ...prefs, lineHeight }),
      setShowTranslation: (showTranslation) => persist({ ...prefs, showTranslation }),
      setShowTransliteration: (showTransliteration) =>
        persist({ ...prefs, showTransliteration }),
    };
  }, [prefs, hydrated]);

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsContextValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within PrefsProvider");
  return ctx;
}

/** Class for the Arabic verse text at the chosen size. */
export function arabicSizeClass(size: ArabicSize): string {
  switch (size) {
    case "sm":
      return "text-[1.5rem] leading-[2.4]";
    case "lg":
      return "text-[2.25rem] leading-[2.2]";
    case "xl":
      return "text-[2.75rem] leading-[2.1]";
    default:
      return "text-[1.875rem] leading-[2.3]";
  }
}

/** Class for Arabic line height (FR-006). */
export function arabicLineHeightClass(lh: LineHeight): string {
  switch (lh) {
    case "compact":
      return "leading-[1.8]";
    case "loose":
      return "leading-[2.6]";
    default:
      return "leading-[2.3]";
  }
}
