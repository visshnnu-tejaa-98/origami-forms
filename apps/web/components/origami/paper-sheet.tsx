import React, { useMemo } from "react";
import { Clip, Crane } from "./deco";

type PaperSheetProps = {
    /** which sheet in the run is on top — drives the pile's fan and the card's re-entry */
    at: number;
    /** the last sheet's index, so the pile knows how many are still underneath */
    total: number;
    /** stepping back reverses the travel: the sheet drops in from the other side */
    back?: boolean;
    children: React.ReactNode;
};

/**
 * The sheet of paper a question is written on, with the rest of the pile fanned beneath it.
 *
 * The builder preview and the published form both render this, so a form looks the same
 * to its author as it does to the stranger answering it — there is one card here, not two
 * that happen to share class names. Styling lives in `preview.css` (`.pv-card`, `.pv-stack`).
 */
const PaperSheet = ({ at, total, back = false, children }: PaperSheetProps) => {
    const stack = useMemo(() => {
        const under = Math.max(0, Math.min(2, total - at));
        return Array.from({ length: under }, (_, k) => {
            const depth = k + 1;
            // deterministic wobble — the pile is never squared up, but it is never random either
            const wobble = ((at * 13 + depth * 29) % 9) - 4;
            return {
                depth,
                rot: (depth % 2 === 0 ? 1.7 : -1.5) * depth + wobble * 0.2,
                x: wobble * 1.8 + depth * 2,
                y: depth * 7 + Math.abs(wobble) * 0.7,
            };
        });
    }, [at, total]);

    return (
        <>
            {/* deepest sheet first, so the nearest one paints on top */}
            {[...stack].reverse().map((sheet) => (
                <span
                    key={sheet.depth}
                    className={`pv-stack pv-stack--${sheet.depth}`}
                    aria-hidden
                    style={
                        {
                            "--sheet-r": `${sheet.rot}deg`,
                            "--sheet-x": `${sheet.x}px`,
                            "--sheet-y": `${sheet.y}px`,
                        } as React.CSSProperties
                    }
                />
            ))}

            {/* keyed on the step, so a new sheet animates in rather than mutating in place */}
            <div className={`pv-card${back ? " is-back" : ""}`} key={at}>
                <span className="pv-grain-card" aria-hidden />
                <span className="pv-margin-rule" aria-hidden />
                <span className="pv-watermark" aria-hidden>
                    <Crane size={190} />
                </span>
                <span className="pv-clip" aria-hidden>
                    <Clip size={34} />
                </span>
                <span className="pv-fold" aria-hidden />

                {children}
            </div>
        </>
    );
};

export default PaperSheet;
