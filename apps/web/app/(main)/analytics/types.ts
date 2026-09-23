import { GetAnalyticsOutputSchemaType } from "@repo/services/analytics/model";
import type { IconName } from "../components/icons";

export type AnalyticsData = NonNullable<GetAnalyticsOutputSchemaType["analytics"]>;

export type RangeKey = "24h" | "7d" | "30d" | "all";


export type ScopeKey = "lifetime"
export type Scope = {
    key: string;
    label: string;
    caption: string;
}

export type RangeOption = {
    key: RangeKey;
    label: string;
    caption: string;
};

export type Kpi = {
    key: string;
    label: string;
    icon: IconName;
    value: string;
    delta: string | null;
    deltaDirection: "up" | "down" | null;
};

/** The 1d / 1w / 1m / lifetime counters, each tied to the window it counts. */
export type ResponseBucket = {
    key: string;
    label: string;
    caption: string;
    count: number;
    range: RangeKey;
};

export type TrendPoint = {
    date: string;
    submissions: number;
    views: number;
};

export type ShareRow = {
    key: string;
    label: string;
    glyph?: string;
    icon?: IconName;
    count?: number;
    percentage: number;
};

export type FieldOption = {
    key: string;
    label: string;
    count: number;
    percentage: number;
};

export type FieldSummary = {
    key: string;
    order: number;
    label: string;
    type: string;
    answeredCount: number;
    skippedCount: number;
    options: FieldOption[];
};

export type ChoiceFieldSummary = {
    id: string;
    order: number;
    label: string;
    type: string;
    answeredCount: number;
    totalResponses: number;
    options: FieldOption[];
};

export type FormOption = {
    id: string;
    title: string;
    status: "draft" | "published" | "archived" | "expired";
};
