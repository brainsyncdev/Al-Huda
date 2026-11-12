"use client";

// Topic tafsir viewer (MFD-07 Phase 5).
//
// Displays tafsir access options for every ayah mapped to a topic. Does NOT
// render tafsir text — only links to the in-app tafsir viewer (al-Jalalayn,
// al-Muyassar, via the ayah page) and to external publisher sites (Ibn Kathir,
// Ma'ariful Quran). Tafsir text is fetched on-demand by the TafsirViewer on
// the ayah page; this component is purely a navigation aid.
//
// POLICY:
// - Tafsir is scholarly interpretation, not translation (FR-030/031/032).
// - No tafsir content is displayed, cached, or fabricated here.
// - External links open in a new tab with rel="noopener noreferrer".
// - Every tafsir carries full attribution, language, and licensing metadata
//   sourced from src/lib/quran/sources.ts.

import { useState } from "react";
import Link from "next/link";
import {
  BookText,
  ChevronDown,
  ExternalLink,
  Info,
  Languages,
  BookOpen,
  Link2,
} from "lucide-react";
import {
  getTopicTafsirLinks,
  getTopicTafsirSummary,
  getAllTafsirSources,
  type AyahTafsirResult,
  type TafsirLink,
} from "@/lib/taxonomy/topic-tafsir-data";
import { cn } from "@/lib/utils";

interface TopicTafsirViewerProps {
  topicId: string;
  /** Optional override for the heading title (defaults to derived topic title). */
  title?: string;
  className?: string;
}

export function TopicTafsirViewer({
  topicId,
  title,
  className,
}: TopicTafsirViewerProps) {
  const result = getTopicTafsirLinks(topicId);
  const summary = getTopicTafsirSummary(topicId);
  const sources = getAllTafsirSources();

  if (!result || !summary) {
    return (
      <section
        aria-labelledby="topic-tafsir-heading"
        className={cn(
          "rounded-2xl border border-border/80 bg-card p-5",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" aria-hidden />
          <h2
            id="topic-tafsir-heading"
            className="font-display text-lg font-semibold"
          >
            Tafsir references
          </h2>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          No ayah mappings are registered for this topic yet, so tafsir links
          are not available.
        </p>
      </section>
    );
  }

  const displayTitle = title ?? result.topicTitle;

  return (
    <section
      aria-labelledby="topic-tafsir-heading"
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-5",
        className
      )}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" aria-hidden />
          <h2
            id="topic-tafsir-heading"
            className="font-display text-lg font-semibold"
          >
            Tafsir references for {displayTitle}
          </h2>
        </div>
        <StatsBar summary={summary} />
      </header>

      <p className="mb-4 text-sm leading-relaxed text-foreground/85">
        Tafsir is scholarly interpretation by qualified scholars, not
        translation. The links below open the ayah page with the classical
        Arabic tafsir viewer (in-app) or the publisher&apos;s edition (external).
        Consult qualified scholarship for detailed understanding.
      </p>

      <AyahList ayahs={result.ayahs} />

      <AboutTafsirSection sources={sources} />
    </section>
  );
}

// ─── Statistics bar ──────────────────────────────────────────────────────────

function StatsBar({
  summary,
}: {
  summary: NonNullable<ReturnType<typeof getTopicTafsirSummary>>;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      role="status"
      aria-label="Tafsir availability summary"
    >
      <StatPill label={`${summary.totalAyahs} ayat`} icon={BookOpen} />
      <StatPill
        label={`${summary.inAppTafsirs} in-app`}
        icon={Link2}
        tone="primary"
      />
      <StatPill
        label={`${summary.externalTafsirs} external`}
        icon={ExternalLink}
        tone="muted"
      />
      <StatPill
        label={summary.languages.join(", ")}
        icon={Languages}
        tone="muted"
      />
    </div>
  );
}

