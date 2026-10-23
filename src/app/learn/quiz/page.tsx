import type { Metadata } from "next";
import { QuizWorkspace } from "@/components/quiz/quiz-workspace";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Self-assessment quiz",
  description:
    "Check what you already know and what is worth revisiting. No timers, no rankings.",
  robots: { index: false, follow: true },
  alternates: { canonical: absoluteUrl("/learn/quiz") },
};

/**
 * Quiz page — server component that renders the workspace.
 *
 * The workspace handles the setup form and calls the generation API when the
 * learner submits. This page is a thin shell: it does not generate questions
 * server-side because the configuration (source, kinds, count, revision refs)
 * lives in the client.
 */
export default function QuizPage() {
  return <QuizWorkspace />;
}
