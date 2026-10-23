import Link from "next/link";
import { BookOpen, GraduationCap, Library, Search, Sparkles } from "lucide-react";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/quran", label: "Read", icon: BookOpen },
  { href: "/topics", label: "Topics", icon: Sparkles },
  { href: "/search", label: "Search", icon: Search },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/learn/plans", label: "Plans", icon: GraduationCap },
  { href: "/learn/quiz", label: "Quiz", icon: GraduationCap },
  { href: "/library", label: "Library", icon: Library },
] as const;

/**
 * Desktop header. The mobile experience is covered by MobileBottomNav;
 * this header hides below the md breakpoint so navigation stays thumb-reachable.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 hidden w-full border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:block">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-baseline gap-2 rounded-lg px-1 py-1"
          aria-label={`${SITE_NAME} home`}
        >
          <span className="font-display text-xl font-semibold tracking-tight text-primary">
            {SITE_NAME}
          </span>
          <span className="arabic-display text-lg text-gold" aria-hidden>
            الحُدَى
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-foreground/75 transition-colors",
                    "hover:bg-secondary hover:text-secondary-foreground",
                    "focus-visible:outline-2 focus-visible:outline-ring"
                  )}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
