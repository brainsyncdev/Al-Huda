import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";
import { LearningDashboard } from "@/components/learn/learning-dashboard";

export const metadata: Metadata = {
  title: "Learn — Al-Huda",
  description: "Personalized Quran learning dashboard",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/learn") },
};

export default function LearnPage() {
  return <LearningDashboard />;
}
