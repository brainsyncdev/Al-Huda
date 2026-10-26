import type { Metadata, Viewport } from "next";
import { Geist, Lora, Amiri_Quran } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LibraryProvider } from "@/lib/library/context";
import { PrefsProvider } from "@/lib/prefs/context";
import { RevisionProvider } from "@/lib/revision/context";
import { PathsProvider } from "@/lib/paths/context";
import { QuizProvider } from "@/lib/quiz/context";
import { ReadingPlansProvider } from "@/lib/reading-plans/context";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { GlobalSearchShortcut } from "@/components/search/global-search-shortcut";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import { I18nProvider } from "@/lib/i18n/context";
import { SkipLink } from "@/components/layout/skip-link";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const amiriQuran = Amiri_Quran({
  variable: "--font-quran",
  subsets: ["arabic"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Read the Quran in Uthmani script with translations in 100+ languages (default: Urdu — Jalandhry), stable ayah references, search, and curated topic entry points. Source-transparent, ad-free, and calm.",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "A calm, source-first Quran reading hub: full Uthmani text, translations in 100+ languages, search, stable references, and curated topics.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    site: SITE_URL,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Read the Quran in Uthmani script with translations in 100+ languages (default: Urdu — Jalandhry), stable ayah references, search, and curated topic entry points.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0f5c48",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geist.variable} ${lora.variable} ${amiriQuran.variable} font-sans antialiased min-h-dvh flex flex-col`}
      >
        <SkipLink />
      <I18nProvider>
      <LibraryProvider>
        <PrefsProvider>
          <RevisionProvider>
            <PathsProvider>
              <QuizProvider>
                <ReadingPlansProvider>
                  <SiteHeader />
                  <main
                    id="main-content"
                    className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-24 md:pb-12 pt-6"
                  >
                    {children}
                  </main>
                  <SiteFooter />
                  <MobileBottomNav />
                  <GlobalSearchShortcut />
                  <Toaster position="bottom-center" />
                </ReadingPlansProvider>
              </QuizProvider>
            </PathsProvider>
            </RevisionProvider>
          </PrefsProvider>
        </LibraryProvider>
      </I18nProvider>
      </body>
    </html>
  );
}
