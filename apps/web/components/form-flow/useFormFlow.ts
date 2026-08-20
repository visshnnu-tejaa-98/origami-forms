"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AnswerValue } from "~/app/(main)/builder/types";
import { validateAnswer } from "./flow";
import type { Answers, FlowMode, FlowQuestion, FlowStep, FormFlow } from "./types";

type UseFormFlowProps = {
    steps: FlowStep[];
    mode: FlowMode;
    onSubmit?: (answers: Answers, completionTimeInSec: number) => Promise<void>;
    onClose?: () => void;
};


export const useFormFlow = ({ steps, mode, onSubmit, onClose }: UseFormFlowProps): FormFlow => {
    const [at, setAt] = useState(0);
    // which way the last move went, so the sheet animates with the travel
    const [back, setBack] = useState(false);
    const [answers, setAnswers] = useState<Answers>({});
    const [error, setError] = useState<string | null>(null);

    // the clock starts when the flow does, so the owner sees how long the form really took
    const startedAt = useRef(Date.now());

    const total = steps.length - 1;
    const step = steps[Math.min(at, total)]!;

    const questions = useMemo(
        () => steps.filter((s) => s.kind === "field"),
        [steps],
    );

    const go = useCallback(
        (to: number, keepError = false) => {
            setAt((current) => {
                const next = Math.max(0, Math.min(total, to));
                setBack(next < current);
                return next;
            });
            if (!keepError) setError(null);
        },
        [total],
    );

    const goToQuestion = useCallback(
        (question: FlowQuestion, keepError = false) => go(steps.indexOf(question), keepError),
        [go, steps],
    );

    const setAnswer = useCallback((id: string, value: AnswerValue) => {
        setAnswers((current) => ({ ...current, [id]: value }));
        setError(null);
    }, []);

    const advance = useCallback(() => {
        if (step.kind === "field") {
            const problem = validateAnswer(step.field, answers[step.id]);
            if (problem) return setError(problem);
        }
        go(at + 1);
    }, [answers, at, go, step]);

    const submit = useCallback(async () => {
        const unanswered = questions.find(
            (question) => validateAnswer(question.field, answers[question.id]) !== null,
        );

        if (unanswered) {
            setError(`"${unanswered.field.label || "A question"}" still needs an answer.`);
            return goToQuestion(unanswered, true);
        }

        if (mode === "preview" || !onSubmit) return;

        try {
            await onSubmit(answers, Math.round((Date.now() - startedAt.current) / 1000));
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "We couldn't send that. Give it another go?",
            );
        }
    }, [answers, goToQuestion, mode, onSubmit, questions]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const typing = target?.matches("input, textarea");

            if (e.key === "Escape" && onClose) return onClose();
            if (typing && e.key !== "Enter") return;
            if (e.key === "Enter" && !(target instanceof HTMLTextAreaElement)) {
                e.preventDefault();
                if (at === total) return void submit();
                return mode === "preview" ? go(at + 1) : advance()
            }
            if (!typing && e.key === "ArrowRight") mode === "preview" ? go(at + 1) : advance()
            if (!typing && e.key === "ArrowLeft" && at > 0) go(at - 1);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [advance, at, go, onClose, submit, total]);

    return {
        at,
        total,
        back,
        step,
        questions,
        answers,
        error,
        setAnswer,
        go,
        goToQuestion,
        advance,
        submit,
    };
};
