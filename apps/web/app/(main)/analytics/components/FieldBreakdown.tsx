"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { BlankSheet } from "../../components/origami-art";
import { FIELD_TYPE_META } from "../constants";
import { useBentoSpans } from "../use-bento-spans";
import type { FieldSummary } from "../types";

const AnswerRate = ({
    answered,
    skipped,
    hero,
}: {
    answered: number;
    skipped: number;
    hero: boolean;
}) => {
    const seen = answered + skipped;

    if (seen === 0) {
        return <p className="ana-rate__none">Nobody has reached this question yet.</p>;
    }

    const answeredPct = Math.round((answered / seen) * 100);
    const skippedPct = 100 - answeredPct;

    return (
        <div className={`ana-rate${hero ? " ana-rate--hero" : ""}`}>
            <span className="ana-rate__crease" aria-hidden>
                <span className="fold" style={{ width: `${answeredPct}%` }} />
            </span>
            <p className="ana-rate__line">
                <b>{answeredPct}%</b> answered
                <span className="ana-rate__skip">{skippedPct}% skipped</span>
            </p>
        </div>
    );
};

const FieldBreakdown = ({ fields }: { fields: FieldSummary[] }) => {
    const gridRef = useBentoSpans(fields.map((field) => field.key).join(","));

    if (fields.length === 0) {
        return (
            <section className="ana-panel">
                <div className="ana-panel__head">
                    <h3>Answer breakdown</h3>
                </div>
                <div className="ana-panel__empty">
                    <span className="art" aria-hidden>
                        <BlankSheet size={44} />
                    </span>
                    <h4>No questions yet</h4>
                    <p>Add a field to this form and its answers will be broken down here.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="ana-panel">
            <span className="o-tape o-tape--pink" aria-hidden />
            <div className="ana-panel__head">
                <h3>Answer breakdown</h3>
                <span className="sub">question by question</span>
            </div>

            <div className="ana-fields" ref={gridRef}>
                {fields.map((field) => {
                    const meta = FIELD_TYPE_META[field.type];
                    const visibleOptions = field.options.filter((option) => option.percentage > 0);
                    const hasOptions = visibleOptions.length > 0;
                    const compact = hasOptions && visibleOptions.length <= 3;

                    return (
                        <article
                            key={field.key}
                            className={`ana-field${compact ? " ana-field--compact" : ""}`}
                        >
                            <span className="ana-fold" aria-hidden />

                            <header className="ana-field__head">
                                <span className="ana-field__num">
                                    {String(field.order).padStart(2, "0")}
                                </span>
                                <h4 className="ana-field__label">{field.label}</h4>
                                <span className={`o-badge ${meta?.tint ?? "o-badge--ghost"}`}>
                                    {meta?.icon && <Icon name={meta.icon} size={11} />}
                                    {meta?.label ?? field.type}
                                </span>
                            </header>

                            <AnswerRate
                                answered={field.answeredCount}
                                skipped={field.skippedCount}
                                hero={!hasOptions}
                            />

                            {hasOptions && (
                                <ul className="ana-options">
                                    {visibleOptions.map((option) => {
                                        const maxPercentage = Math.max(...visibleOptions.map((o) => o.percentage))
                                        return <li
                                            key={option.key}
                                            className={`ana-option${option.percentage === maxPercentage ? " lead" : ""}`}
                                        >
                                            <span className="ana-option__top">
                                                <span className="ana-option__label" title={option.label}>
                                                    {option.label}
                                                </span>
                                                <span className="ana-option__pct">
                                                    {option.percentage}%
                                                </span>
                                            </span>

                                            <span className="ana-option__track">
                                                <span className="ana-bar" aria-hidden>
                                                    <span
                                                        className="ana-bar__fill"
                                                        style={{
                                                            width: `${Math.min(option.percentage, 100)}%`,
                                                        }}
                                                    />
                                                </span>
                                            </span>
                                        </li>
                                    })}
                                </ul>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default FieldBreakdown;
