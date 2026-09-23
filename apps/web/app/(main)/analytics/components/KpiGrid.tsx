"use client";

import React from "react";
import { Icon } from "../../components/icons";
import type { Kpi } from "../types";

const KpiGrid = ({ kpis }: { kpis: Kpi[] }) => (
    <section className="ana-kpis" aria-label="Headline numbers">
        {kpis.map((kpi, index) => (
            <article key={kpi.key} className={`ana-kpi${index === 0 ? " tinted" : ""}`}>
                <span className="ana-kpi__ic" aria-hidden>
                    <Icon name={kpi.icon} size={16} />
                </span>
                <h2 className="ana-kpi__lbl">{kpi.label}</h2>
                <p className="ana-kpi__num">{kpi.value}</p>
                {kpi.delta ? (
                    <p className={`ana-kpi__delta${kpi.deltaDirection === "down" ? " down" : ""}`}>
                        <Icon name={kpi.deltaDirection === "down" ? "arrow-down" : "arrow-up"} size={12} />
                        {kpi.delta}
                    </p>
                ) : (
                    <p className="ana-kpi__delta muted">no prior period</p>
                )}
            </article>
        ))}
    </section>
);

export default KpiGrid;
