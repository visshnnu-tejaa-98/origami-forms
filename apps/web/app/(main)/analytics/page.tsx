"use client";

import React, { useState } from "react";
import "./analytics.css";
import AnalyticsDecorations from "./components/AnalyticsDecorations";
import AnalyticsHeader from "./components/AnalyticsHeader";
import { defaultScope } from "./constants";
import type { Scope } from "./types";
import { useSearchParams } from "next/navigation";
import FormStats from "../components/FormStats";
import { PaperCrane } from "../components/origami-art";
import { AnalyticsPageSkeleton } from "./skeletons";
import { useGetAnalytics } from "~/hooks/use-analytics";
import { formatCompletionTime, formatIndianNumber, hydrateAnswerBreakdown, hydratedCityStats, hydratedCountryStats, hydrateDeviceStats } from "~/app/utils";
import { GetAnalyticsInputSchemaType } from "@repo/services/analytics/model";
import DeviceBreakdown from "./components/DeviceBreakdown";
import GeoBreakdown from "./components/GeoBreakdown";
import FieldBreakdown from "./components/FieldBreakdown";

const Analytics = () => {
    const [scope, setScope] = useState<Scope>(defaultScope);
    const searchParams = useSearchParams();
    const formAnalytics = {
        title: searchParams.get("title") ?? "",
        id: searchParams.get("formId") ?? undefined,
    };

    const formName = formAnalytics.title ? formAnalytics.title : "All forms";
    const isGlobal = !formAnalytics.title;

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

    const { totalResponses, completionRate, avgTimeCompletion, totalViews, deviceStats, countryStats, cityStats, answerBreakdownAnalytics } = analyticsData.analytics;

    const devices = hydrateDeviceStats(deviceStats);
    const countries = hydratedCountryStats(countryStats)
    const cities = hydratedCityStats(cityStats)


    const fields = hydrateAnswerBreakdown(answerBreakdownAnalytics);

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
                        Pick a single form above to see how each question was answered.
                    </p>
                </aside>
            )}
        </div>
    );
};

export default Analytics;

// "use client";

// import React, { useState } from "react";
// import "./analytics.css";
// import { PaperCrane } from "../components/origami-art";
// import AnalyticsDecorations from "./components/AnalyticsDecorations";
// import AnalyticsHeader from "./components/AnalyticsHeader";
// import SubmissionsTrend from "./components/SubmissionsTrend";
// import DeviceBreakdown from "./components/DeviceBreakdown";
// import GeoBreakdown from "./components/GeoBreakdown";
// import FieldBreakdown from "./components/FieldBreakdown";
// import { ALL_FORMS, DEFAULT_RANGE } from "./constants";
// import {
//     MOCK_FORMS,
//     getChoiceFields,
//     getCities,
//     getCountries,
//     getDevices,
//     getResponseBuckets,
//     getTrend,
// } from "./mock-data";
// import type { RangeKey, ScopeKey } from "./types";
// import Stats from "../dashboard/components/Stats";

// const Analytics = () => {

//     const [scope, setScope] = useState<ScopeKey>(ALL_FORMS);
//     const [range, setRange] = useState<RangeKey>(DEFAULT_RANGE);

//     const buckets = getResponseBuckets(scope);
//     const trend = getTrend(scope, range);
//     const devices = getDevices(scope);
//     const countries = getCountries(scope);
//     const cities = getCities(scope);
//     const choiceFields = getChoiceFields(scope);

//     const isGlobal = scope === ALL_FORMS;

//     return (
//         <div className="ana-page">
//             <AnalyticsDecorations />

//             <AnalyticsHeader
//                 forms={MOCK_FORMS}
//                 scope={scope}
//                 setScope={setScope}
//                 range={range}
//                 setRange={setRange}
//             />

//             <Stats />

//             {/* the card has no window control of its own — the header range drives it */}
//             <SubmissionsTrend data={trend} range={range} buckets={buckets} />

//             <section className="ana-split">
//                 <DeviceBreakdown devices={devices} />
//                 <GeoBreakdown countries={countries} cities={cities} />
//             </section>

//             {/* a workspace roll-up has no single field list, so this panel is form-scoped */}
//             {!isGlobal && choiceFields.length > 0 && <FieldBreakdown fields={choiceFields} />}

//             {isGlobal && (
//                 <aside className="ana-hint">
//                     <span className="ana-hint__art" aria-hidden>
//                         <PaperCrane size={34} />
//                     </span>
//                     <p>
//                         Pick a single form above to see how each question was answered.
//                     </p>
//                 </aside>
//             )}
//         </div>
//     );
// };

// export default Analytics;