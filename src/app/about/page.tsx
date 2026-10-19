import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, ShieldCheck } from "lucide-react";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { SOURCES, ARABIC_CREDIT, TRANSLATION_CREDIT, PACKAGE_CREDIT } from "@/lib/quran/sources";

export const metadata: Metadata = {
  title: `About — ${SITE_NAME}`,
  description: "About the calm, source-first Quran reading hub.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          About {SITE_NAME}
        </h1>
        <p className="max-w-prose text-muted-foreground">{SITE_TAGLINE} — a calm, source-first way to read the Quran. No clutter, no streaks. Just Uthmani text with a trusted English translation, stable references, and editorial reading aids with clear provenance.</p>
      </header>

      <section aria-labelledby="principles" className="space-y-4">
        <h2 id="principles" className="font-display text-xl font-semibold tracking-tight">
          Principles
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <li className="rounded-2xl border border-border/80 bg-card p-5">
            <h3 className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
              Content integrity first
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">Arabic text and translations are reproduced verbatim from pinned sources. No AI-generated text is presented as scripture.</p>
          </li>
          <li className="rounded-2xl border border-border/80 bg-card p-5">
            <h3 className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-gold" aria-hidden />
              Provenance on display
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">Each source (Arabic, translation, transliteration, package) is listed with attribution, license, publisher, version, and homepage on the Sources page.</p>
          </li>
          <li className="rounded-2xl border border-border/80 bg-card p-5">
            <h3 className="flex items-center gap-2 font-medium">
              <BookOpen className="h-4 w-4 text-gold" aria-hidden />
              Respectful UX
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">Private, lightweight, and distraction-free. Library notes and preferences stay on your device.</p>
          </li>
        </ul>
      </section>

      <section aria-labelledby="pinned" className="space-y-3">
        <h2 id="pinned" className="font-display text-xl font-semibold tracking-tight">
          Pinned dataset
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 text-sm leading-relaxed">
          <ul className="space-y-2 text-foreground/85">
            <li><span className="font-medium">Arabic:</span> {ARABIC_CREDIT}</li>
            <li><span className="font-medium">Translation:</span> {TRANSLATION_CREDIT}</li>
            <li><span className="font-medium">Package:</span> {PACKAGE_CREDIT}</li>
          </ul>
          <Link href="/sources" className="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
            See full source catalog →
          </Link>
        </div>
      </section>
    </div>
  );
}
