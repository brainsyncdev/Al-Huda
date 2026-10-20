"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { BackupControls } from "@/components/library/backup-controls";

// noindex for this route comes from src/app/settings/layout.tsx.
export default function SettingsPrivacyPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to settings
        </Link>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy &amp; local storage
          </h1>
          <p className="max-w-prose text-muted-foreground">
            How Al-Huda stores your data on this device, and what you can do to
            control or remove it.
          </p>
        </div>
      </header>

      <section aria-labelledby="what-we-store" className="space-y-4">
        <h2
          id="what-we-store"
          className="font-display text-xl font-semibold tracking-tight"
        >
          What is stored
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <p className="text-foreground/90">
            Everything you create here stays in your browser&apos;s localStorage:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>
              <strong className="text-foreground">Library:</strong> bookmarks,
              private notes and tags, reading history
            </li>
            <li>
              <strong className="text-foreground">Revision plan:</strong> ayat,
              review schedule, ladders, and a capped review log
            </li>
            <li>
              <strong className="text-foreground">Preferences:</strong> Arabic
              size, line height, translation/transliteration toggles
            </li>
          </ul>
          <p className="text-muted-foreground">
            There is no account, no server copy of personal data, and no analytics
            (PRD §10 / AI_RULES).
          </p>
        </div>
      </section>

      <section aria-labelledby="what-we-dont-store" className="space-y-4">
        <h2
          id="what-we-dont-store"
          className="font-display text-xl font-semibold tracking-tight"
        >
          What we do not store
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc pl-5 space-y-1">
            <li>No user identifiers, emails, or passwords</li>
            <li>No server-side bookmarks, notes, or reading history</li>
            <li>No tracking or analytics beacons</li>
            <li>No AI prompts or answers are persisted by default (see audit policy)</li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="export-erase" className="space-y-4">
        <h2
          id="export-erase"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Export, restore, or erase
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Export a versioned backup of your bookmarks, notes, revision plan,
            and preferences. Import replaces this device&apos;s copy after
            confirmation. Delete erases the supported local data permanently.
          </p>
          <BackupControls />
          <div className="rounded-xl border border-border/80 bg-background/70 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Loss conditions
            </p>
            <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-muted-foreground">
              Because nothing is uploaded, clearing site data/cookies, using a
              private/incognito window, switching browser or device, or
              uninstalling the browser can delete this data permanently. Export
              a JSON backup if you intend to keep it.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="ai-privacy" className="space-y-4">
        <h2
          id="ai-privacy"
          className="font-display text-xl font-semibold tracking-tight"
        >
          AI features
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <p className="flex items-start gap-2 text-foreground/90">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>
              AI answer generation is currently disabled by feature flag. When
              enabled only after safety gates pass, the system is designed to
              retrieve only from allowlisted sources, require citations, abstain
              on insufficient evidence, and keep audit logs without storing
              user prompts by construction.
            </span>
          </p>
          <p className="text-muted-foreground">
            See{" "}
            <Link
              href="/privacy"
              className="font-medium text-primary underline underline-offset-2 hover:decoration-gold"
            >
              Privacy policy
            </Link>{" "}
            and{" "}
            <Link
              href="/report"
              className="font-medium text-primary underline underline-offset-2 hover:decoration-gold"
            >
              Report an issue
            </Link>{" "}
            for details.
          </p>
        </div>
      </section>
    </div>
  );
}
