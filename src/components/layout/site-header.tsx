"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  Compass,
  GraduationCap,
  Search,
  Settings,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSelector } from "@/components/layout/language-selector";
import { cn } from "@/lib/utils";

/**
 * Desktop header with mobile slim header variant.
 * Desktop: 4 primary nav items + 3 utility icons (Search, Language, Settings)
 * Mobile: Slim header with logo + search icon (hidden at md+)
 */
export function SiteHeader() {
  const pathname = usePathname();
  const t = useTranslation();

  const NAV = [
    { href: "/quran", label: t("nav.read"), icon: BookOpen },
    { href: "/explore", label: t("nav.explore"), icon: Compass },
    { href: "/learn", label: t("nav.learn"), icon: GraduationCap },
    { href: "/my-study", label: t("nav.myStudy"), icon: Bookmark },
  ] as const;

  return (
    <>
      {/* Mobile slim header */}
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:hidden">
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-lg px-1 py-1"
          aria-label={`${t("layout.siteName")} — Home`}
        >
          <span className="font-display text-lg font-semibold tracking-tight text-primary">
            {t("layout.siteName")}
          </span>
          <span className="arabic-display text-base text-gold" lang="ar" dir="rtl" aria-hidden>
            الحُدَى
          </span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center rounded-full p-2 text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          aria-label={t("nav.search")}
        >
          <Search className="h-5 w-5" aria-hidden />
        </Link>
      </header>

      {/* Desktop header */}
      <header className="sticky top-0 z-40 hidden w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:block">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/"
            className="group flex items-baseline gap-2 rounded-lg px-1 py-1"
            aria-label={`${t("layout.siteName")} — Home`}
          >
            <span className="font-display text-xl font-semibold tracking-tight text-primary">
              {t("layout.siteName")}
            </span>
            <span className="arabic-display text-lg text-gold" lang="ar" dir="rtl" aria-hidden>
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
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center rounded-full p-2 text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={t("nav.search")}
                >
                  <Search className="h-5 w-5" aria-hidden />
                </Link>
              </li>
              <li>
                <LanguageSelector />
              </li>
              <li>
                <Link
                  href="/settings"
                  className="inline-flex items-center justify-center rounded-full p-2 text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  aria-label={t("nav.settings")}
                >
                  <Settings className="h-5 w-5" aria-hidden />
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
