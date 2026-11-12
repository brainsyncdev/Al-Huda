"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

interface ExpandableTranslationProps {
  translation: string;
  /** When true, the text is shown truncated with a "Show full verse" button. */
  truncated: boolean;
}

/**
 * Renders a translation text that can be truncated to 3 lines with an
 * expand/collapse toggle. Used when no snippet highlight is available so that
 * long ayahs don't create visual noise in the results list.
 */
export function ExpandableTranslation({
  translation,
  truncated,
}: ExpandableTranslationProps) {
  const t = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!truncated || expanded) {
    return <span>{translation}</span>;
  }

  return (
    <span className="relative">
      <span className="line-clamp-3 block">{translation}</span>
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="mt-1 text-xs font-medium text-primary underline-offset-2 hover:underline"
      >
        {t("searchFilters.showFullVerse")}
      </button>
    </span>
  );
}
