import type { Metadata } from "next";

// The personal study workspace holds bookmarks, notes, collections, and
// reading progress. Keep it out of search indexes entirely.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: {
    default: "My Study",
    template: "%s · My Study",
  },
};

export default function MyStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
