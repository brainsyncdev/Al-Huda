"use client";

// Entry Point 5 (Reflect and Learn): Curated reflection prompts for ayah pages.
//
// SCHOLARLY GUARDRAILS (Section 7 + Section 6 EP5):
//   - Prompts are EDITORIAL EDUCATIONAL AIDS, not tafsir or religious guidance.
//   - Always phrased as open questions, never as claims about divine intent.
//   - Each prompt displays its provenance so epistemic categories stay distinct.
//   - User reflections are private, stored only in localStorage.

import { useState } from "react";
import { Lightbulb, Plus, X } from "lucide-react";
import { useReflections } from "@/lib/reflections/context";
import {
  getReflectionPromptsForTopics,
  type ReflectionPrompt,
} from "@/lib/reflections/prompts";

interface Props {
  /** Ayah reference in "surah:ayah" format. */
  ayahRef: string;
  /** Canonical topic IDs mapped to this ayah. */
  topicIds: string[];
}

export function ReflectionPromptsPanel({ ayahRef, topicIds }: Props) {
  const { addReflection, hydrated } = useReflections();
  const [selectedPrompt, setSelectedPrompt] = useState<ReflectionPrompt | null>(null);
  const [draft, setDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const prompts = getReflectionPromptsForTopics(topicIds, 3);

  if (!hydrated || prompts.length === 0) return null;

  function handleSave() {
    if (!draft.trim()) return;
    addReflection("ayah", ayahRef, draft.trim());
    setDraft("");
    setSelectedPrompt(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handlePromptClick(prompt: ReflectionPrompt) {
    setSelectedPrompt(prompt);
    setDraft("");
    setSaved(false);
  }

  return (
    <section
      aria-labelledby="reflection-prompts"
      className="rounded-2xl border border-border/60 bg-card/80 p-5"
    >
      <div className="flex items-start gap-2 mb-3">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
        <div>
          <h2
            id="reflection-prompts"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Reflect
          </h2>
          <p className="mt-0.5 text-sm text-foreground">
            Consider these questions as you study this verse.
          </p>
        </div>
      </div>

      {/* Prompt chips */}
      <div className="space-y-2">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            type="button"
            onClick={() => handlePromptClick(prompt)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              selectedPrompt?.id === prompt.id
                ? "border-primary/50 bg-primary/5 text-foreground"
                : "border-border/60 bg-background/50 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
            }`}
          >
            {prompt.text}
          </button>
        ))}
      </div>

      {/* Expanded reflection input */}
      {selectedPrompt && (
        <div className="mt-4 space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium text-primary">
              {selectedPrompt.text}
            </p>
            <button
              type="button"
              onClick={() => setSelectedPrompt(null)}
              className="shrink-0 rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your reflection…"
            rows={3}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] text-muted-foreground">
              Private — stored only on this device. Not tafsir.
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={!draft.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus className="h-3 w-3" aria-hidden />
              Save reflection
            </button>
          </div>
          {saved && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400" role="status">
              Reflection saved.
            </p>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] text-muted-foreground">
        Reflection prompts are editorial educational aids ({prompts[0]?.provenance ?? "editorial-educational-aid"}).
        They are not scholarly interpretation and do not claim divine intent.
      </p>
    </section>
  );
}
