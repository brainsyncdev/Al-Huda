import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms for using this Quran reading application.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Terms of use
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: 2026-10-17</p>
      </header>

      <section className="space-y-4">
        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Use of content</h2>
          <p>
            Quran text and translation are reproduced from openly licensed sources listed on the Sources page. Reproduction must respect each source’s license and attribution requirements. Arabic text and translations must not be altered.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">No religious rulings</h2>
          <p>
            Topic pages, curation, and any editorial text on this site are reading aids. They are not tafsir, fatwa, or legal rulings. Always consult qualified scholarship for religious guidance.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Disclaimer of warranties</h2>
          <p>
            This application is provided “as is” without warranties of any kind, express or implied. We do not guarantee completeness, accuracy, or availability.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, the authors and contributors shall not be liable for any indirect, incidental, or consequential damages arising from use of this application.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Changes</h2>
          <p>
            These terms may be updated. Continued use after changes constitutes acceptance of the revised terms. The current version is always available at this URL.
          </p>
        </article>
      </section>
    </div>
  );
}
