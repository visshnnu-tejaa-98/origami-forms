"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { useChartPalette } from "../use-chart-palette";
import type { ShareRow } from "../types";
import { BlankSheet } from "../../components/origami-art";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
    rows: ShareRow[];
};

const ShareRings = ({ rows }: Props) => {
    const { series, overflow } = useChartPalette();

    const palette = rows.length > series.length ? [...series, ...overflow] : series;

    if (rows.length === 0) {
        return <div className="ana-panel__empty">
            <span className="art" aria-hidden>
                <BlankSheet size={44} />
            </span>
            <h4>Nothing folded yet</h4>
            <p>No responses over this window, so no country/city split.</p>
        </div>
    }

    return (
        <ul className="ana-rings">
            {rows.map((row, index) => {
                const color = palette[index] ?? "var(--ink-4)";
                const filled = (Math.min(row.percentage, 100) / 100) * CIRCUMFERENCE;

                return (
                    <li key={row.key} className="ana-ring">
                        <span className="ana-ring__dial">
                            <svg viewBox="0 0 48 48" aria-hidden>
                                <circle
                                    cx="24"
                                    cy="24"
                                    r={RADIUS}
                                    fill="none"
                                    stroke="var(--bg-sunken)"
                                    strokeWidth="5"
                                />
                                {row.percentage > 0 && (
                                    <circle
                                        cx="24"
                                        cy="24"
                                        r={RADIUS}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="5"
                                        strokeLinecap="round"
                                        strokeDasharray={`${filled} ${CIRCUMFERENCE}`}
                                        transform="rotate(-90 24 24)"
                                    />
                                )}
                            </svg>
                            <span className="ana-ring__pct">{row.percentage}%</span>
                        </span>

                        <span className="ana-ring__name" title={row.label}>
                            {row.glyph && (
                                <span className="ana-ring__glyph" aria-hidden>
                                    {row.glyph}
                                </span>
                            )}
                            {row.icon && <Icon name={row.icon} size={13} />}
                            <span className="ana-ring__text">{row.label}</span>
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

export default ShareRings;
