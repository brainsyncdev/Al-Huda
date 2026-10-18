import { BookText, ExternalLink } from "lucide-react";
import { getSource } from "@/lib/quran/sources";

/**
 * Tafsir links panel for ayah and surah pages (FR-030/031/032).
 *
 * - FR-030: Show author/work/edition for tafsir.
 * - FR-031: Distinguish link to external source (we do NOT embed tafsir text).
 * - FR-032: Track licensing and permitted display/use per source.
 *
 * This panel only surfaces outbound links to reputable tafsir publishers.
 * No tafsir content is rendered, cached, or stored by the app itself.
 */
export function TafsirLinks({ surah, ayah }: { surah: number; ayah: number }) {
  const ibnKathir = getSource("tafsir-ibn-kathir");
  const maarif = getSource("tafsir-ma(arif)");
  const ref = `${surah}:${ayah}`;

  return (
    <section
      aria-labelledby="tafsir-links-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <BookText className="h-5 w-5 text-primary" aria-hidden />
        <h2 id="tafsir-links-heading" className="font-display text-lg font-semibold">
          Tafsir links
        </h2>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-foreground/85">
        External tafsir references for {ref}. The app does not bundle or display
        tafsir text itself; follow the links to the publishers' editions. Always
        consult qualified scholarship for interpretation.
      </p>

      <ul className="space-y-3 text-sm leading-relaxed">
        {ibnKathir && (
          <li className="rounded-xl border border-border/70 bg-background/60 px-3.5 py-2.5">
            <p className="font-medium">{ibnKathir.attribution}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ibnKathir.provides} · {ibnKathir.publisher} · License: {ibnKathir.license} · Link-out only (FR-031)
            </p>
            <a
              href={ibnKathir.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Open tafsir source
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </li>
        )}
        {maarif && (
          <li className="rounded-xl border border-border/70 bg-background/60 px-3.5 py-2.5">
            <p className="font-medium">{maarif.attribution}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {maarif.provides} · {maarif.publisher} · License: {maarif.license} · Link-out only (FR-031)
            </p>
            <a
              href={maarif.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Open tafsir source
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </li>
        )}
      </ul>

      <p className="mt-5 rounded-xl bg-gold-soft/70 px-3.5 py-2.5 text-xs leading-relaxed text-accent-foreground">
        These links are provided for reference only (FR-031: link to external
        source). Licensing and permitted display remain with the publishers
        (FR-032).
      </p>
    </section>
  );
}
