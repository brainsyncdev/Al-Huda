import Link from "next/link";
import { CurrentYear } from "@/components/layout/current-year";
import { ServerFooterText } from "@/components/layout/site-footer-text";

const FOOTER_LINK_KEYS = [
  { href: "/about", key: "footer.about" },
  { href: "/sources", key: "footer.sources" },
  { href: "/settings", key: "common.settings" },
  { href: "/report", key: "footer.report" },
  { href: "/accessibility", key: "footer.accessibility" },
  { href: "/privacy", key: "footer.privacy" },
  { href: "/terms", key: "footer.terms" },
] as const;

/**
 * Site footer. Carries the required attribution lines for the Quran text and
 * translation (PRD: explicit provenance wherever content is presented).
 *
 * The footer is a server component for performance. Translated strings are
 * rendered via a small client wrapper (ServerFooterText) that reads from
 * the i18n context.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-card/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-primary">
              <ServerFooterText k="layout.siteName" />
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              <ServerFooterText k="footer.tagline" />
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {FOOTER_LINK_KEYS.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ServerFooterText k={key} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <hr className="gold-rule my-6" />

        <div className="space-y-1.5 text-xs leading-relaxed text-muted-foreground">
          <p>
            <ServerFooterText k="footer.arabicCredit" />
          </p>
          <p>
            <ServerFooterText k="footer.translationCredit" />
          </p>
          <p className="pt-2">
            <ServerFooterText k="footer.editorialNote" />
          </p>
          <p className="pt-2">
            © <CurrentYear buildYear={new Date().getFullYear()} />{" "}
            <ServerFooterText k="layout.siteName" />.{" "}
            <ServerFooterText k="footer.licenseNote" />
          </p>
        </div>
      </div>
    </footer>
  );
}
