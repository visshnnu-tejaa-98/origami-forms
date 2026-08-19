import { HEADING, LAYOUT_TYPES, OPTION_TYPES, PAGE_BREAK } from "../../(main)/builder/constants";
import type { AnswerValue, FieldBlock } from "../../(main)/builder/types";
import type { Answers, PublicForm, PublicFormField, PublicStep } from "./types";

/** a saved field becomes the same block the builder and the preview render, so the public
 *  form paints with one set of input components rather than a second, drifting set */
export const toFieldBlock = (field: PublicFormField): FieldBlock => {
    const question = {
        id: field.id,
        type: field.type,
        label: field.label,
        description: field.description ?? "",
        order: field.order,
        helpText: field.helpText ?? "",
        required: field.required ?? false,
        // the column is loose jsonb; each field type narrows it back to its own shape
        validation: field.validation ?? {},
    };

    if (OPTION_TYPES.includes(field.type)) {
        return {
            ...question,
            options: Array.isArray(field.options) ? field.options : [],
        } as FieldBlock;
    }

    return {
        ...question,
        placeholder: field.placeholder ?? undefined,
        defaultValue: field.defaultValue ?? "",
    } as FieldBlock;
};

/** cover → every block in order → review */
export const toSteps = (form: PublicForm): PublicStep[] => {
    let page = 1;

    const middle: PublicStep[] = form.fields.flatMap((field): PublicStep[] => {
        if (field.type === HEADING) {
            return [
                {
                    kind: "heading",
                    id: field.id,
                    label: field.label,
                    description: field.description ?? undefined,
                },
            ];
        }
        if (field.type === PAGE_BREAK) {
            page += 1;
            return [{ kind: "page-break", id: field.id, label: field.label, page }];
        }
        if (LAYOUT_TYPES.includes(field.type)) return [];
        return [{ kind: "field", id: field.id, field: toFieldBlock(field) }];
    });

    return [{ kind: "cover" }, ...middle, { kind: "review" }];
};

/** every field type stores its answer as a string or a list of them */
export const isAnswered = (value: AnswerValue | undefined) =>
    Array.isArray(value) ? value.length > 0 : (value ?? "").trim() !== "";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** the same rules the field was configured with, checked before the sheet turns.
 *  the server re-checks what it stores — this is the friendly half, not the safe half. */
export const validateAnswer = (field: FieldBlock, value: AnswerValue | undefined): string | null => {
    const answered = isAnswered(value);

    if (!answered) return field.required ? "This one's required." : null;

    const rules = (field.validation ?? {}) as Record<string, number | string | undefined>;
    const text = Array.isArray(value) ? "" : (value ?? "").trim();
    const picked = Array.isArray(value) ? value : [];

    if (OPTION_TYPES.includes(field.type)) {
        const min = rules.minSelections as number | undefined;
        const max = rules.maxSelections as number | undefined;
        if (min !== undefined && picked.length < min) return `Pick at least ${min}.`;
        if (max !== undefined && picked.length > max) return `Pick no more than ${max}.`;
        return null;
    }

    switch (field.type) {
        case "email":
            return EMAIL_PATTERN.test(text) ? null : "That doesn't look like an email address.";

        case "url":
            return text.includes(" ") ? "A web address can't contain spaces." : null;

        case "number":
        case "rating": {
            const num = Number(text);
            if (Number.isNaN(num)) return "Numbers only, please.";
            const min = rules.min as number | undefined;
            const max = rules.max as number | undefined;
            if (min !== undefined && num < min) return `Has to be at least ${min}.`;
            if (max !== undefined && num > max) return `Has to be ${max} or less.`;
            return null;
        }

        default: {
            const minLength = rules.minLength as number | undefined;
            const maxLength = rules.maxLength as number | undefined;
            if (minLength !== undefined && text.length < minLength) {
                return `A little longer, please — at least ${minLength} characters.`;
            }
            if (maxLength !== undefined && text.length > maxLength) {
                return `A little shorter, please — ${maxLength} characters at most.`;
            }
            return null;
        }
    }
};

/** the payload the submit endpoint takes: one entry per answered field */
export const toSubmittedAnswers = (answers: Answers) =>
    Object.entries(answers)
        .filter(([, value]) => isAnswered(value))
        .map(([fieldId, value]) => ({ fieldId, value }));
