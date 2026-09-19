"use client";

import React from "react";
import { Icon } from "../../components/icons";
import { formatIndianNumber } from "~/app/utils";
import { useChartPalette } from "../use-chart-palette";
import type { ShareRow } from "../types";

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Props = {
    rows: ShareRow[];
    emptyLabel: string;
};

/**
 * A row of dials — one per share, each labelled underneath with its own value.
 *
 * Hues run in palette order down the row, so the ring colour tracks position in the
 * list rather than the entity itself: re-rank the list and the colours stay put
 * while the names move. That is fine here only because every ring carries its own
 * name and percentage, so nothing is identified by colour alone — the hue is
 * variety, not the encoding. Order also keeps neighbouring rings on the palette
 * pairs that were checked for separation.
 */
const ShareRings = ({ rows, emptyLabel }: Props) => {
    const { series } = useChartPalette();

    if (rows.length === 0) {
        return <p className="ana-empty">{emptyLabel}</p>;
    }

    return (
        <ul className="ana-rings">
            {rows.map((row, index) => {
                // never cycled — past the palette a ring falls back to plain ink
                // rather than repeating a hue that already means something else
                const color = series[index] ?? "var(--ink-4)";
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
                                {/* drawn from twelve o'clock, with a rounded end like a pen stroke.
                                    A zero-length dash with a round cap paints a stray dot in
                                    some engines, so 0% draws no arc at all. */}
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
                        <span className="ana-ring__count">{formatIndianNumber(row.count)}</span>
                    </li>
                );
            })}
        </ul>
    );
};

export default ShareRings;
