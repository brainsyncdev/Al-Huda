import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/sources", label: "Sources" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
] as const;

/**
 * Site footer. Carries the required attribution lines for the Quran text and
 * translation (PRD: explicit provenance wherever content is presented).
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-primary">
              {SITE_NAME}
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              A calm, source-first place to read and study the Quran.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="gold-rule my-6" />

        <div className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <p>
            Arabic text (Uthmani): via{" "}
            <a
              href="https://quranenc.com/en/home"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              quranenc.com
            </a>
            , distributed through{" "}
            <a
              href="https://github.com/risan/quran-json"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              quran-json v3.1.2
            </a>{" "}
            (CC-BY-4.0).
          </p>
          <p>
            English translation: Saheeh International (Umm Muhammad), via{" "}
            <a
              href="https://tanzil.net/trans/en.sahih"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Tanzil.net
            </a>
            . Transliteration via Tanzil.net.
          </p>
          <p className="pt-2">
            Topic selections are editorial reading aids — not tafsir, not rulings.
            See the review status on every topic page.
          </p>
          <p className="pt-2">© {new Date().getFullYear()} {SITE_NAME}. Content licenses respected; see /sources.</p>
        </div>
      </div>
    </footer>
  );
}
