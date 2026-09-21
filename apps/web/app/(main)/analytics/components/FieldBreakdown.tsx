"use client";

import React from "react";
import { formatIndianNumber } from "~/app/utils";
import { Icon } from "../../components/icons";
import { BlankSheet } from "../../components/origami-art";
import { FIELD_TYPE_META } from "../constants";
import { useBentoSpans } from "../use-bento-spans";
import type { FieldSummary } from "../types";

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
                    const hasOptions = field.options.length > 0;
                    const seen = field.answeredCount + field.skippedCount;
                    const responseRate = seen > 0 ? Math.round((field.answeredCount / seen) * 100) : 0;
                    const compact = hasOptions && field.options.length <= 3;

                    return (
                        <article
                            key={field.key}
                            className={`ana-field${compact ? " ana-field--compact" : ""}`}
                        >
                            {/* dog-eared corner — the card reads as a folded sheet */}
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

                            <p className="ana-field__meta">
                                <span>
                                    <b>{formatIndianNumber(field.answeredCount)}</b> answered
                                </span>
                                {field.skippedCount > 0 && (
                                    <span className="skipped">
                                        <b>{formatIndianNumber(field.skippedCount)}</b> skipped
                                    </span>
                                )}
                            </p>

                            {hasOptions ? (
                                <ul className="ana-options">
                                    {field.options.map((option, index) => (
                                        <li
                                            key={option.key}
                                            className={`ana-option${index === 0 ? " lead" : ""}`}
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
                                    ))}
                                </ul>
                            ) : (
                                <div className="ana-field__rate">
                                    <span className="ana-field__rate-top">
                                        <span className="ana-field__rate-pct">{responseRate}%</span>
                                        <span className="ana-field__rate-lbl">
                                            {seen > 0 ? "of everyone who reached it" : "nobody has reached it yet"}
                                        </span>
                                    </span>
                                    <span className="ana-bar" aria-hidden>
                                        <span
                                            className="ana-bar__fill"
                                            style={{ width: `${responseRate}%` }}
                                        />
                                    </span>
                                    <p className="ana-field__note">
                                        Free-entry answers are not charted — open the responses
                                        table to read them.
                                    </p>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default FieldBreakdown;
