"use client";

import React from "react";

const Bar = ({ w, h = 10 }: { w: string; h?: number }) => (
    <span className="sk sk-shimmer" style={{ width: w, height: h, display: "block" }} />
);

/** Mirrors the real layout — KPI row, buckets, trend, split, so nothing jumps on load. */
export const AnalyticsPageSkeleton = () => (
    <div className="ana-sk" aria-hidden>
        <section className="ana-kpis">
            {Array.from({ length: 4 }).map((_, index) => (
                <article key={index} className="ana-kpi">
                    <Bar w="45%" h={8} />
                    <div style={{ height: 12 }} />
                    <Bar w="65%" h={28} />
                    <div style={{ height: 10 }} />
                    <Bar w="50%" h={8} />
                </article>
            ))}
        </section>

        {/* the headline count and the plot share one card */}
        <section className="ana-panel">
            <Bar w="180px" h={18} />
            <div style={{ height: 20 }} />
            <Bar w="30%" h={34} />
            <div style={{ height: 18 }} />
            <Bar w="100%" h={260} />
        </section>

        <section className="ana-split">
            {Array.from({ length: 2 }).map((_, index) => (
                <section key={index} className="ana-panel">
                    <Bar w="140px" h={18} />
                    <div style={{ height: 18 }} />
                    <Bar w="100%" h={150} />
                </section>
            ))}
        </section>
    </div>
);
