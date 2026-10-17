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

export interface Prefs {
  arabicSize: ArabicSize;
  showTranslation: boolean;
  showTransliteration: boolean;
}

const DEFAULTS: Prefs = {
  arabicSize: "md",
  showTranslation: true,
  showTransliteration: false,
};

const STORAGE_KEY = "alhuda.prefs.v1";

interface PrefsContextValue extends Prefs {
  setArabicSize: (size: ArabicSize) => void;
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
