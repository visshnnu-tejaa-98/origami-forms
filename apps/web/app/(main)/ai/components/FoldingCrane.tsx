import React from "react";

const FoldingCrane = ({ size = 96 }: { size?: number }) => (
    <svg
        className="fold"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <g className="fold-sheet">
            <rect className="fold-edge" x="11" y="11" width="26" height="26" rx="1" pathLength={1} />
            <path className="fold-crease fold-crease--1" d="M11 11 L37 37" pathLength={1} />
            <path className="fold-crease fold-crease--2" d="M37 11 L11 37" pathLength={1} />
            <path className="fold-crease fold-crease--3" d="M24 11 L24 37" pathLength={1} />
        </g>

        <g className="fold-bird">
            <path className="fold-fill" d="M6 14 L24 26 L18 12 Z" fill="currentColor" fillOpacity="0.18" />
            <path className="fold-fill" d="M24 26 L20 40 L28 40 Z" fill="currentColor" fillOpacity="0.14" />
            <path className="fold-line fold-line--1" d="M6 14 L24 26 L42 14" pathLength={1} />
            <path className="fold-line fold-line--2" d="M6 14 L24 26 L18 12 Z" pathLength={1} />
            <path className="fold-line fold-line--3" d="M24 26 L20 40 L28 40 Z" pathLength={1} />
            <path className="fold-line fold-line--4" d="M24 26 L10 34" pathLength={1} />
            <path className="fold-line fold-line--5" d="M42 14 L44 8 L38 10" pathLength={1} />
        </g>
    </svg>
);

export default FoldingCrane;
