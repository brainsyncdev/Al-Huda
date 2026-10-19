import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How this application handles your data — locally, without accounts or analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Privacy policy
        </h1>
        <p className="text-sm text-muted-foreground">Last updated: 2026-10-17</p>
      </header>

      <section className="space-y-4">
        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Summary</h2>
          <p>
            This application does not require an account, does not collect personal information, does not use analytics or tracking, and does not send your reading data to a server. Bookmarks, notes, and reading preferences are stored in your browser’s localStorage.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">What is stored on your device</h2>
          <ul className="list-disc space-y-1 pl-4">
            <li>Bookmarks (surah, ayah, timestamp)</li>
            <li>Private notes (text you type, timestamps)</li>
            <li>Reading progress (surah, ayah, timestamp)</li>
            <li>Reader preferences (Arabic size, translation/transliteration visibility)</li>
          </ul>
          <p>All of this data never leaves your browser. You can export or delete it at any time from the Library or Settings pages.</p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">What we do not collect</h2>
          <ul className="list-disc space-y-1 pl-4">
            <li>No accounts, names, or contact details</li>
            <li>No cookies for tracking or advertising</li>
            <li>No analytics, session recording, or third-party trackers</li>
            <li>No upload of bookmarks, notes, or reading history to any server</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Third-party content</h2>
          <p>
            Quran text and translation are displayed from a pinned, openly licensed dataset bundled with the application (see the Sources page for attribution and terms). External links open in new tabs; those sites have their own privacy policies.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Children</h2>
          <p>
            Because no personal data is collected, the application does not knowingly collect information from children or any other user.
          </p>
        </article>

        <article className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 text-sm leading-relaxed">
          <h2 className="text-base font-semibold">Changes</h2>
          <p>
            If this policy changes, the update date above will be revised. The current version is always available at this URL.
          </p>
        </article>
      </section>
    </div>
  );
}
