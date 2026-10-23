import { NextRequest, NextResponse } from "next/server";
import { generateQuestions } from "@/lib/quiz/generator";
import type { QuizKind, QuizSessionConfig } from "@/lib/quiz/types";
import type { AyahRef } from "@/lib/quran/types";

/**
 * POST /api/v1/quiz/generate
 *
 * Server-side question generation. The client sends the session configuration
 * (source, enabled kinds, count, and for revision source the explicit refs)
 * and receives the generated questions as plain JSON.
 *
 * This endpoint exists because the generator imports the fs-backed Quran
 * dataset, which cannot enter a client bundle. The client holds the revision
 * pool in localStorage and must pass it to the server for generation.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "Request body must be an object" },
      { status: 400 }
    );
  }

  const raw = body as Record<string, unknown>;

  // Parse config.
  const sourceKind = typeof raw.sourceKind === "string" ? raw.sourceKind : "default";
  const sourceId = typeof raw.sourceId === "string" ? raw.sourceId : undefined;
  const count = typeof raw.count === "number" ? raw.count : 10;
  const kinds = Array.isArray(raw.kinds) ? raw.kinds : [];
  const refs = Array.isArray(raw.refs) ? raw.refs : undefined;

  // Validate count.
  const safeCount = Math.min(Math.max(count, 5), 30);

  // Validate kinds.
  const KNOWN_KINDS: QuizKind[] = [
    "surah-identification",
    "translation-match",
    "ayah-ordering",
    "topic-match",
    "ayah-recall",
    "missing-word",
    "reference-recognition",
  ];
  const safeKinds = kinds.filter(
    (k): k is QuizKind =>
      typeof k === "string" && KNOWN_KINDS.includes(k as QuizKind)
  );

  // Validate refs for revision source.
  let safeRefs: AyahRef[] | undefined;
  if (sourceKind === "revision" && refs) {
    safeRefs = refs
      .filter(
        (r): r is AyahRef =>
          typeof r === "object" &&
          r !== null &&
          "surah" in r &&
          "ayah" in r &&
          typeof (r as any).surah === "number" &&
          typeof (r as any).ayah === "number"
      )
      .map((r) => ({ surah: r.surah, ayah: r.ayah }));
    if (safeRefs.length === 0) {
      return NextResponse.json(
        { error: "Revision source requires at least one valid reference" },
        { status: 400 }
      );
    }
  }

  // Build generator options.
  const genOpts: Parameters<typeof generateQuestions>[0] = {
    seed: Date.now(),
    count: safeCount,
  };

  if (sourceKind === "surah" && sourceId) {
    const surahId = Number(sourceId);
    if (!Number.isInteger(surahId) || surahId < 1 || surahId > 114) {
      return NextResponse.json(
        { error: "Invalid surah id" },
        { status: 400 }
      );
    }
    genOpts.surahId = surahId;
  } else if (sourceKind === "path" && sourceId) {
    genOpts.pathSlug = sourceId;
  } else if (sourceKind === "topic" && sourceId) {
    genOpts.topicSlug = sourceId;
  } else if (sourceKind === "revision" && safeRefs) {
    genOpts.refs = safeRefs;
  }

  if (safeKinds.length > 0) {
    genOpts.kinds = safeKinds;
  }

  // Generate questions.
  const questions = generateQuestions(genOpts);

  if (questions.length === 0) {
    return NextResponse.json(
      { error: "Could not generate questions from the given source" },
      { status: 400 }
    );
  }

  // Build config to return.
  const config: QuizSessionConfig = {
    source:
      sourceKind === "surah" && sourceId
        ? { kind: "surah", surahId: Number(sourceId) }
        : sourceKind === "path" && sourceId
        ? { kind: "path", pathSlug: sourceId }
        : sourceKind === "topic" && sourceId
        ? { kind: "topic", topicSlug: sourceId }
        : sourceKind === "revision"
        ? { kind: "revision" }
        : { kind: "default" },
    enabledKinds: safeKinds,
    requestedCount: safeCount,
  };

  return NextResponse.json({ questions, config });
}
