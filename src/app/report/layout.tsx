import type { Metadata } from "next";

// Server boundary for the correction form: /report/page.tsx is a client
// component (it needs the clipboard), and client components cannot export
// `metadata`. Same pattern as the library and settings layouts.
//
// Noindex: a utility form with no content adds nothing to search results.
export const metadata: Metadata = {
  title: "Report a problem",
  description:
    "Report a Quran text error, reference error, attribution issue, or technical defect.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/report" },
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
