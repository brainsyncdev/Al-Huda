import type { Metadata } from "next";
import { OnboardingClient } from "@/components/paths/onboarding-client";

export const metadata: Metadata = {
  title: "Welcome — Al-Huda",
  description: "Choose your learning goal to get started with personalized Quran study paths.",
  robots: { index: false, follow: false },
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
