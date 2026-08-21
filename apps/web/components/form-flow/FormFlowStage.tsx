import React, { useState } from "react";
import { estimatedTimeToCompleteForm } from "~/app/(main)/utils";
import FieldCard from "~/app/(public)/form/components/FieldCard";
import { isAnswered } from "./flow";
import type { FormFlowStageProps } from "./types";
import "./FormFlowStage.css";
import { CoverType, HeadingType, InputFieldType, PageBreakType, ReviewType } from "./FieldTypes";
import PublicFormHeader from "./PublicFormHeader";
import PublicFormFooter from "./PublicFormFooter";

const FormFlowStage = ({
    mode,
    flow,
    title,
    description,
    submitting = false,
    status,
    brand,
}: FormFlowStageProps) => {
    const {
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
        goToReview,
        advance,
        submit,
    } = flow;

    const [visitedReviewPage, setVisitedReviewPage] = useState(false)
    const isPreview = mode === "preview";
    const answered = questions.filter((question) => isAnswered(answers[question.id])).length;
    const estimatedTime = estimatedTimeToCompleteForm(questions.length);
    const progress = Math.max(4, (at / Math.max(1, total)) * 100);

    const next = isPreview ? () => go(at + 1) : advance;

    const showError = error && !isPreview;

    return (
        <section className={`pv-stage${isPreview ? "" : " pf-stage"}`}>
            <PublicFormHeader
                isPreview={isPreview}
                at={at}
                total={total}
                progress={progress}
                status={status}
                brand={brand}
            />
            <div className="pv-pages">
                <FieldCard at={at} total={total} back={back}>
                    {step.kind === "cover" && (
                        <CoverType
                            title={title}
                            description={description}
                            estimatedTime={estimatedTime}
                            questions={questions}
                            mode={mode}
                            flow={flow}
                            next={next}
                        />
                    )}

                    {step.kind === "heading" && <HeadingType step={step} next={next} />}

                    {step.kind === "page-break" && <PageBreakType step={step} next={next} />}

                    {step.kind === "field" && (
                        <InputFieldType
                            at={at}
                            step={step}
                            answers={answers}
                            error={error}
                            showError={showError}
                            visitedReviewPage={visitedReviewPage}
                            goToReview={goToReview}
                            setAnswer={setAnswer}
                            next={next}
                        />
                    )}

                    {step.kind === "review" && (
                        <ReviewType
                            answered={answered}
                            questions={questions}
                            answers={answers}
                            error={error}
                            isPreview={isPreview}
                            submitting={submitting}
                            setVisitedReviewPage={setVisitedReviewPage}
                            goToQuestion={goToQuestion}
                            submit={submit}
                        />
                    )}
                </FieldCard>
            </div>
            <PublicFormFooter
                isPreview={isPreview}
                at={at}
                total={total}
                go={go}
                next={next}
            />
        </section>
    );
};

export default FormFlowStage;
