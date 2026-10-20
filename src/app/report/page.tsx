"use client";

import { useState } from "react";
import { Copy, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  REPORT_EMAIL,
  buildReportMailto,
  canEmailReport,
} from "@/lib/report-destination";

type Category =
  | "inaccurate-verse"
  | "inaccurate-topic"
  | "ai-answer"
  | "accessibility"
  | "other";

const CATEGORIES: Array<{ value: Category; label: string; hint: string }> = [
  {
    value: "inaccurate-verse",
    label: "Inaccurate verse",
    hint: "Text, reference, or translation appears wrong",
  },
  {
    value: "inaccurate-topic",
    label: "Inaccurate topic",
    hint: "Curated relation or rationale seems incorrect",
  },
  {
    value: "ai-answer",
    label: "AI answer issue",
    hint: "Claim not grounded, overreaching, or missing attribution",
  },
  {
    value: "accessibility",
    label: "Accessibility",
    hint: "Keyboard, screen reader, or contrast issue",
  },
  { value: "other", label: "Other", hint: "Anything else" },
];

export default function ReportPage() {
  const [category, setCategory] = useState<Category>("inaccurate-verse");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [report, setReport] = useState<string | null>(null);

  const emailReady = canEmailReport();

  function prepare() {
    const lines: string[] = [
      "AL-HUDA REPORT",
      `Category: ${
        CATEGORIES.find((c) => c.value === category)?.label ?? category
      }`,
      `Location / URL: ${location.trim() || "(not provided)"}`,
      `Date: ${new Date().toISOString()}`,
      "",
      "Details:",
      details.trim() || "(not provided)",
      "",
      "Steps to reproduce:",
      steps.trim() || "(not provided)",
      "",
      "Expected behaviour:",
      expected.trim() || "(not provided)",
      "",
      "Device context (optional):",
      `User agent: ${
        typeof navigator !== "undefined" ? navigator.userAgent : "(unknown)"
      }`,
    ];
    setReport(lines.join("\n"));
    toast.success(
      emailReady
        ? "Report prepared. Email it or copy it below."
        : "Report prepared. Copy it and send it through a published feedback channel."
    );
  }

  async function copy() {
    if (!report) return;
    try {
      await navigator.clipboard.writeText(report);
      toast.success("Report copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  }

  function email() {
    if (!report || !emailReady) return;
    window.location.href = buildReportMailto(report);
    toast.success("Opening your email app");
  }

  function download() {
    if (!report) return;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "al-huda-report.txt";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded as al-huda-report.txt");
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Report an issue
        </h1>
        <p className="max-w-prose text-muted-foreground">
          For inaccuracies in verse text, topic curation, or AI answers.
          Reports are prepared on this device — there is no server endpoint for
          submissions.
        </p>
      </header>

      <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-5">
        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label} — {c.hint}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Location / URL
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. /quran/al-baqarah or https://..."
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium">
            Details
          </label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={5}
            placeholder="Describe the issue as precisely as possible. Include references (surah:ayah) if relevant."
            className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="steps" className="block text-sm font-medium">
              Steps to reproduce
            </label>
            <textarea
              id="steps"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              rows={4}
              placeholder="What did you do?"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="expected" className="block text-sm font-medium">
              Expected behaviour
            </label>
            <textarea
              id="expected"
              value={expected}
              onChange={(e) => setExpected(e.target.value)}
              rows={4}
              placeholder="What should have happened?"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={prepare}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Prepare report
        </button>
      </section>

      {report && (
        <section className="space-y-3 rounded-2xl border border-border/80 bg-card p-5">
          <h2 className="text-base font-semibold">Prepared report</h2>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl border border-border bg-background p-4 text-xs leading-relaxed">
            {report}
          </pre>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Copy className="h-4 w-4" aria-hidden />
              Copy to clipboard
            </button>
            <button
              type="button"
              onClick={download}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-4 w-4" aria-hidden />
              Download as file
            </button>
            {emailReady && (
              <button
                type="button"
                onClick={email}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Mail className="h-4 w-4" aria-hidden />
                Email this report
              </button>
            )}
          </div>
          {emailReady ? (
            <p className="text-xs text-muted-foreground">
              Reports are delivered to <strong>{REPORT_EMAIL}</strong> via your
              email app. Nothing is uploaded from this page itself.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              No delivery address is configured for this deployment (set
              NEXT_PUBLIC_REPORT_EMAIL to enable email delivery). Copy or
              download the report and send it through an established feedback
              channel.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
