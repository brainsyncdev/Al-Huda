import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "Accessibility commitments for this application.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Accessibility statement
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: 2026-10-17</p>
      </header>

      <section className="space-y-4">
        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Commitment</h2>
          <p>
            This application aims to meet WCAG 2.1 Level AA where practical. We test with keyboard-only navigation, screen readers, and high-contrast preferences during development.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Features</h2>
          <ul className="list-disc space-y-1 pl-4">
            <li>Keyboard-navigable layout and skip-to-content support.</li>
            <li>Text scales with browser zoom up to 200% without loss of content.</li>
            <li>Semantic HTML landmarks and ARIA labels for navigation landmarks.</li>
            <li>Reduced-motion preference respected for animations.</li>
            <li>Sufficient color contrast for body text on light backgrounds.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Known limitations</h2>
          <p>
            Arabic text uses a dedicated Quran font; script rendering may vary across screen readers. We are actively improving Arabic screen-reader support.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Feedback</h2>
          <p>
            If you encounter an accessibility barrier, use the{" "}
            <a href="/report" className="font-medium text-primary hover:underline">
              Report an issue
            </a>{" "}
            form — describe what blocked you and where. We aim to respond within a
            reasonable timeframe. If the page has no working contact channel, say
            so in the report so it can be fixed first.
          </p>
        </article>
      </section>
    </div>
  );
}
