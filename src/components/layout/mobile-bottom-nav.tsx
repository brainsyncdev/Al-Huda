"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Compass, GraduationCap, Home, Library, Search, Settings, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/quran", label: "Read", icon: BookOpen },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/search", label: "Search", icon: Search },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/library", label: "Library", icon: Library },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/quran") return pathname === "/quran" || pathname.startsWith("/quran/");
  if (href === "/topics")
    return pathname === "/topics" || pathname.startsWith("/topics/");
  if (href === "/explore")
    return pathname === "/explore" || pathname.startsWith("/explore/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Fixed bottom navigation for small screens (PRD: mobile bottom navigation
 * with accessible labels and comfortable hit targets). Hidden at md+ where
 * the site header carries navigation.
 */
export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
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
  );
}
