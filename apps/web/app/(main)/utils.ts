import { RouterOutputs } from "@repo/trpc/client";
import { ICONS, TINTS } from "./constants";
import { PageOptions, Status } from "./types";
import { relativeTime } from "../utils";
import { BlockType, BuilderField, LayoutType } from "./builder/types";
import { BLOCK_META, HEADING, LAYOUT_TYPES, PREVIEW_PLACEHOLDER } from "./builder/constants";

export const TAPE = ["tape-pink", "tape-matcha", "tape-yellow", "tape-lav"];

export const STATUS_BADGE: Record<Status, { cls: string; label: string }> = {
    published: { cls: "o-badge--matcha", label: "live" },
    draft: { cls: "o-badge--sakura", label: "draft" },
    archived: { cls: "o-badge--ghost", label: "archived" },
};

export const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
};

type ApiForm = RouterOutputs["forms"]["getAllForms"]["forms"][number];

export const toUiForm = (f: ApiForm) => ({
    id: f.id,
    title: f.title,
    icon: ICONS[hash(f.id) % ICONS.length]!,
    tint: TINTS[hash(f.id) % TINTS.length]!,
    // `unlisted` is a visibility on the API, but a status in this UI.
    status: f.status,
    responses: f.submissionCount,
    // Progress toward the submission cap; 0 when the form is uncapped.
    // TODO: Change this max submission count based on subscription plan
    completion:
        f.maxSubmissions > 0
            ? Math.min(100, Math.round((f.submissionCount / f.maxSubmissions) * 100))
            : 0,
    edited: relativeTime(f.updatedAt),
    // Lower rank = more recent; the API already sorts by updatedAt desc.
    editedRank: -new Date(f.updatedAt).getTime(),
    pinned: false,
    description: f.description,
});

export const updatePageOptions = (props: PageOptions) => {
    const { totalPages, hasNextPage, hasPrevPage, page, pageSize, totalItems } = props;
    const rangeStart = (page - 1) * pageSize + 1;
    const rangeEnd = Math.min(page * pageSize, totalItems);
    return {
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
        currentPage: page,
        pageSize,
        totalItems,
        rangeStart,
        rangeEnd,
    };
};


export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

let nextFieldOrder = 1

const blankOptions = () => [
    { id: uid("o"), label: "Option 1", value: "option-1" },
    { id: uid("o"), label: "Option 2", value: "option-2" },
];

export const blankField = (type: BlockType): BuilderField => {
    const meta = BLOCK_META[type];
    const placeholder = PREVIEW_PLACEHOLDER[type]
    const getOrder = () => {
        return nextFieldOrder++
    }

    if (LAYOUT_TYPES.includes(type)) {
        return {
            id: uid("q"),
            type: type as LayoutType,
            label: type === HEADING ? "A new section" : "page break",
            order: getOrder(),
        };
    }

    const base = {
        id: uid("q"),
        label: `Untitled ${meta?.label.toLowerCase() ?? "question"}`,
        description: "",
        helpText: "",
        required: false,
        order: getOrder(),
    };

    switch (type) {
        case "short_text":
        case "long_text":
        case "email":
        case "phone":
        case "url":
            return {
                ...base,
                type,
                placeholder,
                defaultValue: "",
                validation: { minLength: 2, maxLength: 255 },
            };

        case "number":
            return {
                ...base,
                type,
                placeholder,
                defaultValue: "",
                validation: { min: 0, max: 5, step: 1 },
            };

        case "rating":
            return {
                ...base,
                type,
                validation: { min: 0, max: 5, step: 1 },
            };

        case "single_select":
        case "radio":
            return { ...base, type, validation: {}, options: blankOptions() };

        case "multi_select":
        case "check_box":
            return { ...base, type, validation: {}, options: blankOptions() };

        case "date":
            return { ...base, type, defaultValue: "", validation: {} };

        case "file_upload":
            return {
                ...base,
                type,
                validation: { maxSizeMb: 10, maxFiles: 1, allowedFileTypes: [] },
            };

        default:
            throw new Error(`Unknown block type: ${type}`);
    }
}
