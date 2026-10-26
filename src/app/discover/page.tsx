import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { DiscoverClient } from "./discover-client";

export const metadata: Metadata = {
  title: "Discover — Your Quran Learning Hub",
  description:
    "Learning paths, broad themes, dimensions, and search: find your starting point.",
  openGraph: {
    title: "Discover — Your Quran Learning Hub",
    description:
      "Learning paths, broad themes, dimensions, and search: find your starting point.",
    url: `${SITE_URL}/discover`,
    siteName: SITE_NAME,
  },
};

export default function DiscoverPage() {
  return <DiscoverClient />;
}
