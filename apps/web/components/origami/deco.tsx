import type { CSSProperties } from "react";

/**
 * Origami decorative art — folded paper shapes and scribbles.
 * Colour comes from `currentColor`, so set it via CSS `color` on a wrapper.
 */

interface DecoProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

function svgStyle(size: number, style?: CSSProperties): CSSProperties {
  return { width: size, height: "auto", display: "block", color: "inherit", ...style };
}

/** Folded paper crane. */
export function Crane({ size = 120, className, style }: DecoProps) {
  const id = "crane";
  return (
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <defs>
        <linearGradient id={`cr1-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.96" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.72" />
        </linearGradient>
        <linearGradient id={`cr2-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <path d="M20,62 L60,38 L100,52 L86,68 L60,58 L34,76 Z" fill={`url(#cr1-${id})`} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M60,38 L80,12 L100,52 L78,42 Z" fill={`url(#cr2-${id})`} stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M40,30 L60,38 L34,76 L24,46 Z" fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M60,38 L92,30 L96,26 L90,28 L88,24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20,62 L8,56 L14,66 Z" fill="currentColor" fillOpacity="0.75" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
      <path d="M60,38 L60,58 M34,76 L60,58 M86,68 L60,58" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.4" />
    </svg>
  );
}

/** Paper plane. */
export function Plane({ size = 80, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <path d="M8,40 L92,8 L62,72 L48,48 L20,42 Z" fill="currentColor" fillOpacity="0.92" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M48,48 L92,8 L62,72 Z" fill="currentColor" fillOpacity="0.65" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M48,48 L20,42 M48,48 L62,72" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.45" />
    </svg>
  );
}

/** Pencil. */
export function Pencil({ size = 130, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 140 36" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <rect x="22" y="10" width="92" height="16" rx="1" fill="#F5C8A0" stroke="currentColor" strokeWidth="1" />
      <rect x="22" y="10" width="92" height="3" fill="rgba(0,0,0,0.10)" />
      <path d="M22,10 L8,18 L22,26 Z" fill="#3A332C" stroke="currentColor" strokeWidth="1" />
      <path d="M14,18 L8,18 L4,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="114" y="10" width="10" height="16" fill="#D9C8A8" stroke="currentColor" strokeWidth="1" />
      <rect x="124" y="10" width="12" height="16" rx="1" fill="#ED9DAE" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Paper clip. */
export function Clip({ size = 34, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 40 80" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <path d="M12,8 L12,60 C12,68 28,68 28,60 L28,18 C28,12 18,12 18,18 L18,54" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/** Cherry-blossom (five petals). */
export function Sakura({ size = 32, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <g transform="translate(20 20)">
        {[0, 72, 144, 216, 288].map((a) => (
          <path key={a} transform={`rotate(${a})`} d="M0,-4 C6,-16 -6,-16 0,-4 Z" fill="currentColor" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" />
        ))}
        <circle r="2" fill="#F5E27A" />
      </g>
    </svg>
  );
}

/** Single leaf. */
export function Leaf({ size = 32, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <path d="M20,4 C36,16 36,44 20,56 C4,44 4,16 20,4 Z" fill="currentColor" fillOpacity="0.78" stroke="currentColor" strokeWidth="1" />
      <path d="M20,4 L20,56" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
    </svg>
  );
}

/** Fountain pen. */
export function Pen({ size = 140, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 140 40" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <rect x="40" y="14" width="80" height="12" rx="3" fill="currentColor" fillOpacity="0.85" />
      <rect x="40" y="14" width="6" height="12" fill="currentColor" />
      <rect x="90" y="10" width="4" height="22" rx="1" fill="currentColor" fillOpacity="0.85" />
      <path d="M40,20 L18,20 L8,24 L18,28 L40,28 Z" fill="currentColor" />
      <path d="M22,20 L22,28 M30,21 L30,27" stroke="#FFFDF7" strokeWidth="0.8" />
      <circle cx="22" cy="24" r="1.4" fill="#FFFDF7" />
      <rect x="120" y="12" width="14" height="16" rx="2" fill="currentColor" fillOpacity="0.9" />
    </svg>
  );
}

/** Scribbled down-right arrow. */
export function ScribbleArrow({ size = 100, className, style }: DecoProps) {
  return (
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" className={className} style={svgStyle(size, style)} aria-hidden="true">
      <path d="M8,12 C30,32 14,52 50,56 C80,60 86,76 96,84" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M96,84 L86,76 M96,84 L92,72" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
