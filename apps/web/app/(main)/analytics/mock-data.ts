/**
 * Placeholder figures for the analytics UI.
 *
 * Nothing here comes from the database yet — `form_views` has no ingest and there
 * are no per-field events, so every panel on this page is rendered against these
 * shapes. They are deliberately written as the shapes the eventual procedures
 * should return, so wiring the real API is a swap rather than a rewrite.
 */
import {
    CHECK_BOX,
    MULTI_SELECT,
    RADIO,
    RATING,
    SINGLE_SELECT,
} from "@repo/database/constants";
import { ALL_FORMS } from "./constants";
import type {
    ChoiceFieldSummary,
    FormOption,
    Kpi,
    RangeKey,
    ResponseBucket,
    ScopeKey,
    ShareRow,
    TrendPoint,
} from "./types";

export const MOCK_FORMS: FormOption[] = [
    { id: ALL_FORMS, title: "All forms", status: "published" },
    { id: "f-sakura", title: "Cherry Blossom Festival RSVP", status: "published" },
    { id: "f-feedback", title: "Product feedback · Q3", status: "published" },
    { id: "f-onboard", title: "New member onboarding", status: "published" },
    { id: "f-venue", title: "Venue preference survey", status: "draft" },
];

/** Counts scale down with the window so the KPI row stays believable as you switch. */
const RANGE_WEIGHT: Record<RangeKey, number> = {
    "24h": 0.04,
    "7d": 0.22,
    "30d": 0.58,
    all: 1,
};

const scaled = (base: number, range: RangeKey) => Math.round(base * RANGE_WEIGHT[range]);

const formatCount = (value: number) => value.toLocaleString("en-IN");

export function getKpis(scope: ScopeKey, range: RangeKey): Kpi[] {
    const global = scope === ALL_FORMS;
    const views = scaled(global ? 48210 : 9670, range);
    const submissions = scaled(global ? 21840 : 4180, range);

    return [
        {
            key: "views",
            label: "total views",
            icon: "eye",
            value: formatCount(views),
            delta: range === "all" ? null : "18% vs prior period",
            deltaDirection: "up",
        },
        {
            key: "submissions",
            label: "submissions",
            icon: "check",
            value: formatCount(submissions),
            delta: range === "all" ? null : "12% vs prior period",
            deltaDirection: "up",
        },
        {
            key: "completion",
            label: "completion rate",
            icon: "analytics",
            value: global ? "45%" : "43%",
            delta: range === "all" ? null : "3% vs prior period",
            deltaDirection: "down",
        },
        {
            key: "avg-time",
            label: "avg time to complete",
            icon: "clock",
            value: global ? "1m 47s" : "2m 04s",
            delta: range === "all" ? null : "6s faster",
            deltaDirection: "up",
        },
    ];
}

export function getResponseBuckets(scope: ScopeKey): ResponseBucket[] {
    const global = scope === ALL_FORMS;
    return [
        { key: "day", label: "Today", caption: "last 24 hours", count: global ? 312 : 74, range: "24h" },
        { key: "week", label: "7 days", caption: "last 7 days", count: global ? 2184 : 486, range: "7d" },
        { key: "month", label: "30 days", caption: "last 30 days", count: global ? 8940 : 1962, range: "30d" },
        { key: "lifetime", label: "Lifetime", caption: "since the first response", count: global ? 21840 : 4180, range: "all" },
    ];
}

/** Buckets are hourly inside 24h and daily beyond it, as the real query would be. */
export function getTrend(scope: ScopeKey, range: RangeKey): TrendPoint[] {
    const global = scope === ALL_FORMS;
    const points = range === "24h" ? 24 : range === "7d" ? 7 : range === "30d" ? 30 : 52;
    const base = global ? 520 : 110;
    const now = new Date("2026-09-19T00:00:00Z");

    return Array.from({ length: points }, (_, index) => {
        const date = new Date(now);
        if (range === "24h") date.setUTCHours(date.getUTCHours() - (points - 1 - index));
        else if (range === "all") date.setUTCDate(date.getUTCDate() - (points - 1 - index) * 7);
        else date.setUTCDate(date.getUTCDate() - (points - 1 - index));

        // a gentle upward drift with a weekly wobble — enough shape to read the axis by
        const drift = 1 + index / points;
        const wobble = 1 + Math.sin(index / 2.2) * 0.28;
        const submissions = Math.round((base * drift * wobble) / (range === "24h" ? 18 : 1));
        return {
            date: date.toISOString(),
            submissions,
            views: Math.round(submissions * 2.3),
        };
    });
}

