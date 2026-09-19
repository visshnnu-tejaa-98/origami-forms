import {
    CHECK_BOX,
    MULTI_SELECT,
    RADIO,
    RATING,
    SINGLE_SELECT,
} from "@repo/database/constants";
import type { RangeOption, ScopeKey } from "./types";

export const ALL_FORMS: ScopeKey = "all";

export const RANGES: RangeOption[] = [
    { key: "24h", label: "24h", caption: "last 24 hours" },
    { key: "7d", label: "7d", caption: "last 7 days" },
    { key: "30d", label: "30d", caption: "last 30 days" },
    { key: "all", label: "All", caption: "all time" },
];

export const DEFAULT_RANGE = "30d";

/**
 * Only fields with a fixed answer set can be charted as an option split — a
 * short-text field has as many distinct answers as it has respondents.
 */
export const CHOICE_FIELD_TYPES = [
    SINGLE_SELECT,
    MULTI_SELECT,
    CHECK_BOX,
    RADIO,
    RATING,
] as const;

/** Field-type pill wording and tint, keyed by the enum stored on the field. */
export const FIELD_TYPE_META: Record<string, { label: string; tint: string }> = {
    [SINGLE_SELECT]: { label: "single select", tint: "o-badge--matcha" },
    [MULTI_SELECT]: { label: "multi select", tint: "o-badge--lavender" },
    [CHECK_BOX]: { label: "checkbox", tint: "o-badge--indigo" },
    [RADIO]: { label: "radio", tint: "o-badge--peach" },
    [RATING]: { label: "rating", tint: "o-badge--sakura" },
};

/**
 * Categorical series colors, validated for the CVD / chroma / contrast checks
 * against both theme surfaces (see analytics.css, where the same values live as
 * custom properties for the non-SVG marks).
 *
 * The separation guarantee is for *neighbouring* slots, so these must be consumed
 * in order — slot 0, then 1, then 2. Handing them out in some other order (by a
 * hash of the row key, say) puts arbitrary pairs side by side, and several of
 * those pairs are too close to tell apart. Past slot 5 a mark takes plain ink
 * rather than cycling back to a hue that already means something else.
 */
export const CHART_SERIES = {
    light: ["#c66145", "#3a72a8", "#6f9a53", "#8a63c4", "#b08b21"],
    dark: ["#d9745c", "#3f8fd0", "#6aa140", "#9a72cc", "#ab862a"],
} as const;
