import React from 'react'

export type IconName =
    | 'plus'
    | 'home'
    | 'forms'
    | 'mail'
    | 'analytics'
    | 'templates'
    | 'themes'
    | 'sparkles'
    | 'zap'
    | 'settings'
    | 'search'
    | 'bell'
    | 'edit'
    | 'eye'
    | 'arrow'
    | 'chevron'
    | 'check'
    | 'clock'
    | 'filter'
    | 'crane'
    | 'sakura'
    | 'lock'
    | 'clip'
    | 'plane'
    | 'trash'
    | 'star'
    | 'share'
    | 'copy'
    | 'more'
    | 'grid'
    | 'list'
    | 'archive'
    | 'users'
    | 'calendar'

const paths: Record<IconName, React.ReactNode> = {
    plus: <path d="M12 5v14M5 12h14" />,
    home: <path d="M4 11 12 4l8 7M6 10v9h12v-9" />,
    forms: (
        <>
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M9 8h6M9 12h6M9 16h4" />
        </>
    ),
    mail: (
        <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M4 7l8 6 8-6" />
        </>
    ),
    analytics: <path d="M5 19V5M5 19h14M9 15v-4M13 15V8M17 15v-6" />,
    templates: (
        <>
            <rect x="4" y="4" width="7" height="7" rx="1" />
            <rect x="13" y="4" width="7" height="7" rx="1" />
            <rect x="4" y="13" width="7" height="7" rx="1" />
            <rect x="13" y="13" width="7" height="7" rx="1" />
        </>
    ),
    themes: (
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 4a8 8 0 0 0 0 16" fill="currentColor" stroke="none" opacity="0.35" />
        </>
    ),
    sparkles: <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6zM18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />,
    zap: <path d="M13 3 5 13h6l-1 8 8-10h-6z" />,
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="6" />
            <path d="M20 20l-3.5-3.5" />
        </>
    ),
    bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />,
    edit: <path d="M4 20h4L18 10l-4-4L4 16zM14 6l4 4" />,
    eye: (
        <>
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
            <circle cx="12" cy="12" r="2.5" />
        </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    chevron: <path d="M9 6l6 6-6 6" />,
    check: <path d="M5 13l4 4 10-11" />,
    clock: (
        <>
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4l3 2" />
        </>
    ),
    filter: <path d="M4 5h16l-6 7v6l-4 2v-8z" />,
    crane: <path d="M4 8l7 3 3-6 2 8 4 2-6 1-2 5-3-6-6 2 4-4z" />,
    sakura: (
        <>
            <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
            <path d="M12 4c1.6 0 2.6 1.6 2 3.4M12 4c-1.6 0-2.6 1.6-2 3.4M20 10c.5 1.5-.5 3.1-2.4 3.2M20 10c-1-1.2-2.9-1-3.7.6M17 20c-1.3.9-3.2.3-3.7-1.5M17 20c.4-1.5-.6-3-2.4-3.1M7 20c-.4-1.5.6-3 2.4-3.1M7 20c1.3.9 3.2.3 3.7-1.5M4 10c1-1.2 2.9-1 3.7.6M4 10c-.5 1.5.5 3.1 2.4 3.2" />
        </>
    ),
    lock: (
        <>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </>
    ),
    clip: <path d="M16 7v9a4 4 0 0 1-8 0V6a2.5 2.5 0 0 1 5 0v9a1 1 0 0 1-2 0V7" />,
    plane: <path d="M3 11 21 3l-8 18-2-7z" />,
    trash: <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />,
    star: <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z" />,
    share: (
        <>
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <path d="M8.2 10.8 15.8 7.2M8.2 13.2 15.8 16.8" />
        </>
    ),
    copy: (
        <>
            <rect x="8" y="8" width="12" height="12" rx="2" />
            <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </>
    ),
    more: (
        <>
            <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </>
    ),
    grid: (
        <>
            <rect x="4" y="4" width="7" height="7" rx="1.5" />
            <rect x="13" y="4" width="7" height="7" rx="1.5" />
            <rect x="4" y="13" width="7" height="7" rx="1.5" />
            <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </>
    ),
    list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
    archive: (
        <>
            <rect x="4" y="4" width="16" height="4" rx="1" />
            <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="8" r="3" />
            <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 0 1 0 5.5M17 14c2.4.5 4 2.6 4 5" />
        </>
    ),
    calendar: (
        <>
            <rect x="4" y="5" width="16" height="16" rx="2" />
            <path d="M4 9h16M8 3v4M16 3v4" />
        </>
    ),
}

export const Icon = ({
    name,
    size = 18,
    className,
}: {
    name: IconName
    size?: number
    className?: string
}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden
    >
        {paths[name]}
    </svg>
)
