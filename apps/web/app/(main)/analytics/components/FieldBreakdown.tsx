"use client";

import React from "react";
import { formatIndianNumber } from "~/app/utils";
import { FIELD_TYPE_META } from "../constants";
import { useBentoSpans } from "../use-bento-spans";
import type { ChoiceFieldSummary } from "../types";

/**
 * Form-scope only: every field whose answers come from a fixed set, with each
 * option's share drawn as a filled range indicator.
 *
 * Laid out as a bento wall — each card takes only the height its own options need,
 * so a two-option field does not inherit the height of a five-option one beside it.
 *
 * Multi-select percentages are shares of respondents, not of picks, so they add up
 * past 100 by design — one person can tick several boxes.
 */
const FieldBreakdown = ({ fields }: { fields: ChoiceFieldSummary[] }) => {
    const gridRef = useBentoSpans(fields.map((field) => field.id).join(","));

    return (
        <section className="ana-panel">
            <span className="o-tape o-tape--pink" aria-hidden />
            <div className="ana-panel__head">
                <h3>Answer breakdown</h3>
                <span className="sub">fields with a fixed set of answers</span>
            </div>

            <div className="ana-fields" ref={gridRef}>
                {fields.map((field) => {
                    const meta = FIELD_TYPE_META[field.type];
                    const skipped = field.totalResponses - field.answeredCount;
                    // a two- or three-option field has room to breathe, so it gets the
                    // roomier treatment rather than being padded out to match its neighbour
                    const compact = field.options.length <= 3;

                    return (
                        <article
                            key={field.id}
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
                                    {meta?.label ?? field.type}
                                </span>
                            </header>

                            <p className="ana-field__meta">
                                <span>
                                    <b>{formatIndianNumber(field.answeredCount)}</b> answered
                                </span>
                                {skipped > 0 && (
                                    <span className="skipped">
                                        <b>{formatIndianNumber(skipped)}</b> skipped
                                    </span>
                                )}
                            </p>

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
                                        {/* The track is the full 100%, so a 50% answer
                                            fills half of it. Scaling to the leading
                                            option instead made every field's top answer
                                            look unanimous. Multi-select shares can pass
                                            100 (one person ticks several), so the fill
                                            is clamped even though the label is not. */}
                                        <span className="ana-option__track">
                                            <span className="ana-bar" aria-hidden>
                                                <span
                                                    className="ana-bar__fill"
                                                    style={{
                                                        width: `${Math.min(option.percentage, 100)}%`,
                                                    }}
                                                />
                                            </span>
                                            {/* <span className="ana-option__count">
                                                {formatIndianNumber(option.count)}
                                            </span> */}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};

export default FieldBreakdown;
