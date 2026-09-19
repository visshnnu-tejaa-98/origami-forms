import type { IconName } from "../components/icons";

/** Time window every panel on the page is filtered by. */
export type RangeKey = "24h" | "7d" | "30d" | "all";

/** `"all"` is the workspace roll-up; anything else is a single form's id. */
export type ScopeKey = string;

export type RangeOption = {
    key: RangeKey;
    label: string;
    /** Spelled out under the trend chart, where "30d" alone is too terse. */
    caption: string;
};

export type Kpi = {
    key: string;
    label: string;
    icon: IconName;
    value: string;
    /** Movement against the previous window of equal length; null when there is nothing to compare to. */
    delta: string | null;
    deltaDirection: "up" | "down" | null;
};

/** The 1d / 1w / 1m / lifetime counters, each tied to the window it counts. */
export type ResponseBucket = {
    key: string;
    /** Short wording for the card's selector. */
    label: string;
    /** Spelled out beneath the count. */
    caption: string;
    count: number;
    /** The window this bucket counts — selecting it plots the same span. */
    range: RangeKey;
};

export type TrendPoint = {
    /** ISO date — formatted at the render site so the axis and tooltip can differ. */
    date: string;
    submissions: number;
    views: number;
};

export type ShareRow = {
    key: string;
    label: string;
    /** Flag emoji for countries, an icon name for devices — whichever the panel renders. */
    glyph?: string;
    icon?: IconName;
    count: number;
    percentage: number;
};

/** One option of a fixed-answer field, with its share of that field's answers. */
export type FieldOption = {
    key: string;
    label: string;
    count: number;
    percentage: number;
};

/** A field whose answers come from a fixed set — the only kind this panel can chart. */
export type ChoiceFieldSummary = {
    id: string;
    order: number;
    label: string;
    type: string;
    /** Answered / seen, shown beside the label as context for the option split. */
    answeredCount: number;
    totalResponses: number;
    options: FieldOption[];
};

export type FormOption = {
    id: ScopeKey;
    title: string;
    status: "draft" | "published" | "archived" | "expired";
};
