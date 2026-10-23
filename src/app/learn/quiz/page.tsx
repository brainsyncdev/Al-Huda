import type { Metadata } from "next";
import { QuizWorkspace } from "@/components/quiz/quiz-workspace";
import { generateQuestions } from "@/lib/quiz/generator";
import { absoluteUrl } from "@/lib/site";

// Server component: the question bank is generated here from the fs-backed
// dataset and passed to the client as plain data. The generator must never be
// imported into a client bundle, so the client receives questions, not the
// loader.

export const metadata: Metadata = {
  title: "Self-assessment quiz",
  description:
    "Check what you already know and what is worth revisiting: surah identification, translation matching, ayah ordering, and curated topics. No timers, no rankings.",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/learn/quiz") },
};

export default function QuizPage() {
  // Fixed seed: the bank is stable across builds, while each attempt picks a
  // fresh random subset in the browser.
  const bank = generateQuestions({ seed: 20261023, count: 40 });

  return <QuizWorkspace bank={bank} />;
}