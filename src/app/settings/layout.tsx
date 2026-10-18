import type { Metadata } from "next";

// Settings exposes private reader preferences for this device; keep it out of
// search indexes entirely.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
