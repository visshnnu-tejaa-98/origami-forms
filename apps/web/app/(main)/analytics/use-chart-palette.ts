"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { DARK } from "@repo/database/constants";
import { CHART_SERIES } from "./constants";

/**
 * Recharts writes `stroke` and `fill` as SVG presentation attributes, where
 * `var(--token)` does not resolve — so the series colors have to arrive as literal
 * hex rather than as custom properties like the rest of the page's marks.
 *
 * Renders the light steps until mounted so the server and first client paint agree.
 */
export function useChartPalette() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const isDark = mounted && resolvedTheme === DARK;

    return {
        series: isDark ? CHART_SERIES.dark : CHART_SERIES.light,
        isDark,
    };
}
