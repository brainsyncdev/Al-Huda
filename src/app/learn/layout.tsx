import type { ReactNode } from "react";
import { LearnNav } from "@/components/learn/learn-nav";

// Shared layout for all learning surfaces (Paths, Revise, Quiz).
//
// The LearnNav strip makes all three workspaces reachable from any of them.
// Without it the revision workspace exists but is discoverable only by typing
// its URL, which makes an implemented feature effectively invisible.
//
// Server component importing a client component (LearnNav) — the standard
// Next.js pattern for a static shell around an active-aware nav.

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <LearnNav />
      <div>{children}</div>
    </div>
  );
}