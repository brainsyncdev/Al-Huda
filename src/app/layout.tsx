import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al-Huda | الهدى — The Quran That Speaks To You",
  description: "Reconnect with the complete Quran through personalized understanding. Al-Huda presents the full 6,236 verses with authentic sources, knowledge graphs, and guidance for every life situation.",
  keywords: ["Quran", "قرآن", "Islamic app", "Tafsir", "تفسیر", "Hadith", "حدیث", "Muslim", "Islamic learning"],
  authors: [{ name: "Dawood - House of Solutions" }],
  openGraph: {
    title: "Al-Huda | الهدى",
    description: "The Quran that speaks to you",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}