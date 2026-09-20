"use client";

import React, { useState } from "react";
import "./analytics.css";
import { PaperCrane } from "../components/origami-art";
import AnalyticsDecorations from "./components/AnalyticsDecorations";
import AnalyticsHeader from "./components/AnalyticsHeader";
import SubmissionsTrend from "./components/SubmissionsTrend";
import DeviceBreakdown from "./components/DeviceBreakdown";
import GeoBreakdown from "./components/GeoBreakdown";
import FieldBreakdown from "./components/FieldBreakdown";
import { ALL_FORMS, DEFAULT_RANGE } from "./constants";
import {
    MOCK_FORMS,
    getChoiceFields,
    getCities,
    getCountries,
    getDevices,
    getResponseBuckets,
    getTrend,
} from "./mock-data";
import type { RangeKey, ScopeKey } from "./types";
import Stats from "../dashboard/components/Stats";

const Analytics = () => {
    const [scope, setScope] = useState<ScopeKey>(ALL_FORMS);
    const [range, setRange] = useState<RangeKey>(DEFAULT_RANGE);

    const buckets = getResponseBuckets(scope);
    const trend = getTrend(scope, range);
    const devices = getDevices(scope);
    const countries = getCountries(scope);
    const cities = getCities(scope);
    const choiceFields = getChoiceFields(scope);

    const isGlobal = scope === ALL_FORMS;

    return (
        <div className="ana-page">
            <AnalyticsDecorations />

            <AnalyticsHeader
                forms={MOCK_FORMS}
                scope={scope}
                setScope={setScope}
                range={range}
                setRange={setRange}
            />

            <Stats />

            {/* the card has no window control of its own — the header range drives it */}
            <SubmissionsTrend data={trend} range={range} buckets={buckets} />

            <section className="ana-split">
                <DeviceBreakdown devices={devices} />
                <GeoBreakdown countries={countries} cities={cities} />
            </section>

            {/* a workspace roll-up has no single field list, so this panel is form-scoped */}
            {!isGlobal && choiceFields.length > 0 && <FieldBreakdown fields={choiceFields} />}

            {isGlobal && (
                <aside className="ana-hint">
                    <span className="ana-hint__art" aria-hidden>
                        <PaperCrane size={34} />
                    </span>
                    <p>
                        Pick a single form above to see how each question was answered.
                    </p>
                </aside>
            )}
        </div>
    );
};

export default Analytics;
