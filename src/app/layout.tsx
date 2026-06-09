import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "arabic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "arabic"],
});

export const metadata: Metadata = {
  title: "Al-Huda | الهدى — The Quran That Speaks To You",
  description: "Reconnect with the complete Quran through personalized understanding. Al-Huda presents all 6,236 verses with authentic sources, knowledge graphs, and guidance for every life situation.",
  keywords: ["Quran", "قرآن", "Islamic app", "Tafsir", "تفسیر", "Hadith", "حدیث", "Muslim", "Islamic learning", "Islam"],
  authors: [{ name: "Dawood - House of Solutions" }],
  openGraph: {
    title: "Al-Huda | الهدى",
    description: "The Quran that speaks to you",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1B4F72",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}