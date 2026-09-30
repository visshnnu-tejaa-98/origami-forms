import { IconName } from "./components/icons";
import { DefaultFilterOptions } from "./responses/types";
import { SortField, Status, TemplateSortField, TemplateTab } from "./types";

// Icons and Tints
export const ICONS: IconName[] = ["forms", "sakura", "mail", "sparkles", "zap", "users", "calendar", "edit"];
export const TINTS = ["k1", "k2", "k3", "k4", "k5", "k6"];

// Status options
export const DRAFT = "draft";
export const PUBLISHED = "published";
export const ARCHIVED = "archived";
export const EXPIRED = "expired"
export const FORM_STATUS_OPTIONS = [DRAFT, PUBLISHED, ARCHIVED, EXPIRED]

export const STATUS_TABS = [
    { key: "all", label: "All", icon: "forms", count: 0 },
    { key: PUBLISHED, label: "Live", icon: "eye", count: 0 },
    { key: DRAFT, label: "Drafts", icon: "edit", count: 0 },
    { key: ARCHIVED, label: "Archived", icon: "archive", count: 0 },
    { key: EXPIRED, label: "Expired", icon: "archive", count: 0 },
];

// Sorting
export const ASC = "asc";
export const DESC = "desc"
export const UPDATED_AT = "updatedAt";
export const CREATED_AT = "createdAt";
export const LIKES_SORT = "likes";
export const TITLE_SORT = "title";
export const SUBMISSION_COUNT = "submissionCount"
export const ALL = "all"

export const SORTS: { key: SortField; label: string }[] = [
    { key: UPDATED_AT, label: "Last modified" },
    { key: TITLE_SORT, label: "A–Z" },
    { key: SUBMISSION_COUNT, label: "Responses" },
];

// Responses toolbar
export const SUBMITTED_AT = "submittedAt";
export const COMPLETION_TIME = "completionTimeInSec";
export const PARTIAL = "partial";
export const COMPLETED = "completed";

export type ResponseTab = typeof ALL | typeof PARTIAL | typeof COMPLETED;
export type ResponseSortField = typeof SUBMITTED_AT | typeof COMPLETION_TIME;

export const RESPONSE_TAB_VALUES = [ALL, COMPLETED, PARTIAL] as const;

export const RESPONSE_STATUS_TABS: { key: ResponseTab; label: string; icon: IconName, count?: number }[] = [
    { key: ALL, label: "All", icon: "forms" },
    { key: COMPLETED, label: "Completed", icon: "check" },
    { key: PARTIAL, label: "Partial", icon: "clock" },
];

export const RESPONSE_SORTS: { key: ResponseSortField; label: string }[] = [
    { key: SUBMITTED_AT, label: "Submitted" },
    { key: COMPLETION_TIME, label: "Time taken" },
];

export const RESPONSE_SORT_VALUES = [SUBMITTED_AT, COMPLETION_TIME] as const;

export const FORM_TAB_VALUES = [ALL, DRAFT, PUBLISHED, ARCHIVED, EXPIRED] as const;
export const FORM_SORT_VALUES = [UPDATED_AT, TITLE_SORT, SUBMISSION_COUNT] as const;

export const LIST = "list"
export const GRID = "grid"

export const EMPTY_COPY: Record<Status | typeof ALL, { title: string; description: string }> = {
    all: {
        title: "Your drawer is empty.",
        description: "No forms match that search. Try a different word, or fold a fresh sheet to begin.",
    },
    published: {
        title: "Nothing live yet.",
        description: "Publish a draft and it'll show up here, ready to collect its first response.",
    },
    draft: {
        title: "No drafts on the desk.",
        description: "Every masterpiece starts as a rough fold. Begin a new one whenever inspiration strikes.",
    },
    archived: {
        title: "The archive is spotless.",
        description: "Forms you retire will rest here, safe and out of the way.",
    },
    expired: {
        title: "No forms expire",
        description: "Forms you retire will rest here, safe and out of the way.",
    },
};

export const MINE = "mine";
export const LIBRARY = "library";
export const TEMPLATE_SCOPE_VALUES = [MINE, LIBRARY] as const;

export const TEMPLATE_TAB_VALUES = [ALL, DRAFT, PUBLISHED, ARCHIVED] as const;
export const TEMPLATE_SORT_VALUES = [UPDATED_AT, TITLE_SORT, CREATED_AT, LIKES_SORT] as const;

export const TEMPLATE_STATUS_TABS: { key: TemplateTab; label: string; icon: IconName }[] = [
    { key: ALL, label: "All", icon: "templates" },
    { key: PUBLISHED, label: "Shared", icon: "eye" },
    { key: DRAFT, label: "Drafts", icon: "edit" },
    { key: ARCHIVED, label: "Archived", icon: "archive" },
];

export const TEMPLATE_SORTS: { key: TemplateSortField; label: string }[] = [
    { key: UPDATED_AT, label: "Last modified" },
    { key: TITLE_SORT, label: "A–Z" },
    { key: CREATED_AT, label: "Newest" },
];

export const LIBRARY_SORTS: { key: TemplateSortField; label: string }[] = [
    { key: LIKES_SORT, label: "Most liked" },
    { key: TITLE_SORT, label: "A–Z" },
    { key: CREATED_AT, label: "Newest" },
];

export const TEMPLATE_EMPTY_COPY: Record<TemplateTab, { title: string; description: string }> = {
    all: {
        title: "No patterns on the shelf.",
        description:
            "A template is a fold worth repeating. Save one from a form you like, and it'll wait here for the next time.",
    },
    published: {
        title: "Nothing shared yet.",
        description: "Publish a pattern and it becomes a starting point anyone on your desk can pick up.",
    },
    draft: {
        title: "No patterns in progress.",
        description: "Rough creases live here until they're worth sharing. Start one whenever you like.",
    },
    archived: {
        title: "The shelf is tidy.",
        description: "Patterns you retire rest here, still folded, out of the way.",
    },
};

export const LIBRARY_EMPTY_COPY = {
    idle: {
        title: "The library is bare.",
        description:
            "Nothing has been shared yet. Publish one of your own patterns and it lands here for everyone to fold from.",
    },
    search: {
        title: "No pattern by that name.",
        description: "Nothing in the library matches that search. Try a broader word.",
    },
};

export const defaultResponsesFilterOptions: DefaultFilterOptions = {
    sortBy: "submittedAt",
    sortOrder: "desc",
    status: "all",
    search: "",
}