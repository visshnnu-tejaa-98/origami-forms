"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PreviewCanvas from "../../../(main)/builder/[formId]/preview/components/PreviewCanvas";
import type { AnswerValue } from "../../../(main)/builder/types";
import { useSubmitPublicResponse } from "~/hooks/use-public-form";
import type { Answers, PublicForm, PublicQuestion, PublicStep } from "../types";
import { toSteps, toSubmittedAnswers, validateAnswer } from "../utils";
import PublicFormStage from "./PublicFormStage";
import PublicFormState from "./PublicFormState";

const PublicFormScreen = ({ form }: { form: PublicForm }) => {
    const [at, setAt] = useState(0);
    // which way the last move went, so the sheet animates with the travel
    const [back, setBack] = useState(false);
    const [answers, setAnswers] = useState<Answers>({});
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    // the clock starts when the page does, so the owner sees how long the form really took
    const startedAt = useRef(Date.now());

    const { submitResponseAsync, submitResponseIsPending } = useSubmitPublicResponse();

    const steps = useMemo<PublicStep[]>(() => toSteps(form), [form]);
    const total = steps.length - 1;
    const step = steps[Math.min(at, total)]!;
    const questions = useMemo(
        () => steps.filter((s): s is PublicQuestion => s.kind === "field"),
        [steps],
    );

    const go = useCallback(
        (to: number) =>
            setAt((current) => {
                const next = Math.max(0, Math.min(total, to));
                setBack(next < current);
                setError(null);
                return next;
            }),
        [total],
    );

    /** a question's place in the flow, not its place in the question list — headings and
     *  page breaks are steps too */
    const goToQuestion = useCallback(
        (question: PublicQuestion) => go(steps.indexOf(question)),
        [go, steps],
    );

    const setAnswer = useCallback((id: string, value: AnswerValue) => {
        setAnswers((current) => ({ ...current, [id]: value }));
        setError(null);
    }, []);

    /** the sheet only turns once the answer on it passes its own rules */
    const advance = useCallback(() => {
        if (step.kind === "field") {
            const problem = validateAnswer(step.field, answers[step.id]);
            if (problem) return setError(problem);
        }
        go(at + 1);
    }, [answers, at, go, step]);

    const submit = useCallback(async () => {
        // a required field left behind is caught here rather than at the server
        const unanswered = questions.find(
            (question) => validateAnswer(question.field, answers[question.id]) !== null,
        );

        if (unanswered) {
            setError(`"${unanswered.field.label || "A question"}" still needs an answer.`);
            return goToQuestion(unanswered);
        }

        try {
            await submitResponseAsync({
                slug: form.slug,
                formId: form.id,
                answers: toSubmittedAnswers(answers),
                completionTimeInSec: Math.round((Date.now() - startedAt.current) / 1000),
            });
            setSent(true);
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "We couldn't send that. Give it another go?",
            );
        }
    }, [answers, form.id, form.slug, goToQuestion, questions, submitResponseAsync]);

    // enter and the arrow keys walk the flow, exactly as the preview does
    useEffect(() => {
        if (sent) return;

        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const typing = target?.matches("input, textarea");

            if (typing && e.key !== "Enter") return;
            if (e.key === "Enter" && !(target instanceof HTMLTextAreaElement)) {
                e.preventDefault();
                if (at === total) return void submit();
                return advance();
            }
            if (!typing && e.key === "ArrowRight") advance();
            if (!typing && e.key === "ArrowLeft" && at > 0) go(at - 1);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [advance, at, go, sent, submit, total]);

    if (sent) {
        return (
            <div className="db-shell db-shell--public o-scope">
                <main>
                    <div className="pv-screen pv-screen--page pf-screen">
                        <PreviewCanvas />
                        <PublicFormState
                            icon="sparkles"
                            title="Sent. Thank you."
                            description={`Your answers to "${form.title}" have landed safely on the other desk.`}
                        />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="db-shell db-shell--public o-scope">
            <main>
                <div className="pv-screen pv-screen--page pf-screen" aria-label={form.title}>
                    <PreviewCanvas />
                    <PublicFormStage
                        form={form}
                        at={at}
                        total={total}
                        back={back}
                        step={step}
                        questions={questions}
                        answers={answers}
                        setAnswer={setAnswer}
                        go={go}
                        goToQuestion={goToQuestion}
                        advance={advance}
                        error={error}
                        submit={submit}
                        submitting={submitResponseIsPending}
                    />
                </div>
            </main>
        </div>
    );
};

export default PublicFormScreen;
