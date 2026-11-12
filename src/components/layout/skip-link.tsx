"use client";

import { useTranslation } from "@/lib/i18n/context";

/**
 * Translated skip-to-content link. Client component because it reads
 * from the i18n context.
 */
export function SkipLink() {
  const t = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      {t("nav.skipToContent")}
    </a>
  );
}
