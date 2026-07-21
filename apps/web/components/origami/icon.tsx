import type { CSSProperties } from "react";

/**
 * Origami line-icon set — hand-drawn-leaning strokes for nav, fields and actions.
 * Authored for the Origami design system; add new glyphs to ICONS.
 */
export type IconName =
  | "home"
  | "forms"
  | "analytics"
  | "templates"
  | "themes"
  | "settings"
  | "plus"
  | "check"
  | "x"
  | "edit"
  | "trash"
  | "share"
  | "copy"
  | "eye"
  | "bell"
  | "search"
  | "filter"
  | "download"
  | "sparkles"
  | "zap"
  | "text"
  | "align"
  | "list"
  | "mail"
  | "calendar"
  | "lock"
  | "layers"
  | "arrow"
  | "arrowLeft"
  | "play"
  | "star"
  | "hash"
  | "drag"
  | "alertCircle"
  | "refresh"
  | "arrowLeftShort";

const ICONS: Record<IconName, React.ReactNode> = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  forms: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  analytics: (
    <>
      <path d="M4 19V5" /><path d="M4 19h16" />
      <rect x="7" y="11" width="3" height="6" /><rect x="12" y="8" width="3" height="9" />
      <rect x="17" y="14" width="3" height="3" />
    </>
  ),
  templates: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </>
  ),
  themes: <><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18M3 12h18" /></>,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="M5 12l5 5 9-11" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  edit: <><path d="M11 4H4v16h16v-7" /><path d="M18.5 2.5a2 2 0 0 1 3 3L12 15l-4 1 1-4z" /></>,
  trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M6 6l1 14h10l1-14" />,
  share: (
    <>
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </>
  ),
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  filter: <path d="M3 5h18l-7 9v6l-4-2v-4z" />,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></>,
  sparkles: (
    <>
      <path d="M12 3l1.6 4.6L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.4z" />
      <path d="M19 16l.8 2.4L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.4-.8z" />
    </>
  ),
  zap: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  text: <path d="M5 4h14M12 4v16M9 20h6" />,
  align: <path d="M3 6h18M3 12h12M3 18h18" />,
  list: (
    <>
      <path d="M9 6h12M9 12h12M9 18h12" />
      <circle cx="4" cy="6" r="1.2" fill="currentColor" /><circle cx="4" cy="12" r="1.2" fill="currentColor" />
      <circle cx="4" cy="18" r="1.2" fill="currentColor" />
    </>
  ),
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  lock: <><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5M3 18l9 5 9-5" /></>,
  arrow: <path d="M5 12h14M13 5l7 7-7 7" />,
  arrowLeft: <path d="M19 12H5M12 19l-7-7 7-7" />,
  play: <polygon points="6,4 22,12 6,20" fill="currentColor" stroke="none" />,
  star: <path d="M12 2.5l2.7 6.4 6.9.6-5.2 4.7 1.6 6.7L12 17.3 5.9 21l1.6-6.7-5.2-4.7 6.9-.6z" />,
  hash: <path d="M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18" />,
  drag: (
    <>
      <circle cx="9" cy="6" r="1.4" fill="currentColor" /><circle cx="9" cy="12" r="1.4" fill="currentColor" />
      <circle cx="9" cy="18" r="1.4" fill="currentColor" /><circle cx="15" cy="6" r="1.4" fill="currentColor" />
      <circle cx="15" cy="12" r="1.4" fill="currentColor" /><circle cx="15" cy="18" r="1.4" fill="currentColor" />
    </>
  ),
  alertCircle: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v5h-5" /></>,
  arrowLeftShort: <path d="M19 12H5M12 19l-7-7 7-7" />,
};

interface IconProps {
  name: IconName;
  size?: number;
  weight?: number;
  className?: string;
  style?: CSSProperties;
}

export function Icon({ name, size = 18, weight = 1.7, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}
