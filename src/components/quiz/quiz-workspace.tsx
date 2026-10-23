"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useQuiz } from "@/lib/quiz/context";
import { useRevision } from "@/lib/revision/context";
import { isCorrect } from "@/lib/quiz/scoring";
import type {
  QuizKind,
  QuizQuestion,
  QuizResponse,
  QuizSessionConfig,
} from "@/lib/quiz/types";
import { cn } from "@/lib/utils";
import { PATHS } from "@/lib/paths/data";
import { TOPICS } from "@/lib/topics/data";
import { getSurahIndex } from "@/lib/quran/data";

type Phase = "idle" | "active" | "review";

const KIND_LABELS: Record<QuizKind, string> = {
  "surah-identification": "Surah identification",
  "translation-match": "Translation match",
  "ayah-ordering": "Ayah ordering",
  "topic-match": "Topic match",
  "ayah-recall": "Ayah recall",
  "missing-word": "Missing word",
  "reference-recognition": "Reference recognition",
};

export function QuizWorkspace() {
  const { hydrated, state, startQuiz, recordResponse, completeQuiz } = useQuiz();
  const revision = useRevision();

  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [config, setConfig] = useState<QuizSessionConfig | null>(null);
  const [answers, setAnswers] = useState<Record<string, QuizResponse>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup form state.
  const [setupSource, setSetupSource] = useState<
    "default" | "surah" | "path" | "topic" | "revision"
  >("default");
  const [setupSourceId, setSetupSourceId] = useState<string>("");
  const [setupKinds, setSetupKinds] = useState<QuizKind[]>([
    "surah-identification",
    "translation-match",
    "ayah-ordering",
    "topic-match",
    "ayah-recall",
    "missing-word",
    "reference-recognition",
  ]);
  const [setupCount, setSetupCount] = useState<number>(10);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const body: Record<string, unknown> = {
        sourceKind: setupSource,
        count: setupCount,
        kinds: setupKinds,
      };

      if (setupSource !== "default" && setupSource !== "revision" && setupSourceId) {
        body.sourceId = setupSourceId;
      }

      if (setupSource === "revision") {
        // Collect revision items from the local plan.
        const items = Object.values(revision.items);
        if (items.length === 0) {
          setError("Your revision plan is empty. Add verses to revise first.");
          setLoading(false);
          return;
        }
        body.refs = items.map((item) => ({
          surah: item.surah,
          ayah: item.ayah,
        }));
      }

      const res = await fetch("/api/v1/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Generation failed" }));
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      const questions: QuizQuestion[] = data.questions;
      const config: QuizSessionConfig = data.config;

      if (questions.length === 0) {
        throw new Error("Could not generate questions from the given source");
      }

      startQuiz(questions, config);
      setQuestions(questions);
      setConfig(config);
      setAnswers({});
      setIndex(0);
      setResult(null);
      setPhase("active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  }, [setupSource, setupSourceId, setupKinds, setupCount, revision.items, startQuiz]);

  const answer = useCallback(
    (questionId: string, response: QuizResponse) => {
      setAnswers((prev) => ({ ...prev, [questionId]: response }));
      recordResponse(questionId, response);
    },
    [recordResponse]
  );

  const finish = useCallback(() => {
    const scored = completeQuiz();
    setResult(scored);
    setPhase("review");
  }, [completeQuiz]);

  const history = useMemo(
    () => state.attempts.filter((a) => a.completedAt !== null).slice(0, 5),
    [state.attempts]
  );

  if (!hydrated) {
    return (
      <div role="status" className="space-y-4">
        <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  // Setup form.
  if (phase === "idle") {
    const surahs = getSurahIndex();
    return (
      <div className="space-y-8 pb-8">
        <header className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Self-assessment quiz
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Choose your learning source, question types, and session length. No timers, no rankings.
          </p>
        </header>

        <section className="rounded-2xl border border-border/80 bg-card p-6 space-y-6">
          {/* Source selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Learning source</label>
            <select
              value={setupSource}
              onChange={(e) => setSetupSource(e.target.value as typeof setupSource)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="default">Default mix</option>
              <option value="surah">Specific surah</option>
              <option value="path">Learning path</option>
              <option value="topic">Topic</option>
              <option value="revision">My revision plan</option>
            </select>

            {setupSource === "surah" && (
              <select
                value={setupSourceId}
                onChange={(e) => setSetupSourceId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm mt-2"
              >
                <option value="">Select a surah</option>
                {surahs.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.transliteration} ({s.id})
                  </option>
                ))}
              </select>
            )}

            {setupSource === "path" && (
              <select
                value={setupSourceId}
                onChange={(e) => setSetupSourceId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm mt-2"
              >
                <option value="">Select a path</option>
                {PATHS.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}

            {setupSource === "topic" && (
              <select
                value={setupSourceId}
                onChange={(e) => setSetupSourceId(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm mt-2"
              >
                <option value="">Select a topic</option>
                {TOPICS.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.title}
                  </option>
                ))}
              </select>
            )}

            {setupSource === "revision" && (
              <p className="text-xs text-muted-foreground mt-2">
                Questions will be drawn from your revision plan ({Object.keys(revision.items).length} verses).
              </p>
            )}
          </div>

          {/* Question types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Question types</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(KIND_LABELS) as QuizKind[]).map((kind) => (
                <label key={kind} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={setupKinds.includes(kind)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSetupKinds([...setupKinds, kind]);
                      } else {
                        setSetupKinds(setupKinds.filter((k) => k !== kind));
                      }
                    }}
                    className="h-4 w-4 rounded border-input"
                  />
                  {KIND_LABELS[kind]}
                </label>
              ))}
            </div>
          </div>

          {/* Count */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Number of questions</label>
            <input
              type="range"
              min={5}
              max={30}
              value={setupCount}
              onChange={(e) => setSetupCount(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">{setupCount} questions</p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={start}
            disabled={loading || setupKinds.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Generating…" : "Generate quiz"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </section>

        {/* History */}
        {history.length > 0 && (
          <section className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent attempts
            </h2>
            <ul className="space-y-2">
              {history.map((attempt) => {
                const scored = attempt.questions.reduce((acc, q) => {
                  const resp = attempt.responses[q.id];
                  return resp && isCorrect(q, resp) ? acc + 1 : acc;
                }, 0);
                return (
                  <li key={attempt.id} className="text-sm">
                    <span className="font-medium">{scored} of {attempt.questions.length}</span>
                    <span className="text-muted-foreground ml-2">
                      {new Date(attempt.completedAt!).toLocaleDateString()}
                    </span>
                    {attempt.config && (
                      <span className="text-xs text-muted-foreground ml-2">
                        ({attempt.config.source.kind})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    );
  }

  // Active quiz phase.
  if (phase === "active" && questions[index]) {
    return (
      <ActiveQuestion
        question={questions[index]}
        value={answers[questions[index].id]}
        onChange={(resp) => answer(questions[index].id, resp)}
        position={index + 1}
        total={questions.length}
        onNext={() => {
          if (index + 1 < questions.length) setIndex((i) => i + 1);
          else finish();
        }}
      />
    );
  }

  // Review phase.
  if (phase === "review" && result) {
    return (
      <section className="space-y-5" aria-labelledby="result-heading">
        <div className="rounded-2xl border border-border/80 bg-card p-6">
          <h2 id="result-heading" className="font-display text-2xl font-semibold">
            {result.correct} of {result.total} correct
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This number is for you alone. Reading the explanations below is the part that helps.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => {
                setPhase("idle");
                setQuestions([]);
                setConfig(null);
                setAnswers({});
                setIndex(0);
                setResult(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              New quiz
            </button>
            <Link
              href="/learn/paths"
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Back to learning paths
            </Link>
          </div>
        </div>

        {/* Related learning paths */}
        {(() => {
          const ayatInQuiz = new Set(
            questions.flatMap((q) =>
              q.refs.map((r) => `${r.surah}:${r.ayah}`)
            )
          );
          const relatedPaths = PATHS.filter((path) =>
            path.steps.some((step) =>
              ayatInQuiz.has(`${step.ref.surah}:${step.ref.ayah}`)
            )
          ).slice(0, 3);
          if (relatedPaths.length === 0) return null;
          return (
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Continue studying
              </h3>
              <p className="text-sm text-muted-foreground">
                These learning paths include ayat from this quiz.
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedPaths.map((path) => (
                  <Link
                    key={path.slug}
                    href={`/learn/paths/${path.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <span className="arabic-display text-base text-gold">
                      {path.arabicTitle}
                    </span>
                    {path.title}
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        <ul className="space-y-3">
          {questions.map((q, i) => (
            <ReviewItem
              key={q.id}
              question={q}
              response={answers[q.id]}
              position={i + 1}
            />
          ))}
        </ul>
      </section>
    );
  }

  return null;
}

/* -------------------------------------------------------------------------- */
/* Active question                                                            */
/* -------------------------------------------------------------------------- */

interface ActiveQuestionProps {
  question: QuizQuestion;
  value: QuizResponse | undefined;
  onChange: (response: QuizResponse) => void;
  position: number;
  total: number;
  onNext: () => void;
}

function ActiveQuestion({
  question,
  value,
  onChange,
  position,
  total,
  onNext,
}: ActiveQuestionProps) {
  const answered = value !== undefined;

  return (
    <section
      aria-labelledby="question-heading"
      className="rounded-2xl border border-border/80 bg-card p-6 space-y-4"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 id="question-heading" className="font-display text-xl font-semibold">
          Question {position} of {total}
        </h2>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {kindLabel(question.kind)}
        </span>
      </div>

      <p className="text-foreground">{question.prompt}</p>

      {question.kind === "surah-identification" && (
        <fieldset className="space-y-3">
          <legend className="sr-only">Choose the surah</legend>
          <p
            lang="ar"
            dir="rtl"
            className="arabic-text rounded-xl bg-secondary/60 p-4 text-[1.5rem] leading-[2.2] text-foreground"
          >
            {question.data.arabic}
          </p>
          <ul className="space-y-2">
            {question.data.options.map((option, i) => (
              <li key={`${option.surahId}-${i}`}>
                <OptionButton
                  selected={
                    value?.kind === "surah-identification" &&
                    value.selectedIndex === i
                  }
                  onSelect={() =>
                    onChange({ kind: "surah-identification", selectedIndex: i })
                  }
                  label={option.surahName}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {question.kind === "translation-match" && (
        <fieldset className="space-y-3">
          <legend className="sr-only">Choose the translation</legend>
          <p
            lang="ar"
            dir="rtl"
            className="arabic-text rounded-xl bg-secondary/60 p-4 text-[1.5rem] leading-[2.2] text-foreground"
          >
            {question.data.arabic}
          </p>
          <ul className="space-y-2">
            {question.data.options.map((option, i) => (
              <li key={i}>
                <OptionButton
                  selected={
                    value?.kind === "translation-match" &&
                    value.selectedIndex === i
                  }
                  onSelect={() =>
                    onChange({ kind: "translation-match", selectedIndex: i })
                  }
                  label={option}
                />
              </li>
            ))}
          </ul>
        </fieldset>
      )}

      {question.kind === "ayah-ordering" && (
        <OrderingInput
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.kind === "topic-match" && (
        <TopicMatchInput
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.kind === "ayah-recall" && (
        <AyahRecallInput
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.kind === "missing-word" && (
        <MissingWordInput
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      {question.kind === "reference-recognition" && (
        <ReferenceRecognitionInput
          question={question}
          value={value}
          onChange={onChange}
        />
      )}

      <div className="flex items-center justify-between border-t border-border/70 pt-4">
        <p className="text-xs text-muted-foreground">
          {answered ? "Answer recorded." : "Select an answer to continue."}
        </p>
        <button
          type="button"
          onClick={onNext}
          disabled={!answered}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {position === total ? "See results" : "Next question"}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </section>
  );
}

function OptionButton({
  selected,
  onSelect,
  label,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-start gap-2.5 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
        selected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border/80 bg-background/60 text-foreground/85 hover:bg-secondary/60"
      )}
    >
      {selected ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      ) : (
        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      )}
      <span>{label}</span>
    </button>
  );
}

function OrderingInput({
  question,
  value,
  onChange,
}: {
  question: Extract<QuizQuestion, { kind: "ayah-ordering" }>;
  value: QuizResponse | undefined;
  onChange: (response: QuizResponse) => void;
}) {
  const ordered = value?.kind === "ayah-ordering" ? value.orderedIndices : [];

  function append(i: number) {
    if (ordered.includes(i)) return;
    onChange({ kind: "ayah-ordering", orderedIndices: [...ordered, i] });
  }

  function clear() {
    onChange({ kind: "ayah-ordering", orderedIndices: [] });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Select the ayat in order. Your sequence appears below; use Clear to start
        again.
      </p>
      <ul className="space-y-2">
        {question.data.items.map((item, i) => {
          const position = ordered.indexOf(i);
          return (
            <li key={`${item.ref.surah}:${item.ref.ayah}`}>
              <button
                type="button"
                onClick={() => append(i)}
                disabled={position !== -1}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  position !== -1
                    ? "border-primary/60 bg-primary/5"
                    : "border-border/80 bg-background/60 hover:bg-secondary/60"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    position !== -1
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  )}
                  aria-hidden
                >
                  {position !== -1 ? position + 1 : "·"}
                </span>
                <span className="min-w-0 space-y-1">
                  <span
                    lang="ar"
                    dir="rtl"
                    className="arabic-text block text-lg leading-relaxed text-foreground"
                  >
                    {item.arabic}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {item.translation}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {ordered.length > 0 && (
        <button
          type="button"
          onClick={clear}
          className="text-xs font-medium text-primary underline-offset-2 hover:underline"
        >
          Clear order
        </button>
      )}
    </div>
  );
}

function TopicMatchInput({
  question,
  value,
  onChange,
}: {
  question: Extract<QuizQuestion, { kind: "topic-match" }>;
  value: QuizResponse | undefined;
  onChange: (response: QuizResponse) => void;
}) {
  const selected =
    value?.kind === "topic-match" ? value.selectedIndices : [];

  function toggle(i: number) {
    const next = selected.includes(i)
      ? selected.filter((x) => x !== i)
      : [...selected, i];
    onChange({ kind: "topic-match", selectedIndices: next });
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-xs text-muted-foreground">
        Select every ayah that belongs to this topic.
      </legend>
      <ul className="space-y-2">
        {question.data.options.map((option, i) => {
          const isSelected = selected.includes(i);
          return (
            <li key={`${option.ref.surah}:${option.ref.ayah}`}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isSelected}
                className={cn(
                  "flex w-full items-start gap-2.5 rounded-xl border px-4 py-3 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border/80 bg-background/60 hover:bg-secondary/60"
                )}
              >
                <span
                  className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input"
                  )}
                  aria-hidden
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </span>
                <span className="min-w-0 space-y-1">
                  <span
                    lang="ar"
                    dir="rtl"
                    className="arabic-text block text-lg leading-relaxed text-foreground"
                  >
                    {option.arabic}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {option.translation}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function AyahRecallInput({
  question,
  value,
  onChange,
}: {
  question: Extract<QuizQuestion, { kind: "ayah-recall" }>;
  value: QuizResponse | undefined;
  onChange: (response: QuizResponse) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-3">
      {!revealed ? (
        <>
          <p className="text-sm text-muted-foreground">
            {question.data.recallPrompt}
          </p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Reveal the verse
          </button>
        </>
      ) : (
        <>
          <p
            lang="ar"
            dir="rtl"
            className="arabic-text rounded-xl bg-secondary/60 p-4 text-[1.5rem] leading-[2.2] text-foreground"
          >
            {question.data.canonicalArabic}
          </p>
          <p className="text-sm text-muted-foreground">
            {question.data.canonicalTranslation}
          </p>
          <fieldset className="space-y-2">
            <legend className="text-xs text-muted-foreground">
              How accurate was your recall?
            </legend>
            {(["accurate", "partial", "unable"] as const).map((rating) => (
              <label key={rating} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`recall-${question.id}`}
                  checked={value?.kind === "ayah-recall" && value.selfRating === rating}
                  onChange={() => onChange({ kind: "ayah-recall", selfRating: rating })}
                  className="h-4 w-4"
                />
                {rating.charAt(0).toUpperCase() + rating.slice(1)}
              </label>
            ))}
          </fieldset>
        </>
      )}
    </div>
  );
}

function MissingWordInput({
  question,
  value,
  onChange,
}: {
  question: Extract<QuizQuestion, { kind: "missing-word" }>;
  value: QuizResponse | undefined;
  onChange: (response: QuizResponse) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Choose the missing word</legend>
      <p
        lang="ar"
        dir="rtl"
        className="arabic-text rounded-xl bg-secondary/60 p-4 text-[1.5rem] leading-[2.2] text-foreground"
      >
        {question.data.displayArabic}
      </p>
      <ul className="space-y-2">
        {question.data.options.map((option, i) => (
          <li key={i}>
            <OptionButton
              selected={
                value?.kind === "missing-word" &&
                value.selectedIndex === i
              }
              onSelect={() =>
                onChange({ kind: "missing-word", selectedIndex: i })
              }
              label={option}
            />
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

function ReferenceRecognitionInput({
  question,
  value,
  onChange,
}: {
  question: Extract<QuizQuestion, { kind: "reference-recognition" }>;
  value: QuizResponse | undefined;
  onChange: (response: QuizResponse) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Choose the reference</legend>
      <p
        lang="ar"
        dir="rtl"
        className="arabic-text rounded-xl bg-secondary/60 p-4 text-[1.5rem] leading-[2.2] text-foreground"
      >
        {question.data.arabic}
      </p>
      <p className="text-sm text-muted-foreground">{question.data.translation}</p>
      <ul className="space-y-2">
        {question.data.options.map((option, i) => (
          <li key={`${option.ref.surah}:${option.ref.ayah}`}>
            <OptionButton
              selected={
                value?.kind === "reference-recognition" &&
                value.selectedIndex === i
              }
              onSelect={() =>
                onChange({ kind: "reference-recognition", selectedIndex: i })
              }
              label={option.label}
            />
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/* Review                                                                     */
/* -------------------------------------------------------------------------- */

function ReviewItem({
  question,
  response,
  position,
}: {
  question: QuizQuestion;
  response: QuizResponse | undefined;
  position: number;
}) {
  const correct = response ? isCorrect(question, response) : false;

  return (
    <li className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium text-foreground">
          {position}. {question.prompt}
        </h3>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider",
            correct
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {correct ? (
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <XCircle className="h-3.5 w-3.5" aria-hidden />
          )}
          {correct ? "Correct" : response ? "Incorrect" : "Unanswered"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Correct answer: <CorrectAnswer question={question} />
      </p>

      <ul className="flex flex-wrap gap-2">
        {question.refs.map((ref) => (
          <li key={`${ref.surah}:${ref.ayah}`}>
            <Link
              href={`/ayah/${ref.surah}/${ref.ayah}`}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Read {ref.surah}:{ref.ayah}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

function CorrectAnswer({ question }: { question: QuizQuestion }) {
  switch (question.kind) {
    case "surah-identification": {
      const option = question.data.options[question.data.correctIndex];
      return <span>{option ? option.surahName : "—"}</span>;
    }
    case "translation-match": {
      return <span>{question.data.options[question.data.correctIndex] ?? "—"}</span>;
    }
    case "ayah-ordering": {
      const refs = question.data.correctOrder
        .map((idx) => question.data.items[idx])
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => `${item.ref.surah}:${item.ref.ayah}`);
      return <span>{refs.join(" → ")}</span>;
    }
    case "topic-match": {
      const refs = question.data.correctIndices
        .map((idx) => question.data.options[idx])
        .filter((option): option is NonNullable<typeof option> => Boolean(option))
        .map((option) => `${option.ref.surah}:${option.ref.ayah}`);
      return <span>{refs.join(", ")}</span>;
    }
    case "ayah-recall": {
      return <span>Self-assessed</span>;
    }
    case "missing-word": {
      return <span>{question.data.missingWord}</span>;
    }
    case "reference-recognition": {
      const opt = question.data.options[question.data.correctIndex];
      return <span>{opt?.label ?? "—"}</span>;
    }
  }
}

function kindLabel(kind: QuizQuestion["kind"]): string {
  switch (kind) {
    case "surah-identification":
      return "Surah identification";
    case "translation-match":
      return "Translation match";
    case "ayah-ordering":
      return "Ayah ordering";
    case "topic-match":
      return "Topic match";
    case "ayah-recall":
      return "Ayah recall";
    case "missing-word":
      return "Missing word";
    case "reference-recognition":
      return "Reference recognition";
  }
}
