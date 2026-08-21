import React, { useEffect } from "react";
import { Icon } from "~/app/(main)/components/icons";

import { BLOCK_META } from "~/app/(main)/builder/constants";
import HelpTip from "~/app/(main)/builder/components/HelpTip";
import { ScribbleArrow } from "../origami/deco";
import PreviewInput from "~/app/(main)/builder/[formId]/preview/components/PreviewInput";
import { HeadingTypeProps, InputFieldTypeProps, PageBreakTypeProps, ReviewTypeProps, CoverTypeProps, FlowQuestion } from "./types";
import { useRouter, useSearchParams } from "next/navigation";

const CoverType = (props: CoverTypeProps) => {
    const { title, description, estimatedTime, questions, next } = props;
    return (
        <div className="pv-centered">
            <span className="pv-mascot">
                <Icon name="crane" size={72} />
            </span>
            <h1 className="pv-title">{title}</h1>
            {description && <p className="pv-help">{description}</p>}
            <div className="pv-actions pv-actions--center">
                <button className="o-btn o-btn--accent o-btn--lg" onClick={next}>
                    Start folding <Icon name="arrow" size={16} />
                </button>
            </div>
            <p className="pv-margin-note">↓ a few folds, {estimatedTime}</p>
            <div className="pv-facts">
                <span>
                    <Icon name="layers" size={14} /> {questions.length} questions
                </span>
                <span>
                    <Icon name="clock" size={14} /> {estimatedTime}
                </span>
            </div>
        </div>
    );
};

const HeadingType = (props: HeadingTypeProps) => {
    const { step, next } = props;
    return (
        <div className="pv-centered">
            <p className="pv-quote">{step.label}</p>
            {step.description && <p className="pv-help">{step.description}</p>}
            <div className="pv-actions pv-actions--center">
                <button className="o-btn o-btn--accent o-btn--lg" onClick={next}>
                    Turn the leaf <Icon name="arrow" size={16} />
                </button>
            </div>
        </div>
    );
};

const PageBreakType = (props: PageBreakTypeProps) => {
    const { step, next } = props;
    return (
        <div className="pv-centered">
            <p className="pv-quote">{step.label || "halfway there"}</p>
            <div className="pv-actions pv-actions--center">
                <button className="o-btn o-btn--accent o-btn--lg" onClick={next}>
                    Turn the leaf <Icon name="arrow" size={16} />
                </button>
            </div>
        </div>
    );
};

const InputFieldType = (props: InputFieldTypeProps) => {
    const { at, step, answers, error, showError, visitedReviewPage, goToReview, setAnswer, next } = props;
    return (
        <>
            <div className="pv-num-row">
                {String(at).padStart(2, "0")}
                <span className="arrow">→</span>
                <span className={`pv-type-pill t-${BLOCK_META[step.field.type]?.tint ?? "accent"}`}>
                    {BLOCK_META[step.field.type]?.label.toLowerCase() ?? step.field.type}
                </span>
                {step.field.required && <span className="pv-req">required</span>}

                {visitedReviewPage && (
                    <button
                        type="button"
                        className="pf-to-review"
                        onClick={goToReview}
                        title="Return to the summary"
                    >
                        <Icon name="list" size={13} />
                        <span>Review</span>
                    </button>
                )}
            </div>

            <h2 className="pv-title">
                {step.field.label || "Untitled question"}
                {step.field.helpText && (
                    <span className="pv-title-tip">
                        <HelpTip text={step.field.helpText} />
                    </span>
                )}
            </h2>
            {step.field.description && <p className="pv-help">{step.field.description}</p>}

            <div className="pv-answer">
                <span className="pv-scribble" aria-hidden>
                    <ScribbleArrow size={78} />
                </span>
                <PreviewInput
                    field={step.field}
                    value={answers[step.id]}
                    onChange={(value) => setAnswer(step.id, value)}
                />
            </div>

            {showError && (
                <p className="pf-error" role="alert">
                    <Icon name="clip" size={14} /> {error}
                </p>
            )}

            <div className="pv-actions">
                <button className="o-btn o-btn--accent o-btn--lg" onClick={next}>
                    Fold and continue <Icon name="check" size={16} />
                </button>
            </div>
        </>
    );
};

const ReviewType = (props: ReviewTypeProps) => {
    const { answered, questions, answers, error, isPreview, submitting, setVisitedReviewPage, goToQuestion, submit } =
        props;
    const NOT_SUMMARISED = ["long_text", "file_upload"];


    useEffect(() => {
        setVisitedReviewPage(true)
    }, [])

    return (
        <div className="pv-centered">
            <span className="pv-mascot">
                <Icon name="crane" size={64} />
            </span>
            <h2 className="pv-title">Ready to send?</h2>
            <p className="pv-help">
                {answered} of {questions.length} answered
            </p>

            <div className="pv-review">
                {questions
                    .filter((question) => !NOT_SUMMARISED.includes(question.field.type))
                    .map((question) => {
                        const value = answers[question.id];
                        const shown = Array.isArray(value) ? value.join(", ") : value;
                        return (
                            <button
                                type="button"
                                className="row pf-review-row"
                                key={question.id}
                                onClick={() => goToQuestion(question)}
                            >
                                <span className="q">{question.field.label || "Untitled"}</span>
                                <span className="a">{shown || "—"}</span>
                            </button>
                        );
                    })}
                {questions.length === 0 && <p className="pv-rail-empty">Nothing to answer here.</p>}
            </div>

            {error && (
                <p className="pf-error" role="alert">
                    <Icon name="clip" size={14} /> {error}
                </p>
            )}

            <div className="pv-actions pv-actions--center">
                <button
                    className="o-btn o-btn--accent o-btn--lg"
                    onClick={submit}
                    disabled={isPreview || submitting}
                >
                    <Icon name="sparkles" size={16} />
                    {submitting ? "Sending…" : "Send it flying"}
                </button>
                <span className="ok-hint">
                    {isPreview
                        ? "this crane stays on the desk — preview only"
                        : "your answers go straight to the form's owner"}
                </span>
            </div>
        </div>
    );
};

export { CoverType, HeadingType, PageBreakType, InputFieldType, ReviewType };
