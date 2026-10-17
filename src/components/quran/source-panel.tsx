import { ExternalLink, ShieldCheck } from "lucide-react";
import {
  ARABIC_CREDIT,
  PACKAGE_CREDIT,
  SOURCES,
  TRANSLATION_CREDIT,
} from "@/lib/quran/sources";

/**
 * Provenance panel shown on reader and ayah pages. Every claim about text
 * origin traces to a catalog entry (see sources.ts / docs/DATA-PROVENANCE.md).
 */
export function SourcePanel() {
  return (
    <section
      aria-labelledby="source-panel-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
        <h2 id="source-panel-heading" className="font-display text-lg font-semibold">
          Sources &amp; provenance
        </h2>
      </div>

      <ul className="space-y-3 text-sm leading-relaxed text-foreground/85">
        <li>
          <span className="font-medium">Arabic text:</span>{" "}
          {ARABIC_CREDIT}
        </li>
        <li>
          <span className="font-medium">Translation:</span> {TRANSLATION_CREDIT}.
          Reproduced as distributed — no paraphrasing.
        </li>
        <li>
          <span className="font-medium">Package:</span> {PACKAGE_CREDIT}
        </li>
      </ul>

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Full source catalog
        </h3>
        <ul className="space-y-2.5">
          {SOURCES.map((source) => (
            <li
              key={source.id}
              className="rounded-xl border border-border/70 bg-background/60 px-3.5 py-2.5"
            >
              <p className="text-sm font-medium">{source.provides}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {source.attribution} — {source.publisher} · {source.license} ·{" "}
                v{source.version}
              </p>
              <a
                href={source.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Visit source
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 rounded-xl bg-gold-soft/70 px-3.5 py-2.5 text-xs leading-relaxed text-accent-foreground">
        This panel lists only sources actually used for the content on this
        page. No AI-generated text is presented as scripture, and no content
        is shown without a recorded source.
      </p>
    </section>
  );
}
