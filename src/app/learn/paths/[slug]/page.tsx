import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPath, PATHS } from "@/lib/paths/data";
import { getSurah } from "@/lib/quran/data";
import { PathWorkspace } from "@/components/paths/path-workspace";
import type { PathStepDTO } from "@/components/paths/path-workspace";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PATHS.map((path) => ({ slug: path.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getPath(slug);
  if (!path) return {};

  return {
    title: `${path.title} — Learning Paths — Al-Huda`,
    description: path.summary,
    robots: { index: false, follow: false },
  };
}

export default async function PathDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const path = getPath(slug);
  if (!path) notFound();

  // Load ayah data for each step (server-side).
  const stepsDTO: PathStepDTO[] = path.steps.map((step) => {
    const surah = getSurah(step.ref.surah);
    const ayah = surah?.ayat.find((a) => a.ayah === step.ref.ayah) ?? null;

    return {
      order: step.order,
      ref: step.ref,
      topicSlug: step.topicSlug,
      objective: step.objective,
      reflectionPrompt: step.reflectionPrompt,
      arabic: ayah?.arabic ?? "",
      translation: ayah?.translation ?? "",
      transliteration: ayah?.transliteration ?? "",
      surahTransliteration: surah?.transliteration ?? "",
    };
  });

  return (
    <PathWorkspace
      path={{
        slug: path.slug,
        title: path.title,
        arabicTitle: path.arabicTitle,
        summary: path.summary,
        targetAudience: path.targetAudience,
        related: path.related,
        provenance: path.provenance,
        totalSteps: path.steps.length,
      }}
      steps={stepsDTO}
    />
  );
}
