// /editorial/mappings — Human Scholarly Review Workspace (MFD-10.2)
//
// Server component: loads all 789 mapping records READ-ONLY via
// getAllMappings(), plus the surah index and canonical topic titles, and
// passes serializable props to the client workspace.
//
// GOVERNANCE:
// - Every mapping carries provenance "pending-scholarly-review" and status
//   "MAPPED". Technical validation is NOT scholarly approval.
// - Reviewer identity is locally entered and NOT authenticated.
// - This is a reviewer tool: not indexed by search engines.
// - The existing /editorial and /editorial/review routes are untouched.

import type { Metadata } from "next";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { getAllMappings } from "@/lib/taxonomy/topic-translation-data";
import { getSurahIndex } from "@/lib/quran/data";
import { getCanonicalTopics } from "@/lib/taxonomy/canonical-adapter";
import MappingsClient, {
  type MappingRow,
  type SurahLabel,
} from "./mappings-client";

export const metadata: Metadata = {
  title: "Scholarly Mapping Review · Al-Huda",
  description:
    "Human scholarly review workspace for topic–ayah mappings. Reviewer tool; not indexed.",
  robots: { index: false, follow: false },
};

export default function ScholarlyMappingsPage() {
  let mappings: ReturnType<typeof getAllMappings>;
  try {
    mappings = getAllMappings();
  } catch {
    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-12">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Scholarly Mapping Review
        </h1>
        <section
          aria-labelledby="mappings-unavailable"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div className="space-y-2 text-sm">
              <h2 id="mappings-unavailable" className="font-semibold">
                Mapping data could not be loaded
              </h2>
              <p>
                The topic–ayah mapping dataset is unavailable on this device.
                Nothing was modified. Reload the page or check the dataset
                installation.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const topicTitles: Record<string, string> = {};
  for (const topic of getCanonicalTopics()) {
    topicTitles[topic.id] = topic.title;
  }

  // Serializable rows: plain copies so the client never holds a reference to
  // the server-side cached mapping objects.
  const rows: MappingRow[] = mappings.map((m) => ({
    id: m.id,
    topicId: m.topicId,
    topicTitle: topicTitles[m.topicId] ?? m.topicId,
    surahNumber: m.surahNumber,
    ayahStart: m.ayahStart,
    ayahEnd: m.ayahEnd,
    mappingType: m.mappingType,
    rationale: m.rationale,
    sourceIds: [...m.sourceIds],
    provenance: m.provenance,
    status: m.status,
  }));

  const surahs: SurahLabel[] = getSurahIndex().map((s) => ({
    id: s.id,
    transliteration: s.transliteration,
    meaning: s.meaning,
    ayahCount: s.ayahCount,
  }));

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Editorial · Scholarly Review
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Scholarly Mapping Review Workspace
        </h1>
        <p className="max-w-prose text-muted-foreground">
          This is a <strong>human scholarly review workspace</strong> for the{" "}
          {rows.length} topic–ayah mappings. All mappings remain{" "}
          <strong>pending-scholarly-review</strong>: passing technical
          validation (schema checks, ayah resolution) is{" "}
          <strong>not scholarly approval</strong>. Approval requires an
          explicit human decision with a written rationale and verified
          evidence.
        </p>
        <div
          role="note"
          className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <ShieldAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <p>
            <strong>Reviewer identity is local and unauthenticated.</strong>{" "}
            Names and roles entered here are self-declared and stored only in
            this browser. No one is described as a qualified scholar unless a
            credential has been explicitly verified through a recorded
            governance action. Review history is append-only and stays on
            this device; there is no cloud sync and no AI-generated decision.
          </p>
        </div>
      </header>

      <MappingsClient mappings={rows} surahs={surahs} />
    </div>
  );
}
