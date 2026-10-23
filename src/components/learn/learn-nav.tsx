"use client";

// Shared sub-navigation for the learning surfaces.
//
// The three learning workspaces — Paths, Revise, Quiz — are separate routes
// with separate concerns, but they are one activity from the learner's point
// of view. Without a shared strip the revision workspace is reachable only by
// typing its URL, which makes an implemented feature effectively invisible.
//
// Text labels plus aria-current, never colour alone (PRD §11).

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LEARN_TABS = [
  { href: "/learn/paths", label: "Paths" },
  { href: "/learn/plans", label: "Plans" },
  { href: "/learn/revision", label: "Revise" },
  { href: "/learn/quiz", label: "Quiz" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function LearnNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Learning sections" className="border-b border-border/70">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {LEARN_TABS.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-2 focus-visible:outline-ring",
                  active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}