"use client";

// Correction intake (PRD §20 "Correction process", FR-066).
//
// Quran text and reference errors are treated as critical incidents, which is
// why they are the first options in the category list rather than a footnote.
//
// DELIVERY IS HONESTLY INCOMPLETE. No destination address or issue tracker is
// configured for this build, so the form validates the report, formats it, and
// copies it to the clipboard, and the page says exactly that — a form that
// pretended to send would be worse than one that admits it cannot. Closing
// FR-066 means configuring a destination; the mechanics are already here.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Check, Copy, Send } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  {
    value: "quran-text",
    label: "Quran text error (critical)",
    hint: "Arabic that does not match the pinned dataset.",
  },
  {
    value: "reference",
    label: "Reference error (critical)",
    hint: "A link that opens the wrong ayah, or a reference that does not resolve.",
  },
  {
    value: "attribution",
    label: "Translation or source attribution",
    hint: "Edition, translator, licence, or version shown incorrectly.",
  },
  {
    value: "topic-link",
    label: "Topic mapping",
    hint: "A verse that does not belong in a topic, or a misleading rationale.",
  },
  {
    value: "ai-answer",
    label: "AI answer (when enabled)",
    hint: "Inaccurate or inappropriate AI output — the AI answer feature is currently off.",
  },
  {
    value: "other",
    label: "Technical defect",
    hint: "Anything else: broken layout, navigation, search, or export.",
  },
] as const;

const reportSchema = z.object({
  category: z.enum(
    ["quran-text", "reference", "attribution", "topic-link", "ai-answer", "other"],
    { errorMap: () => ({ message: "Choose what kind of problem this is." }) }
  ),
  reference: z
    .string()
    .trim()
    .regex(/^$|^\d{1,3}:\d{1,3}$/, "Use the form 2:286, or leave this empty.")
    .optional(),
  details: z
    .string()
    .trim()
    .min(15, "Describe the problem in at least 15 characters — enough to act on."),
  contact: z
    .string()
    .trim()
    .email("Enter a valid email address, or leave this empty.")
    .optional()
    .or(z.literal("")),
});

type ReportForm = z.infer<typeof reportSchema>;

const FIELD_CLASS =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30";

export default function ReportPage() {
  const [copied, setCopied] = useState(false);
  const [lastReport, setLastReport] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: { category: "quran-text", reference: "", details: "", contact: "" },
  });

  async function onSubmit(values: ReportForm) {
    const category = CATEGORIES.find((c) => c.value === values.category);
    const stamp = new Date().toISOString();
    const text = [
      "Al-Huda correction report",
      `Date: ${stamp}`,
      `Category: ${category?.label ?? values.category}`,
      values.reference ? `Reference: ${values.reference}` : "Reference: (none)",
      values.contact ? `Contact: ${values.contact}` : "Contact: (none)",
      "",
      values.details,
      "",
      "— submitted from the /report form",
    ].join("\n");

    setLastReport(text);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Report copied to your clipboard");
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
      toast.error("Could not access the clipboard — select the text below and copy it");
    }
    reset();
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <AlertTriangle className="h-4 w-4 text-gold" aria-hidden />
          Corrections
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Report a problem
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Quran text and reference errors are treated as critical incidents and
          go to the top of the list. Nothing you enter here is stored by this
          site — there is no account, no analytics, and no server that receives
          this form.
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border border-border/80 bg-card p-5"
      >
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-foreground/80">
            What is wrong?
          </label>
          <select id="category" {...register("category")} className={`${FIELD_CLASS} mt-1.5`}>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-muted-foreground">
            {CATEGORIES.find((c) => c.value === "quran-text")?.hint}
          </p>
        </div>

        <div>
          <label htmlFor="reference" className="block text-xs font-medium text-foreground/80">
            Ayah reference <span className="text-muted-foreground">(optional)</span>
          </label>
          <input
            id="reference"
            {...register("reference")}
            placeholder="e.g. 2:286"
            className={`${FIELD_CLASS} mt-1.5 tabular-nums`}
          />
          {errors.reference && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.reference.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="details" className="block text-xs font-medium text-foreground/80">
            What did you see, and what should it be?
          </label>
          <textarea
            id="details"
            rows={6}
            {...register("details")}
            placeholder="Quote the text you believe is wrong, give the reference, and say what the correct value is if you know it."
            className={`${FIELD_CLASS} mt-1.5 resize-y`}
          />
          {errors.details && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.details.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact" className="block text-xs font-medium text-foreground/80">
            Contact <span className="text-muted-foreground">(optional — never stored)</span>
          </label>
          <input
            id="contact"
            type="email"
            {...register("contact")}
            placeholder="you@example.com"
            className={`${FIELD_CLASS} mt-1.5`}
          />
          {errors.contact && (
            <p role="alert" className="mt-1 text-xs text-destructive">
              {errors.contact.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
        >
          <Send className="h-4 w-4" aria-hidden />
          Prepare report
        </button>
      </form>

      {lastReport && (
        <section aria-live="polite" className="space-y-3 rounded-2xl border border-gold/40 bg-gold-soft/50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
            Your report (copied{copied ? "" : " — copy it manually"})
          </h2>
          <pre className="whitespace-pre-wrap rounded-xl border border-border/70 bg-background/70 p-3 font-mono text-xs leading-relaxed text-foreground">
            {lastReport}
          </pre>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(lastReport);
                setCopied(true);
                toast.success("Copied again");
              } catch {
                toast.error("Could not access the clipboard");
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-ring"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy again"}
          </button>
          <p className="max-w-prose rounded-xl border border-border/70 bg-background/70 p-3 text-xs leading-relaxed text-foreground/85">
            <span className="font-semibold">No delivery destination is configured yet.</span>{" "}
            This build does not email or transmit the report: copy it and send it
            through whatever channel the site operators publish. Until a
            destination exists, correction intake (and FR-066 for AI answers)
            stays open — the form above is the mechanics, the address is the
            remaining piece.
          </p>
        </section>
      )}
    </div>
  );
}
