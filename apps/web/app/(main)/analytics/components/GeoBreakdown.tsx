"use client";

import React, { useState } from "react";
import ShareRings from "./ShareRings";
import type { ShareRow } from "../types";

type Tab = "country" | "city";

/** Where responses came from, as a row of dials — see ShareRings on hue order. */
const GeoBreakdown = ({ countries, cities }: { countries: ShareRow[]; cities: ShareRow[] }) => {
    const [tab, setTab] = useState<Tab>("country");
    const rows = tab === "country" ? countries : cities;

    return (
        <section className="ana-panel">
            <div className="ana-panel__head">
                <h3>Where from</h3>
                <span className="sub">top {tab === "country" ? "countries" : "cities"}</span>
                <div className="ana-seg ana-seg--sm">
                    <button
                        type="button"
                        className={tab === "country" ? "active" : ""}
                        aria-pressed={tab === "country"}
                        onClick={() => setTab("country")}
                    >
                        Country
                    </button>
                    <button
                        type="button"
                        className={tab === "city" ? "active" : ""}
                        aria-pressed={tab === "city"}
                        onClick={() => setTab("city")}
                    >
                        City
                    </button>
                </div>
            </div>

            <ShareRings rows={rows} emptyLabel={`No ${tab} data for this period yet.`} />
        </section>
    );
};

export default GeoBreakdown;
