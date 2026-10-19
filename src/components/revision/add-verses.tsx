"use client";

// FR-050 — select a revision range.
//
// Verse counts arrive as props from the server component, so the span is
// bounded against the real surah length from the pinned dataset rather than a
// hand-maintained table that could drift. The expansion itself is done by the
// pure `expandRange` in @/lib/revision/scheduling, which is where the
// validation is tested.
//
// The preview distinguishes "N new" from "M already in your plan" on purpose:
// submitting a range that is entirely duplicate would otherwise look like a
// silent failure, and the learner would reasonably conclude the tool is broken.

import { useMemo, useState, type FormEvent } from "react";
import { ListPlus } from "lucide-react";
import { toast } from "sonner";
import { useRevision } from "@/lib/revision/context";
import { LADDERS, MAX_RANGE_SIZE, expandRange, refKey } from "@/lib/revision/scheduling";
import type { SurahOption } from "@/lib/revision/surah-options";
import { cn } from "@/lib/utils";

const FIELD_CLASS =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

export function AddVerses({ surahOptions }: { surahOptions: SurahOption[] }) {
  const { addRange, settings, setDefaultLadder, isInPlan } = useRevision();

  const [surahId, setSurahId] = useState<number>(1);
  const [fromDraft, setFromDraft] = useState("1");
  const [toDraft, setToDraft] = useState("1");

  const surah = useMemo(
    () => surahOptions.find((s) => s.id === surahId) ?? surahOptions[0],
    [surahOptions, surahId]
  );

  const from = Number(fromDraft);
  const to = Number(toDraft);

  // Single source of truth for validity: the same pure function the submit
  // handler uses, so the UI can never promise a range the module will reject.
  const expansion = useMemo(
    () =>
      surah
        ? expandRange({ surah: surah.id, fromAyah: from, toAyah: to }, surah.ayahCount)
        : { refs: [], error: "Surah metadata is unavailable." },
    [surah, from, to]
  );

  const preview = useMemo(() => {
    let added = 0;
    let already = 0;
    for (const ref of expansion.refs) {
      if (isInPlan(refKey(ref.surah, ref.ayah))) already += 1;
      else added += 1;
    }
    return { added, already };
  }, [expansion.refs, isInPlan]);

  function handleSurahChange(next: string) {
    const id = Number(next);
    setSurahId(id);
    // Reset the span rather than carrying a number that may exceed the new
    // surah's verse count.
    setFromDraft("1");
    setToDraft("1");
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!surah) return;
    if (expansion.error) {
      toast.error(expansion.error);
      return;
    }
    const result = addRange(expansion.refs);
    if (result.added === 0) {
      toast.info(
        `All ${result.skipped} verse${result.skipped === 1 ? " is" : "s are"} already in your plan — nothing was duplicated.`
      );
      return;
    }
    toast.success(
      `Added ${result.added} verse${result.added === 1 ? "" : "s"} from ${surah.transliteration}${
        result.skipped > 0 ? ` (${result.skipped} already planned)` : ""
      }. The first review is scheduled for tomorrow.`
    );
  }

  if (!surah) return null;

  return (
    <section
      aria-labelledby="add-verses-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <h2
        id="add-verses-heading"
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <ListPlus className="h-4 w-4 text-gold" aria-hidden />
        Add verses to your plan
      </h2>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        Pick a surah and a span of ayat. A single ayah is a span of one — enter the
        same number in both fields.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label
              htmlFor="add-surah"
              className="block text-xs font-medium text-foreground/80"
            >
              Surah
            </label>
            <select
              id="add-surah"
              value={surah.id}
              onChange={(e) => handleSurahChange(e.target.value)}
              className={cn(FIELD_CLASS, "mt-1.5")}
            >
              {surahOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.id}. {option.transliteration} ({option.ayahCount} ayat)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="add-from"
              className="block text-xs font-medium text-foreground/80"
            >
              From ayah
            </label>
            <input
              id="add-from"
              type="number"
              inputMode="numeric"
              min={1}
              max={surah.ayahCount}
              value={fromDraft}
              onChange={(e) => setFromDraft(e.target.value)}
              className={cn(FIELD_CLASS, "mt-1.5 tabular-nums")}
            />
          </div>

          <div>
            <label
              htmlFor="add-to"
              className="block text-xs font-medium text-foreground/80"
            >
              To ayah
            </label>
            <input
              id="add-to"
              type="number"
              inputMode="numeric"
              min={1}
              max={surah.ayahCount}
              value={toDraft}
              onChange={(e) => setToDraft(e.target.value)}
              className={cn(FIELD_CLASS, "mt-1.5 tabular-nums")}
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-xs font-medium text-foreground/80">
            Review spacing for these verses
          </legend>
          <p className="mt-1 text-xs text-muted-foreground">
            Applies to verses added from now on. Existing verses keep their own
            spacing unless you change it in the plan below.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {LADDERS.map((ladder) => (
              <label
                key={ladder.id}
                className={cn(
                  "cursor-pointer rounded-xl border p-3 transition-colors",
                  settings.ladderId === ladder.id
                    ? "border-gold bg-gold-soft/60"
                    : "border-border bg-background hover:bg-secondary/60"
                )}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="revision-ladder"
                    value={ladder.id}
                    checked={settings.ladderId === ladder.id}
                    onChange={() => setDefaultLadder(ladder.id)}
                    className="accent-[#0f5c48]"
                  />
                  <span className="text-sm font-medium text-foreground">
                    {ladder.label}
                  </span>
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                  {ladder.description}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Announces validation and the preview count so the state is not
            conveyed by colour alone (PRD §11). */}
        <p
          aria-live="polite"
          className={cn(
            "min-h-[1.25rem] text-sm",
            expansion.error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {expansion.error
            ? expansion.error
            : `${expansion.refs.length} verse${
                expansion.refs.length === 1 ? "" : "s"
              } — ${preview.added} new, ${preview.already} already planned. Limits: ${MAX_RANGE_SIZE} per addition.`}
        </p>

        <button
          type="submit"
          disabled={Boolean(expansion.error)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors",
            "hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          Add to plan
        </button>
      </form>
    </section>
  );
}
