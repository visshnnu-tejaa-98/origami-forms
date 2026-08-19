import React, { useCallback, useState } from "react";
import { BLOCK_META } from "../../../constants";
import { Icon } from "~/app/(main)/components/icons";
import HelpTip from "../../../components/HelpTip";
import { ScribbleArrow } from "~/components/origami/deco";
import FieldCard from "~/app/(public)/form/components/FieldCard";
import PreviewInput from "./PreviewInput";
import { AnswerValue, PreviewStateProps } from "../../../types";
import { estimatedTimeToCompleteForm } from "~/app/(main)/utils";

const PreviewSlides = ({
    at,
    total,
    back,
    step,
    form,
    questions,
    go,
    status,
}: PreviewStateProps) => {

    const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

    const getStepLabel = () => {
        if (step.kind === "cover") return "Welcome";
        if (step.kind === "page-break") return `Page ${step.page}`;
        if (step.kind === "heading") return "Section";
        if (step.kind === "field") {
            const meta = BLOCK_META[step.field.type];
            return meta?.label ?? step.field.type;
        }
        return "Review";
    };

    const isAnswered = useCallback(
        (id: string) => {
            const value = answers[id];
            return Array.isArray(value) ? value.length > 0 : (value ?? "") !== "";
        },
        [answers],
    );

    const stepLabel = getStepLabel();
    const estimatedTime = estimatedTimeToCompleteForm(form.fields.length);

    const isField = step && step.kind === "field";
    const field = isField ? step.field : null;

    const fieldType = field ? BLOCK_META[field.type]?.label.toLowerCase() : "";
    const isRequired = field ? field.required : undefined;
    const fieldLabel = field ? field?.label : "Untitled question";

    const answered = questions.filter((s) => s.kind === "field" && isAnswered(s.id)).length;


    return (
        <section className="pv-stage">
            <header className="pv-top">
                <span className="pv-eyebrow">
                    wet-fold preview · <span>{status === "published" ? "published" : "unpublished"}</span>
                </span>
                <div className="pv-meta">
                    <span className="pv-step-label">{stepLabel}</span>
                    <div className="pv-progress">
                        <span style={{ width: `${Math.max(4, (at / Math.max(1, total)) * 100)}%` }} />
                    </div>
                </div>
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
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                                    Make the first fold <Icon name="arrow" size={16} />
                                </button>
                            </div>
                            <p className="pv-margin-note">↓ a few folds, {estimatedTime}</p>
                            <div className="pv-facts">
                                <span>
                                    <Icon name="layers" size={14} /> {questions.length} folds
                                </span>
                                <span>
                                    <Icon name="lock" size={14} /> {form.visibility}
                                </span>
                            </div>
                        </div>
                    )}

                    {step.kind === "heading" && (
                        <div className="pv-centered">
                            <p className="pv-quote">{step.label}</p>
                            <span className="ok-hint">nothing to fold here — read and carry on</span>
                            <div className="pv-actions pv-actions--center">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                                    Continue <Icon name="arrow" size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step.kind === "page-break" && (
                        <div className="pv-centered">
                            <div className="pv-page-turn">
                                <span className="rule" />
                                <span className="n">page {step.page}</span>
                                <span className="rule" />
                            </div>
                            <p className="pv-quote">{step.label || "halfway there"}</p>
                            <span className="ok-hint">nothing to fold here — read and carry on</span>
                            <div className="pv-actions pv-actions--center">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
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
                                    {fieldType}
                                </span>
                                {isRequired && <span className="pv-req">required</span>}
                            </div>

                            <h2 className="pv-title">
                                {fieldLabel}
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
                                    onChange={(value) => setAnswers((a: any) => ({ ...a, [step.id]: value }))}
                                />
                            </div>

                            <div className="pv-actions">
                                <button className="o-btn o-btn--accent o-btn--lg" onClick={() => go(at + 1)}>
                                    Crease it <Icon name="check" size={16} />
                                </button>
                            </div>
                        </>
                    )}

                    {step.kind === "review" && (
                        <div className="pv-centered">
                            <span className="pv-mascot">
                                <Icon name="crane" size={64} />
                            </span>
                            <h2 className="pv-title">Ready to send the crane?</h2>
                            <p className="pv-help">
                                {answered} of {questions.length} folds creased
                            </p>

                            <div className="pv-review">
                                {questions.map((s) => {
                                    if (s.kind !== "field") return null;
                                    const value = answers[s.id];
                                    const shown = Array.isArray(value) ? value.join(", ") : value;
                                    return (
                                        <div className="row" key={s.id}>
                                            <span className="q">{s.field.label || "Untitled"}</span>
                                            <span className="a">{shown || "—"}</span>
                                        </div>
                                    );
                                })}
                                {questions.length === 0 && <p className="pv-rail-empty">Nothing creased yet.</p>}
                            </div>

                            <div className="pv-actions pv-actions--center">
                                <button className="o-btn o-btn--accent o-btn--lg" disabled>
                                    <Icon name="sparkles" size={16} /> Send it flying
                                </button>
                                <span className="ok-hint">this crane stays on the desk — preview only</span>
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
                    <span className="o-kbd">esc</span> back to builder
                    <span className="sep">·</span>
                    fold {at} of {total}
                </div>
                <div className="pv-arrows">
                    <button
                        type="button"
                        onClick={() => go(at - 1)}
                        disabled={at === 0}
                        aria-label="Previous"
                    >
                        <Icon name="arrow-left" size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => go(at + 1)}
                        disabled={at === total}
                        aria-label="Next"
                    >
                        <Icon name="arrow" size={16} />
                    </button>
                </div>
            </footer>
        </section>
    );
};

export default PreviewSlides;
