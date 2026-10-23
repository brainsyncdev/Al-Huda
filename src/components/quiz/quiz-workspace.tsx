"use client";

// Quiz workspace — self-assessment, never comparison.
//
// Deliberately absent: timers, streaks, percentiles, leaderboards, or a
// "score out of 100" framing. The result screen reports how many answers were
// right and shows each question with its correct answer, so the quiz teaches
// rather than ranks. History is local and private, like every other store.

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { useQuiz } from "@/lib/quiz/context";
import { isCorrect } from "@/lib/quiz/scoring";
import type {
  QuizQuestion,
  QuizResponse,
} from "@/lib/quiz/types";
import { cn } from "@/lib/utils";

/** Questions per attempt. Short enough to finish in one sitting. */
const QUESTIONS_PER_ATTEMPT = 8;

interface QuizWorkspaceProps {
  /** Pre-generated question bank, produced on the server from the dataset. */
  bank: QuizQuestion[];
}

type Phase = "idle" | "active" | "review";

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizWorkspace({ bank }: QuizWorkspaceProps) {
  const { hydrated, state, startQuiz, recordResponse, completeQuiz, scoreAttempt } =
    useQuiz();

  const [phase, setPhase] = useState<Phase>("idle");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, QuizResponse>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(
    null
  );

  const start = useCallback(() => {
    const picked = shuffle(bank).slice(0, QUESTIONS_PER_ATTEMPT);
    if (picked.length === 0) return;
    startQuiz(picked);
    setQuestions(picked);
    setAnswers({});
    setIndex(0);
    setResult(null);
    setPhase("active");
  }, [bank, startQuiz]);

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

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Self-assessment
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Eight questions drawn from the shipped dataset. Nothing here is timed,
          ranked, or shared — the point is to notice what you already know and
          what is worth revisiting. Wrong answers show the correct one.
        </p>
      </header>

      {bank.length === 0 && (
        <p className="rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground">
          The question bank could not be generated from the current dataset.
          Nothing else was changed.
        </p>
      )}

      {phase === "idle" && bank.length > 0 && (
        <section className="rounded-2xl border border-border/80 bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Ready when you are</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Questions cover surah identification, translation matching, ayah
            ordering, and curated topics. You can stop at any point; an
            unfinished attempt is simply not recorded as complete.
          </p>
          <button
            type="button"
            onClick={start}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Start {QUESTIONS_PER_ATTEMPT} questions
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </section>
      )}

      {phase === "active" && questions[index] && (
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
      )}

      {phase === "review" && result && (
        <section className="space-y-5" aria-labelledby="result-heading">
          <div className="rounded-2xl border border-border/80 bg-card p-6">
            <h2 id="result-heading" className="font-display text-2xl font-semibold">
              {result.correct} of {result.total} correct
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This number is for you alone. It is not stored as a rank, and
              nothing is uploaded. Reading the explanations below is the part
              that helps.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <RotateCcw className="h-4 w-4" aria-hidden />
                Another set
              </button>
              <Link
                href="/learn/paths"
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-5 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Back to learning paths
              </Link>
            </div>
          </div>

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
      )}

      {history.length > 0 && phase !== "active" && (
        <section aria-labelledby="history-heading" className="space-y-3">
          <h2
            id="history-heading"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Recent attempts on this device
          </h2>
          <ul className="space-y-2">
            {history.map((attempt) => {
              const score = scoreAttempt(attempt.id);
              return (
                <li
                  key={attempt.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {attempt.completedAt
                      ? new Date(attempt.completedAt).toLocaleString()
                      : "Completed"}
                  </span>
                  <span className="font-medium">
                    {score ? `${score.correct} of ${score.total}` : "—"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-muted-foreground">
            History is kept in this browser only. Clear it from Library or
            Settings with the rest of your local data.
          </p>
        </section>
      )}
    </div>
  );
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
  }
}