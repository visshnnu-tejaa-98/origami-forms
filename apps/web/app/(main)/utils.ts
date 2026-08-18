import { RouterOutputs } from "@repo/trpc/client";
import { ICONS, TINTS } from "./constants";
import { NumberFieldValidation, PageOptions, Status } from "./types";
import { relativeTime } from "../utils";
import { BlockType, BuilderField, BuilderForm, LayoutType } from "./builder/types";
import {
    BLOCK_META,
    HEADING,
    LAYOUT_TYPES,
    OPTION_TYPES,
    PREVIEW_PLACEHOLDER,
} from "./builder/constants";

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
        (f.maxSubmissions ?? 0) > 0
            ? Math.min(100, Math.round((f.submissionCount / f.maxSubmissions!) * 100))
            : 0,
    edited: f.updatedAt ? relativeTime(f.updatedAt) : "just now",
    // Lower rank = more recent; the API already sorts by updatedAt desc.
    editedRank: f.updatedAt ? -new Date(f.updatedAt).getTime() : 0,
    pinned: false,
    description: f.description ?? "",
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

let nextFieldOrder = 1;

const blankOptions = () => [
    { id: uid("o"), label: "Option 1", value: "option-1" },
    { id: uid("o"), label: "Option 2", value: "option-2" },
];

export const blankField = (type: BlockType): BuilderField => {
    const meta = BLOCK_META[type];
    const placeholder = PREVIEW_PLACEHOLDER[type];
    const getOrder = () => {
        return nextFieldOrder++;
    };

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
};

type SavedForm = RouterOutputs["forms"]["getFormById"];
type ApiField = SavedForm["fields"][number];

/** a saved field becomes a canvas block: the database id *is* the block id, so a field
 *  keeps its identity across an edit and the server can tell an update from an insert */
const toBuilderField = (field: ApiField): BuilderField => {
    const block = {
        id: field.id,
        type: field.type,
        label: field.label,
        description: field.description ?? "",
        order: field.order,
    };

    if (LAYOUT_TYPES.includes(field.type)) return block as BuilderField;

    const question = {
        ...block,
        helpText: field.helpText ?? "",
        required: field.required ?? false,
        // the column is loose jsonb; each field type narrows it back to its own shape
        validation: field.validation ?? {},
    };

    if (OPTION_TYPES.includes(field.type)) {
        return {
            ...question,
            options: Array.isArray(field.options) ? field.options : [],
        } as BuilderField;
    }

    return {
        ...question,
        placeholder: field.placeholder ?? undefined,
        defaultValue: field.defaultValue ?? "",
    } as BuilderField;
};

/** seeds the studio from a saved form */
export const toBuilderForm = (form: SavedForm): BuilderForm => ({
    title: form.title,
    description: form.description ?? "",
    visibility: form.visibility,
    maxSubmissions: form.maxSubmissions ?? undefined,
    fields: form.fields.map(toBuilderField),
});

export const estimatedTimeToCompleteForm = (fields: number) => {
    if (fields <= 5) return "less than a minute";
    if (fields <= 10) return `about a minute`;
    if (fields <= 20) return `about 2 min`;
    if (fields <= 30) return `about 3 min`;
    return `couple of minutes`;
};

export const previewNumberNote = (fieldValidations: NumberFieldValidation) => {
    let parts: string[] = [];
    if (fieldValidations.min !== undefined && fieldValidations.min !== 0) {
        parts.push(`min ${fieldValidations.min}`);
    }
    if (fieldValidations.max !== undefined) {
        parts.push(`max ${fieldValidations.max}`);
    }
    if (fieldValidations.step !== undefined && fieldValidations.step !== 1) {
        parts.push(`step ${fieldValidations.step}`);
    }
    return parts.join(" • ");
};