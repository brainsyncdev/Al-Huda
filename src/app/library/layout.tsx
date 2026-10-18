import type { Metadata } from "next";

// The library holds personal bookmarks, notes, and progress. Keep it out of
// search indexes entirely.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
