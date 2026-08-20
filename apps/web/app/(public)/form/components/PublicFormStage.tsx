import React from "react";
import Link from "next/link";
import { Icon } from "../../../(main)/components/icons";
import { BLOCK_META } from "../../../(main)/builder/constants";
import { estimatedTimeToCompleteForm } from "../../../(main)/utils";
import HelpTip from "../../../(main)/builder/components/HelpTip";
import PreviewInput from "../../../(main)/builder/[formId]/preview/components/PreviewInput";
import { Crane, ScribbleArrow } from "~/components/origami/deco";
import FieldCard from "~/app/(public)/form/components/FieldCard";
import type { PublicFormStageProps } from "../types";
import { isAnswered } from "../utils";

/** the sheet a respondent is looking at, plus the bar above and below it.
    every class here is the one the builder preview paints with, so a published form and
    its preview are the same object seen from two sides. */
const PublicFormStage = ({
    form,
    at,
    total,
    back,
    step,
    questions,
    answers,
    setAnswer,
    go,
    goToQuestion,
    advance,
    error,
    submit,
    submitting,
}: PublicFormStageProps) => {
    const answered = questions.filter((question) => isAnswered(answers[question.id])).length;
    const estimatedTime = estimatedTimeToCompleteForm(questions.length);
    const progress = Math.max(4, (at / Math.max(1, total)) * 100);

    return (
        <section className="pv-stage pf-stage">
            <header className="pv-top pf-top">
                <Link className="pf-brand" href="/">
                    <Crane size={22} />
                    <span>made with origami</span>
                </Link>

                {at > 0 && (
                    <div className="pv-meta">
                        <span className="pv-step-label">
                            {at} / {total}
                        </span>
                        <div className="pv-progress">
                            <span style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </header>

            <div className="pv-pages">
                <FieldCard at={at} total={total} back={back}>
                    {step.kind === "cover" && (
                        <div className="pv-centered">
                            <span className="pv-mascot">
                                <Icon name="crane" size={72} />
                            </span>
                            <h1 className="pv-title">{form.title}</h1>
                            {form.description && <p className="pv-help">{form.description}</p>}
                            <div className="pv-actions pv-actions--center">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={advance}>
                                    Start folding<Icon name="arrow" size={16} />
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
                    )}

                    {step.kind === "heading" && (
                        <div className="pv-centered">
                            <p className="pv-quote">{step.label}</p>
                            {step.description && <p className="pv-help">{step.description}</p>}
                            <div className="pv-actions pv-actions--center">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={advance}>
                                    Turn the leaf <Icon name="arrow" size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step.kind === "page-break" && (
                        <div className="pv-centered">
                            {/* <div className="pv-page-turn">
                                <span className="rule" />
                                <span className="n">page {step.page}</span>
                                <span className="rule" />
                            </div> */}
                            <p className="pv-quote">{step.label || "halfway there"}</p>
                            <div className="pv-actions pv-actions--center">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={advance}>
                                    Turn the leaf <Icon name="arrow" size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step.kind === "field" && (
                        <>
                            <div className="pv-num-row">
                                {String(at).padStart(2, "0")}
                                <span className="arrow">→</span>
                                <span className={`pv-type-pill t-${BLOCK_META[step.field.type]?.tint ?? "accent"}`}>
                                    {BLOCK_META[step.field.type]?.label.toLowerCase() ?? step.field.type}
                                </span>
                                {step.field.required && <span className="pv-req">required</span>}
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

                            {error && (
                                <p className="pf-error" role="alert">
                                    <Icon name="clip" size={14} /> {error}
                                </p>
                            )}

                            <div className="pv-actions">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={advance}>
                                    Fold and continue <Icon name="check" size={16} />
                                </button>
                            </div>
                        </>
                    )}

                    {step.kind === "review" && (
                        <div className="pv-centered">
                            <span className="pv-mascot">
                                <Icon name="crane" size={64} />
                            </span>
                            <h2 className="pv-title">Ready to send?</h2>
                            <p className="pv-help">
                                {answered} of {questions.length} answered
                            </p>

                            <div className="pv-review">
                                {questions.filter(q => q.field.type !== "long_text" && q.field.type !== "file_upload").map((question) => {
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
                                    disabled={submitting}
                                >
                                    <Icon name="sparkles" size={16} />
                                    {submitting ? "Sending…" : "Send it flying"}
                                </button>
                                <span className="ok-hint">your answers go straight to the form's owner</span>
                            </div>
                        </div>
                    )}
                </FieldCard>
            </div>

            <footer className="pv-bot">
                <div className="kbd-row">
                    <span className="o-kbd">↵</span> next
                    <span className="sep">·</span>
                    <span className="o-kbd">←</span>
                    <span className="o-kbd">→</span> nav
                    <span className="sep">·</span>
                    question {at} of {total}
                </div>
                <div className="pv-arrows">
                    <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Previous">
                        <Icon name="arrow-left" size={16} />
                    </button>
                    <button type="button" onClick={advance} disabled={at === total} aria-label="Next">
                        <Icon name="arrow" size={16} />
                    </button>
                </div>
            </footer>
        </section>
    );
};

export default PublicFormStage;