export function getDevices(scope: ScopeKey): ShareRow[] {
    const total = scope === ALL_FORMS ? 21840 : 4180;
    const split = [
        { key: "mobile", label: "Mobile", icon: "phone" as const, percentage: 62 },
        { key: "desktop", label: "Desktop", icon: "grid" as const, percentage: 31 },
        { key: "tablet", label: "Tablet", icon: "layers" as const, percentage: 7 },
    ];
    return split.map((row) => ({
        ...row,
        count: Math.round((total * row.percentage) / 100),
    }));
}

export function getCountries(scope: ScopeKey): ShareRow[] {
    const total = scope === ALL_FORMS ? 21840 : 4180;
    const split = [
        { key: "in", label: "India", glyph: "🇮🇳", percentage: 44 },
        { key: "us", label: "United States", glyph: "🇺🇸", percentage: 21 },
        { key: "jp", label: "Japan", glyph: "🇯🇵", percentage: 14 },
        { key: "gb", label: "United Kingdom", glyph: "🇬🇧", percentage: 12 },
        { key: "de", label: "Germany", glyph: "🇩🇪", percentage: 9 },
    ];
    return split.map((row) => ({ ...row, count: Math.round((total * row.percentage) / 100) }));
}

export function getCities(scope: ScopeKey): ShareRow[] {
    const total = scope === ALL_FORMS ? 21840 : 4180;
    const split = [
        { key: "hyd", label: "Hyderabad", glyph: "🇮🇳", percentage: 19 },
        { key: "blr", label: "Bengaluru", glyph: "🇮🇳", percentage: 16 },
        { key: "nyc", label: "New York", glyph: "🇺🇸", percentage: 11 },
        { key: "tky", label: "Tokyo", glyph: "🇯🇵", percentage: 9 },
        { key: "ldn", label: "London", glyph: "🇬🇧", percentage: 7 },
    ];
    return split.map((row) => ({ ...row, count: Math.round((total * row.percentage) / 100) }));
}

/** Form-scope only — a workspace roll-up has no single field list to break down. */
export function getChoiceFields(scope: ScopeKey): ChoiceFieldSummary[] {
    if (scope === ALL_FORMS) return [];

    return [
        {
            id: "fld-date",
            order: 3,
            label: "Pick a Saturday — we have three to offer.",
            type: SINGLE_SELECT,
            answeredCount: 4012,
            totalResponses: 4180,
            options: [
                { key: "o1", label: "April 6 · morning", count: 1725, percentage: 43 },
                { key: "o2", label: "April 13 · afternoon", count: 1364, percentage: 34 },
                { key: "o3", label: "April 20 · all day", count: 923, percentage: 23 },
            ],
        },
        {
            id: "fld-bring",
            order: 5,
            label: "Anything you'd like to bring along?",
            type: MULTI_SELECT,
            answeredCount: 3218,
            totalResponses: 4180,
            options: [
                { key: "o1", label: "Snacks", count: 2189, percentage: 68 },
                { key: "o2", label: "Picnic mat", count: 1544, percentage: 48 },
                { key: "o3", label: "Music", count: 965, percentage: 30 },
                { key: "o4", label: "Games", count: 707, percentage: 22 },
            ],
        },
        {
            id: "fld-newsletter",
            order: 6,
            label: "Keep me posted about future events",
            type: CHECK_BOX,
            answeredCount: 4180,
            totalResponses: 4180,
            options: [
                { key: "o1", label: "Checked", count: 2926, percentage: 70 },
                { key: "o2", label: "Unchecked", count: 1254, percentage: 30 },
            ],
        },
        {
            id: "fld-travel",
            order: 7,
            label: "How are you getting there?",
            type: RADIO,
            answeredCount: 3944,
            totalResponses: 4180,
            options: [
                { key: "o1", label: "Public transport", count: 1972, percentage: 50 },
                { key: "o2", label: "Driving", count: 1183, percentage: 30 },
                { key: "o3", label: "Walking / cycling", count: 552, percentage: 14 },
                { key: "o4", label: "Still figuring it out", count: 237, percentage: 6 },
            ],
        },
        {
            id: "fld-hype",
            order: 9,
            label: "How excited are you?",
            type: RATING,
            answeredCount: 3820,
            totalResponses: 4180,
            options: [
                { key: "r5", label: "5 · can't wait", count: 1910, percentage: 50 },
                { key: "r4", label: "4", count: 1108, percentage: 29 },
                { key: "r3", label: "3", count: 535, percentage: 14 },
                { key: "r2", label: "2", count: 191, percentage: 5 },
                { key: "r1", label: "1", count: 76, percentage: 2 },
            ],
        },
    ];
}
