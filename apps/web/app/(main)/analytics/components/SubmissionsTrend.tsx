"use client";

import React from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { formatIndianNumber } from "~/app/utils";
import { useChartPalette } from "../use-chart-palette";
import type { RangeKey, ResponseBucket, TrendPoint } from "../types";

type Props = {
    data: TrendPoint[];
    /** The window being plotted — chosen by the page header's range control. */
    range: RangeKey;
    /** The 1d / 1w / 1m / lifetime windows; the one matching `range` supplies the headline count. */
    buckets: ResponseBucket[];
};

/** Hours inside a 24h window, days inside 7d/30d, week-starts across all time. */
const tickFormatter = (iso: string, range: RangeKey) => {
    const date = new Date(iso);
    if (range === "24h") {
        return `${date.getUTCHours().toString().padStart(2, "0")}:00`;
    }
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const SERIES = [
    { key: "submissions", label: "Submissions" },
    { key: "views", label: "Views" },
] as const;

const TrendTooltip = ({
    active,
    payload,
    label,
    range,
    colors,
}: {
    active?: boolean;
    payload?: { dataKey?: string | number; value?: number | string }[];
    label?: string;
    range: RangeKey;
    colors: readonly string[];
}) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="ana-tip">
            <p className="ana-tip__date">{label ? tickFormatter(label, range) : ""}</p>
            {SERIES.map((series, index) => {
                const point = payload.find((item) => item.dataKey === series.key);
                if (!point) return null;
                return (
                    <p key={series.key} className="ana-tip__row">
                        <i style={{ background: colors[index] }} aria-hidden />
                        <span className="ana-tip__name">{series.label}</span>
                        <span className="ana-tip__val">{formatIndianNumber(Number(point.value ?? 0))}</span>
                    </p>
                );
            })}
        </div>
    );
};

const SubmissionsTrend = ({ data, range, buckets }: Props) => {
    const { series: colors } = useChartPalette();
    const selected = buckets.find((bucket) => bucket.range === range) ?? buckets[0];

    const totalSubmissions = data.reduce((sum, point) => sum + point.submissions, 0);
    const peak = data.reduce(
        (best, point) => (point.submissions > best.submissions ? point : best),
        data[0] ?? { date: "", submissions: 0, views: 0 },
    );
    const dailyAverage = data.length ? Math.round(totalSubmissions / data.length) : 0;

    return (
        <section className="ana-panel ana-trend">
            <span className="o-tape o-tape--left" aria-hidden />
            <div className="ana-panel__head">
                <h3>Responses</h3>
                <span className="sub">how many came in, and when</span>
            </div>

            <div className="ana-trend__meta">
                {/* one hero figure, not three competing ones — the selected window's
                    count is the headline, peak and average support it */}
                <div className="ana-trend__hero">
                    <p className="ana-trend__eyebrow">{selected?.caption ?? "in view"}</p>
                    <p className="ana-trend__headline">
                        {formatIndianNumber(selected?.count ?? totalSubmissions)}
                    </p>
                    <p className="ana-trend__heroLbl">responses</p>
                </div>

                <dl className="ana-trend__stats">
                    <div className="ana-stat">
                        <dt>Peak</dt>
                        <dd>
                            {formatIndianNumber(peak.submissions)}
                            <span>{peak.date ? tickFormatter(peak.date, range) : "—"}</span>
                        </dd>
                    </div>
                    <div className="ana-stat">
                        <dt>{range === "24h" ? "Hourly avg" : "Daily avg"}</dt>
                        <dd>
                            {formatIndianNumber(dailyAverage)}
                            <span>per {range === "24h" ? "hour" : "day"}</span>
                        </dd>
                    </div>
                </dl>

                {/* identity never rests on color alone — the swatch is paired with its name */}
                <ul className="ana-legend">
                    {SERIES.map((item, index) => (
                        <li key={item.key}>
                            <i style={{ background: colors[index] }} aria-hidden />
                            {item.label}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ana-trend__chart">
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="anaFillSubmissions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors[0]} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={colors[0]} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="anaFillViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colors[1]} stopOpacity={0.16} />
                                <stop offset="100%" stopColor={colors[1]} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            stroke="var(--rule-line)"
                            strokeDasharray="3 6"
                        />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value: string) => tickFormatter(value, range)}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={28}
                            tick={{ fill: "var(--ink-3)", fontSize: 12 }}
                        />
                        <YAxis
                            width={46}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "var(--ink-3)", fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ stroke: "var(--rule-strong)", strokeWidth: 1 }}
                            content={<TrendTooltip range={range} colors={colors} />}
                        />

                        {/* views sit underneath — the larger number, drawn first so it never hides submissions */}
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke={colors[1]}
                            strokeWidth={2}
                            fill="url(#anaFillViews)"
                            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-card)" }}
                        />
                        <Area
                            type="monotone"
                            dataKey="submissions"
                            stroke={colors[0]}
                            strokeWidth={2}
                            fill="url(#anaFillSubmissions)"
                            activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-card)" }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
};

export default SubmissionsTrend;
