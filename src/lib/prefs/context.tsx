"use client";

// Reader preferences (FR-006): Arabic font size, translation edition and
// visibility, transliteration visibility. Persisted locally; no account needed.

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_TRANSLATION_ID,
  getTranslation,
} from "@/lib/quran/translations";
import { DEFAULT_RECITER_ID, getReciter } from "@/lib/quran/audio";

export type ArabicSize = "sm" | "md" | "lg" | "xl";
export type LineHeight = "compact" | "normal" | "loose";

export const ARABIC_SIZES: ArabicSize[] = ["sm", "md", "lg", "xl"];
export const LINE_HEIGHTS: LineHeight[] = ["compact", "normal", "loose"];

export interface Prefs {
  arabicSize: ArabicSize;
  lineHeight: LineHeight;
  showTranslation: boolean;
  showTransliteration: boolean;
  /** Active translation edition ID from the Tanzil catalog, e.g. "ur.jalandhry". */
  translationId: string;
  /** FR-054: show a per-ayah recitation player in the reader. */
  showAudio: boolean;
  /** Reciter edition id, e.g. "ar.alafasy". */
  reciterId: string;
  /** FR-033: show extra translations beneath the primary one. */
  parallelMode: boolean;
  /** FR-033: additional edition ids rendered alongside `translationId`. */
  parallelTranslationIds: string[];
}

/** Maximum simultaneous translations in parallel mode (primary + 3). */
export const MAX_PARALLEL_TRANSLATIONS = 3;

export const DEFAULT_PREFS: Prefs = {
  arabicSize: "md",
  lineHeight: "normal",
  showTranslation: true,
  showTransliteration: false,
  translationId: DEFAULT_TRANSLATION_ID,
  showAudio: false,
  reciterId: DEFAULT_RECITER_ID,
  parallelMode: false,
  parallelTranslationIds: [],
};

/**
 * Rebuild preferences from arbitrary parsed JSON (stored value or restored
 * backup). Unknown values fall back to the defaults instead of being passed
 * through — an arbitrary string must never reach a Tailwind class selector, and
 * an unknown translation ID must never reach the network loader.
 */
export function normalizePrefs(raw: unknown): Prefs {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return DEFAULT_PREFS;
  }
  const parsed = raw as Record<string, unknown>;
  return {
    arabicSize: ARABIC_SIZES.includes(parsed.arabicSize as ArabicSize)
      ? (parsed.arabicSize as ArabicSize)
      : DEFAULT_PREFS.arabicSize,
    lineHeight: LINE_HEIGHTS.includes(parsed.lineHeight as LineHeight)
      ? (parsed.lineHeight as LineHeight)
      : DEFAULT_PREFS.lineHeight,
    showTranslation:
      typeof parsed.showTranslation === "boolean"
        ? parsed.showTranslation
        : DEFAULT_PREFS.showTranslation,
    showTransliteration:
      typeof parsed.showTransliteration === "boolean"
        ? parsed.showTransliteration
        : DEFAULT_PREFS.showTransliteration,
    translationId:
      typeof parsed.translationId === "string" &&
      getTranslation(parsed.translationId) !== undefined
        ? parsed.translationId
        : DEFAULT_PREFS.translationId,
    showAudio:
      typeof parsed.showAudio === "boolean"
        ? parsed.showAudio
        : DEFAULT_PREFS.showAudio,
    reciterId:
      typeof parsed.reciterId === "string" && getReciter(parsed.reciterId)
        ? parsed.reciterId
        : DEFAULT_PREFS.reciterId,
    parallelMode:
      typeof parsed.parallelMode === "boolean"
        ? parsed.parallelMode
        : DEFAULT_PREFS.parallelMode,
    // Filter to real catalog ids, drop the primary (it is already shown), and
    // cap the count so a restored backup cannot render an unbounded column set.
    parallelTranslationIds: Array.isArray(parsed.parallelTranslationIds)
      ? parsed.parallelTranslationIds
          .filter(
            (id): id is string =>
              typeof id === "string" &&
              getTranslation(id) !== undefined &&
              id !== parsed.translationId
          )
          .slice(0, MAX_PARALLEL_TRANSLATIONS)
      : DEFAULT_PREFS.parallelTranslationIds,
  };
}

const STORAGE_KEY = "alhuda.prefs.v1";

interface PrefsContextValue extends Prefs {
  setArabicSize: (size: ArabicSize) => void;
  setLineHeight: (lh: LineHeight) => void;
  setShowTranslation: (show: boolean) => void;
  setShowTransliteration: (show: boolean) => void;
  setTranslationId: (id: string) => void;
  setShowAudio: (show: boolean) => void;
  setReciterId: (id: string) => void;
  setParallelMode: (on: boolean) => void;
  toggleParallelTranslation: (id: string) => void;
  /** JSON-serializable snapshot for the shared backup export. */
  exportPrefs: () => Prefs;
  /** Replace stored preferences from a parsed backup section (FR-043). */
  restorePrefs: (raw: unknown) => void;
  hydrated: boolean;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setPrefs(normalizePrefs(JSON.parse(raw)));
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
      setTranslationId: (translationId) => {
        // Ignore IDs that are not in the catalog: the loader and the source
        // page would otherwise carry a value the app cannot resolve.
        if (getTranslation(translationId)) {
          persist({
            ...prefs,
            translationId,
            // The new primary must not also appear as a parallel column.
            parallelTranslationIds: prefs.parallelTranslationIds.filter(
              (id) => id !== translationId
            ),
          });
        }
      },
      setShowAudio: (showAudio) => persist({ ...prefs, showAudio }),
      setReciterId: (reciterId) => {
        if (getReciter(reciterId)) persist({ ...prefs, reciterId });
      },
      setParallelMode: (parallelMode) => persist({ ...prefs, parallelMode }),
      toggleParallelTranslation: (id) => {
        if (!getTranslation(id) || id === prefs.translationId) return;
        const selected = prefs.parallelTranslationIds.includes(id);
        if (!selected && prefs.parallelTranslationIds.length >= MAX_PARALLEL_TRANSLATIONS) {
          return;
        }
        persist({
          ...prefs,
          parallelTranslationIds: selected
            ? prefs.parallelTranslationIds.filter((x) => x !== id)
            : [...prefs.parallelTranslationIds, id],
        });
      },
      exportPrefs: () => prefs,
      restorePrefs: (raw) => persist(normalizePrefs(raw)),
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