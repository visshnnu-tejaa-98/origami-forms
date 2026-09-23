"use client";

import { useEffect, useRef } from "react";

/**
 * Packs a CSS grid's children like a bento wall.
 *
 * A plain two-column grid gives every cell in a row the height of its tallest
 * card, so a field with two options sitting beside one with five leaves the
 * difference as dead space. Here the grid is laid out on a fine row unit and each
 * card is given a `grid-row: span N` matching its own measured height, so the next
 * card starts right underneath it instead of at the row boundary.
 *
 * Heights are measured rather than estimated from the option count, because a
 * question that wraps onto a second line makes any formula wrong.
 */
export function useBentoSpans<T extends HTMLElement = HTMLDivElement>(
    /** Re-measure when the rendered set changes, not just when it resizes. */
    key: string,
) {
    const ref = useRef<T>(null);

    useEffect(() => {
        const grid = ref.current;
        if (!grid || typeof ResizeObserver === "undefined") return;

        const resize = () => {
            const styles = getComputedStyle(grid);
            const rowUnit = Number.parseFloat(styles.gridAutoRows) || 8;
            const rowGap = Number.parseFloat(styles.rowGap) || 0;

            for (const child of Array.from(grid.children)) {
                const card = child as HTMLElement;
                // the card is content-sized (align-items: start), so its height does
                // not depend on the span we set — measuring cannot feed back into itself
                const height = card.getBoundingClientRect().height;
                // the gap between cards is the card's own bottom margin, which
                // getBoundingClientRect leaves out, so it is added back here
                const margin = Number.parseFloat(getComputedStyle(card).marginBottom) || 0;
                const span = Math.max(
                    1,
                    Math.ceil((height + margin + rowGap) / (rowUnit + rowGap)),
                );
                card.style.gridRowEnd = `span ${span}`;
            }
        };

        resize();

        const observer = new ResizeObserver(resize);
        observer.observe(grid);
        for (const child of Array.from(grid.children)) observer.observe(child);

        return () => observer.disconnect();
    }, [key]);

    return ref;
}
