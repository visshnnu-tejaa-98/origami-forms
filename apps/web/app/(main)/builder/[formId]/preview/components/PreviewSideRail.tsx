import React, { useEffect, useRef } from 'react'
import { Icon } from '~/app/(main)/components/icons';
import { PreviewSideRailProps, } from '../../../types';
import { BLOCK_META, HEADING, PAGE_BREAK } from '../../../constants';
import { useSearchParams } from 'next/navigation';



const PreviewSideRail = ({ form, at, steps, questions, onClose, go }: PreviewSideRailProps) => {
    const total = steps.length - 1;
    const activeItem = useRef<HTMLButtonElement | null>(null);

    const searchParams = useSearchParams()
    const redirectedFrom = searchParams.get("from")

    const isFromList = redirectedFrom === "list";
    const backNavigationLabel = isFromList ? 'Back to List' : 'Builder'

    useEffect(() => {
        activeItem.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [at]);

    return (
        <aside className="pv-rail">
            <div className="pv-rail-head">
                <button type="button" className="o-btn o-btn--sm o-btn--ghost" onClick={onClose}>
                    <Icon name="arrow-left" size={13} /> {backNavigationLabel}
                </button>
                <span className="o-badge o-badge--matcha">▶ live preview</span>
            </div>

            <div className="pv-rail-title pv-rail-title--spaced">First Fold</div>
            <button
                type="button"
                ref={at === 0 ? activeItem : undefined}
                className={`pv-item t-matcha pv-item ${at === 0 ? " active" : ""}`}
                onClick={() => go(0)}
            >
                <span className="ic">
                    <Icon name="check" size={14} />
                </span>
                <span className="nm">{form.title}</span>
            </button>

            <div className="pv-rail-title">The folds</div>
            {steps.map((s, i) => {
                if (s.kind === "cover" || s.kind === "review") return null;
                const meta =
                    s.kind === "field"
                        ? BLOCK_META[s.field.type]
                        : BLOCK_META[s.kind === "page-break" ? PAGE_BREAK : HEADING];
                const label = s.kind === "field" ? s.field.label : s.label;

                return (
                    <button
                        key={s.id}
                        type="button"
                        ref={i === at ? activeItem : undefined}
                        className={`pv-item t-${meta?.tint ?? "accent"}${i === at ? " active" : ""}`}
                        onClick={() => go(i)}
                    >
                        <span className="ic">
                            <Icon name={meta?.icon ?? "text"} size={14} />
                        </span>
                        <span className="nm">{label || "Untitled question"}</span>
                        <span className="num">{String(i).padStart(2, "0")}</span>
                    </button>
                );
            })}

            {questions.length === 0 && (
                <p className="pv-rail-empty">No folds yet — add a field and it appears here.</p>
            )}

            <div className="pv-rail-title pv-rail-title--spaced">The finish</div>
            <button
                type="button"
                ref={at === total ? activeItem : undefined}
                className={`pv-item t-matcha pv-item ${at === total ? " active" : ""}`}
                onClick={() => go(total)}
            >
                <span className="ic">
                    <Icon name="check" size={14} />
                </span>
                <span className="nm">Review &amp; send</span>
                <span className="num">{String(total).padStart(2, "0")}</span>
            </button>
        </aside>
    )
}

export default PreviewSideRail
