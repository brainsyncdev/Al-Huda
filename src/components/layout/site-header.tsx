"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  GraduationCap,
  Library,
  Search,
  Settings,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSelector } from "@/components/layout/language-selector";
import { cn } from "@/lib/utils";

/**
 * Desktop header. The mobile experience is covered by MobileBottomNav;
 * this header hides below the md breakpoint so navigation stays thumb-reachable.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslation();

  const NAV = [
    { href: "/discover", label: t("nav.discover"), icon: Sparkles },
    { href: "/quran", label: t("nav.read"), icon: BookOpen },
    { href: "/explore", label: t("nav.explore"), icon: Compass },
    { href: "/topics", label: t("nav.topics"), icon: Sparkles },
    { href: "/search", label: t("nav.search"), icon: Search },
    { href: "/learn", label: t("nav.learn"), icon: GraduationCap },
    { href: "/learn/plans", label: t("nav.plans"), icon: GraduationCap },
    { href: "/learn/quiz", label: t("nav.quiz"), icon: GraduationCap },
    { href: "/library", label: t("nav.library"), icon: Library },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ] as const;

  return (
    <header className="sticky top-0 z-40 hidden w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:block">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-lg px-1 py-1"
          aria-label={`${t("layout.siteName")} — ${t("nav.search")}`}
        >
          <span className="font-display text-xl font-semibold tracking-tight text-primary">
            {t("layout.siteName")}
          </span>
          <span className="arabic-display text-lg text-gold" aria-hidden>
            الحُدَى
          </span>
        </Link>

        <nav aria-label={t("nav.primary")}>
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={
                    pathname === href || pathname.startsWith(href + "/")
                      ? "page"
                      : undefined
                  }
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    pathname === href || pathname.startsWith(href + "/")
                      ? "text-foreground bg-secondary"
                      : "text-foreground/75 hover:bg-secondary hover:text-secondary-foreground",
                    "focus-visible:outline-2 focus-visible:outline-ring"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <LanguageSelector />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
