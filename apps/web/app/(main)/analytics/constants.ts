import {
    CHECK_BOX,
    DATE,
    EMAIL,
    FILE_UPLOAD,
    LONG_TEXT,
    MULTI_SELECT,
    NUMBER,
    PHONE,
    RADIO,
    RATING,
    SHORT_TEXT,
    SINGLE_SELECT,
    URL,
} from "@repo/database/constants";
import type { Scope } from "./types";
import type { IconName } from "../components/icons";

export const defaultScope = { key: "30", label: "30d", caption: "last 30 days" };

export const SCOPES: Scope[] = [
    { key: "1", label: "24h", caption: "last 24 hours" },
    { key: "7", label: "7d", caption: "last 7 days" },
    { key: "30", label: "30d", caption: "last 30 days" },
    { key: "lifetime", label: "All", caption: "all time" },
];

export const DEFAULT_RANGE = "30d";

export const FIELD_TYPE_META: Record<string, { label: string; tint: string; icon: IconName }> = {
    [SINGLE_SELECT]: { label: "single select", tint: "o-badge--matcha", icon: "list" },
    [MULTI_SELECT]: { label: "multi select", tint: "o-badge--lavender", icon: "layers" },
    [CHECK_BOX]: { label: "checkbox", tint: "o-badge--indigo", icon: "check" },
    [RADIO]: { label: "radio", tint: "o-badge--matcha", icon: "toggle" },
    [RATING]: { label: "rating", tint: "o-badge--sakura", icon: "star" },
    [SHORT_TEXT]: { label: "short text", tint: "o-badge--peach", icon: "text" },
    [LONG_TEXT]: { label: "long text", tint: "o-badge--peach", icon: "align" },
    [EMAIL]: { label: "email", tint: "o-badge--peach", icon: "mail" },
    [PHONE]: { label: "phone", tint: "o-badge--peach", icon: "phone" },
    [URL]: { label: "link", tint: "o-badge--peach", icon: "link" },
    [NUMBER]: { label: "number", tint: "o-badge--sakura", icon: "hash" },
    [DATE]: { label: "date", tint: "o-badge--sakura", icon: "calendar" },
    [FILE_UPLOAD]: { label: "file upload", tint: "o-badge--sakura", icon: "clip" },
};

export const CHART_SERIES = {
    light: ["#c66145", "#3a72a8", "#6f9a53", "#8a63c4", "#b08b21"],
    dark: ["#d9745c", "#3f8fd0", "#6aa140", "#9a72cc", "#ab862a"],
} as const;

export const CHART_SERIES_OVERFLOW = {
    light: ["#d87890", "#e08b4f", "#8b78b2", "#a2c181", "#2d4b6b"],
    dark: ["#ed9dae", "#f5b98a", "#b7a7d7", "#a2c181", "#4a6b8a"],
} as const;
