"use client";

import React, { useState } from "react";
import "./analytics.css";
import AnalyticsDecorations from "./components/AnalyticsDecorations";
import AnalyticsHeader from "./components/AnalyticsHeader";
import { defaultScope } from "./constants";
import type { Scope } from "./types";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FormStats from "../components/FormStats";
import { PaperCrane } from "../components/origami-art";
import { AnalyticsPageSkeleton } from "./skeletons";
import { useGetAnalytics } from "~/hooks/use-analytics";
import {
    formatCompletionTime,
    formatIndianNumber,
    hydrateAnswerBreakdown,
    hydrateTrend,
    hydratedCityStats,
    hydratedCountryStats,
    hydrateDeviceStats,
} from "~/app/utils";
import { GetAnalyticsInputSchemaType } from "@repo/services/analytics/model";
import DeviceBreakdown from "./components/DeviceBreakdown";
import GeoBreakdown from "./components/GeoBreakdown";
import FieldBreakdown from "./components/FieldBreakdown";
import SubmissionsTrend from "./components/SubmissionsTrend";

const Analytics = () => {
    const [scope, setScope] = useState<Scope>(defaultScope);
    const searchParams = useSearchParams();
    const formAnalytics = {
        title: searchParams.get("title") ?? "",
        id: searchParams.get("formId") ?? undefined,
    };

    const isGlobal = !formAnalytics.id;
    const formName = isGlobal ? "All forms" : formAnalytics.title || "Untitled form";

    const {
        analytics: analyticsData,
        getAnalyticsIsPending,
        getAnalyticsError,
    } = useGetAnalytics({
        formId: formAnalytics.id,
        scope: scope.key as GetAnalyticsInputSchemaType["scope"],
    });

    if (getAnalyticsIsPending) {
        return (
            <div className="ana-page">
                <AnalyticsDecorations />
                <AnalyticsPageSkeleton />
            </div>
        );
    }

    if (getAnalyticsError) {
        return (
            <div className="ana-page">
                <AnalyticsDecorations />
                <aside className="ana-hint">
                    <span className="ana-hint__art" aria-hidden>
                        <PaperCrane size={34} />
                    </span>
                    <p>Something went wrong while folding your analytics.</p>
                </aside>
            </div>
        );
    }

    if (!analyticsData?.success || !analyticsData.analytics) {
        return (
            <div className="ana-page">
                <AnalyticsDecorations />
                <aside className="ana-hint">
                    <span className="ana-hint__art" aria-hidden>
                        <PaperCrane size={34} />
                    </span>
                    <p>Nothing to report yet — no analytics for this window.</p>
                </aside>
            </div>
        );
    }

    const {
        totalResponses,
        completionRate,
        avgTimeCompletion,
        totalViews,
        deviceStats,
        countryStats,
        cityStats,
        answerBreakdownAnalytics,
        trend,
    } = analyticsData.analytics;

    const devices = hydrateDeviceStats(deviceStats);
    const countries = hydratedCountryStats(countryStats)
    const cities = hydratedCityStats(cityStats)


    const fields = hydrateAnswerBreakdown(answerBreakdownAnalytics);
    const trendPoints = hydrateTrend(trend);

    return (
        <div className="ana-page">
            <AnalyticsDecorations />

            <AnalyticsHeader scope={scope} setScope={setScope} isGlobal={isGlobal} formName={formName} />

            <FormStats
                totalResponses={formatIndianNumber(totalResponses)}
                completionRate={completionRate}
                formatCompletionTime={formatCompletionTime}
                avgTimeCompletion={avgTimeCompletion}
                totalViews={formatIndianNumber(totalViews)}
            />

            <SubmissionsTrend data={trendPoints} scope={scope} totalResponses={totalResponses} />

            <section className="ana-split">
                <DeviceBreakdown devices={devices} />
                <GeoBreakdown countries={countries} cities={cities} />
            </section>

            {/* a workspace roll-up has no single field list, so this panel is form-scoped */}
            {!isGlobal && <FieldBreakdown fields={fields} />}
            {isGlobal && (
                <aside className="ana-hint">
                    <span className="ana-hint__art" aria-hidden>
                        <PaperCrane size={34} />
                    </span>
                    <p>
                        This is every form folded together.{" "}
                        <Link className="ana-hint__link" href="/forms">
                            Pick a single form
                        </Link>{" "}
                        to see how each question was answered.
                    </p>
                </aside>
            )}
        </div>
    );
};

export default Analytics;