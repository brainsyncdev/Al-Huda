"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  BookOpen,
  Compass,
  GraduationCap,
  Home,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { LanguageSelector } from "@/components/layout/language-selector";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/quran")
    return pathname === "/quran" || pathname.startsWith("/quran/");
  if (href === "/explore")
    return pathname === "/explore" || pathname.startsWith("/explore/");
  if (href === "/learn")
    return pathname === "/learn" || pathname.startsWith("/learn/");
  if (href === "/my-study")
    return pathname === "/my-study" || pathname.startsWith("/my-study/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed bottom navigation for small screens (PRD: mobile bottom navigation
 * with accessible labels and comfortable hit targets). Hidden at md+ where
 * the site header carries navigation.
 *
 * A compact language selector is positioned above the nav bar so it remains
 * reachable without crowding the seven primary tabs at narrow viewports.
 */
export function MobileBottomNav() {
  const pathname = usePathname();
  const t = useTranslation();

  const TABS = [
    { href: "/", label: t("common.home"), icon: Home },
    { href: "/quran", label: t("nav.read"), icon: BookOpen },
    { href: "/explore", label: t("nav.explore"), icon: Compass },
    { href: "/learn", label: t("nav.learn"), icon: GraduationCap },
    { href: "/my-study", label: t("nav.myStudy"), icon: Bookmark },
  ] as const;

  return (
    <>
      {/* Compact language selector floating above the nav on mobile */}
      <div className="fixed bottom-16 end-3 z-50 md:hidden">
        <LanguageSelector compact />
      </div>

      <nav
        aria-label={t("nav.primary")}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto flex w-full max-w-md items-stretch justify-around">
          {TABS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[0.6875rem] font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