function StatPill({
  label,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  tone?: "default" | "primary" | "muted";
}) {
  const toneClass =
    tone === "primary"
      ? "bg-primary/10 text-primary border-primary/20"
      : tone === "muted"
        ? "bg-secondary text-secondary-foreground border-border/70"
        : "bg-background/60 text-foreground border-border/70";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        toneClass
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

// ─── Ayah list (collapsible per ayah) ────────────────────────────────────────

function AyahList({ ayahs }: { ayahs: AyahTafsirResult[] }) {
  // Track which ayahs are expanded. Default: first 3 expanded so the user sees
  // the pattern without being overwhelmed on topics with many ayat.
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    ayahs.slice(0, 3).forEach((a) => initial.add(ayahKey(a)));
    return initial;
  });

  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const expandAll = () =>
    setExpanded(new Set(ayahs.map((a) => ayahKey(a))));
  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={expandAll}
          className="rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-secondary"
        >
          Expand all
        </button>
        <span className="text-xs text-muted-foreground" aria-hidden>
          ·
        </span>
        <button
          type="button"
          onClick={collapseAll}
          className="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          Collapse all
        </button>
      </div>

      <ul className="space-y-2" role="list">
        {ayahs.map((ayah) => {
          const key = ayahKey(ayah);
          const isOpen = expanded.has(key);
          return (
            <li
              key={key}
              className="rounded-xl border border-border/70 bg-background/60"
            >
              <button
                type="button"
                onClick={() => toggle(key)}
                aria-expanded={isOpen}
                aria-controls={`tafsir-panel-${key}`}
                className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors hover:bg-secondary/40"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {ayah.surahNumber}
                  </span>
                  <span>
                    Surah {ayah.surahNumber}, Ayah {ayah.ayahNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({ayah.tafsirLinks.length} tafsir{" "}
                    {ayah.tafsirLinks.length === 1 ? "option" : "options"})
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>

              {isOpen && (
                <div
                  id={`tafsir-panel-${key}`}
                  className="border-t border-border/60 px-3.5 py-3"
                >
                  <TafsirLinkGrid links={ayah.tafsirLinks} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ayahKey(a: AyahTafsirResult): string {
  return `${a.surahNumber}-${a.ayahNumber}-${a.mappingId}`;
}

// ─── Tafsir link grid for one ayah ───────────────────────────────────────────

function TafsirLinkGrid({ links }: { links: TafsirLink[] }) {
  const inApp = links.filter((l) => !l.isExternal);
  const external = links.filter((l) => l.isExternal && l.available);
  const unavailable = links.filter((l) => !l.available);

  return (
    <div className="space-y-3">
      {inApp.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <Link2 className="h-3 w-3" aria-hidden />
            Read in app (Arabic)
          </p>
          <div className="flex flex-wrap gap-2">
            {inApp.map((link) => (
              <InAppTafsirLink key={link.tafsirId} link={link} />
            ))}
          </div>
        </div>
      )}

      {external.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <ExternalLink className="h-3 w-3" aria-hidden />
            External publishers
          </p>
          <div className="flex flex-wrap gap-2">
            {external.map((link) => (
              <ExternalTafsirLink key={link.tafsirId} link={link} />
            ))}
          </div>
        </div>
      )}

      {unavailable.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <ExternalLink className="h-3 w-3" aria-hidden />
            Unavailable
          </p>
          <div className="flex flex-wrap gap-2">
            {unavailable.map((link) => (
              <UnavailableTafsirLink key={link.tafsirId} link={link} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InAppTafsirLink({ link }: { link: TafsirLink }) {
  return (
    <Link
      href={link.url}
      className="group inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
      aria-label={`Read ${link.tafsirName} for this ayah in the app`}
    >
      <BookOpen className="h-3.5 w-3.5" aria-hidden />
      <span className="flex flex-col items-start leading-tight">
        <span>{link.tafsirName}</span>
        <span className="text-[0.625rem] font-normal text-muted-foreground group-hover:text-primary/80">
          {link.tafsirAttribution}
        </span>
      </span>
    </Link>
  );
}

function ExternalTafsirLink({ link }: { link: TafsirLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/40 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-secondary/40"
      aria-label={`Open ${link.tafsirName} on publisher site (opens in new tab)`}
    >
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      <span className="flex flex-col items-start leading-tight">
        <span>
          {link.tafsirName}
          <span className="ml-1 text-[0.625rem] font-normal text-muted-foreground">
            ↗
          </span>
        </span>
        <span className="text-[0.625rem] font-normal text-muted-foreground">
          {link.tafsirAttribution}
        </span>
      </span>
    </a>
  );
}

function UnavailableTafsirLink({ link }: { link: TafsirLink }) {
  return (
    <div
      className="group inline-flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-sm font-medium text-muted-foreground opacity-60"
      aria-label={`${link.tafsirName} is currently unavailable`}
    >
      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      <span className="flex flex-col items-start leading-tight">
        <span className="line-through">
          {link.tafsirName}
          <span className="ml-1 text-[0.625rem] font-normal text-muted-foreground">
            Unavailable
          </span>
        </span>
        <span className="text-[0.625rem] font-normal text-muted-foreground">
          {link.tafsirAttribution}
        </span>
      </span>
    </div>
  );
}

// ─── About tafsir info section ───────────────────────────────────────────────

function AboutTafsirSection({
  sources,
}: {
  sources: ReturnType<typeof getAllTafsirSources>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 rounded-xl border border-border/70 bg-secondary/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Info className="h-4 w-4 text-primary" aria-hidden />
          About tafsir in this app
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-border/60 px-4 py-4 text-sm leading-relaxed">
          <p className="text-foreground/85">
            <strong>Tafsir</strong> (تفسير) is the scholarly interpretation of
            the Quran by qualified exegetes. It is <em>not</em> a translation of
            the Quran&apos;s Arabic text. This app distinguishes tafsir from
            translation at every level: tafsir is never generated or quoted by
            AI, and is always attributed to its author, period, and publisher.
          </p>

          <div className="rounded-lg bg-gold-soft/70 px-3.5 py-2.5 text-xs text-accent-foreground">
            <strong>Disclaimer:</strong> Tafsir is scholarly interpretation.
            Consult qualified scholars for detailed understanding. The links
            below point to classical and contemporary works whose licensing and
            permitted display remain with their publishers (FR-032).
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tafsir sources used by this app
            </p>
            <ul className="space-y-2">
              {sources.map((s) => (
                <li
                  key={s.sourceId}
                  className="rounded-lg border border-border/60 bg-background/60 px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{s.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[0.625rem] font-medium text-secondary-foreground">
                      {s.isExternal ? (
                        <>
                          <ExternalLink className="h-2.5 w-2.5" aria-hidden />
                          External
                        </>
                      ) : (
                        <>
                          <Link2 className="h-2.5 w-2.5" aria-hidden />
                          In-app
                        </>
                      )}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.attribution} · Language: {s.language} · Publisher:{" "}
                    {s.publisher}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    License: {s.license}
                  </p>
                  {s.notes && (
                    <p className="mt-1 text-[0.6875rem] italic text-muted-foreground">
                      {s.notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
