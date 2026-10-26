"use client";

import { useTranslation } from "@/lib/i18n/context";

/**
 * Tiny client component that renders a single translated string.
 * Used inside the server-rendered SiteFooter so it can participate
 * in the i18n context without making the entire footer a client component.
 */
export function ServerFooterText({ k }: { k: string }) {
  const t = useTranslation();
  return <>{t(k)}</>;
}
