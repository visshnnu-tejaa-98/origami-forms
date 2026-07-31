import { IconName } from "./components/icons";
import { SortField, Status } from "./types";

// Icons and Tints
export const ICONS: IconName[] = ["forms", "sakura", "mail", "sparkles", "zap", "users", "calendar", "edit"];
export const TINTS = ["k1", "k2", "k3", "k4", "k5", "k6"];

// Status options
export const DRAFT = "draft";
export const PUBLISHED = "published";
export const ARCHIVED = "archived";
export const FORM_STATUS_OPTIONS = [DRAFT, PUBLISHED, ARCHIVED]

export const STATUS_TABS = [
    { key: "all", label: "All", icon: "forms" },
    { key: PUBLISHED, label: "Live", icon: "eye" },
    { key: DRAFT, label: "Drafts", icon: "edit" },
    { key: ARCHIVED, label: "Archived", icon: "archive" },
];

// Sorting
export const ASC = "asc";
export const DESC = "desc"
export const UPDATED_AT = "updatedAt";
export const TITLE_SORT = "title";
export const SUBMISSION_COUNT = "submissionCount"
export const ALL = "all"

export const SORTS: { key: SortField; label: string }[] = [
    { key: UPDATED_AT, label: "Last modified" },
    { key: TITLE_SORT, label: "A–Z" },
    { key: SUBMISSION_COUNT, label: "Responses" },
];