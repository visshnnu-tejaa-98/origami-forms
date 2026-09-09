import { GRID, LIST } from "@repo/database/constants";
import { ManagedUser, Role, SettingsTab, ThemeChoice, ViewChoice } from "./types";

export const SETTINGS_TABS: SettingsTab[] = [
    { id: "profile", label: "Profile", icon: "edit" },
    { id: "appearance", label: "Appearance", icon: "themes" },
    { id: "preferences", label: "Preferences", icon: "list" },
    { id: "danger", label: "Danger zone", icon: "trash", tone: "danger" },
];

export const PAGE_SIZE_CHOICES = [10, 20, 30, 50, 100];

export const THEME_CHOICES: {
    value: ThemeChoice;
    label: string;
    hint: string;
}[] = [
        { value: "light", label: "Paper", hint: "warm, bright, the default fold" },
        { value: "dark", label: "Ink", hint: "low light, easy on late evenings" },
    ];

export const VIEW_CHOICES: {
    value: ViewChoice;
    label: string;
    hint: string;
}[] = [
        { value: GRID, label: "Grid", hint: "cards, side by side" },
        { value: LIST, label: "List", hint: "one row per form, denser" },
    ];

/** copy for each role, shown on the role badge and in the admin role picker */
export const ROLE_COPY: Record<Role, { label: string; badge: string; blurb: string }> = {
    subscriber: {
        label: "Subscriber",
        badge: "o-badge--lavender",
        blurb: "can fill and view forms shared with them",
    },
    starter: {
        label: "Starter",
        badge: "o-badge--matcha",
        blurb: "can build, publish and collect responses",
    },
    admin: {
        label: "Admin",
        badge: "o-badge--peach",
        blurb: "full access, including people management",
    },
};

export const STATUS_BADGE: Record<ManagedUser["status"], string> = {
    active: "o-badge--matcha",
    invited: "o-badge--lavender",
    suspended: "o-badge--ghost",
};

/** placeholder rows — the table is wired to nothing yet */
export const SAMPLE_USERS: ManagedUser[] = [
    {
        id: "u_01",
        firstName: "Aiko",
        lastName: "Tanaka",
        email: "aiko@origami.dev",
        role: "admin",
        forms: 12,
        responses: 2418,
        joinedAt: "Mar 2024",
        status: "active",
    },
    {
        id: "u_02",
        firstName: "Marcus",
        lastName: "Reyes",
        email: "marcus@origami.dev",
        role: "starter",
        forms: 7,
        responses: 942,
        joinedAt: "Jun 2024",
        status: "active",
    },
    {
        id: "u_03",
        firstName: "Priya",
        lastName: "Nair",
        email: "priya@origami.dev",
        role: "starter",
        forms: 4,
        responses: 310,
        joinedAt: "Sep 2024",
        status: "active",
    },
    {
        id: "u_04",
        firstName: "Ellis",
        lastName: "Wong",
        email: "ellis@origami.dev",
        role: "subscriber",
        forms: 0,
        responses: 0,
        joinedAt: "Jan 2025",
        status: "invited",
    },
    {
        id: "u_05",
        firstName: "Dana",
        lastName: "Okafor",
        email: "dana@origami.dev",
        role: "subscriber",
        forms: 1,
        responses: 26,
        joinedAt: "Feb 2025",
        status: "suspended",
    },
];
