import React, { useMemo } from "react";
import { Clip, Crane } from "../../../../components/origami/deco";
import { FieldCardProps } from "~/components/form-flow/types";

const FieldCard = ({ at, total, back = false, children }: FieldCardProps) => {
    const stack = useMemo(() => {
        const under = Math.max(0, Math.min(2, total - at));
        return Array.from({ length: under }, (_, k) => {
            const depth = k + 1;
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

export default FieldCard;
