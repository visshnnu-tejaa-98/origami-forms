import { HEADING, LAYOUT_TYPES, OPTION_TYPES, PAGE_BREAK } from "~/app/(main)/builder/constants";
import type { AnswerValue, FieldBlock } from "~/app/(main)/builder/types";
import type { Answers, FlowBlock, FlowStep } from "./types";

export const buildSteps = <T extends FlowBlock>(
    blocks: T[],
    toField: (block: T) => FieldBlock,
): FlowStep[] => {
    let page = 1;

    const middle: FlowStep[] = blocks.flatMap((block): FlowStep[] => {
        if (block.type === HEADING) {
            return [
                {
                    kind: "heading",
                    id: block.id,
                    label: block.label,
                    description: block.description ?? undefined,
                },
            ];
        }

        if (block.type === PAGE_BREAK) {
            page += 1;
            return [{ kind: "page-break", id: block.id, label: block.label, page }];
        }

        if (LAYOUT_TYPES.includes(block.type)) return [];

        return [{ kind: "field", id: block.id, field: toField(block) }];
    });

    return [{ kind: "cover" }, ...middle, { kind: "review" }];
};

export const isAnswered = (value: AnswerValue | undefined): boolean =>
    Array.isArray(value) ? value.length > 0 : (value ?? "").trim() !== "";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
