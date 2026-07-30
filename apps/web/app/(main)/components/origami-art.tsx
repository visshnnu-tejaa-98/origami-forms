import React from "react";

type ArtProps = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 48 48",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.6,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
  className,
  "aria-hidden": true,
});

/* A folded paper boat sitting on a little wave. */
export const PaperBoat = ({ size = 40, className }: ArtProps) => (
  <svg {...base(size, className)}>
    <path d="M6 26 H42 L34 36 H14 Z" fill="currentColor" fillOpacity="0.12" />
    <path d="M6 26 H42 L34 36 H14 Z" />
    <path d="M24 26 V10 L38 26 Z" fill="currentColor" fillOpacity="0.18" />
    <path d="M24 26 V10 L38 26" />
    <path d="M24 26 V14 L12 26" />
    <path d="M5 40 q4 -3 8 0 t8 0 t8 0 t8 0" opacity="0.5" />
  </svg>
);

/* A blooming paper flower / lotus fold. */
export const PaperFlower = ({ size = 40, className }: ArtProps) => (
  <svg {...base(size, className)}>
    <path d="M24 24 L24 8 C29 12 29 19 24 24" fill="currentColor" fillOpacity="0.14" />
    <path d="M24 24 L24 8 C29 12 29 19 24 24" />
    <path d="M24 24 L24 8 C19 12 19 19 24 24" />
    <path d="M24 24 L38 16 C36 22 31 25 24 24" fill="currentColor" fillOpacity="0.14" />
    <path d="M24 24 L38 16 C36 22 31 25 24 24" />
    <path d="M24 24 L10 16 C12 22 17 25 24 24" />
    <path d="M24 24 L33 38 C27 37 23 32 24 24" />
    <path d="M24 24 L15 38 C21 37 25 32 24 24" fill="currentColor" fillOpacity="0.14" />
    <path d="M24 24 L15 38 C21 37 25 32 24 24" />
    <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
  </svg>
);

/* A hopping paper frog (traditional jumping-frog fold). */
export const PaperFrog = ({ size = 40, className }: ArtProps) => (
  <svg {...base(size, className)}>
    <path d="M10 30 L24 20 L38 30 L30 34 L18 34 Z" fill="currentColor" fillOpacity="0.12" />
    <path d="M10 30 L24 20 L38 30 L30 34 L18 34 Z" />
    <path d="M24 20 L18 12 L22 22" />
    <path d="M24 20 L30 12 L26 22" />
    <path d="M10 30 L4 34 L12 34" />
    <path d="M38 30 L44 34 L36 34" />
    <circle cx="20" cy="18" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="28" cy="18" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

/* A folded paper crane in flight. */
export const PaperCrane = ({ size = 40, className }: ArtProps) => (
  <svg {...base(size, className)}>
    <path d="M6 14 L24 26 L42 14" />
    <path d="M24 26 L20 40 L28 40 Z" fill="currentColor" fillOpacity="0.14" />
    <path d="M24 26 L20 40 L28 40 Z" />
    <path d="M24 26 L10 34" />
    <path d="M42 14 L44 8 L38 10" />
    <path d="M6 14 L24 26 L18 12 Z" fill="currentColor" fillOpacity="0.18" />
    <path d="M6 14 L24 26 L18 12 Z" />
  </svg>
);

/* A folded paper star / ninja-star fold. */
export const PaperStar = ({ size = 40, className }: ArtProps) => (
  <svg {...base(size, className)}>
    <path d="M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z" fill="currentColor" fillOpacity="0.12" />
    <path d="M24 6 L28 20 L42 24 L28 28 L24 42 L20 28 L6 24 L20 20 Z" />
    <path d="M24 6 L24 42 M6 24 L42 24" opacity="0.4" />
  </svg>
);
